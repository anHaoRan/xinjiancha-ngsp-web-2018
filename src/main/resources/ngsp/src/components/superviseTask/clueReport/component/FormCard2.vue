<template>
  <el-card class="clueFormCard2">
    <div slot="header">
      发函信息
    </div>
    <el-form :model="formCard2" ref="formCard2" label-width="145px" :rules="rules">
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="证券代码及简称：" style="float:left" required>
          <stock-code-query class="custom-width" :commonData="commonData" @getStockCode="getStockCode" :disabled="disabled"></stock-code-query>
        </el-form-item>
        <el-form-item style="float:left" label-width="50px">
          <el-radio :disabled="disabled" v-model="formCard2.nullStockCode" :label="1" style="margin-top: 8px" @change="handleRadioChange">无证券代码</el-radio>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="函件类型：" prop="letterType">
          <el-cascader
            @change="handleLetterTypChange"
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="letterTypeOptions"
            v-model="formCard2.letterType"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="函件编号：" prop="letterNo">
          <el-input readonly size="small" class="custom-width" v-model="formCard2.letterNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="函件名称：" prop="letterName">
          <el-input size="small" class="custom-width" v-model="formCard2.letterName" :readonly="disabled" :maxlength="50" placeholder="输入内容在50个字以内"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="反馈单位：" prop="fkDepartment">
          <el-radio-group v-model="formCard2.fkDepartment" :disabled="disabled">
            <el-radio :label="'0'">证监会</el-radio>
            <el-radio :label="'1'">稽查局</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="发函单位：" prop="sendDepartment">
          <el-cascader
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="sendDeptOptions"
            v-model="formCard2.sendDepartment"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="发函方式：" prop="sendWay">
          <el-checkbox-group v-model="formCard2.sendWay" :disabled="disabled">
            <el-checkbox :label="String(index)" v-for="(item, index) in sendWayOptions" :key="index">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="发函附件：" prop="fileList">
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
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="备注：" prop="note">
          <el-input :readonly="disabled" style="width:78%" v-model="formCard2.note" type="textarea" placeholder="输入内容在1000字以内" size="small" :maxlength="1000"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
  </el-card>
</template>
<script>
  import {letterTypeOptions, sendDeptOptions, sendWayOptions} from '../component/constants'
  import {uploadFileCommon} from '@/service/superviseTask'
  import textUpload from '@/components/common/textUpload'
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  export default {
    components: {textUpload, StockCodeQuery},
    props: {
      formCard2: {
        type: Object,
        default() {
          return {}
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      showUploadButton: {
        type: Boolean,
        default: false
      },
      infoId: {
        type: String,
        default: ''
      },
      loading: {
        type: Boolean,
        default: false
      },
      loading1: {
        type: Boolean,
        default: false
      },
      defaultLimitFileType: {
        type: Array,
        default: []
      }
    },
    watch: {
      infoId: {
        handler(newValue) {
          this.uploadBasicUrl = uploadFileCommon(newValue, 'lad_letter_attachment') // infoId, fileLoc
        }
      },
      'formCard2.fileList': {
        handler() {
          this.validateFileList()
        },
        deep: true
      },
      'formCard2.stockCode': {
        handler(newValue) {
          this.commonData.stockCode = newValue
          this.formCard2.nullStockCode = newValue.length ? 0 : 1
        },
        immediate: true,
        deep: true
      },
    },
    data() {
      let {operate, processStatus} = this.$route.query
      return {
        letterTypeOptions,
        sendDeptOptions,
        sendWayOptions,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'lad_letter_attachment'),
        rules: {
          letterType: {
            required: true, message: '请选择函件类型'
          },
          letterNo: {
            required: true, message: '请输入函件编号'
          },
          letterName: {
            required: true, message: '请输入函件名称'
          },
          fkDepartment: {
            required: true, message: '请选择反馈单位'
          },
          sendDepartment: {
            required: true, message: '请选择发函单位'
          },
          sendWay: {
            required: true, message: '请选择发函方式'
          },
          fileList: {
            required: true, message: '请上传发函附件'
          }
        },
        handleStatus: operate || '',
        processStatus: processStatus || 0,
        uploadOption1: {
          name: '上传',
          size: 'small',
          type: 'primary'
        },
        uploadOption2: {
          name: '上传',
          size: 'small',
          type: 'primary'
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
      handleLetterTypChange() {
        this.$emit('handleLetterTypChange')
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard2.stockCode = stockCodeData
        this.formCard2.nullStockCode = stockCodeData.length ? 0 : 1
        // this.updateAccountInfoByAccounts(stockCodeData)
      },
      handleRadioChange() {
        this.formCard2.stockCode = []
        this.commonData.stockCode = []
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
      validateFileList() {
        this.$refs['formCard2'].validateField('fileList')
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
  .clueFormCard2 {
    .custom-width {
      width: 350px;
    }
  }
</style>
