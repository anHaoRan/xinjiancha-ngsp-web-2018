<template>
  <div id="sales-department-account"></div>
</template>

<script>
  import MinxinVue from '../Mixin'

  export default {
    name: 'sales-department-account',
    props: {
      branchAcctsList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {},
    mixins: [MinxinVue],
    data () {
      return {
        xAxis: [],
        series: []
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created () {
      this.options = {
        title: {
          text: '营业部账户统计',
          left: 30,
          top: 20
        },
        tooltip: {
          trigger: 'item'
        },
        xAxis: [
          {
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
            type: 'bar'
          }
        ]
      }
    },
    mounted () {
      this.initEcharts('sales-department-account')
      for (let key of this.branchAcctsList) {
        this.xAxis.push(key[0])
        this.series.push(key[1])
      }
      this.options.xAxis[0].data = this.xAxis
      this.options.series[0].data = this.series
      this.drawEcharts()
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  #sales-department-account {
    height: 250px;
  }
</style>
