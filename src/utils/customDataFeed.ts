import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import { useGlobalStore } from '@/stores/global'
import { APIpairInfo } from '@/api/coinWalletDetails'
import { formatDecimals, formatDate, pumpFunPercent } from '@/utils'
import { socket } from '@/utils/socket'

// 自定义数据源对象
import { APIkCharts } from '@/api'

function timeFormat(time: any) {
  if (time == '1D' || time == '1W') {
    return time.toLowerCase()
  }
  if (Number(time) >= 60) {
    return Number(time) / 60 + 'h'
  }
  if (Number(time) < 60) {
    return time + 'm'
  }
}

export default class CustomDataFeed {
  _startTime = 0
  timestamp = 0
  _intervalId: any
  // 初始化方法
  onReady(callback: any) {
    setTimeout(() =>
      callback({
        exchanges: [], // 可用的交易所列表
        symbolsTypes: [], // 可用的股票类型列表
        supportedResolutions: [], // 支持的时间间隔列表
        supports_marks: true, // 是否支持标记（例如笔记）
        supports_timescale_marks: true // 是否支持时间轴标记
      })
    )

    // console.log('CustomDataFeed--onReady')
  }
  // 搜索符号
  searchSymbols(userInput: any, exchange: any, symbolType: any, onResultReadyCallback: any) {
    // 根据用户输入搜索符号，获取匹配的股票列表
    // 将结果传递给TradingView
    // onResultReadyCallback(symbols);
    // console.log(userInput, exchange, symbolType, onResultReadyCallback)
  }
  // 获取符号信息
  resolveSymbol(
    symbolName: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
    extension: any
  ) {
    // 解析股票符号，获取相关信息
    // 例如交易所、股票类型、时间间隔等
    // console.log(symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension)
    const pricescale = 10 ** formatDecimals(sessionStorage.getItem('basePrice')).precision

    // console.log(
    //   sessionStorage.getItem('basePrice'),
    //   formatDecimals(sessionStorage.getItem('basePrice'))
    // )
    const symbolInfo = {
      name: symbolName,
      ticker: symbolName,
      description: symbolName,
      type: 'stock', // 股票类型
      session: '24x7', // 交易时间
      exchange: 'hellodex.io', // 交易所
      listed_exchange: 'hellodex.io', // 上市交易所
      timezone: 'Asia/Shanghai', // 时区
      minmov: 1,
      minmov2: 0,
      pricescale: pricescale,
      fractional: false,
      format: 'volume',
      has_intraday: true,
      has_daily: true,
      has_no_volume: false,
      has_weekly_and_monthly: true,
      intraday_multipliers: ['1', '5', '15', '30', '60', '240'],
      supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '1W'], // 支持的时间间隔
      volume_precision: 3, // 成交量精度
      data_status: 'streaming' // 数据状态
    }

    // 回调函数将解析后的符号信息传递给TradingView
    onSymbolResolvedCallback(symbolInfo)
  }

  // 获取历史数据
  async getBars(
    symbolInfo: any,
    resolution: any,
    periodParams: any,
    onHistoryCallback: any,
    onErrorCallback: any
  ) {
    // 使用后端接口获取历史数据
    // 发送请求到后端，获取特定股票在特定时间范围内的历史数据
    // 将数据传递给TradingView
    // onHistoryCallback(data, { noData: false });
    // console.log(symbolInfo, resolution, periodParams, onErrorCallback)

    localStorage.setItem('kchart_tradingTime', resolution)
    const showMarket = eval(localStorage.getItem('showMarket') || 'false')

    if (this._intervalId) {
      clearInterval(this._intervalId)
    }
    const useSubscribeKChart = useSubscribeKChartInfo()
    const useChainInfo = useChainInfoStore()
    const tokenInfo = useTokenInfoStore().tokenInfo
    const chainInfo = useChainInfo.chainInfo
    useChainInfo.createChainInfo({
      chainCode: chainInfo?.chainCode,
      pairAddress: chainInfo?.pairAddress,
      timeType: timeFormat(resolution)
    })
    if (!periodParams.firstDataRequest) {
      onHistoryCallback([], { noData: true })
      return
    }
    // periodParams = {from: 1716366543, to: 1716384543, countBack: 300, firstDataRequest: true}
    const pairInfo: any = await APIpairInfo({
      pairAddress: chainInfo?.pairAddress,
      baseAddress: tokenInfo?.baseAddress,
      chainCode: chainInfo?.chainCode
    })

    const res: any = await APIkCharts({
      kchart: {
        chainCode: chainInfo?.chainCode,
        pairAddress: chainInfo?.pairAddress,
        timeType: timeFormat(resolution)
      },
      tokenFlowQuery: {
        pairAddress: chainInfo?.pairAddress,
        chain: chainInfo?.chain,
        chainCode: chainInfo?.chainCode,
        baseAddress: tokenInfo?.baseAddress,
        queryTimeBegin: 0
      }
    })
    useSubscribeKChart.subscribeSwap = []

    res?.swap?.reverse().forEach((item: any) => {
      useSubscribeKChart.createSubscribeSwapInfo(item)
    })

    const info = res?.kChart?.reverse() || []

    const bars = []
    for (let i = 0; i < info.length; i++) {
      const obj = {
        id: info[i].timestamp,
        time: info[i].timestamp * 1000,
        close: showMarket
          ? parseFloat(info[i].C) * parseFloat(pairInfo.totalSupply)
          : parseFloat(info[i].C),
        high: showMarket
          ? parseFloat(info[i].H) * parseFloat(pairInfo.totalSupply)
          : parseFloat(info[i].H),
        low: showMarket
          ? parseFloat(info[i].L) * parseFloat(pairInfo.totalSupply)
          : parseFloat(info[i].L),
        open: showMarket
          ? parseFloat(info[i].O) * parseFloat(pairInfo.totalSupply)
          : parseFloat(info[i].O),
        volume: parseFloat(info[i].volume)
      }
      bars.push(obj)
    }
    this._startTime = bars[bars.length - 1]?.time
    onHistoryCallback(bars, { noData: false })
  }

  // 订阅实时数据
  async subscribeBars(
    symbolInfo: any,
    resolution: any,
    onRealtimeCallback: any,
    subscriberUID: string,
    onResetCacheNeededCallback: Function
  ) {
    const showMarket = eval(localStorage.getItem('showMarket') || 'false')

    const useSubscribeKChart = useSubscribeKChartInfo()
    const chainInfo = useChainInfoStore().chainInfo
    const tokenInfo = useTokenInfoStore().tokenInfo
    const res: any = await APIpairInfo({
      pairAddress: chainInfo?.pairAddress,
      baseAddress: tokenInfo?.baseAddress,
      chainCode: chainInfo?.chainCode
    })

    socket.off('kchart')

    socket.emit(
      'kchart-off',
      JSON.stringify({
        pair: chainInfo?.pairAddress,
        chainCode: chainInfo?.chainCode
      })
    )
    socket.emit(
      'kchart-on',
      JSON.stringify({
        pair: chainInfo?.pairAddress,
        chainCode: chainInfo?.chainCode
      })
    )

    const globalStore = useGlobalStore()

    globalStore.SetSocketKchartConnectType('kChart_connect')

    socket.on('kchart', (message: any) => {
      const data = JSON.parse(message)
      // console.log(`socket-message: ${data.tx} <========> ${formatDate(data.txTime * 1000)}`)

      useSubscribeKChart.createSubscribeKChartInfo({
        C: data.price,
        H: data.price,
        L: data.price,
        O: data.price,
        chg: (
          ((parseFloat(data.price) - parseFloat(res.start1d)) / parseFloat(res.start1d)) *
          100
        ).toString(),
        timestamp: data.txTime,
        pumpFunProgress: pumpFunPercent(data.baseAmount)
      })
      useSubscribeKChart.createSubscribeSwapInfo(data)
      const bar = {
        time: data.txTime * 1000,
        close: showMarket
          ? parseFloat(data.price) * parseFloat(res.totalSupply)
          : parseFloat(data.price),
        open: showMarket
          ? parseFloat(data.price) * parseFloat(res.totalSupply)
          : parseFloat(data.price),
        high: showMarket
          ? parseFloat(data.price) * parseFloat(res.totalSupply)
          : parseFloat(data.price),
        low: showMarket
          ? parseFloat(data.price) * parseFloat(res.totalSupply)
          : parseFloat(data.price),
        volume: parseFloat(data.orderAmount)
      }
      onRealtimeCallback(bar)
    })
  }

  // 取消订阅实时数据
  unsubscribeBars(subscriberUID: any) {
    // 取消对特定股票的实时数据订阅
    // console.log(subscriberUID)
    // clearInterval(this._intervalId)
  }
}
