<template>
  <div class="securities-radio">
    <el-radio :label="scope.row[item.field]" name="SecuritiesRadio" v-model="radio" v-if="scope.row[item.field]!=''">
      <br/>
    </el-radio>
  </div>
</template>

<script>
  export default {
    name: 'securities-radio',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {
      radio: {
        get () {
          return this.$store.getters.getSecuritiesRadio
        },
        set (val) {
          this.$store.commit('setSecuritiesRadio', val)
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
  .securities-radio {
  }
</style>
