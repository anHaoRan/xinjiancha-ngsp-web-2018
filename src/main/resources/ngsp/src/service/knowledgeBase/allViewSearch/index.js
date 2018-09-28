import {
  post
} from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

/*
 * 全景搜索-预警历史信息
 * @param params
 * @returns {*}
 */
export function getAlarmBy360degree (params) {
  return post(`${requestPrefix}/bpm/history/search/360degree/alarmhistory`, JSON.stringify(params))
}
/*
 * 全景搜索-异常行为历史信息
 * @param params
 * @returns {*}
 */
export function getAbnormalbehaveBy360degree (params) {
  return post(`${requestPrefix}/bpm/history/search/360degree/abnormalbehave`, JSON.stringify(params))
}
/*
 * 全景搜索-自律监管历史信息
 * @param params
 * @returns {*}
 */
export function getSlsAccountBy360degree (params) {
  return post(`${requestPrefix}/bpm/history/search/360degree/slsaccount`, JSON.stringify(params))
}
/*
 * 全景搜索-线索报告历史信息
 * @param params
 * @returns {*}
 */
export function getCrpBy360Degree (params) {
  return post(`${requestPrefix}/bpm/history/search/360degree/crpaccount`, JSON.stringify(params))
}