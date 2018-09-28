<template>
  <el-card class="small-card">
    <div class="small-card-title">预警统计</div>
    <div class="small-card-content">
      <div id="fluctAlarmStatis" :style="{
          'height':newHeight+'px'
      }"></div>
    </div>
  </el-card>
</template>

<script>
  import MinxinVue from './Mixin'
  import { getAlarmTrend } from '@/service/homepage/index' // eslint-disable-line

  export default {
    name: 'fluct-alarm-statis',
    props: ['height'],
    components: {},
    mixins: [MinxinVue],
    data () {
      return {}
    },
    computed: {
      newHeight () {
        return this.height ? Number(this.height) - 48 : this.height
      }
    },
    watch: {
      height: {
        handler () {
          this.$nextTick(function () {
            this.initEcharts('fluctAlarmStatis')
            this.drawEcharts()
          })
        },
        immediate: true
      }
    },
    created () {
      this.options = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}：{c}({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: 'middle',
          right: 30,
          itemWidth: 20,
          itemHeight: 20,
          data: ['保留', '删除']
        },
        series: [
          {
            type: 'pie',
            center: ['30%', '50%'],
            radius: ['50%', '55%'],
            // color: ['#d74e67', '#0092ff'],
            label: {
              show: false
            },
            data: [
              {value: 3, name: '保留'},
              {value: 4, name: '删除'}
            ]
          },
          {
            type: 'pie',
            hoverAnimation: false,
            silent: true,
            center: ['30%', '50%'],
            radius: ['50%', '50%'],
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              formatter: '{c}',
              position: 'center',
              show: true,
              textStyle: {
                fontSize: 16,
                fontWeight: 'normal',
                color: '#fff'
              }
            },
            data: [
              {value: 7, name: '总数'}
            ]
          }
        ]
      }
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  .fluct-alarm-statis {
  }
</style>
