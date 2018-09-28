<!--市场波动分析 -->
<template>
  <div class="market-fluctuation-analysis">
    <!--面包屑组件-->
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <!--tep-->
    <div>
      <el-row class="tableTitle">
        今日日报
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <wave-analysis-daily @getWaveRefesh="getWaveRefesh"></wave-analysis-daily>
        </el-col>
        <el-col :span="12">
          <overview-daily @getMarketRefesh="getMarketRefesh"></overview-daily>
        </el-col>
      </el-row>
      <el-row class="tableTitle">
        历史日报
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <market-overview-report :marketOverviewRefesh="marketOverview"></market-overview-report>
        </el-col>
        <el-col :span="12">
          <market-wave-report :marketWaveRefesh="marketWave"></market-wave-report>
        </el-col>
      </el-row>

    </div>
  </div>
</template>
<script>
  import OverviewDaily from './marketFluctuationAnalysis/overviewDaily'
  import WaveAnalysisDaily from './marketFluctuationAnalysis/waveAnalysisDaily'
  import MarketOverviewReport from './marketFluctuationAnalysis/marketOverviewReport'
  import MarketWaveReport from './marketFluctuationAnalysis/marketWaveReport'

  export default {
    // 组件注册
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'), // 面包屑组件
      OverviewDaily,
      WaveAnalysisDaily,
      MarketOverviewReport,
      MarketWaveReport
    },
    data() {
      return {
        // 面包屑路由
        breadcrumbItems: [
          {
            router: '/marketFluctuationAnalysis',
            label: '市场运行监测'
          }, {
            router: '/marketFluctuationAnalysis',
            label: '市场波动分析'
          }
        ],
        marketOverview: 1,
        marketWave: 1
      }
    },
    mounted() {
    },
    methods: {
      getWaveRefesh() {
        this.marketWave += 1
      },
      getMarketRefesh() {
        this.marketOverview += 1
      }
    },
    created() {
    }
  }
</script>
<style lang="less">
  .market-fluctuation-analysis {
    .tableTitle {
      margin: 10px 0px;
      font-size: 18px;
      color: #0ac7e3
    }
  }

</style>
