<template>
  <div class="market-day-chart">
    <div class="chart-content">
      <div class="overview-chart-brushstac" v-if="brushedData">
        <p>起止时刻：{{brushedData.chartData[0][0]}}</p>
        <hr size=1 style="margin: 3px 0">
        <p>最高：{{brushedData.chartData[0][1]}}</p>
        <p>最低：{{brushedData.chartData[0][2]}}</p>
        <p :class="brushedData.chartData[0][3] > 0 ? 'up' : 'down'">涨跌值：{{brushedData.chartData[0][3]}}</p>
        <p :class="brushedData.chartData[0][4] > 0 ? 'up' : 'down'">涨跌幅：{{brushedData.chartData[0][4]}} %</p>
        <p>振幅：{{brushedData.chartData[0][5]}} %</p>
        <p>总成交量：{{this.gfnFormatDecThou(brushedData.chartData[0][6]/100000000, 2)}} 亿股</p>
        <p>总成交额：{{this.gfnFormatDecThou(brushedData.chartData[0][7]/100000000, 2)}} 亿元</p>
      </div>
      <div id="classifyInvestorDayK" class="stock-chart"></div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import * as types from '@/store/mutation-types'
  import { getMarketDayLine, getDayLineBrushed } from '@/service/marketSupervise'
  import { drawStockCandleChart } from '@/utils/charts/stockCandleChart'
  import { getTradeRangeDate } from '@/service/common/commonFunc'

  moment.locale('zh-cn')

  export default {
    data () {
      return {
        chart: null,
        brushedData: null
      }
    },
    methods: {
      changeCandleChartBrush () {
        let startDate = this.$store.state.investorMonitoring.startDate
        let endDate = this.$store.state.investorMonitoring.endDate
        let range = null
        if (startDate.toString() !== '' && endDate.toString() !== '') {
          let sd = moment(startDate).format('YYYYMMDD')
          let ed = moment(endDate).format('YYYYMMDD')
          getTradeRangeDate(sd, ed).then(resp => {
            range = [moment(resp[0]).format('YYYY-MM-DD'), moment(resp[1]).format('YYYY-MM-DD')]
            let areas = [
              {
                brushType: 'lineX',
                coordRange: range,
                xAxisIndex: 0
              }
            ]
            if (this.chart != null) {
              this.chart.dispatchAction({
                type: 'brush',
                areas: areas
              })
              this.getBrushedStaticData(resp[0], resp[1])
            }
          })
        } else {
          if (this.chart != null) {
            this.chart.dispatchAction({
              type: 'brush',
              areas: []
            })
          }
        }
      },
      // 获取分类投资者监测日K图数据
      getMonitorKData () {
        let _this = this
        let params = JSON.parse(JSON.stringify(this.$store.getters.getIndustryDayLineParams))
        getMarketDayLine(params).then(resp => {
          if (_this.chart != null) {
            _this.chart.dispose()
            _this.chart = null
          }
          _this.chart = drawStockCandleChart(resp.chartData, 'classifyInvestorDayK')
          _this.chart.on('click', function (val) {
            _this.$store.commit(types.C_CHANGE_TRADE_DATE, val.name)
          })
          _this.chart.on('dblclick', function (val) {
            _this.$emit('tabsName')
            _this.$store.commit(types.C_CHANGE_TRADE_DATE, val.name)
            _this.$store.commit(types.C_CHART_NAME, 'MonitorTime')
          })

          _this.chart.on('brushSelected', function (val) {
            if (!val.batch[0].areas.length) {
              // 未框选的情况
              _this.brushedData = null
              _this.$store.commit(types.C_IS_BRUSH, false)
              _this.$store.commit(types.C_CHANGE_DATE_RANGE, ['', ''])
              return
            }
            let dateList = _this.chart.getOption().xAxis[0].data
            let rangeIdxs = val.batch[0].areas[0].coordRange
            _this.$store.commit(types.C_IS_BRUSH, true)
            if (rangeIdxs[0].toString().indexOf('-') > 0) {
              // 日期控件值变化时触发的框选，“brushSelected”监听到后，不做处理。
              return
            }
            let startIdx = rangeIdxs[0] < 0 ? 0 : rangeIdxs[0]
            let endIdx = rangeIdxs[1] >= dateList.length ? dateList.length - 1 : rangeIdxs[1]
            _this.$store.commit(types.C_CHANGE_DATE_RANGE, [new Date(dateList[startIdx]), new Date(dateList[endIdx])])
            _this.getBrushedStaticData(moment(dateList[startIdx]).format('YYYYMMDD'), moment(dateList[endIdx]).format('YYYYMMDD'))
          })
        })
      },

      getBrushedStaticData (startDate, endDate) {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getMarketDayLineParams))
        params.startDate = startDate
        params.endDate = endDate
        getDayLineBrushed(params).then(resp => {
          this.brushedData = resp
        })
      },

      indexDayCompose (chartData) {
        let option = null
        if (this.chartOption !== null) {
          option = JSON.parse(JSON.stringify(this.chartOption))
        } else {
          this.chartOption = JSON.parse(JSON.stringify(this.chart.getOption()))
          option = JSON.parse(JSON.stringify(this.chart.getOption()))
        }
        chartData.forEach((el) => {
          let data = this.splitData(el)
          option.yAxis.push({
            show: false,
            splitNumber: 1,
            min: -data.max, // 最小
            max: data.max // 最大
          })
          option.series.push({
              name: data.name,
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: option.yAxis.length - 1,
              data: data.seriesData
            }
          )
        })
        this.chart.setOption(option, true)
      },

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
      }
    }
  }
</script>

<style scoped lang="less">
  /*上证指数图*/
  .market-day-chart {
    margin-top: -18px;

    .chart-title {
      padding-bottom: 10px;
      margin-top: 10px;
    }
    .stock-chart {
      width: 100%;
      height: 360px;
    }
    .op-button {
      width: 100%;
    }
    .chart-content {
      margin-top: 20px;
      .overview-chart-brushstac {
        background: rgba(255, 255, 255, 0.9);
        color: #000;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.45);
        position: absolute;
        left: 80px;
        top: 120px;
        z-index: 100;

        p {
          margin: 0;
          padding: 2px;
        }
      }
    }
  }
</style>
