<template>
    <div class="alarm-amount">
        <el-card class="el-card-table">
            <div slot="header" class="clearfix">
                <span>常用预警数量变化</span>
                <el-button
                        type="info"
                        size="small"
                        @click="">导出
                </el-button>
            </div>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div id="alarm-amount"></div>
                </el-col>
                <el-col :span="12">
                    <margin-table :isPageination="false" :height="400" :columns="columns"
                                  :data="data"></margin-table>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
  import { getAlarmAmountResult } from '@/service/earlyWarning'
  import VueMixin from './VueMixin'

  export default {
    name: 'alarm-amount',
    props: [],
    components: {
      MarginTable: () => import('@/components/base/MarginTable')
    },
    mixins: [VueMixin],
    data () {
      return {
        columns: [],
        data: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        }
      }
    },
    computed: {},
    watch: {},
    created () {
      this.options = {
        title: {
          text: '预警数量',
          left: '5%',
          textStyle: {
            color: '#7b8fb9'
          }
        },
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
          },
          position: function (pos, params, el, elRect, size) {
            if (pos[0] < size.viewSize[0] / 2) {
              return [pos[0] + 20, '36']
            }
            return [pos[0] - 220, '16']
          },
        },
        legend: {},
        grid: [
          {
            left: '50',
            right: '30%',
            top: '40',
            bottom: '30',
            containLabel: false
          }
        ],
        xAxis: [],
        yAxis: [
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
            }
          }
        ],
        series: []
      }
      this.ajaxGetAlarmAmountResult()
    },
    mounted () {
      this.initEcharts('alarm-amount')
    },
    beforeDestroy () {
    },
    methods: {
      ajaxGetAlarmAmountResult () {
        getAlarmAmountResult().then(res => {
          if (res) {
            let columnsArr = []
            for (let key in res[0]) {
              if (key == 'alarmName') {
                columnsArr.unshift({
                  field: key,
                  align: 'center',
                  label: '名称',
                  width: '120'
                })
              } else {
                columnsArr.push({
                  field: key,
                  align: 'center',
                  label: key.split('M')[0] + '月'
                })
              }

            }
            this.columns = columnsArr
            this.data.data = res
            this.$nextTick(function () {
              this.drawChart(res)
            })
          }
        })
      },
      drawChart (res) {
        let [...rowData] = res
        let xAxis = []
        let series = []
        let legend = {
          data: [],
          orient: 'vertical',
          right: '0',
          top: 'middle',
          align: 'right'
        }
        for (let key in rowData[0]) {
          if (key != 'alarmName') {
            xAxis.push(key.split('M')[0] + '月')
          }
        }
        for (let key of rowData) {
          let obj = {
            name: key.alarmName,
            type: 'line',
            data: [],
            smooth: true
          }
          for (let key2 in key) {
            if (key2 != 'alarmName')
              obj.data.push(key[key2])
          }
          legend.data.push(key.alarmName)
          series.push(obj)
        }
        this.options.legend = legend
        this.options.xAxis = [
          {
            type: 'category',
            data: xAxis,
            boundaryGap: false,
            axisLine: {
              show: true,
              onZero: false,
              lineStyle: {
                color: '#263657'
              }
            },
            axisLabel: {
              color: '#506798',
              formatter: function (value, index) {
                let str = value
                if (index == xAxis.length - 1) {
                  str += '(近6个月)'
                }
                return str
              }
            }
          }
        ]
        this.options.series = series
        this.drawEcharts()
      }
    }
  }
</script>

<style lang="less" scoped>
    .alarm-amount {
        #alarm-amount {
            height: 400px;
        }
    }
</style>