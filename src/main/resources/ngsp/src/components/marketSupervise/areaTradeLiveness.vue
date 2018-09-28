<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-row :gutter="30">
      <el-col :span="16">
        <trade-liveness-map :tradeMapData="tradeMapData" :showNote="true"
          v-loading="mapLoading"
          element-loading-background="rgba(0, 0, 0, 0.4)"></trade-liveness-map>
      </el-col>
      <el-col :span="8">
        <trade-top-ten :tradeTopTenData="tradeTopTenData"></trade-top-ten>
        <account-top-ten :accountTopTenData="accountTopTenData"></account-top-ten>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import TradeLivenessMap from './areaTradeLiveness/tradeLivenessMap'
  import TradeTopTen from './areaTradeLiveness/tradeTopTen'
  import AccountTopTen from './areaTradeLiveness/accountTopTen'

  import {getTradeMap} from '../../service/marketSupervise'

  export default {
    components: {
      Breadcrumb,
      TradeLivenessMap,
      TradeTopTen,
      AccountTopTen
    },
    data() {
      return {
        breadcrumbItems: [{
          router: '',
          label: '市场运行监测'
        }, {
          router: '',
          label: '异常波动监测'
        }, {
          router: '/areaTradeLiveness',
          label: '区域活跃度'
        }],
        tradeMapData: [],
        tradeTopTenData: [],
        accountTopTenData: [],
        timeout: null,
        mapLoading: false
      }
    },
    methods: {
      getTradeMapData() {
        this.mapLoading = true
        getTradeMap().then(resp => {
          this.mapLoading = false
          this.tradeMapData = resp.branchQtyMap;
          this.accountTopTenData = resp.regionAccNumTop10;
          this.tradeTopTenData = resp.regionTradQtyTop10;
          this.timeout = setTimeout(() => {
            this.refreshMapData()
          }, 30000);
        }, (err) => {
          this.mapLoading = false
          this.$message.error(err.body.error);
          this.timeout = setTimeout(() => {
            this.refreshMapData()
          }, 30000);
        });
      },
      refreshMapData() {
        getTradeMap().then(resp => {
          this.tradeMapData = resp.branchQtyMap;
          this.accountTopTenData = resp.regionAccNumTop10;
          this.tradeTopTenData = resp.regionTradQtyTop10;
          this.timeout = setTimeout(() => {
            this.refreshMapData()
          }, 30000);
        }, (err) => {
          this.$message.error(err.body.error);
          this.timeout = setTimeout(() => {
            this.refreshMapData()
          }, 30000);
        });
      }
    },
    mounted() {
      this.getTradeMapData();
    },
    created() {
    },
    beforeDestroy() {
      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }
    }
  }
</script>

<style scoped lang="less">

</style>
