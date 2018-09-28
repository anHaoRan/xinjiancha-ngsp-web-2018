<!--图表公共组件-->
<template>
  <div
    v-loading="loading"
    element-loading-text="图表加载中，请耐心等待..."
    element-loading-background="rgba(0,0,0,0.3)"
    :id="domId" class="echarts-container" :style="{'height': propsChartHeight + 'px'}">
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
      },
      loading: {
        type: Boolean,
        default: false
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
        // mark !== 'init' && this.gfnEchartShowLoading(this.echart)
        if (propsData && propsData.length) {
          this.defaultOption.series.data = propsData
        }
        if (this.defaultOption.series.data.length) {
          this.echart.setOption(this.defaultOption)
          window.onresize = this.echart.resize
          this.echart.hideLoading()
        }
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
    }
  }
</script>
<style lang="less" scoped>
  .echarts-container {
    width: 100%;
    /*width: 1640px;*/
    height: 350px;
    position: relative;
    padding: 20px;
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
