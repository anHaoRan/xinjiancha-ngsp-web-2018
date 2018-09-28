<template>
  <div class="abnormalBehavior">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model='activeName'>
      <el-tab-pane label='异常行为走势图' name='first'>
        <trend></trend>
      </el-tab-pane>
      <el-tab-pane label='异常行为分类柱图' name='second'>
        <classify-chart></classify-chart>
      </el-tab-pane>
      <el-tab-pane label='排名前十统计' name='third'>
        <top-ten></top-ten>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import Trend from './abnormalBehavior/trend.vue'
  import ClassifyChart from './abnormalBehavior/classifyChart.vue'
  import TopTen from './abnormalBehavior/topTen.vue'

  export default {
    components: {
      Breadcrumb,
      Trend,
      ClassifyChart,
      TopTen
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/WorkStatistics',
            label: '工作统计'
          },
          {
            router: '/abnormalBehaviorStatistic',
            label: '异常行为统计'
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
