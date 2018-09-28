<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card style="height:57px">
      <el-tabs v-model="activename">
        <el-tab-pane label="联合监管发函信息列表" name="one">
        </el-tab-pane>
        <el-tab-pane label="联合监管复函信息列表" name="two">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <sendletterlist v-if="activename=='one'"></sendletterlist>
    <replyletterlist v-if="activename=='two'"></replyletterlist>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="entranceprocess" size="small" type="primary">新建联合监管函件</el-button>
    </div>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import sendletterlist from './sendletterlist'
  import replyletterlist from './replyletterlist'

  export default {
    components: {
      Breadcrumb,
      sendletterlist,
      replyletterlist
    },
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/letterlist',
          label: '联合监管'
        }],
        activename: 'one'
      }
    },
    methods: {
      entranceprocess () {
        if (this.activename == 'one') {
          this.$router.push({path: '/sendLetterFormPage'})
        } else {
          this.$router.push({path: '/replyLetterFormPage'})
        }
      }
    },
    created () {
      this.activename = this.$store.state.superviseTask.jointregulation.activeTabs || 'one'
    }
  }
</script>
<style>

</style>
