<template>
    <div class="index">
        <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
        <content-header></content-header>
        <content-main></content-main>
        <high-frequency-word :data="{a:1}"></high-frequency-word>
    </div>
</template>

<script>
  export default {
    name: 'index',
    props: [],
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'), // 面包屑组件
      ContentHeader: () => import('./ContentHeader'),
      ContentMain: () => import('./ContentMain'),
      HighFrequencyWord: () => import('../../components/HighFrequencyWord')
    },
    mixins: [],
    data () {
      return {
        //  面包屑组件
        breadcrumbItems: [
          {
            router: '',
            label: '舆情监测'
          }, {
            router: '',
            label: '十大概念详情'
          }
        ]
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
