<template>
  <div id="historical-report"></div>
</template>

<script>
  import MinxinVue from '../Mixin'

  let data = {
    xAxis: [
      '账户1', '账户2', '账户3', '账户4', '账户5', '账户6'
    ],
    series: [1000, 2010, 1300, 4100, 2500, 3600]
  }
  export default {
    name: 'historical-report',
    props: {},
    components: {},
    mixins: [MinxinVue],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {},
    created () {
      this.options = {
        title: {
          text: '历史上报统计',
          left: 30,
          top: 20
        },
        tooltip: {
          trigger: 'item'
        },
        xAxis: [
          {
            data: data.xAxis,
            axisLabel: {
              color: '#aec0e6',
              interval: 0,
              rotate: 45
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
            axisLabel: {
              color: '#aec0e6'
            },
            axisLine: {
              lineStyle: {
                color: '#334164'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            data: data.series
          }
        ]
      }
    },
    mounted () {
      this.initEcharts('historical-report')
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  #historical-report {
    height: 250px;
  }
</style>
