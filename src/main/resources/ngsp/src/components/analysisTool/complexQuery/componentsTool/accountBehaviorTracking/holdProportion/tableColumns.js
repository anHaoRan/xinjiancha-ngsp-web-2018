import Vue from 'vue'

export const tableColumns = [
  {
    label: '账户代码',
    field: 'acct_id',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'acct_id')
  },
  {
    label: '账户名称',
    field: 'acct_name',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name')
  },
  {
    label: '交易日',
    field: 'trade_date',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_date')
  },
  {
    label: '股票代码',
    field: 'sec_code',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
  },
  {
    label: '股票名称',
    field: 'sec_name',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
  },
  {
    label: '账户持有股票市值总额',
    field: 'value_all',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'value_all'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '账户持有这个股票的市值',
    field: 'value_one',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'value_one'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '账户持有该股票占比其所持股票的市值(%)',
    field: 'prop',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'prop'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '营业部名称',
    field: 'branch_name',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name')
  }
]
