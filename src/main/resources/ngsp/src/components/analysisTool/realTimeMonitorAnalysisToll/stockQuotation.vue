<template>
  <div class='stockQuotation'>
    <el-row :gutter="20">
      <el-col :lg="10" :md="24">
        <el-card class='el-card-table'>
          <el-row style='padding: 10px 0px'>
            <el-col :span='10'>
              <el-col :span='8' class='name'>证券代码：</el-col>
              <el-col :span='16'>
                <stock-code-query :commonData='submitData' :clearable='false'
                                  @getStockCode='getStockCode'></stock-code-query>
              </el-col>
            </el-col>
            <el-col :span='10'>
              <el-col :span='8' class='name'>时间跨度：</el-col>
              <el-col :span='16'>
                <el-select v-model='value' size='small' @change='getTime'>
                  <el-option
                    v-for='item in options'
                    :key='item.value'
                    :label='item.label'
                    :value='item.value'
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
            <el-col :span='4'>
              <el-button
                type='primary'
                size='small'
                style='float: right; margin-right: 15px;'
                @click='dialogFormVisble=true'>
                双人双密
              </el-button>
              <double-per-dou-psw @isPass='isPass' @isShow='getShowDilog'
                                  :dialogFormVisble='dialogFormVisble'></double-per-dou-psw>
            </el-col>
          </el-row>
          <div id='KChart' style='height: 350px' v-if='showContent'></div>
        </el-card>
      </el-col>
      <el-col :lg="14" :md="24">
        <el-card class='el-card-table' v-if='showContent'>
          <el-row style='padding: 10px 0px'>
            <el-col :span='3' class='name'>日期时间：</el-col>
            <el-col :span='10'>
              <el-date-picker
                v-model='dateTimeValue'
                type='datetimerange'
                :clearable='false'
                :editable='false'
                :disabled='true'
                range-separator='至'
                start-placeholder='开始日期'
                end-placeholder='结束日期'
                size='small'
              >
              </el-date-picker>
            </el-col>
            <el-col :offset='7' :span='4'>
              <el-button type='primary' size='mini' style='float: right; margin-right: 15px;' @click='newOpen'
                         v-if="functionBtnAvailable">显示功能区
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='17'>
              <div id='miniteChart' style='width:100%; height: 350px;'></div>
            </el-col>
            <el-col :span='7'>
              <div class='barWrap'>
                <div class='barWrap-head'>
                  <el-row>
                    <el-col :span="10">
                      <div class="barWrap-head__date">{{barDate}}</div>
                    </el-col>
                    <el-col :span="14">
                      <div class='timeSelect'>
                        <el-time-picker
                          v-model='value1'
                          :clearable='false'
                          :disabled="isDisabled"
                          value-format='HH:mm:ss'
                          size='small'
                          @change='getBarTime'
                        >
                        </el-time-picker>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div id='buyBar' style='width:100%;height: 350px;'></div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import StockCodeQuery from '../../common/StockCodeQuery';
  import moment from 'moment';
  import DoublePerDouPsw from '../../common/DoublePerDouPsw'
  import {
    postStockDayK,
    postStockTimeData,
    postStockTenData
  } from '../../../service/analysisTool/realTimeMonitorAnalysisToll/index'

  var echarts = require('echarts');
  export default {
    name: 'stock-quotation',
    components: {
      StockCodeQuery,    //  证券代码组件注册
      DoublePerDouPsw
    },
    props: ['jumpCode'],
    data() {
      return {
        options: [
          {
            value: '1',
            label: '1个月'
          },
          {
            value: '3',
            label: '3个月'
          },
          {
            value: '6',
            label: '6个月'
          },
          {
            value: '12',
            label: '12个月'
          }
        ],
        value: '1',
        submitData: {disabled: true, secSubTypecode: 'ASH', stockCode: ''},
        stockCode: '',
        dateTimeValue: '',
        value1: '',
        barDate: '',
        barTime: '',
        stockName: '',
        dialogFormVisble: false,
        showContent: false,
        timeListData: [],
        chartDateK: null,
        chartShareTime: null,
        chartBar: null,
        functionBtnAvailable: false,
        isDisabled: true
      }
    },
    mounted() {
    },
    watch: {
      jumpCode: {
        handler: function (param1, param2) {
          this.submitData.stockCode = param1.instrument_id + ' ' + param1.instrument_name
          this.stockCode = param1.instrument_id
          this.$store.commit('saveStockCode', param1.instrument_id)
          this.$store.commit('saveStockCodeName', param1.instrument_name)
          this.getDayKChartData()
        },
        deep: true
      }
    },
    methods: {
      getTime(val) {
        this.getDayKChartData()
      },
      isPass(val) {
        this.showContent = val
        this.submitData.disabled = !val
        this.$emit('showFlag', val);
        if (val) {
          this.submitData.stockCode = '000001 上证指数'
          this.stockCode = '000001'
          this.stockName = '上证指数'
          this.$store.commit('saveStockCode', '000001')
          this.$store.commit('saveStockCodeName', '上证指数')
          this.initCharts()
        }
      },
      checkFunctionAvailable() {
        if (this.stockCode != '' && this.dateTimeValue != '') {
          this.functionBtnAvailable = true
        } else {
          this.functionBtnAvailable = false
        }
      },
      initCharts() {
        let that = this
        setTimeout(function () {
          that.getDayKChartData()
          // that.drawDayKChart({timeList: [], seriseData: []}, 'KChart')
          that.drawChart({timeList: [], seriseData: []}, 'miniteChart')
          that.drawBar({buyPrice: [], sellPrice: [], sellCount: [], buyCount: []}, 'buyBar')
        }, 500)
      },
      getShowDilog(val) {
        this.dialogFormVisble = val
      },
      getBarTime(val) {
        this.barTime = val.split(':').join('')
        this.getBarData()
      },
      getStockCode(stockCodeData) {
        if (stockCodeData) {
          this.stockCode = stockCodeData.split(' ')[0]
          this.stockName = stockCodeData.split(' ')[1]
          this.$store.commit('saveStockCode', stockCodeData.split(' ')[0])
          this.$store.commit('saveStockCodeName', stockCodeData.split(' ')[1])
          this.getDayKChartData()
          this.checkFunctionAvailable()
        }
      },
      getDayKChartData() {
        let params = {indexCode: this.stockCode, monthDate: this.value}
        if (this.chartDateK == null) {
          this.chartDateK = echarts.init(document.getElementById('KChart'), this.gfnGetTheme());
        }
        this.gfnEchartShowLoading(this.chartDateK)
        let that = this
        postStockDayK(params)
          .then((resp) => {
            let res = resp.DAY_DATA
            let timeList = []
            let volumes = [];
            let barData = []
            this.timeListData = []
            res.forEach((el) => {
              timeList.push(moment(el[0]).format('YYYY-MM-DD'))
              this.timeListData.push(moment(el[0]).format('YYYY-MM-DD'))
              volumes.push([
                el[1], // 开盘价格
                el[4], // 收盘价格
                el[3], // 最低价格
                el[2] // 最高价格
              ])
              barData.push(el[5])
            })
            let seriseData = [
              {
                name: '收盘价',
                type: 'candlestick',
                data: volumes,
                smooth: true,
                itemStyle: {
                  color: '#ff402b',
                  color0: '#12bba5',
                  borderColor: null,
                  borderColor0: null
                }
              },
              {
                name: '成交量',
                type: 'bar',
                stack: '总量',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: barData,
                itemStyle: {
                  normal: {
                    color: function (params) {
                      let volumesColor = '';
                      if (res[params.dataIndex][4] > res[params.dataIndex][1]) {
                        volumesColor = '#ff402b';
                      } else {
                        volumesColor = '#12bba5'
                      }
                      return volumesColor;
                    }
                  }
                }
              }
            ]
            let data = {timeList, seriseData}
            this.drawDayKChart(data, 'KChart');
          }, (err) => {
            that.chartDateK.hideLoading();
          })
      },
      // 新开页面
      newOpen() {
        let stockCode = this.$store.state.realTimeMonitorAnalysisToll.stockCode
        if (!stockCode) {
          stockCode = '000001'
        }
        let param = {
          isinCode: stockCode,
          tranTime: this.value1,
          dateTimeValue: this.dateTimeValue,
          monitorAccount: this.$store.state.realTimeMonitorAnalysisToll.selectMonitorCode,
          analysisAccount: this.$store.state.realTimeMonitorAnalysisToll.selectAnalysisCode,
          checkedAccount: this.$store.state.realTimeMonitorAnalysisToll.selectCheckedCode
        }
        window.open(`#/realTimeDetection/${JSON.stringify(param)}`)
        // window.open(`#/realTimeDetection/${JSON.stringify(param)}`, '_blank', 'realtimeDetectionFunctionArea',
        //   'width=1024, height=860, toolbar=no, status=no, menubar=no, location=no, directories=no')
      },
      // 日k图画图方法
      drawDayKChart(chartData, DOMId) {
        if (this.chartDateK == null) {
          this.chartDateK = echarts.init(document.getElementById(DOMId), this.gfnGetTheme());
        }
        let options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                type: 'dashed',
                color: '#006cee'
              }
            },
            backgroundColor: 'rgba(245,245,245,0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
              let obj = {top: 35};
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
              return obj
            },
            formatter: function (params) {
              let fm = [];
              let fmx = false;
              for (let idx in params) {
                let param = params[idx];
                if (!fmx) {
                  fm.push('日期：' + param.name + '<br/>');
                  fmx = true;
                }
                fm.push('<hr size=1 style="margin: 3px 0">');
                if (param.seriesType === 'bar') {
                  fm.push(param.seriesName + '：' + (param.value / 1000000).toFixed(2) + '万手 <br/>');
                } else {
                  fm.push('开盘：' + param.data[1] + '<br/>');
                  fm.push('收盘：' + param.data[2] + '<br/>');
                  fm.push('最低：' + param.data[3] + '<br/>');
                  fm.push('最高：' + param.data[4] + '<br/>');
                }
              }
              return fm.join('');
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'}
          },
          toolbox: {
            top: 0,
            right: 25,
            feature: {
              dataZoom: {
                yAxisIndex: false
              },
              brush: {
                type: ['lineX', 'clear']
              },
              saveAsImage: {
                name: this.stockCode + ' 日K图'
              }
            }
          },
          brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            throttleType: 'debounce',
            throttleDelay: '1000',
            removeOnClick: true,
            brushStyle: {
              color: 'rgba(255,255,255,0.03)',
              borderColor: '#455577'
            },
            outOfBrush: {
              colorAlpha: 0.5
            }
          },
          grid: [
            {
              left: '8%',
              right: '2%',
              top: '28px',
              height: '50%',
              containLabel: false,
              show: true,
              borderColor: '#263657',
              borderWidth: 1
            },
            {
              left: '8%',
              right: '2%',
              top: '68%',
              height: '20%',
              containLabel: false,
              show: true,
              borderColor: '#263657',
              borderWidth: 1
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: chartData.timeList,
              boundaryGap: false,
              splitLine: {
                show: false
              },
              axisLine: {show: false},
              axisTick: {
                show: true,
                lineStyle: {
                  color: '#506798'
                }
              },
              axisLabel: {
                color: '#506798'
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              data: chartData.timeList,
              min: 'dataMin',
              max: 'dataMax',
              boundaryGap: false,
              axisTick: {show: false},
              splitLine: {
                show: false
              },
              axisPointer: {
                z: 100
              },
              axisLabel: {show: false},
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#263657'
                }
              }
            },
            {
              type: 'category',
              gridIndex: 0,
              axisTick: {show: false},
              axisLine: {
                onZero: true,
                lineStyle: {
                  color: '#455579'
                }
              }
            }
          ],
          yAxis: [
            {
              scale: true,
              axisLabel: {
                color: '#506798'
              },
              splitNumber: 2,
              axisTick: {show: false},
              splitArea: {
                show: true
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              },
              position: 'left'
            },  //  左上轴
            {
              type: 'value',
              gridIndex: 1,
              axisTick: {show: false},
              splitNumber: 1,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLabel: {
                color: '#506798',
                formatter: function (params) {
                  let value = params / 1000000 + '万手'
                  return value
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            } //  左下轴
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: 0,
              end: 100
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: 'slider',
              top: '90%',
              start: 40,
              end: 60,
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
          series: chartData.seriseData
        };
        this.chartDateK.setOption(options, true);
        this.chartDateK.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'single'
          }
        })
        let that = this
        this.chartDateK.on('brushSelected', function (val) {
          var timeData = val.batch[0].areas[0]
          if (timeData) {
            let range
            range = timeData.coordRange
            let startTime = range[0]
            let overTime = range[1]
            startTime = that.timeListData[startTime] + ' 09:30:00'
            overTime = that.timeListData[overTime] + ' 15:00:00'
            that.dateTimeValue = [startTime, overTime]
            that.getTimeChartData(that.dateTimeValue)
            that.checkFunctionAvailable()
          }
        })
        // let initBrushPoint = (chartData.timeList == null || chartData.timeList.length == 0 ) ? null : chartData.timeList[chartData.timeList.length - 1]
        // if (initBrushPoint != null) {
        //   echart.dispatchAction({
        //     type: 'brush',
        //     areas: [{
        //       brushType: 'lineX',
        //       coordRange: [initBrushPoint, initBrushPoint],
        //       xAxisIndex: 0
        //     }]
        //   })
        // }
        this.chartDateK.hideLoading();
      },
      getTimeChartData(date) {
        let params = {
          indexCode: this.stockCode,
          startTime: '',
          endTime: '',
          startDate: moment(date[0], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
          endDate: moment(date[1], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
        }
        if (this.chartShareTime == null) {
          this.chartShareTime = echarts.init(document.getElementById('miniteChart'));
        }
        this.gfnEchartShowLoading(this.chartShareTime)
        let that = this
        postStockTimeData(params)
          .then((resp) => {
            let res = resp.MINUTE_DATA
            let timeList = []
            let volumes = [];
            let barData = []
            res.forEach((el) => {
              timeList.push(moment(el[0]).format('YYYY-MM-DD HH:mm:ss'))
              volumes.push(el[4])
              barData.push(el[5])
            })
            let seriseData = [
              {
                name: this.stockName,
                type: 'line',
                data: volumes,
                smooth: true,
                showAllSymbol: true
              },
              {
                name: '成交量',
                type: 'bar',
                stack: '总量',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: barData,
                itemStyle: {
                  normal: {
                    color: function (params) {
                      let volumesColor = '';
                      if (!params.dataIndex) {
                        if ((res[0][4] - res[0][1]) > 0) {
                          volumesColor = that.gfnFormatSecurityColor(1)
                        } else {
                          volumesColor = that.gfnFormatSecurityColor(-1)
                        }
                      } else {
                        if (res[params.dataIndex][4] > res[params.dataIndex - 1][4]) {
                          volumesColor = that.gfnFormatSecurityColor(1)
                        } else {
                          volumesColor = that.gfnFormatSecurityColor(-1)
                        }
                      }
                      return volumesColor;
                    }
                  }
                }
              }
            ]
            let data = {timeList, seriseData}
            this.drawChart(data, 'miniteChart');
          }, (err) => {
            that.chartShareTime.hideLoading();
          })
      },
      // 分时图画图方法
      drawChart(chartData, DOMId) {
        if (this.chartShareTime == null) {
          this.chartShareTime = echarts.init(document.getElementById(DOMId));
        }
        let options = {
          animation: false,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                type: 'dashed',
                color: '#006cee'
              }
            },
            backgroundColor: 'rgba(245,245,245,0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
              let obj = {top: 35};
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
              return obj
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'}
          },
          toolbox: {
            top: 0,
            right: 25,
            feature: {
              dataZoom: {
                yAxisIndex: false
              },
              brush: {
                type: ['lineX', 'clear']
              },
              saveAsImage: {
                name: this.stockCode + ' 分时图'
              }
            }
          },
          brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            throttleType: 'debounce',
            throttleDelay: 300,
            removeOnClick: true,
            brushStyle: {
              color: 'rgba(255,255,255,0.03)',
              borderColor: '#455577'
            },
            outOfBrush: {
              color: '#ddd',
              colorAlpha: 0.8
            }
          },
          grid: [
            {
              left: '8%',
              right: '2%',
              top: '28px',
              height: '50%',
              containLabel: false
            },
            {
              left: '8%',
              right: '2%',
              top: '68%',
              height: '20%',
              containLabel: false
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: chartData.timeList,
              boundaryGap: false,
              splitLine: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#263657'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                color: '#506798'
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              data: chartData.timeList,
              min: 'dataMin',
              max: 'dataMax',
              boundaryGap: false,
              axisTick: {show: false},
              splitLine: {
                show: false
              },
              axisPointer: {
                z: 100
              },
              axisLabel: {show: false},
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#263657'
                }
              }
            }
          ],
          yAxis: [
            {
              scale: true,
              axisLabel: {
                color: '#506798'
              },
              splitNumber: 2,
              axisTick: {show: false},
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              },
              position: 'left'
            }, //  左上轴
            {
              type: 'value',
              gridIndex: 1,
              axisTick: {show: false},
              splitNumber: 1,
              splitLine: {show: false},
              axisLabel: {
                color: '#506798',
                formatter: function (value, index) {
                  if (index === 0) {
                    return 0;
                  } else {
                    return Number(value) / 1000000 + '万手';
                  }
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            }  //  左下轴
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: 0,
              end: 100
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: 'slider',
              top: '90%',
              start: 0,
              end: 100,
              textStyle: {
                color: '#506798'
              },
              dataBackground: {lineStyle: {color: '#aec0e6'}, areaStyle: {color: '#334164'}},
              fillerColor: 'rgba(0,0,0,0.1)',
              borderColor: '#334164'
            }
          ],
          series: chartData.seriseData
        };
        let that = this
        this.chartShareTime.on('brushSelected', function (val) {
          var timeData = val.batch[0].areas[0]
          if (timeData) {
            let range = timeData.coordRange
            let startTime = range[0]
            let overTime = range[1]
            startTime = moment(chartData.timeList[startTime], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
            overTime = moment(chartData.timeList[overTime], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
            that.dateTimeValue = [startTime, overTime]
            that.checkFunctionAvailable()
          }
        })
        this.chartShareTime.off('click')
        this.chartShareTime.on('click', function (val) {
          that.value1 = moment(val.name, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')
          that.barDate = moment(val.name.split(' ')[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
          that.barTime = val.name.split(' ')[1].split(':').join('')
          that.isDisabled = false
          that.getBarData()
        })
        this.chartShareTime.setOption(options, true);
        this.chartShareTime.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'single'
          }
        })
        this.chartShareTime.hideLoading();
        this.drawBar([], 'buyBar')
      },
      getBarData() {
        let params = {indexCode: this.stockCode, tDate: this.barDate, tTime: this.barTime}
        if (this.chartBar == null) {
          this.chartBar = echarts.init(document.getElementById('buyBar'), this.gfnGetTheme());
        }
        this.gfnEchartShowLoading(this.chartBar)
        postStockTenData(params).then((resp) => {
          if (resp.TIMETEN_DATA.length == 0) {
            this.$message.warning('查询数据为空')
            let data = {buyPrice: [], sellPrice: [], sellCount: [], buyCount: []}
            this.drawBar(data, 'buyBar')
          } else {
            let res = resp.TIMETEN_DATA[0]
            let buyPrice = []
            let sellPrice = []
            let buyCount = []
            let sellCount = []
            buyCount = [res.buyvolume10, res.buyvolume9, res.buyvolume8, res.buyvolume7, res.buyvolume6, res.buyvolume5, res.buyvolume4, res.buyvolume3, res.buyvolume2, res.buyvolume1]
            sellCount = [res.sellvolume1, res.sellvolume2, res.sellvolume3, res.sellvolume4, res.sellvolume5, res.sellvolume6, res.sellvolume7, res.sellvolume8, res.sellvolume9, res.sellvolume10]
            buyPrice = [res.buyprice10, res.buyprice9, res.buyprice8, res.buyprice7, res.buyprice6, res.buyprice5, res.buyprice4, res.buyprice3, res.buyprice2, res.buyprice1]
            sellPrice = [res.sellprice1, res.sellprice2, res.sellprice3, res.sellprice4, res.sellprice5, res.sellprice6, res.sellprice7, res.sellprice8, res.sellprice9, res.sellprice10]
            let data = {buyPrice, sellPrice, sellCount, buyCount}
            this.drawBar(data, 'buyBar')
          }
        })
      },
      // 柱状图
      drawBar(data, id) {
        if (this.chartBar == null) {
          this.chartBar = echarts.init(document.getElementById(id), this.gfnGetTheme());
        }
        let that = this
        this.chartBar.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: [
            {
              left: '18%',
              right: '18%',
              top: '40px',
              height: '40%',
              width: '64%',
              containLabel: false,
              show: true,
              borderWidth: 1,
              borderColor: '#263657'
            },
            {
              left: '18%',
              right: '18%',
              top: '55%',
              height: '40%',
              width: '64%',
              containLabel: false,
              show: true,
              borderWidth: 1,
              borderColor: '#263657'
            }
          ],
          toolbox: {
            show: true,
            x: '85%',
            y: '15px',
            itemSize: 14,
            feature: {
              saveAsImage: {
                name: moment(this.barTime, 'HHmmss').format('HH:mm:ss') + '十档行情图'
              }
            },
            showTitle: false
          },
          xAxis: [
            {
              axisLabel: {
                show: false,
                color: '#506798'
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: 'transparent'
                }
              },
              type: 'value',
              max: function (val) {
                return parseInt(val.max + val.max)
              }
            },
            {
              axisLabel: {
                show: false,
                color: '#506798'
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: 'transparent'
                }
              },
              type: 'value',
              gridIndex: 1,
              max: function (val) {
                return parseInt(val.max + val.max)
              }
            }
          ],
          yAxis: [
            {
              type: 'category',
              data: ['卖一', '卖二', '卖三', '卖四', '卖五', '卖六', '卖七', '卖八', '卖九', '卖十'],
              axisLabel: {
                color: '#506798',
                interval: 0
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            },
            {
              type: 'category',
              data: data.sellPrice,
              axisLabel: {
                color: '#7b8fb9',
                interval: 0
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              },
              position: 'right'
            },
            {
              type: 'category',
              data: ['买十', '买九', '买八', '买七', '买六', '买五', '买四', '买三', '买二', '买一'],
              axisLabel: {
                color: '#506798',
                interval: 0
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              },
              gridIndex: 1
            },
            {
              type: 'category',
              data: data.buyPrice,
              axisLabel: {
                color: '#7b8fb9',
                interval: 0
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              },
              position: 'right',
              gridIndex: 1
            }
          ],
          series: [
            {
              name: '卖出数量',
              type: 'bar',
              data: data.sellCount,
              label: {
                normal: {
                  show: true,
                  position: 'right'
                  //  fontWeight: 700,
                  //  fontsize: '20px',
                }
              },
              itemStyle: {
                color: that.gfnFormatSecurityColor(-1)
              }
            },
            {
              name: '买入数量',
              type: 'bar',
              data: data.buyCount,
              label: {
                normal: {
                  show: true,
                  position: 'right'
                  //  fontWeight: 700,
                  //  fontsize: '20px',
                }
              },
              itemStyle: {
                color: that.gfnFormatSecurityColor(1)
              },
              xAxisIndex: 1,
              yAxisIndex: 2
            }
          ]
        }, true)
        this.chartBar.hideLoading()
      }
    }
  }
</script>

<style lang='less'>
  .stockQuotation {
    .name {
      line-height: 32px;
      text-indent: 20px;
    }
    .barWrap {
      display: block;
      position: relative;
      .barWrap-head {
        position: absolute;
        z-index: 100;
        background: rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        height: 32px;
        width: 70%;
        left: 42px;
        .barWrap-head__date {
          position: relative;
          top: 8px;
          text-align: right;
        }
        .timeSelect {
          input {
            border: none;
            font-size: 21px;
            text-align: left;
          }
          .el-input.is-disabled .el-input__inner {
            background-color: transparent !important;
          }
          .el-date-editor.el-input {
            width: 100%;
          }
          .el-input--prefix .el-input__inner {
            padding-left: 10px;
            padding-right: 10px;
          }
          .el-input__prefix {
            display: none;
          }
        }
      }
    }
  }

</style>
