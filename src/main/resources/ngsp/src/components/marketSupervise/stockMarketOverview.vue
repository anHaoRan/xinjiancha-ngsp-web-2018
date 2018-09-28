<template>
  <div class="market-supervise">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <grid-layout
      :layout="vueLayout"
      :col-num="12"
      :row-height="30"
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
        <main-index v-if="item.i === 'main-index'" class="market-operation-btn"></main-index>
        <stock-analysis v-if="item.i === 'stock-analysis'"></stock-analysis>
        <stock-block v-if="item.i === 'stock-block'" class="market-operation-btn"></stock-block>
        <individual-stock v-if="item.i === 'individual-stock'" class="market-operation-btn"></individual-stock>
      </grid-item>
    </grid-layout>
    <!-- <el-row :gutter="20">
      <el-col :span="12">
        <main-index class="market-operation-btn"></main-index>
      </el-col>
      <el-col :span="12">
        <stock-analysis></stock-analysis>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <stock-block class="market-operation-btn"></stock-block>
      </el-col>
      <el-col :span="12">
        <individual-stock class="market-operation-btn"></individual-stock>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import MainIndex from './stockMarketOverview/mainIndex'
  import StockAnalysis from './stockMarketOverview/stockAnalysis'
  import StockBlock from './stockMarketOverview/stockBlock'
  import IndividualStock from './stockMarketOverview/individualStock'
  import VueGridLayout from 'vue-grid-layout'

  let GridLayout = VueGridLayout.GridLayout
  let GridItem = VueGridLayout.GridItem

  export default {
    components: {
      GridLayout,
      GridItem,
      Breadcrumb,
      MainIndex,
      StockAnalysis,
      StockBlock,
      IndividualStock
    },
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '市场运行监测'
        }, {
          router: '/stockMarketOverview',
          label: '证券市场概览'
        }],
        vueLayout: [
          {'x': 0, 'y': 0, 'w': 6, 'h': 9, 'i': 'main-index', 'minW': 3, 'minH': 3},
          {'x': 6, 'y': 0, 'w': 6, 'h': 9, 'i': 'stock-analysis', 'minW': 3, 'minH': 3},
          {'x': 0, 'y': 0, 'w': 6, 'h': 9, 'i': 'stock-block', 'minW': 3, 'minH': 3},
          {'x': 6, 'y': 0, 'w': 6, 'h': 9, 'i': 'individual-stock', 'minW': 3, 'minH': 3}
        ],
        isDrag: false,
        isZoom: true
      }
    },
    methods: {
      resizedEvent (i, newH, newW, newHPx, newWPx) {
        this.gfnVueGridLayoutResize(i, newHPx, newWPx)
      }
    }
  }
</script>

<style scoped lang="less">
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
    /deep/ .el-button--small:hover {
      color: #ffffff;
      background-color: transparent;
    }
    /deep/ .data-download-btn {
      .el-button--mini,
      .el-button--small {
        top: 21px;
        right: 45px;
      }
      .tickets {
        right: 15px;
      }
    }
    /deep/ .el-tabs__content {
      overflow: initial;
    }
    /deep/ .editTableBtn {
      top: -33px;
      right: 15px;
    }
  }
</style>
