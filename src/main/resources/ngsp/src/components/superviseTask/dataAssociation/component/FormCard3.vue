<template>
  <el-card class="surveyFormCard3">
    <div slot="header">回函信息</div>
    <el-form :model="formCard3" ref="formCard3" label-width="100px" :rules="rules" :inline="true">
      <el-row>
        <el-col :span="8">
          <el-form-item label="证券代码：" required>
            <stock-code-query class="custom-width" :commonData="commonData" @getStockCode="getStockCode"
                              size="small"></stock-code-query>
          </el-form-item>
          <el-form-item>
            <el-radio :disabled="disabled" v-model="formCard3.nullStockCode" :label="1" @change="handleStockChange">
              无证券代码
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="函件类型：" prop="letterType">
            <el-cascader class="custom-width" v-model="formCard3.letterType" :options="letterTypeOptions" size="small"
                         :disabled="disabled"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="函件编号：" prop="letterNo">
            <el-input class="custom-width" disabled="disabled" v-model="formCard3.letterNo" :maxlength="50"
                      placeholder="" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="函件名称：" prop="letterName">
            <el-input class="custom-width" :disabled="disabled" v-model="formCard3.letterName" :maxlength="50"
                      placeholder="" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="协查类型：" prop="invesType">
            <el-checkbox-group v-model="formCard3.invesType" :disabled="disabled" style="width: 1100px"
                               size="small">
              <el-checkbox v-for="item in invesTypeList" :key="item.label" :label="item.label">{{item.value}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formCard3.invesType.indexOf('o') > -1" :span="8" style="margin-left: 100px;">
          <el-form-item prop="invesTypeOther">
            <el-input :disabled="disabled" v-model="formCard3.invesTypeOther" class="custom-width" placeholder="请输入其他原因"
                      size="small" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注：" prop="note">
            <el-input
              style="width: 900px"
              :disabled="disabled"
              v-model="formCard3.note"
              type="textarea"
              placeholder="输入内容在200字以内"
              size="small"
              :maxLength="200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="反馈单位：" prop="feedbackDept">
            <el-cascader class="custom-width" v-model="formCard3.feedbackDept" :options="deptOptions" size="small"
                         :disabled="disabled"></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="发函方式：" prop="feedbackWay">
            <el-checkbox-group v-model="formCard3.feedbackWay" @change="backWayChange" :disabled="disabled"
                               style="width: 1100px" size="small">
              <el-checkbox name="feedbackWay" v-for="item in backWayList" :key="item.label" :label="item.label">
                {{item.value}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isShowReceiptBill">
        <el-col :span="6">
          <el-form-item label="签收单编号：" prop="receiptNo">
            <el-input class="custom-width" disabled="disabled" v-model="formCard3.receiptNo" placeholder=""
                      size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="margin-top: 5px;">
          <el-button type="primary" @click="download" :disabled="disabled" size="small">签收单模板下载</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="回函附件：" prop="fileList">
          <div v-if="showUploadButton" style="min-width:250px">
            <el-upload
              class="upload-demo"
              :disabled="disabled"
              :file-list="formCard3.fileList"
              :action=uploadBasicUrl
              :on-preview="handlePreview"
              :on-success="getFileList"
              :on-remove="deleteFile"
              style="display:inline-block">
              <el-button :disabled="disabled" type="text" size="small" style="display:inline">上传</el-button>
            </el-upload>
          </div>
          <div v-else>
            <span v-for="item in formCard3.fileList" :key="item.fileId" style="display: block;">{{item.name}}</span>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="拟稿人：" prop="drafter">
            {{formCard3.drafter}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="完成日期：" prop="draftDate">
            {{formCard3.draftDate}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script>
  import moment from 'moment'
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import { letterTypeOptions, invesTypeList, deptOptions, backWayList } from '../component/constants'
  import { uploadFileCommon, downloadReceipt, getReceiptName } from '@/service/superviseTask'

  export default {
    components: {StockCodeQuery},
    props: {
      formCard3: {
        type: Object,
        default () {
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
      infoId: {
        type: String,
        default: ''
      }
    },
    watch: {
      'formCard3.stockCode': {
        handler (val) {
          this.commonData.stockCode = val
          this.formCard3.nullStockCode = val.length ? 0 : 1
        },
        immediate: true,
        deep: true
      },
      disabled: {
        handler (val) {
          this.commonData.disabled = val
        },
        immediate: true
      },
      infoId (newValue) {
        this.uploadBasicUrl = uploadFileCommon(newValue, 'dig_CheckInfo_attachment')
      }
    },
    data () {
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
        letterTypeOptions,
        deptOptions,
        invesTypeList,
        backWayList,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'dig_CheckInfo_attachment'),
        rules: {
          letterType: [
            {required: true, message: '请选择函件类型'}
          ],
          letterNo: [
            {required: true, message: '请输入函件编号'}
          ],
          letterName: [
            {required: true, message: '请输入函件名称'}
          ],
          invesType: [
            {type: 'array', required: true, message: '请至少选择一个协查类型'}
          ],
          feedbackDept: [
            {required: true, message: '请选择反馈单位'}
          ],
          feedbackWay: [
            {type: 'array', required: true, message: '请至少选择一种发函方式', trigger: 'change'}
          ],
          fileList: [
            {required: true, message: '请上传回函附件'}
          ],
          stockCode: [
            {validator: validateStockCode}
          ]
        },
        isShowReceiptBill: false,
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        }
      }
    },
    mounted () {
      this.formCard3.drafter = this.gfnGetRealName()
      this.formCard3.draftDate = moment().format('YYYY-MM-DD')
    },
    methods: {
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard3.stockCode = stockCodeData
        this.formCard3.nullStockCode = stockCodeData.length ? 0 : 1
      },
      handleStockChange (newValue) {
        this.formCard3.stockCode = []
        this.commonData.stockCode = []
      },
      getFileList () {
        this.$emit('getFileList')
      },
      deleteFile (file) {
        this.$emit('deleteFile', file)
      },
      handlePreview (file) {
        let fileId = ''
        for (let item of this.formCard3.fileList) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.$emit('downloadFile', fileId, file)
      },
      backWayChange (val) {
        if (val.indexOf('4') > -1) {
          getReceiptName().then((resp) => {
            this.formCard3.receiptNo = resp
          })
          this.isShowReceiptBill = true
        } else {
          this.isShowReceiptBill = false
        }
      },
      download () {
        downloadReceipt(this.formCard3.receiptNo).then((resp) => {
          window.location.href = this.gfnGetDownloadFileUrl(resp, '签收单模板.docx')
        })
      },
      clearValidate3 () {
        this.$refs['formCard3'].clearValidate()
      },
      validateFormCard () {
        let flag = true
        this.$refs['formCard3'].validate((valid) => {
          flag = valid
        })
        return flag
      }
    }
  }
</script>
<style lang="less" scoped>
  .surveyFormCard3 {
    .custom-width {
      width: 280px;
    }
  }
</style>
