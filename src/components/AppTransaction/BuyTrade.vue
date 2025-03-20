<template>
  <div class="buy-sell-operate">
    <div class="buy-sell-tab">
      <el-select
        v-model="tabIndex"
        effect="dark"
        :teleported="false"
        size="small"
        style="width: 100%"
      >
        <el-option
          v-for="item in tabList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <template v-if="tabIndex == 1">
      <div class="buy-sell-trade">
        <span
          v-for="(item, index) in buyPosition"
          :key="index"
          :class="buyIndex === item.value ? 'active' : ''"
          @click="handelBuy(item)"
          >{{ item.label }} {{ buyInfo.baseSymbol }}</span
        >
        <el-input
          v-model="coinAmount"
          :class="inputFocusType ? 'input-focus' : ''"
          size="small"
          oninput="value=value.replace(/[^0-9.]/g,'')"
          style="width: 100%"
          placeholder="请输入"
          @focus="handeCoinFocus"
          @blur="handelCoinBlur"
        >
          <template #suffix>{{ buyInfo.baseSymbol }}</template>
        </el-input>
      </div>
    </template>
    <template v-else-if="tabIndex == 2">
      <div class="buy-sell-limit">
        <div class="market-price-btn margin-bottom-12">市价</div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="amount"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="数量"
            @input="handelMarketAmountInput"
          >
            <template #suffix>
              <span class="suffix-txt">{{ buyInfo.baseSymbol }}</span>
            </template>
          </el-input>
        </div>
        <div class="form-item-slider">
          <el-slider
            v-model="positionMarketVal"
            @input="handelPositionMarketInput"
            :marks="marks"
            :show-tooltip="false"
          />
        </div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="marketExchangeAmount"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="预估兑换"
            @input="handelMarketExchangeAmountInput"
          >
            <template #suffix>
              <span class="suffix-txt">{{
                MAIN_COIN[sellInfo.baseSymbol] || sellInfo.baseSymbol
              }}</span>
            </template>
          </el-input>
        </div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="marketPrice"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="金额"
            @input="handelMarketPriceInput"
          >
            <template #suffix>
              <span class="suffix-txt">USDT</span>
            </template>
          </el-input>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="buy-sell-limit">
        <div class="form-item margin-bottom-12">
          <el-select
            v-model="entrustmentOptions"
            :teleported="false"
            placeholder="Select"
            effect="dark"
            size="small"
            style="width: 100%"
            @change="handelEntrustmentChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="targetPoolMarketCap"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="市值跌至预期值将买入"
            v-if="entrustmentOptions == 1"
          >
            <template #suffix>
              <span class="suffix-txt">USDT</span>
            </template>
          </el-input>
          <el-input
            v-model="targetMarketCap"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="市值跌至预期值将买入"
            v-else-if="entrustmentOptions == 2"
          >
            <template #suffix>
              <span class="suffix-txt">USDT</span>
            </template>
          </el-input>
          <el-input
            v-model="amount"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="价格跌至预期值将买入"
            v-else-if="entrustmentOptions == 3"
          >
            <template #suffix>
              <span class="suffix-txt">%</span>
            </template>
          </el-input>
          <el-input
            v-model="targetPrice"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="价格跌至预期值将买入"
            v-else-if="entrustmentOptions == 4"
          >
            <template #suffix>
              <span class="suffix-txt">USDT</span>
            </template>
          </el-input>
          <div class="market-items display-flex align-items-center">
            <span
              v-for="(item, index) in tabIndex == 3 ? downList : upList"
              :key="index"
              @click="handelQuick(item)"
              >{{ item.label }}</span
            >
          </div>
        </div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="limitAmount"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="数量"
            @input="handelLimitAmountInput"
          >
            <template #suffix>
              <span class="suffix-txt">{{ buyInfo.baseSymbol }}</span>
            </template>
          </el-input>
        </div>
        <div class="form-item-slider">
          <el-slider
            v-model="positionLimitVal"
            @input="handelPositionLimitInput"
            :marks="marks"
            :show-tooltip="false"
          />
        </div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="limitExchangeAmount"
            size="small"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="预估兑换"
            @input="handelLimitExchangeAmountInput"
          >
            <template #suffix>
              <span class="suffix-txt">{{ sellInfo.baseSymbol }}</span>
            </template>
          </el-input>
        </div>
      </div>
    </template>
  </div>
  <div class="buy-sell-btn">
    <DoubleCost class="double-cost" />
    <div class="display-flex align-items-center justify-content-sp">
      <span>{{ MAIN_COIN[sellInfo.baseSymbol] || sellInfo.baseSymbol }}</span>
      <span>
        <i style="font-style: normal; color: #202020">{{
          sellInfo.balance == 0 ? '0' : numberFormat(balanceFormat(sellInfo))
        }}</i
        >≈${{ numberFormat(sellInfo.totalAmount) }}
      </span>
    </div>
    <div class="display-flex align-items-center justify-content-sp">
      <span>{{ buyInfo.baseSymbol }}</span>
      <span>
        <i style="font-style: normal; color: #202020">{{
          buyInfo.balance == 0 ? '0' : numberFormat(balanceFormat(buyInfo))
        }}</i
        >≈${{ numberFormat(buyInfo.totalAmount) }}
      </span>
    </div>
    <div class="display-flex justify-content-sp">
      <div class="display-flex align-items-center" @click="slideSettingShowBottom = true">
        <span style="white-space: nowrap">滑点设置</span>
        <svg-icon name="clock-rewind" class="icon"></svg-icon>
      </div>
      <span>
        {{
          sellInfo.chainCode == 'SOLANA'
            ? '0.001 SOL≈$' + numberFormat(mainNetworkCurrencyPrice * 0.001)
            : numberFormat(1.2 * gasObj.gasPrice) +
              'Gwei快速≈$' +
              numberFormat(
                decimalsFormat(
                  1.2 * Number(gasObj.gwei) * 300000 * mainNetworkCurrencyPrice,
                  mainNetworkCurrency(sellInfo.chainCode)?.decimals || 0
                )
              )
        }}
      </span>
    </div>
    <div class="buy-btn btn" @click="isConnected ? handelConfirmBuy() : handelLogon()">
      确定买入
    </div>
  </div>
  <SlideSettingPopup
    :slideSettingShowBottom="slideSettingShowBottom"
    @slippage="handelSlippage"
    @close="handleClose"
  />
</template>
<script lang="ts" setup>
import BigNumber from 'bignumber.js'
import { ref, watchEffect, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CSSProperties } from 'vue'
import { MAIN_COIN } from '@/types'
import {
  balanceFormat,
  resetAddress,
  solanaTransactionReceipt,
  evmTransactionReceipt,
  getTokenList,
  decimalsFormat,
  getEvmGasGwei
} from '@/utils/transition'
import { numberFormat, mainNetworkCurrency, isAllSpaces } from '@/utils'
import { useGlobalStore } from '@/stores/global'
import { APIauthTradeSwap } from '@/api/coinWalletDetails'
import { APIcreateOrder } from '@/api'
import { showToast } from 'vant'
import {
  notificationInfo,
  notificationSuccessful,
  notificationFailed,
  notificationWarn
} from '@/utils/notification'
import { useI18n } from 'vue-i18n'
import DoubleCost from '@/components/DoubleCost.vue'
import SlideSettingPopup from '../Dialogs/SlideSettingPopup.vue'

const i18n = useI18n()
const route = useRoute()
const router = useRouter()

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

const globalStore = useGlobalStore()
const account: any = localStorage.getItem('accountInfo')
const slippage = ref<any>(account ? JSON.parse(account).slippage : '0.03') // 滑点
const gasObj = ref<any>({
  gwei: 0,
  gasPrice: 0
}) // Gas费

const customWalletInfo = computed(() => globalStore.customWalletInfo)
const isConnected = computed(() => globalStore.walletInfo.isConnected)

const buyInfo = ref<any>({})
const sellInfo = ref<any>({})
const timer = ref<any>(null)
const mainNetworkCurrencyPrice = ref<number>(0)
const slideSettingShowBottom = ref<boolean>(false)

const handleClose = (val: boolean) => {
  slideSettingShowBottom.value = val
}

const handelSlippage = (val: any) => {
  slippage.value = val
}

const updateCoinInfo = async () => {
  const res: any = await getTokenList(
    customWalletInfo.value.chainCode,
    customWalletInfo.value.walletInfo?.wallet
  )
  mainNetworkCurrencyPrice.value = parseFloat(res?.[0].price || 0)
  if (sellInfo.value.baseAddress) {
    const obj = res?.find((item: any) => item.address == sellInfo.value.baseAddress)
    sellInfo.value.balance = obj?.amount || 0
    sellInfo.value.totalAmount = obj?.totalAmount || 0
    sellInfo.value.price = props.pairInfo.price || 0
  }
  if (buyInfo.value.baseAddress) {
    const obj = res?.find((item: any) => item.address == buyInfo.value.baseAddress)
    buyInfo.value.balance = obj?.amount || 0
    buyInfo.value.totalAmount = obj?.totalAmount || 0
    buyInfo.value.price = obj?.price || 0
  }
}

const tabList = [
  {
    label: '一键交易',
    value: 1
  },
  {
    label: '市价交易',
    value: 2
  },
  {
    label: '限价单 - 抄底',
    value: 3
  },
  {
    label: '限价单 - 高于价格后买入',
    value: 4
  }
]
const tabIndex = ref<number>(1)

watchEffect(async () => {
  console.log(props.coinInfo)
  buyInfo.value = { ...props.coinInfo.buyCoin }
  sellInfo.value = { ...props.coinInfo.sellCoin }
  if (isConnected.value) {
    await updateCoinInfo()
  }
  if (sellInfo.value.chainCode != 'SOLANA') {
    gasObj.value = await getEvmGasGwei(mainNetworkCurrency(sellInfo.value.chainCode)?.rpc)
  }
})

/************** 一键交易 买入 start **************/
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
  },
  {
    label: '10',
    value: 10
  }
]

const buyIndex = ref<number>(0)
const coinAmount = ref<any>('')
const inputFocusType = ref<boolean>(false)

const handelBuy = (item: any) => {
  buyIndex.value = item.value
  inputFocusType.value = false
}

const handeCoinFocus = () => {
  inputFocusType.value = true
  buyIndex.value = 0
}

const handelCoinBlur = () => {
  if (buyIndex.value !== 0 || coinAmount.value == '') {
    inputFocusType.value = false
  }
}

const oneClickTrading = () => {
  if (buyIndex.value == 0 && parseFloat(coinAmount.value || 0) == 0) {
    showToast('请输入买入数量')
    return true
  }
  const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
  const spendAmount = new BigNumber(buyIndex.value || coinAmount.value)
    .times(num)
    .integerValue(BigNumber.ROUND_DOWN)
    .toString(10)

  if (parseFloat(spendAmount) > parseFloat(buyInfo.value.balance)) {
    showToast('余额不足')
    return
  }
  const params = {
    amount: new BigNumber(spendAmount).toString(10),
    walletId: customWalletInfo.value.walletInfo?.walletId,
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    fromTokenAddress: resetAddress(buyInfo.value.baseAddress),
    toTokenAddress: resetAddress(sellInfo.value.baseAddress),
    fromTokenDecimals: Number(buyInfo.value.baseTokenDecimals),
    toTokenDecimals: Number(sellInfo.value.baseTokenDecimals),
    slippage: slippage.value.toString(),
    type: '0',
    tradeType: 'F',
    price: props.pairInfo.price,
    profitFlag: parseFloat(localStorage.getItem('increaseSet') || '0') / 100
  }

  marketTradeSwap(params)
}
/************** 一键交易 买入 end  **************/

/************** 市价交易 买入 start *************/
const amount = ref<string>('')
const positionMarketVal = ref<number>(0)
const marketExchangeAmount = ref<string>('')
const marketPrice = ref<string>('')

const handelMarketAmountInput = () => {
  if (parseFloat(amount.value) >= parseFloat(balanceFormat(buyInfo.value))) {
    amount.value = balanceFormat(buyInfo.value)
    positionMarketVal.value = 100
  } else {
    positionMarketVal.value = Math.floor(
      (parseFloat(amount.value) / parseFloat(balanceFormat(buyInfo.value))) * 100
    )
  }

  marketExchangeAmount.value = (
    (parseFloat(amount.value || '0') * parseFloat(buyInfo.value.price)) /
    sellInfo.value.price
  ).toString()

  marketPrice.value = (parseFloat(amount.value || '0') * parseFloat(buyInfo.value.price)).toString()
}

const handelPositionMarketInput = () => {
  if (positionMarketVal.value == 100) {
    amount.value = balanceFormat(buyInfo.value)
    return
  } else {
    amount.value = (balanceFormat(buyInfo.value) * (positionMarketVal.value / 100)).toString()
  }
  marketExchangeAmount.value = (
    (parseFloat(amount.value || '0') * parseFloat(buyInfo.value.price)) /
    sellInfo.value.price
  ).toString()

  marketPrice.value = (parseFloat(amount.value || '0') * parseFloat(buyInfo.value.price)).toString()
}

const handelMarketExchangeAmountInput = () => {
  const num =
    (parseFloat(marketExchangeAmount.value || '0') * parseFloat(sellInfo.value.price)) /
    parseFloat(buyInfo.value.price)

  if (num >= parseFloat(balanceFormat(buyInfo.value))) {
    amount.value = balanceFormat(buyInfo.value)
    positionMarketVal.value = 100
    marketExchangeAmount.value = (
      (parseFloat(amount.value || '0') * parseFloat(buyInfo.value.price)) /
      sellInfo.value.price
    ).toString()
  } else {
    amount.value = num.toString()

    positionMarketVal.value = Math.floor(
      (parseFloat(amount.value || '0') / parseFloat(balanceFormat(buyInfo.value))) * 100
    )
  }

  marketPrice.value = (parseFloat(amount.value || '0') * parseFloat(buyInfo.value.price)).toString()
}

const handelMarketPriceInput = () => {
  const num = parseFloat(marketPrice.value || '0') / parseFloat(buyInfo.value.price)
  console.log(num)
  if (num >= parseFloat(balanceFormat(buyInfo.value))) {
    amount.value = balanceFormat(buyInfo.value)
    positionMarketVal.value = 100
    marketPrice.value = (
      parseFloat(amount.value || '0') * parseFloat(buyInfo.value.price)
    ).toString()
  } else {
    amount.value = num.toString()
    positionMarketVal.value = Math.floor(
      (parseFloat(amount.value || '0') / parseFloat(balanceFormat(buyInfo.value))) * 100
    )
  }

  marketExchangeAmount.value = (
    (parseFloat(amount.value || '0') * parseFloat(buyInfo.value.price)) /
    sellInfo.value.price
  ).toString()
}

const marketTrade = () => {
  if (isAllSpaces(amount.value) || amount.value == '0') {
    showToast(`请输入数量`)
    return
  }

  if (buyInfo.value.balance == 0) {
    showToast('余额不足')
    return
  }

  const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
  const spendAmount = new BigNumber(amount.value).times(num).integerValue(BigNumber.ROUND_DOWN)

  const params = {
    amount: new BigNumber(spendAmount).toString(10),
    walletId: customWalletInfo.value.walletInfo?.walletId,
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    fromTokenAddress: resetAddress(buyInfo.value.baseAddress),
    toTokenAddress: resetAddress(sellInfo.value.baseAddress),
    fromTokenDecimals: Number(buyInfo.value.baseTokenDecimals),
    toTokenDecimals: Number(sellInfo.value.baseTokenDecimals),
    slippage: slippage.value.toString(),
    type: '0',
    tradeType: 'M',
    price: props.pairInfo.price,
    profitFlag: parseFloat(localStorage.getItem('increaseSet') || '0') / 100
  }

  marketTradeSwap(params)
}
/************** 市价交易 买入 end *************/

/************** 限价交易 买入 start *************/
const downList = [
  {
    value: '-0.05',
    label: '-5%'
  },
  {
    value: '-0.1',
    label: '-10%'
  },
  {
    value: '-0.2',
    label: '-20%'
  },
  {
    value: '-0.25',
    label: '-25%'
  },
  {
    value: '-0.5',
    label: '-50%'
  }
]

const upList = [
  {
    value: '+0.05',
    label: '+5%'
  },
  {
    value: '+0.1',
    label: '+10%'
  },
  {
    value: '+0.2',
    label: '+20%'
  },
  {
    value: '+0.25',
    label: '+25%'
  },
  {
    value: '+0.5',
    label: '+50%'
  }
]

const options = [
  // {
  //   value: 1,
  //   label: '池子市值'
  // },
  {
    value: 2,
    label: '总市值'
  },
  // {
  //   value: 3,
  //   label: '百分比'
  // },
  {
    value: 4,
    label: '价格'
  }
]

const entrustmentOptions = ref<any>(2)
const targetPoolMarketCap = ref<string>('') // 池子市值
const targetPrice = ref<string>('') // 价格
const targetMarketCap = ref<string>('') // 总市值

const limitAmount = ref<string>('')
const limitExchangeAmount = ref<string>('')
const positionLimitVal = ref<number>(0)
const limitPrice = ref<string>('0')

const handelEntrustmentChange = () => {
  targetPoolMarketCap.value = ''
  targetMarketCap.value = ''
  targetPrice.value = ''
}

const handelQuick = (item: any) => {
  if (entrustmentOptions.value == 1) {
    targetPoolMarketCap.value = (props.pairInfo.tvl * (1 + parseFloat(item.value))).toString()
  } else if (entrustmentOptions.value == 2) {
    targetMarketCap.value = (
      props.pairInfo.circulationVol *
      (1 + parseFloat(item.value))
    ).toString()
  } else if (entrustmentOptions.value == 4) {
    targetPrice.value = (parseFloat(props.pairInfo.price) * (1 + parseFloat(item.value))).toString()
  }
}

const handelLimitAmountInput = () => {
  if (parseFloat(limitAmount.value) >= parseFloat(balanceFormat(buyInfo.value))) {
    limitAmount.value = balanceFormat(buyInfo.value)
    positionLimitVal.value = 100
  } else {
    positionLimitVal.value = Math.floor(
      (parseFloat(limitAmount.value) / parseFloat(balanceFormat(buyInfo.value))) * 100
    )
  }

  limitExchangeAmount.value = (
    (parseFloat(limitAmount.value || '0') * parseFloat(buyInfo.value.price)) /
    sellInfo.value.price
  ).toString()

  limitPrice.value = (
    parseFloat(limitAmount.value || '0') * parseFloat(buyInfo.value.price)
  ).toString()
}

const handelPositionLimitInput = () => {
  if (positionLimitVal.value == 100) {
    limitAmount.value = balanceFormat(buyInfo.value)
    return
  } else {
    limitAmount.value = (balanceFormat(buyInfo.value) * (positionLimitVal.value / 100)).toString()
  }
  limitExchangeAmount.value = (
    (parseFloat(limitAmount.value || '0') * parseFloat(buyInfo.value.price)) /
    sellInfo.value.price
  ).toString()

  limitPrice.value = (
    parseFloat(limitAmount.value || '0') * parseFloat(buyInfo.value.price)
  ).toString()
}

const handelLimitExchangeAmountInput = () => {
  const num =
    (parseFloat(limitExchangeAmount.value || '0') * parseFloat(sellInfo.value.price)) /
    parseFloat(buyInfo.value.price)

  if (num >= parseFloat(balanceFormat(buyInfo.value))) {
    limitAmount.value = balanceFormat(buyInfo.value)
    positionLimitVal.value = 100
    limitExchangeAmount.value = (
      (parseFloat(limitAmount.value || '0') * parseFloat(buyInfo.value.price)) /
      sellInfo.value.price
    ).toString()
  } else {
    limitAmount.value = num.toString()

    positionLimitVal.value = Math.floor(
      (parseFloat(limitAmount.value || '0') / parseFloat(balanceFormat(buyInfo.value))) * 100
    )
  }

  limitPrice.value = (
    parseFloat(limitAmount.value || '0') * parseFloat(buyInfo.value.price)
  ).toString()
}

const limitTrade = () => {
  if (
    isAllSpaces(targetPoolMarketCap.value) &&
    isAllSpaces(targetMarketCap.value) &&
    isAllSpaces(targetPrice.value)
  ) {
    showToast('请输入预期值')
    return
  }

  if (isAllSpaces(limitAmount.value)) {
    showToast('请输入数量')
    return
  }

  if (buyInfo.value.balance == 0) {
    showToast('余额不足')
    return
  }

  const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
  const spendAmount = new BigNumber(limitAmount.value).times(num).integerValue(BigNumber.ROUND_DOWN)

  let limitOrderType = 1
  let uiType = 0
  if (tabIndex.value == 2 && entrustmentOptions.value == 2) {
    limitOrderType = 6
  } else if (tabIndex.value == 2 && entrustmentOptions.value == 4) {
    limitOrderType = 2
  } else if (tabIndex.value == 3 && entrustmentOptions.value == 2) {
    limitOrderType = 5
  } else if (tabIndex.value == 3 && entrustmentOptions.value == 4) {
    limitOrderType = 1
  }

  if (entrustmentOptions.value == 2) {
    uiType = 2
  } else if (entrustmentOptions.value == 4) {
    uiType = 1
  }

  const params = {
    walletId: customWalletInfo.value.walletInfo?.walletId, // 用户钱包Id
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    chainCode: buyInfo.value.chainCode, // 链
    orderType: 0, // 交易类型,1:卖出,0买入
    limitOrderType, // 1, 价格高点买入(限价单-高于价格后买入) 2, “价格低点买入(限价单抄底)” 3 “价格高点卖出(限价单止盈)” 4, “价格低点卖出(限价单止损)” ,5:高于市值买(限价单-高于价格后买入) ,6:低于市值买(限价单-抄底),7:高于市值卖(限价单-止盈) 8:低于市值卖（限价单-止损）
    tradeType: 'L', // 交易类型,M:市价单,C:一键清仓,F:一键交易,L:限价单,
    fromTokenAddress: resetAddress(buyInfo.value.baseAddress), // 买入地址
    toTokenAddress: resetAddress(sellInfo.value.baseAddress), // 卖出地址
    fromTokenDecimals: parseFloat(buyInfo.value.baseTokenDecimals), // 卖出地址Decimals
    toTokenDecimals: parseFloat(sellInfo.value.baseTokenDecimals), // 买入地址Decimals
    fromTokenAmount: spendAmount, // 卖出数额
    targetPrice: parseFloat(targetPrice.value || '0'), // 目标价格
    targetMarketCap: parseFloat(targetMarketCap.value || '0'), // 目标市值
    targetPoolMarketCap: parseFloat(targetPoolMarketCap.value || '0'), // 池子目标市值
    slippage: slippage.value.toString(), // 滑点
    expireTime: 86400 * 30 * 365, // 超时时间 秒级时间戳
    uiType,
    profitFlag: parseFloat(localStorage.getItem('increaseSet') || '0') / 100
  }
  limitTradeSwap(params)
}

/************** 限价交易 买入 end *************/

/**
 * @description 确认操作
 */
const handelConfirmBuy = () => {
  if (tabIndex.value == 1) {
    oneClickTrading()
  } else if (tabIndex.value == 2) {
    marketTrade()
  } else {
    limitTrade()
  }
}

/**
 * @description 一键交易，市价交易
 * @param params
 */
const marketTradeSwap = async (params: any) => {
  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：买入处理中`,
    customClass: 'notification-h5',
    message: `<div class='display-flex align-items-center notification-box'>
                <span class='notification-txt'>买入</span>
                <span class='up-color'>${numberFormat(buyIndex.value || coinAmount.value) + ' ' + buyInfo.value.baseSymbol}</span>
                <i></i>
                <span class='notification-txt'>成交市值</span>
                <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
              </div>
              <div class='notification-step-line-up'></div>
              `
  })
  const res: any = await APIauthTradeSwap({
    ...params
  })
  if (res) {
    const result =
      buyInfo.value.chainCode == 'SOLANA'
        ? await solanaTransactionReceipt(res.tx, mainNetworkCurrency(buyInfo.value.chainCode).rpc)
        : await evmTransactionReceipt(res.tx, mainNetworkCurrency(buyInfo.value.chainCode).rpc)
    if (result === true) {
      notificationSuccessful({
        title: `${sellInfo.value.baseSymbol}：买入交易成功`,
        message: `<div class='display-flex flex-direction-col notification-box'>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>买入</span>
                        <span class='up-color'>${numberFormat(res.fromTokenAmount) + ' ' + buyInfo.value.baseSymbol}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>成交市值</span>
                        <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>获得</span>
                        <span class='up-color'>${numberFormat(res.toTokenAmount) + ' ' + sellInfo.value.baseSymbol}</span>
                    </div>
                  </div>`,
        customClass: 'notification-h5'
      })
    } else if (result === false) {
      notificationFailed({
        title: `${sellInfo.value.baseSymbol}：买入交易失败`,
        message: `${i18n.t('TransactionFailed')}`,
        customClass: 'notification-h5'
      })
    } else {
      notificationWarn({
        title: `${sellInfo.value.baseSymbol}`,
        message: `${result}`,
        customClass: 'notification-h5'
      })
    }
  } else {
    notificationFailed({
      title: `${sellInfo.value.baseSymbol}：买入交易失败`,
      message: `${i18n.t('TransactionFailed')}`,
      customClass: 'notification-h5'
    })
  }
}

/**
 * @description 限价单
 * @param params
 */
const limitTradeSwap = async (params: any) => {
  const title = tabIndex.value == 2 ? '限价单 - 抄底' : '限价单 - 高于价格后买入'
  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：${title}`,
    customClass: 'notification-h5',
    message: `<div class="display-flex align-items-center">
              <p class="notification_loader"></p>
              <span>创建中</span>
            </div>
            <div class='notification-step-line-up'></div>
            `
  })
  const res = await APIcreateOrder(params)
  if (res) {
    notificationSuccessful({
      title: `${sellInfo.value.baseSymbol}：${title}`,
      message: `创建成功`,
      customClass: 'notification-h5'
    })
  } else {
    notificationFailed({
      title: `${sellInfo.value.baseSymbol}：${title}`,
      customClass: 'notification-h5',
      message: `创建失败`
    })
  }
}

const handelLogon = () => {
  router.push('/h5/signIn')
}

onMounted(async () => {
  timer.value = setInterval(async () => {
    if (sellInfo.value.chainCode != 'SOLANA') {
      gasObj.value = await getEvmGasGwei(mainNetworkCurrency(sellInfo.value.chainCode).rpc)
    }
    if (isConnected.value) {
      updateCoinInfo()
    }
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
@use './BuySell.scss';
</style>
