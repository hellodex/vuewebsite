import { ref } from 'vue'
import { APIappGetFunds } from '@/api/coinWalletDetails'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'

export function useGetFunds(period: any) {
  const chainInfo = useChainInfoStore().chainInfo
  const tokenInfo = useTokenInfoStore().tokenInfo
  const fundsData = ref<any>(null)
  async function getFunds() {
    const res = await APIappGetFunds({
      baseAddress: tokenInfo?.baseAddress,
      pairAddress: chainInfo?.pairAddress,
      chainCode: chainInfo?.chainCode,
      period,
      limit: 10
    })
    fundsData.value = res || []
  }
  getFunds()

  return {
    fundsData
  }
}
