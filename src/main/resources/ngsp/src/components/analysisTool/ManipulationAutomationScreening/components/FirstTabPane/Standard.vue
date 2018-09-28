<template>
  <div>
    <el-table
      border
      max-height="400"
      ref="accountSummary"
      :data="accountSummary"
      v-loading="isLoading"
      element-loading-text="数据加载中，请耐心等待..."
      element-loading-background="rgba(0,0,0,0.3)"
      style="width: 100%; overflow:visible">
      <s-table-columns v-for="(item,index) in columns"
                       :key="index"
                       :item="item"
                       v-if="item.isActive===undefined||item.isActive"/>
    </el-table>
    <el-row>
      <el-col :span="24">
        <pageination style="text-align: center" :pageTotal="pageTotal"
                     @getPageination="getPageination"></pageination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { analysisAcctScreen } from '@/service/analysisTool/ManipulationAutomationScreening/index'

  export default {
    name: 'standard',
    props: {
      columns: Array,
      index: [Number, String],
      standardData: {
        type: Object,
        default: function () {
          return {
            data: [],
            total: 0
          }
        }
      }
    },
    components: {
      STableColumns: () => import('@/components/base/STableColumns'),  // 表格列
      Pageination: () => import('@/components/common/pageination') // 分页组件引入
    },
    mixins: [],
    data () {
      return {
        accountSummary: this.standardData.data,
        pageTotal: Number(this.standardData.total),
        isLoading: false
      }
    },
    computed: {
      lastSelectParams: function () {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getLastSelectParams))
        params.resType = 'chkRes' + this.index
        return params
      }
    },
    watch: {},
    methods: {
      getPageination (pageinationVal) {
        this.lastSelectParams.pageRows = pageinationVal.pageSizeNumber
        this.lastSelectParams.pageIndex = pageinationVal.currentPage
        this.ajaxAnalysisAcctScreen()
      },
      ajaxAnalysisAcctScreen () {
        this.isLoading = true
        let params = this.lastSelectParams
        params.isNewQuery = 0
        analysisAcctScreen(params).then(res => {
          this.isLoading = false
          this.accountSummary = res.res['chkRes' + this.index]
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

</style>
