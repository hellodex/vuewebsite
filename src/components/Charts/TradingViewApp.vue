<template>
  <div id="tv_chart_container">
    <div class="time-box display-flex align-items-center justify-content-sp">
      <div class="display-flex align-items-center">
        <span
          :class="timeCode == item.code ? 'active' : ''"
          v-for="(item, index) in timeList"
          :key="index"
          @click="handleTimeChange(item)"
          >{{ item.name }}</span
        >
      </div>
      <div class="more display-flex align-items-center">
        <strong>更多</strong>
        <van-icon name="play" class="icon" />
      </div>
    </div>
    <div class="tv_chart">
      <div class="loading" v-show="loading">
        <svg-icon name="icon-loading" class="icon-loading"></svg-icon>
      </div>
      <LWChart
        :type="chartType"
        :data="chartData"
        :volumeData="volumeData"
        :subscribeData="subscribeData"
        :autosize="true"
        :chart-options="chartOptions"
        :series-options="seriesOptions"
        ref="lwChart"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import LWChart from '@/components/Charts/LWChart.vue'
import { APIappGetChart, APIappSubscribeKChartAndSwap } from '@/api'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import { MAIN_COIN } from '@/types'

import BigNumber from 'bignumber.js'
import { formatDecimals, numberFormat, numFormat } from '@/utils'

const basePrice = formatDecimals(sessionStorage.getItem('basePrice'))

const useChainInfo = useChainInfoStore()
const { chainInfo } = storeToRefs(useChainInfo)
const useTokenInfo = useTokenInfoStore()
const tokenInfo = useTokenInfo.tokenInfo // 解构变量 通过 storeToRefs 变成响应式

const timeCode = ref('15m')
const timeList = ref([
  {
    code: '1m',
    name: '1分'
  },
  {
    code: '5m',
    name: '5分'
  },
  {
    code: '15m',
    name: '15分'
  },
  {
    code: '30m',
    name: '30分'
  },
  {
    code: '1h',
    name: '1时'
  },
  {
    code: '1d',
    name: '1日'
  },
  {
    code: '1w',
    name: '1周'
  }
])

const timer = ref(null) // 定时器对象
const loading = ref(true) // k线loading
const startTime = ref(0) // k线最后一条线的 时间
const chartData = ref([]) // k线数据
const subscribeData = ref({}) // s实时k线数据
const volumeData = ref([]) // 成交量数据
const chartType = ref('candlestick') // 图表类型
const lwChart = ref() // k线 dom 节点
const chartOptions = ref({
  layout: {
    background: { color: '#121212' },
    textColor: '#9c9c9c',
    attributionLogo: false
  },
  localization: {
    // 国际化
    // timeFormatter: (time) => new Date(time * 1000).toLocaleTimeString('zh-CN', { hour12: true })
  },
  grid: {
    vertLines: { color: 'rgba(255, 255, 255, 0.06)' },
    horzLines: { color: 'rgba(255, 255, 255, 0.06)' }
  },
  rightPriceScale: {
    visible: true,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    scaleMargins: {
      bottom: 0.25,
      top: 0.1
    }
  },
  leftPriceScale: {
    visible: false,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  timeScale: {
    visible: true,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  crosshair: {
    vertLine: {
      color: '#9C9C9C'
    },
    horzLine: {
      color: '#9C9C9C'
    },
    mode: 1
  }
})

const seriesOptions = ref({
  upColor: '#14C784',
  downColor: '#EF485C',
  wickVisible: true,
  borderVisible: false,
  borderUpColor: '#14C784',
  borderDownColor: '#EF485C',
  wickUpColor: '#14C784',
  wickDownColor: '#EF485C',
  priceFormat: {
    type: 'custom',
    formatter: function (price) {
      return MAIN_COIN[tokenInfo?.baseSymbol]
        ? numFormat(new BigNumber(price).toFixed(basePrice.precision))
        : numberFormat(new BigNumber(price).toFixed(basePrice.precision))
    },
    minMove: basePrice.minMove
  }
})

const getBars = async () => {
  loading.value = true
  const res = await APIappGetChart({
    chainCode: chainInfo.value?.chainCode,
    pairAddress: chainInfo.value?.pairAddress,
    timeType: chainInfo.value?.timeType
  })
  const info = res.reverse()

  chartData.value = info.map((item) => {
    return {
      time: item.timestamp,
      close: parseFloat(item.C),
      high: parseFloat(item.H),
      low: parseFloat(item.L),
      open: parseFloat(item.O)
    }
  })
  volumeData.value = info.map((item) => {
    return {
      time: item.timestamp,
      value: parseFloat(item.volume),
      color:
        parseFloat(item.C) >= parseFloat(item.O)
          ? 'rgba(20, 199, 132, 0.50)'
          : 'rgba(201, 62, 95, 0.50)'
    }
  })
  startTime.value = info[info.length - 1]?.timestamp
  loading.value = false
}
const subscribeBars = async () => {
  const res = await APIappSubscribeKChartAndSwap({
    chainCode: chainInfo.value?.chainCode,
    pairAddress: chainInfo.value?.pairAddress,
    timeType: chainInfo.value?.timeType,
    startTime: startTime.value
  })
  const useSubscribeKChart = useSubscribeKChartInfo()
  useSubscribeKChart.createSubscribeKChartInfo(res)
  if (res?.chart?.timestamp) {
    startTime.value = res.chart.timestamp
  }
  subscribeData.value = {
    time: res.chart.timestamp,
    open: parseFloat(res.chart.O),
    high: parseFloat(res.chart.H),
    low: parseFloat(res.chart.L),
    close: parseFloat(res.chart.C)
  }
  volumeData.value.push({
    time: res.chart.timestamp,
    volume: parseFloat(res.chart.volume),
    color:
      parseFloat(res.chart.C) >= parseFloat(res.chart.O)
        ? 'rgba(20, 199, 132, 0.50)'
        : 'rgba(201, 62, 95, 0.50)'
  })
}

const handleTimeChange = async (item) => {
  timeCode.value = item.code
  useChainInfo.createChainInfo({
    chainCode: chainInfo.value?.chainCode,
    pairAddress: chainInfo.value?.pairAddress,
    timeType: item.code
  })
  await getBars()
  setPolling()
}

const setPolling = () => {
  clearInterval(timer.value)
  subscribeBars()
  timer.value = setInterval(() => {
    subscribeBars()
  }, 5000)
}

onMounted(async () => {
  await getBars()
  setPolling()
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
#tv_chart_container {
  width: 100%;
  height: 100%;
  .time-box {
    padding: 0.1867rem 0.32rem;

    span {
      display: block;
      width: 1rem;
      height: 0.5867rem;
      border-radius: 0.1067rem;
      background: transparent;
      text-align: center;
      line-height: 0.5867rem;
      color: #9c9c9c;
      font-size: 0.32rem;
      margin-right: 0.0533rem;
    }
    .active {
      background: #424242;
      color: #fff;
    }
    .more {
      height: 0.5867rem;
      color: #9c9c9c;
      font-size: 0.32rem;
      .icon {
        transform: rotate(90deg);
        margin-left: 0.1067rem;
      }
    }
  }
  .tv_chart {
    height: calc(100% - 42px);
    position: relative;
  }
  .loading {
    width: 100%;
    height: calc(100% - 42px);
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
  }

  .icon-loading {
    width: 1rem;
    height: 3.2rem;
  }
}
</style>
