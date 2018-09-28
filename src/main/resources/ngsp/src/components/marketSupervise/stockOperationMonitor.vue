<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-tabs v-model="activeName">
      <el-tab-pane label="指数行情监测" name="indexMonitor" class="indexMonitor">
        <grid-layout v-if="this.$store.state.marketSupervise.isMonitorTableShow"
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
            <chart-monitor v-if="item.i === 'chart-monitor'"></chart-monitor>
            <block-stock v-if="item.i === 'block-stock'" class="market-operation-btn"></block-stock>
            <individual-stock v-if="item.i === 'individual-stock'" class="market-operation-btn"></individual-stock>
            <sales-depart-investor-account v-if="item.i === 'sales-depart-investor-account'" @isShow="isShowDialog" :validate="validate"
                                           class="market-operation-btn"></sales-depart-investor-account>
          </grid-item>
        </grid-layout>
        <double-per-dou-psw @isPass="getPassInfo" @isShow="isShowDialog" :dialogFormVisble="dialogShow"></double-per-dou-psw>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import ChartMonitor from './stockOperationMonitor/chartMonitor'
  import BlockStock from './stockOperationMonitor/stockBlockTable'
  import IndividualStock from './stockOperationMonitor/individualStock'
  import SalesDepartInvestorAccount from './stockOperationMonitor/salesDepartInvestorAccount'
  import DoublePerDouPsw from '../common/DoublePerDouPsw'
  import VueGridLayout from 'vue-grid-layout'

  let GridLayout = VueGridLayout.GridLayout
  let GridItem = VueGridLayout.GridItem

  export default {
    components: {
      GridLayout,
      GridItem,
      DoublePerDouPsw,
      Breadcrumb,
      ChartMonitor,
      BlockStock,
      IndividualStock,
      SalesDepartInvestorAccount
    },
    data () {
      return {
        activeName: 'indexMonitor',
        validate: false,
        dialogShow: false,
        vueLayout: [
          {'x': 0, 'y': 0, 'w': 12, 'h': 8.5, 'i': 'chart-monitor', 'minW': 3, 'minH': 6},
          {'x': 0, 'y': 0, 'w': 4, 'h': 9, 'i': 'block-stock', 'minW': 4, 'minH': 6},
          {'x': 4, 'y': 0, 'w': 4, 'h': 9, 'i': 'individual-stock', 'minW': 4, 'minH': 6},
          {'x': 8, 'y': 0, 'w': 4, 'h': 9, 'i': 'sales-depart-investor-account', 'minW': 4, 'minH': 6}
        ],
        isDrag: false,
        isZoom: true,
        breadcrumbItems: [{
          router: '',
          label: '市场运行监测'
        }, {
          router: '/stockOperationMonitor',
          label: '证券运行监测'
        }]
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
  .indexMonitor {
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
