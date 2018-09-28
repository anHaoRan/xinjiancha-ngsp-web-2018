<template>
  <div class="warningLineChart">
    <el-card class="formCard">
      <el-form :inline="true" :model="formParams" ref="formParams">
        <el-row :gutter="20">
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="证券代码及简称">
              <stock-code-query :commonData="submitData" :clearable='false'
                                @getStockCode="getStockCode"></stock-code-query>
            </el-form-item>
          </el-col>
          <el-col :xl='6' :lg='8' :md='12' :sm='24'>
            <el-form-item label='开始日期：'>
              <el-date-picker
                v-model='formParams.startDate'
                type='date'
                size='small'
                value-format='yyyy-MM-dd'
                placeholder='开始日期'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl='6' :lg='8' :md='12' :sm='24'>
            <el-form-item label='结束日期：'>
              <el-date-picker
                v-model='formParams.endDate'
                type='date'
                size='small'
                :picker-options='endpickerOption'
                value-format='yyyy-MM-dd'
                placeholder='结束日期'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :md="12" :sm="24">
            <el-form-item>
              <el-button type="primary" size="small" @click="creatChart">生成图表</el-button>
              <el-button type="info" size="small" @click="exportExcel">导出Excel</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div id='barChart' style="height: 350px"></div>
    </el-card>
  </div>
</template>

<script>
  import StockCodeQuery from '../../common/StockCodeQuery';
  import DownMoreSelect from '../../common/downMoreSelect'
  import moment from 'moment'
  import echarts from 'echarts'

  export default {
    components: {
      StockCodeQuery,
      DownMoreSelect
    },
    data() {
      return {
        creditTypeOption: [], // 传递给子组件的账户类型数据
        size: 'small',
        submitData: {disabled: false, stockCode: ''},
        formParams: {
          stockCode: '',
          warnType:'',
          gatherSize:'',
          startDate:'',
          endDate:''
        },
        statusOptions: [
          {value: 'ALL', label: '全部'},
          {value: '0', label: '创建中'},
          {value: '1', label: '审批中'},
          {value: '2', label: '确认中'},
          {value: '3', label: '办结'}
        ],
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < new Date(this.formParams.startDate).getTime() - 3600 * 1000 * 24
          }
        }
      }
    },
    mounted() {
    },
    methods:{
      getStockCode(stockCodeData) {
        if (stockCodeData) {
          this.formParams.stockCode = stockCodeData.split(' ')[0]
        }
      },
      creatChart() {
        // let data = {xAxis, seriesData: pfData}
        let dataList = {
          data1: ['成交量异常'],
          time: ['持有量异常变动', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'],
          data2: [
            {
              name: '成交量异常',
              type: 'bar',
              data: [100, 200, 255, 350, 360, 170, 480, 211, 153]
            }
          ]
        }
        this.drawBarChart('barChart', dataList)
      },
      exportExcel() {},
      drawBarChart(id, dataList) {
        let myLine = document.getElementById(id)
        let echart = echarts.init(myLine, this.gfnGetTheme())
        echart.clear()
        window.onresize = echart.resize
        echart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: '5%',
            containLabel: true
          },
          toolbox: {
            right: '5%',
            itemSize: 18,
            feature: {
              saveAsImage: {
                name: '预警分类柱图'
              }
            }
          },
          legend: {
            inactiveColor: '#455579',
            top: 10,
            data: dataList.data1,
            textStyle: {
              color: '#506798'
            }
          },
          xAxis: {
            axisLabel: {
              color: '#506798',
              formatter:function (val) {
                return val.split('').join('\n')
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#273757'
              }
            },
            type: 'category',
            boundaryGap: 'false',
            data: dataList.time
          },
          yAxis: [
            {
              show: true,
              type: 'value',
              position: 'left',
              splitNumber: 4,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#273757'
                }
              },
              axisLabel: {
                color: '#506798'
              },
              axisLine: {
                lineStyle: {
                  color: '#273757'
                }
              }
            }
          ],
          series: dataList.data2
        }, true)
      }
    }
  }
</script>

<style lang="less">
  .warningLineChart{
  }
</style>
