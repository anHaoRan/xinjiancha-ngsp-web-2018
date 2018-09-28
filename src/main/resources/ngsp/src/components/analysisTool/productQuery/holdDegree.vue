<template>
  <!--持股集中度-->
  <div class="stock-hold-degree">
    <el-card>
      <div class="hold-degree-charts" style="width: 1200px;height: 500px; "></div>
      <div style="margin:20px 40px 40px; text-align: center">注：左外轴代表持股比例（单位：%），左内轴代表持股人数（单位：人），右外轴代表收盘价（单位：元）</div>
      <div class="hold-degree-table">
        <el-button type="info" size="small" style="float: right;margin-bottom: 10px;" @click="saveLocation">导出</el-button>
        <el-table
            class="el-card-table"
            :data="tableData"
            border
            tooltip-effect="dark"
            height="310"
            size="small"
            :fit=true
            highlight-current-row
            v-loading="queryResLoad"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.3)"
            style="width: 100%">
          <el-table-column
              resizable
              v-for="column in tableOptions"
              :show-overflow-tooltip="true"
              :key="column.field"
              :label="column.label"
              :prop="column.field"
              :width="column.width"
              :min-width="column.minWidth"
              :formatter="column.formatter"
              :align="column.align == null ? 'center' : column.align"
              :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod"/>
        </el-table>
      </div>
    </el-card>

  </div>
</template>

<script>
  import { getHoldDegree } from '../../../service/analysisTool/productQuery'
  import moment from 'moment'
  import echarts from 'echarts'
  // 引入echarts
  // let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/component/title')

  export default {
    data () {
      return {
        stockCode: this.commonData.stockCode,
        msg: '持股集中度',
        tableData: [],
        resData: {},
        queryResLoad: false,
        tableOptions: [
          {label: '证券代码', field: 'isincod', width: '78', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'isincod')},
          {label: '证券名称', field: 'instrument_name', width: '78', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_name')},
          {label: '日期', field: 'trandat', width: '108', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trandat')},
          {label: '收盘价', field: 'crntcls', width: '120', align: 'right', formatter: this.gfnElColFormatDecThou3, format: '#,##0.000', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trandat')},
          {label: '持股账户数', field: 'hold_num_e_5', width: '150', align: 'right', formatter: this.gfnElColFormatDecThouNoneFloat, format: '#,##0', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'hold_num_e_5')},
          {label: '自由流通量', field: 'market_float_e_5', width: '150', align: 'right', formatter: this.gfnElColFormatDecThouNoneFloat, format: '#,##0', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'market_float_e_5')},
          {label: '前50账户持股比重', field: 'percent_50_e_5', width: '165', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'percent_50_e_5')},
          {label: '前100账户持股比重', field: 'percent_100_e_5', width: '165', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'percent_100_e_5')},
          {label: '前200账户持股比重', field: 'percent_200_e_5', width: '165', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'percent_200_e_5')},
          {label: '前50账户持股比重(扣除特殊机构)', field: 'percent_50_e_5_org', width: '142', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'percent_50_e_5_org')},
          {label: '前100账户持股比重(扣除特殊机构)', field: 'percent_100_e_5_org', width: '146', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'percent_100_e_5_org')},
          {label: '前200账户持股比重(扣除特殊机构)', field: 'percent_200_e_5_org', width: '146', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'percent_200_e_5_org')}
        ],
        requestParams:{}
      }
    },
    mounted () {
      this.getChartsOption()
    },
    props: ['commonData'],
    methods: {
      getChartsOption () {
        this.requestParams = {
          stockCode: this.commonData.stockCode.split(' ')[0]
        }
       let that = this
        getHoldDegree(this.requestParams).then((resp) => {
          that.tableData = resp.queryResult.bizData.metaData
          let dateArr = [], crntclsArr = [], pecentValArr = [], pecentValOrgArr = [], holdNumberArr = []

          for (let item of that.tableData) {
            let time = ''
            if (item.crntcls == '' || item.crntcls == null) {
              item.crntcls = 0
            }
            time = moment(item.trandat, 'YYYYMMDD').format('DD-MMMM-YYYY')
            dateArr.push(time)
            crntclsArr.push(item.crntcls)
            pecentValArr.push(item.percent_200_e_5)
            pecentValOrgArr.push(item.percent_200_e_5_org)
            holdNumberArr.push(item.hold_num_e_5)
          }
          let value = {
            date: dateArr.reverse(),
            crntcls: crntclsArr.reverse(),
            pecentVal: pecentValArr.reverse(),
            pecentValOrg: pecentValOrgArr.reverse(),
            holdNumber: holdNumberArr.reverse()
          }
          this.drawLine(value)
        })
      },
      drawLine (data) {
        let mychart = echarts.init($('.hold-degree-charts')[0])
        let option = {
          title: {
            text: this.commonData.stockCode + '持股集中度',
            left: 'center',
            textStyle: {
              'color': '#fff',
              'fontWeight': '300'
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              let date = moment(params[0].name, 'DD-MMMM-YYYY').format('YYYY年MM月DD日')
              let str = `日期： ${date}<br/>`
              let unit = ''
              for (let i = 0; i < params.length; i++) {
                switch (params[i].seriesName) {
                  case '前200账户持股比重' :
                  case '前200账户持股比重(扣除特殊机构)':
                    unit = '%'
                    break
                  case '持股账户数':
                    unit = '人'
                    break
                  case '收盘价':
                    unit = '元'
                    break
                }
                str += params[i].marker + params[i].seriesName + ' : ' + params[i].value + unit + '</br>'
              }
              return str
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
              // interval: 10
            },
            splitLine: {
              lineStyle: {
                color: '#273757'
              }
            },
            data: data.date
          },
          yAxis: [{
            // name: '持股比例',
            type: 'value',
            // position: 'left',
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
              // name: '持股账户数',
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
              // name: '',
              nameTextStyle: {
                color: '#aec0e6'
              },
              type: 'value',
              // offset:60,
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
            }],
          grid: {
            left: '20',
            right: '50',
            top: '60',
            bottom: '60',
            containLabel: true
          },
          legend: {
            orient: 'horizontal',
            y: 'bottom',
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
              // smooth: true,
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
              // smooth: true,
              // symbol: 'none',
              // sampling: 'average',
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
              // smooth: true,
              // symbol: 'none',
              // sampling: 'average',
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
              // smooth: true,
              // symbol: 'none',
              // sampling: 'average',
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
      saveLocation(){
        let params = {...this.requestParams}
        params['tableColumns'] = [
          {
            sheetName: '产品查询-持股集中度查询',
            fileColumns: this.tableOptions
          }
        ]
        params['type'] = 'positiondegree'
        params['fileType'] = 'excel'
        console.log(params)
        this.gfnExportFileWithForm('/regularqry/product/v1/export', params)
      }
    }
    // updated:function () {
    //   this.getChartsOption();
    // }

  }
</script>

<style lang='less'>
  .stock-hold-degree {
    .el-card:nth-child(1) {
      margin-top: 0;
    }
    .hold-degree-charts-title {
      text-align: center;
      font-size: 20px;
      margin-top: 20px;
    }
    .hold-degree-charts {
      margin: 30px auto 0;

    }
  }
</style>
