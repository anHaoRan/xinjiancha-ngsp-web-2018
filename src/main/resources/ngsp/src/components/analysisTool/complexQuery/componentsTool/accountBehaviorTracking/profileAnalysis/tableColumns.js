import Vue from 'vue'

function childColFormatDecInt(row, column, cellValue) {
  if (cellValue === null) {
    return ''
  }
  return Number(cellValue) == 0 ? 0 : Vue.prototype.gfnFormatDecThou(cellValue, 0)
}

function childColFormatDec3(row, column, cellValue) { // 千分位 2位小数
  if (cellValue === null) {
    return ''
  }
  return Number(cellValue) == 0 ? '0.000' : Vue.prototype.gfnFormatDecThou(cellValue, 3)
}

export const tableColumns = [
  {
    label: '交易日',
    field: 'entry_date',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'entry_date')
  },
  {
    label: '订单编号',
    field: 'order_no',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_no'),
    format: '0'
  },
  {
    label: '股票代码',
    field: 'sec_code',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
  },
  {
    label: '股票名称',
    field: 'sec_name',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
  },
  {
    label: '订单时间',
    field: 'order_time',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_time')
  },
  {
    label: '申报后订单所在档位',
    field: 'aft_order_dang_wei',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_dang_wei')
  },
  {
    label: '申报后相同价格剩余委托量',
    field: 'aft_order_order_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_order_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '订单数量',
    field: 'order_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '撤单前所在档位',
    field: 'withdraw_dang_wei',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_dang_wei')
  },
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
    label: '撤单时间',
    field: 'withdraw_time',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_time')
  },
  {
    label: '买卖方向',
    field: 'trade_dir',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_dir')
  },
  {
    label: '申报后买一价',
    field: 'aft_order_b1_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_b1_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '申报后买一量',
    field: 'aft_order_b1_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'gini_coeff'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '申报后买前五累计量',
    field: 'aft_order_b1to5_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_b1to5_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '申报后买前五加权平均价',
    field: 'aft_order_b1to5_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_b1to5_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '申报后买前十累计量',
    field: 'aft_order_b1to10_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_b1to10_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '申报后买前十加权平均价',
    field: 'aft_order_b1to10_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_b1to10_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '申报后买五价',
    field: 'aft_order_b5_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_b5_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '申报后买五量',
    field: 'aft_order_b5_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_b5_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '申报后卖一价',
    field: 'aft_order_s1_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_s1_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '申报后卖一量',
    field: 'aft_order_s1_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_s1_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '申报后卖前五量',
    field: 'aft_order_s1to5_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_s1to5_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '申报后卖前五加权平均价',
    field: 'aft_order_s1to5_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_s1to5_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '申报后卖前十量',
    field: 'aft_order_s1to10_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_s1to10_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '申报后卖前十加权平均价',
    field: 'aft_order_s1to10_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_s1to10_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '申报后卖五价',
    field: 'aft_order_s5_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_s5_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '申报后卖五量',
    field: 'aft_order_s5_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'aft_order_s5_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '撤单前买一价',
    field: 'withdraw_b1_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_b1_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '撤单前买一量',
    field: 'withdraw_b1_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_b1_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '撤单前买前五加权平均价',
    field: 'withdraw_b1to5_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_b1to5_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '撤单前买前五量',
    field: 'withdraw_b1to5_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_b1to5_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '撤单前买前十加权平均价',
    field: 'withdraw_b1to10_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_b1to10_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '撤单前买前十量',
    field: 'withdraw_b1to10_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_b1to10_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '撤单前卖一价',
    field: 'withdraw_s1_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_s1_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '撤单前卖一量',
    field: 'withdraw_s1_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_s1_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '撤单前卖前五加权平均价',
    field: 'withdraw_s1to5_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_s1to5_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '撤单前卖前五量',
    field: 'withdraw_s1to5_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_s1to5_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '撤单前卖前十加权平均价',
    field: 'withdraw_s1to10_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_s1to10_price'),
    formatter: childColFormatDec3,
    format: '#,##0.000'
  },
  {
    label: '撤单前卖前十量',
    field: 'withdraw_s1to10_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_s1to10_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '委托时刻前的市场未成交买单量',
    field: 'bfr_order_b_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'bfr_order_b_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '委托时刻前的市场未成交卖单量',
    field: 'bfr_order_s_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'bfr_order_s_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '撤单时刻前的市场未成交买单量',
    field: 'withdraw_b_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_b_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  },
  {
    label: '撤单时刻前的市场未成交卖单量',
    field: 'withdraw_s_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_s_vol'),
    formatter: childColFormatDecInt,
    format: '#,##0'
  }
]
