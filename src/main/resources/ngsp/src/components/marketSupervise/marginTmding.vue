<template>
  <div class='marginTmding'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <div>
      <el-tabs v-model='activeName' @tab-click='handleTabsClick'>
        <el-tab-pane label='融资融券' name='financing'>
          <financing-charts @getTimeData='getTimeData' @getDate='getDate'
                            @getStockCode='getStockCode'></financing-charts>
          <security-count :time='timeObj'></security-count>
          <investor-count :time='timeObj'></investor-count>
        </el-tab-pane>
        <el-tab-pane label='程序化交易' name='routinizationDeal'>
          <el-row :gutter='30'>
            <el-col :span='24'>
              <el-card class="routinizationChart">
                <div slot='header' class='clearfix'>
                  指数行情监测
                </div>
                <deal-charts @getDealTime='getDealTime' @getDealDate='getDealDate'></deal-charts>
              </el-card>
            </el-col>
            <el-col :span='24'>
              <routinization-count :dealTime='dealTimeObj'></routinization-count>
            </el-col>
            <el-col :span='24'>
              <account-count :dealTime='dealTimeObj'></account-count>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label='大股东、董监高减持' name='shareholder'>
          <shareholder v-if="isShow"></shareholder>
        </el-tab-pane>
      </el-tabs>
    </div>
    <double-per-dou-psw @isPass='isPass' @isShow='getShowDilog'
                        :dialogFormVisble='dialogFormVisble'></double-per-dou-psw>
  </div>
</template>
<script>
  import Breadcrumb from '../common/Breadcrumb'
  import CreditAccount from './marginTmding/financing/financingCharts/timeAccount/creditAccount'
  import Financing from './marginTmding/financing/financingCharts/timeAccount/financing'
  import Broker from './marginTmding/financing/financingCharts/timeAccount/broker'
  import RoutinizationCount from './marginTmding/routinizationDeal/routinizationCount'
  import AccountCount from './marginTmding/routinizationDeal/accountCount'
  import DealCharts from './marginTmding/routinizationDeal/dealCharts'
  import FinancingCharts from './marginTmding/financing/financingCharts'
  import InvestorCount from './marginTmding/financing/investorCount'
  import SecurityCount from './marginTmding/financing/securityCount'
  import Shareholder from './marginTmding/shareholder/shareholder'
  import DoublePerDouPsw from '../common/DoublePerDouPsw'

  export default {
    components: {
      Breadcrumb,
      CreditAccount,
      Financing,
      Broker,
      RoutinizationCount,
      AccountCount,
      FinancingCharts,
      InvestorCount,
      SecurityCount,
      DealCharts,
      Shareholder,
      DoublePerDouPsw
    },
    data() {
      return {
        breadcrumbItems: [{
          router: '',
          label: '市场运行监测'
        }, {
          router: '',
          label: '专项监测工作'
        }],
        activeName: 'financing', // tab栏默认项
        farData: {},
        timer: null,
        timeObj: {beginTime: '0930', endTime: '1500', date: '', code: ''},
        dealTimeObj: {beginTime: '0930', endTime: '1500', date: ''},
        dialogFormVisble: false,
        isShow: false,
        sign: true
      }
    },
    mounted() {
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      isPass(val) {
        this.sign = !val
        this.isShow = val
      },
      getShowDilog(val) {
        this.dialogFormVisble = val
      },
      handleTabsClick(tab, event) {
        if (tab.name == 'shareholder') {
          if (this.sign) {
            this.dialogFormVisble = true
            this.isShow = false
          }
        }
      },
      getTimeData(startTime, overTime) {
        this.timeObj.beginTime = startTime
        this.timeObj.endTime = overTime
      },
      getDate(date) {
        this.timeObj.date = date
      },
      getStockCode(code) {
        this.timeObj.code = code
      },
      getDealTime(beginTime, endTime) {
        this.dealTimeObj.beginTime = beginTime
        this.dealTimeObj.endTime = endTime
      },
      getDealDate(date) {
        this.dealTimeObj.date = date
      }
    }
  }
</script>
<style lang='less'>
  [v-cloak] {
    display: none;
  }

  .marginTmding {
    position: relative;
    .el-row {
      .el-card {
        .el-card__body {
          /*padding: 0 20px 20px 20px;*/
        }
      }
    }
  }

  .marginTmding .margin {
    position: relative;
  }

  .marginTmding .margin .time {
    position: absolute;
    right: 100px;
    top: -36px;
    span {
      color: #999
    }
    .el-date-editor .el-range-input {
      background-color: rgba(255, 255, 255, 0);
    }
    .margin-btn {
      position: relative;
      top: -1px;
      span {
        color: #fff;
      }
    }
  }

  .marginTmding .routinizationChart {
    .el-card__body {
      padding: 0px !important;
    }
  }

  .marginTmding .el-tabs__header {
    margin: 0;
  }

  .marginTmding .timeAccount .el-row .el-card {
    height: 340px;
  }

  .marginTmding .el-row .table {
    height: 400px;
  }

  .marginTmding .chart .el-card {
    height: 480px;
  }

  .el-tabs .el-tabs__header .el-tabs__item.is-active {
    color: #14B9B6 !important;
    font-size: 16px;
  }
</style>
