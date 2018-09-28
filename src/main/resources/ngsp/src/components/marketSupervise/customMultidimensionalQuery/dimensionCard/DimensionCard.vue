<template>
  <div class="dimensionCard">
    <el-card v-if="dimensionData.title">
      <div slot="header" class="clearfix">
        {{dimensionData.title}}
        <div class="remove" @click="remove(dimensionData.dimensionID)">
          <i class="el-icon-close" size="large"></i>
        </div>
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-table
            :data="dimensionData.tableData"
            ref="dimensionTable"
            border
            tooltip-effect="dark"
            height="400"
            size="small"
            highlight-current-row
            @select="selectionChange"
            @select-all="selectionChange"
            @selection-change="handleSelectionChange"
            v-tableLoadMore="handleTableLoadMore"
            style="width: 100%">
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              v-for="column in dimensionData.tableColumns"
              :show-overflow-tooltip="true"
              :key="column.field"
              :label="column.label"
              :prop="column.field"
              :width="column.width"
              :min-width="column.minWidth"
              :class-name="column.className"
              :align="column.align == null ? 'center' : column.align"
              :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod"
              :formatter="column.formatter">
            </el-table-column>
            <template slot="append" v-if="dimensionData.loadingMore">
              <table>
                <tr>
                  <td>
                    {{loadingMoreNote}}
                  </td>
                </tr>
              </table>
            </template>
            <template slot="append" v-else-if="dimensionData.dimensionID === 1 && !dimensionData.loadingMore">
              <table>
                <tr>
                  <td>
                    {{loadingFullNote}}
                  </td>
                </tr>
              </table>
            </template>
          </el-table>
        </el-col>
        <el-col :span="12">
          <div :id="dimensionData.title" class="dimensionChart"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import { G_C_NOTE_LAZY_LOAD } from '@/utils/constants'

  let echarts = require('echarts')
  export default {
    name: 'dimension-card',
    props: ['dimensionData'],
    data () {
      return {
        rows: '',
        loadingMoreNote: G_C_NOTE_LAZY_LOAD.loading,
        loadingFullNote: G_C_NOTE_LAZY_LOAD.full
      }
    },
    watch: {
      'dimensionData.tableData': function (val) {
        if (val.length === 20) {
          this.rows = ''
        } else if (this.dimensionData.dimensionID === 1 && this.rows !== '') {
          this.$nextTick(function () {
            val.forEach(row => {
              if (this.rows.indexOf(row.security_id) > -1) {
                this.$refs.dimensionTable.toggleRowSelection(row, true)
              }
            })
          })
        }
      }
    },
    methods: {
      remove (title) {
        this.rows = ''
        this.$emit('removeData', title)
      },
      handleTableLoadMore () {
        if (this.dimensionData.dimensionID === 1 && this.dimensionData.loadingMore) {
          this.$emit('loadMore')
        }
      },
      selectionChange (rows) {
        if (this.dimensionData.dimensionID === 1) {
          this.rows = ''
          for (let row of rows) {
            this.rows += row.security_id + ','
          }
          this.handleSelectionChange(rows)
        }
      },
      handleSelectionChange (rows) {
        let xAxisData = []
        let lineName = ''
        let dataIndex = 100
        this.dimensionData.tableColumns.forEach((col, index) => {
          if (index === 0) {
            lineName = col.field
          }
          if (!isNaN(parseInt(col.label)) && dataIndex === 100) {
            dataIndex = index
          }
          if (index >= dataIndex) {
            xAxisData.push(col.field)
          }
        })
        let seriesData = []
        let legendData = []
        rows.forEach(row => {
          let total = 0
          let data = 0
          let datas = []
          xAxisData.forEach(xAxis => {
            data = row[xAxis] === null ? 0 : row[xAxis]
            if (this.dimensionData.drawingOptions) {
              total += Number(data)
              datas.push(total)
            } else {
              datas.push(data)
            }
          })
          legendData.push(row[lineName])
          seriesData.push({
            name: row[lineName],
            type: 'line',
            data: datas,
            symbolSize: 3,
            symbol: 'circle'
          })
        })
        this.drawChart(legendData, xAxisData, seriesData)
      },
      drawChart (legendData, xAxisData, seriesData) {
        let myLine = document.getElementById(this.dimensionData.title)
        let myChart = echarts.init(myLine, this.gfnGetTheme())
        myChart.clear()
        window.onresize = myChart.resize
        myChart.setOption({
          title: {
            text: this.dimensionData.title + this.dimensionData.targetTitle,
            left: '36%',
            textStyle: {
              color: '#506798'
            }
          },
          tooltip: {
            trigger: 'axis',
            position: function (pos, params, dom, rect, size) {
              if (pos[0] < size.viewSize[0] / 2) {
                return [pos[0] + 20, '6']
              }
              return [pos[0] - 220, '16']
            },
            formatter: function (params) {
              let texts = params[0].name + '<br/>'
              params.forEach((el) => {
                texts += el.marker + el.seriesName + ': ' + (Number(el.value) / 100000000).toFixed(2) + '亿元<br/>'
              })
              return texts
            }
          },
          legend: {
            inactiveColor: '#455579',
            orient: 'vertical',
            right: '1%',
            top: 'middle',
            data: legendData,
            textStyle: {
              color: '#506798'
            }
          },
          grid: {
            left: '0',
            right: '23%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            x: '93%',
            y: 'top',
            itemSize: 20,
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: [{
            boundaryGap: false,
            axisLabel: {
              color: '#506798',
              rotate: -45
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#455579'
              }
            },
            data: xAxisData
          }],
          yAxis: {
            name: '(亿元)',
            axisLabel: {
              color: '#506798',
              formatter: function (value) {
                return (value / 100000000).toFixed(2)
              }
            },
            splitLine: {
              lineStyle: {
                color: '#273757'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#455579'
              }
            },
            type: 'value'
          },
          series: seriesData
        }, true)
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ th.el-table-column--selection {
    .el-checkbox {
      /*display: none*/
    }
  }

  .el-card {
    position: relative;
  }

  .remove {
    top: 0;
    float: right;
    padding-right: 20px;
    cursor: pointer;
  }

  .dimensionChart {
    width: 100%;
    height: 400px;
  }
</style>
