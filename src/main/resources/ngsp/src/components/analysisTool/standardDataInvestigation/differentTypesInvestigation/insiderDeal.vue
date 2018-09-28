<template>
  <div class="insiderDealBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="100px">
      <el-form-item label="内幕交易：" prop="typeValue">
        <el-select v-model="ruleForm.typeValue" placeholder="请选择类别" clearable @change="insiderChange">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择：" prop="chooseValue">
        <el-select v-model="ruleForm.chooseValue" placeholder="请选择" clearable>
          <el-option
            v-for="item in chooseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <file-upload
          ref="upload"
          class="uploadBtn"
          :isShowSuccessMessage="true"
          :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
          @getTxtCon="setFileData"
          :limitFileType="['xls', 'xlsx']"
          :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
          :uploadParams="uploadParams"
          style="vertical-align: top;"></file-upload>
        <el-tag :type="uploadStatus"> {{ uploadText }}</el-tag>
        <el-button
          class="uploadBtn"
          @click="downloadExcelMould"
          size="small"
          type="primary"
          style="vertical-align: top;margin-left: 10px;">下载模板
        </el-button>
      </el-form-item>
      <el-form-item class="rightBar">
        <el-button type="primary" :disabled="loading" @click="submitForm('ruleForm')">查询</el-button>
        <el-button type="text" @click="resetForm('ruleForm')">清空</el-button>
        <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <div v-show="showTable">
      <s-table ref="insiderDeal" :height="600" :columns="insiderDealDateColumns" :data="insiderDealDate"
               :isPageination="false"></s-table>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/common/textUpload'
  import { getDayTradeHis } from '../../../../service/analysisTool/standardDataInvestigation'

  export default {
    name: 'insider-deal',
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        typeOptions: [
          {
            value: 'instrd_profit',
            label: '获利型'
          }, {
            value: 'instrd_avdamage',
            label: '避损型'
          }],
        chooseOptions: [
          {
            value: '2',
            label: '身份证'
          }, {
            value: '1',
            label: '股东代码'
          }
        ],
        ruleForm: {
          typeValue: '',
          chooseValue: ''
        },
        rules: {
          typeValue: [
            {required: true, message: '请选择类别', trigger: 'change'}
          ],
          chooseValue: [
            {required: true, message: '请选择', trigger: 'change'}
          ]
        },
        insiderDealDate: {data: []},
        insiderDealDateColumns: [],
        showTable: false,
        loading: false,
        uploadText: '未上传',
        uploadStatus: 'danger',
        isDownload: true,
        flowid: '',
        uploadExcelData: {},
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: []
            }
          ])
        }
      }
    },
    methods: {
      handleQueryData () {
        let params = {
          acct_flag: this.ruleForm.chooseValue,
          buszId: this.ruleForm.typeValue,
          queryby: '2',
          uploadParam: this.uploadExcelData
        }
        this.insiderDealDate.data = []
        this.insiderDealDateColumns = []
        this.showTable = true
        this.showOrHideLoading(true)
        this.loading = true
        getDayTradeHis(JSON.stringify(params)).then(resp => {
          this.insiderDealDate.data = []
          this.insiderDealDateColumns = []
          let colums = resp.ch_colnames
          Object.keys(colums).forEach((col) => {
            this.insiderDealDateColumns.push({label: colums[col], field: col, align: 'center', width: '120'})
          })
          this.insiderDealDate.data = resp.rows
          this.loading = false
          this.flowid = resp.flowId
          if (this.insiderDealDate.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.insiderDeal.showOrHideLoading(flag)
      },
      insiderChange (val) {
        switch (val) {
          case 'instrd_profit':// 获利型
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date', 'holdto_date', 'calcto_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              }
            ])
            break
          case 'instrd_avdamage':// 避损型
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date', 'holdto_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              }
            ])
            break
        }
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
        this.uploadExcelData = {}
        this.showTable = false
        this.loading = false
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
        this.isDownload = true
      },
      setFileData (val) {
        this.uploadExcelData = val
        this.uploadText = '已上传'
        this.uploadStatus = 'success'
      },
      handleDownload () {
        this.$message.info('正在导出，请稍等~')
        this.gfnExportFileWithForm('/customqry/dwnfromredis', {flowid: this.flowid})
      },
      downloadExcelMould () {
        if (this.ruleForm.typeValue == '') {
          this.$message.warning('请选择内幕交易类型')
          return
        }
        switch (this.ruleForm.typeValue) {
          case 'instrd_profit':// 获利型
            this.gfnDownloadTemplateFile({code: 'stddataqry.instrd_profit'})
            break
          case 'instrd_avdamage':// 避损型
            this.gfnDownloadTemplateFile({code: 'stddataqry.instrd_avdamage'})
            break
        }
      }
    },
    mounted () {

    },
    created () {
    }
  }
</script>

<style scoped lang="less">
  .insiderDealBox {
    .el-form-item {
      display: inline-block;
    }
    .uploadBtn {
      display: inline-block;
      margin: 0 10px 0 10px;
    }
    .rightBar {
      float: right;
    }
    .el-select {
      width: 120px;
    }

  }
</style>
