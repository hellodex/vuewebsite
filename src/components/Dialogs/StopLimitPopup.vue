<template>
  <van-popup
    v-model:show="popupVisible"
    round
    position="bottom"
    :style="{ height: '80%' }"
    closeable
    @close="handleClose"
  >
    <div class="stopLimit-view display-flex flex-direction-col justify-content-sp">
      <div class="display-flex flex-direction-col">
        <div class="sellLimit-title">止损</div>
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
                  chainConfigs.find((item: any) => item.chainCode == props.limitInfo.chainCode)
                    .symbol
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
      </div>
      <div class="stop-limit-btn" v-if="loading">
        <el-icon class="is-loading" :size="18">
          <Loading />
        </el-icon>
        <span>确认</span>
      </div>
      <div class="stop-limit-btn" v-else @click="handelConfirm">确认</div>
    </div>
  </van-popup>
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
import { showToast } from 'vant'
import { notificationInfo, notificationSuccessful, notificationFailed } from '@/utils/notification'

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
  stopLimitShowBottom: {
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
const popupVisible: any = computed({
  // getter
  get() {
    return props.stopLimitShowBottom
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
    showToast('请输入触发市值')
    return
  }
  if (tabIndex.value == 2 && isAllSpaces(priceValue.value)) {
    showToast('请输入触发价格')
    return
  }

  if (isAllSpaces(amount.value)) {
    showToast('请输入数量')
    return
  }

  notificationInfo({
    title: `${props.limitInfo.symbol}：止损`,
    customClass: 'notification-h5',
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
      message: `创建成功`,
      customClass: 'notification-h5'
    })
  } else {
    notificationFailed({
      title: `${props.limitInfo.symbol}：止损`,
      message: `${res.msg}`,
      customClass: 'notification-h5'
    })
  }
}
</script>

<style scoped lang="scss">
.stopLimit-view {
  padding: 12px;
  height: 100%;
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    box-shadow: 0 0 0 1px #e5e5e5 !important;
  }
  :deep(.el-input__inner) {
    color: #202020;
  }
  :deep(.el-slider) {
    width: 92%;
    margin: 0 auto;
    .el-slider__marks-text {
      font-size: 12px;
    }
    .el-slider__runway {
      background-color: #e5e5e5;
    }
    .el-slider__stop {
      background-color: #f2f2f2;
    }
    .el-slider__button {
      width: 12px;
      height: 12px;
    }
  }
  .sellLimit-title {
    color: #202020;
    font-size: 16px;
    margin-bottom: 8px;
    line-height: 2;
  }

  .coin-info {
    .logo {
      position: relative;
    }
    .logo,
    .logo-img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
    .chainCode {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      position: absolute;
      bottom: -1px;
      right: -1px;
    }
    .base-symbol {
      font-size: 14px;
      color: #202020;
      margin-left: 12px;
    }
    .symbol,
    .address-txt {
      color: #9c9c9c;
    }
    .copy {
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }
  }
  .text-info {
    padding: 10px 0;
  }

  p.p-txt {
    margin: 4px 0;
    span {
      color: #9c9c9c;
    }
    strong {
      font-weight: normal;
      color: #202020;
    }
  }
  p.p-txt:last-child {
    margin: 0;
  }

  .from-view {
    margin-bottom: 6px;
    .tab-view {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 18px;
      font-size: 14px;
      span {
        line-height: 28px;
        border: 1px solid #f2f2f2;
        border-radius: 4px;
        text-align: center;
        color: #202020;
        background-color: transparent;
        cursor: pointer;
      }

      span.active {
        border: #f2f2f2;
        background-color: #f2f2f2;
      }
    }
    .from-item {
      margin-bottom: 12px;
      p {
        margin: 6px 0;
        color: #202020;
      }
      .suffix-txt,
      .price-txt {
        color: #9c9c9c;
        font-size: 12px;
      }

      .price-txt {
        margin: 4px 0 0;
      }
    }
    .market-items {
      margin-top: 3px;
      span {
        flex: 1;
        line-height: 20px;
        background: #f2f2f2;
        margin-right: 1px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        color: #9c9c9c;
      }
    }
  }
  .stop-limit-btn {
    padding: 12px 19px;
    background-color: #202020;
    color: var(--font-color-default);
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
  }
}
</style>
