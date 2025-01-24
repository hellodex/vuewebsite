<template>
  <TonConnectUIProvider :options="options">
    <div v-show="windowWidth >= 1144 && route.name !== 'Refer'">
      <NavBar />
    </div>
    <main class="display-flex flex-direction-col main">
      <section
        :class="
          route.fullPath.indexOf('/k/') !== -1 && windowWidth >= 1144
            ? 'content-app display-flex align-items-fs'
            : 'content-app'
        "
        v-if="routerState"
      >
        <LeftSideBar v-if="route.fullPath.indexOf('/k/') !== -1 && windowWidth >= 1144" />
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" v-if="route.meta.keepAlive" :key="route.path" />
          </keep-alive>
          <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path" />
        </router-view>
      </section>
      <FooterBar v-if="windowWidth >= 1144 && route.name !== 'Refer'" />
    </main>
    <Loading v-if="tgWebAppData && isTradeUrl"></Loading>
  </TonConnectUIProvider>
</template>
<script setup>
import { ref, onMounted, provide, nextTick, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useTheme } from '@/hooks/useTheme'
import { useI18n } from 'vue-i18n'
import { browserLang } from '@/utils'
import { socket } from '@/utils/socket'
import Loading from '@/components/Loading/index.vue'
import NavBar from '@/components/SideBar/NavBar.vue'
import FooterBar from '@/components/SideBar/FooterBar.vue'
import LeftSideBar from '@/components/SideBar/LeftSideBar.vue'
import { TonConnectUIProvider, THEME } from '@townsquarelabs/ui-vue'
import { useGlobalStore } from '@/stores/global'
import { useWindowWidth } from '@/hooks/useWindowWidth'

import { createAppKit } from '@reown/appkit/vue'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { mainnet, bsc, arbitrum, xLayer, base, optimism } from '@reown/appkit/networks'

import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

const { windowWidth } = useWindowWidth()
const telegram__initParams = sessionStorage.getItem('__telegram__initParams')
const tgWebAppData = (telegram__initParams && JSON.parse(telegram__initParams)?.tgWebAppData) || ''

const options = {
  manifestUrl: 'https://hellodex.io/tonconnect-manifest.json',
  uiPreferences: { theme: THEME.DARK },
  actionsConfiguration: {
    twaReturnUrl: 'https://t.me/hellodex_bot' // 钱包连接后将用户重定向到Telegram Mini App
  }
}

const route = useRoute()

const globalStore = useGlobalStore()

const isTradeUrl = computed(() => {
  return window.location.href.indexOf('/trade/') !== -1
})
// init theme
const { initTheme } = useTheme()
initTheme()

// init language
const i18n = useI18n()
const routerState = ref(true)
onMounted(async () => {
  const language = globalStore.language ?? browserLang()
  i18n.locale.value = language
  globalStore.setLanguage(language)
  sessionStorage.setItem('language', language)
  if (globalStore.accountInfo) {
    globalStore.setWalletInfo({
      address: null,
      isConnected: true,
      chainId: null,
      walletType: 'Email'
    })
  }
})

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
  console.log(false)
  nextTick(() => {
    routerState.value = true
    console.log(true)
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
  name: 'Hello Dex',
  description: 'Hello Dex!',
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
  features: {
    analytics: true,
    socials: false,
    email: false
  }
})
</script>
<style lang="scss">
w3m-modal {
  z-index: 9999999;
}
.main {
  width: 100%;
  background-color: var(--bg-color);
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

@media (max-width: 1143px) {
  body {
    background-color: #fff;
  }
  .main {
    // width: 10rem;
    margin: 0 auto;
    background-color: #fff;
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
