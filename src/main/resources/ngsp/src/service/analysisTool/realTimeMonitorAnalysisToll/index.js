import {get, post} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

// 实时监控分析工具-股票行情-日K
export function postStockDayK(params) {
  return post(requestPrefix + '/specialqry/monitor/v1/market-monitor-day', params)
}

// 实时监控分析工具-股票行情-分时图
export function postStockTimeData(params) {
  return post(requestPrefix + '/specialqry/monitor/v1/market-monitor-time', params)
}

// 实时监控分析工具-十档行情
export function postStockTenData(params) {
  return post(requestPrefix + '/specialqry/monitor/v1/market-monitor-timeten', params)
}

// 实时监控分析工具-监控股票
export function postMonitorStockData(params) {
  return post(requestPrefix + '/specialqry/monitor/v1/market-monitor-stock', params)
}

// 实时监控分析工具-监控账户组
export function postMonitorGroupData(params) {
  return post(requestPrefix + '/specialqry/monitor/v1/market-monitor-accountArr', params)
}

// 实时监控分析工具-监控账户组明细
export function postMonitorGroupDetailData(params) {
  return post(requestPrefix + '/specialqry/monitor/v1/market-monitor-accountDetail', params)
}

// 实时监控分析工具-模糊查询
export function postFuzzyQuery(params) {
  return post(requestPrefix + '/specialqry/monitor/v1/market-monitor-fuzzy', params)
}

// 实时监控分析工具-交易类型元数据
export function getDealTypeData(dataType, linkOneValue) {
  return get(requestPrefix + '/admin/v1/link-one?dataType=' + dataType + '&linkOneValue=' + linkOneValue)
}

// 平台类型公共接口
export function getPlatformTypeData(dataType) {
  return get(requestPrefix + '/admin/v1/link-no?dataType=' + dataType)
}
