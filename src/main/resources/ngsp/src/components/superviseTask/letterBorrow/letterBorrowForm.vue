<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card>
      <el-tabs>
        <el-tab-pane label="借阅信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span><span style="color:red">*</span>借阅人</span></el-col>
        <el-col :span="4">
          <span>{{borrowPerson}}</span>
        </el-col>
        <el-col :span="3"><span><span style="color:red">*</span>借阅天数</span></el-col>
        <el-col :span="5" style="margin-left:-6%">
          <span>{{borrowTime}}天</span>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2" style="margin-top:8px"><span style="color:red">*</span>借阅时间</el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="dimensionQueryForm.beginDate"
            type="datetime"
            placeholder=""
            value-format="yyyy-MM-dd hh:dd:ss"
            default-time="12:00:00"
            size="small"
            style="width:90%">
          </el-date-picker>
        </el-col>
        <el-col style="width:2%;margin-top:7px">至</el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="dimensionQueryForm.endDate"
            type="datetime"
            placeholder=""
            value-format="yyyy-MM-dd hh:dd:ss"
            default-time="12:00:00"
            size="small"
            :picker-options="endpickerOption"
            style="width:90%">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>借阅理由</el-col>
        <el-col :span="19">
          <el-input placeholder="" v-bind:maxlength=1000 type="textarea" v-model="borrowReason" size="medium"
                    style="width:77%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>借阅函件</el-col>
        <el-col>
          <el-table
            style="margin-top:10px;"
            :data="deailcasedata"
            :fit=true
            border>
            <el-table-column
              type="index"
              width="50"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="letterNo"
              label="函件编号"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="security"
              label="证券代码及简称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="letterName"
              label="函件名称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="conclusion"
              label="案件结论"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="processStatus==1||processStatus==2||processStatus==3||processStatus==4">
      <el-tabs>
        <el-tab-pane label="审核意见" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;" v-if="processStatus==1||processStatus==2||processStatus==3||processStatus==4">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">您的意见</el-col>
        <el-col :span="18">
          <el-input type="textarea" v-model="auditoption" placeholder="字符限制200以内" v-bind:maxlength=200 size="medium"
                    style="width:77%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px">
        <el-table
          style="margin-top:10px;"
          :data="historydata"
          :fit=true
          border>
          <el-table-column
            type="index"
            width="50"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="proceStatus"
            label="流程状态"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="comment"
            label="审核意见"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="procePerson"
            label="处理人"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="审核日期"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <span>
        <el-button @click="goBack" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
      </span>
    <span v-if="newcreat">
        <el-button @click="saveall" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0">保存</el-button>
      </span>
    <span v-if="newcreat">
        <el-button @click="submitfrom('true')" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">提交</el-button>
      </span>
    <span v-if="newcreat && [1,2].indexOf(Number(processStatus)) > -1">
        <el-button @click="submitfrom('false')"
                   style="float:right;margin:20px 20px 0 0;width:10%">驳回</el-button>
      </span>
    <!--<span v-for="item in buttondispaly" v-if="processStatus==1||processStatus==2||processStatus==3||processStatus==4">
        <el-button type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="submitfrom(item)">{{item}}</el-button>
      </span>-->
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import StepsCommonComponent from '../superviseTaskComponent/StepsCommonComponent'
  // import selectPersonComponent from '../superviseTaskComponent/selectPersonComponentCopy'
  import moment from 'moment'
  import MixIn from '../MixIn'
  import MixinAuthority from '../MixinAuthority'
  import {
    getInfoId,
    letterBorrowlaunch,
    letterBorrowsave,
    letterBorrowdata,
    getGroup,
    getbuttonname,
    letterBorrowexamine,
    letterBorrowhistoryopiniondata,
    getActivityNameByProcessName,
    getletterBorrowTableData
  } from '../../../service/superviseTask/index.js'
  import {
    add0,
    dateformat,
    timeformat,
    tabletimeformat
  } from '../../../utils/dateTimeFormat.js'

  export default {
    components: {
      Breadcrumb,
      StockCodeQuery,
      StepsCommonComponent
      // selectPersonComponent
    },
    mixins: [MixIn, MixinAuthority],
    data () {
      return {
        steps: [],
        stepsDescription: [],
        acivityNameArray: [],
        selectData: {
          dialogFormVisble: false,
          activityName: '', // 审核并分配
          instanceId: '',
          processName: 'ngsp_ltb_flow', // 当前流程名称
          businessData: {}
        }, // 调取分配人dialog接口的入参
        approve: 'true',
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/letterBorrowTablelist',
          label: '函件借阅'
        }, {
          router: '',
          label: '函件借阅表单'
        }],
        auditoption: '',
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        borrowPerson: '',
        borrowPersonCode: '',
        borrowTime: '1',
        borrowReason: '',
        deailcasedata: [{
          'infoId': 999000001525581792455800,
          'letterNo': '测试345435345',
          'security': '78768678 kjkjkjk',
          'letterName': '测试56',
          'conclusion': 'mbnmnmbnm',
          'belongGroup': 'TECH_SUPPORT_GROUP',
          'belongInfoId': null,
          'belongProcess': 'ngsp_uns_send_flow',
          'extend1': null,
          'extend2': null
        }],
        opearte: '',
        handelstatus: '',
        taskId: '',
        instanceId: '',
        newcreat: false,
        processStatus: 0,
        buttondispaly: [],
        historydata: [],
        // group: '',
        isSameGroup: '',
        fromInstanceId: '',
        dimensionQueryForm: {
          beginDate: ''
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.dimensionQueryForm.beginDate).getTime() - 3600 * 1000 * 24
          }
        }
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus, fromInstanceId} = this.$route.query
      if (fromInstanceId) { // 从其他流程转入
        this.fromInstanceId = fromInstanceId
        let params = {instanceId: fromInstanceId}
        getletterBorrowTableData(params).then(resp => {
          this.deailcasedata = resp
        })
      }
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.borrowPerson = this.gfnGetRealName()
      this.reqActivityNameByProcessName(() => {
        this.handelstatus = operate
        this.taskId = taskId
        this.instanceId = instanceId
        if (this.handelstatus == '1') {
          this.newcreat = false
          this.getAllData()
          this.gethistoryform()
        } else if (this.handelstatus == '2') {
          this.newcreat = true
          this.getAllData()
          // this.getbutton()
          this.gethistoryform()
        } else {
          this.getInfoId()
          // this.getletterTable()
          this.opearte = 'new'
          this.newcreat = true
        }
      })
    },
    methods: {
      reqActivityNameByProcessName (callback) {
        getActivityNameByProcessName(this.selectData.processName).then(res => {
          this.steps = res['localStatusName']
          this.acivityNameArray = res['activityName']
          this.selectData.activityName = res['activityName'][+this.processStatus + 1]
          this.selectData.businessData = res['businessData']
          callback && callback()
        })
      },
      // undisplaypoint(value,flag){
      //   if (!value) {
      //     switch (flag) {
      //       case "1":
      //         this.nulldec = true;
      //         break
      //       case "3":
      //         this.nullbeginDate = true;
      //         break
      //       case "4":
      //         this.nullresultdec = true;
      //         break
      //       case "5":
      //         this.nullfeedbackUnit = true;
      //         break
      //       case "9":
      //         this.nullcheckStandard = true;
      //         break
      //     }
      //   } else {
      //     switch (flag) {
      //       case "1":
      //         this.nulldec = false;
      //         break
      //       case "3":
      //         this.nullbeginDate = false;
      //         break
      //       case "4":
      //         this.nullresultdec = false;
      //         break
      //       case "5":
      //         this.nullfeedbackUnit = false;
      //         break
      //       case "9":
      //         this.nullcheckStandard = false;
      //         break
      //     }
      //   }
      // },
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
        })
      },
      saveall () {
        this.dealNeWInfoId()
        let params = {
          'ltbMain': {
            'infoId': this.infoId,
            'borrower': this.borrowPerson,
            'borrowDays': this.borrowTime,
            'borrowDateStart': this.dimensionQueryForm.beginDate,
            'borrowDateEnd': this.dimensionQueryForm.endDate,
            'reason': this.borrowReason,
            'processStatus': this.processStatus,
            'comment': this.auditoption,
            'isSameGroup': this.isSameGroup,
            'borrowFrom': this.fromInstanceId,
            'extend1': this.borrowPersonCode || this.gfnGetUsername()
          },
          'ltbLetters': this.deailcasedata,
          'instanceId': this.instanceId,
          'taskId': this.taskId || '0',
          'toWhom': '',
          'approve': true,
          'operate': this.opearte
          // 'group': this.group,
        }
        let isparams = JSON.stringify(params)
        letterBorrowsave(isparams).then((resp) => {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        })
      },
      getAllData () {
        letterBorrowdata(this.instanceId).then((resp) => {
          this.processStatus = resp.ltbMain.processStatus
          this.infoId = resp.infoId
          this.borrowPerson = resp.ltbMain.borrower
          this.borrowTime = resp.ltbMain.borrowDays
          this.dimensionQueryForm.beginDate = resp.ltbMain.borrowDateStart
          this.dimensionQueryForm.endDate = resp.ltbMain.borrowDateEnd
          this.borrowReason = resp.ltbMain.reason
          this.auditoption = resp.ltbMain.comment
          this.deailcasedata = resp.ltbLetters
          this.borrowPersonCode = resp.ltbMain.extend1 || this.gfnGetUsername()
          this.isSameGroup = resp.ltbMain.isSameGroup || ''
          this.fromInstanceId = this.fromInstanceId || resp.ltbMain.borrowFrom
        })
      },
      // dispalySelectPerson(){
      //   this.selectPerson=true
      // },
      submitfrom (flag) {
        if (flag === 'false') {
          this.$confirm('确定驳回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.approve = 'false'
            this.confirmCommiInfo()
          }).catch(() => {})
          return
        }
        // if(!this.requireDescript){
        //   this.nulldec=true
        //   return
        // }
        // if(!this.checkStandard){
        //   this.nullcheckStandard=true
        //   return
        // }
        // if(!this.dimensionQueryForm.beginDate){
        //   this.nullbeginDate=true
        //   return
        // }
        // if(this.processStatus==2||this.processStatus==3||this.processStatus==4){
        //   if(!this.opearteDescript){
        //     this.nullresultdec=true
        //     return
        //   }
        //   if(!this.feedbackUnit){
        //     this.nullfeedbackUnit=true
        //     return
        //   }
        // }
        this.$confirm('确定提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.confirmCommiInfo()
        }).catch(() => {

        })
      },
      dealNeWInfoId() {
        this.deailcasedata.forEach(v => {
          v.infoId = this.infoId
        })
      },
      confirmCommiInfo() {
        this.dealNeWInfoId()
        let params = {
          'ltbMain': {
            'infoId': this.infoId,
            'borrower': this.borrowPerson,
            'borrowDays': this.borrowTime,
            'borrowDateStart': this.dimensionQueryForm.beginDate,
            'borrowDateEnd': this.dimensionQueryForm.endDate,
            'reason': this.borrowReason,
            'processStatus': this.processStatus,
            'comment': this.auditoption,
            'isSameGroup': this.isSameGroup,
            'borrowFrom': this.fromInstanceId,
            'extend1': this.borrowPersonCode || this.gfnGetUsername()
          },
          'ltbLetters': this.deailcasedata,
          'instanceId': this.instanceId,
          'taskId': this.taskId || '0',
          'toWhom': '',
          'approve': this.approve,
          'operate': this.opearte
          // 'group': this.group
        }
        let isparams = JSON.stringify(params)
        if (this.processStatus == 0) {
          letterBorrowlaunch(isparams).then((resp) => {
            this.goBack()
          })
        } else {
          letterBorrowexamine(isparams).then((resp) => {
            this.goBack()
          })
        }
      },
      geturlparam () {
        let url = window.location.href
        let request = new Object()
        if (url.indexOf('?') != -1) {
          let str = url.substr(1)
          this.urlstrs = str.split('&')
          for (let i = 0; i < this.urlstrs.length; i++) {
            request[this.urlstrs[i].split('=')[0]] = unescape(this.urlstrs[i].split('=')[1])
          }
        } else {
          this.urlstrs = url
        }
      },
      getbutton () {
        getbuttonname(this.taskId).then((resp) => {
          for (let item of resp.data.approveTypes) {
            if (item.name == '退回发起人' || item.name == '退回至') {
              item.name = '驳回'
            }
            this.buttondispaly.push(item.name)
          }
        })
      },
      gethistoryform () {
        letterBorrowhistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.historydata = resp.value
          for (let i = 0; i < this.historydata.length; i++) {
            if (String(this.historydata[i].proceStatus) === '0') {
              this.historydata.splice(i, 1)
            }
          }
        })
      },
      // getletterTable(){
      //   getTable(this.frominstanceId).then((resp) => {

      //   });
      // },
      borrowCount () {
        this.borrowTime = this.dimensionQueryForm.endDate - this.dimensionQueryForm.beginDate
      }
    }
  }
</script>
<style>
  .verfynull {
    margin-left: -13%;
    margin-top: 7px;
    color: red;
  }

  .el-step__title.is-success {
    color: #7b98ba;
  }

  .el-step__description.is-success {
    color: #506798;
    margin-top: -10px;
  }

  .el-step__icon-inner.is-status {
    color: #fff;
  }

  .theme_dark .el-step__icon {
    background-color: #67c23a;
  }
</style>
