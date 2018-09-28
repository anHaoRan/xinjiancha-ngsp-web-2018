<template>
  <div class="affirmMonitorSecurity">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card class="el-card-table">
      <div slot="header">
        日志审计
      </div>
      <el-form :inline="true" :model="selectParams" ref="selectParams" :rules="rules">
        <el-row :gutter="20">
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item required label="任务编号：">
              {{selectParams.taskNumber}}
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24"
                  v-if="processStatus==1||processStatus==2||processStatus==3||processStatus==4">
            <el-form-item required label="创建人：">
              {{selectParams.createPerson}}
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24"
                  v-if="processStatus==1||processStatus==2||processStatus==3||processStatus==4">
            <el-form-item required label="创建时间：">
              {{selectParams.createDate}}
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="审计小组：" prop="group">
              <el-checkbox-group v-model="selectParams.group">
                <el-checkbox :disabled="form1" label="实时监控1组" name="group" @change="getSelectLeader"></el-checkbox>
                <el-checkbox :disabled="form1" label="实时监控2组" name="group" @change="getSelectLeader"></el-checkbox>
                <el-checkbox :disabled="form1" label="实时监控3组" name="group" @change="getSelectLeader"></el-checkbox>
                <el-checkbox :disabled="form1" label="线索分析1组" name="group" @change="getSelectLeader"></el-checkbox>
                <el-checkbox :disabled="form1" label="线索分析2组" name="group" @change="getSelectLeader"></el-checkbox>
                <el-checkbox :disabled="form1" label="市场分析组" name="group" @change="getSelectLeader"></el-checkbox>
                <el-checkbox :disabled="form1" label="技术支持组" name="group" @change="getSelectLeader"></el-checkbox>
                <el-checkbox :disabled="form1" label="综合业务组" name="group" @change="getSelectLeader"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="描述：" class="describe" prop="descript">
              <el-input :disabled="form1" placeholder="字符限制500以内" v-bind:maxlength=500 size="small"
                        v-model="selectParams.descript" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="交付时间：" prop="submitDate">
              <el-date-picker
                :picker-options="startpickerOption"
                v-model="selectParams.submitDate"
                type="datetime"
                :disabled="form1"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="24" style="display:inline-block;padding-bottom: 20px;">
            <el-form-item label="附件：" prop="logAuditfilelist">
              <div v-if="showUploadButton" style="min-width:200px">
                <text-upload
                  :uploadName="'file'"
                  :showFileList="true"
                  :actionUrl="logAuditUploadurl"
                  :disabled="form1"
                  :uploadOption="uploadOption"
                  :limitFileType="defaultLimitFileType"
                  :noLimitFileSize="true"
                  :limit="100"
                  :propsFileList="selectParams.logAuditfilelist"
                  @handlePreview="handlePreview2"
                  @handleRemove="deleteFile"
                  @getTxtCon="getFileList"
                ></text-upload>
              </div>
              <div v-else>
                <span v-if="selectParams.logAuditfilelist.length > 0">
                  <span
                    style="display: block;"
                    v-for="item in selectParams.logAuditfilelist"
                    :key="item.fileId">
                  {{item.name}}
                  </span>
                </span>
                <span v-else>无附件</span>
              </div>
 <!--             <div v-if="showUploadButton">
                <el-upload
                  class="upload-demo"
                  :action=logAuditUploadurl
                  :on-preview="handelpreview"
                  :on-remove="deletefilelist"
                  :disabled="form1"
                  :on-success="getfileID"
                  :file-list="selectParams.logAuditfilelist"
                  style="display:inline-block;width:500px"
                >
                  <el-button
                    type="text"
                    size="small"
                    :disabled="form1"
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
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="el-card-table" v-if="processStatus==1">
      <div slot="header">
        审计结论
      </div>
      <el-form :inline="true" :model="selectParams" ref="selectParams">
        <el-row :gutter="20">
          <el-col :xl="24">
            <el-form-item label="有无异常：">
              <el-radio :disabled="form2" v-model="selectParams.isAbnormal" label="0">有
              </el-radio>
              <el-radio :disabled="form2" v-model="selectParams.isAbnormal" label="1">无
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="异常情况说明" class="describe" prop='abnormalDescript'
            :rules="[{
              required: String(this.selectParams.isAbnormal) === '0',
              message: '请输入异常情况说明'
            }]">
              <el-input :disabled="form2" size="small" placeholder="字符限制200以内" v-bind:maxlength=200
                        v-model="selectParams.abnormalDescript" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="24" style="display:inline-block">
            <div v-if="showUploadButton" style="min-width:200px">
              <text-upload
                :uploadName="'file'"
                :showFileList="true"
                :actionUrl="auditConclusionUploadurl"
                :disabled="form2"
                :uploadOption="uploadOption"
                :limitFileType="defaultLimitFileType"
                :noLimitFileSize="true"
                :limit="100"
                :propsFileList="auditConclusionfilelist"
                @handlePreview="handlePreview1"
                @handleRemove="deleteFile"
                @getTxtCon="getFileList"
              ></text-upload>
            </div>
            <div v-else>
            <span v-if="auditConclusionfilelist.length > 0">
              <span
                style="display: block;"
                v-for="item in auditConclusionfilelist"
                :key="item.fileId">
              {{item.name}}
            </span>
            </span>
              <span v-else>无附件</span>
            </div>
<!--
            <div v-if="showUploadButton">
            <el-upload
              class="upload-demo"
              :action=auditConclusionUploadurl
              :on-preview="handelpreview"
              :on-remove="deletefilelist"
              :on-success="getfileID"
              :disabled="form2"
              :file-list="auditConclusionfilelist"
              style="display:inline-block"
            >
              <el-button
                type="text"
                size="small"
                :disabled="form2"
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
        </el-row>
      </el-form>
    </el-card>
    <el-card class="el-card-table" v-if="processStatus==2||processStatus==3||processStatus==4">
      <div slot="header">
        审计结果
      </div>
      <el-table
        :data="monitorGroupsData"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        max-height="400"
        :reserve-selection="true"
        style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          v-for="column in monitorGroupsColumns"
          :key="column.field"
          :align="column.align"
          :prop="column.field"
          :label="column.label"
          :min-width='column.minWidth'>
        </el-table-column>
        <el-table-column
          prop="extend2"
          label="附件"
          align="center"
          minWidth="6%">
          <template slot-scope="scope">
            <div v-for="item in scope.row.extend2">
              <a style="text-decoration:underline;color:#409eff;cursor:pointer;" @click="downloadfile(item)">{{item.fileName}}</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="el-card-table" v-if="processStatus==2||processStatus==3||processStatus==4||reject=='true'">
      <div slot="header">
        审核意见
      </div>
      <el-form :inline="true" :model="checkOptionParams" ref="checkOptionParams">
        <el-form-item label="您的意见：" class="describe">
          <el-input :disabled="form3" v-model="checkOptionParams.suggestion" placeholder="字符限制200以内"
                    v-bind:maxlength=200 type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="checkSuggestionData"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        max-height="400"
        :reserve-selection="true"
        style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          v-for="column in checkSuggestionColumns"
          :key="column.field"
          :align="column.align"
          :prop="column.field"
          :label="column.label"
          :min-width='column.minWidth'>
        </el-table-column>
      </el-table>
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
      <el-button @click="displaySelectPerson('true','selectParams')" type="primary"
                 style="float:right;margin:20px 20px 0 0;width:10%">提交</el-button>
    </span>
    <span v-if="newcreat==true&&processStatus==3">
        <el-button @click="displaySelectPerson('false','selectParams')" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">驳回</el-button>
      </span>
    <select-person-component v-if="selectData.dialogFormVisble"
                             :selectData="selectData"
                             @obdSelectPerson='confirmCommit'></select-person-component>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import moment from 'moment'
  import selectPersonComponent from '../superviseTaskComponent/selectPersonComponent'
  import StepsCommonComponent from '../superviseTaskComponent/StepsCommonComponent'
  import textUpload from '@/components/common/textUpload'
  import {
    getInfoId,
    getUserRoles,
    getlogAuditnum,
    logAuditlaunch,
    logAuditsave,
    postlogAuditdata,
    logAudithistoryopiniondata,
    logAuditexamine,
    getfilelist,
    deletefile,
    ispermitload,
    getLeader,
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
          processName: 'ngsp_lad_flow', // 当前流程名称
          businessData: {}
        }, // 调取分配人dialog接口的入参
        breadcrumbItems: [
          {
            router: '',
            label: '监察任务'
          },
          {
            router: '/logAuditTablelist',
            label: '日志审计'
          },
          {
            router: '',
            label: '日志审计表单'
          }
        ],
        selectPersonFlag: false,
        flag: 'true',
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        selectParams: {
          taskNumber: '',
          createPerson: '',
          createDate: '',
          descript: '',
          submitDate: '',
          group: [],
          isAbnormal: '0',
          abnormalDescript: '',
          logAuditfilelist: []
        },
        checkOptionParams: {
          suggestion: ''
        },
        monitorGroupsData: [], // 审计结果表格
        monitorGroupsColumns: [
          {label: '小组', field: 'group', align: 'center', minWidth: '6%'},
          {label: '是否异常', field: 'isAbnormal', align: 'center', minWidth: '6%'},
          {label: '异常情况说明', field: 'instruction', align: 'center', minWidth: '6%'},
          // {label: "附件", field: "extend1", align: "center", minWidth: "6%"},
          {label: '处理人', field: 'procePerson', align: 'center', minWidth: '6%'},
          {label: '审计日期', field: 'proceTime', align: 'center', minWidth: '6%'},
        ],
        checkSuggestionData: [],
        checkSuggestionColumns: [
          {label: '流程状态', field: 'proceStatus', align: 'center', minWidth: '6%'},
          {label: '审核意见', field: 'comment', align: 'center', minWidth: '6%'},
          {label: '处理人', field: 'procePerson', align: 'center', minWidth: '6%'},
          {label: '审核日期', field: 'createTime', align: 'center', minWidth: '6%'},
        ],
        rules: {
          descript: [{required: true, message: '请输入描述'}],
          submitDate: [{required: true, message: '请输入交付时间'}],
          logAuditfilelist: [{required: true, message: '请上传附件', trigger: 'change'}],
          group: [{required: true, message: '请选择审计小组', trigger: 'change'}]
        },
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        buttondispaly: [],
        newcreat: true,
        processStatus: 0,
        logAuditUploadurl: '',
        auditConclusionUploadurl: '',
        auditConclusionfilelist: [],
        group: '',
        savebutton: false,
        submitbutton: false,
        instanceId: '',
        taskId: '',
        opearte: '',
        infoId: '',
        form1: false,
        form2: false,
        form3: false,
        reject: false,
        ladDetail: [],
        AllData: [],
        fileList: [],
        isfilelist1: [],
        isfilelist2: [],
        isfilelist3: [],
        isfilelist4: [],
        isfilelist5: [],
        isfilelist6: [],
        isfilelist7: [],
        isfilelist8: [],
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
        this.handelstatus = operate
        this.taskId = taskId
        this.instanceId = instanceId
        if (this.handelstatus == '1') {
          this.newcreat = false
          this.getAllData()
          this.gethistoryform()
          this.form1 = true
          this.form2 = true
          this.form3 = true
        } else if (this.handelstatus == '2') {
          this.newcreat = true
          this.form3 = false
          this.getAllData()
          this.gethistoryform()
        } else {
          this.getInfoId()
          this.opearte = 'new'
          this.getnumber()
          this.newcreat = true
          this.savebutton = true
          this.submitbutton = true
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
      displaySelectPerson (flag, selectParams) {
        this.$refs['selectParams'].validate((valid) => {
          if (valid) {
            if (flag == 'false') {
              this.$confirm('确定驳回？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                this.flag = 'false'
                this.confirmCommit()
              }).catch(() => {})
              return
            }
            if (Number(this.processStatus) === 2) {
              this.selectData.dialogFormVisble = true
            } else {
              this.flag = flag
              this.submitfrom()
            }
          } else {
            return false
          }
        })
      },
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
          this.logAuditUploadurl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=lad_logAudit_attachment&infoId=' + this.infoId + '&fileName=' + ''
          // this.auditConclusionUploadurl="/ngsp/bpm/v1/attachment/upload?fileLoc=lad_auditConclusion_attachment&infoId="+this.infoId+"&fileName="+""
        })
      },
      getnumber () {
        getlogAuditnum(this.role).then((resp) => {
          this.selectParams.taskNumber = resp
        })
      },
      getFileList () {
        this.getPerformerList(() => {
          getfilelist(this.infoId).then((resp) => {
            this.fileList = resp.attachments
            this.isfilelist1 = []
            this.isfilelist2 = []
            this.isfilelist3 = []
            this.isfilelist4 = []
            this.isfilelist5 = []
            this.isfilelist6 = []
            this.isfilelist7 = []
            this.isfilelist8 = []
            for (let j = 0; j < this.fileList.length; j++) {
              switch (this.fileList[j].fileLocation) {
                case 'lad_REAL_MONITOR_GROUP_1_LEADER_attachment':
                  this.isfilelist1.push(this.fileList[j])
                  break
                case 'lad_REAL_MONITOR_GROUP_2_LEADER_attachment':
                  this.isfilelist2.push(this.fileList[j])
                  break
                case 'lad_REAL_MONITOR_GROUP_3_LEADER_attachment':
                  this.isfilelist3.push(this.fileList[j])
                  break
                case 'lad_CLUE_ANALYSIS_GROUP_1_LEADER_attachment':
                  this.isfilelist4.push(this.fileList[j])
                  break
                case 'lad_CLUE_ANALYSIS_GROUP_2_LEADER_attachment':
                  this.isfilelist5.push(this.fileList[j])
                  break
                case 'lad_MARKET_ANALYSIS_GROUP_LEADER_attachment':
                  this.isfilelist6.push(this.fileList[j])
                  break
                case 'lad_TECH_SUPPORT_GROUP_LEADER_attachment':
                  this.isfilelist7.push(this.fileList[j])
                  break
                case 'lad_INTEGRATED_BUSINESS_GROUP_LEADER_attachment':
                  this.isfilelist8.push(this.fileList[j])
                  break
              }
            }

            for (let i = 0; i < this.monitorGroupsData.length; i++) {
              switch (this.monitorGroupsData[i].group) {
                case 'REAL_MONITOR_GROUP_1':
                  this.monitorGroupsData[i].extend2 = this.isfilelist1
                  break
                case 'REAL_MONITOR_GROUP_2':
                  this.monitorGroupsData[i].extend2 = this.isfilelist2
                  break
                case 'REAL_MONITOR_GROUP_3':
                  this.monitorGroupsData[i].extend2 = this.isfilelist3
                  break
                case 'CLUE_ANALYSIS_GROUP_1':
                  this.monitorGroupsData[i].extend2 = this.isfilelist4
                  break
                case 'CLUE_ANALYSIS_GROUP_2':
                  this.monitorGroupsData[i].extend2 = this.isfilelist5
                  break
                case 'MARKET_ANALYSIS_GROUP':
                  this.monitorGroupsData[i].extend2 = this.isfilelist6
                  break
                case 'TECH_SUPPORT_GROUP':
                  this.monitorGroupsData[i].extend2 = this.isfilelist7
                  break
                case 'INTEGRATED_BUSINESS_GROUP':
                  this.monitorGroupsData[i].extend2 = this.isfilelist8
                  break
              }
            }
            console.log(this.monitorGroupsData)
            for (let i = 0; i < this.ladDetail.length; i++) {
              switch (this.ladDetail[i].group) {
                case 'REAL_MONITOR_GROUP_1':
                  this.ladDetail[i].group = '实时监控1组'
                  break
                case 'REAL_MONITOR_GROUP_2':
                  this.ladDetail[i].group = '实时监控2组'
                  break
                case 'REAL_MONITOR_GROUP_3':
                  this.ladDetail[i].group = '实时监控3组'
                  break
                case 'CLUE_ANALYSIS_GROUP_1':
                  this.ladDetail[i].group = '线索分析1组'
                  break
                case 'CLUE_ANALYSIS_GROUP_2':
                  this.ladDetail[i].group = '线索分析2组'
                  break
                case 'MARKET_ANALYSIS_GROUP':
                  this.ladDetail[i].group = '市场分析组'
                  break
                case 'TECH_SUPPORT_GROUP':
                  this.ladDetail[i].group = '技术支持组'
                  break
                case 'INTEGRATED_BUSINESS_GROUP':
                  this.ladDetail[i].group = '综合业务组'
                  break
              }
            }
            this.selectParams.logAuditfilelist = []
            this.auditConclusionfilelist = []
            this.fileNameList1 = []
            this.fileNameList2 = []
            this.showUploadButton = resp.authority
            resp.attachments.forEach(item => {
              if (item.fileLocation == 'lad_logAudit_attachment') {
                this.selectParams.logAuditfilelist.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
              }
              if (item.fileLocation.indexOf(this.group) >= 0) {
                this.auditConclusionfilelist.push({'name': item.fileName, 'fileId': item.fileId, 'id': item.id})
              }
            })
            this.fileNameList1 = this.getFileNameList(this.selectParams.logAuditfilelist, this.fileNameList1)
            this.fileNameList2 = this.getFileNameList(this.auditConclusionfilelist, this.fileNameList2)
            this.$refs['selectParams'].validate((valid) => {
              if (valid) {
              } else {
                return false
              }
            })
          })
        })
      },
      handlePreview1(file) {
        let fileId = ''
        for (let item of this.auditConclusionfilelist) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.downloadFile(fileId, file)
      },
      handlePreview2(file) {
        let fileId = ''
        for (let item of this.selectParams.logAuditfilelist) {
          if (item.name === file.name) {
            fileId = item.fileId
          }
        }
        this.downloadFile(fileId, file)
      },
      saveall () {
        this.$refs['selectParams'].validate((valid) => {
          if (valid) {
            if (this.taskId == '' || this.taskId == null) {
              this.taskId = '0'
            }
            let auditGroups = []
            if (this.selectParams.group[0]) {
              auditGroups.push('REAL_MONITOR_GROUP_1')
            }
            if (this.selectParams.group[1]) {
              auditGroups.push('REAL_MONITOR_GROUP_2')
            }
            if (this.selectParams.group[2]) {
              auditGroups.push('REAL_MONITOR_GROUP_3')
            }
            if (this.selectParams.group[3]) {
              auditGroups.push('CLUE_ANALYSIS_GROUP_1')
            }
            if (this.selectParams.group[4]) {
              auditGroups.push('CLUE_ANALYSIS_GROUP_2')
            }
            if (this.selectParams.group[5]) {
              auditGroups.push('MARKET_ANALYSIS_GROUP')
            }
            if (this.selectParams.group[6]) {
              auditGroups.push('TECH_SUPPORT_GROUP')
            }
            if (this.selectParams.group[7]) {
              auditGroups.push('INTEGRATED_BUSINESS_GROUP')
            }
            for (let i = 0; i < this.selectParams.group.length; i++) {
              switch (this.selectParams.group[i]) {
                case '实时监控1组':
                  auditGroups.push('REAL_MONITOR_GROUP_1')
                  break
                case '实时监控2组':
                  auditGroups.push('REAL_MONITOR_GROUP_2')
                  break
                case '实时监控3组':
                  auditGroups.push('REAL_MONITOR_GROUP_3')
                  break
                case '线索分析1组':
                  auditGroups.push('CLUE_ANALYSIS_GROUP_1')
                  break
                case '线索分析2组':
                  auditGroups.push('CLUE_ANALYSIS_GROUP_2')
                  break
                case '市场分析组':
                  auditGroups.push('MARKET_ANALYSIS_GROUP')
                  break
                case '技术支持组':
                  auditGroups.push('TECH_SUPPORT_GROUP')
                  break
                case '综合业务组':
                  auditGroups.push('INTEGRATED_BUSINESS_GROUP')
                  break
              }
            }
            let procePerson = ''
            let proceTime = ''
            if (this.processStatus === 1) {
              procePerson = this.gfnGetRealName()
              proceTime = moment().format('YYYY-MM-DD')
            }
            if (this.processStatus === 0) {
              this.selectParams.createPerson = this.gfnGetRealName()
              this.selectParams.createDate = moment().format('YYYY-MM-DD HH:mm:ss')
            }
            let params = {
              'ladMain': {
                'infoId': this.infoId,
                'taskNo': this.selectParams.taskNumber,
                'createPerson': this.selectParams.createPerson,
                'extend1': this.selectParams.createDate,
                'description': this.selectParams.descript,
                'auditGroups': auditGroups.join(','),
                'deliverTime': this.selectParams.submitDate,
                'processStatus': this.processStatus,
                'comment': this.checkOptionParams.suggestion,
              },
              'ladDetail': {
                'infoId': this.infoId,
                'isAbnormal': this.selectParams.isAbnormal,
                'instruction': this.selectParams.abnormalDescript,
                'group': this.group,
                'procePerson': procePerson,
                'proceTime': proceTime,
              },
              'instanceId': this.instanceId,
              'taskId': this.taskId,
              'toWhom': '',
              'approve': 'true',
              'operate': this.opearte,
            }
            let isparams = JSON.stringify(params)
            logAuditsave(isparams).then((resp) => {
              this.opearte = ''
              this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success',
              })
            })
          } else {
            return false
          }
        })
      },
      getAllData () {
        postlogAuditdata(this.instanceId).then((resp) => {
          // this.processStatus = resp.ladMain.processStatus
          // this.reqActivityNameByProcessName()
          if (Number(this.processStatus) === 2) {
            for (let i = 0; i < this.checkSuggestionData.length; i++) {
              if (this.checkSuggestionData[i].proceStatus == '审批中') {
                this.reject = true
              }
            }
          }
          this.infoId = resp.infoId
          this.logAuditUploadurl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=lad_logAudit_attachment&infoId=' + this.infoId + '&fileName=' + ''
          this.selectParams.taskNumber = resp.ladMain.taskNo
          this.selectParams.createPerson = resp.ladMain.createPerson
          this.selectParams.createDate = resp.ladMain.extend1
          let auditGroups = resp.ladMain.auditGroups.split(',')
          for (let i = 0; i < auditGroups.length; i++) {
            switch (auditGroups[i]) {
              case 'REAL_MONITOR_GROUP_1':
                this.selectParams.group.push('实时监控1组')
                break
              case 'REAL_MONITOR_GROUP_2':
                this.selectParams.group.push('实时监控2组')
                break
              case 'REAL_MONITOR_GROUP_3':
                this.selectParams.group.push('实时监控3组')
                break
              case 'CLUE_ANALYSIS_GROUP_1':
                this.selectParams.group.push('线索分析1组')
                break
              case 'CLUE_ANALYSIS_GROUP_2':
                this.selectParams.group.push('线索分析2组')
                break
              case 'MARKET_ANALYSIS_GROUP':
                this.selectParams.group.push('市场分析组')
                break
              case 'TECH_SUPPORT_GROUP':
                this.selectParams.group.push('技术支持组')
                break
              case 'INTEGRATED_BUSINESS_GROUP':
                this.selectParams.group.push('综合业务组')
                break
            }
          }
          this.selectParams.descript = resp.ladMain.description
          this.selectParams.submitDate = resp.ladMain.deliverTime
          this.monitorGroupsData = resp.ladDetail
          this.ladDetail = resp.ladDetail
          for (let i = 0; i < this.ladDetail.length; i++) {
            if (this.ladDetail[i].isAbnormal == '1') {
              this.ladDetail[i].isAbnormal = '无'
            }
            if (this.ladDetail[i].isAbnormal == '0') {
              this.ladDetail[i].isAbnormal = '有'
            }
            // for(let j=0;j<this.fileList.length;j++){
            //   if(this.fileList[j].fileLocation.indexOf(this.group)>=0){
            //     debugger
            //     this.ladDetail[i].file=this.fileList[j].fileName
            //   }
            // }
          }
          this.getFileList()
          if (this.handelstatus === '2') {
            switch (Number(this.processStatus)) {
              case 0:
                this.getSelectLeader()
                break
              case 1:
                this.form1 = true
                break
              case 2:
                this.form1 = true
                break
              case 3:
                this.form1 = true
                break
              case 4:
                this.form1 = true
                this.form3 = true
                break
            }
          }
        })
      },
      confirmCommit(selectPerson) {
        if (Number(this.processStatus) === 2 && this.flag === 'true') {
          this.toWhom = selectPerson || ''
        }
        /* if (this.processStatus == 2 ) {
         if (this.flag == 'true') {
         if (person.length == 0) {
         return
         }
         this.toWhom = person.join(',')
         }
         } */
        let procePerson = ''
        let proceTime = ''
        if (Number(this.processStatus) === 1) {
          procePerson = this.gfnGetRealName()
          proceTime = moment().format('YYYY-MM-DD')
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let auditGroups = []
        for (let i = 0; i < this.selectParams.group.length; i++) {
          switch (this.selectParams.group[i]) {
            case '实时监控1组':
              auditGroups.push('REAL_MONITOR_GROUP_1')
              break
            case '实时监控2组':
              auditGroups.push('REAL_MONITOR_GROUP_2')
              break
            case '实时监控3组':
              auditGroups.push('REAL_MONITOR_GROUP_3')
              break
            case '线索分析1组':
              auditGroups.push('CLUE_ANALYSIS_GROUP_1')
              break
            case '线索分析2组':
              auditGroups.push('CLUE_ANALYSIS_GROUP_2')
              break
            case '市场分析组':
              auditGroups.push('MARKET_ANALYSIS_GROUP')
              break
            case '技术支持组':
              auditGroups.push('TECH_SUPPORT_GROUP')
              break
            case '综合业务组':
              auditGroups.push('INTEGRATED_BUSINESS_GROUP')
              break
          }
        }
        if (Number(this.processStatus) === 0) {
          this.selectParams.createPerson = this.gfnGetRealName()
          this.selectParams.createDate = moment().format('YYYY-MM-DD HH:mm:ss')
        }
        let params = {
          'ladMain': {
            'infoId': this.infoId,
            'taskNo': this.selectParams.taskNumber,
            'createPerson': this.selectParams.createPerson,
            'extend1': this.selectParams.createDate,
            'description': this.selectParams.descript,
            'auditGroups': auditGroups.join(','),
            'deliverTime': this.selectParams.submitDate,
            'processStatus': this.processStatus,
            'comment': this.checkOptionParams.suggestion,
          },
          'ladDetail': {
            'infoId': this.infoId,
            'isAbnormal': this.selectParams.isAbnormal,
            'instruction': this.selectParams.abnormalDescript,
            'group': this.group,
            'procePerson': procePerson,
            'proceTime': proceTime
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': this.toWhom,
          'approve': this.flag,
          'operate': this.opearte
        }
        let isparams = JSON.stringify(params)
        if (Number(this.processStatus) === 0) {
          logAuditlaunch(isparams).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          logAuditexamine(isparams).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
      },
      submitfrom (selectPerson) {
        this.$confirm('确定提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.confirmCommit(selectPerson)
        }).catch(() => {})
      },
      gethistoryform () {
        logAudithistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.checkSuggestionData = resp.value
          for (let i = 0; i < this.checkSuggestionData.length; i++) {
            if (this.checkSuggestionData[i].proceStatus == '0') {
              this.checkSuggestionData.splice(i, 1)
            }
          }

          for (let i = 0; i < this.checkSuggestionData.length; i++) {
            for (let j = 0; j < this.checkSuggestionData.length; j++) {
              if (this.checkSuggestionData[j].proceStatus == '1') {
                this.checkSuggestionData.splice(j, 1)
                i = 0
                break
              }
            }
          }
        })
      },
      getSelectLeader (val) {
        let group = []
        for (let i = 0; i < this.selectParams.group.length; i++) {
          switch (this.selectParams.group[i]) {
            case '实时监控1组':
              group.push('REAL_MONITOR_GROUP_1')
              break
            case '实时监控2组':
              group.push('REAL_MONITOR_GROUP_2')
              break
            case '实时监控3组':
              group.push('REAL_MONITOR_GROUP_3')
              break
            case '线索分析1组':
              group.push('CLUE_ANALYSIS_GROUP_1')
              break
            case '线索分析2组':
              group.push('CLUE_ANALYSIS_GROUP_2')
              break
            case '市场分析组':
              group.push('MARKET_ANALYSIS_GROUP')
              break
            case '技术支持组':
              group.push('TECH_SUPPORT_GROUP')
              break
            case '综合业务组':
              group.push('INTEGRATED_BUSINESS_GROUP')
              break
          }
        }
        getLeader(group.join(',')).then((resp) => {
          let istoWhom = []
          for (let i = 0; i < resp.length; i++) {
            istoWhom.push(resp[i].accountName)
          }
          this.toWhom = istoWhom.join(',')

        })
      },
      getPerformerList (callback) {
        let username = this.gfnGetUsername()
        getUserRoles(username).then((resp) => {
          this.group = resp[0].roleid
          this.auditConclusionUploadurl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=lad_' + this.group + '_attachment&infoId=' + this.infoId + '&fileName=' + ''
          callback && callback()
          for (let i = 0; i < this.ladDetail.length; i++) {
            if (this.group.indexOf(this.ladDetail[i].group) >= 0) {
              if (!this.ladDetail[i].isAbnormal) {

              } else {
                if (this.ladDetail[i].isAbnormal == '有') {
                  this.selectParams.isAbnormal = '0'
                }
                if (this.ladDetail[i].isAbnormal == '无') {
                  this.selectParams.isAbnormal = '1'
                }
              }
              if (!this.ladDetail[i].instruction) {

              } else {
                this.selectParams.abnormalDescript = this.ladDetail[i].instruction
              }
            }
          }
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
      downloadfile (attachment) {
        window.location.href = this.gfnGetDownloadFileUrl(attachment.fileId, attachment.fileName)
      }
    }
  }
</script>

<style lang="less">
  .affirmMonitorSecurity {
    .el-step__title.is-process {
      color: #fff
    }
    .el-form {
      padding: 0px 20px;
      .el-form-item {
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
