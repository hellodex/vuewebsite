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
              <div class="display-flex align-items-center coin-text">
                <span>{{
                  MAIN_COIN[baseInfo?.tokenInfo?.baseSymbol] ||
                  baseInfo?.tokenInfo?.baseSymbol ||
                  '-'
                }}</span>
                <span class="coin-sub-txt">/{{ baseInfo?.tokenInfo?.quoteSymbol || '-' }}</span>
              </div>
              <div class="display-flex align-items-center">
                <svg-icon name="icon-x" class="icon-chat" @click="handelIcon"></svg-icon>
                <svg-icon name="icon-discord" class="icon-chat" @click="handelIcon"></svg-icon>
                <svg-icon name="icon-telegram" class="icon-chat" @click="handelIcon"></svg-icon>
                <svg-icon name="icon-qq" class="icon-chat" @click="handelIcon"></svg-icon>
                <svg-icon name="icon-weibo" class="icon-chat" @click="handelIcon"></svg-icon>
                <a
                  :href="`https://x.com/search?q=${baseInfo?.tokenInfo?.baseAddress}`"
                  target="_blank"
                  class="icon-chat"
                >
                  <el-icon size="18"><Search /></el-icon>
                </a>
              </div>
            </div>
            <div class="display-flex align-items-center address-text">
              <div class="info-txt display-flex align-items-center justify-content-sp">
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
            </div>
          </div>
        </div>
        <div class="display-flex align-items-center">
          <div class="increase-text">
            <span>${{ numberFormat(priceIncrease.price || 0) }}</span>
            <PercentageChange :value="priceIncrease.increase" />
          </div>
          <div
            class="display-flex flex-direction-col snipe-text"
            @click="sniperDialogVisible = true"
          >
            <div class="display-flex align-items-center margin-element">
              <span>狙击者</span>
              <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
            </div>
            <div class="display-flex align-items-center">
              <svg-icon name="snipe-icon" class="snipe-icon"></svg-icon>
              <span
                >{{
                  earliest100TraderData?.traders?.filter((item: any) => item.sniper)?.length || 0
                }}/{{ earliest100TraderData?.traders?.length || 0 }}</span
              >
            </div>
          </div>
          <div class="pond-buy display-flex flex-direction-col">
            <span class="margin-element"
              >买税 {{ parseFloat(coinGoPlusInfo?.buy_tax || 0).toFixed(1) }}%</span
            >
            <span>卖税 {{ parseFloat(coinGoPlusInfo?.sell_tax || 0).toFixed(1) }}% </span>
          </div>
          <template v-if="baseInfo?.chainInfo?.chainCode != 'SOLANA'">
            <div class="display-flex flex-direction-col pond-start">
              <div class="display-flex align-items-center margin-element">
                <el-icon :size="18" color="#2EBD85" v-if="coinGoPlusInfo?.is_open_source == 1"
                  ><CircleCheck
                /></el-icon>
                <el-icon :size="18" color="#EE475E" v-else><CircleClose /></el-icon>
                <span>{{ coinGoPlusInfo?.is_open_source == 1 ? '合约开源' : '合约未开源' }}</span>
              </div>
              <div class="display-flex align-items-center">
                <el-icon :size="18" color="#EE475E" v-if="isContract"><CircleClose /></el-icon>
                <el-icon :size="18" color="#2EBD85" v-else><CircleCheck /></el-icon>
                <span>{{ isContract ? '合约未放弃' : '合约放弃' }}</span>
              </div>
            </div>
            <div class="display-flex flex-direction-col pond-start">
              <div class="display-flex align-items-center margin-element">
                <el-icon :size="18" color="#2EBD85" v-if="isLocked"><CircleCheck /></el-icon>
                <el-icon :size="18" color="#EE475E" v-else><CircleClose /></el-icon>
                <span>{{ isLocked ? '流动性锁定' : '流动性未锁定' }}</span>
              </div>
              <div class="display-flex align-items-center">
                <el-icon :size="18" color="#2EBD85" v-if="coinGoPlusInfo?.is_honeypot == 0"
                  ><CircleCheck
                /></el-icon>
                <el-icon :size="18" color="#EE475E" v-else><CircleClose /></el-icon>
                <span>{{ coinGoPlusInfo?.is_honeypot == 0 ? '非蜜罐' : '蜜罐' }}</span>
              </div>
            </div>
          </template>
          <template v-if="baseInfo?.chainInfo?.chainCode == 'SOLANA'">
            <div class="display-flex flex-direction-col pond-start">
              <div class="display-flex align-items-center margin-element">
                <el-icon :size="18" color="#2EBD85" v-if="coinGoPlusInfo?.freezable?.status == 0"
                  ><CircleCheck
                /></el-icon>
                <el-icon :size="18" color="#EE475E" v-else><CircleClose /></el-icon>
                <span>{{ coinGoPlusInfo?.freezable?.status == 0 ? '不可冻币' : '可冻币' }}</span>
              </div>
              <div class="display-flex align-items-center">
                <el-icon :size="18" color="#2EBD85" v-if="coinGoPlusInfo?.mintable?.status == 0"
                  ><CircleCheck
                /></el-icon>
                <el-icon :size="18" color="#EE475E" v-else><CircleClose /></el-icon>
                <span> {{ coinGoPlusInfo?.freezable?.status == 0 ? '不可增发' : '可增发' }}</span>
              </div>
            </div>
            <div class="display-flex flex-direction-col pond-start">
              <div class="display-flex align-items-center margin-element">
                <el-icon
                  :size="18"
                  color="#2EBD85"
                  v-if="coinGoPlusInfo?.transfer_hook?.length == 0"
                  ><CircleCheck
                /></el-icon>
                <el-icon :size="18" color="#EE475E" v-else><CircleClose /></el-icon>
                <span>{{
                  coinGoPlusInfo?.transfer_hook?.length == 0 ? '无外部合约' : '有外部合约'
                }}</span>
              </div>
              <div class="display-flex align-items-center">
                <el-icon :size="18" color="#2EBD85"><CircleCheck /></el-icon>
                <span
                  >前10持币：{{
                    parseFloat(holdingCoinsTabInfo?.topHolders?.topProPortion || 0).toFixed(2)
                  }}%</span
                >
              </div>
            </div>
          </template>
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

  <SniperDialog
    :sniperDialogVisible="sniperDialogVisible"
    :baseInfo="baseInfo"
    :earliest100TraderData="earliest100TraderData"
    @close="handleClose"
    v-if="sniperDialogVisible"
  />
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { numberFormat, shortifyAddress } from '@/utils'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import PercentageChange from '@/components/Percentage/PercentageChange.vue'
import ShareDialog from '@/components/Dialogs/ShareDialog.vue'
import SniperDialog from '@/components/Dialogs/SniperDialog.vue'
import Favorite from '@/components/Favorite.vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { MAIN_COIN } from '@/types'

const i18n = useI18n()

const shareDialogVisible = ref<boolean>(false) // 弹框显示隐藏状态
const sniperDialogVisible = ref<boolean>(false)

const props = defineProps({
  baseInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  coinGoPlusInfo: {
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
  },
  earliest100TraderData: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const useSubscribeKChart = useSubscribeKChartInfo()

const priceIncrease = computed(() => {
  return {
    price: useSubscribeKChart.subscribeKChartInfo?.C || props.baseInfo.priceInfo?.price || 0,
    increase: useSubscribeKChart.subscribeKChartInfo?.chg || props.baseInfo.priceInfo?.chg || 0
  }
})

// 流动性锁定
const isLocked = computed(() => {
  return props.coinGoPlusInfo?.lp_holders?.some((item: any) => item.is_locked == 1)
})

// 合约

const isContract = computed(() => {
  return props.coinGoPlusInfo?.lp_holders?.some((item: any) => item.is_contract == 1)
})

const handleClose = (val: boolean) => {
  shareDialogVisible.value = val
  sniperDialogVisible.value = val
}

const handelIcon = () => {
  ElMessage.warning('代币未收录信息，请联系项目方在平台收录信息')
}
</script>
<style lang="scss" scoped>
.base-info {
  margin-right: 12px;
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
    font-size: 20px;
    margin-right: 12px;
    color: #f5f5f5;
    .coin-sub-txt {
      color: #959a9f;
    }
  }
  .icon-chat {
    width: 18px;
    height: 18px;
    margin-right: 6px;
    color: #959a9f;
  }
  // .address-text {
  //   margin-left: 16px;
  // }
  .info-txt {
    font-size: 14px;
    color: #959a9f;
    margin-right: 6px;
    white-space: nowrap;
    .text-on-container-secondary {
      color: #959a9f;
    }
    .copy {
      width: 14px;
      height: 14px;
      margin-left: 4px;
      cursor: pointer;
    }
  }
  .increase-text {
    margin-right: 26px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    span:first-child {
      color: #f5f5f5;
      font-size: 16px;
      line-height: 1.2;
      margin-bottom: 6px;
    }
  }
  .margin-element {
    margin-bottom: 6px;
  }
  .pond-buy {
    margin-right: 20px;
    white-space: nowrap;
    span {
      padding: 2px 4px;
      font-size: 10px;
      border-radius: 4px;
    }
    span:first-child {
      color: var(--up-color);
      background: rgba(46, 189, 133, 0.16);
    }
    span:last-child {
      color: var(--down-color);
      background: rgba(246, 70, 93, 0.16);
    }
  }
  .pond-start {
    margin-right: 8px;
    white-space: nowrap;
    span {
      font-size: 12px;
      margin-left: 6px;
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
    color: #f5f5f5;
    margin-right: 20px;
    cursor: pointer;

    .snipe-icon {
      width: 12px;
      height: 12px;
    }
    .chevron-right {
      width: 15px;
      height: 15px;
      margin-left: 4px;
    }
    .snipe-icon {
      margin-right: 6px;
    }
  }
}
</style>
