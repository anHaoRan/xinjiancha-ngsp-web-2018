import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 线索雷达-公司重大事项核查定期驱动-获取未保存数据和已保存数据
export function getAlarmMajorEvents() {
  return post(requestPrefix + '/alarm/majorevnt/v1/major-events')
}

// 线索雷达-公司重大事项核查定期驱动-修改公司部来函
export function editAlarmMajorEvents(params) {
  return post(requestPrefix + '/alarm/majorevnt/v1/major-events-upt', params)
}

// 线索雷达-公司重大事项核查定期驱动-撤回
export function backAlarmMajorEvents(params) {
  return post(requestPrefix + '/alarm/majorevnt/v1/major-events-back', params)
}

// 线索雷达-趋同交易预警信息-保存设置提醒日期数据
export function convTradesSaveSet(params) {
  return post(requestPrefix + '/alarm/majorevnt/v1/major-qt-saveSet', params)
}

// 线索雷达-趋同交易预警信息-保存设置提醒全部数据
export function convTradesSave(params) {
  return post(requestPrefix + '/alarm/majorevnt/v1/major-qt-save', params)
}

// 线索雷达-趋同交易预警信息-是否是组长
export function convTradesIsLeader(params) {
  return get(requestPrefix + '/admin/public/v1/getClueRes?username=' + params)
}

// 线索雷达-趋同交易预警信息-查询日期
export function convTradesCheckDate(params) {
  return get(requestPrefix + '/alarm/majorevnt/v1/major-qt-select?md=' + params)
}

// 线索雷达-趋同交易预警信息-获取组员信息
export function convTradesGetMembers(params) {
  return get(requestPrefix + '/admin/public/v1/getGroupMembers?username=' + params)
}

// 线索雷达-趋同交易预警信息-日期筛选数据
export function convTradesQuery(params) {
  return post(requestPrefix + '/alarm/majorevnt/v1/major-qt', params)
}