// 自定义查询接口
import {post} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

// 回购越权交易--查询接口
export function postBuyBackUltraVires(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/repurchase-surpass', params)
}

// 收益互换统计
export function postProfitExchangeStatistics(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/profit-exchange', params)
}

// 集合竞价虚拟交易
export function postVirtualTransaction(params) {
  return post(requestPrefix + '/specialqry/speclqry/v1/assem-bid-price', params)
}
