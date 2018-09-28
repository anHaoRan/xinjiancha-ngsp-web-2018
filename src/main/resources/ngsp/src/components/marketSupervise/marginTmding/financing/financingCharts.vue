<template>
  <div class='financingCharts'>
    <el-card>
      <el-tabs v-model='activeName' type='card' @tab-click='handleClick'>
        <el-tab-pane label='日内' name='first'>
          <intra-day @getTimeData='getTimeData' @getDate='getDate' @getStockCode='getStockCode'></intra-day>
        </el-tab-pane>
        <el-tab-pane label='跨日' name='second'>
          <cross-day></cross-day>
        </el-tab-pane>
        <el-tab-pane label='实时统计监测' name='third'>
          <time-account></time-account>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  // import {getMarginTrading} from '../../../../service/marketSupervise'
  import TimeAccount from './financingCharts/timeAccount'
  import CrossDay from './financingCharts/crossDay'
  import IntraDay from './financingCharts/intraDay'

  export default {
    name: 'financingCharts',
    components: {
      CrossDay,
      IntraDay,
      TimeAccount
    },
    data() {
      return {
        activeName: 'first',
        farData: {}
      }
    },
    mounted() {
    },
    methods: {
      handleClick(tab, event) {

      },
      handleCurrentChange(val) {
      },
      getTimeData(startTime, overTime) {
        this.$emit('getTimeData', startTime, overTime)
      },
      getDate(date) {
        this.$emit('getDate', date)
      },
      getStockCode(code) {
        this.$emit('getStockCode', code)
      }
    }
  }
</script>

<style lang='less'>
  .financingCharts {
    .el-tabs {
      position: relative;
      .el-tabs__header {
        position: absolute;
        top: 5px;
        left: 8%;
      }
    }
  }
  .financingCharts > .el-card {
    > .el-card__body {
      padding: 0 0 20px 0;
    }
  }
  .financingCharts .el-tabs--card > .el-tabs__header .el-tabs__nav-wrap {
    padding: 0 !important;
  }
  .financingCharts .el-tabs--card > .el-tabs__header {
    margin-left: 20px;
  }
</style>
