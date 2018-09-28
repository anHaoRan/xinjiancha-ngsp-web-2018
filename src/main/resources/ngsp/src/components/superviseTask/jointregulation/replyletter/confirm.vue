<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card class="head">来函信息
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>来函名称</span></el-col>
        <el-col :span="10">
          <el-input disabled v-bind:maxlength=50 v-model="name" placeholder="" size="small"
                    style="width:76%"></el-input>
        </el-col>
        <el-col :span="2"><span style="color:red">*</span><span>来函编号</span></el-col>
        <el-col :span="8">
          <el-input disabled v-bind:maxlength=50 v-model="number" placeholder="" size="small"
                    style="width:76%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>来函单位</span></el-col>
        <el-col :span="4">
          <el-select disabled filterable v-model="unit1" placeholder="" size="small" style="width:90%;"
                     @change="changesendobject">
            <el-option
              v-for="item in isunit1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select disabled filterable v-model="unit2" placeholder="" size="small" style="width:60%;">
            <el-option
              v-for="item in isunit2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2"><span>联系人</span></el-col>
        <el-col :span="8">
          <el-input disabled v-bind:maxlength=50 v-model="contact" size="small" style="width: 76%;"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>来函日期</span></el-col>
        <el-col :span="10">
          <el-input disabled v-model="date" style="width:76%" size="small"></el-input>
        </el-col>
        <el-col :span="2"><span style="color:red">*</span><span>来函方式</span></el-col>
        <el-col :span="10">
          <el-select disabled filterable v-model="way" placeholder="" size="small" style="width:76%;"
                     @change="changematter">
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
          <el-input disabled v-model="style" style="width:76%" size="small"></el-input>
        </el-col>
        <el-col :span="2"><span style="color:red">*</span><span>来函事项</span></el-col>
        <el-col :span="4">
          <el-select disabled filterable v-model="matter1" placeholder="" size="small" style="width:90%;"
                     @change="changematter">
            <el-option
              v-for="item in ismatter1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select disabled filterable v-model="matter2" placeholder="" size="small" style="width:90%;">
            <el-option
              v-for="item in ismatter2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>证券代码</span></el-col>
        <el-col :span="8">
          <stock-code-query :commonData="commonData" size="small" style="width:95%"></stock-code-query>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">来函说明</el-col>
        <el-col :span="18">
          <el-input disabled placeholder="字符限制50以内" v-bind:maxlength=50 type="textarea" v-model="remarktext"
                    size="medium" style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2">来函附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
          <el-upload
            disabled
            class="upload-demo"
            :file-list="filelist1"
            :action=uploadReturnLetterInfoUrl
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
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">相关股票来函记录</el-col>
        <el-table
          style="margin-top:10px;"
          :data="codedata"
          :fit=true
          border>
          <el-table-column
            prop="security"
            label="证券代码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="letterName"
            label="来函名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="letterDate"
            label="来函日期"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="assignPerson"
            label="分配人员"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-card class="head">复函信息
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>证券代码</span></el-col>
        <el-col :span="8">
          <stock-code-query :commonData="commonData1" size="small" style="width:95%"></stock-code-query>
        </el-col>
        <el-col :span="3" v-if="nullbondcode" class="verfynull">证券代码不能为空!</el-col>
        <el-col :span="3">
          <el-radio disabled v-model="coderadio1" label="1" style="margin-top: 8px">无证券代码</el-radio>
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
        <el-col :span="2" style="margin: 8px 0 0 60px;"><span style="color:red">*</span><span>函件编号</span></el-col>
        <el-col :span="8">
          <el-input disabled v-model="letternumber" size="small" style="width: 90%;"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>函件名称</span></el-col>
        <el-col :span="10">
          <el-input disabled v-bind:maxlength=50 v-model="lettername" style="width:76%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span>函件事项</span></el-col>
        <el-col :span="10">
          <el-input disabled v-bind:maxlength=200 v-model="lettermatter" style="width:76%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>发送对象</span></el-col>
        <el-col :span="4">
          <el-select disabled filterable v-model="sendobject1" placeholder="" size="small" style="width:90%;"
                     @change="changesendobject2">
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
        <el-col :span="4">
          <el-select disabled filterable v-model="sendletterstayle" placeholder="" size="small" style="width:90%;">
            <el-option
              v-for="item in issendletterstayle"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span>拟稿人</span></el-col>
        <el-col :span="9">
          <span>{{createpeople}}</span>
        </el-col>
        <el-col :span="3"><span>完成日期</span></el-col>
        <el-col :span="5">
          <span>{{accomplishtime}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
          <el-upload
            class="upload-demo"
            :file-list="filelist2"
            :action=uploadCheckLetterInfoUrl
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
              v-for="item in fileNameList2"
              :key="item">
              {{item}}
            </span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="head">关联线索上报
    </el-card>
    <el-card style="margin-top: 0px;padding-bottom:15px;">
      <el-row style="margin: 20px 0 15px 30px;line-height:40px;">
        <el-col :span="2"><span style="color:red">*</span><span>是否关联线索上报</span></el-col>
        <el-col :span="2">
          <el-radio disabled v-model="cuereportradio" label="1">是</el-radio>
        </el-col>
        <el-col :span="2">
          <el-radio disabled v-model="cuereportradio" label="0">否</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;line-height:40px;">
        <el-col :span="2"><span style="color:red">*</span><span>线索编号</span></el-col>
        <a style="text-decoration:underline;color:#409eff;cursor:pointer;" v-if="dispalyClueReportNumber" @click="routeClueForm">{{clueReportNumber}}</a>
      </el-row>
    </el-card>
    <el-card class="head">您的意见</el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">您的意见</el-col>
        <el-col :span="18">
          <el-input placeholder="字符限制200以内" v-bind:maxlength=200 type="textarea" v-model="auditoption" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px">
        <el-table
          style="margin-top:10px;"
          :data="auditoptiontable"
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
  import moment from 'moment'
  import {
    getletterrecordtable,
    getreplyletterhistoryopiniondata,
    getsurveybuttonname,
    getreplyletterform,
    getnum,
    submitreplyletter,
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
          processName: 'ngsp_uns_check_flow',
          businessData: {},
          userId: ''
        },
        processStatus: 6,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/letterlist',
          label: '联合监管'
        }, {
          router: '',
          label: '联合监管复函表单'
        }],
        selectPersonFlag: false,
        commonData: {
          disabled: true,
          stockCode: [],
          multiple: true,
        },
        commonData1: {
          disabled: true,
          stockCode: [],
          multiple: true
        },
        filelist: [],
        codedata: [],
        auditoptiontable: [],
        issendletterstayle: [{
          value: '电话告知',
          label: '电话告知'
        }, {
          value: '保密邮件',
          label: '保密邮件'
        }, {
          value: '密件交换',
          label: '密件交换'
        }, {
          value: '正式回发函',
          label: '正式回发函'
        }, {
          value: '专人来取',
          label: '专人来取'
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
        isunit1: [{
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
        isunit2: [{
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
        issurverletter: [{
          value: '联合监管',
          label: '联合监管'
        }],
        isassitletter: [{
          value: '复函',
          label: '复函'
        }],
        isway: [{
          value: '5',
          label: '本部门发起'
        }, {
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
          value: '6',
          label: '电子邮件'
        }, {
          value: '4',
          label: '电子生成'
        }],
        ismatter1: [{
          value: '公司定期报告类',
          label: '公司定期报告类'
        }, {
          value: '股价异动',
          label: '股价异动'
        }, {
          value: '股权转让',
          label: '股权转让'
        }, {
          value: '大股东或一致行动人增减持',
          label: '大股东或一致行动人增减持'
        }, {
          value: '公司资产重组',
          label: '公司资产重组'
        }, {
          value: '公司重大投资或战略合作',
          label: '公司重大投资或战略合作'
        }, {
          value: '增发或分拆合并事项',
          label: '增发或分拆合并事项'
        }, {
          value: '媒体舆情报道',
          label: '媒体舆情报道'
        }, {
          value: '其他事项',
          label: '其他事项'
        }],
        ismatter2: [{
          value: '利润分配',
          label: '利润分配'
        }, {
          value: '业绩大幅增长或下降',
          label: '业绩大幅增长或下降'
        }],
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
        unit1: '本所',
        unit2: '上市公司监管一部',
        contact: '',
        date: '',
        way: '',
        style: '',
        matter1: '公司定期报告类',
        matter2: '利润分配',
        remarktext: '',
        auditoption: '',
        coderadio: '0',
        coderadio1: '0',
        surverletter: '联合监管',
        assitletter: '复函',
        letternumber: '',
        lettername: '',
        sendobject1: '本所',
        sendobject2: '市场监察一部',
        sendletterstayle: '电话告知',
        createpeople: '',
        accomplishtime: '',
        replyremarktext: '',
        replypeople: '',
        replydate: '',
        cuereportradio: '0',
        infoId: '',
        buttondispaly: [],
        taskId: '',
        instanceId: '',
        nullbondcode: '',
        lettermatter: '',
        createType: '',
        dispalyClueReportNumber: false,
        clueReportNumber: '',
        clueReportInfoId: '',
        filelist1: [],
        filelist2: [],
        handelstatus: '',
        uploadReturnLetterInfoUrl: '',
        uploadCheckLetterInfoUrl: '',
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        // this.geturlparam()
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
      routeClueForm () {
        window.open(`#/clueReportForm?operate=${'1'}&taskId=${''}&instanceId=${this.clueReportInfoId}`)
      },
      displaySelectPerson () {
        if (this.lettername == '' || this.lettername == null) {
          this.nulllettername = true
          return
        }
        this.selectPersonFlag = true
        this.selectData.dialogFormVisble = true
        this.selectData.activityName = '发函人发函'
        this.selectData.instanceId = ''
        this.selectData.processName = 'ngsp_uns_check_flow'
        this.selectData.businessData = {}
      },
      submitfrom (person) {
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let letterWayText = ''
        for (let item of this.isway) {
          if (item.value == this.way) {
            letterWayText = item.label
          }
        }
        let matter = this.matter1 + ' ' + this.matter2
        let security = ''
        let params = {
          'unsCheckReceive': {
            'infoId': this.infoId,
            'letterName': this.name,
            'letterNo': this.number,
            'fromDept': this.unit1 + ' ' + this.unit2,
            'contackPerson': this.contact,
            'letterDate': this.date,
            'letterWay': this.way,
            'letterWayText': letterWayText,
            'letterType': this.style,
            'matter': matter,
            'security': this.commonData.stockCode.join(';'),
            'instruction': this.remarktext,
            'attachmentId': '',
            'isRpc': this.cuereportradio,
            'infoIdRpc': this.clueReportInfoId,
            'clueTypeBig': this.clueReportNumber,
            'clueTypeSmall': '',
            'processStatus': this.processStatus,
            'comment': this.auditoption,
            'extend2': this.createType
          },
          'unsCheckResp': {
            'infoId': this.infoId,
            'security': security = this.commonData1.stockCode.join(';'),
            'letterType': this.surverletter + ' ' + this.assitletter,
            'letterNo': this.letternumber,
            'letterName': this.lettername,
            'note': this.replyremarktext,
            'target': this.sendobject1 + ' ' + this.sendobject2,
            'respWay': this.sendletterstayle,
            'attachmentId': '',
            'drafter': this.createpeople,
            'sendDate': this.accomplishtime,
            'respPerson': '',
            'respDate': '',
            'extend1': this.lettermatter
          },
          'taskId': this.taskId,
          'instanceId': this.instanceId,
          'approve': 'true',
          'toWhom': person || '',
          'operate': ''
        }
        let isparams = JSON.stringify(params)
        submitreplyletter(isparams).then(() => {
          this.goBack()
        })
      },
      getAllData () {
        getreplyletterform(this.instanceId).then((resp) => {
          this.processStatus = resp.unsCheckReceive.processStatus
          this.infoId = resp.infoId
          this.uploadReturnLetterInfoUrl = '/ngsp/bpm/v1/attachment/upload?fileLoc=uns_check_LetterInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.uploadCheckLetterInfoUrl = '/ngsp/bpm/v1/attachment/upload?fileLoc=uns_check_checkInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.getfilelist()
          this.createType = resp.unsCheckReceive.extend2
          this.name = resp.unsCheckReceive.letterName
          this.number = resp.unsCheckReceive.letterNo
          this.unit1 = resp.unsCheckReceive.fromDept.split(' ')[0]
          this.unit2 = resp.unsCheckReceive.fromDept.split(' ')[1]
          this.auditoption = resp.unsCheckReceive.comment
          this.contact = resp.unsCheckReceive.contackPerson
          this.date = resp.unsCheckReceive.letterDate
          this.way = resp.unsCheckReceive.letterWay
          this.style = resp.unsCheckReceive.letterType
          this.matter1 = resp.unsCheckReceive.matter.split(' ')[0]
          this.matter2 = resp.unsCheckReceive.matter.split(' ')[1]
          this.commonData.stockCode = resp.unsCheckReceive.security.split(';')
          this.remarktext = resp.unsCheckReceive.instruction
          this.cuereportradio = resp.unsCheckReceive.isRpc
          if (resp.unsCheckReceive.isRpc == '1') {
            this.dispalyClueReportNumber = true
            this.clueReportNumber = resp.unsCheckReceive.clueTypeBig
            this.clueReportInfoId = resp.unsCheckReceive.infoIdRpc
          }
          let issecurityid = []
          for (let i = 0; i < this.commonData.stockCode.length; i++) {
            issecurityid[i] = this.commonData.stockCode[i].split(' ')[0]
          }
          let security = issecurityid.join(',')

          if (resp.unsCheckResp.security == '') {
            this.coderadio1 = '1'
          } else {
            this.commonData1.stockCode = resp.unsCheckResp.security.split(';')
          }
          this.surverletter = resp.unsCheckResp.letterType.split(' ')[0]
          this.assitletter = resp.unsCheckResp.letterType.split(' ')[1]
          this.letternumber = resp.unsCheckResp.letterNo
          this.lettername = resp.unsCheckResp.letterName
          this.sendobject1 = resp.unsCheckResp.target.split(' ')[0]
          this.sendobject2 = resp.unsCheckResp.target.split(' ')[1]
          this.sendletterstayle = resp.unsCheckResp.respWay
          this.createpeople = resp.unsCheckResp.drafter
          this.accomplishtime = resp.unsCheckResp.sendDate
          this.replyremarktext = resp.unsCheckResp.note
          this.lettermatter = resp.unsCheckResp.extend1
          getletterrecordtable(security).then((resp) => {
            this.codedata = []
            this.codedata = resp.history
          })
        })
      },
      getfilelist () {
        getfilelist(this.infoId).then((resp) => {
          this.filelist1 = []
          this.filelist2 = []
          this.fileNameList1 = []
          this.fileNameList2 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation == 'uns_check_LetterInfo_attachment') {
              this.filelist1.push({'name': item.fileName, 'fileId': item.fileId})
            }
            if (item.fileLocation == 'uns_check_checkInfo_attachment') {
              this.filelist2.push({'name': item.fileName, 'fileId': item.fileId})
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
        for (let item of this.filelist2) {
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
      getbutton () {
        getsurveybuttonname(this.taskId).then((resp) => {
          for (let item of resp.data.approveTypes) {
            if (item.name == '提交') {
              item.name = '确认'
            }
            this.buttondispaly.push(item.name)
          }
        })
      },
      getnumber () {
        getnum().then((resp) => {
          this.letternumber = resp
          // this.createpeople=this.gfnGetUsername();
          // this.accomplishtime=moment().format('L')
        })
      },
      gethistoryform () {
        getreplyletterhistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.auditoptiontable = resp.value
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
      changesendobject2 () {
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
            this.unit2 = '发行上市部'
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
            this.unit2 = '稽查局'
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
      changesendobject () {
        this.isunit2 = []
        switch (this.unit1) {
          case '本所':
            this.isunit2.push({
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
            this.unit2 = '发行上市部'
            break
          case '证监会':
            this.isunit2.push({
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
            this.unit2 = '稽查局'
            break
          case '地方证监局':
            this.isunit2.push({
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
            this.unit2 = '北京局'
            break
          case '公检法':
            this.isunit2.push({
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
            this.unit2 = '福建省公安厅'
            break
          case '其他单位':
            this.isunit2.push({
              value: '其他单位',
              label: '其他单位'
            })
            this.unit2 = '其他单位'
            break
          case '中金所':
            this.isunit2.push({
              value: '监查部',
              label: '监查部'
            })
            this.unit2 = '监查部'
            break
        }
      },
      changematter () {
        this.ismatter2 = []
        switch (this.matter1) {
          case '公司定期报告类':
            this.ismatter2.push([{
              value: '利润分配',
              label: '利润分配'
            }, {
              value: '业绩大幅增长或下降',
              label: '业绩大幅增长或下降'
            }])
            break
          case '股价异动':
            this.ismatter2.push([{
              value: '股价异动',
              label: '股价异动'
            }])
            break
          case '股权转让':
            this.ismatter2.push([{
              value: '股权转让',
              label: '股权转让'
            }])
            break
          case '大股东或一致行动人增减持':
            this.ismatter2.push([{
              value: '5%以上股东增减持',
              label: '5%以上股东增减持'
            }, {
              value: '一致行动人增减持',
              label: '一致行动人增减持'
            }, {
              value: '公司高管增减持',
              label: '公司高管增减持'
            }])
            break
          case '公司资产重组':
            this.ismatter2.push([{
              value: '资产重组',
              label: '资产重组'
            }, {
              value: '资产重组暂停或终止',
              label: '资产重组暂停或终止'
            }])
            break
          case '公司重大投资或战略合作':
            this.ismatter2.push([{
              value: '对外投资',
              label: '对外投资'
            }, {
              value: '战略合作',
              label: '战略合作'
            }, {
              value: '引入战略股东',
              label: '引入战略股东'
            }])
            break
          case '增发或分拆合并事项':
            this.ismatter2.push([{
              value: '非公开发行',
              label: '非公开发行'
            }, {
              value: '公开发行',
              label: '公开发行'
            }, {
              value: '分拆上市',
              label: '分拆上市'
            }, {
              value: '吸收合并',
              label: '吸收合并'
            }])
            break
          case '媒体舆情报道':
            this.ismatter2.push([{
              value: '媒体报道',
              label: '媒体报道'
            }, {
              value: '市场传闻',
              label: '市场传闻'
            }])
            break
          case '其他事项':
            this.ismatter2.push([{
              value: '其他事项',
              label: '其他事项'
            }])
            break
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
