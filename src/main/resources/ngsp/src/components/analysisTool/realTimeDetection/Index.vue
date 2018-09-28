<!--实时监测分析工具 -->
<template>
  <div class="realTimeDetection">
    <!--tep-->
    <el-tabs v-model="activeName" @tab-click="test">
      <el-tab-pane label="成交统计" name="TransactionStatistics" class="real-el-tab">
        <transaction-statistics v-if="activeName=='TransactionStatistics'"></transaction-statistics>
      </el-tab-pane>
      <el-tab-pane label="申报统计" name="ReportStatistics" class="real-el-tab">
        <report-statistics v-if="activeName=='ReportStatistics'"></report-statistics>
      </el-tab-pane>
      <el-tab-pane label="持有统计" name="HoldStatistics" class="real-el-tab">
        <hold-statistics v-if="activeName=='HoldStatistics'"></hold-statistics>
      </el-tab-pane>
      <el-tab-pane label="成交详情" name="TransactionDetails" class="real-el-tab">
        <transaction-details v-if="activeName=='TransactionDetails'"></transaction-details>
      </el-tab-pane>
      <el-tab-pane label="申报详情" name="ReportDetails" class="real-el-tab">
        <report-details v-if="activeName=='ReportDetails'"></report-details>
      </el-tab-pane>
      <el-tab-pane label="订单簿详情" name="OrderBookDetails" class="real-el-tab">
        <order-book-details v-if="activeName=='OrderBookDetails'"></order-book-details>
      </el-tab-pane>
      <el-tab-pane label="当日多股同列" name="MultipleStocks" class="real-el-tab">
        <multiple-stocks v-if="activeName=='MultipleStocks'"></multiple-stocks>
      </el-tab-pane>
      <el-tab-pane label="持股集中度" name="holdingStocks" class="real-el-tab">
        <holding-stocks v-if="activeName=='holdingStocks'"></holding-stocks>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  // 成交统计
  import TransactionStatistics from './tabPane/TransactionStatistics'
  // 成交详情
  import TransactionDetails from './tabPane/TransactionDetails'

  // 申报统计
  import ReportStatistics from './tabPane/ReportStatistics'
  // 申报详情
  import ReportDetails from './tabPane/ReportDetails'

  // 持有统计
  import HoldStatistics from './tabPane/HoldStatistics'
  // 订单簿详情
  import OrderBookDetails from './tabPane/OrderBookDetails'
  // 多股同列
  import MultipleStocks from './tabPane/MultipleStocks'

  import HoldingStocks from './tabPane/holdingStocks'

  export default {
    // 组件注册
    components: {
      TransactionStatistics,
      TransactionDetails,
      ReportStatistics,
      ReportDetails,
      HoldStatistics,
      OrderBookDetails,
      MultipleStocks,
      HoldingStocks
    },
    data() {
      return {
        // v-model
        activeName: 'TransactionStatistics'
      }
    },
    methods: {
      test() {
      }
    },
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted() {
      if (this.$route.params.activeName)
        this.activeName = this.$route.params.activeName
    }

  }
</script>
<style lang="less">
  .realTimeDetection {
    margin: -20px;
    .el-tabs {
      .el-tabs__content {
        overflow: visible !important;
      }
    }
    .el-form {
      .el-col {
        height: 63px;
      }
    }
  }
</style>
