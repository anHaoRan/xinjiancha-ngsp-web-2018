<template>
  <el-dialog class="fileListDialog"
             :title="`附件列表`"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :visible.sync="showDialog" width="60%" left>
    <s-table
      :data="{
      pageIndex: pagination.currentPage,
      pageRows: pagination.pageSizeNumber,
      total: totalNum,
      data: tableData
    }"
      :columns="columns"
      @handlerChange="handleSlotComponentEvent"
    >
      <el-button slot='elCardHeader' type='primary' size='small' @click='handleDownloadFile'>下载附件</el-button>
    </s-table>
  </el-dialog>
</template>
<script>
  import STable from '@/components/base/STable'
  import TableColumnRadioComponent from '../../common/TableColumnRadioComponent'
  import {
    downloadAppendFile, // 下载附件
    acctgrpFileList // 下载附件列表
  } from '@/service/systemManage/securityPlateSet'

  export default {
    components: {
      STable,
      TableColumnRadioComponent
    },
    props: {
      accountGroupId: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        showDialog: false,
        currentSelectedItem: {},
        columns: [{
          label: '',
          field: 'append_id',
          width: '45px',
          align: 'center',
          template: TableColumnRadioComponent
        }, {label: '账户组编码', field: 'account_group_id', minWidth: '80px', align: 'center'}, {
          label: '附件编号',
          field: 'append_id',
          minWidth: '80px',
          align: 'center'
        }, {label: '附件名称', field: 'append_name', minWidth: '80px', align: 'center'}],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        totalNum: 0,
        tableData: []
      }
    },
    methods: {
      // 账户组--搜索账户组下的账户
      handleSlotComponentEvent ({type, scope, item}) {
        this.handleCheckedChange(scope.row)
      },
      handleCheckedChange (val) {
        this.currentSelectedItem = {
          appendName: val.append_name,
          appendId: val.append_id,
          accountGroupId: val.account_group_id
        }
      },
      getFileList () {
        let params = {
          acctgrpId: this.accountGroupId,
          pageIndex: this.pagination.currentPage,
          pageSize: this.pagination.pageSizeNumber
        }
        acctgrpFileList(params).then(resp => {
          if (resp) {
            const {data, total} = resp
            this.tableData = data
            this.totalNum = total
          }
        })
      },
      handleDownloadFile () {
        if (!this.currentSelectedItem.appendId) {
          this.$message.error('请选择附件')
          return
        }
        downloadAppendFile(this.currentSelectedItem)
      }
    }
  }
</script>
