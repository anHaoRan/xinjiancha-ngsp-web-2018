<!--持仓统计 positionStatistice -->
<template>
    <div class="positionStatistice">
        <el-card>
            <el-row>
                <el-col :span="7">
                    <el-col :span="5" class="name">
                        <span class="mustInput name">*</span>{{informationCodeType}}代码：
                    </el-col>
                    <el-col :span="11">
                        <el-input
                                type="text"
                                v-model="commonData.uploadCode"
                                disabled
                                placeholder="请输入账户代码"
                                size="small">
                        </el-input>
                    </el-col>
                </el-col>
                <!--含信用代码-->
                <el-col :span="2" style="margin: 6px 0 0 -140px;" v-show="participateType == 'account'">
                    <el-checkbox v-model="reportForm.inCredit" size="small" :disabled="isIncludesCreditAccout">含信用代码</el-checkbox>
                </el-col>
                <el-col :span="6" :offset="1">
                    <el-col :span="5" class="name">产品类型：</el-col>
                    <el-col :span="18">
                        <el-select
                                v-model="reportForm.orderVal"
                                placeholder="请选择产品类型"
                                size="small"
                                style="width: 100%">
                            <el-option
                                    v-for="orderFor in orderOptions"
                                    :key="orderFor.value"
                                    :label="orderFor.text"
                                    :value="orderFor.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="6" :offset="1" v-if="reportForm.orderVal==='0'">
                    <select-lazy-multiple :selectParams="selectParams" @getSelectRes="fnGetSelectRes"
                                          style="display: inline-block;" ref="selectLazyMultiple">
                    </select-lazy-multiple>
                    <text-upload @getTxtCon="fnGetStockTypeUploadCon" style="display: inline-block;"></text-upload>
                </el-col>
                <el-col :span="2" style="float: right;text-align: right;">
                    <el-button
                            type="primary" size="small"
                            @click="getQueryRes">查询
                    </el-button>
                    <el-button
                            type="text"
                            @click="clearForm" size="small">清空
                    </el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card v-if="basiceInformationShow">
            <el-row v-if="participateType == 'account'">
                <el-col>
                    <span class="mubs">持仓统计：</span>
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
                </el-col>
                <el-col>
                    <el-table
                            border
                            height="400px"
                            class="el-card-table"
                            ref="accountRerf"
                            :data="accountDatas"
                            show-overflow-tooltip
                            v-loading="loading"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="数据加载中，请耐心等待..."
                            element-loading-background="rgba(0,0,0,0.3)"
                            style="width:100%;">
                        <el-table-column
                                v-for="column in account_CCTJ_LIST"
                                :key="column.field"
                                :align="column.align"
                                :label="column.label"
                                :prop="column.field"
                                :sort-method="column.sortMethod"
                                :min-width=column.minWidth
                                :formatter="column.formatter"
                                :sortable="column.sortable == null ? false : column.sortable"
                                show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col>
                    <el-pagination
                            :page-size="pageSize"
                            layout="total"
                            :total="resultNum">
                    </el-pagination>
                </el-col>
            </el-row>
            <el-row v-if="participateType == 'uniteCode'">
                <el-col>
                    <el-col>
                        <span class="mubs">一码通持仓统计母表：</span>
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
                                ref="accountRerf"
                                :data="accountDatas"
                                height="480px"
                                show-overflow-tooltip
                                v-loading="loading"
                                element-loading-spinner="el-icon-loading"
                                element-loading-text="数据加载中，请耐心等待..."
                                element-loading-background="rgba(0,0,0,0.3)"
                                style="width:100%;">
                            <el-table-column
                                    width="55"
                                    align="center">
                                <template slot-scope="scope">
                                    <el-radio
                                            v-if="scope.row.instrument_id"
                                            class="radio"
                                            v-model="radio"
                                            :label="`${scope.row.investor_account_id} ${scope.row.instrument_id}`"
                                            @change="getRadio(scope.row)">
                                    </el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    class="el-card-table"
                                    v-for="column in uniteCode_CCTJ_LIST"
                                    :key="column.field"
                                    :align="column.align"
                                    :label="column.label"
                                    :prop="column.field"
                                    :sortable=column.sortable
                                    :sort-method="column.sortMethod"
                                    show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col>
                        <el-pagination
                                :page-size="pageSize"
                                layout="total"
                                :total="resultNum">
                        </el-pagination>
                    </el-col>
                </el-col>
                <el-col v-if="uniteCode_wordTable">
                    <el-col :span="24">
                        <span class="mubs">一码通持仓统计子表：</span>
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
                                height="480px"
                                :data="accountDatas_Z"
                                show-overflow-tooltip
                                v-loading="subLoading"
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
                                    show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col>
                        <el-pagination
                                :page-size="pageSize_Z"
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
    postPartic,                  // 参与者查询持仓统计接口
    postParticChild,              // 参与者查询持仓统计一码通子表接口
    getProductType2,           // 平台类型公共接口
    getStockQuery,           // 证券代码接口
    downloadTransactionStatistice // 导出数据接口
  } from '../../../service/analysisTool/participatorType/index'
  import SelectLazyMultiple from '../../common/SelectLazyMultiple'

  export default {
    name: 'positionStatistice',
    props: ['commonData', 'informationCodeType'],
    // 注册组件
    components: {
      TextUpload, // 上传账号组件
      SelectLazyMultiple
    },
    computed:{
      isIncludesCreditAccout:function  () {
        let canClickCheckbox = false
        let accountNum = this.commonData.uploadCode.split(',').length
        if(accountNum>=500){
          canClickCheckbox = true
        }
        return canClickCheckbox
      }
    },
    data () {
      return {
        loading: false,
        subLoading:false,
        basiceInformationShow: false, // 查询结果显示
        reportForm: {
          inCredit: false, // 含信用代码
          orderVal: 'ALL', // 产品类型
          securityCode: [], // 模糊搜索证券代码
          reportCode: '' // 上传证券代码
        },
        // 证券代码子组件所需值
        selectParams: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        stockCodeCYZCX2: false, // 证券代码（产品类型的值==0）时显示   持仓统计
        reportCodeCYZCX2: false,
        reportCodeCYZCX1: true,
        currentSelectListV: [],
        inCodeList: [],

        // 产品类型值下拉内容
        orderOptions: [
          {
            value: 'ALL',
            text: '全部'
          }
        ],
        // 上传
        uploadOption: {name: '上传', size: 'small'},
        // 账户
        account_CCTJ_LIST: [
          {
            label: '账户代码',
            field: 'investor_account_id',
            minWidth: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'investor_account_id')
          },
          {
            label: '账户名称',
            field: 'investor_account_name',
            minWidth: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'investor_account_name')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            minWidth: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          },
          {
            label: '证券代码',
            field: 'instrument_id',
            minWidth: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '证券名称',
            field: 'instrument_chn_short_name',
            minWidth: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_chn_short_name')
          },
          {
            label: '前持仓数量',
            field: 'front_position_amount',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'front_position_amount')
          },
          {
            label: '买入数量',
            field: 'trdqty_b',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b')
          },
          {
            label: '买入金额',
            field: 'trdamt_b',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b')
          },
          {
            label: '买入均价',
            field: 'average_price_b',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'average_price_b')
          },
          {
            label: '卖出数量',
            field: 'trdqty_s',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s')
          },
          {
            label: '卖出金额',
            field: 'trdamt_s',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s')
          },
          {
            label: '卖出均价',
            field: 'average_price_s',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'average_price_s')
          },
          {
            label: '持仓数量',
            field: 'position_amount',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount')
          },
          {
            label: '持仓市值',
            field: 'price',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'price')
          },
          {
            label: '限售股数量',
            field: 'limited_position_amount',
            minWidth: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'limited_position_amount')
          }
        ],
        // 一码通持仓统计母表：
        uniteCode_CCTJ_LIST: [
          {
            label: '一码通账户',
            field: 'investor_account_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'investor_account_id')
          },
          {
            label: '一码通名称',
            field: 'branch_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'investor_account_name')
          },
          {
            label: '证券代码',
            field: 'instrument_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '证券名称',
            field: 'instrument_chn_short_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_chn_short_name')
          },
          {
            label: '前持仓数量',
            field: 'front_position_amount',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'front_position_amount')
          },
          {
            label: '买入数量',
            field: 'trdqty_b',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b')
          },
          {
            label: '买入金额',
            field: 'trdamt_b',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b')
          },
          {
            label: '买入均价',
            field: 'average_price_b',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'average_price_b')
          },
          {
            label: '卖出数量',
            field: 'trdqty_s',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s')
          },
          {
            label: '卖出金额',
            field: 'trdamt_s',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s')
          },
          {
            label: '卖出均价',
            field: 'average_price_s',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'average_price_s')
          },
          {
            label: '持仓数量',
            field: 'position_amount',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount')
          },
          {
            label: '持仓市值',
            field: 'price',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'price')
          },
          {
            label: '限售股数量',
            field: 'limited_position_amount',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'limited_position_amount')
          }
        ],
        uniteCode_wordTable: false,
        // 一码通持仓统计子表：
        uniteCode_CCTJ_LISTZ: [
          {
            label: '账户代码',
            field: 'investor_account_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'investor_account_id')
          },
          {
            label: '账户名称',
            field: 'investor_account_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'investor_account_name')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          },
          {
            label: '证券代码',
            field: 'instrument_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '证券名称',
            field: 'instrument_chn_short_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_chn_short_name')
          },
          {
            label: '前持仓数量',
            field: 'front_position_amount',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'front_position_amount')
          },
          {
            label: '买入数量',
            field: 'trdqty_b',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_b')
          },
          {
            label: '买入金额',
            field: 'trdamt_b',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b')
          },
          {
            label: '买入均价',
            field: 'average_price_b',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'average_price_b')
          },
          {
            label: '卖出数量',
            field: 'trdqty_s',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s')
          },
          {
            label: '卖出金额',
            field: 'trdamt_s',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s')
          },
          {
            label: '卖出均价',
            field: 'average_price_s',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'average_price_s')
          },
          {
            label: '持仓数量',
            field: 'position_amount',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_amount')
          },
          {
            label: '持仓市值',
            field: 'price',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'price')
          },
          {
            label: '限售股数量',
            field: 'limited_position_amount',
            width: '12%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'limited_position_amount')
          }
        ],
        // 一码通持仓统计母表：
        accountDatas: [],
        currentPage: 1,
        pageSize: 10,
        resultNum: 0,
        // 一码通持仓统计子表：
        accountDatas_Z: [],
        currentPage_Z: 1,
        pageSize_Z: 10,
        resultNum_Z: 0,
        participateType: '',
        radio: '',
        radioDisabled: false,
        sheetNameTab: '', // 导出报表名称
        currentSelectedItemStockCode: {} // 当前选中母表的stockCode
      }
    },
    methods: {
        /* 导出数据 */
      exportData (type, propsParams) {
        let params = this.getRequestParams()
        if (Object.keys(propsParams).length) { // 子表tableColumns
          if (propsParams.instrumentId) {
            this.tableColumnsData = this.uniteCode_CCTJ_LISTZ
            this.sheetNameTab = '一码通持仓统计子表（详情）'
          }
        }
        params.fileType = type
        params.type = 'holdstat'
        params.tableColumns = [{
          sheetName: this.sheetNameTab,
          fileColumns: this.tableColumnsData
        }]
        downloadTransactionStatistice({...params, ...propsParams})
      },
      setSheetName () {
        switch (this.commonData.participateType) {
          case 'account' :
            this.sheetNameTab = '账户持仓统计'
            this.tableColumnsData = this.account_CCTJ_LIST
            break
          case 'uniteCode':
            this.sheetNameTab = '一码通持仓统计'
            this.tableColumnsData = this.uniteCode_CCTJ_LIST
            break
          case 'salePart': // 无持仓统计
            break
          case 'member':
            this.sheetNameTab = '券商持仓统计'
            break
          case 'pbu':
            this.sheetNameTab = 'PBU持仓统计'
            break
        }
      },
      // 导出数据操作
      handleExportData (val) {
        this.setSheetName()
        this.exportData(val, {})
      },
      // 导出数据操作-子表（详情）
      handleExportDataDetail (val) {
        this.setSheetName()
        this.exportData(val, {
          isDetail: true, // 导出数据接口使用
          instrumentId: this.currentSelectedItemStockCode // 选中的stockCode
        })
      },
      // 父组件传值给子组件
      getPositionStatisticeType () {
        this.participateType = this.commonData.participateType
      },
      //  产品类型下拉内容获取
      productTypeOptions () {
        getProductType2('productType', 'stockWithCol').then((resp) => {
          this.orderOptions = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.orderOptions.unshift(All)
        })
      },
      fnGetSelectRes (val) {
        this.reportForm.securityCode = val
      },
      // 证券代码获取txt文件内容
      fnGetStockTypeUploadCon (res) {
        this.selectParams.query = res
        this.$refs.selectLazyMultiple.getUploadSelectOptionCon(res)
      },

      // 清空
      clearForm () {
        this.reportForm.orderVal = 'ALL'
        this.reportForm.inCredit = false
        this.reportForm.securityCode = []
        this.reportForm.reportCode = ''
        this.stockCodeCYZCX2 = false
      },
      getRequestParams () {
        let isinCodes = ''
        if (this.reportForm.orderVal === '0') {
          isinCodes = this.reportForm.securityCode.join(',')
        } else {
          isinCodes = ''
        }
        // 复选框是否选择，选择1，未选0
        let isContainE = this.reportForm.inCredit ? '1' : '0'
        return {
          actorCode: this.commonData.uploadCode,
          actorType: this.commonData.participateType,
          dateTimeStart: this.commonData.dateTimeStart,
          dateTimeEnd: this.commonData.dateTimeEnd,
          isContainE: isContainE,
          stockType: this.reportForm.orderVal,
          isinCode: isinCodes
        }
      },
      // 查询
      getQueryRes () {
        this.uniteCode_wordTable = false
        this.radio = ''
        let params = this.getRequestParams()
        this.basiceInformationShow = true
        this.loading = true
        postPartic(params).then((resp) => { // 申报详情
          this.loading = false
          this.accountDatas = resp.bizData.metaData
          this.resultNum = resp.bizData.rows
        })

      },
      // 一码通持仓统计子表：
      getRadio (val) {
        this.uniteCode_wordTable = true
        let params = this.getRequestParams()
        // params['instrumentId']=
        // params = {...params, ...{instrumentId: this.currentSelectedItemStockCode[0].instrument_id}} // 合并选中的证券代码
        params.actorCode = val.investor_account_id
        params.isinCode=val.instrument_id
        this.subLoading = true
        postParticChild(params).then((resp) => {
          this.subLoading = false
          if (resp) {
            this.accountDatas_Z = resp.bizData.metaData
            this.resultNum_Z = resp.bizData.rows
          }
        })
      }
    },
    watch: {},
    mounted () {
      // 产品类型下拉内容获取
      this.productTypeOptions()
    }
  }
</script>
<style lang="less">
    .positionStatistice {
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
