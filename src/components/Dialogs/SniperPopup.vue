<template>
  <van-popup v-model:show="popupShow" round closeable class="sniper-popup" @close="handleClose">
    <div class="sniper-popup-box">
      <div class="sniper-popup-title">
        {{
          tokenInfo?.baseSymbol + ' 前 ' + (earliest100TraderData?.traders?.length || 0) + ' 买家'
        }}
      </div>
      <div class="sniper-item-box">
        <div
          class="sniper-item"
          v-for="(item, index) in earliest100TraderData?.traders || []"
          :key="index"
        >
          <el-tooltip :content="tips(item)" effect="light" placement="bottom">
            <div class="sniper-info">
              <span class="scale-in" v-if="item.sellState == 0 && item.buyAgain == 1"></span>
              <span
                class="position-unchanged"
                v-if="item.sellState == 0 && item.buyAgain == 0"
              ></span>
              <span class="sell-all" v-if="item.sellState == 1"></span>
              <svg-icon name="sellpart" class="sellpart" v-if="item.sellState == 2"></svg-icon>
              <svg-icon name="snipe-icon" class="snipe-icon" v-if="item.sniper"></svg-icon>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="tips-box display-flex align-items-center justify-content-sp">
        <div class="display-flex flex-direction-col">
          <div class="display-flex align-items-center">
            <i class="position-unchanged"></i>
            <span>持仓不变：{{ numberFormat(earliest100TraderData?.sellZeroCount) || 0 }}</span>
          </div>
          <div class="display-flex align-items-center">
            <svg-icon name="sellpart" class="sellpart"></svg-icon>
            <span>卖出部分：{{ numberFormat(earliest100TraderData?.sellPartCount) || 0 }}</span>
          </div>
        </div>
        <div class="display-flex flex-direction-col">
          <div class="display-flex align-items-center">
            <i class="scale-in"></i>
            <span>加仓：{{ numberFormat(earliest100TraderData?.buyAgain) || 0 }}</span>
          </div>
          <div class="display-flex align-items-center">
            <i class="sell-all"></i>
            <span>全部卖出：{{ numberFormat(earliest100TraderData?.sellFullCount) || 0 }}</span>
          </div>
        </div>
      </div>
      <div class="txt">
        总购买: {{ numberFormat(earliest100TraderData?.firstBuyTotalRatio || 0) }}%
      </div>
      <div class="txt">
        当前持仓: {{ numberFormat(earliest100TraderData?.currTotalRatio || 0) }}%
      </div>
      <!-- <div class="txt">前10持仓大户: 16.94%</div> -->
      <div class="logo-tip display-flex align-items-center justify-content-center">
        <svg-icon name="coinDEX" class="logo-svg"></svg-icon>
        <span>HelloDex</span>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { numberFormat } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

const i18n = useI18n()

const emit = defineEmits(['close'])

const props: any = defineProps({
  sniperPopup: {
    type: [Boolean],
    default: false
  },
  tokenInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  earliest100TraderData: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const popupShow: any = computed({
  // getter
  get() {
    return props.sniperPopup
  },
  // setter
  set(newValue) {
    return newValue
  }
})

const handleClose = () => {
  emit('close', false)
}

const tips = (item: any) => {
  if (item.sellState == 0 && item.buyAgain == 1) {
    return '加仓'
  }

  if (item.sellState == 0 && item.buyAgain == 0) {
    return '持仓不变'
  }

  if (item.sellState == 1) {
    return '全部卖出'
  }

  if (item.sellState == 2) {
    return '卖出部分'
  }
}

onMounted(() => {})
</script>

<style lang="scss">
.sniper-popup {
  width: 100%;
  min-height: 2.6667rem;
  padding: 16px 0.48rem;
  background: #333;
  .sniper-popup-box {
    .sniper-popup-title {
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 0.48rem;
    }
    .sniper-item-box {
      display: grid;
      gap: 0.16rem 0;
      grid-template-columns: repeat(10, 0.64rem);
      justify-content: space-between;
      .sniper-info {
        width: 0.64rem;
        height: 0.64rem;
        position: relative;
        cursor: pointer;
      }
      span {
        display: block;
        width: 0.64rem;
        height: 0.64rem;
        border-radius: 50%;
      }
      .position-unchanged {
        background: var(--up-color);
      }
      .scale-in {
        background: rgb(85, 163, 255);
      }
      .sell-all {
        border: 0.1067rem solid var(--down-color);
      }
      .sellpart {
        width: 0.64rem;
        height: 0.64rem;
      }
      .snipe-icon {
        width: 0.32rem;
        height: 0.32rem;
        position: absolute;
        right: -0.0267rem;
        bottom: -0.0267rem;
        background-color: #141414;
        border-radius: 50%;
      }
    }
    .tips-box {
      font-size: 0.32rem;
      margin-top: 0.64rem;
      margin-bottom: 0.32rem;
      line-height: 1.8;
      i {
        display: block;
        width: 0.2667rem;
        height: 0.2667rem;
        border-radius: 50%;
        margin-right: 0.16rem;
      }
      .position-unchanged {
        background: var(--up-color);
      }
      .scale-in {
        background: rgb(85, 163, 255);
      }
      .sell-all {
        border: 0.0533rem solid var(--down-color);
      }
      .sellpart {
        width: 0.2667rem;
        height: 0.2667rem;
        margin-right: 0.16rem;
      }
    }
    .txt {
      font-size: 0.32rem;
      line-height: 1.2;
      margin-top: 0.16rem;
    }
    .logo-tip {
      margin-top: 0.64rem;
      font-size: 0.32rem;
      .logo-svg {
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.16rem;
      }
    }
  }
}
</style>
