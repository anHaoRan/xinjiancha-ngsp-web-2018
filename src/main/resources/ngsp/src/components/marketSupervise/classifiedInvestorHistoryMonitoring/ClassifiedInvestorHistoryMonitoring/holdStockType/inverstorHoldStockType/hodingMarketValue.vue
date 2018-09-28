<template>
  <el-card class="el-card-table">
    <div slot="header">
      <span>持有大小市值</span>
      <div class="card-operation-box">
        <i class="fa el-icon-download" @click="marketExcel" style="font-size: 24px"></i>
        <i :class="buttonCls" @click="toggleClass" style="font-size: 24px"></i>
      </div>
    </div>
    <el-table
      v-show="showChart"
      :data="data"
      v-loading="params.isLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="数据加载中，请耐心等待..."
      element-loading-background="rgba(0,0,0,0.3)"
      border
      tooltip-effect="dark"
      size="small"
      highlight-current-row
      height="350"
      style="width: 100%;">
      <el-table-column
        v-for="column in marktValColumns"
        :key="column.field"
        :align="column.align"
        :prop="column.field"
        :label="column.label"
        :sortable="column.sortable"
        :sort-method="column.sortMethod"
        :formatter="column.formatter"
        :min-width="column.minWidth">
      </el-table-column>
    </el-table>
    <div id="hodingMarktValPieChart" style="width: 815px; height: 350px; position: relative;" v-show="!showChart"></div>
  </el-card>
</template>

<script>
  import echarts from 'echarts'

  export default {
    components: {},
    props: ['data', 'params'],
    data () {
      return {
        showChart: true,
        buttonCls: 'fa fa-table',
        marktValColumns: [
          {label: '股票市值规模', field: 'tp', align: 'center', sortable: true, minWidth: '100'},
          {
            label: '持股市值(亿元)',
            field: 'position_val',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_val'),
            minWidth: '100',
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '市值占比(%)',
            field: 'rate',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rate'),
            minWidth: '100',
            formatter: this.gfnElColFormatDec2
          }
        ],
        pieChart: null
      }
    },
    watch: {
      data: function () {
        let pieData = this.formatterPieData(this.data)
        this.drawPieChart(pieData.legendArr, pieData.dataArr)
      }
    },
    methods: {
      toggleClass () {
        if (this.buttonCls === 'fa fa-table') {
          this.buttonCls = 'fa fa-pie-chart'
          this.showChart = false
        } else {
          this.buttonCls = 'fa fa-table'
          this.showChart = true
        }
      },
      marketExcel () {
        let param = JSON.parse(JSON.stringify(this.params))
        param.fileType = 'excel'
        param.gridType = 'PositionPlat'
        param.tableColumns = this.marktValColumns
        this.gfnExportFileWithForm('/fluct/investor-classifieds-trade-supervise/v1/export-history-file', param)
      },
      formatterPieData (data) {
        let legendArr = []
        let dataArr = []
        for (let idx in data) {
          let item = data[idx]
          legendArr.push(item.tp)
          dataArr.push({
            value: [item.rate, item.position_val],
            name: item.tp
          })
        }
        return {
          legendArr,
          dataArr
        }
      },
      drawPieChart (legendArr, dataArr) {
        let option = {
          title: {
            show: false
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.marker + params.name + '<br/>(市值:' + params.value[1] + '亿元)<br/>' + (params.value[0] ? params.value[0] : 0) + '%'
            }
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
            top: 20,
            left: 20,
            width: '40%',
            data: legendArr
          },
          series: [{
            name: '持有大小市值',
            type: 'pie',
            radius: '75%',
            center: ['65%', '50%'],
            data: dataArr,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function (params) {
                    return (params.value[0] ? params.value[0] : 0) + '%'
                  },
                  position: 'outer'
                }
              }
            }
          }]
        }
        if (this.pieChart != null) {
          this.pieChart.dispose()
        }
        this.pieChart = echarts.init(document.getElementById('hodingMarktValPieChart'), this.gfnGetTheme())
        this.pieChart.setOption(option)
      }
    }
  }
</script>

<style scoped lang="less">
  .card-operation-box {
    float: right;
    margin-right: 20px;

    i {
      margin-right: 10px;
      cursor: pointer;
    }
  }
</style>
