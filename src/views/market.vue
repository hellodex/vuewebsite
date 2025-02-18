<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <WebMarket v-if="windowWidth > 700" />
  <H5Market v-else />
</template>

<script setup lang="ts">
import WebMarket from '@/adapter/WebMarket.vue'
import H5Market from '@/adapter/H5Market.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
