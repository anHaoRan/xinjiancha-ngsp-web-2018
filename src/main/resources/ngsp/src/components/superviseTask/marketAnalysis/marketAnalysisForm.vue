<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card>
      <el-tabs>
        <el-tab-pane label="报告基本信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>报告编号</el-col>
        <el-col :span="8">
          <el-input disabled v-model="reportNumber" size="small" style="width:59%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>函件类型</el-col>
        <el-col :span="8">
          <el-select :disabled="applyCreate||reportApply" v-model="letterstyle1" size="small" placeholder="">
            <el-option
              v-for="item in isletterstyle1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select :disabled="applyCreate||reportApply" v-model="letterstyle2" size="small" placeholder=""
                     @change="changeReportNumber">
            <el-option
              v-for="item in isletterstyle2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>报告内容</el-col>
        <el-col :span="19">
          <el-input :disabled="applyCreate||reportApply" placeholder="字符限制2000以内" v-bind:maxlength=2000 type="textarea"
                    v-model="reportContent" size="medium" style="width:77%"
                    @change="dispalynullreportContent"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullreportContent" class="verfynull">报告内容为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="3"><span><span style="color:red">*</span>所属部门</span></el-col>
        <el-col :span="5" style="margin-left:-6%">
          <span>{{department}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;"
              v-if="processStatus==1||processStatus==2||processStatus==3||processStatus==4||processStatus==5||processStatus==6||processStatus==7||processStatus==8">
        <el-col :span="2"><span><span style="color:red">*</span>创建人</span></el-col>
        <el-col :span="4">
          <span>{{createPerson}}</span>
        </el-col>
        <el-col :span="3"><span><span style="color:red">*</span>创建日期</span></el-col>
        <el-col :span="5" style="margin-left:-6%">
          <span>{{createDate}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;"
              v-if="processStatus==2||processStatus==3||processStatus==4||processStatus==5||processStatus==6||processStatus==7||processStatus==8">
        <el-col :span="2"><span><span style="color:red">*</span>拟稿人</span></el-col>
        <el-col :span="4">
          <span>{{draftPerson}}</span>
        </el-col>
        <el-col :span="3"><span><span style="color:red">*</span>拟稿日期</span></el-col>
        <el-col :span="5" style="margin-left:-6%">
          <span>{{draftDate}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;"
              v-if="processStatus==3||processStatus==4||processStatus==5||processStatus==6||processStatus==7||processStatus==8">
        <el-col :span="2"><span><span style="color:red">*</span>复核人</span></el-col>
        <el-col :span="4">
          <span>{{reviewPerson}}</span>
        </el-col>
        <el-col :span="3"><span><span style="color:red">*</span>复核日期</span></el-col>
        <el-col :span="5" style="margin-left:-6%">
          <span>{{reviewDate}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;" v-if="processStatus==8">
        <el-col :span="2"><span><span style="color:red">*</span>发函人</span></el-col>
        <el-col :span="4">
          <span>{{sendPerson}}</span>
        </el-col>
        <el-col :span="3"><span><span style="color:red">*</span>发函日期</span></el-col>
        <el-col :span="5" style="margin-left:-6%">
          <span>{{sendDate}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2">附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton" style="min-width:200px">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadurlfirst"
              :disabled="applyCreate || reportApply"
              :uploadOption="uploadOption"
              :noLimitFileType="true"
              :limitFileSize="20"
              :limit="100"
              :propsFileList="fileList1"
              @handlePreview="handlePreview"
              @handleRemove="deleteFile"
              @getTxtCon="getFileList"
            ></text-upload>
          </div>
          <div v-else>
            <span v-if="fileList1.length > 0">
              <span
                style="display: block;"
                v-for="item in fileList1"
                :key="item.fileId">
              {{item.name}}
            </span>
            </span>
            <span v-else>无附件</span>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span>搜索关键字</span></el-col>
        <el-col :span="22">
          <el-input :disabled="applyCreate||reportApply" v-model="keyword" size="small" class="custom-width"
                    maxlength="50" placeholder="输入内容在50字以内"></el-input>
          注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs>
        <el-tab-pane label="审核意见" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">您的意见</el-col>
        <el-col :span="18">
          <el-input :disabled="applyCreate" type="textarea" v-model="auditoption" placeholder="字符限制200以内"
                    v-bind:maxlength=200 size="medium" style="width:77%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px" v-if="displaytable">
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
    <span v-if="newcreat&&(processStatus!=8)">
        <el-button @click="saveall" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0">保存</el-button>
      </span>
    <span v-if="newcreat==true&&(processStatus==0||processStatus==1)">
        <el-button @click="submitfrom()" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">提交</el-button>
      </span>
    <span v-for="item in buttondispaly"
          v-if="processStatus==2||processStatus==3||processStatus==4||processStatus==5||processStatus==6||processStatus==7">
        <el-button type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="submitfrom(item)">{{item}}</el-button>
      </span>
    <el-dialog
      title=""
      :visible.sync="dialogFormVisble"
      center
      width="700px">
      <el-form>
        <el-form-item :label-width="formLabelWidth">
          <el-button @click="submitLender('true')" type="primary" style="text-align: center;">提交到所领导审批</el-button>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button @click="submitDrafa('false')" type="primary" style="text-align: center;">提交到拟稿人确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <select-person-component
      v-if="selectData.dialogFormVisble"
      :selectData="selectData"
      @obdSelectPerson='confirmCommitInfo'></select-person-component>
  </div>
</template>
<script>
  import MixIn from '../MixIn'
  import MixinAuthority from '../MixinAuthority'
  import moment from 'moment'
  import textUpload from '@/components/common/textUpload'
  import {
    ReportNum,
    getInfoId,
    getGroup,
    marketAnalysisleaderform,
    marketAnalysisgrouperform,
    marketAnalysisexamine,
    marketAnalysissave,
    marketAnalysisdata,
    getbuttonname,
    marketAnalysishistoryopiniondata,
    getfilelist,
    deletefile,
    ispermitload,
    getActivityNameByProcessName,
    getUserRoles
  } from '@/service/superviseTask'
  import {
    add0,
    dateformat,
    timeformat,
    tabletimeformat
  } from '../../../utils/dateTimeFormat.js'

  export default {
    mixins: [MixIn, MixinAuthority],
    components: {textUpload},
    data () {
      return {
        steps: [],
        stepsDescription: [],
        acivityNameArray: [],
        selectData: {
          dialogFormVisble: false,
          activityName: '', // 审核并分配
          instanceId: '',
          processName: 'ngsp_mka_flow', // 当前流程名称
          businessData: {}
        }, // 调取分配人dialog接口的入参
        approveFlag: 'true',
        userRole: 0, // 0-组员，1-组长
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/marketAnalysisTable',
          label: '市场分析'
        }, {
          router: '',
          label: '市场分析表单'
        }],
        dialogFormVisble: false,
        formLabelWidth: '120px',
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        processinfo6: '',
        processinfo7: '',
        processinfo8: '',
        displaytable: false,
        reportNumber: '',
        letterstyle1: '市场分析',
        isletterstyle1: [{
          value: '市场分析',
          label: '市场分析'
        }],
        letterstyle2: '市场分析报告',
        isletterstyle2: [{
          value: '市场分析报告',
          label: '市场分析报告'
        }, {
          value: '市场分析日报',
          label: '市场分析日报'
        }, {
          value: '市场分析周报',
          label: '市场分析周报'
        }, {
          value: '市场分析月报',
          label: '市场分析月报'
        }, {
          value: '市场分析专项报告',
          label: '市场分析专项报告'
        }],
        reportContent: '',
        createPerson: '',
        department: '市场监察一部',
        draftPerson: '',
        draftDate: '',
        reviewPerson: '',
        reviewDate: '',
        sendPerson: '',
        sendDate: '',
        fileList1: [],
        auditoption: '',
        keyword: '', // 关键字
        opearte: '',
        handelstatus: '',
        infoId: '',
        taskId: '',
        instanceId: '',
        group: '',
        sendToLeader: '',
        newcreat: false,
        processStatus: 0,
        buttondispaly: [],
        historydata: [],
        applyCreate: false,
        reportApply: false,
        nullreportContent: false,
        uploadurlfirst: '',
        lastLetterstyle2: '',
        createDate: '',
        showUploadButton: true,
        uploadFileList: [],
        uploadOption: {
          name: '上传',
          size: 'small',
          type: 'primary'
        }
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqUserRole(() => {
        this.reqActivityNameByProcessName(() => {
          this.handelstatus = operate
          if (this.handelstatus == '1') {
            this.taskId = taskId
            this.instanceId = instanceId
            this.newcreat = false
            this.applyCreate = true
            this.getAllData()
            this.gethistoryform()
          } else if (this.handelstatus == '2') {
            this.taskId = taskId
            this.instanceId = instanceId
            this.newcreat = true
            this.getAllData()
            this.getbutton()
            this.gethistoryform()
          } else {
            if (this.userRole) {
              this.processStatus = 0
            } else {
              this.processStatus = 1
              this.draftPerson = this.gfnGetRealName()
              this.draftDate = moment().format('YYYY-MM-DD')
            }
            this.getInfoId()
            // this.getletterTable()
            this.getReportNum()
            this.getbelongGroup()
            this.opearte = 'new'
            this.newcreat = true
          }
          if (String(this.handelstatus) !== '1' && String(this.handelstatus) !== '2') {
            this.createPerson = this.gfnGetRealName()
            this.createDate = moment().format('YYYY-MM-DD')
          }
        })
      })
    },
    methods: {
      reqUserRole (callback) {
        getUserRoles(this.gfnGetUsername()).then((resp) => {
          resp.forEach(item => {
            if (item.rolename.indexOf('组长') > -1) { // 组长
              this.userRole = 1
            }
          })
          callback && callback()
        })
      },
      submitLender () {
        this.sendToLeader = 'true'
        this.selectData.dialogFormVisble = true
      },
      submitDrafa () {
        this.sendToLeader = 'false'
        this.confirmCommitInfo()
      },
      reqActivityNameByProcessName (callback) {
        getActivityNameByProcessName(this.selectData.processName).then(res => {
          this.steps = res['localStatusName']
          this.acivityNameArray = res['activityName']
          this.selectData.activityName = res['activityName'][+this.processStatus + 1]
          this.selectData.businessData = res['businessData']
          callback && callback()
        })
      },
      changeReportNumber () {
        this.getReportNum()
      },
      dispalynullreportContent () {
        if (!this.reportContent) {
          this.nullreportContent = true
        } else {
          this.nullreportContent = false
        }
      },
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
          this.uploadurlfirst = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=mka_first_attachment&infoId=' + this.infoId + '&fileName=' + ''
        })
      },
      getReportNum () {
        ReportNum(this.letterstyle2, this.lastLetterstyle2).then((resp) => {
          this.lastLetterstyle2 = this.letterstyle2
          this.reportNumber = resp
        })
      },
      saveall () {
        if (!this.reportContent) {
          this.nullreportContent = true
          return
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let params = {
          'mkaMain': {
            'infoId': this.infoId,
            'reportNo': this.reportNumber,
            'letterType': this.letterstyle1 + ' ' + this.letterstyle2,
            'reportContent': this.reportContent,
            'createPerson': this.createPerson,
            'extend2': this.createDate,
            'createDepartment': this.department,
            'drafter': this.draftPerson,
            'draftDate': this.draftDate,
            'recheckPerson': this.reviewPerson,
            'recheckDate': this.reviewDate,
            'sendPerson': this.sendPerson,
            'sendDate': this.sendDate,
            'processStatus': this.processStatus,
            'comment': this.auditoption
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': '',
          'approve': 'true',
          'operate': this.opearte,
          'keyword': this.keyword,
          'group': this.group
        }
        let isparams = JSON.stringify(params)
        marketAnalysissave(isparams).then((resp) => {
          this.opearte = ''
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        })
      },
      getAllData () {
        marketAnalysisdata(this.instanceId).then((resp) => {
          // this.processStatus = resp.mkaMain.processStatus
          // this.reqActivityNameByProcessName()
          if (this.processStatus == 3 || this.processStatus == 4 || this.processStatus == 5 || this.processStatus == 6 || this.processStatus == 7 || this.processStatus == 8) {
            this.reportApply = true
          }
          this.keyword = resp.keyword
          this.infoId = resp.infoId
          this.uploadurlfirst = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=mka_first_attachment&infoId=' + this.infoId + '&fileName=' + ''
          this.reportNumber = resp.mkaMain.reportNo
          this.letterstyle1 = resp.mkaMain.letterType.split(' ')[0]
          this.letterstyle2 = resp.mkaMain.letterType.split(' ')[1]
          this.reportContent = resp.mkaMain.reportContent
          this.auditoption = resp.mkaMain.comment
          if (this.processStatus != 0) {
            this.createPerson = resp.mkaMain.createPerson
            this.createDate = resp.mkaMain.extend2
            this.department = resp.mkaMain.createDepartment
          }
          if (this.processStatus == 2 || this.processStatus == 3 || this.processStatus == 4 || this.processStatus == 5 || this.processStatus == 6 || this.processStatus == 7 || this.processStatus == 8) {
            this.draftPerson = resp.mkaMain.drafter
            this.draftDate = resp.mkaMain.draftDate
          }
          if (this.processStatus == 3 || this.processStatus == 4 || this.processStatus == 5 || this.processStatus == 6 || this.processStatus == 7 || this.processStatus == 8) {
            this.reviewPerson = resp.mkaMain.recheckPerson
            this.reviewDate = resp.mkaMain.recheckDate
          }
          if (this.processStatus == 8) {
            this.sendPerson = resp.mkaMain.sendPerson
            this.sendDate = resp.mkaMain.sendDate
          }

          if (this.handelstatus == 2) {
            if (this.processStatus == 0) {
              this.createPerson = this.gfnGetRealName()
              this.createDate = moment().format('YYYY-MM-DD')
            }
            if (this.processStatus == 1) {
              this.draftPerson = this.gfnGetRealName()
              this.draftDate = moment().format('YYYY-MM-DD')
            }
            if (this.processStatus == 2) {
              this.reviewPerson = this.gfnGetRealName()
              this.reviewDate = moment().format('YYYY-MM-DD')
            }
            if (this.processStatus == 7) {
              this.sendPerson = this.gfnGetRealName()
              this.sendDate = moment().format('YYYY-MM-DD')
            }
          }
          this.getFileList()
        })
      },
      // dispalySelectPerson(){
      //   this.selectPerson=true
      // },
      confirmCommitInfo (selectPerson) {
        let params = {
          'mkaMain': {
            'infoId': this.infoId,
            'reportNo': this.reportNumber,
            'letterType': this.letterstyle1 + ' ' + this.letterstyle2,
            'reportContent': this.reportContent,
            'createPerson': this.createPerson,
            'extend2': this.createDate,
            'createDepartment': this.department,
            'drafter': this.draftPerson,
            'draftDate': this.draftDate,
            'recheckPerson': this.reviewPerson,
            'recheckDate': this.reviewDate,
            'sendPerson': this.sendPerson,
            'sendDate': this.sendDate,
            'processStatus': this.processStatus,
            'comment': this.auditoption
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId || '0',
          'toWhom': selectPerson || '',
          'approve': this.approveFlag,
          'operate': this.opearte,
          'group': this.group,
          'keyword': this.keyword,
          'sendToLeader': this.sendToLeader
        }
        let isparams = JSON.stringify(params)
        if (this.taskId) {
          if (this.taskId === '0') { // 草稿
            this.lanchByUserRole(isparams)
          } else { // 提交
            marketAnalysisexamine(isparams).then(() => {
              this.goBack()
            })
          }
        } else { // 新建
          this.lanchByUserRole(isparams)
        }
      },
      lanchByUserRole (params) {
        if (this.userRole) {
          marketAnalysisleaderform(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          marketAnalysisgrouperform(params).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
      },
      submitfrom (flag) {
        if (flag && flag === '驳回') {
          this.$confirm('确定驳回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.approveFlag = 'false'
            this.confirmCommitInfo()
          }).catch(() => {})
          return
        }
        if (!this.reportContent) {
          this.nullreportContent = true
          return
        }
        if (this.processStatus == 4) {
          this.dialogFormVisble = true
          return
        }
        let selectPersonDialogShow = [0, 1, 3, 6] // [0, 1, 2, 3, 6]
        if (selectPersonDialogShow.indexOf(Number(this.processStatus)) > -1) {
          this.selectData.dialogFormVisble = true
        } else {
          this.$confirm('确定提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.confirmCommitInfo()
          }).catch(() => {})
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
        marketAnalysishistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.historydata = resp.value
          if (this.historydata.length != 0) {
            this.displaytable = true
          }
        })
      },
      getFileList () {
        getfilelist(this.infoId).then((resp) => {
          let fileList1 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'mka_first_attachment') {
              fileList1.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
          })
          this.fileList1 = fileList1
        })
      },
      handlePreview(file) {
        let fileId = ''
        for (let item of this.fileList1) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.downloadFile(fileId, file)
      },
      getbelongGroup () {
        getGroup(this.gfnGetUsername()).then((resp) => {
          this.group = resp.groupName
        })
      },
      borrowCount () {
        this.borrowTime = this.dimensionQueryForm.endDate - this.dimensionQueryForm.beginDate
      }
    }
  }
</script>
<style lang="less">
  .custom-width {
    width: 350px;
  }

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
