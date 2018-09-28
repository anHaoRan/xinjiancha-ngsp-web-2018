<!--股权集中度分析-->
<template>
  <div class='equityConcentrationAnalysis'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card class='query-area-card'>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size='small' type='info' @click='handleClear'>清空</el-button>
        <el-button size='small' type='primary' @click='handleQuery'>查询</el-button>
      </div>
      <el-row>
        <el-form ref='searchForm' :model='searchForm' :inline='true' label-width='120px' :rules='rules'>
          <el-form-item
            prop='secCode' label='证券代码'
            :rules='[{
              required: true, message: "请先通过模糊搜索选择一个可用证券代码"
            }
            ]'>
            <stock-code-query :commonData='commonData' @getStockCode='getStockCode'></stock-code-query>
          </el-form-item>
          <el-form-item prop='searchDate' label='日期范围'>
            <el-date-picker
              v-model='searchForm.searchDate'
              type='daterange'
              range-separator='至'
              :picker-option='pickerOption'
              start-placeholder='起始日期'
              end-placeholder='结束日期'
              value-format='yyyy-MM-dd'
              format='yyyy-MM-dd'
              size='small'>
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <el-card class='echarts-area'>
      <props-echarts-component :propsData='tableData'></props-echarts-component>
    </el-card>
    <el-card class='table-area'>
      <div slot='header'>
        <el-dropdown @command='handleExportData' style='float: right;'>
          <el-button type='primary' size='small'>
            导出 <i class='el-icon-arrow-down el-icon-right'></i>
          </el-button>
          <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item command='excel'><i class='el-icon-document'></i>导出为EXCEL</el-dropdown-item>
            <el-dropdown-item command='csv'><i class='el-icon-tickets'></i>导出为CSV</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <h4 style='text-align:center;font-size: 16px;font-weight:600;'>汇总统计表</h4>
      <common-table-pagination-component
        :loading='loading'
        :tableData='tableData'
        :columns='tableColumns'
        :pagination='pagination'
        :totalNum='totalNum'
        @handlePaginationChange='handlePaginationChange'
      ></common-table-pagination-component>
    </el-card>
  </div>
</template>

<script>
  // import moment from 'moment'
  import Breadcrumb from '@/components/common/Breadcrumb'
  import pageination from '@/components/common/pageination'
  import {
    postEquityConcentrationAnalysis,
    exportEquityConcentrationAnalysis
  } from '@/service/analysisTool/complexQuery'
  import propsEchartsComponent from './componentsTool/abnormFluctuateAnalysis/propsEchartsComponent'
  import { tableColumns } from './componentsTool/abnormFluctuateAnalysis/equityAnalysisTableColumns'
  import { getRelativeTradeDate } from '@/service/common/commonFunc'
  import commonTablePaginationComponent from './componentsTool/common/commonTablePaginationComponent'
  import { dateStringAddSeparator } from '@/utils/dateTimeFormat'

  export default {
    components: {
      Breadcrumb,
      pageination,
      propsEchartsComponent,
      commonTablePaginationComponent,
      StockCodeQuery: () => import('@/components/common/StockCodeQuery'),
      StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
    },
    data () {
      return {
        statisticCaliber: [
          {
            title: '股权集中度分析',
            content: [
              `1、 该应用只统计2009年11月23日之后的A股数据。`,
              `2、 收盘价：取自行情的价格。`,
              `3、 成交量: 取自行情的成交数量。`,
              `4、 持股集中度：（超过平均持有量账户的总持股量/流通股本）/（超过平均持有量的总人数 / 总持股人数）。`,
              `5、 持股集中度1：（超过平均持有量账户的总持股量/超过平均持有量的总人数） / （（流通股本－超过平均持有量账户的总持股量）/ 不超过平均持有量的总人数）。`,
              `6、 超过平均持有量的账户持股比例：超过平均持有量账户的总持股量/流通股本。`,
              `7、 超过平均持有量的账户数比例：超过平均持有量的总人数/总持股人数。`,
              `8、 流通股本：取自股本结构信息的“A股流通股”。`,
              `9、 持有账户数：取自闭市后持仓。`,
              `10、 平均持有量：取自闭市后持仓。`,
              `11、 超过平均持有量的账户持股数：通过闭市后持仓计算。`,
              `12、 超过平均持有量的账户数：通过闭市后持仓计算。`,
              `13、 成交金额：取自行情的成交金额。`,
              `14、 成交笔数：取自每日成交明细，不含大宗交易。`,
              `15、 基尼系数：1 - ∑(账户持有量*账户持有量名次) / (流通股本*(1+持股人数) / 2)，名次为按持股倒序排列。`
            ]
          }
        ],
        tableColumns,
        defaultTradeDate: '',
        commonData: { // 证券代码
          disabled: false,
          stockCode: ''
        },
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        totalNum: 0,
        currentngspUid: '',
        searchForm: {
          secCode: '',
          searchDate: [],
          startDate: '',
          endDate: ''
        },
        searchedFormData: {
          secCode: '', // 600004
          searchDate: [],
          startDate: '', // 20141201
          endDate: '' // 20141230
        },
        loading: false,
        tableData: [],
        pickerOption: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        breadcrumbItems: [{
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '综合查询'
        }, {
          router: '/abnormFluctuateAnalysis',
          label: '异常波动分析'
        }, {
          router: '/equityConcentrationAnalysis',
          label: '股权集中度分析'
        }],
        rules: {}
      }
    },
    methods: {
      getStockCode(stockCodeData, type, code, stockSubType) {
        this.searchForm.secCode = stockCodeData.split(' ')[0]
        this.$refs[`searchForm`].validateField('secCode')
      },
      handlePaginationChange (pagination) {
        this.pagination = pagination
        this.reqEquityConcentrationAnalysis(0)
      },
      handleExportData (type) {
        if (!this.currentngspUid && this.tableData.length < 1) {
          this.$message.error('暂无数据')
          return
        }
        let params = {
          exportType: type,
          isExport: 1,
          isNewQuery: 0, // 判断是否是新查询,1是新查询，0是分页或导出
          ngspUid: this.currentngspUid, // this.currentngspUid,
          tableColumns: this.tableColumns
        }
        exportEquityConcentrationAnalysis(params)
      },
      handleClear () {
        this.searchForm = {
          searchDate: [this.defaultTradeDate, this.defaultTradeDate],
          startDate: this.defaultTradeDate,
          endDate: this.defaultTradeDate,
          secCode: ''
        }
        this.commonData.stockCode = ''
      },
      handleQuery () {
        this.$refs['searchForm'].validate(valid => {
          if (valid) {
            this.searchedFormData = JSON.parse(JSON.stringify(this.searchForm))
            this.pagination.currentPage = 1
            this.reqEquityConcentrationAnalysis(1)
          }
        })
      },
      formatTagetDate (date) {
        return date.replace(/-/g, '')
      },
      reqEquityConcentrationAnalysis (type) {
        let params = {
          pageIndex: this.pagination.currentPage,
          pageRows: this.pagination.pageSizeNumber,
          ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
          isExport: 0, // 1代表导出报表
          exportType: '', // excel,csv
          isNewQuery: type, // 判断是否是新查询,1是新查询，0是分页或导出
          secCode: type === 1 ? this.searchForm.secCode : this.searchedFormData.secCode, // '600004',
          startDate: type === 1 ?
            this.searchForm.searchDate && this.searchForm.searchDate.length ? this.searchForm.searchDate[0] : this.defaultTradeDate :
            this.searchedFormData.searchDate && this.searchedFormData.searchDate.length ? this.searchedFormData.searchDate[0] : this.defaultTradeDate, // '20141201'
          endDate: type === 1 ?
            this.searchForm.searchDate && this.searchForm.searchDate.length ? this.searchForm.searchDate[1] : this.defaultTradeDate :
            this.searchedFormData.searchDate && this.searchedFormData.searchDate.length ? this.searchedFormData.searchDate[1] : this.defaultTradeDate // '20141230'
        }
        this.loading = true
        /* 处理status=500的情况 */
        /* setTimeout(() => {
         this.loading = false
         }, 5000) */
        postEquityConcentrationAnalysis(params).then(resp => {
          this.loading = false
          if (resp && resp.data) {
            const {data, totalRowCount} = resp
            this.currentngspUid = resp.ngsp_uid
            this.tableData = data
            this.totalNum = Number(totalRowCount)
          } else {
            this.currentngspUid = ''
            this.tableData = []
            this.totalNum = 0
          }
        })
      }
    },
    mounted () {
      /* 缺省为T-1个交易日 */
      getRelativeTradeDate(-1).then(resp => {
        this.defaultTradeDate = dateStringAddSeparator(resp)
        const {secCode} = this.$route.query
        this.searchForm = {
          secCode: secCode || '',
          searchDate: [this.defaultTradeDate, this.defaultTradeDate],
          startDate: this.defaultTradeDate,
          endDate: this.defaultTradeDate
        }
        if (secCode) {
          this.$nextTick(() => {
            this.reqEquityConcentrationAnalysis(1)
          })
          this.commonData.stockCode = secCode
        }
      })
    }
  }
</script>
<style lang='less' scoped>
  .equityConcentrationAnalysis {
    .el-card {
      width: 100%;
      .el-form {
        width: 100%;
      }
    }
  }
</style>
