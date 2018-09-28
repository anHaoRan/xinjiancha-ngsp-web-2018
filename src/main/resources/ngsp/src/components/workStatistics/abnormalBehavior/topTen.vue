<template>
  <div class="topTen">
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
            <el-form-item prop="matter" label="调查事项：" class="form-inline">
              <el-select
                multiple
                collapse-tags
                size="small"
                style="width: 280px;"
                v-model="ruleForm.matter"
                placeholder="全部">
                <el-option
                  v-for="item in matterOptions"
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
    abnormalBehaviorTopTenMember,
    abnormalBehaviorTopTenSalePart,
    abnormalBehaviorTopTenAccount
  } from '../../../service/workStatistics/index'

  export default {
    name: 'top-ten',
    props: [],
    components: {
      SelectLazyMultiple
    },
    mixins: [],
    data () {
      return {
        ruleForm: {
          stockCode: [],
          matter: []
        },
        rules: {},
        selectParamsStock: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        matterOptions: [
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
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.showCard = true
            // 会员统计
            this.setChartData('membarChart', abnormalBehaviorTopTenMember, '会员', 'member')
            // 营业部统计
            this.setChartData('salePartBarChart', abnormalBehaviorTopTenSalePart, '营业部', 'salePart')
            // 投资者
            this.setChartData('invesBarChart', abnormalBehaviorTopTenAccount, '投资者', 'ymt')
          }
        })
      },
      setChartData (id, requestFunc, title, mark) {
        if (id === 'membarChart') {
          this.loading1 = true
        }
        if (id === 'salePartBarChart') {
          this.loading2 = true
        }
        if (id === 'invesBarChart') {
          this.loading3 = true
        }
        // 参数
        let unusualCode = []
        if (this.ruleForm.matter.length === 0) {
          unusualCode = ['jhjj', 'pzxj', 'zdtb', 'lsgpkp', 'lsgppz', 'lsgpsp', 'fxjy', 'dd', 'lszq', 'qtzq', 'lsjj', 'qtjj', 'zdtde', 'dzjy', 'brfx', 'cxhjy', 'qtgp', 'qt', 'dqzl']
        } else {
          unusualCode = this.ruleForm.matter
        }
        let params = {
          mark: mark,
          topN: '10',
          involve_stock: this.ruleForm.stockCode,
          unusualCode: unusualCode
        }
        // let measureData1 = [], measureData2 = [], measureData3 = [], measureData4 = [], measureData5 = [],
        //   measureData6 = [], measureData7 = [], measureData8 = [], measureData9 = [], measureData10 = [],
        //   measureData11 = [], measureData12 = [], measureData13 = [], measureData14 = [], measureData15 = [],
        //   measureData16 = [], measureData17 = [], measureData18 = [], measureData19 = []
        // let chartData = {
        //   name: [],
        //   data2: [
        //     {name: '集合竞价虚假申报', type: 'bar', data: measureData1, barWidth: 10, stack: '总数'},
        //     {name: '盘中虚假申报', type: 'bar', data: measureData2, barWidth: 10, stack: '总数'},
        //     {name: '涨跌停板虚假申报', type: 'bar', data: measureData3, barWidth: 10, stack: '总数'},
        //     {name: '拉升（打压）股票开盘价格', type: 'bar', data: measureData4, barWidth: 10, stack: '总数'},
        //     {name: '拉升（打压）股票盘中价格', type: 'bar', data: measureData5, barWidth: 10, stack: '总数'},
        //     {name: '拉升（打压）股票收盘价格', type: 'bar', data: measureData6, barWidth: 10, stack: '总数'},
        //     {name: '反向交易', type: 'bar', data: measureData7, barWidth: 10, stack: '总数'},
        //     {name: '对倒', type: 'bar', data: measureData8, barWidth: 10, stack: '总数'},
        //     {name: '拉升（打压）债券价格', type: 'bar', data: measureData9, barWidth: 10, stack: '总数'},
        //     {name: '其他－债券', type: 'bar', data: measureData10, barWidth: 10, stack: '总数'},
        //     {name: '拉升（打压）基金价格', type: 'bar', data: measureData11, barWidth: 10, stack: '总数'},
        //     {name: '其他－基金', type: 'bar', data: measureData12, barWidth: 10, stack: '总数'},
        //     {name: '涨跌停板大额申报', type: 'bar', data: measureData13, barWidth: 10, stack: '总数'},
        //     {name: '大宗交易异常', type: 'bar', data: measureData14, barWidth: 10, stack: '总数'},
        //     {name: '买入风险警示股超限', type: 'bar', data: measureData15, barWidth: 10, stack: '总数'},
        //     {name: '程序化交易异常', type: 'bar', data: measureData16, barWidth: 10, stack: '总数'},
        //     {name: '其他－股票', type: 'bar', data: measureData17, barWidth: 10, stack: '总数'},
        //     {name: '其他', type: 'bar', data: measureData18, barWidth: 10, stack: '总数'},
        //     {name: '调取资料', type: 'bar', data: measureData19, barWidth: 10, stack: '总数'}
        //   ]
        // }
        let chartData = {name: [], data2: []}
        requestFunc(JSON.stringify(params)).then((resp) => {
          if (resp.length > 0 && Object.keys(resp[0]).length > 0) {
            resp = resp.reverse()
            // resp.forEach((obj) => {
            //   chartData.name.push(obj.account)
            //   measureData1.push(obj.jhjj)
            //   measureData2.push(obj.pzxj)
            //   measureData3.push(obj.zdtb)
            //   measureData4.push(obj.lsgpkp)
            //   measureData5.push(obj.lsgppz)
            //   measureData6.push(obj.lsgpsp)
            //   measureData7.push(obj.fxjy)
            //   measureData8.push(obj.dd)
            //   measureData9.push(obj.lszq)
            //   measureData10.push(obj.qtzq)
            //   measureData11.push(obj.lsjj)
            //   measureData12.push(obj.qtjj)
            //   measureData13.push(obj.zdtde)
            //   measureData14.push(obj.dzjy)
            //   measureData15.push(obj.brfx)
            //   measureData16.push(obj.cxhjy)
            //   measureData17.push(obj.qtgp)
            //   measureData18.push(obj.qt)
            //   measureData19.push(obj.dqzl)
            // })
            let nameArr = []
            for (let i = 0, len = resp.length; i < len; i++) {
              chartData.name.push(resp[i].account)
              if (i === 0) {
                for (let item in resp[0]) {
                  if (item !== 'total' && item !== 'account') {
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
              var tempObj = {name: chineseName, type: 'bar', data: oneLineArr, barWidth: 10, stack: '总数'}
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
        this.matterOptions.forEach((obj) => {
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
            inactiveColor: '#455579',
            width: '80%',
            bottom: '1',
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
            data: chartData.name
          },
          series: chartData.data2
        })
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
  .topTen {
    .form-inline {
      display: inline-block;
    }
    .selectlazymultiple {
      width: 270px !important;
    }
  }
</style>