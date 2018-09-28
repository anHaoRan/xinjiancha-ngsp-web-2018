<template>
  <div class="holdingStocks">
    <el-row>
      <el-col :span="24">
        <div id="stockChart" style="height: 350px;padding: 20px 0px"></div>
      </el-col>
    </el-row>
    <el-row>
      <div style="padding: 10px;text-align: right">
        <el-button type="info" size="mini" @click="exportHoldTable">导出</el-button>
      </div>
      <el-col :span="24">
        <margin-table :isPageination="false" :columns="holdingStockColumns" :data="{data:holdingStockData}"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {holdStockConcentrationData} from '../../../../service/analysisTool/realTimeDetection/index'
  import MinxinVue from '../Mixin'
  import echarts from 'echarts'
  import moment from 'moment'

  export default {
    mixins: [MinxinVue],
    components: {
      MarginTable: () => import('@/components/base/MarginTable')
    },
    data() {
      return {
        selectParams: {
          dateValue: ''
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        holdingStockData: [],
        holdingStockColumns: [
          {label: '证券代码', field: 'isincod', align: 'center', width: '4%'},
          {label: '证券名称', field: 'instrument_name', align: 'center', width: '4%'},
          {label: '日期', field: 'trandat', align: 'center', width: '4%'},
          {label: '收盘价', field: 'crntcls', align: 'center', width: '4%'},
          {label: '持股账户数', field: 'hold_num_e_5', align: 'center', width: '5%'},
          {
            label: '自由流通量',
            field: 'market_float_e_5',
            align: 'center',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
          },
          {
            label: '前50账户持股比重',
            field: 'percent_50_e_5',
            align: 'center',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
          },
          {label: '前100账户持股比重', field: 'percent_100_e_5', align: 'center', width: '5%'},
          {
            label: '前200账户持股比重',
            field: 'percent_200_e_5',
            align: 'center',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
          },
          {
            label: '前50账户持股比重（扣除特殊机构）',
            field: 'percent_50_e_5_org',
            align: 'center',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
          },
          {label: '前100账户持股比重（扣除特殊机构）', field: 'percent_100_e_5_org', align: 'center', width: '8%'},
          {label: '前200账户持股比重（扣除特殊机构）', field: 'percent_200_e_5_org', align: 'center', width: '8%'}
        ]
      }
    },
    methods: {
      getstartDate(val) {
        console.log(val)
      },
      getTableData() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        let params = {stockCode: this.routerParams.isinCode}
        holdStockConcentrationData(params).then(resp => {
          loading.close()
          this.holdingStockData = resp.queryResult.bizData.metaData
          let result = resp.queryResult.bizData.metaData
          let dateArr = [], crntclsArr = [], pecentValArr = [], pecentValOrgArr = [], holdNumberArr = []
          let time = ''
          let stockName = ''
          if (!result[0]) {
            stockName = ''
          } else {
            stockName = result[0].instrument_name
          }
          result.forEach((el) => {
            if (el.crntcls == '' || el.crntcls == null) {
              el.crntcls = 0
            }

            time = moment(el.trandat, 'YYYYMMDD').format('YYYY-MM-DD')
            dateArr.push(time)
            crntclsArr.push(el.crntcls)
            pecentValArr.push(el.percent_200_e_5)
            pecentValOrgArr.push(el.percent_200_e_5_org)
            holdNumberArr.push(el.hold_num_e_5)
          })
          let value = {
            name: stockName,
            date: dateArr.reverse(),
            crntcls: crntclsArr.reverse(),
            pecentVal: pecentValArr.reverse(),
            pecentValOrg: pecentValOrgArr.reverse(),
            holdNumber: holdNumberArr.reverse()
          }
          this.drawLine(value)
        }, () => {
          loading.close()
        })
      },
      drawLine(data) {
        let myLine = document.getElementById('stockChart')
        let mychart = echarts.init(myLine)
        let option = {
          title: {
            text: `${this.routerParams.isinCode}  ${data.name}  持股集中度`,
            left: 'center',
            textStyle: {
              'color': '#fff',
              'fontWeight': '300'
            },
            subtext: '注：左外轴代表持股比例（单位：%），左内轴代表持股人数（单位：人），右外轴代表收盘价（单位：元）',
            subtextStyle: {
              'color': '#7b8fb9'
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              let texts = ''
              params.forEach((el) => {
                if (el.seriesName == '持股账户数') {
                  texts += el.marker + el.seriesName + ':' + el.value + '人<br/>'
                } else if (el.seriesName == '收盘价') {
                  texts += el.marker + el.seriesName + ':' + el.value + '元<br/>'
                } else {
                  texts += el.marker + el.seriesName + ':' + el.value + '%<br/>'
                }
              })
              return texts
            }
          },
          xAxis: {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#455579'
              }
            },
            axisLabel: {
              show: true,
              color: '#aec0e6'
            },
            splitLine: {
              lineStyle: {
                color: '#273757'
              }
            },
            data: data.date
          },
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              },
              axisLabel: {
                color: '#aec0e6'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#273757',
                  type: 'dashed'
                }
              }
            },
            {
              type: 'value',
              position: 'left',
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              },
              axisLabel: {
                color: '#aec0e6',
                inside: true
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#273757',
                  type: 'dashed'
                }
              }
            },
            {
              type: 'value',
              position: 'right',
              axisLabel: {
                color: '#aec0e6'
              },
              axisLine: {
                lineStyle: {
                  color: '#455579'
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#273757',
                  type: 'dashed'
                }
              }
            }
          ],
          grid: {
            left: '20',
            right: '50',
            top: '60',
            bottom: '60',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            },
            right: 60,
            itemSize: 20
          },
          legend: {
            orient: 'horizontal',
            bottom: '10',
            data: ['前200账户持股比重', '前200账户持股比重(扣除特殊机构)', '持股账户数', '收盘价'],
            inactiveColor: '#7b8fb9',
            textStyle: {
              color: '#aec0e6'
            }
          },
          calculable: true,
          series: [
            {
              name: '前200账户持股比重',
              type: 'line',
              yAxis: 1,
              itemStyle: {
                color: '#4a57ff',
                normal: {
                  color: '#4a57ff'
                }
              },
              data: data.pecentVal
            },
            {
              name: '前200账户持股比重(扣除特殊机构)',
              type: 'line',
              yAxis: 1,
              itemStyle: {
                color: '#18b2f2',
                normal: {
                  color: '#18b2f2'
                }
              },
              data: data.pecentValOrg
            },
            {
              name: '持股账户数',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {
                color: '#ff4c4c',
                normal: {
                  color: '#ff4c4c'
                }
              },
              data: data.holdNumber
            },
            {
              name: '收盘价',
              type: 'line',
              yAxisIndex: 2,
              itemStyle: {
                color: '#ffcd36',
                normal: {
                  color: '#ffcd36'
                }
              },
              data: data.crntcls
            }
          ]
        }
        window.onresize = mychart.resize
        mychart.setOption(option)
      },
      exportHoldTable() {
        let params = {
          stockCode: this.routerParams.isinCode,
          tableColumns: this.holdingStockColumns,
          fileType: 'excel',
          type: '2'
        }
        this.gfnExportFileWithForm('/regularqry/v1/positiondegree/export', params)
      }
    },
    mounted() {
      this.getTableData()
    }
  }
</script>

<style lang="less">

</style>
