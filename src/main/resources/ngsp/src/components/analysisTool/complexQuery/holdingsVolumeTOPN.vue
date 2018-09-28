<!-- 持有N(TOPN)以上账户 -->
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
        <el-form label-width='100px' :model="formData" :inline='true' ref="holdingTOPNForm" :rules="rules">
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
                <el-form-item label='查询指标：' prop='selType'>
                  <el-radio-group v-model='formData.selType'>
                    <el-radio :label='1' >持有量</el-radio>
                    <el-radio :label='2'>排名</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xl='12' :lg='12' :md='12' :sm='12'>
                <el-form-item label='持股属性：' prop='holdType'>
                  <el-select v-model='formData.holdType' clearable placeholder='请选择'  size='small'>
                    <el-option label='非限售持股' value='1'>非限售持股</el-option>
                    <el-option label='总持股' value='2'>总持股</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl='12' :lg='12' :md='12' :sm='12'>
                <el-form-item label='数值(N)：' prop='topN'>
                  <el-input v-model='formData.topN' size='small'></el-input>
                </el-form-item>
              </el-col>
          </el-col>
          <el-col :xl='10' :lg='10' :md='10' :sm='10'>
            <stock-code
              :ref='`holdingVolumeTOPNStock`'
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
import { postholdingsVolumeTopN } from '@/service/analysisTool/complexQuery/index'
import { columns } from './componentsTool/holdingsVolumeTOPN/columns'
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
          title: '持有N（TOPN）以上账户',
          content: [
            '1.\t股东代码、股东简称、证件号码：来源zqzh1yyyymmdd001.txt。',
            '2.\t证券代码、证券简称：来源show2003.dbf以及ZQ_CJHQyyyymmdd.txt。',
            '3.\t非限售股持有量：统计T日清算后持仓即为T日非限售股持有量，股票、基金数据来源se001zqccyyyymmdd001.txt；债券数据来源se001zqccyyyymmdd001.txt以及GDSYyyyymmdd.tgz。',
            '4.\t限售股持有量：统计T日非流通持有量（数据仓库没有B股非流通持有数据,另非流通持有数据起于2010年底，更早之前此应用无法提供），数据来源fltg1yyyymmdd001.txt。',
            '5.\t总持股数量：非限售股持有量 + 限售股持有量。',
            '6.\t非限售股持有数量占流通股比例：T日该账户非限售股持有量 / T日所有账户非限售股持有量 * 100。',
            '7.\t总持股数量占总股本比例：T日该账户总持股数量/ T日所有账户总持股数量 * 100。'
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
        selType: '', // 查询指标
        holdType: '' // 持股属性
      },
      tableData: [],
      columns: columns,
      rules: {
        startDate: [{required: true, message: '请选择开始日期'}],
        endDate: [{required: true, message: '请选择结束日期'}],
        selType: [{required: true, message: '请选择查询指标'}],
        holdType: [{required: true, message: '请选择持股属性'}],
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
          router: '/holdingsVolumeTOPN',
          label: '持有N(TOPN)以上账户'
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
      this.$refs['holdingTOPNForm'].validateField('secType')
    },
    getStockCode(data) {
      this.formData.secCodes = data
      this.$refs['holdingTOPNForm'].validateField('secCodes')
    },
    clearForm() {
      this.$refs[`holdingVolumeTOPNStock`].clearStockCodes()
      this.formData.startDate = this.initData.start
      this.formData.endDate = this.initData.end
      this.formData.secCodes = ''
      this.formData.topN = ''
      this.formData.selType = ''
      this.formData.holdType = ''
    },
    warnMsg(value) {
      this.$message({
        showClose: true,
        message: value,
        type: 'warning'
      })
    },
    handleSearch() { // 查询按钮
      let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
      let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
      if (sDate > eDate + 60 * 60 * 1000) {
        this.$message.error('开始日期不得大于结束日期')
        return
      }
      this.$refs['holdingTOPNForm'].validate((valid) => {
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
        selType: type ? this.formData.selType : this.queryData.selType,
        holdType: type ? this.formData.holdType : this.queryData.holdType,
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
      postholdingsVolumeTopN(params).then((resp) => {
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
        selType: this.queryData.selType.toString(),
        holdType: this.queryData.holdType.toString(),
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: this.columns
      }
      this.gfnExportFileWithForm('/complexqry/account/v1/topn/accounthold/export', params)
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
