<template>
  <WebIdo v-if="windowWidth > 700" />
  <H5Ido v-else />
</template>

<script setup lang="ts">
import WebIdo from '@/adapter/WebAirdrop.vue'
import H5Ido from '@/adapter/WebAirdrop.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
