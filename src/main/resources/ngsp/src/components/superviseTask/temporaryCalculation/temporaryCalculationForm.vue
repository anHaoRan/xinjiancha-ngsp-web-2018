<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card>
      <el-tabs>
        <el-tab-pane label="计算需求" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>任务编号</span></el-col>
        <el-col :span="8">
          <el-input disabled v-model="number" placeholder="" size="small" style="width:59%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span><span style="color:red">*</span>创建人</span></el-col>
        <el-col :span="8">
          <span>{{createPerson}}</span>
        </el-col>
        <el-col :span="2"><span><span style="color:red">*</span>创建时间</span></el-col>
        <el-col :span="8">
          <span>{{createTime}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>需求描述</el-col>
        <el-col :span="19">
          <el-input :disabled="firstPermission" placeholder="" v-bind:maxlength=500 type="textarea"
                    v-model="requireDescript" size="medium" style="width:77%"
                    @change="undisplaypoint(requireDescript,'1')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nulldec" class="verfynull">需求描述为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">验收标准</el-col>
        <el-col :span="19">
          <el-input :disabled="firstPermission" placeholder="" v-bind:maxlength=500 type="textarea"
                    v-model="acceptanceStandard" size="medium" style="width:77%"
                    @change="undisplaypoint(acceptanceStandard,'2')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullstandard" class="verfynull">验收标准为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2" style="margin-top:8px"><span style="color:red">*</span>交付时间</el-col>
        <el-col :span="9">
          <el-date-picker
            v-model="dimensionQueryForm.beginDate"
            type="datetime"
            :disabled="firstPermission"
            placeholder=""
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="12:00:00"
            :picker-options="startpickerOption"
            size="small"
            @change="undisplaypoint(dimensionQueryForm.beginDate,'3')"
            style="width:33%">
          </el-date-picker>
        </el-col>
        <el-col :span="2" v-if="nullbeginDate" class="verfynull">交付时间为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span>搜索关键字</span></el-col>
        <el-col :span="22">
          <el-input class="custom-width" :disabled="firstPermission" v-model="keyword" size="small" :maxlength="50" placeholder="输入内容在50字以内"></el-input>
          注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
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
              :disabled="firstPermission"
              :uploadOption="uploadOption"
              :limitFileType="defaultLimitFileType"
              :limitFileSize="20"
              :limit="100"
              :propsFileList="fileList1"
              @handlePreview="handlePreview1"
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
     <!--     <div v-if="showUploadButton">
          <el-upload
            class="upload-demo"
            :disabled="firstPermission"
            :action=uploadurlfirst
            :on-preview="handelpreview"
            :on-remove="deletefilelist"
            :file-list="filelist1"
            :on-success="getfileID"
            style="display:inline-block"
          >
            <el-button
              type="text"
              size="small"
              :disabled="firstPermission"
              style="display:inline"
            >上传
            </el-button>
          </el-upload>
          </div>
          <div v-else>
            <span
              style="display: block;"
              v-for="item in fileNameList1"
              :key="item">
              {{item}}
            </span>
          </div>-->
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="processStatus==2||processStatus==3||processStatus==4||processStatus==5">
      <el-tabs>
        <el-tab-pane label="计算结果" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;" v-if="processStatus==2||processStatus==3||processStatus==4||processStatus==5">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span><span style="color:red">*</span>完成日期</span></el-col>
        <el-col :span="5">
          <span>{{accomplishTime}}</span>
        </el-col>
        <el-col :span="2"><span><span style="color:red">*</span>完成人</span></el-col>
        <el-col :span="5">
          <span>{{accomplishPerson}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>计算结果说明</el-col>
        <el-col :span="18">
          <el-input :disabled="secondPermission" placeholder="" v-bind:maxlength=500 type="textarea"
                    v-model="resultDescript" size="medium" style="width:77%"
                    @change="undisplaypoint(resultDescript,'4')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullresultdec" class="verfynull">计算结果说明为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2">附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton" style="min-width:200px">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadurlsecond"
              :disabled="secondPermission"
              :uploadOption="uploadOption"
              :limitFileType="defaultLimitFileType"
              :noLimitFileSize="true"
              :limit="100"
              :propsFileList="fileList2"
              @handlePreview="handlePreview2"
              @handleRemove="deleteFile"
              @getTxtCon="getFileList"
            ></text-upload>
          </div>
          <div v-else>
            <span v-if="fileList2.length > 0">
              <span
                style="display: block;"
                v-for="item in fileList2"
                :key="item.fileId">
              {{item.name}}
              </span>
            </span>
            <span v-else>无附件</span>
          </div>
          <!--<div v-if="showUploadButton">
          <el-upload
            class="upload-demo"
            :action=uploadurlsecond
            :disabled="secondPermission"
            :on-preview="handelpreview"
            :file-list="filelist2"
            :on-remove="deletefilelist"
            :on-success="getfileID"
            @change="undisplaypoint(resultDescript,'5')"
            style="display:inline-block"
          >
            <el-button
              type="text"
              size="small"
              :disabled="secondPermission"
              style="display:inline"
            >上传
            </el-button>
          </el-upload>
          </div>
          <div v-else>
            <span
              style="display: block;"
              v-for="item in fileNameList2"
              :key="item">
              {{item}}
            </span>
          </div>-->
        </el-col>
        <!--<el-col :span="2" v-if="nullfile2" class="verfynull" style="z-index:10000;margin-left: -65%;">附件为空!</el-col>-->
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
          <el-input :disabled="thirdPermission" type="textarea" v-model="auditoption" placeholder="字符限制200以内"
                    v-bind:maxlength=200 size="medium" style="width:77%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px" v-if="displaytable==true">
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
    <div>
      <span>
        <el-button @click="goBack" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
      </span>
      <span v-if="newcreat&&(processStatus==0||processStatus==1||processStatus==2||processStatus==3)">
        <el-button @click="saveall" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0">保存</el-button>
      </span>
      <span v-if="newcreat==true&&processStatus==0">
        <el-button @click="submitForm" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">提交</el-button>
      </span>
    </div>
    <div v-for="item in buttondispaly" v-if="processStatus==1||processStatus==2||processStatus==3||processStatus==4">
      <span>
        <el-button type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="submitForm(item)">{{item}}</el-button>
      </span>
    </div>
    <select-person-component v-if="selectData.dialogFormVisble"
                                 :selectData="selectData"
                                 @obdSelectPerson='confirmCommitInfo'></select-person-component>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectPersonComponent from '../superviseTaskComponent/selectPersonComponent'
  import StepsCommonComponent from '../superviseTaskComponent/StepsCommonComponent'
  import textUpload from '@/components/common/textUpload'
  import moment from 'moment'
  import {
    getInfoId,
    getUserRoles,
    temporaryCalculationlaunch,
    gettemporaryCalculationnum,
    temporaryCalculationsave,
    temporaryCalculationdata,
    getbuttonname,
    temporaryCalculationexamine,
    temporaryCalculationhistoryopiniondata,
    getfilelist,
    ispermitload,
    deletefile,
    getActivityNameByProcessName
  } from '../../../service/superviseTask/index.js'
  import {
    add0,
    dateformat,
    timeformat,
    tabletimeformat
  } from '../../../utils/dateTimeFormat.js'
  import MinxinVue from '../MixIn'
  import MixinAuthority from '../MixinAuthority'

  export default {
    components: {
      Breadcrumb,
      StockCodeQuery,
      selectPersonComponent,
      StepsCommonComponent,
      textUpload
    },
    mixins: [MinxinVue, MixinAuthority],
    data () {
      return {
        steps: [],
        stepsDescription: [],
        acivityNameArray: [],
        selectData: {
          dialogFormVisble: false,
          activityName: '', // 审核并分配
          instanceId: '',
          processName: 'ngsp_tc_flow', // 当前流程名称
          businessData: {}
        }, // 调取分配人dialog接口的入参
        approveFlag: 'true',
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/temporaryCalculationTablelist',
          label: '临时计算'
        }, {
          router: '',
          label: '临时计算表单'
        }],
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        keyword: '', // 关键字
        number: '',
        createPerson: '',
        createTime: '',
        requireDescript: '',
        acceptanceStandard: '',
        accomplishTime: '',
        accomplishPerson: '',
        resultDescript: '',
        auditoption: '',
        deailcasedata: [],
        newcreat: false,
        opearte: '',
        instanceId: '',
        taskId: '',
        processStatus: '0',
        infoId: '',
        buttondispaly: [],
        firstPermission: true,
        secondPermission: true,
        displaytable: false,
        thirdPermission: true,
        handelstatus: '',
        uploadurlfirst: '',
        uploadurlsecond: '',
        filelist1: [],
        filelist2: [],
        nulldec: false,
        nullstandard: false,
        nullbeginDate: false,
        nullresultdec: false,
        // nullfile2: false,
        dimensionQueryForm: {
          beginDate: ''
        },
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        fileList1: [],
        fileList2: [],
        uploadOption: {
          name: '上传',
          size: 'small',
          type: 'primary'
        }
      }
    },
    mounted () {
      this.reqActivityNameByProcessName(() => {
        const {operate, taskId, instanceId, processStatus} = this.$route.query
        if (processStatus) {
          this.processStatus = processStatus
        }
        this.handelstatus = operate
        this.taskId = taskId
        this.instanceId = instanceId
        if (this.handelstatus == '1') {
          this.newcreat = false
          this.firstPermission = true
          this.secondPermission = true
          this.thirdPermission = true
          this.getAllData()
          this.gethistoryform()
        } else if (this.handelstatus == '2') {
          this.newcreat = true
          this.firstPermission = false
          this.secondPermission = false
          this.thirdPermission = false
          this.getAllData()
          this.getbutton()
          this.gethistoryform()
        } else {
          this.getInfoId()
          this.opearte = 'new'
          this.getPerformerList()
          this.newcreat = true
          this.createPerson = this.gfnGetRealName()
          this.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
          this.firstPermission = false
          this.secondPermission = false
          this.thirdPermission = false
        }
      })
    },
    methods: {
      reqActivityNameByProcessName(callback) {
        getActivityNameByProcessName(this.selectData.processName).then(res => {
          this.steps = res['localStatusName']
          this.acivityNameArray = res['activityName']
          this.selectData.activityName = res['activityName'][+this.processStatus + 1]
          this.selectData.businessData = res['businessData']
          callback && callback()
        })
      },
      undisplaypoint (value, flag) {
        if (!value) {
          switch (flag) {
            case '1':
              this.nulldec = true
              break
            case '2':
              this.nullstandard = true
              break
            case '3':
              this.nullbeginDate = true
              break
            case '4':
              this.nullresultdec = true
              break
            case '5':
              // this.nullfile2 = true
              break
          }
        } else {
          switch (flag) {
            case '1':
              this.nulldec = false
              break
            case '2':
              this.nullstandard = false
              break
            case '3':
              this.nullbeginDate = false
              break
            case '4':
              this.nullresultdec = false
              break
            case '5':
              // this.nullfile2 = false
              break
          }
        }
      },
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
          this.uploadurlfirst = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=tpc_first_attachment&infoId=' + this.infoId + '&fileName='
          this.uploadurlsecond = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=tpc_second_attachment&infoId=' + this.infoId + '&fileName='
        })
      },
      getnumber () {
        gettemporaryCalculationnum(this.role).then((resp) => {
          this.number = resp
        })
      },
      getPerformerList () {
        let username = this.gfnGetUsername()
        getUserRoles(username).then((resp) => {
          this.role = resp[0].rolename
          let roleid = ''
          for (let i = 0; i < resp.length; i++) {
            if (resp[i].roleid.indexOf('GROUP') > 0) {
              roleid = resp[i].roleid
            }
          }
          if (this.number == '') {
            this.getnumber()
          }
        })
      },
      saveall () {
        if (!this.requireDescript) {
          this.nulldec = true
          return
        }
        // if(!this.acceptanceStandard){
        //   this.nullstandard=true
        //   return
        // }
        if (!this.dimensionQueryForm.beginDate) {
          this.nullbeginDate = true
          return
        }
        if (this.processStatus == 2 || this.processStatus == 3 || this.processStatus == 4) {
          if (!this.resultDescript) {
            this.nullresultdec = true
            return
          }
          // if (this.filelist2.length == 0) {
          //   this.nullfile2 = true
          //   return
          // }
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let params = {
          'tpcMain': {
            'infoId': this.infoId,
            'taskNo': this.number,
            'founder': this.createPerson,
            'startTime': this.createTime,
            'needDesc': this.requireDescript,
            'checkStandard': this.acceptanceStandard,
            'deliverTime': this.dimensionQueryForm.beginDate,
            'finishDate': this.accomplishTime,
            'finishPerson': this.accomplishPerson,
            'resultInstrution': this.resultDescript,
            'createFrom': '',
            'fromInfoId': '',
            'processStatus': this.processStatus,
            'comment': this.auditoption
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': '',
          'approve': true,
          'keyword': this.keyword,
          'operate': this.opearte // 是否保存过一次，没有保存过为'new', 否则为''
        }
        let isparams = JSON.stringify(params)
        temporaryCalculationsave(isparams).then(() => {
          this.opearte = ''
          this.$message.success('保存成功')
        })
      },
      getAllData () {
        temporaryCalculationdata(this.instanceId).then((resp) => {
          this.processStatus = resp.tpcMain.processStatus
          // this.reqActivityNameByProcessName()
          this.keyword = resp.keyword
          this.infoId = resp.infoId
          this.uploadurlfirst = '/ngsp/bpm/v1/attachment/upload?fileLoc=tpc_first_attachment&infoId=' + this.infoId + '&fileName=' + ''
          this.uploadurlsecond = '/ngsp/bpm/v1/attachment/upload?fileLoc=tpc_second_attachment&infoId=' + this.infoId + '&fileName=' + ''
          this.number = resp.tpcMain.taskNo
          this.createPerson = resp.tpcMain.founder
          this.createTime = resp.tpcMain.startTime
          this.requireDescript = resp.tpcMain.needDesc
          this.auditoption = resp.tpcMain.comment
          this.acceptanceStandard = resp.tpcMain.checkStandard
          this.dimensionQueryForm.beginDate = resp.tpcMain.deliverTime

          this.accomplishTime = resp.tpcMain.finishDate
          this.accomplishPerson = resp.tpcMain.finishPerson
          this.resultDescript = resp.tpcMain.resultInstrution
          this.getFileList()
          if (this.handelstatus == '2') {
            switch (this.processStatus) {
              case 1:
                this.firstPermission = true
                this.thirdPermission = false
                break
              case 2:
                this.firstPermission = true
                this.thirdPermission = false
                this.secondPermission = false
                this.accomplishTime = resp.tpcMain.deliverTime.split(' ')[0]
                this.accomplishPerson = this.gfnGetRealName()
                break
              case 3:
                this.firstPermission = true
                this.thirdPermission = false
                this.secondPermission = false
                break
              case 4:
                this.firstPermission = true
                this.secondPermission = true
                this.thirdPermission = false
                break
              case 5:
                this.firstPermission = true
                this.thirdPermission = false
                break
            }
          }
        })
      },
      confirmCommitInfo(selectPerson) {
        let params = {
          'tpcMain': {
            'infoId': this.infoId,
            'taskNo': this.number,
            'founder': this.createPerson,
            'startTime': this.createTime,
            'needDesc': this.requireDescript,
            'checkStandard': this.acceptanceStandard,
            'deliverTime': this.dimensionQueryForm.beginDate,
            'finishDate': this.accomplishTime,
            'finishPerson': this.accomplishPerson,
            'resultInstrution': this.resultDescript,
            'createFrom': '',
            'fromInfoId': '',
            'processStatus': this.processStatus,
            'comment': this.auditoption
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': selectPerson || '',
          'approve': this.approveFlag,
          'keyword': this.keyword,
          'operate': this.opearte
        }
        let isparams = JSON.stringify(params)
        if (this.processStatus == 0) {
          temporaryCalculationlaunch(isparams).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          temporaryCalculationexamine(isparams).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
      },
      submitForm (flag) {
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
        if (!this.requireDescript) {
          this.nulldec = true
          return
        }
        // if(!this.acceptanceStandard){
        //   this.nullstandard=true
        //   return
        // }
        if (!this.dimensionQueryForm.beginDate) {
          this.nullbeginDate = true
          return
        }
        if (this.processStatus == 2 || this.processStatus == 3 || this.processStatus == 4) {
          if (!this.resultDescript) {
            this.nullresultdec = true
            return
          }
          // if (this.filelist2.length == 0) {
          //   this.nullfile2 = true
          //   return
          // }
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        if ([0, 1, 2].indexOf(Number(this.processStatus)) > -1) {
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
            if (item.name == '退回发起人' || item.name == '退回上一步') {
              item.name = '驳回'
            }
            this.buttondispaly.push(item.name)
          }
        })
      },
      gethistoryform () {
        temporaryCalculationhistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.deailcasedata = resp.value
          if (this.deailcasedata.length != 0) {
            this.displaytable = true
          }
        })
      },
      getFileList () {
        getfilelist(this.infoId).then((resp) => {
          let fileList1 = []
          let fileList2 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'tpc_first_attachment') {
              fileList1.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
            if (item.fileLocation === 'tpc_second_attachment') {
              fileList2.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
          })
          this.fileList1 = fileList1
          this.fileList2 = fileList2
        })
      },
      handlePreview1(file) {
        let fileId = ''
        for (let item of this.fileList1) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.downloadFile(fileId, file)
      },
      handlePreview2(file) {
        let fileId = ''
        for (let item of this.fileList2) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.downloadFile(fileId, file)
      }
    }
  }
</script>
<style lang="less">
  .custom-width {
    width: 350px;
  }
  .head {
    width: 20%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    /*margin: 4% 0 -2% 0;*/
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

  .verfynull {
    margin-left: -13%;
    margin-top: 7px;
    color: red;
  }
</style>
