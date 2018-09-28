<template>
  <el-card class="el-card-table">
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="分时" name="stockLineChart">
        <stock-line-chart ref="stockLine"></stock-line-chart>
      </el-tab-pane>
      <el-tab-pane label="日K" name="stockKChart">
        <stock-k-chart ref="stockDay"></stock-k-chart>
      </el-tab-pane>
      <el-tab-pane label="周K" name="stockWeekKChart">
        <stock-week-k-chart ref="stockWeek"></stock-week-k-chart>
      </el-tab-pane>
      <el-tab-pane label="月K" name="stockMonthKChart">
        <stock-month-k-chart ref="stockMonth"></stock-month-k-chart>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
  import * as types from '../../../store/mutation-types'
  import StockLineChart from './stockAnalysis/stockLineChart'
  import StockKChart from './stockAnalysis/stockKChart'
  import StockWeekKChart from './stockAnalysis/stockWeekKChart'
  import StockMonthKChart from './stockAnalysis/stockMonthKChart'

  export default {
    components: {
      StockLineChart,
      StockKChart,
      StockWeekKChart,
      StockMonthKChart
    },
    data () {
      return {
        activeName: 'stockLineChart',
        chartTimeOut: null
      }
    },
    computed: {
      currentIndexCode () {
        return this.$store.getters.getCurrentIndexCode
      },
      currentBoardCode () {
        return this.$store.getters.getCurrentBoardCode
      },
      currentStockCode () {
        return this.$store.getters.getCurrentStockCode
      }
    },
    watch: {
      currentIndexCode: function () {
        this.fnClearChart()
        this.getChartData()
      },
      currentBoardCode: function () {
        this.fnClearChart()
        this.getChartData()
      },
      currentStockCode: function () {
        this.fnClearChart()
        this.getChartData()
      }
    },
    methods: {
      handleTabsClick (tab, event) {
        this.$store.commit(types.O_CHANGE_CHART_NAME, tab.name)
        this.getChartData()
      },
      fnClearChart () {
        this.$refs.stockLine.fnClearChart()
      },
      getChartData () {
        clearTimeout(this.chartTimeOut)
        if (this.activeName === 'stockLineChart') {
          this.$refs.stockLine.getStockLineData()
          this.chartTimeOut = setTimeout(this.getChartData, 30000)
        } else if (this.activeName === 'stockKChart') {
          this.$refs.stockDay.getStockDayData()
        } else if (this.activeName === 'stockWeekKChart') {
          this.$refs.stockWeek.getStockWeekData()
        } else {
          this.$refs.stockMonth.getStockMonthData()
        }
      }
    },
    mounted () {
      this.getChartData()
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.chartTimeOut != null) {
        clearTimeout(this.chartTimeOut)
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .stock-line-chart {
    width: 100%;
    height: 324px;
  }

  /deep/ .stock-k-chart,
  /deep/ .stock-w-chart,
  /deep/ .stock-m-chart {
    width: 100%;
    height: 372px;
  }
</style>
