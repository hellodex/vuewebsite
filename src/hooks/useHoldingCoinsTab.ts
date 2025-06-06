import { ref } from 'vue'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'

import { APIgetTopHold } from '@/api/coinWalletDetails'
import { CHAIN_ID } from '@/types'

//goplus获取LP数据
import { GoPlus, ErrorCode } from '@goplus/sdk-node'

export function useHoldingCoinsTab(num: any, name: string) {
  const tokenInfo = useTokenInfoStore().tokenInfo
  const chainInfo = useChainInfoStore().chainInfo
  const loading = ref<boolean>(true)
  const topHolders = ref<any>({})
  const params = {
    baseAddress: tokenInfo?.baseAddress,
    pairAddress: chainInfo?.pairAddress,
    chainCode: chainInfo?.chainCode
  }
  async function getTransaction() {
    const res: any = await APIgetTopHold({
      ...params,
      topN: 100
    })
    topHolders.value = {
      ...res,
      tableData: res.vos?.filter((item: any, index: number) => index < num)
    }
    loading.value = false
  }

  async function getGoPlus() {
    const res = await GoPlus.tokenSecurity(CHAIN_ID[params.chainCode], params.baseAddress, 30)
    if (res.code != ErrorCode.SUCCESS) {
      console.error(res.message)
      setTimeout(() => {
        getGoPlus()
      }, 2000)
    } else {
      const data =
        params.baseAddress && res.result ? res.result[params.baseAddress.toLocaleLowerCase()] : {}
      // console.log(data.lp_holders)
      let topHold = 0
      let topProPortion = 0
      data.holders?.forEach((item: any) => {
        topHold += parseFloat(item.balance)
        topProPortion += parseFloat(item.percent) * 100
      })
      topHolders.value = {
        holds: data.holder_count,
        topHold,
        totalSupply: data.total_supply,
        topProPortion,
        vos: data.holders?.map((item: any) => {
          return {
            amount: item.balance,
            per: item.percent * 100,
            walletAddress: item.address
          }
        }),
        tableData: data.holders?.map((item: any) => {
          return {
            amount: item.balance,
            per: item.percent * 100,
            walletAddress: item.address
          }
        })
      }
      loading.value = false
    }
  }
  params.chainCode == 'SOLANA' ? getTransaction() : getGoPlus()

  return {
    topHolders,
    loading,
    name
  }
}
