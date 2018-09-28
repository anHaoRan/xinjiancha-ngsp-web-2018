import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 高级查询-获取机构类型
export function getInvestorType (dataType, tag1) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag1)
}

// 监控日志-查询日志列表
export function getLogList (params) {
  return post(`${requestPrefix}/admin/watch-lore/v1/get-watch-log`, params)
}

// 监控日志-查询日志详情
export function getLogDetail (params) {
  return get(requestPrefix + '/admin/watch-lore/v1/get-watch-log-detail', params)
}

// 监控日志-日志列表导出
export function newLogRecord (params) {
  return post(`${requestPrefix}/admin/watch-lore/v1/record-watch-log`, params)
}
