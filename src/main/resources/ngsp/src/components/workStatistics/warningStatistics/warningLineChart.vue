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
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="预警类型：">
              <down-more-select v-model='formParams.warnType' ref='downMoreSelect' :optionData='creditTypeOption'
                                :size='size'></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="汇总粒度：">
              <el-select v-model="formParams.gatherSize" placeholder="请选择" size="small">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
      <div id='lineChart' style="height: 350px"></div>
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
          warnType: '',
          gatherSize: ''
        },
        statusOptions: [
          {value: 'ALL', label: '全部'},
          {value: '0', label: '创建中'},
          {value: '1', label: '审批中'},
          {value: '2', label: '确认中'},
          {value: '3', label: '办结'}
        ]
      }
    },
    mounted() {
    },
    methods: {
      getStockCode(stockCodeData) {
        if (stockCodeData) {
          this.formParams.stockCode = stockCodeData.split(' ')[0]
        }
      },
      creatChart() {
        let dataList = {
          data1: ['成交量异常'],
          time: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'],
          data2: [
            {
              name: '成交量异常',
              type: 'line',
              data: [100, 200, 255, 350, 360, 170, 480, 211, 153]
            }
          ]
        }
        this.drawLineChart('lineChart', dataList)
      },
      exportExcel() {
      },
      drawLineChart(id, dataList) {
        let productline = echarts.init(document.getElementById(id), this.gfnGetTheme());
        productline.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            inactiveColor: '#455579',
            top: 10,
            data: dataList.data1,
            textStyle: {
              color: '#506798'
            }
          },
          toolbox: {
            right: '5%',
            itemSize: 18,
            feature: {
              saveAsImage: {
                name: '预警走势图'
              }
            }
          },
          xAxis: [
            {
              name:'日期',
              type: 'category',
              data: dataList.time,
              axisLabel: {
                color: '#506798'
              },
              axisTick:{
                show:true,
                lineStyle: {
                  color: '#263657'
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#263657',
                  type: 'solid'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            }
          ],
          yAxis: [
            {
              name:'数量',
              type: 'value',
              boundaryGap: false,
              axisLabel: {
                color: '#506798'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#273757'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#334164'
                }
              }
            }
          ],
          series: dataList.data2
        })
      }
    }
  }
</script>

<style lang="less">
  .warningLineChart {
  }
</style>
