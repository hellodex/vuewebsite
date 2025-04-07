<template>
  <section class="h5home-content animation-bg">
    <van-sticky>
      <div class="h5home-title display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center">
          <svg-icon
            name="h5-settings-01"
            class="settings-01"
            @click="router.push('/Setting')"
          ></svg-icon>
          <div class="search" @click="handelSearch">
            <svg-icon name="h5-search-md" class="search-md"></svg-icon>
            <span>{{ i18n.t('enterTokenNameContract') }}</span>
          </div>
        </div>

        <svg-icon
          name="download-01"
          class="download-01"
          @click="router.push('/Download')"
        ></svg-icon>
        <!-- <van-badge :content="5">
          <svg-icon name="h5-vector" class="vector"></svg-icon>
        </van-badge>
        <svg-icon name="h5-service" class="service"></svg-icon>
        <svg-icon name="h5-create_wallet" class="create_wallet"></svg-icon> -->
      </div>
    </van-sticky>
    <section class="h5home-content-mian">
      <van-swipe
        class="home-swipe"
        :style="{ height: tgWebAppData ? '16vh' : '4rem' }"
        :autoplay="3000"
        indicator-color="white"
      >
        <van-swipe-item v-for="image in images" :key="image.id">
          <a :href="image.url" target="_blank">
            <img :src="image.logo" class="home-banner" />
          </a>
        </van-swipe-item>
      </van-swipe>
      <div class="menu-box">
        <div class="menu-item">
          <span class="menu-txt">${{ numberFormat(feeVolume) }}</span>
          <span>平台收入</span>
        </div>
        <div class="menu-item" @click="handelInvite">
          <svg-icon name="h5-invite" class="menu-svg"></svg-icon>
          <span>邀请返佣</span>
        </div>
        <!-- -->
        <div class="menu-item" @click="router.push('/Ido')">
          <svg-icon name="h5-token" class="menu-svg"></svg-icon>
          <span>平台币预售</span>
        </div>
        <div class="menu-item" @click="handelOpenWindow('http://lnk.bio/HelloDex')">
          <svg-icon name="h5-shield-tick" class="menu-svg"></svg-icon>
          <span>{{ i18n.t('home.ContractAudit') }}</span>
        </div>
        <div class="menu-item" @click="handelOpenWindow('https://hellodex.gitbook.io/hellodex')">
          <svg-icon name="h5-book-closed" class="menu-svg"></svg-icon>
          <span>{{ i18n.t('home.Whitepaper') }}</span>
        </div>
      </div>
      <div class="core-chain">
        <div class="core-chain-item" @click="handelJump(btcData)">
          <div class="core-chain-trend">
            <svg-icon name="coinBTC" class="chain-svg"></svg-icon>
            <div class="trend">
              <span class="chain-name">BTC</span>

              <svg-icon
                name="h5-arrow-up-right"
                class="arrow-svg up"
                v-if="btcData.chg > 0"
              ></svg-icon>
              <svg-icon name="h5-arrow-down-right" class="arrow-svg down" v-else></svg-icon>
              <span :class="btcData.chg > 0 ? 'up' : 'down'">{{ btcData.chg }}%</span>
            </div>
          </div>
          <span :class="btcData.chg > 0 ? 'core-chain-price up' : 'core-chain-price down'"
            >${{ numFormat(parseFloat(btcData.price || 0).toFixed(2)) }}</span
          >
        </div>
        <div class="core-chain-item" @click="handelJump(ethData)">
          <div class="core-chain-trend">
            <svg-icon name="coinETH" class="chain-svg"></svg-icon>
            <div class="trend">
              <span class="chain-name">ETH</span>
              <svg-icon
                name="h5-arrow-up-right"
                class="arrow-svg up"
                v-if="ethData.chg > 0"
              ></svg-icon>
              <svg-icon name="h5-arrow-down-right" class="arrow-svg down" v-else></svg-icon>
              <span :class="ethData.chg > 0 ? 'up' : 'down'">{{ ethData.chg }}%</span>
            </div>
          </div>
          <span :class="ethData.chg > 0 ? 'core-chain-price up' : 'core-chain-price down'"
            >${{ numFormat(parseFloat(ethData.price || 0).toFixed(2)) }}</span
          >
        </div>
        <div class="core-chain-item">
          <div class="core-chain-trend chain-dex">
            <svg-icon name="coinDEX" class="chain-svg"></svg-icon>
            <div class="trend">
              <span class="chain-name" style="margin-right: 0">{{ i18n.t('h5.Hold') }}</span>
              <span class="chain-code up">{{ i18n.t('h5.GovernanceToken') }}</span>
            </div>
          </div>
          <span class="chain-dex-txt">{{ i18n.t('h5.platformIncome') }}</span>
        </div>
      </div>
      <div class="tabs-box">
        <van-tabs
          v-model:active="active"
          title-inactive-colo="#9C9C9C"
          title-active-color="#202020"
          sticky
          :before-change="beforeChange"
        >
          <van-tab v-for="item in tabsList" :title="item.name" :key="item.id">
            <CoinItem :list="listData" @handelItemClick="handelJump" />
          </van-tab>
        </van-tabs>
      </div>
    </section>
  </section>
  <Tabbar :active="0" />
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  watch,
  computed
} from 'vue'
import { useRouter } from 'vue-router'
import { showLoadingToast, closeToast, showToast } from 'vant'
import { getAppHome, getAppRankings, getAppPriceListByPairAddress, APIgetFeeVolume } from '@/api'
import { useGlobalStore } from '@/stores/global'
import { dataAssembly, numFormat, numberFormat } from '@/utils'
import CoinItem from '@/adapter/components/H5CoinItem.vue'
import Tabbar from '@/components/SideBar/Tabbar.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const globalStore = useGlobalStore()
const router = useRouter()

const walletType = computed(() => globalStore.walletInfo.walletType)
const isConnected = computed(() => globalStore.walletInfo.isConnected)

const telegram__initParams = sessionStorage.getItem('__telegram__initParams')
const tgWebAppData = (telegram__initParams && JSON.parse(telegram__initParams)?.tgWebAppData) || ''

const images = ref<any>([])
const configs = ref<any>({})
const tabsList = ref<any>([])
const tabsContent = reactive<any>({})
const tabsId = ref<number>(0)
const active = ref<number>(0)
const listData = ref<any>([])
const btcData = ref<any>({})
const ethData = ref<any>({})
const timer = ref<any>(null) // 定时器
const feeVolume = ref<any>(0)

const getHomeData = async () => {
  const res: any = await getAppHome({
    version: 1.0
  })
  images.value = res?.ad || []
  configs.value = res?.configs || {}
  const list = res?.token || []
  tabsList.value = list
  tabsId.value = list[0].id
  getAppRankingsData()

  const resFee: any = await APIgetFeeVolume()
  feeVolume.value = resFee?.fee || 0
}

const getAppRankingsData = async () => {
  const res: any = await getAppRankings({
    type: tabsId.value
  })
  tabsContent[tabsId.value] = res
  getPriceList()
}

const getPriceList = async () => {
  const arr =
    tabsContent[tabsId.value]?.map(
      (item: { pairAddress: string; chainCode: string }) => `${item.pairAddress}-${item.chainCode}`
    ) || []
  const res: any = await getAppPriceListByPairAddress({
    ids: [
      ...arr,
      '0x46cf1cf8c69595804ba91dfdd8d6b960c9b0a7c4-BSC',
      '0x11b815efb8f581194ae79006d24e0d814b7697f6-ETH'
    ]
  })
  btcData.value = {
    ...res?.find(
      (item: { pairAddress: string }) =>
        item.pairAddress == '0x46cf1cf8c69595804ba91dfdd8d6b960c9b0a7c4'
    ),
    chainCode: 'BSC'
  }

  ethData.value = {
    ...res?.find(
      (item: { pairAddress: string }) =>
        item.pairAddress == '0x11b815efb8f581194ae79006d24e0d814b7697f6'
    ),
    chainCode: 'ETH'
  }
  const list = res.filter(
    (item: { pairAddress: string }) =>
      ![
        '0x46cf1cf8c69595804ba91dfdd8d6b960c9b0a7c4',
        '0x531febfeb9a61d948c384acfbe6dcc51057aea7e'
      ].includes(item.pairAddress)
  )
  listData.value = dataAssembly(tabsContent[tabsId.value], list).map((item) => {
    return {
      logo: item.logo,
      chainCode: item.chainCode,
      baseTokenSymbol: item.baseToken?.symbol || '-',
      quoteTokenSymbol: item.quoteToken?.symbol || '-',
      pairAddress: item.pairAddress,
      tradeTvl: item.priceByPairAddress.tradeTvl,
      tvl: item.priceByPairAddress.tvl,
      price: item.priceByPairAddress.price,
      chg: item.priceByPairAddress.chg
    }
  })
}
const handelOpenWindow = (url: string) => {
  window.open(url)
}

const beforeChange = (index: string | number): boolean | Promise<boolean> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: i18n.t('h5.loading')
    })
    const list = tabsList.value
    tabsId.value = list[index].id
    await getAppRankingsData()
    resolve(true)
    closeToast()
  })
}

const handelSearch = () => {
  router.push('/Search')
}

const handelJump = (item: any) => {
  router.push(`/k/${item.pairAddress}?chainCode=${item.chainCode}`)
}

const handelInvite = () => {
  if (!isConnected.value) {
    router.push('/h5/signIn')
    return
  }

  if (isConnected.value && walletType.value == 'Email') {
    router.push('/h5/inviteRebate')
    return
  }

  if (isConnected.value && walletType.value != 'Email') {
    showToast('您当前连接的是Web3钱包，请连接账户模式钱包参与邀请返佣活动！')
    return false
  }
}

watch(
  () => listData.value,
  (newVal, oldVal) => {
    lastComparedToCurrent(newVal, oldVal)
  }
)

onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
  timer.value = setInterval(() => {
    getPriceList()
  }, 3000)
})

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  clearInterval(timer.value)
})

onMounted(() => {
  getHomeData()
  getPriceList()
})

onUnmounted(() => {
  clearInterval(timer.value)
})

/**
 *
 * @param currentData 当前请求的数据
 * @param lastData  上次请求缓存的数据
 *
 * @returns currentData 返回当前请求的数据
 */
function lastComparedToCurrent(currentData: any[] = [], lastData: any[] = []) {
  currentData.forEach((item: any) => {
    lastData.forEach((itm: any) => {
      if (itm.pairAddress == item.pairAddress) {
        if (parseFloat(item.chg) > parseFloat(itm.chg)) {
          item.riseAndFall = 'rise'
        } else if (parseFloat(item.chg) < parseFloat(itm.chg)) {
          item.riseAndFall = 'fall'
        }
      }
    })
  })
}
</script>

<style scoped lang="scss">
.h5home-content {
  padding-bottom: var(--van-tabbar-height);

  .h5home-title {
    height: 1.2267rem;
    padding: 0.2133rem 0.4267rem;
    box-sizing: border-box;
    background-color: #ffffff;
    .settings-01,
    .service,
    .create_wallet,
    .download-01 {
      width: 0.5867rem;
      height: 0.5867rem;
      color: #202020;
      cursor: pointer;
    }
    .settings-01 {
      margin-right: 0.2133rem;
    }
    .search {
      width: 7.3rem;
      height: 0.8rem;
      padding: 0.16rem 0 0.16rem 0.2133rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 133.32rem;
      .search-md {
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.32rem;
        color: #9c9c9c;
      }
      span {
        font-size: 0.32rem;
        color: #9c9c9c;
      }
    }
    .vector {
      width: 0.4587rem;
      height: 0.5429rem;
      position: relative;
      top: 0.0667rem;
    }
  }
  .home-swipe {
    margin: 0 auto;
    width: 9.5467rem;
    .home-banner {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }
  .menu-box {
    padding: 0 0.4267rem;
    margin: 0.32rem 0 0.4267rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .menu-svg {
      width: 0.7467rem;
      height: 0.7467rem;
      margin-bottom: 0.16rem;
      color: #555;
    }
    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      span {
        color: #555;
        font-size: 0.32rem;
      }
      .menu-txt {
        width: 100%;
        height: 0.7467rem;
        text-align: center;
        margin-bottom: 0.16rem;
        padding-top: 0.16rem;
        color: var(--up-color);
      }
    }
  }
  .core-chain {
    padding: 0 0.4267rem;
    margin-bottom: 0.4267rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .core-chain-item {
      width: 2.9333rem;
      cursor: pointer;
    }
    .core-chain-item:last-child {
      width: 2.7333rem;
    }
    .core-chain-trend,
    .trend {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .chain-dex {
      justify-content: space-between;
    }
    .chain-svg {
      width: 0.5333rem;
      height: 0.5333rem;
      border-radius: 50%;
    }
    .chain-coinDEX {
      width: 0.5067rem;
      height: 0.5067rem;
    }
    .arrow-svg {
      width: 0.2133rem;
      height: 0.2133rem;
    }
    .core-chain-price {
      font-size: 0.4267rem;
    }
    .trend span {
      font-size: 0.2667rem;
    }
    .trend .chain-name {
      font-size: 0.3733rem;
      margin: 0 0.1067rem;
      color: #202020;
    }
    .trend .chain-code,
    .chain-dex-txt {
      font-size: 0.3733rem;
    }
    .chain-dex-txt {
      display: block;
      // margin-top: 0.0533rem;
      color: #202020;
    }
    .up {
      color: var(--up-color);
    }
    .down {
      color: var(--down-color);
    }
  }

  :deep(.van-tabs__line) {
    background-color: #202020;
  }
  :deep(.van-tab__text) {
    font-size: 0.4267rem;
  }
}
</style>
