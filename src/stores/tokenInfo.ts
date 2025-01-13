/**
 * ref() 就是 state属性
 * computed() 就是 getters
 * function() 就是 actions
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

type TokenInfo = {
  baseAddress: string // 基础币地址
  baseSymbol: string // 基础币名字
  quoteAddress: string // 价值币地址
  quoteSymbol: string // 价值币名字
  holders: string // 持有人
  logo: string // 图标
}

export const useTokenInfoStore = defineStore('tokenInfo', () => {
  const tokenInfo = ref<TokenInfo | null>({
    baseAddress: '',
    baseSymbol: '',
    quoteAddress: '',
    quoteSymbol: '',
    holders: '',
    logo: ''
  })

  function createTokenInfo(val: any): void {
    tokenInfo.value = val || {}
  }

  return { tokenInfo, createTokenInfo }
})
