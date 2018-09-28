<!--参与者申报查询-->
<template>
  <div class="report-query">
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
        <el-col :xl="8" :md="12" :sm="24">
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
        <el-col :xl="8" :md="12" :sm="24">
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
        <el-col :xl="6" :md="12" :sm="24" v-if="participantLevel!=='kind'">
          <el-form-item label="前N名：" required>
            <el-input size="small" v-model="topNNum" style="width: 100px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :md="12" :sm="24">
          <el-form-item label="时间类别：">
            <el-select
              size="small"
              v-model="timeType">
              <el-option
                v-for="item in timeTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :md="12" :sm="24" v-if="timeType==='0'">
          <el-form-item label="时间范围：">
            <el-date-picker v-model="selectTradeDate"
                            :unlink-panels="true"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                            @change="handlerChangetime"
                            size="small"/>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :md="12" :sm="24" v-else>
          <el-form-item label="时间范围：">
            <el-date-picker v-model="selectTradeDate"
                            :unlink-panels="true"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            size="small"/>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card class="el-card-table" v-if="isShowMainTable">
      <div slot="header">
        参与者申报汇总查询：
        <el-button size="small" type="info" @click="saveLocationMain" v-if="mainTableData.length!==0">导出</el-button>
      </div>
      <el-table
        :data="mainTableData"
        ref="mainTable"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        style="width: 100%"
        height="490"
        v-loading="queryResMainLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio"
                      :label="requestParamsMain.actorType==='salePart'?scope.row.brnid:(requestParamsMain.actorType==='member'?scope.row.member_id:(requestParamsMain.actorType==='pbu'?scope.row.pbuid:scope.row.flag_name))"
                      v-if="requestParamsMain.actorType==='salePart'?scope.row.brnid!=='合计':(requestParamsMain.actorType==='member'?scope.row.member_id!=='合计':(requestParamsMain.actorType==='pbu'?scope.row.branch_name!=='合计':scope.row.flag_name!=='合计'))"
                      @change="getRadio(scope.row)"></el-radio>
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
    </el-card>
    <el-card class="el-card-table" v-if="isShowSubTable">
      <div slot="header">
        参与者申报明细查询：
        <el-button size="small" type="info" @click="saveLocationSub" v-if="subTableData.length!==0">导出</el-button>
      </div>
      <el-table
        :data="subTableData"
        ref="subTable"
        border
        size="small"
        style="width: 100%"
        height="450"
        tooltip-effect="dark"
        highlight-current-row
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
  import moment from 'moment'
  import { getCurTradeDate } from '../../../service/common/commonFunc'
  import {
    getParticDeclrationDataMain,
    getParticDeclrationDataSub
  } from '../../../service/analysisTool/marketStatistics'

  export default {
    name: 'partic-declration-query',
    props: [],
    components: {},
    mixin: [],
    data () {
      return {
        //  msg:'参与者申报查询',
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
            label: 'PBU',
            value: 'pbu'
          },
          {
            label: '各类投资者',
            value: 'kind'
          }
        ],
        topNNum: '50',
        timeType: '0',
        timeTypeOption: [
          {value: '0', label: '带时间'},
          {value: '1', label: '不带时间'}
        ],
        // 日期
        selectTradeDate: [],
        // 主表数据
        isShowMainTable: false,
        mainTableData: [],
        queryResMainLoad: false,
        firstColumnOption: {
          field: 'brnid',
          label: '',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'brnid')
        },
        mainTableOptions: [
          {
            field: 'branch_name',
            label: '',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')
          },
          {
            field: 'decmvlb1',
            label: '申报买入金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'decmvlb1'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'decmvls2',
            label: '申报卖出金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'decmvls2'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'trdmvlb3',
            label: '买成交金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdmvlb3'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'trdmvls4',
            label: '卖成交金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdmvls4'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'ntrdmvlb5',
            label: '买未成交金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ntrdmvlb5'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'ntrdmvls6',
            label: '卖未成交金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ntrdmvls6'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          }
        ],
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
            field: 'decmvlb1',
            label: '申报买入金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'decmvlb1'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'decmvls2',
            label: '申报卖出金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'decmvls2'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'trdmvlb3',
            label: '买成交金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdmvlb3'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'trdmvls4',
            label: '卖成交金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdmvls4'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'ntrdmvlb5',
            label: '买未成交金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ntrdmvlb5'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          },
          {
            field: 'ntrdmvls6',
            label: '卖未成交金额',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ntrdmvls6'),
            formatter: this.gfnElColFormatDecThouNoneFloat
          }
        ],
        queryResSubLoad: false,

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
    computed: {},
    watch: {
      timeType: function () {
        this.getTradeDate()
      }
    },
    methods: {
      fnGetQueryRes () {
        if (!this.topNNum) {
          this.$message.warning('前N名不能为空')
          return
        }
        if ($.isEmptyObject(this.selectTradeDate)) {
          this.$message.warning('时间格式不正确，请重新选择')
          return
        }
        this.isShowMainTable = true
        this.radio = ''
        this.isShowSubTable = false
        this.changeColumnLabel()
        this.getMainTableData()
      },
      getMainTableData () {
        this.mainTableData = []
        this.queryResMainLoad = true
        this.requestParamsMain = {
          type: this.productType,
          actorType: this.participantLevel,
          dateTimeStart: this.selectTradeDate[0],
          dateTimeEnd: this.selectTradeDate[1],
          mark: this.timeType,
          rank: this.topNNum
        }
        if (this.participantLevel === 'kind') {
          delete this.requestParamsMain.rank
        }
        getParticDeclrationDataMain(this.requestParamsMain).then(resp => {
          this.queryResMainLoad = false
          this.mainTableData = resp.bizData.metaData
        })
      },
      changeColumnLabel () {
        switch (this.participantLevel) {
          case 'salePart':
            this.firstColumnOption.label = '营业部代码'
            this.firstColumnOption.field = 'brnid'
            if (this.mainTableOptions.length === 8) {
              this.mainTableOptions.splice(0, 1)
            }
            this.mainTableOptions[0].label = '营业部名称'
            this.mainTableOptions[0].field = 'branch_name'
            this.mainTableOptions.unshift(this.firstColumnOption)
            break
          case 'member':
            this.firstColumnOption.label = '券商代码'
            this.firstColumnOption.field = 'member_id'
            if (this.mainTableOptions.length === 8) {
              this.mainTableOptions.splice(0, 1)
            }
            this.mainTableOptions[0].label = '券商名称'
            this.mainTableOptions[0].field = 'member_name'
            this.mainTableOptions.unshift(this.firstColumnOption)
            break
          case 'pbu':
            this.firstColumnOption.label = 'PBU代码'
            this.firstColumnOption.field = 'pbuid'
            if (this.mainTableOptions.length === 8) {
              this.mainTableOptions.splice(0, 1)
            }
            this.mainTableOptions[0].label = '营业部名称'
            this.mainTableOptions[0].field = 'branch_name'
            this.mainTableOptions.unshift(this.firstColumnOption)
            break
          case 'kind':
            if (this.mainTableOptions.length === 8) {
              this.mainTableOptions.splice(0, 1)
            }
            this.mainTableOptions[0].label = '分类投资者类别'
            this.mainTableOptions[0].field = 'flag_name'
            break
        }
      },
      getRadio (row) {
        this.isShowSubTable = true
        this.requestParamsSub = {
          type: this.productType,
          actorType: this.participantLevel,
          dateTimeStart: this.selectTradeDate[0],
          dateTimeEnd: this.selectTradeDate[1],
          mark: this.timeType,
          actorCode: row.brnid,
          pageIndex: this.currentPageSub,
          pageRows: this.pageSizeSub
        }
        switch (this.participantLevel) {
          case 'salePart':
            this.requestParamsSub.actorCode = row.brnid
            break
          case 'member':
            this.requestParamsSub.actorCode = row.member_id
            break
          case 'pbu':
            this.requestParamsSub.actorCode = row.pbuid
            break
          case 'kind':
            this.requestParamsSub.actorCode = row.flag
            break
        }
        this.currentPageSub = 1
        this.getSubTableData()
      },
      getSubTableData () {
        this.subTableData = []
        this.queryResSubLoad = true
        this.requestParamsSub.pageIndex = this.currentPageSub
        this.requestParamsSub.pageRows = this.pageSizeSub
        getParticDeclrationDataSub(this.requestParamsSub).then(resp => {
          this.queryResSubLoad = false
          this.subTableData = resp.bizData.metaData
          this.resultNumSub = resp.bizData.totalRows - 0
        })
      },
      // 子表分页size变更触发事件
      handleSizeChangeSub (val) {
        this.pageSizeSub = val
        this.currentPageSub = 1
        this.getSubTableData(this.requestParamsSub)
      },
      // 子表分页页码变更触发事件
      handleCurrentChangeSub (val) {
        this.currentPageSub = val
        this.getSubTableData(this.requestParamsSub)
      },
      // 主表导出
      saveLocationMain () {
        let params = this.requestParamsMain
        params['tableColumns'] = [{
          sheetName: '参与者申报汇总查询', fileColumns: this.mainTableOptions
        }]
        params['fileMark'] = 'excel'
        params['markType'] = 'applydetail'
        delete params.pageIndex
        delete params.pageRows
        this.gfnExportFileWithForm('/regularqry/general/v1/exports', params)
      },
      // 子表导出
      saveLocationSub () {
        let params = this.requestParamsSub
        params['tableColumns'] = [{
          sheetName: '参与者申报明细查询', fileColumns: this.subTableOptions
        }]
        params['fileMark'] = 'excel'
        params['markType'] = 'applydetailSubmenu'
        delete params.pageIndex
        delete params.pageRows
        this.gfnExportFile('/regularqry/general/v1/export', JSON.stringify(params))
      },
      handlerChangetime (val) {
        if (!val) {
          let [dateStart, timeStart] = val[0].split(' '),
            [dateEnd, timeEnd] = val[1].split(' ')
          if (timeStart === '00:00:00') {
            this.selectTradeDate[0] = dateStart + ' 09:00:00'
          }
          if (timeEnd === '00:00:00') {
            let nowDate = moment(new Date()).format('YYYY-MM-DD')
            if (nowDate === dateEnd) {
              this.selectTradeDate[1] = dateEnd + ' ' + moment(new Date()).format('HH:mm:ss')
            } else {
              this.selectTradeDate[1] = dateEnd + ' 15:00:00'
            }
          }
        }
      },
      getTradeDate () {
        getCurTradeDate().then(resp => {
          let date = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
          if (this.timeType === '0') {
            this.selectTradeDate = [date + ' 09:00:00', date + ' 15:00:00']
            return
          }
          this.selectTradeDate = [date, date]
        })
      }
    },
    created () {
      getProductTypeOptions('productType', 'marketStatistics').then(resp => {
        this.productTypeOptions = resp.map(function (item) {
          return {value: item.value, label: item.text}
        })
      })
      getCurTradeDate().then(resp => {
        let date = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
        this.selectTradeDate = [date + ' 09:00:00', date + ' 15:00:00']
      })
    },
    mounted () {
    },
    beforeDestory () {

    }
  }
</script>

<style lang='less' scoped>
  .report-query {
    /deep/ .radio {
      /deep/ .el-radio__label {
        display: none;
      }
    }
  }
</style>
