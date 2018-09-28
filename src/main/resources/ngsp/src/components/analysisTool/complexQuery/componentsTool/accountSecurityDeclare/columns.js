import Vue from 'vue'
import {complexQueryDec0, complexQueryDec3, complexQueryDec7} from '../common/sortMethods'

export const tableColumns = [
  [ // 逐日
    {
      id: '1',
      minWidth: '100',
      label: '交易日期',
      field: 'trade_date',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_date')
    },
    {
      id: '2',
      minWidth: '100',
      label: '股东账户',
      field: 'acct_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id')
    },
    {
      id: '3',
      minWidth: '100',
      label: '股东名称',
      field: 'acct_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name')
    },
    {
      id: '4',
      minWidth: '100',
      label: '证券代码',
      field: 'sec_code',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
    },
    {
      id: '5',
      minWidth: '100',
      label: '证券简称',
      field: 'sec_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
    },
    {
      id: '6',
      minWidth: '100',
      label: '买申报数量',
      field: 'buy_order_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_order_vol'),
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      id: '7',
      minWidth: '100',
      label: '买申报数量占市场比(%)',
      field: 'buy_order_vol_rate',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_order_vol_rate'),
      formatter: complexQueryDec7,
      format: '#,##0.0000000'
    },
    {
      id: '8',
      minWidth: '100',
      label: '买申报金额',
      field: 'buy_order_amt',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_order_amt'),
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      id: '9',
      minWidth: '100',
      label: '买申报均价',
      field: 'buy_order_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_order_price'),
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      id: '10',
      minWidth: '100',
      label: '买成交数量',
      field: 'buy_trade_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_trade_vol'),
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      id: '11',
      minWidth: '100',
      label: '买成交数量占申报比(%)',
      field: 'buy_trade_vol_rate',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_trade_vol_rate'),
      formatter: complexQueryDec7,
      format: '#,##0.0000000'
    },
    {
      id: '12',
      minWidth: '100',
      label: '买成交金额',
      field: 'buy_trade_amt',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_trade_amt'),
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      id: '13',
      minWidth: '100',
      label: '买撤单数量',
      field: 'buy_withdraw_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_withdraw_vol'),
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      id: '14',
      minWidth: '100',
      label: '买撤单数量占申报比(%)',
      field: 'buy_withdraw_vol_rate',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'buy_withdraw_vol_rate'),
      formatter: complexQueryDec7,
      format: '#,##0.0000000'
    },
    {
      id: '15',
      minWidth: '100',
      label: '卖申报数量',
      field: 'sell_order_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_order_vol'),
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      id: '16',
      minWidth: '100',
      label: '卖申报数量占市场比(%)',
      field: 'sell_order_vol_rate',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_order_vol_rate'),
      formatter: complexQueryDec7,
      format: '#,##0.0000000'
    },
    {
      id: '17',
      minWidth: '100',
      label: '卖申报金额',
      field: 'sell_order_amt',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_order_amt'),
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      id: '18',
      minWidth: '100',
      label: '卖申报均价',
      field: 'sell_order_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_order_price'),
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      id: '19',
      minWidth: '100',
      label: '卖成交数量',
      field: 'sell_trade_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_trade_vol'),
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      id: '20',
      minWidth: '100',
      label: '卖成交数量占申报比(%)',
      field: 'sell_trade_vol_rate',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_trade_vol_rate'),
      formatter: complexQueryDec7,
      format: '#,##0.0000000'
    },
    {
      id: '21',
      minWidth: '100',
      label: '卖成交金额',
      field: 'sell_trade_amt',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_trade_amt'),
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      id: '22',
      minWidth: '100',
      label: '卖撤单数量',
      field: 'sell_withdraw_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_withdraw_vol'),
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      id: '23',
      minWidth: '100',
      label: '卖撤单数量占申报比(%)',
      field: 'sell_withdraw_vol_rate',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sell_withdraw_vol_rate'),
      formatter: complexQueryDec7,
      format: '#,##0.0000000'
    },
    {
      id: '24',
      minWidth: '100',
      label: 'PBU代码',
      field: 'pbu_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'pbu_id')
    },
    {
      id: '25',
      minWidth: '100',
      label: '会员',
      field: 'mem_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'mem_name')
    },
    {
      id: '26',
      minWidth: '100',
      label: '会员营业部',
      field: 'mem_branch_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'mem_branch_name')
    }
  ],
  [ // 逐笔
    {
      id: '221',
      label: '交易日期',
      field: 'trade_date',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_date')
    },
    {
      id: '222',
      label: '股东账户',
      field: 'acct_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id')
    },
    {
      id: '223',
      label: '股东名称',
      field: 'acct_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name')
    },
    {
      id: '224',
      label: '证券代码',
      field: 'sec_code',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
    },
    {
      id: '225',
      label: '证券简称',
      field: 'sec_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
    },
    {
      id: '2205',
      label: '买卖方向',
      field: 'trade_dir',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_dir')
    },
    {
      id: '226',
      label: '申报数量',
      field: 'order_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_vol'),
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      id: '227',
      label: '申报数量占市场比(%)',
      field: 'order_vol_rate',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_vol_rate'),
      formatter: complexQueryDec7,
      format: '#,##0.0000000'
    },
    {
      id: '228',
      label: '申报金额',
      field: 'order_amt',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_amt'),
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      id: '229',
      label: '申报价格',
      field: 'order_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_price'),
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      id: '2210',
      label: '成交数量',
      field: 'trade_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_vol'),
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      id: '2211',
      label: '成交数量占比(%)',
      field: 'trade_vol_rate',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_vol_rate'),
      formatter: complexQueryDec7,
      format: '#,##0.0000000'
    },
    {
      id: '2212',
      label: '成交金额',
      field: 'trade_amt',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_amt'),
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      id: '2213',
      label: '撤单数量',
      field: 'withdraw_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_vol'),
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      id: '2214',
      label: '撤单数量占比(%)',
      field: 'withdraw_vol_rate',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'withdraw_vol_rate'),
      formatter: complexQueryDec7,
      format: '#,##0.0000000'
    },
    {
      id: '2215',
      label: '申报编号',
      field: 'order_no',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_no'),
      format: '0'
    },
    {
      id: '2216',
      label: '申报时间',
      field: 'order_time',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'order_time')
    },
    {
      id: '2217',
      label: '撤单时间',
      field: 'withdraw_time',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'withdraw_time')
    },
    {
      id: '2218',
      label: '第一笔成交时间',
      field: 'first_trade_time',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'first_trade_time')
    },
    {
      id: '2219',
      label: '最后一笔成交时间',
      field: 'last_trade_time',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'last_trade_time')
    },
    {
      id: '2220',
      label: '订单类型',
      field: 'order_type',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'order_type')
    },
    {
      id: '2221',
      label: '信用标签',
      field: 'credit_type',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'credit_type')
    },
    {
      id: '2222',
      label: 'PBU代码',
      field: 'pbu_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'pbu_id')
    },
    {
      id: '2223',
      label: '会员',
      field: 'mem_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'mem_name')
    },
    {
      id: '2224',
      label: '会员营业部',
      field: 'mem_branch_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'mem_branch_name')
    }
  ]
]
