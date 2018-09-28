<template>
  <div class='fund-reverse-container'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card class='fund-reverse-query-area'>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size='small' type='info'  @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-row>
        <el-form :inline='true' ref='fundReverseTransactionForm' :model='formData' :rules='rules' label-width='110px' class='demo-form-inline fund-reverse-query-area-form'>
          <el-form-item label='开始日期：' prop='startDate'>
            <el-date-picker
              v-model='formData.startDate'
              type='date'
              placeholder='请选择开始日期'
              :picker-options='pickerOption'
              size='small'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label='结束日期：' prop='endDate'>
            <el-date-picker
              v-model='formData.endDate'
              type='date'
              placeholder='请选择结束日期'
              :picker-options='pickerOption'
              size='small'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label='账户代码：' prop='acctIds'>
            <textarea-code-list :settings='settingData'></textarea-code-list>
          </el-form-item>
          <el-form-item>
            <text-upload
              :uploadOption="{name: '上传Excel', size: 'small'}"
              :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
              :limitFileType="['xlsx','xls']"
              :uploadParams='uploadParams'
              @getTxtCon='getTxtCon'></text-upload>
            <el-button size='small' @click='getTemplateFile' style='border: none; margin-left: 10px;'>&nbsp;模板下载&nbsp;</el-button>
          </el-form-item>
          <el-form-item label='错误账户代码：' v-show='settingErrorData.list.length > 0'>
            <textarea-code-list :settings='settingErrorData'></textarea-code-list>
          </el-form-item>
        </el-form>
      </el-row>

    </el-card>
    <el-card>
      <el-row>
        <export-btn @handleExportData="handleExportData"></export-btn>
        <el-col :span='24'>
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
import {getFundReverseTransaction, getFundReverseTransactionExcel} from '../../../service/analysisTool/complexQuery/index'
// 获取交易日偏移
import {getRelativeTradeDate} from '../../../service/common/commonFunc'
import {selfValidateMethod} from './componentsTool/common/validate'
import {complexQueryDec0, complexQueryDec2, complexQueryDec3} from './componentsTool/common/sortMethods'

export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    textUpload: () => import('../../common/textUpload'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    TextareaCodeList: () => import('./componentsTool/TextareaCodeList'),
    commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
  },
  data() {
    return {
      statisticCaliber: [
        {
          title: '基金反向交易',
          content: [
            '1.\t本应用可查询自2008-01-01至今的沪市所有证券品种的交易数据。',
            '2.\t按交易日、证券、基金公司这三个维度汇总统计每天、每家基金公司控制下的股东账户对每只股票的买入、卖出数据。筛选股东账户时，以其是否存在于“机构投资者账户文件”中为准。',
            '3.\t判断“机构投资者账户文件”中股东账户为基金公司账户，以其账户在成交明细数据中的交易PBU是否被基金公司租用为准。',
            '4.\t判断“机构投资者账户文件”中股东账户隶属于同一家基金公司，以其账户在成交明细数据中的交易PBU是否被同一家基金公司租用（依据会籍系统的席位信息对应的租用基金公司代码区分）为准。',
            '5.\t如果某天、同一家基金公司控制下的股东账户合计对某证券的买入数量或卖出数量中较小的那个数量大于或等于该证券当天全市场总成交数量的5%，则展示该条记录及各投资组合的明细记录。相同日期同一家基金公司相同证券代码的明细记录与汇总记录的序号相同。',
            '6.\t汇总记录以交易日期、证券代码、会籍系统的基金公司代码（不展示）、会籍系统的基金公司名称分组汇总计算各项指标。',
            '7.\t投资组合的明细记录以交易日期、证券代码、证券名称、会籍系统的基金公司代码（不展示）、会籍系统的基金公司名称、“机构投资者账户文件”中的 “投资组合代码”、“机构投资者账户文件”中的“投资组合名称”、“机构投资者账户文件”中的“基金公司代码”汇总，，分组汇总计算各项指标。',
            '8.\t显示的基金公司代码以“机构投资者账户文件”中的 “基金公司代码”为准。汇总记录的“基金公司代码”显示为空。',
            '9.\t显示的基金公司名称（包含汇总记录），以会籍系统的基金公司代码对应的名称为准。',
            '10.\t投资组合代码及名称以“机构投资者账户文件”中的 “投资组合代码”、“投资组合名称”为准，若投资组合代码”、“投资组合名称”为空，结果同样显示为空。',
            '11.\t汇总记录，投资组合代码及名称都显示为“合计”。',
            '12.\t买入数量占比 = 买入数量 / 当日市场成交量 * 100% ，四舍五入保留小数点后三位。',
            '13.\t卖出数量占比 = 卖出数量 / 当日市场成交量 * 100% ，四舍五入保留小数点后三位。',
            '14.\t本应用中的成交数量、成交金额均不含大宗交易。'
          ]
        }
      ],
      settingData: {
        placeholder: '请上传文件',
        isDisabled: true,
        clearHistoryList: true,
        list: [] // 存储上传股东账户list
      },
      settingErrorData: {
        isDisabled: false,
        clearHistoryList: true,
        list: [] // 存储错误股东账户list
      },
      uploadParams: {
        parseRules: JSON.stringify(
          [{
            // delimiter: ',',
            // verifies: ['ACCOUNT_CODE'],
            firstToSkip: 1, // 前置忽略项
            lastToAbandon: 0, // 后置忽略项
            fields: ['acct_id', 'sec_name', 'type', 'comp_name', 'comp_code', 'sec_code']
          }]
        )
      },
      breadcrumbItems: [
        {
          router: '/analysisTool',
          label: '分析工具'
        }, {
          router: '/complexQuery',
          label: '综合查询'
        }, {
          router: '/fundReverseTransaction',
          label: '基金反向交易查询'
        }
      ],

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
        acctIds: ''
      },
      tableData: [],
      columns: [ // 定义列
        {
          label: '序号',
          field: 'seq_final',
          minWidth: '6.25%',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'seq_final')                                                                                      
        },
        {
          label: '交易日期',
          field: 'trade_date',
          minWidth: '6.25%',
          align: 'left',
          sortable: true                                                                                 
        },
        {
          label: '证券名称',
          field: 'sec_name',
          minWidth: '6.25%',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_name')                                                                                      
        },
        {
          label: '证券代码',
          field: 'sec_code',
          minWidth: '6.25%',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'sec_code')                                                                                      
        },
        {
          label: '当日市场成交量',
          field: 'trade_vol_total',
          minWidth: '7%',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'trade_vol_total'),
          formatter: complexQueryDec0,
          format: '#,##0'
        },
        {
          label: '当日市场成交金额',
          field: 'trade_amt_total',
          minWidth: '7%',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'trade_amt_total'),
          formatter: complexQueryDec2,
          format: '#,##0.00'
        },
        {
          label: '基金公司代码',
          field: 'mem_code',
          minWidth: '7%',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'mem_code')                                                                                      
        },
        {
          label: '基金公司名称',
          field: 'mem_name',
          minWidth: '7%',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'mem_name') 
        },
        {
          label: '投资组合代码',
          field: 'branch_code',
          minWidth: '7%',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_code')                                                                                      
        },
        {
          label: '投资组合名称',
          field: 'branch_name',
          minWidth: '7%',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')                                                                                      
        },
        {
          label: '买入数量',
          field: 'buy_vol',
          minWidth: '7%',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'buy_vol'),
          formatter: complexQueryDec0,
          format: '#,##0'
        },
        {
          label: '卖出数量',
          field: 'sell_vol',
          minWidth: '7%',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'sell_vol'),
          formatter: complexQueryDec0,
          format: '#,##0'
        },
        {
          label: '买入占比(%)',
          field: 'buy_vol_rate',
          minWidth: '7%',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'buy_vol_rate'),
          formatter: complexQueryDec3,
          format: '#,##0.000'
        },
        {
          label: '卖出占比(%)',
          field: 'sell_vol_rate',
          minWidth: '7%',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'sell_vol_rate'),
          formatter: complexQueryDec3,
          format: '#,##0.000'
        }
      ],

      rules: {
        startDate: [
          {required: true, message: '请选择日期'}
        ],
        endDate: [
          {required: true, message: '请选择日期'}
        ],
        acctIds: [
          {required: true, message: '请上传账户代码'}
        ]
      },
      initData: {
        start: '',
        end: ''
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    gfnElColFormatDec3Percent(row, column, cellValue) {
      if (cellValue === null) {
        return ''
      }
      return Number(cellValue) === 0 ? 0 : this.gfnFormatDecimal(cellValue, 3) + '%'
    },
    getTemplateFile() { // 下载模板文件
      this.gfnDownloadTemplateFile({code: 'fundReverseTransaction'})
    },
    getAccountListFunc() {
      this.formData.acctIds = data.join(',')
    },
    getTxtCon(value) { // 文件上传
      if(value && value['Sheet0']) {
        // 分类分为四类JJ、NJ、SB、ZH。若导入类型有其它类型，提示导入文件有问题，请重新导入。
        getFundReverseTransactionExcel(JSON.stringify(value.Sheet0)).then((resp) => {
          let {formatError, typeError, countMsg, rightList} = resp
          if (resp.flag === 0) {
            this.settingErrorData.list = []
          } else {
            let sFormat = [], sType = []
            if (formatError) {
              let str = `格式错误：,${formatError}`
              sFormat = str.split(',')
            }
            if (typeError) {
              sType = typeError.split(',')
              sType.unshift('分类错误,只能选择JJ、NJ、SB、ZH：')
            }
            this.settingErrorData.list = sFormat.concat(sType)
          }
          this.settingData.list = [...new Set(rightList)]
          this.formData.acctIds = [...new Set(rightList)].join(',')
          let msg = countMsg.split(',')
          this.$message.success(`共计上传${msg[0]}条，成功${msg[1]}条，无效${msg[2]}条`)
        })
      }
    },
    clearForm() {
      this.settingData.list = []
      this.$refs['fundReverseTransactionForm'].resetFields()
      this.formData.startDate = this.initData.start
      this.formData.endDate = this.initData.end
    },
    reqTableData(type) {
      let params = {
        startDate: type ? this.formData.startDate : this.queryData.startDate,
        endDate: type ? this.formData.endDate : this.queryData.endDate,
        acctIds: type ? this.formData.acctIds : this.queryData.acctIds, // 账户代码集合
        ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
        pageIndex: this.pagination.currentPage,
        pageRows: this.pagination.pageSizeNumber,
        isExport: 0, // 1代表导出报表
        exportType: '', // excel,csv
        isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
      }
      params.startDate = moment(params.startDate).format('YYYY-MM-DD')
      params.endDate = moment(params.endDate).format('YYYY-MM-DD')
      this.loading = true
      getFundReverseTransaction(params).then((resp) => {
        this.loading = false
        if (resp) {
          resp.data.length > 0 ?  this.currentngspUid = resp.ngsp_uid : this.currentngspUid = ''
          this.tableData = resp.data
          this.totalNum = Number(resp.totalRowCount)
        } else {
          this.currentngspUid = ''
          this.tableData = []
        }
      })
    },
    handleSearch() {
      let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
      let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
      if (sDate > eDate + 60 * 60 * 1000) {
        this.$message.error('开始日期不得大于结束日期')
        return
      }
      this.$refs['fundReverseTransactionForm'].validate((valid) => {
        if (valid) {
          if (!selfValidateMethod({accounts: this.formData.acctIds})) { /* 批量校验证券代码格式 */
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
    handleExportData(type) { // 下载
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let params = {
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: this.columns
      }
      this.gfnExportFileWithForm('/complexqry/fundReverseTransactionQuery/v1/fundReverseTransactionQuery/export', params)
    }
  },
  mounted() {
    // 清空日期为初始日期
    getRelativeTradeDate(-1).then(resp => {
      this.initData.start = this.formData.startDate = moment(resp).format('YYYY-MM-DD')
      this.initData.end = this.formData.endDate = moment(resp).format('YYYY-MM-DD')
    })
  }
}
</script>

<style lang='less'>
  .fund-reverse-container {
  }
</style>
