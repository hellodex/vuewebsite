/**
 * ref() 就是 state属性
 * computed() 就是 getters
 * function() 就是 actions
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useChainConfigsStore = defineStore('chainConfigs', () => {
  const chainConfigs = ref<any>(null)

  function createChainConfigs(val: any): void {
    chainConfigs.value = val || null
  }

  return { chainConfigs, createChainConfigs }
})
