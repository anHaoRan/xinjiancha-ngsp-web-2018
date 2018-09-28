<template>
  <div style="height: 100%">
    <el-radio-group v-model="chartTyle" @change="handleChartTypeChange" size="small">
      <el-radio-button label="sharingTimeChart">分时</el-radio-button>
      <el-radio-button label="candleDateChart">日K</el-radio-button>
    </el-radio-group>
    <SharingTimeChart v-if="chartTyle == 'sharingTimeChart'" ref="sharingTimeChart" class="sharing-time-chart"></SharingTimeChart>
    <CandleDateChart v-if="chartTyle == 'candleDateChart'" ref="candleDateChart" class="candle-date-chart"></CandleDateChart>
  </div>
</template>

<script>
  import SharingTimeChart from './sharingTimeChart'
  import CandleDateChart from './candleDateChart'

  export default {
    components: {
      SharingTimeChart,
      CandleDateChart
    },
    data () {
      return {
        chartTyle: 'sharingTimeChart',
        chartTimeOut: null
      }
    },
    methods: {
      handleChartTypeChange (val) {
        this.getChartData()
      },
      getChartData () {
        clearTimeout(this.chartTimeOut)
        if (this.chartTyle === 'sharingTimeChart') {
          this.$refs.sharingTimeChart.getSharingTimeData()
          this.chartTimeOut = setTimeout(this.getChartData, 60000)
        } else if (this.chartTyle === 'candleDateChart') {
          this.$refs.candleDateChart.getCandleDateData()
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
  .sharing-time-chart {
    height: calc(~"100% - 30px");
  }

  /deep/ .stock-line-chart {
    width: 100%;
    /*height: 302px;*/
    height: calc(~"100% - 33px");
  }

  .candle-date-chart {
    height: calc(~"100% - 30px") !important;
  }

  /deep/ .stock-k-chart {
    width: 100%;
    /*height: 350px;*/
    height: 100%;
  }
</style>
