<!--成交回放-->
<template>
  <div class='transactionReplay'>
    <tab-table-pagination-component
      :loading='loading'
      :tabsType='`card`'
      :tabPanes='tabPanes'
      :activeName='activeName'
      @updateActiveName='updateActiveName'>
      <div slot='0'>
        <div>
          <common-echarts-component
            :class="chartsDay && chartsDay.length ? '' : 'set-width'"
            domId="trackingReplayDay"
            @handleEchartDblClickEvent="chartsDayThrowDbl"
            :defaultOption="chartsOptionDay"
            :propsData="chartsDay"
            :propsChartHeight="chartsDay && chartsDay.length ? 700 : 650"></common-echarts-component>
        </div>
      </div>
      <div slot='1'>
        <div v-show="chartsMin && chartsMin.length">
          <el-col>
            <el-col :xl="12" :lg="12" :md="12" :sm="12">
              <el-button type="info" plain @click="timeSliceAnalysis">时间片分析</el-button>
            </el-col>
            <el-col :xl="12" :lg="12" :md="12" :sm="12">
              <export-btn @handleExportData="handleExportDataMin" :exportCsv="false"></export-btn>
            </el-col>
          </el-col>
          <el-col class="clearfix">
            <common-echarts-component
              :class="chartsMin && chartsMin.length ? '' : 'set-width'"
              domId="trackingReplayMin"
              @handleEchartDblClickEvent="chartsMinThrowDbl"
              @handleBrushSelectedEvent="minBrushSelected"
              :defaultOption="chartsOptionMin"
              :propsData="chartsMin"
              :propsChartHeight="chartsMin && chartsMin.length ? 700 : 650"></common-echarts-component>
          </el-col>
        </div>
      </div>
      <div slot='2'>
        <div v-show="chartsSec && chartsSec.length">
          <el-col>
            <el-col :xl="12" :lg="12" :md="12" :sm="12">&nbsp;</el-col>
            <el-col :xl="12" :lg="12" :md="12" :sm="12">
              <export-btn @handleExportData="handleExportDataSec" :exportCsv="false"></export-btn>
            </el-col>
          </el-col>
          <el-col class="clearfix">
            <common-echarts-component
              :class="chartsSec && chartsSec.length ? '' : 'set-width'"
              domId="trackingReplaySec"
              @handleEchartDblClickEvent="chartsSecThrowDbl"
              :defaultOption="chartsOptionSec"
              :propsData="chartsSec"
              :propsChartHeight="chartsSec && chartsSec.length ? 700 : 650"></common-echarts-component>
          </el-col>
        </div>
      </div>
      <div slot='3'>
        <div>
          <each-order-replay :formData="storeFormData" ref="eachOrderReplayComponent"></each-order-replay>
        </div>
      </div>
    </tab-table-pagination-component>

    <el-dialog
      title="时间片分析"
      :visible.sync="dialogVisible"
      top="2vh"
      width="96%" class="time-slice-analysis-style">
      <div style="text-align: right;">
        <el-button size="small" type="primary" @click="handleQueryTime">查询</el-button>
        <el-button size="small" type="info" @click="handleClear">清空</el-button>
      </div>
      <TimeSliceAnalysisSearchForm
        ref="replayTimeSliceForm"
        :num="3"
        :showSelectRadioGroup="false"
        :defaultRelativeTradeDate="defaultRelativeTradeDate"
        :propsSearchForm.sync="timeSliceSearchForm"></TimeSliceAnalysisSearchForm>
      <TimeSliceAnalysis activeMenuName="3" setDomId="timeSliceMainContent" ref="replayTimeSlice"></TimeSliceAnalysis>
    </el-dialog>
  </div>
</template>
<script>
  import moment from 'moment'
  import {mapGetters} from 'vuex'
  import tabTablePaginationComponent from '../../common/tabTablePaginationComponent'
  import CommonEchartsComponent from '../../common/CommonEchartsComponent'
  import ExportBtn from '../../common/ExportButtonComponent'
  import {
    transactionReplayDay,
    transactionReplayMin,
    exportTransactionReplayMin,
    transactionReplaySec,
    exportTransactionReplaySec
    // transactionReplayOrder
  } from '@/service/analysisTool/complexQuery/accountBehaviorTracking'
  import {tableColumns} from './tableColumns'
  import {chartsList} from './chartsList'
  import {resp0, resp1, resp2} from './dataJSON'

  export default {
    components: {
      tabTablePaginationComponent,
      CommonEchartsComponent,
      ExportBtn,
      TimeSliceAnalysisSearchForm: () => import('../timeSliceAnalysis/SearchForm'),
      TimeSliceAnalysis: () => import('../timeSliceAnalysis/MainContent'),
      EachOrderReplay: () => import('./EachOrderReplay')
    },
    props: ['defaultRelativeTradeDate'],
    computed: {
      ...mapGetters(['queryTrackForm7'])
    },
    watch: {
      'queryTrackForm7': {
        handler() {
          this.queryData = this.queryTrackForm7
          this.activeName = '0'
          this.chartsDay = []
          this.chartsMin = []
          this.chartsSec = []
          this.storeFormData = {} // 清空秒内每笔订单回放数据
          this.timeSliceSearchForm = {} // 清空时间片数据
          this.readyRequest(1, 'init', 0, null)
        },
        deep: true
      }
    },
    data() {
      return {
        timeSliceSearchForm: {}, // 时间片选数据
        storeFormData: {}, // 秒内每笔订单回放数据
        dialogVisible: false, // 时间片弹框
        tableColumns, // 日内每分钟/每秒导出的表头
        loading: false,
        tabPanes: [
          {label: '日K线股价走势图', slotType: 'rewrite', slotName: '0'},
          {label: '日内每分钟股价走势图', slotType: 'rewrite', slotName: '1'},
          {label: '分钟内每秒股价走势图', slotType: 'rewrite', slotName: '2'},
          {label: '秒内每笔订单成交回放', slotType: 'rewrite', slotName: '3'}
        ],
        activeName: '0',
        chartsOptionDay: chartsList[0],
        chartsDay: [],
        chartsOptionMin: chartsList[1],
        chartsMin: [],
        chartsOptionSec: chartsList[2],
        chartsSec: [],
        currentngspUid0: '', // DAY
        currentngspUid1: '', // MIN
        currentngspUid2: '', // SEC
        storeTradeDate: ''
      }
    },
    methods: {
      handleClear() { // 时间片弹框清空
        this.$refs[`replayTimeSliceForm`].handleClear()
      },
      handleQueryTime() { // 时间片弹框查询
        this.$refs[`replayTimeSliceForm`].handleSearch()
        this.$nextTick(() => {
          this.$refs['replayTimeSlice'].handleSearch()
        })
      },
      timeSliceAnalysis() { // 调用时间片模块
        if (!this.timeSliceSearchForm.startDate) {
          this.$message('请先框选时间段')
          return
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs[`replayTimeSliceForm`].handleSearch()
          setTimeout(() => {
            this.$refs['replayTimeSlice'].handleSearch()
          }, 100)
        })
      },
      updateActiveName(newValue) {
        this.activeName = newValue
      },
      reqTableData(picType, resp) {
        if (picType == 'init') { // 日K
          this.chartsDay = resp.data

          // this.chartsDay = [
          //   {
          //     'trade_date': '2015-03-31 00:00:00',
          //     'open_price': 9.15,
          //     'high_price': 9.19,
          //     'low_price': 8.87,
          //     'close_price': 8.89,
          //     'trade_vol': 103.36,
          //     'trade_amt': 929.43,
          //     'buy_ratio': 0.0,
          //     'sell_ratio': 0.0,
          //     'trade_ratio': 0.0,
          //     'warning_value': 0.0,
          //     'ngsp_uid': '2b22f918-c441-41c4-a813-0e1500f797a1',
          //     'ngsp_create_date': '2018-07-09 00:00:00'
          //   },
          //   {
          //     'trade_date': '2015-04-01 00:00:00',
          //     'open_price': 8.92,
          //     'high_price': 8.96,
          //     'low_price': 8.79,
          //     'close_price': 8.9,
          //     'trade_vol': 94.1,
          //     'trade_amt': 834.64,
          //     'buy_ratio': 0.0,
          //     'sell_ratio': 0.0,
          //     'trade_ratio': 0.0,
          //     'warning_value': 0.0,
          //     'ngsp_uid': '2b22f918-c441-41c4-a813-0e1500f797a1',
          //     'ngsp_create_date': '2018-07-09 00:00:00'
          //   },
          //   {
          //     'trade_date': '2015-04-02 00:00:00',
          //     'open_price': 8.9,
          //     'high_price': 9.14,
          //     'low_price': 8.86,
          //     'close_price': 9.01,
          //     'trade_vol': 100.09,
          //     'trade_amt': 899.74,
          //     'buy_ratio': 0.0,
          //     'sell_ratio': 0.0,
          //     'trade_ratio': 0.0,
          //     'warning_value': 0.0,
          //     'ngsp_uid': '2b22f918-c441-41c4-a813-0e1500f797a1',
          //     'ngsp_create_date': '2018-07-09 00:00:00'
          //   },
          //   {
          //     'trade_date': '2015-04-03 00:00:00',
          //     'open_price': 9.01,
          //     'high_price': 9.56,
          //     'low_price': 8.99,
          //     'close_price': 9.44,
          //     'trade_vol': 181.98,
          //     'trade_amt': 1692.09,
          //     'buy_ratio': 0.0,
          //     'sell_ratio': 0.0,
          //     'trade_ratio': 0.0,
          //     'warning_value': 0.0,
          //     'ngsp_uid': '2b22f918-c441-41c4-a813-0e1500f797a1',
          //     'ngsp_create_date': '2018-07-09 00:00:00'
          //   }
          // ]
          this.currentngspUid0 = resp.ngsp_uid
        } else if (picType == 'min') { // 日内每分钟
          this.chartsMin = resp.data

          // this.chartsMin = [
          //   {
          //     'time_seq': 11,
          //     'phase_seq': 13001,
          //     'trade_time': 92500,
          //     'date_time': '2015-03-31 10:01:00',
          //     'pre_close_price': 9.03,
          //     'close_price': 0.0,
          //     'open_price': 4.49,
          //     'avg_price': 4.488,
          //     'high_price': 4.49,
          //     'low_price': 4.48,
          //     'trade_vol': 14300.0,
          //     'order_b_vol': 5000.0,
          //     'order_s_vol': -36400.0,
          //     'ngsp_uid': '2d63f1c7-0cd0-4f90-b48f-c3ee9b54a020',
          //     'ngsp_create_date': '2018-07-09 00:00:00'
          //   },
          //   {
          //     'time_seq': 12,
          //     'phase_seq': 21001,
          //     'trade_time': 93000,
          //     'date_time': '2015-03-31 10:02:00',
          //     'pre_close_price': 9.03,
          //     'close_price': 0.0,
          //     'open_price': 5.37,
          //     'avg_price': 5.356,
          //     'high_price': 5.38,
          //     'low_price': 5.34,
          //     'trade_vol': 1139900.0,
          //     'order_b_vol': 36900.0,
          //     'order_s_vol': -1237900.0,
          //     'ngsp_uid': '2d63f1c7-0cd0-4f90-b48f-c3ee9b54a020',
          //     'ngsp_create_date': '2018-07-09 00:00:00'
          //   },
          //   {
          //     'time_seq': 14,
          //     'phase_seq': 21003,
          //     'trade_time': 93200,
          //     'date_time': '2015-03-31 10:03:00',
          //     'pre_close_price': 9.03,
          //     'close_price': 0.0,
          //     'open_price': 103.17,
          //     'avg_price': 103.17,
          //     'high_price': 103.17,
          //     'low_price': 103.17,
          //     'trade_vol': 0.0,
          //     'order_b_vol': 0.0,
          //     'order_s_vol': 0.0,
          //     'ngsp_uid': '2d63f1c7-0cd0-4f90-b48f-c3ee9b54a020',
          //     'ngsp_create_date': '2018-07-09 00:00:00'
          //   },
          //   {
          //     'time_seq': 15,
          //     'phase_seq': 21004,
          //     'trade_time': 93300,
          //     'date_time': '2015-03-31 10:04:00',
          //     'pre_close_price': 9.03,
          //     'close_price': 0.0,
          //     'open_price': 2.8,
          //     'avg_price': 2.8,
          //     'high_price': 2.8,
          //     'low_price': 2.8,
          //     'trade_vol': 0.0,
          //     'order_b_vol': 0.0,
          //     'order_s_vol': 0.0,
          //     'ngsp_uid': '2d63f1c7-0cd0-4f90-b48f-c3ee9b54a020',
          //     'ngsp_create_date': '2018-07-09 00:00:00'
          //   }
          // ]
          this.currentngspUid1 = resp.ngsp_uid
        } else { // 分钟内每秒
          this.chartsSec = resp.data

          // this.chartsSec = [
          //   {
          //     "trade_date": "2015-03-31 10:01:46",
          //     "sec_code": "600873",
          //     "sec_name": "页",
          //     "time_seq": 133,
          //     "phase_seq": 110133,
          //     "trade_time": 100100,
          //     "date_time": "2015-03-31 10:01:46",
          //     "close_price": 0.0,
          //     "open_price": 3.94,
          //     "avg_price": 3.94,
          //     "high_price": 3.94,
          //     "low_price": 3.94,
          //     "trade_vol": 0.0,
          //     "order_b_vol": 0.0,
          //     "order_s_vol": 0.0,
          //     "ngsp_uid": "11fb7e71-72ed-4b89-8c9d-676d5f7939ce",
          //     "ngsp_create_date": "2018-07-12 00:00:00"
          //   },
          //   {
          //     "trade_date": "2015-03-31 10:01:47",
          //     "sec_code": "600873",
          //     "sec_name": "页",
          //     "time_seq": 215,
          //     "phase_seq": 110215,
          //     "trade_time": 100101,
          //     "date_time": "2015-03-31 10:01:47",
          //     "close_price": 0.0,
          //     "open_price": 99.0,
          //     "avg_price": 99.0,
          //     "high_price": 99.0,
          //     "low_price": 99.0,
          //     "trade_vol": 0.0,
          //     "order_b_vol": 0.0,
          //     "order_s_vol": 0.0,
          //     "ngsp_uid": "11fb7e71-72ed-4b89-8c9d-676d5f7939ce",
          //     "ngsp_create_date": "2018-07-12 00:00:00"
          //   },
          //   {
          //     "trade_date": "2015-03-31 10:01:48",
          //     "sec_code": "600873",
          //     "sec_name": "页",
          //     "time_seq": 228,
          //     "phase_seq": 110228,
          //     "trade_time": 100102,
          //     "date_time": "2015-03-31 10:01:48",
          //     "close_price": 0.0,
          //     "open_price": 9.5,
          //     "avg_price": 9.5,
          //     "high_price": 9.5,
          //     "low_price": 9.5,
          //     "trade_vol": 0.0,
          //     "order_b_vol": 100.0,
          //     "order_s_vol": 0.0,
          //     "ngsp_uid": "11fb7e71-72ed-4b89-8c9d-676d5f7939ce",
          //     "ngsp_create_date": "2018-07-12 00:00:00"
          //   },
          //   {
          //     "trade_date": "2015-03-31 10:01:49",
          //     "sec_code": "600873",
          //     "sec_name": "页",
          //     "time_seq": 443,
          //     "phase_seq": 120143,
          //     "trade_time": 100103,
          //     "date_time": "2015-03-31 10:01:49",
          //     "close_price": 0.0,
          //     "open_price": 7.75,
          //     "avg_price": 7.75,
          //     "high_price": 7.75,
          //     "low_price": 7.75,
          //     "trade_vol": 0.0,
          //     "order_b_vol": 0.0,
          //     "order_s_vol": 0.0,
          //     "ngsp_uid": "11fb7e71-72ed-4b89-8c9d-676d5f7939ce",
          //     "ngsp_create_date": "2018-07-12 00:00:00"
          //   },
          //   {
          //     "trade_date": "2015-03-31 10:01:50",
          //     "sec_code": "600873",
          //     "sec_name": "页",
          //     "time_seq": 562,
          //     "phase_seq": 120262,
          //     "trade_time": 100104,
          //     "date_time": "2015-03-31 10:01:50",
          //     "close_price": 0.0,
          //     "open_price": 120.0,
          //     "avg_price": 120.0,
          //     "high_price": 120.0,
          //     "low_price": 120.0,
          //     "trade_vol": 0.0,
          //     "order_b_vol": 0.0,
          //     "order_s_vol": 0.0,
          //     "ngsp_uid": "11fb7e71-72ed-4b89-8c9d-676d5f7939ce",
          //     "ngsp_create_date": "2018-07-12 00:00:00"
          //   }]
          this.currentngspUid2 = resp.ngsp_uid
        }
      },
      readyRequest(type, picType, activeName, dataList) { // 是否新查询,  图表类型, activeName, 双击获得的数据
        let params = {
          startDate: this.queryData.dateRange[0],
          endDate: this.queryData.dateRange[1],
          secCode: this.queryData.secCode, // 证券代码集合
          ngspUid: '', // 后台上一次返回的ngspUid，如果是isNewQuery，置空
          topN: this.queryData.topN,
          isCalcTopN: this.queryData.isCalcTopN,
          warning: this.queryData.warning,
          isExport: 0, // 1代表导出报表
          exportType: '', // excel,csv
          isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
        }
        this.loading = true
        if (activeName == 1) {
          params.tradeDate = dataList.trade_date.split(' ')[0]
        } else if (activeName == 2) {
          let minRange = dataList.date_time.split(' ')
          params.tradeDate = minRange[0]
          params.startTime = minRange[1].replace(/:/g, '')
          params.endTime = moment(new Date(dataList.date_time).getTime() + 60000).format('YYYY-MM-DD hh:mm:ss').split(' ')[1].replace(/:/g, '')
        } else if (activeName == 3) {
          let minRange = dataList.date_time.split(' ')
          params.tradeDate = minRange[0]
          params.startTime = minRange[1].replace(/:/g, '')
          params.endTime = moment(new Date(dataList.date_time).getTime() + 1000).format('YYYY-MM-DD hh:mm:ss').split(' ')[1].replace(/:/g, '')
          this.storeFormData = params // 保存秒内每笔订单回放数据
        }
        params.tradeDate ? this.storeTradeDate = params.tradeDate : ''

        let mapFun = [transactionReplayDay, transactionReplayMin, transactionReplaySec]
        if (picType != 'order') {
          mapFun[activeName](params).then(resp => {
            this.loading = false
            if (resp) {
              this.reqTableData(picType, resp)
            }
          })
          // this.reqTableData(picType, 'resp')
        } else {
          // 进入档位
          this.$nextTick(() => {
            this.$refs['eachOrderReplayComponent'].handleSearch()
          })
        }
      },
      chartsDayThrowDbl(data) {
        this.activeName = '1'
        this.readyRequest(1, 'min', 1, data.data) // 钻取日内每分钟
      },
      chartsMinThrowDbl(data) {
        this.activeName = '2'
        this.readyRequest(1, 'sec', 2, data.data) // 钻取分钟内每秒
      },
      chartsSecThrowDbl(data) {
        this.activeName = '3'
        this.readyRequest(1, 'order', 3, data.data) // 钻取秒内每笔订单成交回放
      },
      minBrushSelected(data) { // 日内每分钟框选事件
        if (data.batch[0].areas[0]) {
          let num1 = data.batch[0].areas[0].coordRange[0][0],
            num2 = data.batch[0].areas[0].coordRange[0][1],
            startT = this.chartsMin[num1].date_time.split(' '),
            endT = this.chartsMin[num2].date_time.split(' ')
          let params = {
            startDate: startT[0],
            endDate: endT[0],
            startTime: startT[1],
            endTime: endT[1],
            isIncludeStartTime: true,
            isIncludeEndTime: false,
            dateTimeRange: [`${startT[0]} ${startT[1]}`, `${endT[0]} ${endT[1]}`],
            secCode: this.queryData.secCode
          }
          this.timeSliceSearchForm = Object.assign({}, this.timeSliceSearchForm, params)
        }
      },
      handleExportDataMin(type) {
        this.handleDownloadFun(type, this.activeName, this.chartsMin, this.tableColumns[0])
      },
      handleExportDataSec(type) {
        this.handleDownloadFun(type, this.activeName, this.chartsSec, this.tableColumns[1])
      },
      handleDownloadFun(type, activeName, data, column) {
        if (!data.length) {
          this.$message.error('暂无数据')
          return
        }
        let arr = [this.currentngspUid0, this.currentngspUid1, this.currentngspUid2]
        let params = {
          exportType: type,
          isExport: 1,
          isNewQuery: 0,
          tradeDate: this.storeTradeDate,
          ngspUid: arr[activeName],
          tableColumns: column
        }
        if (activeName == 1) {
          exportTransactionReplayMin(params)
        } else if (activeName == 2) {
          exportTransactionReplaySec(params)
        }
      }
    }
  }

</script>
<style lang='less' scoped>
  .transactionReplay {
    width: 100%;
    min-width: 500px;
    .time-slice-analysis-style {
      /deep/ .el-dialog__body {
        padding-top: 0;
      }
    }
    /deep/ .set-width {
      width: 1810px;
    }
  }
</style>
