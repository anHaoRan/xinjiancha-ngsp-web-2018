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
          <el-input disabled v-model="name" placeholder="" size="small" style="width:76%"
                    @change="isdisplayaction"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullname" class="verfynull" style="margin-left:-9%">来函名称不能为空!</el-col>
        <el-col :span="2"><span style="color:red">*</span><span>来函编号</span></el-col>
        <el-col :span="8">
          <el-input disabled v-model="number" placeholder="" size="small" style="width:95%"
                    @change="isdisplayaction"></el-input>
        </el-col>
        <el-col :span="2" v-if="nullnumber" class="verfynull" style="margin-left:-1%">来函编号不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>来函单位</span></el-col>
        <el-col :span="4">
          <el-select disabled filterable v-model="letterUnit1" placeholder="" size="small" style="width:90%;">
            <el-option
              v-for="item in isletterUnit1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select disabled filterable v-model="letterUnit2" placeholder="" size="small" style="width:60%;">
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
          <el-input disabled v-model="contact" size="small" style="width: 95%;"></el-input>
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
          <el-input disabled v-model="style" style="width:76%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>证券代码</span></el-col>
        <el-col :span="8">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode" size="small"
                            style="width:95%"></stock-code-query>
        </el-col>
        <el-col :span="3">
          <el-radio v-model="coderadio" label="0" style="margin-top: 8px">无证券代码</el-radio>
        </el-col>
        <el-col :span="2" v-if="nullstockcode" class="verfynull" style="margin-left:-1%">证券代码不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red" v-if="isflag">*</span>来函说明</el-col>
        <el-col :span="18">
          <el-input disabled placeholder="字符限制2000以内" v-bind:maxlength=2000 type="textarea" v-model="remarktext"
                    size="medium" style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2">来函附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
            <el-upload
              class="upload-demo"
              disabled
              :file-list="filelist1"
              :action=uploadReturnLetterInfoUrl
              :on-preview="handelpreview"
              :on-success="getfileID"
              :on-remove="deletefilelist"
              style="display:inline-block"
            >
              <el-button
                type="text"
                disabled
                size="small"
                style="display:inline"
              >上传
              </el-button>
            </el-upload>
          </div>
          <div v-else>
            <span
              style="display: block;"
              v-for="item in filelist1"
              :key="item.fileId">
              {{item.name}}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <ClueAssoiciateTable :securityProps=commonData.stockCode :infoIdProps="infoId" :propsDisabled="true"></ClueAssoiciateTable>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs>
        <el-tab-pane label="关联临时计算" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>是否关联临时计算</span></el-col>
        <el-col :span="2">
          <el-radio disabled v-model="cuereportradio" label="1">是</el-radio>
        </el-col>
        <el-col :span="2">
          <el-radio disabled v-model="cuereportradio" label="0">否</el-radio>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;" v-if="temporaryCaculationForm">
        <el-col :span="3"><span style="color:red">*</span><span>任务编号</span></el-col>
        <el-col :span="2">
          <el-input disabled v-model="temporaryCaculationnumber" placeholder="" size="small"
                    style="width:95%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;" v-if="temporaryCaculationForm">
        <el-col :span="3"><span style="color:red">*</span>需求描述</el-col>
        <el-col :span="19">
          <el-input disabled placeholder="" v-bind:maxlength=1000 type="textarea" v-model="requireDescript"
                    size="medium" style="width:77%"></el-input>
        </el-col>
        <el-col :span="2" v-if="nulldec" class="verfynull">需求描述为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;" v-if="temporaryCaculationForm">
        <el-col :span="3">验收标准</el-col>
        <el-col :span="19">
          <el-input disabled placeholder="" v-bind:maxlength=1000 type="textarea" v-model="acceptanceStandard"
                    size="medium" style="width:77%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;" v-if="temporaryCaculationForm">
        <el-col :span="3" style="margin-top:8px"><span style="color:red">*</span>交付时间</el-col>
        <el-col :span="9">
          <el-date-picker
            :picker-options="startpickerOption"
            v-model="dimensionQueryForm.beginDate"
            disabled
            type="datetime"
            placeholder=""
            value-format="yyyy-MM-dd HH:mm:ss"
            size="small"
            style="width:33%">
          </el-date-picker>
        </el-col>
        <el-col :span="2" v-if="nullbeginDate" class="verfynull">交付时间为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;" v-if="temporaryCaculationForm">
        <el-col :span="3">计算结果附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div @click="handelpreview">
            <span
              v-if="filelist2.length"
              style="display: block;"
              v-for="item in filelist2"
              :key="item.fileId">
              {{item.name}}
            </span>
            <span v-else>无附件</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs>
        <el-tab-pane label="回函信息" name="one">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 0px;">
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>证券代码</span></el-col>
        <el-col :span="8">
          <stock-code-query :commonData="commonData1" @getStockCode="getStockCode1" size="small"
                            style="width:95%"></stock-code-query>
        </el-col>
        <el-col :span="3">
          <el-radio disabled v-model="coderadio1" label="0" style="margin-top: 8px">无证券代码
          </el-radio>
        </el-col>
        <el-col :span="3" v-if="nullstockcode1" class="verfynull">证券代码不能为空!</el-col>
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
        <el-col :span="2"><span style="color:red">*</span><span>协查类型</span></el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked1">老鼠仓趋同及盈利</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked2">黑嘴数据</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked3">短线操纵指标</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked15">跨期操纵指标</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked5">盈利-先进先出</el-checkbox>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span=4 style="margin-left: 135px;">
          <el-checkbox disabled v-model="checked6">盈利-后进先出</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked7">盈利-账面</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked8">盈利-复杂</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked16">沪港通数据查询</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked9">常规查询-开户查询</el-checkbox>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span=4 style="margin-left: 135px;">
          <el-checkbox disabled v-model="checked10">常规查询-委托,交易流水</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked11">常规查询-持股变动</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked12">常规查询-营业部</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="checked13">常规查询-其它</el-checkbox>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span=4 style="margin-left: 135px;">
          <el-checkbox v-model="checked14">其它</el-checkbox>
        </el-col>
        <el-col :span="4" v-if='selectother'>
          <el-input disabled v-model="other" style="width:76%" size="small"></el-input>
        </el-col>
      </el-row>
      <!-- <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>函件事项</span></el-col>
        <el-col :span="10">
          <el-input disabled  v-bind:maxlength=200 v-model="lettermatter" style="width:76%" size="small"></el-input>
        </el-col>
      </el-row> -->
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="2"><span>备注</span></el-col>
        <el-col :span="10">
          <el-input disabled v-bind:maxlength=200 v-model="note" style="width:76%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span><span>反馈单位</span></el-col>
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
        <el-col :span="2"><span style="color:red">*</span>反馈方式</el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="replyway1">电话告知</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="replyway2">保密函件</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="replyway3">密件交换</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="replyway4">正式回发函</el-checkbox>
        </el-col>
        <el-col :span=4>
          <el-checkbox disabled v-model="replyway5">专人来取</el-checkbox>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;" v-if='ispeopletake'>
        <el-col :span="2"><span>签收单编号</span></el-col>
        <el-col :span="4">
          <el-input disabled v-model="receiptnumber" placeholder="" size="small" style="width:80%"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button disabled type="primary" @click="download">签收单模板下载</el-button>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="2"><span style="color:red">*</span>回函附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
            <el-upload
              disabled
              class="upload-demo"
              :file-list="filelist3"
              :action=uploadCheckInfoUrl
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
              v-for="item in filelist3"
              :key="item.fileId">
              {{item.name}}
            </span>
          </div>
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
      <el-row style="margin: 20px 0 15px 30px;" v-if="processStatus===7">
        <el-col :span="2"><span>发函人</span></el-col>
        <el-col :span="9">
          <span>{{replyletterPerson}}</span>
        </el-col>
        <el-col :span="3"><span>发函时间</span></el-col>
        <el-col :span="5">
          <span>{{replyletterDate}}</span>
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
      <el-row style="margin: 20px 0 15px 30px;" v-if="opiniontext">
        <el-col :span="2">您的意见</el-col>
        <el-col :span="18">
          <el-input placeholder="字符限制200以内" v-bind:maxlength=200 type="textarea" v-model="auditoption" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row v-if="deailcasedataflag" style="margin-top:20px">
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
    <div>
      <span>
        <el-button @click="goBack" type="primary"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
      </span>
      <span v-if="newcreat">
        <el-button @click="submitfrom('true')" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">发函</el-button>
      </span>
    </div>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import StepsCommonComponent from '../superviseTaskComponent/StepsCommonComponent'
  import ClueAssoiciateTable from './components/ClueAssoiciateTable'
  import moment from 'moment'
  import {
    postdataassociationexamineform,
    getdataassociationhistoryopiniondata,
    postdataassociationdata,
    temporaryCalculationdata,
    downloadReceipt,
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
    components: {
      Breadcrumb,
      StockCodeQuery,
      StepsCommonComponent,
      ClueAssoiciateTable
    },
    mixins: [MinxinVue],
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
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
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
        selectother: false,
        filelist: [],
        codedata: [],
        coderadio1: '',
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
        issurverletter: [{
          value: '协查报告',
          label: '协查报告'
        }],
        isassitletter: [{
          value: '协查报告',
          label: '协查报告'
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
        replyletterPerson: '',
        replyletterDate: '',
        name: '',
        number: '',
        contact: '',
        date: '',
        coderadio: '',
        way: '电子邮件',
        style: '联合监管',
        surverletter: '协查报告',
        assitletter: '协查报告',
        remarktext: '',
        auditoption: '',
        newcreat: true,
        processStatus: '',
        infoId: '',
        taskId: '',
        instanceId: '',
        deailcasedataflag: false,
        nullname: false,
        nullnumber: false,
        nullstockcode: false,
        nullstockcode1: false,
        cuereportradio: '',
        letternumber: '',
        lettername: '',
        other: '',
        checked1: '',
        checked2: '',
        checked3: '',
        checked5: '',
        checked6: '',
        checked7: '',
        checked8: '',
        checked9: '',
        checked10: '',
        checked11: '',
        checked12: '',
        checked13: '',
        checked14: '',
        checked15: '',
        checked16: '',
        // lettermatter:'',
        sendobject1: '本所',
        sendobject2: '上市公司监管一部',
        replyway1: '',
        replyway2: '',
        replyway3: '',
        replyway4: '',
        replyway5: '',
        note: '',
        ispeopletake: false,
        receiptnumber: '',
        createpeople: '',
        accomplishtime: '',
        opearte: '',
        temporaryCaculationInfoID: '',
        temporaryCaculationnumber: '',
        requireDescript: '',
        acceptanceStandard: '',
        dimensionQueryForm: {
          beginDate: '',
        },
        filelist1: [],
        filelist2: [],
        filelist3: [],
        handelstatus: '',
        uploadReturnLetterInfoUrl: '',
        uploadLinkTemporaryCountUrl: '',
        uploadCheckInfoUrl: '',
        temporaryCaculationForm: false,
        ispass: '',
        isflag: false,
        checkdisplay: false,
        savebutton: true,
        confirmbutton: false,
        opiniontext: true,
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
        nullbeginDate: false,
        nulldec: false
      }
    },
    mounted () {
      const {operate, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        this.opearte = operate
        this.handelstatus = operate
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
      download () {
        downloadReceipt(this.receiptnumber).then((resp) => {
          this.gfnDownloadFile(resp, '签收单模板.docx')
        })
      },
      isRemarktextMustEdit () {
        if (this.way == '0' || this.way == '3') {
          this.isflag = true
        } else {
          this.isflag = false
        }
      },
      isdisplayaction () {
        if (this.name != '') {
          this.nullname = false
        }
        if (this.number != '') {
          this.nullnumber = false
        }
      },
      gettemporaryCalculationAllData () {
        temporaryCalculationdata(this.temporaryCaculationInfoID).then((resp) => {
          this.temporaryCaculationInfoID = resp.infoId
          this.temporaryCaculationnumber = resp.tpcMain.taskNo
          this.requireDescript = resp.tpcMain.needDesc
          this.acceptanceStandard = resp.tpcMain.checkStandard
          this.dimensionQueryForm.beginDate = resp.tpcMain.deliverTime
        })
      },
      getAllData () {
        postdataassociationdata(this.instanceId).then((resp) => {
          this.temporaryCaculationInfoID = resp.infoIdTpc
          this.processStatus = resp.digReceive.processStatus
          this.infoId = resp.infoId
          this.uploadReturnLetterInfoUrl = '/ngsp/bpm/v1/attachment/upload?fileLoc=dig_LetterInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.uploadLinkTemporaryCountUrl = '/ngsp/bpm/v1/attachment/upload?fileLoc=dig_LinkTemporaryCount_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.uploadCheckInfoUrl = '/ngsp/bpm/v1/attachment/upload?fileLoc=dig_CheckInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.getfilelist()
          this.getfilelist(resp.infoIdTpc)
          this.name = resp.digReceive.letterName
          this.number = resp.digReceive.letterNo
          this.auditoption = resp.digReceive.comment
          this.contact = resp.digReceive.contackPerson
          this.date = resp.digReceive.letterDate
          this.letterUnit1 = resp.digReceive.fromDept.split(' ')[0]
          this.letterUnit2 = resp.digReceive.fromDept.split(' ')[1]
          this.cuereportradio = resp.digReceive.isTpc
          if (this.cuereportradio == '1') {
            this.temporaryCaculationForm = true
            this.gettemporaryCalculationAllData()
          }
          this.way = resp.digReceive.letterWay
          if (this.way == '0' || this.way == '3') {
            this.isflag = true
          } else {
            this.isflag = false
          }
          this.style = resp.digReceive.letterType
          if (resp.digReceive.security == '') {
            this.commonData.stockCode = ''
            this.coderadio = '0'
          } else {
            this.commonData.stockCode = resp.digReceive.security.split(';')
          }

          this.remarktext = resp.digReceive.instruction

          if (resp.digResp.security == '') {
            this.commonData1.stockCode = this.commonData.stockCode
            this.coderadio1 = '0'
          } else {
            this.commonData1.stockCode = resp.digResp.security.split(';')
          }
          this.surverletter = resp.digResp.letterType.split(' ')[0]
          this.assitletter = resp.digResp.letterType.split(' ')[1]
          this.letternumber = resp.digResp.letterNo
          this.lettername = resp.digResp.letterName
          this.note = resp.digResp.note
          for (let i = 0; i < resp.digResp.invesType.split(",").length; i++) {
            switch (resp.digResp.invesType.split(',')[i]) {
              case '0':
                this.checked1 = true
                break
              case '1':
                this.checked2 = true
                break
              case '2':
                this.checked3 = true
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
              case '7':
                this.checked8 = true
                break
              case '8':
                this.checked9 = true
                break
              case '9':
                this.checked10 = true
                break
              case '10':
                this.checked11 = true
                break
              case '11':
                this.checked12 = true
                break
              case '12':
                this.checked13 = true
                break
              case '14':
                this.checked15 = true
                break
              case '15':
                this.checked16 = true
                break
              default:
                this.checked14 = true
                if (!resp.digResp.invesType.split(',')[i].split(' ')[1] == false) {this.other = resp.digResp.invesType.split(',')[i].split(' ')[1]}
                this.selectother = true
                break
            }
          }
          if (resp.digResp.feedbackDept === undefined) {
          } else {
            this.sendobject1 = resp.digResp.feedbackDept.split(' ')[0]
            this.sendobject2 = resp.digResp.feedbackDept.split(' ')[1]
          }
          // this.lettermatter=resp.digResp.matter
          for (let i = 0; i < resp.digResp.feedbackWay.split(',').length; i++) {
            switch (resp.digResp.feedbackWay.split(',')[i]) {
              case '0':
                this.replyway1 = true
                break
              case '1':
                this.replyway2 = true
                break
              case '2':
                this.replyway3 = true
                break
              case '3':
                this.replyway4 = true
                break
              case '4':
                this.replyway5 = true
                this.ispeopletake = true
                this.receiptnumber = resp.digResp.receiptNo
                break
            }
          }
          this.createpeople = resp.digResp.drafter
          this.accomplishtime = resp.digResp.draftDate
          if (this.letternumber == '') {
            this.getnumber()
          }
          if (this.processStatus == '2') {
            this.checkdisplay = true
          }
          if (this.processStatus == '3' || this.processStatus == '4') {
            this.checkdisplay = true
            this.savebutton = false
          }
          if (this.processStatus == '5') {
            this.confirmbutton = true
            this.newcreat = false
            this.savebutton = false
            this.checkdisplay = false
          }
          if (this.processStatus == '6') {
            this.replyletterDate = moment().format('YYYY-MM-DD')
            this.replyletterPerson = this.gfnGetRealName()
          }
          if (this.processStatus == '7') {
            this.opiniontext = false
            this.replyletterPerson = resp.digResp.respPerson
            this.replyletterDate = resp.digResp.respDate
          }
        })
      },
      getfilelist (infoId) {
        getfilelist(infoId || this.infoId).then((resp) => {
          this.showUploadButton = resp.authority
          if (infoId) { // 临时计算
            this.filelist2 = []
            resp.attachments.forEach(item => {
              if (item.fileLocation == 'tpc_second_attachment') {
                this.filelist2.push({'name': item.fileName, 'fileId': item.fileId})
              }
            })
          } else {
            this.filelist1 = []
            this.filelist3 = []
            resp.attachments.forEach(item => {
              if (item.fileLocation == 'dig_LetterInfo_attachment') {
                this.filelist1.push({'name': item.fileName, 'fileId': item.fileId})
              }
              if (item.fileLocation == 'dig_CheckInfo_attachment') {
                this.filelist3.push({'name': item.fileName, 'fileId': item.fileId})
              }
            })
          }
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
        for (let item of this.filelist2) {
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
      submitfrom (flag) {
        this.$confirm('确定提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (this.taskId == '' || this.taskId == null) {
            this.taskId = '0'
          }
          let letterWayText = ''
          for (let item of this.isway) {
            if (item.value == this.way) {
              letterWayText = item.label
            }
          }
          let invesType = []
          if (this.checked1 == true) {
            invesType.push('0')
          }
          if (this.checked2 == true) {
            invesType.push('1')
          }
          if (this.checked3 == true) {
            invesType.push('2')
          }
          if (this.checked5 == true) {
            invesType.push('4')
          }
          if (this.checked6 == true) {
            invesType.push('5')
          }
          if (this.checked7 == true) {
            invesType.push('6')
          }
          if (this.checked8 == true) {
            invesType.push('7')
          }
          if (this.checked9 == true) {
            invesType.push('8')
          }
          if (this.checked10 == true) {
            invesType.push('9')
          }
          if (this.checked11 == true) {
            invesType.push('10')
          }
          if (this.checked12 == true) {
            invesType.push('11')
          }
          if (this.checked13 == true) {
            invesType.push('12')
          }
          if (this.checked14 == true) {
            invesType.push('13')
          }
          if (this.checked15 == true) {
            invesType.push('14')
          }
          if (this.checked16 == true) {
            invesType.push('15')
          }
          if (this.checked14 == true) {
            invesType.push('13' + ' ' + this.other)
          }
          let isfeedbackWay = []
          if (this.replyway1 == true) {
            isfeedbackWay.push('0')
          }
          if (this.replyway2 == true) {
            isfeedbackWay.push('1')
          }
          if (this.replyway3 == true) {
            isfeedbackWay.push('2')
          }
          if (this.replyway4 == true) {
            isfeedbackWay.push('3')
          }
          if (this.replyway5 == true) {
            isfeedbackWay.push('4')
          }
          let security = ''
          if (this.coderadio == '') {
            security = this.commonData.stockCode.join(';')
          } else {
            security = ''
          }
          let security1 = ''
          if (this.commonData1.stockCode == '' || this.commonData1.stockCode == []) {
            security1 = ''
          } else {
            security1 = this.commonData1.stockCode.join(';')
          }
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
              // "security":this.commonData.stockCode.join(";"),
              'security': security,
              'instruction': this.remarktext,
              'attachmentId': '',
              'isTpc': this.cuereportradio,
              'infoIdTpc': '',
              'clueTypeBig': '',
              'clueTypeSmall': '',
              'processStatus': this.processStatus,
              'comment': this.auditoption,
              'createType': '1'
            },
            'digResp': {
              'infoId': this.infoId,
              // "security": this.commonData1.stockCode.join(";"),
              'security': security1,
              'letterType': this.surverletter + ' ' + this.assitletter,
              'letterNo': this.letternumber,
              'letterName': this.lettername,
              'invesType': invesType.join(','),
              'matter': '',
              'feedbackDept': this.sendobject1 + ' ' + this.sendobject2,
              'feedbackWay': isfeedbackWay.join(','),
              'receiptNo': this.receiptnumber,
              'drafter': this.createpeople,
              'draftDate': this.accomplishtime,
              'respPerson': this.replyletterPerson,
              'respDate': this.replyletterDate,
              'note': '',
            },
            'instanceId': this.instanceId,
            'taskId': this.taskId,
            'toWhom': '',
            'processWay': 'false',
            'approve': flag,
          }
          let isparams = JSON.stringify(params)
          postdataassociationexamineform(isparams).then((resp) => {
            this.goBack()
          })
        }).catch(() => {

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
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        if (this.commonData.stockCode != '') {
          this.nullstockcode = false
        }
      },
      getStockCode1 (stockCodeData) {
        this.commonData1.stockCode = stockCodeData
        if (this.commonData1.stockCode != '') {
          this.nullstockcode = false
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
          this.auditoptiontable = resp.value
          if (this.auditoptiontable.length == 0 || this.auditoptiontable == '无查询结果') {
            this.deailcasedataflag = false
          } else {
            this.deailcasedataflag = true
          }
        })
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
