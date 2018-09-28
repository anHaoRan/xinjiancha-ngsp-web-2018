//  isHeader：     是否显示容器的头部         默认true            Boolean
//  headerTitle：  容器的头部的提示文件       默认‘查询结果’    String
//  elCardHeader： 容器的头部插槽
//  height：       表格的最大高度             默认480             Number
//  columns：      表格的列定义数组           默认[]              Array
//  data：         表格的数据和分页总数       默认{data: [],total: 0,pageRows:10,pageIndex:1}       Object
//  pageSizes：    分页的显示多少内容         默认 [10, 20, 50, 100]   Array
//  isPageination：是否显示分页组件           默认true            Boolean
//  pageinationPos: 分页对齐方向              默认center          String
//  isEditTable:    表格列编辑                默认false           Boolean      列编辑不支持列定义中间存在template
//  rowClassName:  同element   table-attributes
//  cellClassName:  同element   table-attributes
//  loading:        是否显示loading           默认false           Boolean
//  uniqueKey:      唯一键，为了保存分页记录状态
//  tableLoadMore:  是否懒加载只有当isPageination=false才生效                默认false           Boolean
//  show-summary:   同element 是否在表尾显示合计行           默认false           Boolean
//  summaryMethod  同element  Function({colnums, data})
//  isExport:   是否显示导出           默认false           Boolean

//  table event
//  getPageination    分页  （{pageSizeNumber,currentPage}）   currentPage当前选中页   pageSizeNumber当前选中的条数
//  selection-change  同element   table-event
//  row-click         同element   table-event
//  handleRowContextMenu  同element   table-event
//  handleRowDbClick  同element   table-event
//  select            同element   table-event
//  select-all        同element   table-event
//  current-change    同element   table-event
//  handlerChange     自定义列的改变事件
//  getExport         导出

//  table methods
//  showOrHideLoading 用于显示隐藏loading      参数Boolean
<template>
  <div class="s-table">
    <el-card class="el-card-table">
      <div slot="header" class="clearfix" v-if="isHeader">
        <span>{{headerTitle}}</span>
        <slot name="elCardHeader"></slot>
        <el-button type="info" size="small" @click="showExport" v-if="isExport">导出</el-button>
        <el-popover
          ref="editTablePop"
          placement="bottom"
          width="200"
          v-model="editTableVisible">
          <edit-columns :tableLabels="newColumns" @refreshShowList="refreshShowListFunc"></edit-columns>
        </el-popover>
        <el-button class="editTableBtn" type="primary" icon="el-icon-tickets" size="small" v-if="dealWithIsEditTable"
                   v-popover:editTablePop></el-button>
        <!--<el-dropdown @command="handleToolBox">-->
        <!--<el-button type="info" size="small">-->
        <!--工具箱<i class="el-icon-arrow-down el-icon-right"></i>-->
        <!--</el-button>-->
        <!--<el-dropdown-menu slot="dropdown">-->
        <!--<el-dropdown-item command="chart">-->
        <!--<i class="el-icon-picture"></i>转为图表-->
        <!--</el-dropdown-item>-->
        <!--<el-dropdown-item command="table">-->
        <!--<i class="el-icon-tickets"></i>转为表格-->
        <!--</el-dropdown-item>-->
        <!--</el-dropdown-menu>-->
        <!--</el-dropdown>-->
      </div>
      <div class="margin-table">
        <slot name="tableHeader"></slot>
        <el-table
          border
          ref="marginTable"
          :data="newData"
          :height="height"
          v-loading="dealWithIsLoading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)"
          :row-class-name="rowClassName"
          :cell-class-name="cellClassName"
          v-tableLoadMore="handleTableLoadMore"
          :show-summary="showSummary"
          :summary-method="summaryMethod"
          @select="handleSelectedRow"
          @select-all="handleSelectedAllRow"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          @row-contextmenu="handleRowContextMenu"
          @row-dblclick="handleRowDbClick"
          @current-change="handleCurrentChange"
          style="width: 100%; overflow:visible">
          <slot name="tableColumnsUnshift"></slot>
          <s-table-columns v-for="(item,index) in newColumns"
                           :key="index"
                           :item="item"
                           :otherProps="otherProps"
                           @handlerChange="handlerChange"
          />
          <slot name="tableColumnsPush"></slot>
        </el-table>
        <el-row>
          <el-col :span="24">
            <pageination :style="{'text-align': pageinationPos}" :pageTotal="pageTotal" :pageSizes="pageSizes"
                         @getPageination="getPageination"
                         :paginationProps="{pageSizeNumber:pageRows,currentPage:pageIndex}"
                         v-if="isPageination"></pageination>
          </el-col>
        </el-row>
        <slot name="tableFooter"></slot>
      </div>
    </el-card>
    <column-editing-export ref="columnEditingExport" :columns="refreshColumns"
                           :pageinationVal="{ pageIndex:pageIndex,pageRows:pageRows,pageTotal:pageTotal}"
                           @getExport="handlerExport"/>
  </div>
</template>

<script>
  export default {
    name: 's-table',
    props: {
      columns: {
        type: Array,
        required: true
      },
      data: {
        type: Object,
        default() {
          return {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          }
        }
      },
      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 50, 100]
        }
      },
      isPageination: {
        type: Boolean,
        default() {
          return true
        }
      },
      height: {
        type: [Number, String],
        default() {
          return 480
        }
      },
      headerTitle: {
        type: String,
        default() {
          return '查询结果'
        }
      },
      isHeader: {
        type: Boolean,
        default() {
          return true
        }
      },
      pageinationPos: {
        type: String,
        default() {
          return 'center'
        }
      },
      isEditTable: {
        type: Boolean,
        default() {
          return false
        }
      },
      rowClassName: [String, Function],
      cellClassName: [String, Function],
      summaryMethod: Function,
      showSummary: {
        type: Boolean,
        default() {
          return false
        }
      },
      loading: {
        type: Boolean,
        default() {
          return false
        }
      },
      tableLoadMore: {
        type: Boolean,
        default() {
          return false
        }
      },
      isExport: {
        type: Boolean,
        default() {
          return false
        }
      },
      uniqueKey: String,
      otherProps: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    components: {
      Pageination: () => import('@/components/common/pageination'), // 分页组件引入
      STableColumns: () => import('@/components/base/STableColumns'), // 表格列
      EditColumns: () => import('./MarginComponents/EditColumns'),
      ColumnEditingExport: () => import('@/components/base/ColumnEditingExport')
    },
    mixins: [],
    data() {
      return {
        isLoading: false,
        editTableVisible: false,
        refreshColumns: [],
        dealWithIsEditTable: this.isEditTable,
        multipleSelection: [],
        allMultipleSelection: []
      }
    },
    computed: {
      newColumns() {
        let columnsArr = []
        for (let key of this.refreshColumns) {
          if (key.isActive === undefined || key.isActive) {
            key.isActive = true
            columnsArr.push(key)
          }
        }
        return columnsArr
      },
      newData() {
        return this.data.data
      },
      pageTotal() {
        return Number(this.data.total)
      },
      pageIndex() {
        return Number(this.data.pageIndex)
      },
      pageRows() {
        return Number(this.data.pageRows)
      },
      dealWithIsLoading: {
        get() {
          return this.isLoading
        },
        set(bool) {
          this.isLoading = bool
        }
      }
    },
    watch: {
      loading: {
        handler() {
          this.isLoading = this.loading
        },
        immediate: true
      },
      columns: {
        handler() {
          this.refreshColumns = this.columns
        },
        immediate: true,
        deep: true
      },
      isEditTable: {
        handler() {
          for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].template && i > 0 && i < this.columns.length - 1) {
              this.dealWithIsEditTable = false
            }
          }
        },
        immediate: true
      },
      newData: {
        handler() {
          if (this.isPageination && this.uniqueKey) {
            for (let key of this.allMultipleSelection) {
              let index = this.newData.findIndex(item => {
                return item[this.uniqueKey] === key[this.uniqueKey]
              })
              if (index != -1) {
                this.$nextTick(function () {
                  this.$refs.marginTable.toggleRowSelection(this.newData[index])
                })
              }
            }
          }
          //  如果页数不等于1且内容为空时 翻到上一页
          if (this.pageIndex != 1 && this.newData.length < 1) {
            this.getPageination({pageSizeNumber: this.pageRows, currentPage: this.pageIndex - 1})
          }
        },
        deep: true
      }
    },
    methods: {
      refreshShowListFunc(data) { // 测试列表设置弹框,上移，下移
        let [...arr] = data
        this.refreshColumns = arr
      },
      handleToolBox(menu) {
      },
      getPageination(pageinationVal) {
        if (this.isPageination && this.uniqueKey) {
          for (let key of this.multipleSelection) {
            let index = this.allMultipleSelection.findIndex(item => {
              return item[this.uniqueKey] === key[this.uniqueKey]
            })
            if (index == -1) {
              this.allMultipleSelection.push(key)
            }
          }
        }
        this.$emit('getPageination', pageinationVal)
      },
      handleTableLoadMore() {
        if (this.tableLoadMore && !this.isPageination) {
          this.$emit('getPageination', {pageSizeNumber: this.pageRows, currentPage: this.pageIndex + 1})
        }
      },
      showOrHideLoading(flag) {
        this.dealWithIsLoading = flag
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.$emit('selection-change', val)
      },
      handleRowClick(row, event, column) {
        this.$emit('row-click', row, event, column)
      },
      handleRowContextMenu(row, event) {
        this.$emit('handleRowContextMenu', row, event)
      },
      handleRowDbClick(row, event) {
        this.$emit('handleRowDbClick', row, event)
      },
      handleSelectedRow(selection, row) {
        this.$emit('select', selection, row)
      },
      handleSelectedAllRow(selection) {
        this.$emit('select-all', selection)
      },
      handlerChange(val) {
        this.$emit('handlerChange', val)
      },
      handleCurrentChange(val1, val2) {
        this.$emit('current-change', val1, val2)
      },
      handlerExport(val) {
        this.$emit('getExport', val)
      },
      showExport() {
        this.$refs.columnEditingExport.showDialog()
      }
    },
    created() {
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  .s-table {
  }
</style>
