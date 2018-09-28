<template>
  <div class='accountCount'>
    <el-card class='el-card-table'>
      <div slot='header' class='clearfix'>
        账户
        <i :class='className' @click='toggleClass' style='font-size: 24px' v-show='activeName === "first"'
           v-if="isShow"></i>
        <el-button type='info' size='mini' @click='exportForm' style='padding: 6.5px 14px' v-if="isShow">导出</el-button>
      </div>
      <el-tabs v-model='activeName' type='card' @tab-click='handleClick'>
        <el-tab-pane label='成交统计' name='first'>
          <div v-if="isShow">
            <div v-show='changeChart'>
              <el-table
                v-if='activeName === "first"'
                :data='accountDealCount'
                border
                tooltip-effect='dark'
                size='small'
                max-height="480"
                :cell-class-name='this.tableColumnClassName'
                highlight-current-row
                @current-change='handleCurrentChange'
                style='width: 100%'>
                <el-table-column
                  align='center'
                  label=''
                  type='index'
                  width='50'>
                </el-table-column>
                <el-table-column
                  v-for='column in accountDealColumns'
                  :key=column.field
                  :align=column.align
                  header-align="center"
                  :prop=column.field
                  :formatter=column.formatter
                  :label=column.label
                  :sortable=column.sortable
                  :sort-method='column.sortMethod'
                  :min-width=column.minWidth>
                </el-table-column>
              </el-table>
              <div class='block'>
                <el-pagination
                  @size-change='accountDealSizeChange'
                  @current-change='accountDealCurrentChange'
                  :current-page='accountDealCurrentPage'
                  :page-sizes='[10,20,50,100,200,400]'
                  :page-size='10'
                  layout='total,sizes,prev,pager,next,jumper'
                  :total='accountDealPageTotal'
                >
                </el-pagination>
              </div>
            </div>
            <div v-show='!changeChart'>
              <div class='chartsWrap'>
                <div class='headtitle'>
                  买入金额
                </div>
                <el-row>
                  <el-col :span='6'>
                    <div id='accTotalBuyPie' style='height: 350px;width: 410px;'></div>
                  </el-col>
                  <el-col :span='6'>
                    <div id='accBuyPie' style='height: 350px;width: 410px;'></div>
                  </el-col>
                  <el-col :span='12' ref='lineWidth'>
                    <div id='accBuyLine' style='height: 350px;width: 820px;'></div>
                  </el-col>
                </el-row>
              </div>
              <div class='chartsWrap'>
                <div class='headtitle'>
                  卖出金额
                </div>
                <el-row>
                  <el-col :span='6'>
                    <div id='accTotalSalePie' style='height: 350px;width: 410px;'></div>
                  </el-col>
                  <el-col :span='6'>
                    <div id='accSalePie' style='height: 350px;width: 410px;'></div>
                  </el-col>
                  <el-col :span='12'>
                    <div id='accSaleLine' style='height: 350px;width: 820px;'></div>
                  </el-col>
                </el-row>
              </div>
              <div class='chartsWrap'>
                <div class='headtitle'>
                  主动成交金额
                </div>
                <el-row>
                  <el-col :span='6'>
                    <div id='accTotalDealPie' style='height: 350px;width: 410px;'></div>
                  </el-col>
                  <el-col :span='6'>
                    <div id='accDealPie' style='height: 350px;width: 410px;'></div>
                  </el-col>
                  <el-col :span='12'>
                    <div id='accDealLine' style='height: 350px;width: 820px;'></div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label='申报统计' name='second'>
          <div v-if="isShow">
            <el-table
              v-if='activeName === "second"'
              :data='accountDeclareCount'
              border
              max-height="480"
              tooltip-effect='dark'
              size='small'
              :cell-class-name='this.tableColumnClassName'
              highlight-current-row
              @current-change='handleCurrentChange'
              style='width: 100%'>
              <el-table-column
                align='center'
                label=''
                type='index'
                width='50'>
              </el-table-column>
              <el-table-column
                v-for='column in accountDeclareColumns'
                :key=column.field
                :align=column.align
                header-align="center"
                :prop=column.field
                :formatter=column.formatter
                :label=column.label
                :sortable=column.sortable
                :sort-method='column.sortMethod'
                :min-width=column.minWidth>
              </el-table-column>
            </el-table>
            <div class='block'>
              <el-pagination
                @size-change='accountDeclareSizeChange'
                @current-change='accountDeclareCurrentChange'
                :current-page='accountDeclareCurrentPage'
                :page-sizes='[10,20,50,100,200,400]'
                :page-size='10'
                layout='total,sizes,prev,pager,next,jumper'
                :total='accountDeclarePageTotal'
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <double-per-dou-psw @isPass='isPass' @isShow='getShowDilog'
                        :dialogFormVisble='dialogFormVisble'></double-per-dou-psw>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import DoublePerDouPsw from '../../../common/DoublePerDouPsw'
  import moment from 'moment';
  import {
    postAccountDealTable,
    postAccountDeclareTable,
    postAccountDeclareProp,
    postAccountBuyLine,
    postAccountSaleLine,
    postAccountZdLine,
    postAccountPieLine
  } from '../../../../service/marketSupervise/index'

  export default {
    name: 'routinization-count',
    props: ['dealTime'],
    components: {
      DoublePerDouPsw
    },
    data() {
      return {
        dialogFormVisble: false,
        isShow: false,
        sign: true,
        activeName: '',
        className: 'fa fa-pie-chart',
        changeChart: true,
        accountDealCount: [],
        accountDeclareCount: [],
        accountDealColumns: [
          {label: '账户名称', field: 'invacctname', align: 'center', minWidth: '6.5%'},
          {label: '账户代码', field: 'invacctno', align: 'center', minWidth: '6.5%'},
          {label: '投资者类型', field: 'orgtype', align: 'center', minWidth: '7.5%'},
          {label: '程序化交易类别', field: 'algotype', align: 'center', minWidth: '8%'},
          {
            label: '买入股票个数',
            field: 'buyNum',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buyNum')
          },
          {
            label: '买入金额(万元)',
            field: 'buy',
            align: 'right',
            minWidth: '6.5%',
            sortable: true,
            formatter: this.gfnElColFormatDecThou3,
            sortMethod: this.gfnSortColByNumber.bind(this, 'buy')
          },
          {
            label: '买入金额占比(%)',
            field: 'bPropValue',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'bPropValue')
          },
          {
            label: '卖出股票个数',
            field: 'sellNum',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sellNum')
          },
          {
            label: '卖出金额(万元)',
            field: 'sell',
            align: 'right',
            minWidth: '6.5%',
            sortable: true,
            formatter: this.gfnElColFormatDecThou3,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sell')
          },
          {
            label: '卖出金额占比(%)',
            field: 'sPropValue',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sPropValue')
          },
          {
            label: '净买入金额(万元)',
            field: 'netBuy',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            formatter: this.gfnElColFormatDecThou3,
            sortMethod: this.gfnSortColByNumber.bind(this, 'netBuy')
          },
          {
            label: '主动买入金额(万元)',
            field: 'vbuy',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            formatter: this.gfnElColFormatDecThou3,
            sortMethod: this.gfnSortColByNumber.bind(this, 'vbuy')
          },
          {
            label: '主动卖出金额(万元)',
            field: 'vsell',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            formatter: this.gfnElColFormatDecThou3,
            sortMethod: this.gfnSortColByNumber.bind(this, 'vsell')
          }
        ],
        accountDeclareColumns: [
          {label: '账户名称', field: 'investor_account_name', align: 'center', minWidth: '5%'},
          {label: '账户代码', field: 'invacctno', align: 'center', minWidth: '5%'},
          {label: '投资者类型', field: 'orgtype_name', align: 'center', minWidth: '6.5%'},
          {label: '程序化交易类别', field: 'acctype_name', align: 'center', minWidth: '7.5%'},
          {
            label: '申报买入股票个数',
            field: 'b_stock',
            align: 'right',
            minWidth: '9%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_stock')
          },
          {
            label: '申报买入笔数',
            field: 'b_num',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_num')
          },
          {
            label: '申报买入金额(万元)',
            field: 'b_odval',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            formatter: this.gfnElColFormatDecThou3,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_odval')
          },
          {
            label: '申报买入金额占比(%)',
            field: 'b_prop',
            align: 'right',
            minWidth: '9%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_prop')
          },
          {
            label: '申报卖出股票个数',
            field: 's_stock',
            align: 'right',
            minWidth: '9%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_stock')
          },
          {
            label: '申报卖出笔数',
            field: 's_num',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_num')
          },
          {
            label: '申报卖出金额(万元)',
            field: 's_odval',
            align: 'right',
            minWidth: '8%',
            sortable: true,
            formatter: this.gfnElColFormatDecThou3,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_odval')
          },
          {
            label: '申报卖出金额占比(%)',
            field: 's_prop',
            align: 'right',
            minWidth: '9%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_prop')
          },
          {
            label: '委撤比(%)',
            field: 'dw_prop',
            align: 'right',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'dw_prop')
          }
        ],
        accountDealCurrentPage: 1,
        accountDealPageTotal: 0,
        accountDeclareCurrentPage: 1,
        accountDeclarePageTotal: 0,
        trdDate: '',
        startTime: '',
        endTime: '',
        dealPageNo: '',
        dealRowNum: '10',
        declarePageNo: '',
        declareRowNum: '10'
      }
    },
    mounted() {
      setTimeout(() => {
        this.getAccountTable()
        this.getDeclareTable()
        // this.getLineData()
        // this.getPieData()
      }, 50)
    },
    watch: {
      dealTime: {
        handler: function (param1, param2) {
          this.getAccountTable()
          this.getLineData()
          this.getPieData()
          this.getDeclareTable()
        },
        deep: true
      }
    },
    methods: {
      isPass(val) {
        this.sign = !val
        this.isShow = val
        this.getLineData()
        this.getPieData()
      },
      getShowDilog(val) {
        this.dialogFormVisble = val
      },
      toggleClass() {
        if (this.className == 'fa fa-table') {
          this.className = 'fa fa-pie-chart'
          this.changeChart = !this.changeChart
        } else {
          this.className = 'fa fa-table'
          this.changeChart = !this.changeChart
        }
      },
      // 列颜色定义
      tableColumnClassName({row, column}) {
        if (column.label == '买入金额占比(%)' || column.label == '卖出金额占比(%)' || column.label == '申报买入金额占比(%)' || column.label == '申报卖出金额占比(%)' || column.label == '委撤比') {
          return 'orange'
        }
        return ''
      },
      // 账户成交统计
      accountDealSizeChange(val) {
        this.dealRowNum = val
        this.getAccountTable()
      },
      accountDealCurrentChange(val) {
        this.dealPageNo = val
        this.getAccountTable()
      },
      // 账户申报统计
      accountDeclareSizeChange(val) {
        this.declareRowNum = val
        this.getDeclareTable()
      },
      accountDeclareCurrentChange(val) {
        this.declarePageNo = val
        this.getDeclareTable()
      },
      handleClick(tab) {
        if (this.sign) {
          this.dialogFormVisble = true
          this.isShow = false
        }
        if (tab.name == 'first') {
          this.getAccountTable()
          this.getLineData()
          this.getPieData()
        } else {
          this.getDeclareTable()
        }
      },
      handleCurrentChange(val) {

      },
      // 导出图表
      exportForm() {
        if (!this.dealTime.beginTime) {
          this.dealTime.beginTime = ''
          this.dealTime.endTime = ''
        } else {
          this.dealTime.beginTime = this.dealTime.beginTime.split(':').join('')
          this.dealTime.endTime = this.dealTime.endTime.split(':').join('')
        }
        if (!this.dealTime.date) {
          this.dealTime.date = ''
        } else {
          this.dealTime.date = this.dealTime.date.split('-').join('')
        }
        if (this.activeName == 'first') {
          window.open('/ngsp/fluct/algo-tade/v1/export-account-trade-stat?trdDate=' + this.dealTime.date + '&startTime=' + this.dealTime.beginTime + '&endTime=' + this.dealTime.endTime)
        } else {
          window.open('/ngsp/fluct/algo-tade/v1/export-account-order-stat?trdDate=' + this.dealTime.date + '&startTime=' + this.dealTime.beginTime + '&endTime=' + this.dealTime.endTime)
        }
      },
      // 获取账户成交统计表格数据
      getAccountTable() {
        if (!this.dealTime.beginTime) {
          this.dealTime.beginTime = ''
          this.dealTime.endTime = ''
        } else {
          this.dealTime.beginTime = this.dealTime.beginTime.split(':').join('')
          this.dealTime.endTime = this.dealTime.endTime.split(':').join('')
        }
        if (!this.dealTime.date) {
          this.dealTime.date = ''
        } else {
          this.dealTime.date = this.dealTime.date.split('-').join('')
        }
        let params = {
          trdDate: this.dealTime.date,
          startTime: this.dealTime.beginTime,
          endTime: this.dealTime.endTime,
          pageNo: this.dealPageNo,
          rowNum: this.dealRowNum
        }
        postAccountDealTable(params)
          .then((resp) => {
            if (!resp.data) {
              this.accountDealCount = []
              this.accountDealPageTotal = 0
            } else {
              this.accountDealCount = resp.data
              this.accountDealPageTotal = Number(resp.totalRows)
            }
          })
      },
      // 获取账户申报统计表格数据
      getDeclareTable() {
        if (!this.dealTime.beginTime) {
          this.dealTime.beginTime = ''
          this.dealTime.endTime = ''
        } else {
          this.dealTime.beginTime = this.dealTime.beginTime.split(':').join('')
          this.dealTime.endTime = this.dealTime.endTime.split(':').join('')
        }
        if (!this.dealTime.date) {
          this.dealTime.date = ''
        } else {
          this.dealTime.date = this.dealTime.date.split('-').join('')
        }
        let params = {
          trdDate: this.dealTime.date,
          startTime: this.dealTime.beginTime,
          endTime: this.dealTime.endTime,
          pageNo: this.declarePageNo,
          rowNum: this.declareRowNum
        }
        postAccountDeclareTable(params)
          .then((resp) => {
            if (!resp.data) {
              this.accountDeclareCount = []
              this.accountDeclarePageTotal = 0
            } else {
              resp.data.forEach((el) => {
                el.b_prop = ''
                el.s_prop = ''
              })
              this.accountDeclareCount = resp.data
              this.accountDeclarePageTotal = Number(resp.totalRows)
            }
          }).then(() => {
          postAccountDeclareProp(params)
            .then((resp) => {
              if (resp.data) {
                resp.data.forEach((el) => {
                  this.accountDeclareCount.forEach((res, index) => {
                    if (res.invacctno == el.invacctno) {
                      this.$set(this.accountDeclareCount[index], 'b_prop', el.b_prop)
                      this.$set(this.accountDeclareCount[index], 's_prop', el.s_prop)
                    }
                  })
                })
              }
            })
        })
      },
      // 获取折线入数据
      getLineData() {
        if (!this.dealTime.date) {
          this.dealTime.date = ''
        } else {
          this.dealTime.date = this.dealTime.date.split('-').join('')
        }
        // 买入金额
        let params = {
          trdDate: this.dealTime.date
        }
        let brush = [moment(this.dealTime.beginTime, 'HHmm').format('HH:mm'), moment(this.dealTime.endTime, 'HHmm').format('HH:mm')]
        postAccountBuyLine(params)
          .then((resp) => {
            let res = resp
            let timeList = []
            let legend = []
            let dataLine = []
            if (this.isShow) {
              if (!res.data) {
                let data = {data1: legend, time: timeList, data2: dataLine}
                this.drawLineChart('accBuyLine', data, brush, '')
              } else {
                res.data.forEach((el) => {
                  legend.push(el.name)
                  let lineArr = []
                  el.lineData.forEach((v) => {
                    lineArr.push(v.accum_prop)
                  })
                  dataLine.push({name: el.name, type: 'line', data: lineArr})
                })
                res.data[0].lineData.forEach((el) => {
                  timeList.push(moment(el.tim, 'Hmm').format('HH:mm'))
                })
                let data = {data1: legend, time: timeList, data2: dataLine}
                let buySaveName = '买入-当日走势图'
                this.drawLineChart('accBuyLine', data, brush, buySaveName)
              }
            }
          })
        // 卖出金额
        postAccountSaleLine(params)
          .then((resp) => {
            let res = resp
            let timeList = []
            let legend = []
            let dataLine = []
            if (this.isShow) {
              if (!res.data) {
                let data = {data1: legend, time: timeList, data2: dataLine}
                this.drawLineChart('accSaleLine', data, brush, '')
              } else {
                res.data.forEach((el) => {
                  legend.push(el.name)
                  let lineArr = []
                  el.lineData.forEach((v) => {
                    lineArr.push(v.accum_prop)
                  })
                  dataLine.push({name: el.name, type: 'line', data: lineArr})
                })
                res.data[0].lineData.forEach((el) => {
                  timeList.push(moment(el.tim, 'Hmm').format('HH:mm'))
                })
                let data = {data1: legend, time: timeList, data2: dataLine}
                let buySaveName = '卖出-当日走势图'
                this.drawLineChart('accSaleLine', data, brush, buySaveName)
              }
            }
          })
        // 主动交易
        postAccountZdLine(params)
          .then((resp) => {
            let res = resp
            let timeList = []
            let legend = []
            let dataLine = []
            if (this.isShow) {
              if (!res.data) {
                let data = {data1: legend, time: timeList, data2: dataLine}
                this.drawLineChart('accDealLine', data, brush, '')
              } else {
                res.data.forEach((el) => {
                  legend.push(el.name)
                  let lineArr = []
                  el.lineData.forEach((v) => {
                    lineArr.push(v.accum_prop)
                  })
                  dataLine.push({name: el.name, type: 'line', data: lineArr})
                })
                res.data[0].lineData.forEach((el) => {
                  timeList.push(moment(el.tim, 'Hmm').format('HH:mm'))
                })
                let data = {data1: legend, time: timeList, data2: dataLine}
                let buySaveName = '主动成交-当日走势图'
                this.drawLineChart('accDealLine', data, brush, buySaveName)
              }
            }
          })
      },
      // 获取饼图数据
      getPieData() {
        if (!this.dealTime.beginTime) {
          this.dealTime.beginTime = ''
          this.dealTime.endTime = ''
        } else {
          this.dealTime.beginTime = this.dealTime.beginTime.split(':').join('')
          this.dealTime.endTime = this.dealTime.endTime.split(':').join('')
        }
        if (!this.dealTime.date) {
          this.dealTime.date = ''
        } else {
          this.dealTime.date = this.dealTime.date.split('-').join('')
        }
        let params = {
          trdDate: this.dealTime.date,
          startTime: this.dealTime.beginTime,
          endTime: this.dealTime.endTime
        }
        postAccountPieLine(params)
          .then((resp) => {
            let res = resp
            if (this.isShow) {
              // 买入金额市场占比
              if (JSON.stringify(res.top_buy) == '{}') {
                this.drawPieChart('accTotalBuyPie', [], '')
                this.drawPieChart('accBuyPie', [], '')
              } else {
                let buymkt = res.top_buy.buymkt
                let buyCount = res.top_buy.algoacc_sum
                let buymktList = {
                  total: buymkt.algobuy / 100000000 + buymkt.other_prop / 100000000,
                  category: '市场占比(亿元)',
                  subText: '(程序化交易账号数量：' + buyCount + ')',
                  data1: [{icon: 'circle', name: '程序化交易'}, {icon: 'circle', name: '其它'}],
                  data2: [
                    {name: '程序化交易', value: (buymkt.algobuy / 100000000)},
                    {name: '其它', value: (buymkt.other_prop / 100000000)}
                  ]
                }
                let buySaveName = '买入-市场占比'
                this.drawPieChart('accTotalBuyPie', buymktList, buySaveName)
                // 买入金额top5占比
                let buyTop = res.top_buy.buyalgo
                let buyCategory = []
                let buyTopData = []
                let buyTotal = (buyTop.other_al_prop / 100000000)
                buyTop.top_5.forEach((el) => {
                  buyCategory.push({icon: 'circle', name: el.accname})
                  buyTopData.push({name: el.accname, value: (el.buy / 100000000)})
                  buyTotal += (el.buy / 100000000)
                })
                buyCategory.push({icon: 'circle', name: '其它'})
                buyTopData.push({name: '其它', value: (buyTop.other_al_prop / 100000000)})
                let buyTopList = {
                  total: buyTotal,
                  category: '程序化交易账户总成交金额占比(亿元)',
                  data1: buyCategory,
                  data2: buyTopData
                }
                let buyTopSaveName = '买入-程序化交易账户总成交金额占比'
                this.drawPieChart('accBuyPie', buyTopList, buyTopSaveName)
              }
              // 卖出金额市场占比
              if (JSON.stringify(res.top_sell) == '{}') {
                this.drawPieChart('accTotalSalePie', [], '')
                this.drawPieChart('accSalePie', [], '')
              } else {
                let salemkt = res.top_sell.sellmkt
                let saleCount = res.top_sell.algoacc_sum
                let salemktList = {
                  total: salemkt.algosell / 100000000 + salemkt.other_prop / 100000000,
                  category: '市场占比(亿元)',
                  subText: '(程序化交易账号数量：' + saleCount + ')',
                  data1: [{icon: 'circle', name: '程序化交易'}, {icon: 'circle', name: '其它'}],
                  data2: [
                    {name: '程序化交易', value: (salemkt.algosell / 100000000)},
                    {name: '其它', value: (salemkt.other_prop / 100000000)}
                  ]
                }
                let saleSaveName = '卖出-市场占比'
                this.drawPieChart('accTotalSalePie', salemktList, saleSaveName)
                // 卖出金额top5占比
                let saleTop = res.top_sell.sellalgo
                let saleCategory = []
                let saleTopData = []
                let saleTotal = saleTop.other_al_prop / 100000000
                saleTop.top_5.forEach((el) => {
                  saleCategory.push({icon: 'circle', name: el.accname})
                  saleTopData.push({name: el.accname, value: (el.sell / 100000000)})
                  saleTotal += el.sell / 100000000
                })
                saleCategory.push({icon: 'circle', name: '其它'})
                saleTopData.push({name: '其它', value: (saleTop.other_al_prop / 100000000)})
                let saleTopList = {
                  total: saleTotal,
                  category: '程序化交易账户总成交金额占比(亿元)',
                  data1: saleCategory,
                  data2: saleTopData
                }
                let saleTopSaveName = '卖出-程序化交易账户总成交金额占比'
                this.drawPieChart('accSalePie', saleTopList, saleTopSaveName)
              }
              // 主动成交金额市场占比
              if (JSON.stringify(res.top_vo) == '{}') {
                this.drawPieChart('accTotalDealPie', [], '')
                this.drawPieChart('accDealPie', [], '')
              } else {
                let vomkt = res.top_vo.vomkt
                let vomktCount = res.top_vo.algoacc_sum
                let vomktList = {
                  total: vomkt.algovo / 100000000 + vomkt.other_prop / 100000000,
                  category: '市场占比(亿元)',
                  subText: '(程序化交易账号数量：' + vomktCount + ')',
                  data1: [{icon: 'circle', name: '程序化交易'}, {icon: 'circle', name: '其它'}],
                  data2: [
                    {name: '程序化交易', value: (vomkt.algovo / 100000000)},
                    {name: '其它', value: (vomkt.other_prop / 100000000)}
                  ]
                }
                let vomktSaveName = '主动成交-市场占比'
                this.drawPieChart('accTotalDealPie', vomktList, vomktSaveName)
                // 主动成交金额top5占比
                let voTop = res.top_vo.voalgo
                let voCategory = []
                let voTopData = []
                let voTotal = voTop.other_al_prop / 100000000
                voTop.top_5.forEach((el) => {
                  voCategory.push({icon: 'circle', name: el.accname})
                  voTopData.push({name: el.accname, value: el.turnover / 100000000})
                  voTotal += el.turnover / 100000000
                })
                voCategory.push({icon: 'circle', name: '其它'})
                voTopData.push({name: '其它', value: (voTop.other_al_prop / 100000000)})
                let voTopList = {
                  total: voTotal,
                  category: '程序化交易账户总成交金额占比(亿元)',
                  data1: voCategory,
                  data2: voTopData
                }
                let vomktTopSaveName = '主动成交-程序化交易账户总成交金额占比'
                this.drawPieChart('accDealPie', voTopList, vomktTopSaveName)
              }
            }
          })
      },
      drawLineChart(id, dataList, brushData, saveName) {
        let myCharts = echarts.init(document.getElementById(id), this.gfnGetTheme());
        myCharts.setOption({
          title: {
            text: '成交统计-当日累计占比走势图',
            top: 10,
            left: 10,
            textStyle: {
              fontSize: 14,
              fontWeight: 400
            }
          },
          toolbox: {
            right: '5%',
            y: '2',
            feature: {
              dataZoom: {
                show: false
              },
              brush: {
                show: false
              },
              saveAsImage: {
                name: saveName
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (val) {
              let texts = val[0].name + '<br/>'
              val.forEach((el) => {
                texts += el.marker + el.seriesName + ' : ' + el.value + '% <br/>'
              })
              return texts
            }
          },
          brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            throttleType: 'debounce',
            throttleDelay: '300',
            removeOnClick: true,
            brushStyle: {
              color: 'rgba(255,25,255,0)',
              borderColor: '#455577'
            },
            outOfBrush: {
              color: '#ddd',
              colorAlpha: 0.8
            }
          },
          legend: {
            inactiveColor: '#263657',
            left: 'center',
            y: 30,
            data: dataList.data1,
            textStyle: {
              color: '#506798'
            }
          },
          xAxis: [
            {
              type: 'category',
              data: dataList.time,
              axisLabel: {
                color: '#506798',
                interval: 29
              },
              axisLine: {
                lineStyle: {
                  color: '#263657'
                }
              }
            }
          ],
          grid: [
            {
              top: 70
            }
          ],
          yAxis: [
            {
              nameTextStyle: {
                color: '#506798'
              },
              type: 'value',
              boundaryGap: false,
              axisLabel: {
                color: '#506798',
                formatter: function (value, index) {
                  if (!value) {
                    return value;
                  } else {
                    return value + '%';
                  }
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#273757'
                }
              }
            }
          ],
          series: dataList.data2
        })
        myCharts.dispatchAction({
          type: 'brush',
          areas: [
            {
              brushType: 'lineX',
              coordRange: brushData,
              xAxisIndex: 0
            }
          ]
        })
      },
      drawPieChart(id, pieList, saveName) {
        let businesspie = echarts.init(document.getElementById(id), this.gfnGetTheme());
        businesspie.clear()
        window.onresize = businesspie.resize;
        businesspie.setOption({
          title: {
            text: pieList.category,
            subtext: pieList.subText,
            left: 10,
            top: 10,
            textStyle: {
              fontSize: 14,
              fontWeight: 400
            }
          },
          legend: {
            orient: 'vertical',
            left: 10,
            top: 'middle',
            data: pieList.data1,
            textStyle: {
              color: '#798fb8'
            },
            formatter: function (name) {
              let prop = 0
              let count = 0
              pieList.data2.forEach((parms, index) => {
                if (parms.name == name) {
                  count = (pieList.data2[index].value)
                  prop = (pieList.data2[index].value / pieList.total * 100).toFixed(3) + '%'
                }
              })
              return prop + '\n\n' + name + '(' + count.toFixed(3) + ')'
            }
          },
          toolbox: {
            right: '6%',
            feature: {
              saveAsImage: {
                name: saveName
              }
            }
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [{
            name: pieList.category,
            type: 'pie',
            radius: ['38%', '50%'],
            center: ['70%', '50%'],
            selectedOffset: 10,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  formatter: '{d}%',
                  position: 'outer'
                }
              }
            },
            data: pieList.data2
          }]
        })
      }
    }
  }
</script>

<style lang='less'>
  .accountCount {
    .el-card {
      .el-tabs--card {
        position: relative;
        > .el-tabs__header {
          position: absolute;
          left: 3%;
          top: -70px;
        }
        > .el-tabs__content {
          margin-top: 15px;
        }
      }
    }
  }

  .accountCount .clearfix {
    position: relative;
    i {
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 100px
    }
  }

  .accountCount .headtitle {
    padding-left: 10px;
    height: 35px;
    font-size: 16px;
    line-height: 35px;
    color: #fff
  }

  .accountCount .block {
    padding: 10px;
    .el-pagination {
      text-align: center;
    }
  }

  .accountCount .chartsWrap {
    border-bottom: 1px solid #000;
    .el-col-6 {
      border-right: 1px solid #263657;
    }
  }

  .accountCount .orange {
    > div {
      color: orange;
    }
  }
</style>
