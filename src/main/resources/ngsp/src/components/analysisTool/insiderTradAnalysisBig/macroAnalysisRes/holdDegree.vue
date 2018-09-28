<template>
  <div class="hold-degree">
    <el-card style="margin: 0">
      <div class="hold-degreee-chart"
           style="width: 1600px;height:900px;margin: 0 auto"
           v-loading="queryResLoad"
           element-loading-spinner="el-icon-loading"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)">

      </div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { getHoldDegree } from '@/service/analysisTool/insiderTradAccountAnalysisBig/index'

  export default {
    //  name: "hold-degree",
    data () {
      return {
        msg: '持股集中度趋势图',
        queryRes: '',
        queryResLoad: false,
        flag: true
      }
    },

    methods: {
      draw (data) {
        let mychart = echarts.init($('.hold-degreee-chart')[0], this.gfnGetTheme())
        mychart.clear()
        window.onresize = mychart.resize
        mychart.setOption({
          legend: [
            {
              bottom: 30,
              // 纵向图例
              //  orient: 'vetrical',
              // 位置靠右
              left: 'center',
              data: ['收盘价', '成交量', '持股集中度', '持股数比例', '股东数比例'],
              textStyle: {
                color: '#aec0e6'
              },
              inactiveColor: '#7b8fb9'
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            backgroundColor: 'rgba(245,245,245,0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
              let obj = {top: 300}
              obj[['left'][+(pos[0] < size.viewSize[0])]] = 100
              return obj
            },
            formatter: function (param) {
              let tooltipCon = []
              for (let item of param) {
                if (item.seriesName == '收盘价') {
                  tooltipCon.push(item.name + '</br>' + item.marker + '收盘价: ' + item.data + '元<br/><br/>')
                } else if (item.seriesName == '成交量') {
                  tooltipCon.push(item.name + '</br>' + item.marker + '成交量: ' + item.data + '万股<br/><br/>')
                } else if (item.seriesName == '持股集中度') {
                  tooltipCon.push(item.name + '</br>' + item.marker + item.seriesName + ': ' + item.data + '%<br/>')
                } else if (item.seriesName == '持股数比例') {
                  tooltipCon.push(item.marker + item.seriesName + ': ' + item.data + '%<br/>')
                } else {
                  tooltipCon.push(item.marker + item.seriesName + ': ' + item.data + '%<br/><br/>')
                }
              }
              return tooltipCon.join('')
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
              backgroundColor: '#777'
            }
          },
          grid: [
            {
              top: '3%',
              left: '18%',
              right: '8%',
              height: '25%'
            },
            {
              top: '34%',
              left: '18%',
              right: '8%',
              height: '25%'
            },
            {
              left: '18%',
              right: '8%',
              top: '65%',
              height: '25%'
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: data.dateList,
              scale: true,
              boundaryGap: true,
              //  axisLine: {onZero: false},
              splitLine: {show: false},
              splitNumber: 10,
              min: 'dataMin',
              max: 'dataMax',
              axisPointer: {
                z: 100
              },
              axisLabel: {
                color: '#aec0e6'
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '##455579'
                }
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              data: data.dateList,
              scale: true,
              boundaryGap: true,
              //  axisLine: {onZero: false},
              axisTick: {show: false},
              splitLine: {show: false},
              //  axisLabel: {show: false},
              splitNumber: 10,
              min: 'dataMin',
              max: 'dataMax',
              axisLabel: {
                color: '#aec0e6'
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#455579'
                }
              }
            },
            {
              type: 'category',
              gridIndex: 2,
              data: data.dateList,
              scale: true,
              boundaryGap: false,
              //  axisLine: {onZero: false},
              axisTick: {show: false},
              splitLine: {show: false},
              //  axisLabel: {show: false},
              splitNumber: 10,
              min: 'dataMin',
              max: 'dataMax',
              axisLabel: {
                color: '#aec0e6'
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#455579'
                }
              }
            }
          ],
          yAxis: [
            {
              name: '单位：（元）',
              nameTextStyle: {
                color: '#aec0e6'
              },
              scale: true,
              splitArea: {
                show: false
              },
              axisLabel: {
                color: '#aec0e6'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#273757'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              }
            },
            {
              name: '单位：（万股）',
              nameTextStyle: {
                color: '#aec0e6'
              },
              scale: true,
              gridIndex: 1,
              splitNumber: 2,
              //  axisLabel: {show: false},
              axisLabel: {
                color: '#aec0e6'
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              },
              //  axisLine: {show: false},
              axisTick: {show: false},
              splitLine: {show: false}
            },
            {
              name: '单位：（%）',
              nameTextStyle: {
                color: '#aec0e6'
              },
              scale: true,
              gridIndex: 2,
              splitNumber: 2,
              //  axisLabel: {show: false},
              axisLabel: {
                color: '#aec0e6'
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              },
              //  axisLine: {show: false},
              axisTick: {show: false},
              splitLine: {show: false}
            }
          ],
          series: [
            {
              name: '收盘价',
              type: 'line',
              data: data.closePriceList,
              symbol: 'none',
              itemStyle: {
                normal: {
                  borderColor: null,
                  borderColor0: null
                }
              }
            },
            {
              name: '成交量',
              type: 'bar',
              data: data.detailList,
              xAxisIndex: 1,
              yAxisIndex: 1,
              // 图形默认小圆圈去除
              symbol: 'none',
              smooth: true,
              lineStyle: {
                normal: {opacity: 0.5}
              }
            },
            {
              name: '持股集中度',
              type: 'line',
              data: data.holdDegreeList,
              xAxisIndex: 2,
              yAxisIndex: 2,
              symbol: 'none',
              smooth: true,
              lineStyle: {
                normal: {opacity: 0.5}
              }
            },
            {
              name: '持股数比例',
              type: 'line',
              data: data.holdDegreeScaleList,
              xAxisIndex: 2,
              yAxisIndex: 2,
              symbol: 'none',
              smooth: true,
              lineStyle: {
                normal: {opacity: 0.5}
              }
            },
            {
              name: '股东数比例',
              type: 'line',
              data: data.stockHolderList,
              xAxisIndex: 2,
              yAxisIndex: 2,
              symbol: 'none',
              smooth: true,
              lineStyle: {
                normal: {opacity: 0.5}
              }
            }
          ]
        }, true)
      },
      getResultData () {
        if (this.flag) {
          this.flag = false
          this.queryResLoad = true
          getHoldDegree(this.$store.state.insiderTradAnalysis.currentTaskData.taskId).then((resp) => {
            //  getHoldDegree('20180329130121').then((resp) => {
            if (!$.isEmptyObject(resp)) {
              let dateList = [],
                closePriceList = [],
                detailList = [],
                holdDegreeList = [],
                holdDegreeScaleList = [],
                stockHolderList = []
              for (let i = 0; i < resp.length; i++) {
                dateList.push(resp[i].trading_date)
                closePriceList.push(resp[i].close_price)
                detailList.push(resp[i].trade_volume)
                holdDegreeList.push(resp[i].rate_of_hold1)
                holdDegreeScaleList.push(resp[i].rate_of_volume)
                stockHolderList.push(resp[i].rate_of_account)
              }
              let data = {
                dateList: dateList,
                closePriceList: closePriceList,
                detailList: detailList,
                holdDegreeList: holdDegreeList,
                holdDegreeScaleList: holdDegreeScaleList,
                stockHolderList: stockHolderList
              }
              this.queryRes = data
              this.draw(data)
              this.queryResLoad = false
            } else {
              this.flag = true
            }
          })
        }
      }
    },
    mounted () {
      //  this.getResultData();
    }
  }
</script>

<style scoped>

</style>
