<template>
  <div class="manipulate-analysise-chart">
    <el-card class="el-card-table">
      <el-row>
        <el-col :span="12">
          <left-echart :stockPriceTrend="stockPriceTrend" @click="fnLeftEchart"/>
        </el-col>
        <el-col :span="12">
          <right-echart v-if="isShow" :yearMonthDay="yearMonthDay"/>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'manipulate-analysise-chart',
    props: {
      stockPriceTrend: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      LeftEchart: () => import('./ManipulateAnalysiseChart/LeftEchart'),
      RightEchart: () => import('./ManipulateAnalysiseChart/RightEchart')
    },
    mixins: [],
    data () {
      return {
        yearMonthDay: '',
        isShow: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      fnLeftEchart (val) {
        this.isShow = true
        this.yearMonthDay = val
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

<style lang="less">
  .manipulate-analysise-chart {
    .el-tabs__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
