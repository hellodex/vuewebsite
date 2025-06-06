import http from './http'

// web端 api
const WEB_URL = import.meta.env.VITE_API_URL

// app端 api
const APP_URL = import.meta.env.VITE_APP_API_URL

/**
 * @description 交易
 * @param data
 * @returns
 */
export function APIgetTransaction(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/pageFlow',
    method: 'POST',
    data
  })
}

/**
 * @description 我的
 * @param data
 * @returns
 */
export function APIgetMyStock(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/myStock',
    method: 'POST',
    data
  })
}

/**
 * @description 我的历史记录
 * @param data
 * @returns
 */
export function APIgetMyPageFlow(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/myPageFlow',
    method: 'POST',
    data
  })
}

/**
 * @description 持币排行
 * @param data
 * @returns
 */
export function APIgetTopHold(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/topHold',
    method: 'POST',
    data
  })
}

/**
 * @description 资金-净买入、卖出榜单
 * @param data
 * @returns
 */
export function APIgetTopNet(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/topNet',
    method: 'POST',
    data
  })
}

/**
 * @description 资金-盈利亏损榜单
 * @param data
 * @returns
 */
export function APIgetTopProfit(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/topProfit',
    method: 'POST',
    data
  })
}

/**
 * @description 资金-大资金
 * @param data
 * @returns
 */
export function APIgetflowGroup(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/flowGroup',
    method: 'POST',
    data
  })
}

/**
 * @description LP列表
 * @param data
 * @returns
 */
export function APIgetPageLp(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/listLp',
    method: 'POST',
    data
  })
}

/**
 * @description 池子列表
 * @param data
 * @returns
 */
export function APIgetPools(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/pools',
    method: 'POST',
    data
  })
}

/**
 * @description 资金曲线图
 * @param data
 * @returns
 */
// export function APIlistPeriod(data: object) {
//   return http({
//     url: WEB_URL + '/api/webv2/token/listPeriod',
//     method: 'POST',
//     data
//   })
// }

/**
 * @description 转账信息
 * @param data
 * @returns
 */
export function APItransfer(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/transfer',
    method: 'POST',
    data
  })
}

/**
 * @description 构建索引
 * @param data
 * @returns
 */
export function APIbuildIndexers(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/indexer/buildIndexers',
    method: 'POST',
    data
  })
}

/**
 * @description 获取token信息
 * @param data
 * @returns
 */
export function APIinitTokenData(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/initTokenData',
    method: 'POST',
    data
  })
}

/**
 * @description 通过base获取token信息
 * @param data
 * @returns
 */
export function APIgetMaxPool(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/getMaxPool',
    method: 'POST',
    data
  })
}

/**
 * @description 获取pair信息
 * @param data
 * @returns
 */
export function APIpairInfo(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/pairInfo',
    method: 'POST',
    data
  })
}

/**
 * @description 获取tokenPrice信息
 * @param data
 * @returns
 */
export function APItokenPrice(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/tokenPrice',
    method: 'POST',
    data
  })
}

/**
 * @description 交易
 * @param data
 * @returns
 */
export function APIgetSwap(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/getSwap',
    method: 'POST',
    data
  })
}

/**
 * @description 获取支持的公链返回包装主网币 的合约地址
 * @param data
 * @returns
 */
export function APIgetChainConfigs(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/getChainConfigs',
    method: 'POST',
    data
  })
}

/**  APP 接口 **/

/**
 * @description h5端 池子
 * @param data
 * @returns
 */
export function APIappGetPools(data: object) {
  return http({
    url: APP_URL + '/api/appv2/pools',
    method: 'POST',
    data
  })
}

/**
 * @description 资金
 * @param data
 * @returns
 */
export function APIappGetFunds(data: object) {
  return http({
    url: APP_URL + '/api/appv2/funds',
    method: 'POST',
    data
  })
}

/**
 * 获取sol检测信息
 * @param address
 * @returns
 */
export function APIGetSolGoPlus(address: string) {
  return http({
    url: 'https://api.gopluslabs.io/api/v1/solana/token_security',
    method: 'GET',
    params: {
      contract_addresses: address
    }
  })
}

/**  账户模式 接口 **/

/**
 * @description 自定义钱包交易
 * @param data
 * @returns
 */
export function APIauthTradeSwap(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/trade/swap',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 查询用户订单和仓位
 * @param data
 * @returns
 */
export function listOrdersAndPosition(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/order/listOrdersAndPosition',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 委托历史
 * @param data
 * @returns
 */
export function listHistoryOrders(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/order/listHistoryOrders',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 当前委托 我的持币 交易历史 委托历史
 * @param data
 * @returns
 */
export function initLimitedOrderPage(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/order/initLimitedOrderPage',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 一键回本
 * @param data
 * @returns
 */
export function APIauthRecoverTradeCost(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/trade/recoverTradeCost',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 收藏
 * @param data
 * @returns
 */
export function APIlistFavorite(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/listFavorite',
    method: 'POST',
    data
  })
}

/**
 * @description 创建收藏
 * @param data
 * @returns
 */
export function APIaddFavorite(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/addFavorite',
    method: 'POST',
    data
  })
}

/**
 * @description 删除收藏
 * @param data
 * @returns
 */
export function APIdeleteFavorite(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/deleteFavorite',
    method: 'POST',
    data
  })
}
