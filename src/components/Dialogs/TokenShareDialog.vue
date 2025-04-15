<template>
  <van-popup
    v-model:show="dialogVisible"
    round
    :close-on-click-overlay="false"
    @click-close-icon="handleClose"
    class="token-dialog"
    closeable
  >
    <div class="share-img-dom" ref="shareImg">
      <img src="@/assets/img/share-bac.svg" alt="" class="img" />
      <div class="display-flex flex-direction-col share-content">
        <div class="tokenShareTitle display-flex align-items-center justify-content-sp">
          <div class="logo-box display-flex align-items-center">
            <img src="@/assets/icons/logo.svg" alt="" class="logo" />
            <span>HelloDex</span>
          </div>
          <div class="title-url display-flex align-items-center">
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
        <div class="tokenShareLine"></div>
        <div class="tokenShareBody">
          <div class="tokenInfo">
            <div class="coin-logo display-flex align-items-center">
              <div class="logo">
                <el-image :src="shareCoinInfo.logo" alt="" class="img">
                  <template #error>
                    <img src="@/assets/icons/logo1.svg" alt="" class="img" />
                  </template>
                </el-image>
                <img :src="chainLogoObj[shareCoinInfo.chainCode]" alt="" class="chainCode" />
              </div>
              <span class="symbol-txt">{{ shareCoinInfo.symbol }}</span>
            </div>
            <PercentageNotbg :value="shareCoinInfo.totalEarnRate || 0" class="shareCoin-Rate" />
            <div class="display-flex align-items-center justify-content-sp market-txt">
              <span>买入市值：</span>
              <strong>${{ numberFormat(shareCoinInfo.averageBuyMarketCap) }}</strong>
            </div>
            <div class="display-flex align-items-center justify-content-sp market-txt">
              <span>当前市值：</span>
              <strong>${{ numberFormat(shareCoinInfo.nowMarketCap) }}</strong>
            </div>
            <div class="display-flex align-items-center flex-direction-col qrcode-box">
              <p>冲狗基金-免费送U</p>
              <img :src="qrcodeUrl" alt="" />
            </div>
          </div>
          <div class="tokenKLine">
            <!-- <CoinsAreaChart :chart-data="chartData" /> -->
            <div id="token-echarts" ref="echartContainer"></div>
          </div>
        </div>
        <p class="display-flex align-items-center flex-direction-col txt">
          普通用户撑起整个Web3，教育平台要把80%利润分给用户
        </p>
      </div>
    </div>
    <p class="share-down" @click="downLoading ? null : handelSaveImage()">
      <el-icon class="is-loading" :size="14" v-if="downLoading">
        <Loading />
      </el-icon>
      分享收益
    </p>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject, watch, onUnmounted, nextTick } from 'vue'
import html2canvas from 'html2canvas'
import { numberFormat } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'

const globalStore = useGlobalStore()

const i18n = useI18n()
const { chainLogoObj } = globalStore

const emit = defineEmits(['close'])

const downLoading = ref<boolean>(false)
const shareImg = ref()

const props: any = defineProps({
  tokenShareVisible: {
    type: [Boolean],
    default: false
  },
  shareCoinInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  chartData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  qrcodeUrl: {
    type: String,
    default: ''
  }
})

const dialogVisible: any = computed({
  // getter
  get() {
    return props.tokenShareVisible
  },
  // setter
  set(newValue) {
    return newValue
  }
})

const handleClose = () => {
  emit('close', false)
}

// 获取 echart 挂载的DOM节点
const echartContainer = ref()
const tokenKLineEchart = ref<any>(null)

// 通过 inject 接收 Echarts
const Echarts = inject('$echarts')

const lineData = computed(() => {
  return props.chartData?.kLine?.map((item: any) => item.O) || []
})

const colorObj = computed(() => {
  return props.chartData?.options || {}
})

// echarts初始化
const initEcharts = () => {
  tokenKLineEchart.value = (Echarts as any).init(echartContainer.value)
  const option = {
    color: [colorObj.value.topColor],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#151515'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        },
        axisLabel: {
          show: false
        }
      }
    ],
    series: [
      {
        name: 'K 线',
        type: 'line',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: colorObj.value.shadowTopColor // 0% 处的颜色
              },
              {
                offset: 1,
                color: colorObj.value.shadowBottomColor // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        smooth: true,
        symbol: 'none',
        emphasis: {
          focus: 'series'
        },
        data: lineData.value
      }
    ]
  }
  tokenKLineEchart.value.setOption(option)
}

const resizeChart = () => {
  if (tokenKLineEchart.value) {
    tokenKLineEchart.value.resize()
  }
}

watch(
  () => props.holdingCoinsTabInfo,
  (value) => {
    tokenKLineEchart.value.dispose()
    initEcharts()
  },
  { deep: true }
)

const handelSaveImage = async () => {
  downLoading.value = true
  await html2canvas(shareImg.value, {
    backgroundColor: '#171717'
  }).then((canvas) => {
    downLoading.value = false
    let url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.shareCoinInfo.symbol}.png`
    a.click()
  })
}

onMounted(() => {
  nextTick(() => {
    initEcharts()
  })
})

window.addEventListener('resize', resizeChart)

onUnmounted(() => {
  window.removeEventListener('resize', initEcharts)
})
</script>
<style lang="scss" scoped>
.token-dialog {
  background: rgba(0, 0, 0, 0.05);
  .share-img-dom {
    position: relative;
    width: 800px;
    height: 475px;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .share-content {
    padding: 30px 24px 24px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .tokenShareTitle {
    width: 100%;
    .logo-box {
      width: 100%;
      font-size: 20px;
      color: var(--font-color-default);
      font-family: 'PingFangSC-Heavy';
      .logo {
        width: 48px;
        height: 48px;
        margin-right: 4px;
      }
    }
    .title-url {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      .icon-x {
        width: 13px;
        height: 13px;
        margin-right: 8px;
      }

      .icon-tg {
        width: 15px;
        height: 15px;
        margin-right: 8px;
      }
      .tg {
        margin-left: 20px;
      }
    }
  }
  .tokenShareLine {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.05);
    margin: 12px 0;
  }
  .tokenShareBody {
    width: 100%;
    .tokenInfo {
      width: 43%;
      float: left;
      .coin-logo {
        margin: 12px 0 0;

        .logo,
        .img {
          width: 40px;
          height: 40px;
          position: relative;
        }
        .logo {
          margin-right: 12px;
        }
        .img {
          border-radius: 50%;
        }
        .chainCode {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          position: absolute;
          bottom: -2px;
          right: -2px;
        }
        .symbol-txt {
          font-size: 24px;
          font-family: 'PingFangSC-Heavy';
          color: var(--font-color-default);
        }
      }
      .shareCoin-Rate {
        font-family: 'PingFangSC-Heavy';
        font-size: 32px;
        line-height: 1.8;
        margin-bottom: 18px;
      }
      .market-txt {
        font-size: 14px;
        line-height: 45px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.6);
      }
      .qrcode-box {
        font-size: 13px;
        margin-top: 8px;
        color: rgba(255, 255, 255, 0.6);
        p {
          margin-bottom: 8px;
        }
        img {
          width: 80px;
          height: 80px;
        }
      }
    }
    .tokenKLine {
      width: 55%;
      height: 100%;
      border-radius: 16px;
      float: right;
      background: #151515;
      #token-echarts {
        width: 100%;
        height: 100%;
      }
    }
  }
  .txt {
    margin-top: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }
  .share-down {
    display: flex;
    width: 100px;
    height: 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #101114;
    border-radius: 8px;
    background: #f5f5f5;
    font-family: 'PingFangSC-Medium';
    cursor: pointer;
    position: absolute;
    bottom: 12px;
    right: 24px;
    z-index: 2;
  }
}
</style>
