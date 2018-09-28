<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <div v-if="displaywarninfo">
      <el-button @click="openwarnpage" type="primary" style="position:absolute;right:35px;top:178px;z-index: 10000;">
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
        <el-col :span="9">
          <el-input :disabled="String(handleStatus) === '1'" v-bind:maxlength=50 @blur="verficationNull(title,1)" v-model="title" placeholder="" size="small"
                    style="width:62%"></el-input>
        </el-col>
        <el-col :span="2" v-if="nulltitle" class="verfynull">标题不能为空!</el-col>
        <el-col :span="3"><span style="color:red">*</span><span>编号</span></el-col>
        <el-col :span="9">
          <el-input disabled v-model="number" placeholder="" size="small" style="width:62%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>证券代码及简称</span></el-col>
        <el-col :span="9">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode" size="small"
                            style="width:62%"></stock-code-query>
        </el-col>
        <el-col :span="2">
          <el-radio :disabled="String(handleStatus) === '1'" @change="isnullcode" v-model="stockradio" label="1" style="margin-top: 8px">无证券代码</el-radio>
        </el-col>
        <el-col :span="3" v-if="nullbondcode" class="verfynull" style="margin-left:0%">证券代码及简称不能为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>调查事项</span></el-col>
        <el-col :span="9">
          <el-select :disabled="String(handleStatus) === '1'" v-model="matter" placeholder="" size="small" style="width:70%" @change="changetype1">
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
          <el-input :disabled="String(handleStatus) === '1'" v-bind:maxlength=2000 @blur="verficationNull(logtext,3)" type="textarea" v-bind:rows=4
                    v-model="logtext" placeholder="输入内容在2000字以内" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
        <el-col :span="3" v-if="nulllogtext" class="verfynull" style="margin-left:-4%">日志记录不能为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">发函描述</el-col>
        <el-col :span="18">
          <el-input :disabled="String(handleStatus) === '1'" v-bind:maxlength=2000 type="textarea" v-bind:rows=4 v-model="sendtext" placeholder="输入内容在2000字以内"
                    size="medium"
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
        <el-popover
          ref="popoverbox"
          placement="right-end"
          width="0"
          trigger="manual"
          v-model="warningtableflag"
        >
          <div v-if="warningtableflag">
            <!--             <div @click="appendrow">新增记录</div>
                        <div @click="deleterow">删除</div> -->
          </div>
        </el-popover>
        <el-table
          style="margin-top:10px;"
          :data="warningdata"
          ref="multipleTable"
          @selection-change="handleselecttionchange"
          :fit=true
          v-popover:popoverbox
          border>
          <el-table-column
            type="selection"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="accountCode"
            label="账户代码"
            show-overflow-tooltip>
            <template slot-scope="scope" v-popover:popoverbox>
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.accountCode" placeholder="" size="small"
                        @keyup.enter.native="displayinfo(scope.$index,scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="账户名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.accountName" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="member"
            label="会员名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.member" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="salepart"
            label="营业部名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.salepart" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="oneword"
            label="一码通"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.oneword" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="assortment"
            label="产品账户"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select :disabled="String(handleStatus) === '1'" v-model="scope.row.assortment" placeholder="" size="small">
                <el-option
                  v-for="item in isassortment"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="middlePushCan"
            label="是否可推送中间库"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select :disabled="String(handleStatus) === '1'" v-model="scope.row.middlePushCan" placeholder="" size="small">
                <el-option
                  v-for="item in ismiddlePushCan"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-button :disabled="String(handleStatus) === '1'" type="primary" size="small" style="float:left;" @click="appendrow">＋添加</el-button>
        <el-button :disabled="String(handleStatus) === '1'" type="primary" size="small" style="float:left;" @click="deleterow">－删除</el-button>
      </el-row>
      <el-row>
        <el-col>
          <text-upload :uploadOption="uploadOption" @getTxtCon="getTxtData"
                       style="float:right;margin-top:20px;display: inline;"></text-upload>
        </el-col>
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
          <el-radio :disabled="String(handleStatus) === '1'" @blur="verficationNull(deailradio,4)" v-model="deailradio" label="0" @change="selectradio">标准化
          </el-radio>
          <el-radio :disabled="String(handleStatus) === '1'" @blur="verficationNull(deailradio,4)" v-model="deailradio" label="1" @change="selectradio">非标准化
          </el-radio>
        </el-col>
        <el-col :span="3" v-if="nulldeailradio" class="verfynull">调取类别不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span>调取期限</el-col>
        <el-col :span="6">
          <el-select :disabled="String(handleStatus) === '1'" @blur="verficationNull(time,5)" allow-create filterable v-model="time" placeholder="" size="small"
                     style="width:58%;margin-top:-10px">
            <el-option
              v-for="item in istime"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" v-if="nulltime" class="verfynull" style="margin-left:0px">调取期限不能为空!</el-col>
      </el-row>
      <el-row style="margin: 20px 0 15px 30px;">
        <el-col :span="3">补充说明</el-col>
        <el-col :span="18">
          <el-input :disabled="String(handleStatus) === '1'" v-bind:maxlength=200 type="textarea" v-model="adddescription" placeholder="字符限制200以内" size="medium"
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
          <el-input :disabled="String(handleStatus) === '1'" placeholder="字符限制200以内" v-bind:maxlength=200 type="textarea" v-model="auditoption" size="medium"
                    style="width:92.5%"></el-input>
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
    <selectPersonComponent :selectData="selectData" @obdSelectPerson="submitfrom" ref="selectPersonComponent"
                           v-if="selectData.dialogFormVisble"></selectPersonComponent>
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
  import HistoryMsgComTable from '../selfsupervision/historyMsgCommonTable'
  import Breadcrumb from '../../common/Breadcrumb'
  import selectPersonComponent from '../superviseTaskComponent/selectPersonComponent'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import {
    getsurveynumber,
    postsurveyprocessform,
    getsurveycheckform,
    getsurveyaccountinfo,
    getsurveyhistroyinfo,
    postsaveobd,
    getdisplaywarninfo,
    getsurveyhistoryopiniondata,
    getInfoId,
    getfilelist,
    deletefile,
    getObtainedInfo,
    ispermitload,
    getActivityNameByProcessName
  } from '../../../service/superviseTask/index.js'
  import { tabletimeformat } from '../../../utils/dateTimeFormat.js'
  import MinxinVue from '../MixIn'
  import MixinAuthority from '../MixinAuthority'

  export default {
    components: {
      Breadcrumb,
      TextUpload: () => import('../../common/textUpload'),
      StockCodeQuery,
      selectPersonComponent,
      HistoryMsgComTable
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
          processName: 'ngsp_obd_flow',
          businessData: {},
          userId: ''
        },
        processStatus: 0,
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
        isassortment: [{
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }],
        ismiddlePushCan: [{
          value: '可以',
          label: '可以'
        }, {
          value: '不可',
          label: '不可'
        }],
        ismatter: [{
          value: '集合竞价虚假申报',
          label: '集合竞价虚假申报'
        }, {
          value: '盘中虚假申报',
          label: '盘中虚假申报'
        }, {
          value: '涨跌停板虚假申报',
          label: '涨跌停板虚假申报'
        }, {
          value: '涨跌停板大额申报',
          label: '涨跌停板大额申报'
        }, {
          value: '拉升（打压）股票开盘价格',
          label: '拉升（打压）股票开盘价格'
        }, {
          value: '拉升（打压）股票盘中价格',
          label: '拉升（打压）股票盘中价格'
        }, {
          value: '拉升（打压）股票收盘价格',
          label: '拉升（打压）股票收盘价格'
        }, {
          value: '拉升（打压）债券价格',
          label: '拉升（打压）债券价格'
        }, {
          value: '拉升（打压）基金价格',
          label: '拉升（打压）基金价格'
        }, {
          value: '反向交易',
          label: '反向交易'
        }, {
          value: '对倒',
          label: '对倒'
        }, {
          value: '大宗交易异常',
          label: '大宗交易异常'
        }, {
          value: '买入风险警示股超限',
          label: '买入风险警示股超限'
        }, {
          value: '程序化交易异常',
          label: '程序化交易异常'
        }, {
          value: '调取资料',
          label: '调取资料'
        }, {
          value: '其他－股票',
          label: '其他－股票'
        }, {
          value: '其他－债券',
          label: '其他－债券'
        }, {
          value: '其他－基金',
          label: '其他－基金'
        }, {
          value: '其他',
          label: '其他'
        }],
        isbehavior: [{
          value: '拉升虚拟开盘价',
          label: '拉升虚拟开盘价 '
        }, {
          value: '打压虚拟开盘价',
          label: '打压虚拟开盘价'
        }, {
          value: '频繁虚假申报买入',
          label: '频繁虚假申报买入'
        }, {
          value: '频繁虚假申报卖出',
          label: '频繁虚假申报卖出'
        }, {
          value: '双向申报异常（申买实卖）',
          label: '双向申报异常（申买实卖）'
        }, {
          value: '双向申报异常（申卖实买）',
          label: '双向申报异常（申卖实买）'
        }, {
          value: '涨停板虚假申报',
          label: '涨停板虚假申报'
        }, {
          value: '跌停板虚假申报',
          label: '跌停板虚假申报'
        }, {
          value: '尾盘封涨停',
          label: '尾盘封涨停'
        }, {
          value: '尾盘封跌停',
          label: '尾盘封跌停'
        }, {
          value: '拉升开盘价',
          label: '拉升开盘价'
        }, {
          value: '打压开盘价',
          label: '打压开盘价'
        }, {
          value: '拉升开盘价后卖出',
          label: '拉升开盘价后卖出'
        }, {
          value: '打压开盘价后买入',
          label: '打压开盘价后买入'
        }, {
          value: '股票盘中拉升',
          label: '股票盘中拉升'
        }, {
          value: '股票盘中打压',
          label: '股票盘中打压'
        }, {
          value: '股票盘中拉升后卖出',
          label: '股票盘中拉升后卖出'
        }, {
          value: '股票盘中打压后买入',
          label: '股票盘中打压后买入'
        }, {
          value: '拉升至涨停后卖出',
          label: '拉升至涨停后卖出'
        }, {
          value: '打压至跌停后买入',
          label: '打压至跌停后买入'
        }, {
          value: '大宗交易接盘方卖出异常',
          label: '大宗交易接盘方卖出异常'
        }, {
          value: '拉升股票收盘价',
          label: '拉升股票收盘价'
        }, {
          value: '打压股票收盘价',
          label: '打压股票收盘价'
        }, {
          value: '拉升股票收盘价后卖出',
          label: '拉升股票收盘价后卖出'
        }, {
          value: '打压股票收盘价后买入',
          label: '打压股票收盘价后买入'
        }, {
          value: '隔日反向交易',
          label: '隔日反向交易'
        }, {
          value: '日内反向交易',
          label: '日内反向交易'
        }, {
          value: '一码通对倒',
          label: '一码通对倒'
        }, {
          value: '关联账户对倒',
          label: '关联账户对倒'
        }, {
          value: '债券盘中拉升',
          label: '债券盘中拉升'
        }, {
          value: '债券盘中打压',
          label: '债券盘中打压'
        }, {
          value: '拉升债券收盘价',
          label: '拉升债券收盘价'
        }, {
          value: '打压债券收盘价',
          label: '打压债券收盘价'
        }, {
          value: '其他－债券',
          label: '其他－债券'
        }, {
          value: '基金盘中拉升',
          label: '基金盘中拉升'
        }, {
          value: '基金盘中打压',
          label: '基金盘中打压'
        }, {
          value: '其他－基金',
          label: '其他－基金'
        }, {
          value: '涨停板大额申报后反向交易',
          label: '涨停板大额申报后反向交易'
        }, {
          value: '跌停板大额申报后反向交易',
          label: '跌停板大额申报后反向交易'
        }, {
          value: '大宗竞价高买低卖',
          label: '大宗竞价高买低卖'
        }, {
          value: '买入风险警示股超限',
          label: '买入风险警示股超限'
        }, {
          value: '程序化交易异常',
          label: '程序化交易异常'
        }, {
          value: '其他－股票',
          label: '其他－股票'
        }, {
          value: '维稳',
          label: '维稳'
        }, {
          value: '其他异常',
          label: '其他异常'
        }, {
          value: '固定收益平台交易异常',
          label: '固定收益平台交易异常'
        }, {
          value: '涉嫌跨期操纵股',
          label: '涉嫌跨期操纵股'
        }, {
          value: '涉嫌短线操纵股',
          label: '涉嫌短线操纵股'
        }, {
          value: '涉嫌利益输送',
          label: '涉嫌利益输送'
        }, {
          value: '涉嫌内幕',
          label: '涉嫌内幕'
        }, {
          value: '持有证券超比例',
          label: '持有证券超比例'
        }, {
          value: '其他',
          label: '其他'
        },],
        filelist1: [],
        uploadBasicUrl: '',
        istime: [{
          value: '一个月',
          label: '一个月'
        }, {
          value: '三个月',
          label: '三个月'
        }, {
          value: '半年',
          label: '半年'
        },],
        uploadOption: {
          name: '指定导入',
          size: 'small',
          disabledflag: false
        },
        warningdata: [],
        tabledeleterow: [],
        title: '无-集合竞价虚假申报',
        number: '',
        bondcode: '',
        Ecount: '',
        logtext: '',
        sendtext: '',
        matter: '集合竞价虚假申报',
        behavior: '拉升虚拟开盘价',
        radio: '1',
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        selectval: [],
        processinfo6: '',
        deailradio: '0',
        flagradio: '',
        newcreat: true,
        warningtableflag: false,
        adddescription: '',
        buttondispaly: [],
        time: '三个月',
        accounthistorydata: [],
        auditoption: '',
        infoId: '',
        nulltitle: false,
        nullnumber: false,
        nullbondcode: false,
        nulldeailradio: false,
        nulllogtext: false,
        nulltime: '',
        urlstrs: [],
        taskId: '',
        instanceId: '',
        displaywarninfo: false,
        createType: '1',
        deailcasedataflag: false,
        alarmId: '',
        isopearte: '',
        handleStatus: '',
        stockradio: '',
        showUploadButton: true,
        fileNameList1: []
      }
    },
    mounted () {
      const {isoperateCheck, taskId, instanceId, processStatus, params, alarmId} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        // 从实时监控分析进入
        if (params) {
          let paramsInfo = JSON.parse(params)
          if (paramsInfo.createType == '2') {
            this.displaywarninfo = true
            this.commonData.stockCode.push(paramsInfo.stockCode + ' ' + paramsInfo.stockCodeName)
            // 带入选中的账户
            this.createType = '0'
            this.isopearte = 'new'
            this.getTxtData([paramsInfo.accountCode.split(',')])
            this.getnum()
            this.getInfoId()
          }
        } else if (alarmId) {
          this.createType = '0'
          // 从预警列表进入
          this.displaywarninfo = true
          /* this.matter = this.$route.params.param.investigateMattersName
           this.behavior = this.$route.params.param.abnormalBehaviorName
           this.createType = this.$route.params.param.createType
           this.sendtext = this.$route.params.param.alarm_remark */
          this.alarmId = alarmId
          this.warnturninto()
          this.getInfoId()
        } else {
          this.displaywarninfo = false
          this.isbehavior = [{
            value: '拉升虚拟开盘价',
            label: '拉升虚拟开盘价 '
          }, {
            value: '打压虚拟开盘价',
            label: '打压虚拟开盘价'
          }]
          this.dealTableFlag = false
          this.handleStatus = isoperateCheck
          this.taskId = taskId
          this.instanceId = instanceId
        }
        if (isoperateCheck == '1') {
          this.commonData.disabled = true
          this.uploadOption.disabledflag = true
          this.newcreat = false
          this.gethistoryform()
          this.getAllData()
        } else if (isoperateCheck == '2') {
          this.newcreat = true
          this.gethistoryform()
          this.getAllData()
        } else {
          this.newcreat = true
          this.getnum()
          this.isopearte = 'new'
          this.getInfoId()
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
          callback && callback()
        })
      },
      isnullcode () {
        this.commonData.stockCode = []
        this.title = '无-' + this.matter
      },
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
          this.uploadBasicUrl = '/ngsp/bpm/v1/attachment/upload?fileLoc=obd_BasicInfo_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
        })
      },
      displaySelectPerson () {
        if (this.title == '' || this.title == null) {
          this.nulltitle = true
          return
        }
        if (this.commonData.stockCode.length == 0 && this.stockradio == '') {
          this.nullbondcode = true
          return
        }
        if (this.warningdata.length == 0) {
          this.$message.error('提交失败，账户信息不能为空!')
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
        this.selectData.dialogFormVisble = true
        // this.selectData.activityName = '确认调查单'
        // this.selectData.instanceId = ''
        // this.selectData.processName = 'ngsp_obd_flow'
        // this.selectData.businessData = {}
      },
      historyrecord (row) {
        window.open(`#/finishform?flag=${true}&warningNo=${row.wh}&instanceId=${row.infoId}`)
      },
      gethistoryform () {
        getsurveyhistoryopiniondata(this.instanceId).then((resp) => {
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
      openwarnpage () {
        window.open(`#/tdateAlarmDetail/${this.alarmId}`)
      },
      warnturninto () {
        getdisplaywarninfo(this.alarmId).then((resp) => {
          let code = []
          let i = 0
          for (let item of resp.wBasicList.bizData.metaData) {
            this.title = item.title
            this.logtext = item.log_record
            this.sendtext = item.alarm_remark
            this.commonData.stockCode.push(item.securities_code + ' ' + item.securities_name)
          }
          for (let item of resp.wAcctList.bizData.metaData) {
            code[i] = item.invacctno
            i++
          }
          this.getTxtData(code)
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
        this.title = (this.commonData.stockCode[0] ? this.commonData.stockCode[0] : '无') + '-' + this.matter
        this.stockradio = ''
        if (this.commonData.stockCode.length == 0) {
          this.nullbondcode = true
        } else {
          this.nullbondcode = false
        }
      },
      selectradio () {
        this.nulldeailradio = false
      },
      verficationNull (value, flag) {
        if (value == '' || value == null) {
          switch (flag) {
            case 1:
              this.nulltitle = true
              break
            case 2:
              this.nullbondcode = true
              break
            case 3:
              this.nulllogtext = true
              break
            case 4:
              this.nulldeailradio = true
              break
            case 5:
              this.nulltime = true
              break

          }
        } else {
          switch (flag) {
            case 1:
              this.nulltitle = false
              break
            case 2:
              this.nullbondcode = false
              break
            case 3:
              this.nulllogtext = false
              break
            case 4:
              this.nulldeailradio = false
              break
            case 5:
              this.nulltime = false
              break
          }
        }
      },
      changetype1 () {
        this.isbehavior = []
        switch (this.matter) {
          case '集合竞价虚假申报':
            this.isbehavior.push({
              value: '拉升虚拟开盘价',
              label: '拉升虚拟开盘价'
            }, {
              value: '打压虚拟开盘价',
              label: '打压虚拟开盘价'
            })
            this.behavior = '拉升虚拟开盘价'
            break
          case '盘中虚假申报':
            this.isbehavior.push({
              value: '频繁虚假申报买入',
              label: '频繁虚假申报买入'
            }, {
              value: '频繁虚假申报卖出',
              label: '频繁虚假申报卖出'
            }, {
              value: '双向申报异常（申买实卖）',
              label: '双向申报异常（申买实卖）'
            }, {
              value: '双向申报异常（申卖实买）',
              label: '双向申报异常（申卖实买）'
            })
            this.behavior = '频繁虚假申报买入'
            break
          case '涨跌停板虚假申报':
            this.isbehavior.push({
              value: '涨停板虚假申报',
              label: '涨停板虚假申报'
            }, {
              value: '跌停板虚假申报',
              label: '跌停板虚假申报'
            }, {
              value: '尾盘封涨停',
              label: '尾盘封涨停'
            }, {
              value: '尾盘封跌停',
              label: '尾盘封跌停'
            })
            this.behavior = '涨停板虚假申报'
            break
          case '拉升（打压）股票开盘价格':
            this.isbehavior.push({
              value: '拉升开盘价',
              label: '拉升开盘价'
            }, {
              value: '打压开盘价',
              label: '打压开盘价'
            }, {
              value: '拉升开盘价后卖出',
              label: '拉升开盘价后卖出'
            }, {
              value: '打压开盘价后买入',
              label: '打压开盘价后买入'
            })
            this.behavior = '拉升开盘价'
            break
          case '拉升（打压）股票盘中价格':
            this.isbehavior.push({
              value: '股票盘中拉升',
              label: '股票盘中拉升'
            }, {
              value: '股票盘中打压',
              label: '股票盘中打压'
            }, {
              value: '股票盘中拉升后卖出',
              label: '股票盘中拉升后卖出'
            }, {
              value: '股票盘中打压后买入',
              label: '股票盘中打压后买入'
            }, {
              value: '拉升至涨停后卖出',
              label: '拉升至涨停后卖出'
            }, {
              value: '打压至跌停后买入',
              label: '打压至跌停后买入'
            }, {
              value: '大宗交易接盘方卖出异常',
              label: '大宗交易接盘方卖出异常'
            })
            this.behavior = '股票盘中拉升'
            break
          case '拉升（打压）股票收盘价格':
            this.isbehavior.push({
              value: '拉升股票收盘价',
              label: '拉升股票收盘价'
            }, {
              value: '打压股票收盘价',
              label: '打压股票收盘价'
            }, {
              value: '拉升股票收盘价后卖出',
              label: '拉升股票收盘价后卖出'
            }, {
              value: '打压股票收盘价后买入',
              label: '打压股票收盘价后买入'
            })
            this.behavior = '拉升股票收盘价'
            break
          case '反向交易':
            this.isbehavior.push({
              value: '隔日反向交易',
              label: '隔日反向交易'
            }, {
              value: '日内反向交易',
              label: '日内反向交易'
            },)
            this.behavior = '隔日反向交易'
            break
          case '对倒':
            this.isbehavior.push({
              value: '一码通对倒',
              label: '一码通对倒'
            }, {
              value: '关联账户对倒',
              label: '关联账户对倒'
            })
            this.behavior = '一码通对倒'
            break
          case '拉升（打压）债券价格':
            this.isbehavior.push({
              value: '债券盘中拉升',
              label: '债券盘中拉升'
            }, {
              value: '债券盘中打压',
              label: '债券盘中打压'
            }, {
              value: '拉升债券收盘价',
              label: '拉升债券收盘价'
            }, {
              value: '打压债券收盘价',
              label: '打压债券收盘价'
            })
            this.behavior = '债券盘中拉升'
            break
          case '其他－债券':
            this.isbehavior.push({
              value: '其他－债券',
              label: '其他－债券'
            })
            this.behavior = '其他－债券'
            break
          case '拉升（打压）基金价格':
            this.isbehavior.push({
              value: '基金盘中拉升',
              label: '基金盘中拉升'
            }, {
              value: '基金盘中打压',
              label: '基金盘中打压'
            },)
            this.behavior = '基金盘中拉升'
            break
          case '其他－基金':
            this.isbehavior.push({
              value: '其他－基金',
              label: '其他－基金'
            },)
            this.behavior = '其他－基金'
            break
          case '涨跌停板大额申报':
            this.isbehavior.push({
              value: '涨停板大额申报后反向交易',
              label: '涨停板大额申报后反向交易'
            }, {
              value: '跌停板大额申报后反向交易',
              label: '跌停板大额申报后反向交易'
            }, {
              value: '涨停板大额申报',
              label: '涨停板大额申报'
            }, {
              value: '跌停板大额申报',
              label: '跌停板大额申报'
            },)
            this.behavior = '涨停板大额申报后反向交易'
            break
          case '大宗交易异常':
            this.isbehavior.push({
              value: '大宗竞价高买低卖',
              label: '大宗竞价高买低卖'
            },)
            this.behavior = '大宗竞价高买低卖'
            break
          case '买入风险警示股超限':
            this.isbehavior.push({
              value: '买入风险警示股超限',
              label: '买入风险警示股超限'
            },)
            this.behavior = '买入风险警示股超限'
            break
          case '程序化交易异常':
            this.isbehavior.push({
              value: '程序化交易异常',
              label: '程序化交易异常'
            },)
            this.behavior = '程序化交易异常'
            break
          case '其他－股票':
            this.isbehavior.push({
              value: '其他－股票',
              label: '其他－股票'
            }, {
              value: '维稳',
              label: '维稳'
            },)
            this.behavior = '其他－股票'
            break
          case '其他':
            this.isbehavior.push({
              value: '其他异常',
              label: '其他异常'
            },)
            this.behavior = '其他异常'
            break
          case '调取资料':
            this.isbehavior.push({
              value: '固定收益平台交易异常',
              label: '固定收益平台交易异常'
            }, {
              value: '涉嫌跨期操纵股',
              label: '涉嫌跨期操纵股'
            }, {
              value: '涉嫌短线操纵股',
              label: '涉嫌短线操纵股'
            }, {
              value: '涉嫌利益输送',
              label: '涉嫌利益输送'
            }, {
              value: '涉嫌内幕',
              label: '涉嫌内幕'
            }, {
              value: '持有证券超比例',
              label: '持有证券超比例'
            }, {
              value: '其他',
              label: '其他'
            },)
            this.behavior = '固定收益平台交易异常'
            break
        }
        this.title = (this.commonData.stockCode[0] ? this.commonData.stockCode[0] : '无') + '-' + this.matter
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
        if (this.warningdata.length == 0) {
          this.$message.error('提交失败，账户信息不能为空!')
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
            'extend1': this.createType,
            'extend2': this.alarmId
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
            'receiveAttachid': ''
          },
          'accountInfos': this.warningdata,
          'taskId': this.taskId,
          'instanceId': this.instanceId,
          'toWhom': '',
          'operate': this.isopearte
        }
        let isparams = JSON.stringify(params)
        postsaveobd(isparams).then((resp) => {
          this.isopearte = ''
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        })
      },
      getTxtData (TxtData) {
        let result = []
        if (this.warningdata.length) {
          this.warningdata.forEach(item => {
            TxtData.push(item.accountCode)
          })
          result = [...new Set(TxtData)]
        } else {
          result = TxtData
        }
        getsurveyaccountinfo(result.join(',')).then((resp) => {
          this.warningdata = []
          let isaccountinfo = resp.bizData.metaData
          if (isaccountinfo == []) {
            this.warningdata.push(isaccountinfo[i])
          } else {
            for (let i = 0; i < isaccountinfo.length; i++) {
              if (isaccountinfo[i].member == '') {
                isaccountinfo[i].middlePushCan = '不可'
              } else {
                isaccountinfo[i].middlePushCan = '可以'
              }
              let reg = /^[A-Za-z]+$/
              if (reg.test(isaccountinfo[i].assortment)) {
                isaccountinfo[i].assortment = '是'
              } else {
                isaccountinfo[i].assortment = '否'
              }
              isaccountinfo[i].accountName = isaccountinfo[i].accountPeople
              this.warningdata.push(isaccountinfo[i])
            }
            let accountCodes = []
            let flag = 0
            for (let item of this.warningdata) {
              accountCodes[flag++] = item.accountCode
            }
            this.allaccountCodes = accountCodes.join(',')
            getsurveyhistroyinfo(this.allaccountCodes).then((resp) => {
              this.accounthistorydata = resp.regularotyHistorys
              this.getRetrieveInfoTableData()
            })

          }
        }, (error) => {
          this.$message.error('文件内容或格式错误!')
        })
      },
      displayinfo (index, row) {
        console.log(row.accountCode)
        let data = this.warningdata
        for (let i = 0; i < data.length - 1; i++) {
          if (data[i].accountCode === row.accountCode) {
            console.log(this.warningdata.accountCode)
            row.accountCode = ''
            this.$message.error('输入证券账户重复！')
          }
        }
        getsurveyaccountinfo(row.accountCode).then((resp) => {
          let isaccountinfo = resp.bizData.metaData
          if (isaccountinfo.length == 0) {
            this.warningdata.splice(index, 1, isaccountinfo)
            let accountCodes = []
            let flag = 0
            for (let item of this.warningdata) {
              accountCodes[flag++] = item.accountCode
            }
            this.allaccountCodes = accountCodes.join(',')
            getsurveyaccountinfo(this.allaccountCodes).then((resp) => {
              this.accounthistorydata = resp.regularotyHistorys
            })
          } else {
            for (let i = 0; i < isaccountinfo.length; i++) {
              if (isaccountinfo[i].member == '') {
                isaccountinfo[i].middlePushCan = '不可'
              } else {
                isaccountinfo[i].middlePushCan = '可以'
              }
              let reg = /^[A-Za-z]+$/
              if (reg.test(isaccountinfo[i].assortment)) {
                isaccountinfo[i].assortment = '是'
              } else {
                isaccountinfo[i].assortment = '否'
              }
              isaccountinfo[i].accountName = isaccountinfo[i].accountPeople
              this.warningdata.splice(index, 1, isaccountinfo[0])
            }
            let accountCodes = []
            let flag = 0
            for (let item of this.warningdata) {
              accountCodes[flag++] = item.accountCode
            }
            this.allaccountCodes = accountCodes.join(',')
            getsurveyhistroyinfo(this.allaccountCodes).then((resp) => {
              this.accounthistorydata = resp.regularotyHistorys
              this.getRetrieveInfoTableData()
            })
          }
        }, (error) => {
          this.$message.error('导入失败，请重新导入!')
        })
      },
      // displayinfo(index,row) {
      //   console.log(row)
      //     for(let item of this.warningdata){
      //       if(item.accountCode==row.accountCode){
      //         row.accountCode=''
      //         this.$message.error("输入证券账户重复！")
      //       }
      //     }
      //     getsurveyaccountinfo(row.accountCode).then((resp) => {
      //     let isaccountinfo = resp.bizData.metaData
      //     if (isaccountinfo == []) {
      //       this.warningdata.push(isaccountinfo[i])
      //     } else {
      //       for (let i = 0; i < isaccountinfo.length; i++) {
      //         if (isaccountinfo[i].member == "") {
      //           isaccountinfo[i].middlePushCan = "不可"
      //         } else {
      //           isaccountinfo[i].middlePushCan = "可以"
      //         }
      //         let reg=/^[A-Za-z]+$/
      //         if(reg.test(isaccountinfo[i].assortment)){
      //           isaccountinfo[i].assortment="是"
      //         }else{
      //           isaccountinfo[i].assortment="否"
      //         }
      //         isaccountinfo[i].accountName=isaccountinfo[i].accountPeople
      //         this.warningdata.push(isaccountinfo[i])
      //       }
      //       let accountCodes = []
      //       let flag = 0
      //       for (let item of this.warningdata) {
      //         accountCodes[flag++] = item.accountCode
      //       }
      //       this.allaccountCodes = accountCodes.join(',')
      //       getsurveyhistroyinfo(this.allaccountCodes).then((resp) => {
      //         this.accounthistorydata = resp.regularotyHistorys
      //       });
      //     }
      //   });
      // },
      getAllData () {
        getsurveycheckform(this.instanceId).then((resp) => {
          this.processStatus = resp.obdMain.processStatus
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
          this.getfilelist()
          // this.time = resp.obdMain.obtainLimit;
        })
      },
      getnum () {
        getsurveynumber(this.createType).then((resp) => {
          this.number = resp
        })
      },
      getRetrieveInfoTableData(){
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
      },
      submitfrom (person) {
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let analyseResult = ''
        let ismesureradio = ''
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
            'analyseResult': analyseResult,
            'obtainType': this.deailradio,
            'processStatus': this.processStatus,
            'obtainLimit': this.time,
            'instructions': this.adddescription,
            'comment': this.auditoption,
            'extend1': this.createType,
            'extend2': this.alarmId
          },
          'accountInfos': this.warningdata,
          'taskId': this.taskId,
          'toWhom': person,
          'operate': this.isopearte
        }
        let isparams = JSON.stringify(params)
        postsurveyprocessform(isparams).then((resp) => {
          this.goBack()
        })
      },
      popbox (row, event) {
        if (event.button == 2 || event.button == 0) {
          this.warningtableflag = true
          this.tabledeleterow = row
          window.oncontextmenu = function () {
            return false
          }
        }

      },
      handleselecttionchange (val) {
        this.selectval = val
      },
      deleterow () {
        let isdeletestockcode = []
        for (let i = 0; i < this.warningdata.length; i++) {
          for (let j = 0; j < this.selectval.length; j++) {
            if (this.selectval[j].accountCode == this.warningdata[i].accountCode) {
              this.warningdata.splice(i, 1)
            }
          }
        }
        let data = []
        for (let item of this.warningdata) {
          data.push(item.accountCode)
        }
        this.getTxtData(data)
      },
      appendrow () {
        this.warningtableflag = false
        this.warningdata.push({
          'accountCode': '',
          'accountName': '',
          'memberName': '',
          'salepartName': '',
          'oneword': '',
          'accountType': ''
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
