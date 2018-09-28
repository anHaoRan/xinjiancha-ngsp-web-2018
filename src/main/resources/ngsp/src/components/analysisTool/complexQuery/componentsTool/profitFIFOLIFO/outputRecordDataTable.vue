<template>
    <div class='output-record-data-table'>
        <el-card style="margin-bottom: 20px;">
            <div slot="header">查询条件
                <el-button type="primary" size="small" @click="getOutRecordData">查询</el-button>
            </div>
            <el-form :inline="true" label-width="120px">
                <el-col :xl="8" :md="12" :sm="24">
                    <el-form-item label="算法选择：">
                        <el-radio-group v-model="searchForm.arithmeticType">
                            <el-radio :label="'1'">先进先出</el-radio>
                            <el-radio :label="'2'">后进先出</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
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
                        <el-button type="info" size="small" style="display: inline-block" v-if="isSuccess"
                                   @click="showFileCon">查看
                        </el-button>
                        <el-button type="info" size="small" style="display: inline-block" @click="downTemplateFile">
                            下载模板
                        </el-button>
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
                                        :key="column.filed"
                                        :label="column.label"
                                        :prop="column.filed"
                                        :align="column.align"
                                        :width="column.width?column.width:'80'"
                                        show-overflow-tooltip>
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
  import { getOutputRecordData } from '../../../../../service/analysisTool/complexQuery/index'

  export default {
    name: 'output-record-data-table',
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
            fields: ['acct_id', 'sec_code', 'trade_date', 'trade_time', 'trade_no', 'trade_price', 'trade_amt', 'trade_vol', 'pbu_id', 'order_no', 'order_time', 'trade_dir', 'stamp_tax', 'transfer_fee', 'comm_amt_1', 'comm_amt_2']
          }]
          )
        },
        fileData: [],
        fileDataOption: [
          {filed: 'acct_id', label: '股东账户', align: 'left',width:'120'},
          {filed: 'sec_code', label: '证券代码', align: 'left'},
          {filed: 'trade_date', label: '交易日期', align: 'left'},
          {filed: 'trade_time', label: '成交时间', align: 'left' },
          {filed: 'trade_no', label: '成交编号', align: 'left'},
          {filed: 'trade_price', label: '成交价格（单位:元）', align: 'right'},
          {filed: 'trade_amt', label: '成交金额（单位:元）', align: 'right'},
          {filed: 'trade_vol', label: '成交量', align: 'left'},
          {filed: 'pbu_id', label: '席位', align: 'left'},
          {filed: 'order_no', label: '申报编码', align: 'left'},
          {filed: 'order_time', label: '申报时间', align: 'left'},
          {filed: 'trade_dir', label: '成交方向', align: 'left'},
          {filed: 'stamp_tax', label: '印花税（单位:元）', align: 'right'},
          {filed: 'transfer_fee', label: '过户费（单位:元）', align: 'right'},
          {filed: 'comm_amt_1', label: '交易佣金估算（单位:元）', align: 'right'},
          {filed: 'comm_amt_2', label: '实际交易佣金', align: 'right'}
        ],
        isSuccess: false,
        searchForm: {
          uploadFileCon: [],
          realCommRate: '',
          arithmeticType: '1'
        },
        currentngspUid: '',
        isNewQuery: '1',
        isExport: '0',
        requestParams: {},
        dialogTableVisible: false,
        tableData: []
      }
    },
    computed: {},
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
        this.gfnDownloadTemplateFile({code: 'outputRecordDataTable'})
      },
      getData (val) {
        this.$emit('changeLoad', true)
        getOutputRecordData(val).then(resp => {
          this.$emit('changeLoad', false)
          this.currentngspUid = resp.ngsp_uid
          let calculType = val.calType
          this.tableData = resp.data
          this.$emit('getTableData', resp.data, resp.totalRowCount, calculType)
        })
      },
      getOutRecordData () {
        this.requestParams = {
          calType: this.searchForm.arithmeticType,
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
        if (!this.searchForm.arithmeticType) {
          this.$message.warning('请选择算法')
          return
        }
        this.getData(this.requestParams)
      },
      getPaginationData (pagination) {
        let params = this.requestParams
        params.isNewQuery = '0'
        params.isExport = '0'
        params['ngspUid'] = this.currentngspUid
        delete params.sheet0
        params.pageIndex = pagination.currentPage.toString()
        params.pageRows = pagination.pageSizeNumber.toString()
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
        params['tableColumns'] = this.tableColumn
        params['ngspUid'] = this.currentngspUid
        delete params.sheet0
        delete params.pageIndex
        delete params.pageRows
        console.log(JSON.stringify(params))
        this.gfnExportFileWithForm('/complexqry/profitcalculate/v1/transactRecordTable/export', params)
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
    .output-record-data-table {
        /deep/ .query-res-title {
            /deep/ .el-card__body {
                display: none;
            }
        }
    }
</style>
