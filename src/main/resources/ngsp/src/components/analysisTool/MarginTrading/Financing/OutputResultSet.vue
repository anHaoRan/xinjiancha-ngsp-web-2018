<template>
  <div class="output-result-set">
    <s-table ref="marginTable" headerTitle="融资余额查询母表" :columns="columns[1]" :data="totalData[1]"
             @getPageination="getPageination">
      <el-dropdown @command="handlerCommand1" slot="elCardHeader">
        <el-button type="info" size="small">
          导出<i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="exl">
            <i class="el-icon-document"></i>导出为EXCEL
          </el-dropdown-item>
          <el-dropdown-item command="csv">
            <i class="el-icon-tickets"></i>导出为CSV
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </s-table>
    <s-table ref="marginTable2" headerTitle="融资余额查询子表" :columns="columns[2]" :data="totalData[2]"
             @getPageination="getPageination2" v-if="isShow">
      <el-dropdown @command="handlerCommand2" slot="elCardHeader">
        <el-button type="info" size="small">
          导出<i class="el-icon-arrow-down el-icon-right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="exl">
            <i class="el-icon-document"></i>导出为EXCEL
          </el-dropdown-item>
          <el-dropdown-item command="csv">
            <i class="el-icon-tickets"></i>导出为CSV
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </s-table>

  </div>
</template>

<script>
  import FinancingRadio from './FinancingRadio'
  import { securitiesLoanMarginSum, securitiesLoanMarginDetail } from '@/service/analysisTool/MarginTrading/Index'
  import { financeBalanceSum, financeBalanceDetail } from '@/service/analysisTool/MarginTrading/Index'
  import ExportMixin from '../ExportMixin'

  export default {
    name: 'output-result-set',
    props: {},
    components: {
      STable: () => import('@/components/base/STable')
    },
    mixins: [ExportMixin],
    data () {
      let a = []
      return {
        columns: {
          1: [
            {field: 'instrument_id', align: 'center', width: '80', label: '钻取选择', template: FinancingRadio},
            {field: 'instrument_id', align: 'left', width: '80', label: '证券代码', sortable: true},
            {field: 'instrument_chn_short_name', align: 'left', width: '80', label: '证券简称', sortable: true},
            {field: 'brqz', align: 'right', width: '120', label: '本日融资余额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'brqz')},
            {field: 'per', align: 'right', width: '120', label: '融资余额占流通市值比例', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'per')},
            {field: 'lastday_rzye', align: 'right', width: '120', label: '上日融资余额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'lastday_rzye')},
            {field: 'today_rzmr', align: 'right', width: '120', label: '融资买入金额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'today_rzmr')},
            {field: 'today_mqhke', align: 'right', width: '120', label: '卖券还款金额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'today_mqhke')},
            {field: 'today_rzpc', align: 'right', width: '120', label: '融资平仓金额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'today_rzpc')},
            {field: 'market_float', align: 'right', width: '120', label: '当日流通股本(万股)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'market_float')},
            {field: 'price', align: 'right', width: '120', label: '当日股价', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'price')},
            {field: 'market_value', align: 'right', width: '120', label: '当日流通市值(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'market_value')}
          ],
          2: [
            {field: 'member_name', align: 'left', width: '80', label: '会员名称', sortable: true},
            {field: 'rzye', align: 'right', width: '120', label: '本日融资余额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'rzye')},
            {field: 'per', align: 'right', width: '120', label: '融资余额占流通市值比例', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'per')},
            {field: 'lastday_rzye', align: 'right', width: '120', label: '上日融资余额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'lastday_rzye')},
            {field: 'today_rzmr', align: 'right', width: '120', label: '融资买入金额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'today_rzmr')},
            {field: 'today_mqhke', align: 'right', width: '120', label: '卖券还款金额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'today_mqhke')},
            {field: 'today_rzpc', align: 'right', width: '120', label: '融资平仓金额(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'today_rzpc')},
            {field: 'market_value', align: 'right', width: '120', label: '流通市值(万元)', formatter: this.gfnElColFormatDecThou3, sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'market_value')}
          ]
        },
        isShow: false,
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
        exportSelectParams: {},
        exportSelectParams2: {}
      }
    },
    computed: {
      getFinancingRadio () {
        return this.$store.getters.getFinancingRadio
      }
    },
    watch: {
      getFinancingRadio () {
        if (this.getFinancingRadio) {
          this.isShow = true
          this.$nextTick(function () {
            this.ajaxFinanceBalanceDetail()
          })
        }
      },
      selectParams: {
        handler () {
          this.isShow = false
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
          this.ajaxFinanceBalanceSum()
        },
        deep: true
      }
    },
    methods: {
      ajaxFinanceBalanceSum () {
        let {selectTradeDate} = this.selectParams,
          params = {
            queryDate: selectTradeDate,
            pageIndex: this.totalData[1].pageIndex,
            pageRows: this.totalData[1].pageRows
          }
        this.$refs.marginTable.showOrHideLoading(true)
        this.exportSelectParams = {...params}
        financeBalanceSum(params).then(res => {
          this.$refs.marginTable.showOrHideLoading(false)
          let {bizData: {metaData, totalRows}} = res
          if (metaData) {
            let data = {
              data: metaData,
              total: totalRows,
              pageIndex: params.pageIndex,
              pageRows: params.pageRows
            }
            this.totalData[1] = data
          }
        })
      },
      ajaxFinanceBalanceDetail () {
        let {selectTradeDate} = this.selectParams,
          params = {
            queryDate: selectTradeDate,
            pageIndex: this.totalData[2].pageIndex,
            pageRows: this.totalData[2].pageRows,
            stockCode: this.getFinancingRadio
          }
        this.$refs.marginTable2.showOrHideLoading(true)
        this.exportSelectParams2 = {...params}
        financeBalanceDetail(params).then(res => {
          this.$refs.marginTable2.showOrHideLoading(false)
          let {bizData: {metaData, totalRows}} = res
          if (metaData) {
            let data = {
              data: metaData,
              total: totalRows,
              pageIndex: params.pageIndex,
              pageRows: params.pageRows
            }
            this.totalData[2] = data
          }
        })
      },
      getPageination (pageinationVal) {
        this.totalData[1].pageRows = pageinationVal.pageSizeNumber
        this.totalData[1].pageIndex = pageinationVal.currentPage
        this.isShow = false
        this.ajaxFinanceBalanceSum()
      },
      getPageination2 (pageinationVal) {
        this.totalData[2].pageRows = pageinationVal.pageSizeNumber
        this.totalData[2].pageIndex = pageinationVal.currentPage
        this.ajaxFinanceBalanceDetail()
      },
      handlerCommand1 (val) {
        let params = this.exportSelectParams
        params.fileMark = val
        params.markType = 'financeBalanceSum'
        params.tableColumns = [
          {
            sheetName: '融资融券-融资余额查询母表',
            fileColumns: this.columns[1]
          }
        ]
        delete params.pageIndex
        delete params.pageRows
        this.createElementA(params)
      },
      handlerCommand2 (val) {
        let params = this.exportSelectParams2
        params.fileMark = val
        params.markType = 'financeBalanceDetail'
        params.tableColumns = [
          {
            sheetName: '融资融券-融资余额查询子表',
            fileColumns: this.columns[2]
          }
        ]
        delete params.pageIndex
        delete params.pageRows
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
