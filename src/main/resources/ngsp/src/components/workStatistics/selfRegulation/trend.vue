<template>
  <div class="trend">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="140px"
               style="padding-top: 20px">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="stockCode" label="证券代码及简称：" class="form-inline">
              <select-lazy-multiple :selectParams="selectParamsStock" @getSelectRes="getSelectResStock"
                                    style="display: inline-block;" ref="selectLazyMultiple"></select-lazy-multiple>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="type" label="监管类别：" class="form-inline">
              <el-select v-model="ruleForm.type" @change="changeMeasure" size="small">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="measure" label="监管措施：" class="form-inline">
              <el-select
                multiple
                collapse-tags
                size="small"
                v-model="ruleForm.measure"
                placeholder="全部">
                <el-option
                  v-for="item in measureOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="wmType" label="汇总粒度：" class="form-inline">
              <el-select v-model="ruleForm.wmType" size="small">
                <el-option
                  v-for="item in cycleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item class="form-inline" style="float: right; margin-right: 100px;">
              <el-button type="primary" @click="submitForm">生成图表</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-show="showCard">
      <div id='lineChart' style="height: 530px"
           v-loading="loading"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"></div>
    </el-card>
  </div>
</template>

<script>
  import SelectLazyMultiple from '@/components/common/SelectLazyMultiple'
  import echarts from 'echarts'
  import { selfRegulationTrend } from '../../../service/workStatistics/index'

  export default {
    name: 'trend',
    props: [],
    components: {
      SelectLazyMultiple
    },
    mixins: [],
    data () {
      const allMeasure = [
        {value: 'oral_alarm', label: '口头警示'},
        {value: 'written_alarm', label: '书面警示'},
        {value: 'pause_transaction', label: '盘中暂停交易'},
        {value: 'duration_transaction', label: '持续暂停交易'},
        {value: 'limit_transaction', label: '限制交易'},
        {value: 'unqualified_investor', label: '认定为不合格投资者'},
        {value: 'demand_correct', label: '要求限期改正'},
        {value: 'supervise_talk', label: '监管谈话'},
        {value: 'commit_promise', label: '要求提交合规承诺书'}
      ]
      return {
        ruleForm: {
          stockCode: [],
          type: 'ALL',
          measure: [],
          wmType: 'm'
        },
        rules: {},
        selectParamsStock: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        typeOptions: [
          {value: 'ALL', label: '全部'},
          {value: '0', label: '标准化'},
          {value: '1', label: '非标准'},
          {value: '2', label: '纪律处分'}
        ],
        measureOptions: allMeasure,
        // 口头警示,书面警示,盘中暂停交易,持续暂停交易,要求限期改正,监管谈话,要求提交合规承诺书
        measureOptionsA: [
          {value: 'oral_alarm', label: '口头警示'},
          {value: 'written_alarm', label: '书面警示'},
          {value: 'pause_transaction', label: '盘中暂停交易'},
          {value: 'duration_transaction', label: '持续暂停交易'},
          {value: 'demand_correct', label: '要求限期改正'},
          {value: 'supervise_talk', label: '监管谈话'},
          {value: 'commit_promise', label: '要求提交合规承诺书'}
        ],
        // 限制交易,认定为不合格投资者
        measureOptionsB: [
          {value: 'limit_transaction', label: '限制交易'},
          {value: 'unqualified_investor', label: '认定为不合格投资者'}
        ],
        measureOptionsALL: allMeasure,
        cycleOptions: [
          {value: 'w', label: '按周汇总'},
          {value: 'm', label: '按月汇总'}
        ],
        showCard: false,
        loading: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      getSelectResStock (val, label) {
        this.ruleForm.stockCode = label
      },
      submitForm () {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.showCard = true
            this.loading = true
            let superviseCode = []
            if (this.ruleForm.measure.length !== 0) {
              superviseCode = this.ruleForm.measure
            } else {
              switch (this.ruleForm.type) {
                case 'ALL':
                  superviseCode = ['oral_alarm', 'written_alarm', 'pause_transaction', 'duration_transaction', 'limit_transaction', 'unqualified_investor', 'demand_correct', 'supervise_talk', 'commit_promise']
                  break
                case '0':
                case '1':
                  superviseCode = ['oral_alarm', 'written_alarm', 'pause_transaction', 'duration_transaction', 'demand_correct', 'supervise_talk', 'commit_promise']
                  break
                case '2':
                  superviseCode = ['limit_transaction', 'unqualified_investor']
                  break
              }
            }
            let params = {
              type: this.ruleForm.wmType,
              securityId: this.ruleForm.stockCode,
              superviseType: this.ruleForm.type,
              superviseCode: superviseCode,
              mark: 'sc' // 监管走势
            }
            // 图表的按钮是按固定顺序的
            // let measureData1 = [], measureData2 = [], measureData3 = [], measureData4 = [], measureData5 = [],
            //   measureData6 = [], measureData7 = [], measureData8 = [], measureData9 = []
            // let chartData = {
            //   time: [],
            //   data: [
            //     {name: '口头警示', type: 'line', data: measureData1, smooth: true},
            //     {name: '书面警示', type: 'line', data: measureData2, smooth: true},
            //     {name: '盘中暂停交易', type: 'line', data: measureData3, smooth: true},
            //     {name: '持续暂停交易', type: 'line', data: measureData4, smooth: true},
            //     {name: '限制交易', type: 'line', data: measureData5, smooth: true},
            //     {name: '认定为不合格投资者', type: 'line', data: measureData6, smooth: true},
            //     {name: '要求限期改正', type: 'line', data: measureData7, smooth: true},
            //     {name: '监管谈话', type: 'line', data: measureData8, smooth: true},
            //     {name: '要求提交合规承诺书', type: 'line', data: measureData9, smooth: true}
            //   ]
            // }

            // 图表的按钮顺序不定
            let chartData = {time: [], data: []}
            selfRegulationTrend(JSON.stringify(params)).then((resp) => {
              if (resp.length > 0 && Object.keys(resp[0]).length > 0) {
                // resp.forEach((obj) => {
                //   chartData.time.push(obj.today)
                //   measureData1.push(obj.oral_alarm) // 口头警示
                //   measureData2.push(obj.written_alarm) // 书面警示
                //   measureData3.push(obj.pause_transaction) // 盘中暂停交易
                //   measureData4.push(obj.duration_transaction) // 持续暂停交易
                //   measureData5.push(obj.limit_transaction) // 限制交易
                //   measureData6.push(obj.unqualified_investor) // 认定为不合格投资者
                //   measureData7.push(obj.demand_correct) // 要求限期改正
                //   measureData8.push(obj.supervise_talk) // 监管谈话
                //   measureData9.push(obj.commit_promise) // 要求提交合规承诺书
                // })
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
                  var tempObj = {name: chineseName, type: 'line', data: oneLineArr, smooth: true}
                  chartData.data.push(tempObj)
                }
              }
              this.loading = false
              this.drawLineChart('lineChart', chartData)
            })
          }
        })
      },
      exchangeWords (val) {
        let newVal = ''
        this.measureOptionsALL.forEach((obj) => {
          if (val === obj.value) {
            newVal = obj.label
          }
        })
        return newVal
      },
      drawLineChart (id, chartData) {
        let measureline = echarts.init(document.getElementById(id), this.gfnGetTheme())
        measureline.clear()
        window.onresize = measureline.resize
        measureline.setOption({
          title: {
            text: '自律监管走势图'
          },
          tooltip: {
            trigger: 'axis',
            confine: true
          },
          grid: {
            bottom: '1%',
            containLabel: true
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
          legend: {
            inactiveColor: '#455579',
            top: '10',
            textStyle: {
              color: '#506798'
            }
          },
          xAxis: {
            type: 'category',
            data: chartData.time,
            axisLabel: {
              rotate: '50',
              color: '#506798'
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#263657',
                type: 'solid'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#334164'
              }
            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: false,
            axisLabel: {
              color: '#506798'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#263657',
                type: 'solid',
                width: '2'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#334164'
              }
            }
          },
          series: chartData.data
        })
      },
      changeMeasure (val) {
        switch (val) {
          case '0':
          case '1':
            this.ruleForm.measure = []
            this.measureOptions = this.measureOptionsA
            break
          case '2':
            this.ruleForm.measure = []
            this.measureOptions = this.measureOptionsB
            break
          case 'ALL':
            this.ruleForm.measure = []
            this.measureOptions = this.measureOptionsALL
            break
        }
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
      width: 270px !important;
    }
  }
</style>