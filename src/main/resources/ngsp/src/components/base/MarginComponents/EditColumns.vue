<template>
  <div class="edit-columns">
    <div slot="header">
      <label>可见选项</label>
    </div>
    <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
    <el-checkbox-group v-model="checkedList" @change="handleCheckChange">
      <el-checkbox v-for="(item,index) in tableColumns" :label="item.label" :key="index" v-if="!item.template">
        {{ item.label }}
        <el-button-group>
          <el-button type="primary" size="mini" icon="el-icon-sort-up"
                     @click="handleUpDownCol('up', index)"></el-button>
          <el-button type="primary" size="mini" icon="el-icon-sort-down"
                     @click="handleUpDownCol('down', index)"></el-button>
        </el-button-group>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
  export default {
    name: 'edit-columns',
    props: ['tableLabels'],
    components: {},
    mixins: [],
    data () {
      return {
        tableColumns: this.tableLabels,
        checkedList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      handleCheckChange (data) {
        for (let key of this.tableColumns) {
          let index = data.findIndex((item) => {
            return item === key.label
          })
          if (index != -1) {
            key.isActive = true
          } else {
            key.isActive = false
          }
        }
        this.$emit('refreshShowList', this.tableColumns)
      },

      handleUpDownCol (type, index) {
        if (type == 'up') {
          if (index === 0 || this.tableColumns[index - 1].template) {
            this.$message(`已经是第一列`)
            return
          }
          this.swapItems(this.tableColumns, index, index - 1)
        } else {
          if (index === this.tableColumns.length - 1 || this.tableColumns[index + 1].template) {
            this.$message(`已经是最后一列`)
            return
          }
          this.swapItems(this.tableColumns, index, index + 1)
        }
        this.$emit('refreshShowList', this.tableColumns)
      },
      swapItems (arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0]
        return arr
      }
    },
    created () {
    },
    mounted () {
      //  初始化多选框数据
      for (var i = 0; i < this.tableLabels.length; i++) {
        this.checkedList.push(this.tableLabels[i].label)
      }
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
  .edit-columns {
    .el-button-group {
      float: right;
      .el-button {
        padding: 4px;
        font-size: 14px;
      }
    }
    .el-checkbox-group {
      height: 190px;
      overflow-y: auto;
      .el-checkbox {
        display: block;
        .el-button-group {
          display: none;
          float: initial;
          position: absolute;
          right: 0px;
          top: 0px;
          z-index: 2;
        }
      }
      .el-checkbox:hover {
        .el-button-group {
          display: inline-block;
        }
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0px;
      }
    }
  }
</style>
