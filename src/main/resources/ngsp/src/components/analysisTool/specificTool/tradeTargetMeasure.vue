<template>
  <div class="tradeTargetMeasure">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" size="small">
        <el-row>
          <el-form-item label="账户及时点导入：" prop="account" class="form-inline">
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
            <el-tag :type="uploadStatus" style="margin: 0 10px"> {{ uploadText }}</el-tag>
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
  import breadcrumb from '../../../components/common/Breadcrumb'
  import FileUpload from '@/components/common/textUpload'
  // import {postTradeTargetMeasure} from '../../../service/analysisTool/specificTool/index';

  export default {
    components: {
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
            router: '/tradeTargetMeasure',
            label: '内幕交易账户指标测算'
          }
        ],
        ruleForm: {},
        rules: {
          account: [
            {required: true, message: '请上传附件', trigger: 'change'}
          ]
        },
        uploadText: '未上传',
        uploadStatus: 'danger',
        columns: [
          {label: '账户代码', field: 'trading_date', align: 'center', width: '120'},
          {label: '账户名称', field: 'trading_date', align: 'center', width: '120'},
          {label: '综合得分', field: 'trading_date', align: 'center', width: '120'},
          {label: '账户一码通编码', field: 'trading_date', align: 'center', width: '120'},
          {label: '账户证件号码', field: 'trading_date', align: 'center', width: '120'},
          {label: '身份证所属地区', field: 'trading_date', align: 'center', width: '120'},
          {label: '交易营业部', field: 'trading_date', align: 'center', width: '120'},
          {label: '营业部地区名称', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间买入量', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间买入金额', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间卖出量', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间卖出金额', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间净买入量', field: 'trading_date', align: 'center', width: '120'},
          {label: '期末持股', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间该股买入金额/期间总买入金额', field: 'trading_date', align: 'center', width: '200'},
          {label: '指标1', field: 'trading_date', align: 'center', width: '120'},
          {label: '期末市值/期末总持股市值', field: 'trading_date', align: 'center', width: '160'},
          {label: '指标2', field: 'trading_date', align: 'center', width: '120'},
          {label: '该股买入金额/其他股票最大买入金额', field: 'trading_date', align: 'center', width: '200'},
          {label: '该股买入金额/其他股票平均买入金额', field: 'trading_date', align: 'center', width: '200'},
          {label: '指标3', field: 'trading_date', align: 'center', width: '120'},
          {label: '该股买入金额/其他股票净卖出金额', field: 'trading_date', align: 'center', width: '200'},
          {label: '指标4', field: 'trading_date', align: 'center', width: '120'},
          {label: '该股持股天数/其他股票平均持股天数', field: 'trading_date', align: 'center', width: '200'},
          {label: '指标5', field: 'trading_date', align: 'center', width: '120'},
          {label: '账户是否空置3个月以上', field: 'trading_date', align: 'center', width: '160'},
          {label: '指标6', field: 'trading_date', align: 'center', width: '120'},
          {label: '近一年首次买入日期-停牌前1个月', field: 'trading_date', align: 'center', width: '200'},
          {label: '指标7', field: 'trading_date', align: 'center', width: '120'},
          {label: '前三个月交易股票支数/期间交易股票支数', field: 'trading_date', align: 'center', width: '200'},
          {label: '指标8', field: 'trading_date', align: 'center', width: '120'},
          {label: '机构净买入金额/其他机构的最大净买入金额', field: 'trading_date', align: 'center', width: '220'},
          {label: '指标10', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间卖出量/买入量', field: 'trading_date', align: 'center', width: '120'},
          {label: '指标12', field: 'trading_date', align: 'center', width: '120'},
          {label: '净买入量排名', field: 'trading_date', align: 'center', width: '120'},
          {label: '指标13', field: 'trading_date', align: 'center', width: '120'},
          {label: '近一年内首次买入时间', field: 'trading_date', align: 'center', width: '120'},
          {label: '指标14', field: 'trading_date', align: 'center', width: '120'},
          {label: '该股买入金额/当日买入股票总金额', field: 'trading_date', align: 'center', width: '200'},
          {label: '指标16', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间买入天数', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间卖出天数', field: 'trading_date', align: 'center', width: '120'},
          {label: '期间卖出量/期间买入量', field: 'trading_date', align: 'center', width: '120'},
          {label: '指标18', field: 'trading_date', align: 'center', width: '120'},
          {label: '账户类别', field: 'trading_date', align: 'center', width: '120'},
          {label: '沪深最大持股市值', field: 'trading_date', align: 'center', width: '120'},
          {label: '最大持股日期', field: 'trading_date', align: 'center', width: '120'},
          {label: '账户买入金额/沪深最大持股市值', field: 'trading_date', align: 'center', width: '160'}
        ],
        tableData: {data: [], total: 0, pageIndex: 1, pageRows: 10},
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: ['acc_id', 'sec_code', 'from_date', 'to_date']
            }
          ])
        },
        isAbled: true,
        qryId: '',
        pageFlag: false
      }
    },
    methods: {
      handleQueryData(qryId, isNewQuery, pageIndex, pageRows) {
        this.isAbled = true
        this.showOrHideLoading(true)
        // let params = {
        //   qryId: qryId,
        //   stkCode: this.ruleForm.stockCode,
        //   pageIndex: pageIndex,
        //   pageRows: pageRows,
        //   isNewQuery: 1,
        //   isExport: '0'
        // }
        // postTradeTargetMeasure(params).then((resp) => {
        //   if (resp.res.res1) {
        //     this.tableData.data = resp.res.res1
        //     this.tableData.total = parseInt(resp.cnt.res1Cnt)
        //   }
        //   this.qryId = resp.qryId
        //   this.isAbled = false
        //   this.showOrHideLoading(false)
        // })
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
      setFileData(val) {
        if (val && val.length) {
          this.suspiciousAccountList = val
          this.uploadText = '已上传';
          this.uploadStatus = 'success';
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.isAbled = true
      },
      handleDownload(fileType) {
        this.$message.info('正在导出，请稍等~')
        // let params = {
        //   qryId: this.qryId,
        //   stkCode: this.ruleForm.stockCode,
        //   isExport: 1,
        //   resType: 'ALL',
        //   fileType: fileType,
        //   tableColumns: [
        //     {sheetName: '内幕交易账户指标测算', fileColumns: this.columns}
        //   ]
        // }
        // this.gfnExportFileWithForm('', params)
      },
      downloadExcelMould() {
        // this.gfnDownloadTemplateFile({ code: '' })
      }
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  .tradeTargetMeasure {
    .form-inline {
      display: inline-block;
    }
  }
</style>
