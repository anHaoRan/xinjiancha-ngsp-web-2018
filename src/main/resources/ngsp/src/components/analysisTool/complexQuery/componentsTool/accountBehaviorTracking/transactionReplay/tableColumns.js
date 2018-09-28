import Vue from 'vue'

export const tableColumns = [
  [ // 分钟
    {
      label: '股票代码',
      field: 'sec_code',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
    },
    {
      label: '股票简称',
      field: 'sec_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
    },
    {
      label: '交易日',
      field: 'trade_date',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_date')
    },
    {
      label: '时间',
      field: 'trade_time',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_time')
    },
    {
      label: '委托买入量',
      field: 'order_b_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_b_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '委托卖出量',
      field: 'order_s_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_s_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '成交量',
      field: 'trade_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '分钟最高价',
      field: 'high_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'high_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '分钟最低价',
      field: 'low_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'low_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '分钟均价',
      field: 'avg_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    }],
  [
    {
      label: '股票代码',
      field: 'sec_code',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
    },
    {
      label: '股票简称',
      field: 'sec_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
    },
    {
      label: '交易日',
      field: 'trade_date',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_date')
    },
    {
      label: '时间',
      field: 'trade_time',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_time')
    },
    {
      label: '委托买入量',
      field: 'order_b_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_b_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '委托卖出量',
      field: 'order_s_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_s_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '成交量',
      field: 'trade_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      label: '秒内最高价',
      field: 'high_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'high_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '秒内最低价',
      field: 'low_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'low_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      label: '秒内均价',
      field: 'avg_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'avg_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    }
  ]
]

export const eachOrderColumns = [
  [
    {
      id: '1',
      minWidth: '100px',
      class: 'action',
      label: '订单时间',
      field: 'order_time',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_time')
    },
    {
      id: '2',
      minWidth: '100px',
      class: 'action',
      label: '订单时间秒后小数',
      field: 'order_time_second_decimal',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_time_second_decimal')
    },
    {
      id: '3',
      minWidth: '100px',
      class: 'action',
      label: '订单维护代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, '')
    },
    {
      id: '4',
      minWidth: '100px',
      class: 'action',
      label: '订单编号',
      field: 'order_no',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_no'),
      format: '0'
    },
    {
      id: '5',
      minWidth: '100px',
      class: 'action',
      label: '是否即时成交',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, '')
    },
    {
      id: '6',
      minWidth: '100px',
      class: 'action',
      label: '股东账户',
      field: 'acct_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'acct_id')
    },
    {
      id: '7',
      minWidth: '100px',
      class: 'action',
      label: '股东名称',
      field: 'acct_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name')
    },
    {
      id: '8',
      minWidth: '100px',
      class: 'action',
      label: '买卖方向',
      field: 'trade_dir',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_dir')
    },
    {
      id: '9',
      minWidth: '100px',
      class: 'action',
      label: '订单类型',
      field: 'order_type',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'order_type')
    },
    {
      id: '10',
      minWidth: '100px',
      class: 'action',
      label: '订单价格',
      field: 'order_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: '11',
      minWidth: '100px',
      class: 'action',
      label: '订单数量',
      field: 'order_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: '12',
      minWidth: '100px',
      class: 'action',
      label: '限价订单申报金额',
      field: 'order_amt',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_amt'),
      formatter: Vue.prototype.gfnElColFormatDecThou,
      format: '#,##0.00'
    },
    {
      id: '13',
      minWidth: '100px',
      class: 'action',
      label: '即时成交数量',
      field: 'trade_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: '14',
      minWidth: '100px',
      class: 'action',
      label: '即时成交金额',
      field: 'trade_amt',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_amt'),
      formatter: Vue.prototype.gfnElColFormatDecThou,
      format: '#,##0.00'
    },
    {
      id: '15',
      minWidth: '100px',
      class: 'action',
      label: '订单剩余未成交数量',
      field: 'order_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: '16',
      minWidth: '100px',
      class: 'action',
      label: '信用标志',
      field: 'credit_type',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'credit_type')
    },
    {
      id: '17',
      minWidth: '100px',
      class: 'action',
      label: 'PBU代码',
      field: 'pbu_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'pbu_id')
    },
    {
      id: '18',
      minWidth: '100px',
      class: 'action',
      label: '营业部ID',
      field: 'branch_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'branch_id')
    },
    {
      id: '19',
      minWidth: '100px',
      class: 'action',
      label: '会员营业部名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, '')
    },
    {
      id: '20',
      minWidth: '100px',
      class: 'action',
      label: '股东证件号码',
      field: 'id_card',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'id_card')
    }
  ],
  [
    {
      id: '221',
      minWidth: '100px',
      class: 'action',
      label: '成交编号',
      field: 'trade_no',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_no'),
      format: '0'
    },
    {
      id: '222',
      minWidth: '100px',
      class: 'action',
      label: '本方订单编号',
      field: 'order_no_2',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_no_2'),
      format: '0'
    },
    {
      id: '223',
      minWidth: '100px',
      class: 'action',
      label: '本方订单剩余未成交数量',
      field: 'order_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: '224',
      minWidth: '100px',
      class: 'action',
      label: '成交价格',
      field: 'trade_price',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_price'),
      formatter: Vue.prototype.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: '225',
      minWidth: '100px',
      class: 'action',
      label: '成交数量',
      field: 'trade_vol',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_vol'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: '226',
      minWidth: '100px',
      class: 'action',
      label: '成交金额',
      field: 'trade_amt',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'trade_amt'),
      formatter: Vue.prototype.gfnElColFormatDecThou,
      format: '#,##0.00'
    },
    {
      id: '227',
      minWidth: '100px',
      class: 'action',
      label: '对手方买卖方向',
      field: 'trade_dir',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_dir')
    },
    {
      id: '228',
      minWidth: '100px',
      class: 'action',
      label: '对手方股东账户',
      field: 'acct_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'acct_id')
    },
    {
      id: '229',
      minWidth: '100px',
      class: 'action',
      label: '对手方股东名称',
      field: 'acct_name',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name')
    },
    {
      id: '2210',
      minWidth: '100px',
      class: 'action',
      label: '对手方订单剩余未成交数量',
      field: 'order_vol_2',
      align: 'right',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_vol_2'),
      formatter: Vue.prototype.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: '2211',
      minWidth: '100px',
      class: 'action',
      label: '成交时间',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, '')
    },
    {
      id: '2212',
      minWidth: '100px',
      class: 'action',
      label: '成交时间秒后小数',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, '')
    },
    {
      id: '2213',
      minWidth: '100px',
      class: 'action',
      label: '对手方订单编号',
      field: 'order_no',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'order_no'),
      format: '0'
    },
    {
      id: '2214',
      minWidth: '100px',
      class: 'action',
      label: '对手方订单时间',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, '')
    },
    {
      id: '2215',
      minWidth: '100px',
      class: 'action',
      label: '对手方订单时间秒后小数',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, '')
    },
    {
      id: '2216',
      minWidth: '100px',
      class: 'action',
      label: '对手方信用标志',
      field: 'credit_type',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'credit_type')
    },
    {
      id: '2217',
      minWidth: '100px',
      class: 'action',
      label: '对手方PBU代码',
      field: 'pbu_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'pbu_id')
    },
    {
      id: '2218',
      minWidth: '100px',
      class: 'action',
      label: '对手方营业部ID',
      field: 'branch_id',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'branch_id')
    },
    {
      id: '2219',
      minWidth: '100px',
      class: 'action',
      label: '对手方会员营业部名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, '')
    },
    {
      id: '2220',
      minWidth: '100px',
      class: 'action',
      label: '对手方股东证件号码',
      field: 'id_card',
      align: 'left',
      sortable: true,
      sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'id_card')
    }
  ]
]
