<template>
  <div class="trade-btn-box">
    <span @click.stop="handelBuy('0.1')">0.1 SOL</span>
    <span @click.stop="handelBuy('0.5')">0.5 SOL</span>
    <span @click.stop="handelBuy('1')">1 SOL</span>
    <span @click.stop="handelBuy(amount)">{{
      amount ? numberFormat(amount || 0) + ' SOL' : '右上角输入'
    }}</span>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { handleCoinPairInfo, mainNetworkCurrency, numberFormat } from '@/utils'
import { useGlobalStore } from '@/stores/global'
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
  evmTransactionReceipt
} from '@/utils/transition'
import {
  notificationInfo,
  notificationSuccessful,
  notificationFailed,
  notificationWarn
} from '@/utils/notification'
import { APIgetSwap, APIauthTradeSwap } from '@/api/coinWalletDetails'

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
    tvl: props.info.tvl || 0,
    circulationVol: props.info.marketCap || 0,
    price: props.info.price || 0
  }
})

const updateTradingInfo = () => {
  const res: any = props.tokenList
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

const handelBuy = async (amount: string) => {
  if (!parseFloat(amount)) {
    showToast('请输入买入数量')
    return false
  }

  if (walletType.value !== 'Email') {
    if (!networkDetection()) {
      return false
    }
  }
  await updateTradingInfo()

  if (walletType.value == 'Email') {
    handelCustomTradeSwap(coinInfo.value.buyCoin, coinInfo.value.sellCoin, 'buy', amount)
  } else {
    handleTrade(coinInfo.value.buyCoin, coinInfo.value.sellCoin, 'buy', amount)
  }
}

const handleTrade = async (selectSellCoin: any, selectBuyCoin: any, type: any, amount: string) => {
  if (selectSellCoin.balance == 0) {
    showToast('余额不足')
    return
  }
  notificationInfo({
    title: `${selectBuyCoin.baseSymbol}：买入处理中`,
    customClass: 'notification-h5',
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
          customClass: 'notification-h5',
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
            customClass: 'notification-h5',
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
    customClass: 'notification-h5',
    message: `<div class="display-flex align-items-center notification-box">
                <span class='notification-txt'>买入</span>
                <span class='up-color'>${numberFormat(amount) + ' ' + selectSellCoin.baseSymbol}</span>
                <i></i>
                <span class='notification-txt'>成交市值</span>
                <span class='up-color'>${numberFormat(pairInfo.value.circulationVol)}</span>
              </div>
              <div class='notification-step-line-up'></div>
              `
  })

  const chainId = mainNetworkCurrency(selectSellCoin.chainCode).chainId
  const num = 10 ** Number(selectSellCoin.baseTokenDecimals)
  const spendAmount = new BigNumber(amount).times(num).integerValue(BigNumber.ROUND_DOWN)

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
      customClass: 'notification-h5',
      message: `${i18n.t('TransactionSuccessful')}`
    })
  } else {
    notificationFailed({
      title: `${selectBuyCoin.baseSymbol}：买入失败`,
      customClass: 'notification-h5',
      message: `${i18n.t('TransactionFailed')}`
    })
  }
  loading.value = false
}

const handelCustomTradeSwap = async (
  selectSellCoin: any,
  selectBuyCoin: any,
  type: any,
  amount: string
) => {
  if (selectSellCoin.chainCode !== customWalletInfo.value.chainCode) {
    showToast(`请选择${selectSellCoin.chainCode}链钱包`)
    return
  }
  if (selectSellCoin.balance == 0) {
    showToast('余额不足')
    return
  }

  notificationInfo({
    title: `${selectBuyCoin.baseSymbol}：买入处理中`,
    customClass: 'notification-h5',
    message: `<div class="display-flex align-items-center notification-box">
                <span class='notification-txt'>买入</span>
                <span class='up-color'>${numberFormat(amount) + ' ' + selectSellCoin.baseSymbol}</span>
                <i></i>
                <span class='notification-txt'>成交市值</span>
                <span class='up-color'>${numberFormat(pairInfo.value.circulationVol)}</span>
              </div>
              <div class='notification-step-line-up'></div>
              `
  })

  loading.value = true
  const num = 10 ** Number(selectSellCoin.baseTokenDecimals)
  const spendAmount = new BigNumber(amount).times(num).integerValue(BigNumber.ROUND_DOWN)

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
        customClass: 'notification-h5',
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
        customClass: 'notification-h5',
        message: `${i18n.t('TransactionFailed')}`
      })
    } else {
      notificationWarn({
        title: `${selectBuyCoin.baseSymbol}`,
        customClass: 'notification-h5',
        message: `${result}`
      })
    }
    loading.value = false
  } else {
    notificationFailed({
      title: `${selectBuyCoin.baseSymbol}：买入失败`,
      customClass: 'notification-h5',
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
.trade-btn-box {
  display: grid;
  gap: 0.24rem;
  grid-template-columns: repeat(4, 1fr);
  span {
    background-color: var(--up-color);
    color: #fff;
    font-size: 0.2933rem;
    height: 0.6rem;
    text-align: center;
    line-height: 0.6rem;
    border-radius: 0.4rem;
    cursor: pointer;
  }
}
</style>
