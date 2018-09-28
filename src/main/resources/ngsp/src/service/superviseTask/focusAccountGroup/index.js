import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 监测任务-重点监控账户组发起流程
export function postFocusAccountGroupStart (params) {
  return post(requestPrefix + '/bpm/magprocess/v1/launch', params)
}

// 监测任务-重点监控账户组保存
export function postFocusAccountGroupSave (params) {
  return post(requestPrefix + '/bpm/magprocess/v1/save', params)
}

// 监测任务-获取infoId
export function getInfoIdData () {
  return get(requestPrefix + '/bpm/infoId/new')
}

// 监测任务-重点监控账户组审批流程
export function postFocusMonitorApproval (params) {
  return post(requestPrefix + '/bpm/magprocess/v1/examine', params)
}

// 账户明细关联获取
export function getAccountInfo (accountCode) {
  return get(requestPrefix + '/regularqry/v1/accountinfos?accountCode=' + accountCode)
}

// 获取用户账户组组别
export function getUserRoles (username) {
  return get(requestPrefix + '/uaa/uums/getUserRoles?username=' + username)
}

// 监测任务-重点监控账户组列表获取
export function postFocusAccountGroupTable (params) {
  return post(requestPrefix + '/bpm/magprocess/v1/maglist', params)
}

// 监测任务-重点监控账户组表单信息获取
export function getFormInfo (instanceId) {
  return get(requestPrefix + '/bpm/magprocess/v1/maginfo?instanceId=' + instanceId)
}

// 监测任务-重点监控编号获取
export function getStockNum (processName) {
  return get(requestPrefix + '/bpm/v1/no/next?processName=' + processName)
}

// 监测任务-重点监控证券删除
export function deleteAccountGroupStock (params) {
  return post(requestPrefix + '/bpm/magprocess/v1/delete', params)
}

// 监测任务-重点监控证券变更流程
export function changeAccountGroupStock (params) {
  return post(requestPrefix + '/bpm/magprocess/v1/alter', params)
}

// 监测任务-历史审核意见
export function getHistorySuggest (instanceId) {
  return get(requestPrefix + '/bpm/historyopinion/mag/' + instanceId)
}

// 监测任务-撤回流程
export function recallFlow (params) {
  return post(requestPrefix + '/bpm/v2/withdraw', params)
}

// 监测任务-关联线索报告
export function relevanceClueReport (params) {
  return post(requestPrefix + '/bpm/crpprocess/v1/save', params)
}

// 监测任务-获取线索报告信息
export function getClueReportInfo (instanceId) {
  return get(requestPrefix + '/bpm/crpprocess/v1/crpinfo?instanceId=' + instanceId)
}
