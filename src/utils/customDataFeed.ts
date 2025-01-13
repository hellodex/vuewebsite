import { useChainInfoStore } from '@/stores/chainInfo'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useSubscribeKChartInfo } from '@/stores/subscribeKChartInfo'
import { formatDecimals } from '@/utils'

// 自定义数据源对象
import { APIkCharts, APIsubscribeKChartAndSwap } from '@/api'

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
    // 数据源准备就绪时的操作，例如认证、连接等
    const useSubscribeKChart = useSubscribeKChartInfo()
    useSubscribeKChart.subscribeSwap = []
    setTimeout(() =>
      callback({
        exchanges: [], // 可用的交易所列表
        symbolsTypes: [], // 可用的股票类型列表
        supportedResolutions: [], // 支持的时间间隔列表
        supports_marks: true, // 是否支持标记（例如笔记）
        supports_timescale_marks: true // 是否支持时间轴标记
      })
    )
  }
  // 搜索符号
  searchSymbols(userInput: any, exchange: any, symbolType: any, onResultReadyCallback: any) {
    // 根据用户输入搜索符号，获取匹配的股票列表
    // 将结果传递给TradingView
    // onResultReadyCallback(symbols);
    console.log(userInput, exchange, symbolType, onResultReadyCallback)
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
    console.log(symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension)
    const pricescale = 10 ** formatDecimals(sessionStorage.getItem('basePrice')).precision

    console.log(
      sessionStorage.getItem('basePrice'),
      formatDecimals(sessionStorage.getItem('basePrice'))
    )
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
    console.log(symbolInfo, resolution, periodParams, onErrorCallback)
    if (this._intervalId) {
      clearInterval(this._intervalId)
    }
    const useChainInfo = useChainInfoStore()
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
    const res: any = await APIkCharts({
      chainCode: chainInfo?.chainCode,
      pairAddress: chainInfo?.pairAddress,
      timeType: timeFormat(resolution)
    })
    const info = res?.reverse() || []

    const bars = []
    for (let i = 0; i < info.length; i++) {
      const obj = {
        id: info[i].timestamp,
        time: info[i].timestamp * 1000,
        close: parseFloat(info[i].C),
        high: parseFloat(info[i].H),
        low: parseFloat(info[i].L),
        open: parseFloat(info[i].O),
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
    const useSubscribeKChart = useSubscribeKChartInfo()
    const fetchData = async () => {
      const chainInfo = useChainInfoStore().chainInfo
      const tokenInfo = useTokenInfoStore().tokenInfo
      try {
        const res: any = await APIsubscribeKChartAndSwap({
          kchart: {
            chainCode: chainInfo?.chainCode,
            pairAddress: chainInfo?.pairAddress,
            timeType: chainInfo?.timeType,
            startTime: this._startTime
          },
          tokenFlowQuery: {
            pairAddress: chainInfo?.pairAddress,
            chain: chainInfo?.chain,
            chainCode: chainInfo?.chainCode,
            baseAddress: tokenInfo?.baseAddress,
            queryTimeBegin: String(this.timestamp)
          }
        })

        if (res?.swap?.length != 0) {
          this.timestamp = new Date().getTime()
        }
        res?.swap?.reverse().forEach((item: any) => {
          useSubscribeKChart.createSubscribeSwapInfo(item)
        })

        const subscribeBarsInfo: any = res?.kChart[0] || {}

        useSubscribeKChart.createSubscribeKChartInfo(subscribeBarsInfo)

        const timestamp = subscribeBarsInfo.timestamp * 1000
        const bar = {
          time: timestamp,
          close: parseFloat(subscribeBarsInfo.C),
          open: parseFloat(subscribeBarsInfo.O),
          high: parseFloat(subscribeBarsInfo.H),
          low: parseFloat(subscribeBarsInfo.L),
          volume: parseFloat(subscribeBarsInfo.volume)
        }
        this._startTime = subscribeBarsInfo.timestamp

        onRealtimeCallback(bar)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
    // 定时器，每5秒获取一次数据
    const intervalId = setInterval(fetchData, 5000)

    // 保存定时器ID，用于取消订阅时清除
    this._intervalId = intervalId
  }

  // 取消订阅实时数据
  unsubscribeBars(subscriberUID: any) {
    // 取消对特定股票的实时数据订阅
    console.log(subscriberUID)
    // clearInterval(this._intervalId)
  }
}
