<template>
    <div class="content-footer">
        <div class="left">
            <h3 class="font-color-main">转发量走势图</h3>
            <div id="forward"></div>
        </div>
        <div class="right">
            <h3 class="font-color-main">转发媒体（{{data.media.length}}）</h3>
            <ul>
                <li v-for="(item,index) in data.media" :key="index">
                    <b>{{item.media}}</b>
                    <span>{{item.transmitTime}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  import VueMixin from '../../VueMixin'

  export default {
    name: 'content-footer',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    components: {},
    mixins: [VueMixin],
    data () {
      return {}
    },
    computed: {},
    watch: {
      data: {
        handler () {
          this.options = {
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
            grid: [
              {
                left: '60',
                right: '60',
                top: '30',
                bottom: '30',
                containLabel: false
              }
            ],
            xAxis: [],
            yAxis: [],
            series: []
          }
          this.ajax()
        },
        immediate: true
      }
    },
    created () {
    },
    mounted () {
      this.initEcharts('forward')
    },
    beforeDestroy () {
    },
    methods: {
      dealWithEchartData (rawData) {
        // 图形数据结构处理
        let timeList = []
        let chartData = []
        for (let key of rawData) {
          timeList.push(key.transmitDay)
          chartData.push(key.transimtNum)
        }
        return {
          timeList,
          chartData
        }
      },
      ajax () {
        let data = this.dealWithEchartData(this.data.transmitNum)
        this.options.xAxis = [
          {
            type: 'category',
            data: data.timeList,
            boundaryGap: false,
            splitLine: {
              show: false,
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
              length: 8,
              lineStyle: {
                color: '#aec0e6'
              }
            },
            axisLabel: {
              color: '#506798'
            }
          }
        ]
        this.options.yAxis = [
          {
            name: '次',
            nameTextStyle: {
              color: '#506798'
            },
            scale: true,
            axisLabel: {
              color: '#506798'
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
            position: 'left'
          }
        ]
        this.options.series = [
          {
            name: '价格',
            type: 'line',
            data: data.chartData,
            smooth: true
          }
        ]
        this.$nextTick(function () {
          this.drawEcharts()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    @height: 300px;
    .content-footer {
        display: flex;
        > div {
            flex: 1;
        }
        .right {
            ul {
                padding: 0;
                height: @height;
                width: 700px;
                overflow-y: auto;
                font-size: 16px;
                background-color: #17274b;
                li {
                    padding: 10px 20px 10px 0;
                    margin-left: 20px;
                    border-bottom: 1px solid #fff;
                    display: flex;
                    align-items: center;
                    &:last-child {
                        border-bottom: 0px;
                    }
                    span {
                        font-size: 12px;
                        margin-left: 30px;
                    }
                }
            }
        }
        .left {
            #forward {
                height: @height;
            }
        }
    }
</style>