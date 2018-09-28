<template>
  <div class="realTimeAnalysis">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="股票行情" name="first">
          <stock-quotation @showFlag="showFlag" :jumpCode="jumpCode"></stock-quotation>
        </el-tab-pane>
        <el-tab-pane label="监控股票" name="second">
          <monitor-stock v-if="activeName == 'second'" @changeActiveName="changeActiveName"></monitor-stock>
        </el-tab-pane>
      </el-tabs>
    </div>
    <monitor-account-detail @changeActiveName="changeActiveName"></monitor-account-detail>
  </div>

</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import MonitorStock from './realTimeMonitorAnalysisToll/monitorStock'
  import StockQuotation from './realTimeMonitorAnalysisToll/stockQuotation'
  import MonitorAccountDetail from './realTimeMonitorAnalysisToll/monitorAccountDetail'

  export default {
    name: 'real-time-monitor-analysis-toll',
    components: {
      Breadcrumb,
      MonitorStock,
      StockQuotation,
      MonitorAccountDetail
    },
    data() {
      return {
        breadcrumbItems: [{
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '特定工具'
        }, {
          router: '',
          label: '实时监控分析'
        }],
        activeName: 'first',
        timer: null,
        isShow: false,
        jumpCode: {}
      }
    },
    mounted() {

    },
    beforeDestroy() {
    },
    methods: {
      handleTabsClick(tab) {
      },
      showFlag(val) {
        this.isShow = val
      },
      changeActiveName(val) {
        this.jumpCode = val
        this.activeName = 'first'
      }
    }
  }
</script>

<style scoped lang="less">

</style>
