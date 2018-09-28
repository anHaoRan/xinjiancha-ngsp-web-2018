<template>
  <el-card class="individual-stock-area el-card-table">
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="账户" name="accountTabs">
        <account ref="account" :validate="validate"></account>
      </el-tab-pane>
      <el-tab-pane label="营业部" name="branchTabs">
        <branch ref="branch"></branch>
      </el-tab-pane>
    </el-tabs>
    <div class="data-download-btn">
      <el-button v-show="activeName === 'accountTabs'" type="primary" class="dpsw" size="mini" @click="dpsw">双人双密</el-button>
      <el-button v-show="activeName === 'branchTabs' || validate" type="primary" icon="el-icon-download" size="small" @click="downloadInvestorExcel"></el-button>
    </div>
  </el-card>
</template>

<script>
  import * as types from '../../../../store/mutation-types'
  import Account from './accountTable/Account'
  import Branch from './accountTable/Branch'

  export default {
    components: {
      Account,
      Branch
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
        activeName: 'accountTabs',
        timeOut: 0
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
      validate: function () {
        this.accountTimeOut()
      },
      currentIndexCode: function () {
        this.accountTimeOut()
      },
      investorType: function () {
        this.accountTimeOut()
      },
      investors: function () {
        this.accountTimeOut()
      },
      timeRange: function () {
        this.accountTimeOut()
      },
      tradeDate: function () {
        this.accountTimeOut()
      },
      dateRage: function () {
        this.accountTimeOut()
      }
    },
    methods: {
      dpsw () {
        if (!this.validate) {
          this.$emit('isShow', true)
        }
      },
      handleTabsClick (tab) {
        if (tab.name === 'accountTabs') {
          this.$store.commit(types.C_ACCOUNT_OR_BRANCH, 'account')
        } else {
          this.$store.commit(types.C_ACCOUNT_OR_BRANCH, 'branch')
        }
        this.accountTimeOut()
      },
      downloadInvestorExcel () {
        let tableColumns = [
          {'sheetName': '账户', 'hidden': !this.validate, 'fileColumns': this.$refs.account.columns},
          {'sheetName': '营业部', 'fileColumns': this.$refs.branch.columns}
        ]
        this.$store.dispatch('downloadInvestorData', ['account', tableColumns])
      },
      accountTimeOut () {
        clearTimeout(this.timeOut)
        if (this.activeName === 'accountTabs' && this.validate) {
          this.$refs.account.fnGetAccountData()
        } else {
          this.$refs.branch.fnGetBranchData()
        }
        this.timeOut = setTimeout(this.accountTimeOut, 30000)
      }
    },
    mounted () {
    },
    beforeDestroy () {
      // 离开页面时销毁轮询时间
      if (this.timeOut != null) {
        clearTimeout(this.timeOut)
      }
    }
  }
</script>
