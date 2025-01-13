import { ref } from 'vue'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'

//获得交易数据
import { APItransfer } from '@/api/coinWalletDetails'

export function useTransferAccountsTab() {
  const tokenInfo = useTokenInfoStore().tokenInfo
  const chainInfo: any = useChainInfoStore().chainInfo
  const loading = ref<boolean>(true) // 页面loading
  const transferInfo = ref<any>({})

  async function gettransfer() {
    const res: any = await APItransfer({
      baseAddress: tokenInfo?.baseAddress,
      chainCode: chainInfo?.chainCode,
      pairAddress: chainInfo?.pairAddress
    })
    transferInfo.value = res.page?.records || []
    loading.value = false
  }
  gettransfer()

  return {
    transferInfo,
    loading
  }
}
