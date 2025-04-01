<template>
  <div class="one-click-trading">
    <div class="trading-buy trading-operate">
      <p>
        {{ buyInfo.baseSymbol }}:
        {{ buyInfo.balance == 0 ? '0.0' : numberFormat(balanceFormat(buyInfo)) + ' ≈ ' }}
        <i style="font-size: 11px; font-style: normal" v-if="buyInfo.balance != 0"
          >${{ numberFormat(buyInfo.totalAmount) }}</i
        >
      </p>
      <div class="input-box">
        <el-input
          v-model="coinAmount"
          :class="inputFocusType ? 'input-focus' : ''"
          oninput="value=value.replace(/[^0-9.]/g,'')"
          style="width: 100%"
          placeholder="请输入"
          @focus="handeCoinFocus"
          @blur="handelCoinBlur"
          @input="handelCoinAmount"
        >
          <template #suffix>{{ buyInfo.baseSymbol }}</template>
        </el-input>
      </div>
      <div class="display-flex align-items-center justify-content-sp">
        <span
          v-for="(item, index) in buyPosition"
          :key="index"
          :class="buyIndex === item.value ? 'active' : ''"
          @click="handelBuy(item)"
          >{{ item.label }}</span
        >
      </div>
    </div>
    <div class="trading-sell trading-operate">
      <p>
        {{ sellInfo.baseSymbol }}:
        {{ sellInfo.balance == 0 ? '0.0' : numberFormat(balanceFormat(sellInfo)) + ' ≈ ' }}
        <i style="font-size: 11px; font-style: normal" v-if="sellInfo.balance != 0"
          >${{ numberFormat(sellInfo.totalAmount) }}</i
        >
      </p>
      <div class="display-flex align-items-center justify-content-sp">
        <span
          v-for="(item, index) in sellPosition"
          :key="index"
          :class="sellIndex === item.value ? 'active' : ''"
          @click="handelSell(item)"
          >{{ item.label }}</span
        >
      </div>
    </div>
    <div class="btn tip-btn" v-if="gasTip">{{ buyInfo.baseSymbol }}余额不足以支付Gas费用</div>
    <div class="btn disabled-btn" v-if="buySellType">
      {{
        tradeType == 'buy'
          ? `买入 ${buyIndex || coinAmount ? numberFormat(buyIndex || coinAmount) + ' ' + buyInfo.baseSymbol : ''}`
          : `卖出 ${
              numberFormat(
                sellIndex === 1 ? balanceFormat(sellInfo) : balanceFormat(sellInfo) * sellIndex
              ) +
              ' ' +
              sellInfo.baseSymbol
            }`
      }}
    </div>
    <div
      :class="tradeType == 'buy' ? 'btn buy-submit-btn' : 'btn sell-submit-btn'"
      v-else
      @click="loading ? null : handelBuySell()"
    >
      <el-icon class="is-loading" v-if="loading">
        <Loading />
      </el-icon>
      {{
        tradeType == 'buy'
          ? `买入 ${buyIndex || coinAmount ? numberFormat(buyIndex || coinAmount) + ' ' + buyInfo.baseSymbol : ''}`
          : `卖出 ${
              numberFormat(
                sellIndex === 1 ? balanceFormat(sellInfo) : balanceFormat(sellInfo) * sellIndex
              ) +
              ' ' +
              sellInfo.baseSymbol
            }`
      }}
    </div>
    <AdvancedSetting
      ref="advancedSetting"
      :coinInfo="{
        buyCoin: buyInfo,
        sellCoin: sellInfo
      }"
      :mainNetworkCurrencyPrice="mainNetworkCurrencyPrice"
      @slippage="handelSlippage"
    />
    <WalletConnect v-if="!isConnected" class="mask" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { mainNetworkCurrency, numberFormat } from '@/utils'
import { infinityAmount } from '@/types'
import BigNumber from 'bignumber.js'
import {
  balanceFormat,
  resetAddress,
  handleEvmAllowance,
  sendEvmTransaction,
  sendSolanaTransaction,
  handelSwitchNetwork,
  handleEvmApprove,
  solanaTransactionReceipt,
  evmTransactionReceipt
} from '@/utils/transition'
import {
  notificationInfo,
  notificationSuccessful,
  notificationFailed,
  notificationWarn
} from '@/utils/notification'
import { useI18n } from 'vue-i18n'
import { APItokenEstimateGas } from '@/api'
import { APIgetSwap, APIauthTradeSwap } from '@/api/coinWalletDetails'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { useGlobalStore } from '@/stores/global'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import AdvancedSetting from './AdvancedSetting.vue'
import { customMessage } from '@/utils/message'

const globalStore = useGlobalStore()
const chainConfigs = useChainConfigsStore().chainConfigs

const address = computed(() => globalStore.walletInfo.address)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const chainId = computed(() => globalStore.walletInfo.chainId)
const walletType = computed(() => globalStore.walletInfo.walletType)
const customWalletInfo = computed(() => globalStore.customWalletInfo)

const tokenList = computed(() => globalStore.tokenList)

const i18n = useI18n()

const networkResult = ref<boolean>(true) // 网络对比结果

const advancedSetting = ref<any>(null)
const account: any = localStorage.getItem('accountInfo')
const slippage = ref<any>(account ? JSON.parse(account).slippage : '0.03') // 滑点

const coinAmount = ref<any>('')

const buyIndex = ref<number>(0)
const sellIndex = ref<number>(0)
const tradeType = ref<string>('buy')
const gasTip = ref<any>(false)
const loading = ref<boolean>(false)
const inputFocusType = ref<boolean>(false)

const handelSlippage = (val: any) => {
  slippage.value = val
}

const props = defineProps({
  coinInfo: {
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

const buyPosition = [
  {
    label: '0.1',
    value: 0.1
  },
  {
    label: '0.5',
    value: 0.5
  },
  {
    label: '1',
    value: 1
  },
  {
    label: '5',
    value: 5
  }
]

const sellPosition = [
  {
    label: '10%',
    value: 0.1
  },
  {
    label: '20%',
    value: 0.2
  },
  {
    label: '50%',
    value: 0.5
  },
  {
    label: '100%',
    value: 1
  }
]

// 交易逻辑

const buyInfo = ref({
  ...props.coinInfo.buyCoin
})

const sellInfo = ref({
  ...props.coinInfo.sellCoin
})

const mainNetworkCurrencyAmount = ref<any>(0)
const mainNetworkCurrencyPrice = ref<number>(0)
const updateTradingInfo = () => {
  networkResult.value = mainNetworkCurrency(sellInfo.value.chainCode).chainId == chainId.value

  const res: any = tokenList.value
  mainNetworkCurrencyAmount.value = res?.[0]?.amount || 0
  mainNetworkCurrencyPrice.value = parseFloat(res?.[0]?.price || 0)
  if (sellInfo.value.baseAddress) {
    const obj = res?.find((item: any) => item.address == sellInfo.value.baseAddress)
    sellInfo.value.balance = obj?.amount || 0
    sellInfo.value.totalAmount = obj?.totalAmount || 0
  }
  if (buyInfo.value.baseAddress) {
    const obj = res?.find((item: any) => item.address == buyInfo.value.baseAddress)
    buyInfo.value.balance = obj?.amount || 0
    buyInfo.value.totalAmount = obj?.totalAmount || 0
  }
}

const handelBuy = async (item: any) => {
  buyIndex.value = item.value
  sellIndex.value = 0
  tradeType.value = 'buy'
  inputFocusType.value = false
  gasTip.value = await getGas()
}

const handelSell = async (item: any) => {
  sellIndex.value = item.value
  buyIndex.value = 0
  tradeType.value = 'sell'
  inputFocusType.value = false
  gasTip.value = await getGas()
}

const handelCoinAmount = async () => {
  buyIndex.value = 0
  sellIndex.value = 0
  tradeType.value = 'buy'
  inputFocusType.value = true
  gasTip.value = await getGas()
}

const handeCoinFocus = async () => {
  inputFocusType.value = true
  buyIndex.value = 0
  sellIndex.value = 0
  tradeType.value = 'buy'
  gasTip.value = await getGas()
}

const handelCoinBlur = () => {
  if (sellIndex.value !== 0 || buyIndex.value !== 0 || coinAmount.value == '') {
    inputFocusType.value = false
  }
}

const getGas = async () => {
  let type = false
  let spendAmount: any = 0
  if (tradeType.value == 'buy') {
    const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
    spendAmount = new BigNumber(buyIndex.value || coinAmount.value)
      .times(num)
      .integerValue(BigNumber.ROUND_DOWN)
  } else {
    spendAmount =
      sellIndex.value === 1
        ? sellInfo.value.balance
        : Math.floor(sellInfo.value.balance * sellIndex.value)
  }

  const res = await APItokenEstimateGas({
    amount: spendAmount,
    walletAddress:
      walletType.value == 'Email' ? customWalletInfo.value.walletInfo?.wallet : address.value,
    toAddress: tradeType.value == 'buy' ? buyInfo.value.baseAddress : sellInfo.value.baseAddress,
    chainCode: sellInfo.value.chainCode,
    contractAddress: sellInfo.value.baseAddress
  })

  type = res ? false : true

  return type
}

const buySellType = computed(() => {
  const coinInfo = tradeType.value == 'buy' ? buyInfo.value : sellInfo.value
  if (walletType.value == 'Email') {
    if (coinInfo.chainCode !== customWalletInfo.value.chainCode) {
      return true
    }
  } else {
    if (
      coinInfo.chainCode !=
      chainConfigs?.find((item: any) => item.chainId == chainId.value)?.chainCode
    ) {
      return true
    }
  }

  if (coinInfo.balance == 0) {
    return true
  }

  if (gasTip.value) {
    return true
  }

  if (tradeType.value == 'buy') {
    if (buyIndex.value == 0 && parseFloat(coinAmount.value || 0) == 0) return true
    const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
    const spendAmount = new BigNumber(buyIndex.value || coinAmount.value)
      .times(num)
      .integerValue(BigNumber.ROUND_DOWN)
      .toString(10)
    if (parseFloat(spendAmount) > parseFloat(coinInfo.balance)) return true
  }

  if (tradeType.value == 'sell' && sellIndex.value == 0) {
    return true
  }

  return false
})

const handelBuySell = async () => {
  loading.value = true
  if (tradeType.value == 'sell') {
    if (walletType.value == 'Email') {
      await handelCustomTradeSwap(sellInfo.value, buyInfo.value, tradeType.value)
    } else {
      await handleTrade(sellInfo.value, buyInfo.value, tradeType.value)
    }
  } else {
    if (walletType.value == 'Email') {
      await handelCustomTradeSwap(buyInfo.value, sellInfo.value, tradeType.value)
    } else {
      await handleTrade(buyInfo.value, sellInfo.value, tradeType.value)
    }
  }
  loading.value = false
}

const handleTrade = async (selectSellCoin: any, selectBuyCoin: any, type: any) => {
  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}交易正在发起`,
    message: `<div class="display-flex align-items-center">
                  <p class="notification_loader"></p>
                  <span>正在发起</span>
                </div>
                <div class=${type == 'buy' ? 'notification-step-line-up' : 'notification-step-line-down'}></div>
                `
  })
  if (
    selectSellCoin.baseAddress != '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' &&
    selectSellCoin.baseAddress != ''
  ) {
    if (walletType.value == 'Evm') {
      const allowance: any = await handleEvmAllowance(
        address.value,
        mainNetworkCurrency(selectSellCoin.chainCode).approveAddress, // 这里要替换为全局网络的一个对应的配置
        selectSellCoin.baseAddress,
        mainNetworkCurrency(selectSellCoin.chainCode).rpc
      )
      console.log('allowance:' + allowance)
      if (allowance == 0) {
        notificationInfo({
          title: `${selectSellCoin.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}交易授权中`,
          message: `<div class="display-flex align-items-center">
                      <p class="notification_loader"></p>
                      <span>授权中</span>
                    </div>
                    <div class=${type == 'buy' ? 'notification-step-line-up' : 'notification-step-line-down'}></div>
                    `
        })
        const approveResult = await handleEvmApprove(
          mainNetworkCurrency(selectSellCoin.chainCode).approveAddress, // 这里要替换为全局网络的一个对应的配置
          selectSellCoin.baseAddress,
          BigInt(infinityAmount)
        )
        if (!approveResult) {
          notificationFailed({
            title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}交易授权失败`,
            message: `授权失败`
          })
          return false
        }
      }
    }
  }

  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}处理中`,
    message: `<div class="display-flex align-items-center notification-box">
                <span class='notification-txt'>${type == 'buy' ? '买入' : '卖出'}</span>
                <span class=${type == 'buy' ? 'up-color' : 'down-color'}>${type == 'buy' ? numberFormat(buyIndex.value || coinAmount.value) + ' ' + buyInfo.value.baseSymbol : numberFormat(balanceFormat(sellInfo.value) * sellIndex.value) + ' ' + sellInfo.value.baseSymbol}</span>
                <i></i>
                <span class='notification-txt'>成交市值</span>
                <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
                </div>
              <div class=${type == 'buy' ? 'notification-step-line-up' : 'notification-step-line-down'}></div>
              `
  })

  const chainId = mainNetworkCurrency(selectSellCoin.chainCode).chainId

  let spendAmount: any = 0
  if (type == 'buy') {
    const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
    spendAmount = new BigNumber(buyIndex.value || coinAmount.value)
      .times(num)
      .integerValue(BigNumber.ROUND_DOWN)
  } else {
    spendAmount =
      sellIndex.value === 1
        ? selectSellCoin.balance
        : Math.floor(selectSellCoin.balance * sellIndex.value)
  }

  console.log(spendAmount)

  const res: any = await APIgetSwap({
    chainId,
    amount: spendAmount,
    fromTokenAddress: resetAddress(selectSellCoin.baseAddress),
    toTokenAddress: resetAddress(selectBuyCoin.baseAddress),
    slippage: slippage.value,
    userWalletAddress: address.value
  })
  let result: any = ''
  if (walletType.value == 'Evm') {
    result = await sendEvmTransaction(res)
  } else if (walletType.value == 'Solana') {
    result = await sendSolanaTransaction(res, mainNetworkCurrency(selectSellCoin.chainCode).rpc)
  }
  if (result) {
    notificationSuccessful({
      title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}交易成功`,
      message: `${i18n.t('TransactionSuccessful')}`
    })
  } else {
    notificationFailed({
      title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}交易失败`,
      message: `${i18n.t('TransactionFailed')}`
    })
  }
}

const handelCustomTradeSwap = async (selectSellCoin: any, selectBuyCoin: any, type: any) => {
  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}处理中`,
    message: `<div class="display-flex align-items-center notification-box">
                <span class='notification-txt'>${type == 'buy' ? '买入' : '卖出'}</span>
                <span class=${type == 'buy' ? 'up-color' : 'down-color'}>${type == 'buy' ? numberFormat(buyIndex.value || coinAmount.value) + ' ' + buyInfo.value.baseSymbol : numberFormat(balanceFormat(sellInfo.value) * sellIndex.value) + ' ' + sellInfo.value.baseSymbol}</span>
                <i></i>
                <span class='notification-txt'>成交市值</span>
                <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
                </div>
              <div class=${type == 'buy' ? 'notification-step-line-up' : 'notification-step-line-down'}></div>
              `
  })

  let spendAmount: any = 0
  if (type == 'buy') {
    const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
    spendAmount = new BigNumber(buyIndex.value || coinAmount.value)
      .times(num)
      .integerValue(BigNumber.ROUND_DOWN)
  } else {
    spendAmount =
      sellIndex.value === 1
        ? selectSellCoin.balance
        : Math.floor(selectSellCoin.balance * sellIndex.value)
  }

  console.log(spendAmount)

  const res: any = await APIauthTradeSwap({
    amount: new BigNumber(spendAmount).toString(10),
    walletId: customWalletInfo.value.walletInfo?.walletId,
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    fromTokenAddress: resetAddress(selectSellCoin.baseAddress),
    toTokenAddress: resetAddress(selectBuyCoin.baseAddress),
    fromTokenDecimals: Number(selectSellCoin.baseTokenDecimals),
    toTokenDecimals: Number(selectBuyCoin.baseTokenDecimals),
    slippage: slippage.value.toString(),
    type: type == 'buy' ? '0' : '1',
    tradeType: 'F',
    price: props.pairInfo.price,
    profitFlag: type == 'buy' ? parseFloat(localStorage.getItem('increaseSet') || '0') / 100 : 0
  })
  if (res) {
    const result =
      selectSellCoin.chainCode == 'SOLANA'
        ? await solanaTransactionReceipt(res.tx, mainNetworkCurrency(selectSellCoin.chainCode).rpc)
        : await evmTransactionReceipt(res.tx, mainNetworkCurrency(selectSellCoin.chainCode).rpc)
    if (result === true) {
      notificationSuccessful({
        title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}交易成功`,
        message:
          type == 'buy'
            ? `<div class='display-flex flex-direction-col notification-box'>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>买入</span>
                        <span class='up-color'>${numberFormat(res.fromTokenAmount) + ' ' + selectSellCoin.baseSymbol}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>成交市值</span>
                        <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>获得</span>
                        <span class='up-color'>${numberFormat(res.toTokenAmount) + ' ' + selectBuyCoin.baseSymbol}</span>
                    </div>
                  </div>`
            : `<div class='display-flex flex-direction-col notification-box'>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>卖出</span>
                        <span class='down-color'>${numberFormat(res.fromTokenAmount) + ' ' + selectSellCoin.baseSymbol}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>成交市值</span>
                        <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>获得</span>
                        <span class='down-color'>${numberFormat(res.toTokenAmount) + ' ' + selectBuyCoin.baseSymbol}</span>
                    </div>
                  </div>`
      })
    } else if (result === false) {
      notificationFailed({
        title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}交易失败`,
        message: `${i18n.t('TransactionFailed')}`
      })
    } else {
      notificationWarn({
        title: `${sellInfo.value.baseSymbol}`,
        message: `${result}`
      })
    }
  } else {
    notificationFailed({
      title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}交易失败`,
      message: `${i18n.t('TransactionFailed')}`
    })
  }
}
// 监听连接钱包的变化
watch(isConnected, (newValue) => {
  if (newValue) {
    if (walletType.value !== 'Email') {
      customMessage({
        type: 'success',
        title: i18n.t('WalletConnected')
      })
    }
  }
})

watch(tokenList, () => {
  updateTradingInfo()
})

// 网络检测
const networkDetection = () => {
  if (!networkResult.value) {
    handelSwitchNetwork(walletType.value, sellInfo.value)
    return false
  }
  return true
}

onMounted(() => {
  updateTradingInfo()
})

defineExpose({
  buyInfo
})
</script>

<style lang="scss" scoped>
.one-click-trading {
  padding: 0px 2px;
  position: relative;
  :deep(.mask) {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
  .trading-operate {
    margin-bottom: 7px;
    p {
      color: #5c6068;
      font-size: 12px;
      font-weight: normal;
      margin-bottom: 8px;
      font-family: 'PingFangSC-Medium';
    }
  }
  .trading-buy {
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 25px;
      background: transparent;
      border-radius: 4px;
      border: 1px solid #26282c;
      font-size: 12px;
      color: #5c6068;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'PingFangSC-Medium';
    }
    span:hover,
    .active {
      color: rgba(23, 178, 106, 1);
      border: 1px solid rgba(23, 178, 106, 1);
    }
  }
  .input-box {
    margin-bottom: 8px;
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px #26282c !important;
      font-size: 12px;
      padding: 0 11px;
      .el-input__suffix,
      .el-input__inner {
        color: #5c6068 !important;
        font-family: 'PingFangSC-Medium';
      }
    }
    :deep(.el-input__wrapper:hover),
    :deep(.el-input__wrapper:focus) {
      box-shadow: 0 0 0 1px rgba(23, 178, 106, 1) !important;
    }
    .input-focus {
      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px rgba(23, 178, 106, 1) !important;
      }
    }
  }
  .trading-sell {
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 25px;
      border-radius: 4px;
      border: 1px solid #26282c;
      font-size: 12px;
      color: #5c6068;
      font-size: 12px;
      font-family: 'PingFangSC-Medium';
      cursor: pointer;
      transition: all 0.2s;
    }
    span:hover,
    .active {
      color: rgba(245, 39, 39, 1);
      border: 1px solid rgba(245, 39, 39, 1);
    }
    .btn-disabled {
      cursor: not-allowed;
    }
  }
  .tip-header {
    .chainCode {
      width: 30px;
      height: 30px;
      margin-right: 6px;
    }
    span {
      font-size: 18px;
    }
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #fff;
    border-color: #fff;
  }
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner:after) {
    border-color: var(--bg-color);
  }
  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: #cfd3dc;
  }
  .tip-body {
    margin: 12px 0;
  }
  .tip-footer {
    span {
      display: inline-block;
      padding: 6px 15px;
      font-size: 14px;
      border-radius: 8px;
      cursor: pointer;
      margin-left: 12px;
    }

    span:first-child {
      background-color: #404040;
    }
    span:last-child {
      background-color: #fff;
      color: var(--bg-color);
    }
  }
  .btn {
    border-radius: 4px;
    height: 29px;
    line-height: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    margin: 14px 0;
    font-family: 'PingFangSC-Heavy';
  }
  .tip-btn {
    background: rgba(245, 39, 39, 0.3);
    color: rgba(245, 39, 39, 1);
  }

  .disabled-btn {
    background: #393c43;
    color: #5c6068;
  }
  .buy-submit-btn {
    background: var(--up-color);
    color: #f5f5f5;
  }

  .sell-submit-btn {
    background: var(--down-color);
    color: #f5f5f5;
  }
}
</style>
