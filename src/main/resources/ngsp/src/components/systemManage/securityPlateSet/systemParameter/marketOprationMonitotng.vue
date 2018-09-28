
<!--市场运行监测 marketOprationMonitotng-->
<template>
    <div class="market-opration-monitotng">
        <el-card class="el-card-table" style="margin-top: 0">
          <el-tabs v-model="activeName1" type="card" class="self-tabs-class" @tab-click="systemParameterClick1">
            <el-tab-pane label="自定义板块设置" name="customPlateSetting"></el-tab-pane>
            <el-tab-pane label="自定义分类投资者设置" name="classifiedInvestorSetting"></el-tab-pane>
            <el-tab-pane label="市场情绪雷达设置" name="marketRadarSetting"></el-tab-pane>
            <el-tab-pane label="市场运行监测预警指标设置" name="warnongSetting"></el-tab-pane>
            <el-tab-pane label="市场异常波动设置" name="abnormalMarketFluctuation"></el-tab-pane>
            <el-tab-pane label="维稳设置" name="safeguardStability"></el-tab-pane>
          </el-tabs>
        </el-card>
         <div>
           <custom-plate-setting v-if="activeName1==='customPlateSetting'"></custom-plate-setting>
           <classified-investor-setting v-if="activeName1==='classifiedInvestorSetting'"></classified-investor-setting>
           <market-radar-setting v-if="activeName1==='marketRadarSetting'"></market-radar-setting>
           <warnong-setting v-if="activeName1==='warnongSetting'"></warnong-setting>
           <abnormal-market-fluctuation v-if="activeName1==='abnormalMarketFluctuation'"></abnormal-market-fluctuation>
           <safeguard-stability v-if="activeName1==='safeguardStability'"></safeguard-stability>
         </div>
    </div>
</template>

<script>
import CustomPlateSetting from '../../../../components/systemManage/securityPlateSet/systemParameter/customPlateSetting'                  // 自定义板块设置
import ClassifiedInvestorSetting from '../../../../components/systemManage/securityPlateSet/systemParameter/classifiedInvestorSetting'   // 自定义分类投资者设置
import MarketRadarSetting from '../../../../components/systemManage/securityPlateSet/systemParameter/marketRadarSetting'                  // 市场情绪雷达设置
import WarnongSetting from '../../../../components/systemManage/securityPlateSet/systemParameter/warnongSetting'                          // 市场运行监测预警指标设置
import AbnormalMarketFluctuation from '../../../../components/systemManage/securityPlateSet/systemParameter/abnormalMarketFluctuation'  // 市场异常波动
import SafeguardStability from '../../../../components/systemManage/securityPlateSet/systemParameter/safeguardStability'                 // 维稳

export default {
  name: 'market-opration-monitotng',
  props: [],
  components: {
    CustomPlateSetting,
    ClassifiedInvestorSetting,
    MarketRadarSetting,
    WarnongSetting,
    AbnormalMarketFluctuation,
    SafeguardStability
  },
  data() {
    return {
      // activeName1:'customPlateSetting'
      activeName1: 'abnormalMarketFluctuation'
    }
  },
  methods: {
    systemParameterClick1() {}
  },
  watch: {},
  mounted() {

  }
}
</script>

<style lang="less">
  .market-opration-monitotng {
    .market{
      background-color: #1b2b4e;
      color: #7b8fb9;
    }
    .self-tabs-class {
      .el-tabs__header {
        padding: 10px 0;
        .el-tabs__nav {
          border: none!important;
        }
        .el-tabs__item {
          height:38px!important;
          line-height: 38px!important;
          border-color: transparent !important;
          padding: 0 15px;
          border-radius: 5px;
          &.is-active {
            background-color: #1853a5;
          }
        }
      }
    }
  }
</style>
