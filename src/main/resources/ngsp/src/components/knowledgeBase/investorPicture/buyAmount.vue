<template>
  <div
    v-loading="loading"
    element-loading-text="正在加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0,0,0,0.8)"
  >
    <el-card>
      <div slot="header" class="tabStyle">
        净买入额：{{netTradeValue}}
        <div style="display: none;">
          <el-tabs v-model='activeName2' type='card' @tab-click='changeTabs'>
            <el-tab-pane label='一年' name='buyFirst'>
            </el-tab-pane>
            <el-tab-pane label='半年' name='buySecond'>
            </el-tab-pane>
            <el-tab-pane label='3个月' name='buyThree'>
            </el-tab-pane>
            <el-tab-pane label='1个月' name='buyFour'>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div id='buyAmount' style="height: 350px"></div>
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
        activeName2: 'buyFour',
        netTradeValue: '',
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
        this.period = val
        let params = {
          key: JSON.stringify({accountId: this.accountId, period: this.period}),
          method: 'tradeLog'
        }
        this.loading = true
        let myLine = document.getElementById('buyAmount');
        let echart = echarts.init(myLine);
        let option = echart.getOption()
        postIntestorPic(params).then(resp => {
          this.loading = false
          let res = resp
          this.netTradeValue = res.netTradeValue
          let time = []
          let buy = []
          let sale = []
          let netBuy = []
          res.dailySeq.forEach((el) => {
            time.push(moment(el.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))
            buy.push(el.btv)
            sale.push(-el.stv)
            netBuy.push(el.ntv)
          })
          let data1 = ['日买入', '日卖出', '净买入']
          let data2 = [
            {
              name: '日买入',
              type: 'bar',
              stack: '总量',
              color: '#3366cc',
              data: buy
            },
            {
              name: '日卖出',
              type: 'bar',
              stack: '总量',
              color: '#ffcc66',
              data: sale
            },
            {
              name: '净买入',
              type: 'line',
              color: '#ff6633',
              data: netBuy
            }
          ]
          option.legend[0].data = data1
          option.xAxis[0].axisLabel = {
            color: '#506798'
          }
          option.xAxis[0].data = time
          option.yAxis[0].axisLabel = {
            color: '#506798'
          }
          option.series = data2
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
          method: 'tradeLog'
        }
        postIntestorPic(params).then(resp => {
          this.loading = false
          let res = resp
          this.netTradeValue = res.netTradeValue
          let time = []
          let buy = []
          let sale = []
          let netBuy = []
          res.dailySeq.forEach((el) => {
            time.push(moment(el.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'))
            buy.push(el.btv)
            sale.push(-el.stv)
            netBuy.push(el.ntv)
          })
          let dataList = {
            data1: ['日买入', '日卖出', '净买入'],
            time: time,
            data2: [
              {
                name: '日买入',
                type: 'bar',
                stack: '总量',
                color: '#3366cc',
                data: buy
              },
              {
                name: '日卖出',
                type: 'bar',
                stack: '总量',
                color: '#ffcc66',
                data: sale
              },
              {
                name: '净买入',
                type: 'line',
                color: '#ff6633',
                data: netBuy
              }
            ]
          }
          this.drawBarChart('buyAmount', dataList)
        })
      },
      drawBarChart(id, dataList) {
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
            // formatter: function (params) {
            //   let texts = params[0].name + '<br/>'
            //   params.forEach((el) => {
            //     if (el.seriesType === 'bar') {
            //       texts += el.marker + el.seriesName + ':' + (el.value[1] / 100000000).toFixed(2) + '亿元<br/>'
            //     } else {
            //       texts += el.marker + el.seriesName + ':' + el.value + '%<br/>'
            //     }
            //   })
            //   return texts
            // }
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
                name: '净买入额趋势图'
              }
            }
          },
          legend: {
            inactiveColor: '#455579',
            top: 10,
            data: dataList.data1,
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
            data: dataList.time
          },
          yAxis: [
            {
              name: '市值(亿元)',
              nameTextStyle: {
                color: '#506798'
              },
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
          series: dataList.data2
        }, true)
      }
    }
  }
</script>

<style scoped>

</style>
