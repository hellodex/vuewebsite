<template>
  <van-popup
    v-model:show="dialogVisible"
    round
    :close-on-click-overlay="false"
    @click-close-icon="handleClose"
    class="token-dialog"
    closeable
  >
    <div class="display-flex flex-direction-col">
      <div class="tokenShareTitle display-flex align-items-center justify-content-sp">
        <div class="logo-box display-flex align-items-center">
          <svg-icon name="logo" class="logo"></svg-icon>
          <span>HelloDex</span>
        </div>
        <div class="title-url display-flex align-items-center">
          <div class="display-flex align-items-center">
            <svg-icon name="x" class="icon-x"></svg-icon>
            <span>https://x.com/HelloDex_io</span>
          </div>
          <div class="tg display-flex align-items-center">
            <svg-icon name="tg-app" class="icon-tg"></svg-icon>
            <span>https://lnk.bio/HelloDex</span>
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
                  <svg-icon name="logo1" class="img"></svg-icon>
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
          <CoinsAreaChart :chart-data="chartData" />
        </div>
      </div>
      <p class="display-flex align-items-center flex-direction-col txt">
        普通用户撑起整个Web3，教育平台要把80%利润分给用户
      </p>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'

import { numberFormat } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import CoinsAreaChart from '@/adapter/components/CoinsAreaChart.vue'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'

const globalStore = useGlobalStore()

const i18n = useI18n()
const { chainLogoObj } = globalStore

const emit = defineEmits(['close'])

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

onMounted(() => {})
</script>
<style lang="scss" scoped>
.token-dialog {
  background-color: #171717;
  padding: 48px 24px 24px;
  width: 800px;
  .tokenShareTitle {
    width: 100%;
    .logo-box {
      width: 100%;
      font-size: 24px;
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
        margin-left: 16px;
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
      width: 45%;
      float: left;
      .coin-logo {
        margin: 12px 0;

        .logo,
        .img {
          width: 42px;
          height: 42px;
          position: relative;
        }
        .logo {
          margin-right: 12px;
        }
        .img {
          border-radius: 50%;
        }
        .chainCode {
          width: 18px;
          height: 18px;
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
        line-height: 52px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .qrcode-box {
        font-size: 16px;
        margin-top: 30px;
        p {
          margin-bottom: 18px;
        }
        img {
          width: 150px;
          height: 150px;
        }
      }
    }
    .tokenKLine {
      width: 55%;
      height: 450px;
      border-radius: 16px;
      float: right;
      position: relative;
      z-index: 2;
    }
  }
  .txt {
    margin-top: 24px;
    font-size: 16px;
    line-height: 1.8;
  }
}
</style>
