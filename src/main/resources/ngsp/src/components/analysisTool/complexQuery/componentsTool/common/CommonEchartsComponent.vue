<!--图表公共组件-->
<template>
  <div :id="domId" class="echarts-container" :style="{'height': propsChartHeight + 'px'}">
    <!--<div v-if="!defaultOption.dataset.source.length" class="placeholderText">暂无数据</div>-->
  </div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    props: {
      propsData: {
        type: Array,
        default () {
          return []
        }
      },
      defaultOption: {
        type: Object,
        required: true
      },
      propsChartHeight: {
        type: Number,
        default: 300
      },
      domId: {
        type: String,
        default: 'echartsContainer'
      }
    },
    data () {
      return {
        echart: null
      }
    },
    methods: {
      initChart (propsData, mark) {
        let myChart = document.getElementById(this.domId)
        this.echart = echarts.init(myChart, this.gfnGetTheme())
        mark != 'init' && this.gfnEchartShowLoading(this.echart)
        if (propsData) {
          this.defaultOption.dataset.source = propsData
        }
        if (this.defaultOption.dataset.source.length) {
          this.echart.setOption(this.defaultOption)
          window.onresize = this.echart.resize
          this.echart.hideLoading()
        }
        /* 解除绑定事件 */
        this.echart.off('dblclick')
        this.echart.off('brushselected')
        /* 绑定双击事件 */
        this.echart.on('dblclick', (params) => {
          this.$emit('handleEchartDblClickEvent', params)
        })
        /* 绑定框选结束事件 */
        this.echart.on('brushselected', (params) => {
          this.$emit('handleBrushSelectedEvent', params)
        })
      }
    },
    watch: {
      propsData: {
        handler (newValue) {
          this.initChart(newValue)
        },
        deep: true
      },
      propsChartHeight (newValue) {
        this.echart.resize({
          height: newValue
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.initChart(this.propsData, 'init')
      })
    },
    beforeDestroy () {
      this.echart.off('dblclick')
      this.echart.off('brushselected')
    }
  }
</script>
<style lang="less" scoped>
  .echarts-container {
    width: 100%;
    /*width: 1640px;*/
    height: 300px;
    position: relative;
    /*/deep/ div {
      width: 100% !important;
      /deep/ canvas {
        width: 100% !important;
      }
    }*/
    &.echartsHeight {
      height: 1000px;
    }
    .placeholderText {
      font-size: 15px;
      position: absolute;
      left: 50%;
      top: 50%;
      transition: transform(-50%, -50%);
    }
  }
</style>
