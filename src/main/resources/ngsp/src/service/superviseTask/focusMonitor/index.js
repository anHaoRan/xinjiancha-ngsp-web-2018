import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 监测任务-重点监控证券发起流程
export function postFocusMonitorStart (params) {
  return post(requestPrefix + '/bpm/mscprocess/v1/launch', params)
}

// 监测任务-重点监控证券保存
export function postFocusMonitorSave (params) {
  return post(requestPrefix + '/bpm/mscprocess/v1/save', params)
}

// 监测任务-重点监控证券审批流程
export function getInfoIdData () {
  return get(requestPrefix + '/bpm/infoId/new')
}

// 监测任务-重点监控证券审批流程
export function postFocusMonitorApproval (params) {
  return post(requestPrefix + '/bpm/mscprocess/v1/examine', params)
}

// 获取用户账户组类别
export function getUserRoles (username) {
  return get(requestPrefix + '/uaa/uums/getUserRoles?username=' + username)
}

// 监测任务-重点监控列表获取
export function postFocusMonitorTable (params) {
  return post(requestPrefix + '/bpm/mscprocess/v1/msclist', params)
}

// 监测任务-重点监控证券表单信息获取
export function getFormInfo (instanceId) {
  return get(requestPrefix + '/bpm/mscprocess/v1/mscinfo?instanceId=' + instanceId)
}

// 监测任务-重点监控证券编号获取
export function getStockNum (processName) {
  return get(requestPrefix + '/bpm/v1/no/next?processName=' + processName)
}

// 监测任务-重点监控证券删除
export function deleteMonitorStock (params) {
  return post(requestPrefix + '/bpm/mscprocess/v1/delete', params)
}

// 监测任务-重点监控证券变更流程
export function changeMonitorStock (params) {
  return post(requestPrefix + '/bpm/mscprocess/v1/alter', params)
}

// 监测任务-重点监控证券获取账户组信息
export function getStockGroupInfo (securityId) {
  return get(requestPrefix + '/bpm/mscprocess/v1/getRelatedMagRecs?securityId=' + securityId)
}

// 监测任务-历史审核意见
export function getHistorySuggest (instanceId) {
  return get(requestPrefix + '/bpm/historyopinion/msc/' + instanceId)
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
