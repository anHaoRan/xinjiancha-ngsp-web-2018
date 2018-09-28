<template>
  <div class="output-result-set">
    <s-table ref="marginTable" headerTitle="融券余量查询母表" :columns="columns[1]" :data="totalData[1]"
             @getPageination="getPageination">
      <el-dropdown @command="handleDownload" slot="elCardHeader">
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
    <s-table ref="marginTable2" headerTitle="融券余量查询子表" :columns="columns[2]" :data="totalData[2]"
             @getPageination="getPageination2" v-if="isShow">
      <el-dropdown @command="handleDownload2" slot="elCardHeader">
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
  import SecuritiesRadio from './SecuritiesRadio'
  import ExportMixin from '../ExportMixin'
  import { securitiesLoanMarginSum, securitiesLoanMarginDetail } from '@/service/analysisTool/MarginTrading/Index'

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
              field: 'instrument_id',
              align: 'center',
              width: '80',
              label: '钻取选择',
              template: SecuritiesRadio
            },
            {
              field: 'instrument_id',
              align: 'left',
              width: '80',
              label: '证券代码',
              sortable: true
            },
            {
              field: 'instrument_chn_short_name',
              align: 'left',
              width: '80',
              label: '证券简称',
              sortable: true
            },
            {
              field: 'rqyl',
              align: 'right',
              width: '120',
              label: '本日融券余量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'rqyl')
            },
            {
              field: 'per',
              align: 'right',
              width: '120',
              label: '融券余量占流通股本比例',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'per')
            },
            {
              field: 'lastday_rqyl',
              align: 'right',
              width: '120',
              label: '上日融券余量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'lastday_rqyl')
            },
            {
              field: 'today_rqmcl',
              align: 'right',
              width: '120',
              label: '融券卖出量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_rqmcl')
            },
            {
              field: 'today_mqhql',
              align: 'right',
              width: '120',
              label: '买券还券量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_mqhql')
            },
            {
              field: 'today_rqpcl',
              align: 'right',
              width: '120',
              label: '融券平仓量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_rqpcl')
            },
            {
              field: 'today_zjhql',
              align: 'right',
              width: '120',
              label: '还券划转量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_zjhql')
            },
            {
              field: 'today_yqhzl',
              align: 'right',
              width: '120',
              label: '余券划转量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_yqhzl')
            },
            {
              field: 'market_float',
              align: 'right',
              width: '120',
              label: '流通股本(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'market_float')
            }
          ],
          2: [
            {
              field: 'member_name',
              align: 'left',
              width: '80',
              label: '会员名称',
              sortable: true
            },
            {
              field: 'rqyl',
              align: 'left',
              width: '80',
              label: '本日融券余量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'rqyl')
            },
            {
              field: 'per',
              align: 'right',
              width: '120',
              label: '融券余量占流通股本比例',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'per')
            },
            {
              field: 'lastday_rqyl',
              align: 'right',
              width: '120',
              label: '上日融券余量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'lastday_rqyl')
            },
            {
              field: 'today_rqmcl',
              align: 'right',
              width: '120',
              label: '融券卖出量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_rqmcl')
            },
            {
              field: 'today_mqhql',
              align: 'right',
              width: '120',
              label: '买券还券量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_mqhql')
            },
            {
              field: 'today_rqpcl',
              align: 'right',
              width: '120',
              label: '融券平仓量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_rqpcl')
            },
            {
              field: 'today_zjhql',
              align: 'right',
              width: '120',
              label: '还券划转量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_zjhql')
            },
            {
              field: 'today_yqhzl',
              align: 'right',
              width: '120',
              label: '余券划转量(万)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'today_yqhzl')
            }
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
      getSecuritiesRadio () {
        return this.$store.getters.getSecuritiesRadio
      }
    },
    watch: {
      getSecuritiesRadio () {
        if (this.getSecuritiesRadio) {
          this.isShow = true
          this.$nextTick(function () {
            this.ajaxSecuritiesLoanMarginDetail()
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
          this.ajaxSecuritiesLoanMarginSum()
        },
        deep: true
      }
    },
    methods: {
      ajaxSecuritiesLoanMarginSum () {
        let {selectTradeDate} = this.selectParams,
          params = {
            queryDate: selectTradeDate,
            pageIndex: this.totalData[1].pageIndex,
            pageRows: this.totalData[1].pageRows
          }
        this.exportSelectParams = JSON.parse(JSON.stringify(params))
        this.$refs.marginTable.showOrHideLoading(true)
        securitiesLoanMarginSum(params).then(res => {
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
      ajaxSecuritiesLoanMarginDetail () {
        let {selectTradeDate} = this.selectParams,
          params = {
            queryDate: selectTradeDate,
            pageIndex: this.totalData[2].pageIndex,
            pageRows: this.totalData[2].pageRows,
            stockCode: this.getSecuritiesRadio
          }
        this.exportSelectParams2 = JSON.parse(JSON.stringify(params))
        this.$refs.marginTable2.showOrHideLoading(true)
        securitiesLoanMarginDetail(params).then(res => {
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
        this.ajaxSecuritiesLoanMarginSum()
      },
      getPageination2 (pageinationVal) {
        this.totalData[2].pageRows = pageinationVal.pageSizeNumber
        this.totalData[2].pageIndex = pageinationVal.currentPage
        this.ajaxSecuritiesLoanMarginDetail()
      },
      handleDownload (val) {
        let params = this.exportSelectParams
        params.fileMark = val
        params.markType = 'SecuritiesLoanMarginSum'
        params.tableColumns = [
          {
            sheetName: '融资融券-融券余量查询母表',
            fileColumns: this.columns[1]
          }
        ]
        delete params.pageIndex
        delete params.pageRows
        this.createElementA(params)
      },
      handleDownload2 (val) {
        let params = this.exportSelectParams2
        params.fileMark = val
        params.markType = 'SecuritiesLoanMarginDetail'
        params.tableColumns = [
          {
            sheetName: '融资融券-融券余量查询子表',
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
