import { ref } from 'vue'
import { APIpairInfo } from '@/api/coinWalletDetails'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'

const loadRightSideBar = ref<boolean>(true)
const pairInfo = ref<any>({})

export function useRightSideBar() {
  const useChainInfo = useChainInfoStore()
  const chainInfo = useChainInfo.chainInfo
  const useTokenInfo = useTokenInfoStore()
  const tokenInfo = useTokenInfo.tokenInfo // 解构变量 通过 storeToRefs 变成响应式
  async function getPairInfo() {
    const res = await APIpairInfo({
      pairAddress: chainInfo?.pairAddress,
      baseAddress: tokenInfo?.baseAddress,
      chainCode: chainInfo?.chainCode
    })
    pairInfo.value = { ...res }
    loadRightSideBar.value = false
  }

  getPairInfo()

  return {
    pairInfo,
    loadRightSideBar
  }
}
