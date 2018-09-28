<template>
  <div class="stock-connect-detail-static">
    <el-card>
      <div slot="header">
        查询条件
        <el-button type="primary" size="small" @click="getQueryRes">查询</el-button>
      </div>
      <el-form :inline="true" label-width="100px" style="margin-top: 20px;">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="证券代码：">
            <common-stock-code @getSelectRes="getSelectRes" style="width: 100%;"></common-stock-code>
          </el-form-item>
        </el-col>
        <el-col :xl="10" :lg="10" :md="12" :sm="24">
          <el-form-item label="时间：" :required="true">
            <el-date-picker v-model="commonDatePickerVal"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['09:00:00','17:00:00']"
                            unlink-panels
                            align="right"
                            size="small"
                            @change="changeQueryCondition">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card class="el-card-table" v-if="showMainTable">
      <div slot="header">
        沪股通成交统计母表：
        <el-button size="small" type="info" @click="saveMainLocation" v-if="mainTableData.length!==0">导出</el-button>
      </div>
      <el-table
        :data="mainTableData"
        border
        style="margin-bottom: 15px;"
        height="450px"
        v-loading="queryResLoadMain"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="scope.row.brnid" v-if="scope.row.brnid!=='合计'"
                      @change="getRadio(scope.row)"></el-radio>
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          v-for="column in mainTableOptions"
          :key=column.field
          :align=column.align
          :prop=column.field
          :label=column.label
          :min-width=column.minWidth
          :formatter="column.formatter"
          :sortable="column.sortable == null ? false : column.sortable"
          :sort-method="column.sortMethod">
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-right: 40px;margin-bottom: 15px;">共 {{mainTotal}} 条</div>
    </el-card>
    <el-card class="el-card-table" v-if="showSubTable">
      <div slot="header">
        沪股通成交统计子表：
        <el-button size="small" type="info" @click="saveSubLocation" v-if="subTableData.length!==0">导出</el-button>
      </div>
      <el-table
        :data="subTableData"
        border
        height="450px"
        style="margin-bottom: 20px;"
        v-loading="queryResLoadSub"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
          show-overflow-tooltip
          v-for="column in subTableOptions"
          :key=column.field
          :align=column.align
          :prop=column.field
          :label=column.label
          :min-width=column.minWidth
          :formatter="column.formatter"
          :sortable="column.sortable == null ? false : column.sortable"
          :sort-method="column.sortMethod">
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-right: 40px;margin-bottom: 15px;">共 {{subTotal}} 条</div>
    </el-card>
  </div>
</template>

<script>
  import {
    getStockcodeFromConnet,
    getFuzzyStockcodeFromConnet,
    getTradStaticData,
    getTradStaticDetailData
  } from '../../../service/analysisTool/stockConnectSH'
  import CommonStockCode from './commonStockCode'
  import {getCurTradeDate} from '../../../service/common/commonFunc'
  import moment from 'moment'

  export default {
    name: 'detail-static',
    components: {CommonStockCode},
    data() {
      return {
        stockCode: '',
        commonDatePickerVal: [],
        mainTableData: [],
        subTableData: [],
        mainTableOptions: [
          {
            field: 'brnid',
            label: '参与者代码',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'brnid')
          },
          {
            field: 'branch_name',
            label: '参与者名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')
          },
          {
            field: 'mktval_b',
            label: '买入金额（万元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_b'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 'mktval_s',
            label: '卖出金额（万元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_s'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        subTableOptions: [
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
            field: 'trdqty_b',
            label: '买入数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'mktval_b',
            label: '买入金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_b'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 'rate_b',
            label: '买入比例',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rate_b'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 'averrage_price_b',
            label: '买入均价',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'averrage_price_b'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 'trdqty_s',
            label: '卖出数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'mktval_s',
            label: '卖出金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'mktval_s'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 'rate_s',
            label: '卖出比例',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'rate_s'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            field: 'averrage_price_s',
            label: '卖出均价',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'averrage_price_s'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        queryResLoadMain: false,
        queryResLoadSub: false,
        showMainTable: false,
        showSubTable: false,
        mainTotal: 0,
        subTotal: 0,
        radio: '',
        requestMainParams: {},
        requestSubParams: {},
        startTime: '',
        endTime: ''
      }
    },
    mounted() {
      getCurTradeDate().then(resp => {
        this.startTime = moment(resp + ' 090000', 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment(resp + ' 170000', 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm:ss')
        this.commonDatePickerVal = [this.startTime, this.endTime]
      })
    },
    methods: {
      getSelectRes(selectStockCodeVal) {
        let arr = []
        selectStockCodeVal.forEach(function (item) {
          if (item !== 'ALL') {
            arr.push(item)
          }
        })
        this.stockCode = arr.join(',')
      },
      /* eslint-disable */
      getQueryRes() {
        if ($.isEmptyObject(this.commonDatePickerVal)) {
          this.$message.error('时间不能为空')
          return
        } else {
          this.radio=''
          this.showMainTable = true
          this.queryResLoadMain = true
          this.showSubTable = false
          this.requestMainParams = {
            stockCode: this.stockCode,
            dateTimeStart: this.commonDatePickerVal[0],
            dateTimeEnd: this.commonDatePickerVal[1]
          }
          getTradStaticData(this.requestMainParams).then(resp => {
            this.mainTableData = resp.bizData.metaData
            this.mainTotal = this.mainTableData.length - 1
            this.queryResLoadMain = false
          })
        }

      },
      changeQueryCondition(val) {
        let [dateStart, timeStart] = val[0].split(' '),
        [dateEnd, timeEnd] = val[1].split(' ')
        if (timeStart === '00:00:00') {
          this.commonDatePickerVal[0] = dateStart + ' 09:00:00'
        }
        if (timeEnd === '00:00:00') {
          let nowDate = moment(new Date()).format('YYYY-MM-DD')
          if (nowDate === dateEnd) {
            this.commonDatePickerVal[1] = dateEnd + ' ' + moment(new Date()).format('HH:mm:ss')
          } else {
            this.commonDatePickerVal[1] = dateEnd + ' 17:00:00'
          }
        }
      },
      getRadio(row) {
        if (row.brnid === '合计') {
          return
        } else {
          this.showSubTable = true
          this.queryResLoadSub = true
          this.requestSubParams = {...this.requestMainParams, ...{id: row.brnid}}
          // {
          //   stockCode: this.stockCode,
          //   dateTimeStart: this.commonDatePickerVal[0],
          //   dateTimeEnd: this.commonDatePickerVal[1],
          //   id: row.brnid
          // }
          getTradStaticDetailData(this.requestSubParams).then(resp => {
            this.subTableData = resp.bizData.metaData
            this.subTotal = this.subTableData.length
            this.queryResLoadSub = false
          })
        }
      },
      saveMainLocation() {
        let params = this.requestMainParams
        params['type'] = 'hgtBargain'
        params['isDetail'] = false
        params['fileType'] = 'excel'
        params['tableColumns'] = [{
          'sheetName': '沪港通成交统计查询母表',
          'fileColumns': this.mainTableOptions
        }]
        this.gfnExportFileWithForm('/regularqry/hgtquery/v1/hgt/export', params);
      },
      saveSubLocation() {
        let params = this.requestSubParams
        params['type'] = 'hgtBargain'
        params['isDetail'] = true
        params['fileType'] = 'excel'
        params['tableColumns'] = [{
          'sheetName': '沪港通成交统计查询子表',
          'fileColumns': this.subTableOptions
        }]
        this.gfnExportFileWithForm('/regularqry/hgtquery/v1/hgt/export', params);
      }
    }
  }
</script>

<style lang='less' scoped>
  .stock-connect-detail-static {
    /deep/ .el-radio__label {
      display: none;
    }
  }

</style>
