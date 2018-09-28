<!--宏观分析结论-->
<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>宏观分析结论</span>
    </div>
    <el-input type="textarea" :disabled="true" v-model="textarea" resize="none" autosize></el-input>
  </el-card>
</template>

<script>
  import {
    conclusionQuery
  } from '@/service/analysisTool/insiderTradAccountAnalysis/completeTheReview/index'

  export default {
    name: 'macro-analysis-conclusion',
    props: {},
    data () {
      return {
        textarea: ''
      }
    },
    mounted () {
      this.ajaxConclusionQuery()
    },
    methods: {
      ajaxConclusionQuery () {
        conclusionQuery(this.$route.params.taskId).then((res) => {
          this.textarea = `${res.conclusion}\n分析人员结论：${res.remarks}\n复核人员结论：${res.macroscopicResult}`
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
