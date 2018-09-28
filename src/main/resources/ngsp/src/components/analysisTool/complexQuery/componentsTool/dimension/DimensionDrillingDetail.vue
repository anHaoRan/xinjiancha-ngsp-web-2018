<!--
钻取明细弹框内容
-->
<template>
  <div>
    <el-row style='padding-top: 0'>
      <el-col :xl='24' :md='24' :sm='24'>
        <el-col :xl='22' :md='22' :sm='22'>
          <el-col :xl='3' :lg='4' :md='4' :sm='4'>
            <el-button type='info' size='mini' @click='drillingAccountSecurity("trading")'>账户证券交易查询</el-button>
          </el-col>
          <el-col :xl='4' :lg='4' :md='4' :sm='4' style='margin-left: 10px;'>
            <el-button type='info' size='mini' @click='drillingAccountSecurity("holding")'>账户证券持仓查询</el-button>
          </el-col>
        </el-col>
        <el-col :xl='2' :md='2' :sm='2'>
          <export-btn @handleExportData="handleDownload"></export-btn>
        </el-col>
      </el-col>
      <el-col>
        <common-table-pagination-component
          :loading='loading'
          :tableData='tableData'
          :columns='columns'
          :pagination='pagination'
          :totalNum='totalNum'
          :showSelection="true"
          @handleSelectionChange="tableSelect"
          @handlePaginationChange='handlePaginationChange'
        ></common-table-pagination-component>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // markTableRender: 0: 账户，2：PBU, 4: 营业部，6：会员，1：账户—逐日 ，3：PBU—逐日， 5: 营业部—逐日 ，7: 会员—逐日
  import { getDimensionInfo } from '@/service/analysisTool/complexQuery/index'

  export default {
    components: {
      commonTablePaginationComponent: () => import('../../componentsTool/common/commonTablePaginationComponent'),
      ExportBtn: () => import('../../componentsTool/common/ExportButtonComponent')
    },
    data () {
      return {
        tableSelectVal: [],
        dialogName: '账户证券交易查询',
        queryDatas: {},

        currentngspUid: '', // 用来记录上一次返回的ngspUid
        loading: false,
        totalNum: 0,
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        columns: [],
        //  0: 账户，2：PBU, 4: 营业部， 6：会员， 1：账户—逐日 ， 3：PBU—逐日  依次
        columnsList: [
          [ // 定义列
            {id: 810, minWidth: 80, label: '账户代码', field: 'acct_id', align: 'left'},
            {id: 820, minWidth: 80, label: '账户名称', field: 'acct_name', align: 'left'},
            {id: 831, minWidth: 80, label: '成交买入数量', field: 'trade_buy_vol', align: 'right', format: '0'},
            {id: 841, minWidth: 80, label: '成交买入金额', field: 'trade_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 832, minWidth: 80, label: '成交买入数量占比', field: 'trade_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 842, minWidth: 80, label: '成交买入金额占比', field: 'trade_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 851, minWidth: 80, label: '成交卖出数量', field: 'trade_sell_vol', align: 'right', format: '0'},
            {id: 861, minWidth: 80, label: '成交卖出金额', field: 'trade_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 852, minWidth: 80, label: '成交卖出数量占比', field: 'trade_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 862, minWidth: 80, label: '成交卖出金额占比', field: 'trade_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 871, minWidth: 80, label: '净买入数量', field: 'net_buy_vol', align: 'right', format: '0'},
            {id: 881, minWidth: 80, label: '净买入金额', field: 'net_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 891, minWidth: 80, label: '委托买入数量', field: 'order_buy_vol', align: 'right', format: '0'},
            {id: 8101, minWidth: 80, label: '委托买入金额', field: 'order_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 892, minWidth: 80, label: '委托买入数量占比', field: 'order_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8102, minWidth: 80, label: '委托买入金额占比', field: 'order_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8111, minWidth: 80, label: '委托卖出数量', field: 'order_sell_vol', align: 'right', format: '0'},
            {id: 8121, minWidth: 80, label: '委托卖出金额', field: 'order_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 8112, minWidth: 80, label: '委托卖出数量占比', field: 'order_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8122, minWidth: 80, label: '委托卖出金额占比', field: 'order_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8141, minWidth: 80, label: '期初前持有数量', field: 'before_hold_vol', align: 'right', format: '0'},
            {id: 8142, minWidth: 80, label: '期初前持仓占比', field: 'before_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8151, minWidth: 80, label: '期初持有数量', field: 'before_hold_vol', align: 'right', format: '0'},
            {id: 8152, minWidth: 80, label: '期初持仓占比', field: 'before_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8161, minWidth: 80, label: '期末持有数量', field: 'end_hold_vol', align: 'right', format: '0'},
            {id: 8162, minWidth: 80, label: '期末持仓占比', field: 'end_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8181, minWidth: 80, label: '持股单一天数', field: 'single_date_cnt', align: 'right', format: '0'},
            {id: 8182, minWidth: 80, label: '持股单一超过80%', field: 'single_flag', align: 'left'},
            {id: 8202, minWidth: 80, label: '账户开户证件号', field: 'id_card', align: 'left'},
            {id: 8230, minWidth: 80, label: 'PBU代码', field: 'pbu_id', align: 'left'},
            {id: 8231, minWidth: 80, label: '会员营业部名称', field: 'mem_branch_name', align: 'left'},
            {id: 8232, minWidth: 80, label: '会员名称', field: 'mem_name', align: 'left'}
          ],
          [ // 定义列
            {id: 810, minWidth: 80, label: '交易日期', field: 'trade_date', align: 'left'},
            {id: 811, minWidth: 80, label: '账户代码', field: 'acct_id', align: 'left'},
            {id: 820, minWidth: 80, label: '账户名称', field: 'acct_name', align: 'left'},
            {id: 831, minWidth: 80, label: '成交买入数量', field: 'trade_buy_vol', align: 'right', format: '0'},
            {id: 841, minWidth: 80, label: '成交买入金额', field: 'trade_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 832, minWidth: 80, label: '成交买入数量占比', field: 'trade_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 842, minWidth: 80, label: '成交买入金额占比', field: 'trade_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 851, minWidth: 80, label: '成交卖出数量', field: 'trade_sell_vol', align: 'right', format: '0'},
            {id: 861, minWidth: 80, label: '成交卖出金额', field: 'trade_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 852, minWidth: 80, label: '成交卖出数量占比', field: 'trade_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 862, minWidth: 80, label: '成交卖出金额占比', field: 'trade_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 871, minWidth: 80, label: '净买入数量', field: 'net_buy_vol', align: 'right', format: '0'},
            {id: 881, minWidth: 80, label: '净买入金额', field: 'net_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 891, minWidth: 80, label: '委托买入数量', field: 'order_buy_vol', align: 'right', format: '0'},
            {id: 8101, minWidth: 80, label: '委托买入金额', field: 'order_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 892, minWidth: 80, label: '委托买入数量占比', field: 'order_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8102, minWidth: 80, label: '委托买入金额占比', field: 'order_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8111, minWidth: 80, label: '委托卖出数量', field: 'order_sell_vol', align: 'right', format: '0'},
            {id: 8121, minWidth: 80, label: '委托卖出金额', field: 'order_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 8112, minWidth: 80, label: '委托卖出数量占比', field: 'order_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8122, minWidth: 80, label: '委托卖出金额占比', field: 'order_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8141, minWidth: 80, label: '当日持有数量', field: 'hold_vol', align: 'right', format: '0'},
            {id: 8142, minWidth: 80, label: '当日持仓占比', field: 'hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8190, minWidth: 80, label: '持股单一账户', field: 'single_flag', align: 'left'},
            {id: 8202, minWidth: 80, label: '账户开户证件号', field: 'id_card', align: 'left'},
            {id: 8235, minWidth: 80, label: 'PBU代码', field: 'pbu_id', align: 'left'},
            {id: 8236, minWidth: 80, label: '会员营业部名称', field: 'mem_branch_name', align: 'left'},
            {id: 8237, minWidth: 80, label: '会员名称', field: 'mem_name', align: 'left'}
          ],
          [
            {id: 8810, label: '账户代码', field: 'acct_id', align: 'left'},
            {id: 8820, label: '账户名称', field: 'acct_name', align: 'left'},
            {id: 8141, label: '期间PBU个数', field: 'pbu_cnt', align: 'right'},
            {id: 8142, label: '期初前持有数量', field: 'before_hold_vol', align: 'right', format: '0'},
            {id: 8143, label: '期初前持仓占比', field: 'before_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8151, label: '期初持有数量', field: 'before_hold_vol', align: 'right', format: '0'},
            {id: 8152, label: '期初持仓占比', field: 'before_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8161, label: '期末持有数量', field: 'end_hold_vol', align: 'right', format: '0'},
            {id: 8162, label: '期末持仓占比', field: 'end_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8181, label: '持股单一天数', field: 'single_date_cnt', align: 'right'},
            {id: 8182, label: '持股单一超过80%', field: 'single_flag', align: 'left'},
            {id: 8202, label: '账户开户证件号', field: 'id_card', align: 'left'},
            {id: 8238, label: 'PBU代码', field: 'pbu_id', align: 'left'}
          ],
          [
            {id: 810, label: '交易日期', field: 'trade_date', align: 'left'},
            {id: 811, label: '账户代码', field: 'acct_id', align: 'left'},
            {id: 820, label: '账户名称', field: 'acct_name', align: 'left'},
            {id: 8141, label: '当日持有数量', field: 'hold_vol', align: 'right', format: '0'},
            {id: 8142, label: '当日持仓占比', field: 'before_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8190, label: '持股单一账户', field: 'single_flag', align: 'left'},
            {id: 8202, label: '账户开户证件号', field: 'id_card', align: 'left'},
            {id: 8239, label: 'PBU代码', field: 'pbu_id', align: 'left'}
          ],
          [
            {id: 810, minWidth: 80, label: '账户代码', field: 'acct_id', align: 'left'},
            {id: 820, minWidth: 80, label: '账户名称', field: 'acct_name', align: 'left'},
            {id: 8201, minWidth: 80, label: '期间营业部个数', field: 'branch_cnt', align: 'left'},
            {id: 831, minWidth: 80, label: '成交买入数量', field: 'trade_buy_vol', align: 'right', format: '0'},
            {id: 841, minWidth: 80, label: '成交买入金额', field: 'trade_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 832, minWidth: 80, label: '成交买入数量占比', field: 'trade_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 842, minWidth: 80, label: '成交买入金额占比', field: 'trade_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 851, minWidth: 80, label: '成交卖出数量', field: 'trade_sell_vol', align: 'right', format: '0'},
            {id: 861, minWidth: 80, label: '成交卖出金额', field: 'trade_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 852, minWidth: 80, label: '成交卖出数量占比', field: 'trade_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 862, minWidth: 80, label: '成交卖出金额占比', field: 'trade_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 871, minWidth: 80, label: '净买入数量', field: 'net_buy_vol', align: 'right', format: '0'},
            {id: 881, minWidth: 80, label: '净买入金额', field: 'net_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 891, minWidth: 80, label: '委托买入数量', field: 'order_buy_vol', align: 'right', format: '0'},
            {id: 8101, minWidth: 80, label: '委托买入金额', field: 'order_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 892, minWidth: 80, label: '委托买入数量占比', field: 'order_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8102, minWidth: 80, label: '委托买入金额占比', field: 'order_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8111, minWidth: 80, label: '委托卖出数量', field: 'order_sell_vol', align: 'right', format: '0'},
            {id: 8121, minWidth: 80, label: '委托卖出金额', field: 'order_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 8112, minWidth: 80, label: '委托卖出数量占比', field: 'order_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8122, minWidth: 80, label: '委托卖出金额占比', field: 'order_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8181, minWidth: 80, label: '持股单一天数', field: 'single_date_cnt', align: 'right'},
            {id: 8182, minWidth: 80, label: '持股单一超过80%', field: 'single_flag', align: 'left'},
            {id: 8202, minWidth: 80, label: '账户开户证件号', field: 'id_card', align: 'left'},
            {id: 8231, minWidth: 80, label: '会员营业部名称', field: 'mem_branch_name', align: 'left'},
            {id: 8232, minWidth: 80, label: '总成交买入数量', field: 'total_buy_vol', align: 'left', format: '0'},
            {id: 8233, minWidth: 80, label: '总成交买入金额', field: 'total_buy_amt', align: 'left', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 8234, minWidth: 80, label: '总成交卖出数量', field: 'total_sell_vol', align: 'left', format: '0'},
            {id: 8235, minWidth: 80, label: '总成交卖出金额', field: 'total_sell_amt', align: 'left', formatter: this.gfnElColFormatDec2, format: '0.00'}
          ],
          [
            {id: 810, minWidth: 80, label: '交易日期', field: 'trade_date', align: 'left'},
            {id: 811, minWidth: 80, label: '账户代码', field: 'acct_id', align: 'left'},
            {id: 820, minWidth: 80, label: '账户名称', field: 'acct_name', align: 'left'},
            {id: 831, minWidth: 80, label: '成交买入数量', field: 'trade_buy_vol', align: 'right', format: '0'},
            {id: 841, minWidth: 80, label: '成交买入金额', field: 'trade_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 832, minWidth: 80, label: '成交买入数量占比', field: 'trade_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 842, minWidth: 80, label: '成交买入金额占比', field: 'trade_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 851, minWidth: 80, label: '成交卖出数量', field: 'trade_sell_vol', align: 'right', format: '0'},
            {id: 861, minWidth: 80, label: '成交卖出金额', field: 'trade_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 852, minWidth: 80, label: '成交卖出数量占比', field: 'trade_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 862, minWidth: 80, label: '成交卖出金额占比', field: 'trade_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 871, minWidth: 80, label: '净买入数量', field: 'net_buy_vol', align: 'right', format: '0'},
            {id: 881, minWidth: 80, label: '净买入金额', field: 'net_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 891, minWidth: 80, label: '委托买入数量', field: 'order_buy_vol', align: 'right', format: '0'},
            {id: 8101, minWidth: 80, label: '委托买入金额', field: 'order_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 892, minWidth: 80, label: '委托买入数量占比', field: 'order_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8102, minWidth: 80, label: '委托买入金额占比', field: 'order_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8111, minWidth: 80, label: '委托卖出数量', field: 'order_sell_vol', align: 'right', format: '0'},
            {id: 8121, minWidth: 80, label: '委托卖出金额', field: 'order_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 8112, minWidth: 80, label: '委托卖出数量占比', field: 'order_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8122, minWidth: 80, label: '委托卖出金额占比', field: 'order_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8190, minWidth: 80, label: '持股单一账户', field: 'single_flag', align: 'left'},
            {id: 8202, minWidth: 80, label: '账户开户证件号', field: 'id_card', align: 'left'},
            {id: 8230, minWidth: 80, label: '会员营业部名称', field: 'mem_branch_name', align: 'left'}
          ],
          [
            {id: 810, minWidth: 80, label: '账户代码', field: 'acct_id', align: 'left'},
            {id: 820, minWidth: 80, label: '账户名称', field: 'acct_name', align: 'left'},
            {id: 8201, minWidth: 80, label: '期间会员个数', field: 'mem_cnt', align: 'left'},
            {id: 831, minWidth: 80, label: '成交买入数量', field: 'trade_buy_vol', align: 'right', format: '0'},
            {id: 841, minWidth: 80, label: '成交买入金额', field: 'trade_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 832, minWidth: 80, label: '成交买入数量占比', field: 'trade_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 842, minWidth: 80, label: '成交买入金额占比', field: 'trade_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 851, minWidth: 80, label: '成交卖出数量', field: 'trade_sell_vol', align: 'right', format: '0'},
            {id: 861, minWidth: 80, label: '成交卖出金额', field: 'trade_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 852, minWidth: 80, label: '成交卖出数量占比', field: 'trade_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 862, minWidth: 80, label: '成交卖出金额占比', field: 'trade_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 871, minWidth: 80, label: '净买入数量', field: 'net_buy_vol', align: 'right', format: '0'},
            {id: 881, minWidth: 80, label: '净买入金额', field: 'net_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 891, minWidth: 80, label: '委托买入数量', field: 'order_buy_vol', align: 'right', format: '0'},
            {id: 8101, minWidth: 80, label: '委托买入金额', field: 'order_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 892, minWidth: 80, label: '委托买入数量占比', field: 'order_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8102, minWidth: 80, label: '委托买入金额占比', field: 'order_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8111, minWidth: 80, label: '委托卖出数量', field: 'order_sell_vol', align: 'right', format: '0'},
            {id: 8121, minWidth: 80, label: '委托卖出金额', field: 'order_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 8112, minWidth: 80, label: '委托卖出数量占比', field: 'order_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8122, minWidth: 80, label: '委托卖出金额占比', field: 'order_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8141, minWidth: 80, label: '期初前持有数量', field: 'before_hold_vol', align: 'right', format: '0'},
            {id: 8142, minWidth: 80, label: '期初前持仓占比', field: 'before_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8151, minWidth: 80, label: '期初持有数量', field: 'before_hold_vol', align: 'right', format: '0'},
            {id: 8152, minWidth: 80, label: '期初持仓占比', field: 'before_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8161, minWidth: 80, label: '期末持有数量', field: 'end_hold_vol', align: 'right', format: '0'},
            {id: 8162, minWidth: 80, label: '期末持仓占比', field: 'end_hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8181, minWidth: 80, label: '持股单一天数', field: 'single_date_cnt', align: 'right'},
            {id: 8182, minWidth: 80, label: '持股单一超过80%', field: 'single_flag', align: 'left'},
            {id: 8202, minWidth: 80, label: '账户开户证件号', field: 'id_card', align: 'left'},
            {id: 8231, minWidth: 80, label: '会员名称', field: 'mem_name', align: 'left'},
            {id: 8232, minWidth: 80, label: '总成交买入数量', field: 'total_buy_vol', align: 'left', format: '0'},
            {id: 8233, minWidth: 80, label: '总成交买入金额', field: 'total_buy_amt', align: 'left', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 8234, minWidth: 80, label: '总成交卖出数量', field: 'total_sell_vol', align: 'left', format: '0'},
            {id: 8235, minWidth: 80, label: '总成交卖出金额', field: 'total_sell_amt', align: 'left', formatter: this.gfnElColFormatDec2, format: '0.00'}
          ],
          [
            {id: 810, minWidth: 80, label: '交易日期', field: 'trade_date', align: 'left'},
            {id: 811, minWidth: 80, label: '账户代码', field: 'acct_id', align: 'left'},
            {id: 820, minWidth: 80, label: '账户名称', field: 'acct_name', align: 'left'},
            {id: 8201, minWidth: 80, label: '期间会员个数', field: 'mem_cnt', align: 'left'},
            {id: 831, minWidth: 80, label: '成交买入数量', field: 'trade_buy_vol', align: 'right', format: '0'},
            {id: 841, minWidth: 80, label: '成交买入金额', field: 'trade_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 832, minWidth: 80, label: '成交买入数量占比', field: 'trade_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 842, minWidth: 80, label: '成交买入金额占比', field: 'trade_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 851, minWidth: 80, label: '成交卖出数量', field: 'trade_sell_vol', align: 'right', format: '0'},
            {id: 861, minWidth: 80, label: '成交卖出金额', field: 'trade_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 852, minWidth: 80, label: '成交卖出数量占比', field: 'trade_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 862, minWidth: 80, label: '成交卖出金额占比', field: 'trade_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 871, minWidth: 80, label: '净买入数量', field: 'net_buy_vol', align: 'right', format: '0'},
            {id: 881, minWidth: 80, label: '净买入金额', field: 'net_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 891, minWidth: 80, label: '委托买入数量', field: 'order_buy_vol', align: 'right', format: '0'},
            {id: 8101, minWidth: 80, label: '委托买入金额', field: 'order_buy_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 892, minWidth: 80, label: '委托买入数量占比', field: 'order_buy_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8102, minWidth: 80, label: '委托买入金额占比', field: 'order_buy_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8111, minWidth: 80, label: '委托卖出数量', field: 'order_sell_vol', align: 'right', format: '0'},
            {id: 8121, minWidth: 80, label: '委托卖出金额', field: 'order_sell_amt', align: 'right', formatter: this.gfnElColFormatDec2, format: '0.00'},
            {id: 8112, minWidth: 80, label: '委托卖出数量占比', field: 'order_sell_vol_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8122, minWidth: 80, label: '委托卖出金额占比', field: 'order_sell_amt_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8123, minWidth: 80, label: '当日持有数量', field: 'hold_vol', align: 'right', format: '0'},
            {id: 8124, minWidth: 80, label: '当日持仓占比', field: 'hold_ratio', align: 'right', formatter: this.gfnElColFormatDec5P, format: '0.00000'},
            {id: 8190, minWidth: 80, label: '持股单一账户', field: 'single_flag', align: 'left'},
            {id: 8202, minWidth: 80, label: '账户开户证件号', field: 'id_card', align: 'left'},
            {id: 8230, minWidth: 80, label: '会员名称', field: 'mem_name', align: 'left'}
          ]
        ],
        tableData: []
      }
    },
    computed: {
      markTableRender () {
        return this.$store.state.insiderTradAnalysis.markTableRender
      }
    },
    props: {
      drillingParams: {},
      dialogChartVisible: {},
      detailDialog: {}
    },
    watch: {
      tableSelectVal () { // 向父组件传递用户选中的记录的账户id供“账户证券持仓、交易查询”弹框中的账户id使用
        this.$emit('tableSelectVal', this.tableSelectVal)
      },
      markTableRender (newV, oldV) {
        this.judgeTableHeader(newV)
      },
      drillingParams: {
        handler () {
          if (this.detailDialog && this.dialogChartVisible) {
            this.queryDatas = this.drillingParams
            this.tableData = []
            this.pagination = {
              currentPage: 1,
              pageSizeNumber: 10
            }
            this.queryDetailDimension(1)
          }
        },
        deep: true
      }
    },
    mounted () {
      this.judgeTableHeader(this.markTableRender)
      this.queryDatas = this.drillingParams
      // 初始化查询
      this.queryDetailDimension(1)
    },
    methods: {
      gfnElColFormatDec5P (row, column, cellValue) {
        if (cellValue === null) return ''
        return Number(cellValue) === 0 ? 0 : this.gfnFormatDecimal(cellValue, 5)
      },
      handlePaginationChange (pagination) {
        this.pagination = pagination
        this.queryDetailDimension(0)
      },
      tableSelect (val) {
        let arr = []
        val.map(item => {
          arr.push(item.acct_id)
        })
        this.tableSelectVal = arr
      },
      drillingAccountSecurity (mark) {
        this.$store.commit('saveDrillingDetailSecurity', {dialog: true, type: mark})
      },
      judgeTableHeader (num) {
        this.columns = this.columnsList[num]
      },
      getAjaxData (context) {
        this.loading = true
        getDimensionInfo(context).then((resp) => {
          this.loading = false
          if (resp && resp.data) {
            this.columns = this.columnsList[this.markTableRender]
            this.currentngspUid = resp.ngsp_uid
            this.tableData = resp.data
            this.totalRowCount = Number(resp.totalRowCount)
          }
        })

        // setTimeout(()=>{
        //   this.loading = false
        //   this.tableData = [
        //     {
        //       'trade_date': '2009-11-10',
        //       'acct_id': 'A457355523',
        //       'pbu_id': '98757',
        //       'mem_code': 'CH8HNST77948',
        //       'branch_code': 'SHBJTSH-00685022',
        //
        //       'mem_name': '1镇膊腔透',
        //       'acct_name': '1镇膊腔透',
        //
        //       'trade_sell_amt_ratio': '.29408',
        //       'trade_sell_vol': 984.0,
        //       'trade_sell_vol_ratio': '4.48230',
        //       'net_buy_amt': '85.00',
        //       'trade_buy_amt_ratio': '2.72153',
        //       'order_buy_vol_ratio': '.95164',
        //       'net_buy_vol': 0.0,
        //       'order_buy_vol': 184.0,
        //       'ngsp_create_date': '2018-04-18 00:00:00',
        //       'order_sell_vol_ratio': '4.58613',
        //       'trade_acct_cnt': 0,
        //       'order_sell_amt': '1502.00',
        //       'order_buy_amt_ratio': '2.57024',
        //       'branch_code': 'SHGDTGD-00129165',
        //       'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
        //       'trade_buy_amt': '1590.00',
        //       'trade_sell_amt': '1505.00',
        //       'order_sell_vol': 984.0,
        //       'trade_buy_vol_ratio': '8.10477',
        //       'order_sell_amt_ratio': '.25002',
        //       'mem_branch_name': '江门台山桥湖路证券营业部',
        //       'order_buy_amt': '3156.00',
        //       'trade_buy_vol': 984.0
        //     },
        //     {
        //       'trade_date': '2009-11-11',
        //       'acct_id': 'A002452185',
        //       'pbu_id': '98757',
        //       'mem_code': '2CH1JSST77822',
        //       'mem_name': '2镇膊腔透',
        //       'acct_name': '2镇膊腔透',
        //       'trade_sell_amt_ratio': '82.69001',
        //       'trade_sell_vol': 13697.0,
        //       'trade_sell_vol_ratio': '62.39238',
        //       'net_buy_amt': '-404376.00',
        //       'trade_buy_amt_ratio': '32.18767',
        //       'order_buy_vol_ratio': '51.60590',
        //       'net_buy_vol': -3719.0,
        //       'order_buy_vol': 9978.0,
        //       'ngsp_create_date': '2018-04-18 00:00:00',
        //       'order_sell_vol_ratio': '79.21793',
        //       'trade_acct_cnt': 0,
        //       'order_sell_amt': '459491.00',
        //       'order_buy_amt_ratio': '15.31558',
        //       'branch_code': 'SHSZTTJ-00700048',
        //       'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
        //       'trade_buy_amt': '18805.00',
        //       'trade_sell_amt': '423181.00',
        //       'order_sell_vol': 16997.0,
        //       'trade_buy_vol_ratio': '82.18433',
        //       'order_sell_amt_ratio': '76.48584',
        //       'mem_branch_name': '天津尖山路证券营业部',
        //       'order_buy_amt': '18806.00',
        //       'trade_buy_vol': 9978.0
        //     },
        //     {
        //       'trade_date': '2009-11-11',
        //       'acct_id': 'A002452185',
        //       'pbu_id': '98757',
        //       'mem_code': '2CH1JSST77822',
        //       'mem_name': '2镇膊腔透',
        //       'acct_name': '2镇膊腔透',
        //       'trade_sell_amt_ratio': '82.69001',
        //       'trade_sell_vol': 13697.0,
        //       'trade_sell_vol_ratio': '62.39238',
        //       'net_buy_amt': '-404376.00',
        //       'trade_buy_amt_ratio': '32.18767',
        //       'order_buy_vol_ratio': '51.60590',
        //       'net_buy_vol': -3719.0,
        //       'order_buy_vol': 9978.0,
        //       'ngsp_create_date': '2018-04-18 00:00:00',
        //       'order_sell_vol_ratio': '79.21793',
        //       'trade_acct_cnt': 0,
        //       'order_sell_amt': '459491.00',
        //       'order_buy_amt_ratio': '15.31558',
        //       'branch_code': 'SHSZTTJ-00700048',
        //       'ngsp_uid': '1c6da2e3-f38c-4121-a871-be686b7a4c8c         ',
        //       'trade_buy_amt': '18805.00',
        //       'trade_sell_amt': '423181.00',
        //       'order_sell_vol': 16997.0,
        //       'trade_buy_vol_ratio': '82.18433',
        //       'order_sell_amt_ratio': '76.48584',
        //       'mem_branch_name': '天津尖山路证券营业部',
        //       'order_buy_amt': '18806.00',
        //       'trade_buy_vol': 9978.0
        //     }
        //   ]
        // },2000)
      },
      queryDetailDimension (type) {
        let context = JSON.parse(JSON.stringify(this.queryDatas))
        delete context.ASH
        delete context.chartsType
        delete context.markTableRender
        context.pageRows = this.pagination.currentPage
        context.pageIndex = this.pagination.pageSizeNumber
        context.isExport = 0
        context.isNewQuery = type ? 1 : 0
        context.ngspUid = type ? '' : this.currentngspUid
        this.getAjaxData(context)
      },
      handleDownload (type) {
        if (!this.currentngspUid) {
          this.$message.error('暂无数据可以导出')
          return
        }
        let params = Object.assign({}, this.drillingParams)
        delete params.ASH
        delete params.chartsType
        delete params.markTableRender
        params.isExport = 1
        params.isNewQuery = 0
        params.ngspUid = this.currentngspUid
        params.tableColumns = this.columns
        params.pageRows = this.pageRows
        params.pageIndex = this.pageIndex
        params.exportType = type
        this.gfnExportFileWithForm('/complexqry/dimension/v1/dimensioninfo/export', params)
      }
    }
  }
</script>

<style lang='less'>
  .dimension-query-table-overflow {
    .el-table {
      .el-table__header-wrapper {
        overflow: visible;
      }
    }
  }
</style>
