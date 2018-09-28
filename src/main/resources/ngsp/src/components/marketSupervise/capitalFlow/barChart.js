import Vue from 'vue'

let echarts = require('echarts')

/**
 * 双轴柱状图画法
 * @param {object} data 图表数据
 * @param {string} id 需要画图的domId
 * @return {object} null
 */
export function drawBarCharts(data, id) {
  let myLine = echarts.init(document.getElementById(id), Vue.prototype.gfnGetTheme());
  myLine.clear()
  window.onresize = myLine.resize
  myLine.showLoading()
  myLine.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        return params[0].marker + params[0].name.split(',')[0] + '：' + params[0].value
      }
    },
    grid: [
      {
        left: '2%',
        right: '2%',
        top: 10,
        bottom: 20,
        containLabel: true,
        show: true,
        borderWidth: 1,
        borderColor: '#263657'
      }
    ],
    toolbox: {
      show: true,
      top: -5,
      right: 10,
      itemSize: 14,
      feature: {
        saveAsImage: {}
      },
      showTitle: false
    },
    xAxis: [
      {
        axisLabel: {
          show: false,
          color: '#506798'
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: 'transparent'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0,0,0,0.4)',
            type: 'solid'
          }
        },
        type: 'value',
        max: function (val) {
          return parseInt(val.max + val.max)
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        data: data.category1,
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#97a4d9',
          interval: 0,
          formatter: function (params) {
            return `{${params.split(',')[1] > 0 ? params.split(',')[2] : params.split(',')[3]}|${params.split(',')[1]}%}  ${params.split(',')[0]}`
          },
          rich: {
            a: {
              color: '#b01e0f',
              align: 'left'
            },
            b: {
              color: '#007c26',
              align: 'left'
            }
          }
        },
        splitArea: {
          show: true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(0,0,0,0.1)',
            type: 'solid'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#334164'
          }
        }
      },
      {
        type: 'category',
        data: data.category2,
        axisLabel: {
          color: '#97a4d9',
          interval: 0,
          formatter: function (params) {
            return `${params.split(',')[0]}  {${params.split(',')[1] > 0 ? params.split(',')[2] : params.split(',')[3]}|${params.split(',')[1]}%}`
          },
          rich: {
            a: {
              color: '#b01e0f',
              align: 'right'
            },
            b: {
              color: '#007c26',
              align: 'right'
            }
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#263657',
            type: 'solid'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#334164'
          }
        },
        position: 'right'
      }
    ],
    series: [
      {
        type: 'bar',
        data: data.sellCount,
        label: {
          normal: {
            show: true,
            position: 'inside',
            color: '#fff'
          }
        },
        itemStyle: {
          normal: {
            color: function (params) {
              let colorLiat = ['#55D222', '#1c9286', '#788d32', '#c28d28', '#d24c29']
              return colorLiat[params.dataIndex]
            }
          }
        }
      }
    ]
  }, true)
  myLine.hideLoading()
}
