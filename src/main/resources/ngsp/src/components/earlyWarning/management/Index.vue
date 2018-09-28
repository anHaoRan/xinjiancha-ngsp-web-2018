<template>
    <div class="index">
        <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">
            <!--<el-tab-pane label="预警指标" name="list3">-->
            <!--</el-tab-pane>-->
            <el-tab-pane label="预警模型" name="model">
                <model v-if="activeName=='model'"></model>
            </el-tab-pane>
            <el-tab-pane label="预警实例" name="instance">
                <instance v-if="activeName=='instance'"></instance>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  export default {
    name: 'index',
    props: [],
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'), // 面包屑组件
      Model: () => import('./model/Index'),
      Instance: () => import('./instance/Index')
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
            label: '预警模型'
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
        this.$router.replace({path: `/earlyWarningManagement/${tab.name}`})
      }
    }
  }
</script>

<style lang="less" scoped>
    .index {
    }
</style>