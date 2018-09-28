import {
  get,
  post
} from '../../../utils/api'
import { requestPrefix } from '../../../utils/constants'

// 分类成交统计-获取机构类型
export function getInvestorTypeData (dataType, tag1) {
  return get(requestPrefix + '/admin/v1/link-no/tag1?dataType=' + dataType + '&tag1=' + tag1)
}

// 分类投资者成交统计(八宫格)-图像条件
export function getCondition () {
  return get(requestPrefix + '/fluct/investor-classifieds-trade-statis/v1/get-personalized-chartsetups')
}

// 分类投资者成交统计(八宫格)-根据设置条件反馈图表数据
export function postPictureData (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-statis/v1/get-chartdata-by-setup', params)
}

// 分类投资者成交统计(八宫格)-修改用户个性化设置
export function postUserPersonSet (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-statis/v1/update-personalized-chartsetups', params)
}

// 分类投资者成交统计(八宫格)-增加用户个性化设置
export function postAddPersonSet (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-statis/v1/add-personalized-chartsetups', params)
}

// 分类投资者成交统计(八宫格)-删除图表
export function postDeletePicture (params) {
  return post(requestPrefix + '/fluct/investor-classifieds-trade-statis/v1/delete-personalized-chartsetups', params)
}

// 分类投资者成交统计(八宫格)-默认设置
export function getDefaultSet () {
  return get(requestPrefix + '/fluct/investor-classifieds-trade-statis/v1/reset-personalized-chartsetups')
}
