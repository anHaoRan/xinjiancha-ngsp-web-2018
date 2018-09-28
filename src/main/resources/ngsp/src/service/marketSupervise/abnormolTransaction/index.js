import {
  get
} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

// 异常交易统计监测-业务分类预警-当前交易日数据
export function getBusinessClassAlarmToday() {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/get-business-todayData')
}

// 异常交易统计监测-业务分类预警-历史数据
export function getBusinessClassAlarmHistory(startDate, endDate) {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/get-business-historyData?startDate=' + startDate + '&endDate=' + endDate)
}

// 异常交易统计监测-产品分类预警-当前交易日数据
export function getProductClassAlarmToday() {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/get-product-todayData')
}

// 异常交易统计监测-产品分类预警-历史数据
export function getProductClassAlarmHistory(startDate, endDate) {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/get-product-historyData?startDate=' + startDate + '&endDate=' + endDate)
}

// 异常交易统计监测-自律监管分类预警-当前交易日数据
export function getRegulatoryClassAlarmToday() {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/supervision-stabilityTodayData')
}

// 异常交易统计监测-自律监管分类预警-历史数据
export function getRegulatoryClassAlarmHistory(startDate, endDate) {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/supervision-stabilityHistoryData?startDate=' + startDate + '&endDate=' + endDate)
}

// 异常交易统计监测-异常交易监管-当前交易日数据
export function getAbnormalClassAlarmToday() {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/supervision-abnormalTodayData')
}

// 异常交易统计监测-异常交易监管-历史数据
export function getAbnormalClassAlarmHistory(startDate, endDate) {
  return get(requestPrefix + '/fluct/abnormal-trans/v1/supervision-abnormalHistoryData?startDate=' + startDate + '&endDate=' + endDate)
}
