<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <WebSmartMoney v-if="windowWidth > 700" />
  <H5SmartMoney v-else />
</template>

<script setup lang="ts">
import WebSmartMoney from '@/adapter/WebSmartMoney.vue'
import H5SmartMoney from '@/adapter/H5SmartMoney.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
