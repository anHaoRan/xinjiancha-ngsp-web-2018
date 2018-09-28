<template>
  <div class="output-result-set">
    <s-table ref="marginTable" headerTitle="融资买入成交额比超限" :columns="columns[1]" :data="totalData[1]"
             @getPageination="getPageination">
      <el-dropdown @command="handleDownload" slot="elCardHeader">
        <el-button type="info" size="small">
          导出<i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="exl">
            <i class="el-icon-document"></i>导出为EXCEL
          </el-dropdown-item>
          <!--<el-dropdown-item command="csv">-->
          <!--<i class="el-icon-tickets"></i>导出为CSV-->
          <!--</el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
    </s-table>
    <s-table ref="marginTable2" headerTitle="融券卖出成交量比超限" :columns="columns[2]" :data="totalData[2]"
             @getPageination="getPageination2">
    </s-table>

  </div>
</template>

<script>
  import { financeOverRatio } from '@/service/analysisTool/MarginTrading/Index'
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
            {
              field: 'invacctno',
              align: 'left',
              label: '账户代码',
              sortable: true
            },
            {
              field: 'investor_account_name',
              align: 'left',
              label: '账户名称',
              sortable: true
            },
            {
              field: 'branch_name',
              align: 'left',
              label: '营业部名称',
              sortable: true
            },
            {
              field: 'instrument_id',
              align: 'left',
              label: '证券代码',
              sortable: true
            },
            {
              field: 'instrument_chn_short_name',
              align: 'left',
              label: '证券名称',
              sortable: true
            },
            {
              field: 'scale',
              align: 'right',
              label: '融资买入成交额比',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'scale')
            },
            {
              field: 'mb_trdamt',
              align: 'right',
              label: '融资买入额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mb_trdamt')
            },
            {
              field: 'val',
              align: 'right',
              label: '市场成交额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'val')
            }
          ],
          2: [
            {
              field: 'invacctno',
              align: 'left',
              label: '账户代码',
              sortable: true
            },
            {
              field: 'investor_account_name',
              align: 'left',
              label: '账户名称',
              sortable: true
            },
            {
              field: 'branch_name',
              align: 'left',
              label: '营业部名称',
              sortable: true
            },
            {
              field: 'instrument_id',
              align: 'left',
              label: '证券代码',
              sortable: true
            },
            {
              field: 'instrument_chn_short_name',
              align: 'left',
              label: '证券名称',
              sortable: true
            },
            {
              field: 'scale',
              align: 'right',
              label: '融券卖出成交量比',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'scale')
            },
            {
              field: 'ss_trdqty',
              align: 'right',
              label: '融券卖出量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ss_trdqty')
            },
            {
              field: 'qty',
              align: 'right',
              label: '市场成交量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            }
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
          this.ajaxFinanceOverRatio()
        },
        deep: true
      }
    },
    methods: {
      ajaxFinanceOverRatio (type = 'BS') {
        let {FBuyOverRatio, FSaleOverRatio} = this.selectParams,
          params = {
            FBuyOverRatio: FBuyOverRatio,
            FSaleOverRatio: FSaleOverRatio,
            type: type
          }
        this.exportSelectParams = JSON.parse(JSON.stringify(params))
        let map = {
          BS: () => {
            params.pageIndex = 1
            params.pageRows = 10
          },
          B: () => {
            params.pageIndex = this.totalData[1].pageIndex
            params.pageRows = this.totalData[1].pageRows
          },
          S: () => {
            params.pageIndex = this.totalData[2].pageIndex
            params.pageRows = this.totalData[2].pageRows
          }
        }
        map[type]()
        this.showOrHideLoading(type, true)
        financeOverRatio(params).then(res => {
          this.showOrHideLoading(type, false)
          let {FinanceBuyOverRatio, FinanceSaleOverRatio} = res
          if (FinanceBuyOverRatio) {
            this.totalData[1] = {
              data: FinanceBuyOverRatio.bizData.metaData,
              total: FinanceBuyOverRatio.bizData.totalRows,
              pageIndex: this.totalData[1].pageIndex,
              pageRows: this.totalData[1].pageRows
            }
          }
          if (FinanceSaleOverRatio) {
            this.totalData[2] = {
              data: FinanceSaleOverRatio.bizData.metaData,
              total: FinanceSaleOverRatio.bizData.totalRows,
              pageIndex: this.totalData[2].pageIndex,
              pageRows: this.totalData[2].pageRows
            }
          }
        })
      },
      showOrHideLoading (type, flag) {
        let map = {
          BS: () => {
            this.$refs.marginTable.showOrHideLoading(flag)
            this.$refs.marginTable2.showOrHideLoading(flag)
          },
          B: () => {
            this.$refs.marginTable.showOrHideLoading(flag)
          },
          S: () => {
            this.$refs.marginTable2.showOrHideLoading(flag)
          }
        }
        map[type]()
      },
      getPageination (pageinationVal) {
        this.totalData[1].pageRows = pageinationVal.pageSizeNumber
        this.totalData[1].pageIndex = pageinationVal.currentPage
        this.ajaxFinanceOverRatio('B')
      },
      getPageination2 (pageinationVal) {
        this.totalData[2].pageRows = pageinationVal.pageSizeNumber
        this.totalData[2].pageIndex = pageinationVal.currentPage
        this.ajaxFinanceOverRatio('S')
      },
      handleDownload (val) {
        let params = this.exportSelectParams
        params.fileMark = val
        params.markType = 'FinanceOverRatio'
        params.tableColumns = [
          {
            sheetName: '融资融券-融资买入成交额比超限',
            fileColumns: this.columns[1]
          },
          {
            sheetName: '融资融券-融券卖出成交量比超限',
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
