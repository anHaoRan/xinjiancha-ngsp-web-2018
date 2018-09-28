<template>
  <div>
    <el-button :type="uploadParams.type"
               :loading="uploadParams.loading" @click="dialogFormVisble = true" size="small">
      {{uploadParams.label}}
    </el-button>
    <el-dialog size="small" title="文件上传" :visible.sync="dialogFormVisble">
      <el-form>
        <el-form-item prop="name" style="margin-bottom: 0">
          <el-upload
            ref="upload"
            :action="this.gfnGetUploadExcelReturnPojoUrl"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :data="params"
            name="uploadFile">
            <el-button slot="trigger" type="primary" size="small">选择文件</el-button>
            <el-button style="margin-left: 20px" type="success" size="small" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'excel-upload',
    props: ['uploadParams'],
    data () {
      return {
        uploadData: null,
        dialogFormVisble: false
      }
    },
    computed: {
      params: function () {
        return {
          'parseRules': JSON.stringify(this.uploadParams.params)
        }
      }
    },
    methods: {
      submitUpload () {
        this.$refs.upload.submit()
      },
      handleUploadSuccess (res, file, fileList) {
        if (res.success) {
          this.$emit('fileData', res.value)
          this.dialogFormVisble = false
          this.$refs.upload.clearFiles()
          this.uploadParams.loading = false
        } else {
          this.$message.error(res.message)
          this.uploadParams.loading = false
        }
      },
      beforeUpload (file) {
        this.$emit('fileName', file.name)
        this.uploadParams.loading = true
        return file
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>
  .el-dialog .el-card {
    margin-top: 0;
    padding-top: 20px;
  }

  .el-dialog__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
</style>
