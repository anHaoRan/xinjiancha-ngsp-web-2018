<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="info"
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
        <el-col :span="2" style="margin-top:8px">会员名称:</el-col>
        <el-col :span="6">
          <!--<el-input style="width:90%" v-model="membercode" placeholder="" size="small"></el-input>-->
          <el-select filterable remote v-model="membername" :clearable="true" placeholder="全部" size="small"
                     style="width: 90%;" :remote-method="membernameMethod" v-selectLoadMore="handleLoadSelectMoreMemberName" v-focus="membernameMethod">
            <el-option
              v-for="item in ismembername"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">营业部名称:</el-col>
        <el-col :span="6">
          <!-- <el-input style="width:90%" v-model="departmentname" placeholder="" size="small"></el-input> -->
          <el-select filterable remote v-model="departmentname" :clearable="true" placeholder="全部" size="small"
                     style="width: 90%;" :remote-method="departmentnameMethod" v-selectLoadMore="handleLoadSelectMore" v-focus="departmentnameMethod">
            <el-option
              v-for="item in isdepartmentname"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">监管措施:</el-col>
        <el-col :span="6">
          <el-select v-bind:multiple="true" v-model="regulatoryMeasure" placeholder="全部" size="small"
                     style="width: 90%;">
            <el-option
              v-for="item in isregulatoryMeasure"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">证券代码及简称:</el-col>
        <el-col :span="6">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode"
                            style="width: 90%;"></stock-code-query>
        </el-col>
        <el-col :span="2" style="margin-top:8px">调查事项:</el-col>
        <el-col :span="6">
          <el-select collapse-tags v-bind:multiple="true" v-model="investigationMatter" placeholder="全部" size="small"
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
        <el-col :span="6">
          <el-select collapse-tags v-bind:multiple="true" v-model="abnormalBehave" placeholder="全部" size="small"
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
        <el-col :span="2" style="margin-top:8px">函件类型:</el-col>
        <el-col :span="6">
          <el-select collapse-tags v-bind:multiple="true" v-model="letterType" placeholder="全部" size="small"
                     style="width: 90%;">
            <el-option
              v-for="(item, index) in letterTypeOptions"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">函件编号:</el-col>
        <el-col :span="6">
          <el-select filterable remote v-model="letterNumber" :clearable="true" placeholder="全部" size="small"
                     style="width: 90%;" :remote-method="letterNumberMethod">
            <el-option
              v-for="item in isletterNumber"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px">函件状态:</el-col>
        <el-col :span="6">
          <el-select collapse-tags v-bind:multiple="true" v-model="letterStatus" placeholder="全部" size="small"
                     style="width: 90%;">
            <el-option
              v-for="(item, index) in isletterStatus"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">发函人:</el-col>
        <el-col :span="6">
          <selector-dealer
            style="width: 90%;"
            ref="menbSelectorDealers"
            @node-click="getApplyPerson"
            :selectPerson="sendletterperson"></selector-dealer>
          <!--<el-select filterable remote v-model="sendletterperson" :clearable="true" placeholder="全部" size="small"-->
          <!--style="width: 90%;" :remote-method="sendletterpersonMethod" @change="addsendletterperson">-->
          <!--<el-option-->
          <!--v-for="item in issendletterperson"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
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
        <el-col :span="2" style="margin-top:8px">关键字:</el-col>
        <el-col :span="6">
          <el-input style="width:90%" v-model="keyword" placeholder="" size="small"></el-input>
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
          prop="title"
          label="标题"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <a style="text-decoration:underline;color:#409eff;cursor:pointer;" @click="historyrecord(scope.row)">{{scope.row.title}}</a>
          </template>
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
          prop="securityid"
          label="证券代码及简称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="superviseScheme"
          label="监管措施"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="assistScheme"
          label="辅助措施"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="investorMark"
          label="投资者标记"
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
          prop="letterNo"
          label="函件编号"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <a style="text-decoration:underline;color:#409eff;cursor:pointer;" @click="downloadfile(scope.row)">{{scope.row.letterNo}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="letterType2"
          label="函件类型"
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
          prop="xxx"
          label="中间库状态"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="xxxx"
          label="入库状态"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="xxx"
          label="会员已读"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="xxxx"
          label="要求回复"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="xxxx"
          label="已回复"
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
              <el-checkbox v-model="checked1">标题</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked2">证券代码及简称</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked3">会员名称</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked4">营业部名称</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked5">监管措施</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked6">调查事项</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked7">异常行为</el-checkbox>
            </el-col>

            <el-col :span=6>
              <el-checkbox v-model="checked8">函件编号</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked9">函件类型</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked10">发函人</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked11">发函日期</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked12">中间库状态</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked13">入库状态</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked14">会员已读</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked15">要求回复</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked16">已回复</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked18">辅助措施</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked19">投资者标记</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked17" @change="selectHeader">全选</el-checkbox>
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
  import SelectorDealer from '@/components/common/SelectorDealer'
  import moment from 'moment'
  import mixin from '../mixin'
  import {
    postSelfregulatoryMemberlist,
    sendletterperson,
    letterNumber,
    departmentname,
    membername
  } from '../../../service/superviseTask/index.js'
  import {letterTypeOptions} from '../constants'
  export default {
    components: {
      StockCodeQuery,
      SelectorDealer
    },
    mixins: [mixin],
    data () {
      return {
        letterTypeOptions,
        isregulatoryMeasure: [{
          value: 'ALL',
          label: '全部'
        }, {
          value: '0',
          label: '自律监管—口头警示'
        }, {
          value: '1',
          label: '自律监管—书面警示'
        }, {
          value: '2',
          label: '自律监管—盘中暂停交易'
        }, {
          value: '3',
          label: '自律监管—持续暂停交易'
        }, {
          value: '6',
          label: '自律监管--要求限期改正'
        }, {
          value: '7',
          label: '自律监管—监管谈话'
        }, {
          value: '8',
          label: '自律监管--提交合规承诺书'
        }, {
          value: '4',
          label: '纪律处分—限制交易'
        }, {
          value: '5',
          label: '纪律处分—认定为不合格投资者'
        }, {
          value: '9',
          label: '投资者标记—列为重点监控账户'
        }],
        isinvestigationMatter: [{
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
        },],
        isabnormalBehave: [],
        isletterType: [{
          value: '市场监察协查函—0101',
          label: '市场监察协查函—0101'
        }, {
          value: '市场监察问询函—0102',
          label: '市场监察问询函—0102'
        }, {
          value: '市场监察关注函—0103',
          label: '市场监察关注函—0103'
        }, {
          value: '市场监察提示函—0104',
          label: '市场监察提示函—0104'
        }, {
          value: '市场监察警示函—0105',
          label: '市场监察警示函—0105'
        }, {
          value: '市场监察告知函—0106',
          label: '市场监察告知函—0106'
        }, {
          value: '市场监察暂停交易函—0107',
          label: '市场监察暂停交易函—0107'
        }, {
          value: '市场监察约见谈话函—0108',
          label: '市场监察约见谈话函—0108'
        }],
        isletterStatus: ['无需回复', '已发函_未回复', '已发函_已回复', '已发函_未入库', '已发函_已入库', '特殊发送'],
        isletterNumber: [],
        membername: '',
        ismembername: [],
        departmentname: '',
        regulatoryMeasure: [],
        investigationMatter: [],
        abnormalBehave: [],
        letterType: [],
        letterNumber: '',
        letterStatus: [],
        sendletterperson: '',
        issendletterperson: [],
        isdepartmentname: [],

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
        index1: 1,
        index2: 1,
        isquery1: '',
        isquery2: '',
        number: '',
        tableOptions: [{label: '编号', field: 'warningNo', width: '120', align: 'left'},
          {label: '标题', field: 'title', width: '120', align: 'left'},
          {label: '证券代码及简称', field: 'securityid', width: '120', align: 'left'},
          {label: '会员名称', field: 'member', width: '120', align: 'left'},
          {label: '营业部名称', field: 'salepart', width: '120', align: 'left'},
          {label: '监管措施', field: 'superviseScheme', width: '120', align: 'left'},
          {label: '调查事项', field: 'investigation', width: '120', align: 'left'},
          {label: '异常行为', field: 'abnormalBehav', width: '120', align: 'left'},
          {label: '函件编号', field: 'fileName', width: '120', align: 'left'},
          {label: '函件类型', field: 'letterType2', width: '120', align: 'left'},
          {label: '发函人', field: 'sendPerson', width: '120', align: 'left'},
          {label: '发函日期', field: 'sendDate', width: '120', align: 'left'},
          {label: '中间库状态', field: 'xxx', width: '120', align: 'left'},
          {label: '入库状态', field: 'xxx', width: '120', align: 'left'},
          {label: '会员已读', field: 'xxx', width: '120', align: 'left'},
          {label: '要求回复', field: 'xxxx', width: '120', align: 'left'},
          {label: '已回复', field: 'xxxxx', width: '120', align: 'left'},],
        keyword: '',
        currentPage: 1,
        pagenum: 10,
        totalpage: 0,
        inquiredata: [],
        dimensionQueryForm: {
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
            return time.getTime() <= new Date(this.dimensionQueryForm.letterbeginDate).getTime() - 3600 * 1000 * 24
          }
        },
        haveResp: '',
        needReply: '',
        specialSend: ''
      }
    },
    watch: {
      letterStatus : {
        handler(val) {
          if (val.indexOf(1) > -1 && val.indexOf(2) === -1) {
            this.haveResp = '0'
          } else if (val.indexOf(2) > -1 && val.indexOf(1) === -1) {
            this.haveResp = '1'
          } else {
            this.haveResp = ''
          }
          if (val.indexOf(0) > -1) {
            this.needReply = '0'
          } else {
            this.needReply = ''
          }
          if (val.indexOf(5) > -1) {
            this.specialSend = '1'
          } else {
            this.specialSend = ''
          }
        },
        deep: true
      }
    },
    mounted () {
      this.dimensionQueryForm.letterbeginDate = moment().subtract(7, 'days').calendar()
      this.dimensionQueryForm.letterbeginDate = this.dimensionQueryForm.letterbeginDate.split('/').join('-')
      this.dimensionQueryForm.letterendDate = moment().format('YYYY-MM-DD')
      this.getAllData()
    },
    methods: {
      getApplyPerson (code, name) {
        this.sendletterperson = name
      },
      inquiry () {
        this.currentPage = 1
        this.pagenum = 10
        this.getAllData()
      },
      historyrecord (row) {
        // this.openNewWindow('finishform', `#/finishform?taskId=${''}&instanceId=${row.infoId}&isoperateCheck=${''}&activityName=${''}`)
        // window.open(`#/finishform?taskId=${''}&instanceId=${row.infoId}&isoperateCheck=${''}&activityName=${''}`)
        window.open(`#/selfSupervisionFormPage?taskId=''&instanceId=${row.infoId}&operate=1&isNewTab=true`)
      },
      downloadfile (attachment) {
        window.location.href = this.gfnGetDownloadFileUrl(attachment.fileId, attachment.fileName)
      },
      getAllData () {
        let combine = this.dealCascaderParams(this.investigationMatter, this.abnormalBehave)
        let sendPerson = []
        let letterNo = []
        if (!this.sendletterperson == false) {
          sendPerson = this.sendletterperson.split(',')
        }
        if (!this.letterNumber == false) {
          letterNo = this.letterNumber.split(',')
        }
        let securityId = this.commonData.stockCode.map(v => {
          return v.split(' ')[0]
        })
        let data = {
          'combine': combine,
          'keyword': this.keyword,
          'salepart': this.departmentname,
          'member': this.membername,
          'securityId': securityId,
          'superviseScheme': this.regulatoryMeasure,
          'investigation': this.investigationMatter,
          'abnormalBehav': this.abnormalBehave,
          // "proposer": this.investigationMatter.join(','),
          'letterType2': this.letterType,
          'letterNo': letterNo,
          'sendTimeStart': this.dimensionQueryForm.letterbeginDate,
          'sendTimeEnd': this.dimensionQueryForm.letterendDate,
          'sendPerson': sendPerson,
          'pageIndex': this.currentPage,
          'pageRows': this.pagenum,
          'haveResp': this.haveResp,
          'needReply': this.needReply,
          'specialSend': this.specialSend
        }
        postSelfregulatoryMemberlist(JSON.stringify(data)).then((resp) => {
          this.inquiredata = resp.pageContent
          this.totalpage = resp.totalNum
          for (let i = 0; i < this.inquiredata.length; i++) {
            let ismeasureradio = this.inquiredata[i].superviseScheme.split(',')
            let superviseScheme = []
            for (let j = 0; j < ismeasureradio.length; j++) {
              switch (ismeasureradio[j]) {
                case '0':
                  superviseScheme.push('口头警示')
                  break
                case '1':
                  superviseScheme.push('书面警示')
                  break
                case '2':
                  superviseScheme.push('盘中暂停交易')
                  break
                case '3':
                  superviseScheme.push('持续暂停交易')
                  break
              }
            }
            this.inquiredata[i].superviseScheme = superviseScheme.join(',')
            let isassistScheme = this.inquiredata[i].assistScheme.split(',')
            let assistScheme = []
            for (let j = 0; j < isassistScheme.length; j++) {
              switch (isassistScheme[j]) {
                case '0':
                  assistScheme.push('要求限期改正')
                  break
                case '1':
                  assistScheme.push('监管谈话')
                  break
                case '2':
                  assistScheme.push('要求提交合规承诺书')
                  break
              }
            }
            this.inquiredata[i].assistScheme = assistScheme.join(',')
            switch (this.inquiredata[i].investorMark) {
              case 0:
                this.inquiredata[i].investorMark = '不是重点监控对象'
                break
              case 1:
                this.inquiredata[i].investorMark = '重点监控对象'
                break
            }
          }
        })
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.membername = ''
        this.departmentname = ''
        this.regulatoryMeasure = []
        this.investigationMatter = []
        this.abnormalBehave = []
        this.letterType = []
        this.letterNumber = ''
        this.letterStatus = []
        this.sendletterperson = ''
        this.keyword = ''
        this.commonData.stockCode = ''
        this.dimensionQueryForm.letterbeginDate = ''
        this.dimensionQueryForm.letterendDate = ''
        this.isabnormalBehave = []
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
          this.checked12 = true
          this.checked11 = true
          this.checked13 = true
          this.checked14 = true
          this.checked15 = true
          this.checked16 = true
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
          this.checked12 = false
          this.checked11 = false
          this.checked13 = false
          this.checked14 = false
          this.checked15 = false
          this.checked16 = false
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
        let sendPerson = []
        let letterNo = []
        if (!this.sendletterperson == false) {
          sendPerson = this.sendletterperson.split(',')
        }
        if (!this.letterNumber == false) {
          letterNo = this.letterNumber.split(',')
        }
        let securityId = this.commonData.stockCode.map(v => {
          return v.split(' ')[0]
        })
        if (this.rangeradio == '0') {
          pageIndex = ''
          pageRows = ''
          params = {
            'salepart': this.departmentname,
            'member': this.membername,
            'securityId': securityId,
            'superviseScheme': this.regulatoryMeasure,
            'investigation': this.investigationMatter,
            'abnormalBehav': this.abnormalBehave,
            // "proposer": this.investigationMatter.join(','),
            'letterType2': this.letterType,
            'letterNo': letterNo,
            'sendTimeStart': this.dimensionQueryForm.letterbeginDate,
            'sendTimeEnd': this.dimensionQueryForm.letterendDate,
            'sendPerson': sendPerson,
            'pageIndex': pageIndex,
            'pageRows': pageRows,
            'haveResp': this.haveResp,
            'needReply': this.needReply,
            'specialSend': this.specialSend
          }
        } else if (this.rangeradio == '1' && (!this.number)) {
          pageIndex = this.currentPage
          pageRows = this.pagenum
          params = {
            'salepart': this.departmentname,
            'member': this.membername,
            'securityId': securityId,
            'superviseScheme': this.regulatoryMeasure,
            'investigation': this.investigationMatter,
            'abnormalBehav': this.abnormalBehave,
            // "proposer": this.investigationMatter.join(','),
            'letterType2': this.letterType,
            'letterNo': letterNo,
            'sendTimeStart': this.dimensionQueryForm.letterbeginDate,
            'sendTimeEnd': this.dimensionQueryForm.letterendDate,
            'sendPerson': sendPerson,
            'pageIndex': pageIndex,
            'pageRows': pageRows,
            'haveResp': this.haveResp,
            'needReply': this.needReply,
            'specialSend': this.specialSend
          }
        } else {
          let start = (this.currentPage - 1) * this.pagenum
          params = {
            'salepart': this.departmentname,
            'member': this.membername,
            'securityId': securityId,
            'superviseScheme': this.regulatoryMeasure,
            'investigation': this.investigationMatter,
            'abnormalBehav': this.abnormalBehave,
            // "proposer": this.investigationMatter.join(','),
            'letterType2': this.letterType,
            'letterNo': letterNo,
            'sendTimeStart': this.dimensionQueryForm.letterbeginDate,
            'sendTimeEnd': this.dimensionQueryForm.letterendDate,
            'sendPerson': sendPerson,
            'pageIndex': '',
            'pageRows': '',
            'start': (this.currentPage - 1) * this.pagenum,
            'limit': parseInt(this.number),
            'haveResp': this.haveResp,
            'needReply': this.needReply,
            'specialSend': this.specialSend
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
        this.tableOptions.push(
          {label: '标题', field: 'title', width: '120', align: 'left', isShow: this.checked1},
          {label: '证券代码及简称', field: 'securityid', width: '120', align: 'left', isShow: this.checked2},
          {label: '会员名称', field: 'member', width: '120', align: 'left', isShow: this.checked3},
          {label: '营业部名称', field: 'salepart', width: '120', align: 'left', isShow: this.checked4},
          {label: '监管措施', field: 'superviseScheme', width: '120', align: 'left', isShow: this.checked5},
          {label: '调查事项', field: 'investigation', width: '120', align: 'left', isShow: this.checked6},
          {label: '异常行为', field: 'abnormalBehav', width: '120', align: 'left', isShow: this.checked7},
          {label: '函件编号', field: 'fileName', width: '120', align: 'left', isShow: this.checked8},
          {label: '函件类型', field: 'letterType2', width: '120', align: 'left', isShow: this.checked9},
          {label: '发函人', field: 'sendPerson', width: '120', align: 'left', isShow: this.checked10},
          {label: '发函日期', field: 'sendDate', width: '120', align: 'left', isShow: this.checked11},
          {label: '中间库状态', field: 'xxx', width: '120', align: 'left', isShow: this.checked12},
          {label: '入库状态', field: 'xxx', width: '120', align: 'left', isShow: this.checked13},
          {label: '会员已读', field: 'xxx', width: '120', align: 'left', isShow: this.checked14},
          {label: '要求回复', field: 'xxxx', width: '120', align: 'left', isShow: this.checked15},
          {label: '已回复', field: 'xxxxx', width: '120', align: 'left', isShow: this.checked16},
          {label: '辅助措施', field: 'superviseScheme', width: '120', align: 'left', isShow: this.checked18},
          {label: '投资者标记', field: 'investorMark', width: '120', align: 'left', isShow: this.checked19},
        )
        params['tableColumns'] = this.tableOptions
        params['fileType'] = fileType
        this.gfnExportFileWithForm('/bpm/history/slsprocess/member/export', params)
      },
      handleLoadSelectMoreMemberName () {
        //否则将当前页码加1，并将其作为入参，再根据具体类型从相应接口获取返回值
        this.index1 += 1
        this.membernameMethod(this.isquery1)
      },
      membernameMethod (query) {
        this.isquery1 = query || ''
        this.loading = true
        setTimeout(() => {
          membername(this.isquery1, this.index1).then((resp) => {
            this.ismembername = []
            for (let item of resp) {
              this.ismembername.push({
                value: item.partici_name.split(' ')[1],
                label: item.partici_name.split(' ')[1],
              })
            }
          })
        }, 200)
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
                value: item.partici_name.split(' ')[1],
                label: item.partici_name.split(' ')[1],
              })
            }
          })
        }, 200)
      },
      letterNumberMethod (query) {
        console.log(query)
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            letterNumber(query).then((resp) => {
              this.isletterNumber = []
              for (let item of resp) {
                this.isletterNumber.push({
                  value: item,
                  label: item,
                })
              }
            })
          }, 200)

        } else {
          this.isletterNumber = []
        }
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
      addsendletterperson (val) {
        this.sendletterperson = val
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
      dispalynumber () {
        if (!this.rangeradio) {
        } else {
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
