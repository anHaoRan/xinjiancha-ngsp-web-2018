<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps" :description="stepsDescription"></steps-common-component>
    <el-card style="margin-top: 20px;" v-if="showCard1">
      <div slot="header">
        开发需求
      </div>
      <el-form label-width="100px" style="margin-top: 20px;" ref="formRef1" :rules="rules1" :model="form1">
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="任务编号：" required>
            <el-input disabled v-model="number" placeholder="" size="small"></el-input>
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
          <el-form-item label="需求描述：" prop="requireDescript">
            <el-input
              :disabled="disabledCard1"
              placeholder="字符限制500以内"
              v-bind:maxlength=500
              type="textarea"
              v-model="form1.requireDescript"
              size="medium"
              style="width:77%"></el-input>
            <!--<span v-if="nulldec" class="verfynull">需求描述为空!</span>-->
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="验收标准：" prop="checkStandard">
            <el-input
              :disabled="disabledCard1"
              placeholder="字符限制500以内"
              v-bind:maxlength=500 type="textarea"
              v-model="form1.checkStandard"
              size="medium"
              style="width:77%">
            </el-input>
            <!--<span v-if="nullcheckStandard" class="verfynull">验收标准为空!</span>-->
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="交付时间：" prop="beginDate">
            <el-date-picker
              v-model="form1.beginDate"
              type="datetime"
              :disabled="disabledCard1"
              placeholder=""
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="12:00:00"
              :picker-options="startpickerOption"
              size="small">
            </el-date-picker>
            <!--<span v-if="nullbeginDate" class="verfynull">交付时间为空!</span>-->
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
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px;" v-if="showCard2">
      <div slot="header">
        执行反馈
      </div>
      <el-form label-width="100px" ref="formRef2" :rules="rules2" :model="form2">
        <el-col :xl="10" :lg="10" :md="12" :sm="24">
          <el-form-item label="任务编号：" prop="opeartenumber">
            <el-input
              v-bind:maxlength=50
              :disabled="disabledCard2"
              v-model="form2.opeartenumber"
              placeholder=""
              size="small"
              style="width:60%"></el-input>
          </el-form-item>
          <!--<span v-if="nullopeartenumber" class="verfynull">任务编号为空!</span>-->
        </el-col>
        <el-col :xl="10" :lg="10" :md="12" :sm="24">
          <el-form-item label="任务名称：" prop="opearteDescript">
            <el-input
              v-bind:maxlength=50
              :disabled="disabledCard2"
              placeholder=""
              v-model="form2.opearteDescript"
              size="small"
              style="width:60%"></el-input>
            <!--<span v-if="nullresultdec" class="verfynull">任务名称为空!</span>-->
          </el-form-item>
        </el-col>
        <el-col :xl="10" :lg="10" :md="12" :sm="24">
          <el-form-item label="开发人：" required>
            <span>{{accomplishPerson}}</span>
          </el-form-item>
        </el-col>
        <el-col :xl="10" :lg="10" :md="12" :sm="24">
          <el-form-item label="完成日期：" required>
            <span>{{accomplishTime}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="反馈对象：" required>
            <el-select :disabled="disabledCard2" filterable v-model="sendobject1" placeholder="" size="small"
                       style="display: inline-block;" @change="changesendobject">
              <el-option
                v-for="item in issendobject1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select :disabled="disabledCard2" filterable v-model="sendobject2" placeholder="" size="small"
                       style="display: inline-block;">
              <el-option
                v-for="item in issendobject2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="反馈说明：">
            <div v-if="showUploadButton" style="min-width:200px">
              <text-upload
                :uploadName="'file'"
                :showFileList="true"
                :actionUrl="uploadurlsecond"
                :disabled="disabledCard2"
                :uploadOption="uploadOption"
                :limitFileType="defaultLimitFileType"
                :limitFileSize="20"
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
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <suggestion-textarea-component
      :show="showCard3"
      :disabled="disabledCard3"
      ref='formRef3'
      :maxLength="200"
      :steps="steps"
      :propsComment="suggestionForm"
      :suggestionColumns="suggestionColumns"
      @updateStepsDescription="updateStepsDescription"
      @handleInputSuggestion="handleInputSuggestion"></suggestion-textarea-component>
      <!--<margin-table
        style="margin-top:10px;"
        v-if="displaytable"
        :height="260"
        :isPageination="false"
        :columns="suggestionColumns"
        :data="{
          data: suggestionTableData
        }"
      >
        <el-table-column
          slot="tableColumnsUnshift"
          type="index"
          width="50"
          label="序号">
        </el-table-column>
      </margin-table>-->
    <span>
        <el-button @click="goBack" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0 0 0">返回</el-button>
      </span>
    <span v-if="newcreat&&(processStatus==0||processStatus==1||processStatus==2||processStatus==3)">
        <el-button @click="saveall" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0">保存</el-button>
      </span>
    <span v-if="newcreat&&processStatus==0">
        <el-button @click="submitform()" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">提交</el-button>
      </span>
    <span v-for="item in buttondispaly" :key="item"
          v-if="processStatus==1||processStatus==2||processStatus==3||processStatus==4">
        <el-button type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="submitform(item)">{{item}}</el-button>
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
  import SuggestionTextareaComponent from '../superviseTaskComponent/SuggestionTextareaComponent'
  import MarginTable from '@/components/base/MarginTable'
  import textUpload from '@/components/common/textUpload'
  import moment from 'moment'
  import {formAuth} from './formAuth'
  import {
    getInfoId,
    demandManagementlaunch,
    demandManagementnnum,
    demandManagementsave,
    demandManagementdata,
    getbuttonname,
    demandManagementexamine,
    demandManagementhistoryopiniondata,
    getfilelist,
    ispermitload,
    deletefile,
    getActivityNameByProcessName
  } from '../../../service/superviseTask/index.js'
  import {
    tabletimeformat
  } from '../../../utils/dateTimeFormat.js'
  import MinxinVue from '../MixIn'
  import MixinAuthority from '../MixinAuthority'

  export default {
    components: {
      Breadcrumb,
      StockCodeQuery,
      selectPersonComponent,
      StepsCommonComponent: () => import('../superviseTaskComponent/StepsCommonComponent'),
      SuggestionTextareaComponent,
      MarginTable,
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
        rules1: {
          requireDescript: {required: true, message: '请输入需求描述'},
          // checkStandard: {required: true, message: '请输入验收标准'},
          beginDate: {required: true, message: '请选择交付时间'}
        },
        rules2: {
          opeartenumber: {required: true, message: '请输入任务编号'},
          opearteDescript: {required: true, message: '请输入任务名称'}
        },
        form1: {
          requireDescript: '',
          checkStandard: '',
          beginDate: ''
        },
        form2: {
          opeartenumber: '',
          opearteDescript: ''
        },
        suggestionForm:'',
        acivityNameArray: [],
        selectData: {
          dialogFormVisble: false,
          activityName: '', // 审核并分配
          instanceId: '',
          processName: 'ngsp_dmg_flow', // 当前流程名称：ngsp_dmg_flow
          businessData: {}
        }, // 调取分配人dialog接口的入参
        suggestionColumns: [{
          label: '流程状态',
          field: 'proceStatus'
        }, {
          label: '审核意见',
          field: 'comment'
        }, {
          label: '处理人',
          field: 'procePerson'
        }, {
          label: '审核日期',
          field: 'createTime'
        }],
        suggestionTableData: [],
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/demandManagementTablelist',
          label: '需求管理'
        }, {
          router: '',
          label: '需求管理表单'
        }],
        selectPerson: false,
        filelist: [],
        number: '',
        createPerson: '',
        createTime: '',
        accomplishTime: '',
        accomplishPerson: '',
        newcreat: false, // 是否为编辑状态
        opearte: '',
        uploadurlsecond: '',
        instanceId: '',
        taskId: '',
        processStatus: '0',
        infoId: '',
        buttondispaly: [],
        handelstatus: '',
        uploadurlfirst: '',
        filelist1: [],
        filelist2: [],
        sendobject1: '本所',
        sendobject2: '上市公司监管一部',
        issendobject1: [{
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
        issendobject2: [{
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
          value: '市场监管部',
          label: '市场监管部'
        }, {
          value: '所领导',
          label: '所领导'
        }, {
          value: '上市公司监管二部',
          label: '上市公司监管二部'
        }, {
          value: '法律部',
          label: '法律部'
        }],
        // feedbackUnit:'本所-市场监察一部',
        displaytable: false,
        // nullfeedbackUnit:false,
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        approve: 'true',
        showUploadButton: true, // 上传按钮展示
        uploadFileListTop: [], // 上传文件附件
        uploadFileListBottom: [], // 上传文件附件
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
      const {operate, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        this.handelstatus = operate || ''
        this.taskId = taskId || ''
        this.instanceId = instanceId || ''
        if (this.handelstatus == '1') {
          this.newcreat = false
          this.getAllData()
          // this.gethistoryform()
        } else if (this.handelstatus == '2') {
          this.newcreat = true
          this.getAllData()
          this.getbutton()
          // this.gethistoryform()
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
      updateStepsDescription(val) {
        this.stepsDescription = val
      },
      validateForms() {
        let flag1 = true, flag2 = true
        this.$refs.formRef1.validate((valid) => {
          flag1 = valid
        })
        this.$refs.formRef2 && this.$refs.formRef2.validate((valid) => {
          flag2 = valid
        })
        return flag1 && flag2
      },
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
          this.uploadurlfirst = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=dmg_first_attachment&infoId=' + this.infoId + '&fileName='
          this.uploadurlsecond = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=dmg_second_attachment&infoId=' + this.infoId + '&fileName='
        })
      },
      getnumber () {
        demandManagementnnum().then((resp) => {
          this.number = resp
        })
      },
      saveall () {
        if (!this.validateForms()) {
          return
        }
        let params = {
          'dmgMain': {
            'infoId': this.infoId,
            'taskNo': this.number,
            'createPerson': this.createPerson,
            'createTime': this.createTime,
            'needDesc': this.form1.requireDescript,
            'checkStandard': this.form1.checkStandard,
            'deliverTime': this.form1.beginDate,
            'taskNoAct': this.form2.opeartenumber,
            'finishTime': this.accomplishTime,
            'finishPerson': this.accomplishPerson,
            'taskName': this.form2.opearteDescript,
            'fkTarget': this.sendobject1 + ' ' + this.sendobject2,
            'fkDesc': '',
            'createFrom': '',
            'fromInfoId': '',
            'processStatus': this.processStatus,
            'comment': this.suggestionForm
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId || '0',
          'toWhom': '',
          // 'approve': true,
          'operate': this.opearte
        }
        let isparams = JSON.stringify(params)
        demandManagementsave(isparams).then(() => {
          this.opearte = ''
          this.$message.success('保存成功')
        })
      },
      getAllData () {
        demandManagementdata(this.instanceId).then((resp) => {
          // this.processStatus = resp.dmgMain.processStatus
          /* 当processStatus获取到再调取该接口获取activityName */
          // this.reqActivityNameByProcessName()
          this.infoId = resp.infoId
          this.uploadurlfirst = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=dmg_first_attachment&infoId=' + this.infoId + '&fileName='
          this.uploadurlsecond = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=dmg_second_attachment&infoId=' + this.infoId + '&fileName='
          this.number = resp.dmgMain.taskNo
          this.createPerson = resp.dmgMain.createPerson
          this.createTime = resp.dmgMain.createTime
          this.form1.checkStandard = resp.dmgMain.checkStandard
          this.form1.requireDescript = resp.dmgMain.needDesc
          this.form1.beginDate = resp.dmgMain.deliverTime

          if (!resp.dmgMain.taskNoAct) {
            this.form2.opeartenumber = this.number

          } else {
            this.form2.opeartenumber = resp.dmgMain.taskNoAct
          }
          this.form2.opearteDescript = resp.dmgMain.taskName
          if (!resp.dmgMain.fkTarget) {

          } else {
            this.sendobject1 = resp.dmgMain.fkTarget.split(' ')[0]
            this.sendobject2 = resp.dmgMain.fkTarget.split(' ')[1]
          }
          this.suggestionForm = resp.dmgMain.comment
          if (!resp.dmgMain.finishTime) {
            if (this.handelstatus == '2') {
              if (this.processStatus == 2) {
                this.accomplishTime = moment().format('YYYY-MM-DD HH:mm:ss')
              }
            }
          } else {
            this.accomplishTime = resp.dmgMain.finishTime
          }
          if (!resp.dmgMain.finishPerson) {
            if (this.handelstatus == '2') {
              if (this.processStatus == 2) {
                this.accomplishPerson = this.gfnGetRealName()
              }
            }
          } else {
            this.accomplishPerson = resp.dmgMain.finishPerson
          }
          this.getFileList()
          if (this.handelstatus == '2') {
            switch (this.processStatus) {
              case 1:
                break
              case 2:
                this.accomplishTime = moment().format('YYYY-MM-DD HH:mm:ss')
                break
              case 3:
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
          'dmgMain': {
            'infoId': this.infoId,
            'taskNo': this.number,
            'createPerson': this.createPerson,
            'createTime': this.createTime,
            'needDesc': this.form1.requireDescript,
            'checkStandard': this.form1.checkStandard,
            'deliverTime': this.form1.beginDate,
            'taskNoAct': this.form2.opeartenumber,
            'finishTime': this.accomplishTime,
            'finishPerson': this.accomplishPerson,
            'taskName': this.form2.opearteDescript,
            'fkTarget': this.sendobject1 + ' ' + this.sendobject2,
            'fkDesc': '',
            'createFrom': '',
            'fromInfoId': '',
            'processStatus': this.processStatus,
            'comment': this.suggestionForm
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId || '0',
          'toWhom': selectPerson || '',
          'approve': this.approve,
          'operate': this.opearte
        }
        let isparams = JSON.stringify(params)
        if (String(this.processStatus) === '0') {
          demandManagementlaunch(isparams).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          demandManagementexamine(isparams).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
      },
      submitform (flag) {
        if (flag && flag === '驳回') {
          this.$confirm('确定驳回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.approve = 'false'
            this.confirmCommitInfo()
          }).catch(() => {})
          return
        }
        if (!this.validateForms()) {
          return
        }
        // String(this.processStatus) === '0' 创建中获取可分配人接口失败
        if (String(this.processStatus) === '0' || String(this.processStatus) === '1' || String(this.processStatus) === '2') {
          this.selectData.dialogFormVisble = true
        } else {
          this.$confirm('确定提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.confirmCommitInfo()
          }).catch(() => {

          })
        }
      },
      getbutton () {
        getbuttonname(this.taskId).then((resp) => {
          for (let item of resp.data.approveTypes) {
            if (item.name === '退回发起人' || item.name === '退回至' || item.name === '退回上一步') {
              item.name = '驳回'
            }
            this.buttondispaly.push(item.name)
          }
        })
      },
      gethistoryform () {
        demandManagementhistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.suggestionTableData = resp.value
          if (this.suggestionTableData.length) {
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
            if (item.fileLocation === 'dmg_first_attachment') {
              fileList1.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
            }
            if (item.fileLocation === 'dmg_second_attachment') {
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
      },
      changesendobject () {
        this.issendobject2 = []
        switch (this.sendobject1) {
          case '本所':
            this.issendobject2.push({
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
              value: '上市公司监管二部',
              label: '上市公司监管二部'
            }, {
              value: '法律部',
              label: '法律部'
            })
            this.sendobject2 = '发行上市部'
            break
          case '证监会':
            this.issendobject2.push({
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
              value: '市场监管部',
              label: '市场监管部'
            })
            this.sendobject2 = '稽查局'
            break
          case '地方证监局':
            this.issendobject2.push({
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
            this.sendobject2 = '北京局'
            break
          case '公检法':
            this.issendobject2.push({
              value: '福建省公安厅',
              label: '福建省公安厅'
            },  {
              value: '辽宁本溪公安',
              label: '辽宁本溪公安'
            },{
              value: '广州市公安局',
              label: '广州市公安局'
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
            this.sendobject2 = '福建省公安厅'
            break
          case '其他单位':
            this.issendobject2.push({
              value: '其他单位',
              label: '其他单位'
            })
            this.sendobject2 = '其他单位'
            break
          case '中金所':
            this.issendobject2.push({
              value: '监查部',
              label: '监查部'
            })
            this.sendobject2 = '监查部'
            break
        }
      },
      displayStockCode () {
        if (String(this.lyrictype === '0')) {
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
        if (this.commonData.stockCode.length) {
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
  .el-card-table{
    .el-form{
      margin-left: 20px;
    }
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
