<template>
  <div id="marking"></div>
</template>

<script>
  import MinxinVue from '../Mixin'

  export default {
    name: 'marking',
    props: {},
    components: {},
    mixins: [MinxinVue],
    data () {
      return {}
    },
    computed: {
      reserved () {
        return this.$store.getters.getGoDeleteRight.length
      },
      delAcct () {
        return this.$store.getters.getShuttleRight.length
      }
    },
    watch: {
      delAcct: {
        handler: function () {
          this.options.series[0].data[0].value = this.reserved
          this.options.series[0].data[1].value = this.delAcct
          this.echart.setOption(this.options, true)
        },
        deep: true
      }
    },
    methods: {},
    created () {
      this.options = {
        title: {
          text: '标记统计',
          left: 30,
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}：{c}({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: 'middle',
          left: 30,
          itemWidth: 20,
          itemHeight: 20,
          data: ['保留', '删除']
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '55%'],
            radius: ['30%', '55%'],
            // color: ['#d74e67', '#0092ff'],
            label: {
              show: false
            },
            data: [
              {value: this.reserved, name: '保留'},
              {value: this.delAcct, name: '删除'}
            ]
          }
        ]
      }
    },
    mounted () {
      this.initEcharts('marking')
      this.drawEcharts()
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  #marking {
    height: 250px;
  }
</style>
