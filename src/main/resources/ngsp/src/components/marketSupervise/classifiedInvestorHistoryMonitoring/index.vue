<template>
  <div class="investorHistory">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-row :gutter="30">
      <!--<el-col :span="12">-->
      <!--<detail-holding></detail-holding>-->
      <!--</el-col>-->
      <el-col :span="24">
        <major-inverstor-holding></major-inverstor-holding>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <turn-over></turn-over>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <hold-stock-type></hold-stock-type>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import DetailHolding from './ClassifiedInvestorHistoryMonitoring/detailHolding'
  import MajorInverstorHolding from './ClassifiedInvestorHistoryMonitoring/majorInverstorHolding'
  import TurnOver from './ClassifiedInvestorHistoryMonitoring/turnOver'
  import HoldStockType from './ClassifiedInvestorHistoryMonitoring/holdStockType'

  export default {
    name: 'classified-investor-history-monitoring',
    components: {
      Breadcrumb,
      DetailHolding,
      MajorInverstorHolding,
      TurnOver,
      HoldStockType
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          }, {
            router: '/classifiedInvestorHistoryMonitoring',
            label: '历史监控'
          }
        ]
      }
    }
  }
</script>

<style lang="less">
  .investorHistory {
    .el-card {
      overflow: visible !important;
    }
    .el-tabs {
      .el-tabs__content {
        overflow: visible !important;
      }
    }
  }
</style>
