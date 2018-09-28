<template>
  <el-card class="surveyFormCard2">
    <div slot="header">
      复函信息
    </div>
    <el-form :model="formCard2" ref="formCard2" label-width="145px" :rules="rules">
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="证券代码及简称：" required style="float:left">
          <stock-code-query class="custom-width" :commonData="commonData" @getStockCode="getStockCode"></stock-code-query>
        </el-form-item>
        <el-form-item label-width="50px" style="float:left">
          <el-radio :disabled="disabled" v-model="formCard2.nullStockCode" :label="1" style="margin-top: 8px" @change="handleRadioChange">无证券代码</el-radio>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="函件类型：" prop="letterType">
          <el-cascader
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="letterTypeOptions"
            v-model="formCard2.letterType"
            @change="updateLetterNo"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="函件编号：" prop="letterNo">
          <el-input readonly size="small" class="custom-width" v-model="formCard2.letterNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="函件名称：" prop="letterName">
          <el-input size="small" class="custom-width" v-model="formCard2.letterName" :readonly="disabled" :maxlength="50" placeholder="输入内容在50字以内"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="函件事项：" prop="letterMatter">
          <el-input style="width:78%" :readonly="disabled" v-model="formCard2.letterMatter" type="textarea" size="small" placeholder="输入内容在200字以内" :maxlength="200"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="发送对象：" prop="target">
          <el-cascader
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="targetOptions"
            v-model="formCard2.target"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24">
        <el-form-item label="发送方式：" prop="respWay">
          <el-select class="custom-width" :disabled="disabled" v-model="formCard2.respWay" placeholder="" size="small">
            <el-option
              v-for="item in respWayOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="附件：" prop="fileList">
          <div v-if="showUploadButton">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadBasicUrl"
              :disabled="disabled"
              :uploadOption="uploadOption1"
              :noLimit="true"
              :limit="100"
              :propsFileList="formCard2.fileList"
              @handlePreview="handlePreview"
              @handleRemove="handleRemove"
              @getTxtCon="getFileList"
            ></text-upload>
            <!--<el-upload
              :disabled="disabled"
              class="upload-demo"
              :file-list="formCard2.fileList"
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
</template>
<script>
  import {letterTypeOptions, targetOptions, respWayOptions} from '../component/constants'
  import {uploadFileCommon} from '@/service/superviseTask'
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import textUpload from '@/components/common/textUpload'
  export default {
    components: {StockCodeQuery, textUpload},
    props: {
      formCard2: {
        type: Object,
        default() {
          return {}
        }
      },
      loading: {
        type: Boolean,
        default: false
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
      tableData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    watch: {
      infoId(newValue) {
        this.uploadBasicUrl = uploadFileCommon(newValue, 'uns_check_checkInfo_attachment')
      },
      formCard2: {
        handler(newValue) {
          this.commonData.stockCode = newValue.stockCode
          this.formCard2.nullStockCode = newValue.stockCode.length ? 0 : 1
          if (!this.disabled) {
            this.$refs['formCard2'] && this.$refs['formCard2'].clearValidate()
          }
        },
        immediate: true,
        deep: true
      },
      disabled(newValue) {
        this.commonData.disabled = newValue
        // this.uploadOption.disabledflag = newValue
      },
      'formCard2.fileList': {
        handler() {
          if (!this.disabled) {
            this.validateFileList()
          }
        },
        deep: true
      }
    },
    data() {
      return {
        letterTypeOptions,
        targetOptions,
        respWayOptions,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'uns_check_checkInfo_attachment'),
        rules: {
          letterName: {
            required: true, message: '请输入函件名称'
          },
          letterNo: {
            required: true, message: '请输入函件编号'
          },
          respWay: {
            required: true, message: '请选择发送方式'
          },
          letterType: {
            required: true, message: '请选择函件类型'
          },
          target: {
            required: true, message: '请选择发送对象'
          },
          stockCode: {
            required: true, message: '请输入证券代码'
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
      handleRadioChange(newValue) {
        this.formCard2.stockCode = []
        this.commonData.stockCode = []
      },
      handleSlotComponentEvent ({type, scope, item}) {
        if (type === 'tableColumnCanClickComponent') {
          window.open(`#/replyLetterFormPage?instanceId=${scope.row.infoId}&operate=1&isNewTab=true`)
        }
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.formCard2.stockCode = stockCodeData
        this.formCard2.nullStockCode = stockCodeData.length ? 0 : 1
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
      validateFormCard() {
        let flag = true
        this.$refs['formCard2'].validate((valid) => {
          flag = valid
        })
        return flag
      },
      validateFileList() {
        this.$refs['formCard2'].validateField('fileList')
      },
      updateLetterNo() {
        this.$emit('updateLetterNo')
      }
    }
  }
</script>
<style lang="less" scoped>
  .surveyFormCard2 {
    .custom-width {
      width: 350px;
    }
  }
</style>
