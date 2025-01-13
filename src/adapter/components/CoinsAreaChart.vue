<template>
  <LWChart
    :type="chartType"
    :data="chartDataFun(props.chartData)"
    :autosize="true"
    :chart-options="chartOptions"
    :series-options="props.chartData?.seriesOptions"
    ref="lwChart"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import LWChart from '@/components/Charts/LWChart.vue'
const props = defineProps({
  chartData: {
    type: Object
  }
})
const chartType = ref('area')
const chartOptions = ref({
  layout: {
    background: { color: '#171717' },
    textColor: '#9c9c9c',
    attributionLogo: false
  },
  grid: {
    vertLines: {
      visible: false
    },
    horzLines: {
      visible: false
    }
  },
  rightPriceScale: {
    visible: false
  },
  leftPriceScale: {
    visible: false
  },
  timeScale: {
    visible: false
  },
  crosshair: {
    vertLine: {
      visible: false
    },
    horzLine: {
      visible: false
    },
    mode: 1
  }
})

const chartDataFun = (item: any) => {
  return item.priceByPairAddress.k1h.map((item1: any) => {
    return {
      value: parseFloat(item1.C),
      time: item1.timestamp
    }
  })
}
</script>
