<template>
  <div class='detail-gear-component'>
    <div class='download-btn'>
      <a href='javascript:;' class='el-icon-download' @click='download'>导出</a>
      <a href='' id='clickA' download='downImg' style='visibility: hidden'></a>
    </div>
    <div id='detail-dialog'>
      <div class='current-info'>
        <ul class='clearfix'>
          <li>
            <span>证券代码：</span>
            <span class='current-text'>{{headerData.sec_code}}</span>
          </li>
          <li>
            <span>交易日期：</span>
            <span class='current-text'>{{headerData.trade_date.slice(0, 10)}}</span>
          </li>
          <li>
            <span>订单时间：</span>
            <span class='current-text'>{{headerData.order_time}}</span>
          </li>
        </ul>
      </div>
      <el-row>
        <el-col :xl='3' :lg='3' :md='3' :sm='3'>
          <ul class='dialogIcon'>
            <li v-for='(item, index) in menuList' v-if='item.show' :key='item.id + 1' @click='dialogIcon(index)'> {{item.name}} </li>
          </ul>
        </el-col>
        <el-col :xl='7' :lg='7' :md='7' :sm='7'>
          <el-table
            :show-header='false'
            :data='tableData[tableIndex]'>
            <el-table-column
              v-for='column in columnDetail'
              :key='column.field'
              :label='column.label'
              :prop='column.field'>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :xl='14' :lg='14' :md='14' :sm='14'>
          <div id='myChart' style='min-height: 560px'></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import html2canvas from 'html2canvas'
export default {
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    headerData: {
      type: Object,
      default() {
        return {
          trade_date: '',
          sec_code: '',
          first_trade_time: '',
          last_trade_time: ''
        }
      }
    },
    tableTabIndex: { },
    dialogName: {
      type: String
    }
  },
  data() {
    return {
      columnDetail: [
        {id: '9111', minWidth: '122', label: 'name', field: 'name', align: 'left', sortable: false},
        {id: '9112', minWidth: '122', label: '价格', field: 'price', align: 'left', sortable: false, formatter: this.gfnElColFormatDec3},
        {id: '9113', minWidth: '122', label: '数量', field: 'vol', align: 'left', sortable: false}
      ],
      tableIndex: 0
    }
  },
  methods: {
    dialogIcon(index) { // 对话中切换菜单按钮
      this.tableIndex = index
      this.$emit('update:dialogName', this.menuList[index].name)
      this.drawImage()
    },
    download() {
      // 设置背景色
      let ieS = document.getElementsByClassName('el-dialog')[0].currentStyle
      ieS ? document.getElementById('detail-dialog').style.backgroundColor = ieS : document.getElementById('detail-dialog').style.backgroundColor = window.getComputedStyle(document.getElementsByClassName('el-dialog')[0]).backgroundColor

      html2canvas(document.getElementById('detail-dialog')).then(function(canvas) {
        document.getElementById('clickA').setAttribute('href', canvas.toDataURL('image/jpeg', 1))
        document.getElementById('clickA').click()
      })
    },
    drawImage() {
      let myCharts = echarts.init(document.getElementById('myChart'), this.gfnGetTheme())
      myCharts.clear()
      let DataY = []
      this.tableData[this.tableIndex].map(item => {
        DataY.push(item.graphData)
      })
      DataY.reverse()
      let option = {
        title: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (op, ticker, callback) {
            if (op[0].dataIndex >= 10) {
              return op[0].seriesName + ':' + op[0].value
            } else {
              let num = op[0].value.toString()
              return op[0].seriesName + ':' + num.substr(1)
            }
          }
        },
        grid: {
          top: 20,
          bottom: 10
        },
        xAxis: {
          show: true,
          type: 'value',
          position: 'top',
          splitLine: {lineStyle: false},
          axisLabel: {
            formatter: function (value) {
              let num
              if (value < 0) {
                num = value.toString().substr(1)
              } else {
                num = '-' + value.toString()
              }
              return '{a|' + num + '}'
            },
            rich: {
              a: {
                color: '#7b8fb9'
              }
            }
          },
          axisLine: {
            lineStyle: {
              color: '#7b8fb9',
              width: 1
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLine: {show: false},
          axisLabel: {show: false},
          axisTick: {show: false},
          // splitLine: {lineStyle: false},
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        series: [
          {
            name: '成交数量',
            type: 'bar',
            // stack: '总量',
            barWidth: 18,
            label: {
              normal: {
                show: true,
                color: '#fff',
                formatter: function (op) {
                  let num
                  if (op.data < 0) {
                    num = op.data.toString().substr(1)
                  }
                  return num
                }
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  let colorList = ['green', 'red']
                  if (params.dataIndex < 10) {
                    return colorList[1]
                  } else {
                    return colorList[0]
                  }
                }
              }
            },
            data: DataY
          }
        ]
      }
      window.onresize = myCharts.resize
      myCharts.setOption(option)
    }
  },
  watch: {
    tableTabIndex() {
      this.tableIndex = this.tableTabIndex
    }
  },
  mounted() {
    this.tableIndex = this.tableTabIndex
    this.drawImage()
  }
}

</script>
<style lang='less'>
  .detail-gear-component {
    .download-btn {
      text-align: right;
      a {
        text-decoration: none;
        color: #fff;
      }
    }
    .dialogIcon{
      margin-top: 100%;
      li {
        cursor: pointer;
        margin: 5px 0;
        i {
          cursor: pointer;
        }
      }
    }
    .el-dialog__body {
      padding-top: 5px;
      padding-bottom: 10px;
    }
    #detail-dialog {
      padding: 10px 20px;
      .current-info {
        text-align: center;
        ul {
          margin-top: 3px;
          margin-bottom: 10px;
          display: inline-block;
          li {
            float: left;
            margin-right: 15px;
            .current-text {
              color: dodgerblue;
            }
          }
        }
      }
      .rotateIcon {
        transform: rotate(90deg);
      }
      .el-table {
        .el-table__body-wrapper {
          tbody {
            tr {
              height: 28px;
              td {
                padding: 0;
                height: 22px;
              }
            }
          }
        }
      }
    }
  }
</style>
