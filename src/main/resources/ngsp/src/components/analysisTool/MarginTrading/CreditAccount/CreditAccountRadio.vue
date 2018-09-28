<template>
  <div class="credit-account-radio">
    <el-radio :label="scope.row[item.field]" name="CreditAccountRadio" v-model="radio" v-if="scope.row[item.field]!=''"><br/>
    </el-radio>
  </div>
</template>

<script>
  export default {
    name: 'credit-account-radio',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {
      radio: {
        get () {
          return this.$store.getters.getCreditAccountRadio
        },
        set (val) {
          this.$store.commit('setCreditAccountRadio', val)
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
  .credit-account-radio {
  }
</style>
