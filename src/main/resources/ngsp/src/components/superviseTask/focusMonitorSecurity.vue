<template>
  <div class="focusMonitorSecurity">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-card class="el-card-table">
        <div slot="header">
          查询条件
          <el-button type="primary" size="small" @click="newBuilt">新建监控证券</el-button>
        </div>
        <el-form :inline="true" :model="selectParams" ref="selectParams">
          <el-row :gutter="20">
            <el-col :xl="6" :lg="8" :md="12" :sm="24">
              <el-form-item label="证券代码及简称">
                <stock-code-query :commonData="submitData" :clearable='false'
                                  @getStockCode="getStockCode"></stock-code-query>
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12" :sm="24">
              <el-form-item label="申请人：">
                <selector-dealer class="customize-width" ref="selectorDealers"
                                 @node-click="getApplyPerson"
                                 :selectPerson="selectParams.applicant"></selector-dealer>
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12" :sm="24">
              <el-form-item label="监控级别：">
                <el-select v-model="selectParams.monitorLevel" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in monitorLevelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12" :sm="24">
              <el-form-item label="状态：">
                <el-select v-model="selectParams.localStatus" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12" :sm="24">
              <el-form-item label="监控原因：">
                <el-select v-model="selectParams.monitorReason" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in monitorReasonOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12" :sm="24">
              <el-form-item label="在办人：">
                <selector-dealer class="customize-width" ref="selectorDealers"
                                 @node-click="getCurrentPerson"
                                 :selectPerson="selectParams.handler"></selector-dealer>
              </el-form-item>
            </el-col>
            <el-col :xl="7" :md="12" :sm="24">
              <el-form-item label="申请日期：">
                <el-date-picker
                  v-model="selectParams.applyDate"
                  type="daterange"
                  size="small"
                  :clearable="true"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :md="12" :sm="24">
              <el-form-item>
                <el-button type="primary" size="small" @click="query">查询</el-button>
                <el-button type="info" size="small" @click="emptyForm">清空</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class="el-card-table">
      <div slot="header">
        重点监控证券列表
      </div>
      <el-table
        :data="monitorSecurityData"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        max-height="500"
        :reserve-selection="true"
        style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          v-for="column in monitorSecurityColumns"
          :key="column.field"
          :align="column.align"
          :prop="column.field"
          :label="column.label"
          :formatter="column.formatter"
          :min-width='column.minWidth'>
        </el-table-column>
        <el-table-column
          :width="300"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="jumpPage(scope.row)" type="text" style="border: none;" size="small"
                       v-if="scope.row.operate1">
              {{scope.row.operate1}}
            </el-button>
            <el-button @click="editPage(scope.row)" type="text" style="border: none;" size="small"
                       v-if="scope.row.operate2">
              {{scope.row.operate2}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          :current-page.sync="CurrentPage"
          :page-sizes="[10,50,100,200,400]"
          :page-size="pageRows"
          layout="total,sizes,prev,pager,next,jumper"
          :total="PageTotal"
        >
        </el-pagination>
      </div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisble">
        <div v-if="isShow" style="text-align: center;">
          {{sureMessage}}
        </div>
        <div style="text-align: center;" slot="footer" class="dialog-footer" v-if="isShow">
          <el-button type="primary" size="small" @click="yesRecall">是
          </el-button>
          <el-button type="info" size="small" @click="NoRecall">否
          </el-button>
        </div>
        <div style="text-align: center;" v-if="!isShow">
          {{resultMessage}}
        </div>
      </el-dialog>
    </el-card>
  </div>

</template>

<script>
  import Breadcrumb from '../common/Breadcrumb'
  import StockCodeQuery from '../common/StockCodeQuery';
  import selectRoleComponent from './superviseTaskComponent/selectRoleComponent'
  import {postFocusMonitorTable, deleteMonitorStock, recallFlow} from '../../service/superviseTask/focusMonitor/index'
  import moment from 'moment'
  import MinxinVue from './MixIn'

  export default {
    name: 'focus-monitor-security',
    components: {
      Breadcrumb,
      StockCodeQuery,
      selectRoleComponent
    },
    mixins: [MinxinVue],
    data() {
      return {
        breadcrumbItems: [
          {
            router: '/focusMonitorSecurity',
            label: '监察任务'
          },
          {
            router: '',
            label: '重点监控证券'
          }
        ],
        submitData: {disabled: false, stockCode: ''},
        selectRole: {
          dialogFormVisble: false
        },
        selectHandlerRole: {
          dialogFormVisble: false
        },
        /*
        0,申请人，1，在办人
        */
        personFlag: '0',
        selectParams: {
          monitorReason: '',
          monitorLevel: '',
          localStatus: '',
          applicant: '',
          handler: '',
          applyDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
          stockCode: ''
        },
        monitorReasonOptions: [
          {value: '1', label: '涉嫌跨期操纵'},
          {value: '2', label: '涉嫌短线操纵'},
          {value: '3', label: '异动股'},
          {value: '4', label: '其他'}
        ],
        monitorLevelOptions: [
          {value: '0', label: '0级'},
          {value: '1', label: '1级'},
          {value: '2', label: '2级'},
          {value: '3', label: '3级'}
        ],
        statusOptions: [
          {value: 'ALL', label: '全部'},
          {value: '0', label: '创建中'},
          {value: '1', label: '审批中'},
          {value: '2', label: '确认中'},
          {value: '3', label: '办结'}
        ],
        monitorSecurityData: [],
        monitorSecurityColumns: [
          {label: '监控编号', field: 'monitorNo', align: 'center', minWidth: '6%'},
          {label: '证券代码及简称', field: 'securityId', align: 'center', minWidth: '6%'},
          {label: '监控原因', field: 'reason', align: 'center', minWidth: '6%', formatter: this.reasonTxt},
          {label: '监控级别', field: 'level', align: 'center', minWidth: '6%', formatter: this.levelTxt},
          {label: '状态', field: 'localStatus', align: 'center', minWidth: '6%'},
          {label: '申请人', field: 'requesterName', align: 'center', minWidth: '6%'},
          {label: '在办人', field: 'currentUserNames', align: 'center', minWidth: '6%'},
          {label: '申请日期', field: 'createTime', align: 'center', minWidth: '6%'}
        ],
        CurrentPage: 1,
        PageTotal: 0,
        dialogFormVisble: false,
        isShow: true,
        recallParams: {},
        deleteparams: {},
        dialogTitle: '',
        sureMessage: '',
        resultMessage: '',
        reCallflag: '',
        pageIndex: 1,
        pageRows: 10,
        flag: false
      }
    },
    mounted() {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {stockCode, applicant, monitorLevel, localStatus, monitorReason, handler, applyDate} = this.$store.state.superviseTask.focusMonitorSecurity
        this.selectParams.stockCode = stockCode
        this.selectParams.applicant = applicant
        this.selectParams.monitorLevel = monitorLevel
        this.selectParams.localStatus = localStatus
        this.selectParams.monitorReason = monitorReason
        this.selectParams.handler = handler
        this.selectParams.applyDate = applyDate
      }
      this.query()
    },
    methods: {
      commitQueryParams() {
        let params = {
          stockCode: this.selectParams.stockCode, // 证券代码及简称
          applicant: this.selectParams.applicant, // 申请人
          monitorLevel: this.selectParams.monitorLevel, // 监控级别
          localStatus: this.selectParams.localStatus, // 状态
          monitorReason: this.selectParams.monitorReason, // 监控原因
          handler: this.selectParams.handler, // 在办人
          applyDate: this.selectParams.applyDate // 申请日期
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveFocusMonitorSecQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      reasonTxt(row) {
        if (row.reason == '1') {
          return '涉嫌跨期操纵'
        } else if (row.reason == '2') {
          return '涉嫌短线操纵'
        } else if (row.reason == '3') {
          return '异动股'
        } else {
          return '其他'
        }
      },
      levelTxt(row) {
        if (row.level == '1') {
          return '1级'
        } else if (row.level == '2') {
          return '2级'
        } else if (row.level == '3') {
          return '3级'
        } else {
          return '0级'
        }
      },
      getApplyPerson(code, name) {
        this.selectParams.applicant = name
      },
      getCurrentPerson(code, name) {
        this.selectParams.handler = name
      },
      getStockCode(stockCodeData) {
        if (stockCodeData) {
          this.selectParams.stockCode = stockCodeData.split(' ')[0]
        }
      },
      query() {
        this.commitQueryParams()
        let params = {
          'securityId': this.selectParams.stockCode,
          'reason': !this.selectParams.monitorReason ? 'ALL' : this.selectParams.monitorReason,
          'level': !this.selectParams.monitorLevel ? 'ALL' : this.selectParams.monitorLevel,
          'requesterName': !this.selectParams.applicant ? 'ALL' : this.selectParams.applicant,
          'currentUserNames': !this.selectParams.handler ? 'ALL' : this.selectParams.handler,
          'startDate': !this.selectParams.applyDate ? '' : this.selectParams.applyDate[0],
          'endDate': !this.selectParams.applyDate ? '' : this.selectParams.applyDate[1],
          'status': !this.selectParams.localStatus ? 'ALL' : this.selectParams.localStatus,
          'pageIndex': !this.flag ? '1' : this.pageIndex,
          'pageRows': this.pageRows
        }
        postFocusMonitorTable(JSON.stringify(params)).then(resp => {
          this.monitorSecurityData = resp.buzidata
          this.monitorSecurityData.forEach((el) => {
            el.securityId = el.securityId + ' ' + el.securityName
          })
          this.PageTotal = Number(resp.totalNum)
          if (!this.flag) {
            this.CurrentPage = 1
          }
          this.flag = false
        })
      },
      emptyForm() {
        this.submitData.stockCode = ''
        this.selectParams.monitorReason = ''
        this.selectParams.monitorLevel = ''
        this.selectParams.localStatus = ''
        this.selectParams.applicant = ''
        this.selectParams.handler = ''
        this.selectParams.stockCode = ''
        this.selectParams.applyDate = ''
      },
      pageSizeChange(val) {
        this.pageIndex = 1
        this.pageRows = val
        this.flag = true
        this.query()
      },
      currentPageChange(val) {
        this.pageIndex = val
        this.flag = true
        this.query()
      },
      newBuilt() {
        this.$router.push({name: 'newBuiltSecurity'});
      },
      jumpPage(row) {
        let str = row.operate1
        let localStatus = row.localStatus
        this.commitQueryParams()
        switch (str) {
          case '查看':
            this.$router.push({name: 'overMonitorSecurity', query: {instanceId: row.instanceId, taskId: row.taskId}});
            break;
          case '撤回':
            /* this.recallParams = {
              activityName: row.lastOperateActivityName,
              instanceId: row.instanceId,
              processName: 'msc'
            }
            this.reCallflag = true
            this.isShow = true
            this.dialogTitle = '撤回流程'
            this.sureMessage = '是否确认撤回？'
            this.dialogFormVisble = true */
            this.recall(row, this.query)
            break;
          case '处理':
            if (localStatus === '审批中') {
              this.$router.push({
                name: 'checkMonitorSecurity',
                query: {instanceId: row.instanceId, taskId: row.taskId}
              });
            } else if (localStatus === '确认中') {
              this.$router.push({
                name: 'affirmMonitorSecurity',
                query: {instanceId: row.instanceId, taskId: row.taskId}
              });
            } else {
              this.$router.push({name: 'newBuiltSecurity', query: {instanceId: row.instanceId, taskId: row.taskId}});
            }
            break;
          case '变更':
            this.$router.push({name: 'changeMonitorSecurity', query: {instanceId: row.instanceId, taskId: row.taskId}});
            break;
          default:
            this.deleteparams = {
              instanceId: row.instanceId
            }
            this.reCallflag = false
            this.isShow = true
            this.dialogTitle = '删除流程'
            this.sureMessage = '是否确认删除？'
            this.dialogFormVisble = true
            break;
        }
      },
      yesRecall() {
        if (this.reCallflag) {
          recallFlow(JSON.stringify(this.recallParams)).then(resp => {
            if (resp.msg == '调用成功') {
              this.resultMessage = '撤回成功！'
            } else {
              this.resultMessage = resp.msg
            }
            this.isShow = false
            setTimeout(() => {
              this.dialogFormVisble = false
              this.query()
            }, 2000)
          })
        } else {
          deleteMonitorStock(JSON.stringify(this.deleteparams)).then(resp => {
            if (resp) {
              this.isShow = false
              this.resultMessage = '删除成功！'
              setTimeout(() => {
                this.dialogFormVisble = false
                this.query()
              }, 2000)
            }
          })
        }
      },
      NoRecall() {
        this.dialogFormVisble = false
      },
      editPage(row) {
        let str = row.operate2
        let localStatus = row.localStatus
        switch (str) {
          case '查看':
            this.$router.push({name: 'overMonitorSecurity', query: {instanceId: row.instanceId, taskId: row.taskId}});
            break;
          case '撤回':
            this.recallParams = {
              activityName: row.lastOperateActivityName,
              instanceId: row.instanceId,
              processName: 'msc'
            }
            this.reCallflag = true
            this.isShow = true
            this.dialogTitle = '撤回流程'
            this.sureMessage = '是否确认撤回？'
            this.dialogFormVisble = true
            break;
          case '处理':
            if (localStatus === '审批中') {
              this.$router.push({
                name: 'checkMonitorSecurity',
                query: {instanceId: row.instanceId, taskId: row.taskId}
              });
            } else if (localStatus === '确认中') {
              this.$router.push({
                name: 'affirmMonitorSecurity',
                query: {instanceId: row.instanceId, taskId: row.taskId}
              });
            } else {
              this.$router.push({name: 'newBuiltSecurity', query: {instanceId: row.instanceId, taskId: row.taskId}});
            }
            break;
          case '变更':
            this.$router.push({name: 'changeMonitorSecurity', query: {instanceId: row.instanceId, taskId: row.taskId}});
            break;
          default:
            this.deleteparams = {
              instanceId: row.instanceId
            }
            this.reCallflag = false
            this.isShow = true
            this.dialogTitle = '删除流程'
            this.sureMessage = '是否确认删除？'
            this.dialogFormVisble = true
            break;
        }
      }
    }
  }
</script>

<style lang="less">
  .focusMonitorSecurity {
    .el-form {
      padding: 0px 20px;
      .el-form-item {
        height: 63px;
        margin-bottom: 0px;
        padding: 10px 0px;
      }
    }
    .el-dialog {
      width: 30%;
    }
  }
</style>
