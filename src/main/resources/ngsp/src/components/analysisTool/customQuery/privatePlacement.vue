<template>
  <div class="privatePlacement">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" size="small" style="margin-top: 20px">
        <el-row>
          <el-form-item label="起止日期：" prop="priplaDate" class="form-inline">
            <s-date-picker
              v-model="ruleForm.priplaDate"
              :is-range="true"
              type="date"
              startPlaceholder="请选择开始日期"
              endPlaceholder="请选择结束日期"></s-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="账户代码：" prop="accountCode" class="form-inline">
            <file-upload
              ref="upload"
              class="form-inline"
              :isShowSuccessMessage="true"
              :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
              @getTxtCon="setAccountData"
              :limitFileType="['xls', 'xlsx']"
              :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
              :uploadParams="uploadParamsA"
              style="vertical-align: top;"></file-upload>
            <el-tag :type="uploadStatusA" style="margin: 0 10px 0 10px"> {{ uploadTextA }}</el-tag>
            <el-button class="uploadBtn" @click="downloadExcelMould('account')" size="small" type="primary" style="vertical-align: top;">下载模板</el-button>
          </el-form-item>
          <el-form-item label="股票代码：" prop="sharesCode" class="form-inline">
            <file-upload
              ref="upload2"
              class="form-inline"
              :isShowSuccessMessage="true"
              :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
              @getTxtCon="setSharesData"
              :limitFileType="['xls', 'xlsx']"
              :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
              :uploadParams="uploadParamsS"
              style="vertical-align: top;"></file-upload>
            <el-tag :type="uploadStatusS" style="margin: 0 10px 0 10px"> {{ uploadTextS }}</el-tag>
            <el-button class="uploadBtn" @click="downloadExcelMould(shares)" size="small" type="primary" style="vertical-align: top;">下载模板</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <s-table
      ref="marginTable"
      :columns="columns"
      :data="tableData"
      @getPageination="getPageination">
      <el-button slot="elCardHeader" type="info" @click="handleDownload" :disabled="isAbled" size="small">导出</el-button>
      <el-radio-group slot="tableHeader" v-model="currentTable" @change="changeTable">
        <el-radio-button
          v-for="item in tableList"
          :key="item.key"
          :label="item.label"
          :name="item.name"></el-radio-button>
      </el-radio-group>
    </s-table>
  </div>
</template>

<script>
  import Breadcrumb from '../../../components/common/Breadcrumb'
  import FileUpload from '@/components/common/textUpload'
  import STable from '@/components/base/STable'
  import moment from 'moment'
  import {getRelativeTradeDate} from '../../../service/common/commonFunc'
  import {postPrivatePlacement} from '../../../service/analysisTool/specificTool/index'
  import SDatePicker from '../../base/SDatePicker'

  export default {
    components: {
      SDatePicker,
      Breadcrumb,
      FileUpload,
      STable
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '/analysisTool',
            label: '分析工具'
          }, {
            router: '/dimensionTable',
            label: '自定义查询'
          }, {
            router: '/privatePlacement',
            label: '私募季报'
          }
        ],
        ruleForm: {
          priplaDate: [],
          accountCode: [],
          sharesCode: []
        },
        rules: {
          priplaDate: [
            {required: true, message: '请选择起始日期', trigger: 'change'}
          ],
          accountCode: [
            {required: true, message: '请上传账户代码附件', trigger: 'change'}
          ]
        },
        uploadParamsA: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: ['acctId', 'acctName']
            }
          ])
        },
        uploadTextA: '未上传',
        uploadStatusA: 'danger',
        uploadParamsS: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1,
              fields: ['stkCode', 'stkType']
            }
          ])
        },
        uploadTextS: '未上传',
        uploadStatusS: 'danger',
        setDateDisabled: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        isAbled: true,
        pageFlag: false,
        qryId: '', // qry_test_000003
        defaultDate: '',
        currentTable: '私募基金资产分布',
        tableData: {},
        columns: [],
        tableList: [
          {label: '私募基金资产分布', name: 'tablepan1'},
          {label: '私募基金总体交易情况', name: 'tablepan2'},
          {label: '持有市值前10名的私募基金公司', name: 'tablepan3'},
          {label: '成交总额前10名的私募基金公司', name: 'tablepan4'},
          {label: '私募基金持有的前10大股票情况', name: 'tablepan5'},
          {label: '私募基金期权交易情况', name: 'tablepan6'},
          {label: '私募类账户汇总表', name: 'tablepan7'},
          {label: '信用账户交易表', name: 'tablepan8'},
          {label: '程序化账户交易表', name: 'tablepan9'},
          {label: '分类证券交易情况表', name: 'tablepan10'},
          {label: '分类证券持仓前10大账户及股票表', name: 'tablepan11'}
        ],
        table: {
          theadList1: [ // 私募基金资产分布
            {label: '类别', field: 'sec_type', align: 'left', width: '130', sortable: true},
            {label: '持有市值(万元)', field: 'hold_amt', align: 'right', width: '130'},
            {label: '持有市值增减百分比（与上季度末比）(%)', field: 'per1', align: 'right', width: '200'},
            {label: '市场总市值(万元)', field: 'mkt_amt', align: 'right', width: '130'},
            {label: '私募基金占相关金融工具总流通市值的百分比(%)', field: 'per2', align: 'right', width: '200'}
          ],
          theadList2: [ // 私募基金总体交易情况
            {label: '类别', field: 'sec_type', align: 'left', width: '130', sortable: true},
            {label: '买入金额(万元)', field: 'trdamt_b', align: 'right', width: '130'},
            {label: '卖出金额(万元)', field: 'trdamt_s', align: 'right', width: '130'},
            {label: '净买卖金额(万元)', field: 'trdamt_net', align: 'right', width: '130'},
            {label: '总成交额(万元)', field: 'trdamt_ful', align: 'right', width: '130'},
            {label: '私募基金市场占比（%）', field: 'per', align: 'right', width: '130'}
          ],
          theadList3: [ // 持有市值前10名的私募基金公司
            {label: '序号', field: 'rn', align: 'left', width: '130', sortable: true},
            {label: '私募基金公司名称', field: 'acct_name', align: 'left', width: '130', sortable: true},
            {label: '持有股票市值(万元)', field: 'hold_amt', align: 'right', width: '130'},
            {label: '持有市值增减百分比（与上季度末比）(%)', field: 'per', align: 'right', width: '130'}
          ],
          theadList4: [ // 成交总额前10名的私募基金公司
            {label: '私募基金公司名称', field: 'acct_name', align: 'left', width: '130', sortable: true},
            {label: '买入金额(万元)', field: 'trade_buy_amt', align: 'right', width: '130'},
            {label: '卖出金额(万元)', field: 'trade_sale_amt', align: 'right', width: '130'},
            {label: '净买卖金额(万元)', field: 'trade_amt_net', align: 'right', width: '130'},
            {label: '总成交额(万元)', field: 'trade_amt', align: 'right', width: '130'},
            {label: '序号', field: 'rn', align: 'right', width: '130'}
          ],
          theadList5: [ // 私募基金持有的前10大股票情况
            {label: '类别', field: 'sec_type', align: 'left', width: '130', sortable: true}, // 后台少字段
            {label: '股票代码', field: 'sec_code', align: 'left', width: '130', sortable: true},
            {label: '股票名称', field: 'sec_name', align: 'left', width: '130'},
            {label: '所属行业', field: 'industry', align: 'left', width: '130', sortable: true},
            {label: '持有市值(万元)', field: 'nego_amt', align: 'right', width: '130'},
            {label: '占该股流通市值比重(%)', field: 'per', align: 'right', width: '130'}
          ],
          theadList6: [ // 私募基金期权交易情况
            {label: '私募基金买入持仓(万元)', field: 'hold_b', align: 'right', width: '130'},
            {label: '私募基金较上季度增减（买入）(%)', field: 'per_b', align: 'right', width: '180'},
            {label: '私募基金卖出持仓(万元)', field: 'hold_s', align: 'right', width: '130'},
            {label: '私募基金较上季度增减（卖出）(%)', field: 'per_s', align: 'right', width: '180'},
            {label: '私募基金买入开仓(万元)', field: 'trade_vol_b_o', align: 'right', width: '130'},
            {label: '私募基金买入平仓(万元)', field: 'trade_vol_b_c', align: 'right', width: '130'},
            {label: '私募基金卖出开仓(万元)', field: 'trade_vol_s_o', align: 'right', width: '130'},
            {label: '私募基金卖出平仓(万元)', field: 'trade_vol_s_c', align: 'right', width: '130'},
            {label: '私募基金成交总量(万元)', field: 'trade_vol', align: 'right', width: '130'},
            {label: '市场期权成交总量(万元)', field: 'mkt_vol', align: 'right', width: '130'},
            {label: '私募基金市占比(%)', field: 'per_market', align: 'right', width: '130'}
          ],
          theadList7: [ // 私募类账户汇总表
            {label: '计算起始日期', field: 'start_timestamp', align: 'right', width: '130', sortable: true},
            {label: '计算终止日期', field: 'end_timestamp', align: 'right', width: '130', sortable: true},
            {label: '账户个数', field: 'count_id', align: 'right', width: '130'},
            {label: '活跃账户个数', field: 'active_id', align: 'right', width: '130'},
            {label: '信用账户个数', field: 'credit_id', align: 'right', width: '130'},
            {label: '上季度活跃账户个数', field: 'active_id_last', align: 'right', width: '130'},
            {label: '上季度信用账户个数', field: 'accr_id_last', align: 'right', width: '130'}
          ],
          theadList8: [ // 信用账户交易表
            {label: '计算起始日期', field: 'start_timestamp', align: 'left', width: '130', sortable: true},
            {label: '计算终止日期', field: 'end_timestamp', align: 'left', width: '130', sortable: true},
            {label: '资金来源', field: 'money_class', align: 'left', width: '130'},
            {label: '本季度交易金额(万元)', field: 'trade_amt', align: 'left', width: '130'},
            {label: '本季度交易金额占比（单向）(%)', field: 'per1', align: 'right', width: '180'},
            {label: '上季度交易金额(万元)', field: 'trade_amt_l', align: 'right', width: '130'},
            {label: '上季度交易金额占比（单向）(%)', field: 'per_last', align: 'right', width: '180'},
            {label: '本季度大宗交易金额(万元)', field: 'big_deal_amt', align: 'right', width: '130'},
            {label: '本季度大宗交易金额占比（单向）(%)', field: 'big_deal_per', align: 'right', width: '180'}
          ],
          theadList9: [ // 程序化账户交易表
            {label: '计算起始日期', field: 'start_timestamp', align: 'left', width: '140', sortable: true},
            {label: '计算终止日期', field: 'end_timestamp', align: 'left', width: '140', sortable: true},
            {label: '本季度程序化账户数(个)', field: 'count1', align: 'right', width: '130'},
            {label: '本季度程序化账户数占比(%)', field: 'count_per1', align: 'right', width: '160'},
            {label: '本季度程序化账户总买入金额(万元)', field: 'buy_amt', align: 'right', width: '180'},
            {label: '本季度程序化账户总卖出金额(万元)', field: 'sell_amt', align: 'right', width: '180'},
            {label: '上季度程序化账户数(个)', field: 'count2', align: 'right', width: '160'},
            {label: '上季度程序化账户数占比(%)', field: 'count_per2', align: 'right', width: '160'},
            {label: '上季度程序化账户总买入金额(万元)', field: 'buy_amt_l', align: 'right', width: '180'}
          ],
          theadList10: [ // 分类证券交易情况表
            {label: '计算起始日期', field: 'start_timestamp', align: 'left', width: '130', sortable: true},
            {label: '计算终止日期', field: 'end_timestamp', align: 'left', width: '130', sortable: true},
            {label: '证券分类', field: 'sec_type', align: 'left', width: '130', sortable: true},
            {label: '月份', field: 'month', align: 'left', width: '130', sortable: true},
            {label: '当月交易金额大于0元的账户数(个)', field: 'count_id', align: 'right', width: '180'},
            {label: '买入金额(万元) ', field: 'trdamt_b2', align: 'right', width: '130'},
            {label: '卖出金额(万元)', field: 'trdamt_s2', align: 'right', width: '130'},
            {label: '净买入额(万元)', field: 'trdamt_net2', align: 'right', width: '130'},
            {label: '累计净买入额(万元)', field: 'trdamt_net_total', align: 'right', width: '160'}
          ],
          theadList11: [ // 分类证券持仓前10大账户及股票表
            {label: '计算终止日期', field: 'end_timestamp', align: 'left', width: '160', sortable: true},
            {label: '证券分类', field: 'sec_type', align: 'left', width: '130'},
            {label: '持仓最多的第一名账户代码', field: 'acct_1', align: 'left', width: '160'},
            {label: '持仓最多的第一名账户名称', field: 'acct_name_1', align: 'left', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_1', align: 'right', width: '130'},
            {label: '持仓最多的第二名账户代码', field: 'acct_2', align: 'right', width: '160'},
            {label: '持仓最多的第二名账户名称', field: 'acct_name_2', align: 'right', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_2', align: 'right', width: '130'},
            {label: '持仓最多的第三名账户代码', field: 'acct_3', align: 'left', width: '160'},
            {label: '持仓最多的第三名账户名称', field: 'acct_name_3', align: 'left', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_3', align: 'right', width: '130'},
            {label: '持仓最多的第四名账户代码', field: 'acct_4', align: 'left', width: '160'},
            {label: '持仓最多的第四名账户名称', field: 'acct_name_4', align: 'left', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_4', align: 'right', width: '130'},
            {label: '持仓最多的第五名账户代码', field: 'acct_5', align: 'left', width: '160'},
            {label: '持仓最多的第五名账户名称', field: 'acct_name_5', align: 'left', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_5', align: 'right', width: '130'},
            {label: '持仓最多的第六名账户代码', field: 'acct_6', align: 'left', width: '160'},
            {label: '持仓最多的第六名账户名称', field: 'acct_name_6', align: 'left', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_6', align: 'right', width: '130'},
            {label: '持仓最多的第七名账户代码', field: 'acct_7', align: 'left', width: '160'},
            {label: '持仓最多的第七名账户名称', field: 'acct_name_7', align: 'left', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_7', align: 'right', width: '130'},
            {label: '持仓最多的第八名账户代码', field: 'acct_8', align: 'left', width: '160'},
            {label: '持仓最多的第八名账户名称', field: 'acct_name_8', align: 'left', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_8', align: 'right', width: '130'},
            {label: '持仓最多的第九名账户代码', field: 'acct_9', align: 'left', width: '160'},
            {label: '持仓最多的第九名账户名称', field: 'acct_name_9', align: 'left', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_9', align: 'right', width: '130'},
            {label: '持仓最多的第十名账户代码', field: 'acct_10', align: 'left', width: '160'},
            {label: '持仓最多的第十名账户名称', field: 'acct_name_10', align: 'left', width: '160'},
            {label: '账户持股金额(万元)', field: 'hold_amt_by_acct_10', align: 'right', width: '130'},
            {label: '持仓最多的第一证券代码', field: 'sec_code_1', align: 'left', width: '160'},
            {label: '持仓最多的第一证券名称', field: 'sec_name_1', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_1', align: 'right', width: '200'},
            {label: '持仓最多的第二证券代码', field: 'sec_code_2', align: 'left', width: '160'},
            {label: '持仓最多的第二证券名称', field: 'sec_name_2', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_2', align: 'right', width: '200'},
            {label: '持仓最多的第三证券代码', field: 'sec_code_3', align: 'left', width: '160'},
            {label: '持仓最多的第三证券名称', field: 'sec_name_3', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_3', align: 'right', width: '200'},
            {label: '持仓最多的第四证券代码', field: 'sec_code_4', align: 'left', width: '160'},
            {label: '持仓最多的第四证券名称', field: 'sec_name_4', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_4', align: 'right', width: '200'},
            {label: '持仓最多的第五证券代码', field: 'sec_code_5', align: 'left', width: '160'},
            {label: '持仓最多的第五证券名称', field: 'sec_name_5', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_5', align: 'right', width: '200'},
            {label: '持仓最多的第六证券代码', field: 'sec_code_6', align: 'left', width: '160'},
            {label: '持仓最多的第六证券名称', field: 'sec_name_6', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_6', align: 'right', width: '200'},
            {label: '持仓最多的第七证券代码', field: 'sec_code_7', align: 'left', width: '160'},
            {label: '持仓最多的第七证券名称', field: 'sec_name_7', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_7', align: 'right', width: '200'},
            {label: '持仓最多的第八证券代码', field: 'sec_code_8', align: 'left', width: '160'},
            {label: '持仓最多的第八证券名称', field: 'sec_name_8', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_8', align: 'right', width: '200'},
            {label: '持仓最多的第九证券代码', field: 'sec_code_9', align: 'left', width: '160'},
            {label: '持仓最多的第九证券名称', field: 'sec_name_9', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_9', align: 'right', width: '200'},
            {label: '持仓最多的第十证券代码', field: 'sec_code_10', align: 'left', width: '160'},
            {label: '持仓最多的第十证券名称', field: 'sec_name_10', align: 'left', width: '160'},
            {label: '私募类账户持该个证券的总金额(万元)', field: 'hold_amt_by_code_10', align: 'left', width: '200'}
          ],
          data1: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data2: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data3: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data4: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data5: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data6: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data7: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data8: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data9: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data10: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data11: {data: [], total: 0, pageIndex: 1, pageRows: 10}
        }
      }
    },
    methods: {
      handleQueryData(qryId, isNewQuery, pageIndex, pageRows, resType) {
        this.isAbled = true
        this.showOrHideLoading(true)
        let params = {
          startDate: moment(this.ruleForm.priplaDate[0]).format('YYYY-MM-DD'),
          endDate: moment(this.ruleForm.priplaDate[1]).format('YYYY-MM-DD'),
          acctArr: this.ruleForm.accountCode,
          stkArr: this.ruleForm.sharesCode,
          qryId: qryId,
          isNewQuery: isNewQuery,
          pageIndex: pageIndex,
          pageRows: pageRows,
          isExport: 0,
          resType: resType
        }
        postPrivatePlacement({params: JSON.stringify(params)}).then((resp) => { // eslint-disable-line
          if (resp.res.res1) {
            this.table.data1.data = resp.res.res1
            this.table.data1.total = Number(resp.cnt.res1Cnt)
          }
          if (resp.res.res2) {
            this.table.data2.data = resp.res.res2
            this.table.data2.total = Number(resp.cnt.res2Cnt)
          }
          if (resp.res.res3) {
            this.table.data3.data = resp.res.res3
            this.table.data3.total = Number(resp.cnt.res3Cnt)
          }
          if (resp.res.res4) {
            this.table.data4.data = resp.res.res4
            this.table.data4.total = Number(resp.cnt.res4Cnt)
          }
          if (resp.res.res5) {
            this.table.data5.data = resp.res.res5
            this.table.data5.total = Number(resp.cnt.res5Cnt)
          }
          if (resp.res.res6) {
            this.table.data6.data = resp.res.res6
            this.table.data6.total = Number(resp.cnt.res6Cnt)
          }
          if (resp.res.res7) {
            this.table.data7.data = resp.res.res7
            this.table.data7.total = Number(resp.cnt.res7Cnt)
          }
          if (resp.res.res8) {
            this.table.data8.data = resp.res.res8
            this.table.data8.total = Number(resp.cnt.res8Cnt)
          }
          if (resp.res.res9) {
            this.table.data9.data = resp.res.res9
            this.table.data9.total = Number(resp.cnt.res9Cnt)
          }
          if (resp.res.res10) {
            this.table.data10.data = resp.res.res10
            this.table.data10.total = Number(resp.cnt.res10Cnt)
          }
          if (resp.res.res11) {
            this.table.data11.data = resp.res.res11
            this.table.data11.total = Number(resp.cnt.res11Cnt)
          }
          this.isAbled = false
          this.qryId = resp.qryId
          this.showOrHideLoading(false)
        })
      },
      getPageination(page) {
        if (this.pageFlag) {
          this.$refs.ruleForm.validate((valid) => { // eslint-disable-line
            if (valid) {
              let resType = ''
              switch (this.activeName) {
                case 'tablepan1':
                  resType = 'res1'
                  this.table.data1.pageIndex = page.currentPage
                  this.table.data1.pageRows = page.pageSizeNumber
                  break
                case 'tablepan2':
                  resType = 'res2'
                  this.table.data2.pageIndex = page.currentPage
                  this.table.data2.pageRows = page.pageSizeNumber
                  break
                case 'tablepan3':
                  resType = 'res3'
                  this.table.data3.pageIndex = page.currentPage
                  this.table.data3.pageRows = page.pageSizeNumber
                  break
                case 'tablepan4':
                  resType = 'res4'
                  this.table.data4.pageIndex = page.currentPage
                  this.table.data4.pageRows = page.pageSizeNumber
                  break
                case 'tablepan5':
                  resType = 'res5'
                  this.table.data5.pageIndex = page.currentPage
                  this.table.data5.pageRows = page.pageSizeNumber
                  break
                case 'tablepan6':
                  resType = 'res6'
                  this.table.data6.pageIndex = page.currentPage
                  this.table.data6.pageRows = page.pageSizeNumber
                  break
                case 'tablepan7':
                  resType = 'res7'
                  this.table.data7.pageIndex = page.currentPage
                  this.table.data7.pageRows = page.pageSizeNumber
                  break
                case 'tablepan8':
                  resType = 'res8'
                  this.table.data8.pageIndex = page.currentPage
                  this.table.data8.pageRows = page.pageSizeNumber
                  break
                case 'tablepan9':
                  resType = 'res9'
                  this.table.data9.pageIndex = page.currentPage
                  this.table.data9.pageRows = page.pageSizeNumber
                  break
                case 'tablepan10':
                  resType = 'res10'
                  this.table.data10.pageIndex = page.currentPage
                  this.table.data10.pageRows = page.pageSizeNumber
                  break
                case 'tablepan11':
                  resType = 'res11'
                  this.table.data11.pageIndex = page.currentPage
                  this.table.data11.pageRows = page.pageSizeNumber
                  break
              }
              this.handleQueryData(this.qryId, 0, page.currentPage, page.pageSizeNumber, resType)
            } else {
              this.$message.error('查询失败！请补全查询参数~')
            }
          })
        }
      },
      changeTable(label) { // eslint-disable-line
        switch (label) {
          case '私募基金资产分布':
            this.columns = this.table.theadList1
            this.tableData = this.table.data1
            break
          case '私募基金总体交易情况':
            this.columns = this.table.theadList2
            this.tableData = this.table.data2
            break
          case '持有市值前10名的私募基金公司':
            this.columns = this.table.theadList3
            this.tableData = this.table.data3
            break
          case '成交总额前10名的私募基金公司':
            this.columns = this.table.theadList4
            this.tableData = this.table.data4
            break
          case '私募基金持有的前10大股票情况':
            this.columns = this.table.theadList5
            this.tableData = this.table.data5
            break
          case '私募基金期权交易情况':
            this.columns = this.table.theadList6
            this.tableData = this.table.data6
            break
          case '私募类账户汇总表':
            this.columns = this.table.theadList7
            this.tableData = this.table.data7
            break
          case '信用账户交易表':
            this.columns = this.table.theadList8
            this.tableData = this.table.data8
            break
          case '程序化账户交易表':
            this.columns = this.table.theadList9
            this.tableData = this.table.data9
            break
          case '分类证券交易情况表':
            this.columns = this.table.theadList10
            this.tableData = this.table.data10
            break
          case '分类证券持仓前10大账户及股票表':
            this.columns = this.table.theadList11
            this.tableData = this.table.data11
            break
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.pageFlag = true
            let pageIndex = 1, pageRows = 10
            switch (this.activeName) {
              case 'tablepan1':
                pageIndex = this.table.data1.pageIndex
                pageRows = this.table.data1.pageRows
                break
              case 'tablepan2':
                pageIndex = this.table.data2.pageIndex
                pageRows = this.table.data2.pageRows
                break
              case 'tablepan3':
                pageIndex = this.table.data3.pageIndex
                pageRows = this.table.data3.pageRows
                break
              case 'tablepan4':
                pageIndex = this.table.data4.pageIndex
                pageRows = this.table.data4.pageRows
                break
              case 'tablepan5':
                pageIndex = this.table.data5.pageIndex
                pageRows = this.table.data5.pageRows
                break
            }
            this.handleQueryData(this.qryId, 1, pageIndex, pageRows, 'ALL')
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
      },
      showOrHideLoading(flag) {
        this.$refs.marginTable.showOrHideLoading(flag)
      },
      setAccountData(value) {
        this.ruleForm.accountCode = value.Sheet0;
        this.uploadTextA = '已上传'
        this.uploadStatusA = 'success'
      },
      setSharesData(value) {
        this.ruleForm.sharesCode = value.Sheet0;
        this.uploadTextS = '已上传'
        this.uploadStatusS = 'success'
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.loading = false
        this.isDownload = true
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
        this.ruleForm.priplaDate = this.defaultDate
      },
      handleDownload() {
        this.$message.info('正在导出，请稍等~')
        let params = {
          startDate: moment(this.ruleForm.priplaDate[0]).format('YYYYMMDD'),
          endDate: moment(this.ruleForm.priplaDate[1]).format('YYYYMMDD'),
          acctArr: this.ruleForm.accountCode,
          stkArr: this.ruleForm.sharesCode,
          qryId: this.qryId,
          isExport: 1,
          resType: 'ALL',
          fileType: 'xlsx',
          tableColumns: [
            {sheetName: '私募基金资产分布', fileColumns: this.table.theadList1},
            {sheetName: '私募基金总体交易情况', fileColumns: this.table.theadList2},
            {sheetName: '持有市值前10名的私募基金公司', fileColumns: this.table.theadList3},
            {sheetName: '成交总额前10名的私募基金公司', fileColumns: this.table.theadList4},
            {sheetName: '私募基金持有的前10大股票情况', fileColumns: this.table.theadList5},
            {sheetName: '私募基金期权交易情况', fileColumns: this.table.theadList6},
            {sheetName: '私募类账户汇总表', fileColumns: this.table.theadList7},
            {sheetName: '信用账户交易表', fileColumns: this.table.theadList8},
            {sheetName: '程序化账户交易表', fileColumns: this.table.theadList9},
            {sheetName: '分类证券交易情况表', fileColumns: this.table.theadList10},
            {sheetName: '分类证券持仓前10大账户及股票表', fileColumns: this.table.theadList11}
          ]
        }
        this.gfnExportFileWithForm('/specialqry/speclqry/v1/private-equity-export', params)
      },
      downloadExcelMould(str) {
        if (str === 'account') {
          this.gfnDownloadTemplateFile({ code: 'privatePlacement_account' })
        } else {
          this.gfnDownloadTemplateFile({ code: 'privatePlacement_shares' })
        }
      }
    },
    mounted() {
      //  默认展示第一个标签页
      this.columns = this.table.theadList1
      this.tableData = this.table.data1
      getRelativeTradeDate(-1).then(resp => {
        this.defaultDate = [moment(resp).format('YYYY-MM-DD'), moment(resp).format('YYYY-MM-DD')]
        this.ruleForm.priplaDate = this.defaultDate
      })
    }
  }
</script>

<style scoped lang="less">
  .privatePlacement {
    .form-inline {
      display: inline-block;
    }
  }
</style>
