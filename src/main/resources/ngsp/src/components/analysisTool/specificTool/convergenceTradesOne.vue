<template>
  <div class="converttradesOne">
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
          <el-form-item label="起止日期：" prop="converDate" class="form-inline">
            <s-date-picker
              v-model="ruleForm.converDate"
              :is-range="true"
              type="date"
              startPlaceholder="请选择开始日期"
              endPlaceholder="请选择结束日期"></s-date-picker>
          </el-form-item>
          <el-form-item label="账面获利计算基准日：" prop="profitDate" label-width="220px" class="form-inline">
            <el-date-picker
              v-model="ruleForm.profitDate"
              type="date"
              placeholder="请选择账面获利计算基准日"
              :picker-options="setDateDisabled"
              size="small">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否包含期初日期：" prop="isContnInitData" class="form-inline">
            <el-radio-group v-model="ruleForm.isContnInitData">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="前" prop="beforDay" label-width="100px" class="form-inline">
            <el-input class="smallText" v-model="ruleForm.beforDay"></el-input>
            <span>&nbsp;交易日</span>
          </el-form-item>
          <el-form-item label="后" prop="afterDay" label-width="80px" class="form-inline">
            <el-input class="smallText" v-model="ruleForm.afterDay"></el-input>
            <span>&nbsp;交易日</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="盈利类型：" prop="profitType" class="form-inline">
            <el-select v-model="ruleForm.profitType" placeholder="请选择" clearable>
              <el-option label="先进先出" value="1"></el-option>
              <el-option label="后进先出" value="2" disabled="disabled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="100px" label="账户：" prop="acctArr" class="form-inline">
            <file-upload
              ref="upload"
              class="form-inline"
              :isShowSuccessMessage="true"
              :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
              @getTxtCon="setFileData"
              :limitFileType="['xls', 'xlsx']"
              :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
              :uploadParams="uploadParams"
              style="vertical-align: top;"></file-upload>
            <el-tag :type="uploadStatus" style="margin: 0 10px 0 10px"> {{ uploadText }}</el-tag>
            <el-button
              class="form-inline"
              @click="downloadExcelMould"
              size="small"
              type="primary"
              style="vertical-align: top;">下载模板</el-button>
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
  import FileUpload from '@/components/common/textUpload'
  import SDatePicker from '../../base/SDatePicker'
  import breadcrumb from '../../../components/common/Breadcrumb'
  import moment from 'moment'
  import {postconverTradeOne} from '../../../service/analysisTool/specificTool/index'
  import {getRelativeTradeDate} from '../../../service/common/commonFunc'

  export default {
    components: {
      SDatePicker,
      breadcrumb,
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
            router: '/converttradesOne',
            label: '趋同交易-模块一'
          }
        ],
        ruleForm: {
          converDate: '',
          profitDate: '',
          beforDay: '',
          afterDay: '',
          isContnInitData: '',
          profitType: '1',
          acctArr: []
        },
        rules: {
          converDate: [
            {required: true, message: '请选择起始日期', trigger: 'change'}
          ],
          profitDate: [
            {required: true, message: '请选择账面获利计算基准日', trigger: 'change'}
          ],
          beforDay: [
            {required: true, message: '请输入前N交易日', trigger: 'change'}
          ],
          afterDay: [
            {required: true, message: '请输入后N交易日', trigger: 'change'}
          ],
          isContnInitData: [
            {required: true, message: '请选择是否包含期初日期', trigger: 'change'}
          ],
          profitType: [
            {required: true, message: '请选择盈利类型', trigger: 'change'}
          ],
          acctArr: [
            {required: true, message: '请上传附件', trigger: 'change'}
          ]
        },
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: ['grp', 'accountCode', 'startDate', 'endDate', 'tax']
            }
           ])
        },
        isAbled: true,
        pageFlag: false,
        defaultDate1: [],
        defaultDate2: '',
        uploadText: '未上传',
        uploadStatus: 'danger',
        qryId: '',
        setDateDisabled: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        activeName: 'tablepan1',
        tableData: {},
        columns: [],
        tabList: [
          {label: '趋同交易总体汇总表', name: 'tablepan1'},
          {label: '趋同买入明细表', name: 'tablepan2'},
          {label: '趋同卖出明细表', name: 'tablepan3'},
          {label: '买入趋同盈利明细表', name: 'tablepan4'},
          {label: '趋同交易按股票汇总表', name: 'tablepan5'}
        ],
        table: {
          theadList1: [
            {label: '计算起始日期', field: 'min_trading_date', align: 'left', width: '130', sortable: true},
            {label: '计算终止日期', field: 'max_trading_date', align: 'left', width: '130'},
            {label: '账面获利计算基准日期', field: 'jz_date', align: 'left', width: '130'},
            {label: '账户组', field: 'grp', align: 'left', width: '130', sortable: true},
            {label: '账户代码', field: 'account_code', align: 'left', width: '130', sortable: true},
            {label: '账户名称', field: 'account_name', align: 'left', width: '130'},
            {label: '期间交易股票只数', field: 'stock_num_total', align: 'right', width: '130'},
            {label: '期间买入股票只数', field: 'stock_num_total_buy', align: 'right', width: '130'},
            {label: '期间买入数量（万股）', field: 'buy_volume', align: 'right', width: '130'},
            {label: '期间买入金额（万元）', field: 'buy_value', align: 'right', width: '130'},
            {label: '期间卖出股票只数', field: 'stock_num_total_sale', align: 'right', width: '130'},
            {label: '期间卖出数量（万股）', field: 'sale_volume', align: 'right', width: '130'},
            {label: '期间卖出金额（万元）', field: 'sale_value', align: 'right', width: '130'},
            {label: '趋同交易股票数', field: 'stock_num_qt', align: 'right', width: '130'},
            {label: '趋同买入股票只数', field: 'stock_num_qt_buy', align: 'right', width: '130'},
            {label: '趋同买入数量（万股）', field: 'trade_buy_volume', align: 'right', width: '130'},
            {label: '趋同买入金额（万元）', field: 'trade_buy_value', align: 'right', width: '130'},
            {label: '趋同卖出股票只数', field: 'stock_num_qt_sale', align: 'right', width: '130'},
            {label: '趋同卖出数量（万股）', field: 'trade_sale_volume', align: 'right', width: '130'},
            {label: '趋同卖出金额（万元）', field: 'trade_sale_value', align: 'right', width: '130'},
            {label: '趋同交易股票只数占比', field: 'ratio_num', align: 'right', width: '130'},
            {label: '趋同交易数量占比', field: 'ratio_volume', align: 'right', width: '130'},
            {label: '趋同交易金额占比', field: 'ratio_value', align: 'right', width: '130'},
            {label: '趋同买入股票只数占比', field: 'ratio_num_buy', align: 'right', width: '130'},
            {label: '趋同买入数量占比', field: 'ratio_volume_buy', align: 'right', width: '130'},
            {label: '趋同买入金额占比', field: 'ratio_value_buy', align: 'right', width: '130'},
            {label: '趋同卖出股票只数占比', field: 'ratio_num_sale', align: 'right', width: '130'},
            {label: '趋同卖出数量占比', field: 'ratio_volume_sale', align: 'right', width: '130'},
            {label: '趋同卖出金额占比', field: 'ratio_value_sale', align: 'right', width: '130'},
            {label: '账面盈利（万元）', field: 'profit', align: 'right', width: '130'}
          ],
          theadList2: [
            {label: '交易日期', field: 'trading_date', align: 'left', width: '130', sortable: true},
            {label: '账户组', field: 'grp', align: 'left', width: '130', sortable: true},
            {label: '股东账户', field: 'account_code', align: 'left', width: '130'},
            {label: '账户名称', field: 'account_name', align: 'left', width: '130'},
            {label: '证券代码', field: 'stock_code', align: 'left', width: '130', sortable: true},
            {label: '证券简称', field: 'stock_name', align: 'left', width: '130'},
            {label: '趋同买入数量（股）', field: 'trade_buy_volume', align: 'right', width: '130'},
            {label: '趋同买入金额（元）', field: 'trade_buy_value', align: 'right', width: '130'}
          ],
          theadList3: [
            {label: '交易日期', field: 'trading_date', align: 'left', width: '130', sortable: true},
            {label: '账户组', field: 'grp', align: 'left', width: '130', sortable: true},
            {label: '股东账户', field: 'account_code', align: 'left', width: '130'},
            {label: '账户名称', field: 'account_name', align: 'left', width: '130'},
            {label: '证券代码', field: 'stock_code', align: 'left', width: '130', sortable: true},
            {label: '证券简称', field: 'stock_name', align: 'left', width: '130'},
            {label: '趋同卖出数量（股）', field: 'trade_sale_volume', align: 'right', width: '130'},
            {label: '趋同卖出金额（元）', field: 'trade_sale_value', align: 'right', width: '130'}
          ],
          theadList4: [
            {label: '匹配方式', field: 'yl_type', align: 'left', width: '130'},
            {label: '成交日期', field: 'trading_date', align: 'left', width: '130', sortable: true},
            {label: '账户代码', field: 'account_code', align: 'left', width: '130', sortable: true},
            {label: '账户名称', field: 'account_name', align: 'left', width: '130'},
            {label: '证券代码', field: 'stock_code', align: 'left', width: '130', sortable: true},
            {label: '证券简称', field: 'stock_name', align: 'left', width: '130'},
            {label: '趋同买入数量（股）', field: 'qt_buy_volume', align: 'right', width: '130'},
            {label: '趋同买入金额（元）', field: 'qt_buy_value', align: 'right', width: '130'},
            {label: '匹配的卖出数量（股）', field: 'pp_sale_volume', align: 'right', width: '130'},
            {label: '匹配的卖出金额（元）', field: 'pp_sale_value', align: 'right', width: '130'},
            {label: '未匹配数量（股）', field: 'no_pp_sale_volume', align: 'right', width: '130'},
            {label: '未匹配参考市值（元）', field: 'no_pp_sale_value', align: 'right', width: '130'},
            {label: '分红派息金额（元）', field: 'fh_value_all', align: 'right', width: '130'},
            {label: '未匹配部分送股数量', field: 'sg_volume', align: 'right', width: '130'},
            {label: '未匹配部分配股数量', field: 'pg_volume', align: 'right', width: '130'},
            {label: '配股成本（元）', field: 'pg_cost', align: 'right', width: '130'},
            {label: '印花税（元）', field: 'yh_tax', align: 'right', width: '130'},
            {label: '过户费（元）', field: 'gh_tax', align: 'right', width: '130'},
            {label: '交易佣金（元）', field: 'trade_tax', align: 'right', width: '130'},
            {label: '盈利（元）', field: 'yl', align: 'right', width: '130'}
          ],
          theadList5: [
            {label: '证券代码', field: 'stock_code', align: 'left', width: '130', sortable: true},
            {label: '证券简称', field: 'stock_name', align: 'left', width: '130'},
            {label: '趋同交易账户', field: 'acct_list', align: 'left', width: '130', sortable: true},
            {label: '起始日期', field: 'min_trading_date', align: 'left', width: '130', sortable: true},
            {label: '终止日期', field: 'max_trading_date', align: 'left', width: '130'},
            {label: '基准账户趋同买入股数（万股）', field: 'buy_volume', align: 'right', width: '130'},
            {label: '基准账户趋同买入金额（万元）', field: 'buy_value', align: 'right', width: '130'},
            {label: '基准账户趋同卖出股数（万股）', field: 'sale_volume', align: 'right', width: '130'},
            {label: '基准账户趋同卖出金额（万元）', field: 'sale_value', align: 'right', width: '130'},
            {label: '趋同账户趋同买入股数（万股）', field: 'qt_buy_volume', align: 'right', width: '130'},
            {label: '趋同账户趋同买入金额（万元）', field: 'qt_buy_value', align: 'right', width: '130'},
            {label: '趋同账户趋同卖出股数（万股）', field: 'qt_sale_volume', align: 'right', width: '130'},
            {label: '趋同账户趋同卖出金额（万元）', field: 'qt_sale_value', align: 'right', width: '130'}
          ],
          data1: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data2: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data3: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data4: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data5: {data: [], total: 0, pageIndex: 1, pageRows: 10}
        }
      }
    },
    methods: {
      handleQueryData(qryId, isNewQuery, pageIndex, pageRows, resType) {
        this.isAbled = true
        this.showOrHideLoading(true)
        let params = {
          startDate: moment(this.ruleForm.converDate[0]).format('YYYYMMDD'),
          endDate: moment(this.ruleForm.converDate[1]).format('YYYYMMDD'),
          jzDate: moment(this.ruleForm.profitDate).format('YYYYMMDD'),
          isContnInitData: this.ruleForm.isContnInitData,
          beforDay: this.ruleForm.beforDay,
          afterDay: this.ruleForm.afterDay,
          profitType: this.ruleForm.profitType,
          acctArr: this.ruleForm.acctArr,
          qryId: qryId,
          isNewQuery: isNewQuery,
          isExport: 0,
          pageIndex: pageIndex,
          pageRows: pageRows,
          resType: resType
        }
        postconverTradeOne({params: JSON.stringify(params)}).then((resp) => {
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
          if (resp.res.res4) {
            this.table.data4.data = resp.res.res4
            this.table.data4.total = Number(resp.cnt.res4Cnt)
          }
          if (resp.res.res5) {
            this.table.data5.data = resp.res.res5
            this.table.data5.total = Number(resp.cnt.res5Cnt)
          }
          this.isAbled = false
          this.qryId = resp.qryId
          this.showOrHideLoading(false)
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.pageFlag = true
            this.handleQueryData(this.qryId, '1', 1, 10, 'ALL')
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
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
          case 'tablepan4':
            this.columns = this.table.theadList4
            this.tableData = this.table.data4
            break
          case 'tablepan5':
            this.columns = this.table.theadList5
            this.tableData = this.table.data5
            break
        }
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
                case 'tablepan4':
                  resType = 'res4'
                  this.table.data4.pageIndex = page.currentPage
                  this.table.data4.pageRows = page.pageSizeNumber
                  break
                case 'tablepan5':
                  resType = 'res5'
                  this.table.data5.pageIndex = page.currentPage
                  this.table.data5.pageRows = page.pageSizeNumber
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
      setFileData(val) {
        this.ruleForm.acctArr = val.Sheet0
        this.uploadText = '已上传';
        this.uploadStatus = 'success';
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.isAbled = true
        this.uploadText = '未上传';
        this.uploadStatus = 'danger';
        this.ruleForm.converDate = this.defaultDate1
        this.ruleForm.profitDate = this.defaultDate2
      },
      handleDownload() {
        this.$message.info('正在导出，请稍等~')
        let params = {
          startDate: moment(this.ruleForm.converDate[0]).format('YYYYMMDD'),
          endDate: moment(this.ruleForm.converDate[1]).format('YYYYMMDD'),
          jzDate: moment(this.ruleForm.profitDate).format('YYYYMMDD'),
          isContnInitData: this.ruleForm.isContnInitData,
          beforDay: this.ruleForm.beforDay,
          afterDay: this.ruleForm.afterDay,
          profitType: this.ruleForm.profitType,
          acctArr: this.ruleForm.acctArr,
          qryId: this.qryId,
          isExport: 1,
          resType: 'ALL',
          fileType: 'xlsx',
          tableColumns: [
            {sheetName: '趋同交易总体汇总表', fileColumns: this.table.theadList1},
            {sheetName: '趋同买入明细表', fileColumns: this.table.theadList2},
            {sheetName: '趋同卖出明细表', fileColumns: this.table.theadList3},
            {sheetName: '买入趋同盈利明细表', fileColumns: this.table.theadList4},
            {sheetName: '趋同交易按股票汇总表', fileColumns: this.table.theadList5}
          ]
        }
        this.gfnExportFileWithForm('/specialqry/speclqry/v1/simltract1-elk-export', params)
      },
      downloadExcelMould() {
        this.gfnDownloadTemplateFile({ code: 'convergenceTradesOne' })
      }
    },
    mounted() {
      //  默认展示第一个标签页
      this.columns = this.table.theadList1
      this.tableData = this.table.data1
      getRelativeTradeDate(-1).then((resp) => {
        this.defaultDate1 = [moment(resp).format('YYYY-MM-DD'), moment(resp).format('YYYY-MM-DD')]
        this.defaultDate2 = moment(resp).format('YYYY-MM-DD')

        this.ruleForm.converDate = this.defaultDate1
        this.ruleForm.profitDate = this.defaultDate2
      })
    }
  }
</script>
<style lang="less">
  .converttradesOne {
    .form-inline {
      display: inline-block;
    }
    .smallText {
      width: 26%;
    }
  }
</style>
