<template>
  <div>
    <el-card class="line">
      <div slot="header" class="clearfix">
        交易股票分析表
      </div>
      <div>
        <el-select @change="getdata" v-model="dimension" placeholder="" size="small" style="position:relative;top:-36px;left:160px">
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
        :data="one"
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
        :data="two"
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
        :data="three"
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
    </el-card>
  </div>
</template>
<script>
  import moment from 'moment'
  import { getvaritytable, getallinfo } from '@/service/analysisTool/insiderTradAccountAnalysisBig/accountlist/index'

  export default {
    props: ['analysisName'],
    data () {
      return {
        isdimension: [{
          value: '一码通维度',
          label: '一码通维度'
        }, {
          value: '单账户维度',
          label: '单账户维度'
        }],
        dimension: '一码通维度',
        one: [],
        two: [],
        three: [],
        secCode: '600581',
        checkEndDate: '2016-01-22',
        ccrcAcctID: '',
        acctCodes: '',
        checkStartDate: '2015-10-22',
        taskId: 'lk001',
        acctAnalId: '1111'
      }
    },
    mounted () {
      // this.ccrcAcctID=window.sessionStorage.getItem("ccrcAcctID")
      // this.acctCodes=window.sessionStorage.getItem("acctCodes")
      this.taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      this.ccrcAcctID = this.$store.state.insiderTradAnalysis.accountparam[0]
      this.acctCodes = this.$store.state.insiderTradAnalysis.accountparam[1]
      this.acctAnalId = this.$store.state.insiderTradAnalysis.accountparam[2]
      this.getinfo()
    },
    methods: {
      getinfo () {
        let params = {
          'taskID': this.taskId
        }
        getallinfo(params).then((resp) => {
          this.checkStartDate = moment(resp.bizData.metaData[0].check_startdate, 'YYYYMMDD').format('YYYY-MM-DD')
          this.checkEndDate = moment(resp.bizData.metaData[0].check_enddate, 'YYYYMMDD').format('YYYY-MM-DD')
          this.secCode = resp.bizData.metaData[0].sec_code
          this.taskId = resp.bizData.metaData[0].task_id
          this.ccrcAcctID = this.$store.state.insiderTradAnalysis.accountparam[0]
          this.acctCodes = this.$store.state.insiderTradAnalysis.accountparam[1]
          this.acctAnalId = this.$store.state.insiderTradAnalysis.accountparam[2]
          this.getdata()
        })
      },
      getdata () {
        const loading = this.$loading({
          lock: true,
          text: '数据加载中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        let otdimension = ''
        if (this.dimension == '一码通维度') {
          otdimension = 'ccrc'
        } else {
          otdimension = 'ac'
        }
        let params = {
          'trendType': otdimension,
          'taskId': this.taskId,
          'acctAnalId': this.acctAnalId,
          'ccrcAcctID': this.ccrcAcctID,
          // "ccrcAcctID":"108963986711",
          'acctId': this.acctCodes,
          'secCode': this.secCode,
          'checkEndDate': moment(this.checkEndDate).format('YYYY-MM-DD'),
          'checkStartDate': this.checkStartDate
        }
        getvaritytable(params).then((resp) => {
          resp.targtStock[0].oneyear_sec_teans_b = resp.stockGraph[0].oneyear_sec_teans_b
          this.one = resp.targtStock
          this.two = resp.stockGraph
          this.three = resp.stockGraph
          loading.close()
        })
      }
    }
  }
</script>
