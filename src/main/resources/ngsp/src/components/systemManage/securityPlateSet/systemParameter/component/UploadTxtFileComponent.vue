
<template>
  <el-upload
    class="uploadBtn"
    ref="upload"
    :action="this.gfnGetUploadFlatReturnBasicUrl"
    :on-success="handleUploadSuccess"
    :before-upload="beforeUpload"
    :auto-upload="true"
    :data="uploadParams"
    :show-file-list="false"
    :disabled="(currentDialogName === 'customPlateSetting' && !getcurrentBoardCode)
                    || (currentDialogName === 'classifiedInvestorSetting' && !getcurrentOrgCode)"
    name="uploadFile">
    <el-button
      :disabled="(currentDialogName === 'customPlateSetting' && !getcurrentBoardCode)
                    || (currentDialogName === 'classifiedInvestorSetting' && !getcurrentOrgCode)"
      type="primary" size="small" slot="trigger">文件导入</el-button>
  </el-upload>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      uploadParams: {
        'parseRule': JSON.stringify({
          'delimiter': ',',
          'firstToSkip': 1
        })
      }
    }
  },
  computed: {
    ...mapGetters(['getcurrentBoardCode', 'getcurrentOrgCode'])
  },
  props: {
    currentDialogName: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleUploadSuccess(resp, file) {
      // 获取上传文件内容，并将获取到的文件内容与下拉列表相比较，取出下拉列表中有的项
      if (resp.success) {
        if (resp.value && resp.value.data && resp.value.data.length > 0) {
          this.$emit('updateFileExportList', resp.value.data)
          this.$message.success('上传成功')
        } else {
          this.$message.info('有效代码为空，请上传包含有效代码的文件')
        }
      } else {
        this.$message.error('上传失败')
      }
    },
    beforeUpload(file) {
      // 上传之前判断文件类型是否符合要求
      let nameArr = file.name.split('.')
      let fileType = nameArr[nameArr.length - 1]
      if (fileType !== 'txt') {
        this.$message.error('只支持TXT文件的上传')
        return false
      }
    }
  }
}
</script>
