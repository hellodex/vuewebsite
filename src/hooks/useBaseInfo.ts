import { ref } from 'vue'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import { APItokenPrice, APIGetSolGoPlus } from '@/api/coinWalletDetails'

import { GoPlus, ErrorCode } from '@goplus/sdk-node'
import { CHAIN_ID } from '@/types'

export function useBaseInfo() {
  const useSubscribeKChart = useSubscribeKChartInfo()
  const tradingLoading = ref<boolean>(true)
  const useChainInfo = useChainInfoStore()
  const chainInfo = useChainInfo.chainInfo
  const useTokenInfo = useTokenInfoStore()
  const tokenInfo = useTokenInfo.tokenInfo // 解构变量 通过 storeToRefs 变成响应式
  const coinGoPlusInfo = ref<any>(null)

  async function getTokenPrice() {
    const res: any = await APItokenPrice({
      pairAddress: chainInfo?.pairAddress,
      chainCode: chainInfo?.chainCode
    })

    useSubscribeKChart.createSubscribeKChartInfo({
      C: res?.price,
      H: res?.price,
      L: res?.price,
      O: res?.price,
      chg: res?.chg,
      timestamp: ''
    })

    sessionStorage.setItem('basePrice', res?.price)
    tradingLoading.value = false
  }

  async function getGoPlus(baseAddress: string | undefined, chainCode: string) {
    if (!baseAddress) return
    const res = await GoPlus.tokenSecurity(CHAIN_ID[chainCode], baseAddress, 30)
    if (res.code != ErrorCode.SUCCESS) {
      // console.error(res.message)
      setTimeout(() => {
        getGoPlus(baseAddress, chainCode)
      }, 2000)
    } else {
      const data = res.result?.[baseAddress.toLocaleLowerCase()] || {}
      coinGoPlusInfo.value = { ...data }
    }
  }

  async function getSolGoPlus(baseAddress: string | undefined) {
    if (!baseAddress) return
    const res: any = await APIGetSolGoPlus(baseAddress)
    // console.log('APIGetSolGoPlus', res)
    if (res) {
      const data = res?.[baseAddress] || {}
      coinGoPlusInfo.value = {
        ...data,
        chainCode: 'SOLANA'
      }
    } else {
      setTimeout(() => {
        getSolGoPlus(baseAddress)
      }, 2000)
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
    tokenInfo,
    coinGoPlusInfo,
    chainInfo
  }
}
