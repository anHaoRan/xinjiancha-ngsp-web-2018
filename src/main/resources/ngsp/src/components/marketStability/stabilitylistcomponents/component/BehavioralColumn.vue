<template>
  <div class="behavioral-column">
    <span :class="(item2==2||item2==3)?securityStyle.up:securityStyle.down"
          v-for="(item2,index) in scope.row[item.field]"
          :key="index">
                  <strong v-if="item2==1">程序化;</strong>
                  <span v-if="item2==2">一分钟卖出金额较大;</span>
                  <span v-if="item2==3">净卖出居前;</span>
                  <strong v-if="item2==4">瞬间大额主动卖出;</strong>
                  <strong v-if="item2==5">瞬间大额卖出;</strong>
                  <strong v-if="item2==7">瞬间大额买入;</strong>
                  <strong v-if="item2==6">瞬间大额主动买入;</strong>
                </span>
  </div>
</template>

<script>
  import { securityStyle } from '@/utils/constants'

  export default {
    name: 'behavioral-column',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {
        securityStyle: securityStyle
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

</style>
