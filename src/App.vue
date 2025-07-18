<template>
  <div v-show="windowWidth > 700 && !isNoHeaderAndFooterUrl">
    <NavBar />
  </div>
  <main class="display-flex flex-direction-col main">
    <CurrencyDashboard
      v-if="route.fullPath.indexOf('/k/') !== -1 && windowWidth > 700 && currencyDashboardSwitch"
    />
    <section
      :class="
        route.fullPath.indexOf('/k/') !== -1 && windowWidth > 700
          ? 'content-app display-flex align-items-fs'
          : 'content-app'
      "
      v-if="routerState"
    >
      <LeftSideBar v-if="route.fullPath.indexOf('/k/') !== -1 && windowWidth > 700" />
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.path" />
        </keep-alive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path" />
      </router-view>
    </section>
    <FooterBar v-if="windowWidth > 700 && !isNoHeaderAndFooterUrl" />
  </main>
  <Loading v-if="tgWebAppData && isTradeUrl"></Loading>
  <vue-danmaku
    ref="danmaku"
    v-model:danmus="danmus"
    useSlot
    isSuspend
    randomChannel
    :speeds="80"
    :channels="5"
    class="danmaku-box"
    style="pointer-events: none"
  >
    <template v-slot:dm="{ danmu }">
      <div class="danmaku-item display-flex align-items-center">
        <a
          :href="`https://x.com/${danmu.smartWallet.twitterUsername}`"
          class="display-flex align-items-center"
          target="_blank"
        >
          <el-image :src="danmu.smartWallet.avatar" alt="" class="danmaku-avatar">
            <template #error>
              <img src="@/assets/icons/logo1.svg" alt="" class="danmaku-avatar" />
            </template>
          </el-image>
          <span class="twitterName">{{ danmu.smartWallet.twitterName }}</span>
        </a>
        <img
          src="@/assets/icons/copy.svg"
          alt=""
          class="copy"
          v-copy="[danmu.smartWallet.walletAddress, '钱包地址已复制']"
        />
        <span @click="handelRoute(danmu)"
          >&nbsp;{{ danmu.transaction.flag ? '卖出' : '买入' }}&nbsp;<i
            :class="danmu.transaction.flag ? 'down-color num-txt' : 'up-color num-txt'"
            >{{ numberFormat(danmu.transaction.amount || 0) }} &nbsp;{{
              danmu.transaction.symbol
            }}</i
          >，交易额&nbsp;<i
            :class="danmu.transaction.flag ? 'down-color num-txt' : 'up-color num-txt'"
            >${{ numberFormat(danmu.transaction.volume || 0) }}</i
          ></span
        >
      </div>
    </template>
  </vue-danmaku>
  <LoopFloatingWindow />
</template>
<script setup>
import { ref, onMounted, provide, nextTick, computed, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/hooks/useTheme'
import { useI18n } from 'vue-i18n'
import { browserLang, numberFormat } from '@/utils'
import { QUICK_TRADE_CONFIG } from '@/types'

import { socket } from '@/utils/socket'
import Loading from '@/components/Loading/index.vue'
import NavBar from '@/components/SideBar/NavBar.vue'
import FooterBar from '@/components/SideBar/FooterBar.vue'
import LeftSideBar from '@/components/SideBar/LeftSideBar.vue'
import CurrencyDashboard from '@/components/Charts/CurrencyDashboard.vue'

import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { showToast } from 'vant'
import vueDanmaku from 'vue3-danmaku'
import { APIgetTokensByWalletAddr } from '@/api'
import { createAppKit } from '@reown/appkit/vue'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

import { solana } from '@reown/appkit/networks'
import { mainnet, bsc, arbitrum, xLayer, base, optimism } from '@reown/appkit/networks'

import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { customMessage } from '@/utils/message'
import LoopFloatingWindow from './LoopFloatingWindow.vue'

const { windowWidth } = useWindowWidth()

const danmus = ref([])

const telegram__initParams = sessionStorage.getItem('__telegram__initParams')
const tgWebAppData = (telegram__initParams && JSON.parse(telegram__initParams)?.tgWebAppData) || ''

/**
 * @description: tg webview 运行环境判断
 */
if (
  typeof window.TelegramWebview !== 'undefined' ||
  typeof window.TelegramWebviewProxy !== 'undefined' ||
  typeof window.TelegramWebviewProxyProto !== 'undefined'
) {
  showToast('请复制链接在系统浏览器打开本网址')
}

const route = useRoute()
const router = useRouter()

const globalStore = useGlobalStore()
const chain = useChainConfigsStore()
const chainConfigs = computed(() => chain.chainConfigs)

const accountInfo = computed(() => globalStore.accountInfo)
const chainId = computed(() => globalStore.walletInfo.chainId)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const address = computed(() => globalStore.walletInfo.address)
const walletType = computed(() => globalStore.walletInfo.walletType)
const customWalletInfo = computed(() => globalStore.customWalletInfo)

const danmaku = computed(() => globalStore.danmaku)
const currencyDashboardSwitch = computed(() => globalStore.currencyDashboardSwitch)

const isTradeUrl = computed(() => {
  return window.location.href.indexOf('/trade/') !== -1
})

const isNoHeaderAndFooterUrl = computed(() => {
  return (
    window.location.href.indexOf('/Refer') !== -1 || window.location.href.indexOf('/kline/') !== -1
  )
})
// init theme
const { initTheme } = useTheme()
initTheme()

// init language
const i18n = useI18n()
const routerState = ref(true)
const danmakuFun = () => {
  if (danmaku.value) {
    socket.off('smartWalletDanmaku')
    socket.on('smartWalletDanmaku', (message) => {
      const data = JSON.parse(message)
      // console.log(`socket-danmaku:`, data)
      danmus.value.push(data)
    })
  } else {
    socket.off('smartWalletDanmaku')
  }
}

const getTokenData = async () => {
  const params =
    walletType.value == 'Email'
      ? {
          chainCode: customWalletInfo.value.chainCode,
          walletAddress: customWalletInfo.value.walletInfo?.wallet,
          walletId: customWalletInfo.value.walletInfo?.walletId
        }
      : {
          chainCode: chainConfigs.value.find((item) => item.chainId == chainId.value)?.chainCode,
          walletAddress: address.value
        }
  const res = await APIgetTokensByWalletAddr(params)

  globalStore.setTokenList(res || [])
}

danmakuFun()

watch(danmaku, () => {
  danmakuFun()
})

watch(accountInfo, (newValue) => {
  if (accountInfo.value) {
    globalStore.setWalletInfo({
      address: null,
      isConnected: true,
      chainId: null,
      walletType: 'Email'
    })
  }
})

onMounted(async () => {
  const config = localStorage.getItem('quick_trade_config')
  const language = globalStore.language ?? browserLang()
  i18n.locale.value = language
  globalStore.setLanguage(language)
  if (accountInfo.value) {
    globalStore.setWalletInfo({
      address: null,
      isConnected: true,
      chainId: null,
      walletType: 'Email'
    })
  }
  if (!config) {
    localStorage.setItem('quick_trade_config', JSON.stringify(QUICK_TRADE_CONFIG))
  }

  initTokenData()
  setInterval(() => {
    initTokenData()
  }, 3000)
})

const initTokenData = () => {
  if (!isConnected.value) return

  if (walletType.value == 'Email') {
    if (customWalletInfo.value.walletInfo?.wallet) {
      getTokenData()
    }
  } else {
    getTokenData()
  }
}

// 页面全局loading
let loading = true
const loadPromise = new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve(false)
  }, 2000)
})

loadPromise.then((val) => {
  loading = val
  const canvasBox = document.getElementById('canvas-box')
  const leftSideBarLogo = document.getElementById('leftSideBarLogo')
  const miniLeftSideBarLogo = document.getElementById('miniLeftSideBarLogo')
  if (!loading) {
    canvasBox?.classList.add('fadeOut')
    leftSideBarLogo?.classList.add('scaleElement')
    miniLeftSideBarLogo?.classList.add('scaleElement')
    canvasBox?.addEventListener('animationend', function () {
      leftSideBarLogo?.classList.add('scaleElement')
      miniLeftSideBarLogo?.classList.add('scaleElement')
      this.remove()
    })
  }
})

const reload = () => {
  routerState.value = false
  // console.log(false)
  nextTick(() => {
    routerState.value = true
    // console.log(true)
  })
}

provide('reload', { reload })

/********************  Connect Wallet 配置 ********************/

// 0. Create the Ethers adapter
const ethersAdapter = new EthersAdapter()

// 1. Create Solana adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
})

// 2. Get projectId from https://cloud.reown.com
const projectId = '0994d604ea8f67806c1604de2ab87feb' // projectId

// 3. Set up the metadata - Optional
const metadata = {
  name: 'HelloDex',
  description: 'HelloDex',
  url: 'https://hellodex.io',
  icons: ['@/assets/icons/logo.svg']
}

// 4. Create the AppKit instance
createAppKit({
  metadata,
  projectId,
  adapters: [ethersAdapter, solanaWeb3JsAdapter],
  networks: [mainnet, bsc, arbitrum, xLayer, base, optimism, solana],
  allWallets: 'SHOW',
  enableWalletConnect: true,
  features: {
    analytics: true,
    socials: false,
    email: false
  }
})

const handelRoute = (danmu) => {
  window.open(`/k/${danmu.transaction.pairAddress}?chainCode=${danmu.transaction.chainCode}`)
}
</script>
<style lang="scss">
.danmaku-box {
  position: fixed !important;
  top: 80px;
  width: 100%;
  height: 300px;
  z-index: 999;
  overflow: hidden;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  .danmus {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    -webkit-user-select: none;
    user-select: none;
    .danmaku-item {
      pointer-events: auto;
      color: #f5f5f5;
      cursor: pointer;
      font-size: 14px;
      padding: 12px;
      border-radius: 100px;
      background-color: var(--hover-bg-color);
    }
    .num-txt {
      font-style: normal;
    }
    .twitterName {
      color: #f5f5f5;
    }
    .copy {
      width: 13px;
      height: 13px;
      margin: 0 3px;
    }
    .danmaku-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
}
w3m-modal {
  z-index: 9999999;
}
.main {
  width: 100%;
}
.content-app {
  width: 100%;
}

.fadeOut {
  animation: fadeOutAnimation 0.8s ease-in forwards;
}

@keyframes fadeOutAnimation {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.scaleElement {
  animation: scaleAnimation 0.5s ease forwards;
}

@keyframes scaleAnimation {
  from {
    transform: scale(0);
    width: 0;
  }
  to {
    transform: scale(1);
    width: 100%;
  }
}

@media (max-width: 700px) {
  body {
    background-color: #fff;
  }
  .main {
    margin: 0 auto;
  }
  .content-app {
    width: 100%;
    height: 100vh;
  }
  @keyframes fall {
    0% {
      background-color: transparent;
    }
    20% {
      background: linear-gradient(90deg, #fff, #f4afc3);
    }
    40% {
      background: linear-gradient(90deg, #fff, #f4afc3);
    }
    60% {
      background: linear-gradient(90deg, #fff, #f4afc3);
    }
    80% {
      background: linear-gradient(90deg, #fff, #f4afc3);
    }
    100% {
      background-color: transparent;
    }
  }
  @-webkit-keyframes fall /* Safari and Chrome */ {
    0% {
      background-color: transparent;
    }
    20% {
      background: linear-gradient(90deg, #fff, #f4afc3);
    }
    40% {
      background: linear-gradient(90deg, #fff, #f4afc3);
    }
    60% {
      background: linear-gradient(90deg, #fff, #f4afc3);
    }
    80% {
      background: linear-gradient(90deg, #fff, #f4afc3);
    }
    100% {
      background-color: transparent;
    }
  }

  @keyframes rise {
    0% {
      background-color: transparent;
    }
    20% {
      background: linear-gradient(90deg, #fff, #b0f3e9);
    }
    40% {
      background: linear-gradient(90deg, #fff, #b0f3e9);
    }
    60% {
      background: linear-gradient(90deg, #fff, #b0f3e9);
    }
    80% {
      background: linear-gradient(90deg, #fff, #b0f3e9);
    }
    100% {
      background-color: transparent;
    }
  }

  @-webkit-keyframes rise /* Safari and Chrome */ {
    0% {
      background-color: transparent;
    }
    20% {
      background: linear-gradient(90deg, #fff, #b0f3e9);
    }
    40% {
      background: linear-gradient(90deg, #fff, #b0f3e9);
    }
    60% {
      background: linear-gradient(90deg, #fff, #b0f3e9);
    }
    80% {
      background: linear-gradient(90deg, #fff, #b0f3e9);
    }
    100% {
      background-color: transparent;
    }
  }
}
</style>
