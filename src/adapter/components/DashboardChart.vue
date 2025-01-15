<template>
  <div class="chart-group" ref="charGroup"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted, inject, nextTick } from 'vue'

// 数据
const props = defineProps({
  data: {
    type: Object
  }
})

// 获取 echart 挂载的DOM节点
const charGroup = ref()
const charGroupChart = ref<any>(null)
// 通过 inject 接收 Echarts
const Echarts: any = inject('$echarts')

// echarts初始化
const initEcharts = () => {
  charGroupChart.value = (Echarts as any).init(charGroup.value)
  const option = {
    tooltip: {
      show: false
    },
    series: [
      {
        type: 'gauge',
        radius: '160%',
        center: ['50%', '86%'],
        startAngle: 190,
        endAngle: -10,
        axisLine: {
          show: true,
          lineStyle: {
            width: 15,
            color: [
              // 			颜色渐变函数 前四个参数分别表示四个位置依次为 右上左下
              [
                0,
                new Echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 1,
                      color: '#F2FA64' // 0% 处的颜色
                    },
                    {
                      offset: 0,
                      color: '#fa4e4b' // 100% 处的颜色
                    }
                  ],
                  false
                )
              ],
              [
                0.5,
                new Echarts.graphic.LinearGradient(
                  1,
                  0,
                  0,
                  0,
                  [
                    {
                      offset: 1,
                      color: '#fa4e4b' // 0% 处的颜色
                    },
                    {
                      offset: 0,
                      color: '#FFC837' // 100% 处的颜色
                    }
                  ],
                  false
                )
              ],
              [
                1,
                new Echarts.graphic.LinearGradient(
                  1,
                  0,
                  0,
                  0,
                  [
                    {
                      offset: 0.8,
                      color: '#FFC837' // 0% 处的颜色
                    },
                    {
                      offset: 0,
                      color: '#2EBD85' // 100% 处的颜色
                    }
                  ],
                  false
                )
              ]
            ]
          }
        },
        //分隔线样式。
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        pointer: {
          show: true,
          length: '25%',
          width: 3,
          offsetCenter: ['-10%', '-78%'],
          itemStyle: {
            color: '#fff',
            borderWidth: 5
          }
        },
        title: {
          show: true,
          offsetCenter: [0, '-40%'], // x, y，单位px
          textStyle: {
            color: ' #E89F13',
            fontSize: 12
          }
        },
        //仪表盘详情，用于显示数据。
        detail: {
          show: true,
          valueAnimation: true,
          offsetCenter: [0, 0],
          color: '#fff',
          formatter: '{value}',
          textStyle: {
            fontSize: 20
          }
        },
        data: [
          {
            name: '',
            value: props.data?.value
          }
        ]
      },
      {
        // 仅显示tooltip用
        type: 'pie',
        radius: '90%',
        hoverAnimation: true,
        label: {
          normal: {
            show: false,
            position: 'center'
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        z: 3,
        zlevel: 0,
        itemStyle: {
          borderWidth: 0
        },
        data: [
          {
            value: 50,
            name: '',
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: 'transparent'
              }
            }
          }
        ]
      }
    ]
  }
  charGroupChart.value.setOption(option)
}

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
