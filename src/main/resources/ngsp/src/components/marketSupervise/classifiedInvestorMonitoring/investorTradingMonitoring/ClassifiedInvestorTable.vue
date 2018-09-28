<template>
  <el-card class="investor-sales-account-area el-card-table">
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="分类投资者" name="classifiedInvestor">
        <classified-investor ref="cfi"></classified-investor>
      </el-tab-pane>
      <el-tab-pane label="自定义投资者" name="customInvestor">
        <custom-investor ref="cmi"></custom-investor>
      </el-tab-pane>
    </el-tabs>
    <div class="data-download-btn">
      <el-button type="primary" icon="el-icon-download" size="small" @click="downloadInvestorExcel"></el-button>
    </div>
  </el-card>
</template>

<script>
  import * as types from '../../../../store/mutation-types'
  import ClassifiedInvestor from './classifiedInvestorTable/ClassifiedInvestor'
  import CustomInvestor from './classifiedInvestorTable/CustomInvestor'

  export default {
    components: {
      ClassifiedInvestor,
      CustomInvestor
    },
    data () {
      return {
        activeName: 'classifiedInvestor',
        CITimeOut: null
      }
    },
    computed: {
      currentIndexCode () {
        return this.$store.state.investorMonitoring.currentIndexCode
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
        this.classifiedInvestorTimeOut()
      },
      timeRange: function () {
        this.classifiedInvestorTimeOut()
      },
      tradeDate: function () {
        this.classifiedInvestorTimeOut()
      },
      dateRage () {
        this.classifiedInvestorTimeOut()
      }
    },
    methods: {
      handleTabsClick (tab) {
        if (tab.name === 'classifiedInvestor') {
          this.$store.commit(types.C_INVESTOR_TYPE, '0')
        } else {
          this.$store.commit(types.C_INVESTOR_TYPE, '1')
        }
        this.$store.commit(types.C_INVESTORS, '')
        this.classifiedInvestorTimeOut()
      },
      downloadInvestorExcel () {
        let tableColumns = [
          {'sheetName': '分类投资者', 'fileColumns': this.$refs.cfi.columns},
          {'sheetName': '自定义分类投资者', 'fileColumns': this.$refs.cmi.columns}
        ]
        this.$store.dispatch('downloadInvestorData', ['investor', tableColumns])
      },
      classifiedInvestorTimeOut () {
        clearTimeout(this.CITimeOut)
        if (this.activeName === 'classifiedInvestor') {
          this.$refs.cfi.getCfiData()
        } else {
          this.$refs.cmi.getCmiData()
        }
        this.CITimeOut = setTimeout(this.classifiedInvestorTimeOut, 30000)
      }
    },
    mounted () {
      this.$store.commit(types.C_INVESTOR_TYPE, '0')
      this.$store.commit(types.C_INVESTORS, '')
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.CITimeOut != null) {
        clearTimeout(this.CITimeOut)
      }
      this.$store.commit(types.C_INVESTORS, '')
    }
  }
</script>
