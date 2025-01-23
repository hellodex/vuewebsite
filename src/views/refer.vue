<template>
  <WebRefer v-if="windowWidth >= 1144" />
  <H5Refer v-else />
</template>

<script setup lang="ts">
import WebRefer from '@/adapter/WebRefer.vue'
import H5Refer from '@/adapter/H5Refer.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
