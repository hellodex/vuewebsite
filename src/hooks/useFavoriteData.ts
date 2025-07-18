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
  const accountInfo = computed(() => globalStore.accountInfo)

  // 监听连接钱包的变化
  watch(isConnected, (newValue) => {
    if (newValue) {
      // console.log('favorite1')
      getListFavorite()
    }
  })

  // 监听地址和链ID变化
  watch([address, chainId], () => {
    if (isConnected.value) {
      // console.log('favorite2')
      getListFavorite()
    }
  })

  // 账户模式下 地址变化
  watch(
    () => customWalletInfo.value,
    (newVal, oldVal) => {
      if (accountInfo.value) {
        getListFavorite()
      }
    }
  )
  const getListFavorite = async () => {
    // 检查是否已登录（钱包连接或账户登录）
    if (!isConnected.value && !accountInfo.value) {
      globalStore.setFavoriteData([])
      return
    }
    
    const res = await APIlistFavorite({})
    globalStore.setFavoriteData(res || [])
  }

  // 初始化时检查登录状态
  if (isConnected.value || accountInfo.value) {
    getListFavorite()
  }
}
