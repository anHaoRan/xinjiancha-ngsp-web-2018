<!-- 账户证券持仓情况 -->
<template>
  <div class='account-security-holding'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size='small' type='info'  @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-form label-width='100px' ref='accountSecurityHoldingForm'
               :model='formData' :rules='rules' :inline="true"
               class='clearfix account-security-holding-form'>
        <el-col :xl='7' :lg='7' :md='7' :sm='24'>
          <el-form-item label='开始日期：' prop='startDate'>
            <el-date-picker
              v-model='formData.startDate'
              type='date'
              placeholder='请选择开始日期'
              size='small'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label='结束日期：' prop='endDate'>
            <el-date-picker
              v-model='formData.endDate'
              type='date'
              placeholder='请选择结束日期'
              size='small'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label=' '>
            <el-checkbox v-model='formData.isOneYard' label='按照一码通维度计算'></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :xl='7' :lg='7' :md='7' :sm='24'>
          <el-form-item label='账户代码：' prop='acctIds'>
            <account-code
              :ref="`validateAcctHoldAccount`"
              :codeType="`account`"
              :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['ACCOUNT_CODE']}
              )
            }"
              @getTextareaCodeList="getAccountListFunc"></account-code>
          </el-form-item>
        </el-col>
        <el-col :xl='8' :lg='8' :md='9' :sm='24'>
          <stock-code
            :ref='`validateAcctHoldStock`'
            @getStockCode='getStockCode'
            @handleSecTypeAndChosenTypeListChange='chosenSecType'
          ></stock-code>
        </el-col>
      </el-form>
    </el-card>
    <el-card>
      <dimension-measure-update
        @changeDimen='changeDimension'
        :conConfig='dimenMeaConfig'></dimension-measure-update>
      <el-row>
        <export-btn @handleExportData="handleExportData"></export-btn>
        <el-col>
          <common-table-pagination-component
            :loading='loading'
            :tableData='tableData'
            :columns='columns'
            :pagination='pagination'
            :totalNum='totalNum'
            @handlePaginationChange='handlePaginationChange'
          ></common-table-pagination-component>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import { getAcctSecHoldQuery } from '../../../service/analysisTool/complexQuery/index'
import {selfValidateMethod} from './componentsTool/common/validate'
import {complexQueryDec0, complexQueryDec7} from './componentsTool/common/sortMethods'

export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    TextUpload: () => import('../../common/textUpload'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    AccountCode: () => import('./componentsTool/common/TextAreaCodesAndUploadComponent'),
    StockCode: () => import('./componentsTool/common/StockCodesUploadAndSecTypeSelectComponent'),
    DimensionMeasureUpdate: () => import('./componentsTool/DimensionMeasureUpdate'),
    commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
  },
  data() {
    return {
      statisticCaliber: [
        {
          title: '账户证券持仓情况',
          content: [
            `1.	对于某一个股东账户而言，在同一交易日内对某一只证券品种最多只能有一条记录。`,
            `2.	本应用中的非限售流通持仓数据和限售流通持仓数据均采用清算后数据。`,
            `3.	如果某股东账户于某日在清算后非限售流通持仓数据中有持仓记录，则当日该股东账户的PBU以清算后非限售流通持仓数据中的PBU为准，否则以清算后限售流通持仓数据中的PBU为准。在统计时，该股东账户当日的“会员名称”、“会员营业部名称”字段的值根据前面获得的PBU确定。`,
            `4.	股票、基金采用以下公式计算市值：`,
            `某日某股票、基金持股市值＝该股票、基金当日收盘价×持仓数量`,
            `债券采用以下公式计算市值：`,
            `某日某债券持股市值＝该债券当日收盘价×10×持仓数量`,
            `如果当日收盘价为0，则取昨收盘价。如果两者都取不到则市值为0`,
            `5.	根据以上的席位代码获取得到的会员营业部信息包含基金及非会员（基金、非会员都不还原为出租PBU的会员）。这与市场监察部当前使用的“席位与会员营业部对应关系数据”的口径一致。`,
            `6.	由于股东的持仓数据是一个时点的值，将一段时间内的持仓汇总统计没有意义。所以在页面左上方的“维度”中“交易日期”是必选的。`,
            `7.	总持股数量占比等于当日该账户持有该证券总持仓数量/当日该证券总股本。计算该指标时，不考虑会员营业部维度。`
          ]
        }
      ],
      tempDimenMeasure: { // 缓存维度与度量，数据返回后再更新页面
        dimen: [], // 用来判断维度是否发生变化，变化了点击刷新按钮才请求
        changeDimen: [], // 实时获取维度，点击查询按钮需要实时维度数据
        measure: []
      },
      dimenMeaConfig: {
        dimensionAll: [ // id:维度选择的升降序， index表示在表头中的索引，用来展示列
          {name: '交易日期', id: 'trade_date', disable: true},
          {name: '证券代码', id: 'sec_code'},
          {name: '会员名称', id: 'mem_name'},
          {name: '会员营业部名称', id: 'mem_branch_name'},
          {name: '一码通代码', id: 'ccrc_id'},
          {name: '股东账户', id: 'acct_id'}
        ],
        dimensionQuery: ['trade_date', 'sec_code', 'mem_name', 'mem_branch_name', 'ccrc_id', 'acct_id'], // 维度查询
        measureAll: [
          {name: '非限售股数量', id: 8},
          {name: '限售股数量', id: 9},
          {name: '总持股数量', id: 10},
          {name: '非限售股市值', id: 11},
          {name: '限售股市值', id: 12},
          {name: '总持股市值', id: 13},
          {name: '总持股数量占比', id: 14}
        ],
        measureQuery: [8, 9, 10, 11, 12, 13, 14] // 度量查询
      },
      currentngspUid: '', // 用来记录上一次返回的ngspUid
      loading: false,
      totalNum: 0,
      pagination: {
        currentPage: 1,
        pageSizeNumber: 10
      },
      queryData: { }, // 接口查询参数,保存上次查询参数
      formData: { // 页面中展示参数
        startDate: '',
        endDate: '',
        acctIds: '',
        secCodes: '',
        dimensionType: '',
        secType: 0,
        isOneYard: false
      },
      tableData: [],
      columns: [ // 逐日
        {
          id: '891',
          show: true,
          label: '交易日期',
          marks: 'trade_date',
          field: 'trade_date',
          align: 'left',
          sortable: true
        },
        {
          id: '894',
          show: true,
          label: '证券代码',
          marks: 'sec_code',
          field: 'sec_code',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'sec_code')
        },
        {
          id: '895',
          show: true,
          label: '证券简称',
          marks: 'sec_code',
          field: 'sec_name',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_name')
        },
        {
          id: '896',
          show: true,
          label: '会员名称',
          marks: 'mem_name',
          field: 'mem_name',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'mem_name')
        },
        {
          id: '897',
          show: true,
          label: '会员营业部名称',
          marks: 'mem_branch_name',
          field: 'branch_name',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
        },
        {
          id: '898',
          show: true,
          label: '股东账户',
          marks: 'acct_id',
          field: 'acct_id',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_id')
        },
        {
          id: '899',
          show: true,
          label: '一码通账号',
          marks: 'ccrc_id',
          field: 'ccrc_acct_id',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'ccrc_acct_id')
        },
        {
          id: '8910',
          show: true,
          label: '股东名称',
          marks: 'acct_id',
          field: 'acct_name',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_name')
        },
        {
          id: '911',
          show: true,
          label: '非限售股数量',
          marks: '8',
          field: 'hold_vol',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'hold_vol'),
          formatter: this.gfnElColFormatDecThou0,
          format: '#,##0'
        },
        {
          id: '912',
          show: true,
          label: '限售股数量',
          marks: '9',
          field: 'limit_hold_vol',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'limit_hold_vol'),
          formatter: complexQueryDec0,
          format: '#,##0'
        },
        {
          id: '913',
          show: true,
          label: '总持股数量',
          marks: '10',
          field: 'total_hold_vol',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'total_hold_vol'),
          formatter: complexQueryDec0,
          format: '#,##0'
        },
        {
          id: '914',
          show: true,
          label: '非限售股市值',
          marks: '11',
          field: 'hold_amt',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'hold_amt')
        },
        {
          id: '915',
          show: true,
          label: '限售股市值',
          marks: '12',
          field: 'limit_hold_amt',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'limit_hold_amt')
        },
        {
          id: '916',
          show: true,
          label: '总持股市值',
          marks: '13',
          field: 'total_hold_amt',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'total_hold_amt')
        },
        {
          id: '917',
          show: true,
          label: '总持股数量占比(%)',
          marks: '14',
          field: 'total_hold_vol_ratio',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'total_hold_vol_ratio'),
          formatter: complexQueryDec7,
          format: '#,##0.0000000'
        }
      ],
      rules: {
        startDate: [{required: true, message: '请选择日期'}],
        endDate: [{required: true, message: '请选择日期'}],
        acctIds: [
          {required: true, message: '请输入账户代码'}
        ]
      },
      uploadOption: {
        loading: false,
        name: '上传',
        size: 'small'
      },
      breadcrumbItems: [
        {
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '数据综合查询'
        }, {
          router: '/acctSecHoldQuery',
          label: '账户证券持仓情况'
        }]
    }
  },
  methods: {
    handleColumns() { // 根据维度与度量处理表头
      let tempArr = this.tempDimenMeasure.changeDimen.concat(this.tempDimenMeasure.measure)
      if (tempArr.length > 0) {
        this.columns.map((v, i) => {
          let filterItem = tempArr.filter(item => {
            return v.marks.indexOf(item) > -1
          })
          if (filterItem.length) {
            v.show = true
          } else {
            v.show = false
          }
        })
      }
    },
    changeDimension(dimen, measure, mark) {
      this.tempDimenMeasure.measure = measure
      this.tempDimenMeasure.changeDimen = dimen
      if (mark === 'yes') {
        if (this.tempDimenMeasure.dimen.toString() !== dimen.toString()) { // 维度变化需要发起请求
          this.tempDimenMeasure.dimen = dimen
          this.reqTableData(0)
        } else {
          this.handleColumns()
        }
      }
    },
    getAccountListFunc(data) {
      this.formData.acctIds = data
    },
    chosenSecType(secType, chosenTypeListString) {
      if (secType) {
        this.formData.secType = chosenTypeListString
      } else {
        this.formData.secType = secType
      }
      /* 校验证券大类 */
      this.$refs[`accountSecurityHoldingForm`].validateField('secType')
    },
    getStockCode(data) {
      this.formData.secCodes = data
      this.$refs['accountSecurityHoldingForm'].validateField('secType')
    },
    clearForm() {
      this.$refs[`validateAcctHoldStock`].clearStockCodes()
      this.$refs[`validateAcctHoldAccount`].clearCodeList()
      this.formData.acctIds = ''
      this.formData.secCodes = ''
      this.formData.startDate = ''
      this.formData.endDate = ''
      this.formData.dimensionType = ''
      this.formData.isOneYard = false
    },
    reqTableData(type) {
      let params = {
        dimensionType: this.tempDimenMeasure.changeDimen.toString(),
        startDate: type ? this.formData.startDate : this.queryData.startDate,
        endDate: type ? this.formData.endDate : this.queryData.endDate,
        secCodes: type ? (this.formData.secType ? '' : this.formData.secCodes) : this.queryData.secCodes, // 证券代码集合
        acctIds: type ? this.formData.acctIds : this.queryData.acctIds, // 账户代码集合
        secType: type ? this.formData.secType : this.queryData.secType,
        isOneYard: type ? this.formData.isOneYard ? 1 : 0 : this.queryData.isOneYard,
        pageIndex: this.pagination.currentPage,
        pageRows: this.pagination.pageSizeNumber,
        ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
        isExport: 0, // 1代表导出报表
        exportType: '', // excel,csv
        isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
      }
      params.startDate = moment(params.startDate).format('YYYY-MM-DD')
      params.endDate = moment(params.endDate).format('YYYY-MM-DD')
      this.loading = true
      getAcctSecHoldQuery(params).then(resp => {
        this.loading = false
        this.handleColumns() // 处理表头
        if (resp) {
          this.currentngspUid = resp.ngsp_uid
          this.tableData = resp.data
          this.totalNum = Number(resp.totalRowCount)
        } else {
          this.currentngspUid = ''
          this.tableData = []
        }
      })
    },
    handleSearch() { // 查询按钮
      let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
      let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
      if (sDate > eDate + 60 * 60 * 1000) {
        this.$message.error('开始日期不得大于结束日期')
        return
      }
      this.$refs['accountSecurityHoldingForm'].validate((valid) => {
        if (valid) {
          if (!selfValidateMethod({accounts: this.formData.acctIds, stocks: this.formData.secCodes})) { /* 批量校验证券代码格式 */
            return
          }
          this.queryData = JSON.parse(JSON.stringify(this.formData))
          this.pagination.currentPage = 1
          this.reqTableData(1)
        }
      })
    },
    handlePaginationChange(pagination) {
      this.pagination = pagination
      this.reqTableData(0)
    },
    handleExportData(type) { // 处理导出表格数据
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let columns = []
      this.columns.map((item) => {
        if (item.show) {
          columns.push(item)
        }
      })
      let params = {
        dimensionType: this.tempDimenMeasure.changeDimen.toString(),
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: columns
      }
      this.gfnExportFileWithForm('/complexqry/accountSercurities/v1/holding/export', params)
    }
  }
}
</script>

<style lang='less' scoped>
  .account-security-holding {
    .dimension-measure-choice {
      .refurbish-table {
        margin-top: 10px;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .el-checkbox-group {
        .el-checkbox {
          min-width: 120px;
        }
      }
    }
    .account-security-holding-form {
      padding-top: 10px;
    }
    .line-height32 {
      height: 32px;
      line-height: 32px;
    }
  }

</style>
