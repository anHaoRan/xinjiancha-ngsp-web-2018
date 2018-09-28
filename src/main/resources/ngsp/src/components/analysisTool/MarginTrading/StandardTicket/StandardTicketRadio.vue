<template>
  <div class="standard-ticket-radio">
    <el-radio :label="scope.row[item.field]" name="StandardTicketRadio" v-model="radio"
              v-if="scope.row[item.field]!='合计'">
      <br/>
    </el-radio>
  </div>
</template>

<script>
  export default {
    name: 'standard-ticket-radio',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {
      radio: {
        get () {
          return this.$store.getters.getStandardTicketRadio
        },
        set (val) {
          this.$store.commit('setStandardTicketRadio', val)
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
  .standard-ticket-radio {
  }
</style>
