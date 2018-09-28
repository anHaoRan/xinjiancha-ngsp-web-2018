<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="info" size="small" style="float:right;" @click="clearAllData">清空</el-button>
        <el-button type="primary" size="small" style="float:right;" @click="inquiry">查询</el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">账户代码:</el-col>
        <el-col :span="4">
          <el-input style="width:90%" v-model="accountcode" placeholder="" size="small"></el-input>
        </el-col>
        <el-col :span="2" style="margin-top:8px">一码通:</el-col>
        <el-col :span="4">
          <el-input style="width:90%" v-model="Ecode" placeholder="" size="small"></el-input>
        </el-col>
        <el-col :span="2" style="margin-top:8px">会员名称:</el-col>
        <el-col :span="4">
          <!-- <el-input style="width:90%" v-model="membername" placeholder="" size="small"></el-input> -->
          <el-select
            v-focus="membernameMethod"
            ref="selfSelectRef"
            filterable
            remote
            v-model="membername"
            :clearable="true"
            placeholder="全部"
            size="small"
            style="width: 90%;"
            :remote-method="membernameMethod"
            v-selectLoadMore="handleLoadSelectMoreMemberName">
            <el-option
              v-for="item in ismembername"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">营业部名称:</el-col>
        <el-col :span="4">
          <!-- <el-input style="width:90%" v-model="departmentname" placeholder="" size="small"></el-input> -->
          <el-select
            filterable remote v-model="departmentname" :clearable="true" placeholder="全部"
            size="small"
            v-focus="departmentnameMethod"
            style="width: 90%;" :remote-method="departmentnameMethod"
            v-selectLoadMore="handleLoadSelectMore">
            <el-option
              v-for="item in isdepartmentname"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">证券代码及简称:</el-col>
        <el-col :span="4">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode"
                            style="width: 90%;"></stock-code-query>
        </el-col>
        <el-col :span="2" style="margin-top:8px">产品账户:</el-col>
        <el-col :span="4">
          <el-select collapse-tags v-bind:multiple="true" v-model="investorClassify" placeholder="全部"
                     size="small"
                     style="width: 90%;">
            <el-option
              v-for="item in isinvestorClassify"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">调查事项:</el-col>
        <el-col :span="4">
          <el-select collapse-tags v-bind:multiple="true" v-model="investigationMatter" placeholder="全部"
                     size="small"
                     style="width: 90%;" @change="changetype1">
            <el-option
              v-for="item in isinvestigationMatter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">异常行为:</el-col>
        <el-col :span="4">
          <el-select collapse-tags v-bind:multiple="true" v-model="abnormalBehave" placeholder="全部"
                     size="small"
                     style="width: 90%;">
            <el-option
              v-for="item in isabnormalBehave"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">创建人:</el-col>
        <el-col :span="4">
          <selector-dealer
            style="width: 90%;"
            ref="hisaSelectorDealers"
            @node-click="getApplyPerson"
            :selectPerson="createperson"></selector-dealer>
        </el-col>
        <el-col :span="2" style="margin-top:8px">创建日期:</el-col>
        <el-col :span="12">
          <el-col :span="10" style="width:30%">
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
          <el-col :span="10" style="width:30%">
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
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">发函人:</el-col>
        <el-col :span="4">
          <selector-dealer
            style="width: 90%;"
            ref="hisaSelectorDealers2"
            @node-click="getApplyPerson2"
            :selectPerson="sendletterperson"></selector-dealer>
        </el-col>
        <el-col :span="2" style="margin-top:8px">发函日期:</el-col>
        <el-col :span="12">
          <el-col :span="10" style="width:30%">
            <el-date-picker
              v-model="dimensionQueryForm.letterbeginDate"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="startpickerOption"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
          <el-col :span="1" style="margin:8px 1% 0">至</el-col>
          <el-col :span="10" style="width:30%">
            <el-date-picker
              v-model="dimensionQueryForm.letterendDate"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="endpickerOption"
              size="small"
              style="width:100%">
            </el-date-picker>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">状态:</el-col>
        <el-col :span="4">
          <el-select collapse-tags v-bind:multiple="true" v-model="status" placeholder="全部" size="small"
                     style="width: 90%;">
            <el-option
              v-for="item in isstatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">关键字:</el-col>
        <el-col :span="4">
          <el-input style="width:90%" v-model="keyword" placeholder="" size="small"></el-input>
        </el-col>
      </el-row>
    </el-card>
    <div class="table-container">
      <common-table
        :showExportBtn="true"
        :loading="loading"
        :columns="columns[1]"
        :tableData.sync="tableData"
        :pagination.sync="pagination"
        currentTableIndex="查询结果"
        @updatePagination="updatePagination"
      ></common-table>
    </div>
    <!--<el-card>
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
          prop="warningNo"
          label="编号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <a style="text-decoration:underline;color:#409eff;cursor:pointer;"
               @click="historyrecord(scope.row)">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="securityid"
          label="证券代码及简称"
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
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="logs"
          label="事项描述"
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
          prop="accountName"
          label="账户名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="accountCode"
          label="账户代码"
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
          prop="proposer"
          label="创建人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="startDate"
          label="创建日期"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sendPerson"
          label="发函人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sendDate"
          label="发函日期"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="attachment"
          label="发函附件"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="item in scope.row.attachment">
              <a style="text-decoration:underline;color:#409eff;cursor:pointer;"
                 @click="downloadfile(item)">{{item.fileName}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="accttype"
          label="投资者分类"
          :formatter="formatAccttype"
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
    </el-card>-->
    <el-dialog
      title=""
      :visible.sync="dialogFormVisble"
      center
      width="700px">
      <el-form>
        <el-form-item label="导出字段：" :label-width="formLabelWidth">
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked0">编号</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked1">标题</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked5">证券代码及简称</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked2">调查事项</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked3">异常行为</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked4">事项描述</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked13">一码通</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked14">产品账户</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked15">账户名称</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked16">账户代码</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked17">会员名称</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked18">营业部名称</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked6">创建人</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked7">创建日期</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked8">发函人</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked9">发函日期</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked10">发函附件</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked11">状态</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked19">投资者分类</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked12" @change="selectHeader">全选</el-checkbox>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="导出格式：" :label-width="formLabelWidth">
          <el-radio v-model="typeradio" label="0">EXCEL</el-radio>
          <el-radio v-model="typeradio" label="1">CSV</el-radio>
        </el-form-item>
        <el-form-item label="导出范围：" :label-width="formLabelWidth">
          <el-radio v-model="rangeradio" label="0" @change="dispalynumber">全部</el-radio>
          <el-radio v-model="rangeradio" label="1">当前页</el-radio>
          <span style="margin-left:30px">前</span>
          <el-input v-model="number" placeholder="" size="small" style="width:15%"></el-input>
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
  import SelectLazyMultiple from '@/components/common/SelectLazyMultiple'
  import SelectorDealer from '@/components/common/SelectorDealer'
  import moment from 'moment'
  import mixin from '../mixin'
  import {columns} from '../component/columns'
  import {
    postAbnormalAccountlist,
    createperson,
    sendletterperson,
    departmentname,
    membername,
  } from '../../../service/superviseTask/index.js'

  export default {
    components: {
      SelectLazyMultiple,
      StockCodeQuery,
      SelectorDealer
    },
    mixins: [mixin],
    data () {
      return {
        columns,
        isinvestigationMatter: [
          {
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
          }
        ],
        isabnormalBehave: [],
        isstatus: [
          {
            value: '0',
            label: '创建中'
          }, {
            value: '1',
            label: '审核中'
          }, {
            value: '2',
            label: '分配中'
          }, {
            value: '3',
            label: '待发函'
          }, {
            value: '4',
            label: '待回函'
          }, {
            value: '5',
            label: '待归档'
          }, {
            value: '6',
            label: '已归档'
          }],
        isinvestorClassify: [
          {
            value: '是',
            label: '是'
          }, {
            value: '否',
            label: '否'
          }
        ],
        accountcode: '',
        Ecode: '',
        membername: '',
        departmentname: '',
        investorClassify: [],
        investigationMatter: [],
        abnormalBehave: [],
        createperson: '',
        sendletterperson: '',
        status: [],
        iscreateperson: [],
        issendletterperson: [],
        isdepartmentname: [],
        ismembername: [],
        index1: 1,
        index2: 1,
        isquery1: '',
        isquery2: '',
        formLabelWidth: '120px',
        towhom: '',
        dialogFormVisble: false,
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
        checked18: false,
        checked19: false,
        typeradio: '0',
        rangeradio: '0',
        number: '',
        tableOptions: [{label: '编号', field: 'warningNo', width: '120', align: 'left'},
          {label: '标题', field: 'title', width: '120', align: 'left'},
          {label: '证券代码及简称', field: 'securityid', width: '120', align: 'left'},
          {label: '调查事项', field: 'investigation', width: '120', align: 'left'},
          {label: '异常行为', field: 'abnormalBehav', width: '120', align: 'left'},
          {label: '事项描述', field: 'logs', width: '120', align: 'left'},

          {label: '一码通', field: 'oneword', width: '120', align: 'left'},
          {label: '产品账户', field: 'assortment', width: '120', align: 'left'},
          {label: '账户名称', field: 'accountName', width: '120', align: 'left'},
          {label: '账户代码', field: 'accountCode', width: '120', align: 'left'},
          {label: '会员名称', field: 'member', width: '120', align: 'left'},
          {label: '营业部名称', field: 'salepart', width: '120', align: 'left'},

          {label: '创建人', field: 'proposer', width: '120', align: 'left'},
          {label: '创建日期', field: 'startDate', width: '120', align: 'left'},
          {label: '发函人', field: 'sendPerson', width: '120', align: 'left'},
          {label: '发函日期', field: 'sendDate', width: '120', align: 'left'},
          {label: '发函附件', field: 'tranidno', width: '120', align: 'left'},
          {label: '状态', field: 'status', width: '120', align: 'left'}],
        keyword: '',
        currentPage: 1,
        pagenum: 10,
        totalpage: 0,
        inquiredata: [],
        dimensionQueryForm: {
          createbeginDate: '',
          createendDate: '',
          letterbeginDate: '',
          letterendDate: '',
        },
        commonData: {
          disabled: false,
          stockCode: [],
          multiple: true
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
        loading: false,
        tableData: [],
        pagination: {
          pageIndex: 1,
          pageRows: 10,
          total: 0
        }
      }
    },
    mounted () {
      this.dimensionQueryForm.createbeginDate = moment().subtract(7, 'days').calendar()
      this.dimensionQueryForm.createbeginDate = this.dimensionQueryForm.createbeginDate.split('/').join('-')
      this.dimensionQueryForm.createendDate = moment().format('YYYY-MM-DD')
      this.getAllData()
    },
    methods: {
      updatePagination (pagination) {
        pagination['pageIndex'] = pagination['currentPage']
        pagination['pageRows'] = pagination['pageSizeNumber']
        this.getAllData()
      },
      getApplyPerson (code, name) {
        this.createperson = name
      },
      getApplyPerson2 (code, name) {
        this.sendletterperson = name
      },
      inquiry () {
        this.currentPage = 1
        this.pagenum = 10
        this.getAllData()
      },
      historyrecord (row) {
        // window.open(`#/finishform?taskId=${''}&instanceId=${row.infoId}&isoperateCheck=${''}&activityName=${''}`)
        window.open(`#/selfSupervisionFormPage?taskId=''&instanceId=${row.infoId}&operate=1&isNewTab=true`)
      },
      downloadfile (attachment) {
        window.location.href = this.gfnGetDownloadFileUrl(attachment.fileId, attachment.fileName)
      },
      getAllData () {
        let combine = this.dealCascaderParams(this.investigationMatter, this.abnormalBehave)
        let proposer = []
        let sendPerson = []
        if (!this.createperson == false) {
          proposer = this.createperson.split(',')
        }
        if (!this.sendletterperson == false) {
          sendPerson = this.sendletterperson.split(',')
        }
        let createTimeStart = ''
        let createTimeEnd = ''
        if (!this.dimensionQueryForm.createbeginDate == false) {
          createTimeStart = this.dimensionQueryForm.createbeginDate + ' 00:00:00'
        }
        if (!this.dimensionQueryForm.createendDate == false) {
          createTimeEnd = this.dimensionQueryForm.createendDate + ' 23:59:59'
        }
        let securityId = this.commonData.stockCode.map(v => {
          return v.split(' ')[0]
        })
        let data = {
          'combine': combine,
          'keyword': this.keyword,
          'accountCode': this.accountcode,
          'oneword': this.Ecode,
          'member': this.membername.split(' ')[1],
          'salepart': this.departmentname.split(' ')[1],
          'securityId': securityId,
          'assortment': this.investorClassify,
          'investigation': this.investigationMatter,
          'abnormalBehav': this.abnormalBehave,
          'proposer': proposer,
          'createTimeStart': createTimeStart,
          'createTimeEnd': createTimeEnd,
          'sendTimeStart': this.dimensionQueryForm.letterbeginDate,
          'sendTimeEnd': this.dimensionQueryForm.letterendDate,
          'sendPerson': sendPerson,
          'status': this.status,
          'pageIndex': this.currentPage,
          'pageRows': this.pagenum
        }
        postAbnormalAccountlist(JSON.stringify(data)).then((resp) => {
          this.tableData = resp.pageContent
          this.pagination.total = resp.totalNum
        })
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.dimensionQueryForm.createbeginDate = ''
        this.dimensionQueryForm.createendDate = ''
        this.dimensionQueryForm.letterbeginDate = ''
        this.dimensionQueryForm.letterendDate = ''
        this.investorClassify = []
        this.investigationMatter = []
        this.abnormalBehave = []
        this.createperson = ''
        this.sendletterperson = ''
        this.status = []
        this.keyword = ''
        this.commonData.stockCode = []
        this.accountcode = ''
        this.Ecode = ''
        this.membername = ''
        this.departmentname = ''
        this.isabnormalBehave = []
      },
      handleExport () {
        this.dialogFormVisble = true
      },
      selectHeader () {
        if (this.checked12 === true) {
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
          this.checked13 = true
          this.checked14 = true
          this.checked15 = true
          this.checked16 = true
          this.checked17 = true
          this.checked18 = true
          this.checked19 = true
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
          this.checked13 = false
          this.checked14 = false
          this.checked15 = false
          this.checked16 = false
          this.checked17 = false
          this.checked18 = false
          this.checked19 = false
        }
      },
      veryfy () {
        /* 判断是否选择导出字段 */
        let checkList = [this.checked0, this.checked1, this.checked2, this.checked3, this.checked4, this.checked5, this.checked6, this.checked7, this.checked8, this.checked9, this.checked10, this.checked11, this.checked12, this.checked13, this.checked14, this.checked15, this.checked16, this.checked17, this.checked18, this.checked19]
        if (checkList.indexOf(true) === -1) {
          this.$message.error('请至少选择一个导出字段')
          return
        }
        let pageIndex = this.currentPage
        let pageRows = this.pagenum
        let params = {}
        let proposer = []
        let sendPerson = []
        if (!this.createperson == false) {
          proposer = this.createperson.split(',')
        }
        if (!this.sendletterperson == false) {
          sendPerson = this.sendletterperson.split(',')
        }
        let createTimeStart = ''
        let createTimeEnd = ''
        if (!this.dimensionQueryForm.createbeginDate == false) {
          createTimeStart = this.dimensionQueryForm.createbeginDate + ' 00:00:00'
        }
        if (!this.dimensionQueryForm.createendDate == false) {
          createTimeEnd = this.dimensionQueryForm.createendDate + ' 23:59:59'
        }
        let securityId = this.commonData.stockCode.map(v => {
          return v.split(' ')[0]
        })
        if (this.rangeradio == '0') {
          pageIndex = ''
          pageRows = ''
          params = {
            'accountCode': this.accountcode,
            'oneword': this.Ecode,
            'member': this.membername.split(' ')[1],
            'salepart': this.departmentname.split(' ')[1],
            'securityId': securityId,
            'assortment': this.investorClassify,
            'investigation': this.investigationMatter,
            'abnormalBehav': this.abnormalBehave,
            'proposer': proposer,
            'createTimeStart': createTimeStart,
            'createTimeEnd': createTimeEnd,
            'sendTimeStart': this.dimensionQueryForm.letterbeginDate,
            'sendTimeEnd': this.dimensionQueryForm.letterendDate,
            'sendPerson': sendPerson,
            'status': this.status,
            'pageIndex': pageIndex,
            'pageRows': pageRows
          }
        } else if (this.rangeradio == '1' && (!this.number)) {
          pageIndex = this.currentPage
          pageRows = this.pagenum
          params = {
            'accountCode': this.accountcode,
            'oneword': this.Ecode,
            'member': this.membername.split(' ')[1],
            'salepart': this.departmentname.split(' ')[1],
            'securityId': securityId,
            'assortment': this.investorClassify,
            'investigation': this.investigationMatter,
            'abnormalBehav': this.abnormalBehave,
            'proposer': proposer,
            'createTimeStart': createTimeStart,
            'createTimeEnd': createTimeEnd,
            'sendTimeStart': this.dimensionQueryForm.letterbeginDate,
            'sendTimeEnd': this.dimensionQueryForm.letterendDate,
            'sendPerson': sendPerson,
            'status': this.status,
            'pageIndex': pageIndex,
            'pageRows': pageRows
          }
        } else {
          let start = (this.currentPage - 1) * this.pagenum
          params = {
            'accountCode': this.accountcode,
            'oneword': this.Ecode,
            'member': this.membername.split(' ')[1],
            'salepart': this.departmentname.split(' ')[1],
            'securityId': securityId,
            'assortment': this.investorClassify,
            'investigation': this.investigationMatter,
            'abnormalBehav': this.abnormalBehave,
            'proposer': proposer,
            'createTimeStart': createTimeStart,
            'createTimeEnd': createTimeEnd,
            'sendTimeStart': this.dimensionQueryForm.letterbeginDate,
            'sendTimeEnd': this.dimensionQueryForm.letterendDate,
            'sendPerson': sendPerson,
            'status': this.status,
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
        this.tableOptions.push({label: '编号', field: 'warningNo', width: '120', align: 'left', isShow: this.checked0},
          {label: '标题', field: 'title', width: '120', align: 'left', isShow: this.checked1},
          {label: '证券代码及简称', field: 'securityid', width: '120', align: 'left', isShow: this.checked5},
          {label: '调查事项', field: 'investigation', width: '120', align: 'left', isShow: this.checked2},
          {label: '异常行为', field: 'abnormalBehav', width: '120', align: 'left', isShow: this.checked3},
          {label: '事项描述', field: 'logs', width: '120', align: 'left', isShow: this.checked4},
          {label: '一码通', field: 'oneword', width: '120', align: 'left', isShow: this.checked13},
          {label: '产品账户', field: 'assortment', width: '120', align: 'left', isShow: this.checked14},
          {label: '账户名称', field: 'accountName', width: '120', align: 'left', isShow: this.checked15},
          {label: '账户代码', field: 'accountCode', width: '120', align: 'left', isShow: this.checked16},
          {label: '会员名称', field: 'member', width: '120', align: 'left', isShow: this.checked17},
          {label: '营业部名称', field: 'salepart', width: '120', align: 'left', isShow: this.checked18},
          {label: '创建人', field: 'proposer', width: '120', align: 'left', isShow: this.checked6},
          {label: '创建日期', field: 'startDate', width: '120', align: 'left', isShow: this.checked7},
          {label: '发函人', field: 'sendPerson', width: '120', align: 'left', isShow: this.checked8},
          {label: '发函日期', field: 'sendDate', width: '120', align: 'left', isShow: this.checked9},
          {label: '发函附件', field: 'tranidno', width: '120', align: 'left', isShow: this.checked10},
          {label: '状态', field: 'status', width: '120', align: 'left', isShow: this.checked11},
          {label: '投资者分类', field: 'accttype', width: '120', align: 'left', isShow: this.checked19}
        )
        params['tableColumns'] = this.tableOptions
        params['fileType'] = fileType
        this.gfnExportFileWithForm('/bpm/history/abnorbehav/account/export', params)
      },
      membernameMethod (query) {
        this.isquery1 = query || ''
        this.loading = true
        setTimeout(() => {
          membername(this.isquery1, this.index1).then((resp) => {
            this.ismembername = []
            for (let item of resp) {
              this.ismembername.push({
                value: item.partici_name,
                label: item.partici_name,
              })
            }
          })
        }, 200)
      },
      handleLoadSelectMoreMemberName () {
        //否则将当前页码加1，并将其作为入参，再根据具体类型从相应接口获取返回值
        this.index1 += 1
        this.membernameMethod(this.isquery1)
      },
      handleLoadSelectMore () {
        //否则将当前页码加1，并将其作为入参，再根据具体类型从相应接口获取返回值
        this.index2 += 1
        this.departmentnameMethod(this.isquery2)
      },
      departmentnameMethod (query) {
        this.isquery2 = query || ''
        this.loading = true
        setTimeout(() => {
          departmentname(this.isquery2, this.index2).then((resp) => {
            this.isdepartmentname = []
            for (let item of resp) {
              this.isdepartmentname.push({
                value: item.partici_name,
                label: item.partici_name,
              })
            }
          })
        }, 200)
      },
      sendletterpersonMethod (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            sendletterperson(query).then((resp) => {
              this.issendletterperson = []
              for (let item of resp) {
                this.issendletterperson.push({
                  value: item.sendPerson,
                  label: item.sendPerson,
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
            createperson(query).then((resp) => {
              this.iscreateperson = []
              for (let item of resp) {
                this.iscreateperson.push({
                  value: item.proposer,
                  label: item.proposer,
                })
              }
            })
          }, 200)

        } else {
          this.iscreateperson = []
        }
      },
      dispalynumber () {
        if (!this.rangeradio) {
        } else {
          this.number = ''
        }
      },
      changetype1 () {
        this.isabnormalBehave = []
        for (let i = 0; i < this.investigationMatter.length; i++) {
          switch (this.investigationMatter[i]) {
            case '集合竞价虚假申报':
              this.isabnormalBehave.push({
                value: '拉升虚拟开盘价',
                label: '拉升虚拟开盘价'
              }, {
                value: '打压虚拟开盘价',
                label: '打压虚拟开盘价'
              })
              // this.abnormalBehave = "拉升虚拟开盘价";
              break
            case '盘中虚假申报':
              this.isabnormalBehave.push({
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
              // this.abnormalBehave = "频繁虚假申报买入";
              break
            case '涨跌停板虚假申报':
              this.isabnormalBehave.push({
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
              // this.abnormalBehave = "涨停板虚假申报";
              break
            case '拉升（打压）股票开盘价格':
              this.isabnormalBehave.push({
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
              // this.abnormalBehave = "拉升开盘价";
              break
            case '拉升（打压）股票盘中价格':
              this.isabnormalBehave.push({
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
              // this.abnormalBehave = "股票盘中拉升";
              break
            case '拉升（打压）股票收盘价格':
              this.isabnormalBehave.push({
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
              // this.abnormalBehave = "拉升股票收盘价";
              break
            case '反向交易':
              this.isabnormalBehave.push({
                value: '隔日反向交易',
                label: '隔日反向交易'
              }, {
                value: '日内反向交易',
                label: '日内反向交易'
              },)
              // this.abnormalBehave = "隔日反向交易";
              break
            case '对倒':
              this.isabnormalBehave.push({
                value: '一码通对倒',
                label: '一码通对倒'
              }, {
                value: '关联账户对倒',
                label: '关联账户对倒'
              })
              // this.abnormalBehave = "一码通对倒";
              break
            case '拉升（打压）债券价格':
              this.isabnormalBehave.push({
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
              // this.abnormalBehave = "债券盘中拉升";
              break
            case '其他－债券':
              this.isabnormalBehave.push({
                value: '其他－债券',
                label: '其他－债券'
              })
              // this.abnormalBehave = "其他－债券";
              break
            case '拉升（打压）基金价格':
              this.isabnormalBehave.push({
                value: '基金盘中拉升',
                label: '基金盘中拉升'
              }, {
                value: '基金盘中打压',
                label: '基金盘中打压'
              },)
              // this.abnormalBehave = "基金盘中拉升";
              break
            case '其他－基金':
              this.isabnormalBehave.push({
                value: '其他－基金',
                label: '其他－基金'
              },)
              // this.abnormalBehave = "其他－基金";
              break
            case '涨跌停板大额申报':
              this.isabnormalBehave.push({
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
              // this.abnormalBehave = "涨停板大额申报后反向交易";
              break
            case '大宗交易异常':
              this.isabnormalBehave.push({
                value: '大宗竞价高买低卖',
                label: '大宗竞价高买低卖'
              },)
              // this.abnormalBehave = "大宗竞价高买低卖";
              break
            case '买入风险警示股超限':
              this.isabnormalBehave.push({
                value: '买入风险警示股超限',
                label: '买入风险警示股超限'
              },)
              // this.abnormalBehave = "买入风险警示股超限";
              break
            case '程序化交易异常':
              this.isabnormalBehave.push({
                value: '程序化交易异常',
                label: '程序化交易异常'
              },)
              // this.abnormalBehave = "程序化交易异常";
              break
            case '其他－股票':
              this.isabnormalBehave.push({
                value: '其他－股票',
                label: '其他－股票'
              }, {
                value: '维稳',
                label: '维稳'
              },)
              // this.abnormalBehave = "其他－股票";
              break
            case '其他':
              this.isabnormalBehave.push({
                value: '其他异常',
                label: '其他异常'
              },)
              // this.abnormalBehave = "其他异常";
              break
            case '调取资料':
              this.isabnormalBehave.push({
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
              // this.abnormalBehave = "固定收益平台交易异常";
              break
          }
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
