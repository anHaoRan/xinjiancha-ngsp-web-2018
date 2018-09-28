<template>
  <el-card class="clueFormCard1">
    <div slot="header">
      线索基本信息
    </div>
    <el-form :model="formCard1" ref="formCard1" label-width="145px" :rules="rules">
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="线索编号：" prop="clueNo">
          <el-input class="custom-width" disabled v-model="formCard1.clueNo" placeholder="输入内容在50个字以内" size="small" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="线索名称：" prop="clueName">
          <el-input class="custom-width" :disabled="disabled" v-model="formCard1.clueName" placeholder="输入内容在20个字以内" size="small" :maxlength="20"></el-input>
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
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="线索描述：" prop="clueDesc">
          <el-input style="width:78%" :readonly="disabled" v-model="formCard1.clueDesc" type="textarea" placeholder="输入内容在500字以内" size="small" :maxLength="500"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="是否线索上报：" prop="needReport">
          <el-radio-group v-model="formCard1.needReport" :disabled="disabled">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="线索分类：" prop="clueBranch">
          <el-radio-group v-model="formCard1.clueBranch" :disabled="disabled">
            <el-radio :label="'0'">关注类</el-radio>
            <el-radio :label="'1'">调查类</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="线索类型：" prop="clueType">
          <el-checkbox-group v-model="formCard1.clueType" :disabled="disabled" @change="handleClueTypeChange">
            <el-checkbox :label="String(index)" v-for="(item, index) in clueTypeOptions" :key="index">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="线索会商纪要：" prop="fileList">
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
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="附件：" prop="fileList1">
          <div v-if="showUploadButton" style="min-width:200px">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadBasicUrl1"
              :disabled="disabled"
              :uploadOption="uploadOption1"
              :limitFileType="defaultLimitFileType"
              :limitFileSize="20"
              :limit="100"
              :propsFileList="formCard1.fileList1"
              @handlePreview="handlePreview1"
              @handleRemove="handleRemove"
              @getTxtCon="getFileList"
            ></text-upload>
          </div>
          <div v-else>
            <span v-if="formCard1.fileList1.length > 0">
              <span
                style="display: block;"
                v-for="item in formCard1.fileList1"
                :key="item.fileId">
              {{item.name}}
            </span>
            </span>
            <span v-else>无附件</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="线索来源分类：" prop="sourceType">
          <el-select class="custom-width" :disabled="disabled || !!fromInfoId" v-model="formCard1.sourceType" placeholder="" size="small"
                     @change="handleSourceTypeChange">
            <el-option
              v-for="(item, index) in sourceTypeOptions"
              :key="String(index)"
              :label="item"
              :value="String(index)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="!fromInfoId">
        <el-form-item label="线索来源：" prop="source">
          <el-input style="width:78%" :readonly="disabled" v-model="formCard1.source" type="textarea" placeholder="输入内容在200字以内" size="small" :maxLength="200"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="fromInfoId">
        <el-form-item label="线索来源：">
          <a class="link-common-css" @click="gotoOtherFlowPage">{{fromTitle}}</a>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="搜索关键字：" prop="keyword">
          <el-input
            class="custom-width"
            :readonly="disabled"
            v-model="formCard1.keyword"
            placeholder="输入内容在50字以内"
            size="small"
            :maxLength="50"></el-input>
          注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
        </el-form-item>
      </el-col>
    </el-form>
    <el-col style="margin-bottom:10px">
      <span style="margin-right: 60px;">上报账户</span>
      <el-input :maxlength="10" :readonly="disabled" size="small" style="width: 280px;margin-right: 10px" placeholder="回车或按下添加按钮进行添加账户信息" v-model="addAccountCodeText" @keyup.enter.native="handleSearchAccount"></el-input>
      <el-button :disabled="disabled" type="primary" size="small" @click="handleSearchAccount">＋添加</el-button>
      <el-button :disabled="disabled" type="primary" size="small" @click="deleteRow(1)">－删除</el-button>
      <text-upload :uploadOption="uploadOption" @getTxtCon="updateAccountInfoByAccounts"
                   style="margin-top:20px;display: inline;"></text-upload>
    </el-col>
    <el-col>
      <can-edit-table-common
        :loading.sync = "loading1"
        :tableData.sync="accountInfos"
        :columns="card1Columns"
        :disabled="disabled"
        @handleSelectionChange="handleSelectionChange1"
        @searchInfo="updateAccountInfoByAccounts"></can-edit-table-common>
    </el-col>
    <el-col>
      <el-col :span="11">
        <el-col style="margin:15px">
          <span style="margin-right: 60px;">重点监控证券</span>
          <el-input :maxlength="10" :readonly="disabled" size="small" style="width: 280px;margin-right: 10px" placeholder="回车或按下添加按钮进行添加重点监控证券" v-model="addMonitorNoText1" @keyup.enter.native="handleSearchMonitorNoText1"></el-input>
          <el-button :disabled="disabled" type="primary" size="small" @click="handleSearchMonitorNoText1">＋添加</el-button>
          <el-button :disabled="disabled" type="primary" size="small" @click="deleteRow(2)">－删除</el-button>
        </el-col>
        <el-col>
          <can-edit-table-common
            :loading.sync = "loading2"
            :tableData.sync="monitorSecurity"
            :columns="[{
              field: 'monitorSecurityNo', label: '监控编号', isTemplate: true
            },{
              field: 'security', label: '证券代码及简称'
            }]"
            :disabled="disabled"
            :propsType="1"
            @handleSelectionChange="handleSelectionChange2"
            @searchInfo="updateMonitorSecurityInfoByCode"></can-edit-table-common>
        </el-col>
      </el-col>
      <el-col :span="11" :offset="2">
        <el-col style="margin:15px">
          <span style="margin-right: 60px;">重点监控账户组</span>
          <el-input :maxlength="10" :readonly="disabled" size="small" style="width: 280px;margin-right: 10px" placeholder="回车或按下添加按钮进行添加重点监控账户组" v-model="addMonitorNoText2" @keyup.enter.native="handleSearchMonitorNoText2"></el-input>
          <el-button :disabled="disabled" type="primary" size="small" @click="handleSearchMonitorNoText2">＋添加</el-button>
          <el-button :disabled="disabled" type="primary" size="small" @click="deleteRow(3)">－删除</el-button>
        </el-col>
        <el-col>
          <can-edit-table-common
            :loading.sync = "loading3"
            :tableData.sync="accountGroup"
            :disabled="disabled"
            :propsType="2"
            :columns="[{
              field: 'groupNo', label: '监控编号', isTemplate: true
            },{
              field: 'groupName', label: '账户组名称'
            }]"
            @handleSelectionChange="handleSelectionChange3"
            @searchInfo="updateAccountGroupByCode"></can-edit-table-common>
        </el-col>
      </el-col>
    </el-col>
  </el-card>
</template>
<script>
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import MarginTable from '@/components/base/MarginTable'
  import textUpload from '@/components/common/textUpload'
  import canEditTableCommon from './canEditTableCommon'
  import {clueTypeOptions, sourceTypeOptions, card1Columns, assortmentOptions} from '../component/constants'
  import {
    uploadFileCommon, getaccountinfo, getMonitorGroupsInfo, getMonitorSecurityInfo
  } from '@/service/superviseTask'
  export default {
    components: {StockCodeQuery, MarginTable, textUpload, canEditTableCommon},
    props: {
      accountInfosProps: {
        type: Array,
        default() {
          return []
        }
      },
      accountGroupProps: {
        type: Array,
        default() {
          return []
        }
      },
      monitorSecurityProps: {
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
        type: [String, Number],
        default: ''
      },
      defaultLimitFileType: {
        type: Array,
        default: []
      },
      fromInfoId: {
        type: String,
        default: ''
      },
      fromTitle: {
        type: String,
        default: ''
      }
    },
    watch: {
      'formCard1.stockCode': {
        handler(newValue) {
          this.commonData.stockCode = newValue
          this.formCard1.nullStockCode = newValue.length ? 0 : 1
        },
        immediate: true,
        deep: true
      },
      'formCard1.clueType': {
        handler(newValue) {
          this.handleClueTypeChange(newValue)
        },
        deep: true
      },
      'formCard1.sourceType': {
        handler(newValue) {
          this.handleSourceTypeChange(newValue)
        },
        deep: true
      },
      disabled(newValue) {
        this.commonData.disabled = newValue
        this.uploadOption.disabledflag = newValue
      },
      accountInfosProps(newValue) {
        this.accountInfos = newValue
      },
      accountGroupProps(newValue) {
        this.accountGroup = newValue
      },
      monitorSecurityProps(newValue) {
        this.monitorSecurity = newValue
      },
      loadingProps(newValue) {
        this.loading1 = newValue
        this.loading2 = newValue
        this.loading3 = newValue
      },
      infoId(newValue) {
        this.uploadBasicUrl = uploadFileCommon(newValue, 'clueMeetingSummary')
        this.uploadBasicUrl1 = uploadFileCommon(newValue, 'lad_basicInfo_attachment')
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
        clueTypeOptions,
        sourceTypeOptions,
        card1Columns,
        loading1: false,
        loading2: false,
        loading3: false,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'clueMeetingSummary'),
        uploadBasicUrl1: uploadFileCommon(this.infoId, 'lad_basicInfo_attachment'),
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
        selectStockCodes: [],
        selectAccountGroup: [],
        accountInfos: [],
        accountGroup: [],
        monitorSecurity: [],
        rules: {
          clueNo: {
            required: true, message: '请输入线索编号'
          },
          clueName: {
            required: true, message: '请输入线索名称'
          },
          stockCode: [
            {
              validator: validateStockCode
            }
          ],
          needReport: {
            required: true, message: '请选择是否线索上报'
          },
          clueBranch: {
            required: true, message: '请选择线索分类'
          },
          clueType: {
            required: true, message: '请选择线索类型'
          },
          sourceType: {
            required: true, message: '请选择线索来源类型'
          }
        },
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        },
        addAccountCodeText: '',
        addMonitorNoText1: '',
        addMonitorNoText2: ''
      }
    },
    methods: {
      gotoOtherFlowPage() {
        switch(String(this.formCard1.sourceType)) {
          case '0':
            window.open(`#/replyLetterFormPage?operate=1&instanceId=${this.fromInfoId}&isNewTab=true`)
            break
          case '1':
            window.open(`#/halfform?operate=1&instanceId=${this.fromInfoId}&isNewTab=true`)
            break
          case '4':
            window.open(`#/overBuiltAccountGroup?operate=1&instanceId=${this.fromInfoId}&isNewTab=true`)
            break
          case '5':
            window.open(`#/overMonitorSecurity?operate=1&instanceId=${this.fromInfoId}&isNewTab=true`)
            break
        }
      },
      handleClueTypeChange(val) {
        this.formCard1.clueTypeText = val.map(v => {
          return clueTypeOptions[v]
        })
      },
      handleSourceTypeChange(val) {
        this.formCard1.sourceTypeText = sourceTypeOptions[val]
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard1.stockCode = stockCodeData
        this.formCard1.nullStockCode = stockCodeData.length ? 0 : 1
        this.$emit('updateStockCodeToForm2')
      },
      handleRadioChange() {
        this.formCard1.stockCode = []
        this.commonData.stockCode = []
        this.$emit('updateStockCodeToForm2')
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
      handlePreview1 (file) {
        let fileId = ''
        for (let item of this.formCard1.fileList1) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.$emit('downloadFile', fileId, file)
      },
      handleSearchAccount() {
        if (!this.addAccountCodeText) {
          this.$message.error('请输入账户代码！')
          return
        }
        let reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(this.addAccountCodeText)) {
          this.$message.error('只能输入数字和字母！')
          return
        }
        let isHas = this.accountInfos.filter(v => {
          return v.accountCode === this.addAccountCodeText
        }).length
        if (isHas) {
          this.$message.error('输入账户代码重复！')
        } else {
          this.updateAccountInfoByAccounts([this.addAccountCodeText], 1)
        }
      },
      updateAccountInfoByAccounts (TxtData, enterSearchFlag) {
        TxtData = [...new Set(TxtData)]
        this.loading1 = true
        getaccountinfo(TxtData.join(',')).then((resp) => {
          this.loading1 = false
          const list = resp.bizData.metaData
          if (list.length) {
            list.forEach(v => {
              v.accountName = v.accountPeople
              v.assortment = assortmentOptions[String(v.assortment)]
              v.infoId = this.infoId
            })
          } else {
            setTimeout(() => {
              if (enterSearchFlag) {
                this.$message.error('输入的账户代码不存在')
              }
            })
          }
          let origin = this.accountInfos.map(v => {
            return v.accountCode
          })
          let filterItem = list.filter(v => { // 去重
            return origin.indexOf(v.accountCode) === -1
          })
          this.accountInfos = [...new Set([...filterItem, ...this.accountInfos])]
          this.$emit('updateAccountInfos', this.accountInfos)
        })
      },
      handleSearchMonitorNoText1() {
        if (!this.addMonitorNoText1) {
          this.$message.error('请输入监控编号！')
          return
        }
        let reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(this.addMonitorNoText1)) {
          this.$message.error('只能输入数字和字母！')
          return
        }
        let isHas = this.monitorSecurity.filter(v => {
          return v.monitorSecurityNo === this.addMonitorNoText1
        }).length
        if (isHas) {
          this.$message.error('输入监控编号重复！')
        } else {
          this.updateMonitorSecurityInfoByCode([this.addMonitorNoText1])
        }
      },
      updateMonitorSecurityInfoByCode(code) {
        if (!code) {
          this.$message.error('请输入监控编号')
          return
        }
        this.loading2 = true
        getMonitorSecurityInfo(code).then((resp) => {
          this.loading2 = false
          let list = resp.MscAllRec.filter(v => {
            return v.monitorNo.length === 10 // 有效信息
          })
          if (list.length) {
            list.forEach(v => {
              v.monitorSecurityNo = v.monitorNo
              v.security = v.subject
              v.infoIdMsc = v.infoId
              v.infoId = this.infoId
            })
            this.monitorSecurity = this.monitorSecurity.filter(v => {
              return v.monitorSecurityNo !== code
            })
            this.monitorSecurity = [...this.monitorSecurity, ...list]
            this.$emit('updateMonitorSecurityInfo', this.monitorSecurity)
          } else {
            this.$message.error('输入的监控编号不存在')
          }
        })
      },
      handleSearchMonitorNoText2() {
        if (!this.addMonitorNoText2) {
          this.$message.error('请输入监控编号！')
          return
        }
        let reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(this.addMonitorNoText2)) {
          this.$message.error('只能输入数字和字母！')
          return
        }
        let isHas = this.accountGroup.filter(v => {
          return v.groupNo === this.addMonitorNoText2
        }).length
        if (isHas) {
          this.$message.error('输入监控编号重复！')
        } else {
          this.updateAccountGroupByCode([this.addMonitorNoText2])
        }
      },
      updateAccountGroupByCode(code) {
        this.loading3 = true
        getMonitorGroupsInfo(code).then((resp) => {
          this.loading3 = false
          let list = resp.MagAllRec.filter(v => {
            return v.monitorNo.length === 10 // 有效信息
          })
          if (list.length) {
            list.forEach(v => {
              v.groupNo = v.monitorNo
              v.groupName = v.accountName
              v.infoIdMag = v.infoId
              v.infoId = this.infoId
            })
            this.accountGroup = this.accountGroup.filter(v => {
              return v.groupNo !== code
            })
            this.accountGroup = [...this.accountGroup, ...list]
            this.$emit('updateMonitorGroupsInfo', this.accountGroup)
          } else {
            this.$message.error('输入的监控编号不存在')
          }
        })
      },
      handleSelectionChange1(val) {
        this.selectAccountCodes = val.map(v => {
          return v.accountCode
        })
      },
      handleSelectionChange2(val) {
        this.selectStockCodes = val.map(v => {
          return v.monitorSecurityNo
        })
      },
      handleSelectionChange3(val) {
        this.selectAccountGroup = val.map(v => {
          return v.groupNo
        })
      },
      deleteRow (flag) {
        switch (flag) {
          case 1:
            if (this.selectAccountCodes.length) {
              this.accountInfos = this.accountInfos.filter(v => {
                return this.selectAccountCodes.indexOf(v.accountCode) === -1
              })
            } else {
              this.$message.error('请先选择上报账户')
            }
            this.$emit('updateAccountInfos', this.accountInfos)
            break;
          case 2:

            if (this.selectStockCodes.length) {
              this.monitorSecurity = this.monitorSecurity.filter(v => {
                return this.selectStockCodes.indexOf(v.monitorSecurityNo) === -1
              })
            } else {
              this.$message.error('请先选择重点监控证券')
            }
            this.$emit('updateMonitorSecurityInfo', this.monitorSecurity)
            break;
          case 3:
            if (this.selectAccountGroup.length) {
              this.accountGroup = this.accountGroup.filter(v => {
                return this.selectAccountGroup.indexOf(v.groupNo) === -1
              })
            } else {
              this.$message.error('请先选择重点监控账户组')
            }
            this.$emit('updateMonitorGroupsInfo', this.accountGroup)
            break;
        }

      },
      appendRow (flag) {
        switch (flag) {
          case 1:
            this.accountInfos.unshift({
              'accountCode': '',
              'accountName': '',
              'memberName': '',
              'salepartName': '',
              'oneword': '',
              'assortment': ''
            })
            break;
          case 2:
            this.monitorSecurity.unshift({
              'monitorSecurityNo': '',
              'security': ''
            })
            break;
          case 3:
            this.accountGroup.unshift({
              'groupNo': '',
              'groupName': ''
            })
            break;
        }
      },
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
  .clueFormCard1 {
    padding-bottom: 20px;
    .custom-width {
      width: 350px;
    }
  }
</style>
