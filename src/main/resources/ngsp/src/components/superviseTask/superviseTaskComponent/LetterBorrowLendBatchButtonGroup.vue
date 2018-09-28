<template>
  <span>
    <el-button size="small" type="primary" @click="handleLetterBorrowLendBatchDialogShow(1)">批量传阅</el-button>
    <el-button size="small" type="primary" @click="handleLetterBorrowLendBatchDialogShow(0)">批量借阅</el-button>
  </span>
</template>
<script>
  export default {
    methods: {
      handleLetterBorrowLendBatchDialogShow(flag) {
        this.$emit('handleLetterBorrowLendBatchDialogShow', flag)
      }
    }
  }
</script>