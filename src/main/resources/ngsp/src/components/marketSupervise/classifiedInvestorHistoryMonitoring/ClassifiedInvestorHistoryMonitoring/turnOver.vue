<template>
  <div class="turnOver">
    <el-card class="el-card-table">
      <div slot="header" class="clearfix">
        分类投资者换手率
      </div>
      <el-row>
        <el-form :inline="true" :model="selectParams" style="padding-left: 20px">
          <el-form-item label="证券">
            <div @click="stockSelect" style="display: inline-block;">
              <el-input type="text" readonly="true" placeholder="请选择" :value="selectParams.securityCode + selectParams.securityName" size="mini">
                {{selectParams.securityCode + selectParams.securityName}}
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="dateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="handleRangeDate"
              :picker-options="pickerOptions"
              size="mini">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="getData" :loading="dataLoading" type="primary" size="small">查询</el-button>
          </el-form-item>
          <el-form-item class="icon">
            <i class="fa el-icon-download" @click="turnOverExcel" style="font-size: 24px"></i>
          </el-form-item>
        </el-form>
      </el-row>
      <select-code-box
        @refreshIsShow="refreshIsShowBox"
        @refreshAddItems="refreshAddItemList"
        class="addItemBox"
        v-show="stockShow"
        @getCode="getCode"
        @closeSelect="closeSelect"
        style="position: absolute;top: 40px;z-index: 10">
      </select-code-box>
      <el-table
        :data="majorHoldCount"
        border
        v-loading="dataLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)"
        tooltip-effect="dark"
        size="small"
        :cell-class-name="this.tableColumnClassName"
        highlight-current-row
        style="width: 100%;">
        <el-table-column
          v-for="column in majorHoldColumns"
          :key=column.field
          :align=column.align
          :prop=column.field
          :label=column.label
          :sortable=column.sortable
          :sort-method="column.sortMethod"
          :min-width=column.minWidth>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

</template>

<script>
  import moment from 'moment'
  import SelectCodeBox from '../../../common/selectCodeBox'
  import { getRelativeTradeDate } from '../../../../service/common/commonFunc'
  import { postTurnOverData } from '../../../../service/marketSupervise/classifiedInvestorMonitoring/index'

  export default {
    name: 'detail-holding',
    components: {
      SelectCodeBox
    },
    data () {
      let selfDisabledDate = 0
      let isSelectStartDate = true
      return {
        tDate: '',
        stockShow: false, // 证券选择框
        selectParams: {
          securityName: ' 上证指数', // 证券选择框显示内容
          securityCode: '000001' // 证券选择框
        },
        dataLoading: false,
        majorHoldCount: [], // 表格数据
        majorHoldColumns: [
          {label: '机构类别', field: 'type', align: 'center'},
          {label: '公募基金', field: 'a', align: 'center'},
          {label: '基金专户', field: 'c', align: 'center'},
          {label: '社保基金', field: 'd', align: 'center'},
          {label: 'QFII', field: 'e', align: 'center'},
          {label: 'RQFII', field: 'm', align: 'center'},
          {label: '保险机构', field: 'f', align: 'center'},
          {label: '信托产品', field: 'i', align: 'center'},
          {label: '企业年金', field: 'j', align: 'center'},
          {label: '券商自营', field: 'g', align: 'center'},
          {label: '券商集合理财', field: 'h', align: 'center'},
          {label: '沪股通', field: 'o', align: 'center'},
          {label: '其他机构', field: 'z', align: 'center'},
          {label: '超大户(1000万元以上)', field: 'g1', align: 'center'},
          {label: '大户(300-1000万元)', field: 'g2', align: 'center'},
          {label: '中户(50-300万元)', field: 'g3', align: 'center'},
          {label: '小户(10-50万元)', field: 'g4', align: 'center'},
          {label: '散户(10万元以下)', field: 'g5', align: 'center'}
        ],
        dateValue: [],
        pickerOptions: {
          disabledDate: (time) => {
            if (isSelectStartDate) {
              return time.getTime() > new Date(moment(this.tDate, 'YYYYMMDD').format('YYYY,MM,DD')).getTime()
            }
            return time.getTime() < selfDisabledDate || time.getTime() > new Date(moment(this.tDate, 'YYYYMMDD').format('YYYY,MM,DD')).getTime()
          },
          onPick: ({maxDate, minDate}) => {
            if (!maxDate) {
              isSelectStartDate = false
              selfDisabledDate = new Date(minDate).getTime()
            } else {
              isSelectStartDate = true
            }
          }
        },
        startTradeDate: '', // 开始日期参数
        endTradeDate: '' // 结束日期参数
      }
    },
    mounted () {
      getRelativeTradeDate(-1).then(val => {
        this.tDate = val
        this.dateValue.push(moment(val, 'YYYYMMDD').format('YYYY-MM-DD'))
        this.dateValue.push(moment(val, 'YYYYMMDD').format('YYYY-MM-DD'))
      })
      this.getData()
    },
    methods: {
      stockSelect () {
        this.stockShow = true
      },
      refreshIsShowBox (state) {
        this.isMore = state
      },
      refreshAddItemList (list, obj) {
        this.isMore = false
        this.addList = list
        this.addCodeName = obj
      },
      getCode (code, name) {
        this.selectParams.securityName = ' ' + name
        this.selectParams.securityCode = code
        this.stockShow = false
      },
      closeSelect () {
        this.stockShow = false
      },
      // 列颜色定义
      tableColumnClassName ({column}) { // eslint-disable-line
        if (column.label === '沪市A股') {
          return 'orange'
        }
      },
      handleRangeDate (val) {
        if (val) {
          this.startTradeDate = val[0]
          this.endTradeDate = val[1]
        } else {
          this.startTradeDate = ''
          this.endTradeDate = ''
        }
      },
      turnOverExcel () {
        let param = {
          code: this.selectParams.securityCode,
          startTradeDate: this.startTradeDate,
          endTradeDate: this.endTradeDate
        }
        param.fileType = 'excel'
        param.gridType = 'TurnoverRate'
        param.tableColumns = this.majorHoldColumns
        this.gfnExportFileWithForm('/fluct/investor-classifieds-trade-supervise/v1/export-history-file', param)
      },
      getData () {
        let params = {
          code: this.selectParams.securityCode,
          startTradeDate: this.startTradeDate,
          endTradeDate: this.endTradeDate
        }
        this.dataLoading = true
        this.majorHoldCount = []
        postTurnOverData(params).then((resp) => {
          this.majorHoldCount = resp.bizData.metaData
          this.dataLoading = false
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .turnOver {
    .orange {
      color: #FFA500;
    }
    .el-card__body {
      position: relative;
      .selectCodeBox {
        width: 49%;
        .moreMain {
          .el-col-6:nth-child(2) {
            display: none;
          }
        }
      }
    }
    .icon {
      margin: 6px;
    }
  }
</style>
