import {
  post
} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

// 高级查询--分时日K接口
export function postTimeDayChartData(params) {
  return post(requestPrefix + '/fluct/operate-monitor/v1/get-index-market-monitor', params)
}

// 高级查询--内外盘差接口
export function getNetbuy(params) {
  return post(requestPrefix + '/fluct/index/v1/get-sale-sold-data', params)
}

// 证券运行监测-分时图(日K)叠加
export function postOverlayChart(params) {
  return post(requestPrefix + '/fluct/index/v1/market-compose', params)
}

// 证券运行监测-钻取表格
export function postTableData(params) {
  return post(requestPrefix + '/dataviz/v1/pumpdata', params)
}
