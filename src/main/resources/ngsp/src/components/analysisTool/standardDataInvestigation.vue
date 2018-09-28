<template>
  <div class="sdiBox">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card class="el-card-table">
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="基础数据协查" name="basicData">
          <basic-data-investigation></basic-data-investigation>
        </el-tab-pane>
        <el-tab-pane label="不同类型案件协查" name="differentTypes">
          <different-types-investigation></different-types-investigation>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import basicDataInvestigation from './standardDataInvestigation/basicDataInvestigation'
  import differentTypesInvestigation from './standardDataInvestigation/differentTypesInvestigation'

  export default {
    components: {
      Breadcrumb,
      basicDataInvestigation,
      differentTypesInvestigation
    },
    data() {
      return {
        breadcrumbItems: [{
          router: '/analysisTool',
          label: '分析工具'
        }, {
          router: '/standardDataInvestigation',
          label: '标准化数据协查'
        }],
        activeName: 'basicData'
      }
    },
    methods: {
      handleTabsClick(tab, event) {
      }
    },
    mounted() {
    },
    created() {
    }
  }
</script>

<style lang="less">
  .noRuleMsg {
    .el-form-item__error {
      display: none;
    }
  }
</style>
