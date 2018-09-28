<!--
通用表格组件，动态传入列和数据
注意： el-table 中 style="overflow:auto;"  这个属性可能会导致table抖动，设置这个属性是为了横向滚动条
-->
<template>
  <div>
    <el-card class="dimension-query-area el-card-table">
      <div class="dimension-drilling-table-detail detail-drilling-selection-type">
        <el-row class="dimension-query-drilling-table-overflow">
          <el-col :span="24" style="width: 100%;">
            <el-table
              :data="tableData"
              :fit=true
              style="overflow:auto;"
              :height="heightNum == null ? null : heightNum"
              @selection-change="handleSelectionChange"
              v-loading="queryResLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.8)"
              border>
              <el-table-column v-if="showCheckboxes" type="selection" width="35"></el-table-column>
              <el-table-column
                v-for="column in columns"
                :show-overflow-tooltip="true"
                :key="column.id"
                v-if="column.show != false"
                :label="column.label"
                :prop="column.field"
                :formatter="column.formatter"
                :width="column.minWidth == null ? false: column.minWidth"
                :align="column.align == null ? 'center' : column.align">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    methods: {
      handleSelectionChange (val) {
        this.$emit('handleSelectionChange', val)
      }
    },
    props: {
      tableData: {
        type: Array
      },
      columns: {
        type: Array
      },
      heightNum: {},
      showCheckboxes: {
        type: Boolean
      },
      queryResLoading: {
        type: Boolean
      }
    }
  }
</script>

<style lang="less">
  .dimension-query-area {
    .dimension-drilling-table-detail {
      .dimension-query-drilling-table-overflow {
        padding-top: 0;
      }
    }
    .detail-drilling-selection-type {
      .el-table {
        .el-table__header-wrapper {
          overflow: visible;
        }
      }
    }
  }
</style>
