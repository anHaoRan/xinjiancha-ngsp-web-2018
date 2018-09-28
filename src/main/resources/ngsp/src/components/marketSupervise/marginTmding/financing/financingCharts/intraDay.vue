<template>
  <el-card class='intraday' style='margin-top: 0px'>
    <div slot='header' class='clearfix'>
      指数行情监测
    </div>
    <div class='headWrap'>
      <div class='indexcode'>
        指数
        <el-select v-model='value' size='mini' @change='getStock'>
          <el-option v-for='item in options' :key='item.value' :label='item.label' :value='item.value'></el-option>
        </el-select>
      </div>
      <div class='date'>
        <el-row>
          <el-col :span='4' style='text-align: center'>
            <span>时间设置</span>
          </el-col>
          <el-col :span='6'>
            <el-time-picker
              editable
              clearable
              v-model='beginTime'
              placeholder='开始时间'
              value-format='HH:mm'
              @change='getstarttime'
              :picker-options='{selectableRange:"09:30:00 - 15:00:00"}'
              size='mini'
              style='width:100%'>
            </el-time-picker>
          </el-col>
          <el-col :span='2' style='text-align: center'>至</el-col>
          <el-col :span='6' class='spacing'>
            <el-time-picker
              editable
              clearable
              v-model='endTime'
              type='date'
              placeholder='结束时间'
              value-format='HH:mm'
              @change='getendtime'
              :picker-options='{selectableRange:"09:30:00 - 15:00:00"}'
              size='mini'
              style='width:100%'>
            </el-time-picker>
          </el-col>
        </el-row>
      </div>
      <div class='time' style='margin-left: -100px'>
        <el-row>
          <el-col :span='6' style='text-align: center'>
            <span>日期设置</span>
          </el-col>
          <el-col :span='14'>
            <el-date-picker
              v-model='beginDate'
              type='date'
              placeholder='请选择日期'
              value-format='yyyy-MM-dd'
              @change='getbeginDate'
              @blur='loseFocus'
              :picker-options='pickerOptions'
              size='mini'
              style='width:100%'>
            </el-date-picker>
          </el-col>
        </el-row>
      </div>
      <div class='multiply'>
        <span>叠加对象：</span>
        <el-button type='primary' :class='buttonOne' size='mini' @click='selectOne'>
          <div class='green'></div>
          融资净买入金额
        </el-button>
        <el-button type='primary' :class='buttonTwo' size='mini' @click='selectTwo'>
          <div class='violet'></div>
          融券净卖出金额
        </el-button>
        <el-button type='primary' :class='buttonThree' size='mini' @click='selectThree'>
          <div class='pink'></div>
          累计融资强平金额
        </el-button>
      </div>
    </div>
    <div style='position: relative;'>
      <div style='position: absolute;top: 25px;font-size:12px;left: 15%'>
        昨：<span>{{amplitudeObj.yesterdayPrice}}元   </span>
        现：<span :class='upColor'>{{amplitudeObj.nowPrice}}元   </span>
        涨跌：<span :class='upColor'>{{amplitudeObj.amplitude}}   </span>
        涨跌幅：<span :class='upColor'>{{amplitudeObj.amplitudePrp}}%   </span>
        <span>{{amplitudeObj.tim}}</span>
      </div>
      <div id='KCharts' style='width:100%;height: 400px'></div>
      <div :class='modelClass' v-show='modelShow'>
        <div>
          <p style='margin: 10px 30px 5px;font-weight: 700'>
            <span>起始时刻:</span>
            <span>{{regionData.time}}</span>
          </p>
        </div>
        <div class='wrap'>
          <div class='left'>
            <p>
              <span>买入金额:</span>
              <span>{{regionData.regionQuotationChart.buy_amount}}</span>
            </p>
            <p>
              <span>卖出金额:</span>
              <span>{{regionData.regionQuotationChart.sale_amount}}</span>
            </p>
            <p>
              <span>净买入金额:</span>
              <span>{{regionData.regionQuotationChart.margin_amount}}</span>
            </p>
            <p>
              <span>买入金额占比:</span>
              <span>{{regionData.regionQuotationChart.buy_amount_prop}}%</span>
            </p>
            <p>
              <span>卖出金额占比:</span>
              <span>{{regionData.regionQuotationChart.sale_amount_prop}}%</span>
            </p>
          </div>
          <div class='right'>
            <p>
              <span>申报买入笔数:</span>
              <span>{{regionData.buy_orders}}</span>
            </p>
            <p>
              <span>申报买入占比:</span>
              <span>{{regionData.buy_orders_prop}}%</span>
            </p>
            <p>
              <span>申报卖出笔数:</span>
              <span>{{regionData.sale_orders}}</span>
            </p>
            <p>
              <span>申报卖出占比:</span>
              <span>{{regionData.sale_orders_prop}}%</span>
            </p>
            <p>
              <span>撤单笔数:</span>
              <span>{{regionData.cancel_orders}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import moment from 'moment'
  import {getRegionData, getIntradayChart} from '../../../../../service/marketSupervise/index'
  import {getCurTradeDate} from '../../../../../service/common/commonFunc'

  let echarts = require('echarts')
  export default {
    name: 'cross-day',
    data() {
      return {
        buttonOne: '',
        buttonTwo: '',
        buttonThree: '',
        beginDate: '',
        beginTime: '09:30',
        endTime: '15:00',
        modelClass: 'popboxLeft',
        modelShow: false,
        checkList: [],
        range: [],
        radio: '000001',
        value: '000001',
        options: [
          {value: '000001', label: '上证综指'},
          {value: '000016', label: '上证50'},
          {value: '000010', label: '上证180'},
          {value: '000009', label: '上证380'}
        ],
        amplitudeObj: {
          'yesterdayPrice': '', // 昨收盘价
          'nowPrice': '', // 现价
          'amplitudePrp': '', // 涨跌百分比
          'amplitude': '', // 涨跌数量
          'tim': ''
        },
        upColor: 'down',
        regionData: {
          'time': '',
          'sale_orders_prop': '',
          'regionQuotationChart': {
            'margin_amount': '',
            'buy_amount_prop': '',
            'sale_amount_prop': '',
            'buy_amount': '',
            'sale_amount': ''
          },
          'sale_orders': '',
          'cancel_orders': '',
          'buy_orders': '',
          'buy_orders_prop': ''
        }, // 框选数据
        indexCode: '', // 指数代码(传参)
        trandat: '',
        selectTime: [],
        rangeStart: '',
        rangeEnd: '',
        rzjmObj: {}, // 融资净买入数据
        rqjmObj: {}, // 融券净卖出数据
        rzqpObj: {}, // 融资强平数据
        yAxis: [],
        series: [],
        startTime: '',
        overTime: '',
        flag: false, // 是否主动触发了框选
        timer: null,
        timeInterval: 60 * 1000,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        allTime: []
      }
    },
    mounted() {
      this.getDate()
      this.drawKcharts()
      setTimeout(() => {
        this.refeshKcharts()
      }, 50)
    },
    // 切换页面时清除定时器
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      // 获取当前交易日
      getDate() {
        getCurTradeDate().then(resp => {
          this.beginDate = resp
          this.$emit('getDate', resp)
        })
      },
      // 开始时间
      getstarttime(val) {
        if (!val) {
          this.beginTime = '09:30:00'
        }
        this.changeTimeChartBrush('KCharts')
      },
      // 结束时间
      getendtime(val) {
        if (!val) {
          this.endTime = '15:00:00'
        }
        this.changeTimeChartBrush('KCharts')
      },
      // 开始日期
      getbeginDate(val) {
        if (val) {
          this.beginDate = val.split('-').join('')
        } else {
          this.beginDate = ''
        }
        this.overlayDataDraw()
        this.$emit('getDate', val)
      },
      loseFocus(val) {
        if (val.displayValue) {
          if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(val.displayValue)) {
            document.getElementsByClassName('el-input__inner')[4].value = ''
            this.$message.warning('请输入正确的日期格式yyyy-MM-dd')
          }
        }
      },
      // 指数代码
      getStock(val) {
        this.indexCode = val
        this.overlayDataDraw()
        this.$emit('getStockCode', val)
      },
      // 叠加设置
      selectOne() {
        this.modelShow = false
        // this.beginTime = ''
        // this.endTime = ''
        if (this.buttonOne === '') {
          this.buttonOne = 'buttonOne'
          this.series.push(this.rzjmObj.series)
          let data1 = {'yAxis': this.yAxis, 'series': this.series, 'timeList': this.selectTime}
          this.render(data1)
        } else {
          this.buttonOne = ''
          this.series.forEach((el, index) => {
            if (el.name === '融资净买入金额') {
              this.series.splice(index, 1)
            }
          })
          let data1 = {'yAxis': this.yAxis, 'series': this.series, 'timeList': this.selectTime}
          this.render(data1)
        }
      },
      selectTwo() {
        this.modelShow = false
        // this.beginTime = ''
        // this.endTime = ''
        if (this.buttonTwo === '') {
          this.buttonTwo = 'buttonTwo'
          this.series.push(this.rqjmObj.series)
          let data1 = {'yAxis': this.yAxis, 'series': this.series, 'timeList': this.selectTime}
          this.render(data1)
        } else {
          this.buttonTwo = ''
          this.series.forEach((el, index) => {
            if (el.name === '融券净卖出金额') {
              this.series.splice(index, 1)
            }
          })
          let data1 = {'yAxis': this.yAxis, 'series': this.series, 'timeList': this.selectTime}
          this.render(data1)
        }
      },
      selectThree() {
        this.modelShow = false
        // this.beginTime = ''
        // this.endTime = ''
        if (this.buttonThree === '') {
          this.buttonThree = 'buttonThree'
          this.series.push(this.rzqpObj.series)
          let data1 = {'yAxis': this.yAxis, 'series': this.series, 'timeList': this.selectTime}
          this.render(data1)
        } else {
          this.buttonThree = ''
          this.series.forEach((el, index) => {
            if (el.name === '累计融资强平金额') {
              this.series.splice(index, 1)
            }
          })
          let data1 = {'yAxis': this.yAxis, 'series': this.series, 'timeList': this.selectTime}
          this.render(data1)
        }
      },
      // 请求数据画分时叠加图
      drawKcharts() {
        this.modelShow = false
        // this.beginTime = ''
        // this.endTime = ''
        getIntradayChart(this.indexCode, this.startTime, this.overTime, this.beginDate)
          .then((res) => {
            let resp = res
            this.amplitudeObj = resp.amplitude
            if (this.amplitudeObj.amplitude > 0) {
              this.upColor = 'up'
            } else {
              this.upColor = 'down'
            }
            this.amplitudeObj.tim = moment(this.amplitudeObj.tim).format('YYYY-MM-DD dddd HH:mm')
            // 指数分时图数据
            let sseLastCloseData = resp.increase
            if (resp.chartName === '') {
              resp.chartName = '上证380'
            }
            let indexName = resp.chartName
            let sseAmpliToday = resp.ampliToday
            let chartData = []
            let todayData = resp.chartData
            let timeList = []
            todayData.forEach((el, i) => {
              timeList.push(moment(el[0], 'HHmm').format('HH:mm'))
              this.allTime.push(moment(el[0], 'HHmm').format('HH:mm'))
              // chartData.push(el[1])
              chartData.push([i, el[1], el[2], el[3]]);
            })
            this.selectTime = timeList
            let mindata = resp.minPrice // 指标线最小值
            let maxdata = resp.maxPrice // 指标线最大值
            // 买卖量数据
            let buySaleData = resp.buySaleTrdqty
            let buyData = []
            let saleData = []
            buySaleData.forEach((el) => {
              buyData.push(el.buy_trdqty / 1000000)
              saleData.push(-el.sale_trdqty / 1000000)
            })
            // 叠加数据
            let overlayList = resp.overlying
            let rzjmData = [] // 融资净买入数据
            let rqjmData = [] // 融券净卖出数据
            let ljrzqpData = [] // 累计融资强平
            overlayList.forEach((el) => {
              if (el.rzjmre === null) {
                rzjmData.push(el.rzjmre)
              } else {
                rzjmData.push((el.rzjmre / 100000000).toFixed(3))
              }
              if (el.rqjmce === null) {
                rqjmData.push(el.rqjmce)
              } else {
                rqjmData.push((el.rqjmce / 100000000).toFixed(3))
              }
              if (el.ljrzqpje === null) {
                ljrzqpData.push(el.ljrzqpje)
              } else {
                ljrzqpData.push((el.ljrzqpje / 100000000).toFixed(3))
              }
            })
            this.rzjmObj.name = '融资净买入金额'
            this.rzjmObj.yAxis = {
              name: '金额(亿元)',
              nameTextStyle: {
                color: '#506798'
              },
              splitLine: {show: false},
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#506798'
              },
              axisLine: {
                show: false
              },
              type: 'value',
              position: 'left'
            }
            this.rzjmObj.series = {
              name: '融资净买入金额',
              type: 'line',
              data: rzjmData,
              smooth: true,
              yAxisIndex: 2,
              itemStyle: {
                normal: {
                  color: '#1de3c0',
                  lineStyle: {
                    color: '#1de3c0'
                  }
                }
              }
            }
            this.rqjmObj.name = '融券净卖出金额'
            this.rqjmObj.yAxis = {
              splitArea: {
                show: false
              },
              splitLine: {show: false},
              axisLabel: {
                color: '#506798',
                inside: true
              },
              axisLine: {
                show: false
              },
              type: 'value',
              zlevel: 1000,
              position: 'left'
            }
            this.rqjmObj.series = {
              name: '融券净卖出金额',
              type: 'line',
              data: rqjmData,
              smooth: true,
              yAxisIndex: 3,
              itemStyle: {
                normal: {
                  color: '#6969c9',
                  lineStyle: {
                    color: '#6969c9'
                  }
                }
              }
            }
            this.rzqpObj.name = '累计融资强平金额'
            this.rzqpObj.yAxis = {
              name: '金额(亿元)',
              nameTextStyle: {
                color: '#506798'
              },
              splitLine: {show: false},
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#506798',
                inside: true
              },
              axisLine: {
                show: false
              },
              type: 'value',
              zlevel: 1000,
              position: 'right'
            }
            this.rzqpObj.series = {
              name: '累计融资强平金额',
              type: 'line',
              data: ljrzqpData,
              smooth: true,
              yAxisIndex: 4,
              itemStyle: {
                normal: {
                  color: '#ff4c4c',
                  lineStyle: {
                    color: '#ff4c4c'
                  }
                }
              }
            }
            this.yAxis = [
              {
                name: '指数',
                nameTextStyle: {
                  color: '#506798'
                },
                nameLocation: 'middle',
                nameGap: 60,
                splitArea: {
                  show: false
                },
                axisLabel: {
                  color: '#506798',
                  formatter: function (params) {
                    return params.toFixed(2)
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#273757'
                  }
                },
                axisLine: {
                  show: false
                },
                position: 'right',
                min: mindata, // 最小
                tickInterval: sseLastCloseData, // 步长
                max: maxdata // 最大
              },
              {
                type: 'value',
                gridIndex: 1,
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {
                  color: '#506798'
                },
                axisLine: {
                  show: false
                }
              }
            ]
            this.series = [
              {
                name: '价格',
                type: 'line',
                data: chartData,
                smooth: true,
                yAxisIndex: 0
              },
              {
                name: '融资买入数量',
                type: 'bar',
                stack: '总量',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: buyData,
                itemStyle: {
                  color: this.gfnFormatSecurityColor(1),
                  normal: {
                    color: this.gfnFormatSecurityColor(1)
                  }
                }
              },
              {
                name: '融券卖出数量',
                type: 'bar',
                stack: '总量',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: saleData,
                itemStyle: {
                  color: this.gfnFormatSecurityColor(-1),
                  normal: {
                    color: this.gfnFormatSecurityColor(-1)
                  }
                }
              }
            ]
            this.yAxis.push(this.rzjmObj.yAxis)
            this.yAxis.push(this.rqjmObj.yAxis)
            this.yAxis.push(this.rzqpObj.yAxis)
            this.series.push(this.rzjmObj.series)
            this.series.push(this.rqjmObj.series)
            this.series.push(this.rzqpObj.series)
            let data = {'yAxis': this.yAxis, 'series': this.series, 'timeList': timeList}
            if (!this.buttonOne) {
              this.series.forEach((el, index) => {
                if (el.name === '融资净买入金额') {
                  this.series.splice(index, 1)
                }
              })
            }
            if (!this.buttonTwo) {
              this.series.forEach((el, index) => {
                if (el.name === '融券净卖出金额') {
                  this.series.splice(index, 1)
                }
              })
            }
            if (!this.buttonThree) {
              this.series.forEach((el, index) => {
                if (el.name === '累计融资强平金额') {
                  this.series.splice(index, 1)
                }
              })
            }
            this.render(data)
          })
      },
      overlayDataDraw() {
        getIntradayChart(this.indexCode, this.startTime, this.overTime, this.beginDate)
          .then((res) => {
            let resp = res
            this.amplitudeObj = resp.amplitude
            if (this.amplitudeObj.amplitude > 0) {
              this.upColor = 'up'
            } else {
              this.upColor = 'down'
            }
            this.amplitudeObj.tim = moment(this.amplitudeObj.tim).format('YYYY-MM-DD dddd HH:mm')
            // 指数分时图数据
            let sseLastCloseData = resp.increase
            if (resp.chartName === '') {
              resp.chartName = '上证380'
            }
            let indexName = resp.secName
            let sseAmpliToday = resp.ampliToday
            let chartData = []
            let todayData = resp.chartData
            let timeList = []
            todayData.forEach((el, i) => {
              timeList.push(moment(el[0], 'HHmm').format('HH:mm'))
              chartData.push([i, el[1], el[2], el[3]]);
            })
            this.selectTime = timeList
            let mindata = resp.minPrice // 指标线最小值
            let maxdata = resp.maxPrice // 指标线最大值
            // 买卖量数据
            let buySaleData = resp.buySaleTrdqty
            let buyData = []
            let saleData = []
            buySaleData.forEach((el) => {
              buyData.push(el.buy_trdqty / 1000000)
              saleData.push(-el.sale_trdqty / 1000000)
            })
            // 叠加数据
            let overlayList = resp.overlying
            let rzjmData = [] // 融资净买入数据
            let rqjmData = [] // 融券净卖出数据
            let ljrzqpData = [] // 累计融资强平
            overlayList.forEach((el) => {
              if (el.rzjmre === null) {
                rzjmData.push(el.rzjmre)
              } else {
                rzjmData.push((el.rzjmre / 100000000).toFixed(3))
              }
              if (el.rqjmce === null) {
                rqjmData.push(el.rqjmce)
              } else {
                rqjmData.push((el.rqjmce / 100000000).toFixed(3))
              }
              if (el.ljrzqpje === null) {
                ljrzqpData.push(el.ljrzqpje)
              } else {
                ljrzqpData.push((el.ljrzqpje / 100000000).toFixed(3))
              }
            })
            this.rzjmObj.name = '融资净买入金额'
            this.rzjmObj.yAxis = {
              name: '金额(亿元)',
              nameTextStyle: {
                color: '#506798'
              },
              splitLine: {show: false},
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#506798'
              },
              axisLine: {
                show: false
              },
              type: 'value',
              position: 'left'
            }
            this.rzjmObj.series = {
              name: '融资净买入金额',
              type: 'line',
              data: rzjmData,
              smooth: true,
              yAxisIndex: 2,
              itemStyle: {
                normal: {
                  color: '#1de3c0',
                  lineStyle: {
                    color: '#1de3c0'
                  }
                }
              }
            }
            this.rqjmObj.name = '融券净卖出金额'
            this.rqjmObj.yAxis = {
              splitArea: {
                show: false
              },
              splitLine: {show: false},
              axisLabel: {
                color: '#506798',
                inside: true
              },
              axisLine: {
                show: false
              },
              type: 'value',
              zlevel: 1000,
              position: 'left'
            }
            this.rqjmObj.series = {
              name: '融券净卖出金额',
              type: 'line',
              data: rqjmData,
              smooth: true,
              yAxisIndex: 3,
              itemStyle: {
                normal: {
                  color: '#6969c9',
                  lineStyle: {
                    color: '#6969c9'
                  }
                }
              }
            }
            this.rzqpObj.name = '累计融资强平金额'
            this.rzqpObj.yAxis = {
              name: '金额(亿元)',
              nameTextStyle: {
                color: '#506798'
              },
              splitLine: {show: false},
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#506798',
                inside: true
              },
              axisLine: {
                show: false
              },
              type: 'value',
              zlevel: 1000,
              position: 'right'
            }
            this.rzqpObj.series = {
              name: '累计融资强平金额',
              type: 'line',
              data: ljrzqpData,
              smooth: true,
              yAxisIndex: 4,
              itemStyle: {
                normal: {
                  color: '#ff4c4c',
                  lineStyle: {
                    color: '#ff4c4c'
                  }
                }
              }
            }
            this.yAxis = [
              {
                name: '指数',
                nameTextStyle: {
                  color: '#506798'
                },
                nameLocation: 'middle',
                nameGap: 60,
                splitArea: {
                  show: false
                },
                axisLabel: {
                  color: '#506798',
                  formatter: function (params) {
                    return params.toFixed(2)
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#273757'
                  }
                },
                axisLine: {
                  show: false
                },
                position: 'right',
                min: mindata, // 最小
                tickInterval: sseLastCloseData, // 步长
                max: maxdata // 最大
              },
              {
                type: 'value',
                gridIndex: 1,
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {
                  color: '#506798'
                },
                axisLine: {
                  show: false
                }
              }
            ]
            this.series = [
              {
                name: '价格',
                type: 'line',
                data: chartData,
                smooth: true,
                yAxisIndex: 0
              },
              {
                name: '融资买入数量',
                type: 'bar',
                stack: '总量',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: buyData,
                itemStyle: {
                  color: this.gfnFormatSecurityColor(1),
                  normal: {
                    color: this.gfnFormatSecurityColor(1)
                  }
                }
              },
              {
                name: '融券卖出数量',
                type: 'bar',
                stack: '总量',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: saleData,
                itemStyle: {
                  color: this.gfnFormatSecurityColor(-1),
                  normal: {
                    color: this.gfnFormatSecurityColor(-1)
                  }
                }
              }
            ]
            this.yAxis.push(this.rzjmObj.yAxis)
            this.yAxis.push(this.rqjmObj.yAxis)
            this.yAxis.push(this.rzqpObj.yAxis)
            this.series.push(this.rzjmObj.series)
            this.series.push(this.rqjmObj.series)
            this.series.push(this.rzqpObj.series)
            // let data = {'yAxis': this.yAxis, 'series': this.series, 'timeList': timeList}
            if (!this.buttonOne) {
              this.series.forEach((el, index) => {
                if (el.name === '融资净买入金额') {
                  this.series.splice(index, 1)
                }
              })
            }
            if (!this.buttonTwo) {
              this.series.forEach((el, index) => {
                if (el.name === '融券净卖出金额') {
                  this.series.splice(index, 1)
                }
              })
            }
            if (!this.buttonThree) {
              this.series.forEach((el, index) => {
                if (el.name === '累计融资强平金额') {
                  this.series.splice(index, 1)
                }
              })
            }
            let myLine = document.getElementById('KCharts')
            let echart = echarts.init(myLine, this.gfnGetTheme())
            let option = echart.getOption()
            option.yAxis = this.yAxis
            option.xAxis[0].axisLabel = {
              color: '#506798',
              interval: 29
            };
            option.series = this.series
            echart.setOption(option)
          })
      },
      refeshKcharts() {
        // this.beginTime = ''
        // this.endTime = ''
        if (!this.beginDate) {
          this.beginDate = ''
        }
        getIntradayChart(this.indexCode, this.startTime, this.overTime, this.beginDate)
          .then((res) => {
            let resp = res
            this.amplitudeObj = resp.amplitude
            if (this.amplitudeObj.amplitude > 0) {
              this.upColor = 'up'
            } else {
              this.upColor = 'down'
            }
            this.amplitudeObj.tim = moment(this.amplitudeObj.tim).format('YYYY-MM-DD dddd HH:mm')
            // 指数分时图数据
            let sseLastCloseData = resp.increase
            if (resp.chartName === '') {
              resp.chartName = '上证380'
            }
            let indexName = resp.secName
            let sseAmpliToday = resp.ampliToday
            let chartData = []
            let todayData = resp.chartData
            let timeList = []
            todayData.forEach((el, i) => {
              timeList.push(moment(el[0], 'HHmm').format('HH:mm'))
              // chartData.push(el[1])
              chartData.push([i, el[1], el[2], el[3]]);
            })
            this.selectTime = timeList
            let mindata = resp.minPrice // 指标线最小值
            let maxdata = resp.maxPrice // 指标线最大值
            // 买卖量数据
            let buySaleData = resp.buySaleTrdqty
            let buyData = []
            let saleData = []
            buySaleData.forEach((el) => {
              if (el.buy_trdqty === null) {
                buyData.push(el.buy_trdqty)
              } else {
                buyData.push(el.buy_trdqty / 1000000)
              }
              if (el.sale_trdqty === null) {
                saleData.push(el.sale_trdqty)
              } else {
                saleData.push(-el.sale_trdqty / 1000000)
              }
            })
            // 叠加数据
            let overlayList = resp.overlying
            let rzjmData = [] // 融资净买入数据
            let rqjmData = [] // 融券净卖出数据
            let ljrzqpData = [] // 累计融资强平
            overlayList.forEach((el) => {
              if (el.rzjmre === null) {
                rzjmData.push(el.rzjmre)
              } else {
                rzjmData.push((el.rzjmre / 100000000).toFixed(3))
              }
              if (el.rqjmce === null) {
                rqjmData.push(el.rqjmce)
              } else {
                rqjmData.push((el.rqjmce / 100000000).toFixed(3))
              }
              if (el.ljrzqpje === null) {
                ljrzqpData.push(el.ljrzqpje)
              } else {
                ljrzqpData.push((el.ljrzqpje / 100000000).toFixed(3))
              }
            })
            this.rzjmObj.name = '融资净买入金额'
            this.rzjmObj.yAxis = {
              name: '金额(亿元)',
              nameTextStyle: {
                color: '#506798'
              },
              splitArea: {
                show: false
              },
              splitLine: {show: false},
              axisLabel: {
                color: '#506798'
              },
              axisLine: {
                show: false
              },
              type: 'value',
              position: 'left'
            }
            this.rzjmObj.series = {
              name: '融资净买入金额',
              type: 'line',
              data: rzjmData,
              smooth: true,
              yAxisIndex: 2,
              itemStyle: {
                normal: {
                  color: '#1de3c0',
                  lineStyle: {
                    color: '#1de3c0'
                  }
                }
              }
            }
            this.rqjmObj.name = '融券净卖出金额'
            this.rqjmObj.yAxis = {
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#506798',
                inside: true
              },
              splitLine: {show: false},
              axisLine: {
                show: false
              },
              type: 'value',
              zlevel: 1000,
              position: 'left'
            }
            this.rqjmObj.series = {
              name: '融券净卖出金额',
              type: 'line',
              data: rqjmData,
              smooth: true,
              yAxisIndex: 3,
              itemStyle: {
                normal: {
                  color: '#6969c9',
                  lineStyle: {
                    color: '#6969c9'
                  }
                }
              }
            }
            this.rzqpObj.name = '累计融资强平金额'
            this.rzqpObj.yAxis = {
              name: '金额(亿元)',
              nameTextStyle: {
                color: '#506798'
              },
              splitArea: {
                show: false
              },
              splitLine: {show: false},
              axisLabel: {
                color: '#506798',
                inside: true
              },
              axisLine: {
                show: false
              },
              type: 'value',
              zlevel: 1000,
              position: 'right'
            }
            this.rzqpObj.series = {
              name: '累计融资强平金额',
              type: 'line',
              data: ljrzqpData,
              smooth: true,
              yAxisIndex: 4,
              itemStyle: {
                normal: {
                  color: '#ff4c4c',
                  lineStyle: {
                    color: '#ff4c4c'
                  }
                }
              }
            }
            this.yAxis = [
              {
                name: '指数',
                nameTextStyle: {
                  color: '#506798'
                },
                nameLocation: 'middle',
                nameGap: 60,
                splitArea: {
                  show: false
                },
                axisLabel: {
                  color: '#506798',
                  formatter: function (params) {
                    return params.toFixed(2)
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#263657',
                    type: 'solid'
                  }
                },
                axisLine: {
                  show: false
                },
                position: 'right',
                min: mindata, // 最小
                tickInterval: sseLastCloseData, // 步长
                max: maxdata // 最大
              },
              {
                type: 'value',
                gridIndex: 1,
                splitNumber: 1,
                axisTick: {show: false},
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#263657',
                    type: 'solid'
                  }
                },
                axisLabel: {
                  color: '#506798',
                  formatter: '{value}万手'
                },
                axisLine: {
                  show: false
                }
              }
            ]
            this.series = [
              {
                name: '价格',
                type: 'line',
                data: chartData,
                smooth: true,
                yAxisIndex: 0
              },
              {
                name: '融资买入数量',
                type: 'bar',
                stack: '总量',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: buyData,
                itemStyle: {
                  color: this.gfnFormatSecurityColor(1),
                  normal: {
                    color: this.gfnFormatSecurityColor(1)
                  }
                }
              },
              {
                name: '融券卖出数量',
                type: 'bar',
                stack: '总量',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: saleData,
                itemStyle: {
                  color: this.gfnFormatSecurityColor(-1),
                  normal: {
                    color: this.gfnFormatSecurityColor(-1)
                  }
                }
              }
            ]
            this.yAxis.push(this.rzjmObj.yAxis)
            this.yAxis.push(this.rqjmObj.yAxis)
            this.yAxis.push(this.rzqpObj.yAxis)
            this.series.push(this.rzjmObj.series)
            this.series.push(this.rqjmObj.series)
            this.series.push(this.rzqpObj.series)
            if (!this.buttonOne) {
              this.series.forEach((el, index) => {
                if (el.name === '融资净买入金额') {
                  this.series.splice(index, 1)
                }
              })
            }
            if (!this.buttonTwo) {
              this.series.forEach((el, index) => {
                if (el.name === '融券净卖出金额') {
                  this.series.splice(index, 1)
                }
              })
            }
            if (!this.buttonThree) {
              this.series.forEach((el, index) => {
                if (el.name === '累计融资强平金额') {
                  this.series.splice(index, 1)
                }
              })
            }
            // let data = {'yAxis': this.yAxis, 'series': this.series, 'timeList': timeList}
            let myLine = document.getElementById('KCharts')
            let echart = echarts.init(myLine, this.gfnGetTheme())
            let option = echart.getOption()
            option.yAxis = this.yAxis
            option.xAxis[0].axisLabel = {
              color: '#506798',
              interval: 29
            };
            option.series = this.series
            echart.setOption(option)
          })
        this.timer = setTimeout(() => {
          this.refeshKcharts()
        }, this.timeInterval)
      },
      // 改变时间触发框选改变
      changeTimeChartBrush(DOMId) {
        let myLine = document.getElementById(DOMId)
        let echart = echarts.init(myLine, this.gfnGetTheme())
        this.selectTime.forEach((el, index) => {
          if (el == moment(this.beginTime, 'HH:mm:ss').format('HH:mm')) {
            this.rangeStart = index
          }
          if (el == moment(this.endTime, 'HH:mm:ss').format('HH:mm')) {
            this.rangeEnd = index
          }
        })
        let range = [this.rangeStart, this.rangeEnd]
        echart.dispatchAction({
          type: 'brush',
          areas: [
            {
              brushType: 'lineX',
              coordRange: range,
              xAxisIndex: 0
            }
          ]
        })
      },
      render(data) {
        let myLine = document.getElementById('KCharts')
        let echart = echarts.init(myLine, this.gfnGetTheme())
        echart.clear()
        window.onresize = echart.resize
        echart.setOption({
          title: {
            text: '注：底部柱状图代表买卖量，红色表示融资买入数量，绿色表示融券卖出数量，左外轴代表融资净买入（亿元），左内轴代表融券净卖出（亿元），右内轴代表累计融资强平（亿元），右外轴代表指数',
            left: '5%',
            bottom: '1%',
            textStyle: {
              color: '#506798',
              fontSize: 14,
              fontWeight: 200
            }
          },
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
            },
            position: function (pos, params, el, elRect, size) {
              if (pos[0] < size.viewSize[0] / 2) {
                return [pos[0] + 20, '36']
              }
              return [pos[0] - 220, '36']
            },
            formatter: function (params) {
              let texts = params[0].name + '<br/>'
              params.forEach((res) => {
                if (res.seriesName == '价格') {
                  if (!res.value[2]) {
                    texts = ''
                  } else {
                    params.forEach((el) => {
                      if (el.seriesType === 'bar') {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + Math.abs(el.value) + '万手 <br/>'
                        }
                      } else if (el.seriesName === '融资净买入金额' || el.seriesName === '融券净卖出金额' || el.seriesName === '累计融资强平金额') {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value + '亿元 <br/>'
                        }
                      } else {
                        if (!el.value[1]) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + el.value[1] + '<br/>'
                        }
                        if (!el.value[2]) {
                          texts += el.marker + '涨跌值:--<br/>'
                        } else {
                          texts += el.marker + '涨跌值:<i class=' + (el.value[2] > 0 ? 'up>' : 'down>') + el.value[2] + '</i><br/>'
                        }
                        if (!el.value[3]) {
                          texts += el.marker + '涨跌幅:--<br/>'
                        } else {
                          texts += el.marker + '涨跌幅:<i class=' + (el.value[3] > 0 ? 'up>' : 'down>') + el.value[3] + '%</i><br/>'
                        }
                      }
                    })
                  }
                }
              })
              return texts
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
              backgroundColor: '#777'
            }
          },
          toolbox: {
            top: 15,
            right: 120,
            feature: {
              dataZoom: {
                show: false,
                yAxisIndex: false,
                xAxisIndex: false
              },
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
            throttleDelay: 300,
            removeOnClick: true,
            brushMode: 'single',
            transformable: false,
            brushStyle: {
              color: 'rgba(255,255,255,0.03)',
              borderColor: '#455577',
              borderWidth: 1
            },
            outOfBrush: {
              colorAlpha: 0.1
            }
          },
          grid: [
            {
              left: '5%',
              right: '5%',
              height: '50%'
            },
            {
              left: '5%',
              right: '5%',
              top: '72%',
              height: '16%'
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: data.timeList,
              scale: true,
              boundaryGap: false,
              splitLine: {
                show: true,
                interval: 29,
                lineStyle: {
                  type: 'solid',
                  color: '#263657'
                }
              },
              axisPointer: {
                z: 100
              },
              axisLabel: {
                color: '#506798',
                interval: 29 // 横坐标间隔时间
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#455579'
                }
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              data: data.timeList,
              splitLine: {
                show: true,
                interval: 29,
                lineStyle: {
                  type: 'solid',
                  color: '#263657'
                }
              },
              scale: true,
              boundaryGap: false,
              axisLine: {show: false},
              axisTick: {show: false},
              axisLabel: {show: false}
            }
          ],
          yAxis: data.yAxis,
          series: data.series
        }, true)
        // 框选弹出框
        let that = this
        echart.on('brushSelected', function (val) {
          that.flag = true
          let timeData = val.batch[0].areas[0]
          if (timeData) {
            let range
            range = timeData.coordRange
            let startTime = range[0]
            let overTime = range[1]
            startTime = data.timeList[startTime]
            overTime = data.timeList[overTime]
            that.rangeStart = range[0]
            that.rangeEnd = range[1]
            // 同步时间选择器的时间
            that.beginTime = startTime
            that.endTime = overTime
            that.$emit('getTimeData', that.beginTime, that.endTime)
            if (startTime > '11:30:00') {
              that.modelClass = 'popboxLeft'
            } else {
              that.modelClass = 'popboxRight'
            }
            let paramsStartTime = startTime.split(':').join('').substr(0, 4)
            let paramsOverTime = overTime.split(':').join('').substr(0, 4)
            getRegionData(that.indexCode, paramsStartTime, paramsOverTime, that.trandat)
              .then((resp) => {
                resp.regionQuotationChart.buy_amount = (resp.regionQuotationChart.buy_amount / 10000).toFixed(3) + '万元'
                resp.regionQuotationChart.sale_amount = (resp.regionQuotationChart.sale_amount / 10000).toFixed(3) + '万元'
                resp.regionQuotationChart.margin_amount = (resp.regionQuotationChart.margin_amount / 10000).toFixed(3) + '万元'
                that.regionData = resp
                that.regionData.time = startTime + '-' + overTime
                that.modelShow = true
              })
          } else {
            that.flag = false
            that.modelShow = false
            that.beginTime = '09:30:00'
            that.endTime = '15:00:00'
            that.$emit('getTimeData', moment(that.beginTime, 'HH:mm:ss').format('HHmm'), moment(that.endTime, 'HH:mm:ss').format('HHmm'))
          }
        })
        echart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'single'
          }
        })
      }
    }
  }

</script>

<style lang='less'>
  .intraday {
    position: relative;
    .headWrap {
      line-height: 38px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > div {
        height: 38px;
        margin: 0 10px;
      }
      .indexcode {
        position: relative;
        .moreCheck {
          position: absolute;
        }
      }
      .date {
        .el-row {
          margin: 0;
        }
      }
    ;
    }
  }

  .intraday {
    .el-card__body {
      padding: 0px !important;
    }
  }

  .intraday .up {
    color: #ff402b
  }

  .intraday .down {
    color: #12bba5
  }

  .intraday .popboxLeft {
    position: absolute;
    border-radius: 4px;
    top: 60px;
    left: 15%;
    width: 400px;
    height: 200px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
    .wrap {
      display: flex;
      justify-content: space-around;
    }
  }

  .intraday .popboxRight {
    position: absolute;
    border-radius: 4px;
    top: 60px;
    right: 15%;
    width: 400px;
    height: 200px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
    .wrap {
      display: flex;
      justify-content: space-around;
    }
  }

  .el-tab-pane .moreCheck .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #5a5e66;
  }

  .intraday .headWrap .multiply {
    .buttonOne {
      background-color: #263e69 !important;
      color: #aec0e6 !important;
    }
    .buttonTwo {
      background-color: #263e69 !important;
      color: #aec0e6 !important;
    }
    .buttonThree {
      background-color: #263e69 !important;
      color: #aec0e6 !important;
    }
    .el-button {
      background-color: rgba(38, 62, 105, 0.4);
      color: #5b6a8b;
      border: none;
    }
    .green {
      width: 10px;
      height: 10px;
      background-color: #1de3c0;
      display: inline-block;
      position: relative;
      top: 1px;
      left: -2px;
    }
    .violet {
      width: 10px;
      height: 10px;
      background-color: #6969c9;
      display: inline-block;
      position: relative;
      top: 1px;
      left: -2px;
    }
    .pink {
      width: 10px;
      height: 10px;
      background-color: #ff4c4c;
      display: inline-block;
      position: relative;
      top: 1px;
      left: -2px;
    }
  }

</style>
