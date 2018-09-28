<template>
  <div class="wavemonitor">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div class="wave">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="title">市场异常波动信息</span>
            </div>
            <wave-info></wave-info>
          </el-card>
        </el-col>
        <el-col :span="8">
          <market-sentiment-radar-chart></market-sentiment-radar-chart>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="title">三分钟内主要指数振幅</span>
            </div>
            <index-swing></index-swing>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="title">会员三分钟内最大交易金额</span>
            </div>
            <max-deal-chart></max-deal-chart>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="title">PBU三分钟内最大交易金额</span>
            </div>
            <pbu-deal-chart></pbu-deal-chart>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import WaveInfo from './waveMonitor/waveInfo'
  import IndexSwing from './waveMonitor/indexSwing'
  import MaxDealChart from './waveMonitor/maxDealChart'
  import PbuDealChart from './waveMonitor/pbuDealChart'
  import MarketSentimentRadarChart from './waveMonitor/MarketSentimentRadarChart'

  export default {
    components: {
      Breadcrumb,
      WaveInfo,
      IndexSwing,
      MaxDealChart,
      PbuDealChart,
      MarketSentimentRadarChart
    },
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '市场运行监测'
        }, {
          router: '',
          label: '异常波动监测'
        }, {
          router: '/waveMonitor',
          label: '异常波动'
        }]
      }
    },
    mounted () {},
    methods: {}
  }
</script>

<style lang="less">
  .wavemonitor {
    position: relative;
    .el-card {
      margin-top: 20px;
    }
  }

  .wave .title {
    font-weight: 700;
  }

  .wave .el-row {
    margin-top: 10px;
  }

  .wave .el-card {
    height: 354px;
  }
</style>
