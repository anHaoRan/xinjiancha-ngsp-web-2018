<template>
  <div>
    <el-row class="stock-header">
      <el-col :span="24" v-if="chartTitle!==''">
        <span class="title">{{chartTitle}}</span>
        <span>时间: <label>{{stockRiseFall.nowTime}}</label></span>
        <span>昨收: <label>{{yesterdayCloseIndex}}</label></span>
        <span v-if="currentType !== 'stock'">涨: <label class="rise">{{stockRiseFall.increaseNum}}</label></span>
        <span v-if="currentType !== 'stock'">平: <label>{{stockRiseFall.equalNum}}</label></span>
        <span v-if="currentType !== 'stock'">跌: <label class="fall">{{stockRiseFall.dereaseNum}}</label></span>
      </el-col>
    </el-row>
    <div class="overview-chart-brushstac" v-if="brushedData">
      <p>起止时刻：{{brushedData.selectedTime | timeRange}}</p>
      <hr size=1 style="margin: 3px 0">
      <p>起始价：{{brushedData.selected[0].st_price}}</p>
      <p>终止价：{{brushedData.selected[0].en_price}}</p>
      <p>最高：{{brushedData.selected[0].max_price | num2}}</p>
      <p>最低：{{brushedData.selected[0].min_price | num2}}</p>
      <p :class="brushedData.selected[0].increase_amount > 0 ? 'up' : 'down'">涨跌：{{brushedData.selected[0].increase_amount}}</p>
      <p :class="brushedData.selected[0].increase_range > 0 ? 'up' : 'down'">涨跌幅：{{brushedData.selected[0].increase_range}} %</p>
      <p>振幅：{{brushedData.selected[0].amplitude}} %</p>
      <p v-if="currentType === 'stock'">均价：{{brushedData.selected[0].average_price}}</p>
      <p>总成交量：{{brushedData.selected[0].total_volume}} {{currentType === 'stock' ? '万股' : '亿股'}}</p>
      <p>总成交额：{{brushedData.selected[0].total_turnover}} 亿元</p>
      <el-button size="small" type="primary" @click="toNewPage('#/stockOperationMonitor')" style="margin-right: 4px;">证券监测</el-button>
      <el-button size="small" type="primary" @click="toNewPage('#/classifiedInvestorMonitoring')" style="margin-right: 4px;">投资者监测</el-button>
      <el-button size="small" type="primary" @click="generateReport" :loading="loading">快速统计报告</el-button>
    </div>
    <div id="stockLineChart" class="stock-line-chart"></div>
  </div>
</template>

<script>
  import { securityColor } from '@/utils/constants'
  import {
    getMarketTimeLine,
    getStockSharingChartBrushed,
    getStockNetbuy,
    generateReport,
    getStockRiseFallInfo
  } from '@/service/marketSupervise'
  import { splitData, drawStockTimeSharing } from '@/utils/charts/stockTimeSharingChart'

  export default {
    computed: {
      currentType () {
        return this.$store.state.marketOverview.currentType
      }
    },
    data () {
      return {
        activeName: 'stockLineChart',
        chartTimeOut: null,
        stockRiseFall: {
          nowTime: '',
          increaseNum: 0,
          equalNum: 0,
          dereaseNum: 0
        },
        routerParams: {
          codeType: this.$store.state.marketOverview.currentType,
          stockCode: '',
          stockCodeName: '',
          beginTime: '',
          endTime: ''
        },
        loading: false,
        yesterdayCloseIndex: 0,
        chartTitle: '',
        chart: null,
        initedNetBuyGraph: false,
        brushedData: null
      }
    },
    watch: {
      currentType: function (val) {
        this.routerParams.codeType = val
      }
    },
    filters: {
      timeRange: function (val) {
        let stu = val.split('~')
        return stu[0].substring(0, 2) + ':' + stu[0].substring(2, 4) + '~' + stu[1].substring(0, 2) + ':' + stu[1].substring(2, 4)
      },
      num2: function (val) {
        return Number(val).toFixed(2)
      }
    },
    methods: {
      fnClearChart () {
        if (this.chart != null) {
          this.brushedData = null
          this.chart.dispose()
          this.chart = null
        }
        this.initedNetBuyGraph = false
      },
      toNewPage (url) {
        window.open(url + '?params=' + JSON.stringify(this.routerParams))
      },
      generateReport () {
        this.loading = true
        let params = {
          type: '1',
          startTime: this.routerParams.beginTime.replace(':', ''),
          endTime: this.routerParams.endTime.replace(':', '')
        }
        generateReport(params).then(resp => {
          if (resp.fileId !== null && resp.fileId !== '') {
            this.gfnDownloadFile(resp.fileId, resp.fileName)
          } else {
            this.$message.error(resp.message.message)
          }
          this.loading = false
        })
      },
      fnUpdateStockGraph (chartData) {
        // 画图
        if (this.chart === null) {
          this.chart = drawStockTimeSharing(chartData, 'stockLineChart', this.currentType)
          this.chart.on('brushSelected', this.fnHandleBrush)
          return
        }

        let data = splitData(chartData, this.currentType)
        let option = this.chart.getOption()
        option.yAxis[0].min = (data.lastClose - data.increase).toFixed(2)
        option.yAxis[0].max = (data.lastClose + data.increase).toFixed(2)
        if (data.rate - option.yAxis[2].max > 0) {
          option.yAxis[2].min = 0 - data.rate
          option.yAxis[2].max = data.rate
        }
        option.series[0].data = data.chartData
        option.series[1].data = data.volumes
        option.series[1].itemStyle = {
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
        this.chart.setOption(option)
      },
      fnHandleBrush (params) {
        if (params.batch[0].areas.length === 0) {
          this.brushedData = null
          return
        }

        let timeData = params.batch[0].areas[0]
        let timeList = this.chart.getOption().xAxis[0].data
        if (timeData.coordRange[0].toString().indexOf(':') > 0) {
          this.routerParams.beginTime = timeData.coordRange[0]
          this.routerParams.endTime = timeData.coordRange[1]
        } else {
          this.routerParams.beginTime = timeList[timeData.coordRange[0]]
          this.routerParams.endTime = timeList[timeData.coordRange[1]]
          this.routerParams.beginTime = !this.routerParams.beginTime ? '09:30' : this.routerParams.beginTime
          this.routerParams.endTime = !this.routerParams.endTime ? '15:00' : this.routerParams.endTime
        }
        this.getBrushedStaticData(this.routerParams.beginTime, this.routerParams.endTime)
      },
      getBrushedStaticData (startTime, endTime) {
        getStockSharingChartBrushed({
          codeType: this.currentType,
          trdDate: '',
          code: '',
          stockCode: this.$store.getters.getCurrentCode,
          startTime: startTime.replace(':', ''),
          endTime: endTime.replace(':', '')
        }).then(resp => {
          if (resp && resp.selected) {
            this.brushedData = resp
          } else {
            this.brushedData = null
            this.$message.warning('框选时间内没有统计信息!')
          }
        })
      },
      fnRefreshNetBuyGraph (data) {
        let saleSoldData = []
        if (data.saleSoldValue != null && data.saleSoldValue.length > 0) {
          data.saleSoldValue.forEach((el, index) => {
            if (el[1] === null) {
              saleSoldData.push(0)
            } else {
              saleSoldData.push(el[1])
            }
          })
        }
        let option = this.chart.getOption()
        if (!this.initedNetBuyGraph) {
          option.yAxis.push({
            show: false,
            splitNumber: 1,
            min: -data.saleSoldMaxValue, // 最小
            max: data.saleSoldMaxValue // 最大
          })
          option.series.push({
            name: '内外盘差',
            type: 'bar',
            stack: 'up',
            xAxisIndex: 0,
            yAxisIndex: option.yAxis.length - 1,
            data: saleSoldData,
            itemStyle: {
              normal: {
                color: function (params) {
                  if (params.data > 0) {
                    return securityColor.up
                  }
                  return securityColor.down
                }
              }
            }
          })
          this.initedNetBuyGraph = true
        } else {
          option.yAxis[option.yAxis.length - 1].min = -data.saleSoldMaxValue
          option.yAxis[option.yAxis.length - 1].max = data.saleSoldMaxValue
          option.series[2].data = saleSoldData
          option.series[2].itemStyle = {
            normal: {
              color: function (params) {
                if (params.data > 0) {
                  return securityColor.up
                }
                return securityColor.down
              }
            }
          }
        }
        this.chart.setOption(option)
      },
      getStockLineData () {
        getMarketTimeLine(this.$store.getters.getMarketOverviewTimeLineParams).then(resp => {
          let chartData = resp
          if (!chartData.secName) {
            this.chartTitle = ''
            if (this.chart) {
              this.chart.clear()
            }
            return
          }
          this.routerParams.stockCode = chartData.secCode
          this.routerParams.stockCodeName = chartData.secName
          this.chartTitle = chartData.secCode + ' ' + chartData.secName
          this.yesterdayCloseIndex = parseFloat(chartData.lastClose)

          // 画图方法
          this.fnUpdateStockGraph(chartData)

          // 内外盘差
          getStockNetbuy(this.$store.getters.getStockLineParams).then(resp => {
            this.fnRefreshNetBuyGraph(resp)
          })
        })
        getStockRiseFallInfo(JSON.stringify(this.$store.getters.getStockRiseFallParams)).then(resp => {
          if (resp) {
            this.stockRiseFall = resp
          } else {
            this.stockRiseFall = {
              nowTime: '',
              increaseNum: 0,
              equalNum: 0,
              dereaseNum: 0
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .stock-header {
    span {
      margin-right: 10px;
      float: left;
      label {
        color: #409EFF;

        &.rise {
          color: #fd0000;
        }

        &.fall {
          color: #008900;
        }
      }
    }
    .title {
      color: #ffffff;
      font-size: 14px;
      margin-top: -3px;
    }
  }

  .overview-chart-brushstac {
    background: rgba(255, 255, 255, 0.9);
    color: #000;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.45);
    position: absolute;
    left: 0;
    top: 45px;
    z-index: 100;

    p {
      margin: 0px;
      padding: 2px;
    }
  }
</style>
