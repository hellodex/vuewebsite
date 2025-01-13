import { ref } from 'vue'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'
import { APItokenPrice } from '@/api/coinWalletDetails'

export function useBaseInfo() {
  const tradingLoading = ref<boolean>(true)
  const useChainInfo = useChainInfoStore()
  const chainInfo = useChainInfo.chainInfo
  const useTokenInfo = useTokenInfoStore()
  const tokenInfo = useTokenInfo.tokenInfo // 解构变量 通过 storeToRefs 变成响应式

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
  getTokenPrice()
  return {
    tradingLoading,
    priceInfo,
    tokenInfo,
    chainInfo
  }
}
