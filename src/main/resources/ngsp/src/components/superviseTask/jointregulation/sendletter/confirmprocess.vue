<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card>
      <el-tabs>
        <el-tab-pane label="发函信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>证券代码</span></el-col>
        <el-col :span="8">
          <el-input :disabled="true" v-model="bondcode" placeholder="" size="small" style="width:95%"
                    type="textarea"></el-input>
        </el-col>
        <el-col :span="3" v-if="nullbondcode" class="verfynull">证券代码不能为空!</el-col>
        <el-col :span="3">
          <el-radio disabled v-model="coderadio" label="0" style="margin-top: 8px">无证券代码</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>函件类型</span></el-col>
        <el-col :span="4">
          <el-select disabled filterable v-model="surverletter" placeholder="" size="small" style="width:90%;">
            <el-option
              v-for="item in issurverletter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select disabled filterable v-model="assitletter" placeholder="" size="small" style="width:90%;">
            <el-option
              v-for="item in isassitletter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin: 8px 0 0 60px;"><span>函件编号</span></el-col>
        <el-col :span="8">
          <el-input disabled v-model="letternumber" size="small" style="width: 90%;"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>函件名称</span></el-col>
        <el-col :span="10">
          <el-input disabled v-model="lettername" style="width:76%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>发送对象</span></el-col>
        <el-col :span="4">
          <el-select disabled filterable v-model="sendobject1" placeholder="" size="small" style="width:90%;">
            <el-option
              v-for="item in issendobject1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select disabled filterable v-model="sendobject2" placeholder="" size="small" style="width:90%;">
            <el-option
              v-for="item in issendobject2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>发送方式</el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="checked1">本部门存档</el-checkbox>
        </el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="checked2">传真</el-checkbox>
        </el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="checked3">纸质</el-checkbox>
        </el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="checked4">电话</el-checkbox>
        </el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="checked5">口头通知</el-checkbox>
        </el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="checked6">电子邮件</el-checkbox>
        </el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="checked7">OA</el-checkbox>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>拟稿人</span></el-col>
        <el-col :span="9">
          <span>{{createpeople}}</span>
        </el-col>
        <el-col :span="3"><span style="color:red">*</span><span>完成日期</span></el-col>
        <el-col :span="5">
          <span>{{accomplishtime}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">备注</el-col>
        <el-col :span="18">
          <el-input disabled placeholder="字符限制2000以内" v-bind:maxlength=2000 type="textarea" v-model="remarktext"
                    size="medium" style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>发函附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
          <el-upload
            disabled
            class="upload-demo"
            :file-list="filelist1"
            :action=uploadLetterInfourl
            :on-preview="handelpreview"
            :on-success="getfileID"
            :on-remove="deletefilelist"
            style="display:inline-block"
          >
            <el-button
              disabled
              type="text"
              size="small"
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
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs>
        <el-tab-pane label="您的意见" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">您的意见</el-col>
        <el-col :span="18">
          <el-input placeholder="字符限制200以内" v-bind:maxlength=200 type="textarea" v-model="auditoption" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
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
    <selectPersonComponent :selectData="selectData" @obdSelectPerson="submitfrom" ref="selectPersonComponent"
                           v-if="selectPersonFlag"></selectPersonComponent>
    <div>
      <span>
        <el-button type="primary" @click="goBack"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
      </span>
    </div>
    <div v-for="item in buttondispaly">
      <span>
        <el-button type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="displaySelectPerson">{{item}}</el-button>
      </span>
    </div>
  </div>
</template>
<script>
  import Breadcrumb from '../../../common/Breadcrumb'
  import StockCodeQuery from '../../../common/StockCodeQuery'
  import {
    getsendletterform,
    getsurveybuttonname,
    postreviewletterprocessform,
    getsendletterhistoryopiniondata,
    getfilelist,
    ispermitload,
    deletefile,
    getActivityNameByProcessName
  } from '../../../../service/superviseTask/index.js'
  import { add0, dateformat, timeformat, tabletimeformat } from '../../../../utils/dateTimeFormat.js'
  import selectPersonComponent from '../../superviseTaskComponent/selectPersonComponent'
  import MinxinVue from '../../MixIn'

  export default {
    components: {
      Breadcrumb,
      StockCodeQuery,
      selectPersonComponent
    },
    mixins: [MinxinVue],
    data () {
      return {
        steps: [],
        stepsDescription: [],
        acivityNameArray: [],
        selectData: {
          dialogFormVisble: false,
          activityName: '',
          instanceId: '',
          processName: 'ngsp_uns_send_flow',
          businessData: {},
          userId: ''
        },
        processStatus: 3,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/letterlist',
          label: '联合监管'
        }, {
          router: '',
          label: '联合监管发函表单'
        }],
        selectPersonFlag: false,
        auditoption: '',
        issurverletter: [{
          value: '联合监管',
          label: '联合监管'
        }],
        isassitletter: [{
          value: '联合监管发函',
          label: '联合监管发函'
        }],
        issendobject1: [{
          value: '本所',
          label: '本所'
        }],
        issendobject2: [{
          value: '上市公司监管一部',
          label: '上市公司监管一部'
        }],
        filelist: [],
        serialnum: '123456',
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        processinfo6: '',
        nullbondcode: '',
        bondcode: '',
        coderadio: '',
        surverletter: '本所',
        assitletter: '上市公司监管一部',
        letternumber: '',
        lettername: '',
        sendobject1: '',
        sendobject2: '',
        checked1: '',
        checked2: '',
        checked3: '',
        checked4: '',
        checked5: '',
        checked6: '',
        checked7: '',
        createpeople: '',
        accomplishtime: '',
        remarktext: '',
        buttondispaly: [],
        sendsecurityId: '',
        sendstockName: '',
        deailcasedata: [],
        alarmId: '',
        filelist1: [],
        handelstatus: '',
        uploadLetterInfourl: '',
        showUploadButton: true,
        fileNameList1: []
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        this.taskId = taskId
        this.instanceId = instanceId
        this.handelstatus = operate
        if (operate == '1') {
        } else {
          this.getbutton()
        }
        this.getAllData()
        this.gethistoryform()
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
      displaySelectPerson () {
        if (this.checked1) {
          this.submitfrom()
          return
        }
        this.selectPersonFlag = true
        this.selectData.dialogFormVisble = true
        this.selectData.activityName = '发函'
        this.selectData.instanceId = ''
        this.selectData.processName = 'ngsp_uns_send_flow'
        this.selectData.businessData = {}
      },
      submitfrom (person) {
        let toWhom = ''
        if (this.checked1 == false) {
          toWhom = person || ''
        }

        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let analyseResult = ''
        let ismesureradio = ''
        let sentWay = []
        if (this.checked1 == true) {
          sentWay.push('0')
        }
        if (this.checked2 == true) {
          sentWay.push('1')
        }
        if (this.checked3 == true) {
          sentWay.push('2')
        }
        if (this.checked4 == true) {
          sentWay.push('3')
        }
        if (this.checked5 == true) {
          sentWay.push('4')
        }
        if (this.checked6 == true) {
          sentWay.push('5')
        }
        if (this.checked7 == true) {
          sentWay.push('6')
        }
        let issentWay = sentWay.join(',')
        let params = {
          'unsSendMain': {
            'infoId': this.infoId,
            'securityId': this.sendsecurityId,
            'stockName': this.sendstockName,
            'letterType1': this.surverletter,
            'letterType2': this.assitletter,
            'letterNo': this.letternumber,
            'letterName': this.lettername,
            'sentDept1': this.sendobject1,
            'sentDept2': this.sendobject2,
            'sentWay': issentWay,
            'processStatus': this.processStatus,
            'drafter': this.createpeople,
            'finishDate': this.accomplishtime,
            'note': this.remarktext,
            'sentAttachId': '',
            'sentPerson': this.sendletterpeople,
            'sentDate': this.sendlettertime,
            'comment': this.auditoption
          },
          'taskId': this.taskId,
          'instanceId': this.instanceId,
          'approve': 'true',
          'toWhom': toWhom,
          'operate': ''
        }
        let isparams = JSON.stringify(params)
        postreviewletterprocessform(isparams).then((resp) => {
          this.goBack()
        })
      },
      gethistoryform () {
        getsendletterhistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.deailcasedata = resp.value
        })
      },
      getbutton () {
        getsurveybuttonname(this.taskId).then((resp) => {
          for (let item of resp.data.approveTypes) {
            this.buttondispaly.push(item.name)
          }
        })
      },
      getAllData () {
        getsendletterform(this.instanceId).then((resp) => {
          this.processStatus = resp.unsSendMain.processStatus
          this.alarmId = resp.unsSendMain.extend1
          this.infoId = resp.infoId
          this.uploadLetterInfourl = '/ngsp/bpm/v1/attachment/upload?fileLoc=uns_send_LetterInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          if (resp.unsSendMain.securityId == '') {
            this.coderadio = '0'
          } else {
            this.sendsecurityId = resp.unsSendMain.securityId
            this.sendstockName = resp.unsSendMain.stockName
            let issecurityId = resp.unsSendMain.securityId.split(',')
            let isstockName = resp.unsSendMain.stockName.split(',')
            let isbondcode = []
            for (let i = 0; i < issecurityId.length; i++) {
              isbondcode[i] = issecurityId[i] + ' ' + isstockName[i]
            }
            this.bondcode = isbondcode.join(';')
          }
          this.auditoption = resp.unsSendMain.comment
          this.surverletter = resp.unsSendMain.letterType1
          this.assitletter = resp.unsSendMain.letterType2
          this.letternumber = resp.unsSendMain.letterNo
          this.lettername = resp.unsSendMain.letterName
          this.sendobject1 = resp.unsSendMain.sentDept1
          this.sendobject2 = resp.unsSendMain.sentDept2
          this.sendobject2 = resp.unsSendMain.sentDept2
          let sentWay = resp.unsSendMain.sentWay
          let issentWay = sentWay.split(',')
          for (let i = 0; i < issentWay.length; i++) {
            switch (issentWay[i]) {
              case '0':
                this.checked1 = true
                break
              case '1':
                this.checked2 = true
                break
              case '2':
                this.checked3 = true
                break
              case '3':
                this.checked4 = true
                break
              case '4':
                this.checked5 = true
                break
              case '5':
                this.checked6 = true
                break
              case '6':
                this.checked7 = true
                break
            }
          }
          this.processStatus = resp.unsSendMain.processStatus
          this.createpeople = resp.unsSendMain.drafter
          this.accomplishtime = resp.unsSendMain.finishDate
          this.remarktext = resp.unsSendMain.note
          this.sendletterpeople = resp.unsSendMain.sentPerson
          this.sendlettertime = resp.unsSendMain.sentDate
          this.getfilelist()
        })
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
      getfilelist () {
        getfilelist(this.infoId).then((resp) => {
          this.filelist1 = []
          this.fileNameList1 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation == 'uns_send_LetterInfo_attachment') {
              this.filelist1.push({'name': item.fileName, 'fileId': item.fileId})
            }
          })
          this.fileNameList1 = this.getFileNameList(this.filelist1, this.fileNameList1)
        })
      },
      deletefilelist (file) {
        if (this.handelstatus == '1') {
          this.getfilelist()
        } else {
          deletefile(file.fileId).then((resp) => {
            this.getfilelist()
          })
        }
      },
      getfileID () {
        this.getfilelist()
      },
      handelpreview (file) {
        let fileId = ''
        for (let item of this.filelist1) {
          if (item.name == file.name) {
            fileId = item.fileId
          }
        }
        if (this.handelstatus == '1') {
          ispermitload(this.instanceId).then((resp) => {
            if (resp == 'true') {
              window.location.href = this.gfnGetDownloadFileUrl(fileId, file.name)
            } else {
              this.$message.error('没有下载权限！')
            }
          })
        } else {
          window.location.href = this.gfnGetDownloadFileUrl(fileId, file.name)
        }
      }
    }
  }
</script>
<style>
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
</style>
