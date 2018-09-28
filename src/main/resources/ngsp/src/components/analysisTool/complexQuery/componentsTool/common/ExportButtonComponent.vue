<!-- 导出按钮 -->
<template>
  <div>
    <el-dropdown @command="handleExportData" style="float: right; margin-bottom: 10px;">
      <el-button type="primary" size="small">
        导出 <i class="el-icon-arrow-down el-icon-right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="excel" v-if="exportXls"><i class="el-icon-document"></i>导出为EXCEL</el-dropdown-item>
        <el-dropdown-item command="csv"  v-if="exportCsv"><i class="el-icon-tickets"></i>导出CSV</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>

  export default {
    props: {
      otherParams: {
        type: Object,
        default () {
          return {}
        }
      },
      exportXls: {
        type: Boolean,
        default: true
      },
      exportCsv: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      handleExportData (type) {
        this.$emit('handleExportData', type, this.otherParams)
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
