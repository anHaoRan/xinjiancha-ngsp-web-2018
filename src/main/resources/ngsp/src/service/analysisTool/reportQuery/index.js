import {get, post} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

// 报告配置
export function postReportDispose(params) {
  return post(requestPrefix + '/fluct/report/v1/manage/add', params)
}

// 报告配置查询
export function getReportDisposeList() {
  return get(requestPrefix + '/fluct/report/v1/manage/list')
}

// 报告列表查询
export function postReportListQuery(params) {
  return post(requestPrefix + '/fluct/report/v1/report/list', params)
}

// 手动生成报告
export function getHandleReport(code, reportId) {
  return get(requestPrefix + '/fluct/report/v1/analysis-generate-report?code=' + code + '&reportId=' + reportId)
}
