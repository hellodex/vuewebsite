/**
 * ref() 就是 state属性
 * computed() 就是 getters
 * function() 就是 actions
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

type ChainInfoObj = {
  chain: string // 币名
  chainCode: string // 币ID
  pairAddress: string // 币 pairAddress
  timeType: string // 时间类型
}

export const useChainInfoStore = defineStore('chainInfo', () => {
  const chainInfo = ref<ChainInfoObj>({
    chain: '',
    chainCode: '',
    pairAddress: '',
    timeType: ''
  })

  function createChainInfo(val: any): void {
    chainInfo.value = val || {}
  }

  return { chainInfo, createChainInfo }
})
