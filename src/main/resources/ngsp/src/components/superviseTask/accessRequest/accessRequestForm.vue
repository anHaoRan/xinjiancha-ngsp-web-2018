<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps" :description="stepsDescription"></steps-common-component>
    <el-card style="margin-top: 20px;" v-if="showCard1">
      <div slot="header">
        权限需求
      </div>
      <el-form label-width="100px" style="margin-top: 20px;">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="任务编号：" required>
            <el-input disabled v-model="number" placeholder="" size="small" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="4" :md="12" :sm="24">
          <el-form-item label="创建人：" required>
            <span>{{createPerson}}</span>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="创建时间：" required>
            <span>{{createTime}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="需求描述：" required style="width: 100%">
            <el-input :disabled="disabledCard1"
                      placeholder="字符限制500以内"
                      v-bind:maxlength=500
                      size="mini"
                      type="textarea"
                      v-model="requireDescript"
                      @change="undisplaypoint(requireDescript,'1')"/>
            <span v-if="nulldec" class="verfynull">需求描述为空!</span>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="交付时间：" required>
            <el-date-picker
              v-model="dimensionQueryForm.beginDate"
              type="datetime"
              :disabled="disabledCard1"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder=""
              :picker-options="startpickerOption"
              size="small"
              @change="undisplaypoint(dimensionQueryForm.beginDate,'3')">
            </el-date-picker>
            <span v-if="nullbeginDate" class="verfynull">交付时间为空!</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件：">
            <div v-if="showUploadButton" style="min-width:200px">
              <text-upload
                :uploadName="'file'"
                :showFileList="true"
                :actionUrl="uploadurlfirst"
                :disabled="disabledCard1"
                :uploadOption="uploadOption"
                :limitFileType="defaultLimitFileType"
                :limitFileSize="20"
                :limit="100"
                :propsFileList="fileList"
                @handlePreview="handlePreview"
                @handleRemove="deleteFile"
                @getTxtCon="getFileList"
              ></text-upload>
            </div>
            <div v-else>
            <span v-if="fileList.length > 0">
              <span
                style="display: block;"
                v-for="item in fileList"
                :key="item.fileId">
              {{item.name}}
            </span>
            </span>
              <span v-else>无附件</span>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px;" v-if="showCard2">
      <div slot="header">
        操作说明
      </div>
      <el-form label-width="100px" style="margin-top: 20px;">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="任务编号：" required>
            <el-input
              v-bind:maxlength=50
              :disabled="disabledCard2"
              v-model="opeartenumber"
              placeholder=""
              size="small"
              @change="undisplaypoint(opeartenumber,'10')"/>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="4" :md="12" :sm="24">
          <el-form-item label="操作人：" required>
            <span>{{accomplishPerson}}</span>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="完成时间：" required>
            <span>{{accomplishTime}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="操作描述：" required>
            <el-input
              :disabled="disabledCard2"
              placeholder=""
              v-bind:maxlength=500
              type="textarea"
              v-model="opearteDescript"
              size="medium"
              @change="undisplaypoint(opearteDescript,'4')"/>
            <span v-if="nullresultdec" class="verfynull">操作描述为空!</span>
          </el-form-item>
        </el-col>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="反馈单位：" required>
            <el-input
              :disabled="disabledCard2"
              placeholder=""
              v-bind:maxlength=20
              type="textarea"
              v-model="feedbackUnit"
              size="medium"
              @change="undisplaypoint(feedbackUnit,'5')"/>
            <span v-if="nullfeedbackUnit" class="verfynull">反馈单位为空!</span>
          </el-form-item>
        </el-col>
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="备注：">
            <el-input
              :disabled="disabledCard2"
              placeholder=""
              v-bind:maxlength=200
              type="textarea"
              v-model="note"
              size="medium"/>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px;padding-bottom: 20px;" class="el-card-table">
      <div slot="header">
        审核意见
      </div>
      <el-form label-width="100px" style="margin-top: 20px;margin-left: 20px;" v-if="showCard3">
        <el-col :xl="24" :lg="24" :md="24" :sm="24">
          <el-form-item label="您的意见：">
            <el-input
              :disabled="disabledCard3"
              type="textarea"
              v-model="auditoption"
              placeholder="字符限制200以内"
              v-bind:maxlength=200
              size="medium"/>
          </el-form-item>
        </el-col>
      </el-form>
      <el-table
        v-if="displaytable"
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
    </el-card>
    <span>
        <el-button @click="backlist" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
      </span>
    <span v-if="newcreat&&(processStatus==0||processStatus==1||processStatus==2||processStatus==3)">
        <el-button @click="saveall" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0">保存</el-button>
      </span>
    <span v-if="newcreat==true&&processStatus==0">
        <el-button @click="submitfrom('true')" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">提交</el-button>
    </span>
    <span v-for="item in buttondispaly"
          :key="item"
          v-if="processStatus==1||processStatus==2||processStatus==3||processStatus==4">
        <el-button type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="submitfrom(item)">
          {{item}}
        </el-button>
      </span>
    <select-person-component v-if="selectData.dialogFormVisble"
                             :selectData="selectData"
                             @obdSelectPerson='confirmCommitInfo'></select-person-component>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectPersonComponent from '../superviseTaskComponent/selectPersonComponent'
  import textUpload from '@/components/common/textUpload'
  import StepsCommonComponent from '../superviseTaskComponent/StepsCommonComponent'
  import moment from 'moment'
  import {formAuth} from './formAuth'
  import {
    getInfoId,
    accessRequestlaunch,
    getAccessRequestnnum,
    AccessRequestsave,
    AccessRequestdata,
    getbuttonname,
    AccessRequestexamine,
    AccessRequesthistoryopiniondata,
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
    computed: {
      disabledCard1() {
        return String(this.handelstatus) === '1' || formAuth[this.processStatus]['formCard1']['disabled']
      },
      disabledCard2() {
        return String(this.handelstatus) === '1' || formAuth[this.processStatus]['formCard2']['disabled']
      },
      disabledCard3() {
        return String(this.handelstatus) === '1' || formAuth[this.processStatus]['formCard3']['disabled']
      },
      showCard1() {
        return formAuth[this.processStatus]['formCard1']['show']
      },
      showCard2() {
        return formAuth[this.processStatus]['formCard2']['show']
      },
      showCard3() {
        return formAuth[this.processStatus]['formCard3']['show']
      }
    },
    data () {
      return {
        formAuth,
        steps: [], // 动态流程名称
        stepsDescription: [], // 流程节点描述
        acivityNameArray: [],
        selectData: {
          dialogFormVisble: false,
          activityName: '', // 审核并分配
          instanceId: '',
          processName: 'ngsp_rfp_flow', // 当前流程名称
          businessData: {}
        }, // 调取分配人dialog接口的入参
        approveFlag: 'true',
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/accessRequestTablelist',
          label: '权限申请'
        }, {
          router: '',
          label: '权限申请表单'
        }],
        feedbackUnit: '',
        note: '',
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        fileList: [],
        uploadOption: {
          name: '上传',
          size: 'small',
          type: 'primary'
        },
        number: '',
        createPerson: '',
        createTime: '',
        requireDescript: '',
        accomplishTime: '',
        accomplishPerson: '',
        opearteDescript: '',
        auditoption: '',
        deailcasedata: [],
        newcreat: false,
        opearte: '',
        instanceId: '',
        taskId: '',
        processStatus: 0,
        infoId: '',
        opeartenumber: '',
        buttondispaly: [],
        handelstatus: '',
        uploadurlfirst: '',
        filelist1: [],
        displaytable: false,
        nulldec: false,
        nullbeginDate: false,
        nullresultdec: false,
        nullfeedbackUnit: false,
        nullopeartenumber: false,
        dimensionQueryForm: {
          beginDate: ''
        },
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        uploadFileList: [],
        showUploadButton: true
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.handelstatus = operate
      this.taskId = taskId
      this.instanceId = instanceId
      this.reqActivityNameByProcessName(() => {
        if (this.handelstatus == '1') {
          this.newcreat = false
          this.getAllData()
          this.gethistoryform()
        } else if (this.handelstatus == '2') {
          this.newcreat = true
          this.getAllData()
          this.getbutton()
          this.gethistoryform()
        } else {
          this.getInfoId()
          this.opearte = 'new'
          this.newcreat = true
          this.getnumber()
          this.createPerson = this.gfnGetRealName()
          this.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
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
          callback()
        })
      },
      undisplaypoint (value, flag) {
        if (!value) {
          switch (flag) {
            case '1':
              this.nulldec = true
              break
            case '3':
              this.nullbeginDate = true
              break
            case '4':
              this.nullresultdec = true
              break
            case '5':
              this.nullfeedbackUnit = true
              break
            case '10':
              this.nullopeartenumber = true
              break
          }
        } else {
          switch (flag) {
            case '1':
              this.nulldec = false
              break
            case '3':
              this.nullbeginDate = false
              break
            case '4':
              this.nullresultdec = false
              break
            case '5':
              this.nullfeedbackUnit = false
              break
            case '10':
              this.nullopeartenumber = false
              break
          }
        }
      },
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
          this.uploadurlfirst = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=rfp_first_attachment&infoId=' + this.infoId + '&fileName='
        })
      },
      getnumber () {
        getAccessRequestnnum().then((resp) => {
          this.number = resp
        })
      },
      saveall () {
        if (!this.requireDescript) {
          this.nulldec = true
          return
        }
        if (!this.dimensionQueryForm.beginDate) {
          this.nullbeginDate = true
          return
        }
        if (this.processStatus == 3 || this.processStatus == 4 || this.processStatus == 5) {
          if (!this.opeartenumber) {
            this.nullopeartenumber = true
            return
          }
          if (!this.opearteDescript) {
            this.nullresultdec = true
            return
          }
          if (!this.feedbackUnit) {
            this.nullfeedbackUnit = true
            return
          }
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let params = {
          'rfpMain': {
            'infoId': this.infoId,
            'taskNo': this.number,
            'createPerson': this.createPerson,
            'createTime': this.createTime,
            'needDesc': this.requireDescript,
            'deliverTime': this.dimensionQueryForm.beginDate,
            'taskNoAct': this.opeartenumber,
            'finishTime': this.accomplishTime,
            'operatePerson': this.accomplishPerson,
            'operateDesc': this.opearteDescript,
            'fkDepartment': this.feedbackUnit,
            'note': this.note,
            'createFrom': '',
            'fromInfoId': '',
            'processStatus': this.processStatus,
            'comment': this.auditoption
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': '',
          'approve': true,
          'operate': this.opearte
        }
        let isparams = JSON.stringify(params)
        AccessRequestsave(isparams).then((resp) => {
          this.opearte = ''
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        })
      },
      getAllData () {
        AccessRequestdata(this.instanceId).then((resp) => {
          // this.processStatus = resp.rfpMain.processStatus
          // this.reqActivityNameByProcessName()
          this.infoId = resp.infoId
          this.uploadurlfirst = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=rfp_first_attachment&infoId=' + this.infoId + '&fileName='
          this.number = resp.rfpMain.taskNo
          this.createPerson = resp.rfpMain.createPerson
          this.createTime = resp.rfpMain.createTime
          this.requireDescript = resp.rfpMain.needDesc
          this.dimensionQueryForm.beginDate = resp.rfpMain.deliverTime

          if (!resp.rfpMain.taskNoAct) {
            this.opeartenumber = this.number
          } else {
            this.opeartenumber = resp.rfpMain.taskNoAct
          }
          if (!resp.rfpMain.finishTime) {
            if (this.handelstatus == '2') {
              if (this.processStatus == 3) {
                this.accomplishTime = moment().format('YYYY-MM-DD HH:mm:ss')
              }
            }
          } else {
            this.accomplishTime = resp.rfpMain.finishTime
          }
          if (!resp.rfpMain.finishPerson) {
            if (this.handelstatus == '2') {
              if (this.processStatus == 3) {
                this.accomplishPerson = this.gfnGetRealName()
              }
            }
          } else {
            this.accomplishPerson = resp.rfpMain.finishPerson
          }
          this.opearteDescript = resp.rfpMain.operateDesc
          this.feedbackUnit = resp.rfpMain.fkDepartment
          this.note = resp.rfpMain.note
          this.auditoption = resp.rfpMain.comment
          this.getFileList()
          if (this.handelstatus == '2') {
            switch (this.processStatus) {
              case 1:
                break
              case 2:
                break
              case 3:
                this.accomplishTime = moment().format('YYYY-MM-DD HH:mm:ss')
                this.accomplishPerson = this.gfnGetRealName()
                break
              case 4:
                break
              case 5:
                break
            }
          }
        })
      },
      confirmCommitInfo (selectPerson) {
        let params = {
          'rfpMain': {
            'infoId': this.infoId,
            'taskNo': this.number,
            'createPerson': this.createPerson,
            'createTime': this.createTime,
            'needDesc': this.requireDescript,
            'deliverTime': this.dimensionQueryForm.beginDate,
            'taskNoAct': this.opeartenumber,
            'finishTime': this.accomplishTime,
            'operatePerson': this.accomplishPerson,
            'operateDesc': this.opearteDescript,
            'fkDepartment': this.feedbackUnit,
            'note': this.note,
            'createFrom': '',
            'fromInfoId': '',
            'processStatus': this.processStatus,
            'comment': this.auditoption
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': selectPerson || '',
          'approve': this.approveFlag,
          'operate': this.opearte
        }
        if (Number(this.processStatus) === 0) {
          accessRequestlaunch(JSON.stringify(params)).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          AccessRequestexamine(JSON.stringify(params)).then((resp) => {
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
        if (!this.requireDescript) {
          this.nulldec = true
          return
        }
        if (!this.dimensionQueryForm.beginDate) {
          this.nullbeginDate = true
          return
        }
        if (this.processStatus == 3 || this.processStatus == 4 || this.processStatus == 5) {
          if (!this.opeartenumber) {
            this.nullopeartenumber = true
            return
          }
          if (!this.opearteDescript) {
            this.nullresultdec = true
            return
          }
          if (!this.feedbackUnit) {
            this.nullfeedbackUnit = true
            return
          }
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        if ([0, 2].indexOf(Number(this.processStatus)) > -1) { // [0, 1, 2]
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
        let request = {}
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
        AccessRequesthistoryopiniondata(this.instanceId).then((resp) => {
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
          let fileList = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'rfp_first_attachment') {
              fileList.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
          })
          this.fileList = fileList
        })
      },
      handlePreview(file) {
        let fileId = ''
        for (let item of this.fileList) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.downloadFile(fileId, file)
      },
      backlist () {
        this.$router.go(-1)
      },
      displayStockCode () {
        if (this.lyrictype == '0') {
          this.StockCode = true
        } else {
          this.StockCode = false
        }
      },
      nullstockcode () {
        this.commonData.stockCode = []
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        if (this.commonData.stockCode != []) {
          this.nullstockcode = false
          this.coderadio = ''
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .el-textarea {
    width: 60%;
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
