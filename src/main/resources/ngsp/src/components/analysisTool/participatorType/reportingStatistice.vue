<!--申报统计 reportingStatistice -->
<template>
    <div class="reportingStatistice">
        <el-card>
            <div slot="header" class="clearfix">
                <span>查询条件</span>
                <el-button
                        type="text"
                        @click="clearForm"
                        size="small">清空
                </el-button>
                <el-button
                        type="primary" size="small"
                        @click="getQueryRes">查询
                </el-button>
            </div>
            <el-row>
                <el-col :span="8">
                    <el-col :span="5" class="name">
                        <span class="mustInput name">*</span>{{informationCodeType}}代码：
                    </el-col>
                    <el-col :span="11" v-if="participateType== 'account'">
                        <el-input
                                type="text"
                                v-model="commonData.uploadCode"
                                disabled
                                placeholder="请输入参与者代码"
                                size="small">
                        </el-input>
                    </el-col>
                    <el-col :span="11" v-if="participateType== 'uniteCode'">
                        <el-input
                                type="text"
                                v-model="commonData.uploadCode"
                                disabled
                                placeholder="请输入参与者代码"
                                size="small">
                        </el-input>
                    </el-col>
                    <el-col :span="17" v-if="participateType== 'salePart'">
                        <el-select
                                v-model="salePartCodeT"
                                placeholder="请选择类型"
                                size="small"
                                style="width: 100%;">
                            <el-option
                                    v-for="saleitemT in salePartOptionsT"
                                    :key="saleitemT.value"
                                    :label="saleitemT.label"
                                    :value="saleitemT.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <!--含信用代码-->
                <el-col :span="2" style="margin: 6px 0 0 -140px;" v-if="participateType== 'account'">
                    <el-checkbox v-model="reportingsDetails.inCredit" size="small">含信用代码</el-checkbox>
                </el-col>
                <el-col :span="6" :offset="1">
                    <el-col :span="5" class="name">订单类型：</el-col>
                    <el-col :span="18">
                        <el-select
                                v-model="reportingsDetails.orderType"
                                calearabel
                                style="width: 100%;"
                                multiple
                                collapse-tags
                                @change="handleOrderTypeChange"
                                placeholder="请选择订单类型"
                                size="small">
                            <el-option
                                    v-for="item in orderTypeOption"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="6" :offset="1">
                    <el-col :span="5" class="name">信用类型：</el-col>
                    <el-col :span="18">
                        <el-select
                                v-model="reportingsDetails.cardType"
                                calearable
                                style="width: 100%;"
                                multiple
                                collapse-tags
                                @change="handleCreditTypeChange"
                                placeholder="请选择信用类型"
                                size="small">
                            <el-option
                                    v-for="item in cardTypeOption"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-col :span="5" class="name">申报价格：</el-col>
                    <el-col :span="8">
                        <el-input
                                type="text"
                                v-model="reportingsDetails.priceStart"
                                placeholder="请输入申报开始价格"
                                @change="priceStartChange"
                                size="small">
                        </el-input>
                    </el-col>
                    <el-col :span="1" class="middleText name">—</el-col>
                    <el-col :span="8">
                        <el-input
                                v-model="reportingsDetails.priceEnd"
                                placeholder="请输入申报结束价格"
                                @change="priceEndChange"
                                size="small">
                        </el-input>
                    </el-col>
                </el-col>
                <el-col :span="6" :offset="1">
                    <el-col :span="5" class="name">产品类型：</el-col>
                    <el-col :span="18">
                        <el-select
                                class="reportingsDetails-indexs"
                                v-model="reportingsDetails.productType"
                                @change="productChange4"
                                style="width:100%"
                                placeholder="请选择产品类型"
                                size="small">
                            <el-option
                                    v-for="item in productTypeOption"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="6" :offset="1" v-if="stockCodeCYZCX4">
                    <el-col :span="19" v-if="reportCodeCYZCX1">
                        <el-select
                                type="text"
                                clearable
                                v-model="reportingsDetails.securityCode"
                                @change="securityChange"
                                filterable
                                remote
                                reserve-keyword
                                default-first-option
                                multiple
                                collapse-tags
                                :remote-method="intCodeTemoteMethod"
                                :loading="intCodeLoading"
                                placeholder="请选择证券代码"
                                size="small" style="width: 100%;">
                            <el-option
                                    v-for="intCode in inCodeOptions"
                                    :key="intCode.value"
                                    :label="intCode.label"
                                    :value="intCode.value">
                                <div>
                                    <el-checkbox style="width: 100%"
                                                 v-model="salePartValue"
                                                 :label="intCode.value">
                                        {{intCode.label}}
                                    </el-checkbox>
                                </div>
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="19" v-if="reportCodeCYZCX2">
                        <el-input
                                v-model="reportingsDetails.reportCode"
                                type="text"
                                clearable
                                @change="reportCodeChange"
                                placeholder="请输入证券代码"
                                size="small">
                        </el-input>
                    </el-col>

                    <!--上传-->
                    <el-col :span="3" :offset="1">
                        <text-upload @getTxtCon="getTxtData" :uploadOption="uploadOption"
                                     style="display: inline;"></text-upload>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-col :span="5" class="name">申报数量：</el-col>
                    <el-col :span="8">
                        <el-input
                                type="text"
                                v-model="reportingsDetails.numberStart"
                                placeholder="请输入申报开始数量"
                                @change="numberStartChange"
                                size="small">
                        </el-input>
                    </el-col>
                    <el-col :span="1" class="middleText name">—</el-col>
                    <el-col :span="8">
                        <el-input
                                v-model="reportingsDetails.numberEnd"
                                placeholder="请输入申报结束数量"
                                @change="numberEndChange"
                                size="small">
                        </el-input>
                    </el-col>
                </el-col>
            </el-row>
        </el-card>
        <el-card v-if="basiceInformationShow">
            <el-row v-if="participateType === 'account'">
                <div>
                    <span class="mubs">查询结果</span>
                    <el-dropdown @command="handleExportData" style="float: right;">
                        <el-button type="primary" size="mini">
                            导出 <i class="el-icon-arrow-down el-icon-right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="excel"><i class="el-icon-document"></i>全部导出为EXCEL
                            </el-dropdown-item>
                            <el-dropdown-item command="csv"><i class="el-icon-tickets"></i>全部导出为CSV</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <el-col>
                    <el-table
                            border
                            height="400"
                            ref="accountRerf"
                            :data="accountDatas"
                            show-overflow-tooltip
                            highlight-current-row
                            v-loading="loading"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="数据加载中，请耐心等待..."
                            element-loading-background="rgba(0,0,0,0.3)"
                            style="width:100%;">
                        <el-table-column
                                v-for="column in account_JSBTJ_LIST"
                                width="200"
                                :key="column.field"
                                :align="column.align"
                                :label="column.label"
                                :prop="column.field"
                                :sortable="column.sortable == null ? false : column.sortable"
                                :sort-method="column.sortMethod"
                                :min-width=column.minWidth
                                :formatter="column.formatter"
                                show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="22">
                    <el-pagination
                            :page-size="pageSize"
                            layout="total"
                            :total="resultNum">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-row v-if="participateType === 'salePart'">
                <div>
                    <span class="mubs">查询结果</span>
                    <el-dropdown @command="handleExportData" style="float: right;">
                        <el-button type="primary" size="mini">
                            导出 <i class="el-icon-arrow-down el-icon-right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="excel"><i class="el-icon-document"></i>全部导出为EXCEL
                            </el-dropdown-item>
                            <el-dropdown-item command="csv"><i class="el-icon-tickets"></i>全部导出为CSV</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <el-col>
                    <el-table
                            border
                            height="400"
                            ref="accountRerf"
                            :data="accountDatas"
                            show-overflow-tooltip
                            highlight-current-row
                            v-loading="loading"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="数据加载中，请耐心等待..."
                            element-loading-background="rgba(0,0,0,0.3)"
                            style="width:100%;">
                        <el-table-column
                                v-for="column in salePart_JSBTJ_LIST"
                                :key="column.field"
                                :align="column.align"
                                :label="column.label"
                                :prop="column.field"
                                :sortable="column.sortable == null ? false : column.sortable"
                                :sort-method="column.sortMethod"
                                :min-width=column.minWidth
                                :formatter="column.formatter"
                                show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="22">
                    <el-pagination
                            :page-size="pageSize"
                            layout="total"
                            :total="resultNum">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-row v-if="participateType === 'uniteCode'">
                <el-col>
                    <el-col>
                        <span class="mubs">一码通申报统计母表：</span>
                        <el-dropdown @command="handleExportData" style="float: right;">
                            <el-button type="primary" size="mini">
                                导出 <i class="el-icon-arrow-down el-icon-right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="excel"><i class="el-icon-document"></i>全部导出为EXCEL
                                </el-dropdown-item>
                                <el-dropdown-item command="csv"><i class="el-icon-tickets"></i>全部导出为CSV
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                    <el-col>
                        <el-table
                                border
                                height="300"
                                ref="accountRerf"
                                :data="accountDatas"
                                show-overflow-tooltip
                                highlight-current-row
                                v-loading="loading"
                                element-loading-spinner="el-icon-loading"
                                element-loading-text="数据加载中，请耐心等待..."
                                element-loading-background="rgba(0,0,0,0.3)"
                                style="width:100%;">
                            <el-table-column
                                    width="55"
                                    align="center">
                                <template slot-scope="scope">
                                    <!--:label="`${scope.row.instrument_id}${scope.row.id}`"   instrument_id不唯一-->
                                    <el-radio
                                            v-if="scope.row.id"
                                            class="radio" v-model="radio"
                                            :label="scope.$index"
                                            @change="getRadio(scope.row)">
                                    </el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    v-for="column in uniteCode_JSBTJ_LIST"
                                    width="200"
                                    :key="column.field"
                                    :align="column.align"
                                    :label="column.label"
                                    :prop="column.field"
                                    :sortable="column.sortable == null ? false : column.sortable"
                                    :sort-method="column.sortMethod"
                                    :min-width=column.minWidth
                                    :formatter="column.formatter"
                                    show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="22">
                        <el-pagination
                                :page-size="pageSize"
                                layout="total"
                                :total="resultNum">
                        </el-pagination>
                    </el-col>
                </el-col>
                <el-col v-if="uniteCode_wordTable">
                    <el-col :span="24">
                        <span class="mubs">一码通申报统计子表：</span>
                        <el-dropdown @command="handleExportDataDetail" style="float: right;">
                            <el-button type="primary" size="mini">
                                导出 <i class="el-icon-arrow-down el-icon-right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="excel"><i class="el-icon-document"></i>全部导出为EXCEL
                                </el-dropdown-item>
                                <el-dropdown-item command="csv"><i class="el-icon-tickets"></i>全部导出为CSV
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                    <el-col>
                        <el-table
                                border
                                ref="accountRerf_Z"
                                :data="accountDatas_Z"
                                show-overflow-tooltip
                                highlight-current-row
                                v-loading="loading"
                                element-loading-spinner="el-icon-loading"
                                element-loading-text="数据加载中，请耐心等待..."
                                element-loading-background="rgba(0,0,0,0.3)"
                                style="width:100%;">
                            <el-table-column
                                    v-for="column in uniteCode_CCTJ_LISTZ"
                                    :key="column.field"
                                    :align="column.align"
                                    :label="column.label"
                                    :prop="column.field"
                                    :sortable=column.sortable
                                    :sort-method="column.sortMethod"
                                    :formatter="column.formatter"
                                    show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col>
                        <el-pagination
                                :page-size="pageSize"
                                layout="total"
                                :total="resultNum_Z">
                        </el-pagination>
                    </el-col>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
  import TextUpload from '../../common/textUpload'
  import {
    postStatistics, // 参与者查询申报统计情接口
    postSonUniteCodeStatistics, // 一码通申报统计子表查询
    getProductType2, // 产品类型公共接口
    getCreditType2, // 信用类型/订单类型公共接口
    getStockQuery, //  证券代码接口 公共接口
    downloadTransactionStatistice // 导出数据
  } from '@/service/analysisTool/participatorType/index'
import MinxinVue from './MixIn'
  export default {
    name: 'reportingStatistice',
    props: ['commonData', 'informationCodeType', 'currentSelectData'],
    components: {
      TextUpload // 上传账号组件
    },
    mixins: [MinxinVue],
    data () {
      return {
        loading: false,
        basiceInformationShow: false, // 查询结果显示
        salePartCodeT: [],
        salePartOptionsT: [],
        reportingsDetails: {
          inCode: '', // 参与者代码 *
          securityCode: [], // 模糊搜索证券代码
          reportCode: '', // 上传证券代码
          inCredit: false, // 含信用账户
          productType: 'ALL', // 产品类型
          orderType: ['ALL'], // 订单类型
          cardType: ['ALL'], // 信用类型
          priceStart: '', // 申报开始价格
          priceEnd: '', // 申报结束价格
          numberStart: '', // 申报开始数量
          numberEnd: '' // 申报结束数量
        },
        stockCodeCYZCX4: false, // 证券代码（产品类型的值==8）时显示   申报统计
        reportCodeCYZCX2: false,
        reportCodeCYZCX1: true,
        intCodeLoading: true,
        inCodeOptions: [],
        inCodeList: [],
        currentSelectListV: [],
        salePartValue: [],

        uniteCode_wordTable: false, // 字表
        // 产品类型值
        productTypeOption: [
          {
            value: 'ALL',
            label: '全选'
          }
        ],
        // 订单类型
        orderTypeOption: [
          {
            value: 'All',
            label: '全选'
          }
        ],
        // 信用类型
        cardTypeOption: [
          {
            value: 'All',
            label: '全选'
          }
        ],
        // 上传
        uploadOption: {
          name: '上传',
          size: 'small'
        },

        biTableList: [], // tsb 列表
        // 账户
        account_JSBTJ_LIST: [
          {label: '证券代码', field: 'instrument_id', width: '12%', align: 'left', sortable: true},
          {label: '证券名称', field: 'codename', width: '12%', align: 'left', sortable: true},
          {label: '参与者代码', field: 'id', width: '12%', align: 'left', sortable: true},
          {label: '参与者名称', field: 'name', width: '12%', align: 'left', sortable: true},
          {label: '营业部名称', field: 'branch_name', width: '12%', align: 'right', sortable: true},
          {label: '申报买入数量', field: 'b_order_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入未成交量', field: 'b_no_trade_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_no_trade_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入撤单量', field: 'b_cancel_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报卖出数量', field: 's_order_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出未成交量', field: 's_no_trade_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_no_trade_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出撤单量', field: 's_cancel_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报买入次数', field: 'b_order_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入撤单次数', field: 'b_cancel_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报卖出次数', field: 's_order_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出撤单次数', field: 's_cancel_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买方申报均价', field: 'b_order_mktval', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_mktval'), formatter: this.gfnElColFormatDecThou3,format:'#,##0.000'},
          {label: '卖方申报均价', field: 's_order_mktval', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_mktval'), formatter: this.gfnElColFormatDecThou3,format:'#,##0.000'}
        ],
        // 营业部
        salePart_JSBTJ_LIST: [
          {label: '参与者代码', field: 'brnid', width: '20%', align: 'left', sortable: true},
          {label: '参与者名称', field: 'name', width: '12%', align: 'left', sortable: true},
          {label: '证券代码', field: 'instrument_id', width: '12%', align: 'left', sortable: true},
          {label: '证券名称', field: 'codename', width: '12%', align: 'left', sortable: true},
          {label: '申报买入数量', field: 'b_order_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入未成交量', field: 'b_no_trade_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_no_trade_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入撤单量', field: 'b_cancel_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报卖出数量', field: 's_order_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出未成交量', field: 's_no_trade_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_no_trade_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出撤单量', field: 's_cancel_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报买入次数', field: 'b_order_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入撤单次数', field: 'b_cancel_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报卖出次数', field: 's_order_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出撤单次数', field: 's_cancel_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买方申报均价', field: 'b_order_mktval', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_mktval'), formatter: this.gfnElColFormatDecThou3,format:'#,##0.000'},
          {label: '卖方申报均价', field: 's_order_mktval', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_mktval'), formatter: this.gfnElColFormatDecThou3,format:'#,##0.000'}
        ],
        // 一码通母表
        uniteCode_JSBTJ_LIST: [
          {label: '证券代码', field: 'instrument_id', width: '12%', align: 'left', sortable: true},
          {label: '证券名称', field: 'codename', width: '12%', align: 'left', sortable: true},
          {label: '一码通账户', field: 'id', width: '12%', align: 'left', sortable: true},
          {label: '一码通名称', field: 'ymt_account_name', width: '12%', align: 'left', sortable: true}, // {label: "国际码参数", field: "isin_code", width: "12%", align: "right"},
          {label: '申报买入数量', field: 'b_order_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入未成交量', field: 'b_no_trade_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_no_trade_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入撤单量', field: 'b_cancel_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报卖出数量', field: 's_order_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出未成交量', field: 's_no_trade_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_no_trade_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出撤单量', field: 's_cancel_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报买入次数', field: 'b_order_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入撤单次数', field: 'b_cancel_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报卖出次数', field: 's_order_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出撤单次数',field: 's_cancel_num',width: '12%',align: 'right',sortable: true,sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_num'),formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买方申报均价', field: 'b_order_mktval', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_mktval'), formatter: this.gfnElColFormatDecThou3,format:'#,##0.000'},
          {label: '卖方申报均价', field: 's_order_mktval', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_mktval'), formatter: this.gfnElColFormatDecThou3,format:'#,##0.000'}
        ],
        // 一码通子表
        uniteCode_CCTJ_LISTZ: [
          {label: '证券代码', field: 'instrument_id', width: '12%', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')},
          {label: '证券名称', field: 'codename', width: '12%', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'codename')},
          {label: '账户代码', field: 'id', width: '12%', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'id')},
          {label: '账户名称', field: 'name', width: '12%', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'name')},
          {label: '营业部名称', field: 'branch_name', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')},
          {label: '申报买入数量', field: 'b_order_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入未成交量', field: 'b_no_trade_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_no_trade_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入撤单量', field: 'b_cancel_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报卖出数量', field: 's_order_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出未成交量', field: 's_no_trade_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_no_trade_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出撤单量', field: 's_cancel_qty', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_qty'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报买入次数', field: 'b_order_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买入撤单次数', field: 'b_cancel_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_cancel_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '申报卖出次数', field: 's_order_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '卖出撤单次数', field: 's_cancel_num', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_cancel_num'), formatter: this.gfnElColFormatDecThou0,format:'#,##0'},
          {label: '买方申报均价', field: 'b_order_mktval', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'b_order_mktval'), formatter: this.gfnElColFormatDecThou3,format:'#,##0.000'},
          {label: '卖方申报均价', field: 's_order_mktval', width: '12%', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 's_order_mktval'), formatter: this.gfnElColFormatDecThou3,format:'#,##0.000'}
        ],
        accountDatas: [],
        // 一码通持仓统计母表：
        pageSize: 10,
        resultNum: 0,
        // 一码通持仓统计子表：
        accountDatas_Z: [],
        resultNum_Z: 0,
        radio: '',
        radioDisabled: false,

        // 接受父组件的值
        participateType: '', // 账户类型
        declareActorCode: '', // 代码
        declareTime: '', // 开始时间 - 结束日期
        
        salePartVal1: {},
        tableColumnsData: [],
        sheetNameTab: '', // 导出报表名称
        currentSelectedItemIsinCode: '', // 当前选中母表的isInCode

        // 临时检验价格和数量是否正确的变量[解决bug]
        validateQuantityTemp: true,
        validatePriceTemp: true
      }
    },
    methods: {
        /* 导出数据 */
      exportData (type, propsParams) {
        let params = this.getRequestParams()
        params.fileType = type
        params.type = 'DeclaredCount'
        if (Object.keys(propsParams).length) { // 子表tableColumns
          if (propsParams.isinCode) {
            this.tableColumnsData = this.uniteCode_CCTJ_LISTZ
            this.sheetNameTab = '一码通申报统计子表（详情）'
            params.type = 'DeclaredCountSon'
          }
        }
        params.tableColumns = [{
          sheetName: this.sheetNameTab,
          fileColumns: this.tableColumnsData
        }]
        params = {...params, ...propsParams}
        downloadTransactionStatistice(params)
      },
      setSheetName () {
        switch (this.commonData.participateType) {
          case 'account' :
            this.sheetNameTab = '账户申报统计'
            this.tableColumnsData = this.account_JSBTJ_LIST
            break
          case 'uniteCode':
            this.sheetNameTab = '一码通申报统计'
            this.tableColumnsData = this.uniteCode_JSBTJ_LIST
            break
          case 'salePart':
            this.sheetNameTab = '营业部申报统计'
            this.tableColumnsData = this.salePart_JSBTJ_LIST
            break
          case 'member':
            this.sheetNameTab = '券商申报统计'
            break
          case 'pbu':
            this.sheetNameTab = 'PBU申报统计'
            break
        }
      },
      // 导出数据操作
      handleExportData (val) {
        this.setSheetName()
        this.exportData(val, {})
      },
      handleExportDataDetail (val) {
        this.setSheetName()
        this.exportData(val, {
          isinCode: this.currentSelectedItemIsinCode
        })
      },
      // 父组件传值给子组件
      getStockCode () {
        this.participateType = this.commonData.participateType
        this.salePartOptionsT = this.currentSelectData
        if (this.commonData.participateType === 'salePart') {
          for (let i = 0; i < this.currentSelectData.length; i++) {
            this.salePartVal1 = this.currentSelectData[0].value
          }
          this.salePartCodeT = this.salePartVal1
        }
      },
      // 证券代码模糊搜索
      intCodeTemoteMethod (query) {
        if (query !== '') {
          this.intCodeLoading = true
          getStockQuery(query).then((resp) => {
            this.inCodeList = []
            resp.forEach((el) => {
              let objVal = {
                value: el.security_id,
                label: el.security_id + ' ' + el.security_chn_short_name
              }
              this.inCodeList.push(objVal)
            })
            let curArr = this.currentSelectListV
            if (!$.isEmptyObject(curArr)) {
              for (let i = 0; i < curArr.length; i++) {
                for (let j = 0; j < this.inCodeList.length; j++) {
                  if (this.inCodeList[j].value === curArr[i].value) {
                    this.inCodeList.splice(j, 1)
                  }
                }
              }
              this.inCodeList = curArr.concat(this.inCodeList)
            }
            this.inCodeOptions = this.inCodeList
            this.intCodeLoading = false
          })
        } else {
          this.inCodeOptions = []
        }
      },
      // 模糊搜索证券代码
      securityChange (val) {
        let selectVal = []
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.inCodeOptions.length; j++) {
            if (this.inCodeOptions[j].value === val[i]) {
              selectVal.push(this.inCodeOptions[j])
            }
          }
        }
        this.currentSelectListV = selectVal
        // 选定的营业部证券代码
        let salePartOBJ = this.currentSelectListV
        let salePartVAL = ''
        salePartOBJ.forEach((el) => {
          let salePartlABEL = el.label + ','
          salePartVAL += salePartlABEL
        })
        this.salePartListVAL = salePartVAL.substr(0, salePartVAL.length - 1)
      },
      // 上传证券代码
      reportCodeChange (val) {
        if (!val) {
          this.reportCodeCYZCX2 = false
          this.reportCodeCYZCX1 = true
          this.inCodeOptions = []
          this.salePartValue = []
          this.reportingsDetails.securityCode = []
        } else {
          this.reportCodeCYZCX2 = true
          this.reportCodeCYZCX1 = false
        }
      },

      // 获取上传结果
      getTxtData (TxtData) {
        if (TxtData) {
          TxtData = TxtData.join(',')
          this.reportCodeCYZCX2 = true
          this.reportCodeCYZCX1 = false
          this.salePartValue = []
          this.reportingsDetails.reportCode = TxtData
        } else {
          this.salePartValue = []
          this.reportCodeCYZCX2 = false
          this.reportCodeCYZCX1 = true
        }
      },
      //  产品类型下拉内容获取
      productTypeOptions () {
        getProductType2('productType', 'stockWithCol').then((resp) => {
          this.productTypeOption = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.productTypeOption.unshift(All)
        })
      },
      //  订单类型下拉内容获取
      orderSelectOptions () {
        getCreditType2('order').then((resp) => {
          this.orderTypeOption = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.orderTypeOption.unshift(All)
        })
      },
      handleCreditTypeChange(val){
        this.reportingsDetails.cardType = this.orderOrCreditChange(val)
      },
      handleOrderTypeChange(val){
        this.reportingsDetails.orderType = this.orderOrCreditChange(val)
      },
      //  信用类型下拉内容获取
      creditSelectOptions () {
        getCreditType2('credit').then((resp) => {
          this.cardTypeOption = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.cardTypeOption.unshift(All)
        })
      },

      // 申报开始价格
      priceStartChange (value) {
        this.validatePriceTemp = false
        let reg = new RegExp(/^\d+(?:\.\d{1,3})?$/)
        if (value != '') {
          if (value - 0 < 0) {
            this.$message.error('开始价格不能为负值')
            return
          } else {
            if (!(reg.test(value))) {
              this.$message.error('开始价格只能是数字，请重新输入')
              return
            }
          }
        }
        this.reportingsDetails.priceStart = this.gfnFormatDecimal(value,3)
        if (Number(this.reportingsDetails.priceStart) > Number(this.reportingsDetails.priceEnd)) {
          this.$message.error('结束价格不能小于开始价格')
          return
        } else {
          this.validatePriceTemp = true
        }
      },
      // 申报结束价格
      priceEndChange (value) {
        this.validatePriceTemp = false
        let reg = new RegExp(/^\d+(?:\.\d{1,3})?$/)
        if (value != '') {
          if (value - 0 < 0) {
            this.$message.error('结束价格不能为负值')
            return
          } else {
            if (!(reg.test(value))) {
              this.$message.error('价格只能是数字，请重新输入')
              return
            }
          }
        }
        this.reportingsDetails.priceEnd = this.gfnFormatDecimal(value,3)
        if (Number(this.reportingsDetails.priceStart) > Number(this.reportingsDetails.priceEnd)) {
          this.$message.error('结束价格不能小于开始价格')
          return
        } else {
          this.validatePriceTemp = true
        }
      },
      // 申报开始数量
      numberStartChange (value) {
        this.validateQuantityTemp = false
        let reg = new RegExp(/^\d+(?:\.\d{1,3})?$/)
        if (value != '') {
          if (value - 0 < 0) {
            this.$message.error('开始数量不能为负值')
            return
          } else {
            if (!(reg.test(value))) {
              this.$message.error('开始数量只能是数字，请重新输入')
              return
            }
          }
        }
        if (Number(this.reportingsDetails.numberStart) > Number(this.reportingsDetails.numberEnd)) {
          this.$message.error('结束数量不能小于开始数量')
        } else {
          this.validateQuantityTemp = true
        }
      },
      // 申报结束数量
      numberEndChange (value) {
        this.validateQuantityTemp = false
        let reg = new RegExp(/^\d+(?:\.\d{1,3})?$/)
        if (value != '') {
          if (value - 0 < 0) {
            this.$message.error('结束数量不能为负值')
            return
          } else {
            if (!(reg.test(value))) {
              this.$message.error('结束数量只能是数字，请重新输入')
              return
            }
          }
        }
        if (Number(this.reportingsDetails.numberStart) > Number(this.reportingsDetails.numberEnd)) {
          this.$message.error('结束数量不能小于开始数量')
        } else {
          this.validateQuantityTemp = true
        }
      },

      // 产品类型
      productChange4 (val) {
        if (val == '0') {
          this.stockCodeCYZCX4 = true
        } else {
          this.stockCodeCYZCX4 = false
        }
      },

      // 清空
      clearForm () {
        this.reportingsDetails.securityCode = []
        this.reportingsDetails.reportCode = ''
        this.reportingsDetails.inCredit = false
        this.stockCodeCYZCX4 = false
        this.reportingsDetails.productType = 'ALL'
        this.reportingsDetails.orderType = ['ALL']
        this.reportingsDetails.cardType = ['ALL']
        this.reportingsDetails.priceStart = ''
        this.reportingsDetails.priceEnd = ''
        this.reportingsDetails.numberStart = ''
        this.reportingsDetails.numberEnd = ''
      },
      getRequestParams () {
        let stockCodes = ''
        if (this.reportCodeCYZCX1) {
          stockCodes = this.reportingsDetails.securityCode.join(',')
        } else if (this.reportCodeCYZCX2) {
          stockCodes = this.reportingsDetails.reportCode
        } else {
          stockCodes = ''
        }
        // 复选框是否选择，选择1，未选0
        let isContain = this.reportingsDetails.inCredit
        let isContainE = isContain ? '1' : '0'
        this.basiceInformationShow = true
        let actorCodeIn = ''
        if (this.commonData.participateType === 'salePart') {
          actorCodeIn = this.salePartCodeT
        } else {
          actorCodeIn = this.commonData.uploadCode
        }
        // 查询入参处理
        return {
          actorType: this.commonData.participateType, // 类型
          actorCode: actorCodeIn, //  一码通code
          dateTimeStart: this.commonData.dateTimeStart, // 开始时间
          dateTimeEnd: this.commonData.dateTimeEnd, // 结束时间
          isContainE: isContainE, // 含信用账户
          creditType: this.reportingsDetails.cardType.join(','), // 信用类型
          stockType: this.reportingsDetails.productType.join(','), // 产品类型
          stockCode: stockCodes, // 证券代码
          orderType: this.reportingsDetails.orderType, // 订单类型
          priceStart: this.reportingsDetails.priceStart, // 申报开始价格
          priceEnd: this.reportingsDetails.priceEnd, // 申报结束价格
          numberStart: this.reportingsDetails.numberStart, // 申报开始数量
          numberEnd: this.reportingsDetails.numberEnd // 申报结束数量
        }
      },
      // 查询
      getQueryRes () {
        if (!this.validateQuantityTemp || !this.validatePriceTemp) return
        let params = this.getRequestParams()
        this.loading = true
        this.uniteCode_wordTable = false
        if (this.reportingsDetails.productType !== '' &&
        this.reportingsDetails.orderType.length !== 0 &&
        this.reportingsDetails.cardType.length !== 0) {
          postStatistics(params).then((resp) => {
            this.loading = false
            this.accountDatas = resp.bizData.metaData
            this.resultNum = resp.bizData.rows
          })
        } else {
          this.$message.error('产品类型不能为空')
        }
      },
      // 一码通申报统计子表：
      getRadio (val) {
        this.loading = true
        this.uniteCode_wordTable = true
        // this.currentSelectedItemIsinCode = this.accountDatas.filter(v => {
        //   return v.isin_code === val
        // })
        let params = this.getRequestParams()
        params.isinCode = val['isin_code']
        params.actorCode = val.id
        postSonUniteCodeStatistics(params).then((resp) => {
          this.loading = false
          const {metaData, rows} = resp.bizData
          this.accountDatas_Z = metaData
          this.resultNum_Z = rows
        })
      },
    },
    watch: {
      commonData: {
        handler: function () {
          this.getStockCode()
        },
        deep: true
      }
    },
    mounted () {
      this.getStockCode()
      this.productTypeOptions()
      this.orderSelectOptions()
      this.creditSelectOptions()
    },

  }
</script>
<style lang="less">
    .reportingStatistice {
        .el-row {
            margin-top: 10px !important;
        }
        .el-card {
            .el-card__body {
                padding-bottom: 10px;
            }
            &:nth-child(1) {
                margin-top: 0;
                padding-top: 10px;
                padding-bottom: 10px;
            }
        }
        .queryResult {
            font-size: 14px;
            .item {
                margin-top: 20px;
                margin-bottom: 10px;

            }
        }
        .resultTitle {
            font-size: 16px;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .empty-result {
            text-align: center;
            padding-top: 150px;
            font-size: 16px;
        }
        .middleText {
            text-align: center;
        }
        .el-radio__label {
            display: none !important;
        }
        .mubs {
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            color: #fff;
        }
    }

</style>

