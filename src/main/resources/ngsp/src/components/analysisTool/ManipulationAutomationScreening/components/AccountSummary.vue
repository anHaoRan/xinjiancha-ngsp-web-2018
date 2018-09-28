<template>
  <div>
    <el-card id="oncontextmenu" class="el-card-table">
      <div slot="header" class="clearfix">
        <span>自动化初筛账户汇总表</span>
        <el-button type="info" size="small" @click="createElementA">
          导出
        </el-button>
      </div>
      <el-table
        border
        max-height="400"
        ref="accountSummary"
        :data="accountSummary"
        v-loading="isLoading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)"
        @selection-change="handleSelectionChange"
        style="width: 100%; overflow:visible">
        <el-table-column
          align="center"
          type="selection"/>
        <s-table-columns v-for="(item,index) in columns"
                         :key="index"
                         :item="item"
                         v-if="item.isActive===undefined||item.isActive"/>
      </el-table>
      <el-row>
        <el-col :span="24">
          <pageination style="text-align: center" :pageTotal="pageTotal" @getPageination="getPageination"></pageination>
        </el-col>
      </el-row>
    </el-card>
    <div id="replaceOncontextmenu">
      <div @click="createList()">新建操纵分析列表</div>
      <div @click="createList('open')">打开操纵分析列表</div>
    </div>
    <el-dialog
      title="操纵分析列表"
      class="openList"
      :visible.sync="dialogVisble">
      <div style="padding: 0 20px;margin-bottom: 20px;">
        <label>列表名称</label>
        <el-input style="width: 200px;" v-model="dialogSelectParamsName" size="small"/>
        <el-button @click="ajaxAccountArrListQuery" size="small" type="primary">查询</el-button>
      </div>
      <el-table
        max-height="400"
        :data="operationAnalysisList"
        v-if="dialogVisble">
        <el-table-column
          align="center">
          <template slot-scope="scope">
            <el-radio :label="scope.row.list_id" v-model="listRadio"><br/></el-radio>
          </template>
        </el-table-column>
        <s-table-columns v-for="(item,index) in dialogColumns"
                         :key="index"
                         :item="item"
                         v-if="item.isActive===undefined||item.isActive"/>
      </el-table>
      <div slot="footer" style="text-align: center">
        <el-button @click="ajaxAccountListQuery" size="small" type="primary">导入</el-button>
        <el-button @click="dialogVisble=false" size="small" type="info">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    accountArrListQuery,
    accountListQuery,
    analysisAcctScreen,
    analysisAcctScreenExport
  } from '@/service/analysisTool/ManipulationAutomationScreening/index'

  export default {
    name: 'account-summary',
    props: {
      firstData: {
        type: Object,
        default: function () {
          return {
            data: [],
            total: 0
          }
        }
      },
      selectDate:{
        type: Array
      }
    },
    components: {
      Pageination: () => import('@/components/common/pageination'), // 分页组件引入
      STableColumns: () => import('@/components/base/STableColumns')  // 表格列
    },
    mixins: [],
    data () {
      return {
        //  自动化初筛账户汇总表
        columns: [
          {
            field: 'start_date',
            width: '100',
            align: 'left',
            label: '起始日期'
          }, {
            field: 'end_date',
            width: '100',
            align: 'left',
            label: '结束日期'
          }, {
            field: 'sec_code',
            width: '100',
            align: 'left',
            label: '证券代码'
          }, {
            field: 'acct_id',
            width: '100',
            align: 'left',
            label: '账户代码'
          }, {
            field: 'acct_name',
            width: '100',
            align: 'left',
            label: '账户名称'
          }, {
            field: 'ccrc_acct_id',
            width: '100',
            align: 'left',
            label: '一码通账号'
          }, {
            field: 'branch_name',
            width: '100',
            align: 'left',
            label: '交易营业部'
          }, {
            field: 'check_chg1',
            width: '100',
            align: 'left',
            label: '符合初筛标准1',
            // formatter: this.checkChgByName,
            isActive: false
          }, {
            field: 'check_chg2',
            width: '100',
            align: 'left',
            label: '符合初筛标准2',
            // formatter: this.checkChgByName,
            isActive: false
          }, {
            field: 'check_chg3',
            width: '100',
            align: 'left',
            label: '符合初筛标准3',
            // formatter: this.checkChgByName,
            isActive: false
          }, {
            field: 'check_chg4',
            width: '100',
            align: 'left',
            label: '符合初筛标准4',
            // formatter: this.checkChgByName,
            isActive: false
          }, {
            field: 'check_chg5',
            width: '100',
            align: 'left',
            label: '符合初筛标准5',
            // formatter: this.checkChgByName,
            isActive: false
          }, {
            field: 'check_chg6',
            width: '100',
            align: 'left',
            label: '符合初筛标准6',
            // formatter: this.checkChgByName,
            isActive: false
          }, {
            field: 'check_chg7',
            width: '100',
            align: 'left',
            label: '符合初筛标准7',
            // formatter: this.checkChgByName,
            isActive: false
          }, {
            field: 'equ_trade_cnt',
            width: '100',
            align: 'right',
            label: '期间交易股票只数(个)'
          }, {
            field: 'equ_trade_amt',
            width: '120',
            align: 'right',
            label: '期间交易股票总金额(万元)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'buy_vol',
            width: '120',
            align: 'right',
            label: '期间买入目标证券数量(万股)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'buy_amt',
            width: '120',
            align: 'right',
            label: '期间买入目标证券金额(万元)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'sell_vol',
            width: '120',
            align: 'right',
            label: '期间卖出目标证券数量(万股)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'sell_amt',
            width: '120',
            align: 'right',
            label: '期间卖出目标证券金额(万元)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'sec_trade_perc',
            width: '200',
            align: 'right',
            label: '期间成交目标证券金额占期间该账户所有同类证券成交金额的比例(%)',
            formatter: this.gfnElColFormatDec2
          }, {
            field: 'book_profit',
            width: '120',
            align: 'right',
            label: '账面盈利(万元)',
            formatter: this.gfnElColFormatDecThou3
          }, {
            field: 'acct_tag',
            width: '100',
            align: 'left',
            label: '账户标记'
          }
        ],
        accountSummary: [],
        pageTotal: 0,
        isLoading: false,
        //  弹出框
        dialogVisble: false,
        dialogSelectParamsName: '',
        dialogColumns: [
          {
            field: 'create_time',
            align: 'left',
            label: '列表生成日期'
          }, {
            field: 'list_name',
            align: 'left',
            label: '列表名'
          }
        ],
        multipleSelection: [],
        operationAnalysisList: [],
        listRadio: '',
        routeParams: {}, // 路由跳转参数
        standardColumns: { // 初筛表头
          1: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'buy_vol',
              align: 'right',
              label: '期间买入成交量(股)',
              formatter: this.gfnElColFormatDecThou0
              // sortable: true,
              // sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_je')
            }, {
              field: 'buy_amt',
              align: 'right',
              label: '期间买入成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'sell_vol',
              align: 'right',
              label: '期间卖出成交量(股)',
              formatter: this.gfnElColFormatDecThou0
            }, {
              field: 'sell_amt',
              align: 'right',
              label: '期间卖出成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'tc_nl_bs',
              align: 'left',
              label: '期间净买卖方向',
              // formatter: this.dealWithTcNlBs
            }, {
              field: 'tc_bs',
              align: 'left',
              label: '买卖方向',
              // formatter: this.dealWithTcBs
            }, {
              field: 'acct_rank',
              align: 'left',
              label: '期间买卖排名'
            }
          ],
          2: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'tc_bs',
              align: 'left',
              label: '买卖方向',
              // formatter: this.dealWithTcBs
            }, {
              field: 'max_rank_day',
              align: 'left',
              label: '排名最高日'
            }, {
              field: 'buy_amt',
              align: 'right',
              label: '该日买入成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'buy_vol',
              align: 'right',
              label: '该日买入成交量(股)',
              formatter: this.gfnElColFormatDecThou0
            }, {
              field: 'sell_amt',
              align: 'right',
              label: '该日卖出成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'sell_vol',
              align: 'right',
              label: '该日卖出成交量(股)',
              formatter: this.gfnElColFormatDecThou0
            }, {
              field: 'acct_rank',
              align: 'right',
              label: '该日买卖排名'
            }
          ],
          3: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'trade_buy_freq',
              align: 'right',
              label: '期间买入成交次数'
            }, {
              field: 'trade_sell_freq',
              align: 'right',
              label: '期间卖出成交次数'
            }
          ],
          4: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'buy_amt',
              align: 'right',
              label: '期间买入成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'sell_amt',
              align: 'right',
              label: '期间卖出成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'trade_amt',
              align: 'right',
              label: '期间总成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'branch_acct_id',
              align: 'left',
              label: '同一营业部的账户代码'
            }, {
              field: 'branch_acct_name',
              align: 'left',
              label: '同一营业部的账户名称'
            }, {
              field: 'sp_acct_scr_nm',
              align: 'left',
              label: '同一营业部的账户符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }
          ],
          5: [
            {
              field: 'a',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'a',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'a',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'a',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'a',
              align: 'left',
              label: '曾上报函号'
            }, {
              field: 'a',
              align: 'left',
              label: '曾上报日期'
            }, {
              field: 'a',
              align: 'left',
              label: '曾一同上报的账户代码'
            }, {
              field: 'a',
              align: 'left',
              label: '曾一同上报的账户名称'
            }, {
              field: 'a',
              align: 'left',
              label: '曾一同上报的账户符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }
          ],
          6: [
            {
              field: 'acct_id',
              align: 'left',
              label: '账户代码'
            }, {
              field: 'acct_name',
              align: 'left',
              label: '账户名称'
            }, {
              field: 'ccrc_acct_id',
              align: 'left',
              label: '一码通账号'
            }, {
              field: 'branch_name',
              align: 'left',
              label: '交易营业部'
            }, {
              field: 'chk_nm',
              align: 'left',
              label: '符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }, {
              field: 'buy_amt',
              align: 'right',
              label: '期间买入成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
              // sortable: true,
              // sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_je')
            }, {
              field: 'sell_amt',
              align: 'right',
              label: '期间卖出成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'trade_amt',
              align: 'right',
              label: '期间总成交金额(元)',
              formatter: this.gfnElColFormatDecThou3
            }, {
              field: 'ymt_acct_id',
              align: 'left',
              label: '同一一码通的账户代码'
            }, {
              field: 'ymt_acct_scr_nm',
              align: 'left',
              label: '同一一码通的账户符合初筛标准的序号',
              // formatter: this.dealWithChkNm
            }
          ]
        }

      }
    },
    computed: {
      checkConditions () {
        return this.$parent.selectParams.condition
      },
      lastSelectParams: function () {
        let params = JSON.parse(JSON.stringify(this.$store.getters.getLastSelectParams))
        params.resType = 'chkResTotal'
        return params
      }
    },
    watch: {
      //  列头符合初筛标准1-7动态创建
      checkConditions: {
        handler () {
          for (let key of this.columns) {
            if (key.label.indexOf('符合初筛标准') != -1) {
              key.isActive = false
            }
          }
          for (let key of this.checkConditions) {
            let index = this.columns.findIndex(item => {
              return item.label == '符合初筛标准' + key
            })
            if (index != -1)
              this.columns[index].isActive = true
          }
        },
        immediate: true
      },
      firstData: { // 监听数据变化
        handler () {
          this.accountSummary = this.firstData.data
          this.pageTotal = Number(this.firstData.total)
        },
        immediate: true
      },

    },
    methods: {
      ajaxAccountArrListQuery () {
        accountArrListQuery({listName: this.dialogSelectParamsName}).then(res => {
          this.operationAnalysisList = res
        })
      },
      ajaxAccountListQuery () {
        accountListQuery({listId: this.listRadio}).then(res => {
          let arr = res.map(item => {
            return item.acct_id
          })
          for (let key of this.multipleSelection) {
            arr.push(key.acct_id)
          }
          let params = {
            acctIdArr: Array.from(new Set(arr)).join(','),
            sec_code: this.routeParams.sec_code,
            sec_name: this.routeParams.sec_name,
            task_id: this.routeParams.task_id, 
            version: this.routeParams.version, 
            task_status: this.routeParams.task_status, 
            process_id: this.routeParams.process_id,
            start_date: this.selectDate[0],
            end_date: this.selectDate[1],
            routeType: 'open'
          }
          this.openNewWindow('manipulateAnalysisList', `#/manipulateAnalysisList/${JSON.stringify(params)}`)
        })
      },
      getPageination (pageinationVal) {
        this.lastSelectParams.pageRows = pageinationVal.pageSizeNumber
        this.lastSelectParams.pageIndex = pageinationVal.currentPage
        this.ajaxAnalysisAcctScreen()
      },
      ajaxAnalysisAcctScreen () {
        this.isLoading = true
        let params = this.lastSelectParams
        params.isNewQuery = 0
        analysisAcctScreen(params).then(res => {
          this.isLoading = false
          this.accountSummary = res.res['chkResTotal']
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      createList (type) {
        if (type) {
          this.ajaxAccountArrListQuery()
          this.dialogVisble = true
          return
        }
        let params = {
          acctIdArr: this.multipleSelection.map(item => {
            return item.acct_id
          }).join(','),
          sec_code: this.routeParams.sec_code,
          sec_name: this.routeParams.sec_name,
          task_id: this.routeParams.task_id, 
          version: this.routeParams.version, 
          task_status: this.routeParams.task_status, 
          process_id: this.routeParams.process_id,
          start_date: this.selectDate[0],
          end_date: this.selectDate[1],
          routeType: 'new'
        }
        this.openNewWindow('manipulateAnalysisList', `#/manipulateAnalysisList/${JSON.stringify(params)}`)
      },
      checkChgByName (row, column, cellValue) {
        if (cellValue == '1') {
          return '是'
        }
        return '否'
      },
      createElementA () {
        let selectParams = this.lastSelectParams,
          params = {}
        for (let key in selectParams) {
          params[key] = selectParams[key]
        }
        let arr = []
        for (let key of this.columns) {
          if (key.isActive == undefined || key.isActive) {
            arr.push(key)
          }
        }
        params.tableColumns = [
          {
            sheetName: '自动化初筛账户汇总表',
            fileColumns: arr
          }
        ]
        // 处理初筛标准列头        
        if(selectParams.checkChg1 == 1){
          params.tableColumns.push(
            {
              sheetName: '初筛标准1的账户',
              fileColumns: this.standardColumns[1]
            }
          )
        }
        if(selectParams.checkChg2 == 1){
          params.tableColumns.push(
            {
              sheetName: '初筛标准2的账户',
              fileColumns: this.standardColumns[2]
            }
          )
        }
        if(selectParams.checkChg3 == 1){
          params.tableColumns.push(
            {
              sheetName: '初筛标准3的账户',
              fileColumns: this.standardColumns[3]
            }
          )
        }
        if(selectParams.checkChg4 == 1){
          params.tableColumns.push(
            {
              sheetName: '初筛标准4的账户',
              fileColumns: this.standardColumns[4]
            }
          )
        }
        if(selectParams.checkChg5 == 1){
          params.tableColumns.push(
            {
              sheetName: '初筛标准5的账户',
              fileColumns: this.standardColumns[5]
            }
          )
        }
        if(selectParams.checkChg6 == 1){
          params.tableColumns.push(
            {
              sheetName: '初筛标准6的账户',
              fileColumns: this.standardColumns[6]
            }
          )
        }
        params.fileType = 'xlsx'
        params.isNewQuery = 0 // 不是第一次查询
        delete params.pageRows
        delete params.pageIndex
        console.log(JSON.stringify(params))
        this.gfnExportFileWithForm(analysisAcctScreenExport(), params)
      }
    },
    created () {

    },
    mounted () {
      this.routeParams = JSON.parse(this.$route.params.params) // 路由跳转参数初始赋值
      document.getElementById('oncontextmenu').oncontextmenu = function (ev) {
        let oEvent = ev || event
        let menu = document.getElementById('replaceOncontextmenu')
        menu.style.left = oEvent.clientX + 'px'
        menu.style.top = oEvent.clientY + 'px'
        menu.style.display = 'block'
        return false
      }
      document.getElementById('oncontextmenu').onclick = function (ev) {
        let oEvent = ev || event
        let menu = document.getElementById('replaceOncontextmenu')
        menu.style.display = 'none'
      }
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less">
  .openList {
    .el-dialog__body {
      padding: 30px 0;
    }
  }
</style>
