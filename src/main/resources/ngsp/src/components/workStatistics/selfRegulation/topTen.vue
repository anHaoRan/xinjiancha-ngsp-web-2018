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
            <el-form-item class="form-inline">
              <el-button type="primary" @click="submitForm">生成图表</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-show="showCard">
      <div id='membarChart' style="height: 450px"
           v-loading="loading1"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"></div>
    </el-card>
    <el-card v-show="showCard">
      <div id='salePartBarChart' style="height: 450px"
           v-loading="loading2"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"></div>
    </el-card>
    <el-card v-show="showCard">
      <div id='invesBarChart' style="height: 450px"
           v-loading="loading3"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"></div>
    </el-card>
  </div>
</template>

<script>
  import SelectLazyMultiple from '@/components/common/SelectLazyMultiple'
  import echarts from 'echarts'
  import {
    selfRegulationTopTenAccount,
    selfRegulationTopTenSalePart,
    selfRegulationTopTenMember
  } from '../../../service/workStatistics/index'

  export default {
    name: 'top-ten',
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
          measure: []
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
        measureOptionsA: [
          {value: 'oral_alarm', label: '口头警示'},
          {value: 'written_alarm', label: '书面警示'},
          {value: 'pause_transaction', label: '盘中暂停交易'},
          {value: 'duration_transaction', label: '持续暂停交易'},
          {value: 'demand_correct', label: '要求限期改正'},
          {value: 'supervise_talk', label: '监管谈话'},
          {value: 'commit_promise', label: '要求提交合规承诺书'}
        ],
        measureOptionsB: [
          {value: 'limit_transaction', label: '限制交易'},
          {value: 'unqualified_investor', label: '认定为不合格投资者'}
        ],
        measureOptionsALL: allMeasure,
        showCard: false,
        loading1: false,
        loading2: false,
        loading3: false
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
            // 会员统计
            this.setChartData('membarChart', selfRegulationTopTenMember, '排名前十会员统计')
            // 营业部统计
            this.setChartData('salePartBarChart', selfRegulationTopTenSalePart, '排名前十营业部统计')
            // 投资者
            this.setChartData('invesBarChart', selfRegulationTopTenAccount, '排名前十投资者统计')
          }
        })
      },
      setChartData (id, requestFunc, title) {
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
          securityId: this.ruleForm.stockCode,
          superviseType: this.ruleForm.type,
          superviseCode: superviseCode
        }
        // let measureData1 = [], measureData2 = [], measureData3 = [], measureData4 = [], measureData5 = [],
        //   measureData6 = [], measureData7 = [], measureData8 = [], measureData9 = []
        // let chartData = {
        //   // data1: ['口头警示', '书面警示', '盘中暂停交易', '持续暂停交易', '限制交易', '认定为不合格投资者', '要求限期改正', '监管谈话', '要求提交合规承诺书'],
        //   name: [],
        //   data2: [
        //     {name: '口头警示', type: 'bar', barWidth: 10, stack: '总数', data: measureData1},
        //     {name: '书面警示', type: 'bar', barWidth: 10, stack: '总数', data: measureData2},
        //     {name: '盘中暂停交易', type: 'bar', barWidth: 10, stack: '总数', data: measureData3},
        //     {name: '持续暂停交易', type: 'bar', barWidth: 10, stack: '总数', data: measureData4},
        //     {name: '限制交易', type: 'bar', barWidth: 10, stack: '总数', data: measureData5},
        //     {name: '认定为不合格投资者', type: 'bar', barWidth: 14, stack: '总数', data: measureData6},
        //     {name: '要求限期改正', type: 'bar', barWidth: 14, stack: '总数', data: measureData7},
        //     {name: '监管谈话', type: 'bar', barWidth: 14, stack: '总数', data: measureData8},
        //     {name: '要求提交合规承诺书', type: 'bar', barWidth: 14, stack: '总数', data: measureData9}
        //   ]
        // }
        if (id === 'membarChart') {
          this.loading1 = true
        }
        if (id === 'salePartBarChart') {
          this.loading2 = true
        }
        if (id === 'invesBarChart') {
          this.loading3 = true
        }
        let chartData = {name: [], data2: []}
        requestFunc(JSON.stringify(params)).then((resp) => {
          if (resp.length > 0 && Object.keys(resp[0]).length > 0) {
            resp = resp.reverse()
            // resp.forEach((obj) => {
            //   chartData.name.push(obj.account)
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
              chartData.name.push(resp[i].account)
              if (i === 0) {
                for (let item in resp[0]) {
                  if (item !== 'account' && item !== 'total') {
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
              var tempObj = {name: chineseName, type: 'bar', barWidth: 10, stack: '总数', data: oneLineArr}
              chartData.data2.push(tempObj)
            }
          }
          if (id === 'membarChart') {
            this.loading1 = false
          }
          if (id === 'salePartBarChart') {
            this.loading2 = false
          }
          if (id === 'invesBarChart') {
            this.loading3 = false
          }
          this.drawLineChart(id, chartData, title)
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
      drawLineChart (id, chartData, title) {
        let measureline = ''
        measureline = echarts.init(document.getElementById(id), this.gfnGetTheme())
        measureline.clear()
        window.onresize = measureline.resize
        measureline.setOption({
          title: {
            text: title
          },
          tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            // data: chartData.data1,
            inactiveColor: '#455579',
            bottom: 10,
            textStyle: {
              color: '#506798'
            }
          },
          grid: {
            left: '3%',
            right: '5%',
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
          xAxis: {
            type: 'value',
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#cccccc'
              }
            }
          },
          yAxis: {
            show: true,
            type: 'category',
            mininterval: 1,
            data: chartData.name
          },
          series: chartData.data2
        })
      },
      changeMeasure (val) {
        this.ruleForm.measure = []
        switch (val) {
          case '0':
          case '1':
            this.measureOptions = this.measureOptionsA
            break
          case '2':
            this.measureOptions = this.measureOptionsB
            break
          case 'ALL':
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