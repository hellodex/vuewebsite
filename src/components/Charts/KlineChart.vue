<template>
  <div class="echarts" ref="echartContainer"></div>
</template>
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'

// 获取 echart 挂载的DOM节点
const echartContainer = ref()
const lineEchart = ref<any>(null)
// 通过 inject 接收 Echarts
const Echarts = inject('$echarts')
const base = +new Date(2021, 1, 1)
const oneDay = 24 * 3600 * 1000
const date: Date[] = []
const xData: any = []
const Iq =
  'M0 1C0 0.447716 0.447715 0 1 0H27C27.5523 0 28 0.447715 28 1V17.0513C28 17.6036 27.5523 18.0513 27 18.0513H21H17.9499C17.6638 18.0513 17.3914 18.1739 17.2016 18.388L14 22L10.7984 18.388C10.6086 18.1739 10.3362 18.0513 10.0501 18.0513H7H1C0.447715 18.0513 0 17.6036 0 17.0513V1Z'
let now: any = new Date(base)
function addData(shift: boolean) {
  now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
  date.push(now)
  xData.push(
    (Math.random() - 0.4) * 10 + (xData.length == 0 ? Math.random() * 150 : xData[xData.length - 1])
  )

  now = new Date(+new Date(now) + oneDay)
}
for (let i = 1; i < 20; i++) {
  addData(false)
}

function Eq(r: any, t: any) {
  const n: any = document.createElement('canvas').getContext('2d')
  return (n.font = `${t}px sans-serif`), n.measureText(r).width
}

let M = function (W: any, F: any) {
  const G = F.coord([F.value(0), F.value(1)]),
    q = [],
    fe = 12,
    ke = 10,
    ue = `$0.001282/$1.28M`,
    Z = Eq(ue, fe) + ke
  return (
    q.push({
      type: 'rect',
      shape: {
        x: G[0] - Z + 5,
        y: G[1] - 35,
        width: Z,
        height: 20
      },
      style: {
        text: ue,
        textFill: '#fff',
        fill: '#2ebd85',
        fontSize: fe,
        textAlign: 'center',
        textVerticalAlign: 'middle'
      }
    }),
    {
      type: 'group',
      children: q
    }
  )
}

function N(D: string) {
  const M = D.includes('+'),
    I = `${D}`.length
  return (
    {
      1: 0.63,
      2: M ? 0.63 : 0.6,
      3: M ? 0.52 : 0.48,
      4: M ? 0.5 : 0.4
    }[I] ?? 0.7
  )
}

const O = (W: any, F: any) => {
  const G = F.coord([F.value(0), F.value(1)]),
    q = true,
    fe = [],
    Ce = `+5`,
    Ff = 12,
    xe = {
      width: 17.5,
      height: 21.3
    },
    Oe = 10,
    Ge = 5,
    Ue = q ? G[1] + xe.height / 2 + Ff : G[1] - xe.height / 2 - Ff,
    Je = q
      ? G[1] + xe.width - ((N(Ce) * xe.width) / 2) * 1.08 + (Ff - 4)
      : G[1] - xe.width - ((N(Ce) * xe.width) / 2) * 0.86 - (Ff - 4)
  return (
    fe.push(
      {
        type: 'path',
        shape: {
          pathData: Iq,
          x: -27.5 / 2,
          y: -26.3 / 2,
          width: xe.width + Oe,
          height: xe.height + Ge
        },
        style: {
          fill: '#2ebd85'
        },
        emphasis: {
          style: {
            lineWidth: 1.5,
            stroke: '#F1CF21'
          }
        },
        position: [G[0], Ue],
        rotation: q ? Math.PI : 0,
        silent: false,
        z: 10
      },
      {
        type: 'text',
        x: G[0],
        y: Je,
        style: {
          text: Ce,
          textAlign: 'center',
          fontSize: N(Ce) * xe.width,
          fill: '#fff'
        },
        silent: true,
        z: 9
      }
    ),
    {
      type: 'group',
      children: fe
    }
  )
}

const initEcharts = () => {
  lineEchart.value = (Echarts as any).init(echartContainer.value, null, { renderer: 'svg' })
  const options = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '2%',
      right: '3%',
      top: '2%',
      bottom: '1%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: date,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#999'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false
      },
      splitLine: {
        show: false,
        lineStyle: {
          type: 'dotted'
        }
      },
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    series: [
      {
        type: 'line',
        data: xData,
        smooth: true,
        symbolSize: 0,
        lineStyle: {
          width: 3,
          color: '#2ebd85',
          shadowBlur: 8
        },
        z: 1
      },
      {
        type: 'custom',
        renderItem: O,
        data: [
          [date.at(1), xData.at(1)],
          [date.at(2), xData.at(2)],
          [date.at(8), xData.at(8)]
        ],
        tooltip: {
          show: !1
        },
        z: 3
      },
      {
        type: 'custom',
        renderItem: M,
        data: [[date.at(-1), xData.at(-1)]],
        silent: true,
        z: 4
      },
      {
        type: 'effectScatter',
        data: [[date.at(-1), xData.at(-1)]],
        coordinateSystem: 'cartesian2d',
        symbolSize: 10,
        silent: true,
        itemStyle: {
          color: '#2ebd85'
        },
        rippleEffect: {
          number: 1,
          scale: 2.5,
          period: 1.2
        },
        z: 4
      }
    ]
  }

  lineEchart.value.setOption(options)
}

const resizeChart = () => {
  if (lineEchart.value) {
    lineEchart.value.resize()
  }
}

onMounted(() => {
  initEcharts()
  // 图表
  setInterval(function () {
    addData(true)
    lineEchart.value.setOption({
      xAxis: {
        data: date
      },
      series: [
        {
          data: xData
        },
        {
          type: 'custom',
          renderItem: O,
          data: [
            [date.at(1), xData.at(1)],
            [date.at(2), xData.at(2)],
            [date.at(8), xData.at(8)]
          ],
          tooltip: {
            show: !1
          },
          z: 3
        },
        {
          type: 'custom',
          renderItem: M,
          data: [[date.at(-1), xData.at(-1)]],
          silent: true,
          z: 4
        },
        {
          type: 'effectScatter',
          data: [[date.at(-1), xData.at(-1)]],
          coordinateSystem: 'cartesian2d',
          symbolSize: 10,
          silent: false,
          itemStyle: {
            color: '#2ebd85'
          },
          rippleEffect: {
            number: 1,
            scale: 2.5,
            period: 1.2
          },
          z: 2
        }
      ]
    })
  }, 2000)
})

window.addEventListener('resize', resizeChart)
</script>
<style scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
