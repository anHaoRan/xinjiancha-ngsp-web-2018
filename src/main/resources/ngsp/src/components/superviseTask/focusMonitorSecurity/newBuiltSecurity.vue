<template>
  <div class='newBuiltSecurity'>
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
          监控证券信息
        </div>
        <el-form :inline='true' :model='selectParams' ref='selectParams' :rules='rules'>
          <el-row :gutter='20'>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='监控编号：'>
                <el-input size='small' v-model='selectParams.monitorNumber' :disabled='true'></el-input>
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
              <el-form-item label='证券代码及简称：' required prop='stockCode'>
                <stock-code-query :commonData='submitData' :clearable='false'
                                  @getStockCode='getStockCode'></stock-code-query>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='创建者：'>
                <el-input size='small' v-model='selectParams.creator' :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl='6' :lg='8' :md='12' :sm='24'>
              <el-form-item label='线索单号：'>
                <el-button type='text' size='middle' style='border: none' @click='jumpClueReport'
                           :disabled='!clueInfoParams?true:false'>{{selectParams.clewReport}}
                </el-button>
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
            <el-col :xl='24'>
              <el-form-item label='重点监控描述：' class='describe'>
                <el-input v-model='selectParams.monitorDescribe' type='textarea' :maxlength=200
                          placeholder='最多输入200个字符'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <div>
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
    </div>
    <el-card class='el-card-table'>
      <div slot='header'>
        涉及监控账户组
      </div>
      <el-table
        :data='monitorGroupsData'
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
          v-for='column in monitorGroupsColumns'
          :key='column.field'
          :align='column.align'
          :prop='column.field'
          :label='column.label'
          :min-width='column.minWidth'>
        </el-table-column>
      </el-table>
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
      <el-button type='primary' size='middle' @click='submit("selectParams")'>提交</el-button>
      <el-button type='primary' size='middle' @click='save("selectParams")'>保存</el-button>
      <el-button type='info' size='middle' @click='goBack'>返回</el-button>
    </div>
  </div>

</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery';
  import {
    getStockNum,
    getInfoIdData,
    postFocusMonitorStart,
    postFocusMonitorSave,
    getUserRoles,
    getFormInfo,
    getStockGroupInfo,
    relevanceClueReport,
    getClueReportInfo
  } from '../../../service/superviseTask/focusMonitor/index'
  import moment from 'moment'
  import MixIn from '../MixIn'
  import MixinAuthority from '../MixinAuthority'

  export default {
    name: 'focus-monitor-security',
    components: {
      Breadcrumb,
      StockCodeQuery
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
            router: '/focusMonitorSecurity',
            label: '重点监控证券'
          },
          {
            router: '',
            label: '重点监控证券表单'
          }
        ],
        submitData: {disabled: false, stockCode: ''},
        activeName: 0,
        processinfo0: '',
        processinfo3: '',
        processinfo5: '',
        processinfo7: '',
        selectParams: {
          monitorNumber: '',
          monitorReason: '',
          monitorLevel: '',
          startDate: new Date(),
          endDate: '',
          clewReport: '',
          creator: '',
          stockCode: '',
          stockName: '',
          monitorDescribe: ''
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
        monitorGroupsData: [],  //  账户组表格
        monitorGroupsColumns: [
          {label: '监控账户组编号', field: 'monitorNo', align: 'center', minWidth: '6%'},
          {label: '监控原因', field: 'reason', align: 'center', minWidth: '6%'},
          {label: '监控级别', field: 'level', align: 'center', minWidth: '6%'},
          {label: '创建者', field: 'createPerson', align: 'center', minWidth: '6%'},
          {label: '涉及股票', field: 'relatedSecIds', align: 'center', minWidth: '6%'},
          {label: '监控开始时间', field: 'startDate', align: 'center', minWidth: '6%'},
          {label: '监控结束时间', field: 'endDate', align: 'center', minWidth: '6%'}
        ],
        CurrentPage: 1,
        PageTotal: 0,
        infoId: '',
        creatorGroup: '',
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
        MscMainInfoId: '',
        isDisabled: false,
        clueId: '',  //  线索编号
        clueInfoId: '',  //  线索报告infoId
        clueInfoParams: '',  //  请求线索报告信息参数
        auditoption: '' // 意见
      }
    },
    created() {
      if (this.$route.query.params) {
        let params = JSON.parse(this.$route.query.params)
        if (params.monitorReason === '涉嫌跨期操纵') {
          this.selectParams.monitorReason = '1'
        } else if (params.monitorReason === '涉嫌短线操纵') {
          this.selectParams.monitorReason = '2'
        } else if (params.monitorReason === '异动股') {
          this.selectParams.monitorReason = '3'
        } else {
          this.selectParams.monitorReason = '4'
        }
        this.selectParams.stockCode = params.stockCode
        this.selectParams.stockName = params.stockCodeName
        this.submitData.stockCode = params.stockCode + ' ' + params.stockCodeName
      }
    },
    mounted() {
      this.getMonitorNum()
      this.getUserGroup()
      if (this.$route.query.instanceId) {
        this.getFormInfo()
      }
    },
    methods: {
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
      //  获取监控编号
      getMonitorNum() {
        if (!this.$route.query.instanceId) {
          getStockNum('msc').then(resp => {
            this.selectParams.monitorNumber = resp
            this.selectParams.creator = this.gfnGetRealName()
          })
        }
        getInfoIdData().then(resp => {
          this.infoId = resp
        })
      },
      getClueReport(val) {
        if (val == '1') {
          getInfoIdData().then(resp => {
            this.clueInfoId = resp
          })
          getStockNum('crp').then(resp => {
            this.clueId = resp
            //  this.selectParams.clewReport = resp
            this.checkOptionParams.clueNum = resp
          })
        } else {
          this.clueId = ''
          this.checkOptionParams.clueNum = ''
        }
      },
      //  跳线索上报流程
      jumpClueReport() {
        window.open(`#/clueReportForm?operate=1&instanceId=${this.clueInfoParams}&isNewTab=true`)
        // this.$router.push({name: 'clueReportForm', query: {operate: '1', taskId: '', instanceId: this.clueInfoParams}});
      },
      //  获取表单信息
      getFormInfo() {
        getFormInfo(this.$route.query.instanceId).then(resp => {
          let res = resp.MscMain
          this.MscMainInfoId = resp.infoId
          this.selectParams.monitorNumber = res.monitorNo.toString()
          this.selectParams.monitorReason = res.reason.toString()
          this.selectParams.monitorLevel = res.level.toString()
          this.selectParams.startDate = res.startTime
          this.selectParams.endDate = res.endTime
          this.selectParams.creator = res.createPerson
          this.selectParams.monitorDescribe = res.description
          this.selectParams.stockCode = res.securityId
          this.selectParams.stockName = res.securityName
          this.submitData.stockCode = res.securityId + ' ' + res.securityName
          this.clueInfoParams = res.clueId
          this.selectParams.clewReport = res.extend2
          this.checkOptionParams.clueReport = res.isClue == '0' ? '2' : '1'
          getStockGroupInfo(res.securityId).then(resp => {
            resp.RelatedMagRec.forEach((el) => {
              if (el.level == '1') {
                el.level = '1级'
              } else if (el.level == '2') {
                el.level = '2级'
              } else if (el.level == '3') {
                el.level = '3级'
              } else {
                el.level = '0级'
              }
              if (el.reason == '1') {
                el.reason = '涉嫌跨期操纵'
              } else if (el.reason == '2') {
                el.reason = '涉嫌短线操纵'
              } else if (el.reason == '3') {
                el.reason = '异动股'
              } else {
                el.reason = '其他'
              }
            })
            this.monitorGroupsData = resp.RelatedMagRec
          })
          if (res.isClue) {
            //  获取线索报告信息
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
      getUserGroup() {
        let username = this.gfnGetUsername();
        getUserRoles(username).then((resp) => {
          this.creatorGroup = resp[0].rolename
        });
      },
      getStockCode(stockCodeData) {
        if (stockCodeData) {
          this.selectParams.stockCode = stockCodeData.split(' ')[0]
          this.selectParams.stockName = stockCodeData.split(' ')[1]
          let securityId = stockCodeData.split(' ')[0]
          getStockGroupInfo(securityId).then(resp => {
            resp.RelatedMagRec.forEach((el) => {
              if (el.level == '1') {
                el.level = '1级'
              } else if (el.level == '2') {
                el.level = '2级'
              } else if (el.level == '3') {
                el.level = '3级'
              } else {
                el.level = '0级'
              }
              if (el.reason == '1') {
                el.reason = '涉嫌跨期操纵'
              } else if (el.reason == '2') {
                el.reason = '涉嫌短线操纵'
              } else if (el.reason == '3') {
                el.reason = '异动股'
              } else {
                el.reason = '其他'
              }
            })
            this.monitorGroupsData = resp.RelatedMagRec
          })
        }
      },
      submit() {
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
                'infoId': this.clueInfoId,  //  需要请求获取新的infoId的url,获取到新的infoId放进来,这个都懂得
                'extend1': this.clueId,  //  需要请求新的线索编号接口,放进来,url是/v1/no/next?processName=crp
                'security': this.selectParams.stockCode + ' ' + this.selectParams.stockName,  //  涉及证券
                'clueName': this.checkOptionParams.clueName,  //  线索名称
                'clueDesc': this.checkOptionParams.clueDescribe,  //  线索描述
                'needReport': this.checkOptionParams.isNeedReport,  //  是否上报
                'clueBranch': this.checkOptionParams.clueClass,  //  线索分类
                'clueType': clueType.join(','),  //  线索类型
                'clueTypeText': this.checkOptionParams.clueType.join(','),  //  线索类型文字
                'sourceType': '5', // 来源分类 重点监控账户:4 重点监控证券:5
                'sourceTypeText': '重点监控证券', // 来源分类文字
                'source': this.selectParams.monitorNumber, // 线索来源
                'createFrom': 'ngsp_msc_flow', // 创建自哪个流程?ngsp_msc_flow|ngsp_mag_flow|ngsp_dig_flow|ngsp_uns_check_flow
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
          'MscMain': {
            'infoId': !this.$route.query.instanceId ? this.infoId : this.MscMainInfoId,
            'processStatus': '0',
            'monitorNo': this.selectParams.monitorNumber,
            'securityId': this.selectParams.stockCode,
            'securityName': this.selectParams.stockName,
            'reason': this.selectParams.monitorReason,
            'level': this.selectParams.monitorLevel,
            'startTime': moment(this.selectParams.startDate).format('YYYY-MM-DD'),
            'endTime': moment(this.selectParams.endDate).format('YYYY-MM-DD'),
            'description': this.selectParams.monitorDescribe,
            'isClue': this.checkOptionParams.clueReport == '1' ? '1' : '0', // 是否关联线索报告流程
            'clueId': this.checkOptionParams.clueReport == '1' ? !Number(this.clueInfoParams) ? this.clueInfoId : this.clueInfoParams : '',  // 线索编号
            'createPerson': this.selectParams.creator,
            'comment': this.auditoption,
            'extend1': '',
            'extend2': !this.selectParams.clewReport ? this.clueId : this.selectParams.clewReport,
            'extend3': '',
            'cluetitle': this.checkOptionParams.clueName, // 线索标题
            'clueDesc': this.checkOptionParams.clueDescribe  // 线索描述
          },
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
                  postFocusMonitorStart(JSON.stringify(params)).then(resp => {
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
              postFocusMonitorStart(JSON.stringify(params)).then(resp => {
                this.$message.success('流程下一处理人：' + resp.assignee)
                setTimeout(() => {
                  this.goBack()
                }, 1000)
              })
            }
          } else {
            this.$message.warning('请填写完整监控证券信息')
            // return false
          }
        })
      },
      save() {
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
                'security': this.selectParams.stockCode + ' ' + this.selectParams.stockName, // 涉及证券
                'clueName': this.checkOptionParams.clueName, // 线索名称
                'clueDesc': this.checkOptionParams.clueDescribe, // 线索描述
                'needReport': this.checkOptionParams.isNeedReport, // 是否上报
                'clueBranch': this.checkOptionParams.clueClass, // 线索分类
                'clueType': clueType.join(','), // 线索类型
                'clueTypeText': this.checkOptionParams.clueType.join(','), // 线索类型文字
                'sourceType': '5', // 来源分类 重点监控账户:4 重点监控证券:5
                'sourceTypeText': '重点监控证券', // 来源分类文字
                'source': this.selectParams.monitorNumber, // 线索来源
                'createFrom': 'ngsp_msc_flow', // 创建自哪个流程?ngsp_msc_flow|ngsp_mag_flow|ngsp_dig_flow|ngsp_uns_check_flow
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
          'MscMain': {
            'infoId': !this.$route.query.instanceId ? this.infoId : this.MscMainInfoId,
            'processStatus': '0',
            'monitorNo': this.selectParams.monitorNumber,
            'securityId': this.selectParams.stockCode,
            'securityName': this.selectParams.stockName,
            'reason': this.selectParams.monitorReason,
            'level': this.selectParams.monitorLevel,
            'startTime': moment(this.selectParams.startDate).format('YYYY-MM-DD'),
            'endTime': moment(this.selectParams.endDate).format('YYYY-MM-DD'),
            'description': this.selectParams.monitorDescribe,
            'isClue': this.checkOptionParams.clueReport == '1' ? '1' : '0',
            'clueId': this.checkOptionParams.clueReport == '1' ? !Number(this.clueInfoParams) ? this.clueInfoId : this.clueInfoParams : '',
            'createPerson': this.selectParams.creator,
            'comment': this.auditoption,
            'extend1': '',
            'extend2': !this.selectParams.clewReport ? this.clueId : this.selectParams.clewReport,
            'extend3': '',
            'cluetitle': this.checkOptionParams.clueName, // 线索标题
            'clueDesc': this.checkOptionParams.clueDescribe  // 线索描述
          },
          'taskId': !this.$route.query.taskId ? '0' : this.$route.query.taskId,
          'toWhom': '',
          'operate': !this.$route.query.instanceId ? 'new' : '',
          'group': this.creatorGroup
        }
        this.$refs['selectParams'].validate((valid) => {
          if (valid) {
            if (!this.selectParams.clewReport) {
              this.$refs['checkOptionParams'].validate((valid) => {
                if (valid) {
                  postFocusMonitorSave(JSON.stringify(params)).then(resp => {
                    if (resp) {
                      this.$message.success('保存流程表单成功')
                    }
                  })
                } else {
                  this.$message.warning('请填写完整线索报告信息')
                  // return false
                }
              })
            } else {
              postFocusMonitorSave(JSON.stringify(params)).then(resp => {
                if (resp) {
                  this.$message.success('保存流程表单成功')
                }
              })
            }
          } else {
            this.$message.warning('请填写完整监控证券信息')
            // return false
          }
        })
      }
    }
  }
</script>

<style lang='less'>
  .newBuiltSecurity {
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
