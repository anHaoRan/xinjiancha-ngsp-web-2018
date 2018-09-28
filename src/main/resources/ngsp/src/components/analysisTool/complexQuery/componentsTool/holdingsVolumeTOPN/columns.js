import Vue from 'vue'
import {complexQueryDec0, complexQueryDec3} from '../common/sortMethods'

export const columns = [ // 定义列
  {
    label: '交易日期',
    field: 'trade_date',
    minWidth: '6.25%',
    align: 'left',
    sortable: true
  },
  {
    label: '股东代码',
    field: 'acct_id',
    minWidth: '6.25%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'acct_id')
  },
  {
    label: '股东简称',
    field: 'acct_name',
    minWidth: '6.25%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'acct_name')
  },
  {
    label: '账户一码通',
    field: 'ccrc_acct_id',
    minWidth: '6.25%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'ccrc_acct_id')
  },
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
    label: '非限售股持有量',
    field: 'nego_hold_bal',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'nego_hold_bal'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '限售股持有量',
    field: 'nonnego_hold_bal',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'nonnego_hold_bal'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '总持股数量',
    field: 'hold_bal',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'hold_bal'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '非限售股持有数量占流通股比例(%)',
    field: 'nego_hold_ratio',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'nego_hold_ratio'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '总持股数量占总股本比例(%)',
    field: 'tot_hold_ratio',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'tot_hold_ratio'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '流通股持有量排名',
    field: 'top_n_nego',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'top_n_nego')
  },
  {
    label: '总持股持有量排名',
    field: 'top_n',
    minWidth: '6.25%',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(this, 'top_n')
  },
  {
    label: '证件号码',
    field: 'id_card',
    minWidth: '6.25%',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(this, 'id_card')
  }
]
