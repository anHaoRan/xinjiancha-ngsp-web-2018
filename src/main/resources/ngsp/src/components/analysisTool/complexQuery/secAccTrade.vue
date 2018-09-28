<!-- secAccTrade  账户交易及非交易过户情况查询 -->
<template>
  <div class='cross-account-query'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber">
          <div slot="is0">
            <caliber></caliber>
          </div>
        </statistic-caliber>
        <el-button size='small' type='info'  @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-form label-width='100px' ref='crossAccountQueryForm'
               :model='formData' :rules='rules' :inline="true"
               class='clearfix cross-account-query-form'>
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
          <el-form-item label=' ' >
            <el-checkbox v-model='formData.isOneYard' label='按照一码通维度计算'></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :xl='7' :lg='7' :md='7' :sm='24'>
          <el-form-item label='账户代码：'>
            <div class='clearfix'>
              <account-code
                :ref="`validateSecAccAccount`"
                :codeType="`account`"
                :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['ACCOUNT_CODE']}
              )
            }"
                @getTextareaCodeList="getAccountListFunc"></account-code>
            </div>
            <span>如为空白，则仅计算非交易过户数据</span>
          </el-form-item>
        </el-col>
        <el-col :xl='8' :lg='8' :md='9' :sm='24'>
          <stock-code
            :ref='`validateSecAccStock`'
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
            <div slot='trade'>
              <el-col :span='24'>
                <dimension-measure-update
                  @changeDimen='changeDimension'
                  :conConfig='dimenMeaConfig'></dimension-measure-update>
              </el-col>
            </div>
          </tab-table-pagination-component>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import tabTablePaginationComponent from './componentsTool/common/tabTablePaginationComponent'
import { getSecAccTradeQuery } from '../../../service/analysisTool/complexQuery/index'
import {selfValidateMethod} from './componentsTool/common/validate'
import {complexQueryDec0, complexQueryDec2} from './componentsTool/common/sortMethods'

export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    TextUpload: () => import('../../common/textUpload'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    AccountCode: () => import('./componentsTool/common/TextAreaCodesAndUploadComponent'),
    StockCode: () => import('./componentsTool/common/StockCodesUploadAndSecTypeSelectComponent'),
    DimensionMeasureUpdate: () => import('./componentsTool/DimensionMeasureUpdate'),
    tabTablePaginationComponent,
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber'),
    Caliber: () => import('./componentsTool/secAccTrade/Caliber')
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
          title: '账户交易情况表',
          rewrite:true
        }
      ],
      tempDimenMeasure: { // 缓存维度与度量，数据返回后再更新页面
        dimen: [], // 用来判断维度是否发生变化，变化了点击刷新按钮才请求
        changeDimen: [], // 实时获取维度，点击查询按钮需要实时维度数据
        measure: []
      },
      dimenMeaConfig: {
        dimensionAll: [ // id:维度选择的升降序， index表示在表头中的索引，用来展示列
          {name: '交易日期', id: 'trade_date'},
          {name: '证券代码', id: 'sec_code'},
          {name: '会员营业部', id: 'mem_branch_name'},
          {name: '一码通代码', id: 'ccrc_id'},
          {name: '股东账户', id: 'acct_id'}
        ],
        dimensionQuery: ['trade_date', 'sec_code', 'mem_branch_name', 'ccrc_id', 'acct_id'], // 维度查询
        measureAll: [
          {name: '买成交数量', id: 9},
          {name: '买成交金额', id: 10},
          {name: '买成交价格', id: 11},
          {name: '卖成交数量', id: 13},
          {name: '卖成交金额', id: 14},
          {name: '卖成交价格', id: 15}
        ],
        measureQuery: [9, 10, 11, 13, 14, 15] // 度量查询
      },

      queryData: {}, // 接口查询参数,保存上次查询参数
      formData: {
        startDate: '',
        endDate: '',
        secCodes: '', // 证券代码
        secType: 0, // 统计对象
        acctIds: '',
        dimensionType: '',
        isOneYard: false
      },
      rules: {
        startDate: [{required: true, message: '请选择日期'}],
        endDate: [{required: true, message: '请选择日期'}]
      },
      loading: false,
      tableDatas: {},
      tableColumns: [
        [ // 交易
          {
            id: '331',
            show: true,
            label: '股东账户',
            marks: 'acct_id',
            field: 'acct_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_id')
          },
          {
            id: '332',
            show: true,
            label: '股东名称',
            marks: 'acct_id',
            field: 'acct_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_name')
          },
          {
            id: '333',
            show: true,
            label: '一码通代码',
            marks: 'ccrc_id',
            field: 'ccrc_acct_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ccrc_acct_id')
          },
          {
            id: '334',
            show: true,
            label: '交易日期',
            marks: 'trade_date',
            field: 'trade_date',
            align: 'left',
            sortable: true
          },
          {
            id: '335',
            show: true,
            label: '会员营业部',
            marks: 'mem_branch_name',
            field: 'mem_branch_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'mem_branch_name')
          },
          {
            id: '336',
            show: true,
            label: '证券代码',
            marks: 'sec_code',
            field: 'sec_code',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sec_code')
          },
          {
            id: '337',
            show: true,
            label: '证券简称',
            marks: 'sec_code',
            field: 'sec_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_name')
          },
          {
            id: '338',
            show: true,
            label: '买成交数量(合计)',
            marks: '9',
            field: 'buy_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buy_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: '339',
            show: true,
            label: '买成交数量占比(%)',
            marks: '9',
            field: 'buy_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buy_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: '3310',
            show: true,
            label: '买成交金额(合计)',
            marks: '10',
            field: 'buy_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buy_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: '3311',
            show: true,
            label: '买成交价格(合计)',
            marks: '11',
            field: 'buy_price',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buy_price'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: '3312',
            show: true,
            label: '卖成交数量(合计)',
            marks: '13',
            field: 'sell_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sell_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: '3313',
            show: true,
            label: '卖成交数量占比(%)',
            marks: '13',
            field: 'sell_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sell_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: '3314',
            show: true,
            label: '卖成交金额(合计)',
            marks: '14',
            field: 'sell_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sell_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: '3315',
            show: true,
            label: '卖成交价格(合计)',
            marks: '15',
            field: 'sell_price',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sell_price'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          }
        ],
        [ // 非交易
          {
            id: '3321',
            label: '交易日期',
            field: 'trade_date',
            align: 'left',
            sortable: true
          },
          {
            id: '3322',
            label: '股东账户',
            field: 'acct_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_id')
          },
          {
            id: '3323',
            label: '股东名称',
            field: 'acct_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_name')
          },
          {
            id: '3324',
            label: '证券代码',
            field: 'sec_code',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sec_code')
          },
          {
            id: '3325',
            label: '证券简称',
            field: 'sec_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_name')
          },
          {
            id: '3326',
            label: '过户数量',
            field: 'transfer_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'transfer_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: '3327',
            label: '变动类型',
            field: 'chg_type',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'chg_type')
          },
          {
            id: '3328',
            label: '变动类型说明',
            field: 'chg_type_desc',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'chg_type_desc')
          },
          {
            id: '3329',
            label: '证券类型',
            field: 'sec_type',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_type')
          },
          {
            id: '3330',
            label: '流通类型',
            field: 'nego_type',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'nego_type')
          }
        ]
      ],
      currentngspUid: '', // 用来记录上一次返回的ngspUid
      tabPanes: [{label: '账户交易情况表', slotType: 'prepend', slotName: 'trade'}, {label: '账户非交易过户明细表'}],
      activeName: '0',
      paginations: paginations,

      breadcrumbItems: [
        {
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '数据综合查询'
        }, {
          router: '/secAccTrade',
          label: '账户交易及非交易过户情况查询'
        }]
    }
  },
  methods: {
    handleColumns() { // 根据维度与度量处理表头
      let tempArr = this.tempDimenMeasure.changeDimen.concat(this.tempDimenMeasure.measure)
      if (tempArr.length > 0) {
        this.tableColumns[0].map((v, i) => {
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
      this.$refs[`crossAccountQueryForm`].validateField('secType')
    },
    getStockCode(data) {
      this.formData.secCodes = data
      this.$refs['crossAccountQueryForm'].validateField('secType')
    },
    clearForm() {
      this.$refs[`validateSecAccStock`].clearStockCodes()
      this.$refs[`validateSecAccAccount`].clearCodeList()
      this.formData.acctIds = ''
      this.formData.secCodes = ''
      this.formData.startDate = ''
      this.formData.endDate = ''
      this.formData.dimensionType = ''
      this.formData.isOneYard = false
    },
    updateActiveName(activeName) {
      this.activeName = activeName
    },
    handlePaginationChange(paginations) {
      this.paginations = paginations
      this.reqTableData(0)
    },
    handleSearch() { // 查询按钮
      let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
      let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
      if (sDate > eDate + 60 * 60 * 1000) {
        this.$message.error('开始日期不得大于结束日期')
        return
      }
      this.$refs['crossAccountQueryForm'].validate((valid) => {
        if (valid) {
          if (!selfValidateMethod({accounts: this.formData.acctIds, stocks: this.formData.secCodes})) { /* 批量校验证券代码格式 */
            return
          }
          this.queryData = JSON.parse(JSON.stringify(this.formData))

          if (this.formData.acctIds.length > 1) {
            this.activeName = '0'
          } else {
            this.activeName = '1'
          }
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
        dimensionType: this.tempDimenMeasure.changeDimen.toString(),
        startDate: type ? this.formData.startDate : this.queryData.startDate,
        endDate: type ? this.formData.endDate : this.queryData.endDate,
        secCodes: type ? (this.formData.secType ? '' : this.formData.secCodes) : this.queryData.secCodes, // 证券代码集合
        acctIds: type ? this.formData.acctIds : this.queryData.acctIds, // 账户代码集合
        secType: type ? this.formData.secType : this.queryData.secType,
        isOneYard: type ? this.formData.isOneYard ? 1 : 0 : this.queryData.isOneYard,
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
      getSecAccTradeQuery(params).then(resp => {
        this.loading = false
        this.handleColumns() // 处理表头
        if (resp) {
          this.currentngspUid = (resp['tab1']['ngsp_uid'] || resp['tab2']['ngsp_uid']) || ''
          this.tableDatas = resp
        } else {
          this.currentngspUid = ''
          this.tableDatas = []
        }
      })
    },
    handleExportData(type) { // 处理导出表格数据
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let columns = []
      this.tableColumns[0].map((item) => {
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
        tableColumns: {
          tab1: columns,
          tab2: this.tableColumns[1]
        }
      }
      if (type === 'csv') { // 只能导出当前tab下的csv文件
        params.tabIndex = 'tab' + (Number(this.activeName) + 1)
      }
      this.gfnExportFileWithForm('/complexqry/accountSercurities/v1/secAccTrade/export', params)
    }
  }
}
</script>

<style lang='less' scoped>
  .cross-account-query {
    .cross-account-query-form {
      padding-top: 10px;
    }
    .cross-account-choice {
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .line-height32 {
      height: 32px;
      line-height: 32px;
    }
  }
</style>
