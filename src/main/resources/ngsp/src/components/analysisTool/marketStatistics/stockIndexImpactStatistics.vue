<!--  证券指数影响统计 -->
<template>
  <div class="stockIndexImpactStatistics">
    <el-card>
      <div slot="header">
        查询条件
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
      </div>
      <el-form ref='stockIndexImpactForm' :inline="true" :model='formData' :rules='rules' label-width='100px'>
        <el-form-item label='选择日期：' prop='dateRange'>
          <el-date-picker
            v-model="formData.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyyMMdd HHmmss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='指数：' prop='chosenStockIndex'>
          <el-select v-model="formData.chosenStockIndex" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockIndexList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-show="isShowRes">
      <el-row>
        <el-col :xl="19" :lg="19" :md="19" :sm="19">
          <s-table
            :columns="columns"
            :data="tableData"
            :loading="loading"
            @getPageination="getPageination"
            @selection-change="handleSelectionChange">
            <el-dropdown @command="handleDownload" v-if="tableData.data.length" slot="elCardHeader">
              <el-button type="info" size="small">
                导出<i class="el-icon-arrow-down el-icon-right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="exl">
                  <i class="el-icon-document"></i>导出为EXCEL
                </el-dropdown-item>
                <el-dropdown-item command="csv">
                  <i class="el-icon-tickets"></i>导出为CSV
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div slot="tableColumnsUnshift">
              <el-table-column type="selection" width="40"></el-table-column>
            </div>
          </s-table>
        </el-col>
        <el-col :xl="5" :lg="5" :md="5" :sm="5">
          <el-card>
            <br>
            <el-table
              class="right-table"
              :data="tableData1"
              :show-header="false"
              border
              size="small"
              style="width: 100%;">
              <el-table-column
                v-for="(item, index) in columns1"
                :align="item.align"
                :key="item.field"
                :label="item.label"
                :prop="item.field"
                :min-width="item.minWidth ? item.minWidth : 80">
              </el-table-column>
            </el-table>
            <el-table
              class="right-table"
              :data="tableData2"
              :show-header="false"
              border
              size="small"
              style="width: 100%;">
              <el-table-column
                v-for="(item, index) in columns2"
                :align="item.align"
                :key="item.field"
                :label="item.label"
                :prop="item.field">
              </el-table-column>
            </el-table>
            <br>
            <el-button size="small" type="primary" @click="analysisChosen">分析</el-button>
            <br>
            <template v-if="this.tableData3[0].r32 > 0">
              <el-table
                class="right-table"
                :data="tableData3"
                :show-header="false"
                border
                size="small"
                style="width: 100%;">
                <el-table-column
                  v-for="(item, index) in columns3"
                  :align="item.align"
                  :key="item.field"
                  :label="item.label"
                  :prop="item.field">
                </el-table-column>
              </el-table>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  import {constituentStockQuery, exportStockFuturesTrend} from '@/service/analysisTool/stockIndexFutures/index'
  import moment from 'moment'

  export default {
    name: 'stock-index-impact-statistics',
    components: {
      SDatePicker: () => import('@/components/base/SDatePicker'),
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        isShowRes: false,
        stockIndexList: [
          {
            id: '1',
            name: '沪深300'
          },
          {
            id: '2',
            name: '上证50'
          },
          {
            id: '3',
            name: '中证500'
          }
        ],
        formData: {
          dateRange: [],
          chosenStockIndex: '1'
        },
        rules: {
          dateRange: [
            {required: true, message: '请选择日期'}
          ],
          chosenStockIndex: [
            {required: true, message: '请选择'}
          ]
        },
        columns: [
          {
            label: '证券代码',
            field: '',
            align: 'left',
            minWidth: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, '')
          },
          {
            label: '证券简称',
            field: '',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, '')
          },
          {
            label: '涨跌幅(%)',
            field: '',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, ''),
            formatter: this.gfnElColFormatDecThou3,
            format: '#,##0.000'
          },
          {
            label: '影响指数(点)',
            field: '',
            align: 'left',
            minWidth: '6.5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, ''),
            formatter: this.gfnElColFormatDecThou3,
            format: '#,##0.000'
          }
        ],
        loading: false,
        tableData: {
          data: [
            {
              "sec_code": "111111",
              "trdamt_net": "0.000",
              "tjlx": "开放式基金",
              "sortid": "1",
              "trdamt_b": "0.000",
              "trdamt_s": "0.000",
              "trade_date": "20171216"
            },
            {
              "sec_code": "222222",
              "trdamt_net": "0.000",
              "tjlx": "开放式基金",
              "sortid": "1",
              "trdamt_b": "0.000",
              "trdamt_s": "0.000",
              "trade_date": "20180131"
            },
            {
              "sec_code": "333333",
              "trdamt_net": "0.000",
              "tjlx": "开放式基金",
              "sortid": "1",
              "trdamt_b": "0.000",
              "trdamt_s": "0.000",
              "trade_date": "20180131"
            },
            {
              "sec_code": "444444",
              "trdamt_net": "0.000",
              "tjlx": "封闭式基金",
              "sortid": "2",
              "trdamt_b": "0.000",
              "trdamt_s": "0.000",
              "trade_date": "20180131"
            },
            {
              "sec_code": "555555",
              "trdamt_net": "0.000",
              "tjlx": "社保基金",
              "sortid": "3",
              "trdamt_b": "0.000",
              "trdamt_s": "0.000",
              "trade_date": "20180131"
            },
            {
              "sec_code": "666666",
              "trdamt_net": "0.000",
              "tjlx": "社保基金",
              "sortid": "3",
              "trdamt_b": "0.000",
              "trdamt_s": "0.000",
              "trade_date": "20180131"
            },
            {
              "sec_code": "777777",
              "trdamt_net": "0.000",
              "tjlx": "保险公司",
              "sortid": "5",
              "trdamt_b": "0.000",
              "trdamt_s": "0.000",
              "trade_date": "20180131"
            },
            {
              "sec_code": "888888",
              "trdamt_net": "0.000",
              "tjlx": "保险公司",
              "sortid": "5",
              "trdamt_b": "0.000",
              "trdamt_s": "0.000",
              "trade_date": "20180131"
            },
            {
              "sec_code": "999999",
              "trdamt_net": "0.000",
              "tjlx": "保险公司",
              "sortid": "5",
              "trdamt_b": "0.000",
              "trdamt_s": "0.000",
              "trade_date": "20180131"
            }],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        getChosenId: [], // 获得用户选中的数据

        // 右侧表格数据
        tableData1: [
          {
            "r11": "结束时间",
            "r12": "2018-09-09 10:10:10"
          },
          {
            "r11": "期初指数",
            "r12": "2824.333"
          },
          {
            "r11": "期末指数",
            "r12": "2786.333"
          },
          {
            "r11": "指数涨跌",
            "r12": "-55.333"
          },
          {
            "r11": "涨跌百分比",
            "r12": "-1.958%"
          }
        ],
        columns1: [
          {
            id: 'ac1',
            label: '第一列',
            field: 'r11',
            align: 'left',
            minWidth: '7%'
          },
          {
            id: 'ac2',
            label: '第二列',
            field: 'r12',
            align: 'right',
            minWidth: '14%'
            // formatter: this.gfnElColFormatDecThou3
          }
        ],
        tableData2: [
          {
            "r21": "",
            "r22": "A股",
            "r23": "B股"
          },
          {
            "r21": "上涨证券个数",
            "r22": "67",
            "r23": "1"
          },
          {
            "r21": "影响指数点数",
            "r22": "1.532",
            "r23": "0.001"
          },
          {
            "r21": "下跌证券个数",
            "r22": "811",
            "r23": "24"
          },
          {
            "r21": "影响指数点数",
            "r22": "-51.484",
            "r23": "-0.125"
          }
        ],
        columns2: [
          {
            id: 'ac11',
            label: 'r21',
            field: 'r21',
            align: 'left',
            minWidth: '7%'
          },
          {
            id: 'ac12',
            label: 'r22',
            field: 'r22',
            align: 'right',
            minWidth: '7%',
            formatter: this.gfnElColFormatDecThou3
          },
          {
            id: 'ac13',
            label: 'r23',
            field: 'r23',
            align: 'right',
            minWidth: '7%',
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        tableData3: [
          {
            "r31": "选取证券个数",
            "r32": 0
          },
          {
            "r31": "算数平均涨跌幅",
            "r32": "1.335%"
          },
          {
            "r31": "权重",
            "r32": "3.396"
          },
          {
            "r31": "影响指数点数",
            "r32": "0.784"
          },
          {
            "r31": "影响指数百分比",
            "r32": "1.478%"
          }
        ],
        columns3: [
          {
            id: 'ac31',
            label: 'r31',
            field: 'r31',
            align: 'left',
            minWidth: '7%'
          },
          {
            id: 'ac32',
            label: 'r32',
            field: 'r32',
            align: 'right',
            minWidth: '7%',
            formatter: this.gfnElColFormatDecThou3
          }
        ]
      }
    },
    methods: {
      analysisChosen() {
        if (!this.getChosenId.length) {
          this.$message.info('请至少选中一条记录！')
          return
        }
        constituentStockQuery({}).then((resp) => {
          if (resp) {
            this.tableData3[0].r32 = this.getChosenId.length
          }
        })
        this.tableData3[0].r32 = this.getChosenId.length
      },
      handleSelectionChange(val) {
        let list = []
        val.map(item => {
          list.push(item.sec_code)
        })
        this.getChosenId = list
      },
      handleSearch() {
        this.$refs['stockIndexImpactForm'].validate((valid) => {
          if (valid) {
            this.isShowRes = true
            this.queryData = JSON.parse(JSON.stringify(this.formData))
            this.tableData.pageIndex = 1
            // this.reqTableData()
          }
        })
      },
      reqTableData() {
        if (!this.queryData.dateRange[0] && !this.queryData.dateRange[1]) {
          this.$message.error('请选择完整日期')
          return
        }
        let d1 = this.queryData.dateRange[0].split(' '), d2 = this.queryData.dateRange[1].split(' ')
        let params = {
          dateStart: d1[0],
          dateEnd: d2[0],
          startTime: d1[1],
          endTime: d2[1],
          chosenStockIndex: this.queryData.chosenStockIndex,
          pageIndex: this.tableData.pageIndex,
          pageRows: this.tableData.pageRows
        }
        // this.loading = true
        constituentStockQuery(params).then((resp) => {
          if (resp) {
            this.loading = false
            this.tableData.data = resp.bizData.metaData
          }
        })
      },
      getPageination(pageination) {
        this.tableData.pageIndex = pageination.currentPage
        this.tableData.pageRows = pageination.pageSizeNumber
        this.reqTableData()
      },
      handleDownload(type) {
        if (!this.queryData.dateRange[0] && !this.queryData.dateRange[1]) {
          this.$message.error('请选择完整日期')
          return
        }
        let d1 = this.queryData.dateRange[0].split(' '), d2 = this.queryData.dateRange[1].split(' ')
        let params = {
          dateStart: d1[0],
          dateEnd: d2[0],
          startTime: d1[1],
          endTime: d2[1],
          chosenStockIndex: this.queryData.chosenStockIndex,
          type: '',
          fileType: type,
          tableColumns: [{
            sheetName: '沪深300成分股',
            fileColumns: this.columns
          }]
        }
        exportStockFuturesTrend(params)
      }
    },
    mounted() {
      this.formData.dateRange = [moment(new Date()).format('YYYYMMDD HHmmss'), moment(new Date()).format('YYYYMMDD HHmmss')]
    },
  }
</script>

<style lang='less' scoped>
  .stockIndexImpactStatistics {
    .right-table {
      /deep/ .el-table__body-wrapper {
        tbody {
          tr {
            height: 32px;
            td {
              padding: 0;
              height: 28px;
            }
          }
        }
      }
    }
  }
</style>
