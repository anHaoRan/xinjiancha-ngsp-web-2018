<template>
  <div class="output-result-set">
    <s-table ref="marginTable" headerTitle="当日交易过量" :columns="columns[1]" :data="totalData[1]"
             @getPageination="getPageination1">
      <el-button type="info" size="small" slot="elCardHeader" @click="handleDownload">
        导出
      </el-button>
    </s-table>
    <s-table ref="marginTable2" headerTitle="持续5天交易过量结果" :columns="columns[2]" :data="totalData[2]"
             @getPageination="getPageination2">
    </s-table>

  </div>
</template>

<script>
  import { financeTradeOverRatio } from '@/service/analysisTool/MarginTrading/Index'
  import ExportMixin from '../ExportMixin'

  export default {
    name: 'output-result-set',
    props: {},
    components: {
      STable: () => import('@/components/base/STable')
    },
    mixins: [ExportMixin],
    data () {
      return {
        columns: {
          1: [
            {field: 'alarm_name', align: 'left', label: '预警名称', sortable: true},
            {field: 'instrument_id', align: 'left', label: '证券代码', sortable: true},
            {field: 'short_name', align: 'left', label: '证券名称', sortable: true},
            {
              field: 'spec',
              align: 'right',
              label: '交易比重(%)',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'scale')
            },
            {
              field: 'mtsl_amt',
              align: 'right',
              label: '融资/融券金额(万元)',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mb_trdamt')
            },
            {
              field: 'amt',
              align: 'right',
              label: '交易金额(万元)',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'val')
            },
            {
              field: 'mtsl_qty',
              align: 'right',
              label: '融券数量(万)',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'val')
            },
            {
              field: 'qty',
              align: 'right',
              label: '交易数量(万)',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'val')
            }
          ],
          2: [
            {field: 'name', align: 'left', label: '预警名称', sortable: true},
            {field: 'short_name', align: 'left', label: '证券代码', sortable: true},
            {field: 'instrument_id', align: 'left', label: '证券名称', sortable: true}
          ]
        },
        totalData: {
          1: {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          },
          2: {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          }
        },
        selectParams: {},
        exportSelectParams: {}
      }
    },
    computed: {},
    watch: {
      selectParams: {
        handler () {
          this.totalData = {
            1: {
              data: [],
              total: 0,
              pageRows: 10,
              pageIndex: 1
            },
            2: {
              data: [],
              total: 0,
              pageRows: 10,
              pageIndex: 1
            }
          }
          this.ajaxFinanceTradeOverRatio()
        },
        deep: true
      }
    },
    methods: {
      ajaxFinanceTradeOverRatio (type = 'tHistory') {
        let {smRadioLimit, ssRadioLimit, amRadioLimit, asRadioLimit} = this.selectParams,
          params = {
            smRadioLimit: smRadioLimit,
            ssRadioLimit: ssRadioLimit,
            amRadioLimit: amRadioLimit,
            asRadioLimit: asRadioLimit
          }
        this.exportSelectParams = JSON.parse(JSON.stringify(params))
        params.type = type
        let map = {
          tHistory: () => {
            params.pageIndex = 1
            params.pageRows = 10
          },
          today: () => {
            params.pageIndex = this.totalData[1].pageIndex
            params.pageRows = this.totalData[1].pageRows
          },
          history: () => {
            params.pageIndex = this.totalData[2].pageIndex
            params.pageRows = this.totalData[2].pageRows
          }
        }
        map[type]()
        this.showOrHideLoading(type, true)
        financeTradeOverRatio(params).then(res => {
          this.showOrHideLoading(type, false)
          let {financeTradeOverRatioToday, financeTradeOverRatioHistory} = res
          if (financeTradeOverRatioToday && (type == 'tHistory' || type == 'today')) {
            this.totalData[1] = {
              data: financeTradeOverRatioToday.bizData.metaData,
              total: financeTradeOverRatioToday.bizData.totalRows,
              pageIndex: this.totalData[1].pageIndex,
              pageRows: this.totalData[1].pageRows
            }
          }
          if (financeTradeOverRatioHistory && (type == 'tHistory' || type == 'history')) {
            this.totalData[2] = {
              data: financeTradeOverRatioHistory.bizData.metaData,
              total: financeTradeOverRatioHistory.bizData.totalRows,
              pageIndex: this.totalData[2].pageIndex,
              pageRows: this.totalData[2].pageRows
            }
          }
        })
      },
      showOrHideLoading (type, flag) {
        let map = {
          tHistory: () => {
            this.$refs.marginTable.showOrHideLoading(flag)
            this.$refs.marginTable2.showOrHideLoading(flag)
          },
          today: () => {
            this.$refs.marginTable.showOrHideLoading(flag)
          },
          history: () => {
            this.$refs.marginTable2.showOrHideLoading(flag)
          }
        }
        map[type]()
      },
      getPageination1 (pageinationVal) {
        this.totalData[1].pageRows = pageinationVal.pageSizeNumber
        this.totalData[1].pageIndex = pageinationVal.currentPage
        this.ajaxFinanceTradeOverRatio('today')
      },
      getPageination2 (pageinationVal) {
        this.totalData[2].pageRows = pageinationVal.pageSizeNumber
        this.totalData[2].pageIndex = pageinationVal.currentPage
        this.ajaxFinanceTradeOverRatio('history')
      },
      handleDownload () {
        let params = this.exportSelectParams
        params.fileMark = 'excle'
        params.markType = 'FinanceTradeOverRatio'
        params.tableColumns = [
          {
            sheetName: '融资融券-当日交易过量',
            fileColumns: this.columns[1]
          },
          {
            sheetName: '融资融券-持续5天交易过量结果',
            fileColumns: this.columns[2]
          }
        ]
        this.createElementA(params)
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
