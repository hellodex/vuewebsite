<template>
  <WebIdo v-if="windowWidth > 700" />
  <H5Ido v-else />
</template>

<script setup lang="ts">
import WebIdo from '@/adapter/WebIdo.vue'
import H5Ido from '@/adapter/H5Ido.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
