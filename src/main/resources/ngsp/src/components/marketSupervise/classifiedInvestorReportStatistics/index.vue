<template>
  <div class="classifiedInvestorReportStatistics">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model="activeName">
      <el-tab-pane label="各类投资者申报统计" name="various">
        <various></various>
      </el-tab-pane>
      <el-tab-pane label="一般机构投资者申报统计" name="general">
        <general></general>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import Various from './investors/Various'
  import General from './investors/General'

  export default {
    components: {
      Various,
      General,
      Breadcrumb
    },
    name: 'classified-investor-report-statistics',
    data () {
      return {
        activeName: 'various',
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          }, {
            router: '/classifiedInvestorReportStatistics',
            label: '分类投资者申报统计'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
