import { getTheme } from './../storageUtil'
import { securityColor, fixedColor } from './../constants'

let echarts = require('echarts')

export function splitData (data, type) {
  let timeList = []
  let chartData = []
  let volumes = []
  let lastClose = data.lastClose
  let increase = data.increase
  let todayData = data.chartData // 时间数据
  let rate = data.amplitude // 涨跌幅百分比
  todayData.forEach((el, index) => {
    timeList.push(el[0].substring(0, 2) + ':' + el[0].substring(2, 4))
    chartData.push([index, el[3], el[1], el[2], el[4], el[5]])
    if (type === 'stock') {
      volumes.push(el[4])
    } else {
      volumes.push(el[5])
    }
  })
  return {
    timeList,
    chartData,
    volumes,
    lastClose,
    increase,
    rate
  }
}

/**
 * 第一次加载数据，若需增量刷新，需另外操作
 * @param {*} chartData 后端返回分时图数据
 * @param {string} domId 画分时图的dom id
 * @param {string} type index:指数, board: 板块, stock: 个股
 * @returns {*} 分时图图例
 */
export function drawStockTimeSharing (chartData, domId, type) {
  let echart = echarts.init(document.getElementById(domId), getTheme())
  echart.showLoading()
  let data = splitData(chartData, type)

  let option = {
    title: {},
    legend: {
      show: false,
      data: ['价格', '成交量', '实时流动性监测', '大小盘乖离率']
    },
    tooltip: {
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
        if (pos[0] < size.viewSize[0] / 2) {
          return [pos[0] + 20, '36']
        }
        return [pos[0] - 220, '36']
      },
      formatter: function (params) { // eslint-disable-line
        let fm = []
        let fmx = false
        for (let idx in params) {
          let param = params[idx]
          if (!fmx) {
            fm.push(param.name + '<br/>')
            fmx = true
            fm.push('<hr size=1 style="margin: 3px 0">')
          }
          if (params[0].data === null || (param.data !== null && param.data[2] === null)) {
            fm = []
            break
          }
          if (param.seriesName === '价格') {
            fm.push(param.marker + param.seriesName + '：' + param.data[2] + '<br/>')
            fm.push(param.marker + '涨跌值：<i class=' + (param.data[3] > 0 ? 'up>' : 'down>') + param.data[3] + '</i><br/>')
            fm.push(param.marker + '涨跌幅：<i class=' + (param.data[1] > 0 ? 'up>' : 'down>') + param.data[1] + '%</i><br/>')
          } else if (param.seriesName === '成交量') {
            fm.push(param.marker + param.seriesName + '：' + param.data + '万股<br/>')
            let je = params[0].data.length === 6 ? params[0].data[5] : params[1].data[5]
            fm.push(param.marker + '成交金额：' + (je !== null ? je + '亿元' : '-') + '<br/>')
          } else if (param.seriesName === '成交金额') {
            let cjl = params[0].data.length === 6 ? params[0].data[4] : params[1].data[4]
            fm.push(param.marker + '成交量：' + (cjl !== null ? cjl + '亿股' : '-') + '<br/>')
            fm.push(param.marker + param.seriesName + '：' + param.data + '亿元<br/>')
          } else if (param.seriesName === '内外盘差' || param.seriesName === '实时流动性监测') {
            fm.push(param.marker + param.seriesName + '：' + (param.data !== null ? param.data + '亿元' : '-') + '<br/>')
          } else {
            fm.push(param.marker + param.seriesName + '：' + param.data + '<br/>')
          }
        }
        return fm.join('')
      }
    },
    toolbox: {
      top: 5,
      right: 100,
      feature: {
        dataZoom: {
          show: false
        },
        brush: {
          type: ['lineX', 'clear']
        },
        saveAsImage: {
          type: 'jpeg'
        }
      }
    },
    brush: {
      // seriesIndex: 'all',
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
    },
    grid: [
      {
        left: '60',
        right: '60',
        top: '3%',
        height: '60%',
        containLabel: false
      },
      {
        left: '60',
        right: '60',
        top: '73%',
        height: '27%',
        containLabel: false
      }
    ],
    axisPointer: {
      link: {xAxisIndex: 'all'}
    },
    xAxis: [
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
    ],
    yAxis: [
      // 上轴左1轴
      {
        scale: true,
        position: 'left',
        offset: 44,
        splitNumber: 2,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          inside: false,
          align: 'left',
          color: '#7b8fb9'
        },
        min: (data.lastClose - data.increase).toFixed(2), // 最小
        max: (data.lastClose + data.increase).toFixed(2), // 最大
        z: 1
      },
      // 下轴左1轴
      {
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
          inside: false,
          formatter: function (value, index) {
            if (index === 0) {
              return 0
            }
            return type === 'stock' ? value + '万股' : value + '亿元'
          },
          showMinLabel: false
        }
      },
      // 上轴右1轴
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
          inside: false,
          formatter: function (value) {
            return value + '%'
          }
        },
        min: 0 - data.rate, // 最小
        max: data.rate, //  最大
        z: 1
      },
      // 上轴左2轴 实施流动性监测
      {
        show: false,
        scale: true,
        position: 'left',
        splitNumber: 1,
        axisLabel: {
          color: fixedColor.liquidity,
          inside: true,
          formatter: function (value) {
            return value + '亿元'
          }
        },
        min: 0,
        max: 0,
        z: 10
      },
      // 上轴右2轴 大小盘乖离率
      {
        show: false,
        scale: true,
        position: 'right',
        splitNumber: 1,
        axisLabel: {
          color: fixedColor.deviationRate,
          inside: true,
          formatter: function (value) {
            return value + '%'
          }
        },
        min: 0,
        max: 0,
        z: 10
      }
    ],
    series: [
      {
        name: '价格',
        type: 'line',
        yAxisIndex: 2,
        data: data.chartData,
        smooth: true
      },
      {
        name: type === 'stock' ? '成交量' : '成交金额',
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
                if (data.chartData[0][2] < data.lastClose) {
                  volumesColor = securityColor.down
                } else {
                  volumesColor = securityColor.up
                }
              } else {
                if (data.chartData[params.dataIndex][2] < data.chartData[params.dataIndex - 1][2]) {
                  volumesColor = securityColor.down
                } else {
                  volumesColor = securityColor.up
                }
              }
              return volumesColor
            }
          }
        }
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
