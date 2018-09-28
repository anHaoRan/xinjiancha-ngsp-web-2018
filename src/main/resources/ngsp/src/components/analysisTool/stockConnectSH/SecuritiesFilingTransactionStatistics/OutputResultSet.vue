<template>
    <div class="output-result-set">
        <s-table ref="marginTable" headerTitle="沪股通标的证券申报和交易统计母表" :columns="columns[1]" :data="totalData[1]"
                 @getPageination="getPageination">
            <el-button type="info" size="small" slot="elCardHeader" @click="handleDownload">
                导出
            </el-button>
        </s-table>
        <s-table ref="marginTable2" headerTitle="沪股通标的证券申报和交易统计子表" :columns="columns[2]" :data="totalData[2]"
                 @getPageination="getPageination2" v-if="isShow">
            <el-button type="info" size="small" slot="elCardHeader" @click="handleDownload2">
                导出
            </el-button>
        </s-table>
    </div>
</template>

<script>
  import SecuritiesFilingRadio from './SecuritiesFilingRadio'
  import { getDecandtrd, getDecandtrdChild, postExport } from '@/service/analysisTool/stockConnectSH/index'

  export default {
    name: 'output-result-set',
    props: {},
    components: {
      STable: () => import('@/components/base/STable')
    },
    mixins: [],
    data () {
      return {
        columns: {
          1: [
            {
              field: 'instrument_id',
              align: 'center',
              label: '钻取选择',
              width: '80',
              template: SecuritiesFilingRadio
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
              field: 'b_order_qty',
              align: 'right',
              width: '120',
              label: '申报买入数量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_qty')
            },
            {
              field: 'b_ord_mkt',
              align: 'right',
              width: '120',
              label: '申报买入金额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_ord_mkt')
            },
            {
              field: 'b_no_trade_qty',
              align: 'right',
              width: '120',
              label: '买入未成交量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_no_trade_qty')
            },
            {
              field: 'b_cancel_qty',
              align: 'right',
              width: '120',
              label: '买入撤单量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_qty')
            },
            {
              field: 'b_trdqty',
              align: 'right',
              width: '120',
              label: '买入成交量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty')
            },
            {
              field: 'b_mktval',
              align: 'right',
              width: '120',
              label: '买入成交金额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_mktval')
            },
            {
              field: 'b_avg',
              align: 'right',
              width: '120',
              label: '买入成交均价',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_avg')
            },
            {
              field: 'b_bl',
              align: 'right',
              width: '120',
              label: '买成交占市场成交比例',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_bl')
            },
            {
              field: 's_order_qty',
              align: 'right',
              width: '120',
              label: '申报卖出数量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_order_qty')
            },
            {
              field: 's_ord_mkt',
              align: 'right',
              width: '120',
              label: '申报卖出金额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_ord_mkt')
            },
            {
              field: 's_no_trade_qty',
              align: 'right',
              width: '120',
              label: '卖出未成交量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_no_trade_qty')
            },
            {
              field: 's_cancel_qty',
              align: 'right',
              width: '120',
              label: '卖出撤单量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_qty')
            },
            {
              field: 's_trdqty',
              align: 'right',
              width: '120',
              label: '卖出成交量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty')
            },
            {
              field: 's_mktval',
              align: 'right',
              width: '120',
              label: '卖出成交金额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_mktval')
            },
            {
              field: 's_avg',
              align: 'right',
              width: '120',
              label: '卖出成交均价',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_avg')
            },
            {
              field: 's_bl',
              align: 'right',
              width: '120',
              label: '卖成交占市场成交比例',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_bl')
            }
          ],
          2: [
            {
              field: 'brnid',
              align: 'left',
              width: '80',
              label: '参与者代码',
              sortable: true
            },
            {
              field: 'branch_name',
              align: 'left',
              width: '80',
              label: '参与者名称',
              sortable: true
            },
            {
              field: 'b_order_qty',
              align: 'right',
              width: '120',
              label: '申报买入数量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_qty')
            },
            {
              field: 'b_ord_mkt',
              align: 'right',
              width: '120',
              label: '申报买入金额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_ord_mkt')
            },
            {
              field: 'b_no_trade_qty',
              align: 'right',
              width: '120',
              label: '买入未成交量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_no_trade_qty')
            },
            {
              field: 'b_cancel_qty',
              align: 'right',
              width: '120',
              label: '买入撤单量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_qty')
            },
            {
              field: 'b_trdqty',
              align: 'right',
              width: '120',
              label: '买入成交量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty')
            },
            {
              field: 'b_mktval',
              align: 'right',
              width: '120',
              label: '买入成交金额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_mktval')
            },
            {
              field: 'b_avg',
              align: 'right',
              width: '120',
              label: '买入成交均价',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_avg')
            },
            {
              field: 'b_bl',
              align: 'right',
              width: '120',
              label: '买成交占市场成交比例',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'b_bl')
            },
            {
              field: 's_order_qty',
              align: 'right',
              width: '120',
              label: '申报卖出数量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_order_qty')
            },
            {
              field: 's_ord_mkt',
              align: 'right',
              width: '120',
              label: '申报卖出金额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_ord_mkt')
            },
            {
              field: 's_no_trade_qty',
              align: 'right',
              width: '120',
              label: '卖出未成交量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_no_trade_qty')
            },
            {
              field: 's_cancel_qty',
              align: 'right',
              width: '120',
              label: '卖出撤单量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_qty')
            },
            {
              field: 's_trdqty',
              align: 'right',
              width: '120',
              label: '卖出成交量',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty')
            },
            {
              field: 's_mktval',
              align: 'right',
              width: '120',
              label: '卖出成交金额',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_mktval')
            },
            {
              field: 's_avg',
              align: 'right',
              width: '120',
              label: '卖出成交均价',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_avg')
            },
            {
              field: 's_bl',
              align: 'right',
              width: '120',
              label: '卖成交占市场成交比例',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 's_bl')
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
      getSecuritiesFilingRadio () {
        return this.$store.getters.getSecuritiesFilingRadio
      }
    },
    watch: {
      getSecuritiesFilingRadio () {
        if (this.getSecuritiesFilingRadio) {
          this.isShow = true
          this.$nextTick(function () {
            this.ajaxGetDecandtrdChild()
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
          this.ajaxGetDecandtrd()
        },
        deep: true
      }
    },
    methods: {
      ajaxGetDecandtrd () {
        let {indexCode, selectTradeDate} = this.selectParams,
        params = {
          stockCode: indexCode,
          dateTimeStart: selectTradeDate[0],
          dateTimeEnd: selectTradeDate[1],
          pageIndex: this.totalData[1].pageIndex,
          pageRows: this.totalData[1].pageRows
        }
        this.exportSelectParams = JSON.parse(JSON.stringify(params))
        this.$refs.marginTable.showOrHideLoading(true)
        getDecandtrd(params).then(res => {
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
      ajaxGetDecandtrdChild () {
        let {selectTradeDate} = this.selectParams,
        params = {
          stockCode: this.getSecuritiesFilingRadio,
          dateTimeStart: selectTradeDate[0],
          dateTimeEnd: selectTradeDate[1],
          pageIndex: this.totalData[2].pageIndex,
          pageRows: this.totalData[2].pageRows
        }
        this.exportSelectParams2 = JSON.parse(JSON.stringify(params))
        this.$refs.marginTable2.showOrHideLoading(true)
        getDecandtrdChild(params).then(res => {
          this.$refs.marginTable2.showOrHideLoading(false)
          let {bizData: {metaData, rows}} = res
          if (metaData) {
            let data = {
              data: metaData,
              total: rows,
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
        this.ajaxGetDecandtrd()
      },
      getPageination2 (pageinationVal) {
        this.totalData[2].pageRows = pageinationVal.pageSizeNumber
        this.totalData[2].pageIndex = pageinationVal.currentPage
        this.ajaxGetDecandtrdChild()
      },
      handleDownload () {
        let params = this.exportSelectParams,
        columns = JSON.parse(JSON.stringify(this.columns[1]))
        params.fileType = 'excel'
        params.isDetail = false
        params.tableColumns = [
          {
            sheetName: '沪港通查询-沪股通标的证券申报和交易统计母表',
            fileColumns: columns.splice(1, columns.length)
          }
        ]
        this.fnexport(params)
      },
      handleDownload2 () {
        let params = this.exportSelectParams2
        params.fileType = 'excel'
        params.isDetail = true
        params.tableColumns = [
          {
            sheetName: '沪港通查询-沪股通标的证券申报和交易统计子表',
            fileColumns: this.columns[2]
          }
        ]
        this.fnexport(params)
      },
      fnexport (params) {
        params.type = 'hgtDecandtrd'
        delete params.pageIndex
        delete params.pageRows
        this.createElementA(params)
      },
      createElementA (installParams) {
        let params = {}
        for (let key in installParams) {
          params[key] = installParams[key]
        }
        console.log(JSON.stringify(params))
        this.gfnExportFileWithForm(postExport(), params)
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
