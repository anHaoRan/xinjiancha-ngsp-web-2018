<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="沪股通申报统计" name="reportStatic">
        <report-static></report-static>
      </el-tab-pane>
      <el-tab-pane label="沪股通成交统计" name="detailStatic">
        <detail-static></detail-static>
      </el-tab-pane>
      <el-tab-pane label="沪股通标的证券申报和交易统计" name="SecuritiesFilingTransactionStatistics">
        <keep-alive>
          <securities-filing-transaction-statistics v-if="activeName==='SecuritiesFilingTransactionStatistics'"/>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="境外投资者持股比例试算" name="foreignInvestorsHoldTrial">
        <foreign-investors-hold-trial></foreign-investors-hold-trial>
      </el-tab-pane>
      <el-tab-pane label="额度查询" name="limitQuery">
        <limit-query></limit-query>
      </el-tab-pane>
      <el-tab-pane label="境外投资者持股比例盘前处理" name="foreignInvestorsPrediskTreatment">
        <foreign-investors-predisk-treatment></foreign-investors-predisk-treatment>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import breadcrumb from '../common/Breadcrumb'
  import DetailStatic from './stockConnectSH/detailStatic'
  import ReportStatic from './stockConnectSH/reportStatic'
  import LimitQuery from './stockConnectSH/limitQuery'
  import ForeignInvestorsHoldTrial from './stockConnectSH/foreignInvestorsHoldTrial'
  import foreignInvestorsPrediskTreatment from './stockConnectSH/foreignInvestorsPrediskTreatment'

  export default {
    name: 's-h-stock-connect',
    components: {
      DetailStatic,
      ReportStatic,
      breadcrumb,
      ForeignInvestorsHoldTrial,
      foreignInvestorsPrediskTreatment,
      LimitQuery,
      SecuritiesFilingTransactionStatistics: () => import('./stockConnectSH/SecuritiesFilingTransactionStatistics/Index')
    },
    data () {
      return {
        // 面包屑路由
        breadcrumbItems: [
          {
            router: '',
            label: '分析工具'
          }, {
            router: '',
            label: '常规查询'
          }, {
            router: '',
            label: '沪港通查询'
          }
        ],
        activeName: 'foreignInvestorsHoldTrial'

      }
    },
    methods: {
      handleTabsClick () {

      }
    },
    mounted () {

    }
  }
</script>

<style scoped>

</style>
