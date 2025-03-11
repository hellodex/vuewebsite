<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="transaction-main">
    <div class="transaction-coin">
      <div class="display-flex flex-direction-col transaction-coin-item">
        <div class="display-flex align-items-center justify-content-sp transaction-coin-item-p">
          <span>{{ i18n.t('kChart.Sell') }}</span>
          <span @click="handelBalance(sellingcoinInfo, 'selling')"
            >{{ i18n.t('kChart.Balance') }}:
            {{ numberFormat(balanceFormat(sellingcoinInfo)) }}</span
          >
        </div>
        <div class="display-flex align-items-center justify-content-sp transaction-input">
          <div
            class="display-flex align-items-center search-chain"
            @click="handelSearch('selling')"
          >
            <div class="logo">
              <el-image :src="sellingcoinInfo.logo" alt="" class="logo-img">
                <template #error>
                  <svg-icon name="logo1" class="logo-img"></svg-icon>
                </template>
              </el-image>
              <img :src="chainLogoObj[sellingcoinInfo.chainCode]" alt="" class="chainCode" />
            </div>
            <div class="display-flex flex-direction-col">
              <div class="display-flex align-items-center">
                <span>{{ sellingcoinInfo.baseToken }}</span>
                <svg-icon name="chevron-down" class="icon-svg"></svg-icon>
              </div>
              <span class="transaction-coin-name">{{ sellingcoinInfo.chainCodeName }}</span>
            </div>
          </div>
          <div class="display-flex flex-direction-col align-items-fd">
            <el-input
              v-model="sellingVal"
              placeholder="0.0"
              size="small"
              @input="handelSellingInput"
            />
            <!-- <span class="transaction-input-span">{{ sellingcoinInfo.volume }}</span> -->
          </div>
        </div>
      </div>
      <div class="display-flex flex-direction-col transaction-coin-item">
        <div class="display-flex align-items-center justify-content-sp transaction-coin-item-p">
          <span>{{ i18n.t('kChart.Buy') }}</span>
          <span @click="handelBalance(buycoinInfo, 'buy')"
            >{{ i18n.t('kChart.Balance') }}: {{ numberFormat(balanceFormat(buycoinInfo)) }}</span
          >
        </div>
        <div class="display-flex align-items-center justify-content-sp transaction-input">
          <div class="display-flex align-items-center search-chain" @click="handelSearch('buy')">
            <div class="logo">
              <el-image :src="buycoinInfo.logo" alt="" class="logo-img">
                <template #error>
                  <svg-icon name="logo1" class="logo-img"></svg-icon>
                </template>
              </el-image>
              <img :src="chainLogoObj[buycoinInfo.chainCode]" alt="" class="chainCode" />
            </div>
            <div class="display-flex flex-direction-col">
              <div class="display-flex align-items-center">
                <span>{{ buycoinInfo.baseToken }}</span>
                <svg-icon name="chevron-down" class="icon-svg"></svg-icon>
              </div>
              <span class="transaction-coin-name">{{ buycoinInfo.chainCodeName }}</span>
            </div>
          </div>
          <el-skeleton :loading="balanceInquiryLoading" animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 40%; float: right" />
            </template>
            <template #default>
              <div class="display-flex flex-direction-col align-items-fd">
                <el-input v-model="buyVal" placeholder="0.0" size="small" @input="handelBuyInput" />

                <!-- <span class="transaction-input-span">{{ buycoinInfo.volume }}</span> -->
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>
      <div :class="balanceInquiryLoading ? 'arrow-box arrow-box-animation' : 'arrow-box'">
        <svg-icon name="arrow-down" class="arrow-down" @click="handelSwitchCoin"></svg-icon>
      </div>
    </div>
    <div class="slider-info">
      <el-slider
        v-model="positionVal"
        :step="5"
        :marks="marks"
        size="small"
        @input="handelpPositionSlider"
      />
      <div
        class="display-flex align-items-center justify-content-sp slider-info-item"
        style="margin-top: 32px"
      >
        <span>{{ i18n.t('kChart.Slippage') }}</span>
        <el-input
          v-model="slippageVal"
          style="width: 50px"
          size="small"
          onkeyup="value=value.replace(/[^\d||/.]/g,'')"
          oninput="if(value){value=value.replace(/[^\d||/.]/g,'')}if(value<0){value=''}if(value>100){value=100}"
          :maxlength="3"
          :minlength="1"
        >
          <template #suffix>%</template>
        </el-input>
      </div>
      <div class="display-flex align-items-center justify-content-sp slider-info-item">
        <span>Gas</span>
        <span>{{
          sellingcoinInfo.chainCode == 'SOLANA' ? '0.001 SOL' : numberFormat(gasPrice) + ' gwei'
        }}</span>
      </div>
      <WalletConnect v-if="!isConnected" />
      <el-button
        v-if="isConnected && networkResult && !balanceInquiryLoading"
        type="success"
        class="transaction-btn"
        :loading="tradeLoading"
        @click="handleTrade"
      >
        {{ i18n.t('kChart.Buy') }}
      </el-button>
      <el-button
        v-if="isConnected && networkResult && balanceInquiryLoading"
        type="info"
        class="transaction-btn"
      >
        {{ i18n.t('CheckTheSwapAmount') }}
      </el-button>
      <el-button
        type="success"
        v-if="isConnected && !networkResult"
        class="transaction-btn"
        @click="handelSwitchNetwork(walletType, sellingcoinInfo)"
      >
        {{ i18n.t('PleaseSwitchChains') }}
      </el-button>
    </div>
  </div>
  <SearchTransactionDialog
    :searchDialogVisible="searchDialogVisible"
    v-if="searchDialogVisible"
    :sellingBuy="sellingBuy"
    :walletInfo="walletInfo"
    @close="handleSearchClose"
    @select="handleSearchSelect"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import SearchTransactionDialog from '@/components/Dialogs/SearchTransactionDialog.vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'

import BigNumber from 'bignumber.js'
import { mainNetworkCurrency, debounce, numberFormat } from '@/utils'

import { infinityAmount } from '@/types'

import { APIgetSwap } from '@/api/coinWalletDetails'

import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'

//钱包处理

import {
  balanceFormat,
  getBalance,
  resetAddress,
  handleEvmAllowance,
  sendEvmTransaction,
  sendSolanaTransaction,
  getEvmGasPrice,
  handelSwitchNetwork,
  handleEvmApprove
} from '@/utils/transition'
import { customMessage } from '@/utils/message'

const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore

const i18n = useI18n()

interface Mark {
  style: CSSProperties
  label: string
}
type Marks = Record<number, Mark | string>

const marks = reactive<Marks>({
  // 滑点数据
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
})

const props = defineProps({
  baseInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const sellingVal = ref<string>('') // 卖出 数
const buyVal = ref<string>('') // 买入 数
const sellingBuy = ref<string>('') // 判断点击的是卖出还是买入
const searchDialogVisible = ref<any>(false) // 搜索卖出/买入 合约币 弹框 显示隐藏状态
const gasPrice = ref<any>(0) // Gas费
const walletInfo = ref<any>({}) // 钱包信息
const positionVal = ref<number>(0) // c仓位

const account: any = localStorage.getItem('accountInfo')
const slippageVal = ref<any>(account ? (JSON.parse(account).slippage * 100).toString() : '3') // 滑点

const tradeLoading = ref<boolean>(false)
const balanceInquiryLoading = ref<boolean>(false) // 币余额查询 loading
const networkResult = ref<boolean>(true) // 网络对比结果
const timer = ref<any>(null) // 定时器
const tradeTimer = ref<any>(null)
const okCoin = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const sol = 'So11111111111111111111111111111111111111112'

const sellingcoinInfo = ref<any>({}) // 选中的 卖出 币信息
const buycoinInfo = ref<any>({}) // 选中的 买入 币信息

const isPackagingCurrency_sell =
  props.baseInfo.tokenInfo?.baseAddress.toLowerCase() ==
  mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.wrapped.toLowerCase()

if (isPackagingCurrency_sell) {
  sellingcoinInfo.value = {
    baseAddress: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.symbolAddress,
    baseToken: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.symbol,
    chainCode: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.chainCode,
    chainCodeName: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.chain,
    logo: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.logo
      ? mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.logo
      : '',
    balance: 0,
    baseTokenDecimals: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.decimals
  }
} else {
  sellingcoinInfo.value = {
    baseAddress: props.baseInfo.tokenInfo?.baseAddress,
    baseToken: props.baseInfo.tokenInfo?.baseSymbol,
    chainCode: props.baseInfo.chainInfo?.chainCode,
    chainCodeName: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.chain,
    logo: props.baseInfo.tokenInfo?.logo ? props.baseInfo.tokenInfo?.logo : '',
    balance: 0,
    baseTokenDecimals: props.baseInfo.tokenInfo?.baseDecimal
  }
}

const isPackagingCurrency_buy =
  props.baseInfo.tokenInfo?.quoteAddress.toLowerCase() ==
  mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.wrapped.toLowerCase()

if (isPackagingCurrency_buy) {
  buycoinInfo.value = {
    baseAddress: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.symbolAddress,
    baseToken: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.symbol,
    chainCode: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.chainCode,
    chainCodeName: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.chain,
    logo: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.logo
      ? mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.logo
      : '',
    balance: 0,
    baseTokenDecimals: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.decimals
  }
} else {
  buycoinInfo.value = {
    baseAddress: props.baseInfo.tokenInfo?.quoteAddress,
    baseToken: props.baseInfo.tokenInfo?.quoteSymbol,
    chainCode: props.baseInfo.chainInfo?.chainCode,
    chainCodeName: mainNetworkCurrency(props.baseInfo.chainInfo?.chainCode)?.chain,
    logo: '',
    balance: 0,
    baseTokenDecimals: props.baseInfo.tokenInfo?.quoteDecimal
  }
}

const handelSearch = (type: string) => {
  // 卖出/买入 搜索时间
  sellingBuy.value = type
  walletInfo.value.chainCode =
    type == 'selling' ? sellingcoinInfo.value.chainCode : buycoinInfo.value.chainCode
  searchDialogVisible.value = true
}
const handleSearchClose = (val: Boolean) => {
  // 关闭 搜索卖出/买入 合约币 列表弹框
  searchDialogVisible.value = val
}

const handleSearchSelect = async (val: any) => {
  console.log('select coin:', val)
  sellingVal.value = ''
  buyVal.value = ''
  // 搜索卖出/买入 合约币 列表 选中信息
  if (sellingBuy.value == 'buy') {
    buycoinInfo.value = val.coinInfo
    buycoinInfo.value.balance = await getBalance(
      buycoinInfo.value.baseAddress,
      buycoinInfo.value.chainCode
    )
  } else if (sellingBuy.value == 'selling') {
    sellingcoinInfo.value = val.coinInfo
    let sellAddr = okCoin
    if (sellingcoinInfo.value.baseAddress != '' && sellingcoinInfo.value.baseAddress != okCoin) {
      sellAddr = sellingcoinInfo.value.baseAddress
    }
    if (!sellAddr) {
      sellAddr = ''
    }
    sellingcoinInfo.value.balance = await getBalance(sellAddr, sellingcoinInfo.value.chainCode)
  }
  searchDialogVisible.value = val.dialogVisible
}

const handelSwitchCoin = () => {
  ;[sellingcoinInfo.value, buycoinInfo.value] = [buycoinInfo.value, sellingcoinInfo.value]
}

const handelBalance = (params: any, type: string) => {
  if (params.baseAddress != '' && params.baseAddress != okCoin) {
    if (type == 'selling') {
      sellingVal.value = balanceFormat(params)
      positionVal.value = 100
      justQuote().then((v) => {
        const tokenAmount = v?.toTokenAmount || 0
        buyVal.value = BigNumber(tokenAmount)
          .dividedBy(BigNumber(10 ** buycoinInfo.value.baseTokenDecimals))
          .toString()
      })
    } else if (type == 'buy') {
      buyVal.value = balanceFormat(params)
    }
  }
}
// 链接钱包 逻辑

const address = computed(() => globalStore.walletInfo.address)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const chainId = computed(() => globalStore.walletInfo.chainId)
const walletType = computed(() => globalStore.walletInfo.walletType)

const updateWalletInfo = async () => {
  walletInfo.value = {
    address: address.value,
    chainId: chainId.value,
    isConnected: isConnected.value
  }
  // 判断 当前卖出币 chainid 是否和钱包的 chainid 是否一致
  networkResult.value =
    mainNetworkCurrency(sellingcoinInfo.value.chainCode).chainId == walletInfo.value.chainId

  // if (!networkResult.value) {
  //   return
  // }

  if (sellingcoinInfo.value.baseAddress && address.value) {
    sellingcoinInfo.value.balance = await getBalance(
      sellingcoinInfo.value.baseAddress,
      sellingcoinInfo.value.chainCode
    )
  }
  if (buycoinInfo.value.baseAddress && address.value) {
    buycoinInfo.value.balance = await getBalance(
      buycoinInfo.value.baseAddress,
      buycoinInfo.value.chainCode
    )
  }
}

const handelpPositionSlider = () => {
  const positionRatio = positionVal.value / 100
  sellingVal.value = new BigNumber(balanceFormat(sellingcoinInfo.value))
    .times(positionRatio)
    .toString(10)
  debounce(() => {
    justQuote().then((v) => {
      const tokenAmount = v?.toTokenAmount || 0
      buyVal.value = BigNumber(tokenAmount)
        .dividedBy(BigNumber(10 ** buycoinInfo.value.baseTokenDecimals))
        .toString()
    })
  }, 400)
}

const handelSellingInput = () => {
  // 卖出输入框逻辑
  // sellingVal.value 直接取这个值处理逻辑
  sellingVal.value = sellingVal.value
    // eslint-disable-next-line no-useless-escape
    .replace(/[^\d|\.]/g, '')
    .replace(/^00/g, '0')
    .replace(/^\./g, '0.')
  const positionRatio = new BigNumber(sellingVal.value)
    .div(balanceFormat(sellingcoinInfo.value))
    .times(100)
    .toString(10)
  positionVal.value = parseFloat(positionRatio)
  debounce(() => {
    justQuote().then((v) => {
      const tokenAmount = v?.toTokenAmount || 0
      buyVal.value = BigNumber(tokenAmount)
        .dividedBy(BigNumber(10 ** buycoinInfo.value.baseTokenDecimals))
        .toString()
    })
  }, 400)
}

const handelBuyInput = () => {
  // 买入输入框逻辑
  // buyVal.value 直接取这个值处理逻辑
  buyVal.value = buyVal.value
    // eslint-disable-next-line no-useless-escape
    .replace(/[^\d|\.]/g, '')
    .replace(/^00/g, '0')
    .replace(/^\./g, '0.')
}

const justQuote = async () => {
  console.log('justquote:', sellingVal.value, sellingcoinInfo.value)
  const num = 10 ** Number(sellingcoinInfo.value.baseTokenDecimals)
  const spendAmount = new BigNumber(sellingVal.value).times(num).integerValue(BigNumber.ROUND_DOWN)
  if (
    !buycoinInfo.value.baseAddress ||
    !isFinite(Number(sellingVal.value)) ||
    Number(sellingVal.value) <= 0
  ) {
    return
  }
  balanceInquiryLoading.value = true
  const res: any = await APIgetSwap({
    chainId: chainId.value,
    amount: spendAmount,
    fromTokenAddress: resetAddress(sellingcoinInfo.value.baseAddress || okCoin),
    toTokenAddress: resetAddress(buycoinInfo.value.baseAddress),
    slippage: slippageVal.value / 100,
    userWalletAddress: address.value
  })
  balanceInquiryLoading.value = false
  return res
}

// 买入
const handleTrade = async () => {
  tradeLoading.value = true
  if (parseFloat(sellingVal.value || '0') == 0) {
    tradeLoading.value = false
    customMessage({
      type: 'error',
      title: `请输入数量`
    })
    return
  }
  if (sellingcoinInfo.value.balance == 0) {
    tradeLoading.value = false
    customMessage({
      type: 'error',
      title: `余额不足`
    })
    return
  }

  if (
    sellingcoinInfo.value.baseAddress != '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' &&
    sellingcoinInfo.value.baseAddress != ''
  ) {
    if (walletType.value == 'Evm') {
      const allowance: any = await handleEvmAllowance(
        address.value,
        mainNetworkCurrency(sellingcoinInfo.value.chainCode).approveAddress, // 这里要替换为全局网络的一个对应的配置
        sellingcoinInfo.value.baseAddress,
        mainNetworkCurrency(sellingcoinInfo.value.chainCode).rpc
      )
      console.log('allowance:' + allowance)
      if (allowance == 0) {
        const approveResult = await handleEvmApprove(
          mainNetworkCurrency(sellingcoinInfo.value.chainCode).approveAddress,
          sellingcoinInfo.value.baseAddress,
          BigInt(infinityAmount)
        )
        if (!approveResult) {
          tradeLoading.value = false
          customMessage({
            type: 'error',
            title: `代币授权失败`
          })
          return false
        }
      }
    }
  }

  const chainId = mainNetworkCurrency(sellingcoinInfo.value.chainCode).chainId

  const num = 10 ** Number(sellingcoinInfo.value.baseTokenDecimals)
  const spendAmount = new BigNumber(sellingVal.value).times(num).integerValue(BigNumber.ROUND_DOWN)
  console.log(spendAmount)
  const res: any = await APIgetSwap({
    chainId,
    amount: spendAmount,
    fromTokenAddress: resetAddress(sellingcoinInfo.value.baseAddress || okCoin),
    toTokenAddress: resetAddress(buycoinInfo.value.baseAddress),
    slippage: slippageVal.value / 100,
    userWalletAddress: address.value
  })
  let result: any = ''
  if (walletType.value == 'Evm') {
    result = await sendEvmTransaction(res)
  } else if (walletType.value == 'Solana') {
    result = await sendSolanaTransaction(
      res,
      mainNetworkCurrency(sellingcoinInfo.value.chainCode).rpc
    )
  }
  if (result) {
    tradeLoading.value = false
    sellingVal.value = ''
    buyVal.value = ''
    positionVal.value = 0
    updateWalletInfo()
    customMessage({
      type: 'success',
      title: i18n.t('TransactionSuccessful')
    })
  } else {
    tradeLoading.value = false
    customMessage({
      type: 'error',
      title: i18n.t('TransactionFailed')
    })
  }
}

// 监听连接钱包的变化
watch(isConnected, (newValue) => {
  if (newValue) {
    updateWalletInfo()
    customMessage({
      type: 'success',
      title: i18n.t('WalletConnected')
    })
  }
})

// 监听地址和链ID变化
watch([address, chainId], () => {
  updateWalletInfo()
  if (isConnected.value) {
    customMessage({
      type: 'success',
      title: i18n.t('WalletDetailsUpdated')
    })
  }
})

onMounted(() => {
  sessionStorage.setItem('selectCoinInfo', JSON.stringify(sellingcoinInfo.value))
  if (sellingcoinInfo.value.chainCode != 'SOLANA') {
    timer.value = setInterval(async () => {
      gasPrice.value = await getEvmGasPrice(
        mainNetworkCurrency(sellingcoinInfo.value.chainCode).rpc
      )
    }, 1000)
  }
  isConnected.value && updateWalletInfo()

  tradeTimer.value = setInterval(() => {
    isConnected.value && updateWalletInfo()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timer.value)
  clearInterval(tradeTimer.value)
})
</script>

<style lang="scss" scoped>
.transaction-main {
  .transaction-coin {
    position: relative;
    .transaction-coin-item {
      padding: 12px 12px 16px;
      border-radius: 8px;
      background-color: rgba(58, 60, 64, 0.2);
      font-size: 14px;
      color: #848e9c;
      line-height: 1.2;
      .transaction-coin-item-p {
        font-size: 12px;
        span:last-child {
          cursor: pointer;
        }
      }
      .transaction-coin-name {
        font-size: 12px;
        color: var(--dex-color-4);
      }
      .icon-svg {
        width: 16px;
        height: 16px;
        margin-left: 2px;
      }
    }
    .transaction-coin-item:first-child {
      margin-bottom: 8px;
    }
    .transaction-input {
      font-size: 16px;
      color: var(--font-color-default);
      margin-top: 8px;
      .search-chain {
        cursor: pointer;
      }
      .transaction-input-span {
        font-size: 12px;
        color: var(--dex-color-4);
      }
      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px transparent !important;
      }
      :deep(.el-input__inner) {
        text-align: right;
        color: var(--font-color-default);
        font-size: 16px;
      }
      .logo {
        position: relative;
        margin-right: 8px;
      }
      .logo,
      .logo-img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -ms-border-radius: 50%;
        -o-border-radius: 50%;
      }
      .chainCode {
        width: 14px;
        height: 14px;
        position: absolute;
        right: -2px;
        bottom: -2px;
      }
    }
    .arrow-box {
      width: 28px;
      height: 28px;
      position: absolute;
      top: 50%;
      left: 45%;
      margin-right: -28px;
      margin-top: -14px;
      z-index: 2;
    }
    .arrow-down {
      width: 28px;
      height: 28px;
      padding: 4px;
      border-radius: 50%;
      cursor: pointer;
      color: var(--dex-color-4);
      background: var(--card-bg-color);
    }
    .arrow-box:before {
      content: '';
      animation: arrowanimation 0.7s linear;
      animation-iteration-count: infinite;
      border-radius: 50%;
      background-image: linear-gradient(180deg, transparent 84%, #5e6773);
      width: 29px;
      height: 29px;
      top: -0.5px;
      left: -0.5px;
      opacity: 0;
      position: absolute;
      transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: -1;
    }
    .arrow-box-animation:before {
      opacity: 1;
    }
  }
  .slider-info,
  .slider-info-item {
    margin-top: 8px;
    color: var(--dex-color-4);
  }
  .slider-info-item span:last-child {
    color: var(--font-color-default);
  }
  .wallet-icon {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
  .slider-info {
    :deep(.el-slider--small) {
      padding-right: 6px;
    }
    :deep(.el-slider__runway) {
      background-color: #0c0c0c;
    }
    :deep(.el-slider__marks-text) {
      font-size: 10px;
      color: var(--font-color-default);
    }
    :deep(.el-slider__stop:first-child),
    :deep(.el-slider__stop:last-child) {
      display: none;
    }
    :deep(.transaction-btn) {
      width: 100%;
      height: 29px;
      margin: 14px 0;
      border-radius: 4px !important;
      font-weight: normal;
    }
    :deep(.el-input__inner) {
      color: var(--font-color-default);
    }

    :deep(.connect-wallet-btn) {
      margin: 14px 0;
      height: 29px;
      border-radius: 4px;
    }
  }
  :deep(.wallet-conn-btn) {
    width: 140px !important;
    height: auto !important;
    line-height: 1.2;
    border-radius: 10px;
    padding: 9px 0 !important;
    margin: 0;
    color: #434343;
  }
  :deep(.el-input__wrapper) {
    box-shadow: none;
    background-color: transparent;
  }
}

@keyframes arrowanimation {
  to {
    transform: rotate(1turn);
  }
}
</style>
