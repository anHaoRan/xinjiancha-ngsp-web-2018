<template>
  <div class='changeBuiltAccountGroup'>
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
                <el-select v-model='selectParams.monitorLevel' placeholder='请选择' size='small' @change='getLevelChange'>
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
                  @change='endDateChange'
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
      <div class='btnWrap'>
        <el-input size="small" style="width: 280px;margin-right: 10px" placeholder="回车或按下新增按钮进行添加账户信息" v-model="addAccountCodeText" @keyup.enter.native="handleSearchAccount"></el-input>
        <el-button type='text' size='middle' @click='handleSearchAccount'>新增</el-button>
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
        历史变更记录
      </div>
      <el-form :inline='true' :model='historyParams' ref='selectParams'>
        <el-form-item label='变更原因：' class='describe'>
          <el-input v-model='historyParams.changeReason' type='textarea' :maxlength=200
                    placeholder='最多输入200个字符'></el-input>
        </el-form-item>
        <el-form-item label='变更内容：' class='describe'>
          <el-input
            readonly
            :rows="5"
            v-model='historyChangeContent'
            type='textarea' class='changeInfo'></el-input>
        </el-form-item>
      </el-form>
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
    <div style='text-align: right;padding: 15px'>
      <el-button type='primary' size='middle' @click='submit'>提交</el-button>
      <el-button type='info' size='middle' @click='goBack'>返回</el-button>
    </div>
  </div>

</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import InputContent from './inputContent'
  import SelectCode from './selectCode'
  import TextUpload from '../../common/textUpload'
  import SelectDateContent from './selectDateContent.vue'
  import moment from 'moment'
  import MinxinVue from '../MixIn'
  import {
    getHistorySuggest,
    getFormInfo,
    postFocusMonitorApproval,
    postFocusAccountGroupSave,
    changeAccountGroupStock,
    getInfoIdData,
    getAccountInfo
  } from '../../../service/superviseTask/focusAccountGroup/index'

  export default {
    name: 'focus-monitor-security',
    components: {
      Breadcrumb,
      StockCodeQuery,
      TextUpload,
      STableColumns: () => import('@/components/base/STableColumns')   // 表格列
    },
    mixins: [MinxinVue],
    data () {
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
        addAccountCodeText: '',
        submitData: {disabled: false},
        uploadOption: {name: '批量导入', size: 'mini', type: 'text'}, // 上传按钮参数
        activeName: !this.$route.query.instanceId ? 2 : 4,
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
          {label: '账户号', field: 'accountId', align: 'center', width: '6%'},
          {label: '账户名称', field: 'accountName', align: 'center', width: '6%'},
          {label: '会员名称', field: 'memberName', align: 'center', width: '6%'},
          {label: '一码通', field: 'ymtAccountId', align: 'center', width: '6%'},
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
          {label: '变更原因', field: 'altReason', align: 'center', minWidth: '6%'},
          {label: '变更内容', field: 'altDetail', align: 'left', minWidth: '15%'},
          {label: '处理人', field: 'altPerson', align: 'center', minWidth: '4%'},
          {label: '审核人', field: 'exmPerson', align: 'center', minWidth: '4%'}
        ],
        CurrentPage: 1,
        PageTotal: 0,
        check: true,
        accountEditIndex: [],
        stockEditIndex: [],
        MagMainParams: {},
        MagMainInfoId: '',
        historyParams: {
          changeReason: '',
          reasonTxt: '',
          levelTxt: '',
          beginDateTxt: '',
          endDateTxt: ''
        },
        historyChangeContent: '',
        oldDate: [],  // 变更前的日期
        oldReason: '',  // 变更前的原因
        oldLevel: '',  // 变更前的级别
        dialogForm: false,
        deleteFlag: '',
        oldSecurityData: [],  // 涉及证券变更前数据
        oldDetailData: [],  // 涉及账户组变更前数据
        securityTxt: '', // 涉及证券变更内容
        detailTxt: '', // 涉及账户组变更内容
        infoId: '',
        clueInfoParams: '', // 请求线索报告信息参数
        addTxt: '',  // 账户明细增加
        deleteTxt: '',  // 账户明细删除
        changeTxt: '',  // 账户明细变更
        addStockTet: '',  // 涉及证券增加
        deleteStockTxt: '',  // 涉及证券删除
        changeStockTxt: ''  // 涉及证券变更
      }
    },
    created () {
      this.getHistorySuggestion()
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
    mounted () {
      this.getFormInfo()
      this.getInfoNum()
    },
    methods: {
      getAccountInfoByCodes(codes) {
        getAccountInfo(codes.join(',')).then(resp => {
          let result = resp.bizData.metaData[0]
          result.accountId = result.accountCode
          result.accountName = result.accountPeople
          result.memberName = result.member
          result.ymtAccountId = result.oneword
          this.accountDetailData.unshift(result)
        })
      },
      handleSearchAccount() { // 根据输入的账户代码进行添加相关账户信息
        if (!this.addAccountCodeText) {
          this.$message.error('请输入账户号！')
          return
        }
        let reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(this.addAccountCodeText)) {
          this.$message.error('只能输入数字和字母！')
          return
        }
        let isHas = this.accountDetailData.filter(v => {
          return v.accountId === this.addAccountCodeText
        }).length
        if (isHas) {
          this.$message.error('输入的账户号已存在！')
        } else {
          this.getAccountInfoByCodes([this.addAccountCodeText])
        }
      },
      // 获取infoid
      getInfoNum () {
        getInfoIdData().then(resp => {
          this.infoId = resp
        })
      },
      // 获取表单信息
      getFormInfo () {
        getFormInfo(this.$route.query.instanceId).then(resp => {
          resp.MagSecuritydetail.forEach((el) => {
            el.readonly = true
          })
          resp.MagAccountdetail.forEach((el) => {
            el.readonly = true
          })
          this.monitorSecurityData = resp.MagSecuritydetail
          this.monitorSecurityData.forEach((el) => {
            this.oldSecurityData.push({
              securityId: el.securityId,
              securityName: el.securityName,
              startDate: el.startDate ? moment(el.startDate).format('YYYY-MM-DD') : '',
              endDate: el.endDate ? moment(el.endDate).format('YYYY-MM-DD') : ''
            })
          })
          this.accountDetailData = resp.MagAccountdetail
          this.accountDetailData.forEach((el) => {
            this.oldDetailData.push({
              accountId: el.accountId,
              relateTerminal: el.relateTerminal,
              relateTrade: el.relateTrade,
              relateOpenAccount: el.relateOpenAccount,
              relateOther: el.relateOther,
              relateLevel: el.relateLevel
            })
          })
          this.historyChangeData = resp.MagAlthistory
          let res = resp.MagMain
          this.MagMainParams = resp.MagMain
          this.MagMainInfoId = resp.infoId
          this.selectParams.monitorNumber = res.monitorNo.toString()
          this.selectParams.monitorReason = res.reason.toString()
          this.oldReason = res.reason.toString()
          this.selectParams.accountGroupName = res.name
          this.selectParams.accountGroupCode = res.code
          this.selectParams.monitorLevel = res.level.toString()
          this.oldLevel = res.level
          this.selectParams.startDate = res.startDate
          this.selectParams.endDate = res.endDate
          this.oldDate = [res.startDate, res.endDate]
          this.selectParams.creator = res.createPerson
          this.selectParams.clewReport = res.extend2
          this.selectParams.accountRemark = res.comment
          this.selectParams.detailDescribe = res.descriprtion
          this.clueInfoParams = res.clueId
          this.selectParams.monitorSuggest = res.suggestion
        })
      },
      // 获取历史审核意见
      getHistorySuggestion () {
        getHistorySuggest(this.$route.query.instanceId).then(resp => {
          let res = resp.value
          res.forEach((el, index) => {
            el.createTime = moment(el.createTime).format('YYYY/MM/DD HH:mm:ss')
            this.processinfo[el.proceStatus] = el.procePerson + ' ' + el.createTime
          })
          this.checkSuggestionData = res
        })
      },
      // 开始时间变更
      getStartDate (val) {
        this.historyParams.beginDateTxt = ''
        if (this.oldDate[0] != val) {
          this.historyParams.beginDateTxt = '开始日期：' + (this.oldDate[0] || '') + ' 改为 ' + (val || '空') + '\n'
        }
        let altDetail = this.historyParams.beginDateTxt + this.historyParams.endDateTxt + this.historyParams.reasonTxt + this.historyParams.levelTxt + this.detailTxt + this.securityTxt
        this.historyChangeContent = altDetail  || this.historyChangeContent
        //  let reason = this.selectParams.monitorReason
        //  if (!val) {
        //    this.selectParams.endDate = ''
        //  } else {
        //    if (reason == '1' || reason == '2') {
        //      this.selectParams.endDate = new Date(new Date(val).getTime() + 3600 * 1000 * 24 * 30)
        //    } else {
        //      this.selectParams.endDate = new Date(new Date(val).getTime() + 3600 * 1000 * 24 * 7)
        //    }
        //  }
      },
      // 结束时间变更
      endDateChange (val) {
        if(!this.oldDate[1] && !val) {
          return
        }
        this.historyParams.endDateTxt = ''
        if (this.oldDate[1] != val) {
          this.historyParams.endDateTxt = '结束日期：' + (this.oldDate[1] || '') + ' 改为 ' + (val || '空') + '\n'
        }
        let altDetail = this.historyParams.beginDateTxt + this.historyParams.endDateTxt + this.historyParams.reasonTxt + this.historyParams.levelTxt + this.detailTxt + this.securityTxt
        this.historyChangeContent = altDetail  || this.historyChangeContent
      },
      // 监控原因改变
      getReason (val) {
        this.selectParams.startDate = new Date()
        let oldLabel = ''
        let newLabel = ''
        this.historyParams.reasonTxt = ''
        this.monitorReasonOptions.forEach((el, index) => {
          if (this.oldReason == el.value) {
            oldLabel = this.monitorReasonOptions[index].label
          }
          if (val == el.value) {
            newLabel = this.monitorReasonOptions[index].label
          }
        })
        if (val == '1' || val == '2') {
          this.selectParams.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 30)
        } else if (val == '3') {
          this.selectParams.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7)
        } else {
          this.selectParams.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7)
        }
        if (this.oldReason != val) {
          this.historyParams.reasonTxt = '监控原因：' + oldLabel + ' 改为 ' + newLabel + '\n'
          if (this.oldDate[0] != moment(this.selectParams.startDate).format('YYYY-MM-DD')) {
            this.historyParams.beginDateTxt = '开始日期：' + (this.oldDate[0] || '') + ' 改为 ' + (this.selectParams.startDate ? moment(this.selectParams.startDate).format('YYYY-MM-DD') : '空') + '\n'
          } else {
            this.historyParams.beginDateTxt = ''
          }
          if (this.oldDate[1] != moment(this.selectParams.endDate).format('YYYY-MM-DD')) {
            this.historyParams.endDateTxt = '结束日期：' + (this.oldDate[1] || '') + ' 改为 ' + (this.selectParams.endDate ? moment(this.selectParams.endDate).format('YYYY-MM-DD') : '空') + '\n'
          } else {
            this.historyParams.endDateTxt = ''
          }
        }
        let altDetail = this.historyParams.beginDateTxt + this.historyParams.endDateTxt + this.historyParams.reasonTxt + this.historyParams.levelTxt + this.detailTxt + this.securityTxt
        this.historyChangeContent = altDetail  || this.historyChangeContent
      },
      // 监控级别改变
      getLevelChange (val) {
        let oldLabel = ''
        let newLabel = ''
        this.historyParams.levelTxt = ''
        this.monitorLevelOptions.forEach((el, index) => {
          if (this.oldLevel == el.value) {
            oldLabel = this.monitorLevelOptions[index].label
          }
          if (val == el.value) {
            newLabel = this.monitorLevelOptions[index].label
          }
        })
        if (this.oldLevel != val) {
          this.historyParams.levelTxt = '监控级别：' + oldLabel + ' 改为 ' + newLabel + '\n'
        }
        let altDetail = this.historyParams.beginDateTxt + this.historyParams.endDateTxt + this.historyParams.reasonTxt + this.historyParams.levelTxt + this.detailTxt + this.securityTxt
        this.historyChangeContent = altDetail  || this.historyChangeContent
      },
      selectedRow (row) {
        this.accountEditIndex = []
        row.forEach((el) => {
          this.accountEditIndex.push(el.accountId)
        })
      },
      stockSelectedRow (row) {
        this.stockEditIndex = []
        row.forEach((el) => {
          this.stockEditIndex.push(el.securityId)
        })
      },
      // 账户明细行删除
      deleteAccountDetail () {
        this.dialogForm = true
        this.deleteFlag = true
      },
      // 监控证券行删除
      deleteMonitorStock () {
        this.dialogForm = true
        this.deleteFlag = false
      },
      yesRecall () {
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
      NoRecall () {
        this.dialogForm = false
      },
      addRow () {
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
      editRow () {
        this.accountEditIndex.forEach((el) => {
          this.accountDetailData.forEach((res, index) => {
            if (el === res.accountId) {
              this.accountDetailData[index]['readonly'] = false
            }
          })
        })
      },
      stockAddRow () {
        this.monitorSecurityData.push({
          securityId: '',
          securityName: '',
          startDate: new Date(),
          endDate: new Date(),
          readonly: false
        })
      },
      stockEditRow () {
        this.stockEditIndex.forEach((el) => {
          this.monitorSecurityData.forEach((res, index) => {
            if (el === res.securityId) {
              this.monitorSecurityData[index]['readonly'] = false
            }
          })
        })
      },
      recordChangeContent () {
        let oldArr = []
        let newArr = []
        this.deleteTxt = ''
        this.addTxt = ''
        this.oldDetailData.forEach((el) => {
          oldArr.push(el.accountId)
        })
        // 账户明细增加记录
        this.accountDetailData.forEach((el, index) => {
          if (oldArr.indexOf(el.accountId) < 0) {
            this.addTxt += el.accountId + '；'
          }
          newArr.push(el.accountId)
        })
        let oldStr = oldArr.sort()
        let newStr = newArr.sort()
        if (oldStr.join(',') != newStr.join(',')) {
          this.detailTxt = '账户明细 \n'
        }
        if (this.addTxt) {
          this.detailTxt += '增加了：' + this.addTxt
        }
        // 账户明细删除记录
        oldArr.forEach((el) => {
          if (newArr.indexOf(el) < 0) {
            this.deleteTxt += el + '；'
          }
        })
        if (this.deleteTxt) {
          this.detailTxt += '删除了：' + this.deleteTxt
        }
        // 账户明细变更记录
        this.oldDetailData.forEach((el, index) => {
          this.accountDetailData.forEach((res, num) => {
            if (el.accountId == res.accountId) {
              if (!this.accountDetailData[num].readonly) {
                this.detailTxt += el.accountId + '：'
              }
              if (this.oldDetailData[index].relateTerminal != this.accountDetailData[num].relateTerminal) {
                this.detailTxt += ' 终端关联：' + this.oldDetailData[index].relateTerminal + ' 改成了 ' + this.accountDetailData[num].relateTerminal + '；'
              }
              if (this.oldDetailData[index].relateTrade != this.accountDetailData[num].relateTrade) {
                this.detailTxt += ' 交易关联：' + this.oldDetailData[index].relateTrade + ' 改成了 ' + this.accountDetailData[num].relateTrade + '；'
              }
              if (this.oldDetailData[index].relateOpenAccount != this.accountDetailData[num].relateOpenAccount) {
                this.detailTxt += ' 开户关联：' + this.oldDetailData[index].relateOpenAccount + ' 改成了 ' + this.accountDetailData[num].relateOpenAccount + '；'
              }
              if (this.oldDetailData[index].relateOther != this.accountDetailData[num].relateOther) {
                this.detailTxt += ' 其它关联：' + this.oldDetailData[index].relateOther + ' 改成了 ' + this.accountDetailData[num].relateOther + '；'
              }
              if (this.oldDetailData[index].relateLevel != this.accountDetailData[num].relateLevel) {
                this.detailTxt += ' 关联级别：' + this.oldDetailData[index].relateLevel + ' 改成了 ' + this.accountDetailData[num].relateLevel + '；'
              }
            }
          })
        })

        // 涉及证券增加记录
        let oldStockArr = []
        let newStockArr = []
        this.addStockTet = ''
        this.deleteStockTxt = ''
        this.oldSecurityData.forEach((el) => {
          oldStockArr.push(el.securityId)
        })
        this.monitorSecurityData.forEach((el, index) => {
          if (oldStockArr.indexOf(el.securityId) < 0) {
            this.addStockTet += el.securityId + '；'
          }
          newStockArr.push(el.securityId)
        })
        let oldStockStr = oldStockArr.sort()
        let newStockStr = newStockArr.sort()
        if (oldStockStr.join(',') != newStockStr.join(',')) {
          this.securityTxt = '\n涉及监控证券 \n'
        }
        if (this.addStockTet) {
          this.securityTxt += '增加了：' + this.addStockTet
        }
        // 涉及删除增加记录
        oldStockArr.forEach((el) => {
          if (newStockArr.indexOf(el) < 0) {
            this.deleteStockTxt += el + '；'
          }
        })
        if (this.deleteStockTxt) {
          this.securityTxt += '删除了：' + this.deleteStockTxt
        }
        // 涉及变更增加记录
        this.oldSecurityData.forEach((el, index) => {
          this.monitorSecurityData.forEach((res, num) => {
            if (el.securityId == res.securityId) {
              if (!this.monitorSecurityData[num].readonly) {
                this.securityTxt += el.securityId + '：'
              }
              if (this.oldSecurityData[index].startDate != moment(this.monitorSecurityData[num].startDate).format('YYYY-MM-DD')) {
                if (!this.oldSecurityData[index].startDate && !this.monitorSecurityData[num].startDate) {
                  return
                }
                this.securityTxt += '开始时间：' + (this.oldSecurityData[index].startDate || '') + ' 改成了 ' + this.monitorSecurityData[num].startDate + '；'
              }
              console.log(this.oldSecurityData[index].endDate)
              console.log(this.monitorSecurityData[num].endDate)
              if (this.oldSecurityData[index].endDate != moment(this.monitorSecurityData[num].endDate).format('YYYY-MM-DD')) {
                if (!this.oldSecurityData[index].endDate && !this.monitorSecurityData[num].endDate) {
                  return
                }
                this.securityTxt += '结束时间：' + (this.oldSecurityData[index].endDate || '') + ' 改成了 ' + this.monitorSecurityData[num].endDate + '；'
              }
            }
          })
        })
        let altDetail = this.historyParams.beginDateTxt + this.historyParams.endDateTxt + this.historyParams.reasonTxt + this.historyParams.levelTxt + this.detailTxt + this.securityTxt
        this.historyChangeContent = altDetail  || this.historyChangeContent
      },
      submit () {
        this.recordChangeContent()
        let isApprove = ''
        if (this.oldReason != this.selectParams.monitorReason || this.oldLevel != this.selectParams.monitorLevel || this.oldDate[0] != this.MagMainParams.startDate || this.oldDate[1] != this.MagMainParams.endDate) {
          isApprove = '1'
          this.MagMainParams.infoId = this.infoId
        } else {
          isApprove = '0'
          this.MagMainParams.infoId = this.MagMainInfoId
        }
        // if (isApprove = '1') {
        //   this.MagMainParams.infoId = this.infoId
        // } else {
        //   this.MagMainParams.infoId = this.MagMainInfoId
        // }
        this.MagMainParams.level = this.selectParams.monitorLevel
        this.MagMainParams.reason = this.selectParams.monitorReason
        this.MagMainParams.startDate = this.selectParams.startDate ? moment(this.selectParams.startDate).format('YYYY-MM-DD') : ''
        this.MagMainParams.endDate = this.selectParams.endDate ? moment(this.selectParams.endDate).format('YYYY-MM-DD') : ''
        let magAccountdetail = []
        let magSecurityDetail = []
        this.accountDetailData.forEach((el) => {
          delete el.readonly
          magAccountdetail.push(el)
        })
        this.monitorSecurityData.forEach((el) => {
          delete el.readonly
          magSecurityDetail.push(el)
        })
        let params = {
          'MagMain': this.MagMainParams,
          'MagAccountdetail': magAccountdetail,
          'MagSecurityDetail': magSecurityDetail,
          'taskId': this.$route.query.taskId,
          'toWhom': '',
          'isApprove': isApprove,  // 当变更监控原因、监控级别、监控原因时，为 1 ，变更账户信息、证券信息，为 0
          'altDetail':  this.historyChangeContent,
          'altReason': this.historyParams.changeReason
        }
        changeAccountGroupStock(JSON.stringify(params)).then(resp => {
          this.$message.success(resp.message)
          this.goBack()
        })
      },
      // 跳线索上报流程
      jumpClueReport () {
        window.open(`#/clueReportForm?operate=1&instanceId=${this.clueInfoParams}&isNewTab=true`)
        // this.$router.push({name: 'clueReportForm', query: {operate: '1', taskId: '', instanceId: this.clueInfoParams}})
      },
      // 批量导入
      getTxtData (val) {
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
  .changeBuiltAccountGroup {
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
        /*height: 63px;*/
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
    /*.changeInfo {
      .el-textarea__inner {
        min-height: 250px !important;
      }
    }*/
  }
</style>
