<template>
  <div class="market-time-chart">
    <div class="chart-content">
      <div id="MonitorTime" class="stock-chart"></div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import * as types from '@/store/mutation-types'
  import { securityColor, fixedColor } from '@/utils/constants'
  import { getMarketTimeLine } from '@/service/marketSupervise'
  import { getDeviationRateApi, getLiquidityMonitorApi } from '@/service/marketSupervise/stockOperationMonitor'
  import { drawStockTimeSharing } from '@/utils/charts/stockTimeSharingChart'

  export default {
    data () {
      return {
        chart: null,
        option: null
      }
    },
    methods: {
      // 获取分类投资者监测分时图数据
      getMonitorLineData () {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getIndustryTimeLineParams))
        getMarketTimeLine(params).then(resp => {
          if (this.chart === null) {
            this.chart = drawStockTimeSharing(resp, 'MonitorTime')
            this.option = this.chart.getOption()
            this.option.xAxis[1].axisLabel = {
              color: fixedColor.axisLabel,
              interval: 29 // 横坐标间隔时间
            }
            this.option.yAxis[0].axisLabel = {
              inside: false,
              align: 'left',
              color: fixedColor.axisLabel
            }
            this.option.yAxis[1].axisLabel = {
              inside: false,
              color: fixedColor.axisLabel,
              formatter: function (value, index) {
                if (index === 0) {
                  return 0
                }
                return value + '亿元'
              },
              showMinLabel: false
            }
            this.option.yAxis[2].axisLabel = {
              color: fixedColor.axisLabel,
              inside: false,
              formatter: function (value) {
                return value + '%'
              }
            }
            this.option.yAxis[3].axisLabel = {
              inside: true,
              color: fixedColor.liquidity,
              formatter: function (value) {
                return value + '亿元'
              }
            }
            this.option.series.push({
              name: '实时流动性监测',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 3,
              data: [],
              lineStyle: {
                color: '#fa5555',
                opacity: 1
              },
              itemStyle: {
                normal: {
                  color: '#fa5555'
                }
              }
            })
            this.option.series[2].lineStyle = {color: fixedColor.liquidity}
            this.option.series[2].itemStyle = {normal: {color: fixedColor.liquidity}}
            this.option.yAxis[4].axisLabel = {
              inside: true,
              color: fixedColor.deviationRate,
              formatter: function (value) {
                return value + '%'
              }
            }
            this.option.series.push({
              name: '大小盘乖离率',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 4,
              data: [],
              lineStyle: {
                color: fixedColor.deviationRate
              },
              itemStyle: {
                normal: {
                  color: fixedColor.deviationRate
                }
              }
            })
            this.option.series[3].lineStyle = {color: fixedColor.deviationRate}
            this.option.series[3].itemStyle = {normal: {color: fixedColor.deviationRate}}
            this.option.tooltip = {
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
              formatter: this.tooltipFormat
            }
            let lastCloseData = (Number(this.option.yAxis[0].min) + Number(this.option.yAxis[0].max)) / 2
            let previous
            this.option.series[1].itemStyle = {
              normal: {
                color: function (params) {
                  let volumesColor = ''
                  if (params.dataIndex === 0) {
                    if (params.data >= lastCloseData) {
                      volumesColor = securityColor.down
                    } else {
                      volumesColor = securityColor.up
                    }
                  } else {
                    if (previous >= params.data) {
                      volumesColor = securityColor.down
                    } else {
                      volumesColor = securityColor.up
                    }
                  }
                  previous = params.data
                  return volumesColor
                }
              }
            }
            let _this = this
            this.chart.on('brushSelected', function (val) {
              let timeData = val.batch[0].areas[0]
              let startTime = new Date()
              let endTime = new Date()
              if (timeData) {
                // 同步时间选择器的时间
                let st, et
                let timeList = _this.option.xAxis[0].data
                if (timeData.coordRange[0].toString().indexOf(':') > 0) {
                  st = timeData.coordRange[0]
                  et = timeData.coordRange[1]
                } else {
                  st = timeList[timeData.coordRange[0]]
                  et = timeList[timeData.coordRange[1]]
                  st = !st ? '09:30' : st
                  et = !et ? '15:00' : et
                }
                startTime = new Date(2018, 1, 1, st.split(':')[0], st.split(':')[1])
                endTime = new Date(2018, 1, 1, et.split(':')[0], et.split(':')[1])
                _this.$store.commit(types.C_CHANGE_TIME_RANGE, [startTime, endTime])
              } else {
                startTime = new Date(2018, 1, 1, 9, 30)
                endTime = new Date(2018, 1, 1, 15, 0)
                _this.$store.commit(types.C_CHANGE_TIME_RANGE, [startTime, endTime])
              }
            })
            if (this.$route.query.params) {
              let params = JSON.parse(this.$route.query.params)
              if (params.stockCode !== '000001') {
                this.$emit('refreshAddItems', [params.stockCodeName], [{code: params.stockCode, name: params.stockCodeName, type: params.codeType}])
              }
              let startTime = new Date(2018, 1, 1, params.beginTime.split(':')[0], params.beginTime.split(':')[1])
              let endTime = new Date(2018, 1, 1, params.endTime.split(':')[0], params.endTime.split(':')[1])
              this.$store.commit(types.C_CHANGE_TIME_RANGE, [startTime, endTime])
              this.changeBrush()
            }
          } else {
            this.option.yAxis[0].min = (resp.lastClose - resp.increase).toFixed(2)
            this.option.yAxis[0].max = (resp.lastClose + resp.increase).toFixed(2)
            if (resp.amplitude - this.option.yAxis[2].max > 0 || this.option.series.length === 4) {
              this.option.yAxis[2].min = 0 - resp.amplitude
              this.option.yAxis[2].max = resp.amplitude
            }
            let chartData = []
            let volumes = []
            resp.chartData.forEach((el, index) => {
              chartData.push([index, el[3], el[1], el[2], el[4], el[5]])
              volumes.push(el[5])
            })
            this.option.series[0].data = chartData
            this.option.series[1].data = volumes
            this.option.series[1].itemStyle = {
              normal: {
                color: function (params) {
                  let volumesColor = ''
                  if (params.dataIndex === 0) {
                    if (chartData[0][2] < resp.lastClose) {
                      volumesColor = securityColor.down
                    } else {
                      volumesColor = securityColor.up
                    }
                  } else {
                    if (chartData[params.dataIndex][2] < chartData[params.dataIndex - 1][2]) {
                      volumesColor = securityColor.down
                    } else {
                      volumesColor = securityColor.up
                    }
                  }
                  return volumesColor
                }
              }
            }
            this.chart.setOption(this.option)
            this.chart.dispatchAction({
              type: 'takeGlobalCursor',
              key: 'brush',
              brushOption: {
                brushType: 'lineX',
                brushMode: 'single'
              }
            })
          }
        })
      },

      // eslint-disable-next-line
      tooltipFormat (params) {
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
            fm.push(param.marker + param.seriesName + '：' + param.data + '亿股<br/>')
            let je = params[0].data.length === 6 ? params[0].data[5] : params[1].data[5]
            fm.push(param.marker + '成交金额：' + (je !== null ? je + '亿元' : '-') + '<br/>')
          } else if (param.seriesName === '成交金额') {
            let cjl = params[0].data.length === 6 ? params[0].data[4] : params[1].data[4]
            fm.push(param.marker + '成交量：' + (cjl !== null ? cjl + '亿股' : '-') + '<br/>')
            fm.push(param.marker + param.seriesName + '：' + param.data + '亿元<br/>')
          } else if (param.seriesName === '内外盘差' || param.seriesName === '实时流动性监测') {
            fm.push(param.marker + param.seriesName + '：' + (param.data !== null ? param.data + '亿元' : '-') + '<br/>')
          } else {
            fm.push(param.marker + param.seriesName + '：<i class=' + (param.data > 0 ? 'up>' : 'down>') + param.data + '%</i><br/>')
          }
        }
        return fm.join('')
      },

      // 实时流动性监测 叠加
      getLiquidityMonitorData () {
        if (!this.$store.state.investorMonitoring.liquidityMonitor) {
          this.option.legend[0].selected['实时流动性监测'] = false
          this.option.yAxis[3].show = false
          this.chart.setOption(this.option)
          return
        }
        let indexCode = this.$store.state.investorMonitoring.currentIndexCode
        let tradeDate = this.$store.state.investorMonitoring.tradeDate
        getLiquidityMonitorApi(indexCode, tradeDate === '' ? '' : moment(tradeDate).format('YYYYMMDD')).then(resp => {
          let data = []
          let max = 0
          let val = 0
          resp.DATA.forEach((el) => {
            val = Math.abs(el.val)
            max = val > max ? val : max
            data.push(el.val)
          })
          this.option.legend[0].selected['实时流动性监测'] = true
          this.option.yAxis[3].show = true
          this.option.yAxis[3].min = 0
          this.option.yAxis[3].max = max
          this.option.series[2].data = data
          this.chart.setOption(this.option, true)
          this.changeBrush()
        })
      },

      // 大小盘乖离率 叠加
      getDeviationRateData () {
        if (!this.$store.state.investorMonitoring.deviationRate) {
          this.option.legend[0].selected['大小盘乖离率'] = false
          this.option.yAxis[4].show = false
          this.chart.setOption(this.option)
          return
        }
        let tradeDate = this.$store.state.investorMonitoring.tradeDate === '' ? '' : moment(this.$store.state.investorMonitoring.tradeDate).format('YYYYMMDD')
        getDeviationRateApi({startDate: tradeDate, endDate: tradeDate}).then(resp => {
          let data = []
          let max = 0
          let rate = 0
          resp.DATA.forEach((el) => {
            rate = Math.abs(el.rate)
            max = rate > max ? rate : max
            data.push(el.rate)
          })
          this.option.legend[0].selected['大小盘乖离率'] = true
          this.option.yAxis[4].show = true
          this.option.yAxis[4].min = -max
          this.option.yAxis[4].max = max
          this.option.series[3].data = data
          this.chart.setOption(this.option, true)
          this.changeBrush()
        })
      },

      // 自定义选择 叠加
      indexLineCompose (chartData) {
        this.option.series = this.option.series.slice(0, 4)
        if (chartData !== undefined) {
          let colorList = ['#339933', '#1b5eed', '#288783', '#1de3c0', '#6766cc', '#ea6e0d', '#ca6796']
          chartData.forEach((el, i) => {
            let data = this.splitData(el)
            if (data.max - Number(this.option.yAxis[2].max) > 0) {
              this.option.yAxis[2].min = 0 - data.max
              this.option.yAxis[2].max = data.max
            }
            this.option.series.push({
                name: data.name,
                type: 'line',
                xAxisIndex: 0,
                yAxisIndex: 2,
                data: data.seriesData,
                lineStyle: {color: colorList[i]},
                itemStyle: {normal: {color: colorList[i]}}
              }
            )
          })
        }
        this.chart.setOption(this.option, true)
        this.changeBrush()
      },

      // 叠加数据处理
      splitData (chartData) {
        let name = chartData.name
        let seriesData = []
        let max = 0
        let rate = 0
        chartData.data.forEach((el) => {
          rate = Math.abs(el[3])
          max = rate > max ? rate : max
          seriesData.push(el[3])
        })
        return {
          max,
          name,
          seriesData
        }
      },

      // 调整时间框,框选联动
      changeBrush () {
        let range = [moment(this.$store.state.investorMonitoring.startTime).format('HH:mm'), moment(this.$store.state.investorMonitoring.endTime).format('HH:mm')]
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
        this.chart.dispatchAction({
          type: 'brush',
          areas: areas
        })
        this.chart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'single'
          }
        })
      }
    }
  }
</script>

<style lang="less">
  /*上证指数图*/
  .market-time-chart {
    margin-top: -18px;
    .stock-chart {
      width: 100%;
      height: 310px;
    }
    .el-range-input {
      color: #999;
      background: transparent;
    }
    .el-range-separator {
      color: #999;
    }
    .chart-content {
      margin-top: 70px;
    }
  }
</style>
