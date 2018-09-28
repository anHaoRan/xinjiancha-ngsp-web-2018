<!-- 订单档位指标查询 -->
<template>
  <div class='order-gear-quota-page'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber"></statistic-caliber>
        <el-button size='small' type='info'  @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-form label-width='120px' ref='orderGearForm'
               :model='formData' :rules='rules' :inline="true"
               class='clearfix order-gear-quota-form'>
        <el-col :xl='8' :lg='9' :md='7' :sm='24'>
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
          <el-form-item label='查询几档数据：' prop="gear">
            <el-select v-model='formData.gear' clearable size='small'>
              <el-option v-for='item in gearList'
                         :key='item'
                         :label='item'
                         :value='item'></el-option>
            </el-select>档指标
          </el-form-item>
        </el-col>
        <el-col :xl='7' :lg='7' :md='7' :sm='24'>
          <el-form-item label='账户代码：' prop='acctIds'>
            <account-code
              :ref="`validateOrderGearAccount`"
              :codeType="`account`"
              :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['ACCOUNT_CODE']}
              )
            }"
              @getTextareaCodeList="getAccountListFunc"></account-code>
          </el-form-item>
        </el-col>
        <el-col :xl='9' :lg='8' :md='9' :sm='24'>
          <el-form-item label='证券代码：' prop='secCodes'>
            <stock-code-query-and-upload-component
              :ref="`validateOrderGearStock`"
              :codeType="`stock`"
              :uploadParams="{parseRule: JSON.stringify({verifies: ['STOCK_CODE_SH']})}"
              @getStockCode="getStockCode"></stock-code-query-and-upload-component>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <export-btn @handleExportData="handleExportData"></export-btn>
        <el-col>
          <common-table-pagination-component
            :loading='loading'
            :tableData='tableData'
            :columns='columns'
            :pagination='pagination'
            :totalNum='totalNum'
            @handleRowClick='mouseLeft'
            @handleRowContextMenu='mouseRight'
            @handlePaginationChange='handlePaginationChange'
          ></common-table-pagination-component>
        </el-col>

        <ul class='context-menu' v-show='showTableMenu'
            :style='{left: menuPositionLeft + "px",top: menuPositionTop + "px"}'>
          <li class='no-dialog' v-for='(item, index) in mouseMenuList'
              :key='item.id' v-if='item.show'
              @click='meunDetailInfo(index)'>{{item.name}}</li>
        </ul>
      </el-row>
    </el-card>

    <el-dialog :title='dialogName' top='9vh' :close-on-click-modal='false'
               :lock-scroll='true' :visible.sync='showDialog' width='70%'>
      <detail-gear
        ref='detailOrderGear'
        :menuList='mouseMenuList'
        :tableData='tableDetailData'
        :headerData="tableDetailDataHeader"
        :dialogName.sync='dialogName'
        :tableTabIndex='menuTabIndex'
      ></detail-gear>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import {selfValidateMethod} from './componentsTool/common/validate'
import { getOrderGearIndexQuery } from '../../../service/analysisTool/complexQuery/index'
// 获取交易日偏移
import {getRelativeTradeDate} from '../../../service/common/commonFunc'
import {fixedColumns, gearColumns} from './componentsTool/orderGear/columns'

export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    TextUpload: () => import('../../common/textUpload'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    AccountCode: () => import('./componentsTool/common/TextAreaCodesAndUploadComponent'),
    StockCodeQueryAndUploadComponent: () => import('./componentsTool/common/StockCodeQueryAndUploadComponent'),
    commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
    DetailGear: () => import('./componentsTool/orderGear/DetailGear'),
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
  },
  data() {
    return {
      statisticCaliber: [
        {
          title: '订单档位指标查询',
          content: [
            `1.	股东账户、证券代码、订单时间、订单时间秒后小数、订单编号、申报数量、申报价格、信用标签、买卖方向、订单类型、取自当日普通订单日志（se001ddrzyyyymmdd001.log）文件。`,
            `2.	该订单成交数量、成交金额、成交笔数、成交标志、撤单数量、撤单时间、撤单时间秒后小数、该订单第一笔成交价格、该订单最后一笔成交价格、该订单第一笔成交时间、该订单第一笔成交时间秒后小数、该订单最后一笔成交时间、该订单最后一笔成交时间秒后小数取自当日成交日志文件（se001cjrzyyyymmdd001.log）。`,
            `3.	申报前买方第一档价格，即该笔订单申报前，该股票最大的买盘价格。其他档位类推。`,
            `4.	申报前卖方第一档价格，即该笔订单申报前，该股票最小的卖盘价格。其他档位类推。`,
            `5.	申报后、撤单前和撤单后与申报前类似。`
          ]
        }
      ],
      dialogName: '',
      timer: '',
      menuTabIndex: 0, // 当前查看的哪种菜单 申报前，申报后... 对应tableDetailData数组中的索引
      mouseMenuList: [
        {id: 'a1', name: '申报前情况', show: false},
        {id: 'a2', name: '申报后情况', show: false},
        {id: 'a3', name: '撤单前情况', show: false},
        {id: 'a4', name: '撤单后情况', show: false}
      ],
      tableDetailData: [], // 弹框表格数据
      tableDetailDataHeader: {}, // 弹框头部数据
      showDialog: false,

      menuPositionTop: 0,
      menuPositionLeft: 0,
      showTableMenu: false,

      gearList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 档位指标列表
      currentngspUid: '', // 用来记录上一次返回的ngspUid
      loading: false,
      totalNum: 0,
      pagination: {
        currentPage: 1,
        pageSizeNumber: 10
      },
      queryData: { }, // 接口查询参数,保存上次查询参数
      formData: { // 查询参数
        startDate: '',
        endDate: '',
        acctIds: '',
        secCodes: '', // 证券代码
        gear: ''
      },
      initData: {
        start: '',
        end: ''
      },
      tableData: [],
      columns: [],
      fixedColumns,
      gearColumns,
      rules: {
        startDate: [{required: true, message: '请选择日期'}],
        endDate: [{required: true, message: '请选择日期'}],
        acctIds: [
          {required: true, message: '请输入账户代码'}
        ],
        secCodes: [
          {required: true, message: '请输入证券代码', trigger: 'blur'}
        ],
        gear: [
          {required: true, message: '请选择查询档位'}
        ]
      },
      breadcrumbItems: [
        {
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '数据综合查询'
        }, {
          router: '/orderGearIndexQuery',
          label: '订单档位指标查询'
        }]
    }
  },
  methods: {
    getAccountListFunc(data) {
      this.formData.acctIds = data
    },
    getStockCode(data) {
      this.formData.secCodes = data
    },
    clearForm() {
      this.$refs[`validateOrderGearStock`].clearStockCodes()
      this.$refs[`validateOrderGearAccount`].clearCodeList()
      this.formData.acctIds = ''
      this.formData.secCodes = ''
      this.formData.startDate = this.initData.start
      this.formData.endDate = this.initData.end
    },
    meunDetailInfo(index) { // 弹框，查看具体信息
      this.menuTabIndex = index
      this.dialogName = this.mouseMenuList[index].name
      this.showDialog = true
      this.showTableMenu = false
      setTimeout(() => {
        this.$refs['detailOrderGear'].drawImage()
      }, 500)
    },
    mouseLeft() {
      this.$message('请用鼠标右键单击')
    },
    mouseRight(row, event) {
      event.preventDefault()
      this.showTableMenu = true

      clearTimeout(this.timer)
      this.timer = setTimeout(() => { // 3S后关闭菜单栏
        this.showTableMenu = false
        clearTimeout(this.timer)
      }, 3000)

      // 左键菜单栏在表格中位置
      if (window.innerHeight - event.clientY < 100) {
        this.menuPositionTop = event.clientY - 60
      } else {
        this.menuPositionTop = event.clientY
      }
      this.menuPositionLeft = event.clientX

      this.mouseMenuList.map((item, i) => { // 展示菜单栏
        item.show = false
        if (row.order_status === 'a') {
          item.show = true
        } else {
          this.mouseMenuList[0].show = true
          this.mouseMenuList[1].show = true
        }
      })
      // 弹出框表格数据处理
      let tempArr = new Array(10).fill('')
      let dialogData = [[], [], [], [], [], [], [], []] // 申报前买,申报前卖,申报后买,申报后卖,撤单前买,撤单前卖,撤单后买,撤单后卖
      let nList = [
        ['买', 'bo_buy_price_', 'bo_buy_vol_'],
        ['卖', 'bo_sell_price_', 'bo_sell_vol_'],
        ['买', 'ao_buy_price_', 'ao_buy_vol_'],
        ['卖', 'ao_sell_price_', 'so_sell_vol_'],
        ['买', 'bw_buy_price_', 'bw_buy_vol_'],
        ['卖', 'bw_sell_price_', 'bw_sell_vol_'],
        ['买', 'aw_buy_price_', 'aw_buy_vol_'],
        ['卖', 'aw_sell_price_', 'aw_sell_vol_']
      ]
      dialogData.map((item, index) => {
        tempArr.map((val, i) => {
          dialogData[index].push({
            name: nList[index][0] + (i + 1),
            price: row[nList[index][1] + (i + 1)] ? row[nList[index][1] + (i + 1)] : 0,
            vol: row[nList[index][2] + (i + 1)] ? row[nList[index][2] + (i + 1)] : 0
          })
        })
      })
      let tableDetail = [
        dialogData[0].reverse().concat(dialogData[1]),
        dialogData[2].reverse().concat(dialogData[3]),
        dialogData[4].reverse().concat(dialogData[5]),
        dialogData[6].reverse().concat(dialogData[7])
      ]
      tableDetail.map((val) => {
        val.map((v, i) => {
          if (i > 9) {
            v.graphData = -v.vol
          } else {
            v.graphData = v.vol
          }
        })
      })
      this.tableDetailDataHeader = {
        trade_date: row.trade_date,
        sec_code: row.sec_code,
        order_time: row.order_time
      }
      this.tableDetailData = tableDetail
    },
    handlePaginationChange(pagination) {
      this.pagination = pagination
      this.reqTableData(0)
    },
    reqTableData(type) {
      let params = {
        startDate: type ? this.formData.startDate : this.queryData.startDate,
        endDate: type ? this.formData.endDate : this.queryData.endDate,
        secCodes: type ? this.formData.secCodes : this.queryData.secCodes, // 证券代码集合
        acctIds: type ? this.formData.acctIds : this.queryData.acctIds, // 账户代码集合
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
      getOrderGearIndexQuery(params).then(resp => {
        this.loading = false

        // 处理表头
        this.gearColumns.map((v) => {
          v.show = false
          if (v.gear < this.queryData.gear + 1) {
            v.show = true
          }
        })
        this.columns = this.fixedColumns.concat(this.gearColumns) // 更新表头
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
    handleSearch() { // 查询按钮
      let sDate = new Date(moment(this.formData.startDate).format('YYYY/MM/DD')).getTime()
      let eDate = new Date(moment(this.formData.endDate).format('YYYY/MM/DD')).getTime()
      if (sDate > eDate + 60 * 60 * 1000) {
        this.$message.error('开始日期不得大于结束日期')
        return
      }
      this.$refs['orderGearForm'].validate((valid) => {
        if (valid) {
          if (!selfValidateMethod({accounts: this.formData.acctIds, stocks: this.formData.secCodes})) { /* 批量校验证券代码格式 */
            return
          }
          this.queryData = JSON.parse(JSON.stringify(this.formData))
          this.pagination.currentPage = 1
          this.reqTableData(1)
        }
      })
    },
    getPageination(pageination) {
      this.currentPage = pageination.currentPage
      this.changePageSize = pageination.pageSizeNumber
      this.handleSearch(null, this.currentPage, 'old')
    },
    handleExportData(type) { // 处理导出表格数据
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let tempColumn = []
      this.columns.map(item => {
        if (item.show !== false) {
          tempColumn.push(item)
        }
      })
      let params = {
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: tempColumn
      }
      this.gfnExportFileWithForm('/complexqry/orderGearIndex/v1/orderGearIndexQuery/export', params)
    }
  },
  mounted() {
    this.columns = this.fixedColumns
    // 清空日期为初始日期
    getRelativeTradeDate(-1).then(resp => {
      this.initData.start = this.formData.startDate = moment(resp).format('YYYY-MM-DD')
      this.initData.end = this.formData.endDate = moment(resp).format('YYYY-MM-DD')
    })
  }
}
</script>

<style lang='less'>
  .order-gear-quota-page {
    .order-gear-quota-form {
      padding-top: 10px;
    }
    .context-menu {
      border-radius: 4px;
      background-color: #306090;
      padding: 10px;
      position: fixed;
      li {
        color: #fff;
        margin: 3px 0;
        cursor: pointer;
        &.no-dialog{
          color: #7b8fb9;
          &:hover {
            color: #7b8fb9;
          }
        }
      }
    }
    .line-height32 {
      height: 32px;
      line-height: 32px;
    }
  }

</style>
