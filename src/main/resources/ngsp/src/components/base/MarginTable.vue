<template>
    <div class="margin-table">
        <slot name="tableHeader"></slot>
        <el-table
                border
                ref="marginTable"
                :data="newData"
                :height="height"
                :show-header="showHeader"
                v-loading="dealWithIsLoading"
                element-loading-text="数据加载中，请耐心等待..."
                element-loading-background="rgba(0,0,0,0.3)"
                :row-class-name="rowClassName"
                :cell-class-name="cellClassName"
                v-tableLoadMore="handleTableLoadMore"
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
</template>

<script>
  export default {
    name: 'margin-table',
    props: {
      columns: {
        type: Array,
        required: true
      },
      data: {
        type: Object,
        default () {
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
        default () {
          return [10, 20, 50, 100]
        }
      },
      isPageination: {
        type: Boolean,
        default () {
          return true
        }
      },
      showHeader: {
        type: Boolean,
        default () {
          return true
        }
      },
      height: {
        type: [Number, String],
        default () {
          return 480
        }
      },
      pageinationPos: {
        type: String,
        default () {
          return 'center'
        }
      },
      rowClassName: [String, Function],
      cellClassName: [String, Function],
      loading: {
        type: Boolean,
        default () {
          return false
        }
      },
      tableLoadMore: {
        type: Boolean,
        default () {
          return false
        }
      },
      uniqueKey: String,
      otherProps: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    components: {
      Pageination: () => import('@/components/common/pageination'), // 分页组件引入
      STableColumns: () => import('@/components/base/STableColumns') //  表格列
    },
    mixins: [],
    data () {
      return {
        isLoading: false,
        newColumns: []
      }
    },
    computed: {
      // newColumns() {
      //   let columnsArr = []
      //   for (let key of this.refreshColumns) {
      //     if (key.isActive === undefined || key.isActive) {
      //       key.isActive = true
      //       columnsArr.push(key)
      //     }
      //   }
      //   return columnsArr
      // },
      newData () {
        return this.data.data
      },
      pageTotal () {
        return Number(this.data.total)
      },
      pageIndex () {
        return Number(this.data.pageIndex)
      },
      pageRows () {
        return Number(this.data.pageRows)
      },
      dealWithIsLoading: {
        get () {
          return this.isLoading
        },
        set (bool) {
          this.isLoading = bool
        }
      }
    },
    watch: {
      loading: {
        handler () {
          this.isLoading = this.loading
        },
        immediate: true
      },
      columns: {
        handler (newValue) {
          let columnsArr = []
          for (let key of newValue) {
            if (key.isActive === undefined || key.isActive) {
              key.isActive = true
              columnsArr.push(key)
            }
          }
          this.newColumns = columnsArr
        },
        immediate: true,
        deep: true
      },
      newData: {
        handler () {
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
      getPageination (pageinationVal) {
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
      handleTableLoadMore () {
        if (this.tableLoadMore && !this.isPageination) {
          this.$emit('getPageination', {pageSizeNumber: this.pageRows, currentPage: this.pageIndex + 1})
        }
      },
      showOrHideLoading (flag) {
        this.dealWithIsLoading = flag
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
        this.$emit('selection-change', val)
      },
      handleRowClick (row, event, column) {
        this.$emit('row-click', row, event, column)
      },
      handleRowContextMenu (row, event) {
        this.$emit('handleRowContextMenu', row, event)
      },
      handleRowDbClick (row, event) {
        this.$emit('handleRowDbClick', row, event)
      },
      handleSelectedRow (selection, row) {
        this.$emit('select', selection, row)
      },
      handleSelectedAllRow (selection) {
        this.$emit('select-all', selection)
      },
      handlerChange (val) {
        this.$emit('handlerChange', val)
      },
      handleCurrentChange (val1, val2) {
        this.$emit('current-change', val1, val2)
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
    .margin-table {
    }
</style>
