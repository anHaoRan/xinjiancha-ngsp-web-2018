<template>
  <div class="tableColumnRadioComponent">
    <el-radio
      v-if="scope.row[item.field] !== '合计'"
      v-model='radio'
      :label='scope.row[item.field]'
      @change='handleClickEvent'>
    </el-radio>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    props: {
      item: {
        type: Object,
        default () {
          return {}
        }
      },
      scope: {
        type: Object,
        default () {
          return {}
        }
      }
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
    methods: {
      handleClickEvent () {
        let value = {
          type: 'tableColumnRadioComponent',
          scope: this.scope,
          item: this.item
        }
        this.$emit('handlerChange', value)
      }
    }
  }
</script>
<style lang="less" scoped>
  .tableColumnRadioComponent {
  }
</style>
