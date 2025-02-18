<template>
  <WebCoinWalletDetails v-if="windowWidth > 700" />
  <H5CoinWalletDetails v-else />
</template>
<script setup lang="ts">
import WebCoinWalletDetails from '@/adapter/WebCoinWalletDetails.vue'
import H5CoinWalletDetails from '@/adapter/H5CoinWalletDetails.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
