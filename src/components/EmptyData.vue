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
<style lang="scss" scoped>
:deep(.el-empty__description) {
  margin-top: 12px;
  p {
    font-size: 12px;
  }
}
</style>
