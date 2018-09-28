<template>
  <el-table
    v-loading="loading"
    element-loading-text="数据加载中，请耐心等待..."
    element-loading-background="rgba(0,0,0,0.3)"
    style="margin-top:10px;"
    :height="235"
    :data="tableData"
    ref="multipleTable"
    @selection-change="handleSelectionChange"
    :fit=true
    border>
    <el-table-column
      type="selection"
      align="center"
      width="50"
      v-if="showSelection"
    ></el-table-column>
    <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label" :prop="item.field" show-overflow-tooltip>
      <template slot-scope="scope">
        <div v-if="propsType">
          <!--<el-input :disabled="disabled" v-model="scope.row[item.field]" :placeholder="`回车搜索${placeholderMap[propsType]}信息`" size="small"
                    :maxlength="10"
                    v-if="item.isTemplate && !disabled"
                    @keyup.enter.native="searchInfo(scope.$index,scope.row)"></el-input>-->
          <span v-if="item.isTemplate && !disabled">{{scope.row[item.field]}}</span>
          <a class="link-common-css" v-else-if="item.isTemplate && disabled" @click="gotoDetailPage(scope)">{{scope.row[item.field]}}</a>
          <span v-else>{{scope.row[item.field]}}</span>
        </div>
        <div v-else>
          <!--<el-input :disabled="disabled" v-model="scope.row[item.field]" :placeholder="`回车搜索${placeholderMap[propsType]}信息`" size="small"
                    :maxlength="10"
                    v-if="item.isTemplate"
                    @keyup.enter.native="searchInfo(scope.$index,scope.row)"></el-input>-->
          <span v-if="item.isTemplate">{{scope.row[item.field]}}</span>
          <span v-else>{{scope.row[item.field]}}</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      },
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      showSelection: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      propsType: {
        type: [Number, String],
        default: 0
      }
    },
    data() {
      return {
        editFieldMap: ['accountCode', 'monitorSecurityNo', 'groupNo'],
        placeholderMap: ['账户', '重点监控证券', '重点监控账户组'],
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.$emit('handleSelectionChange', val)
      },
      searchInfo(index, row) {
        if (!row[this.editFieldMap[this.propsType]]) {
          this.$message.error(`请输入${this.placeholderMap[this.propsType]}代码！`)
          return
        }
        let reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(row[this.editFieldMap[this.propsType]])) {
          this.$message.error('只能输入数字和字母！')
          return
        }
        this.$emit('searchInfo', row[this.editFieldMap[this.propsType]])
      },
      gotoDetailPage(scope) {
        if (scope.row.infoIdMsc) {
          window.open(`#/overMonitorSecurity?operate=1&instanceId=${scope.row.infoIdMsc}&isNewTab=true`)
        } else if (scope.row.infoIdMag) {
          window.open(`#/overBuiltAccountGroup?operate=1&instanceId=${scope.row.infoIdMag}&isNewTab=true`)
        }
      }
    }
  }
</script>
