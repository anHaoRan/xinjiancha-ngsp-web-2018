<template>
  <div class="investorPicture">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-card class="titleSearch">
        <div slot="header" class="title">
          账户名称：{{titleAccount}}
          <el-input size="middle" class="searchIpt" v-model="accountID" @keydown.enter.native="search">
            <i slot="suffix" class="el-input_icon el-icon-search" @click="query"></i>
          </el-input>
        </div>
      </el-card>
    </div>
    <el-row :gutter="30" v-if="contentShow">
      <el-col :span="6">
        <account-pic :accountId="accountId" :resultData="resultData"></account-pic>
        <other-account :accountId="accountId" :resultData="resultData" @getAccount="getAccount"></other-account>
        <asset-analysis :accountId="accountId" :resultData="resultData"></asset-analysis>
        <account-key-word :accountId="accountId" :resultData="resultData"></account-key-word>
        <one-year-deal :accountId="accountId" :resultData="resultData"></one-year-deal>
        <company-account :accountId="accountId" :resultData="resultData"></company-account>
      </el-col>
      <el-col :span="18">
        <hold-property :accountId="accountId" :overlayCode="overlayCode" @getPeriodDate="getPeriodDate"></hold-property>
        <buy-amount :accountId="accountId" :periodDate="periodDate"></buy-amount>
        <account-profit :accountId="accountId" :periodDate="periodDate"></account-profit>
        <top-five-query :accountId="accountId" @getOverlayCode="getOverlayCode" :resultData="resultData"></top-five-query>
        <self-supervision :accountId="accountId"></self-supervision>
        <history-abnormal :accountId="accountId"></history-abnormal>
        <abnormal-decide :accountId="accountId" @getClickTime="getClickTime"></abnormal-decide>
        <deal-query :accountId="accountId" :clickTime="clickTime" :resultData="resultData"></deal-query>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import AccountPic from './investorPicture/accountPic'
  import OtherAccount from './investorPicture/otherAccount'
  import AssetAnalysis from './investorPicture/assetAnalysis'
  import AccountKeyWord from './investorPicture/accountKeyWord'
  import OneYearDeal from './investorPicture/oneYearDeal'
  import HoldProperty from './investorPicture/holdProperty'
  import BuyAmount from './investorPicture/buyAmount'
  import CompanyAccount from './investorPicture/companyAccount'
  import AccountProfit from './investorPicture/accountProfit'
  import TopFiveQuery from './investorPicture/topFiveQuery'
  import SelfSupervision from './investorPicture/selfSupervision'
  import HistoryAbnormal from './investorPicture/historyAbnormal'
  import AbnormalDecide from './investorPicture/abnormalDecide'
  import DealQuery from './investorPicture/dealQuery'
  import {postIntestorPic} from '../../service/knowledgeBase/investorPicture/index'

  export default {
    components: {
      Breadcrumb,
      AccountPic,
      OtherAccount,
      AssetAnalysis,
      AccountKeyWord,
      OneYearDeal,
      HoldProperty,
      BuyAmount,
      CompanyAccount,
      AccountProfit,
      TopFiveQuery,
      SelfSupervision,
      HistoryAbnormal,
      AbnormalDecide,
      DealQuery
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '监管知识库'
          },
          {
            router: '',
            label: '投资者画像'
          }
        ],
        accountID: '',
        accountId: '',
        overlayCode: [],
        periodDate: '',
        titleAccount: '',
        contentShow: false,
        clickTime: '',
        resultData: {}
      }
    },
    mounted() {

    },
    methods: {
      getData() {
        let params = {
          key: JSON.stringify({accountId: this.accountId, tradeDate: ''}),
          method: 'hbaseQuery'
        }
        postIntestorPic(params).then(resp => {
          this.resultData = resp
          this.titleAccount = resp.ccrcAcct.name
        })
      },
      search() {
        this.query()
      },
      query() {
        let reg = /^[A-Z]\d{9}/
        if (!reg.test(this.accountID)) {
          this.$message.warning('请输入正确的账户号,大写字母加9位数字！')
        } else {
          this.accountId = this.accountID
          this.contentShow = true
          this.accountID = ''
          this.getData()
        }
      },
      getAccount(val) {
        this.accountId = val
        this.getData()
      },
      getOverlayCode(val) {
        this.overlayCode = val
      },
      getPeriodDate(val) {
        this.periodDate = val
      },
      getClickTime(val) {
        this.clickTime = val
      }
    }
  }
</script>
<style lang="less">
  .investorPicture {
    .el-form-item {
      margin-bottom: 0px;
    }
    .tabStyle {
      display: flex;
      justify-content: space-between;
      .el-tabs__nav-wrap {
        padding: 0px !important;
      }
      .el-tabs__item.is-active {
        background-color: #3371f5 !important;
        border: none !important;
      }
    }
    .titleSearch {
      .el-card__header {
        padding-right: 20px !important;
        height: auto !important;
        .title {
          padding: 10px 0px;
          font-size: 28px;
          .el-input__inner {
            font-size: 16px;
          }
        }
      }
      .el-card__body {
        padding: 0px !important;
      }
      .searchIpt {
        width: 15%;
        float: right;
        .el-input__suffix {
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
  }
</style>
