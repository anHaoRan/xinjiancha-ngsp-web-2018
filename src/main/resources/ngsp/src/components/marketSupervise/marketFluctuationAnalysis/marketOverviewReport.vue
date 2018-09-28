<template>
  <div class='marketOverviewReport'>
    <el-card class='el-card-table' style='margin-top: 0px;'>
      <div slot='header' class='clearfix'>
        市场概览报告
      </div>
      <el-table
        :data='IndexData'
        border
        tooltip-effect='dark'
        size='small'
        highlight-current-row
        height='350'
        style='width: 100%'>
        <el-table-column
          v-for='column in IndexColumns'
          :key='column.field'
          :align='column.align'
          :prop='column.field'
          :label='column.label'
          :min-width='column.minWidth'>
        </el-table-column>
        <el-table-column
          min-width='10%'
          align='center'
          label='操作'>
          <template slot-scope='scope'>
            <el-button @click='download(scope.row)' type='text' size='small' style='border: none;color:#1b5eed
'>下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='block' style='text-align: center'>
        <el-pagination
          @size-change='pageSizeChange'
          @current-change='pageCurrentChange'
          :small='true'
          :current-page='currentPage'
          :page-sizes='[10,20,50,100,200,400]'
          :page-size='pageSize'
          layout='total,sizes,prev,pager,next,jumper'
          :total='pageTotal'
        >
        </el-pagination>
      </div>
    </el-card>
  </div>

</template>

<script>
  import {getHistoryReport} from '../../../service/marketSupervise/marketFluctuationAnalysis/index'
  import moment from 'moment'

  export default {
    name: 'overview-waveAnalysisDaily',
    props: ['marketOverviewRefesh'],
    data() {
      return {
        IndexData: [], // 时间段统计表格数据
        IndexColumns: [{label: '日期', field: 'reportDate', align: 'center', minWidth: '10%'}],
        pageSize: 10,
        currentPage: 1, // 分页当前页
        pageTotal: 0, // 分页总数
        type: 1,
        paramsPageIndex: 1,
        paramsPageSize: 10
      }
    },
    mounted() {
      this.getTableData()
    },
    watch: {
      'marketOverviewRefesh': function () {
        this.getTableData()
      }
    },
    methods: {
      // 下载
      download(params) {
        this.gfnDownloadFile(params.fileId, params.fileName);
      },
      pageSizeChange(val) {
        this.paramsPageSize = val
        this.getTableData()
      },
      pageCurrentChange(val) {
        this.paramsPageIndex = val
        this.getTableData()
      },
      getTableData() {
        getHistoryReport(this.type, this.paramsPageIndex, this.paramsPageSize).then(resp => {
          resp.data.forEach((el) => {
            el.reportDate = moment(el.reportDate, 'YYYYMMDD').format('YYYY年MM月DD日')
          })
          this.IndexData = resp.data
          this.pageTotal = resp.totalRowCount
        })
      }
    }
  }
</script>

<style lang='less'>
  .marketOverviewReport {
  }
</style>
