<template>
  <div class="coinWalletDetails">
    <div class="coinWalletDetails-content display-flex align-items-fs">
      <!-- 币信息 -->
      <section
        class="coinWalletDetails-section"
        :style="{ width: `calc(100vw - 296px - ${switchLeftState ? '296px' : '0px'})` }"
      >
        <BaseInfo
          :baseInfo="baseInfo"
          :pairInfo="rightSideBarInfo.pairInfo"
          :pondTabInfo="pondTabInfo"
          :holdingCoinsTabInfo="holdingCoinsTabInfo"
        />
        <!-- K线 -->
        <el-scrollbar>
          <div class="coinWalletDetails-section-main">
            <div class="tradingViewLoading" id="trading-view-box">
              <el-skeleton
                style="width: 100%; height: 100%"
                :loading="baseInfo.tradingLoading"
                animated
              >
                <template #template>
                  <el-skeleton-item variant="caption" style="width: 100%; height: 100%" />
                </template>
                <template #default>
                  <TradingView v-if="!baseInfo.tradingLoading" />
                </template>
              </el-skeleton>
            </div>
            <div class="resize-box" id="resize-box">
              <div class="resize-line"></div>
            </div>
            <!-- 池子、交易、转账、持币、资金、我的 -->
            <div class="coinWallet-tabs-box">
              <div class="coinWallet-tabs-head">
                <div class="coinWallet-tabs-item display-flex align-items-center">
                  <span
                    :class="activeName == item.code ? 'active' : ''"
                    v-for="item in coinWalletTabs"
                    :key="item.code"
                    @click="handleTabClick(item)"
                    >{{ item.name }}</span
                  >
                </div>
                <!-- <div class="refresh-box">
                  <RefreshHold v-if="activeName == 'seven'" />
                </div> -->
                <span class="transaction-tab-pause-txt" v-if="pauseType == 1">⏸ 已暂停</span>
                <div
                  class="data-items display-flex align-items-center"
                  v-if="activeName == 'seven'"
                >
                  <span style="margin-right: 4px">只显示k线币仓位</span>
                  <el-switch
                    v-model="onlyKlinePosition"
                    @change="handelOnlyKlinePosition"
                    size="small"
                    :active-value="1"
                    :inactive-value="0"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #26282c"
                  />
                </div>
                <div
                  class="data-items display-flex align-items-center"
                  v-if="activeName == 'seven'"
                >
                  <span style="margin-right: 4px">隐藏小金额</span>
                  <el-switch
                    v-model="hidePosition"
                    @change="handelHidePosition"
                    size="small"
                    :active-value="1"
                    :inactive-value="0"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #26282c"
                  />
                </div>
                <div class="data-items display-flex align-items-center">
                  <span style="margin-right: 4px">弹幕</span>
                  <el-switch
                    v-model="danmaku"
                    @change="handelSwitchDanmaku"
                    :active-value="1"
                    :inactive-value="0"
                    size="small"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #26282c"
                  />
                </div>
                <div class="data-items display-flex align-items-center">
                  <span style="margin-right: 4px">快捷交易</span>
                  <el-switch
                    v-model="config.switch"
                    @change="handelClose"
                    size="small"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #26282c"
                  />
                </div>
                <div class="data-items display-flex align-items-center" v-if="activeName == 'five'">
                  <div
                    :class="fundIndex == item.id ? 'item item-active' : 'item'"
                    v-for="item in fundData"
                    :key="item.id"
                    @click="handelfundSelect(item)"
                  >
                    {{ item.timeLabel }}
                  </div>
                </div>
              </div>
              <div class="coinWallet-tabs-content">
                <PondTab :pondTabInfo="pondTabInfo" v-if="activeName == 'first'" />
                <TransactionTab
                  v-else-if="activeName == 'second'"
                  :baseInfo="baseInfo"
                  @pauseAndPlay="handelPauseAndPlay"
                />
                <!-- <TransferAccountsTab
                  v-else-if="activeName == 'third'"
                  :transferAccountsTabInfo="transferAccountsTabInfo"
                  :baseInfo="baseInfo"
                /> -->
                <HoldingCoinsTab
                  v-else-if="activeName == 'fourth'"
                  @topSelect="handelTopSelect"
                  :holdingCoinsTabInfo="holdingCoinsTabInfo"
                />
                <FundTab
                  v-else-if="activeName == 'five'"
                  :flowGroupInfo="flowGroupInfo"
                  :listPeriodInfo="listPeriodInfo"
                  :topNetInfo="topNetInfo"
                  :topProfitInfo="topProfitInfo"
                  @buyingSellingTopSelect="handelBuyingSellingTopSelect"
                />
                <!-- <MyCoinTab v-else-if="activeName == 'six'" :myCoinTabInfo="myCoinTabInfo" /> -->
                <MyHold
                  v-else-if="activeName == 'seven'"
                  :list="initLimitedOrders.positions"
                  :skeleton="skeleton"
                />
                <CurrentCommission
                  v-else-if="activeName == 'eight'"
                  :list="initLimitedOrders.openingOrders"
                  :skeleton="skeleton"
                />
                <TransactionHistory
                  v-else-if="activeName == 'nine'"
                  :list="initLimitedOrders.orders"
                  :skeleton="skeleton"
                />
                <CommissionHistory
                  v-else-if="activeName == 'ten'"
                  :list="initLimitedOrders.historyOrders"
                  :skeleton="skeleton"
                />
              </div>
            </div>
          </div>
        </el-scrollbar>
        <el-tooltip
          class="box-item"
          :auto-close="1000"
          :content="switchLeftState ? '隐藏榜单区' : '显示榜单区'"
          effect="light"
          placement="right"
        >
          <div class="switch-ele-left switch-ele" @click="switchLeftState = !switchLeftState">
            <el-icon v-if="switchLeftState" color="#101114"><ArrowLeft /></el-icon>
            <el-icon v-else color="#101114"><ArrowRight /></el-icon>
          </div>
        </el-tooltip>
        <!-- <el-tooltip
          class="box-item"
          effect="light"
          :auto-close="1000"
          :content="switchRightState ? '隐藏交易区' : '显示交易区'"
          placement="left"
        >
          <div class="switch-ele-right switch-ele" @click="switchRightState = !switchRightState">
            <el-icon v-if="switchRightState"><ArrowRight /></el-icon>
            <el-icon v-else><ArrowLeft /></el-icon>
          </div>
        </el-tooltip> -->
      </section>
      <!-- 右边栏钱包信息 -->
      <RightSideBar
        :pairInfo="rightSideBarInfo.pairInfo"
        :loadRightSideBar="rightSideBarInfo.loadRightSideBar"
        :currentTokenHoldInfo="currentTokenHoldInfo"
        :holdingCoinsTabInfo="holdingCoinsTabInfo"
        :baseInfo="baseInfo"
        :earliest100TraderData="earliest100TraderData"
      />
    </div>
    <div id="draggable-box">
      <QuickTrading
        v-if="config.switch"
        :config="config"
        :coinInfo="coinInfo"
        :positions="initLimitedOrders.positions"
        :pairInfo="{ ...rightSideBarInfo.pairInfo, price: priceIncrease.price }"
        @circulation="handelCirculation"
        @close="handelClose"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onUnmounted, computed, watch } from 'vue'
import { useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'

import { useI18n } from 'vue-i18n'

// store 缓存
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
// api
import { APIinitTokenData, initLimitedOrderPage } from '@/api/coinWalletDetails'
import { APIearliest100Trader } from '@/api'
// 组件
import BaseInfo from '@/components/Charts/BaseInfo.vue'
import TradingView from '@/components/Charts/TradingView.vue'
import PondTab from '@/components/Charts/PondTab.vue'
import TransactionTab from '@/components/Charts/TransactionTab.vue'
import TransferAccountsTab from '@/components/Charts/TransferAccountsTab.vue'
import HoldingCoinsTab from '@/components/Charts/HoldingCoinsTab.vue'
import FundTab from '@/components/Charts/FundTab.vue'
import MyCoinTab from '@/components/Charts/MyCoinTab.vue'
import TransactionHistory from '@/components/Charts/TransactionHistory.vue'
import MyHold from '@/components/Charts/MyHold.vue'
import CurrentCommission from '@/components/Charts/CurrentCommission.vue'
import CommissionHistory from '@/components/Charts/CommissionHistory.vue'

import RightSideBar from '@/components/SideBar/RightSideBar.vue'
import RefreshHold from '@/components/RefreshHold.vue'
import QuickTrading from '@/components/SideBar/components/QuickTrading.vue'
// hook 函数
import { useGlobalStore } from '@/stores/global'
import { useCoinWalletDetail } from '@/hooks/useCoinWalletDetail'
import { useBaseInfo } from '@/hooks/useBaseInfo' // 头部 代币信息 hook
import { useRightSideBar } from '@/hooks/useRightSideBar' // 右边栏 hook
import { usePondTab } from '@/hooks/usePondTab' // 池子 hook
import { useTransferAccountsTab } from '@/hooks/useTransferAccountsTab' // 转账 hook
import { useHoldingCoinsTab } from '@/hooks/useHoldingCoinsTab' // 持币 hook
import { useFlowGroup, useListPeriod, useTopNet, useTopProfit } from '@/hooks/useFundTab'
import { useMyCoinTab } from '@/hooks/useMyCoinTab' // 我的 hook

import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import { numberFormat, handleCoinPairInfo } from '@/utils'
import { socket } from '@/utils/socket'

const useSubscribeKChart = useSubscribeKChartInfo()

const i18n = useI18n()
const route = useRoute()
console.log(route) // 页面携带的参数
const switchLeftState = ref<boolean>(true)
const switchRightState = ref<boolean>(true)

const useChainInfo = useChainInfoStore()
//获取token数据
const useTokenInfo = useTokenInfoStore()

const globalStore = useGlobalStore()

const walletType = computed(() => globalStore.walletInfo.walletType)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const customWalletInfo = computed(() => globalStore.customWalletInfo)
const danmaku = ref(
  localStorage.getItem('danmaku') == undefined || localStorage.getItem('danmaku') == null
    ? 1
    : Number(localStorage.getItem('danmaku'))
)

const skeleton = ref<boolean>(false)
const initLimitedOrders = ref<any>({})
const currentTokenHoldInfo = ref<any>({})
const commonTab = [
  {
    code: 'first',
    name: i18n.t('kChart.liquidityPool')
  },
  {
    code: 'second',
    name: '最新成交'
  },
  // {
  //   code: 'third',
  //   name: i18n.t('kChart.Transaction')
  // },
  {
    code: 'fourth',
    name: i18n.t('kChart.Holders')
  },
  {
    code: 'five',
    name: '资金流入'
  }
]
const coinWalletTabs = computed(() => {
  if (walletType.value == 'Email') {
    return [
      ...commonTab,
      {
        code: 'seven',
        name: '我的持仓'
      },
      {
        code: 'eight',
        name: '当前委托'
      },
      {
        code: 'nine',
        name: '交易历史'
      },
      {
        code: 'ten',
        name: '委托历史'
      }
    ]
  } else {
    return [
      ...commonTab
      // {
      //   code: 'six',
      //   name: i18n.t('kChart.MyProfit')
      // }
    ]
  }
})

const activeName = ref(
  coinWalletTabs.value.find((item) => item.code == localStorage.getItem('kchart_tab'))?.code ||
    'second'
) // tabs 切换

const timer = ref<any>(null) // 定时器
// 代币信息
const baseInfo = ref<any>({
  tradingLoading: true
})

// 右边栏信息
const rightSideBarInfo = ref<any>({
  loadRightSideBar: true
})

// 池子信息
const pondTabInfo = ref<any>({})

// 转账信息
const transferAccountsTabInfo = ref<any>({
  loading: true
})

// 持币 信息
const holdingCoinsTabInfo = ref<any>({
  loading: true
})

// 资金
const flowGroupInfo = ref<any>({})
const listPeriodInfo = ref<any>({})

const topNetInfo = ref<any>({
  loading: true
})
const topProfitInfo = ref<any>({
  loading: false
})

// 我的 信息
const myCoinTabInfo = ref<any>({
  loading: true
})

const earliest100TraderData = ref<any>({})

const coinInfo = ref<any>({})

const pauseType = ref<number>(0)
const handelPauseAndPlay = (val: number) => {
  pauseType.value = val
}

const hidePosition = ref(Number(localStorage.getItem('hidePosition')))
const onlyKlinePosition = ref(Number(localStorage.getItem('onlyKlinePosition')))

useChainInfo.createChainInfo({
  chainCode: route.query.chainCode, // 币ID
  pairAddress: route.params.pairAddress, // 币 pairAddress
  timeType: route.query.timeType // 时间类型
})
async function initTokenData() {
  const chainInfo = useChainInfo.chainInfo
  useCoinWalletDetail()
  const res = await APIinitTokenData({
    pairAddress: chainInfo?.pairAddress,
    chainCode: chainInfo?.chainCode
  })
  useTokenInfo.createTokenInfo(res)
  baseInfo.value = await useBaseInfo()
  getEarliest100Trader()
  pondTabInfo.value = usePondTab()
  rightSideBarInfo.value = useRightSideBar()
  // transferAccountsTabInfo.value = useTransferAccountsTab()
  holdingCoinsTabInfo.value = useHoldingCoinsTab(10, 'Top 10')
  flowGroupInfo.value = useFlowGroup()
  listPeriodInfo.value = useListPeriod('1H')
  coinInfo.value = handleCoinPairInfo({
    ...baseInfo.value.tokenInfo,
    chainCode: baseInfo.value.chainInfo?.chainCode
  })
  // topNetInfo.value = useTopNet(0)
  // if (walletType.value !== 'Email') {
  //   myCoinTabInfo.value = useMyCoinTab()
  // }

  document.title = `${baseInfo.value?.tokenInfo?.baseSymbol} | $${numberFormat(priceIncrease.value.price)} | ${priceIncrease.value.increase}% | 利润80%分给所有人的去中心化交易所`
}

const getData = async () => {
  const res = await initLimitedOrderPage({
    walletId: parseFloat(customWalletInfo.value.walletInfo?.walletId),
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    hidePosition: hidePosition.value
  })

  if (res) {
    initLimitedOrders.value = res
    useSubscribeKChart.createSubscribePositions(initLimitedOrders.value.positions)
    currentTokenHoldInfo.value =
      initLimitedOrders.value.positions.find(
        (item: any) =>
          item.tokenAddress.toLowerCase() == baseInfo.value.tokenInfo?.baseAddress?.toLowerCase()
      ) || {}
    if (onlyKlinePosition.value) {
      initLimitedOrders.value.positions = initLimitedOrders.value.positions.filter(
        (item: any) => item.tokenAddress == baseInfo.value.tokenInfo?.baseAddress
      )
    }
  }
}

const getEarliest100Trader = async () => {
  const res = await APIearliest100Trader({
    tokenAddress: baseInfo.value?.tokenInfo?.baseAddress,
    chainCode: baseInfo.value.chainInfo?.chainCode
  })
  console.log(res)

  earliest100TraderData.value = res || {}
}

const priceIncrease = computed(() => {
  return {
    price: useSubscribeKChart.subscribeKChartInfo?.C || 0,
    increase: useSubscribeKChart.subscribeKChartInfo?.chg || 0
  }
})

watch(
  () => priceIncrease.value,
  (newVal, oldVal) => {
    document.title = `${baseInfo.value?.tokenInfo?.baseSymbol} | $${numberFormat(priceIncrease.value.price)} | ${priceIncrease.value.increase}% | 利润80%分给所有人的去中心化交易所`
  }
)

const handleTabClick = (item: { code: string }) => {
  activeName.value = item.code
  localStorage.setItem('kchart_tab', activeName.value)
}

const handelTopSelect = (item: { topNum: number; topName: string }) => {
  holdingCoinsTabInfo.value = useHoldingCoinsTab(item.topNum, item.topName)
}

const fundData = [
  {
    timeLabel: '1H',
    timeNum: '1H',
    id: 1
  },
  {
    timeLabel: '4H',
    timeNum: '4H',
    id: 2
  },
  {
    timeLabel: '1D',
    timeNum: '1D',
    id: 3
  },
  {
    timeLabel: '3D',
    timeNum: '3D',
    id: 4
  },
  {
    timeLabel: '1W',
    timeNum: '1W',
    id: 5
  },
  {
    timeLabel: '1M',
    timeNum: '1M',
    id: 6
  }
]

const fundIndex = ref(1)

const handelfundSelect = (item: { id: number; timeNum: string }) => {
  fundIndex.value = item.id
  listPeriodInfo.value = useListPeriod(item.timeNum)
}

const handelBuyingSellingTopSelect = (id: number) => {
  if ([0, 1].includes(id)) {
    topNetInfo.value = useTopNet(id)
  } else {
    topProfitInfo.value = useTopProfit(id)
  }
}

const setPolling = async () => {
  skeleton.value = true
  localStorage.getItem('accountInfo') && (await getData())
  skeleton.value = false
  clearInterval(timer.value)
  timer.value = null
  timer.value = setInterval(() => {
    rightSideBarInfo.value = useRightSideBar()
    localStorage.getItem('accountInfo') && getData()
  }, 5000)
}

watch(
  () => customWalletInfo.value,
  (newVal, oldVal) => {
    setPolling()
  }
)

// 路由更新时的操作
onBeforeRouteUpdate((to, from) => {
  console.log('组件K : onBeforeRouteUpdate - to :', to)
  console.log('组件K : onBeforeRouteUpdate - from :', from)
  console.log(`即将跳转到 /k/${to.params.pairAddress},请稍等`)
  // 交易信息
  socket.emit(
    'kchart-off',
    JSON.stringify({
      pair: from.params?.pairAddress,
      chainCode: from.query?.chainCode
    })
  )
  globalStore.SetSocketKchartConnectType(null)
  useChainInfo.createChainInfo({
    chainCode: to.query.chainCode, // 币ID
    pairAddress: to.params.pairAddress, // 币 pairAddress
    timeType: to.query.timeType // 时间类型
  })
})

onBeforeRouteLeave((to, from) => {
  console.log('🔥onBeforeRouteLeave - to :', to)
  console.log('🔥onBeforeRouteLeave - from :', from)
  socket.emit(
    'kchart-off',
    JSON.stringify({
      pair: from.params?.pairAddress,
      chainCode: from.query?.chainCode
    })
  )
  globalStore.SetSocketKchartConnectType(null)
})

onMounted(() => {
  let tradingView: any = document.getElementById('trading-view-box')
  const tradingViewHeight = localStorage.getItem('tradingViewHeight')
  if (tradingViewHeight) {
    tradingView.style.height = tradingViewHeight + 'px'
  }
  quickTradMoveElement()
  initTokenData()
  resizeController()
  setPolling()
})

const resizeController = () => {
  let resize: any = document.getElementById('resize-box')
  let tradingView: any = document.getElementById('trading-view-box')

  resize.onmousedown = function (e: any) {
    let startY = e.clientY
    tradingView.top = tradingView.offsetHeight
    document.onmousemove = function (e) {
      let endY = e.clientY
      let moveLen = tradingView.top + (endY - startY) // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
      if (moveLen < 200) moveLen = 200
      tradingView.style.height = moveLen + 'px'
      tradingView.style.pointerEvents = 'none'

      localStorage.setItem('tradingViewHeight', moveLen)
      console.log(moveLen)
    }
    document.onmouseup = function (e) {
      document.onmousemove = null
      document.onmouseup = null
      tradingView.style.pointerEvents = 'auto'
      resize.releaseCapture && resize.releaseCapture() //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
    }
  }
  resize.setCapture && resize.setCapture() //该函数在属于当前线程的指定窗口里设置鼠标捕获
  return false
}

const config = ref<any>(JSON.parse(localStorage.getItem('quick_trade_config') || '{}'))

const quickTradMoveElement = () => {
  const dragElement = document.getElementById('draggable-box') as HTMLElement
  const tradingView = document.getElementById('trading-view-box') as HTMLElement

  dragElement.style.left = config.value.x + 'px'
  dragElement.style.top = config.value.y + 'px'

  let isDragging = false
  let offsetX: number, offsetY: number

  dragElement.addEventListener('mousedown', (e) => {
    // 记录鼠标点击位置与元素左上角的偏移
    offsetX = e.clientX - dragElement.getBoundingClientRect().left
    offsetY = e.clientY - dragElement.getBoundingClientRect().top
    isDragging = true

    // 鼠标移动事件
    const moveElement = (e: any) => {
      if (isDragging) {
        dragElement.style.left = e.clientX - offsetX + 'px'
        dragElement.style.top = e.clientY - offsetY + 'px'
        tradingView.style.pointerEvents = 'none'
        const obj = Object.assign({}, config.value, {
          x: e.clientX - offsetX,
          y: e.clientY - offsetY
        })
        localStorage.setItem('quick_trade_config', JSON.stringify(obj))

        config.value = obj
      }
    }

    // 鼠标释放事件
    const stopDragging = () => {
      isDragging = false
      tradingView.style.pointerEvents = 'auto'
      document.removeEventListener('mousemove', moveElement)
      document.removeEventListener('mouseup', stopDragging)
    }

    // 监听鼠标移动和释放事件
    document.addEventListener('mousemove', moveElement)
    document.addEventListener('mouseup', stopDragging)
  })
}

const handelCirculation = (val: any) => {
  const obj = Object.assign({}, config.value, val)
  localStorage.setItem('quick_trade_config', JSON.stringify(obj))
  config.value = obj
}

const handelClose = (val: boolean) => {
  const obj = Object.assign({}, config.value, {
    switch: val
  })
  localStorage.setItem('quick_trade_config', JSON.stringify(obj))
  config.value = obj
}

const handelHidePosition = (val: string) => {
  localStorage.setItem('hidePosition', val)
  localStorage.getItem('accountInfo') && getData()
}

const handelOnlyKlinePosition = (val: string) => {
  localStorage.setItem('onlyKlinePosition', val)
  localStorage.getItem('accountInfo') && getData()
}

const handelSwitchDanmaku = (val: string) => {
  globalStore.setDanmaku(val)
}

onUnmounted(() => {
  clearInterval(timer.value)
  timer.value = null
})
</script>
<style lang="scss" scoped>
.coinWalletDetails {
  height: calc(100vh - 135px);
  padding-top: 10px;
  .resize-box {
    width: 99%;
    background-color: transparent;
    margin: 9px auto;
    padding: 6px 8px;
    cursor: row-resize;
    transition: all 0.3s;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    bottom: 0;
    top: unset;
    -webkit-user-select: none;
    user-select: none;
    touch-action: none;
    .resize-line {
      border: 1.5px solid rgb(57, 60, 67);
    }
  }
  .refresh-box {
    position: relative;
    left: 10px;
    top: 12px;
    display: inline-block;
  }

  .transaction-tab-pause-txt {
    padding: 1px 5px;
    margin-left: 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #ffec42;
    background-color: #595000;
    font-family: 'PingFangSC-Medium';
    position: relative;
    top: 8px;
  }

  // .resize-box:hover {
  //   background-color: var(--hover-bg-color);
  // }
  .tradingViewLoading {
    width: 100%;
    height: 75%;
    padding: 5px 10px;
    // background-color: var(--card-bg-color);
    border-radius: 12px;
    min-height: 200px;
  }
  .coinWalletDetails-section {
    position: relative;
    padding-left: 12px;
  }
  .switch-ele {
    width: 9px;
    height: 27px;
    position: absolute;
    top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
    border-radius: 99px;
    cursor: pointer;
    background-color: #5c6068;
  }

  .switch-icon {
    width: 2px;
    height: 7px;
    color: #101114;
  }
  .switch-ele-left {
    left: 0;
  }
  .switch-ele-right {
    right: 0;
  }
  .coinWalletDetails-section-main {
    padding-right: 12px;
    height: calc(100vh - 174px);
  }
  .coinWallet-tabs-box {
    // background-color: rgba(23, 24, 27, 0.3);
    // border-radius: 12px;
    padding: 0 12px 12px;
  }
  .coinWallet-tabs-head:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .coinWallet-tabs-item {
    float: left;
    // border: 1px solid rgba(38, 40, 44, 0.3);
    // border-radius: 4px;
    padding: 2px;
    span {
      display: block;
      padding: 4px 12px;
      font-size: 14px;
      font-style: normal;
      font-weight: normal;
      text-align: center;
      color: #848e9c;
      background-color: transparent;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
    }
    span:last-child {
      margin-right: 0;
    }
    .active {
      color: #f5f5f5;
      background-color: rgba(58, 60, 64, 0.4);
    }
  }
  .coinWallet-tabs-content {
    margin-top: 12px;
    height: 940px;
  }

  .data-items {
    padding: 2px;
    border-radius: 6px;
    background: var(--bg-color);
    float: right;
    margin: 2px 0 2px 6px;
    .item {
      padding: 4px 8px;
      border-radius: 4px;
      background-color: transparent;
      color: var(--dex-color-4);
      font-size: 12px;
      cursor: pointer;
    }

    .item-active {
      color: var(--font-color-default);
      background: var(--tab-bg-color);
    }
  }
  #draggable-box {
    position: fixed;
    z-index: 990;
  }
}
@media (max-width: 1700px) {
  .coinWalletDetails .tradingViewLoading {
    height: 85%;
  }
}

@media (min-width: 1681px) and (max-width: 1920px) {
  .coinWalletDetails .tradingViewLoading {
    height: 80%;
  }
}
</style>
