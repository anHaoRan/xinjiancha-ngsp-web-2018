<template>
  <div class="el-transfer transfer-table">
    <div class="el-transfer-panel">
      <!--<p class="el-transfer-panel__header">-->
      <!--&lt;!&ndash;{{ titles == null? '列表1' : titles[1] }}&ndash;&gt;-->
      <!--</p>-->
      <div class="el-transfer-panel__body">
        <el-table
          ref="multipleTableLeft"
          height="246"
          :data="left"
          tooltip-effect="dark"
          @selection-change="handleLeftSelectionChange">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column
            v-for="(column,index) in columns"
            :show-overflow-tooltip="true"
            :key="index"
            :label="column.label"
            :prop="column.field"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align == null ? 'center' : column.align"
            :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
            :sortable="column.sortable == null ? false : column.sortable"
            :sort-method="column.sortMethod"
            :formatter="column.formatter"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        class="el-transfer__button"
        icon="el-icon-arrow-left"
        @click="handleLeftTransfer"
        :disabled="rightMultipleSelection.length > 0 ? false : true">
      </el-button>
      <el-button
        type="primary"
        class="el-transfer__button"
        icon="el-icon-arrow-right"
        @click="handleRightTransfer"
        :disabled="leftMultipleSelection.length > 0 ? false : true">
      </el-button>
    </div>
    <div class="el-transfer-panel">
      <!--<p class="el-transfer-panel__header">-->
      <!--{{ titles == null? '列表2' : titles[1] }}-->
      <!--</p>-->
      <div class="el-transfer-panel__body">
        <el-table
          ref="multipleTableRight"
          height="246"
          :data="right"
          tooltip-effect="dark"
          @selection-change="handleRightSelectionChange">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column
            v-for="(column,index) in columnsRight"
            :show-overflow-tooltip="true"
            :key="index"
            :label="column.label"
            :prop="column.field"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align == null ? 'center' : column.align"
            :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
            :sortable="column.sortable == null ? false : column.sortable"
            :sort-method="column.sortMethod"
            :formatter="column.formatter">  
          </el-table-column>
          <el-table-column
          prop="acct_type"
          label="账户类型"
          width="120"
          align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.acct_type" size="mini" style="width: 100px" @change="handleUpdate">
              <el-option label="待定" value="待定"/>
              <el-option label="删除" value="删除"/>
            </el-select>    
          </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'value',
      event: 'update'
    },
    props: ['titles', 'columns', 'columnsRight' , 'data', 'value'],
    data () {
      return {
        left: [],
        right: [],
        leftMultipleSelection: [],
        rightMultipleSelection: [],
        acct_type: "1",
      }
    },
    watch: {
      data: {
        handler: function () {
          this.initLeft()
        },
        deep: true,
        immediate: true
      },
      value: {
        handler: function () {
          this.right = this.value
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      handleLeftSelectionChange (val) {
        this.leftMultipleSelection = val
      },
      handleRightSelectionChange (val) {
        this.rightMultipleSelection = val
      },
      // 数据左移  右侧移动的左侧
      handleLeftTransfer () {
        let _this = this
        // 全选的情况
        if (this.rightMultipleSelection.length == this.right.length) {
          this.rightMultipleSelection.map(function (item, index) {
            item.acct_type = '确定'
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
          item.acct_type = '确定'
          _this.left.push(item)
          map[JSON.stringify(item)] = 1
        })

        // 删除右边选中的
        for (let key of this.rightMultipleSelection) { // eslint-disable-line
          this.right.splice(this.right.findIndex(item => map[JSON.stringify(item)] == 1), 1)
        }
        this.handleUpdate()
        this.handleChange(this.right, 'left', this.rightMultipleSelection)
      },
      // 数据右移  左侧移动的右侧
      handleRightTransfer () {
        let _this = this
        // 全选的情况
        if (this.leftMultipleSelection.length == this.left.length) {
          this.leftMultipleSelection.map(function (item, index) {
            item.acct_type = '待定'
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
          item.acct_type = '待定'
          _this.right.push(item)
          map[JSON.stringify(item)] = 1
        })
        // 删除左边选中的
        for (let key of this.leftMultipleSelection) { // eslint-disable-line
          this.left.splice(this.left.findIndex(item => map[JSON.stringify(item)] == 1), 1)
        }
        this.handleUpdate()
        this.handleChange(this.right, 'right', this.leftMultipleSelection)
      },
      // 左右侧数据更新
      handleUpdate () {
        this.$emit('update', this.right, this.left)
      },
      handleChange (value, direction, moved) {
        this.$emit('change', value, direction, moved)
      },
      initLeft () {
        this.left = []
        let _this = this
        let map = {}
        this.value.map(function (item, index) {
          map[JSON.stringify(item)] = 1
        })

        this.data.map(function (item, index) {
          if (map[JSON.stringify(item)] != 1) {
            _this.left.push(item)
          }
        })
        
      }
    },
    mounted () {
    }
  }
</script>

<style lang="less">
  .transfer-table {
    .el-transfer-panel {
      width: calc(~"(100% - 108px)/2");
      border: 0 solid !important;
    }
  }
</style>
