<template>
  <div class="warningStatistics">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model='activeName'>
      <el-tab-pane label='预警走势图' name='first'>
        <warning-line-chart></warning-line-chart>
      </el-tab-pane>
      <el-tab-pane label='预警分类柱图' name='second'>
        <warning-bar-chart></warning-bar-chart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import StockCodeQuery from '../common/StockCodeQuery';
  import DownMoreSelect from '../common/downMoreSelect'
  import warningLineChart from './warningStatistics/warningLineChart'
  import warningBarChart from './warningStatistics/warningBarChart'

  export default {
    components: {
      Breadcrumb,
      StockCodeQuery,
      DownMoreSelect,
      warningLineChart,
      warningBarChart
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '工作统计'
          },
          {
            router: '',
            label: '预警统计'
          }
        ],
        activeName:'first'
      }
    },
    mounted() {
    },
    methods:{
    }
  }
</script>

<style lang="less">
  .warningStatistics{
    .formCard{
      overflow:visible;
      .el-card__body{
        padding: 10px;
      }
    }
    .el-form-item{
      margin-bottom: 0px;
    }
  }
</style>
