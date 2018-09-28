import TableColumnCanClickComponent from '@/components/systemManage/common/TableColumnCanClickComponent'
export const obtainTypeOptions = ['标准化监管', '差异化监管', '纪律处分']
export const differentClassifyOptions = ['涉嫌庄股操纵', '频繁参与异动股炒作', '维护市场稳定', '其他情节较为严重的异常行为']
export const superviseSchemeOptions1 = ['口头警示', '书面警示', '盘中暂停交易', '持续暂停交易']
export const superviseSchemeOptions2 = ['限制交易', '认定为不合格投资者']
export const assistSchemeOptions = ['要求限期改正', '监管谈话', '要求提交合规承诺书']
export const investorMarkOptions = ['列为重点监控账户']
export const investigationOptions = [{
  value: '集合竞价虚假申报',
  label: '集合竞价虚假申报'
}, {
  value: '盘中虚假申报',
  label: '盘中虚假申报'
}, {
  value: '涨跌停板虚假申报',
  label: '涨跌停板虚假申报'
}, {
  value: '涨跌停板大额申报',
  label: '涨跌停板大额申报'
}, {
  value: '拉升（打压）股票开盘价格',
  label: '拉升（打压）股票开盘价格'
}, {
  value: '拉升（打压）股票盘中价格',
  label: '拉升（打压）股票盘中价格'
}, {
  value: '拉升（打压）股票收盘价格',
  label: '拉升（打压）股票收盘价格'
}, {
  value: '拉升（打压）债券价格',
  label: '拉升（打压）债券价格'
}, {
  value: '拉升（打压）基金价格',
  label: '拉升（打压）基金价格'
}, {
  value: '反向交易',
  label: '反向交易'
}, {
  value: '对倒',
  label: '对倒'
}, {
  value: '大宗交易异常',
  label: '大宗交易异常'
}, {
  value: '买入风险警示股超限',
  label: '买入风险警示股超限'
}, {
  value: '程序化交易异常',
  label: '程序化交易异常'
}, {
  value: '调取资料',
  label: '调取资料'
}, {
  value: '其他－股票',
  label: '其他－股票'
}, {
  value: '其他－债券',
  label: '其他－债券'
}, {
  value: '其他－基金',
  label: '其他－基金'
}, {
  value: '其他',
  label: '其他'
}]
export const abnormalBehavOptionsList = [
  [{
    value: '拉升虚拟开盘价',
    label: '拉升虚拟开盘价'
  }, {
    value: '打压虚拟开盘价',
    label: '打压虚拟开盘价'
  }],
  [{
    value: '频繁虚假申报买入',
    label: '频繁虚假申报买入'
  }, {
    value: '频繁虚假申报卖出',
    label: '频繁虚假申报卖出'
  }, {
    value: '双向申报异常（申买实卖）',
    label: '双向申报异常（申买实卖）'
  }, {
    value: '双向申报异常（申卖实买）',
    label: '双向申报异常（申卖实买）'
  }],
  [{
    value: '涨停板虚假申报',
    label: '涨停板虚假申报'
  }, {
    value: '跌停板虚假申报',
    label: '跌停板虚假申报'
  }, {
    value: '尾盘封涨停',
    label: '尾盘封涨停'
  }, {
    value: '尾盘封跌停',
    label: '尾盘封跌停'
  }],
  [{
    value: '涨停板大额申报后反向交易',
    label: '涨停板大额申报后反向交易'
  }, {
    value: '跌停板大额申报后反向交易',
    label: '跌停板大额申报后反向交易'
  }, {
    value: '涨停板大额申报',
    label: '涨停板大额申报'
  }, {
    value: '跌停板大额申报',
    label: '跌停板大额申报'
  }],
  [{
    value: '拉升开盘价',
    label: '拉升开盘价'
  }, {
    value: '打压开盘价',
    label: '打压开盘价'
  }, {
    value: '拉升开盘价后卖出',
    label: '拉升开盘价后卖出'
  }, {
    value: '打压开盘价后买入',
    label: '打压开盘价后买入'
  }],
  [{
    value: '股票盘中拉升',
    label: '股票盘中拉升'
  }, {
    value: '股票盘中打压',
    label: '股票盘中打压'
  }, {
    value: '股票盘中拉升后卖出',
    label: '股票盘中拉升后卖出'
  }, {
    value: '股票盘中打压后买入',
    label: '股票盘中打压后买入'
  }, {
    value: '拉升至涨停后卖出',
    label: '拉升至涨停后卖出'
  }, {
    value: '打压至跌停后买入',
    label: '打压至跌停后买入'
  }, {
    value: '大宗交易接盘方卖出异常',
    label: '大宗交易接盘方卖出异常'
  }],
  [{
    value: '拉升股票收盘价',
    label: '拉升股票收盘价'
  }, {
    value: '打压股票收盘价',
    label: '打压股票收盘价'
  }, {
    value: '拉升股票收盘价后卖出',
    label: '拉升股票收盘价后卖出'
  }, {
    value: '打压股票收盘价后买入',
    label: '打压股票收盘价后买入'
  }],
  [{
    value: '债券盘中拉升',
    label: '债券盘中拉升'
  }, {
    value: '债券盘中打压',
    label: '债券盘中打压'
  }, {
    value: '拉升债券收盘价',
    label: '拉升债券收盘价'
  }, {
    value: '打压债券收盘价',
    label: '打压债券收盘价'
  }],
  [{
    value: '基金盘中拉升',
    label: '基金盘中拉升'
  }, {
    value: '基金盘中打压',
    label: '基金盘中打压'
  }],
  [{
    value: '隔日反向交易',
    label: '隔日反向交易'
  }, {
    value: '日内反向交易',
    label: '日内反向交易'
  }],
  [{
    value: '一码通对倒',
    label: '一码通对倒'
  }, {
    value: '关联账户对倒',
    label: '关联账户对倒'
  }],
  [{
    value: '大宗竞价高买低卖',
    label: '大宗竞价高买低卖'
  }],
  [{
    value: '买入风险警示股超限',
    label: '买入风险警示股超限'
  }],
  [{
    value: '程序化交易异常',
    label: '程序化交易异常'
  }],
  [{
    value: '固定收益平台交易异常',
    label: '固定收益平台交易异常'
  }, {
    value: '涉嫌跨期操纵股',
    label: '涉嫌跨期操纵股'
  }, {
    value: '涉嫌短线操纵股',
    label: '涉嫌短线操纵股'
  }, {
    value: '涉嫌利益输送',
    label: '涉嫌利益输送'
  }, {
    value: '涉嫌内幕',
    label: '涉嫌内幕'
  }, {
    value: '持有证券超比例',
    label: '持有证券超比例'
  }, {
    value: '其他',
    label: '其他'
  }],
  [{
    value: '其他－股票',
    label: '其他－股票'
  }, {
    value: '维稳',
    label: '维稳'
  }],
  [{
    value: '其他－债券',
    label: '其他－债券'
  }],
  [{
    value: '其他－基金',
    label: '其他－基金'
  }],
  [{
    value: '其他异常',
    label: '其他异常'
  }]
]
export const obtainLimitOptions = [
  {
    value: '一个月',
    label: '一个月'
  }, {
    value: '三个月',
    label: '三个月'
  }, {
    value: '半年',
    label: '半年'
  }
]
export const letterTypeOptions = [
  {
    value: '自律监管措施函',
    label: '自律监管措施函',
    children: [{
      value: '市场监察警示函—0105',
      label: '市场监察警示函—0105'
    }, {
      value: '市场监察暂停交易函—0107',
      label: '市场监察暂停交易函—0107'
    }, {
      value: '市场监察约见谈话函—0108',
      label: '市场监察约见谈话函—0108'
    }]
  },
  {
    value: '纪律处分',
    label: '纪律处分',
    children: [
      {
        value: '纪律处分意向书',
        label: '纪律处分意向书'
      }, {
        value: '纪律处分建议书',
        label: '纪律处分建议书'
      }, {
        value: '纪律处分意见书',
        label: '纪律处分意见书'
      }, {
        value: '纪律处分决定书',
        label: '纪律处分决定书'
      }
    ]
  }
]
export const msgtargetOptions = ['综合联络人', '会籍联络人', '合规联络人', '技术联络人']
export const card1Columns = [
  {label: '账户代码', field: 'accountCode'},
  {label: '账户名称', field: 'accountName'},
  {label: '会员名称', field: 'member'},
  {label: '营业部名称', field: 'salepart'},
  {label: '一码通', field: 'oneword'},
  {label: '产品账户', field: 'assortment'},
  {label: '是否可推送中间库', field: 'middlePushCan'},
  {label: '联系人', field: 'contactP1'},
  {label: '联系方式', field: 'contactNo1'}
]
export const card2Columns = [
  {label: '文件编号', field: 'wh', template: TableColumnCanClickComponent},
  {label: '一码通', field: 'oneword'},
  {label: '账户代码', field: 'accountCode'},
  {label: '账户名称', field: 'accountName'},
  {label: '会员名称', field: 'memberName'},
  {label: '营业部名称', field: 'deptName'},
  {label: '调查事项', field: 'investigation'},
  {label: '异常行为', field: 'abnormalBehav'},
  {label: '监管类型', field: 'sveType'},
  {label: '监管措施', field: 'sveMeasures'},
  {label: '开始日期', field: 'startDate'},
  {label: '结束日期', field: 'endDate'}
]
export const card3Columns = [
  {field: 'invesNo', label: '处理单编号', template: TableColumnCanClickComponent},
  {field: 'accountCode', label: '账户代码'},
  {field: 'abnormalBehav', label: '异常行为'},
  {field: 'accountName', label: '账户名称'},
  {field: 'salepart', label: '营业部名称'},
  {field: 'investigation', label: '调查事项'},
  {field: 'securityId', label: '证券代码'},
  {field: 'obtainType', label: '调取类型'},
  {field: 'oneword', label: '一码通'},
  {field: 'createDate', label: '创建日期'}
]
