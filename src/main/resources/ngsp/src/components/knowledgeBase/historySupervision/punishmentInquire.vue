<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="info" size="small" style="float:right;" @click="clearAllData">清空
        </el-button>
        <el-button type="primary" size="small" style="float:right;" @click="inquiry">查询
        </el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">证券代码及简称:</el-col>
        <el-col :span="4">
          <stock-code-query :commonData="commonData" @getStockCode="getStockCode"
                            style="width: 90%;"></stock-code-query>
        </el-col>
        <el-col :span="2" style="margin-top:8px">处罚单编号:</el-col>
        <el-col :span="4">
          <el-input style="width:90%" v-model="punishnumber" placeholder="" size="small"></el-input>
        </el-col>
        <el-col :span="2" style="margin-top:8px">调查事项:</el-col>
        <el-col :span="4">
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
        <el-col :span="4">
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
        <el-col :span="2" style="margin-top:8px">创建人:</el-col>
        <el-col :span="4">
          <selector-dealer
            style="width: 90%;"
            ref="hisSelectorDealers"
            @node-click="getApplyPerson"
            :selectPerson="createperson"></selector-dealer>
        </el-col>
        <el-col :span="2" style="margin-top:8px">创建日期:</el-col>
        <el-col :span="12">
          <s-date-picker
            :value="createDate"
            :isRange="true"
            @change="handleCreateDateChange"
          ></s-date-picker>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">发函人:</el-col>
        <el-col :span="4">
          <selector-dealer
            style="width: 90%;"
            ref="hisSelectorDealers2"
            @node-click="getApplyPerson2"
            :selectPerson="sendletterperson"></selector-dealer>
        </el-col>
        <el-col :span="2" style="margin-top:8px">发函日期:</el-col>
        <el-col :span="12">
          <s-date-picker
            :value="letterDate"
            :isRange="true"
            @change="handleLetterDateChange"
          ></s-date-picker>
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
          prop="warningNo"
          label="编号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <a style="text-decoration:underline;color:#409eff;cursor:pointer;" @click="historyrecord(scope.row)">{{scope.row.title}}</a>
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
              <a style="text-decoration:underline;color:#409eff;cursor:pointer;" @click="downloadfile(item)">{{item.fileName}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
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
              <el-checkbox v-model="checked0">编号</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked1">标题</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked2">调查事项</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked3">异常行为</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked4">事项描述</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked5">证券代码及简称</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked6">创建人</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked7">创建日期</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span=6>
              <el-checkbox v-model="checked8">发函人</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked9">发函日期</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked10">发函附件</el-checkbox>
            </el-col>
            <el-col :span=6>
              <el-checkbox v-model="checked11">状态</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-checkbox v-model="checked12" @change="selectHeader">全选</el-checkbox>
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
  import SDatePicker from '@/components/base/SDatePicker'
  import moment from 'moment'
  import mixin from '../mixin'
  import {
    postAbnormalBehavelist,
    createperson,
    sendletterperson
  } from '../../../service/superviseTask/index.js'

  export default {
    components: {
      StockCodeQuery,
      SelectorDealer,
      SDatePicker
    },
    mixins: [mixin],
    data () {
      return {
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
          }
        ],
        tableOptions: [{label: '编号', field: 'warningNo', width: '120', align: 'left'},
          {label: '标题', field: 'title', width: '120', align: 'left'},
          {label: '调查事项', field: 'investigation', width: '120', align: 'left'},
          {label: '异常行为', field: 'abnormalBehav', width: '120', align: 'left'},
          {label: '事项描述', field: 'logs', width: '120', align: 'left'},
          {label: '证券代码及简称', field: 'securityid', width: '120', align: 'left'},
          {label: '创建人', field: 'proposer', width: '120', align: 'left'},
          {label: '创建日期', field: 'startDate', width: '120', align: 'left'},
          {label: '发函人', field: 'sendPerson', width: '120', align: 'left'},
          {label: '发函日期', field: 'sendDate', width: '120', align: 'left'},
          {label: '发函附件', field: 'tranidno', width: '120', align: 'left'},
          {label: '状态', field: 'status', width: '120', align: 'left'}],
        punishnumber: '',
        investigationMatter: [],
        abnormalBehave: [],
        createDate: [],
        letterDate: [],
        createperson: '',
        sendletterperson: '',
        status: [],
        keyword: '',
        currentPage: 1,
        pagenum: 10,
        totalpage: 0,
        inquiredata: [],
        isfileName: [],
        iscreateperson: [],
        issendletterperson: [],

        formLabelWidth: '120px',
        towhom: 'xnli',
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
        typeradio: '0',
        rangeradio: '0',
        number: '',
        dimensionQueryForm: {
          createbeginDate: '',
          createendDate: '',
          letterbeginDate: '',
          letterendDate: ''
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
        }
      }
    },
    mounted () {
      let createDateStart = moment().subtract(7, 'days').calendar().split('/').join('-')
      let createDateEnd = moment().format('YYYY-MM-DD')
      this.createDate = [createDateStart, createDateEnd]
      this.getAllData()
    },
    methods: {
      handleCreateDateChange(val) {
        this.createDate = val
      },
      handleLetterDateChange(val) {
        this.letterDate = val
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
        let securityId = ''
        if (this.commonData.stockCode.length === 0) {
          securityId = ''
        } else {
          for (let i = 0; i < this.commonData.stockCode.length; i++) {
            securityId += this.commonData.stockCode[i].split(' ')[0] + ','
          }
          securityId = securityId.substr(0, securityId.length - 1)
        }
        let data = {
          'combine': combine,
          'keyword': this.keyword,
          'securityId': securityId,
          'warningNo': this.punishnumber,
          'investigation': this.investigationMatter,
          'abnormalBehav': this.abnormalBehave,
          'proposer': proposer,
          'createTimeStart': this.createDate[0] ? this.createDate[0] + ' 00:00:00' : '',
          'createTimeEnd': this.createDate[1] ? this.createDate[1] + ' 23:59:59' : '',
          'sendTimeStart': this.letterDate[0] || '',
          'sendTimeEnd': this.letterDate[1] || '',
          'sendPerson': sendPerson,
          'status': this.status,
          'pageIndex': this.currentPage,
          'pageRows': this.pagenum
        }
        postAbnormalBehavelist(JSON.stringify(data)).then((resp) => {
          this.inquiredata = resp.pageContent
          this.totalpage = resp.totalNum
          for (let i = 0; i < this.inquiredata.length; i++) {
            switch (this.inquiredata[i].status) {
              case '0':
                this.inquiredata[i].status = '创建中'
                break
              case '1':
                this.inquiredata[i].status = '审核中'
                break
              case '2':
                this.inquiredata[i].status = '分配中'
                break
              case '3':
                this.inquiredata[i].status = '待发函'
                break
              case '4':
                this.inquiredata[i].status = '待回函'
                break
              case '5':
                this.inquiredata[i].status = '待归档'
                break
              case '6':
                this.inquiredata[i].status = '已归档'
                break
            }
          }
        })
      },
      downloadfile (attachment) {
        window.location.href = this.gfnGetDownloadFileUrl(attachment.fileId, attachment.fileName)
      },
      historyrecord (row) {
        window.open(`#/selfSupervisionFormPage?taskId=''&instanceId=${row.infoId}&operate=1&isNewTab=true`)
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.dimensionQueryForm.createbeginDate = ''
        this.dimensionQueryForm.createendDate = ''
        this.dimensionQueryForm.letterbeginDate = ''
        this.dimensionQueryForm.letterendDate = ''
        this.createDate = []
        this.letterDate =[]
        this.punishnumber = ''
        this.investigationMatter = []
        this.abnormalBehave = []
        this.createperson = ''
        this.sendletterperson = ''
        this.status = []
        this.keyword = ''
        this.commonData.stockCode = []
        this.isabnormalBehave = []
      },
      exporttxt () {
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
        }
      },
      veryfy () {
        /* 判断是否选择导出字段 */
        let checkList = [this.checked0, this.checked1, this.checked2, this.checked3, this.checked4, this.checked5, this.checked6, this.checked7, this.checked8, this.checked9, this.checked10, this.checked11]
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
        let securityId = ''
        if (this.commonData.stockCode.length === 0) {
          securityId = ''
        } else {
          for (let i = 0; i < this.commonData.stockCode.length; i++) {
            securityId += this.commonData.stockCode[i].split(' ')[0] + ','
          }
          securityId = securityId.substr(0, securityId.length - 1)
        }
        if (this.rangeradio == '0') {
          pageIndex = ''
          pageRows = ''
          params = {
            'securityId': securityId,
            'warningNo': this.punishnumber,
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
            'securityId': securityId,
            'warningNo': this.punishnumber,
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
            'securityId': securityId,
            'warningNo': this.punishnumber,
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
          {label: '调查事项', field: 'investigation', width: '120', align: 'left', isShow: this.checked2},
          {label: '异常行为', field: 'abnormalBehav', width: '120', align: 'left', isShow: this.checked3},
          {label: '事项描述', field: 'logs', width: '120', align: 'left', isShow: this.checked4},
          {label: '证券代码及简称', field: 'securityid', width: '120', align: 'left', isShow: this.checked5},
          {label: '创建人', field: 'proposer', width: '120', align: 'left', isShow: this.checked6},
          {label: '创建日期', field: 'startDate', width: '120', align: 'left', isShow: this.checked7},
          {label: '发函人', field: 'sendPerson', width: '120', align: 'left', isShow: this.checked8},
          {label: '发函日期', field: 'sendDate', width: '120', align: 'left', isShow: this.checked9},
          {label: '发函附件', field: 'tranidno', width: '120', align: 'left', isShow: this.checked10},
          {label: '状态', field: 'status', width: '120', align: 'left', isShow: this.checked11})
        params['tableColumns'] = this.tableOptions
        params['fileType'] = fileType
        this.gfnExportFileWithForm('/bpm/history/abnorbehav/punish/export', params)
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
                  label: item.sendPerson
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
                  label: item.proposer
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
      dispalynumber () {
        if (!this.rangeradio) {
        } else {
          this.number = ''
        }
      },
      cancleVeryfy () {
        this.dialogFormVisble = false
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
              // this.abnormalBehave = '拉升虚拟开盘价';
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
              // this.abnormalBehave = '频繁虚假申报买入';
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
              // this.abnormalBehave = '涨停板虚假申报';
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
              // this.abnormalBehave = '拉升开盘价';
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
              // this.abnormalBehave = '股票盘中拉升';
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
              // this.abnormalBehave = '拉升股票收盘价';
              break
            case '反向交易':
              this.isabnormalBehave.push({
                value: '隔日反向交易',
                label: '隔日反向交易'
              }, {
                value: '日内反向交易',
                label: '日内反向交易'
              })
              // this.abnormalBehave = '隔日反向交易';
              break
            case '对倒':
              this.isabnormalBehave.push({
                value: '一码通对倒',
                label: '一码通对倒'
              }, {
                value: '关联账户对倒',
                label: '关联账户对倒'
              })
              // this.abnormalBehave = '一码通对倒';
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
              // this.abnormalBehave = '债券盘中拉升';
              break
            case '其他－债券':
              this.isabnormalBehave.push({
                value: '其他－债券',
                label: '其他－债券'
              })
              // this.abnormalBehave = '其他－债券';
              break
            case '拉升（打压）基金价格':
              this.isabnormalBehave.push({
                value: '基金盘中拉升',
                label: '基金盘中拉升'
              }, {
                value: '基金盘中打压',
                label: '基金盘中打压'
              })
              // this.abnormalBehave = '基金盘中拉升';
              break
            case '其他－基金':
              this.isabnormalBehave.push({
                value: '其他－基金',
                label: '其他－基金'
              })
              // this.abnormalBehave = '其他－基金';
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
              })
              // this.abnormalBehave = '涨停板大额申报后反向交易';
              break
            case '大宗交易异常':
              this.isabnormalBehave.push({
                value: '大宗竞价高买低卖',
                label: '大宗竞价高买低卖'
              })
              // this.abnormalBehave = '大宗竞价高买低卖';
              break
            case '买入风险警示股超限':
              this.isabnormalBehave.push({
                value: '买入风险警示股超限',
                label: '买入风险警示股超限'
              })
              // this.abnormalBehave = '买入风险警示股超限';
              break
            case '程序化交易异常':
              this.isabnormalBehave.push({
                value: '程序化交易异常',
                label: '程序化交易异常'
              })
              // this.abnormalBehave = '程序化交易异常';
              break
            case '其他－股票':
              this.isabnormalBehave.push({
                value: '其他－股票',
                label: '其他－股票'
              }, {
                value: '维稳',
                label: '维稳'
              })
              // this.abnormalBehave = '其他－股票';
              break
            case '其他':
              this.isabnormalBehave.push({
                value: '其他异常',
                label: '其他异常'
              })
              // this.abnormalBehave = '其他异常';
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
              })
              // this.abnormalBehave = '固定收益平台交易异常';
              break
          }
        }
      },

      currentpagination (val) {
        this.currentPage = val
        this.getAllData()
      },
      sizepagination (val) {
        this.pagenum = val
        this.getAllData()
      }
    }
  }
</script>
<style>
</style>
