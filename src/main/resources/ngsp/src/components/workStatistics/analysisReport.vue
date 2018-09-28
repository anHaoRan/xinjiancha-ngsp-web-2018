<template>
  <div class="analysisReport">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="140px"
               style="padding-top: 20px">
        <el-row>
          <el-radio-group v-model="activeType" @change="changeType">
            <el-radio-button label="函件按月统计"></el-radio-button>
            <el-radio-button label="函件按人统计"></el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row>
          <el-col :span="8" v-show="activeType === '函件按月统计'">
            <el-form-item prop="stockCode" label="证券代码及简称：" class="form-inline">
              <select-lazy-multiple :selectParams="selectParamsStock" @getSelectRes="getSelectResStock"
                                    style="display: inline-block;" ref="selectLazyMultiple"></select-lazy-multiple>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="activeType === '函件按人统计'">
            <el-form-item prop="type" label="函件类型：" class="form-inline">
              <el-select
                multiple
                collapse-tags
                size="small"
                style="width: 280px;"
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
      <el-row>
        <div id='barChart1' style="height: 590px"
             v-loading="loading1"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)"></div>
      </el-row>
    </el-card>
    <el-card v-show="showCard2" style="width: 68%; display: inline-block">
      <el-row>
        <div id='barChart2' style="height: 590px"
             v-loading="loading2"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)"></div>
      </el-row>
    </el-card>
    <el-card v-show="showCard2" style="width: 30%; margin-left: 1.5%; display: inline-block">
      <el-row>
        <div id='pieChart' style="height: 590px"
             v-loading="loading2"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)"></div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import SelectLazyMultiple from '@/components/common/SelectLazyMultiple'
  import Breadcrumb from '../common/Breadcrumb'
  import SDatePicker from '../base/SDatePicker'
  import echarts from 'echarts'
  import moment from 'moment'
  import {
    analysisReportMonth,
    analysisReportPerson
  } from '../../service/workStatistics/index'

  export default {
    props: [],
    components: {
      Breadcrumb,
      SelectLazyMultiple,
      SDatePicker
    },
    mixins: [],
    data () {
      let sDate = '', eDate = ''
      sDate = moment().subtract(1, 'years').format('YYYY-MM-DD')
      eDate = moment().format('YYYY-MM-DD')
      return {
        breadcrumbItems: [
          {
            router: '/WorkStatistics',
            label: '工作统计'
          },
          {
            router: '/analysisReportStatistic',
            label: '分析报告统计'
          }
        ],
        activeType: '函件按月统计',
        ruleForm: {
          stockCode: [],
          type: [],
          seDate: [sDate, eDate]
        },
        rules: {
          seDate: [
            {required: true, message: '请选择起始日期'}
          ]
        },
        typeOptions: [
          {value: 'sls', label: '自律监管'},
          {value: 'obd', label: '调取资料发函'},
          {value: 'uns_check', label: '联合监管复函'},
          {value: 'uns_send', label: '联合监管发函'},
          {value: 'crp', label: '线索报告'},
          {value: 'dig', label: '数据协查'}
        ],
        selectParamsStock: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        range1: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        range2: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        showCard1: true,
        showCard2: false,
        loading1: false,
        loading2: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      submitForm () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.activeType === '函件按月统计') {
              this.loading1 = true
              this.setChartData1()
            } else {
              this.loading2 = true
              this.setChartData2()
            }
          }
        })
      },
      // 按月
      setChartData1 () {
        let params = {
          securityid: this.ruleForm.stockCode,
          sDate: moment(this.ruleForm.seDate[0]).format('YYYY-MM-DD'),
          eDate: moment(this.ruleForm.seDate[1]).format('YYYY-MM-DD')
        }
        let measureData1 = [], measureData2 = [], measureData3 = [], measureData4 = [], measureData5 = [],
          measureData6 = []
        let chartData = {
          time: [],
          data: [
            {name: '自律监管', type: 'bar', barWidth: 50, stack: '总数', data: measureData1},
            {name: '调取资料发函', type: 'bar', barWidth: 50, stack: '总数', data: measureData2},
            {name: '联合监管复函', type: 'bar', barWidth: 50, stack: '总数', data: measureData3},
            {name: '联合监管发函', type: 'bar', barWidth: 50, stack: '总数', data: measureData4},
            {name: '线索报告', type: 'bar', barWidth: 50, stack: '总数', data: measureData5},
            {name: '数据协查', type: 'bar', barWidth: 50, stack: '总数', data: measureData6}
          ]
        }
        analysisReportMonth(JSON.stringify(params)).then((resp) => {
          resp.forEach((obj) => {
            chartData.time.push(obj.today)
            measureData1.push(obj.sls)
            measureData2.push(obj.obd)
            measureData3.push(obj.uns_check)
            measureData4.push(obj.uns_send)
            measureData5.push(obj.crp)
            measureData6.push(obj.dig)
          })
          this.loading1 = false
          this.drawLineChart1('barChart1', chartData, '函件按月统计')
        })
      },
      // 按人
      setChartData2 () {
        let letterCode = []
        if (this.ruleForm.type.length === 0) {
          letterCode = ['sls', 'obd', 'uns_check', 'uns_send', 'crp', 'dig']
        } else {
          letterCode = this.ruleForm.type
        }
        let params = {
          letterCode: letterCode,
          sDate: moment(this.ruleForm.seDate[0]).format('YYYY-MM-DD'),
          eDate: moment(this.ruleForm.seDate[1]).format('YYYY-MM-DD')
        }
        let measureData1 = [], measureData2 = [], measureData3 = [], measureData4 = [], measureData5 = [],
          measureData6 = []
        let chartData = {
          time: [],
          data: [
            {name: '自律监管', type: 'bar', barWidth: 10, stack: '总数', data: measureData1},
            {name: '调取资料发函', type: 'bar', barWidth: 10, stack: '总数', data: measureData2},
            {name: '联合监管复函', type: 'bar', barWidth: 10, stack: '总数', data: measureData3},
            {name: '联合监管发函', type: 'bar', barWidth: 10, stack: '总数', data: measureData4},
            {name: '线索报告', type: 'bar', barWidth: 10, stack: '总数', data: measureData5},
            {name: '数据协查', type: 'bar', barWidth: 10, stack: '总数', data: measureData6}
          ]
        }
        let pieChartData = []
        analysisReportPerson(JSON.stringify(params)).then((resp) => {
          resp.DATA = resp.DATA.reverse()
          resp.DATA.forEach((obj) => {
            chartData.time.push(obj.prname)
            measureData1.push(obj.sls)
            measureData2.push(obj.obd)
            measureData3.push(obj.uns_check)
            measureData4.push(obj.uns_send)
            measureData5.push(obj.crp)
            measureData6.push(obj.dig)
          })
          let code = Object.keys(resp.SUMDATA[0])
          for (let i = 0, len = code.length; i < len; i++) {
            switch (code[i]) {
              case 'sumsls':
                pieChartData.push({value: resp.SUMDATA[0].sumsls, name: '自律监管'})
                break
              case 'obdsum':
                pieChartData.push({value: resp.SUMDATA[0].obdsum, name: '调取资料发函'})
                break
              case 'uns_chsum':
                pieChartData.push({value: resp.SUMDATA[0].uns_chsum, name: '联合监管复函'})
                break
              case 'uns_sesum':
                pieChartData.push({value: resp.SUMDATA[0].uns_sesum, name: '联合监管发函'})
                break
              case 'crpsum':
                pieChartData.push({value: resp.SUMDATA[0].crpsum, name: '线索报告'})
                break
              case 'digsum':
                pieChartData.push({value: resp.SUMDATA[0].digsum, name: '数据协查'})
                break
            }
          }
          this.loading2 = false
          this.drawLineChart2('barChart2', chartData, '函件按人统计')
          this.drawPieChart('pieChart', pieChartData, '函件类型总计')
        })
      },
      drawLineChart1 (id, chartData, title) {
        let barChart = echarts.init(document.getElementById(id), this.gfnGetTheme())
        barChart.clear()
        window.onresize = barChart.resize
        barChart.setOption({
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
            width: '70%',
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
            show: true,
            type: 'category',
            data: chartData.time
          },
          yAxis: {
            type: 'value'
          },
          series: chartData.data
        })
      },
      drawLineChart2 (id, chartData, title) {
        let barChart = echarts.init(document.getElementById(id), this.gfnGetTheme())
        barChart.clear()
        window.onresize = barChart.resize
        barChart.setOption({
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
            width: '70%',
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
              show: false,
              lineStyle: {
                color: '#cccccc'
              }
            }
          },
          yAxis: {
            show: true,
            type: 'category',
            data: chartData.time
          },
          series: chartData.data
        })
      },
      drawPieChart (id, pieChartData, title) {
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
      changeType (val) {
        if (val === '函件按月统计') {
          this.showCard1 = true
          this.showCard2 = false
        } else {
          this.showCard1 = false
          this.showCard2 = true
        }
      },
      handlerBlur (val) {
        if (val.value && !moment(val.value).isAfter(this.ruleForm.startDate) && this.ruleForm.startDate) {
          this.ruleForm.endDate = this.ruleForm.startDate
          this.ruleForm.startDate = val.value
        }
      },
      handlerBlur1 (val) {
        if (val.value && !moment(val.value).isBefore(this.ruleForm.endDate) && this.ruleForm.endDate) {
          this.ruleForm.startDate = this.ruleForm.endDate
          this.ruleForm.endDate = val.value
        }
      },
      clearDate () {
        this.ruleForm.startDate = ''
        this.ruleForm.endDate = ''
      },
      getSelectResStock (val, label) {
        this.ruleForm.stockCode = label
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
  .analysisReport {
    .form-inline {
      display: inline-block;
    }
    .selectlazymultiple {
      width: 370px !important;
    }
    .el-radio-group {
      margin-bottom: 10px;
      .el-radio-button {
        margin-right: 10px;
      }
    }
    .el-date-editor {
      .el-range__icon {
        margin-left: 0px;
      }
      .el-range__close-icon {
        margin-right: 5px;
        opacity: 0;
        &:hover {
          opacity: 1;
        }
      }
      .el-date-editor {
        .el-input__inner {
          text-align: center;
          border-width: 0px !important;
          padding: 0px;
        }
      }
    }
  }
</style>