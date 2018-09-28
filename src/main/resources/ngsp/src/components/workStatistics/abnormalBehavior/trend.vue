<template>
  <div class="trend">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="140px"
               style="padding-top: 20px">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="stockCode" label="证券代码及简称：" class="form-inline">
              <select-lazy-multiple :selectParams="selectParamsStock" @getSelectRes="getSelectResStock"
                                    style="display: inline-block;" ref="selectLazyMultiple"></select-lazy-multiple>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="type" label="会员代码及名称：" class="form-inline">
              <select-lazy-multiple :selectParams="selectParamsMember" @getSelectRes="getSelectResMember"
                                    style="display: inline-block;" ref="selectLazyMultiple1"></select-lazy-multiple>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="一码通：" prop="yimatong" class="form-inline">
              <el-input v-model="ruleForm.yimatong" placeholder="多个代码请以英文逗号隔开" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="异常行为：" prop="abnormal" class="form-inline">
              <el-select
                multiple
                class="inputWidth"
                collapse-tags
                size="small"
                v-model="ruleForm.abnormal"
                placeholder="全部">
                <el-option
                  v-for="item in abnormalOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="wmType" label="汇总粒度：" class="form-inline">
              <el-select v-model="ruleForm.wmType" size="small" class="inputWidth">
                <el-option
                  v-for="item in cycleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="form-inline">
              <el-button type="primary" @click="submitForm">生成图表</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-show="showCard" style="width: 68%; display: inline-block">
      <div>
        <div id='lineChart' style="height: 530px"
             v-loading="loading1"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)"></div>
      </div>
    </el-card>
    <el-card v-show="showCard" style="width: 30%; margin-left: 1.5%; display: inline-block">
      <div>
        <div id='pieChart' style="height: 530px"
             v-loading="loading2"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import SelectLazyMultiple from '@/components/common/SelectLazyMultiple'
  import echarts from 'echarts'
  import { abnormalBehaviorTrend, abnormalBehaviorTrendPie } from '../../../service/workStatistics/index'

  export default {
    name: 'trend',
    props: [],
    components: {
      SelectLazyMultiple
    },
    mixins: [],
    data () {
      return {
        ruleForm: {
          stockCode: [],
          memberCode: [],
          yimatong: '',
          abnormal: [],
          wmType: 'm'
        },
        member: [],
        rules: {},
        selectParamsStock: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        selectParamsMember: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'member'
        },
        abnormalOptions: [
          {value: 'jhjj', label: '集合竞价虚假申报'},
          {value: 'pzxj', label: '盘中虚假申报'},
          {value: 'zdtb', label: '涨跌停板虚假申报'},
          {value: 'lsgpkp', label: '拉升（打压）股票开盘价格'},
          {value: 'lsgppz', label: '拉升（打压）股票盘中价格'},
          {value: 'lsgpsp', label: '拉升（打压）股票收盘价格'},
          {value: 'fxjy', label: '反向交易'},
          {value: 'dd', label: '对倒'},
          {value: 'lszq', label: '拉升（打压）债券价格'},
          {value: 'qtzq', label: '其他－债券'},
          {value: 'lsjj', label: '拉升（打压）基金价格'},
          {value: 'qtjj', label: '其他－基金'},
          {value: 'zdtde', label: '涨跌停板大额申报'},
          {value: 'dzjy', label: '大宗交易异常'},
          {value: 'brfx', label: '买入风险警示股超限'},
          {value: 'cxhjy', label: '程序化交易异常'},
          {value: 'qtgp', label: '其他－股票'},
          {value: 'qt', label: '其他'},
          {value: 'dqzl', label: '调取资料'}
        ],
        cycleOptions: [
          {value: 'w', label: '按周汇总'},
          {value: 'm', label: '按月汇总'}
        ],
        showCard: false,
        loading1: false,
        loading2: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      submitForm () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.showCard = true
            this.loading1 = true
            // 参数准备
            if (this.member.length > 0 && this.ruleForm.yimatong) {
              this.$message.error('会员代码与一码通不能同时使用')
              return
            }
            this.member.forEach((item) => {
              this.ruleForm.memberCode.push(item.split(' ')[1])
            })
            let unusualCode = []
            if (this.ruleForm.abnormal.length === 0) {
              unusualCode = ['jhjj', 'pzxj', 'zdtb', 'lsgpkp', 'lsgppz', 'lsgpsp', 'fxjy', 'dd', 'lszq', 'qtzq', 'lsjj', 'qtjj', 'zdtde', 'dzjy', 'brfx', 'cxhjy', 'qtgp', 'qt', 'dqzl']
            } else {
              unusualCode = this.ruleForm.abnormal
            }
            let params = {
              type: this.ruleForm.wmType,
              mark: 'uc', // 异常走势  这个我不知道是干啥的，是后台要的
              involve_stock: this.ruleForm.stockCode,
              memberCode: this.ruleForm.memberCode,
              ymtCode: !this.ruleForm.yimatong ? [] : this.ruleForm.yimatong.split(','),
              unusualCode: unusualCode
            }
            // chart data
            // let measureData1 = [], measureData2 = [], measureData3 = [], measureData4 = [], measureData5 = [],
            //   measureData6 = [], measureData7 = [], measureData8 = [], measureData9 = [], measureData10 = [],
            //   measureData11 = [], measureData12 = [], measureData13 = [], measureData14 = [], measureData15 = [],
            //   measureData16 = [], measureData17 = [], measureData18 = [], measureData19 = []
            // let chartData = {
            //   time: [],
            //   data: [
            //     {name: '集合竞价虚假申报', type: 'line', data: measureData1, smooth: true, symbolSize: 8},
            //     {name: '盘中虚假申报', type: 'line', data: measureData2, smooth: true, symbolSize: 8},
            //     {name: '涨跌停板虚假申报', type: 'line', data: measureData3, smooth: true, symbolSize: 8},
            //     {name: '拉升（打压）股票开盘价格', type: 'line', data: measureData4, smooth: true, symbolSize: 8},
            //     {name: '拉升（打压）股票盘中价格', type: 'line', data: measureData5, smooth: true, symbolSize: 8},
            //     {name: '拉升（打压）股票收盘价格', type: 'line', data: measureData6, smooth: true, symbolSize: 8},
            //     {name: '反向交易', type: 'line', data: measureData7, smooth: true, symbolSize: 8},
            //     {name: '对倒', type: 'line', data: measureData8, smooth: true, symbolSize: 8},
            //     {name: '拉升（打压）债券价格', type: 'line', data: measureData9, smooth: true, symbolSize: 8},
            //     {name: '其他－债券', type: 'line', data: measureData10, smooth: true, symbolSize: 8},
            //     {name: '拉升（打压）基金价格', type: 'line', data: measureData11, smooth: true, symbolSize: 8},
            //     {name: '其他－基金', type: 'line', data: measureData12, smooth: true, symbolSize: 8},
            //     {name: '涨跌停板大额申报', type: 'line', data: measureData13, smooth: true, symbolSize: 8},
            //     {name: '大宗交易异常', type: 'line', data: measureData14, smooth: true, symbolSize: 8},
            //     {name: '买入风险警示股超限', type: 'line', data: measureData15, smooth: true, symbolSize: 8},
            //     {name: '程序化交易异常', type: 'line', data: measureData16, smooth: true, symbolSize: 8},
            //     {name: '其他－股票', type: 'line', data: measureData17, smooth: true, symbolSize: 8},
            //     {name: '其他', type: 'line', data: measureData18, smooth: true, symbolSize: 8},
            //     {name: '调取资料', type: 'line', data: measureData19, smooth: true, symbolSize: 8}
            //   ]
            // }
            let chartData = {time: [], data: []}
            abnormalBehaviorTrend(JSON.stringify(params)).then((resp) => {
              if (resp.length > 0 && Object.keys(resp[0]).length > 0) {
              //   resp.forEach((obj) => {
              //     chartData.time.push(obj.today)
              //     measureData1.push(obj.jhjj)
              //     measureData2.push(obj.pzxj)
              //     measureData3.push(obj.zdtb)
              //     measureData4.push(obj.lsgpkp)
              //     measureData5.push(obj.lsgppz)
              //     measureData6.push(obj.lsgpsp)
              //     measureData7.push(obj.fxjy)
              //     measureData8.push(obj.dd)
              //     measureData9.push(obj.lszq)
              //     measureData10.push(obj.qtzq)
              //     measureData11.push(obj.lsjj)
              //     measureData12.push(obj.qtjj)
              //     measureData13.push(obj.zdtde)
              //     measureData14.push(obj.dzjy)
              //     measureData15.push(obj.brfx)
              //     measureData16.push(obj.cxhjy)
              //     measureData17.push(obj.qtgp)
              //     measureData18.push(obj.qt)
              //     measureData19.push(obj.dqzl)
              //   })
                let nameArr = []
                for (let i = 0, len = resp.length; i < len; i++) {
                  chartData.time.push(resp[i].today)
                  if (i === 0) {
                    for (let item in resp[0]) {
                      if (item !== 'today') {
                        nameArr.push(item)
                      }
                    }
                  }
                }
                for (let j = 0, len = nameArr.length; j < len; j++) {
                  var oneLineArr = []
                  var chineseName = this.exchangeWords(nameArr[j])
                  resp.forEach((obj) => {
                    oneLineArr.push(obj[nameArr[j]])
                  })
                  var tempObj = {name: chineseName, type: 'line', data: oneLineArr, smooth: true, symbolSize: 8}
                  chartData.data.push(tempObj)
                }
              }
              this.loading1 = false
              this.drawLineChart('lineChart', chartData)
            })
          }
        })
      },
      exchangeWords (val) {
        let newVal = ''
        switch (val) {
          case 'jhjj':
            newVal = '集合竞价虚假申报'
            break
          case 'pzxj':
            newVal = '盘中虚假申报'
            break
          case 'zdtb':
            newVal = '涨跌停板虚假申报'
            break
          case 'lsgpkp':
            newVal = '拉升（打压）股票开盘价格'
            break
          case 'lsgppz':
            newVal = '拉升（打压）股票盘中价格'
            break
          case 'lsgpsp':
            newVal = '拉升（打压）股票收盘价格'
            break
          case 'fxjy':
            newVal = '反向交易'
            break
          case 'dd':
            newVal = '对倒'
            break
          case 'lszq':
            newVal = '拉升（打压）债券价格'
            break
          case 'qtzq':
            newVal = '其他－债券'
            break
          case 'lsjj':
            newVal = '拉升（打压）基金价格'
            break
          case 'qtjj':
            newVal = '其他－基金'
            break
          case 'zdtde':
            newVal = '涨跌停板大额申报'
            break
          case 'dzjy':
            newVal = '大宗交易异常'
            break
          case 'brfx':
            newVal = '买入风险警示股超限'
            break
          case 'cxhjy':
            newVal = '程序化交易异常'
            break
          case 'qtgp':
            newVal = '其他－股票'
            break
          case 'qt':
            newVal = '其他'
            break
          case 'dqzl':
            newVal = '调取资料'
            break
        }
        return newVal
      },
      drawLineChart (id, chartData) {
        let lineChart = echarts.init(document.getElementById(id), this.gfnGetTheme())
        lineChart.clear()
        window.onresize = pieChart.resize
        lineChart.setOption({
          title: {
            text: '异常行为走势图'
          },
          tooltip: {
            trigger: 'axis',
            confine: true
          },
          grid: {
            right: '20%',
            containLabel: true
          },
          legend: {
            inactiveColor: '#455579',
            orient: 'vertical',
            top: 'middle',
            right: '1%',
            textStyle: {
              color: '#506798'
            }
          },
          toolbox: {
            x: '93%',
            y: 'top',
            itemSize: 20,
            feature: {
              saveAsImage: {
                show: true
              }
            }
          },
          xAxis: {
            type: 'category',
            data: chartData.time,
            axisLabel: {
              rotate: 50
            }
          },
          yAxis: {
            type: 'value'
          },
          series: chartData.data
        })
        lineChart.on('click', (params) => {
          // 点击某一折线展示饼图
          let title = params.seriesName
          let ptitle = encodeURI(title)
          let pieChartData = []
          this.loading2 = true
          abnormalBehaviorTrendPie(ptitle).then((resp) => {
            let code = Object.keys(resp)
            for (let i = 0, len = code.length; i < len; i++) {
              switch (code[i]) {
                case 'QYNJ':
                  pieChartData.push({value: resp.QYNJ, name: '企业年金'})
                  break
                case 'QTJG':
                  pieChartData.push({value: resp.QTJG, name: '其他机构'})
                  break
                case 'JJZH':
                  pieChartData.push({value: resp.JJZH, name: '基金专户'})
                  break
                case 'GMJJ':
                  pieChartData.push({value: resp.GMJJ, name: '公募基金'})
                  break
                case 'RQFII':
                  pieChartData.push({value: resp.RQFII, name: 'RQFII'})
                  break
                case 'HGT':
                  pieChartData.push({value: resp.HGT, name: '沪股通'})
                  break
                case 'SBJJ':
                  pieChartData.push({value: resp.SBJJ, name: '社保基金'})
                  break
                case 'QFII':
                  pieChartData.push({value: resp.QFII, name: 'QFII'})
                  break
                case 'QSZY':
                  pieChartData.push({value: resp.QSZY, name: '券商自营'})
                  break
                case 'BXJG':
                  pieChartData.push({value: resp.BXJG, name: '保险机构'})
                  break
                case 'QSJH':
                  pieChartData.push({value: resp.QSJH, name: '券商集合理财'})
                  break
                case 'XTCP':
                  pieChartData.push({value: resp.XTCP, name: '信托产品'})
                  break
              }
            }
            this.loading2 = false
            this.drawPieChart('pieChart', title, pieChartData)
          })
        })
      },
      drawPieChart (id, title, pieChartData) {
        let pieChart = echarts.init(document.getElementById(id), this.gfnGetTheme())
        pieChart.clear()
        window.onresize = pieChart.resize
        pieChart.setOption({
          title: {
            text: title,
            x: 'center'
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: '{b}：{c} （{d}%）'
          },
          legend: {
            bottom: 10
          },
          toolbox: {
            x: '93%',
            y: 'top',
            itemSize: 20,
            feature: {
              saveAsImage: {
                show: true
              }
            }
          },
          series: [
            {
              name: title,
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: pieChartData
            }
          ]
        })
      },
      getSelectResStock (val, label) {
        this.ruleForm.stockCode = label
      },
      getSelectResMember (val, label) {
        this.member = label
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  .trend {
    .form-inline {
      display: inline-block;
    }
    .selectlazymultiple {
      width: 280px !important;
    }
    .inputWidth {
      width: 280px;
    }
  }
</style>