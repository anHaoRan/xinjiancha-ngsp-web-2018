<template>
  <div class="single-account-change">
    <el-card style="margin-top: 0" v-loading="queryResLoad"
             element-loading-spinner="el-icon-loading"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)">
      <div style="text-align: center" v-show="showDiffVal" >持股单一账户持股占比(剔除大股东)期末与期初差值：{{diffValue}}</div>
      <div class="single-account-change-chart" style="width: 1400px;height: 500px;margin: 0 auto" ></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import {getSingleAccount} from '../../../../service/analysisTool/insiderTradAccountAnalysis'

export default {
  //  name: "single-account-change",
  data() {
    return {
      msg: '持股单一账户变化图',
      diffValue: '',
      queryRes: '',
      showDiffVal: false,
      queryResLoad: false,
      flag: true

    }
  },
  methods: {
    getResultData() {
      // if (this.flag) {
      //   this.flag = false
      //   this.queryResLoad = true
        getSingleAccount(this.$store.state.insiderTradAnalysis.currentTaskData.taskId).then((resp) => {
          //  getSingleAccount('20180329130121').then((resp) => {
          // if (!$.isEmptyObject(resp)) {
            this.queryRes = resp;
            this.draw(resp)
            this.queryResLoad = false
            this.showDiffVal = true
          // } else {
          //   this.flag = true
          // }
          let macroAnalyRequestCount = this.$store.state.insiderTradAnalysis.macroAnalyRequestCount + 1
          this.$store.commit('changeMacroAnalyRequestCount', macroAnalyRequestCount)
        })
      // }
    },
    draw(respData) {
      let dateList = [],
        closePriceList = [],
        singleAccountScaleList = [];
      for (let i = 0; i < respData.length; i++) {
        dateList.push(respData[i].trading_date);
        closePriceList.push(respData[i].close_price);
        singleAccountScaleList.push(respData[i].f1_hold_raito);//  单一账户持股占比
      }
      this.diffValue = respData[respData.length - 1].f1_hold_raito - respData[0].f1_hold_raito + '%'
      let data = {
        dateList: dateList,
        closePriceList: closePriceList,
        singleAccountScaleList: singleAccountScaleList
      }
      let mychart = echarts.init($('.single-account-change-chart')[0], this.gfnGetTheme());
      let option = {//
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          show: true,
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#455579'
            }
          },
          axisLabel: {
            show: true,
            color: '#aec0e6',
            lineStyle: {
              color: '#455579'
            }
          },
          scale: true,
          splitNumber: 10,
          splitLine: {
            show: false,
            lineStyle: {
              color: '#455579',
              type: 'solid'
            }
          },
          data: data.dateList
        },
        yAxis: [{
          name: '收盘价  单位：（元）',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#aec0e6'
          },
          type: 'value',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#455579'
            }
          },
          axisLabel: {
            show: true,
            color: '#aec0e6',
            lineStyle: {
              color: '#455579'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#273757',
              type: 'dashed'
            }
          }
        },
        {
          name: '持股单一账户持股占比（剔除大股东）  单位：（%）',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#aec0e6'
          },
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#455579'
            }
          },
          axisLabel: {
            show: true,
            color: '#aec0e6',
            lineStyle: {
              color: '#455579'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#273757',
              type: 'dashed'
            }
          }
        }],
        grid: {
          left: '40',
          right: '50',
          top: '30',
          bottom: '60',
          containLabel: true
        },
        legend: {
          orient: 'horizontal',
          bottom: '20',
          y: 'bottom',
          data: ['收盘价', '持股单一账户持股占比（剔除大股东）'],
          inactiveColor: '#7b8fb9',
          textStyle: {
            color: '#aec0e6'
          }
        },
        calculable: true,
        series: [
          {
            name: '收盘价',
            type: 'line',
            smooth: true,
            yAxis: 1,
            itemStyle: {
              color: '#4a57ff',
              normal: {
                color: '#4a57ff'
              }
            },
            data: data.closePriceList
          },
          {
            name: '持股单一账户持股占比（剔除大股东）',
            type: 'line',
            smooth: true,
            // symbol: 'none',
            // sampling: 'average',
            yAxisIndex: 1,
            itemStyle: {
              color: '#18b2f2',
              normal: {
                color: '#18b2f2'
              }
            },
            data: data.singleAccountScaleList
          }
        ]
      }
      window.onresize = mychart.resize;
      mychart.setOption(option)
    }
  },
  mounted() {
    //  this.getResultData()
  }
}
</script>

<style scoped>
  .single-account-change-chart {
    margin-top: 30px;
  }
</style>
