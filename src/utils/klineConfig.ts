// klineConfig.ts
export const config = {
  // 网格线
  grid: {
    show: true,
    // 网格水平线
    horizontal: {
      show: true,
      size: 1,
      color: '#D2C7F4',
      // 'solid'|'dash'
      style: 'dash',
      dashValue: [2, 2]
    },
    vertical: {
      show: true,
      size: 1,
      color: '#D2C7F4',
      // 'solid'|'dash'
      style: 'dash',
      dashValue: [2, 2]
    }
  },
  // 蜡烛图
  candle: {
    // 蜡烛图上下间距，大于1为绝对值，大于0小余1则为比例
    margin: {
      top: 0.2,
      bottom: 0.1
    },
    // 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
    type: 'candle_solid',
    // 蜡烛柱
    bar: {
      upColor: '#55D252',
      downColor: '#F0665D',
      noChangeColor: '#888888'
    },
    // 面积图
    area: {
      lineSize: 2,
      lineColor: '#2196F3',
      value: 'close',
      backgroundColor: [
        {
          offset: 0,
          color: 'rgba(33, 150, 243, 0.01)'
        },
        {
          offset: 1,
          color: 'rgba(33, 150, 243, 0.2)'
        }
      ]
    },
    // 标记
    priceMark: {
      show: true,
      // 最高价标记
      high: {
        show: true,
        color: '#D9D9D9',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      // 最低价标记
      low: {
        show: true,
        color: '#D9D9D9',
        textMargin: 5,
        textSize: 10,
        textFamily: 'Helvetica Neue',
        textWeight: 'normal'
      },
      // 最新价标记
      last: {
        show: true,
        upColor: '#26A69A',
        downColor: '#EF5350',
        noChangeColor: '#888888',
        line: {
          show: true,
          // 'solid'|'dash'
          style: 'dash',
          dashValue: [4, 4],
          size: 1
        },
        text: {
          show: true,
          size: 12,
          paddingLeft: 2,
          paddingTop: 2,
          paddingRight: 2,
          paddingBottom: 2,
          color: '#FFFFFF',
          family: 'Helvetica Neue',
          weight: 'normal',
          borderRadius: 2
        }
      }
    },
    // 提示
    tooltip: {
      // 'always' | 'follow_cross' | 'none'
      showRule: 'none',
      // 'standard' | 'rect'
      showType: 'standard',
      labels: ['时间', '开', '收', '高', '低', '成交量'],
      values: null,
      defaultValue: 'n/a',
      rect: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 6,
        offsetLeft: 8,
        offsetTop: 8,
        offsetRight: 8,
        borderRadius: 4,
        borderSize: 1,
        borderColor: '#3f4254',
        backgroundColor: 'rgba(17, 17, 17, .3)'
      },
      text: {
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        color: 'red',
        marginLeft: 8,
        marginTop: 6,
        marginRight: 8,
        marginBottom: 0
      }
    }
  },
  // x轴
  xAxis: {
    show: true,
    height: null,
    // x轴线
    axisLine: {
      show: true,
      color: '#C583ED',
      size: 1
    },
    // x轴分割文字
    tickText: {
      show: true,
      color: '#A3A3A3',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12,
      paddingTop: 3,
      paddingBottom: 6
    },
    // x轴分割线
    tickLine: {
      show: false,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  // y轴
  yAxis: {
    show: true,
    size: 'auto',
    // 'left' | 'right'
    position: 'right',
    // 'normal' | 'percentage' | 'log'
    type: 'normal',
    inside: true,
    reverse: false,
    // y轴线
    axisLine: {
      show: false,
      color: '#D2C7F4',
      size: 1
    },
    // y轴分割文字
    tickText: {
      show: true,
      color: '#A3A3A3',
      family: 'Helvetica Neue',
      weight: 'normal',
      size: 12,
      paddingLeft: 3,
      paddingRight: 6
    },
    // y轴分割线
    tickLine: {
      show: false,
      size: 1,
      length: 3,
      color: '#888888'
    }
  },
  // 十字光标
  crosshair: {
    show: true,
    // 十字光标水平线及文字
    horizontal: {
      show: true,
      line: {
        show: true,
        // 'solid'|'dash'
        style: 'dash',
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
        color: '#D9D9D9',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 2,
        paddingBottom: 2,
        borderSize: 1,
        borderColor: '#505050',
        borderRadius: 2,
        backgroundColor: '#505050'
      }
    },
    // 十字光标垂直线及文字
    vertical: {
      show: true,
      line: {
        show: true,
        // 'solid'|'dash'
        style: 'dash',
        dashValue: [4, 2],
        size: 1,
        color: '#888888'
      },
      text: {
        show: true,
        color: '#D9D9D9',
        size: 12,
        family: 'Helvetica Neue',
        weight: 'normal',
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 2,
        paddingBottom: 2,
        borderSize: 1,
        borderColor: '#505050',
        borderRadius: 2,
        backgroundColor: '#505050'
      }
    }
  }
}
