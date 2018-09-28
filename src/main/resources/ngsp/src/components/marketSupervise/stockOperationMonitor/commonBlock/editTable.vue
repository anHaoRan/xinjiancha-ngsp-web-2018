<template>
  <el-card class="editTableBox">
    <div slot="header">
      <label>可见选项</label>
    </div>
    <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
    <el-checkbox-group v-model="checkedList" @change="handleCheckChange">
      <el-checkbox v-for="(item,index) in tableColumns" :label="item.label" :key="index">
        {{ item.label }}
        <el-button-group>
          <el-button type="primary" size="mini" icon="el-icon-sort-up" @click="handleUpDownCol('up', item.label)"></el-button>
          <el-button type="primary" size="mini" icon="el-icon-sort-down" @click="handleUpDownCol('down', item.label)"></el-button>
        </el-button-group>
      </el-checkbox>
    </el-checkbox-group>
  </el-card>
</template>

<script>
  export default {
    model: {
      prop: 'tableLabels',
      event: 'update'
    },
    props: ['tableLabels'],
    data () {
      return {
        tableColumns: this.tableLabels,
        checkedList: []
      }
    },
    computed: {},
    methods: {
      handleUpdate () {
        this.$emit('update', this.tableColumns)
      },
      handleCheckChange (data) {
        let newData = this.tableColumns
        for (let i = 0; i < newData.length; i++) {
          let flag = ''
          for (let j = 0; j < data.length; j++) {
            flag = false
            if (newData[i].label === data[j]) {
              newData[i].isShow = true
              flag = true
              break
            }
          }
          if (!flag) {
            newData[i].isShow = false
          }
        }
        Object.assign({}, this.tableColumns, newData)
        this.$emit('update', this.tableColumns)
        this.$emit('refreshShowList', this.tableColumns)
      },

      handleUpDownCol (type, label) {
        let newData = this.tableColumns
        for (let i = 0, len = newData.length; i < len; i++) {
          if (newData[i].label === label && newData[i].isShow) {
            if (type === 'up') {
              if (i === 0) {
                this.$message('“' + label + '”已经是第一列')
              } else {
                [newData[i - 1], newData[i]] = [newData[i], newData[i - 1]]
              }
              console.log('---前--', newData)
            } else {
              if (i === len - 1) {
                this.$message('“' + label + '”已经是最后一列')
              } else {
                [newData[i], newData[i + 1]] = [newData[i + 1], newData[i]]
              }
              console.log('---后--', newData)
              break
            }
          }
        }
        Object.assign({}, this.tableColumns, newData)
        this.$emit('update', this.tableColumns)
        this.$emit('refreshShowList', this.tableColumns)
      }
    },
    mounted () {
      // 初始化多选框数据
      for (let i = 0; i < this.tableLabels.length; i++) {
        this.checkedList.push(this.tableLabels[i].label)
      }
    }
  }
</script>

<style lang="less">
  .editTableBox {
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
          right: 0;
          top: 0;
          z-index: 2;
        }
      }
      .el-checkbox:hover {
        .el-button-group {
          display: inline-block;
        }
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
    }
  }
</style>
