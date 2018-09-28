<template>
  <div class="sdiBox">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card class="el-card-table">
        <el-tabs v-model="activeName">
        <el-tab-pane label="公司重大事项核查定期驱动" name="cmmCheckRegularDrive">
            <cmmCheck-regularDrive></cmmCheck-regularDrive>
        </el-tab-pane>
        <el-tab-pane label="趋同交易预警信息" name="convergenceTrades">
          <convergence-trades></convergence-trades>
        </el-tab-pane>
        </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import cmmCheckRegularDrive from './companyMajorMatterCheckRegularDrive'
  import ConvergenceTrades from './convergenceTrades'

  export default {
    components: {
      Breadcrumb,
      cmmCheckRegularDrive,
      ConvergenceTrades
    },
    data() {
      return {
        breadcrumbItems: [{
          router: '/alarmMonitor',
          label: '预警监控'
        }, {
          router: '/clueRadar',
          label: '线索雷达'
        }],
        activeName: 'cmmCheckRegularDrive',


      }
    },
    methods: {

    },
    mounted() {

    },
    created() {
    }
  }
</script>

<style scoped lang="less">
.sdiBox{
  .el-card{
    min-height: 800px;
  }

 }
</style>
