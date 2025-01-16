//请求goplus数据上传服务器
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

  //构建索引
  async function buildIndexers() {
    const res = await APIbuildIndexers({ type: false })
    console.log(res)
  }

  buildIndexers()
}
