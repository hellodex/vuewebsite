/**
 * ref() 就是 state属性
 * computed() 就是 getters
 * function() 就是 actions
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSubscribeKChartInfo = defineStore('subscribeKChartInfo', () => {
  const subscribeKChartInfo = ref<any>({})
  const subscribeSwap = ref<any>([])
  function createSubscribeKChartInfo(val: any): void {
    subscribeKChartInfo.value = val || {}
  }

  function createSubscribeSwapInfo(val: any): void {
    subscribeSwap.value.unshift(val)
  }

  return { subscribeKChartInfo, subscribeSwap, createSubscribeKChartInfo, createSubscribeSwapInfo }
})
