<template>
  <div class="buy-limit">
    <div class="buy-limit-tab">
      <span>交易类型</span>
      <el-select v-model="tabIndex" :teleported="false" style="width: 100%">
        <el-option
          v-for="item in tabList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <template v-if="tabIndex == 1">
      <div class="buy-limit-content">
        <div class="market-price-btn margin-bottom-12">市价</div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="amount"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="数量"
            clearable
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
          />
        </div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="marketExchangeAmount"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="预估兑换"
            clearable
            @input="handelMarketExchangeAmountInput"
          >
            <template #suffix>
              <span class="suffix-txt">{{ sellInfo.baseSymbol }}</span>
            </template>
          </el-input>
        </div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="marketPrice"
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

        <div class="price display-flex align-items-center justify-content-sp">
          <span>可用</span>
          <strong
            ><i>{{ numberFormat(balanceFormat(buyInfo)) }}</i
            >≈${{ numberFormat(buyInfo.totalAmount) }}</strong
          >
        </div>

        <div class="submit-btn" v-if="marketLoading">
          <el-icon class="is-loading" :size="18">
            <Loading />
          </el-icon>
          <span>买入</span>
        </div>
        <div class="submit-btn" v-else @click="handelMarketBuy">买入</div>
      </div>
    </template>
    <template v-else>
      <div class="buy-limit-content">
        <div class="form-item margin-bottom-12">
          <el-select
            v-model="entrustmentOptions"
            :teleported="false"
            placeholder="Select"
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
              v-for="(item, index) in tabIndex == 2 ? downList : upList"
              :key="index"
              @click="handelQuick(item)"
              >{{ item.label }}</span
            >
          </div>
        </div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="limitAmount"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="数量"
            @input="handelLimitAmountInput"
          >
            <template #suffix>
              <span class="suffix-txt">{{ buyInfo.baseSymbol }}</span>
            </template>
          </el-input>
          <span class="form-item-txt">估值：{{ numberFormat(limitPrice) }} USDT</span>
        </div>
        <div class="form-item-slider">
          <el-slider v-model="positionLimitVal" @input="handelPositionLimitInput" :marks="marks" />
        </div>
        <div class="form-item margin-bottom-12">
          <el-input
            v-model="limitExchangeAmount"
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

        <div class="price display-flex align-items-center justify-content-sp">
          <span>可用</span>
          <strong
            ><i>{{ numberFormat(balanceFormat(buyInfo)) }}</i
            >≈${{ numberFormat(buyInfo.totalAmount) }}</strong
          >
        </div>
        <div class="submit-btn" v-if="limitLoading">
          <el-icon class="is-loading" :size="18">
            <Loading />
          </el-icon>
          <span>买入</span>
        </div>
        <div class="submit-btn" v-else @click="handelLimitBuy">买入</div>
      </div>
    </template>
    <AdvancedSetting
      ref="advancedSetting"
      :coinInfo="{
        buyCoin: buyInfo,
        sellCoin: sellInfo
      }"
      :mainNetworkCurrencyPrice="mainNetworkCurrencyPrice"
      @slippage="handelSlippage"
    />
  </div>
</template>

<script lang="ts" setup>
import BigNumber from 'bignumber.js'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { CSSProperties } from 'vue'
import { balanceFormat, resetAddress } from '@/utils/transition'
import { notificationInfo, notificationSuccessful, notificationFailed } from '@/utils/notification'
import { APIauthTradeSwap } from '@/api/coinWalletDetails'
import { APIcreateOrder } from '@/api'
import { useI18n } from 'vue-i18n'
import { mainNetworkCurrency, numberFormat, isAllSpaces } from '@/utils'

import { useGlobalStore } from '@/stores/global'
import AdvancedSetting from './AdvancedSetting.vue'
import { customMessage } from '@/utils/message'

const i18n = useI18n()
const globalStore = useGlobalStore()

const customWalletInfo = computed(() => globalStore.customWalletInfo)
const tokenList = computed(() => globalStore.tokenList)

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

const advancedSetting = ref<any>(null)
const account: any = localStorage.getItem('accountInfo')
const slippage = ref<any>(account ? JSON.parse(account).slippage : '0.03') // 滑点

const handelSlippage = (val: any) => {
  slippage.value = val
}

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

const tabList = [
  {
    label: '市价交易',
    value: 1
  },
  {
    label: '限价单 - 抄底',
    value: 2
  },
  {
    label: '限价单 - 高于价格后买入',
    value: 3
  }
]
const tabIndex = ref<number>(1)

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

const buyInfo = ref({
  ...props.coinInfo.buyCoin
})

const sellInfo = ref({
  ...props.coinInfo.sellCoin
})

const mainNetworkCurrencyAmount = ref<any>(0)
const mainNetworkCurrencyPrice = ref<any>(0)

const updateTradingInfo = () => {
  const res: any = tokenList.value
  mainNetworkCurrencyAmount.value = res?.[0].amount
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

const entrustmentOptions = ref<any>(2)

// 限价委托

watch(tokenList, () => {
  updateTradingInfo()
})

/**************** 市价 start **************/
const amount = ref<string>('')
const positionMarketVal = ref<number>(0)
const marketExchangeAmount = ref<string>('')
const marketPrice = ref<string>('')
const marketLoading = ref<boolean>(false)

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
  // console.log(num)
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

const handelMarketBuy = async () => {
  if (isAllSpaces(amount.value) || amount.value == '0') {
    customMessage({
      type: 'error',
      title: '请输入数量'
    })
    return
  }

  if (buyInfo.value.chainCode !== customWalletInfo.value.chainCode) {
    customMessage({
      type: 'error',
      title: `请选择${buyInfo.value.chainCode}链钱包`
    })
    return
  }

  if (buyInfo.value.balance == 0) {
    customMessage({
      type: 'error',
      title: `余额不足`
    })
    return
  }


  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：买入处理中`,
    message: `<div class='display-flex align-items-center notification-box'>
                <span class='notification-txt'>买入</span>
                <span class='up-color'>${amount.value + ' ' + buyInfo.value.baseSymbol}</span>
                <i></i>
                <span class='notification-txt'>成交市值</span>
                <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
              </div>
              <div class='notification-step-line-up'></div>
              `
  })

  marketLoading.value = true
  const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
  const spendAmount = new BigNumber(amount.value).times(num).integerValue(BigNumber.ROUND_DOWN)

  const res: any = await APIauthTradeSwap({
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
  })

  if (res.code == 200) {
    notificationSuccessful({
      title: `${sellInfo.value.baseSymbol}：买入成功`,
      message: `<div class='display-flex flex-direction-col notification-box'>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>买入</span>
                        <span class='up-color'>${numberFormat(res.data.fromTokenAmount) + ' ' + buyInfo.value.baseSymbol}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>成交市值</span>
                        <span class='up-color'>${numberFormat(props.pairInfo.circulationVol)}</span>
                    </div>
                    <div class='display-flex align-items-center'>
                        <span class='notification-txt'>获得</span>
                        <span class='up-color'>${numberFormat(res.data.toTokenAmount) + ' ' + sellInfo.value.baseSymbol}</span>
                    </div>
                  </div>`
    })
    formDataClear()
    marketLoading.value = false
  } else {
    marketLoading.value = false
    notificationFailed({
      title: `${sellInfo.value.baseSymbol}：买入失败`,
      message: `${res.msg}`
    })
  }
}
/**************** 市价 end **************/

/**************** 限价 start **************/
const targetPoolMarketCap = ref<string>('') // 池子市值
const targetPrice = ref<string>('') // 价格
const targetMarketCap = ref<string>('') // 总市值

const limitAmount = ref<string>('')
const limitExchangeAmount = ref<string>('')
const positionLimitVal = ref<number>(0)
const limitPrice = ref<string>('0')
const limitLoading = ref<boolean>(false)

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

const handelLimitBuy = async () => {
  if (
    isAllSpaces(targetPoolMarketCap.value) &&
    isAllSpaces(targetMarketCap.value) &&
    isAllSpaces(targetPrice.value)
  ) {
    customMessage({
      type: 'error',
      title: `请输入预期值`
    })
    return
  }

  if (isAllSpaces(limitAmount.value)) {
    customMessage({
      type: 'error',
      title: `请输入数量`
    })
    return
  }

  if (buyInfo.value.chainCode !== customWalletInfo.value.chainCode) {
    customMessage({
      type: 'error',
      title: `请选择${buyInfo.value.chainCode}链钱包`
    })
    return
  }

  if (buyInfo.value.balance == 0) {
    customMessage({
      type: 'error',
      title: `余额不足`
    })
    return
  }

  const title = tabIndex.value == 2 ? '限价单 - 抄底' : '限价单 - 高于价格后买入'

  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：${title}`,
    message: `<div class="display-flex align-items-center">
              <p class="notification_loader"></p>
              <span>创建中</span>
            </div>
            <div class='notification-step-line-up'></div>
            `
  })

  limitLoading.value = true
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
  const res: any = await APIcreateOrder(params)
  limitLoading.value = false

  if (res.code == 200) {
    notificationSuccessful({
      title: `${sellInfo.value.baseSymbol}：${title}`,
      message: `创建成功`
    })
    formDataClear()
  } else {
    notificationFailed({
      title: `${sellInfo.value.baseSymbol}：${title}`,
      message: `${res.msg}`
    })
  }
}

/**************** 限价 end **************/
const formDataClear = () => {
  // 市价
  amount.value = ''
  positionMarketVal.value = 0
  marketExchangeAmount.value = ''
  marketPrice.value = ''

  // 限价
  targetPoolMarketCap.value = '' // 池子市值
  targetPrice.value = '' // 价格
  targetMarketCap.value = '' // 总市值
  limitAmount.value = ''
  limitExchangeAmount.value = ''
  positionLimitVal.value = 0
}

onMounted(() => {
  updateTradingInfo()
})

defineExpose({
  buyInfo
})
</script>

<style lang="scss" scoped>
.buy-limit {
  .buy-limit-tab {
    margin: 12px 0;
    span {
      display: inline-block;
      color: var(--dex-color-4);
      margin-bottom: 4px;
    }
  }
  .buy-limit-content {
    .market-price-btn {
      cursor: not-allowed;
      border-radius: 6px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      font-size: 12px;
      background-color: var(--hover-bg-color);
      color: var(--dex-color-4);
    }
    .margin-bottom-12 {
      margin-bottom: 12px;
    }
    .market-items {
      margin-top: 3px;
      span {
        flex: 1;
        line-height: 20px;
        background: var(--hover-bg-color);
        margin-right: 2px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        color: var(--font-color-default);
      }
      span:active {
        background: var(--bg-color);
      }
    }
    .form-item-txt {
      display: inline-block;
      color: var(--dex-color-4);
      margin-top: 4px;
    }
    .form-item-slider {
      margin-bottom: 24px;
      :deep(.el-slider) {
        width: 90%;
        margin: 0 auto;
        .el-slider__marks-text {
          font-size: 12px;
        }
      }
    }
    .price {
      margin: 24px 0 12px 0;
      color: var(--dex-color-4);
      strong {
        font-weight: normal;
      }
      i {
        color: var(--font-color-default);
        font-style: normal;
      }
    }
    .submit-btn {
      border-radius: 6px;
      height: 32px;
      line-height: 32px;
      background: var(--up-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--font-color-default);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .submit-btn:active {
      transition: all 0.3s;
      outline: none;
      box-shadow: 0 0 0 6px rgba(46, 189, 133, 0.1);
    }
  }
  :deep(.el-popper) {
    .el-select-dropdown__item {
      color: var(--dex-color-4);
    }
    .el-select-dropdown__item.is-selected {
      color: var(--font-color-default);
    }
  }
  :deep(.el-select__wrapper) {
    font-size: 12px;
  }
  :deep(.el-input__wrapper) {
    font-size: 12px;
    padding: 0 11px;
  }
}
</style>
