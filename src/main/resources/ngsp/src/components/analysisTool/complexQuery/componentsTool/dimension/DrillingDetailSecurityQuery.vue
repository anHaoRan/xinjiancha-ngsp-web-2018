<!--
账户证券持仓，账户证券交易按钮弹框页面
-->
<template>
  <div>
    <div class="clearfix" style="margin-bottom: 15px;">
      <el-col :span="3" style="line-height: 30px;">查询条件</el-col>
      <el-col :span="21" style="text-align: right;">
        <el-button size="small" type="info" @click="handleClear">清空</el-button>
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
      </el-col>
    </div>
    <el-row>
      <el-form label-width='100px' ref='drillingDetailSecurityForm' :inline="true" :rules='rules' :model='formData'>
        <el-col :xl='8' :lg='8' :md='8' :sm='24'>
          <el-col :xl='24' :lg='24' :md='24' :sm='24'>
            <el-form-item label='开始日期：' prop='startDate'>
              <el-date-picker
                v-model='formData.startDate'
                type='date'
                format='yyyy-MM-dd'
                value-format='yyyy-MM-dd'
                placeholder='请选择开始日期'
                size='small'>
              </el-date-picker>
            </el-form-item>
            <el-form-item label='结束日期：' prop='endDate'>
              <el-date-picker
                v-model='formData.endDate'
                type='date'
                format='yyyy-MM-dd'
                value-format='yyyy-MM-dd'
                placeholder='请选择结束日期'
                size='small'>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :xl='8' :lg='8' :md='8' :sm='24'>
          <el-form-item label='证券代码：' prop='secCodes'>
            <stock-code-query-and-upload-component
              :ref="`validateDimensionStock`"
              :initList="initStockList"
              :uploadParams="{
                parseRule: JSON.stringify(
                  {verifies: ['STOCK_CODE_SH']}
                )
              }"
              @getStockCode="getStockCode"></stock-code-query-and-upload-component>
          </el-form-item>
        </el-col>
        <el-col :xl='8' :lg='8' :md='8' :sm='24'>
          <el-form-item label='账户代码：' prop='acctIds'>
            <account-code
              :ref="`validateDimensionAccount`"
              :codeType="`account`"
              :initList="initAccountList"
              :uploadParams="{
                parseRule: JSON.stringify({verifies: ['ACCOUNT_CODE']})
                }"
              @getTextareaCodeList="getAccountListFunc"></account-code>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class='clearfix' style='height: 480px; width:100%'>
      <export-btn @handleExportData="handleDownload" :exportCsv="false"></export-btn>
      <el-col>
        <common-table-pagination-component
          :loading='loading'
          :tableData='tableData'
          :columns='columns'
          :pagination='pagination'
          :totalNum='totalNum'
          :showPagination="false"
        ></common-table-pagination-component>
      </el-col>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { selfValidateMethod } from '../common/validate'
  import { getAcctSecTradeQuery, getDimenAcctSecHoldQuery } from '@/service/analysisTool/complexQuery/index'

  export default {
    components: {
      AccountCode: () => import('../common/TextAreaCodesAndUploadComponent'),
      commonTablePaginationComponent: () => import('../common/commonTablePaginationComponent'),
      StockCodeQueryAndUploadComponent: () => import('../common/StockCodeQueryAndUploadComponent'),
      ExportBtn: () => import('../common/ExportButtonComponent')
    },
    data () {
      return {
        initAccountList: [], // 初始化账户证券持仓、交易弹框中的账户代码
        initStockList: [], // 初始化账户证券持仓、交易弹框中的证券代码
        currentngspUid: '', // 用来记录上一次返回的ngspUid
        loading: false,
        totalNum: 0,
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        queryData: {},
        formData: {
          startDate: '',
          endDate: '',
          secCodes: '', // 证券代码
          acctIds: '', // 账户代码
          // isExport: 0, // 标识符，当isExport=1时表示导出文件
          // pageIndex: 1,
          // pageLimit: 100,
          // isNewQuery: 1, // 当isNewQuery = 1时表示新查询，当isNewQuery =0 时表示分页或是导出
          // ngspUid: '', // isNewQuery  =1时，表示新查询，前端不用传值，如果isNewQuery =0时，前段需要向后台上传上一次呢ngspUid的值。
          // exportType: '' // 当exportType =csv 时，表示导出文件的格式为.csv  当exportType =excel时，表示导出文件的格式为.excel
        },
        columns: [],
        columnsList: [
          [ // 账户证券交易查询 trading
            {id: 10, label: '日期', field: 'trade_date', align: 'left'},
            {id: 20, label: '证券代码', field: 'sec_code', align: 'left'},
            {id: 30, label: '证券简称', field: 'sec_name', align: 'left'},
            {id: 40, label: '股东账户', field: 'acct_id', align: 'left'},
            {id: 50, label: '股东名称', field: 'acct_name', align: 'left'},
            {id: 60, label: '交易营业部', field: 'branch_name', align: 'right'},
            {id: 70, label: '买入均价', field: 'buy_price', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 80, label: '买入数量', field: 'buy_vol', align: 'right', format: '0'},
            {id: 90, label: '买入金额', field: 'buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 100, label: '卖出均价', field: 'sell_price', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 110, label: '卖出数量', field: 'sell_vol', align: 'right', format: '0'},
            {id: 120, label: '卖出金额', field: 'sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'}
          ],
          [ // 定义列  holding
            {id: 10, label: '交易日期', field: 'trade_date', align: 'left'},
            {id: 20, label: '证券代码', field: 'sec_code', align: 'left'},
            {id: 30, label: '证券简称', field: 'sec_name', align: 'left'},
            {id: 40, label: '会员名称', field: 'mem_name', align: 'left'},
            {id: 50, label: '会员营业部名称', field: 'branch_name', align: 'left'},
            {id: 60, label: '股东账户', field: 'acct_id', align: 'left'},
            {id: 70, label: '股东名称', field: 'acct_name', align: 'left'},
            {id: 80, label: '非限售股数量', field: 'nego_hold_bal', align: 'right', format: '0'},
            {id: 90, label: '限售股数量', field: ' nonnego_hold_bal', align: 'right', format: '0'},
            {id: 100, label: '总持股数量', field: ' hold_bal', align: 'right', format: '0'},
            {id: 110, label: '非限售股市值', field: 'nego_mkt_val', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000'},
            {id: 120, label: '限售股市值', field: 'nonnego_mkt_val', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000'}
          ]
        ],
        tableData: [],
        rules: {
          startDate: [
            {required: true, message: '请选择开始日期'}
          ],
          endDate: [
            {required: true, message: '请选择结束日期'}
          ],
          secCodes: [
            {required: true, message: '请输入证券代码'}
          ],
          acctIds: [
            {required: true, message: '请输入账户代码'}
          ]
        }
      }
    },
    props: {
      secParams: {}
    },
    watch: {
      secParams: {
        handler () {
          this.secParams.securityType === 'trading' ? this.columns = this.columnsList[0] : this.columns = this.columnsList[1]
          this.evaluate()
        },
        deep: true
      }
    },
    methods: {
      evaluate () { // 为查询条件复制    这里的查询条件初始化用主界面的值,维度查询主页面只能查询一个证券代码
        if (this.secParams.acctId) {
          this.formData.acctIds = this.secParams.acctId
          this.initAccountList = this.secParams.acctId.split(',')
        } else {
          this.initAccountList = []
          this.formData.acctIds = ''
        }
        this.formData.startDate = this.secParams.startDate
        this.formData.endDate = this.secParams.endDate
        this.formData.secCodes = this.secParams.secCode // 主页面只能选择一个证券代码，弹出框中可输入多个
        this.initStockList = [this.secParams.secCode]
      },
      getAccountListFunc (data) {
        this.formData.acctIds = data
      },
      getStockCode (data) {
        this.formData.secCodes = data
      },
      reqTableData (type) {
        let params = {
          startDate: type ? this.formData.startDate : this.queryData.startDate,
          endDate: type ? this.formData.endDate : this.queryData.endDate,
          secCodes: type ? this.formData.secCodes : this.queryData.secCodes, // 证券代码集合
          acctIds: type ? this.formData.acctIds : this.queryData.acctIds,
          ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
          // pageIndex: 1,
          // pageRows: 100,
          isExport: 0, // 1代表导出报表
          exportType: '', // excel,csv
          isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
        }
        params.startDate = moment(params.startDate).format('YYYY-MM-DD')
        params.endDate = moment(params.endDate).format('YYYY-MM-DD')

        let reqData = Object.assign({}, this.secParams, params)
        delete reqData.ASH
        delete reqData.chartsType
        delete reqData.markTableRender
        console.log(JSON.stringify(reqData))
        this.loading = true
        if (this.secParams.securityType === 'trading') {
          getAcctSecTradeQuery(reqData).then((resp) => {
            this.loading = false
            if (resp && resp.data) {
              this.tableData = resp.data
              this.currentngspUid = resp.ngsp_uid
              // this.totalRowCount = Number(resp.totalRowCount)
            }
          })
        } else {
          getDimenAcctSecHoldQuery(reqData).then((resp) => {
            this.loading = false
            if (resp && resp.data) {
              this.tableData = resp.data
              this.currentngspUid = resp.ngsp_uid
              // this.totalRowCount = Number(resp.totalRowCount)
            }
          })
        }
      },
      handleSearch () {
        let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
        let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
        if (sDate > eDate + 60 * 60 * 1000) {
          this.$message.error('开始日期不得大于结束日期')
          return
        }
        this.$refs['drillingDetailSecurityForm'].validate((valid) => {
          if (valid) {
            if (!selfValidateMethod({
                accounts: this.formData.acctIds,
                stocks: this.formData.secCodes
              })) { /* 批量校验证券代码格式 */
              return
            }
            this.queryData = JSON.parse(JSON.stringify(this.formData.acctIds))
            this.reqTableData(1)
          }
        })
      },
      handleDownload (type) {
        if (!this.currentngspUid) {
          this.$message.error('暂无数据可以导出')
          return
        }
        let params = {
          exportType: type,
          isExport: 1,
          isNewQuery: 0,
          ngspUid: this.currentngspUid,
          tableColumns: this.columns
        }
        if (this.secParams.securityType === 'trading') {
          this.gfnExportFileWithForm('/complexqry/dimension/v1/acctSecTradeQuery/export', params)
        } else {
          this.gfnExportFileWithForm('/complexqry/dimension/v1/acctSecHoldQuery/export', params)
        }
      },
      handleClear () {
        this.$refs[`validateDimensionStock`].clearStockCodes()
        this.$refs[`validateDimensionAccount`].clearCodeList()
        this.formData = {
          startDate: '',
          endDate: '',
          secCodes: '', // 证券代码
          acctIds: '' // 账户代码
        }
      }
    },
    mounted () {
      this.evaluate()
      // 初始化查询
      this.handleSearch()
      this.secParams.securityType === 'trading' ? this.columns = this.columnsList[0] : this.columns = this.columnsList[1]
    }
  }
</script>

<style lang='less' scoped>
  .children-drilling-no-padding-top {
    padding-top: 10px;
    /deep/ .el-row {
      padding-top: 0;
    }
  }
</style>
