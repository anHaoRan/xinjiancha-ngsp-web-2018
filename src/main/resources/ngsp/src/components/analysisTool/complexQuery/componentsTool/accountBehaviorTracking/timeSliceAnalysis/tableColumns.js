import Vue from 'vue'

export const tableColumns = [
  [],
  [
    {
      label: '虚拟PBU',
      field: 'stat_pbu_id',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'stat_pbu_id')
    },
    {
      label: '营业部全称',
      field: 'branch_name',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name')
    },
    {
      label: '账户代码',
      field: 'acct_id',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'acct_id')
    },
    {
      label: '账户名称',
      field: 'acct_name',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name')
    },
    {
      label: '时间片起点',
      field: 'start_time',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'start_time')
    },
    {
      label: '时间片终点',
      field: 'end_time',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'end_time')
    },
    {
      label: '股票代码',
      field: 'sec_code',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
    },
    {
      label: '股票名称',
      field: 'sec_name',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
    },
    {
      label: '买委托量',
      field: 'b_order_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均买委托价',
      field: 'avg_b_order_price',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_b_order_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买成交量',
      field: 'b_trade_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均买成交价',
      field: 'b_avg_trade_price',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_avg_trade_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买撤单量',
      field: 'b_withdraw_bal',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_withdraw_bal'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买委托占比(%)',
      field: 'b_order_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_order_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买成交占比(%)',
      field: 'b_trade_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_trade_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '净买入量',
      field: 'buy_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    }],
  [
    {
      label: '虚拟PBU',
      field: 'stat_pbu_id',
      align: 'left',
      sortable: true,
      show: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'stat_pbu_id')
    },
    {
      label: '营业部全称',
      field: 'branch_name',
      align: 'left',
      sortable: true,
      show: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name')
    },
    {
      label: '账户代码',
      field: 'acct_id',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'acct_id')
    },
    {
      label: '账户名称',
      field: 'acct_name',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name')
    },
    {
      label: '时间片起点',
      field: 'start_time',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'start_time')
    },
    {
      label: '时间片终点',
      field: 'end_time',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'end_time')
    },
    {
      label: '股票代码',
      field: 'sec_code',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
    },
    {
      label: '股票名称',
      field: 'sec_name',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
    },
    {
      label: '卖委托量',
      field: 's_order_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均卖委托价',
      field: 'avg_s_order_price',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_s_order_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖成交量',
      field: 's_trade_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均卖成交价',
      field: 's_avg_trade_price',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_avg_trade_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖撤单量',
      field: 's_withdraw_bal',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_withdraw_bal'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖委托占比(%)',
      field: 's_order_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_order_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖成交占比(%)',
      field: 's_trade_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_trade_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '净卖出量',
      field: 'sell_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    }],
  [
    {
      label: '虚拟PBU',
      field: 'stat_pbu_id',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'stat_pbu_id')
    },
    {
      label: '营业部全称',
      field: 'branch_name',
      align: 'left',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name')
    },
    {
      label: '买委托量',
      field: 'b_order_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均买委托价',
      field: 'avg_b_order_price',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_b_order_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买成交量',
      field: 'b_trade_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均买成交价',
      field: 'b_avg_trade_price',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_avg_trade_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买撤单量',
      field: 'b_withdraw_bal',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_withdraw_bal'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买委托占比(%)',
      field: 'b_order_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_order_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '买成交占比(%)',
      field: 'b_trade_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_trade_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '净买入量',
      field: 'buy_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    }],
  [
    {
      label: '虚拟PBU',
      field: 'stat_pbu_id',
      align: 'left',
      sortable: true,
      show: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'stat_pbu_id')
    },
    {
      label: '营业部全称',
      field: 'branch_name',
      align: 'left',
      sortable: true,
      show: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name')
    },
    {
      label: '卖委托量',
      field: 's_order_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均卖委托价',
      field: 'avg_s_order_price',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_s_order_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖成交量',
      field: 's_trade_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '平均卖成交价',
      field: 's_avg_trade_price',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_avg_trade_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖撤单量',
      field: 's_withdraw_bal',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_withdraw_bal'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖委托占比(%)',
      field: 's_order_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_order_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖成交占比(%)',
      field: 's_trade_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_trade_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '净卖出量',
      field: 'sell_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    }],
  [
    {
      label: '账户类型',
      field: 'acct_type',
      align: 'left',
      sortable: true,
      show: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_type')
    },
    {
      label: '买成交量',
      field: 'b_trade_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买成交账户数',
      field: 'b_trade_cnt',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_trade_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖成交量',
      field: 's_trade_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖成交账户数',
      field: 's_trade_cnt',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_trade_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买成交占比(%)',
      field: 'b_trade_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_trade_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖成交占比(%)',
      field: 's_trade_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_trade_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    }],
  [
    {
      label: '账户类型',
      field: 'acct_type',
      align: 'left',
      sortable: true,
      show: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_type')
    },
    {
      label: '买委托量',
      field: 'b_order_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买委托账户数',
      field: 'b_order_cnt',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_order_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖委托量',
      field: 's_order_vol',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '卖委托账户数',
      field: 's_order_cnt',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_order_cnt'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '买委托占比(%)',
      field: 'b_order_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'b_order_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '卖委托占比(%)',
      field: 's_order_ratio',
      align: 'right',
      show: true,
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 's_order_ratio'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    }]
]
