<template>
  <div class="index">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="按预警查询" name="PressWarning">
        <press-warning v-if="activeName==='PressWarning'" :activeName="activeName"/>
      </el-tab-pane>
      <el-tab-pane label="按账户查询" name="ByAccount">
        <by-account v-if="activeName==='ByAccount'" :activeName="activeName"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: [],
  components: {
    breadcrumb: () => import('@/components/common/Breadcrumb'),        // 面包屑组件
    PressWarning: () => import('./PressWarning/Index'),
    ByAccount: () => import('./ByAccount/Index')
  },
  mixins: [],
  data () {
    return {
      // 面包屑路由
      breadcrumbItems: [
        {
          router: '',
          label: '监管知识库'
        }, {
          router: '',
          label: '监管历史库'
        }, {
          router: '',
          label: '预警历史信息'
        }
      ],
      activeName: 'PressWarning'   //  tab栏默认项
    }
  },
  computed: {},
  watch: {},
  methods: {
    handleTabsClick () {
    }
  },
  created () {
    if (this.getUrlParam(this.$route.fullPath).activeName) {
      this.activeName = this.getUrlParam(this.$route.fullPath).activeName
    }
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="less" scoped>
  .index {
  }
</style>
