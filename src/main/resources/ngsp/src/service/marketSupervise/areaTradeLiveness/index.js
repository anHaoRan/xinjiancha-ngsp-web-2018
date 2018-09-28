// 异常波动-地图-阈值参数获取
import { get } from '@/utils/api'
import { requestPrefix } from '@/utils/constants'

export function getRegionThresholdParams () {
  return get(requestPrefix + '/fluct/abnormal-fluct/v1/region-threshold')
}
