<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <div v-if="displaywarninfo">
      <el-button @click="openwarnpage" type="primary" style="position:absolute;right:35px;top:198px;z-index: 10000;">
        显示预警详情
      </el-button>
    </div>
    <el-card>
      <el-tabs>
        <el-tab-pane label="预警基本信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>标题</span></el-col>
        <el-col :span="8">
          <el-input :disabled="String(handleStatus) === '1'" v-bind:maxlength=50 v-model="title" placeholder="" size="small"
                    style="width:70%"></el-input>
        </el-col>
        <el-col :span="3"><span style="color:red">*</span><span>编号</span></el-col>
        <el-col :span="8">
          <el-input :disabled="true" v-model="number" placeholder="" size="small" style="width:62%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>证券代码及简称</span></el-col>
        <el-col :span="8">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode" size="small"
                            style="width:70%"></stock-code-query>
        </el-col>
        <el-col :span="2">
          <el-radio :disabled="String(handleStatus) === '1'" @change="isnullcode" v-model="stockradio" label="1" style="margin-top: 8px">无证券代码</el-radio>
        </el-col>
        <!-- <el-col :span="3" v-if="nullbondcode" class="verfynull" style="margin-left:0%">证券代码及简称不能为空!</el-col> -->
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>调查事项</span></el-col>
        <el-col :span="8">
          <el-select :disabled="String(handleStatus) === '1'" v-model="matter" placeholder="" size="small" style="width:70%">
            <el-option
              v-for="item in ismatter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3"><span style="color:red">*</span><span>异常行为</span></el-col>
        <el-col :span="8">
          <el-select :disabled="String(handleStatus) === '1'" v-model="behavior" placeholder="" size="small" style="width:70%">
            <el-option
              v-for="item in isbehavior"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span>日志记录</el-col>
        <el-col :span="18">
          <el-input :disabled="String(handleStatus) === '1'" type="textarea" v-model="logtext" placeholder="输入内容在2000字以内" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">发函描述</el-col>
        <el-col :span="18">
          <el-input :disabled="String(handleStatus) === '1'" type="textarea" v-model="sendtext" placeholder="输入内容在2000字以内" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
            <el-upload
              :disabled="String(handleStatus) === '1'"
              class="upload-demo"
              :file-list="filelist1"
              :action=uploadBasicUrl
              :on-preview="handelpreview"
              :on-success="getfileID"
              :on-remove="deletefilelist"
              style="display:inline-block"
            >
              <el-button
                :disabled="String(handleStatus) === '1'"
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
      <el-row>
        <el-table
          style="margin-top:10px;"
          :data="warningdata"
          :fit=true
          border>
          <el-table-column
            prop="accountCode"
            label="账户代码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="账户名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="member"
            label="会员名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="salepart"
            label="营业部名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="oneword"
            label="一码通"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="assortment"
            label="产品账户"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="middlePushCan"
            label="是否可推送中间库"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs>
        <el-tab-pane label="账户历史监管信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 0px 0px;">
        <el-table
          style="margin-top:10px;"
          :data="accounthistorydata"
          :fit=true
          border>
          <el-table-column
            type="index"
            label="序号"
            width="50"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="wh"
            label="文件编号"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <a style="text-decoration:underline;color:#409eff;cursor:pointer;" @click="historyrecord(scope.row)">{{scope.row.wh}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="oneword"
            label="一码通"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="accountCode"
            label="账户代码"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="账户名称"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="memberName"
            label="会员名称"
            width="160"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="deptName"
            label="营业部名称"
            width="160"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="investigation"
            label="调查事项"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="abnormalBehav"
            label="异常行为"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="sveType"
            label="监管类型"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="sveMeasures"
            label="监管措施"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="startDate"
            label="开始日期"
            width="170"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="结束日期"
            width="170"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!--调取资料历史信息-->
    <history-msg-com-table :infoId="infoId" :tableData="tableData" :tableHeight="tableHeight"></history-msg-com-table>
    <el-card>
      <el-tabs>
        <el-tab-pane label="处理方案" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>调取类别</span></el-col>
        <el-col :span="18">
          <el-radio :disabled="String(handleStatus) === '1'" v-model="deailradio" label="0">标准化</el-radio>
          <el-radio :disabled="String(handleStatus) === '1'" v-model="deailradio" label="1">非标准化</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="3">调取期限</el-col>
        <el-col :span="6">
          <el-select :disabled="String(handleStatus) === '1'" allow-create filterable v-model="time" placeholder="" size="small"
                     style="width:58%;margin-top:-10px">
            <el-option
              v-for="item in istime"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="3">补充说明</el-col>
        <el-col :span="18">
          <el-input :disabled="String(handleStatus) === '1'" type="textarea" v-model="adddescription" placeholder="" size="medium"
                    style="width:92.5%"></el-input>
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
          <el-input :disabled="String(handleStatus) === '1'" placeholder="字符限制200以内" v-bind:maxlength=200 type="textarea"
                    v-model="auditoption" size="medium" style="width:92.5%"></el-input>
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
      <selectPersonComponent :selectData="selectData" @obdSelectPerson="submitfrom" ref="selectPersonComponent"
                             v-if="selectData.dialogFormVisble"></selectPersonComponent>
      <div>
  		<span>
  			<el-button type="primary" @click="goBack"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
  		</span>
        <span v-if="savebutton===false">
        <el-button type="primary" @click="saveall"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0">保存</el-button>
      </span>
      </div>
      <div v-for="item in buttondispaly">
  		<span>
  			<el-button type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="displaySelectPerson(item)">{{item}}</el-button>
  		</span>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
  import HistoryMsgComTable from '../selfsupervision/historyMsgCommonTable'
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectPersonComponent from '../superviseTaskComponent/selectPersonComponent'
  import {
    post
  } from '../../../utils/api.js'
  import {
    postsurveyapproveform,
    getsurveycheckform,
    getsurveyhistoryopiniondata,
    getsurveybuttonname,
    postsaveobd,
    getfilelist,
    deletefile,
    getObtainedInfo,
    ispermitload,
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
    components: {
      Breadcrumb,
      StockCodeQuery,
      selectPersonComponent,
      HistoryMsgComTable
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
          processName: 'ngsp_obd_flow',
          businessData: {},
          userId: ''
        },
        processStatus: 1,
        lettermessage: '上交所今日向你单位发送{title},请登录会员专区-市场监察专栏查收.',
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/informationtable',
          label: '调取资料'
        }, {
          router: '',
          label: '调取资料表单'
        }],
        selectPersonFlag: false,
        flag: '',
        ismatter: [{
          value: '0',
          label: '集合竞价虚假申报'
        }, {
          value: '1',
          label: '盘中虚假申报'
        }, {
          value: '2',
          label: '涨跌停板虚假申报'
        }, {
          value: '3',
          label: '拉升（打压）股票开盘价格'
        }, {
          value: '4',
          label: '拉升（打压）股票盘中价格'
        }, {
          value: '5',
          label: '拉升（打压）股票收盘价格'
        }, {
          value: '6',
          label: '反向交易'
        }, {
          value: '7',
          label: '对倒'
        }, {
          value: '8',
          label: '拉升（打压）债券价格'
        }, {
          value: '9',
          label: '其他－债券'
        }, {
          value: 'A',
          label: '拉升（打压）基金价格'
        }, {
          value: 'B',
          label: '其他－基金'
        }, {
          value: 'C',
          label: '涨跌停板大额申报'
        }, {
          value: 'D',
          label: '大宗交易异常'
        }, {
          value: 'E',
          label: '买入风险警示股超限'
        }, {
          value: 'F',
          label: '程序化交易异常'
        }, {
          value: 'G',
          label: '其他－股票'
        }, {
          value: 'H',
          label: '其他'
        }, {
          value: 'I',
          label: '调取资料'
        },],
        isbehavior: [{
          value: '0 ',
          label: '拉升虚拟开盘价 '
        }, {
          value: '1',
          label: '打压虚拟开盘价'
        }, {
          value: '2',
          label: '频繁虚假申报买入'
        }, {
          value: '3',
          label: '频繁虚假申报卖出'
        }, {
          value: '4',
          label: '双向申报异常（申买实卖）'
        }, {
          value: '5',
          label: '双向申报异常（申卖实买）'
        }, {
          value: '6',
          label: '涨停板虚假申报'
        }, {
          value: '7',
          label: '跌停板虚假申报'
        }, {
          value: '8',
          label: '尾盘封涨停'
        }, {
          value: '9',
          label: '尾盘封跌停'
        }, {
          value: 'a',
          label: '拉升开盘价'
        }, {
          value: 'b',
          label: '打压开盘价'
        }, {
          value: 'c',
          label: '拉升开盘价后卖出'
        }, {
          value: 'd',
          label: '打压开盘价后买入'
        }, {
          value: 'e',
          label: '股票盘中拉升'
        }, {
          value: 'f',
          label: '股票盘中打压'
        }, {
          value: 'g',
          label: '股票盘中拉升后卖出'
        }, {
          value: 'h',
          label: '股票盘中打压后买入'
        }, {
          value: 'i',
          label: '拉升至涨停后卖出'
        }, {
          value: 'j',
          label: '打压至跌停后买入'
        }, {
          value: 'k',
          label: '大宗交易接盘方卖出异常'
        }, {
          value: 'l',
          label: '拉升股票收盘价'
        }, {
          value: 'm',
          label: '打压股票收盘价'
        }, {
          value: 'n',
          label: '拉升股票收盘价后卖出'
        }, {
          value: 'o',
          label: '打压股票收盘价后买入'
        }, {
          value: 'p',
          label: '隔日反向交易'
        }, {
          value: 'q',
          label: '日内反向交易'
        }, {
          value: 'r',
          label: '一码通对倒'
        }, {
          value: 's',
          label: '一码通对倒'
        }, {
          value: 't',
          label: '债券盘中拉升'
        }, {
          value: 'u',
          label: '债券盘中打压'
        }, {
          value: 'v',
          label: '拉升债券收盘价'
        }, {
          value: 'w',
          label: '打压债券收盘价'
        }, {
          value: 'x',
          label: '其他－债券'
        }, {
          value: 'y',
          label: '基金盘中拉升'
        }, {
          value: 'z',
          label: '基金盘中打压'
        }, {
          value: 'A',
          label: '其他－基金'
        }, {
          value: 'B',
          label: '涨停板大额申报后反向交易'
        }, {
          value: 'C',
          label: '跌停板大额申报后反向交易'
        }, {
          value: 'D',
          label: '大宗竞价高买低卖'
        }, {
          value: 'E',
          label: '买入风险警示股超限'
        }, {
          value: 'F',
          label: '程序化交易异常'
        }, {
          value: 'G',
          label: '其他－股票'
        }, {
          value: 'H',
          label: '维稳'
        }, {
          value: 'I',
          label: '其他异常'
        }, {
          value: 'J',
          label: '固定收益平台交易异常'
        }, {
          value: 'K',
          label: '涉嫌跨期操纵股'
        }, {
          value: 'L',
          label: '涉嫌短线操纵股'
        }, {
          value: 'M',
          label: '涉嫌利益输送'
        }, {
          value: 'N',
          label: '涉嫌内幕'
        }, {
          value: 'O',
          label: '持有证券超比例'
        }, {
          value: 'P',
          label: '其他'
        }],
        filelist1: [],
        uploadBasicUrl: '',
        handleStatus: '',
        istime: [],
        warningdata: [],
        title: '',
        number: '',
        Ecount: '',
        logtext: '',
        sendtext: '',
        matter: '',
        behavior: '',
        radio: '',
        deailradio: '',
        flagradio: '',
        newcreat: true,
        adddescription: '',
        deailcasedata: [],
        buttondispaly: [],
        time: '',
        accounthistorydata: [],
        auditoption: '',
        infoId: '',
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        processinfo6: '',
        urlstrs: [],
        taskId: '',
        instanceId: '',
        savebutton: false,
        displaywarninfo: false,
        alarmId: '',
        stockradio: '',
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        },
        showUploadButton: true,
        fileNameList1: []
      }
    },
    mounted () {
      const {isoperateCheck, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        this.taskId = taskId
        this.instanceId = instanceId
        this.handleStatus = isoperateCheck
        if (isoperateCheck == '1') {
          this.commonData.disabled = true
          this.savebutton = true
        } else {
          this.getbutton()
          this.savebutton = false
        }
        this.getAllData()
        this.gethistoryform()
      })
    },
    methods: {
      reqActivityNameByProcessName (callback, showDialog) {
        getActivityNameByProcessName(this.selectData.processName).then(res => {
          this.steps = res['localStatusName']
          this.acivityNameArray = res['activityName']
          let processStatus = +this.processStatus + 1
          /* 如果为标准化监管 选人按照待发函节点 */
          if (String(this.deailradio) === '0') {
            processStatus = +this.processStatus + 2
          }
          this.selectData.activityName = res['activityName'][processStatus]
          this.selectData.businessData = res['businessData']
          if (showDialog) {
            this.showSelectPersonDialog()
          }
          callback && callback()
        })
      },
      showSelectPersonDialog () {
        this.selectData.dialogFormVisble = true
      },
      isnullcode () {
        this.commonData.stockCode = []
      },
      displaySelectPerson (item) {
        if (this.title == '' || this.title == null) {
          this.nulltitle = true
          return
        }
        if (this.commonData.stockCode.length == 0 && this.stockradio == '') {
          this.nullbondcode = true
          return
        }
        if (this.deailradio == '' || this.deailradio == null) {
          this.nulldeailradio = true
          return
        }
        if (this.logtext == '' || this.logtext == null) {
          this.nulllogtext = true
          return
        }
        if (this.time == '' || this.time == null) {
          this.nulltime = true
          return
        }
        this.flag = 'true'
        if (item == '提交') {
          this.flag = 'true'
        } else {
          this.flag = 'false'
          this.submitfrom()
          return
        }
        /* 判断是否为标准化监管 */
        this.reqActivityNameByProcessName(null, true)
        // if (this.deailradio == '0') {
        //   this.selectData.activityName = '发函'
        // } else {
        //   this.selectData.activityName = '分配调查单'
        // }
        // this.selectData.instanceId = ''
        // this.selectData.processName = 'ngsp_obd_flow'
        // this.selectData.businessData = {}
      },
      saveall () {
        if (this.title == '' || this.title == null) {
          this.nulltitle = true
          return
        }
        if (this.commonData.stockCode.length == 0 && this.stockradio == '') {
          this.nullbondcode = true
          return
        }
        if (this.deailradio == '' || this.deailradio == null) {
          this.nulldeailradio = true
          return
        }
        if (this.logtext == '' || this.logtext == null) {
          this.nulllogtext = true
          return
        }
        if (this.time == '' || this.time == null) {
          this.nulltime = true
          return
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let analyseResult = ''
        let ismesureradio = ''
        let isbondcode = this.commonData.stockCode.join(',')
        // let securityid = isbondcode[0];
        // let stockname = isbondcode[1];
        let ismsgtarget = []
        let msgtarget = ''
        if (this.letterchecked1 == true) {
          ismsgtarget.push('0')
        }
        if (this.letterchecked2 == true) {
          ismsgtarget.push('1')
        }
        if (this.letterchecked3 == true) {
          ismsgtarget.push('2')
        }
        if (this.letterchecked4 == true) {
          ismsgtarget.push('3')
        }
        msgtarget = ismsgtarget.join(',')
        let params = {
          'obdMain': {
            'infoId': this.infoId,
            'title': this.title,
            'invesNo': this.number,
            'securityid': isbondcode,
            'stockname': isbondcode,
            'investigation': this.matter,
            'abnormalBehav': this.behavior,
            'logs': this.logtext,
            'letterDesc': this.sendtext,
            'attachId': '1',
            'processStatus': this.proceStatus,
            'obtainType': this.deailradio,
            'obtainLimit': this.time,
            'instructions': this.adddescription,
            'comment': this.auditoption,
            'extend1': this.createType
          },
          'letter': {
            'infoId': this.infoId,
            'letterType1': this.surverletter,
            'letterType2': this.assitletter,
            'letterNo': this.letternumber,
            'needreply': this.letterradio,
            'letterName': this.lettername,
            'shortmsg': this.lettermessage,
            'msgtarget': msgtarget,
            'sentAttachid': '',
            'lettersent': this.letterpeople,
            'sentdate': this.letterdate,
            'receiveAttachid': '',
          },
          'accountInfos': this.warningdata,
          'taskId': this.taskId,
          'instanceId': this.instanceId,
          'toWhom': '',
          'operate': ''
        }
        let isparams = JSON.stringify(params)
        postsaveobd(isparams).then((resp) => {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success',
          })
        })
      },
      openwarnpage () {
        window.open(`#/tdateAlarmDetail/${this.alarmId}`)
      },
      historyrecord (row) {
        window.open(`#/finishform?flag=${true}&warningNo=${row.wh}&instanceId=${row.infoId}`)
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
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.stockradio = ''
        this.title = (this.commonData.stockCode[0] ? this.commonData.stockCode[0] : '无') + '-' + this.matter
        if (this.commonData.stockCode.length == 0) {
          this.nullbondcode = true
        }
      },
      getbutton () {
        getsurveybuttonname(this.taskId).then((resp) => {
          for (let item of resp.data.approveTypes) {
            if (item.name == '退回发起人') {
              item.name = '驳回'
            }
            this.buttondispaly.push(item.name)
          }
        })
      },
      gethistoryform () {
        getsurveyhistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.deailcasedata = resp.value
        })
      },
      getAllData () {
        getsurveycheckform(this.instanceId).then((resp) => {
          this.processStatus = resp.obdMain.processStatus
          if (resp.obdMain.extend1 == '1') {
            this.displaywarninfo = false
          } else {
            this.displaywarninfo = true
          }
          this.infoId = resp.infoId
          this.uploadBasicUrl = '/ngsp/bpm/v1/attachment/upload?fileLoc=obd_BasicInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.title = resp.obdMain.title
          this.alarmId = resp.obdMain.extend2
          this.number = resp.obdMain.invesNo
          if (!resp.obdMain.securityid) {
            this.stockradio = '1'
          } else {
            this.commonData.stockCode = resp.obdMain.securityid.split(',')
          }
          this.behavior = resp.obdMain.abnormalBehav
          this.matter = resp.obdMain.investigation
          this.logtext = resp.obdMain.logs
          this.auditoption = resp.obdMain.comment
          this.sendtext = resp.obdMain.letterDesc
          this.warningdata = resp.obdAccountinfos
          this.accounthistorydata = resp.ngspRegulatoryHistorys
          this.oneword = this.warningdata.map(item => {
            return item.oneword
          })
          let params = {
            oneword: this.oneword,
            infoId: this.infoId
          }
          getObtainedInfo(params).then(resp => {
            this.tableData.data = resp
            if (resp.length) {
              this.tableHeight = resp.length * 40 + 40
            }
            this.showOrHideLoading = false
          })
          this.deailradio = resp.obdMain.obtainType
          this.adddescription = resp.obdMain.instructions
          this.time = resp.obdMain.obtainLimit
          this.getfilelist()
          // this.auditoption = resp.obdMain.comment
        })
      },
      submitfrom (person) {
        let toWhom = ''
        if (this.flag == 'true') {
          toWhom = person
        }
        let analyseResult = ''
        let ismesureradio = ''
        // debugger
        let isbondcode = this.commonData.stockCode.join(',')
        // let securityid = isbondcode[0];
        // let stockname = isbondcode[1];
        let params = {
          'obdMain': {
            'infoId': this.infoId,
            'title': this.title,
            'invesNo': this.number,
            'securityid': isbondcode,
            'stockname': isbondcode,
            'investigation': this.matter,
            'abnormalBehav': this.behavior,
            'logs': this.logtext,
            'letterDesc': this.sendtext,
            'attachId': '1',
            'processStatus': this.processStatus,
            'obtainType': this.deailradio,
            'obtainLimit': this.time,
            'instructions': this.adddescription,
            'comment': this.auditoption
          },
          'accountInfos': this.warningdata,
          'approve': this.flag,
          'taskId': this.taskId,
          'instanceId': this.instanceId,
          'toWhom': toWhom,
          'operate': ''
        }
        let isparams = JSON.stringify(params)
        postsurveyapproveform(isparams).then((resp) => {
          this.goBack()
        })
      },
      getfilelist () {
        getfilelist(this.infoId).then((resp) => {
          this.filelist1 = []
          this.fileNameList1 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation == 'obd_BasicInfo_attachment') {
              this.filelist1.push({'name': item.fileName, 'fileId': item.fileId})
            }
          })
          this.fileNameList1 = this.getFileNameList(this.filelist1, this.fileNameList1)
        })
      },
      deletefilelist (file) {
        if (this.handleStatus == '1') {
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
        if (this.handleStatus == '1') {
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
  .el-step__title.is-process {
    color: #7b8fb9;
  }

  .el-step__description.is-process {
    color: #7b8fb9;
  }

  .el-step__title.is-success {
    color: #409eff;
  }

  .el-step__description.is-success {
    color: #409eff;
  }

  .box {
    background-color: white;
    width: 80px;
    height: 100px;
    color: black;
    position: absolute;
    z-index: 1000;
    text-align: center;
    padding-top: 10px;
    top: 65%;
    left: 10%;
  }

  .head {
    width: 20%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    /*margin: 4% 0 -2% 0;*/
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
