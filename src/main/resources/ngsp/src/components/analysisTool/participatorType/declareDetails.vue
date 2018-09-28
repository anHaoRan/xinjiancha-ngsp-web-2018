<!--申报详情 declareDetails -->
<template>
  <div class="declareDetails">
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
          <el-checkbox v-model="declareDetails.inCredit" size="small">含信用代码</el-checkbox>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5">
            <span class="mustInput name">*</span>订单状态：
          </el-col>
          <el-col :span="18" class="name">
            <el-checkbox-group
                v-model="declareDetails.orderState"
                size="small" :min=1>
              <el-checkbox label="M">成交</el-checkbox>
              <el-checkbox label="O">未成交</el-checkbox>
              <el-checkbox label="W">撤单</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5" class="name">信用类型：</el-col>
          <el-col :span="18">
            <el-select
                v-model="declareDetails.cardType"
                calearable
                style="width: 100%;"
                multiple
                collapse-tags
                placeholder="请选择信用类型"
                size="small"
                @change="handleCreditTypeChange">
              <el-option
                  v-for="creditFor in cardTypeOption"
                  :key="creditFor.value"
                  :label="creditFor.text"
                  :value="creditFor.value">
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
                v-model="declareDetails.priceStart"
                placeholder="请输入申报开始价格"
                @change="priceStartChange"
                size="small">
            </el-input>
          </el-col>
          <el-col :span="1" class="middleText name">—</el-col>
          <el-col :span="8">
            <el-input
                type="text"
                v-model="declareDetails.priceEnd"
                placeholder="请输入申报结束价格"
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
                v-model="declareDetails.dealState"
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
                v-model="declareDetails.orderType"
                calearabel
                style="width: 100%;"
                multiple
                collapse-tags
                @change="handleOrderTypeChange"
                placeholder="请选择订单类型"
                size="small">
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
      <el-row>
        <el-col :span="8">
          <el-col :span="5" class="name">申报数量：</el-col>
          <el-col :span="8">
            <el-input
                type="text"
                v-model="declareDetails.numberStart"
                placeholder="请输入申报开始数量"
                @change="numberStartChange"
                size="small">
            </el-input>
          </el-col>
          <el-col :span="1" class="middleText name">—</el-col>
          <el-col :span="8">
            <el-input
                v-model="declareDetails.numberEnd"
                placeholder="请输入申报结束数量"
                @change="numberEndChange"
                size="small">
            </el-input>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-col :span="5" class="name">产品类型：</el-col>
          <el-col :span="18">
            <el-select
                v-model="declareDetails.productType"
                @change="productChange3"
                style="width:100%"
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
        <el-col :span="6" :offset="1" v-if="stockCodeCYZCX3">
          <el-col :span="19" v-if="reportCodeCYZCX1">
            <el-select
                type="text"
                clearable
                v-model="declareDetails.securityCode"
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
                v-model="declareDetails.reportCode"
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
                border
                class="el-card-table"
                ref="accountRerf"
                :data="accountDatas"
                show-overflow-tooltip
                v-loading="loading"
                element-loading-spinner="el-icon-loading"
                element-loading-text="数据加载中，请耐心等待..."
                element-loading-background="rgba(0,0,0,0.3)"
                style="width:100%">
              <el-table-column
                  v-for="column in biTableList_SBXQ_LIST"
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
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="resultNum">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
  import TextUpload from '../../common/textUpload'
  import {
    postDeclare, // 参与者查询申报详情接口
    getProductType2, // 产品类型公共接口
    getCreditType2, // 信用类型/订单类型公共接口
    getStockQuery, //  账户、一码通证券代码, 证券代码接口 公共接口
    downloadTransactionStatistice // 导出
  } from '@/service/analysisTool/participatorType/index'
  import MinxinVue from './MixIn'
  export default {
    name: 'declareDetails',
    props: ['commonData', 'informationCodeType', 'currentSelectData'],
    // 注册组件
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
        declareDetails: {
          inCode: [], // 参与者代码 *
          securityCode: [], // 模糊搜索证券代码
          reportCode: '', // 上传证券代码
          orderState: ['M', 'O', 'W'], // 订单状态 *
          inCredit: false, // 含信用账户
          dealState: ['B', 'S'], // 买卖状态 *
          productType: 'ALL', // 产品类型
          orderType: ['ALL'], // 订单类型
          cardType: ['ALL'], // 信用类型
          creditValue: [],
          orderValue: [],
          priceStart: '', // 申报开始价格
          priceEnd: '', // 申报结束价格
          numberStart: '', // 申报开始数量
          numberEnd: '' // 申报结束数量
        },
        stockCodeCYZCX3: false, // 证券代码（产品类型的值==8）时显示   申报详情
        reportCodeCYZCX2: false,
        reportCodeCYZCX1: true,
        inCodeOptions: [],
        intCodeLoading: true,
        currentSelectListV: [],
        salePartValue: [],
        inCodeList: [],
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

        // 上传
        uploadOption: {
          name: '上传',
          size: 'small'
        },
        // 账户  一码通  营业部
        biTableList_SBXQ_LIST: [
          {
            label: '申报编号',
            field: 'ordrno',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrno')
          },
          {
            label: '证券代码',
            field: 'instrument_id',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          },
          {
            label: '证券简称',
            field: 'instrument_chn_short_name',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_chn_short_name')
          },
          {
            label: '申报日期',
            field: 'trandat',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'trandat')
          },
          {
            label: '申报时间',
            field: 'trantim',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trantim')
          },
          {
            label: '参与者代码',
            field: 'accountid',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountid')
          },
          {
            label: '参与者名称',
            field: 'investor_account_name',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'investor_account_name')
          },
          {
            label: '方向',
            field: 'ordrbuycod',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ordrbuycod')
          },
          {
            label: '一码通账户',
            field: 'ymt_account_id',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ymt_account_id')
          },
          {
            label: '申报价格',
            field: 'ordrexeprc',
            minWidth: '100%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrexeprc')
          },
          {
            label: '申报数量',
            field: 'orderqty',
            minWidth: '100%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'orderqty')
          },
          {
            label: '未成交量',
            field: 'ordrqty',
            minWidth: '100%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrqty')
          },
          {
            label: '订单状态',
            field: 'order_state',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'order_state')
          },
          {
            label: '撤单时间',
            field: 'cantim',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByDetailTime.bind(this, 'cantim')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          },
          {
            label: '券商名称',
            field: 'member_name',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'member_name')
          },
          {
            label: '订单类型',
            field: 'ordrtypcod',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ordrtypcod')
          },
          {
            label: '信用类型',
            field: 'credittag',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'credittag')
          },
          {
            label: 'PBU代码',
            field: 'pbuoscod',
            minWidth: '100%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbuoscod')
          }
        ],
        accountDatas: [],
        pageSizes: [10, 20, 50, 100],
        currentPage: 1,
        pageSize: 10,
        resultNum: 0,

        // 接受父组件的值
        participateType: '', // 账户类型
        declareActorCode: '', // 代码
        declareTime: '', // 开始时间 - 结束日期

        salePartVal1: {},
        sheetNameTab: '', // 导出报表名称

        // 临时检验价格和数量是否正确的变量[解决bug]
        validateQuantityTemp: true,
        validatePriceTemp: true
      }
    },

    methods: {
      getRequestParams () {
        let isinCodes = ''
        if (this.reportCodeCYZCX1) {
          isinCodes = this.declareDetails.securityCode.join(',')
        } else if (this.reportCodeCYZCX2) {
          isinCodes = this.declareDetails.reportCode
        } else {
          isinCodes = ''
        }
        // 复选框是否选择，选择1，未选0
        let isContain = this.declareDetails.inCredit
        let isContainE = isContain ? '1' : '0'
        let actorCodein = ''
        if (this.commonData.participateType === 'salePart') {
          actorCodein = this.salePartCodeT
        } else {
          actorCodein = this.commonData.uploadCode
        }
        // 查询入参处理
        return {
          actorCode: actorCodein,
          actorType: this.commonData.participateType,
          dateTimeStart: this.commonData.dateTimeStart,                //  开始日期和时间
          dateTimeEnd: this.commonData.dateTimeEnd,                //  结束日期和时间
          creditType: this.declareDetails.cardType.join(','),
          isContainE: isContainE,
          stockType: this.declareDetails.productType,
          stockCode: isinCodes,
          saleState: this.declareDetails.dealState.join(','),    //
          orderState: this.declareDetails.orderState.join(','),   //
          orderType: this.declareDetails.orderType.join(','),    //
          numberStart: this.declareDetails.numberStart,
          numberEnd: this.declareDetails.numberEnd,
          priceStart: this.declareDetails.priceStart,
          priceEnd: this.declareDetails.priceEnd,
          pageIndex: this.currentPage,
          pageRows: this.pageSize
        }
      },
      /* 导出数据 */
      exportData (type) {
        let params = this.getRequestParams()
        params.fileType = type
        params.type = 'applydetail'
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
            this.sheetNameTab = '账户申报详情'
            this.tableColumnsData = this.biTableList_SBXQ_LIST
            break
          case 'uniteCode':
            this.sheetNameTab = '一码通申报详情'
            this.tableColumnsData = this.biTableList_SBXQ_LIST
            break
          case 'salePart':
            this.sheetNameTab = '营业部申报详情'
            this.tableColumnsData = this.biTableList_SBXQ_LIST
            break
          case 'member':
            this.sheetNameTab = '券商申报详情'
            break
          case 'pbu':
            this.sheetNameTab = 'PBU申报详情'
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
          this.salePartValue = []
          this.declareDetails.securityCode = []
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
          this.declareDetails.reportCode = TxtData
          this.salePartValue = []
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
        this.declareDetails.cardType = this.orderOrCreditChange(val)
      },
      handleOrderTypeChange(val){
        this.declareDetails.orderType = this.orderOrCreditChange(val)
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
        this.declareDetails.priceStart = this.gfnFormatDecThou(value, 3)
        if (Number(this.declareDetails.priceStart) > Number(this.declareDetails.priceEnd)) {
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
        this.declareDetails.priceEnd = this.gfnFormatDecThou(value, 3)
        if (Number(this.declareDetails.priceStart) > Number(this.declareDetails.priceEnd)) {
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
        if (Number(this.declareDetails.numberStart) > Number(this.declareDetails.numberEnd)) {
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
        if (Number(this.declareDetails.numberStart) > Number(this.declareDetails.numberEnd)) {
          this.$message.error('结束数量不能小于开始数量')
        } else {
          this.validateQuantityTemp = true
        }
      },
      // 产品类型
      productChange3 (val) {
        if (val == '0') {
          this.stockCodeCYZCX3 = true
        } else {
          this.stockCodeCYZCX3 = false
        }
      },
      // 清空
      clearForm () {
        this.declareDetails.securityCode = []
        this.declareDetails.reportCode = ''
        this.declareDetails.orderState = ['M', 'O', 'W']
        this.declareDetails.inCredit = false
        this.declareDetails.productType = 'ALL'
        this.stockCodeCYZCX3 = false
        this.declareDetails.dealState = ['B', 'S']
        this.declareDetails.orderType = ['ALL']
        this.declareDetails.cardType = ['ALL']
        this.declareDetails.priceStart = ''
        this.declareDetails.priceEnd = ''
        this.declareDetails.numberStart = ''
        this.declareDetails.numberEnd = ''
      },
      // 查询
      getQueryRes () {
        if (!this.validateQuantityTemp || !this.validatePriceTemp) return
        this.basiceInformationShow = true
        let params = this.getRequestParams()
        // 需要改为form验证
        if (
        this.declareDetails.orderState != '' &&
        this.declareDetails.dealState != '') {
          this.loading = true
          postDeclare(params).then((resp) => {
            this.loading = false
            this.accountDatas = resp.bizData.metaData
            this.resultNum = resp.bizData.totalRows - 0
          })
        } else {
          this.$message.error('数量不能为负值')
        }
      },
      handleSizeChange (size) {
        this.currentPage = 1
        this.pageSize = size
        this.getQueryRes()
      },
      handleCurrentChange (rowNum) {
        this.currentPage = rowNum
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
    created () {
    },
    mounted () {
      this.getStockCode()
      this.productTypeOptions()
      this.orderSelectOptions()
      this.creditSelectOptions()
    }
  }
</script>
<style lang="less">
  .declareDetails {
    .el-row {
      margin-top: 10px !important;
    }
    .el-card {
      .el-card__body {
        padding-bottom: 10px;
      }
      &:nth-child(1) {
        margin-top: 0;
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
  }
</style>
