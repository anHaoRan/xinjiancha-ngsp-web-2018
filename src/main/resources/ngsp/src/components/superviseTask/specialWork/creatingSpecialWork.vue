<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card>
      <el-tabs>
        <el-tab-pane label="专项工作" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>任务编号</span></el-col>
        <el-col :span="9">
          <el-input disabled v-model="number" placeholder="" size="small" style="width:33%"></el-input>
        </el-col>
        <el-col :span="2"><span style="color:red">*</span><span>工作类别</span></el-col>
        <el-col :span="4">
          <el-select :disabled="firstPermission" v-model="workStype" placeholder="" size="small">
            <el-option
              v-for="item in isworkStype"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>工作任务</el-col>
        <el-col :span="18">
          <el-input :disabled="firstPermission" placeholder="字符限制1000以内" v-bind:maxlength=1000 type="textarea"
                    v-model="workTask" size="medium" style="width:77%" @change="displaypromt(workTask,'1')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullworkTask" class="verfynull">工作任务为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>执行人</span></el-col>
        <el-col :span="9">
          <el-select collapse-tags :disabled="firstPermission" v-bind:multiple="true" v-model="performer" placeholder=""
                     size="small" @change="addpersonInCharge">
            <el-option
              v-for="item in isperformer"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" v-if="nullperformer" class="verfynull">执行人为空!</el-col>
        <el-col :span="2"><span style="color:red">*</span><span>负责人</span></el-col>
        <el-col :span="4">
          <el-select :disabled="firstPermission" v-model="personInCharge" placeholder="" size="small"
                     @change="displaypromt(personInCharge,'0')">
            <el-option
              v-for="item in ispersonInCharge"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" v-if="nullpersonInCharge" class="verfynull" style="margin-left:0%">负责人为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2" style="margin-top:8px"><span style="color:red">*</span>开始日期</el-col>
        <el-col :span="9">
          <el-date-picker
            v-model="dimensionQueryForm.beginDate"
            type="date"
            :disabled="firstPermission"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
            @change="displaypromt(dimensionQueryForm.beginDate,'3')"
            :picker-options="startpickerOption"
            size="small"
            style="width:33%">
          </el-date-picker>
        </el-col>
        <el-col :span="2" v-if="nullbeginDate" class="verfynull">开始日期为空!</el-col>
        <el-col :span="2" style="margin-top:8px"><span style="color:red">*</span>预计完成日期</el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="dimensionQueryForm.endDate"
            type="date"
            :disabled="firstPermission"
            placeholder="预计完成日期"
            value-format="yyyy-MM-dd"
            :picker-options="endpickerOption"
            @change="displaypromt(dimensionQueryForm.endDate,'4')"
            size="small"
            style="width:74%">
          </el-date-picker>
        </el-col>
        <el-col :span="2" v-if="nullendDate" class="verfynull" style="margin-left:0%">预计完成日期为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>工作安排</el-col>
        <el-col :span="18">
          <el-input :disabled="firstPermission" placeholder="字符限制200以内" v-bind:maxlength=200 type="textarea"
                    v-model="workArrange" size="medium" style="width:77%"
                    @change="displaypromt(workArrange,'5')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullworkArrange" class="verfynull">工作安排为空!</el-col>
      </el-row>
    </el-card>
    <el-card v-if="processStatus==1||processStatus==2||processStatus==3">
      <el-tabs>
        <el-tab-pane label="进展情况" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card v-if="processStatus==1||processStatus==2||processStatus==3" style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>进展情况</el-col>
        <el-col :span="18">
          <el-input :disabled="secondPermission" placeholder="字符限制1000以内" v-bind:maxlength=1000 type="textarea"
                    v-model="progress" size="medium" style="width:77%" @change="displaypromt(progress,'6')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullprogress" class="verfynull">进展情况为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2">附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton" style="min-width:200px">
            <text-upload
              :uploadName="'file'"
              :showFileList="true"
              :actionUrl="uploadurlfirst"
              :disabled="secondPermission"
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
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span><span style="color:red">*</span>负责人</span></el-col>
        <el-col :span="9">
          <span>{{personInCharge2}}</span>
        </el-col>
        <el-col :span="3"><span><span style="color:red">*</span>完成日期</span></el-col>
        <el-col :span="5">
          <span>{{accomplishtime}}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="processStatus==2||processStatus==3">
      <el-tabs>
        <el-tab-pane label="组长评价" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;" v-if="processStatus==2||processStatus==3">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>组长评价</el-col>
        <el-col :span="18">
          <el-input :disabled="editPermission" type="textarea" v-model="auditoption" placeholder="字符限制1000以内"
                    v-bind:maxlength=1000 size="medium" style="width:77%" @change="displaypromt(workTask,'7')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullAuditoption" class="verfynull">组长评价为空!</el-col>
      </el-row>
    </el-card>
    <!--<el-card v-if="[1,2,3].indexOf(Number(processStatus)) > -1">-->
      <!--<el-row style="margin-top:20px">-->
        <!--<el-table-->
          <!--style="margin-top:10px;"-->
          <!--:data="deailcasedata"-->
          <!--:fit=true-->
          <!--border>-->
          <!--<el-table-column-->
            <!--type="index"-->
            <!--width="50"-->
            <!--label="序号">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="proceStatus"-->
            <!--label="流程状态"-->
            <!--show-overflow-tooltip>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="comment"-->
            <!--label="审核意见"-->
            <!--show-overflow-tooltip>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="procePerson"-->
            <!--label="处理人"-->
            <!--show-overflow-tooltip>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
            <!--prop="createTime"-->
            <!--label="审核日期"-->
            <!--show-overflow-tooltip>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      <!--</el-row>-->
    <!--</el-card>-->
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
        <el-button @click="setFlagAndSubmitForm('true')" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">提交</el-button>
      </span>
      <span v-if="newcreat&&processStatus==2">
        <el-button @click="setFlagAndSubmitForm('false')" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">驳回</el-button>
      </span>
    </div>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import StepsCommonComponent from '../superviseTaskComponent/StepsCommonComponent'
  import textUpload from '@/components/common/textUpload'
  import moment from 'moment'
  import {
    getInfoId,
    getUserRoles,
    specialWorklaunch,
    specialWorksave,
    specialWorkexamine,
    getspecialWorknum,
    getperformer,
    postspecialWorkdata,
    specialWorkhistoryopiniondata,
    getfilelist,
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
          processName: 'ngsp_spw_flow', // 当前流程名称
          businessData: {}
        }, // 调取分配人dialog接口的入参
        approveFlag: 'true',
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/specialWorkTablelist',
          label: '专项工作'
        }, {
          router: '',
          label: '专项工作表单'
        }],
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        number: '',
        workStype: '专项报告',
        isworkStype: [{
          value: '专项报告',
          label: '专项报告'
        }, {
          value: '临时计算',
          label: '临时计算'
        }, {
          value: '定期工作',
          label: '定期工作'
        }, {
          value: '纪律处分',
          label: '纪律处分'
        }, {
          value: '自律监管',
          label: '自律监管'
        }, {
          value: '系统优化',
          label: '系统优化'
        }, {
          value: '技术创新',
          label: '技术创新'
        }, {
          value: '分析研究',
          label: '分析研究'
        }],
        workTask: '',
        performer: [],
        isperformer: [],
        personInCharge: '',
        personInChargeName: '',
        ispersonInCharge: [],
        deailcasedata: [],
        dimensionQueryForm: {
          beginDate: '',
          endDate: '',
        },
        workArrange: '',
        newcreat: false,
        firstPermission: false,
        editPermission: false,
        secondPermission: false,
        progress: '',
        uploadurlfirst: '',
        fileList: [],
        uploadOption: {
          name: '上传',
          size: 'small',
          type: 'primary'
        },
        accomplishtime: '2018-2-14',
        processStatus: 0,
        auditoption: '',
        opearte: '',
        role: '',
        personInCharge2: '',
        nullworkTask: false,
        nullperformer: false,
        nullpersonInCharge: false,
        nullbeginDate: false,
        nullendDate: false,
        nullworkArrange: false,
        nullprogress: false,
        nullAuditoption: false,
        porcessPerName: [],
        istowhom: [],
        towhom: '',
        grouperTips: '',
        startpickerOption: {
          disabledDate: (time) => {
            // return time.getTime() >= Date.now()-8.46e6;
          }
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.dimensionQueryForm.beginDate).getTime() - 3600 * 1000 * 24
          }
        }
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        // this.geturlparam()
        this.handelstatus = operate
        this.taskId = taskId
        this.instanceId = instanceId
        if (this.handelstatus == '1') {
          this.getPerformerList()
          this.newcreat = false
          this.editPermission = true
          this.firstPermission = true
          this.secondPermission = true
          // this.getAllData();
          this.gethistoryform()
        } else if (this.handelstatus == '2') {
          this.getPerformerList()
          this.newcreat = true
          this.editPermission = false
          this.firstPermission = false
          this.secondPermission = false
          // this.getAllData();
          this.gethistoryform()
        } else {
          this.getInfoId()
          this.opearte = 'new'
          this.dimensionQueryForm.beginDate = moment().format('YYYY-MM-DD')
          this.dimensionQueryForm.endDate = moment().format('YYYY-MM-DD')
          this.getPerformerList()
          this.newcreat = true
          this.editPermission = false
          this.firstPermission = false
          this.secondPermission = false
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
          callback()
        })
      },
      displaypromt (value, flag) {
        if (!value) {
          switch (flag) {
            case '0':
              this.nullpersonInCharge = true
              break
            case '1':
              this.nullworkTask = true
              break
            case '2':
              this.nullpersonInCharge = true
              break
            case '3':
              this.nullbeginDate = true
              break
            case '4':
              this.nullendDate = true
              break
            case '5':
              this.nullworkArrange = true
              break
            case '6':
              this.nullprogress = true
              break
            case '7':
              this.nullAuditoption = true
              break
          }
        } else {
          switch (flag) {
            case '0':
              this.nullpersonInCharge = false
              break
            case '1':
              this.nullworkTask = false
              break
            case '2':
              this.nullpersonInCharge = false
              break
            case '3':
              this.nullbeginDate = false
              break
            case '4':
              this.nullendDate = false
              break
            case '5':
              this.nullworkArrange = false
              break
            case '6':
              this.nullprogress = false
              break
            case '7':
              this.nullAuditoption = false
              break
          }
        }
      },
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
          this.uploadurlfirst = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=spw_first_attachment&infoId=' + this.infoId + '&fileName=' + ''
        })
      },
      getnumber () {
        getspecialWorknum(this.role).then((resp) => {
          this.number = resp
        })
      },
      addpersonInCharge (val) {
        if (!this.performer) {
          this.nullperformer = true
        } else {
          this.nullperformer = false
        }
        console.log(val)
        for (let j = 0; j < val.length; j++) {
          if (val[j] == 'ALL') {
            for (let i = 0; i < this.isperformer.length; i++) {
              val[i] = this.isperformer[i].value
            }
            val.splice(0, 1)
          }
        }
        console.log(val)
        this.ispersonInCharge = []
        this.porcessPerName = []
        this.isperformer.forEach(item => {
          this.performer.forEach(val => {
            if (item.value === val) {
              this.ispersonInCharge.push(item)
              this.porcessPerName.push(item.label)
            }
          })
        })
        this.personInCharge = this.ispersonInCharge[0].value
        // for(let i=0;i<this.performer.length;i++){
        //   this.ispersonInCharge.push(
        //     {
        //       value: this.performer[i],
        //       label: this.performer[i]
        //     })
        // this.personInCharge=this.ispersonInCharge[0].label
        // }
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
          if (this.handelstatus == '1' || this.handelstatus == '2') {

          } else {
            this.getnumber()
          }
          getperformer(roleid).then((resp) => {
            this.isperformer = [{value: 'ALL', label: '全部'}]
            for (let i = 0; i < resp.length; i++) {
              this.isperformer.push(
                {
                  value: resp[i].code,
                  label: resp[i].name
                })
            }
            if (this.handelstatus == '1' || this.handelstatus == '2') {
              this.getAllData()
            }
          })
        })
      },
      saveall () {
        if (this.processStatus === 0 || this.processStatus === 1) {
          if (!this.workTask) {
            this.nullworkTask = true
            return
          }
          if (!this.performer) {
            this.nullperformer = true
            return
          }
          if (!this.personInCharge) {
            this.nullpersonInCharge = true
            return
          }
          if (!this.dimensionQueryForm.beginDate) {
            this.nullbeginDate = true
            return
          }
          if (!this.dimensionQueryForm.endDate) {
            this.nullendDate = true
            return
          }
          if (!this.workArrange) {
            this.nullworkArrange = true
            return
          }
        }
        if (this.processStatus === 1) {
          if (!this.progress) {
            this.nullprogress = true
            return
          }
        }
        if (Number(this.processStatus) === 2 || Number(this.processStatus) === 3) {
          if (!this.auditoption) {
            this.nullAuditoption = true
            return
          }
        }
        let workType = ''
        let processPerson = ''
        if (this.workStype == '' || this.workStype == null) {
          workType = ''
        } else {
          workType = this.workStype
        }
        if (this.performer == '' || this.performer == null) {
          processPerson = ''
        } else {
          processPerson = JSON.stringify(this.ispersonInCharge)
        }
        this.ispersonInCharge.forEach(item => {
          if (item.value === this.personInCharge) {
            this.personInChargeName = item
          }
        })
        let params = {
          'spwMain': {
            'infoId': this.infoId,
            'taskNo': this.number,
            'workType': workType,
            'workContent': this.workTask,
            'processPerson': processPerson,
            'charger': this.personInChargeName,
            'startDate': this.dimensionQueryForm.beginDate,
            'foreFinishDate': this.dimensionQueryForm.endDate,
            'workArrangement': this.workArrange,
            'workProgress': this.progress,
            'finishDate': this.accomplishtime,
            'processStatus': this.processStatus,
            'comment': this.auditoption,
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': '',
          'role': this.role,
          'approve': 'true',
          'operate': this.opearte,
        }
        let isparams = JSON.stringify(params)
        specialWorksave(isparams).then((resp) => {
          this.opearte = ''
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success',
          })
        })
      },
      getAllData () {
        postspecialWorkdata(this.instanceId).then((resp) => {
          this.processStatus = resp.spwMain.processStatus
          this.infoId = resp.infoId
          this.uploadurlfirst = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=spw_first_attachment&infoId=' + this.infoId + '&fileName=' + ''
          this.number = resp.spwMain.taskNo
          if (resp.spwMain.workType == '') {
            this.workStype = ''
          } else {
            this.workStype = resp.spwMain.workType
          }
          this.workTask = resp.spwMain.workContent
          this.ispersonInCharge = JSON.parse(resp.spwMain.processPerson)
          if (!resp.spwMain.processPerson) {

            this.performer = ''
          } else {
            this.isperformer.forEach(item => {
              this.ispersonInCharge.forEach(nasp => {
                console.log(item, nasp)
                if (item.value == nasp.value) {
                  this.performer.push(item.value)
                }
              })
            })
          }
          // this.personInCharge=resp.spwMain.charger
          let chargerName = JSON.parse(resp.spwMain.charger)
          let processPersonName = JSON.parse(resp.spwMain.processPerson)
          processPersonName.forEach(item => {
            if (item.label === chargerName.label) {
              this.personInCharge = item.value
              this.personInCharge2 = item.label
            }
          })
          // this.personInCharge=resp.spwMain.charger
          this.dimensionQueryForm.beginDate = resp.spwMain.startDate
          this.dimensionQueryForm.endDate = resp.spwMain.foreFinishDate
          this.workArrange = resp.spwMain.workArrangement
          this.auditoption = resp.spwMain.comment
          this.progress = resp.spwMain.workProgress
          this.getFileList()
          if (this.processStatus == 1) {
            this.firstPermission = true
            this.accomplishtime = moment().format('L')
          } else {
            this.accomplishtime = resp.spwMain.finishDate
          }
          if (this.processStatus == 2) {
            this.firstPermission = true
            this.secondPermission = true
            this.auditoption = resp.spwMain.comment
          }
          if (this.processStatus == 3) {
            this.editPermission = true
            this.auditoption = this.grouperTips
          }
        })
      },
      confirmCommitInfo () {
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let workType = ''
        let processPerson = ''
        if (this.workStype == '' || this.workStype == null) {
          workType = ''
        } else {
          workType = this.workStype
        }
        if (this.performer == '' || this.performer == null) {
          processPerson = ''
        } else {
          processPerson = JSON.stringify(this.ispersonInCharge)
        }
        this.ispersonInCharge.forEach(item => {
          if (item.value === this.personInCharge) {
            this.personInChargeName = item
          }
        })
        if (this.processStatus == 1 || this.processStatus == 2 || this.processStatus == 3) {
          this.personInCharge = ''
        }
        let params = {
          'spwMain': {
            'infoId': this.infoId,
            'taskNo': this.number,
            'workType': workType,
            'workContent': this.workTask,
            'processPerson': processPerson,
            'charger': this.personInChargeName,
            'startDate': this.dimensionQueryForm.beginDate,
            'foreFinishDate': this.dimensionQueryForm.endDate,
            'workArrangement': this.workArrange,
            'workProgress': this.progress,
            'finishDate': this.accomplishtime,
            'processStatus': this.processStatus,
            'comment': this.auditoption
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': this.personInCharge,
          'role': this.role,
          'approve': this.approveFlag,
          'operate': this.opearte
        }
        let isparams = JSON.stringify(params)
        if (Number(this.processStatus === 0)) {
          specialWorklaunch(isparams).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        } else {
          specialWorkexamine(isparams).then((resp) => {
            this.goBack()
            this.callbackMessage(resp)
          })
        }
      },
      setFlagAndSubmitForm (flag) {
        if (flag === 'false') {
          this.$confirm('确定驳回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.approveFlag = 'false'
            this.confirmCommitInfo()
          }).catch(() => {})
        } else {
          this.submitForm()
        }
      },
      submitForm () {
        if (this.processStatus === 0 || this.processStatus === 1 || this.processStatus === 2) {
          if (!this.workTask) {
            this.nullworkTask = true
            return
          }
          if (this.performer.length === 0) {
            this.nullperformer = true
            return
          }
          if (!this.personInCharge) {
            this.nullpersonInCharge = true
            return
          }
          if (!this.dimensionQueryForm.beginDate) {
            this.nullbeginDate = true
            return
          }
          if (!this.dimensionQueryForm.endDate) {
            this.nullendDate = true
            return
          }
          if (!this.workArrange) {
            this.nullworkArrange = true
            return
          }
        }
        if (this.processStatus === 1 || this.processStatus === 2) {
          if (!this.progress) {
            this.nullprogress = true
            return
          }
        }
        if (Number(this.processStatus) === 2 || Number(this.processStatus) === 3) {
          if (!this.auditoption) {
            this.nullAuditoption = true
            return
          }
        }
        this.$confirm('确定提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.confirmCommitInfo()
        }).catch(() => {})
      },
      getFileList () {
        getfilelist(this.infoId).then((resp) => {
          let fileList = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'spw_first_attachment') {
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
        specialWorkhistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
            if (item.proceStatus) {
              this.grouperTips = item.comment
            }
          }
          this.stepsDescription = stepsDescription
          this.deailcasedata = resp.value
        })
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
