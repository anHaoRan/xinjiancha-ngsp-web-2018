<!--  沪深300成分股每日数据查询 -->
<template>
  <div class="constituent-stock">
    <el-card>
      <div slot="header">
        查询条件
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
      </div>
      <el-form ref='constituentStockQueryForm' :inline="true" :model='formData' :rules='rules' label-width='140px'>
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
        <el-form-item label='统计方式：' prop='flag'>
          <el-select v-model="formData.flag" placeholder="请选择" size="small">
            <el-option
              v-for="item in flagList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='产品类型：' prop='productType'>
          <el-select v-model="formData.productType" multiple placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in productTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
  import {constituentStockQuery, exportStockFuturesTrend} from '@/service/analysisTool/stockIndexFutures/index'
  import moment from 'moment'

  export default {
    name: 'constituentStock',
    components: {
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        isShowRes: false,
        flagList: [
          {
            id: '1',
            name: '按日统计'
          },
          {
            id: '2',
            name: '多日合计'
          }
        ],
        productTypeList: [
          {
            id: 'IF',
            name: '沪深300'
          },
          {
            id: 'IH',
            name: '上证50'
          },
          {
            id: 'IC',
            name: '中证500'
          }
        ],
        formData: {
          dateStart: new Date(),
          dateEnd: new Date(),
          flag: '1',
          productType: []
        },
        rules: {
          dateStart: [
            {required: true, message: '请选择'}
          ],
          dateEnd: [
            {required: true, message: '请选择'}
          ],
          flag: [
            {required: true, message: '请选择'}
          ],
          productType: [
            {required: true, message: '请选择'}
          ]
        },
        columns: [],
        columnsList: [
          {
            label: '日期',
            field: 'trade_date',
            align: 'left',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_date')
          },
          {
            label: '投资者类别',
            field: 'tjlx',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'tjlx')
          },
          {
            label: '买入金额(亿元)',
            field: 'trdamt_b',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b'),
            formatter: this.gfnElColFormatDecThou3,
            format: '#,##0.000'
          },
          {
            label: '卖出金额(亿元)',
            field: 'trdamt_s',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s'),
            formatter: this.gfnElColFormatDecThou3,
            format: '#,##0.000'
          },
          {
            label: '买卖净额(亿元)',
            field: 'trdamt_net',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_net'),
            formatter: this.gfnElColFormatDecThou3,
            format: '#,##0.000'
          }
        ],
        loading: false,
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
        this.$refs['constituentStockQueryForm'].validate((valid) => {
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
          dateStart: moment(this.queryData.dateStart).format('YYYYMMDD'),
          dateEnd: moment(this.queryData.dateEnd).format('YYYYMMDD'),
          flag: this.queryData.flag,
          productType: this.queryData.productType.join(','),
          pageIndex: this.tableData.pageIndex,
          pageRows: this.tableData.pageRows
        }
        this.loading = true
        constituentStockQuery(params).then((resp) => {
          if (resp) {
            // 处理表头
            let tempColumn = []
            if (this.queryData.flag === '1') {
              tempColumn = this.columnsList
            } else {
              tempColumn = JSON.parse(JSON.stringify(this.columnsList))
              tempColumn.shift()
            }
            this.columns = tempColumn
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
          flag: this.queryData.flag,
          productType: this.queryData.productType.join(','),
          type: 'HSStockData',
          fileType: type,
          tableColumns: [{
            sheetName: '沪深300成分股',
            fileColumns: this.columns
          }]
        }
        exportStockFuturesTrend(params)
      }
    }
  }
</script>

<style lang='less' scoped>
  .constituent-stock {
  }
</style>
