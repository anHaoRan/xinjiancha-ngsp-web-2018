<template>
  <div class="monitor-self-transfer-table-component">
    <el-table
      class="tableComponent"
      ref="multipleTableRight"
      :data="tableDataProps"
      tooltip-effect="dark"
      v-loading="loadingProps"
      border
      height="450"
      size="small"
      highlight-current-row
      element-loading-spinner="el-icon-loading"
      element-loading-text="数据加载中，请耐心等待..."
      element-loading-background="rgba(0,0,0,0.3)"
      @selection-change="handleSelectionChange">
      <el-table-column width="40" type="selection"></el-table-column>
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
        :sort-method="column.sortMethod">
      </el-table-column>
    </el-table>
    <el-row>
      <pageination
        @getPageination="getPageination"
        :pageTotal="totalNumProps"></pageination>
    </el-row>

  </div>
</template>
<script>
  import pageination from '@/components/common/pageination'

  export default {
    data () {
      return {
        pageination: {
          currentPage: 1,
          pageSizeNumber: 10
        }
      }
    },
    watch: {},
    components: {
      pageination
    },
    props: {
      type: {
        type: String,
        default: ''
      },
      tableDataProps: {
        type: Array,
        default () {
          return []
        }
      },
      columnsProps: {
        type: Array,
        default () {
          return []
        }
      },
      totalNumProps: {
        type: Number,
        default: 0
      },
      loadingProps: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getPageination (pageination) {
        this.pageination = pageination
        this.$emit('updateList', {...this.pageination, ...{type: this.type}})
      },
      handleSelectionChange (val) {
        this.$emit('updateCheckingList', this.type, val)
      }
    },
    mounted () {
    }
  }
</script>
