<template>
  <div id="tv_chart_container"></div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useTokenInfoStore } from '@/stores/tokenInfo'
import { useChainInfoStore } from '@/stores/chainInfo'
import { usePositionsStore } from '@/stores/positions'
import CustomDataFeed from '@/utils/customDataFeed'
import BigNumber from 'bignumber.js'
import { useGlobalStore } from '@/stores/global'
import { formatDecimals, numberFormat, numFormat } from '@/utils'
import { MAIN_COIN } from '@/types'

const globalStore = useGlobalStore()
const chainInfo = useChainInfoStore().chainInfo
const useTokenInfo = useTokenInfoStore()
const tokenInfo = useTokenInfo.tokenInfo // 解构变量 通过 storeToRefs 变成响应式

// 改为动态获取 precision，而不是在组件初始化时固定
function getPrecision() {
  const basePrice = sessionStorage.getItem('basePrice')

  
  if (!basePrice || basePrice === 'null' || basePrice === 'undefined') {

    return 10 // 默认使用较高精度
  }
  
  const precisionConfig = formatDecimals(basePrice)
   return precisionConfig.precision
}

const positionsStore = usePositionsStore()

const showMarket = ref(eval(localStorage.getItem('showMarket')) || false)
const positionPrice = ref(0) // 持仓价格
let positionPriceLine = null // 持仓价格线实例

// 监听持仓数据变化，更新持仓价格线
watch(
  () => {
    const position = positionsStore.getPositionByAddress(tokenInfo?.baseAddress)
    return position?.averagePrice
  },
  (averagePrice) => {
    if (averagePrice) {
      const avgPrice = parseFloat(averagePrice)
      if (!isNaN(avgPrice) && avgPrice > 0) {
        updatePositionPrice(avgPrice)
      }
    }
  },
  { immediate: true }
)

function initOnReady() {
  var widget = (window.tvWidget = new TradingView.widget({
    // debug: true, // uncomment this line to see Library errors and warnings in the console
    // autosize: true, // 图表是否应使用容器中的所有可用空间，并在容器本身调整大小时调整大小
    fullscreen: true, // 图表是否应使用窗口中的所有可用空间
    symbol: tokenInfo?.baseSymbol,
    interval:
      chainInfo?.timeType?.replace(/m/g, '') || localStorage.getItem('kchart_tradingTime') || '1',
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
    enabled_features: ['study_templates'],
    custom_formatters: {
      priceFormatterFactory: (symbolInfo, minTick) => {

        if (symbolInfo === null) {
          return null
        }
        if (symbolInfo.format === 'volume') {
          return {
            format: (price, signPositive) => {
              const currentPrecision = getPrecision()

              const formatted = MAIN_COIN[tokenInfo?.baseSymbol]
                ? numFormat(new BigNumber(price).toFixed(currentPrecision))
                : numberFormat(new BigNumber(price).toFixed(currentPrecision))
              

              return formatted
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
      'paneProperties.vertGridProperties.color': 'rgba(35,35,35,0.60)',
      'paneProperties.vertGridProperties.style': 1, // 0=不显示，1=实线，2=虚线
      'paneProperties.horzGridProperties.color': 'rgba(35,35,35,0.60)',
      'paneProperties.horzGridProperties.style': 1, // 0=不显示，1=实线，2=虚线
      'scalesProperties.lineColor': '#1b1b1b',
      'scalesProperties.textColor': '#fff',
      'paneProperties.separatorColor': '#222222',
      'mainSeriesProperties.candleStyle.upColor': '#2EBD85', //买入颜色
      'mainSeriesProperties.candleStyle.borderUpColor': '#2EBD85', //买入边框颜色
      'mainSeriesProperties.candleStyle.wickUpColor': '#2EBD85', //买入线条颜色
      'mainSeriesProperties.candleStyle.downColor': '#F6465D', //卖出颜色
      'mainSeriesProperties.candleStyle.borderDownColor': '#F6465D', //卖出边框颜色
      'mainSeriesProperties.candleStyle.wickDownColor': '#F6465D', //卖出线条颜色

    },
    favorites: {
      intervals: ['1', '5', '15', '30', '1h', '4h', '1D', '1W']
    }
  }))

  // 图表准备好后添加持仓价格线
  widget.onChartReady(() => {
    const chart = widget.activeChart()
    
    // 延迟执行，确保图表完全加载
    setTimeout(() => {
      // 获取当前可见的价格范围
      let initialPrice = 0
      try {
        const priceScale = chart.getPanes()[0].getRightPriceScales()[0]
        const visibleRange = priceScale.getVisiblePriceRange()
        if (visibleRange && visibleRange.from !== null && visibleRange.to !== null) {
          initialPrice = (visibleRange.from + visibleRange.to) / 2
        }
      } catch (e) {
        // 使用默认值
      }
      
      positionPrice.value = initialPrice
      // 创建持仓价格线
      if (chart.createPositionLine) {
        positionPriceLine = chart.createPositionLine()
          .setText(`持仓价格: ${numberFormat(initialPrice)}`)
          .setTooltip('当前持仓价格')
          .setQuantity('')
          .setPrice(initialPrice)
          .setExtendLeft(true)
          .setLineStyle(1) // 虚线
          .setLineLength(0) // 全宽
          .setLineColor('#FFD700')
          .setBodyTextColor('#FFD700')
          .setBodyBackgroundColor('rgba(255, 215, 0, 0.2)')
          .setBodyBorderColor('#FFD700')
      }
    }, 0) // 延迟1秒执行
  })

  widget.headerReady().then(function () {
    const btn = widget.createButton()
    btn.innerHTML = showMarket.value
      ? '<span style="font-size: 12px;cursor: pointer;">价格 / <span style="color:#2ebd85">市值</span></span>'
      : '<span style="font-size: 12px;cursor: pointer;"><span style="color:#2ebd85">价格</span> / 市值</span>'

    btn.onclick = () => {
      showMarket.value = !showMarket.value
      localStorage.setItem('showMarket', showMarket.value)
      btn.innerHTML = showMarket.value
        ? '<span style="font-size: 12px;cursor: pointer;">价格 / <span style="color:#2ebd85">市值</span></span>'
        : '<span style="font-size: 12px;cursor: pointer;"><span style="color:#2ebd85">价格</span> / 市值</span>'
      initOnReady()
    }
  })
} // end of TradingView.onready

// 更新持仓价格的函数
function updatePositionPrice(newPrice) {
  positionPrice.value = newPrice
  if (positionPriceLine) {
    try {
      // 如果是位置线
      if (positionPriceLine.setPrice) {
        positionPriceLine.setPrice(newPrice)
        positionPriceLine.setText(`持仓价格: ${numberFormat(newPrice)}`)
      }
      // 如果是多点形状（趋势线）
      else if (positionPriceLine.setPoints) {
        const currentTime = Date.now() / 1000
        const futureTime = currentTime + 86400 * 365
        positionPriceLine.setPoints([
          { time: currentTime - 86400 * 30, price: newPrice },
          { time: futureTime, price: newPrice }
        ])
      }
    } catch (error) {
      console.error('更新持仓价格失败:', error)
    }
  }
}

// 暴露方法给父组件使用
defineExpose({
  updatePositionPrice
})

onMounted(() => {
  initOnReady()
})

onUnmounted(() => {
  // 清理资源
  if (positionPriceLine) {
    positionPriceLine.remove()
  }
})
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
