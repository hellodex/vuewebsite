<template>
  <el-empty description="暂无数据" :image="empty" :image-size="imageSize" />
</template>

<script setup lang="ts">
import empty from '@/assets/icons/noData-icon.svg'

defineProps({
  imageSize: {
    type: Number,
    default: 100
  }
})
</script>
