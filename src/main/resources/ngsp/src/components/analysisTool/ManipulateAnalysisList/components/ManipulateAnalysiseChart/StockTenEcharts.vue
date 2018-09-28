<template>
  <div class="stock-ten-echarts" id="stock-ten-echarts"></div>
</template>

<script>
  import MinxinVue from '../ManipulationAnalysisOrAbnormalTradingTab/Mixin'
  import { postStockTenData } from '@/service/analysisTool/ManipulateAnalysisList/index'
  import moment from 'moment'

  export default {
    name: 'stock-ten-echarts',
    props: {
      yearMonthDay: [Date, String],
      tTime: [Date, String]
    },
    components: {},
    mixins: [MinxinVue],
    data () {
      return {}
    },
    computed: {},
    watch: {
      tTime: {
        handler () {
          this.ajaxStockTenData()
        },
        immediate: true
      }
    },
    methods: {
      ajaxStockTenData () {
        let params = {
          indexCode: this.selectParams.indexCode,
          tDate: this.yearMonthDay,
          tTime: this.tTime.replace(/:/g, '')
        }
        postStockTenData(params).then(resp => {
          if (resp.TIMETEN_DATA.length == 0) {
            this.$message.warning('查询数据为空')
            this.hideLoading()
          } else {
            let res = resp.TIMETEN_DATA[0]
            let buyCount = [res.buyvolume10, res.buyvolume9, res.buyvolume8, res.buyvolume7, res.buyvolume6, res.buyvolume5, res.buyvolume4, res.buyvolume3, res.buyvolume2, res.buyvolume1]
            let sellCount = [res.sellvolume1, res.sellvolume2, res.sellvolume3, res.sellvolume4, res.sellvolume5, res.sellvolume6, res.sellvolume7, res.sellvolume8, res.sellvolume9, res.sellvolume10]
            let buyPrice = [res.buyprice10, res.buyprice9, res.buyprice8, res.buyprice7, res.buyprice6, res.buyprice5, res.buyprice4, res.buyprice3, res.buyprice2, res.buyprice1]
            let sellPrice = [res.sellprice1, res.sellprice2, res.sellprice3, res.sellprice4, res.sellprice5, res.sellprice6, res.sellprice7, res.sellprice8, res.sellprice9, res.sellprice10]
            this.options.yAxis[1].data = sellPrice
            this.options.yAxis[3].data = buyPrice
            this.options.series[0].data = sellCount
            this.options.series[1].data = buyCount
            this.drawEcharts()
          }
        })
      }
    },
    created () {
      this.options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: [
          {
            top: '10%',
            height: '45%',
            right: '15%',
            containLabel: true,
            show: true,
            borderWidth: 1,
            borderColor: '#263657'
          },
          {
            top: '55%',
            height: '45%',
            right: '15%',
            containLabel: true,
            show: true,
            borderWidth: 1,
            borderColor: '#263657'
          }
        ],
        // toolbox: {
        //   show: true,
        //   x: "90%",
        //   y: "5px",
        //   itemSize: 18,
        //   feature: {
        //     saveAsImage: {
        //       name: moment(this.barTime, 'HHmmss').format('HH:mm:ss') + '十档行情图'
        //     }
        //   },
        //   showTitle: false
        // },
        xAxis: [
          {
            axisLabel: {
              show: false,
              color: '#506798'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'transparent'
              }
            },
            type: 'value',
            max: function (value) {
              return parseInt(value.max + value.max)
            }
          },
          {
            axisLabel: {
              show: false,
              color: '#506798'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'transparent'
              }
            },
            type: 'value',
            gridIndex: 1,
            max: function (value) {
              return parseInt(value.max + value.max)
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: ['卖一', '卖二', '卖三', '卖四', '卖五', '卖六', '卖七', '卖八', '卖九', '卖十'],
            axisLabel: {
              color: '#506798',
              interval: 0
            },
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
            }
          },
          {
            type: 'category',
            axisLabel: {
              color: '#7b8fb9'
            },
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
            position: 'right',
            offset: '10'
          },
          {
            type: 'category',
            data: ['买十', '买九', '买八', '买七', '买六', '买五', '买四', '买三', '买二', '买一'],
            axisLabel: {
              color: '#506798',
              interval: 0
            },
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
            gridIndex: 1
          },
          {
            type: 'category',
            axisLabel: {
              color: '#7b8fb9'
            },
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
            position: 'right',
            gridIndex: 1,
            offset: 0
          }
        ],
        series: [
          {
            name: '卖出数量',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'right'
                // fontWeight: 700,
                // fontsize: "20px",
              }
            },
            itemStyle: {
              color: '#075859'
            }
          },
          {
            name: '买入数量',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'right'
                // fontWeight: 700,
                // fontsize: "20px",
              }
            },
            itemStyle: {
              color: '#6b221c'
            },
            xAxisIndex: 1,
            yAxisIndex: 2
          }
        ]
      }
    },
    mounted () {
      this.initEcharts('stock-ten-echarts')
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  #stock-ten-echarts {
    height: 350px
  }
</style>
