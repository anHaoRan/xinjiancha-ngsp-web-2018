<template>
  <div>
    <el-card class="line">
      <div slot="header" class="clearfix">
        交易股票分析表
      </div>
      <div>
        <el-select @change="getdata" v-model="dimension" placeholder="" size="small"
                   style="position:relative;top:-36px;left:160px">
          <el-option
              v-for="item in isdimension"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-table
          style="margin-top:10px;"
          :data="tableOneData"
          :fit=true
          border>
        <el-table-column
            prop="city"
            label="目标股票地域"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="sector_name"
            label="目标股票所属行业"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="sector_name_wind"
            label="目标股票所属概念"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="oneyear_sec_teans_b"
            label="账户近一年买入股票总只数"
            show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-table
          style="margin-top:10px;"
          :data="tableTwoData"
          :fit=true
          border>
        <el-table-column
            prop="analinterval_mainarea_b"
            label="分析期内主要买入地域"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="analinterval_mainsector_b"
            label="分析期内主要买入行业"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="analinterval_mainsector_wind_b"
            label="分析期内主要买入概念"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="analinterval_hold_especi_trans"
            label="账户分析期间持股时发生重大资产重组停牌的股票只数"
            show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-table
          style="margin-top:10px;"
          :data="tableThreeData"
          :fit=true
          border>
        <el-table-column
            prop="oneyear_mainarea_b"
            label="近一年内主要买入地域"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="oneyear_mainsector_b"
            label="近一年内主要买入行业"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="oneyear_mainsector_wind_b"
            label="近一年内主要买入概念"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="analinterval_hold_especi_trans"
            label="账户近一年持股时发生重大资产重组停牌的股票只数"
            show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-row :gutter="20">
        <el-col el-col :xl="8" :lg="8" :md="12" :sm="24">
          <div id="mapChart"></div>
        </el-col>
        <el-col el-col :xl="8" :lg="8" :md="12" :sm="24">
          <div id="bubbleChart"></div>
        </el-col>
        <el-col el-col :xl="8" :lg="8" :md="12" :sm="24">
          <div id="wordCloudChart"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import moment from 'moment'
  import echart from 'echarts'
  import {
    getvaritytable,
    getallinfo
  } from '../../../../service/analysisTool/insiderTradAccountAnalysis/accountlist/index.js'
  import MinxinVue from './Mixin'

  export default {
    mixins: [MinxinVue],
    data () {
      return {
        isdimension: [{
          value: 'ccrc',
          label: '一码通维度'
        }, {
          value: 'ac',
          label: '单账户维度'
        },],
        dimension: 'ccrc',
        tableOneData: [],
        tableTwoData: [],
        tableThreeData: [],
      }
    },
    created () {
    },
    methods: {
      getdata () {
        this.tableOneData = []
        this.tableOneData = []
        this.tableOneData = []
        let params = {
          'trendType': this.dimension,
          'taskId': this.taskID,
          'acctAnalId': this.acctAnalId,
          'ccrcAcctID': this.ccrcAcctID,
          'acctId': this.acctCodes,
          'secCode': this.secCode,
          'checkEndDate': moment(this.checkEndDate).format('YYYY-MM-DD'),
          'checkStartDate': this.checkStartDate
        }
        getvaritytable(params).then((resp) => {
          resp.targtStock[0].oneyear_sec_teans_b = resp.stockGraph[0].oneyear_sec_teans_b
          this.tableOneData = resp.targtStock
          this.tableTwoData = resp.stockGraph
          this.tableThreeData = resp.stockGraph
          let requestPassCount = this.$store.state.insiderTradAnalysis.requestPassCount + 1
          this.$store.commit('changeDemensionRequestCount', requestPassCount)
        })
      },
      drawCharts(){
        let mapChart = echarts.init($('#mapChart'),this.gfnGetTheme()),
        bubbleChart = echarts.init($('#bubbleChart'),this.gfnGetTheme()),
        wordCloudChart = echarts.init($('#wordCloudChart'),this.gfnGetTheme())

      }
    },
  }
</script>
