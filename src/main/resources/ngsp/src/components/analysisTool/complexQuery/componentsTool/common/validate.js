/*
 *自定义验证方法: 主要针对证券代码，账户代码，一码通代码等批量校验
 *只能为逗号隔开的字符串或数组  示例：propsParams: {stocks: '387678,9898993,3333', accounts: '387678,9898993,3333'}  或者 propsParams: {stocks: ['387678', '387678'], accounts: ['387678', '387678']}
 */
import Vue from 'vue'
/* A股证券代码 */
let AStockNoRex = /^6\d{5}$/
/* 港股证券代码 */
let HKstockNoRex = /^[0-9]{5}$/
/* 沪股证券代码 */
let stockNoRex = /^[0-9]{6}$/
/* 账户代码 */
let accountNoRex = /^[A-Z]{1}[0-9]{9}$/
/* 一码通代码 */
let imtNoRex = /^[0-9]*$/
/* 18或15位身份证号 */
let identityNoRex = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/

export const selfValidateMethod = (propsParams) => {
  if (propsParams.AStocks) {
    if (typeof propsParams.AStocks === 'string') {
      propsParams.AStocks = propsParams.AStocks.split(',')
    }
    for (let i = 0; i < propsParams.AStocks.length; i++) {
      let stock = propsParams.AStocks[i]
      if (stock.trim() !== '' && !AStockNoRex.test(stock)) {
        Vue.prototype.$message.error('传入的A股证券代码有误')
        return false
      }
    }
  }
  if (propsParams.HKstocks) {
    if (typeof propsParams.HKstocks === 'string') {
      propsParams.HKstocks = propsParams.HKstocks.split(',')
    }
    for (let i = 0; i < propsParams.HKstocks.length; i++) {
      let HKstock = propsParams.HKstocks[i]
      if (HKstock.trim() !== '' && !HKstockNoRex.test(HKstock)) {
        Vue.prototype.$message.error('传入的港股证券代码有误')
        return false
      }
    }
  }
  if (propsParams.stocks) {
    if (typeof propsParams.stocks === 'string') {
      propsParams.stocks = propsParams.stocks.split(',')
    }
    for (let i = 0; i < propsParams.stocks.length; i++) {
      let stock = propsParams.stocks[i]
      if (stock.trim() !== '' && !stockNoRex.test(stock)) {
        Vue.prototype.$message.error('传入的证券代码有误')
        return false
      }
    }
  }
  if (propsParams.accounts) {
    if (typeof propsParams.accounts === 'string') {
      propsParams.accounts = propsParams.accounts.split(',')
    }
    for (let i = 0; i < propsParams.accounts.length; i++) {
      let account = propsParams.accounts[i]
      if (account.trim() !== '' && !accountNoRex.test(account)) {
        Vue.prototype.$message.error('传入的账户代码有误')
        return false
      }
    }
  }
  if (propsParams.accountGroupA) {
    if (typeof propsParams.accountGroupA === 'string') {
      propsParams.accountGroupA = propsParams.accountGroupA.split(',')
    }
    for (let i = 0; i < propsParams.accountGroupA.length; i++) {
      let account = propsParams.accountGroupA[i]
      if (account.trim() !== '' && !accountNoRex.test(account)) {
        Vue.prototype.$message.error('传入的账户组A代码有误')
        return false
      }
    }
  }
  if (propsParams.accountGroupB) {
    if (typeof propsParams.accountGroupB === 'string') {
      propsParams.accountGroupB = propsParams.accountGroupB.split(',')
    }
    for (let i = 0; i < propsParams.accountGroupB.length; i++) {
      let account = propsParams.accountGroupB[i]
      if (account.trim() !== '' && !accountNoRex.test(account)) {
        Vue.prototype.$message.error('传入的账户组B代码有误')
        return false
      }
    }
  }
  if (propsParams.imtNos) {
    if (typeof propsParams.imtNos === 'string') {
      propsParams.imtNos = propsParams.imtNos.split(',')
    }
    for (let i = 0; i < propsParams.imtNos.length; i++) {
      let imtNo = propsParams.imtNos[i]
      if (imtNo.trim() !== '' && !imtNoRex.test(imtNo)) {
        Vue.prototype.$message.error('传入的一码通代码有误')
        return false
      }
    }
  }
  if (propsParams.identityNos) {
    if (typeof propsParams.identityNos === 'string') {
      propsParams.identityNos = propsParams.identityNos.split(',')
    }
    for (let i = 0; i < propsParams.identityNos.length; i++) {
      let identityNo = propsParams.identityNos[i]
      if (identityNo.trim() !== '' && !identityNoRex.test(identityNo)) {
        Vue.prototype.$message.error('传入的身份证号码有误')
        return false
      }
    }
  }
  return true
}
