import {
  get,
  post
} from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export const pubo = requestPrefix // + '/pubo'

/*
 * 舆情监测舆情信息列表-舆情列表
 * @param params
 * @returns {*}
 */
export function getInfoList (params) {
  return post(pubo + '/public-sentiment/v1/get-info-list', params)
}

/*
 * 舆情监测舆情信息列表-舆情分类统计
 * @param params
 * @returns {*}
 */
export function getClassifiedCount (params) {
  return get(pubo + '/public-sentiment/v1/get-classified-count', params)
}

/*
 * 舆情监测舆情信息列表-舆情详情
 * @param params
 * @returns {*}
 */
export function getPublicSentimentDetail (params) {
  return get(pubo + '/public-sentiment/v1/get-public-sentiment-detail', params)
}