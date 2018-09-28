<template>
    <div class="time-sharing" :id="`time-sharing-${index}`">1</div>
</template>

<script>
  import VueMixin from '../../../VueMixin'
  import moment from 'moment'

  export default {
    name: 'time-sharing',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    components: {},
    mixins: [VueMixin],
    data () {
      return {
        index: Math.round(Math.random() * 1000000)
      }
    },
    computed: {},
    watch: {
      data: {
        handler () {
          let data = this.dealWithEchartData(this.data)
          this.$nextTick(function () {
            this.options.title.text = data.secName
            this.options.xAxis = [
              {
                type: 'category',
                data: data.timeList,
                boundaryGap: false,
                splitLine: {
                  show: true,
                  interval: 29,
                  lineStyle: {
                    type: 'solid',
                    color: '#263657'
                  }
                },
                axisLine: {
                  show: false,
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
                  interval: 29
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
                splitNumber: 1,
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
                  show: false,
                  lineStyle: {
                    color: '#263657'
                  }
                },
                splitLine: {
                  show: true,
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
              // {
              //   name: '',
              //   type: 'bar',
              //   yAxisIndex: 1,
              //   data: data.chartData,
              //   smooth: true
              // },
              {
                name: '价格',
                type: 'line',
                yAxisIndex: 1,
                data: data.chartData,
                smooth: true
              }
            ]
            this.drawEcharts()
          })
        },
        immediate: true,
        deep: true
      }
    },
    created () {
      let that = this
      this.options = {
        title: {
          text: ''
        },
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
          formatter: function (params) {
            let texts = params[0].name + '<br/>'
            for (let key of params) {
              if (key.seriesName == '价格') {
                texts += `${key.marker}${key.seriesName}:${key.value[2]}<br/>`
                texts += `${key.marker}涨跌值:<i class='${that.gfnFormatSecurityClass(key.value[4])}'>${ key.value[4]}</i><br/>`
                texts += `${key.marker}涨跌幅:<i class='${that.gfnFormatSecurityClass(key.value[1])}'>${ key.value[1]}%</i><br/>`
              }
            }
            return texts
          }
        },
        axisPointer: {
          link: {xAxisIndex: 'all'}
        },
        grid: [
          {
            left: '60',
            right: '60',
            top: '40',
            bottom: '30',
            containLabel: false,
            show: true,
            borderColor: '#263657',
            borderWidth: 1
          }
        ],
        xAxis: [],
        yAxis: [],
        series: []
      }
    },
    mounted () {
      this.initEcharts(`time-sharing-${this.index}`)
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
        let secName = indexData.secName
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
          secName,
          timeList,
          lastCloseData,
          chartData,
          rate,
          maxPrice,
          minPrice,
          increase
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    .time-sharing {
        height: 200px;
    }
</style>