<template>
  <div
    v-loading="loading"
    element-loading-text="正在加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header" class="tabStyle">
        账户盈亏
        <div style="display: none;">
          <el-tabs v-model='activeName3' type='card' @tab-click='changeTabs'>
            <el-tab-pane label='一年' name='accFirst'>
            </el-tab-pane>
            <el-tab-pane label='半年' name='accSecond'>
            </el-tab-pane>
            <el-tab-pane label='3个月' name='accThree'>
            </el-tab-pane>
            <el-tab-pane label='1个月' name='accFour'>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div id='accountProfit' style="height: 350px"></div>
    </el-card>
  </div>
</template>

<script>
  import {postIntestorPic} from '../../../service/knowledgeBase/investorPicture/index'
  import echarts from 'echarts'
  import moment from 'moment'

  export default {
    components: {},
    data() {
      return {
        activeName3: 'accFour',
        period: '30',
        loading: true
      }
    },
    props: ['accountId', 'periodDate'],
    watch: {
      accountId: function (param1, param2) {
        this.getChartsData()
      },
      periodDate: function (val) {
        this.loading = true
        this.period = val
        let params = {
          key: JSON.stringify({accountId: this.accountId, period: this.period}),
          method: 'acctProfit'
        }
        let myLine = document.getElementById('accountProfit');
        let echart = echarts.init(myLine);
        let option = echart.getOption()
        postIntestorPic(params).then(resp => {
          this.loading = false
          let res = resp.data
          let xAxis = []
          let pfData = []
          res.forEach((el) => {
            xAxis.push(moment(el.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))
            pfData.push(el.pf)
          })
          option.xAxis[0].axisLabel = {
            color: '#506798'
          }
          option.xAxis[0].data = xAxis
          option.yAxis[0].axisLabel = {
            color: '#506798'
          }
          option.series = pfData
          echart.setOption(option)
        })
      }
    },
    mounted() {
      this.getChartsData()
    },
    methods: {
      changeTabs() {
      },
      getChartsData() {
        this.loading = true
        let params = {
          key: JSON.stringify({accountId: this.accountId, period: this.period}),
          method: 'acctProfit'
        }
        postIntestorPic(params).then(resp => {
          this.loading = false
          let res = resp.data
          let xAxis = []
          let pfData = []
          if (res) {
            res.forEach((el) => {
              xAxis.push(moment(el.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))
              pfData.push(el.pf)
            })
          }
          let data = {xAxis, seriesData: pfData}
          this.drawBarChart('accountProfit', data)
        })
      },
      drawBarChart(id, data) {
        let myLine = document.getElementById(id)
        let echart = echarts.init(myLine, this.gfnGetTheme())
        echart.clear()
        window.onresize = echart.resize
        echart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: '5%',
            containLabel: true
          },
          toolbox: {
            right: '5%',
            itemSize: 18,
            feature: {
              saveAsImage: {
                name: '账户盈亏趋势图'
              }
            }
          },
          legend: {
            inactiveColor: '#455579',
            top: 10,
            data: ['日收益'],
            textStyle: {
              color: '#506798'
            }
          },
          xAxis: {
            axisLabel: {
              color: '#506798'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#273757'
              }
            },
            type: 'category',
            boundaryGap: 'false',
            data: data.xAxis
          },
          yAxis: [
            {
              show: true,
              type: 'value',
              position: 'left',
              splitNumber: 4,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#273757'
                }
              },
              axisLabel: {
                color: '#506798'
                // formatter: function (params) {
                //   return params / 100000000
                // }
              },
              axisLine: {
                lineStyle: {
                  color: '#273757'
                }
              }
            }
          ],
          series: [
            {
              name: '日收益',
              type: 'bar',
              // stack: '总量',
              itemStyle: {
                normal: {
                  color: function (val) {
                    if (Number(val.data) > 0) {
                      return '#ff402b'
                    } else {
                      return '#12bba5'
                    }
                  }
                }
              },
              data: data.seriesData
            }
          ]
        }, true)
      }
    }
  }
</script>

<style scoped>

</style>
