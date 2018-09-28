<template>
  <div>
    <el-card>
      <el-form :inline="true" ref="form" :rules="formRules" :model="formData" label-width="80px">
        <el-form-item label="产品类型" prop="productionType">
          <el-checkbox v-model="formData.productionType" v-for="(item,index) in checkboxData" :label="item.id" :key="index">{{item.label}}</el-checkbox>
        </el-form-item>
        <el-form-item label="时间范围" prop="dateTimeRange">
          <el-date-picker
            v-model="formData.dateTimeRange"
            type="datetimerange"
            range-separator=" - "
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="small"
            value-format="yyyyMMdd HHmmss"
            :default-time="['09:00:00', '15:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" size="small" @click="dialogFormVisble=true">双人双密</el-button>
        <el-button @click="query" class="fr" :disabled="isDisabled" :loading="isLoading" type="primary" size="small">查询</el-button>
      </el-form>
    </el-card>
    <double-per-dou-psw @isPass="getPassInfo" @isShow="getShowDilog" :dialogFormVisble="dialogFormVisble"></double-per-dou-psw>
    <el-card v-if="tableName !== ''" class="reportTable">
      <div slot="header" class="clearfix">
        一般机构投资者申报（汇总）
        <el-button type="primary" size="small" @click="exportGeneralAccount">导出本页</el-button>
      </div>
      <el-table
        :data="generalData"
        ref="reportTable"
        border
        tooltip-effect="dark"
        height="350"
        size="small"
        show-summary
        :summary-method="generalSum"
        highlight-current-row
        @row-click="queryTrade"
        style="width: 100%">
        <el-table-column width="50" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="scope.row.member_id" @change="queryTrade(scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-for="column in columns"
          :show-overflow-tooltip="true"
          :key="column.field"
          :label="column.label"
          :prop="column.field"
          :width="column.width"
          :min-width="column.minWidth"
          :class-name="column.className"
          :align="column.align == null ? 'center' : column.align"
          :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
          :sortable="column.sortable == null ? false : column.sortable"
          :sort-method="column.sortMethod"
          :formatter="column.formatter">
        </el-table-column>
      </el-table>
    </el-card>
    <el-row :gutter="30">
      <el-col :span="12">
        <el-card class="reportTable" v-if="buyName !== ''">
          <div slot="header" class="clearfix">
            {{buyName}}
            <el-button type="primary" size="small" @click="exportGeneralAccountDetail">导出本页</el-button>
          </div>
          <el-table
            :data="generalBuyData"
            ref="generalBuy"
            border
            tooltip-effect="dark"
            height="400"
            size="small"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              v-for="column in columnsBuy"
              :show-overflow-tooltip="true"
              :key="column.field"
              :label="column.label"
              :prop="column.field"
              :width="column.width"
              :min-width="column.minWidth"
              :class-name="column.className"
              :align="column.align == null ? 'center' : column.align"
              :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod"
              :formatter="column.formatter">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="reportTable" v-if="saleName !== ''">
          <div slot="header" class="clearfix">
            {{saleName}}
            <el-button type="primary" size="small" @click="exportGeneralAccountDetail">导出本页</el-button>
          </div>
          <el-table
            :data="generalSaleData"
            ref="generalSale"
            border
            tooltip-effect="dark"
            height="400"
            size="small"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              v-for="column in columnsSale"
              :show-overflow-tooltip="true"
              :key="column.field"
              :label="column.label"
              :prop="column.field"
              :width="column.width"
              :min-width="column.minWidth"
              :class-name="column.className"
              :align="column.align == null ? 'center' : column.align"
              :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod"
              :formatter="column.formatter">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import moment from 'moment'
  import DoublePerDouPsw from '@/components/common/DoublePerDouPsw'
  import { getCurTradeDate } from '@/service/common/commonFunc'
  import {
    generalInvestors,
    generalInvestorsTrade
  } from '@/service/marketSupervise/classifiedInvestorMonitoring'

  let d3 = require('d3-format')
  export default {
    components: {DoublePerDouPsw},
    name: 'various-investors',
    data () {
      return {
        tableName: '',
        buyName: '',
        saleName: '',
        formData: {
          productionType: [1],
          dateTimeRange: []
        },
        radio: '',
        checkboxData: [
          {id: 1, label: 'A股'},
          {id: 2, label: '基金'},
          {id: 3, label: '国债(含地方债)'},
          {id: 4, label: '公司债'},
          {id: 10, label: '转债'},
          {id: 21, label: '私募债'},
          {id: 22, label: '低等级债'},
          {id: 11, label: '质押式回购'},
          {id: 5, label: '买断式回购'},
          {id: 6, label: '权证'},
          {id: 9, label: '国际板'},
          {id: 8, label: '沪深300指数成分股'},
          {id: 23, label: '上证50指数成分股'},
          {id: 24, label: '中证500指数成分股'},
          {id: 12, label: '风险警示板'},
          {id: 16, label: '优先股'}
        ],
        isDisabled: true,
        isLoading: false,
        dialogFormVisble: false,
        generalData: [],
        totalData: [],
        generalBuyData: [],
        generalSaleData: [],
        columns: [
          {label: '券商代码', field: 'member_id', align: 'left', width: '320', isShow: true},
          {label: '券商名称', field: 'member_name', align: 'left', width: '320', isShow: true},
          {
            label: '申买总金额（元）',
            field: 'ordamt_b',
            align: 'right',
            isShow: true,
            width: '320',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordamt_b'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '申卖总金额（元）',
            field: 'ordamt_s',
            align: 'right',
            isShow: true,
            width: '320',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordamt_s'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '净额（元）',
            field: 'je',
            align: 'right',
            width: '320',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'je'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        columnsBuy: [
          {label: '证券代码', field: 'instrument_id', align: 'left', isShow: true},
          {label: '证券简称', field: 'instrument_chn_short_name', align: 'left', isShow: true},
          {
            label: '申买数量',
            field: 'ordqty_b',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_b'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '申买金额',
            field: 'ordamt_b',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordamt_b'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '申买均价',
            field: 'jj',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'jj'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        columnsSale: [
          {label: '证券代码', field: 'instrument_id', align: 'left', isShow: true},
          {label: '证券简称', field: 'instrument_chn_short_name', align: 'left', isShow: true},
          {
            label: '申卖数量',
            field: 'ordqty_s',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordqty_s'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '申卖金额',
            field: 'ordamt_s',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordamt_s'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '申卖均价',
            field: 'jj',
            align: 'right',
            isShow: true,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'jj'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        generalParams: {},
        generalDetailParams: {},
        formRules: {
          productionType: [
            {required: true, message: '产品类型为必选'}
          ],
          dateTimeRange: [
            {required: true, message: '时间范围为必选'}
          ]
        }
      }
    },
    watch: {
      'formData.productionType': function (newValue) {
        if (newValue.length < 2) {
          return
        }
        let only = [8, 9, 12, 23, 24]
        let newCode = newValue[newValue.length - 1]
        let containOnly = false
        if (only.includes(newCode)) {
          this.formData.productionType = [newCode]
          containOnly = true
        }
        if (!containOnly && only.includes(this.formData.productionType[0])) {
          this.formData.productionType.splice(0, 1)
        }
      }
    },
    methods: {
      getPassInfo (val) {
        this.isDisabled = !val
      },
      getShowDilog (val) {
        this.dialogFormVisble = val
      },
      formatDec (val) {
        let pattern = ',.' + 3 + 'f'
        return d3.format(pattern)(val)
      },
      generalSum () {
        const sums = ['']
        sums.push(this.totalData.member_id)
        sums.push(this.totalData.member_name)
        sums.push(this.formatDec(this.totalData.ordamt_b))
        sums.push(this.formatDec(this.totalData.ordamt_s))
        sums.push(this.formatDec(this.totalData.je))
        return sums
      },
      query () {
        if ($.isEmptyObject(this.formData.productionType)) {
          this.$message.error('产品类型为必选!')
          return
        }
        if ($.isEmptyObject(this.formData.dateTimeRange)) {
          this.$message.error('时间范围为必选!')
          return
        }
        this.isLoading = true
        this.generalParams = {
          productionTypeStr: this.formData.productionType.join(','),
          orderBy: 'ordamt_b',
          orderType: 'desc',
          start: moment(this.formData.dateTimeRange[0]).format('YYYYMMDD HHmmss'),
          end: moment(this.formData.dateTimeRange[1]).format('YYYYMMDD HHmmss')
        }
        generalInvestors(JSON.stringify(this.generalParams)).then(resp => {
          if (resp.data) {
            this.tableName = resp.name
            this.totalData = resp.data.pop()
            this.generalData = resp.data
          } else {
            this.tableName = ''
            this.totalData = []
            this.generalData = []
            this.$message.error('暂未查询到相关数据!')
          }
          this.radio = ''
          this.buyName = ''
          this.saleName = ''
          this.isLoading = false
        })
      },
      queryTrade (row) {
        if (this.radio === row.member_id) {
          return
        }
        this.radio = row.member_id
        this.generalDetailParams = {
          productionTypeStr: this.formData.productionType.join(','),
          memberId: row.member_id,
          start: moment(this.formData.dateTimeRange[0]).format('YYYYMMDD HHmmss'),
          end: moment(this.formData.dateTimeRange[1]).format('YYYYMMDD HHmmss')
        }
        generalInvestorsTrade(JSON.stringify(this.generalDetailParams)).then(resp => {
          let respData = resp
          this.generalBuyData = respData[0].data
          this.buyName = respData[0].name
          this.generalSaleData = respData[1].data
          this.saleName = respData[1].name
        })
      },
      exportGeneralAccount () {
        let param = JSON.parse(JSON.stringify(this.generalParams))
        param.tableColumns = [{'sheetName': '一般机构投资者申报统计', 'fileColumns': this.columns}]
        this.gfnExportFile('/fluct/investor-classifieds-order/v1/general-account-export', JSON.stringify(param))
      },
      exportGeneralAccountDetail () {
        let param = JSON.parse(JSON.stringify(this.generalDetailParams))
        param.tableColumns = [
          {'sheetName': '一般机构投资者申报统计-买详情', 'fileColumns': this.columnsBuy},
          {'sheetName': '一般机构投资者申报统计-卖详情', 'fileColumns': this.columnsSale}
        ]
        this.gfnExportFile('/fluct/investor-classifieds-order/v1/general-account-trade-detail-export', JSON.stringify(param))
      }
    },
    mounted () {
      getCurTradeDate().then(resp => {
        this.formData.dateTimeRange = [resp + ' 090000', resp + ' 150000']
      })
    }
  }
</script>

<style scoped lang="less">
  .el-checkbox {
    margin-left: 0;
    margin-right: 20px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-button--primary {
    margin: 5px 0;
  }

  /deep/ .el-card__body {
    .el-form-item:first-of-type {
      .el-form-item__content {
        width: 94%;
      }
    }
  }

  .reportTable {
    /deep/ .el-card__body {
      padding: 0;
    }
    /deep/ .el-table__footer-wrapper {
      tbody {
        td:nth-of-type(4),
        td:nth-of-type(5),
        td:nth-of-type(6) {
          text-align: right;
        }
      }
    }
  }
</style>
