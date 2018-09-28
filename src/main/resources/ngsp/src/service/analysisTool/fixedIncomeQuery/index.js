import { get, post } from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 固定收益平台查询--产品查询
export function getProductQueryRes(params) {
  return post(requestPrefix + '/regularqry/fasten-plat/v1/income/incomeproduct', params);
}

// 固定收益平台查询--明细查询
export function getDetailQueryRes(params) {
  return post(requestPrefix + '/regularqry/fasten-plat/v1/income/incomedetail', params);
}

// 固定收益平台查询--账户查询
export function getAccountQueryRes(params) {
  return post(requestPrefix + '/regularqry/fasten-plat/v1/get-account-data', params);
}

// 固定收益平台查询--债券质押式协议回购
export function getBondRepurRes(params) {
  return post(requestPrefix + '/regularqry/fasten-plat/v1/get-bond-pledge-pro-buy-back', params);
}

// 固定收益平台查询--债券质押式协议回购
export function getMarketStatisticsQuery(params) {
  return post(requestPrefix + '/regularqry/fasten-plat/v1/income/market', params);
}
