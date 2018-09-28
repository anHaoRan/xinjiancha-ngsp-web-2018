import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 实时预警表格数据请求接口
export function alarmListRealTime (params) {
  return post(requestPrefix + '/alarm/warning/v1/get-today-alarm-result', params)
}

// 盘中表格数据请求接口
export function SuspensionBuletinList (params) {
  return post(requestPrefix + '/alarm/warning/v1/get-pzgg-file', params)
}

// 历史表格数据请求
export function getHistoryAlarmResult (params) {
  return post(requestPrefix + '/alarm/warning/v1/get-history-alarm-result', params)
}

// 实时图标转换
export function getPageTableData (params) {
  function getParams (params) {
    var str = ''
    for (var k in params) {
      if (params[k]) {
        if (k == 'operatorPersion' && $.isEmptyObject(params[k])) {
          continue
        }
        str += k + '=' + params[k] + '&'
      }
    }
    return str.substring(0, str.length - 1)
  }

  return get(requestPrefix + '/alarm/warning/getPageTableData?type=today&' + getParams(params))
}

// 历史图表转换
export function getHPageTableData (params) {
  function getParams (params) {
    var str = ''
    for (var k in params) {
      if (params[k]) {
        if (k == 'operatorPersion' && $.isEmptyObject(params[k])) {
          continue
        }
        str += k + '=' + params[k] + '&'
      }
    }
    return str.substring(0, str.length - 1)
  }

  return get(requestPrefix + '/alarm/warning/getPageTableData?type=history&' + getParams(params))
}

// 批处理
export function processingBath (params) {
  return post(requestPrefix + '/alarm/warning/processingBath', params)
}

// 证券代码
export function stockQuery (params) {
  return get(requestPrefix + '/admin/v1/securities/fuzzy?fuzzyChars=' + params)
}

// 预警类型
export function alarmType (dataType, tag1) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag1)
}

// 板块
export function insType () {
  return get(requestPrefix + '/alarm/warning/getInsType')
}

// 板块1
export function insType1 () {
  return get(requestPrefix + '/alarm/warning/getBoardType')
}

// 实时导出
export function expotFileT (params) {
  return post(requestPrefix + '/alarm/warning/today-list/export/prepare', params)
}

// 历史导出
export function expotFile (params) {
  return post(requestPrefix + '/alarm/warning/history-list/export/prepare', params)
}
