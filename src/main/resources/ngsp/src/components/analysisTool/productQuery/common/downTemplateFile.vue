<template>
  <!--下载模板-->
  <div class='down-template-file' style="margin-left: 10px;">
    <el-button size="small" @click="downLoadModelFile" type="info">模板</el-button>
  </div>
</template>

<script>
  export default {
    name: 'down-template-file',
    props: {
      fileType: {
        type: String,
        default () {
          return 'account'
        }
      }
    },
    components: {},
    mixin: [],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {
      downLoadModelFile () {
        if (this.fileType === 'account') {
          this.gfnDownloadTemplateFile({code: 'regulary.accounts'})
        } else if (this.fileType === 'uniteCode') {
          this.gfnDownloadTemplateFile({code: 'regulary.uniteCode'})
        }
      }
    },
    created () {

    },
    mounted () {

    },
    beforeDestory () {

    }
  }
</script>

<style lang='less' scoped>
  .down-template-file {

  }
</style>
