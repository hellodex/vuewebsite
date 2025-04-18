<template>
  <el-dialog
    v-model="dialogVisible"
    :before-close="handleClose"
    :title="`${baseInfo?.tokenInfo?.baseSymbol} 前 ${earliest100TraderData?.traders?.length || 0} 买家`"
    top="100px"
    class="sniper-dialog"
  >
    <div class="sniper-dialog-box">
      <div class="sniper-item-box">
        <div
          class="sniper-item"
          v-for="(item, index) in earliest100TraderData?.traders || []"
          :key="index"
        >
          <!-- @click="handelRouter(item)" -->
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
        <svg-icon name="logo" class="logo-svg"></svg-icon>
        <span>HelloDex</span>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import { numberFormat } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

const i18n = useI18n()

const router = useRouter()

const emit = defineEmits(['close'])

const props: any = defineProps({
  sniperDialogVisible: {
    type: [Boolean],
    default: false
  },
  baseInfo: {
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

const dialogVisible: any = computed({
  // getter
  get() {
    return props.sniperDialogVisible
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

const handelRouter = (item: any) => {
  router.push(`/${props.baseInfo.chainInfo.chainCode}/address/${item.wallet}`)
}

onMounted(() => {})
</script>

<style lang="scss">
.sniper-dialog {
  width: 350px;
  min-height: 200px;
  .el-dialog__title {
    font-family: 'PingFangSC-Heavy';
    color: #f5f5f5;
  }
  .sniper-dialog-box {
    .sniper-item-box {
      display: grid;
      gap: 9px;
      // grid-template-rows: repeat(7, 23px);
      grid-template-columns: repeat(10, 23px);

      .sniper-info {
        width: 23px;
        height: 23px;
        position: relative;
        cursor: pointer;
      }
      span {
        display: block;
        width: 23px;
        height: 23px;
        border-radius: 50%;
      }
      .position-unchanged {
        background: var(--up-color);
      }
      .scale-in {
        background: rgb(85, 163, 255);
      }
      .sell-all {
        border: 4px solid var(--down-color);
      }
      .sellpart {
        width: 23px;
        height: 23px;
        color: var(--down-color);
      }
      .snipe-icon {
        width: 12px;
        height: 12px;
        position: absolute;
        right: -2px;
        bottom: -2px;
        background-color: #141414;
        border-radius: 50%;
      }
    }
    .tips-box {
      font-size: 14px;
      margin-top: 24px;
      margin-bottom: 12px;
      line-height: 1.8;
      color: #f5f5f5;
      i {
        display: block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-right: 6px;
      }
      .position-unchanged {
        background: var(--up-color);
      }
      .scale-in {
        background: rgb(85, 163, 255);
      }
      .sell-all {
        border: 3px solid var(--down-color);
      }
      .sellpart {
        width: 16px;
        height: 16px;
        margin-right: 6px;
        color: var(--down-color);
      }
    }
    .txt {
      font-size: 14px;
      line-height: 1.2;
      margin-top: 6px;
      color: #f5f5f5;
    }
    .logo-tip {
      margin-top: 24px;
      font-size: 16px;
      font-family: 'PingFangSC-Heavy';
      .logo-svg {
        width: 25.6px;
        height: 25.6px;
        margin-right: 6px;
      }
    }
  }
}
</style>
