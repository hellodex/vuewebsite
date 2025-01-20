import { ref } from 'vue'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'
import { APIgetPools } from '@/api/coinWalletDetails'
import { CHAIN_ID } from '@/types'

//goplus获取LP数据
import { GoPlus, ErrorCode } from '@goplus/sdk-node'

export function usePondTab() {
  const tokenInfo = useTokenInfoStore().tokenInfo
  const chainInfo = useChainInfoStore().chainInfo
  const lpList = ref<any>([])
  const pools = ref<any>([])
  const poolList = ref<any>([])
  const mobilityList = ref<any>([])
  async function getPools() {
    const res = await APIgetPools({
      baseAddress: tokenInfo?.baseAddress,
      chainCode: chainInfo?.chainCode
    })

    pools.value = res || []
    for (let i = 0; i < pools.value.length; i++) {
      const num1 = pools.value[i].baseAmount
      const num2 = pools.value[i].quoteAmount
      poolList.value.push({
        id: i,
        coinName1: pools.value[i].baseTokenSymbol,
        coinName2: pools.value[i].quoteTokenSymbol,
        num1: num1,
        num2: num2,
        price: num2 * Number(pools.value[i].quotePrice) * 2
      })
    }
    mobilityList.value = pools.value[0].addLps
      ? pools.value[0].addLps.map((item: { baseTokenSymbol: any; quoteTokenSymbol: any }) => {
          item.baseTokenSymbol = pools.value[0].baseTokenSymbol
          item.quoteTokenSymbol = pools.value[0].quoteTokenSymbol

          return item
        })
      : []
  }

  async function getGoPlus(baseAddress: string | undefined, chainCode: string) {
    if (!baseAddress) return
    const res = await GoPlus.tokenSecurity(CHAIN_ID[chainCode], baseAddress, 30)
    if (res.code != ErrorCode.SUCCESS) {
      console.error(res.message)
      setTimeout(() => {
        getGoPlus(baseAddress, chainCode)
      }, 2000)
    } else {
      const data = res.result?.[baseAddress.toLocaleLowerCase()] || {}
      lpList.value = data.lp_holders
    }
  }
  getPools()
  if (chainInfo.chainCode !== 'SOLANA') {
    getGoPlus(tokenInfo?.baseAddress, chainInfo.chainCode)
  }

  return {
    poolList,
    lpList,
    mobilityList
  }
}
