<template>
  <div>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size='small' type='info'  @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-row>
        <el-form label-width='100px' :model="formData" :inline='true' ref="tradingVolumeTOPNForm" :rules="rules">
          <el-col :xl='14' :lg='14' :md='14' :sm='14'>
            <el-col :xl='12' :lg='12' :md='12' :sm='12'>
              <el-form-item label='开始日期：' prop='startDate'>
                <el-date-picker
                  v-model='formData.startDate'
                  type='date'
                  placeholder='请选择开始日期'
                  :picker-option='datePicker'
                  size='small'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl='12' :lg='12' :md='12' :sm='12'>
              <el-form-item label='结束日期：' prop='endDate'>
                <el-date-picker
                  v-model='formData.endDate'
                  type='date'
                  placeholder='请选择结束日期'
                  :picker-option='datePicker'
                  size='small'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl='12' :lg='12' :md='12' :sm='12'>
              <el-form-item label='筛选方式：' prop='topType'>
                <el-radio-group v-model='formData.topType'>
                  <el-radio :label='0'>交易量>N</el-radio>
                  <el-radio :label='1'>前N名</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xl='12' :lg='12' :md='12' :sm='12'>
              <el-form-item label='数值(N)：' prop='topN'>
                <el-input v-model='formData.topN' size='small'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='12' :lg='12' :md='12' :sm='12'>
              <el-form-item label=' '>
                <el-checkbox label='分日统计' v-model='formData.isDaily'></el-checkbox>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :xl='10' :lg='10' :md='10' :sm='10'>
            <stock-code
                :ref='`tradingVolumeTOPNStock`'
                @getStockCode='getStockCode'
                @handleSecTypeAndChosenTypeListChange='chosenSecType'
              ></stock-code>
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
import moment from 'moment'
import { postTradeVolumeTopN } from '@/service/analysisTool/complexQuery/index'
import { columns } from './componentsTool/tradingVolumeTOPN/columns'
// 获取交易日偏移
import {getRelativeTradeDate} from '@/service/common/commonFunc'
import {selfValidateMethod} from './componentsTool/common/validate'
export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
    StockCode: () => import('./componentsTool/common/StockCodesUploadAndSecTypeSelectComponent'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
  },
  data() {
    let checkTopN = (rule, value, callback) => {
      let patt = /^[0-9]*$/g
      if(value.length > 10) return callback('长度不能超过10')
      if (!value || !patt.test(value)) return callback('请输入整数数值')
      callback()
    }
    return {
      statisticCaliber: [
        {
          title: '交易量N以上（TOPN）的账户',
          content: [
            '1.\t查询证券含A股、基金、债券，交易数据含竞价系统、大宗交易系统成交数据。',
            '2.\t股东账户、股东姓名：来源zqzh1yyyymmdd001.txt。',
            '3.\t证券代码、证券简称：来源show2003.dbf以及se001cjrzyyyymmdd001.log。',
            '4.\t对于同一只股票，分别取满足买、卖成交数量大于N（股票：股，债券：手，基金：份）或者买、卖成交数量分别排前N名的账户, 然后按“买入数量”（或“卖出数量”）从大到小排名, 最后将这两个排名合并展示,即相同的买入排名账户和卖出排名账户展示在同一行中。',
            '5.\t股票的数量单位为“股”，基金的数量单位为“份”，债券的数量单位为“手”。',
            '6.\t交易营业部：该股东账户所指定席位所在的营业部，如果某股东账户在查询的日期范围内做了转指定，则在按日期上钻汇总的时候，显示交易营业部为股东账户日期范围内最后所在的营业部。',
            '7.  买入均价 = SUM(买入金额) / SUM(买入数量)。'
          ]
        }
      ],
      initData: {
        start: '',
        end: ''
      },
      datePicker: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      currentngspUid: '', // 用来记录上一次返回的ngspUid
      loading: false,
      totalNum: 0,
      pagination: {
        currentPage: 1,
        pageSizeNumber: 10
      },
      queryData: {},
      formData: { // 查询参数
        startDate: '',
        endDate: '',
        secType: 0, // 统计对象
        secCodes: '', // 证券代码
        topN: '', // 买卖成交量
        topType: 0, // 筛选类型
        isDaily: true // 分日统计
      },
      tableData: [],
      columns: columns,
      rules: {
        startDate: [{required: true, message: '请选择开始日期'}],
        endDate: [{required: true, message: '请选择结束日期'}],
        topType: [{required: true, message: '请选择筛选方式'}],
        topN: [{validator: checkTopN}]
      },
      breadcrumbItems: [
        {
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '数据综合查询'
        }, {
          router: '/tradingVolumeTOPN',
          label: '交易量N(TOPN)以上账户'
        }]
    }
  },
  methods: {
    chosenSecType(secType, chosenTypeListString) {
      this.secTypeAll = secType
      if (secType) {
        this.formData.secType = chosenTypeListString
      } else {
        this.formData.secType = secType
      }
      /* 校验证券大类 */
      this.$refs['tradingVolumeTOPNForm'].validateField('secType')
    },
    getStockCode(data) {
      this.formData.secCodes = data
      this.$refs['tradingVolumeTOPNForm'].validateField('secType')
    },
    clearForm() {
      this.$refs[`tradingVolumeTOPNStock`].clearStockCodes()
      this.formData.startDate = this.initData.start
      this.formData.endDate = this.initData.end
      this.formData.secCodes = ''
      this.formData.topN = ''
      this.formData.topType = 0
      this.formData.isDaily = true
    },
    handleSearch() { // 查询按钮
      let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
      let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
      if (sDate > eDate + 60 * 60 * 1000) {
        this.$message.error('开始日期不得大于结束日期')
        return
      }
      this.$refs['tradingVolumeTOPNForm'].validate((valid) => {
        if (valid) {
          if (!selfValidateMethod({stocks: this.formData.secCodes})) { /* 批量校验证券代码格式 */
            return
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
        secCodes: type ? (this.formData.secType ? '' : this.formData.secCodes) : this.queryData.secCodes, // 证券代码集合
        secType: type ? this.formData.secType : this.queryData.secType,
        topN: type ? this.formData.topN : this.queryData.topN,
        topType: type ? this.formData.topType : this.queryData.topType,
        isDaily: type ? this.formData.isDaily ? 1: 0 : this.queryData.isDaily ? 1: 0 ,
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
      postTradeVolumeTopN(params).then((resp) => {
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
    // 处理导出表格数据
    handleDownload(type) {
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let params = {
        exportType: type,
        topN: this.queryData.topN.toString(),
        topType: this.queryData.topType.toString(),
        isDaily: this.queryData.isDaily ? "1": "0",
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: this.columns
      }
      this.gfnExportFileWithForm('/complexqry/account/v1/topn/accountvolume/export', params)
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
</style>
