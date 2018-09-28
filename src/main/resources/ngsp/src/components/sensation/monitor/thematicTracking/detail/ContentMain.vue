<template>
    <el-card class="content-main el-card-tabel">
        <el-form class="form" ref="selectParams" :rules="rules" :model="selectParams" :inline="true">
            <el-form-item label="日期" prop="date">
                <s-date-picker v-model="selectParams.date" is-range></s-date-picker>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="12">
                <h3>热度走势图</h3>
                <left-charts></left-charts>
            </el-col>
            <el-col :span="12">
                <h3>情感统计图</h3>
                <right-charts></right-charts>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
  export default {
    name: 'content-main',
    props: [],
    components: {
      SDatePicker: () => import('@/components/base/SDatePicker'),
      LeftCharts: () => import('./LeftCharts'),
      RightCharts: () => import('./RightCharts')
    },
    mixins: [],
    data () {
      return {
        selectParams: {
          date: ['2018-07-08', '2018-07-08']
        },
        rules: {}
      }
    },
    computed: {},
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
    .content-main {
    }
</style>