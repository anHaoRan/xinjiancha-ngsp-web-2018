<template>
  <div class="stock-time-echarts" id="stock-time-echarts">
  </div>
</template>

<script>
  import MinxinVue from '../ManipulationAnalysisOrAbnormalTradingTab/Mixin'
  import { postStockTimeData } from '@/service/analysisTool/ManipulateAnalysisList/index'
  import moment from 'moment'

  export default {
    name: 'stock-time-echarts',
    props: {
      yearMonthDay: [Date, String]
    },
    components: {},
    mixins: [MinxinVue],
    data () {
      return {
        echartData: []
      }
    },
    computed: {},
    watch: {
      yearMonthDay: {
        handler () {
          this.ajaxStockTimeData()
        },
        immediate: true
      }
    },
    methods: {
      ajaxStockTimeData () {
        let params = {
          indexCode: this.selectParams.indexCode,
          startTime: '093000',
          endTime: '150000',
          startDate: this.yearMonthDay,
          endDate: this.yearMonthDay
        }
        postStockTimeData(params)
        .then((resp) => {
          if (resp.MINUTE_DATA.length === 0) {
            this.$message.warning('查询数据为空')
            this.hideLoading()
            return
          }
          this.echartData = resp.MINUTE_DATA
          this.dealWithOptions(this.echartData)
        })
      },
      dealWithOptions (res) {
        let timeList = []
        let volumes = []
        let barData = []
        for (let key of res) {
          timeList.push(moment(key[0]).format('HH:mm:ss'))
          volumes.push(key[4])
          barData.push(key[5])
        }

        let seriseData = [
          {
            name: this.selectParams.indexName,
            type: 'line',
            data: volumes,
            smooth: true,
            symbol: 'emptyCircle',
            symbolSize: 6
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
                  let volumesColor = ''
                  if (!params.dataIndex) {
                    if ((res[0][4] - res[0][1]) > 0) {
                      volumesColor = '#6b221c'
                    } else {
                      volumesColor = '#075859'
                    }
                  } else {
                    if (res[params.dataIndex][5] > res[params.dataIndex - 1][5]) {
                      volumesColor = '#6b221c'
                    } else {
                      volumesColor = '#075859'
                    }
                  }
                  return volumesColor
                }
              }
            }
          }
        ]
        this.options.xAxis[0].data = timeList
        this.options.xAxis[1].data = timeList
        this.options.series = seriseData
        this.drawEcharts()
        this.registeredEchartClick()
      },
      registeredEchartClick () {
        this.echart.on('click', (val) => {
          if (val.seriesType === 'line') {
            this.$emit('update', val.name)
          }
        })
      }
    },
    created () {
      this.options = {
        title: {},
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
            let obj = {top: 35}
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
            return obj
          }
        },
        axisPointer: {
          link: {xAxisIndex: 'all'}
        },
        grid: [
          {
            left: '10%',
            right: '0',
            top: '10%',
            height: '40%',
            containLabel: false,
            show: true,
            borderColor: '#263657',
            borderWidth: 1
          },
          {
            left: '10%',
            right: '0',
            height: '20%',
            top: '65%',
            containLabel: false,
            show: true,
            borderColor: '#263657',
            borderWidth: 1
          }
        ],
        xAxis: [
          {
            type: 'category',
            min: 'dataMin',
            max: 'dataMax',
            boundaryGap: false,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#506798'
              }
            },
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
            min: 'dataMin',
            max: 'dataMax',
            boundaryGap: false,
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            scale: true,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#506798'
              }
            },
            axisLabel: {
              color: '#506798'
            }
          },
          {
            name: '成交数量',
            type: 'value',
            gridIndex: 1,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#263657'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#506798'
              }
            },
            axisLabel: {
              color: '#506798',
              formatter: function (value, index) {
                if (index === 0) {
                  return 0
                } else {
                  return Number(value) / 1000000 + '万手'
                }
              }
            },
            splitNumber: 1
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 45,
            end: 55
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            top: '90%',
            start: 45,
            end: 55,
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
        series: []
      }
    },
    mounted () {
      this.initEcharts('stock-time-echarts')
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  #stock-time-echarts {
    height: 350px
  }
</style>
