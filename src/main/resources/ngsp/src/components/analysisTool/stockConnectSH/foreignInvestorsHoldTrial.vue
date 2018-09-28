<template>
  <div class="foreign-investors-hold-trial">
    <el-card class="el-card-table">
      <div slot="header">
        境外投资者持股比例试算：
        <el-button size="small" type="info" @click="saveLocation" v-if="tableData.length!==0">导出</el-button>

        <el-button
          type="primary"
          size="small"
          @click="fnGetQueryRes">
          查询
        </el-button>
      </div>
      <div v-if="isClickQuery">
        <el-table
          :data="tableData"
          border
          tooltip-effect="dark"
          size="small"
          highlight-current-row
          style="width: 100%"
          v-loading="queryResLoad"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column
            v-for="column in tableOptions"
            :show-overflow-tooltip="true"
            :key="column.field"
            :label="column.label"
            :prop="column.field"
            :width="column.width"
            min-width="130"
            :sortable="column.sortable == null ? false : column.sortable"
            :sort-method="column.sortMethod"
            :align="column.align == null ? 'center' : column.align"
            :formatter="column.formatter">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="resultNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {getForeignInvestorsHoldTrial} from '../../../service/analysisTool/stockConnectSH'

  export default {
    name: 'foreign-investors-hold-trial',
    props: [],
    components: {},
    mixin: [],
    data() {
      return {
        // 表格
        tableData: [],
        queryResLoad: false,
        tableOptions: [
          {
            field: 'instrument_id',
            label: '证券代码',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            field: 'instrument_chn_short_name',
            label: '证券简称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_chn_short_name')
          },
          {
            field: 'total_shares',
            label: '总股本',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'total_shares')
          },
          {
            field: 'amount',
            label: '持有数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'amount')
          },
          {
            field: 'ratio',
            label: '持有比例',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ratio')
          },
          {
            field: 'qfii_amount',
            label: 'QFII持有数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'qfii_amount')
          },
          {
            field: 'qfii_ratio',
            label: 'QFII持有比例',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'qfii_ratio')
          },
          {
            field: 'hk_amount',
            label: '香港沪股通账户持有数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'hk_amount')
          },
          {
            field: 'hk_ratio',
            label: '香港沪股通账户持有比例',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'hk_ratio')
          }
        ],
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        resultNum: 0,
        isClickQuery: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      fnGetQueryRes() {
        this.queryResLoad = true
        this.isClickQuery = true
        this.requestParams = {
          pageIndex: this.currentPage,
          pageRows: this.pageSize
        }
        getForeignInvestorsHoldTrial(this.requestParams).then(resp => {
          console.log(resp);
          this.tableData = resp.bizData.metaData
          this.resultNum = resp.bizData.totalRows - 0
          this.queryResLoad = false
        })
      },
      saveLocation() {
        let params = {
          type: 'hgtfInvestorStat',
          fileType: 'excel',
          tableColumns: [{
            'sheetName': '境外投资者持股比例试算',
            'fileColumns': this.tableOptions
          }]
        }
        this.gfnExportFileWithForm('/regularqry/hgtquery/v1/hgt/export', params);
      },
      // 更改每页数量change事件
      handleSizeChange(val) {
        this.currentPage = 1
        this.pageSize = val
        this.fnGetQueryRes()
      },
      // 翻页change事件
      handleCurrentChange(val) {
        this.currentPage = val
        this.fnGetQueryRes()
      }
    },
    created() {

    },
    mounted() {

    },
    beforeDestory() {

    }
  }
</script>

<style lang="less" scoped>
  .foreign-investors-hold-trial {

  }
</style>
