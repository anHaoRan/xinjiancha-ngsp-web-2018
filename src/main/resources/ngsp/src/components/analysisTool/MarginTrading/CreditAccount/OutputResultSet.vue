<template>
  <div class="output-result-set">
    <s-table ref="marginTable" headerTitle="信用账户查询母表" :columns="columns[1]" :data="totalData[1]"
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
    <s-table ref="marginTable2" :headerTitle="`信用账户查询${columns[2][0].isActive?'跨日':'单日'}子表`"
             :columns="columns[2]" :data="totalData[2]"
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
    <s-table ref="marginTable3" headerTitle="信用账户查询分日子表" :columns="columns[3]" :data="totalData[3]"
             @getPageination="getPageination3" v-if="isShow2">
      <el-dropdown @command="handleDownload3" slot="elCardHeader">
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
  import CreditAccountMRadio from './CreditAccountMRadio'
  import CreditAccountRadio from './CreditAccountRadio'
  import ExportMixin from '../ExportMixin'
  import { getCreditAcct, getCreditAcctDetail } from '@/service/analysisTool/MarginTrading/Index'

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
              align: 'center',
              width: '80',
              label: '钻取选择',
              template: CreditAccountMRadio
            },
            {
              field: 'invacctno',
              align: 'left',
              width: '80',
              label: '账户代码',
              sortable: true
            },
            {
              field: 'investor_account_name',
              align: 'left',
              width: '80',
              label: '账户名称',
              sortable: true
            },
            {
              field: 'branch_name',
              align: 'left',
              width: '80',
              label: '营业部名称',
              sortable: true
            },
            {
              field: 'bm_val',
              align: 'right',
              width: '120',
              label: '融资买入额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bm_val')
            }, {
              field: 'sm_val',
              align: 'right',
              width: '120',
              label: '卖券还款额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sm_val')
            }, {
              field: 'bs_val',
              align: 'right',
              width: '120',
              label: '买券还券额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bs_val')
            }, {
              field: 'ss_val',
              align: 'right',
              width: '120',
              label: '融券卖出额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ss_val')
            }, {
              field: 'bp_val',
              align: 'right',
              width: '120',
              label: '融券平仓额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bp_val')
            }, {
              field: 'sp_val',
              align: 'right',
              width: '120',
              label: '融资平仓额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sp_val')
            }, {
              field: 'bc_val',
              align: 'right',
              width: '120',
              label: '担保品买入额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bc_val')
            }, {
              field: 'sc_val',
              align: 'right',
              width: '120',
              label: '担保品卖出额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sc_val')
            }, {
              field: 'st_qty',
              align: 'right',
              width: '120',
              label: '余券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'st_qty')
            }, {
              field: 'sr_qty',
              align: 'right',
              width: '120',
              label: '还券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sr_qty')
            }, {
              field: 'ci_qty',
              align: 'right',
              width: '120',
              label: '担保品划入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ci_qty')
            }, {
              field: 'co_qty',
              align: 'right',
              width: '120',
              label: '担保品划出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'co_qty')
            }
          ],
          2: [
            {
              field: 'isin_code',
              align: 'center',
              width: '80',
              label: '钻取选择',
              template: CreditAccountRadio,
              isActive: false
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
              field: 'bm_qty',
              align: 'right',
              width: '120',
              label: '融资买入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bm_qty')
            }, {
              field: 'bm_val',
              align: 'right',
              width: '120',
              label: '融资买入金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bm_val')
            }, {
              field: 'sm_qty',
              align: 'right',
              width: '120',
              label: '卖券还款量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sm_qty')
            }, {
              field: 'sm_val',
              align: 'right',
              width: '120',
              label: '卖券还款金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sm_val')
            }, {
              field: 'bs_qty',
              align: 'right',
              width: '120',
              label: '买券还券量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bs_qty')
            }, {
              field: 'bs_val',
              align: 'right',
              width: '120',
              label: '买券还券金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bs_val')
            }, {
              field: 'ss_qty',
              align: 'right',
              width: '120',
              label: '融券卖出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ss_qty')
            }, {
              field: 'ss_val',
              align: 'right',
              width: '120',
              label: '融券卖出金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ss_val')
            }, {
              field: 'bp_qty',
              align: 'right',
              width: '120',
              label: '融券平仓量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bp_qty')
            }, {
              field: 'bp_val',
              align: 'right',
              width: '120',
              label: '融券平仓金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bp_val')
            }, {
              field: 'sp_qty',
              align: 'right',
              width: '120',
              label: '融资平仓量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sp_qty')
            }, {
              field: 'sp_val',
              align: 'right',
              width: '120',
              label: '融资平仓金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sp_val')
            }, {
              field: 'bc_qty',
              align: 'right',
              width: '120',
              label: '担保品买入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bc_qty')
            }, {
              field: 'bc_val',
              align: 'right',
              width: '120',
              label: '担保品买入金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bc_val')
            }, {
              field: 'sc_qty',
              align: 'right',
              width: '120',
              label: '担保品卖出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sc_qty')
            }, {
              field: 'sc_val',
              align: 'right',
              width: '120',
              label: '担保品卖出金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sc_val')
            }, {
              field: 'st_qty',
              align: 'right',
              width: '120',
              label: '余券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'st_qty')
            }, {
              field: 'sr_qty',
              align: 'right',
              width: '120',
              label: '还券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sr_qty')
            }, {
              field: 'ci_qty',
              align: 'right',
              width: '120',
              label: '担保品划入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ci_qty')
            }, {
              field: 'co_qty',
              align: 'right',
              width: '120',
              label: '担保品划出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'co_qty')
            }, {
              field: 'cyl',
              align: 'right',
              width: '120',
              label: '持有量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'cyl')
            }, {
              field: 'bz',
              align: 'right',
              width: '120',
              label: '持有量占流通股本比重',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bz')
            }, {
              field: 'market_float',
              align: 'right',
              width: '120',
              label: '当日该证券流通股本(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'market_float')
            }
          ],
          3: [
            {
              field: 'trandat',
              align: 'right',
              width: '120',
              label: '日期',
              sortable: true
            },
            {
              field: 'bm_qty',
              align: 'right',
              width: '120',
              label: '融资买入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'scale')
            },
            {
              field: 'bm_val',
              align: 'right',
              width: '120',
              label: '融资买入金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ss_trdqty')
            },
            {
              field: 'sm_qty',
              align: 'right',
              width: '120',
              label: '卖券还款量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'sm_val',
              align: 'right',
              width: '120',
              label: '卖券还款金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'bs_qty',
              align: 'right',
              width: '120',
              label: '买券还券量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'bs_val',
              align: 'right',
              width: '120',
              label: '买券还券金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'ss_qty',
              align: 'right',
              width: '120',
              label: '融券卖出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'ss_val',
              align: 'right',
              width: '120',
              label: '融券卖出金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'bp_qty',
              align: 'right',
              width: '120',
              label: '融券平仓量(万股)',
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'bp_val',
              align: 'right',
              width: '120',
              label: '融券平仓金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'sp_qty',
              align: 'right',
              width: '120',
              label: '融资平仓量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'sp_val',
              align: 'right',
              width: '120',
              label: '融资平仓金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'bc_qty',
              align: 'right',
              width: '120',
              label: '担保品买入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'bc_val',
              align: 'right',
              width: '120',
              label: '担保品买入金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'sc_qty',
              align: 'right',
              width: '120',
              label: '担保品卖出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'sc_val',
              align: 'right',
              width: '120',
              label: '担保品卖出金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'st_qty',
              align: 'right',
              width: '120',
              label: '余券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'sr_qty',
              align: 'right',
              width: '120',
              label: '还券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'ci_qty',
              align: 'right',
              width: '120',
              label: '担保品划入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'co_qty',
              align: 'right',
              width: '120',
              label: '担保品划出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'cyl',
              align: 'right',
              width: '120',
              label: '持有量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'bz',
              align: 'right',
              width: '120',
              label: '持有量占流通股本比重',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'qty')
            },
            {
              field: 'market_float',
              align: 'right',
              width: '120',
              label: '当日该证券流通股本(万股)',
              formatter: this.gfnElColFormatDecThou3,
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
          },
          3: {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          }
        },
        selectParams: {},
        isShow: false,
        isShow2: false,
        exportSelectParams: {},
        exportSelectParams2: {},
        exportSelectParams3: {}
      }
    },
    computed: {
      getCreditAccountMRadio () {
        return this.$store.getters.getCreditAccountMRadio
      },
      getCreditAccountRadio () {
        return this.$store.getters.getCreditAccountRadio
      }
    },
    watch: {
      getCreditAccountMRadio () {
        if (this.getCreditAccountMRadio) {
          this.isShow = true
          this.$nextTick(function () {
            this.ajaxGetCreditAcctDetail()
          })
        }
      },
      getCreditAccountRadio () {
        if (this.getCreditAccountRadio) {
          this.isShow2 = true
          this.$nextTick(function () {
            this.ajaxGetCreditAcctDetail(true)
          })
        }
      },
      selectParams: {
        handler () {
          this.isShow = false
          this.isShow2 = false
          let {selectTradeDate} = this.selectParams
          if (selectTradeDate[0] == selectTradeDate[1]) {
            this.columns[2][0].isActive = false
          } else {
            this.columns[2][0].isActive = true
          }
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
            },
            3: {
              data: [],
              total: 0,
              pageRows: 10,
              pageIndex: 1
            }
          }
          this.ajaxGetCreditAcct()
        },
        deep: true
      }
    },
    methods: {
      ajaxGetCreditAcct () {
        let {selectTradeDate, accountId} = this.selectParams,
          params = {
            invacctno: accountId,
            dateStart: selectTradeDate[0],
            dateEnd: selectTradeDate[1],
            pageIndex: this.totalData[1].pageIndex,
            pageRows: this.totalData[1].pageRows
          }
        this.exportSelectParams = JSON.parse(JSON.stringify(params))
        this.$refs.marginTable.showOrHideLoading(true)
        getCreditAcct(params).then(res => {
          this.$refs.marginTable.showOrHideLoading(false)
          let {bizData: {metaData}} = res
          if (metaData) {
            let data = {
              data: metaData,
              total: metaData[0] ? metaData[0].total : 0,
              pageIndex: params.pageIndex,
              pageRows: params.pageRows
            }
            this.totalData[1] = data
          }
        })
      },
      ajaxGetCreditAcctDetail (flag = false) {
        let {selectTradeDate} = this.selectParams,
          params = {
            invacctno: this.getCreditAccountMRadio,
            dateStart: selectTradeDate[0],
            dateEnd: selectTradeDate[1],
            pageIndex: this.totalData[flag ? 3 : 2].pageIndex,
            pageRows: this.totalData[flag ? 3 : 2].pageRows
          }
        if (flag) {
          params.mark = 'b'
          params.isinCode = this.getCreditAccountRadio
          this.exportSelectParams3 = JSON.parse(JSON.stringify(params))
          this.$refs.marginTable3.showOrHideLoading(true)
        } else {
          params.mark = 'a'
          this.exportSelectParams2 = JSON.parse(JSON.stringify(params))
          this.$refs.marginTable2.showOrHideLoading(true)
        }
        getCreditAcctDetail(params).then(res => {
          if (flag) {
            this.$refs.marginTable3.showOrHideLoading(false)
          } else
            this.$refs.marginTable2.showOrHideLoading(false)
          let {bizData: {metaData}} = res
          if (metaData) {
            let data = {
              data: metaData,
              total: metaData[0] ? metaData[0].total : 0,
              pageIndex: params.pageIndex,
              pageRows: params.pageRows
            }
            this.totalData[flag ? 3 : 2] = data
          }
        })
      },
      getPageination (pageinationVal) {
        this.totalData[1].pageRows = pageinationVal.pageSizeNumber
        this.totalData[1].pageIndex = pageinationVal.currentPage
        this.isShow = false
        this.ajaxPostMember()
      },
      getPageination2 (pageinationVal) {
        this.totalData[2].pageRows = pageinationVal.pageSizeNumber
        this.totalData[2].pageIndex = pageinationVal.currentPage
        this.ajaxGetCreditAcctDetail()
      },
      getPageination3 (pageinationVal) {
        this.totalData[3].pageRows = pageinationVal.pageSizeNumber
        this.totalData[3].pageIndex = pageinationVal.currentPage
        this.ajaxGetCreditAcctDetail(true)
      },
      handleDownload (val) {
        let params = this.exportSelectParams
        params.fileMark = val
        params.markType = 'creditAcctQuery'
        params.tableColumns = [
          {
            sheetName: '融资融券-信用账户查询母表',
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
        params.markType = 'creditAcctQuerySub'
        params.tableColumns = [
          {
            sheetName: `融资融券-信用账户查询${this.columns[2][0].isActive ? '跨日' : '单日'}子表`,
            fileColumns: this.columns[2]
          }
        ]
        delete params.pageIndex
        delete params.pageRows
        this.createElementA(params)
      },
      handleDownload3 (val) {
        let params = this.exportSelectParams3
        params.fileMark = val
        params.markType = 'creditAcctQuerySub'
        params.tableColumns = [
          {
            sheetName: '融资融券-信用账户查询分日子表',
            fileColumns: this.columns[3]
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
