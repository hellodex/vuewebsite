import { ref } from 'vue'
import { APIpairInfo, APIGetSolGoPlus } from '@/api/coinWalletDetails'
import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { GoPlus, ErrorCode } from '@goplus/sdk-node'

import { CHAIN_ID } from '@/types'
const loadRightSideBar = ref<boolean>(true)
const coinGoPlusInfo = ref<any>(null)
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

  async function getGoPlus(baseAddress: string | undefined, chainCode: string) {
    if (!baseAddress) return
    const res = await GoPlus.tokenSecurity(CHAIN_ID[chainCode], baseAddress, 30)
    if (res.code != ErrorCode.SUCCESS) {
      console.error(res.message)
    } else {
      const data = res.result?.[baseAddress.toLocaleLowerCase()] || {}
      coinGoPlusInfo.value = { ...data }
    }
  }

  async function getSolGoPlus(baseAddress: string | undefined) {
    if (!baseAddress) return
    const res: any = await APIGetSolGoPlus(baseAddress)
    console.log(res)
    if (res) {
      const data = res?.[baseAddress] || {}
      coinGoPlusInfo.value = {
        ...data,
        chainCode: 'SOLANA'
      }
    }
  }

  getPairInfo()
  if (chainInfo.chainCode !== 'SOLANA') {
    getGoPlus(tokenInfo?.baseAddress, chainInfo.chainCode)
  }

  if (chainInfo.chainCode == 'SOLANA') {
    getSolGoPlus(tokenInfo?.baseAddress)
  }

  return {
    pairInfo,
    coinGoPlusInfo,
    loadRightSideBar
  }
}
