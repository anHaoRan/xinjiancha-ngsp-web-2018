<template>
  <div class='checkBuiltAccountGroup'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card class='el-card-table'>
      <el-steps :active='activeName' style='padding:15px'>
        <el-step title='创建中' :description='processinfo[0]'></el-step>
        <el-step title='审核中' :description='processinfo[1]'></el-step>
        <el-step title='确认中' :description='processinfo[2]'></el-step>
        <el-step title='办结' :description='processinfo[3]'></el-step>
      </el-steps>
    </el-card>
    <div>
      <el-card class='el-card-table'>
        <div slot='header'>
          监控账户组信息
        </div>
        <el-form :inline='true' :model='selectParams' ref='selectParams'>
          <el-row :gutter='20'>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控编号：'>
                <el-input size='small' v-model='selectParams.monitorNumber' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控原因：'>
                <el-select v-model='selectParams.monitorReason' placeholder='请选择' size='small' :disabled='true'>
                  <el-option
                    v-for='item in monitorReasonOptions'
                    :key='item.value'
                    :label='item.label'
                    :value='item.value'
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='账户组名称：'>
                <el-input size='small' v-model='selectParams.accountGroupName' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='账户组代码：'>
                <el-input size='small' v-model='selectParams.accountGroupCode' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='创建者：'>
                <el-input size='small' v-model='selectParams.creator' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='线索单号：'>
                <el-button type='text' size='middle' style='border: none' @click='jumpClueReport'>
                  {{selectParams.clewReport}}
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控级别：'>
                <el-select v-model='selectParams.monitorLevel' placeholder='请选择' size='small' :disabled='true'>
                  <el-option
                    v-for='item in monitorLevelOptions'
                    :key='item.value'
                    :label='item.label'
                    :value='item.value'
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控起始日期：'>
                <el-date-picker
                  v-model='selectParams.startDate'
                  type='date'
                  size='small'
                  value-format='yyyy-MM-dd'
                  :disabled='true'
                  @change='getStartDate'
                  placeholder='开始日期'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控结束日期：'>
                <el-date-picker
                  v-model='selectParams.endDate'
                  type='date'
                  size='small'
                  :picker-options='endpickerOption'
                  :disabled='true'
                  value-format='yyyy-MM-dd'
                  placeholder='结束日期'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl='24'>
              <el-form-item label='账户备注：' class='describe'>
                <el-input v-model='selectParams.accountRemark' type='textarea' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='24'>
              <el-form-item label='详情描述：' class='describe'>
                <el-input v-model='selectParams.detailDescribe' type='textarea' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='24'>
              <el-form-item label='监控建议：' class='describe'>
                <el-input v-model='selectParams.monitorSuggest' type='textarea' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class='el-card-table'>
      <div slot='header'>
        账户明细
      </div>
      <el-table
        border
        max-height='400'
        :data='accountDetailData'
        @selection-change='selectedRow'
        style='width: 100%; overflow:visible'>
        <el-table-column
          type='selection'
          align='center'
        />
        <s-table-columns v-for='(item,index) in accountDetailColumns'
                         :key='index'
                         :item='item'
                         v-if='item.isActive===undefined||item.isActive'/>
      </el-table>
    </el-card>
    <el-card class='el-card-table'>
      <div slot='header'>
        涉及监控证券
      </div>
      <el-table
        border
        max-height='400'
        :data='monitorSecurityData'
        @selection-change='stockSelectedRow'
        style='width: 100%; overflow:visible'>
        <el-table-column
          type='selection'
          align='center'
        />
        <s-table-columns v-for='(item,index) in monitorSecurityColumns'
                         :key='index'
                         :item='item'
                         v-if='item.isActive===undefined||item.isActive'/>
      </el-table>
    </el-card>
    <el-card class='el-card-table'>
      <div class='btnWrap'>
        <el-button type='text' size='middle' :disabled="true">自动提取</el-button>
        <el-button type='text' size='middle' :disabled="true">导入</el-button>
        <el-button type='text' size='middle' :disabled="true">导出</el-button>
      </div>
      <div slot='header'>
        终端信息库
      </div>
      <el-table
        :data='infoLibraryData'
        border
        tooltip-effect='dark'
        size='small'
        highlight-current-row
        max-height='400'
        :reserve-selection='true'
        style='width: 100%'>
        <el-table-column
          v-for='column in infoLibraryColumns'
          :key='column.field'
          :align='column.align'
          :prop='column.field'
          :label='column.label'
          :min-width='column.minWidth'>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class='el-card-table'>
      <div slot='header'>
        历史变更记录
      </div>
      <el-table
        :data='historyChangeData'
        border
        tooltip-effect='dark'
        size='small'
        highlight-current-row
        max-height='400'
        :reserve-selection='true'
        style='width: 100%'>
        <el-table-column
          header-align='center'
          align='center'
          type='index'
          label='序号'
          width='50'>
        </el-table-column>
        <el-table-column
          v-for='column in historyChangeColumns'
          :key='column.field'
          :align='column.align'
          :prop='column.field'
          :label='column.label'
          :min-width='column.minWidth'>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class='el-card-table'>
      <div slot='header'>
        审核意见
      </div>
      <el-form :inline='true' :model='checkOptionParams' ref='checkOptionParams'>
        <el-form-item label='是否通过：' class='describe'>
          <el-radio-group v-model='checkOptionParams.radio'>
            <el-radio label='1'>是</el-radio>
            <el-radio label='2'>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='意见或建议：' class='describe'>
          <el-input v-model='checkOptionParams.suggestion' type='textarea' :maxlength=200
                    placeholder='最多输入200个字符'></el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data='checkSuggestionData'
        border
        tooltip-effect='dark'
        size='small'
        highlight-current-row
        max-height='400'
        :reserve-selection='true'
        style='width: 100%'>
        <el-table-column
          header-align='center'
          align='center'
          type='index'
          label='序号'
          width='50'>
        </el-table-column>
        <el-table-column
          v-for='column in checkSuggestionColumns'
          :key='column.field'
          :align='column.align'
          :prop='column.field'
          :label='column.label'
          :min-width='column.minWidth'>
        </el-table-column>
      </el-table>
    </el-card>
    <div style='text-align: right;padding: 15px'>
      <el-button type='primary' size='middle' @click='submit'>提交</el-button>
      <el-button type='primary' size='middle' @click='save'>保存</el-button>
      <el-button type='info' size='middle' @click='goBack'>返回</el-button>
    </div>
  </div>

</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import InputContent from './inputContent'
  import SelectCode from './selectCode'
  import SelectDateContent from './selectDateContent.vue'
  import moment from 'moment'
  import MinxinVue from '../MixIn'
  import {
    getHistorySuggest, getFormInfo, postFocusMonitorApproval, postFocusAccountGroupSave
  } from '../../../service/superviseTask/focusAccountGroup/index'

  export default {
    name: 'focus-monitor-security',
    components: {
      Breadcrumb,
      StockCodeQuery,
      STableColumns: () => import('@/components/base/STableColumns')   // 表格列
    },
    mixins: [MinxinVue],
    data() {
      return {
        processStatusName: ['创建中', '审核中', '确认中', '办结', '变更中'],
        breadcrumbItems: [
          {
            router: '',
            label: '监察任务'
          },
          {
            router: '/focusMonitorAccountGroup',
            label: '重点监控账户组'
          },
          {
            router: '',
            label: '重点监控账户组表单'
          }
        ],
        submitData: {disabled: false},
        activeName: 2,
        processinfo: ['', '', '', ''],
        selectParams: {
          monitorNumber: '',
          monitorReason: '',
          accountGroupName: '',
          accountGroupCode: '',
          monitorLevel: '',
          startDate: '',
          endDate: '',
          clewReport: '',
          creator: '',
          accountRemark: '',
          detailDescribe: '',
          monitorSuggest: ''
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < new Date(this.selectParams.startDate).getTime() - 3600 * 1000 * 24
          }
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
        accountDetailData: [],  // 账户组表格
        accountDetailColumns: [
          {label: '账户号', field: 'accountId', align: 'center', width: '6%', template: InputContent},
          {label: '账户名称', field: 'accountName', align: 'center', width: '6%', template: InputContent},
          {label: '会员名称', field: 'memberName', align: 'center', width: '6%', template: InputContent},
          {label: '一码通', field: 'ymtAccountId', align: 'center', width: '6%', template: InputContent},
          {label: '终端关联', field: 'relateTerminal', align: 'center', width: '6%', template: InputContent},
          {label: '交易关联', field: 'relateTrade', align: 'center', width: '6%', template: InputContent},
          {label: '开户关联', field: 'relateOpenAccount', align: 'center', width: '6%', template: InputContent},
          {label: '其他关联', field: 'relateOther', align: 'center', width: '6%', template: InputContent},
          {label: '关联级别', field: 'relateLevel', align: 'center', width: '6%', template: InputContent}
        ],
        monitorSecurityData: [],  // 涉及监控证券
        monitorSecurityColumns: [
          {label: '证券代码及名称', field: 'securityId', align: 'center', width: '6%', template: SelectCode},
          {label: '开始日期', field: 'startDate', align: 'center', width: '6%', template: SelectDateContent},
          {label: '结束日期', field: 'endDate', align: 'center', width: '6%', template: SelectDateContent}
        ],
        infoLibraryData: [],
        infoLibraryColumns: [
          {label: '股东账户', field: 'reportName', align: 'center', minWidth: '6%'},
          {label: '股东名称', field: 'beginTime', align: 'center', minWidth: '6%'},
          {label: '交易日期', field: 'endTime', align: 'center', minWidth: '6%'},
          {label: '证券代码', field: 'status', align: 'center', minWidth: '6%'},
          {label: '证券名称', field: 'status1', align: 'center', minWidth: '6%'},
          {label: 'IP地址', field: 'status2', align: 'center', minWidth: '6%'},
          {label: 'MAC地址', field: 'status3', align: 'center', minWidth: '6%'},
          {label: '硬盘序列号', field: 'status4', align: 'center', minWidth: '6%'},
          {label: '手机号', field: 'status5', align: 'center', minWidth: '6%'},
          {label: '其他终端信息', field: 'status6', align: 'center', minWidth: '6%'}
        ],
        historyChangeData: [],  // 历史变更表格
        historyChangeColumns: [
          {label: '变更日期', field: 'altTime', align: 'center', minWidth: '5%'},
          {label: '变更内容', field: 'altDetail', align: 'left', minWidth: '15%'},
          {label: '处理人', field: 'altPerson', align: 'center', minWidth: '4%'},
          {label: '审核人', field: 'exmPerson', align: 'center', minWidth: '4%'}
        ],
        checkOptionParams: {
          radio: '1',
          suggestion: ''
        },
        checkSuggestionData: [],
        checkSuggestionColumns: [
          {label: '流程状态', field: 'proceStatus', align: 'center', minWidth: '6%'},
          {label: '审核意见', field: 'comment', align: 'center', minWidth: '6%'},
          {label: '处理人', field: 'procePerson', align: 'center', minWidth: '6%'},
          {label: '审核日期', field: 'createTime', align: 'center', minWidth: '6%'}
        ],
        CurrentPage: 1,
        PageTotal: 0,
        check: true,
        accountEditIndex: [],
        stockEditIndex: [],
        MagMainParams: {},
        MagMainInfoId: '',
        clueInfoParams: '' // 请求线索报告信息参数
      }
    },
    created() {
      this.getHistorySuggestion()
    },
    mounted() {
      this.getFormInfo()
    },
    methods: {
      // 获取表单信息
      getFormInfo() {
        getFormInfo(this.$route.query.instanceId).then(resp => {
          resp.MagSecuritydetail.forEach((el) => {
            el.readonly = true
          })
          resp.MagAccountdetail.forEach((el) => {
            el.readonly = true
          })
          this.monitorSecurityData = resp.MagSecuritydetail
          this.accountDetailData = resp.MagAccountdetail
          this.historyChangeData = resp.MagAlthistory
          let res = resp.MagMain
          this.MagMainParams = resp.MagMain
          this.MagMainInfoId = resp.infoId
          this.selectParams.monitorNumber = res.monitorNo.toString()
          this.selectParams.monitorReason = res.reason.toString()
          this.selectParams.accountGroupName = res.name
          this.selectParams.accountGroupCode = res.code
          this.selectParams.monitorLevel = res.level + '级'
          this.selectParams.startDate = res.startDate
          this.selectParams.endDate = res.endDate
          this.selectParams.creator = res.createPerson
          this.selectParams.clewReport = res.extend2
          this.selectParams.accountRemark = res.comment
          this.selectParams.detailDescribe = res.descriprtion
          this.selectParams.monitorSuggest = res.suggestion
          this.clueInfoParams = res.clueId
          this.checkOptionParams.suggestion = res.extend1
        })
      },
      // 获取历史审核意见
      getHistorySuggestion() {
        getHistorySuggest(this.$route.query.instanceId).then(resp => {
          let res = resp.value
          res.forEach((el, index) => {
            el.createTime = moment(el.createTime).format('YYYY/MM/DD HH:mm:ss')
            this.processinfo[el.proceStatus] = el.procePerson + ' ' + el.createTime
            el.proceStatus = this.processStatusName[el.proceStatus]
          })
          this.checkSuggestionData = res
        })
      },
      // 开始时间变更
      getStartDate(val) {
        let reason = this.selectParams.monitorReason
        if (!val) {
          this.selectParams.endDate = ''
        } else {
          if (reason == '1' || reason == '2') {
            this.selectParams.endDate = new Date(new Date(val).getTime() + 3600 * 1000 * 24 * 30)
          } else {
            this.selectParams.endDate = new Date(new Date(val).getTime() + 3600 * 1000 * 24 * 7)
          }
        }
      },
      selectedRow(row) {
        this.accountEditIndex = []
        row.forEach((el) => {
          this.accountEditIndex.push(el.reportName)
        })
      },
      stockSelectedRow(row) {
        this.stockEditIndex = []
        row.forEach((el) => {
          this.stockEditIndex.push(el.reportName)
        })
      },
      submit() {
        this.MagMainParams.infoId = this.MagMainInfoId
        this.MagMainParams.extend1 = this.checkOptionParams.suggestion
        let params = {
          'MagMain': this.MagMainParams,
          'taskId': this.$route.query.taskId,
          'toWhom': '',
          'approve': this.checkOptionParams.radio == '1' ? 'true' : 'false'
        }
        postFocusMonitorApproval(JSON.stringify(params)).then(resp => {
          this.$message.success(resp.msg + '，提交到下一节点：' + resp.assignee[0].assigneeName)
          this.goBack()
        })
      },
      save() {
        this.MagMainParams.infoId = this.MagMainInfoId
        this.MagMainParams.extend1 = this.checkOptionParams.suggestion
        let params = {
          'MagMain': this.MagMainParams,
          'taskId': this.$route.query.taskId,
          'toWhom': '',
          'approve': this.checkOptionParams.radio == '1' ? 'true' : 'false'
        }
        postFocusAccountGroupSave(JSON.stringify(params)).then(resp => {
          this.$message.success('保存流程表单成功')
        })
      },
      // 跳线索上报流程
      jumpClueReport() {
        window.open(`#/clueReportForm?operate=1&instanceId=${this.clueInfoParams}&isNewTab=true`)
        // this.$router.push({name: 'clueReportForm', query: {operate: '1', taskId: '', instanceId: this.clueInfoParams}})
      }
    }
  }
</script>

<style lang='less'>
  .checkBuiltAccountGroup {
    .btnWrap {
      padding: 10px 20px;
      .el-button--text {
        border: none;
      }
    }
    .el-step__title.is-process {
      color: #fff
    }
    .el-form {
      padding: 0px 20px;
      .el-form-item {
        height: 63px;
        margin-bottom: 0px;
        padding: 10px 0px;
      }
    }
    .describe {
      width: 100%;
      .el-form-item__content {
        width: 88%;
      }
    }
  }
</style>
