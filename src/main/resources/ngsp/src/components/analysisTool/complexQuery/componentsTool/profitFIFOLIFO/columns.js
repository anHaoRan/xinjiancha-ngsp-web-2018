import Vue from 'vue'

function colFormatDec7 (row, column, cellValue) {
  if (cellValue === null) return ''
  return Number(cellValue) === 0 ? 0 : Vue.prototype.gfnFormatDecimal(cellValue, 7)
}

function colFormatDec5 (row, column, cellValue) {
  if (cellValue === null) return ''
  return Number(cellValue) === 0 ? 0 : Vue.prototype.gfnFormatDecimal(cellValue, 5)
}

export const columns = [ // 固定需要展示列
  {
    id: '1',
    minWidth: '100px',
    label: '交易日期',
    field: 'trade_date',
    align: 'left',
    sortable: false
  },
  {
    id: '2',
    minWidth: '100px',
    label: '股东账户',
    field: 'acct_id',
    align: 'left',
    sortable: false
  },
  {
    id: '3',
    minWidth: '100px',
    label: '股东名称',
    field: 'acct_name',
    align: 'left',
    sortable: false
  },
  {
    id: '4',
    minWidth: '100px',
    label: '证券代码',
    field: 'sec_code',
    align: 'left',
    sortable: false
  },
  {
    id: '5',
    minWidth: '100px',
    label: '证券简称',
    field: 'sec_name',
    align: 'left',
    sortable: false
  },
  {
    id: '6',
    minWidth: '100px',
    label: '订单时间',
    field: 'order_time',
    align: 'left',
    sortable: false
  },
  {
    id: '7',
    minWidth: '100px',
    label: '订单时间秒后小数',
    field: 'order_time_dec',
    align: 'right',
    sortable: false,
    formatter: colFormatDec7,
    format: '0.0000000'
  },
  {
    id: '8',
    minWidth: '100px',
    label: '订单编号',
    field: 'order_no',
    align: 'right',
    sortable: false
  },
  {
    id: '9',
    minWidth: '100px',
    label: '申报数量',
    field: 'order_vol',
    align: 'right',
    sortable: false
  },
  {
    id: '10',
    minWidth: '100px',
    label: '申报价格',
    field: 'order_price',
    align: 'right',
    sortable: false,
    formatter: colFormatDec5,
    format: '0.00000'
  },
  {
    id: '11',
    minWidth: '100px',
    label: '申报前市场最新成交价',
    field: 'bo_trade_price',
    align: 'right',
    sortable: false,
    formatter: colFormatDec5,
    format: '0.00000'
  },
  {
    id: '12',
    minWidth: '100px',
    label: '申报后订单所在档位',
    field: 'ao_price_rank',
    align: 'right',
    sortable: false
  },
  {
    id: '13',
    minWidth: '100px',
    label: '申报后与该订单同向同档位其他账户申报数量',
    field: 'ao_same_dir_other_vol_5',
    align: 'right',
    sortable: false
  },
  {
    id: '14',
    minWidth: '100px',
    label: '申报后与该订单同向前五档其他账户申报数量',
    field: 'ao_same_dir_other_vol_10',
    align: 'right',
    sortable: false
  },
  {
    id: '15',
    minWidth: '100px',
    label: '申报后与该订单同向前十档其他账户申报数量',
    field: 'ao_other_vol_10',
    align: 'right',
    sortable: false
  },
  {
    id: '16',
    minWidth: '100px',
    label: '信用标签',
    field: 'credit_type',
    align: 'right',
    sortable: false
  },
  {
    id: '17',
    minWidth: '100px',
    label: '买卖方向',
    field: 'trade_dir',
    align: 'right',
    sortable: false
  },
  {
    id: '18',
    minWidth: '100px',
    label: '订单类型',
    field: 'order_type',
    align: 'right',
    sortable: false
  },
  {
    id: '19',
    minWidth: '100px',
    label: '该订单成交数量',
    field: 'trade_vol',
    align: 'right',
    sortable: false
  },
  {
    id: '20',
    minWidth: '100px',
    label: '该订单成交金额',
    field: 'trade_amt',
    align: 'right',
    sortable: false
  },
  {
    id: '21',
    minWidth: '100px',
    label: '该订单成交笔数',
    field: 'trade_cnt',
    align: 'right',
    sortable: false
  },
  {
    id: '22',
    minWidth: '100px',
    label: '订单成交标志',
    field: 'trade_flag',
    align: 'right',
    sortable: false
  },
  {
    id: '23',
    minWidth: '100px',
    label: '撤单数量',
    field: 'withdraw_vol',
    align: 'right',
    sortable: false
  },
  {
    id: '24',
    minWidth: '100px',
    label: '撤单时间',
    field: 'withdraw_time',
    align: 'right',
    sortable: false
  },
  {
    id: '25',
    minWidth: '100px',
    label: '撤单时间秒后小数',
    field: 'withdraw_time_dec',
    align: 'right',
    sortable: false,
    formatter: colFormatDec7,
    format: '0.0000000'
  },
  {
    id: '26',
    minWidth: '100px',
    label: '撤单前市场最新成交价',
    field: 'bw_trade_price',
    align: 'right',
    sortable: false,
    formatter: colFormatDec5,
    format: '0.00000'
  },
  {
    id: '27',
    minWidth: '100px',
    label: '撤单前订单所在档位',
    field: 'bw_price_rank',
    align: 'right',
    sortable: false
  },
  {
    id: '28',
    minWidth: '100px',
    label: '撤单前与该订单同向同档位其他账户申报数量',
    field: 'bw_same_rank_other_vol',
    align: 'right',
    sortable: false
  },
  {
    id: '29',
    minWidth: '100px',
    label: '撤单前与该订单同向前五档其他账户申报数量',
    field: 'bw_same_dir_other_vol_5',
    align: 'right',
    sortable: false
  },
  {
    id: '30',
    minWidth: '100px',
    label: '撤单前与该订单同向前十档其他账户申报数量',
    field: 'bw_same_dir_other_vol_10',
    align: 'right',
    sortable: false
  },
  {
    id: '31',
    minWidth: '100px',
    label: '该订单第一笔成交价格',
    field: 'first_trade_price',
    align: 'right',
    sortable: false,
    formatter: colFormatDec5,
    format: '0.00000'
  },
  {
    id: '32',
    minWidth: '100px',
    label: '该订单最后一笔成交价格',
    field: 'last_trade_price',
    align: 'right',
    sortable: false,
    formatter: colFormatDec5,
    format: '0.00000'
  },
  {
    id: '33',
    minWidth: '100px',
    label: '该订单第一笔成交时间',
    field: 'first_trade_time',
    align: 'right',
    sortable: false
  },
  {
    id: '34',
    minWidth: '100px',
    label: '该订单第一笔成交时间秒后小数',
    field: 'first_trade_time_dec',
    align: 'right',
    sortable: false,
    formatter: colFormatDec7,
    format: '0.0000000'
  },
  {
    id: '35',
    minWidth: '100px',
    label: '该订单最后一笔成交时间',
    field: 'last_trade_time',
    align: 'right',
    sortable: false
  },
  {
    id: '36',
    minWidth: '100px',
    label: '该订单最后一笔成交时间秒后小数',
    field: 'last_trade_time_dec',
    align: 'right',
    sortable: false,
    formatter: colFormatDec7,
    format: '0.0000000'
  },
  {
    id: '37',
    minWidth: '100px',
    label: '该订单成交时段内该证券市场成交均价',
    field: 'sec_trade_price',
    align: 'right',
    sortable: false,
    formatter: colFormatDec5,
    format: '0.00000'
  },
  {
    id: '38',
    minWidth: '100px',
    label: '该订单成交时段内该证券市场成交数量',
    field: 'sec_trade_vol',
    align: 'right',
    sortable: false
  },
  {
    id: '39',
    minWidth: '100px',
    label: '该订单成交时段内该证券市场成交金额',
    field: 'sec_trade_amt',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec3,
    format: '0.000'
  },
  {
    id: '40',
    minWidth: '100px',
    label: '该订单第一笔成交前一笔成交价格',
    field: 'first_trade_pre_price',
    align: 'right',
    sortable: false,
    formatter: colFormatDec5,
    format: '0.00000'
  },
  {
    id: '41',
    minWidth: '100px',
    label: '该订单最后一笔成交后一笔成交价格',
    field: 'last_trade_next_price',
    align: 'right',
    sortable: false,
    formatter: colFormatDec5,
    format: '0.00000'
  }
]
