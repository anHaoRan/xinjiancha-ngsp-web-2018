<!--table和pagination功能封装-->
<!--
***** @ params
***** loading: 是否显示loading
***** showSelection: 是否显示复选框
***** showPagination: 是否显示分页组件
***** totalNum: 总条数
***** pagination: 分页对象；包含currentPage和pageSizeNumber
***** tableData: 表格数据
***** columns: 表头
***** pageSizes: 每页显示个数选择器选项，【10,20,50,100】
***** paginationLayout: 分页组件布局，子组件名用逗号隔开
-->
<template>
  <div class="commonTablePaginationComponent">
    <el-table
      class="table-area"
      :data="tableData"
      border
      tooltip-effect="dark"
      height="442"
      size="small"
      highlight-current-row
      :show-header="showHeader"
      :row-class-name="rowClassName"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @row-contextmenu="handleRowContextMenu"
      @row-dblclick="handleRowDbClick"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="数据加载中，请耐心等待..."
      element-loading-background="rgba(0,0,0,0.3)"
      style="width: 100%;">
      <el-table-column v-if="showSelection" type="selection" width="40" align="center"></el-table-column>
      <s-table-columns
        v-for="(item,index) in columns"
        :key="index"
        :item="item"
        v-if="item.show===undefined||item.show">
      </s-table-columns>
    </el-table>
    <pageination
      v-if="showPagination"
      @getPageination="getPageination"
      :paginationProps="pagination"
      :pageSizes="pageSizes"
      :layout="paginationLayout"
      :pageTotal="Number(totalNum) || 0"></pageination>
  </div>
</template>
<script>
  import pageination from '@/components/common/pageination'
  import STableColumns from '@/components/base/STableColumns'

  export default {
    components: {
      pageination,
      STableColumns
    },
    props: {
      otherParams: {
        type: Object,
        default () {
          return {}
        }
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      showSelection: {
        type: Boolean,
        default: false
      },
      showPagination: {
        type: Boolean,
        default: true
      },
      totalNum: {
        type: Number,
        default: 0
      },
      pagination: {
        type: Object,
        default () {
          return {
            currentPage: 1,
            pageSizeNumber: 10
          }
        }
      },
      tableData: {
        type: Array,
        default () {
          return []
        }
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      pageSizes: {
        type: Array,
        default () {
          return [10, 20, 50, 100]
        }
      },
      paginationLayout: {
        type: String,
        default: 'total, sizes, prev, pager, next'
      }
    },
    data () {
      return {}
    },
    methods: {
      rowClassName ({row, rowIndex}) {
        if (row.importClass === 'importIdsMark' || row.clickClass === 'yes') {
          return row.importClass + ' ' + row.clickClass // 点击时的样式，必须写在导入样式的后面
        } else {
          return row.importClass
        }
      },
      getPageination (pagination) {
        this.$emit('handlePaginationChange', pagination, this.otherParams)
      },
      handleRowClick (row, event, column) {
        this.$emit('handleRowClick', row, event, column, this.otherParams)
      },
      handleSelectionChange (selection) {
        this.$emit('handleSelectionChange', selection)
      },
      handleRowContextMenu (row, event) {
        this.$emit('handleRowContextMenu', row, event)
      },
      handleRowDbClick (row, event) {
        this.$emit('handleRowDbClick', row, event)
      }
    },
    mounted () {
    }
  }
</script>
<style lang="less" scoped>
  .commonTablePaginationComponent {
    .el-table {
      .el-table__header-wrapper {
        overflow: visible;
      }
    }
  }
</style>
