<template>
    <div class="index">
        <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
        <alarm-amount></alarm-amount>
        <watch-object-amount></watch-object-amount>
    </div>
</template>

<script>
  export default {
    name: 'index',
    props: [],
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'), // 面包屑组件
      AlarmAmount: () => import('./AlarmAmount'),
      WatchObjectAmount: () => import('./WatchObjectAmount'),
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
            label: '智能预警评估'
          }
        ],
      }
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
    .index {
    }
</style>