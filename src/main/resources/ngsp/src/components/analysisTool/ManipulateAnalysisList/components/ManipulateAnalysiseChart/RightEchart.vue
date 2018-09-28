<template>
  <div class="right-echart">
    <div class="el-tabs">
      <div class="el-tabs__header">
        <div class="el-tabs__nav-wrap">
          <div class="el-tabs__item">
            <div></div>
            <!--<el-button-->
            <!--type="info"-->
            <!--size="small"-->
            <!--@click="">导出-->
            <!--</el-button>-->
          </div>
        </div>
      </div>
    </div>
    <el-row>
      <el-col :span="18">
        <stock-time-echarts :yearMonthDay="yearMonthDay" @update="getTime"/>
      </el-col>
      <el-col :span="6">
        <stock-ten-echarts v-if="isShow" :yearMonthDay="yearMonthDay" :tTime="tTime"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'right-echart',
    props: {
      yearMonthDay: [Date, String]
    },
    components: {
      StockTimeEcharts: () => import('./StockTimeEcharts'),
      StockTenEcharts: () => import('./StockTenEcharts')
    },
    mixins: [],
    data () {
      return {
        tTime: '',
        isShow: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      getTime (val) {
        this.tTime = val
        this.isShow = true
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
</style>
