// 实时预警信息列表
export const ALARM_LIST_COLUMNS = [
  {field: 'alarm_id', label: '序号', width: '5%', align: 'center'},
  {field: 'status', label: '状态', width: '3%', align: 'center'},
  {field: 'alarm_time', label: '预警时间', width: '6%', align: 'center'},
  {field: 'securities_code', label: '证券代码', width: '6%', align: 'center'},
  {field: 'stockname', label: '证券名称', width: '10%', align: 'left'},
  {field: 'alarm_rule_name', label: '预警规则名称', width: '10%', align: 'left'},
  {field: 'operator_name', label: '操作者名称', width: '10%', align: 'left'},
  {field: 'alarm_type', label: '预警类型', width: '10%', align: ''},
  {field: 'watch_ob_name', label: '监控对象', width: '10%', align: 'left'},
  {field: 'alarm_level', label: '预警级别', width: '6%', align: 'center'},
  {field: 'alarm_status', label: '预警状态', width: '6%', align: 'center'}
  // {field: "查看", label: "操作", width:"6%",align:"center"},
]

// 历史预警信息列表
export const ALARM_LIST_COLUMNSH = [
  {field: 'alarm_id', label: '序号', width: '5%', align: 'center'},
  {field: 'status', label: '状态', width: '3%', align: 'center'},
  {field: 'alarm_date', label: '预警日期', width: '6%', align: 'center'},
  {field: 'alarm_time', label: '预警时间', width: '6%', align: 'center'},
  {field: 'securities_code', label: '证券代码', width: '6%', align: 'center'},
  {field: 'stockname', label: '证券名称', width: '10%', align: 'left'},
  {field: 'alarm_rule_name', label: '预警规则名称', width: '10%', align: 'left'},
  {field: 'operator_name', label: '操作者名称', width: '10%', align: 'left'},
  {field: 'alarm_type', label: '预警类型', width: '10%', align: 'left'},
  {field: 'attr_watch_ob_name', label: '监控对象', width: '10%', align: 'left'},
  {field: 'alarm_level', label: '预警级别', width: '6%', align: 'center'},
  {field: 'alarm_status', label: '预警状态', width: '6%', align: 'center'}
]
