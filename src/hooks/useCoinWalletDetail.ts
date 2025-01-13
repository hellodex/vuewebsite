//请求goplus数据上传服务器
import { GoPlus, ErrorCode } from '@goplus/sdk-node'
import { APIbuildIndexers } from '@/api/coinWalletDetails'
import { APIUpdateHolders } from '@/api/index'

export function useCoinWalletDetail() {
  async function UpdateHolders(address: string, chainCode: string, holders: number) {
    const res = await APIUpdateHolders({
      address: address,
      chainCode: chainCode,
      holders: holders
    })
    console.log(res)
  }

  async function getGoPlus() {
    const res = await GoPlus.tokenSecurity(56, '0xEa51801b8F5B88543DdaD3D1727400c15b209D8f', 30)
    if (res.code != ErrorCode.SUCCESS) {
      console.error(res.message)
    } else {
      const holders = res.result
        ? res.result['0xEa51801b8F5B88543DdaD3D1727400c15b209D8f'.toLocaleLowerCase()].holder_count
        : ''

      UpdateHolders('0xEa51801b8F5B88543DdaD3D1727400c15b209D8f', 'BSC', holders)
    }
  }

  //构建索引
  async function buildIndexers() {
    const res = await APIbuildIndexers({ type: false })
    console.log(res)
  }

  buildIndexers()
  getGoPlus()
}
