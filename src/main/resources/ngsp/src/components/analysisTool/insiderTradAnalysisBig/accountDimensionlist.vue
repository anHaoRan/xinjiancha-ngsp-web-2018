<template>
  <div>
    <el-card style="margin-top:0;">
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="text"
          size="small"
          style="float:right;"
          @click="cleardata"
        >清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right;"
          @click="getAllData"
        >查询
        </el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-col :span="2" style="margin-top:8px">账户代码:</el-col>
        <el-col :span="3">
          <!-- <stock-code-query :commonData="commonData" @getStockCode="getStockCode"></stock-code-query> -->
          <el-input v-model="stockCode" placeholder="" size="small"></el-input>
        </el-col>
        <el-col :span="2" style="margin-top:8px;margin-left: 7%;">历史是否上报:</el-col>
        <el-col :span="3">
          <el-select v-model="HistoryReport" placeholder="" size="small">
            <el-option
              v-for="item in isHistoryReport"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin-top:8px;margin-left: 7%;">综合得分:</el-col>
        <el-col :span="3">
          <el-input style="width:96%" v-model="firstScore" placeholder="" size="small" @change="testinputfirstScore"></el-input>
        </el-col>
        <el-col :span="1" style="margin-top:8px">-</el-col>
        <el-col :span="3">
          <el-input style="width:96%;margin-left:-50px" v-model="lastScore" placeholder="" size="small" @change="testinputlastScore"></el-input>
        </el-col>
        <el-col :span="2" style="margin-top:8px;margin-left: -3%;">
          <span v-if="socreright" style="color:red;">输入正确的综合得分!</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button
          type="text"
          size="small"
          style="float:right;"
          @click="addnewcode"
        >新增账户
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right;"
          @click="deletesomelist"
        >批量刪除
        </el-button>
      </div>
      <el-row v-if="isGoodOrBadData==true">
        <el-table
          ref="multipleTable"
          :fit=true
          @cell-click="dispalyInfo"
          :data="completeTheReviewList"
          @selection-change="handleselecttionchange"
          border>
          <el-table-column
            type="selection"
            width="50"
          ></el-table-column>
          <el-table-column
            :fixed="item.fixed"
            align="center"
            style="width:100%"
            :show-overflow-tooltip="true"
            :key="item.field"
            :prop="item.field"
            :label="item.label"
            :width="item.width"
            :formatter="item.formatter"
            v-for="item in columns"
          ></el-table-column>
          <el-table-column
            prop="branch_name"
            label="交易营业部"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <a style="text-decoration:underline;color:#409eff;cursor:pointer;" @click="routerdepartment(scope.row)">{{scope.row.branch_name}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="operateContent"
            label="操作"
            fixed="right"
            width="150"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="editPopbox(scope.row)">
                编辑
              </el-button>
              <el-button type="text" size="mini" @click="deleteonelist(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
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
      <div v-if="flag">
        <el-button @click="back" type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回上一步</el-button>
        <el-button @click="finishcheck" type="primary" style="float:right;margin:20px 20px 0 0;width:10%">完成复核</el-button>
      </div>
      <div v-else>
        <span>
          <el-button @click="back" type="primary" style="float:right;background-color:white;color:black;width:10%;margin:20px 0px 0 0">返回上一步</el-button>
        </span>
        <span>
          <el-button @click="finishanalysis" type="primary" style="float:right;margin:20px 20px 0 0;width:10%">终止分析</el-button>
        </span>
        <span>
          <el-button @click="submitcheck" type="primary" style="float:right;margin:20px 20px 0 0;width:10%" :disabled="isChecked">提交复核</el-button>
        </span>
        <select-person-component v-if="selectData.dialogFormVisble"
                                 :selectData="selectData"
                                 @obdSelectPerson='confirmCommitInfo'
                                 :isInsideTradeAnalysis="true"></select-person-component>
      </div>
      <el-dialog
        :visible.sync="addstockcode"
        title="新增账户"
        width="700px">
        <el-form>
          <el-form-item label="账户代码">
            <el-input v-model="newstockcode" placeholder="" size="medium" style="width:75%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="addonecodelist">计 算</el-button>
          <el-button type="text" size="small" @click="cancleVeryfy">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title=""
        :visible.sync="dialogFormVisble"
        center
        width="700px">
        <el-form>
          <el-form-item label="分析人员判断结论">
            <el-input :disabled="isCanEdit" type="textarea" v-bind:rows=4 v-model="analyststext" placeholder="输入内容在2000字以内" size="medium" style="width:75%"></el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="flag">
          <el-form-item label="复核人员判断结论">
            <el-input type="textarea" v-bind:rows=4 v-model="confirmtext" placeholder="输入内容在2000字以内" size="medium" style="width:75%"></el-input>
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="最终判断结果">
            <el-select v-model="result" placeholder="" size="small" style="width:40%;margin-left:30px">
              <el-option
                v-for="item in isresult"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="交易品种是否有明显变化">
            <el-radio v-model="tradVariety" label="0">是</el-radio>
            <el-radio v-model="tradVariety" label="1">否</el-radio>
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="交易风格是否有明显变化">
            <el-radio v-model="tradStyle" label="0">是</el-radio>
            <el-radio v-model="tradStyle" label="1">否</el-radio>
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="持股习惯是否有明显变化">
            <el-radio v-model="shareholdHabit" label="0">是</el-radio>
            <el-radio v-model="shareholdHabit" label="1">否</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="veryfy">确 定</el-button>
          <el-button type="text" size="small" @click="cancleVeryfy">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
    <el-card style="height:57px" v-if="tableflag">
      <el-tabs v-model="analysisname" @tab-click="handleClick">
        <el-tab-pane label="账户交易及申报行为分析" name="one">
        </el-tab-pane>
        <el-tab-pane label="账户交易品种分析" name="two">
        </el-tab-pane>
        <el-tab-pane label="账户交易风格分析" name="three">
        </el-tab-pane>
        <el-tab-pane label="得分项展示" name="four">
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <behaveanalysis v-if="tabdispaly=='one'&&tableflag" ref="behavetable"></behaveanalysis>
    <varityanalysis v-if="tabdispaly=='two'&&tableflag" ref="varitytable"></varityanalysis>
    <account-detail-style v-if="tabdispaly=='three'&&tableflag" ref="styletable"></account-detail-style>
    <getscore v-if="tabdispaly=='four'&&tableflag" ref="scoretable"></getscore>
  </div>
</template>
<script>
  import StockCodeQuery from '@/components/common/StockCodeQuery'
  import behaveanalysis from './tableanalysis/behaveanalysis'
  import varityanalysis from './tableanalysis/varityanalysis'
  import AccountDetailStyle from './tableanalysis/accountDetailStyle'
  import getscore from './tableanalysis/getscore'
  import { requestPrefix } from '@/utils/constants'
  import {
    getbadlist,
    edittablelist,
    postdelete,
    getcolmlist,
    postaddnewcode,
    finishanalysis,
    getgoodlist,
    getlist,
    getdepartmentData,
    getallinfo
  } from '@/service/analysisTool/insiderTradAccountAnalysisBig/accountlist/index'
  import SelectPersonComponent from '../../superviseTask/superviseTaskComponent/selectPersonComponent'

  export default {
    components: {
      StockCodeQuery,
      behaveanalysis,
      varityanalysis,
      AccountDetailStyle,
      getscore,
      SelectPersonComponent
    },
    props: ['activeName'],
    data () {
      return {
        // commonData: {
        //   disabled: false,
        //   stockCode: ''
        // },
        selectData: {
          dialogFormVisble: false
        },
        columns: [
          {field: 'acct_id', width: '100', label: '账户代码', fixed: true},
          {field: 'acct_name', width: '100', label: '账户名称'},
          {field: 'score_total', width: '100', label: '综合得分'},
          {field: 'ymt_acct_id', width: '175', label: '账户一码通编码'},
          {field: 'credent_number', width: '150', label: '账户证件号码'},
          {field: 'acct_area', width: '175', label: '身份证所属地区'},
          // {field: "a", width: '150', label: "营业部净买入排名"},
          // {field: "a", width: '175', label: "营业部地区名称"},
          {field: 'had_report', width: '175', label: '历史是否上报过'},
          {field: 'anal_result', width: '150', label: '分析人员判断结论'},
          {field: 'reanal_result', width: '150', label: '复核人员判断结论'},
          {field: 'final_result', width: '150', label: '最终判断结果'},
          {field: 'is_trans_type_changed', width: '150', label: '交易品种是否有明显变化'},
          {field: 'is_trans_style_changed', width: '150', label: '交易风格是否有明显变化'},
          {field: 'is_hold_habit_changed', width: '150', label: '持股习惯是否有明显变化'},
          {field: 'branch_area', width: '150', label: '营业部地区名称'},
          {field: 'branch_rank', width: '150', label: '营业部净买入排名'},
          {field: 'acct_type', width: '150', label: '账户类别'}
        ],
        completeTheReviewList: [],
        selectval: [],
        HistoryReport: '',
        stockCode: '',
        isHistoryReport: [{
          value: '',
          label: '不限'
        }, {
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }],
        isresult: [{
          value: '进一步关注',
          label: '进一步关注'
        }, {
          value: '进一步调查',
          label: '进一步调查'
        }, {
          value: '无异常',
          label: '无异常'
        }],
        firstScore: '',
        lastScore: '',
        currentPage: 1,
        isCanEdit: false,
        pagenum: 10,
        totalpage: 400,
        dialogFormVisble: false,
        addstockcode: false,
        analyststext: '',
        confirmtext: '',
        result: '进一步关注',
        tradVariety: '0',
        tradStyle: '0',
        shareholdHabit: '0',
        tableflag: false,
        tabdispaly: 'one',
        analysisname: 'one',
        newstockcode: '',
        taskID: 'lh001',
        isGoodOrBadData: true,
        acct_id: '',
        acct_anal_id: '',
        multipleTable: [],
        deletestockcode: '',
        socreright: false,
        ccrcAcctID: '',
        acctCodes: '',
        dynamicTableHead: [],
        type: 0,
        groupCode: '',
        operatorType: '',
        flag: false,
        processId: '',
        analType: '',
        getscore: [],
        isChecked:true
      }
    },
    mounted () {
      this.operatorType = this.$store.state.insiderTradAnalysis.currentTaskData.operatorType
      this.groupCode = this.$store.state.insiderTradAnalysis.analysisType
      // this.groupCode="ZHLH"
      this.taskID = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      console.log()
      // this.taskID="600005"
      this.processId = this.$store.state.insiderTradAnalysis.currentTaskData.processId
      let params = {
        'taskID': this.taskID
      }
      getallinfo(params).then((resp) => {
        if (resp.bizData.metaData[0].anal_type_name == 'lh') {
          this.groupCode = 'ZHLH'
        } else {
          this.groupCode = 'ZHLK'
        }
        this.ajaxQuotaClms()
      })
      if (typeof this.processId == 'undefined') {
        this.processId = ''
      }

      if (this.operatorType == 'analysiser') {
        this.flag = false
        this.isCanEdit = false
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].field == 'reanal_result') {
            this.columns = [
              {field: 'acct_id', width: '100', label: '账户代码', fixed: true},
              {field: 'acct_name', width: '100', label: '账户名称'},
              {field: 'score_total', width: '100', label: '综合得分'},
              {field: 'ymt_acct_id', width: '175', label: '账户一码通编码'},
              {field: 'credent_number', width: '150', label: '账户证件号码'},
              {field: 'acct_area', width: '175', label: '身份证所属地区'},
              // {field: "a", width: '150', label: "营业部净买入排名"},
              // {field: "a", width: '175', label: "营业部地区名称"},
              {field: 'had_report', width: '175', label: '历史是否上报过'},
              {field: 'anal_result', width: '150', label: '分析人员判断结论'},
              {field: 'final_result', width: '150', label: '最终判断结果'},
              {field: 'is_trans_type_changed', width: '150', label: '交易品种是否有明显变化'},
              {field: 'is_trans_style_changed', width: '150', label: '交易风格是否有明显变化'},
              {field: 'is_hold_habit_changed', width: '150', label: '持股习惯是否有明显变化'},
              {field: 'branch_area', width: '150', label: '营业部地区名称'},
              {field: 'branch_rank', width: '150', label: '营业部净买入排名'},
              {field: 'acct_type', width: '150', label: '账户类别'}
            ]
          }
        }
      } else {
        this.flag = true
        this.isCanEdit = true
      }
    },
    methods: {
      confirmCommitInfo (selectPerson, selectPersonName) {
        let params = {
          'taskId': this.taskID,
          'processId': '',
          'stopStatus': '0',
          'selectPerson': selectPerson,
          'selectPersonName': selectPersonName
        }
        let taskStatus = this.$store.state.insiderTradAnalysis.taskStatus
        if (taskStatus == '2') {
          finishanalysis(params).then((resp) => {
            if (resp) {
              this.$store.commit('changeTaskStatus', '3')
            }
            this.$router.push({
              path: '../insiderTradAnalysis/'
            })
          })
        }
      },
      handleselecttionchange (val) {
        this.selectval = val
        console.log(val)
      },
      finishcheck () {
        // let processId = this.$store.state.insiderTradAnalysis.currentTaskData.processId,
        //   taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId,
        let taskStatus = this.$store.state.insiderTradAnalysis.taskStatus
        let params = {
          'taskId': this.taskID,
          'processId': this.processId,
          'stopStatus': '0'
        }
        if (taskStatus == '4') {
          finishanalysis(params).then((resp) => {
            if (resp) {
              this.$store.commit('changeTaskStatus', '5')
            } else {
              this.$message.error('任务状态更改失败')
            }
          })
        }
        this.$router.push({
          path: '/completeTheReviewBig/' + this.taskID
        })
      },
      submitcheck () {
        this.selectData.dialogFormVisble = true
      },
      finishanalysis () {
        this.$confirm('终止后将无法恢复，确定终止？', '确认终止', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            'taskId': this.taskID,
            'processId': this.processId,
            'stopStatus': '1'
          }
          finishanalysis(params).then((resp) => {
            this.$router.push({
              path: '/insiderTradAnalysisBig'
            })
          })
        }).catch(() => {

        })
      },
      getCurrentRow () {
        for (let key of this.dynamicTableHead) {
          // this.columns.push({
          //   index: key.index_desc,
          //   description: key.index_desc,
          //   score: key.index_id,
          //   reason: ''
          // })
          this.columns.push({field: key.index_id, width: '150', label: key.index_desc})
        }
        // console.log()
        if (this.$store.state.insiderTradAnalysis.branchCode) {
          this.getdepartmentandAccountData()
        } else {
          if (this.groupCode == 'ZHLK') {
            this.getbadAllData()
            this.analType = 'lk'
          } else if (this.groupCode == 'ZHLH') {
            this.getgoodAllData()
            this.analType = 'lh'
          }
        }
      },
      ajaxQuotaClms () {
        let params = {
          'groupCode': this.groupCode
          // "groupCode":"ZHLH",
        }
        getcolmlist(params).then((resp) => {
          this.isChecked = false
          let res = resp.quotaClms
          // let res = resp.stockTrend
          res.sort((x, y) => {
            return x.index_sort - y.index_sort
          })
          for (let key of res) {
            this.dynamicTableHead.push(key)
          }
          this.getCurrentRow()
        })
      },
      getdepartmentandAccountData () {
        const loading = this.$loading({
          lock: true,
          text: '数据加载中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        // if(this.HistoryReport=="不限"){
        //   this.HistoryReport=""
        // }
        if (this.groupCode == 'ZHLK') {
          this.analType = 'lk'
        } else if (this.groupCode == 'ZHLH') {
          this.analType = 'lh'
        }
        let params = {
          'taskID': this.taskID,
          // "taskID":"lh005",
          'pageIdx': this.currentPage,
          'pageRw': this.pagenum,
          'reqAcctCode': this.stockCode,
          'reqHadReport': this.HistoryReport,
          'reqScoreTtLow': this.firstScore,
          'reqScoreTtHigh': this.lastScore,
          'branchCode': this.$store.state.insiderTradAnalysis.branchCode,
          // "branchCode":"SHJSTBJ-00060020",
          'analType': this.analType
        }
        getdepartmentData(params).then((resp) => {
          loading.close()
          this.totalpage = Number(resp.pageTotal)
          for (let i = 0; i < resp.acctsRes.length; i++) {
            switch (resp.acctsRes[i].final_result) {
              case '0':
                resp.acctsRes[i].final_result = '无异常'
                break
              case '1':
                resp.acctsRes[i].final_result = '进一步关注'
                break
              case '2':
                resp.acctsRes[i].final_result = '进一步调查'
                break
            }
            switch (resp.acctsRes[i].is_trans_type_changed) {
              case '1':
                resp.acctsRes[i].is_trans_type_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_trans_type_changed = '是'
                break
            }
            switch (resp.acctsRes[i].is_trans_style_changed) {
              case '1':
                resp.acctsRes[i].is_trans_style_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_trans_style_changed = '是'
                break
            }
            switch (resp.acctsRes[i].is_hold_habit_changed) {
              case '1':
                resp.acctsRes[i].is_hold_habit_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_hold_habit_changed = '是'
                break
            }
          }
          this.completeTheReviewList = resp.acctsRes
          console.log(Number(resp.pageTotal))
        })
      },
      getbadAllData () {
        const loading = this.$loading({
          lock: true,
          text: '数据加载中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        if (this.HistoryReport == '不限') {
          this.HistoryReport = ''
        }
        let params = {
          'taskID': this.taskID,
          // "taskID":"lh005",
          'pageIdx': this.currentPage,
          'pageRw': this.pagenum,
          'reqAcctCode': this.stockCode,
          'reqHadReport': this.HistoryReport,
          'reqScoreTtLow': this.firstScore,
          'reqScoreTtHigh': this.lastScore,
          'branchCode': '',
          'analType': this.analType
        }
        getbadlist(params).then((resp) => {
          loading.close()
          this.totalpage = Number(resp.pageTotal)
          for (let i = 0; i < resp.acctsRes.length; i++) {
            switch (resp.acctsRes[i].final_result) {
              case '0':
                resp.acctsRes[i].final_result = '无异常'
                break
              case '1':
                resp.acctsRes[i].final_result = '进一步关注'
                break
              case '2':
                resp.acctsRes[i].final_result = '进一步调查'
                break
            }
            switch (resp.acctsRes[i].is_trans_type_changed) {
              case '1':
                resp.acctsRes[i].is_trans_type_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_trans_type_changed = '是'
                break
            }
            switch (resp.acctsRes[i].is_trans_style_changed) {
              case '1':
                resp.acctsRes[i].is_trans_style_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_trans_style_changed = '是'
                break
            }
            switch (resp.acctsRes[i].is_hold_habit_changed) {
              case '1':
                resp.acctsRes[i].is_hold_habit_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_hold_habit_changed = '是'
                break
            }
          }
          this.completeTheReviewList = resp.acctsRes
        })
      },
      getgoodAllData () {
        const loading = this.$loading({
          lock: true,
          text: '数据加载中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        if (this.HistoryReport == '不限') {
          this.HistoryReport = ''
        }
        let params = {
          'taskID': this.taskID,
          // "taskID":"lh005",
          'pageIdx': this.currentPage,
          'pageRw': this.pagenum,
          'reqAcctCode': this.stockCode,
          'reqHadReport': this.HistoryReport,
          'reqScoreTtLow': this.firstScore,
          'reqScoreTtHigh': this.lastScore,
          'branchCode': '',
          'analType': this.analType
        }
        getgoodlist(params).then((resp) => {
          loading.close()
          this.totalpage = Number(resp.pageTotal)
          for (let i = 0; i < resp.acctsRes.length; i++) {
            switch (resp.acctsRes[i].final_result) {
              case '0':
                resp.acctsRes[i].final_result = '无异常'
                break
              case '1':
                resp.acctsRes[i].final_result = '进一步关注'
                break
              case '2':
                resp.acctsRes[i].final_result = '进一步调查'
                break
            }
            switch (resp.acctsRes[i].is_trans_type_changed) {
              case '1':
                resp.acctsRes[i].is_trans_type_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_trans_type_changed = '是'
                break
            }
            switch (resp.acctsRes[i].is_trans_style_changed) {
              case '1':
                resp.acctsRes[i].is_trans_style_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_trans_style_changed = '是'
                break
            }
            switch (resp.acctsRes[i].is_hold_habit_changed) {
              case '1':
                resp.acctsRes[i].is_hold_habit_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_hold_habit_changed = '是'
                break
            }
          }
          this.completeTheReviewList = resp.acctsRes
        })
      },
      getAllData () {
        const loading = this.$loading({
          lock: true,
          text: '数据加载中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        if (this.HistoryReport == '不限') {
          this.HistoryReport = ''
        }
        let params = {
          'taskID': this.taskID,
          // "taskID":"lh005",
          'pageIdx': this.currentPage,
          'pageRw': this.pagenum,
          'reqAcctCode': this.stockCode,
          'reqHadReport': this.HistoryReport,
          'reqScoreTtLow': this.firstScore,
          'reqScoreTtHigh': this.lastScore,
          'analType': this.analType,
          'branchCode': this.$store.state.insiderTradAnalysis.branchCode
        }
        getlist(params).then((resp) => {
          loading.close()
          this.totalpage = Number(resp.pageTotal)
          for (let i = 0; i < resp.acctsRes.length; i++) {
            switch (resp.acctsRes[i].final_result) {
              case '0':
                resp.acctsRes[i].final_result = '无异常'
                break
              case '1':
                resp.acctsRes[i].final_result = '进一步关注'
                break
              case '2':
                resp.acctsRes[i].final_result = '进一步调查'
                break
            }
            switch (resp.acctsRes[i].is_trans_type_changed) {
              case '1':
                resp.acctsRes[i].is_trans_type_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_trans_type_changed = '是'
                break
            }
            switch (resp.acctsRes[i].is_trans_style_changed) {
              case '1':
                resp.acctsRes[i].is_trans_style_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_trans_style_changed = '是'
                break
            }
            switch (resp.acctsRes[i].is_hold_habit_changed) {
              case '1':
                resp.acctsRes[i].is_hold_habit_changed = '否'
                break
              case '0':
                resp.acctsRes[i].is_hold_habit_changed = '是'
                break
            }
          }
          this.completeTheReviewList = resp.acctsRes
        })
      },
      addnewcode () {
        this.addstockcode = true
      },
      addonecodelist () {
        const loading = this.$loading({
          lock: true,
          text: '数据加载中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        this.addstockcode = false
        let params = {
          'taskID': this.taskID,
          'acctCode': this.newstockcode
        }
        postaddnewcode(params).then((resp) => {
          loading.close()
          this.getAllData()
        })
      },
      deletesomelist () {
        let isdeletestockcode = []
        for (let i = 0; i < this.completeTheReviewList.length; i++) {
          if (this.selectval[i]) {
            isdeletestockcode.push(this.completeTheReviewList[i].acct_anal_id)
            console.log(isdeletestockcode)
          }
        }
        if (isdeletestockcode.length === 0) {
          this.deletestockcode = ''
        } else {
          this.deletestockcode = isdeletestockcode.join(',')
        }

        console.log(this.deletestockcode)
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            'taskID': this.taskID,
            'acctAnalID': this.deletestockcode
          }
          postdelete(params).then((resp) => {
            const loading = this.$loading({
              lock: true,
              text: '数据加载中，请耐心等待',
              spinner: 'el-icon-loading',
              background: 'rgba(0,0,0,0.7)'
            })
            this.getAllData()
          })
        }).catch(() => {

        })
      },
      deleteonelist (row) {
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            'taskID': this.taskID,
            'acctAnalID': row.acct_anal_id
          }
          postdelete(params).then((resp) => {
            this.getAllData()
          })
        }).catch(() => {

        })
      },
      // getStockCode(stockCodeData) {
      //    this.commonData.stockCode = stockCodeData;
      //  },
      currentpagination (val) {
        this.currentPage = val
        this.getbadAllData()
      },
      sizepagination (val) {
        this.pagenum = val
        this.getbadAllData()
      },
      veryfy () {
        this.dialogFormVisble = false
        let isresult = ''
        switch (this.result) {
          case '无异常':
            isresult = '0'
            break
          case '进一步关注':
            isresult = '1'
            break
          case '进一步调查':
            isresult = '2'
            break
        }
        let params = {
          'taskID': this.taskID,
          'acctAnalID': this.acct_anal_id,
          // "acct_id":this.acct_id,
          'analResult': this.analyststext,
          'reanalResult': this.confirmtext,
          'finalResult': isresult,
          'isTransTypeChanged': this.tradVariety,
          'isTransStyleChanged': this.tradStyle,
          'isHoldHabitChanged': this.shareholdHabit
        }
        edittablelist(params).then((resp) => {
          this.getAllData()
        })
      },
      cancleVeryfy () {
        this.dialogFormVisble = false
        this.addstockcode = false
      },
      editPopbox (row) {
        this.confirmtext = row.reanal_result
        this.dialogFormVisble = true
        this.acct_id = row.acct_id
        this.acct_anal_id = row.acct_anal_id
        this.analyststext = row.anal_result
      },
      dispalyInfo (row, cell) {
        if (cell.label == '操作') {
          return
        }
        this.getscore = row
        this.tableflag = true
        let accountparam = [row.ymt_acct_id, row.acct_id, row.acct_anal_id]
        this.$store.commit('saveaccountParams', accountparam)
        switch (this.tabdispaly) {
          // case "one":this.$refs.behavetable.getinfo();break
          case 'two':
            this.$refs.varitytable.getinfo()
            break
          // case "three":this.$refs.styletable.drawpic();break
          case 'four':
            this.$refs.scoretable.getinfo()
            break
        }
        // window.sessionStorage.setItem("ccrcAcctID",row.ymt_acct_id)
        // window.sessionStorage.setItem("acctCodes",row.acctCodes)
      },
      routerdepartment (row) {
        this.$emit('changetab', 'two')
        this.$store.commit('changedepartmentcode', row.branch_id)
      },
      cleardata () {
        this.stockCode = ''
        this.HistoryReport = '不限'
        this.firstScore = ''
        this.lastScore = ''
      },
      testinputfirstScore () {
        let reg = /^-?\d+$/
        if (!reg.test(this.firstScore)) {
          this.socreright = true
        } else {
          this.socreright = false
        }
      },
      testinputlastScore () {
        let reg = /^-?\d+$/
        if (!reg.test(this.lastScore)) {
          this.socreright = true
        } else {
          this.socreright = false
        }
      },
      handleClick (tab, event) {
        switch (tab.name) {
          case 'one':
            this.tabdispaly = 'one'
            break
          case 'two':
            this.tabdispaly = 'two'
            break
          case 'three':
            this.tabdispaly = 'three'
            break
          case 'four':
            this.tabdispaly = 'four'
            break
        }
      },
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style>
  .el-table__fixed-right::before, .el-table__fixed::before {
    background-color: #17274b;
  }

  .el-table__body tr.hover-row > td {
    background-color: #152447;
  }

  .el-table__fixed {
    height: 100% !important;
  }

  .el-table__fixed-right {
    height: 100% !important;
  }
</style>
