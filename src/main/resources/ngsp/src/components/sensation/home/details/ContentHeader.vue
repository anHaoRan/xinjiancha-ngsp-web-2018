<template>
    <div class="content-header">
        <el-card class="font-color-main">
            <h1>无人零售</h1>
            <div class="subtitle">
                <div>涉及媒体：171家</div>
                <div>相关公司：5个</div>
            </div>
            <div class="header-content">
                第十三届全国人民代表大会第一次会议和政协第十届全国委员会第一次会议，将分别于2018年3月5日和3月3日在北京开幕。第十三届全国人民代表大会第一次会议和政协第十届全国委员会第一次会议，将分别于2018年3月5日和3月3日在北京开幕。第十三届全国人民代表大会第一次会议和政协第十届全国委员会第一次会议，将分别于2018年3月5日和3月3日在北京开幕。第十三届全国人民代表大会第一次会议和政协第十届全国委员会第一次会议，将分别于2018年3月5日和3月3日在北京开幕。
            </div>
        </el-card>
        <el-row :gutter="20">
            <el-col :span="10">
                <el-card class="el-card-table">
                    <div slot="header" class="clearfix">
                        <span>热度趋势图</span>
                    </div>
                    <div id="heat-trend"></div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="el-card-table font-color-main">
                    <div slot="header" class="clearfix">
                        <span>媒体参与情况（171）</span>
                    </div>
                    <participation v-for="(item,index) in participation" :key="index"
                                   :participation="item"></participation>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="el-card-table">
                    <div slot="header" class="clearfix">
                        <span>媒体观点（{{data.data.length}}）</span>
                    </div>
                    <margin-table :isPageination="false" :height="300" :columns="columns"
                                  :data="data"
                    ></margin-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import ToDetail from './components/ToDetail'
  import VueMixin from '../../VueMixin'
  import { json } from '../1111'
  import moment from 'moment'

  export default {
    name: 'content-header',
    props: [],
    components: {
      MarginTable: () => import('@/components/base/MarginTable'),
      Participation: () => import('./components/Participation')
    },
    mixins: [VueMixin],
    data () {
      return {
        columns: [
          {
            field: 'date',
            align: 'center',
            width: '150',
            label: '日期'
          },
          {
            field: 'title',
            align: 'left',
            width: '300',
            label: '标题'
          },
          {
            field: 'detail',
            align: 'center',
            url: 'pdf-preview',
            width: '80',
            label: '详情',
            template: ToDetail
          }
        ],
        data: {
          data: [
            {
              date: '2018-7-13 15:30:21',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              detail: '1'
            },
            {
              date: '2018-7-13 15:30:21',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              detail: '1'
            },
            {
              date: '2018-7-13 15:30:21',
              title: '两市融资融券大幅度减少，瞬间蒸发超过4000亿元',
              detail: '1'
            }
          ],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        participation: [
          {
            title: '官媒参与情况',
            percentage: '11',
            text: '财新网、新浪财经、腾讯财经等官媒参与了该概念'
          },
          {
            title: '官媒参与情况1',
            percentage: '32',
            text: '财新网、新浪财经、腾讯财经等官媒参与了该概念2'
          },
          {
            title: '官媒参与情况2',
            percentage: '21',
            text: '财新网、新浪财经、腾讯财经等官媒参与了该概念3'
          }
        ],
        heatTotalNum: 1
      }
    },
    computed: {},
    watch: {},
    created () {
      this.options = {
        title: [
          {
            text: `所选期间舆情总热度：{num|${this.heatTotalNum}}`,
            left: '3%',
            top: '3%',
            textStyle: {
              color: '#ffffff',
              fontSize: 16,
              rich: {
                num: {
                  fontSize: 20,
                  color: this.gfnFormatSecurityColor(1)
                }
              }
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
        legend: {
          data: ['乐观', '中性', '负面'],
          bottom: '10'
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
      this.initEcharts('heat-trend')
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
        let itemStyle = {
          color: '#409EFF'
        }
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
          {
            name: '价格',
            type: 'line',
            yAxisIndex: 1,
            data: data.chartData,
            areaStyle: {
              opacity: 0.2
            },
            smooth: true
          },
          {name: '乐观', type: 'scatter', itemStyle: itemStyle},
          {name: '中性', type: 'scatter', itemStyle: itemStyle},
          {name: '负面', type: 'scatter', itemStyle: itemStyle}
        ]
        this.drawEcharts()
        this.echart.on('legendselectchanged', (val) => {
          console.log(val)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
    .content-header {
        .subtitle {
            display: flex;
            div:last-child {
                margin-left: 30px;
                padding-left: 30px;
                border-left: 1px solid #fff;
            }
        }
        .header-content {
            margin-top: 25px;
            padding: 20px;
            line-height: 1.5;
            background: #17274b;
        }
        #heat-trend {
            height: 300px;
        }
    }
</style>
<style lang="less">
    .content-header {
        .el-table tr td, .el-table tr th {
            border-right: 1px solid transparent;
        }
    }
</style>