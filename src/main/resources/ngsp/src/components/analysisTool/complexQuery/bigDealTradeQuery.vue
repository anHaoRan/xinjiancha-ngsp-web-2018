<template>
  <div class='big-deal-trade-container'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card class='big-deal-trade-query-area'>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size='small' type='info' @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>
      <el-row>
        <el-form label-width='100px' :model="formData" :rules="rules" :inline='true' ref='bigDealTradeForm'>
          <el-col :xl='6' :lg='8' :md='8' :sm='12'>
            <el-col>
              <el-form-item label='开始日期：' prop='startDate'>
                <el-date-picker
                  v-model='formData.startDate'
                  type='date'
                  placeholder='请选择开始日期'
                  :picker-options='pickerOption'
                  size='small'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label='结束日期：' prop='endDate'>
                <el-date-picker
                  v-model='formData.endDate'
                  type='date'
                  placeholder='请选择结束日期'
                  :picker-options='pickerOption'
                  size='small'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label='证券代码：'>
                <stock-code-query :commonData='commonData' @getStockCode='getStockCode'></stock-code-query>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :xl='6' :lg='8' :md='8' :sm='12'>
            <el-form-item label='账户代码：'>
              <account-code
                ref="accountRefBig"
                :codeType="`account`"
                :uploadParams="{
                parseRule: JSON.stringify({
                      verifies: ['ACCOUNT_CODE']
                    })
                }"
                @getTextareaCodeList="getAccountListFunc"></account-code>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-card>
      <export-btn @handleExportData="handleDownload"></export-btn>
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
    </el-card>
  </div>
</template>

<script>
import { getBigDealTrade } from '../../../service/analysisTool/complexQuery/index'
import { selfValidateMethod } from './componentsTool/common/validate'
import { columns } from './componentsTool/bigDealTradeQuery/columns'
import moment from 'moment'

export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    StockCodeQuery: () => import('../../common/StockCodeQuery'),
    commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
    AccountCode: () => import('./componentsTool/common/TextAreaCodesAndUploadComponent'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
  },
  data() {
    return {
      statisticCaliber: [{
        title: '大宗交易查询',
        content: [
          '1.\t统计时仅包含大宗交易的成交数据，不含竞价系统、固收平台、大宗专场及其它系统的成交数据。',
          '2.\t结果列表中的“会员营业部名称”字段由“会员名称”和“营业部名称”拼接而成，如：“中国国际金融有限公司北京建国门外大街证券营业部”。在统计时，该字段的值取自大宗交易系统提供给数据仓库成交明细数据中的“会员营业部名称”，即与www.sse.com.cn网站公布的大宗交易成交信息中公开披露的“会员营业部名称”相同。',
          '3.\t同一个成交编号只输出一行，同时输出买方和卖方。'
        ]
      }
      ],
      commonData: { // 证券代码
        disabled: false,
        stockCode: ''
      },
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
        secCode: 'ALL', // 证券代码
        acctIds: 'ALL' // 账户代码
      },
      tableData: [],
      columns: columns,
      rules: {
        startDate: [
          {required: true, message: '请选择开始日期'}
        ],
        endDate: [
          {required: true, message: '请选择结束日期'}
        ]
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      breadcrumbItems: [
        {
          router: '/analysisTool',
          label: '分析工具'
        }, {
          router: '/complexQuery',
          label: '综合查询'
        }, {
          router: '/bigDealTradeQuery',
          label: '大宗交易查询'
        }
      ],
    }
  },
  methods: {
    getAccountListFunc(data) {
      this.formData.acctIds = data
    },
    getStockCode(stockCodeData, type, code, stockSubType) {
      stockCodeData ? this.formData.secCode = stockCodeData.split(' ')[0] : this.formData.secCode = 'ALL'
    },
    clearForm() {
      this.$refs[`accountRefBig`].clearCodeList()
      this.commonData.stockCode = ''
      this.formData = {
        startDate: '',
        endDate: '',
        secCode: 'ALL', // 证券代码
        acctIds: 'ALL' // 账户代码
      }
    },
    handleSearch() {
      let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
      let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
      if (sDate > eDate + 60 * 60 * 1000) {
        this.$message.error('开始日期不得大于结束日期')
        return
      }
      this.$refs['bigDealTradeForm'].validate((valid) => {
        if (valid) {
          if (this.formData.acctIds !== 'ALL') {
            // 批量校验证券代码格式
            if (!selfValidateMethod({accounts: this.formData.acctIds})) {
              return
            }
          }
          this.queryData = JSON.parse(JSON.stringify(this.formData))
          this.pagination.currentPage = 1
          this.reqTableData(1)
        }
      })
    },
    reqTableData(type) {
      let params = {
        startDate: type ? this.formData.startDate : this.queryData.startDate,
        endDate: type ? this.formData.endDate : this.queryData.endDate,
        secCode: type ? this.formData.secCode ? this.formData.secCode : 'ALL' : this.queryData.secCode ? this.queryData.secCode : 'ALL',
        acctIds: type ? this.formData.acctIds ? this.formData.acctIds : 'ALL'  : this.queryData.acctIds ? this.queryData.acctIds : 'ALL',
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
      getBigDealTrade(params).then((resp) => {
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
    handlePaginationChange(pagination) {
      this.pagination = pagination
      this.reqTableData(0)
    },
    handleDownload(type) { // 下载
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
      this.gfnExportFileWithForm('/complexqry/bigDealTradeQuery/v1/bigDealTradeQuery/export', params)
    }
  }
}
</script>

<style lang="less">
  .big-deal-trade-container {
  }
</style>
