<template>
  <span class="clock-timer-txt">{{ relativeTime }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useGlobalStore } from '@/stores/global'

const props = defineProps<{
  timestamp: number
}>()

const globalStore = useGlobalStore()
const relativeTime = ref('')
let timer: NodeJS.Timeout | null = null

// 计算相对时间
const calculateRelativeTime = () => {
  const now = Date.now()
  const diff = Math.floor((now - props.timestamp) / 1000) // 转换为秒
  
  if (diff < 0) {
    return '0秒前'
  }
  
  if (diff < 60) {
    return `${diff}${globalStore.language === 'zh' ? '秒前' : ' second' + (diff !== 1 ? 's' : '') + ' ago'}`
  }
  
  const minutes = Math.floor(diff / 60)
  if (minutes < 60) {
    return `${minutes}${globalStore.language === 'zh' ? '分钟前' : ' minute' + (minutes !== 1 ? 's' : '') + ' ago'}`
  }
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}${globalStore.language === 'zh' ? '小时前' : ' hour' + (hours !== 1 ? 's' : '') + ' ago'}`
  }
  
  const days = Math.floor(hours / 24)
  if (days < 30) {
    return `${days}${globalStore.language === 'zh' ? '天前' : ' day' + (days !== 1 ? 's' : '') + ' ago'}`
  }
  
  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months}${globalStore.language === 'zh' ? '月前' : ' month' + (months !== 1 ? 's' : '') + ' ago'}`
  }
  
  return globalStore.language === 'zh' ? '一年以前' : 'a year ago'
}

// 更新相对时间
const updateRelativeTime = () => {
  relativeTime.value = calculateRelativeTime()
}

onMounted(() => {
  // 立即更新一次
  updateRelativeTime()
  
  // 每秒更新一次
  timer = setInterval(() => {
    updateRelativeTime()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped lang="scss">
.clock-timer-txt {
  color: var(--up-color);
  font-size: 10px;
}
</style>