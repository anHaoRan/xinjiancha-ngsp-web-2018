<template>
  <el-input :disabled="otherProps && otherProps.disabled" v-model="scope.row.accountCode" placeholder="回车搜索账户信息" size="small"
            @keyup.enter.native="handlerChange(scope.row)"></el-input>
</template>
<script>
  export default {
    props: {
      otherProps: {
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
    methods: {
      handlerChange(val) {
        this.$emit('handlerChange', val)
      }
    }
  }
</script>