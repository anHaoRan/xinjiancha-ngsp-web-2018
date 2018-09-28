<template>
    <div class="index">
        <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">
            <el-tab-pane label="舆情信息列表" name="list1">
            </el-tab-pane>
            <el-tab-pane label="我的舆情列表" name="list2">
            </el-tab-pane>
            <el-tab-pane label="我的关注" name="list3">
            </el-tab-pane>
        </el-tabs>
        <content-header :activeName="activeName" @select="getSelectParams"></content-header>
        <content-main @getPageination="getPageination" :data="data"></content-main>
    </div>
</template>

<script>
  import { getInfoList } from '@/service/sensation/index'

  export default {
    name: 'index',
    props: [],
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'), // 面包屑组件
      ContentHeader: () => import('./ContentHeader'),
      ContentMain: () => import('./ContentMain'),
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
            label: '舆情信息列表'
          }
        ],
        activeName: 'list1',
        data: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        selectParams: null
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
      handleTabsClick () {
        this.data = {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        }
      },
      getSelectParams (selectParams) {
        this.selectParams = Object.assign({}, selectParams)
        this.ajaxGetInfoList()
      },
      ajaxGetInfoList () {
        let {publicSentimentType, mediaType, datePicker, sentimentType, keyWorldType, keyWorld, orderField, securityCode} = this.selectParams
        let params = {
          keyWorld: keyWorld
        }
        if (this.activeName == 'list1') {
          params = {
            publicSentimentType: publicSentimentType,
            mediaType: mediaType,
            startDate: datePicker[0],
            endDate: datePicker[1],
            sentimentType: sentimentType,
            keyWorldType: keyWorldType,
            keyWorld: keyWorld,
            stockCode: securityCode,
            pageSize: this.data.pageRows,
            pageNumber: this.data.pageIndex
          }
          let index = orderField.findIndex(item => {
            return item.isActive
          })
          params.orderField = orderField[index].value
          params.orderType = orderField[index].sortClass == 'down' ? 'desc ' : 'asc'
        }
        console.log(params)
        getInfoList(params).then(res => {
          let {count, data} = res
          this.data.total = count
          this.data.data = data
        })
      },
      getPageination (pageinationVal) {
        this.data.pageRows = pageinationVal.pageSizeNumber
        this.data.pageIndex = pageinationVal.currentPage
        this.ajaxGetInfoList()
      }
    }
  }
</script>

<style lang="less" scoped>
    .index {
    }
</style>
