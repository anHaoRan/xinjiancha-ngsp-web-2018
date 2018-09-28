import Vue from 'vue'

function colFormatDec7 (row, column, cellValue) {
  if (cellValue === null) return ''
  return Number(cellValue) === 0 ? 0 : Vue.prototype.gfnFormatDecimal(cellValue, 7)
}

function colFormatDec5 (row, column, cellValue) {
  if (cellValue === null) return ''
  return Number(cellValue) === 0 ? 0 : Vue.prototype.gfnFormatDecimal(cellValue, 5)
}

// 基本资料 不完整
export const fixedColumns = [ // 账户组基础表格
  [ // PUB
    {
      id: 'baseT1',
      minWidth: '100px',
      label: '序号',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseT2',
      minWidth: '100px',
      label: 'PBU名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseT3',
      minWidth: '100px',
      label: 'PBU代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseT4',
      minWidth: '100px',
      label: '总部PBUID',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseT5',
      minWidth: '100px',
      label: '券商名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseT6',
      minWidth: '100px',
      label: '营业部名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseT7',
      minWidth: '100px',
      label: '营业部地址',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseT8',
      minWidth: '100px',
      label: 'PBU是否激活',
      field: 'order_time_dec',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseT9',
      minWidth: '100px',
      label: 'PBU是否暂停',
      field: 'order_time_dec',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseT10',
      minWidth: '100px',
      label: 'PBU是否可买卖',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    }
  ],
  [ // 券商
    {
      id: 'baseB1',
      minWidth: '100px',
      label: '序号',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseB2',
      minWidth: '100px',
      label: '券商名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseB3',
      minWidth: '100px',
      label: '地址',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseB4',
      minWidth: '100px',
      label: '负责人',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseB5',
      minWidth: '100px',
      label: '电话',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'baseB6',
      minWidth: '100px',
      label: '注册资本',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    }
  ],
  [ // 账户组
    {
      id: 'trustA1',
      minWidth: '100px',
      label: '账户代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA2',
      minWidth: '100px',
      label: '账户名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA3',
      minWidth: '100px',
      label: '营业部名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA4',
      minWidth: '100px',
      label: '证券代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA5',
      minWidth: '100px',
      label: '证券名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA6',
      minWidth: '100px',
      label: '前持仓数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustA7',
      minWidth: '100px',
      label: '买入数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustA8',
      minWidth: '100px',
      label: '买入金额',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA9',
      minWidth: '100px',
      label: '买入均价',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA10',
      minWidth: '100px',
      label: '卖出数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustA11',
      minWidth: '100px',
      label: '卖出金额',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA12',
      minWidth: '100px',
      label: '卖出均价',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA13',
      minWidth: '100px',
      label: '持仓数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustA14',
      minWidth: '100px',
      label: '持仓市值',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA15',
      minWidth: '100px',
      label: '限售股数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    }
  ]
]

// PUB托管 券商托管 账户组持仓统计
export const trusteeship = [
  [ // PUB托管
    {
      id: 'trustT1',
      minWidth: '100px',
      label: 'PUB代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustT2',
      minWidth: '100px',
      label: '营业部名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustT3',
      minWidth: '100px',
      label: '证券代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustT4',
      minWidth: '100px',
      label: '证券名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustT5',
      minWidth: '100px',
      label: '日期',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustT6',
      minWidth: '100px',
      label: '托管数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustT7',
      minWidth: '100px',
      label: '托管限售股数量',
      field: 'order_time_dec',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    }
  ],
  [ // 券商托管
    {
      id: 'trustB1',
      minWidth: '100px',
      label: '券商代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustB2',
      minWidth: '100px',
      label: '营业部名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustB3',
      minWidth: '100px',
      label: '证券代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustB4',
      minWidth: '100px',
      label: '证券名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustB5',
      minWidth: '100px',
      label: '日期',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustB6',
      minWidth: '100px',
      label: '托管数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustB7',
      minWidth: '100px',
      label: '托管限售股数量',
      field: 'order_time_dec',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    }
  ],
  [ // 账户组持仓统计
    {
      id: 'trustA1',
      minWidth: '100px',
      label: '账户代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA2',
      minWidth: '100px',
      label: '账户名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA3',
      minWidth: '100px',
      label: '营业部名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA4',
      minWidth: '100px',
      label: '证券代码',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA5',
      minWidth: '100px',
      label: '证券名称',
      field: '',
      align: 'left',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, '')
    },
    {
      id: 'trustA6',
      minWidth: '100px',
      label: '前持仓数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustA7',
      minWidth: '100px',
      label: '买入数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustA8',
      minWidth: '100px',
      label: '买入金额',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA9',
      minWidth: '100px',
      label: '买入均价',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA10',
      minWidth: '100px',
      label: '卖出数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustA11',
      minWidth: '100px',
      label: '卖出金额',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA12',
      minWidth: '100px',
      label: '卖出均价',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA13',
      minWidth: '100px',
      label: '持仓数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    },
    {
      id: 'trustA14',
      minWidth: '100px',
      label: '持仓市值',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou3,
      format: '#,##0.000'
    },
    {
      id: 'trustA15',
      minWidth: '100px',
      label: '限售股数量',
      field: '',
      align: 'right',
      sortable: true,
      sortMethod: this.gfnSortColByNumber.bind(this, ''),
      formatter: this.gfnElColFormatDecThou0,
      format: '#,##0'
    }
  ]
]

// PUB、券商、账户组申报详情
export const DeclarationDetail = [
  {
    id: 'declare1',
    minWidth: '100px',
    label: '申报编号',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    format: '0'
  },
  {
    id: 'declare2',
    minWidth: '100px',
    label: '证券代码',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare3',
    minWidth: '100px',
    label: '证券简称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare4',
    minWidth: '100px',
    label: '申报日期',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare5',
    minWidth: '100px',
    label: '申报时间',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare6',
    minWidth: '100px',
    label: '参与者代码',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare7',
    minWidth: '100px',
    label: '参与者名称',
    field: 'order_time_dec',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare8',
    minWidth: '100px',
    label: '方向',
    field: 'order_time_dec',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare9',
    minWidth: '100px',
    label: '一码通账户',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare10',
    minWidth: '100px',
    label: '申报价格',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    id: 'declare11',
    minWidth: '100px',
    label: '申报数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declare12',
    minWidth: '100px',
    label: '未成交量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declare13',
    minWidth: '100px',
    label: '订单状态',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare14',
    minWidth: '100px',
    label: '撤单时间',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare15',
    minWidth: '100px',
    label: '营业部名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare16',
    minWidth: '100px',
    label: '券商名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare17',
    minWidth: '100px',
    label: '订单类型',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare18',
    minWidth: '100px',
    label: '信用类型',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declare19',
    minWidth: '100px',
    label: 'PBU代码',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  }
]

// PUB、券商、账户组成交详情
export const dealDetail = [
  {
    id: 'deal1',
    minWidth: '100px',
    label: '成交编号',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    format: '0'
  },
  {
    id: 'deal2',
    minWidth: '100px',
    label: '证券代码',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal3',
    minWidth: '100px',
    label: '证券名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal4',
    minWidth: '100px',
    label: '成交日期',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal5',
    minWidth: '100px',
    label: '成交时间',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal10',
    minWidth: '100px',
    label: '成交数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'deal11',
    minWidth: '100px',
    label: '成交价格',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    id: 'deal12',
    minWidth: '100px',
    label: '买方账户',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'deal13',
    minWidth: '100px',
    label: '买方账户名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal14',
    minWidth: '100px',
    label: '买方一码通账户',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal15',
    minWidth: '100px',
    label: '买方PBU',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal16',
    minWidth: '100px',
    label: '买方营业部名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal17',
    minWidth: '100px',
    label: '买方券商名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal18',
    minWidth: '100px',
    label: '卖方账户',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal19',
    minWidth: '100px',
    label: '卖方账户名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal20',
    minWidth: '100px',
    label: '卖方一码通账户',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal21',
    minWidth: '100px',
    label: '卖方PBU',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal22',
    minWidth: '100px',
    label: '卖方营业部名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal23',
    minWidth: '100px',
    label: '卖方券商名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal24',
    minWidth: '100px',
    label: '平台类型',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal25',
    minWidth: '100px',
    label: '交易类型',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal26',
    minWidth: '100px',
    label: '买方订单类型',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal27',
    minWidth: '100px',
    label: '卖方订单类型',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal28',
    minWidth: '100px',
    label: '买方信用类型',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal29',
    minWidth: '100px',
    label: '卖方信用类型',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'deal30',
    minWidth: '100px',
    label: '买方申报价格',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    id: 'deal31',
    minWidth: '100px',
    label: '卖方申报价格',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    id: 'deal32',
    minWidth: '100px',
    label: '买方申报数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'deal33',
    minWidth: '100px',
    label: '卖方申报数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  }
]

// PUB、券商、账户组申报统计
export const DeclareStatistics = [
  {
    id: 'declareS1',
    minWidth: '100px',
    label: '证券代码',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declareS2',
    minWidth: '100px',
    label: '证券简称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declareS3',
    minWidth: '100px',
    label: '参与者代码',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declareS4',
    minWidth: '100px',
    label: '参与者名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declareS5',
    minWidth: '100px',
    label: '营业部名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'declareS6',
    minWidth: '100px',
    label: '申报买入数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS7',
    minWidth: '100px',
    label: '买入未成交量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS8',
    minWidth: '100px',
    label: '买入撤单量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS9',
    minWidth: '100px',
    label: '申报卖出数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS10',
    minWidth: '100px',
    label: '卖出未成交量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS11',
    minWidth: '100px',
    label: '卖出撤单量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS12',
    minWidth: '100px',
    label: '申报买入次数',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS13',
    minWidth: '100px',
    label: '买入撤单次数',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS14',
    minWidth: '100px',
    label: '申报卖出次数',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS15',
    minWidth: '100px',
    label: '卖出撤单次数',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS16',
    minWidth: '100px',
    label: '买方申报均价',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    id: 'declareS17',
    minWidth: '100px',
    label: '卖方申报均价',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    id: 'declareS18',
    minWidth: '100px',
    label: '买方申报数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'declareS19',
    minWidth: '100px',
    label: '卖方申报数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  }
]

// PUB、券商、账户组成交统计
export const dealStatistics = [
  {
    id: 'dealS1',
    minWidth: '100px',
    label: '证券代码',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'dealS2',
    minWidth: '100px',
    label: '证券名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'dealS3',
    minWidth: '100px',
    label: '参与者代码',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'dealS4',
    minWidth: '100px',
    label: '参与者名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'dealS5',
    minWidth: '100px',
    label: '营业部名称',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, '')
  },
  {
    id: 'dealS6',
    minWidth: '100px',
    label: '买入数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'dealS7',
    minWidth: '100px',
    label: '买入金额',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    id: 'dealS8',
    minWidth: '100px',
    label: '买入比例',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDec3,
    format: '0.000'
  },
  {
    id: 'dealS9',
    minWidth: '100px',
    label: '卖出数量',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou0,
    format: '#,##0'
  },
  {
    id: 'dealS10',
    minWidth: '100px',
    label: '卖出金额',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    id: 'dealS11',
    minWidth: '100px',
    label: '卖出比例',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDec3,
    format: '0.000'
  },
  {
    id: 'dealS12',
    minWidth: '100px',
    label: '买入均价',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  },
  {
    id: 'dealS13',
    minWidth: '100px',
    label: '卖出均价',
    field: '',
    align: 'left',
    sortable: true,
    sortMethod: this.gfnSortColByNumber.bind(this, ''),
    formatter: this.gfnElColFormatDecThou3,
    format: '#,##0.000'
  }
]