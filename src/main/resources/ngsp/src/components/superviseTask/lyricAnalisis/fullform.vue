<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card v-if="formCard1Show">
      <el-tabs>
        <el-tab-pane label="舆情基本信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>舆情编号</span></el-col>
        <el-col :span="22">
          <el-input disabled v-model="number" placeholder="" size="small" class="custom-width"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>舆情标题</span></el-col>
        <el-col :span="18">
          <el-input :disabled="formCard1Disabled" v-bind:maxlength=50 v-model="name" placeholder="" size="small"
                    style="width:92.5%" @change="isdisplayaction(name,'1')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullname" class="verfynull" style="margin-left:-4%">舆情标题不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>舆情来源</span></el-col>
        <el-col :span="4">
          <el-select :disabled="formCard1Disabled" filterable v-model="lyricfrom1" placeholder="" size="small" style="width:95%;"
                     @change="changelyricfrom2">
            <el-option
              v-for="item in islyricfrom1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select :disabled="formCard1Disabled" filterable v-model="lyricfrom2" placeholder="" size="small" style="width:95%;">
            <el-option
              v-for="item in islyricfrom2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>发布时间</span></el-col>
        <el-col :span="4" style="width:16%">
          <el-date-picker
            v-model="publishtime"
            type="date"
            :disabled="formCard1Disabled"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOption"
            @change="isdisplayaction(publishtime,'2')"
            size="small">
          </el-date-picker>
        </el-col>
        <el-col :span="2" v-if="nullpublishtime" class="verfynull" style="margin-left:0%">发布时间不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>舆情正文</el-col>
        <el-col :span="18">
          <el-input :disabled="formCard1Disabled" v-bind:maxlength=2000 type="textarea" v-model="lyrictext" size="medium"
                    style="width:92.5%" @change="isdisplayaction(lyrictext,'3')"></el-input>
        </el-col>
        <el-col :span="2" v-if="nulllyrictext" class="verfynull" style="margin-left:-4%">舆情正文不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>舆情类别</el-col>
        <el-col :span="18">
          <el-radio :disabled="formCard1Disabled" v-model="lyrictype" label="0" @change="displayStockCode">个股信息</el-radio>
          <el-radio :disabled="formCard1Disabled" v-model="lyrictype" label="1" @change="displayStockCode">热点报道</el-radio>
          <el-radio :disabled="formCard1Disabled" v-model="lyrictype" label="2" @change="displayStockCode">宏观信息</el-radio>
          <el-radio :disabled="formCard1Disabled" v-model="lyrictype" label="3" @change="displayStockCode">市场信息</el-radio>
          <el-radio :disabled="formCard1Disabled" v-model="lyrictype" label="4" @change="displayStockCode">研究报告</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;" v-if="StockCode">
        <el-col :span="2"><span style="color:red">*</span><span>证券代码</span></el-col>
        <el-col :span="5">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode" size="small"
                            style="width:95%"></stock-code-query>
        </el-col>
        <el-col :span="3">
          <el-radio :disabled="formCard1Disabled" v-model="coderadio" label="0" style="margin-top: 8px" @change="nullstockcode">
            无证券代码
          </el-radio>
        </el-col>
        <el-col :span="3" v-if="nullbondcode" class="verfynull" style="margin-left:0%">证券代码不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>舆情特征描述</el-col>
        <el-col :span='4'>
          <el-select :disabled="formCard1Disabled" v-model="lyricdescription" placeholder="" size="small" style="width:95%;"
                     @change="isdisplayaction(lyricdescription,'4')">
            <el-option
              v-for="item in islyricdescription"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="18">
          <el-input :disabled="isedit" type="textarea" v-model="lyricdescription" size="medium" style="width:92.5%" @change="isdisplayaction(lyricdescription,'4')"></el-input>
        </el-col> -->
        <el-col :span="3" v-if="nulllyricdescription" class="verfynull" style="margin-left:0%">舆情特征描述不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>是否重点事件</el-col>
        <el-col :span="3">
          <el-radio :disabled="formCard1Disabled" v-model="isemphasisradio" label="1">是</el-radio>
          <el-radio :disabled="formCard1Disabled" v-model="isemphasisradio" label="0">否</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2">附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
          <el-upload
            class="upload-demo"
            :disabled="formCard1Disabled"
            :file-list="filelist1"
            :action=uploadBasicInfoUrl
            :on-preview="handelpreview"
            :on-success="getfileID"
            :on-remove="deletefilelist"
            style="display:inline-block"
          >
            <el-button
              type="text"
              size="small"
              :disabled="formCard1Disabled"
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
        <el-col :span="2"><span>搜索关键字</span></el-col>
        <el-col :span="22">
          <el-input class="custom-width" :disabled="formCard1Disabled" v-model="keyword" size="small" :maxlength="50" placeholder="输入内容在50字以内"></el-input>
          注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="formCard2Show">
      <el-tabs>
        <el-tab-pane label="处理信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>修改信息</el-col>
        <el-col :span="18">
          <el-input :disabled="formCard2Disabled" type="textarea" v-bind:maxlength=200 v-model="modifyInfo" size="medium"
                    style="width:92.5%"
                    @change="isdisplayaction(modifyInfo,'5')"></el-input>
        </el-col>
        <el-col :span="3" v-if="nullmodifyInfo" class="verfynull" style="margin-left:0%">修改信息不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>处理意见</el-col>
        <el-col :span="18">
          <el-input :disabled="formCard2Disabled" type="textarea" v-bind:maxlength=200 v-model="suggestion" size="medium"
                    style="width:92.5%"
                    @change="isdisplayaction(suggestion,'6')"></el-input>
        </el-col>
        <el-col :span="3" v-if="nullsuggestion" class="verfynull" style="margin-left:0%">处理意见不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>是否关联线索报告</span></el-col>
        <el-col :span="1">
          <el-radio :disabled="formCard2Disabled||clueReportRadio" v-model="isCrp" label="1" @change="showClueReportForm">是
          </el-radio>
        </el-col>
        <el-col :span="3">
          <el-radio :disabled="formCard2Disabled||clueReportRadio" v-model="isCrp" label="0" @change="UnshowClueReportForm">否
          </el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;" v-if="dispalyClueReport||dispalyClueReportNumber">
        <el-col :span="2"><span style="color:red">*</span><span>线索编号</span></el-col>
        <el-col :span="2" v-if="dispalyClueReport"><span>{{clueReportNumber}}</span></el-col>
        <a style="text-decoration:underline;color:#409eff;cursor:pointer;" v-if="dispalyClueReportNumber" @click="routeClueForm">{{clueReportNumber}}</a>
        <el-col :span="2" v-if="dispalyClueReport"><span style="color:red">*</span><span>线索名称</span></el-col>
        <el-col :span="3" v-if="dispalyClueReport">
          <el-input v-model="ClueReportName" placeholder="输入内容在20个字以内" size="small" :maxlength="20"
                    @change="unDisplayNameTip"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullClueReportName" class="verfynull" style="margin-left:0%">线索名称不能为空!</el-col>
        <el-col :span="2" v-if="dispalyClueReport"><span style="color:red">*</span><span>线索分类</span></el-col>
        <el-col :span="2" v-if="dispalyClueReport">
          <el-radio v-model="clueRportstyle" label="0">关注类</el-radio>
        </el-col>
        <el-col :span="2" v-if="dispalyClueReport">
          <el-radio v-model="clueRportstyle" label="1">调查类</el-radio>
        </el-col>
        <el-col :span="2" v-if="dispalyClueReport"><span style="color:red">*</span><span>是否线索上报</span></el-col>
        <el-col :span="2" v-if="dispalyClueReport">
          <el-radio v-model="isClueReport" label="1">是</el-radio>
        </el-col>
        <el-col :span="2" v-if="dispalyClueReport">
          <el-radio v-model="isClueReport" label="0">否</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;" v-if="dispalyClueReport">
        <el-col :span="2"><span style="color:red">*</span><span>线索类型</span></el-col>
        <el-checkbox-group v-model="clueRportType">
          <el-checkbox label="内幕交易" name="clueRportType" @change="undisplaytip"></el-checkbox>
          <el-checkbox label="市场操纵" name="clueRportType" @change="undisplaytip"></el-checkbox>
          <el-checkbox label="利益输送—股票" name="clueRportType" @change="undisplaytip"></el-checkbox>
          <el-checkbox label="利益输送—债券" name="clueRportType" @change="undisplaytip"></el-checkbox>
          <el-checkbox label="超比例持股" name="clueRportType" @change="undisplaytip"></el-checkbox>
          <el-checkbox label="老鼠仓" name="clueRportType" @change="undisplaytip"></el-checkbox>
          <el-checkbox label="短线交易" name="clueRportType" @change="undisplaytip"></el-checkbox>
          <el-checkbox label="其它—股票" name="clueRportType" @change="undisplaytip"></el-checkbox>
          <el-checkbox label="其它—债券" name="clueRportType" @change="undisplaytip"></el-checkbox>
        </el-checkbox-group>
        <el-col :span="2" v-if="nullclueRportType" class="verfynull" style="margin-left:-1%">线索类型不能为空!</el-col>
      </el-row>
      <el-col :span="2" v-if="dispalyClueReport" style="margin: 20px 0 15px 30px;">线索描述</el-col>
      <el-col :span="18" v-if="dispalyClueReport">
        <el-input type="textarea" v-bind:maxlength=200 v-model="ClueReportDec" size="medium"
                  style="width:92.5%"></el-input>
      </el-col>
      <el-row style="margin: 20px 0 15px 30px;" v-if="isreport">
        <el-table
          style="margin-top:10px;"
          :data="codedata"
          :fit=true
          border>
          <el-table-column
            prop="security"
            label="账户代码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="letterName"
            label="账户名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="letterDate"
            label="会员名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="extend1"
            label="营业部名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="extend1"
            label="一码通"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="extend1"
            label="账户分类"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-card v-if="suggestShow">
      <el-tabs>
        <el-tab-pane label="您的意见" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2">您的意见</el-col>
        <el-col :span="18">
          <el-input :disabled="suggestDisabled" type="textarea" v-model="auditoption" placeholder="字符限制200以内"
                    v-bind:maxlength=200 size="medium" style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px">
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
    </div>
    <div v-for="item in buttondispaly">
      <span>
        <el-button type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="submitfrom(item)">{{item}}</el-button>
      </span>
    </div>
    <selectPersonComponent :selectData="selectData" @obdSelectPerson="confirmCommitInfo" ref="selectPersonComponent"
                           v-if="selectData.dialogFormVisble"></selectPersonComponent>
  </div>
</template>
<script>
  import moment from 'moment'
  import {formAuthority} from './formAuthority'
  import {
    postlyricdata,
    lyricexamine,
    lyricsave,
    lyrichistoryopiniondata,
    getbuttonname,
    getClueReportnum,
    ClueReportsave,
    getInfoId,
    getUserRoles,
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

  export default {
    mixins: [MinxinVue],
    computed: {
      formCard1Disabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard1']['disabled']
      },
      formCard2Disabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard2']['disabled']
      },
      suggestDisabled() {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['suggestForm']['disabled']
      },
      formCard1Show() {
        return formAuthority[this.processStatus]['formCard1']['show']
      },
      formCard2Show() {
        return formAuthority[this.processStatus]['formCard2']['show']
      },
      suggestShow() {
        return formAuthority[this.processStatus]['suggestForm']['show']
      }
    },
    watch: {
      formCard1Disabled(val) {
        this.commonData.disabled = val
      }
    },
    data () {
      return {
        keyword: '',
        steps: [],
        stepsDescription: [],
        acivityNameArray: [],
        selectData: {
          dialogFormVisble: false,
          activityName: '',
          instanceId: '',
          processName: 'ngsp_poa_flow',
          businessData: {},
          userId: ''
        },
        approveFlag: 'true',
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/lyricTablelist',
          label: '舆情分析'
        }, {
          router: '',
          label: '舆情分析表单'
        }],
        commonData: {
          disabled: false,
          stockCode: [],
          multiple: true,
        },
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        processinfo6: '',
        processinfo7: '',
        processinfo8: '',
        filelist1: [],
        handelstatus: '',
        uploadBasicInfoUrl: '',
        name: '',
        lyricfrom1: '证券行业三大报',
        islyricfrom1: [{
          value: '证券行业三大报',
          label: '证券行业三大报'
        }, {
          value: '主流财经媒体门户网站',
          label: '主流财经媒体门户网站'
        }, {
          value: '民间论坛股吧',
          label: '民间论坛股吧'
        }, {
          value: 'APP',
          label: 'APP'
        }, {
          value: '香港平面媒体',
          label: '香港平面媒体'
        }, {
          value: '香港网络媒体',
          label: '香港网络媒体'
        }],
        lyricfrom2: '中国证券报',
        islyricfrom2: [{
          value: '中国证券报',
          label: '中国证券报'
        }, {
          value: '证券时报',
          label: '证券时报'
        }, {
          value: '上海证券报',
          label: '上海证券报'
        }],
        publishtime: '',
        lyrictext: '',
        lyrictype: '0',
        coderadio: '',
        // 线索报告
        clueRportstyle: '1',
        clueReportNumber: '',
        clueRportType: [],
        dispalyClueReport: false,
        clueReportInfoId: '',
        nullclueRportType: false,
        clueProcess: 0,
        dispalyClueReportNumber: false,
        clueReportRadio: false,
        //
        buttondispaly: [],
        lyricdescription: '',
        islyricdescription: [{
          value: '涨跌幅',
          label: '涨跌幅'
        }, {
          value: '舆论关注',
          label: '舆论关注'
        }, {
          value: '领导讲话',
          label: '领导讲话'
        }, {
          value: '处罚结果',
          label: '处罚结果'
        }, {
          value: '质疑-内幕',
          label: '质疑-内幕'
        }, {
          value: '质疑-操纵',
          label: '质疑-操纵'
        }, {
          value: '质疑-老鼠仓',
          label: '质疑-老鼠仓'
        }, {
          value: '质疑-对倒',
          label: '质疑-对倒'
        }, {
          value: '质疑-大宗交易',
          label: '质疑-大宗交易'
        }, {
          value: '其他',
          label: '其他'
        }],
        isemphasisradio: '0',
        newcreat: false,
        opearte: '',
        auditoption: '',
        deailcasedata: [],
        StockCode: true,
        modifyInfo: '',
        suggestion: '',
        // isedit: false,
        isCrp: '0',
        isreport: false,
        number: '',
        isClueReport:'1',
        typeradio: '0',
        ClueReportName: '',
        ClueReportDec: '',
        nullClueReportName: false,
        codedata: [],
        processStatus: 0,
        nullname: false,
        nullpublishtime: false,
        nulllyrictext: false,
        nullbondcode: false,
        nulllyricdescription: false,
        nullmodifyInfo: false,
        nullsuggestion: false,
        extend: '',
        pickerOption: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.publishtime).getTime() - 3600 * 1000 * 24
          }
        }
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      // 获取activityName
      this.reqActivityNameByProcessName(() => {
        this.date = moment().format('L')
        this.handelstatus = operate
        this.opearte = operate
        if (this.opearte == '-1' || this.opearte == '-2') {

        } else {
          this.taskId = taskId
          this.instanceId = instanceId
        }
        if (this.opearte == '1') {
          this.newcreat = false
          this.getAllData()
          this.gethistoryform()
        } else if (this.opearte == '2') {
          this.newcreat = true
          this.getAllData()
          this.gethistoryform()
          this.getbutton()
        } else {
          this.newcreat = true
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
      routeClueForm () {
        window.open(`#/clueReportForm?operate=${'1'}&taskId=${''}&instanceId=${this.clueReportInfoId}`)
        // window.open(window.location.origin+'/clueReportForm?operate=' + "1" +"&taskId="+""+"&instanceId="+this.clueReportInfoId)
      },
      getRole () {
        let username = this.gfnGetUsername()
        getUserRoles(username).then((resp) => {
          if (resp[0].rolename.indexOf('实时') >= 0) {
            this.clueProcess = 0
          }
          if (resp[0].rolename.indexOf('线索') >= 0 && resp[0].rolename.indexOf('组员') >= 0) {
            this.clueProcess = 3
          }
          if (resp[0].rolename.indexOf('线索') >= 0 && resp[0].rolename.indexOf('组长') >= 0) {
            this.clueProcess = 2
          }
        })
      },
      undisplaytip () {
        this.nullclueRportType = false
      },
      unDisplayNameTip () {
        this.nullClueReportName = false
      },
      getClueReportInfoId () {
        getInfoId().then((resp) => {
          this.clueReportInfoId = resp
        })
      },
      showClueReportForm () {
        this.dispalyClueReport = true
        this.getClueReportInfoId()
        this.getClueReportnumber()
        this.getRole()
      },
      UnshowClueReportForm () {
        this.dispalyClueReport = false
      },
      getClueReportnumber () {
        getClueReportnum().then((resp) => {
          this.clueReportNumber = resp
        })
      },
      clueReportsaveall () {
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let security = ''
        let clueTypeText = []
        let clueType = []
        for (let i = 0; i < this.clueRportType.length; i++) {
          switch (this.clueRportType[i]) {
            case '内幕交易':
              clueType.push('0')
              clueTypeText.push('内幕交易')
              break
            case '市场操纵':
              clueType.push('1')
              clueTypeText.push('市场操纵')
              break
            case '利益输送—股票':
              clueType.push('2')
              clueTypeText.push('利益输送—股票')
              break
            case '利益输送—债券':
              clueType.push('3')
              clueTypeText.push('利益输送—债券')
              break
            case '超比例持股':
              clueType.push('4')
              clueTypeText.push('超比例持股')
              break
            case '老鼠仓':
              clueType.push('5')
              clueTypeText.push('老鼠仓')
              break
            case '短线交易':
              clueType.push('6')
              clueTypeText.push('短线交易')
              break
            case '其它—股票':
              clueType.push('7')
              clueTypeText.push('其它—股票')
              break
            case '其它—债券':
              clueType.push('8')
              clueTypeText.push('其它—债券')
              break
          }
        }
        let letterSecurity = ''
        if (this.commonData.stockCode.length == 0) {
          letterSecurity = ''
        } else {
          letterSecurity = this.commonData.stockCode.join(';')
        }
        let params = {
          'crpMain': {
            'infoId': this.clueReportInfoId,
            'extend1': this.clueReportNumber,
            'security': letterSecurity,
            'clueName': this.ClueReportName,
            'clueDesc': this.ClueReportDec,
            'needReport': this.isClueReport,
            'clueBranch': this.clueRportstyle,
            'clueType': clueType.join(','),
            'clueTypeText': clueTypeText.join(','),
            'sourceType': '1',
            'sourceTypeText': '舆情分析',
            'source': this.number,
            'letterSecurity': '',
            'letterType': '',
            'letterNo': '',
            'letterName': '',
            'fkDepartment': '',
            'sendDepartment': '',
            'sendWay': '',
            'note': '',
            'sendPerson': '',
            'sendDate': '',
            'createFrom': 'ngsp_uns_check_flow',
            'fromInfoId': this.infoId,
            'fromTitle': this.number,
            'processStatus': this.clueProcess,
            'comment': '',
          },
          'accountinfo': [],
          'accountGroup': [],
          'monitorSecurity': [],
          'instanceId': '',
          'taskId': '',
          'toWhom': '',
          'approve': 'true',
          'operate': 'new',
        }
        let isparams = JSON.stringify(params)
        ClueReportsave(isparams).then((resp) => {
          this.$message({
            showClose: true,
            message: '线索报告保存成功',
            type: 'success',
          })
        })
      },
      isdisplayaction (value, flag) {
        if (!value) {
          switch (flag) {
            case '1':
              this.nullname = true
              break
            case '2':
              this.nullpublishtime = true
              break
            case '3':
              this.nulllyrictext = true
              break
            case '4':
              this.nulllyricdescription = true
              break
            case '5':
              this.nullmodifyInfo = true
              break
            case '6':
              this.nullsuggestion = true
              break
          }
        } else {
          switch (flag) {
            case '1':
              this.nullname = false
              break
            case '2':
              this.nullpublishtime = false
              break
            case '3':
              this.nulllyrictext = false
              break
            case '4':
              this.nulllyricdescription = false
              break
            case '5':
              this.nullmodifyInfo = false
              break
            case '6':
              this.nullsuggestion = false
              break
          }
        }
      },
      saveall () {
        if (!this.name) {
          this.nullname = true
          return
        }
        if (!this.publishtime) {
          this.nullpublishtime = true
          return
        }
        if (!this.lyrictext) {
          this.nulllyrictext = true
          return
        }
        if (this.StockCode === true) {
          if (!this.commonData.stockCode[0] && !this.coderadio) {
            this.nullbondcode = true
            return
          }
        }
        if (!this.lyricdescription) {
          this.nulllyricdescription = true
          return
        }
        if (!this.modifyInfo) {
          this.nullmodifyInfo = true
          return
        }
        if (!this.suggestion) {
          this.nullsuggestion = true
          return
        }
        if (this.isCrp == '1') {
          if (this.clueReportRadio == false) {
            if (this.clueRportType.length == 0) {
              this.nullclueRportType = true
              return
            } else {
              // this.clueReportsaveall()
            }
            if (!this.ClueReportName) {
              this.nullClueReportName = true
              return
            } else {
              // this.clueReportsaveall()
            }
            if (this.clueRportType.length == 0 || (!this.ClueReportName)) {
            } else {
              this.clueReportsaveall()
            }
          }
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let security = ''
        if (this.coderadio == '0') {
          security = ''
        }
        if (this.commonData.stockCode != '') {
          security = this.commonData.stockCode.join(';')
        }
        let params = {
          'poaMain': {
            'infoId': this.infoId,
            'title': this.name,
            'sourceFrom': this.lyricfrom1 + ' ' + this.lyricfrom2,
            'sourceTime': this.publishtime,
            'mainText': this.lyrictext,
            'sourceType': this.lyrictype,
            'security': security,
            'featureDesc': this.lyricdescription,
            'isImportant': this.isemphasisradio,
            'modifyInfo': this.modifyInfo,
            'suggestion': this.suggestion,
            'isCrp': this.isCrp,
            'infoIdCrp': this.clueReportInfoId,
            'extend3': this.clueReportNumber,
            'processStatus': this.processStatus,
            'comment': this.auditoption,
            'createType': '1',
            'extend2': this.number,
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': '',
          'role': this.role,
          'approve': 'true',
          'keyword': this.keyword,
          'operate': this.opearte,
        }
        let isparams = JSON.stringify(params)
        lyricsave(isparams).then((resp) => {
          this.opearte = ''
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success',
          })
        })
      },
      getAllData () {
        postlyricdata(this.instanceId).then((resp) => {
          // this.processStatus = resp.poaMain.processStatus
          // 获取ActivityName
          // this.reqActivityNameByProcessName()
          if (!resp.poaMain.extend2) {

          } else {
            this.number = resp.poaMain.extend2
          }
          if (!resp.poaMain.extend1) {

          } else {
            this.extend1 = resp.poaMain.extend1
          }
          // if (this.opearte == '1') {
          //   this.isedit = true
          //   this.commonData.disabled = true
          // }
          // if (this.opearte == '2') {
          //   if (this.processStatus == 7 || this.processStatus == 6) {
          //     this.isedit = true
          //     this.commonData.disabled = true
          //   } else {
          //     this.isedit = false
          //     this.commonData.disabled = false
          //   }
          // }
          // switch(resp.poaMain.processStatus){
          //   case 0:this.displayopinion=false;this.creating=true;break;
          //   case 1:this.displayopinion=true;this.creating=false;this.finish=true;this.send=true;break;
          //   case 2:this.displayopinion=true;this.creating=false;this.assign=true;break;
          // }
          this.keyword = resp.keyword
          this.infoId = resp.infoId
          this.uploadBasicInfoUrl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=poa_BasicInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.getfilelist()
          this.name = resp.poaMain.title
          this.lyricfrom1 = resp.poaMain.sourceFrom.split(' ')[0]
          this.lyricfrom2 = resp.poaMain.sourceFrom.split(' ')[1]
          this.publishtime = resp.poaMain.sourceTime
          this.lyrictext = resp.poaMain.mainText
          this.auditoption = resp.poaMain.comment
          this.lyrictype = resp.poaMain.sourceType
          if (this.lyrictype == '0') {
            this.StockCode = true
          } else {
            this.StockCode = false
          }
          if (resp.poaMain.security == '') {
            this.coderadio = '0'
          } else {
            this.commonData.stockCode = resp.poaMain.security.split(';')
          }
          this.lyricdescription = resp.poaMain.featureDesc
          this.isemphasisradio = resp.poaMain.isImportant

          // this.auditoption=resp.poaMain.comment
          this.modifyInfo = resp.poaMain.modifyInfo
          this.suggestion = resp.poaMain.suggestion
          if (!resp.poaMain.isCrp) {
            this.isCrp = '0'
          } else {
            this.isCrp = resp.poaMain.isCrp
          }
          if (resp.poaMain.isCrp == '1') {
            this.dispalyClueReportNumber = true
            this.clueReportNumber = resp.poaMain.extend3
            this.clueReportInfoId = resp.infoIdRpc
            this.clueReportRadio = true
          } else {
            this.dispalyClueReport = false
            this.clueReportRadio = false
          }
        })
      },
      getfilelist () {
        getfilelist(this.infoId).then((resp) => {
          this.filelist1 = []
          this.fileNameList1 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation == 'poa_BasicInfo_attachment') {
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
      },
      confirmCommitInfo (selectPerson) {
        if (this.isCrp == '1') {
          if (this.clueReportRadio == false) {
            if (this.clueRportType.length == 0) {
              this.nullclueRportType = true
              return
            } else {
              // this.clueReportsaveall()
            }
            if (!this.ClueReportName) {
              this.nullClueReportName = true
              return
            } else {
              // this.clueReportsaveall()
            }
            if (this.clueRportType.length == 0 || (!this.ClueReportName)) {
            } else {
              this.clueReportsaveall()
            }
          }
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let security = ''
        if (this.coderadio == '0') {
          security = ''
        }
        if (this.commonData.stockCode != '') {
          security = this.commonData.stockCode.join(';')
        }

        let params = {
          'poaMain': {
            'infoId': this.infoId,
            'title': this.name,
            'sourceFrom': this.lyricfrom1 + ' ' + this.lyricfrom2,
            'sourceTime': this.publishtime,
            'mainText': this.lyrictext,
            'sourceType': this.lyrictype,
            'security': security,
            'featureDesc': this.lyricdescription,
            'isImportant': this.isemphasisradio,
            'modifyInfo': this.modifyInfo,
            'suggestion': this.suggestion,
            'isCrp': this.isCrp,
            'infoIdCrp': this.clueReportInfoId,
            'extend3': this.clueReportNumber,
            'processStatus': this.processStatus,
            'comment': this.auditoption,
            'createType': '1',
            'extend': this.extend1,
            'extend2': this.number
          },
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': selectPerson || '',
          'role': this.role,
          'approve': this.approveFlag,
          'finish': '',
          'keyword': this.keyword,
          'operate': this.opearte
        }
        let isparams = JSON.stringify(params)
        lyricexamine(isparams).then((resp) => {
          this.goBack()
          this.callbackMessage(resp)
        })
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
        if (!this.name) {
          this.nullname = true
          return
        }
        if (!this.publishtime) {
          this.nullpublishtime = true
          return
        }
        if (!this.lyrictext) {
          this.nulllyrictext = true
          return
        }
        if (this.StockCode === true) {
          if (!this.commonData.stockCode[0] && !this.coderadio) {
            this.nullbondcode = true
            return
          }
        }
        if (!this.lyricdescription) {
          this.nulllyricdescription = true
          return
        }
        if (!this.modifyInfo) {
          this.nullmodifyInfo = true
          return
        }
        if (!this.suggestion) {
          this.nullsuggestion = true
          return
        }
        if ([0, 2, 3, 5].indexOf(Number(this.processStatus)) > -1) {
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
            if (item.name == '退回至') {
              item.name = '驳回'
            }
            this.buttondispaly.push(item.name)
          }
        })
      },
      gethistoryform () {
        lyrichistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.deailcasedata = resp.value
          // 什么意思？？
          for (let i = 0; i < this.deailcasedata.length; i++) {
            if (this.deailcasedata.proceStatus == '0') {
              this.deailcasedata.splice(i, 1)
            }
          }
          // this.deailcasedata = resp.value
          if (this.deailcasedata.length == 0 || this.deailcasedata == '无查询结果') {
            this.deailcasedataflag = false
          } else {
            this.deailcasedataflag = true
          }
        })
      },
      changelyricfrom2 () {
        this.islyricfrom2 = []
        switch (this.lyricfrom1) {
          case '证券行业三大报':
            this.islyricfrom2.push({
              value: '中国证券报',
              label: '中国证券报'
            }, {
              value: '证券时报',
              label: '证券时报'
            }, {
              value: '上海证券报',
              label: '上海证券报'
            })
            this.lyricfrom2 = '中国证券报'
            break
          case '主流财经媒体门户网站':
            this.islyricfrom2.push({
              value: '新浪网',
              label: '新浪网'
            }, {
              value: '和讯网',
              label: '和讯网'
            }, {
              value: '网易',
              label: '网易'
            }, {
              value: '搜狐网',
              label: '搜狐网'
            }, {
              value: '东方财富网',
              label: '东方财富网'
            }, {
              value: '中国经济网',
              label: '中国经济网'
            }, {
              value: '金融界',
              label: '金融界'
            }, {
              value: 'FT中文网',
              label: 'FT中文网'
            }, {
              value: '同花顺',
              label: '同花顺'
            }, {
              value: '财新网',
              label: '财新网'
            }, {
              value: '财界网',
              label: '财界网'
            }, {
              value: '财经网',
              label: '财经网'
            }, {
              value: '湖南经济网',
              label: '湖南经济网'
            }, {
              value: '全景网',
              label: '全景网'
            }, {
              value: '中证网',
              label: '中证网'
            }, {
              value: '证券之星',
              label: '证券之星'
            }, {
              value: '观察者网',
              label: '观察者网'
            }, {
              value: '赢商网',
              label: '赢商网'
            }, {
              value: '华尔街见闻',
              label: '华尔街见闻'
            }, {
              value: '牛仔网',
              label: '牛仔网'
            }, {
              value: '股城网',
              label: '股城网'
            })
            this.lyricfrom2 = '新浪网'
            break
          case '民间论坛股吧':
            this.islyricfrom2.push({
              value: '新浪股吧',
              label: '新浪股吧'
            }, {
              value: '东方财富网股吧',
              label: '东方财富网股吧'
            }, {
              value: '和讯股吧',
              label: '和讯股吧'
            })
            this.lyricfrom2 = '新浪股吧'
            break
          case 'APP':
            this.islyricfrom2.push({
              value: '益盟操盘手',
              label: '益盟操盘手'
            }, {
              value: '红马甲',
              label: '红马甲'
            }, {
              value: '同花顺',
              label: '同花顺'
            }, {
              value: 'AAStocks 掌上财经',
              label: 'AAStocks 掌上财经'
            }, {
              value: '和讯基金',
              label: '和讯基金'
            }, {
              value: '和讯外汇',
              label: '和讯外汇'
            }, {
              value: '掌上贵金属',
              label: '掌上贵金属'
            }, {
              value: '中国金融网',
              label: '中国金融网'
            }, {
              value: '数米基金',
              label: '数米基金'
            }, {
              value: '掌上金融网',
              label: '掌上金融网'
            }, {
              value: '和讯股票',
              label: '和讯股票'
            }, {
              value: '大智慧',
              label: '大智慧'
            }, {
              value: '优顾理财',
              label: '优顾理财'
            }, {
              value: '健丰贵金融行情软件',
              label: '健丰贵金融行情软件'
            }, {
              value: '融360贷款',
              label: '融360贷款'
            }, {
              value: '大数据贵金融',
              label: '大数据贵金融'
            })
            this.lyricfrom2 = '益盟操盘手'
            break
          case '香港平面媒体':
            this.islyricfrom2.push({
              value: '香港商报',
              label: '香港商报'
            }, {
              value: '信报财经新闻',
              label: '信报财经新闻'
            }, {
              value: '香港经济日报',
              label: '香港经济日报'
            }, {
              value: '明报',
              label: '明报'
            }, {
              value: '东方日报',
              label: '东方日报'
            }, {
              value: '星岛日报',
              label: '星岛日报'
            })
            this.lyricfrom2 = '香港商报'
            break
          case '香港网络媒体':
            this.islyricfrom2.push({
              value: 'NOW免费实时资讯网站',
              label: 'NOW免费实时资讯网站'
            }, {
              value: '信报',
              label: '信报'
            }, {
              value: '香港经济日报',
              label: '香港经济日报'
            }, {
              value: '头条日报',
              label: '头条日报'
            }, {
              value: '大公报',
              label: '大公报'
            }, {
              value: '文汇报',
              label: '文汇报'
            }, {
              value: '阿斯达克财经网',
              label: '阿斯达克财经网'
            }, {
              value: '经济通',
              label: '经济通'
            }, {
              value: '财华网',
              label: '财华网'
            })
            this.lyricfrom2 = 'NOW免费实时资讯网站'
            break
        }
      },
      displayStockCode () {
        if (this.lyrictype == '0') {
          this.StockCode = true
        } else {
          this.StockCode = false
        }
      },
      displaydeail () {
        if (this.isCrp == '1') {
          this.isreport = true
        } else {
          this.isreport = false
        }
      },
      nullstockcode () {
        this.commonData.stockCode = []
        this.nullbondcode = false
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.nullbondcode = false
        this.coderadio = ''
      },
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

  /*.downMoreSelect .wrap{
    position: inherit !important;
  }*/
</style>
