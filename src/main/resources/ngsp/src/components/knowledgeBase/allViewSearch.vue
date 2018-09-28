<template>
  <div class="allViewSearch">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card style="padding:10px 0;width:100%;">
      <el-row style="padding: 10px 0;text-align:center">
        <el-input size="middle" v-model="params.input" class="custom-width"></el-input>
        <el-button type="primary" size="middle" style="margin-left:10px;width:120px;" @click="getAllTableData">搜 索</el-button>
      </el-row>
      <el-row style="margin-top: 20px;text-align:center">
        <el-radio-group v-model="params.searchBy">
          <el-radio v-for="(item, index) in searchRadioOptions" :key="index" :label="String(index)">{{item}}</el-radio>
        </el-radio-group>
      </el-row>
    </el-card>
    <div class="table-container">
      <common-table
        :loading="loadings[index - 1]"
        v-for="index in 4"
        :key="index"
        :columns="columns[index - 1]"
        :tableData.sync="tableData[index - 1]"
        :pagination.sync="paginations[index - 1]"
        :currentTableIndex="index - 1"
        @updatePagination="updatePagination"
      ></common-table>
    </div>
  </div>

</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import CommonTable from './component/tablePaginationComponent'
  import { columns, selfSupervisionStatusDit, clueReportStatusDit, isReort, clueClassify } from './component/columns'
  import {
    getAlarmBy360degree,
    getAbnormalbehaveBy360degree,
    getSlsAccountBy360degree,
    getCrpBy360Degree
  } from '@/service/knowledgeBase/allViewSearch'

  export default {
    components: {
      Breadcrumb,
      CommonTable
    },
    name: 'all-view-search',
    data () {
      let paginations = []
      let loadings = []
      for (let i = 0; i < 4; i++) {
        paginations.push({
          pageIndex: 1,
          pageRows: 10,
          total: 0
        })
        loadings.push(false)
      }
      return {
        columns,
        selfSupervisionStatusDit,
        clueReportStatusDit,
        isReort,
        clueClassify,
        breadcrumbItems: [{
          router: '',
          label: '监管知识库'
        }, {
          router: '',
          label: '历史监管库'
        }, {
          router: '',
          label: '全景搜索功能'
        }],
        searchRadioOptions: ['账户代码', '股票代码', '一码通', '关键字'],
        paginations: paginations,
        tableData: [],
        params: {
          searchBy: '0',
          input: ''
        },
        getTableDataMapFunc: [getAlarmBy360degree, getAbnormalbehaveBy360degree, getSlsAccountBy360degree, getCrpBy360Degree],
        loadings: loadings
      }
    },
    methods: {
      updatePagination (pagination, index) {
        let paginations = JSON.parse(JSON.stringify(this.paginations))
        paginations[index]['pageIndex'] = pagination['currentPage']
        paginations[index]['pageRows'] = pagination['pageSizeNumber']
        this.paginations = JSON.parse(JSON.stringify(paginations))
        this.getTableDataByIndex(index)
      },
      getTableDataByIndex(index) {
        this.loadings[index] = true
        let tableData = JSON.parse(JSON.stringify(this.tableData))
        let paginations = JSON.parse(JSON.stringify(this.paginations))
        this.params.input = this.params.input.trim()
        this.getTableDataMapFunc[index]({...this.params, ...this.paginations[index]}).then(res => {
          this.callback(index, res, tableData, paginations)
        })
      },
      callback(index, res, tableData, paginations) {
        this.loadings[index] = false
        if (index === 0) {
          const {bizData} = res
          tableData[index] = bizData.metaData
          paginations[index]['total'] = bizData.totalRows
        } else {
          const {pageContent, totalNum} = res
          tableData[index] = pageContent
          paginations[index]['total'] = totalNum
        }
        this.tableData = JSON.parse(JSON.stringify(tableData))
        this.paginations = JSON.parse(JSON.stringify(paginations))
      },
      getAllTableData() {
        let tableData = []
        let paginations = JSON.parse(JSON.stringify(this.paginations))
        this.params.input = this.params.input.trim()
        this.getTableDataMapFunc.forEach((item, index) => {
          this.loadings[index] = true
          item({...this.params, ...this.paginations[index]}).then(res => {
            this.callback(index, res, tableData, paginations)
          })
        })
      }
    },
    mounted() {
      this.getAllTableData()
    }
  }
</script>

<style lang="less" scoped>
  .allViewSearch {
    .custom-width {
      width: 400px;
    }
    .table-container {
      width: 100%;
      max-height: 610px;
      overflow: auto;
      margin-top: 30px;
      .el-card:first-child {
        margin-top: 0;
      }
    }
  }

</style>
