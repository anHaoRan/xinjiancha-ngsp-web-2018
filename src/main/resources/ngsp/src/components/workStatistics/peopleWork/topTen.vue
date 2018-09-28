<template>
  <div class="top-ten">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="140px"
               style="padding-top: 20px">
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
            <el-form-item prop="processType" label="流程类型：" class="form-inline">
              <el-select
                multiple
                collapse-tags
                size="small"
                style="width: 280px;"
                v-model="ruleForm.processType"
                placeholder="全部">
                <el-option
                  v-for="item in processTypeOptions"
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
    <el-card v-show="showCard">
      <div id='barChart' style="height: 590px"
           v-loading="loading"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import moment from 'moment'
  import SDatePicker from '../../base/SDatePicker'
  import {
    peopleWorkTopTen
  } from '../../../service/workStatistics/index'

  export default {
    name: 'top-ten',
    props: [],
    components: {
      SDatePicker
    },
    mixins: [],
    data () {
      let sDate = '', eDate = ''
      sDate = moment().subtract(3, 'months').format('YYYY-MM-DD')
      eDate = moment().format('YYYY-MM-DD')
      return {
        ruleForm: {
          seDate: [sDate, eDate],
          processType: []
        },
        rules: {},
        processTypeOptions: [
          {value: 'ngsp_sls_flow', label: '自律监管'},
          {value: 'ngsp_obd_flow', label: '调取资料'},
          {value: 'ngsp_uns_send_flow', label: '联合监管发函'},
          {value: 'ngsp_uns_check_flow', label: '联合监管复函'},
          {value: 'ngsp_dig_flow', label: '数据协查'},
          {value: 'ngsp_poa_flow', label: '舆情分析'},
          {value: 'ngsp_spw_flow', label: '专项工作'},
          {value: 'ngsp_tc_flow', label: '临时计算'},
          {value: 'ngsp_rfp_flow', label: '权限申请'},
          {value: 'ngsp_dmg_flow', label: '需求管理'},
          {value: 'ngsp_ltb_flow', label: '函件借阅'},
          {value: 'ngsp_ltl_flow', label: '函件传阅'},
          {value: 'ngsp_msc_flow', label: '重点监控证券'},
          {value: 'ngsp_crp_flow', label: '线索报告'},
          {value: 'ngsp_mka_flow', label: '市场分析'},
          {value: 'ngsp_lad_flow', label: '日志审计'},
          {value: 'ngsp_man_analy_flow', label: '操纵分析'}
        ],
        showCard: false,
        loading: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      submitForm () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.showCard = true
            this.loading = true
            let params = {
              process_name: this.ruleForm.processType,
              sDate: moment(this.ruleForm.seDate[0]).format('YYYY-MM-DD'),
              eDate: moment(this.ruleForm.seDate[1]).format('YYYY-MM-DD')
            }
            let measureData1 = [], measureData2 = [], measureData3 = [], measureData4 = [], measureData5 = [],
              measureData6 = [], measureData7 = [], measureData8 = [], measureData9 = [], measureData10 = [],
              measureData11 = [], measureData12 = [], measureData13 = [], measureData14 = [], measureData15 = [],
              measureData16 = [], measureData17 = []
            let chartData = {
              name: [],
              data: [
                {name: '自律监管', type: 'bar', data: measureData1, barWidth: 10, stack: '总数'},
                {name: '调取资料', type: 'bar', data: measureData2, barWidth: 10, stack: '总数'},
                {name: '联合监管发函', type: 'bar', data: measureData3, barWidth: 10, stack: '总数'},
                {name: '联合监管复函', type: 'bar', data: measureData4, barWidth: 10, stack: '总数'},
                {name: '数据协查', type: 'bar', data: measureData5, barWidth: 10, stack: '总数'},
                {name: '舆情分析', type: 'bar', data: measureData6, barWidth: 10, stack: '总数'},
                {name: '专项工作', type: 'bar', data: measureData7, barWidth: 10, stack: '总数'},
                {name: '临时计算', type: 'bar', data: measureData8, barWidth: 10, stack: '总数'},
                {name: '权限申请', type: 'bar', data: measureData9, barWidth: 10, stack: '总数'},
                {name: '需求管理', type: 'bar', data: measureData10, barWidth: 10, stack: '总数'},
                {name: '函件借阅', type: 'bar', data: measureData11, barWidth: 10, stack: '总数'},
                {name: '函件传阅', type: 'bar', data: measureData12, barWidth: 10, stack: '总数'},
                {name: '重点监控证券', type: 'bar', data: measureData13, barWidth: 10, stack: '总数'},
                {name: '线索报告', type: 'bar', data: measureData14, barWidth: 10, stack: '总数'},
                {name: '市场分析', type: 'bar', data: measureData15, barWidth: 10, stack: '总数'},
                {name: '日志审计', type: 'bar', data: measureData16, barWidth: 10, stack: '总数'},
                {name: '操纵分析', type: 'bar', data: measureData17, barWidth: 10, stack: '总数'}
              ]
            }
            peopleWorkTopTen(JSON.stringify(params)).then((resp) => {
              if (resp.length > 0 && Object.keys(resp[0]).length > 0) {
                resp = resp.reverse()
                resp.forEach((obj) => {
                  chartData.name.push(obj.role)
                  measureData1.push(obj.ngsp_sls_flow)
                  measureData2.push(obj.ngsp_obd_flow)
                  measureData3.push(obj.ngsp_uns_send_flow)
                  measureData4.push(obj.ngsp_uns_check_flow)
                  measureData5.push(obj.ngsp_dig_flow)
                  measureData6.push(obj.ngsp_poa_flow)
                  measureData7.push(obj.ngsp_spw_flow)
                  measureData8.push(obj.ngsp_tc_flow)
                  measureData9.push(obj.ngsp_rfp_flow)
                  measureData10.push(obj.ngsp_dmg_flow)
                  measureData11.push(obj.ngsp_ltb_flow)
                  measureData12.push(obj.ngsp_ltl_flow)
                  measureData13.push(obj.ngsp_msc_flow)
                  measureData14.push(obj.ngsp_crp_flow)
                  measureData15.push(obj.ngsp_mka_flow)
                  measureData16.push(obj.ngsp_lad_flow)
                  measureData17.push(obj.ngsp_man_analy_flow)
                })
              }
              this.loading = false
              this.drawLineChart('barChart', chartData)
            })
          }
        })
      },
      drawLineChart (id, chartData) {
        let measureline = echarts.init(document.getElementById(id), this.gfnGetTheme())
        measureline.clear()
        window.onresize = measureline.resize
        measureline.setOption({
          title: {
            text: '工作量人员前十统计'
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
            width: '55%',
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

<style lang="less" scoped>
  .topTen {
    .form-inline {
      display: inline-block;
    }
  }
</style>