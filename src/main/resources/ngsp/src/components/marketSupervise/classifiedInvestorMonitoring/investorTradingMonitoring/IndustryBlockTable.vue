<template>
  <el-card class="plate-info-area el-card-table">
    <el-dialog title="设置" :visible.sync="isCustomSetUpBox">
      <customSetUpBox></customSetUpBox>
    </el-dialog>
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="行业板块" name="industryBlock">
        <industry-block ref="sw"></industry-block>
      </el-tab-pane>
      <el-tab-pane label="概念板块" name="conceptBlock">
        <concept-block ref="wd"></concept-block>
      </el-tab-pane>
      <el-tab-pane label="自定义板块" name="customBlock">
        <custom-block ref="cus"></custom-block>
      </el-tab-pane>
      <el-tab-pane label="个股" name="stockBlock">
        <stock-block ref="stock"></stock-block>
      </el-tab-pane>
    </el-tabs>
    <div class="data-download-btn">
      <el-button type="primary" icon="el-icon-download" size="small" @click="downloadInvestorExcel"></el-button>
    </div>
  </el-card>
</template>

<script>
  import customSetUpBox from './commonBlock/customSetUpBox'
  import IndustryBlock from './industryBlockTable/IndustryBlock'
  import ConceptBlock from './industryBlockTable/conceptBlock'
  import CustomBlock from './industryBlockTable/customBlock'
  import StockBlock from './industryBlockTable/stockBlock'

  export default {
    components: {
      IndustryBlock,
      customSetUpBox,
      ConceptBlock,
      CustomBlock,
      StockBlock
    },
    data () {
      return {
        activeName: 'industryBlock',
        isCustomSetUpBox: false,
        IBTimeOut: null
      }
    },
    computed: {
      currentIndexCode () {
        return this.$store.state.investorMonitoring.currentIndexCode
      },
      investorType () {
        return this.$store.getters.getInvestorType
      },
      investors () {
        return this.$store.getters.getInvestors
      },
      accountOrBranch () {
        return this.$store.getters.getAccountOrBranch
      },
      chooseAccount () {
        return this.$store.getters.getChooseAccount
      },
      chooseBranch () {
        return this.$store.getters.getChooseBranch
      },
      timeRange () {
        return this.$store.getters.getTimeRange
      },
      tradeDate () {
        return this.$store.getters.getTradeDate
      },
      dateRage () {
        return this.$store.getters.getDateRange
      }
    },
    watch: {
      currentIndexCode: function () {
        this.initLazyAndSort()
        this.industryBlockTimeOut()
      },
      investorType: function () {
        this.initLazyAndSort()
        this.industryBlockTimeOut()
      },
      investors: function () {
        this.initLazyAndSort()
        this.industryBlockTimeOut()
      },
      accountOrBranch: function () {
        this.initLazyAndSort()
        this.industryBlockTimeOut()
      },
      chooseAccount: function () {
        this.initLazyAndSort()
        this.industryBlockTimeOut()
      },
      chooseBranch: function () {
        this.initLazyAndSort()
        this.industryBlockTimeOut()
      },
      timeRange: function () {
        this.initLazyAndSort()
        this.industryBlockTimeOut()
      },
      tradeDate: function () {
        this.initLazyAndSort()
        this.industryBlockTimeOut()
      },
      dateRage () {
        this.initLazyAndSort()
        this.industryBlockTimeOut()
      }
    },
    methods: {
      handleTabsClick (tab) {
        this.isSetUpBtn = tab.name === 'customBlock'
        this.industryBlockTimeOut()
      },
      initLazyAndSort () {
        this.$refs.stock.fnInitLazyLoadAndSort()
      },
      downloadInvestorExcel () {
        let tableColumns = [
          {'sheetName': '行业板块', 'fileColumns': this.$refs.sw.columns},
          {'sheetName': '概念板块', 'fileColumns': this.$refs.wd.columns},
          {'sheetName': '自定义板块', 'fileColumns': this.$refs.cus.columns},
          {'sheetName': '个股', 'fileColumns': this.$refs.stock.columns}
        ]
        this.$store.dispatch('downloadInvestorData', ['vocStock', tableColumns])
      },
      industryBlockTimeOut () {
        clearTimeout(this.IBTimeOut)
        if (this.activeName === 'industryBlock') {
          this.$refs.sw.getIndustrySwData()
        } else if (this.activeName === 'conceptBlock') {
          this.$refs.wd.getIndustryWdData()
        } else if (this.activeName === 'customBlock') {
          this.$refs.cus.getIndustryCusData()
        } else {
          this.$refs.stock.getIndustryStockData()
        }
        this.IBTimeOut = setTimeout(this.industryBlockTimeOut, 30000)
      }
    },
    mounted () {
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.IBTimeOut != null) {
        clearTimeout(this.IBTimeOut)
      }
    }
  }
</script>
