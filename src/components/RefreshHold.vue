<template>
  <span class="refresh-btn" @click="handelRefresh">手动刷新仓位</span>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { APIrefreshhold } from '@/api'

const globalStore = useGlobalStore()
const customWalletInfo = computed(() => globalStore.customWalletInfo)

const handelRefresh = async () => {
  const res = await APIrefreshhold({
    walletAddress: customWalletInfo.value.walletInfo?.wallet,
    chainCode: customWalletInfo.value.walletInfo?.chainCode
  })

  console.log(res)
}
</script>

<style lang="scss" scoped>
.refresh-btn {
  margin-right: 12px;
  cursor: pointer;
  color: var(--font-color-default) !important;
}
</style>
