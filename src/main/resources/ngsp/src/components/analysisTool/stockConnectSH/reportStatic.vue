<template>
  <div class="stock-connect-report-static">
    <el-card>
      <div slot="header">
        查询条件
        <el-button type="primary" size="small" @click="getQueryRes">查询</el-button>
      </div>
      <el-form :inline="true" label-width="100px" style="margin-top: 20px;">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="证券代码：">
            <common-stock-code @getSelectRes="getSelectRes" style="width: 100%;"></common-stock-code>
          </el-form-item>
        </el-col>
        <el-col :xl="10" :lg="10" :md="12" :sm="24">
          <el-form-item label="时间：" :required="true">
            <el-date-picker v-model="commonDatePickerVal"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['09:00:00','17:00:00']"
                            unlink-panels
                            align="right"
                            size="small"
                            @change="changeQueryCondition">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card class="el-card-table" v-if="showMainTable">
      <div slot="header">
        沪股通申报统计母表：
        <el-button size="small" type="info" @click="saveMainLocation" v-if="mainTableData.length!==0">导出</el-button>
      </div>
      <el-table
          :data="mainTableData"
          border
          style="margin-bottom: 15px;"
          v-loading="queryResLoadMain"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="scope.row.brnid" v-if="scope.row.brnid!=='合计'"
                      @change="getRadio(scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
            show-overflow-tooltip
            v-for="column in mainTableOptions"
            :key=column.field
            :align=column.align
            :prop=column.field
            :label=column.label
            :min-width=column.minWidth
            :formatter="column.formatter"
            :sortable="column.sortable == null ? false : column.sortable"
            :sort-method="column.sortMethod">
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-right: 40px;margin-bottom: 15px;">共 {{mainTotal}} 条</div>
    </el-card>
    <el-card class="el-card-table" v-if="showSubTable">
      <div slot="header">
        沪股通申报统计子表：
        <el-button size="small" type="info" @click="saveSubLocation" v-if="subTableData.length!==0">导出</el-button>
      </div>
      <el-table
          :data="subTableData"
          border
          style="margin-bottom: 20px;"
          v-loading="queryResLoadSub"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
            show-overflow-tooltip
            v-for="column in subTableOptions"
            :key=column.field
            :align=column.align
            :prop=column.field
            :label=column.label
            :min-width=column.minWidth
            :formatter="column.formatter"
            :sortable="column.sortable == null ? false : column.sortable"
            :sort-method="column.sortMethod">
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-right: 40px;margin-bottom: 15px;">共 {{subTotal}} 条</div>
    </el-card>
  </div>
</template>

<script>
  import {
    getReportStaticData,
    getReportStaticDetailData
  } from '../../../service/analysisTool/stockConnectSH'
  import CommonStockCode from './commonStockCode'
  import { getCurTradeDate } from '../../../service/common/commonFunc'
  import moment from 'moment'

  export default {
    name: 'report-static',
    components: {CommonStockCode},
    data () {
      return {
        stockCode: '',
        commonDatePickerVal: [],
        mainTableData: [],
        subTableData: [],
        mainTableOptions: [
          {
            field: 'brnid',
            label: '参与者代码',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'brnid')
          },
          {
            field: 'branch_name',
            label: '参与者名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')
          },
          {
            field: 'b_ord_mkt',
            label: '申买金额（万元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_ord_mkt'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 's_ord_mkt',
            label: '申卖金额（万元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_ord_mkt'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 'b_mktval',
            label: '买成交金额（万元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 's_mktval',
            label: '卖成交金额（万元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 'b_cancel_qty',
            label: '申买撤单金额（万元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_qty'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 's_cancel_qty',
            label: '申卖撤单金额（万元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_qty'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        subTableOptions: [
          {
            field: 'instrument_id',
            label: '证券代码',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            field: 'instrument_chn_short_name',
            label: '证券简称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_chn_short_name')
          },
          {
            field: 'b_order_qty',
            label: '申报买入数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_qty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'b_trdqty',
            label: '买入成交量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'b_no_trade_qty',
            label: '买入未成交量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_no_trade_qty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'b_cancel_qty',
            label: '买入撤单量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_qty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 's_order_qty',
            label: '申报卖出数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_order_qty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 's_trdqty',
            label: '卖出成交量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 's_no_trade_qty',
            label: '卖出未成交量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_no_trade_qty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 's_cancel_qty',
            label: '卖出撤单量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_qty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'b_order_num',
            label: '申报买入次数',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_num'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'b_cancel_num',
            label: '买入撤单次数',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_num'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 's_order_num',
            label: '申报卖出次数',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_order_num'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 's_cancel_num',
            label: '卖出撤单次数',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_num'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'b_ord_avg',
            label: '买方申报均价',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_ord_avg'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 's_ord_avg',
            label: '卖方申报均价',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_ord_avg'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        queryResLoadMain: false,
        queryResLoadSub: false,
        showMainTable: false,
        showSubTable: false,
        mainTotal: 0,
        subTotal: 0,
        radio: '',
        requestMainParams: {},
        requestSubParams: {},
        startTime: '',
        endTime: ''
      }
    },
    mounted () {
      getCurTradeDate().then(resp => {
        this.startTime = moment(resp + ' 090000', 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment(resp + ' 170000', 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm:ss')
        this.commonDatePickerVal = [this.startTime, this.endTime]
      })
    },
    methods: {
      getSelectRes (selectStockCodeVal) {
        let arr = []
        selectStockCodeVal.forEach(function (item) {
          if (item !== 'ALL') {
            arr.push(item)
          }
        })
        this.stockCode = arr.join(',')
      },
      /* eslint-disable */
      getQueryRes () {
        if ($.isEmptyObject(this.commonDatePickerVal)) {
          this.$message.error('时间不能为空')
          return false
        } else {
          this.showMainTable = true
          this.queryResLoadMain = true
          this.showSubTable = false
          this.radio = ''
          this.requestMainParams = {
            stockCode: this.stockCode,
            dateTimeStart: this.commonDatePickerVal[0],
            dateTimeEnd: this.commonDatePickerVal[1]
          }
          getReportStaticData(this.requestMainParams).then(resp => {
            this.mainTableData = resp.bizData.metaData
            this.mainTotal = this.mainTableData.length - 1
            this.queryResLoadMain = false
          })
        }
      },
      changeQueryCondition (val) {
        let [dateStart, timeStart] = val[0].split(' '),
        [dateEnd, timeEnd] = val[1].split(' ')
        if (timeStart === '00:00:00') {
          this.commonDatePickerVal[0] = dateStart + ' 09:00:00'
        }
        if (timeEnd === '00:00:00') {
          let nowDate = moment(new Date()).format('YYYY-MM-DD')
          if (nowDate === dateEnd) {
            this.commonDatePickerVal[1] = dateEnd + ' ' + moment(new Date()).format('HH:mm:ss')
          } else {
            this.commonDatePickerVal[1] = dateEnd + ' 17:00:00'
          }
        }

      },
      getRadio (row) {
        if (row.brnid === '合计') {
          return false
        } else {
          this.showSubTable = true
          this.queryResLoadSub = true
          this.requestSubParams = {...this.requestMainParams, ...{id: row.brnid}}
          getReportStaticDetailData(this.requestSubParams).then(resp => {
            this.subTableData = resp.bizData.metaData
            this.subTotal = this.subTableData.length
            this.queryResLoadSub = false
          })
        }
      },

      /* eslint-disable */
      saveMainLocation () {
        let params = this.requestMainParams
        params['type'] = 'hgtDeclare'
        params['isDetail'] = false
        params['fileType'] = 'excel'
        params['tableColumns'] = [{
          'sheetName': '沪港通申报统计查询母表',
          'fileColumns': this.mainTableOptions
        }]
        this.gfnExportFileWithForm('/regularqry/hgtquery/v1/hgt/export', params)
      },
      saveSubLocation () {
        let params = this.requestSubParams
        params['type'] = 'hgtDeclare'
        params['isDetail'] = true
        params['fileType'] = 'excel'
        params['tableColumns'] = [{
          'sheetName': '沪港通申报统计查询子表',
          'fileColumns': this.subTableOptions
        }]
        this.gfnExportFileWithForm('/regularqry/hgtquery/v1/hgt/export', params)
      },
    },

  }
</script>

<style lang="less">
  .stock-connect-report-static {
    .el-radio__label {
      display: none;
    }
  }

</style>
