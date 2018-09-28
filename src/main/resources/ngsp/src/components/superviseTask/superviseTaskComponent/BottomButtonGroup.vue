<template>
  <div class="flow-button-group">
    <el-button :loading="loading" type="primary" size="middle" class="self-button" @click="handleCommit" v-if="String(handleStatus) !== '1'">提交</el-button>
    <el-button type="text" size="middle" class="self-button" @click="handleSave" v-if="String(handleStatus) !== '1'">保存</el-button>
    <el-button type="info" size="middle" class="self-button" @click="goBack">返回</el-button>
  </div>
</template>
<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const {operate} = this.$route.query
      return {
        handleStatus: operate
      }
    },
    methods: {
      goBack() {
        this.$emit('goBack')
      },
      handleSave() {
        this.$emit('handleSave')
      },
      handleCommit() {
        this.$emit('handleCommit')
      }
    }
  }
</script>
<style lang="less" scoped>
  .flow-button-group {
    text-align: right;
    margin-top: 20px;
    .self-button {
      padding: 12px 20px !important;
    }
  }
</style>
