import { get } from '../../utils/api'
import { requestPrefix } from '../../utils/constants'

// 获取偏移交易日   不要用！！！！ 请使用getRelativeTradeDate
export function tradeDate (params) {
  return get(requestPrefix + '/admin/v1/date/trade/offset?offset=' + params)
}

// 获取当前交易日 不要用！！！！ 请使用getCurTradeDate
export function gitTradeDate () {
  return get(requestPrefix + '/admin/v1/date/trade')
}

/**
 * 获取当前交易日(T日)
 * @returns {*} YYYYMMDD
 */
export function getCurTradeDate () {
  return get(requestPrefix + '/admin/v1/date/trade')
}

/*
 * 获取偏移交易日_T日为基准
 * @params offset 偏移量
 * @returns {*} YYYYMMDD
 */
export function getRelativeTradeDate (offset) {
  return get(requestPrefix + '/admin/v1/date/trade/offset?offset=' + offset)
}

/*
 * 获取给定日期范围内有效交易日范围
 * @params calendarDayBegin 开始日期
 * @params calendarDayEnd 结束日期
 * @returns {*} [ "开始日期或之后最近一个交易日", "结束日期或之前最近一个交易日" ]
 */
export function getTradeRangeDate (calendarDayBegin, calendarDayEnd) {
  return get(requestPrefix + '/admin/v1/date/trade/range/day?calendarDayBegin=' + calendarDayBegin + '&calendarDayEnd=' + calendarDayEnd)
}

/*
 * 获取偏移交易日_指定基准日和日偏移量
 * @param offset 偏移量
 * @param baseDate 基准日
 * @returns {*} YYYYMMDD
 */
export function getRelativeBaseDate (offset, baseDate) {
  return get(requestPrefix + '/admin/v1/date/trade/relative?offset=' + offset + '&baseDateStr=' + baseDate)
}

// 获取无关联带tag1数据
export function getNoTag1MetaData (dataType, tag1) {
  return get(requestPrefix + `/admin/v1/link-no/tag1?dataType=${dataType}&tag1=${tag1}`)
}

// 获取无关联数据
export function getNolinkMetaData (dataType) {
  return get(requestPrefix + `/admin/v1/link-no?dataType=${dataType}`)
}
