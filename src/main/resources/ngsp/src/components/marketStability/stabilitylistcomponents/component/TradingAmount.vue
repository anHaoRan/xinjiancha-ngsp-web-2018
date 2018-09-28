<!--买卖金额-->
<template>
    <div>
        <div class="trading-amount" id="ShhStockMonitorTime"></div>
    </div>
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
      code: ''
    },
    data () {
      return {
        lastEndIndexResult: '',
        nowOpen: '',
        highest: '',
        lowest: '',
        tim: '',
        echart: null,
        options: null
      }
    },
    computed: {
      volumes: function () {
        return this.$parent.$data.detailMinute
      },
      productType: function () {
        return this.$parent.$data.productType
      }
    },
    watch: {
      volumes () {
        this.drawLineChart()
      }
    },
    mounted () {

    },
    methods: {
      initEcharts (res) {
        let myLine = document.getElementById('ShhStockMonitorTime')
        this.echart = echarts.init(myLine, this.gfnGetTheme())
        this.gfnEchartShowLoading(this.echart)
        let data = splitData(res)
        let nowOpenColor = this.nowOpen > this.lastEndIndexResult ? 'up' : 'down'
        let upColor = this.gfnFormatSecurityColor(1), downColor = this.gfnFormatSecurityColor(-1)

        this.options = {
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
                    color: '#ff402b'
                  },
                  down: {
                    fontSize: 14,
                    color: '#12bba5'
                  }
                }
              },
              top: '25%',
              right: 0
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
              texts += `${params[index].marker}${params[index].seriesName} : ${params[index].value[2]}<br/>`
              texts += `${params[index].marker}涨跌值:${`<i class= ${params[index].value[4] > 0 ? 'up>' : 'down>'}${params[index].value[4]}</i>`}<br/>`
              texts += `${params[index].marker}涨跌幅:${`<i class= ${params[index].value[1] > 0 ? 'up>' : 'down>'}${params[index].value[1]}%</i>`}<br/>`
              for (let key of params) {
                if (key.seriesName == '买入金额' || key.seriesName == '卖出金额')
                  texts += `${key.marker}${key.seriesName}:${key.value}（万元）<br>`
              }
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
            // 左下轴
            {
              type: 'value',
              gridIndex: 1,
              position: 'left',
              axisTick: {show: true},
              splitNumber: 1,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#273558'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#273558'
                }
              },
              axisLabel: {
                color: '#7b8fb9',
                formatter: function (value, index) {
                  return value + '万元'
                }
              }
            }
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
              name: '买入金额',
              type: 'bar',
              stack: '1',
              xAxisIndex: 1,
              yAxisIndex: 2,
              itemStyle: {
                normal: {
                  color: '#ff402b'
                }
              }
            },
            {
              name: '卖出金额',
              type: 'bar',
              stack: '1',
              xAxisIndex: 1,
              yAxisIndex: 2,
              itemStyle: {
                normal: {
                  color: '#12bba5'
                }
              }
            }
          ]
        }
        this.echart.clear()
        window.onresize = this.echart.resize
        this.echart.setOption(this.options)
        this.echart.hideLoading()
        this.fnRenewEcharts()
      },
      fnRenewEcharts () {
        let bArr = []
        let sArr = []
        for (let key of this.volumes) {
          if (this.productType == '0') {
            //  全部
            bArr.push(key.trdamt_b)
            sArr.push(key.trdamt_s)
          } else if (this.productType == '1') {
            //  上证50
            bArr.push(key.trdamt_b_sz50)
            sArr.push(key.trdamt_s_sz50)
          } else {
            //  非上证50
            bArr.push(key.trdamt_b_fsz50)
            sArr.push(key.trdamt_s_fsz50)
          }
        }
        this.options.series[1].data = bArr
        this.options.series[2].data = sArr
        let max = Math.max.apply(Math, bArr)
        let min = Math.min.apply(Math, sArr)
        let maxOfmin = max
        if (Math.abs(min) > max) {
          maxOfmin = Math.abs(min)
        }
        this.options.yAxis[2].min = 0 - maxOfmin
        this.options.yAxis[2].max = maxOfmin
        this.echart.setOption(this.options)
      },
      drawLineChart (selecttimePicker) {
        let timePicker = selecttimePicker || ['09-30-00', '15-00-00']
        let param = {
          code: this.code != undefined ? this.code : '000001',
          codeType: 'index',
          startTime: timePicker[0].replace(/-/g, '').substring(0, 4),
          endTime: timePicker[1].replace(/-/g, '').substring(0, 4),
          trdDate: this.$route.params.tradedate
        }
        this.tim = moment(this.$route.params.tradedate).format('YYYY-MM-DD dddd')
        getMarketTimeLine(param).then((res) => {
          this.lastEndIndexResult = res.lastClose
          this.nowOpen = res.startPrice
          this.highest = res.maxPrice
          this.lowest = res.minPrice
          this.initEcharts(res)
        })
      }
    }
  }

  // 图形数据结构处理
  function splitData (rawData) {
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
</script>
<style lang="less" scoped>
    .trading-amount {
        height: 350px;
    }
</style>
