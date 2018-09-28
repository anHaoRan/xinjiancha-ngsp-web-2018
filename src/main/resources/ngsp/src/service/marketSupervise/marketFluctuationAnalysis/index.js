import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 市场波动分析_历史报告列表
export function getHistoryReport (type, pageIndex, pageSize) {
  return get(requestPrefix + '/fluct/report/v1/his-reports?type=' + type + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize)
}

// 市场波动分析_报告上传
export function postUploadReport (params) {
  return post(requestPrefix + '/fluct/report/v1/update', params)
}

// 市场波动分析_当日报告展示
export function getReportShow (type) {
  return get(requestPrefix + '/fluct/report/v1/view-contents?type=' + type)
}

// 市场波动分析_恢复系统报告
export function recoverReport (params) {
  return post(requestPrefix + '/fluct/report/v1/recover', params)
}

// 市场波动分析_报告预览
export function previewReport (type) {
  return get(requestPrefix + '/fluct/report/v1/displayPDF?type=' + type)
}
