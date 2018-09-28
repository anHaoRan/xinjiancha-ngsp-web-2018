<!--分页组件页面-->
<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="pageSizes"
      :page-size="pagination.pageSizeNumber"
      :layout="layout"
      :total="pageTotal">
    </el-pagination>
  </div>
</template>
<!--suppress ALL -->
<script>
  export default {
    props: {
      paginationProps: {
        type: Object,
        default () {
          return {
            currentPage: 1,
            pageSizeNumber: 10
          }
        }
      },
      pageTotal: {
        type: Number,
        default: 0
      },
      pageSizes: {
        type: Array,
        default () {
          return [10, 20, 50, 100]
        }
      },
      layout: {
        type: String,
        default: 'total, sizes, prev, pager, next'
      }
    },
    data () {
      return {
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        }
      }
    },
    watch: {
      paginationProps: {
        handler (newValue) {
          this.pagination = newValue
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      handleSizeChange (val) {
        this.pagination = {
          currentPage: 1,
          pageSizeNumber: val
        }
        this.$emit('getPageination', this.pagination)
      },
      // 当前页改变传值
      handleCurrentChange (val) {
        this.pagination.currentPage = val
        this.$emit('getPageination', this.pagination)
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>

</style>
