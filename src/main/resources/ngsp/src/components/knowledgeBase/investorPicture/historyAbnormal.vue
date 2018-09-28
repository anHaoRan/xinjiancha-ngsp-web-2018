<template>
  <div>
    <el-card class="el-card-table">
      <div slot="header">
        历史异常账户
      </div>
      <s-table :columns="handReportColumns" :data="handReportData" :isHeader="false" :height="200"
               @getPageination="handSelectedRow">
      </s-table>
    </el-card>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'

  export default {
    components: {
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        handReportColumns: [
          {label: '调查单编号', field: 'reportName', align: 'center', minWidth: '6%'},
          {label: '监管措施(大类)', field: 'reportStatus', align: 'center', minWidth: '6%'},
          {label: '监管措施(小类)', field: 'beginTime', align: 'center', minWidth: '6%'},
          {label: '开始日期', field: 'endTime', align: 'center', minWidth: '6%'},
          {label: '结束日期', field: 'txtName', align: 'center', minWidth: '6%'}
        ],
        handReportData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        }
      }
    },
    props: ['accountId'],
    watch: {
      accountId: function (param1, param2) {
      }
    },
    methods: {
      handSelectedRow(row) {
      }
    }
  }
</script>

<style scoped>

</style>
