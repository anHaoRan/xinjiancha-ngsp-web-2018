<template>
    <div class="right-charts" id="right-charts">
        1
    </div>
</template>

<script>
  import VueMixin from '../../../VueMixin'

  export default {
    name: 'right-charts',
    props: [],
    components: {},
    mixins: [VueMixin],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    created () {
      this.options = {
        title: '',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dashed',
              color: '#006cee'
            }
          },
          backgroundColor: 'rgba(245,245,245,0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000'
          }
        },
        axisPointer: {
          link: {xAxisIndex: 'all'}
        },
        grid: {
          top: 10
        },
        xAxis: [],
        yAxis: [],
        series: []
      }
    },
    mounted () {
      this.initEcharts('right-charts')
      this.ajax()
    },
    beforeDestroy () {
    },
    methods: {
      ajax () {
        this.options.xAxis = [
          {
            type: 'category',
            data: ['正面主题数', '负面主题数', '中性主题数'],
            boundaryGap: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#263657'
              }
            },
            axisLabel: {
              color: '#506798'
            }
          }
        ]
        this.options.yAxis = [
          {
            axisLabel: {
              color: '#506798'
            },
            axisLine: {
              lineStyle: {
                color: '#334164'
              }
            }
          }
        ]
        this.options.series = [
          {
            name: '',
            type: 'bar',
            barWidth: '30',
            data: ['120', '60', '200']
          }
        ]
        this.drawEcharts()
      }
    }
  }
</script>

<style lang="less" scoped>
    .right-charts {
        height: 400px;
    }
</style>