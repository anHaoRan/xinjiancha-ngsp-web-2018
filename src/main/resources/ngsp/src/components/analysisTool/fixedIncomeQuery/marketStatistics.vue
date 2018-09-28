<template>
  <div class="market-statistics">
    <el-card>
      <div slot="header">
        查询条件
        <el-button
          type="primary"
          size="small"
          @click="fnGetQueryRes">
          查询
        </el-button>
      </div>
      <el-form :inline="true" label-width="100px">
        <el-form-item label="日期：">
          <el-date-picker
            v-model="dateVal"
            type="daterange"
            :unlink-panels="true"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            format="yyyyMMdd"
            value-format="yyyyMMdd"
            size="small">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="el-card-table" v-if="isShowRes">
      <div slot="header">
        市场查询：
        <el-button size="small" type="info" @click="saveLocation">导出</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        style="width: 100%"
        height="550"
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
    </el-card>
  </div>
</template>

<script>
import {getCurTradeDate} from '../../../service/common/commonFunc'
import {getMarketStatisticsQuery} from '../../../service/analysisTool/fixedIncomeQuery'

export default {
  //  name: "market-statistics",
  data() {
    return {
      //  日期
      dateVal: [],
      //  请求参数
      requestParams: {},
      //  查询结果
      isShowRes: false,
      tableData: [],
      queryResLoad: false,
      tableOptions: [
        {field: 'sec_code', label: '证券代码', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'sec_code')},
        {field: 'instrument_chn_short_name', label: '证券名称', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_chn_short_name')},
        {field: 'fp_mount', label: '成交数量', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'fp_mount'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
        {field: 'ft_price', label: '成交金额', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ft_price'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
        {field: 'ta', label: '成交均价', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ta'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
      ]
    }
  },
  mounted() {
    // 获取当前交易日
    getCurTradeDate().then(resp => {
      this.dateVal = [resp, resp]
    })
  },
  methods: {
    // 查询
    fnGetQueryRes() {
      if ($.isEmptyObject(this.dateVal)) {
        this.$message.warning('请选择日期')
        return
      }
      this.requestParams = {
        dateStart: this.dateVal[0],
        dateEnd: this.dateVal[1]
      }
      this.isShowRes = true
      this.queryResLoad = true
      getMarketStatisticsQuery(this.requestParams).then(resp => {
        this.tableData = resp.bizData.metaData
        this.queryResLoad = false
      })
    },
    saveLocation() {
      let params = {...this.requestParams}
      params['tableColumns'] = [
        {
          sheetName: '固定收益平台-市场查询',
          fileColumns: this.tableOptions
        }
      ]
      params['type'] = 'market'
      params['fileType'] = 'excel'
      //  alert(params)
      this.gfnExportFileWithForm('/regularqry/fasten-plat/v1/new/export', params)
    }
  }
}
</script>params

<style lang="less" scoped>
  .market-statistics {

  }
</style>
