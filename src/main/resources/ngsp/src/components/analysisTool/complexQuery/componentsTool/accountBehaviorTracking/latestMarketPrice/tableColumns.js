import Vue from 'vue'

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
    label: '股票名称',
    field: 'sec_name',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
  },
  {
    label: '交易日',
    field: 'entry_date',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'entry_date')
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
    label: '订单时间',
    field: 'last_upd_time',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'last_upd_time')
  },
  {
    label: '订单价格',
    field: 'order_price',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '订单时间之前的最后一笔市场成交价',
    field: 'pre_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'pre_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '订单时间之前的最后一秒市场平均成交价',
    field: 'pre_avg_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'pre_avg_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
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
    label: '买卖方向',
    field: 'trade_dir',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_dir')
  },
  {
    label: '订单数量',
    field: 'order_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_vol'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: 'PBU代码',
    field: 'pbu_id',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'pbu_id')
  },
  {
    label: '虚拟PBU',
    field: 'stat_pbu_id',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'stat_pbu_id')
  },
  {
    label: '订单类型',
    field: 'order_type',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'order_type')
  },
  {
    label: '成交标志',
    field: 'trade_flag',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_flag')
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
    label: '成交量',
    field: 'order_exec_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_exec_vol'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: '成交笔数',
    field: 'trade_cnt',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_cnt'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: '成交额',
    field: 'trade_amt',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_amt'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '撤单量',
    field: 'withdraw_vol',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_vol'),
    formatter: Vue.prototype.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    label: '成交开始时间',
    field: 'first_trade_time',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'first_trade_time')
  },
  {
    label: '成交结束时间',
    field: 'last_trade_time',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'last_trade_time')
  },
  {
    label: '最低成交价',
    field: 'min_trade_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'min_trade_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '最高成交价',
    field: 'max_trade_price',
    minWidth: '80px',
    align: 'right',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'max_trade_price'),
    formatter: Vue.prototype.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    label: '营业部名称',
    field: 'mem_branch_name',
    minWidth: '80px',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'mem_branch_name')
  }
]
