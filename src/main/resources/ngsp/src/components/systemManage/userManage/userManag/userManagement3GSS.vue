<!--  3GSS userManagement3GSS-->
<template>
  <div class="userManagement3GSS">
    <el-card class="el-card-table">
      <div slot="header">
        <span>用户管理&nbsp;&nbsp;</span>
        <el-tag type="primary" size="small" v-if="currentClickNodeObj.username && !currentClickNodeObj.children">
          {{currentClickNodeObj.username || ''}}
        </el-tag>
      </div>
      <el-table
        :data="tableData"
        ref="tableRef"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          v-for="column in columns"
          :show-overflow-tooltip="true"
          :key="column.field"
          :label="column.label"
          :prop="column.field"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align == null ? 'center' : column.align"
          :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
        >
        </el-table-column>
      </el-table>
      <div class="btn-group">
        <el-button type="primary" size="small" @click="showDataViewDialog">数据查看</el-button>
        <el-button type="primary" size="small" @click="showAllocationDataDialog">分配数据</el-button>
        <!--<el-button type="text" size="small">删除</el-button>-->
      </div>
      <data-view
        ref="dataViewRef"
        :propsLoading="loading"
        :currentClickNodeObjProps="currentClickNodeObj"
        :dataViewListProps="dataViewList"></data-view>
      <allocation-data
        ref="allocationDataRef"
        :currentClickNodeObjProps="currentClickNodeObj"
      ></allocation-data>
    </el-card>

  </div>
</template>
<script>
  import {
    getCreateParamData
  } from '@/service/systemManage/securityPlateSet'
  import DataView from './dataView' // 数据查看
  import AllocationData from './allocationData' // 分配数据

  export default {
    name: 'userManagement3GSS',
    props: {
      currentClickNodeObjProps: {
        type: Object,
        default () {
          return {}
        }
      },
      dataViewListProps: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      DataView,
      AllocationData
    },
    data () {
      return {
        loading: true,
        currentClickNodeObj: {},
        dataViewList: [],
        columns: [
          {label: '属性名称', field: 'name', align: 'center'},
          {label: '属性值', field: 'value', align: 'center'}
        ],
        tableData: [
          {
            name: '账号',
            value: ''
          },
          {
            name: '全名',
            value: ''
          },
          {
            name: '组别',
            value: ''
          },
          {
            name: '角色',
            value: ''
          }
        ]
      }
    },
    methods: {
      getDataViewList (item) {
        let params = {
          userName: item.usercode || ''
        }
        this.loading = true
        getCreateParamData(params).then((resp) => {
          this.loading = false
          if (resp) {
            this.dataViewList = resp.buzidata
          }
        })
      },
      showDataViewDialog () {
        if (Object.keys(this.currentClickNodeObj).length === 0) {
          this.$message.error('请选择一个用户')
          return
        }
        this.$nextTick(() => {
          this.$refs['dataViewRef'].showDialog = true
          this.getDataViewList(this.currentClickNodeObj)
        })
      },
      showAllocationDataDialog () {
        if (Object.keys(this.currentClickNodeObj).length === 0) {
          this.$message.error('请选择一个用户')
          return
        }
        this.$nextTick(() => {
          this.$refs['allocationDataRef'].showDialog = true
          this.$refs['allocationDataRef'].leftAjaxFn()
          this.$refs['allocationDataRef'].rightAjaxFn()
        })
      }
    },
    watch: {
      currentClickNodeObjProps (newValue) {
        this.currentClickNodeObj = newValue
        let temp = [newValue.usercode, newValue.username, newValue.usergroup, newValue.userrole]
        temp.forEach((item, index) => {
          this.tableData[index]['value'] = item || ''
        })
      },
      dataViewListProps (newValue) {
        this.dataViewList = newValue
      }
    },
    created () {
    },
    mounted () {
    }
  }
</script>
<style lang="less" scoped>
  .userManagement3GSS {
    .btn-group {
      text-align: right;
      margin: 10px;
    }
  }
</style>
