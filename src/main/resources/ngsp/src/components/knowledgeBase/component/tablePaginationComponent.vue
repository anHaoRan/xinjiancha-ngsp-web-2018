<template>
  <el-card>
    <div slot="header">
      <span>{{headerMap[currentTableIndex] || '查询结果'}}</span>
      <el-button @click="handleExport" size="small" type="primary" v-if="showExportBtn">导出</el-button>
    </div>
    <margin-table
      :loading = "loading"
      :columns="columns"
      :data="{
        data: tableData,
        pageIndex: pagination.pageIndex,
        pageRows: pagination.pageRows,
        total: pagination.total
      }"
      @getPageination="getPageination"
      @handlerChange="handleSlotComponentEvent"
    ></margin-table>
  </el-card>
</template>
<script>
  import MarginTable from '@/components/base/MarginTable'
  export default {
    components: {
      MarginTable
    },
    props: {
      currentTableIndex: {
        type: [Number, String],
        default: 0
      },
      pagination: {
        type: Object,
        default() {
          return {

          }
        }
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      },
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      loading: {
        type: Boolean,
        default: false
      },
      showExportBtn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        headerMap: ['预警历史信息', '异常行为历史信息', '自律监管历史信息', '线索报告历史信息']
      }
    },
    methods: {
      handleExport() {
        this.$emit('handleExport')
      },
      getPageination(val) {
        this.$emit('updatePagination', val, this.currentTableIndex)
      },
      handleSlotComponentEvent ({type, scope, item}) {
        if (item.field === 'alarm_id') { // 预警编号
          window.open(`#/tdateAlarmDetail/${scope.row[item.field]}?isNewTab=true`)
        } else if (item.field === 'title') { // 标题
          window.open(`#/selfSupervisionFormPage?taskId=''&instanceId=${scope.row.infoId}&operate=1&isNewTab=true`)
        } else if (item.field === 'clueName') { // 线索名称
          window.open(`#/clueReportForm?operate=1&instanceId=${scope.row.infoId}&isNewTab=true`)
        } else if (item.field === 'fileName') { // 函件编号
          window.location.href = this.gfnGetDownloadFileUrl(scope.row.fileId, scope.row.fileName)
        }
      },
    }
  }
</script>