<!--时间片分析-->
<template>
  <div>
    <el-button type="info" size="small" @click="mergeAccounts">账户组合并统计</el-button>

    <el-dialog title='账户组合并统计' :close-on-click-modal='false'
               :visible.sync='showDialog' width='80%'>
      <el-col :span="5" style="margin-bottom: 10px;">
        <account-code
          :codeType="`account`"
          :uploadParams="{
              parseRule: JSON.stringify(
                  {verifies: ['ACCOUNT_CODE']}
                )
              }"
          @getTextareaCodeList="getAccountsList"></account-code>
      </el-col>
      <common-table-pagination-component
        :showPagination="false"
        :tableData='tableData'
        :columns='columns[params.index]'></common-table-pagination-component>
    </el-dialog>
  </div>
</template>
<script>


  export default {
    components: {
      AccountCode: () => import('../../common/TextAreaCodesAndUploadComponent'),
      commonTablePaginationComponent: () => import('../../common/commonTablePaginationComponent')
    },
    props: {
      params: {
        type: Object,
        default() {
          return {index: 0}
        }
      }

    },

    data () {
      return {
        showDialog: false,
        storeImportIds: '',
        columns: [
          [],
          [
            {id: 'ag1', minWidth: '100px', label: '账户名称', field: 'nameBefore', align: 'left'},
            {id: 'ag2', minWidth: '100px', label: '买委托量', field: 'nameBefore', align: 'left'},
            {id: 'ag3', minWidth: '100px', label: '平均买委托价', field: 'nameBefore', align: 'left'},
            {id: 'ag4', minWidth: '100px', label: '买成交量', field: 'nameBefore', align: 'left'},
            {id: 'ag5', minWidth: '100px', label: '平均买成交价', field: 'nameBefore', align: 'left'},
            {id: 'ag6', minWidth: '100px', label: '买撤单量', field: 'nameBefore', align: 'left'},
            {id: 'ag7', minWidth: '100px', label: '买委托占比', field: 'nameBefore', align: 'left'},
            {id: 'ag8', minWidth: '100px', label: '买成交占比', field: 'nameBefore', align: 'left'},
            {id: 'ag9', minWidth: '100px', label: '净买入量', field: 'nameBefore', align: 'left'}
          ],
          [
            {id: 'ag11', minWidth: '100px', label: '账户名称', field: 'nameBefore', align: 'left'},
            {id: 'ag22', minWidth: '100px', label: '卖委托量', field: 'nameBefore', align: 'left'},
            {id: 'ag33', minWidth: '100px', label: '平均卖委托价', field: 'nameBefore', align: 'left'},
            {id: 'ag44', minWidth: '100px', label: '卖成交量', field: 'nameBefore', align: 'left'},
            {id: 'ag55', minWidth: '100px', label: '平均卖成交价', field: 'nameBefore', align: 'left'},
            {id: 'ag66', minWidth: '100px', label: '卖撤单量', field: 'nameBefore', align: 'left'},
            {id: 'ag77', minWidth: '100px', label: '卖委托占比', field: 'nameBefore', align: 'left'},
            {id: 'ag88', minWidth: '100px', label: '卖成交占比', field: 'nameBefore', align: 'left'},
            {id: 'ag99', minWidth: '100px', label: '净卖入量', field: 'nameBefore', align: 'left'}
          ]
        ],
        tableData: []
      }
    },
    methods: {
      mergeAccounts() {
        this.showDialog = true
      },
      getAccountsList(data) {
        this.storeImportIds = data.split(',')
      },
    },
    mounted () {
    }
  }

</script>
<style lang="less" scoped>
  .timeSliceAnalysis {
    width: 100%;
    min-width: 500px;
  }
</style>
