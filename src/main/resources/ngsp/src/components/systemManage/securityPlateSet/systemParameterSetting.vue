<!--系统参数设置 systemParameterSetting-->
<template>
  <div class="systemParameterSetting">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card class="el-card-table">
      <el-tabs v-model="activeName" @tab-click="systemParameterClick">
        <el-tab-pane label="预警监控" :disabled="true" name="earlyWarningMonitor"></el-tab-pane>
        <el-tab-pane label="预警管理" :disabled="true" name="alertManagement"></el-tab-pane>
        <el-tab-pane label="市场运行监测" name="marketOprationMonitotng"></el-tab-pane>
        <el-tab-pane label="舆情监测" :disabled="true" name="pulicOpinionMonitoring"></el-tab-pane>
        <el-tab-pane label="分析工具" :disabled="true" name="analysisTools"></el-tab-pane>
        <el-tab-pane label="监察任务" name="supervisoryTask"></el-tab-pane>
        <el-tab-pane label="监管知识库" :disabled="true" name="regulatoryKnowledgeBase"></el-tab-pane>
        <el-tab-pane label="知识库统计" :disabled="true" name="knowledgeBaseStatistce"></el-tab-pane>
      </el-tabs>
    </el-card>
    <market-opration-monitotng v-if="activeName==='marketOprationMonitotng'"></market-opration-monitotng>
    <supervise-task v-if="activeName === 'supervisoryTask'"></supervise-task>
  </div>
</template>
<script>
  import breadcrumb from '../../../components/common/Breadcrumb'
  import MarketOprationMonitotng from '../../../components/systemManage/securityPlateSet/systemParameter/marketOprationMonitotng'                  // 市场运行监测
  import SuperviseTask from './systemParameter/superviseTask'
  export default {
    name: 'systemParameterSetting',
    components: {
      breadcrumb, // 面包屑组件
      MarketOprationMonitotng,
      SuperviseTask
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/systemParameterSetting',
            label: '系统管理'
          }, {
            router: '/systemParameterSetting',
            label: '设置'
          }, {
            router: '/systemParameterSetting',
            label: '系统参数设置'
          }
        ],
        activeName: 'marketOprationMonitotng'
      }
    },
    methods: {
      // 菜单
      systemParameterClick (data) {

      }
    },
    created () {

    },
    mounted () {

    }
  }
</script>
<style lang="less">
  .systemParameterSetting {

  }

</style>
