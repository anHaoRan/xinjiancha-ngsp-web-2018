<template>
  <div>
    <el-table
      height="500"
      border
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
        <pageination style="text-align: center" :pageTotal="pageTotal" @getPageination="getPageination"></pageination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { unusualTrade } from '@/service/analysisTool/ManipulateAnalysisList/index'

  export default {
    name: 'abnormal-table',
    props: {},
    components: {
      STableColumns: () => import('@/components/base/STableColumns'),  // 表格列
      Pageination: () => import('@/components/common/pageination') // 分页组件引入
    },
    mixins: [],
    data () {
      return {
        columns: [
          {
            field: 'create_time',
            align: 'left',
            label: ''
          }, {
            field: 'inve_count0',
            align: 'left',
            label: '集合竞价虚假申报'
          }, {
            field: 'inve_count2',
            align: 'left',
            label: '涨跌停板虚假申报'
          }, {
            field: 'inve_count4',
            align: 'center',
            label: '拉抬打压盘中价'
          }, {
            field: 'inve_count5',
            align: 'left',
            label: '拉抬打压收盘价'
          }
        ],
        accountSummary: [],
        pageTotal: null,
        pageIndex: 1,
        pageRows: 10,
        isLoading: false
      }
    },
    computed: {
      selectParams: function () {
        return this.$store.getters.getSelectParams
      }
    },
    watch: {
      selectParams: {
        handler: function () {
          this.ajaxUnusualTrade()
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      ajaxUnusualTrade () {
        let param = {
          type: '0,2,4,5',
          stockCode: this.selectParams.indexCode,
          startDate: this.selectParams.selectTradeDate[0],
          endDate: this.selectParams.selectTradeDate[1],
          dateType: 'date',
          pageIdx: this.pageIndex,
          pageRw: this.pageRows
        }
        this.isLoading = true
        unusualTrade(param).then(res => {
          this.isLoading = false
          let {list, rowCount} = res
          this.pageTotal = rowCount
          this.accountSummary = list
        })
      },
      getPageination (pageinationVal) {
        this.pageRows = pageinationVal.pageSizeNumber
        this.pageIndex = pageinationVal.currentPage
        this.ajaxUnusualTrade()
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

<style scoped>

</style>
