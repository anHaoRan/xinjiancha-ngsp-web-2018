<template>
  <div class="converttradesTwo">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header">
        <span>查询条件</span>
        <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="230px" size="small"
               style="margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="起止日期：" prop="contraDate" class="form-inline">
              <s-date-picker
                v-model="ruleForm.contraDate"
                :is-range="true"
                type="date"
                startPlaceholder="请选择开始日期"
                endPlaceholder="请选择结束日期"></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="isContnT" class="form-inline">
              <el-checkbox v-model="ruleForm.isContnT">包含输入日期</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="showCondition">
          <el-row>
            <el-col :span="12">
              <el-form-item label="前" prop="beforDay" class="form-inline">
                <el-input class="smallText" v-model="ruleForm.beforDay"></el-input>
                <span>&nbsp;交易日</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="后" prop="afterDay" class="form-inline">
                <el-input class="smallText" v-model="ruleForm.afterDay"></el-input>
                <span>&nbsp;交易日</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="期末流通市值：" prop="mktNeg" class="form-inline">
                <el-input v-model.number="ruleForm.mktNeg" class="smallText" placeholder="请输入期末流通市值"></el-input>
                <span>&nbsp;亿元以下</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="基准日成交金额占比：" prop="ratioAmt" class="form-inline">
                <el-input v-model="ruleForm.ratioAmt" class="smallText" placeholder="请输入基准日成交金额占比"></el-input>
                <span>&nbsp;以上</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="趋同买入股票数量占比：" prop="buyRatioCnt" class="form-inline">
                <el-input v-model="ruleForm.buyRatioCnt" class="smallText" placeholder="请输入趋同买入股票数量占比"></el-input>
                <span>&nbsp;以上</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="趋同买入股票数量：" prop="buyTradeCnt" class="form-inline">
                <el-input v-model="ruleForm.buyTradeCnt" class="smallText" placeholder="请输入趋同买入股票数量"></el-input>
                <span>&nbsp;以上</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="账户总成交金额：" prop="buyTradeAmt" class="form-inline">
                <el-input v-model="ruleForm.buyTradeAmt" class="smallText" placeholder="请输入账户总成交金额"></el-input>
                <span>&nbsp;万元以上</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="check5m" label-width="80px" class="form-inline">
                <el-checkbox v-model="ruleForm.check5m">基准账户单日单股票买入金额达500万元</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item prop="orgztAcct" class="form-inline">
              <el-button type="text" @click="agencyVisible = true" size="small" style="margin-left: 12%;">
                <span style="color: #ff402b;">*</span>选择机构账户
              </el-button>
            </el-form-item>
            <el-dialog title="选择机构账户" :visible.sync="agencyVisible" width="72%" left>
              <el-row>
                <el-col :span="12">
                  <el-col style="margin-bottom: 10px">机构账户导入（{{tansTableData.length}}）</el-col>
                  <el-col>
                    <el-form-item label="私募类型：" prop="smtype" label-width="110px" class="form-inline">
                      <el-select
                        v-model="smtype"
                        @change="typeChange"
                        size="small">
                        <el-option
                          v-for="item in typeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="12">已选中的机构账户({{tansTableValue.length}})</el-col>
              </el-row>
              <el-row style="margin-bottom: 10px">
                <TransferTable
                  :data="tansTableData"
                  :columns="tansTableColumns"
                  :value="tansTableValue"
                  @change="changeTans"
                  @update="updateTans"></TransferTable>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="searchkeyWord" label-width="40px" class="form-inline">
                    <el-input v-model="searchkeyWord" placeholder="搜索关键字"></el-input>
                  </el-form-item>
                  <el-form-item class="form-inline" label-width="50px">
                    <el-button type="primary" @click="srarchKey">查询</el-button>
                    <el-button type="text" @click="resetKey">重置</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="searchkeyCode" label-width="40px" class="form-inline">
                    <el-input v-model="searchkeyCode" placeholder="搜索关键字"></el-input>
                  </el-form-item>
                  <el-form-item class="form-inline" label-width="20px">
                    <el-button type="primary" @click="srarchCode">查询</el-button>
                    <el-button type="text" @click="resetCode">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <p style="color: rgba(242, 88, 85, 0.7);">注：机构账户取的是最新机构账户；剔除指定账户：剔除账户名称里含“指数”、“券商”、“货币”的账户</p>
              </el-row>
              <el-row type="flex" justify="center">
                <el-form-item class="form-inline" label-width="0px">
                  <el-button type="primary" @click="saveAccount">保留账户</el-button>
                  <el-button type="primary" @click="exportAccount">账户导出</el-button>
                  <el-button type="primary" @click="cutSpecial">剔除指定账户</el-button>
                  <el-button type="text" @click="agencyVisible = false">返回</el-button>
                </el-form-item>
              </el-row>
            </el-dialog>
          </el-row>
        </div>
        <el-row style="text-align: center;">
          <i @click="arrowDown" v-bind:class="{'el-icon-arrow-down':isiconNameA, 'el-icon-arrow-up':isiconNameB}"
             style="font-size: 20px;"></i>
        </el-row>
      </el-form>
    </el-card>
    <s-table
      ref="marginTable"
      :columns="columns"
      :data="tableData"
      @handleRowDbClick="drilling"
      @getPageination="getPageination">
      <el-button slot="elCardHeader" type="info" @click="handleDownload" :disabled="isAbled" size="small">导出</el-button>
      <el-tabs slot="tableHeader" v-model="activeName" @tab-click="changeTable">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.key"
          :label="item.label"
          :name="item.name">
        </el-tab-pane>
      </el-tabs>
    </s-table>
    <el-dialog :visible.sync="tableDialogShow" width="72%" left>
      <el-row>
        <el-button type="primary" @click="getTable('a')" style="margin-left: 30%">趋同明细</el-button>
        <el-button type="primary" @click="getTable('b')">基准账户交易流水</el-button>
        <el-button type="primary" @click="getTable('c')">趋同账户交易流水</el-button>
      </el-row>
      <s-table
        ref="marginTable2"
        :headerTitle="headerTitle"
        :columns="columns2"
        :data="tableData2"
        @getPageination="getPageination2">
      </s-table>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from '../../../components/common/Breadcrumb'
  import ExcelUpload from '../../common/ExcelUpload'
  import TransferTable from '../../../components/base/transferTable'
  import SDatePicker from '../../base/SDatePicker'
  import moment from 'moment'
  import {getRelativeTradeDate} from '../../../service/common/commonFunc'
  import {
    getMetadataTag1,
    getOrginazationExport,
    postconverTradeTwo,
    postconverTradeTwoDrilling
  } from '../../../service/analysisTool/specificTool/index'

  export default {
    components: {
      SDatePicker,
      Breadcrumb, // 面包屑
      ExcelUpload, // 上传
      TransferTable, // 穿梭框
      STable: () => import('@/components/base/STable')
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '/analysisTool',
            label: '分析工具'
          }, {
            router: '/dimensionTable',
            label: '特定工具'
          }, {
            router: '/convergenceTradesTwo',
            label: '趋同交易-模块二'
          }
        ],
        tansTableColumns: [
          {label: '账户类型', field: 'acct_type', align: 'center', sortable: true},
          {label: '账户名称', field: 'acct_name', align: 'center', sortable: true},
          {label: '账户代码', field: 'acct_code', align: 'center'},
          {label: '会员名称', field: 'member_name', align: 'center'}
        ],
        tansTableData: [],
        tansTableDataAll: [], // 未经关键字搜索前
        tansTableValue: [],
        tansTableValueAll: [], // 未经关键字搜索前
        showCondition: false,
        isiconNameA: true,
        isiconNameB: false,
        defaultDate: '',
        ruleForm: {
          contraDate: [],
          isContnT: false,
          beforDay: '',
          afterDay: '',
          mktNeg: '',
          ratioAmt: '0.3',
          buyRatioCnt: '0.3',
          buyTradeCnt: '10',
          buyTradeAmt: '',
          check5m: false,
          orgztAcct: ''// 选择机构账户
        },
        rules: {
          contraDate: [
            { required: true, message: '请选择起止日期', trigger: 'change' }
          ],
          beforDay: [
            { required: true, message: '请输入前N交易日', trigger: 'change' }
          ],
          afterDay: [
            { required: true, message: '请输入后N交易日', trigger: 'change' }
          ],
          mktNeg: [
            { required: true, message: '请输入期末流通市值', trigger: 'change' },
            { type: 'number', max: 50, message: '股票期末流通市值最大50', trigger: 'change' }
          ],
          ratioAmt: [
            { required: true, message: '请输入基准日成交金额占比', trigger: 'change' }
          ],
          buyRatioCnt: [
            { required: true, message: '请输入趋同买入股票数量占比', trigger: 'change' }
          ],
          buyTradeCnt: [
            { required: true, message: '请输入趋同买入股票数量', trigger: 'change' }
          ],
          buyTradeAmt: [
            { required: true, message: '请输入账户总成交金额', trigger: 'change' }
          ],
          orgztAcct: [
            { required: true, message: '请选择机构账户', trigger: 'change' }
          ]
        },
        agencyVisible: false,
        searchkeyCode: '',
        searchkeyWord: '',
        smtype: '',
        typeOptions: [],
        setDateDisabled: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        isAbled: true,
        activeName: 'tablepan1',
        tableData: {},
        columns: [],
        tabList: [
          {label: '汇总表', name: 'tablepan1'},
          {label: '趋同明细表', name: 'tablepan2'},
          {label: '趋同明细表（对单账户）', name: 'tablepan3'},
          {label: '账户趋同明细', name: 'tablepan4'},
          {label: '账户趋同明细（对单账户）', name: 'tablepan5'}
        ],
        table: {
          // 汇总表
          theadList1: [
            {label: '账户组', field: 'grp', align: 'left', width: '130', sortable: true},
            {label: '账户代码', field: 'acct_id', align: 'left', width: '130', sortable: true},
            {label: '账户名称', field: 'acct_name', align: 'left', width: '130'},
            {label: '总体交易股票只数', field: 'trade_sec_num_all', align: 'right', width: '130'},
            {label: '总体买入股票只数', field: 'buy_sec_num_all', align: 'right', width: '130'},
            {label: '总体成交金额(万元)', field: 'trade_amt_all', align: 'right', width: '130'},
            {label: '总体买入股数(万股)', field: 'buy_vol_all', align: 'right', width: '130'},
            {label: '总体买入金额(万元)', field: 'buy_amt_all', align: 'right', width: '130'},
            {label: '总体卖出股数(万股)', field: 'sell_vol_all', align: 'right', width: '130'},
            {label: '总体卖出金额(万元)', field: 'sell_amt_all', align: 'right', width: '130'},
            {label: '趋同买入股票只数', field: 'qt_buy_sec_num', align: 'right', width: '130'},
            {label: '趋同成交金额(万元)', field: 'qt_trade_amt', align: 'right', width: '130'},
            {label: '趋同买入股数(万股)', field: 'qt_buy_vol', align: 'right', width: '130'},
            {label: '趋同买入金额(万元)', field: 'qt_buy_amt', align: 'right', width: '130'},
            {label: '趋同卖出股数(万股)', field: 'qt_sell_vol', align: 'right', width: '130'},
            {label: '趋同卖出金额(万元)', field: 'qt_sell_amt', align: 'right', width: '130'},
            {label: '趋同买股票数占比(%)', field: 'ratio_qt_buy_sec_num', align: 'right', width: '130'},
            {label: '趋同买金额占比(%)', field: 'ratio_qt_buy_amt', align: 'right', width: '130'}
          ],
          // 趋同明细表, 趋同明细表（对单账户）
          theadList2: [
            {label: '日期', field: 'trade_date', align: 'left', width: '130', sortable: true},
            {label: '账户组', field: 'grp', align: 'left', width: '130'},
            {label: '账户代码', field: 'acct_id', align: 'left', width: '130', sortable: true},
            {label: '账户名称', field: 'acct_name', align: 'left', width: '130'},
            {label: '股票类型', field: 'sec_type', align: 'left', width: '130'},
            {label: '股票代码', field: 'sec_code', align: 'left', width: '130', sortable: true},
            {label: '股票名称', field: 'sec_name', align: 'left', width: '130'},
            {label: '买入数量', field: 'buy_vol', align: 'right', width: '130'},
            {label: '买入金额', field: 'buy_amt', align: 'right', width: '130'},
            {label: '卖出数量', field: 'sell_vol', align: 'right', width: '130'},
            {label: '卖出金额', field: 'sell_amt', align: 'right', width: '130'}
          ],
          // 账户趋同明细
          theadList3: [
            {label: '基准账户代码', field: 'base_acct_id', align: 'left', width: '130', sortable: true},
            {label: '基准账户名称', field: 'base_acct_name', align: 'left', width: '130'},
            {label: '趋同账户代码', field: 'acct_id', align: 'left', width: '130', sortable: true},
            {label: '趋同账户名称', field: 'acct_name', align: 'left', width: '130'},
            {label: '与基准账户达到趋同比例账户数', field: 'acct_num', align: 'right', width: '160'},
            {label: '基准账户趋同日平均单日买入金额大于500万元股票只数', field: 'buy_sec_num_50m', align: 'right', width: '200'},
            {label: '基准账户买入日平均单日买入金额大于500万元股票只数', field: 'buy_sec_num_50m_all', align: 'right', width: '200'},
            {label: '趋同账户买入日平均单日买入股票只数', field: 'acct_buy_sec_num_all', align: 'right', width: '190'},
            {label: '买入趋同开始日期', field: 'start_date', align: 'left', width: '130'},
            {label: '买入趋同结束日期', field: 'end_date', align: 'left', width: '130'},
            {label: '趋同买入次数', field: 'qt_num', align: 'right', width: '130'},
            {label: '趋同买入股票只数', field: 'buy_sec_num', align: 'right', width: '130'},
            {label: '趋同买入数量(万股)', field: 'buy_vol', align: 'right', width: '130'},
            {label: '趋同买入金额(万元)', field: 'buy_amt', align: 'right', width: '130'},
            {label: '趋同买入股票数占比(%)', field: 'ratio_buy_sec_num', align: 'right', width: '130'},
            {label: '趋同买入金额占比(%)', field: 'ratio_buy_amt', align: 'right', width: '130'},
            {label: '总体买入股票只数', field: 'buy_sec_num_all', align: 'right', width: '130'},
            {label: '总体买入股数(万股)', field: 'buy_vol_all', align: 'right', width: '130'},
            {label: '总体买入金额(万元)', field: 'buy_amt_all', align: 'right', width: '130'},
            {label: '总体卖出股票只数', field: 'sell_sec_num_all', align: 'right', width: '130'},
            {label: '总体卖出股数(万股)', field: 'sell_vol_all', align: 'right', width: '130'},
            {label: '总体卖出金额(万元)', field: 'sell_amt_all', align: 'right', width: '130'},
            {label: '趋同账户总体交易流通市值1000亿元以上股票只数占比(%)', field: 'ratio_buy_sec_num_mktneg_100b', align: 'right', width: '200'},
            {label: '趋同账户总体交易流通市值1000亿元以上股票金额(%)', field: 'ratio_buy_amt_mktneg_100b', align: 'right', width: '200'},
            {label: '趋同买入金额第一股票买入交易天数(基准账户)', field: 'buy_day_num_base_rank1', align: 'right', width: '190'},
            {label: '趋同买入金额第一股票买入交易天数(趋同账户)', field: 'buy_day_num_rank1', align: 'right', width: '190'},
            {label: '趋同买入金额第二股票买入交易天数(基准账户)', field: 'buy_day_num_base_rank2', align: 'right', width: '190'},
            {label: '趋同买入金额第二股票买入交易天数(趋同账户)', field: 'buy_day_num_rank2', align: 'right', width: '190'},
            {label: '趋同买入金额第三股票买入交易天数(基准账户)', field: 'buy_day_num_base_rank3', align: 'right', width: '190'},
            {label: '趋同买入金额第三股票买入交易天数(趋同账户)', field: 'buy_day_num_rank3', align: 'right', width: '190'}
          ],
          // 账户趋同明细（对单账户）
          theadList4: [
            {label: '基准账户代码', field: 'base_acct_id', align: 'left', width: '130', sortable: true},
            {label: '基准账户名称', field: 'base_acct_name', align: 'left', width: '130'},
            {label: '趋同账户代码', field: 'acct_id', align: 'left', width: '130', sortable: true},
            {label: '趋同账户名称', field: 'acct_name', align: 'left', width: '130'},
            {label: '与基准账户达到趋同比例账户数', field: 'acct_num', align: 'right', width: '160'},
            {label: '基准账户趋同日平均单日买入金额大于500万元股票只数', field: 'buy_sec_num_50m', align: 'right', width: '200'},
            {label: '基准账户买入日平均单日买入金额大于500万元股票只数', field: 'buy_sec_num_50m_all', align: 'right', width: '200'},
            {label: '趋同账户买入日平均单日买入股票只数', field: 'acct_buy_sec_num_all', align: 'right', width: '190'},
            {label: '买入趋同开始日期', field: 'start_date', align: 'right', width: '130'},
            {label: '买入趋同结束日期', field: 'end_date', align: 'right', width: '130'},
            {label: '趋同买入次数', field: 'qt_num', align: 'right', width: '130'},
            {label: '趋同买入股票只数', field: 'buy_sec_num', align: 'right', width: '130'},
            {label: '趋同买入数量(万股)', field: 'buy_vol', align: 'right', width: '130'},
            {label: '趋同买入金额(万元)', field: 'buy_amt', align: 'right', width: '130'},
            {label: '趋同买入股票数占比(%)', field: 'ratio_buy_sec_num', align: 'right', width: '130'},
            {label: '趋同买入金额占比(%)', field: 'ratio_buy_amt', align: 'right', width: '130'},
            {label: '总体买入股票只数', field: 'buy_sec_num_all', align: 'right', width: '130'},
            {label: '总体买入股数(万股)', field: 'buy_vol_all', align: 'right', width: '130'},
            {label: '总体买入金额(万元)', field: 'buy_amt_all', align: 'right', width: '130'},
            {label: '总体卖出股票只数', field: 'sell_sec_num_all', align: 'right', width: '130'},
            {label: '总体卖出股数(万股)', field: 'sell_vol_all', align: 'right', width: '130'},
            {label: '总体卖出金额(万元)', field: 'sell_amt_all', align: 'right', width: '130'},
            {label: '趋同账户总体交易流通市值1000亿元以上股票只数占比(%)', field: 'ratio_buy_sec_num_mktneg_100b', align: 'right', width: '200'},
            {label: '趋同账户总体交易流通市值1000亿元以上股票金额(%)', field: 'ratio_buy_amt_mktneg_100b', align: 'right', width: '200'},
            {label: '趋同买入金额第一股票买入交易天数(基准账户)', field: 'buy_day_num_base_rank1', align: 'right', width: '190'},
            {label: '趋同买入金额第一股票买入交易天数(趋同账户)', field: 'buy_day_num_base_rank1', align: 'right', width: '190'},
            {label: '趋同买入金额第二股票买入交易天数(基准账户)', field: 'buy_day_num_base_rank2', align: 'right', width: '190'},
            {label: '趋同买入金额第二股票买入交易天数(趋同账户)', field: 'buy_day_num_rank2', align: 'right', width: '190'},
            {label: '趋同买入金额第三股票买入交易天数(基准账户)', field: 'buy_day_num_base_rank3', align: 'right', width: '190'},
            {label: '趋同买入金额第三股票买入交易天数(趋同账户)', field: 'buy_day_num_rank3', align: 'right', width: '190'}
          ],
          // 基准账户交易流水, 趋同账户交易流水
          theadList5: [
            {label: '日期', field: 'trade_date', align: 'left', width: '130', sortable: true},
            {label: '账户代码', field: 'acct_id', align: 'left', width: '130', sortable: true},
            {label: '账户名称', field: 'acct_name', align: 'left', width: '130', sortable: true},
            {label: '股票类型', field: 'sec_type', align: 'left', width: '130'},
            {label: '股票代码', field: 'sec_code', align: 'left', width: '130', sortable: true},
            {label: '股票名称', field: 'sec_name', align: 'left', width: '130'},
            {label: '买入数量（股）', field: 'buy_vol', align: 'right', width: '150'},
            {label: '买入金额（元）', field: 'buy_amt', align: 'right', width: '150'},
            {label: '卖出数量（股）', field: 'sell_vol', align: 'right', width: '150'},
            {label: '卖出金额（元）', field: 'sell_amt', align: 'right', width: '150'}
          ],
          data1: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data2: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data3: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data4: {data: [], total: 0, pageIndex: 1, pageRows: 10},
          data5: {data: [], total: 0, pageIndex: 1, pageRows: 10}
        },
        //  弹窗表格
        tableDialogShow: false,
        jzAcctCode: '', //  取存表格中的基准账户代码
        qtAcctCode: '', //  取存表格中的基准账户代码
        resType: '', //  查询类型：res1 : 趋同明细; res2 : 基准账户交易流水; res3 : 趋同账户交易流水
        columns2: [],
        tableData2: {data: [], total: 0, pageIndex: 1, pageRows: 10},
        rightKeyFlag: false, //  右侧关键字搜索标志
        qryId: '',
        headerTitle: '',
        pageFlag: false,
        changeData: [] // 穿梭框 change 函数第三个参数
      }
    },
    methods: {
      handleQueryData(qryId, isNewQuery, pageIndex, pageRows, resType) {
        this.isAbled = true
        this.showOrHideLoading(true)
        let params = {
          startDate: moment(this.ruleForm.contraDate[0]).format('YYYYMMDD'),
          endDate: moment(this.ruleForm.contraDate[1]).format('YYYYMMDD'),
          isContnT: this.ruleForm.isContnT == true ? 1 : 0,
          beforDay: Number(this.ruleForm.beforDay),
          afterDay: Number(this.ruleForm.afterDay),
          mktNeg: Number(this.ruleForm.mktNeg),
          ratioAmt: Number(this.ruleForm.ratioAmt),
          buyRatioCnt: Number(this.ruleForm.buyRatioCnt),
          buyTradeCnt: Number(this.ruleForm.buyTradeCnt),
          buyTradeAmt: Number(this.ruleForm.buyTradeAmt),
          check5m: this.ruleForm.check5m == true ? 1 : 0,
          orgztAcct: this.ruleForm.orgztAcct,
          qryId: qryId,
          isNewQuery: isNewQuery,
          pageIndex: pageIndex,
          pageRows: pageRows,
          isExport: 0,
          resType: resType
        }
        postconverTradeTwo(params).then((resp) => {
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
          this.isAbled = false
          this.showOrHideLoading(false)
          this.qryId = resp.qryId
        })
      },
      changeTable(tab) {
        switch (tab.name) {
          case 'tablepan1':
            this.columns = this.table.theadList1
            this.tableData = this.table.data1
            break
          case 'tablepan2':
            this.columns = this.table.theadList2
            this.tableData = this.table.data2
            break
          case 'tablepan3':
            this.columns = this.table.theadList2
            this.tableData = this.table.data3
            break
          case 'tablepan4':
            this.columns = this.table.theadList3
            this.tableData = this.table.data4
            break
          case 'tablepan5':
            this.columns = this.table.theadList4
            this.tableData = this.table.data5
            break
        }
      },
      getPageination(page) {
        if (this.pageFlag) {
          this.$refs.ruleForm.validate((valid) => {
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
              }
              this.handleQueryData(this.qryId, 0, page.currentPage, page.pageSizeNumber, resType)
            } else {
              this.$message.error('查询失败！请补全查询参数~')
            }
          })
        }
      },
      showOrHideLoading(flag) {
        this.$refs.marginTable.showOrHideLoading(flag)
      },
      // 第四、五表的钻取功能
      drilling(row, event) {
        if (this.activeName === 'tablepan4' || this.activeName === 'tablepan5') {
          // 清空前面的数据
          this.headerTitle = ''
          this.columns2 = []
          this.tableData2 = Object.assign({}, this.tableData2, {data: [], total: 0, pageIndex: 1, pageRows: 10})
          this.jzAcctCode = row.base_acct_id
          this.qtAcctCode = row.acct_id
          this.tableDialogShow = true
        }
      },
      // 钻取功能
      getTable(str) {
        this.tableData2 = Object.assign({}, this.tableData2, {pageIndex: 1, pageRows: 10})
        switch (str) {
          case 'a':
            this.columns2 = this.table.theadList5
            this.headerTitle = '趋同明细'
            this.resType = 'res1'
            break
          case 'b':
            this.columns2 = this.table.theadList2
            this.headerTitle = '基准账户交易流水'
            this.resType = 'res2'
            break
          case 'c':
            this.columns2 = this.table.theadList5
            this.headerTitle = '趋同账户交易流水'
            this.resType = 'res3'
            break
        }
        this.queryDrilling(this.tableData2.pageIndex, this.tableData2.pageRows, this.resType)
      },
      // 钻取查询
      queryDrilling(pageIndex, pageRows, resType) {
        this.showOrHideLoading2(true)
        let drilParams = {
          jzAcctCode: this.jzAcctCode,
          qtAcctCode: this.qtAcctCode,
          resType: resType,
          pageIndex: pageIndex,
          pageRows: pageRows,
          qryId: this.qryId
        }
        postconverTradeTwoDrilling(drilParams).then((resp) => {
          if (resp.res.res1) {
            this.tableData2.data = resp.res.res1
            this.tableData2.total = resp.cnt.res1Cnt
          }
          if (resp.res.res2) {
            this.tableData2.data = resp.res.res2
            this.tableData2.total = resp.cnt.res2Cnt
          }
          if (resp.res.res3) {
            this.tableData2.data = resp.res.res3
            this.tableData2.total = resp.cnt.res3Cnt
          }
          this.showOrHideLoading2(false)
        })
      },
      getPageination2(page) {
        this.tableData2.pageIndex = page.currentPage
        this.tableData2.pageRows = page.pageSizeNumber
        this.queryDrilling(page.currentPage, page.pageSizeNumber, this.resType)
      },
      showOrHideLoading2(flag) {
        this.$refs.marginTable2.showOrHideLoading(flag)
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
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
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.ruleForm.contraDate = this.defaultDate
      },
      // 查询条件收起
      arrowDown() {
        this.showCondition = !this.showCondition
        this.isiconNameA = !this.isiconNameA
        this.isiconNameB = !this.isiconNameB
      },
      /** ************************  机构账户弹窗  ************************ **/
      // 私募类型
      convergenceType() {
        getMetadataTag1('investorType', 'all').then((resp) => {
          resp.forEach((obj) => {
            let newObj = {
              value: obj.text,
              label: obj.text
            }
            this.typeOptions.push(newObj)
          })
        })
      },
      // 下拉框 change 事件
      typeChange(val) {
        let param = {
          acctType: val
          // acctName: this.searchkeyWord
        }
        getOrginazationExport(param).then((resp) => {
          this.tansTableData = this.tansTableDataAll = resp.acctArr
        })
      },
      //  左侧关键字搜索
      srarchKey() {
        let newTansTableData = []
        if (this.changeData.length !== 0) { // 进行过穿梭左侧数据变化
          this.tansTableDataAll = this.tansTableData
        }
        for (let i in this.tansTableDataAll) {
          if (this.tansTableDataAll[i].acct_name.indexOf(this.searchkeyWord) !== -1) {
            newTansTableData.push(this.tansTableDataAll[i])
          }
        }
        this.tansTableData = newTansTableData
      },
      //  重置左侧关键字
      resetKey() {
        if (this.searchkeyWord) {
          this.searchkeyWord = ''
          // 如果右侧有数据穿梭到左侧，则左右合并
          if (this.changeData.length !== 0) {
            for (let i in this.changeData) {
              this.tansTableDataAll.push(this.changeData[i])
            }
          }
          // 重置操作 从 this.tansTableDataAll 去掉 被穿梭的 this.tansTableValue
          this.tansTableData = this.getAfterTansLeftData(this.tansTableDataAll, this.tansTableValue)
        }
      },
      //  右侧关键字搜索
      srarchCode(val) {
        this.tansTableValueAll = this.tansTableValue
        let newTansTableValue = []
        for (let i in this.tansTableValue) {
          if (this.tansTableValue[i].acct_name.indexOf(this.searchkeyCode) !== -1) {
            newTansTableValue.push(this.tansTableValue[i])
          }
        }
        this.tansTableValue = newTansTableValue
        this.rightKeyFlag = true
      },
      //  重置右侧关键字
      resetCode() {
        if (this.rightKeyFlag) {
          this.searchkeyCode = ''
          // 如果左侧有数据穿梭到右侧，则左右合并
          if (this.changeData.length !== 0) {
            for (let i in this.changeData) {
              this.tansTableValueAll.push(this.changeData[i])
            }
          }
          this.tansTableValue = this.tansTableValueAll
          this.rightKeyFlag = false
        }
      },
      // 保留账户 把账户 ID 拼成字符串
      saveAccount() {
        if (this.tansTableValue.length > 0) {
          let orgztAcctStr = ''
          for (let i in this.tansTableValue) {
            orgztAcctStr += this.tansTableValue[i].acct_code + ','
          }
          this.ruleForm.orgztAcct = orgztAcctStr.substr(0, orgztAcctStr.length - 1)
          this.$message.success('账户已保留')
        } else {
          this.$message.info('暂无可保留账户')
        }
      },
      // 账户导出
      exportAccount() {
        if (this.ruleForm.orgztAcct !== '') {
          this.$message.info('正在导出，请稍等~')
          let param = {
            acctCodes: this.ruleForm.orgztAcct,
            fileType: 'xlsx',
            tableColumns: [
              {sheetName: '机构账户', fileColumns: this.tansTableColumns}
            ]
          }
          this.gfnExportFileWithForm('/specialqry/speclqry/v1/organizat-acct-export', param)
        } else {
          this.$message.info('请先点击保留账户')
        }
      },
      // 剔除指定账户 剔除账户名称里含“指数”、“券商”、“货币”的账户
      cutSpecial() {
        let len = this.tansTableDataAll.length
        if (len > 0) {
          let newTansTableDataAll = []
          for (let i in this.tansTableDataAll) {
            if (this.tansTableDataAll[i].acct_name.indexOf('指数') === -1 &&
              this.tansTableDataAll[i].acct_name.indexOf('券商') === -1 &&
              this.tansTableDataAll[i].acct_name.indexOf('货币') === -1) {
              newTansTableDataAll.push(this.tansTableDataAll[i])
            }
          }
          this.tansTableData = newTansTableDataAll
          let cutNum = len - this.tansTableData.length
          this.$message.success('剔除' + cutNum + '条记录')
        }
      },
      // 穿梭框左右侧数据更新
      updateTans(right, left) {
        this.tansTableData = left
        this.tansTableValue = right
      },
      // change 事件
      changeTans(value, direction, moved) {
        this.changeData = moved
      },
      // 穿梭框左侧去掉穿梭到右边的数据
      getAfterTansLeftData (arr1, arr2) {
        if (arr2.length !== 0) {
          for (let i in arr1) {
            for (let j in arr2) {
              if (arr1[i].acct_code === arr2[j].acct_code) {
                arr1.splice(i, 1)
              }
            }
          }
        }
        return arr1
      },
      handleDownload() {
        this.$message.info('正在导出，请稍等~')
        let params = {
          startDate: moment(this.ruleForm.contraDate[0]).format('YYYYMMDD'),
          endDate: moment(this.ruleForm.contraDate[1]).format('YYYYMMDD'),
          isContnT: this.ruleForm.isContnT == true ? 1 : 0,
          beforDay: Number(this.ruleForm.beforDay),
          afterDay: Number(this.ruleForm.afterDay),
          mktNeg: Number(this.ruleForm.mktNeg),
          ratioAmt: Number(this.ruleForm.ratioAmt),
          buyRatioCnt: Number(this.ruleForm.buyRatioCnt),
          buyTradeCnt: Number(this.ruleForm.buyTradeCnt),
          buyTradeAmt: Number(this.ruleForm.buyTradeAmt),
          check5m: this.ruleForm.check5m == true ? 1 : 0,
          orgztAcct: this.ruleForm.orgztAcct,
          qryId: this.qryId,
          isExport: 1,
          resType: 'ALL',
          fileType: 'xlsx',
          tableColumns: [
            {sheetName: '汇总表', fileColumns: this.table.theadList1},
            {sheetName: '趋同明细表', fileColumns: this.table.theadList2},
            {sheetName: '趋同明细表（对单账户）', fileColumns: this.table.theadList2},
            {sheetName: '账户趋同明细', fileColumns: this.table.theadList3},
            {sheetName: '账户趋同明细（对单账户）', fileColumns: this.table.theadList4}
          ]
        }
        this.gfnExportFileWithForm('/specialqry/speclqry/v1/simltract2-elk-export', params)
      }
    },
    mounted() {
      //  默认展示第一个标签页
      this.columns = this.table.theadList1
      this.tableData = this.table.data1
      getRelativeTradeDate(-1).then((resp) => {
        this.defaultDate = [moment(resp).format('YYYY-MM-DD'), moment(resp).format('YYYY-MM-DD')];
        this.ruleForm.contraDate = this.defaultDate
      })
      // 机构账户导入类型
      this.convergenceType()
    }
  }
</script>

<style lang="less">
  .converttradesTwo {
    .el-dialog .el-dialog__header .el-dialog__title {
      font-size: 20px;
    }
    .el-transfer-panel {
      width: 43% !important;
    }
    .form-inline {
      display: inline-block;
    }
    .smallText {
      width: 70%;
    }
  }
</style>
