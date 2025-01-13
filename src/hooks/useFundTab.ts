import { ref } from 'vue'
import {
  APIgetflowGroup,
  APIgetTopNet,
  APIgetTopProfit,
  APIlistPeriod
} from '@/api/coinWalletDetails'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'
import { formatDateHM } from '@/utils'

export function useFlowGroup() {
  const chainInfo = useChainInfoStore().chainInfo
  const tokenInfo = useTokenInfoStore().tokenInfo
  const flowGroup = ref<any>([])
  async function getflowGroup() {
    const res = await APIgetflowGroup({
      baseAddress: tokenInfo?.baseAddress,
      pairAddress: chainInfo?.pairAddress,
      chainCode: chainInfo?.chainCode
    })
    flowGroup.value = res || []
  }
  getflowGroup()

  return {
    flowGroup
  }
}

export function useListPeriod(period: any) {
  const chainInfo = useChainInfoStore().chainInfo
  const tokenInfo = useTokenInfoStore().tokenInfo
  const datares = ref<any>([])
  const chartx = ref<any>([])
  const chartIn = ref<any>([])
  const chartOut = ref<any>([])

  async function getlistPeriod() {
    const res = await APIlistPeriod({
      period: period,
      baseAddress: tokenInfo?.baseAddress,
      limit: 10,
      pairAddress: chainInfo?.pairAddress,
      chainCode: chainInfo?.chainCode
    })
    datares.value = res
    datares.value.reverse()
    chartx.value.length = 0
    chartIn.value.length = 0
    chartOut.value.length = 0
    for (let i = 0; i < datares.value.length; i++) {
      chartx.value.push(formatDateHM(datares.value[i].period))
      chartIn.value.push(datares.value[i].in)
      chartOut.value.push(datares.value[i].out)
    }
  }
  getlistPeriod()

  return {
    chartx,
    chartIn,
    chartOut
  }
}

export function useTopNet(type: number) {
  const chainInfo = useChainInfoStore().chainInfo
  const tokenInfo = useTokenInfoStore().tokenInfo
  const loading = ref<boolean>(true) // 页面loading
  const TopNet = ref<any>([])

  async function getTopNet() {
    const res = await APIgetTopNet({
      baseAddress: tokenInfo?.baseAddress,
      flowType: type,
      limit: 10,
      pairAddress: chainInfo?.pairAddress,
      chainCode: chainInfo?.chainCode
    })
    TopNet.value = res
    loading.value = false
  }

  getTopNet()

  return {
    TopNet,
    loading
  }
}

export function useTopProfit(type: number) {
  const chainInfo = useChainInfoStore().chainInfo
  const tokenInfo = useTokenInfoStore().tokenInfo
  const loading = ref<boolean>(true) // 页面loading
  const TopProfit = ref<any>([])

  async function getTopProfit() {
    const res = await APIgetTopProfit({
      baseAddress: tokenInfo?.baseAddress,
      flowType: type,
      limit: 10,
      pairAddress: chainInfo?.pairAddress,
      chainCode: chainInfo?.chainCode
    })
    TopProfit.value = res
    loading.value = false
  }
  getTopProfit()

  return {
    TopProfit,
    loading
  }
}
