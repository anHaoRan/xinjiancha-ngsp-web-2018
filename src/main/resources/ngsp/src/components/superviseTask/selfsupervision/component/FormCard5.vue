<template>
  <el-card class="slsFormCard5">
    <div slot="header">
      发函信息
    </div>
    <el-form :model="formCard5" ref="formCard5" label-width="145px" :rules="rules" :inline="true">
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="函件类型：" prop="letterType">
          <el-cascader
            :disabled="disabled"
            size="small"
            class="custom-width"
            :options="letterTypeOptions"
            v-model="formCard5.letterType"
          ></el-cascader>
          <el-button type="primary" @click="generateLetter" size="small" :disabled="disabled || formCard5.fileList.length > 0" :loading="loading1" style="margin-left:15px">生成函件</el-button>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="是否需要回函：" prop="needreply">
          <el-radio-group v-model="formCard5.needreply" :disabled="disabled">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="短信内容：" prop="shortmsg">
          <el-input size="small" class="custom-width" v-model="formCard5.shortmsg" :readonly="disabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24">
        <el-form-item label="短信发送对象：" prop="msgtarget">
          <el-checkbox-group v-model="formCard5.msgtarget" :disabled="disabled">
            <el-checkbox :label="String(index)" v-for="(item, index) in msgtargetOptions" :key="index">{{item}}</el-checkbox>
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
              :propsFileList="formCard5.fileList"
              @handlePreview="handlePreview"
              @handleRemove="handleRemove"
              @getTxtCon="getFileList"
            ></text-upload>
            <!--<el-upload
              :disabled="disabled"
              class="upload-demo"
              :file-list="formCard5.fileList"
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
            <span v-if="formCard5.fileList.length > 0">
              <span
                style="display: block;"
                v-for="item in formCard5.fileList"
                :key="item.fileId">
              {{item.name}}
            </span>
            </span>
            <span v-else>无附件</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" v-if="formCard5.lettersent">
        <el-form-item label="发函人：">
          {{formCard5.lettersent}}
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" v-if="formCard5.sentdate">
        <el-form-item label="发函日期：">
          {{formCard5.sentdate}}
        </el-form-item>
      </el-col>
      <el-col :xl="24" :lg="24" :md="24" :sm="24" v-if="formCard5.lettersent || formCard5.sentdate">
        <el-form-item label="回函附件：" prop="fileList1">
          <div v-if="showUploadButton" style="min-width:200px">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadBasicUrl1"
              :disabled="String(processStatus) !== '4' || String(handleStatus) === '1'"
              :uploadOption="uploadOption2"
              :noLimit="true"
              :limit="100"
              :propsFileList="formCard5.fileList1"
              @handlePreview="handlePreview1"
              @handleRemove="handleRemove"
              @getTxtCon="getFileList"
            ></text-upload>
            <!--<el-upload
              :disabled="String(processStatus) !== '4' || String(handleStatus) === '1'"
              class="upload-demo"
              :file-list="formCard5.fileList1"
              :action=uploadBasicUrl1
              :on-preview="handlePreview1"
              :on-success="getFileList"
              :on-remove="deleteFile"
              style="display:inline-block">
              <el-button
                :disabled="String(processStatus) !== '4' || String(handleStatus) === '1'"
                type="text"
                size="small"
                style="display:inline"
              >上传
              </el-button>
            </el-upload>-->
          </div>
          <div v-else>
            <span v-if="formCard5.fileList1.length > 0">
              <span
                style="display: block;"
                v-for="item in formCard5.fileList1"
                :key="item.fileId">
              {{item.name}}
            </span>
            </span>
            <span v-else>无附件</span>
          </div>
        </el-form-item>
      </el-col>
    </el-form>
    <el-dialog
      class="downloadAndModifyFileDialog"
      title="下载 / 修改文件"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showDialog" width="30%" left>
      <div class="button-group">
        <text-upload
          style="display:inline-block"
          :uploadName="'file'"
          :actionUrl="modifyUrl"
          :uploadOption="uploadOption3"
          :limitFileType="defaultLimitFileType"
          :limitFileSize="20"
          :limit="100000"
          @getTxtCon="handleModifySuccess"
        ></text-upload>
        <el-button size="small" type="info" @click="gotoDownloadFile()">下载文件</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
  import {letterTypeOptions, msgtargetOptions} from '../component/constants'
  import {uploadFileCommon, getModifyFileUrlById} from '@/service/superviseTask'
  import textUpload from '@/components/common/textUpload'
  export default {
    components: {textUpload},
    props: {
      formCard5: {
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
          this.uploadBasicUrl = uploadFileCommon(newValue, 'sls_letter_send') // infoId, fileLoc
          this.uploadBasicUrl1 = uploadFileCommon(newValue, 'sls_letter_resp')
        }
      },
      'formCard5.fileList': {
        handler() {
          this.validateFileList()
        },
        deep: true
      }
    },
    data() {
      let {operate, processStatus} = this.$route.query
      return {
        letterTypeOptions,
        msgtargetOptions,
        uploadBasicUrl: uploadFileCommon(this.infoId, 'sls_letter_send'),
        uploadBasicUrl1: uploadFileCommon(this.infoId, 'sls_letter_resp'),
        rules: {
          letterType: {
            required: true, message: '请选择函件类型'
          },
          needreply: {
            required: true, message: '请选择是否需要回函'
          },
          fileList: {
            required: true, message: '请先点击生成函件'
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
        uploadOption3: {
          name: '修改文件',
          size: 'small',
          type: 'primary'
        },
        showDialog: false,
        currentSelectFile: {},
        modifyUrl: ''
      }
    },
    methods: {
      generateLetter() {
        this.$emit('generateLetter')
      },
      getFileList() {
        this.$emit('getFileList')
      },
      handleRemove (file) {
        this.$emit('deleteFile', file)
      },
      handleModifySuccess(res) {
        if (res) {
          this.$message.success('修改附件成功')
          this.showDialog = false
          this.$emit('getFileList')
        } else {
          this.$message.success('修改附件失败')
        }
      },
      gotoDownloadFile(file) {
        file = file || this.currentSelectFile
        let fileId = ''
        for (let item of this.formCard5.fileList) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.showDialog = false
        this.$emit('downloadFile', fileId, file)
      },
      handlePreview (file) {
        // 弹出选择弹窗，下载或修改
        if (!this.disabled) {
          this.showDialog = true
          this.currentSelectFile = file
          this.modifyUrl = getModifyFileUrlById(file.id)
        } else {
          this.gotoDownloadFile(file)
        }
      },
      handlePreview1 (file) {
        let fileId = ''
        for (let item of this.formCard5.fileList1) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.$emit('downloadFile', fileId, file)
      },
      validateFileList() {
        this.$refs['formCard5'].validateField('fileList')
      },
      validateFormCard() {
        let flag = true
        this.$refs['formCard5'].validate((valid) => {
          flag = valid
        })
        return flag
      }
    }
  }
</script>
<style lang="less" scoped>
  .slsFormCard5 {
    .custom-width {
      width: 350px;
    }
    .button-group {
      text-align: center;
      button {
        margin-left: 20px;
      }
    }
  }
</style>
