<template>
  <el-skeleton style="width: 100%" :loading="baseInfo?.tradingLoading" animated>
    <template #template>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 74px;
          padding: 0 16px;
        "
      >
        <div style="display: flex; align-items: center; width: 45%">
          <el-skeleton-item
            variant="circle"
            style="min-width: 44px; max-width: 44px; height: 44px"
          />
          <div style="display: flex; flex-direction: column; width: 100%; margin-left: 12px">
            <el-skeleton-item variant="text" style="width: 50%; margin-bottom: 10px" />
            <el-skeleton-item variant="text" style="width: 50%" />
          </div>
        </div>
        <div style="display: flex; flex-direction: column; width: 18%">
          <el-skeleton-item variant="text" style="width: 100%; margin-bottom: 10px" />
          <el-skeleton-item variant="text" style="width: 100%" />
        </div>
      </div>
    </template>
    <template #default>
      <div class="display-flex align-items-center justify-content-sp base-info">
        <div class="display-flex align-items-center">
          <Favorite :coinInfo="baseInfo?.chainInfo" />
          <span class="logo">
            <el-image :src="baseInfo?.tokenInfo?.logo" alt="" class="baseInfo-img">
              <template #error>
                <svg-icon name="logo1" class="baseInfo-img"></svg-icon>
              </template>
            </el-image>
            <svg-icon :name="'coin' + baseInfo?.chainInfo?.chainCode" class="chainCode"></svg-icon>
          </span>
          <div class="display-flex flex-direction-col">
            <div class="display-flex align-items-center">
              <div class="display-flex align-items-center coin-text font-family-Heavy">
                <span>{{
                  MAIN_COIN[baseInfo?.tokenInfo?.baseSymbol] ||
                  baseInfo?.tokenInfo?.baseSymbol ||
                  '-'
                }}</span>
                <span class="coin-sub-txt">/{{ baseInfo?.tokenInfo?.quoteSymbol || '-' }}</span>
              </div>
              <div class="display-flex align-items-center">
                <svg-icon name="icon-pc" class="icon-pc"></svg-icon>
                <svg-icon name="twitter-pump" class="icon-chat" @click="handelIcon"></svg-icon>
                <svg-icon name="telegram-pump" class="icon-chat" @click="handelIcon"></svg-icon>
                <a
                  :href="`https://x.com/search?q=${baseInfo?.tokenInfo?.baseAddress}`"
                  target="_blank"
                  class="icon-chat"
                >
                  <el-icon size="16"><Search /></el-icon>
                </a>
              </div>
              <div class="increase-text display-flex align-items-center font-family-Heavy">
                <span :class="priceIncrease.increase[0] === '-' ? 'down-color' : 'up-color'"
                  >${{ numberFormat(priceIncrease.price || 0) }}</span
                >
                <PercentageChange :value="priceIncrease.increase" />
              </div>
            </div>
            <div class="display-flex align-items-center address-text">
              <div
                class="info-txt font-family-Medium display-flex align-items-center justify-content-sp"
              >
                <span>{{ i18n.t('kChart.Address') }}：</span>
                <div class="display-flex align-items-center">
                  <span class="text-on-container-secondary">{{
                    shortifyAddress(baseInfo?.tokenInfo?.baseAddress)
                  }}</span>
                  <svg-icon
                    name="copy"
                    class="copy"
                    v-copy="baseInfo?.tokenInfo?.baseAddress"
                  ></svg-icon>
                </div>
              </div>
              <div class="info-txt display-flex align-items-center justify-content-sp">
                <span>{{ i18n.t('kChart.liquidityPool') }}：</span>
                <div class="display-flex align-items-center">
                  <span class="text-on-container-secondary">{{
                    shortifyAddress(baseInfo?.chainInfo?.pairAddress)
                  }}</span>
                  <svg-icon
                    name="copy"
                    class="copy"
                    v-copy="baseInfo?.chainInfo?.pairAddress"
                  ></svg-icon>
                </div>
              </div>
              <div class="pond-buy display-flex align-items-center">
                <span class="font-family-Medium">税：</span>
                <span class="font-family-Heavy"
                  >{{ parseFloat(baseInfo?.coinGoPlusInfo?.buy_tax || 0).toFixed(1) }}%</span
                >
                <span class="font-family-Heavy"
                  >{{ parseFloat(baseInfo?.coinGoPlusInfo?.sell_tax || 0).toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="display-flex align-items-center">
          <template v-if="baseInfo?.chainInfo?.chainCode != 'SOLANA'">
            <div class="display-flex align-items-center pond-start">
              <div class="display-flex flex-direction-col">
                <span>合约开源</span>
                <span>{{ baseInfo?.coinGoPlusInfo?.is_open_source == 1 ? '是' : '否' }}</span>
              </div>
              <div class="display-flex flex-direction-col">
                <span>合约未放弃</span>
                <span>{{ isContract ? '是' : '否' }}</span>
              </div>
              <div class="display-flex flex-direction-col">
                <span>流动性锁定</span>
                <span>{{ isLocked ? '是' : '否' }}</span>
              </div>
              <div class="display-flex flex-direction-col">
                <span>非蜜罐</span>
                <span>{{ baseInfo?.coinGoPlusInfo?.is_honeypot == 0 ? '是' : '否' }}</span>
              </div>
            </div>
          </template>
          <template v-if="baseInfo?.chainInfo?.chainCode == 'SOLANA'">
            <div class="display-flex align-items-center pond-start">
              <div class="display-flex flex-direction-col">
                <span>不可冻币</span>
                <span>{{ baseInfo?.coinGoPlusInfo?.freezable?.status == 0 ? '是' : '否' }}</span>
              </div>
              <div class="display-flex flex-direction-col">
                <span>不可增发</span>
                <span>{{ baseInfo?.coinGoPlusInfo?.freezable?.status == 0 ? '是' : '否' }}</span>
              </div>

              <div class="display-flex flex-direction-col">
                <span>无外部合约</span>
                <span>{{
                  baseInfo?.coinGoPlusInfo?.transfer_hook?.length == 0 ? '是' : '否'
                }}</span>
              </div>
              <div class="display-flex flex-direction-col">
                <span>Top 10</span>
                <span style="color: var(--down-color)"
                  >{{
                    parseFloat(holdingCoinsTabInfo?.topHolders?.topProPortion || 0).toFixed(2)
                  }}%</span
                >
              </div>
            </div>
          </template>
          <div
            class="display-flex flex-direction-col snipe-text"
            @click="securityTestDrawer = true"
          >
            <div class="display-flex align-items-center margin-element">
              <span>检测</span>
              <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
            </div>
            <div class="display-flex align-items-center">
              <svg-icon
                name="auth-check"
                style="width: 14px; height: 14px; color: var(--down-color)"
              ></svg-icon>
              <span class="font-family-Heavy down-color">安全</span>
            </div>
          </div>
          <!-- <div class="display-flex align-items-center pond-audit">
            <svg-icon name="icon-audit" class="icon-base"></svg-icon>
            <span>审计</span>
          </div> -->
          <!-- <div
            class="display-flex align-items-center pond-share"
            @click="shareDialogVisible = true"
          >
            <svg-icon name="icon-share" class="icon-base"></svg-icon>
            <span>分享送币</span>
          </div> -->
        </div>
      </div>
    </template>
  </el-skeleton>
  <ShareDialog
    :shareDialogVisible="shareDialogVisible"
    :baseInfo="baseInfo"
    @close="handleClose"
    v-if="shareDialogVisible"
  />

  <el-drawer
    v-model="securityTestDrawer"
    direction="rtl"
    :show-close="false"
    :destroy-on-close="true"
    class="securityTest-drawer"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">
        <svg-icon name="shield-tick1" class="shield-tick1"></svg-icon>
        <span>安全监测</span>
      </h4>
      <svg-icon name="arrow-circle-right" class="arrow-circle-right" @click="close"></svg-icon>
    </template>
    <SecurityTest :baseInfo="baseInfo" :holdingCoinsTabInfo="holdingCoinsTabInfo" />
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { numberFormat, shortifyAddress } from '@/utils'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import PercentageChange from '@/components/Percentage/PercentageChange.vue'
import ShareDialog from '@/components/Dialogs/ShareDialog.vue'

import Favorite from '@/components/Favorite.vue'
import SecurityTest from '@/components/Charts/SecurityTest.vue'

import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { MAIN_COIN } from '@/types'

const i18n = useI18n()

const shareDialogVisible = ref<boolean>(false) // 弹框显示隐藏状态

const securityTestDrawer = ref<boolean>(false)

const props = defineProps({
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
  },
  holdingCoinsTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const useSubscribeKChart = useSubscribeKChartInfo()

const priceIncrease = computed(() => {
  return {
    price: useSubscribeKChart.subscribeKChartInfo?.C || 0,
    increase: useSubscribeKChart.subscribeKChartInfo?.chg || 0
  }
})

// 流动性锁定
const isLocked = computed(() => {
  return props.baseInfo?.coinGoPlusInfo?.lp_holders?.some((item: any) => item.is_locked == 1)
})

// 合约

const isContract = computed(() => {
  return props.baseInfo?.coinGoPlusInfo?.lp_holders?.some((item: any) => item.is_contract == 1)
})

const handleClose = (val: boolean) => {
  shareDialogVisible.value = val
}

const handelIcon = () => {
  ElMessage.warning('代币未收录信息，请联系项目方在平台收录信息')
}
</script>
<style lang="scss">
.base-info {
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 12px;

  font-style: normal;
  // background-color: var(--card-bg-color);
  margin-bottom: 8px;
  line-height: 1.5;
  overflow: hidden;
  .logo {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    position: relative;
    .chainCode {
      width: 18px;
      height: 18px;
      position: absolute;
      right: -2px;
      bottom: -2px;
    }
  }
  .baseInfo-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .coin-text {
    font-size: 16px;
    margin-right: 4px;
    color: #f5f5f5;
    .coin-sub-txt {
      color: #959a9f;
    }
  }
  .icon-chat {
    width: 16px;
    height: 16px;
    margin-right: 6px;
    color: #959a9f;
  }
  .icon-pc {
    width: 24px;
    height: 24px;
    margin-right: 2px;
  }
  // .address-text {
  //   margin-left: 16px;
  // }
  .info-txt {
    font-size: 12px;
    color: #959a9f;
    margin-right: 6px;
    white-space: nowrap;
    .text-on-container-secondary {
      color: #959a9f;
    }
    .copy {
      width: 12px;
      height: 12px;
      margin-left: 4px;
      cursor: pointer;
    }
  }
  .increase-text {
    margin-left: 10px;
    span:first-child {
      font-size: 16px;
      line-height: 1.2;
      margin-right: 6px;
    }
  }
  .margin-element {
    margin-bottom: 4px;
  }
  .pond-buy {
    margin-left: 8px;
    span {
      display: block;
      font-size: 12px;
      line-height: 1.2;
    }
    span:nth-child(1) {
      color: #959a9f;
    }
    span:nth-child(2) {
      color: var(--up-color);
    }
    span:last-child {
      color: var(--down-color);
      margin-left: 4px;
    }
  }
  .pond-start {
    margin-left: 19px;
    white-space: nowrap;
    span {
      font-size: 12px;
      margin-left: 10px;
      color: #9aa0aa;
    }
    span:last-child {
      margin-top: 4px;
      color: var(--up-color);
      font-family: 'PingFangSC-Heavy';
    }
  }
  .pond-audit {
    padding: 10px;
    border-radius: 8px;
    font-size: 12px;
    margin-left: 16px;
    color: #f5f5f5;
    background-color: #0aa76f;
    cursor: pointer;
    white-space: nowrap;
  }
  .pond-share {
    color: var(--bg-color);
    padding: 10px;
    border-radius: 8px;
    background-color: #f5f5f5;
    font-size: 12px;
    margin-left: 16px;
    cursor: pointer;
    white-space: nowrap;
  }
  .icon-base {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  .snipe-text {
    color: #959a9f;
    margin-left: 25px;
    cursor: pointer;
    .snipe-icon {
      width: 12px;
      height: 12px;
      margin-right: 6px;
    }
    .chevron-right {
      width: 14px;
      height: 14px;
      margin-left: 2px;
    }
    .snipe-num {
      color: #f5f5f5;
    }
    .shield-tick1 {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
  }
}
.securityTest-drawer {
  width: 480px !important;
  background-color: #17181b;
  box-shadow: -2px 0px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 8px 0px 0px 8px;
  .el-drawer__header {
    margin-bottom: 10px;
    padding-left: 12px;
    padding-right: 12px;
  }
  .el-drawer__body {
    padding: 25px 12px;
  }
  h4 {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #f5f5f5;
    font-family: 'PingFangSC-Heavy';
    font-weight: normal;
  }
  .shield-tick1 {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  .arrow-circle-right {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}
</style>
