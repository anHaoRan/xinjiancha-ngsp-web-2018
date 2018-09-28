<template>
  <div class="reportQuery">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card style="overflow: visible">
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="info" @click="clearQueryParams" size="small">清空</el-button>
        <el-button type="primary" @click="query" size="small">查询</el-button>
      </div>
      <el-form :inline="true" :model="selectParams" ref="selectParams" label-width="124px" label-position="left">
        <el-row :gutter="20">
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="日期范围" prop="rangeDate">
              <el-date-picker
                v-model="selectParams.rangeDate"
                type="daterange"
                size="small"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="记录人">
              <selector-dealer class="customize-width" ref="selectorDealer" @node-click="handlerClick"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="日志类型">
              <el-select class="customize-width" v-model="selectParams.recordType" placeholder="默认全选" size="small">
                <el-option v-for="item in recordTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="证券代码及名称">
              <select-lazy-multiple class="customize-width" :selectParams="codesParams" @getSelectRes="fnGetSelectRes" ref="selectLazyMultiple"></select-lazy-multiple>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="投资者类型">
              <el-select
                v-model="selectParams.investorTypes"
                size="small"
                class="customize-width"
                multiple
                collapse-tags
                placeholder="全选">
                <el-option-group
                  v-for="item in investorTypeOption"
                  :key="item.label"
                  :label="item.label">
                  <el-option
                    v-for="nape in item.options"
                    :key="nape.value"
                    :label="nape.label"
                    :value="nape.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="投资者代码及名称">
              <el-input class="customize-width" v-model="selectParams.investorCode" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="投资者标签">
              <el-input class="customize-width" v-model="selectParams.investorTags" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="调查事项">
              <el-select class="customize-width" collapse-tags v-bind:multiple="true" v-model="selectParams.matters" placeholder="全部" size="small" style="width: 96%;">
                <el-option v-for="item in matterOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="异调行为">
              <el-select class="customize-width" collapse-tags v-bind:multiple="true" v-model="selectParams.attune" placeholder="全部" size="small" style="width: 90%;">
                <el-option v-for="item in attuneOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="关键字">
              <el-input class="customize-width" v-model="selectParams.keyWord" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        <span>监控日志查询列表</span>
        <el-button type="info" size="small" @click="saveLocation">导出</el-button>
        <el-button type="primary" size="small" @click="newBuild">新建</el-button>
      </div>
      <el-table
        :data="superviseLogData"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        max-height="420"
        :reserve-selection="true"
        v-loading="queryResLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.8)"
        style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          v-for="column in superviseLogColumns"
          :key="column.field"
          :align="column.align"
          :prop="column.field"
          :label="column.label"
          :min-width='column.minWidth'>
        </el-table-column>
        <el-table-column
          min-width="6%"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="checkDetails(scope.row)" type="text" size="small" style="border: none;color:#1b5eed">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="selfAccountSizeChange"
          @current-change="selfAccountCurrentChange"
          :current-page="selfCurrentPage"
          :page-sizes="[10,20,30]"
          :page-size="pageSize"
          layout="total,sizes,prev,pager,next,jumper"
          :total="selfPageTotal">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="新建监控日志" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="dialogParams" ref="dialogParams" class="dialogForm" label-width="124px" label-position="left">
        <el-row :gutter="10">
          <el-col :xl="12" :sm="24">
            <el-form-item label="日志类型">
              <el-select class="dialog-width" v-model="dialogParams.recordType" placeholder="默认全选" size="small">
                <el-option v-for="item in recordTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :sm="24">
            <el-form-item label="证券代码及名称">
              <select-lazy-multiple class="dialog-width" :selectParams="codesParamsNew" @getSelectRes="fnGetSelectResNew" style="display: inline-block;"
                                    ref="selectLazyMultiple"></select-lazy-multiple>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :sm="24">
            <el-form-item label="投资者代码及名称">
              <el-input class="dialog-width" v-model="dialogParams.actorCode" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :sm="24">
            <el-form-item label="投资者类型">
              <el-select
                v-model="dialogParams.actorType"
                size="small"
                class="dialog-width"
                multiple
                collapse-tags
                placeholder="全选">
                <el-option-group
                  v-for="item in investorTypeOption"
                  :key="item.label"
                  :label="item.label">
                  <el-option
                    v-for="nape in item.options"
                    :key="nape.value"
                    :label="nape.label"
                    :value="nape.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :sm="24">
            <el-form-item label="投资者标签">
              <el-input class="dialog-width" v-model="dialogParams.invTag" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :sm="24">
            <el-form-item label="指向事件日期">
              <el-date-picker class="dialog-width" v-model="dialogParams.pointDate" type="date" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <el-form-item label="日志内容" class="textContent">
              <el-input style="width: 716px;" type="textarea" rows="5" v-model="dialogParams.record" placeholder="2000字以内"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="24">
            <div style="text-align: center">
              <el-button type="primary" size="small" @click="sureCreateNewLog">确定</el-button>
              <el-button type="info" size="small" @click="cancleCreateNewLog">取消</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="日志详情" :visible.sync="dialogFormDetail">
      <div style="text-align: right">
        <!--<el-button type="info" size="small">导出</el-button>-->
      </div>
      <el-form :inline="true" :model="dialogDetailForm" ref="dialogDetailForm" label-width="130px" label-position="left" class="dialogDetailForm">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-col :xl="12" :sm="24">
              <el-form-item label="日期时间">
                <el-input class="dialog-width" v-model="dialogDetailForm.dateTime" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="12" :sm="24">
              <el-form-item label="记录人">
                <el-input class="dialog-width" v-model="dialogDetailForm.recordName" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="12" :sm="24">
              <el-form-item label="日志类型">
                <el-input class="dialog-width" v-model="dialogDetailForm.recordType" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="12" :sm="24">
              <el-form-item label="证券代码及名称">
                <el-input class="dialog-width" v-model="dialogDetailForm.seccodes" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="12" :sm="24">
              <el-form-item label="投资者代码及名称">
                <el-input class="dialog-width" v-model="dialogDetailForm.investorCode" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="12" :sm="24">
              <el-form-item label="投资者类型">
                <el-input class="dialog-width" v-model="dialogDetailForm.investorTypes" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="12" :sm="24">
              <el-form-item label="投资者标签">
                <el-input class="dialog-width" v-model="dialogDetailForm.investorTag" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="12" :sm="24">
              <el-form-item label="指向事件日期">
                <el-input class="dialog-width" v-model="dialogDetailForm.pointDate" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="24">
              <el-form-item label="日志内容">
                <el-input style="width: 716px;" rows="5" type="textarea" v-model="dialogDetailForm.logContent" size="small" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import Breadcrumb from '../common/Breadcrumb'
  import DownMoreSelect from '../common/downMoreSelect'
  import SelectLazyMultiple from '../common/SelectLazyMultiple'
  import {
    getInvestorType,
    getLogList,
    getLogDetail,
    newLogRecord
  } from '../../service/knowledgeBase/superviseLog/index'

  export default {
    components: {
      SelectorDealer: () => import('@/components/common/SelectorDealer'),
      Breadcrumb,
      DownMoreSelect,
      SelectLazyMultiple
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '',
            label: '监管知识库'
          },
          {
            router: '',
            label: '监控日志'
          }
        ],
        codesParams: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        codesParamsNew: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        selectParams: {
          users: '',
          name: '',
          rangeDate: [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
          recordType: '',
          seccodes: '',
          investorCode: '',
          investorTags: '',
          investorTypes: [],
          matters: [],
          attune: [],
          keyWord: ''
        },
        dialogParams: {
          recordType: '',
          record: '',
          secCode: '',
          actorCode: '',
          actorType: [],
          invTag: '',
          pointDate: '',
          matters: [],
          attune: []
        },
        dialogDetailForm: {
          dateTime: '',
          recordName: '',
          recordType: '',
          seccodes: '',
          investorCode: '',
          investorTypes: '',
          investorTag: '',
          pointDate: '',
          logContent: ''
        },
        investorTypeOption: [
          {
            label: '',
            options: [
              {value: 'member', label: '公司或会员'},
              {value: 'salePart', label: '营业部'},
              {value: 'pbu', label: 'PBU'}
            ]
          },
          {label: '分类投资者', options: []}
        ],
        newTaskInvestorTypeOption: [
          {value: 'member', label: '公司或会员'},
          {value: 'account', label: '账户'},
          {value: 'salePart', label: '营业部'},
          {value: 'pbu', label: 'PBU'}
        ],
        recordTypeOptions: [
          {value: 'alarm_w', label: '预警监控'},
          {value: 'bpm', label: '流程处理'},
          {value: 'fluct', label: '市场运行监测'},
          {value: 'work_memo', label: '工作备忘'},
          {value: 'others', label: '其它'}
        ],
        matterOptions: [
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
        attuneOptions: [
          {
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
          }
        ],
        requestParams: {},
        superviseLogData: [],
        queryResLoading: false,
        superviseLogColumns: [
          {label: '记录日期', field: 'RECORD_DATE', align: 'center', minWidth: '6%'},
          {label: '记录时间', field: 'RECORD_TIME', align: 'center', minWidth: '6%'},
          {label: '记录人', field: 'USER_NAME', align: 'center', minWidth: '6%'},
          {label: '日志类型', field: 'TEXT', align: 'center', minWidth: '6%'},
          {label: '日志内容', field: 'RECORD', align: 'center', minWidth: '6%'},
          {label: '证券代码及名称', field: 'SECCODE_SECNAME', align: 'center', minWidth: '6%'},
          {label: '投资者代码及名称', field: 'INVESTOR_NAME', align: 'center', minWidth: '6%'},
          {label: '投资者标签', field: 'INVESTOR_TAG', align: 'center', minWidth: '6%'},
          {label: '指向事件日期', field: 'POINT_EVENT_DATE', align: 'center', minWidth: '6%'}
        ],
        selfCurrentPage: 1,
        pageSize: 10,
        selfPageTotal: 0,
        dialogFormVisible: false,
        dialogFormDetail: false,
        size: 'small' // 组件输入框大小
      }
    },
    mounted () {
      if (this.$route.query.params) {
        this.dialogFormVisible = true
        // let params = JSON.parse(this.$route.query.params)
        // this.dialogParams.actorCode = params.stockCode + ' ' + params.stockCodeName
      }
      this.query()
      getInvestorType('investorType', 'all').then(resp => {
        this.investorTypeOption[1].options = resp.map((el) => {
          return {value: el.value, label: el.text}
        })
      })
    },
    methods: {
      handlerClick (val) {
        this.selectParams.users = val
      },
      // 获取证券代码
      fnGetSelectRes (val) {
        this.selectParams.seccodes = val.join(',')
      },
      fnGetSelectResNew (val) {
        this.dialogParams.secCode = val.join(',')
      },
      query () {
        this.queryResLoading = true
        this.requestParams = {
          pageNumber: this.selfCurrentPage,
          pageSize: this.pageSize,
          startDate: moment(this.selectParams.rangeDate[0]).format('YYYYMMDD'),
          endDate: moment(this.selectParams.rangeDate[1]).format('YYYYMMDD'),
          users: this.selectParams.users,
          recordType: this.selectParams.recordType,
          seccodes: this.selectParams.seccodes,
          investorCode: this.selectParams.investorCode,
          investorTypes: this.selectParams.investorTypes.join(','),
          investorTags: this.selectParams.investorTags,
          matters: this.selectParams.matters.join(','),
          attune: this.selectParams.attune.join(','),
          keyWord: this.selectParams.keyWord
        }
        getLogList(this.requestParams).then(resp => {
          this.queryResLoading = false
          this.selfPageTotal = resp.count
          this.superviseLogData = resp.data
        })
      },
      clearQueryParams () {
        this.selectParams = {
          users: '',
          name: '',
          rangeDate: [moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
          recordType: '',
          seccodes: '',
          investorCode: '',
          investorTags: '',
          investorTypes: [],
          matters: [],
          attune: [],
          keyWord: ''
        }
        this.codesParams = {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        }
        this.investorTypeOption = [
          {
            label: '',
            options: [
              {value: 'member', label: '公司或会员'},
              {value: 'salePart', label: '营业部'},
              {value: 'pbu', label: 'PBU'}
            ]
          },
          {label: '分类投资者', options: []}
        ]
        this.newTaskInvestorTypeOption = [
          {value: 'member', label: '公司或会员'},
          {value: 'account', label: '账户'},
          {value: 'salePart', label: '营业部'},
          {value: 'pbu', label: 'PBU'}
        ]
      },
      // 自动报告
      selfAccountSizeChange (val) {
        this.pageSize = val
        this.query()
      },
      selfAccountCurrentChange (val) {
        this.selfCurrentPage = val
        this.query()
      },
      newBuild () {
        this.dialogFormVisible = true
      },
      sureCreateNewLog () {
        let params = {
          recordType: this.dialogParams.recordType,
          record: this.dialogParams.record,
          secCode: this.dialogParams.secCode,
          actorCode: this.dialogParams.actorCode,
          actorType: this.dialogParams.actorType.join(','),
          invTag: this.dialogParams.invTag,
          pointDate: this.dialogParams.pointDate,
          matters: this.dialogParams.matters.join(','),
          attune: this.dialogParams.attune.join(',')
        }
        newLogRecord(params).then(resp => {
          if (resp) {
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          } else {
            this.$message.warning('创建失败')
          }
        })
      },
      cancleCreateNewLog () {
        this.dialogParams.recordType = ''
        this.dialogParams.record = ''
        this.dialogParams.secCode = ''
        this.dialogParams.actorCode = ''
        this.dialogParams.actorType = []
        this.dialogParams.invTag = ''
        this.dialogParams.pointDate = ''
        this.dialogParams.matters = []
        this.dialogParams.attune = []
      },
      saveLocation () {
        let params = this.requestParams
        params['type'] = 'watchLog'
        params['fileType'] = 'excel'
        params['tableColumns'] = this.superviseLogColumns
        delete params.pageSize
        delete params.pageNumber
        // console.log(params)
        this.gfnExportFileWithForm('/admin/watch-lore/v1/export', params)
      },
      checkDetails (row) {
        this.dialogFormDetail = true
        let params = {logID: row.ID}
        getLogDetail(params).then(resp => {
          let {RECORD, SECCODE_SECNAME, INVTYPE_NAME, Text, UPDATE_TIME, UPDATE_USER_NAME, INVESTOR_NAME, POINT_EVENT_DATE, INVESTOR_TAG} = resp
          this.dialogDetailForm = {
            dateTime: UPDATE_TIME,
            recordName: UPDATE_USER_NAME,
            recordType: Text,
            seccodes: SECCODE_SECNAME,
            investorCode: INVESTOR_NAME,
            investorTypes: INVTYPE_NAME,
            investorTag: INVESTOR_TAG,
            pointDate: POINT_EVENT_DATE,
            logContent: RECORD
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .reportQuery {
    .customize-width {
      width: 350px !important;
    }
    .dialog-width {
      width: 260px !important;
    }
    .el-card {
      .el-card__body {
        padding: 10px 0;
      }
    }
    .el-form {
      padding-left: 20px;
      .el-form-item {
        padding: 10px 0;
        margin-bottom: 0;
      }
    }
    .el-tabs--card > .el-tabs__header {
      border: none;
      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          margin-bottom: 15px;
        }
        .el-tabs__nav {
          border: none;
          .el-tabs__item.is-active {
            background-color: #1853a5;
            border: 1px solid #1853a5;
            box-sizing: border-box;
          }
          > div {
            height: 30px;
            line-height: 30px;
            margin-right: 2px;
            border: none;
            background-color: #17274b;
            box-sizing: border-box;
            font-size: 14px;
          }
          > div:first-child {
            border-radius: 4px 0 0 4px;
          }
          > div:last-child {
            border-radius: 0 4px 4px 0;
          }
        }
      }
    }
    .dialogForm {
      .el-col {
        padding-bottom: 20px;
      }
      .textContent {
        width: 100%;
        .el-form-item__content {
          width: 88%;
          .el-textarea__inner {
            min-height: 200px !important;
          }
        }
      }
    }
    .dialogDetailForm {
      .el-col {
        padding-bottom: 20px;
        .el-form-item {
          width: 100%;
          .el-form-item__content {
            width: 80%;
          }
          .el-input__inner {
            border: none;
            background-color: transparent;
            color: #fff;
            cursor: auto;
          }
          .el-textarea__inner {
            border: none;
            background-color: transparent;
            color: #fff;
            cursor: auto;
            resize: none;
          }
        }
      }
    }
  }
</style>
