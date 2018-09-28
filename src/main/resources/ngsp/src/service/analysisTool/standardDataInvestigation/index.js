import {post} from '../../../utils/api'
import {requestPrefix} from '../../../utils/constants'

// 标准化数据协查--查询数据统一接口
export function getDayTradeHis(params) {
  // return post('http://196.131.7.24:23333/customqry/stddataqry', params) //测试
  return post(requestPrefix + '/customqry/stddataqry', params)
}
