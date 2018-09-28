<template>
  <div class="capitalFlow">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-row :gutter="10">
        <el-col :span="16">
          <ten-month-capital-flow @getClickTime="getClickTime"></ten-month-capital-flow>
          <industry-analyse :inverstorType="inverstorType"></industry-analyse>
        </el-col>
        <el-col :span="8">
          <top-five></top-five>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import TenMonthCapitalFlow from './capitalFlow/tenMonthCapitalFlow'
  import IndustryAnalyse from './capitalFlow/industryAnalyse'
  import TopFive from './capitalFlow/topFive'

  export default {
    name: "capital-flow",
    components: {
      Breadcrumb,
      TenMonthCapitalFlow,
      IndustryAnalyse,
      TopFive
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          }, {
            router: '',
            label: '证券市场概览'
          }, {
            router: '',
            label: '行业资金流向分析'
          }
        ],
        inverstorType: ''
      }
    },
    mounted() {
    },
    methods: {
      getClickTime(val) {
        this.inverstorType = val
      }
    }
  }
</script>

<style lang="less">
  .capitalFlow {
    .el-card {
      margin-top: 10px;
      overflow: visible;
    }
    .el-form-item {
      margin-bottom: 0px;
    }
    .condition {
      .el-card {
        margin-top: 0px;
        .el-card__body {
          background-color: rgba(0, 0, 0, 0.25);
        }
        .el-input__inner {
          border: none;
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
</style>