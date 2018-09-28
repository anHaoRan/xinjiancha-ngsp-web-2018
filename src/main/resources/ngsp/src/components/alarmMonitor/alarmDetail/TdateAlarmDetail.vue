<!--实时预警列表 -->
<template>
  <div class="tdatealarmdetail">
    <!--面包屑组件-->
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <!--tep-->
    <basic-information ref="basicinformation" :basicinformation="basicDetails" :acct-list="wAcctList"></basic-information>
    <securities-regulatory-history :securities-monitoring="securitiesMonitoring" :securities-log="securitiesLog"
                                   :securities-announcement="securitiesAnnouncement"
                                   :securities-risk="securitiesRisk"></securities-regulatory-history>
    <account-regulatory-history :account-info="accountInfo" :out-log="outLog" :log-report="logReport"
                                :monitor-theSituation="monitorTheSituation"></account-regulatory-history>
    <el-card class="processing-conditions">
      <div slot="header" class="clearfix">
        <span>处理情况</span>
      </div>
      <el-input type="textarea" :rows="3" resize="none" v-model="textarea"></el-input>
    </el-card>
    <el-row style="margin-top: 10px;text-align: center;">
      <el-col :span="24">
        <el-button type="primary" @click="go('联合监管')">联合监管</el-button>
        <el-button type="primary" @click="go('自律监管')">自律监管</el-button>
        <el-button type="primary" @click="go('调取资料')">调取资料</el-button>
        <el-button type="primary" @click="go('办结')">办结</el-button>
        <el-button type="primary" @click="go">关闭</el-button>
      </el-col>
    </el-row>
    <el-dialog title="预警处理" width="30%" :visible.sync="dialogFormVisble">
      <span>
      处理方案:
      <el-radio-group v-model="alarmStatus">
        <el-radio :label="3">继续观察</el-radio>
        <el-radio :label="6"> 关闭预警</el-radio>
        <el-radio :label="9">虚警</el-radio>
      </el-radio-group>
      </span>
      <span slot="footer">
        <el-button type="primary" size="small" @click="processingBathDealAlarm">处理预警</el-button>
        <el-button type="text" size="small" @click="dialogFormVisble=false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  // 面包屑组件引入
  import breadcrumb from '../../common/Breadcrumb'
  // 基本信息
  import BasicInformation from './BasicInformation'
  // 证券监管历史
  import SecuritiesRegulatoryHistory from './SecuritiesRegulatoryHistory'
  // 账户监管历史
  import AccountRegulatoryHistory from './AccountRegulatoryHistory'
  // 实时预警详情接口
  import {
    warndetail    // 实时预警详情接口
  } from '@/service/alarmMonitor/alarmDetail'
  import {
    processingBath      // 批处理
  } from '@/service/alarmMonitor/alarmList'
  import { INVESTIGATE_MATTERS } from './SelectOptions'

  export default {
    // 组件注册
    components: {
      breadcrumb,        // 面包屑组件，
      BasicInformation,   //  基本信息
      SecuritiesRegulatoryHistory,  //  证券监管历史
      AccountRegulatoryHistory // 账户监管历史
    },
    data () {
      return {
        // 面包屑路由
        breadcrumbItems: [
          {
            router: '/alarmList',
            label: '预警管理'
          }, {
            router: '/alarmList',
            label: '预警详情'
          }
        ],
        routerParams: {},
        // v-model
        textarea: '',
        //  url?后面跟随的参数
        urlstrs: {},
        //  基本信息
        basicDetails: {},
        //  账户（待分析）
        wAcctList: [],
        //  风险指数信息
        securitiesRisk: {},
        //  证券监管重点监控证券信息
        securitiesMonitoring: [],
        //  证券监管历史日志
        securitiesLog: [],
        //  舆情公告信息
        securitiesAnnouncement: [],
        //  账户信息展示
        accountInfo: [],
        //  转出历史
        outLog: [],
        //  历史上报情况
        logReport: [],
        //  监控情况
        monitorTheSituation: [],
        dialogFormVisble: false,
        alarmStatus: 3
      }
    },
    watch: {
      '$route': 'warndetailPost'
    },
    methods: {
      warndetailPost () {
        this.routerParams = this.getUrlParam(this.$route.fullPath)
        var param = {alarmId: this.$route.params.alarmId}
        warndetail(param).then((res) => {
          this.basicDetails = res.wBasicList.bizData.metaData[0]
          this.wAcctList = res.wAcctList.bizData.metaData
          this.securitiesRisk = res.riskindex.bizData.metaData[0]
          this.securitiesMonitoring = res.wKeyMonSec.bizData.metaData
          this.securitiesLog = res.wHisLog
          this.securitiesAnnouncement = res.pfnotice.bizData.metaData
          this.accountInfo = res.wAcctList.bizData.metaData
          this.outLog = res.chanhistory
          this.logReport = res.hisreport.bizData.metaData
          this.monitorTheSituation = res.monitorcase.bizData.metaData
        })
      },
      //  返回
      go (str) {
        let param = {
          investigateMattersName: this.$refs.basicinformation.investigateMattersName,
          abnormalBehaviorName: this.$refs.basicinformation.abnormalBehaviorName,
          textarea: this.textarea,
          alarm_remark: this.$refs.basicinformation.basicinformation.alarm_remark,
          differentiation: this.$refs.basicinformation.differentiationName,
          createType: 0
        }
        switch (str) {
          case '联合监管':
            this.$router.push({name: 'sendLetterFormPage', params: {param}, query: {alarmId: this.$route.params.alarmId}})
            break
          case '自律监管':
            this.$router.push({name: 'selfSupervisionFormPage', params: {param}, query: {alarmId: this.$route.params.alarmId}})
            break
          case '调取资料':
            this.$router.push({
              // name: 'surveyprocessform',
              name: 'surveyFormPage', // 重构后
              params: {param},
              query: {alarmId: this.$route.params.alarmId}
            })
            break
          case '办结':
            this.dialogFormVisble = true
            break
          default:
            // this.$router.push({path: `/${this.routerParams.router}?activeName=${this.routerParams.activeName}`})
            this.closeNewWindow()
            break
        }
      },
      //  批处理提交参数方法
      processingBathDealAlarm () {
        let arr = [
          {
            alarmID: this.basicDetails.alarm_id,
            alarmStatus: this.alarmStatus,
            alarmProcAdvice: this.alarmStatus == 3 ? '继续观察' : (this.alarmStatus == 6 ? '关闭预警' : '虚警')
          }
        ]
        arr = JSON.stringify(arr)
        processingBath(arr).then((res) => {
          this.$message({
            showClose: true,
            message: '预警处理成功',
            type: 'success',
            duration: 10000
          })
          this.dialogFormVisble = false
          // this.$router.push({path: `/${this.routerParams.router}?activeName=${this.routerParams.activeName}`})
        })
      }
    },
    // 发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
      this.warndetailPost()
    }
  }
</script>
<style lang="less">
</style>
