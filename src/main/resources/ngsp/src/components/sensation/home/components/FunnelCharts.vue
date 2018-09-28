<template>
  <div class="funnel-charts" :id="`funnel-charts-${index}`"></div>
</template>

<script>
  import VueMixin from '../../VueMixin'

  export default {
    name: 'funnel-charts',
    props: {
      data: {
        type: Array,
        required: true
      }
    },
    components: {},
    mixins: [VueMixin],
    data() {
      return {
        index: Math.round(Math.random() * 1000000)
      }
    },
    computed: {},
    watch: {
      data: {
        handler() {
          let name = [],
            value = []
          for (let key of this.data) {
            name.push(key.name)
            value.push({
              value: key.value,
              name: key.name
            })
          }
          this.$nextTick(function () {
            this.options.legend.data = name
            this.options.series[0].data = value
            this.drawEcharts()
          })
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      this.options = {
        legend: {
          orient: 'vertical',
          right: '10%',
          top: 'middle'
        },
        series: [
          {
            name: '',
            type: 'funnel',
            left: '10',
            bottom: '30',
            width: '70%',
            maxSize: '80%',
            label: {
              normal: {
                position: 'inside',
                formatter: '{c}',
                textStyle: {
                  color: '#fff'
                }
              }
            },
            data: []
          }
        ]
      }
    },
    mounted() {
      this.initEcharts(`funnel-charts-${this.index}`)
    },
    beforeDestroy() {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  .funnel-charts {
    height: 300px;
  }
</style>
