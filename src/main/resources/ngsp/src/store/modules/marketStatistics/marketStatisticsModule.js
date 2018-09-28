// 市场统计查询--参与者查询
/* import {downloadInvestor} from "../../../service/marketSupervise/classifiedInvestorMonitoring" */
import moment from 'moment/moment'
import {
  downloadBazaar // 市场统计统计查询 【参与者查询】按条件下载数据
} from '../../../service/analysisTool/marketStatistics'

moment.locale('zh-cn')

export default {
  state: {},
  getters: {},
  mutations: {},
  action: {
    // 市场统计统计查询 【参与者查询】按条件下载数据
    downloadBazaarData (store, data) {
      let chartName = store.state.chartName
      let tradeDate = store.state.tradeDate
      let startTime = store.state.startTime
      let endTime = store.state.endTime
      let params = {
        'type': chartName === 'MonitorTime' ? 'time' : 'day',
        'indexCode': store.state.currentIndexCode,
        'tradeDate': tradeDate === '' ? '' : moment(tradeDate).format('YYYY-MM-DD'),
        'startTime': startTime === '' ? '' : moment(startTime).format('HHmm'),
        'endTime': endTime === '' ? '' : moment(endTime).format('HHmm'),
        'gridType': data[0], // investor: 表示分类表格 account: 表示账户表格 vocStock: 行业个股表格
        'investorType': store.state.investorType, // 0: 分类投资者 1: 自定义分类投资者
        'investors': store.state.investors, // 类别名称 多个用逗号分隔
        'orderField': store.state.orderField,
        'orderType': store.state.orderType,
        'invacctNos': store.state.chooseAccount, // 账户代码 多个用逗号分隔
        'swOrderField': store.state.swOrderField,
        'swOrderType': store.state.swOrderType,
        'wdOrderField': store.state.wdOrderField,
        'wdOrderType': store.state.wdOrderType,
        'cusOrderField': store.state.cusOrderField,
        'cusOrderType': store.state.cusOrderType,
        'stockOrderField': store.state.stockOrderField,
        'stockOrderType': store.state.stockOrderType,
        'tableColumns': data[1]
      }
      downloadBazaar(params)
    }
  }
}

// // @click="downloadInvestorExcel"
// downloadBazaarExcel(){
//   let tableColumns = [
//     {"sheetName": "分类投资者", "fileColumns": this.$refs.cfi.columns},
//     {"sheetName": "自定义分类投资者", "fileColumns": this.$refs.cmi.columns}
//   ];
//   // 使用例子
//   this.$store.dispatch('downloadBazaarData',['investor', tableColumns]);
// }

