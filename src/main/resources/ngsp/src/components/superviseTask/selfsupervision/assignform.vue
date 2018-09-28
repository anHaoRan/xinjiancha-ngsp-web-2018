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
          <el-input :disabled="true" type="textarea" v-bind:rows=4 v-model="logtext" placeholder="输入内容在2000字以内"
                    size="medium" style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">发函描述</el-col>
        <el-col :span="18">
          <el-input :disabled="true" type="textarea" v-bind:rows=4 v-model="sendtext" placeholder="输入内容在2000字以内"
                    size="medium" style="width:92.5%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
            <el-upload
              class="upload-demo"
              :action=uploadurl
              :file-list="filelist1"
              disabled
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
            width="110"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="账户名称"
            width="110"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="member"
            label="会员名称"
            width="160"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="salepart"
            label="营业部名称"
            width="160"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="oneword"
            label="一码通"
            width="140"
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
            width="160"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="contactP1"
            label="联系人"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="contactNo1"
            label="联系方式"
            width="140"
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
            width="50"
            label="序号">
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
            label="监管标准"
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
      <el-row style="margin: 20px 0 15px 30px;">分析结果：</el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span=9>
          <el-checkbox v-model="checked1" disabled>两年内两次执行纪律处分</el-checkbox>
        </el-col>
        <el-col :span=7>
          <el-checkbox v-model="checked2" disabled>处于重点账户监控期内</el-checkbox>
        </el-col>
        <el-col :span=7>
          <el-checkbox v-model="checked3" disabled>监控期内达到3次以上异常交易行为</el-checkbox>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span=9>
          <el-checkbox v-model="checked4" disabled>最近3个月内被本所实施过2次警示（口头/书面）</el-checkbox>
        </el-col>
        <el-col :span=7>
          <el-checkbox v-model="checked5" disabled>最近6个月内被本所实施过2次盘中暂停</el-checkbox>
        </el-col>
        <el-col :span=7>
          <el-checkbox v-model="checked6" disabled>专业机构近一个月内采取2次及以上监管措施</el-checkbox>
        </el-col>
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
        <el-col :span="3"><span style="color:red">*</span><span>监管标准</span></el-col>
        <el-col :span="18">
          <el-radio disabled v-model="deailradio" label="0" @change="displaydeail">标准化监管</el-radio>
          <el-radio disabled v-model="deailradio" label="1" style="margin-left:85px" @change="displaydeail">差异化监管
          </el-radio>
          <el-radio disabled v-model="deailradio" label="2" style="margin-left:85px" @change="displaydeail">纪律处分
          </el-radio>
        </el-col>
        <el-col :span="3" v-if="nulldeailradio" class="verfynull">监管标准不能为空!</el-col>
      </el-row>
      <div v-if="deailflag1">
        <el-row style="margin: 20px 0 15px 30px;" v-if="differentiationflag">
          <el-col :span="3"><span style="color:red">*</span><span>差异化分类</span></el-col>
          <el-col :span="18">
            <el-radio disabled v-model="differentiationadio" label="0" @change="differentradio">涉嫌庄股操纵</el-radio>
            <el-radio disabled v-model="differentiationadio" label="1" style="margin-left:72px"
                      @change="differentradio">频繁参与异动股炒作
            </el-radio>
            <el-radio disabled v-model="differentiationadio" label="2" style="margin-left:30px"
                      @change="differentradio">维护市场稳定
            </el-radio>
            <el-radio disabled v-model="differentiationadio" label="3" style="margin-left:55px"
                      @change="differentradio">其他情节较为严重的异常行为
            </el-radio>
          </el-col>
          <el-col :span="3" v-if="nulldifferentiationadio" class="verfynull">差异化分类不能为空!</el-col>
        </el-row>
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3"><span style="color:red">*</span><span>监管措施</span></el-col>
          <el-col :span="18">
            <el-checkbox disabled v-model="measureradioa" @change="Undisplaysuspendtable">口头警示</el-checkbox>
            <el-checkbox disabled v-model="measureradiob" style="margin-left:102px" @change="Undisplaysuspendtable">
              书面警示
            </el-checkbox>
            <el-checkbox disabled v-model="measureradioc" style="margin-left:100px" @change="displaysuspendtable">
              盘中暂停交易
            </el-checkbox>
            <el-checkbox disabled v-model="measureradiod" style="margin-left:55px" @change="displaysuspendtable">
              持续暂停交易
            </el-checkbox>
          </el-col>
          <el-col :span="3" v-if="nullmeasureradio" class="verfynull">监管措施不能为空!</el-col>
        </el-row>
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3">辅助措施</el-col>
          <el-col :span="2">
            <el-checkbox disabled v-model="measurechecked1">要求限期改正</el-checkbox>
          </el-col>
          <el-col :span="2">
            <el-checkbox disabled v-model="measurechecked2" style="margin-left:55px">监管谈话</el-checkbox>
          </el-col>
          <el-col :span="2">
            <el-checkbox disabled v-model="measurechecked3" style="margin-left:105px">要求提交合规承诺书</el-checkbox>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3">投资者标记</el-col>
          <el-col :span="18">
            <el-checkbox disabled v-model="flagradio">列为重点监控账户</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div v-if="deailflag3">
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3"><span style="color:red">*</span><span>监管措施</span></el-col>
          <el-col :span="3">
            <el-checkbox disabled v-model="measureradio1" label="4" @change="dispalylimittable">限制交易</el-checkbox>
          </el-col>
          <el-col :span="1">期限</el-col>
          <el-col :span="6">
            <el-select disabled allow-create filterable v-model="time" placeholder="" size="small"
                       style="width:58%;margin-top:-10px" @change="dispalylimittable">
              <el-option
                v-for="item in istime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-if="nullmeasureradio" class="verfynull" style="margin-left:5%">监管措施不能为空!</el-col>
        </el-row>
        <el-row style="margin-left:15%">
          <el-col :span="3">
            <el-checkbox disabled v-model="measureradio2" label="5">认定为不合格投资者</el-checkbox>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3">投资者标记</el-col>
          <el-col :span="18">
            <el-checkbox disabled v-model="flagradio">列为重点监控账户</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">上传附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
            <el-upload
              disabled
              class="upload-demo"
              :action=uploadurlsecond
              :file-list="filelist2"
              disabled
              :on-preview="handelpreview"
              :on-success="getfileID"
              :on-remove="deletefilelist"
              style="display:inline-block"
            >
              <el-button
                disabled
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
                  v-for="item in fileNameList2"
                  :key="item">
                  {{item}}
                </span>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="limittable">
        <el-col style="margin: 30px 0 5px 30px;">限制交易表</el-col>
        <el-col>
          <el-button
            type="primary"
            size="small"
            disabled
            style="position:absolute;right:0%;bottom:0%"
            @click="downLoadLimitTable"
          >下载
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="limittable">
        <el-table
          style="margin-top:10px;"
          :data="slsRestricttrades"
          :fit=true
          border>
          <el-table-column
            type="index"
            width="50"
            label="序号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="证券账户"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="accountUser"
            label="开户人"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="salepart"
            label="证券账户所在营业部"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="punishTime"
            label="处分决定时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="punishReason"
            label="处分事由"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="restrictTime"
            label="限制交易时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="violation"
            label="违规事实"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="punishScheme"
            label="处分内容"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="accountCode"
            label="证券代码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="processPerson"
            label="处理人"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="stockTrader"
            label="券商"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="certificateNo"
            label="相关证件号码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="documentNo"
            label="相关文号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="punishDocument"
            label="处罚决定书名称"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-row>
      </el-row>
      <el-row v-if="suspendtable">
        <el-col style="margin: 30px 0 5px 30px;">盘中暂停交易表</el-col>
        <el-col>
          <el-button
            type="primary"
            size="small"
            disabled
            style="position:absolute;right:0%;bottom:0%"
            @click="downLoadSuspendTable"
          >下载
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="suspendtable">
        <el-table
          style="margin-top:10px;"
          :data="pausetable"
          :fit=true
          border>
          <el-table-column
            type="index"
            width="50"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="pauseDate"
            label="暂停日期"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="direction"
            label="方向"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="stocktype"
            label="品种"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="oneword"
            label="一码通账户"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="账户名称"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="salepart"
            label="会员及营业部名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="involveStock"
            label="所涉证券"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="abnormalBehav1"
            label="异常行为类型（一级分类）"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="abnormalBehav2"
            label="异常行为类型（二级分类）"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="behavDesc"
            label="行为描述"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="isSerious"
            label="是否严重"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="recoverDate"
            label="恢复日期"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="pauseReason"
            label="暂停原因"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
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
          <el-input :disabled="isabledwrite" placeholder="字符限制200以内" v-bind:maxlength=200 type="textarea"
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
    <selectPersonComponent :selectData="selectData" @obdSelectPerson="submitfrom" ref="selectPersonComponent"
                           v-if="selectData.dialogFormVisble"></selectPersonComponent>
    <div>
  		<span>
  			<el-button type="primary" @click="goBack"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
  		</span>
    </div>
    <div v-for="item in buttondispaly">
  		<span>
  			<el-button style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0"
                   @click="displaySelectPerson(item)">{{item}}</el-button>
  		</span>
      <!--       <el-dialog
              title=""
              :visible.sync="dialogFormVisble"
              center
              width="700px">
              <el-form>
                <el-form-item label="执行任务小组：" :label-width="formLabelWidth">
                  <el-select v-model="towhom" placeholder="" size="small" style="width:70%">
                    <el-option
                      v-for="item in istowhom"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="veryfy">确 定</el-button>
                <el-button type="primary" size="small" @click="cancleVeryfy">取 消</el-button>
              </div>
            </el-dialog> -->
    </div>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectPersonComponent from '../superviseTaskComponent/selectPersonComponent'
  import {
    post
  } from '../../../utils/api.js'
  import {
    getcheckform,
    gethistoryopiniondata,
    getbuttonname,
    postissubmit,
    ispermitload,
    getfilelist,
    getsuspendtable,
    deletefile,
    getActivityNameByProcessName,
    getObtainedInfo
  } from '../../../service/superviseTask/index.js'
  import {
    add0,
    dateformat,
    timeformat,
    tabletimeformat
  } from '../../../utils/dateTimeFormat.js'
  import MinxinVue from '../MixIn'
  import HistoryMsgComTable from './historyMsgCommonTable'

  export default {
    components: {
      Breadcrumb,
      StockCodeQuery,
      selectPersonComponent,
      HistoryMsgComTable
    },
    mixins: [MinxinVue],
    data() {
      return {
        steps: [],
        stepsDescription: [],
        acivityNameArray: [],
        selectData: {
          dialogFormVisble: false,
          activityName: '',
          instanceId: '',
          processName: 'ngsp_sls_flow',
          businessData: {},
          userId: ''
        },
        processStatus: 2,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/selfregulation',
          label: '自律监管'
        }, {
          router: '',
          label: '自律监管表单'
        }],
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        },
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
        },],
        filelist1: [],
        filelist2: [],
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
        isassortment: [{
          value: '0',
          label: '是'
        }, {
          value: '1',
          label: '否'
        },],
        ismiddlePushCan: [{
          value: '1',
          label: '可以'
        }, {
          value: '0',
          label: '不可'
        },],
        formLabelWidth: '120px',
        dialogFormVisble: false,
        title: '',
        number: '',
        // bondcode: '600727  鲁北化工',
        Ecount: '',
        logtext: '这是日志记录测试',
        sendtext: '这是发函描述记录测试',
        matter: '一级分类',
        behavior: '二级分类',
        radio: '1',
        measureradio1: '',
        measureradio2: '',
        suspendtable: false,
        limittable: false,
        deailradio: '',
        measureradioa: '',
        measureradiob: '',
        measureradioc: '',
        measureradiod: '',
        flagradio: '',
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        processinfo6: '',
        // flagradio3:'',
        deailflag1: false,
        deailflag3: false,
        time: '一个月',
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        checked6: false,
        measurechecked1: false,
        measurechecked2: false,
        measurechecked3: false,
        warningdata: [],
        accounthistorydata: [],
        slsRestricttrades: [],
        pausetable: [],
        deailcasedata: [],
        auditoption: '',
        buttondispaly: [],
        proceStatus: '',
        infoId: '',
        isveryfy: false,
        differentiationflag: false,
        differentiationadio: '',
        urlstrs: [],
        taskId: '',
        instanceId: '',
        isabledwrite: false,
        displaywarninfo: false,
        alarmId: '',
        nulltitle: false,
        nullnumber: false,
        nullbondcode: false,
        nulldeailradio: false,
        nullmeasureradio: false,
        nulltextarea: false,
        nulldifferentiationadio: false,
        uploadurl: '',
        uploadurlsecond: '',
        handelstatus: '',
        stockradio: '',
        showUploadButton: true,
        fileNameList1: [],
        fileNameList2: []
      }
    },
    mounted() {
      const {isoperateCheck, taskId, instanceId, processStatus} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        this.taskId = taskId
        this.instanceId = instanceId
        this.handelstatus = isoperateCheck
        if (isoperateCheck == '1') {
          this.isabledwrite = true
        } else {
          this.getbutton()
        }
        this.getAllData()
        this.gethistoryform()
      })
    },
    methods: {
      getStockCode(stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.stockradio = ''
        this.title = (this.commonData.stockCode[0] ? this.commonData.stockCode[0] : '无') + '-' + this.matter
        if (this.commonData.stockCode.length == 0) {
          this.nullbondcode = true
        }
      },
      reqActivityNameByProcessName(callback) {
        getActivityNameByProcessName(this.selectData.processName).then(res => {
          this.steps = res['localStatusName']
          this.acivityNameArray = res['activityName']
          this.selectData.activityName = res['activityName'][+this.processStatus + 1]
          this.selectData.businessData = res['businessData']
          callback && callback()
        })
      },
      downLoadLimitTable() {
        let params = {
          'infoId': this.infoId
        }
        this.tableOptions = []
        this.tableOptions.push({label: '证券账户', field: 'accountName', width: '120', align: 'left', isShow: true},
          {label: '开户人', field: 'accountUser', width: '120', align: 'left', isShow: true},
          {label: '证券账户所在营业地', field: 'salepart', width: '120', align: 'left', isShow: true},
          {label: '处分决定时间', field: 'punishTime', width: '120', align: 'left', isShow: true},

          {label: '处分是由', field: 'punishReason', width: '120', align: 'left', isShow: true},
          {label: '限制交易时间', field: 'restrictTime', width: '120', align: 'left', isShow: true},
          {label: '违规事实', field: 'violation', width: '120', align: 'left', isShow: true},
          {label: '处分内容', field: 'punishScheme', width: '120', align: 'left', isShow: true},
          {label: '证券代码', field: 'accountCode', width: '120', align: 'left', isShow: true},
          {label: '处理人', field: 'processPerson', width: '120', align: 'left', isShow: true},

          {label: '券商', field: 'stockTrader', width: '120', align: 'left', isShow: true},
          {label: '相关证件号码', field: 'idcard', width: '120', align: 'left', isShow: true},
          {label: '相关文号', field: 'documentNo', width: '120', align: 'left', isShow: true},
          {label: '处罚决定书名称', field: 'punishDocument', width: '120', align: 'left', isShow: true},)
        params['tableColumns'] = this.tableOptions
        if (this.handelstatus == '1') {
          ispermitload(this.instanceId).then((resp) => {
            if (resp == 'true') {
              this.gfnExportFileWithForm('/bpm/limittrade/export', params)
            } else {
              this.$message.error('没有下载权限！')
            }
          })
        } else {
          this.gfnExportFileWithForm('/bpm/limittrade/export', params)
        }
      },
      downLoadSuspendTable() {
        let params = {
          'infoId': this.infoId,
        }
        this.tableOptions = []
        this.tableOptions.push({label: '暂停日期', field: 'pauseDate', width: '120', align: 'left', isShow: true},
          {label: '方向', field: 'direction', width: '120', align: 'left', isShow: true},
          {label: '品种', field: 'stocktype', width: '120', align: 'left', isShow: true},
          {label: '一码通账户', field: 'oneword', width: '120', align: 'left', isShow: true},

          {label: '账户名称', field: 'accountName', width: '120', align: 'left', isShow: true},
          {label: '会员名称', field: 'member', width: '120', align: 'left', isShow: true},
          {label: '营业部名称', field: 'salepart', width: '120', align: 'left', isShow: true},
          {label: '所涉证券', field: 'involveStock', width: '120', align: 'left', isShow: true},
          {label: '异常行为类型(一级分类)', field: 'abnormalBehav1', width: '120', align: 'left', isShow: true},
          {label: '异常行为类型(二级分类)', field: 'abnormalBehav2', width: '120', align: 'left', isShow: true},

          {label: '行为描述', field: 'behavDesc', width: '120', align: 'left', isShow: true},
          {label: '是否严重', field: 'isSerious', width: '120', align: 'left', isShow: true},
          {label: '恢复日期', field: 'recoverDate', width: '120', align: 'left', isShow: true},
          {label: '暂停原因', field: 'pauseReason', width: '120', align: 'left', isShow: true},)
        params['tableColumns'] = this.tableOptions
        if (this.handelstatus == '1') {
          ispermitload(this.instanceId).then((resp) => {
            if (resp == 'true') {
              this.gfnExportFileWithForm('/bpm/pausetrade/export', params)
            } else {
              this.$message.error('没有下载权限！')
            }
          })
        } else {
          this.gfnExportFileWithForm('/bpm/pausetrade/export', params)
        }
      },
      displaySelectPerson(item) {
        if (this.deailradio == '' || this.deailradio == null) {
          this.nulldeailradio = true
          return
        } else {
          if (this.deailradio == '0') {
            if (this.measureradioa == '' && this.measureradiob == '' && this.measureradioc == '' && this.measureradiod == '') {
              this.nullmeasureradio = true
              return
            }
          }
          if (this.deailradio == '1') {
            if (this.measureradioa == '' && this.measureradiob == '' && this.measureradioc == '' && this.measureradiod == '') {
              this.nullmeasureradio = true
              return
            }
            if (this.differentiationadio == '' || this.differentiationadio == null) {
              this.nulldifferentiationadio = true
              return
            }
          }
          if (this.deailradio == '2') {
            if ((this.measureradio1 == '') && (this.measureradio2 == '')) {
              this.nullmeasureradio = true
              return
            }
          }
        }
        if (this.logtext == '' || this.logtext == null) {
          this.nulltextarea = true
          return
        }
        for (let item of this.warningdata) {
          if (item.accountCode == '' || item.accountCode == null) {
            this.$message.error('提交失败，请删除表格中空数据!')
            return
          }
        }
        this.flag = ''
        if (item == '分配') {
          this.flag = 'approve'
        } else {
          this.flag = 'unapprove'
          this.submitfrom()
          return
        }
        this.selectData.dialogFormVisble = true
        /*this.selectData.activityName = '发函人发函'
         this.selectData.instanceId = ''
         this.selectData.processName = 'ngsp_sls_flow'
         this.selectData.businessData = {}*/
      },
      openwarnpage() {
        window.open(`#/tdateAlarmDetail/${this.alarmId}`)
      },
      historyrecord(row) {
        window.open(`#/finishform?flag=${true}&warningNo=${row.wh}&instanceId=${row.infoId}`)
      },
      verfymeasureradio2() {
        this.nullmeasureradio = false
      },
      differentradio() {
        this.nulldifferentiationadio = false
      },
      verficationNull(value, flag) {
        if (value == '' || value == null) {
          switch (flag) {
            case 1:
              this.nulltitle = true
              break
            case 3:
              this.nullbondcode = true
              break
            case 4:
              this.nulltextarea = true
              break
          }
        } else {
          switch (flag) {
            case 1:
              this.nulltitle = false
              break
            case 3:
              this.nullbondcode = false
              break
            case 4:
              this.nulltextarea = false
              break
          }
        }
      },
      dispalylimittable() {
        this.slsRestricttrades = []
        this.nullmeasureradio = false
        if (this.measureradio1 == true) {
          this.suspendtable = false
          this.limittable = true
          this.timeflag = true
          let accountCodes = []
          let flag = 0
          for (let item of this.warningdata) {
            accountCodes[flag++] = item.accountCode
          }
          this.allaccountCodes = accountCodes.join(',')
          getsuspendtable(this.allaccountCodes, this.bondcode.split(' ')[0]).then((resp) => {

            this.slsRestricttrades = resp.bizData.metaData
            let mydate = new Date()
            let month = ''
            let startdate = ''
            let enddate = ''
            if ((mydate.getMonth() + 1) < 10) {
              month = '0' + (mydate.getMonth() + 1)
            } else {
              month = (mydate.getMonth() + 1)
            }
            if ((mydate.getDate()) < 10) {
              startdate = '0' + (mydate.getDate())
              enddate = '0' + (mydate.getDate() + 1)
            } else {
              startdate = (mydate.getDate())
              enddate = (mydate.getDate())
            }
            let punishTime = mydate.getFullYear() + '-' + month + '-' + startdate
            for (let item of this.slsRestricttrades) {
              item.punishTime = punishTime
              item.accountName = item.accountCode
              item.accountUser = item.accountPeople
              item.restrictTime = this.time
              item.accountCode = this.bondcode.split(' ')[0]
              item.processPerson = this.gfnGetRealName()
            }
          })

        } else {
          this.suspendtable = false
          this.limittable = false
          this.timeflag = false
        }
      },
      Undisplaysuspendtable() {
        this.suspendtable = false
        this.limittable = false
        this.nullmeasureradio = false
      },
      displaysuspendtable() {
        let opearte = this.urlstrs[0].split('=')[1]
        this.slsPausetrades = []
        this.suspendtable = true
        this.limittable = false
        this.nullmeasureradio = false
        let accountCodes = []
        let flag = 0
        for (let item of this.warningdata) {
          accountCodes[flag++] = item.accountCode
        }
        this.allaccountCodes = accountCodes.join(',')
        getsuspendtable(this.allaccountCodes, this.commonData.stockCode.split(' ')[0]).then((resp) => {
          this.slsPausetrades = resp.bizData.metaData
          let mydate = new Date()
          let month = ''
          let startdate = ''
          let enddate = ''
          if ((mydate.getMonth() + 1) < 10) {
            month = '0' + (mydate.getMonth() + 1)
          } else {
            month = (mydate.getMonth() + 1)
          }
          if ((mydate.getDate()) < 10) {
            startdate = '0' + (mydate.getDate())
            enddate = '0' + (mydate.getDate() + 1)
          } else {
            startdate = (mydate.getDate())
            enddate = (mydate.getDate())
          }
          let pausetime = mydate.getFullYear() + '-' + month + '-' + startdate
          for (let item of this.slsPausetrades) {
            item.stocktype = item.variety
            item.pauseDate = pausetime
            item.accountName = item.accountPeople
            item.involveStock = this.commonData.stockCode.split(' ')[0]
            item.abnormalBehav1 = this.matter
            item.abnormalBehav2 = this.behavior
            item.recoverDate = mydate.getFullYear() + '-' + month + '-' + enddate
          }
        })
      },
      geturlparam() {
        let url = window.location.href
        let request = new Object()
        if (url.indexOf('?') != -1) {
          let str = url.substr(1)
          this.urlstrs = str.split('&')
          for (let i = 0; i < this.urlstrs.length; i++) {
            request[this.urlstrs[i].split('=')[0]] = unescape(this.urlstrs[i].split('=')[1])
          }
        }
      },
      displaydeail() {
        switch (this.deailradio) {
          case '0':
            this.nulldeailradio = false
            this.deailflag1 = true
            this.deailflag2 = false
            this.deailflag3 = false
            this.measureradio1 = false
            this.measureradio2 = false
            this.flagradio = false
            this.limittable = false
            this.measureradioa = ''
            this.measureradiob = ''
            this.measureradioc = ''
            this.measureradiod = ''
            this.measurechecked1 = false
            this.measurechecked2 = false
            this.measurechecked3 = false
            this.suspendtable = false
            this.differentiationflag = false
            this.timeflag = false
            break
          case '1':
            this.nulldeailradio = false
            this.deailflag1 = true
            this.deailflag2 = false
            this.deailflag3 = false
            this.measureradio1 = false
            this.measureradio2 = false
            this.flagradio = false
            this.limittable = false
            this.measureradioa = ''
            this.measureradiob = ''
            this.measureradioc = ''
            this.measureradiod = ''
            this.measurechecked1 = false
            this.measurechecked2 = false
            this.measurechecked3 = false
            this.suspendtable = false
            this.differentiationflag = true
            this.timeflag = false
            break
          case '2':
            this.nulldeailradio = false
            this.deailflag1 = false
            this.deailflag2 = false
            this.deailflag3 = true
            this.measureradioa = ''
            this.measureradiob = ''
            this.measureradioc = ''
            this.measureradiod = ''
            this.measurechecked1 = false
            this.measurechecked2 = false
            this.measurechecked3 = false
            this.suspendtable = false
            this.limittable = false
            this.differentiationflag = false
            this.timeflag = false
            this.differentiationadio = ''
            break
        }
      },
      submitfrom(person) {
        let toWhom = ''
        let url = ''
        if (this.flag == 'approve') {
          if (person.length == 0) {
            return
          }
          toWhom = person
          url = '/assigntomember/' + toWhom + '/' + this.taskId + '/' + 'approve'
        }
        if (this.flag == 'unapprove') {
          url = '/assigntomember/' + 'default' + '/' + this.taskId + '/' + 'unapprove'
        }

        let isanalyseResult = []
        let isassistScheme = []
        let analyseResult = ''
        let assistScheme = ''
        let ismesureradio = ''
        if (this.checked1) {
          isanalyseResult.push('0')
        }
        if (this.checked2) {
          isanalyseResult.push('1')
        }
        if (this.checked3) {
          isanalyseResult.push('2')
        }
        if (this.checked4) {
          isanalyseResult.push('3')
        }
        if (this.checked5) {
          isanalyseResult.push('4')
        }
        if (this.checked6) {
          isanalyseResult.push('5')
        }
        analyseResult = isanalyseResult.join(',')
        if (this.measurechecked1) {
          isassistScheme.push('0')
        }
        if (this.measurechecked2) {
          isassistScheme.push('1')
        }
        if (this.measurechecked3) {
          isassistScheme.push('2')
        }
        let issuperviseScheme = []
        if (this.measureradioa == true) {
          issuperviseScheme.push('0')
        }
        if (this.measureradiob == true) {
          issuperviseScheme.push('1')
        }
        if (this.measureradioc == true) {
          issuperviseScheme.push('2')
        }
        if (this.measureradiod == true) {
          issuperviseScheme.push('3')
        }
        if (this.measureradio1 == true) {
          issuperviseScheme.push('4')
        }
        if (this.measureradio2 == true) {
          issuperviseScheme.push('5')
        }
        let superviseScheme = issuperviseScheme.join(',')
        assistScheme = isassistScheme.join(',')
        let isbondcode = this.commonData.stockCode.join(',')
        // let securityid = isbondcode[0];
        // let stockname = isbondcode[1];
        if (this.flagradio == true) {
          this.flagradio = '1'
        } else {
          this.flagradio = '0'
        }
        let params = {
          'slsMain': {
            'infoId': this.infoId,
            'title': this.title,
            'warningNo': this.number,
            'securityid': isbondcode,
            'stockname': isbondcode,
            'investigation': this.matter,
            'abnormalBehav': this.behavior,
            'logs': this.logtext,
            'letterDesc': this.sendtext,
            'proceStatus': this.proceStatus,
            'attachId': '1',
            'analyseResult': analyseResult,
            'superviseStandard': this.deailradio,
            'superviseScheme': superviseScheme,
            'assistScheme': assistScheme,
            'investorMark': this.flagradio,
            'transactionLimit': this.time,
            'comment': this.auditoption,
            'extend1': this.differentiationadio,
          },
          'slsAccountinfos': this.warningdata,
          'ngspRegulatoryHistorys': this.accounthistorydata,
          'slsPausetrades': this.pausetable,
          'slsRestrictTrades': this.slsRestricttrades
        }
        let isparams = JSON.stringify(params)
        postissubmit(url, isparams).then((resp) => {
          this.goBack()
        })
      },
      getbutton() {
        getbuttonname(this.taskId).then((resp) => {
          for (let item of resp.data.approveTypes) {
            if (item.name == '提交') {
              item.name = '分配'
            } else {
              item.name = '驳回'
            }
            this.buttondispaly.push(item.name)
          }
        })
      },
      gethistoryform() {
        gethistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          for (let item of resp.value) {
            stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
            item.proceStatus = this.steps[item.proceStatus]
          }
          this.stepsDescription = stepsDescription
          this.deailcasedata = resp.value
        })
      },
      getAllData() {
        getcheckform(this.instanceId).then((resp) => {
          // url无状态时，需要获取接口返回
          this.processStatus = resp.slsMain.proceStatus
          if (resp.slsMain.createType == '1') {
            this.displaywarninfo = false
          } else {
            this.displaywarninfo = true
          }
          this.alarmId = resp.slsMain.extend2
          this.title = resp.slsMain.title
          this.number = resp.slsMain.warningNo
          this.number = resp.slsMain.warningNo
          if (!resp.slsMain.securityid) {
            this.stockradio = '1'
          } else {
            this.commonData.stockCode = resp.slsMain.securityid.split(',')
          }
          this.commonData.disabled = true
          this.behavior = resp.slsMain.abnormalBehav
          this.matter = resp.slsMain.investigation
          this.infoId = resp.infoId
          this.logtext = resp.slsMain.logs
          this.sendtext = resp.slsMain.letterDesc
          this.warningdata = resp.slsAccountinfos
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
          this.accounthistorydata = resp.ngspRegulatoryHistorys
          this.proceStatus = resp.slsMain.proceStatus
          this.uploadurl = '/ngsp/bpm/v1/attachment/upload?fileLoc=sls_first_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.uploadurlsecond = '/ngsp/bpm/v1/attachment/upload?fileLoc=sls_second_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.auditoption = resp.slsMain.comment
          this.differentiationadio = resp.slsMain.extend1
          let checked = resp.slsMain.analyseResult.split(',')
          for (let i = 0; i < checked.length; i++) {
            switch (checked[i]) {
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
            }
          }
          this.deailradio = resp.slsMain.superviseStandard
          if (this.deailradio == '0' || this.deailradio == '1') {
            this.deailflag1 = true
          } else {
            this.deailflag3 = true
          }
          if (this.deailradio == '0' || this.deailradio == '2') {
            this.differentiationflag = false
          } else {
            this.differentiationflag = true
          }
          if (this.measureradioc == '2' || this.measureradiod == '3') {
            this.suspendtable = true
            this.pausetable = resp.slsPausetrades
          } else {
            this.suspendtable = false
          }
          let ismeasureradio = resp.slsMain.superviseScheme.split(',')
          for (let i = 0; i < ismeasureradio.length; i++) {
            switch (ismeasureradio[i]) {
              case '0':
                this.measureradioa = true
                break
              case '1':
                this.measureradiob = true
                break
              case '2':
                this.measureradioc = true
                break
              case '3':
                this.measureradiod = true
                break
              case '4':
                this.measureradio1 = true
                break
              case '5':
                this.measureradio2 = true
                break
            }
          }
          if (this.measureradio1 == true) {
            this.limittable = true
            this.slsRestricttrades = resp.slsRestricttrades
          } else {
            this.limittable = false
          }
          if (this.measureradioc == true || this.measureradiod == true) {
            this.suspendtable = true
            this.pausetable = resp.slsPausetrades
          } else {
            this.suspendtable = false
          }
          let measurechecked = resp.slsMain.assistScheme.split(',')
          for (let i = 0; i < measurechecked.length; i++) {
            switch (measurechecked[i]) {
              case '0':
                this.measurechecked1 = true
                break
              case '1':
                this.measurechecked2 = true
                break
              case '2':
                this.measurechecked3 = true
                break
            }
          }
          if (resp.slsMain.investorMark == '1') {
            this.flagradio = true
          } else {
            this.flagradio = false
          }
          this.time = resp.slsMain.transactionLimit
          this.getfilelist()
        })
      },
      getfilelist() {
        getfilelist(this.infoId).then((resp) => {
          this.fileNameList1 = []
          this.fileNameList2 = []
          this.filelist1 = []
          this.filelist2 = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation == 'sls_first_attachment') {
              this.filelist1.push({'name': item.fileName, 'fileId': item.fileId})
            }
            if (item.fileLocation == 'sls_second_attachment') {
              this.filelist2.push({'name': item.fileName, 'fileId': item.fileId})
            }
          })
          this.fileNameList1 = this.getFileNameList(this.filelist1, this.fileNameList1)
          this.fileNameList2 = this.getFileNameList(this.filelist2, this.fileNameList2)
        })
      },
      deletefilelist(file) {
        if (this.handelstatus == '1') {
          this.getfilelist()
        } else {
          deletefile(file.fileId).then((resp) => {
            this.getfilelist()
          })
        }
      },
      getfileID() {
        this.getfilelist()
      },
      handelpreview(file) {
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
      }
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

  .verfynull {
    margin-left: -13%;
    margin-top: 7px;
    color: red;
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
