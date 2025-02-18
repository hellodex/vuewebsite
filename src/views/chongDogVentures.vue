<template>
  <WebChongDogVentures v-if="windowWidth > 700" />
  <H5ChongDogVentures v-else />
</template>

<script setup lang="ts">
import WebChongDogVentures from '@/adapter/WebChongDogVentures.vue'
import H5ChongDogVentures from '@/adapter/H5ChongDogVentures.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
