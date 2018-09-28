<!--面包屑组件-->
<template>
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item,index) in breadcrumbList"
        :to="{ path: item.router }"
        :key="index">{{item.label}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-popover
      ref="toolPopover"
      placement="bottom"
      width="150"
      trigger="click">
      <el-button type="primary" @click="toStockTradeQuery" size="small">账户证券交易查询</el-button>
      <br/><br/>
      <el-button type="primary" @click="toStockPositionQuery" size="small">账户证券持仓查询</el-button>
    </el-popover>
    <!-- <div class="widget" v-popover:toolPopover> -->
    <div class="widget">
      <span>工具</span>
      <i class="el-icon-arrow-down"></i>
    </div>
  </div>
</template>

<style scoped lang="less">
  .el-breadcrumb__item {
    /deep/ .el-breadcrumb__separator {
      color: #7b8fb9;
    }
  }
</style>

<script>
  export default {
    props: ['breadcrumbList'],
    data () {
      return {}
    },
    methods: {
      toStockTradeQuery () {
        this.$router.push({path: '/stockTradeQuery'})
      },
      toStockPositionQuery () {
        window.open('#/bench', 'newwindow', 'height=800, width=1080, toobar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
      }
    }
  }
</script>
