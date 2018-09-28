<!--股权集中度图表组件-->
<template>
  <div id="echartsContainer" class="echarts-container" :class="{'echartsHeight': defaultOption.dataset.source.length}">
    <!--<div v-if="!defaultOption.dataset.source.length" class="placeholderText">每日持股集中度趋势图暂无数据</div>-->
  </div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    props: {
      propsData: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        defaultOption: {
          title: {
            text: '每日持股集中度趋势图'
          },
          color: ['#009fff', '#3371f5', '#ff0000', '#b17022', '#12a52c'],
          legend: {
            textStyle: {
              color: '#FAF0E6'
            }
          },
          tooltip: {trigger: 'axis', axisPointer: {type: 'cross'}},
          toolbox: {
            show: true,
            right: '25%',
            top: 0,
            itemSize: 25,
            iconStyle: {
              // color: '#fff'
            },
            feature: {
              /* dataZoom: {
               yAxisIndex: 'none'
               }, */
              saveAsImage: {
                type: 'jpeg',
                title: 'jpg图片导出',
                backgroundColor: '#1b2b4e'
              }
            }
          },
          /* dataZoom: [
           {
           type: 'inside',
           start: 50,
           end: 100
           },
           {
           type: 'slider',
           show: true,
           y: '90%',
           start: 50,
           end: 100,
           bottom: 30
           }
           ], */
          axisPointer: {
            link: {xAxisIndex: 'all'}
          },
          grid: [
            {x: '5%', y: '5%', width: '90%', height: '23%'},
            {x: '5%', y: '36%', width: '90%', height: '23%'},
            {x: '5%', y: '67%', width: '90%', height: '23%'},
            {x: '5%', y: '99%', width: '90%', height: '23%'}
          ],
          xAxis: [
            {
              type: 'category',
              gridIndex: 0,
              name: '交易日期',
              nameLocation: 'start',
              nameTextStyle: {color: '#fff', fontWeight: 600},
              axisLabel: {rotate: 20, interval: 0}
            },
            {
              type: 'category',
              gridIndex: 1,
              name: '交易日期',
              nameLocation: 'start',
              nameTextStyle: {color: '#fff', fontWeight: 600},
              axisLabel: {rotate: 20, interval: 0}
            },
            {
              type: 'category',
              gridIndex: 2,
              name: '交易日期',
              nameLocation: 'start',
              nameTextStyle: {color: '#fff', fontWeight: 600},
              axisLabel: {rotate: 20, interval: 0}
            }
          ],
          yAxis: [
            {
              type: 'value',
              gridIndex: 0,
              name: '收盘价',
              nameTextStyle: {color: '#fff', fontWeight: 600},
              position: 'right'
            },
            {
              type: 'value',
              gridIndex: 1,
              name: '成交量',
              nameTextStyle: {color: '#fff', fontWeight: 600},
              position: 'right'
            },
            {
              type: 'value',
              gridIndex: 2,
              name: '持股比例',
              nameTextStyle: {color: '#fff', fontWeight: 600},
              position: 'right'
            }
          ],
          dataset: {
            dimensions: ['trade_date', 'close_price', 'trade_vol', 'hold_muster1', 'above_avg_bal_ratio', 'above_avg_cnt_ratio'],
            // source: []
            source: [
              {
                trade_date: '2012-02-03',
                close_price: '687',
                trade_vol: '353',
                hold_muster1: 11,
                above_avg_bal_ratio: 39,
                above_avg_cnt_ratio: 288
              },
              {
                trade_date: '2012-02-04',
                close_price: '75',
                trade_vol: '363',
                hold_muster1: 141,
                above_avg_bal_ratio: 79,
                above_avg_cnt_ratio: 488
              },
              {
                trade_date: '2012-02-05',
                close_price: '444',
                trade_vol: '133',
                hold_muster1: 113,
                above_avg_bal_ratio: 49,
                above_avg_cnt_ratio: 388
              },
              {
                trade_date: '2012-02-06',
                close_price: '787',
                trade_vol: '373',
                hold_muster1: 511,
                above_avg_bal_ratio: 29,
                above_avg_cnt_ratio: 99
              },
              {
                trade_date: '2012-02-07',
                close_price: '222',
                trade_vol: '83',
                hold_muster1: 68,
                above_avg_bal_ratio: 36,
                above_avg_cnt_ratio: 68
              },
              {
                trade_date: '2012-02-08',
                close_price: '455',
                trade_vol: '3133',
                hold_muster1: 363,
                above_avg_bal_ratio: 9,
                above_avg_cnt_ratio: 31
              },
              {
                trade_date: '2012-02-09',
                close_price: '654',
                trade_vol: '313',
                hold_muster1: 44,
                above_avg_bal_ratio: 4,
                above_avg_cnt_ratio: 78
              },
              {
                trade_date: '2012-02-10',
                close_price: '345',
                trade_vol: '55',
                hold_muster1: 165,
                above_avg_bal_ratio: 58,
                above_avg_cnt_ratio: 365
              }
            ]
          },
          series: [
            {name: '收盘价', type: 'line', xAxisIndex: 0, yAxisIndex: 0, encode: {x: 'trade_date', y: 'close_price'}},
            {
              name: '成交量',
              type: 'bar',
              barMaxWidth: 30,
              xAxisIndex: 1,
              yAxisIndex: 1,
              encode: {x: 'trade_date', y: 'trade_vol'}
            },
            {name: '持股集中度1', type: 'line', xAxisIndex: 2, yAxisIndex: 2, encode: {x: 'trade_date', y: 'hold_muster1'}},
            {
              name: '持股数比例',
              type: 'line',
              xAxisIndex: 2,
              yAxisIndex: 2,
              encode: {x: 'trade_date', y: 'above_avg_bal_ratio'}
            },
            {
              name: '股东数比例',
              type: 'line',
              xAxisIndex: 2,
              yAxisIndex: 2,
              encode: {x: 'trade_date', y: 'above_avg_cnt_ratio'}
            }
          ]
        }
      }
    },
    methods: {
      initChart (propsData) {
        // let self = this
        let myChart = document.getElementById('echartsContainer')
        let echart = echarts.init(myChart, this.gfnGetTheme())
        if (propsData) {
          this.defaultOption.dataset.source = propsData
        }
        if (this.defaultOption.dataset.source.length) {
          window.onresize = echart.resize
          echart.setOption(this.defaultOption)
        }
      }
    },
    watch: {
      propsData: {
        handler (newValue) {
           this.initChart(newValue)
        },
        deep: true
      },
    },
    mounted () {
      /* test */
      // this.initChart()
    }
  }

</script>
<style lang="less" scoped>
  .echarts-container {
    width: 100%;
    height: 300px;
    position: relative;
    &.echartsHeight {
      height: 1000px;
    }
    .placeholderText {
      font-size: 15px;
      position: absolute;
      left: 50%;
      top: 50%;
      transition: transform(-50%, -50%);
    }
  }
</style>
