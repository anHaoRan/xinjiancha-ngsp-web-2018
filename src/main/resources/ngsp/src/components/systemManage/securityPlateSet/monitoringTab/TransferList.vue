<template>
  <div class="el-transfer transfer-table">
    <div class="el-transfer-panel">
      <p class="el-transfer-panel__header pagination-bj">
        {{ titles == null? '设置表' : titles[1] }}
      </p>
      <div class="el-transfer-panel__body">
        <el-table
          ref="multipleTableLeft"
          height="246"
          :data="left"
          tooltip-effect="dark"
          @selection-change="handleLeftSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            v-for="column in columns"
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
        </el-table>
      </div>
      <el-col :span="24" class="pagination-bj">
        <el-pagination
          @size-change="sizeChangeTable "
          @current-change="currentChangeTable"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableTotal"
          size="mini">
        </el-pagination>
      </el-col>
    </div>
    <div class="el-transfer__buttons">
      <el-button type="primary" class="el-transfer__button"
                 @click="handleLeftTransfer"
                 :disabled="rightMultipleSelection.length > 0">
        <i class="el-icon-arrow-left"></i>
      </el-button>
      <el-button type="primary" class="el-transfer__button" icon="el-icon-arrow-right"
                 @click="handleRightTransfer"
                 :disabled="leftMultipleSelection.length > 0"></el-button>
    </div>
    <div class="el-transfer-panel">
      <p class="el-transfer-panel__header pagination-bj">
        {{ titles == null? '设置表' : titles[1] }}
      </p>
      <div class="el-transfer-panel__body">
        <el-table
          ref="multipleTableRight"
          height="246"
          :data="right"
          tooltip-effect="dark"
          @selection-change="handleRightSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            v-for="column in columns"
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
        </el-table>
      </div>
      <el-col :span="24" class="pagination-bj">
        <el-pagination
          @size-change="sizeChangeTable"
          @current-change="currentChangeTable"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableTotal"
          size="mini">
        </el-pagination>
      </el-col>
    </div>
  </div>
</template>

<script>

  export default {
    model: {
      prop: 'value',
      event: 'update'
    },
    props: ['titles', 'columns', 'data', 'value'],
    data () {
      return {
        left: [
          {label: '证券板块编号', field: 'investor_type', align: 'center', sortable: true},
          {label: '证券板块名称', field: 'investor_name', align: 'center', sortable: false}
        ],
        right: this.value,
        leftMultipleSelection: [],
        rightMultipleSelection: [],
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        tableTotal: 0
      }
    },
    methods: {
      handleLeftSelectionChange (val) {
        this.leftMultipleSelection = val
      },
      handleRightSelectionChange (val) {
        this.rightMultipleSelection = val
      },
      handleLeftTransfer () {
        let _this = this
        // 全选的情况
        if (this.rightMultipleSelection.length === this.right.length) {
          this.rightMultipleSelection.map(function (item, index) {
            _this.left.push(item)
          })
          this.right = []
          this.handleUpdate()
          this.handleChange(this.right, 'left', this.rightMultipleSelection)
          return
        }
        // 以下为非全选的情况
        let map = {}
        // 移动到左边
        this.rightMultipleSelection.map(function (item, index) {
          _this.left.push(item)
          map[JSON.stringify(item)] = 1
        })
        // 删除右边选中的
        this.right.map(function (item, index) {
          if (map[JSON.stringify(item)] === 1) {
            _this.right.splice(index, 1)
          }
        })
        this.handleUpdate()
        this.handleChange(this.right, 'left', this.rightMultipleSelection)
      },
      handleRightTransfer () {
        let _this = this
        // 全选的情况
        if (this.leftMultipleSelection.length === this.left.length) {
          this.leftMultipleSelection.map(function (item, index) {
            _this.right.push(item)
          })
          this.left = []

          this.handleUpdate()
          this.handleChange(this.right, 'right', this.leftMultipleSelection)
          return
        }
        // 以下为非全选的情况
        let map = {}
        // 移动到右边
        this.leftMultipleSelection.map(function (item, index) {
          _this.right.push(item)
          map[JSON.stringify(item)] = 1
        })
        // 删除左边选中的
        this.left.map(function (item, index) {
          if (map[JSON.stringify(item)] === 1) {
            _this.left.splice(index, 1)
          }
        })
        this.handleUpdate()
        this.handleChange(this.right, 'right', this.leftMultipleSelection)
      },
      handleUpdate () {
        this.$emit('update', this.right)
      },

      handleChange (value, direction, moved) {
        this.$emit('change', value, direction, moved)
      },
      initLeft () {
        let _this = this
        let map = {}
        this.value.map(function (item, index) {
          map[JSON.stringify(item)] = 1
        })
        this.data.map(function (item, index) {
          if (map[JSON.stringify(item)] !== 1) {
            _this.left.push(item)
          }
        })
      },
      sizeChangeTable () {},
      currentChangeTable () {}
    },

    mounted () {
      this.initLeft()
    }
  }
</script>

<style lang="less">
  .transfer-table {
    .el-transfer-panel {
      width: calc(~"(100% - 108px)/2");
      border: 0 solid !important;
      /*background-color: #17274b;*/
    }
    .pagination-bj {
      background-color: #17274b;
      color: #7b8fb9;
      border-bottom: 0 solid #ebeef5 !important;
    }
  }
</style>
