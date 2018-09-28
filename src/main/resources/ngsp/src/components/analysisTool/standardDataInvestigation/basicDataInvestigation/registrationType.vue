<template>
  <div class="dealTypeBox">
    <!-- 查询条件 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="small">
      <!--选择类型-->
      <div class="selectBar">
        <el-form-item class="formInline" label="登记结算类：" prop="dealTypeValue">
          <el-select class="typeSelect" @change="changeUplParam" v-model="ruleForm.dealTypeValue" clearable
                     placeholder="请选择登记结算类">
            <el-option
              v-for="item in dealTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="rightBar">
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="loading">查询</el-button>
          <el-button type="text" @click="resetForm('ruleForm')">清空</el-button>
          <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
        </el-form-item>
      </div>
      <!--选择参数-->
      <div v-if="ruleForm.dealTypeValue != ''">
        <div class="selectBar">
          <el-form-item class="formInline" label="选择：" prop="chooseValue">
            <el-select class="chooseSelect" v-model="ruleForm.chooseValue" clearable placeholder="请选择">
              <el-option
                v-for="item in chooseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="formInline" label="请选择：" prop="typeRadio">
            <el-radio-group v-model="ruleForm.typeRadio">
              <el-radio label="1">输入参数</el-radio>
              <el-radio label="2">上传附件</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!--输入参数-->
        <div class="paramBar" v-if="ruleForm.typeRadio == '1'">
          <el-form-item prop="idNum" class="formInline" v-if="ruleForm.chooseValue == '2'" label="身份证：">
            <el-input v-model="ruleForm.idNum" placeholder="请输入身份证"></el-input>
          </el-form-item>
          <el-form-item prop="shareHolder" class="formInline" v-if="ruleForm.chooseValue == '1'" label="股东代码：">
            <el-input v-model="ruleForm.shareHolder" type="textarea" :autosize="{ minRows:1,maxRows:2 }"
                      placeholder="多个代码以英文逗号隔开"></el-input>
          </el-form-item>
          <span v-if="ruleForm.dealTypeValue == 'hold_info'">
          <el-form-item class="formInline" label="证券代码：" prop="codeNum">
            <el-input v-model="ruleForm.codeNum" type="textarea" :autosize="{ minRows:1,maxRows:2 }"
                      placeholder="多个代码以英文逗号隔开"></el-input>
          </el-form-item>
          <el-form-item class="formInline" label="开户以来：" prop="isOpenAccount">
            <el-radio-group v-model="ruleForm.isOpenAccount">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="ruleForm.isOpenAccount == 'N'" class="dateBar formInline" label="选择日期：" prop="datetime">
            <el-date-picker
              type="daterange"
              v-model="ruleForm.datetime"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          </span>
        </div>
        <!--上传附件-->
        <div class="paramBar" v-if="ruleForm.typeRadio == '2'">
          <el-form-item label-width="10px" prop="isUpload" class="noRuleMsg formInline">
            <file-upload
              class="uploadBtn"
              ref="upload"
              :isShowSuccessMessage="true"
              :limitFileType="['xls', 'xlsx']"
              :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
              :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
              :uploadParams="uploadParams"
              @getTxtCon="setFileData"></file-upload>
            <el-tag :type="uploadStatus">{{ uploadText }}</el-tag>
            <el-button size="small" class="uploadBtn" @click="downloadExcelMould" type="primary">下载模板</el-button>
          </el-form-item>
          <el-form-item v-if="ruleForm.dealTypeValue == 'hold_info'" prop="isOpenAccount" label-width="130px" class="formInline" label="开户以来：">
            <el-radio-group v-model="ruleForm.isOpenAccount">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!--查询数据表格-->
    <div v-show="showTable">
      <s-table ref="dealType" :height="600" :columns="dealTypeDataColumns" :data="dealTypeData"
               :isPageination="false"></s-table>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/common/textUpload'
  import { getDayTradeHis } from '../../../../service/analysisTool/standardDataInvestigation'
  import moment from 'moment'

  export default {
    name: 'registration-type',
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        dealTypeOptions: [
          {
            value: 'kh_info',
            label: '指定身份证或股东代码账户开户情况表'
          }, {
            value: 'hold_info',
            label: '指定账户指定期间分托管席位持股情况表'
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
        dealTypeData: {data: []},
        dealTypeDataColumns: [],
        ruleForm: {
          dealTypeValue: '',
          chooseValue: '',
          typeRadio: '',
          idNum: '',
          shareHolder: '',
          codeNum: '',
          isOpenAccount: '',
          datetime: '',
          isUpload: ''
        },
        rules: {
          dealTypeValue: [
            {required: true, message: '请选择登记结算类', trigger: 'change'}
          ],
          chooseValue: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          typeRadio: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          idNum: [
            {required: true, message: '请输入身份证', trigger: 'blur'}
          ],
          shareHolder: [
            {required: true, message: '请输入股东代码', trigger: 'blur'}
          ],
          codeNum: [
            {required: true, message: '请输入证券代码', trigger: 'blur'}
          ],
          isOpenAccount: [
            {required: true, message: '请选择是否开户以来', trigger: 'change'}
          ],
          datetime: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          isUpload: [
            {required: true, message: '请上传附件', trigger: 'change'}
          ]
        },
        uploadParams: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['acct_id', 'sec_code', 'from_date', 'to_date'] // 读取文件数据并以此格式返回数据
            }
          ])
        },
        showTable: false,
        loading: false,
        isDownload: true,
        uploadText: '未上传',
        uploadStatus: 'danger',
        flowid: ''

      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleQueryData()
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
      },
      handleQueryData () { // eslint-disable-line
        this.showTable = true
        this.loading = true
        this.showOrHideLoading(true)
        this.dealTypeData.data = []
        this.dealTypeDataColumns = []
        let params = {}
        let self = this
        switch (this.ruleForm.dealTypeValue) {
          case 'kh_info':
            params = {
              'buszId': this.ruleForm.dealTypeValue,
              'acct_flag': this.ruleForm.chooseValue,
              'acct_id': this.ruleForm.chooseValue === '2' ? this.ruleForm.idNum : this.ruleForm.shareHolder,
              'queryby': this.ruleForm.typeRadio,
              'uploadParam': this.ruleForm.isUpload
            }
            break
          case 'hold_info':
            params = {
              'buszId': self.ruleForm.dealTypeValue,
              'acct_flag': self.ruleForm.chooseValue,
              'acct_id': self.ruleForm.chooseValue === '2' ? self.ruleForm.idNum : self.ruleForm.shareHolder,
              'sec_code': self.ruleForm.codeNum,
              'from_date': self.ruleForm.datetime[0] === '' ? '' : moment(self.ruleForm.datetime[0]).format('YYYY-MM-DD'),
              'to_date': self.ruleForm.datetime[1] === '' ? '' : moment(self.ruleForm.datetime[1]).format('YYYY-MM-DD'),
              'kh_flag': self.ruleForm.isOpenAccount,
              'queryby': self.ruleForm.typeRadio,
              'uploadParam': self.ruleForm.isUpload
            }
            break
        }
        getDayTradeHis(JSON.stringify(params)).then(resp => {
          this.dealTypeData.data = []
          this.dealTypeDataColumns = []
          let colums = resp.ch_colnames
          for (let col in colums) {
            this.dealTypeDataColumns.push({label: colums[col], field: col, align: 'center', width: '120'})
          }
          this.dealTypeData.data = resp.rows
          this.loading = false
          // 导出
          this.flowid = resp.flowId
          if (this.dealTypeData.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.dealType.showOrHideLoading(flag)
      },
      setFileData (val) {
        this.ruleForm.isUpload = val
        this.uploadText = '已上传'
        this.uploadStatus = 'success'
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
        this.showTable = false
        this.loading = false
        this.isDownload = true
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
      },
      changeUplParam (val) {
        // 清空参数
        this.resetForm('ruleForm')
        this.ruleForm.idNum = ''
        this.ruleForm.shareHolder = ''
        this.ruleForm.codeNum = ''
        this.ruleForm.datetime = ''
        this.ruleForm.chooseValue = ''
        this.ruleForm.typeRadio = ''
        this.ruleForm.isOpenAccount = ''
        this.ruleForm.isUpload = ''
        this.ruleForm.dealTypeValue = val
        this.showTable = false
        this.showOrHideLoading(false) // 如果一张表未查询完就切换表查询时取消表格查询遮罩
        // 改变excel参数设置
        switch (val) {
          case 'kh_info':
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id'] // 读取文件数据并以此格式返回数据
              }
            ])
            break
          default:
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date'] // 读取文件数据并以此格式返回数据
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
        switch (this.ruleForm.dealTypeValue) {
          case 'kh_info': // 指定身份证或股东代码账户开户情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.kh_info'})
            break
          case 'hold_info': // 指定账户指定期间分托管席位持股情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.hold_info'})
            break
        }
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="less">
  .dealTypeBox {
    .formInline {
      display: inline-block;
    }
    .chooseSelect {
      width: 110px;
      margin-right: 10px;
    }
    .selectBar {
      margin-bottom: 10px;
      .typeSelect {
        width: 300px;
        margin-right: 10px;
      }
      .rightBar {
        float: right;
      }
      .changeTab {
        display: inline-block;
        .el-radio-button {
          margin-right: 10px;
        }
      }

    }
    .paramBar {
      .el-input {
        width: 200px;
        margin-right: 10px;
      }
      .el-textarea {
        width: 230px;
        margin-right: 10px;
        vertical-align: top;
      }
      .dateBar {
        margin-left: 10px;
      }
      .uploadBtn {
        display: inline-block;
        margin: 0 10px 0 10px;
      }
      .el-button {
        margin-right: 10px;
      }
    }

  }
</style>
