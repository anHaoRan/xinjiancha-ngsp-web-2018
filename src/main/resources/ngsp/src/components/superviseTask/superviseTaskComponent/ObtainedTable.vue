<template>
  <el-card class="ngspRegulatoryHistoryTable">
    <div slot="header">调取资料历史信息</div>
    <margin-table
      v-loading="loading"
      :columns="columns"
      :height="200"
      :isPageination="false"
      :data="{
        data: tableData
      }"
      @handlerChange="handleSlotComponentEvent"
    >
      <el-table-column
        slot="tableColumnsUnshift"
        type="index"
        width="60px"
        align="center"
        label="序号"
        show-overflow-tooltip>
      </el-table-column>
    </margin-table>
  </el-card>
</template>
<script>
  import MarginTable from '@/components/base/MarginTable'
  export default {
    components: {MarginTable},
    props: {
      tableData: {
        type: Array,
        default() {
          return []
        }
      },
      loading: {
        type: Boolean,
        default: false
      },
      columns: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      handleSlotComponentEvent ({type, scope, item}) {
        if (type === 'tableColumnCanClickComponent') {
          window.open(`#/surveyFormPage?operate=1&taskId=${scope.row.infoId}&instanceId=${scope.row.infoId}&isNewTab=true`)
        }
      }
    }

  }
</script>
<style lang="less" scoped>
  .ngspRegulatoryHistoryTable {
    /deep/.el-loading-mask {
      background: rgba(0,0,0,0.3) !important;
    }
  }
</style>
