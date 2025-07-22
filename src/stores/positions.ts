/**
 * 持仓数据全局状态管理
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { initLimitedOrderPage } from '@/api/coinWalletDetails'

interface Position {
  tokenAddress: string
  averagePrice: string
  symbol: string
  amount: string
  volume: string
  // 其他字段...
}

export const usePositionsStore = defineStore('positions', () => {
  const positions = ref<Position[]>([])
  const loading = ref(false)
  const lastUpdateTime = ref<number>(0)
  
  // 根据 token 地址获取持仓数据
  const getPositionByAddress = computed(() => {
    return (tokenAddress: string) => {
      if (!tokenAddress) return null
      return positions.value.find(
        item => item.tokenAddress?.toLowerCase() === tokenAddress?.toLowerCase()
      )
    }
  })
  
  // 获取持仓数据 - 由调用方传入钱包信息
  async function fetchPositions(walletInfo?: { walletId: string | number; walletKey: string }) {
    if (!walletInfo?.walletId) {
      return
    }
    
    // 避免频繁请求，至少间隔5秒
    const now = Date.now()
    if (now - lastUpdateTime.value < 5000) {
      return
    }
    
    loading.value = true
    try {
      const res = await initLimitedOrderPage({
        walletId: parseFloat(walletInfo.walletId.toString()),
        walletKey: walletInfo.walletKey,
        hidePosition: false
      })
      
      if (res?.data?.positions) {
        positions.value = res.data.positions
        lastUpdateTime.value = now
      }
    } catch (error) {
      console.error('获取持仓数据失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  // 直接设置持仓数据（从其他地方获取后）
  function setPositions(data: Position[]) {
    positions.value = data
    lastUpdateTime.value = Date.now()
  }
  
  // 清空数据
  function clearPositions() {
    positions.value = []
    lastUpdateTime.value = 0
  }
  
  return {
    positions,
    loading,
    getPositionByAddress,
    fetchPositions,
    setPositions,
    clearPositions
  }
})