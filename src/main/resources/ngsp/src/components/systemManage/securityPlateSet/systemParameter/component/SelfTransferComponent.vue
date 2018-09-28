
<template>
  <!--<div v-loading="loadingProps"
       class="checkbox-group-container"
       element-loading-spinner="el-icon-loading"
       element-loading-text="数据加载中，请耐心等待..."
       element-loading-background="rgba(0,0,0,0.3)">
    <el-checkbox-group v-model="checkingListComputed">
      <el-col v-for="(item, index) in transferDataListProps"
              :key="index">
        <el-checkbox :label="item.instrument_id">{{item.instrument_chn_short_name || item.instrument_short}}&nbsp;&nbsp;&nbsp;{{item.instrument_id}}</el-checkbox>
      </el-col>
    </el-checkbox-group>
  </div>-->
  <div class="customPlateSettingSelfTransferComponent">
    <el-table class="checkBoxComponent"
              ref="multipleTable"
              :emptyText="`${!Object.keys(currentSelectedTreeNode).length && type === 'left' ? '请先选择一个板块' : '暂无数据'}`"
              :data="transferDataListProps"
              border
              tooltip-effect="dark"
              height="350"
              size="small"
              highlight-current-row
              @selection-change="handleSelectionChange"
              v-loading="loadingProps"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)"
              style="width: 100%">
      <el-table-column width="40" type="selection"></el-table-column>
      <el-table-column label="证券代码和名称">
        <template slot-scope="scope">
          {{scope.row.instrument_chn_short_name || scope.row.instrument_short}}&nbsp;&nbsp;&nbsp;{{scope.row.instrument_id}}
        </template>
      </el-table-column>
    </el-table>
    <div class="totalNumber">共计{{transferDataListProps.length}}条记录</div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    checkingListProps: {
      type: Array,
      required: true
    },
    transferDataListProps: {
      type: Array,
      required: true
    },
    loadingProps: {
      type: Boolean,
      default: false
    },
    currentSelectedTreeNode: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      checkingListComputed: []
      // transferDataList: []
    }
  },
  watch: {
    checkingListProps(newValue) {
      this.checkingListComputed = newValue
    },
    checkingListComputed(newValue) {
      this.$emit('updateCheckingList', this.type, newValue)
    }
    /* transferDataListProps: {
      handler: (newValue) => {
        this.transferDataList = newValue
      },
      deep: true
    } */
  },
  methods: {
    handleSelectionChange(newValue) {
      this.$emit('updateCheckingList', this.type, newValue)
    }
  }
}
</script>
<style lang="less" scoped>
  .customPlateSettingSelfTransferComponent {
    .checkbox-group-container {
      width:100%;
      height:360px;
      overflow:auto;
      border: 1px solid #606266;
      padding-left: 20px;
      box-sizing: border-box;
      padding-top: 10px;
    }
    .totalNumber {
      font-size: 14px;
      text-align: right;
      padding: 15px;
    }
  }
</style>
