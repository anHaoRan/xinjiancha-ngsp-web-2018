<template>
  <el-card>
    <div slot="header">图表</div>
    <el-row>
      <el-col :span="8" v-for="(item, index) in chartComponentList" :key="index">
        <chart-component v-if="item.show" :defaultOption="item.option" :domId="item.domId" :propsData="chartData[index]" :loading="item.loading"></chart-component>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
  import ChartComponent from './component/ChartComponent'
  import { pieDefaultOption1, pieDefaultOption2, pieDefaultOption3} from './component/chartOptions'
  import {getAccountChartInfo, getSecurityChartInfo} from '@/service/analysisTool/specificTool'
  export default {
    components: {ChartComponent},
    props: {
      propsParams: {
        type: Object,
        default() {
          return {}
        }
      },
      isShowOneChart: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pieDefaultOption1,
        pieDefaultOption2,
        pieDefaultOption3,
        chartData: [],
        chartComponentList: [{
          option: pieDefaultOption1,
          domId: 'selfPieChart1',
          loading: false,
          show: false, // this.isShowOneChart
        }, {
          option: pieDefaultOption2,
          domId: 'selfPieChart2',
          loading: false,
          show: true
        }, {
          option: pieDefaultOption3,
          domId: 'selfBarChart3',
          loading: false,
          show: true
        }],
        getChartFunMap: [getAccountChartInfo, getSecurityChartInfo]
      }
    },
    methods: {
      getChartData() {
        let params = this.propsParams
        params.startDate = params.selectDateRange[0] ? params.selectDateRange[0].replace(/-/g, '') : ''
        params.endDate = params.selectDateRange[1] ? params.selectDateRange[1].replace(/-/g, '') : ''
        let funArray = [
          {
            ...{pieType: ''}, // 涨跌平饼图暂时不做
            ...params
          },
          {
            ...{pieType: 'reason'},
            ...params
          },
          {
            ...{pieType: 'leavel'},
            ...params
          }
        ]
        funArray.forEach((v, i) => {
          if(i > 0) { // 涨跌平饼图暂时不做
            let chartData = JSON.parse(JSON.stringify(this.chartData))
            this.chartComponentList[i]['loading'] = true
            this.getChartFunMap[this.isShowOneChart ? 1 : 0](v).then(res => {
              this.chartComponentList[i]['loading'] = false
              // res = {
              //   data: [{name:'基金', value: 11}, {name:'股票', value: 14}],
              //   total: 25
              // }
              const {data, total} = res
              switch (i) {
                case 0:
                  /* pieDefaultOption1.legend.data = data.map(v => {
                   return v.name
                   })
                   chartData[i] = data */
                  break
                case 1:
                  pieDefaultOption2.legend.data = data.map(v => {
                    return v.name
                  })
                  chartData[i] = data
                  pieDefaultOption2.series.label.normal.formatter = function () {
                    return total
                  }
                  break
                case 2:
                  pieDefaultOption3.legend.data = data.map(v => {
                    return v.name
                  })
                  chartData[i] = data
                  pieDefaultOption3.series.label.normal.formatter = function () {
                    return total
                  }
                  break
              }
              this.chartData = JSON.parse(JSON.stringify(chartData))
            })
          }
        })
      }
    }
  }
</script>