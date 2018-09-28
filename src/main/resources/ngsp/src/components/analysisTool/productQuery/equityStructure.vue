<template>
  <!--股权结构-->
  <div class="equity-structure">
    <el-card>
      <el-row>
        <el-col :span="6" style="margin-left: 10px;">
          <el-col :span="6" class="name"><span class="mustInput name">*</span>证券代码：</el-col>
          <el-col :span="12">
            <el-input
                v-model="stockCode"
                placeholder="请输入证券代码"
                size="small"
                disabled>
            </el-input>
          </el-col>
        </el-col>
        <el-col :span="1" :offset="16">
          <el-button type="primary" size="small" @click="getQueryRes">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 20px ;padding-top: 0" v-if="queryCon">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="期初日期汇总" name="startDate">
          <el-row>
            <el-table
                :data="startTimeTableData"
                :fit=true
                border>
              <el-table-column
                  v-for="item in TableOption"
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label"
                  :align="item.align"
                  show-overflow-tooltip
                  :sortable="item.sortable == null ? false : item.sortable"
                  :sort-method="item.sortMethod"
                  :formatter="item.formatter">
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="期末日期汇总" name="endDate">
          <el-row>
            <el-table
                :data="endTimeTableData"
                :fit=true
                border>
              <el-table-column
                  v-for="item in TableOption"
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label"
                  :align="item.align"
                  show-overflow-tooltip
                  :sortable="item.sortable == null ? false : item.sortable"
                  :sort-method="item.sortMethod"
                  :formatter="item.formatter">
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-row v-show="showCharts">
        <div class=" resultChart" style="width: 1400px;height: 500px;margin-bottom: 40px;"></div>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import { getEquityStructureQuery } from '../../../service/analysisTool/productQuery'
  import moment from 'moment'
  import echarts from 'echarts'
  import MinxinVue from './common/MixIn'

  require('echarts/lib/chart/bar')
  require('echarts/lib/component/title')

  export default {
    mixins: [MinxinVue],
    data () {
      return {
        msg: '股权结构',
        stockCode: '',
        activeName: 'startDate',
        queryCon: false,
        TableOption: [
          {prop: 'trade_date', label: '日期', align: 'left', sortable: true},
          {prop: 'position_range', label: '持股范围', align: 'left', sortable: true,sortMethod: this.gfnSortColByNumber.bind(this, 'position_range')},
          {prop: 'position_num', label: '持股人数', align: 'right', formatter: this.gfnElColFormatDecThou0, format: '#,##0', sortable: true,sortMethod: this.gfnSortColByNumber.bind(this, 'position_num')},
          {prop: 'num_rate', label: '持股人数占比（单位：%）', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000', sortable: true,sortMethod: this.gfnSortColByNumber.bind(this, 'num_rate')},
          {prop: 'position_amount', label: '持股总量', align: 'right', formatter: this.gfnElColFormatDecThou0, format: '#,##0', sortable: true,sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount')},
          {prop: 'amount_rate', label: '持股总量占比（单位：%）', align: 'right', formatter: this.gfnElColFormatDec3, format: '0.000', sortable: true,sortMethod: this.gfnSortColByNumber.bind(this, 'amount_rate')},
          {prop: 'avg_amount', label: '持有平均数量', align: 'right', formatter: this.gfnElColFormatDecThou0, format: '#,##0', sortable: true,sortMethod: this.gfnSortColByNumber.bind(this, 'avg_amount')}
        ],
        title: [],
        startTimeTableData: [],
        startTitle: {},
        endTimeTableData: [],
        endTitle: {},
        // 柱状图是否展示
        showCharts: true,
        // 持股范围
        positionRangeArr: [],
        // 持股人数
        positionNumArr: [],
        // 持股人数占比
        numRateArr: [],
        // 持股总量
        positionAmountArr: [],
        // 持股总量占比
        amountRateArr: []
      }
    },
    props: ['commonData'],
    methods: {
      getStockCode () {
        this.stockCode = this.commonData.stockCode
      },
      getQueryRes () {
        this.queryCon = true
        this.activeName = 'startDate'
        let params = {
          dateTimeStart: this.commonData.dateTimeStart,
          dateTimeEnd: this.commonData.dateTimeEnd,
          stockCode: this.commonData.stockCode.split(' ')[0]
        }
        getEquityStructureQuery(params).then((resp) => {
          // 判断返回结果中是否有期初数据
          if (resp.queryResultStart != undefined) {
            // 有期初数据，取返回数据，将表格及柱状图展示出来，
            this.startTimeTableData = resp.queryResultStart.bizData.metaData
            this.startTitle = resp.totleStart.bizData.metaData[0]
            this.showCharts = true
            // 默认展示期初柱状图
            this.positionRangeArr = []
            this.positionNumArr = []
            this.numRateArr = []
            this.positionAmountArr = []
            this.amountRateArr = []
            // 获取柱状图所需数据
            for (let item of this.startTimeTableData) {
              let amountPosition = parseInt(item.position_amount.split(',').join(''))
              let numPosition = parseInt(item.position_num.split(',').join(''))
              this.positionRangeArr.push(item.position_range)
              this.positionNumArr.push(numPosition)
              this.numRateArr.push(item.num_rate)
              this.positionAmountArr.push(amountPosition)
              this.amountRateArr.push(item.amount_rate)
            }
            this.title = this.startTitle
            this.drawLine()
          } else {
            // 没有期初数据，隐藏柱状图，表格数据置空
            this.startTimeTableData = []
            this.showCharts = false
          }
          if (resp.queryResultEnd != undefined) {
            // 有期末数据，获取期末数据
            this.endTimeTableData = resp.queryResultEnd.bizData.metaData
            this.endTitle = resp.totleEnd.bizData.metaData[0]
          } else {
            // 没有期末数据，表格数据置空
            this.endTimeTableData = []
            this.showCharts = false
          }
        })
      },
      handleClick () {
        this.positionRangeArr = []
        this.positionNumArr = []
        this.numRateArr = []
        this.positionAmountArr = []
        this.amountRateArr = []
        if (this.activeName == 'startDate') {
          // 如果获取到期初表格数据为空，则期初柱状图不展示
          if ($.isEmptyObject(this.startTimeTableData)) {
            this.showCharts = false
          } else {
            // 否则从表格数据中获取柱状图所需数据，生成柱状图
            for (let item of this.startTimeTableData) {
              let amountPosition = parseInt(item.position_amount.split(',').join(''))
              let numPosition = parseInt(item.position_num.split(',').join(''))
              this.positionRangeArr.push(item.position_range)
              this.positionNumArr.push(numPosition)
              this.numRateArr.push(item.num_rate)
              this.positionAmountArr.push(amountPosition)
              this.amountRateArr.push(item.amount_rate)
            }
            this.title = this.startTitle
            this.showCharts = true
            this.drawLine()
          }
          // 如果获取到期末表格数据为空，则期末柱状图不展示
        } else if (this.activeName == 'endDate') {
          if ($.isEmptyObject(this.endTimeTableData)) {
            this.showCharts = false
          } else {
            // 否则从表格数据中获取柱状图所需数据，生成柱状图
            for (let item of this.endTimeTableData) {
              let amountPosition = parseInt(item.position_amount.split(',').join(''))
              let numPosition = parseInt(item.position_num.split(',').join(''))
              this.positionRangeArr.push(item.position_range)
              this.positionNumArr.push(numPosition)
              this.numRateArr.push(item.num_rate)
              this.positionAmountArr.push(amountPosition)
              this.amountRateArr.push(item.amount_rate)
            }
            this.title = this.endTitle
            this.showCharts = true
            this.drawLine()
          }
        }
      },
      drawLine () {
        let mychart = echarts.init($('.resultChart')[0])
        let that = this
        let titleText = moment(this.title.trade_date, 'YYYYMMDD').format('YYYY/MM/DD') + '                              持股人数 ' + this.title.position_num + '                              持股总量  ' + this.title.position_amount
        mychart.setOption({
          title: {
            text: titleText,
            left: 'center',
            textStyle: {
              'color': '#fff',
              'fontWeight': '500'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            show: true,
            type: 'category',
            // boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              show: true
              //  interval: 10
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#999',
                type: 'solid'
              }
            },
            data: this.positionRangeArr
          },
          yAxis: [{
            name: '持股人数',
            // nameLocation: 'middle',
            // nameGap: '40',
            type: 'value',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisLabel: {
              show: true
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(153,153,153,0.2)',
                type: 'dashed'
              }
            }
          },
            {
              name: '持股数量',
              // nameLocation: 'middle',
              // nameGap: '80',
              position: 'right',
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#999'
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: 'rgba(153,153,153,0.2)',
                  type: 'dashed'
                }
              }
            }],
          grid: {
            left: '100',
            right: '100',
            top: '50',
            bottom: '60',
            containLabel: true
          },
          legend: {
            orient: 'horizontal',
            y: 'bottom',
            data: ['持股人数', '持股数量'],
            inactiveColor: '#7b8fb9',
            textStyle: {
              color: '#aec0e6'
            }
          },
          calculable: true,
          series: [
            {
              name: '持股人数',
              type: 'bar',
              smooth: true,
              yAxis: 1,
              itemStyle: {
                color: 'rgba(255,76,76,1)',
                normal: {
                  color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: 'rgba(255,76,76,1)'},
                    {offset: 1, color: 'rgba(255,76,76,0.5)'}
                  ]
                  ),
                  label: {
                    show: true,
                    position: 'top',
                    color: 'rgba(255,76,76,1)',
                    formatter: function (params) {
                      params.value = that.numRateArr[params.dataIndex] + '%'
                      return params.value
                    }
                  }

                }
              },
              data: this.positionNumArr
            },
            {
              name: '持股数量',
              type: 'bar',
              // smooth: true,
              // symbol: 'none',
              // sampling: 'average',
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: 'rgba(24,178,242,1)'},
                    {offset: 1, color: 'rgba(24,178,242,0.5)'}
                  ]
                  ),
                  //  color:'red',
                  label: {
                    show: true,
                    position: 'top',
                    color: 'rgba(24,178,242,1)',
                    formatter: function (params) {
                      params.value = that.amountRateArr[params.dataIndex] + '%'
                      return params.value
                    }
                  }
                }
              },
              data: this.positionAmountArr
            }
          ]
        })
      }
    },
    mounted () {}
  }
</script>

<style lang='less'>
  .equity-structure {
    .el-card {
      margin-top: 0;
      padding: 15px;
    }
    .resultChart {
      margin: 40px auto;

    }
  }
</style>
