<template>
  <div class="online-user-view">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card class="table-card" style="padding-top:20px;">
      <el-table
        :data="onlineUserList"
        ref="tableRef"
        border
        tooltip-effect="dark"
        height="350"
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
          :sortable="column.sortable == null ? false : column.sortable">
          :sort-method="column.sortMethod"
        </el-table-column>
        <el-table-column label="当前所在系统" align="center">
          <template slot-scope="scope">
            新市场监察系统
          </template>
        </el-table-column>
      </el-table>
      <div class="totalNumber">
        共计{{onlineUserList.length}}条记录
      </div>
      <!--<pagination-component
        :pageTotal="totalCount"
        @getPageination="getPageination"
      ></pagination-component>-->
    </el-card>
  </div>
</template>
<script>
  import breadcrumb from '@/components/common/Breadcrumb'
  import paginationComponent from '@/components/common/pageination'
  import {
    getOnlineUserList
  } from '@/service/systemManage/otherManage'

  export default {
    components: {
      paginationComponent,
      breadcrumb
    },
    props: {},
    data () {
      return {
        onlineUserList: [],
        breadcrumbItems: [
          {
            router: '/onlineUserView',
            label: '系统管理'
          }, {
            router: '/onlineUserView',
            label: '其他管理'
          }, {
            router: '/onlineUserView',
            label: '在线用户查看'
          }
        ],
        columns: [
          {
            field: 'userName',
            label: '用户编号',
            minWidth: '100'
          },
          {
            field: 'chinaeseName',
            label: '用户名称',
            minWidth: '100'
          }, {
            field: 'userGroup',
            label: '用户部门名称',
            minWidth: '100'
          }
        ],
        totalCount: 0,
        pageinationInfo: {
          currentPage: 1,
          pageSizeNumber: 10
        }
      }
    },
    methods: {
      getPageination (val) {
        this.pageinationInfo = val
      },
      reqOnlineUserList () {
        getOnlineUserList().then(resp => {
          if (resp) {
            this.onlineUserList = resp
          }
        })
      }
    },
    created () {
      this.reqOnlineUserList()
    }
  }
</script>
<style lang="less" scoped>
  .online-user-view {
    .table-card {
      .opearate-btn {
        text-align: right;
        padding: 15px;
      }
    }
    .totalNumber {
      font-size: 14px;
      text-align: right;
      padding: 15px;
    }
  }

</style>
