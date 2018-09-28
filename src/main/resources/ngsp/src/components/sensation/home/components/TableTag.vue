<template>
  <div class="table-tag">
    <tag :type="scope.row[item.field]"></tag>
  </div>
</template>

<script>
  export default {
    name: 'table-tag',
    props: ['scope', 'item'],
    components: {
      Tag: () => import('./Tag')
    },
    mixins: [],
    data() {
      return {}
    },
    computed: {},
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
  .table-tag {
  }
</style>
