<template>
    <div class="index">
        <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
        <el-card v-if="data">
            <content-header :data="data"></content-header>
            <content-main :data="data"></content-main>
            <content-footer :data="data"></content-footer>
        </el-card>
    </div>
</template>

<script>
  import { getPublicSentimentDetail } from '@/service/sensation/index'

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
            label: '舆情信息详情'
          }
        ],
        data: null
      }
    },
    computed: {},
    watch: {},
    created () {
      this.ajaxGetPublicSentimentDetail()
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      ajaxGetPublicSentimentDetail () {
        getPublicSentimentDetail({publicSentimentId: this.$route.params.id}).then(res => {
          this.data = res
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    .index {

    }
</style>
