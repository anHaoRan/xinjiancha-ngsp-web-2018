<template>
    <div class='transaction-detail-and-cost'>
        <el-card style="margin-bottom: 20px;">
            <div slot="header">查询条件
                <el-button type="primary" size="small" @click="getTransactionDetailData">查询</el-button>
            </div>
            <el-form :inline="true" label-width="120px">
                <!--<el-col :xl="8" :md="12" :sm="24">-->
                <!--<el-form-item label="算法选择：">-->
                <!--<el-radio-group v-model="searchForm.arithmeticType">-->
                <!--<el-radio :label="'0'">先进先出</el-radio>-->
                <!--<el-radio :label="'1'">后进先出</el-radio>-->
                <!--</el-radio-group>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
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
                                        :align="column.align">
                                </el-table-column>
                            </el-table>
                        </el-dialog>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :md="12" :sm="24">
                    <el-form-item label="佣金费率：" required>
                        <el-input size="small" placeholder="" style="width: 80px" v-model="searchForm.realCommRate"/>
                        （注：输入值范围为0~1，不包含0、1)
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
  import { getTradDetailCostData } from '../../../../../service/analysisTool/complexQuery/index'

  export default {
    name: 'transaction-detail-and-cost',
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
            fields: ['acctId', 'secCode', 'startDate', 'endDate', 'commRate']
          }]
          )
        },
        fileData: [],
        fileDataOption: [
          {filed: 'acctId', label: '股东账户', align: 'left'},
          {filed: 'secCode', label: '证券代码', align: 'left'},
          {filed: 'startDate', label: '开始日期', align: 'left'},
          {filed: 'endDate', label: '结束日期', align: 'left'},
          {filed: 'commRate', label: '佣金比例', align: 'right'}
        ],
        isSuccess: false,
        searchForm: {
          uploadFileCon: [],
          realCommRate: '',
          arithmeticType: '0'
        },
        currentngspUid: '',
        isNewQuery: '1',
        isExport: '0',
        requestParams: {},
        loading: false,
        dialogTableVisible: false,
        tableData:[]
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
        this.gfnDownloadTemplateFile({code: 'tradDetailCost'})
      },
      getData (val) {
        this.$emit('changeLoad', true)
        getTradDetailCostData(val).then(resp => {
          this.$emit('changeLoad', false)
          this.currentngspUid = resp.ngsp_uid
          this.tableData = resp.data
          this.$emit('getTableData', resp.data, resp.totalRowCount)
        })
      },
      getTransactionDetailData () {
        this.requestParams = {
          realCommRate: this.searchForm.realCommRate,
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
        if (!this.searchForm.realCommRate) {
          this.$message.warning('请输入佣金费率')
          return
        } else if (this.searchForm.realCommRate - 0 <= 0 || this.searchForm.realCommRate -  0 >= 1) {
          this.$message.warning('佣金费率格式不正确')
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
        this.gfnExportFileWithForm('/complexqry/profitcalculate/v1/transactDetailFee/export', params)
        // setTimeout(() => {saveAsLocalFile(params)}, 25000)

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
    .transaction-detail-and-cost {
        /deep/ .query-res-title {
            /deep/ .el-card__body {
                display: none;
            }
        }
    }
</style>
