<template>
  <div class="kline-box">
    <div class="kline-content">
      <TradingView v-if="!baseInfo.tradingLoading" />
    </div>
    <div class="kline-foot" @click="handelJump">
      <svg-icon name="logo" class="logo"></svg-icon>
      <span>HelloDex</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// store 缓存
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useBaseInfo } from '@/hooks/useBaseInfo' // 头部 代币信息 hook
import { APIinitTokenData } from '@/api/coinWalletDetails'

import TradingView from '@/components/Charts/TradingView.vue'

const route = useRoute()

const useChainInfo = useChainInfoStore()
//获取token数据
const useTokenInfo = useTokenInfoStore()

// 代币信息
const baseInfo = ref<any>({
  tradingLoading: true
})

useChainInfo.createChainInfo({
  chainCode: route.params.chainCode, // 币ID
  pairAddress: route.params.pairAddress, // 币 pairAddress
  timeType: route.query.timeType // 时间类型
})

async function initTokenData() {
  const chainInfo = useChainInfo.chainInfo
  const res = await APIinitTokenData({
    pairAddress: chainInfo?.pairAddress,
    chainCode: chainInfo?.chainCode
  })
  useTokenInfo.createTokenInfo(res)
  baseInfo.value = await useBaseInfo()
  document.title = `HelloDex.io-利润80%分给所有人的去中心化交易所`
}

const handelJump = () => {
  window.open(`/k/${route.params.pairAddress}?chainCode=${route.params.chainCode}&timeType=15m`)
}

onMounted(() => {
  initTokenData()
})
</script>
<style scoped lang="scss">
.kline-box {
  width: 100%;
  height: 100vh;
  .kline-content {
    height: calc(100vh - 36px);
  }
  .kline-foot {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 16px;
    font-family: 'PingFangSC-Medium';
    cursor: pointer;
    .logo {
      width: 24px;
      height: 24px;
      margin-right: 6px;
    }
  }
}
</style>
