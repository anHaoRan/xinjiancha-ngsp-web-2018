<template>
  <div class="treeSelect" v-show="treeShow">
    <el-tree
      :data="treeData"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      ref="treeData"
    >
    </el-tree>
    <div class="check-btn">
      <el-button size="mini" type="primary" @click="submit">确定</el-button>
      <el-button size="mini" type="info" @click="cancel">清空</el-button>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'account-group',
    props: {
      treeShow: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      treeData: {
        type: Array,
        default: function () {
          return [
            {
              id: 1,
              label: '一级1',
              children: [
                {
                  id: 4,
                  label: '二级1-1'
                },
                {
                  id: 5,
                  label: '二级1-2'
                }
              ]
            },
            {
              id: 2,
              label: '一级2',
              children: [
                {
                  id: 3,
                  label: '二级2-1'
                },
                {
                  id: 6,
                  label: '二级2-2'
                }
              ]
            },
            {
              id: 7,
              label: '一级3',
              children: [
                {
                  id: 8,
                  label: '二级3-1'
                },
                {
                  id: 9,
                  label: '二级3-2'
                }
              ]
            }
          ]
        }
      }
    }, // 父组件传递的下拉选项
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        defaultChecked: []
      }
    },
    watch: {},
    methods: {
      // 确定
      submit() {
        this.$emit('getTreeList', this.$refs.treeData.getCheckedKeys(true))
      },
      // 取消
      cancel() {
        this.$emit('getTreeList', this.$refs.treeData.setCheckedKeys([], true))
      }
    }
  }
</script>

<style lang="less">
  .treeSelect {
    .check-btn {
      text-align: center;
    }
    background-color: #1a284b;
    .el-tree {
      background-color: transparent;
      color: #7b8fb9;
    }
    .el-tree-node:focus > .el-tree-node__content {
      background-color: transparent;
    }
    .el-tree-node__content:hover {
      background-color: transparent;
    }
    min-width: 350px;
    position: absolute;
    z-index: 5;
  }
</style>
