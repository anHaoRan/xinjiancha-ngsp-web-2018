<template>
  <el-upload
    class="upload-txt"
    action=""
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    multiple
    :limit="3"
    :on-exceed="handleExceed"
    :file-list="fileList">
    <el-button size="mini" type="text" style="border:none;text-align: center">
      <i class="fa fa-upload" style="font-size: 20px;text-align: center"></i>
    </el-button>
  </el-upload>
</template>

<script>
  export default {
    data() {
      return {
        fileList: []
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(file, fileList) {
        console.log(file, fileList);
      },
      beforeRemove(file, fileList) {

      }
    }
  }
</script>

<style scoped>

</style>
