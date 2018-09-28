import TableColumnCanClickComponent from '@/components/systemManage/common/TableColumnCanClickComponent'
import TableDownLoadFileComponent from '../component/TableDownLoadFileComponent'
export const selfSupervisionStatusDit = ['创建中', '审核中', '分配中', '待发函', '待回函', '待归档', '已归档']
export const clueReportStatusDit = ['创建', '实时组长审核', '分配', '拟稿', '复核', '线索组长审核', '部门审批', '所领导审批', '拟稿人确认', '发函', '办结']
export const isReort = ['否', '是']
export const clueClassify = ['关注类', '调查类']
export const superviseSchemeOptions = ['口头警示', '书面警示', '盘中暂停交易', '持续暂停交易', '限制交易', '认定为不合格投资者']
export const acctTypeOptions = {
  'A': '公募基金',
  'C': '基金专户',
  'D': '社保基金',
  'E': 'QFII',
  'M': 'RQFII',
  'F': '保险机构',
  'I': '信托产品',
  'J': '企业年金',
  'G': '券商自营',
  'H': '券商集合理财',
  'O': '沪股通',
  'Z': '其他机构',
  '1': '超大户（1000万元以上）',
  '2': '大户（300-1000万元）',
  '3': '中户（50-300万元）',
  '4': '小户（10-50万元）',
  '5': '散户（10万元以下）'
}
export const formatterSelfSupervisionStatus = (value) => {
  return selfSupervisionStatusDit[value.status]
}
export const formatterClueReportStatus = (value) => {
  return clueReportStatusDit[value.status]
}
export const formatterIsReport = (value) => {
  return isReort[value.clueBranch]
}
export const formatterClueClassify = (value) => {
  return clueClassify[value.needReport]
}
export const formatterSuperviseScheme = (value) => {
  let superviseSchemes = value.superviseScheme.split(',')
  return superviseSchemes.map(v => {
    return superviseSchemeOptions[v]
  }).join('，')
}
export const formatAccttype = (val) => {
  return acctTypeOptions[val.accttype]
}

export const columns = [
  [
    {
      field: 'alarm_id',
      align: 'center',
      width: '80',
      label: '编号',
      template: TableColumnCanClickComponent
    },
    {field: 'alarm_date', align: 'left', width: '80', label: '预警日期'},
    {field: 'alarm_time', align: 'left', width: '80', label: '预警时间'},
    {field: 'board_name', align: 'left', width: '80', label: '板块'},
    {field: 'alarm_type', align: 'left', width: '80', label: '预警类型'},
    {field: 'seccode_name', align: 'left', width: '120', label: '证券代码及简称'},
    {field: 'ymtid', align: 'left', width: '80', label: '一码通'},
    {field: 'orgtype', align: 'left', width: '120', label: '投资者分类'},
    {field: 'account_code', align: 'left', width: '80', label: '账户代码'},
    {field: 'account_name', align: 'left', width: '80', label: '账户名称'},
    {field: 'member_name', align: 'left', width: '80', label: '会员名称'},
    {field: 'branch_name', align: 'left', width: '120', label: '营业部名称'},
    {field: 'watch_ob_name', align: 'left', width: '80', label: '监控对象'},
    {field: 'alarm_level', align: 'left', width: '80', label: '预警级别'},
    {field: 'alarm_rule_name', align: 'left', width: '120', label: '预警规则名称'},
    {field: 'alarm_desc', align: 'left', width: '80', label: '预警说明'},
    {field: 'operator_name', align: 'left', width: '80', label: '处理人'},
    {field: 'alarm_proc_date', align: 'left', width: '80', label: '处理日期'},
    {field: 'alarm_proc_time', align: 'left', width: '80', label: '处理时间'},
    {field: 'alarm_proc_advice', align: 'left', width: '80', label: '处理结论'}
  ], // 预警历史信息
  [
    {
      label: '编号', field: 'warningNo'
    },
    {
      label: '标题', field: 'title', template: TableColumnCanClickComponent
    },
    {
      label: '证券代码及简称', field: 'securityid'
    },
    {
      label: '调查事项', field: 'investigation'
    },
    {
      label: '异常行为', field: 'abnormalBehav'
    },
    {
      label: '事项描述', field: 'logs'
    },
    {
      label: '一码通', field: 'oneword'
    },
    {
      label: '产品账户', field: 'assortment'
    },
    {
      label: '账户名称', field: 'accountName'
    },
    {
      label: '账户代码', field: 'accountCode'
    },
    {
      label: '会员名称', field: 'member'
    },
    {
      label: '营业部名称', field: 'salepart'
    },
    {
      label: '创建人', field: 'proposer'
    },
    {
      label: '创建日期', field: 'startDate'
    },
    {
      label: '发函人', field: 'sendPerson'
    },
    {
      label: '发函日期', field: 'sendDate'
    },
    {
      label: '发函附件', field: 'attachment', template: TableDownLoadFileComponent
    },
    {
      label: '状态', field: 'status', formatter: formatterSelfSupervisionStatus
    },
    {
      label: '投资者分类', field: 'accttype', formatter: formatAccttype
    }
  ], // 异常行为历史信息
  [
    {label: '编号', field: 'warningNo'},
    {label: '标题', field: 'title', template: TableColumnCanClickComponent},
    {label: '账户名称', field: 'accountName'},
    {label: '账户代码', field: 'accountCode'},
    {label: '一码通', field: 'oneword'},
    {label: '是否产品账户', field: 'assortment'},
    {label: '会员名称', field: 'member'},
    {label: '营业部名称', field: 'salepart'},
    {label: '证券代码及简称', field: 'securityid'},
    {label: '监管措施', field: 'superviseScheme', formatter: formatterSuperviseScheme},
    {label: '调查事项', field: 'investigation'},
    {label: '异常行为', field: 'abnormalBehav'},
    {label: '函件编号', field: 'fileName', template: TableColumnCanClickComponent},
    {label: '函件类型', field: 'letterType2'},
    {label: '发函人', field: 'sendPerson'},
    {label: '发函日期', field: 'sendDate'},
    {label: '函件发送方式', field: ''},
    {label: '中间库状态', field: ''},
    {label: '入库状态', field: ''},
    {label: '存档情况', field: ''},
    {label: '会员已读', field: ''},
    {label: '要求回复', field: ''},
    {label: '已回复', field: ''}
  ], // 自律监管历史信息
  [
    {label: '函件编号', field: 'letterNo'},
    {label: '函件类型', field: 'letterType'},
    {label: '函件名称', field: 'letterAttachment', template: TableDownLoadFileComponent},
    {label: '证券代码及简称', field: 'security'},
    {label: '一码通', field: 'oneword'},
    {label: '投资者分类', field: 'assortment'},
    {label: '账户代码', field: 'accountCode'},
    {label: '账户名称', field: 'accountName'},
    {label: '会员名称', field: 'member'},
    {label: '营业部名称', field: 'salepart'},
    {label: '线索名称', field: 'clueName', template: TableColumnCanClickComponent},
    {label: '线索分类', field: 'clueBranch', formatter: formatterClueClassify},
    {label: '线索类型', field: 'clueTypeText'},
    {label: '线索描述', field: 'clueDesc'},
    {label: '是否上报', field: 'needReport', formatter: formatterIsReport},
    {label: '线索会商纪要', field: 'clueMeetingSummary', template: TableDownLoadFileComponent},
    {label: '拟稿人', field: 'drafter'},
    {label: '创建日期', field: 'startDate'},
    {label: '完成日期', field: 'finishDate'},
    {label: '上报日期', field: 'sendDate'},
    {label: '发函人', field: 'sendPerson'},
    {label: '状态', field: 'status', formatter: formatterClueReportStatus}
  ] // 线索报告历史信息
]
