<template>
  <span class="refresh-btn" @click="handelRefresh"
    ><el-icon :class="loading ? 'refresh-icon' : ''"><RefreshRight /></el-icon
    >&nbsp;手动刷新仓位</span
  >
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { APIrefreshhold } from '@/api'
const globalStore = useGlobalStore()
const customWalletInfo = computed(() => globalStore.customWalletInfo)
const loading = ref(false)

const handelRefresh = async () => {
  loading.value = true
  const res = await APIrefreshhold({
    walletAddress: customWalletInfo.value.walletInfo?.wallet,
    chainCode: customWalletInfo.value.walletInfo?.chainCode
  })
  console.log(res)
  loading.value = false
}
</script>

<style lang="scss" scoped>
.refresh-btn {
  margin-right: 12px;
  cursor: pointer;
  color: var(--font-color-default) !important;
  font-size: 12px !important;
  display: flex;
  align-items: center;
  .refresh-icon {
    animation: rotate 1s linear infinite;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
