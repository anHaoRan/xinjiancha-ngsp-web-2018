import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 运行监测预警-预警类型框
export function getWarnType () {
  return get(requestPrefix + '/fluct/monitor-alarm/v1/get-alarm-type')
}

// 运行监测预警-预警状态
export function getWarnStatus () {
  return get(requestPrefix + '/admin/v1/link-no?dataType=warnningDealStatus')
}

// 运行监测预警-表格查询结果展示
export function postTableData (params) {
  return post(requestPrefix + '/fluct/monitor-alarm/v1/get-alarm-result', params)
}

// 运行监测预警-批处理
export function postDetail (params) {
  return post(requestPrefix + '/fluct/monitor-alarm/v1/processing-bath', params)
}

// 运行监测预警-叠加图
export function getAlarmCharts (alarmType, alarmRuleCode) {
  return get(requestPrefix + '/fluct/monitor-alarm/v1/get-alarm-detail?alarmType=' + alarmType + '&alarmRuleCode=' + alarmRuleCode)
}

// 运行监测预警-叠加选项
export function getOverlayList () {
  return get(requestPrefix + '/fluct//monitor-alarm/v1/get-alarm-rule')
}

// 运行监测预警-日志记录
export function getLogRecord (alarmID) {
  return get(requestPrefix + '/fluct/monitor-alarm/v1/get-alarm-life-history?alarmID=' + alarmID)
}

// 运行监测预警-预警基本信息
export function getAlarmInfo (alarmID, alarmRuleCode) {
  return get(requestPrefix + '/fluct/monitor-alarm/v1/get-alarm-basic-info?alarmID=' + alarmID + '&alarmRuleCode=' + alarmRuleCode)
}

// 运行监测预警-删除预警记录
export function deleteAlarmRecord (bizFlowID) {
  return get(requestPrefix + '/fluct/monitor-alarm/v1/delete-alarm-life-history?bizFlowID=' + bizFlowID)
}

// 运行监测预警-编辑预警记录
export function editAlarmRecord (params) {
  return post(requestPrefix + '/fluct/monitor-alarm/v1/update-alarm-life-history-log', params)
}
