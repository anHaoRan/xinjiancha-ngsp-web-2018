<template>
  <el-card class="sendLetterFormCard1">
    <div slot="header">
      发函信息
    </div>
    <el-form :model="formCard1" ref="formCard1" label-width="145px" :rules="rules">
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="证券代码及简称：" required style="float:left">
          <stock-code-query class="custom-width" :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
        </el-form-item>
        <el-form-item label-width="50px" style="float:left">
          <el-radio :disabled="disabled" v-model="formCard1.nullStockCode" :label="1" style="margin-top: 8px" @change="handleRadioChange">无证券代码</el-radio>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="函件类型：" prop="letterType">
          <el-cascader
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="letterTypeOptions"
            v-model="formCard1.letterType"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="函件编号：" prop="letterNo">
          <el-input readonly v-model="formCard1.letterNo" class="custom-width" size="small"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="函件名称：" prop="letterName">
          <el-input placeholder="输入内容在50字以内" :readonly="disabled" v-model="formCard1.letterName" class="custom-width" size="small" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="发送对象：" prop="sentDept">
          <el-cascader
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="sendDeptOptions"
            v-model="formCard1.sentDept"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="发送方式：" prop="sentWay">
          <el-checkbox-group v-model="formCard1.sentWay" :disabled="disabled">
            <el-checkbox :label="String(index)" v-for="(item, index) in sendWayOptions" :key="index">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" v-if="formCard1.drafter">
        <el-form-item label="拟稿人：" prop="drafter">
         {{formCard1.drafter}}
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="完成日期：" prop="finishDate" v-if="formCard1.finishDate">
          {{formCard1.finishDate}}
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="备注：" prop="note">
          <el-input style="width:78%" :readonly="disabled" v-model="formCard1.note" type="textarea" placeholder="输入内容在1000字以内" size="small" :maxlength="1000"></el-input>
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
              :propsFileList="formCard1.fileList"
              @handlePreview="handlePreview"
              @handleRemove="handleRemove"
              @getTxtCon="getFileList"
            ></text-upload>
            <!--<el-upload
              :disabled="disabled"
              class="upload-demo"
              :file-list="formCard1.fileList"
              :action=uploadBasicUrl
              :on-preview="handlePreview"
              :on-success="getFileList"
              :on-remove="deleteFile"
              style="display:inline-block">
              <el-button
                :disabled="disabled"
                type="text"
                size="small"
                style="display:inline"
              >上传
              </el-button>
            </el-upload>-->
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
        <el-form-item label="搜索关键字：" prop="keyword">
          <el-input class="custom-width" size="small" :readonly="disabled" v-model="formCard1.keyword" :maxlength="50" placeholder="输入内容在50字以内"></el-input>
          注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
        </el-form-item>
      </el-col>
    </el-form>
  </el-card>
</template>
<script>
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import textUpload from '@/components/common/textUpload'
  import {letterTypeOptions, sendDeptOptions, sendWayOptions} from '../component/constants'
  import {uploadFileCommon} from '@/service/superviseTask'
  export default {
    components: {StockCodeQuery, textUpload},
    props: {
      formCard1: {
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
      createType: {
        type: String,
        default: ''
      },
      defaultLimitFileType: {
        type: Array,
        default: []
      }
    },
    watch: {
      infoId: {
        handler(newValue) {
          this.uploadBasicUrl = uploadFileCommon(newValue, 'uns_send_LetterInfo_attachment') // infoId, fileLoc
        }
      },
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
        // this.uploadOption.disabledflag = newValue
      },
      'formCard1.fileList': {
        handler() {
          this.validateFileList()
        },
        deep: true
      },
      createType(newValue) {
        if (String(newValue) === '0') {
          this.commonData.disabled = true
        }
      }
    },
    data() {
      return {
        letterTypeOptions,
        sendDeptOptions,
        sendWayOptions,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'uns_send_LetterInfo_attachment'),
        rules: {
          letterType: {
            type: 'array', required: true, message: '请选择函件类型'
          },
          letterName: {
            required: true, message: '请输入函件名称'
          },
          sentDept: {
            required: true, message: '请选择发送对象'
          },
          sentWay: {
            required: true, message: '请选择发送方式'
          },
          fileList: {
            required: true, message: '请上传发函附件'
          }
        },
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        },
        uploadOption1: {
          name: '上传',
          size: 'small',
          type: 'primary'
        }
      }
    },
    methods: {
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard1.stockCode = stockCodeData
        this.formCard1.nullStockCode = stockCodeData.length ? 0 : 1
      },
      handleRadioChange(newValue) {
        this.formCard1.stockCode = []
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
        for (let item of this.formCard1.fileList) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.$emit('downloadFile', fileId, file)
      },
      validateFileList() {
        this.$refs['formCard1'].validateField('fileList')
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
  .sendLetterFormCard1 {
    .custom-width {
      width: 350px;
    }
  }
</style>
