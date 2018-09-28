<template>
  <div class="financing-radio">
    <el-radio :label="scope.row[item.field]" name="FinancingRadio" v-model="radio" v-if="scope.row[item.field]!=='合计'"><br/>
    </el-radio>
  </div>
</template>

<script>
  export default {
    name: 'financing-radio',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {
      radio: {
        get () {
          return this.$store.getters.getFinancingRadio
        },
        set (val) {
          this.$store.commit('setFinancingRadio', val)
        }
      }
    },
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
  .financing-radio {
  }
</style>
