<template>
  <div class="classifyChart">
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
                                    style="display: inline-block;" ref="selectLazyMultiple"></select-lazy-multiple>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="一码通：" prop="yimaCode" class="form-inline">
              <el-input v-model="ruleForm.yimaCode" placeholder="请输入一码通"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="起止日期：" prop="seDate" class="form-inline">
              <s-date-picker
                v-model="ruleForm.seDate"
                :is-range="true"
                type="date"
                startPlaceholder="请选择开始日期"
                endPlaceholder="请选择结束日期"></s-date-picker>
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
    <el-card v-show="showCard1">
      <div id='barChart1' style="height: 450px"
           v-loading="loading1"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"></div>
    </el-card>
    <el-card v-show="showCard2">
      <div id='barChart2' style="height: 350px"
           v-loading="loading2"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import moment from 'moment'
  import SelectLazyMultiple from '@/components/common/SelectLazyMultiple'
  import SDatePicker from '../../base/SDatePicker'
  import { abnormalBehaviorClassifySum, abnormalBehaviorClassifySub } from '../../../service/workStatistics/index'

  export default {
    name: 'classify-chart',
    props: [],
    components: {
      SDatePicker,
      SelectLazyMultiple
    },
    mixins: [],
    data () {
      let sDate = '', eDate = ''
      sDate = moment().subtract(3, 'months').format('YYYY-MM-DD')
      eDate = moment().format('YYYY-MM-DD')
      return {
        ruleForm: {
          stockCode: [],
          memberCode: [],
          yimaCode: '',
          seDate: [sDate, eDate]
        },
        member: [],
        params: {}, // 二级异常时需要当前查询条件
        rules: {
          seDate: [
            {required: true, message: '请输入时间', trigger: 'change'}
          ],
        },
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
        showCard1: false,
        showCard2: false,
        loading1: false,
        loading2: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      submitForm () {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.showCard1 = true
            this.loading1 = true
            // 参数
            this.member.forEach((item) => {
              this.ruleForm.memberCode.push(item.split(' ')[1])
            })
            let params = {
              involve_stock: this.ruleForm.stockCode,
              memberCode: this.ruleForm.memberCode,
              sDate: moment(this.ruleForm.seDate[0]).format('YYYY-MM-DD'),
              eDate: moment(this.ruleForm.seDate[1]).format('YYYY-MM-DD'),
              ymtCode: this.ruleForm.yimaCode === '' ? [] : this.ruleForm.yimaCode.split(',')
            }
            this.params = params
            // chart data
            let valueData = []
            let chartData = {name: [], data: []}
            abnormalBehaviorClassifySum(JSON.stringify(params)).then((resp) => {
              chartData.name = Object.keys(resp)
              for (let i in resp) {
                valueData.push(resp[i])
              }
              chartData.data = valueData
              this.loading1 = false
              this.drawLineChart('barChart1', chartData)
            })
          }
        })
      },
      drawLineChart (id, chartData) {
        let barChart = echarts.init(document.getElementById(id), this.gfnGetTheme())
        barChart.clear()
        window.onresize = barChart.resize
        barChart.setOption({
          title: {
            text: '调查单调查事项合计'
          },
          tooltip: {
            trigger: 'axis',
            confine: true
          },
          legend: {
            inactiveColor: '#455579',
            right: 'right',
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
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#cccccc'
              }
            }
          },
          yAxis: {
            type: 'category',
            data: chartData.name
          },
          series: [{
            type: 'bar',
            barWidth: 10,
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            },
            data: chartData.data
          }]
        })
        barChart.on('click', (params) => {
          this.showCard2 = true
          let secondParams = this.params
          secondParams.abnormal_behav_1 = params.name
          // 展示柱图
          let valData = []
          let barData = {
            name: [],
            data: []
          }
          this.loading2 = true
          abnormalBehaviorClassifySub(JSON.stringify(secondParams)).then((resp) => {
            // kan mingbai jiu kan ,bu mingbai jiu suan le
            let temp = {}
            for (let i in resp[0]) {
              temp = resp[0][i]
            }
            let temp2 = Object.keys(temp)
            let temp3 = []
            temp2.forEach((item) => {
              if (item !== 'total') {
                temp3.push(item)
              }
            })
            barData.name = temp3
            for (let j in temp) {
              if (j !== 'total') {
                valData.push(temp[j])
              }
            }
            barData.data = valData
            this.loading2 = false
            this.drawBarChart('barChart2', barData)
          })
          // barChart.dispatchAction({
          //   type: 'highlight',
          //   dataIndex: params.dataIndex
          // })
        })
      },
      drawBarChart (id, chartData) {
        let barChart = echarts.init(document.getElementById(id), this.gfnGetTheme())
        barChart.setOption({
          title: {
            text: '调查单异常行为合计'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            inactiveColor: '#455579',
            right: 'right',
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
            data: chartData.name
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            type: 'bar',
            barWidth: 10,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: chartData.data
          }]
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
  .classifyChart {
    .form-inline {
      display: inline-block;
    }
    .selectlazymultiple {
      width: 370px !important;
    }
    .inputWidth {
      width: 280px;
    }
  }
</style>