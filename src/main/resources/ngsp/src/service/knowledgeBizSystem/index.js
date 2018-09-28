import Vue from 'vue'
import { get, post } from '../../utils/api'
import { requestPrefix } from '../../utils/constants'

// get 参数处理
// function paramsFunction(params){
//   var str='';
//   for( var k in params){
//       str+=k+'='+params[k]+'&';
//     }
//   return str=str.substring(0,str.length-1)
//
// }
// 知识库附件查询列表数据
export function getKnowledgeData(params) {
  function paramsFunction(params) {
    var str = '';
    for (var k in params) {
      str += k + '=' + params[k] + '&';
    }
    return str.substring(0, str.length - 1);
  }
  return get(requestPrefix + '/lore/lores/v1/query-file?' + paramsFunction(params));
}
// return get(requestPrefix + '/fluct/market-overview/m1/latest-sh-stockindex?orderByParams=')

// export function getKnowledgeTypeData(parms) {
//   //return get(requestPrefix + '/fluct/market-overview/m1/latest-sh-stockindex?orderByParams=')
//   return get(requestPrefix + '/fluct/market-overview/welcome')
// }

// noinspection JSAnnotator
// 删除接口
export function tableDeleList(params) {
  var param = {
    'id' : params
  }
  return post(requestPrefix + '/lore/lores/v1/delete-file', param)  // 提交代码接口前添加 lore
}

// 上传接口
export function thandleList(url) {
  return post(requestPrefix + url)
}
