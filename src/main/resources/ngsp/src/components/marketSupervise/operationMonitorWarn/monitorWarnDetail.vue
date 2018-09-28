<template>
  <div class='monitorWarnDetail'>
    <!--面包屑组件-->
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card style='width: 100%;position: relative;overflow: visible'>
      <div slot='header'>
        预警详情
      </div>
      <warn-charts @getAlarmRuleCode="getAlarmRuleCode"></warn-charts>
    </el-card>
    <el-card style='margin-top: 0px' class='el-card-table'>
      <div slot='header'>
        舆情公告
        <el-button :icon='icon' size='mini' class='iconName' @click='unflodSteps'></el-button>
      </div>
      <div class='notice' v-show='isShow'>
        <el-table
          :data='noticeData'
          border
          tooltip-effect='dark'
          :show-header='false'
          size='small'
          highlight-current-row
          style='width: 100%'>
          <el-table-column
            min-width='4%'
            align='center'
            label='时间'>
            <template slot-scope='scope'>
              <div class='timePoint'>
                <div></div>
                <div>13:10</div>
              </div>
              <div class='line'></div>
            </template>
          </el-table-column>
          <el-table-column
            v-for='column in noticeColumns'
            :key=column.field
            :align=column.align
            :prop=column.field
            :label=column.label
            :min-width=column.minWidth>
          </el-table-column>
          <el-table-column
            min-width='4%'
            align='center'
            label='操作'>
            <template slot-scope='scope'>
              <el-button @click='getNoticeDetail' type='text' size='small' style='border: none;color:#1b5eed
'>详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style='text-align: right;margin-top: 20px'>
        <el-button @click='jumpClassify()' type='primary' size='small' style='background-color:#1b5eed
'>分类投资者监测
        </el-button>
        <el-button @click='jumpSecurity()' type='primary' size='small' style='background-color:#1b5eed
'>证券运行监测
        </el-button>
        <el-button @click='jumpHigh()' type='primary' size='small' style='background-color:#1b5eed
'>高级查询
        </el-button>
      </div>
    </el-card>
    <el-card class='el-card-table'>
      <div slot='header'>
        预警基本信息
      </div>
      <el-row style='padding:20px 10px 0px'>
        <el-col :span='6'>
          <el-col :span='4' class='name' style='height: 32px;line-height: 32px'>标题：</el-col>
          <el-col :span='18' class='name'>
            <el-input size='mini' v-model='warnTitle' disabled></el-input>
          </el-col>
        </el-col>
        <el-col :span='6'>
          <el-col :span='6' class='name' style='height: 32px;line-height: 32px'>预警编号：</el-col>
          <el-col :span='18' class='name'>
            <el-input size='mini' v-model='warnNumber' disabled></el-input>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="padding: 0px 10px">
        <el-col :span='24'>
          <el-col :span='1.8' class='name' style='height: 44px;line-height: 44px'>预警描述：</el-col>
          <el-col :span='18'>
            <p>{{warnDescribe}}</p>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card style='margin-top: 0px' class='el-card-table'>
      <div slot='header' class='clearfix'>
        今日预警历史记录
      </div>
      <el-table
        :data='warnHistory'
        border
        tooltip-effect='dark'
        size='small'
        highlight-current-row
        :row-class-name='tableRowClassName'
        style='width: 100%'>
        <el-table-column
          align='center'
          label='编号'
          type='index'
          width='50'>
        </el-table-column>
        <el-table-column
          v-for='column in warnColumns'
          :key=column.field
          :align=column.align
          :prop=column.field
          :label=column.label
          :min-width=column.minWidth>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class='el-card-table'>
      <div slot='header'>
        处理记录
      </div>
      <el-table
        :data='detailRecord'
        border
        tooltip-effect='dark'
        size='small'
        highlight-current-row
        style='width: 100%'>
        <el-table-column
          align='center'
          label='编号'
          type='index'
          width='50'>
        </el-table-column>
        <el-table-column
          v-for='column in detailRecordColumns'
          :key=column.field
          :align=column.align
          :prop=column.field
          :label=column.label
          :min-width=column.minWidth>
        </el-table-column>
        <el-table-column
          min-width='6%'
          align='center'
          label='操作'>
          <template slot-scope='scope'>
            <el-button @click='editRecord(scope.row)' v-if='!scope.row.RECORD?false:true' type='text' size='small'
                       style='border: none;color:#1b5eed
' :disabled="scope.row.IS_HANDLE == '0'?false:true">编辑
            </el-button>
            <el-button @click='removeRecord(scope.row)' v-if='scope.row.BIZ_STATUS?false:true' type='text' size='small'
                       style='border: none;color:#1b5eed
' :disabled="scope.row.IS_HANDLE == '0'?false:true">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="是否删除" :visible.sync="dialogForm">
        <div style="text-align: center;">
          是否确定删除？
        </div>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="yesRecall">是
          </el-button>
          <el-button type="info" size="small" @click="NoRecall">否
          </el-button>
        </div>
      </el-dialog>
      <div class='detailStatus'>
        <el-row>
          <el-col :span='24'>
            <div>处理情况：</div>
            <br/>
            <el-col :span='24' class='name'>
              <el-input type='textarea' v-model='detailText'></el-input>
            </el-col>
          </el-col>
        </el-row>
        <el-row style='text-align: center;margin-top: 20px'>
          <el-button type='primary' size='small' style='background-color:#1b5eed' @click='submitRecord'>提交日志
          </el-button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
  //  面包屑组件引入
  import breadcrumb from '../../common/Breadcrumb';
  import WarnCharts from './monitorWarnDetail/warnCharts';
  import moment from 'moment';
  import {
    getAlarmInfo,
    getLogRecord,
    deleteAlarmRecord,
    editAlarmRecord
  } from '../../../service/marketSupervise/operationMonitorWarn/index'

  export default {
    //  组件注册
    components: {
      breadcrumb,
      WarnCharts
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '市场运行监测'
          }, {
            router: '/operationMonitorWarn',
            label: '运行监测预警'
          }, {
            router: '/monitorWarnDetail',
            label: '运行监测预警-详情'
          }
        ],
        icon: 'el-icon-arrow-down',
        warnTitle: '',
        warnNumber: '',
        warnDescribe: '',
        warnHistory: [],
        detailRecord: [],
        warnColumns: [
          {label: '触发对象', field: 'strikeOB', align: 'center', minWidth: '5%'},
          {label: '触发值', field: 'strikeValue', align: 'center', minWidth: '5%'},
          {label: '预警阈值', field: 'alarmStrikeValue', align: 'center', minWidth: '6%'},
          {label: '触发时间', field: 'alarmStartTime', align: 'center', minWidth: '8%'},
          {label: '终止时间', field: 'alarmEndTime', align: 'center', minWidth: '8%'},
          {label: '今日触发次数', field: 'strikeCount', align: 'center', minWidth: '8%'}
        ],
        detailRecordColumns: [
          {label: '姓名', field: 'UPDATE_USER', align: 'center', minWidth: '5%'},
          {label: '日期', field: 'UPDATE_TIME', align: 'center', minWidth: '5%'},
          {label: '日志内容', field: 'RECORD', align: 'left', minWidth: '15%'},
          {label: '更新预警状态', field: 'BIZ_STATUS', align: 'center', minWidth: '5%'}
        ],
        detailText: '',
        noticeData: [
          {title: '地产股早盘再度崛起', notice: '由证券营业部导致茅台股价行情出现异常，由证券营业部导致茅台股价行情出现异常，由证券营业部'},
          {title: '地产股早盘再度崛起', notice: '由证券营业部导致茅台股价行情出现异常，由证券营业部导致茅台股价行情出现异常，由证券营业部'}
        ],
        noticeColumns: [
          {label: '标题', field: 'title', align: 'left', minWidth: '5%'},
          {label: '公告', field: 'notice', align: 'left', minWidth: '15%'}
        ],
        isShow: false,
        params: {recordID: '', record: '', bizFlowID: '', alarmID: ''},
        forbidInput: true,
        routerParams: {},
        dialogForm: false,
        deleteParams: ''
      }
    },
    methods: {
      getAlarmRuleCode(val) {
        this.getAlarmInfoData(JSON.parse(this.$route.query.params).alarmID, val)
      },
      tableRowClassName({row, index}) {
        let startTime = moment(row.alarmStartTime, 'HH:mm:ss').format('HH:mm')
        if (startTime === this.routerParams.alarmStartTime) {
          return 'highLight'
        }
        return ''
      },
      // 获取舆情公告详情
      getNoticeDetail() {
      },
      // 编辑日志记录
      editRecord(row) {
        this.detailText = row.RECORD
        this.params.recordID = row.ID
        this.params.bizFlowID = row.BIZ_FLOW_ID
        this.forbidInput = false
      },
      // 提交日志
      submitRecord() {
        this.params.record = this.detailText
        this.params.alarmID = JSON.parse(this.$route.query.params).alarmID
        if (!this.params.record) {
          this.$message.warning('日志内容不能为空！')
        } else {
          if (this.params.record.length > 500) {
            this.$message.warning('字符长度不可超过1000')
            this.detailText = ''
          } else {
            editAlarmRecord(this.params).then((resp) => {
              if (resp.success) {
                this.getLogRecordData()
                this.detailText = ''
                this.forbidInput = true
                this.params.record = ''
                this.params.recordID = ''
                this.params.bizFlowID = ''
              } else {
                this.$message.warning('无权限编辑他人记录！')
                this.detailText = ''
                this.params.record = ''
                this.params.recordID = ''
                this.params.bizFlowID = ''
              }
            })
          }
        }
      },
      // 删除日志记录
      removeRecord(row) {
        this.dialogForm = true
        this.deleteParams = row.BIZ_FLOW_ID
      },
      yesRecall() {
        deleteAlarmRecord(this.deleteParams).then((resp) => {
          if (resp.success) {
            this.getLogRecordData()
            this.dialogForm = false
          } else {
            this.$message.warning('无权限删除他人记录！')
          }
        })
      },
      NoRecall() {
        this.dialogForm = false
      },
      // 展开步骤进度条
      unflodSteps() {
        if (this.icon == 'el-icon-arrow-down') {
          this.icon = 'el-icon-arrow-up'
          this.isShow = true
        } else {
          this.icon = 'el-icon-arrow-down'
          this.isShow = false
        }
      },
      // 跳转分类投资者
      jumpClassify() {
        let params = {
          beginTime: this.routerParams.alarmStartTime,
          endTime: this.routerParams.alarmEndTime,
          stockCode: this.routerParams.stockCode,
          stockCodeName: this.routerParams.stockCodeName
        }
        window.open(`#/classifiedInvestorMonitoring?params=` + JSON.stringify(params))
      },
      // 跳转证券运行监测
      jumpSecurity() {
        let params = {
          beginTime: this.routerParams.alarmStartTime,
          endTime: this.routerParams.alarmEndTime,
          stockCode: this.routerParams.stockCode,
          stockCodeName: this.routerParams.stockCodeName
        }
        window.open(`#/stockOperationMonitor?params=` + JSON.stringify(params))
      },
      // 跳转高级查询
      jumpHigh() {
        let params = {
          beginTime: this.routerParams.alarmStartTime,
          endTime: this.routerParams.alarmEndTime,
          stockCode: this.routerParams.stockCode,
          stockCodeName: this.routerParams.stockCodeName
        }
        window.open(`#/highQuery?params=` + JSON.stringify(params))
      },
      // 获取预警详情数据
      getAlarmInfoData(alarmID, alarmRuleCode) {
        getAlarmInfo(alarmID, alarmRuleCode)
          .then((resp) => {
            this.warnTitle = resp.title
            this.warnNumber = resp.alarmID
            this.warnDescribe = resp.alarmDesc
            resp.alarmList.forEach((el) => {
              el.alarmStartTime = moment(el.alarmStartTime, 'HHmmss').format('HH:mm:ss')
              el.alarmEndTime = moment(el.alarmEndTime, 'HHmmss').format('HH:mm:ss')
            })
            this.warnHistory = resp.alarmList
          })
      },
      // 获取日志记录
      getLogRecordData() {
        getLogRecord(JSON.parse(this.$route.query.params).alarmID)
          .then((resp) => {
            resp.forEach((el) => {
              el.alarmProcDate = moment(el.alarmProcDate).format('YYYY-MM-DD') + ' ' + moment(el.alarmProcTime, 'HHmmss').format('HH:mm:ss')
            })
            this.detailRecord = resp
          })
      }
    },
    mounted() {
      this.routerParams = JSON.parse(this.$route.query.params)
      this.getAlarmInfoData(JSON.parse(this.$route.query.params).alarmID, JSON.parse(this.$route.query.params).alarmRuleCode)
      this.getLogRecordData()
    }
  }
</script>
<style lang='less'>
  .monitorWarnDetail {
    .highLight {
      background-color: #3d507a !important;
    }
    .iconName {
      background-color: transparent;
      color: #fff;
      font-size: 18px;
      border: none;
    }
    .detailStatus {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 20px;
      .el-textarea__inner:hover {
        border-color: #455579;
      }
    }
    .notice {
      .el-table__body-wrapper {
        tbody {
          > .el-table__row {
            height: 80px;
            .timePoint {
              margin-left: 40px;
              display: flex;
              > div:nth-child(1) {
                width: 8px;
                height: 8px;
                border-radius: 4px;
                background-color: #0a4bd6;
                position: relative;
                top: 7px;
                margin-right: 15px
              }
            }
            .line {
              margin-left: 40px;
              width: 1px;
              height: 60px;
              position: absolute;
              left: 14px;
              z-index: 100;
              background-color: #465678
            }
          }
          > .el-table__row:last-child {
            .line {
              display: none;
            }
          }
        }
      }
    }
  }
</style>
