<template>
  <div class="majorInverstorHolding">
    <el-card class="el-card-table">
      <div slot="header" class="clearfix">
        专业投资者持仓情况
      </div>
      <el-row>
        <el-form :inline="true" :model="selectParams" style="padding-left: 20px">
          <el-form-item label="日期">
            <el-date-picker
              v-model="selectParams.beginDate"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @change="getDate"
              size="mini"
              style="width:100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" class="icon">
            <i class="fa el-icon-download" @click="holdingExcel" style="font-size: 24px"></i>
            <i :class="selectParams.className" @click="toggleClass" style="font-size: 24px"></i>
          </el-form-item>
        </el-form>
      </el-row>
      <el-table
        v-show="changeChart"
        :data="majorHoldCount"
        v-loading="dataLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)"
        border
        tooltip-effect="dark"
        size="small"
        :cell-class-name="this.tableColumnClassName"
        highlight-current-row
        height="350"
        style="width: 100%;">
        <el-table-column
          v-for="column in majorHoldColumns"
          :key=column.field
          :align=column.align
          :prop=column.field
          :label=column.label
          :sortable=column.sortable
          :sort-method="column.sortMethod"
          :min-width=column.minWidth>
        </el-table-column>
      </el-table>
      <div id="majorChart" style="width: 1600px;height: 350px;position: relative;top: -20px;" v-show="!changeChart"></div>
    </el-card>
  </div>

</template>

<script>
  import echarts from 'echarts'
  import moment from 'moment'
  import { getRelativeTradeDate } from '../../../../service/common/commonFunc'
  import { getMajorInverstorData } from '../../../../service/marketSupervise/classifiedInvestorMonitoring/index'

  export default {
    name: 'detail-holding',
    data () {
      return {
        tDate: '',
        selectParams: {
          beginDate: '',
          className: 'fa fa-bar-chart'
        },
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > new Date(moment(this.tDate, 'YYYYMMDD').format('YYYY,MM,DD')).getTime()
          }
        },
        dataLoading: false,
        majorHoldCount: [], // 表格数据
        majorHoldColumns: [
          {label: '投资者类型', field: 'type', align: 'center'},
          {label: '公募基金', field: 'a', align: 'center'},
          {label: '基金专户', field: 'c', align: 'center'},
          {label: '社保基金', field: 'd', align: 'center'},
          {label: 'QFII', field: 'e', align: 'center'},
          {label: 'RQFII', field: 'm', align: 'center'},
          {label: '保险机构', field: 'f', align: 'center'},
          {label: '信托产品', field: 'i', align: 'center'},
          {label: '企业年金', field: 'j', align: 'center'},
          {label: '券商自营', field: 'g', align: 'center'},
          {label: '券商集合理财', field: 'h', align: 'center'},
          {label: '沪股通', field: 'o', align: 'center'},
          {label: '其他机构', field: 'z', align: 'center'}
        ],
        changeChart: true
      }
    },
    mounted () {
      getRelativeTradeDate(-1).then(val => {
        this.tDate = val
        this.selectParams.beginDate = moment(val, 'YYYYMMDD').format('YYYY-MM-DD')
      })
      this.getData()
    },
    methods: {
      getDate (val) {
        if (!val) {
          this.selectParams.beginDate = ''
        }
        this.getData()
      },
      toggleClass () {
        if (this.selectParams.className === 'fa fa-table') {
          this.selectParams.className = 'fa fa-bar-chart'
          this.changeChart = !this.changeChart
        } else {
          this.selectParams.className = 'fa fa-table'
          this.changeChart = !this.changeChart
        }
      },
      // 列颜色定义
      tableColumnClassName ({row, column}) { // eslint-disable-line
        if (column.label === '买入金额占比(%)' || column.label === '卖出金额占比(%)' || column.label === '申报买入金额占比(%)' || column.label === '申报卖出金额占比(%)' || column.label === '委撤比') {
          return 'orange'
        }
      },
      holdingExcel () {
        let param = {}
        param.tradeDate = this.selectParams.beginDate
        param.fileType = 'excel'
        param.gridType = 'Professional'
        param.tableColumns = this.majorHoldColumns
        this.gfnExportFileWithForm('/fluct/investor-classifieds-trade-supervise/v1/export-history-file', param)
      },
      getData () {
        this.dataLoading = true
        this.majorHoldCount = []
        getMajorInverstorData(this.selectParams.beginDate).then((resp) => {
          this.majorHoldCount = resp.bizData.metaData
          // 柱状图数据处理
          let xAxis = []
          let barData = []
          let propData = []
          this.majorHoldColumns.forEach((el, i) => {
            if (i) {
              xAxis.push(this.majorHoldColumns[i].label)
              barData.push([i - 1, this.majorHoldCount[0][this.majorHoldColumns[i].field], this.majorHoldCount[1][this.majorHoldColumns[i].field]])
              propData.push(this.majorHoldCount[1][this.majorHoldColumns[i].field])
            }
          })
          this.dataLoading = false
          let series = [
            {
              type: 'bar',
              data: barData,
              name: '市值',
              barGap: 0,
              yAxisIndex: 0
            },
            {
              name: '占比',
              type: 'line',
              data: propData,
              yAxisIndex: 1
            }
          ]
          let data = {xAxis, series}
          this.drawBarChart('majorChart', data)
        })
      },
      drawBarChart (id, data) {
        let myLine = document.getElementById(id)
        let echart = echarts.init(myLine, this.gfnGetTheme())
        echart.clear()
        window.onresize = echart.resize
        echart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              let texts = params[0].name + '<br/>'
              params.forEach((el) => {
                if (el.seriesType === 'bar') {
                  texts += el.marker + el.seriesName + ':' + el.value[1] + '亿元<br/>'
                } else {
                  texts += el.marker + el.seriesName + ':' + el.value + '%<br/>'
                }
              })
              return texts
            }
          },
          color: ['#ff402b', '#2a7efb', '#ff7836', '#ffd21e'],
          grid: {
            left: '2%',
            right: '2%',
            bottom: '5%',
            containLabel: true
          },
          toolbox: {
            right: '5%',
            top: -10,
            itemSize: 18,
            feature: {
              saveAsImage: {}
            },
            showTitle: false
          },
          legend: {
            data: data.xAxis
          },
          xAxis: {
            axisLabel: {
              color: '#506798',
              interval: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#273757'
              }
            },
            type: 'category',
            boundaryGap: 'false',
            data: data.xAxis
          },
          yAxis: [
            {
              name: '市值(亿元)',
              nameTextStyle: {
                color: '#506798'
              },
              show: true,
              type: 'value',
              position: 'left',
              axisLabel: {
                color: '#506798'
              },
              axisLine: {
                lineStyle: {
                  color: '#273757'
                }
              }
            },
            {
              name: '占比(%)',
              nameTextStyle: {
                color: '#506798'
              },
              type: 'value',
              scale: true,
              position: 'right',
              axisLabel: {
                color: '#506798'
              },
              axisLine: {
                lineStyle: {
                  color: '#273757'
                }
              }
            }
          ],
          series: data.series
        }, true)
      }
    }
  }
</script>

<style lang="less">
  .majorInverstorHolding {
    .icon {
      float: right;
      padding-right: 20px;
      position: relative;
      top: 5px;
      i {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
</style>
