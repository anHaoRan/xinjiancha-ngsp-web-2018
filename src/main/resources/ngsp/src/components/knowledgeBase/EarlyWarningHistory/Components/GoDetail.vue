<template>
  <div class="go-detail">
    <el-button type="text" size="small" style="border: none;" @click="goDetail">{{scope.row[item.field]}}</el-button>
  </div>
</template>

<script>
  export default {
    name: 'go-detail',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {
      goDetail () {
        this.openNewWindow('tdateAlarmDetail', `#/tdateAlarmDetail/${this.scope.row[this.item.field]}`)
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
  .go-detail {
  }
</style>
