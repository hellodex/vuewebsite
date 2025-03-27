<template>
  <el-scrollbar
    :height="`calc(100vh - 104px)`"
    class="scrollbar-box"
    :style="{ position: 'relative', top: `${currencyDashboardSwitch ? '-56px' : '0px'}` }"
  >
    <aside class="right-layout">
      <el-skeleton style="width: 100%" :loading="props.loadRightSideBar" animated :rows="28">
        <div class="pond-main">
          <div class="publicize-main align-items-center justify-content-sp">
            <div class="publicize-content">
              <div class="display-flex align-items-center">
                <span class="txt">宣传代币 就在HelloDex</span>
              </div>
              <a href="https://t.me/HelloDex_cn" target="_blank" class="arrow-down-info">
                <span>点击免费收录</span>
              </a>
            </div>
            <div class="menu-box display-flex">
              <div class="menu-item" @click.stop="handelRouter(baseInfo?.tokenInfo?.twitter)">
                <svg-icon name="x" class="x-icon menu-icon"></svg-icon>
              </div>
              <div class="menu-item" @click.stop="handelRouter(baseInfo?.tokenInfo?.website)">
                <svg-icon name="website-pump" class="website-pump menu-icon"></svg-icon>
              </div>
              <div class="menu-item" @click.stop="handelRouter(baseInfo?.tokenInfo?.telegram)">
                <svg-icon name="tg-app" class="menu-icon"></svg-icon>
              </div>
              <a
                :href="`https://x.com/search?q=${baseInfo.tokenInfo?.baseSymbol}`"
                target="_blank"
                class="menu-item"
              >
                <svg-icon name="x" class="x-icon menu-icon"></svg-icon>
                <span>搜索名称</span>
              </a>
              <a
                :href="`https://x.com/search?q=${props.baseInfo.tokenInfo?.baseAddress}`"
                target="_blank"
                class="menu-item"
              >
                <svg-icon name="x" class="x-icon menu-icon"></svg-icon>
                <span>搜索合约</span>
              </a>
            </div>
            <img src="@/assets/img/rocket-logo.svg" alt="" class="rocket-logo" />
          </div>
          <div class="pond-info">
            <div class="pond-info-item display-flex align-items-center justify-content-sp">
              <div
                class="flex-1 display-flex flex-direction-col snipe-text"
                @click="sniperDialogVisible = true"
              >
                <div class="display-flex align-items-center margin-element">
                  <span>狙击者</span>
                  <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
                </div>
                <div class="display-flex align-items-center">
                  <svg-icon name="snipe-icon" class="snipe-icon"></svg-icon>
                  <span class="font-family-Heavy snipe-num"
                    >{{
                      earliest100TraderData?.traders?.filter((item: any) => item.sniper)?.length ||
                      0
                    }}/{{ earliest100TraderData?.traders?.length || 0 }}</span
                  >
                </div>
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-center">
                <span>总市值</span>
                <strong>${{ numberFormat(props.pairInfo?.circulationVol || 0) }}</strong>
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-center">
                <span>{{ i18n.t('kChart.Vol1D') }}</span>
                <strong>${{ numberFormat(props.pairInfo.tradeTvl) }}</strong>
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-fd">
                <span>持币人</span>
                <strong>{{
                  numberFormat(props.holdingCoinsTabInfo?.topHolders?.holds || 0)
                }}</strong>
              </div>
            </div>
          </div>
          <div class="pond-info">
            <div class="pond-info-item display-flex flex-direction-col" style="padding: 6px 10px">
              <div
                class="flex-1 display-flex align-items-center justify-content-sp"
                style="padding: 0"
              >
                <span class="color-1">{{ baseInfo.tokenInfo?.baseSymbol }}</span>
                <strong
                  >{{ numberFormat(pairInfo.baseAmount || 0) }} ${{
                    numberFormat((pairInfo.baseAmount || 0) * (pairInfo.basePrice || 0))
                  }}</strong
                >
              </div>
              <div
                class="flex-1 display-flex align-items-center justify-content-sp"
                style="margin: 4px 0"
              >
                <span class="color-1">{{ baseInfo.tokenInfo?.quoteSymbol }}</span>
                <strong
                  >{{ numberFormat(pairInfo.quoteAmount || 0) }} ${{
                    numberFormat((pairInfo.quoteAmount || 0) * (pairInfo.quotePrice || 0))
                  }}</strong
                >
              </div>
              <div
                class="flex-1 display-flex align-items-center justify-content-sp"
                style="padding: 0"
              >
                <span class="color-1">开盘时间</span>
                <strong>{{ formatLineDate((pairInfo.startTime || 0) * 1000) }}</strong>
              </div>
            </div>
          </div>
          <div class="pond-time display-flex align-items-center justify-content-sp">
            <div class="flex-1 display-flex flex-direction-col align-items-center">
              <span class="color-1">5m</span>
              <PercentageNotbg :value="props.pairInfo.chg5m || 0" />
            </div>
            <div class="flex-1 display-flex flex-direction-col align-items-center">
              <span class="color-1">1h</span>
              <PercentageNotbg :value="props.pairInfo.chg1h || 0" />
            </div>
            <div class="flex-1 display-flex flex-direction-col align-items-center">
              <span class="color-1">4h</span>
              <PercentageNotbg :value="props.pairInfo.chg4h || 0" />
            </div>
            <div class="flex-1 display-flex flex-direction-col align-items-center">
              <span class="color-1">当天</span>
              <PercentageNotbg :value="props.pairInfo.chg1d || 0" />
            </div>
          </div>
          <div class="transaction-box">
            <template v-if="walletType == 'Email'">
              <div class="display-flex align-items-center justify-content-sp coin-info-main">
                <div class="display-flex align-items-center justify-content-sp coin-info">
                  <div class="display-flex align-items-center">
                    <el-image :src="props.baseInfo.tokenInfo?.logo" alt="" class="coin-icon">
                      <template #error>
                        <svg-icon name="logo1" class="coin-icon"></svg-icon>
                      </template>
                    </el-image>
                    <span>{{ shortifyAddress(props.baseInfo.tokenInfo?.baseAddress) }}</span>
                  </div>
                  <div class="display-flex align-items-center">
                    <el-image :src="props.baseInfo.tokenInfo?.quoteLogo" alt="" class="chainCode">
                      <template #error>
                        <svg-icon name="logo1" class="chainCode"></svg-icon>
                      </template>
                    </el-image>
                    <span class="price-txt">{{
                      childrenRef && numberFormat(balanceFormat(childrenRef.buyInfo))
                    }}</span>
                  </div>
                </div>
                <a target="_blank" href="https://t.me/HelloDex_cn" class="icon-add">
                  <el-icon :size="16"><Plus /></el-icon>
                </a>
              </div>
              <div class="display-flex align-items-center justify-content-sp coin-hold">
                <div class="display-flex flex-direction-col">
                  <span>{{ props.baseInfo.tokenInfo?.baseSymbol }} 余额</span>
                  <strong
                    >${{ numberFormat(props.currentTokenHoldInfo?.volume) }}({{
                      numberFormat(props.currentTokenHoldInfo?.amount)
                    }})</strong
                  >
                </div>
                <div class="display-flex flex-direction-col align-items-center">
                  <span>总买入</span>
                  <strong>${{ numberFormat(props.currentTokenHoldInfo?.totalBuyVolume) }}</strong>
                </div>
                <div class="display-flex flex-direction-col align-items-fd">
                  <span>未实现利润</span>
                  <strong
                    :class="
                      props.currentTokenHoldInfo?.totalEarnRate?.[0] === '-'
                        ? 'down-color'
                        : 'up-color'
                    "
                    >${{ numberFormat(props.currentTokenHoldInfo?.totalEarn) }}(<PercentageNotbg
                      :value="props.currentTokenHoldInfo?.totalEarnRate || 0"
                    />)</strong
                  >
                </div>
              </div>
            </template>
            <div class="trading-tab display-flex align-items-center">
              <div
                v-for="item in tradingAreaTabList"
                :key="item.id"
                :class="
                  tradingAreaTabIndex == item.id
                    ? `active trading-tab-item cur${item.id}`
                    : 'trading-tab-item'
                "
                @click="handelTradingAreaTab(item)"
              >
                <span>{{ item.name }}</span>
              </div>
            </div>

            <OneClickTrading
              ref="childrenRef"
              v-if="tradingAreaTabIndex == 1"
              :coinInfo="
                handleCoinPairInfo({
                  ...props.baseInfo.tokenInfo,
                  chainCode: props.baseInfo.chainInfo?.chainCode
                })
              "
              :pairInfo="{ ...props.pairInfo, price }"
            />
            <template v-if="tradingAreaTabIndex == 2">
              <div class="tab-main display-flex align-items-center">
                <div
                  v-for="item in exchangeTabList"
                  :key="item.id"
                  :class="exchangeTabIndex == item.id ? 'cur tab-main-item' : 'tab-main-item'"
                  @click="handelExchangeTab(item)"
                >
                  {{ item.name }}
                </div>
              </div>
              <Transaction
                :baseInfo="props.baseInfo"
                v-if="exchangeTabIndex !== 3 && !props.loadRightSideBar"
              />
            </template>
            <BuyLimit
              v-if="tradingAreaTabIndex == 3"
              ref="childrenRef"
              :coinInfo="
                handleCoinPairInfo({
                  ...props.baseInfo.tokenInfo,
                  chainCode: props.baseInfo.chainInfo?.chainCode
                })
              "
              :pairInfo="{ ...props.pairInfo, price }"
            />
            <SellLimit
              v-if="tradingAreaTabIndex == 4"
              ref="childrenRef"
              :coinInfo="
                handleCoinPairInfo({
                  ...props.baseInfo.tokenInfo,
                  chainCode: props.baseInfo.chainInfo?.chainCode
                })
              "
              :pairInfo="{ ...props.pairInfo, price }"
            />
          </div>

          <div class="pond-info">
            <!-- <div class="pond-info-item display-flex align-items-center justify-content-sp">
              <div class="flex-1 display-flex flex-direction-col align-items-center">
                <span>{{ i18n.t('kChart.TotalSupply') }}</span>
                <strong
                  >{{ numberFormat(props.pairInfo?.totalSupply || 0) }}/{{
                    i18n.t('kChart.Unknown')
                  }}</strong
                >
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-center">
                <span>池子市值</span>
                <strong>${{ numberFormat(props.pairInfo.tvl) }}</strong>
              </div>
            </div> -->
            <div class="pond-info-item display-flex align-items-center justify-content-sp">
              <div class="flex-1 display-flex flex-direction-col align-items-fs">
                <span>开盘价格</span>
                <strong>{{ numberFormat(props.pairInfo?.start1d || 0) }}</strong>
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-fd">
                <span>开盘回报</span>
                <strong>{{ props.pairInfo?.startChg || 0 }}%</strong>
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-fs">
                <span>最高</span>
                <strong>{{ numberFormat(props.pairInfo?.high1d || 0) }}</strong>
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-center">
                <span>最低</span>
                <strong>{{ numberFormat(props.pairInfo?.low1d || 0) }}</strong>
              </div>
            </div>
            <div
              class="pond-info-item display-flex align-items-center justify-content-sp"
              style="border: none"
            >
              <div class="flex-1 display-flex flex-direction-col align-items-center">
                <span>交易量</span>
                <strong>{{ numberFormat(props.pairInfo?.tradeAmount) }}</strong>
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-center">
                <span>交易数</span>
                <strong>{{ numberFormat(props.pairInfo.tradeCount) }}</strong>
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-center">
                <span>换手率</span>
                <strong>{{ props.pairInfo?.turnoverRate || 0 }}%</strong>
              </div>
              <div class="flex-1 display-flex flex-direction-col align-items-fd">
                <span>流通率</span>
                <strong>{{ props.pairInfo?.circulationRate || 0 }}%</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="vote-box">
          <p>{{ i18n.t('kChart.Vote') }}</p>
          <div class="display-flex justify-content-sp">
            <div class="display-flex flex-direction-col">
              <svg-icon name="thumbs-up" class="icon thumbs-up"></svg-icon>
              <span class="contrast-text">50%</span>
            </div>
            <div class="vote-box—contrast display-flex">
              <div class="contrast——inflow" style="width: 50%">
                <strong></strong>
              </div>
              <div class="contrast——outflow" style="width: 50%">
                <strong></strong>
              </div>
            </div>
            <div class="display-flex flex-direction-col">
              <svg-icon name="thumbs-down" class="icon thumbs-down"></svg-icon>
              <span class="contrast-text">50%</span>
            </div>
          </div>
        </div> -->
      </el-skeleton>
      <SniperDialog
        :sniperDialogVisible="sniperDialogVisible"
        :baseInfo="baseInfo"
        :earliest100TraderData="earliest100TraderData"
        @close="handleClose"
        v-if="sniperDialogVisible"
      />
    </aside>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import BigNumber from 'bignumber.js'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { handleCoinPairInfo, numberFormat, shortifyAddress, formatLineDate } from '@/utils'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'
import Transaction from './components/Transaction.vue'
import OneClickTrading from './components/OneClickTrading.vue'
import SniperDialog from '@/components/Dialogs/SniperDialog.vue'
import BuyLimit from './components/BuyLimit.vue'
import SellLimit from './components/SellLimit.vue'
import { useGlobalStore } from '@/stores/global'
import { balanceFormat } from '@/utils/transition'
import { customMessage } from '@/utils/message'

const globalStore = useGlobalStore()
const useSubscribeKChart = useSubscribeKChartInfo()

const walletType = computed(() => globalStore.walletInfo.walletType)
const currencyDashboardSwitch = computed(() => globalStore.currencyDashboardSwitch)

const i18n = useI18n()

const childrenRef = ref<any>(null)
const sniperDialogVisible = ref<boolean>(false)

const props = defineProps({
  pairInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  loadRightSideBar: {
    type: Boolean,
    default: false
  },
  baseInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  currentTokenHoldInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  holdingCoinsTabInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  earliest100TraderData: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const price = computed(() =>
  new BigNumber(useSubscribeKChart.subscribeKChartInfo?.C || 0).toString(10)
)

const tradingAreaTabList = computed(() => {
  return walletType.value == 'Email'
    ? [
        {
          name: '一键交易',
          id: 1
        },
        {
          name: '买入',
          id: 3
        },
        {
          name: '卖出',
          id: 4
        }
      ]
    : [
        {
          name: '一键交易',
          id: 1
        },
        {
          name: '兑换/跨链',
          id: 2
        }
      ]
})

const tradingAreaTabIndex = ref(1)

const handelTradingAreaTab = (item: any) => {
  tradingAreaTabIndex.value = item.id
}

const exchangeTabList = [
  {
    name: i18n.t('home.swap'),
    id: 1
  },
  {
    name: i18n.t('home.314'),
    id: 2
  },
  {
    name: i18n.t('home.HelloDexBot'),
    id: 3
  }
]
const exchangeTabIndex = ref(1) // tab 当前值

const handelExchangeTab = (item: any) => {
  // tab切换函数
  if ([3].includes(item.id)) {
    customMessage({
      type: 'info',
      title: i18n.t('h5.ComingSoon')
    })
    return false
  }
  exchangeTabIndex.value = item.id
}

const handleClose = (val: boolean) => {
  sniperDialogVisible.value = val
}

const handelRouter = (url: string) => {
  console.log(url)
  url && window.open(url)
}
</script>
<style scoped lang="scss">
@use './RightSideBar.scss';
</style>
