<template>
  <div class="shortTradeRegularScreening">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" size="small"
               style="margin-top: 20px">
        <el-form-item label="起止日期：" prop="shortDate" class="form-inline">
          <s-date-picker
            v-model="ruleForm.shortDate"
            :is-range="true"
            type="date"
            startPlaceholder="请选择开始日期"
            endPlaceholder="请选择结束日期"></s-date-picker>
        </el-form-item>
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
  import breadcrumb from '../../../components/common/Breadcrumb'
  import SDatePicker from '../../base/SDatePicker'
  import moment from 'moment'
  import {getRelativeTradeDate} from '../../../service/common/commonFunc'
  import {postShortTradeScreening} from '../../../service/analysisTool/specificTool/index'

  export default {
    components: {
      SDatePicker,
      breadcrumb,
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        ruleForm: {
          shortDate: []
        },
        rules: {
          shortDate: [
            {required: true, message: '请选择起始日期', trigger: 'change'}
          ]
        },
        isAbled: true,
        pageFlag: false,
        defaultDate: '',
        qryId: '', // qry_test_001
        breadcrumbItems: [
          {
            router: '/analysisTool',
            label: '分析工具'
          }, {
            router: '/dimensionTable',
            label: '特定工具'
          }, {
            router: '/shortTradeRegularScreening',
            label: '短线交易定期筛查'
          }
        ],
        setDateDisabled: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        activeName: 'tablepan1',
        tableData: {},
        columns: [],
        tabList: [
          {label: '涉嫌短线交易的账户列表', name: 'tablepan1'},
          {label: '账户对应的交易记录表', name: 'tablepan2'},
          {label: '董监高任职信息表', name: 'tablepan3'}
        ],
        table: {
          theadList1: [
            {label: '交易日期', field: 'trade_date', align: 'left', width: '130', sortable: true},
            {label: '证券代码', field: 'stock_code', align: 'left', width: '130', sortable: true},
            {label: '证券简称', field: 'stock_name', align: 'left', width: '130'},
            {label: '账户一码通账号', field: 'ccrc_acct_id', align: 'left', width: '130'},
            {label: '账户名称', field: 'acct_name', align: 'left', width: '130'},
            {label: '身份信息', field: 'flag', align: 'left', width: '130'},
            {label: '职务类型', field: 'if_mgnt', align: 'right', width: '130'},
            {label: '身份开始日期', field: 'strat_date_hold', align: 'left', width: '130'},
            {label: '身份结束日期 ', field: 'end_date_hold', align: 'left', width: '130'},
            {label: '任职开始结束日期是否有交易(大股东不要验证)', field: 'txn_djg_flag', align: 'right', width: '200'}
          ],
          theadList2: [
            {label: '一码通', field: 'ccrc_acct_id', align: 'left', width: '130', sortable: true},
            {label: '交易日期', field: 'trade_date', align: 'left', width: '130', sortable: true},
            {label: '股票代码', field: 'sec_code', align: 'left', width: '130', sortable: true},
            {label: '股票名称', field: 'stock_name', align: 'left', width: '130'},
            {label: '交易账户', field: 'acct_id', align: 'left', width: '130'},
            {label: '投资者名称', field: 'acct_name', align: 'left', width: '130'},
            {label: '当日买入量（股）', field: 'trade_buy_vol', align: 'right', width: '130'},
            {label: '当日买入金额（元）', field: 'trade_buy_amt', align: 'right', width: '130'},
            {label: '当日卖出量（股）', field: 'trade_sale_vol', align: 'right', width: '130'},
            {label: '当日卖出金额（元）', field: 'trade_sale_amt', align: 'right', width: '130'}
          ],
          theadList3: [
            {label: '生效日期', field: 'eff_date', align: 'left', width: '130'},
            {label: '结束日期', field: 'end_date', align: 'left', width: '130'},
            {label: '管理人员姓名', field: 'mgnt_name', align: 'left', width: '130', sortable: true},
            {label: '证件种类', field: 'id_card_type', align: 'right', width: '130'},
            {label: '证件号码', field: 'id_card', align: 'left', width: '130'},
            {label: '职位类型', field: 'if_mgnt', align: 'left', width: '130'},
            {label: '公司代码', field: 'com_code', align: 'left', width: '130', sortable: true},
            {label: '公司职务', field: 'com_duty', align: 'left', width: '130'},
            {label: '任职开始时间', field: 'duty_begin', align: 'left', width: '130', sortable: true},
            {label: '任职结束时间', field: 'duty_end', align: 'left', width: '130'}
          ],
          data1: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data2: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data3: {data: [], total: 0, pageIndex: 1, pageRows: 10}
        }
      }
    },
    methods: {
      handleQueryData(qryId, isNewQuery, pageIndex, pageRows, resType) {
        this.isAbled = true
        this.showOrHideLoading(true)
        let params = {
          qryId: qryId,
          startDate: moment(this.ruleForm.shortDate[0]).format('YYYY-MM-DD'),
          endDate: moment(this.ruleForm.shortDate[1]).format('YYYY-MM-DD'),
          pageIndex: pageIndex,
          pageRows: pageRows,
          isNewQuery: isNewQuery,
          isExport: '0',
          resType: resType
        }
        postShortTradeScreening(params).then((resp) => {
          if (resp.res.res1) {
            this.table.data1.data = resp.res.res1
            this.table.data1.total = Number(resp.cnt.res1Cnt)
          }
          if (resp.res.res2) {
            this.table.data2.data = resp.res.res2
            this.table.data2.total = Number(resp.cnt.res2Cnt)
          }
          if (resp.res.res3) {
            this.table.data3.data = resp.res.res3
            this.table.data3.total = Number(resp.cnt.res3Cnt)
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
                  resType = 'res1'
                  this.table.data1.pageIndex = page.currentPage
                  this.table.data1.pageRows = page.pageSizeNumber
                  break
                case 'tablepan2':
                  resType = 'res2'
                  this.table.data2.pageIndex = page.currentPage
                  this.table.data2.pageRows = page.pageSizeNumber
                  break
                case 'tablepan3':
                  resType = 'res3'
                  this.table.data3.pageIndex = page.currentPage
                  this.table.data3.pageRows = page.pageSizeNumber
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
          case 'tablepan3':
            this.columns = this.table.theadList3
            this.tableData = this.table.data3
            break
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.pageFlag = true
            let pageIndex = 1, pageRows = 10
            switch (this.activeName) {
              case 'tablepan1':
                pageIndex = this.table.data1.pageIndex
                pageRows = this.table.data1.pageRows
                break
              case 'tablepan2':
                pageIndex = this.table.data2.pageIndex
                pageRows = this.table.data2.pageRows
                break
              case 'tablepan3':
                pageIndex = this.table.data3.pageIndex
                pageRows = this.table.data3.pageRows
                break
            }
            this.handleQueryData(this.qryId, 1, pageIndex, pageRows, 'ALL')
          } else {
            this.$message.error('查询失败！请补全查询参数~');
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.isAbled = true
        this.ruleForm.shortDate = this.defaultDate
      },
      handleDownload() {
        this.$message.info('正在导出，请稍等~')
        let params = {
          qryId: this.qryId,
          startDate: this.ruleForm.shortDate[0],
          endDate: this.ruleForm.shortDate[1],
          isExport: 1,
          resType: 'ALL',
          fileType: 'xlsx',
          tableColumns: [
            {sheetName: '涉嫌短线交易的账户列表', fileColumns: this.table.theadList1},
            {sheetName: '账户对应的交易记录表', fileColumns: this.table.theadList2},
            {sheetName: '董监高任职信息表', fileColumns: this.table.theadList3}
          ]
        }
        this.gfnExportFileWithForm('/specialqry/speclqry/v1/trading-positions-export', params)
      }
    },
    mounted() {
      //  默认展示第一个标签页
      this.columns = this.table.theadList1
      this.tableData = this.table.data1
      getRelativeTradeDate(-1).then(resp => {
        this.defaultDate = [moment(resp).format('YYYY-MM-DD'), moment(resp).format('YYYY-MM-DD')]
        this.ruleForm.shortDate = this.defaultDate
      })
    }
  }
</script>

<style lang="less" scoped>
  .shortTradeRegularScreening {
    .form-inline {
      display: inline-block;
    }
  }
</style>
