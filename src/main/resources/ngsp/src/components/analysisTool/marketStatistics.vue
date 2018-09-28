<!--市场统计查询 参与者成交查询-->
<template>
  <div class="market-statistics">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model="activeName">
      <el-tab-pane label="参与者成交查询" name="detailQuery">
        <detail-query></detail-query>
      </el-tab-pane>
      <el-tab-pane label="参与者市值查询" name="particMarketValQuery">
        <partic-market-val-query></partic-market-val-query>
      </el-tab-pane>
      <el-tab-pane label="持股集中度统计" name="holdDegreeStatistics">
        <hold-degree-statistics></hold-degree-statistics>
      </el-tab-pane>
      <el-tab-pane label="持债集中度统计" name="holdBondStatistics">
        <hold-bond-statistics></hold-bond-statistics>
      </el-tab-pane>
      <el-tab-pane label="优先股集中度统计" name="preferredStockQuery">
        <precedence-stock-query></precedence-stock-query>
      </el-tab-pane>
      <el-tab-pane label="参与者申报查询" name="reportQuery">
        <report-query></report-query>
      </el-tab-pane>
      <el-tab-pane label="融资回购余额排序统计" name="financingBalanceRanking">
        <financing-balance-ranking></financing-balance-ranking>
      </el-tab-pane>
      <el-tab-pane label="质押式回购风险指标" name="pledgeRepurchase">
        <pledge-repurchase></pledge-repurchase>
      </el-tab-pane>
      <el-tab-pane label="证券指数影响统计" name="stockIndexImpact">
        <stock-index-impact-statistics></stock-index-impact-statistics>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import breadcrumb from '../../components/common/Breadcrumb'
  import DetailQuery from './marketStatistics/detailQuery'
  import ParticMarketValQuery from './marketStatistics/particMarketValQuery'
  import HoldDegreeStatistics from './marketStatistics/holdDegreeStatistics'
  import HoldBondStatistics from './marketStatistics/holdBondStatistics'
  import PrecedenceStockQuery from './marketStatistics/precedenceStockQuery'
  import ReportQuery from './marketStatistics/reportQuery'
  import FinancingBalanceRanking from './marketStatistics/financingBalanceRanking'
  import PledgeRepurchase from './marketStatistics/pledgeRepurchase'

  export default {
    components: {
      breadcrumb,
      // 参与者成交
      DetailQuery,
      // 参与者市值
      ParticMarketValQuery,
      // 持股集中度
      HoldDegreeStatistics,
      // 持债集中度
      HoldBondStatistics,
      // 优先股集中度
      PrecedenceStockQuery,
      // 参与者申报
      ReportQuery,
      // 融资回购余额统计
      FinancingBalanceRanking,
      // 质押式回购风险指标
      PledgeRepurchase,
      stockIndexImpactStatistics: () => import('./marketStatistics/stockIndexImpactStatistics')
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/marketStatistics',
            label: '分析工具'
          }, {
            router: '/marketStatistics',
            label: '常规查询'
          }, {
            router: '/marketStatistics',
            label: '市场统计查询'
          }
        ],
        activeName: 'pledgeRepurchase'
      }
    },
    methods: {},
    mounted: function () {
    }
  }
</script>
<style lang="less">
  .market-statistics {
    .el-tabs--card > .el-tabs__header .el-tabs__nav-wrap {
      padding-bottom: 0 !important;
    }
  }

</style>
