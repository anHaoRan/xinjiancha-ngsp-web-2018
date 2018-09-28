<template>
  <div class="securities-filing-radio">
    <el-radio :label="scope.row[item.field]" name="SecuritiesFilingRadio" v-model="radio"
              v-if="scope.row[item.field]!='合计'"><br/>
    </el-radio>
  </div>
</template>

<script>
  export default {
    name: 'securities-filing-radio',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {
      radio: {
        get () {
          return this.$store.getters.getSecuritiesFilingRadio
        },
        set (val) {
          this.$store.commit('setSecuritiesFilingRadio', val)
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
  .securities-filing-radio {
  }
</style>
