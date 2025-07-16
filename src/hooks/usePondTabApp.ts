import { ref } from 'vue'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'
import { APIappGetPools, APIGetSolGoPlus } from '@/api/coinWalletDetails'
import { CHAIN_ID } from '@/types'

//goplus获取LP数据
import { GoPlus, ErrorCode } from '@goplus/sdk-node'

export function usePondTabApp() {
  const tokenInfo = useTokenInfoStore().tokenInfo
  const chainInfo = useChainInfoStore().chainInfo
  const lpList = ref<any>([])
  const pools = ref<any>([])
  const poolList = ref<any>([])
  const mobilityList = ref<any>([])
  const poolChainInfo = ref<any>(null)
  const holder = ref<number | string>(0)
  const coinGoPlusInfo = ref<any>(null)

  async function getPools() {
    const res = await APIappGetPools({
      baseAddress: tokenInfo?.baseAddress,
      chainCode: chainInfo?.chainCode
    })

    pools.value = res || []
    for (let i = 0; i < pools.value.length; i++) {
      const num1 = pools.value[i].baseToken.amount
      const num2 = pools.value[i].quoteToken.amount
      poolList.value.push({
        id: i,
        coinName1: pools.value[i].baseToken.symbol,
        coinName2: pools.value[i].quoteToken.symbol,
        num1: num1,
        num2: num2,
        price: pools.value[i].tvl
      })
    }
    mobilityList.value = pools.value[0].addLps
      ? pools.value[0].addLps.map((item: { baseTokenSymbol: any; quoteTokenSymbol: any }) => {
          item.baseTokenSymbol = pools.value[0].baseToken.symbol
          item.quoteTokenSymbol = pools.value[0].quoteToken.symbol

          return item
        })
      : []

    poolChainInfo.value = pools.value[0]
  }

  async function getGoPlus(baseAddress: string | undefined, chainCode: string) {
    if (!baseAddress) return
    const res = await GoPlus.tokenSecurity(CHAIN_ID[chainCode], baseAddress, 30)
    if (res.code != ErrorCode.SUCCESS) {
      // console.error(res.message)
      setTimeout(() => {
        getGoPlus(baseAddress, chainCode)
      }, 2000)
    }
    const data = res.result?.[baseAddress.toLocaleLowerCase()] || {}
    lpList.value = data.lp_holders
    holder.value = data.holder_count
    coinGoPlusInfo.value = { ...data }
  }

  async function getSolGoPlus(baseAddress: string | undefined) {
    if (!baseAddress) return
    const res: any = await APIGetSolGoPlus(baseAddress)
    // console.log(res)
    const data = res?.[baseAddress] || {}
    coinGoPlusInfo.value = {
      ...data,
      chainCode: 'SOLANA'
    }
  }

  getPools()

  if (chainInfo.chainCode !== 'SOLANA') {
    getGoPlus(tokenInfo?.baseAddress, chainInfo.chainCode)
  }

  if (chainInfo.chainCode == 'SOLANA') {
    getSolGoPlus(tokenInfo?.baseAddress)
  }

  return {
    poolList,
    lpList,
    mobilityList,
    poolChainInfo,
    holder,
    coinGoPlusInfo
  }
}
