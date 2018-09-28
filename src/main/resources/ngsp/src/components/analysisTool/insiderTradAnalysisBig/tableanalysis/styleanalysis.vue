<template>
  <div>
    <el-card class="line">
      <div slot="header" class="clearfix">
        股票交易风格分析图
      </div>
      <el-select @change="drawpic" v-model="dimension" placeholder="" size="small" style="position:relative;top:-36px;left:160px">
        <el-option
          v-for="item in isdimension"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-row>
        <el-col :span="2">
          <div style="margin-top: 100px;">
            <div>股票选择：</div>
            <el-radio-group v-model="stockType">
              <!--               <div  v-for="column in radioColumns">
                              <el-radio :label=column.rn @change='drawpic'>{{column.sec_code}}</el-radio>
                            </div> -->

              <div>
                <el-radio v-if="radioOne" label="1" @change='drawpic'>{{one}}</el-radio>
              </div>
              <div>
                <el-radio v-if="radioTwo" label="2" @change='drawpic'>{{two}}</el-radio>
              </div>
              <div>
                <el-radio v-if="radioThree" label="3" @change='drawpic'>{{three}}</el-radio>
              </div>
              <div>
                <el-radio v-if="radioFour" label="4" @change='drawpic'>{{four}}</el-radio>
              </div>
              <div>
                <el-radio v-if="radioFive" label="5" @change='drawpic'>{{five}}</el-radio>
              </div>
              <div>
                <el-radio v-if="radioSix" label="6" @change='drawpic'>{{six}}</el-radio>
              </div>
            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="22">
          <div id="transationStyle" class="businesspie"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" style="margin-left: 130px;">
          <div id="drawhabitanalysis" class="businesspie"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import { drawTransationStyle, drawhabitanalysis } from '@/service/analysisTool/insiderTradAccountAnalysisBig/accountlist/index'

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
        secCode: '600581',
        checkEndDate: '2016-01-22',
        acctCodes: '',
        ccrcAcctID: '',
        data: [],
        close_price: [],
        trdamt_b: [],
        trdamt_s: [],
        stockType: '0',
        habitdata: [],
        habitclose_price: [],
        habittrdamt_b: [],
        habittrdamt_s: [],
        // radioColumns:'',
        one: '',
        two: '',
        three: '',
        four: '',
        five: '',
        six: '',
        radioOne: false,
        radioTwo: false,
        radioThree: false,
        radioFour: false,
        radioFive: false,
        radioSix: false
      }
    },
    mounted () {
      // this.ccrcAcctID=window.sessionStorage.getItem("ccrcAcctID")
      // this.acctCodes=window.sessionStorage.getItem("acctCodes")
      this.taskID = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      this.ccrcAcctID = this.$store.state.insiderTradAnalysis.accountparam[0]
      this.acctCodes = this.$store.state.insiderTradAnalysis.accountparam[1]
      this.drawTransationStylepic()
      this.drawhabitanalysispic()
    },
    methods: {
      drawpic () {
        this.taskID = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
        this.ccrcAcctID = this.$store.state.insiderTradAnalysis.accountparam[0]
        this.acctCodes = this.$store.state.insiderTradAnalysis.accountparam[1]
        this.drawTransationStylepic()
        this.drawhabitanalysispic()
      },
      drawhabitanalysispic () {
        const loading = this.$loading({
          lock: true,
          text: '数据加载中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        this.habitdata = []
        this.habitclose_price = []
        this.habittrdamt_b = []
        this.habittrdamt_s = []
        let otdimension = ''
        if (this.dimension == '一码通维度') {
          otdimension = 'ccrc'
        } else {
          otdimension = 'ac'
        }
        let params = {
          'trendType': otdimension,
          'secCode': this.secCode,
          'checkEndDate': this.checkEndDate,
          'ccrcAcctID': this.ccrcAcctID,
          'acctCodes': this.acctCodes
        }
        drawhabitanalysis(params).then((resp) => {
          loading.close()
          for (let item of resp.stkPricRes) {
            this.habitdata.push(item.trade_date)
            this.habittrdamt_b.push(item.trdamt_b)
            this.habittrdamt_s.push('-' + item.trdamt_s)
            this.habitclose_price.push(item.hold_amt)
          }
          let mychart = echarts.init(document.getElementById('drawhabitanalysis'), this.gfnGetTheme())
          mychart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {type: 'shadow'}
            },
            xAxis: [
              {
                type: 'category',
                data: this.habitdata
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '买入金额',
                type: 'bar',
                data: this.habittrdamt_b
              },
              {
                name: '卖出金额',
                type: 'bar',
                data: this.habittrdamt_s
              },
              {
                name: '持仓市值',
                type: 'line',
                yAxisIndex: 0,
                data: this.habitclose_price
              }
            ]
          })
        })
      },
      drawTransationStylepic () {
        this.data = []
        this.close_price = []
        this.trdamt_b = []
        this.trdamt_s = []
        let otdimension = ''
        if (this.dimension == '一码通维度') {
          otdimension = 'ccrc'
        } else {
          otdimension = 'ac'
        }
        let params = {
          'trendType': otdimension,
          'secCode': this.secCode,
          'checkEndDate': this.checkEndDate,
          'ccrcAcctID': this.ccrcAcctID,
          'acctCodes': this.acctCodes
        }
        drawTransationStyle(params).then((resp) => {
          for (let item of resp.stockRes) {
            // this.radioColumns=resp.stockRes
            switch (item.rn) {
              case '0':
                this.one = item.sec_code
                this.radioOne = true
                break
              case '1':
                this.two = item.sec_code
                this.radioTwo = true
                break
              case '2':
                this.three = item.sec_code
                this.radioThree = true
                break
              case '3':
                this.four = item.sec_code
                this.radioFour = true
                break
              case '4':
                this.five = item.sec_code
                this.radioFive = true
                break
              case '5':
                this.six = item.sec_code
                this.radioSix = true
                break
            }
          }
          for (let item of resp.stkPricRes) {
            this.data.push(item.trade_date)
            this.trdamt_b.push(item.trdamt_b)
            this.trdamt_s.push('-' + item.trdamt_s)
            this.close_price.push(item.close_price)
          }
          let mychart = echarts.init(document.getElementById('transationStyle'), this.gfnGetTheme())
          mychart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {type: 'shadow'}
            },
            xAxis: [
              {
                type: 'category',
                data: this.data
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '买入金额',
                type: 'bar',
                data: this.trdamt_b
              },
              {
                name: '卖出金额',
                type: 'bar',
                data: this.trdamt_s
              },
              {
                name: '股价',
                type: 'line',
                yAxisIndex: 0,
                data: this.close_price
              }
            ]
          })
        })
      }
    }
  }
</script>
