<template>
  <el-card class='timeAccount' style='margin-top: 0px'>
    <div style='height: 40px;background-color: rgba(0, 0, 0, 0.05);margin-bottom: 5px'>
    </div>
    <el-row :gutter='30' class='count'>
      <el-col :span='8'>
        <el-card>
          <div slot='header' class='clearfix'>
            <span class='title'>信用账户交易统计</span>
          </div>
          <credit-account :result='creditData'></credit-account>
        </el-card>
      </el-col>
      <el-col :span='8'>
        <el-card>
          <div slot='header' class='clearfix'>
            <span class='title'>融资交易统计</span>
          </div>
          <financing :result='marginTradeData'></financing>
        </el-card>
      </el-col>
      <el-col :span='8'>
        <el-card>
          <div slot='header' class='clearfix'>
            <span class='title'>券商上报融资融券余额(前一交易日)</span>
          </div>
          <broker :result='lastMarginData'></broker>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import Broker from './timeAccount/broker'
  import CreditAccount from './timeAccount/creditAccount'
  import Financing from './timeAccount/financing'
  import {getCountMonitor} from '../../../../../service/marketSupervise/index'

  export default {
    name: 'time-account',
    components: {
      Broker,
      CreditAccount,
      Financing
    },
    data() {
      return {
        creditData: '',
        marginTradeData: '',
        lastMarginData: ''
      }
    },
    mounted() {
      getCountMonitor()
        .then((resp) => {
          this.creditData = resp.credittrade
          this.marginTradeData = resp.marginTrade
          this.lastMarginData = resp.lastMarginRemain
        })
    },
    methods: {}
  }
</script>

<style lang='less'>
  .timeAccount {
    .el-card {
      .el-card__header {
        background-color: rgba(0, 0, 0, 0.15);
      }
      .el-card__body {
        background-color: rgba(0, 0, 0, 0.15);
      }
    }

  }

</style>
