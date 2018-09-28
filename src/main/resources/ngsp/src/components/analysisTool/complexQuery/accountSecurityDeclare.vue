<!-- 账户证券申报情况 -->
<template>
  <div class='account-security-declare'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size='small' type='info' @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>
      <el-form label-width='100px' ref='accountSecurityDeclareForm' :inline="true" :model='formData' :rules='rules'
               class='clearfix account-security-declare-form'>
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
        </el-col>
        <el-col :xl='7' :lg='8' :md='7' :sm='24'>
          <el-form-item label='账户代码：' prop='acctIds'>
            <account-code
              :ref="`validateDeclareAccount`"
              :codeType="`account`"
              :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['ACCOUNT_CODE']}
              )
            }"
              @getTextareaCodeList="getAccountListFunc"></account-code>
          </el-form-item>
        </el-col>
        <el-col :xl='9' :lg='9' :md='10' :sm='24'>
          <stock-code
            :ref='`validateDeclareStock`'
            @getStockCode='getStockCode'
            @handleSecTypeAndChosenTypeListChange='chosenSecType'
          ></stock-code>
        </el-col>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <export-btn @handleExportData="handleExportData"></export-btn>
        <el-col>
          <tab-table-pagination-component
            :loading='loading'
            :tabPanes='tabPanes'
            :activeName='activeName'
            :tableDatas='tableDatas'
            :tableColumns='tableColumns'
            :paginations='paginations'
            @handlePaginationChange='handlePaginationChange'
            @updateActiveName='updateActiveName'>
          </tab-table-pagination-component>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
import tabTablePaginationComponent from './componentsTool/common/tabTablePaginationComponent'
import {tableColumns} from './componentsTool/accountSecurityDeclare/columns'
import {getAccountSecurityDeclare} from '../../../service/analysisTool/complexQuery/index'
import {selfValidateMethod} from './componentsTool/common/validate'
// 获取交易日偏移
import {getRelativeTradeDate} from '../../../service/common/commonFunc'

export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    TextUpload: () => import('../../common/textUpload'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    AccountCode: () => import('./componentsTool/common/TextAreaCodesAndUploadComponent'),
    StockCode: () => import('./componentsTool/common/StockCodesUploadAndSecTypeSelectComponent'),
    tabTablePaginationComponent,
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
  },
  data() {
    let paginations = []
    for (let i = 0; i < 2; i++) {
      paginations.push({
        currentPage: 1,
        pageSizeNumber: 10
      })
    }
    return {
      statisticCaliber: [
        {
          title: '账户证券申报情况',
          content: [
            `1. 本应用支持查询自新交易上线（2009-11-23）至今的竞价系统申报订单明细数据。（2009-11-20以前的竞价系统申报订单明细数据数据将在晚些时候提供查询，且无撤单时间信息）。`,
            `2. 可按以下维度汇总：“证券代码”、“会员”、“会员营业部”、“PBU代码”、“股东账户”、“交易日期”、“买卖方向”。`,
            `3. 可按照逐笔申报明细展示。`,
            `4. 基金的数量单位为“份”，债券的数量单位为“手”，B股的申报价格和成交金额为“美元”。`,
            `5. 在统计时，“会员”、“会员营业部”字段的值基于订单申报明细数据中的Stat_Seat_Code来确定。`,
            `6. Stat_Seat_Code（统计席位代码/统计PBU代码）是数据仓库为了更准确、更方便地识别某条申报/成交记录来自于哪个营业部而设计的一个代码。其算法是根据该条申报/成交记录中券商填报的Branch_ID（2010-01-22以后）/内部订单编号的前两位（2010-01-21以前）对应的营业部，判断其是否属于这个券商。若是，则按其填报的营业部统计。若否，则按其下单的席位/PBU对应的主营业部统计。`,
            `7. 根据“Stat_Seat_Code”获取得到的会员营业部信息包含基金及非会员（基金、非会员都不还原为出租PBU的会员）。这与市场监察部当前使用的“席位与会员营业部对应关系数据”的口径一致。`,
            `8. 信用标签：对于融资融券账户展示为“M”、“S”、“C”、“P”，非融资融券账户展示为空。`,
            `9. 申报方向：买入为“B”，卖出为“S”。`,
            `10. 订单类型：限价订单为“L”，市价订单为“M”，市价转限价订单为“T”。`,
            `11. 申报金额：申报数量 * 申报价格，如果该记录的申报价格为0，则展示0。`,
            `12. 股东名称：以用户输入的查询日期区间内的最新名称为准。`,
            `13. 证券简称：以用户输入的查询日期区间内的最新名称为准。`,
            `14. 撤单数量：如果该订单被投资者主动撤单，则为该订单申报数量减去已成交数量后的剩余未成交数量，否则为0。`,
            `15. 申报数量占比为该账户当日对该证券买或卖单方向合计申报数量占当日该证券买或卖单方向合计申报数量的比重。计算时，不考虑PBU和会员营业部维度。`,
            `16. 成交数量占比为该该账户当日对该证券买或卖单方向合计成交数量占当日该证券总成交量的比重。计算时，不考虑PBU和会员营业部维度。`,
            `17. 撤单数量占比为该账户当日对该证券买或卖单方向合计撤单数量占当日该证券买或卖单方向合计撤单数量的比重。计算时，不考虑PBU和会员营业部维度。`,
            `18. 用户参数界面中证券大类的识别规则如下：`,
            `  股票：证券代码为6*****或者900***`,
            `  债券：证券代码为0*****或者1*****`,
            `  基金：证券代码为50****或者51****。`
          ]
        }
      ],
      settingData: {
        rows: 7,
        isDisabled: false,
        placeholder: '请输入股东账户',
        list: [] // 存储上传股东账户list
      },
      queryData: {}, // 接口查询参数,保存上次查询参数
      formData: { // 页面中展示参数
        startDate: '',
        endDate: '',
        acctIds: '',
        secType: 0, // 统计对象
        secCodes: '' // 证券代码
      },
      initData: {
        start: '',
        end: ''
      },
      rules: {
        startDate: [{required: true, message: '请选择日期'}],
        endDate: [{required: true, message: '请选择日期'}],
        acctIds: [{required: true, message: '请输入股东账户'}]
      },
      loading: false,
      tableDatas: {},
      tableColumns,
      currentngspUid: '', // 用来记录上一次返回的ngspUid
      tabPanes: [{label: '期间逐日申报明细'}, {label: '期间逐笔申报明细'}],
      activeName: '0',
      paginations: paginations,
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
          router: '/accountSecurityDeclare',
          label: '账户证券申报情况'
        }]
    }
  },
  methods: {
    updateActiveName(activeName) {
      this.activeName = activeName
    },
    handlePaginationChange(paginations) {
      this.paginations = paginations
      this.reqTableData(0)
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
      this.$refs[`accountSecurityDeclareForm`].validateField('secType')
    },
    getStockCode(data) {
      this.formData.secCodes = data
      this.$refs['accountSecurityDeclareForm'].validateField('secType')
    },
    clearForm() {
      this.$refs[`validateDeclareStock`].clearStockCodes()
      this.$refs[`validateDeclareAccount`].clearCodeList()
      this.formData.startDate = this.initData.start
      this.formData.endDate = this.initData.end
      this.formData.acctIds = ''
      this.formData.secCodes = ''
    },
    handleSearch() {
      let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
      let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
      if (sDate > eDate + 60 * 60 * 1000) {
        this.$message.error('开始日期不得大于结束日期')
        return
      }
      this.$refs['accountSecurityDeclareForm'].validate((valid) => {
        if (valid) {
          if (!selfValidateMethod({accounts: this.formData.acctIds, stocks: this.formData.secCodes})) { /* 批量校验证券代码格式 */
            return
          }
          this.queryData = JSON.parse(JSON.stringify(this.formData))
          this.activeName = '0'
          this.paginations.forEach(v => {
            v.currentPage = 1
          })
          this.reqTableData(1)
        }
      })
    },
    extendParams(params) {
      params.pageIndex = this.paginations.map(v => {
        return v.currentPage
      }).join(',')
      params.pageRows = this.paginations.map(v => {
        return v.pageSizeNumber
      }).join(',')
    },
    reqTableData(type) {
      let params = {
        startDate: type ? this.formData.startDate : this.queryData.startDate,
        endDate: type ? this.formData.endDate : this.queryData.endDate,
        secCodes: type ? (this.formData.secType ? '' : this.formData.secCodes) : this.queryData.secCodes, // 证券代码集合
        acctIds: type ? this.formData.acctIds : this.queryData.acctIds, // 账户代码集合
        secType: type ? this.formData.secType : this.queryData.secType, // 证券代码集合
        ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
        isExport: 0, // 1代表导出报表
        exportType: '', // excel,csv
        isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
      }
      /* 处理pageIndex，pageRows */
      this.extendParams(params)
      params.startDate = moment(params.startDate).format('YYYY-MM-DD')
      params.endDate = moment(params.endDate).format('YYYY-MM-DD')
      this.loading = true
      getAccountSecurityDeclare(params).then(resp => {
        this.loading = false
        if (resp) {
          resp.tab1.data.length > 0 || resp.tab2.data.length > 0 ?  this.currentngspUid = resp.tab1.ngsp_uid : this.currentngspUid = ''
          this.tableDatas = resp
        } else {
          this.currentngspUid = ''
          this.tableDatas = []
        }
      })
    },
    // 处理导出表格数据
    handleExportData(type) {
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let params = {
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: {
          tab1: this.tableColumns[0],
          tab2: this.tableColumns[1]
        }
      }
      if (type === 'csv') { // 只能导出当前tab下的csv文件
        params.tabIndex = 'tab' + (Number(this.activeName) + 1)
      }
      this.gfnExportFileWithForm('/complexqry/accountSercurities/v1/declarations/export', params)
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

<style lang='less' scoped>
  .account-security-declare {
  }

</style>
