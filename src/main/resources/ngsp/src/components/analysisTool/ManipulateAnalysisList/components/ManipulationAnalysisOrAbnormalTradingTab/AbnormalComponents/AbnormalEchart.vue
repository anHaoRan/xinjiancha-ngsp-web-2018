<template>
  <div id="abnormal-echart"></div>
</template>

<script>
  import MinxinVue from '../Mixin'
  import { unusualTrade } from '@/service/analysisTool/ManipulateAnalysisList/index'

  export default {
    name: 'abnormal-echart',
    props: {
      latitude: {
        type: String,
        default: function () {
          return 'date'
        }
      }
    },
    components: {},
    mixins: [MinxinVue],
    data () {
      return {}
    },
    computed: {},
    watch: {
      selectParams: {
        handler: function () {
          this.ajaxUnusualTrade()
        },
        deep: true,
        immediate: true
      },
      latitude: function () {
        this.ajaxUnusualTrade()
      }
    },
    methods: {
      ajaxUnusualTrade () {
        let param = {
          type: '0,2,4,5',
          stockCode: this.selectParams.indexCode,
          startDate: this.selectParams.selectTradeDate[0],
          endDate: this.selectParams.selectTradeDate[1],
          dateType: this.latitude
        }
        unusualTrade(param).then(res => {
          let {list} = res,
            data = this.splitData(list),
            arr = []
          this.options.xAxis.data = data.timeList
          for (let key of data.volumes) {
            let serie = {
              name: key.name,
              type: 'line',
              smooth: true,
              showSymbol: false,
              symbol: 'circle',
              data: key.value
            }
            arr.push(serie)
          }
          this.options.series = arr
          this.drawEcharts()
        })
      },
      splitData (list) {
        let obj = {
            inve_count0: '集合竞价虚假申报',
            inve_count2: '涨跌停板虚假申报',
            inve_count4: '拉抬打压盘中价',
            inve_count5: '拉抬打压收盘价'
          },
          timeList = [],
          volumes = []
        for (let key1 in obj) {
          volumes.push({
            key: key1,
            name: obj[key1],
            value: []
          })
        }
        for (let key of list) {
          timeList.push(key.create_time)
          for (let key1 of volumes) {
            key1.value.push(key[key1.key])
          }
        }
        return {
          timeList: timeList,
          volumes: volumes
        }
      }
    },
    created () {
      this.options = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          itemWidth: 20,
          itemHeight: 20,
          data: ['集合竞价虚假申报', '涨跌停板虚假申报', '拉抬打压盘中价', '拉抬打压收盘价']
        },
        xAxis: {
          axisLabel: {
            color: '#aec0e6'
          },
          axisLine: {
            lineStyle: {
              color: '#334164'
            }
          }
        },
        yAxis: [
          {
            axisLabel: {
              color: '#aec0e6'
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
    },
    mounted () {
      this.initEcharts('abnormal-echart')
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  #abnormal-echart {
    height: 500px;
  }
</style>
