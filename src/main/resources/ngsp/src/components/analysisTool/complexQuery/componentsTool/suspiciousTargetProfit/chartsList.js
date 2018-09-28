import Vue from 'vue'

let upColor = '#ff4a36',
  downColor = '#19b148',
  splitLineStyle = {
    show: false,
    lineStyle: {
      color: '#808080',
      width: .5
    }
  },
  axisLineStyle = {
    show: true,
    lineStyle: {
      color: '#D3D3D3',
      width: 1
    }
  }

export const chartsList = [
  {
    title: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(0, 0, 0, .5)',
          shadowBlur: 0
        }
      },
      formatter: function (param, ticker, callback) {
        let n1 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:',
          n2 = ';"></span>',
          colorList = ['#1b5eed', upColor, downColor, '#6766cc'],
          kColor
        if (param[0].value.open_price < param[0].value.curr_price) {
          kColor = `${n1}${upColor}${n2}`
        } else {
          kColor =  `${n1}${downColor}${n2}`
        }
        return [
          `日期: ${param[0].value.trade_date}<br/>`,
          `${kColor}开盘: </span>${param[0].value.open_price}<br/>`,
          `${kColor}最高: </span>${param[0].value.high_price}<br/>`,
          `${kColor}最低: </span>${param[0].value.low_price}<br/>`,
          `${kColor}收盘: </span>${param[0].value.curr_price}<br/><br/>`,
          `${kColor}成交量: </span>${param[1].value.total_trade}<br/><br/>`,
          `${n1}${colorList[0]}${n2}持股量: </span>${param[1].value.hold_vol_s}<br/><br/>`,
          `${n1}${colorList[1]}${n2}委托买入量: </span>${param[2].value.buy_vol_rate}<br/>`,
          `${n1}${colorList[2]}${n2}委托卖出量: </span>${param[2].value.sell_vol_rate}<br/><br/>`,
          `${n1}${colorList[3]}${n2}对倒占比: </span>${param[2].value.trade_vol_inter_rate}<br/>`
        ].join('')
      }
    },
    axisPointer: {
      link: [{
        xAxisIndex: 'all'
      }]
    },
    toolbox: {
      feature: {
        saveAsImage: {
          type: 'jpeg',
          name: '股价、持股、买卖占比、对倒占比图'
        }
      },
      right: 50
    },
    grid: [
      {
        left: 130,
        right: 180,
        height: '15%',
        top: 70
      }, {
        left: 130,
        right: 180,
        height: '15%',
        top: 360
      }, {
        left: 130,
        right: 180,
        height: '15%',
        top: 650
      }, {
        left: 130,
        right: 180,
        height: '15%',
        top: 940
      }, {
        left: 130,
        right: 180,
        height: '15%',
        top: 1240
      }
    ],
    visualMap: {
      show: false,
      seriesIndex: 1,
      dimension: 1,
      pieces: [{
        value: 1,
        color: upColor
      }, {
          value: -1,
          color: downColor
        }]
    },
    xAxis: [
      {
        type: 'category',
        gridIndex: 0,
        scale: true,
        boundaryGap: true,
        axisLine: axisLineStyle,
        min: 'dataMin',
        max: 'dataMax'
      },
      {
        type: 'category',
        gridIndex: 1,
        scale: true,
        boundaryGap: true,
        axisLine: axisLineStyle,
        axisLabel: false,
        min: 'dataMin',
        max: 'dataMax'
      },
      {
        type: 'category',
        gridIndex: 2,
        scale: true,
        boundaryGap: true,
        axisLine: axisLineStyle,
        axisLabel: false,
        min: 'dataMin',
        max: 'dataMax'
      },
      {
        type: 'category',
        gridIndex: 3,
        scale: true,
        boundaryGap: true,
        axisLine: axisLineStyle,
        axisLabel: false,
        min: 'dataMin',
        max: 'dataMax'
      },
      {
        type: 'category',
        gridIndex: 4,
        scale: true,
        boundaryGap: true,
        axisLine: axisLineStyle,
        axisLabel: false,
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        scale: true,
        name: '日K线',
        gridIndex: 0,
        axisLine: axisLineStyle,
        // splitLine: splitLineStyle,
        splitArea: {
          show: true
        },
        axisLabel: {
          formatter: function(value, index) {
            return Vue.prototype.gfnFormatDecThou(value, 3)
          }
        }
      },
      {
        type: 'value',
        scale: true,
        name: '市场成交量（万股）',
        gridIndex: 1,
        axisLine: axisLineStyle,
        splitArea: {
          show: true
        }
      },
      {
        type: 'value',
        scale: true,
        name: '持股量',
        gridIndex: 2,
        axisLine: axisLineStyle,
        splitArea: {
          show: true
        }
      },
      {
        type: 'value',
        scale: true,
        name: '买入占比、卖出占比',
        gridIndex: 3,
        axisLine: axisLineStyle,
        splitArea: {
          show: true
        },
        axisLabel: {
          formatter: function(value, index) {
            return Vue.prototype.gfnFormatDecThou(value, 3)
          }
        }
      },
      {
        type: 'value',
        scale: true,
        name: '对倒占比',
        gridIndex: 4,
        axisLine: axisLineStyle,
        splitArea: {
          show: true
        },
        axisLabel: {
          formatter: function(value, index) {
            return Vue.prototype.gfnFormatDecThou(value, 3)
          }
        }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1, 2, 3, 4],
        start: 40,
        end: 100,
        left: 130,
        right: 180,
        top: 'top',
        bottom: 'auto'
      },
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0, 1, 2, 3, 4],
        y: '90%',
        start: 40,
        end: 100,
        left: 130,
        right: 180,
        top: 'top',
        bottom: 'auto'
      }
    ],
    dataset: {
      dimensions: ['trade_date', 'mark', 'hold_vol_s', 'hold_vol_rate', 'total_trade',
        'trade_vol_inter_rate', 'trade_vol_rate', 'buy_vol_rate', 'sell_vol_rate',
      'curr_price', 'open_price', 'high_price', 'low_price'],
      source: []
    },
    series: [
      { // 日K
        type: 'candlestick',
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          normal: {
            color: upColor,
            color0: downColor
          }
        },
        encode: {
          x: 'trade_date',
          y: ['open_price', 'curr_price', 'low_price', 'high_price']
        }
      },
      { // 成交柱状
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        encode: {
          x: 'trade_date',
          y: 'total_trade'
        }
      },
      { // 持股量
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: '#1b5eed'
          }
        },
        encode: {
          x: 'trade_date',
          y: 'hold_vol_s'
        }
      },
      { // 买入数量
        type: 'bar',
        xAxisIndex: 3,
        yAxisIndex: 3,
        itemStyle: {
          normal: {
            color: upColor
          }
        },
        stack: '买卖量',
        encode: {
          x: 0,
          y: 'buy_vol_rate'
        }
      },
      { // 卖出数量
        type: 'bar',
        xAxisIndex: 3,
        yAxisIndex: 3,
        itemStyle: {
          normal: {
            color: downColor
          }
        },
        stack: '买卖量',
        encode: {
          x: 0,
          y: 'sell_vol_rate'
        }
      },
      { // 对倒数量
        type: 'bar',
        xAxisIndex: 4,
        yAxisIndex: 4,
        itemStyle: {
          normal: {
            color: '#6766cc'
          }
        },
        encode: {
          x: 0,
          y: 'trade_vol_inter_rate'
        }
      }
    ]
  },
  {
    title: {},
    color: [upColor, downColor],
    legend: {
      data: ['收盘价', '持股量'],
      top: 40,
      textStyle: {
        color: '#506798'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(0, 0, 0, .5)',
          shadowBlur: 0
          // fontSize: 14
        }
      }
    },
    axisPointer: {
      link: [{
        xAxisIndex: 'all'
      }]
    },
    toolbox: {
      feature: {
        saveAsImage: {
          type: 'jpeg',
          name: '股价、持股图'
        }
      },
      right: 50
    },
    grid: [
      {
        left: 130,
        right: 180,
        top: 100
      }
    ],
    xAxis: [
      {
        type: 'category',
        scale: true,
        boundaryGap: false,
        axisLine: axisLineStyle,
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: '收盘价',
        axisLine: axisLineStyle,
        splitArea: {
          show: true
        },
        axisLabel: {
          formatter: function(value, index) {
            return Vue.prototype.gfnFormatDecThou(value, 3)
          }
        },
        min: 'dataMin',
        max: 'dataMax'
      },
      {
        type: 'value',
        scale: true,
        name: '持股量',
        axisLine: axisLineStyle,
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 40,
        end: 100,
        left: 130,
        right: 180,
        top: 'top',
        bottom: 'auto'
      },
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        y: '90%',
        start: 40,
        end: 100,
        left: 130,
        right: 180,
        top: 'top',
        bottom: 'auto'
      }
    ],
    dataset: {
      dimensions: ['trade_date', 'hold_vol_s', 'hold_vol_rate', 'total_trade',
        'trade_vol_inter_rate', 'trade_vol_rate', 'buy_vol_rate', 'sell_vol_rate',
        'curr_price', 'open_price', 'high_price', 'low_price'],
      source: []
    },
    series: [
      { // 收盘价
        type: 'line',
        name: '收盘价',
        symbol: 'circle',
        symbolSize: 10,
        smooth: false,
        encode: {
          x: 0,
          y: 'curr_price'
        }
      },
      { // 持股量
        type: 'line',
        name: '持股量',
        xAxisIndex: 0,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 10,
        smooth: false,
        encode: {
          x: 0,
          y: 1
        }
      }
    ]
  },
  {
    title: {},
    color: [upColor, downColor],
    legend: {
      data: ['收盘价', '交易占比'],
      top: 40,
      textStyle: {
        color: '#506798'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(0, 0, 0, .5)',
          shadowBlur: 0
        }
      }
    },
    axisPointer: {
      link: [{
        xAxisIndex: 'all'
      }]
    },
    toolbox: {
      feature: {
        saveAsImage: {
          type: 'jpeg',
          name: '股价、交易占比'
        }
      },
      right: 50
    },
    grid: [
      {
        left: 130,
        right: 180,
        top: 100
      }
    ],
    xAxis: [
      {
        type: 'category',
        scale: true,
        boundaryGap: false,
        axisLine: axisLineStyle,
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: '收盘价',
        axisLine: axisLineStyle,
        splitArea: {
          show: true
        },
        axisLabel: {
          formatter: function(value, index) {
            return Vue.prototype.gfnFormatDecThou(value, 3)
          }
        },
        min: 'dataMin',
        max: 'dataMax'
      },
      {
        type: 'value',
        scale: true,
        name: '交易占比',
        axisLine: axisLineStyle,
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 40,
        end: 100,
        left: 130,
        right: 180,
        top: 'top',
        bottom: 'auto'
      },
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        y: '90%',
        start: 40,
        end: 100,
        left: 130,
        right: 180,
        top: 'top',
        bottom: 'auto'
      }
    ],
    dataset: {
      dimensions: ['trade_date', 'hold_vol_s', 'hold_vol_rate', 'total_trade',
        'trade_vol_inter_rate', 'trade_vol_rate', 'buy_vol_rate', 'sell_vol_rate',
        'curr_price', 'open_price', 'high_price', 'low_price'],
      source: []
    },
    series: [
      { // 收盘价
        type: 'line',
        name: '收盘价',
        symbol: 'circle',
        symbolSize: 10,
        smooth: false,
        encode: {
          x: 0,
          y: 'curr_price'
        }
      },
      { // 交易占比
        type: 'line',
        name: '交易占比',
        xAxisIndex: 0,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 10,
        smooth: false,
        encode: {
          x: 0,
          y: 6
        }
      }
    ]
  }
]
