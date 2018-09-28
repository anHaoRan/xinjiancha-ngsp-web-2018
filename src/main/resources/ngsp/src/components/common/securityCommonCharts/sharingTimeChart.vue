<template>
  <div>
    <el-row class="stock-header">
      <el-col :span="24" v-if="chartTitle!==''">
        <span class="title">{{chartTitle}}</span>
      </el-col>
    </el-row>
    <div id="stockLineChart" class="stock-line-chart"></div>
  </div>
</template>

<script>
  import { getMarketTimeLine, getStockSharingChartBrushed } from '@/service/marketSupervise'
  import { splitData, drawStockTimeSharing } from '../../../utils/charts/stockTimeSharingChart'

  export default {
    data () {
      return {
        yesterdayCloseIndex: 0,
        chartTitle: '',
        chart: null,
        brushed: false,
        brushedStacData: {}
      }
    },
    methods: {
      fnClearChart () {
        if (this.chart != null) {
          this.chart.dispose()
          this.chart = null
        }
      },

      fnHandleBrush (params) {
        if (params.batch[0].selected.length === 0) {
          return
        }
        let dataIndexes = params.batch[0].selected[2] ? params.batch[0].selected[2].dataIndex : null
        if (dataIndexes == null || dataIndexes.length === 0) {
          return
        }
        let timeList = this.chart.getOption().xAxis[0].data
        let startTimeStr = timeList[dataIndexes[0]]
        let endTimeStr = timeList[dataIndexes[dataIndexes.length - 1]]

        this.getBrushedStaticData(startTimeStr, endTimeStr)
        this.chart.dispatchAction({
          type: 'showTip',
          formatter: function () {
            return 'llalsldalfafadf'
          },
          x: 0,
          y: 0
          // position: function (pos, params, el, elRect, size) {
          //   let obj = {top: 10};
          //   obj[['left', 'right'][+(pos[0] < size.viewSize[0]/2)]] = 30;
          //   return obj;
          // }
        })
      },

      fnUpdateStockGraph (chartData) {
        // 画图
        if (this.chart === null) {
          this.chart = drawStockTimeSharing(chartData, 'stockLineChart')
          this.chart.on('brushSelected', this.fnHandleBrush)
          return
        }

        let data = splitData(chartData)
        let option = this.chart.getOption()
        option.xAxis[0].data = data.timeList
        option.xAxis[1].data = data.timeList
        option.series[0].data = data.chartData
        option.series[1].data = data.volumes
        this.chart.setOption(option)
      },

      getSharingTimeData () {
        let params = {
          codeType: 'index',
          code: '000001',
          trdDate: '',
          startTime: '0930',
          endTime: '1500'
        }
        getMarketTimeLine(params).then(resp => {
          this.chartTitle = resp.secCode + ' ' + resp.secName
          this.yesterdayCloseIndex = parseFloat(resp.lastClose)
          this.fnUpdateStockGraph(resp)
        })
      },

      getBrushedStaticData (startTime, endTime) {
        getStockSharingChartBrushed({
          stockCode: this.$store.getters.getCurrentCode,
          startTime: startTime.replace(':', ''),
          endTime: endTime.replace(':', '')
        }).then(resp => {
          this.brushedStacData = resp
          console.log(resp)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .stock-header {
    padding: 10px;
    span {
      margin-right: 10px;
      float: left;
      label {
        color: #409EFF;

        &.rise {
          color: #fd0000;
        }

        &.fall {
          color: #008900;
        }
      }
    }
    .title {
      color: #ffffff;
      font-size: 14px;
      margin-top: -3px;
    }
  }
</style>
