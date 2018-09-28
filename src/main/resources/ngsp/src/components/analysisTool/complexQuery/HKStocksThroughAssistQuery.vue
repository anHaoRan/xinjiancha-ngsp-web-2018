<template>
  <div class='HK-stocks-assist-query'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber">
          <div slot="is2">
            <el-table
              :data="tableCalc"
              border
              size="small"
              style="width: 100%;">
              <el-table-column
                v-for="(item, index) in columnsCalc"
                align="center"
                :key="index"
                :label="item.label"
                :prop="item.field">
              </el-table-column>
            </el-table>
          </div>
        </statistic-caliber>
        <el-button size='small' type='info' @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-row>
        <el-form :inline="true" ref='HKStocksAssistQuery' :model='formData' :rules='rules' label-width='110px'
                 class='demo-form-inline HK-stocks-assist-query-form'>
          <el-col :xl='6' :lg='7' :md='10' :sm='10'>
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
          </el-col>
          <el-col :xl='6' :lg='8' :md='10' :sm='10'>
            <el-form-item label='证券代码：' prop='secCodes'>
              <stock-code
                :ref="`validateHKAccount`"
                :codeType="`stock`"
                :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['STOCK_CODE_HK']}
              )
            }"
                @getTextareaCodeList="getAccountListFunc"></stock-code>
            </el-form-item>
          </el-col>
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
  import {getHKStocksThroughData} from '../../../service/analysisTool/complexQuery/index'
  import {selfValidateMethod} from './componentsTool/common/validate'
  // 获取交易日偏移
  import {getRelativeTradeDate} from '../../../service/common/commonFunc'
  import {complexQueryDec0, complexQueryDec3} from './componentsTool/common/sortMethods'

  export default {
    components: {
      Breadcrumb: () => import('../../common/Breadcrumb'),
      TextUpload: () => import('../../common/textUpload'),
      ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
      commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
      StockCode: () => import('./componentsTool/common/TextAreaCodesAndUploadComponent'),
      StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
    },
    data() {
      return {
        columnsCalc: [
          {id: 'calc1', label: '成交标志', field: 'calcType'},
          {id: 'calc2', label: '成交标志描述', field: 'calcDetail'},
          {id: 'calc3', label: '算法', field: 'arithmetic'}
        ],
        tableCalc: [
          {
            calcType: 'M',
            calcDetail: '全部成交',
            arithmetic: '当日该笔交易的申报数量和成交数量相等，则认为该笔交易为全部成交交易'
          },
          {
            calcType: 'W',
            calcDetail: '撤单',
            arithmetic: '当日该笔交易的申报数量和成交数量不相等，同时撤单时间不为空，则认为该笔交易为撤单交易'
          },
          {
            calcType: 'O',
            calcDetail: '其他有效申报',
            arithmetic: '当日该笔交易的申报数量和成交数量不相等，同时其撤单时间为空，则认为该笔交易为其他有效申报交易'
          }
        ],
        statisticCaliber: [
          {
            title: '1.\t本应用可查询自2014年11月17日以来的数据。',
            content: []
          },
          {
            title: '2.\t股东代码、申报时间、申报方向、申报价格、申报数量等字段的值皆取自港股通系统的每日订单日志（se045hdrzyyyymmdd001.txt）数据。',
            content: []
          },
          {
            title: '3.\t成交标志的值及算法如下：',
            rewrite: true
          },
          {
            title: '4.\t成交数量和成交金额取自港股通系统的交易成交（trds040YYYYMMDD001.txt）文件。',
            content: []
          },
          {
            title: '5.\t记录展示以每一笔订单为单位，如果一笔订单有多笔成交的，会将成交数据汇总后展示。',
            content: []
          },
          {
            title: '6.\t应用展示的“证券代码”为在交易中实际使用的港股证券代码。',
            content: []
          },
          {
            title: '7.\t统计时，会员名称和会员营业部名称的值基于成交明细数据中的Stat_PBU_ID来确定。',
            content: []
          },
          {
            title: '8.\tStat_PBU_ID（统计席位代码/统计PBU代码）是数据仓库为了更准确、更方便地识别某条申报/成交记录来自于哪个营业部而设计的一个代码。其算法是根据该条申报/成交记录中券商填报的Branch_ID（2010-01-22以后）/内部订单编号的前两位（2010-01-21以前）对应的营业部，判断其是否属于这个券商。若是，则按其填报的营业部统计。若否，则按其下单的席位/PBU对应的主营业部统计。',
            content: []
          },
          {
            title: '9.\t根据“Stat_PBU_ID”获取得到的会员营业部信息包含基金及非会员（基金、非会员都不还原为出租PBU的会员）。这与市场监察部当前使用的“席位与会员营业部对应关系数据”的口径一致。',
            content: []
          },
          {
            title: '10.\t从中登的zhymtgx1文件中取出账户所属的一码通号。',
            content: []
          }
        ],
        currentngspUid: '', // 用来记录上一次返回的ngspUid
        loading: false,
        tableData: [],
        tableColumns: [ // 定义列
          {
            label: '序号',
            field: 'rank_no',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rank_no')
          },
          {
            label: '证券代码',
            field: 'sec_code_hk',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sec_code_hk')
          },
          {
            label: '证券简称',
            field: 'sec_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sec_name')
          },
          {
            label: '交易日期',
            field: 'order_date',
            align: 'left',
            sortable: true
          },
          {
            label: '股东代码',
            field: 'acct_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_id')
          },
          {
            label: '股东名称',
            field: 'acct_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_name')
          },
          {
            label: '一码通号',
            field: 'ccrc_acct_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ccrc_acct_id')
          },
          {
            label: '申报时间',
            field: 'order_time',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByDetailTime.bind(this, 'order_time')
          },
          {
            label: '申报方向',
            field: 'trade_dir',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'trade_dir')
          },
          {
            label: '成交标志',
            field: 'trade_flag',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'trade_flag')
          },
          {
            label: '申报价格(港元)',
            field: 'order_price',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_price'),
            formatter: complexQueryDec3,
            format: '#,##0.000'
          },
          {
            label: '申报数量(股)',
            field: 'order_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'order_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            label: '成交数量(股)',
            field: 'trade_vol',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_vol'),
            formatter: complexQueryDec0,
            format: '#,##0'
          },
          {
            label: '成交金额(港元)',
            field: 'trade_amt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_amt'),
            formatter: complexQueryDec3,
            format: '#,##0.000'
          },
          {
            label: '撤单时间',
            field: 'withdraw_time',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByDetailTime.bind(this, 'withdraw_time')
          },
          {
            label: '会员名称',
            field: 'mem_name',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'mem_name')
          },
          {
            label: '会员营业部名称',
            field: 'branch_name',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          }
        ],
        totalNum: 0,
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        queryData: {}, // 接口查询参数,保存上次查询参数
        formData: { // 页面中展示参数
          startDate: '',
          endDate: '',
          secCodes: ''
        },
        initData: {
          start: '',
          end: ''
        },
        rules: {
          startDate: [{required: true, message: '请选择日期'}],
          endDate: [{required: true, message: '请选择日期'}],
          secCodes: [
            {required: true, message: '请输入证券代码'}
          ]
        },
        pickerOption: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        breadcrumbItems: [
          {
            router: '/analysisTool',
            label: '分析工具'
          }, {
            router: '/complexQuery',
            label: '综合查询'
          }, {
            router: '/HKStocksThroughAssistQuery',
            label: '港股通数据协查'
          }]
      }
    },
    methods: {
      getAccountListFunc(data) {
        this.formData.secCodes = data
      },
      clearForm() {
        this.$refs[`validateHKAccount`].clearCodeList()
        this.$refs['HKStocksAssistQuery'].resetFields()
        this.formData.secCodes = ''
        this.formData.startDate = this.initData.start
        this.formData.endDate = this.initData.end
      },
      reqTableData(type) {
        let params = {
          startDate: type ? this.formData.startDate : this.queryData.startDate,
          endDate: type ? this.formData.endDate : this.queryData.endDate,
          secCodes: type ? this.formData.secCodes : this.queryData.secCodes, // 账户代码集合
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
        getHKStocksThroughData(params).then((resp) => {
          this.loading = false
          if (resp) {
            resp.data.length > 0 ? this.currentngspUid = resp.ngsp_uid : this.currentngspUid = ''
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
        this.$refs['HKStocksAssistQuery'].validate((valid) => {
          if (valid) {
            if (!selfValidateMethod({HKstocks: this.formData.secCodes})) { /* 批量校验证券代码格式 */
              return
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
          exportType: type,
          isExport: 1,
          isNewQuery: 0,
          ngspUid: this.currentngspUid,
          tableColumns: this.tableColumns
        }

        this.gfnExportFileWithForm('/complexqry/hkstassistquery/v1/hkstassistquery/export', params)
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
  .HK-stocks-assist-query {
    .HK-stocks-assist-query-form {
      padding-top: 10px;
    }
    .uploadBtn {
      display: inline-block;
      margin: 1px 10px 0 10px;
    }
  }
</style>
