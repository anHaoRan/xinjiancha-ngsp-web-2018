<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <div v-if="displaywarninfo">
      <!-- <el-button @click="openwarnpage" type="primary" style="position:absolute;right:35px;top:198px;">显示预警详情</el-button> -->
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
          <el-input v-bind:maxlength=50 :disabled="true" v-model="title" placeholder="" size="small"
                    style="width:70%"></el-input>
        </el-col>
        <el-col :span="3"><span style="color:red">*</span><span>编号</span></el-col>
        <el-col :span="8">
          <el-input :disabled="true" v-model="number" placeholder="" size="small" style="width:70%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>证券代码及简称</span></el-col>
        <el-col :span="8">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode" size="small"
                            style="width:70%"></stock-code-query>
        </el-col>
        <el-col :span="2">
          <el-radio disabled v-model="stockradio" label="1" style="margin-top: 8px">无证券代码</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>调查事项</span></el-col>
        <el-col :span="8">
          <el-select disabled v-model="matter" placeholder="" size="small" style="width:70%">
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
          <el-select disabled v-model="behavior" placeholder="" size="small" style="width:70%">
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
          <el-input :disabled="true" type="textarea" v-model="logtext" placeholder="输入内容在2000字以内" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">发函描述</el-col>
        <el-col :span="18">
          <el-input :disabled="true" type="textarea" v-model="sendtext" placeholder="输入内容在2000字以内" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
            <el-upload
              class="upload-demo"
              :file-list="filelist1"
              disabled
              :action=uploadBasicUrl
              :on-preview="handelpreview"
              :on-success="getfileID"
              :on-remove="deletefilelist"
              style="display:inline-block"
            >
              <el-button
                type="text"
                size="small"
                disabled
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
          <el-radio disabled v-model="deailradio" label="0">标准化</el-radio>
          <el-radio disabled v-model="deailradio" label="1">非标准化</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="3">调取期限</el-col>
        <el-col :span="6">
          <el-select disabled allow-create filterable v-model="time" placeholder="" size="small"
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
          <el-input :disabled="true" type="textarea" v-model="adddescription" placeholder="" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs>
        <el-tab-pane label="发函信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>函件类型</span></el-col>
        <el-col :span="4">
          <el-select disabled allow-create filterable v-model="surverletter" placeholder="" size="small"
                     style="width:90%;">
            <el-option
              v-for="item in issurverletter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select disabled allow-create filterable v-model="assitletter" placeholder="" size="small"
                     style="width:90%;">
            <el-option
              v-for="item in isassitletter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <span style="color:red">*</span>
          <el-button disabled type="primary" size="small">生成函件</el-button>
        </el-col>
        <!-- <el-col :span="2"><span style="color:red">*</span><span>函件编号</span></el-col>
        <el-col :span="4">
          <el-input disabled v-model="letternumber" size="small"></el-input>
        </el-col> -->
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <!-- <el-col :span="2"><span>函件标题</span></el-col>
        <el-col :span="10">
          <el-input disabled v-model="lettername" style="width:76%" size="small"></el-input>
        </el-col> -->
        <el-col :span="3"><span style="color:red">*</span><span>是否需要回函</span></el-col>
        <el-col :span="5">
          <el-radio disabled v-model="letterradio" label="1">是</el-radio>
          <el-radio disabled v-model="letterradio" label="0">否</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span>短信内容</span></el-col>
        <el-col :span="4">
          <el-input disabled v-model="lettermessage" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span>短信发送对象</span></el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="letterchecked1">综合联络人</el-checkbox>
        </el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="letterchecked2">会籍联络人</el-checkbox>
        </el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="letterchecked3">合规联络人</el-checkbox>
        </el-col>
        <el-col :span=3>
          <el-checkbox disabled v-model="letterchecked4">技术联络人</el-checkbox>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>发函附件</span></el-col>
        <el-col :span="12">
          <a v-for="item in fileList" style="padding-bottom: 15px;text-decoration:underline;color:#409eff;cursor:pointer;"
               :key="item.fileId" @click="handleDownloadFileEvent(item)">
            {{item.name}}
          </a>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span>发函人</span></el-col>
        <el-col :span="10">
          <span>{{letterpeople}}</span>
        </el-col>
        <el-col :span="3"><span style="color:red">*</span><span>发函日期</span></el-col>
        <el-col :span="5">
          <span>{{letterdate}}</span>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span>回函附件</span></el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
            <el-upload
              class="upload-demo"
              :file-list="filelist3"
              :action=uploadReturnLetterUrl
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
              v-for="item in fileNameList3"
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
      <div>
  		<span>
  			<el-button type="primary" @click="goBack"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
  		</span>
      </div>
      <div v-for="item in buttondispaly">
  		<span>
  			<el-button type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="issubmit(item)">{{item}}</el-button>
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
  import {
    post
  } from '../../../utils/api.js'
  import {
    getsurveycheckform,
    getsurveyhistoryopiniondata,
    getsurveybuttonname,
    ispermitload,
    getfilelist,
    deletefile,
    getObtainedInfo,
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
        processStatus: 6,
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
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        },
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
        fileList: [],
        filelist1: [],
        filelist3: [],
        uploadBasicUrl: '',
        uploadReturnLetterUrl: '',
        handelstatus: '',
        issurverletter: [],
        isassitletter: [],
        istime: [],
        surverletter: '',
        assitletter: '',
        letternumber: '',
        letterradio: '',
        lettermessage: '上交所今日向你单位发送{title},请登录会员专区-市场监察专栏查收.',
        lettername: '',
        letterchecked1: false,
        letterchecked2: false,
        letterchecked3: false,
        letterchecked4: false,
        letterpeople: '',
        letterdate: '',
        warningdata: [],
        title: '',
        number: '',
        Ecount: '',
        logtext: '',
        sendtext: '',
        stockradio: '',
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
        alarmId: '',
        displaywarninfo: false,
        showUploadButton: true,
        fileNameList1: [],
        fileNameList3: []
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
        this.handelstatus = isoperateCheck
        this.getAllData()
        this.gethistoryform()
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
            this.tableHeight = resp.length * 40  + 40
          }
          this.showOrHideLoading = false
        })
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
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.title = (this.commonData.stockCode[0] ? this.commonData.stockCode[0] : '无') + '-' + this.matter
        if (this.commonData.stockCode.length == 0) {
          this.nullbondcode = true
        }
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
          this.title = resp.obdMain.title
          this.alarmId = resp.obdMain.extend2
          this.number = resp.obdMain.invesNo
          if (!resp.obdMain.securityid) {
            this.stockradio = '1'
          } else {
            this.commonData.stockCode = resp.obdMain.securityid.split(',')
          }
          this.commonData.disabled = true
          this.behavior = resp.obdMain.abnormalBehav
          this.matter = resp.obdMain.investigation
          this.logtext = resp.obdMain.logs
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
              this.tableHeight = resp.length * 40  + 40
            }
            this.showOrHideLoading = false
          })
          this.proceStatus = resp.obdMain.processStatus
          this.deailradio = resp.obdMain.obtainType
          this.adddescription = resp.obdMain.instructions
          this.time = resp.obdMain.obtainLimit
          this.surverletter = resp.letter.letterType1
          this.assitletter = resp.letter.letterType2
          this.letternumber = resp.letter.letterNo
          this.lettername = resp.letter.letterName
          this.letterradio = String(resp.letter.needreply)
          this.lettermessage = resp.letter.shortmsg
          let letterchecked = resp.letter.msgtarget
          for (let i = 0; i < letterchecked.length; i++) {
            switch (letterchecked[i]) {
              case '0':
                this.letterchecked1 = true
                break
              case '1':
                this.letterchecked2 = true
                break
              case '2':
                this.letterchecked3 = true
                break
              case '3':
                this.letterchecked4 = true
                break
            }
          }
          this.letterpeople = resp.letter.lettersent
          this.letterdate = resp.letter.sentdate
          this.getfilelist()
        })
      },
      handleDownloadFileEvent(item) {
        if (this.showUploadButton) {
          if (String(this.handelstatus) === '1') {
            ispermitload(this.instanceId).then((resp) => {
              if (resp == 'true') {
                window.location.href = this.gfnGetDownloadFileUrl(item.fileId, item.name)
              } else {
                this.$message.error('没有下载权限！')
              }
            })
          } else {
            window.location.href = this.gfnGetDownloadFileUrl(item.fileId, item.name)
          }
        } else {
          this.$message.error('没有下载权限！')
        }
      },
      getfilelist () {
        getfilelist(this.infoId).then((resp) => {
          this.fileList = []
          this.filelist1 = []
          this.filelist3 = []
          this.fileNameList1 = []
          this.fileNameList3 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation === 'obd_letter_send') {
              this.fileList.push({'name': item.fileName, 'fileId': item.fileId})
            }
            if (item.fileLocation == 'obd_BasicInfo_attachment') {
              this.filelist1.push({'name': item.fileName, 'fileId': item.fileId})
            }
            if (item.fileLocation == 'obd_returnLetter_attachment') {
              this.filelist3.push({'name': item.fileName, 'fileId': item.fileId})
            }
          })
          this.fileNameList1 = this.getFileNameList(this.filelist1, this.fileNameList1)
          this.fileNameList3 = this.getFileNameList(this.filelist3, this.fileNameList3)

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
        for (let item of this.filelist3) {
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
