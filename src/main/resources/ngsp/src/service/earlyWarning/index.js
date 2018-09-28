import {
  get,
  post
} from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export const alarm = requestPrefix + '/alarm'

/*
 * 固化模型查询
 * @param params
 * @returns {*}
 */
export function solidModelQuery (params) {
  return post(alarm + '/solidModel/v1/solidModelQuery', params)
}

/*
 * 预警模型上线下线
 * @param params
 * @returns {*}
 */
export function updateRuleStatus (params) {
  return post(alarm + '/solidModel/v1/updateRuleStatus', params)
}

/*
 * 根据模型编号获取预警固化模型参数和门限
 * @param params
 * @returns {*}
 */
export function getRuleParamLimit (params) {
  return post(alarm + '/solidModel/v1/getRuleParamLimit', params)
}

/*
 * 预警实例新增
 * @param params
 * @returns {*}
 */
export function addAlarmCase (params) {
  return post(alarm + '/alarmCase/v1/addAlarmCase', params)
}

/*
 * 预警实例修改
 * @param params
 * @returns {*}
 */
export function updateAlarmCase (params) {
  return post(alarm + '/alarmCase/v1/updateAlarmCase', params)
}

/*
 * 预警实例查询
 * @param params
 * @returns {*}
 */
export function alarmCaseQuery (params) {
  return post(alarm + '/alarmCase/v1/alarmCaseQuery', params)
}

/*
 * 根据预警实例ID获取预警实例
 * @param params
 * @returns {*}
 */
export function getAlarmCaseById (params) {
  return post(alarm + '/alarmCase/v1/getAlarmCaseById', params)
}

/*
 * 获取监控对象列表
 * @param params
 * @returns {*}
 */
export function getWatchObList (params) {
  return post(alarm + '/alarmCase/v1/getWatchObList', params)
}

/*
 * 常用预警数量变化接口
 * @param params
 * @returns {*}
 */
export function getAlarmAmountResult (params) {
  return get(alarm + '/alarmManage/v1/get-alarm-amount-result', params)
}

/*
 * 监控对象数量变化
 * @param params
 * @returns {*}
 */
export function getWatchObjectAmountResult (params) {
  return get(alarm + '/alarmManage/v1/get-watchObject-amount-result', params)
}

/*
 * 预警监控对象列表
 * @param params
 * @returns {*}
 */
export function searchWatchobjectBycondition (params) {
  return post(requestPrefix + '/admin/admin/v1/search-watchobject-bycondition', params)
}

/*
 * 批量部署预警实例
 * @param params
 * @returns {*}
 */
export function batchDeployAlarmCase (params) {
  return post(alarm + '/alarmCase/v1/batchDeployAlarmCase', params)
}

/*
 * 根据模型编号获取预警固化模型参数
 * @param params
 * @returns {*}
 */
export function getRuleParam (params) {
  return post(alarm + '/solidModel/v1/getRuleParam', params)
}

/*
 * 根据模型编号获取预警固化模型门限
 * @param params
 * @returns {*}
 */
export function getRuleLimit (params) {
  return post(alarm + '/solidModel/v1/getRuleLimit', params)
}

/*
 * 固化模型导出
 * @param params
 * @returns {*}
 */
export function solidModelExport (params) {
  return '/alarm/solidModel/v1/solidModelQuery/export'
}

/*
 * 预警实例导出
 * @param params
 * @returns {*}
 */
export function alarmCaseExport (params) {
  return '/alarm/alarmCase/v1/alarmCaseQuery/export'
}