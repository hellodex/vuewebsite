<template>
  <section class="currency-dashboard display-flex align-items-center">
    <div class="tabs display-flex align-items-center">
      <div
        class="display-flex align-items-center tab-item"
        :class="item.pairAddress == chainInfo.pairAddress ? 'tab-item-cur' : ''"
        v-for="(item, index) in currencyDashboard"
        :key="index"
        @click="handelJump(item)"
      >
        <el-icon
          v-if="item.pairAddress == chainInfo.pairAddress"
          size="18"
          style="margin-right: 12px"
          ><Fold
        /></el-icon>
        <div class="display-flex align-items-center">
          <span class="logo">
            <el-image :src="item.logo" alt="" class="baseInfo-img">
              <template #error>
                <svg-icon name="logo1" class="baseInfo-img"></svg-icon>
              </template>
            </el-image>
            <svg-icon :name="'coin' + item.chainCode" class="chainCode"></svg-icon>
          </span>
          <div class="display-flex flex-direction-col">
            <div class="display-flex align-items-center coin-text font-family-Heavy">
              <span>{{ MAIN_COIN[item.baseSymbol] || item.baseSymbol || '-' }}</span>
              <span class="coin-sub-txt">/{{ item.quoteSymbol || '-' }}</span>
            </div>
            <div class="display-flex align-items-center font-family-Heavy">
              <span
                :class="item.increase[0] === '-' ? 'price-txt down-color' : 'price-txt up-color'"
                >${{ numberFormat(item.price || 0) }}</span
              >
              <PercentageNotbg :value="item.increase" />
            </div>
          </div>
        </div>
        <el-icon
          size="18"
          style="margin-left: 18px"
          v-if="item.pairAddress == chainInfo.pairAddress"
          @click.stop="handelRemove(item, index)"
          ><Close
        /></el-icon>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { MAIN_COIN } from '@/types'
import { numberFormat } from '@/utils'
import { useRouter } from 'vue-router'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useGlobalStore } from '@/stores/global'
import PercentageNotbg from '@/components/Percentage/PercentageNotbg.vue'

const router = useRouter()
const useChainInfo = useChainInfoStore()
const globalStore = useGlobalStore()
const chainInfo = computed(() => useChainInfo.chainInfo)
const currencyDashboard = computed(() => globalStore.currencyDashboard)

const handelJump = (item: any) => {
  router.push(`/k/${item.pairAddress}?chainCode=${item.chainCode}`)
}

const handelRemove = (params: any, index: number) => {
  const info = currencyDashboard.value[index - 1]
  const arr = currencyDashboard.value.filter((item: any) => item.pairAddress !== params.pairAddress)
  globalStore.delCurrencyDashboard(arr)
  handelJump(info)
}
</script>

<style scoped lang="scss">
.currency-dashboard {
  height: 56px;
  border-bottom: 1px solid rgba(38, 40, 44, 0.3);
  .tabs {
    width: 100vw;
    overflow: hidden;
    overflow-x: scroll;
  }
  .tab-item {
    padding: 8px 10px;
    cursor: pointer;
  }
  .tab-item-cur {
    background-color: rgba(58, 60, 64, 0.4);
  }
  .logo {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    position: relative;
    .chainCode {
      width: 18px;
      height: 18px;
      position: absolute;
      right: -2px;
      bottom: -2px;
    }
  }
  .baseInfo-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .price-txt {
    margin-right: 8px;
  }
  .coin-text {
    white-space: nowrap;
  }
}
</style>
