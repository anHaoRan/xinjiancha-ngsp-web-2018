<template>
  <div class="table-cty" :class="gfnFormatSecurityClass(scope.row[item.field])">
    {{scope.row[item.field]}}
    <img :src="imgSrc" height="27px" style="margin-left: 5px"/>
  </div>
</template>

<script>
  import up from '../../../../assets/images/u61280.png'
  import down from '../../../../assets/images/u61282.png'

  export default {
    name: 'table-cty',
    props: ['scope', 'item'],
    components: {},
    mixins: [],
    data() {
      return {}
    },
    computed: {
      imgSrc() {
        return this.gfnFormatSecurityClass(this.scope.row[this.item.field]) == 'up' ? up : down
      }
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  .table-cty {
    display: flex;
    align-items: center;
  }
</style>
