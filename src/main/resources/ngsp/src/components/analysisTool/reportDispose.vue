<template>
  <div class='reportDispose'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <div>
      <el-tabs v-model='activeName'>
        <el-tab-pane label='报告管理' name='first'>
          <report-manage></report-manage>
        </el-tab-pane>
        <el-tab-pane label='邮件配置' name='third'>
          <mail-dispose></mail-dispose>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import ReportManage from './reportDispose/reportManage'
  import MailDispose from './reportDispose/mailDispose'
  import ReportModule from './reportDispose/reportModule'
  export default {
    components: {
      Breadcrumb,
      ReportManage,
      MailDispose,
      ReportModule
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '分析工具'
          },
          {
            router: '',
            label: '报告生成工具'
          },
          {
            router: '',
            label: '报告配置'
          }
        ],
        activeName: 'first'
      }
    }
  }
</script>

<style lang='less'>
  .reportDispose{
    .el-tabs__content{
      overflow: visible;
    }
  }

</style>
