<template>
  <div class="shortlineDealBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small">
      <el-form-item label-width="100px" label="选择类别：" prop="typeValue">
        <el-select v-model="ruleForm.typeValue" placeholder="请选择类别" clearable style="width:350px">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="90px" label="选择：" prop="chooseValue">
        <el-select class="chooseSelect" v-model="ruleForm.chooseValue" placeholder="请选择" clearable style="width:110px">
          <el-option
            v-for="item in chooseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="140px" v-if=" ruleForm.typeValue == 'reverses' || ruleForm.typeValue == '' "
                    label="成本计算方法：" prop="calMethod">
        <el-select v-model="ruleForm.calMethod" placeholder="请选择" clearable style="width:120px"
                   @change="handleChangeReverseSale">
          <el-option label="先进先出法" value="1"></el-option>
          <el-option label="后进先出法" value="2"></el-option>
          <el-option label="指定成本法" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="140px" v-if=" ruleForm.typeValue == 'reverseb' " label="匹配方法：" prop="calMethod">
        <el-select v-model="ruleForm.calMethod" placeholder="请选择" clearable style="width:120px"
                   @change="handleChangeReverseBuy">
          <el-option label="先进先出法" value="1"></el-option>
          <el-option label="后进先出法" value="2"></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item class="rightBar">
        <el-button type="primary" :disabled="loading" @click="submitForm('ruleForm')">查询</el-button>
        <el-button type="text" @click="resetForm('ruleForm')">清空</el-button>
        <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <div v-show="showTable">
      <s-table ref="shortlineDeal" :height="600" :columns="shortLineDataColumns" :data="shortLineData"
               :isPageination="false"></s-table>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/common/textUpload'
  import { getDayTradeHis } from '../../../../service/analysisTool/standardDataInvestigation'

  export default {
    name: 'shortline-deal',
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        typeOptions: [
          {
            value: 'reverses',
            label: '指定账户组指定期间反向卖出指定股票盈利情况表'
          }, {
            value: 'reverseb',
            label: '指定账户组指定期间反向买入指定股票盈利情况表'
          }
        ],
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
          chooseValue: '',
          calMethod: ''
        },
        uploadData: {},
        showTable: false,
        loading: false,
        uploadText: '未上传',
        uploadStatus: 'danger',
        isDownload: true,
        flowid: '',
        shortLineData: {data: []},
        shortLineDataColumns: [],
        rules: {
          typeValue: [
            {required: true, message: '请选择类别', trigger: 'change'}
          ],
          chooseValue: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          calMethod: [
            {required: true, message: '请选择方法', trigger: 'change'}
          ]
        },
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
          buszId: this.ruleForm.typeValue,
          uploadParam: this.uploadData,
          queryby: '2',
          acct_flag: this.ruleForm.chooseValue,
          flag: parseInt(this.ruleForm.calMethod)
        }
        this.shortLineData.data = []
        this.shortLineDataColumns = []
        this.showTable = true
        this.showOrHideLoading(true)
        this.loading = true
        getDayTradeHis(JSON.stringify(params)).then(resp => {
          this.shortLineData.data = []
          this.shortLineDataColumns = []
          let colums = resp.ch_colnames
          for (let col in colums) {
            this.shortLineDataColumns.push({label: colums[col], field: col, align: 'center', width: '120'})
          }
          this.shortLineData.data = resp.rows
          this.loading = false
          this.flowid = resp.flowId
          if (this.shortLineData.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.shortlineDeal.showOrHideLoading(flag)
      },
      handleChangeReverseBuy (val) {
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
      },
      handleChangeReverseSale (val) {
        switch (val) {
          case '1':
          case '2':
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'rate_from_date', 'rate_to_date', 'rate']
              }
            ])
            break
          case '3':
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date', 'refer_date']
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
        this.uploadData = {}
        this.showTable = false
        this.loading = false
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
        this.isDownload = true
      },
      setFileData (val) {
        this.uploadData = val
        this.uploadText = '已上传'
        this.uploadStatus = 'success'
      },
      handleDownload () {
        this.$message.info('正在导出，请稍等~')
        this.gfnExportFileWithForm('/customqry/dwnfromredis', {flowid: this.flowid})
      },
      downloadExcelMould () {
        if (this.ruleForm.calMethod == '') {
          this.$message.warning('请选择成本计算方法')
          return
        }
        switch (this.ruleForm.typeValue) {
          case 'reverses':// 指定账户组指定期间反向卖出指定股票盈利情况表
            switch (this.ruleForm.calMethod) {
              case '1':// 先进先出
                this.gfnDownloadTemplateFile({code: 'stddataqry.reverses_fifo'})
                break
              case '2':// 后进先出
                this.gfnDownloadTemplateFile({code: 'stddataqry.reverses_lifo'})
                break
              case '3':// 指定成本
                this.gfnDownloadTemplateFile({code: 'stddataqry.reverses_cost'})
                break
            }
            break
          case 'reverseb':// 指定账户组指定期间反向买入指定股票盈利情况表
            if (this.ruleForm.calMethod === '1') {
              this.gfnDownloadTemplateFile({code: 'stddataqry.reverseb'})
            } else {
              this.gfnDownloadTemplateFile({code: 'stddataqry.reverseb_lifo'})
            }
            break
        }
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="less">
  .shortlineDealBox {
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
  }
</style>
