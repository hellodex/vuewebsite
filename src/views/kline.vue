<template>
  <div class="kline-box">
    <div class="kline-content">
      <TradingView v-if="!baseInfo.tradingLoading" />
    </div>
    <a
      :href="`/k/${useChainInfo.chainInfo.pairAddress}?chainCode=${route.params.chainCode}`"
      target="_blank"
      class="kline-foot"
    >
      <svg-icon name="logo" class="logo"></svg-icon>
      <span>HelloDex</span>
    </a>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// store 缓存
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useGlobalStore } from '@/stores/global'
import { useBaseInfo } from '@/hooks/useBaseInfo' // 头部 代币信息 hook
import { APIinitTokenData, APIgetMaxPool } from '@/api/coinWalletDetails'

import TradingView from '@/components/Charts/TradingView.vue'

const route = useRoute()

const useChainInfo = useChainInfoStore()
//获取token数据
const useTokenInfo = useTokenInfoStore()

const globalStore = useGlobalStore()

// 代币信息
const baseInfo = ref<any>({
  tradingLoading: true
})

globalStore.setLanguage(route.params.language)

async function initData() {
  const token: any = await APIgetMaxPool({
    baseAddress: route.params.baseAddress,
    chainCode: route.params.chainCode
  })
  console.log(token)
  useChainInfo.createChainInfo({
    chainCode: route.params.chainCode, // 币ID
    pairAddress: token?.pairAddress, // 币 pairAddress
    timeType: route.query.timeType // 时间类型
  })

  const chainInfo = useChainInfo.chainInfo

  const res = await APIinitTokenData({
    pairAddress: chainInfo?.pairAddress,
    chainCode: chainInfo?.chainCode
  })
  useTokenInfo.createTokenInfo(res)
  baseInfo.value = await useBaseInfo()
  document.title = `HelloDex.io-利润80%分给所有人的去中心化交易所`
}

onMounted(() => {
  initData()
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
