<template>
  <div class="accountBehaviorTracking">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model="activeMenuName" @tab-click="handleMenuTabClick">
      <el-tab-pane
        v-for="(item,index) in tabsMenu" :key="index"
        :label="item" :name="String(index)">
        <el-card>
          <div slot="header">
            <span>查询条件</span>
            <statistic-caliber :statisticCaliber="statisticCaliber">
              <div slot="is0">
                <caliber></caliber>
              </div>
            </statistic-caliber>
            <el-button size="small" type="info"  @click="handleClear">清空</el-button>
            <el-button size="small" type="primary" @click="handleQuery">查询</el-button>
          </div>
          <template>
            <business-department-account-analysis-search-form v-if="index === 0" :num="index" :defaultRelativeTradeDate="defaultRelativeTradeDate" :ref='`trackingHeaderForm${index}`'></business-department-account-analysis-search-form>
            <latest-market-price-search-form v-if="index === 1" :num="index" :defaultRelativeTradeDate="defaultRelativeTradeDate" :ref='`trackingHeaderForm${index}`'></latest-market-price-search-form>
            <profile-analysis-search-form v-if="index === 2" :num="index" :defaultRelativeTradeDate="defaultRelativeTradeDate" :ref='`trackingHeaderForm${index}`'></profile-analysis-search-form>
            <time-slice-analysis-search-form v-if="index === 3" :num="index" :defaultRelativeTradeDate="defaultRelativeTradeDate" :ref='`trackingHeaderForm${index}`'></time-slice-analysis-search-form>
            <call-auction-search-form v-if="index === 4" :num="index" :defaultRelativeTradeDate="defaultRelativeTradeDate" :ref='`trackingHeaderForm${index}`'></call-auction-search-form>
            <virtual-set-bidding-search-form v-if="index === 5" :num="index" :defaultRelativeTradeDate="defaultRelativeTradeDate" :ref='`trackingHeaderForm${index}`'></virtual-set-bidding-search-form>
            <hold-proportion-search-form v-if="index === 6" :num="index" :defaultRelativeTradeDate="defaultRelativeTradeDate" :ref='`trackingHeaderForm${index}`'></hold-proportion-search-form>
            <transaction-replay-search-form v-if="index === 7" :num="index" :defaultRelativeTradeDate="defaultRelativeTradeDate" :ref='`trackingHeaderForm${index}`'></transaction-replay-search-form>
          </template>
        </el-card>
        <el-card>
          <template>
            <business-department-account-analysis v-if="index === 0"></business-department-account-analysis>
            <latest-market-price v-if="index === 1"></latest-market-price>
            <profile-analysis v-if="index === 2"></profile-analysis>
            <time-slice-analysis ref="timeSliceAnalysisRef" v-if="index === 3" :activeMenuName="activeMenuName"></time-slice-analysis>
            <call-auction v-if="index === 4"></call-auction>
            <virtual-set-bidding v-if="index === 5"></virtual-set-bidding>
            <hold-proportion v-if="index === 6"></hold-proportion>
            <transaction-replay v-if="index === 7" :defaultRelativeTradeDate="defaultRelativeTradeDate"></transaction-replay>
          </template>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Breadcrumb from '@/components/common/Breadcrumb'
import BusinessDepartmentAccountAnalysisSearchForm from './componentsTool/accountBehaviorTracking/businessDepartmentAccountAnalysis/SearchForm'
import BusinessDepartmentAccountAnalysis from './componentsTool/accountBehaviorTracking/businessDepartmentAccountAnalysis/MainContent'
import LatestMarketPriceSearchForm from './componentsTool/accountBehaviorTracking/latestMarketPrice/SearchForm'
import LatestMarketPrice from './componentsTool/accountBehaviorTracking/latestMarketPrice/MainContent'
import ProfileAnalysisSearchForm from './componentsTool/accountBehaviorTracking/profileAnalysis/SearchForm'
import ProfileAnalysis from './componentsTool/accountBehaviorTracking/profileAnalysis/MainContent'
import TimeSliceAnalysisSearchForm from './componentsTool/accountBehaviorTracking/timeSliceAnalysis/SearchForm'
// import TimeSliceAnalysis from './componentsTool/accountBehaviorTracking/timeSliceAnalysis/MainContent'
import CallAuctionSearchForm from './componentsTool/accountBehaviorTracking/callAuction/SearchForm'
import CallAuction from './componentsTool/accountBehaviorTracking/callAuction/MainContent'
import VirtualSetBiddingSearchForm from './componentsTool/accountBehaviorTracking/virtualSetBidding/SearchForm'
import VirtualSetBidding from './componentsTool/accountBehaviorTracking/virtualSetBidding/MainContent'
import HoldProportionSearchForm from './componentsTool/accountBehaviorTracking/holdProportion/SearchForm'
import HoldProportion from './componentsTool/accountBehaviorTracking/holdProportion/MainContent'
import TransactionReplaySearchForm from './componentsTool/accountBehaviorTracking/transactionReplay/SearchForm'
// import TransactionReplay from './componentsTool/accountBehaviorTracking/transactionReplay/MainContent'
// 获取交易日偏移
import { getRelativeTradeDate } from '@/service/common/commonFunc'
import { dateStringAddSeparator } from '@/utils/dateTimeFormat'

export default {
  components: {
    Breadcrumb,
    BusinessDepartmentAccountAnalysisSearchForm,
    BusinessDepartmentAccountAnalysis,
    LatestMarketPriceSearchForm,
    LatestMarketPrice,
    ProfileAnalysisSearchForm,
    ProfileAnalysis,
    TimeSliceAnalysisSearchForm,
    TimeSliceAnalysis: () => import('./componentsTool/accountBehaviorTracking/timeSliceAnalysis/MainContent'),
    CallAuctionSearchForm,
    CallAuction,
    VirtualSetBiddingSearchForm,
    VirtualSetBidding,
    HoldProportionSearchForm,
    HoldProportion,
    TransactionReplaySearchForm,
    TransactionReplay: () => import('./componentsTool/accountBehaviorTracking/transactionReplay/MainContent'),
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber'),
    Caliber: () => import('./componentsTool/accountBehaviorTracking/Caliber')
  },
  data() {
    let paginations = []
    for (let i = 0; i < 7; i++) {
      paginations.push({
        currentPage: 1,
        pageSizeNumber: 10
      })
    }
    return {
      statisticCaliber: [
        {
          title: '个股营业部分析及账户分析',
          rewrite: true
        }
      ],
      breadcrumbItems: [
        {
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '数据综合查询'
        }, {
          router: '/accountBehaviorTracking',
          label: '账户行为追踪'
        }
      ],
      activeMenuName: '0',
      tabsMenu: ['个股营业部及账户分析', '最新市场价', '档位分析', '时间片分析', '集合竞价', '虚拟集合竞价', '持有占比', '成交回放'],
      defaultRelativeTradeDate: '' // 日期缺省值
    }
  },
  methods: {
    handleMenuTabClick() {

    },
    handleClear() {
      this.$refs[`trackingHeaderForm${this.activeMenuName}`][0].handleClear()
    },
    handleQuery() {
      this.$refs[`trackingHeaderForm${this.activeMenuName}`][0].handleSearch()
      if (this.activeMenuName === '3') {
        this.$nextTick(() => {
          this.$refs['timeSliceAnalysisRef'][0].handleSearch()
        })
      }
    }
  },
  mounted() {
    getRelativeTradeDate(-1).then(resp => {
      this.defaultRelativeTradeDate = dateStringAddSeparator(resp)
      // console.log(dateStringAddSeparator(resp))
    })
  }
}
</script>
<style lang="less" scoped>
  .accountBehaviorTracking {

  }
</style>
