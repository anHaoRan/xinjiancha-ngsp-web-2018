<!--  数据查看 dataView-->
<template>
  <div class="dataView">
    <el-dialog title="数据查看" :visible.sync="showDialog" width="60%" left>
      <el-table ref="dataViewTable"
                max-height="350px"
                border
                :data="dataViewListProps"
                highlight-current-row
                v-loading="propsLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-text="数据加载中，请耐心等待..."
                element-loading-background="rgba(0,0,0,0.3)"
                style="width: 100%;">
        <el-table-column prop="watch_ob_name" sortable label="信息查看界面"></el-table-column>
      </el-table>
      <div class="dialog-footer">
        <el-button type="text" size="small" @click="showDialog=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'dataView',
    props: {
      dataViewListProps: {
        type: Array,
        default () {
          return []
        }
      },
      currentClickNodeObjProps: {
        type: Object,
        default () {
          return {}
        }
      },
      propsLoading: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      dataViewListProps (newValue) {
        this.dataViewList = newValue
      },
      currentClickNodeObjProps (newValue) {
        this.currentClickNodeObj = newValue
      }
    },
    components: {},
    data () {
      return {
        // 弹框
        showDialog: false,
        dataViewList: [],
        currentClickNodeObj: {}
      }
    },
    methods: {},
    created () {
    },
    mounted () {
    }
  }
</script>
<style lang="less" scoped>
  .dataView {
    .el-table {
      /deep/ .el-table__body-wrapper {
        max-height: 306px;
        overflow: auto;
      }
    }
    .dialog-footer {
      margin-top: 20px;
    }
  }
</style>
