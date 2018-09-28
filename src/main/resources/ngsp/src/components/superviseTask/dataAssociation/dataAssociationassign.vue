<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card>
      <el-tabs>
        <el-tab-pane label="来函信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>来函名称</span></el-col>
        <el-col :span="10">
          <el-input v-bind:maxlength=50 :disabled="editPermission" v-model="name" placeholder="" size="small"
                    style="width:76%" @change="isdisplayaction(name,'1')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullname" class="verfynull" style="margin-left:-9%">来函名称不能为空!</el-col>
        <el-col :span="2"><span style="color:red">*</span><span>来函编号</span></el-col>
        <el-col :span="8">
          <el-input v-bind:maxlength=50 :disabled="editPermission" v-model="number" placeholder="" size="small"
                    style="width:95%" @change="isdisplayaction(number,'2')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullnumber" class="verfynull" style="margin-left:-1%">来函编号不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>来函单位</span></el-col>
        <el-col :span="4">
          <el-select :disabled="editPermission" filterable v-model="letterUnit1" placeholder="" size="small"
                     style="width:90%;" @change="changesendobject">
            <el-option
              v-for="item in isletterUnit1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select :disabled="editPermission" filterable v-model="letterUnit2" placeholder="" size="small"
                     style="width:60%;">
            <el-option
              v-for="item in isletterUnit2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2"><span>联系人</span></el-col>
        <el-col :span="8">
          <el-input v-bind:maxlength=50 :disabled="editPermission" v-model="contact" size="small"
                    style="width: 95%;"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>来函日期</span></el-col>
        <el-col :span="10">
          <el-input :disabled="editPermission" v-model="date" style="width:76%" size="small"></el-input>
        </el-col>
        <el-col :span="2"><span style="color:red">*</span><span>来函方式</span></el-col>
        <el-col :span="10">
          <el-select filterable :disabled="editPermission" v-model="way" placeholder="" size="small" style="width:76%;"
                     @change="isRemarktextMustEdit">
            <el-option
              v-for="item in isway"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>来函类别</span></el-col>
        <el-col :span="10">
          <el-input v-bind:maxlength=50 :disabled="editPermission" v-model="style" style="width:76%"
                    size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>证券代码</span></el-col>
        <el-col :span="8">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode" size="small"
                            style="width:95%"></stock-code-query>
        </el-col>
        <el-col :span="3">
          <el-radio :disabled="editPermission" v-model="coderadio" label="0" style="margin-top: 8px"
                    @change="clearstockcode">无证券代码
          </el-radio>
        </el-col>
        <el-col :span="2" v-if="nullstockcode" class="verfynull" style="margin-left:-1%">证券代码不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red" v-if="isflag">*</span>来函说明</el-col>
        <el-col :span="18">
          <el-input :disabled="editPermission" placeholder="字符限制50以内" v-bind:maxlength=50 type="textarea"
                    v-model="remarktext" size="medium" style="width:92.5%" @change="displaytxt"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullremarktext" class="verfynull" style="margin-left:-1%">来函说明不能为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2">来函附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
            <el-upload
              class="upload-demo"
              :file-list="filelist1"
              :action=uploadReturnLetterInfoUrl
              :on-preview="handelpreview"
              :on-success="getfileID"
              :on-remove="deletefilelist"
              style="display:inline-block"
            >
              <el-button
                type="text"
                size="small"
                :disabled="editPermission"
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
        <el-col :span="2" v-if="nullfilelist" class="verfynull" style="margin-left:-60%">来函附件不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <ClueAssoiciateTable :securityProps=commonData.stockCode :infoIdProps="infoId" :propsDisabled="editPermission"></ClueAssoiciateTable>
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
          <el-input :disabled="editPermission" placeholder="字符限制200以内" v-bind:maxlength=200 type="textarea"
                    v-model="auditoption" size="medium" style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row v-if="deailcasedataflag" style="margin-top:20px">
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
      <span v-if="newcreat">
        <el-button @click="saveall" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0">保存</el-button>
      </span>
      <span v-if="newcreat">
        <el-button @click="submitfrom" type="primary" style="float:right;margin:20px 20px 0 0;width:10%">分配</el-button>
      </span>
    </div>
    <selectPersonComponent :selectData="selectData" @obdSelectPerson="confirmCommitInfo" ref="selectPersonComponent"
                           v-if="selectData.dialogFormVisble"></selectPersonComponent>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import StepsCommonComponent from '../superviseTaskComponent/StepsCommonComponent'
  import ClueAssoiciateTable from './components/ClueAssoiciateTable'
  import moment from 'moment'
  import {
    postdataassociationleaderform,
    postdataassociationsaveform,
    getdataassociationhistoryopiniondata,
    postdataassociationdata,
    getInfoId,
    getfilelist,
    ispermitload,
    deletefile,
    getUserRoles,
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
      StepsCommonComponent,
      ClueAssoiciateTable
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
          processName: 'ngsp_dig_flow', // 当前流程名称
          businessData: {}
        }, // 调取分配人dialog接口的入参
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/tablelist',
          label: '数据协查'
        }, {
          router: '',
          label: '数据协查表单'
        }],
        commonData: {
          disabled: false,
          stockCode: [],
          multiple: true,
        },
        filelist1: [],
        handelstatus: '',
        uploadReturnLetterInfoUrl: '',
        codedata: [],
        auditoptiontable: [],
        buttondispaly: [],
        isway: [{
          value: '0',
          label: '电话'
        }, {
          value: '1',
          label: '传真'
        }, {
          value: '2',
          label: '纸质'
        }, {
          value: '3',
          label: '口头通知'
        }, {
          value: '4',
          label: '电子邮件'
        }],
        isletterUnit1: [{
          value: '本所',
          label: '本所'
        }, {
          value: '证监会',
          label: '证监会'
        }, {
          value: '地方证监局',
          label: '地方证监局'
        }, {
          value: '公检法',
          label: '公检法'
        }, {
          value: '其他单位',
          label: '其他单位'
        }, {
          value: '中金所',
          label: '中金所'
        }],
        isletterUnit2: [{
          value: '发行上市部',
          label: '发行上市部'
        }, {
          value: '上市公司监管一部',
          label: '上市公司监管一部'
        }, {
          value: '会员部',
          label: '会员部'
        }, {
          value: '基金业务部',
          label: '基金业务部'
        }, {
          value: '债券业务部',
          label: '债券业务部'
        }, {
          value: '其他部门',
          label: '其他部门'
        }, {
          value: '市场监察部',
          label: '市场监察部'
        }, {
          value: '所领导',
          label: '所领导'
        }, {
          value: '上市公司监察二部',
          label: '上市公司监察二部'
        }, {
          value: '法律部',
          label: '法律部'
        }],
        letterUnit1: '本所',
        letterUnit2: '发行上市部',
        serialnum: '12344',
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        processinfo6: '',
        processinfo7: '',
        processinfo8: '',
        name: '',
        number: '',
        contact: '',
        coderadio: '',
        date: '',
        editPermission: false,
        way: '电子邮件',
        style: '数据协查',
        isflag: false,
        remarktext: '',
        auditoption: '',
        newcreat: true,
        processStatus: '',
        infoId: '',
        taskId: '',
        instanceId: '',
        deailcasedata: [],
        deailcasedataflag: false,
        nullname: false,
        nullnumber: false,
        nullstockcode: false,
        nullfilelist: false,
        nullremarktext: false,
        opearte: '',
        belongRole: ''
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        this.date = moment().format('YYYY-MM-DD')
        // this.geturlparam()
        let opearte = operate
        this.handelstatus = operate
        if (opearte == '-1' || opearte == '-2') {
          this.getInfoId()
          this.getRoles()
          this.opearte = 'new'
        } else {
          this.taskId = taskId
          this.instanceId = instanceId
        }
        if (opearte == '1') {
          this.newcreat = false
          this.editPermission = true
          this.commonData.disabled = true
          this.getAllData()
          this.gethistoryform()
        } else if (opearte == '2') {
          this.newcreat = true
          this.editPermission = false
          this.commonData.disabled = false
          this.getAllData()
          this.gethistoryform()
        } else {
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
          callback()
        })
      },
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
          this.uploadReturnLetterInfoUrl = '/ngsp/bpm/v1/attachment/upload?fileLoc=dig_LetterInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
        })
      },
      isRemarktextMustEdit () {
        this.nullremarktext = false
        this.nullfilelist = false
        if (this.way == '0' || this.way == '3') {
          this.isflag = true
        } else {
          this.isflag = false
        }
      },
      isdisplayaction (value, flag) {
        if (!value) {
          switch (flag) {
            case '1':
              this.nullname = true
              break
            case '2':
              this.nullnumber = true
              break
          }
        } else {
          switch (flag) {
            case '1':
              this.nullname = false
              break
            case '2':
              this.nullnumber = false
              break
          }
        }
      },
      saveall () {
        if (!this.name) {
          this.nullname = true
          return
        }
        if (!this.number) {
          this.nullnumber = true
          return
        }
        if (!this.commonData.stockCode[0] && !this.coderadio) {
          this.nullstockcode = true
          return
        }
        if (this.way == '0' || this.way == '3') {
          if (!this.remarktext) {
            this.nullremarktext = true
            return
          }
        } else {
          // if (this.filelist1.length == 0) {
          //   this.nullfilelist = true
          //   return
          // }
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let letterWayText = ''
        for (let item of this.isway) {
          if (item.value == this.way) {
            letterWayText = item.label
          }
        }
        let security = ''
        if (this.coderadio == '') {
          security = this.commonData.stockCode.join(';')
        } else {
          security = ''
        }
        // let matter=this.matter1+" "+this.matter2
        let params = {
          'digReceive': {
            'infoId': this.infoId,
            'letterName': this.name,
            'letterNo': this.number,
            'fromDept': this.letterUnit1 + ' ' + this.letterUnit2,
            'contackPerson': this.contact,
            'letterDate': this.date,
            'letterWay': this.way,
            'letterWayText': letterWayText,
            'letterType': this.style,
            'security': security,
            'instruction': this.remarktext,
            'attachmentId': '',
            'isTpc': '',
            'infoIdTpc': '',
            'clueTypeBig': '',
            'clueTypeSmall': '',
            'processStatus': this.processStatus,
            'comment': this.auditoption,
            'createType': '1'
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': '',
          'processWay': 'false',
          'operate': this.opearte,
          'approve': 'true'
        }
        let isparams = JSON.stringify(params)
        postdataassociationsaveform(isparams).then((resp) => {
          this.opearte = ''
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        })
      },
      getAllData () {
        postdataassociationdata(this.instanceId).then((resp) => {
          this.processStatus = resp.digReceive.processStatus
          this.infoId = resp.infoId
          this.uploadReturnLetterInfoUrl = '/ngsp/bpm/v1/attachment/upload?fileLoc=dig_LetterInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.name = resp.digReceive.letterName
          this.number = resp.digReceive.letterNo
          this.auditoption = resp.digReceive.comment
          this.letterUnit1 = resp.digReceive.fromDept.split(' ')[0]
          this.changeletterUnit()
          this.letterUnit2 = resp.digReceive.fromDept.split(' ')[1]
          this.contact = resp.digReceive.contackPerson
          this.date = resp.digReceive.letterDate
          this.way = resp.digReceive.letterWay
          if (this.way == '0' || this.way == '3') {
            this.isflag = true
          } else {
            this.isflag = false
          }
          this.style = resp.digReceive.letterType
          // this.matter1=resp.digReceive.matter.split(" ")[0]
          // this.matter2=resp.digReceive.matter.split(" ")[1]
          if (resp.digReceive.security == '') {
            this.commonData.stockCode = ''
            this.coderadio = '0'
          } else {
            this.commonData.stockCode = resp.digReceive.security.split(';')
          }

          this.remarktext = resp.digReceive.instruction
          this.getfilelist()
          this.getRoles()
        })
      },
      getRoles () {
        let username = this.gfnGetUsername()
        getUserRoles(username).then((resp) => {
          this.belongRole = resp[0].rolename
        })
      },
      getfilelist () {
        getfilelist(this.infoId).then((resp) => {
          this.filelist1 = []
          this.fileNameList1 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation == 'dig_LetterInfo_attachment') {
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
        this.nullfilelist = false
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
      },
      submitfrom () {
        if (!this.name) {
          this.nullname = true
          return
        }
        if (!this.number) {
          this.nullnumber = true
          return
        }
        if (!this.commonData.stockCode[0] && !this.coderadio) {
          this.nullstockcode = true
          return
        }
        if (this.way == '0' || this.way == '3') {
          if (!this.remarktext) {
            this.nullremarktext = true
            return
          }
        } else {
          // if (this.filelist1.length == 0) {
          //   this.nullfilelist = true
          //   return
          // }
        }
        if ([0, 1, 2, 3].indexOf(Number(this.processStatus)) > -1) {
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
      confirmCommitInfo(selectPerson) {
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let letterWayText = ''
        for (let item of this.isway) {
          if (item.value == this.way) {
            letterWayText = item.label
          }
        }
        let security = ''
        if (this.coderadio == '') {
          security = this.commonData.stockCode.join(';')
        } else {
          security = ''
        }
        // let matter=this.matter1+" "+this.matter2
        let params = {
          'digReceive': {
            'infoId': this.infoId,
            'letterName': this.name,
            'letterNo': this.number,
            'fromDept': this.letterUnit1 + ' ' + this.letterUnit2,
            'contackPerson': this.contact,
            'letterDate': this.date,
            'letterWay': this.way,
            'letterWayText': letterWayText,
            'letterType': this.style,
            'security': security,
            'instruction': this.remarktext,
            'attachmentId': '',
            'isTpc': '',
            'infoIdTpc': '',
            'clueTypeBig': '',
            'clueTypeSmall': '',
            'processStatus': this.processStatus,
            'comment': this.auditoption,
            'createType': '1'
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'group': this.belongRole,
          'toWhom': selectPerson || '',
          'processWay': 'false',
          'approve': 'true',
          'operate': this.opearte
        }
        let isparams = JSON.stringify(params)
        postdataassociationleaderform(isparams).then((resp) => {
          this.goBack()
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
      gethistoryform () {
        getdataassociationhistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.deailcasedata = resp.value
          if (this.deailcasedata.length == 0 || this.deailcasedata == '无查询结果') {
            this.deailcasedataflag = false
          } else {
            this.deailcasedataflag = true
          }
        })
      },
      changesendobject () {
        this.isletterUnit2 = []
        switch (this.letterUnit1) {
          case '本所':
            this.isletterUnit2.push({
              value: '发行上市部',
              label: '发行上市部'
            }, {
              value: '上市公司监管一部',
              label: '上市公司监管一部'
            }, {
              value: '会员部',
              label: '会员部'
            }, {
              value: '基金业务部',
              label: '基金业务部'
            }, {
              value: '债券业务部',
              label: '债券业务部'
            }, {
              value: '其他部门',
              label: '其他部门'
            }, {
              value: '市场监察部',
              label: '市场监察部'
            }, {
              value: '所领导',
              label: '所领导'
            }, {
              value: '上市公司监察二部',
              label: '上市公司监察二部'
            }, {
              value: '法律部',
              label: '法律部'
            })
            this.letterUnit2 = '发行上市部'
            break
          case '证监会':
            this.isletterUnit2.push({
              value: '稽查局',
              label: '稽查局'
            }, {
              value: '稽查总队',
              label: '稽查总队'
            }, {
              value: '基金部',
              label: '基金部'
            }, {
              value: '其他部门',
              label: '其他部门'
            }, {
              value: '处罚委',
              label: '处罚委'
            }, {
              value: '市场监察部',
              label: '市场监察部'
            })
            this.letterUnit2 = '稽查局'
            break
          case '地方证监局':
            this.isletterUnit2.push({
              value: '北京局',
              label: '北京局'
            }, {
              value: '天津局',
              label: '天津局'
            }, {
              value: '河北局',
              label: '河北局'
            }, {
              value: '山西局',
              label: '山西局'
            }, {
              value: '内蒙古局',
              label: '内蒙古局'
            }, {
              value: '辽宁局',
              label: '辽宁局'
            }, {
              value: '吉林局',
              label: '吉林局'
            }, {
              value: '黑龙江局',
              label: '黑龙江局'
            }, {
              value: '上海局',
              label: '上海局'
            }, {
              value: '江苏局',
              label: '江苏局'
            }, {
              value: '浙江局',
              label: '浙江局'
            }, {
              value: '安徽局',
              label: '安徽局'
            }, {
              value: '福建局',
              label: '福建局'
            }, {
              value: '江西局',
              label: '江西局'
            }, {
              value: '山东局',
              label: '山东局'
            }, {
              value: '河南局',
              label: '河南局'
            }, {
              value: '湖北局',
              label: '湖北局'
            }, {
              value: '湖南局',
              label: '湖南局'
            }, {
              value: '广东局',
              label: '广东局'
            }, {
              value: '广西局',
              label: '广西局'
            }, {
              value: '海南局',
              label: '海南局'
            }, {
              value: '重庆局',
              label: '重庆局'
            }, {
              value: '四川局',
              label: '四川局'
            }, {
              value: '贵州局',
              label: '贵州局'
            }, {
              value: '云南局',
              label: '云南局'
            }, {
              value: '西藏局',
              label: '西藏局'
            }, {
              value: '陕西局',
              label: '陕西局'
            }, {
              value: '甘肃局',
              label: '甘肃局'
            }, {
              value: '青海局',
              label: '青海局'
            }, {
              value: '宁夏局',
              label: '宁夏局'
            }, {
              value: '新疆局',
              label: '新疆局'
            }, {
              value: '深圳局',
              label: '深圳局'
            }, {
              value: '大连局',
              label: '大连局'
            }, {
              value: '宁波局',
              label: '宁波局'
            }, {
              value: '厦门局',
              label: '厦门局'
            }, {
              value: '青岛局',
              label: '青岛局'
            }, {
              value: '沈阳局',
              label: '沈阳局'
            }, {
              value: '深圳专员办',
              label: '深圳专员办'
            }, {
              value: '上海专员办',
              label: '上海专员办'
            })
            this.letterUnit2 = '北京局'
            break
          case '公检法':
            this.isletterUnit2.push({
              value: '福建省公安厅',
              label: '福建省公安厅'
            }, {
              value: '广州市公安局',
              label: '广州市公安局'
            }, {
              value: '辽宁本溪公安',
              label: '辽宁本溪公安'
            }, {
              value: '上海市公安局',
              label: '上海市公安局'
            }, {
              value: '公安部',
              label: '公安部'
            }, {
              value: '北京公安局',
              label: '北京公安局'
            }, {
              value: '山东省公安厅',
              label: '山东省公安厅'
            }, {
              value: '深圳公安',
              label: '深圳公安'
            })
            this.letterUnit2 = '福建省公安厅'
            break
          case '其他单位':
            this.isletterUnit2.push({
              value: '其他单位',
              label: '其他单位'
            })
            this.letterUnit2 = '其他单位'
            break
          case '中金所':
            this.isletterUnit2.push({
              value: '监查部',
              label: '监查部'
            })
            this.letterUnit2 = '监查部'
            break
        }
      },
      // deletefilelist(file){
      //   if(this.handelstatus == "1"){
      //     this.getfilelist()
      //   }else{
      //     deletefile(file.fileId).then((resp) => {
      //       this.getfilelist()
      //     });
      //   }
      // },
      displaytxt () {
        if (this.way == '0' || this.way == '3') {
          if (!this.remarktext) {
            this.nullremarktext = true
          } else {
            this.nullremarktext = false
          }
        }
      },
      clearstockcode () {
        this.commonData.stockCode = []
        this.nullstockcode = false
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.nullstockcode = false
        this.coderadio = ''
      },
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
