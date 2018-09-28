<template>
    <div class="index">
        <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
        <content-header></content-header>
        <content-main></content-main>
        <content-footer></content-footer>
        <!--<el-button size="small" type="info" @click="handlerClick">打开PDF</el-button>-->
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
      ContentFooter: () => import('./ContentFooter')
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
            label: '舆情首页'
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
    methods: {
      handlerClick () {
        this.openPDFPreview(this, '/ngsp/fluct/report/v1/displayPDF?type=1')
      }
    }
  }
</script>

<style lang="less" scoped>
    .index {
    }
</style>
