<template>
    <div class="institutions">
        <div style="display: flex;justify-content: space-between">
            <trading-amount ref="trading" style="width: 70%;"></trading-amount>
            <div class="accountDetailTable" style="height: 350px;width: 27%;">
                <div class="title">账户成交统计表</div>
                <el-table
                        :data="tableData"
                        :show-header="false"
                        style="width: 100%;">
                    <el-table-column
                            v-for="column in tableColumns"
                            :key="column.field"
                            :align="column.align"
                            :prop="column.field"
                            :label="column.label">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-row>
            <el-col>
                产品类型
                <el-radio v-model="productType" label="0">全部</el-radio>
                <el-radio v-model="productType" label="1">上证50</el-radio>
                <el-radio v-model="productType" label="2">非上证50</el-radio>
                时间
                <el-time-picker
                        size="small"
                        is-range
                        v-model="timePicker"
                        value-format="HH:mm:ss"
                        range-separator="至"
                        start-placeholder="09:00:00"
                        end-placeholder="17:00:00"
                        placeholder="选择时间范围">
                </el-time-picker>
                <el-button
                        type="primary"
                        size="small"
                        @click="select">查询
                </el-button>
            </el-col>
        </el-row>
        <el-card>
            <div slot="header" class="clearfix">
                <span>交易情况汇总</span>
                <span style="float: right">注：净额=买入金额-卖出金额；单位为万元</span>
            </div>
            <el-table
                    border
                    :data="transactionSummary"
                    tooltip-effect="dark"
                    style="width: 100%; overflow:visible">
                <s-table-columns v-for="(item,index) in columns"
                                 :key="index"
                                 :item="item"
                                 v-if="item.isActive===undefined||item.isActive"/>
            </el-table>
            <span v-html="copyData" class="copy" @click="copyClick()"></span>
        </el-card>
        <el-card>
            <div slot="header" class="clearfix">
                <span>个股明细</span>
                <span style="float: right">* 注：股数均以万股为单位、金额均以亿元为单位</span>
            </div>
            <el-table
                    border
                    :data="companyAccountData"
                    tooltip-effect="dark"
                    max-height="600"
                    :cell-class-name="fnCellClassName"
                    style="width: 100%; overflow:visible">
                <el-table-column
                        type="index">
                </el-table-column>
                <s-table-columns v-for="(item,index) in STABILITY_LIST_ACCOUNT_GRID"
                                 :key="index"
                                 :item="item"
                                 v-if="item.isActive===undefined||item.isActive"/>
            </el-table>
        </el-card>
    </div>
</template>
<script>
  //   请求接口引入
  import {
    trdDetailChart,
    trdDetailChartHalfHour,
    queryYmtoraccno,
    listJqueryGrid,
    queryDaya,
    accountDealTable
  } from '@/service/marketStability'
  //    指数涨跌幅
  import TradingAmount from '../component/TradingAmount.vue'
  import { securityStyle } from '@/utils/constants'

  window.document.title = '交易情况'
  export default {
    //   组件注册CNSH06000283
    components: {
      STableColumns: () => import('@/components/base/STableColumns'), //  表格列
      TradingAmount
    },
    data () {
      return {
        STABILITY_LIST_ACCOUNT_GRID: [
          {
            field: 'code',
            label: '证券代码',
            width: '120',
            align: 'left',
            sortable: true
          },
          {
            field: 'name',
            label: '证券名称',
            width: '120',
            align: 'left',
            sortable: true
          },
          {
            field: 'je',
            label: '净额',
            width: '80',
            align: 'right',
            tooltip: '净额 = 买入金额 - 卖出金额',
            formatter: this.gfnElColFormatDecThou3,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'je')
          },
          {
            field: 'initiative_je',
            label: '主动净额',
            width: '80',
            align: 'right',
            tooltip: '主动净额 = 主动买入金额 - 主动卖出金额',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'initiative_je')
          },
          {
            field: 'trdqty_b',
            label: '买入数量',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b')
          },
          {
            field: 'mktval_b',
            label: '买入金额',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_b')
          },
          {
            field: 'trdqty_s',
            label: '卖出数量',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s')
          },
          {
            field: 'mktval_s',
            label: '卖出金额',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_s')
          },
          {
            field: 'position_amount',
            label: '前持股数',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount')
          },
          {
            field: 'trdqty_s_per',
            label: '当日卖出数量占比(%)',
            width: '80',
            align: 'right',
            tooltip: '当日卖出数量占比=(卖出数量/前持股数)*100',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s_per')
          },
          {
            field: 'initiative_trdqty_b',
            label: '主动买入数量',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'initiative_trdqty_b')
          },
          {
            field: 'initiative_trdamt_b',
            label: '主动买入金额',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'initiative_trdamt_b')
          },
          {
            field: 'initiative_trdqty_s',
            label: '主动卖出数量',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'initiative_trdqty_s')
          },
          {
            field: 'initiative_trdamt_s',
            label: '主动卖出金额',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'initiative_trdamt_s')
          },
          {
            field: 'per_trd_b',
            label: '主动买入成交占比(%)',
            width: '80',
            align: 'right',
            tooltip: '主动买入成交占比 = (主动买入金额 / 买入金额)*100',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'per_trd_b')
          },
          {
            field: 'per_trd_s',
            label: '主动卖出成交占比(%)',
            width: '80',
            align: 'right',
            tooltip: '主动卖出成交占比 = (主动卖出金额 / 卖出金额)*100',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'per_trd_s')
          },
          {
            field: 'per_num_b',
            label: '主动买入数量占该标的指定时间内的成交占比(%)',
            width: '80',
            align: 'right',
            tooltip: '主动买入数量占该标的指定时间内的成交量比 = (主动买入数量 / 指定时间段内该标的成交数量)*100',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'per_num_b')
          },
          {
            field: 'per_num_s',
            label: '主动卖出数量占该标的指定时间内的成交占比(%)',
            width: '80',
            align: 'right',
            tooltip: '主动卖出数量占该标的指定时间内的成交量比 = (主动卖出数量 / 指定时间段内该标的成交数量)*100',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'per_num_s')
          },
          {
            field: 'dy_min_max',
            label: '打压区间',
            width: '80',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'dy_min_max')
          },
          {
            field: 'maxrange',
            label: '打压幅度(%)',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'maxrange')
          },
          {
            field: 'sale_amt',
            label: '打压区间主动卖出金额',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sale_amt')
          },
          {
            field: 'sale_per',
            label: '打压占比(%)',
            width: '80',
            align: 'right',
            tooltip: '打压占比=(打压区间账户主动卖出数量/期间该证券成交数量)*100',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sale_per')
          },
          {
            field: 'lt_min_max',
            label: '拉抬区间',
            width: '80',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'lt_min_max')
          },
          {
            field: 'lt_maxrange',
            label: '拉抬幅度(%)',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'lt_maxrange')
          },
          {
            field: 'lt_sale_amt',
            label: '拉抬区间主动买入金额',
            width: '80',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'lt_mktval')
          },
          {
            field: 'lt_sale_per',
            label: '拉抬占比(%)',
            width: '80',
            align: 'right',
            tooltip: '拉抬占比=(拉抬区间账户主动买入数量/期间该证券成交数量)*100',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'lt_maxper')
          }],
        timePicker: ['09:00:00', '15:00:00'],
        productType: '0',
        columns: [
          {
            field: 'label',
            label: '净额',
            width: '8%',
            align: 'left'
          }, {
            field: 'collectionAuction',
            label: '集合竞价',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }, {
            field: 'sj0930_0959',
            label: '9:30~9:59',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }, {
            field: 'sj1000_1029',
            label: '10:00~10:29',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }, {
            field: 'sj1030_1059',
            label: '10:30~10:59',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }, {
            field: 'sj1100_1130',
            label: '11:00~11:30',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }, {
            field: 'sj1300_1329',
            label: '13:00~13:29',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }, {
            field: 'sj1330_1359',
            label: '13:30~13:59',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }, {
            field: 'sj1400_1429',
            label: '14:00~14:29',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }, {
            field: 'sj1430_1500',
            label: '14:30~15:00',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }, {
            field: 'total',
            label: '合计',
            width: '8%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan
          }
        ],
        transactionSummary: [
          {
            label: '上证50',
            collectionAuction: '',
            sj0930_0959: '',
            sj1000_1029: '',
            sj1030_1059: '',
            sj1100_1130: '',
            sj1300_1329: '',
            sj1330_1359: '',
            sj1400_1429: '',
            sj1430_1500: '',
            total: 0
          }, {
            label: '非上证50',
            collectionAuction: '',
            sj0930_0959: '',
            sj1000_1029: '',
            sj1030_1059: '',
            sj1100_1130: '',
            sj1300_1329: '',
            sj1330_1359: '',
            sj1400_1429: '',
            sj1430_1500: '',
            total: 0
          }, {
            label: '全部',
            collectionAuction: '',
            sj0930_0959: '',
            sj1000_1029: '',
            sj1030_1059: '',
            sj1100_1130: '',
            sj1300_1329: '',
            sj1330_1359: '',
            sj1400_1429: '',
            sj1430_1500: '',
            total: 0
          }
        ],
        companyAccountData: [],
        tradingList: [],
        copyData: '',
        showCopyTrdDirection: '',
        detailMinute: '',
        tableColumns: [
          {label: '名称', field: 'name', align: 'center', minWidth: '5%'},
          {label: '数值', field: 'value', align: 'center', minWidth: '5%'}
        ],
        tableData: [
          {name: '一分钟最大卖出金额', value: ''},
          {name: '期间一分钟最大卖出金额', value: ''},
          {name: '期间净卖出金额', value: ''},
          {name: '全天净卖出金额', value: ''},
          {name: '是否程序化特征账户', value: ''},
          {name: '是否存在打压行为', value: ''}
        ]
      }
    },
    watch: {
      '$route': 'init',
      productType: function () {
        this.$refs.trading.fnRenewEcharts()
      }
    },
    methods: {
      fnCellClassName ({row, column}) {
        let className = ''
        if (column.property === 'je') {
          if (row[column.property] < 0) {
            className = securityStyle.down
          } else if (row[column.property] > 0) {
            className = securityStyle.up
          }
        } else if (column.property === 'maxrange') {
          if (row[column.property] <= 0) {
            className = securityStyle.down
          } else if (row[column.property] > 0) {
            className = securityStyle.up
          }
        } else if (column.property === 'lt_maxrange') {
          if (row[column.property] < 0) {
            className = securityStyle.down
          } else if (row[column.property] >= 0) {
            className = securityStyle.up
          }
        }
        return className
      },
      init (flag = true) {
        if (this.$route.params.trdDirection == 'jmc') {
          this.showCopyTrdDirection = '净卖出'
        } else if (this.$route.params.trdDirection == 'jmr') {
          this.showCopyTrdDirection = '净买入'
        } else if (this.$route.params.trdDirection == 'zdmc') {
          this.showCopyTrdDirection = '主动卖出'
        } else {
          this.showCopyTrdDirection = '主动买入'
        }
        this.ajaxTrdDetailChart()
        this.ajaxListJqueryGrid()
        this.AjaxGetCompanyTradeDetailMinute()
        if (flag) {
          this.getAccountDealTable(this.$route.params.startTime, this.$route.params.endTime)
        } else {
          let startTime = this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000'
          let endTime = this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000'
          this.getAccountDealTable(startTime, endTime)
        }
      },
      select () {
        this.init(false)
        this.$refs.trading.fnRenewEcharts()
      },
      copyClick () {
        this.$confirm('复制文字', '提示', {
          confirmButtonText: '复制',
          cancelButtonText: '取消'
        }).then(() => {
          let selection = window.getSelection()
          let range = document.createRange()
          range.selectNodeContents($('.copy')[0])
          selection.removeAllRanges()
          selection.addRange(range)
          document.execCommand('Copy')
          this.$message({type: 'success', message: '复制成功'})
        })
      },
      ajaxQueryYmtoraccno () {
        let param = {
          trdAcctType: this.$route.params.trdAcctType,
          trdDate: this.$route.params.tradedate,
          accOrYmtNo: this.$route.params.accOrYmtNo
        }
        queryYmtoraccno(param).then((res) => {
          for (var k of res) {
            switch (k.instrumenttype) {
              case '全部':
                this.transactionSummary[2].collectionAuction = k.trdamt_je
                break
              case '非上证50':
                this.transactionSummary[1].collectionAuction = k.trdamt_je
                break
              case '上证50':
                this.transactionSummary[0].collectionAuction = k.trdamt_je
                break
            }
          }
          for (let i = 0; i < this.transactionSummary.length; i++) {
            this.transactionSummary[i].total = (parseFloat(this.transactionSummary[i].collectionAuction) + parseFloat(this.transactionSummary[i].sj0930_0959) + parseFloat(this.transactionSummary[i].sj1000_1029) + parseFloat(this.transactionSummary[i].sj1030_1059) + parseFloat(this.transactionSummary[i].sj1100_1130) + parseFloat(this.transactionSummary[i].sj1300_1329) + parseFloat(this.transactionSummary[i].sj1330_1359) + parseFloat(this.transactionSummary[i].sj1400_1429) + parseFloat(this.transactionSummary[i].sj1430_1500)).toFixed(2)
          }
          this.companyBasicInfo()
        })
      },
      companyBasicInfo () {
        let param = JSON.parse(this.$route.params.accDetail)
        let str = `截至${new Date().getHours()}点${new Date().getMinutes()}分以下账户盘中${this.showCopyTrdDirection}居前,达${this.gfnElColFormatDecThouWan(null, null, this.transactionSummary[2].total)}万元，成交对市场影响较大，建议电话提醒。</br>`
        str += `${param.acctno ? param.acctno : ''}   ${param.acctname ? param.acctname : ''}   ${param.brnname ? param.brnname : ''}   ${param.acctymtno ? param.acctymtno : ''} </br>`
        this.copyData = str
      },
      ajaxTrdDetailChart () {
        let param = {
          trdAcctType: this.$route.params.trdAcctType,
          trdDate: this.$route.params.tradedate,
          trdTimStart: this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000',
          trdTimEnd: this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000',
          accOrYmtNo: this.$route.params.accOrYmtNo
        }
        trdDetailChartHalfHour(param)
        .then((res) => {
          let arr = res
          this.tradingList = arr
          for (let obj of arr) {
            if (obj.tim_begin == '0930') {
              this.transactionSummary[0].sj0930_0959 = (obj.trdamt_b_sz50 - Math.abs(obj.trdamt_s_sz50)).toFixed(2)
              this.transactionSummary[1].sj0930_0959 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj0930_0959 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim_begin == '1000') {
              this.transactionSummary[0].sj1000_1029 = (obj.trdamt_b_sz50 - Math.abs(obj.trdamt_s_sz50)).toFixed(2)
              this.transactionSummary[1].sj1000_1029 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1000_1029 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim_begin == '1030') {
              this.transactionSummary[0].sj1030_1059 = (obj.trdamt_b_sz50 - Math.abs(obj.trdamt_s_sz50)).toFixed(2)
              this.transactionSummary[1].sj1030_1059 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1030_1059 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim_begin == '1100') {
              this.transactionSummary[0].sj1100_1130 = (obj.trdamt_b_sz50 - Math.abs(obj.trdamt_s_sz50)).toFixed(2)
              this.transactionSummary[1].sj1100_1130 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1100_1130 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim_begin == '1300') {
              this.transactionSummary[0].sj1300_1329 = (obj.trdamt_b_sz50 - Math.abs(obj.trdamt_s_sz50)).toFixed(2)
              this.transactionSummary[1].sj1300_1329 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1300_1329 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim_begin == '1330') {
              this.transactionSummary[0].sj1330_1359 = (obj.trdamt_b_sz50 - Math.abs(obj.trdamt_s_sz50)).toFixed(2)
              this.transactionSummary[1].sj1330_1359 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1330_1359 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim_begin == '1400') {
              this.transactionSummary[0].sj1400_1429 = (obj.trdamt_b_sz50 - Math.abs(obj.trdamt_s_sz50)).toFixed(2)
              this.transactionSummary[1].sj1400_1429 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1400_1429 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim_begin == '1430') {
              this.transactionSummary[0].sj1430_1500 = (obj.trdamt_b_sz50 - Math.abs(obj.trdamt_s_sz50)).toFixed(2)
              this.transactionSummary[1].sj1430_1500 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1430_1500 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            }
          }
        })
        .then(() => {
          this.ajaxQueryYmtoraccno()
        })
      },
      AjaxGetCompanyTradeDetailMinute () {
        let param = {
          trdAcctType: this.$route.params.trdAcctType,
          trdDate: this.$route.params.tradedate,
          trdTimStart: this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000',
          trdTimEnd: this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000',
          accOrYmtNo: this.$route.params.accOrYmtNo
        }
        trdDetailChart(param).then((res) => {
          this.detailMinute = res
        })
      },
      ajaxQueryDaya () {
        let param = {
          trdDate: this.$route.params.tradedate,
          trdTimStart: this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000',
          trdTimEnd: this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000',
          invacctno: this.$route.params.accOrYmtNo
        }
        queryDaya(param).then((res) => {
          let {daya, latai} = res
          for (let key of daya) {
            let index = this.companyAccountData.findIndex((item) => {
              return item.isin_code == key.isincod
            })
            if (index != -1) {
              this.$set(this.companyAccountData[index], 'maxrange', key.maxrange)
              this.$set(this.companyAccountData[index], 'sale_per', key.sale_per)
              this.$set(this.companyAccountData[index], 'sale_amt', key.sale_amt)
              this.$set(this.companyAccountData[index], 'dy_min_max', `${key.minpricetim}~${key.maxpricetim}`)
            }
          }
          for (let key of latai) {
            let index = this.companyAccountData.findIndex((item) => {
              return item.isin_code == key.isincod
            })
            if (index != -1) {
              this.$set(this.companyAccountData[index], 'lt_maxrange', key.lt_maxrange)
              this.$set(this.companyAccountData[index], 'lt_sale_per', key.lt_sale_per)
              this.$set(this.companyAccountData[index], 'lt_sale_amt', key.lt_sale_amt)
              this.$set(this.companyAccountData[index], 'lt_min_max', `${key.lt_minpricetim}~${key.lt_maxpricetim}`)
            }
          }
        })
      },
      ajaxListJqueryGrid () {
        let param = {
          actorType: this.$route.params.trdAcctType,
          tradeDate: this.$route.params.tradedate,
          tradeStartTime: this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000',
          tradeEndTime: this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000',
          ymtOrAccountCode: this.$route.params.accOrYmtNo
        }
        listJqueryGrid(param).then((res) => {
          this.companyAccountData = res
        }).then(() => {
          this.ajaxQueryDaya()
        })
      },
      toNewOpen (url, name, height = 800, width = 1200) {
        window.open(url, `account_new_open_detail_${name}`, `height=${height}, width=${width}, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
      },
      toDetail (row) {
        //   this.toNewOpen(`#/securitiesDetail/${row.isin_code}/${this.$route.params.tradedate}/${row.code}/${this.timePicker.join(":")}`, row.isin_code)
      },
      getAccountDealTable (startTime, endTime) {
        let params = {
          tradeDate: this.$route.params.tradedate,
          startTime: startTime,
          endTime: endTime,
          actorType: this.$route.params.trdAcctType,
          ymtOrAcctNo: this.$route.params.accOrYmtNo
        }
        let routerParams = JSON.parse(this.$route.params.accDetail)
        let isCxh = ''
        if (!routerParams.character.length) {
          isCxh = '否'
        } else {
          routerParams.character.forEach((el) => {
            if (el == '1') {
              isCxh = '是'
            } else {
              isCxh = '否'
            }
          })
        }
        accountDealTable(params).then(resp => {
          this.tableData = [
            {name: '一分钟最大卖出金额', value: (resp.max_mktval / 10000).toFixed(2) + '万元'},
            {name: '期间一分钟最大卖出金额', value: (resp.time_max_mktval / 10000).toFixed(2) + '万元'},
            {name: '期间净卖出金额', value: (resp.time_net_amount / 10000).toFixed(2) + '万元'},
            {name: '全天净卖出金额', value: (resp.net_amount / 10000).toFixed(2) + '万元'},
            {name: '是否程序化特征账户', value: isCxh},
            {name: '是否存在打压行为', value: resp.isDaYa}
          ]
        })
      }
    },
    //   发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
      this.init()
    }

  }
</script>
<style lang="less" scoped>
    .accountDetailTable {
        .title {
            font-size: 20px;
            color: #fff;
            padding: 15px;
        }
    }
</style>
