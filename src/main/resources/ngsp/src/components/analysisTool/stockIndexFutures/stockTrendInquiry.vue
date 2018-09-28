<!--  股指期货走势查询 -->
<template>
  <div class="stock-index-futures-trend-inquiry">
    <el-card>
      <div slot="header">
        查询条件
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
      </div>
      <el-form ref='stockIndexFuturesTrendInquiry' :inline="true" :model='formData' :rules='rules' label-width='140px'>
        <el-form-item label='开始日期：' prop='dateStart'>
          <el-date-picker
            v-model="formData.dateStart"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="beginPickerData"
            size="small"
            style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='结束日期：' prop='dateEnd'>
          <el-date-picker
            v-model="formData.dateEnd"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="endPickerData"
            size="small"
            style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='交易类型：' prop='tradeType'>
          <el-select v-model="formData.tradeType" multiple placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in tradeTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='持仓类型：' prop='chiCType'>
          <el-select v-model="formData.chiCType" multiple placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in chiCTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='产品类型：' prop='productType'>
          <el-select v-model="formData.productType" multiple placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in productTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='分类投资者类型：' prop='investorType'>
          <el-select v-model="formData.investorType" multiple placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in investorTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-show="isShowRes">
      <s-table
        :columns="columns"
        :data="tableData"
        :isPageination="false"
        :loading="loading"
        @getPageination="getPageination">
        <div slot="tableHeader">
          <div id="stockIndexFuturesTrendInquiry" v-if="setChartWidth" style="width: 100%; height: 350px;"></div>
          <div style="text-align: right" v-if="tableData.data.length">
            <el-dropdown @command="handleDownload">
              <el-button type="info" size="small">
                导出<i class="el-icon-arrow-down el-icon-right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="excel">
                  <i class="el-icon-document"></i>导出为EXCEL
                </el-dropdown-item>
                <el-dropdown-item command="csv">
                  <i class="el-icon-tickets"></i>导出为CSV
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </s-table>
    </div>
  </div>

</template>

<script>
  import {stockFuturesTrend, exportStockFuturesTrend} from '@/service/analysisTool/stockIndexFutures/index'
  import moment from 'moment'
  import echarts from 'echarts'

  export default {
    name: 'stock-trend-inquiry',
    components: {
      STable: () => import('@/components/base/STable')
    },
    props: ['setChartWidth'],
    data() {
      return {
        isShowRes: false,
        tradeTypeList: [
          {
            id: 'dk',
            mark: 'tType1',
            name: '多头开仓'
          },
          {
            id: 'dp',
            mark: 'tType2',
            name: '多头平仓'
          },
          {
            id: 'kk',
            mark: 'tType3',
            name: '空头开仓'
          },
          {
            id: 'kp',
            mark: 'tType4',
            name: '空头平仓'
          },

        ],
        chiCTypeList: [
          {
            id: 'dc',
            mark: 'hType1',
            name: '多头持仓'
          },
          {
            id: 'kc',
            mark: 'hType2',
            name: '空头持仓'
          },
        ],
        productTypeList: [
          {
            id: 'IF',
            name: '沪深300'
          },
          {
            id: 'IH',
            name: '上证50'
          },
          {
            id: 'IC',
            name: '中证500'
          },
          {
            id: 'TF',
            name: '5年期国债'
          },
          {
            id: 'T',
            name: '10年期国债'
          },
        ],
        investorTypeList: [
          {
            id: 'iType1',
            mark: '01,02',
            name: '公募基金'
          },
          {
            id: 'iType2',
            mark: 'N',
            name: '基金专户'
          },
          {
            id: 'iType3',
            mark: '03',
            name: '社保基金'
          },
          {
            id: 'iType4',
            mark: '04',
            name: 'QFII'
          },
          {
            id: 'iType5',
            mark: 'N',
            name: 'RQFII'
          },
          {
            id: 'iType6',
            mark: '05',
            name: '保险机构'
          },
          {
            id: 'iType7',
            mark: '10',
            name: '信托产品'
          },
          {
            id: 'iType8',
            mark: 'N',
            name: '企业年金'
          },
          {
            id: 'iType9',
            mark: '06',
            name: '券商自营'
          },
          {
            id: 'iType10',
            mark: '07',
            name: '券商集合理财'
          },
          {
            id: 'iType11',
            mark: 'N',
            name: '沪股通'
          },
          {
            id: 'iType12',
            mark: '08',
            name: '其他机构'
          }
        ],
        formData: {
          dateStart: new Date(),
          dateEnd: new Date(),
          tradeType: ['dk'], // 交易类型
          chiCType: ['dc'], // 持仓类型
          productType: ['IF'], // 产品类型
          investorType: [] // 分类投资者类型
        },
        rules: {
          dateStart: [
            {required: true, message: '请选择'}
          ],
          dateEnd: [
            {required: true, message: '请选择'}
          ],
          tradeType: [
            {required: true, message: '请选择'}
          ],
          chiCType: [
            {required: true, message: '请选择'}
          ],
          productType: [
            {required: true, message: '请选择'}
          ],
          investorType: [
            {required: true, message: '请选择'}
          ]
        },
        columns: [],
        columnsList: [
          {
            label: '日期',
            field: 'trade_date',
            align: 'left',
            mark: 'fix',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_date')
          },
          {
            label: '开仓(多方)',
            field: 'mrkl',
            align: 'left',
            mark: 'dk',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mrkl'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '平仓(多方)',
            field: 'mcpl',
            align: 'left',
            mark: 'dp',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mcpl'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '持仓(多方)',
            field: 'mrcl',
            align: 'left',
            mark: 'dc',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mrcl'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '开仓(空方)',
            field: 'mckl',
            align: 'left',
            mark: 'kk',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mckl'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '平仓(空方)',
            field: 'mrpl',
            align: 'left',
            mark: 'kp',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mrpl'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '持仓(空方)',
            field: 'mccl',
            align: 'left',
            mark: 'kc',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mccl'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '仓差(多方)',
            field: 'mrlc',
            align: 'left',
            mark: 'fix',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mrlc'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '仓差(空方)',
            field: 'mclc',
            align: 'left',
            mark: 'fix',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mclc'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          }
        ],
        loading: false,
        tableData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        chartsOption: {
          title: {
            text: '期货走势图',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            formatter: function (param) {
              let arr = []
              param.map(item => {
                arr.push(`${item.marker} ${item.seriesName}:&nbsp;${item.value[`${item.seriesId}`]}<br/>`)
              })
              arr.unshift(`${param[0].name}<br/>`)
              return arr.join('')
            }
          },
          color: [],
          legend: {
            top: 40,
            data: [] // '多方开仓', '多方持仓', '多方平仓', '空方开仓', '空方持仓', '空方平仓', '多方仓差', '空方仓差'
          },
          toolbox: {
            feature: {
              saveAsImage: {
                type: 'jpeg',
                name: '期货走势图'
              }
            },
            right: 80
          },
          grid: [
            {
              left: 130,
              right: 180,
              top: 80
            }
          ],
          xAxis: [
            {
              type: 'category',
              scale: true,
              boundaryGap: false,
              containLabel: true,
              axisLabel: {
                formatter: function(value, index) {
                  return moment(value, 'YYYY-MM-DD').format('YYYY-MM-DD')
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              name: '持仓量',
              min: 'dataMin'
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 20,
              end: 100,
              left: 130,
              right: 180,
              top: 'top',
              bottom: 'auto'
            },
            {
              type: 'slider',
              show: false,
              xAxisIndex: [0],
              y: '90%',
              start: 20,
              end: 100,
              left: 130,
              right: 180,
              top: 'top',
              bottom: 'auto'
            }
          ],
          dataset: {
            dimensions: ['trade_date', 'mrkl', 'mcpl', 'mckl', 'mrpl', 'mrcl', 'mccl', 'mrlc', 'mclc'],
            source: []
          },
          series: []
        },
        seriesList: [
          {
            mark: 'dk',
            color: '#78bded',
            name: '多方开仓',
            d: { // 多方开仓
              type: 'line',
              id: 'mrkl',
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '多方开仓',
              encode: {
                x: 'trade_date',
                y: 'mrkl'
              }
            }
          },
          {
            mark: 'dp',
            color: '#7e8490',
            name: '多方平仓',
            d: {
              type: 'line',
              id: 'mcpl',
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '多方平仓',
              encode: {
                x: 'trade_date',
                y: 'mcpl'
              }
            }
          },
          {
            mark: 'dc',
            color: '#9648e2',
            name: '多方持仓',
            d: { // 多方持仓
              type: 'line',
              id: 'mrcl',
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '多方持仓',
              encode: {
                x: 'trade_date',
                y: 'mrcl'
              }
            }
          },
          {
            mark: 'kk',
            color: '#72fbae',
            name: '空方开仓',
            d: {
              type: 'line',
              id: 'mckl',
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '空方开仓',
              encode: {
                x: 'trade_date',
                y: 'mckl'
              }
            }
          },
          {
            mark: 'kp',
            color: '#FFA500',
            name: '空方平仓',
            d: {
              type: 'line',
              id: 'mrpl',
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '空方平仓',
              encode: {
                x: 'trade_date',
                y: 'mrpl'
              }
            }
          },
          {
            mark: 'kc',
            color: '#dc2e51',
            name: '空方持仓',
            d: {
              type: 'line',
              id: 'mccl',
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '空方持仓',
              encode: {
                x: 'trade_date',
                y: 'mccl'
              }
            }
          },
          {
            mark: 'fix',
            color: '#f0e76a',
            name: '多方仓差',
            d: { // 多方仓差
              type: 'line',
              id: 'mrlc',
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '多方仓差',
              encode: {
                x: 'trade_date',
                y: 'mrlc'
              }
            }
          },
          {
            mark: 'fix',
            color: '#006400',
            name: '空方仓差',
            d: { // 空方仓差
              type: 'line',
              id: 'mclc',
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: '空方仓差',
              stack: '买卖量',
              encode: {
                x: 'trade_date',
                y: 'mclc'
              }
            }
          }
        ],
        chartsData: [],
        beginPickerData: {
          disabledDate: (time) => {
            return time.getTime() >= new Date(this.formData.dateEnd).getTime()
          }
        },
        endPickerData: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.formData.dateStart).getTime() - 3600 * 1000 * 24
          }
        }
      }
    },
    methods: {
      drawChart() {
        let myChart = document.getElementById('stockIndexFuturesTrendInquiry'), echart = echarts.init(myChart, this.gfnGetTheme())
        echart.clear()
        this.gfnEchartShowLoading(echart)
        this.chartsOption.dataset.source = this.chartsData
        if (this.chartsOption.dataset.source.length) {
          echart.setOption(this.chartsOption)
          window.onresize = echart.resize
          echart.hideLoading()
        }
      },
      handleSearch() {
        let sDate = moment(this.formData.dateStart).format('YYYY-MM-DD'),
          eDate = moment(this.formData.dateEnd).format('YYYY-MM-DD'),
          threeTimes = 7948800000 // 三个月毫秒数
        if ((new Date(eDate).getTime() - new Date(sDate).getTime()) > threeTimes ) {
          this.$message.error('查询时间不得超过三个月')
          return
        }
        this.$refs['stockIndexFuturesTrendInquiry'].validate((valid) => {
          if (valid) {
            this.isShowRes = true
            this.queryData = JSON.parse(JSON.stringify(this.formData))

            // 处理分类投资者
            let investor = []
            this.investorTypeList.filter(v => {
              if (this.queryData.investorType.indexOf(v.id) > -1) investor.push(v.mark)
            })
            this.queryData.investorType = investor

            // 处理表头
            let tempColumn = this.columnsList.filter(v => {
              return this.queryData.chiCType.indexOf(v.mark) > -1 || this.queryData.tradeType.indexOf(v.mark) > -1 || v.mark === 'fix'
            })
            this.columns = tempColumn

            // 处理图表渲染
            let chartSeries = [], chartColor = [], chartLegend = []
            this.seriesList.filter(v => {
              if (this.queryData.chiCType.indexOf(v.mark) > -1 || this.queryData.tradeType.indexOf(v.mark) > -1 || v.mark === 'fix') {
                chartSeries.push(v.d)
                chartColor.push(v.color)
                chartLegend.push(v.name)
              }
            })
            this.$set(this.chartsOption, 'series', chartSeries)
            this.$set(this.chartsOption, 'color', chartColor)
            this.$set(this.chartsOption.legend, 'data', chartLegend)

            this.reqTableData()
          }
        })
      },
      reqTableData() {
        let params = {
          dateStart: moment(this.queryData.dateStart).format('YYYYMMDD'),
          dateEnd: moment(this.queryData.dateEnd).format('YYYYMMDD'),
          productType: this.queryData.productType.join(','),
          tradeType: this.queryData.tradeType.join(','),
          chiCType: this.queryData.chiCType.join(','),
          investorType: this.queryData.investorType.join(',')
        }
        this.loading = true

        stockFuturesTrend(params).then((resp) => {
          if (resp) {
            this.loading = false
            this.tableData.data = resp.bizData.metaData
            this.chartsData = this.tableData.data
            this.drawChart()
          }
        })
        // setTimeout(() => {
        //   this.loading = false
        //   this.tableData.data = [
        //     {
        //       "mcpl": "5000",
        //       "mrpl": "800",
        //       "mckl": "400",
        //       "mrkl": "1200",
        //       "trade_date": "20131120",
        //       "mrcl": "20",
        //       "mclc": "450",
        //       "mrlc": "120",
        //       "mccl": "120"
        //     }
        //   ]
        //   this.chartsData = this.tableData.data
        //   this.drawChart()
        // }, 2000)
      },
      handleDownload(type) {
        let params = {
          dateStart: moment(this.queryData.dateStart).format('YYYYMMDD'),
          dateEnd: moment(this.queryData.dateEnd).format('YYYYMMDD'),
          productType: this.queryData.productType.join(','),
          tradeType: this.queryData.tradeType.join(','),
          chiCType: this.queryData.chiCType.join(','),
          investorType: this.queryData.investorType.join(','),
          type: 'sfTrend',
          fileType: type,
          tableColumns: [{
            sheetName: '股指期货查询',
            fileColumns: this.columns
          }]
        }
        exportStockFuturesTrend(params)
      },
      getPageination(pageinationVal) {}
    }
  }
</script>

<style lang='less' scoped>
  .stock-index-futures-trend-inquiry {
  }
</style>
