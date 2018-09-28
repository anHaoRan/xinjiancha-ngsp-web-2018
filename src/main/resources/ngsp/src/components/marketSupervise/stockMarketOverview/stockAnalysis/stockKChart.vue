<template>
  <div>
    <div class="overview-chart-brushstac" v-if="brushedData">
      <p>起止时刻：{{brushedData.chartData[0][0]}}</p>
      <hr size=1 style="margin: 3px 0">
      <p>最高：{{brushedData.chartData[0][1]}}</p>
      <p>最低：{{brushedData.chartData[0][2]}}</p>
      <p :class="brushedData.chartData[0][3] > 0 ? 'up' : 'down'">涨跌值：{{brushedData.chartData[0][3]}}</p>
      <p :class="brushedData.chartData[0][4] > 0 ? 'up' : 'down'">涨跌幅：{{brushedData.chartData[0][4]}} %</p>
      <p>振幅：{{brushedData.chartData[0][5]}} %</p>
      <p v-if="currentType === 'stock'">总成交量：{{this.gfnFormatDecThou(brushedData.chartData[0][6]/10000, 2)}} 万股</p>
      <p v-else>总成交量：{{this.gfnFormatDecThou(brushedData.chartData[0][6]/100000000, 2)}} 亿股</p>
      <p>总成交额：{{this.gfnFormatDecThou(brushedData.chartData[0][7]/100000000, 2)}} 亿元</p>
    </div>
    <div id="stockKChart" class="stock-k-chart"></div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { getMarketDayLine, getDayLineBrushed } from '@/service/marketSupervise'
  import { drawStockCandleChart } from '@/utils/charts/stockCandleChart'

  export default {
    data () {
      return {
        chart: null,
        brushedData: null
      }
    },
    computed: {
      currentType () {
        return this.$store.state.marketOverview.currentType
      }
    },
    methods: {
      getStockDayData () {
        let params = this.$store.getters.getMarketOverviewDayLineParams
        params.candleStyle = 'D'
        getMarketDayLine(params).then(resp => {
          this.chart = drawStockCandleChart(resp.chartData, 'stockKChart', resp.secCode ? (resp.secCode + ' ' + resp.secName) : '', this.currentType)
          this.chart.on('brushSelected', this.fnHandleBrush)
        })
      },
      fnHandleBrush (params) {
        if (params.batch[0].areas.length === 0) {
          this.brushedData = null
          return
        }

        let timeData = params.batch[0].areas[0]
        let st, et
        let timeList = this.chart.getOption().xAxis[0].data
        if (timeData.coordRange[0].toString().indexOf(':') > 0) {
          st = timeData.coordRange[0]
          et = timeData.coordRange[1]
        } else {
          st = timeList[timeData.coordRange[0]]
          et = timeList[timeData.coordRange[1]]
          st = !st ? '' : moment(st).format('YYYYMMDD')
          et = !et ? '' : moment(et).format('YYYYMMDD')
        }
        this.getBrushedStaticData(st, et)
      },
      getBrushedStaticData (startDate, endDate) {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getMarketOverviewDayLineParams))
        params.startDate = startDate
        params.endDate = endDate
        getDayLineBrushed(params).then(resp => {
          this.brushedData = resp
        })
      }
    }
  }
</script>

<style scoped lang="less">
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
      margin: 0;
      padding: 2px;
    }
  }
</style>
