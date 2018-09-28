<template>
  <div class="profitExchangeStatistics">
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
          <el-form-item label="日期：" prop="profitDate" class="form-inline">
            <el-date-picker
              v-model="ruleForm.profitDate"
              type="date"
              placeholder="请选择日期"
              size="small">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="起止时间：" prop="profitTime" class="form-inline">
            <s-date-picker
              v-model="ruleForm.profitTime"
              :is-range="true"
              type="time"
              startPlaceholder="请选择开始时间"
              endPlaceholder="请选择结束时间"></s-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="股东账户：" prop="shareholder" class="form-inline">
            <!--<el-input v-model="ruleForm.shareholder" style="display: none;"></el-input>-->
            <el-input
              v-model="ruleForm.shareholder"
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
      :isPageination="activeName === 'tablepan1'"
      :show-summary="activeName === 'tablepan2'"
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
  import {postProfitExchangeStatistics} from '../../../service/analysisTool/customQuery/index'
  import FileUpload from '@/components/common/textUpload'
  import breadcrumb from '../../../components/common/Breadcrumb'
  import STable from '@/components/base/STable'
  import moment from 'moment'
  import SDatePicker from '../../base/SDatePicker'

  export default {
    components: {
      SDatePicker,
      FileUpload,
      breadcrumb,
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
            label: '自定义查询'
          }, {
            router: '/profitExchangeStatistics',
            label: '收益互换统计'
          }
        ],
        ruleForm: {
          profitDate: '',
          profitTime: ['9:00:00', '15:00:00'],
          shareholder: ''
        },
        rules: {
          profitDate: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          profitTime: [
            {required: true, message: '请选择时间范围', trigger: 'change'}
          ],
          shareholder: [
            {required: true, message: '请上传股东账户附件', trigger: 'change'}
          ]
        },
        activeName: 'tablepan1',
        tabList: [
          {label: '账户成交统计', name: 'tablepan1'},
          {label: '会员成交统计', name: 'tablepan2'},
          {label: '证券成交统计', name: 'tablepan3'}
        ],
        table: {
          theadList1: [
            {label: '账户代码', field: 'account_id', align: 'left', width: '100', sortable: true},
            {label: '账户名称', field: 'investor_account_name', align: 'left', width: '100'},
            {label: '证券代码', field: 'instrument_id', align: 'left', width: '100', sortable: true},
            {label: '证券简称', field: 'instrument_chn_short_name', align: 'left', width: '100'},
            {label: '买入金额（元）', field: 'trdamt_b', align: 'right', width: '100'},
            {label: '卖出金额（元）', field: 'trdamt_s', align: 'right', width: '100'},
            {label: '净额（元）', field: 'trdamt', align: 'right', width: '100'}
          ],
          theadList2: [
            {label: '会员名称', field: 'member_name', align: 'left', width: '100', sortable: true},
            {label: '买入金额（元）', field: 'mktval_b', align: 'right', width: '100'},
            {label: '卖出金额（元）', field: 'mktval_s', align: 'right', width: '100'},
            {label: '净额（元）', field: 'mktval', align: 'right', width: '100'}
          ],
          theadList3: [
            {label: '证券代码', field: 'instrument_id', align: 'left', width: '100', sortable: true},
            {label: '证券简称', field: 'instrument_chn_short_name', align: 'left', width: '100'},
            {label: '买入金额（元）', field: 'trdamt_b', align: 'right', width: '100'},
            {label: '卖出金额（元）', field: 'trdamt_s', align: 'right', width: '100'}
          ],
          data1: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data2: {data: []},
          data3: {data: []}
        },
        accountCodeList: [],
        defaultDate: '',
        isAbled: true,
        pageFlag: false,
        uploadText: '未上传',
        uploadStatus: 'danger',
        tableData: {},
        columns: []
      }
    },
    methods: {
      // 查询
      handleQueryData(pageIndex, pageRows, resType) {
        this.isAbled = true
        this.showOrHideLoading(true)
        let startTime = this.ruleForm.profitTime[0].split(':');
        startTime = startTime[0] + startTime[1] + startTime[2] + ''
        let endTime = this.ruleForm.profitTime[1].split(':');
        endTime = endTime[0] + endTime[1] + endTime[2] + ''
        let params = {
          startDate: moment(this.ruleForm.profitDate).format('YYYYMMDD'),
          startTime: startTime, // moment(this.ruleForm.profitTime[0]).format('HHmmss'),
          endTime: endTime, // moment(this.ruleForm.profitTime[1]).format('HHmmss'),
          acctArr: this.ruleForm.shareholder,
          pageIndex: pageIndex,
          pageRows: pageRows,
          isExport: '0',
          resType: resType
        }
        postProfitExchangeStatistics(params).then((resp) => {
          if (resp.res.res1) {
            this.table.data1.data = resp.res.res1
            this.table.data1.total = Number(resp.cnt.res1Cnt)
          }
          if (resp.res.res2) {
            let result = resp.res.res2
            for (let i = 0; i < result.length; i++) {
              if (result[i].member_name === '汇总') {
                result.splice(i, 1)
                break
              }
            }
            this.table.data2.data = result
          }
          if (resp.res.res3) {
            this.table.data3.data = resp.res.res3
          }
          this.isAbled = false
          this.showOrHideLoading(false)
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.pageFlag = true
            this.handleQueryData(this.table.data1.pageIndex, this.table.data1.pageRows, 'ALL')
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
        }
      },
      getPageination(page) {
        if (this.pageFlag) {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.table.data1.pageIndex = page.currentPage
              this.table.data1.pageRows = page.pageSizeNumber
              this.handleQueryData(page.currentPage, page.pageSizeNumber, 'res1')
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
        if (val && val.length) {
          this.accountCodeList = val
          this.accountChange()
          this.uploadText = '已上传';
          this.uploadStatus = 'success';
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.isAbled = true
        this.accountCodeList = []
        this.uploadText = '未上传';
        this.uploadStatus = 'danger';
        this.ruleForm.profitDate = this.defaultDate
      },
      handleDownload() {
        this.$message.info('正在导出，请稍等~')
        let startTime = this.ruleForm.profitTime[0].split(':');
        startTime = startTime[0] + startTime[1] + startTime[2] + ''
        let endTime = this.ruleForm.profitTime[1].split(':');
        endTime = endTime[0] + endTime[1] + endTime[2] + ''
        let params = {
          startDate: moment(this.ruleForm.profitDate).format('YYYYMMDD'),
          startTime: startTime, // moment(this.ruleForm.profitTime[0]).format('HHmmss'),
          endTime: endTime, // moment(this.ruleForm.profitTime[1]).format('HHmmss'),
          acctArr: this.ruleForm.shareholder,
          isExport: '1',
          resType: 'ALL',
          fileType: 'xlsx',
          tableColumns: [
            {sheetName: '账户成交统计', fileColumns: this.table.theadList1},
            {sheetName: '会员成交统计', fileColumns: this.table.theadList2},
            {sheetName: '证券成交统计', fileColumns: this.table.theadList3}
          ]
        }
        this.gfnExportFileWithForm('/specialqry/speclqry/v1/profit-exchange-export', params)
      },
      downloadExcelMould() {
        this.gfnDownloadTemplateFile({ code: 'profitExchangeStatistics' })
      },
      accountChange() {
        let acclist = ''
        for (let item of this.accountCodeList) {
          acclist += item + ','
        }
        acclist = acclist.substr(0, acclist.length - 1)
        this.ruleForm.shareholder = acclist
      }
    },
    mounted() {
      //  默认展示第一个标签页
      this.columns = this.table.theadList1
      this.tableData = this.table.data1
      getRelativeTradeDate(-1).then((resp) => {
        this.defaultDate  = moment(resp).format('YYYY-MM-DD')
        this.ruleForm.profitDate = this.defaultDate
      })
    }
  }
</script>

<style lang="less" scoped>
  .profitExchangeStatistics {
    .form-inline {
      display: inline-block;
    }
    .textarea{
      width: 38%;
      vertical-align: top;
      margin-right: 20px;
    }
  }
</style>
