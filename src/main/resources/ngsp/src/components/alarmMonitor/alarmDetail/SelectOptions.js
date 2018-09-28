export const INVESTIGATE_MATTERS = [
  {
    value: 1,
    label: '集合竞价虚假申报',
    children: [
      {value: 1, label: '拉升虚拟开盘价'},
      {value: 2, label: '打压虚拟开盘价'}
    ]
  }, {
    value: 2,
    label: '盘中虚假申报',
    children: [
      {value: 1, label: '频繁虚假申报买入'},
      {value: 2, label: '频繁虚假申报卖出'},
      {value: 3, label: '双向申报异常（申买实卖）'},
      {value: 4, label: '双向申报异常（申卖实买）'}
    ]
  }, {
    value: 3,
    label: '涨跌停板虚假申报',
    children: [
      {value: 1, label: '涨停板虚假申报'},
      {value: 2, label: '跌停板虚假申报'},
      {value: 3, label: '尾盘封涨停'},
      {value: 4, label: '尾盘封跌停'}
    ]
  }, {
    value: 4,
    label: '涨跌停板大额申报',
    children: [
      {value: 1, label: '涨停板大额申报后反向交'},
      {value: 2, label: '跌停板大额申报后反向交易'}
    ]
  }, {
    value: 5,
    label: '拉升（打压）股票开盘价格',
    children: [
      {value: 1, label: '拉升开盘价'},
      {value: 2, label: '打压开盘价'},
      {value: 3, label: '拉升开盘价后卖出'},
      {value: 4, label: '打压开盘价后买入'}
    ]
  }, {
    value: 6,
    label: '拉升（打压）股票盘中价格',
    children: [
      {value: 1, label: '股票盘中拉升'},
      {value: 2, label: '股票盘中打压'},
      {value: 3, label: '股票盘中拉升后卖出'},
      {value: 4, label: '股票盘中打压后买入'},
      {value: 5, label: '拉升至涨停后卖出'},
      {value: 6, label: '打压至跌停后买入'},
      {value: 7, label: '大宗交易接盘方卖出异常'}
    ]
  }, {
    value: 7,
    label: '拉升（打压）收盘价格',
    children: [
      {value: 1, label: '拉升股票收盘价'},
      {value: 2, label: '打压股票收盘价'},
      {value: 3, label: '拉升股票收盘价后卖出'},
      {value: 4, label: '打压股票收盘价后买入'}
    ]
  }, {
    value: 8,
    label: '拉升（打压）债券价格',
    children: [
      {value: 1, label: '债券盘中拉升'},
      {value: 2, label: '债券盘中打压'},
      {value: 3, label: '拉升债券收盘价'},
      {value: 4, label: '打压债券收盘价'}
    ]
  }, {
    value: 9,
    label: '拉升（打压）基金价格',
    children: [
      {value: 1, label: '基金盘中拉升'},
      {value: 2, label: '基金盘中打压'}
    ]
  }, {
    value: 10,
    label: '反向交易',
    children: [
      {value: 1, label: '隔日反向交易'},
      {value: 2, label: '日内反向交易'}
    ]
  }, {
    value: 11,
    label: '对倒',
    children: [
      {value: 1, label: '一码通对倒'},
      {value: 2, label: '关联账户对倒'}
    ]
  }, {
    value: 12,
    label: '大宗交易异常',
    children: [
      {value: 1, label: '大宗交易高买低卖'}
    ]
  }, {
    value: 13,
    label: '买入风险警示股超限',
    children: [
      {value: 1, label: '买入风险警示股超限'}
    ]
  }, {
    value: 14,
    label: '程序化交易异常',
    children: [
      {value: 1, label: '程序化交易异常'}
    ]
  }]
export const DIFFERENTIATION = [
  {
    value: 1,
    label: '正常'
  }, {
    value: 2,
    label: '差异化层级'
  }]
