import TableColumnCanClickComponent from '@/components/systemManage/common/TableColumnCanClickComponent'

export const card1Columns = [
  {
    label: '账户代码',
    field: 'accountCode',
    isTemplate: true
  },
  {
    label: '上报账户名称',
    field: 'accountName'
  },
  {
    label: '会员名称',
    field: 'member'
  },
  {
    label: '营业部名称',
    field: 'salepart'
  },
  {
    label: '一码通',
    field: 'oneword'
  },
  {
    label: '账户分类',
    field: 'assortment'
  }
]
export const card2Columns = [
  {
    label: '文件编号',
    field: 'wh',
    template: TableColumnCanClickComponent
  },
  {
    label: '一码通',
    field: 'oneword'
  },
  {
    label: '账户代码',
    field: 'accountCode'
  },
  {
    label: '账户名称',
    field: 'accountName'
  },
  {
    label: '会员名称',
    field: 'memberName'
  },
  {
    label: '营业部名称',
    field: 'deptName'
  },
  {
    label: '调查事项',
    field: 'investigation'
  },
  {
    label: '异常行为',
    field: 'abnormalBehav'
  },
  {
    label: '监管类型',
    field: 'sveType'
  },
  {
    label: '监管措施',
    field: 'sveMeasures'
  },
  {
    label: '开始日期',
    field: 'startDate'
  },
  {
    label: '结束日期',
    field: 'endDate'
  }
]
export const card3Columns = [
  {
    field: 'invesNo',
    label: '处理单编号',
    template: TableColumnCanClickComponent
  },
  {
    field: 'accountCode',
    label: '账户代码'
  },
  {
    field: 'abnormalBehav',
    label: '异常行为'
  },
  {
    field: 'accountName',
    label: '账户名称'
  },
  {
    field: 'salepart',
    label: '营业部名称'
  },
  {
    field: 'investigation',
    label: '调查事项'
  },
  {
    field: 'securityId',
    label: '证券代码'
  },
  {
    field: 'obtainType',
    label: '调取类型'
  },
  {
    field: 'oneword',
    label: '一码通'
  },
  {
    field: 'createDate',
    label: '创建日期'
  }
]
export const letterTypeOptions = [
  {
    value: '核查报告',
    label: '核查报告',
    children: [{
      value: '核查报告',
      label: '核查报告'
    }, {
      value: '核查补充报告',
      label: '核查补充报告'
    }]
  }, {
    value: '异动报告',
    label: '异动报告',
    children: [{
      value: '异动报告',
      label: '异动报告'
    }]
  }, {
    value: '定期报告',
    label: '定期报告',
    children: [{
      value: '日报',
      label: '日报'
    }, {
      value: '周报',
      label: '周报'
    }, {
      value: '月报',
      label: '月报'
    }, {
      value: '季报',
      label: '季报'
    }, {
      value: '半年报',
      label: '半年报'
    }, {
      value: '年报',
      label: '年报'
    }]
  }, {
    value: '临时报告',
    label: '临时报告',
    children: [{
      value: '新股上市首日报告',
      label: '新股上市首日报告'
    }, {
      value: '盘中临时停牌公告',
      label: '盘中临时停牌公告'
    }, {
      value: '权证最后交易日报告',
      label: '权证最后交易日报告'
    }, {
      value: '其它临时报告',
      label: '其它临时报告'
    }, {
      value: '投资者教育报告',
      label: '投资者教育报告'
    }, {
      value: '信访投诉处理报告',
      label: '信访投诉处理报告'
    }, {
      value: '异常交易调查报告',
      label: '异常交易调查报告'
    }]
  }, {
    value: '信息快报',
    label: '信息快报',
    children: [{
      value: '信息快报核查',
      label: '信息快报核查'
    }]
  }, {
    value: '研究报告',
    label: '研究报告',
    children: [{
      value: '监管研究报告',
      label: '监管研究报告'
    }]
  }, {
    value: '专题报告',
    label: '专题报告',
    children: [{
      value: '监管专题报告',
      label: '监管专题报告'
    }]
  }, {
    value: '走访报告',
    label: '走访报告',
    children: [{
      value: '走访调研报告',
      label: '走访调研报告'
    }]
  }, {
    value: '来访记录',
    label: '来访记录',
    children: [{
      value: '会员来访报告',
      label: '会员来访报告'
    }]
  }
]
export const sendWayOptions = ['本部门存档', '传真', '纸质', '电话', '口头通知', '电子邮件', 'OA']
export const sendDeptOptions = [
  {
    value: '本所',
    label: '本所',
    children: [{
      value: '发行上市部',
      label: '发行上市部'
    }, {
      value: '上市公司监管一部',
      label: '上市公司监管一部'
    }, {
      value: '会员部',
      label: '会员部'
    }, {
      value: '基金业务部',
      label: '基金业务部'
    }, {
      value: '债券业务部',
      label: '债券业务部'
    }, {
      value: '其他部门',
      label: '其他部门'
    }, {
      value: '市场监察部',
      label: '市场监察部'
    }, {
      value: '所领导',
      label: '所领导'
    }, {
      value: '上市公司监管二部',
      label: '上市公司监管二部'
    }, {
      value: '法律部',
      label: '法律部'
    }]
  }, {
    value: '证监会',
    label: '证监会',
    children: [{
      value: '稽查局',
      label: '稽查局'
    }, {
      value: '稽查总队',
      label: '稽查总队'
    }, {
      value: '基金部',
      label: '基金部'
    }, {
      value: '其他部门',
      label: '其他部门'
    }, {
      value: '处罚委',
      label: '处罚委'
    }, {
      value: '市场监管部',
      label: '市场监管部'
    }]
  }, {
    value: '地方证监局',
    label: '地方证监局',
    children: [{
      value: '北京局',
      label: '北京局'
    }, {
      value: '天津局',
      label: '天津局'
    }, {
      value: '河北局',
      label: '河北局'
    }, {
      value: '山西局',
      label: '山西局'
    }, {
      value: '内蒙古局',
      label: '内蒙古局'
    }, {
      value: '辽宁局',
      label: '辽宁局'
    }, {
      value: '吉林局',
      label: '吉林局'
    }, {
      value: '黑龙江局',
      label: '黑龙江局'
    }, {
      value: '上海局',
      label: '上海局'
    }, {
      value: '江苏局',
      label: '江苏局'
    }, {
      value: '浙江局',
      label: '浙江局'
    }, {
      value: '安徽局',
      label: '安徽局'
    }, {
      value: '福建局',
      label: '福建局'
    }, {
      value: '江西局',
      label: '江西局'
    }, {
      value: '山东局',
      label: '山东局'
    }, {
      value: '河南局',
      label: '河南局'
    }, {
      value: '湖北局',
      label: '湖北局'
    }, {
      value: '湖南局',
      label: '湖南局'
    }, {
      value: '广东局',
      label: '广东局'
    }, {
      value: '广西局',
      label: '广西局'
    }, {
      value: '海南局',
      label: '海南局'
    }, {
      value: '重庆局',
      label: '重庆局'
    }, {
      value: '四川局',
      label: '四川局'
    }, {
      value: '贵州局',
      label: '贵州局'
    }, {
      value: '云南局',
      label: '云南局'
    }, {
      value: '西藏局',
      label: '西藏局'
    }, {
      value: '陕西局',
      label: '陕西局'
    }, {
      value: '甘肃局',
      label: '甘肃局'
    }, {
      value: '青海局',
      label: '青海局'
    }, {
      value: '宁夏局',
      label: '宁夏局'
    }, {
      value: '新疆局',
      label: '新疆局'
    }, {
      value: '深圳局',
      label: '深圳局'
    }, {
      value: '大连局',
      label: '大连局'
    }, {
      value: '宁波局',
      label: '宁波局'
    }, {
      value: '厦门局',
      label: '厦门局'
    }, {
      value: '青岛局',
      label: '青岛局'
    }, {
      value: '沈阳局',
      label: '沈阳局'
    }, {
      value: '深圳专员办',
      label: '深圳专员办'
    }, {
      value: '上海专员办',
      label: '上海专员办'
    }]
  }, {
    value: '公检法',
    label: '公检法',
    children: [{
      value: '福建省公安厅',
      label: '福建省公安厅'
    }, {
      value: '辽宁本溪公安',
      label: '辽宁本溪公安'
    }, {
      value: '广州市公安局',
      label: '广州市公安局'
    }, {
      value: '上海市公安局',
      label: '上海市公安局'
    }, {
      value: '公安部',
      label: '公安部'
    }, {
      value: '北京公安局',
      label: '北京公安局'
    }, {
      value: '山东省公安厅',
      label: '山东省公安厅'
    }, {
      value: '深圳公安',
      label: '深圳公安'
    }]
  }, {
    value: '其他单位',
    label: '其他单位',
    children: [{
      value: '其他单位',
      label: '其他单位'
    }]
  }, {
    value: '中金所',
    label: '中金所',
    children: [{
      value: '监查部',
      label: '监查部'
    }]
  }
]
export const clueTypeOptions = [
  '内幕交易',
  '市场操纵',
  '利益输送—股票',
  '利益输送—债券',
  '超比例持股',
  '老鼠仓',
  '短线交易',
  '其它—股票',
  '其它—债券'
]
export const sourceTypeOptions = [
  '联合监管',
  '舆情分析',
  '主动发现',
  '定期核查',
  '重点监控账户组',
  '重点监控证券',
  '其它'
]
export const assortmentOptions = {
  '1': '超大户(1000万元以上)',
  '2': '大户(300-1000万元)',
  '3': '中户(50-300万元)',
  '4': '小户(10-50万元)',
  '5': '散户(10万元以下)',
  'A': '开放式基金',
  'B': '封闭式基金',
  'C': '专户',
  'D': '社保',
  'E': 'QFII',
  'F': '保险',
  'G': '券商自营',
  'H': '券商集合理财',
  'I': '信托',
  'J': '年金',
  'M': 'RQFII',
  'O': '香港账户'
}