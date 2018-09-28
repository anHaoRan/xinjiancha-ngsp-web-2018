<template>
  <div class="trend">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="140px"
               style="padding-top: 20px">
        <el-row>
          <el-radio-group v-model="activeType" @change="changeType">
            <el-radio-button label="发函按月度统计"></el-radio-button>
            <el-radio-button label="会员维度发函统计"></el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="stockCode" label="证券代码及简称：" class="form-inline">
              <select-lazy-multiple :selectParams="selectParamsStock" @getSelectRes="getSelectResStock"
                                    style="display: inline-block;" ref="selectLazyMultiple"></select-lazy-multiple>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="activeType === '发函按月度统计'">
            <el-form-item prop="type" label="会员代码及名称：" class="form-inline">
              <select-lazy-multiple :selectParams="selectParamsMember" @getSelectRes="getSelectResMember"
                                    style="display: inline-block;" ref="selectLazyMultiple1"></select-lazy-multiple>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发函起止日期：" required class="form-inline">
              <div class="monthRange">
                <div class="el-date-editor el-range-editor el-input__inner el-date-editor--timerange"
                     style="height: 32px;">
                  <i class="el-input__icon el-range__icon el-icon-date" style="margin-top: -8px;"></i>
                  <el-date-picker
                    v-model="ruleForm.startDate"
                    type="month"
                    prefix-icon="aaa"
                    :clearable="false"
                    placeholder="起始月"
                    :picker-options="range1"
                    format="yyyy-MM"
                    value-format="yyyy-MM"
                    @blur="handlerBlur1"
                    size="small"></el-date-picker>
                  <span class="el-range-separator" style="margin-top: -8px;">至</span>
                  <el-date-picker
                    v-model="ruleForm.endDate"
                    type="month"
                    prefix-icon="aaa"
                    :clearable="false"
                    placeholder="结束月"
                    :picker-options="range2"
                    format="yyyy-MM"
                    value-format="yyyy-MM"
                    @blur="handlerBlur"
                    size="small"></el-date-picker>
                  <i class="el-input__icon el-range__close-icon el-icon-circle-close" style="margin-top: -8px;"
                     @click="clearDate"></i>
                </div>
              </div>
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
        <div id='barChart1' style="height: 490px"
             v-loading="loading1"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)"></div>
      </el-row>
    </el-card>
    <el-card v-show="showCard2">
      <el-row>
        <div id='barChart2' style="height: 490px"
             v-loading="loading2"
             element-loading-text="数据加载中，请耐心等待..."
             element-loading-background="rgba(0,0,0,0.3)"></div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import SelectLazyMultiple from '@/components/common/SelectLazyMultiple'
  import echarts from 'echarts'
  import moment from 'moment'
  import {
    selfRegulationLettersMonths,
    selfRegulationLettersMember
  } from '../../../service/workStatistics/index'

  export default {
    name: 'letters',
    props: [],
    components: {
      SelectLazyMultiple
    },
    mixins: [],
    data () {
      let sDate = '', eDate = ''
      sDate = moment().subtract(3, 'months').format('YYYY-MM')
      eDate = moment().format('YYYY-MM')
      let validateSeDate = (rule, value, callback) => {
        if (!this.ruleForm.startDate || !this.ruleForm.endDate) {
          callback(new Error('请输入发函起止日期'))
        }
        callback()
      }
      return {
        activeType: '发函按月度统计',
        ruleForm: {
          stockCode: [],
          member: [],
          startDate: sDate,
          endDate: eDate
        },
        memberCode: [],
        rules: {
          startDate: [
            {validator: validateSeDate}
          ],
          endDate: [
            {validator: validateSeDate}
          ]
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
        showCard1: false,
        showCard2: false,
        loading1: false,
        loading2: false,
        isQueryFlag: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      submitForm () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (!this.ruleForm.startDate || !this.ruleForm.endDate) {
              this.$message.error('请输入发函起止日期')
              return
            }
            if (this.activeType === '发函按月度统计') {
              // 按月度
              this.showCard1 = true
              this.setChartData('barChart1', selfRegulationLettersMonths, '发函按月度统计')
            } else {
              // 按会员
              this.showCard2 = true
              this.setChartData('barChart2', selfRegulationLettersMember, '会员维度发函统计')
            }
          }
        })
      },
      setChartData (id, requestFunc, title) {
        this.memberCode.forEach((item) => {
          this.ruleForm.member.push(item.split(' ')[1])
        })
        let params = {
          securityId: this.ruleForm.stockCode,
          member: this.activeType === '发函按月度统计' ? this.ruleForm.member : '',
          sDate: this.ruleForm.startDate,
          eDate: this.ruleForm.endDate
        }
        // let name = [], measureData1 = [], measureData2 = [], measureData3 = [], measureData4 = [],
        //   measureData5 = [], measureData6 = [], measureData7 = [], measureData8 = [], measureData9 = [],
        //   measureData10 = [], measureData11 = [], measureData12 = []
        // let chartData = {
        //   time: name,
        //   data: [
        //     {name: '纪律处分意向书', type: 'bar', barWidth: 10, stack: '总数', data: measureData9},
        //     {name: '纪律处分建议书', type: 'bar', barWidth: 10, stack: '总数', data: measureData10},
        //     {name: '纪律处分意见书', type: 'bar', barWidth: 10, stack: '总数', data: measureData11},
        //     {name: '纪律处分决定书', type: 'bar', barWidth: 10, stack: '总数', data: measureData12},
        //     {name: '市场监察协查函—0101', type: 'bar', barWidth: 10, stack: '总数', data: measureData1},
        //     {name: '市场监察问询函—0102', type: 'bar', barWidth: 10, stack: '总数', data: measureData2},
        //     {name: '市场监察关注函—0103', type: 'bar', barWidth: 10, stack: '总数', data: measureData3},
        //     {name: '市场监察提示函—0104', type: 'bar', barWidth: 10, stack: '总数', data: measureData4},
        //     {name: '市场监察警示函—0105', type: 'bar', barWidth: 10, stack: '总数', data: measureData5},
        //     {name: '市场监察告知函—0106', type: 'bar', barWidth: 10, stack: '总数', data: measureData6},
        //     {name: '市场监察暂停交易函—0107', type: 'bar', barWidth: 10, stack: '总数', data: measureData7},
        //     {name: '市场监察约见谈话函—0108', type: 'bar', barWidth: 14, stack: '总数', data: measureData8}
        //   ]
        // }
        if (id === 'barChart1') {
          this.loading1 = true
        }
        if (id === 'barChart2') {
          this.loading2 = true
        }
        let chartData = {time: [], data: []}
        requestFunc(JSON.stringify(params)).then((resp) => {
          if (resp.length > 0 && Object.keys(resp[0]).length > 0) {
            resp = resp.reverse()
            // resp.forEach((obj) => {
            //   chartData.time.push(obj.ym)
            //   measureData1.push(obj.xc)
            //   measureData2.push(obj.wx)
            //   measureData3.push(obj.gz03)
            //   measureData4.push(obj.ts)
            //   measureData5.push(obj.js)
            //   measureData6.push(obj.gz06)
            //   measureData7.push(obj.ztjy)
            //   measureData8.push(obj.yjth)
            //   measureData9.push(obj.jlyx)
            //   measureData10.push(obj.jljy)
            //   measureData11.push(obj.jlyj)
            //   measureData12.push(obj.jljd)
            // })
            let nameArr = []
            for (let i = 0, len = resp.length; i < len; i++) {
              chartData.time.push(resp[i].ym)
              if (i === 0) {
                for (let item in resp[0]) {
                  if (item !== 'ym') {
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
              chartData.data.push(tempObj)
            }
          }
          this.isQueryFlag = true
          if (id === 'barChart1') {
            this.showCard1 = true
            this.loading1 = false
          }
          if (id === 'barChart2') {
            this.showCard2 = true
            this.loading2 = false
          }
          this.drawLineChart(id, chartData, title)
        })
      },
      exchangeWords (val) {
        let newVal = ''
        switch (val) {
          case 'xc':
            newVal = '市场监察协查函—0101'
            break
          case 'wx':
            newVal = '市场监察问询函—0102'
            break
          case 'gz03':
            newVal = '市场监察关注函—0103'
            break
          case 'ts':
            newVal = '市场监察提示函—0104'
            break
          case 'js':
            newVal = '市场监察警示函—0105'
            break
          case 'gz06':
            newVal = '市场监察告知函—0106'
            break
          case 'ztjy':
            newVal = '市场监察暂停交易函—0107'
            break
          case 'yjth':
            newVal = '市场监察约见谈话函—0108'
            break
          case 'jlyx':
            newVal = '纪律处分意向书'
            break
          case 'jlyj':
            newVal = '纪律处分建议书'
            break
          case 'jljy':
            newVal = '纪律处分意见书'
            break
          case 'jljd':
            newVal = '纪律处分决定书'
            break
        }
        return newVal
      },
      drawLineChart (id, chartData, title) {
        let measureline = echarts.init(document.getElementById(id), this.gfnGetTheme())
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
      changeType (val) {
        if (this.isQueryFlag) {
          if (val === '发函按月度统计') {
            this.showCard1 = true
            this.showCard2 = false
          } else {
            this.showCard1 = false
            this.showCard2 = true
          }
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
      },
      getSelectResMember (val, label) {
        this.memberCode = label
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
  .trend {
    .form-inline {
      display: inline-block;
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