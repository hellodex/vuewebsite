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
          <Favorite :coinInfo="{
            baseTokenAddress: baseInfo?.tokenInfo?.baseAddress,
            chainCode: baseInfo?.chainInfo?.chainCode,
            pairAddress: baseInfo?.chainInfo?.pairAddress
          }" />
          <span class="logo">
            <el-image 
              :src="baseInfo?.tokenInfo?.logo" 
              alt="" 
              class="baseInfo-img"
              :lazy="false"
              loading="eager"
            >
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
                <svg-icon
                  name="twitter-pump"
                  class="twitter-pump icon-chat"
                  @click.stop="handelRouter(baseInfo?.tokenInfo?.twitter)"
                  v-if="baseInfo?.tokenInfo?.twitter"
                ></svg-icon>

                <svg-icon
                  name="telegram-pump"
                  class="icon-chat telegram-pump"
                  @click.stop="handelRouter(baseInfo?.tokenInfo?.telegram)"
                  v-if="baseInfo?.tokenInfo?.telegram"
                ></svg-icon>

                <svg-icon
                  name="website-pump"
                  class="icon-chat"
                  @click.stop="handelRouter(baseInfo?.tokenInfo?.website)"
                  v-if="baseInfo?.tokenInfo?.website"
                ></svg-icon>

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
                  >${{
                    MAIN_COIN[baseInfo?.tokenInfo?.baseSymbol]
                      ? numFormat(parseFloat(priceIncrease.price || 0).toFixed(2))
                      : numberFormat(priceIncrease.price || 0)
                  }}</span
                >
                <PercentageChange :value="priceIncrease.increase" />
              </div>
            </div>
            <div class="display-flex align-items-center address-text">
              <div
                class="display-flex align-items-center pump-progress"
                v-if="pondTabInfo.isPumpFun"
              >
                <img src="@/assets/img/pump-logo.webp" alt="" />
                <span class="up-color"
                  >{{
                    pondTabInfo.pumpFunProgress == 100
                      ? 100
                      : (priceIncrease.pumpFunProgress ?? pondTabInfo.pumpFunProgress)
                  }}%</span
                >
                <el-progress
                  :percentage="
                    pondTabInfo.pumpFunProgress == 100
                      ? 100
                      : (priceIncrease.pumpFunProgress ?? pondTabInfo.pumpFunProgress)
                  "
                  color="#2ebd85"
                ></el-progress>
              </div>
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
                  >{{ (parseFloat(baseInfo?.coinGoPlusInfo?.buy_tax || 0) * 100).toFixed(1) }}%</span
                >
                <span class="font-family-Heavy"
                  >{{ (parseFloat(baseInfo?.coinGoPlusInfo?.sell_tax || 0)* 100).toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="display-flex align-items-center">
          <template v-if="baseInfo?.chainInfo?.chainCode != 'SOLANA'">
            <div class="display-flex align-items-center pond-start">
              <div class="display-flex flex-direction-col align-items-center">
                <span>合约未开源</span>
                <span v-if="baseInfo?.coinGoPlusInfo?.is_open_source == 1" class="up-color"
                  >否</span
                >
                <span v-else class="down-color">是</span>
              </div>
              <div class="display-flex flex-direction-col align-items-center">
                <span>合约放弃</span>
                <span v-if="isContract" class="up-color">否</span>
                <span v-else class="down-color">是</span>
              </div>
              <div class="display-flex flex-direction-col align-items-center">
                <span>流动性未锁定</span>
                <span v-if="isLocked" class="up-color">否</span>
                <span v-else class="down-color">是</span>
              </div>
              <div class="display-flex flex-direction-col align-items-center">
                <span>蜜罐</span>
                <span v-if="baseInfo?.coinGoPlusInfo?.is_honeypot == 0" class="up-color">否</span>
                <span v-else class="down-color">是</span>
              </div>
            </div>
          </template>
          <template v-if="baseInfo?.chainInfo?.chainCode == 'SOLANA'">
            <div class="display-flex align-items-center pond-start">
              <div class="display-flex flex-direction-col align-items-center">
                <span>可冻币</span>
                <span v-if="baseInfo?.coinGoPlusInfo?.freezable?.status == 0" class="up-color"
                  >否</span
                >
                <span v-else class="down-color">是</span>
              </div>
              <div class="display-flex flex-direction-col align-items-center">
                <span>可增发</span>
                <span v-if="baseInfo?.coinGoPlusInfo?.freezable?.status == 0" class="up-color"
                  >否</span
                >
                <span v-else class="down-color">是</span>
              </div>

              <div class="display-flex flex-direction-col align-items-center">
                <span>有外部合约</span>
                <span v-if="baseInfo?.coinGoPlusInfo?.transfer_hook?.length == 0" class="up-color"
                  >否</span
                >
                <span v-else class="down-color">是</span>
              </div>
              <div class="display-flex flex-direction-col align-items-center">
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
            class="display-flex flex-direction-col align-items-center snipe-text"
            @click="securityTestDrawer = true"
          >
            <div class="display-flex align-items-center margin-element">
              <span>检测</span>
              <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
            </div>
            <div
              class="display-flex align-items-center"
              v-if="securityTestTypeList.includes('warning')"
            >
              <svg-icon
                name="alert-triangle"
                style="width: 14px; height: 14px; margin-right: 2px"
              ></svg-icon>
              <span class="font-family-Heavy down-color">危险</span>
            </div>
            <div class="display-flex align-items-center" v-else>
              <svg-icon
                name="auth-check"
                style="width: 14px; height: 14px; color: var(--up-color); margin-right: 2px"
              ></svg-icon>
              <span class="font-family-Heavy up-color">安全</span>
            </div>
          </div>
          <div
            class="display-flex flex-direction-col align-items-center ai-text"
            @click="handelAddMonitor"
            v-if="isConnected"
          >
            <svg-icon name="icon-strategy" class="icon-strategy"></svg-icon>
            <span>AI监控</span>
          </div>
          <WalletConnect v-else>
            <div class="display-flex flex-direction-col align-items-center ai-text">
              <svg-icon name="icon-strategy" class="icon-strategy"></svg-icon>
              <span>AI监控</span>
            </div>
          </WalletConnect>
        </div>
      </div>
    </template>
  </el-skeleton>

  <MonitorTypeDialog
    :monitorTypeDialogVisible="monitorTypeDialogVisible"
    :showGroupMonitor="false"
    @monitorType="handelDialog"
    @close="handelMonitorTypeClose"
  />

  <MonitorFormDialog
    :info="formInfo"
    dialogType="edit"
    :monitorFormDialogVisible="monitorFormDialogVisible"
    @close="handelMonitorFormClose"
    @refresh="handelRefresh"
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
import { numberFormat, shortifyAddress, numFormat } from '@/utils'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import PercentageChange from '@/components/Percentage/PercentageChange.vue'
import MonitorTypeDialog from '@/components/Dialogs/MonitorTypeDialog.vue'
import MonitorFormDialog from '@/components/Dialogs/MonitorFormDialog.vue'
import Favorite from '@/components/Favorite.vue'
import SecurityTest from '@/components/Charts/SecurityTest.vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'

import { APIgetUserSubscribe } from '@/api'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import { MAIN_COIN } from '@/types'
import { customMessage } from '@/utils/message'

const i18n = useI18n()
const globalStore = useGlobalStore()

const isConnected = computed(() => globalStore.walletInfo.isConnected)
const walletType = computed(() => globalStore.walletInfo.walletType)

const monitorTypeDialogVisible = ref<boolean>(false) // 监控类型弹框
const monitorFormDialogVisible = ref<boolean>(false) // 监控表单

const formInfo = ref<any>({
  type: 'price',
  coin: 'Single',
  chainCode: 'SOLANA',
  baseAddress: '',
  symbol: '',
  data: '',
  noticeType: [1],
  startPrice: '',
  targetPrice: '',
  status: 1,
  logo: ''
})

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
  },
  pondTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const securityTestTypeList = computed(() => {
  const obj = props.baseInfo?.coinGoPlusInfo
  if (obj) {
    return props.baseInfo.chainInfo.chainCode == 'SOLANA'
      ? [
          obj?.non_transferable == 0 ? 'success' : 'warning',
          obj?.transfer_hook?.length == 0 ? 'success' : 'warning',
          obj?.mintable?.status == 0 ? 'success' : 'warning',
          obj?.freezable?.status == 0 ? 'success' : 'warning',
          obj?.closable?.status == 0 ? 'success' : 'warning',
          obj?.transfer_fee_upgradable?.status == 0 ? 'success' : 'warning',
          obj?.default_account_state_upgradable?.status == 0 ? 'success' : 'warning',
          obj?.balance_mutable_authority?.status == 0 ? 'success' : 'warning',
          obj?.transfer_hook_upgradable?.status == 0 ? 'success' : 'warning'
        ]
      : [
          obj?.is_open_source == 1 ? 'success' : 'warning',
          obj?.is_proxy == 0 ? 'success' : 'warning',
          obj?.is_mintable == 0 ? 'success' : 'warning',
          obj?.can_take_back_ownership == 0 ? 'success' : 'warning',
          obj?.owner_change_balance == 0 ? 'success' : 'warning',
          obj?.hidden_owner == 0 ? 'success' : 'warning',
          obj?.selfdestruct == 0 ? 'success' : 'warning',
          obj?.external_call == 0 ? 'success' : 'warning',
          obj?.gas_abuse == 1 ? 'warning' : 'success',
          obj?.cannot_sell_all == 0 ? 'success' : 'warning',
          obj?.slippage_modifiable == 0 ? 'success' : 'warning',
          obj?.is_honeypot == 0 ? 'success' : 'warning',
          obj?.transfer_pausable == 0 ? 'success' : 'warning',
          obj?.transfer_pausable == 0 ? 'success' : 'warning',
          obj?.is_whitelisted == 0 ? 'success' : 'warning',
          obj?.is_anti_whale == 0 ? 'success' : 'warning',
          obj?.trading_cooldown == 0 ? 'success' : 'warning',
          obj?.personal_slippage_modifiable == 0 ? 'success' : 'warning'
        ]
  } else {
    return []
  }
})

const useSubscribeKChart = useSubscribeKChartInfo()

const priceIncrease = computed(() => {
  return {
    price: useSubscribeKChart.subscribeKChartInfo?.C || 0,
    increase: useSubscribeKChart.subscribeKChartInfo?.chg || 0,
    pumpFunProgress: useSubscribeKChart.subscribeKChartInfo?.pumpFunProgress
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

const handelAddMonitor = () => {
  if (walletType.value !== 'Email') {
    customMessage({
      type: 'error',
      title: '请使用账户模式登录'
    })
    return false
  }
  monitorTypeDialogVisible.value = true
}

const handelDialog = async (type: string) => {
  // 立即关闭第一个弹窗并显示第二个弹窗
  monitorTypeDialogVisible.value = false
  
  // 先重置并设置一个默认的 formInfo，避免显示空白和旧数据
  formInfo.value = {
    type: type,
    coin: 'Single',
    chainCode: props.baseInfo?.chainInfo?.chainCode || 'SOLANA',
    baseAddress: props.baseInfo?.tokenInfo?.baseAddress || '',
    symbol: props.baseInfo?.tokenInfo?.baseSymbol || '',
    data: '',
    noticeType: [1],
    startPrice: '',
    targetPrice: '',
    status: 1,
    logo: props.baseInfo?.tokenInfo?.logo || ''
  }
  
  // 立即显示第二个弹窗
  monitorFormDialogVisible.value = true
  
  // 然后异步加载数据
  try {
    const res: any = await APIgetUserSubscribe({
      baseAddress: props.baseInfo?.tokenInfo?.baseAddress,
      chainCode: props.baseInfo?.chainInfo?.chainCode,
      type: type
    })
    
    if (res) {
      if (JSON.stringify(res.subscribe) == '{}') {
        formInfo.value = {
          type: type,
          coin: 'Single',
          chainCode: res.info.chainCode,
          baseAddress: res.info.baseToken.address,
          symbol: res.info.baseToken.symbol,
          data: '',
          noticeType: [1],
          startPrice: res.info.price,
          targetPrice: '',
          status: 1,
          logo: res.info.logo
        }
      } else {
        handelMap(res.subscribe)
      }
    }
  } catch (error) {
    console.error('获取用户订阅信息失败:', error)
  }
}

const handelMap = (map: any) => {
  for (const key in formInfo.value) {
    if (Object.prototype.hasOwnProperty.call(formInfo.value, key)) {
      formInfo.value[key] = map[key]
    }
  }
  if (formInfo.value.type == 'chg') {
    formInfo.value.data = formInfo.value.data * 100
  }
  formInfo.value.noticeType = [formInfo.value.noticeType]
  formInfo.value.coin = 'Single'
}

const handelMonitorTypeClose = (val: boolean) => {
  monitorTypeDialogVisible.value = val
}

const handelMonitorFormClose = (val: boolean) => {
  monitorFormDialogVisible.value = val
  // 关闭弹窗时重置表单数据
  if (!val) {
    formInfo.value = {
      type: 'price',
      coin: 'Single',
      chainCode: 'SOLANA',
      baseAddress: '',
      symbol: '',
      data: '',
      noticeType: [1],
      startPrice: '',
      targetPrice: '',
      status: 1,
      logo: ''
    }
  }
}

const handelRefresh = () => {
  monitorFormDialogVisible.value = false
}

const handelRouter = (url: string) => {
  console.log(url)
  window.open(url)
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
  .pump-progress {
    width: 120px;
    margin-right: 6px;
    img {
      width: 12px;
      height: 12px;
    }
    span {
      margin: 0 4px;
      font-family: 'PingFangSC-Medium';
    }
    .el-progress {
      width: 100%;
    }
    .el-progress__text {
      display: none;
    }
    .el-progress-bar__outer {
      background-color: rgba(58, 60, 64, 0.8);
    }
  }
  .connect-wallet-btn {
    padding: 0;
    background-color: transparent;
    min-width: auto;
  }
  .logo {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    position: relative;
    display: block;
    flex-shrink: 0;
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
    display: block;
    object-fit: cover;
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
  .twitter-pump {
    width: 14px;
    height: 14px;
  }
  .telegram-pump {
    width: 17px;
    height: 17px;
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
    div {
      margin-left: 10px;
    }
    span {
      font-size: 12px;
      color: #9aa0aa;
    }
    span:last-child {
      margin-top: 4px;
      color: var(--up-color);
      font-family: 'PingFangSC-Heavy';
    }
  }
  .icon-base {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  .snipe-text {
    color: #959a9f;
    margin-left: 20px;
    cursor: pointer;
    span {
      white-space: nowrap;
    }
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
  .ai-text {
    margin-left: 20px;
    font-size: 12px;
    color: #959a9f;
    justify-content: space-between;
    height: 40px;
    font-family: 'PingFangSC-Heavy';
    cursor: pointer;
    white-space: nowrap;
    .icon-strategy {
      width: 16px;
      height: 16px;
      position: relative;
      top: 2px;
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
