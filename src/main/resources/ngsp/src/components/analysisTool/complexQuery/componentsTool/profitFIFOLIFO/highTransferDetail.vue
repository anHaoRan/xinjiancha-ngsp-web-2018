<template>
    <div class='high-transfer-detail'>
      <el-card style="margin-bottom: 20px;">
        <div slot="header">查询条件
          <el-button type="primary" size="small" @click="getOutRecordData">查询</el-button>
        </div>
        <el-form :inline="true" label-width="120px">
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="导入EXCEL：" required>
              <file-upload
                @getTxtCon="getTxtCon"
                :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
                :uploadParams="uploadParams"
                :limitFileType="['xls', 'xlsx']"
                :isShowSuccessMessage="true"
                style="display: inline-block"
              ></file-upload>
              <el-button type="info" size="small" style="display: inline-block" v-if="isSuccess" @click="showFileCon">查看
              </el-button>
              <el-button type="info" size="small" style="display: inline-block" @click="downTemplateFile">下载模板</el-button>
              <el-dialog title="上传文件内容" :visible.sync="dialogTableVisible">
                <el-table
                  :data="fileData"
                  border
                  tooltip-effect="dark"
                  size="small"
                  height="550"
                  highlight-current-row>
                  <el-table-column
                    v-for="column in fileDataOption"
                    :key="column.field"
                    :label="column.label"
                    :prop="column.field"
                    :align="column.align">
                  </el-table-column>
                </el-table>
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-form>
      </el-card>
      <el-card class="query-res-title">
        <div slot="header">
          查询结果
          <export-btn @handleExportData="handleDownload" style="float: right;"></export-btn>
        </div>
      </el-card>
    </div>
</template>

<script>
  import { gethighTransferDetailData } from '../../../../../service/analysisTool/complexQuery/index'
  export default {
    name: 'high-transfer-detail',
    props: {
      pagination: {
        type: Object,
        default () {
          return {
            currentPage: 1,
            pageSizeNumber: 10
          }
        }
      },
      tableColumn: {
        type: Array,
        default: []
      }
    },
    components: {
      FileUpload: () => import('@/components/common/UploadFileToServer'),
      ExportBtn: () => import('../../componentsTool/common/ExportButtonComponent')
    },
    mixin: [],
    data () {
      return {
        uploadParams: {
          parseRules: JSON.stringify(
            [{
              firstToSkip: 1, // 前置忽略项
              // delimiter: ',',
              // verifies: ['STOCK_CODE_SH'],
              fields: ['secCode', 'startDate', 'endDate']
            }]
          )
        },
        fileData: [],
        fileDataOption: [
          {id: '1', minWidth: '100px', label: '证券代码', field: 'secCode', align: 'left'},
          {id: '2', minWidth: '100px', label: '开始日期', field: 'startDate', align: 'left'},
          {id: '3', minWidth: '100px', label: '结束日期', field: 'endDate', align: 'left'},
        ],
        isSuccess: false,
        searchForm: {
          uploadFileCon: []
        },
        currentngspUid: '',
        isNewQuery: '1',
        isExport: '0',
        requestParams: {},
        dialogTableVisible: false,
        tableData:[]
      }
    },
    computed: {

    },
    watch: {},
    methods: {
      getTxtCon (value, success) {
        if (success) {
          this.searchForm.uploadFileCon = value['Sheet0']
          this.fileData = value['Sheet0']
        } else {
          this.searchForm.uploadFileCon = []
        }
        this.isSuccess = success
      },
      downTemplateFile () {
        this.gfnDownloadTemplateFile({code: 'highTransferDetail'})
      },
      getData (val) {
        this.$emit('changeLoad', true)
        gethighTransferDetailData(val).then(resp => {
          this.$emit('changeLoad', false)
          this.currentngspUid = resp.ngsp_uid
          this.tableData = resp.data
          this.$emit('getTableData', resp.data, resp.totalRowCount)
        })
      },
      getOutRecordData () {
        this.requestParams = {
          isNewQuery: '1',
          isExport: '0',
          pageIndex: this.pagination.currentPage.toString(),
          pageRows: this.pagination.pageSizeNumber.toString(),
          sheet0: this.searchForm.uploadFileCon
        }
        if (!this.searchForm.uploadFileCon.length) {
          this.$message.warning('请上传附件')
          return
        }
        this.getData(this.requestParams)
      },
      getPaginationData (pagination) {
        let params = this.requestParams
        params.isNewQuery = '0'
        params.isExport = '0'
        params.pageIndex = pagination.currentPage.toString()
        params.pageRows = pagination.pageSizeNumber.toString()
        params['ngspUid'] = this.currentngspUid
        delete params.sheet0
        this.getData(params)
      },
      handleDownload (type) {
        if (this.tableData.length === 0) {
          this.$message.warning('查询结果为空，暂不能导出')
          return
        }
        let params = this.requestParams
        params.isNewQuery = '0'
        params.isExport = '1'
        params['exportType'] = type
        params['ngspUid'] = this.currentngspUid
        params['tableColumns'] = this.tableColumn
        delete params.sheet0
        delete params.pageIndex
        delete params.pageRows
        // console.log(params)
        this.gfnExportFileWithForm('/complexqry/profitcalculate/v1/highTransferDetail/export', params)
      },
      showFileCon () {
        this.dialogTableVisible = true
      }
    },
    created () {

    },
    mounted () {

    },
    beforeDestory () {

    }
  }
</script>

<style lang='less' scoped>
    .high-transfer-detail {
      /deep/ .query-res-title {
        /deep/ .el-card__body {
          display: none;
        }
      }
    }
</style>
