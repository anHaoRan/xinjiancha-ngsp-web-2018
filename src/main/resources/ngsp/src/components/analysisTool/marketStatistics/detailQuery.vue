<!--参与者成交查询-->
<template>
    <div class="detailQueryList">
        <el-card>
            <div slot="header" class="clearfix">
                <span>查询条件</span>
                <el-button
                        type="text"
                        @click="PclearForm"
                        size="small">清空
                </el-button>
                <el-button
                        type="primary" size="small"
                        @click="PgetQueryRes">查询
                </el-button>
            </div>
            <el-row>
                <el-col :span="6" style="line-height: 39px;">
                    <el-col :span="5" class="name">
                        <span class="mustInput name">*</span>平台类型：
                    </el-col>
                    <el-col :span="18" class="name">
                        <el-checkbox-group
                                v-model="parMake.orderState"
                                size="small">
                            <el-checkbox label="1">竞价</el-checkbox>
                            <el-checkbox label="2">固定收益</el-checkbox>
                            <el-checkbox label="3">大宗交易</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-col>
                <el-col :span="6" :offset="1" class="name" style="line-height: 39px;">
                    <el-col :span="5" class="name">产品类型：</el-col>
                    <el-col :span="15">
                        <el-select
                                v-model="parMake.tradsType"
                                style="width:100%"
                                placeholder="请选择类别"
                                size="small">
                            <el-option
                                    v-for="traFor in tradeTypeOption"
                                    :key="traFor.value"
                                    :label="traFor.text"
                                    :value="traFor.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="6" style="line-height: 39px;">
                    <el-col :span="6" class="name">参与者层级：</el-col>
                    <el-col :span="15">
                        <el-select
                                v-model="parMake.canyuType"
                                style="width:100%"
                                @change="canyuTypeChange"
                                placeholder="请选择参与者层级"
                                size="small">
                            <el-option
                                    v-for="canFor in canyuTypeOption"
                                    :key="canFor.value"
                                    :label="canFor.text"
                                    :value="canFor.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="4" v-if="parMake.canyuType!=='FLTZ'" style="line-height: 39px;">
                    <el-col :span="6" class="name">
                        <span class="mustInput name">*</span>前N名：
                    </el-col>
                    <el-col :span="10">
                        <el-input
                                v-model="parMake.usuName"
                                placeholder="请输入前N名"
                                @change="usuNameChange"
                                size="small">
                        </el-input>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="7" style="line-height: 39px;">
                    <el-col :span="5" class="name">统计方式：</el-col>
                    <el-col :span="15">
                        <el-select
                                v-model="parMake.tongType"
                                style="width:100%"
                                placeholder="请选择类别"
                                size="small">
                            <el-option
                                    v-for="tongFor in tongTypeOption"
                                    :key="tongFor.value"
                                    :label="tongFor.text"
                                    :value="tongFor.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="6" style="line-height: 39px;">
                    <el-col :span="5" class="name">时间类别：</el-col>
                    <el-col :span="15">
                        <el-select
                                v-model="parMake.timeType"
                                style="width:100%"
                                @change="itemXZ"
                                placeholder="请选择参与者层级"
                                size="small">
                            <el-option
                                    v-for="timeFor in timeTypeOption"
                                    :key="timeFor.value"
                                    :label="timeFor.text"
                                    :value="timeFor.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="10" style="line-height: 39px;">
                    <el-col :span="3" class="name">
                        <span class="mustInput name">*</span>时间范围：
                    </el-col>
                    <!--不带时间可以跨日-->
                    <el-col :span="17" v-if="itemNOT" style="margin-left: 17px;">
                        <el-date-picker style="width: 100% !important"
                                        v-model="parMake.itemN"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        size="small"
                                        format="yyyy-MM-dd"
                                        value-format="yyyyMMdd">
                        </el-date-picker>
                    </el-col>
                    <!--默认显示带时间 不可以跨日-->
                    <el-col :span="21" v-if="itemYES" class="itemClass">
                        <el-col :span="10">
                            <el-date-picker
                                    style="margin: 0 17px;"
                                    v-model="parMake.itemY"
                                    type="date"
                                    @change="getTime"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    size="small">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="12">
                            <el-time-picker style="width: 234px;margin-left: 35px;"
                                            is-range
                                            v-model="parMake.itemS"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="HH:mm:ss"
                                            placeholder="开始时间"
                                            size="small">
                            </el-time-picker>
                        </el-col>
                    </el-col>
                </el-col>
            </el-row>
        </el-card>
        <el-card v-if="parMakeIf">
            <div slot="header">
                <span>交易金额排序统计表</span>
                <el-dropdown @command="downloadBazaarExcel">
                    <el-button type="primary" size="small">
                        导出 <i class="el-icon-arrow-down el-icon-right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="excel">
                            <i class="el-icon-document"></i>导出为EXCEL
                        </el-dropdown-item>
                        <el-dropdown-item command="csv">
                            <i class="el-icon-tickets"></i>导出为CSV
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-table
                    class="el-card-table"
                    height="300"
                    border
                    ref="accountRerf"
                    :data="accountDatas"
                    v-loading="queryResLoadMain"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="数据加载中，请耐心等待..."
                    element-loading-background="rgba(0,0,0,0.3)"
                    show-overflow-tooltip
                    style="width:100%;">
                <el-table-column width="55" align="center">
                    <template slot-scope="scope">
                        <el-radio
                                :disabled="radioDisabled"
                                class="radio"
                                v-model="radio"
                                :label="scope.row[`${prop}`]"
                                @change="getRadio(scope.row)"
                                v-if="scope.row[`${prop}`]!=='合计'">
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column
                        class="el-card-table"
                        v-for="column in biTableList"
                        :key="column.field"
                        :align="column.align"
                        :label="column.label"
                        :prop="column.field"
                        :sortable=column.sortable
                        :sort-method="column.sortMethod"
                        :formatter="column.formatter"
                        v-if="column.isShow"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-pagination
                    :page-size="pageSizeP1"
                    layout="total"
                    :total="totalNumP1">
            </el-pagination>
        </el-card>
        <el-card v-if="idRadioMR">
            <div slot="header">
                <span>产品买入卖出情况表</span>
                <el-button
                        @click="expotFileF" type="primary"
                        size="small" style="float:right;margin:10px 10px;">导出
                </el-button>
            </div>
            <el-row :gutter="20">
                <!--买-->
                <el-col :span="12">
                    <div class="title">产品买入情况表:</div>
                    <el-table class="el-card-table"
                              height="300"
                              border
                              ref="accountRerfB"
                              :data="accountDataB"
                              v-loading="queryResLoadSub"
                              element-loading-spinner="el-icon-loading"
                              element-loading-text="数据加载中，请耐心等待..."
                              element-loading-background="rgba(0,0,0,0.3)"
                              show-overflow-tooltip
                              style="width:100%;">
                        <el-table-column
                                v-for="column in biTableListB"
                                :key="column.field"
                                :align="column.align"
                                :label="column.label"
                                :prop="column.field"
                                :sortable=column.sortable
                                :sort-method="column.sortMethod"
                                :formatter="column.formatter"
                                show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            style="margin-top: 10px;"
                            :page-size="pageSizeP2"
                            layout="total"
                            :total="totalNumP2">
                    </el-pagination>
                </el-col>
                <!--卖-->
                <el-col :span="12" class="el-card-table">
                    <div class="title">产品卖出情况表:</div>
                    <el-table
                            class="el-card-table"
                            height="300"
                            border
                            ref="accountRerf"
                            :data="accountDatad"
                            v-loading="queryResLoadSub"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="数据加载中，请耐心等待..."
                            element-loading-background="rgba(0,0,0,0.3)"
                            show-overflow-tooltip
                            style="width:100%;">
                        <el-table-column
                                v-for="column in biTableListS"
                                :key="column.field"
                                :align="column.align"
                                :label="column.label"
                                :prop="column.field"
                                :sortable=column.sortable3
                                :sort-method="column.sortMethod3"
                                :formatter="column.formatter"
                                show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="margin-top: 10px;"
                                   :page-size="pageSizeP3"
                                   layout="total"
                                   :total="totalNumP3">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
  import moment from 'moment'
  import { getCurTradeDate } from '../../../service/common/commonFunc'
  import {
    marketStatis, // 市场统计查询 【参与者成交查询】接口
    postmarketStatis, // 市场统计查询 【参与者详情查询】接口
    getProductTag1 // 市场统计查询 【产品类型】/ 【参与者层级】公共接口
  } from '../../../service/analysisTool/marketStatistics'
  import Mixin from './Mixin'

  export default {
    mixins: [Mixin],
    data () {
      return {
        // 查询条件
        parMake: {
          orderState: ['1'], // 平台类型
          tradsType: '1', // 产品类别
          tongType: 'B', // 统计方式
          canyuType: 'B', // 参与者层级
          timeType: '1', //  时间类别
          itemN: [], // 日期范围
          itemY: '', // 日期范围
          itemS: [new Date(2013, 9, 11, 9, 0), new Date(2013, 9, 11, 17, 0)], // 开始时间
          usuName: '50' // 前N名
        },
        radio: '',
        radioDisabled: false,
        itemNOT: false, // 不带时间
        itemYES: true, // 默认显示带时间
        // 产品类型值下拉内容
        tradeTypeOption: [
          {value: '1', text: 'A股'}
        ],
        // 参与者层级
        canyuTypeOption: [
          {value: 'B', text: '营业部'}
        ],
        // 统计方式
        tongTypeOption: [{value: 'B', text: '买入'}, {value: 'S', text: '卖出'}, {value: 'R', text: '净买入'}, {value: 'P', text: '净卖出'}, {value: '', text: '总额'}],
        // 时间类别
        timeTypeOption: [{value: '0', text: '不带时间'}, {value: '1', text: '带时间'}],
        // 时间范围
        parMakeIf: false,   // 查询结果不显示
        idRadioMR: false,   // 详情查询结果不显示
        biTableList: [], // 参与者成交查询表格 - tab
        biTableListB: [
          {
            label: '证券代码',
            field: 'instrument_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '证券简称',
            field: 'instrument_chn_short_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_chn_short_name')
          },
          {
            label: '买入数量',
            field: 'trdqty',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty'),
            formatter: this.gfnElColFormatDecThou0,
            format:'#,##0'
          },
          {
            label: '买入金额',
            field: 'trdamt',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt'),
            formatter: this.gfnElColFormatDecThou3,
            format:'#,##0.000'
          },
          {
            label: '买入均价',
            field: 'ap',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ap'),
            formatter: this.gfnElColFormatDecThou3,
            format:'#,##0.000'
          }
        ],  // 参与者详情查询表格-买入 - tab
        biTableListS: [
          {
            label: '证券代码',
            field: 'instrument_id',
            width: '12%',
            align: 'left',
            sortable3: true,
            sortMethod3: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '证券简称',
            field: 'instrument_chn_short_name',
            width: '12%',
            align: 'left',
            sortable3: true,
            sortMethod3: this.gfnSortColByNumber.bind(this, 'instrument_chn_short_name')
          },
          {
            label: '卖出数量',
            field: 'trdqty',
            width: '12%',
            align: 'right',
            sortable3: true,
            sortMethod3: this.gfnSortColByNumber.bind(this, 'trdqty'),
            formatter: this.gfnElColFormatDecThou0,
            format:'#,##0'
          },
          {
            label: '卖出金额',
            field: 'trdamt',
            width: '12%',
            align: 'right',
            sortable3: true,
            sortMethod3: this.gfnSortColByNumber.bind(this, 'trdamt'),
            formatter: this.gfnElColFormatDecThou3,
            format:'#,##0.000'
          },
          {
            label: '卖出均价',
            field: 'ap',
            width: '12%',
            align: 'right',
            sortable3: true,
            sortMethod3: this.gfnSortColByNumber.bind(this, 'ap'),
            formatter: this.gfnElColFormatDecThou3,
            format:'#,##0.000'
          }
        ], // 参与者详情查询表格-卖出 - tab
        accountDatas: [],
        accountDataB: [],
        accountDatad: [],
        clAll: [],  // 清空時間
        pageSizeP1: 10,
        totalNumP1: 0,
        pageSizeP2: 10,
        totalNumP2: 0,
        pageSizeP3: 10,
        totalNumP3: 0,
        queryResLoadMain: false,
        queryResLoadSub:false,
        mainTableRequest: {},
        subTableRequest: {}
      }
    },
    props: ['commonData'],
    computed: {
      prop () {
        return this.parMake.canyuType === 'FLTZ' ? 'flag_name' : 'id'
      }
    },
    watch: {
      commonData: {
        handler: function () {
          this.getStockCode()
        },
        deep: true
      }
    },
    methods: {
      // 参与者层级
      canyuTypeChange (val) {
        if (val == 'FLTZ') {
          this.parMake.usuName = ''
        } else {
          this.parMake.usuName = '50'
        }
      },
      // 前N名
      usuNameChange (val) {
        if (val && (isNaN(val) || !/^\d+$/.test(val) || Number(val) < 0)) {
          this.$message.error('前N名只能是正整数')
          return true
        }
        return false
      },
      // 时间类别--带时间或不带时间选择
      itemXZ (val) {
        if (val === '1') {
          this.itemYES = true
          this.itemNOT = false
        } else {
          this.itemYES = false
          this.itemNOT = true
        }
      },
      // 带时间 不可以跨日
      getTime (val) {
        let parMakeItemY = moment(val, 'YYYYMMDD').format('YYYY-MM-DD')
        this.parMake.itemY = parMakeItemY
      },
      // 导出主表
      downloadBazaarExcel (val) {
        let newParams = {
          type:'particiBargainSum',
          fileMark: val,
          tableColumns: [
            {
              sheetName: '交易金额排序统计表', fileColumns: this.biTableList
            }
          ]
        }
        let params = {...this.mainTableRequest,...newParams}
        this.gfnExportFileWithForm('/regularqry/marketstatis/v1/export', params)
      },
      // 导出子表
      expotFileF () {
        let newParams = {
          type:'particiBargainDetail',
          fileMark: 'excel',
          tableColumns: [
            {
              sheetName: '产品买入情况表', fileColumns: this.biTableListB
            },
            {
              sheetName: '产品卖出情况表', fileColumns: this.biTableListS
            }
          ]
        }
        let params = {...this.subTableRequest,...newParams}
        this.gfnExportFileWithForm('/regularqry/marketstatis/v1/export', params)
      },
      //  产品类型下拉内容获取
      productTypeOptions () {
        getProductTag1('productType', 'actorQuary').then((resp) => {
          this.tradeTypeOption = resp
        })
      },
      // 参与者层级
      participantLevelSelectOptions () {
        getProductTag1('particiLevel', 'actorQuary').then((resp) => {
          this.canyuTypeOption = resp
        })
      },
      // 初始时间
      getItme () {
        this.parMake.itemS[0] = moment(this.parMake.itemS[0], 'HHmmss').format('HH:mm:ss')
        this.parMake.itemS[1] = moment(this.parMake.itemS[1], 'HHmmss').format('HH:mm:ss')
      },
      // 清空事件
      PclearForm () {
        this.parMakeIf = false
        this.itemNOT = false
        this.itemYES = true
        this.parMake.orderState = ['1'] // 平台类型
        this.parMake.tradsType = '1' // 产品类型
        this.parMake.tongType = 'B' // 统计方式
        this.parMake.canyuType = 'B' // 参与者层级
        this.parMake.timeType = '1' //  时间类别(不带时间、带时间)
        this.parMake.usuName = '50' // 前N名
        if (this.itemNOT) {
          let itemAll = [this.clAll, this.clAll]
          this.parMake.itemN = [moment(itemAll[0], 'YYYYMMDD').format('YYYY-MM-DD'), moment(itemAll[1], 'YYYYMMDD').format('YYYY-MM-DD')] // 时间范围
        }
      },
      // 查询事件
      PgetQueryRes () {
        this.queryResLoadMain = true
        this.radio = ''
        if (this.usuNameChange(this.parMake.usuName)) {
          return
        }
        switch (this.parMake.canyuType) {
          case 'B' : // 营业部
            this.biTableList = this.CYZCX.CHAX1
            break
          case 'P': // PBU
            this.biTableList = this.CYZCX.CHAX2
            break
          case 'M': // 券商
            this.biTableList = this.CYZCX.CHAX3
            break
          case 'FLTZ': // 各类投资者
            this.biTableList = this.CYZCX.CHAX4
            break
        }
        this.idRadioMR = false
        if (this.parMake.orderState != '') {
          this.parMakeIf = true // 查询结果显示
          let dateTimeStartV = ''
          let dateTimeEndV = ''
          if (this.parMake.timeType == '0') {
            // 不带时间
            dateTimeStartV = moment(this.parMake.itemN[0], 'YYYYMMDD').format('YYYY-MM-DD')
            dateTimeEndV = moment(this.parMake.itemN[1], 'YYYYMMDD').format('YYYY-MM-DD')
          } else if (this.parMake.timeType == '1') {
            // 带时间
            dateTimeStartV = moment(this.parMake.itemY, 'YYYYMMDD').format('YYYY-MM-DD') + ' ' + this.parMake.itemS[0]
            dateTimeEndV = moment(this.parMake.itemY, 'YYYYMMDD').format('YYYY-MM-DD') + ' ' + this.parMake.itemS[1]
          }
          this.mainTableRequest = {
            type_t: this.parMake.timeType,
            staType: this.parMake.tongType,
            platType: this.parMake.orderState.join(','),
            actType: this.parMake.canyuType,
            isProductType: this.parMake.tradsType,
            rank: this.parMake.usuName,
            dateTimeStart: dateTimeStartV,
            dateTimeEnd: dateTimeEndV
          }
          marketStatis(this.mainTableRequest).then((resp) => {
            this.queryResLoadMain = false
            this.accountDatas = resp.totalList
            this.totalNumP1 = resp.totalRows - 0
          })
        } else {
          this.parMakeIf = false   // 查询结果不显示
          this.$message.error('平台类型不能为空')
        }
      },
      // 参与者详情查询
      // eslint-disable-next-line
      getRadio (val) {
        this.idRadioMR = true
        let dateTimeStartZ = ''
        let dateTimeEndZ = ''
        let radioId = val.id
        if (this.parMake.timeType == 0) {
          // 不带时间
          dateTimeStartZ = moment(this.parMake.itemN[0], 'YYYYMMDD').format('YYYY-MM-DD')
          dateTimeEndZ = moment(this.parMake.itemN[1], 'YYYYMMDD').format('YYYY-MM-DD')
        } else if (this.parMake.timeType == 1) {
          dateTimeStartZ = moment(this.parMake.itemY, 'YYYYMMDD').format('YYYY-MM-DD') + ' ' + this.parMake.itemS[0]
          dateTimeEndZ = moment(this.parMake.itemY, 'YYYYMMDD').format('YYYY-MM-DD') + ' ' + this.parMake.itemS[1]
        }
        this.queryResLoadSub = true
        this.subTableRequest = {
          type_t: this.parMake.timeType,
          platType: this.parMake.orderState.join(','),
          actType: this.parMake.canyuType,
          isProductType: this.parMake.tradsType,
          id: radioId,
          dateTimeStart: dateTimeStartZ,
          dateTimeEnd: dateTimeEndZ
        }
        postmarketStatis(this.subTableRequest).then((resp) => {
          this.queryResLoadSub = false
          this.accountDataB = resp.totalListB
          this.accountDatad = resp.totalListS
          this.totalNumP2 = resp.totalRowsB
          this.totalNumP3 = resp.totalRowsS
        })

      }
    },
    mounted () {
      // 初始化时间
      getCurTradeDate().then(resp => {
        this.parMake.itemN = [resp, resp]
        this.parMake.itemY = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
        this.clAll = this.parMake.itemN
      })
      // 初始化日期
      this.getItme()
      // 产品类型下拉内容获取
      this.productTypeOptions()
      // 参与者层级
      this.participantLevelSelectOptions()
    }
  }
</script>
<style lang="less">
    .detailQueryList {
        .title {
            font-size: 16px;
            margin-bottom: 10px;
            margin-left: 5px;
        }
        .el-row {
            margin-top: 10px !important;
        }
        .mustInput {
            font-size: 14px;
            color: #ff402b;
            position: relative;
            right: 3px;
            top: 3px;
        }
        .el-radio__label {
            display: none !important;
        }
        .el-date-editor .el-range-input {
            width: 33% !important;
        }
        .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 247px !important;
        }
        .participatorType .el-button--primary {
            margin-top: 5px !important;
        }
    }

</style>
