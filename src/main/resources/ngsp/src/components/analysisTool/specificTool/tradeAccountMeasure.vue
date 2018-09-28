<template>
  <div class="tradeAccountMeasure">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" size="small"
               style="margin-top: 20px">
        <el-row>
          <el-form-item label="起止时间：" prop="anasyDate" class="form-inline" style="vertical-align: top;">
            <s-date-picker
              v-model="ruleForm.anasyDate"
              :is-range="true"
              type="date"
              startPlaceholder="请选择开始日期"
              endPlaceholder="请选择结束日期"></s-date-picker>
          </el-form-item>
          <el-form-item label="证券代码：" prop="stockCode" class="form-inline">
            <stock-code-query :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="可疑账户：" prop="suspiciousAccount">
            <el-input
              v-model="ruleForm.suspiciousAccount"
              class="textarea"
              type="textarea"
              :autosize="{ minRows:1,maxRows:2 }"
              placeholder="多个代码以英文逗号隔开"></el-input>
            <file-upload
              ref="upload"
              class="form-inline"
              :isShowSuccessMessage="true"
              :actionUrl="gfnGetUploadFlatReturnBasicUrl()"
              @getTxtCon="setFileData"
              :uploadOption="{size: 'small',type: 'primary',name: '上传 Txt'}"
              :uploadParams="{parseRule: JSON.stringify({delimiter: ','})}"></file-upload>
            <el-tag :type="uploadStatus" style="margin: 0 10px"> {{ uploadText }}</el-tag>
            <el-button
              class="form-inline"
              @click="downloadExcelMould"
              size="small"
              type="primary">下载模板</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <s-table
      ref="marginTable"
      :columns="columns"
      :data="tableData"
      @getPageination="getPageination">
      <el-button slot="elCardHeader" type="info" @click="handleDownload" :disabled="isAbled" size="small">导出</el-button>
      <el-tabs slot="tableHeader" v-model="activeName" @tab-click="changeTable">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.key"
          :label="item.label"
          :name="item.name">
        </el-tab-pane>
      </el-tabs>
    </s-table>
  </div>
</template>

<script>
  // 获取交易日偏移
  import {getRelativeTradeDate} from '../../../service/common/commonFunc'
  import {postTradeAccountMeasure} from '../../../service/analysisTool/specificTool/index'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import FileUpload from '@/components/common/textUpload'
  import breadcrumb from '../../../components/common/Breadcrumb'
  import moment from 'moment'
  import SDatePicker from '../../base/SDatePicker'

  export default {
    components: {
      SDatePicker,
      breadcrumb,
      StockCodeQuery,
      FileUpload,
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
            label: '特定工具'
          }, {
            router: '/tradeAccountMeasure',
            label: '内幕交易数据测算'
          }
        ],
        commonData: {
          disabled: false,
          stockCode: ''
        },
        ruleForm: {
          anasyDate: '',
          suspiciousAccount: ''
        },
        rules: {
          anasyDate: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          suspiciousAccount: [
            {required: true, message: '请上传可疑账户附件', trigger: 'change'}
          ],
          stockCode: [
            {required: true, message: '请输入证券代码', trigger: 'change'}
          ]
        },
        suspiciousAccountList: [],
        isAbled: true,
        defaultDate: '',
        pageFlag: false,
        uploadText: '未上传',
        uploadStatus: 'danger',
        qryId: '',
        activeName: 'tablepan1',
        tableData: {},
        columns: [],
        tabList: [
          {label: '内幕交易测算数据表', name: 'tablepan1'},
          {label: '嫌疑账户近一年交易明细表', name: 'tablepan2'}
        ],
        table: {
          theadList1: [
            {label: '证券代码', field: 'stock_code', align: 'left', width: '120', sortable: true},
            {label: '证券简称', field: 'stock_name', align: 'left', width: '120'},
            {label: '起始日期', field: 'start_date', align: 'left', width: '120', sortable: true},
            {label: '截止日期', field: 'end_date', align: 'right', width: '120'},
            {label: '股东代码', field: 'account_code', align: 'right', width: '120', sortable: true},
            {label: '股东姓名', field: 'account_name', align: 'right', width: '120'},
            {label: '近一年最早买入日期', field: 'min_buy_date', align: 'right', width: '160'},
            {label: '近一年最晚买入日期', field: 'max_buy_date', align: 'right', width: '160'},
            {label: '期初市值', field: 'hold_value_s', align: 'right', width: '120'},
            {label: '期初持股', field: 'hold_volume_s', align: 'right', width: '120'},
            {label: '期末市值', field: 'hold_value_s1', align: 'right', width: '120'},
            {label: '期末持股', field: 'hold_volume_s1', align: 'right', width: '120'},
            {label: '买入股数', field: 'trade_buy_volume_sec', align: 'right', width: '120'},
            {label: '买入资金', field: 'trade_buy_value_sec', align: 'right', width: '120'},
            {label: '卖出股数', field: 'trade_sale_volume_sec', align: 'right', width: '120'},
            {label: '卖出资金', field: 'trade_sale_value_sec', align: 'right', width: '120'},
            {label: '净买卖股数', field: 'net_buy_volume', align: 'right', width: '120'},
            {label: '净买卖额', field: 'net_buy_value', align: 'right', width: '120'},
            {label: '期初总持股市值', field: 'hold_value_s2', align: 'right', width: '120'},
            {label: '期末总持股市值', field: 'hold_value_s3', align: 'right', width: '120'},
            {label: '停牌前该股市值占比%', field: 'hold_ratio_e', align: 'right', width: '160'},
            {label: '主动买盘占比%', field: 'init_buy_ratio', align: 'right', width: '140'},
            {label: '期初持股品种数', field: 'count_s', align: 'right', width: '140'},
            {label: '期末持股品种数', field: 'count_s1', align: 'right', width: '140'},
            {label: '期间买入品种数', field: 'sec_buy_counts', align: 'right', width: '140'},
            {label: '买入金额占比%', field: 'trade_buy_ratio', align: 'right', width: '140'},
            {label: '近一年买入金额占比%', field: 'trade_buy_ratio_year', align: 'right', width: '160'}
          ],
          theadList2: [
            {label: '交易日期', field: 'trading_date', align: 'left', width: '120', sortable: true},
            {label: '股东代码', field: 'account_code', align: 'left', width: '120', sortable: true},
            {label: '股东姓名', field: 'account_name', align: 'left', width: '120'},
            {label: '营业部名称', field: 'mem_branch_name', align: 'left', width: '120'},
            {label: '证券代码', field: 'stock_code', align: 'left', width: '120', sortable: true},
            {label: '证券简称', field: 'stock_name', align: 'left', width: '120'},
            {label: '买入股数（股）', field: 'trade_buy_volume', align: 'right', width: '120'},
            {label: '买入资金（元）', field: 'trade_buy_value', align: 'right', width: '120'},
            {label: '买入均价（元）', field: 'trade_buy_price', align: 'right', width: '120'},
            {label: '卖出股数（股）', field: 'trade_sale_volume', align: 'right', width: '120'},
            {label: '卖出资金（元）', field: 'trade_sale_value', align: 'right', width: '120'},
            {label: '卖出均价（元）', field: 'trade_sale_price', align: 'right', width: '120'}
          ],
          data1: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data2: {data: [], total: 0, pageIndex: 1, pageRows: 10}
        }
      }
    },
    methods: {
      // 查询
      handleQueryData(qryId, isNewQuery, pageIndex, pageRows, resType) {
        this.isAbled = true
        this.showOrHideLoading(true)
        let params = {
          qryId: qryId,
          checkStartDate: moment(this.ruleForm.anasyDate[0]).format('YYYYMMDD'),
          checkEndDate: moment(this.ruleForm.anasyDate[1]).format('YYYYMMDD'),
          stkCode: this.ruleForm.stockCode,
          acctArr: this.ruleForm.suspiciousAccount,
          pageIndex: pageIndex,
          pageRows: pageRows,
          isNewQuery: isNewQuery,
          isExport: '0',
          resType: resType
        }
        postTradeAccountMeasure(params).then(resp => {
          if (resp.res.resByDtl) {
            this.table.data1.data = resp.res.resByDtl
            this.table.data1.total = Number(resp.cnt.resByDtlCnt)
          }
          if (resp.res.resByYear) {
            this.table.data2.data = resp.res.resByYear
            this.table.data2.total = Number(resp.cnt.resByYearCnt)
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
              let resType = ''
              switch (this.activeName) {
                case 'tablepan1':
                  resType = 'resByDtl'
                  this.table.data1.pageIndex = page.currentPage
                  this.table.data1.pageRows = page.pageSizeNumber
                  break
                case 'tablepan2':
                  resType = 'resByYear'
                  this.table.data2.pageIndex = page.currentPage
                  this.table.data2.pageRows = page.pageSizeNumber
                  break
              }
              this.handleQueryData(this.qryId, 0, page.currentPage, page.pageSizeNumber, resType)
            } else {
              this.$message.error('查询失败！请补全查询参数~')
            }
          })
        }
      },
      showOrHideLoading(flag) {
        this.$refs.marginTable.showOrHideLoading(flag)
      },
      changeTable(tab) {
        switch (tab.name) {
          case 'tablepan1':
            this.columns = this.table.theadList1
            this.tableData = this.table.data1
            break
          case 'tablepan2':
            this.columns = this.table.theadList2
            this.tableData = this.table.data2
            break
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.pageFlag = true
            let pageIndex = 1, pageRows = 10
            if (this.activeName === 'tablepan1') {
              pageIndex = this.table.data1.pageIndex
              pageRows = this.table.data1.pageRows
            } else {
              pageIndex = this.table.data2.pageIndex
              pageRows = this.table.data2.pageRows
            }
            this.handleQueryData(this.qryId, 1, pageIndex, pageRows, 'ALL')
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
      },
      // 模糊搜索
      getStockCode(stockCodeData, type, code, stockSubType) {
        this.ruleForm.stockCode = stockCodeData.split(' ')[0]
      },
      setFileData(val) {
        if (val && val.length) {
          this.suspiciousAccountList = val
          this.accountChange()
          this.uploadText = '已上传';
          this.uploadStatus = 'success';
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.suspiciousAccountList = []
        this.commonData.disabled = false
        this.commonData.stockCode = ''
        this.isAbled = true
        this.uploadText = '未上传';
        this.uploadStatus = 'danger';
        this.ruleForm.anasyDate = this.defaultDate
      },
      handleDownload() {
        this.$message.info('正在导出，请稍等~')
        let params = {
          checkStartDate: moment(this.ruleForm.anasyDate[0]).format('YYYYMMDD'),
          checkEndDate: moment(this.ruleForm.anasyDate[1]).format('YYYYMMDD'),
          stkCode: this.ruleForm.stockCode,
          acctArr: this.ruleForm.suspiciousAccount,
          isExport: '1',
          resType: 'ALL',
          fileType: 'xlsx',
          tableColumns: [
            {sheetName: '内幕交易测算数据表', fileColumns: this.table.theadList1},
            {sheetName: '嫌疑账户近一年交易明细表', fileColumns: this.table.theadList2}
          ]
        }
        this.gfnExportFileWithForm('/specialqry/speclqry/v1/account-testing-export', params)
      },
      downloadExcelMould() {
        this.gfnDownloadTemplateFile({ code: 'tradeAccountMeasure' })
      },
      accountChange() {
        let acclist = ''
        for (let item of this.suspiciousAccountList) {
          acclist += item + ','
        }
        acclist = acclist.substr(0, acclist.length - 1)
        this.ruleForm.suspiciousAccount = acclist
      }
    },
    mounted() {
      //  默认展示第一个标签页
      this.columns = this.table.theadList1
      this.tableData = this.table.data1
      getRelativeTradeDate(-1).then(resp => {
        this.defaultDate = [moment(resp).format('YYYY-MM-DD'), moment(resp).format('YYYY-MM-DD')]
        this.ruleForm.anasyDate = this.defaultDate
      })
    }
  }
</script>

<style lang="less" scoped>
  .tradeAccountMeasure {
    .form-inline {
      display: inline-block;
    }
    .textarea{
      width: 24%;
      vertical-align: top;
    }
  }
</style>
