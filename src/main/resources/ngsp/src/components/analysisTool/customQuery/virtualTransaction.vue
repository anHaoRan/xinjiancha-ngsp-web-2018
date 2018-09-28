<template>
  <div class="virtualTransaction">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="200px"
               style="margin-top: 20px">
        <el-row>
          <el-form-item label="日期：" prop="virtualDate" class="form-inline" style="vertical-align: top;">
            <el-date-picker
              v-model="ruleForm.virtualDate"
              type="date"
              placeholder="请选择日期"
              size="small">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="证券代码：" prop="stockCode" class="form-inline">
            <stock-code-query :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <s-table
      ref="marginTable"
      :columns="columns"
      :data="tableData"
      @getPageination="getPageination">
      <el-dropdown @command="handleDownload" slot="elCardHeader">
        <el-button type="primary" size="mini" :disabled="isAbled">
          导出<i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="xlsx">导出为EXCEL</el-dropdown-item>
          <el-dropdown-item command="csv">导出为CSV</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </s-table>
  </div>
</template>

<script>
  import {postVirtualTransaction} from '../../../service/analysisTool/customQuery/index'
  import {getRelativeTradeDate} from '../../../service/common/commonFunc'
  import moment from 'moment'
  import breadcrumb from '../../../components/common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'

  export default {
    components: {
      breadcrumb,
      StockCodeQuery,
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '/analysisTool',
            label: '分析工具'
          }, {
            router: '/dimensionTable',
            label: '自定义查询'
          }, {
            router: '/virtualTransaction',
            label: '集合竞价虚拟交易'
          }
        ],
        commonData: {
          disabled: false,
          stockCode: ''
        },
        ruleForm: {
          virtualDate: ''
        },
        rules: {
          virtualDate: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          stockCode: [
            {required: true, message: '请输入证券代码', trigger: 'change'}
          ]
        },
        tableData: {data: [], total: 0, pageIndex: 1, pageRows: 10},
        columns: [
          {label: '股票代码', field: 'sec_code', align: 'left', width: '100'},
          {label: '日期', field: 'start_date', align: 'left', width: '100'},
          {label: '时间', field: 'entry_time', align: 'left', width: '100', sortable: true},
          {label: '虚拟成交价（元）', field: 'v_price', align: 'right', width: '100'},
          {label: '虚拟成交量（股）', field: 'v_vol', align: 'right', width: '100'}
        ],
        isAbled: true,
        pageFlag: false,
        defaultDate: '',
        qryId: ''
      }
    },
    methods: {
      handleQueryData(qryId, isNewQuery, pageIndex, pageRows) {
        this.isAbled = true
        this.showOrHideLoading(true)
        let params = {
          qryId: qryId,
          startDate: moment(this.ruleForm.virtualDate).format('YYYYMMDD'),
          stkCode: this.ruleForm.stockCode,
          pageIndex: pageIndex,
          pageRows: pageRows,
          isNewQuery: 1,
          isExport: '0'
        }
        postVirtualTransaction(params).then((resp) => {
          if (resp.res.res1) {
            this.tableData.data = resp.res.res1
            this.tableData.total = parseInt(resp.cnt.res1Cnt)
          }
          this.qryId = resp.qryId
          this.isAbled = false
          this.showOrHideLoading(false)
        })
      },
      getPageination(page) {
        if (this.pageFlag) {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.tableData.pageIndex = page.currentPage
              this.tableData.pageRows = page.pageSizeNumber
              this.handleQueryData(this.qryId, 1, page.currentPage, page.pageSizeNumber)
            } else {
              this.$message.error('查询失败！请补全查询参数~')
            }
          })
        }
      },
      showOrHideLoading(flag) {
        this.$refs.marginTable.showOrHideLoading(flag)
      },
      getStockCode(stockCodeData, type, code, stockSubType) {
        this.ruleForm.stockCode = stockCodeData.split(' ')[0]
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.pageFlag = true
            this.handleQueryData('', 1, this.tableData.pageIndex, this.tableData.pageRows)
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.isAbled = true
        this.commonData.disabled = false
        this.commonData.stockCode = ''
        this.ruleForm.virtualDate = this.defaultDate
      },
      handleDownload(fileType) {
        this.$message.info('正在导出，请稍等~')
        let params = {
          qryId: this.qryId,
          startDate: moment(this.ruleForm.virtualDate).format('YYYYMMDD'),
          stkCode: this.ruleForm.stockCode,
          isExport: 1,
          resType: 'ALL',
          fileType: fileType,
          tableColumns: [
            {sheetName: '集合竞价虚拟交易', fileColumns: this.columns}
          ]
        }
        this.gfnExportFileWithForm('/specialqry/speclqry/v1/assem-bid-price-export', params)
      }
    },
    mounted() {
      getRelativeTradeDate(-1).then((resp) => {
        this.defaultDate = moment(resp).format('YYYY-MM-DD')
        this.ruleForm.virtualDate = this.defaultDate
      })
    }
  }
</script>

<style lang="less" scoped>
  .virtualTransaction {
    .form-inline {
      display: inline-block;
    }
  }
</style>
