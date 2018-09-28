<template>
  <div>
    <div class="latitude">
      <el-radio-group v-model="latitude" size="small">
        <el-radio-button label="date">日</el-radio-button>
        <el-radio-button label="month">月</el-radio-button>
        <el-radio-button label="quarter">季度</el-radio-button>
      </el-radio-group>
    </div>
    <el-row>
      <el-col :span="12">
        <abnormal-echart :latitude="latitude"/>
      </el-col>
      <el-col :span="12">
        <abnormal-table ref="AbnormalTable"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  export default {
    name: 'abnormal-trading',
    props: {},
    components: {
      AbnormalEchart: () => import('./AbnormalComponents/AbnormalEchart'),  //  图表
      AbnormalTable: () => import('./AbnormalComponents/AbnormalTable') //  表格
    },
    mixins: [],
    data () {
      return {
        latitude: 'date'
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  .latitude {
    padding: 15px 20px;
  }
</style>
