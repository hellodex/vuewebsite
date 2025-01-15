<template>
  <div id="line-echarts" ref="lineEchartContainer"></div>
</template>
<script lang="ts" setup>
import { ref, inject, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { numberFormat } from '@/utils'
const props = defineProps({
  chartData: {
    type: Object,
    default: () => {
      return []
    }
  }
})

// 获取 echart 挂载的DOM节点
const lineEchartContainer = ref()
const chartObj = ref<any>(null)
// 通过 inject 接收 Echarts
const Echarts = inject('$echarts')

// echarts初始化
const initEcharts = () => {
  chartObj.value = (Echarts as any).init(lineEchartContainer.value)
  const option = {
    // 自定义echarts图标相关配置
    color: ['#34A853', '#F6465D'],
    grid: {
      left: '2%', // 距离左侧的距离
      right: '2%', // 距离右侧的距离
      top: '10%', // 距离顶部的距离
      bottom: '2%', // 距离底部的距离
      containLabel: true // 包含坐标轴的标签
    },
    xAxis: {
      type: 'category',
      data: props.chartData.xAxisData,
      boundaryGap: false,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value: any, index: any) {
          return numberFormat(value)
        }
      },
      splitLine: {
        show: false
      }
    },
    series: props.chartData.series
  }
  chartObj.value.setOption(option)
}
watch(
  () => props.chartData,
  (value) => {
    console.log(value)
    chartObj.value.dispose()
    initEcharts()
  },
  { deep: true }
)
onMounted(() => {
  nextTick(() => {
    initEcharts()
    window.addEventListener('resize', initEcharts)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', initEcharts)
})
</script>
<style lang="scss" scoped>
#line-echarts {
  width: 100%;
  height: 5.8667rem;
}
</style>
