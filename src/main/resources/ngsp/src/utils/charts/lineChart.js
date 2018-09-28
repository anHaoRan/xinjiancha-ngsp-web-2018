import moment from 'moment'
import { getTheme } from '../storageUtil.js'

let echarts = require('echarts')

/**
 * 画股票时分图的方法
 * @param {object} chartData 图表数据
 * @param {string} DOMId 需要画图的domId
 * @param {string} store 全局状态
 * @return {object} null
 */
export function drawLineChart (chartData, DOMId, store) {
  let myLine = document.getElementById(DOMId)
  let echart = echarts.init(myLine, getTheme())
  if (chartData.chartName === undefined) {
    echart.clear()
    return false
  }
  echart.showLoading()
  let data = splitData(chartData)
  let previous
  let tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
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
      let obj = {top: 35}
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
      return obj
    }
  }
  let toolbox = {
    top: 20,
    right: 50,
    feature: {
      dataZoom: {
        show: false
      },
      brush: {
        type: ['lineX', 'clear']
      }
    }
  }
  let brush = {
    xAxisIndex: 'all',
    throttleType: 'debounce',
    throttleDelay: '300',
    removeOnClick: true,
    brushStyle: {
      color: 'rgba(120,140,180,0.1)'
    },
    outOfBrush: {
      colorAlpha: 1
    }
  }
  let grid = [
    {
      left: '15',
      right: '17',
      top: '10%',
      height: '53%',
      containLabel: false
    },
    {
      left: '15',
      right: '17',
      top: '73%',
      height: '27%',
      containLabel: false
    }
  ]
  let xAxis = [
    {
      type: 'category',
      data: data.timeList,
      boundaryGap: false,
      splitLine: {
        show: true,
        interval: 29,
        lineStyle: {
          opacity: 0.1
        }
      },
      axisLine: {show: false},
      axisTick: {show: false},
      axisLabel: {show: false}
    },
    {
      type: 'category',
      gridIndex: 1,
      position: 'top',
      data: data.timeList,
      min: 'dataMin',
      max: 'dataMax',
      boundaryGap: false,
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        interval: 29,
        lineStyle: {
          opacity: 0.1
        }
      },
      axisPointer: {
        z: 100
      },
      axisLabel: {
        color: '#7b8fb9',
        interval: 29 // 横坐标间隔时间
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#273558'
        }
      }
    },
    {
      type: 'category',
      gridIndex: 0,
      axisLine: {
        onZero: true,
        lineStyle: {
          color: '#273558'
        }
      }
    }
  ]
  let yAxis = [
    //  左轴
    {
      scale: true,
      position: 'left',
      splitNumber: 2,
      splitLine: {
        show: false,
        lineStyle: {
          color: '#273558'
        }
      },
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
      min: (data.lastCloseData - data.ampliToday).toFixed(2), // 最小
      max: (data.lastCloseData + data.ampliToday).toFixed(2) // 最大
    },
    // 左下轴
    {
      type: 'value',
      gridIndex: 1,
      splitNumber: 1,
      splitLine: {show: false},
      axisLine: {
        show: true,
        lineStyle: {
          color: '#273558'
        }
      },
      axisLabel: {
        color: '#7b8fb9',
        inside: true,
        formatter: function (value, index) {
          if (index === 0) {
            return 0
          }
          return (Number(value) / 100000000).toFixed(2) + '亿元'
        },
        showMinLabel: false
      }
    },
    // 右轴
    {
      scale: true,
      position: 'right',
      splitNumber: 1,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#273558'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#273558'
        }
      },
      axisLabel: {
        color: '#7b8fb9',
        inside: true,
        formatter: function (value) {
          return value + '%'
        }
      },
      min: 0 - data.rate, // 最小
      max: data.rate // 最大
    }
  ]
  let series = [
    {
      name: '最新价',
      type: 'line',
      data: data.chartData,
      smooth: true
    },
    {
      name: '成交量',
      type: 'bar',
      stack: '总量',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: data.volumes,
      itemStyle: {
        normal: {
          color: function (params) {
            let volumesColor = ''
            if (params.dataIndex === 0) {
              if (params.data >= data.lastCloseData) {
                volumesColor = '#1d655f'
              } else {
                volumesColor = '#782d2d'
              }
            } else {
              if (previous >= params.data) {
                volumesColor = '#1d655f'
              } else {
                volumesColor = '#782d2d'
              }
            }
            previous = params.data
            return volumesColor
          }
        }
      }
    }
  ]
  let options = {
    // animation:false,
    axisPointer: {
      link: {xAxisIndex: 'all'}
    },
    tooltip: tooltip,
    toolbox: toolbox,
    brush: brush,
    grid: grid,
    xAxis: xAxis,
    yAxis: yAxis,
    series: series
  }
  echart.on('brushSelected', function (val) {
    let timeData = val.batch[0].areas[0]
    let startTime = new Date()
    let endTime = new Date()
    if (timeData) {
      // 同步时间选择器的时间
      let st, et
      if (timeData.coordRange[0].toString().indexOf(':') > 0) {
        st = timeData.coordRange[0]
        et = timeData.coordRange[1]
      } else {
        st = data.timeList[timeData.coordRange[0]]
        et = data.timeList[timeData.coordRange[1]]
        st = !st ? '09:30' : st
        et = !et ? '15:00' : et
      }
      startTime = new Date(2018, 1, 1, st.split(':')[0], st.split(':')[1])
      endTime = new Date(2018, 1, 1, et.split(':')[0], et.split(':')[1])
    } else {
      startTime = new Date(2018, 1, 1, 9, 30)
      endTime = new Date(2018, 1, 1, 15, 0)
    }
    store.dispatch('lineChartBrushSelectedAction', [startTime, endTime])
  })
  echart.clear()
  window.onresize = echart.resize
  echart.setOption(options, true)
  echart.hideLoading()
  return echart
}

// 图形数据结构处理
function splitData (rawData) {
  let data = rawData
  let timeList = []
  let chartData = []
  let volumes = []
  let lastCloseData = data.lastEndIndexResult
  let ampliToday = data.ampliToday
  let todayData = data.realIndexChartData // 时间数据
  let rate = ampliToday / lastCloseData * 100
  rate = rate.toFixed(2) // 涨跌幅百分比
  todayData.forEach((el) => {
    timeList.push(moment(el[0]).format('HH:mm'))
    chartData.push(el[4])
    volumes.push(el[5])
  })
  return {
    timeList,
    chartData,
    volumes,
    lastCloseData,
    ampliToday,
    rate
  }
}

/**
 * 分时图叠加
 * @param {object} data 图表叠加数据
 * @param {object} store 分时图domId
 * @return {object} null
 */
export function lineSuperposition (data, store) {
  let myLine = document.getElementById(store.state.chartName)
  let lineChart = echarts.init(myLine, getTheme())
  let option = store.rootState.timeChartOptions
  option.yAxis.push({
    splitNumber: 1,
    min: 0 - data.saleSoldMaxValue, // 最小
    max: data.saleSoldMaxValue // 最大
  })
  option.series.push({
      name: '内外盘差',
      type: 'bar',
      stack: 'up',
      xAxisIndex: 0,
      yAxisIndex: 3,
      data: data.saleSoldData,
      itemStyle: {
        normal: {
          color: function (params) {
            if (params.data > 0) {
              return '#e33f2d'
            }
            return '#12a08e'
          }
        }
      }
    }
  )
  lineChart.setOption(option)
  // let option = cha
}

/**
 * 分时图框选调整
 * @param {string} DOMId 分时图domId
 * @param {object} store 全局状态
 * @return {object} null
 */
export function changeLineBrush (DOMId, store) {
  let myLine = document.getElementById(DOMId)
  let echart = echarts.init(myLine, getTheme())
  // echart.showLoading();
  let range = [moment(store.state.startTime).format('HH:mm'), moment(store.state.endTime).format('HH:mm')]
  let areas = []
  if (!(range[0] === '09:30' && range[1] === '15:00')) {
    areas = [
      {
        brushType: 'lineX',
        coordRange: range,
        xAxisIndex: 0
      }
    ]
  }
  echart.dispatchAction({
    type: 'brush',
    areas: areas
  })
}

/**
 * 分时图框选tooltip
 * @param {store} store 全局状态
 * @return {string} null
 */
export function showBrushTooltip (store) {
  let myLine = document.getElementById(store.state.chartName)
  let echart = echarts.init(myLine, getTheme())
  echart.dispatchAction({
    type: 'showTip',
    alwaysShowContent: true,
    position: function (pos, params, el, elRect, size) {
      let obj = {top: 35}
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
      return obj
    },
    formatter: function () {
      return 1111
    }
  })
}
