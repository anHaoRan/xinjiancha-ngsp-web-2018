<template>
    <div class="day-k" :id="`day-k-${index}`">2</div>
</template>

<script>
  import VueMixin from '../../../VueMixin'
  import moment from 'moment'

  export default {
    name: 'day-k',
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
            ]
            this.options.yAxis = [
              {
                scale: true,
                axisLabel: {
                  color: '#506798'
                },
                splitNumber: 4,
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
            ]
            this.options.series = [
              {
                type: 'candlestick',
                data: data.volumes,
                smooth: true,
                itemStyle: {
                  color: '#ff402b',
                  color0: '#12bba5',
                  borderColor: null,
                  borderColor0: null
                }
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
          position: function (pos, params, el, elRect, size) {
            if (pos[0] < size.viewSize[0] / 2) {
              return [pos[0] + 20, '36']
            }
            return [pos[0] - 180, '36']
          },
          formatter: function (params) {
            let param = params[0]
            let fm = `日期：${param.name}<br/>`
            fm += `<hr size=1 style="margin: 3px 0">`
            fm += `开盘：${param.data[1]} <br/>`
            fm += `收盘：${ param.data[2] }<br/>`
            fm += `最低：${ param.data[3] }<br/>`
            fm += `最高：${ param.data[4] }<br/>`
            fm += `涨跌值：${ param.data[8] }<br/>`
            fm += `涨跌幅：${ param.data[6] }%<br/>`
            fm += `振幅：${ param.data[7] }%<br/>`
            fm += `总成交量：${ (param.data[5] / 100000000).toFixed(2) }亿股<br/>`
            return fm
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
        dataZoom: [
          {
            show: true,
            type: 'inside',
            start: 0,
            end: 100,

          }
        ],
        xAxis: [],
        yAxis: [],
        series: []
      }
    },
    mounted () {
      this.initEcharts(`day-k-${this.index}`)
    },
    beforeDestroy () {
    },
    methods: {
      dealWithEchartData (rawData) {
        // 图形数据结构处理
        let timeList = []
        let volumes = []
        let barData = []
        let secName = rawData.secName
        for (let key of rawData.chartData) {
          timeList.push(moment(key[0], 'YYYYMMDD').format('YYYY/MM/DD'))
          volumes.push([
            key[1], // 开盘价格
            key[2], // 收盘价格
            key[3], // 最低价格
            key[4], // 最高价格
            key[5], // 成交量
            key[7], // 涨跌
            key[8], // 涨跌幅
            key[9] // 振幅
          ])
          barData.push((key[6] / 100000000).toFixed(2))
        }
        return {
          secName,
          timeList,
          volumes,
          barData
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    .day-k {
        height: 200px;
    }
</style>