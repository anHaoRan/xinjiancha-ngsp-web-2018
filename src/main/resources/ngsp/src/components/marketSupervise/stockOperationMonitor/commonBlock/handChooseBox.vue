<template>
  <div class="handChooseBox">
    <el-row :gutter="20">
      <el-col :span="16">
        <label>待选成分</label>
      </el-col>
      <el-col :span="8">
        <label>已选成分</label>
        <el-button type="primary" size="mini" class="clearBtn" @click="clearStock">清空</el-button>
      </el-col>
    </el-row>
    <el-row class="mainBox">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <el-input placeholder="搜索关键字" size="mini" v-model="stockSearchInput" clearable></el-input>
            <el-button type="primary" size="mini" icon="el-icon-search"></el-button>
          </div>
          <el-tree class="" :data="addSpan" :props="addSpanProps" node-key="id" :default-expanded-keys="[1]" highlight-current @node-click="handleNodeClick"></el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-transfer :titles="['待选','已选']" v-model="stockTransferValue" :data="stockTransferData"></el-transfer>
      </el-col>
    </el-row>
    <div class="footerBtn">
      <el-button type="primary" @click="saveBox">保存</el-button>
      <el-button @click="cancelBox">取消</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    props: [],
    data () {
      const generateData = _ => {
        const data = []
        for (let i = 1; i <= 20; i++) {
          data.push({
            key: i,
            label: `备选项${i}`,
            disabled: i % 4 === 0
          })
        }
        return data
      }
      return {
        stockSearchInput: '',
        addSpan: [
          {
            id: 1,
            label: 'wind概念板块',
            children: [
              {
                id: 7,
                label: '保险'
              },
              {label: '银行'}
            ]
          },
          {
            id: 2,
            label: 'wind概念板块',
            children: [
              {label: '保险'},
              {label: '银行'}
            ]
          },
          {
            id: 3,
            label: 'wind概念板块',
            children: [
              {label: '保险'},
              {label: '银行'}
            ]
          },
          {
            id: 4,
            label: 'wind概念板块',
            children: [
              {label: '保险'},
              {label: '银行'}
            ]
          },
          {
            id: 5,
            label: 'wind概念板块',
            children: [
              {label: '保险'},
              {label: '银行'}
            ]
          },
          {
            id: 6,
            label: 'wind概念板块',
            children: [
              {label: '保险'},
              {label: '银行'}
            ]
          }
        ],
        addSpanProps: {
          children: 'children',
          label: 'label'
        },
        stockTransferData: generateData(),
        stockTransferValue: [1, 4]
      }
    },
    computed: {},
    methods: {
      handleNodeClick (obj) {
        if (!obj.children) {
          console.log('nodeoBJ:', obj.label)
          this.stockTransferData = [{
            key: 1,
            label: obj.label + 1
          }]
        }
      },
      clearStock () {
        // console.log("stockTransferValue:",this.stockTransferValue);
        this.stockTransferValue = []
      },
      cancelBox () {
        this.$emit('refreshCancelBox', false)
      },
      saveBox () {
        this.$emit('refreshSaveBox', this.stockTransferValue)
      }
    },
    mounted () { }
  }
</script>

<style lang="less">
  .handChooseBox {
    .clearBtn {
      float: right;
    }
    .mainBox {
      margin-top: 10px;
      .el-input {
        width: 80%;
      }
      .el-card__body {
        height: 360px;
        overflow-y: scroll;
      }
      .el-transfer-panel {
        width: 45%;
      }
      .el-transfer-panel__body {
        height: 427px;
      }
      .el-transfer-panel__list {
        height: 427px;
      }
      .el-transfer__buttons {
        padding: 0 2%;
      }
    }
    .footerBtn {
      text-align: center;
      margin-top: 10px;
    }
  }
</style>
