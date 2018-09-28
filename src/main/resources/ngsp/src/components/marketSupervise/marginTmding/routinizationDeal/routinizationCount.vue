<template>
  <div class='routinizationCount'>
    <el-card class='el-card-table'>
      <div slot='header' class='clearfix'>
        程序化交易分类
        <i :class='className' @click='toggleClass' style='font-size: 24px' v-show='activeName === "first"'></i>
        <el-button type='info' size='mini' @click='exportForm' style='padding: 6.5px 14px'>导出</el-button>
      </div>
      <el-tabs v-model='activeName' type='card' @tab-click='handleClick'>
        <el-tab-pane label='成交统计' name='first'>
          <div v-show='changeChart'>
            <el-table
              :data='dealCount'
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
                v-for='column in dealColumns'
                :key=column.field
                :align=column.align
                header-align="center"
                :prop=column.field
                :label=column.label
                :formatter=column.formatter
                :sortable=column.sortable
                :sort-method='column.sortMethod'
                :min-width=column.minWidth>
              </el-table-column>
            </el-table>
            <div class='block'>
              <el-pagination
                @size-change='dealSizeChange'
                @current-change='dealCurrentChange'
                :current-page='dealCurrentPage'
                :page-sizes='[10,20,50,100,200,400]'
                :page-size='10'
                layout='total,sizes,prev,pager,next,jumper'
                :total='dealPageTotal'
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
                  <div id='totalBuyPie' style='height: 350px;width: 400px;'></div>
                </el-col>
                <el-col :span='6'>
                  <div id='buyPie' style='height: 350px;width: 400px;'></div>
                </el-col>
                <el-col :span='12'>
                  <div id='buyLine' style='height: 350px;width: 800px;'></div>
                </el-col>
              </el-row>
            </div>
            <div class='chartsWrap'>
              <div class='headtitle'>
                卖出金额
              </div>
              <el-row>
                <el-col :span='6'>
                  <div id='totalSalePie' style='height: 350px;width: 400px;'></div>
                </el-col>
                <el-col :span='6'>
                  <div id='salePie' style='height: 350px;width: 400px;'></div>
                </el-col>
                <el-col :span='12'>
                  <div id='saleLine' style='height: 350px;width: 800px;'></div>
                </el-col>
              </el-row>
            </div>
            <div class='chartsWrap'>
              <div class='headtitle'>
                主动成交金额
              </div>
              <el-row>
                <el-col :span='6'>
                  <div id='totalDealPie' style='height: 350px;width: 400px;'></div>
                </el-col>
                <el-col :span='6'>
                  <div id='dealPie' style='height: 350px;width: 400px;'></div>
                </el-col>
                <el-col :span='12'>
                  <div id='dealLine' style='height: 350px;width: 800px;'></div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label='申报统计' name='second'>
          <el-table
            v-if='activeName === "second"'
            :data='declareCount'
            border
            tooltip-effect='dark'
            max-height="480"
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
              v-for='column in declareColumns'
              :key=column.field
              :align=column.align
              header-align="center"
              :prop=column.field
              :label=column.label
              :formatter=column.formatter
              :sortable=column.sortable
              :sort-method='column.sortMethod'
              :min-width=column.minWidth>
            </el-table-column>
          </el-table>
          <div class='block'>
            <el-pagination
              @size-change='declareSizeChange'
              @current-change='declareCurrentChange'
              :current-page='declareCurrentPage'
              :page-sizes='[10,20,50,100,200,400]'
              :page-size='10'
              layout='total,sizes,prev,pager,next,jumper'
              :total='declarePageTotal'
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import moment from 'moment';
  import {
    postRoutinizationDealTable,
    postRoutinizationDeclareTable,
    postRoutinizationDeclareProp,
    postClassifyPieData,
    postClassifyBuyData,
    postClassifySaleData,
    postClassifyVoluntData
  } from '../../../../service/marketSupervise/index'

  export default {
    name: 'routinization-count',
    props: {
      dealTime: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        activeName: 'first',
        dealCount: [],
        declareCount: [],
        className: 'fa fa-pie-chart',
        changeChart: true,
        dealColumns: [
          {label: '类别名称', field: 'algo_typename', align: 'center', minWidth: '7.5%'},
          {label: '账户数量', field: 'nm', align: 'right', minWidth: '7.5%'},
          {
            label: '买入金额(万元)',
            field: 'buy',
            align: 'right',
            minWidth: '7.5%',
            formatter: this.gfnElColFormatDecThou3
          },
          {label: '买入金额占比(%)', field: 'buy_prop', align: 'right', minWidth: '7.5%'},
          {
            label: '卖出金额(万元)',
            field: 'sell',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            formatter: this.gfnElColFormatDecThou3,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sell')
          },
          {
            label: '卖出金额占比(%)',
            field: 'sell_prop',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sell_prop')
          },
          {
            label: '净买入金额(万元)',
            field: 'net_buy',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            formatter: this.gfnElColFormatDecThou3,
            sortMethod: this.gfnSortColByNumber.bind(this, 'net_buy')
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
        declareColumns: [
          {label: '类别名称', field: 'algo_typename', align: 'center', minWidth: '7.5%'},
          {label: '账户数量', field: 'nm', align: 'right', minWidth: '7.5%'},
          {
            label: '申报买入笔数',
            field: 'b_num',
            align: 'right',
            minWidth: '7.5%'
          },
          {
            label: '申报买入金额(万元)',
            field: 'b_odval',
            align: 'right',
            minWidth: '7.5%',
            formatter: this.gfnElColFormatDecThou3
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
            label: '申报卖出笔数',
            field: 's_num',
            align: 'right',
            minWidth: '7.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_num')
          },
          {
            label: '申报卖出金额(万元)',
            field: 's_odval',
            align: 'right',
            minWidth: '7.5%',
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
        dealCurrentPage: 1,
        dealPageTotal: 0,
        declareCurrentPage: 1,
        declarePageTotal: 0,
        dealPageNo: '',
        dealRowNum: '10',
        declarePageNo: '',
        declareRowNum: '10'
      }
    },
    mounted() {
      this.getPieData()
      this.getLineData()
      this.getDealTable()
      this.getDeclareTable()
    },
    watch: {
      dealTime: {
        handler: function (param1, param2) {
          this.getDealTable()
          this.getPieData()
          this.getLineData()
          this.getDeclareTable()
        },
        deep: true
      }
    },
    methods: {
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
      // 成交统计
      dealSizeChange(val) {
        this.dealRowNum = val
        this.getDealTable()
      },
      dealCurrentChange(val) {
        this.dealPageNo = val
        this.getDealTable()
      },
      // 申报统计
      declareSizeChange(val) {
        this.declareRowNum = val
        this.getDeclareTable()
      },
      declareCurrentChange(val) {
        this.declarePageNo = val
        this.getDeclareTable()
      },
      handleClick(tab) {
        if (tab.name == 'first') {
          this.getDealTable()
          this.getPieData()
          this.getLineData()
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
          window.open('/ngsp/fluct/algo-tade/v1/export-algotype-trade-stat?trdDate=' + this.dealTime.date + '&startTime=' + this.dealTime.beginTime + '&endTime=' + this.dealTime.endTime)
        } else {
          window.open('/ngsp/fluct/algo-tade/v1/export-algotype-order-stat-prop?trdDate=' + this.dealTime.date + '&startTime=' + this.dealTime.beginTime + '&endTime=' + this.dealTime.endTime)
        }
      },
      drawLineChart(id, dataList, brushData, saveName) {
        let productline = echarts.init(document.getElementById(id), this.gfnGetTheme());
        productline.setOption({
          title: {
            text: '分类统计-当日累计占比走势图',
            top: 10,
            left: 10,
            textStyle: {
              fontSize: 14,
              fontWeight: 400
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
        productline.dispatchAction({
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
          toolbox: {
            right: '6%',
            feature: {
              saveAsImage: {
                name: saveName
              }
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            top: 'middle',
            data: pieList.data1,
            textStyle: {
              color: '#506798'
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
          series: [{
            name: pieList.category,
            type: 'pie',
            radius: ['38%', '50%'],
            center: ['70%', '50%'],
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
      },
      // 获取成交统计表格数据
      getDealTable() {
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
        postRoutinizationDealTable(params)
          .then((resp) => {
            if (!resp.data) {
              this.dealCount = []
              this.dealPageTotal = 0
            } else {
              this.dealCount = resp.data
              this.dealPageTotal = Number(resp.totalRows)
            }
          })
      },
      // 获取申报统计表格数据
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
        postRoutinizationDeclareTable(params)
          .then((resp) => {
            if (!resp.data) {
              this.declareCount = []
              this.declarePageTotal = 0
            } else {
              resp.data.forEach((el) => {
                el.b_prop = ''
                el.s_prop = ''
              })
              this.declareCount = resp.data
              this.declarePageTotal = Number(resp.totalRows)
            }
          }).then(() => {
          postRoutinizationDeclareProp(params)
            .then((resp) => {
              if (resp.data) {
                resp.data.forEach((el) => {
                  this.declareCount.forEach((res, index) => {
                    if (res.algotype == el.algotype) {
                      this.$set(this.declareCount[index], 'b_prop', el.b_prop)
                      this.$set(this.declareCount[index], 's_prop', el.s_prop)
                    }
                  })
                })
              }
            })
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
        // 买入金额
        let params = {
          trdDate: this.dealTime.date,
          startTime: this.dealTime.beginTime,
          endTime: this.dealTime.endTime
        }
        postClassifyPieData(params)
          .then((resp) => {
            let res = resp
            // 买入金额市场占比
            if (JSON.stringify(res.top_buy) == '{}') {
              this.drawPieChart('totalBuyPie', [], '')
              this.drawPieChart('buyPie', [], '')
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
              this.drawPieChart('totalBuyPie', buymktList, buySaveName)
              // 买入金额top5占比
              let buyTop = res.top_buy.buyalgo
              let buyCategory = []
              let buyTopData = []
              let buyTotal = (buyTop.other_al_prop / 100000000)
              buyTop.top_5.forEach((el) => {
                buyCategory.push({icon: 'circle', name: el.algoname})
                buyTopData.push({name: el.algoname, value: (el.buy / 100000000)})
                buyTotal += (el.buy / 100000000)
              })
              buyCategory.push({icon: 'circle', name: '其它'})
              buyTopData.push({name: '其它', value: (buyTop.other_al_prop / 100000000)})
              let buyTopList = {
                total: buyTotal,
                category: '程序化交易账户分类成交金额占比(亿元)',
                data1: buyCategory,
                data2: buyTopData
              }
              let buyTopSaveName = '买入-程序化交易账户分类成交金额占比'
              this.drawPieChart('buyPie', buyTopList, buyTopSaveName)
            }
            // 卖出金额市场占比
            if (JSON.stringify(res.top_sell) == '{}') {
              this.drawPieChart('totalSalePie', [], '')
              this.drawPieChart('salePie', [], '')
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
              this.drawPieChart('totalSalePie', salemktList, saleSaveName)
              // 卖出金额top5占比
              let saleTop = res.top_sell.sellalgo
              let saleCategory = []
              let saleTopData = []
              let saleTotal = saleTop.other_al_prop / 100000000
              saleTop.top_5.forEach((el) => {
                saleCategory.push({icon: 'circle', name: el.algoname})
                saleTopData.push({name: el.algoname, value: (el.sell / 100000000)})
                saleTotal += el.sell / 100000000
              })
              saleCategory.push({icon: 'circle', name: '其它'})
              saleTopData.push({name: '其它', value: (saleTop.other_al_prop / 100000000)})
              let saleTopList = {
                total: saleTotal,
                category: '程序化交易账户分类成交金额占比(亿元)',
                data1: saleCategory,
                data2: saleTopData
              }
              let saleTopSaveName = '卖出-程序化交易账户分类成交金额占比'
              this.drawPieChart('salePie', saleTopList, saleTopSaveName)
            }
            // 主动成交金额市场占比
            if (JSON.stringify(res.top_vo) == '{}') {
              this.drawPieChart('totalDealPie', [], '')
              this.drawPieChart('dealPie', [], '')
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
              this.drawPieChart('totalDealPie', vomktList, vomktSaveName)
              // 主动成交金额top5占比
              let voTop = res.top_vo.voalgo
              let voCategory = []
              let voTopData = []
              let voTotal = voTop.other_al_prop / 100000000
              voTop.top_5.forEach((el) => {
                voCategory.push({icon: 'circle', name: el.algoname})
                voTopData.push({name: el.algoname, value: el.turnover / 100000000})
                voTotal += el.turnover / 100000000
              })
              voCategory.push({icon: 'circle', name: '其它'})
              voTopData.push({name: '其它', value: (voTop.other_al_prop / 100000000)})
              let voTopList = {
                total: voTotal,
                category: '程序化交易账户分类成交金额占比(亿元)',
                data1: voCategory,
                data2: voTopData
              }
              let vomktTopSaveName = '主动成交-程序化交易账户分类成交金额占比'
              this.drawPieChart('dealPie', voTopList, vomktTopSaveName)
            }
          })
      },
      // 获取折线图数据
      getLineData() {
        if (!this.dealTime.date) {
          this.dealTime.date = ''
        } else {
          this.dealTime.date = this.dealTime.date.split('-').join('')
        }
        let params = {
          trdDate: this.dealTime.date
        }
        let brush = [moment(this.dealTime.beginTime, 'HHmm').format('HH:mm'), moment(this.dealTime.endTime, 'HHmm').format('HH:mm')]
        // 买入金额
        postClassifyBuyData(params)
          .then((resp) => {
            let res = resp
            let timeList = []
            let legend = []
            let dataLine = []
            if (!res.data) {
              let data = {data1: legend, time: timeList, data2: dataLine}
              this.drawLineChart('buyLine', data, brush, '')
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
              this.drawLineChart('buyLine', data, brush, buySaveName)
            }
          })
        // 卖出金额
        postClassifySaleData(params)
          .then((resp) => {
            let res = resp
            let timeList = []
            let legend = []
            let dataLine = []
            if (!res.data) {
              let data = {data1: legend, time: timeList, data2: dataLine}
              this.drawLineChart('saleLine', data, brush, '')
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
              this.drawLineChart('saleLine', data, brush, buySaveName)
            }
          })
        // 主动成交金额
        postClassifyVoluntData(params)
          .then((resp) => {
            let res = resp
            let timeList = []
            let legend = []
            let dataLine = []
            if (!res.data) {
              let data = {data1: legend, time: timeList, data2: dataLine}
              this.drawLineChart('dealLine', data, brush, '')
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
              this.drawLineChart('dealLine', data, brush, buySaveName)
            }
          })
      }
    }
  }
</script>

<style lang='less'>
  .routinizationCount {
    .el-card {
      .el-tabs--card {
        position: relative;
        > .el-tabs__header {
          position: absolute;
          left: 8%;
          top: -70px;
        }
        > .el-tabs__content {
          margin-top: 15px;
        }
      }

    }
  }

  .routinizationCount .clearfix {
    position: relative;
    i {
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 100px
    }
  }

  .routinizationCount .headtitle {
    padding-left: 10px;
    height: 35px;
    font-size: 16px;
    line-height: 35px;
    color: #fff
  }

  .routinizationCount .block {
    padding: 10px;
    .el-pagination {
      text-align: center;
    }
  }

  .routinizationCount .headtitle {
    padding-left: 10px;
    height: 35px;
    font-size: 16px;
    line-height: 35px;
    color: #fff
  }

  .routinizationCount .chartsWrap {
    border-bottom: 1px solid #000;
    .el-col-6 {
      border-right: 1px solid #263657;
    }
  }

  .routinizationCount .orange {
    > div {
      color: orange;
    }
  }
</style>
