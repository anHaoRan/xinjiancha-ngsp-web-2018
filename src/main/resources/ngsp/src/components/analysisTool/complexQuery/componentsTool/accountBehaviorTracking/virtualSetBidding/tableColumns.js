import Vue from 'vue'

export const tableColumns = [
  {
    label: '时间',
    field: 'trade_time',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_time')
  },
  {
    label: '虚拟撮合成交量',
    field: 'trd_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trd_vol'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: '虚拟撮合价格',
    field: 'trd_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trd_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '与虚拟撮合价的最近两个价格的偏差',
    field: 'price_diff',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'price_diff'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  }
]
