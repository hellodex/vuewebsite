<template>
  <div class="ai-signals">
    <div class="ai-signals-item" v-for="(item, index) in signalDataList" :key="index">
      <div class="coin-info">
        <div class="coin-type display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
<!--            <svg-icon name="pin" class="ai-icon"></svg-icon>-->
<!--            <svg-icon name="ai" class="ai-icon"></svg-icon>-->
            <svg-icon name="share" class="ai-icon" @click="handelShare(item)"></svg-icon>
          </div>
          <div class="display-flex align-items-center">
            <div class="coin-type-item display-flex align-items-center">
              <span>Mint权限</span>
              <el-icon class="check-mark" v-if="item.mintable == 2"><Check /></el-icon>
              <el-icon class="close-mark" v-else><Close /></el-icon>
            </div>
            <div class="coin-type-item display-flex align-items-center">
              <span>黑名单</span>
              <el-icon class="check-mark" v-if="item.blacklist == 2"><Check /></el-icon>
              <el-icon class="close-mark" v-else><Close /></el-icon>
            </div>
            <div class="coin-type-item display-flex align-items-center">
              <span>烧池子</span>
              <el-icon class="check-mark" v-if="item.burn == 2"><Check /></el-icon>
              <el-icon class="close-mark" v-else><Close /></el-icon>
            </div>
            <div class="coin-type-item display-flex align-items-center">
              <span>Top10</span>
              <strong
                >{{ item.top10Percent ? parseFloat(item.top10Percent).toFixed(2) : 0 }}%</strong
              >
            </div>
          </div>
        </div>
        <div class="coin-text display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center" @click.stop="handelTableRow(item)">
            <el-image :src="item.baseToken?.logo" alt="" class="logo"  >
              <template #error>
                <svg-icon name="logo1" class="logo"></svg-icon>
              </template>
            </el-image>
            <div class="display-flex flex-direction-col">
              <div class="display-flex align-items-center">
                <span class="symbol-txt">{{ item.baseToken?.symbol }}</span>
                <div class="display-flex align-items-center">
                  <svg-icon name="time" class="time-icon"></svg-icon>
                  <span class="time-label">创建时间</span>
                  <span class="time-value">{{ timeago(item.startTime * 1000) }}</span>
                </div>
              </div>
              <div class="address-txt display-flex align-items-center">
                <span>{{ shortifyAddress(item.baseToken?.address) }}</span>
                <svg-icon name="copy" class="copy" v-copy="item.baseToken?.address"></svg-icon>
              </div>
              <div class="display-flex align-items-center">
                <div class="price-txt display-flex align-items-center" style="margin-right: 24px">
                  <span>池子</span>
                  <strong>${{ numberFormat(item.tvl) }}</strong>
                </div>
                <div class="price-txt display-flex align-items-center">
                  <span>当天交易额</span>
                  <strong>${{ numberFormat(item.volume1d) }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="signal-box display-flex flex-direction-col justify-content-sp">

            <div class="num">{{ item.times }} 倍</div>
          </div>
        </div>
        <div class="kline-chart">
          <KlineChart :lineData="item.kcharts" @show="handleShowShareDialog" />
        </div>
      </div>
      <div class="push-box display-flex align-items-center justify-content-sp">
        <div class="push-txt">
          <i></i>
          <span>推送次数</span>
          <strong>{{ numberFormat(item.pushCount) }}</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入金额</span>
          <strong>${{ numberFormat(item.buyAmount) }}</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入地址</span>
          <strong>{{ numberFormat(item.buyAddressCount) }}</strong>
        </div>
        <div class="push-txt">
          <i></i>
          <span>买入次数</span>
          <strong>{{ numberFormat(item.buyCount) }}</strong>
        </div>
      </div>
      <div class="table-box">
        <div class="table-tr display-flex align-items-center">
          <span>时间</span>
          <span>价格</span>
          <span>市值</span>
          <span>持币地址</span>
          <span>前排聪明钱</span>
        </div>
        <div class="table-tr display-flex align-items-center">
          <span>第一次推送</span>
          <span>${{ numberFormat(item.firstPrice) }}</span>
          <span>{{ numberFormat(item.firstMarketCap) }}</span>
          <span>{{ numberFormat(item.firstHolder) }}</span>
          <span>{{ numberFormat(item.firstHolder) }}</span>
        </div>
        <div class="table-tr display-flex align-items-center">
          <span>当前</span>
          <span>${{ numberFormat(item.currentPrice) }}</span>
          <span>{{ numberFormat(item.currentMarketCap) }}</span>
          <span>{{ numberFormat(item.currentHolder) }}</span>
          <span>{{ numberFormat(item.currentHolder) }}</span>
        </div>
      </div>
      <div class="buy-sell-box">
        <div class="buy-box">
          <span
            v-for="item1 in buyList"
            :key="item1.value"
            @click="handelBuySell(item, item1.value, 'buy')"
            >{{ item1.label }}</span
          >
          <span @click="handelBuySell(item, amount, 'buy')">买入{{ numberFormat(amount) }}</span>
        </div>
        <div class="sell-box">
          <span
            v-for="item1 in sellList"
            :key="item1.value"
            @click="handelBuySell(item, item1.value, 'sell')"
            >{{ item1.label }}</span
          >
        </div>
        <WalletConnect v-if="!isConnected" class="mask" />
      </div>
    </div>
    <AiSignalsShareDialog
      :aiSignalsShareVisible="aiSignalsShareVisible"
      :aiSignalsShareData="aiSignalsShareData"
      v-if="aiSignalsShareVisible"
      @close="handleClose"
    />

    <van-popup v-model:show="dialogVisible" round class="activity-dialog" closeable>
      <div class="activity-title">聪明钱活动</div>
      <div class="activity-content">
        <p>第{{ pushData.num }}次推送 ({{ formatDate(pushData.pushTimeStamp) }})</p>
        <p class="display-flex align-items-center">
<!--          <svg-icon name="icon-clever" class="icon-clever"></svg-icon>-->
<!--          <span>0分钟内，聪明钱买入次数新增 {{ smartFlowData?.list?.length || 0 }} 次</span>-->
        </p>
        <div class="num-items display-flex align-items-center justify-content-sp">
          <div class="display-flex align-items-center">
            <span>总量</span>
            <strong>{{ numberFormat(smartFlowData?.totalAmount) }}</strong>
          </div>
          <div class="display-flex align-items-center">
            <span>总金额</span>
            <strong>${{ numberFormat(smartFlowData?.totalVolume) }}</strong>
          </div>
          <div class="display-flex align-items-center">
            <span>平均价格</span>
            <strong>${{ numberFormat(smartFlowData?.averagePrice) }}</strong>
          </div>
          <div class="display-flex align-items-center">
            <span>平均市值</span>
            <strong>${{ numberFormat(smartFlowData?.averageMarketCap) }}</strong>
          </div>
        </div>
        <el-table :data="smartFlowData?.list || []" style="width: 100%">
          <el-table-column label="时间" width="110">
            <template #default="scope">
              <span style="color: #f5f5f5">
                {{ formatHourMinSecDate(scope.row.txTime * 1000) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="聪明钱" width="230">
            <template #default="scope">
              <div class="activity-logo display-flex align-items-center">
                <el-image :src="scope.row.avatar" alt="" class="logo">
                  <template #error>
                    <svg-icon name="logo1" class="logo"></svg-icon>
                  </template>
                </el-image>
                <span>{{ scope.row.twitterName || shortifyAddress(scope.row.sender) }}</span>
                <svg-icon name="copy" class="copy" v-copy="scope.row.sender"></svg-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格">
            <template #default="scope">
              <span style="color: var(--up-color)">
                ${{ numberFormat(scope.row.price) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="市值">
            <template #default="scope">
              <span style="color: var(--up-color)">
                 ${{ numberFormat(scope.row.marketCap) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="交易量">
            <template #default="scope">
              <span style="color: var(--up-color)">
                {{ numberFormat(scope.row.baseAmount) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="金额">
            <template #default="scope">
              <span style="color: var(--up-color)">
                 ${{ numberFormat(scope.row.volume) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import {
  shortifyAddress,
  numberFormat,
  timeago,
  handleCoinPairInfo,
  formatHourMinSecDate,
  formatDate
} from '@/utils'
import { notificationInfo, notificationSuccessful, notificationFailed } from '@/utils/notification'
import { APIgetSmartKchart, APIgetSmartFlow } from '@/api'
import { APIauthTradeSwap } from '@/api/coinWalletDetails'
import { useGlobalStore } from '@/stores/global'
import { balanceFormat, resetAddress } from '@/utils/transition'
import BigNumber from 'bignumber.js'
import KlineChart from '@/components/Charts/KlineChart.vue'
import AiSignalsShareDialog from '@/components/Dialogs/AiSignalsShareDialog.vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import { socket } from '@/utils/socket'

const globalStore = useGlobalStore()

const tokenList = computed(() => globalStore.tokenList)
const customWalletInfo = computed(() => globalStore.customWalletInfo)
const isConnected = computed(() => globalStore.walletInfo.isConnected)
const socketConnectType = computed(() => globalStore.walletInfo.socketConnectType)

const dialogVisible = ref<boolean>(false)
const smartFlowData = ref<any>(null)
const pushData = ref<any>({})

const aiSignalsShareVisible = ref<boolean>(false)
const aiSignalsShareData = ref<any>({})
const account: any = localStorage.getItem('accountInfo')
const slippage = ref<any>(account ? JSON.parse(account).slippage : '0.03') // 滑点
const signalDataList = ref<any>([])

const buyInfo = ref<any>(null)
const sellInfo = ref<any>(null)
const pairInfo = ref<any>(null)
const handelTableRow = (row: any) => {
  handelJump(row)
}
const handelJump = (item: any) => {
  window.open(`/k/${item.pairAddress}?chainCode=${item.baseToken.chainCode}`)
}
defineProps({
  amount: {
    required: true,
    type: String
  }
})

const buyList = [
  {
    label: '0.1',
    value: '0.1'
  },
  {
    label: '0.5',
    value: '0.5'
  },
  {
    label: '1',
    value: '1'
  }
]

const sellList = [
  {
    label: '25%',
    value: '0.25'
  },
  {
    label: '50%',
    value: '0.5'
  },
  {
    label: '75%',
    value: '0.75'
  },
  {
    label: '100%',
    value: '1'
  }
]
const handelShare = (item: any) => {
  aiSignalsShareData.value = item
  aiSignalsShareVisible.value = true
}

const handleClose = (val: boolean) => {
  aiSignalsShareVisible.value = val
}

const initData = async () => {
  socket.off('smartKchart')
  socket.off('smartPush')
  const res = await APIgetSmartKchart()
  signalDataList.value = res || []

  socket.emit(
    'smartKchart-off',
    JSON.stringify({
      pair: signalDataList.value.map((item: { pairAddress: string }) => item.pairAddress)
    })
  )

  socket.emit(
    'smartKchart-on',
    JSON.stringify({
      pair: signalDataList.value.map((item: { pairAddress: string }) => item.pairAddress)
    })
  )

  socket.on('smartKchart', (message: string) => {
    const data = JSON.parse(message)
    signalDataList.value.forEach((item: any, index: number) => {
      if (data.pairAddress == item.pairAddress) {
        item.kcharts.push({
          C: data.currentPrice,
          time: data.time,
          timestamp: data.timeStamp * 1000,
          pushRecords: [],
          marketCap:data.currentMarketCap
        })

        item.currentPrice = data.currentPrice
        item.currentMarketCap = data.currentMarketCap
        item.currentHolder = data.currentHolder
        item.currentTvl = data.currentTvl || 0
      }
    })
  })

  socket.on('smartPush', (message: string) => {
    const data = JSON.parse(message)
    console.log(`smartPush:`, data)
    signalDataList.value.forEach((item: any) => {
      if (data.pairAddress == item.pairAddress) {
        item.kcharts.at(-1).pushRecords.push(data)
        console.log('smartPushItem:', item.kcharts.at(-1))
      }
    })
  })
}

watch(socketConnectType, () => {
  if (socketConnectType.value == 'socket_connect' && signalDataList.value?.length > 0) {
    socket.emit(
      'smartKchart-off',
      JSON.stringify({
        pair: signalDataList.value.map((item: { pairAddress: string }) => item.pairAddress)
      })
    )
    socket.emit(
      'smartKchart-on',
      JSON.stringify({
        pair: signalDataList.value.map((item: { pairAddress: string }) => item.pairAddress)
      })
    )
  }
})

const handelBuySell = (item: any, amount: string, type: string) => {
  const coinInfo = getCoinInfo(item)

  buyInfo.value = coinInfo.buyCoin
  sellInfo.value = coinInfo.sellCoin
  pairInfo.value = {
    tvl: item.currentTvl || 0,
    circulationVol: item.currentMarketCap || 0,
    price: item.currentPrice || 0
  }
  const tokenData: any = tokenList.value

  if (sellInfo.value.baseAddress) {
    const obj = tokenData?.find(
      (item: { address: any }) => item.address == sellInfo.value.baseAddress
    )
    sellInfo.value.balance = obj?.amount || 0
    sellInfo.value.totalAmount = obj?.totalAmount || 0
  }
  if (buyInfo.value.baseAddress) {
    const obj = tokenData?.find(
      (item: { address: any }) => item.address == buyInfo.value.baseAddress
    )
    buyInfo.value.balance = obj?.amount || 0
    buyInfo.value.totalAmount = obj?.totalAmount || 0
  }

  console.log('buyInfo', buyInfo.value)
  console.log('sellInfo', sellInfo.value)

  if (type == 'buy') {
    handelCustomTradeSwap(buyInfo.value, sellInfo.value, amount, type)
  } else {
    handelCustomTradeSwap(sellInfo.value, buyInfo.value, amount, type)
  }
}

const handelCustomTradeSwap = async (
  selectSellCoin: any,
  selectBuyCoin: any,
  amount: string,
  type: string
) => {
  notificationInfo({
    title: `${sellInfo.value.baseSymbol}：${type == 'buy' ? '买入' : '卖出'}处理中`,
    message: `<div class="display-flex align-items-center notification-box">
                <span class='notification-txt'>${type == 'buy' ? '买入' : '卖出'}</span>
                <span class=${type == 'buy' ? 'up-color' : 'down-color'}>${type == 'buy' ? numberFormat(amount) + ' ' + buyInfo.value.baseSymbol : numberFormat(balanceFormat(sellInfo.value) * Number(amount)) + ' ' + sellInfo.value.baseSymbol}</span>
                <i></i>
                <span class='notification-txt'>成交市值</span>
                <span class='up-color'>${numberFormat(pairInfo.value.circulationVol)}</span>
                </div>
              <div class=${type == 'buy' ? 'notification-step-line-up' : 'notification-step-line-down'}></div>
              `
  })

  let spendAmount: any = 0
  if (type == 'buy') {
    const num = 10 ** Number(buyInfo.value.baseTokenDecimals)
    spendAmount = new BigNumber(amount).times(num).integerValue(BigNumber.ROUND_DOWN)
  } else {
    spendAmount =
      Number(amount) === 1
        ? sellInfo.value.balance
        : Math.floor(sellInfo.value.balance * Number(amount))
  }

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
    price: pairInfo.value.price,
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
                        <span class='up-color'>${numberFormat(pairInfo.value.circulationVol)}</span>
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
                        <span class='up-color'>${numberFormat(pairInfo.value.circulationVol)}</span>
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

const getCoinInfo = (params: any) => {
  return handleCoinPairInfo({
    logo: params.baseToken.logo,
    baseAddress: params.baseToken.address,
    quoteAddress: params.quoteToken.address,
    baseSymbol: params.baseToken.symbol,
    quoteSymbol: params.quoteToken.symbol,
    baseDecimal: params.baseToken.decimals,
    quoteDecimal: params.quoteToken.decimals,
    chainCode: params.baseToken.chainCode
  })
}

const handleShowShareDialog = async (val: any) => {
  smartFlowData.value = {}
  dialogVisible.value = true
  pushData.value = val
  const res = await APIgetSmartFlow({
    pushId: pushData.value.id
  })
  console.log(res)
  smartFlowData.value = res || {}
}
onMounted(() => {
  initData()
})
</script>

<style lang="scss" scoped>
.ai-signals {
  padding: 10px 0 25px;
  width: 100%;
  background-color: var(--bg-color);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  .ai-signals-item {
    min-width: 0;
    border-radius: 12px;
    background: rgba(23, 24, 27, 0.3);
    line-height: 1.2;
  }
  .coin-type {
    padding: 15px 15px;
    color: #f5f5f5;
    font-size: 14px;
    .ai-icon {
      width: 18px;
      height: 18px;
      color: #fff;
      margin-right: 8px;
      cursor: pointer;
    }
    strong {
      color: var(--down-color);
      margin-left: 6px;
    }
    .check-mark {
      font-size: 14px;
      margin-left: 2px;
      color: var(--up-color);
    }
    .close-mark {
      font-size: 14px;
      margin-left: 2px;
      color: var(--down-color);
    }
    .coin-type-item {
      margin-left: 9px;
      font-size: 12px;
      span {
        white-space: nowrap;
      }
    }
  }
  .coin-text {
    padding: 8px 16px;
    border-top: 1px solid #1f2225;
    border-bottom: 1px solid #1f2225;
    .logo {
      width: 48px;
      cursor: pointer;
      height: 48px;
      margin-right: 8px;
      border-radius: 50%;
    }
    .symbol-txt {
      color: #fff;
      font-size: 14px;
      margin-right: 4px;
    }
    .time-icon {
      width: 13px;
      height: 13px;
      color: #71777a;
      margin-right: 2px;
    }
    .time-label {
      color: #71777a;
      font-size: 11px;
    }
    .time-value {
      font-size: 11px;
      color: var(--up-color);
      margin-left: 4px;
    }
    .address-txt {
      color: #e8e8e8;
      font-size: 11px;
      margin: 6px 0;
      .copy {
        width: 10px;
        height: 10px;
        cursor: pointer;
        margin-left: 3px;
      }
    }
    .price-txt {
      color: #71777a;
      font-size: 11px;
      white-space: nowrap;
      strong {
        color: #b4b4b4;
        margin-left: 4px;
      }
    }
    .signal-box {
      .signal-txt {
        padding: 8px 4px;
      }
      span {
        color: #f5f5f5;
        font-size: 13px;
        margin-right: 6px;
      }
      i {
        display: block;
        width: 2px;
        background-color: #d9d9d9;
        margin-right: 1.5px;
        border-radius: 1.5px;
      }

      i:nth-child(1) {
        height: 4px;
      }
      i:nth-child(2) {
        height: 6px;
      }
      i:nth-child(3) {
        height: 8px;
      }
      i:nth-child(4) {
        height: 11px;
        margin-right: 0;
      }

      .num {
        display: flex;

        height: 28px;
        padding: 10px 10px;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        background:rgba(9, 182, 120, 0.16);
        color: var(--up-color);
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
  .kline-chart {
    height: 200px;
    padding: 8px 8px;
  }
  .push-box {
    margin: 10px 0px;
    padding: 0 16px;
    font-size: 11px;
    .push-txt {
      display: flex;
      align-items: center;
      i {
        width: 4px;
        height: 4px;
        display: block;
        background-color: var(--up-color);
        border-radius: 50%;
      }
      span {
        color: #71777a;
        padding: 4px;
        margin: 0 2px;
        white-space: nowrap;
      }
      strong {
        color: #b4b4b4;
      }
    }
  }
  .table-box {
    padding: 0 16px;
    .table-tr {
      background: #1b1b1b;
      border-bottom: 1px solid rgba(23, 24, 27, 0.3);
      padding: 12px;
      font-size: 12px;
      span {
        flex: 1;
        color: #737373;
      }
    }

    .table-tr:nth-child(1) {
      border-radius: 6px 6px 0 0;
    }
    .table-tr:nth-child(3) {
      border-radius: 0 0 6px 6px;
    }
  }
  .buy-sell-box {
    padding: 0 16px;
    margin-top: 16px;
    font-size: 13px;
    font-family: 'PingFangSC-Medium';
    position: relative;
    :deep(.mask) {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
    .buy-box {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 10px;
      margin-bottom: 5px;
      span {
        min-width: 0;
        height: 30px;
        border-radius: 6px;
        background: rgba(9, 182, 120, 0.16);
        cursor: pointer;
        color: var(--up-color);
        text-align: center;
        line-height: 30px;
      }
    }
    .sell-box {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 10px;
      span {
        min-width: 0;
        height: 30px;
        border-radius: 6px;
        background: rgba(239, 88, 88, 0.16);
        cursor: pointer;
        color: var(--down-color);
        text-align: center;
        line-height: 30px;
      }
    }
  }
  .activity-dialog {
    width: 730px;
    border-radius: 12px;
    background: #181818;
    padding: 18px;
    .activity-title {
      color: #eaecf5;
      font-size: 20px;
      line-height: 1;
    }
    .activity-content {
      padding-top: 24px;
      p {
        font-size: 12px;
        color: #eaecf5;
        margin-bottom: 12px;
      }
      .icon-clever {
        width: 16px;
        height: 16px;
      }
      .num-items {
        margin: 20px 0;
        font-size: 14px;
        span {
          color: #8b8e96;
          margin-right: 4px;
        }

        strong {
          color: var(--up-color);
        }
      }
    }
    .activity-logo {
      .logo {
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }
      span {
        margin: 0 4px;
        color: #f5f5f5;
      }
      .copy {
        width: 12px;
        height: 12px;
        cursor: pointer;
      }
    }
  }
}
</style>
