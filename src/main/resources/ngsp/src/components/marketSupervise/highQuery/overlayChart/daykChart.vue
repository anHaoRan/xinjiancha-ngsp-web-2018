<template>
  <div id='daykChart' style='height: 400px;'></div>
</template>

<script>
  import moment from 'moment'
  import {getMarketDayLine} from '../../../../service/marketSupervise/index'

  let echarts = require('echarts')
  export default {
    name: 'dayk-chart',
    props: ['queryParams'],
    data() {
      return {}
    },
    mounted() {
      this.getDayKChartData()
    },
    methods: {
      getDayKChartData() {
        let kparams = {
          market: 'sh1',
          code: '000001',
          codeType: 'index',
          candleStyle: 'D',
          startDate: '',
          endDate: ''
        }
        getMarketDayLine(kparams)
          .then((resp) => {
            let res = resp.chartData
            let timeList = []
            let volumes = []
            let barData = []
            res.forEach((el) => {
              timeList.push(moment(el[0], 'YYYYMMDD').format('YYYY/MM/DD'))
              volumes.push([
                el[1], // 开盘open
                el[2], // 收盘close
                el[3], // 最低lowest
                el[4], // 最高highest
                el[5], // 成交量
                el[7], // 涨跌
                el[8], // 涨跌幅
                el[9], // 振幅
                el[6], // 成交金额
                el[10] // 前收盘
              ])
              if (!el[6]) {
                barData.push(el[6])
              } else {
                barData.push((el[6] / 100000000).toFixed(2))
              }
            })
            let seriseData = [
              {
                type: 'candlestick',
                data: volumes,
                smooth: true,
                itemStyle: {
                  color: '#ff402b',
                  color0: '#12bba5',
                  borderColor: null,
                  borderColor0: null
                }
              },
              {
                name: '总成交金额',
                type: 'bar',
                stack: '总量',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: barData,
                itemStyle: {
                  normal: {
                    color: function (params) {
                      let volumesColor = ''
                      if (res[params.dataIndex][2] > res[params.dataIndex][1]) {
                        volumesColor = '#ff402b'
                      } else {
                        volumesColor = '#12bba5'
                      }
                      return volumesColor
                    }
                  }
                }
              }
            ]
            let data = {timeList, seriseData}
            this.drawDayKChart(data, 'daykChart')
          })
      },
      drawDayKChart(chartData, DOMId) {
        let myLine = document.getElementById(DOMId)
        let echart = echarts.init(myLine, this.gfnGetTheme())
        echart.clear()
        window.onresize = echart.resize
        echart.showLoading()
        let options = {
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
              return [pos[0] - 220, '16']
            },
            formatter: function (params) {
              let fm = []
              let fmx = false
              for (let idx in params) {
                let param = params[idx]
                if (!fmx) {
                  fm.push('日期：' + param.name + '<br/>')
                  fmx = true
                }
                fm.push('<hr size=1 style="margin: 3px 0">')
                if (param.seriesType === 'bar') {
                  let je = params[0].seriesType == 'candlestick' ? params[0].data[5] : params[1].data[5]
                  fm.push('总成交量：' + (je ? ((je / 100000000).toFixed(2) + '亿股') : '-') + '<br/>')
                  fm.push(param.seriesName + '：' + (param.value ? (param.value + '亿元') : '-') + '<br/>')
                } else {
                  fm.push('开盘：' + (param.data[1] ? ('<i class=' + (param.data[1] > param.data[10] ? 'up>' : 'down>') + param.data[1] + '</i>') : '-') + '<br/>')
                  fm.push('最高：' + (param.data[4] ? ('<i class=' + (param.data[4] > param.data[1] ? 'up>' : 'down>') + param.data[4] + '</i>') : '-') + '<br/>')
                  fm.push('最低：' + (param.data[3] ? ('<i class=' + (param.data[3] > param.data[1] ? 'up>' : 'down>') + param.data[3] + '</i>') : '-') + '<br/>')
                  fm.push('收盘：' + (param.data[2] ? ('<i class=' + (param.data[2] > param.data[1] ? 'up>' : 'down>') + param.data[2] + '</i>') : '-') + '<br/>')
                  fm.push('涨跌值：' + (param.data[6] ? ('<i class=' + (param.data[6] > 0 ? 'up>' : 'down>') + param.data[6] + '</i>') : '-') + '<br/>')
                  fm.push('涨跌幅：' + (param.data[7] ? ('<i class=' + (param.data[7] > 0 ? 'up>' : 'down>') + param.data[7] + '%</i>') : '-') + '<br/>')
                  fm.push('振幅：' + (param.data[8] ? param.data[8] + '%' : '-') + '<br/>')
                }
              }
              return fm.join('')
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'}
          },
          toolbox: {
            top: 7,
            right: 75,
            feature: {
              dataZoom: {
                yAxisIndex: false
              },
              brush: {
                type: ['lineX', 'clear']
              },
              saveAsImage: {}
            }
          },
          brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            throttleType: 'debounce',
            throttleDelay: '300',
            removeOnClick: true,
            transformable: false,
            brushStyle: {
              color: 'rgba(255,255,255,0.03)',
              borderColor: '#455577',
              borderWidth: 1
            },
            outOfBrush: {
              colorAlpha: 0.5
            }
          },
          grid: [
            {
              left: '5%',
              right: '5%',
              top: '10%',
              height: '50%',
              containLabel: false,
              show: true,
              borderColor: '#263657',
              borderWidth: 1
            },
            {
              left: '5%',
              right: '5%',
              top: '68%',
              height: '20%',
              containLabel: false,
              show: true,
              borderColor: '#263657',
              borderWidth: 1
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: chartData.timeList,
              boundaryGap: false,
              splitLine: {
                show: false
              },
              axisLine: {show: false},
              axisTick: {
                show: true,
                lineStyle: {
                  color: '#506798'
                }
              },
              axisLabel: {
                color: '#506798'
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              data: chartData.timeList,
              min: 'dataMin',
              max: 'dataMax',
              boundaryGap: false,
              axisTick: {show: false},
              splitLine: {
                show: false
              },
              axisPointer: {
                z: 100
              },
              axisLabel: {show: false},
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#263657'
                }
              }
            },
            {
              type: 'category',
              gridIndex: 0,
              axisTick: {show: false},
              axisLine: {
                onZero: true,
                lineStyle: {
                  color: '#455579'
                }
              }
            }
          ],
          yAxis: [
            {
              scale: true,
              axisLabel: {
                color: '#506798'
              },
              splitNumber: 2,
              axisTick: {show: false},
              splitArea: {
                show: true
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              },
              position: 'left'
            }, //  左上轴
            {
              type: 'value',
              gridIndex: 1,
              axisTick: {show: false},
              splitNumber: 2,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLabel: {
                color: '#506798',
                formatter: function (value, index) {
                  if (index === 0) {
                    return 0
                  } else {
                    return Number(value) + '亿元'
                  }
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            } // 左下轴
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: 0,
              end: 100
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: 'slider',
              top: '90%',
              start: 40,
              end: 60,
              textStyle: {
                color: '#506798'
              },
              dataBackgroundColor: '#334164',
              dataBackground: {
                lineStyle: {color: '#aec0e6'},
                areaStyle: {color: '#334164'}
              },
              handleColor: '#a7b7cc',
              fillerColor: 'rgba(0,0,0,0.1)',
              borderColor: '#334164'
            }
          ],
          series: chartData.seriseData
        }
        echart.setOption(options, true)
        let that = this
        echart.on('brushSelected', function (val) {
          var timeData = val.batch[0].areas[0]
          if (timeData) {
            let range
            range = timeData.coordRange
            let startTime = range[0]
            let overTime = range[1]
            startTime = chartData.timeList[startTime]
            overTime = chartData.timeList[overTime]
            that.$emit('getDayTime', [startTime, overTime])
            that.$store.commit('savebrushTimeParams', {startTime: startTime, overTime: overTime})
          } else {
            that.$emit('getDayTime', ['', ''])
            that.$store.commit('savebrushTimeParams', {beginTime: '', endTime: ''})
          }
        })
        echart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'single'
          }
        })
        echart.hideLoading()
      }
    }
  }
</script>

<style lang='less'>

</style>
