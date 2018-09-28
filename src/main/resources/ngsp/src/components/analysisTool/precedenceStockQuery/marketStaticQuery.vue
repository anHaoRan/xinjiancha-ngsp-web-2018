<!-- 优先股查询-市场统计 -->
<template>
  <div class="market-static-query">
    <el-card>
      <div slot="header">
        查询条件
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
      </div>
      <el-form ref='preferredStockMarketStatic' :inline="true" :model='formData' :rules='rules' label-width='140px'>
        <el-form-item label='开始日期：' prop='dateStart'>
          <el-date-picker
            v-model="formData.dateStart"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="beginPickerData"
            size="small"
            style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='结束日期：' prop='dateEnd'>
          <el-date-picker
            v-model="formData.dateEnd"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="endPickerData"
            size="small"
            style="width:100%">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-show="isShowRes">
      <s-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        @getPageination="getPageination">
        <el-dropdown @command="handleDownload" v-if="tableData.data.length" slot="elCardHeader">
          <el-button type="info" size="small">
            导出<i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="exl">
              <i class="el-icon-document"></i>导出为EXCEL
            </el-dropdown-item>
            <el-dropdown-item command="csv">
              <i class="el-icon-tickets"></i>导出为CSV
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </s-table>
    </div>
  </div>
</template>

<script>
  import {postMarketStatic, exportCommonFunc} from '@/service/analysisTool/precedenceStockQuery'
  import moment from 'moment'

  export default {
    name: 'market-static-query',
    props: [],
    components: {
      STable: () => import('@/components/base/STable')
    },
    mixin: [],
    data() {
      return {
        isShowRes: false,
        queryData: {},
        formData: {
          dateStart: new Date(),
          dateEnd: new Date()
        },
        rules: {
          dateStart: [
            {required: true, message: '请选择'}
          ],
          dateEnd: [
            {required: true, message: '请选择'}
          ]
        },
        loading: false,
        columns: [
          {
            label: '证券代码',
            field: 'instrumentid',
            align: 'left',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrumentid')
          },
          {
            label: '证券名称',
            field: 'instrument_chn_short_name',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_chn_short_name')
          },
          {
            label: '成交数量',
            field: 'tradequantity',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'tradequantity'),
            formatter: this.gfnElColFormatDecThou0,
            format: '#,##0'
          },
          {
            label: '成交金额',
            field: 'amount',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'amount'),
            formatter: this.gfnElColFormatDecThou3,
            format: '#,##0.000'
          },
          {
            label: '成交均价',
            field: 'avg_tradeprice',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'avg_tradeprice'),
            formatter: this.gfnElColFormatDecThou3,
            format: '#,##0.000'
          }
        ],
        tableData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        beginPickerData: {
          disabledDate: (time) => {
            return time.getTime() >= new Date(this.formData.dateEnd).getTime()
          }
        },
        endPickerData: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.formData.dateStart).getTime() - 3600 * 1000 * 24
          }
        }
      }
    },
    methods: {
      handleSearch() {
        let sDate = moment(this.formData.dateStart).format('YYYY-MM-DD'),
          eDate = moment(this.formData.dateEnd).format('YYYY-MM-DD')
        if (new Date(eDate).getTime() < new Date(sDate).getTime()) {
          this.$message.error('开始时间不得小于结束时间')
          return
        }
        this.$refs['preferredStockMarketStatic'].validate((valid) => {
          if (valid) {
            this.isShowRes = true
            this.queryData = JSON.parse(JSON.stringify(this.formData))
            this.tableData.pageIndex = 1
            this.reqTableData()
          }
        })
      },
      reqTableData() {
        let params = {
          dateStart: moment(this.queryData.dateStart).format('YYYYMMDD'), // 测试 20131120-20131122
          dateEnd: moment(this.queryData.dateEnd).format('YYYYMMDD'),
          pageIndex: this.tableData.pageIndex,
          pageRows: this.tableData.pageRows
        }
        this.loading = true
        postMarketStatic(params).then((resp) => {
          if (resp) {
            this.loading = false
            this.tableData.data = resp.bizData.metaData
            this.tableData.total = resp.bizData.totalRows
          }
        })
      },
      getPageination(pageination) {
        this.tableData.pageIndex = pageination.currentPage
        this.tableData.pageRows = pageination.pageSizeNumber
        this.reqTableData()
      },
      handleDownload(type) {
        let params = {
          dateStart: moment(this.queryData.dateStart).format('YYYYMMDD'),
          dateEnd: moment(this.queryData.dateEnd).format('YYYYMMDD'),
          type: 'marketStatis',
          fileType: type,
          tableColumns: [{
            sheetName: '市场统计',
            fileColumns: this.columns
          }]
        }
        exportCommonFunc(params)
      }
    }
  }
</script>

<style lang='less' scoped>
  .market-static-query {

  }
</style>
