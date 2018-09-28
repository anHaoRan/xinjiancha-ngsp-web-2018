<!--先进先出/后进先出 -->
<template>
    <div class="profit-fifo-lifo">
        <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
        <tab-table-pagination-component
                :loading="loading"
                :tabPanes="tabList"
                :paginations="paginations"
                :tableDatas='tableDatas'
                :tableColumns='columns'
                @handlePaginationChange='handlePaginationChange'
                @updateActiveName='updateActiveName'
        >
            <template slot="0">
                <transaction-detail-and-cost
                        :pagination="paginations[0]"
                        :tableColumn="columns[0]"
                        @getTableData="getTabOneTableData"
                        @changeLoad="changeLoad"
                        ref="tab0"/>
            </template>
            <template slot="1">
                <output-record-data-table
                        :pagination="paginations[1]"
                        :tableColumn="columns[1]"
                        ref="tab1"
                        @getTableData="getTabTwoTableData"
                        @changeLoad="changeLoad"/>
            </template>
            <template slot="2">
                <output-profit-static
                        :pagination="paginations[2]"
                        :tableColumn="columns[2]"
                        @getTableData="getTabThreeTableData"
                        @changeLoad="changeLoad"
                        ref="tab2"/>
            </template>
            <template slot="3">
                <high-transfer-detail
                        :pagination="paginations[3]"
                        :tableColumn="columns[3]"
                        @getTableData="getTabFourTableData"
                        @changeLoad="changeLoad"
                        ref="tab3"/>
            </template>
        </tab-table-pagination-component>
    </div>
</template>

<script>

  export default {
    components: {
      Breadcrumb: () => import('../../common/Breadcrumb'),
      textUpload: () => import('../../common/textUpload'),
      TabTablePaginationComponent: () => import('./componentsTool/common/tabTablePaginationComponent'),
      transactionDetailAndCost: () => import('./componentsTool/profitFIFOLIFO/transactionDetailAndCost'), // 输出成交明细和费用
      OutputRecordDataTable: () => import('./componentsTool/profitFIFOLIFO/outputRecordDataTable'), // 输出买卖记录对应数据表
      OutputProfitStatic: () => import('./componentsTool/profitFIFOLIFO/outputProfitStatic'), // 输出买卖记录对应数据表
      HighTransferDetail: () => import('./componentsTool/profitFIFOLIFO/highTransferDetail'), // 输出买卖记录对应数据表
    },
    data () {
      let paginations = []
      for (let i = 0; i < 4; i++) {
        paginations.push({
          currentPage: 1,
          pageSizeNumber: 10
        })
      }
      return {
        activeName: '0',
        loading: false,
        tabList: [
          {label: '输出成交明细和费用', slotType: 'prepend', slotName: '0'},
          {label: '输出买卖记录对应数据表', slotType: 'prepend', slotName: '1'},
          {label: '输出盈利统计表', slotType: 'prepend', slotName: '2'},
          {label: '输出高送转明细', slotType: 'prepend', slotName: '3'}
        ],
        paginations: paginations,
        tableDatas: {
          tab1: {
            data: [],
            totalRowCount: 0,
          },
          tab2: {
            data: [],
            totalRowCount: 0,
          },
          tab3: {
            data: [],
            totalRowCount: 0,
          },
          tab4: {
            data: [],
            totalRowCount: 0,
          }
        },
        columns: [
          [
            {id: '1', minWidth: '100px', label: '股东账户', field: 'acct_id', align: 'left', sortable: false},
            {id: '2', minWidth: '100px', label: '证券代码', field: 'sec_code', align: 'left', sortable: false},
            {id: '3', minWidth: '100px', label: '交易日期', field: 'trade_date', align: 'left', sortable: false},
            {id: '4', minWidth: '100px', label: '成交时间', field: 'trade_time', align: 'left', sortable: false},
            {id: '5', minWidth: '100px', label: '成交编号', field: 'trade_no', align: 'left', sortable: false},
            {id: '6', minWidth: '100px', label: '成交价格（单位:元）', field: 'trade_price', align: 'right', sortable: false},
            {id: '7', minWidth: '100px', label: '成交金额（单位:元）', field: 'trade_amt', align: 'right', sortable: false},
            {id: '8', minWidth: '100px', label: '成交量', field: 'trade_vol', align: 'left', sortable: false},
            {id: '9', minWidth: '100px', label: '席位', field: 'pbu_id', align: 'left', sortable: false},
            {id: '10', minWidth: '100px', label: '申报编码', field: 'order_no', align: 'left', sortable: false},
            {id: '11', minWidth: '100px', label: '申报时间', field: 'order_time', align: 'left', sortable: false},
            {id: '12', minWidth: '100px', label: '成交方向', field: 'trade_dir', align: 'left', sortable: false},
            {id: '13', minWidth: '100px', label: '印花税（单位:元）', field: 'stamp_tax', align: 'right', sortable: false},
            {id: '14', minWidth: '100px', label: '过户费（单位:元）', field: 'transfer_fee', align: 'right', sortable: false},
            {id: '15', minWidth: '100px', label: '交易佣金估算（单位:元）', field: 'comm_amt_1', align: 'right', sortable: false},
            {id: '16', minWidth: '100px', label: '实际交易佣金', field: 'comm_amt_2', align: 'right', sortable: false}
          ],
          [
            {id: '1', minWidth: '140px', label: '账户代码', field: 'acct_id', align: 'left', sortable: false},
            {id: '2', minWidth: '120px', label: '证券代码', field: 'sec_code', align: 'left', sortable: false},
            {id: '3', minWidth: '120px', label: '交易日期', field: 'trade_date', align: 'left', sortable: false},
            {id: '4', minWidth: '100px', label: '买方成交编号', field: 'trade_no', align: 'left', sortable: false},
            {id: '5', minWidth: '100px', label: '买入价格', field: 'buy_price', align: 'right', sortable: false},
            {id: '6', minWidth: '100px', label: '买入金额', field: 'buy_amt', align: 'right', sortable: false},
            {id: '7', minWidth: '100px', label: '买入量', field: 'buy_vol', align: 'right', sortable: false},
            {id: '8', minWidth: '100px', label: '买方印花税', field: 'b_stamp_tax_amt', align: 'right', sortable: false},
            {id: '9', minWidth: '100px', label: '买方过户费', field: 'b_trans_fee_amt', align: 'right', sortable: false},
            {id: '10', minWidth: '100px', label: '买方交易佣金估算', field: 'b_commision_amt', align: 'right', sortable: false},
            {id: '11', minWidth: '100px', label: '买方交易实际佣金', field: 'b_real_comm_amt', align: 'right', sortable: false},
            {id: '12', minWidth: '100px', label: '对应该笔成交的卖出价格', field: 'sell_price', align: 'right', sortable: false},
            {id: '13', minWidth: '100px', label: '对应该笔成交的卖出金额', field: 'sell_amt', align: 'right', sortable: false},
            {id: '14', minWidth: '100px', label: '对应该笔成交的卖出量', field: 'sell_vol', align: 'right', sortable: false},
            {id: '15', minWidth: '100px', label: '对应该笔成交卖方印花税', field: 's_stamp_tax_amt', align: 'right', sortable: false},
            {id: '16', minWidth: '100px', label: '对应该笔成交卖方过户费', field: 's_trans_fee_amt', align: 'right', sortable: false},
            {id: '17', minWidth: '100px', label: '对应该笔成交卖方交易佣金估算', field: 's_commision_amt', align: 'right', sortable: false},
            {id: '18', minWidth: '100px', label: '对应该笔成交卖方交易实际佣金', field: 's_real_comm_amt', align: 'right', sortable: false},
            {id: '19', minWidth: '100px', label: '匹配状态', field: 'match_flag', align: 'left', sortable: false}
          ],
          [
            {id: '1', minWidth: '120px', label: '股东账户', field: 'acct_id', align: 'left', sortable: false},
            {id: '2', minWidth: '120px', label: '证券代码', field: 'sec_code', align: 'left', sortable: false},
            {id: '3', minWidth: '120px', label: '先进先出法确认的买入均价', field: 'buy_price', align: 'right', sortable: false},
            {id: '4', minWidth: '100px', label: '先进先出法确认的买入金额', field: 'sum_buy_amt', align: 'right', sortable: false},
            {id: '5', minWidth: '100px', label: '先进先出法确认的买入数量', field: 'sum_buy_vol', align: 'right', sortable: false},
            {id: '6', minWidth: '100px', label: '确认的相应的卖出价格', field: 'sell_price', align: 'right', sortable: false},
            {id: '7', minWidth: '100px', label: '确认的相应的卖出金额', field: 'sum_sell_amt', align: 'right', sortable: false},
            {id: '8', minWidth: '100px', label: '确认的相应的卖出数量', field: 'sum_sell_vol', align: 'right', sortable: false},
            {id: '9', minWidth: '100px', label: '印花税', field: 'stamp_tax_amt', align: 'right', sortable: false},
            {id: '10', minWidth: '100px', label: '过户费', field: 'trans_fee_amt', align: 'right', sortable: false},
            {id: '11', minWidth: '100px', label: '交易佣金估算', field: 'commision_amt', align: 'right', sortable: false},
            {id: '12', minWidth: '100px', label: '实际交易佣金', field: 'real_comm_amt', align: 'right', sortable: false},
            {id: '13', minWidth: '100px', label: '先进先出法违法所得（按估算佣金）', field: 'commision_wfsd', align: 'right', sortable: false},
            {id: '14', minWidth: '100px', label: '先进先出法违法所得（按实际佣金）', field: 'real_wfsd', align: 'right', sortable: false}
          ],
          [
            {id: '1', minWidth: '120px', label: '证券代码', field: 'sec_code', align: 'left', sortable: false},
            {id: '2', minWidth: '120px', label: '股权登记日', field: 'share_reg_date', align: 'left', sortable: false},
            {id: '3', minWidth: '120px', label: '上市流通日', field: 'issue_list_date', align: 'left', sortable: false},
            {id: '4', minWidth: '120px', label: '送股比例（10送）', field: 'share_ratio', align: 'left', sortable: false},
            {id: '5', minWidth: '120px', label: '配股比例（10配）', field: 'issue_ratio', align: 'left', sortable: false},
            {id: '6', minWidth: '120px', label: '配股价格', field: 'issue_price', align: 'left', sortable: false}
          ]
        ],
        tabTwoColumnsOption: [
          [
            {id: '1', minWidth: '120px', label: '账户代码', field: 'acct_id', align: 'left', sortable: false},
            {id: '2', minWidth: '120px', label: '证券代码', field: 'sec_code', align: 'left', sortable: false},
            {id: '3', minWidth: '120px', label: '交易日期', field: 'trade_date', align: 'left', sortable: false},
            {id: '4', minWidth: '100px', label: '买方成交编号', field: 'trade_no', align: 'left', sortable: false},
            {id: '5', minWidth: '100px', label: '买入价格', field: 'buy_price', align: 'right', sortable: false},
            {id: '6', minWidth: '100px', label: '买入金额', field: 'buy_amt', align: 'right', sortable: false},
            {id: '7', minWidth: '100px', label: '买入量', field: 'buy_vol', align: 'right', sortable: false},
            {id: '8', minWidth: '100px', label: '买方印花税', field: 'b_stamp_tax_amt', align: 'right', sortable: false},
            {id: '9', minWidth: '100px', label: '买方过户费', field: 'b_trans_fee_amt', align: 'right', sortable: false},
            {id: '10', minWidth: '100px', label: '买方交易佣金估算', field: 'b_commision_amt', align: 'right', sortable: false},
            {id: '11', minWidth: '100px', label: '买方交易实际佣金', field: 'b_real_comm_amt', align: 'right', sortable: false},
            {id: '12', minWidth: '100px', label: '对应该笔成交的卖出价格', field: 'sell_price', align: 'right', sortable: false},
            {id: '13', minWidth: '100px', label: '对应该笔成交的卖出金额', field: 'sell_amt', align: 'right', sortable: false},
            {id: '14', minWidth: '100px', label: '对应该笔成交的卖出量', field: 'sell_vol', align: 'right', sortable: false},
            {id: '15', minWidth: '100px', label: '对应该笔成交卖方印花税', field: 's_stamp_tax_amt', align: 'right', sortable: false},
            {id: '16', minWidth: '100px', label: '对应该笔成交卖方过户费', field: 's_trans_fee_amt', align: 'right', sortable: false},
            {id: '17', minWidth: '100px', label: '对应该笔成交卖方交易佣金估算', field: 's_commision_amt', align: 'right', sortable: false},
            {id: '18', minWidth: '100px', label: '对应该笔成交卖方交易实际佣金', field: 's_real_comm_amt', align: 'right', sortable: false},
            {id: '19', minWidth: '100px', label: '匹配状态', field: 'match_flag', align: 'left', sortable: false}
          ],
          [
            {id: '1', minWidth: '100px', label: '账户代码', field: 'acct_id', align: 'left', sortable: false},
            {id: '2', minWidth: '100px', label: '证券代码', field: 'sec_code', align: 'left', sortable: false},
            {id: '3', minWidth: '100px', label: '交易日期', field: 'trade_date', align: 'left', sortable: false},
            {id: '4', minWidth: '100px', label: '卖方成交编号', field: 'trade_no', align: 'left', sortable: false},
            {id: '5', minWidth: '100px', label: '卖出价格', field: 'sell_price', align: 'right', sortable: false},
            {id: '6', minWidth: '100px', label: '卖出金额', field: 'sell_amt', align: 'right', sortable: false},
            {id: '7', minWidth: '100px', label: '卖出量', field: 'sell_vol', align: 'right', sortable: false},
            {id: '8', minWidth: '100px', label: '卖方印花税', field: 's_stamp_tax_amt', align: 'right', sortable: false},
            {id: '9', minWidth: '100px', label: '卖方过户费', field: 's_trans_fee_amt', align: 'right', sortable: false},
            {id: '10', minWidth: '100px', label: '卖方交易佣金估算', field: 's_commision_amt', align: 'right', sortable: false},
            {id: '11', minWidth: '100px', label: '卖方交易实际佣金', field: 's_real_comm_amt', align: 'right', sortable: false},
            {id: '12', minWidth: '100px', label: '对应该笔成交的买出价格', field: 'buy_price', align: 'right', sortable: false},
            {id: '13', minWidth: '100px', label: '对应该笔成交的买出金额', field: 'buy_amt', align: 'right', sortable: false},
            {id: '14', minWidth: '100px', label: '对应该笔成交的买出量', field: 'buy_vol', align: 'right', sortable: false},
            {id: '15', minWidth: '100px', label: '对应该笔成交买方印花税', field: 'b_stamp_tax_amt', align: 'right', sortable: false},
            {id: '16', minWidth: '100px', label: '对应该笔成交买方过户费', field: 'b_trans_fee_amt', align: 'right', sortable: false},
            {id: '17', minWidth: '100px', label: '对应该笔成交买方交易佣金估算', field: 'b_commision_amt', align: 'right', sortable: false},
            {id: '18', minWidth: '100px', label: '对应该笔成交买方交易实际佣金', field: 'b_real_comm_amt', align: 'right', sortable: false},
            {id: '19', minWidth: '100px', label: '匹配状态', field: 'match_flag', align: 'left', sortable: false}
          ]
        ],
        tabThreeColumnsOption: [
          [
            {id: '1', minWidth: '120px', label: '股东账户', field: 'acct_id', align: 'left', sortable: false},
            {id: '2', minWidth: '120px', label: '证券代码', field: 'sec_code', align: 'left', sortable: false},
            {id: '3', minWidth: '120px', label: '先进先出法确认的买入均价', field: 'buy_price', align: 'left', sortable: false},
            {id: '4', minWidth: '100px', label: '先进先出法确认的买入金额', field: 'sum_buy_amt', align: 'left', sortable: false},
            {id: '5', minWidth: '100px', label: '先进先出法确认的买入数量', field: 'sum_buy_vol', align: 'right', sortable: false},
            {id: '6', minWidth: '100px', label: '确认的相应的卖出价格', field: 'sell_price', align: 'right', sortable: false},
            {id: '7', minWidth: '100px', label: '确认的相应的卖出金额', field: 'sum_sell_amt', align: 'right', sortable: false},
            {id: '8', minWidth: '100px', label: '确认的相应的卖出数量', field: 'sum_sell_vol', align: 'right', sortable: false},
            {id: '9', minWidth: '100px', label: '印花税', field: 'stamp_tax_amt', align: 'right', sortable: false},
            {id: '10', minWidth: '100px', label: '过户费', field: 'trans_fee_amt', align: 'right', sortable: false},
            {id: '11', minWidth: '100px', label: '交易佣金估算', field: 'commision_amt', align: 'right', sortable: false},
            {id: '12', minWidth: '100px', label: '实际交易佣金', field: 'real_comm_amt', align: 'right', sortable: false},
            {id: '13', minWidth: '100px', label: '先进先出法违法所得（按估算佣金）', field: 'commision_wfsd', align: 'right', sortable: false},
            {id: '14', minWidth: '100px', label: '先进先出法违法所得（按实际佣金）', field: 'real_wfsd', align: 'right', sortable: false}
          ],
          [
            {id: '1', minWidth: '100px', label: '股东账户', field: 'acct_id', align: 'left', sortable: false},
            {id: '2', minWidth: '100px', label: '证券代码', field: 'sec_code', align: 'left', sortable: false},
            {id: '3', minWidth: '100px', label: '后进先出法确认的卖出均价', field: 'sell_price', align: 'left', sortable: false},
            {id: '4', minWidth: '100px', label: '后进先出法确认的卖出金额', field: 'sum_sell_amt', align: 'left', sortable: false},
            {id: '5', minWidth: '100px', label: '后进先出法确认的卖出数量', field: 'sum_sell_vol', align: 'right', sortable: false},
            {id: '6', minWidth: '100px', label: '确认的相应的买入价格', field: 'buy_price', align: 'right', sortable: false},
            {id: '7', minWidth: '100px', label: '确认的相应的买入金额', field: 'sum_buy_amt', align: 'right', sortable: false},
            {id: '8', minWidth: '100px', label: '确认的相应的买入数量', field: 'sum_buy_vol', align: 'right', sortable: false},
            {id: '9', minWidth: '100px', label: '印花税', field: 'stamp_tax_amt', align: 'right', sortable: false},
            {id: '10', minWidth: '100px', label: '过户费', field: 'trans_fee_amt', align: 'right', sortable: false},
            {id: '11', minWidth: '100px', label: '交易佣金估算', field: 'commision_amt', align: 'right', sortable: false},
            {id: '12', minWidth: '100px', label: '实际交易佣金', field: 'real_comm_amt', align: 'right', sortable: false},
            {id: '13', minWidth: '100px', label: '后进先出法违法所得（按估算佣金）', field: 'commision_wfsd', align: 'right', sortable: false},
            {id: '14', minWidth: '100px', label: '后进先出法违法所得（按实际佣金）', field: 'real_wfsd', align: 'right', sortable: false}
          ]
        ],
        breadcrumbItems: [
          {
            router: '',
            label: '分析工具'
          }, {
            router: '',
            label: '数据综合查询'
          }, {
            router: '/profitFIFOLIFO',
            label: '先进先出/后进先出'
          }
        ]
      }
    },
    methods: {
      handlePaginationChange (paginations) {
        // console.log(JSON.stringify(paginations))
        // this.paginations[this.activeName] = paginations
        let currentPage = this.paginations[this.activeName]
        this.$refs[`tab${this.activeName}`].getPaginationData(currentPage)
      },
      updateActiveName (activeName) {
        this.activeName = activeName
      },
      getTabOneTableData (data, totalRow) {
        this.tableDatas.tab1.data = data
        this.tableDatas.tab1.totalRowCount = totalRow - 0
      },
      getTabTwoTableData (data, totalRow, calculType) {
        switch (calculType) {
          case '1' :
            this.columns[1] = this.tabTwoColumnsOption[0]
            break
          case '2' :
            this.columns[1] = this.tabTwoColumnsOption[1]
            break
        }
        this.tableDatas.tab2.data = data
        this.tableDatas.tab2.totalRowCount = totalRow - 0
      },
      getTabThreeTableData (data, totalRow, calculType) {
        switch (calculType) {
          case '1' :
            this.columns[2] = this.tabThreeColumnsOption[0]
            break
          case '2' :
            this.columns[2] = this.tabThreeColumnsOption[1]
            break
        }
        this.tableDatas.tab3.data = data
        this.tableDatas.tab3.totalRowCount = totalRow - 0
      },
      getTabFourTableData (data, totalRow) {
        this.tableDatas.tab4.data = data
        this.tableDatas.tab4.totalRowCount = totalRow - 0
      },
      changeLoad (val) {
        this.loading = val
      }
    }
  }
</script>

<style lang='less' scoped>
</style>
