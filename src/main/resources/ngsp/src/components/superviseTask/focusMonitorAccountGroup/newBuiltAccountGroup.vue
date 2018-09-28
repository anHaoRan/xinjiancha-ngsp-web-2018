<template>
  <div class='newBuiltAccountGroup'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card class='el-card-table'>
      <el-steps :active='activeName' style='padding:15px'>
        <el-step title='创建中' :description='processinfo0'></el-step>
        <el-step title='审核中' :description='processinfo3'></el-step>
        <el-step title='确认中' :description='processinfo5'></el-step>
        <el-step title='办结' :description='processinfo7'></el-step>
      </el-steps>
    </el-card>
    <div>
      <el-card class='el-card-table'>
        <div slot='header'>
          监控账户组信息
        </div>
        <el-form :inline='true' :model='selectParams' ref='selectParams' :rules='rules'>
          <el-row :gutter='20'>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控编号：'>
                <el-input size='small' v-model='selectParams.monitorNumber' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='账户组名称：'>
                <el-input size='small' v-model='selectParams.accountGroupName'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='账户组代码：'>
                <el-input size='small' v-model='selectParams.accountGroupCode'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='创建者：'>
                <el-input size='small' v-model='selectParams.creator' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控原因：' required prop='monitorReason'>
                <el-select v-model='selectParams.monitorReason' placeholder='请选择' size='small' @change='getReason'>
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
              <el-form-item label='监控级别：' required prop='monitorLevel'>
                <el-select v-model='selectParams.monitorLevel' placeholder='请选择' size='small'>
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
              <el-form-item label='监控起始日期：' required prop='startDate'>
                <el-date-picker
                  v-model='selectParams.startDate'
                  type='date'
                  size='small'
                  value-format='yyyy-MM-dd'
                  @change='getStartDate'
                  placeholder='开始日期'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控结束日期：' required prop='endDate'>
                <el-date-picker
                  v-model='selectParams.endDate'
                  type='date'
                  size='small'
                  :picker-options='endpickerOption'
                  value-format='yyyy-MM-dd'
                  placeholder='结束日期'>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='线索单号：'>
                <el-button type='text' size='middle' style='border: none' @click='jumpClueReport'
                           :disabled='!clueInfoParams?true:false'>{{selectParams.clewReport}}
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :xl='24'>
              <el-form-item label='账户备注：' class='describe'>
                <el-input v-model='selectParams.accountRemark' type='textarea' :maxlength=200
                          placeholder='最多输入200个字符'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='24'>
              <el-form-item label='详情描述：' class='describe'>
                <el-input v-model='selectParams.detailDescribe' type='textarea' :maxlength=200
                          placeholder='最多输入200个字符'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='24'>
              <el-form-item label='监控建议：' class='describe'>
                <el-input v-model='selectParams.monitorSuggest' type='textarea' :maxlength=200
                          placeholder='最多输入200个字符'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <el-card class='el-card-table'>
      <div class='btnWrap'>
        <el-button type='text' size='middle' @click='addRow'>新增</el-button>
        <el-button type='text' size='middle' @click='editRow'>修改</el-button>
        <el-button type='text' size='middle' @click='deleteAccountDetail'>删除</el-button>
        <text-upload @getTxtCon='getTxtData' :uploadOption='uploadOption' style='display: inline-block'></text-upload>
      </div>
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
    <el-dialog title='是否删除' :visible.sync='dialogForm'>
      <div style='text-align: center;'>
        是否确定删除？
      </div>
      <div style='text-align: center;' slot='footer' class='dialog-footer'>
        <el-button type='primary' size='small' @click='yesRecall'>是
        </el-button>
        <el-button type='info' size='small' @click='NoRecall'>否
        </el-button>
      </div>
    </el-dialog>
    <el-card class='el-card-table'>
      <div class='btnWrap'>
        <el-button type='text' size='middle' @click='stockAddRow'>新增</el-button>
        <el-button type='text' size='middle' @click='stockEditRow'>修改</el-button>
        <el-button type='text' size='middle' @click='deleteMonitorStock'>删除</el-button>
      </div>
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
        <el-button type='text' size='middle' :disabled='true'>自动提取</el-button>
        <el-button type='text' size='middle' :disabled='true'>导入</el-button>
        <el-button type='text' size='middle' :disabled='true'>导出</el-button>
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
        关联线索报告
      </div>
      <el-form :inline='true' :model='checkOptionParams' ref='checkOptionParams' :rules='clueRules'>
        <el-row :gutter='20'>
          <el-col :xl='24'>
            <el-form-item label='是否关联线索报告：'>
              <el-radio-group v-model='checkOptionParams.clueReport' @change='getClueReport' :disabled='isDisabled'>
                <el-radio label='1'>是</el-radio>
                <el-radio label='2'>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl='6' :lg='8' :md='12' :sm='24' v-if='checkOptionParams.clueReport == "2"?false:true'>
            <el-form-item label='线索编号：' required prop='clueNum'>
              <el-input size='small' v-model='checkOptionParams.clueNum' :disabled='isDisabled'></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl='6' :lg='8' :md='12' :sm='24' v-if='checkOptionParams.clueReport == "2"?false:true'>
            <el-form-item label='线索名称：' required prop='clueName'>
              <el-input size='small' v-model='checkOptionParams.clueName' :disabled='isDisabled' :maxlength=20
                        placeholder='最多输入20个字符'></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl='6' :lg='8' :md='12' :sm='24' v-if='checkOptionParams.clueReport == "2"?false:true'>
            <el-form-item label='线索分类：' required prop='clueClass'>
              <el-radio-group v-model='checkOptionParams.clueClass' :disabled='isDisabled'>
                <el-radio label='0'>关注类</el-radio>
                <el-radio label='1'>调查类</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl='6' :lg='8' :md='12' :sm='24' v-if='checkOptionParams.clueReport == "2"?false:true'>
            <el-form-item label='是否线索上报：' required prop='isNeedReport'>
              <el-radio-group v-model='checkOptionParams.isNeedReport' :disabled='isDisabled'>
                <el-radio label='1'>是</el-radio>
                <el-radio label='0'>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xl='24' v-if='checkOptionParams.clueReport == "2"?false:true'>
            <el-form-item label='线索类型：' required prop='clueType'>
              <el-checkbox-group v-model='checkOptionParams.clueType' :disabled='isDisabled'>
                <el-checkbox label='内幕交易'></el-checkbox>
                <el-checkbox label='市场操纵'></el-checkbox>
                <el-checkbox label='利益输送-股票'></el-checkbox>
                <el-checkbox label='利益输送-债券'></el-checkbox>
                <el-checkbox label='超比例持股'></el-checkbox>
                <el-checkbox label='老鼠仓'></el-checkbox>
                <el-checkbox label='短线交易'></el-checkbox>
                <el-checkbox label='其它-股票'></el-checkbox>
                <el-checkbox label='其它-债券'></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :xl='24' v-if='checkOptionParams.clueReport == "2"?false:true'>
            <el-form-item label='线索描述：' class='describe'>
              <el-input v-model='checkOptionParams.clueDescribe' type='textarea' :disabled='isDisabled' :maxlength=200
                        placeholder='最多输入200个字符'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        审核意见
      </div>
      <el-form :inline='true'>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="您的意见：" class='describe'>
            <el-input v-model='auditoption' type='textarea' :maxlength=200
                      placeholder='最多输入200个字符'></el-input>
          </el-form-item>
        </el-col>
      </el-form>
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
  import TextUpload from '../../common/textUpload'
  import {
    getStockNum,
    getInfoIdData,
    getUserRoles,
    getHistorySuggest,
    postFocusAccountGroupStart,
    postFocusAccountGroupSave,
    getFormInfo,
    getAccountInfo,
    getClueReportInfo,
    relevanceClueReport
  } from '../../../service/superviseTask/focusAccountGroup/index'
  import moment from 'moment'
  import MixIn from '../MixIn'
  import MixinAuthority from '../MixinAuthority'

  export default {
    name: 'focus-monitor-security',
    components: {
      Breadcrumb,
      StockCodeQuery,
      TextUpload,
      STableColumns: () => import('@/components/base/STableColumns')   // 表格列
    },
    mixins: [MixIn, MixinAuthority],
    data() {
      return {
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
        submitData: {disabled: false, stockCode: ''},
        uploadOption: {name: '批量导入', size: 'mini', type: 'text'}, // 上传按钮参数
        activeName: 0,
        processinfo0: '',
        processinfo3: '',
        processinfo5: '',
        processinfo7: '',
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
        rules: {
          monitorReason: [{required: true, message: '请选择监控原因', trigger: 'change'}],
          monitorLevel: [{required: true, message: '请选择证券级别', trigger: 'change'}],
          stockCode: [{required: true, message: '请输入证券代码', trigger: 'change'}],
          startDate: [{required: true, message: '请输入开始日期', trigger: 'change'}],
          endDate: [{required: true, message: '请输入结束日期', trigger: 'change'}]
        },
        clueRules: {
          clueNum: [{required: true, message: '请输入线索编号', trigger: 'change'}],
          clueName: [{required: true, message: '请输入线索名称', trigger: 'change'}],
          clueClass: [{required: true, message: '请选择线索分类', trigger: 'change'}],
          isNeedReport: [{required: true, message: '请选择是否上报', trigger: 'change'}],
          clueType: [{required: true, message: '请选择线索类型', trigger: 'change'}]
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < new Date(this.selectParams.startDate).getTime() - 3600 * 1000 * 24
          }
        },
        checkOptionParams: {
          clueReport: '2',
          isNeedReport: '',
          clueClass: '',
          clueType: [],
          clueNum: '',
          clueName: '',
          clueDescribe: ''
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
        check: true,
        accountEditIndex: [],
        stockEditIndex: [],
        infoId: '',
        creatorGroup: '',  // 账户组
        MagMainParams: {},
        MagMainInfoId: '',
        dialogForm: false,
        deleteFlag: '',
        clueId: '',  // 线索编号
        clueInfoId: '',  // 线索报告infoId
        isDisabled: false,
        clueInfoParams: '', // 请求线索报告信息参数
        auditoption: '' // 意见
      }
    },
    created() {
      if (this.$route.query.params) {
        let params = JSON.parse(this.$route.query.params)
        if (params.monitorReason == '涉嫌跨期操纵') {
          this.selectParams.monitorReason = '1'
        } else if (params.monitorReason == '涉嫌短线操纵') {
          this.selectParams.monitorReason = '2'
        } else if (params.monitorReason == '异动股') {
          this.selectParams.monitorReason = '3'
        } else {
          this.selectParams.monitorReason = '4'
        }
        this.selectParams.stockCode = params.stockCode
        this.selectParams.stockName = params.stockCodeName
        this.submitData.stockCode = params.stockCode + ' ' + params.stockCodeName
        let accountCode = params.accountCode.split(',')
        accountCode.forEach((el) => {
          this.accountDetailData.push({
            accountId: el,
            accountName: '',
            memberName: '',
            ymtAccountId: '',
            relateTerminal: '',
            relateTrade: '',
            relateOpenAccount: '',
            relateOther: '',
            relateLevel: '',
            readonly: false
          })
        })
      }
    },
    watch: {
      accountDetailData: {
        handler: function (param1, param2) {
          let accountId = []
          param1.forEach((el) => {
            if (el.accountId) {
              accountId.push(el.accountId)
            }
          })
          let repeatId = ''
          accountId = accountId.sort()
          accountId.forEach((el, index) => {
            if (accountId[index] == accountId[index + 1]) {
              repeatId = accountId[index + 1]
              this.$message.warning('账户号：' + accountId[index + 1] + '已存在，不能重复添加！')
              let flag = 0
              this.accountDetailData.forEach((el, index) => {
                if (el.accountId == repeatId) {
                  if (flag > 0) {
                    this.accountDetailData.splice(index, 1)
                  }
                  flag++
                }
              })
            }
          })
        },
        deep: true
      }
    },
    mounted() {
      this.getMonitorNum()
      this.getUserGroup()
      if (this.$route.query.instanceId) {
        this.getFormInfo()
        //  this.getClueReportInfoData()
      }
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
          let res = resp.MagMain
          this.MagMainParams = resp.MagMain
          this.MagMainInfoId = resp.infoId
          this.selectParams.monitorNumber = res.monitorNo.toString()
          this.selectParams.monitorReason = res.reason.toString()
          this.selectParams.accountGroupName = res.name
          this.selectParams.accountGroupCode = res.code
          this.selectParams.monitorLevel = res.level.toString()
          this.selectParams.startDate = res.startDate
          this.selectParams.endDate = res.endDate
          this.selectParams.creator = res.createPerson
          this.selectParams.clewReport = res.extend2
          this.selectParams.accountRemark = res.comment
          this.selectParams.detailDescribe = res.descriprtion
          this.selectParams.monitorSuggest = res.suggestion
          this.clueInfoParams = res.clueId
          this.checkOptionParams.clueReport = res.isClue == '0' ? '2' : '1'
          // 获取线索报告信息
          if (res.isClue) {
            getClueReportInfo(res.clueId).then(resp => {
              let reslut = JSON.parse(resp).crpMain
              this.checkOptionParams.isNeedReport = reslut.needReport
              this.checkOptionParams.clueClass = reslut.clueBranch
              this.checkOptionParams.clueType = reslut.clueTypeText.split(',')
              this.checkOptionParams.clueNum = reslut.extend1
              this.checkOptionParams.clueName = reslut.clueName
              this.checkOptionParams.clueDescribe = reslut.clueDesc
            })
            if (res.clueId) {
              this.isDisabled = true
              //  this.checkOptionParams.clueReport = '1'
            }
          }
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
      getReason(val) {
        this.selectParams.startDate = new Date()
        if (val == '1' || val == '2') {
          this.selectParams.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 30)
        } else if (val == '3') {
          this.selectParams.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7)
        } else {
          this.selectParams.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7)
        }
      },
      // 获取监控编号
      getMonitorNum() {
        if (!this.$route.query.instanceId) {
          getStockNum('mag').then(resp => {
            this.selectParams.monitorNumber = resp
            this.selectParams.creator = this.gfnGetRealName()
          })
        }
        getInfoIdData().then(resp => {
          this.infoId = resp
        })
      },
      // 获取账户组
      getUserGroup() {
        let username = this.gfnGetUsername()
        getUserRoles(username).then((resp) => {
          this.creatorGroup = resp[0].rolename
        })
      },
      selectedRow(row) {
        this.accountEditIndex = []
        row.forEach((el) => {
          this.accountEditIndex.push(el.accountId)
        })
      },
      stockSelectedRow(row) {
        this.stockEditIndex = []
        row.forEach((el) => {
          this.stockEditIndex.push(el.securityId)
        })
      },
      // 账户明细行删除
      deleteAccountDetail() {
        this.dialogForm = true
        this.deleteFlag = true
      },
      // 监控证券行删除
      deleteMonitorStock() {
        this.dialogForm = true
        this.deleteFlag = false
      },
      yesRecall() {
        if (this.deleteFlag) {
          this.accountEditIndex.forEach((el) => {
            this.accountDetailData.forEach((res, index) => {
              if (el === res.accountId) {
                this.accountDetailData.splice(index, 1)
                this.dialogForm = false
              }
            })
          })
        } else {
          this.stockEditIndex.forEach((el) => {
            this.monitorSecurityData.forEach((res, index) => {
              if (el === res.securityId) {
                this.monitorSecurityData.splice(index, 1)
                this.dialogForm = false
              }
            })
          })
        }
      },
      NoRecall() {
        this.dialogForm = false
      },
      getClueReport(val) {
        if (val == '1') {
          getInfoIdData().then(resp => {
            this.clueInfoId = resp
          })
          getStockNum('crp').then(resp => {
            this.clueId = resp
            this.checkOptionParams.clueNum = resp
          })
        } else {
          this.clueId = ''
          this.checkOptionParams.clueNum = ''
        }
      },
      submit() {
        let magAccountdetail = []
        let magSecurityDetail = []
        this.accountDetailData.forEach((el) => {
          delete el.readonly
          if (el.accountId) {
            magAccountdetail.push(el)
          }
        })
        this.monitorSecurityData.forEach((el) => {
          delete el.readonly
          if (el.securityId) {
            magSecurityDetail.push(el)
          }
        })
        if (!this.selectParams.clewReport) {
          if (this.checkOptionParams.clueReport == '1') {
            let processStatus = ''
            if (this.creatorGroup.indexOf('实时') != '-1') {
              processStatus = '0'
            } else {
              if (this.creatorGroup.indexOf('组员') != '-1') {
                processStatus = '3'
              } else {
                processStatus = '2'
              }
            }
            let clueType = []
            this.checkOptionParams.clueType.forEach((el) => {
              if (el == '内幕交易') {
                clueType.push('0')
              } else if (el == '市场操纵') {
                clueType.push('1')
              } else if (el == '利益输送-股票') {
                clueType.push('2')
              } else if (el == '利益输送-债券') {
                clueType.push('3')
              } else if (el == '超比例持股') {
                clueType.push('4')
              } else if (el == '老鼠仓') {
                clueType.push('5')
              } else if (el == '短线交易') {
                clueType.push('6')
              } else if (el == '其它-股票') {
                clueType.push('7')
              } else {
                clueType.push('8')
              }
            })
            let params = {
              'crpMain': {
                'infoId': this.clueInfoId, // 需要请求获取新的infoId的url,获取到新的infoId放进来,这个都懂得
                'extend1': this.clueId, // 需要请求新的线索编号接口,放进来,url是/v1/no/next?processName=crp
                'security': '', // 涉及证券
                'clueName': this.checkOptionParams.clueName, // 线索名称
                'clueDesc': this.checkOptionParams.clueDescribe, // 线索描述
                'needReport': this.checkOptionParams.isNeedReport, // 是否上报
                'clueBranch': this.checkOptionParams.clueClass, // 线索分类
                'clueType': clueType.join(','), // 线索类型
                'clueTypeText': this.checkOptionParams.clueType.join(','), // 线索类型文字
                'sourceType': '4', // 来源分类 重点监控账户:4 重点监控证券:5
                'sourceTypeText': '重点监控账户', // 来源分类文字
                'source': this.selectParams.monitorNumber, // 线索来源
                'createFrom': 'ngsp_mag_flow', // 创建自哪个流程?ngsp_msc_flow|ngsp_mag_flow|ngsp_dig_flow|ngsp_uns_check_flow
                'fromInfoId': !this.$route.query.instanceId ? this.infoId : this.MagMainInfoId, // 当前流程的infoId
                'fromTitle': this.selectParams.monitorNumber, // 你的流程标题或者流程编号,用以前端展示,可以让用户得知你的流程大致信息
                'processStatus': processStatus, // 根据当前登录用户来判断需要保存状态多少?例如实时组组员就传0,历史组组长传2,历史组组员传3
                'comment': '' // 意见
              },
              'accountinfo': [],
              'accountGroup': [],
              'monitorSecurity': [],
              'instanceId': '',
              'operate': 'new'
            }
            this.$refs['checkOptionParams'].validate((valid) => {
              if (valid) {
                relevanceClueReport(JSON.stringify(params)).then(resp => {
                })
              } else {
                this.$message.warning('请填写完整线索报告信息')
                // return false
              }
            })
          }
        }
        let params = {
          'MagMain': {
            'infoId': !this.$route.query.instanceId ? this.infoId : this.MagMainInfoId,
            'processStatus': '0',   // 流程状态
            'monitorNo': this.selectParams.monitorNumber,  // 监控编号
            'name': this.selectParams.accountGroupName,  // 账户组名称
            'code': this.selectParams.accountGroupCode, // 账户组代码
            'reason': this.selectParams.monitorReason,  // 监控原因
            'level': this.selectParams.monitorLevel,  // 监控级别(0涉嫌跨期操纵、1涉嫌短线操纵、2异动股、3其他)
            'descriprtion': this.selectParams.detailDescribe,  // 详情描述
            'comment': this.selectParams.accountRemark,  //  账户备注
            'suggestion': this.selectParams.monitorSuggest,  //  监控建议
            'isClue': this.checkOptionParams.clueReport == '1' ? '1' : '0',  // 是否关联线索报告流程
            'clueId': this.checkOptionParams.clueReport == '1' ? !Number(this.clueInfoParams) ? this.clueInfoId : this.clueInfoParams : '',  // 线索编号
            'createPerson': this.selectParams.creator,  // 创建人
            'extend1': this.auditoption,   // 您的意见
            'extend2': !this.selectParams.clewReport ? this.clueId : this.selectParams.clewReport,
            'extend3': '',
            'startDate': moment(this.selectParams.startDate).format('YYYY-MM-DD'),  // 监控开始时间
            'endDate': moment(this.selectParams.endDate).format('YYYY-MM-DD')  // 监控结束时间
          },
          'MagAccountdetail': magAccountdetail,
          'MagSecurityDetail': magSecurityDetail,
          'taskId': !this.$route.query.taskId ? '0' : this.$route.query.taskId,
          'toWhom': '',
          'operate': !this.$route.query.instanceId ? 'new' : '',
          'group': this.creatorGroup
        }
        this.$refs['selectParams'].validate((valid) => {
          if (valid) {
            if (this.checkOptionParams.clueReport == '1') {
              this.$refs['checkOptionParams'].validate((valid) => {
                if (valid) {
                  postFocusAccountGroupStart(JSON.stringify(params)).then(resp => {
                    this.$message.success('流程下一处理人：' + resp.assignee)
                    setTimeout(() => {
                      this.goBack()
                    }, 1000)
                  })
                } else {
                  this.$message.warning('请填写完整线索报告信息')
                  // return false
                }
              })
            } else {
              postFocusAccountGroupStart(JSON.stringify(params)).then(resp => {
                this.$message.success('流程下一处理人：' + resp.assignee)
                setTimeout(() => {
                  this.goBack()
                }, 1000)
              })
            }
          } else {
            this.$message.warning('请填写完整监控账户组信息')
            // return false
          }
        })
      },
      save() {
        let magAccountdetail = []
        let magSecurityDetail = []
        this.accountDetailData.forEach((el) => {
          delete el.readonly
          if (el.accountId) {
            magAccountdetail.push(el)
          }
        })
        this.monitorSecurityData.forEach((el) => {
          delete el.readonly
          if (el.securityId) {
            magSecurityDetail.push(el)
          }
        })
        if (!this.selectParams.clewReport) {
          if (this.checkOptionParams.clueReport == '1') {
            let processStatus = ''
            if (this.creatorGroup.indexOf('实时') != '-1') {
              processStatus = '0'
            } else {
              if (this.creatorGroup.indexOf('组员') != '-1') {
                processStatus = '3'
              } else {
                processStatus = '2'
              }
            }
            let clueType = []
            this.checkOptionParams.clueType.forEach((el) => {
              if (el == '内幕交易') {
                clueType.push('0')
              } else if (el == '市场操纵') {
                clueType.push('1')
              } else if (el == '利益输送-股票') {
                clueType.push('2')
              } else if (el == '利益输送-债券') {
                clueType.push('3')
              } else if (el == '超比例持股') {
                clueType.push('4')
              } else if (el == '老鼠仓') {
                clueType.push('5')
              } else if (el == '短线交易') {
                clueType.push('6')
              } else if (el == '其它-股票') {
                clueType.push('7')
              } else {
                clueType.push('8')
              }
            })
            let params = {
              'crpMain': {
                'infoId': this.clueInfoId, // 需要请求获取新的infoId的url,获取到新的infoId放进来,这个都懂得
                'extend1': this.clueId, // 需要请求新的线索编号接口,放进来,url是/v1/no/next?processName=crp
                'security': '', // 涉及证券
                'clueName': this.checkOptionParams.clueName, // 线索名称
                'clueDesc': this.checkOptionParams.clueDescribe, // 线索描述
                'needReport': this.checkOptionParams.isNeedReport, // 是否上报
                'clueBranch': this.checkOptionParams.clueClass, // 线索分类
                'clueType': clueType.join(','), // 线索类型
                'clueTypeText': this.checkOptionParams.clueType.join(','), // 线索类型文字
                'sourceType': '4', // 来源分类 重点监控账户:4 重点监控证券:5
                'sourceTypeText': '重点监控账户', // 来源分类文字
                'source': this.selectParams.monitorNumber, // 线索来源
                'createFrom': 'ngsp_mag_flow', // 创建自哪个流程?ngsp_msc_flow|ngsp_mag_flow|ngsp_dig_flow|ngsp_uns_check_flow
                'fromInfoId': !this.$route.query.instanceId ? this.infoId : this.MagMainInfoId, // 当前流程的infoId
                'fromTitle': this.selectParams.monitorNumber, // 你的流程标题或者流程编号,用以前端展示,可以让用户得知你的流程大致信息
                'processStatus': processStatus, // 根据当前登录用户来判断需要保存状态多少?例如实时组组员就传0,历史组组长传2,历史组组员传3
                'comment': '' // 意见
              },
              'accountinfo': [],
              'accountGroup': [],
              'monitorSecurity': [],
              'instanceId': '',
              'operate': 'new'
            }
            this.$refs['checkOptionParams'].validate((valid) => {
              if (valid) {
                relevanceClueReport(JSON.stringify(params)).then(resp => {
                })
              } else {
                this.$message.warning('请填写完整线索报告信息')
                // return false
              }
            })
          }
        }
        let params = {
          'MagMain': {
            'infoId': !this.$route.query.instanceId ? this.infoId : this.MagMainInfoId,
            'processStatus': '0',   // 流程状态
            'monitorNo': this.selectParams.monitorNumber,  // 监控编号
            'name': this.selectParams.accountGroupName,  // 账户组名称
            'code': this.selectParams.accountGroupCode, // 账户组代码
            'reason': this.selectParams.monitorReason,  // 监控原因
            'level': this.selectParams.monitorLevel,  // 监控级别(0涉嫌跨期操纵、1涉嫌短线操纵、2异动股、3其他)
            'descriprtion': this.selectParams.detailDescribe,  // 详情描述
            'comment': this.selectParams.accountRemark,  //  账户备注
            'suggestion': this.selectParams.monitorSuggest,  //  监控建议
            'isClue': this.checkOptionParams.clueReport == '1' ? '1' : '0',  // 是否关联线索报告流程
            'clueId': this.checkOptionParams.clueReport == '1' ? !Number(this.clueInfoParams) ? this.clueInfoId : this.clueInfoParams : '',  // 线索编号
            'createPerson': this.selectParams.creator,  // 创建人
            'extend1': this.auditoption,   // 您的意见
            'extend2': !this.selectParams.clewReport ? this.clueId : this.selectParams.clewReport,
            'extend3': '',
            'startDate': moment(this.selectParams.startDate).format('YYYY-MM-DD'),  // 监控开始时间
            'endDate': moment(this.selectParams.endDate).format('YYYY-MM-DD')  // 监控结束时间
          },
          'MagAccountdetail': magAccountdetail,
          'MagSecurityDetail': magSecurityDetail,
          'taskId': '0',
          'toWhom': '',
          'operate': !this.$route.query.instanceId ? 'new' : '',
          'group': this.creatorGroup
        }
        this.$refs['selectParams'].validate((valid) => {
          if (valid) {
            if (!this.selectParams.clewReport) {
              this.$refs['checkOptionParams'].validate((valid) => {
                if (valid) {
                  postFocusAccountGroupSave(JSON.stringify(params)).then(resp => {
                    this.$message.success('保存成功！')
                  })
                } else {
                  this.$message.warning('请填写完整线索报告信息')
                  // return false
                }
              })
            } else {
              postFocusAccountGroupSave(JSON.stringify(params)).then(resp => {
                this.$message.success('保存成功！')
              })
            }
          } else {
            this.$message.warning('请填写完整监控账户组信息')
            // return false
          }
        })
      },
      // 跳线索上报流程
      jumpClueReport() {
        window.open(`#/clueReportForm?operate=1&instanceId=${this.clueInfoParams}&isNewTab=true`)
        // this.$router.push({name: 'clueReportForm', query: {operate: '1', taskId: '', instanceId: this.clueInfoParams}})
      },
      addRow() {
        this.accountDetailData.push({
          accountId: '',
          accountName: '',
          memberName: '',
          ymtAccountId: '',
          relateTerminal: '',
          relateTrade: '',
          relateOpenAccount: '',
          relateOther: '',
          relateLevel: '',
          readonly: false
        })
      },
      editRow() {
        this.accountEditIndex.forEach((el) => {
          this.accountDetailData.forEach((res, index) => {
            if (el === res.accountId) {
              this.accountDetailData[index]['readonly'] = false
            }
          })
        })
      },
      stockAddRow() {
        this.monitorSecurityData.push({
          securityId: '',
          securityName: '',
          startDate: '',
          endDate: '',
          readonly: false
        })
      },
      stockEditRow() {
        this.stockEditIndex.forEach((el) => {
          this.monitorSecurityData.forEach((res, index) => {
            if (el === res.securityId) {
              this.monitorSecurityData[index]['readonly'] = false
            }
          })
        })
      },
      // 批量导入
      getTxtData(val) {
        let accountCode = Array.from(new Set(val))
        this.accountDetailData.forEach((res) => {
          accountCode.forEach((el, index) => {
            if (res.accountId == el) {
              accountCode.splice(index, 1)
              this.$message.warning('批量导入重复，已自动去重')
            }
          })
        })
        accountCode.forEach((el) => {
          getAccountInfo(el).then(resp => {
            let result = resp.bizData.metaData[0]
            this.accountDetailData.push({
              accountId: el,
              accountName: result.accountPeople,
              memberName: result.member,
              ymtAccountId: result.oneword,
              relateTerminal: '',
              relateTrade: '',
              relateOpenAccount: '',
              relateOther: '',
              relateLevel: '',
              readonly: false
            })
          })
        })
      }
    }
  }
</script>

<style lang='less'>
  .newBuiltAccountGroup {
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
