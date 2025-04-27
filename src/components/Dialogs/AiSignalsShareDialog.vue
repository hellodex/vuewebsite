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
      <div class="aisignals-tips">用AI信号买聪明钱</div>
      <div class="aisignals-coin-info display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center">
          <img src="@/assets/img/0xSun.png" alt="" class="logo" />
          <div class="display-flex flex-direction-col">
            <span class="symbol-txt">signal</span>
            <span class="address-txt">7ySm...pump</span>
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
            <div class="num">2.4X</div>
          </div>
        </div>
      </div>
      <div class="kline-chart"></div>
      <div class="amount-box">
        <div class="amount-content display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <span>首次推送市值</span>
            <strong>$54.78k</strong>
          </div>
          <div class="display-flex align-items-center">
            <span>推送后最高市值</span>
            <strong>$99.78k</strong>
          </div>
        </div>
      </div>
      <div class="push-box display-flex align-items-center justify-content-sp">
        <div class="push-txt">
          <i></i>
          <span>推送次数</span>
          <strong>12</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入金额</span>
          <strong>76.98</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入地址</span>
          <strong>12</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入次数</span>
          <strong>12</strong>
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
        <div class="share-item display-flex flex-direction-col">
          <div class="img-box">
            <img src="@/assets/icons/copy1.svg" alt="" />
          </div>
          <span>复制图片</span>
        </div>
        <div class="share-item display-flex flex-direction-col">
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
import { computed } from 'vue'

const emit = defineEmits(['close'])

const props: any = defineProps({
  aiSignalsShareVisible: {
    type: [Boolean],
    default: false
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
</script>
<style scoped lang="scss">
.aisignals-dialog {
  background: #181818;
  :deep(.van-popup__close-icon) {
    font-size: 18px;
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
      font-size: 18px;
    }
    .aisignals-tips {
      line-height: 40px;
      text-align: right;
      padding-right: 18px;
      color: #71777a;
      font-size: 16px;
      border-top: 1px solid #1f2225;
      border-bottom: 1px solid #1f2225;
    }
    .aisignals-coin-info {
      padding: 24px;
      .logo {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        margin-right: 9px;
      }

      .symbol-txt {
        color: #fff;
        font-size: 32px;
        line-height: 1.2;
      }
      .address-txt {
        color: #e8e8e8;
        font-size: 18px;
        margin-top: 12px;
        line-height: 1.2;
      }
      .signal-box {
        .signal-txt {
          padding: 8px 4px;
        }
        span {
          color: #f5f5f5;
          font-size: 14px;
          margin-right: 6px;
        }
        i {
          display: block;
          width: 3px;
          background-color: #d9d9d9;
          margin-right: 1.5px;
          border-radius: 1.5px;
        }

        i:nth-child(1) {
          height: 5px;
          background-color: var(--up-color);
        }
        i:nth-child(2) {
          height: 8px;
          background-color: var(--up-color);
        }
        i:nth-child(3) {
          height: 10px;
        }
        i:nth-child(4) {
          height: 13px;
          margin-right: 0;
        }

        .num {
          display: flex;
          width: 86px;
          height: 36px;
          padding: 2px 4px;
          justify-content: center;
          align-items: center;
          border-radius: 6px;
          background: rgba(239, 88, 88, 0.16);
          color: var(--down-color);
          font-size: 20px;
          font-weight: 600;
          margin-top: 6px;
        }
      }
    }
    .kline-chart {
      padding: 0 24px;
      height: 202px;
    }
    .amount-box {
      padding: 0 24px;
      margin-top: 12px;
      .amount-content {
        height: 52px;
        border-radius: 6px;
        background: #212121;
        padding: 0 26px;
        font-size: 16px;
        span {
          color: #71777a;
          margin-right: 6px;
        }
        strong {
          color: #b4b4b4;
        }
      }
    }
    .push-box {
      margin: 20px 0;
      padding: 0 24px;
      font-size: 16px;
      .push-txt {
        display: flex;
        align-items: center;
        i {
          width: 6px;
          height: 6px;
          display: block;
          background-color: var(--up-color);
          border-radius: 50%;
        }
        span {
          color: #71777a;
          margin: 0 4px;
          white-space: nowrap;
        }
        strong {
          color: #b4b4b4;
        }
      }
    }
    .invite-box {
      padding: 0 24px;
      margin-bottom: 20px;
      .invite-content {
        padding: 12px;
        border-radius: 6px;
        background: #212121;
        line-height: 1.5;
        .text {
          font-size: 14px;
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
          width: 18px;
          height: 18px;
        }
        .icon-x {
          width: 15px;
          height: 15px;
          margin-left: 28px;
        }
        .icon-tg {
          width: 16px;
          height: 16px;
          margin-left: 28px;
        }
        span {
          color: #e8e8e8;
          font-size: 16px;
        }
      }
    }
    .share-items {
      padding: 0 24px;
      justify-content: space-around;
      color: #e8e8e8;
      font-size: 12px;
      .share-item {
        cursor: pointer;
      }
      .img-box {
        width: 48px;
        height: 48px;
        background-color: #212121;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 4px;
        img {
          width: 24px;
          height: 24px;
        }
        .icon-tg {
          width: 22px;
          height: 22px;
        }
        .icon-x {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}
</style>
