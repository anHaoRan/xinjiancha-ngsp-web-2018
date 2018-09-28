import { get, post } from '@/utils/api'
import { requestPrefix } from '@/utils/constants'
import { getAccessToken } from '../../utils/storageUtil'

export const request = requestPrefix + '/fluct'

/*  *******************证券*************************  */

//  维稳-证券 板块贡献度居前
export function getBoardTop (params) {
  return get(request + '/stock-market-stability/v1/get-board-top?tradeDate=' + params)
}

//  维稳-证券 证券贡献度居前
export function getProductTop (params) {
  return post(request + '/stock-market-stability/v1/get-product-top', params)
}

//  维稳-证券-获取账户买入卖出 前50
export function getAccountBsTop (params) {
  return post(request + '/stock-market-stability/v1/get-account-bs-top', params)
}

//  维稳-证券-获取自定义板块信息
export function getBoardInfo () {
  return get(request + '/stock-market-stability/v1/get-board-info')
}

//  维稳-证券-添加自定义板块 单笔
export function addBoard (params) {
  return post(request + '/stock-market-stability/v1/add-board', params)
}

//  维稳-证券-删除自定义板块
export function deleteBoard (params) {
  return post(request + '/stock-market-stability/v1/delete-board', params)
}

//  维稳-证券-修改自定义板块
export function updateBoard (params) {
  return post(request + '/stock-market-stability/v1/update-board', params)
}

/*  *******************机构*************************  */

//  维稳-机构 分类机构卖出汇总
export function getInvestorSoldTotal (params) {
  return post(request + '/org-market-stability/v1/get-investor-sold-total', params)
}

//  维稳-机构 指定机构类型(自定义机构)公司交易居前
export function getCompanySoldTop (params) {
  return post(request + '/org-market-stability/v1/get-company-sold-top', params)
}

//  维稳-机构 指定投资者 公司交易详情 交易汇总 集合竞价
export function getCompanyTradeInfo (params) {
  return post(request + '/org-market-stability/v1/get-company-trade-info', params)
}

//  维稳-机构 指定投资下公司交易详情 汇总详情
export function getCompanyTradeDetail (params) {
  return post(request + '/org-market-stability/v1/get-company-trade-detail', params)
}

//  维稳-机构 指定投资下公司交易详情 汇总详情 分时
export function getCompanyTradeDetailMinute (params) {
  return post(request + '/org-market-stability/v1/get-company-trade-detail-minute', params)
}

//  维稳-机构 指定投资者下 公司交易详情 账户汇总
export function getCompanyAccountInfo (params) {
  return post(request + '/org-market-stability/v1/get-company-account-info', params)
}

//  维稳-机构 指定交易投资者下 公司交易详情 账户详情（汉子描述部分）
export function getCompanyBasicInfo (params) {
  return post(request + '/org-market-stability/v1/get-company-basic-info', params)
}

//  维稳-机构 自定义机构 查询自定义机构信息(包含模糊查询)
export function getOrganizationInfo (params) {
  return get(request + `/org-market-stability/v1/get-organization-info?orgName=${params}`)
}

//  维稳-机构 自定义机构 添加自定义机构
export function addOrganization (params) {
  return post(request + '/org-market-stability/v1/add-organization', params)
}

//  维稳-机构 自定义机构 修改自定义机构信息
export function updateOrganization (params) {
  return post(request + '/org-market-stability/v1/update-organization', params)
}

//  维稳-机构 自定义机构 删除自定义机构
export function deleteOrganization (params) {
  return get(request + `/org-market-stability/v1/delete-organization?orgCode=${params}`)
}

//  维稳-机构 自定义机构 根据自定义结构 获取关联账户
export function getOrganizationAccount (params) {
  return get(request + `/org-market-stability/v1/get-organization-account?orgCode=${params}`)
}

//  维稳-机构 自定义机构 关联机构账户
export function addOrganizationAccount (params) {
  return post(request + '/org-market-stability/v1/add-organization-account', JSON.stringify(params))
}

//  维稳-机构 自定义机构 取消关联机构账户
export function deleteRelateAccount (params) {
  return post(request + '/org-market-stability/v1/delete-relate-account', JSON.stringify(params))
}

//  维稳-机构 自定义机构 根据公司查询账户信息
export function getAccount (params) {
  return post(request + '/org-market-stability/v1/get-account', params)
}

/* *******************账户************************* */

//  维稳-账户-自定义处理标记-查询
export function dealMarkDefine () {
  return get(request + `/account-market-stability/v1/deal-mark-define`)
}

//  维稳-账户-自定义处理标记-增加
export function insertDealMarkDef (param) {
  return post(request + `/account-market-stability/v1/insert-deal-mark-def`, param)
}

//  维稳-账户-自定义处理标记-更新
export function updateDealMarkDef (param) {
  return post(request + `/account-market-stability/v1/update-deal-mark-def`, param)
}

//  维稳-账户-自定义处理标记-删除
export function deleteDealMarkDef (param) {
  return get(request + `/account-market-stability/v1/delete-deal-mark-def?cid=${param}`)
}

//  维稳-账户-投资者交易居前统计
export function queryMktrdtop (param) {
  return post(request + `/account-market-stability/v1/query-mktrdtop`, param)
}

//  维稳-账户-投资者成交下午净额
export function queryJepm (param) {
  return post(request + `/account-market-stability/v1/query-jepm`, param)
}

//  维稳-账户-投资者卖出上证180、上证50股票情况
export function querySaleInfo (param) {
  return post(request + `/account-market-stability/v1/query-sale-info`, param)
}

//  维稳-账户-投资者分时买卖金额数据
export function trdDetailChartHalfHour (param) {
  return post(request + `/account-market-stability/v1/trd-detail-chart-half-hour`, param)
}

//  维稳-账户-投资者分时买卖金额数据-每分钟统计频率
export function trdDetailChart (param) {
  return post(request + `/account-market-stability/v1/trd-detail-chart`, param)
}

//  维稳-账户-交易情况集合竞价阶段汇总
export function queryYmtoraccno (param) {
  return post(request + `/account-market-stability/v1/query-ymtoraccno`, param)
}

//  维稳-账户-个股明细
export function listJqueryGrid (param) {
  return post(request + `/account-market-stability/v1/list-jquery-grid`, param)
}

//  维稳-账户-行为特征参数查询
export function getCharactorParam (param) {
  return post(request + `/account-market-stability/v1/get-charactor-param`, param)
}

//  维稳-账户-导出文本
export function accountListByYmtno (param) {
  return post(request + `/account-market-stability/v1/account-list-by-ymtno`, param)
}

//  维稳-账户-投资者处理标记历史-查询
export function queryDealHisData (param) {
  return post(request + `/account-market-stability/v1/query-deal-his-data`, param)
}

//  维稳-账户-投资者处理标记-增加、更新
export function saveDealMark (param) {
  return post(request + `/account-market-stability/v1/save-deal-mark`, param)
}

//  维稳-账户-上证指数分时行情图数据
export function marketTime (param) {
  return get(request + '/index/v1/market-time', param)
}

//  维稳-账户-投资者行为特征计算-程序化交易
export function queryAutoExchange (param) {
  return post(request + `/account-market-stability/v1/query-auto-exchange`, param)
}

//  维稳-账户-投资者行为特征计算-建议暂停-一分钟卖出金额较大
export function queryHugeSale (param) {
  return post(request + `/account-market-stability/v1/query-huge-sale`, param)
}

//  维稳-账户-投资者行为特征计算-建议暂停-净卖出居前
export function queryTopSale (param) {
  return post(request + `/account-market-stability/v1/query-top-sale`, param)
}

//  维稳-账户-投资者行为特征计算-瞬间大额主动卖出
export function hugeSaleActive (param) {
  return post(request + `/account-market-stability/v1/huge-sale-active`, param)
}

//  维稳-账户-投资者行为特征计算-瞬间大额卖出
export function hugeSaleCharactor (param) {
  return post(request + `/account-market-stability/v1/huge-sale-charactor`, param)
}

//  维稳-账户-投资者行为特征计算-瞬间大额买入
export function hugeBuyCharactor (param) {
  return post(request + `/account-market-stability/v1/huge-buy-charactor`, param)
}

//  维稳-账户-投资者行为特征计算-瞬间大额主动买入
export function hugeBuyActive (param) {
  return post(request + `/account-market-stability/v1/huge-buy-active`, param)
}

//  维稳-账户-投资者打压个股信息
export function queryDaya (param) {
  return post(request + `/account-market-stability/v1/query-daya`, param)
}

//  维稳-账户-增加待暂停账户
export function addPauseCount (param) {
  return post(request + `/account-market-stability/v1/add-eup-middle`, param)
}

//  维稳-账户-查询待暂停账户
export function qureyPauseCount (param) {
  return post(request + `/account-market-stability/v1/query-eup-middle`, param)
}

//  维稳-账户-删除待暂停账户
export function deletePauseCount (param) {
  return post(request + `/account-market-stability/v1/delete-eup-middle`, param)
}

//  维稳-账户-更新待暂停账户
export function updatePauseCount (param) {
  return post(request + `/account-market-stability/v1/save-eup-middle`, param)
}

//  维稳-账户-控制类型/买卖方向下拉框
export function controlBuyType (key, chFlg) {
  return get(request + `/account-market-stability/v1/eup-sys-datas?key=` + key + '&chFlg=' + chFlg)
}

//  维稳-账户-查询待暂停账户个数
export function queryPauseNum () {
  return get(request + `/account-market-stability/v1/query-counts-eup`)
}

//  维稳-账户-成交统计表
export function accountDealTable (params) {
  return post(request + `/account-market-stability/v1/trade-statistic`, params)
}

//  维稳-账户-机构-公司交易统计
export function allhanderDerail () {
  return get(request + `/account-market-stability/v1/hand-makeinform`)
}

//  维稳-账户-机构-公司交易统计
export function companyDealTable (params) {
  return post(request + `/org-market-stability/v1/get-gather-statistics`, params)
}

//  维稳-电子归档模块下拉项
export function getDocumentModules () {
  return get(request + `/word-show/v1/modules`)
}

//  维稳-电子归档模块下拉项
export function getDocumentTable (type, modelName, startDate, endDate, pageIndex, pageSize) {
  return get(request + `/word-show/v1/query-file-list?type=` + type + '&modelName=' + modelName + '&startDate=' + startDate + '&endDate=' + endDate + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize)
}

//  维稳-电子归档模块下拉项
export function postUpdateDocument (params) {
  return post(request + `/word-show/v1/update`, params)
}

//  维稳-电子文档下载
export function gfnDownloadDocument (origin, reserved) {
  window.location.href = requestPrefix + '/fluct/word-show/v1/download?origin=' + origin + '&reserved=' + reserved + '&access_token=' + getAccessToken()
}

//  获取设置权限信息
export function getSetUpMesg () {
  return get(request + `/account-market-stability/v1/get-acctStayMessage`)
}
