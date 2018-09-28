<template>
  <div>
    <el-upload
      ref="upload"
      :action="uploadActionUrl"
      :on-success="handleUploadSuccess"
      :before-upload="beforeUpload"
      :limit="1"
      :on-exceed="maxFileNum"
      :auto-upload="true"
      :data="uploadParams"
      name="uploadFile"
      :file-list="uploadFileList"
      :show-file-list="false"
      style="display: inline-block;margin-left: 10px;">
      <el-button slot="trigger"
                 type="text"
                 :size="uploadOption.size"
                 :disabled="upload">{{uploadOption.name}}
      </el-button>
    </el-upload>
  </div>
</template>

<script>

  export default {
    props: {
      uploadOption: {
        type: Object,
        default: function () {
          return {name: '重新上传', size: 'mini'}
        }
      }
    },
    data() {
      return {
        uploadData: null,
        dialogFormVisble: false,
        uploadActionUrl: this.gfnGetUploadFileUrl(),
        uploadParams: {
          'parseRule': JSON.stringify(
            {
              'delimiter': ','
            }
          )
        },
        uploadFileList: [],
        upload: false
      }
    },
    methods: {
      beforeUpload(file) {
        this.uploadParams.loading = false;
        const isTXTorCSV = (file.name.split('.')[1] === 'txt' || file.name.split('.')[1] === 'docx')
        if (!isTXTorCSV) {
          this.$message.error('上传文件类型只能为txt文件或word文件')
        }
        return isTXTorCSV;
        // return file
      },
      maxFileNum() {
        this.$message.error('上传文件数量最大为1');
      },
      handleUploadSuccess(res, file, fileList) {
        if (res.success) {
          this.$emit('getTxtCon', res.value, file.name);
        } else {
          this.$message.error(res.message)
        }
      }
    },
    mounted() {
    }
  }
</script>

<style>

</style>
