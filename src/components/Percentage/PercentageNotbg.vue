<script setup lang="ts">
import { MarketTrend } from '@/types'
const props = defineProps<{ value: string }>()

const getMarketTren = () => {
  return props.value[0] === '-' ? MarketTrend.Bearish : MarketTrend.Bullish
}
const percentage = () => {
  return props.value[0] === '-'
    ? parseFloat(props.value).toFixed(2)
    : '+' + parseFloat(props.value).toFixed(2)
}
</script>

<template>
  <span
    :class="{
      'text-on-container-green': getMarketTren() == MarketTrend.Bullish,
      'text-on-container-red': getMarketTren() === MarketTrend.Bearish
    }"
  >
    {{ percentage() }}%
  </span>
</template>
<style scoped>
.text-on-container-green {
  color: var(--up-color) !important;
}
.text-on-container-red {
  color: var(--down-color) !important;
}
</style>
