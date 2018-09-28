<!--
持股曲线
-->
<template>
  <div v-loading='loading'
       element-loading-spinner='el-icon-loading'
       element-loading-text='数据加载中，请耐心等待...'
       element-loading-background='rgba(0,0,0,0.2)'>
    <div id='dimensionChart' style='height:400px'></div>
  </div>
</template>

<script>
  import {
    getStockCurveData, // 持股曲线
    getHoldMarketValueCurveData // 持仓市值曲线
  } from '@/service/analysisTool/complexQuery/index'
  import moment from 'moment'

  let echarts = require('echarts')
  export default {
    components: {},
    data () {
      return {
        loading: false,
        queryData: {
          startDate: '',
          endDate: ''
        },
        echart: '',
        getSplitData: { // 切割初始化数据
          categoryData: [],
          values: []
        },
        getSplitDetail: { // 获得具体的数据
          volume: [],
          price: []
        },
        count: 0
      }
    },
    props: {
      num: {
        type: Number
      },
      drillingParams: {},
      dialogChartVisible: {},
      detailDialog: {}
    },
    mounted () {
      let myLine = document.getElementById('dimensionChart')
      this.echart = echarts.init(myLine, this.gfnGetTheme())
      this.queryData = this.drillingParams
      // 初始化查询
      this.getAjaxData(this.queryData)
    },
    watch: {
      drillingParams: {
        handler () {
          if (!this.detailDialog && this.dialogChartVisible) {
            this.loading = true
            this.queryDatas = this.drillingParams
            this.getAjaxData(this.queryData)
          }
        },
        deep: true
      }
    },
    methods: {
      splitData (data) {
        let categoryData = [], values = []
        data.map((item) => {
          categoryData.push(moment(item.splice(0, 1)[0]).format('YYYY-MM-DD'))
          values.push(item)
        })
        this.getSplitData = {
          categoryData: categoryData,
          values: values
        }
        this.getDetailYData(values)
      },
      getDetailYData (values) {
        values.map((item) => {
          this.getSplitDetail.volume.push(item[0]) // 持股量 A股市值
          this.getSplitDetail.price.push(item[1]) // 价格 该股市值
        })
      },
      getAjaxData (option) {
        let context = JSON.parse(JSON.stringify(option))
        delete context.ASH
        delete context.chartsType
        delete context.markTableRender

        if (this.drillingParams.chartsType == 'holdingStock') { // 持股曲线
          getStockCurveData(context).then((resp) => {
            this.loading = false
            if (resp && resp.data) {
              this.splitData(resp.data)
              this.drawDimensionChart(this.echart)
            }
          })
        } else {
          getHoldMarketValueCurveData(context).then((resp) => {
            this.loading = false
            if (resp && resp.data) {
              this.splitData(resp.data)
              this.drawDimensionChart(this.echart)
            }
          })
        }
        // let data = [['2018-09-01', 2,3],['2018-09-02', 4,3],['2018-09-03', 5,3],['2018-09-04', 8,3],['2018-09-05', 5,3]]
        // this.splitData(data)
        // this.drawDimensionChart(this.echart)
      },
      drawDimensionChart (echart) {
        echart.clear()
        window.onresize = echart.resize
        let param = {
          // 是否开启动画 animation:false,
          backgroundColor: '#0f2045',
          color: ['blue', 'red'],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            inactiveColor: '#455579',
            // orient: 'vertical',
            // right: '1%',
            top: '10%',
            data: ['A股市值', '该股市值'],
            textStyle: {
              color: '#506798'
            }
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '5%',
            top: '30%',
            containLabel: true,
            position: ['50%', '50%']
          },
          toolbox: {
            x: '93%',
            y: 'top',
            itemSize: 20,
            feature: {
              // saveAsImage: {}
            }
          },
          dataZoom: [
            {
              type: 'inside',
              start: 50,
              end: 100,
              left: 'center',
              top: 'top',
              right: 'auto',
              bottom: 'auto'
            },
            {
              show: true,
              type: 'slider',
              borderColor: 'red',
              start: 50,
              end: 100,
              left: 'center',
              top: 'top',
              right: 'auto',
              bottom: 'auto'
            }
          ],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: false},
            splitLine: {show: false},
            scale: true,
            data: this.getSplitData.categoryData
          },
          yAxis: [
            {
              name: 'A股市值',
              type: 'value',
              scale: true,
              min: 'dataMin',
              max: 'dataMax'
            },
            {
              name: '该股市值',
              type: 'value',
              scale: true,
              min: 'dataMin',
              max: 'dataMax'
            }
          ],
          series: [
            {
              name: 'A股市值',
              type: 'line',
              data: this.getSplitDetail.volume
            },
            {
              name: '该股市值',
              type: 'line',
              yAxisIndex: 1,
              data: this.getSplitDetail.price
            }
          ]
        }
        if (this.drillingParams.chartsType == 'holdingStock') {
          param.toolbox.feature.saveAsImage = {type: 'jpeg'}
          param.legend.data = ['持股量', '收盘价']
          param.yAxis[0].name = '持股量'
          param.yAxis[1].name = '收盘价'
          param.series[0].name = '持股量'
          param.series[1].name = '收盘价'
        } else {
          delete param.toolbox.feature.saveAsImage
        }
        echart.setOption(param, true)
      }
    }
  }
</script>

<style lang='less'>

</style>
