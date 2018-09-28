<template>
  <el-card>
    <div slot="header">图表</div>
    <el-row>
      <el-col :span="12" v-for="(item, index) in chartComponentList" :key="index">
        <chart-component :defaultOption="item.option" :domId="item.domId" :propsData="chartData[index]" :loading="item.loading"></chart-component>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
  import ChartComponent from './component/ChartComponent'
  import {pieDefaultOption, barDefaultOption, lineDefaultOption1, lineDefaultOption2} from './component/chartOptions'
  import {getChart1, getChart2, getChart3, getChart4} from '@/service/superviseTask'
  import {getRelativeTradeDate} from '@/service/common/commonFunc'
  export default {
    components: {ChartComponent},
    data() {
      return {
        pieDefaultOption,
        barDefaultOption,
        lineDefaultOption1,
        chartData: [],
        getChartFunMap: [getChart1, getChart2, getChart3, getChart4],
        chartComponentList: [{
          option: pieDefaultOption,
          domId: 'selfPieChart',
          loading: false
        }, {
          option: barDefaultOption,
          domId: 'selfBarChart',
          loading: false
        }, {
          option: lineDefaultOption1,
          domId: 'selfLineChart1',
          loading: false
        }, {
          option: lineDefaultOption2,
          domId: 'selfLineChart2',
          loading: false
        }]
      }
    },
    methods: {
      getChartData() {
        this.getChartFunMap.forEach((fun, i) => {
          this.chartComponentList[i]['loading'] = true
          if (i === 3) {
            getRelativeTradeDate(-9).then(relativeTradeDate => {
              fun(relativeTradeDate).then(res => {
                this.chartComponentList[i]['loading'] = false
                let chartData = JSON.parse(JSON.stringify(this.chartData))
                let targetData = res.alarmData.metaData
                lineDefaultOption2.xAxis.data = targetData.map(v => {
                  return v.alarm_date
                })
                chartData[i] = targetData.map(v => {
                  return v.alarm_count
                })
                this.chartData = chartData
              })
            })
          } else {
            fun().then(res => {
              this.chartComponentList[i]['loading'] = false
              let chartData = JSON.parse(JSON.stringify(this.chartData))
              switch (i) {
                case 0:
                  pieDefaultOption.legend.data = res.map(v => {
                    return v.name
                  })
                  chartData[i] = res
                  break
                case 1:
                  barDefaultOption.xAxis.data = res.map(v => {
                    return v.date
                  })
                  chartData[i] = res.map(v => {
                    return v.count
                  })
                  break
                case 2:
                  lineDefaultOption1.xAxis.data = res.map(v => {
                    return v.date
                  })
                  chartData[i] = res.map(v => {
                    return v.count
                  })
                  break
              }
              this.chartData = chartData
            })
          }
        })
      }
    }
  }
</script>