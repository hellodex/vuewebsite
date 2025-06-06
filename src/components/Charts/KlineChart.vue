<template>
  <div class="echarts" ref="echartContainer"></div>
</template>
<script setup lang="ts">
import { inject, markRaw, nextTick, onMounted, ref, watch } from 'vue'
import { numberFormat, formatHourMinDate } from '@/utils'

const props: any = defineProps({
  lineData: {
    type: Array,
    default: () => {
      return []
    }
  }
})
const emit = defineEmits(['show'])

const date = ref<any>(props.lineData?.map((item: any) => item.timestamp.toString()) ?? [])
const xData = ref<any>(props.lineData?.map((item: any) => item.C) ?? [])
// 获取 echart 挂载的DOM节点
const echartContainer = ref()
const lineEchart = ref<any>(null)
// 通过 inject 接收 Echarts
const Echarts = inject('$echarts')

const Iq =
  'M0 1C0 0.447716 0.447715 0 1 0H27C27.5523 0 28 0.447715 28 1V17.0513C28 17.6036 27.5523 18.0513 27 18.0513H21H17.9499C17.6638 18.0513 17.3914 18.1739 17.2016 18.388L14 22L10.7984 18.388C10.6086 18.1739 10.3362 18.0513 10.0501 18.0513H7H1C0.447715 18.0513 0 17.6036 0 17.0513V1Z'

function Eq(r: any, t: any) {
  const n: any = document.createElement('canvas').getContext('2d')
  return (n.font = `${t}px sans-serif`), n.measureText(r).width
}

let M = function (W: any, F: any) {
  const G = F.coord([F.value(0), F.value(1)]),
    q = [],
    fe = 12,
    ke = 10,
    ue = `$${numberFormat(props.lineData.at(-1).C)}/$${numberFormat(props.lineData.at(-1).marketCap)}`,
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

const customDataFilter = () => {
  const arrFilter = props.lineData?.filter(
    (item: { pushRecords: any }) => item.pushRecords?.length > 0
  )

  const arrMap = arrFilter?.map((item: { time: string; C: string; timestamp: number }) => {
    return [item.timestamp.toString(), item.C, item.timestamp]
  })

  return arrMap || []
}

const O = (params: any, F: any) => {
  const timestamp = F.value(2)
  let Ce = ''
  const tipsObj = props.lineData?.find(
    (item: { timestamp: number }) => item.timestamp === timestamp
  )
  if (tipsObj.pushRecords?.length == 1) {
    Ce = `#${tipsObj.pushRecords[0].num}`
  } else if (tipsObj.pushRecords?.length > 1) {
    Ce = `+${tipsObj.pushRecords.length}`
  }

  const klineMaxMin = xZ(props.lineData)
  const G = F.coord([F.value(0), F.value(1)]),
    q = F.value(1) > klineMaxMin.mid,
    fe = [],
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
        info: {
          pushRecords: tipsObj.pushRecords,
          timestamp: tipsObj.timestamp
        },
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

/**
 * 自定义弹窗坐标
 * @param r clientWidth
 * @param t clientHeight
 * @param e target.x
 * @param n target.y
 * @param i 窗口子元素长度
 */
function bZ(r: number, t: number, e: number, n: number, i: number) {
  const a = Math.ceil(i / 10),
    o = 20,
    s = 30,
    l = 6,
    u = 18,
    c = 18,
    h = (i > 10 ? 10 : i) * (u + l) + o - l,
    v = a * (c + l) + s - l,
    d = 12,
    p = 12
  let g = e + 12,
    m = n - v / 2
  return (
    r - e - p < h && (g = e - 12 - h),
    v / 2 + n + d > t && (m = n - v + 8),
    m < 0 && (m = n - 8),
    {
      x: g,
      y: m
    }
  )
}

/**
 * 拿到每条k线的最大值及最小值
 * @param r k线数据
 */
function xZ(r: any[]) {
  const t = r.map((a: { C: any }) => a.C).sort((a: number, o: number) => a - o),
    e = t[0],
    n = t.at(-1),
    i = n - e
  return {
    min: e - i * 0.3,
    mid: (e + n) / 2,
    max: n + i * 0.3
  }
}

const createElementFun = (info: any, event: any) => {
  const popup = document.createElement('div')
  popup.className = 'custom-popup'
  popup.id = 'custom' + info.timestamp
  const obj = bZ(
    echartContainer.value.clientWidth,
    echartContainer.value.clientHeight,
    event.target.x,
    event.target.y,
    info.pushRecords?.length ?? 0
  )
  popup.style.left = obj.x + 'px'
  popup.style.top = obj.y + 'px'

  popup.innerHTML = `
              <div class='custom-popup-title'>
                <div class='chose' onclick='handelClose(${info.timestamp})'></div>
              </div>
              <div class='custom-popup-box'>
                ${info.pushRecords
                  ?.map(
                    (item: { num: any }) =>
                      `<div class='custom-popup-item' onclick='handelDialogShow(${JSON.stringify(item)})'>#${item.num}</div>`
                  )
                  .join('')}
              </div`

  echartContainer.value.appendChild(popup)
}

const handelClose = (timestamp: string) => {
  const node = document.getElementById('custom' + timestamp)
  node?.remove()
}

const handelDialogShow = (params: any) => {
  emit('show', typeof params == 'string' ? JSON.parse(params) : params)
}

const options = {
  tooltip: {
    trigger: 'axis',
    padding: 0,
    borderWidth: 0,
    borderRadius: 8,
    confine: true,
    extraCssText: 'z-index: 10;',
    formatter: function (params: any) {
      const { dataIndex } = params[0]
      const item = props.lineData.at(dataIndex)
      return `<div style="padding: 10px;border-radius: 6px;line-height: 1.5;font-size: 12px;background:#181818;color:#f5f5f5;">
                时间: ${item.time} <br/>
					      价格:  ${numberFormat(item.C)}<br/>
								市值:  ${numberFormat(item.marketCap)}
                </div>`
    }
  },
  grid: {
    left: '2%',
    right: '2%',
    top: 35,
    bottom: '2%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: date.value,
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#393939'
      },
      interval: function (index: number, value: any) {
        if (index === 0) {
          return true
        } else if (index == props.lineData?.length - 1) {
          return true
        } else {
          const interval = Math.ceil(props.lineData?.length / 4)
          return index % interval == 0
        }
      },
      formatter: function (value: string) {
        return formatHourMinDate(value)
      }
    }
  },
  yAxis: {
    type: 'value',
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisPointer: {
      show: false
    }
  },
  series: [
    {
      type: 'line',
      data: xData.value,
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
      data: customDataFilter(),
      tooltip: {
        show: false
      },
      z: 3
    },
    {
      type: 'custom',
      renderItem: M,
      data: [[date.value.at(-1), xData.value.at(-1)]],
      silent: true,
      z: 4
    },
    {
      type: 'effectScatter',
      data: [[date.value.at(-1), xData.value.at(-1)]],
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

const initEcharts = () => {
  lineEchart.value = markRaw(
    (Echarts as any).init(echartContainer.value, null, { renderer: 'svg' })
  )

  lineEchart.value.setOption(options)
  lineEchart.value.off('click')

  lineEchart.value.on('click', (params: any) => {
    console.log(params)
    const { componentSubType, info, event } = params || {}
    if (componentSubType === 'custom') {
      if (info.pushRecords?.length > 1) {
        createElementFun(info, event)
      } else if (info.pushRecords?.length == 1) {
        handelDialogShow(info.pushRecords[0])
      }
    }
  })
}

const resizeChart = () => {
  if (lineEchart.value) {
    lineEchart.value.resize()
  }
}

watch(props.lineData, (newValue) => {
  date.value = newValue?.map((item: any) => item.timestamp.toString()) ?? []
  xData.value = newValue?.map((item: any) => item.C) ?? []
  lineEchart.value.setOption({
    xAxis: {
      data: date.value,
      axisLabel: {
        interval: function (index: number, value: any) {
          if (index === 0) {
            return true
          } else if (index == newValue.length - 1) {
            return true
          } else {
            const interval = Math.ceil(newValue.length / 4)
            return index % interval == 0
          }
        }
      }
    },
    series: [
      {
        data: xData.value
      },
      {
        type: 'custom',
        renderItem: O,
        data: customDataFilter(),
        tooltip: {
          show: false
        },
        z: 3
      },
      {
        type: 'custom',
        renderItem: M,
        data: [[date.value.at(-1), xData.value.at(-1)]],
        silent: true,
        z: 4
      },
      {
        type: 'effectScatter',
        data: [[date.value.at(-1), xData.value.at(-1)]],
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
  })
})

onMounted(() => {
  const global: any = window
  global['handelDialogShow'] = handelDialogShow
  global['handelClose'] = handelClose
  nextTick(() => {
    initEcharts()
  })
})

window.addEventListener('resize', resizeChart)
</script>
<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
  :deep(.custom-popup) {
    position: absolute;
    border-radius: 6px;
    background-color: #181818;
    padding: 6px 10px 10px;
    box-sizing: border-box;
    z-index: 20;
    .custom-popup-box {
      display: flex;
      flex-wrap: wrap;
      row-gap: 6px;
      column-gap: 6px;
      max-height: 114px;
      max-width: 234px;
      min-width: 60px;
      overflow-y: auto;
    }
    .custom-popup-item {
      cursor: pointer !important;
      font-size: 9px;
      width: 28px;
      height: 18px;
      color: #f5f5f5;
      background-color: var(--up-color);
      border-radius: 1px;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid transparent;
      font-size: 10px;
    }
    .custom-popup-title {
      display: flex;
      align-items: center;
      justify-content: end;
      margin-bottom: 6px;
      .chose::before {
        cursor: pointer;
        content: '✕';
        display: inline-block;
      }
    }
  }
}
</style>
