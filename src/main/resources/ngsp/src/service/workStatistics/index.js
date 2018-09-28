import { get, post } from '../../utils/api'
import { requestPrefix } from '../../utils/constants'

// 自律监管统计 - 自律监管走势图
export function selfRegulationTrend (params) {
  return post(requestPrefix + '/bpm/v1/gztj/selfSupervise-map', params)
}

// 自律监管统计 - 排名前十统计 - 账户统计
export function selfRegulationTopTenAccount (params) {
  return post(requestPrefix + '/bpm/v1/gztj/selfSupervise-topten-acct', params)
}

// 自律监管统计 - 排名前十统计 - 营业部统计
export function selfRegulationTopTenSalePart (params) {
  return post(requestPrefix + '/bpm/v1/gztj/selfSupervise-topten-salePart', params)
}

// 自律监管统计 - 排名前十统计 - 会员统计
export function selfRegulationTopTenMember (params) {
  return post(requestPrefix + '/bpm/v1/gztj/selfSupervise-topten-member', params)
}

// 自律监管统计 - 监管函件统计 - 按月度统计
export function selfRegulationLettersMonths (params) {
  return post(requestPrefix + '/bpm/v1/gztj/selfSupervise-letter', params)
}

// 自律监管统计 - 监管函件统计 - 按会员维度统计
export function selfRegulationLettersMember (params) {
  return post(requestPrefix + '/bpm/v1/gztj/selfSupervise-letter-member', params)
}

// 异常行为统计 - 异常行为走势图 - 折线图
export function abnormalBehaviorTrend (params) {
  return post(requestPrefix + '/bpm/v1/gztj/unusual-trend', params)
}

// 异常行为统计 - 异常行为走势图 - 饼图
export function abnormalBehaviorTrendPie (params) {
  return get(requestPrefix + '/bpm/v1/gztj/unusual-trend-pie?abnormalBehav2=' + params)
}

// 异常行为统计 - 异常行为分类柱图 - 总数
export function abnormalBehaviorClassifySum (params) {
  return post(requestPrefix + '/bpm/v1/gztj/unusual-trend-barSum', params)
}

// 异常行为统计 - 异常行为分类柱图 - 二级异常分类
export function abnormalBehaviorClassifySub (params) {
  return post(requestPrefix + '/bpm/v1/gztj/unusual-trend-barSub', params)
}

// 异常行为统计 - 异常行为排名前十 - 会员统计
export function abnormalBehaviorTopTenMember (params) {
  return post(requestPrefix + '/bpm/v1/gztj/unusual-trend-member-topN', params)
}

// 异常行为统计 - 异常行为排名前十 - 营业部统计
export function abnormalBehaviorTopTenSalePart (params) {
  return post(requestPrefix + '/bpm/v1/gztj/unusual-trend-salePart-topN', params)
}

// 异常行为统计 - 异常行为排名前十 - （一码通）投资者
export function abnormalBehaviorTopTenAccount (params) {
  return post(requestPrefix + '/bpm/v1/gztj/unusual-trend-ymt-topN', params)
}

// 分析报告统计 - 函件按月统计
export function analysisReportMonth (params) {
  return post(requestPrefix + '/bpm/v1/gztj/analysisReport-letter', params)
}

// 分析报告统计 - 函件按人统计
export function analysisReportPerson (params) {
  return post(requestPrefix + '/bpm/v1/gztj/analysisReport-procePerson', params)
}

// 数据协查统计 - 数据协查分类柱图 - 拟稿人下拉接口
export function dataInvestigationClassifyPeople () {
  return get(requestPrefix + '/bpm/v1/gztj/dig-trend-name')
}

// 数据协查统计 - 数据协查走势图
export function dataInvestigationTrend (params) {
  return post(requestPrefix + '/bpm/v1/gztj/dig-trend', params)
}

// 数据协查统计 - 数据协查分类柱图
export function dataInvestigationClassify (params) {
  return post(requestPrefix + '/bpm/v1/gztj/dig-trend-bar', params)
}

// 组织架构树接口
export function getAllRoleOrg (params) {
  return get(requestPrefix + '/admin/admin/v1/getAllRoleOrgs', params)
}

// 人员工作量统计 - 工作量走势图 - 全部小组
export function peopleWorkTrendAll (params) {
  return post(requestPrefix + '/bpm/v1/gztj/work-trend-all', params)
}

// 人员工作量统计 - 工作量走势图 - 某一小组
export function peopleWorkTrend (params) {
  return post(requestPrefix + '/bpm/v1/gztj/work-trend', params)
}

// 人员工作量统计 - 工作量人员前十统计
export function peopleWorkTopTen (params) {
  return post(requestPrefix + '/bpm/v1/gztj/work-trend-roleTopTen', params)
}