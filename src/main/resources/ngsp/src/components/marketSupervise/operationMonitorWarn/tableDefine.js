// 实时预警信息列表
export const ALARM_LIST_COLUMNS = [
  {field: 'alarmID', label: '序号', width: '3%', align: 'center'},
  {field: 'status', label: '状态', width: '3%', align: 'center', formatter: formatterAlarmStatus1},
  {field: 'alarmStartTime', label: '预警时间', width: '6%', align: 'center'},
  {field: 'securitimesCode', label: '证券代码', width: '6%', align: 'center'},
  {field: 'securitimesName', label: '证券名称', width: '10%', align: 'center'},
  {field: 'alarmRuleName', label: '预警规则名称', width: '10%', align: 'center'},
  {field: 'operatorID', label: '操作者名称', width: '10%', align: 'center'},
  {field: 'alarmType', label: '预警类型', width: '10%', align: 'center'},
  {field: 'watchOBName', label: '监控对象', width: '10%', align: 'center'},
  {field: 'alarmLevel', label: '预警级别', width: '6%', align: 'center'},
  {field: 'alarmStatus', label: '预警状态', width: '6%', align: 'center', formatter: formatterAlarmStatus}
];

function formatterAlarmStatus(row) {
  if (row.alarmStatus == 1) {
    return '新预警';
  } else if (row.alarmStatus == 3) {
    return '继续观察';
  } else if (row.alarmStatus == 6) {
    return '关闭预警';
  } else if (row.alarmStatus == 9) {
    return '虚警';
  }
  return ''
}

function formatterAlarmStatus1(row) {
  if (row.alarmStatus == 1) {
    return '';
  } else if (row.alarmStatus == 3) {
    return '√';
  } else if (row.alarmStatus == 6) {
    return '√';
  } else if (row.alarmStatus == 9) {
    return '√';
  }
  return ''
}
