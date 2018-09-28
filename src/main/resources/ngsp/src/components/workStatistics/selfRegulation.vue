<template>
  <div class="selfRegulation">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model='activeName'>
      <el-tab-pane label='自律监管走势图' name='first'>
        <trend></trend>
      </el-tab-pane>
      <el-tab-pane label='排名前十统计' name='second'>
        <top-ten></top-ten>
      </el-tab-pane>
      <el-tab-pane label='监管函件统计' name='third'>
        <letters></letters>
      </el-tab-pane>
      <!--<el-tab-pane label='会员失信排名前十' name='fourth'>-->
        <!--<member-top-ten></member-top-ten>-->
      <!--</el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import Trend from './selfRegulation/trend.vue'
  import TopTen from './selfRegulation/topTen.vue'
  import Letters from './selfRegulation/letters.vue'
  import MemberTopTen from './selfRegulation/memberTopTen.vue'

  export default {
    components: {
      Breadcrumb,
      Trend,
      TopTen,
      Letters,
      MemberTopTen
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/WorkStatistics',
            label: '工作统计'
          },
          {
            router: '/selfRegulationStatistic',
            label: '自律监管统计'
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
