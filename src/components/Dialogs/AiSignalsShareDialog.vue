<template>
  <van-popup
    v-model:show="dialogVisible"
    round
    :close-on-click-overlay="false"
    @click-close-icon="handleClose"
    class="aisignals-dialog"
    closeable
  >
    <div class="aisignals-content">
      <div class="aisignals-title">分享</div>
      <div class="share-img-dom" ref="shareImg">
        <div class="aisignals-tips">用AI信号买聪明钱</div>
        <div class="aisignals-coin-info display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <el-image :src="aiSignalsShareData.baseToken?.logo" alt="" class="logo">
              <template #error>
                <img src="@/assets/icons/logo1.svg" alt="" class="logo" />
              </template>
            </el-image>
            <div class="display-flex flex-direction-col">
              <span class="symbol-txt">{{ aiSignalsShareData.baseToken?.symbol }}</span>
              <span class="address-txt">{{
                shortifyAddress(aiSignalsShareData.baseToken?.address)
              }}</span>
            </div>
          </div>
          <div class="signal-box display-flex flex-direction-col">
            <div class="signal-txt display-flex align-items-center justify-content-fd">
              <span>信号强度</span>
              <strong class="display-flex align-items-fd">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </strong>
            </div>
            <div class="display-flex align-items-center">
              <span>最高倍数</span>
              <div class="num">{{ aiSignalsShareData.times }}X</div>
            </div>
          </div>
        </div>
        <div class="kline-chart">
          <div class="echarts" ref="echartContainer"></div>
        </div>
        <div class="amount-box">
          <div class="amount-content display-flex align-items-center justify-content-sp">
            <div class="display-flex align-items-center">
              <span>首次推送市值</span>
              <strong>${{ numberFormat(aiSignalsShareData.firstMarketCap) }}</strong>
            </div>
            <div class="display-flex align-items-center">
              <span>推送后最高市值</span>
              <strong>${{ numberFormat(aiSignalsShareData.currentMarketCap) }}</strong>
            </div>
          </div>
        </div>
        <div class="push-box display-flex align-items-center justify-content-sp">
          <div class="push-txt">
            <i></i>
            <span>推送次数</span>
            <strong>{{ aiSignalsShareData.pushCount }}</strong>
          </div>
          <div class="push-txt">
            <i></i>
            <span>买入金额</span>
            <strong>${{ numberFormat(aiSignalsShareData.buyAmount) }}</strong>
          </div>
          <div class="push-txt">
            <i></i>
            <span>买入地址</span>
            <strong>{{ aiSignalsShareData.buyAddressCount }}</strong>
          </div>
          <div class="push-txt">
            <i></i>
            <span>买入次数</span>
            <strong>{{ aiSignalsShareData.buyCount }}</strong>
          </div>
        </div>
        <div class="invite-box">
          <div class="invite-content">
            <p class="text">邀请码：</p>
            <div class="invite-share-txt display-flex flex-direction-col">
              <span>AI信号让Memecoin交易变简单，用邀请码注册享受10%手续费优惠。</span>
              <div class="url-content display-flex align-items-center">
                <div class="display-flex align-items-center">
                  <img src="@/assets/icons/globe-language.svg" alt="" class="icon-web" />
                  <span>hellodex.io</span>
                </div>
                <div class="display-flex align-items-center">
                  <img src="@/assets/icons/x.svg" alt="" class="icon-x" />
                  <span>@HelloDex_io</span>
                </div>
                <div class="tg display-flex align-items-center">
                  <img src="@/assets/icons/tg-app.svg" alt="" class="icon-tg" />
                  <span>t.me/HelloDex_cn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="share-items display-flex align-items-center">
        <div class="share-item display-flex flex-direction-col align-items-center">
          <div class="img-box">
            <img src="@/assets/icons/x.svg" alt="" class="icon-x" />
          </div>
          <span>分享到推特</span>
        </div>
        <div class="share-item display-flex flex-direction-col">
          <div class="img-box">
            <img src="@/assets/icons/tg-app.svg" alt="" class="icon-tg" />
          </div>
          <span>分享到TG</span>
        </div>
        <div
          class="share-item display-flex flex-direction-col"
          :style="{ cursor: imgUrl ? 'pointer' : 'not-allowed' }"
          @click="imgUrl ? copyImageToClipboard(imgUrl) : null"
        >
          <div class="img-box">
            <img src="@/assets/icons/copy1.svg" alt="" />
          </div>
          <span>复制图片</span>
        </div>
        <div
          class="display-flex flex-direction-col"
          :style="{ cursor: imgUrl ? 'pointer' : 'not-allowed' }"
          @click="imgUrl ? handelSaveImage() : null"
        >
          <div class="img-box">
            <img src="@/assets/icons/img-none.svg" alt="" />
          </div>
          <span>保存图片</span>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import html2canvas from 'html2canvas'
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { shortifyAddress, numberFormat } from '@/utils'
import { customMessage } from '@/utils/message'

const emit = defineEmits(['close'])

const props: any = defineProps({
  aiSignalsShareVisible: {
    type: [Boolean],
    default: false
  },
  aiSignalsShareData: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const dialogVisible: any = computed({
  // getter
  get() {
    return props.aiSignalsShareVisible
  },
  // setter
  set(newValue) {
    return newValue
  }
})

const handleClose = () => {
  emit('close', false)
}

const date: any = props.aiSignalsShareData.kcharts?.map((item: any) => item.time) ?? []
const xData: any = props.aiSignalsShareData.kcharts?.map((item: any) => item.C) ?? []

const shareImg = ref()
const imgUrl = ref('')

// 获取 echart 挂载的DOM节点
const echartContainer = ref()
const lineEchart = ref<any>(null)
// 通过 inject 接收 Echarts
const Echarts = inject('$echarts')

const Iq =
  'M0 1C0 0.447716 0.447715 0 1 0H27C27.5523 0 28 0.447715 28 1V17.0513C28 17.6036 27.5523 18.0513 27 18.0513H21H17.9499C17.6638 18.0513 17.3914 18.1739 17.2016 18.388L14 22L10.7984 18.388C10.6086 18.1739 10.3362 18.0513 10.0501 18.0513H7H1C0.447715 18.0513 0 17.6036 0 17.0513V1Z'

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
  lineEchart.value = (Echarts as any).init(echartContainer.value)
  const options = {
    grid: {
      left: '2%',
      right: '2%',
      top: 35,
      bottom: '2%',
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
        data: [[date.at(0), xData.at(0)]],
        tooltip: {
          show: false
        },
        z: 3
      }
    ]
  }

  lineEchart.value.setOption(options)
}

const handelSaveImage = () => {
  const a = document.createElement('a')
  a.href = imgUrl.value
  a.download = `${props.aiSignalsShareData.baseToken?.symbol}.jpg`
  a.click()
}

const htmlToImage = async () => {
  try {
    const canvas = await html2canvas(shareImg.value, {
      backgroundColor: '#181818',
      useCORS: true, // 启用 CORS 支持
      allowTaint: false // 禁止污染
    })
    imgUrl.value = canvas.toDataURL('image/jpeg')
  } catch (error) {
    console.log(error)
  }
}

const resizeChart = () => {
  if (lineEchart.value) {
    lineEchart.value.resize()
  }
}

// 复制图片到剪贴板的函数
function copyImageToClipboard(imgUrl: string) {
  var img = new Image()
  img.src = imgUrl
  img.onload = function () {
    var canvas = document.createElement('canvas')
    var context: any = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0)

    canvas.toBlob(function (blob: any) {
      var item = new ClipboardItem({ 'image/png': blob })
      navigator.clipboard
        .write([item])
        .then(function () {
          customMessage({
            type: 'success',
            title: '图片已复制到剪贴板'
          })
        })
        .catch(function (err) {
          console.error('复制图片失败：', err)
        })
    })
  }
}

onMounted(async () => {
  await nextTick()
  await initEcharts()

  setTimeout(() => {
    htmlToImage()
  }, 1000)
})

window.addEventListener('resize', resizeChart)

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
})
</script>
<style scoped lang="scss">
.aisignals-dialog {
  background: #181818;
  :deep(.van-popup__close-icon) {
    font-size: 16px;
  }
  .aisignals-content {
    width: 660px;
    border-radius: 12px;
    background: #181818;
    padding-bottom: 24px;
    .aisignals-title {
      line-height: 57px;
      color: #fff;
      text-align: center;
      font-size: 16px;
    }
    .share-img-dom {
      width: 660px;
      height: 595px;
    }
    .aisignals-tips {
      line-height: 40px;
      text-align: right;
      padding-right: 18px;
      color: #71777a;
      font-size: 12px;
      border-top: 1px solid #1f2225;
      border-bottom: 1px solid #1f2225;
    }
    .aisignals-coin-info {
      padding: 18px;
      .logo {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }

      .symbol-txt {
        color: #fff;
        font-size: 18px;
        line-height: 1.2;
      }
      .address-txt {
        color: #e8e8e8;
        font-size: 12px;
        margin-top: 4px;
        line-height: 1.2;
      }
      .signal-box {
        .signal-txt {
          padding: 2px;
        }
        span {
          color: #f5f5f5;
          font-size: 12px;
          margin-right: 2px;
        }
        i {
          display: block;
          width: 2px;
          background-color: #d9d9d9;
          margin-right: 1.5px;
          border-radius: 1.5px;
        }

        i:nth-child(1) {
          height: 4px;
          background-color: var(--up-color);
        }
        i:nth-child(2) {
          height: 6px;
          background-color: var(--up-color);
        }
        i:nth-child(3) {
          height: 8px;
        }
        i:nth-child(4) {
          height: 10px;
          margin-right: 0;
        }

        .num {
          display: flex;
          width: 64px;
          height: 32px;
          padding: 2px 4px;
          justify-content: center;
          align-items: center;
          border-radius: 6px;
          background: rgba(239, 88, 88, 0.16);
          color: var(--down-color);
          font-size: 18px;
          margin-top: 4px;
          margin-left: 6px;
        }
      }
    }
    .kline-chart {
      padding: 0 24px;
      height: 202px;
      .echarts {
        width: 100%;
        height: 100%;
      }
    }
    .amount-box {
      padding: 0 24px;
      margin-top: 36px;
      .amount-content {
        height: 52px;
        border-radius: 6px;
        background: #212121;
        padding: 0 32px;
        font-size: 14px;
        span {
          color: #71777a;
          margin-right: 20px;
        }
        strong {
          color: #b4b4b4;
        }
      }
    }
    .push-box {
      margin: 18px 0;
      padding: 0 24px;
      font-size: 12px;
      .push-txt {
        display: flex;
        align-items: center;
        i {
          width: 4px;
          height: 4px;
          display: block;
          background-color: var(--up-color);
          border-radius: 50%;
        }
        span {
          color: #71777a;
          margin: 0 2px;
          white-space: nowrap;
        }
        strong {
          color: #b4b4b4;
        }
      }
    }
    .invite-box {
      padding: 0 24px 24px;
      .invite-content {
        padding: 12px;
        border-radius: 6px;
        background: #212121;
        line-height: 1.5;
        .text {
          font-size: 12px;
          color: #71777a;
        }
      }
      .invite-share-txt {
        padding-left: 24px;
        margin-top: 4px;
        span {
          color: #71777a;
          font-size: 12px;
        }
      }

      .url-content {
        margin-top: 6px;
        img {
          margin-right: 4px;
          width: 15px;
          height: 15px;
        }
        .icon-x {
          width: 12px;
          height: 12px;
          margin-left: 28px;
        }
        .icon-tg {
          width: 13px;
          height: 13px;
          margin-left: 28px;
        }
        span {
          color: #e8e8e8;
          font-size: 14px;
        }
      }
    }
    .share-items {
      padding: 0 24px;
      justify-content: space-around;
      color: #e8e8e8;
      font-size: 10px;
      .share-item {
        align-items: center;
      }
      .img-box {
        width: 48px;
        height: 48px;
        background-color: #212121;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;
        img {
          width: 18px;
          height: 18px;
        }
        .icon-tg {
          width: 16px;
          height: 16px;
        }
        .icon-x {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
}
</style>
