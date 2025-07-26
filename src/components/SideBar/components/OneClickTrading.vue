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
      <div class="trading-input-group">
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
          <el-tooltip
            v-for="(item, index) in buyPosition"
            :key="index"
            :content="`${item.value} ${buyInfo.baseSymbol}`"
            placement="bottom"
            :popper-class="'custom-tooltip'"
          >
            <span
              :class="buyIndex === item.value ? 'active' : ''"
              @click="handelBuy(item)"
              >{{ item.label }}</span
            >
          </el-tooltip>
        </div>
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
    <div class="btn tip-btn" v-if="buyGasTip || sellGasTip">{{ buyInfo.baseSymbol }}余额不足以支付Gas费用</div>
    
    <!-- 按钮容器 -->
    <div class="btn-container">
      <!-- 买入按钮 -->
      <div 
        class="btn" 
        :class="getBuyButtonClass()"
        @click="handleBuyClick"
      >
        <el-icon class="is-loading" v-if="loading && loadingType == 'buy'">
          <Loading />
        </el-icon>
        {{ getBuyButtonText() }}
      </div>
      
      <!-- 卖出按钮 -->
      <div 
        class="btn" 
        :class="getSellButtonClass()"
        @click="handleSellClick"
      >
        <el-icon class="is-loading" v-if="loading && loadingType == 'sell'">
          <Loading />
        </el-icon>
        {{ getSellButtonText() }}
      </div>
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
  handleEvmApprove
} from '@/utils/transition'
import { notificationInfo, notificationSuccessful, notificationFailed } from '@/utils/notification'
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
const loadingType = ref<string>('') // 'buy' 或 'sell'，表示哪个按钮在加载
const inputFocusType = ref<boolean>(false)
const buyGasTip = ref<boolean>(false) // 买入的 gas 提示
const sellGasTip = ref<boolean>(false) // 卖出的 gas 提示

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
  coinAmount.value = item.value.toString()
  // 不再重置 sellIndex
  tradeType.value = 'buy'
  inputFocusType.value = false
  buyGasTip.value = await getGas('buy')
}

const handelSell = async (item: any) => {
  sellIndex.value = item.value
  // 不再重置 buyIndex
  tradeType.value = 'sell'
  inputFocusType.value = false
  sellGasTip.value = await getGas('sell')
}

const handelCoinAmount = async () => {
  // 输入金额时只重置固定按钮的选择，不影响卖出选择
  buyIndex.value = 0
  tradeType.value = 'buy'
  inputFocusType.value = true
  buyGasTip.value = await getGas('buy')
}

const handeCoinFocus = async () => {
  inputFocusType.value = true
  buyIndex.value = 0
  tradeType.value = 'buy'
  buyGasTip.value = await getGas('buy')
}

const handelCoinBlur = () => {
  if (sellIndex.value !== 0 || buyIndex.value !== 0 || coinAmount.value == '') {
    inputFocusType.value = false
  }
}

const getGas = async (type: string = 'buy') => {
  let gasTipResult = false
  let spendAmount: any = 0
  if (type == 'buy') {
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
    toAddress: type == 'buy' ? buyInfo.value.baseAddress : sellInfo.value.baseAddress,
    chainCode: sellInfo.value.chainCode,
    contractAddress: sellInfo.value.baseAddress
  })

  gasTipResult = res ? false : true

  return gasTipResult
}

// 判断是否余额不足
const insufficientBalance = computed(() => {
  if (buyIndex.value > 0 || parseFloat(coinAmount.value || 0) > 0) {
    const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
    const spendAmount = new BigNumber(buyIndex.value || coinAmount.value)
      .times(num)
      .integerValue(BigNumber.ROUND_DOWN)
      .toString(10)
    return parseFloat(spendAmount) > parseFloat(buyInfo.value.balance)
  }
  return false
})

// 判断是否输入为0
const isZeroAmount = computed(() => {
  return buyIndex.value == 0 && parseFloat(coinAmount.value || 0) == 0
})

// 判断卖出时余额是否为0
const sellInsufficientBalance = computed(() => {
  return sellInfo.value.balance == 0
})

// 判断买入按钮是否可用
const buyButtonDisabled = computed(() => {
  const coinInfo = buyInfo.value
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

  if (buyGasTip.value) {
    return true
  }

  if (buyIndex.value == 0 && parseFloat(coinAmount.value || 0) == 0) return true
  const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
  const spendAmount = new BigNumber(buyIndex.value || coinAmount.value)
    .times(num)
    .integerValue(BigNumber.ROUND_DOWN)
    .toString(10)
  if (parseFloat(spendAmount) > parseFloat(coinInfo.balance)) return true

  return false
})

// 判断卖出按钮是否可用
const sellButtonDisabled = computed(() => {
  const coinInfo = sellInfo.value
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

  if (sellGasTip.value) {
    return true
  }

  if (sellIndex.value == 0) {
    return true
  }

  return false
})

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

const handelBuySell = async (type: string) => {
  loading.value = true
  loadingType.value = type
  
  if (type == 'sell') {
    if (walletType.value == 'Email') {
      await handelCustomTradeSwap(sellInfo.value, buyInfo.value, type)
    } else {
      await handleTrade(sellInfo.value, buyInfo.value, type)
    }
  } else {
    if (walletType.value == 'Email') {
      await handelCustomTradeSwap(buyInfo.value, sellInfo.value, type)
    } else {
      await handleTrade(buyInfo.value, sellInfo.value, type)
    }
  }
  loading.value = false
  loadingType.value = ''
}

const handleTrade = async (selectSellCoin: any, selectBuyCoin: any, type: any) => {
  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}正在发起`,
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
          title: `${selectSellCoin.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}授权中`,
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
            title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}授权失败`,
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
      title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}成功`,
      message: `${type == 'buy' ? '买入' : '卖出'}成功`
    })
  } else {
    notificationFailed({
      title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}失败`,
      message: `${type == 'buy' ? '买入' : '卖出'}失败`
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
  if (res.code == 200) {
    notificationSuccessful({
      title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}成功`,
      message:
        type == 'buy'
          ? `<div class='display-flex flex-direction-col notification-box'>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>买入</span>
                        <span class='up-color'>${numberFormat(res.data.fromTokenAmount) + ' ' + selectSellCoin.baseSymbol}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>成交市值</span>
                        <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>获得</span>
                        <span class='up-color'>${numberFormat(res.data.toTokenAmount) + ' ' + selectBuyCoin.baseSymbol}</span>
                    </div>
                  </div>`
          : `<div class='display-flex flex-direction-col notification-box'>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>卖出</span>
                        <span class='down-color'>${numberFormat(res.data.fromTokenAmount) + ' ' + selectSellCoin.baseSymbol}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>成交市值</span>
                        <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>获得</span>
                        <span class='down-color'>${numberFormat(res.data.toTokenAmount) + ' ' + selectBuyCoin.baseSymbol}</span>
                    </div>
                  </div>`
    })
  } else {
    notificationFailed({
      title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}失败`,
      message: `${res.msg}`
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

// 定义 emit
const emit = defineEmits(['showRecharge'])

// 处理余额不足时的点击
const handleInsufficientClick = () => {
  if (insufficientBalance.value || sellInsufficientBalance.value) {
    emit('showRecharge')
  }
}

// 获取买入按钮样式
const getBuyButtonClass = () => {
  if (buyButtonDisabled.value) {
    return insufficientBalance.value || isZeroAmount.value ? 'disabled-btn insufficient-btn' : 'disabled-btn'
  }
  
  // 如果有买入选择，显示激活状态
  if (buyIndex.value > 0 || parseFloat(coinAmount.value || 0) > 0) {
    return 'buy-submit-btn'
  }
  
  // 默认显示未激活的买入按钮
  return 'buy-btn-inactive'
}

// 获取卖出按钮样式
const getSellButtonClass = () => {
  if (sellButtonDisabled.value) {
    return sellInsufficientBalance.value ? 'disabled-btn insufficient-btn' : 'disabled-btn'
  }
  
  // 如果有卖出选择，显示激活状态
  if (sellIndex.value > 0) {
    return 'sell-submit-btn'
  }
  
  // 默认显示未激活的卖出按钮
  return 'sell-btn-inactive'
}

// 获取买入按钮文字
const getBuyButtonText = () => {
  if (buyIndex.value === 0 && parseFloat(coinAmount.value || 0) === 0) return '买入'
  
  if (isZeroAmount.value) return '选择数量'
  if (insufficientBalance.value) return `${buyInfo.value.baseSymbol} 余额不足，请充值`
  
  return `买入 ${buyIndex.value || coinAmount.value ? numberFormat(buyIndex.value || coinAmount.value) + ' ' + buyInfo.value.baseSymbol : ''}`
}

// 获取卖出按钮文字
const getSellButtonText = () => {
  if (sellIndex.value === 0) return '卖出'
  
  if (sellInsufficientBalance.value) return `${sellInfo.value.baseSymbol} 余额不足，请充值`
  
  return `卖出 ${
    numberFormat(
      sellIndex.value === 1 ? balanceFormat(sellInfo.value) : balanceFormat(sellInfo.value) * sellIndex.value
    ) +
    ' ' +
    sellInfo.value.baseSymbol
  }`
}

// 处理买入按钮点击
const handleBuyClick = () => {
  // 如果没有选择买入数量，不执行操作
  if (buyIndex.value === 0 && parseFloat(coinAmount.value || 0) === 0) {
    return
  }
  
  if (buyButtonDisabled.value) {
    if (insufficientBalance.value || isZeroAmount.value) {
      handleInsufficientClick()
    }
    return
  }
  
  if (!loading.value) {
    handelBuySell('buy')
  }
}

// 处理卖出按钮点击
const handleSellClick = () => {
  // 如果没有选择卖出比例，不执行操作
  if (sellIndex.value === 0) {
    return
  }
  
  if (sellButtonDisabled.value) {
    if (sellInsufficientBalance.value) {
      handleInsufficientClick()
    }
    return
  }
  
  if (!loading.value) {
    handelBuySell('sell')
  }
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
      color: #cacad5;
      font-size: 12px;
      font-weight: normal;
      margin-bottom: 8px;
      font-family: 'PingFangSC-Medium';
    }
  }
  .trading-input-group {
    background: #1F2024FF;
    border-radius: 5px;
    padding: 2px;
    position: relative;
    .input-box {
      position: relative;
      padding-bottom: 2px;
      margin: 0 -2px;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-color: #151515;
      }
    }
  }
  .trading-buy {
    .display-flex {

    }
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 22px;
      background: transparent;
      border-radius: 4px;
      border: none;
      font-size: 12px;
      color: #cacad5;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'PingFangSC-Medium';
      position: relative;
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        right: -1px;
        top: 0;
        height: 100%;
        width: 1px;
        background-color: #151515;
      }
    }
    .active {
      // 保持原始颜色，不改变
    }
  }
  .input-box {
    margin-bottom: 0;
    :deep(.el-input__wrapper) {
      box-shadow: none !important;
      background-color: transparent !important;
      font-size: 12px;
      padding: 0 11px;
      height: 28px;
      .el-input__suffix {
        color: #cacad5 !important;
        font-family: 'PingFangSC-Medium';
      }
      .el-input__inner {
        color: #cacad5 !important;
        font-family: 'PingFangSC-Medium';
      }
    }
    :deep(.el-input__wrapper:hover),
    :deep(.el-input__wrapper:focus) {
      box-shadow: none !important;
    }
    .input-focus {
      :deep(.el-input__wrapper) {
        box-shadow: none !important;
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
      background: #1F2024FF;
      border: none;
      font-size: 12px;
      color: #cacad5;
      font-size: 12px;
      font-family: 'PingFangSC-Medium';
      cursor: pointer;
      transition: all 0.2s;
    }
    span:hover,
    .active {
      border: 1px solid var(--down-color);
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
    height: 32px;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    margin: 14px 0;
    font-family: 'PingFangSC-Medium';
  }
  .tip-btn {
    background: rgba(245, 39, 39, 0.3);
    color: rgba(245, 39, 39, 1);
  }

  .disabled-btn {
    background: #393c43;
    color: #5c6068;
  }
  .insufficient-btn {
    color: #cacad5 !important;
    cursor: pointer !important;
  }
  .buy-submit-btn {
    transition: all 0.3s;
    background: var(--up-color);
    color: #f5f5f5;
  }

  .buy-submit-btn:active {
    transition: all 0.3s;
    outline: none;
    box-shadow: 0 0 0 6px rgba(46, 189, 133, 0.1);
  }

  .sell-submit-btn {
    transition: all 0.3s;
    background: var(--down-color);
    color: #f5f5f5;
  }
  .sell-submit-btn:active {
    transition: all 0.3s;
    outline: none;
    box-shadow: 0 0 0 6px rgba(246, 70, 93, 0.1);
  }
  
  // 未激活的买入按钮样式
  .buy-btn-inactive {
    background: rgba(46, 189, 133, 0.3);
    color: rgba(46, 189, 133, 0.8);
    cursor: not-allowed;
  }
  
  // 未激活的卖出按钮样式
  .sell-btn-inactive {
    background: rgba(246, 70, 93, 0.3);
    color: rgba(246, 70, 93, 0.8);
    cursor: not-allowed;
  }
  
  .btn-container {
    display: flex;
    gap: 8px;
    margin: 14px 0;
    
    .btn {
      flex: 1;
      margin: 0;
    }
  }
}
</style>

<style>
/* 全局样式用于tooltip */
.custom-tooltip {
  background-color: #000000 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15) !important;
}
.custom-tooltip .el-tooltip__popper[x-placement^="bottom"] .el-popper__arrow::before,
.custom-tooltip .el-popper__arrow::before {
  background-color: #000000 !important;
  border: none !important;
}
</style>
