<template>
  <div class="insider-trad-analysis">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card class="el-card-table">
      <div slot="header">
        <span>任务列表</span>
        <el-button
          type="text"
          size="small"
          style="float:right;"
          @click="resetAll">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right; "
          @click="QueryRes">查询
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right;"
          @click="addTask">新增任务
        </el-button>
      </div>
      <el-dialog title="新增任务"
                 :visible.sync="dialogFormVisble"
                 center
                 width="500px">
        <el-form :model="newTaskCon">
          <el-row>
            <el-form-item label="证券代码">
              <el-col :span="16">
                <stock-code-query :commonData="newTaskStocod" @getStockCode="fnGetNewTaskStocod"></stock-code-query>
              </el-col>

            </el-form-item>
          </el-row>

          <el-form-item label="来函标志">
            <el-select v-model="newTaskCon.comeLetterFlag" size="small" placeholder="请选择">
              <el-option label="Y"
                         value="Y">
              </el-option>
              <el-option label="N"
                         value="N">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>

        <div slot="footer">
          <el-button type="primary" size="small" @click="add">确 定</el-button>
          <el-button type="text" size="small" @click="cancleAdd">取 消</el-button>
        </div>

      </el-dialog>
      <div>
        <el-row style="margin-top: 20px;">
          <el-col :span="6" style="margin-left: 30px;">
            <el-col :span="5" style="line-height: 32px;">
              证券代码:
            </el-col>
            <el-col :span="12">
              <stock-code-query :commonData="queryStockCode" @getStockCode="fnGetQueryStocod"
                                ref="queryStockCode"></stock-code-query>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="5" style="line-height: 32px;">
              来函编号:
            </el-col>
            <el-col :span="12">
              <el-input size="small" v-model="incomeLetterNum"></el-input>
            </el-col>
          </el-col>

          <el-col :span="6">
            <el-col :span="5" style="line-height: 32px;">
              来函日期:
            </el-col>
            <el-col :span="12">
              <el-date-picker v-model="incomeLetterDate"
                              type="date"
                              size="small"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-col>
          </el-col>

          <el-col :span="5">
            <el-col :span="6" style="line-height: 32px;">
              分析人员:
            </el-col>
            <el-col :span="14">
              <selector-dealer class="customize-width" ref="analysiser"
                               @node-click="getAnalyPerson"
                               :selectPerson="analystName"></selector-dealer>
            </el-col>
          </el-col>
        </el-row>

        <el-row style="margin-top: 20px;">
          <el-col :span="6" style="margin-left: 30px;">
            <el-col :span="5" style="line-height: 32px;">
              复核人员:
            </el-col>
            <el-col :span="12">
              <selector-dealer class="customize-width" ref="checker"
                               @node-click="getReviewPerson"
                               :selectPerson="reviewerName"></selector-dealer>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="5" style="line-height: 32px;">
              任务状态:
            </el-col>
            <el-col :span="12">
              <el-select v-model="taskStatus" size="small" placeholder="请选择">
                <el-option v-for="item in taskStatusOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>
      </div>

      <div style="margin-top: 40px;" v-if="showRes">
        <el-row>
          <el-table :data="taskTable"
                    border
                    show-overflow-tooltip
                    v-loading="queryResLoad"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="数据加载中，请耐心等待..."
                    element-loading-background="rgba(0,0,0,0.3)">
            <el-table-column prop="task_code"
                             label="任务编号"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="source_letter_id"
                             label="来函编号"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="source_letter_date"
                             label="来函日期"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="reply_id"
                             label="回函编号"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sec_code"
                             label="证券代码"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="anal_user"
                             label="分析人员"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="reanal_user"
                             label="复核人员"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="currentTaskStatus"
                             label="任务状态"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="source_flag"
                             label="来函标志"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="i"
                             label="操作"
                             align="center"
                             width="170">
              <template slot-scope="scope">
                <span>
                    <el-button class="linkStyle" v-if="scope.row.beginAnalyze" type="text" size="small"
                               style="border:none;" @click="analysisStart(scope)">
                      开始分析
                    </el-button>
                  <el-button v-if="scope.row.deleteTask" type="text" size="small" @click="deleteTaskCon(scope)"
                             style="border:none;">
                    删除
                  </el-button>
                    <el-button class="linkStyle" v-if="scope.row.beginRecheck" type="text" size="small"
                               style="border:none;" @click="checkStart(scope)">
                      开始复核
                    </el-button>
                    <el-button class="linkStyle" v-if="scope.row.checkRes" type="text" size="small"
                               style="border:none;" @click="checkEnd(scope)">
                      生成报告
                    </el-button>
                  <el-button class="linkStyle" v-if="scope.row.lookFinishTask" type="text" size="small"
                             style="border:none;" @click="checkFinish(scope)">
                      查看
                    </el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" style="margin-top: 10px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="resultNum">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  // 面包屑
  import breadcrumb from '../../components/common/Breadcrumb'
  // 证券代码模糊查询框
  import StockCodeQuery from '../../components/common/StockCodeQuery'

  // 接口
  import {
    getTaskList,
    saveTask,
    deleteTask,
    hasInsiderInfo,
    changeTaskstatus
  } from '../../service/analysisTool/insiderTradAccountAnalysis'

  export default {
    name: 'insider-trad-analysis',
    components: {breadcrumb, StockCodeQuery, SelectorDealer: () => import('@/components/common/SelectorDealer'),},
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/insiderTradAnalysis',
            label: '分析工具'
          }, {
            router: '/insiderTradAnalysis',
            label: '特定工具'
          }, {
            router: '/insiderTradAnalysis',
            label: '内幕交易分析'
          }
        ],
        msg: '内幕交易分析',
        incomeLetterNum: '',
        incomeLetterDate: '',
        stockCode: '',
        // 查询接口入参
        queryParams: {},
        // 新建任务保存接口入参
        saveParams: {},
        // 查询结果展示
        showRes: false,
        // 新增任务
        dialogFormVisble: false,
        newTaskCon: {
          taskNum: '20180227',
          stockCode: '',
          comeLetterFlag: 'N',
          addAnalyst: '',
          addAnalystOptions: [],
          addReviewer: '',
          addReviewerOptions: []
        },
        // 查询证券代码组件入参
        queryStockCode: {
          disabled: false,
          stockCode: '',
          multiple: false
        },
        // 新建任务证券代码组件入参
        newTaskStocod: {
          disabled: false,
          stockCode: '',
          multiple: false
        },
        // 分析人员
        analystCode: '',
        analystName: '',
        // 复核人员
        reviewerCode: '',
        reviewerName: '',
        // 任务状态
        taskStatus: '',
        // 加载表格数据转圈圈
        queryResLoad: '',
        taskStatusOptions: [
          {label: '全部', value: 'ALL'},
          {label: '待分析', value: 'x1,l1'},
          {label: '分析中', value: 'x2,l2'},
          {label: '待复核', value: 'x3,l3'},
          {label: '复核中', value: 'x4,l4'},
          {label: '已复核', value: 'x5,l5'},
          {label: '已完成', value: 'x6,l6'},
          {label: '终止任务', value: 'x7,l7'}
        ],
        // 表格数据
        taskTable: [],
        taskTableOption: [
          {prop: 'ccrc_acct_id', label: '任务编号', align: 'left'},
          {prop: 'account_code', label: '来函编号', align: 'left'},
          {prop: 'account_name', label: '来函日期', align: 'left'},
          {prop: 'stock_code', label: '证券代码', align: 'left'},
          {prop: 'stock_name', label: '分析人员', align: 'left'},
          {prop: 'full_name', label: '复核人员', align: 'left'},
          {prop: 'trade_buy_volume', label: '任务状态', align: 'right'},
          {prop: 'trade_buy_value', label: '来函标志', align: 'right'},
          {prop: 'trade_sale_volume', label: '操作', align: 'right'}
        ],
        // 操作按钮
        // 开始分析
        beginAnalyze: false,
        // 删除任务
        deleteTask: false,
        // 开始复核
        beginRecheck: false,
        // 查看复核结果
        checkRes: false,
        hasInsider: '',
        //  分页
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        resultNum: 0
      }
    },

    methods: {
      getAnalyPerson (code, name) {
        this.analystCode = code
        this.analystName = name
      },
      getReviewPerson (code, name) {
        this.reviewerCode = code
        this.reviewerName = name
      },
      // 新增任务弹框中证券代码模糊查询组件
      fnGetNewTaskStocod (stockCodeData) {
        this.newTaskCon.stockCode = stockCodeData
        console.log(this.newTaskCon.stockCode)
      },
      // 任务列表查询条件证券代码模糊查询组件
      fnGetQueryStocod (stockCodeData) {
        this.stockCode = stockCodeData.split(' ')[0]
      },
      // 添加任务弹出框状态
      addTask () {
        this.dialogFormVisble = true
      },
      // 确定添加任务
      add () {
        this.saveParams = {
          stockCode: this.newTaskCon.stockCode,
          sourceFlag: this.newTaskCon.comeLetterFlag,
          taskStatus: 'x1'
        }

        if (this.saveParams.stockCode) {
          saveTask(this.saveParams).then((resp) => {
            if (resp) {
              this.QueryRes()
              this.$message.success('新增任务成功')
            } else {
              this.$message.error('新增任务失败')
            }
          })
        } else {
          this.$message.error('证券代码不能为空')
          return
        }
        this.dialogFormVisble = false
      },
      // 取消添加任务
      cancleAdd () {
        this.newTaskStocod.stockCode = ''
        this.newTaskCon.stockCode = ''
        this.dialogFormVisble = false
      },
      // 查询
      QueryRes () {
        this.queryResLoad = true
        this.showRes = true
        this.queryParams = {
          sourceLetterId: this.incomeLetterNum,
          sourceLetterDate: this.incomeLetterDate,
          stockCode: this.stockCode,
          analUser: this.analystCode,
          reanalUser: this.reviewerCode,
          taskStatus: this.taskStatus,
          pageIdx: this.currentPage,
          pageRw: this.pageSize
        }
        this.showTableCon()
      },
      // 表格数据展示
      showTableCon () {
        getTaskList(this.queryParams).then((resp) => {
          if (!$.isEmptyObject(resp)) {
            this.resultNum = (resp.rowsCount - 0)
            let resArr = resp.taskList
            // 存储筛选条件
            let saveParams = {
              incomeLetterNum: this.incomeLetterNum,
              incomeLetterDate: this.incomeLetterDate,
              stockCode: this.stockCode,
              analyst: this.analyst,
              reviewer: this.reviewer,
              taskStatus: this.taskStatus,
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              resultNum: this.resultNum
            }
            this.$store.commit('saveParams', saveParams)
            // 任务状态转换
            for (let i = 0; i < resArr.length; i++) {
              let taskStatus = resArr[i].task_status.split('')[1]
              switch (taskStatus) {
                case '1':
                  resArr[i]['currentTaskStatus'] = '待分析'
                  break
                case '2':
                  resArr[i]['currentTaskStatus'] = '分析中'
                  break
                case '3':
                  resArr[i]['currentTaskStatus'] = '待复核'
                  break
                case '4':
                  resArr[i]['currentTaskStatus'] = '复核中'
                  break
                case '5':
                  resArr[i]['currentTaskStatus'] = '已复核'
                  break
                case '6':
                  resArr[i]['currentTaskStatus'] = '已完成'
                  break
                case '7':
                  resArr[i]['currentTaskStatus'] = '终止任务'
                  break
              }
              this.getTaskOperateType(resArr[i])
            }
            this.$store.commit('saveTaskListData', resArr)
            this.taskTable = resArr
            this.queryResLoad = false
          }
        })
      },
      getTaskOperateType (val) {
        let operateType = val.opt.split(',')
        operateType.forEach(item => {
          switch (item) {
            case '1':
              val['beginAnalyze'] = true
              break
            case '2':
              val['beginRecheck'] = true
              break
            case '3':
              val['checkRes'] = true
              break
            case '4':
              val['lookFinishTask'] = true
              break
            case '5':
              val['deleteTask'] = true
              break
            case '6':
              val['lookFinishTask'] = true
              break
          }
        })
      },
      // 分页
      handleSizeChange (val) {
        this.queryParams.pageRw = val
        this.showTableCon()
      },
      handleCurrentChange (val) {
        this.queryParams.pageIdx = val
        this.showTableCon()
      },
      // 清空操作
      resetAll () {
        this.incomeLetterNum = ''
        this.incomeLetterDate = ''
        this.stockCode = ''
        this.analyst = ''
        this.reviewer = ''
        this.taskStatus = ''
        this.$refs.queryStockCode.clearCon()
        this.$refs.analysiser.handlerClear()
        this.$refs.checker.handlerClear()
      },

      // 表格操作之开始分析
      analysisStart (scope) {
        let params = scope.row.source_pro_id
        hasInsiderInfo(params).then(resp => {
          this.hasInsider = resp.has_insider_data
        })
        // 存储任务信息，供后面页面使用
        let currentTaskData = {
          processId: scope.row.process_id,
          stockCode: scope.row.sec_code,
          taskId: scope.row.task_id,
          operatorType: 'analysiser',
          hasInsiderData: this.hasInsider,
          taskNum: scope.row.source_pro_id,
          operateType: scope.row.opt.split(',')
        }
        console.log(currentTaskData.taskId)
        this.$store.commit('saveCurrentTaskData', currentTaskData)
        this.$store.commit('changeBackStatus', false)
        // 存储任务状态
        let taskStatus = scope.row.task_status.split('')[1]
        this.$store.commit('changeTaskStatus', taskStatus)
        if (taskStatus == '1') {
          //  更改任务状态
          let processId = scope.row.process_id,
            taskId = scope.row.task_id
          let params = {
            processId: processId,
            taskId: taskId,
            stopStatus: '0'
          }
          changeTaskstatus(params).then(resp => {
            if (resp) {
              this.$store.commit('changeTaskStatus', '2')
            }
          })
        }
        this.$router.push({name: 'insiderTradAnalysisParams', params: {stockCode: scope.row.sec_code}})
      },
      // 表格操作之删除
      deleteTaskCon (scope) {

        let deleteTaskId = {taskId: scope.row.task_id}
        deleteTask(deleteTaskId).then(resp => {
          if (resp) {
            this.$message.success('删除任务成功')
            this.QueryRes()
          } else {
            this.$message.error('删除任务失败')
          }
        })
      },
      // 表格操作之开始复核
      checkStart (scope) {
        // 存储任务信息，供后面页面使用
        let currentTaskData = {
          processId: scope.row.process_id,
          stockCode: scope.row.sec_code,
          taskId: scope.row.task_id,
          operatorType: 'checker',
          hasInsiderData: this.hasInsider,
          taskNum: scope.row.source_pro_id,
          operateType: scope.row.opt.split(',')
        }
        this.$store.commit('saveCurrentTaskData', currentTaskData)
        // 存储任务状态
        let taskStatus = scope.row.task_status.split('')[1]
        this.$store.commit('changeTaskStatus', taskStatus)
        if (taskStatus == '3') {
          //  更改任务状态
          let processId = scope.row.process_id,
            taskId = scope.row.task_id
          let params = {
            processId: processId,
            taskId: taskId,
            stopStatus: '0'
          }
          changeTaskstatus(params).then(resp => {
            if (resp) {
              this.$store.commit('changeTaskStatus', '4')
            }
          })
        }
        this.$router.push({name: 'insiderTradAnalysisParams', params: {stockCode: scope.row.sec_code}})
      },
      // 表格操作之生成报告
      checkEnd (scope) {
        let currentTaskData = {
          processId: scope.row.process_id,
          stockCode: scope.row.sec_code,
          taskId: scope.row.task_id,
          operatorType: 'checker',
          taskNum: scope.row.source_pro_id,
          operateType: '3'
        }
        this.$store.commit('saveCurrentTaskData', currentTaskData)
        this.$store.commit('changeTaskStatus', '5')
        this.$router.push({name: 'completeTheReview',params:{taskId:scope.row.task_id}})
      },
      // 表格操作之查看已结束任务
      checkFinish (scope) {
        let currentTaskData = {
          processId: scope.row.process_id,
          stockCode: scope.row.sec_code,
          taskId: scope.row.task_id,
          operatorType: 'finish',
          taskNum: scope.row.source_pro_id,
          operateType: scope.row.opt.split(',')
        }
        this.$store.commit('saveCurrentTaskData', currentTaskData)
        let opt = scope.row.opt.split(',')
        if (opt.includes('6')  || opt.includes('4')) {
          this.$router.push({name: 'insiderTradAnalysisParams', params: {stockCode: scope.row.sec_code}})
        }
      }
    },

    mounted () {
      if ($.isEmptyObject(this.$store.state.insiderTradAnalysis.taskListData)) {
        this.QueryRes()
      } else {
        this.QueryRes()
        this.taskTable = this.$store.state.insiderTradAnalysis.taskListData
        this.showRes = true
        this.taskTable = this.$store.state.insiderTradAnalysis.taskListData
        this.incomeLetterNum = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.incomeLetterNum
        this.incomeLetterDate = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.incomeLetterDate
        this.stockCode = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.stockCode
        this.analyst = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.analyst
        this.reviewer = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.reviewer
        this.taskStatus = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.taskStatus
        this.currentPage = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.currentPage
        this.pageSize = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.pageSize
        this.resultNum = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.resultNum
        this.IDinfoData = this.$store.state.insiderTradAnalysis.requestParamsOfTaskList.IDinfoData
      }
    }
  }
</script>

<style lang="less">
  .insider-trad-analysis {
    .el-dialog__body {
      text-align: left;
      padding-bottom: 0;
      .el-select__caret {
        position: relative;
        bottom: 10px;
      }

      .el-form-item__label {
        margin-left: 20px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 40px;
        letter-spacing: 0px;
      }
      .el-input {
        text-align: left;
        display: initial;
        .el-input__inner {
          width: 300px;
          height: 30px;
          border-radius: 4px;
        }
      }
      .linkStyle {
        span {
          a {
            text-decoration: none !important;
            color: white !important;
          }
        }
      }

    }

  }

</style>
