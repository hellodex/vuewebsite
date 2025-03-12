<template>
  <div class="operate-btn" @click.stop="handelOccupy" v-if="loading">
    <el-icon class="is-loading icon-buy-cur" color="#fff">
      <Loading />
    </el-icon>
    <span class="txt">
      <slot>买入</slot>
    </span>
  </div>
  <div class="operate-btn" @click.stop="handelBuy" v-else>
    <svg-icon name="icon-buy-cur" class="icon-buy"></svg-icon>
    <span class="txt">
      <slot>买入</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { handleCoinPairInfo, mainNetworkCurrency, numberFormat } from '@/utils'
import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { useI18n } from 'vue-i18n'
import BigNumber from 'bignumber.js'
import { infinityAmount } from '@/types'
import {
  resetAddress,
  handleEvmAllowance,
  sendEvmTransaction,
  sendSolanaTransaction,
  handelSwitchNetwork,
  handleEvmApprove,
  solanaTransactionReceipt,
  evmTransactionReceipt,
  getTokenList
} from '@/utils/transition'
import {
  notificationInfo,
  notificationSuccessful,
  notificationFailed,
  notificationWarn
} from '@/utils/notification'
import { APIgetSwap, APIauthTradeSwap } from '@/api/coinWalletDetails'
import { customMessage } from '@/utils/message'

const props = defineProps({
  info: {
    required: true,
    type: Object
  },
  amount: {
    required: true,
    type: String
  },
  tokenList: {
    type: Array
  }
})
const globalStore = useGlobalStore()
const i18n = useI18n()
const chainConfigs = useChainConfigsStore().chainConfigs

const address = computed(() => globalStore.walletInfo.address)
const chainId = computed(() => globalStore.walletInfo.chainId)
const walletType = computed(() => globalStore.walletInfo.walletType)
const customWalletInfo = computed(() => globalStore.customWalletInfo)
const networkResult = ref<boolean>(true) // 网络对比结果
const loading = ref<boolean>(false)
const account: any = localStorage.getItem('accountInfo')
const slippage = account ? JSON.parse(account).slippage : '0.03'

const coinInfo = computed(() =>
  handleCoinPairInfo({
    logo: props.info.logo,
    baseAddress: props.info.baseToken.address,
    quoteAddress: props.info.quoteToken.address,
    baseSymbol: props.info.baseToken.symbol,
    quoteSymbol: props.info.quoteToken.symbol,
    baseDecimal: props.info.baseToken.decimals,
    quoteDecimal: props.info.quoteToken.decimals,
    chainCode: props.info.chainCode || props.info.baseToken.chainCode
  })
)

const pairInfo = computed(() => {
  return {
    tvl: props.info.priceByPairAddress?.tvl || props.info.tvl || 0,
    circulationVol: props.info.priceByPairAddress?.marketCap || props.info.marketCap || 0,
    price: props.info.priceByPairAddress?.price || props.info.price || 0
  }
})

const updateTradingInfo = async () => {
  const res: any =
    walletType.value == 'Email' && props.tokenList
      ? props.tokenList
      : await getTokenList(
          walletType.value == 'Email'
            ? customWalletInfo.value.chainCode
            : chainConfigs?.find((item: { chainId: any }) => item.chainId == chainId.value)
                ?.chainCode,
          customWalletInfo.value.walletInfo?.wallet
        )
  if (coinInfo.value.buyCoin.baseAddress) {
    const obj = res?.find((item: any) => item.address == coinInfo.value.buyCoin.baseAddress)
    coinInfo.value.buyCoin.balance = obj?.amount || 0
    coinInfo.value.buyCoin.totalAmount = obj?.totalAmount || 0
  }
  if (coinInfo.value.sellCoin.baseAddress) {
    const obj = res?.find((item: any) => item.address == coinInfo.value.sellCoin.baseAddress)
    coinInfo.value.sellCoin.balance = obj?.amount || 0
    coinInfo.value.sellCoin.totalAmount = obj?.totalAmount || 0
  }
}

const handelOccupy = () => {
  console.log('loading', false)
}

const handelBuy = async () => {
  if (!parseFloat(props.amount)) {
    customMessage({
      type: 'error',
      title: '请输入买入数量'
    })
    return false
  }

  if (walletType.value !== 'Email') {
    if (!networkDetection()) {
      return false
    }
  }
  await updateTradingInfo()

  if (walletType.value == 'Email') {
    handelCustomTradeSwap(coinInfo.value.buyCoin, coinInfo.value.sellCoin, 'buy')
  } else {
    handleTrade(coinInfo.value.buyCoin, coinInfo.value.sellCoin, 'buy')
  }
}

const handleTrade = async (selectSellCoin: any, selectBuyCoin: any, type: any) => {
  if (selectSellCoin.balance == 0) {
    customMessage({
      type: 'error',
      title: '余额不足'
    })
    return
  }
  notificationInfo({
    title: `${selectBuyCoin.baseSymbol}：买入处理中`,
    message: `<div class="display-flex align-items-center">
                <p class="notification_loader"></p>
                <span>正在发起</span>
              </div>
              <div class='notification-step-line-up'></div>
              `
  })
  loading.value = true
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
          title: `${selectBuyCoin.baseSymbol}：买入授权中`,
          message: `<div class="display-flex align-items-center">
                    <p class="notification_loader"></p>
                    <span>授权中</span>
                  </div>
                  <div class='notification-step-line-up'></div>
                  `
        })
        const approveResult = await handleEvmApprove(
          mainNetworkCurrency(selectSellCoin.chainCode).approveAddress, // 这里要替换为全局网络的一个对应的配置
          selectSellCoin.baseAddress,
          BigInt(infinityAmount)
        )
        if (!approveResult) {
          notificationFailed({
            title: `${selectBuyCoin.baseSymbol}：授权失败`,
            message: `授权失败`
          })
          loading.value = false
          return false
        }
      }
    }
  }

  notificationInfo({
    title: `${selectBuyCoin.baseSymbol}：买入处理中`,
    message: `<div class="display-flex align-items-center notification-box">
                <span class='notification-txt'>买入</span>
                <span class='up-color'>${numberFormat(props.amount) + ' ' + selectSellCoin.baseSymbol}</span>
                <i></i>
                <span class='notification-txt'>成交市值</span>
                <span class='up-color'>${numberFormat(pairInfo.value.circulationVol)}</span>
              </div>
              <div class='notification-step-line-up'></div>
              `
  })

  const chainId = mainNetworkCurrency(selectSellCoin.chainCode).chainId
  const num = 10 ** Number(selectSellCoin.baseTokenDecimals)
  const spendAmount = new BigNumber(props.amount).times(num).integerValue(BigNumber.ROUND_DOWN)

  const res: any = await APIgetSwap({
    chainId,
    amount: spendAmount,
    fromTokenAddress: resetAddress(selectSellCoin.baseAddress),
    toTokenAddress: resetAddress(selectBuyCoin.baseAddress),
    slippage,
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
      title: `${selectBuyCoin.baseSymbol}：买入成功`,
      message: `${i18n.t('TransactionSuccessful')}`
    })
  } else {
    notificationFailed({
      title: `${selectBuyCoin.baseSymbol}：买入失败`,
      message: `${i18n.t('TransactionFailed')}`
    })
  }
  loading.value = false
}

const handelCustomTradeSwap = async (selectSellCoin: any, selectBuyCoin: any, type: any) => {
  if (selectSellCoin.chainCode !== customWalletInfo.value.chainCode) {
    customMessage({
      type: 'error',
      title: `请选择${selectSellCoin.chainCode}链钱包`
    })
    return
  }
  if (selectSellCoin.balance == 0) {
    customMessage({
      type: 'error',
      title: '余额不足'
    })
    return
  }

  notificationInfo({
    title: `${selectBuyCoin.baseSymbol}：买入处理中`,
    message: `<div class="display-flex align-items-center notification-box">
                <span class='notification-txt'>买入</span>
                <span class='up-color'>${numberFormat(props.amount) + ' ' + selectSellCoin.baseSymbol}</span>
                <i></i>
                <span class='notification-txt'>成交市值</span>
                <span class='up-color'>${numberFormat(pairInfo.value.circulationVol)}</span>
              </div>
              <div class='notification-step-line-up'></div>
              `
  })

  loading.value = true
  const num = 10 ** Number(selectSellCoin.baseTokenDecimals)
  const spendAmount = new BigNumber(props.amount).times(num).integerValue(BigNumber.ROUND_DOWN)

  const res: any = await APIauthTradeSwap({
    amount: spendAmount.toString(10),
    walletId: customWalletInfo.value.walletInfo?.walletId,
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    fromTokenAddress: resetAddress(selectSellCoin.baseAddress),
    toTokenAddress: resetAddress(selectBuyCoin.baseAddress),
    fromTokenDecimals: Number(selectSellCoin.baseTokenDecimals),
    toTokenDecimals: Number(selectBuyCoin.baseTokenDecimals),
    slippage,
    type: '0',
    tradeType: 'F',
    price: pairInfo.value.price,
    profitFlag: parseFloat(localStorage.getItem('increaseSet') || '0') / 100
  })
  if (res) {
    const result =
      selectSellCoin.chainCode == 'SOLANA'
        ? await solanaTransactionReceipt(res.tx, mainNetworkCurrency(selectSellCoin.chainCode).rpc)
        : await evmTransactionReceipt(res.tx, mainNetworkCurrency(selectSellCoin.chainCode).rpc)

    if (result === true) {
      notificationSuccessful({
        title: `${selectBuyCoin.baseSymbol}：买入成功`,
        message: `<div class='display-flex flex-direction-col notification-box'>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>买入</span>
                        <span class='up-color'>${numberFormat(res.fromTokenAmount) + ' ' + selectSellCoin.baseSymbol}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>成交市值</span>
                        <span class='up-color'>${numberFormat(pairInfo.value.circulationVol)}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>获得</span>
                        <span class='up-color'>${numberFormat(res.toTokenAmount) + ' ' + selectBuyCoin.baseSymbol}</span>
                    </div>
                  </div>`
      })
    } else if (result === false) {
      notificationFailed({
        title: `${selectBuyCoin.baseSymbol}：买入失败`,
        message: `${i18n.t('TransactionFailed')}`
      })
    } else {
      notificationWarn({
        title: `${selectBuyCoin.baseSymbol}`,
        message: `${result}`
      })
    }
    loading.value = false
  } else {
    notificationFailed({
      title: `${selectBuyCoin.baseSymbol}：买入失败`,
      message: `${i18n.t('TransactionFailed')}`
    })
    loading.value = false
  }
}

// 网络检测
const networkDetection = () => {
  networkResult.value =
    mainNetworkCurrency(coinInfo.value.sellCoin.chainCode).chainId == chainId.value
  if (!networkResult.value) {
    handelSwitchNetwork(walletType.value, coinInfo.value.sellCoin)
    return false
  }
  return true
}
</script>

<style scoped lang="scss">
.operate-btn {
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 6px 12px;
  border-radius: 8px;
  background: #1e1e1e;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  span {
    white-space: nowrap;
  }
  .icon-buy-cur,
  .icon-buy {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
  .txt {
    color: var(--font-color-default);
  }
}
</style>
