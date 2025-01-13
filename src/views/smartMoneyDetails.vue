<template>
  <WebSmartMoneyDetails v-if="windowWidth >= 1144" />
  <H5SmartMoneyDetails v-else />
</template>

<script setup lang="ts">
import WebSmartMoneyDetails from '@/adapter/WebSmartMoneyDetails.vue'
import H5SmartMoneyDetails from '@/adapter/H5SmartMoneyDetails.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
