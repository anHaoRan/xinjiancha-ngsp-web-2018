<template>
  <el-card class="el-card-table">
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="沪市指数" name="mainMarketIndex">
        <main-market-index ref="mainIndex"></main-market-index>
      </el-tab-pane>

      <el-tab-pane label="市场指数" name="marketIndex">
        <market-index ref="marketIndex"></market-index>
      </el-tab-pane>

      <!--<el-tab-pane label="金融期货" name="financialFutures" disabled>-->
      <!--金融期货-->
      <!--</el-tab-pane>-->

      <!--<el-tab-pane label="商品指数" name="commodityIndex" disabled>-->
      <!--商品指数-->
      <!--</el-tab-pane>-->

      <!--<el-tab-pane label="汇率" name="exchangeRate" disabled>-->
      <!--汇率-->
      <!--</el-tab-pane>-->

      <!--<el-tab-pane label="利率" name="interestRate" disabled>-->
      <!--利率-->
      <!--</el-tab-pane>-->
    </el-tabs>
    <div class="data-download-btn">
      <el-button type="primary" icon="el-icon-download" size="small" @click="downloadBlockExcel"></el-button>
    </div>
  </el-card>
</template>

<script>
  import MainMarketIndex from './mainIndex/mainMarketIndex'
  import MarketIndex from './mainIndex/marketIndex'

  export default {
    components: {
      MainMarketIndex,
      MarketIndex
    },
    data () {
      return {
        activeName: 'mainMarketIndex',
        indexTimeOut: null
      }
    },
    methods: {
      handleTabsClick (tab) {
        this.getIndexData()
      },
      downloadBlockExcel () {
        let tableColumns = [
          {'sheetName': '沪市指数', 'fileColumns': this.$refs.mainIndex.columns},
          {'sheetName': '市场指数', 'fileColumns': this.$refs.marketIndex.columns}
        ]
        this.gfnExportFileWithForm('/fluct/quotation/v1/export', {tableColumns: tableColumns})
      },
      getIndexData () {
        clearTimeout(this.indexTimeOut)
        if (this.activeName === 'mainMarketIndex') {
          this.$refs.mainIndex.getMainData()
        } else {
          this.$refs.marketIndex.getMarketData()
        }
        this.indexTimeOut = setTimeout(this.getIndexData, 30000)
      }
    },
    mounted () {
      this.getIndexData()
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.indexTimeOut != null) {
        clearTimeout(this.indexTimeOut)
      }
    }
  }
</script>
