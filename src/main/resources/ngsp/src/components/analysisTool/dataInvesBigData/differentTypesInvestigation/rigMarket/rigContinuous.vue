<template>
  <div class="rigContinuousBox">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" size="small">
      <!--选择类型-->
      <div class="selectBar">
        <el-form-item class="formInline" label="跨期连续操纵：" prop="dealTypeValue">
          <el-select class="typeSelect" v-model="ruleForm.dealTypeValue" clearable placeholder="请选择类别"
                     @change="handleChangeParams">
            <el-option
              v-for="item in dealTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--指定期间买入指定股票盈利情况表参数-->
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
        <el-form-item class="formInline" v-if="ruleForm.dealTypeValue == 'profit_b_inter'">
          <file-upload
            ref="upload"
            class="uploadBtn"
            :isShowSuccessMessage="true"
            :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
            @getTxtCon="setFileData"
            :limitFileType="['xls', 'xlsx']"
            :uploadOption="{size: 'small',type: 'primary',name: '导入Excel'}"
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
          <el-button type="text" :disabled="loading" @click="resetForm('ruleForm')">清空</el-button>
          <el-button type="info" plain @click="handleDownload" :disabled="isDownload">导出</el-button>
        </el-form-item>
      </div>
      <!--指定账户参数-->
      <div class="selectBar"
           v-if="ruleForm.dealTypeValue == 'inter_daily' || ruleForm.dealTypeValue == 'inter_ratio' || ruleForm.dealTypeValue == 'inter_days' || ruleForm.dealTypeValue == 'inter_target' || ruleForm.dealTypeValue == 'inter_acctdaily' ">
        <el-form-item class="formInline" label="请选择：" prop="typeRadio" v-if="ruleForm.chooseValue!==''">
          <el-radio-group v-model="ruleForm.typeRadio">
            <el-radio label="1">输入参数</el-radio>
            <el-radio label="2">上传附件</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--输入参数-->
        <!--证件号或者股东代码-->
        <div class="paramBar formInline" v-if="ruleForm.typeRadio === '1'">
          <el-form-item label="选择日期：" prop="datetime" class="dateBar formInline">
            <el-date-picker
              v-model="ruleForm.datetime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item class="formInline" v-if="ruleForm.chooseValue === '2' " label="身份证：" prop="idNum">
            <el-input v-model="ruleForm.idNum" placeholder="请输入身份证"></el-input>
          </el-form-item>
          <el-form-item class="formInline" v-if="ruleForm.chooseValue === '1' " label="股东代码：" prop="shareHolder">
            <el-input v-model="ruleForm.shareHolder" type="textarea" :autosize="{ minRows:1,maxRows:2 }"
                      placeholder="多个代码以英文逗号隔开"></el-input>
          </el-form-item>
          <!--证券代码-->
          <el-form-item class="formInline" label="证券代码：" prop="codeNum">
            <el-input v-model="ruleForm.codeNum" type="textarea" :autosize="{ minRows:1,maxRows:2 }"
                      placeholder="多个代码以英文逗号隔开"></el-input>
          </el-form-item>
        </div>
        <!--上传附件-->
        <div class="paramBar formInline" v-if="ruleForm.typeRadio == '2'">
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
        </div>
      </div>
    </el-form>
    <!--查询数据表格-->
    <div v-show="showTable">
      <s-table ref="rigContinuous" :height="600" :columns="rigContinuDataColumns" :data="rigContinuData"
               :isPageination="false"></s-table>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/common/textUpload'
  import { getDayTradeHisBigData } from '../../../../../service/analysisTool/dataInvesBigData'

  export default {
    name: 'rig-continuous',
    components: {
      FileUpload,
      STable: () => import('@/components/base/STable')
    },
    data () {
      return {
        dealTypeOptions: [
          {
            value: 'inter_daily',
            label: '逐日申报、撤单、成交、对倒、持仓情况表'
          }, {
            value: 'inter_ratio',
            label: '连续交易期间各项占比情况表'
          }, {
            value: 'inter_days',
            label: '连续交易期间各项占比天数统计表'
          }, {
            value: 'inter_target',
            label: '指定期间刑事追诉指标情况表'
          }, {
            value: 'inter_acctdaily',
            label: '分账户逐日成交、持仓情况表'
          }, {
            value: 'profit_b_inter',
            label: '指定期间买入指定股票盈利情况表'
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
        rigContinuData: {data: []},
        rigContinuDataColumns: [],
        showTable: false,
        loading: false,
        isDownload: true,
        ruleForm: {
          dealTypeValue: '',
          chooseValue: '',
          typeRadio: '',
          datetime: '',
          idNum: '',
          shareHolder: '',
          codeNum: ''
        },
        rules: {
          dealTypeValue: [
            {required: true, message: '请选择类别', trigger: 'change'}
          ],
          chooseValue: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          typeRadio: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          datetime: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          idNum: [
            {required: true, message: '请输入身份证', trigger: 'blur'}
            // {min: 18, max: 18, message: '长度为 18 个字符', trigger: 'blur'}
          ],
          shareHolder: [
            {required: true, message: '请输入股东代码', trigger: 'blur'}
          ],
          codeNum: [
            {required: true, message: '请输入证券代码', trigger: 'blur'}
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
        uploadData: {},
        uploadText: '未上传',
        uploadStatus: 'danger',
        flowid: '',
        requestParams: {}
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
      handleChangeParams (val) {
        // let paramsRules = this.uploadParams.params[0], ruleArr = []
        switch (val) {
          case 'inter_daily':// 逐日申报、撤单、成交、对倒、持仓情况表
          case 'inter_ratio':// 连续交易期间各项占比情况表
          case 'inter_days':// 连续交易期间各项占比天数统计表
          case 'inter_target':// 指定期间刑事追诉指标情况表
          case 'inter_acctdaily':// 分账户逐日成交、持仓情况表
            this.uploadParams.parseRules = JSON.stringify([
              {
                firstToSkip: 1, // 前置忽略项
                fields: ['acct_id', 'sec_code', 'from_date', 'to_date']
              }
            ])
            break
          case 'profit_b_inter':// 指定期间买入指定股票盈利情况表
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
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.$nextTick(()=>{
          this.$refs.ruleForm.clearValidate()
        })
        this.uploadData = {}
        this.showTable = false
        this.loading = false
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
        this.isDownload = true
      },
      handleQueryData () {
        this.changeParams()
        this.showOrHideLoading(true)
        this.rigContinuData.data = []
        this.rigContinuDataColumns = []
        this.showTable = true
        this.loading = true
        getDayTradeHisBigData(JSON.stringify(this.requestParams)).then(resp => {
          this.rigContinuData.data = []
          this.rigContinuDataColumns = []
          let colums = resp.ch_colnames
          for (let col in colums) {
            this.rigContinuDataColumns.push({label: colums[col], field: col, align: 'center', width: '120'})
          }
          this.rigContinuData.data = resp.rows
          this.flowid = resp.flowId
          this.loading = false
          if (this.rigContinuData.data.length > 0) {
            this.isDownload = false
          } else {
            this.isDownload = true
          }
          this.showOrHideLoading(false)
        })
      },
      showOrHideLoading (flag) {
        this.$refs.rigContinuous.showOrHideLoading(flag)
      },
      // 切换参数
      changeParams () {
        if (this.ruleForm.dealTypeValue == 'profit_b_inter') {
          this.requestParams = {
            buszId: this.ruleForm.dealTypeValue,
            acct_flag: this.ruleForm.chooseValue,
            queryby: '2',
            uploadParam: this.uploadData
          }
        }
        switch (this.ruleForm.typeRadio) {
          case '1':
            this.requestParams = {
              buszId: this.ruleForm.dealTypeValue,
              acct_flag: this.ruleForm.chooseValue,
              acct_id: '',
              queryby: '1',
              sec_code: this.ruleForm.codeNum,
              from_date: this.ruleForm.datetime[0],
              to_date: this.ruleForm.datetime[1]
            }
            switch (this.ruleForm.chooseValue) {
              case '1':
                this.requestParams.acct_id = this.ruleForm.shareHolder
                break
              case '2':
                this.requestParams.acct_id = this.ruleForm.idNum
                break
            }
            break
          case '2':
            this.requestParams = {
              buszId: this.ruleForm.dealTypeValue,
              acct_flag: this.ruleForm.chooseValue,
              kh_flag: 'N',
              queryby: this.ruleForm.typeRadio,
              uploadParam: this.uploadData
            }
            break
        }
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
        switch (this.ruleForm.dealTypeValue) {
          case 'inter_daily':// 逐日申报、撤单、成交、对倒、持仓情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.inter_daily'})
            break
          case 'inter_ratio':// 连续交易期间各项占比情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.inter_ratio'})
            break
          case 'inter_days':// 连续交易期间各项占比天数统计表
            this.gfnDownloadTemplateFile({code: 'stddataqry.inter_days'})
            break
          case 'inter_target':// 指定期间刑事追诉指标情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.inter_target'})
            break
          case 'inter_acctdaily':// 分账户逐日成交、持仓情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.inter_acctdaily'})
            break
          case 'profit_b_inter':// 指定期间买入指定股票盈利情况表
            this.gfnDownloadTemplateFile({code: 'stddataqry.profit_b_inter'})
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
  .rigContinuousBox {
    .formInline {
      display: inline-block;
    }
    .uploadBtn {
      display: inline-block;
      margin: 0 10px 0 10px;
    }
    .selectBar {
      margin-bottom: 10px;
      .typeSelect {
        width: 310px;
        margin-right: 10px;
      }
      .chooseSelect {
        width: 110px;
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
      .el-button {
        margin-right: 10px;
      }
    }

  }
</style>
