<!--上证指数-->
<template>
    <div class="composite-index" id="ShhStockMonitorTime"></div>
</template>
<script>
  import moment from 'moment'
  import * as types from '@/store/mutation-types'
  import {
    getMarketTimeLine
  } from '@/service/marketSupervise'
  import { drawLineChart } from '@/utils/charts/lineChart'

  let echarts = require('echarts')
  export default {
    components: {},
    name: 'composite-index',
    props: {
      selectDate: '',
      stockCode: {}
    },
    watch: {},
    data () {
      return {
        lastEndIndexResult: '',
        nowOpen: '',
        highest: '',
        lowest: '',
        tim: '',
        TdatetimerFun: null,
        echart: null
      }
    },
    mounted () {
      let myLine = document.getElementById('ShhStockMonitorTime')
      this.echart = echarts.init(myLine, this.gfnGetTheme())
      this.echart.clear()
      this.gfnEchartShowLoading(this.echart)
      this.drawLineChart()
    },
    methods: {
      initEcharts (res) {
        let that = this
        let data = this.splitData(res)
        let nowOpenColor = this.nowOpen > this.lastEndIndexResult ? 'up' : 'down'
        let upColor = this.gfnFormatSecurityColor(1), downColor = this.gfnFormatSecurityColor(-1)
        let options = {
          title: [
            {
              text: res.secName,
              left: 'center'
            },
            {
              text: `今开：{${nowOpenColor}|${this.nowOpen}}\n昨收：${this.lastEndIndexResult} \n最高：{up|${this.highest}} \n最低：{down|${this.lowest}} \n成交量：${res.transVol} 亿股\n成交额：${res.transAmount}亿元\n${this.tim}`,
              textAlign: 'left',
              textStyle: {
                color: '#7b8fb9',
                fontSize: 14,
                fontWeight: 'lighter',
                lineHeight: 25,
                rich: {
                  up: {
                    fontSize: 14,
                    color: upColor
                  },
                  down: {
                    fontSize: 14,
                    color: downColor
                  }
                }
              },
              top: '20%',
              left: '90%'
            }
          ],
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
              let index = params.findIndex(item => {
                return item.seriesName == '价格'
              })
              if (!params[index].value[2]) {
                return ''
              }
              let texts = params[0].name + '<br/>'
              let index2 = index > 0 ? 0 : 1
              texts += `${params[index].marker}${params[index].seriesName} : ${params[index].value[2]}<br/>`
              texts += `${params[index].marker}涨跌值:${`<i class= ${params[index].value[4] > 0 ? 'up>' : 'down>'}${params[index].value[4]}</i>`}<br/>`
              texts += `${params[index].marker}涨跌幅:${`<i class= ${params[index].value[1] > 0 ? 'up>' : 'down>'}${params[index].value[1]}%</i>`}<br/>`
              texts += `${params[index2].marker}${params[index2].seriesName} : ${params[index2].value + '亿元'}<br/>`
              texts += `${params[index2].marker}成交量: ${ params[index].value[3]}${that.stockCode.codeType == 'stock' ? '万股' : '亿股'}<br/>`
              return texts
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'}
          },
          grid: [
            {
              left: '60',
              right: '15%',
              top: '10%',
              height: '50%',
              containLabel: false
            },
            {
              left: '60',
              right: '15%',
              top: '70%',
              height: '27%',
              containLabel: false
            }
          ],
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
              min: (data.lastCloseData - data.increase).toFixed(2), // 最小
              max: (data.lastCloseData + data.increase).toFixed(2), // 最大
              z: 1
            },
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
              min: 0 - data.rate,
              max: data.rate,
              z: 1
            },
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
                formatter: function (value, index) {
                  if (index === 0) {
                    return 0
                  } else {
                    return that.stockCode.codeType == 'stock' ? value + '万股' : value + '亿元'
                  }
                },
                showMinLabel: false
              }
            },
          ],
          series: [
            {
              name: '价格',
              type: 'line',
              yAxisIndex: 1,
              data: data.chartData,
              smooth: true
            },
            {
              name: '成交金额',
              type: 'bar',
              stack: '总量',
              xAxisIndex: 1,
              yAxisIndex: 2,
              data: data.volumes,
              itemStyle: {
                normal: {
                  color: function (params) {
                    let volumesColor = ''
                    if (params.dataIndex === 0) {
                      if (data.todayData[0][1] < data.lastCloseData) {
                        volumesColor = downColor
                      } else {
                        volumesColor = upColor
                      }
                    } else {
                      if (data.todayData[params.dataIndex][1] > data.todayData[params.dataIndex - 1][1]) {
                        volumesColor = upColor
                      } else {
                        volumesColor = downColor
                      }
                    }
                    return volumesColor
                  }
                }
              }
            }
          ]
        }
        window.onresize = this.echart.resize
        this.echart.setOption(options, true)
        this.echart.hideLoading()
      },
      drawLineChart (selecttimePicker) {
        let timePicker = selecttimePicker || ['09:30:00', '15:00:00']
        let param = {
          code: this.stockCode.code,
          codeType: this.stockCode.codeType,
          startTime: timePicker[0].replace(/:/g, '').substring(0, 4),
          endTime: timePicker[1].replace(/:/g, '').substring(0, 4),
          trdDate: this.selectDate
        }
        this.tim = moment(this.selectDate).format('YYYY-MM-DD dddd')
        getMarketTimeLine(param).then((res) => {
          this.lastEndIndexResult = res.lastClose
          this.nowOpen = res.startPrice
          this.highest = res.maxPrice
          this.lowest = res.minPrice
          this.initEcharts(res)
          this.TdatetimerFun = setTimeout(this.drawLineChart, 60 * 1000)
        })
      },
      // 图形数据结构处理
      splitData (rawData) {
        // 图形数据结构处理
        let indexData = rawData
        let timeList = []
        let chartData = []
        let volumes = []
        let lastCloseData = indexData.lastClose
        let todayData = indexData.chartData
        let maxPrice = indexData.maxPrice
        let minPrice = indexData.minPrice
        let increase = indexData.increase
        let rate = indexData.amplitude
        rate = rate.toFixed(2)
        todayData.forEach((el, i) => {
          timeList.push(moment(el[0], 'HHmm').format('HH:mm'))
          chartData.push([i, el[3], el[1], el[4], el[2]])
          if (this.stockCode.codeType == 'stock')
            volumes.push(el[4])
          else
            volumes.push(el[5])
        })
        return {
          timeList,
          lastCloseData,
          chartData,
          rate,
          todayData,
          volumes,
          maxPrice,
          minPrice,
          increase
        }
      }
    },
    beforeDestroy () {
      clearInterval(this.TdatetimerFun)
    }
  }
</script>
<style lang="less" scoped>
    .composite-index {
        height: 310px;
    }
</style>
