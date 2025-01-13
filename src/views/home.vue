<template>
  <WebHome v-if="windowWidth >= 1144" />
  <H5Home v-else />
</template>

<script setup lang="ts">
import WebHome from '@/adapter/WebHome.vue'
import H5Home from '@/adapter/H5Home.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
