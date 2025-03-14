<template>
  <section class="quick-trade">
    <div class="display-flex align-items-center justify-content-sp">
      <div class="display-flex align-items-center">
        <span>快捷交易</span>
        <svg-icon name="h5-settings-01" class="settings-01" @click="settingType = true"></svg-icon>
      </div>
      <el-icon color="#f5f5f5" :size="16" class="close" @click="handelClose"><Close /></el-icon>
    </div>
    <div v-if="settingType">
      <div class="setting-content">
        <p class="p-txt display-flex align-items-center justify-content-sp">
          <span>买入</span>
          <span
            >余额：{{ buyInfo.balance == 0 ? '0.0' : numberFormat(balanceFormat(buyInfo)) }}
            {{ buyInfo.baseSymbol }}</span
          >
        </p>
        <div class="form-input">
          <el-input
            v-model="buy1"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
          <el-input
            v-model="buy2"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
          <el-input
            v-model="buy3"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
          <el-input
            v-model="buy4"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
          <el-input
            v-model="buy5"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </div>
        <p class="p-txt display-flex align-items-center justify-content-sp">
          <span>卖出</span>
          <span
            >余额：{{ sellInfo.balance == 0 ? '0.0' : numberFormat(balanceFormat(sellInfo)) }}
            {{ sellInfo.baseSymbol }}</span
          >
        </p>
        <div class="form-input">
          <el-input
            v-model="sell1"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
          <el-input
            v-model="sell2"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
          <el-input
            v-model="sell3"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
          <el-input
            v-model="sell4"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
          <el-input
            v-model="sell5"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </div>
        <div class="btn-sure" @click="handelSure">确定</div>
      </div>
    </div>
    <template v-else>
      <WalletConnect v-if="!isConnected">
        <div class="buy-sell-content">
          <p class="p-txt display-flex align-items-center justify-content-sp">
            <span>买入</span>
            <span
              >余额：{{ buyInfo.balance == 0 ? '0.0' : numberFormat(balanceFormat(buyInfo)) }}
              {{ buyInfo.baseSymbol }}</span
            >
          </p>
          <div class="buy-btn buy-sell-btn">
            <span v-for="(item, index) in config.buyAmount" :key="index">{{ item }}</span>
          </div>
          <p class="p-txt display-flex align-items-center justify-content-sp">
            <span>卖出</span>
            <span
              >余额：{{ sellInfo.balance == 0 ? '0.0' : numberFormat(balanceFormat(sellInfo)) }}
              {{ sellInfo.baseSymbol }}</span
            >
          </p>
          <div class="sell-btn buy-sell-btn">
            <span v-for="(item, index) in config.sellAmount" :key="index">{{ item }}%</span>
          </div>
          <div class="one-click-recovery">回本</div>
        </div>
      </WalletConnect>
      <template v-else>
        <div class="buy-sell-content">
          <p class="p-txt display-flex align-items-center justify-content-sp">
            <span>买入</span>
            <span
              >余额：{{ buyInfo.balance == 0 ? '0.0' : numberFormat(balanceFormat(buyInfo)) }}
              {{ buyInfo.baseSymbol }}</span
            >
          </p>
          <div class="buy-btn buy-sell-btn">
            <span v-for="(item, index) in config.buyAmount" :key="index" @click="handelBuy(item)">{{
              item
            }}</span>
          </div>
          <p class="p-txt display-flex align-items-center justify-content-sp">
            <span>卖出</span>
            <span
              >余额：{{ sellInfo.balance == 0 ? '0.0' : numberFormat(balanceFormat(sellInfo)) }}
              {{ sellInfo.baseSymbol }}</span
            >
          </p>
          <div class="sell-btn buy-sell-btn">
            <span v-for="(item, index) in config.sellAmount" :key="index" @click="handelSell(item)"
              >{{ item }}%</span
            >
          </div>
          <div
            class="one-click-recovery"
            @click="handelRecovery"
            v-if="walletType.value == 'Email'"
          >
            回本
          </div>
        </div>
      </template>
    </template>
  </section>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { useChainConfigsStore } from '@/stores/chainConfigs'
import { useGlobalStore } from '@/stores/global'
import { mainNetworkCurrency, numberFormat, isAllSpaces } from '@/utils'
import {
  balanceFormat,
  resetAddress,
  handleEvmAllowance,
  sendEvmTransaction,
  sendSolanaTransaction,
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
import { useI18n } from 'vue-i18n'
import { APIgetSwap, APIauthTradeSwap, APIauthRecoverTradeCost } from '@/api/coinWalletDetails'
import { infinityAmount } from '@/types'
import BigNumber from 'bignumber.js'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import { customMessage } from '@/utils/message'

const i18n = useI18n()

const globalStore = useGlobalStore()
const chainConfigs = useChainConfigsStore().chainConfigs

const address = computed(() => globalStore.walletInfo.address)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const chainId = computed(() => globalStore.walletInfo.chainId)
const walletType = computed(() => globalStore.walletInfo.walletType)
const customWalletInfo = computed(() => globalStore.customWalletInfo)

const emit = defineEmits(['circulation', 'close'])

const props = defineProps({
  config: {
    type: Object,
    default: () => {
      return {}
    }
  },
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
  },
  positions: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const buy1 = ref(props.config.buyAmount[0])
const buy2 = ref(props.config.buyAmount[1])
const buy3 = ref(props.config.buyAmount[2])
const buy4 = ref(props.config.buyAmount[3])
const buy5 = ref(props.config.buyAmount[4])

const sell1 = ref(props.config.sellAmount[0])
const sell2 = ref(props.config.sellAmount[1])
const sell3 = ref(props.config.sellAmount[2])
const sell4 = ref(props.config.sellAmount[3])
const sell5 = ref(props.config.sellAmount[4])

const buyInfo = computed(() => {
  return {
    ...props.coinInfo.buyCoin
  }
})

const sellInfo = computed(() => {
  return {
    ...props.coinInfo.sellCoin
  }
})
const settingType = ref<boolean>(false) // 设置
const networkResult = ref<boolean>(true) // 网络对比结果
const tradeTimer = ref<any>(null) // 代币余额定时器
const buyIndex = ref<number>(0)
const sellIndex = ref<number>(0)

const account: any = localStorage.getItem('accountInfo')
const slippage = ref<any>(account ? JSON.parse(account).slippage : '0.03') // 滑点

const mainNetworkCurrencyAmount = ref<any>(0)
const mainNetworkCurrencyPrice = ref<number>(0)
const updateTradingInfo = async () => {
  networkResult.value = mainNetworkCurrency(sellInfo.value.chainCode)?.chainId == chainId.value

  const res: any = await getTokenList(
    walletType.value == 'Email'
      ? customWalletInfo.value.chainCode
      : chainConfigs?.find((item: { chainId: any }) => item.chainId == chainId.value)?.chainCode,
    customWalletInfo.value.walletInfo?.wallet
  )
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
  buyIndex.value = item
  if (walletType.value == 'Email') {
    await handelCustomTradeSwap(buyInfo.value, sellInfo.value, 'buy')
  } else {
    await handleTrade(buyInfo.value, sellInfo.value, 'buy')
  }
}

const handelSell = async (item: any) => {
  sellIndex.value = item
  if (walletType.value == 'Email') {
    await handelCustomTradeSwap(sellInfo.value, buyInfo.value, 'sell')
  } else {
    await handleTrade(sellInfo.value, buyInfo.value, 'sell')
  }
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
                <span class=${type == 'buy' ? 'up-color' : 'down-color'}>${type == 'buy' ? numberFormat(buyIndex.value) + ' ' + buyInfo.value.baseSymbol : numberFormat(balanceFormat(sellInfo.value) * sellIndex.value) + ' ' + sellInfo.value.baseSymbol}</span>
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
    spendAmount = new BigNumber(buyIndex.value).times(num).integerValue(BigNumber.ROUND_DOWN)
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
    updateTradingInfo()
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
                <span class=${type == 'buy' ? 'up-color' : 'down-color'}>${type == 'buy' ? numberFormat(buyIndex.value) + ' ' + buyInfo.value.baseSymbol : numberFormat(balanceFormat(sellInfo.value) * sellIndex.value) + ' ' + sellInfo.value.baseSymbol}</span>
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
    spendAmount = new BigNumber(buyIndex.value).times(num).integerValue(BigNumber.ROUND_DOWN)
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

const handelRecovery = async () => {
  const find = props.positions?.find((item: any) => item.tokenAddress == sellInfo.value.baseAddress)
  if (!find) {
    customMessage({
      type: 'error',
      title: '买入代币数量：0，无法一键回本'
    })
    return false
  }
  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：正在发起一键回本`,
    message: `<div class="display-flex align-items-center">
                  <p class="notification_loader"></p>
                  <span>正在发起</span>
                </div>
                <div class='notification-step-line-up'></div>
                `
  })

  const params = {
    chain: customWalletInfo.value.walletInfo?.chainCode,
    walletId: customWalletInfo.value.walletInfo?.walletId,
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    walletAddress: customWalletInfo.value.walletInfo?.wallet,
    price: props.pairInfo.price,
    address: sellInfo.value.baseAddress,
    decimals: sellInfo.value.baseTokenDecimals
  }
  const res = await APIauthRecoverTradeCost({ ...params })

  if (res) {
    notificationSuccessful({
      title: `${sellInfo.value.baseSymbol}：一键回本`,
      message: `${i18n.t('TransactionSuccessful')}`
    })
  } else {
    notificationFailed({
      title: `${sellInfo.value.baseSymbol}：一键回本`,
      message: `${i18n.t('TransactionFailed')}`
    })
  }
}

const handelSure = () => {
  if (
    isAllSpaces(buy1.value) ||
    isAllSpaces(buy2.value) ||
    isAllSpaces(buy3.value) ||
    isAllSpaces(buy4.value) ||
    isAllSpaces(buy5.value) ||
    buy1.value == 0 ||
    buy2.value == 0 ||
    buy3.value == 0 ||
    buy4.value == 0 ||
    buy5.value == 0
  ) {
    return customMessage({
      type: 'error',
      title: '请正确配置买入数值'
    })
  }
  if (
    isAllSpaces(sell1.value) ||
    isAllSpaces(sell2.value) ||
    isAllSpaces(sell3.value) ||
    isAllSpaces(sell4.value) ||
    isAllSpaces(sell5.value) ||
    sell1.value == 0 ||
    sell2.value == 0 ||
    sell3.value == 0 ||
    sell4.value == 0 ||
    sell5.value == 0
  ) {
    return customMessage({
      type: 'error',
      title: '请正确配置卖出比例'
    })
  }

  emit('circulation', {
    buyAmount: [buy1.value, buy2.value, buy3.value, buy4.value, buy5.value],
    sellAmount: [sell1.value, sell2.value, sell3.value, sell4.value, sell5.value]
  })

  settingType.value = false
}

const handelClose = () => {
  emit('close', false)
}

// 监听连接钱包的变化
watch(isConnected, (newValue) => {
  if (newValue) {
    updateTradingInfo()
  }
})

// 监听地址和链ID变化
watch([address, chainId], () => {
  updateTradingInfo()
})

watch(customWalletInfo, () => {
  updateTradingInfo()
})

onMounted(() => {
  isConnected.value && updateTradingInfo()
  tradeTimer.value = setInterval(() => {
    isConnected.value && updateTradingInfo()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(tradeTimer.value)
})
</script>

<style scoped lang="scss">
.quick-trade {
  box-shadow: -1px 3px 24px #0006;
  width: 280px;
  border-radius: 8px;
  background-color: #171717;
  padding: 12px;
  font-size: 14px;
  font-family: 'PingFangSC-Medium';
  color: #f5f5f5;
  cursor: move;
  .settings-01 {
    width: 15px;
    height: 15px;
    margin-left: 5px;
    cursor: pointer;
  }
  .p-txt {
    font-size: 12px;
    margin: 10px 0;
  }
  .buy-sell-btn {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    font-size: 12px;
    cursor: pointer;
    span {
      line-height: 22px;
      text-align: center;
      border-radius: 6px;
      padding: 0 4px;
      white-space: nowrap;
    }
  }
  .buy-btn span {
    border: 1px solid var(--up-color);
    color: var(--up-color);
  }
  .sell-btn span {
    border: 1px solid var(--down-color);
    color: var(--down-color);
  }
  :deep(.connect-wallet-btn) {
    display: block;
    background-color: transparent;
    color: #f5f5f5;
    padding: 0;
  }
  .form-input {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
  }
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #26282c !important;

    .el-input__inner {
      text-align: center;
    }
  }
  .btn-sure {
    border-radius: 4px;
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    margin-top: 12px;
    background: #393c43;
  }
  .close {
    cursor: pointer;
  }
  .one-click-recovery {
    text-align: center;
    border-radius: 6px;
    padding: 4px;
    border: 1px solid #26282c;
    margin-top: 12px;
    color: #5c6068;
    cursor: pointer;
    font-size: 12px;
  }
}
</style>
