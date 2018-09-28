let upColor = '#ec0000',
  downColor = '#00da3c',
  splitLineStyle = {
    show: true,
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
        type: 'line'
      },
      formatter: function (param, ticker, callback) {
        return [
          `${param[0].value.trade_date}<br/>`,
          `${param[0].marker}开盘价: </span>${param[0].value.open_price}<br/>`,
          `${param[0].marker}收盘价: </span>${param[0].value.close_price}<br/>`,
          `${param[0].marker}最低价: </span>${param[0].value.low_price}<br/>`,
          `${param[0].marker}最高价: </span>${param[0].value.high_price}<br/><br/>`,
          `${param[1].value.trade_date}<br/>`,
          `${param[1].marker}成交量: </span>${param[1].value.trade_vol}<br/><br/>`,
          `${param[2].value.trade_date}<br/>`,
          `${param[2].marker}交易占比: </span>${param[2].value.trade_ratio}<br/>`
        ].join('')
      }
    },
    color: ['#ec0000', '#00da3c'],
    toolbox: {
      feature: {
        saveAsImage: {
          type: 'jpeg',
          name: '日K线股价走势图'
        }
      },
      right: 50
    },
    axisPointer: {
      link: [{
        xAxisIndex: [0, 1, 2]
      }]
    },
    grid: [
      {
        left: 120,
        right: 120,
        height: '21%',
        top: 40
      }, {
        left: 120,
        right: 120,
        height: '21%',
        top: 270
      }, {
        left: 120,
        right: 120,
        height: '20%',
        top: 480
      }
    ],
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
      }
    ],
    yAxis: [
      {
        scale: true,
        name: '日K线',
        gridIndex: 0,
        // boundaryGap: false,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle
        // min: 'dataMin',
        // max: 'dataMax'
      },
      {
        type: 'value',
        scale: true,
        name: '成交量',
        gridIndex: 1,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle
      },
      {
        type: 'value',
        scale: true,
        name: '交易占比',
        gridIndex: 2,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1, 2],
        start: 50,
        end: 100
      },
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0, 1, 2],
        y: '90%',
        start: 50,
        end: 100
      }
    ],
    // visualMap: {
    //   show: false,
    //   seriesIndex: 1,
    //   dimension: 6,
    //   pieces: [
    //     {
    //       value: 1,
    //       color: upColor
    //     },{
    //       value: -1,
    //       color: downColor
    //     }
    //   ]
    // },
    dataset: {
      dimensions: ['trade_date', 'open_price', 'high_price', 'low_price', 'close_price', 'trade_vol', 'trade_ratio'],
      source: []
    },
    series: [
      {
        type: 'candlestick',
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          normal: {
            color: upColor,
            color0: downColor,
            color1: 'pink',
            color2: 'yellow'
          }
        },
        encode: {
          // x: 0,
          // // y: [1, 4, 3, 2]
          // y: [1, 2, 3, 4]
          x: 'trade_date',
          y: ['open_price', 'close_price', 'low_price', 'high_price']
        }
      },
      {
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: '#4169e1'
          }
        },
        encode: {
          x: 'trade_date',
          y: 'trade_vol'
        }
      },
      {
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        itemStyle: {
          normal: {
            color: 'green'
          }
        },
        encode: {
          x: 'trade_date',
          y: 'trade_ratio'
        }
      }
    ]
  },
  {
    title: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      formatter: function (param, ticker, callback) {
        let colorList = ['#696969', '#FF8C00', '#87CEFA', 'red', '#4169e1', 'red', 'green']
        let n1 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'
        let n2 = ';"></span>'
        return [
          `${param[0].value.date_time}<br/>`,
          `${n1}${colorList[0]}${n2}成交均价: </span>${param[0].value.avg_price}<br/>`,
          `${n1}${colorList[1]}${n2}最高价: </span>${param[0].value.high_price}<br/>`,
          `${n1}${colorList[2]}${n2}最低价: </span>${param[0].value.low_price}<br/>`,
          `${n1}${colorList[3]}${n2}昨日收盘: </span>${param[0].value.pre_close_price}<br/><br/>`,
          `${param[1].value.date_time}<br/>`,
          `${n1}${colorList[4]}${n2}成交量: </span>${param[1].value.trade_vol}<br/><br/>`,
          `${param[2].value.date_time}<br/>`,
          `${n1}${colorList[5]}${n2}委托买入量: </span>${param[2].value.order_b_vol}<br/>`,
          `${n1}${colorList[6]}${n2}委托卖出量: </span>${param[2].value.order_s_vol}<br/>`
        ].join('')
      }
    },
    // color: ['#ec0000', '#00da3c'],
    brush: {
      toolbox: ['rect', 'clear'],
      lineY: true,
      xAxisIndex: [0],
      yAxisIndex: [0],
      throttleType: 'debounce',
      throttleDelay: 10,
      removeOnClick: true,
      brushMode: 'single',
      transformable: false,
      brushStyle: {
        color: 'rgba(255,255,255,0.03)',
        borderColor: '#455577',
        borderWidth: 1
      },
      outOfBrush: {
        colorAlpha: .1
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {
          type: 'jpeg',
          name: '日内每分钟股价走势图'
        }
      },
      right: 50
    },
    axisPointer: {
      link: [{
        xAxisIndex: [0, 1, 2]
      }]
    },
    grid: [
      {
        left: 120,
        right: 120,
        height: '21%',
        top: 40
      }, {
        left: 120,
        right: 120,
        height: '21%',
        top: 270
      }, {
        left: 120,
        right: 120,
        height: '20%',
        top: 480
      }
    ],
    xAxis: [
      {
        type: 'category',
        gridIndex: 0,
        scale: true,
        boundaryGap: false,
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
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: '分时图',
        gridIndex: 0,
        // boundaryGap: false,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle
        // min: 'dataMin',
        // max: 'dataMax'
      },
      {
        type: 'value',
        scale: true,
        name: '成交量',
        gridIndex: 1,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle
      },
      {
        type: 'value',
        scale: true,
        name: '委托买卖量',
        gridIndex: 2,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1, 2],
        start: 50,
        end: 100
      },
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0, 1, 2],
        y: '90%',
        start: 50,
        end: 100
      }
    ],
    dataset: {
      dimensions: ['date_time', 'avg_price', 'high_price', 'pre_close_price', 'low_price', 'trade_vol', 'order_b_vol', 'order_s_vol', 'trade_date_time'],
      source: []
    },
    series: [ // 成交均价展示为灰色加粗折线，最高价展示为橘黄色折线，最低价展示为淡蓝色折线
      { // 成交均价
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbol: 'emptyCircle',
        symbolSize: 12,
        lineStyle: {
          width: 5,
          color: '#696969'
        },
        encode: {
          // x: 'trade_date',
          // y: 'open_price'
          x: 0,
          y: 1
        }
      },
      { // 最高价
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbol: 'emptyCircle',
        symbolSize: 12,
        itemStyle: {
          color: '#FF8C00'
        },
        encode: {
          // x: 'trade_date',
          // y: 'high_price'
          x: 0,
          y: 2
        }
      },
      { // 最低价
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbol: 'emptyCircle',
        symbolSize: 12,
        itemStyle: {
          color: '#87CEFA'
        },
        encode: {
          x: 0,
          y: 4
        }
      },
      { // 昨日收盘价
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbolSize: 0,
        itemStyle: {
          color: 'red'
        },
        encode: {
          x: 0,
          y: 3
        }
      },
      { // 成交量
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: '#4169e1'
          }
        },
        encode: {
          x: 0,
          y: 5
        }
      },
      { // 委托买入
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        itemStyle: {
          normal: {
            color: 'red'
          }
        },
        stack: '委托买卖量',
        encode: {
          x: 0,
          y: 6
        }
      },
      { // 委托卖出
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        itemStyle: {
          normal: {
            color: 'green'
          }
        },
        stack: '委托买卖量',
        encode: {
          x: 0,
          y: 7
        }
      }
    ]
  },
  {
    title: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      formatter: function (param, ticker, callback) {
        let colorList = ['#696969', 'orange', 'lightblue', '#4169e1', 'red', 'green']
        let n1 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'
        let n2 = ';"></span>'
        return [
          `${param[0].value.date_time}<br/>`,
          `${n1}${colorList[0]}${n2}成交均价: </span>${param[0].value.avg_price}<br/>`,
          `${n1}${colorList[1]}${n2}最高价: </span>${param[0].value.high_price}<br/>`,
          `${n1}${colorList[2]}${n2}最低价: </span>${param[0].value.low_price}<br/><br/>`,
          `${param[1].value.date_time}<br/>`,
          `${n1}${colorList[3]}${n2}成交量: </span>${param[1].value.trade_vol}<br/><br/>`,
          `${param[2].value.date_time}<br/>`,
          `${n1}${colorList[4]}${n2}委托买入量: </span>${param[2].value.order_b_vol}<br/>`,
          `${n1}${colorList[5]}${n2}委托卖出量: </span>${param[2].value.order_s_vol}<br/>`
        ].join('')
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {
          type: 'jpeg',
          name: '分钟内每秒股价走势图'
        }
      },
      right: 50
    },
    axisPointer: {
      link: [{
        xAxisIndex: [0, 1, 2]
      }]
    },
    grid: [
      {
        left: 120,
        right: 120,
        height: '21%',
        top: 40
      }, {
        left: 120,
        right: 120,
        height: '21%',
        top: 270
      }, {
        left: 120,
        right: 120,
        height: '20%',
        top: 480
      }
    ],
    xAxis: [
      {
        type: 'category',
        gridIndex: 0,
        scale: true,
        boundaryGap: false,
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
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: '秒时图',
        gridIndex: 0,
        // boundaryGap: false,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle
        // min: 'dataMin',
        // max: 'dataMax'
      },
      {
        type: 'value',
        scale: true,
        name: '成交量',
        gridIndex: 1,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle
      },
      {
        type: 'value',
        scale: true,
        name: '委托买卖量',
        gridIndex: 2,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1, 2],
        start: 50,
        end: 100
      },
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0, 1, 2],
        y: '90%',
        start: 50,
        end: 100
      }
    ],
    dataset: {
      dimensions: ['date_time', 'avg_price', 'high_price', 'low_price', 'close_price', 'trade_vol', 'order_b_vol', 'order_s_vol', 'trade_date_time'],
      source: []
    },
    series: [ // 成交均价展示为灰色加粗折线，最高价展示为橘黄色折线，最低价展示为淡蓝色折线
      { // 成交均价
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbol: 'emptyCircle',
        symbolSize: 12,
        lineStyle: {
          width: 5,
          color: '#696969'
        },
        encode: {
          x: 0,
          y: 1
        }
      },
      { // 最高价
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbol: 'emptyCircle',
        symbolSize: 12,
        itemStyle: {
          color: 'orange'
        },
        encode: {
          x: 0,
          y: 2
        }
      },
      { // 最低价
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        symbol: 'emptyCircle',
        symbolSize: 12,
        itemStyle: {
          color: 'lightblue'
        },
        encode: {
          x: 0,
          y: 3
        }
      },
      { // 成交量
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          normal: {
            color: '#4169e1'
          }
        },
        encode: {
          x: 0,
          y: 5
        }
      },
      { // 委托买入
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        itemStyle: {
          normal: {
            color: 'red'
          }
        },
        stack: '委托买卖量',
        encode: {
          x: 0,
          y: 6
        }
      },
      { // 委托卖出
        type: 'bar',
        xAxisIndex: 2,
        yAxisIndex: 2,
        itemStyle: {
          normal: {
            color: 'green'
          }
        },
        stack: '委托买卖量',
        encode: {
          x: 0,
          y: 7
        }
      }
    ]
  }
]

export const chartsGear = {
  title: {},
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line'
    },
    formatter: function (param, ticker, callback) {
      return param[0].name + '：' + param[0].value.vol
    }
  },
  color: ['pink', 'orange'],
  toolbox: {
    feature: {
      saveAsImage: {
        type: 'jpeg',
        name: '10档行情订单簿'
      }
    }
  },
  grid: [
    {
      top: 30,
      left: 20,
      right: 50,
      bottom: 10
    }
  ],
  xAxis: [
    {
      show: true,
      type: 'value',
      position: 'top',
      splitLine: {lineStyle: false},
      axisLabel: {
        formatter: function (value) {
          let num
          if (value < 0) {
              num = value.toString().substr(1)
          } else {
              num = '-' + value.toString()
          }
          return '{a|' + num + '}'
        },
        rich: {
          a: {
              color: '#7b8fb9'
          }
        }
      },
      axisLine: {
        lineStyle: {
          color: '#7b8fb9',
          width: 1
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisLine: {show: false},
      axisLabel: {show: false},
      axisTick: {show: false}
    }
  ],
  dataset: {
    source:  []
  },
  series: [
    {
      type: 'bar',
      itemStyle: {
        normal: {
          color: function (params) {
            let colorList = ['#71C661', '#ee2c2c']
            if (params.dataIndex < 10) {
              return colorList[1]
            } else {
              return colorList[0]
            }
          }
        }
      },
      encode: {
        x: 'signVol',
        y: 'name'
      }
    }
  ]
}
