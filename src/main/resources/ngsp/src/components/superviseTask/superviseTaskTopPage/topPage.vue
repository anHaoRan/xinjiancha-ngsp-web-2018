<template>
  <div class="top-page">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <query-conditions @select="select"/>
    <supervise-task-top-page ref="SuperviseTaskTopPage" @updateCharts="updateCharts"/>
    <charts-card ref="chartsCardRef"></charts-card>
  </div>
</template>

<script>
  export default {
    name: 'top-page',
    props: [],
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'),        // 面包屑组件
      QueryConditions: () => import('./QueryConditions'),        // 查询条件
      SuperviseTaskTopPage: () => import('./superviseTaskTopPage'),
      ChartsCard: () => import('./ChartsCard')
    },
    mixins: [],
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '监察任务首页'
        }, {
          router: '/letterlist',
          label: '我的流程列表'
        }]
      }
    },
    computed: {},
    watch: {},
    methods: {
      select (val) {
        this.$refs.SuperviseTaskTopPage.selectParams = val
      },
      updateCharts() {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs['chartsCardRef'] && this.$refs['chartsCardRef'].getChartData()
          }, 500)
        })
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  .top-page {
  }
</style>
