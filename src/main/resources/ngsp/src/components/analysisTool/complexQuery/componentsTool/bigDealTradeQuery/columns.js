import Vue from 'vue'
import {complexQueryDec0, complexQueryDec2, complexQueryDec3} from '../common/sortMethods'

export const columns = [
  {
    label: '交易日期',
    field: 'trade_date',
    minWidth: '6.25%',
    align: 'left',
    sortable: true
  },
  {
    label: '成交编号',
    field: 'trade_no',
    minWidth: '6.25%',
    align: 'left',
    sortable: true,
    format: '0'
  },
  {
    label: '证券代码',
    field: 'sec_code',
    minWidth: '6.25%',
    align: 'left',
    sortable: true
  },
  {
    label: '证券简称',
    field: 'sec_name',
    minWidth: '6.25%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'sec_name')
  },
  {
    label: '买方股东账户',
    field: 'buy_acct_id',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'buy_acct_id')
  },
  {
    label: '买方股东名称',
    field: 'buy_acct_name',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'buy_acct_name')
  },
  {
    label: '买方会员营业部',
    field: 'buy_mem_branch_name',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'buy_mem_branch_name')
  },
  {
    label: '卖方股东账户',
    field: 'sell_acct_id',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'sell_acct_id')
  },
  {
    label: '卖方股东名称',
    field: 'sell_acct_name',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'sell_acct_name')
  },
  {
    label: '卖方会员营业部',
    field: 'sell_mem_branch_name',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'sell_mem_branch_name')
  },
  {
    label: '成交价格',
    field: 'trade_price',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '成交数量',
    field: 'trade_vol',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '成交金额',
    field: 'trade_amt',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    formatter: complexQueryDec2,
    format: '#,##0.00'
  }
]
