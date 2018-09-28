<!--成交回放-->
<template>
  <div class="order-replay-table">
    <ul class='clearfix each-order-text'>
      <li>
        <span>证券代码：</span>
        <span class='current-text'>{{formData.secCode}}</span>
      </li>
      <li>
        <span>交易日期：</span>
        <span class='current-text'>{{formData.tradeDate}}</span>
      </li>
      <li>
        <span>开始时间：</span>
        <span class='current-text'>{{formData.startTime && (formData.startTime.slice(0, 2) + ':' + formData.startTime.slice(2, 4) + ':00')}}</span>
      </li>
      <li>
        <span>结束时间：</span>
        <span class='current-text'>{{formData.startTime && (formData.startTime.slice(0, 2) + ':' + formData.startTime.slice(2, 4) + ':59')}}</span>
      </li>
    </ul>
    <el-row>
      <el-col :xl="9" :lg="9" :md="9" :sm="9">
        <el-col :xl="21" :lg="21" :md="21" :sm="21">
          <common-table-pagination-component
            :showHeader="false"
            :loading="gearLoading0"
            :showPagination="false"
            :tableData='abGearData'
            :columns='baColumns'></common-table-pagination-component>
        </el-col>
        <el-col :xl="3" :lg="3" :md="3" :sm="3">
          <ul class="table-tr-btn">
            <li @click="cycleBtn('fast', 'up')">
             <i class="fa fa-backward rotate90" style="margin-top: 25%;"></i>
            </li>
            <li @click="cycleBtn('slow', 'up')">
              <i class="fa fa-caret-up" style="margin-top: 12%; font-size: 25px;"></i>
            </li>
            <li @click="cycleBtn('pause')">
              <i class="fa fa-pause" style="margin-top: 29%;"></i>
            </li>
            <li @click="cycleBtn('slow', 'down')">
              <i class="fa fa-caret-down" style="margin-top: 20%; font-size: 25px;"></i>
            </li>
            <li @click="cycleBtn('fast', 'down')">
              <i class="fa fa-forward rotate90" style="margin-top: 34%;"></i>
            </li>
          </ul>
        </el-col>
      </el-col>
      <el-col :xl="11" :lg="11" :md="11" :sm="11">
        <el-col :xl="10" :lg="10" :md="10" :sm="10">
          <common-table-pagination-component
            :showHeader="false"
            :loading="gearLoading1"
            :showPagination="false"
            :tableData='noABGearData'
            :columns='gearColumn'></common-table-pagination-component>
        </el-col>
        <el-col :xl="14" :lg="14" :md="14" :sm="14">
          <common-echarts-component
            :class="chartsGearData && chartsGearData.length ? '' : 'set-width'"
            domId="trackingReplayGear"
            :defaultOption="chartsOptionGear"
            :propsData="chartsGearData"
            :propsChartHeight="chartsGearData.length ? 442 : 440"></common-echarts-component>
        </el-col>
      </el-col>
      <el-col :xl="4" :lg="4" :md="4" :sm="4">
        <el-form :inline="true">
          <el-form-item>
            <account-code
              :codeType="`account`"
              :uploadParams="{
              parseRule: JSON.stringify({verifies: ['ACCOUNT_CODE']})
              }"
              @getTextareaCodeList="importAcctIds"></account-code>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-for="(item, index) in list" :key="item.name" :xl="12" :lg="12" :md="24" :sm="24"
              style="padding: 0 20px;">
        <el-col>
          <el-col :xl="18" :lg="18" :md="18" :sm="18">
            <h2> {{item.name}} </h2>
          </el-col>
          <el-col :xl="6" :lg="6" :md="6" :sm="6" style="padding-top: 2%">
            <export-btn @handleExportData="handleExportData" :otherParams="{index: index}"></export-btn>
          </el-col>
        </el-col>
        <common-table-pagination-component
          :otherParams="{index: index}"
          :loading='item.loading'
          :tableData='item.tableData'
          :columns='item.column'
          :pagination='item.pagination'
          :totalNum='item.totalNum'
          @handleRowClick='mouseLeft'
          @handlePaginationChange='handlePaginationChange'></common-table-pagination-component>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*
   * 页面共有四个接口
   * 新进入订单簿订单及被撤单订单的列表， 新进入订单簿订单的成交撮合记录，以及表格一、表格二
   * 表格一、表格二，根据"新进入订单簿订单及被撤单订单的列表"中点击的某一条数据发起请求
   * "新进入订单簿订单的成交撮合记录列表"，根据"新进入订单簿订单及被撤单订单的列表"中点击的某一条数据发起请求
   * 进入页面默认展示"新进入订单簿订单及被撤单订单的列表"中第一条数据
   *
   * */
  import moment from 'moment'
  import CommonEchartsComponent from '../../common/CommonEchartsComponent'
  import ExportBtn from '../../common/ExportButtonComponent'
  import { eachOrderColumns } from './tableColumns'
  import {
    orderReplay,
    exportOrderReplay,
    tradeReplay,
    exportTradeReplay,
    orderBookChange,
    orderBook
  } from '@/service/analysisTool/complexQuery/accountBehaviorTracking'
  import { chartsGear } from './chartsList'

  export default {
    components: {
      CommonEchartsComponent,
      ExportBtn,
      AccountCode: () => import('../../common/TextAreaCodesAndUploadComponent'),
      commonTablePaginationComponent: () => import('../../common/commonTablePaginationComponent')
    },
    props: {
      formData: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        gearLoading0: false,
        gearLoading1: false,
        abGearData: [], // 含有前买，前卖数据的表格
        noABGearData: [],
        baColumns: [ // 左上表格一
          {id: 'ba1', minWidth: '100px', class: 'action', label: '前名称', field: 'nameBefore', align: 'left'},
          {id: 'ba2', minWidth: '100px', class: 'action', label: '价格', field: 'price', align: 'right'},
          {id: 'ba3', minWidth: '100px', class: 'action', label: '前数量', field: 'volBefore', align: 'right'},
          {id: 'ba4', minWidth: '100px', class: 'action', label: '差值', field: 'change', align: 'right'},
          {id: 'ba5', minWidth: '100px', class: 'action', label: '后数量', field: 'volAfter', align: 'right'},
          {id: 'ba6', minWidth: '100px', class: 'action', label: '后名称', field: 'nameAfter', align: 'left'}
        ],
        chartsOptionGear: chartsGear, // 档位图配置
        chartsGearData: [], // 档位图数据
        gearColumn: [
          {id: 'gear1', minWidth: '100px', class: 'action', label: '档位', field: 'name', align: 'left'},
          {id: 'gear2', minWidth: '100px', class: 'action', label: '价格', field: 'price', align: 'right'},
          {id: 'gear3', minWidth: '100px', class: 'action', label: '订单剩余未成交数量', field: 'vol', align: 'right'}
        ],
        tabIndex: 0,
        list: [
          { // 未撮合
            name: '新进入订单簿订单及被撤单订单的列表',
            loading: false,
            tableData: [],
            column: eachOrderColumns[0],
            pagination: {
              currentPage: 1,
              pageSizeNumber: 10
            },
            totalNum: 0,
            currentngspUid: ''
          },
          {
            name: '新进入订单簿订单的成交撮合记录',
            loading: false,
            tableData: [],
            column: eachOrderColumns[1],
            pagination: {
              currentPage: 1,
              pageSizeNumber: 10
            },
            totalNum: 0,
            currentngspUid: ''
          }
        ],
        storeImportIds: [], // 存储上传的账户代码，翻页使用
        // storeClickId: '', // 存储点击的账户代码
        clickOrderInfo: {// 存储点击的[新进入订单簿和被撤单订单簿列表]中的价格和订单编号
          no: '',
          price: ''
        },
        timer: '',
        initClick: true
      }
    },
    watch: {},
    methods: {
      handClickStyle (type) {
        if (type) {
          this.list[type].tableData.map((val, i) => {
            this.$set(val, 'clickClass', 'no')
            if (this.clickOrderInfo.no && this.clickOrderInfo.no == val.order_no) {
              this.$set(val, 'clickClass', 'yes')
            }
          })
        } else {
          this.list.map((item, index) => {
            item.tableData.map((val, i) => {
              this.$set(val, 'clickClass', 'no')
              if (this.clickOrderInfo.no && this.clickOrderInfo.no == val.order_no) {
                this.$set(val, 'clickClass', 'yes')
              }
            })
          })
        }
      },
      handImportStyle () {
        this.list.map((item, index) => {
          item.tableData.filter((val, i) => {
            this.$set(val, 'importClass', 'no')
            if (this.storeImportIds.indexOf(val.acct_id) > -1) {
              this.$set(val, 'importClass', 'importIdsMark')
            }
          })
        })
      },
      importAcctIds (data) { // 根据导入的账户ID设置表格的背景颜色
        this.storeImportIds = data.split(',')
        this.handImportStyle()
      },
      handleGearChartsData (row, mark) {
        let dialogData = [], nList = ['order_price', 'order_vol', 'order_vol_1', 'order_vol_2', 'order_vol_chg']
        row.map((val, i) => {
          dialogData.push({
            name: i > 9 ? '买' + (i - 9) : '卖' + (10 - i),
            price: val[nList[0]] ? val[nList[0]] : 0, // 前买/卖价格
            vol: val[nList[1]] ? val[nList[1]] : 0, // 前买/卖数量
            nameBefore: i > 9 ? '前买' + (i - 9) : '前卖' + (10 - i),
            nameAfter: i > 9 ? '后买' + (i - 9) : '后卖' + (10 - i),
            volBefore: val[nList[2]] ? val[nList[2]] : 0, // 后买/卖价格
            volAfter: val[nList[3]] ? val[nList[3]] : 0, // 后买/卖数量
            change: val[nList[4]] ? val[nList[4]] : 0, // 差值
            signVol: i > 9 ? -(val[nList[1]] ? val[nList[1]] : 0) : +(val[nList[1]] ? val[nList[1]] : 0)
          })
        })
        if (!this.initClick) {
          if (mark === 'abGearData') {
            dialogData.map(item => {
              item.clickClass = 'no'
              if (item.price === this.clickOrderInfo.price) item.clickClass = 'yes'
            })
          }
        }
        if (mark !== 'abGearData') this.chartsGearData = JSON.parse(JSON.stringify(dialogData)).reverse()
        return dialogData
      },
      cycleBtn (type, direction) {
        clearInterval(this.timer)
        if (type === 'pause') {
          return
        }
        let recordIdIndex = 0, len = this.list[0].tableData.length
        if (this.clickOrderInfo.no) {
          this.list[0].tableData.map((item, i) => {
            if (this.clickOrderInfo.no == item.order_no) recordIdIndex = i
          })
        }
        this.mouseLeft(this.list[0].tableData[recordIdIndex], null, null, 0)
        let intervals = 12000
        if (type === 'slow') intervals = 19000
        this.timer = setInterval(() => {
          // console.log('测试定时器')
          if (direction === 'up') {
            recordIdIndex--
          } else if (direction === 'down') {
            recordIdIndex++
          }
          if (recordIdIndex < 0) {
            clearInterval(this.timer)
          } else if (recordIdIndex >= len - 1) {
            clearInterval(this.timer)
          }
          this.mouseLeft(this.list[0].tableData[recordIdIndex], null, null, {index: 0})
        }, intervals)
      },
      mouseLeft (row, event, column, option) {
        event && clearInterval(this.timer)
        if (this.clickOrderInfo.no != row.order_no && option.index == 0) {
          this.initClick = false
          this.reqTableCharts(0)
          this.reqTableCharts(1)
        }
        if (row) {
          this.clickOrderInfo.no = row.order_no
          this.clickOrderInfo.price = row.order_price
        }
        this.handClickStyle() // 设置点击【新进入和撤单、成交量撮合】表格时的背景颜色
        this.handImportStyle()
      },
      setRequestParams () {
        return {
          startDate: this.formData.startDate,
          endDate: this.formData.endDate,
          tradeDate: this.formData.tradeDate,
          secCode: this.formData.secCode, // 证券代码集合
          topN: this.formData.topN,
          isCalcTopN: this.formData.isCalcTopN,
          warning: this.formData.warning,
          startTime: this.formData.startTime,
          endTime: this.formData.endTime,
          // startTime: '093000',
          // endTime: '153000',
          isExport: 0, // 1代表导出报表
          exportType: '' // excel,csv
        }
      },
      reqTableCharts (index) { // 根据订单编号请求上面2个表格和图表数据
        let mapFun = [orderBookChange, orderBook]
        let params = this.setRequestParams()
        params.orderNo = this.clickOrderInfo.no
        params.ngspUid = ''
        params.isNewQuery = 1
        params.priceCnt = '10'
        if (index == 0) {
          this.gearLoading0 = true
        } else {
          this.gearLoading1 = true
        }
        mapFun[index](params).then(resp => {
          if (index == 0) {
            this.gearLoading0 = false
          } else {
            this.gearLoading1 = false
          }
          let tableB = [], tableS = []
          resp.data.map((item, i) => {
            item.trade_dir == 'B' ? tableB.push(item) : tableS.push(item)
          })
          let data = tableS.reverse().concat(tableB)
          if (index == 0) {
            // 请求表格一 abGearData  this.abGearData
            this.abGearData = this.handleGearChartsData(data, 'abGearData')
          } else {
            // 请求表格二 noABGearData this.noABGearData
            this.noABGearData = this.handleGearChartsData(data)
          }
        })
      },
      reqTableData (type, index, mark) { // 请求【新进入和撤单、成交量撮合】表格数据
        let params = this.setRequestParams()
        type ? params.ngspUid = '' : params.ngspUid = this.list[index].currentngspUid
        params.pageIndex = this.list[index].pagination.currentPage
        params.pageRows = this.list[index].pagination.pageSizeNumber
        params.isNewQuery = type
        this.list[index].loading = true
        let mapFun = [orderReplay, tradeReplay]
        mapFun[index](params).then(resp => {
          this.list[index].loading = false
          if (resp) {
            this.list[index].currentngspUid = resp.ngsp_uid
            this.list[index].tableData = resp.data
            this.list[index].totalNum = Number(resp.totalRowCount)

            if (index == 0) {
              // 初始化订单编号
              this.clickOrderInfo.no = this.list[0].tableData[0].order_no
              // this.clickOrderInfo.no = '910003002608499'
              this.clickOrderInfo.price = this.list[0].tableData[0].order_price
            }
            if (mark === 'init') {
              this.reqTableCharts(0)
              this.reqTableCharts(1)
            }
            if (mark != 'init' && mark != 'together') {
              this.initClick = false
              this.handImportStyle()
              index == 1 && this.handClickStyle(1) // 设置点击【新进入和撤单、成交量撮合】表格时的背景颜色
            }
          } else {
            this.list[index].currentngspUid = ''
            this.list[index].tableData = []
          }
        })
      },
      handlePaginationChange (pagination, option) {
        this.tabIndex = option.index
        this.list[option.index].pagination = pagination
        this.reqTableData(0, option.index)
      },
      handleSearch () {
        this.reqTableData(1, 0, 'init') // 新进入订单簿订单及被撤单订单的列表 请求
        this.reqTableData(1, 1, 'together') // 新进入订单簿订单的成交撮合记录 请求
        this.list[0].pagination.currentPage = 1
        this.list[1].pagination.currentPage = 1
      },
      handleExportData (type, op) {
        let params = {
          exportType: type,
          isExport: 1,
          isNewQuery: 0,
          topN: this.formData.topN ? this.formData.topN : 0,
          isCalcTopN: this.formData.isCalcTopN.toString(),
          warning: this.formData.warning ? this.formData.warning : 0,
          startTime: this.formData.startTime,
          endTime: this.formData.endTime,
          // startTime: '093000',
          // endTime: '153000',
          ngspUid: this.list[op.index].currentngspUid,
          tableColumns: this.list[op.index].column
        }
        op.index == 0 ? exportOrderReplay(params) : exportTradeReplay(params)
      }
    }
  }

</script>
<style lang='less' scoped>
  .order-replay-table {
    .each-order-text {
      text-align: center;
      li {
        display: inline-block;
        width: 155px;
      }
    }
    .table-tr-btn {
      text-align: center;
      padding: 85% 25%;
      li {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: #87b9d6;
        margin: 10px 0;
        display: inline-block;
        color: white;
        i {
          font-size: 16px;
        }
        .rotate90 {
          transform: rotate(90deg);
        }
      }
    }
    /deep/ .el-table {
      /deep/ .el-table__body-wrapper {
        /deep/ tr {
          &:hover {
            background-color: transparent;
          }
        }
        /deep/ .importIdsMark {
          background-color: #a5f0c4;
        }
        /deep/ .yes { // 点击时的样式，必须写在导入样式的后面
          background-color: #ffe1bf;
        }
      }
    }
    /deep/ .set-width {
      width: 510px;
    }
    .order-replay-triangle {
      width: 0;
      height: 0;
      display:inline-block;
      border-width: 0 10px 10px;
      border-style: solid;
      border-color: transparent transparent #333;
    }
  }
</style>
