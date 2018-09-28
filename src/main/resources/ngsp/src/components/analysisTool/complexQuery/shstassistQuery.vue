<template>
  <div class='HGT-stocks-assist-query'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size='small' type='info'  @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-row>
        <el-form :inline='true' ref='HGTStocksAssistQuery' :model='formData' :rules='rules' label-width='110px' class='demo-form-inline HGT-stocks-assist-query-form'>
          <el-form-item label='开始日期：' prop='startDate'>
            <el-date-picker
              v-model='formData.startDate'
              type='date'
              placeholder='请选择开始日期'
              size='small'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label='结束日期：' prop='endDate'>
            <el-date-picker
              v-model='formData.endDate'
              type='date'
              placeholder='请选择结束日期'
              size='small'>
            </el-date-picker>
          </el-form-item>
          <el-form-item label='证券代码：' prop='secCodes'>
            <stock-code-query-and-upload-component
              :ref="`validateshsAccount`"
              :codeType="`stock`"
              :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['STOCK_CODE_SH']}
              )
            }"
              @getStockCode="getStockCode"></stock-code-query-and-upload-component>
          </el-form-item>
          <el-form-item label='逐日计算：' prop='isDayCalc'>
            <el-radio-group v-model='formData.isDayCalc'>
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-row>

    </el-card>
    <el-card>
      <el-row>
        <export-btn @handleExportData="handleExportData"></export-btn>
        <el-col :span='24'>
          <common-table-pagination-component
            :loading='loading'
            :tableData='tableData'
            :columns='tableColumns'
            :pagination='pagination'
            :totalNum='totalNum'
            @handlePaginationChange='handlePaginationChange'
          ></common-table-pagination-component>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
import { getShstassistQuery } from '../../../service/analysisTool/complexQuery/index'
import {selfValidateMethod} from './componentsTool/common/validate'
// 获取交易日偏移
import {getRelativeTradeDate} from '../../../service/common/commonFunc'
import {complexQueryDec0, complexQueryDec2} from './componentsTool/common/sortMethods'

export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    TextUpload: () => import('../../common/textUpload'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    StockCodeQueryAndUploadComponent: () => import('./componentsTool/common/StockCodeQueryAndUploadComponent'),
    commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
  },
  data() {
    return {
      statisticCaliber: [
        {
          title: '沪股通数据协查',
          content: [
            `1.	经纪商名称1：统计期末港交所经纪商数据信息中经纪商中文名称（目前上游提供的测试数据中经纪商中文名称为繁体 ）`,
            `2.	经纪商名称2：统计期末港交所经纪商数据信息中经纪商英文名称`,
            `3.	成交买入数量：每日订单日志中取沪股通专用账户（D890825260）的申报记录（申报方向为买，并且‘Branch_ID（营业部代码）’与港交所经纪商数据信息中‘经纪商ID’相同），按Branch_ID（营业部代码）汇总统计这些订单在每日成交日志中的这期间的成交数量`,
            `4.	成交买入金额：每日订单日志中取沪股通专用账户（D890825260）的申报记录（申报方向为买，并且‘Branch_ID（营业部代码）’与港交所经纪商数据信息中‘经纪商ID’相同），按Branch_ID（营业部代码）汇总统计这些订单在每日成交日志中的这期间的成交金额`,
            `5.	成交买入数量占比：该经纪商在这期间买入数量汇总/沪股通专用账户（D890825260）期间在沪市全市场的总体买入数量`,
            `6.	成交买入金额占比：该经纪商在这期间买入金额汇总/沪股通专用账户（D890825260）期间在沪市全市场的总体买入金额`,
            `7.	成交卖出数量：每日订单日志中取沪股通专用账户（D890825260）的申报记录（申报方向为卖，并且‘Branch_ID（营业部代码）’与港交所经纪商数据信息中‘经纪商ID’相同），按Branch_ID（营业部代码）汇总统计这些订单在每日成交日志中的这期间的成交数量`,
            `8.	成交卖出金额：每日订单日志中取沪股通专用账户（D890825260）的申报记录（申报方向为卖，并且‘Branch_ID（营业部代码）’与港交所经纪商数据信息中‘经纪商ID’相同），按Branch_ID（营业部代码）汇总统计这些订单在每日成交日志中的这期间的成交金额`,
            `9.	成交卖出数量占比：该经纪商在这期间卖出数量汇总/沪股通专用账户（D890825260）期间在沪市全市场的总体卖出数量`,
            `10.	成交卖出金额占比：该经纪商在这期间卖出金额汇总/沪股通专用账户（D890825260）期间在沪市全市场的总体卖出金额`,
            `11.	净买入数量：期间买入数量-期间卖出数量`,
            `12.	净买入金额：期间买入金额-期间卖出金额`,
            `13.	委托买入数量：每日订单日志中取沪股通专用账户（D890825260）的申报记录（申报方向为买，并且‘Branch_ID（营业部代码）’与港交所经纪商数据信息中‘经纪商ID’相同），按Branch_ID（营业部代码）汇总统计这些订单在每日订单日志中的这期间的申报数量`,
            `14.	委托买入金额：每日订单日志中取沪股通专用账户（D890825260）的申报记录（申报方向为买，并且‘Branch_ID（营业部代码）’与港交所经纪商数据信息中‘经纪商ID’相同），按Branch_ID（营业部代码）汇总统计这些订单在每日订单日志中的这期间的申报金额`,
            `15.	委托买入数量占比：该经纪商在这期间委托买入数量汇总/沪股通专用账户（D890825260）期间在沪市全市场的总体委托买入数量`,
            `16.	委托买入金额占比：该经纪商在这期间委托买入金额汇总/沪股通专用账户（D890825260）期间在沪市全市场的总体委托买入金额`,
            `17.	委托卖出数量：每日订单日志中取沪股通专用账户（D890825260）的申报记录（申报方向为卖，并且‘Branch_ID（营业部代码）’与港交所经纪商数据信息中‘经纪商ID’相同），按Branch_ID（营业部代码）汇总统计这些订单在每日订单日志中的这期间的申报数量`,
            `18.	委托卖出金额：每日订单日志中取沪股通专用账户（D890825260）的申报记录（申报方向为卖，并且‘Branch_ID（营业部代码）’与港交所经纪商数据信息中‘经纪商ID’相同），按Branch_ID（营业部代码）汇总统计这些订单在每日订单日志中的这期间的申报金额`,
            `19.	委托卖出数量占比：该经纪商在这期间委托卖出数量汇总/沪股通专用账户（D890825260）期间在沪市全市场的总体委托卖出数量`,
            `20.	委托卖出金额占比：该经纪商在这期间委托卖出金额汇总/沪股通专用账户（D890825260）期间在沪市全市场的总体委托卖出金额`,
            `注：以下算法描述是对按期间汇总的描述，按日统计的算法与按期间汇总算法相同，不过按日统计是汇总经纪商从开始日期到结束日期每日的数据。`
          ]
        }
      ],
      tableData: [],
      tableColumns: [],
      columnsList: {
        0: [ // 按区间统计
          {
            id: 31,
            label: '经纪商名称1',
            minWidth: '90px',
            field: 'broker_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'broker_name')
          },
          {
            id: 32,
            label: '经纪商名称2',
            minWidth: '90px',
            field: 'broker_name_e',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'broker_name_e')
          },
          {
            id: 33,
            label: '成交买入数量',
            minWidth: '90px',
            field: 'sum_trade_buy_vol',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_trade_buy_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 34,
            label: '成交买入金额',
            minWidth: '90px',
            field: 'sum_trade_buy_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_trade_buy_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 35,
            label: '成交买入数量占比(%)',
            minWidth: '90px',
            field: 'sum_trade_buy_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_trade_buy_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 36,
            label: '成交买入金额占比(%)',
            minWidth: '90px',
            field: 'sum_trade_buy_amt_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_trade_buy_amt_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 37,
            label: '成交卖出数量',
            minWidth: '90px',
            field: 'sum_trade_sell_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_trade_sell_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 38,
            label: '成交卖出金额',
            minWidth: '90px',
            field: 'sum_trade_sell_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_trade_sell_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 39,
            label: '成交卖出数量占比(%)',
            minWidth: '90px',
            field: 'sum_trade_sell_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_trade_sell_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 130,
            label: '成交卖出金额占比(%)',
            minWidth: '90px',
            field: 'sum_trade_sell_amt_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_trade_sell_amt_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 131,
            label: '净买入数量',
            minWidth: '90px',
            field: 'sum_net_buy_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_net_buy_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 132,
            label: '净买入金额',
            minWidth: '90px',
            field: 'sum_net_buy_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_net_buy_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 133,
            label: '委托买入数量',
            minWidth: '90px',
            field: 'sum_order_buy_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_order_buy_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 134,
            label: '委托买入金额',
            minWidth: '90px',
            field: 'sum_order_buy_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_order_buy_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 135,
            label: '委托买入数量占比(%)',
            minWidth: '90px',
            field: 'sum_order_buy_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_order_buy_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 136,
            label: '委托买入金额占比(%)',
            minWidth: '90px',
            field: 'sum_order_buy_amt_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_order_buy_amt_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 137,
            label: '委托卖出数量',
            minWidth: '90px',
            field: 'sum_order_sell_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_order_sell_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 138,
            label: '委托卖出金额',
            minWidth: '90px',
            field: 'sum_order_sell_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_order_sell_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 139,
            label: '委托卖出数量占比(%)',
            minWidth: '90px',
            field: 'sum_order_sell_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_order_sell_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 1310,
            label: '委托卖出金额占比(%)',
            minWidth: '90px',
            field: 'sum_order_sell_amt_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sum_order_sell_amt_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          }
        ],
        1: [ // 选择逐日统计
          {
            id: 30,
            label: '交易日期',
            minWidth: '90px',
            field: 'trade_date',
            align: 'left',
            sortable: true
          },
          {
            id: 1,
            label: '经纪商名称1',
            minWidth: '98px',
            field: 'broker_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'broker_name')
          },
          {
            id: 2,
            label: '经纪商名称2',
            minWidth: '98px',
            field: 'broker_name_e',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'broker_name_e')
          },
          {
            id: 3,
            label: '成交买入数量',
            minWidth: '98px',
            field: 'trade_buy_vol',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_buy_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 4,
            label: '成交买入金额',
            minWidth: '98px',
            field: 'trade_buy_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_buy_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 5,
            label: '成交买入数量占比(%)',
            minWidth: '98px',
            field: 'trade_buy_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_buy_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 6,
            label: '成交买入金额占比(%)',
            minWidth: '98px',
            field: 'trade_buy_amt_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_buy_amt_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 7,
            label: '成交卖出数量',
            minWidth: '98px',
            field: 'trade_sell_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_sell_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 8,
            label: '成交卖出金额',
            minWidth: '98px',
            field: 'trade_sell_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_sell_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 9,
            label: '成交卖出数量占比(%)',
            minWidth: '98px',
            field: 'trade_sell_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_sell_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 10,
            label: '成交卖出金额占比(%)',
            minWidth: '98px',
            field: 'trade_sell_amt_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_sell_amt_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 11,
            label: '净买入数量',
            minWidth: '98px',
            field: 'net_buy_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'net_buy_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 12,
            label: '净买入金额',
            minWidth: '98px',
            field: 'net_buy_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'net_buy_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 13,
            label: '委托买入数量',
            minWidth: '98px',
            field: 'order_buy_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_buy_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 14,
            label: '委托买入金额',
            minWidth: '98px',
            field: 'order_buy_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_buy_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 15,
            label: '委托买入数量占比(%)',
            minWidth: '98px',
            field: 'order_buy_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_buy_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 16,
            label: '委托买入金额占比(%)',
            minWidth: '98px',
            field: 'order_buy_amt_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_buy_amt_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 17,
            label: '委托卖出数量',
            minWidth: '98px',
            field: 'order_sell_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_sell_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            id: 18,
            label: '委托卖出金额',
            minWidth: '98px',
            field: 'order_sell_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_sell_amt'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 19,
            label: '委托卖出数量占比(%)',
            minWidth: '98px',
            field: 'order_sell_vol_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_sell_vol_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          },
          {
            id: 20,
            label: '委托卖出金额占比(%)',
            minWidth: '98px',
            field: 'order_sell_amt_ratio',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_sell_amt_ratio'),
            formatter: complexQueryDec2,
            format: '#,##0.00'
          }
        ]
      },
      loading: false,
      totalNum: 0,
      pagination: {
        currentPage: 1,
        pageSizeNumber: 10
      },
      queryData: { }, // 接口查询参数,保存上次查询参数
      formData: {
        startDate: '',
        endDate: '',
        secCodes: '',
        isDayCalc: '' // 是否逐日计算
      },
      initData: {
        start: '',
        end: ''
      },
      rules: {
        startDate: [{required: true, message: '请选择日期'}],
        endDate: [{required: true, message: '请选择日期'}],
        isDayCalc: [
          {required: true, message: '请选择', trigger: 'change'}
        ]
      },
      breadcrumbItems: [
        {
          router: '/analysisTool',
          label: '分析工具'
        }, {
          router: '/complexQuery',
          label: '综合查询'
        }, {
          router: '/shstassistQuery',
          label: '沪股通数据协查'
        }],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    getStockCode(data) {
      this.formData.secCodes = data
    },
    clearForm() {
      this.$refs[`validateshsAccount`].clearStockCodes()
      this.$refs['HGTStocksAssistQuery'].resetFields()
      this.formData.secCodes = ''
      this.formData.startDate = this.initData.start
      this.formData.endDate = this.initData.end
    },
    reqTableData(type) {
      let params = {
        startDate: type ? this.formData.startDate : this.queryData.startDate,
        endDate: type ? this.formData.endDate : this.queryData.endDate,
        isDayCalc: type ? this.formData.isDayCalc : this.queryData.isDayCalc,
        secCodes: type ? this.formData.secCodes : this.queryData.secCodes,
        ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
        pageIndex: this.pagination.currentPage,
        pageRows: this.pagination.pageSizeNumber,
        isExport: 0, // 1代表导出报表
        exportType: '', // excel,csv
        isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
      }
      params.startDate = moment(params.startDate).format('YYYY-MM-DD')
      params.endDate = moment(params.endDate).format('YYYY-MM-DD')
      this.loading = true
      getShstassistQuery(params).then((resp) => {
        this.loading = false
        if (resp) {
          if (this.formData.isDayCalc == 1) {
            this.tableColumns = this.columnsList[1]
          } else {
            this.tableColumns = this.columnsList[0]
          }
          resp.data.length > 0 ?  this.currentngspUid = resp.ngsp_uid : this.currentngspUid = ''
          this.tableData = resp.data
          this.totalNum = Number(resp.totalRowCount)
        } else {
          this.currentngspUid = ''
          this.tableData = []
        }
      })
    },
    handleSearch() {
      let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
      let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
      if (sDate > eDate + 60 * 60 * 1000) {
        this.$message.error('开始日期不得大于结束日期')
        return
      }
      this.$refs['HGTStocksAssistQuery'].validate((valid) => {
        if (valid) {
          if (this.formData.secCodes) {
            if (!selfValidateMethod({stocks: this.formData.secCodes})) { /* 批量校验证券代码格式 */
              return
            }
          } else {
            this.formData.secCodes = 'ALL'
          }
          this.queryData = JSON.parse(JSON.stringify(this.formData))
          this.pagination.currentPage = 1
          this.reqTableData(1)
        }
      })
    },
    handlePaginationChange(pagination) {
      this.pagination = pagination
      this.reqTableData(0)
    },
    handleExportData(type) { // 下载
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let params = {
        isDayCalc: this.queryData.isDayCalc,
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: this.tableColumns
      }
      this.gfnExportFileWithForm('/complexqry/shstassistquery/v1/shstassistquery/export', params)
    }
  },
  mounted() {
    this.tableColumns = this.columnsList[0]
    // 清空日期为初始日期
    getRelativeTradeDate(-1).then(resp => {
      this.initData.start = this.formData.startDate = moment(resp).format('YYYY-MM-DD')
      this.initData.end = this.formData.endDate = moment(resp).format('YYYY-MM-DD')
    })
  }
}
</script>

<style lang='less'>
  .HGT-stocks-assist-query {
  }
</style>
