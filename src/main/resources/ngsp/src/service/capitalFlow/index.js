import {
  get
} from '../../utils/api'
import { requestPrefix } from '../../utils/constants'

// 分类成交统计-获取机构类型
export function getInvestorTypeData (dataType, tag1) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag1)
}
