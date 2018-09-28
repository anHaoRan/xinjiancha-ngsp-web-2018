<template>
  <div class="investorTrading">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <grid-layout
      :layout="vueLayout"
      :col-num="12"
      :row-height="32"
      :is-draggable="isDrag"
      :is-resizable="isZoom"
      :vertical-compact="true"
      :margin="[20, 20]"
      :use-css-transforms="true"
      :auto-size="true">
      <grid-item v-for="(item, index) in vueLayout"
                 :id="item.i"
                 :key="index"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :minW="item.minW == null ? 3 : item.minW"
                 :minH="item.minH == null ? 3 : item.minH"
                 @resized="resizedEvent">
        <index-monitoring v-if="item.i === 'index-monitoring'"></index-monitoring>
        <classified-investor-table v-if="item.i === 'classified-investor-table'" class="market-operation-btn"></classified-investor-table>
        <account-table v-if="item.i === 'account-table'" @isShow="isShowDialog" :validate="validate" class="market-operation-btn"></account-table>
        <industry-block-table v-if="item.i === 'industry-block-table'" class="market-operation-btn"></industry-block-table>
      </grid-item>
    </grid-layout>
    <double-per-dou-psw @isPass="getPassInfo" @isShow="isShowDialog" :dialogFormVisble="dialogShow"></double-per-dou-psw>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import IndexMonitoring from './investorTradingMonitoring/IndexMonitoring'
  import ClassifiedInvestorTable from './investorTradingMonitoring/ClassifiedInvestorTable'
  import AccountTable from './investorTradingMonitoring/AccountTable'
  import IndustryBlockTable from './investorTradingMonitoring/IndustryBlockTable'
  import DoublePerDouPsw from '../../common/DoublePerDouPsw'
  import VueGridLayout from 'vue-grid-layout'

  let GridLayout = VueGridLayout.GridLayout
  let GridItem = VueGridLayout.GridItem

  export default {
    name: 'investor-trading-monitoring',
    components: {
      GridLayout,
      GridItem,
      Breadcrumb,
      DoublePerDouPsw,
      IndexMonitoring,
      ClassifiedInvestorTable,
      AccountTable,
      IndustryBlockTable
    },
    data () {
      return {
        validate: false,
        dialogShow: false,
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          }, {
            router: '/classifiedInvestorMonitoring',
            label: '投资者交易监测'
          }
        ],
        vueLayout: [
          {'x': 0, 'y': 0, 'w': 12, 'h': 8.5, 'i': 'index-monitoring', 'minW': 4, 'minH': 6},
          {'x': 0, 'y': 0, 'w': 4, 'h': 9, 'i': 'classified-investor-table', 'minW': 4, 'minH': 6},
          {'x': 4, 'y': 0, 'w': 4, 'h': 9, 'i': 'account-table', 'minW': 4, 'minH': 6},
          {'x': 8, 'y': 0, 'w': 4, 'h': 9, 'i': 'industry-block-table', 'minW': 4, 'minH': 6}
        ],
        isDrag: false,
        isZoom: true
      }
    },
    methods: {
      getPassInfo (val) {
        this.validate = val
      },
      isShowDialog (val) {
        this.dialogShow = val
      },
      resizedEvent (i, newH, newW, newHPx, newWPx) {
        this.gfnVueGridLayoutResize(i, newHPx, newWPx)
      }
    }
  }
</script>

<style scoped lang="less">
  .investorTrading {
    .vue-grid-item:nth-of-type(1) {
      z-index: 1;
    }
  }

  .market-operation-btn {
    position: relative;
    /deep/ .el-button--small {
      position: absolute;
      z-index: 2;
      padding: 0;
      color: #7b8fb9;
      font-size: 18px;
      background-color: transparent;
      border-color: transparent;
    }
    /deep/ .el-button--mini {
      position: absolute;
      z-index: 2;
      font-size: 14px;
    }
    /deep/ .el-button--small:hover {
      color: #ffffff;
      background-color: transparent;
    }
    /deep/ .data-download-btn {
      .el-button--small {
        top: 21px;
        right: 45px;
      }
      .el-button--mini {
        top: 12px;
        right: 50px;
      }
      .tickets {
        right: 15px;
      }
      .dpsw {
        font-size: 14px;
        margin-top: 4px;
        margin-right: 26px;
      }
    }
    /deep/ .el-tabs__content {
      overflow: initial;
    }
    /deep/ .editTableBtn {
      top: -33px;
      right: 15px;
    }
    /deep/ .radioBox,
    /deep/ .setUpBtn {
      position: absolute;
      top: 15px;
      right: 100px;
      z-index: 3;
    }
  }
</style>