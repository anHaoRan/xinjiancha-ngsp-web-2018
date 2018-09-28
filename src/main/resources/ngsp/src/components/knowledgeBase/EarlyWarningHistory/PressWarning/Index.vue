<template>
  <div class="index">
    <query-conditions @select="select"/>
    <output-result-set ref="outputResult"/>
  </div>
</template>

<script>
  export default {
    name: 'index',
    props: ['activeName'],
    components: {
      QueryConditions: () => import('./QueryConditions'),        // 查询条件
      OutputResultSet: () => import('./OutputResultSet')        // 输出结果集
    },
    mixins: [],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {
      select (val) {
        this.$refs.outputResult.selectParams = JSON.parse(JSON.stringify(val))
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
  .index {
  }
</style>
