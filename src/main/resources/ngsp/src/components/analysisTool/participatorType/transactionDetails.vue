<!--成交详情 transactionDetails -->
<template>
  <div class="transactionDetails">
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
          <el-checkbox v-model="transacDetails.inCredit" size="small">含信用代码</el-checkbox>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5">
            <span class="mustInput name">*</span>平台类型：
          </el-col>
          <el-col :span="18" class="name">
            <el-select
                v-model="transacDetails.orderState"
                style="width:100%"
                @change="orderChange"
                placeholder="请选择平台类型"
                size="small">
              <el-option
                  v-for="platFor in platformTypeOption"
                  :key="platFor.value"
                  :label="platFor.text"
                  :value="platFor.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1" v-if="transacDetails.orderState==='1'||transacDetails.orderState==='2'">
          <el-col :span="5" class="name">交易类型：</el-col>
          <el-col :span="18">
            <el-select
                v-model="transacDetails.tradsType"
                style="width:100%"
                placeholder="请选择交易类型"
                size="small">
              <el-option
                  v-for="tradeType1For in tradeTypeOption"
                  :key="tradeType1For.value"
                  :label="tradeType1For.text"
                  :value="tradeType1For.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-col :span="5" class="name">成交价格：</el-col>
          <el-col :span="8">
            <el-input
                type="text"
                v-model="transacDetails.priceStart"
                placeholder="请输入成交开始价格"
                @change="priceStartChange"
                size="small">
            </el-input>
          </el-col>
          <el-col :span="1" class="middleText name">—</el-col>
          <el-col :span="8">
            <el-input
                type="text"
                v-model="transacDetails.priceEnd"
                placeholder="请输入成交结束价格"
                @change="priceEndChange"
                size="small">
            </el-input>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5" class="name">
            <span class="mustInput name">*</span>买卖状态：
          </el-col>
          <el-col :span="18" class="name">
            <el-checkbox-group
                v-model="transacDetails.dealState"
                size="small" :min="1">
              <el-checkbox label="B">买</el-checkbox>
              <el-checkbox label="S">卖</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5" class="name">订单类型：</el-col>
          <el-col :span="18">
            <el-select
                :disabled="transacDetails.orderState!=='1'"
                v-model="transacDetails.orderType"
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
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-col :span="5" class="name">成交数量：</el-col>
          <el-col :span="8" class="name">
            <el-input
                type="text"
                v-model="transacDetails.numberStart"
                placeholder="请输入成交开始数量"
                @change="numberStartChange"
                size="small">
            </el-input>
          </el-col>
          <el-col :span="1" class="middleText name">—</el-col>
          <el-col :span="8">
            <el-input
                v-model="transacDetails.numberEnd"
                placeholder="请输入成交结束数量"
                @change="numberEndChange"
                size="small">
            </el-input>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5" class="name">产品类型：</el-col>
          <el-col :span="18">
            <el-select
                class="transacDetails-indexs"
                v-model="transacDetails.productType"
                style="width:100%"
                @change="productChange5"
                placeholder="请选择产品类型"
                size="small">
              <el-option
                  v-for="productFor in productTypeOption"
                  :key="productFor.value"
                  :label="productFor.text"
                  :value="productFor.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1" v-if="stockCodeCYZCX5">
          <el-col :span="19" v-if="reportCodeCYZCX1">
            <el-select
                type="text"
                clearable
                v-model="transacDetails.securityCode"
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
                v-model="transacDetails.reportCode"
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
          <el-col :span="5" class="name">信用类型：</el-col>
          <el-col :span="17">
            <el-select
                v-model="transacDetails.cardType"
                :disabled="transacDetails.orderState!=='1'"
                style="width: 100%;"
                multiple
                collapse-tags
                @change="handleCreditTypeChange"
                placeholder="请选择信用类型"
                size="small">
              <el-option
                  v-for="cardFor in cardTypeOption"
                  :key="cardFor.value"
                  :label="cardFor.text"
                  :value="cardFor.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="basiceInformationShow">
      <div slot="header">
        <span>查询结果</span>
        <el-dropdown @command="handleExportData" style="float: right;">
          <el-button type="primary" size="mini">
            导出 <i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="excel"><i class="el-icon-document"></i>全部导出为EXCEL</el-dropdown-item>
            <el-dropdown-item command="csv"><i class="el-icon-tickets"></i>全部导出为CSV</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="queryResult">
        <el-row>
          <el-col>
            <el-table
                class="el-card-table"
                max-height="500"
                border
                ref="accountRerf"
                :data="accountDatas"
                v-loading="queryResLoadMain"
                element-loading-spinner="el-icon-loading"
                element-loading-text="数据加载中，请耐心等待..."
                element-loading-background="rgba(0,0,0,0.3)">
              <el-table-column
                  v-for="column in biTableList"
                  :key="column.field"
                  :align="column.align"
                  :label="column.label"
                  :prop="column.field"
                  :sortable="column.sortable == null ? false : column.sortable"
                  :sort-method="column.sortMethod"
                  :min-width=column.minWidth
                  :formatter="column.formatter">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="resultNum">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
  import TextUpload from '../../common/textUpload'
  import {
    postTransaction, // 参与者查询成交详情接口
    getDetailType, // 交易类型公共接口
    getProductType2, // 产品类型公共接口
    getStockQuery, //  证券代码接口 公共接口
    getCreditType2, // 平台类型/信用类型/订单类型公共接口
    downloadTransactionStatistice // 导出数据
  } from '@/service/analysisTool/participatorType/index'
import MinxinVue from './MixIn'
  export default {
    name: 'transactionDetails',
    props: ['commonData', 'informationCodeType', 'currentSelectData'],
    // 注册组件
    components: {
      TextUpload // 上传账号组件
    },
mixins: [MinxinVue],
    data () {
      return {
        queryResLoadMain: false,
        basiceInformationShow: false, // 查询结果显示
        salePartCodeT: [],
        salePartOptionsT: [],
        transacDetails: {
          inCredit: false, // 含信用代码
          orderState: '1', // 平台类型
          tradsType: 'X', // 交易类型  1=竞价 2=固定收益 ALL
          securityCode: [], // 模糊搜索证券代码
          reportCode: '', // 上传证券代码
          productType: 'ALL', // 产品类型
          dealState: ['B', 'S'], // 买卖状态
          orderType: ['ALL'], // 订单类型
          cardType: ['ALL'], // 信用类型
          priceStart: '', // 成交开始价格
          priceEnd: '', // 成交结束价格
          numberStart: '', // 成交开始数量
          numberEnd: '' // 成交结束数量
        },
        stockCodeCYZCX5: false, // 证券代码（产品类型的值==8）时显示  成交详情
        reportCodeCYZCX2: false,
        reportCodeCYZCX1: true,
        inCodeOptions: [],
        intCodeLoading: true,
        currentSelectListV: [],
        salePartValue: [],
        inCodeList: [],

        // 平台类型
        platformTypeOption: [
          {
            value: '1',
            text: '竞价'
          }
        ],
        // 产品类型值
        productTypeOption: [
          {
            value: 'ALL',
            text: '全部'
          }
        ],
        // 订单类型
        orderTypeOption: [
          {
            value: 'ALL',
            text: '全部'
          }
        ],
        // 信用类型
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
        // 上传
        uploadOption: {name: '上传', size: 'small'},
        biTableList: [
          {
            label: '成交编号',
            field: 'tranidno',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'tranidno')
          },
          {
            label: '证券代码',
            field: 'instrument_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '证券名称',
            field: 'chn_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'chn_name')
          },
          {
            label: '成交日期',
            field: 'trandat',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trandat')
          },
          {
            label: '成交时间',
            field: 'trantim',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trantim')
          },
          {
            label: '成交数量',
            field: 'trdqty',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty')
          },
          {
            label: '成交价格',
            field: 'tradmtchprc',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'tradmtchprc'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买方账户',
            field: 'invacctno_b',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno_b')
          },
          {
            label: '买方账户名称',
            field: 'account_b',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'account_b')
          },
          {
            label: '买方一码通账户名称',
            field: 'b_ymt_account_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'b_ymt_account_id')
          },
          {
            label: '买方PBU',
            field: 'pbuid_b',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbuid_b')
          },
          {
            label: '买方营业部名称',
            field: 'branch_name_b',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name_b')
          },
          {
            label: '买方券商名称',
            field: 'member_name_b',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'member_name_b')
          },
          {
            label: '卖方账户',
            field: 'invacctno_s',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'invacctno_s')
          },
          {
            label: '卖方账户名称',
            field: 'account_s',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'account_s')
          },
          {
            label: '卖方一码通账户名称',
            field: 's_ymt_account_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 's_ymt_account_id')
          },
          {
            label: '卖方PBU',
            field: 'pbuid_s',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbuid_s')
          },
          {
            label: '卖方营业部名称',
            field: 'branch_name_s',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name_s')
          },
          {
            label: '卖方券商名称',
            field: 'member_name_s',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'member_name_s')
          },
          {
            label: '平台类型',
            field: 'platformtype',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'platformtype')
          },
          {
            label: '交易类型',
            field: 'trdtyp',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdtyp')
          },
          {
            label: '买方订单类型',
            field: 'ordrtypcod_b',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrtypcod_b')
          },
          {
            label: '卖方订单类型',
            field: 'ordrtypcod_s',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrtypcod_s')
          },
          {
            label: '买方信用类型',
            field: 'credittag_b',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'credittag_b')
          },
          {
            label: '卖方信用类型',
            field: 'credittag_s',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'credittag_s')
          },
          {
            label: '买方申报价格',
            field: 'ordrexeprc_b',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrexeprc_b'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '卖方申报价格',
            field: 'ordrexeprc_s',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrexeprc_s'),
            formatter: this.gfnElColFormatDecThou3
          },
          {
            label: '买方申报数量',
            field: 'num_b',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'num_b')
          },
          {
            label: '卖方申报数量',
            field: 'num_s',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'num_s')
          }
        ],
        accountDatas: [],
        currentPage: 1,
        pageSize: 10,
        resultNum: 0,
        pageSizes: [10, 20, 50, 100],
        // 接受父组件的值
        participateType: '', // 账户类型
        priceStartChangeData: '', // 开始价格存储比较
        priceEndChangeChangeData: '', // 结束价格存储比较
        numberStartChangeData: '', // 开始数量存储比较
        numberEndChangeChangeData: '', // 结束数量存储比较
        salePartVal1: {},
        sheetNameTab: '' // 导出报表名称
      }
    },
    methods: {
      getRequestParams () {
        let isinCodes = ''
        if (this.reportCodeCYZCX1) {
          isinCodes = this.transacDetails.securityCode.join(',')
        } else if (this.reportCodeCYZCX2) {
          isinCodes = this.transacDetails.reportCode
        } else {
          isinCodes = ''
        }
        let isContainE = this.transacDetails.inCredit ? '1' : '0'
        let actorCodeIn = ''
        if (this.commonData.participateType === 'salePart') {
          actorCodeIn = this.salePartCodeT
        } else {
          actorCodeIn = this.commonData.uploadCode
        }
        // 查询入参处理
        return {
          actorType: this.commonData.participateType, // 参与者类型
          actorCode: actorCodeIn, // 参与者类型代码
          dateTimeStart: this.commonData.dateTimeStart, // 开始时间
          dateTimeEnd: this.commonData.dateTimeEnd, // 结束时间
          isContainE: isContainE, // 信用账户
          platformType: this.transacDetails.orderState, // 平台类型
          tradeType: this.transacDetails.tradsType, // 交易类型
          stockType: this.transacDetails.productType, // 产品类型
          stockCode: isinCodes, // 证券代码
          priceStart: this.transacDetails.priceEnd, // 成交价格
          saleState: this.transacDetails.dealState.join(','), // 买卖状态
          orderType: this.transacDetails.orderType.join(','), // 订单类型
          creditType: this.transacDetails.cardType.join(','), // 信用类型
          priceEnd: this.transacDetails.numberStart, // 成交价格
          numberStart: this.transacDetails.numberStart, // 成交数量
          numberEnd: this.transacDetails.numberEnd, // 成交数量
          pageIndex: this.currentPage,
          pageRows: this.pageSize
        }
      },
      /* 导出数据 */
      exportData (type) {
        let params = this.getRequestParams()
        params.fileType = type
        params.type = 'dealDetail'
        params.tableColumns = [{
          sheetName: this.sheetNameTab,
          fileColumns: this.tableColumnsData
        }]
        downloadTransactionStatistice(params)
      },
      // 导出数据操作
      handleExportData (val) {
        switch (this.commonData.participateType) {
          case 'account' :
            this.sheetNameTab = '账户成交详情'
            this.tableColumnsData = this.biTableList
            break
          case 'uniteCode':
            this.sheetNameTab = '一码通成交详情'
            this.tableColumnsData = this.biTableList
            break
          case 'salePart':
            this.sheetNameTab = '营业部成交详情'
            this.tableColumnsData = this.biTableList
            break
          case 'member':
            this.sheetNameTab = '券商成交详情'
            break
          case 'pbu':
            this.sheetNameTab = 'PBU成交详情'
            break
        }
        this.exportData(val)
      },
      // 父组件传值给子组件
      getStockCode () {
        this.salePartOptionsT = this.currentSelectData
        this.participateType = this.commonData.participateType
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
          this.transacDetails.securityCode = []
          this.salePartValue = []
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
          this.transacDetails.reportCode = TxtData
          this.salePartValue = []
        } else {
          this.salePartValue = []
          this.reportCodeCYZCX2 = false
          this.reportCodeCYZCX1 = true
        }
      },

      //  平台类型下拉内容获取
      platformSelectOptions () {
        getCreditType2('platform').then((resp) => {
          this.platformTypeOption = resp
          this.platformTypeOption.unshift({value: 'ALL', text: '全部'})
        })
      },
      //  交易类型下拉内容获取
      tradsOptions (val) {
        // 竞价
        getDetailType('transaction', val).then((resp) => {
          this.tradeTypeOption = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.tradeTypeOption.unshift(All)
        })
      },
      //  产品类型下拉内容获取
      trads1Options () {
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
        this.transacDetails.cardType = this.orderOrCreditChange(val)
      },
      handleOrderTypeChange(val){
        this.transacDetails.orderType = this.orderOrCreditChange(val)
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

      // 平台类型
      orderChange (val) {
        switch (val) {
          case '1' :
            this.tradsOptions('1')
            this.transacDetails.tradsType = 'X'
            break
          case '2' :
            this.tradsOptions('2')
            this.transacDetails.tradsType = 'ALL'
            break
          case '3' :
            this.transacDetails.tradsType = ''
            break
          case 'ALL' :
            this.transacDetails.tradsType = ''
            this.tradsOptions('1')
            break
        }
        this.transacDetails.orderType = ['ALL']
        this.transacDetails.cardType = ['ALL']
      },
      // 成交开始价格
      priceStartChange (value) {
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
        this.transacDetails.priceStart = this.gfnFormatDecThou(value, 3)
      },
      // 成交结束价格
      priceEndChange (value) {
        this.priceEndChangeChangeData = value
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
        this.transacDetails.priceEnd = this.gfnFormatDecThou(value, 3)
      },
      // 成交开始数量
      numberStartChange (value) {
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
      numberEndChange (value) {
        this.numberEndChangeChangeData = value
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
      // 产品类型
      productChange5 (val) {
        if (val == '0') {
          this.stockCodeCYZCX5 = true
        } else {
          this.stockCodeCYZCX5 = false
        }
      },

      // 清空
      clearForm () {
        this.transacDetails.securityCode = []
        this.transacDetails.reportCode = ''
        this.transacDetails.orderState = '1'
        this.transacDetails.inCredit = false
        this.transacDetails.productType = 'ALL'
        this.stockCodeCYZCX5 = false
        this.transacDetails.dealState = ['B', 'S']
        this.transacDetails.orderType = ['ALL']
        this.transacDetails.cardType = ['ALL']
        this.transacDetails.tradsType = 'X'
        this.transacDetails.priceStart = ''
        this.transacDetails.priceEnd = ''
        this.transacDetails.numberStart = ''
        this.transacDetails.numberEnd = ''
        this.tradsOptions('1')
      },
      // 查询
      getQueryRes () {
        this.queryResLoadMain = true
        this.basiceInformationShow = true
        let params = this.getRequestParams()
        if (
        this.transacDetails.orderState != '' &&
        this.transacDetails.dealState != '') {
          postTransaction(params).then((resp) => {
            this.accountDatas = resp.bizData.metaData
            this.resultNum = resp.bizData.totalRows
            this.queryResLoadMain = false
          })
        }
      },
      handleSizeChange (val) {
        this.currentPage = 1
        this.pageSize = val
        this.getQueryRes()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getQueryRes()
      }
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
      this.platformSelectOptions()
      this.tradsOptions('1')
      this.trads1Options()
      this.orderSelectOptions()
      this.creditSelectOptions()
    }
  }
</script>
<style lang="less">
  .transactionDetails {
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
    }
  }
</style>
