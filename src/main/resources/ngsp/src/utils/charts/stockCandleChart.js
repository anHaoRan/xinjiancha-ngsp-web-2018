import moment from 'moment/moment'
import { getTheme } from '../storageUtil'
import { securityColor } from './../constants'

let d3 = require('d3-format')

// 格式化千分位，保留f位小数
function fnFormatDecThou (value, f) {
  if (f == null) {
    return d3.format(',')(value)
  }
  let pattern = ',.' + f + 'f'
  return d3.format(pattern)(value)
}

let echarts = require('echarts')

// 图形数据结构处理
export function splitData (data, type) {
  let timeList = []
  let values = []
  let volumes = []
  if (data != null) {
    for (let i = 0; i < data.length; i++) {
      timeList.push(moment(data[i][0]).format('YYYY-MM-DD'))
      values.push([
        data[i][1], // 开盘open
        data[i][2], // 收盘close
        data[i][3], // 最低lowest
        data[i][4], // 最高highest
        data[i][5], // 成交量
        data[i][7], // 涨跌
        data[i][8], // 涨跌幅
        data[i][9], // 振幅
        data[i][6], // 成交金额
        data[i][10] // 前收盘
      ])
      if (type === 'stock') {
        volumes.push([i, data[i][5], data[i][1] > data[i][2] ? 1 : -1])
      } else {
        volumes.push([i, data[i][6], data[i][1] > data[i][2] ? 1 : -1])
      }
    }
  }
  return {
    timeList,
    values,
    volumes
  }
}

/**
 * 画股票日K图的方法
 * @param {object} chartData 图表数据
 * @param {string} domId 需要画图的domId
 * @param {string} title 需要画图的标题
 * @param {string} type index:指数, board: 板块, stock: 个股
 * @return {object} 图例对象
 */
export function drawStockCandleChart (chartData, domId, title, type) {
  let echart = echarts.init(document.getElementById(domId), getTheme())
  let hasTitle = (title != null && title !== '')
  let candleGrid = {
    left: '40',
    right: '30',
    top: '3%',
    height: '70%',
    containLabel: false
  }
  if (hasTitle) {
    candleGrid = {
      left: '40',
      right: '30',
      top: '10%',
      height: '60%',
      containLabel: false
    }
  }
  echart.showLoading()
  let data = splitData(chartData, type)
  let option = {
    title: {
      show: hasTitle,
      text: title,
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal'
      },
      padding: [10, 15]
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        lineStyle: {
          type: 'dashed',
          color: '#006cee'
        }
      },
      backgroundColor: 'rgba(245,245,245,0.8)',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000'
      },
      position: function (pos, params, el, elRect, size) {
        if (pos[0] < size.viewSize[0] / 2) {
          return [pos[0] + 20, '36']
        }
        return [pos[0] - 220, '16']
      },
      formatter: function (params) { // eslint-disable-line
        let fm = []
        let fmx = false
        for (let idx in params) {
          let param = params[idx]
          if (!fmx) {
            fm.push('日期：' + param.name.replace('-', '').replace('-', '') + '<br/>')
            fmx = true
          }
          fm.push('<hr size=1 style="margin: 3px 0">')
          if (param.seriesName === '日K图') {
            fm.push('开盘：' + (param.data[1] ? ('<i class=' + (param.data[1] > param.data[10] ? 'up>' : 'down>') + param.data[1] + '</i>') : '-') + '<br/>')
            fm.push('最高：' + (param.data[4] ? ('<i class=' + (param.data[4] > param.data[1] ? 'up>' : 'down>') + param.data[4] + '</i>') : '-') + '<br/>')
            fm.push('最低：' + (param.data[3] ? ('<i class=' + (param.data[3] > param.data[1] ? 'up>' : 'down>') + param.data[3] + '</i>') : '-') + '<br/>')
            fm.push('收盘：' + (param.data[2] ? ('<i class=' + (param.data[2] > param.data[1] ? 'up>' : 'down>') + param.data[2] + '</i>') : '-') + '<br/>')
            fm.push('涨跌值：' + (param.data[6] ? ('<i class=' + (param.data[6] > 0 ? 'up>' : 'down>') + param.data[6] + '</i>') : '-') + '<br/>')
            fm.push('涨跌幅：' + (param.data[7] ? ('<i class=' + (param.data[7] > 0 ? 'up>' : 'down>') + param.data[7] + '%</i>') : '-') + '<br/>')
            fm.push('振幅：' + (param.data[8] ? param.data[8] + '%' : '-') + '<br/>')
          } else if (param.seriesName === '成交量') {
            fm.push('总成交量：' + (param.data[1] ? (type === 'stock' ? fnFormatDecThou(param.data[1] / 10000, 2) + '万股' : fnFormatDecThou(param.data[1] / 100000000, 2) + '亿股') : '-') + '<br/>')
            let je = params[0].data.length > 3 ? params[0].data[9] : params[1].data[9]
            fm.push('总成交金额：' + (je ? fnFormatDecThou(je / 100000000, 2) + '亿元' : '-') + '<br/>')
          } else if (param.seriesName === '成交金额') {
            let cjl = params[0].data.length > 3 ? params[0].data[5] : params[1].data[5]
            fm.push('总成交量：' + (cjl ? (type === 'stock' ? fnFormatDecThou(cjl / 10000, 2) + '万股' : fnFormatDecThou(cjl / 100000000, 2) + '亿股') : '-') + '<br/>')
            fm.push('总成交金额：' + (param.data[1] ? fnFormatDecThou(param.data[1] / 100000000, 2) + '亿元' : '-') + '<br/>')
          } else {
            fm.push(param.seriesName + '：' + param.data + '<br/>')
          }
        }
        return fm.join('')
      }
    },
    axisPointer: {
      link: {xAxisIndex: 'all'}
    },
    toolbox: {
      top: 0,
      right: 50,
      feature: {
        dataZoom: {
          yAxisIndex: false
        },
        brush: {
          show: false
        },
        saveAsImage: {
          type: 'jpeg'
        }
      }
    },
    brush: {
      xAxisIndex: 'all',
      brushLink: 'all',
      throttleType: 'debounce',
      throttleDelay: '300',
      removeOnClick: true,
      outOfBrush: {
        colorAlpha: 0.1
      }
    },
    visualMap: {
      show: false,
      seriesIndex: 1,
      dimension: 2,
      pieces: [{
        value: 1,
        color: securityColor.down
      }, {
        value: -1,
        color: securityColor.up
      }]
    },
    grid: [
      candleGrid,
      {
        left: '40',
        right: '30',
        top: '82%',
        height: '16%',
        containLabel: false
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: data.timeList,
        scale: true,
        boundaryGap: true,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#273558'
          }
        },
        axisLabel: {color: '#7b8fb9'},
        splitLine: {show: false},
        splitNumber: 30,
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
        }
      }, {
        type: 'category',
        gridIndex: 1,
        data: data.timeList,
        scale: true,
        boundaryGap: true,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#273558'
          }
        },
        axisTick: {show: false},
        axisLabel: {show: false},
        splitLine: {show: false},
        splitNumber: 30,
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        scale: true,
        splitNumber: 2,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#273558'
          }
        },
        axisLabel: {
          inside: true,
          color: '#7b8fb9'
        },
        splitArea: {
          show: true
        }
      },
      // 下轴左1轴
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 1,
        axisLabel: {
          color: '#7b8fb9',
          inside: true,
          formatter: function (value) {
            return type === 'stock' ? (value / 100000000).toFixed(2) + '亿股' : (value / 100000000).toFixed(2) + '亿元'
          }
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#273558'
          }
        },
        axisTick: {show: false},
        splitLine: {show: false}
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 0,
        end: 100
      }, {
        show: false,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '85%',
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: '日K图',
        type: 'candlestick',
        data: data.values,
        itemStyle: {
          normal: {
            color: securityColor.up,
            color0: securityColor.down,
            borderColor: null,
            borderColor0: null
          }
        }
      }, {
        name: type === 'stock' ? '成交量' : '成交金额',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes
      }
    ]
  }
  echart.setOption(option)
  echart.dispatchAction({
    type: 'takeGlobalCursor',
    key: 'brush',
    brushOption: {
      brushType: 'lineX',
      brushMode: 'single'
    }
  })
  echart.hideLoading()
  return echart
}
