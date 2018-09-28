<template>
  <el-card class="surveyFormCard2">
    <div slot="header">关联临时计算</div>
    <el-form :model="formCard2" ref="formCard2" label-width="140px" :rules="rules" :inline="true">
      <el-row>
        <el-form-item label="是否关联临时计算：" prop="isTpc">
          <el-radio-group :disabled="disabled" v-model="formCard2.isTpc" @change="showMoreForm" class="custom-width">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <div v-if="formCard2.showUrlLink === 2">
        <el-form-item label="任务编号："><a @click="goToClubFlow" class="link-common-css">{{formCard2.taskNo}}</a></el-form-item>
      </div>
      <div v-if="formCard2.showUrlLink === 1">
        <el-row>
          <el-form-item label="任务编号：" required>
            <el-input class="custom-width" disabled="disabled" v-model="formCard2.taskNo" placeholder="" size="small"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="需求描述：" prop="needDesc">
            <el-input
              class="custom-width-special"
              :disabled="disabled"
              v-model="formCard2.needDesc"
              type="textarea"
              placeholder="输入内容在200字以内"
              size="small"
              :maxlength="200"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="验收标准：" prop="checkStandard">
            <el-input
              class="custom-width-special"
              :disabled="disabled"
              v-model="formCard2.checkStandard"
              type="textarea"
              placeholder="输入内容在200字以内"
              size="small"
              :maxlength="200"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="交付时间：" prop="deliverTime">
            <s-date-picker
              :disabled="disabled"
              class="custom-width"
              type="datetime"
              v-model="formCard2.deliverTime"
              placeholder=""></s-date-picker>
          </el-form-item>
        </el-row>
        <!--<el-row>
          <el-form-item label="计算结果附件：">
            <div v-if="showUploadButton">
              <el-upload
                class="upload-demo"
                :disabled="disabled"
                :file-list="formCard2.fileList"
                :action=uploadBasicUrl
                :on-preview="handlePreview"
                :on-success="getFileList"
                :on-remove="deleteFile"
                style="display:inline-block">
                &lt;!&ndash;<el-button :disabled="disabled" type="text" size="small" style="display:inline">上传</el-button>&ndash;&gt;
              </el-upload>
            </div>
            <div v-else>
              <span v-for="item in formCard2.fileList" :key="item.fileId" style="display: block;">{{item.name}}</span>
            </div>
          </el-form-item>
        </el-row>-->
      </div>
    </el-form>
  </el-card>
</template>
<script>
  import SDatePicker from '../../../base/SDatePicker'
  import {uploadFileCommon, gettemporaryCalculationnum, getInfoId} from '@/service/superviseTask'
  export default {
    components: {SDatePicker},
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
      }
    },
    data() {
      return {
        uploadBasicUrl: uploadFileCommon(this.infoId, 'tpc_first_attachment'),
        rules: {
          needDesc: [
            {required: true, message: '请输入需求描述'}
          ],
          deliverTime: [
            {required: true, message: '请输入交付时间'}
          ]
        }
      }
    },
    watch: {
      infoId(newValue) {
        this.uploadBasicUrl = uploadFileCommon(newValue, 'tpc_first_attachment')
      }
    },
    methods: {
      getFileList() {
        this.$emit('getFileList', this.formCard2.infoIdTpc)
      },
      deleteFile (file) {
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
      showMoreForm(val) {
        if (val === 1) { // 是，取编号，取新 infoId
          this.getTaskNo()
          this.createInfoIdTpc()
          this.formCard2.showUrlLink = 1
        } else {
          this.formCard2.showUrlLink = 0
        }
      },
      goToClubFlow() {
        window.open(`#/temporaryCalculationForm?operate=1&instanceId=${this.formCard2.infoIdTpc}&isNewTab=true`)
      },
      // 获取任务编号
      getTaskNo () {
        gettemporaryCalculationnum('').then((resp) => {
          this.formCard2.taskNo = resp
        })
      },
      // 取新 idfoId 作为 infoIdTpc
      createInfoIdTpc() {
        getInfoId().then((resp) => {
          this.formCard2.infoIdTpc = resp // infoIdTpc 当前拟稿后直接提交时使用
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
  .surveyFormCard2 {
    .custom-width {
      width: 280px;
    }
    .custom-width-special{
      width: 900px;
    }
  }
</style>
