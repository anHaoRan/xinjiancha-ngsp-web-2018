<template>
  <div class="partic-market-val-query">
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
      <el-form :inline="true" label-width="100px" style="margin-top: 20px;">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="产品类型：">
            <el-select
              size="small"
              v-model="productType">
              <el-option
                v-for="item in productTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="参与者层级：">
            <el-select
              size="small"
              v-model="participantLevel">
              <el-option
                v-for="item in participantLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="日期">
            <el-date-picker
              v-model="date"
              type="date"
              format="yyyyMMdd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              size="small">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card class="el-card-table" v-if="isShowMainTable">
      <div slot="header">
        参与者市值汇总查询：
        <el-button size="small" type="info" @click="saveLocationMain" v-if="!queryResMainLoad">导出</el-button>
      </div>
      <el-table
        :data="mainTableData"
        ref="mainTable"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        style="width: 100%"
        v-loading="queryResMainLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio"
                      :label="requestParamsMain.actorType==='salePart'?scope.row.brnid:(requestParamsMain.actorType==='member'?scope.row.member_id:scope.row.flag_name)"
                      v-if="requestParamsMain.actorType==='salePart'?scope.row.brnid!=='合计':(requestParamsMain.actorType==='member'?scope.row.member_id!=='合计':scope.row.flag_name!=='合计')"
                      @change="getRadio(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column
          v-for="column in mainTableOptions"
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
      <el-pagination
        @size-change="handleSizeChangeMain"
        @current-change="handleCurrentChangeMain"
        :current-page="currentPageMain"
        :page-sizes="pageSizesMain"
        :page-size="pageSizeMain"
        layout="total, sizes, prev, pager, next, jumper"
        :total="resultNumMain">
      </el-pagination>
    </el-card>
    <el-card class="el-card-table" v-if="isShowSubTable">
      <div slot="header">
        参与者市值明细查询：
        <el-button size="small" type="info" @click="saveLocationSub" v-if="!queryResSubLoad">导出</el-button>
      </div>
      <el-table
        :data="subTableData"
        ref="subTable"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        style="width: 100%"
        v-loading="queryResSubLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
          v-for="column in subTableOptions"
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
      <el-pagination
        @size-change="handleSizeChangeSub"
        @current-change="handleCurrentChangeSub"
        :current-page="currentPageSub"
        :page-sizes="pageSizesSub"
        :page-size="pageSizeSub"
        layout="total, sizes, prev, pager, next, jumper"
        :total="resultNumSub">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import { getProductTypeOptions } from '../../../service/analysisTool/moreStockWithColumn/index'
  import { getCurTradeDate } from '../../../service/common/commonFunc'
  import moment from 'moment'
  import { getParticMarketValMain, getParticMarketValSub } from '../../../service/analysisTool/marketStatistics'

  export default {
    name: 'partic-market-val-query',
    msg: '参与者市值查询',
    data () {
      return {
        productType: '1',
        productTypeOptions: [],
        participantLevel: 'salePart',
        participantLevelOptions: [
          {
            label: '营业部',
            value: 'salePart'
          },
          {
            label: '券商',
            value: 'member'
          },
          {
            label: '各类投资者',
            value: 'kind'
          }
        ],
        date: '',
        // 主表数据
        isShowMainTable: false,
        mainTableData: [],
        queryResMainLoad: false,
        mainTableOptions: [],
        radio: '',
        // 子表数据
        isShowSubTable: false,
        subTableData: [],
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
            label: '证券名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_chn_short_name')
          },
          {
            field: 'position_amount',
            label: '现持有数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'sz',
            label: '现持有市值（单位：亿元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sz'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        queryResSubLoad: false,
        // 营业部主表及子表列设置
        salePartMain: [
          {
            field: 'brnid',
            label: '营业部代码',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'brnid')
          },
          {
            field: 'branch_name',
            label: '营业部名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')
          },
          {
            field: 'position_amount',
            label: '现持有数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'sz',
            label: '现持有市值（单位：亿元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sz'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        // 券商主表及子表列设置
        memberMain: [
          {
            field: 'member_id',
            label: '券商代码',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'brnid')
          },
          {
            field: 'member_name',
            label: '券商名称',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')
          },
          {
            field: 'position_amount',
            label: '现持有数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'sz',
            label: '现持有市值（单位：亿元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'sz'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        // 各类投资者主表及子表列设置
        kindMain: [
          {
            field: 'flag_name',
            label: '投资者类型',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'a')
          },
          {
            field: 'position_amount',
            label: '现持有数量',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'c'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            field: 'sz',
            label: '现持有市值（单位：亿元）',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'd'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        // 母表分页
        currentPageMain: 1,
        pageSizesMain: [10, 20, 50, 100],
        pageSizeMain: 10,
        resultNumMain: 0,
        // 子表分页
        currentPageSub: 1,
        pageSizesSub: [10, 20, 50, 100],
        pageSizeSub: 10,
        resultNumSub: 0,
        // 母表请求参数暂存
        requestParamsMain: {},
        // 子表请求参数暂存
        requestParamsSub: {}
      }
    },
    mounted () {
      getProductTypeOptions('productType', 'marketStatistics').then(resp => {
        this.productTypeOptions = resp.map(function (item) {
          return {value: item.value, label: item.text}
        })
      })
      getCurTradeDate().then(resp => {
        this.date = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
        console.log(this.date)
      })
    },
    methods: {
      // 查询
      fnGetQueryRes () {
        if (!this.date) {
          this.$message.warning('请选择日期')
          return
        }
        this.isShowMainTable = true
        this.queryResMainLoad = true
        this.requestParamsMain = {
          type: this.productType,
          actorType: this.participantLevel,
          date: this.date,
          pageIndex: this.currentPageMain,
          pageRows: this.pageSizeMain
        }
        this.isShowSubTable = false
        this.getMainTableData(this.requestParamsMain)
        this.tableOptionSelect()
      },
      getMainTableData (params) {
        getParticMarketValMain(params).then(resp => {
          this.queryResMainLoad = false
          this.mainTableData = resp.bizData.metaData
          this.resultNumMain = resp.bizData.totalRows - 0
        })
      },
      // 获取明细数据
      getRadio (row) {
        this.isShowSubTable = true
        this.queryResSubLoad = true
        this.requestParamsSub = {
          type: this.productType,
          actorType: this.participantLevel,
          date: this.date,
          pageIndex: this.currentPageSub,
          pageRows: this.pageSizeSub,
          actorCode: ''
        }
        switch (this.participantLevel) {
          case 'salePart':
            this.requestParamsSub.actorCode = row.brnid
            break
          case 'member':
            this.requestParamsSub.actorCode = row.member_id
            break
          case 'kind':
            this.requestParamsSub.actorCode = row.flag
            break
        }
        this.getSubTableData(this.requestParamsSub)
      },
      getSubTableData (params) {
        getParticMarketValSub(params).then(resp => {
          this.queryResSubLoad = false
          this.subTableData = resp.bizData.metaData
          this.resultNumSub = this.subTableData[0].total - 0
        })
      },
      // 表格列设置切换
      tableOptionSelect () {
        switch (this.participantLevel) {
          case 'salePart':
            this.mainTableOptions = this.salePartMain
            break
          case 'member':
            this.mainTableOptions = this.memberMain
            break
          case 'kind':
            this.mainTableOptions = this.kindMain
            break
        }
      },
      // 主表分页size变更触发事件
      handleSizeChangeMain (val) {
        this.requestParamsMain.pageRows = val
        this.requestParamsMain.pageIndex = 1
        this.currentPageMain = 1
        this.getMainTableData(this.requestParamsMain)
      },
      // 主表分页页码变更触发事件
      handleCurrentChangeMain (val) {
        this.requestParamsMain.pageIndex = val
        this.getMainTableData(this.requestParamsMain)
      },
      // 子表分页size变更触发事件
      handleSizeChangeSub (val) {
        this.currentPageSub = 1
        this.requestParamsSub.pageRows = val
        this.requestParamsSub.pageIndex = 1
        this.getSubTableData(this.requestParamsSub)
      },
      // 子表分页页码变更触发事件
      handleCurrentChangeSub (val) {
        this.requestParamsSub.pageIndex = val
        this.getSubTableData(this.requestParamsSub)
      },
      // 母表导出
      saveLocationMain () {
        let params = this.requestParamsMain
        params['tableColumns'] = [{
          sheetName: '参与者市值汇总查询', fileColumns: this.mainTableOptions
        }]
        params['fileMark'] = 'excel'
        params['markType'] = 'marketQuery'
        delete params.pageIndex
        delete params.pageRows
        this.gfnExportFileWithForm('/regularqry/general/v1/exports', params)
      },
      // 子表导出
      saveLocationSub () {
        let params = this.requestParamsSub
        params['tableColumns'] = [{
          sheetName: '参与者市值明细查询', fileColumns: this.subTableOptions
        }]
        delete params.pageIndex
        delete params.pageRows
        params['fileMark'] = 'excel'
        params['markType'] = 'marketQuerySub'
        this.gfnExportFileWithForm('/regularqry/general/v1/exports', params)
      }
    }
  }
</script>

<style lang='less' scoped>
  .partic-market-val-query {
    /deep/ .radio {
      /deep/ .el-radio__label {
        display: none;
      }
    }
  }
</style>
