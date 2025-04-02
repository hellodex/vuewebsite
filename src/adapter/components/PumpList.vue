<template>
  <div class="pump-box">
    <div class="pump-table">
      <div class="pump-list" v-for="(value, key, index) in pumpObj" :key="index">
        <div class="pump-list-title display-flex align-items-center justify-content-sp">
          <div v-if="index == 0" class="display-flex align-items-center">
            🌱 新创建
            <span class="pause-txt" v-if="curNode == 1">⏸ 已暂停</span>
          </div>
          <div v-if="index == 1" class="display-flex align-items-center">
            ⏳ 即将打满
            <span class="pause-txt" v-if="curNode == 2">⏸ 已暂停</span>
          </div>
          <div v-if="index == 2" class="display-flex align-items-center">
            ✨ 新外盘
            <span class="pause-txt" v-if="curNode == 3">⏸ 已暂停</span>
          </div>
        </div>
        <el-scrollbar height="calc(100vh - 213px)">
          <div
            class="pump-list-items"
            @mouseover="handleMouseOver(index)"
            @mouseleave="handleMouseLeave(index)"
          >
            <el-skeleton style="width: 100%" :loading="skeletonLoading" animated>
              <template #template>
                <div
                  class="display-flex align-items-center justify-content-sp"
                  style="width: 100%; padding: 15px 10px"
                  v-for="item in 14"
                  :key="item"
                >
                  <div class="display-flex align-items-center">
                    <el-skeleton-item
                      variant="circle"
                      style="width: 56px; height: 56px; margin-right: 8px"
                    />
                    <div
                      class="display-flex flex-direction-col justify-content-sp"
                      style="height: 56px"
                    >
                      <el-skeleton-item variant="text" style="width: 80px; height: 16px" />
                      <el-skeleton-item variant="text" style="width: 60%; height: 12px" />
                      <el-skeleton-item variant="text" style="width: 120px; height: 14px" />
                    </div>
                  </div>
                  <div
                    class="display-flex flex-direction-col align-items-fd justify-content-sp"
                    style="height: 56px"
                  >
                    <el-skeleton-item variant="text" style="width: 30px; height: 18px" />
                    <el-skeleton-item variant="text" style="width: 120px; height: 22px" />
                  </div>
                </div>
              </template>
              <template #default>
                <div
                  class="pump-list-item display-flex align-items-center justify-content-sp"
                  v-for="(item, idx) in value"
                  :key="idx"
                  @click="handelTableRow(item)"
                >
                  <div class="display-flex align-items-fs">
                    <div
                      class="progress-circle"
                      :style="{
                        background: `conic-gradient(#20B26C 0% ${numToFixedTwo(parseFloat(item.percent || '0'))}%, rgba(32, 178, 108, 0.30) ${((item.percent || 0) * 100).toFixed(2)}% 100%)`
                      }"
                    >
                      <div class="logo">
                        <el-image :src="item.logo" alt="" class="coin-icon">
                          <template #error>
                            <svg-icon name="logo1" class="coin-icon"></svg-icon>
                          </template>
                        </el-image>
                        <!-- <img :src="chainLogoObj[item.baseToken.chainCode]" alt="" class="chainCode" /> -->
                      </div>
                    </div>
                    <div class="display-flex flex-direction-col">
                      <div class="coin-text display-flex align-items-fd">
                        <p class="display-flex align-items-center">
                          <span class="base-symbol">{{ item.baseToken?.symbol || '-' }}</span>
                          <span class="tokens—after">/{{ item.quoteToken?.symbol || '-' }}</span>
                        </p>
                        <p class="display-flex align-items-fd address">
                          <span>{{ shortifyAddress(item.baseToken.address) }}</span>
                          <svg-icon
                            name="copy"
                            class="copy"
                            v-copy="item.baseToken.address"
                          ></svg-icon>
                        </p>
                        <Favorite
                          :coinInfo="{
                            pairAddress: item.pairAddress,
                            chainCode: item.baseToken.chainCode
                          }"
                        />
                      </div>
                      <div class="time-icon-url display-flex align-items-center">
                        <p class="display-flex align-items-center">
                          <svg-icon name="clock-timer" class="clock-timer"></svg-icon>
                          <span class="clock-timer-txt">{{ timeago(item.createTime * 1000) }}</span>
                        </p>
                        <span class="line"></span>
                        <p class="display-flex align-items-center">
                          <span @click.stop="handelRouter(item.twitter)" v-if="item.twitter">
                            <svg-icon name="twitter-pump" class="icon-url"></svg-icon>
                          </span>
                          <span @click.stop="handelRouter(item.website)" v-if="item.website">
                            <svg-icon name="website-pump" class="icon-url"></svg-icon>
                          </span>
                          <span @click.stop="handelRouter(item.telegram)" v-if="item.telegram">
                            <svg-icon name="telegram-pump" class="icon-url"></svg-icon>
                          </span>
                        </p>
                      </div>
                      <div class="display-flex align-items-center">
                        <div class="display-flex align-items-center percent-txt">
                          <svg-icon name="icon-percent" class="icon-percent"></svg-icon>
                          <span>{{ numToFixedTwo(parseFloat(item.percent || '0')) }}%</span>
                        </div>
                        <span class="num-txt">MC ${{ numberFormat(item.marketCap) }}</span>
                        <el-popover popper-class="pump-popper-box" :teleported="false">
                          <template #reference>
                            <span class="num-txt">Txs {{ numberFormat(item.totalCount) }}</span>
                          </template>
                          <template #default>
                            <div class="display-flex flex-direction-col">
                              <span class="count-title">交易数:</span>
                              <p class="count-txt">
                                <span class="up-color">{{ numberFormat(item.buyCount) }}</span>
                                <span class="line"> / </span>
                                <span class="down-color">{{ numberFormat(item.sellCount) }}</span>
                              </p>
                            </div>
                          </template>
                        </el-popover>
                        <el-popover popper-class="pump-popper-box" :teleported="false">
                          <template #reference>
                            <span class="num-txt">V ${{ numberFormat(item.totalVolume) }}</span>
                          </template>
                          <template #default>
                            <div class="display-flex flex-direction-col">
                              <span class="count-title">交易额:</span>
                              <p class="count-txt">
                                <span class="up-color">{{ numberFormat(item.buyVolume) }}</span>
                                <span class="line"> / </span>
                                <span class="down-color">{{ numberFormat(item.sellVolume) }}</span>
                              </p>
                            </div>
                          </template>
                        </el-popover>
                      </div>
                    </div>
                  </div>
                  <div class="operate display-flex flex-direction-col align-items-fd">
                    <span class="price-txt"><i>$</i>{{ numberFormat(item.price || 0) }}</span>
                    <div class="display-flex align-items-center justify-content-fd">
                      <WalletConnect v-if="!isConnected">
                        <div class="trade-operate-btn">
                          <span class="txt">挂单交易</span>
                        </div>
                      </WalletConnect>
                      <div class="trade-operate-btn" @click.stop="handelTrade(item)" v-else>
                        <span class="txt">挂单交易</span>
                      </div>
                      <WalletConnect v-if="!isConnected">
                        <div class="buy-operate-btn">
                          <span class="txt"
                            >买入 {{ amount && amount !== '0' ? numberFormat(amount) : '' }}</span
                          >
                        </div>
                      </WalletConnect>
                      <QuickBuyTrade :info="item" :amount="amount" v-else
                        >买入
                        {{ amount && amount !== '0' ? numberFormat(amount) : '' }}</QuickBuyTrade
                      >
                    </div>
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <TradeDraw
      :coinInfo="coinInfo"
      :pairInfo="pairInfo"
      :tradeDrawVisible="tradeDrawVisible"
      @close="handleDrawClose"
      v-if="tradeDrawVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive, onActivated, onDeactivated } from 'vue'
import { ApiGetPumpRanking } from '@/api'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/global'
import { numberFormat, timeago, handleCoinPairInfo, shortifyAddress, numToFixedTwo } from '@/utils'

import TradeDraw from '@/components/Dialogs/TradeDraw.vue'
import WalletConnect from '@/components/Wallet/WalletConnect.vue'
import QuickBuyTrade from './QuickBuyTrade.vue'
import Favorite from '@/components/Favorite.vue'
import { socket } from '@/utils/socket'

defineProps({
  amount: {
    required: true,
    type: String
  }
})

const i18n = useI18n()
const globalStore = useGlobalStore()

const isConnected = computed(() => globalStore.walletInfo.isConnected)

const skeletonLoading = ref<boolean>(false)

const pumpObj = reactive<Record<string, any>>({
  list1: [],
  list2: [],
  list3: []
})

const dataTimer1 = ref<any>(null)
const dataTimer2 = ref<any>(null)
const dataTimer3 = ref<any>(null)
const curNode = ref<number>(0)
const tradeDrawVisible = ref<boolean>(false)
const coinInfo = ref<any>(null)
const pairInfo = ref<any>(null)

const pumpRankingFun = () => {
  socket.off('pumpRanking')
  socket.on('pumpRanking', (message: string) => {
    const data = JSON.parse(message)
    console.log(`pumpRanking:`, data)
    switch (data.type) {
      case 1:
        pumpObj.list1 = data.ranking
        break
      case 2:
        pumpObj.list2 = data.ranking
        break
      case 3:
        pumpObj.list3 = data.ranking
        break
      default:
        break
    }
  })
}

const getPumpRanking = async (type: number) => {
  const res: any = await ApiGetPumpRanking({
    type
  })
  const arr = res?.ranking || []
  switch (type) {
    case 1:
      pumpObj.list1 = arr
      break
    case 2:
      pumpObj.list2 = arr
      break
    case 3:
      pumpObj.list3 = arr
      break
    default:
      break
  }
}

const setPolling1 = () => {
  dataTimer1.value = setInterval(() => {
    pumpObj.list1 = [...pumpObj.list1]
  }, 1000)
}
const setPolling2 = () => {
  dataTimer2.value = setInterval(() => {
    pumpObj.list2 = [...pumpObj.list2]
  }, 1000)
}
const setPolling3 = () => {
  dataTimer3.value = setInterval(() => {
    pumpObj.list3 = [...pumpObj.list3]
  }, 1000)
}

const handelTrade = (row: any) => {
  coinInfo.value = handleCoinPairInfo({
    logo: row.logo,
    baseAddress: row.baseToken.address,
    quoteAddress: row.quoteToken.address,
    baseSymbol: row.baseToken.symbol,
    quoteSymbol: row.quoteToken.symbol,
    baseDecimal: row.baseToken.decimals,
    quoteDecimal: row.quoteToken.decimals,
    chainCode: row.baseToken.chainCode
  })

  pairInfo.value = {
    tvl: row.tvl || 0,
    circulationVol: row.marketCap || 0,
    price: row.price || 0
  }

  tradeDrawVisible.value = true
}

const handleDrawClose = () => {
  tradeDrawVisible.value = false
}

const handelTableRow = (row: any) => {
  handelJump(row)
}
const handelJump = (item: any) => {
  window.open(`/k/${item.pairAddress}?chainCode=${item.baseToken.chainCode}`)
}

const handelRouter = (url: string) => {
  console.log(url)
  window.open(url)
}

const handleMouseOver = (index: number) => {
  curNode.value = index + 1
  socket.off('pumpRanking')
  // if (curNode.value == 1) {
  //   socket.off('pumpRanking')
  // } else if (curNode.value == 2) {
  //   socket.off('pumpRanking')
  // } else if (curNode.value == 3) {
  //   socket.off('pumpRanking')
  // }
}

const handleMouseLeave = (index: number) => {
  curNode.value = 0
  pumpRankingFun()
  // if (index == 0) {
  //   pumpRankingFun()
  // } else if (index == 1) {
  //   pumpRankingFun()
  // } else if (index == 2) {
  //   pumpRankingFun()
  // }
}

const initData = async () => {
  getPumpRanking(1)
  getPumpRanking(2)
  getPumpRanking(3)
}

const startTimer = () => {
  setPolling1()
  setPolling2()
  setPolling3()
}

const stopTimer = () => {
  clearInterval(dataTimer1.value)
  clearInterval(dataTimer2.value)
  clearInterval(dataTimer3.value)
  dataTimer1.value = null
  dataTimer2.value = null
  dataTimer3.value = null
}

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  stopTimer()
  console.log('stopTimer')
})

onMounted(async () => {
  skeletonLoading.value = true
  await initData()
  skeletonLoading.value = false
  pumpRankingFun()
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped lang="scss">
.pump-tab {
  padding-bottom: 16px;
  position: sticky;
  background-color: var(--bg-color);
  top: 50px;
  z-index: 9;
  span {
    height: 34px;
    padding: 0 10px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    margin-right: 10px;
    line-height: 1.2;
    cursor: pointer;
    transition: all 0.1s;
    background-color: transparent;
    color: #828282;
    white-space: nowrap;
  }
  span:hover,
  .active {
    color: var(--font-color-default);
    background-color: var(--hover-bg-color);
  }
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
}

.pump-table {
  border-radius: 12px;
  padding-top: 10;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  .pump-list {
    padding: 12px 0px;
    border-radius: 12px;
    background: rgba(23, 24, 27, 0.3);
    .pump-list-title {
      padding: 0px 16px 8px 16px;
      color: #f5f5f5;
      font-family: 'PingFangSC-Medium';
      font-size: 16px;
      .pause-txt {
        padding: 1px 5px;
        margin-left: 8px;
        border-radius: 4px;
        font-size: 12px;
        color: #ffec42;
        background-color: #595000;
        font-family: 'PingFangSC-Medium';
      }
    }
    .pump-list-item {
      padding: 16px;
      border-bottom: 1px solid rgba(38, 40, 44, 0.3);
      cursor: pointer;
    }
    .coin-text {
      line-height: 1;
    }
    .progress-circle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: conic-gradient(#20b26c 0% 0%, rgba(32, 178, 108, 0.3) 0% 100%);
      position: relative;
      transition: background 0.5s;
      margin-right: 8px;
    }
    .progress-circle::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 89%;
      height: 89%;
      background: #222222;
      border-radius: 50%;
    }
    .logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 89%;
      height: 89%;
      border-radius: 50%;
    }
    .coin-icon {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: block;
    }
    .chainCode {
      width: 16px;
      height: 16px;
      position: absolute;
      right: -1px;
      bottom: 0px;
    }
    .base-symbol,
    .tokens—after {
      color: #f5f5f5;
      font-family: 'PingFangSC-Medium';
      font-size: 14px;
    }
    .address {
      margin: 0 4px;
      font-family: 'PingFangSC-Medium';
      font-size: 12px;
      color: #9aa0aa;
    }
    .copy {
      width: 12px;
      height: 12px;
      cursor: pointer;
      display: block;
      margin-left: 2px;
    }
    :deep(.favorite-box) {
      margin-left: 0px;
      .star-o-icon {
        width: 12px;
        height: 12px;
        margin-right: 0;
      }
      .star-icon {
        width: 12px;
        height: 12px;
        margin-right: 0;
      }
    }
    .time-icon-url {
      margin: 4px 0;
      .line {
        height: 12px;
        width: 1px;
        background-color: #222;
        margin: 0 8px;
      }
      .clock-timer-txt {
        color: var(--up-color);
        font-size: 10px;
      }
      .clock-timer,
      .flash-trade {
        width: 12px;
        height: 12px;
        margin-right: 2px;
      }
      .icon-url {
        width: 12px;
        height: 12px;
        margin-right: 4px;
        display: block;
        color: #9aa0aa;
      }
    }
    .percent-txt {
      color: var(--up-color);
      font-size: 10px;
      font-family: 'PingFangSC-Medium';
    }
    .num-txt {
      margin-left: 8px;
      color: #9aa0aa;
      font-size: 10px;
      white-space: nowrap;
    }
    :deep(.pump-popper-box) {
      width: auto !important;
      min-width: 120px;
      padding: 8px 20px;
      background-color: #26282c !important;
      color: var(--font-color-default) !important;
      border: 1px solid #26282c !important;
      border-radius: 4px !important;
      .el-popper__arrow:before {
        top: 0;
        background-color: #26282c !important;
        border: 1px solid #26282c !important;
      }
    }

    .count-txt {
      font-size: 14px;
      font-family: 'PingFangSC-Medium';
      .count-title {
        font-size: #81868c;
        font-size: 12px;
      }
      .line {
        color: #f5f5f5;
      }
    }
    .icon-percent {
      width: 12px;
      height: 12px;
      margin-right: 2px;
    }
    .price-txt {
      color: #f5f5f5;
      font-family: 'PingFangSC-Medium';
      font-size: 14px;
      margin-bottom: 8px;
      i {
        font-style: normal;
        font-size: 10px;
        font-family: 'PingFangSC-Regular';
      }
    }
    .trade-operate-btn {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 16px;
      border: 1px solid #222;
      font-size: 12px;
      cursor: pointer;
      span {
        white-space: nowrap;
        color: #848e9c;
        font-family: 'PingFangSC-Medium';
      }
    }
    .buy-operate-btn {
      margin-left: 6px;
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 16px;
      background: rgba(46, 189, 133, 0.1);
      .txt {
        color: var(--up-color);
        font-size: 12px;
        white-space: nowrap;
        font-family: 'PingFangSC-Medium';
      }
    }
    .operate {
      :deep(.operate-btn) {
        margin-left: 6px;
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 16px;
        background: rgba(46, 189, 133, 0.1);
        height: auto;
        .txt {
          color: var(--up-color);
          font-size: 12px;
          white-space: nowrap;
          font-family: 'PingFangSC-Medium';
        }
        .icon-buy {
          display: none;
        }
      }
    }
  }

  :deep(.connect-wallet-btn) {
    padding: 0;
    background-color: transparent;
    min-width: auto;
  }

  .audit-text {
    justify-content: center;
    .audit-text-item {
      margin-right: 14px;
    }
    .audit-text-item:last-child {
      margin-right: 0;
    }
    span {
      margin-top: 5px;
      color: var(--font-color-default);
      font-size: 12px;
    }
  }
}
:deep(.el-drawer__title) {
  color: var(--font-color-default);
}
</style>
