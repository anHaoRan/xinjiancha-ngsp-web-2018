<!--登记单查询-->
<template>
  <div class="registrationFormQuery">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <el-tabs v-model="activeTabName" @tab-click="getAllData">
        <el-tab-pane :name="'0'" label="按登记单查询"></el-tab-pane>
        <el-tab-pane :name="'1'" label="按账户查询"></el-tab-pane>
      </el-tabs>
      <el-card>
        <div slot="header" class="clearfix">
          <span>查询条件</span>
          <el-button
            type="info"
            size="small"
            @click="handleClear"
          >清空
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleQuery"
          >查询
          </el-button>
        </div>
        <el-row style="margin-top:15px">
          <el-form ref="registrationFormQuery" :model="selectParams" label-width="120px" label-position="left">

          </el-form>
        </el-row>
      </el-card>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
      </div>
      <margin-table
        style="margin-top:15px"
        :loading="loading"
        @getPageination="getPageination"
        :columns="columns"
        :data="{
          data: tableData,
          pageIndex: pagination.currentPage,
          pageRows: pagination.pageSizeNumber,
          total: total
        }">
        <el-table-column
          slot="tableColumnsUnshift"
          type="index"
          width="80px"
          label="序号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :width="300"
          slot="tableColumnsPush"
          prop="operateContent"
          label="操作"
          show-overflow-tooltip>
        </el-table-column>
      </margin-table>
    </el-card>
  </div>
</template>
<script>
  import Mixin from './component/Mixin'
  import {columns2, columns3} from './component/constants'
  export default {
    mixins: [Mixin],
    watch: {
      activeTabName(val) {
        if (val === '1') {
          this.columns = columns2
        } else {
          this.columns = columns3
        }
      }
    },
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '重点监控账户'
        }, {
          router: '',
          label: '登记单查询'
        }],
        activeTabName: '0',
        columns: [],
        selectParams: {
          letterNumber: '',
          keyWord: '',
          requesterName: '',
          currentUserNames: '',
          localStatus: [],
          selectDateRange: []
        },
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0
      }
    },
    mounted () {
      this.getAllData()
    },
    methods: {
      handleClear() {

      },
      handleQuery() {
        this.pagination.currentPage = 1
        this.getTableData()
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      getAllData() {
        let params = {}
        // todo get table data
      }
    }
  }
</script>
<style lang="less" scoped>
  .registrationFormQuery {
    .customize-width {
      width: 350px;
    }
  }
</style>