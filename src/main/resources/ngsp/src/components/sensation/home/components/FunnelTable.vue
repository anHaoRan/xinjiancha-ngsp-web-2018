<template>
  <div class="funnel-table">
    <margin-table :isPageination="false" :height="300" :columns="columns"
                  :data="data"
                  @row-click="handlerRowClick"
    ></margin-table>
  </div>
</template>

<script>
  export default {
    name: 'funnel-table',
    props: ['columns', 'data'],
    components: {
      MarginTable: () => import('@/components/base/MarginTable')
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
    methods: {
      handlerRowClick(row, event, column) {
        console.log(row, event, column)
      }
    }
  }
</script>

<style lang="less">
  .funnel-table {
    .el-table tr td, .el-table tr th {
      border-bottom: 1px solid transparent;
      border-right: 1px solid transparent;
      &:last-child {
        border-bottom: 1px solid transparent;
      }
    }
  }
</style>
