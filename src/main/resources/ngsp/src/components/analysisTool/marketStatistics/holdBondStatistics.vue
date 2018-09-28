<template>
  <div class="hold-bond-statistics">
    <el-card class="el-card-table">
      <div slot="header">
        前20名债券汇总信息
        <el-dropdown @command="handleCommndMain" v-if="!queryResLoadMain">
          <el-button type="info" size="small">
            导出<i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="csv">
              <i class="el-icon-document"></i>导出为CSV
            </el-dropdown-item>
            <el-dropdown-item command="excel">
              <i class="el-icon-document"></i>导出为EXCEL
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button
          type="primary"
          size="small"
          @click="fnGetQueryRes">
          查询
        </el-button>
      </div>
      <el-table
        v-if="isClickQuery"
        :data="tableDataMain"
        border
        size="small"
        height="350"
        style="margin-bottom: 15px;"
        show-overflow-tooltip
        tooltip-effect="dark"
        v-loading="queryResLoadMain"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="scope.row.instrument_id"
                      @change="fnGetRadio(scope.row)"></el-radio>
          </template>
        </el-table-column>

        <el-table-column
          v-for="column in tableOptionMain"
          :show-overflow-tooltip="true"
          :key="column.field"
          :label="column.label"
          :prop="column.field"
          :width="column.width"
          :min-width="130"
          :align="column.align == null ? 'center' : column.align"
          :formatter="column.formatter">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="el-card-table" v-if="isShowSubTable">
      <div slot="header">
        某债券的前5账户详细信息
        <el-dropdown @command="handleCommndSub" v-if="!queryResLoadSub">
          <el-button type="info" size="small">
            导出<i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="csv">
              <i class="el-icon-document"></i>导出为CSV
            </el-dropdown-item>
            <el-dropdown-item command="excel">
              <i class="el-icon-document"></i>导出为EXCEL
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table
        :data="tableDataSub"
        ref="subTable"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        style="width: 100%"
        v-loading="queryResLoadSub"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
          v-for="column in tableOptionSub"
          :show-overflow-tooltip="true"
          :key="column.field"
          :label="column.label"
          :prop="column.field"
          :width="column.width"
          :min-width="column.minWidth"
          :sortable="column.sortable == null ? false : column.sortable"
          :sort-method="column.sortMethod"
          :align="column.align == null ? 'center' : column.align"
          :formatter="column.formatter">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {getCurTradeDate} from '../../../service/common/commonFunc'
import {getHoldBondDataMain, getHoldBondDataSub} from '../../../service/analysisTool/marketStatistics'

export default {
  // name: "hold-bond-statistics",
  data() {
    return {
      msg: '持债集中度统计',
      currentTradDate: '',
      requestParamsMain: {},
      requestParamsSub: {},
      tableDataMain: [],
      tableOptionMain: [
        {field: 'rn', label: '序号', align: 'left'},
        {field: 'instrument_id', label: '债券代码', align: 'left'},
        {field: 'instrument_chn_short_name', label: '债券名称', align: 'left'},
        {field: 'issuing_volume', label: '发行总量', align: 'right', formatter: this.gfnElColFormatDecThou0},
        {field: 'position_amount', label: '前5账户持有量', align: 'right', formatter: this.gfnElColFormatDecThou0},
        {field: 'hold_proportion', label: '前5账户持有比重(%)', align: 'right', formatter: this.gfnElColFormatDec3}
      ],
      radio: '',
      queryResLoadMain: true,
      // 母表是否显示
      isClickQuery: false,
      // 子表是否显示
      isShowSubTable: false,
      tableDataSub: [],
      tableOptionSub: [
        {field: 'rn', label: '序号', align: 'left'},
        {field: 'instrument_id', label: '债券代码', align: 'left'},
        {field: 'instrument_chn_short_name', label: '债券名称', align: 'left'},
        {field: 'investor_account_id', label: '账户代码', align: 'left'},
        {field: 'investor_account_name', label: '账户名称', align: 'left'},
        {field: 'position_amount', label: '持有量', align: 'right', formatter: this.gfnElColFormatDecThou0},
        {field: 'hold_proportion', label: '持有比重(%)', align: 'right', formatter: this.gfnElColFormatDec3}
      ],
      queryResLoadSub: false
    }
  },
  mounted() {
    getCurTradeDate().then(resp => {
      this.currentTradDate = resp
    })
  },
  methods: {
    fnGetQueryRes() {
      this.radio = ''
      this.queryResLoadMain = true
      this.isShowSubTable = false
      this.isClickQuery = true
      this.requestParamsMain = {
        toDay: this.currentTradDate
      }
      getHoldBondDataMain(this.requestParamsMain).then(resp => {
        this.tableDataMain = resp.bizData.metaData
        this.queryResLoadMain = false
      })
    },
    // 获取子表值
    fnGetRadio(row) {
      this.queryResLoadSub = true
      this.isShowSubTable = true
      this.requestParamsSub = {
        instrument_id: row.instrument_id
      }
      getHoldBondDataSub(this.requestParamsSub).then(resp => {
        this.tableDataSub = resp.bizData.metaData
        this.queryResLoadSub = false
      })
    },
    // 导出
    handleCommndMain(val) {
      let params = this.requestParamsMain
      params['tableColumns'] = [{
        sheetName: '持债集中度统计',
        fileColumns: this.tableOptionMain
      }]
      params['markType'] = 'bondHoldQuery'
      params['fileMark'] = val
      this.gfnExportFileWithForm('/regularqry/general/v1/exports', params);
    },
    handleCommndSub(val) {
      let params = this.requestParamsSub
      params['tableColumns'] = [{
        sheetName: '持债集中度统计',
        fileColumns: this.tableOptionSub
      }]
      params['markType'] = 'bondHoldQuerySub'
      params['fileMark'] = val
      this.gfnExportFileWithForm('/regularqry/general/v1/exports', params);
    }
  }
}
</script>

<style lang="less" scoped>
  .hold-bond-statistics {
    /deep/ .el-radio {
      /deep/ .el-radio__label {
        display: none;
      }
    }
  }
</style>
