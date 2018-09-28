<template>
    <div class="index">
        <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">
            <el-tab-pane label="固化监控" name="curing">
                <curing></curing>
            </el-tab-pane>
            <!--<el-tab-pane label="重点监控" name="focus">-->
            <!--待开发-->
            <!--</el-tab-pane>-->
            <!--<el-tab-pane label="自定义监控" name="customize">-->
            <!--待开发-->
            <!--</el-tab-pane>-->
        </el-tabs>
    </div>
</template>

<script>
  export default {
    name: 'index',
    props: [],
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'), // 面包屑组件
      Curing: () => import('./curing/Index'),
    },
    mixins: [],
    data () {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '预警管理'
          }, {
            router: '',
            label: '预警监控对象'
          }
        ],
        activeName: ''
      }
    },
    computed: {},
    watch: {
      '$route': 'getActiveName'
    },
    created () {
      this.getActiveName()
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      getActiveName () {
        this.activeName = this.$route.params.type
      },
      handleTabsClick (tab, event) {
        this.$router.replace({path: `/earlyWarningMonitoring/${tab.name}`})
      }
    }
  }
</script>

<style lang="less" scoped>
    .index {
    }
</style>