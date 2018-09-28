<template>
  <div class="fixed-income-query">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="产品查询" name="productQuery">
          <product-query></product-query>
        </el-tab-pane>
        <el-tab-pane label="账户查询" name="accountQuery">
          <account-query></account-query>
        </el-tab-pane>
        <el-tab-pane label="市场查询" name="marketStatistics">
          <market-statistics></market-statistics>
        </el-tab-pane>
        <el-tab-pane label="成交明细查询" name="detailQuery">
          <detail-query></detail-query>
        </el-tab-pane>
        <el-tab-pane label="债券质押式回购" name="bondRepurchase">
          <bond-repurchase></bond-repurchase>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import breadcrumb from '../common/Breadcrumb'
  import AccountQuery from './fixedIncomeQuery/accountQuery'
  import BondRepurchase from './fixedIncomeQuery/bondRepurchase'
  import ProductQuery from './fixedIncomeQuery/productQuery'
  import DetailQuery from './fixedIncomeQuery/detailQuery'
  import MarketStatistics from './fixedIncomeQuery/marketStatistics'

  export default {
    name: 'fixed-income-query',
    components: {
      breadcrumb, AccountQuery, BondRepurchase, ProductQuery, DetailQuery, MarketStatistics
    },
    data() {
      return {
        // 面包屑
        breadcrumbItems: [
          {
            router: '/fixedIncomeQuery',
            label: '分析工具'
          }, {
            router: '/fixedIncomeQuery',
            label: '常规查询'
          }, {
            router: '/fixedIncomeQuery',
            label: '固定收益平台查询'
          }
        ],
        activeName: 'detailQuery'

      }
    },
    mounted() {

    },
    methods: {
      handleTabsClick() {

      }
    }
  }
</script>

<style lang='less'>
  .fixed-income-query {
  }
</style>
