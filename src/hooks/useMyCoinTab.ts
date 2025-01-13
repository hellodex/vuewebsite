import { ref, computed } from 'vue'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { APIgetMyStock, APIgetMyPageFlow } from '@/api/coinWalletDetails'
import { useGlobalStore } from '@/stores/global'

const mystock = ref<any>({})
const transactionInfo = ref<any>([])
const loading = ref<boolean>(true)
export function useMyCoinTab() {
  const tokenInfo = useTokenInfoStore().tokenInfo
  const chainInfo = useChainInfoStore().chainInfo
  const globalStore = useGlobalStore()
  const address = computed(() => globalStore.walletInfo.address)
  const isConnected = computed(() => globalStore.walletInfo.isConnected)
  const params = {
    pairAddress: chainInfo?.pairAddress,
    chainCode: chainInfo?.chainCode,
    baseAddress: tokenInfo?.baseAddress,
    quoteAddress: tokenInfo?.quoteAddress,
    walletAddress: address?.value?.toLowerCase()
  }
  async function getTransaction() {
    const res: any = isConnected.value
      ? await APIgetMyPageFlow({
          chain: chainInfo?.chain,
          ...params
        })
      : null
    transactionInfo.value = res?.records || []
  }
  async function getMystock() {
    const res = await APIgetMyStock({
      ...params
    })
    mystock.value = res || {}
  }

  const initData = async () => {
    await getTransaction()
    await getMystock()
    loading.value = false
  }
  initData()

  return {
    transactionInfo,
    mystock,
    loading
  }
}
