<!--
主界面的二级表格,数据中标记mark表示当前方格右键点击出现对话框
维度信息查询钻取
1、非逐日情况
菜单中提供的选项有“持股曲线”、“持仓市值曲线”和“账户明细”【“持仓市值曲线”仅在主界面输入参数“证券代码”为A股时可钻取】
2、逐日情况
菜单中提供的选项为“账户明细”（此时“持股曲线”、“持仓市值曲线”变灰）
-->
<template>
  <div>
    <div class="dimension-query-area-header-s">
      <el-row class="dimension-query-table-overflow-s">
        <el-col :span="24">
          <common-table-pagination-component
            :loading='loading'
            :tableData='tableData'
            :columns='columns'
            :pagination='pagination'
            :totalNum='totalNum'
            @handleRowClick="mouseLeft"
            @handleRowContextMenu="mouseRight"
            @handlePaginationChange='handlePaginationChange'
          ></common-table-pagination-component>
        </el-col>
        <!-- 右键弹出的菜单 -->
        <ul class="context-menu-main-table" v-show="showTableMenu"
            :style="{left: menuPositionLeft + 'px',top: menuPositionTop + 'px'}">
          <template v-if="markTableRender % 2 == 1">
            <li class="no-dialog">持股曲线</li>
            <!-- 仅A股有“持仓市值曲线” -->
            <template v-if="drillingParams.ASH">
              <li @click="toDrillQuery('持仓市值曲线')">持仓市值曲线</li>
            </template>
            <template v-else>
              <li class="no-dialog">持仓市值曲线</li>
            </template>
            <li @click="toDrillQuery('账户明细', 'detail')">账户明细</li>
          </template>
          <template v-else>
            <li @click="toDrillQuery('持股曲线')">持股曲线</li>
            <li @click="toDrillQuery('持仓市值曲线')">持仓市值曲线</li>
            <li @click="toDrillQuery('账户明细', 'detail')">账户明细</li>
          </template>
        </ul>
      </el-row>
    </div>

    <!-- 图表和钻取明细弹出框 -->
    <el-dialog
      :title="dialogName"
      top="4vh"
      :visible.sync="dialogChartVisible"
      :close-on-click-modal="false" width="75%">
      <template v-if="detailDialog">
        <!-- tableSelectVal 该事件可在钻取明细弹框中选中多个记录数账户ID，在“账户证券持仓查询，交易查询弹框中赋值” -->
        <dimension-drilling-detail
          :drillingParams="drillingParams"
          :dialogChartVisible="dialogChartVisible"
          :detailDialog="detailDialog"
          v-on:tableSelectVal="getSelectVal"
        ></dimension-drilling-detail>
      </template>
      <template v-else>
        <shareholding-curve
          :drillingParams="drillingParams"
          :dialogChartVisible="dialogChartVisible"
          :detailDialog="detailDialog"></shareholding-curve>
      </template>
    </el-dialog>
    <!-- 钻取明细弹出框中 证券交易和证券持仓按钮弹框 -->
    <el-dialog :title="securityDialogName"
               v-if="saveDrillingSecurity.dialog"
               top="4vh"
               :visible="saveDrillingSecurity.dialog"
               @close="closeSecurityDialog"
               width="75%">
      <drilling-detail-security-query :secParams="drillingSecurity"></drilling-detail-security-query>
    </el-dialog>
  </div>
</template>

<script>
  // markTableRender: 0: 账户，2：PBU, 4: 营业部，6：会员，1：账户—逐日 ，3：PBU—逐日， 5: 营业部—逐日 ，7: 会员—逐日

  import ShareholdingCurve from './DimensionShareholdingCurve'
  import DimensionDrillingDetail from './DimensionDrillingDetail'
  import { columnsList } from './columns'
  import { getDimensionInfo } from '@/service/analysisTool/complexQuery/index'

  export default {
    components: {
      ShareholdingCurve,
      DimensionDrillingDetail,
      DrillingDetailSecurityQuery: () => import('./DrillingDetailSecurityQuery'),
      commonTablePaginationComponent: () => import('../common/commonTablePaginationComponent'),
    },
    data () {
      return {
        currentngspUid: '', // 用来记录上一次返回的ngspUid
        loading: false,
        totalNum: 0,
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        columns: columnsList,
        tableData: [],
        queryData: {},
        storeDownloadData: {},
        storeStatistics: [], // 保存用户点击查询后的维度指标
        timer: '',
        getSelectVals: [], // 获得钻取明细弹框中用户勾选的记录账户ID
        securityDialogName: '账户证券交易查询',
        drillingSecurity: {}, // 钻取明细表格弹框中的弹框需要参数【账户证券交易查询、账户证券持仓查询】

        dialogChartVisible: false, // 持股、持仓市值曲线弹框
        detailDialog: false, // 钻取明细弹框
        dialogName: '', // 弹框名称
        showTableMenu: false, // 展示菜单
        menuPositionLeft: 0,
        menuPositionTop: 0,
        getUserClickData: {}, // 获得用户点击的数据
        markTableRender: 0
      }
    },
    computed: {
      saveDrillingSecurity () {
        return this.$store.state.insiderTradAnalysis.saveDrillingDetailSecurity
      }
    },
    props: {
      drillingParams: {} // 请求图表和钻取明细的入参
    },
    watch: {
      saveDrillingSecurity: {
        handler () {
          if (this.saveDrillingSecurity.dialog) {
            this.drillingSecurity = Object.assign({}, this.drillingParams) // 设置账户证券交易查询、账户证券持仓查询按钮的参数
            this.$set(this.drillingSecurity, 'securityType', this.saveDrillingSecurity.type)
            if (this.getSelectVals.length > 0) {
              this.$set(this.drillingSecurity, 'acctId', this.getSelectVals.toString())
            }
            this.saveDrillingSecurity.type === 'trading' ? this.securityDialogName = '账户证券交易查询' : this.securityDialogName = '账户证券持仓查询'
          }
        },
        deep: true
      }
    },
    methods: {
      getSelectVal (val) {
        this.getSelectVals = val
      },
      closeSecurityDialog () {
        this.$store.commit('saveDrillingDetailSecurity', {dialog: false})
      },
      mouseLeft (row, event) {
        event.preventDefault()
        this.showTableMenu = false
        this.$message('请单击鼠标右键')
      },
      mouseRight (row, event) {
        event.preventDefault()
        clearTimeout(this.timer)
        this.timer = setTimeout(() => { // 3S后关闭菜单栏
          this.showTableMenu = false
          clearTimeout(this.timer)
        }, 3000)
        this.showTableMenu = true

        if (window.innerHeight - event.clientY < 100) {
          this.menuPositionTop = event.clientY - 100
        } else {
          this.menuPositionTop = event.clientY
        }
        this.menuPositionLeft = event.clientX
        this.getUserClickData = row
      },
      setDrillTypeCode (param) { // 判断按哪种类型钻取，并设置相应的代码[0，1: 账户，2,3：PBU, 4，5: 营业部，6,7：会员]
        if (this.markTableRender == 0 || this.markTableRender == 1) {
          this.$set(this.drillingParams, 'isDrillAcct', 1)
        } else if (this.markTableRender == 2 || this.markTableRender == 3) {
          this.$set(this.drillingParams, 'isDrillPbu', 1)
        } else if (this.markTableRender == 4 || this.markTableRender == 5) {
          this.$set(this.drillingParams, 'isDrillBranch', 1)
        } else if (this.markTableRender == 6 || this.markTableRender == 7) {
          this.$set(this.drillingParams, 'isDrillMem', 1)
        }
        this.$set(this.drillingParams, 'acctId', param.acct_id || '')
        this.$set(this.drillingParams, 'pbuId', param.pbu_id || '')
        this.$set(this.drillingParams, 'branchCode', param.branch_code || '')
        this.$set(this.drillingParams, 'memCode', param.mem_code || '')
      },
      toDrillQuery (name, option) { // 点击进入钻取弹框
        if (this.markTableRender % 2 == 0) { // 偶数非逐日，奇数逐日
          this.$set(this.drillingParams, 'trade_date', this.getUserClickData.trade_date)
        }
        if (name == '持股曲线') {
          this.$set(this.drillingParams, 'chartsType', 'holdingStock')
        } else {
          this.$set(this.drillingParams, 'chartsType', '')
        }
        this.setDrillTypeCode(this.getUserClickData)

        this.dialogName = name
        this.dialogChartVisible = true
        this.showTableMenu = false
        // 账户明细
        option != 'detail' ? this.detailDialog = false : this.detailDialog = true
      },
      judgeDimension (type, isDayCalc) { // 判断表头  markTableRender 0: 账户，2：PBU, 4: 营业部， 6：会员， 1：账户—逐日 ， 3：PBU—逐日  依次
        if (type == 1) {
          // 0 非逐日   1 逐日
          isDayCalc == 0 ? this.markTableRender = 0 : this.markTableRender = 1
        } else if (type == 2) {
          isDayCalc == 0 ? this.markTableRender = 2 : this.markTableRender = 3
        } else if (type == 3) {
          isDayCalc == 0 ? this.markTableRender = 4 : this.markTableRender = 5
        } else if (type == 4) {
          isDayCalc == 0 ? this.markTableRender = 6 : this.markTableRender = 7
        }
        this.$store.commit('saveDemensionType', this.markTableRender) // 存入表头类型 1，2，3，4，5，6，7，8
      },
      handleSearch (type, statistics, reqParams, mark) {
        let params = {}
        this.storeStatistics = statistics
        if (mark !== 'old') {
          params = JSON.parse(JSON.stringify(reqParams))
          this.judgeDimension(params.dimenType, params.isDayCalc) // 判断表头
          if (params.isDrillDetail == 1) { // 按照哪种维度类型钻取明细
            switch (Number(params.dimenType)) {
              case 1:
                params.isDrillAcct = '1'
                break
              case 2:
                params.isDrillPbu = '1'
                break
              case 3:
                params.isDrillBranch = '1'
                break
              default:
                params.isDrillMem = '1'
            }
          }
          this.queryData = params
        } else {
          params = this.queryData
        }
        type ? this.pagination.currentPage = 1 : ''
        params.pageIndex = this.pagination.currentPage
        params.pageRows = this.pagination.pageSizeNumber
        params.ngspUid = type ? '' : this.currentngspUid
        params.isNewQuery = type
        params.isExport = 0

        this.loading = true
        this.storeDownloadData = JSON.parse(JSON.stringify(params))
        getDimensionInfo(params).then((resp) => {
          this.loading = false
          // 表头处理
          this.columns.filter(v => {
            v.show = false
            if (statistics.indexOf(v.label) > -1) {
              v.show = true
            }
            // 固定展示列
            if (params.isDayCalc == 1 && v.field == 'trade_date') {
              v.show = true
            } else if (v.field == 'pbu_id' && (params.dimenType == 1 || params.dimenType == 2)) {
              v.show = true
            } else if (v.field == 'mem_branch_name' && params.dimenType != 4) {
              v.show = true
            } else if (v.field == 'mem_name' && params.dimenType == 4) {
              v.show = true
            } else if (params.dimenType == 1 && (v.field == 'acct_id' || v.field == 'acct_name' || v.field == 'branch_source')) {
              v.show = true
            }
          })

          if (resp) {
            this.currentngspUid = resp.ngsp_uid
            this.tableData = resp.data
            this.totalNum = Number(resp.totalRowCount)
          } else {
            this.currentngspUid = ''
            this.tableData = []
          }
        })

        // this.columns.filter(v => {
        //   v.show = false
        //   if(statistics.indexOf(v.label) > -1) {
        //     v.show = true
        //   }
        //   // 固定展示列
        //   if(params.isDayCalc == 1 && v.field == 'trade_date') {
        //     v.show = true
        //   }
        //   if(v.field == 'pbu_id' && (params.dimenType == 1 || params.dimenType == 2)) {
        //     v.show = true
        //   }
        //   if(v.field == 'mem_branch_name' && params.dimenType != 4) {
        //     v.show = true
        //   }
        //   if(v.field == 'mem_name' && params.dimenType == 4) {
        //     v.show = true
        //   }
        //   if(params.dimenType == 1  && (v.field == 'acct_id' || v.field == 'acct_name' || v.field == 'branch_source')) {
        //     v.show = true
        //   }
        // })
        // this.loading = false
        // this.tableData = [
        //   {
        //     'trade_date': '2009-11-10',
        //     'acct_id': 'A457355523',
        //     'pbu_id': '98757',
        //     'mem_code': 'CH8HNST77948',
        //     'branch_code': 'SHBJTSH-00685022',
        //
        //     'mem_name': '1镇膊腔透',
        //     'acct_name': '1镇膊腔透',
        //
        //     'trade_sell_amt_ratio': '0.29408111',
        //     'trade_sell_vol': 984.0,
        //     'trade_sell_vol_ratio': '4.48230',
        //     'net_buy_amt': '85.00',
        //     'trade_buy_amt_ratio': '2.72153',
        //     'order_buy_vol_ratio': '.95164',
        //     'net_buy_vol': 0.0,
        //     'order_buy_vol': 184.0,
        //     'ngsp_create_date': '2018-04-18 00:00:00',
        //     'order_sell_vol_ratio': '4.58613',
        //     'trade_acct_cnt': 0,
        //     'order_sell_amt': '1502.00',
        //     'order_buy_amt_ratio': '2.57024',
        //     'branch_code': 'SHGDTGD-00129165',
        //     'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
        //     'trade_buy_amt': '1590.00',
        //     'trade_sell_amt': '1505.00',
        //     'order_sell_vol': 984.0,
        //     'trade_buy_vol_ratio': '8.104',
        //     'order_sell_amt_ratio': '.25002',
        //     'mem_branch_name': '江门台山桥湖路证券营业部',
        //     'order_buy_amt': '3156.00',
        //     'trade_buy_vol': 984.0
        //   },
        //   {
        //     'trade_date': '2009-11-10',
        //     'acct_id': 'A457355523',
        //     'pbu_id': '98757',
        //     'mem_code': 'CH8HNST77948',
        //     'branch_code': 'SHBJTSH-00685022',
        //
        //     'mem_name': '1镇膊腔透',
        //     'acct_name': '1镇膊腔透',
        //
        //     'trade_sell_amt_ratio': '0.29408111',
        //     'trade_sell_vol': 984.0,
        //     'trade_sell_vol_ratio': '4.48230',
        //     'net_buy_amt': '85.00',
        //     'trade_buy_amt_ratio': '2.72153',
        //     'order_buy_vol_ratio': '.95164',
        //     'net_buy_vol': 0.0,
        //     'order_buy_vol': 184.0,
        //     'ngsp_create_date': '2018-04-18 00:00:00',
        //     'order_sell_vol_ratio': '4.58613',
        //     'trade_acct_cnt': 0,
        //     'order_sell_amt': '1502.00',
        //     'order_buy_amt_ratio': '2.57024',
        //     'branch_code': 'SHGDTGD-00129165',
        //     'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
        //     'trade_buy_amt': '1590.00',
        //     'trade_sell_amt': '1505.00',
        //     'order_sell_vol': 984.0,
        //     'trade_buy_vol_ratio': '8.104',
        //     'order_sell_amt_ratio': '.25002',
        //     'mem_branch_name': '江门台山桥湖路证券营业部',
        //     'order_buy_amt': '3156.00',
        //     'trade_buy_vol': 984.0
        //   },
        //   {
        //     'trade_date': '2009-11-10',
        //     'acct_id': 'A457355523',
        //     'pbu_id': '98757',
        //     'mem_code': 'CH8HNST77948',
        //     'branch_code': 'SHBJTSH-00685022',
        //
        //     'mem_name': '1镇膊腔透',
        //     'acct_name': '1镇膊腔透',
        //
        //     'trade_sell_amt_ratio': '0.29408111',
        //     'trade_sell_vol': 984.0,
        //     'trade_sell_vol_ratio': '4.48230',
        //     'net_buy_amt': '85.00',
        //     'trade_buy_amt_ratio': '2.72153',
        //     'order_buy_vol_ratio': '.95164',
        //     'net_buy_vol': 0.0,
        //     'order_buy_vol': 184.0,
        //     'ngsp_create_date': '2018-04-18 00:00:00',
        //     'order_sell_vol_ratio': '4.58613',
        //     'trade_acct_cnt': 0,
        //     'order_sell_amt': '1502.00',
        //     'order_buy_amt_ratio': '2.57024',
        //     'branch_code': 'SHGDTGD-00129165',
        //     'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
        //     'trade_buy_amt': '1590.00',
        //     'trade_sell_amt': '1505.00',
        //     'order_sell_vol': 984.0,
        //     'trade_buy_vol_ratio': '8.104',
        //     'order_sell_amt_ratio': '.25002',
        //     'mem_branch_name': '江门台山桥湖路证券营业部',
        //     'order_buy_amt': '3156.00',
        //     'trade_buy_vol': 984.0
        //   },
        //   {
        //     'trade_date': '2009-11-11',
        //     'acct_id': 'A111111115',
        //     'pbu_id': '98757',
        //     'mem_code': '2CH1JSST77822',
        //     'mem_name': '2镇膊腔透',
        //     'acct_name': '2镇膊腔透',
        //     'trade_sell_amt_ratio': '82.69001',
        //     'trade_sell_vol': 13697.0,
        //     'trade_sell_vol_ratio': '62.39238',
        //     'net_buy_amt': '-404376.00',
        //     'trade_buy_amt_ratio': '32.18767',
        //     'order_buy_vol_ratio': '51.60590',
        //     'net_buy_vol': -3719.0,
        //     'order_buy_vol': 9978.0,
        //     'ngsp_create_date': '2018-04-18 00:00:00',
        //     'order_sell_vol_ratio': '79.21793',
        //     'trade_acct_cnt': 0,
        //     'order_sell_amt': '459491.00',
        //     'order_buy_amt_ratio': '15.31558',
        //     'branch_code': 'SHSZTTJ-00700048',
        //     'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
        //     'trade_buy_amt': '18805.00',
        //     'trade_sell_amt': '423181.00',
        //     'order_sell_vol': 16997.0,
        //     'trade_buy_vol_ratio': '82.18433',
        //     'order_sell_amt_ratio': '76.48584',
        //     'mem_branch_name': '天津尖山路证券营业部',
        //     'order_buy_amt': '18806.00',
        //     'trade_buy_vol': 9978.0
        //   }
        // ]
      },
      handlePaginationChange (pagination) {
        this.pagination = pagination
        this.handleSearch(0, this.storeStatistics, null, 'old')
      },
      handleDownload (type, num) {
        let params = JSON.parse(JSON.stringify(this.storeDownloadData))
        let column = this.columns.filter(item => {
          if (item.show) {
            return item
          }
        })
        params.exportType = 'excel'
        params.isExport = 1  // 导出前多少条与直接导出csv、excel互斥
        switch (type) {
          case 1:
            params.isExportPart = 1
            params.pageRows = num.toString() // 当用户指定导出条数时，赋值给pageRows
            break
          case 2:
            params.isExportPart = 0
            break
          default:
            params.exportType = 'csv'
            break
        }
        params.tableColumns = column
        this.gfnExportFileWithForm('/complexqry/dimension/v1/dimensioninfo/export', params)
      }
    }
  }
</script>

<style lang="less">
  .dimension-query-area-header-s {
    .context-menu-main-table {
      background: #306090;
      position: fixed;
      padding: 10px 20px;
      border-radius: 5px;
      li {
        padding: 3px 0;
        text-align: center;
        color: #fff;
        &.no-dialog {
          color: #7b8fb9;
          &:hover {
            color: #7b8fb9;
          }
        }
      }
    }
  }

</style>
