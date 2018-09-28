<!--tabs功能封装-->
<!--
***** @params
***** loading: 是否显示loading
***** activeName: 子级tabs的activeName
***** tabPanes: tab数组
***** paginations: 分页对象数组；包含currentPage和pageSizeNumber，长度等于子级tabs的长度
***** tableDatas: 表格数据数组，长度等于子级tabs的长度
***** tableColumns: 表头集合，长度等于子级tabs的长度
***** pageSizes: 每页显示个数选择器选项，【10,20,50,100】
***** paginationLayout: 分页组件布局，子组件名用逗号隔开
-->
<template>
  <div class="tabTablePaginationComponent">
    <el-tabs :type="tabsType" v-model="activeTabValue" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="(item, index) in tabPanes"
        v-if="item.show === undefined || item.show"
        :key="index"
        :label="item.label"
        :name="String(index)">
        <keep-alive>
          <div v-if="item.slotType && item.slotType === 'rewrite'">
            <slot :name="item.slotName"></slot>
          </div>
          <div v-else>
            <slot :name="item.slotName" v-if="item.slotType && item.slotType === 'prepend'"></slot>
            <common-table-pagination-component
              :loading="loading"
              :tableData="(Object.keys(tableDatas).length && tableDatas['tab' + (+activeTabValue + 1)]) ? tableDatas['tab' + (+activeTabValue + 1)]['data'] : []"
              :columns="tableColumns[activeTabValue]"
              :pagination="paginations[activeTabValue]"
              :totalNum="(Object.keys(tableDatas).length && tableDatas['tab' + (+activeTabValue + 1)]) ? Number(tableDatas['tab' + (+activeTabValue + 1)]['totalRowCount']) : 0"
              :pageSizes="pageSizes"
              :paginationLayout="paginationLayout"
              :showPagination="showPaginationList[0] === 'all' || showPaginationList[index] "
              @handleRowClick="handleRowClick"
              @handlePaginationChange="handlePaginationChange"
            ></common-table-pagination-component>
            <slot :name="item.slotName" v-if="item.slotType && item.slotType === 'append'"></slot>
          </div>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import pageination from '@/components/common/pageination'
  import commonTablePaginationComponent from './commonTablePaginationComponent'

  export default {
    components: {
      pageination,
      commonTablePaginationComponent
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      tabsType: {
        type: String,
        default: ''
      },
      activeName: {
        type: String,
        default: '0'
      },
      tabPanes: {
        type: Array,
        default () {
          return []
        }
      },
      paginations: {
        type: Array,
        default () {
          return []
        }
      },
      tableDatas: {
        type: Object,
        default () {
          return {}
        }
      },
      tableColumns: {
        type: Array,
        default () {
          return []
        }
      },
      pageSizes: {
        type: Array,
        default () {
          return [10, 20, 50, 100]
        }
      },
      showPaginationList: {
        type: Array,
        default () {
          return ['all']
        }
      },
      paginationLayout: {
        type: String,
        default: 'total, sizes, prev, pager, next'
      }
    },
    watch: {
      activeName (newValue) {
        this.activeTabValue = newValue
      }
    },
    data () {
      return {
        activeTabValue: '0'
      }
    },
    methods: {
      handleTabClick () {
        this.$emit('updateActiveName', this.activeTabValue)
      },
      handlePaginationChange (pagination) {
        let paginations = JSON.parse(JSON.stringify(this.paginations))
        paginations[this.activeTabValue] = pagination
        this.$emit('handlePaginationChange', paginations)
      },
      handleRowClick (row, event, column) {
        this.$emit('handleRowClick', row, event, column)
      },
      handleSelectionChange (selection) {
        this.$emit('handleSelectionChange', selection)
      },
      handleRowContextMenu (row, event) {
        this.$emit('handleRowContextMenu', row, event)
      },
      handleRowDbClick (row, event) {
        this.$emit('handleRowDbClick', row, event)
      }
    },
    mounted () {
    }
  }
</script>
<style lang="less" scoped>
  .tabTablePaginationComponent {
    min-width: 500px;
    /deep/ .el-tabs__content {
      margin-top: 20px;
    }
    /deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      padding-left: 0;
    }
    /deep/ .el-tabs--top .el-tabs__item.is-top:last-child {
      padding-right: 0;
    }
    /deep/ .el-tabs--card {
      /deep/ .el-tabs__item.is-top:nth-child(2) {
        padding-left: 20px !important;
      }
      /deep/ .el-tabs__item.is-top:last-child {
        padding-right: 20px !important;
      }
    }
  }
</style>
