<template>
  <div class='dealChart'>
    <div class='headWrap'>
      <div class='indexcode'>
        指数
        <el-select v-model='value' size='mini' @change='getIndexCode'>
          <el-option
            v-for='item in options'
            :key='item.value'
            :label='item.label'
            :value='item.value'
          >
          </el-option>
        </el-select>
      </div>
      <div class='date'>
        <el-row>
          <el-col :span='4' style='text-align: center'>
            <!--<span style='color:red;position:relative;top:2px'>*</span>-->
            <span>起止时间</span>
          </el-col>
          <el-col :span='7'>
            <el-time-picker
              editable
              clearable
              v-model='beginTime'
              placeholder='开始时间'
              value-format='HH:mm'
              @change='getstarttime'
              :picker-options='{
                selectableRange:"09:30:00 - 15:00:00"
              }'
              size='mini'
              style='width:100%'>
            </el-time-picker>
          </el-col>
          <el-col :span='2' style='text-align: center'>至</el-col>
          <el-col :span='7' class='spacing'>
            <el-time-picker
              editable
              clearable
              v-model='endTime'
              type='date'
              placeholder='结束时间'
              value-format='HH:mm'
              @change='getendtime'
              :picker-options='{
                selectableRange:"09:30:00 - 15:00:00"
              }'
              size='mini'
              style='width:100%'>
            </el-time-picker>
          </el-col>
        </el-row>
      </div>
      <div class='time' style='margin-left: -50px'>
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
              @change='getstartDate'
              :picker-options='pickerOptions'
              size='mini'
              style='width:100%'>
            </el-date-picker>
          </el-col>
        </el-row>
      </div>
      <div class='multiply'>
        <span>叠加对象：</span>
        <el-button type='primary' :class='buttonOne' size='mini' @click='accumulate'>
          <div class='green'></div>
          累计净买入金额
        </el-button>
        <el-button type='primary' :class='buttonTwo' size='mini' @click='voluntary'>
          <div class='violet'></div>
          主动净买入金额
        </el-button>
      </div>
    </div>
    <div style='position: relative;top: 45px;font-size:12px;left: 15%'>
      昨：<span>{{amplitudeObj.yesterdayPrice}}元  </span>
      现：<span :class='upColor'>{{amplitudeObj.nowPrice}}元  </span>
      涨跌：<span :class='upColor'>{{amplitudeObj.amplitude}}  </span>
      涨跌幅：<span :class='upColor'>{{amplitudeObj.amplitudePrp}}%  </span>
      <span>{{amplitudeObj.tim}}</span>
    </div>
    <div id='doubleBar' style='width:1640px;height:400px'></div>
    <div :class='modelClass' v-show='modelShow'>
      <div>
        <p style='margin: 10px 30px 5px;font-weight: 700'>
          <span>起始时刻:</span>
          <span>{{selectObj.time}}</span>
        </p>
      </div>
      <div class='wrap'>
        <div class='left'>
          <p>
            <span>买入金额:</span>
            <span>{{selectObj.buy}}</span>
          </p>
          <p>
            <span>卖出金额:</span>
            <span>{{selectObj.sell}}</span>
          </p>
          <p>
            <span>净买入金额:</span>
            <span>{{selectObj.net_buy}}</span>
          </p>
          <p>
            <span>买入金额占比:</span>
            <span>{{selectObj.buy_prop}}%</span>
          </p>
          <p>
            <span>卖出金额占比:</span>
            <span>{{selectObj.sell_prop}}%</span>
          </p>
        </div>
        <div class='right'>
          <p>
            <span>申报买入笔数:</span>
            <span>{{selectObj.b_num}}</span>
          </p>
          <p>
            <span>申报买入笔数占比:</span>
            <span>{{selectObj.mbuy_prop}}%</span>
          </p>
          <p>
            <span>申报卖出笔数:</span>
            <span>{{selectObj.s_num}}</span>
          </p>
          <p>
            <span>申报卖出笔数占比:</span>
            <span>{{selectObj.msell_prop}}%</span>
          </p>
          <p>
            <span>撤单笔数:</span>
            <span>{{selectObj.odrw_mval}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import {postRoutinizationDealChart, postSelectData} from '../../../../service/marketSupervise/index'
  import {getCurTradeDate} from '../../../../service/common/commonFunc'

  var echarts = require('echarts');
  export default {
    name: 'deal-charts',
    data() {
      return {
        amplitudeObj: {
          'yesterdayPrice': '',
          'nowPrice': '',
          'amplitudePrp': '',
          'amplitude': '',
          'tim': ''
        },
        upColor: 'down',
        buttonOne: '',
        buttonTwo: '',
        beginDate: '',
        beginTime: '09:30:00',
        endTime: '15:00:00',
        isshow: false,
        range: [],
        time: [],
        modelClass: 'popboxLeft',
        modelShow: false,
        radio: '000001',
        value: '000001',
        options: [
          {value: '000001', label: '上证综指'},
          {value: '000016', label: '上证50'},
          {value: '000010', label: '上证180'},
          {value: '000009', label: '上证380'}
        ],
        selectTime: [],
        indexCode: '000001',
        overlays: '', // 叠加类别
        trdDate: '',
        selectObj: {
          'time': '',
          'sell_prop': '', // 买入金额占比
          'odrw_mval': '', // 撤单笔数
          'mbuy_prop': '', // 申报买入笔数占比
          'msell_prop': '', // 申报卖出笔数占比
          'net_buy': '', // 净买入金额
          'buy': '', // 买入金额
          'sell': '', // 卖出金额
          'b_num': '', // 申报买入笔数
          'buy_prop': '', // 卖出金额占比
          's_num': '' // 申报卖出笔数
        },
        rangeStart: '',
        rangeEnd: '',
        flag: false, // 是否主动触发了框选
        dealTimer: null,
        timeInterval: 60 * 1000,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        }
      }
    },
    mounted() {
      this.getDate()
      this.getDataDraw()
      setTimeout(() => {
        this.refeshDataDraw()
      }, 50)
    },
    // 切换页面时清除定时器
    beforeDestroy() {
      clearTimeout(this.dealTimer)
    },
    methods: {
      // 获取当前交易日
      getDate() {
        getCurTradeDate().then(resp => {
          this.beginDate = resp
          this.trdDate = resp
          this.$emit('getDealDate', resp)
        })
      },
      // 获取指数代码
      getIndexCode(val) {
        this.indexCode = val
        this.overlayDataDraw()
      },
      getstarttime(val) {
        // if (this.flag) {
        // this.selectTime.forEach((el, index) => {
        //   if (el == val) {
        //     this.rangeStart = index
        //   }
        // })
        if (!val) {
          this.beginTime = '09:30:00'
        }
        this.changeTimeChartBrush('doubleBar')
        // }
      },
      getendtime(val) {
        // if (this.flag) {
        // this.selectTime.forEach((el, index) => {
        //   if (el == val) {
        //     this.rangeEnd = index
        //   }
        // })
        if (!val) {
          this.endTime = '15:00:00'
        }
        this.changeTimeChartBrush('doubleBar')
        // }
      },
      getstartDate(val) {
        if (val) {
          this.trdDate = val.split('-').join('')
        } else {
          this.trdDate = ''
        }
        this.$emit('getDealDate', this.trdDate)
        this.overlayDataDraw()
      },
      // 叠加累计净买入
      accumulate() {
        this.timeList = []
        if (this.buttonOne == '') {
          this.buttonOne = 'buttonOne'
          if (this.overlays == 'voluntary') {
            this.overlays = 'voluntary,accumulate'
          } else {
            this.overlays = 'accumulate'
          }
          this.getDataDraw()
        } else {
          this.buttonOne = ''
          if (this.overlays == 'voluntary,accumulate') {
            this.overlays = 'voluntary'
          } else {
            this.overlays = ''
          }
          this.getDataDraw()
        }
      },
      // 叠加主动净买入
      voluntary() {
        this.timeList = []
        if (this.buttonTwo == '') {
          this.buttonTwo = 'buttonTwo'
          if (this.overlays == 'accumulate') {
            this.overlays = 'voluntary,accumulate'
          } else {
            this.overlays = 'voluntary'
          }
          this.getDataDraw()
        } else {
          this.buttonTwo = ''
          if (this.overlays == 'voluntary,accumulate') {
            this.overlays = 'accumulate'
          } else {
            this.overlays = ''
          }
          this.getDataDraw()
        }
      },
      // 请求数据画图
      getDataDraw() {
        this.modelShow = false
        // this.beginTime = ''
        // this.endTime = ''
        let params = {
          indexCodes: this.indexCode,
          overlays: this.overlays,
          startTime: '',
          endTime: '',
          trdDate: this.trdDate
        }
        postRoutinizationDealChart(params)
          .then((res) => {
            let resp = res
            this.amplitudeObj = resp.amplitude[0]
            if (this.amplitudeObj.amplitude > 0) {
              this.upColor = 'up'
            } else {
              this.upColor = 'down'
            }
            this.amplitudeObj.tim = moment(this.amplitudeObj.tim).format('YYYY-MM-DD dddd HH:mm')
            // 指数数据
            let indexData = resp.indexs[0]
            if (indexData.chartName == '') {
              indexData.chartName = '上证380'
            }
            let indexName = indexData.secName // 指数名称
            let mindata = indexData.minPrice // 指标线最小值
            let maxdata = indexData.maxPrice // 指标线最大值
            let increase = indexData.increase // 增幅
            let timeList = []
            let chartData = []
            indexData.chartData.forEach((el, i) => {
              timeList.push(moment(el[0], 'HHmm').format('HH:mm'))
              chartData.push([i, el[1], el[2], el[3]]);
            })
            this.selectTime = timeList
            let indexSeries = {
              name: '价格',
              type: 'line',
              data: chartData,
              smooth: true
            }
            // 交易占比柱状图数据
            let propData = resp.prop
            let buyPropData = []
            let salePropData = []
            propData.data.forEach((el) => {
              buyPropData.push(el.bPropValue)
              salePropData.push(-(el.sPropValue))
            })
            let buySeriesData = {
              name: '买入金额占比',
              type: 'bar',
              stack: '总量',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: buyPropData,
              itemStyle: {
                normal: {
                  color: this.gfnFormatSecurityColor(1)
                }
              }
            }
            let saleSeriesData = {
              name: '卖出金额占比',
              type: 'bar',
              stack: '总量',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: salePropData,
              itemStyle: {
                normal: {
                  color: this.gfnFormatSecurityColor(-1)
                }
              }
            }
            // y轴坐标
            let yAxis = [
              {
                name: '指数',
                nameTextStyle: {
                  color: '#506798'
                },
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
                    color: '#263657'
                  }
                },
                axisLine: {
                  show: false
                },
                position: 'right',
                min: mindata,
                tickInterval: increase,
                max: maxdata
              },
              {
                type: 'value',
                gridIndex: 1,
                axisTick: {show: false},
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#263657'
                  }
                },
                splitNumber: 2,
                axisLabel: {
                  color: '#506798'
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#334164'
                  }
                }
              },
              {
                name: '金额(亿元)',
                nameTextStyle: {
                  color: '#506798'
                },
                splitArea: {
                  show: false
                },
                axisLabel: {
                  color: '#506798'
                },
                splitLine: {
                  show: false
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#334164'
                  }
                },
                position: 'left'
              },
              {
                splitArea: {
                  show: false
                },
                axisLabel: {
                  color: '#506798',
                  inside: true
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#334164'
                  }
                },
                splitLine: {
                  show: false
                },
                position: 'left',
                zlevel: 1000
              }
            ]
            // series数据
            let seriesData = [indexSeries, buySeriesData, saleSeriesData]
            // 累计净买入
            let accumulate = resp.accumulate
            if (accumulate) {
              let accumulateName = accumulate.chartName
              let accumulateData = []
              accumulate.data.forEach((el) => {
                if (el.value === null) {
                  accumulateData.push(el.value)
                } else {
                  accumulateData.push((el.value / 100000000).toFixed(3))
                }
              })
              let accumulateSeries = {
                name: accumulateName,
                type: 'line',
                data: accumulateData,
                smooth: true,
                yAxisIndex: 2,
                itemStyle: {
                  normal: {
                    color: '#1de3c0'
                  }
                }
              }
              seriesData.push(accumulateSeries)
            }
            // 主动净买入
            let voluntary = resp.voluntary
            if (voluntary) {
              let voluntaryName = voluntary.chartName
              let voluntaryData = []
              voluntary.data.forEach((el) => {
                if (el.value === null) {
                  voluntaryData.push(el.value)
                } else {
                  voluntaryData.push((el.value / 100000000).toFixed(3))
                }
              })
              let voluntarySeries = {
                name: voluntaryName,
                type: 'line',
                data: voluntaryData,
                smooth: true,
                yAxisIndex: 3,
                itemStyle: {
                  normal: {
                    color: '#6969c9'
                  }
                }
              }
              seriesData.push(voluntarySeries)
            }
            let dataList = {timeList: timeList, yAxis: yAxis, series: seriesData}
            this.render(dataList)
          })
      },
      overlayDataDraw() {
        let params = {
          indexCodes: this.indexCode,
          overlays: this.overlays,
          startTime: '',
          endTime: '',
          trdDate: this.trdDate
        }
        postRoutinizationDealChart(params)
          .then((res) => {
            let resp = res
            this.amplitudeObj = resp.amplitude[0]
            if (this.amplitudeObj.amplitude > 0) {
              this.upColor = 'up'
            } else {
              this.upColor = 'down'
            }
            this.amplitudeObj.tim = moment(this.amplitudeObj.tim).format('YYYY-MM-DD dddd HH:mm')
            // 指数数据
            let indexData = resp.indexs[0]
            if (indexData.chartName == '') {
              indexData.chartName = '上证380'
            }
            let indexName = indexData.secName
            let mindata = indexData.minPrice // 指标线最小值
            let maxdata = indexData.maxPrice // 指标线最大值
            let increase = indexData.increase // 增幅
            let timeList = []
            let chartData = []
            indexData.chartData.forEach((el, i) => {
              timeList.push(moment(el[0], 'HHmm').format('HH:mm'))
              chartData.push([i, el[1], el[2], el[3]]);
            })
            this.selectTime = timeList
            let indexSeries = {
              name: '价格',
              type: 'line',
              data: chartData,
              smooth: true
            }
            // 交易占比柱状图数据
            let propData = resp.prop
            let buyPropData = []
            let salePropData = []
            propData.data.forEach((el) => {
              buyPropData.push(el.bPropValue)
              salePropData.push(-(el.sPropValue))
            })
            let buySeriesData = {
              name: '买入金额占比',
              type: 'bar',
              stack: '总量',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: buyPropData,
              itemStyle: {
                normal: {
                  color: this.gfnFormatSecurityColor(1)
                }
              }
            }
            let saleSeriesData = {
              name: '卖出金额占比',
              type: 'bar',
              stack: '总量',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: salePropData,
              itemStyle: {
                normal: {
                  color: this.gfnFormatSecurityColor(-1)
                }
              }
            }
            // y轴坐标
            let yAxis = [
              {
                name: '指数',
                nameTextStyle: {
                  color: '#506798'
                },
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
                    color: '#263657'
                  }
                },
                axisLine: {
                  show: false
                },
                position: 'right',
                min: mindata,
                tickInterval: increase,
                max: maxdata
              },
              {
                type: 'value',
                gridIndex: 1,
                axisTick: {show: false},
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#263657'
                  }
                },
                splitNumber: 2,
                axisLabel: {
                  color: '#506798'
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#334164'
                  }
                }
              },
              {
                name: '金额(亿元)',
                nameTextStyle: {
                  color: '#506798'
                },
                splitArea: {
                  show: false
                },
                axisLabel: {
                  color: '#506798'
                },
                splitLine: {
                  show: false
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#334164'
                  }
                },
                position: 'left'
              },
              {
                splitArea: {
                  show: false
                },
                axisLabel: {
                  color: '#506798',
                  inside: true
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#334164'
                  }
                },
                splitLine: {
                  show: false
                },
                position: 'left',
                zlevel: 1000
              }
            ]
            // series数据
            let seriesData = [indexSeries, buySeriesData, saleSeriesData]
            // 累计净买入
            let accumulate = resp.accumulate
            if (accumulate) {
              let accumulateName = accumulate.chartName
              let accumulateData = []
              accumulate.data.forEach((el) => {
                if (el.value === null) {
                  accumulateData.push(el.value)
                } else {
                  accumulateData.push((el.value / 100000000).toFixed(3))
                }
              })
              let accumulateSeries = {
                name: accumulateName,
                type: 'line',
                data: accumulateData,
                smooth: true,
                yAxisIndex: 2,
                itemStyle: {
                  normal: {
                    color: '#1de3c0'
                  }
                }
              }
              seriesData.push(accumulateSeries)
            }
            // 主动净买入
            let voluntary = resp.voluntary
            if (voluntary) {
              let voluntaryName = voluntary.chartName
              let voluntaryData = []
              voluntary.data.forEach((el) => {
                if (el.value === null) {
                  voluntaryData.push(el.value)
                } else {
                  voluntaryData.push((el.value / 100000000).toFixed(3))
                }
              })
              let voluntarySeries = {
                name: voluntaryName,
                type: 'line',
                data: voluntaryData,
                smooth: true,
                yAxisIndex: 3,
                itemStyle: {
                  normal: {
                    color: '#6969c9'
                  }
                }
              }
              seriesData.push(voluntarySeries)
            }
            let myLine = document.getElementById('doubleBar');
            let echart = echarts.init(myLine);
            let option = echart.getOption()
            option.yAxis = yAxis
            option.series = seriesData
            option.xAxis[0].data = timeList
            option.xAxis[1].data = timeList
            echart.setOption(option)
          })
      },
      // 刷新分时图
      refeshDataDraw() {
        // this.beginTime = ''
        // this.endTime = ''
        let params = {
          indexCodes: this.indexCode,
          overlays: this.overlays,
          startTime: '',
          endTime: '',
          trdDate: this.trdDate
        }
        postRoutinizationDealChart(params)
          .then((res) => {
            let resp = res
            this.amplitudeObj = resp.amplitude[0]
            if (this.amplitudeObj.amplitude > 0) {
              this.upColor = 'up'
            } else {
              this.upColor = 'down'
            }
            this.amplitudeObj.tim = moment(this.amplitudeObj.tim).format('YYYY-MM-DD dddd HH:mm')
            // 指数数据
            let indexData = resp.indexs[0]
            if (indexData.chartName == '') {
              indexData.chartName = '上证380'
            }
            let indexName = indexData.secName
            let mindata = indexData.minPrice // 指标线最小值
            let maxdata = indexData.maxPrice // 指标线最大值
            let increase = indexData.increase // 增幅
            let timeList = []
            let chartData = []
            indexData.chartData.forEach((el, i) => {
              timeList.push(moment(el[0], 'HHmm').format('HH:mm'))
              chartData.push([i, el[1], el[2], el[3]]);
            })
            this.selectTime = timeList
            let indexSeries = {
              name: '价格',
              type: 'line',
              data: chartData,
              smooth: true
            }
            // 交易占比柱状图数据
            let propData = resp.prop
            let buyPropData = []
            let salePropData = []
            propData.data.forEach((el) => {
              buyPropData.push(el.bPropValue)
              salePropData.push(-(el.sPropValue))
            })
            let buySeriesData = {
              name: '买入金额占比',
              type: 'bar',
              stack: '总量',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: buyPropData,
              itemStyle: {
                normal: {
                  color: this.gfnFormatSecurityColor(1)
                }
              }
            }
            let saleSeriesData = {
              name: '卖出金额占比',
              type: 'bar',
              stack: '总量',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: salePropData,
              itemStyle: {
                normal: {
                  color: this.gfnFormatSecurityColor(-1)
                }
              }
            }
            // y轴坐标
            let yAxis = [
              {
                name: '指数',
                nameTextStyle: {
                  color: '#506798'
                },
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
                  show: false,
                  lineStyle: {
                    color: '#455579'
                  }
                },
                position: 'right',
                min: mindata,
                tickInterval: increase,
                max: maxdata
              },
              {
                type: 'value',
                gridIndex: 1,
                axisTick: {show: false},
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#263657',
                    type: 'solid'
                  }
                },
                splitNumber: 2,
                axisLabel: {
                  color: '#506798'
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#455579'
                  }
                }
              },
              {
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
                  show: false,
                  lineStyle: {
                    color: '#455579'
                  }
                },
                position: 'left'
              },
              {
                splitArea: {
                  show: false
                },
                splitLine: {show: false},
                axisLabel: {
                  color: '#506798',
                  inside: true
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#455579'
                  }
                },
                position: 'left',
                zlevel: 1000
              }
            ]
            // series数据
            let seriesData = [indexSeries, buySeriesData, saleSeriesData]
            // 累计净买入
            let accumulate = resp.accumulate
            if (accumulate) {
              let accumulateName = accumulate.chartName
              let accumulateData = []
              accumulate.data.forEach((el) => {
                if (el.value === null) {
                  accumulateData.push(el.value)
                } else {
                  accumulateData.push((el.value / 100000000).toFixed(3))
                }
              })
              let accumulateSeries = {
                name: accumulateName,
                type: 'line',
                data: accumulateData,
                smooth: true,
                yAxisIndex: 2,
                itemStyle: {
                  normal: {
                    color: '#1de3c0'
                  }
                }
              }
              seriesData.push(accumulateSeries)
            }
            // 主动净买入
            let voluntary = resp.voluntary
            if (voluntary) {
              let voluntaryName = voluntary.chartName
              let voluntaryData = []
              voluntary.data.forEach((el) => {
                if (el.value === null) {
                  voluntaryData.push(el.value)
                } else {
                  voluntaryData.push((el.value / 100000000).toFixed(3))
                }
              })
              let voluntarySeries = {
                name: voluntaryName,
                type: 'line',
                data: voluntaryData,
                smooth: true,
                yAxisIndex: 3,
                itemStyle: {
                  normal: {
                    color: '#6969c9'
                  }
                }
              }
              seriesData.push(voluntarySeries)
            }
            // let dataList = {timeList: timeList, yAxis: yAxis, series: seriesData}
            let myLine = document.getElementById('doubleBar');
            let echart = echarts.init(myLine);
            let option = echart.getOption()
            option.yAxis = yAxis
            option.series = seriesData
            option.xAxis[0].data = timeList
            option.xAxis[1].data = timeList
            echart.setOption(option)
          })
        this.dealTimer = setTimeout(() => {
          this.refeshDataDraw()
        }, this.timeInterval)
      },
      render(dataList) {
        let myLine = document.getElementById('doubleBar');
        let echart = echarts.init(myLine, this.gfnGetTheme());
        echart.clear()
        window.onresize = echart.resize;
        echart.setOption({
          title: {
            text: '注：底部柱状图代表程序化交易全市场的买入卖出金额占比，与指数无关，红色代表买入金额占比，绿色表示卖出金额占比，左外轴代表累计净买入（亿元），左内轴代表主动净买入（亿元），右外轴代表指数',
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
                return [pos[0] + 20, '60']
              }
              return [pos[0] - 220, '60']
            },
            formatter: function (params) {
              let texts = params[0].name + '<br/>'
              params.forEach((res) => {
                if (res.seriesName == '价格') {
                  if (!res.value[2]) {
                    texts = ''
                  } else {
                    params.forEach((el) => {
                      if (el.seriesType == 'bar') {
                        if (!el.value) {
                          texts += el.marker + el.seriesName + ':' + '--<br/>'
                        } else {
                          texts += el.marker + el.seriesName + ':' + Math.abs(el.value) + '% <br/>'
                        }
                      } else {
                        if (el.seriesName == '累计净买入金额' || el.seriesName == '主动净买入金额') {
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
                      }
                    })
                  }
                }
              })
              return texts
            }
          },
          axisPointer: {
            link: {
              xAxisIndex: 'all'
            },
            label: {
              backgroundColor: '#777'
            }
          },
          toolbox: {
            top: 15,
            right: '7%',
            feature:
              {
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
            throttleType: 'debounce',
            throttleDelay: 300,
            removeOnClick: true,
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
              data: dataList.timeList,
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
              splitNumber: 20,
              axisPointer: {
                z: 100
              },
              axisLabel: {
                color: '#506798',
                interval: 29
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
              data: dataList.timeList,
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
              axisLine: {show: false},
              axisTick: {show: false},
              axisLabel: {show: false},
              splitNumber: 20
            }
          ],
          yAxis: dataList.yAxis,
          series: dataList.series
        }, true);
        // 框选弹出框
        var that = this
        echart.on('brushSelected', function (val) {
          that.flag = true
          var timeData = val.batch[0].areas[0]
          if (timeData) {
            let range
            range = timeData.coordRange
            let startTime = range[0]
            let endTime = range[1]
            startTime = dataList.timeList[startTime]
            endTime = dataList.timeList[endTime]
            // 联动时间选择框
            that.beginTime = startTime
            that.endTime = endTime
            that.rangeStart = range[0]
            that.rangeEnd = range[1]
            that.$emit('getDealTime', that.beginTime, that.endTime)
            if (startTime > '11:30') {
              that.modelClass = 'popboxLeft'
            } else {
              that.modelClass = 'popboxRight'
            }
            let paramsStartTime = startTime.split(':').join('').substr(0, 4)
            let paramsOverTime = endTime.split(':').join('').substr(0, 4)
            let params = {
              trdDate: that.trdDate,
              startTime: paramsStartTime,
              endTime: paramsOverTime
            }
            postSelectData(params).then((resp) => {
              resp.selected[0].buy = (resp.selected[0].buy / 100000000).toFixed(3) + '亿元'
              resp.selected[0].sell = (resp.selected[0].sell / 100000000).toFixed(3) + '亿元'
              resp.selected[0].net_buy = (resp.selected[0].net_buy / 100000000).toFixed(3) + '亿元'
              that.selectObj = resp.selected[0]
              that.selectObj.time = startTime + '-' + endTime
              that.modelShow = true
            })
          } else {
            that.flag = false
            that.modelShow = false
            that.beginTime = '09:30:00'
            that.endTime = '15:00:00'
            that.$emit('getDealTime', moment(that.beginTime, 'HH:mm:ss').format('HHmm'), moment(that.endTime, 'HH:mm:ss').format('HHmm'), that.trdDate)
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
      },
      // 改变时间触发框选改变
      changeTimeChartBrush(DOMId) {
        let myLine = document.getElementById(DOMId);
        let echart = echarts.init(myLine, this.gfnGetTheme());
        this.selectTime.forEach((el, index) => {
          if (el == moment(this.beginTime, 'HH:mm:ss').format('HH:mm')) {
            this.rangeStart = index
          }
          if (el == moment(this.endTime, 'HH:mm:ss').format('HH:mm')) {
            this.rangeEnd = index
          }
        })
        let range = [this.rangeStart, this.rangeEnd];
        echart.dispatchAction({
          type: 'brush',
          areas: [
            {
              brushType: 'lineX',
              coordRange: range,
              xAxisIndex: 0
            }
          ]
        });
      }
    }
  }
</script>

<style lang='less'>
  .dealChart {
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
      .date {
        .el-row {
          margin: 0px;
        }
      }
    ;
    }
  }

  .dealChart .popboxLeft {
    position: absolute;
    border-radius: 4px;
    top: 110px;
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

  .dealChart .popboxRight {
    position: absolute;
    border-radius: 4px;
    top: 110px;
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

  .dealChart .headWrap .multiply {
    .el-button {
      background-color: transparent;
    }
    .buttonOne {
      background-color: #263e69 !important;
      color: #aec0e6 !important;
    }
    .buttonTwo {
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
  }

  .dealChart .up {
    color: #ff402b
  }

  .dealChart .down {
    color: #12bba5
  }
</style>
