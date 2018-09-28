<template>
  <div class="detailHolding">
    <el-card class="el-card-table">
      <div slot="header" class="clearfix">
        成交及持股情况
      </div>
      <el-row>
        <el-form :inline="true" :model="selectParams" style="padding-left: 20px">
          <el-form-item label="证券">
            <div @click="stockSelect" style="display: inline-block;">
              <el-input type="text" readonly="true" placeholder="请选择" :value="selectParams.securityCode + selectParams.securityName" size="mini">
                {{selectParams.securityCode + selectParams.securityName}}
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="分类投资者">
            <down-more-select @input="selectInvestor" :optionData='investorOptions' size='small' :clearFlag='clearFlag'></down-more-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getData" :loading="isLoading" type="primary" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <select-code-box
        @refreshIsShow="refreshIsShowBox"
        @refreshAddItems="refreshAddItemList"
        class="addItemBox"
        v-show="stockShow"
        @getCode="getCode"
        style="position: absolute;top: 40px;z-index: 10">
      </select-code-box>
      <div id="lineChart" style="width: 806px;height: 350px"></div>
    </el-card>
  </div>

</template>

<script>
  import echarts from 'echarts'
  import SelectCodeBox from '../../../common/selectCodeBox'
  import DownMoreSelect from '../../../common/downMoreSelect'
  import { getInvestorTypeData } from '../../../../service/marketSupervise/investorDealCount/index'
  import { postDetailHoldingData } from '../../../../service/marketSupervise/classifiedInvestorMonitoring/index'
  import ElButton from 'element-ui/packages/button/src/button'

  export default {
    name: 'detail-holding',
    components: {
      ElButton,
      SelectCodeBox,
      DownMoreSelect
    },
    data () {
      return {
        isLoading: false,
        stockShow: false, // 证券选择框
        selectParams: {
          securityCode: '000001', // 证券选择框
          securityName: ' 上证指数' // 证券选择框显示内容
        },
        investorClasses: '', // 分类投资者传递后台参数
        investorOptions: [],
        clearFlag: 1
      }
    },
    mounted () {
      // 获取投资者类型
      getInvestorTypeData('investorType', 'all').then(resp => {
        resp.forEach((el) => {
          this.investorOptions.push({value: el.value, label: el.text})
        })
      })
      this.getData()
    },
    methods: {
      stockSelect () {
        this.stockShow = true
      },
      refreshIsShowBox (state) {
        this.isMore = state
      },
      refreshAddItemList (list, obj) {
        this.isMore = false
        this.addList = list
        this.addCodeName = obj
      },
      getCode (code, name) {
        this.selectParams.securityName = name
        this.selectParams.securityCode = code + ' '
        this.stockShow = false
      },
      // 接收子组件返回的分类投资者
      selectInvestor (result) {
        this.investorClasses = result.join(',')
      },
      getData () {
        this.isLoading = true
        let params = {secCode: this.selectParams.securityCode, invstClasses: this.investorClasses}
        postDetailHoldingData(params).then((resp) => {
          let xAxis = []
          let positionVal = [] // 年末市值
          let tradeAmt = [] // 年成交金额
          let pRate = [] // 持股占比
          let tRate = [] // 成交占比
          resp.barGraph.forEach((el) => {
            xAxis.push(el.year)
            positionVal.push((el.position_val / 100000000).toFixed(3))
            tradeAmt.push((el.trade_amt / 100000000).toFixed(3))
          })
          resp.lineChart.forEach((el) => {
            pRate.push(el.p_rate)
            tRate.push(el.t_rate)
          })
          let series = [
            {
              name: '年末市值',
              type: 'bar',
              data: positionVal,
              barGap: 0,
              yAxisIndex: 0
            },
            {
              name: '年成交金额',
              type: 'bar',
              barGap: 0,
              data: tradeAmt,
              yAxisIndex: 0
            },
            {
              name: '持股占比',
              type: 'line',
              data: pRate,
              yAxisIndex: 1
            },
            {
              name: '成交占比',
              type: 'line',
              data: tRate,
              yAxisIndex: 1
            }
          ]
          let data = {xAxis, series}
          this.drawBarChart('lineChart', data)
          this.isLoading = false
        })
      },
      drawBarChart (id, data) {
        let myLine = document.getElementById(id)
        let echart = echarts.init(myLine, this.gfnGetTheme())
        echart.clear()
        window.onresize = echart.resize
        echart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              let texts = params[0].name + '<br/>'
              params.forEach((el) => {
                if (el.seriesType === 'bar') {
                  texts += el.marker + el.seriesName + ':' + Math.abs(el.value).toFixed(3) + '亿元<br/>'
                } else {
                  texts += el.marker + el.seriesName + ':' + Math.abs(el.value) + '<br/>'
                }
              })
              return texts
            }
          },
          color: ['#ff402b', '#2a7efb', '#ff7836', '#ffd21e'],
          grid: {
            left: '2%',
            right: '2%',
            bottom: '5%',
            containLabel: true
          },
          toolbox: {
            right: '5%',
            top: -10,
            itemSize: 18,
            feature: {
              saveAsImage: {}
            },
            showTitle: false
          },
          legend: {
            data: ['年末市值', '年成交金额', '成交占比', '持股占比']
          },
          xAxis: {
            axisLabel: {
              color: '#506798'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#273757'
              }
            },
            type: 'category',
            boundaryGap: 'false',
            data: data.xAxis
          },
          yAxis: [
            {
              name: '金额(亿元)',
              nameTextStyle: {
                color: '#506798'
              },
              show: true,
              type: 'value',
              position: 'left',
              axisLabel: {
                color: '#506798'
              },
              axisLine: {
                lineStyle: {
                  color: '#273757'
                }
              }
            },
            {
              name: '占比',
              nameTextStyle: {
                color: '#506798'
              },
              type: 'value',
              scale: true,
              position: 'right',
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
          series: data.series
        }, true)
      }
    }
  }
</script>

<style lang="less">
  .detailHolding {
    .el-card__body {
      position: relative;
    }
  }

  .el-card-table {
    /deep/ .el-checkbox-group {
      line-height: 30px;
    }
  }
</style>
