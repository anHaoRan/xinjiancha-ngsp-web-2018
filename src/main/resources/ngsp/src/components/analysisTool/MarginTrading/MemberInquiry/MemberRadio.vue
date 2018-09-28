<template>
  <div class="member-radio">
    <el-radio :label="scope.row[item.field]" name="memberRadio" v-model="radio" v-if="scope.row[item.field]"><br/>
    </el-radio>
  </div>
</template>

<script>
  export default {
    name: 'member-radio',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data () {
      return {}
    },
    computed: {
      radio: {
        get () {
          return this.$store.getters.getMemberInquiryRadio
        },
        set (val) {
          this.$store.commit('setMemberInquiryRadio', val)
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
  .member-radio {
  }
</style>
