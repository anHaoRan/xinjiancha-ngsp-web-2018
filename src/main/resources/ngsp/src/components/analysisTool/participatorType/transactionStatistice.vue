<!--成交统计 transactionStatistice -->
<template>
  <div class="transactionStatistice">
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="text"
          @click="clearForm"
          size="mini">清空
        </el-button>
        <el-button
          type="primary" size="mini"
          @click="getQueryRes">查询
        </el-button>
      </div>
      <el-row>
        <el-col :span="8">
          <el-col :span="5" class="name">
            <span class="mustInput name">*</span>{{informationCodeType}}代码：
          </el-col>
          <el-col :span="11">
            <el-input
              type="text"
              v-model="commonData.uploadCode"
              disabled
              placeholder="请输入参与者代码"
              size="mini">
            </el-input>
          </el-col>
        </el-col>
        <!--含信用代码-->
        <el-col :span="2" style="margin: 6px 0 0 -140px;" v-if="participateType== 'account'">
          <el-checkbox v-model="commonDataMode.inCredit" size="small">含信用代码</el-checkbox>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5" class="name">产品类型：</el-col>
          <el-col :span="18">
            <el-select
              v-model="commonDataMode.productType"
              style="width:100%"
              placeholder="请选择产品类型"
              @change="productChange6"
              size="mini">
              <el-option
                v-for="productFor in productTypeOption"
                :key="productFor.value"
                :label="productFor.text"
                :value="productFor.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1" v-if="stockCodeCYZCX6">
          <el-col :span="19" v-if="reportCodeCYZCX1">
            <el-select
              type="text"
              clearable
              v-model="commonDataMode.securityCode"
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
              v-model="commonDataMode.reportCode"
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
        <el-col :span="8" v-if="commonData.notSingleDay">
          <el-col :span="5" class="name">
            <span class="mustInput name">*</span>统计方式：
          </el-col>
          <el-col :span="16">
            <el-select
              v-model="commonDataMode.statisticWayVal"
              style="width:100%"
              placeholder="多日合计"
              size="mini">
              <el-option
                v-for="statisticFor in statisticWayOptions"
                :key="statisticFor.value"
                :label="statisticFor.text"
                :value="statisticFor.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="8" v-if="commonData.singleDay">
          <el-col :span="5" class="name">成交价格：</el-col>
          <el-col :span="8">
            <el-input
              type="text"
              v-model="commonDataMode.priceStart"
              placeholder="请输入成交开始价格"
              @change="priceStartChange"
              size="mini">
            </el-input>
          </el-col>
          <el-col :span="1" class="middleText name">—</el-col>
          <el-col :span="8">
            <el-input
              type="text"
              v-model="commonDataMode.priceEnd"
              placeholder="请输入成交结束价格"
              @change="priceEndChange"
              size="mini">
            </el-input>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5">
            <span class="mustInput name">*</span>平台类型：
          </el-col>
          <el-col :span="18">
            <el-select
              v-model="commonDataMode.platformType"
              @change="orderChange"
              style="width:100%"
              placeholder="请选择平台类型"
              size="mini">
              <el-option
                v-for="platformFor in platformTypeOption"
                :key="platformFor.value"
                :label="platformFor.text"
                :value="platformFor.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1" v-if="commonData.singleDay && tradsShowJ">
          <el-col :span="5" class="name">交易类型：</el-col>
          <el-col :span="18">
            <el-select
              v-model="commonDataMode.tradeType"
              style="width:100%"
              placeholder="请选择交易类型"
              size="mini">
              <el-option
                v-for="tradeFor in tradeTypeOption"
                :key="tradeFor.value"
                :label="tradeFor.text"
                :value="tradeFor.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
      <el-row v-if="commonData.singleDay">
        <el-col :span="8">
          <el-col :span="5" class="name">成交数量：</el-col>
          <el-col :span="8" class="name">
            <el-input
              type="text"
              v-model="commonDataMode.numberStart"
              placeholder="请输入成交开始数量"
              @change="numberStartChange"
              size="mini">
            </el-input>
          </el-col>
          <el-col :span="1" class="middleText name">—</el-col>
          <el-col :span="8">
            <el-input
              v-model="commonDataMode.numberEnd"
              placeholder="请输入成交结束数量"
              @change="numberEndChange"
              size="mini">
            </el-input>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5" class="name">信用类型：</el-col>
          <el-col :span="18">
            <el-select
              :disabled="cardTypeDisabled"
              v-model="commonDataMode.cardType"
              style="width: 100%;"
              multiple
              collapse-tags
              @change="handleCreditTypeChange"
              placeholder="请选择信用类型"
              size="mini">
              <el-option
                v-for="cardFor in cardTypeOption"
                :key="cardFor.value"
                :label="cardFor.text"
                :value="cardFor.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5" class="name">订单类型：</el-col>
          <el-col :span="18">
            <el-select
              :disabled="orderTypeDisabled"
              v-model="commonDataMode.orderType"
              calearabel
              style="width: 100%;"
              multiple
              collapse-tags
              @change="handleOrderTypeChange"
              placeholder="请选择订单类型"
              size="mini">
              <el-option
                v-for="orderFor in orderTypeOption"
                :key="orderFor.value"
                :label="orderFor.text"
                :value="orderFor.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="basiceInformationShow">
      <el-row v-if="participateType === 'account'">
        <el-col>
          <span class="mubs">查询结果：</span>
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
        <!--账户/单日数据展示表-->
        <el-col v-if="AcxzQuer">
          <el-table class="el-card-table"
                    max-height="400"
                    border
                    ref="accountRerf"
                    :data="accountDatas"
                    show-overflow-tooltip
                    v-loading="loading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="数据加载中，请耐心等待..."
                    element-loading-background="rgba(0,0,0,0.3)"
                    style="width:100%;">
            <el-table-column
              v-for="column in biTableListA"
              :key="column.field"
              :align="column.align"
              :label="column.label"
              :prop="column.field"
              :min-width=column.minWidth
              :formatter="column.formatter"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod">
            </el-table-column>
          </el-table>
        </el-col>
        <!-- 账户多日数据展示表-->
        <el-col v-if="BcxzQuer">
          <el-table class="el-card-table"
                    max-height="400"
                    border
                    ref="accountRerf"
                    :data="accountDatas"
                    show-overflow-tooltip
                    v-loading="loading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="数据加载中，请耐心等待..."
                    element-loading-background="rgba(0,0,0,0.3)"
                    style="width:100%;">
            <el-table-column
              v-for="column in biTableListB"
              :key="column.field"
              :align="column.align"
              :label="column.label"
              :prop="column.field"
              :min-width=column.minWidth
              :formatter="column.formatter"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod">
            </el-table-column>
          </el-table>
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
          <el-table class="el-card-table"
                    border
                    height="400"
                    ref="accountRerf"
                    :data="accountDatas"
                    show-overflow-tooltip
                    v-loading="loading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="数据加载中，请耐心等待..."
                    element-loading-background="rgba(0,0,0,0.3)"
                    style="width:100%;">
            <el-table-column
              v-for="column in salePart_JSBTJ"
              :key="column.field"
              :align="column.align"
              :label="column.label"
              :prop="column.field"
              :min-width=column.minWidth
              :formatter="column.formatter"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod">
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
      <el-row v-if="participateType === 'uniteCode'">
        <el-col>
          <el-col>
            <span class="mubs">一码通成交统计母表：</span>
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
            <el-table class="el-card-table"
                      border
                      height="300"
                      ref="accountRerf"
                      :data="accountDatas"
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
                    v-if="scope.row.stockcode"
                    class="radio" v-model="radio"
                    :label="scope.row.stockcode"
                    @change="getRadio">
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                v-for="column in uniteCode_JSBTJ"
                width="200"
                :key="column.field"
                :align="column.align"
                :label="column.label"
                :prop="column.field"
                :min-width=column.minWidth
                :formatter="column.formatter"
                :sortable="column.sortable == null ? false : column.sortable"
                :sort-method="column.sortMethod">
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
            <span class="mubs">一码通成交统计子表：</span>
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
              class="el-card-table"
              border
              ref="accountRerf_Z"
              :data="accountDatas_Z"
              show-overflow-tooltip
              v-loading="loading"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)"
              style="width:100%;">
              <el-table-column
                v-for="column in uniteCode_ZSBTJ"
                :key="column.field"
                :align="column.align"
                :label="column.label"
                :prop="column.field"
                :min-width=column.minWidth
                :formatter="column.formatter"
                :sortable="column.sortable == null ? false : column.sortable"
                :sort-method="column.sortMethod">
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
  // 上传组件
  import TextUpload from '../../common/textUpload'
  import {
    postSingleDay, // 参与者查询-成交统计(账户/一码通单日,账户组,券商,pbu,营业部)
    postMultiDay, // 参与者查询-成交统计(账户/一码通跨日)
    getDetailType, // 交易类型公共接口
    getProductType2, // 产品类型公共接口
    getCreditType2, // 平台类型/信用类型/订单类型公共接口
    getStockQuery, // 证券代码接口 公共接口
    downloadTransactionStatistice // 参与者查询【成交统计】按条件下载数据
  } from '@/service/analysisTool/participatorType/index'
 import MinxinVue from './MixIn'
  export default {
    name: 'transactionStatistice',
    props: ['commonData', 'informationCodeType', 'salePartListVAL', 'currentSelectData'],
    // 注册组件
    components: {
      TextUpload // 上传账号组件
    },
    mixins: [MinxinVue],
    data() {
      return {
        loading: false,
        pageSize: 10,
        resultNum: 0,
        resultNum_Z: 0,
        basiceInformationShow: false, // 查询结果不显示
        salePartOptions: [],
        // v-modle  13个查询条件
        commonDataMode: {
          // inCode: '', // 参与者代码
          inCredit: false, // 含信用代码
          platformType: '1', // 平台类型
          tradeType: 'X', // 交易类型
          securityCode: [], // 模糊搜索证券代码
          reportCode: '', // 上传证券代码
          productType: 'ALL', // 产品类型
          orderType: ['ALL'], // 订单类型
          cardType: ['ALL'], // 信用类型
          priceStart: '', // 成交开始价格
          priceEnd: '', // 成交结束价格
          numberStart: '', // 成交开始数量
          numberEnd: '', // 成交结束数量
          statisticWayVal: '2' // 统计方式
        },

        stockCodeCYZCX6: false, // 证券代码（产品类型的值==8）时显示   成交统计
        reportCodeCYZCX2: false,
        reportCodeCYZCX1: true,
        inCodeOptions: [],
        intCodeLoading: true,
        currentSelectListV: [],
        salePartValue: [],
        inCodeList: [],

        // 统计方式下拉内容
        statisticWayOptions: [
          {
            value: '1',
            text: '按日统计'
          },
          {
            value: '2',
            text: '多日合计'
          }
        ],
        // 平台类型下拉内容
        platformTypeOption: [
          {
            value: '1',
            text: '竞价'
          }
        ],
        // 产品类型值下拉内容
        productTypeOption: [
          {
            value: 'ALL',
            text: '全部'
          }
        ],
        // 订单类型下拉内容
        orderTypeOption: [
          {
            value: 'ALL',
            text: '全部'
          }
        ],
        // 信用类型下拉内容
        cardTypeOption: [
          {
            value: 'ALL',
            text: '全部'
          }
        ],
        // 交易类型  == 1=竞价   2=固定收益(全部)
        tradeTypeOption: [
          {
            value: 'X',
            text: '场内交易'
          }
        ],
        tradsShowJ: true, // 交易类型  == 1=竞价

        // 上传
        uploadOption: {name: '上传', size: 'small'},
        AcxzQuer: true, // 账户/一码通数据表
        BcxzQuer: false, // 营业部数据表

        uniteCode_wordTable: false, // 显示子表
        // 账户/单日数据展示表/ tab
        biTableListA: [
          {
            label: '证券代码',
            field: 'stockcode',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'stockcode')
          },
          {
            label: '证券名称',
            field: 'stockname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'stockname')
          },
          {
            label: '参与者代码',
            field: 'pid',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pid')
          },
          {
            label: '参与者名称',
            field: 'pname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'pname')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          },
          {
            label: '买入数量',
            field: 'b_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '买入金额',
            field: 'b_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入比例',
            field: 'b_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出数量',
            field: 's_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '卖出金额',
            field: 's_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出比例',
            field: 's_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入均价',
            field: 'b_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出均价',
            field: 's_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        // 账户多日数据展示表 tab
        biTableListB: [
          {
            label: '日期',
            field: 'trade_date',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trade_date')
          },
          {
            label: '证券代码',
            field: 'stockcode',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'stockcode')
          },
          {
            label: '证券名称',
            field: 'stockname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'stockname')
          },
          {
            label: '参与者代码',
            field: 'pid',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pid')
          },
          {
            label: '参与者名称',
            field: 'pname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'pname')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          },
          {
            label: '买入数量',
            field: 'b_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '买入金额',
            field: 'b_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入比例',
            field: 'b_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出数量',
            field: 's_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '卖出金额',
            field: 's_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出比例',
            field: 's_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入均价',
            field: 'b_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出均价',
            field: 's_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        // 营业部
        salePart_JSBTJ: [
          {
            label: '参与者代码',
            field: 'pid',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pid')
          },
          {
            label: '参与者名称',
            field: 'pname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'pname')
          },
          {
            label: '证券代码',
            field: 'stockcode',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'stockcode')
          },
          {
            label: '证券名称',
            field: 'stockname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'stockname')
          },
          {
            label: '买入数量',
            field: 'b_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '买入金额',
            field: 'b_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入比例',
            field: 'b_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出数量',
            field: 's_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '卖出金额',
            field: 's_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出比例',
            field: 's_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入均价',
            field: 'b_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出均价',
            field: 's_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        // 一码通申报统计母表
        UniteCodeDateColumn: [{
          label: '日期',
          field: 'trade_date',
          width: '12%',
          align: 'left',
          sortable: false,
          sortMethod: this.gfnSortColByNumber.bind(this, 'trade_date')
        }],
        uniteCode_JSBTJ: [
          {
            label: '证券代码',
            field: 'stockcode',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'stockcode')
          },
          {
            label: '证券名称',
            field: 'stockname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'stockname')
          },
          {
            label: '一码通代码',
            field: 'pid',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pid')
          },
          {
            label: '一码通名称',
            field: 'pname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'pname')
          },
          {
            label: '买入数量',
            field: 'b_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '买入金额',
            field: 'b_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入比例',
            field: 'b_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出数量',
            field: 's_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '卖出金额',
            field: 's_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出比例',
            field: 's_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入均价',
            field: 'b_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出均价',
            field: 's_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        // 一码通持仓统计子表
        accountDatas_Z: [],
        uniteCode_ZSBTJ: [
          {
            label: '证券代码',
            field: 'stockcode',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'stockcode')
          },
          {
            label: '证券名称',
            field: 'stockname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'stockname')
          },
          {
            label: '账户代码',
            field: 'pid',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pid')
          },
          {
            label: '账户名称',
            field: 'pname',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'pname')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            width: '12%',
            align: 'left',
            sortable: false,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          },
          {
            label: '买入数量',
            field: 'b_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '买入金额',
            field: 'b_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入比例',
            field: 'b_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出数量',
            field: 's_trdqty',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty'),
            formatter: this.gfnElColFormatDecThou0
          },
          {
            label: '卖出金额',
            field: 's_mktval',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_mktval'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出比例',
            field: 's_trdqty_rate',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_trdqty_rate'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买入均价',
            field: 'b_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖出均价',
            field: 's_avg_price',
            width: '12%',
            align: 'right',
            sortable: false,
            sortMethod: this.gfnSortColByNumber.bind(this, 's_avg_price'),
            formatter: this.gfnElColFormatDecThou3
          }
        ],
        accountDatas: [], // 账户/一码通/营业部数据列表
        radio: '',
        radioDisabled: false,
        // 接受父组件的值
        declareActorType: '', // 账户类型
        declareActorCode: '', // 代码
        declareTime: '', // 开始时间 - 结束日期

        participateType: '', // 类型
        dateTimeStart: '', // 开始时间
        dateTimeEnd: '',// 结束日期

        singleDay: true, // 单日查询条件
        notSingleDay: false, // 跨日查询条件

        priceStartChangeData: '', // 成交开始价格存储比较
        priceEndChangeData: '', // 成交结束价格存储比较
        numberStartChangeData: '', // 成交开始数量存储比较
        numberEndChangeData: '', // 成交结束数量存储比较

        cardTypeDisabled: false, // 信用类型
        orderTypeDisabled: false, // 订单类型

        fileType: '', // 导出
        dealCountDate: 'dealCount', // 导出选择 --成交统计导出
        isSingle: 'Y', // 导出选择单日
        tableColumnsaDate: [], // 导出选择表格
        sheetNameTab: {}, // 导出选择类型 -- 账户成交统计
        currentSelectedItemStockCode: '' // 点击母表当前的stockCode
      }
    },
    methods: {
      /* 导出数据 */
      exportData(type, propsParams) {
        let params = this.commonRequestMethod(null, propsParams, true)
        params.fileType = type
        params.type = 'dealCount'
        if (Object.keys(propsParams).length) { // 子表tableColumns
          if (propsParams.stockCode) {
            // this.tableColumnsData = this.uniteCode_CCTJ_LISTZ
            this.tableColumnsData = this.uniteCode_ZSBTJ
            this.sheetNameTab = '一码通成交统计子表（详情）'
          }
        }
        params.tableColumns = [{
          sheetName: this.sheetNameTab,
          fileColumns: this.tableColumnsData
        }]
        downloadTransactionStatistice(params)
      },
      setSheetName() {
        switch (this.commonData.participateType) {
          case 'account' :
            this.sheetNameTab = '账户成交统计'
            if (this.AcxzQuer) { // 单日
              this.tableColumnsData = this.biTableListA
            } else if (this.BcxzQuer) { // 多日
              this.tableColumnsData = this.biTableListB
            }
            break
          case 'uniteCode':
            this.sheetNameTab = '一码通成交统计'
            this.tableColumnsData = this.uniteCode_JSBTJ
            break
          case 'salePart':
            this.sheetNameTab = '营业部成交统计'
            this.tableColumnsData = this.salePart_JSBTJ
            break
          case 'member':
            this.sheetNameTab = '券商成交统计'
            break
          case 'pbu':
            this.sheetNameTab = 'PBU成交统计'
            break
        }
      },
      // 导出数据操作
      handleExportData(val) {
        this.setSheetName()
        this.exportData(val, {})
      },
      handleExportDataDetail(val) {
        this.setSheetName()
        // console.log(JSON.stringify(this.currentSelectedItemStockCode))
        this.exportData(val, {
          isDetail: true, // 导出数据接口使用
          isSumChild: 'Y',
          stockCode: this.currentSelectedItemStockCode[0].stockcode
        })
      },
      // 接受父组件的日期数据
      getTransactionType() {
        this.participateType = this.commonData.participateType
        if (this.participateType === 'salePart') {
          this.commonData.uploadCode = this.salePartListVAL
        } else {
          this.commonData.uploadCode = this.commonData.uploadCode
        }
      },

      // 父组件传值给子组件
      getStockCode() {
        this.declareActorType = this.commonData.participateType
      },
      // 证券代码模糊搜索
      intCodeTemoteMethod(query) {
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
      securityChange(val) {
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
      reportCodeChange(val) {
        if (!val) {
          this.reportCodeCYZCX2 = false
          this.reportCodeCYZCX1 = true
          this.inCodeOptions = []
          this.salePartValue = []
          this.commonDataMode.securityCode = []
        } else {
          this.reportCodeCYZCX2 = true
          this.reportCodeCYZCX1 = false
        }
      },

      // 获取上传结果
      getTxtData(TxtData) {
        if (TxtData) {
          TxtData = TxtData.join(',')
          this.reportCodeCYZCX2 = true
          this.reportCodeCYZCX1 = false
          this.commonDataMode.reportCode = TxtData
          this.salePartValue = []
        } else {
          this.salePartValue = []
          this.reportCodeCYZCX2 = false
          this.reportCodeCYZCX1 = true
        }
      },

      //  平台类型下拉内容获取
      platData() {
        getCreditType2('platform').then((resp) => {
          this.platformTypeOption = resp
        })
      },
      //  交易类型下拉内容获取
      transactionData() {
        // 竞价
        getDetailType('transaction', this.commonDataMode.platformType).then((resp) => {
          this.tradeTypeOption = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.tradeTypeOption.unshift(All)
        })
      },
      //  订单类型下拉内容获取
      orderData() {
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
        this.commonDataMode.cardType = this.orderOrCreditChange(val)
      },
      handleOrderTypeChange(val){
        this.commonDataMode.orderType = this.orderOrCreditChange(val)
      },
      //  信用类型下拉内容获取
      creditDatas() {
        getCreditType2('credit').then((resp) => {
          this.cardTypeOption = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.cardTypeOption.unshift(All)
        })
      },
      //  产品类型下拉内容获取
      productData() {
        getProductType2('productType', 'stockWithCol').then((resp) => {
          this.productTypeOption = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.productTypeOption.unshift(All)
        })
      },

      // 平台类型事件
      orderChange(val) {
        if (val == '3') {
          this.tradsShowJ = false
          this.cardTypeDisabled = true
          this.orderTypeDisabled = true
          this.commonDataMode.orderType = ['ALL']
          this.commonDataMode.cardType = ['ALL']
        } else if (val == '2') {
          this.cardTypeDisabled = true
          this.orderTypeDisabled = true
          this.commonDataMode.orderType = ['ALL']
          this.commonDataMode.cardType = ['ALL']
          this.tradsShowJ = true
          this.transactionData()
          this.commonDataMode.tradeType = 'ALL'
        } else {
          this.cardTypeDisabled = false
          this.orderTypeDisabled = false
          this.commonDataMode.orderType = ['ALL']
          this.commonDataMode.cardType = ['ALL']
          this.tradsShowJ = true
          this.transactionData()
          this.commonDataMode.tradeType = 'X'
        }
      },
      // 产品类型
      productChange6(val) {
        if (val == '0') {
          this.stockCodeCYZCX6 = true
        } else {
          this.stockCodeCYZCX6 = false
        }
      },
      // 成交开始价格
      priceStartChange(value) {
        this.priceStartChangeData = value
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
        this.commonDataMode.priceStart = this.gfnFormatDecThou(value, 3)
      },
      // 成交结束价格
      priceEndChange(value) {
        this.priceEndChangeData = value
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
        if (this.priceStartChangeData !== '' && value < this.priceStartChangeData) {
          this.$message.error('结束价格不能小于开始价格')
          return
        }
        this.commonDataMode.priceEnd = this.gfnFormatDecThou(value, 3)
      },
      // 成交开始数量
      numberStartChange(value) {
        this.numberStartChangeData = value
        let reg = new RegExp(/^\d+(?:\.\d{1,3})?$/)
        if (value != '') {
          if (value - 0 < 0) {
            this.$message.error('开始数量不能为负值')
          } else {
            if (!(reg.test(value))) {
              this.$message.error('开始数量只能是数字，请重新输入')
            }
          }
        }
      },
      // 成交结束数量
      numberEndChange(value) {
        this.numberEndChangeData = value
        let reg = new RegExp(/^\d+(?:\.\d{1,3})?$/)
        if (value != '') {
          if (value - 0 < 0) {
            this.$message.error('结束数量不能为负值')
          } else {
            if (!(reg.test(value))) {
              this.$message.error('结束数量只能是数字，请重新输入')
            }
          }
        }
        if (this.numberStartChangeData !== '' && value < this.numberStartChangeData) {
          this.$message.error('结束数量不能小于开始数量')
        }
      },

      // 清空事件
      clearForm() {
        this.commonDataMode.securityCode = []
        this.commonDataMode.reportCode = ''
        this.commonDataMode.platformType = '1'
        this.commonDataMode.inCredit = false
        this.commonDataMode.productType = 'ALL'
        this.commonDataMode.orderType = ['ALL']
        this.commonDataMode.cardType = ['ALL']
        this.commonDataMode.tradeType = 'X'
        this.cardTypeDisabled = false
        this.orderTypeDisabled = false
        this.tradsShowJ = true
        this.stockCodeCYZCX6 = false
        this.commonDataMode.priceStart = ''
        this.commonDataMode.priceEnd = ''
        this.commonDataMode.numberStart = ''
        this.commonDataMode.numberEnd = ''
        this.commonDataMode.statisticWayVal = '2'
      },
      // eslint-disable-next-line
      commonRequestMethod(callback, propsParams, returnParams) {
        let mergeParams = propsParams || {}
        let isinCodes = ''
        if (this.reportCodeCYZCX1) {
          isinCodes = this.commonDataMode.securityCode.join(',')
        } else if (this.reportCodeCYZCX2) {
          isinCodes = this.commonDataMode.reportCode
        } else {
          isinCodes = ''
        }
        // 复选框是否选择，选择1，未选0
        let isContainE = this.commonDataMode.inCredit ? '1' : '0'

        let salePartCode = ''
        let salePartCodeVal = []
        if (this.commonData.participateType === 'salePart') {
          let salePartCodeObj = this.currentSelectData
          salePartCodeObj.forEach((el) => {
            salePartCodeVal.push(el.value)
          })
          salePartCode = salePartCodeVal.join(',')
        } else {
          salePartCode = this.commonData.uploadCode
        }
        if (this.commonDataMode.statisticWayVal === '1') {
          if (this.uniteCode_JSBTJ[0].field != 'trade_date') { // 一码通处理表头 是否展示日期列
            this.uniteCode_JSBTJ = [...this.UniteCodeDateColumn, ...this.uniteCode_ZSBTJ]
            this.uniteCode_ZSBTJ = [...this.UniteCodeDateColumn, ...this.uniteCode_ZSBTJ]
          }
          this.AcxzQuer = false // 单日
          this.BcxzQuer = true // 多日
        } else {
          if (this.uniteCode_JSBTJ[0].field == 'trade_date') { // 一码通处理表头 是否展示日期列
            this.uniteCode_JSBTJ.shift()
            this.uniteCode_ZSBTJ.shift()
          }
          this.AcxzQuer = true // 单日
          this.BcxzQuer = false // 多日
        }
        if (this.commonData.singleDay) {
          // 参与者查询-成交统计(账户/一码通【不跨日】,账户组,券商,pbu,营业部)接口
          let requestParams = {
            actorType: this.commonData.participateType, // 参与者类型
            actorCode: salePartCode, // 参与者代码
            dateTimeStart: this.commonData.dateTimeStart, // 开始日期和时间
            dateTimeEnd: this.commonData.dateTimeEnd, // 结束日期和时间
            platformType: this.commonDataMode.platformType, // 平台类型 1竞价 2固定收益 3大宗交易
            tradeType: this.commonDataMode.tradeType, // 交易类型
            startPrice: this.commonDataMode.priceStart, // 成交价格
            endPrice: this.commonDataMode.priceEnd, // 成交价格
            orderType: this.commonDataMode.orderType.join(','), // 订单类型
            stockType: this.commonDataMode.productType, // 产品类型
            stockCode: isinCodes, // 证券代码
            startNum: this.commonDataMode.numberStart, // 成交数量
            endNum: this.commonDataMode.numberEnd, // 成交数量
            creditType: this.commonDataMode.cardType.join(','), // 信用类型
            isContainE: isContainE, //  账户独有,1 包含信用账户,0不包含
            isSingle: 'Y' // 单日
          }
          let requestMergeParams = {...requestParams, ...mergeParams}
          if (returnParams) {
            return requestMergeParams
          }
          this.loading = true
          postSingleDay(requestMergeParams).then((resp) => {
            this.loading = false
            callback && callback(resp)
          })
        } else {
          // 参与者查询-成交统计(账户/一码通跨日)
          let requestParams = {
            actorType: this.commonData.participateType, //  参与者类型
            actorCode: this.commonData.uploadCode, //  参与者代码
            dateTimeStart: this.commonData.dateTimeStart, //  开始日期和时间
            dateTimeEnd: this.commonData.dateTimeEnd, //  结束日期和时间
            platformType: this.commonDataMode.platformType, // 平台类型  1竞价 2固定收益 3大宗交易
            stockType: this.commonDataMode.productType, //  产品类型
            stockCode: isinCodes, //  产品代码
            sortType: this.commonDataMode.statisticWayVal, //  统计方式，按日按多日
            isContainE: isContainE //  账户独有,1 包含信用账户,0不包含
          }
          let requestMergeParams = {...requestParams, ...mergeParams}
          if (returnParams) {
            return requestMergeParams
          }
          this.loading = true
          postMultiDay(requestMergeParams).then((resp) => {
            this.loading = false
            callback && callback(resp)
          })
        }
      },
      // 查询事件
      getQueryRes() {
        this.uniteCode_wordTable = false
        this.basiceInformationShow = true // 查询结果显示
        this.accountDatas = []
        this.commonRequestMethod((resp) => {
          const {metaData, rows} = resp.bizData
          this.accountDatas = metaData
          this.resultNum = rows
        })
      },
      // 一码通子表
      getRadio(val) {
        this.radio = val
        this.currentSelectedItemStockCode = this.accountDatas.filter(v => {
          return v.stockcode === val
        })
        let propsParams = {
          isSumChild: 'Y',
          stockCode: this.currentSelectedItemStockCode[0].stockcode
        }
        this.commonRequestMethod((resp) => {
          this.uniteCode_wordTable = true
          const {metaData, rows} = resp.bizData
          this.accountDatas_Z = metaData
          this.resultNum_Z = rows
        }, propsParams)
      }
    },
    // 监听数据
    watch: {
      commonData: {
        handler: function () {
          this.getStockCode()
        },
        deep: true
      }
    },
    mounted() {
      this.getStockCode()
      this.getTransactionType()
      // 平台类型下拉内容获取
      this.platData()
      // 交易类型下拉内容获取
      this.transactionData()
      // 订单类型下拉内容获取
      this.orderData()
      // 信用类型下拉内容获取
      this.creditDatas()
      // 产品类型下拉内容获取
      this.productData()
    }
  }
</script>
<style lang="less">
  .transactionStatistice {
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
