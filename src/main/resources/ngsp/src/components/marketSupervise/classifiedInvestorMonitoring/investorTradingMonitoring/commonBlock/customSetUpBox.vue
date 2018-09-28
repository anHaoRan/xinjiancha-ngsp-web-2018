<template>
  <el-row :gutter="20" class="customBox">
    <el-col :span="7">
      <h4>自定义板块</h4>
      <el-input class="addBlockBox" size="mini" v-model="addBlockInput" clearable></el-input>
      <el-button type="primary" size="small" @click="handleAddBlock">新建</el-button>
      <!--修改对话框-->
      <el-dialog width="20%" title="修改自定义板块" :visible.sync="isEditBlockBox" append-to-body>
        <el-input :placeholder="thisBlock" size="mini" v-model="editBlockInput" clearable></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isEditBlockBox = false">取消</el-button>
            <el-button type="primary" @click="handleEditBlock">确定</el-button>
          </span>
      </el-dialog>
      <!--删除对话框-->
      <el-dialog width="20%" title="删除自定义板块" :visible.sync="isDeleteBlockBox" append-to-body>
        <span>确认删除&nbsp;{{ thisBlock }}&nbsp;吗？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isDeleteBlockBox = false">取消</el-button>
            <el-button type="primary" @click="handleDeleteBlock">确定</el-button>
          </span>
      </el-dialog>
      <!--手动选择对话框-->
      <el-dialog width="50%" title="手动选择" :visible.sync="isChooseStockBox" append-to-body>
        <handChooseBox></handChooseBox>
      </el-dialog>
      <el-card>
        <div v-for="item in blockList" :key="item">
          {{ item }}
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditBlockPop(item)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="showDeleteBlockPop(item)"></el-button>
          </el-button-group>
        </div>
      </el-card>
    </el-col>
    <el-col :span="17" class="rightBox">
      <h4>我的自选股</h4>
      <el-button type="primary" size="small" @click="showChooseStockPop">手动选择</el-button>
      <el-upload class="uploadBtn" action="">
        <el-button type="primary" size="small">文件导入</el-button>
      </el-upload>
      <el-button type="primary" size="small">模板下载</el-button>
      <el-button type="text" @click="handleEmptyStock">清空</el-button>
      <el-card>
        <div slot="header">
          <label>输入证券代码</label>
          <el-input size="mini" v-model="stockCodeInput" clearable></el-input>
          <el-button class="addStockBtn" type="primary" size="mini" icon="el-icon-plus" @click="handleAddStock"></el-button>
        </div>
        <el-tag :key="tag" v-for="tag in stockCodeTags" closable @close="handleClose(tag)">
          {{tag}}
        </el-tag>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import handChooseBox from './handChooseBox'

  export default {
    props: [],
    components: {
      handChooseBox
    },
    data () {
      return {
        stockCodeInput: '',
        stockCodeTags: ['6000000.SH 浦发银行', '6000000.SH 浦发银行11', '6000000.SH 浦发银行22', '6000000.SH 浦发银行33', '6000000.SH 浦发银行44', '6000000.SH 浦发银行55'],
        blockList: [],
        addBlockInput: '',
        isDeleteBlockBox: false,
        isEditBlockBox: false,
        thisBlock: '',
        editBlockInput: '',
        isChooseStockBox: false
      }
    },
    computed: {},
    methods: {
      // 数组避免重复添加对象
      pushSingel (array, input) {
        if (!input) {
          this.$message.error('不能创建空对象！')
        } else {
          if (!array.length) {
            array.push(input)
          } else {
            let flag = ''
            for (let i = 0; i < array.length; i++) {
              flag = false
              if (array[i] === input) {
                flag = true
                this.$message.error('不能重复创建！')
                break
              }
            }
            if (!flag) {
              array.push(input)
            }
          }
        }
      },
      handleClose (tag) {
        this.stockCodeTags.splice(this.stockCodeTags.indexOf(tag), 1)
      },
      handleAddBlock () {
        this.pushSingel(this.blockList, this.addBlockInput)
      },
      handleDeleteBlock () {
        this.blockList.splice(this.blockList.indexOf(this.thisBlock), 1)
        this.isDeleteBlockBox = false
      },
      showDeleteBlockPop (block) {
        this.thisBlock = block
        this.isDeleteBlockBox = true
      },
      showEditBlockPop (block) {
        this.thisBlock = block
        this.editBlockInput = ''
        this.isEditBlockBox = true
      },
      handleEditBlock () {
        this.blockList.splice(this.blockList.indexOf(this.thisBlock), 1, this.editBlockInput)
        this.isEditBlockBox = false
      },
      showChooseStockPop () {
        this.isChooseStockBox = true
      },
      handleEmptyStock () {
        this.stockCodeTags.splice(0, this.stockCodeTags.length)
      },
      handleAddStock () {
        this.pushSingel(this.stockCodeTags, this.stockCodeInput)
      }
    },
    mounted () {
    }
  }
</script>

<style lang="less" scoped>
  .customBox {
    h4 {
      margin: 0;
      margin-bottom: 10px;
    }
    .el-card {
      margin-top: 10px !important;
      .el-card__header {
        height: 50px;
        line-height: 50px;
        label {
          font-size: 14px;
        }
        .el-input {
          width: 200px;
          margin-left: 10px;
        }
      }
      .el-card__body {
        padding: 0 !important;
        height: 500px;
        overflow-y: scroll;
        div {
          padding: 5px 10px;
          position: relative;
          .el-button-group {
            display: none;
            position: absolute;
            top: 0;
            right: 0;
            z-index: 2;
            .el-button {
              background: transparent;
              padding: 4px 5px;
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
        div:hover {
          background-color: #1b5eed;
          color: #fff;
          .el-button-group {
            display: block;
          }
        }
      }
    }
    .rightBox {
      .el-button--text {
        float: right;
      }
      .el-card__body {
        padding: 10px 2% !important;
        height: 430px;
        .el-tag {
          width: 29%;
          margin: 5px 2%;
          position: relative;
          .el-icon-close {
            position: absolute;
            top: 6px;
            right: 6px;
          }
        }
      }
      .uploadBtn {
        display: inline-block;
        margin: 0 10px;
      }
      .el-upload-list {
        display: none;
      }
      .addStockBtn {
        float: initial !important;
      }
    }
    .addBlockBox {
      width: 70%;
    }
  }
</style>
