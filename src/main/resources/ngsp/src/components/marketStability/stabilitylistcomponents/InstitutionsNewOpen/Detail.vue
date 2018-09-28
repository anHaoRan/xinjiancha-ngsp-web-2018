<template>
    <div class="institutions">
        <div style="display: flex;justify-content: space-between">
            <trading-amount ref="trading" style="width: 70%;"></trading-amount>
            <div class="marketDetailTable" style="height: 350px;width: 27%;">
                <div class="title">机构交易情况表</div>
                <el-table
                        :data="tableData"
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
                <span>账户汇总</span>
                <span style="float: right">* 注：金额均以万元为单位</span>
            </div>
            <el-table
                    border
                    :data="companyAccountData"
                    max-height="600"
                    tooltip-effect="dark"
                    :cell-class-name="fnCellClassName"
                    style="width: 100%; overflow:visible">
                <el-table-column
                        type="index">
                </el-table-column>
                <el-table-column
                        align="left"
                        header-align="center"
                        show-overflow-tooltip
                        prop="investor_account_id"
                        sortable
                        label="账户代码"
                        min-width="7%">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="toDetail(scope.row)">
                            {{scope.row.investor_account_id}}
                        </el-button>
                    </template>
                </el-table-column>
                <s-table-columns v-for="(item,index) in STABILITY_LIST_INSTITUTIONS_DETAIL"
                                 :key="index"
                                 :item="item"
                                 v-if="item.isActive===undefined||item.isActive"/>
            </el-table>
        </el-card>
    </div>
</template>
<script>
  // 请求接口引入
  import {
    getCompanyTradeInfo,
    getCompanyTradeDetail,
    getCompanyAccountInfo,
    getCompanyBasicInfo,
    getCompanyTradeDetailMinute,
    companyDealTable
  } from '@/service/marketStability'

  //  成交量
  import TradingAmount from '../component/TradingAmount.vue'
  import { securityStyle } from '@/utils/constants'

  window.document.title = '交易情况'
  export default {
    // 组件注册CNSH06000283
    components: {
      STableColumns: () => import('@/components/base/STableColumns'), //  表格列
      TradingAmount
    },
    data () {
      return {
        STABILITY_LIST_INSTITUTIONS_DETAIL: [
          {
            field: 'investor_account_name',
            label: '账户名称',
            width: '10%',
            align: 'left',
            sortable: true
          },
          {
            field: 'comp_code',
            label: '公司代码',
            width: '10%',
            align: 'left',
            sortable: true
          },
          {
            field: 'comp_name',
            label: '公司名称',
            width: '10%',
            align: 'left',
            sortable: true
          },
          {
            field: 'compseq',
            label: '公司排名',
            width: '5%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'compseq')
          },
          {
            field: 'trdamt_b',
            label: '买入金额',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b')
          },
          {
            field: 'trdamt_s',
            label: '卖出金额',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s')
          },
          {
            field: 'je',
            label: '净额',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThouWan,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'je')
          }
        ],
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
            align: 'right'
          }, {
            field: 'sj0930_0959',
            label: '9:30~9:59',
            width: '8%',
            align: 'right'
          }, {
            field: 'sj1000_1029',
            label: '10:00~10:29',
            width: '8%',
            align: 'right'
          }, {
            field: 'sj1030_1059',
            label: '10:30~10:59',
            width: '8%',
            align: 'right'
          }, {
            field: 'sj1100_1130',
            label: '11:00~11:30',
            width: '8%',
            align: 'right'
          }, {
            field: 'sj1300_1329',
            label: '13:00~13:29',
            width: '8%',
            align: 'right'
          }, {
            field: 'sj1330_1359',
            label: '13:30~13:59',
            width: '8%',
            align: 'right'
          }, {
            field: 'sj1400_1429',
            label: '14:00~14:29',
            width: '8%',
            align: 'right'
          }, {
            field: 'sj1430_1500',
            label: '14:30~15:00',
            width: '8%',
            align: 'right'
          }, {
            field: 'total',
            label: '合计',
            width: '8%',
            align: 'right'
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
        detailMinute: '',
        tableColumns: [
          {label: '', field: 'name', align: 'center', minWidth: '5%'},
          {label: '', field: 'value', align: 'center', minWidth: '5%'}
        ],
        tableData: [
          {name: '最新', value: ''},
          {name: '本周合计', value: ''},
          {name: '本月合计', value: ''},
          {name: '本年合计', value: ''},
          {name: '近3月', value: ''},
          {name: '近6月', value: ''},
          {name: '开通以来', value: ''}
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
        if (column.property === 'je') {
          if (row[column.property] < 0) {
            return securityStyle.down
          } else if (row[column.property] > 0) {
            return securityStyle.up
          }
        }
        return ''
      },
      init () {
        if (this.$route.params.trdDirection == 'asc') {
          this.showCopyTrdDirection = '净卖出'
        } else {
          this.showCopyTrdDirection = '净买入'
        }
        this.companyTradeDetail()
        this.companyAccountInfo()
        this.AjaxGetCompanyTradeDetailMinute()
        this.getCompanyAccountTable()
      },
      select () {
        this.init()
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
      companyTradeInfo () {
        let param = {
          orgFlg: this.$route.params.orgflg,
          tradeDate: this.$route.params.tradedate,
          companyCode: this.$route.params.companycode,
          type: this.$route.params.codeType,
          value: this.$route.params.code
        }
        getCompanyTradeInfo(param).then((res) => {
          this.transactionSummary[0].collectionAuction = res.bizData.metaData[0].je_sz50
          this.transactionSummary[1].collectionAuction = res.bizData.metaData[0].je_fsz50
          this.transactionSummary[2].collectionAuction = res.bizData.metaData[0].je
          for (let i = 0; i < this.transactionSummary.length; i++) {
            this.transactionSummary[i].total = (parseFloat(this.transactionSummary[i].collectionAuction) + parseFloat(this.transactionSummary[i].sj0930_0959) + parseFloat(this.transactionSummary[i].sj1000_1029) + parseFloat(this.transactionSummary[i].sj1030_1059) + parseFloat(this.transactionSummary[i].sj1100_1130) + parseFloat(this.transactionSummary[i].sj1300_1329) + parseFloat(this.transactionSummary[i].sj1330_1359) + parseFloat(this.transactionSummary[i].sj1400_1429) + parseFloat(this.transactionSummary[i].sj1430_1500)).toFixed(2)
          }
          this.companyBasicInfo()
        })
      },
      companyBasicInfo () {
        let param = {
          orgFlg: this.$route.params.orgflg,
          tradeDate: this.$route.params.tradedate,
          startTime: this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000',
          endTime: this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000',
          companyCode: this.$route.params.companycode,
          type: this.$route.params.codeType,
          value: this.$route.params.code
        }
        getCompanyBasicInfo(param).then((res) => {
          let str = `截至${new Date().getHours()}点${new Date().getMinutes()}分以下账户盘中${this.showCopyTrdDirection}居前,达${this.transactionSummary[2].total}万元，成交对市场影响较大，建议电话提醒。</br>`
          let arr = res.bizData.metaData
          for (var i = 0; i < arr.length; i++) {
            str += `${arr[i].investor_account_id ? arr[i].investor_account_id : ''}   ${arr[i].investor_account_name ? arr[i].investor_account_name : ''}   ${arr[i].branch_name ? arr[i].branch_name : ''} </br>`
          }
          this.copyData = str
        })
      },
      companyTradeDetail () {
        let param = {
          orgFlg: this.$route.params.orgflg,
          tradeDate: this.$route.params.tradedate,
          startTime: this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000',
          endTime: this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000',
          companyCode: this.$route.params.companycode,
          type: this.$route.params.codeType,
          value: this.$route.params.code
        }
        getCompanyTradeDetail(param).then((res) => {
          let arr = res.bizData.metaData
          this.tradingList = arr
          for (let obj of arr) {
            if (obj.tim == '0930') {
              this.transactionSummary[0].sj0930_0959 = (obj.trdamt_b_50 - Math.abs(obj.trdamt_s_50)).toFixed(2)
              this.transactionSummary[1].sj0930_0959 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj0930_0959 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim == '1000') {
              this.transactionSummary[0].sj1000_1029 = (obj.trdamt_b_50 - Math.abs(obj.trdamt_s_50)).toFixed(2)
              this.transactionSummary[1].sj1000_1029 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1000_1029 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim == '1030') {
              this.transactionSummary[0].sj1030_1059 = (obj.trdamt_b_50 - Math.abs(obj.trdamt_s_50)).toFixed(2)
              this.transactionSummary[1].sj1030_1059 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1030_1059 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim == '1100') {
              this.transactionSummary[0].sj1100_1130 = (obj.trdamt_b_50 - Math.abs(obj.trdamt_s_50)).toFixed(2)
              this.transactionSummary[1].sj1100_1130 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1100_1130 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim == '1130') {
              this.transactionSummary[0].sj1300_1329 = (obj.trdamt_b_50 - Math.abs(obj.trdamt_s_50)).toFixed(2)
              this.transactionSummary[1].sj1300_1329 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1300_1329 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim == '1330') {
              this.transactionSummary[0].sj1330_1359 = (obj.trdamt_b_50 - Math.abs(obj.trdamt_s_50)).toFixed(2)
              this.transactionSummary[1].sj1330_1359 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1330_1359 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim == '1400') {
              this.transactionSummary[0].sj1400_1429 = (obj.trdamt_b_50 - Math.abs(obj.trdamt_s_50)).toFixed(2)
              this.transactionSummary[1].sj1400_1429 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1400_1429 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            } else if (obj.tim == '1430') {
              this.transactionSummary[0].sj1430_1500 = (obj.trdamt_b_50 - Math.abs(obj.trdamt_s_50)).toFixed(2)
              this.transactionSummary[1].sj1430_1500 = (obj.trdamt_b_fsz50 - Math.abs(obj.trdamt_s_fsz50)).toFixed(2)
              this.transactionSummary[2].sj1430_1500 = (obj.trdamt_b - Math.abs(obj.trdamt_s)).toFixed(2)
            }
          }
        }).then(() => {
          this.companyTradeInfo()
        })
      },
      AjaxGetCompanyTradeDetailMinute () {
        let param = {
          orgFlg: this.$route.params.orgflg,
          tradeDate: this.$route.params.tradedate,
          startTime: this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000',
          endTime: this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000',
          companyCode: this.$route.params.companycode,
          type: this.$route.params.codeType,
          value: this.$route.params.code
        }
        getCompanyTradeDetailMinute(param).then((res) => {
          for (let key of res.bizData.metaData) {
            key.trdamt_s_sz50 = key.trdamt_s_50
            key.trdamt_b_sz50 = key.trdamt_b_50
          }
          this.detailMinute = res.bizData.metaData
        })
      },
      companyAccountInfo () {
        let param = {
          orgFlg: this.$route.params.orgflg,
          tradeDate: this.$route.params.tradedate,
          startTime: this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000',
          endTime: this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000',
          companySeq: this.$route.params.companyseq,
          companyCode: this.$route.params.companycode,
          type: this.$route.params.codeType,
          value: this.$route.params.code
        }
        getCompanyAccountInfo(param).then((res) => {
          this.companyAccountData = res.bizData.metaData
        })
      },
      toNewOpen (url, name, height = 800, width = 1200) {
        window.open(url, `institutions_new_open_detail_${name}`, `height=${height}, width=${width}, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
      },
      toDetail (row) {
        let param = {
          acctno: row.investor_account_id,
          acctname: row.investor_account_name,
          brnname: row.brnname,
          acctymtno: row.ymtno ? row.ymtno : '',
          character: []
        }
        let startTime = this.timePicker ? this.timePicker[0].replace(/:/g, '') : '090000'
        let endTime = this.timePicker ? this.timePicker[1].replace(/:/g, '') : '170000'
        this.toNewOpen(`#/accountDetail/${row.investor_account_id}/${this.$route.params.tradedate}/zh/${this.$route.params.trdDirection == 'asc' ? 'jmc' : 'jmr'}/${startTime}/${endTime}/${JSON.stringify(param)}`)
      },
      getCompanyAccountTable () {
        let params = {
          type: this.$route.params.codeType,
          value: this.$route.params.code,
          companyCode: this.$route.params.companycode,
          orgFlg: this.$route.params.orgflg,
          toDay: this.$route.params.tradedate
        }
        let companyName = this.$route.params.compname
        let tradeDate = this.$route.params.tradedate
        this.tableColumns = [
          {label: companyName, field: 'name', align: 'center', minWidth: '5%'},
          {label: '截止日期至' + tradeDate, field: 'value', align: 'center', minWidth: '5%'}
        ]
        // companyDealTable(params).then(resp => {
        //   this.tableData = [
        //     {name: '最新', value: (resp.todayData / 10000).toFixed(2) + '万元'},
        //     {name: '本周合计', value: (resp.weekData / 10000).toFixed(2) + '万元'},
        //     {name: '本月合计', value: (resp.monthData / 10000).toFixed(2) + '万元'},
        //     {name: '本年合计', value: (resp.yearData / 10000).toFixed(2) + '万元'},
        //     {name: '近3月', value: (resp.threeMonthData / 10000).toFixed(2) + '万元'},
        //     {name: '近6月', value: (resp.sixMonthData / 10000).toFixed(2) + '万元'}
        //   ]
        // })
      }
    },
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
      this.init()
    }

  }
</script>
<style lang="less" scoped>
    .marketDetailTable {
        .title {
            font-size: 20px;
            color: #fff;
            padding: 15px;
        }
    }
</style>
