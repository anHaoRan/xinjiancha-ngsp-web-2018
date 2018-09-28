<template>
  <div id="association-type"></div>
</template>

<script>
  import MinxinVue from '../Mixin'

  let data = [
    {
      value: 100,
      name: '物理关联',
      children: [
        {
          value: 150,
          name: '物理关联1'
        },
        {
          value: 250,
          name: '物理关联2'
        }
      ]
    },
    {
      value: 150,
      name: '交易关联',
      children: [
        {
          value: 200,
          name: '交易关联1'
        },
        {
          value: 250,
          name: '交易关联2'
        }
      ]
    }
  ]
  export default {
    name: 'association-type',
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
          text: '关联类型统计',
          left: 30,
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}：{c}({d}%)'
        },
        series: [
          {
            type: 'pie',
            center: ['30%', '55%'],
            radius: ['30%', '55%'],
            // color: ['#d74e67', '#0092ff'],
            label: {
              show: false
            },
            data: data
          },
          {
            type: 'pie',
            center: ['75%', '48%'],
            radius: ['15%', '40%'],
            color: ['#d74e67', '#0092ff'],
            label: {
              show: false
            },
            data: []
          }
        ]
      }
    },
    mounted () {
      this.initEcharts('association-type')
      this.echart.on('click', (val) => {
        this.options.series[1].data = val.data.children
        this.echart.setOption(this.options, true)
      })
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  #association-type {
    height: 250px;
  }
</style>
