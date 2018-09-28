<template>
  <el-card class="small-card">
    <div class="small-card-title">每日预警走势</div>
    <div class="small-card-content">
      <div id="alarmtrend" :style="{
          'height':newHeight+'px'
      }"></div>
    </div>
  </el-card>
</template>

<script>
  import MinxinVue from './Mixin'
  import { getAlarmTrend } from '@/service/homepage/index'

  export default {
    props: ['height'],
    mixins: [MinxinVue],
    data () {
      return {}
    },
    watch: {
      height: {
        handler () {
          this.$nextTick(function () {
            this.initEcharts('alarmtrend')
            this.ajaxGetAlarmTrend()
          })
        },
        immediate: true
      }
    },
    computed: {
      newHeight () {
        return this.height ? Number(this.height) - 48 : this.height
      }
    },
    methods: {
      ajaxGetAlarmTrend () {
        getAlarmTrend().then(res => {
          let {count, alarmData} = res
          let map = {
            'td': 0,
            'avd': 0
          }
          for (let key of count.metaData) {
            map[key.type] = key.alarm_count
          }
          this.options.title.text = `{title|${map.td}}\n{text|今日处理量}\n\n{title|${map.avd}}\n{text|平均处理量}`
          let obj = {
            xdata: [],
            series: []
          }
          for (let key of alarmData.metaData) {
            obj.xdata.push(key.alarm_date)
            obj.series.push(key.alarm_count)
          }
          this.options.xAxis[0].data = obj.xdata
          this.options.series[0].data = obj.series
          this.drawEcharts()
        })
      }
    },
    created () {
      this.options = {
        title: {
          text: '',
          y: 'center',
          textStyle: {
            color: '#7b8fb9',
            fontSize: 14,
            fontWeight: 'lighter',
            rich: {
              title: {
                fontSize: 16
                // color: '#333'
              },
              text: {
                fontSize: 12
                // color: '#666666'
              }
            }
          }
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
            let obj = {top: 35}
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
            return obj
          }
        },
        grid: [
          {
            left: '25%',
            right: '4%',
            top: '10%',
            bottom: '10%',
            containLabel: false
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        series: [{
          name: '预警',
          type: 'line',
          smooth: false,
          areaStyle: {
            normal: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(63,94,253,0.5)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(63,94,253,0.2)'
                  }
                ]
              }
            }
          }
        }]
      }
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less">

</style>
