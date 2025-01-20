<template>
  <el-dialog
    v-model="dialogVisible"
    :before-close="handleClose"
    class="share-dialog"
    :show-close="false"
    align-center
  >
    <div class="share-dialog-box" ref="shareImg">
      <img src="@/assets/img/share-bac.png" alt="" class="share-bac" />
      <div class="share-dialog-main">
        <img src="@/assets/img/share-title.png" alt="" class="share-title" />
        <img src="@/assets/img/share-img.png" alt="" class="share-img" />
        <div class="share-main display-flex align-items-center justify-content-sp">
          <div class="share-main-left">
            <div class="display-flex align-items-center justify-content-sp price-text">
              <div class="display-flex align-items-center">
                <span class="logo">
                  <img
                    :src="props.baseInfo.tokenInfo?.logo"
                    class="icon-coin"
                    v-if="props.baseInfo.tokenInfo?.logo"
                  />
                  <img src="@/assets/icons/logo1.svg" alt="" class="icon-coin" v-else />
                  <img
                    :src="getAssetsFile(props.baseInfo.chainInfo?.chainCode)"
                    class="chainCode"
                    alt=""
                  />
                </span>
                <span>{{ props.baseInfo.tokenInfo?.baseSymbol || '-' }}</span>
              </div>
              <strong :class="priceIncrease.increase[0] === '-' ? 'down-price' : 'up-price'"
                >${{ numberFormat(priceIncrease.price) }}</strong
              >
            </div>
            <div class="display-flex align-items-center justify-content-sp price-increase">
              <div
                class="display-flex align-items-center flex-direction-col price-increase-item"
                :class="
                  props.pairInfo.chg5m[0] === '-' ? 'price-increase-down' : 'price-increase-up'
                "
              >
                <span>5m</span>
                <PercentageNotbg :value="props.pairInfo.chg5m || 0" />
              </div>
              <div
                class="display-flex align-items-center flex-direction-col price-increase-item"
                :class="
                  props.pairInfo.chg1h[0] === '-' ? 'price-increase-down' : 'price-increase-up'
                "
              >
                <span>1h</span>

                <PercentageNotbg :value="props.pairInfo.chg1h || 0" />
              </div>
              <div
                class="display-flex align-items-center flex-direction-col price-increase-item"
                :class="
                  props.pairInfo.chg4h[0] === '-' ? 'price-increase-down' : 'price-increase-up'
                "
              >
                <span>4h</span>

                <PercentageNotbg :value="props.pairInfo.chg4h || 0" />
              </div>
              <div
                class="display-flex align-items-center flex-direction-col price-increase-item"
                :class="
                  props.pairInfo.chg1d[0] === '-' ? 'price-increase-down' : 'price-increase-up'
                "
              >
                <span>24h</span>
                <PercentageNotbg :value="props.pairInfo.chg1d || 0" />
              </div>
            </div>
          </div>
          <div class="share-main-right display-flex flex-direction-col">
            <div class="display-flex justify-content-sp align-items-center">
              <div class="display-flex align-items-center text-item">
                <span>总市值</span>
                <span>{{ numberFormat(props.pairInfo?.circulationVol || 0) }}</span>
              </div>
              <div class="display-flex align-items-center text-item">
                <span>24H交易次数</span>
                <span>{{ numberFormat(props.pairInfo.tradeCount) }}</span>
              </div>
            </div>
            <div class="display-flex justify-content-sp align-items-center text-margin">
              <div class="display-flex align-items-center text-item">
                <span>{{ i18n.t('kChart.Liquidity1') }}</span>
                <span>{{ numberFormat(props.pairInfo.tvl) }}</span>
              </div>
              <div class="display-flex align-items-center text-item">
                <span>24H交易额</span>
                <span>{{ numberFormat(props.pairInfo.tradeTvl) }}</span>
              </div>
            </div>
            <div class="display-flex justify-content-sp align-items-center">
              <div class="display-flex align-items-center text-item">
                <span>{{ i18n.t('kChart.LPHolders') }}</span>
                <span>{{ numberFormat(props.pairInfo.holders) }}</span>
              </div>
              <div class="display-flex align-items-center text-item">
                <span>{{ i18n.t('kChart.Lowest1Day') }}</span>
                <span>{{ numberFormat(props.pairInfo?.low1d || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="share-coin display-flex justify-content-sp align-items-center">
          <div class="share-coin-left">
            <img src="@/assets/img/share-icon.png" alt="" class="share-icon" />
          </div>
          <div class="share-coin-right display-flex flex-direction-col">
            <div class="display-flex align-items-center">
              <span>免费送币</span>
              <img src="@/assets/icons/icon-gift.svg" alt="" class="icon-gift" />
            </div>
            <p>
              填写邀请码：{{
                initPointsData.isInvited === '1' ? initPointsData.invitationCode : 'hellodex'
              }}
              后可获得平台币
            </p>
          </div>
        </div>
        <div class="operate-box display-flex justify-content-sp align-items-center">
          <div class="display-flex align-items-center">
            <div class="qc">
              <img :src="qrcodeUrl" alt="" class="qrcode-img" />
            </div>
            <div class="scan-box display-flex align-items-center">
              <img src="@/assets/icons/icon-scan.svg" alt="" class="icon-scan" />
              <span>打开HelloDex App扫一扫 立即交易该币种!</span>
            </div>
          </div>
          <div class="invite-box display-flex align-items-center">
            <span class="txt">邀请链接</span>
            <span class="url">{{ inviteUrl }}</span>
            <img src="@/assets/icons/copy.svg" alt="" class="copy" v-copy="inviteUrl" />
          </div>
          <div class="save-img-btn" @click="saveImage">保存图片</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import { numberFormat } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import { APIinitPointsPage } from '@/api'

const globalStore = useGlobalStore()

const i18n = useI18n()
const shareImg = ref()
const qrcodeUrl = ref('')
const inviteUrl = `${window.location.origin}/Invite`

const initPointsData = ref<any>({})

const emit = defineEmits(['close'])

const props: any = defineProps({
  shareDialogVisible: {
    type: [Boolean],
    default: false
  },
  baseInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  pairInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const address = computed(() => globalStore.walletInfo.address)
const isConnected = computed(() => globalStore.walletInfo.isConnected)

const dialogVisible: any = computed({
  // getter
  get() {
    return props.shareDialogVisible
  },
  // setter
  set(newValue) {
    return newValue
  }
})
const useSubscribeKChart = useSubscribeKChartInfo()

const priceIncrease = computed(() => {
  return {
    price: useSubscribeKChart.subscribeKChartInfo?.C || 0,
    increase: useSubscribeKChart.subscribeKChartInfo?.chg || 0
  }
})

// 获取assets静态资源
const getAssetsFile = (url: string) => {
  return new URL(`../../assets/icons/coin${url}.svg`, import.meta.url).href
}

const handleClose = () => {
  emit('close', false)
}

const saveImage = async () => {
  await html2canvas(shareImg.value, {
    backgroundColor: '#000'
  }).then((canvas) => {
    let url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'share.png'
    a.click()
  })
}

const initPoints = async () => {
  const res: any = await APIinitPointsPage({
    walletAddress: address.value
  })

  initPointsData.value = res
}

// 监听地址和链ID变化
watch(address, (newValue) => {
  newValue && initPoints()
})

onMounted(async () => {
  console.log()
  isConnected.value && initPoints()
  try {
    qrcodeUrl.value = await QRCode.toDataURL(window.location.href, { errorCorrectionLevel: 'H' })
  } catch (err) {
    console.error(err)
  }
})
</script>

<style lang="scss">
.share-dialog {
  width: 800px;
  height: 387px;
  background-color: #000;
  padding: 0;
  overflow: hidden;
  .share-dialog-box {
    position: relative;
    width: 800px;
    height: 387px;
  }
  .el-dialog__header {
    padding-bottom: 0;
  }
  .share-dialog-main {
    position: absolute;
    top: 0;
  }
  .share-dialog-main {
    width: 100%;
    z-index: 3;
    padding-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .share-img {
    width: 737px;
    height: auto;
    margin-top: 18px;
  }
  .share-main,
  .share-coin,
  .operate-box {
    width: 737px;
  }
  .share-main-left {
    width: 348px;
  }
  .share-main-right {
    width: 335px;
  }

  .price-text {
    span {
      color: #fff;
      font-size: 16px;
    }
    strong {
      font-size: 18px;
      font-weight: normal;
    }
    .up-price {
      color: var(--up-color);
    }
    .down-price {
      color: var(--down-color);
    }
    .logo,
    .icon-coin {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    .logo {
      margin-right: 8px;
      position: relative;
      .chainCode {
        width: 12px;
        height: 12px;
        position: absolute;
        right: -1px;
        bottom: -1px;
      }
    }
  }
  .price-increase {
    margin-top: 14px;
  }
  .price-increase-item {
    width: 78px;
    height: 43px;
    border-radius: 12px;
    justify-content: center;
    span {
      font-size: 10px;
    }
    span:nth-child(1) {
      color: #fff;
    }
  }
  .price-increase-up {
    background: #212f34;
    strong {
      color: var(--up-color);
      font-weight: normal;
    }
  }

  .price-increase-down {
    background: #342631;
    strong {
      color: var(--down-color);
      font-weight: normal;
    }
  }
  .text-item {
    width: 180px;
    justify-content: space-between;
    span {
      color: #8b92a1;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 1.44px;
      margin-right: 10px;
      text-align: right;
    }
    span:last-child {
      color: #fff;
      text-align: right;
      margin: 0;
    }
  }
  .text-item:last-child {
    margin-left: 25px;
  }
  .text-margin {
    margin: 12px 0;
  }
  .share-coin {
    margin-top: 27px;
    margin-bottom: 33px;
  }
  .share-coin-left {
    width: 348px;
  }
  .share-coin-right {
    width: 335px;
  }
  .share-icon {
    width: 73.3px;
  }
  .icon-gift {
    width: 12px;
    height: 12px;
  }
  .share-coin-right {
    span {
      color: #8b92a1;
      font-size: 12px;
      font-weight: normal;
      margin-right: 6px;
    }
    p {
      color: #fff;
      margin-top: 6px;
      font-size: 10px;
      font-weight: normal;
    }
  }
  .qc {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #d9d9d9;
    margin-right: 21px;
    overflow: hidden;
  }
  .qrcode-img {
    width: 32px;
    height: 32px;
  }

  .scan-box {
    width: 200px;
    padding: 4px 25px;
    border-radius: 16px;
    border: 1px solid #fff;
    span {
      color: #fff;
      font-size: 8px;
      font-weight: normal;
      letter-spacing: 0.48px;
    }
  }
  .icon-scan {
    width: 21px;
    height: 19px;
    margin-right: 21px;
  }
  .invite-box {
    border-radius: 20px;
    background: #181818;
    padding: 8px;
    .txt {
      color: #9a9da6;
      font-size: 10px;
      font-weight: normal;
      letter-spacing: 0.96px;
    }
    .url {
      color: #cecfd2;
      font-size: 10px;
      font-weight: normal;
      margin: 0 10px;
    }
    .copy {
      width: 11px;
      height: 11px;
    }
  }
  .save-img-btn {
    width: 143px;
    height: 32px;
    border-radius: 20px;
    color: #24272f;
    font-size: 12px;
    letter-spacing: 0.72px;
    background: #fff;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
  }
}
</style>
