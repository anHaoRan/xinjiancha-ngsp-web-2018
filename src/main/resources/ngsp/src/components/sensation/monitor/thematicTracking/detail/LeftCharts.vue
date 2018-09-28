<template>
    <div class="left-charts" id="left-charts">

    </div>
</template>

<script>
  import VueMixin from '../../../VueMixin'
  import { json } from '../../../home/1111'
  import moment from 'moment'

  export default {
    name: 'left-charts',
    props: [],
    components: {},
    mixins: [VueMixin],
    data () {
      return {
        heatTotalNum: '1111'
      }
    },
    computed: {},
    watch: {},
    created () {
      this.options = {
        title: [
          {
            text: `所选期间舆情总热度：{num|${this.heatTotalNum}}`,
            left: '3%',
            top: '3%',
            textStyle: {
              color: '#ffffff',
              fontSize: 16,
              rich: {
                num: {
                  fontSize: 20,
                  color: this.gfnFormatSecurityColor(1)
                }
              }
            }
          }
        ],
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
          }
        },
        legend: {
          data: ['乐观', '中性', '负面', '官媒', '民间媒体'],
          bottom: '10'
        },
        axisPointer: {
          link: {xAxisIndex: 'all'}
        },
        xAxis: [],
        yAxis: [],
        series: []
      }
    },
    mounted () {
      this.initEcharts('left-charts')
      this.ajax()
    },
    beforeDestroy () {
    },
    methods: {
      dealWithEchartData (rawData) {
        // 图形数据结构处理
        let indexData = rawData
        let timeList = []
        let chartData = []
        let volumes = []
        let lastCloseData = indexData.lastClose
        let todayData = indexData.chartData
        let maxPrice = indexData.maxPrice
        let minPrice = indexData.minPrice
        let increase = indexData.increase
        let rate = indexData.amplitude
        rate = rate.toFixed(2)
        todayData.forEach((el, i) => {
          timeList.push(moment(el[0], 'HHmm').format('HH:mm'))
          chartData.push([i, el[3], el[1], el[4], el[2]])
          volumes.push(el[5])
        })
        return {
          timeList,
          lastCloseData,
          chartData,
          rate,
          maxPrice,
          minPrice,
          increase
        }
      },
      ajax () {
        let data = this.dealWithEchartData(json)
        let itemStyle = {
          color: '#409EFF'
        }
        this.options.xAxis = [
          {
            type: 'category',
            data: data.timeList,
            boundaryGap: false,
            splitLine: {
              show: false,
              interval: 29,
              lineStyle: {
                type: 'solid',
                color: '#263657'
              }
            },
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: '#263657'
              }
            },
            axisTick: {
              show: false,
              interval: 29,
              length: 8,
              lineStyle: {
                color: '#aec0e6'
              }
            },
            axisLabel: {
              color: '#506798',
              interval: 29,
              formatter: function (value, index) {
                let str = value
                if (index == data.timeList.length - 1) {
                  str += '以后'
                }
                return str
              }
            }
          }
        ]
        this.options.yAxis = [
          {
            scale: true,
            axisLabel: {
              color: '#506798'
            },
            axisTick: {show: false},
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
            position: 'left',
            min: data.minPrice,
            tickInterval: data.increase,
            max: data.maxPrice
          },
          {
            scale: true,
            axisLabel: {
              color: '#506798',
              formatter: function (value) {
                return value + '%'
              }
            },
            splitNumber: 1,
            axisTick: {show: false},
            axisLine: {
              show: true,
              lineStyle: {
                color: '#263657'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#263657',
                type: 'solid'
              }
            },
            position: 'right',
            min: 0 - data.rate,
            max: data.rate
          }
        ]
        this.options.series = [
          {
            name: '价格',
            type: 'line',
            yAxisIndex: 1,
            data: data.chartData,
            areaStyle: {
              opacity: 0.2
            },
            smooth: true
          },
          {name: '乐观', type: 'scatter', itemStyle: itemStyle},
          {name: '中性', type: 'scatter', itemStyle: itemStyle},
          {name: '负面', type: 'scatter', itemStyle: itemStyle},
          {name: '官媒', type: 'scatter', itemStyle: itemStyle},
          {name: '民间媒体', type: 'scatter', itemStyle: itemStyle}
        ]
        this.drawEcharts()
        this.echart.on('legendselectchanged', (val) => {
          console.log(val)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    .left-charts {
        height: 400px;
    }
</style>