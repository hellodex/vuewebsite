<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { createChart } from 'lightweight-charts'
import { formatDate, numberFormat } from '@/utils'

import img from '@/assets/img/logo.png'
const props = defineProps({
  type: {
    type: String,
    default: 'line'
  },
  data: {
    type: Array,
    required: true
  },
  volumeData: {
    type: Array
  },
  subscribeData: {
    type: Object
  },
  autosize: {
    default: true,
    type: Boolean
  },
  chartOptions: {
    type: Object
  },
  seriesOptions: {
    type: Object
  },
  timeScaleOptions: {
    type: Object
  },
  priceScaleOptions: {
    type: Object
  }
})

// Function to get the correct series constructor name for current series type.
function getChartSeriesConstructorName(type) {
  return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`
}

// Lightweight Chart instances are stored as normal JS variables
// If you need to use a ref then it is recommended that you use `shallowRef` instead
let series
let chart
let volumeSeries

const chartContainer = ref()

const fitContent = () => {
  if (!chart) return
  chart.timeScale().fitContent()
}

const getChart = () => {
  return chart
}

defineExpose({ fitContent, getChart })

// Auto resizes the chart when the browser window is resized.
const resizeHandler = () => {
  if (!chart || !chartContainer.value) return
  const dimensions = chartContainer.value.getBoundingClientRect()
  chart.resize(dimensions.width, dimensions.height)
}

// Creates the chart series and sets the data.
const addSeriesAndData = (props) => {
  const seriesConstructor = getChartSeriesConstructorName(props.type)
  series = chart[seriesConstructor](props.seriesOptions)
  if (props.volumeData) {
    volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume'
      },
      priceScaleId: ''
    })
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85, // highest point of the series will be 70% away from the top
        bottom: 0
      }
    })
    volumeSeries.setData(props.volumeData)
  }
  if (props.type == 'candlestick') {
    updateCandlestickTooltip()
    watermark()
  } else if (props.type == 'area') {
    updateAreaTooltip()
  }
  series.setData(props.data)
}

const updateCandlestickTooltip = () => {
  const container = chartContainer.value

  const toolTipWidth = 80
  const toolTipHeight = 80
  const toolTipMargin = 15

  // Create and style the tooltip html element
  const toolTip = document.createElement('div')
  toolTip.style = ` min-width: 2.667rem; 
                    min-height: 2.133rem; 
                    position: absolute; 
                    display: none; 
                    padding: 0.1067rem 0.16rem; 
                    box-sizing: border-box; 
                    font-size: 12px; 
                    text-align: left; 
                    z-index: 1000; 
                    top: 12px; 
                    left: 12px; 
                    pointer-events: none; 
                    border-radius: 0.1067rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; 
                    -webkit-font-smoothing: antialiased; 
                    -moz-osx-font-smoothing: grayscale;
                  `
  toolTip.style.background = '#2e2e2e'
  toolTip.style.color = '#F9F9F9'
  container.appendChild(toolTip)

  // update tooltip
  chart.subscribeCrosshairMove((param) => {
    if (
      param.point === undefined ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > container.clientWidth ||
      param.point.y < 0 ||
      param.point.y > container.clientHeight
    ) {
      toolTip.style.display = 'none'
    } else {
      toolTip.style.display = 'block'
      const data = param.seriesData.get(series)
      const volumeData = param.seriesData.get(volumeSeries)
      toolTip.innerHTML = `
                            <div class="tooptip-item display-flex align-items-center justify-content-sp">
                              <span>时间</span>
                              <span>${formatDate(param.time * 1000)}</span>
                            </div>
                            <div class="tooptip-item display-flex align-items-center justify-content-sp">
                              <span>开盘</span>
                              <span>${numberFormat(data.open)}</span>
                            </div>
                            <div class="tooptip-item display-flex align-items-center justify-content-sp">
                              <span>最高</span>
                              <span>${numberFormat(data.high)}</span>
                            </div>
                            <div class="tooptip-item display-flex align-items-center justify-content-sp">
                              <span>最低</span>
                              <span>${numberFormat(data.low)}</span>
                            </div>
                            <div class="tooptip-item display-flex align-items-center justify-content-sp">
                              <span>收盘</span>
                              <span>${numberFormat(data.close)}</span>
                            </div>
                            <div class="tooptip-item display-flex align-items-center justify-content-sp">
                              <span>成交量</span>
                              <span>${numberFormat(volumeData || 0)}</span>
                            </div>
                          `

      const y = param.point.y
      let left = param.point.x + toolTipMargin
      if (left > container.clientWidth - toolTipWidth) {
        left = param.point.x - toolTipMargin - toolTipWidth
      }

      let top = y + toolTipMargin
      if (top > container.clientHeight - toolTipHeight) {
        top = y - toolTipHeight - toolTipMargin
      }
      toolTip.style.left = left + 'px'
      toolTip.style.top = top + 'px'
    }
  })
}

const updateAreaTooltip = () => {
  const container = chartContainer.value
  const toolTipWidth = 30
  const toolTipHeight = 30
  const toolTipMargin = 20

  // Create and style the tooltip html element
  const toolTip = document.createElement('div')
  toolTip.style = `
                    width:110px;
                    position: absolute; 
                    display: none; 
                    padding: 6px 8px; 
                    box-sizing: border-box; 
                    font-size: 12px; 
                    text-align: left; 
                    z-index: 1000; 
                    top: 12px; 
                    left: 12px; 
                    pointer-events: none; 
                    border-radius: 8px; 
                    -webkit-font-smoothing: antialiased; 
                    -moz-osx-font-smoothing: grayscale;
                  `
  toolTip.style.background = '#2e2e2e'
  toolTip.style.color = '#F9F9F9'
  container.appendChild(toolTip)

  // update tooltip
  chart.subscribeCrosshairMove((param) => {
    if (
      param.point === undefined ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > container.clientWidth ||
      param.point.y < 0 ||
      param.point.y > container.clientHeight
    ) {
      toolTip.style.display = 'none'
    } else {
      toolTip.style.display = 'block'
      const data = param.seriesData.get(series)
      toolTip.innerHTML = `
                            <div class="tooptip-area-item display-flex align-items-center">
                              <span>${formatDate(param.time * 1000)}</span>
                            </div>
                            <div class="tooptip-area-item display-flex align-items-center">

                              <span>价格 $</span>
                              <span>${numberFormat(data.value)}</span>
                            </div>
                          `

      const y = param.point.y
      let left = param.point.x + toolTipMargin
      if (left > container.clientWidth - toolTipWidth) {
        left = param.point.x - toolTipMargin - toolTipWidth
      }

      let top = y + toolTipMargin
      if (top > container.clientHeight - toolTipHeight) {
        top = y - toolTipHeight - toolTipMargin
      }
      toolTip.style.left = left + 'px'
      toolTip.style.top = top + 'px'
    }
  })
}

const watermark = () => {
  const container = chartContainer.value
  var watermark_img = document.createElement('img')
  watermark_img.setAttribute('class', 'watermark_img')
  watermark_img.setAttribute('src', img)
  watermark_img.setAttribute('alt', 'watermark img')

  container.appendChild(watermark_img)
}

onMounted(() => {
  // Create the Lightweight Charts Instance using the container ref.
  chart = createChart(chartContainer.value, props.chartOptions)
  addSeriesAndData(props)

  if (props.priceScaleOptions) {
    chart.priceScale().applyOptions(props.priceScaleOptions)
  }

  if (props.timeScaleOptions) {
    chart.timeScale().applyOptions(props.timeScaleOptions)
  }

  chart.timeScale().fitContent()

  if (props.autosize) {
    window.addEventListener('resize', resizeHandler)
  }
})

onUnmounted(() => {
  if (chart) {
    chart.remove()
    chart = null
  }
  if (series) {
    series = null
  }
})

/*
 * Watch for changes to any of the component properties.

 * If an options property is changed then we will apply those options
 * on top of any existing options previously set (since we are using the
 * `applyOptions` method).
 * 
 * If there is a change to the chart type, then the existing series is removed
 * and the new series is created, and assigned the data.
 * 
 */
watch(
  () => props.autosize,
  (enabled) => {
    if (!enabled) {
      window.removeEventListener('resize', resizeHandler)
      return
    }
    window.addEventListener('resize', resizeHandler)
  }
)

watch(
  () => props.type,
  (newType) => {
    if (series && chart) {
      chart.removeSeries(series)
    }
    addSeriesAndData(props)
  }
)

watch(
  () => props.data,
  (newData) => {
    if (!series) return
    series.setData(newData)
  }
)

watch(
  () => props.subscribeData,
  (newData) => {
    if (!series) return
    series.update(newData)
  }
)

watch(
  () => props.volumeData,
  (newData) => {
    if (!volumeSeries) return
    volumeSeries.setData(newData)
  }
)

watch(
  () => props.chartOptions,
  (newOptions) => {
    if (!chart) return
    chart.applyOptions(newOptions)
  }
)

watch(
  () => props.seriesOptions,
  (newOptions) => {
    if (!series) return
    series.applyOptions(newOptions)
  }
)

watch(
  () => props.priceScaleOptions,
  (newOptions) => {
    if (!chart) return
    chart.priceScale().applyOptions(newOptions)
  }
)

watch(
  () => props.timeScaleOptions,
  (newOptions) => {
    if (!chart) return
    chart.timeScale().applyOptions(newOptions)
  }
)
</script>

<template>
  <div class="lw-chart" ref="chartContainer"></div>
</template>

<style scoped>
.lw-chart {
  height: 100%;
  position: relative;
}
:dee(.tooptip-item span:first-child) {
  margin-right: 0.16rem;
  color: #e0e0e0;
}

:deep(.watermark_img) {
  width: 120px;
  position: absolute;
  bottom: 2.4rem;
  left: 16px;
  z-index: 2;
}
</style>
