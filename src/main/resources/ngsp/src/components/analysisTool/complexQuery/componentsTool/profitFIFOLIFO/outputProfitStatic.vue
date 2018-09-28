<template>
    <div class='output-profit-static'>
        <el-card style="margin-bottom: 20px;">
            <div slot="header">查询条件
                <el-button type="primary" size="small" @click="getOutputProfitStaticData">查询</el-button>
            </div>
            <el-form :inline="true" label-width="120px">
                <el-col :xl="8" :md="12" :sm="24">
                    <el-form-item label="算法选择：">
                        <el-radio-group v-model="searchForm.arithmeticType" @change="handleChangeCalType">
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
                                        :key="column.field"
                                        :label="column.label"
                                        :prop="column.field"
                                        :align="column.align"
                                        :width="column.width?column.width:'80'">
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
  import { getOutputProfitStaticData } from '../../../../../service/analysisTool/complexQuery/index'

  export default {
    name: 'output-profit-static',
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
    mixins: [],
    data () {
      return {
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              // delimiter: ',',
              // verifies: ['STOCK_CODE_SH'],
              fields: ['acct_id', 'sec_code', 'trade_date', 'trade_no', 'buy_price', 'buy_amt', 'buy_vol', 'b_stamp_tax_amt', 'b_trans_fee_amt', 'b_commision_amt', 'b_real_comm_amt', 'sell_price', 'sell_amt', 'sell_vol', 's_stamp_tax_amt', 's_trans_fee_amt', 's_commision_amt', 's_real_comm_amt', 'match_flag']
            }
          ])
        },
        fileData: [],
        fileDataOption: [],
        leadInFileColumnOption: [
          [
            {width: '120px', label: '股东账户', field: 'acct_id', align: 'left'},
            {width: '120px', label: '证券代码', field: 'sec_code', align: 'left'},
            {width: '120px', label: '交易日期', field: 'trade_date', align: 'left'},
            {width: '100px', label: '买方成交编号', field: 'trade_no', align: 'left'},
            {width: '100px', label: '买入价格', field: 'buy_price', align: 'right'},
            {width: '100px', label: '买入金额', field: 'buy_amt', align: 'right'},
            {width: '100px', label: '买入量', field: 'buy_vol', align: 'right'},
            {width: '100px', label: '买方印花税', field: 'b_stamp_tax_amt', align: 'right'},
            {width: '100px', label: '买方过户费', field: 'b_trans_fee_amt', align: 'right'},
            {width: '100px', label: '买方交易佣金估算', field: 'b_commision_amt', align: 'right'},
            {width: '100px', label: '买方交易实际佣金', field: 'b_real_comm_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交的卖出价格', field: 'sell_price', align: 'right'},
            {width: '100px', label: '对应该笔成交的卖出金额', field: 'sell_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交的卖出量', field: 'sell_vol', align: 'right'},
            {width: '100px', label: '对应该笔成交卖方印花税', field: 's_stamp_tax_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交卖方过户费', field: 's_trans_fee_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交卖方交易佣金估算', field: 's_commision_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交卖方交易实际佣金', field: 's_real_comm_amt', align: 'right'},
            {width: '100px', label: '匹配标记', field: 'match_flag', align: 'left'}
          ],
          [
            {width: '100px', label: '股东账户', field: 'acct_id', align: 'left'},
            {width: '100px', label: '证券代码', field: 'sec_code', align: 'left'},
            {width: '100px', label: '交易日期', field: 'trade_date', align: 'left'},
            {width: '100px', label: '卖方成交编号', field: 'trade_no', align: 'left'},
            {width: '100px', label: '卖入价格', field: 'sell_price', align: 'right'},
            {width: '100px', label: '卖入金额', field: 'sell_amt', align: 'right'},
            {width: '100px', label: '卖入量', field: 'sell_vol', align: 'right'},
            {width: '100px', label: '卖方印花税', field: 's_stamp_tax_amt', align: 'right'},
            {width: '100px', label: '卖方过户费', field: 's_trans_fee_amt', align: 'right'},
            {width: '100px', label: '卖方交易佣金估算', field: 's_commision_amt', align: 'right'},
            {width: '100px', label: '卖方交易实际佣金', field: 's_real_comm_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交的卖出价格', field: 'buy_price', align: 'right'},
            {width: '100px', label: '对应该笔成交的卖出金额', field: 'buy_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交的卖出量', field: 'buy_vol', align: 'right'},
            {width: '100px', label: '对应该笔成交买方印花税', field: 'b_stamp_tax_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交买方过户费', field: 'b_trans_fee_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交买方交易佣金估算', field: 'b_commision_amt', align: 'right'},
            {width: '100px', label: '对应该笔成交买方交易实际佣金', field: 'b_real_comm_amt', align: 'right'},
            {width: '100px', label: '匹配标记', field: 'match_flag', align: 'left'}
          ]
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
      handleChangeCalType (val) {
        switch (val) {
          case '1':
            this.uploadParams = {
              parseRules: JSON.stringify([
                {
                  firstToSkip: 1, // 前置忽略项
                  // delimiter: ',',
                  // verifies: ['STOCK_CODE_SH'],
                  fields: ['acct_id', 'sec_code', 'trade_date', 'trade_no', 'buy_price', 'buy_amt', 'buy_vol', 'b_stamp_tax_amt', 'b_trans_fee_amt', 'b_commision_amt', 'b_real_comm_amt', 'sell_price', 'sell_amt', 'sell_vol', 's_stamp_tax_amt', 's_trans_fee_amt', 's_commision_amt', 's_real_comm_amt', 'match_flag']
                }
              ])
            }
            break
          case '2':
            this.uploadParams = {
              parseRules: JSON.stringify([
                {
                  firstToSkip: 1, // 前置忽略项
                  // delimiter: ',',
                  // verifies: ['STOCK_CODE_SH'],
                  fields: ['acct_id', 'sec_code', 'trade_date', 'trade_no', 'sell_price', 'sell_amt', 'sell_vol', 's_stamp_tax_amt', 's_trans_fee_amt', 's_commision_amt', 's_real_comm_amt', 'buy_price', 'buy_amt', 'buy_vol', 'b_stamp_tax_amt', 'b_trans_fee_amt', 'b_commision_amt', 'b_real_comm_amt', 'match_flag']
                }
              ])
            }
            break
        }
      },
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
        switch (this.searchForm.arithmeticType) {
          case '1':
            this.gfnDownloadTemplateFile({code: 'outProfitStaticFirst'})
            break
          case '2':
            this.gfnDownloadTemplateFile({code: 'outProfitStaticLater'})
            break
        }
      },
      getData (val) {
        this.$emit('changeLoad', true)
        getOutputProfitStaticData(val).then(resp => {
          this.$emit('changeLoad', false)
          this.currentngspUid = resp.ngsp_uid
          let calculType = val.calType
          this.tableData = resp.data
          this.$emit('getTableData', resp.data, resp.totalRowCount, calculType)
        })
      },
      getOutputProfitStaticData () {
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
        this.gfnExportFileWithForm('/complexqry/profitcalculate/v1/profitStatisticTable/export', params)
      },
      showFileCon () {
        switch (this.searchForm.arithmeticType) {
          case '1':
            this.fileDataOption = this.leadInFileColumnOption[0]
            break
          case '2':
            this.fileDataOption = this.leadInFileColumnOption[1]
            break
        }
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
    .output-profit-static {
        /deep/ .query-res-title {
            /deep/ .el-card__body {
                display: none;
            }
        }
    }
</style>
