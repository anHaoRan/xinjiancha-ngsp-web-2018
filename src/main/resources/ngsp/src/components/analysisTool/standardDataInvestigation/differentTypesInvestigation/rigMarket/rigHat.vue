<template>
  <div class="rigHatBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="100px">
      <!--表类型-->
      <el-form-item label="抢帽子：" prop="typeValue">
        <el-select v-model="ruleForm.typeValue" placeholder="请选择类型" clearable style="width:270px"
                   @change="handleChangePreMarket2">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择：" prop="chooseValue" v-if=" ruleForm.typeValue != 'qmz_1' && ruleForm.typeValue != ''  ">
        <el-select class="chooseSelect" v-model="ruleForm.chooseValue" placeholder="请选择" clearable>
          <el-option
            v-for="item in chooseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--t分类-->
      <el-form-item label="分类：" prop="tType" v-if=" ruleForm.typeValue != 'qmz_3' && ruleForm.typeValue != '' ">
        <el-select v-model="ruleForm.tType" placeholder="请选择分类" clearable style="width:220px"
                   @change="handleChangePreMarket">
          <el-option
            v-for="item in tTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--上传excel-->
      <el-form-item label-width="20px" v-if=" ruleForm.typeValue != '' ">
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
      <!--右边栏-->
      <el-form-item label-width="20px" class="rightBar">
        <el-button type="primary" :disabled="loading" @click="submitForm('ruleForm')">查询</el-button>
        <el-button type="text" @click="resetForm('ruleForm')">清空</el-button>
        <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
      </el-form-item>
    </el-form>
    <div v-show="showTable">
      <s-table ref="rigHat" :height="600" :columns="rigHatDataColumns" :data="rigHatData"
               :isPageination="false"></s-table>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/common/textUpload'
  import { getDayTradeHis } from '../../../../../service/analysisTool/standardDataInvestigation'

  export default {
    name: 'rig-hat',
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        typeOptions: [
          {
            value: 'qmz_1',
            label: '荐股行为对个股价量影响情况表'
          }, {
            value: 'qmz_2',
            label: '荐股至影响消除日卖出情况表'
          }, {
            value: 'qmz_3',
            label: '账户指定期间交易频度表'
          }, {
            value: 'qmz_4',
            label: '账户组分股票逐个荐股日盈利情况表'
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
        tTypeOptions: [
          {
            value: '1',
            label: 'T日中午荐股'
          }, {
            value: '2',
            label: 'T-1日晚上或T日开市前荐股'
          }
        ],
        ruleForm: {
          typeValue: '',
          chooseValue: '',
          tType: '',
          idNum: '',
          shareHolder: ''
        },
        rules: {
          typeValue: [
            {required: true, message: '请选择类别', trigger: 'change'}
          ],
          chooseValue: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          tType: [
            {required: true, message: '请选择分类', trigger: 'change'}
          ],
          idNum: [
            {required: true, message: '请输入身份证', trigger: 'blur'}
            // { min: 18, max: 18, message: '长度为 18 个字符', trigger: 'blur' }
          ],
          shareHolder: [
            {required: true, message: '请输入股东代码', trigger: 'blur'}
          ]
        },
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: []
            }
          ])
        },
        uploadOption: {
          name: '上传',
          size: 'small'
        },
        uploadTxtData: [],
        uploadExcelData: {},
        uploadText: '未上传',
        uploadStatus: 'danger',
        rigHatData: {data: []},
        rigHatDataColumns: [],
        showTable: false,
        loading: false,
        isDownload: true,
        flowid: ''
      }
    },
    methods: {
      handleQueryData () {
        let params
        if (this.ruleForm.typeValue == 'qmz_3') {
          params = {
            acct_flag: this.ruleForm.chooseValue,
            buszId: this.ruleForm.typeValue,
            queryby: '2',
            uploadParam: this.uploadExcelData
          }
        } else {
          params = {
            acct_flag: this.ruleForm.chooseValue,
            buszId: this.ruleForm.typeValue,
            flag: parseInt(this.ruleForm.tType),
            queryby: '2',
            uploadParam: this.uploadExcelData
          }
        }
        this.rigHatData.data = []
        this.rigHatDataColumns = []
        this.showTable = true
        this.showOrHideLoading(true)
        this.loading = true
        getDayTradeHis(JSON.stringify(params)).then(resp => {
          this.rigHatData.data = []
          this.rigHatDataColumns = []
          let colums = resp.ch_colnames
          for (let col in colums) {
            this.rigHatDataColumns.push({label: colums[col], field: col, align: 'center', width: '120'})
          }
          this.rigHatData.data = resp.rows
          this.loading = false
          this.flowid = resp.flowId
          if (this.rigHatData.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.rigHat.showOrHideLoading(flag)
      },
      handleChangePreMarket2 (value) {
        // 清空录入
        this.ruleForm.tType = ''
        this.ruleForm.chooseValue = ''
        this.ruleForm.idNum = ''
        this.ruleForm.shareHolder = ''
        this.uploadExcelData = ''

        if (this.ruleForm.typeValue == 'qmz_3') {
          this.uploadParams.parseRules = JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['acct_id', 'from_date', 'to_date']
            },
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['trade_date', 'flag', 'sec_code']
            }
          ])
        }
      },
      handleChangePreMarket (val) {
        // let paramsRules = this.uploadParams.params[0], ruleArr = []
        let typeValue = this.ruleForm.typeValue
        switch (typeValue) {
          case 'qmz_1':
            switch (val) {
              case '1':// T日中午荐股
                this.uploadParams.parseRules = JSON.stringify([
                  {
                    firstToSkip: 1, // 前置忽略项
                    fields: ['trade_date', 'sec_code', 'para_n']
                  }
                ])
                break
              case '2':// T-1日晚上或T日开市前荐股
                this.uploadParams.parseRules = JSON.stringify([
                  {
                    firstToSkip: 1, // 前置忽略项
                    fields: ['trade_date', 'sec_code']
                  }
                ])
                break
            }
            break
          case 'qmz_2':
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['trade_date', 'sec_code', 'para_n']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id']
              }
            ])
            break
          case 'qmz_4':
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['trade_date', 'sec_code', 'para_n']
              },
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id']
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
        if (this.ruleForm.typeValue != 'qmz_3' && this.ruleForm.tType == '') {
          this.$message.warning('请选择分类')
          return
        }
        switch (this.ruleForm.typeValue) {
          case 'qmz_1':
            if (this.ruleForm.tType == '1') {
              this.gfnDownloadTemplateFile({code: 'stddataqry.qmz_1_noon'})
            } else {
              this.gfnDownloadTemplateFile({code: 'stddataqry.qmz_1_else'})
            }
            break
          case 'qmz_2':
            if (this.ruleForm.tType == '1') {
              this.gfnDownloadTemplateFile({code: 'stddataqry.qmz_2_noon'})
            } else {
              this.gfnDownloadTemplateFile({code: 'stddataqry.qmz_2_else'})
            }
            break
          case 'qmz_3':
            this.gfnDownloadTemplateFile({code: 'stddataqry.qmz_3'})
            break
          case 'qmz_4':
            if (this.ruleForm.tType == '1') {
              this.gfnDownloadTemplateFile({code: 'stddataqry.qmz_4_noon'})
            } else {
              this.gfnDownloadTemplateFile({code: 'stddataqry.qmz_4_else'})
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
  .rigHatBox {
    .el-form-item {
      display: inline-block;
      vertical-align: top;
    }
    .uploadBtn {
      display: inline-block;
      margin: 0 10px 0 10px;
    }
    .el-input {
      width: 200px;
    }
    .el-select {
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
