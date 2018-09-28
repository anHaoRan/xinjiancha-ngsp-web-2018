<!-- 营业部交易前N名 -->
<template>
  <div class='branch-trade-topn'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size='small' type='info'  @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-row>
        <el-form :inline='true' ref='branchTradeTopNQuery' :model='formData' :rules='rules' label-width='110px' class='demo-form-inline branch-trade-topn-form'>
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
              ref="branchCodesListRef"
              :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['STOCK_CODE_A']}
              )
              }"
              @getStockCode="getStockCode"></stock-code-query-and-upload-component>
          </el-form-item>
          <el-form-item label='前N名：' prop='topN'>
            <el-input size='small' placeholder='请输入整数' v-model='formData.topN'></el-input>
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
            :columns='columns'
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
import { getBranchTradeTopN } from '../../../service/analysisTool/complexQuery/index'
// 获取交易日偏移
import {getRelativeTradeDate} from '../../../service/common/commonFunc'
import {selfValidateMethod} from './componentsTool/common/validate'
import {complexQueryDec0, complexQueryDec2, complexQueryDec3} from './componentsTool/common/sortMethods'

export default {
  components: {
    SDatePicker: () => import('@/components/base/SDatePicker'),
    Breadcrumb: () => import('../../common/Breadcrumb'),
    TextUpload: () => import('../../common/textUpload'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    StockCodeQueryAndUploadComponent: () => import('./componentsTool/common/StockCodeQueryAndUploadComponent'),
    commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
  },
  data() {
    var checkN = (rule, value, callback) => {
      let patt = /^[0-9]*$/g
      if (!patt.test(value)) {
        return callback(new Error('请输入整数'))
      }
      return callback()
    }
    return {
      statisticCaliber: [
        {
          title: '营业部交易前N名',
          content: [
            `1.	排名：若按用户输入的日期区间内该证券的“买入数量”（或“卖出数量”）合计值从大到小排名，且其对应的“买入数量”（或“卖出数量”）须大于0，则展示用户输入的前N名。计算“买入数量”（或“卖出数量”）不考虑除权等情况。`,
            `2.	只计算沪市A股，统计时含大宗交易。`,
            `3.	对于同一只股票，相同的买入排名营业部和卖出排名营业部展示在同一行中。`,
            `4.	均价=金额/数量`,
            `5.	如果对于同一只股票，在用户输入的日期区间内有两个或多个营业部的“买入数量”（或“卖出数量”）合计值相同，则按其16位营业部编码从小到大排名。`,
            `6.	结果列表中的“买入（或卖出）营业部名称”字段由“会员名称”和“营业部名称”拼接而成，如：“中国国际金融有限公司北京建国门外大街证券营业部”。`,
            `7.	在统计时，“买入（或卖出）营业部名称”字段的值基于成交明细数据中的Stat_Seat_Code来确定。如果某一个股东账户在同一交易日内的成交明细数据中出现了不同的Stat_Seat_Code（这种情况比较少见，但存在），那么以该股东账户当天第一笔交易类申报记录对应的Stat_Seat_Code来作为其当天所有交易的Stat_Seat_Code。即对某一个股东账户而言，在同一交易日内所有交易数据的“买入（或卖出）营业部名称”都相同。`,
            `8.	Stat_Seat_Code（统计席位代码/统计PBU代码）是数据仓库为了更准确、更方便地识别某条申报/成交记录来自于哪个营业部而设计的一个代码。其算法是根据该条申报/成交记录中券商填报的Branch_ID（2010-01-22以后）/内部订单编号的前两位（2010-01-21以前）对应的营业部，判断其是否属于这个券商。若是，则按其填报的营业部统计。若否，则按其下单的席位/PBU对应的主营业部统计。`,
            `9.	根据“Stat_Seat_Code”获取得到的会员营业部信息包含基金及非会员（基金、非会员都不还原为出租PBU的会员）。这与市场监察部当前使用的“席位与会员营业部对应关系数据”的口径一致。`,
            `10. 证券简称，取日期区间内该证券代码的最新简称。 `
          ]
        }
      ],
      commonData: { // 证券代码
        disabled: false,
        placeholder: '请输入A股证券代码',
        secSubTypecode: 'ASH',
        stockCode: '',
        list: [] // 存储上传证券代码
      },
      tableData: [],
      columns: [
        {
          id: 1,
          label: '证券代码',
          field: 'sec_code',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'sec_code')
        },
        {
          id: 2,
          label: '证券简称',
          field: 'sec_name',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_name')
        },
        {
          id: 3,
          label: '排名',
          field: 'rank_no',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'rank_no')
        },
        {
          id: 4,
          label: '买入营业部名称',
          field: 'b_mem_branch_name',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'b_mem_branch_name')
        },
        {
          id: 5,
          label: '买入均价',
          field: 'buy_price',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'buy_price'),
          formatter: complexQueryDec3,
          format: '#,##0.000'
        },
        {
          id: 6,
          label: '买入数量',
          field: 'buy_vol',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'buy_vol'),
          formatter: complexQueryDec0,
          format: '#,##0'
        },
        {
          id: 7,
          label: '买入金额',
          field: 'buy_amt',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'buy_amt'),
          formatter: complexQueryDec2,
          format: '#,##0.00'
        },
        {
          id: 8,
          label: '卖出营业部名称',
          field: 's_mem_branch_name',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 's_mem_branch_name')
        },
        {
          id: 9,
          label: '卖出均价',
          field: 'sell_price',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'sell_price'),
          formatter: complexQueryDec3,
          format: '#,##0.000'
        },
        {
          id: 10,
          label: '卖出数量',
          field: 'sell_vol',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'sell_vol'),
          formatter: complexQueryDec0,
          format: '#,##0'
        },
        {
          id: 11,
          label: '卖出金额',
          field: 'sell_amt',
          align: 'right',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'sell_amt'),
          formatter: complexQueryDec2,
          format: '#,##0.00'
        }
      ],
      loading: false,
      currentngspUid: '', // 用来记录上一次返回的ngspUid
      totalNum: 0,
      pagination: {
        currentPage: 1,
        pageSizeNumber: 10
      },
      queryData: { }, // 接口查询参数,保存上次查询参数
      formData: { // 页面中展示参数
        startDate: '',
        endDate: '',
        secCodes: '',
        topN: 5
      },
      initData: {
        start: '',
        end: ''
      },
      rules: {
        startDate: [{required: true, message: '请选择日期'}],
        endDate: [{required: true, message: '请选择日期'}],
        secCodes: [
          {required: true, message: '请输入证券代码', trigger: 'blur'}
        ],
        topN: [
          {validator: checkN}
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
          router: '/branchTradeTopN',
          label: '营业部交易前N名'
        }],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    getDate(value) {
      this.formData.dateRange = value
    },
    getStockCode(data) {
      this.formData.secCodes = data
    },
    clearForm() {
      this.$refs['branchCodesListRef'].clearStockCodes()
      this.$refs['branchTradeTopNQuery'].resetFields()
      this.formData.startDate = this.initData.start
      this.formData.endDate = this.initData.end
    },
    reqTableData(type) {
      let params = {
        startDate: type ? this.formData.startDate : this.queryData.startDate,
        endDate: type ? this.formData.endDate : this.queryData.endDate,
        secCodes: type ? this.formData.secCodes : this.queryData.secCodes,
        topN: type ? this.formData.topN ? this.formData.topN : 5 : this.queryData.topN ? this.queryData.topN : 5,
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
      getBranchTradeTopN(params).then((resp) => {
        this.loading = false
        if (resp) {
          this.currentngspUid = resp.ngsp_uid
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
      this.$refs['branchTradeTopNQuery'].validate((valid) => {
        if (valid) {
          /* 批量校验证券代码格式 */
          if (!selfValidateMethod({AStocks: this.formData.secCodes})) { return }
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
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: this.columns
      }
      this.gfnExportFileWithForm('/complexqry/branchTradeTopN/v1/branchTradeTopN/export', params)
    }
  },
  mounted() {
    // 清空日期为初始日期
    getRelativeTradeDate(-1).then(resp => {
      this.initData.start = this.formData.startDate = moment(resp).format('YYYY-MM-DD')
      this.initData.end = this.formData.endDate = moment(resp).format('YYYY-MM-DD')
    })
  }
}
</script>

<style lang='less'>
  .branch-trade-topn {
    .branch-trade-topn-form {
      padding-top: 10px;
    }
  }
</style>
