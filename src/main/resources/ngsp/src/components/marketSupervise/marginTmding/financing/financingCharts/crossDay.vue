<template>
  <el-card class='crossday' style='margin-top: 0px'>
    <div slot='header' class='clearfix'>
      指数行情监测
    </div>
    <el-row class='headWrap'>
      <el-col :span='3.5'>
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
      </el-col>
      <el-col :span='6' class='date'>
        <el-col :span='4' style='text-align: center'>
          <span>日期设置</span>
        </el-col>
        <el-col :span='20'>
          <el-date-picker
            v-model='dateValue'
            type='daterange'
            range-separator='至'
            start-placeholder='开始日期'
            end-placeholder='结束日期'
            value-format='yyyy-MM-dd'
            @change='getstartDate'
            :picker-options='pickerOptions'
            size='mini'
            style='width:100%'>
          </el-date-picker>
        </el-col>
      </el-col>
      <el-col :span='6'>
        <div class='multiply'>
          <span>叠加对象：</span>
          <el-button type='primary' :class='buttonOne' size='mini' @click='togglesecurity'>
            <div class='orange'></div>
            融券余额
          </el-button>
          <el-button type='primary' :class='buttonTwo' size='mini' @click='togglefinancing'>
            <div class='skyBlue'></div>
            融资余额
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div id='line-bar' style='width:1600px;height:400px'></div>
  </el-card>
</template>

<script>
  import echarts from 'echarts'
  import moment from 'moment';
  import {getCrossChart} from '../../../../../service/marketSupervise/index'

  export default {
    name: 'cross-day',
    data() {
      return {
        buttonOne: 'buttonOne',
        buttonTwo: 'buttonTwo',
        radio: '000001',
        chartsData: {},
        financingData: [],
        securityData: [],
        value: '000001',
        options: [
          {value: '000001', label: '上证综指'},
          {value: '000016', label: '上证50'},
          {value: '000010', label: '上证180'},
          {value: '000009', label: '上证380'}
        ],
        timeList: [],
        startDate: '',
        overDate: '',
        indexCode: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        dateValue: ''
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      // 开始时间
      getstartDate(val) {
        if (val) {
          this.startDate = val[0].split('-').join('')
          this.overDate = val[1].split('-').join('')
          if (this.startDate && this.overDate) {
            this.getData()
          }
        } else {
          this.startDate = ''
          this.overDate = ''
        }
      },
      // 指数代码
      getIndexCode(val) {
        this.indexCode = val
        this.getData()
      },
      // 叠加融资
      togglefinancing() {
        if (!this.buttonTwo) {
          this.buttonTwo = 'buttonTwo'
          this.chartsData.seriesData.push(this.financingData.series)
        } else {
          this.buttonTwo = ''
          this.chartsData.seriesData.forEach((el, index) => {
            if (el.name == '融资余额') {
              this.chartsData.seriesData.splice(index, 1)
            }
          })
        }
        this.drawBarChart('line-bar', this.chartsData)
      },

      // 叠加融券
      togglesecurity() {
        if (!this.buttonOne) {
          this.buttonOne = 'buttonOne'
          this.chartsData.seriesData.push(this.securityData.series)
        } else {
          this.buttonOne = ''
          this.chartsData.seriesData.forEach((el, index) => {
            if (el.name == '融券余额') {
              this.chartsData.seriesData.splice(index, 1)
            }
          })
        }
        this.drawBarChart('line-bar', this.chartsData)
      },
      // 请求数据画图
      getData() {
        getCrossChart(this.indexCode, this.startDate, this.overDate)
          .then((resp) => {
            let indexName = ''
            this.options.forEach((el, i) => {
              if (el.value == this.value) {
                indexName = this.options[i].label
              }
            })
            let data = resp
            let timeArr = []
            let indexData = []
            let rzyeData = []
            let rqyeData = []
            data.index.forEach((el) => {
              timeArr.push(moment(el.tod).format('YYYY-MM-DD'))
              indexData.push(el.s8)
            })
            data.balance.forEach((el) => {
              rzyeData.push(el.rzye / 100000000)
              rqyeData.push(el.rqye / 100000000)
            })
            this.financingData = {
              legend: '融资余额',
              series: {
                name: '融资余额',
                type: 'bar',
                barGap: 0,
                data: rzyeData,
                itemStyle: {
                  normal: {
                    color: '#2a7efb'
                  }
                },
                yAxisIndex: 1
              }
            }
            this.securityData = {
              legend: '融券余额',
              series: {
                name: '融券余额',
                type: 'bar',
                barGap: 0,
                data: rqyeData,
                itemStyle: {
                  normal: {
                    color: '#ff7836'
                  }
                },
                yAxisIndex: 2
              }
            }
            this.chartsData = {
              yAxis: [
                {
                  name: '指数',
                  nameTextStyle: {
                    color: '#506798'
                  },
                  type: 'value',
                  scale: true,
                  position: 'right',
                  axisLabel: {
                    color: '#506798'
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#273757'
                    }
                  }
                },
                {
                  name: '金额(亿元)',
                  nameTextStyle: {
                    color: '#506798'
                  },
                  show: true,
                  type: 'value',
                  position: 'left',
                  axisLabel: {
                    color: '#506798'
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#273757'
                    }
                  }
                },
                {
                  show: true,
                  type: 'value',
                  position: 'left',
                  zlevel: 10,
                  axisLabel: {
                    color: '#506798',
                    inside: true
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#273757'
                    }
                  }
                }
              ],
              legendData: [indexName, this.financingData.legend, this.securityData.legend],
              seriesData: [
                {
                  name: indexName,
                  type: 'line',
                  data: indexData,
                  yAxisIndex: 0,
                  itemStyle: {
                    normal: {
                      lineStyle: {
                        color: '#ff402b'
                      }
                    }
                  }
                },
                this.financingData.series,
                this.securityData.series
              ],
              time: timeArr
            }
            if (!this.buttonOne) {
              this.chartsData.seriesData.forEach((el, index) => {
                if (el.name == '融券余额') {
                  this.chartsData.seriesData.splice(index, 1)
                }
              })
            }
            if (!this.buttonTwo) {
              this.chartsData.seriesData.forEach((el, index) => {
                if (el.name == '融资余额') {
                  this.chartsData.seriesData.splice(index, 1)
                }
              })
            }
            this.drawBarChart('line-bar', this.chartsData)
          })
      },
      drawBarChart(id, data) {
        let myLine = document.getElementById(id);
        let echart = echarts.init(myLine, this.gfnGetTheme());
        echart.clear()
        window.onresize = echart.resize;
        echart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              let texts = params[0].name + '<br/>'
              params.forEach((el) => {
                if (el.seriesType == 'bar') {
                  texts += el.marker + el.seriesName + ':' + (el.value != 'null' ? Math.abs(el.value).toFixed(3) : '-') + '亿元 <br/>'
                } else {
                  texts += el.marker + el.seriesName + ':' + (el.value ? Math.abs(el.value) : '-') + '<br/>'
                }
              })
              return texts
            }
          },
          color: ['#ff402b', '#2a7efb', '#ff7836'],
          grid: {
            left: '5%',
            right: '1%',
            bottom: '5%',
            containLabel: true
          },
          toolbox: {
            x: '97%',
            itemSize: 18,
            feature: {
              saveAsImage: {}
            },
            showTitle: false
          },
          xAxis: {
            axisLabel: {
              color: '#506798'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#273757'
              }
            },
            type: 'category',
            boundaryGap: 'false',
            data: data.time
          },
          yAxis: data.yAxis,
          series: data.seriesData
        }, true)
      }
    }
  }
</script>

<style lang='less'>
  .crossday {
    min-height: 180px;
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

  .crossday {
    .el-card__body {
      padding: 0px !important;
    }
  }

  .crossday .headWrap .multiply {
    .buttonOne {
      background-color: #263e69 !important;
      color: #aec0e6 !important;
    }
    .buttonTwo {
      background-color: #263e69 !important;
      color: #aec0e6 !important;
    }
    .orange {
      width: 10px;
      height: 10px;
      background-color: #ff7836;
      display: inline-block;
      position: relative;
      top: 1px;
      left: -2px;
    }
    .skyBlue {
      width: 10px;
      height: 10px;
      background-color: #18b2f2;
      display: inline-block;
      position: relative;
      top: 1px;
      left: -2px;
    }
    .el-button {
      background-color: rgba(38, 62, 105, 0.4);
      color: #5b6a8b;
      border: none;
    }
  }

  .el-tab-pane .moreCheck .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #5a5e66;
  }
</style>
