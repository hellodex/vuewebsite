<template>
  <WebDownload v-if="windowWidth >= 1144" />
  <H5Download v-else />
</template>

<script setup lang="ts">
import WebDownload from '@/adapter/WebDownload.vue'
import H5Download from '@/adapter/H5Download.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
