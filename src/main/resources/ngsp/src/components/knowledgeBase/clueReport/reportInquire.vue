<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="text"
          size="small"
          style="float:right;"
          @click="clearAllData">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right;"
          @click="inquiry">查询
        </el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">证券代码及简称:</el-col>
        <el-col :span="4">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode"
                            style="width: 90%;"></stock-code-query>
        </el-col>
        <el-col :span="2" style="margin-top:8px">线索分类:</el-col>
        <el-col :span="4">
          <el-select v-model="clueStyle" placeholder="全部" size="small" style="width: 96%;">
            <el-option
              v-for="item in clueStyleOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">线索类型:</el-col>
        <el-col :span="4">
          <el-select v-model="clueType" placeholder="全部" size="small" style="width: 90%;">
            <el-option
              v-for="item in clueTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">是否上报:</el-col>
        <el-col :span="4">
          <el-select v-model="isReport" placeholder="全部" size="small" style="width: 90%;">
            <el-option
              v-for="item in isReportOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">上报日期:</el-col>
        <el-col :span="10">
          <el-col :span="10" style="width:40%">
            <el-date-picker
              v-model="dimensionQueryForm.reportbeginDate"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="startpickerOption"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
          <el-col :span="1" style="margin:8px 1% 0">至</el-col>
          <el-col :span="10" style="width:40%">
            <el-date-picker
              v-model="dimensionQueryForm.reportendDate"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="endpickerOption"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
        </el-col>
        <el-col :span="2" style="margin-top:8px">函件类型:</el-col>
        <el-col :span="4">
          <el-select v-model="letterStyle" placeholder="全部" size="small" style="width: 90%;">
            <el-option
              v-for="item in letterStyleOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">函件编号:</el-col>
        <el-col :span="4">
          <!-- <el-input style="width:90%" v-model="departmentname" placeholder="" size="small"></el-input> -->
          <el-select filterable remote v-model="letterNumber" :clearable="true" placeholder="全部" size="small"
                     style="width: 90%;" :remote-method="letterNumberMethod">
            <el-option
              v-for="item in letterNumberOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">拟稿人:</el-col>
        <el-col :span="4">
          <selector-dealer
            style="width: 90%;"
            ref="reportSelectorDealers"
            @node-click="getApplyPerson"
            :selectPerson="draftPerson"></selector-dealer>
          <!-- <el-input style="width:90%" v-model="sendletterperson" placeholder="" size="small"></el-input> -->
          <!--<el-select filterable remote v-model="draftPerson" :clearable="true" placeholder="全部" size="small" style="width: 90%;" :remote-method="createpersonMethod">-->
          <!--<el-option-->
          <!--v-for="item in draftPersonOption"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
        </el-col>
        <el-col :span="2" style="margin-top:8px">创建日期:</el-col>
        <el-col :span="10">
          <el-col :span="11" style="width:40%">
            <el-date-picker
              v-model="dimensionQueryForm.createbeginDate"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="startpickerOption"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
          <el-col :span="1" style="margin:8px 1% 0">至</el-col>
          <el-col :span="11" style="width:40%">
            <el-date-picker
              v-model="dimensionQueryForm.createendDate"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="endpickerOption"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
        </el-col>
        <el-col :span="2" style="margin-top:8px">发函人:</el-col>
        <el-col :span="4">
          <selector-dealer
            style="width: 90%;"
            ref="reportSelectorDealers2"
            @node-click="getApplyPerson2"
            :selectPerson="sendLetterPerson"></selector-dealer>
          <!-- <el-input style="width:90%" v-model="sendletterperson" placeholder="" size="small"></el-input> -->
          <!--<el-select filterable remote v-model="sendLetterPerson" :clearable="true" placeholder="全部" size="small" style="width: 90%;" :remote-method="sendletterpersonMethod">-->
          <!--<el-option-->
          <!--v-for="item in sendLetterPersonOption"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">状态:</el-col>
        <el-col :span="4">
          <el-select v-model="status" placeholder="全部" size="small" style="width: 90%;">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">线索来源:</el-col>
        <el-col :span="4">
          <el-select v-model="clueSource" placeholder="全部" size="small" style="width: 90%;">
            <el-option
              v-for="item in clueSourceOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">关键字:</el-col>
        <el-col :span="4">
          <el-input style="width:90%" v-model="keyword" size="small" :maxlength="50"></el-input>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <div style="position:relative;top:-40px;">
          <el-button @click="exporttxt" size="small" type="primary">导出</el-button>
        </div>
      </div>
      <el-table
        style="margin-top:10px;"
        :data="inquiredata"
        :fit=true
        border>
        <el-table-column
          prop="letterNo"
          label="函件编号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="letterType"
          label="函件类型"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="letterName"
          label="函件名称"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="item in scope.row.letterAttachment">
              <a style="text-decoration:underline;color:#409eff;cursor:pointer;" @click="downloadLetter(item)">{{item.fileName}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="security"
          label="证券代码及简称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="clueName"
          label="线索名称"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <a style="text-decoration:underline;color:#409eff;cursor:pointer;" @click="openClueReport(scope.row)">{{scope.row.clueName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="clueBranch"
          label="线索分类"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="clueType"
          label="线索类型"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="clueDesc"
          label="线索描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="needReport"
          label="是否上报"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="clueFileName"
          label="线索会商纪要"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="item in scope.row.clueMeetingSummary">
              <a style="text-decoration:underline;color:#409eff;cursor:pointer;"
                 @click="downloadclueMeetingSummary(item)">{{item.fileName}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="drafter"
          label="拟稿人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="startDate"
          label="创建日期"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="finishDate"
          label="完成日期"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sendDate"
          label="上报日期"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sendPerson"
          label="发函人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sourceTypeText"
          label="线索来源分类"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-col :span="24" style="margin-top:10px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pagenum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalpage"
          @current-change="currentpagination"
          @size-change="sizepagination">
        </el-pagination>
      </el-col>
    </el-card>
    <el-dialog
      title=""
      :visible.sync="dialogFormVisble"
      center
      width="700px">
      <el-form>
        <el-form-item label="导出字段：" :label-width="formLabelWidth">
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked0">函件编号</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked1">函件类型</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked2">函件名称</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked3">证券代码及简称</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked4">线索名称</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked5">线索分类</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked6">线索类型</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked7">线索描述</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked8">是否上报</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked9">线索会商纪要</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked10">拟稿人</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked11">创建日期</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked12">完成日期</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked13">上报日期</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked14">发函人</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked15">状态</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked16">线索来源分类</el-checkbox>
            </el-col>
            <el-checkbox v-model="checked17" @change="selectHeader">全选</el-checkbox>
          </el-row>
        </el-form-item>
        <el-form-item label="导出格式：" :label-width="formLabelWidth">
          <el-radio v-model="typeradio" label="0">EXCEL</el-radio>
          <el-radio v-model="typeradio" label="1">CSV</el-radio>
        </el-form-item>
        <el-form-item label="导出范围：" :label-width="formLabelWidth">
          <el-radio v-model="rangeradio" label="0" @change="dispalynumber">全部</el-radio>
          <el-radio v-model="rangeradio" label="1" @change="dispalynumber">当前页</el-radio>
          <span style="margin-left:30px">前</span>
          <el-input v-model="number" :disabled="disabledNumber" placeholder="" size="small"
                    style="width:15%"></el-input>
          <span>条</span><span style="margin-left:50px">共{{totalpage}}条</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="veryfy">导 出</el-button>
        <el-button type="primary" size="small" @click="cancleVeryfy">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import StockCodeQuery from '../../common/StockCodeQuery'
  import SelectorDealer from '@/components/common/SelectorDealer'
  import moment from 'moment'
  import {
    postReportInquirelist,
    clueReportdraftperson,
    clueReportsendletterperson,
    clueReportletterNumberMethod
  } from '../../../service/superviseTask/index.js'

  export default {
    components: {
      StockCodeQuery,
      SelectorDealer
    },
    data () {
      return {
        keyword: '',
        statusOption: [{
          value: '0',
          label: '创建'
        }, {
          value: '1',
          label: '实时组长审核'
        }, {
          value: '2',
          label: '分配'
        }, {
          value: '3',
          label: '拟稿'
        }, {
          value: '4',
          label: '复核'
        }, {
          value: '5',
          label: '线索组长审核'
        }, {
          value: '6',
          label: '部门审批'
        }, {
          value: '7',
          label: '所领导审批'
        }, {
          value: '8',
          label: '拟稿人确认'
        }, {
          value: '9',
          label: '发函'
        }, {
          value: '10',
          label: '办结'
        }],
        clueStyleOption: [{
          value: '1',
          label: '调查类'
        }, {
          value: '0',
          label: '关注类'
        }],
        clueTypeOption: [{
          value: '内幕交易',
          label: '内幕交易'
        }, {
          value: '市场操纵',
          label: '市场操纵'
        }, {
          value: '利益输送—股票',
          label: '利益输送—股票'
        }, {
          value: '利益输送—债券',
          label: '利益输送—债券'
        }, {
          value: '超比例持股',
          label: '超比例持股'
        }, {
          value: '老鼠仓',
          label: '老鼠仓'
        }, {
          value: '短线交易',
          label: '短线交易'
        }, {
          value: '其它—股票',
          label: '其它—股票'
        }, {
          value: '其它—债券',
          label: '其它—债券'
        }],
        isReportOption: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        letterStyleOption: [{
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
        }],
        clueSourceOption: [{
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
        }],
        disabledNumber: true,
        letterNumberOption: [],
        draftPersonOption: [],
        sendLetterPersonOption: [],
        clueStyle: '',
        clueType: '',
        isReport: '',
        letterStyle: '',
        letterNumber: '',
        draftPerson: '',
        sendLetterPerson: '',
        status: '',
        clueSource: '',
        inquiredata: [],
        currentPage: 1,
        pagenum: 10,
        totalpage: 0,
        checked0: false,
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        checked6: false,
        checked7: false,
        checked8: false,
        checked9: false,
        checked10: false,
        checked11: false,
        checked12: false,
        checked13: false,
        checked14: false,
        checked15: false,
        checked16: false,
        checked17: false,
        tableOptions: [],
        dimensionQueryForm: {
          reportbeginDate: '',
          reportendDate: '',
          createbeginDate: '',
          createendDate: '',
        },
        formLabelWidth: '120px',
        towhom: 'xnli',
        dialogFormVisble: false,
        rangeradio: '0',
        typeradio: '0',
        number: '',
        commonData: {
          disabled: false,
          stockCode: ''
        },
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() >= Date.now() - 8.46e6
          }
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.dimensionQueryForm.createbeginDate).getTime() - 3600 * 1000 * 24
          }
        },
      }
    },
    mounted () {
      this.currentPage = 1
      this.pagenum = 10
      this.dimensionQueryForm.reportbeginDate = moment().subtract(7, 'days').calendar()
      this.dimensionQueryForm.reportbeginDate = this.dimensionQueryForm.reportbeginDate.split('/').join('-')
      this.dimensionQueryForm.reportendDate = moment().format('YYYY-MM-DD')
      this.getAllData()
    },
    methods: {
      getApplyPerson (code, name) {
        this.draftPerson = name
      },
      getApplyPerson2 (code, name) {
        this.sendLetterPerson = name
      },
      inquiry () {
        this.currentPage = 1
        this.pagenum = 10
        this.getAllData()
      },
      getAllData () {
        let createTimeStart = ''
        let createTimeEnd = ''
        let sendDateStart = ''
        let sendDateEnd = ''
        if (!this.dimensionQueryForm.reportbeginDate == false) {
          sendDateStart = this.dimensionQueryForm.reportbeginDate.split('-')[0] + this.dimensionQueryForm.reportbeginDate.split('-')[1] + this.dimensionQueryForm.reportbeginDate.split('-')[2]
        }
        if (!this.dimensionQueryForm.reportendDate == false) {
          sendDateEnd = this.dimensionQueryForm.reportendDate.split('-')[0] + this.dimensionQueryForm.reportendDate.split('-')[1] + this.dimensionQueryForm.reportendDate.split('-')[2]
        }
        if (!this.dimensionQueryForm.createbeginDate == false) {
          createTimeStart = this.dimensionQueryForm.createbeginDate.split('-')[0] + this.dimensionQueryForm.createbeginDate.split('-')[1] + this.dimensionQueryForm.createbeginDate.split('-')[2]
        }
        if (!this.dimensionQueryForm.createendDate == false) {
          createTimeEnd = this.dimensionQueryForm.createendDate.split('-')[0] + this.dimensionQueryForm.createendDate.split('-')[1] + this.dimensionQueryForm.createendDate.split('-')[2]
        }
        let data = {
          'keyword': this.keyword,
          'sendDateStart': sendDateStart,
          'sendDateEnd': sendDateEnd,
          'startDateStart': createTimeStart,
          'startDateEnd': createTimeEnd,
          'sendPerson': this.sendLetterPerson,
          'drafter': this.draftPerson,
          'letterNo': this.letterNumber,
          'letterType': this.letterStyle,
          'needReport': this.isReport,
          'status': this.status,
          'clueType': this.clueType,
          'clueBranch': this.clueStyle,
          'sourceType': this.clueSource,
          'security': this.commonData.stockCode,
          'pageIndex': this.currentPage,
          'pageRows': this.pagenum
        }
        postReportInquirelist(JSON.stringify(data)).then((resp) => {
          this.inquiredata = resp.pageContent
          this.totalpage = resp.totalNum
          for (let i = 0; i < this.inquiredata.length; i++) {
            switch (this.inquiredata[i].clueBranch) {
              case '0':
                this.inquiredata[i].clueBranch = '关注类'
                break
              case '1':
                this.inquiredata[i].clueBranch = '调查类'
                break
            }
            let clueBranch = []
            for (let j = 0; j < this.inquiredata[i].clueType.split(',').length; j++) {
              switch (this.inquiredata[i].clueType.split(',')[j]) {
                case '0':
                  clueBranch.push('内幕交易')
                  break
                case '1':
                  clueBranch.push('市场操纵')
                  break
                case '2':
                  clueBranch.push('利益输送—股票')
                  break
                case '3':
                  clueBranch.push('利益输送—债券')
                  break
                case '4':
                  clueBranch.push('超比例持股')
                  break
                case '5':
                  clueBranch.push('老鼠仓')
                  break
                case '6':
                  clueBranch.push('短线交易')
                  break
                case '7':
                  clueBranch.push('其它—股票')
                  break
                case '8':
                  clueBranch.push('其它—债券')
                  break
              }
            }
            this.inquiredata[i].clueType = clueBranch.join(',')
            switch (this.inquiredata[i].needReport) {
              case '0':
                this.inquiredata[i].needReport = '否'
                break
              case '1':
                this.inquiredata[i].needReport = '是'
                break
            }
            switch (this.inquiredata[i].status) {
              case 0:
                this.inquiredata[i].status = '创建'
                break
              case 1:
                this.inquiredata[i].status = '实时组长审核'
                break
              case 2:
                this.inquiredata[i].status = '分配'
                break
              case 3:
                this.inquiredata[i].status = '拟稿'
                break
              case 4:
                this.inquiredata[i].status = '复核'
                break
              case 5:
                this.inquiredata[i].status = '线索组长审核'
                break
              case 6:
                this.inquiredata[i].status = '部门审批'
                break
              case 7:
                this.inquiredata[i].status = '所领导审批'
                break
              case 8:
                this.inquiredata[i].status = '拟稿人确认'
                break
              case 9:
                this.inquiredata[i].status = '发函'
                break
              case 10:
                this.inquiredata[i].status = '办结'
                break
            }
          }
        })
      },
      downloadLetter (letterAttachment) {
        window.location.href = this.gfnGetDownloadFileUrl(letterAttachment.fileId, letterAttachment.fileName)
      },
      downloadclueMeetingSummary (clueMeetingSummary) {
        window.location.href = this.gfnGetDownloadFileUrl(clueMeetingSummary.fileId, clueMeetingSummary.fileName)
      },
      openClueReport (row) {
        window.open(`#/clueReportForm?operate=${'1'}&taskId=${''}&instanceId=${row.infoId}`)
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.dimensionQueryForm.createbeginDate = ''
        this.dimensionQueryForm.createendDate = ''
        this.dimensionQueryForm.reportbeginDate = ''
        this.dimensionQueryForm.reportendDate = ''
        this.sendLetterPerson = ''
        this.draftPerson = ''
        this.letterNumber = ''
        this.letterStyle = ''
        this.isReport = ''
        this.status = ''
        this.clueType = ''
        this.clueStyle = ''
        this.clueSource = ''
        this.commonData.stockCode = ''
        this.keyword = ''
      },
      exporttxt () {
        this.dialogFormVisble = true
      },
      selectHeader () {
        if (this.checked17 === true) {
          this.checked0 = true
          this.checked1 = true
          this.checked2 = true
          this.checked3 = true
          this.checked4 = true
          this.checked5 = true
          this.checked6 = true
          this.checked7 = true
          this.checked8 = true
          this.checked9 = true
          this.checked10 = true
          this.checked11 = true
          this.checked12 = true
          this.checked13 = true
          this.checked14 = true
          this.checked15 = true
          this.checked16 = true
        } else {
          this.checked0 = false
          this.checked1 = false
          this.checked2 = false
          this.checked3 = false
          this.checked4 = false
          this.checked5 = false
          this.checked6 = false
          this.checked7 = false
          this.checked8 = false
          this.checked9 = false
          this.checked10 = false
          this.checked11 = false
          this.checked12 = false
          this.checked13 = false
          this.checked14 = false
          this.checked15 = false
          this.checked16 = false
        }
      },
      veryfy () {
        /* 判断是否选择导出字段 */
        let checkList = [this.checked0, this.checked1, this.checked2, this.checked3, this.checked4, this.checked5, this.checked6, this.checked7, this.checked8, this.checked9, this.checked10, this.checked11, this.checked12, this.checked13, this.checked14, this.checked15, this.checked16]
        if (checkList.indexOf(true) === -1) {
          this.$message.error('请至少选择一个导出字段')
          return
        }
        let pageIndex = this.currentPage
        let pageRows = this.pagenum
        let params = {}
        if (this.rangeradio == '0') {
          pageIndex = ''
          pageRows = ''
          let createTimeStart = ''
          let createTimeEnd = ''
          let sendDateStart = ''
          let sendDateEnd = ''
          if (!this.dimensionQueryForm.reportbeginDate == false) {
            sendDateStart = this.dimensionQueryForm.reportbeginDate.split('-')[0] + this.dimensionQueryForm.reportbeginDate.split('-')[1] + this.dimensionQueryForm.reportbeginDate.split('-')[2]
          }
          if (!this.dimensionQueryForm.reportendDate == false) {
            sendDateEnd = this.dimensionQueryForm.reportendDate.split('-')[0] + this.dimensionQueryForm.reportendDate.split('-')[1] + this.dimensionQueryForm.reportendDate.split('-')[2]
          }
          if (!this.dimensionQueryForm.createbeginDate == false) {
            createTimeStart = this.dimensionQueryForm.createbeginDate.split('-')[0] + this.dimensionQueryForm.createbeginDate.split('-')[1] + this.dimensionQueryForm.createbeginDate.split('-')[2]
          }
          if (!this.dimensionQueryForm.createendDate == false) {
            createTimeEnd = this.dimensionQueryForm.createendDate.split('-')[0] + this.dimensionQueryForm.createendDate.split('-')[1] + this.dimensionQueryForm.createendDate.split('-')[2]
          }
          params = {
            'sendDateStart': sendDateStart,
            'sendDateEnd': sendDateEnd,
            'startDateStart': createTimeStart,
            'startDateEnd': createTimeEnd,
            'sendPerson': this.sendLetterPerson,
            'drafter': this.draftPerson,
            'letterNo': this.letterNumber,
            'letterType': this.letterStyle,
            'needReport': this.isReport,
            'status': this.status,
            'clueType': this.clueType,
            'clueBranch': this.clueStyle,
            'sourceType': this.clueSource,
            'security': this.commonData.stockCode,
            'pageIndex': pageIndex,
            'pageRows': pageRows
          }
        } else if (this.rangeradio == '1' && (!this.number)) {
          pageIndex = this.currentPage
          pageRows = this.pagenum
          let createTimeStart = ''
          let createTimeEnd = ''
          let sendDateStart = ''
          let sendDateEnd = ''
          if (!this.dimensionQueryForm.reportbeginDate == false) {
            sendDateStart = this.dimensionQueryForm.reportbeginDate.split('-')[0] + this.dimensionQueryForm.reportbeginDate.split('-')[1] + this.dimensionQueryForm.reportbeginDate.split('-')[2]
          }
          if (!this.dimensionQueryForm.reportendDate == false) {
            sendDateEnd = this.dimensionQueryForm.reportendDate.split('-')[0] + this.dimensionQueryForm.reportendDate.split('-')[1] + this.dimensionQueryForm.reportendDate.split('-')[2]
          }
          if (!this.dimensionQueryForm.createbeginDate == false) {
            createTimeStart = this.dimensionQueryForm.createbeginDate.split('-')[0] + this.dimensionQueryForm.createbeginDate.split('-')[1] + this.dimensionQueryForm.createbeginDate.split('-')[2]
          }
          if (!this.dimensionQueryForm.createendDate == false) {
            createTimeEnd = this.dimensionQueryForm.createendDate.split('-')[0] + this.dimensionQueryForm.createendDate.split('-')[1] + this.dimensionQueryForm.createendDate.split('-')[2]
          }
          params = {
            'sendDateStart': sendDateStart,
            'sendDateEnd': sendDateEnd,
            'startDateStart': createTimeStart,
            'startDateEnd': createTimeEnd,
            'sendPerson': this.sendLetterPerson,
            'drafter': this.draftPerson,
            'letterNo': this.letterNumber,
            'letterType': this.letterStyle,
            'needReport': this.isReport,
            'status': this.status,
            'clueType': this.clueType,
            'clueBranch': this.clueStyle,
            'sourceType': this.clueSource,
            'security': this.commonData.stockCode,
            'pageIndex': pageIndex,
            'pageRows': pageRows
          }
        } else {
          let start = (this.currentPage - 1) * this.pagenum
          let createTimeStart = ''
          let createTimeEnd = ''
          let sendDateStart = ''
          let sendDateEnd = ''
          if (!this.dimensionQueryForm.reportbeginDate == false) {
            sendDateStart = this.dimensionQueryForm.reportbeginDate.split('-')[0] + this.dimensionQueryForm.reportbeginDate.split('-')[1] + this.dimensionQueryForm.reportbeginDate.split('-')[2]
          }
          if (!this.dimensionQueryForm.reportendDate == false) {
            sendDateEnd = this.dimensionQueryForm.reportendDate.split('-')[0] + this.dimensionQueryForm.reportendDate.split('-')[1] + this.dimensionQueryForm.reportendDate.split('-')[2]
          }
          if (!this.dimensionQueryForm.createbeginDate == false) {
            createTimeStart = this.dimensionQueryForm.createbeginDate.split('-')[0] + this.dimensionQueryForm.createbeginDate.split('-')[1] + this.dimensionQueryForm.createbeginDate.split('-')[2]
          }
          if (!this.dimensionQueryForm.createendDate == false) {
            createTimeEnd = this.dimensionQueryForm.createendDate.split('-')[0] + this.dimensionQueryForm.createendDate.split('-')[1] + this.dimensionQueryForm.createendDate.split('-')[2]
          }
          params = {
            'sendDateStart': sendDateStart,
            'sendDateEnd': sendDateEnd,
            'startDateStart': createTimeStart,
            'startDateEnd': createTimeEnd,
            'sendPerson': this.sendLetterPerson,
            'drafter': this.draftPerson,
            'letterNo': this.letterNumber,
            'letterType': this.letterStyle,
            'needReport': this.isReport,
            'status': this.status,
            'clueType': this.clueType,
            'clueBranch': this.clueStyle,
            'sourceType': this.clueSource,
            'security': this.commonData.stockCode,
            'pageIndex': '',
            'pageRows': '',
            'start': (this.currentPage - 1) * this.pagenum,
            'limit': parseInt(this.number)
          }
        }
        this.dialogFormVisble = false
        this.tableOptions = []
        let fileType = ''
        if (this.typeradio === '0') {
          fileType = 'excel'
        } else {
          fileType = 'csv'
        }
        this.tableOptions.push({label: '函件编号', field: 'letterNo', width: '120', align: 'left', isShow: this.checked0},
          {label: '函件类型', field: 'letterType', width: '120', align: 'left', isShow: this.checked1},
          {label: '函件名称', field: 'letterName', width: '120', align: 'left', isShow: this.checked2},
          {label: '证券代码及简称', field: 'security', width: '120', align: 'left', isShow: this.checked3},
          {label: '线索名称', field: 'clueName', width: '120', align: 'left', isShow: this.checked4},
          {label: '线索分类', field: 'clueBranch', width: '120', align: 'left', isShow: this.checked5},
          {label: '线索类型', field: 'clueTypeText', width: '120', align: 'left', isShow: this.checked6},
          {label: '线索描述', field: 'clueDesc', width: '120', align: 'left', isShow: this.checked7},
          {label: '是否上报', field: 'needReport', width: '120', align: 'left', isShow: this.checked8},
          {label: '线索会商纪要', field: 'clueFileName', width: '120', align: 'left', isShow: this.checked9},
          {label: '拟稿人', field: 'drafter', width: '120', align: 'left', isShow: this.checked10},
          {label: '创建日期', field: 'startDate', width: '120', align: 'left', isShow: this.checked11},
          {label: '完成日期', field: 'finishDate', width: '120', align: 'left', isShow: this.checked12},
          {label: '上报日期', field: 'sendDate', width: '120', align: 'left', isShow: this.checked13},
          {label: '发函人', field: 'sendPerson', width: '120', align: 'left', isShow: this.checked14},
          {label: '状态', field: 'status', width: '120', align: 'left', isShow: this.checked15},
          {label: '线索来源分类', field: 'sourceTypeText', width: '120', align: 'left', isShow: this.checked16})
        params['tableColumns'] = this.tableOptions
        params['fileType'] = fileType
        this.gfnExportFileWithForm('/bpm/history/crpprocess/report/export', params)
      },
      letterNumberMethod (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            clueReportletterNumberMethod(query).then((resp) => {
              this.letterNumberOption = []
              for (let item of resp) {
                this.letterNumberOption.push({
                  value: item,
                  label: item,
                })
              }
            })
          }, 200)

        } else {
          this.issendletterperson = []
        }
      },
      sendletterpersonMethod (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            clueReportsendletterperson(query).then((resp) => {
              this.sendLetterPersonOption = []
              for (let item of resp) {
                this.sendLetterPersonOption.push({
                  value: item,
                  label: item,
                })
              }
            })
          }, 200)

        } else {
          this.issendletterperson = []
        }
      },
      createpersonMethod (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            clueReportdraftperson(query).then((resp) => {
              this.draftPersonOption = []
              for (let item of resp) {
                this.draftPersonOption.push({
                  value: item,
                  label: item,
                })
              }
            })
          }, 200)

        } else {
          this.iscreateperson = []
        }
      },
      addCreatePerson (val) {
        this.createperson = val
      },
      // selectrangeradio(){
      //   this.rangeradio=''
      // },
      dispalynumber () {
        if (this.rangeradio === '1') {
          this.disabledNumber = false
        } else {
          this.disabledNumber = true
          this.number = ''
        }
      },
      cancleVeryfy () {
        this.dialogFormVisble = false
      },

      currentpagination (val) {
        this.currentPage = val
        this.getAllData()
      },
      sizepagination (val) {
        this.pagenum = val
        this.getAllData()
      },
    }
  }
</script>
<style>
</style>
