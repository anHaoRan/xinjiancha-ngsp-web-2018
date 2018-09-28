
<template>
  <div class="classifiedInvestorSettingSelfTransferTableComponent">
    <el-table class="tableComponent"
              ref="multipleTable"
              v-tableLoadMore="handleTableLoadMore"
              :data="tableData"
              border
              tooltip-effect="dark"
              height="350"
              size="small"
              highlight-current-row
              @selection-change="handleSelectionChange"
              v-loading="loadingProps"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)"
              style="width: 100%">
      <el-table-column width="40" type="selection" v-if="isSelectionType"></el-table-column>
      <el-table-column
        v-for="column in columnsProps"
        :show-overflow-tooltip="true"
        :key="column.field"
        :label="column.label"
        :prop="column.field"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align == null ? 'center' : column.align"
        :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
        :sortable="column.sortable == null ? false : column.sortable"
        :sort-method="column.sortMethod"
      ></el-table-column>
      <el-table-column v-if="!isSelectionType"
                       label="操作"
                       align="center"
                       width="80">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.native.prevent="deleteRow(scope.row, scope.$index)"><i class="el-icon el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="tips-wrap">
          <p v-if="loadingMore">{{loadingMoreNote}}</p>
        </div>
      </template>
    </el-table>
    <div class="totalNumber">共计{{totalNumProps || tableDataProps.length}}条记录</div>
  </div>
</template>
<script>
import {G_C_NOTE_LAZY_LOAD} from '@/utils/constants'
export default {
  props: {
    isSelectionType: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default() {
        return ''
      }
    },
    checkingListProps: {
      type: Array,
      default() {
        return []
      }
    },
    totalNumProps: {
      type: Number,
      default: 0
    },
    tableDataProps: {
      type: Array,
      default() {
        return []
      }
    },
    loadingProps: {
      type: Boolean,
      default: false
    },
    columnsProps: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    checkingListProps(newValue) {
      this.checkingListComputed = newValue
    },
    tableDataProps(newValue) {
      this.tableData = newValue || []
    }
  },
  data() {
    return {
      G_C_NOTE_LAZY_LOAD,
      checkingListComputed: [],
      tableData: [],
      rightTableData: [],
      leftTableData: [],
      orgcode: '',
      pageIndex: 1, // 从1开始
      pageRows: 10, // 每次加载的数量
      loadingMore: false, // 加载更多的状态
      loadingMoreNote: G_C_NOTE_LAZY_LOAD.loading
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.checkingListComputed = val
      this.$emit('updateCheckingList', this.type, val)
    },
    deleteRow(item, index) {
      this.$emit('deleteTableTag', item, index)
    },
    // Table 懒加载
    handleTableLoadMore() {
      if (this.loadingMore) {
        return
      }
      this.loadingMore = true
      this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.loading
      ++this.pageIndex
      this.fnGetMoreData()
    },
    // 用于懒加载
    fnGetMoreData() {
      if (this.type === 'left') {
        this.$emit('leftAjaxFn', this.pageIndex, this.pageRows)
      } else if (this.type === 'right') {
        this.$emit('rightAjaxFn', this.pageIndex, this.pageRows)
      } else {
        this.$emit('reqConnectinvestoraccounts', {pageIndex: this.pageIndex, pageRows: this.pageRows})
      }
    }
  },
  mounted() {
    this.$emit('rightAjaxFn', this.pageIndex, this.pageRows)
  }
}
</script>
<style lang="less" scoped>
  .classifiedInvestorSettingSelfTransferTableComponent {
    .tableComponent {
      .tips-wrap {
        text-align: center
      }
    }
    .totalNumber {
      font-size: 14px;
      text-align: right;
      padding: 15px;
    }
  }

</style>
