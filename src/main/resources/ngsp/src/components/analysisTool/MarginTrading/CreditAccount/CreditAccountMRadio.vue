<template>
  <div class="credit-account-m-radio">
    <el-radio :label="scope.row[item.field]" name="CreditAccountMRadio" v-model="radio" v-if="scope.row[item.field]!=''"><br/>
    </el-radio>
  </div>
</template>

<script>
  export default {
    name: 'credit-account-m-radio',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {
      radio: {
        get () {
          return this.$store.getters.getCreditAccountMRadio
        },
        set (val) {
          this.$store.commit('setCreditAccountMRadio', val)
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
  .credit-account-m-radio {
  }
</style>
