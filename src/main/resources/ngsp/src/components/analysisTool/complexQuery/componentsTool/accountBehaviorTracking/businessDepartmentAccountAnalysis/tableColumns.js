import Vue from 'vue'
export const tableColumns = [
  [
    {
      label: '营业部全称',
      field: 'branch_name',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name')
    },
    {
      label: '参与委托账户总数',
      field: 'count_acct_id',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'count_acct_id'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买委托量',
      field: 'sum_order_b_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_b_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均买委托价',
      field: 'avg_order_b_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_order_b_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买委托次数',
      field: 'sum_order_b_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_b_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买成交量',
      field: 'sum_buy_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_buy_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均买成交价',
      field: 'avg_buy_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_buy_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买成交次数',
      field: 'sum_buy_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_buy_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买撤单量',
      field: 'sum_order_bw_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_bw_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买撤单次数',
      field: 'sum_order_bw_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_bw_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖委托量',
      field: 'sum_order_s_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_s_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均卖委托价',
      field: 'avg_order_s_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_order_s_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖委托次数',
      field: 'sum_order_s_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_s_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖成交量',
      field: 'sum_sell_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_sell_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均卖成交价',
      field: 'avg_sell_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_sell_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖成交次数',
      field: 'sum_sell_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_sell_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖撤单量',
      field: 'sum_order_sw_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_sw_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖撤单次数',
      field: 'sum_order_sw_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_sw_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    }
  ],
  [
    {
      label: '营业部全称',
      field: 'branch_name',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name')
    },
    {
      label: '账户代码',
      field: 'acct_id',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'acct_id'),
    },
    {
      label: '账户名称',
      field: 'acct_name',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name')
    },
    {
      label: '买委托量',
      field: 'sum_order_b_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_b_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均买委托价',
      field: 'avg_order_b_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_order_b_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买委托次数',
      field: 'sum_order_b_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_b_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买成交量',
      field: 'sum_buy_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_buy_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均买成交价',
      field: 'avg_buy_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_buy_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买成交次数',
      field: 'sum_buy_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_buy_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买撤单量',
      field: 'sum_order_bw_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_bw_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买撤单次数',
      field: 'sum_order_bw_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_bw_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖委托量',
      field: 'sum_order_s_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_s_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均卖委托价',
      field: 'avg_order_s_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_order_s_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖委托次数',
      field: 'sum_order_s_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_s_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖成交量',
      field: 'sum_sell_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_sell_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均卖成交价',
      field: 'avg_sell_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_sell_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖成交次数',
      field: 'sum_sell_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_sell_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖撤单量',
      field: 'sum_order_sw_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_sw_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖撤单次数',
      field: 'sum_order_sw_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sum_order_sw_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    }
  ],
  [
    {
      label: '订单编号',
      field: 'order_no',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_no'),
      format: '0'
    },
    {
      label: '交易日',
      field: 'trade_date',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_date')
    },
    {
      label: '订单时间',
      field: 'last_upd_time',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'last_upd_time')
    },
    {
      label: '股票代码',
      field: 'sec_code',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
    },
    {
      label: '股票名称',
      field: 'sec_name',
      minWidth: '80',
      align: 'left',
      sortable: true
    },
    {
      label: '账户代码',
      field: 'acct_id',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'acct_id')
    },
    {
      label: '账户名称',
      field: 'acct_name',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name')
    },
    {
      label: '买卖方向',
      field: 'trade_dir',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_dir')
    },
    {
      label: '订单价格',
      field: 'order_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '订单数量',
      field: 'order_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: 'PBU代码',
      field: 'pbu_id',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'pbu_id')
    },
    {
      label: '虚拟PBU',
      field: 'stat_pbu_id',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'stat_pbu_id')
    },
    {
      label: '订单类型',
      field: 'order_type',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'order_type')
    },
    {
      label: '成交标志',
      field: 'trade_flag',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_flag')
    },
    {
      label: '撤单时间',
      field: 'withdraw_time',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_time')
    },
    {
      label: '成交量',
      field: 'order_exec_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_exec_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '成交笔数',
      field: 'trade_cnt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '成交金额',
      field: 'trade_amt',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_amt'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '撤单量',
      field: 'withdraw_vol',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '成交开始时间',
      field: 'first_trade_time',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'first_trade_time')
    },
    {
      label: '成交结束时间',
      field: 'last_trade_time',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'last_trade_time')
    },
    {
      label: '最低成交价',
      field: 'min_trade_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'min_trade_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '最高成交价',
      field: 'max_trade_price',
      minWidth: '80',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'max_trade_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '营业部名称',
      field: 'branch_name',
      minWidth: '80',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name')
    }
  ]
]
