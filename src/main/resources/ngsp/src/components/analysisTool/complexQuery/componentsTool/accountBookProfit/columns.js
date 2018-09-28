import Vue from 'vue'
export const columns =  [
  {
    id: '1',
    minWidth: '100px',
    label: '股东代码',
    field: 'acct_id',
    align: 'left',
    sortable: false
  },
  {
    id: '2',
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
    label: '期初持股',
    field: 'pre_hold_vol',
    align: 'right',
    sortable: false,
    format: '0'
  },
  {
    id: '7',
    minWidth: '100px',
    label: '期初持股市值',
    field: 'pre_hold_amt',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '8',
    minWidth: '100px',
    label: '新股申购数量',
    field: 'allot_vol',
    align: 'right',
    format: '0',
    sortable: false
  },
  {
    id: '9',
    minWidth: '100px',
    label: '新股申购金额',
    field: 'allot_amt',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '10',
    minWidth: '100px',
    label: '累计买入数量',
    field: 'buy_vol',
    align: 'right',
    format: '0',
    sortable: false
  },
  {
    id: '11',
    minWidth: '100px',
    label: '累计买入金额',
    field: 'buy_amt',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '12',
    minWidth: '100px',
    label: '累计卖出数量',
    field: 'sell_vol',
    align: 'right',
    format: '0',
    sortable: false
  },
  {
    id: '13',
    minWidth: '100px',
    label: '累计卖出金额',
    field: 'sell_amt',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '14',
    minWidth: '100px',
    label: '期末持股',
    field: 'now_hold_vol',
    align: 'right',
    format: '0',
    sortable: false
  },
  {
    id: '15',
    minWidth: '100px',
    label: '期末持股市值',
    field: 'now_hold_amt',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '16',
    minWidth: '100px',
    label: '印花税',
    field: 'stamp_tax',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '17',
    minWidth: '100px',
    label: '过户费',
    field: 'transfer_fee',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '18',
    minWidth: '100px',
    label: '交易佣金估算',
    field: 'comm_amt_1',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '19',
    minWidth: '100px',
    label: '累计派现金额',
    field: 'div_amt_1',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '20',
    minWidth: '100px',
    label: '累计送股数量',
    field: 'bonus_vol_1',
    align: 'right',
    format: '0',
    sortable: false
  },
  {
    id: '21',
    minWidth: '100px',
    label: '配股数量',
    field: 'right_vol',
    align: 'right',
    format: '0',
    sortable: false
  },
  {
    id: '22',
    minWidth: '100px',
    label: '配股金额',
    field: 'right_amt',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '23',
    minWidth: '100px',
    label: '股改送股数量',
    field: 'bonus_vol_2',
    align: 'right',
    format: '0',
    sortable: false
  },
  {
    id: '24',
    minWidth: '100px',
    label: '股改送现金金额',
    field: 'div_amt_2',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '25',
    minWidth: '100px',
    label: '非交易过户转入',
    field: 'in_vol',
    align: 'right',
    sortable: false
  },
  {
    id: '26',
    minWidth: '100px',
    label: '非交易过户转出',
    field: 'out_vol',
    align: 'right',
    sortable: false
  },
  {
    id: '27',
    minWidth: '100px',
    label: '违法所得',
    field: 'pft_amt_1',
    align: 'right',
    sortable: false,
    formatter: Vue.prototype.gfnElColFormatDec2,
    format: '0.00'
  },
  {
    id: '28',
    minWidth: '100px',
    label: '校验',
    field: 'check_vol',
    align: 'right',
    sortable: false
  }
]

