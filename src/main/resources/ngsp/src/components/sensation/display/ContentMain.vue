<template>
    <div class="content-main">
        <el-card class="el-card-table">
            <sesation-list-item v-for="(item,index) in newData" :key="index" :data.sync="item"></sesation-list-item>
            <pageination
                    style="text-align: center"
                    :pageTotal="pageination.total"
                    :paginationProps="{pageSizeNumber:pageination.pageRows,currentPage:pageination.pageIndex}"
                    @getPageination="getPageination"></pageination>
        </el-card>
    </div>
</template>

<script>
  export default {
    name: 'content-main',
    props: {
      data: {
        type: Object,
        requierd: true
      }
    },
    components: {
      Pageination: () => import('@/components/common/pageination'), // 分页组件引入
      SesationListItem: () => import('./components/SesationListItem')
    },
    mixins: [],
    data () {
      return {}
    },
    computed: {
      newData () {
        return this.data.data
      },
      pageination () {
        return {
          total: Number(this.data.total),
          pageIndex: this.data.pageIndex,
          pageRows: this.data.pageRows
        }
      }
    },
    watch: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      getPageination (pageinationVal) {
        this.$emit('getPageination', pageinationVal)
      }
    }
  }
</script>

<style lang="less" scoped>
    .content-main {
    }
</style>