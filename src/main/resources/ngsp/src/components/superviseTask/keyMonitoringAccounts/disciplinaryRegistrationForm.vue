<!--纪律处分登记-->
<template>
  <div class="disciplinaryRegistration">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card class="formCard2">
      <div slot="header">
        纪律处分查询单
      </div>
      <el-form :model="formCard2" ref="formCard2" label-width="145px" :rules="rules">
        <el-col :xl="12" :lg="12" :md="12" :sm="24">
          <el-form-item label="编号：" prop="invesNo">
            <el-input class="custom-width" formCardDisabled v-model="formCard2.invesNo" placeholder="" size="small" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="证券代码及简称：" style="float:left" required>
            <stock-code-query class="custom-width" :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
          </el-form-item>
          <el-form-item style="float:left" label-width="50px">
            <el-radio :formCardDisabled="formCardDisabled" v-model="formCard2.nullStockCode" :label="1" style="margin-top: 8px" @change="handleRadioChange">无证券代码</el-radio>
          </el-form-item>
        </el-col>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="发函描述：" prop="letterDesc">
            <el-input style="width:78%" :formCardDisabled="formCardDisabled" v-model="formCard2.letterDesc" type="textarea" placeholder="输入内容在2000字以内" size="small" :maxLength="2000"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="附件：" prop="filelist">
            <div v-if="showUploadButton" style="min-width:200px">
              <text-upload
                :uploadName="'file'"
                :showFileList="true"
                :actionUrl="uploadBasicUrl"
                :formCardDisabled="formCardDisabled"
                :uploadOption="uploadOption1"
                :limitFileType="['pdf', 'txt', 'doc', 'docx']"
                :limitFileSize="10"
                :limit="100"
                :propsFileList="formCard2.fileList"
                @handlePreview="handlePreview"
                @handleRemove="handleRemove"
                @getTxtCon="getFileList"
              ></text-upload>
            </div>
            <div v-else>
            <span v-if="formCard2.fileList.length > 0">
              <span
                style="display: block;"
                v-for="item in formCard2.fileList"
                :key="item.fileId">
              {{item.name}}
            </span>
            </span>
              <span v-else>无附件</span>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card class="formCard3">
      <el-col>
        <account-info-table-component
          :loading.sync = "loading"
          :tableData.sync="tableData"
          :formCardDisabled="formCardDisabled"
          @handleSelectionChange="handleSelectionChange"
          @updateAccountInfoByAccounts="updateAccountInfoByAccounts"
        ></account-info-table-component>
      </el-col>
      <el-col style="margin:15px">
        <el-button :formCardDisabled="formCardDisabled" type="primary" size="small" @click="appendRow">＋添加</el-button>
        <el-button :formCardDisabled="formCardDisabled" type="primary" size="small" @click="deleteRow">－删除</el-button>
        <text-upload :uploadOption="uploadOption" @getTxtCon="updateAccountInfoByAccounts"
                     style="margin-top:20px;display: inline;"></text-upload>
      </el-col>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '@/components/common/Breadcrumb'
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import textUpload from '@/components/common/textUpload'
  import AccountInfoTableComponent from '@/components/superviseTask/superviseTaskComponent/AccountInfoTableComponent'
  import {
    uploadFileCommon, getsuspendtable
  } from '@/service/superviseTask'
  export default {
    components: {Breadcrumb, StockCodeQuery, textUpload, AccountInfoTableComponent},
    computed: {
      formCardDisabled () {
        return String(this.handleStatus) === '1'
      }
    },
    watch: {
      formCard2: {
        handler(newValue) {
          this.commonData.stockCode = newValue.stockCode
          this.formCard2.nullStockCode = newValue.stockCode.length ? 0 : 1
        },
        immediate: true,
        deep: true
      },
      formCardDisabled(newValue) {
        this.commonData.formCardDisabled = newValue
        this.uploadOption.disabledflag = newValue
      },
      infoId(newValue) {
        this.uploadBasicUrl = uploadFileCommon(newValue, 'sls_first_attachment')
      }
    },
    data() {
      let validateStockCode = (rule, value, callback) => {
        if (this.formCard2.nullStockCode) {
          callback()
        }
        if (!this.formCard2.nullStockCode && !value.length) {
          callback(new Error('请选择证券代码'))
        }
        callback()
      }
      return {
        loading: false,
        breadcrumbItems: [
          {
            router: '',
            label: '重点监控账户'
          },
          {
            router: '',
            label: '纪律处分登记单'
          }
        ],
        formCard2: {
          title: '无-集合竞价虚假申报',
          invesNo: '',
          stockCode: [],
          fileList: [],
          nullStockCode: 1,
          investigation: '集合竞价虚假申报',
          abnormalBehav: '拉升虚拟开盘价',
          logs: ''
        },
        showUploadButton: false,
        infoId: '',
        uploadBasicUrl: uploadFileCommon(this.infoId, 'sls_first_attachment'),
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
          formCardDisabled: false,
          stockCode: []
        }
      }
    },
    methods: {
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard2.stockCode = stockCodeData
        this.formCard2.nullStockCode = stockCodeData.length ? 0 : 1
        this.formCard2.title = (stockCodeData[0] ? stockCodeData[0] : '无') + '-' + this.formCard2.investigation
        this.updateAccountInfoByAccounts(stockCodeData)
      },
      handleRadioChange() {
        this.formCard2.stockCode = []
        this.commonData.stockCode = []
        this.formCard2.title = (this.formCard2.stockCode[0] ? this.formCard2.stockCode[0] : '无') + '-' + this.formCard2.investigation
      },
      getFileList() {
        this.$emit('getFileList')
      },
      handleRemove (file) {
        this.$emit('deleteFile', file)
      },
      handlePreview (file) {
        let fileId = ''
        for (let item of this.formCard2.fileList) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.$emit('downloadFile', fileId, file)
      },
      updateAccountInfoByAccounts (TxtData, enterSearchFlag) {
        let originAccountLength = this.tableData.filter(v => {
          return v.accountCode !== ''
        }).length
        let stocks = this.formCard2.stockCode ? this.formCard2.stockCode.join(',') : ''
        let accountCodes = this.tableData.map(v => {
          return v.accountCode
        })
        TxtData = [...new Set(TxtData), ...accountCodes]
        this.loading = true
        getsuspendtable(TxtData.join(','), stocks).then((resp) => {
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
            this.tableData = list
            if (list.length < originAccountLength && enterSearchFlag) {
              this.$message.error('输入的账户代码不存在')
              this.appendRow()
            }
          } else {
            setTimeout(() => {
              if (enterSearchFlag) {
                this.$message.error('输入的账户代码不存在')
                this.appendRow()
              }
            })
          }
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
      appendRow () {
        this.tableData.push({
          'accountCode': '',
          'accountName': '',
          'memberName': '',
          'salepartName': '',
          'oneword': '',
          'accountType': '',
          'contactP1': '',
          'contactNo1': ''
        })
      },
      validateFormCard() {
        let flag = true
        this.$refs['formCard2'].validate((valid) => {
          flag = valid
        })
        return flag
      }
    }
  }
</script>
<style lang="less" scoped>
  .disciplinaryRegistration {
    .custom-width {
      width: 350px;
    }
  }
</style>
