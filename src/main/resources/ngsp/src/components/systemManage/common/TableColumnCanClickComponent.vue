<template>
  <div class="tableColumCanClickComponent">
    <a class="link-common-css" @click='handleClickEvent'>{{scope.row[item.field]}}</a>
  </div>
</template>
<script>
  export default {
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
    methods: {
      handleClickEvent () {
        let value = {
          type: 'tableColumnCanClickComponent',
          scope: this.scope,
          item: this.item
        }
        this.$emit('handlerChange', value)
      }
    }
  }
</script>
<style lang="less" scoped>
/*  .tableColumCanClickComponent {
    text-decoration: underline;
    color: #409eff;
    cursor: pointer;
  }*/
</style>
