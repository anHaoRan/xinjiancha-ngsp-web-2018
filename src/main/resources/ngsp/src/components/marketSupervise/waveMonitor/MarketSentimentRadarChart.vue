<template>
  <el-card>
    <div slot='header' class='clearfix'>
      <span class='title'>市场情绪雷达图</span>
    </div>
    <div id='radarChart' class='marketRadarChart'></div>
  </el-card>
</template>

<script>
  import {getFluctradargraph} from '@/service/marketSupervise'
  let echarts = require('echarts');
  export default {
    components: {},
    name: 'market-sentiment-radar-chart',
    data() {
      return {
        echart: null,
        options: null,
        TdatetimerFun: null,
        TdatereloadTime: 60
      }
    },
    watch: {},
    created() {
    },
    mounted() {
      this.initEcharts()
      this.ajaxFluctradargraph()
      this.TdatetimerFun = setInterval(this.ajaxFluctradargraph, this.TdatereloadTime * 1000)
    },
    beforeDestroy() {
      if (this.TdatetimerFun) {
        clearInterval(this.TdatetimerFun)
      }
    },
    methods: {
      initEcharts() {
        let myLine = document.getElementById('radarChart');
        this.echart = echarts.init(myLine, this.gfnGetTheme());
        this.gfnEchartShowLoading(this.echart)
      },
      drawEcharts(res) {
        let indicatorData = []
        let seriesData = []
        for (let key of res) {
          indicatorData.push({name: key.label, max: 5, color: '#7b8fb9'})
          seriesData.push(key.score)
        }
        this.options = {
          radar: {
            name: {},
            indicator: indicatorData,
            splitLine: {
              lineStyle: {
                color: ['#293757']
              }
            },
            axisLine: {
              lineStyle: {
                color: ['#293757']
              }
            },
            splitArea: {
              areaStyle: {
                // color: ['#075859', '#0c5c20', '#376310', '#675716', '#6b221c']
                 color: ['#12bba5', '#2ECCFA', '#FFFF00', '#FF8000', '#CC3333']
              }
            }
          },
          series: [
            {
              type: 'radar',
              areaStyle: {
                color: 'rgba(0,0,204, 1)'
              },
              lineStyle: {
                color: 'rgba(0,51,153, 0.9)'
              },
              data: [{
                value: seriesData,
                name: '情绪表达',
                symbolSize: '4',
                itemStyle: {
                  color: 'rgba(255,255,255,1)'
                },
                label: {
                  normal: {
                    show: true,
                    color: 'rgba(255,255,255,1)',
                    fontSize: 14
                  }
                }
              }]
            }
          ]
        };
        this.echart.clear();
        this.echart.setOption(this.options);
        this.echart.hideLoading();
      },
      ajaxFluctradargraph() {
        getFluctradargraph().then((res) => {
          for (let key of res) {
            switch (key.radar_type) {
              case 'avgzdf':
                key.label = '当日所有个股平均涨幅'
                break
              case 'median':
                key.label = '当日所有个股\n中位数涨幅'
                break
              case 'fivezdf':
                key.label = '近10个交易日累计\n涨/跌幅最大的5只\n个股平均涨/跌幅'
                break
              case 'sumzdf':
                key.label = '当日涨跌停家数'
                break
              case 'tenzdf':
                key.label = '昨日10只最大涨幅股票\n今日平均涨幅'
                break
              case 'tradamt':
                key.label = '当日成交额前50家\n个股日成交额占比'
                break
            }
          }
          this.drawEcharts(res)
        })
      }
    }
  }

</script>

<style lang='less'>
  .marketRadarChart {
    height: 300px;
  }
</style>
