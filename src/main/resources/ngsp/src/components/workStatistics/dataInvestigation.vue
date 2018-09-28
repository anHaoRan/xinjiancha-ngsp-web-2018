<template>
  <div class="dataInvestigation">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model='activeName'>
      <el-tab-pane label='数据协查走势图' name='first'>
        <trend></trend>
      </el-tab-pane>
      <el-tab-pane label='数据协查分类柱图' name='second'>
        <classify-chart></classify-chart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import Trend from './dataInvestigation/trend.vue'
  import ClassifyChart from './dataInvestigation/classifyChart.vue'

  export default {
    components: {
      Breadcrumb,
      Trend,
      ClassifyChart
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/WorkStatistics',
            label: '工作统计'
          },
          {
            router: '/dataInvestigationStatistic',
            label: '数据协查统计'
          }
        ],
        activeName: 'first'
      }
    },
    mounted () {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
</style>
