import {
  get,
  post // eslint-disable-line
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 异常波动--仪表盘
export function getWaveInfoData () {
  return get(requestPrefix + '/fluct/abnormal-fluct/v1/get-fluct-abnoram-risk-indicator')
}

// 异常波动--三分钟主要振幅指数
export function getThreeIndexData () {
  return get(requestPrefix + '/fluct/abnormal-fluct/v1/get-fluct-abnoram-index-amplitude')
}

// 异常波动--pbu3分钟最大交易金额
export function getPbuMemberData () {
  return get(requestPrefix + '/fluct/abnormal-fluct/v1/get-fluct-abnoram-pbu-amount')
}

// 异常波动--会员3分钟最大交易金额
export function getMemberData () {
  return get(requestPrefix + '/fluct/abnormal-fluct/v1/get-fluct-abnoram-member-amount')
}
