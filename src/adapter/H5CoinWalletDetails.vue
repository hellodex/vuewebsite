<template>
  <section class="h5-coinWalletDetails">
    <van-sticky>
      <div class="coinWalletDetails-head display-flex align-items-center justify-content-sp">
        <div class="display-flex align-items-center">
          <svg-icon name="chevron-left" class="chevron-left" @click="router.back()"></svg-icon>
          <div class="display-flex align-items-center base-info">
            <span class="logo">
              <el-image :src="baseInfo?.tokenInfo?.logo" alt="" class="baseInfo-img">
                <template #error>
                  <svg-icon name="logo1" class="baseInfo-img"></svg-icon>
                </template>
              </el-image>
              <img :src="chainLogoObj[baseInfo?.chainInfo?.chainCode]" alt="" class="chainCode" />
            </span>
            <div class="display-flex flex-direction-col">
              <div class="display-flex align-items-center coin-text">
                <span>{{
                  MAIN_COIN[baseInfo?.tokenInfo?.baseSymbol] ||
                  baseInfo?.tokenInfo?.baseSymbol ||
                  '-'
                }}</span>
                <span class="">/{{ baseInfo?.tokenInfo?.quoteSymbol || '-' }}</span>
              </div>
              <div class="display-flex align-items-center">
                <span class="text-on-container-secondary">{{
                  shortifyAddress(baseInfo?.tokenInfo?.baseAddress)
                }}</span>
                <svg-icon
                  name="copy"
                  class="copy"
                  v-copy="baseInfo?.tokenInfo?.baseAddress"
                ></svg-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="display-flex align-items-center">
          <div class="display-flex flex-direction-col snipe-text" @click="sniperPopup = true">
            <div class="display-flex align-items-center margin-element">
              <span>狙击者</span>
              <svg-icon name="chevron-right" class="chevron-right"></svg-icon>
            </div>
            <div class="display-flex align-items-center">
              <svg-icon name="snipe-icon" class="snipe-icon"></svg-icon>
              <span
                >{{
                  earliest100TraderData?.traders?.filter((item: any) => item.sniper)?.length || 0
                }}/{{ earliest100TraderData?.traders?.length || 0 }}</span
              >
            </div>
          </div>
          <Favorite
            :coinInfo="{
              pairAddress: route.params.pairAddress,
              chainCode: baseInfo?.chainInfo?.chainCode
            }"
          />
          <svg-icon name="h5-search-md" class="search-md" @click="handelShowPopup"></svg-icon>
        </div>
      </div>
      <div class="tabs-items-box">
        <span
          v-for="(item, index) in tabList"
          :key="index"
          @click="handelTab(item)"
          :class="item.value == active ? 'active' : ''"
          >{{ item.label
          }}{{
            item.value == 'second' ? numberFormat(holdingCoinsTabInfo?.topHolders?.holds || 0) : ''
          }}</span
        >
      </div>
    </van-sticky>

    <div v-show="active == 'first'">
      <div class="pair-info-box">
        <div class="pair-info display-flex justify-content-sp">
          <div class="pair-info-price display-flex flex-direction-col">
            <div class="display-flex align-items-center">
              <span :class="priceIncrease.increase[0] == '-' ? 'price down' : 'price up'">{{
                MAIN_COIN[baseInfo?.tokenInfo?.baseSymbol]
                  ? numFormat(priceIncrease.price || 0)
                  : numberFormat(priceIncrease.price || 0)
              }}</span>
              <span
                :class="
                  priceIncrease.increase[0] == '-'
                    ? 'percentage percentage-down'
                    : 'percentage percentage-up'
                "
                >{{
                  priceIncrease.increase[0] == '-'
                    ? parseFloat(priceIncrease.increase || '0').toFixed(2)
                    : '+' + parseFloat(priceIncrease.increase || '0').toFixed(2)
                }}%</span
              >
            </div>
            <div class="exchange-rate">
              ≈ ${{
                MAIN_COIN[baseInfo?.tokenInfo?.baseSymbol]
                  ? numFormat(priceIncrease.price)
                  : numberFormat(priceIncrease.price)
              }}
            </div>
            <div class="display-flex align-items-center">
              <div class="icon-item">
                <svg-icon name="int" class="int"></svg-icon>
              </div>
              <div class="icon-item">
                <svg-icon name="tg-app" class="tg-app"></svg-icon>
              </div>
              <div class="icon-item">
                <svg-icon name="dc" class="discord"></svg-icon>
              </div>
              <div class="icon-item">
                <svg-icon name="x" class="x"></svg-icon>
              </div>
            </div>
          </div>
          <div class="display-flex flex-direction-col pair-info-items">
            <div class="display-flex align-items-center justify-content-sp pair-info-item">
              <span>持有人</span>
              <span>{{ numberFormat(holdingCoinsTabInfo?.topHolders?.holds || 0) }}</span>
            </div>
            <div class="display-flex align-items-center justify-content-sp pair-info-item">
              <span>池子市值</span>
              <span>{{ numberFormat(pondTabInfo?.poolChainInfo?.tvl || 0) }}</span>
            </div>
            <div class="display-flex align-items-center justify-content-sp pair-info-item">
              <span>总市值</span>
              <span>{{ numberFormat(pondTabInfo?.poolChainInfo?.circulationVol || 0) }}</span>
            </div>
            <div class="display-flex align-items-center justify-content-sp pair-info-item">
              <span>当天交易额</span>
              <span>{{ numberFormat(pondTabInfo?.poolChainInfo?.volumeUsd || 0) }}</span>
            </div>
            <div class="display-flex justify-content-center" :style="{ opacity: show ? 0 : 1 }">
              <div class="chevron-down-box display-flex align-items-center" @click="show = true">
                <svg-icon name="chevron-down" class="chevron-down"></svg-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="pair-swich-box" v-show="show">
          <div class="pair-info-swich">
            <div class="display-flex flex-direction-col">
              <span>当天最高</span>
              <strong>{{ numberFormat(pondTabInfo?.poolChainInfo?.high1d) }}</strong>
            </div>
            <div class="display-flex flex-direction-col">
              <span>当天最低</span>
              <strong>{{ numberFormat(pondTabInfo?.poolChainInfo?.low1d) }}</strong>
            </div>
            <div class="display-flex flex-direction-col">
              <span>当天换手率</span>
              <strong>{{ pondTabInfo?.poolChainInfo?.turnoverRate }}%</strong>
            </div>
            <div class="display-flex flex-direction-col">
              <span>流通率</span>
              <strong>{{ pondTabInfo?.poolChainInfo?.circulationRate }}%</strong>
            </div>
            <div class="display-flex flex-direction-col">
              <span>首日开盘价</span>
              <strong>{{ numberFormat(pondTabInfo?.poolChainInfo?.openPrice) }}</strong>
            </div>
            <div class="display-flex flex-direction-col">
              <span>总量/可增发</span>
              <strong
                >{{ numberFormat(pondTabInfo?.poolChainInfo?.baseToken.totalSupply) }}/未知</strong
              >
            </div>
            <div class="display-flex flex-direction-col">
              <span>当天交易量</span>
              <strong>{{ numberFormat(pondTabInfo?.poolChainInfo?.volume) }}</strong>
            </div>
            <div class="display-flex flex-direction-col">
              <span>开盘回报率</span>
              <strong>{{ pondTabInfo?.poolChainInfo?.openingReturnRate }}%</strong>
            </div>
          </div>
          <div class="display-flex justify-content-center">
            <div class="chevron-down-box display-flex align-items-center" @click="show = false">
              <svg-icon name="chevron-up" class="chevron-up"></svg-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="test-box">
        <div
          class="test-main display-flex align-items-center justify-content-sa"
          v-if="pondTabInfo?.coinGoPlusInfo"
        >
          <template v-if="baseInfo?.chainInfo?.chainCode != 'SOLANA'">
            <div class="display-flex align-items-center">
              <el-icon
                :size="14"
                color="#2EBD85"
                v-if="pondTabInfo?.coinGoPlusInfo?.is_open_source == 1"
                ><CircleCheck
              /></el-icon>
              <el-icon :size="14" color="#EE475E" v-else><CircleClose /></el-icon>
              <span>{{
                pondTabInfo?.coinGoPlusInfo?.is_open_source == 1 ? '合约开源' : '合约未开源'
              }}</span>
            </div>
            <div class="display-flex align-items-center">
              <el-icon :size="14" color="#EE475E" v-if="isContract"><CircleClose /></el-icon>
              <el-icon :size="14" color="#2EBD85" v-else><CircleCheck /></el-icon>
              <span>{{ isContract ? '合约未放弃' : '合约放弃' }}</span>
            </div>
            <div class="display-flex align-items-center">
              <el-icon :size="14" color="#2EBD85" v-if="isLocked"><CircleCheck /></el-icon>
              <el-icon :size="14" color="#EE475E" v-else><CircleClose /></el-icon>
              <span>{{ isLocked ? '流动性锁定' : '流动性未锁定' }}</span>
            </div>
            <div class="display-flex align-items-center">
              <el-icon
                :size="14"
                color="#2EBD85"
                v-if="pondTabInfo?.coinGoPlusInfo?.is_honeypot == 0"
                ><CircleCheck
              /></el-icon>
              <el-icon :size="14" color="#EE475E" v-else><CircleClose /></el-icon>
              <span>{{ pondTabInfo?.coinGoPlusInfo?.is_honeypot == 0 ? '非蜜罐' : '蜜罐' }}</span>
            </div>
          </template>
          <template v-if="baseInfo?.chainInfo?.chainCode == 'SOLANA'">
            <div class="display-flex align-items-center">
              <el-icon
                :size="14"
                color="#2EBD85"
                v-if="pondTabInfo?.coinGoPlusInfo?.freezable?.status == 0"
                ><CircleCheck
              /></el-icon>
              <el-icon :size="14" color="#EE475E" v-else><CircleClose /></el-icon>
              <span>{{
                pondTabInfo?.coinGoPlusInfo?.freezable?.status == 0 ? '不可冻币' : '可冻币'
              }}</span>
            </div>
            <div class="display-flex align-items-center">
              <el-icon
                :size="14"
                color="#2EBD85"
                v-if="pondTabInfo?.coinGoPlusInfo?.mintable?.status == 0"
                ><CircleCheck
              /></el-icon>
              <el-icon :size="14" color="#EE475E" v-else><CircleClose /></el-icon>
              <span>
                {{
                  pondTabInfo?.coinGoPlusInfo?.freezable?.status == 0 ? '不可增发' : '可增发'
                }}</span
              >
            </div>
            <div class="display-flex align-items-center">
              <el-icon
                :size="14"
                color="#2EBD85"
                v-if="pondTabInfo?.coinGoPlusInfo?.transfer_hook?.length == 0"
                ><CircleCheck
              /></el-icon>
              <el-icon :size="14" color="#EE475E" v-else><CircleClose /></el-icon>
              <span>{{
                pondTabInfo?.coinGoPlusInfo?.transfer_hook?.length == 0
                  ? '无外部合约'
                  : '有外部合约'
              }}</span>
            </div>
            <div class="display-flex align-items-center">
              <span
                >前10持币：{{
                  parseFloat(holdingCoinsTabInfo?.topHolders?.topProPortion || 0).toFixed(2)
                }}%</span
              >
            </div>
          </template>
        </div>
      </div>
      <div class="kchart">
        <van-skeleton
          style="width: 100%; height: 100%; background-color: #131722"
          :loading="baseInfo?.tradingLoading"
          animate
        >
          <template #template>
            <van-skeleton-paragraph style="width: 100%; height: 100%; background-color: #131722" />
          </template>
          <template #default>
            <TradingViewApp v-if="!baseInfo?.tradingLoading" />
          </template>
        </van-skeleton>
      </div>
      <div class="tabs-box">
        <div class="pond-first display-flex" v-if="pondTabInfo?.poolList?.length > 0">
          <div class="display-flex align-items-center pond-tab-item">
            <div class="display-flex align-items-center flex-direction-col pond-centent-txt">
              <span>{{
                pondTabInfo?.poolList[0].coinName1.length >= 44
                  ? shortifyAddress(pondTabInfo?.poolList[0].coinName1)
                  : pondTabInfo?.poolList[0].coinName1
              }}</span>
              <span class="pond-tab-item-txt">{{
                numberFormat(parseFloat(pondTabInfo?.poolList[0].num1))
              }}</span>
            </div>
            <div class="pond-coin-border"></div>
            <div class="display-flex align-items-center flex-direction-col pond-centent-txt">
              <span>{{ pondTabInfo?.poolList[0].coinName2 }}</span>
              <span class="pond-tab-item-txt">{{
                numberFormat(parseFloat(pondTabInfo?.poolList[0].num2))
              }}</span>
            </div>
          </div>
          <div class="display-flex flex-direction-col justify-content-sa">
            <div class="display-flex align-items-center">
              <span>LP人数&nbsp;&nbsp;</span>
              <strong>{{ pondTabInfo?.lpList?.length || 0 }}</strong>
            </div>
            <div class="display-flex align-items-center">
              <span>锁仓&nbsp;&nbsp;</span>
              <strong>{{ percent }}%</strong>
            </div>
          </div>
        </div>
        <van-tabs
          v-model:active="activeName"
          background="#121212"
          color="#ffffff"
          title-active-color="#ffffff"
          title-inactive-color="#9c9c9c"
          shrink
          line-width="20"
        >
          <van-tab title="交易" name="first">
            <div class="transaction-app-tab">
              <div class="transaction-screen display-flex align-items-center justify-content-sp">
                <div class="screen-btn display-flex align-items-center">
                  <svg-icon name="filter-funnel" class="filter-funnel"></svg-icon>
                  <span>筛选</span>
                </div>
                <div class="screen-check-box display-flex align-items-center">
                  <van-checkbox v-model="buyChecked" checked-color="#079455" icon-size="14"
                    >只看买单</van-checkbox
                  >
                  <van-checkbox v-model="sellChecked" checked-color="#C93E5F" icon-size="14"
                    >只看卖单</van-checkbox
                  >
                </div>
              </div>
              <div class="transaction-table">
                <div class="transaction-table-head display-flex align-items-center">
                  <span>时间</span>
                  <span>价格</span>
                  <span>交易量</span>
                  <span>交易额</span>
                  <span>用户</span>
                </div>
                <div class="transaction-table-body">
                  <div
                    class="transaction-table-row display-flex align-items-center"
                    v-for="(item, index) in transactionList"
                    :key="index"
                  >
                    <span>{{ timeago(item.timestamp * 1000) }}</span>
                    <span :class="item.flag ? 'up' : 'down'">{{ numberFormat(item.price) }}</span>
                    <span :class="item.flag ? 'up' : 'down'">{{ numberFormat(item.amount) }}</span>
                    <span>${{ numberFormat(item.totalPrice) }}</span>
                    <span class="display-flex align-items-center justify-content-fd">
                      <svg-icon name="whale-app" class="img" v-if="item.group === 2"></svg-icon>
                      <svg-icon name="dolphin" class="img" v-if="item.group === 1"></svg-icon>
                      <svg-icon name="robot-app" class="img" v-if="item.isRobot === 1"></svg-icon>
                      {{ shortifyAddress(item.sender) }}
                      <strong class="num-text">({{ item.count }})</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="池子" name="second">
            <PondTab :pondTabInfo="pondTabInfo" />
          </van-tab>
          <!-- <van-tab title="我的" name="six">内容 6</van-tab> -->
        </van-tabs>
      </div>
    </div>
    <template v-if="active == 'second'">
      <HoldingCoinsTab :holdingCoinsTabInfo="holdingCoinsTabInfo" />
    </template>
    <template v-if="active == 'third'">
      <FundTab :fundTabInfo="fundTabInfo" @change="handelFundChange" />
    </template>
    <template v-if="active == 'fourth'">
      <div class="synopsis-tab">
        <div class="synopsis-chain">
          <div class="display-flex align-items-center">
            <span class="logo">
              <el-image :src="baseInfo?.tokenInfo?.logo" alt="" class="baseInfo-img">
                <template #error>
                  <svg-icon name="logo1" class="baseInfo-img"></svg-icon>
                </template>
              </el-image>
              <svg-icon
                :name="'coin' + pondTabInfo?.poolChainInfo?.tokenInfo?.chainCode"
                class="chainCode"
              ></svg-icon>
            </span>
            <span class="baseSymbol">{{ pondTabInfo?.poolChainInfo?.tokenInfo?.baseSymbol }}</span>
          </div>
          <div class="synopsis-text display-flex align-items-center justify-content-sp">
            <span>代币名称</span>
            <strong>{{ pondTabInfo?.poolChainInfo?.tokenInfo?.baseSymbol }}</strong>
          </div>
          <div class="synopsis-text display-flex align-items-center justify-content-sp">
            <span>最大供应量</span>
            <strong>{{ numberFormat(pondTabInfo?.poolChainInfo?.baseToken.totalSupply) }}</strong>
          </div>
          <div class="synopsis-item display-flex flex-direction-col">
            <p>币种信息</p>
            <span class="chain-info">{{ pondTabInfo?.poolChainInfo?.tokenInfo?.info }}</span>
          </div>
          <div class="synopsis-item display-flex flex-direction-col">
            <p>官方链接</p>
            <!-- <span>{{ pondTabInfo?.poolChainInfo?.tokenInfo?.info }}</span> -->
          </div>
          <div class="synopsis-item display-flex flex-direction-col">
            <p>社区交流</p>
            <div class="display-flex align-items-center">
              <svg-icon name="telegram" class="icon-svg"></svg-icon>
              <svg-icon name="xVector" class="icon-svg"></svg-icon>
              <svg-icon name="discord-icon" class="icon-svg"></svg-icon>
            </div>
          </div>
          <p class="synopsis-p">简介信息如有缺失或错误，欢迎用户去社区反馈。</p>
        </div>
      </div>
    </template>
    <template v-if="active == 'five'">
      <SecurityTest
        :coinGoPlusInfo="pondTabInfo?.coinGoPlusInfo"
        :tokenInfo="baseInfo?.tokenInfo"
        :chainInfo="baseInfo?.chainInfo"
      />
    </template>
    <SearchPop :popupShow="popupShow" type="detail" @close="handleClose" />
    <SniperPopup
      :sniperPopup="sniperPopup"
      :tokenInfo="baseInfo?.tokenInfo"
      :earliest100TraderData="earliest100TraderData"
      @close="handleClose"
    />
  </section>
  <div class="operat-btn display-flex align-items-center justify-content-sp">
    <span class="buy btn" @click="handelJump('buy')">买入</span>
    <span class="sell btn" @click="handelJump('sell')">卖出</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import SearchPop from '@/components/Dialogs/SearchPop.vue'
import SniperPopup from '@/components/Dialogs/SniperPopup.vue'
import TradingViewApp from '@/components/Charts/TradingViewApp.vue'
import PondTab from '@/components/Charts/PondTabApp.vue'
import FundTab from '@/components/Charts/FundTabApp.vue'
import HoldingCoinsTab from '@/components/Charts/HoldingCoinsTabApp.vue'
import Favorite from '@/components/Favorite.vue'
import SecurityTest from '@/components/Charts/SecurityTestApp.vue'
// hook 函数
import { usePondTabApp } from '@/hooks/usePondTabApp' // 池子 hook
import { useGetFunds } from '@/hooks/useFundTabApp' // 资金 hook
import { useHoldingCoinsTab } from '@/hooks/useHoldingCoinsTab' // 持币 hook

import { APIinitTokenData } from '@/api/coinWalletDetails'
import { APIh5Earliest100Trader } from '@/api'
// store 缓存
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import { useGlobalStore } from '@/stores/global'

import { useBaseInfo } from '@/hooks/useBaseInfo' // 头部 代币信息 hook

import { MAIN_COIN } from '@/types'
import { numberFormat, timeago, shortifyAddress, numFormat } from '@/utils'

const i18n = useI18n()
const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()
const { chainLogoObj } = globalStore

const useChainInfo = useChainInfoStore()

//获取token数据
const useTokenInfo = useTokenInfoStore()

useChainInfo.createChainInfo({
  chainCode: route.query.chainCode, // 币ID
  pairAddress: route.params.pairAddress, // 币 pairAddress
  timeType: route.query.timeType // 时间类型
})

const popupShow = ref<boolean>(false)
const sniperPopup = ref<boolean>(false)

const active = ref<string>('first')
const activeName = ref<string>('first')
const buyChecked = ref<boolean>(true)
const sellChecked = ref<boolean>(true)
const show = ref<boolean>(false)
const increase = ref<number>(1)

const tabList = [
  {
    label: '数据',
    value: 'first'
  },
  {
    label: '持币人',
    value: 'second'
  },
  {
    label: '资金',
    value: 'third'
  },
  {
    label: '简介',
    value: 'fourth'
  },
  {
    label: '安全检测',
    value: 'five'
  }
]

const handelTab = (item: any) => {
  active.value = item.value
}
// 代币信息
const baseInfo = ref<any>({
  tradingLoading: true
})

// 池子信息
const pondTabInfo = ref<any>({})

// 资金信息
const fundTabInfo = ref<any>({})

// 持币 信息
const holdingCoinsTabInfo = ref<any>({
  loading: true
})

const earliest100TraderData = ref<any>({})

const handelShowPopup = () => {
  popupShow.value = true
}

const handleClose = (val: boolean) => {
  popupShow.value = val
  sniperPopup.value = val
}

// 初始化 Kline
const initTokenData = async () => {
  const chainInfo = useChainInfo.chainInfo
  const res = await APIinitTokenData({
    pairAddress: chainInfo?.pairAddress,
    chainCode: chainInfo?.chainCode
  })
  useTokenInfo.createTokenInfo(res)
  baseInfo.value = await useBaseInfo()
  getEarliest100Trader()
  pondTabInfo.value = usePondTabApp()
  fundTabInfo.value = useGetFunds('1h')
  holdingCoinsTabInfo.value = useHoldingCoinsTab(100, 'Top 100')
}

const handelFundChange = (item: any) => {
  fundTabInfo.value = useGetFunds(item.timeNum)
}

const getEarliest100Trader = async () => {
  const res = await APIh5Earliest100Trader({
    tokenAddress: baseInfo.value?.tokenInfo?.baseAddress,
    chainCode: baseInfo.value.chainInfo?.chainCode
  })
  console.log(res)

  earliest100TraderData.value = res || {}
}

const useSubscribeKChart = useSubscribeKChartInfo()
useSubscribeKChart.createSubscribeKChartInfo({})
// eslint-disable-next-line vue/return-in-computed-property
const transactionList = computed(() => {
  const arr = useSubscribeKChart.subscribeKChartInfo?.swap || []
  if (buyChecked.value && sellChecked.value) {
    return arr
  } else if (!buyChecked.value && !sellChecked.value) {
    return []
  } else if (buyChecked.value && !sellChecked.value) {
    return arr.filter((item: { flag: number | string }) => item.flag == 1)
  } else if (!buyChecked.value && sellChecked.value) {
    return arr.filter((item: { flag: number | string }) => item.flag == 0)
  }
})

const priceIncrease = computed(() => {
  return {
    price: useSubscribeKChart.subscribeKChartInfo?.C || 0,
    increase: useSubscribeKChart.subscribeKChartInfo?.chg || 0
  }
})

const percent = computed(() => {
  let percent = 0
  pondTabInfo.value?.lpList?.forEach((item: { percent: string }) => {
    percent += Number(item.percent)
  })
  return (percent * 100).toFixed(2)
})

// 流动性锁定
const isLocked = computed(() => {
  return pondTabInfo.value?.coinGoPlusInfo?.lp_holders?.some((item: any) => item.is_locked == 1)
})

// 合约

const isContract = computed(() => {
  return pondTabInfo.value?.coinGoPlusInfo?.lp_holders?.some((item: any) => item.is_contract == 1)
})

const handelJump = (type: string) => {
  router.push(`/trade/${route.params.pairAddress}?chainCode=${route.query.chainCode}&type=${type}`)
}

onMounted(() => {
  // TODO H5页面 列表跳转详情 列表滚动的位置 在IOS系统及 Safari浏览器上 会携带到详情页 没找到原因 即强制滚到到顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 可选，平滑滚动效果
  })
  initTokenData()
})

onUnmounted(() => {})
</script>

<style lang="scss" scoped>
.h5-coinWalletDetails {
  width: 100%;
  height: calc(100vh - 55px);
  background-color: #000;
  overflow: hidden;
  overflow-y: scroll;
  .coinWalletDetails-head {
    padding: 0.2rem 0.32rem;
    background-color: #121212;
    .chevron-left {
      width: 0.2667rem;
      height: 0.64rem;
      color: #fff;
    }
    .search-md {
      width: 0.5333rem;
      height: 0.5333rem;
      color: var(--dex-color-4);
      font-weight: normal;
    }
    .base-info {
      margin-left: 0.2667rem;
    }
    .logo {
      width: 0.8533rem;
      height: 0.8533rem;
      margin-right: 0.2133rem;
      position: relative;
      .chainCode {
        width: 0.32rem;
        height: 0.32rem;
        position: absolute;
        right: -1px;
        bottom: -1px;
      }
    }
    .baseInfo-img {
      width: 0.8533rem;
      height: 0.8533rem;
      border-radius: 50%;
    }
    .coin-text {
      font-size: 0.3733rem;
      color: #fff;
    }
    .text-on-container-secondary {
      color: #9c9c9c;
    }
    .copy {
      color: #9c9c9c;
      width: 0.2667rem;
      height: 0.2667rem;
      margin-left: 0.1067rem;
    }
    .snipe-text {
      color: #9c9c9c;
      font-size: 0.32rem;
      margin-right: 0.2133rem;
      cursor: pointer;
      .chevron-right {
        width: 0.48rem;
        height: 0.48rem;
      }
      .snipe-icon {
        width: 0.32rem;
        height: 0.32rem;
        margin-right: 0.16rem;
      }
    }
  }
  .test-box {
    padding: 0.2rem 0.32rem;
    .test-main {
      padding: 0.1067rem 0.2667rem;
      background-color: rgb(46, 189, 133, 0.2);
      border-radius: 4px;
      font-size: 11px;
      span {
        margin-left: 0.1067rem;
      }
    }
  }
  .tabs-items-box {
    padding: 0.16rem 0.32rem;
    font-size: 14px;
    background-color: #121212;
    display: flex;
    align-items: center;
    span {
      display: block;
      height: 32px;
      line-height: 1.8;
      border-bottom: 2px solid transparent;
      color: #9c9c9c;
      margin: 0 0.16rem;
    }
    span:first-child {
      margin-left: 0;
    }
    .active {
      color: #fff;
      border-bottom: 2px solid #fff;
    }
  }
  .pair-info-box {
    position: relative;
  }
  .pair-info {
    padding: 0 0.32rem 0.12rem;
    background-color: #121212;
    .pair-info-price {
      width: 4.3733rem;
      .price {
        font-size: 0.64rem;
      }
      .percentage {
        font-size: 0.2667rem;
        padding: 1px 0.08rem;
        border-radius: 0.1067rem;
        margin-left: 0.2133rem;
      }
      .up {
        color: var(--up-color);
      }
      .down {
        color: var(--down-color);
      }
      .percentage-up {
        color: var(--up-color);
        background: rgba(46, 189, 133, 0.2);
      }
      .percentage-down {
        color: var(--down-color);
        background: rgba(201, 62, 95, 0.2);
      }
    }
    .exchange-rate {
      font-size: 0.32rem;
      font-style: normal;
      color: #fff;
    }
    .icon-item {
      display: flex;
      width: 0.7467rem;
      height: 0.7467rem;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 0.1067rem;
      border: 1px solid #202020;
      margin-right: 0.2133rem;
      margin-top: 0.2133rem;
      .int {
        width: 0.48rem;
        height: 0.4267rem;
      }
      .tg-app {
        width: 0.5333rem;
        height: 0.4267rem;
        color: #434343;
      }
      .discord {
        width: 0.48rem;
        height: 0.3733rem;
        color: #434343;
      }
      .x {
        width: 0.4267rem;
        height: 0.4267rem;
        color: #434343;
      }
    }
    .pair-info-items {
      min-width: 3.6267rem;
      padding-top: 0.2667rem;
      .pair-info-item {
        span {
          font-size: 0.32rem;
          color: #fff;
        }
        span:first-child {
          color: #9c9c9c;
        }
      }
    }
  }
  .pair-swich-box {
    width: 100%;
    background-color: #121212;
    padding: 0 0.32rem 0.32rem;
    position: absolute;
    bottom: -3rem;
    z-index: 999;
  }
  .pair-info-swich {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    color: #fff;
    font-size: 0.32rem;
    grid-row-gap: 0.2133rem;
    span {
      color: #9c9c9c;
    }
  }
  .chevron-down-box {
    border-radius: 0.1067rem;
    padding: 0 0.2133rem;
    margin-top: 0.2133rem;
  }
  .chevron-up,
  .chevron-down {
    width: 0.32rem;
    height: 0.32rem;
    color: #fff;
  }
  .kchart {
    width: 100%;
    height: 465px;
    background-color: #121212;
    margin: 0 0 0.2133rem 0;
  }
  .tabs-box {
    background-color: #121212;
    :deep(.van-tab--shrink) {
      padding: 0 0.16rem;
    }
    .transaction-app-tab {
      padding: 0.4267rem 0.4267rem 0.2133rem 0.4267rem;
    }
    .transaction-screen {
      margin-bottom: 0.32rem;
      .screen-btn {
        padding: 0.1067rem 0.2133rem;
        border-radius: 0.1067rem;
        background-color: rgba(224, 224, 224, 0.2);
        color: #fff;
        font-size: 0.32rem;
      }
      .filter-funnel {
        width: 0.4rem;
        height: 0.4rem;
        margin-right: 0.1067rem;
      }
      .screen-check-box {
        :deep(.van-checkbox) {
          margin-left: 0.4267rem;
        }
        :deep(.van-checkbox__label) {
          color: #fff;
          margin-left: 4px;
        }
      }
    }
    .transaction-table-head,
    .transaction-table-row {
      color: #fff;
      font-size: 0.32rem;
      padding: 0.2667rem 0;
      span {
        width: 1.35rem;
        text-align: left;
      }
      span:first-child {
        width: 1.5rem;
      }
      span:last-child {
        flex: 1;
        text-align: right;
      }
    }
    .transaction-table-body {
      margin-top: 0.2133rem;
    }
    .transaction-table-row {
      padding: 0.2133rem 0;
      font-size: 0.2667rem;
      .img {
        width: 0.2667rem;
        height: 0.2667rem;
        display: block;
        margin-right: 0.1067rem;
      }
      .num-text {
        color: #2970ff;
      }
      .up {
        color: var(--up-color);
      }
      .down {
        color: var(--down-color);
      }
    }
  }
  .synopsis-tab {
    padding: 0.4267rem 0.4267rem 0.2133rem;
    .synopsis-chain {
      padding: 0.2133rem 0;
      .logo {
        width: 0.8533rem;
        height: 0.8533rem;
        margin-right: 0.2133rem;
        position: relative;
        .chainCode {
          width: 0.32rem;
          height: 0.32rem;
          position: absolute;
          right: -1px;
          bottom: -1px;
        }
      }
      .baseInfo-img {
        width: 0.8533rem;
        height: 0.8533rem;
        border-radius: 50%;
      }
      .baseSymbol {
        font-size: 0.4267rem;
        color: #fff;
      }
      .synopsis-text {
        font-size: 0.32rem;
        color: #fff;
        margin-top: 0.2133rem;
        span {
          color: #9c9c9c;
        }
      }
      .synopsis-item {
        margin-top: 0.8533rem;
        p {
          color: #fff;
          font-size: 0.3733rem;
          margin-bottom: 0.2133rem;
        }
        .chain-info {
          font-size: 0.32rem;
          color: #9c9c9c;
        }
        .icon-svg {
          width: 0.64rem;
          height: 0.64rem;
          margin-right: 0.2133rem;
        }
      }
      .synopsis-p {
        text-align: center;
        font-size: 0.32rem;
        color: #9c9c9c;
        margin-top: 1.0667rem;
      }
    }
  }
  .pond-first {
    padding: 0.2133rem 0.4267rem 0;
    .pond-tab-item {
      padding: 0.1333rem 0.16rem 0.1333rem 0;
      border-radius: 0.1067rem;
      border: 1px solid #212121;
      background: #212121;
      display: flex;
      display: -webkit-flex;
      align-items: flex-end;
      justify-content: space-between;
      font-size: 0.32rem;
      margin-bottom: 0.2133rem;
      margin-right: 0.2133rem;
      color: #9c9c9c;
      .pond-centent-txt {
        width: 2.4rem;
      }
      .pond-tab-item-txt {
        color: #fff;
      }
      .pond-coin-border {
        width: 1px;
        height: 0.8rem;
        background: rgba(224, 224, 224, 0.1);
      }
      .ic_lock {
        width: 0.3733rem;
        height: 0.3733rem;
      }
    }
  }
}
.operat-btn {
  width: 100%;
  height: 55px;
  padding: 0.2rem;
  background-color: #000;
  .btn {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--font-color-default);
    font-size: 16px;
    border-radius: 4px;
  }
  .sell {
    background-color: var(--down-color);
  }
  .buy {
    background-color: var(--up-color);
    margin-right: 12px;
  }
}
</style>
