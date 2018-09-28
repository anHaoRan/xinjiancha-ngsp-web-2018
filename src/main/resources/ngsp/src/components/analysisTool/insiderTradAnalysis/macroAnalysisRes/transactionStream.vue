<template>
  <div class="transaction-stream">

    <el-card style="margin: 0;padding-bottom: 20px;"
             v-loading="queryResLoad"
             element-loading-spinner="el-icon-loading"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)"
             class="el-card-table">
      <div style="height:160px" v-show="dateTooltip">
        <div style="margin: 0px 20px 0px 120px" class="date-tooltip">
      <span>
        日期： {{tooltipData.date}}
      </span>
          <div style="margin-left: 80px;">
        <span class="item">
        当日开盘价：<span :class="tooltipData.priceLimit-0>0?'up':'down'">{{tooltipData.openPrice}}元</span>
      </span>
            <span class="item">
        当日收盘价：<span :class="tooltipData.priceLimit-0>0?'up':'down'">{{tooltipData.closePrice}}元</span>
      </span>
            <span class="item">
        当日涨跌幅：<span :class="tooltipData.priceLimit-0>0?'up':'down'">{{tooltipData.priceLimit}}%</span>
      </span>
            <span class="item">
        当日最高价：<span :class="tooltipData.priceLimit-0>0?'up':'down'">{{tooltipData.hightestPrice}}元</span>
      </span>
            <span class="item">
        当日最低价：<span :class="tooltipData.priceLimit-0>0?'up':'down'">{{tooltipData.lowestPrice}}元</span>
      </span>
            <span class="item">
        当日振幅：<span :class="tooltipData.priceLimit-0>0?'up':'down'">{{tooltipData.swing}}%</span>
      </span>
            <br>
            <span class="item">
        当日成交量：<span :class="tooltipData.priceLimit-0>0?'up':'down'">{{tooltipData.tradColumeNum}}万股</span>
      </span>
            <span class="item">
        当日成交额：<span :class="tooltipData.priceLimit-0>0?'up':'down'">{{tooltipData.tradVolume}}万元</span>
      </span>
            <span class="item">
        当日换手率：<span :class="tooltipData.priceLimit-0>0?'up':'down'">{{tooltipData.turnoverRate}}%</span>
      </span>
            <span class="item">
        当日上证综指涨跌幅：<span :class="tooltipData.SHCLPriceLimit-0>0?'up':'down'">{{tooltipData.SHCLPriceLimit}}%</span>
      </span>

          </div>
        </div>
        <div v-if="selectBox"
             class="date-tooltip"
             v-loading="selectBoxLoading"
             element-loading-spinner="el-icon-loading"
             element-loading-text="框选数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)">
          <div style="margin-left: 120px;">
        <span class="item">
        起始日期： {{selectStartDate}}
      </span>
            <span class="item">
        终止日期： {{selectEndDate}}
      </span>
            <div>
            <span class="item">
        期间最高价： <span :class="selectBoxData.riseDropRang-0>0?'up':'down'">{{selectBoxData.highPrice}}元</span>
      </span>
              <span class="item">
        期间最低价： <span :class="selectBoxData.riseDropRang-0>0?'up':'down'">{{selectBoxData.lowPrice}}元</span>
      </span>
              <span class="item">
        期间最大振幅： <span :class="selectBoxData.riseDropRang-0>0?'up':'down'">{{selectBoxData.swing}}%</span>
      </span>
              <span class="item">
        期间涨跌幅： <span :class="selectBoxData.riseDropRang-0>0?'up':'down'">{{selectBoxData.riseDropRang}}%</span>
      </span>
              <span class="item">
        期间上证综指涨跌幅：<span
                :class="selectBoxData.riseDropRangNUmOne-0>0?'up':'down'"> {{selectBoxData.riseDropRangNUmOne}}%</span>
      </span>
            </div>
          </div>
        </div>
      </div>
      <div class="transaction-strem-charts"></div>
      <div class="charts-overlaying-markpoint" v-if="!queryResLoad">
        <el-checkbox v-model="overlaySHCL" @change="overlaySHCLClosePrice">叠加大盘指数</el-checkbox>
        <el-checkbox v-model="isShowMajorEvents"
                     @change="showMajorEvents"
                     :disabled="majorEventsData.length===0">显示公司重大事项 <img src="../../../../assets/images/flag_icon.png"
                                                                          alt=""></el-checkbox>
        <el-checkbox v-model="isShowBlockTrade"
                     @change="showBlockTrade"
                     :disabled="blockTradeData.length===0">显示大宗交易情况 <img
          src="../../../../assets/images/landmine_icon.png" alt=""></el-checkbox>
        <el-checkbox v-model="isShowHistory"
                     @change="showHistory"
                     :disabled="historyData.length===0">显示历史监管记录
        </el-checkbox>
        <el-checkbox v-model="isShowPublicOption"
                     @change="showPublicOption"
                     :disabled="publicOption.length===0">显示研报及舆情
        </el-checkbox>
      </div>
      <el-table
        v-if="showMarkPointTable"
        border
        :data="tableData"
        tooltip-effect="dark"
        show-overflow-tooltip
        v-loading="tableQueryResLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)"
        style="width: 100%">
        <el-table-column
          v-for="item in tableOptions"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  import echarts from 'echarts'
  import moment from 'moment'
  import {
    getTransactionStream,
    getRegion,
    getBasicInfo,
    getBlockTrade
  } from '../../../../service/analysisTool/insiderTradAccountAnalysis'
  import flagImageUrl from '../../../../assets/images/flag_icon.png'
  import landmineImageUrl from '../../../../assets/images/landmine_icon.png'

  export default {
    name: 'transaction-stream',

    data () {
      return {
        msg: '公司股价及交易量走势图',
        dateList: [],
        valueList: [],
        //  核查开始时间
        startDate: '',
        //  核查结束时间
        endDate: '',
        // 框选开始日期
        selectStartDate: [],
        // 框选结束日期
        selectEndDate: [],
        // 返回画图所需总数据
        responesData: [],
        // 提示信息数据
        tooltipData: {},
        // 鼠标悬浮每日信息展现与否
        dateTooltip: false,
        // 框选信息展示与否
        selectBox: false,
        selectBoxLoading: false,
        selectBoxData: {},
        queryResLoad: false,
        flag: true,
        // 经处理后的数据
        afterSplitData: {},
        // 画图所需数据
        drawOption: {},
        // 记录缩放区域
        recordZoomStart: '',
        recordZoomEnd: '',
        // 叠加
        // 叠加大盘指数
        overlaySHCL: false,
        // 显示公司重大事项
        isShowMajorEvents: false,
        // 重大事项叠加option
        majorEventsChartData: {},
        // 重大事项接口返回数据
        majorEventsData: [],
        // 显示大宗交易情况
        isShowBlockTrade: false,
        // 大宗交易接口返回数据
        blockTradeData: [],
        // 显示历史监管记录
        isShowHistory: false,
        historyData: [],
        // 显示研报及舆情
        isShowPublicOption: false,
        publicOption: [],
        // 表格
        tableData: [],
        tableOptions: [],
        showMarkPointTable: false,
        tableQueryResLoad: false
      }
    },

    methods: {
      getResultData () {
        // if (this.flag) {
        //   this.flag = false
        //   this.queryResLoad = true
          getTransactionStream(this.$store.state.insiderTradAnalysis.currentTaskData.taskId).then((resp) => {
            this.startDate = resp.checkStartDate
            this.endDate = resp.checkEndDate
            let chartData = resp.kList
            this.responesData = chartData
            // if (!$.isEmptyObject(chartData)) {
              this.rangeStart = chartData[5].trading_date
              this.rangeEnd = chartData[chartData.length - 5].trading_date
              this.splitData()
              this.draw(this.drawOption)
            this.queryResLoad = false
            let macroAnalyRequestCount = this.$store.state.insiderTradAnalysis.macroAnalyRequestCount + 1
            this.$store.commit('changeMacroAnalyRequestCount', macroAnalyRequestCount)
            // } else {
            //   this.flag = true
            // }
          })
        // }
      },
      splitData () {
        let rawData = this.responesData
        let categoryData = [], values = [], volumes = [], SHCLClosePrice = []
        for (let i = 0; i < rawData.length; i++) {
          categoryData.push(rawData[i].trading_date)
          values.push([this.gfnFormatDecimal(rawData[i].open_price, 3), rawData[i].close_price, rawData[i].high_price, rawData[i].low_price])
          volumes.push([i, rawData[i].trade_volume, rawData[i].open_price > rawData[i].close_price ? 1 : -1])
          SHCLClosePrice.push(rawData[i].close_price000001)
        }
        this.afterSplitData = {
          categoryData: categoryData,
          values: values,
          volumes: volumes,
          SHCLClosePrice: SHCLClosePrice
        }
        let that = this
        let data = this.afterSplitData
        let downColor = '#12bba5'
        let upColor = '#ff402b'
        this.drawOption = {
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
              let obj = {top: 0, left: 'center'}
              return obj
            },
            formatter: function (params) {
              // 按需求显示每日相应的内容
              let dataIndex = params[0].dataIndex,
                currentDateData = that.responesData[dataIndex],
                flag = currentDateData.open_price > currentDateData.close_price,
                date = currentDateData.trading_date,
                openPrice = currentDateData.open_price,
                closePrice = currentDateData.close_price,
                priceLimit = currentDateData.rise_drop_range,
                hightestPrice = currentDateData.high_price,
                lowestPrice = currentDateData.low_price,
                swing = currentDateData.swing,
                tradColumeNum = currentDateData.trade_volume,
                tradVolume = currentDateData.trade_value,
                turnoverRate = currentDateData.negotiable_turnover_ratio,
                SHCLPriceLimit = currentDateData.rise_drop_range000001
              that.dateTooltip = true
              that.tooltipData = {
                currentDateData: currentDateData,
                flag: flag,
                date: date,
                openPrice: openPrice,
                closePrice: closePrice,
                priceLimit: priceLimit,
                hightestPrice: hightestPrice,
                lowestPrice: lowestPrice,
                swing: swing,
                tradColumeNum: tradColumeNum,
                tradVolume: tradVolume,
                turnoverRate: turnoverRate,
                SHCLPriceLimit: SHCLPriceLimit
              }
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
              backgroundColor: '#777'
            }
          },
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: that.recordZoomStart === '' ? 0 : that.recordZoomStart,
              end: that.recordZoomEnd === '' ? 100 : that.recordZoomEnd
            },
            {
              show: true,
              readtime: true,
              xAxisIndex: [0, 1],
              y: '90%',
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
            throttleDelay: 500,
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
          },
          visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [
              {
                value: 1,
                color: upColor
              },
              {
                value: -1,
                color: downColor
              }
            ]
          },
          grid: [
            {
              top: '8%',
              left: '5%',
              right: '8%',
              height: '50%'
            },
            {
              top: '70%',
              left: '5%',
              right: '8%',
              height: '15%'
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: data.categoryData,
              scale: true,
              boundaryGap: true,
              splitLine: {show: false},
              splitNumber: 10,
              min: 'dataMin',
              max: 'dataMax',
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
            },
            {
              type: 'category',
              gridIndex: 1,
              data: data.categoryData,
              scale: true,
              boundaryGap: true,
              axisTick: {show: false},
              splitLine: {show: false},
              splitNumber: 10,
              min: 'dataMin',
              max: 'dataMax',
              axisLabel: {
                fontsize: '14px',
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
              name: '单位：（元）',
              nameTextStyle: {
                color: '#aec0e6'
              },
              scale: true,
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#aec0e6'
              },
              splitLine: {
                show: true,
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
              name: '单位：（万股）',
              nameTextStyle: {
                color: '#aec0e6'
              },
              scale: true,
              gridIndex: 1,
              splitNumber: 2,
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
            }
          ],
          series: [
            {
              type: 'candlestick',
              data: data.values,
              itemStyle: {
                normal: {
                  color: upColor,
                  color0: downColor,
                  borderColor: null,
                  borderColor0: null
                }
              },
              tooltip: {
                formatter: function (param) {
                  param = param[0]
                  return [
                    'Date:' + param.name + '<hr size=1 style="margin: 3px 0;">',
                    'Open:' + param.data[0] + '<br/>',
                    'Close:' + param.data[1] + '<br/>',
                    'Lowest:' + param.data[2] + '<br/>',
                    'Highest:' + param.data[3] + '<br/>'
                  ].join('')
                }
              },
              markLine: {
                itemStyle: {
                  normal: {
                    lineStyle: {type: 'dashed', color: '#999'},
                    label: {show: true, position: 'top'}
                  }
                },
                data: [
                  [{
                    xAxis: that.startDate,
                    symbol: 'none',
                    y: '5%'
                  }, {
                    xAxis: that.startDate,
                    symbol: 'none',
                    y: '86%'
                  }],
                  [{
                    xAxis: that.endDate,
                    symbol: 'none',
                    y: '5%'
                  }, {
                    xAxis: that.endDate,
                    symbol: 'none',
                    y: '86%'
                  }]
                ]
              }
            },
            {
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: data.volumes,
              itemStyle: {
                normal: {
                  color: function (params) {
                    return params.value[2] === 1 ? downColor : upColor
                  }
                }
              }
            }
          ]
        }
        // 叠加大盘指数
        if (this.overlaySHCL) {
          let overlaySHCLYaxis = {
            // name:'单位：（元）',
            scale: false,
            xAxisIndex: 0,
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
          let overlaySHCL = {
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 2,
            data: this.afterSplitData.SHCLClosePrice,
            smooth: true
          }
          this.drawOption.series.push(overlaySHCL)
          this.drawOption.yAxis.push(overlaySHCLYaxis)
        }
        // 叠加重大事项
        if (this.isShowMajorEvents) {
          let dateArr = this.majorEventsData.map(item => {
            return moment(item.new_date).format('YYYY-MM-DD')
          })
          let majorEventsMarkPointData = []
          this.responesData.forEach((item) => {
            dateArr.forEach(nape => {
              if (item.trading_date === nape) {
                majorEventsMarkPointData.push({
                  coord: [nape, item.close_price],
                  name: 'majorEvents',
                  symbol: 'image:// ' + flagImageUrl,
                  symbolSize: [20, 20],
                  symbolOffset: ['26%', '-250%']
                })
              }
            })
          })
          if (this.drawOption.series[0]['markPoint']) {
            this.drawOption.series[0]['markPoint'].data = this.drawOption.series[0]['markPoint'].data.concat(majorEventsMarkPointData)
          } else {
            this.drawOption.series[0]['markPoint'] = {
              data: majorEventsMarkPointData,
              effect: {
                show: true,
                shadowBlur: 0
              }
            }
          }
        }
        // 叠加大宗交易
        if (this.isShowBlockTrade) {
          let dateArr = this.blockTradeData.map(item => {
            return moment(item.trade_date, 'YYYY/MM/DD').format('YYYY-MM-DD')
          })
          let blockTradeData = []
          this.responesData.forEach((item) => {
            dateArr.forEach(nape => {
              if (item.trading_date === nape) {
                blockTradeData.push({
                  coord: [nape, item.close_price],
                  name: 'blockTrade',
                  symbol: 'image:// ' + landmineImageUrl,
                  symbolSize: [20, 20],
                  symbolOffset: ['0%', '-400%']
                })
              }
            })
          })
          if (this.drawOption.series[0]['markPoint']) {
            this.drawOption.series[0]['markPoint'].data = this.drawOption.series[0]['markPoint'].data.concat(blockTradeData)
          } else {
            this.drawOption.series[0]['markPoint'] = {
              data: blockTradeData
            }
          }
        }
      },
      draw () {
        let that = this
        this.splitData()
        let mychart = echarts.init($('.transaction-strem-charts')[0], this.gfnGetTheme())
        mychart.clear()
        window.onresize = mychart.resize
        mychart.setOption(this.drawOption, true)
        mychart.on('brushSelected', function (val) {
          that.selectBoxLoading = true
          let dateRange = val.batch[0].areas[0]
          if (dateRange) {
            let range = dateRange.coordRange
            let startNum = range[0], endNum = range[1],
              stockCode = that.$store.state.insiderTradAnalysis.currentTaskData.stockCode.split(' ')[0]
            let startTime = that.responesData[startNum].trading_date,
              endTime = that.responesData[endNum].trading_date
            that.selectStartDate = startTime
            that.selectEndDate = endTime
            getRegion(startTime, endTime, stockCode).then((resp) => {
              let obj = {
                highPrice: resp[0].high_price,
                lowPrice: resp[0].low_price,
                swing: resp[0].swing,
                riseDropRang: resp[0].rise_drop_range,
                riseDropRangNUmOne: resp[0].rise_drop_range000001
              }
              that.selectBox = true
              that.selectBoxLoading = false
              that.selectBoxData = obj
            })
          } else {
            that.selectBox = false
          }
        })
        mychart.on('click', function (params) {
          let tableDataMoment = []
          that.tableQueryResLoad = true
          switch (params.data.name) {
            case 'majorEvents' :
              that.majorEventsData.forEach(item => {
                if (params.data.coord[0] === moment(item.new_date).format('YYYY-MM-DD')) {
                  tableDataMoment.push(item)
                }
              })
              that.tableOptions = [
                {prop: 'notice_date', label: '公告日期', align: 'left'},
                {prop: 'notice_name', label: '公告标题', align: 'left'},
                {prop: 'event_type', label: '事件类型', align: 'left'},
                {prop: 'events', label: '事件摘要', align: 'left'}
              ]
              that.showMarkPointTable = true
              that.tableData = tableDataMoment
              break
            case 'blockTrade':
              that.blockTradeData.forEach(item => {
                if (params.data.coord[0] === moment(item.trade_date).format('YYYY-MM-DD')) {
                  tableDataMoment.push(item)
                }
              })
              that.tableOptions = [
                {prop: 'trade_date', label: '交易日期', align: 'left'},
                {prop: 'sec_code', label: '证券代码', align: 'left'},
                {prop: 'sec_name', label: '证券简称', align: 'left'},
                {prop: 'trade_no', label: '成交编号', align: 'left'},
                {prop: 'buy_acct_id', label: '买方股东账户', align: 'left'},
                {prop: 'buy_acct_name', label: '买方股东名称', align: 'left'},
                {prop: 'buy_branch_name', label: '买方会员营业部', align: 'left'},
                {prop: 'sell_acct_id', label: '卖方股东账户', align: 'left'},
                {prop: 'sell_acct_name', label: '卖方股东名称', align: 'left'},
                {prop: 'sell_branch_name', label: '卖方会员营业部', align: 'left'},
                {prop: 'trade_price', label: '成交价格', align: 'right'},
                {prop: 'trade_vol', label: '成交数量', align: 'right'},
                {prop: 'trade_amt', label: '成交金额', align: 'right'}
              ]
              that.showMarkPointTable = true
              that.tableData = tableDataMoment
              break
          }
          setTimeout(() => {
            that.tableQueryResLoad = false
          }, 500)
        })
        mychart.on('dataZoom', (item) => {
          this.recordZoomStart = item.start
          this.recordZoomEnd = item.end
        })
        mychart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'single'
          }
        })

      },
      overlaySHCLClosePrice (val) {
        this.draw()
      },
      // 重大事项
      showMajorEvents (val) {
        this.draw()
      },
      // 大宗交易
      showBlockTrade () {
        this.draw()
      },
      // 历史监管记录
      showHistory () {

      },
      // 研报及舆情
      showPublicOption () {

      }

    },
    created () {
      let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      getBasicInfo(taskId).then(resp => {
        //  getBasicInfo('20180528092512').then(resp => {
        this.majorEventsData = resp.mattersList
        let macroAnalyRequestCount = this.$store.state.insiderTradAnalysis.macroAnalyRequestCount + 1
        this.$store.commit('changeMacroAnalyRequestCount', macroAnalyRequestCount)
      })
      getBlockTrade(taskId, 1, 100).then(resp => {
        //  getBlockTrade('20180528092512', 1, 100).then(resp => {
        this.blockTradeData = resp.bolckTrendList
        let macroAnalyRequestCount = this.$store.state.insiderTradAnalysis.macroAnalyRequestCount + 1
        this.$store.commit('changeMacroAnalyRequestCount', macroAnalyRequestCount)
      })
    },
    mounted () {
      //  this.getResultData()
    }

  }
</script>

<style scoped lang='less'>
  @ch: this.overlaySHCL;
  .transaction-stream {

    .date-tooltip {
      div {
        margin-left: 70px;
        .item {
          display: inline-block;
          margin-right: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }
    }
    .transaction-strem-charts {
      width: 1200px;
      height: 500px;
      margin: 10px 0 20px 95px;
      display: inline-block
    }
    .charts-overlaying-markpoint {
      display: inline-block;
      /*height: 500px;*/
      vertical-align: top;
      position: relative;
      top: 100px;
      .el-checkbox {
        margin-left: 30px;
        margin-bottom: 20px;
        display: block;
        img {
          vertical-align: middle;
          height: 20px;
          width: 20px;
        }
      }
    }

  }
</style>
