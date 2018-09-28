<template>
  <div class="precedence-stock-query">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model="activeName">
      <el-tab-pane label="产品查询" name="productQuery">
        <product-query></product-query>
      </el-tab-pane>
      <el-tab-pane label="账户查询" name="accountQuery">
        <account-query></account-query>
      </el-tab-pane>
      <el-tab-pane label="市场统计" name="marketStaticQuery">
        <market-static-query></market-static-query>
      </el-tab-pane>
      <el-tab-pane label="明细查询" name="detailQuery">
        <detail-query></detail-query>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

  export default {
    // 优先股查询
    name: 'precedence-stock-query',
    props: [],
    components: {
      breadcrumb: () => import('../../components/common/Breadcrumb'),
      ProductQuery: () => import('./precedenceStockQuery/productQuery'),
      AccountQuery: () => import('./precedenceStockQuery/accountQuery'),
      MarketStaticQuery: () => import('./precedenceStockQuery/marketStaticQuery'),
      DetailQuery: () => import('./precedenceStockQuery/detailQuery')
    },
    mixin: [],
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/precedenceStockQuery',
            label: '分析工具'
          }, {
            router: '/precedenceStockQuery',
            label: '常规查询'
          }, {
            router: '/precedenceStockQuery',
            label: '优先股查询'
          }
        ],
        activeName: 'productQuery'
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created () {

    },
    mounted () {

    },
    beforeDestory () {

    }
  }
</script>

<style lang="less" scoped>
  .precedence-stock-query {

  }
</style>
