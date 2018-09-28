<template>
  <div class="manipulateIllegalIncome">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" size="small"
               style="margin-top: 20px">
        <el-row>
          <el-form-item label="操纵类型：" prop="operateType" class="form-inline">
            <el-radio-group v-model="ruleForm.operateType">
              <el-radio label="0">传统坐庄型操纵</el-radio>
              <el-radio label="1">抢帽子（黑嘴）蛊惑交易</el-radio>
              <el-radio label="2">短线操纵</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="成本计算：" prop="costType" class="form-inline" v-if="ruleForm.operateType === '2'">
            <el-radio-group v-model="ruleForm.costType">
              <el-radio label="0">实际成本</el-radio>
              <el-radio label="1">操纵前一笔成交价格</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="案件类型：" prop="caseType" class="form-inline" v-if="ruleForm.operateType === '2'">
            <el-radio-group v-model="ruleForm.caseType">
              <el-radio label="0">操纵开盘价</el-radio>
              <el-radio label="1">盘中短线操纵</el-radio>
              <el-radio label="3">操纵收盘价</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="尾盘时间：" prop="lateTime" class="form-inline"
                        v-if="ruleForm.operateType === '2' && ruleForm.caseType === '3'">
            <el-time-picker
              clearable
              v-model="ruleForm.lateTime"
              placeholder="请选择尾盘时间"
              :picker-options="setTimeDisabled"
              size="small">
            </el-time-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="佣金估算比率：" prop="rate" class="form-inline">
            <el-input v-model="ruleForm.rate" placeholder="请输入佣金估算比率" clearable></el-input>
          </el-form-item>
          <el-form-item label="导入计算区间表：" prop="acctArr" class="form-inline">
            <excel-upload class="form-inline" :uploadParams="uploadParams" @fileData="setFileData"></excel-upload>
            <el-tag :type="uploadStatus" style="margin: 0 10px 0 10px"> {{ uploadText }}</el-tag>
            <!--<el-button size="small" class="form-inline"  @click="downloadExcelMould" type="primary">下载模板</el-button>-->
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button type="info" @click="handleDownload" :disabled="isAbled" size="small">导出</el-button>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.index"
          :label="item.label"
          :name="item.name">
          <margin-table
            v-if="ruleForm.operateType === '0'"
            :maxHeight="480"
            :columns="columns.trad[item.index]"
            :data="tableData.trad[item.index]"
            @getPageination="getPageination">
            <el-table-column
              v-if="item.name==='matchDetailTable'"
              slot="tableColumnsUnshift"
              type="index"
              width="80"
              label="序号">
            </el-table-column>
          </margin-table>
          <margin-table
            v-if="ruleForm.operateType === '1'"
            :maxHeight="480"
            :columns="columns.hat[item.index]"
            :data="tableData.hat[item.index]"
            @getPageination="getPageination">
            <el-table-column
              v-if="item.name==='matchDetailTable'"
              slot="tableColumnsUnshift"
              type="index"
              width="80"
              label="序号">
            </el-table-column>
          </margin-table>
          <margin-table
            v-if="ruleForm.operateType === '2'"
            :maxHeight="480"
            :columns="columns.short[item.index]"
            :data="tableData.short[item.index]"
            @getPageination="getPageination">
            <el-table-column
              v-if="item.name==='matchDetailTable'"
              slot="tableColumnsUnshift"
              type="index"
              width="80"
              label="序号">
            </el-table-column>
          </margin-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import breadcrumb from '../../../components/common/Breadcrumb'
  import MarginTable from '@/components/base/MarginTable'
  import ExcelUpload from '../../common/ExcelUpload'
  // import moment from 'moment'
  // import {postconverTradeOne} from '../../../service/analysisTool/specificTool/index'

  export default {
    components: {
      breadcrumb,
      ExcelUpload,
      MarginTable
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
            router: '/manipulateIllegalIncome',
            label: '市场操纵违法所得计算'
          }
        ],
        ruleForm: {
          operateType: '0',
          costType: '',
          caseType: '',
          lateTime: '',
          rate: '0.003',
          acctArr: []
        },
        rules: {
          operateType: [
            {required: true, message: '请选择操纵类型', trigger: 'change'}
          ],
          costType: [
            {required: true, message: '请选择成本计算', trigger: 'change'}
          ],
          caseType: [
            {required: true, message: '请选择案件类型', trigger: 'change'}
          ],
          lateTime: [
            {required: true, message: '请选择尾盘时间', trigger: 'change'}
          ]
        },
        setTimeDisabled: {},
        uploadParams: {
          loading: false,
          label: '上传Excel',
          type: 'primary',
          params: [
            {
              firstToSkip: 1, // 前置忽略项
              lastToAbandon: 0, // 后置忽略项
              fields: ['grp', 'accountCode', 'startDate', 'endDate', 'tax']
            }
          ]
        },
        uploadText: '未上传',
        uploadStatus: 'danger',
        loading: false,
        isAbled: true,
        qryId: '',
        activeName: 'summaryTable',
        tabList: [
          {index: 1, label: '违法所得汇总表', name: 'summaryTable'},
          {index: 2, label: '成交明细表', name: 'dealDetailTable'},
          {index: 3, label: '匹配明细表', name: 'matchDetailTable'}
        ],
        tableData: {
          trad: {
            1: {data: [], total: 0, pageIndex: 1, pageRows: 10},
            2: {data: [], total: 0, pageIndex: 1, pageRows: 10},
            3: {data: [], total: 0, pageIndex: 1, pageRows: 10}
          },
          hat: {
            1: {data: [], total: 0, pageIndex: 1, pageRows: 10},
            2: {data: [], total: 0, pageIndex: 1, pageRows: 10},
            3: {data: [], total: 0, pageIndex: 1, pageRows: 10}
          },
          short: {
            1: {data: [], total: 0, pageIndex: 1, pageRows: 10},
            2: {data: [], total: 0, pageIndex: 1, pageRows: 10},
            3: {data: [], total: 0, pageIndex: 1, pageRows: 10}
          }
        },
        columns: {
          trad: {
            1: [
              // {label: '证券代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '开始建仓日', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '操纵结束日', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '计算截止日', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入部分匹配卖出量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '买入部分匹配卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '送股部分匹配卖出量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '配股部分匹配卖出量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '配股部分匹配卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '未匹配的剩余买入量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '未匹配的剩余买入金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: 'B日收盘价（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '佣金（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '印花税（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '过户费（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '分红金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '送股数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '配股数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '配股金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '违法所得（未扣除税费）（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '违法所得（已扣除税费）（元）', field: 'min_trading_date1', align: 'right', width: '160'}
            ],
            2: [
              // {label: '交易日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入价格（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出价格（元）', field: 'min_trading_date1', align: 'right', width: '130'}
            ],
            3: [
              // {label: '证券代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '类型', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入价格（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '匹配卖出日期', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出价格（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '匹配数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '匹配部分买入金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配买入量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配买入金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配卖出量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分买佣金（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分买印花税（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分买过户费（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖佣金（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖印花税（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖过户费（元）', field: 'min_trading_date1', align: 'right', width: '160'}
            ]
          },
          hat: {
            1: [
              // {label: '证券代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '开始日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '结束日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '影响消除日', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '卖出量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '最早匹配买入日期', field: 'min_trading_date1', align: 'left', width: '160'},
              // {label: '匹配买入量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配买入金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配送股数量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配配股数量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配配股金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '佣金（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '印花税（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '过户费（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '违法所得（未扣除税费）（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '违法所得（已扣除税费）（元）', field: 'min_trading_date1', align: 'right', width: '160'}
            ],
            2: [
              // {label: '交易日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入价格（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出价格（元）', field: 'min_trading_date1', align: 'right', width: '130'}
            ],
            3: [
              // {label: '证券代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '类型', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入价格（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '匹配卖出日期', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出价格（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '匹配数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '匹配部分买入金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配买入量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配买入金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配卖出量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分买佣金（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分买印花税（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分买过户费（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖佣金（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖印花税（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖过户费（元）', field: 'min_trading_date1', align: 'right', width: '160'}
            ]
          },
          short: {
            1: [
              // {label: '证券代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '操纵日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '操纵开始时点', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '结束日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '卖出量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '最早匹配买入日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '匹配买入量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配买入金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配送股数量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配配股数量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配配股金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '佣金（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '印花税（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '过户费（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '违法所得（未扣除税费）（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '违法所得（已扣除税费）（元）', field: 'min_trading_date1', align: 'right', width: '160'}
            ],
            2: [
              // {label: '交易日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入价格（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出价格（元）', field: 'min_trading_date1', align: 'right', width: '130'}
            ],
            3: [
              // {label: '证券代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '证券名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户代码', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '账户名称', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '类型', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入日期', field: 'min_trading_date1', align: 'left', width: '130'},
              // {label: '买入量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '买入价格（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '匹配卖出日期', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '卖出价格（元）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '匹配数量（股）', field: 'min_trading_date1', align: 'right', width: '130'},
              // {label: '匹配部分买入金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配买入量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配买入金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配卖出量（股）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '剩余未匹配卖出金额（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分买佣金（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分买印花税（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分买过户费（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖佣金（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖印花税（元）', field: 'min_trading_date1', align: 'right', width: '160'},
              // {label: '匹配部分卖过户费（元）', field: 'min_trading_date1', align: 'right', width: '160'}
            ]
          }
        }
      }
    },
    methods: {
      handleQueryData(qryId, isNewQuery, pageIndex, pageRows, resType) {
        this.loading = true
        // let params = {
        //   qryId: qryId,
        //   isNewQuery: isNewQuery,
        //   isExport: 0,
        //   pageIndex: pageIndex,
        //   pageRows: pageRows,
        //   resType: resType
        // }
        // postconverTradeOne({params: JSON.stringify(params)}).then((resp) => {
        //   switch (this.ruleForm.operateType) {
        //     case '0'://  传统坐庄型操纵
        //       if (resp.res.res1) {
        //         this.tableData.trad[1].data = resp.res.res1
        //         this.tableData.trad[1].total = Number(resp.cnt.res1Cnt)
        //       }
        //       if (resp.res.res2) {
        //         this.tableData.trad[2].data = resp.res.res2
        //         this.tableData.trad[2].total = Number(resp.cnt.res2Cnt)
        //       }
        //       if (resp.res.res3) {
        //         this.tableData.trad[3].data = resp.res.res3
        //         this.tableData.trad[3].total = Number(resp.cnt.res3Cnt)
        //       }
        //       break
        //     case '1'://  抢帽子（黑嘴）蛊惑交易
        //       if (resp.res.res1) {
        //         this.tableData.hat[1].data = resp.res.res1
        //         this.tableData.hat[1].total = Number(resp.cnt.res1Cnt)
        //       }
        //       if (resp.res.res2) {
        //         this.tableData.hat[2].data = resp.res.res2
        //         this.tableData.hat[2].total = Number(resp.cnt.res2Cnt)
        //       }
        //       if (resp.res.res3) {
        //         this.tableData.hat[3].data = resp.res.res3
        //         this.tableData.hat[3].total = Number(resp.cnt.res3Cnt)
        //       }
        //       break
        //     case '2'://  短线操纵
        //       if (resp.res.res1) {
        //         this.tableData.short[1].data = resp.res.res1
        //         this.tableData.short[1].total = Number(resp.cnt.res1Cnt)
        //       }
        //       if (resp.res.res2) {
        //         this.tableData.short[2].data = resp.res.res2
        //         this.tableData.short[2].total = Number(resp.cnt.res2Cnt)
        //       }
        //       if (resp.res.res3) {
        //         this.tableData.short[3].data = resp.res.res3
        //         this.tableData.short[3].total = Number(resp.cnt.res3Cnt)
        //       }
        //       break
        //   }
        //   this.loading = false
        //   this.isAbled = false
        // })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleQueryData(this.qryId, '1', 1, 10, 'ALL')
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
      },
      getPageination(page) {
        let resType = ''
        switch (this.activeName) {
          case 'summaryTable':
            resType = 'res1'
            break
          case 'buyDetailTable':
            resType = 'res2'
            break
          case 'saleDetailTable':
            resType = 'res3'
            break
        }
        this.handleQueryData(this.qryId, 0, page.currentPage, page.pageSizeNumber, resType)
      },
      setFileData(val) {
        this.ruleForm.acctArr = val.Sheet0
        this.uploadText = '已上传'
        this.uploadStatus = 'success'
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.loading = false
        this.uploadText = '未上传'
        this.uploadStatus = 'danger'
      },
      handleDownload() {
        this.$message.info('正在导出，请稍等~')
        // let params = {
        //   qryId: this.qryId,
        //   isExport: 1,
        //   resType: 'ALL',
        //   fileType: 'xlsx',
        //   tableColumns: [
        //     {sheetName: '违法所得汇总表', fileColumns: this.columns[1]},
        //     {sheetName: '成交明细表', fileColumns: this.columns[2]},
        //     {sheetName: '匹配明细表', fileColumns: this.columns[3]}
        //   ]
        // }
        // this.gfnExportFileWithForm('/specialqry/speclqry/v1/simltract1-elk-export', params)
      },
      downloadExcelMould() {
        // this.gfnDownloadTemplateFile({ code: '' })
      }
    },
    mounted() {
    }
  }
</script>
<style lang="less">
  .manipulateIllegalIncome {
    .form-inline {
      display: inline-block;
    }
    .smallText {
      width: 26%;
    }
  }
</style>
