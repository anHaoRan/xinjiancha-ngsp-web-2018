import Vue from 'vue'

export const tableColumns = [
  {
    label: '除该账户的撮合量',
    field: 'trd_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trd_vol'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: '除该账户的撮合价',
    field: 'trd_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trd_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '该委托前一秒的撮合量',
    field: 'last_second_trd_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'last_second_trd_vol'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: '该委托前一秒的撮合价格',
    field: 'last_second_trd_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'last_second_trd_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '该委托后一秒的撮合量',
    field: 'next_second_trd_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'next_second_trd_vol'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: '该委托后一秒的撮合价',
    field: 'next_second_trd_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'next_second_trd_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '该笔委托撤单前的撮合量',
    field: 'before_cancel_trd_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'before_cancel_trd_vol'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: '该笔委托撤单前的撮合价',
    field: 'before_cancel_trd_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'before_cancel_trd_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '该笔委托撤单后的撮合量',
    field: 'after_cancel_trd_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'after_cancel_trd_vol'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: '该笔委托撤单后的撮合价',
    field: 'after_cancel_trd_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'after_cancel_trd_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  }
]