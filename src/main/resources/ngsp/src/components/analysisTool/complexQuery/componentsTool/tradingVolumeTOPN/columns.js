import Vue from 'vue'
import {complexQueryDec0, complexQueryDec3, complexQueryDec7} from '../common/sortMethods'

export const columns = [ // 定义列
  {
    label: '证券代码',
    field: 'sec_code',
    minWidth: '6.25%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'sec_code')
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
    label: '交易日期',
    field: 'trade_date',
    minWidth: '6.25%',
    align: 'left',
    sortable: true
  },
  {
    label: '序号',
    field: 'rank_index',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'rank_index')
  },
  {
    label: '买入股东账户',
    field: 'buy_acct_id',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'buy_acct_id')
  },
  {
    label: '买入股东姓名',
    field: 'buy_acct_name',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'buy_acct_name')
  },
  {
    label: '买入会员营业部',
    field: 'buy_mem_branch',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'buy_mem_branch')
  },
  {
    label: '买入均价',
    field: 'buy_price',
    minWidth: '7%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'buy_price'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '买入数量',
    field: 'buy_vol',
    minWidth: '7%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'buy_vol'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '买入金额',
    field: 'buy_amt',
    minWidth: '7%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'buy_amt'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '卖出股东账户',
    field: 'sell_acct_id',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'sell_acct_id')
  },
  {
    label: '卖出股东姓名',
    field: 'sell_acct_name',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'sell_acct_name')
  },
  {
    label: '卖出会员营业部',
    field: 'sell_mem_branch',
    minWidth: '7%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'sell_mem_branch')
  },
  {
    label: '卖出均价',
    field: 'sell_price',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'sell_price'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '卖出数量',
    field: 'sell_vol',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'sell_vol'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '卖出金额',
    field: 'sell_amt',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'sell_amt'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  }
]
