<template>
  <div id="tv_chart_container"></div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'
import CustomDataFeed from '@/utils/customDataFeed'
import BigNumber from 'bignumber.js'
import { useGlobalStore } from '@/stores/global'
import { formatDecimals, numberFormat, numFormat } from '@/utils'
import { MAIN_COIN } from '@/types'

const globalStore = useGlobalStore()
const chainInfo = useChainInfoStore().chainInfo
const useTokenInfo = useTokenInfoStore()
const tokenInfo = useTokenInfo.tokenInfo // 解构变量 通过 storeToRefs 变成响应式
const precision = formatDecimals(sessionStorage.getItem('basePrice')).precision
console.log('小数位', precision)

function initOnReady() {
  var widget = (window.tvWidget = new TradingView.widget({
    // debug: true, // uncomment this line to see Library errors and warnings in the console
    // autosize: true, // 图表是否应使用容器中的所有可用空间，并在容器本身调整大小时调整大小
    fullscreen: true, // 图表是否应使用窗口中的所有可用空间
    symbol: tokenInfo?.baseSymbol,
    interval: localStorage.getItem('kchart_tradingTime') || chainInfo?.timeType.replace(/m/g, ''),
    container: 'tv_chart_container',
    //	BEWARE: no trailing slash is expected in feed URL
    datafeed: new CustomDataFeed(),
    timezone: 'Asia/Shanghai', // 时区
    library_path: '/charting_library/',
    custom_css_url: 'custom_styles.css',
    locale: globalStore.language,
    charts_storage_url: 'https://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user',
    loading_screen: {
      backgroundColor: '#111'
    },
    /**
     *  禁用一些功能
     * timeframes_toolbar 在图表底部显示时间范围工具栏
     *  header_saveload 显示“保存布局”和“加载布局”按钮
     */
    disabled_features: [
      'timeframes_toolbar',
      'header_saveload',
      'header_symbol_search',
      'header_compare',
      'symbol_search_hot_key',
      'volume_force_overlay',
      'widget_logo'
    ],
    enabled_features: [],
    custom_formatters: {
      priceFormatterFactory: (symbolInfo, minTick) => {
        if (symbolInfo === null) {
          return null
        }
        if (symbolInfo.format === 'volume') {
          return {
            format: (price, signPositive) => {
              return MAIN_COIN[tokenInfo?.baseSymbol]
                ? numFormat(new BigNumber(price).toFixed(precision))
                : numberFormat(new BigNumber(price).toFixed(precision))
            }
          }
        }
        return null // The default formatter will be used.
      }
    },
    studies_overrides: {
      'volume.volume.color.0': '#F6465D', // 修改成交量柱状图下跌的颜色（红色）
      'volume.volume.color.1': '#2EBD85' // 修改成交量柱状图上涨的颜色（绿色）
    },
    overrides: {
      volumePaneSize: 'small', // tiny 、small、medium、large "paneProperties.topMargin": "10",
      'paneProperties.background': '#111111',
      'paneProperties.vertGridProperties.color': '#262529',
      'paneProperties.horzGridProperties.color': '#262529',
      'scalesProperties.lineColor': '#262529',
      'scalesProperties.textColor': '#fff',
      'paneProperties.separatorColor': '#242839',
      'mainSeriesProperties.candleStyle.upColor': '#2EBD85', //买入颜色
      'mainSeriesProperties.candleStyle.borderUpColor': '#2EBD85', //买入边框颜色
      'mainSeriesProperties.candleStyle.wickUpColor': '#2EBD85', //买入线条颜色
      'mainSeriesProperties.candleStyle.downColor': '#F6465D', //卖出颜色
      'mainSeriesProperties.candleStyle.borderDownColor': '#F6465D', //卖出边框颜色
      'mainSeriesProperties.candleStyle.wickDownColor': '#F6465D' //卖出线条颜色
    },
    favorites: {
      intervals: ['1', '5', '15', '30', '1h', '4h', '1D', '1W']
    }
  }))

  widget.onChartReady(function () {
    // widget.chart().createStudy('Volume', false, false)
  }) // end of widget.onChartReady
} // end of TradingView.onready

onMounted(() => {
  initOnReady()
})

onUnmounted(() => {})
</script>

<style>
#tv_chart_container {
  width: 100%;
  height: 100%;
  position: relative;
}
#tv_chart_container iframe {
  width: 100%;
  height: 100% !important;
}

#tv_chart_container:before {
  content: 'HelloDex.io';
  position: absolute;
  height: 40px;
  width: 160px;
  bottom: 190px;
  left: 60px;
  z-index: 1;
  -webkit-user-select: none;
  user-select: none;
  pointer-events: none;
  font-size: 40px;
  color: #828282;
  opacity: 0.3;
}
</style>
