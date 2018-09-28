<template>
  <div class="dataInvestigation">
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
            <el-form-item label="起止日期：" prop="seDate" class="form-inline">
              <s-date-picker
                v-model="ruleForm.seDate"
                :is-range="true"
                type="date"
                startPlaceholder="请选择开始日期"
                endPlaceholder="请选择结束日期"></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="type" label="协查类型：" class="form-inline">
              <el-select
                multiple
                collapse-tags
                size="small"
                style="width: 240px!important;"
                v-model="ruleForm.type"
                placeholder="全部">
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
  import SDatePicker from '../../base/SDatePicker'
  import echarts from 'echarts'
  import moment from 'moment'
  import { dataInvestigationTrend } from '../../../service/workStatistics/index'

  export default {
    name: 'trend',
    props: [],
    components: {
      SelectLazyMultiple,
      SDatePicker
    },
    mixins: [],
    data () {
      let sDate = '', eDate = ''
      sDate = moment().subtract(1, 'years').format('YYYY-MM-DD')
      eDate = moment().format('YYYY-MM-DD')
      return {
        ruleForm: {
          stockCode: [],
          seDate: [sDate, eDate],
          type: [],
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
          {value: 'qtyl', label: '老鼠仓趋同及盈利'},
          {value: 'hz', label: '黑嘴数据'},
          {value: 'dx', label: '短线操纵指标'},
          {value: 'kqcz', label: '跨期操纵指标'},
          {value: 'ylxj', label: '盈利-先进先出'},
          {value: 'ylhj', label: '盈利-后进先出'},
          {value: 'ylzm', label: '盈利-账面'},
          {value: 'ylfz', label: '盈利-复杂'},
          {value: 'hgt', label: '沪港通数据查询'},
          {value: 'kh', label: '常规查询-开户查询'},
          {value: 'wt', label: '常规查询-交易流水'},
          {value: 'cg', label: '常规查询-持股变动'},
          {value: 'yyb', label: '常规查询-营业部'},
          {value: 'cgqt', label: '常规查询-其它'},
          {value: 'qt', label: '其它'}
        ],
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
            let params = {
              type: this.ruleForm.wmType,
              securityId: this.ruleForm.stockCode,
              sDate: moment(this.ruleForm.seDate[0]).format('YYYY-MM-DD'),
              eDate: moment(this.ruleForm.seDate[1]).format('YYYY-MM-DD'),
              digCode: this.ruleForm.type,
              mark: 'dt' // 数据协查走势
            }
            // let measureData1 = [], measureData2 = [], measureData3 = [], measureData4 = [], measureData5 = [],
            //   measureData6 = [], measureData7 = [], measureData8 = [], measureData9 = [], measureData10 = [],
            //   measureData11 = [], measureData12 = [], measureData13 = [], measureData14 = [], measureData15 = []
            // let chartData = {
            //   time: [],
            //   data: [
            //     {name: '老鼠仓趋同及盈利', type: 'line', data: measureData1, smooth: true},
            //     {name: '黑嘴数据', type: 'line', data: measureData2, smooth: true},
            //     {name: '短线操纵指标', type: 'line', data: measureData3, smooth: true},
            //     {name: '跨期操纵指标', type: 'line', data: measureData4, smooth: true},
            //     {name: '盈利-先进先出', type: 'line', data: measureData5, smooth: true},
            //     {name: '盈利-后进先出', type: 'line', data: measureData6, smooth: true},
            //     {name: '盈利-账面', type: 'line', data: measureData7, smooth: true},
            //     {name: '盈利-复杂', type: 'line', data: measureData8, smooth: true},
            //     {name: '沪港通数据查询', type: 'line', data: measureData9, smooth: true},
            //     {name: '常规查询-开户查询', type: 'line', data: measureData10, smooth: true},
            //     {name: '常规查询-交易流水', type: 'line', data: measureData11, smooth: true},
            //     {name: '常规查询-持股变动', type: 'line', data: measureData12, smooth: true},
            //     {name: '常规查询-营业部', type: 'line', data: measureData13, smooth: true},
            //     {name: '常规查询-其它', type: 'line', data: measureData14, smooth: true},
            //     {name: '其它', type: 'line', data: measureData15, smooth: true}
            //   ]
            // }
            let chartData = {time: [], data: []}
            dataInvestigationTrend(JSON.stringify(params)).then((resp) => {
              if (resp.length > 0 && Object.keys(resp[0]).length > 0) {
                // resp.forEach((obj) => {
                //   chartData.time.push(obj.today)
                //   measureData1.push(obj.qtyl)
                //   measureData2.push(obj.hz)
                //   measureData3.push(obj.dx)
                //   measureData4.push(obj.kqcz)
                //   measureData5.push(obj.ylxj)
                //   measureData6.push(obj.ylhj)
                //   measureData7.push(obj.ylzm)
                //   measureData8.push(obj.ylfz)
                //   measureData9.push(obj.hgt)
                //   measureData10.push(obj.kh)
                //   measureData11.push(obj.wt)
                //   measureData12.push(obj.cg)
                //   measureData13.push(obj.yyb)
                //   measureData14.push(obj.cgqt)
                //   measureData15.push(obj.qt)
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
        this.typeOptions.forEach((obj) => {
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
            text: '数据协查走势图'
          },
          tooltip: {
            trigger: 'axis',
            confine: true
          },
          grid: {
            right: '12%',
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

<style lang="less">
  .dataInvestigation {
    .form-inline {
      display: inline-block;
    }
    .selectlazymultiple {
      width: 240px !important;
    }
    .el-date-editor {
      width: 280px !important;
    }
  }
</style>