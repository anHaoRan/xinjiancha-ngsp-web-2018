<template>
  <div class='abnormolCount'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card class='statistical-interval'>
      <el-form :inline='true' :model='dimensionQueryForm' ref='selectParams'>
        <el-row :gutter='20'>
          <el-col :xl="10" :md="12" :sm="24">
            <el-form-item label='统计区间：'>
              <el-date-picker
                v-model='dimensionQueryForm.beginDate'
                type='date'
                placeholder='请选择开始日期'
                value-format='yyyy-MM-dd'
                @change='getstarttime'
                :picker-options='startpickerOption'
                size='small'>
              </el-date-picker>
              <span style="padding: 0px 10px">至</span>
              <el-date-picker
                v-model='dimensionQueryForm.endDate'
                type='date'
                placeholder='请选择结束日期'
                value-format='yyyy-MM-dd'
                @change='getendtime'
                :picker-options='endpickerOption'
                size='small'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :md="12" :sm="24">
            <el-form-item>
              <el-button type="primary" size="small" @click="query">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-row :gutter='30'>
      <el-col :span='10'>
        <el-card class='pie'>
          <div slot='header' class='clearfix'>
            业务分类预警
          </div>
          <div id='businesspie' class='businesspie'></div>
        </el-card>
      </el-col>
      <el-col :span='14'>
        <el-card class='line'>
          <div slot='header' class='clearfix'>
            业务分类预警趋势图
          </div>
          <div id='businessline' class='businesspie'></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter='30'>
      <el-col :span='10'>
        <el-card class='pie'>
          <div slot='header' class='clearfix'>
            产品分类预警
          </div>
          <div id='productpie' class='businesspie'></div>
        </el-card>
      </el-col>
      <el-col :span='14'>
        <el-card class='line'>
          <div slot='header' class='clearfix'>
            产品分类预警趋势图
          </div>
          <div id='productline' class='businesspie'></div>
        </el-card>
      </el-col>
    </el-row>
    <div class='superviseTab'>
      <el-tabs v-model='activeName' type='card' @tab-click='handleClick'>
        <el-tab-pane label='维稳工作' name='first'>
        </el-tab-pane>
        <el-tab-pane label='异常交易监管' name='second'>
        </el-tab-pane>
      </el-tabs>
      <!--维稳-->
      <el-row :gutter='30' v-show='isshow'>
        <el-col :span='10'>
          <el-card class='pie'>
            <div slot='header' class='clearfix'>
              自律监管分类预警
            </div>
            <div id='supervisePie1' class='businesspie'></div>
          </el-card>
        </el-col>
        <el-col :span='14'>
          <el-card class='line'>
            <div slot='header' class='clearfix'>
              自律监管分类预警趋势图
            </div>
            <div id='superviseLine1' class='businesspie'></div>
          </el-card>
        </el-col>
      </el-row>
      <!--异常交易监管-->
      <el-row :gutter='30' v-show='!isshow'>
        <el-col :span='10'>
          <el-card class='pie'>
            <div slot='header' class='clearfix'>
              自律监管分类预警
            </div>
            <div id='supervisePie2' class='businesspie'></div>
          </el-card>
        </el-col>
        <el-col :span='14'>
          <el-card class='line'>
            <div slot='header' class='clearfix'>
              自律监管分类预警趋势图
            </div>
            <div id='superviseLine2' class='businesspie'></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import echarts from 'echarts'
  import moment from 'moment';
  import {getCurTradeDate, getRelativeTradeDate} from '../../service/common/commonFunc'
  import {
    getBusinessClassAlarmToday, // 业务分类当日
    getBusinessClassAlarmHistory, // 业务分类历史
    getProductClassAlarmToday, // 产品分类当日
    getProductClassAlarmHistory, // 产品分类历史
    getRegulatoryClassAlarmToday, // 自律监管分类当日
    getRegulatoryClassAlarmHistory, // 自律监管分类历史
    getAbnormalClassAlarmToday, // 异常交易分类当日
    getAbnormalClassAlarmHistory // 异常交易分类历史
  } from '../../service/marketSupervise/abnormolTransaction/index'

  export default {
    components: {
      Breadcrumb
    },
    mounted() {
      this.getDate();
    },
    methods: {
      // 获取当前交易日
      getDate() {
        getRelativeTradeDate('-7').then(resp => {
          this.dimensionQueryForm.beginDate = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
        }).then(() => {
          getCurTradeDate().then(resp => {
            this.dimensionQueryForm.endDate = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
          }).then(() => {
            this.getAllData();
          })
        })
      },
      handleClick(val) {
        if (val.label == '维稳工作') {
          this.isshow = true
        } else {
          this.isshow = false
        }
      },
      query() {
        if (!this.dimensionQueryForm.beginDate || !this.dimensionQueryForm.endDate) {
          this.$message.warning('统计区间日期不能为空')
        } else {
          this.getAllData()
        }
      },
      getstarttime(val) {
        if (val) {
          this.dimensionQueryForm.beginDate = val;
        } else {
          this.dimensionQueryForm.beginDate = ''
        }
      },
      getendtime(val) {
        if (val) {
          this.dimensionQueryForm.endDate = val;
        } else {
          this.dimensionQueryForm.endDate = ''
        }
      },
      // 获取图表所有数据
      getAllData() {
        // 业务分类预警饼图
        getBusinessClassAlarmToday().then(resp => {
          let result = resp[0]
          let total = Number(result.declare_trade) + Number(result.hold_change) + Number(result.price) + Number(result.special_pro) + Number(result.trade_volume)
          let businessPieData = {
            total: total,
            category: '业务分类预警',
            data1: [
              {icon: 'circle', name: '成交量异常'},
              {icon: 'circle', name: '价格异常'},
              {icon: 'circle', name: '持有变动异常'},
              {icon: 'circle', name: '申报成交异常'},
              {icon: 'circle', name: '特定产品专用'}
            ],
            data2: [
              {value: result.trade_volume, name: '成交量异常'},
              {value: result.price, name: '价格异常'},
              {value: result.hold_change, name: '持有变动异常'},
              {value: result.declare_trade, name: '申报成交异常'},
              {value: result.special_pro, name: '特定产品专用'}
            ]
          }
          this.drawPieChart('businesspie', businessPieData)
        })
        // 产品分类预警饼图
        getProductClassAlarmToday().then(resp => {
          let result = resp[0]
          let total = Number(result.found) + Number(result.stock) + Number(result.bond)
          let productPieData = {
            total: total,
            category: '产品分类预警',
            data1: [
              {icon: 'circle', name: '股票类'},
              {icon: 'circle', name: '债券类'},
              {icon: 'circle', name: '基金类'}
            ],
            data2: [
              {value: result.stock, name: '股票类'},
              {value: result.bond, name: '债券类'},
              {value: result.found, name: '基金类'}
            ]
          }
          this.drawPieChart('productpie', productPieData)
        })
        // 维稳饼图
        getRegulatoryClassAlarmToday().then(resp => {
          let result = resp[0]
          let total = Number(result.out_account) + Number(result.phone_prompt) + Number(result.stop_account)
          let supervisePie1Data = {
            total: total,
            category: '自律监管分类统计',
            data1: [
              {icon: 'circle', name: '已电话提醒账户数'},
              {icon: 'circle', name: '已暂停交易账户数'},
              {icon: 'circle', name: '已转出账户数'}
            ],
            data2: [
              {value: result.phone_prompt, name: '已电话提醒账户数'},
              {value: result.stop_account, name: '已暂停交易账户数'},
              {value: result.out_account, name: '已转出账户数'}
            ]
          }
          this.drawPieChart('supervisePie1', supervisePie1Data)
        })
        // 异常交易监管饼图
        getAbnormalClassAlarmToday().then(resp => {
          let result = resp[0]
          let total = Number(result.duration_transaction) + Number(result.limit_transaction) + Number(result.unqualified_investor) + Number(result.oral_alarm) + Number(result.pause_transaction) + Number(result.written_alarm)
          let supervisePie2Data = {
            total: total,
            category: '自律监管分类统计',
            data1: [
              {icon: 'circle', name: '持续暂停交易'},
              {icon: 'circle', name: '限制交易'},
              {icon: 'circle', name: '不合格投资者'},
              {icon: 'circle', name: '口头警示'},
              {icon: 'circle', name: '盘中暂停交易'},
              {icon: 'circle', name: '书面警示'}
            ],
            data2: [
              {value: result.duration_transaction, name: '持续暂停交易'},
              {value: result.limit_transaction, name: '限制交易'},
              {value: result.unqualified_investor, name: '不合格投资者'},
              {value: result.oral_alarm, name: '口头警示'},
              {value: result.pause_transaction, name: '盘中暂停交易'},
              {value: result.written_alarm, name: '书面警示'}
            ]
          }
          this.drawPieChart('supervisePie2', supervisePie2Data)
        })
        // 业务分类预警历史折线图
        let startDate = moment(this.dimensionQueryForm.beginDate, 'YYYY-MM-DD').format('YYYYMMDD')
        let endDate = moment(this.dimensionQueryForm.endDate, 'YYYY-MM-DD').format('YYYYMMDD')
        getBusinessClassAlarmHistory(startDate, endDate).then(resp => {
          let result = resp
          let timeData = []
          let tradeCount = []
          let priceCount = []
          let holdChangeCount = []
          let declareCount = []
          let specialCount = []
          result.forEach((el) => {
            timeData.push(el.today)
            tradeCount.push(el.trade_volume)
            priceCount.push(el.price)
            holdChangeCount.push(el.hold_change)
            declareCount.push(el.declare_trade)
            specialCount.push(el.special_pro)
          })
          let businessLineData = {
            data1: ['成交量异常', '价格异常', '持有变动异常', '申报成交异常', '特定产品专用'],
            time: timeData,
            data2: [
              {
                name: '成交量异常',
                type: 'line',
                data: tradeCount
              },
              {
                name: '价格异常',
                type: 'line',
                data: priceCount
              },
              {
                name: '持有变动异常',
                type: 'line',
                data: holdChangeCount
              },
              {
                name: '申报成交异常',
                type: 'line',
                data: declareCount
              },
              {
                name: '特定产品专用',
                type: 'line',
                data: specialCount
              }
            ]
          }
          this.drawLineChart('businessline', businessLineData)
        })
        // 产品分类预警历史折线图
        getProductClassAlarmHistory(startDate, endDate).then(resp => {
          let result = resp
          let timeData = []
          let stockCount = []
          let foundCount = []
          let bondCount = []
          result.forEach((el) => {
            timeData.push(el.today)
            stockCount.push(el.stock)
            foundCount.push(el.found)
            bondCount.push(el.bond)
          })
          let peoductLineData = {
            data1: ['股票', '债券', '基金'],
            time: timeData,
            data2: [
              {
                name: '股票',
                type: 'line',
                data: stockCount
              },
              {
                name: '债券',
                type: 'line',
                data: bondCount
              },
              {
                name: '基金',
                type: 'line',
                data: foundCount
              }
            ]
          }
          this.drawLineChart('productline', peoductLineData)
        })
        // 自律监管维稳历史折线图
        getRegulatoryClassAlarmHistory(startDate, endDate).then(resp => {
          let result = resp
          let timeData = []
          let phoneCount = []
          let stopCount = []
          let outCount = []
          result.forEach((el) => {
            timeData.push(el.today)
            phoneCount.push(el.phone_prompt)
            stopCount.push(el.stop_account)
            outCount.push(el.out_account)
          })
          let superviseLine1Data = {
            data1: ['已电话提醒账户数', '已暂停交易账户数', '已转出账户数'],
            time: timeData,
            data2: [
              {
                name: '已电话提醒账户数',
                type: 'line',
                data: phoneCount
              },
              {
                name: '已暂停交易账户数',
                type: 'line',
                data: stopCount
              },
              {
                name: '已转出账户数',
                type: 'line',
                data: outCount
              }
            ]
          }
          this.drawLineChart('superviseLine1', superviseLine1Data)
        })
        // 自律监管异常交易监管历史折线图
        getAbnormalClassAlarmHistory(startDate, endDate).then(resp => {
          let result = resp
          let timeData = []
          let durationCount = []
          let limitCount = []
          let unqualifiedCount = []
          let oralCount = []
          let pauseCount = []
          let writtenCount = []
          result.forEach((el) => {
            timeData.push(el.today)
            durationCount.push(el.duration_transaction)
            limitCount.push(el.limit_transaction)
            unqualifiedCount.push(el.unqualified_investor)
            oralCount.push(el.oral_alarm)
            pauseCount.push(el.pause_transaction)
            writtenCount.push(el.written_alarm)
          })
          let superviseLine2Data = {
            data1: ['持续暂停交易', '限制交易', '不合格投资者', '口头警示', '盘中暂停交易', '书面警示'],
            time: timeData,
            data2: [
              {
                name: '持续暂停交易',
                type: 'line',
                data: durationCount
              },
              {
                name: '限制交易',
                type: 'line',
                data: limitCount
              },
              {
                name: '不合格投资者',
                type: 'line',
                data: unqualifiedCount
              },
              {
                name: '口头警示',
                type: 'line',
                data: oralCount
              },
              {
                name: '盘中暂停交易',
                type: 'line',
                data: pauseCount
              },
              {
                name: '书面警示',
                type: 'line',
                data: writtenCount
              }
            ]
          }
          this.drawLineChart('superviseLine2', superviseLine2Data)
        })
      },
      drawLineChart(id, dataList) {
        let container = document.getElementById(id)
        let resizeContainer = function () {
          container.style.width = document.getElementsByClassName('el-card__body')[2].children[0].clientWidth + 'px'
        }
        resizeContainer()
        let productline = echarts.init(document.getElementById(id), this.gfnGetTheme());
        productline.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            inactiveColor: '#455579',
            top: 10,
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
                color: '#506798'
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
            }
          ],
          yAxis: [
            {
              type: 'value',
              boundaryGap: false,
              axisLabel: {
                color: '#506798'
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            }
          ],
          series: dataList.data2
        })
      },
      drawPieChart(id, pieList) {
        let container = document.getElementById(id)
        let resizeContainer = function () {
          container.style.width = document.getElementsByClassName('el-card__body')[1].children[0].clientWidth + 'px'
        }
        resizeContainer()
        let businesspie = echarts.init(document.getElementById(id), this.gfnGetTheme());
        businesspie.clear()
        window.onresize = businesspie.resize;
        businesspie.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          title: {
            text: pieList.total,
            subtext: '异常',
            left: '30%',
            top: '40%',
            subtextStyle: {
              color: '#506798',
              fontSize: 30,
              align: 'center',
              fontWeight: 400
            },
            textStyle: {
              color: '#506798',
              fontSize: 30,
              align: 'center',
              fontWeight: 400
            }
          },
          legend: {
            inactiveColor: '#455579',
            orient: 'vertical',
            top: 'middle',
            left: '70%',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20,
            selectedMode: false,
            data: pieList.data1,
            textStyle: {
              fontSize: 14,
              color: '#506798'
            },
            formatter: function (name) {
              let val = ''
              pieList.data2.forEach((el) => {
                if (el.name == name) {
                  val = el.value
                }
              })
              return name + '    ' + val
            }
          },
          series: [{
            name: pieList.category,
            type: 'pie',
            radius: ['38%', '50%'],
            center: ['35%', 180],
            itemStyle: {
              normal: {
                label: {
                  formatter: '{d}%',
                  position: 'outer'
                }
              }
            },
            data: pieList.data2
          }]
        }, true)
      }
    },
    data() {
      return {
        activeName: 'first',
        breadcrumbItems: [{
          router: '/abnormolTransaction',
          label: '市场运行监测'
        }, {
          router: '',
          label: '异常交易统计监测'
        }],
        dimensionQueryForm: {
          beginDate: '',
          endDate: ''
        },
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() >= new Date(this.dimensionQueryForm.endDate).getTime();
          }
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.dimensionQueryForm.beginDate).getTime() - 3600 * 1000 * 24;
          }
        },
        isshow: true
      }
    }
  }
</script>
<style lang='less'>
  .abnormolCount {
    .el-form--inline {
      .el-form-item__content {
        vertical-align: baseline;
      }
    }
    .statistical-interval {
      height: 50px;
      line-height: 50px;
      margin-top: 20px;
    }
    .businesspie {
      width: 100%;
      height: 350px
    }
    .superviseTab {
      .el-tabs {
        position: relative;
      }
      .el-tabs--card > .el-tabs__header {
        position: absolute;
        top: 65px;
        left: 20%;
        border: none;
        .el-tabs__nav-wrap {
          padding: 20px;
          .el-tabs__nav {
            border: none;
            .el-tabs__item.is-active {
              background-color: #1b5eed;
            }
            > div {
              margin: 0px;
              height: 30px;
              line-height: 30px;
              background-color: #0f2045;
              border: none;
              box-sizing: border-box;
              font-size: 14px;
            }
            > div:nth-child(1) {
              border-radius: 4px 0px 0px 4px;
            }
            > div:nth-child(2) {
              border-radius: 0px 4px 4px 0px;
            }
          }
        }
      }
    }
  }
</style>
