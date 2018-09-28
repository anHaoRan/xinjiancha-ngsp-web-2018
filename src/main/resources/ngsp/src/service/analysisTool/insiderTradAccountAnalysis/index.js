import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 内幕交易分析接口
// 任务列表查询接口
export function getTaskList (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/analysis-task/query', params)
}

// 新增任务保存接口
export function saveTask (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/analysis-task/savetask', params)
}

// 删除新建任务接口
export function deleteTask (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/analysis-task/deletetask', params)
}

// 当前任务是否自带内幕知情人信息
export function hasInsiderInfo (params) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/parameter-set/hasInsiderInfo?sourceProId=' + params)
}

// 内幕交易分析参数页面接口

/* 复核任务接口 */

// 获取复核任务数据
export function getCheckedTaskData (taskId, stockCode) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/parameter-set/query?taskId=' + taskId + '&stockCode=' + stockCode)
}

/* 分析任务时接口 */

// 上市公司重大事项下拉菜单接口
export function getCompanyImportantThing () {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/publicquery')
}

// 获取默认复牌日期接口
export function getDefaultResumptionDate (params) {
  return get(`${requestPrefix}/specialqry/speclqry/v1/insider-trading/parameter-set/getResumptionDate`, params)
}

// 接收表格数据接口
export function getTableData (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/parameter-set/insiderSet', params)
}

// 设置
export function getTableChartData (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/parameter-set/set', params)
}

// 进行宏观分析接口
export function macroAnalysis (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/parameter-set/saveArea', params)
}

// 宏观分析接口

// 公司股价及交易量走势图
export function getTransactionStream (params) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/trade-trend/shIndex-query?taskId=' + params)
}

export function getRegion (checkStartDate, checkEndDate, stockCode) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/trade-trend/shIndex-summary-query?checkStartDate=' + checkStartDate + '&checkEndDate=' + checkEndDate + '&stockCode=' + stockCode)
}

// 公司基本信息和重大事项
export function getBasicInfo (taskId, pageIdx, pageRw) {
  if (!pageIdx && !pageRw) {
    return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/info-matters/query?taskId=' + taskId)
  }
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/info-matters/query?taskId=' + taskId + '&pageIdx=' + pageIdx + '&pageRw=' + pageRw)
}

// 进一步分析选中结果
export function addAccountListOfBasicinfo (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/info-matters/analysis', params)
}

// 持股集中度趋势图
export function getHoldDegree (params) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/hold-concentration/query?taskId=' + params)
}

// 持股单一账户变化图
export function getSingleAccount (params) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/hold-account-change/query?taskId=' + params)
}

// 公司大宗交易
export function getBlockTrade (taskId, pageIdx, pageRw) {
  if (!pageIdx && !pageRw) {
    return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/block-trade/query?taskId=' + taskId)
  }
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/block-trade/query?taskId=' + taskId + '&pageIdx=' + pageIdx + '&pageRw=' + pageRw)
}

// 持股前100名账户列表
export function getListOfTopHundred (taskId, pageIdx, pageRw) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/hold-top-account/query?taskId=' + taskId + '&pageIdx=' + pageIdx + '&pageRw=' + pageRw)
}

// 前100名持股统计占比
export function getStatisticsOfHundred (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/hold-top-account/infoQuery', params)
}

// 前100名进一步分析选中结果
export function addAccountListOfHundred (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/hold-top-account/analysis', params)
}

// 内幕知情人交易情况汇总表
export function getInsiderDetailSum (taskId, pageIdx, pageRw) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/insider-info/query?taskId=' + taskId + '&pageIdx=' + pageIdx + '&pageRw=' + pageRw)//
}

// 交易按日明细表数据
export function getInsiderDetailSingle (params, stockCode) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/insider-info/infoQuery?taskId=' + params + '&accountCode=' + stockCode)
}

// 更改任务状态
export function changeTaskstatus (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/changeStatus-analysis', params)
}

// 完成任务
export function finishTask (params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/insider-trading/macro-analysis/conclusion-save', params)
}

// 复核人员查看分析人员结论
export function getAnalyserConclusion (params) {
  return get(requestPrefix + '/specialqry/speclqry/v1/insider-trading/analysis-conclusion?taskId=' + params)
}
