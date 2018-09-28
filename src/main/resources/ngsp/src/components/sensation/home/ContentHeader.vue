<template>
    <div class="content-header">
        <el-card class="el-card-table">
            <el-row class="header" :gutter="150">
                <el-col :span="14">
                    <div class="font-color-main header-title">
                        <div class="data">
                            2018年7月11日 11:23
                        </div>
                        <div class="title">
                            <div v-for="(item,index) in titleList" :key="index">
                                <template v-if="item.children">
                                    <div>{{item.children.title}}</div>
                                    <div class="font-sub">{{item.children.title_sub}}</div>
                                </template>
                                <template v-else>
                                    {{item.content}}
                                </template>
                            </div>
                        </div>
                    </div>
                    <div id="sensation_home_heat">
                    </div>
                </el-col>
                <el-col :span="10">
                    <el-row :gutter="100" style="margin-top: 65px">
                        <el-col :span="12" class="display-flex">
                            <div>上证指数</div>
                            <div :class="gfnFormatSecurityClass(1)">+11%</div>
                        </el-col>
                        <el-col :span="12" class="display-flex">
                            <div>上证50</div>
                            <div :class="gfnFormatSecurityClass(-1)">-22%</div>
                        </el-col>
                    </el-row>
                    <el-carousel style="margin-top: 20px">
                        <el-carousel-item v-for="(item,index) in carouselList" :key="index">
                            <carousel-item :data="item"></carousel-item>
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
  import VueMixin from '../VueMixin'
  import { json } from './1111'
  import moment from 'moment'

  export default {
    name: 'content-header',
    props: [],
    components: {
      CarouselItem: () => import('./components/CarouselItem')
    },
    mixins: [VueMixin],
    data () {
      return {
        carouselList: [
          {
            title: '11111',
            type: '舆情日报',
            value: [
              {
                type: 'lh',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lh',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              }
            ]
          },
          {
            title: '11111',
            type: '舆情日报',
            value: [
              {
                type: 'lh',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lh',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              }
            ]
          },
          {
            title: '111111111111111111111111111111111111111111111111111111111111111111111111111111111',
            type: '舆情日报',
            value: [
              {
                type: 'lh',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lh',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              },
              {
                type: 'lk',
                id: 1,
                name: '深振业A终止重大资产重组 8日复牌'
              }
            ]
          }
        ],
        titleList: [
          {
            children: {
              title: '中性',
              title_sub: '消息面'
            }
          },
          {
            content: '>'
          },
          {
            children: {
              title: '653',
              title_sub: '正面舆情'
            }
          },
          {
            children: {
              title: '10653',
              title_sub: '正面舆情'
            }
          },
          {
            children: {
              title: '10653',
              title_sub: '正面舆情'
            }
          }
        ]
      }
    },
    computed: {},
    watch: {},
    created () {
      this.options = {
        title: [
          {
            text: '分时段舆情热度',
            left: '5%',
            textStyle: {
              color: '#7b8fb9'
            }
          }
        ],
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
          }
        },
        axisPointer: {
          link: {xAxisIndex: 'all'}
        },
        xAxis: [],
        yAxis: [],
        series: []
      }
    },
    mounted () {
      this.initEcharts('sensation_home_heat')
      this.ajax()
    },
    beforeDestroy () {
    },
    methods: {
      dealWithEchartData (rawData) {
        // 图形数据结构处理
        let indexData = rawData
        let timeList = []
        let chartData = []
        let volumes = []
        let lastCloseData = indexData.lastClose
        let todayData = indexData.chartData
        let maxPrice = indexData.maxPrice
        let minPrice = indexData.minPrice
        let increase = indexData.increase
        let rate = indexData.amplitude
        rate = rate.toFixed(2)
        todayData.forEach((el, i) => {
          timeList.push(moment(el[0], 'HHmm').format('HH:mm'))
          chartData.push([i, el[3], el[1], el[4], el[2]])
          volumes.push(el[5])
        })
        return {
          timeList,
          lastCloseData,
          chartData,
          rate,
          maxPrice,
          minPrice,
          increase
        }
      },
      ajax () {
        let data = this.dealWithEchartData(json)
        this.options.xAxis = [
          {
            type: 'category',
            data: data.timeList,
            boundaryGap: false,
            splitLine: {
              show: false,
              interval: 29,
              lineStyle: {
                type: 'solid',
                color: '#263657'
              }
            },
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: '#263657'
              }
            },
            axisTick: {
              show: false,
              interval: 29,
              length: 8,
              lineStyle: {
                color: '#aec0e6'
              }
            },
            axisLabel: {
              color: '#506798',
              interval: 29,
              formatter: function (value, index) {
                let str = value
                if (index == data.timeList.length - 1) {
                  str += '以后'
                }
                return str
              }
            }
          }
        ]
        this.options.yAxis = [
          {
            scale: true,
            axisLabel: {
              color: '#506798'
            },
            axisTick: {show: false},
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
            position: 'left',
            min: data.minPrice,
            tickInterval: data.increase,
            max: data.maxPrice
          },
          {
            scale: true,
            axisLabel: {
              color: '#506798',
              formatter: function (value) {
                return value + '%'
              }
            },
            splitNumber: 1,
            axisTick: {show: false},
            axisLine: {
              show: true,
              lineStyle: {
                color: '#263657'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#263657',
                type: 'solid'
              }
            },
            position: 'right',
            min: 0 - data.rate,
            max: data.rate
          }
        ]
        this.options.series = [
          // {
          //   name: '',
          //   type: 'bar',
          //   yAxisIndex: 1,
          //   data: data.chartData,
          //   smooth: true
          // },
          {
            name: '价格',
            type: 'line',
            yAxisIndex: 1,
            data: data.chartData,
            smooth: true
          }
        ]
        this.drawEcharts()
      }
    }
  }
</script>

<style lang="less" scoped>
    .content-header {
        .el-card-table {
            background: url("../../../assets/images/sensation_home.png");
            .header {
                height: 500px;
                .header-title {
                    padding: 50px 50px;
                    .data {
                        font-size: 20px;
                    }
                    .title {
                        display: flex;
                        text-align: center;
                        align-items: center;
                        font-size: 26px;
                        > div:first-child {
                            margin-left: 0;
                        }
                        > div {
                            margin: 10px 0 10px 30px;
                            &:nth-last-child(1), &:nth-last-child(2) {
                                padding-left: 30px;
                                border-left: 2px solid #fff
                            }
                            .font-sub {
                                margin-top: 10px;
                                font-size: 14px;
                            }
                        }
                    }
                }
                .display-flex {
                    display: flex;
                    align-items: center;
                    &:nth-child(1) {
                        justify-content: flex-end;
                    }
                    > div:nth-child(1) {
                        font-size: 18px;
                    }
                    > div:nth-child(2) {
                        font-size: 30px;
                        padding-left: 10px;
                    }
                }
                #sensation_home_heat {
                    height: 300px;
                }
            }
        }
    }
</style>
