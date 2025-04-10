import http from './http'

// web端 api
const WEB_URL = import.meta.env.VITE_API_URL

// app端 api
const APP_URL = import.meta.env.VITE_APP_API_URL

/**
 * @description 获取 非 SOLANA 历史K线数据
 * @param data
 * @returns
 */
export function APIgetChart(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/kChart/getChart',
    method: 'POST',
    data
  })
}

/**
 * @description 历史K线数据
 * @param data
 * @returns
 */
export function APIkCharts(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/kChart/kChartsAndSwap',
    method: 'POST',
    data
  })
}

/**
 * @description 获取实时K线
 * @param data
 * @returns
 */
export function APIsubscribeKChart(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/kChart/subscribeKChart',
    method: 'POST',
    data
  })
}

/**
 * @description 获取实时K线及交易
 * @param data
 * @returns
 */
export function APIsubscribeKChartAndSwap(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/kChart/subscribeKChartAndSwap',
    method: 'POST',
    data
  })
}

/**
 * @description 获取首页 涨幅榜、跌幅榜、最近添加、 以太坊等网络数据 -> 废弃
 * @param data
 * @returns
 */
export function APIgetTokenInfoByChain(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/getTokenInfoByChain',
    method: 'POST',
    data
  })
}

/**
 * @description 获取首页 涨幅榜、跌幅榜、最近添加、 以太坊等网络数据
 * @returns
 */
export function APIinitTokenInfo() {
  return http({
    url: WEB_URL + '/api/webv2/index/initTokenInfo',
    method: 'POST'
  })
}

/**
 * @description 获取榜单数据
 * @param data
 * @returns
 */
export function ApiGetRankings(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/getRankings',
    method: 'POST',
    data
  })
}

/**
 * @description 获取Pump数据
 * @param data
 * @returns
 */
export function ApiGetPumpRanking(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/getPumpRanking',
    method: 'POST',
    data
  })
}

/**
 * @description 获取实时价格
 * @param data
 * @returns
 */
export function APIfreshPriceList(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/freshPriceList',
    method: 'POST',
    data
  })
}

/**
 * @description 通过地址 获取实时价格 -> 废弃
 * @param data
 * @returns
 */
export function APIgetPriceListByPairAddress(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/getPriceListAndKchartByPairAddress',
    method: 'POST',
    data
  })
}

/**
 * @description 通过地址 获取实时价格 -> 废弃
 * @param data
 * @returns
 */
export function APIgetPriceListBySearchId(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/getPriceListAndKchartBySearchId',
    method: 'POST',
    data
  })
}

/**
 * @description 获取公链ID
 * @param data
 * @returns
 */
export function APIgetChain(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/getChain',
    method: 'POST',
    data
  })
}

/**
 * @description 获取获取模糊索引id
 * @param data
 * @returns
 */
export function APIIndexer(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/indexer/search',
    method: 'POST',
    data
  })
}

/**
 * @description 通过ids获得token列表 -> 废弃
 * @param data
 * @returns
 */
export function APIListTokens(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/indexer/listTokens',
    method: 'POST',
    data
  })
}

/**
 * @description 搜索接口
 * @param data
 * @returns
 */
export function APISearchToken(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/search/searchToken',
    method: 'POST',
    data
  })
}

/**
 * @description 上传holders
 * @param data
 * @returns
 */
export function APIUpdateHolders(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/updateHolders',
    method: 'POST',
    data
  })
}

/**
 * @description 资产列表
 * @param data
 * @returns
 */
export function APIgetTokensByWalletAddr(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/getTokensByWalletAddress',
    method: 'POST',
    data
  })
}

/**
 * @description 获取ido信息
 * @returns
 */
export function APIgetidoInfo() {
  return http({
    url: WEB_URL + '/api/webv2/index/getidoInfo',
    method: 'POST'
  })
}

/**
 * @description 聪明钱列表
 * @param data
 * @returns
 */
export function APIlistSmartWallet(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/listSmartWallet',
    method: 'POST',
    data
  })
}

/**
 * @description web 前100买入接口
 * @param data
 * @returns
 */
export function APIearliest100Trader(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/earliest100Trader',
    method: 'POST',
    data
  })
}

/**  APP 接口 **/

/**
 * @description 获取首页数据
 * @param data
 * @returns
 */
export function getAppHome(data: object) {
  return http({
    url: APP_URL + '/api/appv2/getHome',
    method: 'POST',
    data
  })
}

/**
 * @description 获取app 榜单数据
 * @param data
 * @returns
 */
export function getAppRankings(data: object) {
  return http({
    url: APP_URL + '/api/appv2/getRankings',
    method: 'POST',
    data
  })
}

/**
 * @description 获取app 币列表价格
 * @param data
 * @returns
 */
export function getAppPriceListByPairAddress(data: object) {
  return http({
    url: APP_URL + '/api/appv2/getPriceListByPairAddress',
    method: 'POST',
    data
  })
}

/**
 * @description app 搜索
 * @param data
 * @returns
 */
export function getAppSearch(data: object) {
  return http({
    url: APP_URL + '/api/appv2/search',
    method: 'POST',
    data
  })
}

/**
 * @description h5端 K线
 * @param data
 * @returns
 */
export function APIappGetChart(data: object) {
  return http({
    url: APP_URL + '/api/appv2/kChart/getChart',
    method: 'POST',
    data
  })
}

/**
 * @description h5端 实时k线
 * @param data
 * @returns
 */
export function APIappSubscribeKChartAndSwap(data: object) {
  return http({
    url: APP_URL + '/api/appv2/kChart/subscribeKChartAndSwap',
    method: 'POST',
    data
  })
}

/**
 * @description 铭文列表
 * @param data
 * @returns
 */
export function APIinscription(data: object) {
  return http({
    url: APP_URL + '/api/bnb48club/list',
    method: 'POST',
    data
  })
}

/**
 * @description 获取 h5 Pump数据
 * @param data
 * @returns
 */
export function APIh5PumpRanking(data: object) {
  return http({
    url: APP_URL + '/api/appv2/getPumpRanking',
    method: 'POST',
    data
  })
}

/**
 * @description 快讯
 * @returns
 */
export function APIopenFlash() {
  return http({
    url: APP_URL + '/api/bnb48club/openFlash',
    method: 'GET'
  })
}

/**
 * @description 初始化积分
 * @param data
 * @returns
 */
export function APIinitPointsPage(data: object) {
  return http({
    url: APP_URL + '/api/appv2/initPointsPage',
    method: 'POST',
    data
  })
}

/**
 * @description 绑定邀请码
 * @param data
 * @returns
 */
export function APIbindInvitationCode(data: object) {
  return http({
    url: APP_URL + '/api/appv2/bindInvitationCode',
    method: 'POST',
    data
  })
}

/**
 * @description 获得签到积分
 * @param data
 * @returns
 */
export function APIearnCheckinPoints(data: object) {
  return http({
    url: APP_URL + '/api/appv2/earnCheckinPoints',
    method: 'POST',
    data
  })
}

/**
 * 获取 k线 N 条数据
 * @param data
 * @returns
 */
export function APIgetChartByBaseAddress(data: object) {
  return http({
    url: APP_URL + '/api/appv2/kChart/getChartByBaseAddress',
    method: 'POST',
    data
  })
}

/**
 * 转账记录
 * @param data
 * @returns
 */
export function APIgetMaxPool(data: object) {
  return http({
    url: APP_URL + '/api/appv2/getMaxPool',
    method: 'POST',
    data
  })
}

/**
 * @description 获取 solana 账户余额
 * @param params
 * @returns
 */
export function solanaBalance(params: object) {
  return http({
    url: 'https://rpc.ankr.com/solana',
    method: 'POST',
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params
    }
  })
}

/**
 * @description 交易数据
 * @param data
 * @returns
 */
export function APIgetTokenTransaction(data: object) {
  return http({
    url: APP_URL + '/api/appv2/getTokenTransaction',
    method: 'POST',
    data
  })
}

/**
 * 手续费 收入
 * @param data
 * @returns
 */
export function APIgetFeeVolume() {
  return http({
    url: APP_URL + '/api/appv2/getFeeVolume',
    method: 'POST'
  })
}

/**
 * @description h5 前100买入接口
 * @param data
 * @returns
 */
export function APIh5Earliest100Trader(data: object) {
  return http({
    url: APP_URL + '/api/appv2/earliest100Trader',
    method: 'POST',
    data
  })
}

/** 账户模式 api */

/**
 * @description 自定义钱包 转出
 * @param data
 * @returns
 */
export function APItransferTo(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/trade/transferTo',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 自定义钱包 转出
 * @param data
 * @returns
 */
export function APItransferToV2(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/trade/transferToV2',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description gas费估算
 * @param data
 * @returns
 */
export function APItransferEstimateGas(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/index/transferEstimateGas',
    method: 'POST',
    data
  })
}

/**
 * @description 创建限价单
 * @param data
 * @returns
 */
export function APIcreateOrder(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/trade/createOrder',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 取消限价单
 * @param data
 * @returns
 */
export function APIcancelOrder(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/order/cancelOrder',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 查询返佣详情
 * @param data
 * @returns
 */
export function APIgetCommissionDetail(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/commission/getCommissionDetail',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 我的返佣概览
 * @param data
 * @returns
 */
export function APIgetMyCommissionSummary(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/commission/getMyCommissionSummary',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 提现
 * @param data
 * @returns
 */
export function APIwithdraw(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/commission/withdraw',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 提现记录
 * @param data
 * @returns
 */
export function APIgetWithdrawDetail(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/commission/getWithdrawDetail',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 刷新仓位
 * @param data
 * @returns
 */
export function APIrefreshhold(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/order/refreshhold',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 *
 * @param data 转账记录
 * @returns
 */
export function APIlistTransferHistory(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/order/listTransferHistory',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * 钱包汇总
 * @param data
 * @returns
 */
export function APIwalletAnalysisSummary(data: object) {
  return http({
    url: `${WEB_URL}/api/webv2/walletAnalysis/walletAnalysisSummary`,
    method: 'POST',
    data
  })
}

/**
 * 盈利分布详情
 * @param data
 * @returns
 */
export function APIwalletAnalysisToken(data: object) {
  return http({
    url: `${WEB_URL}/api/webv2/walletAnalysis/walletAnalysisToken`,
    method: 'POST',
    data
  })
}

/**
 * 持有代币
 * @param data
 * @returns
 */
export function APIwalletAnalysisHoldings(data: object) {
  return http({
    url: `${WEB_URL}/api/webv2/walletAnalysis/walletAnalysisHoldings`,
    method: 'POST',
    data
  })
}

/**
 * 最近盈亏 Recent Profit and Loss
 * @param data
 * @returns
 */
export function APIwalletAnalysisRecentPL(data: object) {
  return http({
    url: `${WEB_URL}/api/webv2/walletAnalysis/walletAnalysisRecentPL`,
    method: 'POST',
    data
  })
}

/**
 * 活动
 * @param data
 * @returns
 */
export function APIwalletAnalysisActivity(data: object) {
  return http({
    url: `${WEB_URL}/api/webv2/walletAnalysis/walletAnalysisActivity`,
    method: 'POST',
    data
  })
}

/**
 * @description 根据 token 获取代币
 * @param data
 * @returns
 */
export function APIgetTokenMata(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/getTokenMata',
    method: 'POST',
    data
  })
}

/**
 * @description 根据 BaseAddress 进行询价
 * @param data
 * @returns
 */
export function APItokenPriceByBaseAddress(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/tokenPriceByBaseAddress',
    method: 'POST',
    data
  })
}

/**
 * @description 估计gas费
 * @param data
 * @returns
 */
export function APItokenEstimateGas(data: object) {
  return http({
    url: WEB_URL + '/api/webv2/token/estimateGas',
    method: 'POST',
    data
  })
}

/**
 * @description 创建或更新用户token订阅
 * @param data
 * @returns
 */

export function APIupdateCommonSubscribe(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/sub/updateCommonSubscribe',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 获取某个链的用户代币订阅列表
 * @param data
 * @returns
 */

export function APIlistUserTokenSubscribe(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/sub/listUserTokenSubscribe',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 更新用户订阅设置
 * @param data
 * @returns
 */

export function APIupdateUserSubscribeSetting(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/sub/updateUserSubscribeSetting',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 删除用户的某个代币的某种订阅
 * @param data
 * @returns
 */

export function APIdeleteUserTokenSubscribe(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/sub/deleteUserTokenSubscribe',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 暂停用户的某个代币的某种订阅
 * @param data
 * @returns
 */

export function APIpauseUserTokenSubscribe(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/sub/pauseUserTokenSubscribe',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * @description 启动用户的某个代币的某种订阅
 * @param data
 * @returns
 */

export function APIresumeUserTokenSubscribe(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/sub/resumeUserTokenSubscribe',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

export function APIgetUserSubscribe(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/sub/getUserSubscribe',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}

/**
 * 冲土狗领U
 * @param data
 * @returns
 */
export function APImemeClaim(data: object) {
  const account: any = localStorage.getItem('accountInfo')
  return http({
    url: WEB_URL + '/api/auth/meme/claim',
    method: 'POST',
    data,
    headers: {
      [`${JSON.parse(account)?.tokenInfo.tokenName}`]: `Bearer ${JSON.parse(account)?.tokenInfo.tokenValue}`
    }
  })
}
