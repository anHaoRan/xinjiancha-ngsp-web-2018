<template>
  <el-card class="slsFormCard1">
    <div slot="header">
      预警基本信息
    </div>
    <el-form :model="formCard1" ref="formCard1" label-width="145px" :rules="rules">
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="标题：" prop="title">
          <el-input class="custom-width" :readonly="disabled || (String(createType) === '0')" v-model="formCard1.title" placeholder="" size="small" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="编号：" prop="invesNo">
          <el-input class="custom-width" readonly v-model="formCard1.invesNo" placeholder="" size="small" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="证券代码及简称：" style="float:left" required>
          <stock-code-query class="custom-width" :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
        </el-form-item>
        <el-form-item style="float:left" label-width="50px">
          <el-radio :disabled="disabled" v-model="formCard1.nullStockCode" :label="1" style="margin-top: 8px" @change="handleRadioChange">无证券代码</el-radio>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="调查事项：" prop="investigation">
          <el-select class="custom-width" :disabled="disabled" v-model="formCard1.investigation" placeholder="" size="small" @change="handleInvestigationChange">
            <el-option
              v-for="item in investigationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="异常行为：" prop="abnormalBehav">
          <el-select class="custom-width" :disabled="disabled" v-model="formCard1.abnormalBehav" placeholder="" size="small" @change="handleAbnormalBehavChange">
            <el-option
              v-for="item in abnormalBehavOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="日志记录：" prop="logs">
          <el-input style="width:78%" :readonly="disabled || isWarningReturnInto" v-model="formCard1.logs" type="textarea" placeholder="输入内容在2000字以内" size="small" :maxLength="2000"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="发函描述：" prop="letterDesc">
          <el-input style="width:78%" :readonly="disabled || isWarningReturnInto" v-model="formCard1.letterDesc" type="textarea" placeholder="输入内容在2000字以内" size="small" :maxLength="2000"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="附件：" prop="filelist">
          <div v-if="showUploadButton" style="min-width:200px">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadBasicUrl"
              :disabled="disabled"
              :uploadOption="uploadOption1"
              :limitFileType="defaultLimitFileType"
              :limitFileSize="20"
              :limit="100"
              :propsFileList="formCard1.fileList"
              @handlePreview="handlePreview"
              @handleRemove="handleRemove"
              @getTxtCon="getFileList"
            ></text-upload>
            <!--<el-upload-->
              <!--:disabled="disabled"-->
              <!--class="upload-demo"-->
              <!--:action=uploadBasicUrl-->
              <!--:file-list="formCard1.fileList"-->
              <!--:on-preview="handlePreview"-->
              <!--:on-success="getFileList"-->
              <!--:on-remove="deleteFile"-->
              <!--style="display:inline-block">-->
              <!--<el-button-->
                <!--:disabled="disabled"-->
                <!--type="text"-->
                <!--size="small"-->
                <!--style="display:inline"-->
              <!--&gt;上传-->
              <!--</el-button>-->
            <!--</el-upload>-->
          </div>
          <div v-else>
            <span v-if="formCard1.fileList.length > 0">
              <span
                style="display: block;"
                v-for="item in formCard1.fileList"
                :key="item.fileId">
              {{item.name}}
            </span>
            </span>
            <span v-else>无附件</span>
          </div>
        </el-form-item>
      </el-col>
    </el-form>
    <el-col style="margin-bottom:10px">
      <el-input :readonly="disabled" size="small" style="width: 280px;margin-right: 10px" placeholder="回车或按下添加按钮进行添加账户信息" v-model="addAccountCodeText" @keyup.enter.native="handleSearchAccount"></el-input>
      <el-button :disabled="disabled" type="primary" size="small" @click="handleSearchAccount">＋添加</el-button>
      <el-button :disabled="disabled" type="primary" size="small" @click="deleteRow">－删除</el-button>
      <text-upload :uploadOption="uploadOption" @getTxtCon="updateAccountInfoByAccounts"
                   style="margin-top:20px;display: inline;"></text-upload>
    </el-col>
    <el-col>
      <account-info-table-component
        :loading.sync = "loading"
        :tableData.sync="tableData"
        :disabled="disabled"
        @handleSelectionChange="handleSelectionChange"
        @updateAccountInfoByAccounts="updateAccountInfoByAccounts"
      ></account-info-table-component>
      <!--<can-edit-table-common-->
        <!--:loading.sync = "loading"-->
        <!--:tableData.sync="tableData"-->
        <!--:disabled="disabled"-->
        <!--@handleSelectionChange="handleSelectionChange"-->
        <!--@updateAccountInfoByAccounts="updateAccountInfoByAccounts"></can-edit-table-common>-->
    </el-col>
  </el-card>
</template>
<script>
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import MarginTable from '@/components/base/MarginTable'
  import textUpload from '@/components/common/textUpload'
  // import canEditTableCommon from './canEditTableCommon'
  import AccountInfoTableComponent from '../../superviseTaskComponent/AccountInfoTableComponent'
  import {investigationOptions, abnormalBehavOptionsList, card1Columns} from '../component/constants'
  import {
    uploadFileCommon, getsuspendtable
  } from '@/service/superviseTask'
  export default {
    components: {StockCodeQuery, MarginTable, textUpload, AccountInfoTableComponent},
    props: {
      tableDataProps: {
        type: Array,
        default() {
          return []
        }
      },
      formCard1: {
        type: Object,
        default() {
          return {}
        }
      },
      showUploadButton: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      loadingProps: {
        type: Boolean,
        default: false
      },
      infoId: {
        type: String,
        default: ''
      },
      createType: {
        type: String,
        default: ''
      },
      isWarningReturnInto: {
        type: Boolean,
        default: false
      },
      defaultLimitFileType: {
        type: Array,
        default: []
      }
    },
    watch: {
      formCard1: {
        handler(newValue) {
          this.commonData.stockCode = newValue.stockCode
          this.formCard1.nullStockCode = newValue.stockCode.length ? 0 : 1
        },
        immediate: true,
        deep: true
      },
      disabled(newValue) {
        this.commonData.disabled = newValue
        this.uploadOption.disabledflag = newValue
      },
      tableDataProps(newValue) {
        this.tableData = newValue
      },
      loadingProps(newValue) {
        this.loading = newValue
      },
      infoId(newValue) {
        this.uploadBasicUrl = uploadFileCommon(newValue, 'sls_first_attachment')
      },
      createType(newValue) {
        if (String(newValue) === '0') {
          this.commonData.disabled = true
        }
      }
    },
    data() {
      let validateStockCode = (rule, value, callback) => {
        if (this.formCard1.nullStockCode) {
          callback()
        }
        if (!this.formCard1.nullStockCode && !value.length) {
          callback(new Error('请选择证券代码'))
        }
        callback()
      }
      return {
        investigationOptions,
        abnormalBehavOptionsList,
        card1Columns,
        loading: false,
        addAccountCodeText: '',
        uploadBasicUrl: uploadFileCommon(this.infoId, 'sls_first_attachment'),
        abnormalBehavOptions: abnormalBehavOptionsList[0],
        tableData: [],
        uploadOption1: {
          name: '上传',
          size: 'small',
          type: 'primary'
        },
        uploadOption: {
          name: '指定导入',
          size: 'small',
          disabledflag: false
        },
        selectAccountCodes: [],
        rules: {
          title: {
            required: true, message: '请输入标题'
          },
          invesNo: {
            required: true, message: '请输入编号'
          },
          stockCode: [
            {
              validator: validateStockCode
            }
          ],
          investigation: {
            required: true, message: '请输入调查事项'
          },
          abnormalBehav: {
            required: true, message: '请输入异常行为'
          },
          logs: {
            required: true, message: '请输入日志记录'
          }
        },
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        }
      }
    },
    methods: {
      handleSearchAccount() {
        if (!this.addAccountCodeText) {
          this.$message.error('请输入证券账户！')
          return
        }
        let reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(this.addAccountCodeText)) {
          this.$message.error('只能输入数字和字母！')
          return
        }
        let isHas = this.tableData.filter(v => {
          return v.accountCode === this.addAccountCodeText
        }).length
        if (isHas) {
          this.$message.error('输入证券账户重复！')
        } else {
          this.updateAccountInfoByAccounts([this.addAccountCodeText], 1)
        }
      },
      handleInvestigationChange (value) {
        const investList = this.investigationOptions.map(v => {
          return v.value
        })
        this.abnormalBehavOptions = this.abnormalBehavOptionsList[investList.indexOf(value)]
        this.formCard1.abnormalBehav = this.abnormalBehavOptions[0]['value']
        this.formCard1.title = (this.formCard1.stockCode[0] ? this.formCard1.stockCode[0] : '无') + '-' + this.formCard1.investigation
        this.$emit('updateTableInvestigationInfo')
      },
      handleAbnormalBehavChange() {
        this.$emit('updateTableInvestigationInfo')
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard1.stockCode = stockCodeData
        this.formCard1.nullStockCode = stockCodeData.length ? 0 : 1
        this.formCard1.title = (stockCodeData[0] ? stockCodeData[0] : '无') + '-' + this.formCard1.investigation
        this.updateAccountInfoByAccounts(stockCodeData)
      },
      handleRadioChange() {
        this.formCard1.stockCode = []
        this.commonData.stockCode = []
        this.formCard1.title = (this.formCard1.stockCode[0] ? this.formCard1.stockCode[0] : '无') + '-' + this.formCard1.investigation
      },
      getFileList() {
        this.$emit('getFileList')
      },
      handleRemove (file) {
        this.$emit('deleteFile', file)
      },
      handlePreview (file) {
        let fileId = ''
        for (let item of this.formCard1.fileList) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.$emit('downloadFile', fileId, file)
      },
      updateAccountInfoByAccounts (TxtData, enterSearchFlag) {
        TxtData = [...new Set(TxtData)]
        this.loading = true
        getsuspendtable(TxtData.join(',')).then((resp) => {
          this.loading = false
          const list = resp.bizData.metaData
          if (list.length) {
            list.forEach(v => {
              v.accttype = v.assortment
              v.member ? v.middlePushCan = '可以' : v.middlePushCan = '不可'
              let reg = /^[A-Za-z]+$/
              if (reg.test(v.assortment)) {
                v.assortment = '是'
              } else {
                v.assortment = '否'
              }
              v.accountName = v.accountPeople
            })
          } else {
            setTimeout(() => {
              if (enterSearchFlag) {
                this.$message.error('输入的账户代码不存在')
              }
            })
          }
          let origin = this.tableData.map(v => {
            return v.accountCode
          })
          let filterItem = list.filter(v => { // 去重
            return origin.indexOf(v.accountCode) === -1
          })
          this.tableData = [...new Set([...filterItem, ...this.tableData])]
          this.$emit('updateRegulatoryHistorysAndObtainenInfo', this.tableData)
        })
      },
      handleSelectionChange(val) {
        this.selectAccountCodes = val.map(v => {
          return v.accountCode
        })
      },
      deleteRow () {
        if (this.selectAccountCodes.length) {
          this.tableData = this.tableData.filter(v => {
            return this.selectAccountCodes.indexOf(v.accountCode) === -1
          })
          this.updateAccountInfoByAccounts(this.tableData)
        } else {
          this.$message.error('请先选择账户')
        }
      },
      // appendRow () {
      //   this.tableData.push({
      //     'accountCode': '',
      //     'accountName': '',
      //     'memberName': '',
      //     'salepartName': '',
      //     'oneword': '',
      //     'accountType': '',
      //     'contactP1': '',
      //     'contactNo1': ''
      //   })
      // },
      validateFormCard() {
        let flag = true
        this.$refs['formCard1'].validate((valid) => {
          flag = valid
        })
        return flag
      }
    }
  }
</script>
<style lang="less" scoped>
  .slsFormCard1 {
    .custom-width {
      width: 350px;
    }
  }
</style>
