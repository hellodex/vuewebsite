<script setup lang="ts">
import { MarketTrend } from '@/types'
import { numberFormat } from '@/utils'

const props = defineProps<{ value: string }>()

const getMarketTren = () => {
  return props.value[0] === '-' ? MarketTrend.Bearish : MarketTrend.Bullish
}
</script>

<template>
  <span
    :class="{
      'text-on-container-green': getMarketTren() == MarketTrend.Bullish,
      'text-on-container-red': getMarketTren() === MarketTrend.Bearish
    }"
  >
    {{ value[0] === '-' ? parseFloat(value).toFixed(2) : '+' + parseFloat(value).toFixed(2) }}%
  </span>
</template>
<style scoped>
.text-on-container-green {
  padding: 2px 4px;
  font-size: 12px;
  color: var(--up-color);
  border-radius: 4px;
  background: rgba(46, 189, 133, 0.16);
  white-space: nowrap;
  font-weight: normal;
}
.text-on-container-red {
  padding: 2px 4px;
  font-size: 12px;
  color: var(--down-color);
  border-radius: 4px;
  background: rgba(246, 70, 93, 0.16);
  white-space: nowrap;
  font-weight: normal;
}
</style>
