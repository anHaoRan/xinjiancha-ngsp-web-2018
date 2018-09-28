import { get, post } from '../../utils/api'
import { requestPrefix } from '../../utils/constants'

// 自定义页面-更新订阅的页面模块信息
export function updateCustomSubscribes (params) {
  return post(requestPrefix + '/admin/v1/page-modules/update', params)
}

// 自定义页面-订阅模块
export function customSubscribe (params) {
  return post(requestPrefix + '/admin/v1/page-module/subscribe', params)
}

// 自定义页面-取消订阅模块
export function customCancel (params) {
  return post(requestPrefix + '/admin/v1/page-module/cancel', params)
}

// 自定义页面-获取用户订阅情况列表
export function getSubscribeStatus (params) {
  return get(requestPrefix + '/admin/v1/page-modules/subscribe-status' + params)
}

// 自定义页面-获取用户订阅的页面模块
export function getSubscribedModules (params) {
  return get(requestPrefix + '/admin/v1/page-modules/subscribed' + params)
}

// 首页 - 预警趋势
export function getAlarmTrend () {
  return get(requestPrefix + '/alarm/warning/v1/get-alarm-trend')
}
