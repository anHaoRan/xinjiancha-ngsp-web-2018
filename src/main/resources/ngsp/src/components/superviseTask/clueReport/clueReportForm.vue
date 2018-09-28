<template>
  <div class="affirmMonitorSecurity">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <steps-common-component :currentProcessStatus="processStatus" :steps="steps"
                            :description="stepsDescription"></steps-common-component>
    <el-card class="el-card-table" v-if="formCard1Show">
      <div slot="header">
        线索基本信息
      </div>
      <el-form :inline="true" :model="selectParams" ref="selectParams" :rules="rules">
        <el-row :gutter="20">
          <el-col :xl="20">
            <el-form-item required label="线索编号：">
              <el-input disabled v-model="selectParams.clueNumber" placeholder="" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item required label="证券代码及简称：">
              <stock-code-query :disabled="formCard1Disabled" :commonData="commonData" @getStockCode="getStockCode" size="small"
                                style='display: inline-flex;'></stock-code-query>
              <span><el-radio :disabled=formCard1Disabled v-model="selectParams.stock0" label="1"
                              @change="noneStock1">无证券代码</el-radio></span>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="线索名称：" prop="clueName">
              <el-input :disabled=formCard1Disabled placeholder="字符限制20以内" v-bind:maxlength=20 size="small"
                        v-model="selectParams.clueName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="20">
            <el-form-item label="线索描述：" class="describe">
              <el-input :disabled=formCard1Disabled placeholder="字符限制500以内" v-bind:maxlength=500 size="small"
                        v-model="selectParams.clueDescript" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="12">
            <el-form-item required label="是否线索上报：">
              <el-radio :disabled=formCard1Disabled v-model="selectParams.isClueReport" label="1">是</el-radio>
              <el-radio :disabled=formCard1Disabled v-model="selectParams.isClueReport" label="0">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :xl="12">
            <el-form-item required label="线索分类：">
              <el-radio :disabled=formCard1Disabled v-model="selectParams.clueStyle" label="0">关注类</el-radio>
              <el-radio :disabled=formCard1Disabled v-model="selectParams.clueStyle" label="1">调查类</el-radio>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item required label="线索类型：" prop="group">
              <el-checkbox-group v-model="selectParams.group">
                <el-checkbox :disabled=formCard1Disabled label="内幕交易" name="group"></el-checkbox>
                <el-checkbox :disabled=formCard1Disabled label="市场操纵" name="group"></el-checkbox>
                <el-checkbox :disabled=formCard1Disabled label="利益输送—股票" name="group"></el-checkbox>
                <el-checkbox :disabled=formCard1Disabled label="利益输送—债券" name="group"></el-checkbox>
                <el-checkbox :disabled=formCard1Disabled label="超比例持股" name="group"></el-checkbox>
                <el-checkbox :disabled=formCard1Disabled label="老鼠仓" name="group"></el-checkbox>
                <el-checkbox :disabled=formCard1Disabled label="短线交易" name="group"></el-checkbox>
                <el-checkbox :disabled=formCard1Disabled label="其它—股票" name="group"></el-checkbox>
                <el-checkbox :disabled=formCard1Disabled label="其它—债券" name="group"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :xl="24" style="display:inline-block">

            <el-form-item label="线索会商纪要：">
              <div v-if="showUploadButton">
                <el-upload
                  class="upload-demo"
                  :action=meetingSummaryUploadurl
                  :on-preview="handelpreview"
                  :on-remove="deletefilelist"
                  :on-success="getfileID"
                  :disabled=formCard1Disabled
                  :file-list="selectParams.meetingSummaryfilelist"
                  style="display:inline-block"
                >
                  <el-button
                    type="text"
                    size="small"
                    :disabled=formCard1Disabled
                    style="display:inline"
                  >上传
                  </el-button>
                </el-upload>
              </div>
              <div v-else>
                <span
                  style="display: block;"
                  v-for="item in meetingSummaryFileNameList"
                  :key="item">
                  {{item}}
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="24" style="display:inline-block">
            <el-form-item label="附件：">
              <div v-if="showUploadButton">
                <el-upload
                  class="upload-demo"
                  :action=basicInfoUploadurl
                  :on-preview="handelpreview"
                  :on-remove="deletefilelist"
                  :on-success="getfileID"
                  :before-upload="checkFileSize"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msexcel"
                  :disabled=formCard1Disabled
                  :file-list="selectParams.basicInfofilelist"
                  style="display:inline-block"
                >
                  <el-button
                    type="text"
                    size="small"
                    :disabled=formCard1Disabled
                    style="display:inline"
                  >上传
                  </el-button>
                </el-upload>
              </div>
              <div v-else>
                <span
                  style="display: block;"
                  v-for="item in basicInfoFileNameList"
                  :key="item">
                  {{item}}
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item required label="线索来源分类：">
              <el-select :disabled=formCard1Disabled v-model="selectParams.sourceStyle" placeholder="请选择" size="small">
                <el-option
                  v-for="item in sourceStyleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="20">
            <el-form-item label="线索来源：" class="describe">
              <el-input :disabled=formCard1Disabled v-bind:maxlength=200 size="small" v-model="selectParams.clueSource"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="20" style="margin-top:20px;margin-bottom:10px">
            <span style="margin-right:20px">上报账户</span>
            <el-button :disabled=formCard1Disabled type="text" size="middle" @click="addreportAccountRow">新增</el-button>
            <!-- <el-button :disabled=form1 type="text" size="middle" @click="editRow">修改</el-button> -->
            <el-button :disabled=formCard1Disabled type="text" size="middle" @click="deleterow">删除</el-button>
            <text-upload @getTxtCon="getTxtData" :uploadOption="uploadOption" :disabled="formCard1Disabled" style="display: inline;"
                         size="middle"></text-upload>

          </el-col>
          <el-col :xl="24">
            <el-table
              border
              max-height="300"
              :data="reportAccountData"
              @selection-change="selectedRow"
              style="width: 100%; overflow:visible">
              <el-table-column
                type="selection"
                align="center"
              />
              <el-table-column
                prop="accountCode"
                label="账户代码"
                show-overflow-tooltip>
                <template slot-scope="scope" v-popover:popoverbox>
                  <el-input :disabled="formCard1Disabled" :class="scope.row.readonly?'clueReportborderNone':''"
                            v-model="scope.row.accountCode" placeholder="输入内容在10个字以内" size="small"
                            :maxlength="10"
                            @keyup.enter.native="displayinfo(scope.$index,scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column v-for="(item,index) in reportAccountColumns"
                               :key="index"
                               :label="item.label"
                               :prop="item.field"
                               :item="item"></el-table-column>
              <!--<s-table-columns v-for="(item,index) in reportAccountColumns"
                               :key="index"
                               :item="item"
                               v-if="item.isActive===undefined||item.isActive"/>-->
            </el-table>
          </el-col>
          <el-col :xl="12" style="margin-top:20px;margin-bottom:10px">
            <span style="margin-right:20px">重点监控证券</span>
            <el-button :disabled=formCard1Disabled type="text" size="middle" @click="addmonitorStockDataRow">新增</el-button>
            <el-button :disabled=formCard1Disabled type="text" size="middle" @click="deletemonitorStockrow">删除</el-button>
          </el-col>
          <el-col :xl="12" style="margin-top:20px;margin-bottom:10px">
            <span style="margin-right:20px">重点监控账户组</span>
            <el-button :disabled=formCard1Disabled type="text" size="middle" @click="addmonitorGroupsRow">新增</el-button>
            <el-button :disabled=formCard1Disabled type="text" size="middle" @click="deletemonitorGroupsrow">删除</el-button>
          </el-col>
          <el-col :xl="12">
            <el-table
              border
              max-height="300"
              :data="monitorStockData"
              @selection-change="selectedmonitorStockRow"
              style="width: 100%; overflow:visible;">
              <el-table-column
                type="selection"
                align="center"
              />
              <el-table-column
                prop="monitorSecurityNo"
                label="监控编号"
                show-overflow-tooltip>
                <template slot-scope="scope" v-popover:popoverbox>
                  <a class="link-common-css" v-if="formCard1Disabled" @click="gotoFocusMonitorSecurityPage(scope)">{{scope.row.monitorSecurityNo}}</a>
                  <el-input v-else :disabled="formCard1Disabled" :class="scope.row.readonly?'clueReportborderNone':''"
                            style="text-decoration:underline;color:#409eff;cursor:pointer;" v-model="scope.row.monitorSecurityNo"
                            placeholder="请输入监控编号后4位" size="small"
                            @keyup.enter.native="monitorSecurityinfo(scope.$index,scope.row)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column v-for="(item,index) in monitorStockColumns"
                               :key="index"
                               :label="item.label"
                               :prop="item.field"
                               :item="item"></el-table-column>
              <!--<s-table-columns v-for="(item,index) in monitorStockColumns"-->
                               <!--:key="index"-->
                               <!--:item="item"-->
                               <!--v-if="item.isActive===undefined||item.isActive"/>-->
            </el-table>
          </el-col>
          <el-col :xl="12">
            <el-table
              border
              max-height="300"
              :data="monitorGroupsData"
              @selection-change="selectedmonitorGroupsRow"
              style="width: 100%; overflow:visible;">
              <el-table-column
                type="selection"
                align="center"
              />
              <el-table-column
                prop="groupNo"
                label="监控编号"
                show-overflow-tooltip>
                <template slot-scope="scope" v-popover:popoverbox>
                  <a class="link-common-css" v-if="formCard1Disabled" @click="gotoFocusMonitorAccountGroupPage(scope)">{{scope.row.groupNo}}</a>
                  <el-input v-else :disabled="formCard1Disabled" :class="scope.row.readonly?'clueReportborderNone':''"
                            style="text-decoration:underline;color:#409eff;cursor:pointer;" v-model="scope.row.groupNo"
                            placeholder="请输入监控编号后4位" size="small"
                            @keyup.enter.native="monitorGroupsinfo(scope.$index,scope.row)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column v-for="(item,index) in monitorGroupsColumns"
                               :key="index"
                               :label="item.label"
                               :prop="item.field"
                               :item="item"></el-table-column>
              <!--<s-table-columns v-for="(item,index) in monitorGroupsColumns"
                               :key="index"
                               :item="item"
                               v-if="item.isActive===undefined||item.isActive"/>-->
            </el-table>
          </el-col>
          <el-col :xl="20">
            <el-form-item label="搜索关键字：">
              <el-input class="custom-width" :disabled=formCard1Disabled v-model="selectParams.keyword" size="small" :maxlength="50" placeholder="输入内容在50字以内"></el-input>
              注：请将账户，股票代码等相关信息填入搜索关键字，供账户跟踪信息查询使用。
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="el-card-table"
             v-if="String(selectParams.isClueReport) === '1' && formCard2Show">
      <div slot="header">
        发函信息
      </div>
      <el-form :inline="true" :model="selectParams" ref="selectParams1" :rules="rules">
        <el-row :gutter="20">
          <el-col :xl="24">
            <el-form-item required label="证券代码及简称：">
              <stock-code-query :commonData="commonData1" @getStockCode="getStockCode1" size="small"
                                style='display: inline-flex;'></stock-code-query>
              <el-radio :disabled=formCard2Disabled v-model="selectParams.stock1" label="1" @change="noneStock2">无证券代码</el-radio>
            </el-form-item>
          </el-col>
          <el-col :xl="12">
            <el-form-item required label="函件类型：">
              <el-select :disabled=formCard2Disabled v-model="selectParams.letterType1" placeholder="" size="small"
                         @change="changeLetterType">
                <el-option
                  v-for="item in letterType1Options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select :disabled=formCard2Disabled v-model="selectParams.letterType2" placeholder="" size="small"
                         @change="changeLetterNum">
                <el-option
                  v-for="item in letterType2Options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="12">
            <el-form-item required label="函件编号：">
              <el-input disabled v-model="selectParams.letterNumber" placeholder="" size="small"
                        style='width:250px'></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="函件名称：" prop="letterName">
              <el-input :disabled=formCard2Disabled v-bind:maxlength=50 v-model="selectParams.letterName" placeholder=""
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="反馈单位：" prop="unit">
              <el-radio :disabled=formCard2Disabled v-model="selectParams.unit" label="0">证监会</el-radio>
              <el-radio :disabled=formCard2Disabled v-model="selectParams.unit" label="1">稽查局</el-radio>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="发函单位：" required>
              <el-select :disabled=formCard2Disabled v-model="selectParams.letterUnit1" placeholder="" size="small"
                         @change="changeUnit">
                <el-option
                  v-for="item in letterUnit1Options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select :disabled=formCard2Disabled v-model="selectParams.letterUnit2" placeholder="" size="small">
                <el-option
                  v-for="item in letterUnit2Options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item required label="发函方式：" prop="letterStyle">
              <el-checkbox-group v-model="selectParams.letterStyle">
                <el-checkbox :disabled=formCard2Disabled label="本部门存档" name="letterStyle"></el-checkbox>
                <el-checkbox :disabled=formCard2Disabled label="传真" name="letterStyle"></el-checkbox>
                <el-checkbox :disabled=formCard2Disabled label="纸质" name="letterStyle"></el-checkbox>
                <el-checkbox :disabled=formCard2Disabled label="电话" name="letterStyle"></el-checkbox>
                <el-checkbox :disabled=formCard2Disabled label="口头通知" name="letterStyle"></el-checkbox>
                <el-checkbox :disabled=formCard2Disabled label="电子邮件" name="letterStyle"></el-checkbox>
                <el-checkbox :disabled=formCard2Disabled label="OA" name="letterStyle"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :xl="24" style="display:inline-block">
            <el-form-item label="发函附件：" prop="letterfilelist">
              <div v-if="showUploadButton" style="min-width:250px;">
                <el-upload
                  class="upload-demo"
                  :action=letterUploadurl
                  :on-preview="handelpreview"
                  :on-remove="deletefilelist"
                  :on-success="getfileID"
                  :before-upload="checkLetterFileSize"
                  accept="application/pdf,application/msword"
                  :disabled=formCard2Disabled
                  :file-list="selectParams.letterfilelist"
                  style="display:inline-block"
                >
                  <el-button
                    type="text"
                    size="small"
                    :disabled=formCard2Disabled
                    style="display:inline"
                  >上传
                  </el-button>
                </el-upload>
              </div>
              <div v-else>
                <span
                  style="display: block;"
                  v-for="item in letterFileNameList"
                  :key="item">
                  {{item}}
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="20">
            <el-form-item label="备注：" class="describe">
              <el-input :disabled=formCard2Disabled placeholder="字符限制1000以内" v-bind:maxlength=1000 size="small"
                        v-model="selectParams.note" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24" v-if="processStatus==10">
            <el-form-item required label="发函人：">
              {{selectParams.letterPerson}}
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24" v-if="processStatus==10">
            <el-form-item required label="发函日期：">
              {{selectParams.letterDate}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        审核意见
      </div>
      <el-form :inline="true" :model="checkOptionParams" ref="checkOptionParams" v-if="suggestShow">
        <el-form-item label="您的意见：" class="describe">
          <el-input :disabled=suggestDisabled v-model="checkOptionParams.suggestion" placeholder="字符限制200以内" v-bind:maxlength=200
                    type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-table
        v-if="checkSuggestionData.length"
        :data="checkSuggestionData"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        max-height="400"
        :reserve-selection="true"
        style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          v-for="column in checkSuggestionColumns"
          :key="column.field"
          :align="column.align"
          :prop="column.field"
          :label="column.label"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title=""
      :visible.sync="dialogFormVisble"
      center
      width="700px">
      <el-form>
        <el-form-item :label-width="formLabelWidth">
          <el-button @click="displaySelectPerson('0')" type="primary" style="text-align: center;">
            提交到所领导审批
          </el-button>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button @click="displaySelectPerson('1')" type="primary" style="text-align: center;">
            提交到拟稿人确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
    <span v-if="newcreat&&(processStatus==1||processStatus==5||processStatus==6||processStatus==7)">
      <el-button @click="rejectOperate" type="primary"
                 style="float:right;margin:20px 20px 0 0;width:10%">驳回</el-button>
    </span>
    <select-person-component
      v-if="selectData.dialogFormVisble"
      :selectData="selectData"
      @obdSelectPerson='submitForm'></select-person-component>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import moment from 'moment'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import InputContent from '../focusMonitorAccountGroup/inputContent'
  import selectPersonComponent from '../superviseTaskComponent/selectPersonComponent'
  import StepsCommonComponent from '../superviseTaskComponent/StepsCommonComponent'
  import {formAuthority} from './formAuthority'
  import {
    getInfoId,
    getClueReportnum,
    realGroupClueReportlaunch,
    ClueReportsave,
    historyGroupLeaderClueReportlaunch,
    historyGrouperClueReportlaunch,
    postClueReportdata,
    getClueReportLetternum,
    ClueReporthistoryopiniondata,
    ClueReportexamine,
    ispermitload,
    deletefile,
    getfilelist,
    getaccountinfo,
    getMonitorSecurityInfo,
    getMonitorGroupsInfo,
    getActivityNameByProcessName
  } from '../../../service/superviseTask/index.js'
  import {
    tabletimeformat
  } from '../../../utils/dateTimeFormat.js'
  import MinxinVue from '../MixIn'
  import MixinAuthority from '../MixinAuthority'

  export default {
    components: {
      Breadcrumb,
      selectPersonComponent,
      StockCodeQuery,
      StepsCommonComponent,
      TextUpload: () => import('../../common/textUpload'),
      STableColumns: () => import('@/components/base/STableColumns') // 表格列
    },
    mixins: [MinxinVue, MixinAuthority],
    computed: {
      formCard1Disabled () {
        if (String(this.$route.query.operate) === '-3') {
          return false
        } else {
          return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard1']['disabled']
        }
      },
      formCard2Disabled () {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['formCard2']['disabled']
      },
      suggestDisabled () {
        return String(this.handleStatus) === '1' || formAuthority[this.processStatus]['suggestForm']['disabled']
      },
      formCard1Show () {
        return formAuthority[this.processStatus]['formCard1']['show']
      },
      formCard2Show () {
        return formAuthority[this.processStatus]['formCard2']['show']
      },
      suggestShow () {
        return formAuthority[this.processStatus]['suggestForm']['show']
      }
    },
    data () {
      return {
        formAuthority,
        steps: [],
        stepsDescription: [],
        acivityNameArray: [],
        selectData: {
          dialogFormVisble: false,
          activityName: '', // 审核并分配
          instanceId: '',
          processName: 'ngsp_crp_flow', // 当前流程名称
          businessData: {}
        }, // 调取分配人dialog接口的入参
        breadcrumbItems: [
          {
            router: '',
            label: '监察任务'
          },
          {
            router: '/clueReportTablelist',
            label: '线索报告'
          },
          {
            router: '',
            label: '线索报告表单'
          }
        ],
        dialogFormVisble: false,
        formLabelWidth: '120px',
        sendToLeader: '',
        approveFlag: 'true',
        uploadOption: {
          name: '指定导入',
          size: 'small',
          disabledflag: false
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
        processinfo9: '',
        processinfo10: '',
        commonData: {
          disabled: false,
          stockCode: [],
          multiple: true
        },
        commonData1: {
          disabled: false,
          stockCode: [],
          multiple: true
        },
        selectParams: {
          keyword: '',
          clueNumber: '',
          clueName: '',
          clueDescript: '',
          isClueReport: '1',
          clueStyle: '1',
          group: [],
          sourceStyle: '0',
          clueSource: '',
          meetingSummaryfilelist: [],
          basicInfofilelist: [],
          stock0: '1',
          stock1: '1',
          letterType1: '异动报告',
          letterType2: '异动报告',
          letterNumber: '',
          letterName: '',
          unit: '0',
          letterUnit1: '本所',
          letterUnit2: '市场监察一部',
          letterStyle: [],
          note: '',
          letterPerson: '',
          letterDate: '',
          letterfilelist: []
        },
        tableRead: 'false',
        meetingSummaryUploadurl: '',
        basicInfoUploadurl: '',
        letterUploadurl: '',
        sourceStyleOptions: [
          {
            value: '0',
            label: '联合监管'
          }, {
            value: '1',
            label: '舆情分析'
          }, {
            value: '2',
            label: '主动发现'
          }, {
            value: '3',
            label: '定期核查'
          }, {
            value: '4',
            label: '重点监控账户组'
          }, {
            value: '5',
            label: '重点监控证券'
          }, {
            value: '6',
            label: '其它'
          }
        ],
        letterType1Options: [
          {
            value: '核查报告',
            label: '核查报告'
          }, {
            value: '异动报告',
            label: '异动报告'
          }, {
            value: '定期报告',
            label: '定期报告'
          }, {
            value: '临时报告',
            label: '临时报告'
          }, {
            value: '信息快报',
            label: '信息快报'
          }, {
            value: '研究报告',
            label: '研究报告'
          }, {
            value: '专题报告',
            label: '专题报告'
          }, {
            value: '走访报告',
            label: '走访报告'
          }, {
            value: '来访记录',
            label: '来访记录'
          }
        ],
        letterType2Options: [{
          value: '核查报告',
          label: '核查报告'
        }, {
          value: '核查补充报告',
          label: '核查补充报告'
        }
        ],
        letterUnit1Options: [
          {
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
          }
        ],
        letterUnit2Options: [
          {
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
            value: '上市公司监管二部',
            label: '上市公司监管二部'
          }, {
            value: '法律部',
            label: '法律部'
          }
        ],
        checkOptionParams: {
          suggestion: ''
        },
        reportAccountData: [], // 上报账户
        reportAccountColumns: [
          // {label: "上报账户代码", field: "accountCode", align: "center", minWidth: "6%", template: InputContent},
          {label: '上报账户名称', field: 'accountName', align: 'center', minWidth: '6%', template: InputContent},
          {label: '会员名称', field: 'member', align: 'center', minWidth: '6%', template: InputContent},
          {label: '营业部名称', field: 'salepart', align: 'center', minWidth: '6%', template: InputContent},
          {label: '一码通', field: 'oneword', align: 'center', minWidth: '6%', template: InputContent},
          {label: '账户分类', field: 'assortment', align: 'center', minWidth: '6%', template: InputContent},
        ],
        monitorStockData: [], // 重点监控证券
        monitorStockColumns: [
          // {label: "监控编号", field: "monitorSecurityNo", align: "center", minWidth: "6%", template: InputContent},
          {label: '证券代码及简称', field: 'security', align: 'center', minWidth: '6%', template: InputContent},
        ],
        monitorGroupsData: [], // 重点监控账户组
        monitorGroupsColumns: [
          // {label: "监控编号", field: "groupNo", align: "center", minWidth: "6%", template: InputContent},
          {label: '账户组名称', field: 'groupName', align: 'center', minWidth: '6%', template: InputContent},
        ],
        checkSuggestionData: [],
        checkSuggestionColumns: [
          {label: '流程状态', field: 'proceStatus', align: 'center'},
          {label: '审核意见', field: 'comment', align: 'center'},
          {label: '处理人', field: 'procePerson', align: 'center'},
          {label: '审核日期', field: 'createTime', align: 'center'},
        ],
        rules: {
          clueName: [{required: true, message: '请输入线索名称'}],
          group: [{required: true, message: '请选择线索类型'}],
          unit: [{required: true, message: '请选择反馈单位'}],
          letterName: [{required: true, message: '请输入函件名称'}],
          letterfilelist: [{required: true, message: '请上传发函附件'}],
          letterStyle: [{required: true, message: '请选择发函方式'}]
        },
        newcreat: true, /* 编辑状态 */
        processStatus: 0,
        instanceId: '',
        taskId: '',
        opearte: '',
        infoId: '',
        handleStatus: '', // 同newcreat，从列表的处理按钮进入
        toWhom: '',
        lastProcessName: '', /* 用来显示正确的函件编号，将上一次的编号传给后台 */
        form1: false, // 是否有编辑权限
        form2: false,
        form3: false,
        accountEditIndex: [],
        monitorStockEdit: [],
        monitorGroupsEdit: [],
        showUploadButton: true, // 上传附件按钮展示
        meetingSummaryFileNameList: [], // 线索会商纪要附件列表
        basicInfoFileNameList: [], // 附件列表
        letterFileNameList: [] // 发函附件
      }
    },
    mounted () {
      this.reqActivityNameByProcessName(() => {
        const {operate, taskId, instanceId, processStatus} = this.$route.query
        if (processStatus) {
          this.processStatus = processStatus
        }
        this.handleStatus = operate
        switch (this.handleStatus) {
          case '-1':
            this.processStatus = 0
            this.getInfoId()
            this.opearte = 'new'
            this.getnumber()
            this.newcreat = true
            break
          case '-2':
            this.processStatus = 3
            this.getInfoId()
            this.opearte = 'new'
            this.getnumber()
            this.getLetternumber()
            this.newcreat = true
            break
          case '-3':
            this.processStatus = 2
            this.getInfoId()
            this.opearte = 'new'
            this.getnumber()
            this.newcreat = true
            break
          default:
            this.taskId = taskId
            this.instanceId = instanceId
        }
        // 当processStatus变化，更新activityName
        this.reqActivityNameByProcessName()
        if (this.handleStatus == '1') {
          this.newcreat = false
          this.getAllData()
          this.gethistoryform()
          this.form1 = true
          this.form2 = true
          this.form3 = true
          this.getLetternumber()
          this.commonData.disabled = true
          this.commonData1.disabled = true
          this.uploadOption.disabledflag = true
        }
        if (this.handleStatus == '2') {
          this.newcreat = true
          this.getAllData()
          this.gethistoryform()
          this.getLetternumber()
        }
      })
    },
    methods: {
      gotoFocusMonitorSecurityPage(scope) {
        this.$router.push({name: 'overMonitorSecurity', query: {opearte: 1, instanceId: scope.row.infoIdMsc}})
      },
      gotoFocusMonitorAccountGroupPage(scope) {
        this.$router.push({name: 'overBuiltAccountGroup', query: {opearte: 1, instanceId:  scope.row.infoIdMag}})
      },
      checkFileSize (file) {
        console.log(file)
        if (file.size > 20971520) {
          this.$message.error('请上传文件在20M以内！')
          return false
        }
      },
      checkLetterFileSize (file) {
        if (file.size > 10485760) {
          this.$message.error('请上传文件在10M以内！')
          return false
        }
      },
      reqActivityNameByProcessName (callback) {
        getActivityNameByProcessName(this.selectData.processName).then(res => {
          this.steps = res['localStatusName']
          this.acivityNameArray = res['activityName']
          this.selectData.activityName = res['activityName'][+this.processStatus + 1]
          this.selectData.businessData = res['businessData']
          callback && callback()
        })
      },
      rejectOperate () {
        this.$confirm('确定驳回？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.approveFlag = 'false'
          this.submitForm()
        }).catch(() => {})
      },
      validateForms() {
        let flag1 = true, flag2 = true
        if (this.$refs['selectParams']) {
          this.$refs['selectParams'].validate((valid) => {
            flag1 = valid
          })
        }
        if (this.$refs['selectParams1']) {
          this.$refs['selectParams1'].validate((valid) => {
            flag2 = valid
          })
        }
        return flag1 && flag2
      },
      displaySelectPerson (toleader) {
        if (!this.validateForms()) {
          return
        }
        // 驳回或者不进行线索上报
        if ((String(this.selectParams.isClueReport) === '0') && String(this.processStatus) === '4') {
          this.submitForm()
          return
        }
        if (this.processStatus == 6) {
          if (this.dialogFormVisble == false) {
            this.dialogFormVisble = true
            return
          }
          if (this.dialogFormVisble == true) {
            this.dialogFormVisble = false
            if (toleader && toleader == '0') {
              // this.selectData.activityName = '所领导审批'
              this.sendToLeader = 'true'
            }
            if (toleader && toleader == '1') {
              this.sendToLeader = 'false'
              this.submitForm()
              return
            }
          }
        }
        // 在拟稿确认节点，如果选择了本部门存档，直接办结；否则弹出选人组件并且进入到发函节点
        if (this.processStatus == 8) {
          if (this.selectParams.letterStyle[0] == '本部门存档') {
            this.submitForm()
            return
          } else {
            // this.selectData.activityName = '发函人发函'
          }
        }
        // 所领导审批和发函节点不需要选人组件
        if (this.processStatus == 7 || this.processStatus == 9) {
          this.submitForm()
          return
        }
        this.selectData.dialogFormVisble = true
        /* if (this.processStatus == 0) {
         this.selectData.activityName = '实时组长审核'
         }
         if (this.processStatus == 1) {
         this.selectData.activityName = '历史组组长分配'
         }
         if (this.processStatus == 2) {
         this.selectData.activityName = '历史组组员拟稿'
         }
         if (this.processStatus == 3) {
         this.selectData.activityName = '复核'
         }
         if (this.processStatus == 4) {
         this.selectData.activityName = '历史组组长审批'
         }
         if (this.processStatus == 5) {
         this.selectData.activityName = '部门负责人审批'
         }
         this.selectData.instanceId = ''
         this.selectData.processName = 'ngsp_crp_flow'
         this.selectData.businessData = {'SEND_UP': '1', 'DISTIBUTION': '0', 'LEADER': '1', 'SENDWAY': '1'} */
      },
      getfileID () {
        this.getfilelist()
      },
      getInfoId () {
        getInfoId().then((resp) => {
          this.infoId = resp
          this.meetingSummaryUploadurl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=clueMeetingSummary&infoId=' + this.infoId + '&fileName=' + ''
          this.basicInfoUploadurl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=lad_basicInfo_attachment&infoId=' + this.infoId + '&fileName=' + ''
          this.letterUploadurl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=lad_letter_attachment&infoId=' + this.infoId + '&fileName=' + ''
        })
      },
      // 获取线索报告编号
      getnumber () {
        getClueReportnum().then((resp) => {
          this.selectParams.clueNumber = resp
        })
      },
      changeLetterNum () {
        this.getLetternumber()
      },
      // 获取函件编号
      getLetternumber () {
        getClueReportLetternum(this.selectParams.letterType2, this.lastProcessName).then((resp) => {
          this.lastProcessName = this.selectParams.letterType2
          this.selectParams.letterNumber = resp
        })
      },
      getfilelist () {
        getfilelist(this.infoId).then((resp) => {
          this.meetingSummaryFileNameList = []
          this.basicInfoFileNameList = []
          this.letterFileNameList = []
          this.selectParams.meetingSummaryfilelist = []
          this.selectParams.basicInfofilelist = []
          this.selectParams.letterfilelist = []
          this.showUploadButton = resp.authority
          resp.attachments.forEach(item => {
            if (item.fileLocation == 'clueMeetingSummary') {
              this.selectParams.meetingSummaryfilelist.push({'name': item.fileName, 'fileId': item.fileId})
            } else if (item.fileLocation == 'lad_basicInfo_attachment') {
              this.selectParams.basicInfofilelist.push({'name': item.fileName, 'fileId': item.fileId})
            } else if (item.fileLocation == 'lad_letter_attachment') {
              this.selectParams.letterfilelist.push({'name': item.fileName, 'fileId': item.fileId})
            }
          })
          this.meetingSummaryFileNameList = this.getFileNameList(this.selectParams.meetingSummaryfilelist, this.meetingSummaryFileNameList)
          this.basicInfoFileNameList = this.getFileNameList(this.selectParams.basicInfofilelist, this.basicInfoFileNameList)
          this.letterFileNameList = this.getFileNameList(this.selectParams.letterfilelist, this.letterFileNameList)
        })
        // this.$refs['selectParams1'].validateField('letterfilelist')
      },
      deletefilelist (file) {
        if (file.fileId) {
          deletefile(file.fileId).then((resp) => {
            this.getfilelist()
          })
        }
      },
      handelpreview (file) {
        let fileId = ''
        for (let item of this.selectParams.meetingSummaryfilelist) {
          if (item.name == file.name) {
            fileId = item.fileId
          }
        }
        for (let item of this.selectParams.basicInfofilelist) {
          if (item.name == file.name) {
            fileId = item.fileId
          }
        }
        for (let item of this.selectParams.letterfilelist) {
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
      saveall () {
        if (!this.validateForms()) {
          return
        }
        for (let i = 0; i < this.reportAccountData.length; i++) {
          this.reportAccountData[i].infoId = this.infoId
        }

        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let security = ''
        let clueTypeText = []
        if (this.commonData.stockCode.length == 0) {
          security = ''
        } else {
          security = this.commonData.stockCode.join(';')
        }
        let clueType = []
        for (let i = 0; i < this.selectParams.group.length; i++) {
          switch (this.selectParams.group[i]) {
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
        let sourceTypeText = ''
        for (let i = 0; i < this.sourceStyleOptions.length; i++) {
          if (this.sourceStyleOptions[i].value == this.selectParams.sourceStyle) {
            sourceTypeText = this.sourceStyleOptions[i].label
          }
        }
        let letterSecurity = ''
        if (this.commonData1.stockCode.length == 0) {
          letterSecurity = ''
        } else {
          letterSecurity = this.commonData1.stockCode.join(';')
        }
        let sendWay = []
        for (let i = 0; i < this.selectParams.letterStyle.length; i++) {
          switch (this.selectParams.letterStyle[i]) {
            case '本部门存档':
              sendWay.push('0')
              break
            case '传真':
              sendWay.push('1')
              break
            case '纸质':
              sendWay.push('2')
              break
            case '电话':
              sendWay.push('3')
              break
            case '口头通知':
              sendWay.push('4')
              break
            case '电子邮件':
              sendWay.push('5')
              break
            case 'OA':
              sendWay.push('6')
              break
          }
        }
        if (this.processStatus === 9) {
          this.selectParams.letterPerson = this.gfnGetRealName()
          this.selectParams.letterDate = moment().format('YYYY-MM-DD')
        }
        let params = {
          'crpMain': {
            'infoId': this.infoId,
            'extend1': this.selectParams.clueNumber,
            'security': security,
            'clueName': this.selectParams.clueName,
            'clueDesc': this.selectParams.clueDescript,
            'needReport': this.selectParams.isClueReport,
            'clueBranch': this.selectParams.clueStyle,
            'clueType': clueType.join(','),
            'clueTypeText': clueTypeText.join(','),
            'sourceType': this.selectParams.sourceStyle,
            'sourceTypeText': sourceTypeText,
            'source': this.selectParams.clueSource,
            'letterSecurity': letterSecurity,
            'letterType': this.selectParams.letterType1 + ' ' + this.selectParams.letterType2,
            'letterNo': this.selectParams.letterNumber,
            'letterName': this.selectParams.letterName,
            'fkDepartment': this.selectParams.unit,
            'sendDepartment': this.selectParams.letterUnit1 + ' ' + this.selectParams.letterUnit2,
            'sendWay': sendWay.join(','),
            'note': this.selectParams.note,
            'sendPerson': this.selectParams.letterPerson,
            'sendDate': this.selectParams.letterDate,
            'createFrom': '',
            'fromInfoId': '',
            'fromTitle': '',
            'processStatus': this.processStatus,
            'comment': this.checkOptionParams.suggestion,
          },
          'accountinfo': this.reportAccountData,
          'accountGroup': this.monitorGroupsData,
          'monitorSecurity': this.monitorStockData,
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': this.toWhom,
          'approve': 'true',
          'keyword': this.selectParams.keyword,
          'operate': this.opearte // 从新建按钮进去第一次保存为’new‘，其他为空
        }
        let isparams = JSON.stringify(params)
        ClueReportsave(isparams).then((resp) => {
          this.opearte = ''
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
        })
      },
      // 获取表单数据
      getAllData () {
        postClueReportdata(this.instanceId).then((resp) => {
          resp = JSON.parse(resp)
          // this.processStatus = resp.crpMain.processStatus
          // this.reqActivityNameByProcessName()
          this.selectParams.keyword = resp.keyword
          this.infoId = resp.infoId
          this.meetingSummaryUploadurl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=clueMeetingSummary&infoId=' + this.infoId + '&fileName=' + ''
          this.basicInfoUploadurl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=lad_basicInfo_attachment&infoId=' + this.infoId + '&fileName=' + ''
          this.letterUploadurl = '/ngsp/zuul/bpm/v1/attachment/upload?fileLoc=lad_letter_attachment&infoId=' + this.infoId + '&fileName=' + ''
          this.selectParams.clueNumber = resp.crpMain.extend1
          if (!resp.crpMain.security) {
            this.selectParams.stock0 = '1'
          } else {
            this.commonData.stockCode = resp.crpMain.security.split(';')
            this.selectParams.stock0 = ''
          }
          this.selectParams.clueName = resp.crpMain.clueName
          this.selectParams.clueDescript = resp.crpMain.clueDesc
          this.selectParams.isClueReport = resp.crpMain.needReport

          this.selectParams.clueStyle = resp.crpMain.clueBranch
          for (let i = 0; i < resp.crpMain.clueType.split(',').length; i++) {
            switch (resp.crpMain.clueType.split(',')[i]) {
              case '0':
                this.selectParams.group.push('内幕交易')
                break
              case '1':
                this.selectParams.group.push('市场操纵')
                break
              case '2':
                this.selectParams.group.push('利益输送—股票')
                break
              case '3':
                this.selectParams.group.push('利益输送—债券')
                break
              case '4':
                this.selectParams.group.push('超比例持股')
                break
              case '5':
                this.selectParams.group.push('老鼠仓')
                break
              case '6':
                this.selectParams.group.push('短线交易')
                break
              case '7':
                this.selectParams.group.push('其它—股票')
                break
              case '8':
                this.selectParams.group.push('其它—债券')
                break
            }
          }
          this.selectParams.sourceStyle = resp.crpMain.sourceType
          this.selectParams.clueSource = resp.crpMain.source
          this.reportAccountData = resp.accountinfo
          this.monitorStockData = resp.monitorSecurity
          this.monitorGroupsData = resp.accountGroup // 表单一
          this.checkOptionParams.suggestion = resp.crpMain.comment
          if (!resp.crpMain.letterSecurity) {
            this.selectParams.stock1 = '1'
          } else {
            this.commonData1.stockCode = resp.crpMain.letterSecurity.split(';')
            this.selectParams.stock1 = ''
          }
          this.selectParams.letterType1 = resp.crpMain.letterType ? resp.crpMain.letterType.split(' ')[0] : this.selectParams.letterType1
          this.selectParams.letterType2 = resp.crpMain.letterType ? resp.crpMain.letterType.split(' ')[1] : this.selectParams.letterType2
          this.selectParams.letterNumber = resp.crpMain.letterNo
          this.selectParams.letterName = resp.crpMain.letterName
          this.selectParams.unit = resp.crpMain.fkDepartment
          this.selectParams.letterUnit1 = resp.crpMain.sendDepartment ? resp.crpMain.sendDepartment.split(' ')[0] : this.selectParams.letterUnit1
          this.selectParams.letterUnit2 = resp.crpMain.sendDepartment ? resp.crpMain.sendDepartment.split(' ')[1] : this.selectParams.letterUnit2
          if (resp.crpMain.sendWay.split(',').length == 0) {
          } else {

          }
          for (let i = 0; i < resp.crpMain.sendWay.split(',').length; i++) {
            switch (resp.crpMain.sendWay.split(',')[i]) {
              case '0':
                this.selectParams.letterStyle.push('本部门存档')
                break
              case '1':
                this.selectParams.letterStyle.push('传真')
                break
              case '2':
                this.selectParams.letterStyle.push('纸质')
                break
              case '3':
                this.selectParams.letterStyle.push('电话')
                break
              case '4':
                this.selectParams.letterStyle.push('口头通知')
                break
              case '5':
                this.selectParams.letterStyle.push('电子邮件')
                break
              case '6':
                this.selectParams.letterStyle.push('OA')
                break
            }
          }
          this.selectParams.note = resp.crpMain.note
          this.selectParams.letterPerson = resp.crpMain.sendPerson
          this.selectParams.letterDate = resp.crpMain.sendDate
          for (let i = 0; i < this.reportAccountData.length; i++) {
            this.reportAccountData[i].infoId = this.infoId
          }
          for (let i = 0; i < this.monitorStockData.length; i++) {
            this.monitorStockData[i].infoId = this.infoId
          }
          for (let i = 0; i < this.monitorGroupsData.length; i++) {
            this.monitorGroupsData[i].infoId = this.infoId
          }
          if (this.handleStatus == '1') {
            for (let i = 0; i < this.reportAccountData.length; i++) {
              this.reportAccountData[i].readonly = true
            }
            for (let i = 0; i < this.monitorStockData.length; i++) {
              this.monitorStockData[i].readonly = true
            }
            for (let i = 0; i < this.monitorGroupsData.length; i++) {
              this.monitorGroupsData[i].readonly = true
            }
          }
          if (this.handleStatus == '2') {
            switch (this.processStatus) {
              case 0:
                this.form1 = false
                break
              case 1:
                this.form1 = true
                this.commonData.disabled = true
                this.uploadOption.disabledflag = true
                for (let i = 0; i < this.reportAccountData.length; i++) {
                  this.reportAccountData[i].readonly = true
                }

                for (let i = 0; i < this.monitorStockData.length; i++) {
                  this.monitorStockData[i].readonly = true
                }

                for (let i = 0; i < this.monitorGroupsData.length; i++) {
                  this.monitorGroupsData[i].readonly = true
                }

                break
              case 2:
                this.form1 = true
                this.commonData.disabled = true
                this.uploadOption.disabledflag = true
                for (let i = 0; i < this.reportAccountData.length; i++) {
                  this.reportAccountData[i].readonly = true
                }

                for (let i = 0; i < this.monitorStockData.length; i++) {
                  this.monitorStockData[i].readonly = true
                }

                for (let i = 0; i < this.monitorGroupsData.length; i++) {
                  this.monitorGroupsData[i].readonly = true
                }

                break
              case 3:
                this.form1 = false
                break
              case 4:
                this.form1 = false
                this.form2 = false
                break
              case 5:
                this.form1 = true
                this.form2 = true
                this.commonData1.disabled = true
                this.commonData.disabled = true
                this.uploadOption.disabledflag = true
                for (let i = 0; i < this.reportAccountData.length; i++) {
                  this.reportAccountData[i].readonly = true
                }

                for (let i = 0; i < this.monitorStockData.length; i++) {
                  this.monitorStockData[i].readonly = true
                }

                for (let i = 0; i < this.monitorGroupsData.length; i++) {
                  this.monitorGroupsData[i].readonly = true
                }

                break
              case 6:
                this.form1 = true
                this.form2 = true
                this.commonData1.disabled = true
                this.commonData.disabled = true
                this.uploadOption.disabledflag = true
                for (let i = 0; i < this.reportAccountData.length; i++) {
                  this.reportAccountData[i].readonly = true
                }

                for (let i = 0; i < this.monitorStockData.length; i++) {
                  this.monitorStockData[i].readonly = true
                }

                for (let i = 0; i < this.monitorGroupsData.length; i++) {
                  this.monitorGroupsData[i].readonly = true
                }

                break
              case 7:
                this.form1 = true
                this.form2 = true
                this.commonData1.disabled = true
                this.commonData.disabled = true
                this.uploadOption.disabledflag = true
                for (let i = 0; i < this.reportAccountData.length; i++) {
                  this.reportAccountData[i].readonly = true
                }

                for (let i = 0; i < this.monitorStockData.length; i++) {
                  this.monitorStockData[i].readonly = true
                }

                for (let i = 0; i < this.monitorGroupsData.length; i++) {
                  this.monitorGroupsData[i].readonly = true
                }

                break
              case 8:
                this.form1 = true
                this.form2 = true
                this.commonData1.disabled = true
                this.commonData.disabled = true
                this.uploadOption.disabledflag = true
                for (let i = 0; i < this.reportAccountData.length; i++) {
                  this.reportAccountData[i].readonly = true
                }

                for (let i = 0; i < this.monitorStockData.length; i++) {
                  this.monitorStockData[i].readonly = true
                }

                for (let i = 0; i < this.monitorGroupsData.length; i++) {
                  this.monitorGroupsData[i].readonly = true
                }

                break
              case 9:
                this.form1 = true
                this.form2 = true
                this.commonData1.disabled = true
                this.commonData.disabled = true
                this.uploadOption.disabledflag = true
                for (let i = 0; i < this.reportAccountData.length; i++) {
                  this.reportAccountData[i].readonly = true
                }

                for (let i = 0; i < this.monitorStockData.length; i++) {
                  this.monitorStockData[i].readonly = true
                }

                for (let i = 0; i < this.monitorGroupsData.length; i++) {
                  this.monitorGroupsData[i].readonly = true
                }

                break
              case 10:
                this.form1 = true
                this.form2 = true
                this.commonData1.disabled = true
                this.commonData.disabled = true
                this.uploadOption.disabledflag = true
                for (let i = 0; i < this.reportAccountData.length; i++) {
                  this.reportAccountData[i].readonly = true
                }

                for (let i = 0; i < this.monitorStockData.length; i++) {
                  this.monitorStockData[i].readonly = true
                }

                for (let i = 0; i < this.monitorGroupsData.length; i++) {
                  this.monitorGroupsData[i].readonly = true
                }

                break
            }
          }
          this.getfilelist()
        })
      },
      // 提交表单
      submitForm (selectPerson) {
        let reportAccArr = [] // 去掉无效数据
        for (let i = 0; i < this.reportAccountData.length; i++) {
          if (this.reportAccountData[i].accountCode !== '') {
            reportAccArr.push(this.reportAccountData[i])
          }
        }
        let monirGroData = []
        for (let i = 0; i < this.monitorGroupsData.length; i++) {
          if (this.monitorGroupsData[i].groupNo !== '') {
            monirGroData.push(this.monitorGroupsData[i])
          }
        }
        let moniStocData = []
        for (let i = 0; i < this.monitorStockData.length; i++) {
          if (this.monitorStockData[i].monitorSecurityNo !== '') {
            moniStocData.push(this.monitorStockData[i])
          }
        }
        for (let i = 0; i < reportAccArr.length; i++) {
          reportAccArr[i].infoId = this.infoId
        }
        if (this.processStatus == 0 || this.processStatus == 1 || this.processStatus == 2 || this.processStatus == 3 || this.processStatus == 4 || this.processStatus == 5) {
          if (this.approveFlag == 'true') {
            this.toWhom = selectPerson
          }
        }
        if (this.processStatus == 8 && this.selectParams.letterStyle[0] != '本部门存档') {
          if (this.approveFlag == 'true') {
            this.toWhom = selectPerson
          }
        }
        if (this.processStatus == 6 && this.sendToLeader == 'true') {
          if (this.approveFlag == 'true') {
            this.toWhom = selectPerson
          }
        }
        if (this.taskId == '' || this.taskId == null) {
          this.taskId = '0'
        }
        let security = ''
        let clueTypeText = []
        if (this.commonData.stockCode.length == 0) {
          security = ''
        } else {
          security = this.commonData.stockCode.join(';')
        }
        let clueType = []
        for (let i = 0; i < this.selectParams.group.length; i++) {
          switch (this.selectParams.group[i]) {
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
        let sourceTypeText = ''
        for (let i = 0; i < this.sourceStyleOptions.length; i++) {
          if (this.sourceStyleOptions[i].value == this.selectParams.sourceStyle) {
            sourceTypeText = this.sourceStyleOptions[i].label
          }
        }
        let letterSecurity = ''
        if (this.commonData1.stockCode.length == 0) {
          letterSecurity = ''
        } else {
          letterSecurity = this.commonData1.stockCode.join(';')
        }
        let sendWay = []
        for (let i = 0; i < this.selectParams.letterStyle.length; i++) {
          switch (this.selectParams.letterStyle[i]) {
            case '本部门存档':
              sendWay.push('0')
              break
            case '传真':
              sendWay.push('1')
              break
            case '纸质':
              sendWay.push('2')
              break
            case '电话':
              sendWay.push('3')
              break
            case '口头通知':
              sendWay.push('4')
              break
            case '电子邮件':
              sendWay.push('5')
              break
            case 'OA':
              sendWay.push('6')
              break
          }
        }
        if (this.processStatus === 9) {
          this.selectParams.letterPerson = this.gfnGetRealName()
          this.selectParams.letterDate = moment().format('YYYY-MM-DD')
        }
        let params = {
          'crpMain': {
            'infoId': this.infoId,
            'extend1': this.selectParams.clueNumber,
            'security': security,
            'clueName': this.selectParams.clueName,
            'clueDesc': this.selectParams.clueDescript,
            'needReport': this.selectParams.isClueReport,
            'clueBranch': this.selectParams.clueStyle,
            'clueType': clueType.join(','),
            'clueTypeText': clueTypeText.join(','),
            'sourceType': this.selectParams.sourceStyle,
            'sourceTypeText': sourceTypeText,
            'source': this.selectParams.clueSource,
            'letterSecurity': letterSecurity,
            'letterType': this.selectParams.letterType1 + ' ' + this.selectParams.letterType2,
            'letterNo': this.selectParams.letterNumber,
            'letterName': this.selectParams.letterName,
            'fkDepartment': this.selectParams.unit,
            'sendDepartment': this.selectParams.letterUnit1 + ' ' + this.selectParams.letterUnit2,
            'sendWay': sendWay.join(','),
            'note': this.selectParams.note,
            'sendPerson': this.selectParams.letterPerson,
            'sendDate': this.selectParams.letterDate,
            'createFrom': '',
            'fromInfoId': '',
            'fromTitle': '',
            'processStatus': this.processStatus,
            'comment': this.checkOptionParams.suggestion
          },
          'accountinfo': reportAccArr,
          'accountGroup': monirGroData,
          'monitorSecurity': moniStocData,
          'instanceId': this.instanceId,
          'taskId': this.taskId,
          'toWhom': this.toWhom,
          'approve': this.approveFlag, /* 默认为'true'，驳回为'false' */
          'operate': this.opearte,
          'keyword': this.selectParams.keyword,
          'sendToLeader': this.sendToLeader
        }
        let isparams = JSON.stringify(params)
        if (this.handleStatus == -1) {
          realGroupClueReportlaunch(isparams).then((resp) => {
            this.goBack()
          })
        } else if (this.handleStatus == -2) {
          historyGrouperClueReportlaunch(isparams).then((resp) => {
            this.goBack()
          })
        } else if (this.handleStatus == -3) {
          historyGroupLeaderClueReportlaunch(isparams).then((resp) => {
            this.goBack()
          })
        } else if (this.handleStatus == 2) {
          if (this.taskId == '0') {
            if (this.processStatus == 0) {
              realGroupClueReportlaunch(isparams).then((resp) => {
                this.goBack()
              })
            }
            if (this.processStatus == 2) {
              historyGroupLeaderClueReportlaunch(isparams).then((resp) => {
                this.goBack()
              })
            }
            if (this.processStatus == 3) {
              historyGrouperClueReportlaunch(isparams).then((resp) => {
                this.goBack()
              })
            }
          } else {
            ClueReportexamine(isparams).then((resp) => {
              this.goBack()
            })
          }
        }
      },
      // 获取流程节点描述信息
      gethistoryform () {
        ClueReporthistoryopiniondata(this.instanceId).then((resp) => {
          let stepsDescription = []
          if (resp.value !== '无查询结果') {
            for (let item of resp.value) {
              stepsDescription[item.proceStatus] = item.procePerson + ' ' + tabletimeformat(item.createTime)
              item.proceStatus = this.steps[item.proceStatus]
            }
            this.stepsDescription = stepsDescription
            this.checkSuggestionData = resp.value
          }
        })
      },
      // routingmonitorStock(){
      //   // window.open()
      // },
      // routingmonitorGroups(infoId){
      //   debugger
      //   window.open('overBuiltAccountGroup?instanceId='+infoId)
      //   // this.$router.push({name: 'overBuiltAccountGroup', query: {instanceId: row.instanceId, taskId: row.taskId}});
      // },
      // 监控账户组导入
      monitorGroupsinfo (index, row) {
        let allData = this.monitorGroupsData
        getMonitorGroupsInfo(row.groupNo).then((resp) => {
          this.monitorGroupsData = [] // 新增
          this.monitorGroupsData = resp.MagAllRec
          for (let i = 0; i < resp.MagAllRec.length; i++) {
            this.monitorGroupsData[i].groupNo = resp.MagAllRec[i].monitorNo
            this.monitorGroupsData[i].groupName = resp.MagAllRec[i].accountName
            this.monitorGroupsData[i].infoIdMag = resp.MagAllRec[i].infoId
            this.monitorGroupsData[i].infoId = this.infoId
          }
          this.monitorGroupsData = this.concatArrays(this.monitorGroupsData, allData) // 合并
          this.monitorGroupsData = this.removeInvalidElement('account', this.monitorGroupsData) // 去掉无效项
          this.monitorGroupsData = this.removeReportElement('account', this.monitorGroupsData) // 去重
        }, (error) => {
          this.$message.error('导入失败，请重新导入!')
        })
      },
      // 监控证券导入
      monitorSecurityinfo (index, row) {
        let allData = this.monitorStockData
        getMonitorSecurityInfo(row.monitorSecurityNo).then((resp) => {
          this.monitorStockData = []
          this.monitorStockData = resp.MscAllRec
          for (let i = 0; i < resp.MscAllRec.length; i++) {
            this.monitorStockData[i].monitorSecurityNo = resp.MscAllRec[i].monitorNo
            this.monitorStockData[i].security = resp.MscAllRec[i].subject
            this.monitorStockData[i].infoIdMsc = resp.MscAllRec[i].infoId
            this.monitorStockData[i].infoId = this.infoId
          }
          this.monitorStockData = this.concatArrays(this.monitorStockData, allData) // 合并
          this.monitorStockData = this.removeInvalidElement('bond', this.monitorStockData) // 去掉无效项
          this.monitorStockData = this.removeReportElement('bond', this.monitorStockData) // 去重
        }, (error) => {
          this.$message.error('导入失败，请重新导入!')
        })
      },
      // 合并
      concatArrays (arr1, arr2) {
        if (arr2.lenght !== 0) {
          for (let i = 0; i < arr2.length; i++) {
            arr1.push(arr2[i])
          }
        }
        return arr1
      },
      // 去掉无效项 根据某一字段 str
      removeInvalidElement(str, arr) {
        let temp = []
        if (str === 'account') {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].groupNo.length === 10) {
              temp.push(arr[i])
            }
          }
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].monitorSecurityNo.length === 10) {
              temp.push(arr[i])
            }
          }
        }
        return temp
      },
      // 根据某一字段去重
      removeReportElement (str, arr) {
        if (str === 'account') {
          for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              if (arr[j].monitorNo === '' || arr[j].monitorNo === arr[i].monitorNo) {
                arr.splice(j, 1)
              }
            }
          }
        } else {
          for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              if (arr[j].monitorSecurityNo === '' || arr[j].monitorSecurityNo === arr[i].monitorSecurityNo) {
                arr.splice(j, 1)
              }
            }
          }
        }
        return arr
      },
      //  上传账户 - 账户代码输入
      displayinfo (index, row) {
        let reg = /^[A-Z]\d{9}$/
        if (reg.test(row.accountCode)) {
          let data = this.reportAccountData
          for (let i = 1; i <= data.length - 1; i++) {
            if (data[i].accountCode === row.accountCode) {
              row.accountCode = ''
              this.$message.error('输入证券账户代码重复！')
              return
            }
          }
          getaccountinfo(row.accountCode).then((resp) => {
            if (resp.bizData.metaData.length === 0) {
              this.$message.error('无此账户代码,请重新输入!')
            } else {
              this.reportAccountData.splice(0, 1, resp.bizData.metaData[0])
              // this.reportAccountData[0].infoId=this.infoId
              this.reportAccountData[0].accountName = resp.bizData.metaData[0].accountPeople
              switch (this.reportAccountData[0].assortment) {
                case '1':
                  this.reportAccountData[0].assortment = '超大户(1000万元以上)'
                  break
                case '2':
                  this.reportAccountData[0].assortment = '大户(300-1000万元)'
                  break
                case '3':
                  this.reportAccountData[0].assortment = '中户(50-300万元)'
                  break
                case '4':
                  this.reportAccountData[0].assortment = '小户(10-50万元)'
                  break
                case '5':
                  this.reportAccountData[0].assortment = '散户(10万元以下)'
                  break
                case 'A':
                  this.reportAccountData[0].assortment = '开放式基金'
                  break
                case 'B':
                  this.reportAccountData[0].assortment = '封闭式基金'
                  break
                case 'C':
                  this.reportAccountData[0].assortment = '专户'
                  break
                case 'D':
                  this.reportAccountData[0].assortment = '社保'
                  break
                case 'E':
                  this.reportAccountData[0].assortment = 'QFII'
                  break
                case 'F':
                  this.reportAccountData[0].assortment = '保险'
                  break
                case 'G':
                  this.reportAccountData[0].assortment = '券商自营'
                  break
                case 'H':
                  this.reportAccountData[0].assortment = '券商集合理财'
                  break
                case 'I':
                  this.reportAccountData[0].assortment = '信托'
                  break
                case 'J':
                  this.reportAccountData[0].assortment = '年金'
                  break
                case 'M':
                  this.reportAccountData[0].assortment = 'RQFII'
                  break
                case 'O':
                  this.reportAccountData[0].assortment = '香港账户'
                  break
              }
            }
          }, (error) => {
            this.$message.error('导入失败，请重新导入!')
          })
        } else {
          this.$message.error('账户代码格式不对，请重新输入！')
        }
      },
      // 上传账户 - 账户代码导入
      getTxtData (TxtData) {
        let result = []
        let isresult = []
        console.log(TxtData)
        if (Object.keys(this.reportAccountData).length != 0) {
          for (let item of this.reportAccountData) {
            TxtData.push(item.accountCode)
          }
          for (let i = 0; i < TxtData.length; i++) {
            if (result.indexOf(TxtData[i]) == -1) {
              isresult.push(TxtData[i])
            }
          }
          result = isresult.join(',')
        } else {
          result = TxtData.join(',')
        }
        getaccountinfo(result).then((resp) => {
          this.reportAccountData = resp.bizData.metaData
          for (let i = 0; i < this.reportAccountData.length; i++) {
            // this.reportAccountData[i].infoId=this.infoId
            this.reportAccountData[i].accountName = resp.bizData.metaData[i].accountPeople
            switch (this.reportAccountData[i].assortment) {
              case '1':
                this.reportAccountData[i].assortment = '超大户(1000万元以上)'
                break
              case '2':
                this.reportAccountData[i].assortment = '大户(300-1000万元)'
                break
              case '3':
                this.reportAccountData[i].assortment = '中户(50-300万元)'
                break
              case '4':
                this.reportAccountData[i].assortment = '小户(10-50万元)'
                break
              case '5':
                this.reportAccountData[i].assortment = '散户(10万元以下)'
                break
              case 'A':
                this.reportAccountData[i].assortment = '开放式基金'
                break
              case 'B':
                this.reportAccountData[i].assortment = '封闭式基金'
                break
              case 'C':
                this.reportAccountData[i].assortment = '专户'
                break
              case 'D':
                this.reportAccountData[i].assortment = '社保'
                break
              case 'E':
                this.reportAccountData[i].assortment = 'QFII'
                break
              case 'F':
                this.reportAccountData[i].assortment = '保险'
                break
              case 'G':
                this.reportAccountData[i].assortment = '券商自营'
                break
              case 'H':
                this.reportAccountData[i].assortment = '券商集合理财'
                break
              case 'I':
                this.reportAccountData[i].assortment = '信托'
                break
              case 'J':
                this.reportAccountData[i].assortment = '年金'
                break
              case 'M':
                this.reportAccountData[i].assortment = 'RQFII'
                break
              case 'O':
                this.reportAccountData[i].assortment = '香港账户'
                break
            }
          }
        }, (error) => {
          this.$message.error('文件内容或格式错误!')
        })
      },
      selectedRow (val) {
        this.accountEditIndex = val
      },
      selectedmonitorStockRow (val) {
        this.monitorStockEdit = val
      },
      selectedmonitorGroupsRow (val) {
        this.monitorGroupsEdit = val
      },
      addmonitorGroupsRow () {
        this.monitorGroupsData.unshift({
          groupNo: '',
          groupName: '',
          readonly: false
        })
      },
      addmonitorStockDataRow () {
        this.monitorStockData.unshift({
          monitorSecurityNo: '',
          security: '',
          readonly: false
        })
      },
      deletemonitorGroupsrow () {
        // let temp = []
        for (let i = 0; i < this.monitorGroupsData.length; i++) {
          for (let j = 0; j < this.monitorGroupsEdit.length; j++) {
            if (this.monitorGroupsEdit[j].groupNo == this.monitorGroupsData[i].groupNo) {
              // temp.push(this.monitorGroupsData[i])
              this.monitorGroupsData.splice(i, 1)
            }
          }
        }
        // this.monitorGroupsData = temp
      },
      deletemonitorStockrow () {
        for (let i = 0; i < this.monitorStockData.length; i++) {
          for (let j = 0; j < this.monitorStockEdit.length; j++) {
            if (this.monitorStockEdit[j].monitorSecurityNo == this.monitorStockData[i].monitorSecurityNo) {
              this.monitorStockData.splice(i, 1)
            }
          }
        }
      },
      deleterow () {
        for (let i = 0; i < this.reportAccountData.length; i++) {
          for (let j = 0; j < this.accountEditIndex.length; j++) {
            if (this.accountEditIndex[j].accountCode == this.reportAccountData[i].accountCode) {
              this.reportAccountData.splice(i, 1)
            }
          }
        }
      },
      addreportAccountRow () {
        this.reportAccountData.unshift({
          accountCode: '',
          accountName: '',
          member: '',
          salepart: '',
          oneword: '',
          assortment: '',
          readonly: false
        })
      },
      // 切换选择函件类型
      changeLetterType () {
        this.letterType2Options = []
        switch (this.selectParams.letterType1) {
          case '核查报告':
            this.letterType2Options.push({
              value: '核查报告',
              label: '核查报告',
            }, {
              value: '核查补充报告',
              label: '核查补充报告',
            })
            this.selectParams.letterType2 = '核查报告'
            break
          case '异动报告':
            this.letterType2Options.push({
              value: '异动报告',
              label: '异动报告',
            })
            this.selectParams.letterType2 = '异动报告'
            break
          case '定期报告':
            this.letterType2Options.push({
              value: '日报',
              label: '日报',
            }, {
              value: '周报',
              label: '周报',
            }, {
              value: '月报',
              label: '月报',
            }, {
              value: '季报',
              label: '季报',
            }, {
              value: '半年报',
              label: '半年报',
            }, {
              value: '年报',
              label: '年报',
            })
            this.selectParams.letterType2 = '日报'
            break
          case '临时报告':
            this.letterType2Options.push({
              value: '新股上市首日报告',
              label: '新股上市首日报告',
            }, {
              value: '盘中临时停牌公告',
              label: '盘中临时停牌公告',
            }, {
              value: '权证最后交易日报告',
              label: '权证最后交易日报告',
            }, {
              value: '其它临时报告',
              label: '其它临时报告',
            }, {
              value: '投资者教育报告',
              label: '投资者教育报告',
            }, {
              value: '信访投诉处理报告',
              label: '信访投诉处理报告',
            }, {
              value: '异常交易调查报告',
              label: '异常交易调查报告',
            })
            this.selectParams.letterType2 = '新股上市首日报告'
            break
          case '信息快报':
            this.letterType2Options.push({
              value: '信息快报核查',
              label: '信息快报核查',
            })
            this.selectParams.letterType2 = '信息快报核查'
            break
          case '研究报告':
            this.letterType2Options.push({
              value: '监管研究报告',
              label: '监管研究报告',
            })
            this.selectParams.letterType2 = '监管研究报告'
            break
          case '专题报告':
            this.letterType2Options.push({
              value: '监管专题报告',
              label: '监管专题报告',
            })
            this.selectParams.letterType2 = '监管专题报告'
            break
          case '走访报告':
            this.letterType2Options.push({
              value: '走访调研报告',
              label: '走访调研报告',
            })
            this.selectParams.letterType2 = '走访调研报告'
            break
          case '来访记录':
            this.letterType2Options.push({
              value: '会员来访报告',
              label: '会员来访报告',
            })
            this.selectParams.letterType2 = '会员来访报告'
            break
        }
        this.getLetternumber()
      },
      // 切换选择发函单位
      changeUnit () {
        this.letterUnit2Options = []
        switch (this.selectParams.letterUnit1) {
          case '本所':
            this.letterUnit2Options.push({
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
              value: '上市公司监管二部',
              label: '上市公司监管二部'
            }, {
              value: '法律部',
              label: '法律部'
            })
            this.selectParams.letterUnit2 = '发行上市部'
            break
          case '证监会':
            this.letterUnit2Options.push({
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
              value: '市场监管部',
              label: '市场监管部'
            })
            this.selectParams.letterUnit2 = '稽查局'
            break
          case '地方证监局':
            this.letterUnit2Options.push({
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
            this.selectParams.letterUnit2 = '北京局'
            break
          case '公检法':
            this.letterUnit2Options.push({
              value: '福建省公安厅',
              label: '福建省公安厅'
            },  {
              value: '辽宁本溪公安',
              label: '辽宁本溪公安'
            },{
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
            this.selectParams.letterUnit2 = '福建省公安厅'
            break
          case '其他单位':
            this.letterUnit2Options.push({
              value: '其他单位',
              label: '其他单位'
            })
            this.selectParams.letterUnit2 = '其他单位'
            break
          case '中金所':
            this.letterUnit2Options.push({
              value: '监查部',
              label: '监查部'
            })
            this.selectParams.letterUnit2 = '监查部'
            break
        }
      },
      noneStock2 () {
        this.commonData.stockCode = []
      },
      noneStock1 () {
        this.commonData.stockCode = []
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
        if (this.commonData.stockCode.length == 0) {
          this.selectParams.stock0 = '1'
        } else {
          this.selectParams.stock0 = '0'
        }
      },
      getStockCode1 (stockCodeData) {
        this.commonData1.stockCode = stockCodeData
        if (this.commonData1.stockCode.length == 0) {
          this.selectParams.stock1 = '1'
        } else {
          this.selectParams.stock1 = '0'
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
      }
    }
  }
</script>

<style lang="less">
  .affirmMonitorSecurity {
    .custom-width {
      width: 350px;
    }

    .cluebtn {
      padding: 10px 20px;
      .el-button--text {
        border: none;
      }
    }
    .clueReportborderNone {
      input {
        border: none !important;
      }
    }
    .el-step__title.is-process {
      color: #fff
    }
    .el-form {
      padding: 0px 20px;
      .el-form-item {
        margin-bottom: 0px;
        padding: 10px 0px;
      }
    }
    .describe {
      width: 100%;
      .el-form-item__content {
        width: 88%;
      }
    }
  }
</style>
