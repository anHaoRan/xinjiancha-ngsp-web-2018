<template>
  <div class="profitTypeBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="80px">
      <el-form-item label="盈利类：" prop="typeValue">
        <el-select v-model="ruleForm.typeValue" placeholder="请选择盈利类" clearable @change="handleAnalysisRules">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择：" prop="chooseValue">
        <el-select class="chooseSelect" v-model="ruleForm.chooseValue" placeholder="请选择" clearable>
          <el-option
            v-for="item in chooseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <file-upload
        class="uploadBtn"
        ref="upload"
        :isShowSuccessMessage="true"
        :limitFileType="['xls', 'xlsx']"
        :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
        :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
        :uploadParams="uploadParams"
        @getTxtCon="setFileData"
      ></file-upload>
      <el-tag :type="uploadStatus"> {{ uploadText }}</el-tag>
      <el-button size="small" class="uploadBtn" @click="downloadExcelMould" type="primary">下载模板</el-button>
      <el-form-item class="rightBar">
        <el-button type="primary" :disabled="loading" @click="submitForm('ruleForm')">查询</el-button>
        <el-button type="text" @click="resetForm('ruleForm')">清空</el-button>
        <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <div v-show="showTable">
      <s-table ref="profitType" :height="600" :columns="profitTypeDataColumns" :data="profitTypeData"
               :isPageination="false"></s-table>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/common/textUpload'
  import { getDayTradeHis } from '../../../../service/analysisTool/standardDataInvestigation'

  export default {
    name: 'profit-type',
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        typeOptions: [
          {
            value: 'paper_profit',
            label: '账面盈利表'
          }, {
            value: 'fifo',
            label: '先进先出法盈利表'
          }, {
            value: 'lifo',
            label: '后进先出法盈利表'
          }, {
            value: 'profit_term',
            label: '指定账户指定期间卖出指定股票盈利情况表'
          }, {
            value: 'profit_period',
            label: '指定账户指定时段卖出指定股票盈利情况表'
          }
        ],
        chooseOptions: [
          {
            value: '1',
            label: '股东代码'
          }, {
            value: '2',
            label: '身份证'
          }
        ],
        ruleForm: {
          typeValue: '',
          chooseValue: ''
        },
        rules: {
          typeValue: [
            {required: true, message: '请选择行情类', trigger: 'change'}
          ],
          chooseValue: [
            {required: true, message: '请选择', trigger: 'change'}
          ]
        },
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['acct_id', 'sec_code', 'from_date', 'from_time', 'to_time'] // 读取文件数据并以此格式返回数据
            },
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate'] // 读取文件数据并以此格式返回数据
            }
          ])
        },
        uploadText: '未上传',
        uploadStatus: 'danger',
        profitTypeData: {data: []},
        profitTypeDataColumns: [],
        showTable: false,
        loading: false,
        flowid: '',
        isDownload: true
      }
    },
    methods: {
      handleQueryData () {
        let params = {
          buszId: this.ruleForm.typeValue,
          acct_flag: this.ruleForm.chooseValue,
          uploadParam: this.ruleForm.isUpload,
          queryby: '2'
        }
        this.profitTypeData.data = []
        this.profitTypeDataColumns = []
        this.showTable = true
        this.showOrHideLoading(true)
        this.loading = true
        getDayTradeHis(JSON.stringify(params)).then(resp => {
          this.profitTypeData.data = []
          this.profitTypeDataColumns = []
          let colums = resp.ch_colnames
          for (let col in colums) {
            this.profitTypeDataColumns.push({label: colums[col], field: col, align: 'center', width: '120'})
          }
          this.profitTypeData.data = resp.rows
          this.loading = false
          this.flowid = resp.flowId
          if (this.profitTypeData.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.profitType.showOrHideLoading(flag)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleQueryData()
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
        this.showTable = false
        this.loading = false
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
        this.isDownload = true
      },
      setFileData (val) {
        this.ruleForm.isUpload = val
        this.uploadText = '已上传'
        this.uploadStatus = 'success'
      },
      // 表格change事件
      handleAnalysisRules (val) {
        // 切换上传文件解析字段
        switch (val) {
          case 'paper_profit':// 账面盈利表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date', 'refer_date'] // 读取文件数据并以此格式返回数据
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate'] // 读取文件数据并以此格式返回数据
              }
            ])
            break
          case 'fifo':// 先进先出法盈利表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date', 'holdto_date'] // 读取文件数据并以此格式返回数据
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate'] // 读取文件数据并以此格式返回数据
              }
            ])
            break
          case 'lifo':// 后进先出法盈利表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date', 'holdto_date'] // 读取文件数据并以此格式返回数据
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate'] // 读取文件数据并以此格式返回数据
              }
            ])
            break
          case 'profit_term':// 指定账户指定期间卖出指定股票盈利情况表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date', 'refer_date'] // 读取文件数据并以此格式返回数据
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate'] // 读取文件数据并以此格式返回数据
              }
            ])
            break
          case 'profit_period':// 指定账户指定时段卖出指定股票盈利情况表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'trade_date', 'from_time', 'to_time'] // 读取文件数据并以此格式返回数据
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate'] // 读取文件数据并以此格式返回数据
              }
            ])
            break
        }
      },
      handleDownload () {
        this.$message.info('正在导出，请稍等~')
        this.gfnExportFileWithForm('/customqry/dwnfromredis', {flowid: this.flowid})
      },
      downloadExcelMould () {
        if (this.ruleForm.typeValue == '') {
          this.$message.warning('请选择盈利类')
          return
        }
        switch (this.ruleForm.typeValue) {
          case 'paper_profit':// 账面盈利表
            this.gfnDownloadTemplateFile({code: 'stddataqry.paper_profit'})
            break
          case 'profit_term':// 指定账户指定期间卖出指定股票盈利情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.profit_term'})
            break
          case 'fifo':// 先进先出法盈利表
            this.gfnDownloadTemplateFile({code: 'stddataqry.fifo'})
            break
          case 'lifo':// 后进先出法盈利表
            this.gfnDownloadTemplateFile({code: 'stddataqry.lifo'})
            break
          case 'profit_period':// 指定账户指定时段卖出指定股票盈利情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.profit_period'})
            break
        }
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="less">
  .profitTypeBox {
    .el-form-item {
      display: inline-block;
    }
    .uploadBtn {
      display: inline-block;
      margin: 0 10px 0 10px;
    }
    .el-input {
      width: 200px;
    }
    .el-select {
      width: 170px;
      margin-right: 10px;
    }
    .rightBar {
      float: right;
    }
    .chooseSelect {
      width: 120px;
    }

  }
</style>
