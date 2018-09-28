<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <!--     <el-card>预警基本信息
          <div v-if="displaywarninfo">
            <el-button @click="openwarnpage" type="primary" style="position:absolute;right:35px;top:142px;">显示预警详情</el-button>
          </div>
        </el-card> -->
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
          <el-input v-bind:maxlength=50 @blur="verficationNull(title,1)" v-model="title" placeholder="" size="small"
                    style="width:62%" :disabled="String(handleStatus) === '1'"></el-input>
        </el-col>
        <el-col :span="2" v-if="nulltitle" class="verfynull">标题不能为空!</el-col>
        <el-col :span="3"><span style="color:red">*</span><span>编号</span></el-col>
        <el-col :span="9">
          <el-input disabled v-model="number" placeholder="" size="small" style="width:62%"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>证券代码及简称</span></el-col>
        <el-col :span="7">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode" size="small"
                            style="width:80%"></stock-code-query>
        </el-col>
        <el-col :span="2">
          <el-radio :disabled="String(handleStatus) === '1'" @change="isnullcode" v-model="stockradio" label="1"
                    style="margin-top: 8px">无证券代码
          </el-radio>
        </el-col>
        <el-col :span="3" v-if="nullbondcode" class="verfynull" style="margin-left:0%">证券代码及简称不能为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3"><span style="color:red">*</span><span>调查事项</span></el-col>
        <el-col :span="9">
          <el-select :disabled="String(handleStatus) === '1'" v-model="matter" placeholder="" size="small"
                     style="width:70%" @change="changetype1">
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
          <el-select :disabled="String(handleStatus) === '1'" v-model="behavior" placeholder="" size="small"
                     style="width:70%">
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
          <el-input :disabled="String(handleStatus) === '1'" v-bind:maxlength=2000 @blur="verficationNull(logtext,4)"
                    type="textarea" v-bind:rows=4
                    v-model="logtext" placeholder="输入内容在2000字以内" size="medium"
                    style="width:92.5%"></el-input>
        </el-col>
        <el-col :span="3" v-if="nulltextarea" class="verfynull" style="margin-left: -4%;">日志记录不能为空!</el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">发函描述</el-col>
        <el-col :span="18">
          <el-input :disabled="String(handleStatus) === '1'" v-bind:maxlength=2000 type="textarea" v-bind:rows=4
                    v-model="sendtext" placeholder="输入内容在2000字以内"
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
              :action=uploadurl
              :on-preview="handelpreview"
              :on-success="getfileID"
              :on-remove="deletefilelist"
              style="display:inline-block;"
            >
              <el-button
                :disabled="String(handleStatus) === '1'"
                type="text"
                size="small"
                style="display:inline;"
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
            <!-- <div @click="appendrow">新增记录</div> -->
            <!-- <div @click="deleterow">删除</div> -->
          </div>
        </el-popover>
        <el-table
          style="margin-top:10px;"
          ref="multipleTable"
          :data="warningdata"
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
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.accountCode" placeholder=""
                        size="small"
                        @keyup.enter.native="displayinfo(scope.$index,scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="账户名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.accountName" placeholder=""
                        size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="member"
            label="会员名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.member" placeholder=""
                        size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="salepart"
            label="营业部名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.salepart" placeholder=""
                        size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="oneword"
            label="一码通"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.oneword" placeholder=""
                        size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="assortment"
            label="产品账户"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select :disabled="String(handleStatus) === '1'" v-model="scope.row.assortment" placeholder=""
                         size="small">
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
              <el-select :disabled="String(handleStatus) === '1'" v-model="scope.row.middlePushCan" placeholder=""
                         size="small">
                <el-option
                  v-for="item in ismiddlePushCan"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="contactP1"
            label="联系人"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.contactP1" placeholder=""
                        size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="contactNo1"
            label="联系方式"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input :disabled="String(handleStatus) === '1'" v-model="scope.row.contactNo1" placeholder=""
                        size="small"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-button :disabled="String(handleStatus) === '1'" type="primary" size="small" style="float:left;"
                   @click="appendrow">＋添加
        </el-button>
        <el-button :disabled="String(handleStatus) === '1'" type="primary" size="small" style="float:left;"
                   @click="deleterow">－删除
        </el-button>
      </el-row>
      <el-row>
        <el-col>
          <text-upload @getTxtCon="getTxtData" :uploadOption="uploadOption"
                       style="display: inline;float:right;margin-top:20px"></text-upload>
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
      <el-row>
        <el-table
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
      <el-row style="margin: 20px 0 15px 30px;"><span>分析结果：</span>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span=9>
          <el-checkbox :disabled="String(handleStatus) === '1'" v-model="checked1">两年内两次执行纪律处分</el-checkbox>
        </el-col>
        <el-col :span=7>
          <el-checkbox :disabled="String(handleStatus) === '1'" v-model="checked2">处于重点账户监控期内</el-checkbox>
        </el-col>
        <el-col :span=7>
          <el-checkbox :disabled="String(handleStatus) === '1'" v-model="checked3">监控期内达到3次以上异常交易行为</el-checkbox>
        </el-col>
      </el-row>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span=9>
          <el-checkbox :disabled="String(handleStatus) === '1'" v-model="checked4">最近3个月内被本所实施过2次警示（口头/书面）</el-checkbox>
        </el-col>
        <el-col :span=7>
          <el-checkbox :disabled="String(handleStatus) === '1'" v-model="checked5">最近6个月内被本所实施过2次盘中暂停</el-checkbox>
        </el-col>
        <el-col :span=7>
          <el-checkbox :disabled="String(handleStatus) === '1'" v-model="checked6">专业机构近一个月内采取2次及以上监管措施</el-checkbox>
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
          <el-radio :disabled="String(handleStatus) === '1'" v-model="deailradio" label="0" @change="displaydeail">
            标准化监管
          </el-radio>
          <el-radio :disabled="String(handleStatus) === '1'" v-model="deailradio" label="1" @change="displaydeail"
                    style="margin-left:85px">差异化监管
          </el-radio>
          <el-radio :disabled="String(handleStatus) === '1'" v-model="deailradio" label="2" @change="displaydeail"
                    style="margin-left:85px">纪律处分
          </el-radio>
        </el-col>
        <el-col :span="3" v-if="nulldeailradio" class="verfynull">监管标准不能为空!</el-col>
      </el-row>
      <div v-if="deailflag1">
        <el-row style="margin: 20px 0 15px 30px;" v-if="differentiationflag">
          <el-col :span="3"><span style="color:red">*</span><span>差异化分类</span></el-col>
          <el-col :span="18">
            <el-radio :disabled="String(handleStatus) === '1'" v-model="differentiationadio" label="0"
                      @change="differentradio">涉嫌庄股操纵
            </el-radio>
            <el-radio :disabled="String(handleStatus) === '1'" v-model="differentiationadio" label="1"
                      @change="differentradio" style="margin-left:72px">
              频繁参与异动股炒作
            </el-radio>
            <el-radio :disabled="String(handleStatus) === '1'" v-model="differentiationadio" label="2"
                      @change="differentradio" style="margin-left:30px">维护市场稳定
            </el-radio>
            <el-radio :disabled="String(handleStatus) === '1'" v-model="differentiationadio" label="3"
                      @change="differentradio" style="margin-left:55px">
              其他情节较为严重的异常行为
            </el-radio>
          </el-col>
          <el-col :span="3" v-if="nulldifferentiationadio" class="verfynull">差异化分类不能为空!</el-col>
        </el-row>
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3"><span style="color:red">*</span><span>监管措施</span></el-col>
          <el-col :span="18">
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="measureradioa"
                         @change="Undisplaysuspendtable">口头警示
            </el-checkbox>
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="measureradiob"
                         @change="Undisplaysuspendtable" style="margin-left:102px">书面警示
            </el-checkbox>
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="measureradioc" @change="displaysuspendtable"
                         style="margin-left:100px">盘中暂停交易
            </el-checkbox>
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="measureradiod" @change="displaysuspendtable"
                         style="margin-left:55px">持续暂停交易
            </el-checkbox>
          </el-col>
          <el-col :span="3" v-if="nullmeasureradio" class="verfynull">监管措施不能为空!</el-col>
        </el-row>
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3">辅助措施</el-col>
          <el-col :span=2>
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="measurechecked1">要求限期改正</el-checkbox>
          </el-col>
          <el-col :span=2>
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="measurechecked2" style="margin-left:55px">
              监管谈话
            </el-checkbox>
          </el-col>
          <el-col :span=2>
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="measurechecked3" style="margin-left:105px">
              要求提交合规承诺书
            </el-checkbox>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3">投资者标记</el-col>
          <el-col :span="18">
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="flagradio">列为重点监控账户</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <div v-if="deailflag3">
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3"><span style="color:red">*</span><span>监管措施</span></el-col>
          <el-col :span="3">
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="measureradio1" label="4"
                         @change="dispalylimittable">限制交易
            </el-checkbox>
          </el-col>
          <el-col :span="1" v-if="timeflag">期限</el-col>
          <el-col :span="6" v-if="timeflag">
            <el-select :disabled="String(handleStatus) === '1'" allow-create filterable v-model="time" placeholder=""
                       size="small"
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
        <el-row style="margin-left:14.1%">
          <el-col :span="3">
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="measureradio2" :label="5"
                         @change="verfymeasureradio2">认定为不合格投资者
            </el-checkbox>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 0 15px 30px;">
          <el-col :span="3">投资者标记</el-col>
          <el-col :span="18">
            <el-checkbox :disabled="String(handleStatus) === '1'" v-model="flagradio">列为重点监控账户</el-checkbox>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin: 0px 0 15px 30px;">
        <el-col :span="3">上传附件</el-col>
        <el-col :span="18" style="display:inline-block">
          <div v-if="showUploadButton">
            <el-upload
              :disabled="String(handleStatus) === '1'"
              class="upload-demo"
              :file-list="filelist2"
              :action=uploadurlsecond
              :on-preview="handelpreview"
              :on-success="getfileID"
              :on-remove="deletefilelist"
              style="display:inline-block"
            >
              <el-button
                :disabled="String(handleStatus) === '1'"
                type="text"
                size="small"
                limit=5
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
      <el-row v-if="limittable">
        <el-col style="margin: 30px 0 5px 30px;">限制交易表</el-col>
        <el-col>
          <el-button
            :disabled="String(handleStatus) === '1'"
            type="primary"
            size="small"
            style="position:absolute;right:0%;bottom:0%"
            v-if="dealTableFlag"
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
            <template slot-scope="scope">
              <el-input v-model="scope.row.accountName" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="accountUser"
            label="开户人"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.accountUser" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="salepart"
            label="证券账户所在营业部"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.salepart" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="punishTime"
            label="处分决定时间"
            width="160"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.punishTime" type="date" size="small" style="width:140px"
                              @input="punishTimechange(scope.row,scope.$index)">

              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="punishReason"
            label="处分事由"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.punishReason" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            prop="restrictTime"
            label="限制交易时间"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.restrictTime" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="violation"
            label="违规事实"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.violation" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="punishScheme"
            label="处分内容"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.punishScheme" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="accountCode"
            label="证券代码"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.accountCode" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="processPerson"
            label="处理人"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.processPerson" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="stockTrader"
            label="券商"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.stockTrader" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="idcard"
            label="相关证件号码"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.idcard" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="documentNo"
            label="相关文号"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.documentNo" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="punishDocument"
            label="处罚决定书名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.punishDocument" placeholder="" size="small"></el-input>
            </template>
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
            style="position:absolute;right:0%;bottom:0%"
            @click="downLoadSuspendTable"
            v-if="dealTableFlag"
          >下载
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="suspendtable">
        <el-table
          style="margin-top:10px;"
          :data="slsPausetrades"
          :fit=true
          border>
          <el-table-column
            type="index"
            label="序号"
            width="50"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="pauseDate"
            label="暂停日期"
            width="160"
            show-overflow-tooltip>
            <template slot-scope="scope" v-model="pauseDate">
              <el-date-picker
                v-model="scope.row.pauseDate"
                type="date"
                size="small"
                style="width:140px"
                value-format="yyyy-MM-dd"
                @input="pauseDatechange(scope.row,scope.$index)"
              >
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="direction"
            label="方向"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select v-model="scope.row.direction" placeholder="" size="small">
                <el-option
                  v-for="item in isdirection"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column
            prop="stocktype"
            label="品种"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.stocktype" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="oneword"
            label="一码通账户"
            width="180"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.oneword" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="accountName"
            label="账户名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.accountName" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="member"
            label="会员名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.member" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="salepart"
            label="营业部名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.salepart" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="involveStock"
            label="所涉证券"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.involveStock" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="abnormalBehav1"
            label="异常行为类型（一级分类）"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.abnormalBehav1" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="abnormalBehav2"
            label="异常行为类型（二级分类）"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.abnormalBehav2" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="behavDesc"
            label="行为描述"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.behavDesc" placeholder="" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="isSerious"
            label="是否严重"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select v-model="scope.row.isSerious" placeholder="" size="small">
                <el-option
                  v-for="item in Serious"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="recoverDate"
            label="恢复日期"
            width="160"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.recoverDate"
                type="date"
                size="small"
                style="width:140px"
                @input="recoverDatechange(scope.row,scope.$index)"
              >
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="pauseReason"
            label="暂停原因"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select :disabled="String(handleStatus) === '1'" allow-create filterable
                         v-model="scope.row.pauseReason" placeholder="" size="small">
                <el-option
                  v-for="item in ispauseReason"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
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
          <el-input :disabled="String(handleStatus) === '1'" type="textarea" v-model="auditoption"
                    placeholder="字符限制200以内" v-bind:maxlength=200 size="medium"
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

    <div>
  		<span>
  			<el-button type="primary" @click="goBack"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回</el-button>
  		</span>
      <span v-if="newcreat">
  			<el-button type="primary" @click="saveall"
                   style="float:right;background-color:white;color:black;width:10%;margin:20px 20px 0 0">保存</el-button>
  		</span>
      <span v-if="newcreat">
  			<el-button @click="displaySelectPerson" type="primary"
                   style="float:right;margin:20px 20px 0 0;width:10%">提交</el-button>
  		</span>
    </div>
    <el-dialog
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
    </el-dialog>
    <selectPersonComponent :selectData="selectData" @obdSelectPerson="submitfrom" ref="selectPersonComponent"
                           v-if="selectData.dialogFormVisble"></selectPersonComponent>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import TextUpload from '../../common/textUpload'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import selectPersonComponent from '../superviseTaskComponent/selectPersonComponent'
  import {
    post
  } from '../../../utils/api.js'
  import {
    postlaughform,
    getnumber,
    getaccountinfo,
    gethistoryinfo,
    save,
    getsuspendtable,
    gethistoryopiniondata,
    getdisplaywarninfo,
    getsubmitname,
    getfilelist,
    getanalyresult,
    ispermitload,
    deletefile,
    getcheckform,
    getActivityNameByProcessName,
    getObtainedInfo
  } from '../../../service/superviseTask/index.js'
  import { tabletimeformat } from '../../../utils/dateTimeFormat.js'
  import MinxinVue from '../MixIn'
  import MixinAuthority from '../MixinAuthority'
  import HistoryMsgComTable from './historyMsgCommonTable'

  export default {
    components: {
      Breadcrumb,
      TextUpload,
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
          activityName: '', // 审核并分配
          instanceId: '',
          processName: 'ngsp_sls_flow', // 当前流程名称
          businessData: {}
        }, // 调取分配人dialog接口的入参
        processStatus: 0,
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
        ispauseReason: [{
          value: '递进式',
          label: '递进式'
        }, {
          value: '差异化',
          label: '差异化'
        }, {
          value: '维稳',
          label: '维稳'
        }, {
          value: '其他',
          label: '其他'
        }],
        Serious: [{
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }],
        isdirection: [{
          value: '买',
          label: '买'
        }, {
          value: '卖',
          label: '卖'
        }, {
          value: '卖/买',
          label: '卖/买'
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
        uploadOption: {
          name: '指定导入',
          size: 'small',
          disabledflag: false
        },
        commonData: {
          flag: true,
          multiple: true,
          disabled: false,
          stockCode: []
        },
        warningdata: [],
        istowhom: [],
        towhom: '',
        dialogFormVisble: false,
        formLabelWidth: '120px',
        title: '无-集合竞价虚假申报',
        number: '',
        Ecount: '',
        logtext: '',
        sendtext: '',
        matter: '集合竞价虚假申报',
        behavior: '拉升虚拟开盘价',
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
        dealTableFlag: true,
        processinfo0: '',
        processinfo1: '',
        processinfo2: '',
        processinfo3: '',
        processinfo4: '',
        processinfo5: '',
        processinfo6: '',
        newcreat: true,
        buttondispaly: [],
        flagradio3: '',
        deailflag1: false,
        deailflag3: false,
        time: '一个月',
        warningtableflag: false,
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        checked6: false,
        differentiationflag: false,
        differentiationadio: '',
        measurechecked1: false,
        measurechecked2: false,
        measurechecked3: false,
        slsPausetrades: [],
        accounthistorydata: [],
        slsRestricttrades: [],
        auditoption: '',
        infoId: '',
        tabledeleterow: [],
        timeflag: false,
        urlstrs: [],
        taskId: '',
        instanceId: '',
        nulltitle: false,
        nullnumber: false,
        nullbondcode: false,
        nulldeailradio: false,
        nullmeasureradio: false,
        nulltextarea: false,
        nulldifferentiationadio: false,
        allaccountCodes: '',
        deailcasedata: [],
        deailcasedataflag: false,
        createType: '1', // 手工创建
        displaywarninfo: false,
        activityName: '',
        selectval: [],
        uploadurl: '',
        fileId: '',
        uploadurlsecond: '',
        alarmId: '',
        fileName: '',
        handleStatus: '', // 标记是处理中还是查看
        stockradio: '',
        showUploadButton: true,
        fileNameList1: [],
        fileNameList2: [],
        oneword: []
      }
    },
    mounted () {
      const {isoperateCheck, taskId, instanceId, processStatus, activityName, params, alarmId} = this.$route.query
      if (processStatus) {
        this.processStatus = processStatus
      }
      this.reqActivityNameByProcessName(() => {
        // this.geturlparam()
        this.uploadurl = '/ngsp/bpm/v1/attachment/upload?fileLoc=sls_first_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
        this.uploadurlsecond = '/ngsp/bpm/v1/attachment/upload?fileLoc=sls_second_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
        if (params) {
          let paramsInfo = JSON.parse(params)
          // 实时监控分析转入
          if (paramsInfo.createType == '2') {
            this.displaywarninfo = true
            this.commonData.stockCode.push(paramsInfo.stockCode + ' ' + paramsInfo.stockCodeName)
            // 带入选中的账户
            this.createType = '0'
            this.getTxtData([paramsInfo.accountCode.split(',')])
            this.getnum()
          } else {
            // this.displaywarninfo = true
            // this.matter = this.$route.params.param.investigateMattersName
            // this.behavior = this.$route.params.param.abnormalBehaviorName
            // this.createType = this.$route.params.param.createType
            // this.sendtext = this.$route.params.param.alarm_remark
            // this.alarmId = this.urlstrs[0].split('=')[1]
            // this.warnturninto()
          }
        } else if (alarmId) { // 预警列表转入
          this.createType = '0'
          this.displaywarninfo = true
          /* this.matter = this.$route.params.param.investigateMattersName
           this.behavior = this.$route.params.param.abnormalBehaviorName
           this.createType = this.$route.params.param.createType
           this.sendtext = this.$route.params.param.alarm_remark */
          this.alarmId = alarmId
          this.warnturninto()
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
          this.activityName = activityName
        }
        if (isoperateCheck == '1') {
          this.commonData.disabled = true
          this.uploadOption.disabledflag = true
          this.newcreat = false
          this.dealTableFlag = true
          this.getAllData()
          this.gethistoryform()
        } else if (isoperateCheck == '2') {
          this.newcreat = true
          this.dealTableFlag = true
          this.getAllData()
          this.gethistoryform()
        } else {
          this.newcreat = true
          this.getnum()
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
      downLoadLimitTable () {
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
        if (this.handleStatus == '1') {
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
      downLoadSuspendTable () {
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
        if (this.handleStatus == '1') {
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
      isnullcode () {
        this.commonData.stockCode = []
        this.title = '无-' + this.matter
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
        this.selectData.dialogFormVisble = true
        // this.selectData.activityName = '确认处罚单'
        // this.selectData.instanceId = ''
        // this.selectData.processName = 'ngsp_sls_flow'
        // this.selectData.businessData = {}
      },
      getinfoid (filelist) {
        this.fileName = filelist.name
        this.$watch(function () {
          this.uploadurl = '/ngsp/bpm/v1/attachment/upload?fileLoc=sls_first_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.uploadurlsecond = '/ngsp/bpm/v1/attachment/upload?fileLoc=sls_second_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
        })
        // this.$watch(this.uploadurl)
        console.log(this.uploadurl)
        if (this.infoId == '') {
          this.$message.error('请先保存，再上传文件')
        }
        // this.saveall()
      },
      dialogopen () {
        this.dialogFormVisble = true
        this.istowhom = []
        let params = {
          'activityName': '',
          'businessData': {},
          'instanceId': '',
          'processName': 'ngsp_sls_flow',
        }
        let isparams = JSON.stringify(params)
        getsubmitname(isparams).then((resp) => {
          for (let i = 0; i < resp.allUserList.length; i++) {
            this.istowhom.push({
              value: resp.allUserList[i].fullName,
              label: resp.allUserList[i].fullName
            })
          }
          this.towhom = resp.allUserList[0].fullName
        })
        this.submitfrom()
      },
      veryfy () {
        this.dialogFormVisble = false
        this.submitfrom()
      },
      cancleVeryfy () {
        this.dialogFormVisble = false
      },
      openwarnpage () {
        window.open(`#/tdateAlarmDetail/${this.alarmId}`)
      },
      pauseDatechange (row, index) {
        this.$set(this.slsPausetrades[index], this.slsPausetrades[index].pauseDate)
      },
      recoverDatechange (row, index) {
        this.$set(this.slsPausetrades[index], this.slsPausetrades[index].recoverDate)
      },
      punishTimechange (row, index) {
        this.$set(this.slsRestricttrades[index], this.slsRestricttrades[index].punishTime)
      },
      warnturninto () {
        getdisplaywarninfo(this.alarmId).then((resp) => {
          let code = []
          let i = 0
          if (resp.wBasicList) {
            for (let item of resp.wBasicList.bizData.metaData) {
              this.title = item.title
              this.logtext = item.log_record

              this.commonData.stockCode.push(item.securities_code + ' ' + item.securities_name)
            }
          }
          if (resp.wAcctList) {
            for (let item of resp.wAcctList.bizData.metaData) {
              code[i] = item.invacctno
              i++
            }
          }
          this.getTxtData(code)
        })
      },
      gethistoryform () {
        gethistoryopiniondata(this.instanceId).then((resp) => {
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
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        this.title = (this.commonData.stockCode[0] ? this.commonData.stockCode[0] : '无') + '-' + this.matter
        this.stockradio = ''
        if (this.commonData.stockCode.length == 0) {
          this.nullbondcode = true
        }
      },
      verfymeasureradio2 () {
        this.nullmeasureradio = false
      },
      differentradio () {
        this.nulldifferentiationadio = false
      },
      verficationNull (value, flag) {
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
      analyResult () {
        getanalyresult(this.infoId, this.warningdata[0].oneword).then((resp) => {
          let result = resp[0]
          for (let i = 0; i < result.length; i++) {
            switch (result[i]) {
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
        })
      },
      getTxtData (TxtData) {
        TxtData = TxtData || []
        let result = []
        if (this.warningdata.length) {
          this.warningdata.forEach(item => {
            TxtData.push(item.accountCode)
          })
          result = [...new Set(TxtData)].join(',')
        } else {
          result = TxtData.join(',')
        }
        if (!result) {
          this.accounthistorydata = []
          this.slsRestricttrades = []
          this.slsPausetrades = []
          return
        }
        getaccountinfo(result).then((resp) => {
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
            gethistoryinfo(this.allaccountCodes).then((resp) => {
              this.accounthistorydata = resp.regularotyHistorys
              this.analyResult()
              // 获取盘中或持续table信息
              this.getPouseInfo()
              this.getRetrieveInfoTableData()
            })
          }
        }, (error) => {
          this.$message.error('文件内容或格式错误!')
        })
      },
      getPouseInfo () {
        if (this.deailradio == '0' || this.deailradio == '1' || this.deailradio == '2') {
          if (this.measureradio1) {
            this.dispalylimittable()
          } else {
            this.displaysuspendtable()
          }
        }
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
            this.$message.error('保存失败，请删除表格中空数据!')
            return
          }
        }
        if (this.taskId == null || this.taskId == '') {
          this.taskId = 0
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
            'attachId': '1',
            'analyseResult': analyseResult,
            'superviseStandard': this.deailradio,
            'superviseScheme': superviseScheme,
            'assistScheme': assistScheme,
            'proceStatus': this.proceStatus,
            'investorMark': this.flagradio,
            'transactionLimit': this.time,
            'comment': this.auditoption,
            'extend1': this.differentiationadio,
            'createType': this.createType,
            'extend2': this.alarmId
          },
          'slsAccountinfos': this.warningdata,
          'ngspRegulatoryHistorys': this.accounthistorydata,
          'slsPausetrades': this.slsPausetrades,
          'slsRestrictTrades': this.slsRestricttrades
        }
        let isparams = JSON.stringify(params)
        save(this.taskId, isparams).then((resp) => {
          this.$message.success('保存成功')
          if (!this.infoId) { // 首次进来保存
            this.goBack()
          }
        })
      },
      getRetrieveInfoTableData () {
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
      displayinfo (index, row) {
        let reg = /^[A-Z]\d{9}$/
        if (reg.test(row.accountCode)) {
          let data = this.warningdata
          for (let i = 0; i < data.length - 1; i++) {
            if (data[i].accountCode === row.accountCode) {
              console.log(this.warningdata.accountCode)
              row.accountCode = ''
              this.$message.error('输入证券账户重复！')
            }
          }
          getaccountinfo(row.accountCode).then((resp) => {
            let isaccountinfo = resp.bizData.metaData
            if (isaccountinfo.length == 0) {
              this.warningdata.splice(index, 1, isaccountinfo)
              let accountCodes = []
              let flag = 0
              for (let item of this.warningdata) {
                accountCodes[flag++] = item.accountCode
              }
              this.allaccountCodes = accountCodes.join(',')
              gethistoryinfo(this.allaccountCodes).then((resp) => {
                this.accounthistorydata = resp.regularotyHistorys
                this.getPouseInfo()
                this.getRetrieveInfoTableData()
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
              gethistoryinfo(this.allaccountCodes).then((resp) => {
                this.accounthistorydata = resp.regularotyHistorys
                this.analyResult()
                this.getPouseInfo()
                this.getRetrieveInfoTableData()
              })
            }
          }, (error) => {
            this.$message.error('导入失败，请重新导入!')
          })
        } else {
          this.$message.error('账户代码格式不对，请重新输入！')
        }
      },
      getAllData () {
        getcheckform(this.instanceId).then((resp) => {
          // url无状态时，需要获取接口返回
          this.processStatus = resp.slsMain.proceStatus
          this.infoId = resp.infoId
          this.uploadurl = '/ngsp/bpm/v1/attachment/upload?fileLoc=sls_first_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.uploadurlsecond = '/ngsp/bpm/v1/attachment/upload?fileLoc=sls_second_attachment&infoId=' + this.infoId + '&fileName=' + this.fileName
          this.title = resp.slsMain.title
          this.alarmId = resp.slsMain.extend2
          this.number = resp.slsMain.warningNo
          if (!resp.slsMain.securityid) {
            this.stockradio = '1'
          } else {
            this.commonData.stockCode = resp.slsMain.securityid.split(',')
          }
          this.behavior = resp.slsMain.abnormalBehav
          this.matter = resp.slsMain.investigation
          this.logtext = resp.slsMain.logs
          this.sendtext = resp.slsMain.letterDesc
          this.auditoption = resp.slsMain.comment
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
          if (this.deailradio == '1') {
            this.differentiationflag = true
          } else {
            this.differentiationflag = false
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
                this.timeflag = true
                break
              case '5':
                this.measureradio2 = true
                break
            }
          }
          if (this.measureradio1 == true) {
            this.limittable = true
            this.slsPausetrades = resp.slsPausetrades
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
          this.slsPausetrades = resp.slsPausetrades
          this.slsRestricttrades = resp.slsRestricttrades
          this.getfilelist()
        })
      },
      getnum () {
        getnumber(this.createType).then((resp) => {
          this.number = resp
        })
      },
      submitfrom (selectPerson) {
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
        assistScheme = isassistScheme.join(',')
        let superviseScheme = issuperviseScheme.join(',')
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
            'attachId': '1',
            'analyseResult': analyseResult,
            'superviseStandard': this.deailradio,
            'superviseScheme': superviseScheme,
            'assistScheme': assistScheme,
            'investorMark': this.flagradio,
            'transactionLimit': this.time,
            'proceStatus': this.proceStatus,
            'comment': this.auditoption,
            'createType': this.createType,
            'extend1': this.differentiationadio,
            'extend2': this.alarmId
          },
          'slsAccountinfos': this.warningdata,
          'ngspRegulatoryHistorys': this.accounthistorydata,
          'slsPausetrades': this.slsPausetrades,
          'slsRestrictTrades': this.slsRestricttrades
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let isparams = JSON.stringify(params)
        postlaughform(this.taskId, isparams, selectPerson).then((resp) => {
          this.goBack()
        })
      },
      Undisplaysuspendtable () {
        this.suspendtable = false
        this.limittable = false
        this.nullmeasureradio = false
      },
      displaysuspendtable () {
        console.log(this.commonData.stockCode[0])
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
        let stockCode = this.commonData.stockCode[0] ? this.commonData.stockCode[0].split(' ')[0] : ''
        getsuspendtable(this.allaccountCodes, stockCode).then((resp) => {
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
            let isinvolveStock = []
            for (let i = 0; i < this.commonData.stockCode.length; i++) {
              isinvolveStock.push(this.commonData.stockCode[i].split(' ')[0])
            }
            item.involveStock = isinvolveStock.join(',')
            item.abnormalBehav1 = this.matter
            item.abnormalBehav2 = this.behavior
            item.recoverDate = mydate.getFullYear() + '-' + month + '-' + enddate
          }
        })
      },
      dispalylimittable () {
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
          getsuspendtable(this.allaccountCodes, this.commonData.stockCode[0].split(' ')[0]).then((resp) => {

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
              let isaccountCode = []
              for (let i = 0; i < this.commonData.stockCode.length; i++) {
                isaccountCode.push(this.commonData.stockCode[i].split(' ')[0])
              }
              item.accountCode = isaccountCode.join(',')
              item.processPerson = this.gfnGetRealName()
            }
          })

        } else {
          this.suspendtable = false
          this.limittable = false
          this.timeflag = false
        }
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
        let selectCodes = this.selectval.map(v => {
          return v.accountCode
        })
        this.warningdata = this.warningdata.filter(v => {
          return selectCodes.indexOf(v.accountCode) === -1
        })
        this.getTxtData()
      },
      appendrow () {
        this.warningtableflag = false
        this.warningdata.push({
          'accountCode': '',
          'accountName': '',
          'member': '',
          'salepart': '',
          'oneword': '',
          'assortment': '',
          'middlePushCan': '',
          'contactP1': '',
          'contactNo1': '',
          'contactP2': '',
          'contactNo2': ''
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
      deletefilelist (file) {
        if (this.handleStatus == '1') {
          this.getfilelist()
        } else {
          if (file.fileId) {
            deletefile(file.fileId).then((resp) => {
              this.getfilelist()
            })
          }
        }
      },
      getfileID (resp, file, fileList) {
        if (resp) {
          const {success, message} = resp
          if (success) {
            this.getfilelist()
          } else {
            this.$message.error(message)
            fileList = []
          }
        }
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
      displaydeail () {
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
