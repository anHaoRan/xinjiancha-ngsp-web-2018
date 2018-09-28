<template>
  <div class="stockIndexFutures">
    <!--面包屑组件-->
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>

    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="股指期货每日数据查询" name="first">
        <stock-index-daily></stock-index-daily>
      </el-tab-pane>
      <el-tab-pane label="沪深300成分股每日数据查询" name="second">
        <constituent-stock-query></constituent-stock-query>
      </el-tab-pane>
      <el-tab-pane label="股指期货走势查询" name="third">
        <stock-trend-inquiry :setChartWidth="setChartWidthTrend"></stock-trend-inquiry>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  // 面包屑组件引入
  import breadcrumb from '../common/Breadcrumb'
  import StockIndexDaily from './stockIndexFutures/stockIndexDaily'

  export default {
    // 组件注册
    components: {
      breadcrumb, // 面包屑组件
      StockIndexDaily,
      stockTrendInquiry: () => import('./stockIndexFutures/stockTrendInquiry'),
      constituentStockQuery: () => import('./stockIndexFutures/constituentStockQuery')
    },
    data () {
      return {
        // 面包屑路由
        breadcrumbItems: [
          {
            router: '',
            label: '分析工具'
          },
          {
            router: '',
            label: '常规查询'
          },
          {
            router: '',
            label: '股指期货查询'
          }
        ],
        // tab栏默认项
        activeName: 'first',
        setChartWidthTrend: ''
      }
    },
    methods: {
      handleTabsClick (tab, event) {
        if (tab.name === 'third') {
          this.setChartWidthTrend = Math.random()
        }
      }
    },
    mounted () {}

  }
</script>
<style lang="less">
  .stockIndexFutures {

  }
</style>
