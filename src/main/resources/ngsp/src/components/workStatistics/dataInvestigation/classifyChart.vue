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
            <el-form-item prop="type" label="分类指标：" class="form-inline">
              <el-select v-model="ruleForm.type" @change="changeType" size="small">
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
            <el-form-item prop="measure" label="具体指标：" class="form-inline">
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
      <div id='barChart' style="height: 530px"
           v-loading="loading"
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
  import { dataInvestigationClassify, dataInvestigationClassifyPeople } from '../../../service/workStatistics/index'

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
      const invesType = [
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
      ]
      const letterType = [
        {value: '本所', label: '本所'},
        {value: '证监会', label: '证监会'},
        {value: '地方证监局', label: '地方证监局'},
        {value: '公检法', label: '公检法'},
        {value: '其他单位', label: '其他单位'},
        {value: '中金所', label: '中金所'}
      ]
      return {
        ruleForm: {
          stockCode: [],
          seDate: [sDate, eDate],
          type: 'c',
          measure: []
        },
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
        typeOptions: [
          {value: 'c', label: '协查类型'},
          {value: 'b', label: '来函单位'},
          {value: 'a', label: '完成人员'}
        ],
        measureOptions: invesType,
        invesType: invesType,
        letterType: letterType,
        peopleType: [],
        showCard: false,
        loading: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      submitForm () {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.showCard = true
            this.loading = true
            // 参数
            let title = ''
            let params = {
              securityId: this.ruleForm.stockCode,
              mark: this.ruleForm.type,
              startDate: moment(this.ruleForm.seDate[0]).format('YYYY-MM-DD'),
              endDate: moment(this.ruleForm.seDate[1]).format('YYYY-MM-DD')
            }
            switch (this.ruleForm.type) {
              case 'a':
                params.drafterCode = this.ruleForm.measure
                title = '完成人员'
                break
              case 'b':
                params.deptCode = this.ruleForm.measure
                title = '来函单位'
                break
              case 'c':
                params.digCode = this.ruleForm.measure
                title = '协查类型'
                break
            }
            // chart data
            let chartData = {name: [], data: []}
            dataInvestigationClassify(JSON.stringify(params)).then((resp) => {
              if (resp.length > 0 && Object.keys(resp[0]).length > 0) {
                if (this.ruleForm.type === 'c') {
                  let name = Object.keys(resp[0])
                  chartData.name = this.exchangeWords(name)
                  for (let i in resp[0]) {
                    chartData.data.push(resp[0][i])
                  }
                } else {
                  resp.forEach((obj) => {
                    chartData.name.push(obj.type)
                    chartData.data.push(obj.amount)
                  })
                }
                this.loading = false
                this.drawLineChart('barChart', chartData, title)
              }
            })
          }
        })
      },
      exchangeWords (data) {
        let newData = []
        data.forEach((item) => {
          this.invesType.forEach((obj) => {
            if (item === obj.value) {
              newData.push(obj.label)
            }
          })
        })
        return newData
      },
      drawLineChart (id, chartData, title) {
        let barChart = echarts.init(document.getElementById(id), this.gfnGetTheme())
        barChart.setOption({
          title: {
            text: title
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
      },
      changeType (val) {
        this.ruleForm.measure = []
        switch (val) {
          case 'a':
            this.measureOptions = this.peopleType
            break
          case 'b':
            this.measureOptions = this.letterType
            break
          case 'c':
            this.measureOptions = this.invesType
            break
        }
      },
      getSelectResStock (val, label) {
        this.ruleForm.stockCode = label
      }
    },
    created () {
    },
    mounted () {
      dataInvestigationClassifyPeople().then((resp) => {
        let people = []
        resp.DRAFTER.forEach((item) => {
          people.push({value: item, label: item})
        })
        this.peopleType = people
      })
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  .dataInvestigation {
    .form-inline {
      display: inline-block;
    }
    .selectlazymultiple {
      width: 240px !important;
    }
  }
</style>