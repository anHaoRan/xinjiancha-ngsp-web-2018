import { get, post } from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export const specialqry = requestPrefix + '/specialqry'
export const regularqry = requestPrefix + '/regularqry'

/*
 * 实时监控分析-订单薄详情
 * @param params
 * @returns {*}
 */
export function orderRetain (params) {
  return post(specialqry + '/monitor/v1/order-retain', params)
}

/*
 * 实时监控分析-订单薄详情_档位
 * @param params
 * @returns {*}
 */
export function orderLevel (params) {
  return post(specialqry + '/monitor/v1/order-level', params)
}

/*
 * 实时监控分析-当日多股同列
 * @param params
 * @returns {*}
 */
export function stockeColumnDay (params) {
  return post(specialqry + '/monitor/v1/stocke-column-day', params)
}

/*
 * 元数据-获取无关联带Tag1（子类） 【产品类型】公共接口
 * @param params
 * @returns {*}
 */
export function getProductType2 (params) {
  return get(requestPrefix + '/admin/v1/link-no/tag1', params)
}

/*
 * 实时监控分析-成交统计
 * @param params
 * @returns {*}
 */
export function bargainStat (params) {
  return post(regularqry + '/product/v1/monitor/bargainStat', params)
}

/*
 * 实时监控分析-申报详情
 * @param params
 * @returns {*}
 */
export function declaredetail (params) {
  return post(regularqry + '/declaredetail', params)
}

/*
 * 实时监控分析-申报统计
 * @param params
 * @returns {*}
 */
export function postDeclaredCountData (params) {
  return post(regularqry + '/product/v1/monitor/orderTotal', params)
}

/*
 * 实时监控分析-成交详情
 * @param params
 * @returns {*}
 */
export function postDealDetailData (params) {
  return post(regularqry + '/product/v1/monitor/bargaindetail', params)
}

/*
 * 实时监控分析-持有统计
 * @param params
 * @returns {*}
 */
export function holdstat (params) {
  return post(regularqry + '/product/v1/monitor/holdstat', params)
}

/*
 * 实时监控分析-持股集中度
 * @param params
 * @returns {*}
 */
export function holdStockConcentrationData (params) {
  return post(regularqry + '/positiondegree', params)
}

/*
 * 实时监控分析-成交统计-账户组统计导出
 * @returns {*}
 */
export function countTableExport () {
  return '/regularqry/product/v1/monitor/bargainStat/countTable-export'
}

/*
 * 实时监控分析-成交统计-买表导出
 * @returns {*}
 */
export function buyTableExport () {
  return '/regularqry/product/v1/monitor/bargainStat/buyTable-export'
}

/*
 * 实时监控分析-成交统计-卖表导出
 * @returns {*}
 */
export function saleTableExport () {
  return '/regularqry/product/v1/monitor/bargainStat/saleTable-export'
}

/*
 * 实时监控分析-当日多股同列-导出
 * @returns {*}
 */
export function stockeColumnDayExport () {
  return '/specialqry/monitor/v1/stocke-column-day-export'
}

/*
 * 实时监控分析-订单薄详情-导出
 * @returns {*}
 */
export function orderRetainExport () {
  return '/specialqry/monitor/v1/order-retain-export'
}
