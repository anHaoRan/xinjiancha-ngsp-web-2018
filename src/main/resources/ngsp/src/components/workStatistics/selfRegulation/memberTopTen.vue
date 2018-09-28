<template>
  <div class="trend">
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
            <el-form-item class="form-inline">
              <el-button type="primary" @click="submitForm">生成图表</el-button>
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
  import SDatePicker from '../../base/SDatePicker'
  import echarts from 'echarts'

  export default {
    name: 'member-top-ten',
    props: [],
    components: {
      SDatePicker
    },
    mixins: [],
    data () {
      return {
        type: ['会员1', '会员2', '会员3', '会员4', '会员5', '会员6', '会员7', '会员8', '会员9', '会员10'],
        ruleForm: {
          seDate: []
        },
        rules: {},
      }
    },
    computed: {},
    watch: {},
    methods: {
      getStockCode(stockCodeData, type, code, stockSubType) {
        this.ruleForm.stockCode = stockCodeData.split(' ')[0]
      },
      submitForm () {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            let data1 = [9, 7, 6, 5, 4, 3, 3, 2, 1, 1]
            let data2 = [15, 15, 14, 14, 12, 11, 10, 8, 5, 2]
            this.drawLineChart('barChart', data1, data2)
          }
        })
      },
      drawLineChart(id, data1, data2) {
        let measureline = echarts.init(document.getElementById(id), this.gfnGetTheme())
        measureline.clear()
        window.onresize = measureline.resize
        measureline.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            inactiveColor: '#455579',
            top: 10,
            data: ['未回函数量', '要求回函数量'],
            textStyle: {
              color: '#506798'
            }
          },
          grid: {
            left: '3%',
            right: '5%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
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
            data: this.type
          },
          series: [
            {
              name: '未回函数量',
              type: 'bar',
              barGap: '40%',
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              },
              itemStyle: {
                normal: {
                  color: '#af0415'
                }
              },
              data: data1
            },
            {
              name: '要求回函数量',
              type: 'bar',
              barGap: '40%',
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              },
              itemStyle: {
                normal: {
                  color: '#3f5efd'
                }
              },
              data: data2
            }
          ]
        })
      },
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
  .trend{
    .form-inline{
      display: inline-block;
    }
  }
</style>