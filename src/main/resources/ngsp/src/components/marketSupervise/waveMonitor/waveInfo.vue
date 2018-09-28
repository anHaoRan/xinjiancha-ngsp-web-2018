<template>
  <div class='chart-content'>
    <div id='marketFluctuation' class='panel-chart'></div>
  </div>
</template>
<script>
  import { getWaveInfoData } from '../../../service/marketSupervise/waveMonitor/index'

  let echarts = require('echarts')
  export default {
    data () {
      return {
        msg: '预警监控',
        amplitudeValue: '',
        timer: 0,
        refreshTime: 60 * 1000
      }
    },
    methods: {
      render () {
        getWaveInfoData().then((data) => {
          let result = data
          let myChart = document.getElementById('marketFluctuation')
          let echart = echarts.init(myChart)
          let option = {
            backgroundColor: '',
            grid: {
              left: '0%',
              right: '0%',
              top: '0%',
              bottom: '0',
              containLabel: true
            },
            series: [
              {
                name: '业务指标',
                type: 'gauge',
                radius: '100%',
                min: 0,
                max: 100,
                splitNumber: 18,
                detail: {
                  show: true,
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderWidth: 0,
                  borderColor: '#ccc',
                  width: 100,
                  height: 40,
                  offsetCenter: [0, '50%'],
                  formatter: function (v) {
                    if (v <= 50) {
                      return v.toFixed(2)
                    }
                    if (v < 56) {
                      return v.toFixed(2) + '\n一般-低'
                    }
                    if (v < 61) {
                      return v.toFixed(2) + '\n一般-中'
                    }
                    if (v < 67) {
                      return v.toFixed(2) + '\n一般-高'
                    }
                    if (v < 72) {
                      return v.toFixed(2) + '\n重大-低'
                    }
                    if (v < 78) {
                      return v.toFixed(2) + '\n重大-中'
                    }
                    if (v < 83) {
                      return v.toFixed(2) + '\n重大-高'
                    }
                    if (v < 89) {
                      return v.toFixed(2) + '\n特重大-低'
                    }
                    if (v < 94) {
                      return v.toFixed(2) + '\n特重大-中'
                    }
                    return v.toFixed(2) + '\n特重大-高'
                  },
                  textStyle: {
                    color: 'auto',
                    fontSize: 21,
                    fontWeight: 500,
                    fontFamily: 'Arial, Microsoft YaHei'
                  }
                },
                axisTick: {
                  lineStyle: {
                    color: '#1e2e51'
                  }
                },
                splitLine: {
                  lineStyle: {
                    width: 1,
                    color: '#1e2e51'
                  }
                },
                pointer: {
                  shadowColor: '#7b8fb9',
                  length: '80%',
                  width: 8,
                  color: 'auto'
                },
                axisLabel: {
                  show: true,
                  formatter: function (e) {
                    if (e < 51) {
                      return Math.round(e)
                    } else if (e < 61) {
                      return ''
                    } else if (e < 62) {
                      return '一般异常'
                    } else if (e < 67) {
                      return ''
                    } else if (e < 77) {
                      return ''
                    } else if (e < 78) {
                      return '重大异常'
                    } else if (e < 84) {
                      return ''
                    } else if (e < 94) {
                      return '特别重大异常'
                    }
                    return ''
                  },
                  textStyle: {
                    color: 'auto'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: [[0.5, '#2ECCFA'], [0.6667, '#FFFF00'], [0.8334, '#FF8000'], [1.0, '#CC3333']],
                    width: 24
                  }
                },
                data: [
                  {
                    value: result.riskIndicator,
                    name: ''
                  }
                ]
              }
            ]
          }
          window.onresize = echart.resize
          echart.clear()
          echart.setOption(option, true)
          let that = this
          this.timer = setTimeout(function () {
            that.render()
          }, that.refreshTime)
        })
      }
    },
    mounted () {
      this.render()
    },
    beforeDestroy () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  }
</script>
<style scoped lang='less'>
  //市场波动图
  .panel-chart {
    margin-top: 20px;
    width: 100%;
    height: 280px;
  }
</style>
