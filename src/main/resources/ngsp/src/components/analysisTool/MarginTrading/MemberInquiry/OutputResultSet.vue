<template>
  <div class="output-result-set">
    <s-table ref="marginTable" headerTitle="会员查询母表" :columns="columns[1]" :data="totalData[1]"
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
    <s-table ref="marginTable2" headerTitle="会员查询子表" :columns="columns[2]" :data="totalData[2]"
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
  import MemberRadio from './MemberRadio'
  import ExportMixin from '../ExportMixin'
  import { getMember, getMemberDetail } from '@/service/analysisTool/MarginTrading/Index'

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
              field: 'member_id',
              align: 'center',
              label: '钻取选择',
              width: '80',
              template: MemberRadio
            },
            {
              field: 'member_name',
              align: 'left',
              width: '80',
              label: '会员名称',
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
            },
            {
              field: 'sm_val',
              align: 'right',
              width: '120',
              label: '卖券还款额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sm_val')
            },
            {
              field: 'bs_val',
              align: 'right',
              width: '120',
              label: '买券还券额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bs_val')
            },
            {
              field: 'ss_val',
              align: 'right',
              width: '120',
              label: '融券卖出额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ss_val')
            },
            {
              field: 'bp_val',
              align: 'right',
              width: '120',
              label: '融券平仓额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bp_val')
            },
            {
              field: 'sp_val',
              align: 'right',
              width: '120',
              label: '融资平仓额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sp_val')
            },
            {
              field: 'bc_val',
              align: 'right',
              width: '120',
              label: '担保品买入额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bc_val')
            },
            {
              field: 'sc_val',
              align: 'right',
              width: '120',
              label: '担保品卖出额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sc_val')
            },
            {
              field: 'ci_qty',
              align: 'right',
              width: '120',
              label: '担保品划入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ci_qty')
            },
            {
              field: 'co_qty',
              align: 'right',
              width: '120',
              label: '担保品划出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'co_qty')
            },
            {
              field: 'si_qty',
              align: 'right',
              width: '120',
              label: '券源划入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'si_qty')
            },
            {
              field: 'so_qty',
              align: 'right',
              width: '120',
              label: '券源划出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'so_qty')
            },
            {
              field: 'st_qty',
              align: 'right',
              width: '120',
              label: '余券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'st_qty')
            },
            {
              field: 'sr_qty',
              align: 'right',
              width: '120',
              label: '还券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sr_qty')
            },
            {
              field: 'kyp',
              align: 'right',
              width: '120',
              label: '可用融券金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'kyp')
            }
          ],
          2: [
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
              sortMethod: this.gfnSortColByNumber.bind(this, 'kyp')
            },
            {
              field: 'bm_val',
              align: 'right',
              width: '120',
              label: '融资买入金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bm_val')
            },
            {
              field: 'sm_qty',
              align: 'right',
              width: '120',
              label: '卖券还款量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sm_qty')
            },
            {
              field: 'sm_val',
              align: 'right',
              width: '120',
              label: '卖券还款金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sm_val')
            },
            {
              field: 'bs_qty',
              align: 'right',
              width: '120',
              label: '买券还券量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bs_qty')
            },
            {
              field: 'bs_val',
              align: 'right',
              width: '120',
              label: '买券还券金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bs_val')
            },
            {
              field: 'ss_qty',
              align: 'right',
              width: '120',
              label: '融券卖出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ss_qty')
            },
            {
              field: 'ss_val',
              align: 'right',
              width: '120',
              label: '融券卖出金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ss_val')
            },
            {
              field: 'bp_qty',
              align: 'right',
              width: '120',
              label: '融券平仓量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bp_qty')
            },
            {
              field: 'bp_val',
              align: 'right',
              width: '120',
              label: '融券平仓金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bp_val')
            },
            {
              field: 'sp_qty',
              align: 'right',
              width: '120',
              label: '融资平仓量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sp_qty')
            },
            {
              field: 'sp_val',
              align: 'right',
              width: '120',
              label: '融资平仓金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sp_val')
            },
            {
              field: 'bc_qty',
              align: 'right',
              width: '120',
              label: '担保品买入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bc_qty')
            },
            {
              field: 'bc_val',
              align: 'right',
              width: '120',
              label: '担保品买入金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'bc_val')
            },
            {
              field: 'sc_qty',
              align: 'right',
              width: '120',
              label: '担保品卖出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sc_qty')
            },
            {
              field: 'sc_val',
              align: 'right',
              width: '120',
              label: '担保品卖出金额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sc_val')
            },
            {
              field: 'ci_qty',
              align: 'right',
              width: '120',
              label: '担保品划入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'ci_qty')
            },
            {
              field: 'co_qty',
              align: 'right',
              width: '120',
              label: '担保品划出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'co_qty')
            },
            {
              field: 'si_qty',
              align: 'right',
              width: '120',
              label: '券源划入量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'si_qty')
            },
            {
              field: 'so_qty',
              align: 'right',
              width: '120',
              label: '券源划出量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'so_qty')
            },
            {
              field: 'st_qty',
              align: 'right',
              width: '120',
              label: '余券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'st_qty')
            },
            {
              field: 'sr_qty',
              align: 'right',
              width: '120',
              label: '还券划转量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'sr_qty')
            },
            {
              field: 'mspa',
              align: 'right',
              width: '120',
              label: '会员融券专用账户余量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mspa')
            },
            {
              field: 'zhye',
              align: 'right',
              width: '120',
              label: '会员融券专用账户余额(万元)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'zhye')
            },
            {
              field: 'mspar',
              align: 'right',
              width: '140',
              label: '会员融券专用账户余量占流通股本比重',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mspar')
            },
            {
              field: 'mepa',
              align: 'right',
              width: '120',
              label: '会员信用担保账户余量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mepa')
            },
            {
              field: 'mepar',
              align: 'right',
              width: '140',
              label: '会员信用担保账户余量占流通股本比重',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mepar')
            },
            {
              field: 'mapa',
              align: 'right',
              width: '120',
              label: '会员自营账户余量(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mapa')
            },
            {
              field: 'mapar',
              align: 'right',
              width: '140',
              label: '会员自营账户余量占流通股本比重',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'mapar')
            },
            {
              field: 'market_float',
              align: 'right',
              width: '120',
              label: '当日该证券流通股本(万股)',
              formatter: this.gfnElColFormatDecThou3,
              sortable: true,
              sortMethod: this.gfnSortColByNumber.bind(this, 'market_float')
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
      getMemberInquiryRadio () {
        return this.$store.getters.getMemberInquiryRadio
      }
    },
    watch: {
      getMemberInquiryRadio () {
        if (this.getMemberInquiryRadio) {
          this.isShow = true
          this.$nextTick(function () {
            this.ajaxPostMemberDetail()
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
          this.ajaxPostMember()
        },
        deep: true
      }
    },
    methods: {
      ajaxPostMember () {
        let {dateType, selectTradeDate} = this.selectParams,
          [dateStart, timeStart] = selectTradeDate[0].split(' '),
          [dateEnd, timeEnd] = selectTradeDate[1].split(' '),
          params = {
            dateType: dateType,
            dateStart: dateStart,
            dateEnd: dateEnd,
            pageIndex: this.totalData[1].pageIndex,
            pageRows: this.totalData[1].pageRows,
            timeStart: '',
            timeEnd: ''
          }
        if (dateType === '1') {
          params.timeStart = timeStart
          params.timeEnd = timeEnd
        }
        this.exportSelectParams = JSON.parse(JSON.stringify(params))
        this.$refs.marginTable.showOrHideLoading(true)
        getMember(params).then(res => {
          this.$refs.marginTable.showOrHideLoading(false)
          let {bizData: {metaData}} = res
          if (metaData) {
            let data = {
              data: metaData,
              total: metaData[1] ? metaData[1].total : 0,
              pageIndex: params.pageIndex,
              pageRows: params.pageRows
            }
            this.totalData[1] = data
          }
        })
      },
      ajaxPostMemberDetail () {
        let {dateType, selectTradeDate} = this.selectParams,
          [dateStart, timeStart] = selectTradeDate[0].split(' '),
          [dateEnd, timeEnd] = selectTradeDate[1].split(' '),
          params = {
            dateType: dateType,
            dateStart: dateStart,
            dateEnd: dateEnd,
            pageIndex: this.totalData[2].pageIndex,
            pageRows: this.totalData[2].pageRows,
            timeStart: '',
            timeEnd: '',
            memberID: this.getMemberInquiryRadio
          }
        if (dateType === '1') {
          params.timeStart = timeStart
          params.timeEnd = timeEnd
        }
        this.exportSelectParams2 = JSON.parse(JSON.stringify(params))
        this.$refs.marginTable2.showOrHideLoading(true)
        getMemberDetail(params).then(res => {
          this.$refs.marginTable2.showOrHideLoading(false)
          let {bizData: {metaData}} = res
          if (metaData) {
            let data = {
              data: metaData,
              total: metaData[1] ? metaData[1].total : 0,
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
        this.ajaxPostMember()
      },
      getPageination2 (pageinationVal) {
        this.totalData[2].pageRows = pageinationVal.pageSizeNumber
        this.totalData[2].pageIndex = pageinationVal.currentPage
        this.ajaxPostMemberDetail()
      },
      handleDownload (val) {
        let params = this.exportSelectParams
        params.fileMark = val
        params.markType = 'memberQuery'
        params.tableColumns = [
          {
            sheetName: '融资融券-会员查询母表',
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
        params.markType = 'memberQuerySub'
        params.tableColumns = [
          {
            sheetName: '融资融券-会员查询子表',
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
