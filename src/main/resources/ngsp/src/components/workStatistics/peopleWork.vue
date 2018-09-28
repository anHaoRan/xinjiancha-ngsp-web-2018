<template>
  <div class="peopleWork">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model='activeName'>
      <el-tab-pane label='工作量走势图' name='first'>
        <trend></trend>
      </el-tab-pane>
      <el-tab-pane label='人员工作量统计' name='second'>
        <top-ten></top-ten>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import Trend from './peopleWork/trend.vue'
  import TopTen from './peopleWork/topTen.vue'

  export default {
    components: {
      Breadcrumb,
      Trend,
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
            router: '/peopleWorkStatistic',
            label: '人员工作量统计'
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
