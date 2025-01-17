import { ref } from 'vue'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'
import { APItokenPrice, APIGetSolGoPlus } from '@/api/coinWalletDetails'

import { GoPlus, ErrorCode } from '@goplus/sdk-node'
import { CHAIN_ID } from '@/types'

export function useBaseInfo() {
  const tradingLoading = ref<boolean>(true)
  const useChainInfo = useChainInfoStore()
  const chainInfo = useChainInfo.chainInfo
  const useTokenInfo = useTokenInfoStore()
  const tokenInfo = useTokenInfo.tokenInfo // 解构变量 通过 storeToRefs 变成响应式
  const coinGoPlusInfo = ref<any>(null)

  const priceInfo = ref<any>({})

  async function getTokenPrice() {
    const res: any = await APItokenPrice({
      pairAddress: chainInfo?.pairAddress,
      chainCode: chainInfo?.chainCode
    })
    priceInfo.value = res
    sessionStorage.setItem('basePrice', priceInfo.value.price)
    tradingLoading.value = false
  }

  async function getGoPlus(baseAddress: string | undefined, chainCode: string) {
    if (!baseAddress) return
    const res = await GoPlus.tokenSecurity(CHAIN_ID[chainCode], baseAddress, 30)
    if (res.code != ErrorCode.SUCCESS) {
      console.error(res.message)
      getGoPlus(baseAddress, chainCode)
    } else {
      const data = res.result?.[baseAddress.toLocaleLowerCase()] || {}
      coinGoPlusInfo.value = { ...data }
    }
  }

  async function getSolGoPlus(baseAddress: string | undefined) {
    if (!baseAddress) return
    const res: any = await APIGetSolGoPlus(baseAddress)
    console.log('APIGetSolGoPlus', res)
    if (res) {
      const data = res?.[baseAddress] || {}
      coinGoPlusInfo.value = {
        ...data,
        chainCode: 'SOLANA'
      }
    } else {
      getSolGoPlus(baseAddress)
    }
  }
  getTokenPrice()

  if (chainInfo.chainCode !== 'SOLANA') {
    getGoPlus(tokenInfo?.baseAddress, chainInfo.chainCode)
  }

  if (chainInfo.chainCode == 'SOLANA') {
    getSolGoPlus(tokenInfo?.baseAddress)
  }

  return {
    tradingLoading,
    priceInfo,
    tokenInfo,
    coinGoPlusInfo,
    chainInfo
  }
}
