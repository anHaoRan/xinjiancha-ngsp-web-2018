// 特定工具接口
// import Vue from 'vue'

import {get, post} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

// // 生成随机数req
// export function randomReq() {
//   let s = [], uuid = '',
//     hexDigits = '0123456789abcdef';
//   for (var i = 0; i < 36; i++) {
//     s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//   }
//   s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
//   s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
//   s[8] = s[13] = s[18] = s[23] = '_';
//   uuid = s.join('');
//   return uuid;
// }
//
// // 日期GMT转普通时间格式xxxx-xx-xx
// export function gmtToStr(time) {
//   let date = new Date(time), str = '', year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
//   if (month < 10) {
//     month = '0' + month;
//   }
//   if (day < 10) {
//     day = '0' + day;
//   }
//   str = year + '-' + month + '-' + day;
//   return str;
// }

// 内幕交易账户数据测算-线索
export function postTradeAccountMeasure(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/account-testing', params)
}

// 趋同交易 【趋同交易一 】 -- 查询接口
export function postconverTradeOne(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/simltract1-elk', params)
}

// 指令趋同 --查询接口
export function postorderQuery(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/directsml-elk', params)
}

// 趋同交易 【趋同交易二】 私募类型下拉
export function getMetadataTag1(dataType, tag1) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag1);
}

// 趋同交易 【趋同交易二 】 -- 机构账户导入
export function getOrginazationExport(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/organizat-acct', params)
}

// 趋同交易 【趋同交易二 】 -- 查询
export function postconverTradeTwo(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/simltract2-elk', params)
}

// 短线交易定期筛查 -- 查询
export function postShortTradeScreening(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/trading-positions', params)
}

// 趋同交易 【趋同交易二 】 -- 钻取
export function postconverTradeTwoDrilling(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/simltract2-click', params)
}

// 私募季报 -- 查询
export function postPrivatePlacement(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/private-equity', params)
}

// 请求查询参数保存接口
export function saveParams(params) {
  return post(requestPrefix + '/specialqry/sas/saveQueryParam', params)
}

// SAS执行出错修改查询状态接口
export function updateQueryStatus(params) {
  return post(requestPrefix + '/specialqry/sas/updateQueryStatus', params)
}

// SAS执行结果,导入MySQL数据库
export function saveResult(params) {
  return post(requestPrefix + '/specialqry/sas/saveResult', JSON.stringify(params))
}

// 请求获取查询状态列表
export function getMainResultByUser(params) {
  return get(requestPrefix + '/specialqry/sas/getMainResultByUser' + params)
}

// 请求获取查询结果接口
export function getResult(params) {
  return get(requestPrefix + '/specialqry/sas/getResult' + params)
}

// 内幕交易违法所得查询接口
export function getInsiderDealingIllegalGains(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/illegalget-elk', params)
}

/*
 * 导出表格数据（XLS/CSV）
 *
 * @param {params} 条件集合及导出格式
 */
export function downloadData(params) {
  return get(requestPrefix + '/specialqry/sas/exportFile' + params)
}

/*
 * 根据搜索条件查询盈利计算结果
 *
 * @param {params} 查询条件集合
 */
export function searchProfitMaking(params) {
  return post(requestPrefix + '/specialqry/profit/getResult', JSON.stringify(params))
}
//
// // ******************机构账户导入********************
// // 趋同交易  【趋同交易二】 元数据-查询指定投资者分类下所有账户-带分页
// export function getOrginvestorsType() {
//   return get('http://196.123.135.164:3000/mock/11/admin/v1/orginvestors');
// }
// // 趋同交易【趋同交易二 】 元数据-模糊查询指定投资者分类下账户-带分页
// export function getFuzzyQuery() {
//   return get('http://196.123.135.164:3000/mock/11/admin/v1/orginvestors/fuzzy');
// }
//
// // 趋同交易 【趋同交易一 】 -- 查询接口
// export function postSimltract(params) {
//   return post(requestPrefix + '/specialqry/speclqry/v1/simltract1', params);
// }
// // 趋同交易【趋同交易二 】--查询接口
// export function postReferQuery(params) {
//   return post(requestPrefix + '/specialqry/speclqry/v1/simltract2', params);
// }
//
// // 趋同交易 【趋同交易一、二 、指令 】 查询任务列表
// export function postQueryTask(params) {
//   return post(requestPrefix + '/specialqry/tasksas/v1/tasklist', params);
// }
//
// // 趋同交易 【趋同交易一、二 、指令】查询结果
// export function postSearchResult(params) {
//   return post(requestPrefix + '/specialqry/tasksas/v1/qrytask', params);
// }
/* 重点监控证券 */
export function searchKeyMonitorSecurity(params) {
  return post(requestPrefix + '/admin/admin/v1/get-allhighwatchsercurityinfo-bypage', JSON.stringify(params))
}
/* 重点监控账户 */
export function searchKeyMonitorAccounts(params) {
  return post(requestPrefix + '/admin/admin/v1/get-allhighwatchgroup-bypage', JSON.stringify(params))
}
/* 重点监控账户和证券的导出 */
export function keyMonitorAccountsAndSecurityExport() {
  return '/admin/admin/v1/hignwatch/export'
}
/* 重点监控证券 monitorId 获取 infoId */
export function getSecurityInfoIdByMonitorId(params) {
  return get(requestPrefix + '/bpm/mscprocess/v1/mscinfoid', params)
}
/* 重点监控账户 monitorId 获取 infoId */
export function getAccountInfoIdByMonitorId(params) {
  return get(requestPrefix + '/bpm/magprocess/v1/maginfoid', params)
}
/* 重点监控账户饼图 */
export function getAccountChartInfo(params) {
  return post(requestPrefix + '/admin/admin/v1/get-allhighwatchgroup-pie', JSON.stringify(params))
}
/* 重点监控证券饼图 */
export function getSecurityChartInfo(params) {
  return post(requestPrefix + '/admin/admin/v1/get-allhighwatchsecurity-pie', JSON.stringify(params))
}