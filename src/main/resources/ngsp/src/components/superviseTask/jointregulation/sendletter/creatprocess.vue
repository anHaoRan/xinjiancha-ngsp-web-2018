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
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode" size="small"
                            style="width:95%"></stock-code-query>
        </el-col>
        <el-col :span="3">
          <el-radio @change="isnullcode" v-model="coderadio" label="0" style="margin-top: 8px">无证券代码</el-radio>
        </el-col>
        <el-col :span="3" v-if="nullbondcode" class="verfynull" style="margin-left: 0%;">证券代码不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>函件类型</span></el-col>
        <el-col :span="4">
          <el-select filterable v-model="surverletter" placeholder="" size="small" style="width:90%;">
            <el-option
              v-for="item in issurverletter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select filterable v-model="assitletter" placeholder="" size="small" style="width:90%;">
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
          <el-input v-bind:maxlength=50 v-model="lettername" style="width:76%" size="small"
                    @change="isnulllettername"></el-input>
        </el-col>
        <el-col :span="3" v-if="nulllettername" class="verfynull" style="margin-left: 0%;">函件名称不能为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>发送对象</span></el-col>
        <el-col :span="4">
          <el-select filterable v-model="sendobject1" placeholder="" size="small" style="width:90%;"
                     @change="changesendobject">
            <el-option
              v-for="item in issendobject1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select filterable v-model="sendobject2" placeholder="" size="small" style="width:90%;">
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
        <el-col :span=2>
          <el-checkbox v-model="checked1" @change="issentway">本部门存档</el-checkbox>
        </el-col>
        <el-col :span=2>
          <el-checkbox v-model="checked2" @change="issentway">传真</el-checkbox>
        </el-col>
        <el-col :span=2>
          <el-checkbox v-model="checked3" @change="issentway">纸质</el-checkbox>
        </el-col>
        <el-col :span=2>
          <el-checkbox v-model="checked4" @change="issentway">电话</el-checkbox>
        </el-col>
        <el-col :span=2>
          <el-checkbox v-model="checked5" @change="issentway">口头通知</el-checkbox>
        </el-col>
        <el-col :span=2>
          <el-checkbox v-model="checked6" @change="issentway">电子邮件</el-checkbox>
        </el-col>
        <el-col :span=2>
          <el-checkbox v-model="checked7" @change="issentway">OA</el-checkbox>
        </el-col>
        <el-col :span="3" v-if="nullsentway" class="verfynull" style="margin-left: 0%;">发送方式不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">备注</el-col>
        <el-col :span="18">
          <el-input placeholder="字符限制1000以内" v-bind:maxlength=1000 type="textarea" v-model="remarktext" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>发函附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
          <el-upload
            class="upload-demo"
            :file-list="filelist1"
            :action=uploadLetterInfourl
            :on-preview="handelpreview"
            :on-success="getfileID"
            :on-remove="deletefilelist"
            style="display:inline-block"
          >
            <el-button
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
        <el-col :span="3" v-if="nullfile" class="verfynull" style="margin-left: -60%;">发函附件不能为空!</el-col>
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
      <el-row style="margin: 20px 0 15px 30px;" v-if="deailcasedataflag">
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
        <el-button @click="goBack" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
      </span>
      <span v-if="newcreat">
        <el-button @click="saveall" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0">保存</el-button>
      </span>
      <span v-if="newcreat">
        <el-button @click="displaySelectPerson" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">提交</el-button>
      </span>
    </div>
  </div>
</template>
<script>
  import Breadcrumb from '../../../common/Breadcrumb'
  import moment from 'moment'
  import StockCodeQuery from '../../../common/StockCodeQuery'
  import {
    postsendletterprocessform,
    getsendletternum,
    postsaveprocessform,
    getsendletterform,
    getsendletterhistoryopiniondata,
    getdisplaywarninfo,
    getInfoId,
    getfilelist,
    ispermitload,
    deletefile,
    getActivityNameByProcessName
  } from '../../../../service/superviseTask/index.js'
  import { add0, dateformat, timeformat, tabletimeformat } from '../../../../utils/dateTimeFormat.js'
  import selectPersonComponent from '../../superviseTaskComponent/selectPersonComponent'
  import MinxinVue from '../../MixIn'
  import MixinAuthority from '../../MixinAuthority'

  export default {
    components: {
      Breadcrumb,
      StockCodeQuery,
      selectPersonComponent
    },
    mixins: [MinxinVue, MixinAuthority],
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
        processStatus: 0,
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
        commonData: {
          disabled: false,
          stockCode: [],
          multiple: true,
        },
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
        coderadio: '',
        surverletter: '联合监管',
        assitletter: '联合监管发函',
        letternumber: '',
        lettername: '',
        sendobject1: '本所',
        sendobject2: '上市公司监管一部',
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
        auditoption: '',
        newcreat: false,
        infoId: '',
        taskId: '',
        instanceId: '',
        sendsecurityId: '',
        sendstockName: '',
        deailcasedata: [],
        deailcasedataflag: false,
        createType: '1',
        alarmId: '',
        nulllettername: false,
        nullsentway: false,
        isopearte: '',
        filelist1: [],
        handelstatus: '',
        uploadLetterInfourl: '',
        nullfile: false,
        showUploadButton: true,
        fileNameList1: []
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus, params, alarmId} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        if (params) {
          let paramsInfo = JSON.parse(params)
          if (paramsInfo.createType == '2') {
            this.newcreat = true
            this.commonData.stockCode.push(paramsInfo.stockCode + ' ' + paramsInfo.stockCodeName)
            this.createType = '0'
            this.getletternumber()
            this.isopearte = 'new'
            this.getInfoId()
          }
        } else if (alarmId) {
          this.newcreat = true
          this.createType = '0'
          this.alarmId = alarmId
          this.warnturninto()
          this.isopearte = 'new'
          this.getInfoId()
        } else {
          this.handelstatus = operate
          this.taskId = taskId
          this.instanceId = instanceId
        }
        if (operate == '1') {
          this.newcreat = false
          this.getAllData()
          this.gethistoryform()
        } else if (operate == '2') {
          this.newcreat = true
          this.getAllData()
          this.gethistoryform()
        } else {
          this.newcreat = true
          this.getletternumber()
          this.isopearte = 'new'
          this.getInfoId()
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
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
          this.uploadLetterInfourl = '/ngsp/bpm/v1/attachment/upload?fileLoc=uns_send_LetterInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
        })
      },
      displaySelectPerson () {
        if (this.lettername == '' || this.lettername == null) {
          this.nulllettername = true
          return
        }
        if (this.commonData.stockCode == '' && this.coderadio == '') {
          this.nullbondcode = true
          return
        }
        if (this.checked1 == false && this.checked2 == false && this.checked3 == false && this.checked4 == false && this.checked5 == false && this.checked6 == false && this.checked7 == false) {
          this.nullsentway = true
          return
        }
        if (this.filelist1.length == 0) {
          this.nullfile = true
          return
        }
        this.selectPersonFlag = true
        this.selectData.dialogFormVisble = true
        this.selectData.activityName = '组长审批'
        this.selectData.instanceId = ''
        this.selectData.processName = 'ngsp_uns_send_flow'
        this.selectData.businessData = {}
      },
      issentway () {
        if (this.checked1 == false && this.checked2 == false && this.checked3 == false && this.checked4 == false && this.checked5 == false && this.checked6 == false && this.checked7 == false) {
          this.nullsentway = true
        } else {
          this.nullsentway = false
        }
      },
      isnulllettername () {
        if (this.lettername == '' || this.lettername == null) {
          this.nulllettername = true
        } else {
          this.nulllettername = false
        }
      },
      warnturninto () {
        getdisplaywarninfo(this.alarmId).then((resp) => {
          for (let item of resp.wBasicList.bizData.metaData) {
            this.commonData.stockCode = [item.securities_code + ' ' + item.securities_name]
          }
        })
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
              value: '上市公司监察二部',
              label: '上市公司监察二部'
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
              value: '市场监察部',
              label: '市场监察部'
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
            }, {
              value: '辽宁本溪公安',
              label: '辽宁本溪公安'
            }, {
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
      gethistoryform () {
        getsendletterhistoryopiniondata(this.instanceId).then((resp) => {
          if (resp.value.length == 0 || resp.value == '无查询结果') {
            this.deailcasedataflag = false
          } else {
            this.deailcasedataflag = true
            let stepsDescription = []
            for (let item of resp.value) {
              stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
              item.proceStatus = this.steps[item.proceStatus]
            }
            this.stepsDescription = stepsDescription
            this.deailcasedata = resp.value
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
            this.commonData.stockCode = ''
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
            this.commonData.stockCode = isbondcode
          }
          this.surverletter = resp.unsSendMain.letterType1
          this.assitletter = resp.unsSendMain.letterType2
          this.letternumber = resp.unsSendMain.letterNo
          this.auditoption = resp.unsSendMain.comment
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
          // this.auditoption=   resp.unsSendMain.comment
        })
      },
      getletternumber () {
        getsendletternum().then((resp) => {
          this.letternumber = resp
          this.createpeople = this.gfnGetRealName()
          this.accomplishtime = moment().format('L')
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
      saveall () {
        if (this.lettername == '' || this.lettername == null) {
          this.nulllettername = true
          return
        }
        if (this.commonData.stockCode == '' && this.coderadio == '') {
          this.nullbondcode = true
          return
        }
        if (this.checked1 == false && this.checked2 == false && this.checked3 == false && this.checked4 == false && this.checked5 == false && this.checked6 == false && this.checked7 == false) {
          this.nullsentway = true
          return
        }
        if (this.filelist1.length == 0) {
          this.nullfile = true
          return
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let analyseResult = ''
        let ismesureradio = ''
        let issecurityid = []
        let isstockname = []
        for (let i = 0; i < this.commonData.stockCode.length; i++) {
          issecurityid[i] = this.commonData.stockCode[i].split(' ')[0]
          isstockname[i] = this.commonData.stockCode[i].split(' ')[1]
        }
        let securityid = issecurityid.join(',')
        let stockname = isstockname.join(',')
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
            'securityId': securityid,
            'stockName': stockname,
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
            'comment': this.auditoption,
            'createType': this.createType,
            'extend1': this.alarmId,
          },
          'taskId': this.taskId,
          'instanceId': this.instanceId,
          'operate': this.isopearte,
        }
        let isparams = JSON.stringify(params)
        postsaveprocessform(isparams).then((resp) => {
          this.isopearte = ''
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        })
      },
      submitfrom (person) {
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let analyseResult = ''
        let ismesureradio = ''
        let issecurityid = []
        let isstockname = []
        for (let i = 0; i < this.commonData.stockCode.length; i++) {
          issecurityid[i] = this.commonData.stockCode[i].split(' ')[0]
          isstockname[i] = this.commonData.stockCode[i].split(' ')[1]
        }
        let securityid = issecurityid.join(',')
        let stockname = isstockname.join(',')
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
            'securityId': securityid,
            'stockName': stockname,
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
            'comment': this.auditoption,
            'createType': this.createType,
            'extend1': this.alarmId,
          },
          'taskId': this.taskId,
          'instanceId': this.instanceId,
          'toWhom': person,
          'operate': this.isopearte
        }
        let isparams = JSON.stringify(params)
        postsendletterprocessform(isparams).then((resp) => {
          const {from} = this.$route.query
          if (from === 'fromFlow') {
            this.$router.go(-1)
          } else {
            this.$router.push({path: '/letterlist'})
          }
        })
      },
      isnullcode () {
        this.commonData.stockCode = []
        this.nullbondcode = false
      },
      getStockCode (stockCodeData) {
        this.coderadio = ''
        this.commonData.stockCode = stockCodeData
        if (this.commonData.stockCode == '' && this.coderadio == '') {
          this.nullbondcode = true
        } else {
          this.nullbondcode = false
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
        this.nullfile = false
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
