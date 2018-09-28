<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>上证综指走势图</span>
      </div>
      <div id="trendChart" :style="{width:'100%',height:'300px'}"></div>
      <div class="chart-menu" v-bind:style="styleObject" v-if="chartMenuClick">
        <el-button size="small" type="primary" @click="toNewPage" style="margin-right: 4px;">投资者监测</el-button>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>分时净额统计表<span style="color: #aec0e6;margin-left: 10px">(金额:亿元)</span></span>
      </div>
      <el-table
        :data="timeSharingStatistics"
        ref="timeSharingStatisticsTable"
        border
        tooltip-effect="dark"
        height="400"
        size="small"
        :cell-class-name="this.tableColumnClassName"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          v-for="column in columns"
          :show-overflow-tooltip="true"
          :key="column.field"
          :label="column.label"
          :prop="column.field"
          :width="column.width"
          :min-width="column.minWidth"
          :class-name="column.className"
          :align="column.align == null ? 'center' : column.align"
          :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
          :sortable="column.sortable == null ? false : column.sortable"
          :sort-method="column.sortMethod">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import {
    getIndividualCharts,
    getInvestorHalfNetAmount
  } from '@/service/marketSupervise/classifiedInvestorMonitoring'
  import moment from 'moment'

  let echarts = require('echarts')

  export default {
    name: 'half-hour-investor-monitoring',
    components: {
      Breadcrumb
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          }, {
            router: '/halfHourInvestorMonitoring',
            label: '半小时投资者监测'
          }
        ],
        chartMenuClick: false,
        styleObject: {},
        HNATimeOut: 0,
        timeSharingStatistics: [],
        columns: [
          {label: '分类投资者', field: 'org_desc', minWidth: '10%', align: 'left', sortable: true},
          {
            label: '9:30-10:00',
            field: 'mktval_1',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_1')
          },
          {
            label: '10:00-10:30',
            field: 'mktval_2',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_2'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '10:30-11:00',
            field: 'mktval_3',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_3'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '11:00-11:30',
            field: 'mktval_4',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_4'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '13:00-13:30',
            field: 'mktval_5',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_5'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '13:30-14:00',
            field: 'mktval_6',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_6'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '14:00-14:30',
            field: 'mktval_7',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_7'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '14:30-15:00',
            field: 'mktval_8',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_8'),
            formatter: this.gfnElColFormatDec2
          },
          {
            label: '全天合计',
            field: 'day_count',
            minWidth: '10%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'day_count'),
            formatter: this.gfnElColFormatDec2
          }
        ],
        selectedCol: '',
        chartRange: [],
        tradeDate: '',
        startTime: '',
        endTime: ''
      }
    },
    mounted () {
      this.HalfNetAmountTimeOut()
    },
    methods: {
      tableColumnClassName ({row, column}) { // eslint-disable-line
        if (column.property !== 'org_desc') {
          return this.gfnFormatSecurityClass(row[column.property])
        }
      },
      toNewPage () {
        let params = {
          codeType: 'index',
          stockCode: '000001',
          stockCodeName: '上证指数',
          beginTime: this.startTime,
          endTime: this.endTime
        }
        window.open('#/classifiedInvestorMonitoring?params=' + JSON.stringify(params))
      },
      changeRelativeTableColClass (range) {
        if (JSON.stringify(this.chartRange) !== JSON.stringify(range)) {
          this.chartRange = range
          if (this.chartRange[0] === '10:00') {
            this.columns[5].className = ''
          }
        }
      },
      drawChart (data) {
        let container = document.getElementById('trendChart')
        let resizeContainer = function () {
          container.style.width = '1600px'
        }
        resizeContainer()
        let _this = this
        let myLine = document.getElementById('trendChart')
        let trendChart = echarts.init(myLine, this.gfnGetTheme())
        let option = {}
        if (trendChart.getOption()) {
          option = trendChart.getOption()
          option.series[0].data = data.chartData
          option.yAxis[0].min = (data.lastCloseData - data.ampliToday).toFixed(2)
          option.yAxis[0].tickInterval = data.lastCloseData
          option.yAxis[0].max = (data.lastCloseData + data.ampliToday).toFixed(2)
        } else {
          option = {
            tooltip: {
              trigger: 'axis',
              triggerOn: 'mousemove|click',
              axisPointer: {
                type: 'line',
                lineStyle: {
                  opacity: 0
                }
              },
              showContent: true,
              formatter: function (params) {
                let range = []
                let times = params[0].axisValue.split(':')
                if (Number(times[1]) > 30) {
                  range = [times[0] + ':30', (Number(times[0]) + 1) + ':00']
                } else {
                  if (Number(times[0]) === 11) {
                    range = ['11:00', '11:30']
                  } else if (Number(times[0]) === 13) {
                    range = ['11:30', '13:30']
                  } else {
                    range = [times[0] + ':00', times[0] + ':30']
                  }
                }
                trendChart.dispatchAction({
                  type: 'brush',
                  areas: [
                    {
                      brushType: 'lineX',
                      coordRange: range,
                      xAxisIndex: 0
                    }
                  ]
                })
                _this.changeRelativeTableColClass(range)
                // console.log(_this.$refs.timeSharingStatisticsTable.columns)
              }
            },
            brush: {
              xAxisIndex: 'all',
              brushLink: 'all',
              outOfBrush: {
                colorAlpha: 0.1
              }
            },
            grid: {
              show: true,
              left: '10%',
              right: '11%',
              top: '5%',
              bottom: '7%',
              containLabel: false
            },
            xAxis: [
              {
                type: 'category',
                gridIndex: 0,
                boundaryGap: false,
                axisTick: {
                  show: false
                },
                data: data.timeList,
                axisLabel: {
                  color: '#aec0e6',
                  interval: 29 // 横坐标间隔时间
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#273757'
                  }
                },
                axisLine: {
                  show: true,
                  onZero: false,
                  lineStyle: {
                    color: '#455579'
                  }
                }
              },
              {
                type: 'category',
                gridIndex: 0,
                axisLine: {
                  onZero: true,
                  lineStyle: {
                    type: 'dashed',
                    color: '#e33f2d'
                  }
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
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
                },
                splitNumber: 2,
                min: (data.lastCloseData - data.ampliToday).toFixed(2), // 最小
                tickInterval: data.lastCloseData, // 步长
                max: (data.lastCloseData + data.ampliToday).toFixed(2) // 最大
              },
              {
                show: false,
                splitNumber: 1,
                min: -1, // 最小
                max: 1 // 最大
              }
            ],
            series: [
              {
                type: 'line',
                stack: '总量',
                areaStyle: {
                  normal: {
                    color: 'rgba(27,94,237,0.1)'
                  }
                },
                data: data.chartData,
                itemStyle: {
                  normal: {
                    color: '#1b5eed'
                  }
                }
              }
            ]
          }
        }
        trendChart.setOption(option)
        trendChart.getZr().on('click', params => {
          const pointInPixel = [params.offsetX, params.offsetY]
          if (trendChart.containPixel('grid', pointInPixel)) {
            let xIndex = trendChart.convertFromPixel({seriesIndex: 0}, pointInPixel)[0]
            this.styleObject = {
              left: params.offsetX + 'px',
              top: params.offsetY + 'px'
            }
            this.chartMenuClick = true
            // xIndex 为xAxis里数据的索引
            // toFix
            let range = []
            let times = data.timeList[xIndex].split(':')
            if (Number(times[1]) > 30) {
              range = [times[0] + ':30', (Number(times[0]) + 1) + ':00']
            } else {
              if (Number(times[0]) === 11) {
                range = ['11:00', '11:30']
              } else if (Number(times[0]) === 13) {
                range = ['11:30', '13:30']
              } else {
                range = [times[0] + ':00', times[0] + ':30']
              }
            }
            this.startTime = range[0]
            this.endTime = range[1]
          }
        })
      },
      HalfNetAmountTimeOut () {
        clearTimeout(this.HNATimeOut)
        getInvestorHalfNetAmount().then(resp => {
          this.timeSharingStatistics = resp
        })
        getIndividualCharts().then((el) => {
          let resp = el
          let lastCloseData = resp.lastEndIndexResult
          let ampliToday = resp.ampliToday
          let chartData = []
          let timeList = []
          let todayData = resp.realIndexChartData
          todayData.forEach((el) => {
            timeList.push(moment(el[0]).format('HH:mm'))
            chartData.push(el[4])
          })
          this.drawChart({lastCloseData, timeList, ampliToday, chartData})
        })
        this.HNATimeOut = setTimeout(this.HalfNetAmountTimeOut, 30000)
      }
    }
  }
</script>

<style>
  .theme_dark .el-table tr td.redClass {
    background-color: #14b9d6;
    opacity: 0.8;
  }

  .chart-menu {
    position: absolute;
    height: 20px;
    width: 80px;
    background: transparent;
  }
</style>
