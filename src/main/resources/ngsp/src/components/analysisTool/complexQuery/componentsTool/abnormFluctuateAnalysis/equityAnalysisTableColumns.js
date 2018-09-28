import Vue from 'vue'
import {complexQueryDec0, complexQueryDec3} from '../common/sortMethods'

export const tableColumns = [
  {
    label: '股票代码',
    field: 'sec_code',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
  },
  {
    label: '交易日期',
    field: 'trade_date',
    minWidth: '80px',
    align: 'left',
    sortable: true
  },
  {
    label: '收盘价',
    field: 'close_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'close_price'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '成交量',
    field: 'trade_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_vol'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '持股集中度',
    field: 'hold_muster',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'hold_muster'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '持股集中度1',
    field: 'hold_muster1',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'hold_muster1'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '超过平均持有量的账户持股比例(%)',
    field: 'above_avg_bal_ratio',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'above_avg_bal_ratio'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '超过平均持有量的账户数比例(%)',
    field: 'above_avg_cnt_ratio',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'above_avg_cnt_ratio'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '流通股本',
    field: 'nego_capital',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'nego_capital'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '持有账户数',
    field: 'total_hold_cnt',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'total_hold_cnt'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '平均持有量',
    field: 'avg_hold_bal',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_hold_bal'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '超过平均持有量的账户持股数',
    field: 'above_avg_hold_bal',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'above_avg_hold_bal'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '超过平均持有量的账户数',
    field: 'above_avg_hold_cnt',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'above_avg_hold_cnt'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '成交金额',
    field: 'trade_amt',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_amt'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  },
  {
    label: '成交笔数',
    field: 'trade_cnt',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_cnt'),
    formatter: complexQueryDec0,
    format: '#,##0'
  },
  {
    label: '基尼系数',
    field: 'gini_coeff',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'gini_coeff'),
    formatter: complexQueryDec3,
    format: '#,##0.000'
  }
]
