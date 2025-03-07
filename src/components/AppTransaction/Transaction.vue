<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <section class="transaction">
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
              <img
                :src="chainLogoObj[sellingcoinInfo.chainCode]"
                alt=""
                v-if="sellingcoinInfo.logo"
                class="chainCode"
              />
            </div>
            <div class="display-flex flex-direction-col">
              <div class="display-flex align-items-center">
                <span>{{
                  MAIN_COIN[sellingcoinInfo.baseTokenSymbol] || sellingcoinInfo.baseTokenSymbol
                }}</span>
                <svg-icon name="chevron-down" class="icon-svg"></svg-icon>
              </div>
              <span class="transaction-coin-name">{{ sellingcoinInfo.chainCodeName }}</span>
            </div>
          </div>
          <div class="display-flex flex-direction-col align-items-fd">
            <van-field
              v-model="sellingVal"
              autocomplete="off"
              type="number"
              placeholder="0.0"
              @input="handelSellingInput"
            />
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
              <img
                :src="chainLogoObj[buycoinInfo.chainCode]"
                alt=""
                v-if="sellingcoinInfo.logo"
                class="chainCode"
              />
            </div>
            <div class="display-flex flex-direction-col">
              <div class="display-flex align-items-center">
                <span>{{
                  MAIN_COIN[buycoinInfo.baseTokenSymbol] || buycoinInfo.baseTokenSymbol
                }}</span>
                <svg-icon name="chevron-down" class="icon-svg"></svg-icon>
              </div>
              <span class="transaction-coin-name">{{ buycoinInfo.chainCodeName }}</span>
            </div>
          </div>
          <van-skeleton
            :loading="balanceInquiryLoading"
            style="width: 100%; justify-content: flex-end; padding: 0"
          >
            <template #template>
              <van-skeleton-paragraph style="width: 40%" />
            </template>
            <template #default>
              <div class="display-flex flex-direction-col align-items-fd">
                <van-field
                  v-model="buyVal"
                  autocomplete="off"
                  type="number"
                  placeholder="0.0"
                  @input="handelBuyInput"
                />
              </div>
            </template>
          </van-skeleton>
        </div>
      </div>
      <div :class="balanceInquiryLoading ? 'arrow-box arrow-box-animation' : 'arrow-box'">
        <svg-icon name="arrow-down" class="arrow-down" @click="handelSwitchCoin"></svg-icon>
      </div>
    </div>
    <div class="slider-main">
      <el-slider
        v-model="positionVal"
        :marks="marks"
        :show-tooltip="false"
        @input="handelpPositionSlider"
      />
    </div>
    <div class="slider-info">
      <div class="display-flex align-items-center justify-content-sp slider-info-item">
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
    </div>
    <div class="btn-main">
      <H5WalletConnect v-if="!isConnected" />
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
        type="primary"
        v-if="isConnected && !networkResult"
        class="transaction-btn"
        @click="handelSwitchNetwork(walletType, sellingcoinInfo)"
      >
        {{ i18n.t('PleaseSwitchChains') }}
      </el-button>
    </div>
    <van-popup v-model:show="showBottom" round position="bottom">
      <section class="transaction-popup">
        <div class="transaction-popup-box">
          <van-field
            v-model="query"
            left-icon="search"
            autocomplete="off"
            :placeholder="i18n.t('enterTokenNameContract')"
            clearable
            @update:model-value="handelInput"
          />
        </div>
        <div class="transaction-popup-list">
          <CoinItem :list="list" @handelItemClick="handelItem" />
        </div>
      </section>
    </van-popup>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import { APISearchToken, APIgetTokensByWalletAddress } from '@/api'
import { APIgetSwap, APIinitTokenData } from '@/api/coinWalletDetails'
import {
  mainNetworkCurrency,
  debounce,
  isAllSpaces,
  numberFormat,
  handleCoinPairInfo
} from '@/utils'
import { showLoadingToast, closeToast, showToast } from 'vant'
import BigNumber from 'bignumber.js'
import CoinItem from '@/adapter/components/H5CoinItem.vue'
import H5WalletConnect from '@/components/Wallet/H5WalletConnect.vue'

import { infinityAmount, MAIN_COIN } from '@/types'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'

import { decimalsFormat } from '@/utils/transition'

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

import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'

import { useBaseInfo } from '@/hooks/useBaseInfo' // 头部 代币信息 hook
import { customMessage } from '@/utils/message'

const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore
const i18n = useI18n()
const route = useRoute()
const router = useRouter()

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

/** ---- 交易逻辑 ---- start */
const address = computed(() => globalStore.walletInfo.address)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const chainId = computed(() => globalStore.walletInfo.chainId)
const walletType = computed(() => globalStore.walletInfo.walletType)

const useChainInfo = useChainInfoStore()
//获取token数据
const useTokenInfo = useTokenInfoStore()

const chain = useChainConfigsStore()

const chainConfigs = computed(() => chain.chainConfigs)

const sellingVal = ref<string>('') // 卖出 数
const buyVal = ref<string>('') // 买入 数
const sellingBuy = ref<string>('') // 判断点击的是卖出还是买入
const positionVal = ref<number>(0) // c仓位
const account: any = localStorage.getItem('accountInfo')

const slippageVal = ref<any>(account ? (JSON.parse(account).slippage * 100).toString() : '3') // 滑点

const balanceInquiryLoading = ref<boolean>(false) // 币余额查询 loading
const tradeLoading = ref<boolean>(false)
const networkResult = ref<boolean>(true) // 网络对比结果
const timer = ref<any>(null) // 定时器
const gasPrice = ref<any>(0) // Gas费
const sellingcoinInfo = ref<any>({
  baseAddress: '',
  baseTokenSymbol: i18n.t('PleaseSelect'),
  chainCode: '',
  chainCodeName: '',
  logo: '',
  balance: 0,
  baseTokenDecimals: ''
}) // 选中的 卖出 币信息
const buycoinInfo = ref<any>({
  baseAddress: '',
  baseTokenSymbol: i18n.t('PleaseSelect'),
  chainCode: '',
  chainCodeName: '',
  logo: '',
  balance: 0,
  baseTokenDecimals: ''
}) // 选中的 买入 币信息

const okCoin = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const sol = 'So11111111111111111111111111111111111111112'

useChainInfo.createChainInfo({
  chainCode: route.query.chainCode, // 币ID
  pairAddress: route.params.pairAddress, // 币 pairAddress
  timeType: route.query.timeType // 时间类型
})

const baseInfo = ref<any>({
  tradingLoading: true
})

// 初始化
const initTokenData = async () => {
  const chainInfo = useChainInfo.chainInfo
  const res = await APIinitTokenData({
    pairAddress: chainInfo?.pairAddress,
    chainCode: chainInfo?.chainCode
  })
  useTokenInfo.createTokenInfo(res)
  baseInfo.value = await useBaseInfo()
  const coinInfo = handleCoinPairInfo({
    ...baseInfo.value.tokenInfo,
    chainCode: baseInfo.value.chainInfo?.chainCode
  })
  sellingcoinInfo.value = {
    baseAddress: coinInfo.buyCoin.baseAddress,
    baseTokenSymbol: coinInfo.buyCoin.baseSymbol,
    chainCode: coinInfo.buyCoin.chainCode,
    chainCodeName: mainNetworkCurrency(coinInfo.buyCoin.chainCode)?.chain,
    logo: baseInfo.value.tokenInfo?.quoteLogo,
    balance: coinInfo.buyCoin.balance,
    baseTokenDecimals: coinInfo.buyCoin.baseTokenDecimals
  }

  buycoinInfo.value = {
    baseAddress: coinInfo.sellCoin.baseAddress,
    baseTokenSymbol: coinInfo.sellCoin.baseSymbol,
    chainCode: coinInfo.sellCoin.chainCode,
    chainCodeName: mainNetworkCurrency(coinInfo.sellCoin.chainCode)?.chain,
    logo: coinInfo.sellCoin.logo,
    balance: coinInfo.sellCoin.balance,
    baseTokenDecimals: coinInfo.sellCoin.baseTokenDecimals
  }
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

const handelSearch = async (type: string) => {
  // 卖出/买入
  showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: i18n.t('h5.loading')
  })
  sellingBuy.value = type
  isConnected.value &&
    (await getTokensByWalletAddr({
      walletAddress: address.value,
      chainCode: chainConfigs.value?.find((item: { chainId: any }) => item.chainId == chainId.value)
        .chainCode
    }))
  closeToast()
  showBottom.value = true
}

const handelSwitchCoin = () => {
  ;[sellingcoinInfo.value, buycoinInfo.value] = [buycoinInfo.value, sellingcoinInfo.value]
}

const updateWalletInfo = async () => {
  // 判断 当前卖出币 chainid 是否和钱包的 chainid 是否一致
  if (sellingcoinInfo.value.chainCode) {
    networkResult.value =
      mainNetworkCurrency(sellingcoinInfo.value.chainCode).chainId == chainId.value
    if (!networkResult.value) {
      return
    }
  }
  if (sellingcoinInfo.value.baseAddress) {
    sellingcoinInfo.value.balance = await getBalance(
      sellingcoinInfo.value.baseAddress,
      sellingcoinInfo.value.chainCode
    )
  }
  if (buycoinInfo.value.baseAddress) {
    buycoinInfo.value.balance = await getBalance(
      buycoinInfo.value.baseAddress,
      buycoinInfo.value.chainCode
    )
  }
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

const handelItem = async (val: any) => {
  console.log('select coin:', val)
  sellingVal.value = ''
  buyVal.value = ''
  // 搜索卖出/买入 合约币 列表 选中信息
  if (sellingBuy.value == 'buy') {
    buycoinInfo.value = val
    buycoinInfo.value.balance = await getBalance(
      buycoinInfo.value.baseAddress,
      buycoinInfo.value.chainCode
    )
  } else if (sellingBuy.value == 'selling') {
    sellingcoinInfo.value = val
    let sellAddr = okCoin
    if (sellingcoinInfo.value.baseAddress != '' && sellingcoinInfo.value.baseAddress != okCoin) {
      sellAddr = sellingcoinInfo.value.baseAddress
    }
    if (!sellAddr) {
      sellAddr = ''
    }
    sellingcoinInfo.value.balance = await getBalance(sellAddr, sellingcoinInfo.value.chainCode)
  }
  showBottom.value = false
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

// 买入
const handleTrade = async () => {
  tradeLoading.value = true
  if (parseFloat(sellingVal.value || '0') == 0) {
    tradeLoading.value = false
    showToast('请输入数量')
    return
  }

  if (sellingcoinInfo.value.balance == 0) {
    tradeLoading.value = false
    showToast('余额不足')
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
          showToast('代币授权失败')
          return false
        }
      }
    }
  }

  const chainId = mainNetworkCurrency(sellingcoinInfo.value.chainCode).chainId

  const num = 10 ** Number(sellingcoinInfo.value.baseTokenDecimals)
  const spendAmount = new BigNumber(sellingVal.value).times(num).integerValue(BigNumber.ROUND_DOWN)

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

/** ---- 币列表弹框 逻辑 ---- start */

const showBottom = ref<boolean>(false)
const query = ref<string>('')
const list = ref<any>([])

async function getSearchList() {
  const res: any = await APISearchToken({
    query: query.value,
    chainCode: sellingBuy.value == 'buy' ? sellingcoinInfo.value.chainCode : ''
  })
  list.value =
    res?.map((item: any) => {
      const isCurrency = chainConfigs.value?.some(
        (itm: { symbol: any }) => itm.symbol == item.baseToken
      )
      return {
        logo: isCurrency
          ? chainConfigs.value?.find((itm: { symbol: any }) => itm.symbol == item.baseToken)?.logo
          : item.logo,
        chainCode: item.chainCode,
        baseTokenDecimals: item.baseTokenDecimals,
        baseAddress: isCurrency ? '' : item.baseAddress,
        baseTokenSymbol: item.baseToken || '-',
        quoteTokenSymbol: item.quoteToken || '-',
        pairAddress: item.pairAddress,
        tradeTvl: item.volume,
        tvl: decimalsFormat(item.tvl, item.baseTokenDecimals),
        price: item.price,
        chg: item.chg1d,
        chainCodeName: mainNetworkCurrency(item.chainCode)?.chain
      }
    }) || []
  closeToast()
}

const getTokensByWalletAddr = async (params: any) => {
  const res: any = await APIgetTokensByWalletAddress(params)
  closeToast()
  list.value = res.map((item: any) => {
    const isCurrency = chainConfigs.value?.some((itm: { symbol: any }) => itm.symbol == item.symbol)
    return {
      logo: isCurrency
        ? chainConfigs.value?.find((itm: { symbol: any }) => itm.symbol == item.symbol)?.logo
        : item.logo,
      chainCode: item.chainCode,
      baseTokenDecimals: item.decimals,
      baseAddress: isCurrency ? '' : item.address,
      baseTokenSymbol: item.symbol || '-',
      quoteTokenSymbol: item.chainCode || '-',
      pairAddress: '',
      tradeTvl: item.totalAmount,
      tvl: decimalsFormat(item.amount, item.decimals),
      price: item.price,
      chg: 0,
      chainCodeName: mainNetworkCurrency(item.chainCode)?.chain
    }
  })
}

const handelInput = () => {
  if (isAllSpaces(query.value)) {
    return false
  }
  debounce(() => {
    showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: i18n.t('h5.loading')
    })
    getSearchList()
  }, 300)
}

/** ---- 币列表弹框 逻辑 ---- end */

// 监听连接钱包的变化
watch(isConnected, (newValue) => {
  if (newValue) {
    updateWalletInfo()
    // onSignMessage()
    customMessage({
      type: 'success',
      title: '钱包连接成功'
    })
  } else {
    customMessage({
      type: 'error',
      title: '钱包断开连接'
    })
  }
})

// 监听地址和链ID变化
watch([address, chainId], () => {
  updateWalletInfo()
  if (isConnected.value) {
    customMessage({
      type: 'success',
      title: '钱包详细信息已更新'
    })
  }
})

onMounted(async () => {
  await initTokenData()
  isConnected.value && updateWalletInfo()
  if (sellingcoinInfo.value.chainCode && sellingcoinInfo.value.chainCode != 'SOLANA') {
    gasPrice.value = await getEvmGasPrice()
    timer.value = setInterval(async () => {
      gasPrice.value = await getEvmGasPrice()
    }, 5000)
  }
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.transaction {
  font-size: 0.32rem;
  .transaction-coin {
    position: relative;
    .transaction-coin-item {
      padding: 0.32rem 0.32rem 0.4267rem;
      border-radius: 0.2133rem;
      background: #f9f9f9;
      font-size: 0.4267rem;
      color: #a5a5a5;
      line-height: 1.2;
      .transaction-coin-item-p {
        font-size: 0.32rem;
      }
      .transaction-coin-name {
        font-size: 0.32rem;
        color: #a5a5a5;
      }
      .icon-svg {
        width: 0.4267rem;
        height: 0.4267rem;
        margin-left: 0.0267rem;
      }
    }
    .transaction-coin-item:first-child {
      margin-bottom: 0.2133rem;
    }
    .search-chain span {
      white-space: nowrap;
    }
    .transaction-input {
      font-size: 0.4267rem;
      color: #434343;
      margin-top: 0.2133rem;
      .transaction-input-span {
        font-size: 0.32rem;
        color: #a5a5a5;
      }
      :deep(.van-field) {
        box-shadow: none;
        background-color: #f9f9f9;
      }
      :deep(.van-field__control) {
        text-align: right;
        color: #434343;
        font-size: 0.4267rem;
      }
      .logo {
        position: relative;
        margin-right: 0.2133rem;
      }
      .logo,
      .logo-img {
        width: 1.0667rem;
        height: 1.0667rem;
        border-radius: 50%;
      }
      .chainCode {
        width: 0.4267rem;
        height: 0.4267rem;
        position: absolute;
        right: 0px;
        bottom: 0px;
      }
    }
    .arrow-box {
      width: 0.7467rem;
      height: 0.7467rem;
      position: absolute;
      top: 50%;
      left: 45%;
      margin-right: -0.7467rem;
      margin-top: -0.3733rem;
      z-index: 2;
    }
    .arrow-down {
      width: 0.7467rem;
      height: 0.7467rem;
      padding: 0.1067rem;
      border-radius: 50%;
      color: #828282;
      background: #fff;
    }
    .arrow-box:before {
      content: '';
      animation: arrowanimation 0.7s linear;
      animation-iteration-count: infinite;
      border-radius: 50%;
      background-image: linear-gradient(180deg, transparent 84%, #5e6773);
      width: 0.7733rem;
      height: 0.7733rem;
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
  .slider-info {
    margin-top: 0.8533rem;
    padding: 0.4267rem 0.2133rem;
    border-radius: 0.2133rem;
    border: 1px solid #f2f2f2;
  }

  .slider-info-item {
    margin-bottom: 0.2133rem;
    color: #828282;
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 0.0267rem #e5e5e5 !important;
    }
  }
  .slider-info-item :last-child {
    margin-bottom: 0;
    color: #434343;
  }
  .wallet-icon {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
  .btn-main {
    margin-top: 0.4267rem;
    :deep(.transaction-btn) {
      width: 100%;
      height: 1.0667rem;
      font-size: 0.3733rem;
    }
    :deep(.email-wallet) {
      display: none;
    }
  }
  .slider-main {
    margin: 0.4267rem 0 0.8533rem;
    :deep(.el-slider) {
      padding: 0 0.3333rem;
      .el-slider__runway {
        background-color: #e5e5e5;
      }
      .el-slider__button {
        width: 0.32rem;
        height: 0.32rem;
      }
    }
    :deep(.el-slider__marks-text) {
      font-size: 0.2667rem;
      color: #1f2a37;
    }
    :deep(.el-slider__stop:first-child),
    :deep(.el-slider__stop:last-child) {
      display: none;
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
  @keyframes arrowanimation {
    to {
      transform: rotate(1turn);
    }
  }
}
.transaction-popup {
  overflow: hidden;
}
.transaction-popup-box {
  padding: 0.32rem;
  :deep(.van-field) {
    border-radius: 0.2133rem;
    background: #f5f5f5;
  }
}
.transaction-popup-list {
  height: calc(60vh - 1.0667rem);
  overflow-y: scroll;
  .tabs-content {
    padding-right: calc(0.4267rem - 5px);
  }
}
</style>
