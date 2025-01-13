import { watch, computed } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { APIlistFavorite } from '@/api/coinWalletDetails'
import { useChainConfigsStore } from '@/stores/chainConfigs'

export function useFavoriteData() {
  const globalStore = useGlobalStore()
  const chainConfigStore = useChainConfigsStore()

  const chainConfigs = computed(() => chainConfigStore.chainConfigs)
  const address = computed(() => globalStore.walletInfo.address)
  const isConnected = computed(() => globalStore.walletInfo.isConnected)
  const chainId = computed(() => globalStore.walletInfo.chainId)
  const customWalletInfo = computed(() => globalStore.customWalletInfo)
  const walletType = computed(() => globalStore.walletInfo.walletType)

  // 监听连接钱包的变化
  watch(isConnected, (newValue) => {
    if (newValue) {
      console.log('favorite1')
      getListFavorite()
    }
  })

  // 监听地址和链ID变化
  watch([address, chainId], () => {
    if (isConnected.value) {
      console.log('favorite2')
      getListFavorite()
    }
  })

  // 账户模式下 地址变化
  watch(
    () => customWalletInfo.value,
    (newVal, oldVal) => {
      getListFavorite()
    }
  )
  const getListFavorite = async () => {
    const res = await APIlistFavorite({
      chainCode:
        walletType.value == 'Email'
          ? customWalletInfo.value.chainCode
          : chainConfigs.value?.find((item: any) => item.chainId == chainId.value)?.chainCode,
      walletAddress:
        walletType.value == 'Email' ? customWalletInfo.value.walletInfo?.wallet : address.value
    })
    globalStore.setFavoriteData(res || [])
  }

  getListFavorite()
}
