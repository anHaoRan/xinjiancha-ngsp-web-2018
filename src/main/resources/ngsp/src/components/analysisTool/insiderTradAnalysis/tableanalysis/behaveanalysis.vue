<template>
    <div>
        <el-card class="line">
            <div slot="header" class="clearfix">
                买卖股票金额趋势图
            </div>
            <div>
                <el-select @change="drawAll" v-model="dimension" placeholder="" size="small"
                           style="position:relative;top:-36px;left:160px">
                    <el-option
                            v-for="item in isdimension"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="business-line-content">
                <div v-if="brushSelectedArea"
                     v-loading="brushSelectedLoading"
                     element-loading-spinner="el-icon-loading"
                     element-loading-text="框选汇总数据加载中，请耐心等待..."
                     element-loading-background="rgba(0,0,0,0.3)"
                     style="text-align: center;padding-bottom: 15px;padding-top: 15px;height: 16px">
                    {{showRes}}
                </div>
                <div id="businessline" class="businesspie"></div>
                <div style="margin-top: 100px;" class="radio-group">
                    <div>品种范围：</div>
                    <el-radio-group v-model="stockType" @change='drawpic'>
                        <el-radio label="ALL">所有品种</el-radio>
                        <el-radio label="Z01">大盘股</el-radio>
                        <el-radio label="Z02">中盘股</el-radio>
                        <el-radio label="Z03">小盘股</el-radio>
                        <el-radio label="Z04">ST股</el-radio>
                    </el-radio-group>
                </div>
            </div>
        </el-card>
        <el-card class="line" v-show="stocktrendpicflag" style="padding-bottom: 10px;">
            <div slot="header" class="clearfix">日内申报及股价走势图</div>
            <el-col v-loading="dayOrderStockPriceLoading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="数据加载中，请耐心等待..."
                    element-loading-background="rgba(0,0,0,0.3)">
                <div id="stock" class="businesspie"></div>
            </el-col>
        </el-card>
        <el-card>
            <el-table
                    style="margin-top:10px;"
                    :data="behaveanalysisTable"
                    :fit=true
                    border
                    v-loading="behaveAnalysisTableLoad"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="数据加载中，请耐心等待..."
                    element-loading-background="rgba(0,0,0,0.3)">
                <el-table-column
                        label="账户代码"
                        prop="acct_id"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="acct_name"
                        label="账户名称"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="ccrc_acct_id"
                        label="一码通账户"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="sec_code"
                        label="证券代码"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="sec_name"
                        label="证券名称"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="trade_date"
                        label="交易日期"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="trdvol_b"
                        label="买成交量"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="trdvol_s"
                        label="卖成交量"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="trdamt_b"
                        label="买成交额"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="trdamt_s"
                        label="卖成交额"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="trdprc_b"
                        label="买入均价"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="trdprc_s"
                        label="卖出均价"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-col :span="24" style="margin-top:10px">
                <el-pagination
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 50,100]"
                        :page-size="pagenum"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalpage"
                        @current-change="currentpagination"
                        @size-change="sizepagination">
                </el-pagination>
            </el-col>
        </el-card>
    </div>
</template>
<script>
  import echarts from 'echarts'
  import moment from 'moment'
  import {
    drawCodeTrend,
    drawStockTrend,
    getallinfo,
    gettable,
    gettitleinfo
  } from '../../../../service/analysisTool/insiderTradAccountAnalysis/accountlist/index.js'
  import MinxinVue from './Mixin'

  export default {
    mixins: [MinxinVue],
    props: ['analysisName'],
    data () {
      return {
        dimension: 'ccrc',
        isdimension: [{
          value: 'ccrc',
          label: '一码通维度'
        }, {
          value: 'ac',
          label: '单账户维度'
        }],
        behaveanalysisTable: [],
        // taskID: 'lh001',
        // secCode: '600581',
        // checkEndDate: '2016-01-22',
        stockType: 'ALL',
        // ccrcAcctID: '',
        // acctCodes: '',
        data: [],
        trdamt_b_mb: [],
        trdamt_b_qt: [],
        trdamt_s_mb: [],
        trdamt_s_qt: [],
        close_price: [],
        orderDate: '2016-01-22',
        stocktrendpicflag: false,
        ordprc: [],
        trdprc: [],
        ordamt_s: [],
        ordamt_b: [],
        data1: [],
        // checkStartDate: '',
        begintime: '',
        finalltime: '',
        from_date: '',
        to_date: '',
        per_trade: '',
        per_hold: '',
        currentPage: 1,
        pagenum: 10,
        totalpage: 0,
        brushSelectedArea: false, // 框选
        brushSelectedLoading: false, // 框选加载
        showRes: '', // 框选数据
        BSAmountData: [],
        dayOrderStockPriceLoading: false,
        BSAmountChartData: {
          tradDate: [],
          closePrice: [],
          targetStockAmountBuy: [],
          targetStockAmountSell: [],
          otherStockAmountBuy: [],
          otherStockAmountSell: []
        },
        BSAmountChartOption: {},
        dayOrderStockPriceData: [],
        dayOrderStockPriceChartData: {
          orderTime: [],
          orderPrice: [],
          detailPrice: [],
          orderBuyAmount: [],
          orderSellAmoutn: []
        },
        dayOrderStockPriceChartOption: {},
        behaveAnalysisTableLoad:false
      }
    },
    created () {
    },
    methods: {
      currentpagination (val) {
        this.currentPage = val
        this.dispalytable()
      },
      sizepagination (val) {
        this.pagenum = val
        this.currentPage = 1
        this.dispalytable()
      },
      drawAll () {
        this.getBSAmount()
      },
      drawpic () {
        this.brushSelectedLoading = true
        this.getBSAmount()
      },
      // 账户的逐日成交汇总数据
      dispalytable () {
        this.behaveAnalysisTableLoad = true
        this.behaveanalysisTable = []
        let params = {
          'taskID': this.taskID,
          'trendType': this.dimension,
          'secCode': this.secCode,
          'acctCode': this.acctCodes,
          'ccrcAcctID': this.ccrcAcctID,
          'checkStartDate': this.checkStartDate,
          'checkEndDate': moment(this.checkEndDate, 'YYYYMMDD').format('YYYY-MM-DD'),
          'pageIdx': this.currentPage,
          'pageRw': this.pagenum
        }
        gettable(params).then((resp) => {
          this.behaveanalysisTable = resp.accountStatistc
          for (let item of this.behaveanalysisTable) {
            item.trdamt_b = this.gfnFormatDecimal(item.trdamt_b, 3)
            item.trdamt_s = this.gfnFormatDecimal(item.trdamt_s, 3)
            item.trdprc_b = this.gfnFormatDecimal(item.trdprc_b, 3)
            item.trdprc_s = this.gfnFormatDecimal(item.trdprc_s, 3)
          }
          this.totalpage = Number(resp.pageTotal)
          this.behaveAnalysisTableLoad = false
          let requestPassCount = this.$store.state.insiderTradAnalysis.requestPassCount + 1
          this.$store.commit('changeDemensionRequestCount', requestPassCount)
        })
      },
      // 买卖股票金额趋势图
      getBSAmount () {
        this.BSAmountData=[]
        let params = {
          'taskID': this.taskID,
          'trendType': this.dimension,
          'secCode': this.secCode,
          'checkEndDate': this.checkEndDate,
          'acctCode': this.acctCodes,
          'ccrcAcctID': this.ccrcAcctID,
          'stockType': this.stockType
        }
        drawCodeTrend(params).then((resp) => {
          this.BSAmountData = resp.stockTrend
          this.drawBSAmountChart()
          this.stocktrendpicflag = false
          this.brushSelectedLoading = false
          let requestPassCount = this.$store.state.insiderTradAnalysis.requestPassCount + 1
          this.$store.commit('changeDemensionRequestCount', requestPassCount)
        })
      },
      splitBSAmountData () {
        this.BSAmountChartData = {
          tradDate: [],
          closePrice: [],
          targetStockAmountBuy: [],
          targetStockAmountSell: [],
          otherStockAmountBuy: [],
          otherStockAmountSell: []
        }
        let {tradDate, closePrice, targetStockAmountBuy, targetStockAmountSell, otherStockAmountBuy, otherStockAmountSell} = this.BSAmountChartData
        this.BSAmountData.forEach(item => {
          tradDate.push(item.trade_date)
          closePrice.push(item.close_price)
          targetStockAmountBuy.push(item.trdamt_b_mb)
          targetStockAmountSell.push(`-${item.trdamt_s_mb}`)
          otherStockAmountBuy.push(item.trdamt_b_qt)
          otherStockAmountSell.push(`-${item.trdamt_s_qt}`)
        })
        this.BSAmountChartOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            backgroundColor: 'rgba(245,245,245,0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            }
            // ,
            // formatter:function (params) {
            //
            // }
          },
          legend: {
            data: ['目标股票买入金额', '目标股票卖出金额', '其他股票买入金额', '其他股票卖出金额', '股价'],
            bottom: '5%',
            left: 'center'
          },
          title: [
            {
              left: 'center',
              top: '5%',
              text: '买卖股票金额趋势图',
              textStyle: {
                color: '#fff'
              }
            }
          ],
          grid: [
            {
              top: '15%',
              left: '10%',
              right: '15%',
              height: '55%'
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: 0,
              start: 80,
              end: 100
            },
            {
              show: true,
              type: 'slider',
              xAxisIndex: 0,
              y: '80%',
              start: 50,
              end: 100,
              textStyle: {
                color: '#506798'
              },
              dataBackgroundColor: '#334164',
              dataBackground: {
                lineStyle: {color: '#aec0e6'},
                areaStyle: {color: '#334164'}
              },
              handleColor: '#a7b7cc',
              fillerColor: 'rgba(0,0,0,0.1)',
              borderColor: '#334164'
            }
          ],
          xAxis: [
            {
              scale: false,
              type: 'category',
              data: tradDate,
              boundaryGap: true,
              splitLine: {show: false},
              splitNumber: 10,
              axisPointer: {
                z: 100
              },
              axisLabel: {
                color: '#aec0e6'
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#455579'
                }
              }
            }
          ],
          yAxis: [
            {
              scale: false,
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#aec0e6'
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#273757'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              }
            },
            {
              scale: false,
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#aec0e6'
              },
              position: 'right',
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#273757'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              }
            }
          ],
          series: [
            {
              name: '目标股票买入金额',
              type: 'bar',
              data: targetStockAmountBuy,
              symbol: 'none',
              stack: 'one',
              itemStyle: {
                color: '#cf4f6d',
                normal: {
                  color: '#cf4f6d'
                }
              }
            },
            {
              name: '目标股票卖出金额',
              type: 'bar',
              data: targetStockAmountSell,
              symbol: 'none',
              stack: 'one',
              itemStyle: {
                color: '#9077e2',
                normal: {
                  color: '#9077e2'
                }
              }
            },
            {
              name: '其他股票买入金额',
              type: 'bar',
              data: otherStockAmountBuy,
              symbol: 'none',
              stack: 'one',
              itemStyle: {
                color: '#c3ac41',
                normal: {
                  color: '#c3ac41'
                }
              }
            },
            {
              name: '其他股票卖出金额',
              type: 'bar',
              data: otherStockAmountSell,
              symbol: 'none',
              stack: 'one',
              itemStyle: {
                color: '#46a4b2',
                normal: {
                  color: '#46a4b2'
                }
              }
            },
            {
              name: '股价',
              type: 'line',
              yAxisIndex: 1,
              data: closePrice,
              symbol: 'circle', // 图形默认小圆圈去除
              smooth: true,
              itemStyle: {
                color: '#c36941',
                normal: {
                  color: '#c36941'
                }
              }
            }
          ],
          toolbox: {
            right: '8%',
            feature: {
              brush: {
                type: ['lineX', 'clear']
              },
              saveAsImage: {}
            }
          },
          brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            throttleType: 'debounce',
            throttleDelay: 1000,
            removeOnClick: true,
            brushMode: 'single',
            transformable: false,
            brushStyle: {
              color: 'rgba(255,25,255,0)',
              borderColor: '#ff402b'
            },
            outOfBrush: {
              colorAlpha: 0.1
            }
          }
        }
      },
      drawBSAmountChart () {
        this.splitBSAmountData()
        let BSAmountChart = echarts.init(document.getElementById('businessline'), this.gfnGetTheme())
        BSAmountChart.clear()
        window.onresize = BSAmountChart.resize
        BSAmountChart.setOption(this.BSAmountChartOption, true)
        BSAmountChart.on('dblclick', (params) => {
          if (params.seriesName==='目标股票卖出金额'||params.seriesName==='目标股票买入金额') {
            this.stocktrendpicflag = true
            this.orderDate = params.name
            this.getDayOrderStockPriceData()
          }else{
            this.$message.warning('请选择目标股票买卖柱状图')
          }
        })
        BSAmountChart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'single'
          }
        })
        BSAmountChart.on('brushSelected', (params) => {
          console.log(params)
          let timeData = params.batch[0].areas[0]
          if (timeData) {
            let range = timeData.coordRange
            this.begintime = this.BSAmountChartData.tradDate[range[0]]
            this.finalltime = this.BSAmountChartData.tradDate[range[1]]
            let params = {
              'taskID': this.taskID,
              'trendType': this.dimension,
              'secCode': this.secCode,
              'acctCode': this.acctCodes,
              'ccrcAcctID': this.ccrcAcctID,
              'checkStartDate': this.begintime,
              'checkEndDate': this.finalltime
            }
            this.brushSelectedArea = true
            this.brushSelectedLoading = true
            gettitleinfo(params).then((resp) => {
              this.from_date = resp.stockProportion.from_date
              this.to_date = resp.stockProportion.to_date
              this.per_trade = resp.stockProportion.per_trade
              if (this.per_trade == null) {
                this.per_trade = '0'
              }
              this.per_hold = resp.stockProportion.per_hold
              if (this.per_hold == null) {
                this.per_hold = '0'
              }
              this.brushSelectedLoading = false
              this.showRes = `开始日期：${this.from_date} 结束日期： ${this.to_date} 账户： ${this.acctCodes} 买入金额占比：${this.per_trade}% 期末持仓占比： ${this.per_hold}%`
            })
          }
        })
      },
      // 获取日内申报股价走势图接口数据
      getDayOrderStockPriceData () {
        let params = {
          'trendType': this.dimension,
          'secCode': this.secCode,
          'orderDate': this.orderDate,
          'ccrcAcctID': this.ccrcAcctID,
          'acctCode': this.acctCodes
        }
        // let params = {
        //   'trendType':'ccrc',
        //   'secCode': '600581',
        //   'orderDate': '2016-01-22',
        //   'ccrcAcctID': '130060919254',
        //   'acctCode': 'B597407175'
        // }
        this.dayOrderStockPriceLoading = true
        drawStockTrend(params).then((resp) => {
          this.dayOrderStockPriceData = resp.queryStockDay
          // this.dayOrderStockPriceData = [{"order_time":"100617","ordamt_s":"0.00000","trdprc":"9.78000","ordamt_b":"4503690.00000","ordprc":"9.78"},{"order_time":"101749","ordamt_s":"0.00000","trdprc":"9.78000","ordamt_b":"4597578.00000","ordprc":"9.78"},{"order_time":"102126","ordamt_s":"0.00000","trdprc":"9.95000","ordamt_b":"3785975.00000","ordprc":"9.95"},{"order_time":"102911","ordamt_s":"0.00000","trdprc":"10.05000","ordamt_b":"2140650.00000","ordprc":"10.05"},{"order_time":"103116","ordamt_s":"0.00000","trdprc":"10.18000","ordamt_b":"278460.00000","ordprc":"10.20"},{"order_time":"103306","ordamt_s":"0.00000","trdprc":"10.04000","ordamt_b":"1007.00000","ordprc":"10.07"}]
          this.drawOrderStockPriceChart()
          this.dayOrderStockPriceLoading = false
        })
      },
      splitDayOrderStockPriceData () {
        this.dayOrderStockPriceChartData = {
          orderTime: [],
          orderPrice: [],
          detailPrice: [],
          orderBuyAmount: [],
          orderSellAmoutn: []
        }
        let {orderTime, orderPrice, detailPrice, orderBuyAmount, orderSellAmoutn} = this.dayOrderStockPriceChartData
        this.dayOrderStockPriceData.forEach(item => {
          orderTime.push(moment(item.order_time, 'HHmmss').format('HH:mm:ss'))
          orderPrice.push(this.gfnFormatDecimal(item.ordprc, 2))
          detailPrice.push(this.gfnFormatDecimal(item.trdprc, 2))
          orderBuyAmount.push(this.gfnFormatDecimal(item.ordamt_b, 2))
          orderSellAmoutn.push(`-${this.gfnFormatDecimal(item.ordamt_s, 2)}`)
        })
        console.log(this.dayOrderStockPriceChartData)
        this.dayOrderStockPriceChartOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            backgroundColor: 'rgba(245,245,245,0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            }
          },
          legend: {
            data: ['股价', '申报价格', '申报买入金额', '申报卖出金额'],
            bottom: '5%',
            left: 'center'
          },
          title: [
            {
              left: 'center',
              top: '5%',
              text: '日内申报及股价走势图',
              textStyle: {
                color: '#fff'
              }
            }
          ],
          grid: [
            {
              top: '15%',
              left: '15%',
              right: '15%',
              height: '55%'
            }
          ],
          toolbox: {
            right: '8%',
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: [
            {
              scale: false,
              type: 'category',
              data: orderTime,
              boundaryGap: true,
              splitLine: {show: false},
              splitNumber: 10,
              axisPointer: {
                z: 100
              },
              axisLabel: {
                color: '#aec0e6'
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#455579'
                }
              }
            }
          ],
          yAxis: [
            {
              scale: true,
              type:'value',
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#aec0e6'
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#273757'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              }
            },
            {
              scale: true,
              type:'value',
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#aec0e6'
              },
              position: 'right',
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#273757'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              }
            }
          ],
          series: [
            {
              name: '申报买入金额',
              type: 'bar',
              data: orderBuyAmount,
              symbol: 'none',
              stack: 'one',
              itemStyle: {
                color: '#ff402b',
                normal: {
                  color: '#ff402b'
                }
              }
            },
            {
              name: '申报卖出金额',
              type: 'bar',
              data: orderSellAmoutn,
              symbol: 'none',
              stack: 'one',
              itemStyle: {
                color: '#12bba5',
                normal: {
                  color: '#12bba5'
                }
              }
            },
            {
              name: '申报价格',
              type: 'scatter',
              yAxisIndex: 1,
              data: orderPrice,
              itemStyle: {
                normal: {
                  borderColor: null,
                  borderColor0: null
                }
              }
            },
            {
              name: '股价',
              type: 'line',
              yAxisIndex: 1,
              data: detailPrice,
              symbolSize: 3,
              symbol: 'emptyCircle',
              smooth: true,
              lineStyle: {
                normal: {opacity: 0.5}
              }
            }
          ]
        }
      },
      drawOrderStockPriceChart () {
        this.splitDayOrderStockPriceData()
        let dayOrderStockPriceChart = echarts.init(document.getElementById('stock'), this.gfnGetTheme())
        window.onresize = dayOrderStockPriceChart.resize
        dayOrderStockPriceChart.setOption(this.dayOrderStockPriceChartOption, true)
      }
    },
    beforeDestory(){
      // this.echart.off('dblclick')
      // this.echart.off('brushselected')
    }
  }
</script>
<style lang="less">
    .businesspie {
        width: 1600px;
        height: 350px
    }

    .business-line-content {
        position: relative;
        .radio-group {
            position: absolute;
            right: 100px;
            top: 0;
            .el-radio {
                margin-left: 0;
                margin-top: 5px;
                display: block;
            }
        }
    }

</style>
