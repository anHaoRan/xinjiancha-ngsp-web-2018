<template>
  <div class="moreBox">
    <div class="moreTop">
      <div>
        <el-input class="searchBox"
                  v-model="searchContent"
                  placeholder="搜索关键字"
                  clearable
                  size="small"
                  @keydown.enter.native="searchKey">
          <el-button size="small" slot="append" icon="el-icon-search" @click="searchKey"></el-button>
        </el-input>
        <el-button icon='el-icon-close' type='text' size='middle' class="closebtn" @click="closeSelect"></el-button>
      </div>
    </div>
    <el-row class="moreMain">
      <el-col :span="6">
        <h3>叠加指数</h3>
        <div class="addListBox">
          <p @click="handleAddItem('index', item.code,item.name)" v-for="item in refreshComposeMeta.index"
             :key="item.code">{{ item.name
            }}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <h3>叠加板块</h3>
        <el-tree class="addListBox"
                 :data="refreshComposeMeta.vocation"
                 :props="addSpanProps"
                 @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="12">
        <h3>叠加股票</h3>
        <el-col :span="12">
          <el-tree class="addListBox"
                   :data="refreshComposeMeta.stock"
                   :props="addSpanProps"
                   @node-click="handleNodeClick2"></el-tree>
        </el-col>
        <el-col :span="12" class="stockLabel">
          <h3>股票</h3>
          <div class="addListBox2">
            <p @click="handleAddItem('stock', item.instrument_id,item.instrument_id+item.instrument_short)"
               v-for="item in addStock" :key="item.instrument_id">{{
              item.instrument_id +
              item.instrument_short}}</p>
          </div>
        </el-col>
      </el-col>
    </el-row>
    <div class="submitBtnBox">
      <el-button @click="showAddBox" type="primary">确定</el-button>
      <el-button @click="hideAddBox" type="info">取消</el-button>
    </div>
  </div>
</template>

<script>
  import {getComposeStock, getComposeMeta} from '@/service/marketSupervise/stockOperationMonitor/index'
  import {stockQuery} from '@/service/analysisTool/productQuery'

  export default {
    props: [],
    data() {
      return {
        refreshComposeMeta: [],
        searchContent: '',
        addStock: [],
        addSpanProps: {
          children: 'childrens',
          label: 'name'
        },
        addTags: [],
        chooseNum: 0,
        codeNameData: [],
        codeTypeObj: {}
      }
    },
    computed: {},
    methods: {
      closeSelect() {
        this.$emit('closeSelect')
      },
      handleAddItem(type, code, name) {
        this.codeTypeObj = {code, name, type}
        this.$emit('getCode', code, name, type)
      },
      handleClose(tag) {
        let tagIndex = this.addTags.indexOf(tag)
        this.addTags.splice(tagIndex, 1)
        this.codeNameData.splice(tagIndex, 1)
        this.chooseNum--
      },
      handleNodeClick(data) {
        if (!data.childrens) {
          this.handleAddItem('block', data.code, data.name)
        }
      },
      handleNodeClick2(data, node) {
        if (!data.childrens) {
          let nodeCode = node.parent.data.code
          if (nodeCode === 'index') {
            getComposeStock(data.code, data.name, '').then(resp => {
              if (resp.length) {
                this.addStock = resp
              } else {
                this.addStock = [{
                  instrument_id: '',
                  instrument_short: '暂无数据'
                }]
              }
            })
          } else {
            getComposeStock(nodeCode, data.name, '').then(resp => {
              if (resp.length) {
                this.addStock = resp
              } else {
                this.addStock = [{
                  instrument_id: '',
                  instrument_short: '暂无数据'
                }]
              }
            })
          }
        }
      },
      hideAddBox() {
        this.$emit('refreshIsShow', false)
      },
      showAddBox() {
        this.$emit('refreshAddItems', this.codeTypeObj)
      },
      getComposeStockFunc(code, name, key) {
        stockQuery(key, '', 1, 100).then(resp => {
          this.addStock = []
          if (resp.length !== 0) {
            resp.forEach((el) => {
              this.addStock.push({instrument_id: el.security_id, instrument_short: el.security_chn_short_name})
            })
          }
        })
      },
      searchKey() {
        this.getComposeStockFunc('', '', this.searchContent)
      }
    },
    mounted() {
      // 初始加载指数、板块、股票
      getComposeMeta().then(resp => {
        this.refreshComposeMeta = resp
      })
    }
  }
</script>

<style lang="less">
  .moreBox {
    width: 100%;
    background: rgba(15, 19, 69, 0.9);
    border-radius: 5px;
    .moreTop {
      margin: 20px;
      .searchBox {
        margin: 10px 0;
        width: 300px;
      }
      .moreNum {
        b {
          color: #fff;
        }
      }
      span {
        margin-right: 10px;
      }
    }
    .moreMain {
      text-align: center;
      border: 1px solid #455579;
      margin: 20px;
      .stockLabel {
        margin-top: -30px;
      }
    }
    .addListBox, .addListBox2 {
      overflow-y: scroll;
      p {
        margin: 0;
        padding: 8px 0;
      }
      p:hover {
        cursor: pointer;
        background-color: #1b2b4e;
      }
      p:focus {
        background-color: #fff;
      }
    }
    .addListBox {
      height: 180px;
    }
    .addListBox2 {
      height: 160px;
    }
    .submitBtnBox {
      text-align: center;
      margin-bottom: 20px;
    }
    .closebtn {
      float: right;
      margin-top: 5px;
      margin-right: 15px;
      border: none !important;
      color: #fff
    }
    .el-input-group__append {
      background-color: #121643;
      border: 1px solid #455579;
    }
  }

  .el-tree {
    background: transparent;
    color: #7b8fb9;
  }

  .el-tree-node__content:hover {
    background-color: #1b2b4e;
  }
</style>
