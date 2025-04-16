<template>
  <el-dialog
    v-model="dialogVisible"
    title="止损"
    width="600"
    align-center
    :before-close="handleClose"
  >
    <div class="stopLimit-view">
      <div class="coin-info display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center">
          <div class="logo">
            <el-image :src="props.limitInfo.logo" alt="" class="logo-img">
              <template #error>
                <svg-icon name="logo1" class="logo-img"></svg-icon>
              </template>
            </el-image>
            <img :src="chainLogoObj[props.limitInfo.chainCode]" alt="" class="chainCode" />
          </div>
          <div class="display-flex align-items-center">
            <span class="base-symbol">{{ props.limitInfo.symbol }}</span>
            <span class="symbol">
              &nbsp;/&nbsp;{{
                chainConfigs.find((item: any) => item.chainCode == props.limitInfo.chainCode).symbol
              }}</span
            >
          </div>
        </div>
        <div class="display-flex align-items-center address-txt">
          <span>{{ shortifyAddress(props.limitInfo.tokenAddress) }}</span>
          <svg-icon name="copy" class="copy" v-copy="props.limitInfo.tokenAddress"></svg-icon>
        </div>
      </div>
      <div class="text-info">
        <p class="p-txt display-flex align-items-center justify-content-sp" v-if="tabIndex == 1">
          <span>买入平均市值</span>
          <strong>{{ numberFormat(props.limitInfo.averageBuyVolume) }}</strong>
        </p>
        <p class="p-txt display-flex align-items-center justify-content-sp" v-if="tabIndex == 1">
          <span>最新市値</span>
          <strong>{{ numberFormat(props.limitInfo.nowMarketCap) }}</strong>
        </p>
        <p class="p-txt display-flex align-items-center justify-content-sp" v-if="tabIndex == 2">
          <span>买入平均价格</span>
          <strong>${{ numberFormat(props.limitInfo.averagePrice) }}</strong>
        </p>
        <p class="p-txt display-flex align-items-center justify-content-sp" v-if="tabIndex == 2">
          <span>最新价格</span>
          <strong>${{ numberFormat(props.limitInfo.price) }}</strong>
        </p>
        <p class="p-txt display-flex align-items-center justify-content-sp">
          <span>收益率</span>
          <strong :class="props.limitInfo.totalEarnRate?.[0] === '-' ? 'down-color' : 'up-color'"
            >{{
              (props.limitInfo.totalEarnRate?.[0] === '-' ? '' : '+') +
              parseFloat(props.limitInfo.totalEarnRate || 0).toFixed(2)
            }}%</strong
          >
        </p>
      </div>
      <div class="from-view">
        <div class="tab-view">
          <span
            v-for="item in tabList"
            :key="item.value"
            :class="tabIndex == item.value ? 'active' : ''"
            @click="handelTab(item)"
            >{{ item.label }}</span
          >
        </div>
        <div class="from-item">
          <div v-show="tabIndex == 1">
            <p>触发市值</p>
            <el-input
              v-model="marketValue"
              size="large"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              style="width: 100%"
              placeholder="市值"
              @blur="handleMarketBlur"
              @focus="handelMarketFocus"
            >
              <template #suffix>
                <span class="suffix-txt">USD</span>
              </template>
            </el-input>
          </div>
          <div v-show="tabIndex == 2">
            <p>触发价格</p>
            <el-input
              v-model="priceValue"
              size="large"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              style="width: 100%"
              placeholder="价格"
            >
              <template #suffix>
                <span class="suffix-txt">USD</span>
              </template>
            </el-input>
          </div>
          <div class="market-items display-flex align-items-center">
            <span v-for="(item, index) in list" :key="index" @click="handelQuick(item)">{{
              item.label
            }}</span>
          </div>
        </div>
        <div class="from-item">
          <p>数量（{{ positionVal }}%）</p>
          <el-input
            v-model="amount"
            size="large"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            style="width: 100%"
            placeholder="数量"
            @input="handelAmountInput"
          >
            <template #suffix>
              <span class="suffix-txt">{{ props.limitInfo.symbol }}</span>
            </template>
          </el-input>
          <div class="price-txt">≈${{ numberFormat(expectedProfitAndLoss) }}</div>
          <el-slider v-model="positionVal" @input="handelPositionInput" :marks="marks" />
        </div>
      </div>
      <p class="p-txt display-flex align-items-center justify-content-sp">
        <span>持仓量</span>
        <strong>{{ numberFormat(props.limitInfo.amount) }}</strong>
      </p>
      <p class="p-txt display-flex align-items-center justify-content-sp">
        <span>预期盈亏</span>
        <strong :class="parseFloat(expectedProfitAndLoss) >= 0 ? 'up-color' : 'down-color'">{{
          (parseFloat(expectedProfitAndLoss) >= 0 ? '+' : '') +
          '$' +
          numberFormat(expectedProfitAndLoss)
        }}</strong>
      </p>
      <div class="stop-limit-btn" v-if="loading">
        <el-icon class="is-loading" :size="18">
          <Loading />
        </el-icon>
        <span>确认</span>
      </div>
      <div class="stop-limit-btn" v-else @click="handelConfirm">确认</div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { CSSProperties } from 'vue'
import BigNumber from 'bignumber.js'
import { USDT_CONFIG } from '@/types'
import { shortifyAddress, numberFormat, quantityUnitFormat, isAllSpaces } from '@/utils'
import { useGlobalStore } from '@/stores/global'
import { useChainConfigsStore } from '@/stores/chainConfigs'
import { APIcreateOrder } from '@/api'
import { resetAddress } from '@/utils/transition'
import { notificationInfo, notificationSuccessful, notificationFailed } from '@/utils/notification'
import { customMessage } from '@/utils/message'

const okCoin = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const globalStore = useGlobalStore()
const chain = useChainConfigsStore()

const { chainLogoObj } = globalStore

const chainConfigs = computed(() => chain.chainConfigs)
const customWalletInfo = computed(() => globalStore.customWalletInfo)
const account: any = localStorage.getItem('accountInfo')
const slippage = account ? JSON.parse(account).slippage : '0.03'

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

const tabList = [
  {
    value: 2,
    label: '价格'
  }
  // {
  //   value: 1,
  //   label: '市场'
  // }
]

const tabIndex = ref<number>(2)

const handelTab = (item: any) => {
  console.log(item)
  tabIndex.value = item.value
  marketValue.value = ''
  priceValue.value = ''
  amount.value = ''
  positionVal.value = 0
}

const list = [
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
/** 弹框逻辑处理 */
const emit = defineEmits(['close'])

const props: any = defineProps({
  stopLimitVisible: {
    type: [Boolean],
    default: false
  },
  limitInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const dialogVisible: any = computed({
  // getter
  get() {
    return props.stopLimitVisible
  },
  // setter
  set(newValue) {
    return newValue
  }
})
const handleClose = () => {
  emit('close', false)
}

const amount = ref<any>('') // 数量
const marketValue = ref<any>('') // 触发市值
const priceValue = ref<any>('') // 触发价格
const positionVal = ref<number>(0)
const loading = ref<boolean>(false)

const expectedProfitAndLoss = computed(() => {
  /**
   * marketValue 市值
   * priceValue 价格
   *
   * amount 数量
   * 1. 获得盈亏百分比：输入的市值减去 averageBuyMarketCap 平均买入市值，再除 averageBuyMarketCap 再除100
   * 2. 获得盈亏百分比：输入的价格减去 averagePrice 平均买入价，再除 averagePrice 再除100
   * 3. 获得预计盈亏：volume*盈亏百分比 * 你输入的数量
   * TODO: 改成 amount * averagePrice * 盈亏百分比 * 你输入的数量 ，只替换了 volume
   */

  let percentage = 0
  if (tabIndex.value == 1) {
    percentage =
      (quantityUnitFormat(marketValue.value || 0) -
        parseFloat(props.limitInfo.averageBuyMarketCap)) /
      parseFloat(props.limitInfo.averageBuyMarketCap) /
      100
  } else if (tabIndex.value == 2) {
    percentage =
      (quantityUnitFormat(priceValue.value || 0) - parseFloat(props.limitInfo.averagePrice)) /
      parseFloat(props.limitInfo.averagePrice) /
      100
  }

  const val =
    parseFloat(props.limitInfo.amount) *
    parseFloat(props.limitInfo.averagePrice) *
    percentage *
    (positionVal.value || 0)
  return val.toString()
})

const handelMarketFocus = () => {
  if (isAllSpaces(marketValue.value)) {
    return
  }
  marketValue.value = quantityUnitFormat(marketValue.value)
}

const handleMarketBlur = () => {
  if (isAllSpaces(marketValue.value)) {
    return
  }
  marketValue.value = numberFormat(marketValue.value)
}

const handelQuick = (item: any) => {
  console.log(1 + parseFloat(item.value))
  const percentum = 1 + parseFloat(item.value)
  if (tabIndex.value == 1) {
    const val = props.limitInfo.nowMarketCap * percentum
    marketValue.value = numberFormat(val)
  } else if (tabIndex.value == 2) {
    const val = props.limitInfo.price * percentum
    priceValue.value = val
  }
}

const handelAmountInput = () => {
  if (parseFloat(amount.value) >= parseFloat(props.limitInfo.amount)) {
    amount.value = props.limitInfo.amount
    positionVal.value = 100
    return
  }

  positionVal.value = Math.floor(
    (parseFloat(amount.value) / parseFloat(props.limitInfo.amount)) * 100
  )
}

const handelPositionInput = () => {
  if (positionVal.value == 100) {
    amount.value = props.limitInfo.amount
    return
  }
  amount.value = (props.limitInfo.amount * (positionVal.value / 100)).toString()
}

const handelConfirm = async () => {
  if (tabIndex.value == 1 && isAllSpaces(marketValue.value)) {
    customMessage({
      type: 'error',
      title: '请输入触发市值'
    })
    return
  }
  if (tabIndex.value == 2 && isAllSpaces(priceValue.value)) {
    customMessage({
      type: 'error',
      title: '请输入触发价格'
    })
    return
  }

  if (isAllSpaces(amount.value)) {
    customMessage({
      type: 'error',
      title: '请输入数量'
    })
    return
  }
  notificationInfo({
    title: `${props.limitInfo.symbol}：止损`,
    message: `<div class="display-flex align-items-center">
                <p class="notification_loader"></p>
                <span>创建中</span>
              </div>
              <div class='notification-step-line-down'></div>
              `
  })
  loading.value = true
  const chainConfig = chainConfigs.value.find(
    (item: any) => item.chainCode == props.limitInfo.chainCode
  )
  const num = 10 ** Number(props.limitInfo.decimals)
  const spendAmount = new BigNumber(amount.value).times(num).integerValue(BigNumber.ROUND_DOWN)
  console.log(spendAmount)

  let limitOrderType = 1
  let uiType = 0

  if (tabIndex.value == 2) {
    limitOrderType = parseFloat(priceValue.value) > parseFloat(props.limitInfo.price) ? 3 : 4
  } else if (tabIndex.value == 1) {
    limitOrderType =
      quantityUnitFormat(marketValue.value) > parseFloat(props.limitInfo.nowMarketCap) ? 7 : 8
  }

  if (tabIndex.value == 2) {
    uiType = 1
  } else if (tabIndex.value == 1) {
    uiType = 2
  }

  const params = {
    walletId: customWalletInfo.value.walletInfo?.walletId, // 用户钱包Id
    walletKey: customWalletInfo.value.walletInfo?.walletKey,
    chainCode: props.limitInfo.chainCode, // 链
    orderType: 1, // 交易类型,1:卖出,0买入
    limitOrderType, // 1, 高点买入 2, “低点买入” 3 “高点卖出” 4, “低点卖出” ,5:高于市值买 ,6:低于市值买,7:高于市值卖 8:低于市值卖
    tradeType: 'L', // 交易类型,M:市价单,C:一键清仓,F:一键交易,L:限价单,
    fromTokenAddress: resetAddress(props.limitInfo.tokenAddress), // 买入地址
    toTokenAddress: resetAddress(
      props.limitInfo.tokenAddress.toLowerCase() == okCoin
        ? USDT_CONFIG[props.limitInfo.chainCode].address
        : chainConfig.symbolAddress
    ), // 卖出地址
    fromTokenDecimals: Number(props.limitInfo.decimals), // 卖出地址Decimals
    toTokenDecimals: Number(
      props.limitInfo.tokenAddress.toLowerCase() == okCoin
        ? USDT_CONFIG[props.limitInfo.chainCode].decimals
        : chainConfig.decimals
    ), // 买入地址Decimals
    fromTokenAmount: spendAmount, // 卖出数额
    targetPrice: parseFloat(priceValue.value || '0'), // 目标价格
    targetMarketCap: quantityUnitFormat(marketValue.value || 0), // 目标市值
    targetPoolMarketCap: 0, // 池子目标市值
    slippage, // 滑点
    expireTime: 86400 * 30 * 365, // 超时时间 秒级时间戳
    uiType,
    profitFlag: 0
  }
  console.log(params)

  const res: any = await APIcreateOrder(params)
  loading.value = false
  console.log(res)
  if (res.code == 200) {
    notificationSuccessful({
      title: `${props.limitInfo.symbol}：止损`,
      message: `创建成功`
    })
  } else {
    notificationFailed({
      title: `${props.limitInfo.symbol}：止损`,
      message: `${res.msg}`
    })
  }
}
</script>

<style scoped lang="scss">
.coin-info {
  padding: 14px 0;
  border-bottom: 1px dashed var(--el-border-color);
  .logo {
    position: relative;
  }
  .logo,
  .logo-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .chainCode {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .base-symbol {
    font-size: 16px;
    color: var(--font-color-default);
    margin-left: 12px;
  }
  .symbol,
  .address-txt {
    color: var(--dex-color-4);
  }
  .copy {
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }
}
.text-info {
  padding: 14px 0;
  border-bottom: 1px dashed var(--el-border-color);
}

p.p-txt {
  margin-bottom: 8px;
  span {
    color: var(--dex-color-4);
  }
  strong {
    font-weight: normal;
    color: var(--font-color-default);
  }
}
p.p-txt:last-child {
  margin: 0;
}

.from-view {
  margin: 20px 0 35px;
  .tab-view {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 18px;
    span {
      line-height: 35px;
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
      text-align: center;
      color: var(--dex-color-4);
      background-color: transparent;
      cursor: pointer;
    }

    span.active {
      border: 1px solid var(--hover-bg-color);
      color: var(--font-color-default);
      background-color: var(--hover-bg-color);
    }
  }
  .from-item {
    margin-bottom: 18px;
    p {
      margin: 12px 0;
      color: var(--font-color-default);
    }
    .suffix-txt,
    .price-txt {
      color: var(--dex-color-4);
    }

    .price-txt {
      margin: 10px 0 0;
    }
    :deep(.el-slider) {
      width: 96%;
      margin: 0 auto;
    }
  }
  .market-items {
    margin-top: 6px;
    span {
      flex: 1;
      line-height: 30px;
      background: var(--hover-bg-color);
      margin-right: 1px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      color: var(--font-color-default);
    }
    span:active {
      background: var(--bg-color);
    }
  }
}
.stop-limit-btn {
  padding: 12px 19px;
  background-color: var(--font-color-default);
  color: var(--bg-color);
  height: 40px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  line-height: 1;
  outline: none;
  text-align: center;
  transition: 0.1s;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  align-items: center;
  margin-top: 20px;
}
</style>
