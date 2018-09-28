<template>
  <el-card class="investor-sales-account-area el-card-table">
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="投资者" name="investor">
        <investor ref="inv"></investor>
      </el-tab-pane>
      <el-tab-pane label="自定义投资者" name="selfDefinedInvestor">
        <cus-investor ref="cusinv"></cus-investor>
      </el-tab-pane>
      <el-tab-pane label="账户" name="account">
        <account ref="acc" :validate="validate"></account>
      </el-tab-pane>
      <el-tab-pane label="营业部" name="salesDepartment">
        <sales-department ref="sales"></sales-department>
      </el-tab-pane>
    </el-tabs>
    <div class="data-download-btn">
      <el-button v-show="activeName === 'account'" type="primary" class="dpsw" size="mini" @click="dpsw">双人双密</el-button>
      <el-button v-show="activeName !== 'account' || (activeName === 'account' && validate)" type="primary" icon="el-icon-download" size="small" @click="downloadStockExcel"></el-button>
    </div>
  </el-card>
</template>

<script>
  import editTable from './commonBlock/editTable'
  import Account from './salesDepartInvestorAccount/account'
  import Investor from './salesDepartInvestorAccount/investor'
  import CusInvestor from './salesDepartInvestorAccount/cusInvestor'
  import SalesDepartment from './salesDepartInvestorAccount/salesDepartment'

  export default {
    components: {
      SalesDepartment,
      Account,
      Investor,
      CusInvestor,
      editTable
    },
    props: {
      validate: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {
        activeName: 'investor',
        editTableVisible: false,
        SDITimeOut: null
      }
    },
    computed: {
      currentIndexCode () {
        return this.$store.state.marketSupervise.currentIndexCode
      },
      boardCodeList () {
        return this.$store.getters.getBoardCodeList
      },
      securityIds () {
        return this.$store.getters.getSecurityIds
      },
      stockTimeRange () {
        return this.$store.getters.getStockTimeRange
      },
      tradeDate () {
        return this.$store.getters.getStockTradeDate
      },
      dateRage () {
        return this.$store.getters.getStockDateRange
      }
    },
    watch: {
      validate: function () {
        this.getSalesInvestorData()
      },
      currentIndexCode: function () {
        this.fnInitLazyAndSort()
      },
      boardCodeList: function () {
        this.fnInitLazyAndSort()
      },
      securityIds: function () {
        this.fnInitLazyAndSort()
      },
      stockTimeRange: function () {
        this.fnInitLazyAndSort()
      },
      tradeDate: function () {
        this.fnInitLazyAndSort()
      },
      dateRage: function () {
        this.fnInitLazyAndSort()
      }
    },
    methods: {
      dpsw () {
        if (!this.validate) {
          this.$emit('isShow', true)
        }
      },
      handleTabsClick (tab, event) {
        this.getSalesInvestorData()
      },
      downloadStockExcel () {
        let tableColumns = [
          {'sheetName': '投资者', 'fileColumns': this.$refs.inv.columns},
          {'sheetName': '自定义投资者', 'fileColumns': this.$refs.cusinv.columns},
          {'sheetName': '账户', 'hidden': !this.validate, 'fileColumns': this.$refs.acc.columns},
          {'sheetName': '营业部', 'fileColumns': this.$refs.sales.columns}
        ]
        this.$store.dispatch('downloadStockData', ['investor', tableColumns])
      },
      fnInitLazyAndSort () {
        this.$refs.acc.fnInitLazyLoadAndSort()
        this.$refs.sales.fnInitLazyLoadAndSort()
        this.getSalesInvestorData()
      },
      getSalesInvestorData () {
        clearTimeout(this.SDITimeOut)
        if (this.activeName === 'investor') {
          this.$refs.inv.getInvData()
        } else if (this.activeName === 'selfDefinedInvestor') {
          this.$refs.cusinv.getCusinvData()
        } else if (this.activeName === 'account' && this.validate) {
          this.$refs.acc.getAccData()
        } else if (this.activeName === 'salesDepartment') {
          this.$refs.sales.getSalesData()
        }
        this.SDITimeOut = setTimeout(this.getSalesInvestorData, 30000)
      }
    },
    mounted () {
      this.getSalesInvestorData()
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.SDITimeOut != null) {
        clearTimeout(this.SDITimeOut)
      }
    }
  }
</script>
