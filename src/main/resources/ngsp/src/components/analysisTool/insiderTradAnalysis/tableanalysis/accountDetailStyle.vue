<template>
  <div class="account-detail-style">
    <el-card>
      <div slot="header" class="clearfix">
        股票交易风格分析图
      </div>
      <el-select @change="handleChangeVeidoo" v-model="dimensionType" size="small">
        <el-option
          v-for="item in dimensionTypeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-radio-group v-model="selectStockCode" @change="handleChangeSelectCode">
        <el-radio
          v-for="item in stockGroup"
          :label="`${item.sec_code} ${item.sec_name}`"
          :key="item.sec_code"/>
      </el-radio-group>
      <div class="account-detail-style-charts">
        <div class="detail-price-chart"></div>
        <div class="marketval-detail-chart"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import moment from 'moment'
  import {
    drawTransationStyle,
    drawhabitanalysis
  } from '../../../../service/analysisTool/insiderTradAccountAnalysis/accountlist/index.js'
  import MinxinVue from './Mixin'

  export default {
    name: 'account-detail-style',
    mixins: [MinxinVue],
    props: [],
    components: {},
    data () {
      return {
        dimensionType: 'ccrc', // 维度类型
        dimensionTypeOption: [
          {
            value: 'ccrc',
            label: '一码通维度'
          }, {
            value: 'ac',
            label: '单账户维度'
          }
        ],
        selectStockCode: '',
        stockGroup: [],
        detailPriceRes: [], // 交易股价接口返回数据
        marketvalDetailRes: [], // 市值交易接口返回数据
        splitDetailPriceData: {},
        splitMarketvalDetailData: {},
        detailPriceChartData: {}, // 经过处理后的交易股价数据
        marketvalDetailChartData: {} // 经过处理后的市值交易数据
      }
    },
    computed: {},
    watch: {},
    methods: {
      resetData(){
        this.selectStockCode=''
        this.stockGroup=[]
        this.detailPriceRes=[]
        this.marketvalDetailRes=[]
        this.splitDetailPriceData={}
        this.splitMarketvalDetailData={}
        this.detailPriceChartData={}
        this.marketvalDetailChartData={}
      },
      getResData () {
        this.resetData()
        let params = {
          'trendType': this.dimensionType,
          'secCode': this.secCode,
          'checkEndDate': this.checkEndDate,
          'ccrcAcctID': this.ccrcAcctID,
          'acctCode': this.acctCodes
        }
        // let params = {
        //   'trendType': 'ccrc',
        //   'secCode': '600581',
        //   'checkEndDate': '2016-01-22',
        //   'ccrcAcctID': '130060919254',
        //   'acctCode': 'B597407175'
        // }
        drawTransationStyle(params).then(resp => {
          this.stockGroup = resp.stockRes
          if (this.stockGroup.length != 0) {
            this.stockGroup.forEach(item => {
              if (`${item.sec_code} ${item.sec_name}` === this.secCodeName) {
                item.sec_name += '(目标股票)'
              }
            })
          }
          this.selectStockCode =`${this.stockGroup[0].sec_code} ${this.stockGroup[0].sec_name}`
          this.detailPriceRes = resp.stkPricRes
        })
        drawhabitanalysis(params).then(resp => {
          this.marketvalDetailRes = resp.stkPricRes
        }).then(() => {
          this.handleChangeSelectCode(this.selectStockCode)
          let requestPassCount = this.$store.state.insiderTradAnalysis.requestPassCount + 1
          this.$store.commit('changeDemensionRequestCount', requestPassCount)
        })
      },
      splitData (code) {
        let that = this
        let detailPriceTradeBuy = [], detailPriceTradeSell = [], detailPriceDate = [], detailPriceClosePrice = []
        let marketvalDetailBuy = [], marketvalDetailSell = [], holdMarketVal = [], marketvalDetaildate = []
        this.detailPriceRes.forEach(item => {
          if (item.sec_code === code) {
            item.data.forEach((nape) => {
              detailPriceDate.push(nape.trade_date)
              detailPriceTradeBuy.push(nape.trdamt_b)
              detailPriceTradeSell.push(`-${nape.trdamt_s}`)
              detailPriceClosePrice.push(nape.close_price)
            })
          }
        })
        this.splitDetailPriceData = {
          detailPriceDate: detailPriceDate,
          detailPriceTradeBuy: detailPriceTradeBuy,
          detailPriceTradeSell: detailPriceTradeSell,
          detailPriceClosePrice: detailPriceClosePrice
        }
        this.marketvalDetailRes.forEach(item => {
          if (item.sec_code == code) {
            item.data.forEach((nape) => {
              marketvalDetaildate.push(nape.trade_date)
              marketvalDetailBuy.push(nape.trdamt_b)
              marketvalDetailSell.push(`-${nape.trdamt_s}`)
              holdMarketVal.push(nape.hold_amt)
            })
          }
        })
        this.splitMarketvalDetailData = {
          marketvalDetaildate: marketvalDetaildate,
          marketvalDetailBuy: marketvalDetailBuy,
          marketvalDetailSell: marketvalDetailSell,
          holdMarketVal: holdMarketVal
        }
        this.detailPriceChartData = {
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
            data: ['买入金额', '卖出金额', '股价'],
            bottom: '5%',
            left: 'center'
          },
          title: [
            {
              left: 'center',
              top: '5%',
              text: '交易+股价走势图',
              textStyle: {
                color: '#fff'
              }
            }
          ],
          grid: [
            {
              top: '16%',
              left: '15%',
              right: '15%',
              height: '60%'
            }
          ],
          xAxis: [
            {
              scale: false,
              type: 'category',
              data: that.splitDetailPriceData.detailPriceDate,
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
              name: '买入金额',
              type: 'bar',
              data: that.splitDetailPriceData.detailPriceTradeBuy,
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
              name: '卖出金额',
              type: 'bar',
              data: that.splitDetailPriceData.detailPriceTradeSell,
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
              name: '股价',
              type: 'line',
              yAxisIndex: 1,
              data: that.splitDetailPriceData.detailPriceClosePrice,
              symbol: 'circle', // 图形默认小圆圈去除
              smooth: true,
              lineStyle: {
                normal: {opacity: 0.5}
              }
            }
          ]
        }
        this.marketvalDetailChartData = {
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
            data: ['持仓买入金额', '持仓卖出金额', '持仓市值'],
            bottom: '5%',
            left: 'center'
          },
          title: [

            {
              left: 'center',
              top: '5%',
              text: '持仓市值+交易情况图',
              textStyle: {
                color: '#fff'
              }
            }
          ],
          grid: [
            {
              top: '16%',
              left: '15%',
              right: '15%',
              height: '60%'
            }
          ],
          xAxis: [
            {
              scale: false,
              type: 'category',
              data: that.splitMarketvalDetailData.marketvalDetaildate,
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
              axisLabel: {
                color: '#aec0e6'
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              },
              axisTick: {show: false},
              splitLine: {show: false}
            },
            {
              scale: false,
              position: 'right',
              axisLabel: {
                color: '#aec0e6'
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
              name: '持仓买入金额',
              type: 'bar',
              data: that.splitMarketvalDetailData.marketvalDetailBuy,
              symbol: 'none',
              stack: 'two',
              itemStyle: {
                color: '#ff402b',
                normal: {
                  color: '#ff402b'
                }
              }
            },
            {
              name: '持仓卖出金额',
              type: 'bar',
              data: that.splitMarketvalDetailData.marketvalDetailSell,
              symbol: 'none',
              stack: 'two',
              itemStyle: {
                color: '#12bba5',
                normal: {
                  color: '#12bba5'
                }
              }
            },
            {
              name: '持仓市值',
              type: 'line',
              yAxisIndex: 1,
              data: that.splitMarketvalDetailData.holdMarketVal,
              symbol: 'circle', // 图形默认小圆圈去除
              smooth: true,
              lineStyle: {
                normal: {opacity: 0.5}
              }
            }
          ]
        }
      },
      drawChart () {
        let that = this
        let detailPriceChart = echarts.init($('.detail-price-chart')[0], that.gfnGetTheme())
        let marketvalDetailChart = echarts.init($('.marketval-detail-chart')[0], that.gfnGetTheme())
        window.onresize = detailPriceChart.resize
        window.onresize = marketvalDetailChart.resize
        console.log(this.splitDetailPriceData)
        console.log(this.splitMarketvalDetailData)
        detailPriceChart.setOption(that.detailPriceChartData, true)
        marketvalDetailChart.setOption(that.marketvalDetailChartData, true)
      },
      handleChangeVeidoo () {
        this.getResData()
      },
      handleChangeSelectCode (val) {
        let code = val
        if (val.indexOf(' ') !== -1) {
          code = code.split(' ')[0]
        }
        this.splitData(code)
        this.drawChart()
      }
    },
    created () {
    },
    beforeDestory () {
    }
  }
</script>

<style lang="less" scoped>
  .account-detail-style {
    .account-detail-style-charts {
      .detail-price-chart, .marketval-detail-chart {
        width: 1600px;
        height: 400px;
      }
    }
  }
</style>
