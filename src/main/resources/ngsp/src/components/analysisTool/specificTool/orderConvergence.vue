<template>
  <div class="orderConvergence">
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
          <el-form-item label="是否包含期初日期：" prop="isBeginData" class="form-inline">
            <el-radio-group v-model="ruleForm.isBeginData">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="前" prop="beforDay" class="form-inline">
            <el-input class="smallText" v-model="ruleForm.beforDay"></el-input>
            <span>&nbsp;交易日</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否包含期末日期：" prop="isEndData" class="form-inline">
            <el-radio-group v-model="ruleForm.isEndData">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="后" prop="afterDay" class="form-inline">
            <el-input class="smallText" v-model="ruleForm.afterDay"></el-input>
            <span>&nbsp;交易日</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="指令文件：" prop="zlArr" class="form-inline">
            <file-upload
              ref="upload"
              class="form-inline"
              :isShowSuccessMessage="true"
              :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
              @getTxtCon="setFileData1"
              :limitFileType="['xls', 'xlsx']"
              :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
              :uploadParams="uploadParams1"
              style="vertical-align: top;"></file-upload>
            <el-tag :type="uploadStatus1" style="margin: 0 10px 0 10px"> {{ uploadText1 }}</el-tag>
            <el-button
              class="form-inline"
              @click="downloadExcelMould('order')"
              size="small"
              type="primary"
              style="vertical-align: top;">下载模板</el-button>
          </el-form-item>
          <el-form-item label="账户：" prop="acctArr" class="form-inline">
            <file-upload
              ref="upload"
              class="form-inline"
              :isShowSuccessMessage="true"
              :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
              @getTxtCon="setFileData2"
              :limitFileType="['xls', 'xlsx']"
              :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
              :uploadParams="uploadParams2"
              style="vertical-align: top;"></file-upload>
            <el-tag :type="uploadStatus2" style="margin: 0 10px 0 10px"> {{ uploadText2 }}</el-tag>
            <el-button
              class="form-inline"
              @click="downloadExcelMould('account')"
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
  import breadcrumb from '../../../components/common/Breadcrumb'
  import STable from '@/components/base/STable'
  import SDatePicker from '../../base/SDatePicker'
  import moment from 'moment'
  import {postorderQuery} from '../../../service/analysisTool/specificTool/index'
  import {getRelativeTradeDate} from '../../../service/common/commonFunc'

  export default {
    components: {
      SDatePicker,
      breadcrumb,
      FileUpload,
      STable
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
            router: '/orderConvergence',
            label: '指令趋同'
          }
        ],
        ruleForm: {
          converDate: '',
          profitDate: '',
          beforDay: '',
          afterDay: '',
          isBeginData: '',
          isEndData: '',
          profitType: '1',
          zlArr: [],
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
          isBeginData: [
            {required: true, message: '请选择是否包含期初日期', trigger: 'change'}
          ],
          isEndData: [
            {required: true, message: '请选择是否包含期末日期', trigger: 'change'}
          ],
          profitType: [
            {required: true, message: '请选择盈利类型', trigger: 'change'}
          ],
          zlArr: [
            {required: true, message: '请上传指令附件', trigger: 'change'}
          ],
          acctArr: [
            {required: true, message: '请上传账户附件', trigger: 'change'}
          ]
        },
        uploadParams1: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: ['bAcctId', 'stockCode', 'tradingDate', 'bs', 'orderVol', 'orderAmt']
            }
          ])
        },
        uploadParams2: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: ['accountCode', 'startDate', 'endDate', 'tax']
            }
          ])
        },
        uploadText1: '未上传',
        uploadStatus1: 'danger',
        uploadText2: '未上传',
        uploadStatus2: 'danger',
        isAbled: true,
        pageFlag: false,
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
          {label: '指令趋同明细表', name: 'tablepan2'},
          {label: '买入趋同盈利明细表', name: 'tablepan3'}
        ],
        table: {
          theadList1: [
            {label: '计算起始日期', field: 'start_date', align: 'left', width: '130', sortable: true},
            {label: '计算终止日期', field: 'end_date', align: 'left', width: '130'},
            {label: '账面获利计算基准日期', field: 'terminal_date', align: 'left', width: '130'},
            {label: '账户代码', field: 'account_code', align: 'left', width: '130', sortable: true},
            {label: '账户名称', field: 'account_name', align: 'left', width: '130'},
            {label: '期间交易股票只数（只）', field: 'stock_num_total', align: 'right', width: '150'},
            {label: '期间买入股票只数（只）', field: 'stock_num_total_buy', align: 'right', width: '150'},
            {label: '期间买入数量（万股）', field: 'buy_volume', align: 'right', width: '130'},
            {label: '期间买入金额（万元）', field: 'buy_value', align: 'right', width: '130'},
            {label: '期间卖出股票只数（只）', field: 'stock_num_total_sale', align: 'right', width: '150'},
            {label: '期间卖出数量（万股）', field: 'sale_volume', align: 'right', width: '130'},
            {label: '期间卖出金额（万元）', field: 'sale_value', align: 'right', width: '130'},
            {label: '趋同交易股票只数（只）', field: 'stock_num_qt', align: 'right', width: '150'},
            {label: '趋同买入股票只数（只）', field: 'stock_num_qt_buy', align: 'right', width: '150'},
            {label: '趋同买入数量（万股）', field: 'qt_buy_volume', align: 'right', width: '130'},
            {label: '趋同买入金额（万元）', field: 'qt_buy_value', align: 'right', width: '130'},
            {label: '趋同卖出股票只数（只）', field: 'stock_num_qt_sale', align: 'right', width: '150'},
            {label: '趋同卖出数量（万股）', field: 'qt_sale_volume', align: 'right', width: '130'},
            {label: '趋同卖出金额（万元）', field: 'qt_sale_value', align: 'right', width: '130'},
            {label: '趋同交易股票只数占比', field: 'ratio_num', align: 'right', width: '130'},
            {label: '趋同买入股票只数占比', field: 'ratio_num_buy', align: 'right', width: '130'},
            {label: '趋同卖出股票只数占比', field: 'ratio_num_sale', align: 'right', width: '130'},
            {label: '趋同交易金额占比', field: 'ratio_value', align: 'right', width: '130'},
            {label: '趋同买入金额占比', field: 'ratio_value_buy', align: 'right', width: '130'},
            {label: '趋同卖出金额占比', field: 'ratio_value_sale', align: 'right', width: '130'},
            {label: '盈利（万元）', field: 'profit', align: 'right', width: '130'}
          ],
          theadList2: [
            {label: '买卖方向', field: 'bs', align: 'left', width: '130', sortable: true},
            {label: '指令下达日期', field: 'trading_date', align: 'left', width: '150', sortable: true},
            {label: '指令下达账户', field: 'b_acct_id', align: 'left', width: '150', sortable: true},
            {label: '证券代码', field: 'stock_code', align: 'left', width: '130', sortable: true},
            {label: '证券简称', field: 'stock_name', align: 'left', width: '130'},
            {label: '前M日', field: 'beg_date', align: 'right', width: '130'},
            {label: '后N日', field: 'late_date', align: 'right', width: '130'},
            {label: '账户代码', field: 'account_code', align: 'left', width: '130', sortable: true},
            {label: '账户名称', field: 'account_name', align: 'left', width: '130'},
            {label: '交易日期', field: 'trading_date1', align: 'left', width: '130', sortable: true},
            {label: '趋同股数（股）', field: 'trade_buy_volume', align: 'right', width: '130'},
            {label: '趋同金额（元）', field: 'trade_buy_value', align: 'right', width: '130'},
            {label: '交易指令申报股数（股）', field: 'b_order_vol', align: 'right', width: '150'},
            {label: '交易指令申报金额（元）', field: 'b_order_amt', align: 'right', width: '150'}
          ],
          theadList3: [
            {label: '匹配方式', field: 'yl_type', align: 'left', width: '130', sortable: true},
            {label: '成交日期', field: 'trading_date', align: 'left', width: '130', sortable: true},
            {label: '账户代码', field: 'account_code', align: 'left', width: '130', sortable: true},
            {label: '账户名称', field: 'account_name', align: 'left', width: '130'},
            {label: '证券代码', field: 'stock_code', align: 'left', width: '130', sortable: true},
            {label: '证券简称', field: 'stock_name', align: 'left', width: '130'},
            {label: '趋同买入数量（股）', field: 'qt_buy_volume', align: 'right', width: '130'},
            {label: '趋同买入金额（元）', field: 'qt_buy_value', align: 'right', width: '130'},
            {label: '送股数量（股）', field: 'sg_volume', align: 'right', width: '130'},
            {label: '配股数量（股）', field: 'pg_volume', align: 'right', width: '130'},
            {label: '配股成本（元）', field: 'pg_cost', align: 'right', width: '130'},
            {label: '匹配的卖出数量（股）', field: 'pp_sale_volume', align: 'right', width: '150'},
            {label: '匹配的卖出金额（元）', field: 'pp_sale_value', align: 'right', width: '150'},
            {label: '未匹配数量（股）', field: 'no_pp_sale_volume', align: 'right', width: '130'},
            {label: '未匹配参考市值（元）', field: 'no_pp_sale_value', align: 'right', width: '150'},
            {label: '分红派息金额（元）', field: 'fh_value_all', align: 'right', width: '130'},
            {label: '印花税（元）', field: 'yh_tax', align: 'right', width: '130'},
            {label: '过户费（元）', field: 'gh_tax', align: 'right', width: '130'},
            {label: '交易佣金（元）', field: 'trade_tax', align: 'right', width: '130'},
            {label: '实际盈利（元）', field: 'sjyl', align: 'right', width: '130'},
            {label: '账面盈利（元）', field: 'zmyl', align: 'right', width: '130'},
            {label: '盈利（元）', field: 'yl', align: 'right', width: '130'}
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
          startDate: moment(this.ruleForm.converDate[0]).format('YYYYMMDD'),
          endDate: moment(this.ruleForm.converDate[1]).format('YYYYMMDD'),
          profitDate: moment(this.ruleForm.profitDate).format('YYYYMMDD'),
          isCntStartData: this.ruleForm.isBeginData,
          isCntEndData: this.ruleForm.isEndData,
          beforDay: this.ruleForm.beforDay,
          afterDay: this.ruleForm.afterDay,
          zlArr: this.ruleForm.zlArr,
          acctArr: this.ruleForm.acctArr,
          qryId: qryId,
          isNewQuery: isNewQuery,
          isExport: 0,
          pageIndex: pageIndex,
          pageRows: pageRows,
          resType: resType
        }
        postorderQuery({params: JSON.stringify(params)}).then((resp) => {
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
          this.isAbled = false
          this.qryId = resp.qryId
          this.showOrHideLoading(false)
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.pageFlag = true
            this.handleQueryData(this.qryId, 1, 1, 10, 'ALL')
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
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
      showOrHideLoading(flag) {
        this.$refs.marginTable.showOrHideLoading(flag)
      },
      setFileData1(val) {
        this.ruleForm.zlArr = val.Sheet0
        this.uploadText1 = '已上传'
        this.uploadStatus1 = 'success'
      },
      setFileData2(val) {
        this.ruleForm.acctArr = val.Sheet0
        this.uploadText2 = '已上传'
        this.uploadStatus2 = 'success'
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.zlArr = []
        this.acctArr = []
        this.isAbled = true
        this.uploadText1 = '未上传'
        this.uploadStatus1 = 'danger'
        this.uploadText2 = '未上传'
        this.uploadStatus2 = 'danger'
      },
      handleDownload() {
        this.$message.info('正在导出，请稍等~')
        let params = {
          startDate: moment(this.ruleForm.converDate[0]).format('YYYYMMDD'),
          endDate: moment(this.ruleForm.converDate[1]).format('YYYYMMDD'),
          profitDate: moment(this.ruleForm.profitDate).format('YYYYMMDD'),
          isCntStartData: this.ruleForm.isBeginData,
          isCntEndData: this.ruleForm.isEndData,
          beforDay: this.ruleForm.beforDay,
          afterDay: this.ruleForm.afterDay,
          zlArr: this.ruleForm.zlArr,
          acctArr: this.ruleForm.acctArr,
          qryId: this.qryId,
          isExport: 1,
          resType: 'ALL',
          fileType: 'xlsx',
          tableColumns: [
            {sheetName: '趋同交易总体汇总表', fileColumns: this.table.theadList1},
            {sheetName: '指令趋同明细表', fileColumns: this.table.theadList2},
            {sheetName: '买入趋同盈利明细表', fileColumns: this.table.theadList3}
          ]
        }
        this.gfnExportFileWithForm('/specialqry/speclqry/v1/directsml-elk-export', params)
      },
      downloadExcelMould(str) {
        if (str === 'order') {
          this.gfnDownloadTemplateFile({ code: 'orderConvergence_order' })
        } else {
          this.gfnDownloadTemplateFile({ code: 'orderConvergence_account' })
        }
      }
    },
    mounted() {
      //  默认展示第一个标签页
      this.columns = this.table.theadList1
      this.tableData = this.table.data1
      getRelativeTradeDate(-1).then((resp) => {
        this.ruleForm.converDate = [moment(resp).format('YYYY-MM-DD'), moment(resp).format('YYYY-MM-DD')]
        this.ruleForm.profitDate = moment(resp).format('YYYY-MM-DD')
      })
    }
  }
</script>
<style lang="less">
  .orderConvergence {
    .form-inline {
      display: inline-block;
    }
    .smallText {
      width: 26%;
    }
  }
</style>
