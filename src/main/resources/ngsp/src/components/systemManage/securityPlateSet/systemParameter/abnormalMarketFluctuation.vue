
<!-- 市场异常波动 abnormalMarketFluctuation-->
<template>
    <div class="abnormal-market-fluctuation">
      <el-card class="el-card-table">
            <el-tabs v-model="activeName" @tab-click="handTabClick">
              <el-tab-pane label="区域活跃度定位方式" name="region_liveness">
                <active-zone v-if="activeName==='region_liveness'" :propsData="abnormalMarketData['region_liveness']"></active-zone>
              </el-tab-pane>
              <!--<el-tab-pane label="分时净值-投资者选择" name="time_share_investor">
                <net-value-time-sharing v-if="activeName==='time_share_investor'" :propsData="abnormalMarketData['time_share_investor']"></net-value-time-sharing>
              </el-tab-pane>-->
              <el-tab-pane label="阈值管理" name="threshould_manage">
                <threshold-mangement v-if="activeName==='threshould_manage'" :propsData="abnormalMarketData['threshould_manage']"></threshold-mangement>
              </el-tab-pane>
              <el-tab-pane label="计算权重管理" name="weight_manage">
                <weight-management v-if="activeName==='weight_manage'" :propsData="abnormalMarketData['weight_manage']"></weight-management>
              </el-tab-pane>
              <!--<el-tab-pane label="图表默认时间长度" name="default_time_length">
                <lcon-default-time v-if="activeName==='default_time_length'" :propsData="abnormalMarketData['default_time_length']"></lcon-default-time>
              </el-tab-pane>-->
            </el-tabs>
      </el-card>
    </div>
</template>
<script>
import ActiveZone from './abnormalMarket/ActiveZone' // 区域活跃度定位方式
import NetValueTimeSharing from './abnormalMarket/NetValueTimeSharing' // 分时净值-投资者选择
import ThresholdMangement from './abnormalMarket/ThresholdMangement' // 阈值管理
import WeightManagement from './abnormalMarket/WeightManagement' // 计算权重管理
import LconDefaultTime from './abnormalMarket/IconDefaultTime' // 图表默认时间长度
import {getKindData} from '@/service/systemManage'
export default {
  name: 'abnormal-market-fluctuation',
  props: [],
  components: {
    ActiveZone,
    NetValueTimeSharing,
    ThresholdMangement,
    WeightManagement,
    LconDefaultTime
  },
  data() {
    return {
      activeName: 'region_liveness',
      abnormalMarketData: {
        'region_liveness': [],
        'time_share_investor': [],
        'threshould_manage': [],
        'weight_manage': [],
        'default_time_length': []
      },
      regionLivenessProps: [],
      timeShareInvestor: [],
      threshouldManage: [],
      weightManage: [],
      defaultTimeLength: []
    }
  },
  methods: {
    handTabClick() {
      this.ajaxData()
    },
    ajaxData() {
      let param = {
        appCode: 'fluct',
        moduleCode: 'market_fluct',
        itemCode: this.activeName
      }
      getKindData(JSON.stringify(param)).then((res) => {
        if (res) {
          this.abnormalMarketData[this.activeName] = res
        }
      })
    }
  },
  watch: {},
  mounted() {
    this.ajaxData()
  }
}
</script>

<style lang="less">
    .abnormal-market-fluctuation {

    }
</style>
