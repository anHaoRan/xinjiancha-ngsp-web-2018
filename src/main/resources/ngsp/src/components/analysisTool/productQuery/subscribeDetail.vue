<template>
  <!--申购详情-->
  <div class="subscribe-detail">
    <el-card style="margin-top: 0;">
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="text"
          size="small"
          style="float:right;"
          @click="resetAll">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right; "
          @click="getQueyResult">查询
        </el-button>
      </div>
      <el-form
        ref="subscribeDetailForm"
        :model="subscribeDetailForm">

        <el-row style="margin-bottom: 20px;">
          <el-col :span="6" :offset="1">
            <el-col :span="6" class="name"><span class="mustInput name">*</span>基金代码：</el-col>
            <el-col :span="14">
              <el-input
                v-model="stockCode"
                placeholder="请输入证券代码"
                size="small"
                disabled>
              </el-input>
            </el-col>
          </el-col>

          <el-col :span="6" :offset='2'>
            <el-col :span="6" class="name"><span class="mustInput name">*</span>账户（组）：</el-col>
            <el-col :span="12">
              <el-select v-model="accountType" size="small" @change="changeAccountType">
                <el-option
                  label="账户"
                  value="account">
                </el-option>
                <el-option
                  label="账户(组)"
                  value="accountArr">
                </el-option>
              </el-select>
            </el-col>
          </el-col>

          <el-col :span="6" :offset='2'>

            <el-col :span="4" class="name"><span class="mustInput name" :v-show="accountType=='accountArr'">*</span>代码：
            </el-col>
            <el-col :span="18" v-if="accountType=='account'">
              <el-col :span="19">
                <el-input
                  v-model="subscribeDetailForm.invacctnos"
                  placeholder="请输入参与者代码"
                  size="small"
                  style="width: 100%">
                </el-input>
              </el-col>
              <el-col :span="3" :offset="1">
                <text-upload @getTxtCon="getTxtData" :uploadOption="uploadOption"
                             style="display: inline;"></text-upload>
              </el-col>
            </el-col>
            <el-col :span="18" v-if="accountType=='accountArr'">
              <el-popover ref="popover"
                          placement="bottom"
                          trigger="click"
                          width="260">
                <el-tree :data="treeData"
                         ref="tree"
                         show-checkbox
                         hightlight-current
                         node-key="id"
                         :props="defaultProps"
                         @check-change="getCheckedKeys">
                </el-tree>
              </el-popover>
              <el-input size="small " v-popover:popover style="width: 100%"
                        v-model="accountArrType"></el-input>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="1">
            <el-col :span="6" class="name">申购金额：</el-col>
            <el-col :span="14">
              <el-col :span="11">
                <el-form-item size="small" prop="priceStart">
                  <el-input
                    size="small"
                    v-model.number="subscribeDetailForm.priceStart"
                    @change="checkPriceStart">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="name middleText" style="text-align: center"> —</el-col>
              <el-col :span="11">
                <el-form-item size="small" prop="priceEnd">
                  <el-input
                    size="small"
                    v-model.number="subscribeDetailForm.priceEnd"
                    @change="checkPriceEnd">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-if="queryResult" class="el-card-table">
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button size="small" type="primary" v-show="false" @click="saveLocation">导出</el-button>
      </div>
      <el-table
        :data="tableData"
        :fit=true
        :highlight-current-row="false"
        border
        v-loading="queryResLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-text="loading"
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
          v-for="item in tableOptions"
          :prop="item.field"
          :label="item.label"
          :key="item.field"
          :width="item.width"
          :align="item.align == null ? 'center' : item.align"
          :sortable="item.sortable == null ? false : item.sortable"
          :sort-method="item.sortMethod"
          resizable
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div>
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
  import { getSubscribeDetailRes, getTreeData } from '../../../service/analysisTool/productQuery'
  import MinxinVue from './common/MixIn'

  export default {
    name: 'subscribe-detail',
    components: {TextUpload},
    mixins: [MinxinVue],
    data () {
      return {
        msg: '申购详情',
        stockCode: '',
        accountType: 'account',
        accountCode: '',
        accountArrType: '',
        accountArrVal: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        subscribeDetailForm: {
          uploadStockCode: true,
          invacctnos: '',
          priceStart: '',
          priceEnd: ''
        },
        uploadOption: {name: '上传', size: 'small'},
        queryResult: false,
        queryResLoad: false,
        tableOptions: [],
        accountOptions: [
          {label: '申购编号', field: 'ordrno', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordrno')},
          {label: '基金代码', field: 'instrument_id', align: 'left', sortable: false},
          {label: '基金名称', field: 'instrument_chn_short_name', align: 'left', sortable: false},
          {label: '申购时间', field: 'trandat', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trandat')},
          {label: '投资人账户', field: 'account', align: 'left', sortable: false},
          {label: '基金净值', field: 'nav', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'nav')},
          {label: '申购金额', field: 'ordramt', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordramt')},
          {label: '申购量', field: 'ordrqty', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordrqty')}
        ],
        accountArrOptions: [
          {label: '申购编号', field: 'ordrno', align: 'left', sortable: true,sortMethod:this.gfnSortByChineseCharacters.bind(this, 'ordrno')},
          {label: '基金代码', field: 'instrument_id', align: 'left', sortable: true,sortMethod:this.gfnSortByChineseCharacters.bind(this, 'instrument_id')},
          {label: '基金名称', field: 'instrument_chn_short_name', align: 'left', sortable: true,sortMethod:this.gfnSortByChineseCharacters.bind(this, 'instrument_chn_short_name')},
          {label: '申购时间', field: 'trandat', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trandat')},
          {label: '投资人账户', field: 'account', align: 'left', sortable: true,sortMethod:this.gfnSortByChineseCharacters.bind(this, 'account')},
          {label: '所属账户组', field: 'group_id', align: 'left', sortable: true,sortMethod:this.gfnSortByChineseCharacters.bind(this, 'group_id')},
          {label: '账户组类型', field: 'type_name', align: 'left', sortable: true,sortMethod:this.gfnSortByChineseCharacters.bind(this, 'type_name')},
          {label: '基金净值', field: 'nav', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'nav'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {label: '申购金额', field: 'ordramt', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordramt'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {label: '申购量', field: 'ordrqty', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ordrqty'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'}
        ],
        tableData: [],
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        resultNum: 0
      }
    },
    props: ['commonData'],
    methods: {
      getQueyResult () {
        if (this.accountArrVal == '' && this.subscribeDetailForm.invacctnos == '') {
          this.$message.error('代码不能为空')
          return
        }
        let priceStart = this.subscribeDetailForm.priceStart
        let priceEnd = this.subscribeDetailForm.priceEnd
        if (!(this.gfnFloatReg3(priceStart) && this.gfnFloatReg3(priceEnd))) {
          this.$message.error('申购金额输入格式错误，请重新输入')
          return
        }
        let params = {
          dateTimeStart: this.commonData.dateTimeStart,
          dateTimeEnd: this.commonData.dateTimeEnd,
          stockCode: this.stockCode.split(' ')[0],
          actorKind: this.accountType,
          actorKindCode: '',
          priceStart: this.subscribeDetailForm.priceStart,
          priceEnd: this.subscribeDetailForm.priceEnd,
          pageIndex: this.currentPage,
          pageRows: this.pageSize
        }
        switch (this.accountType) {
          case 'account':
            if (!this.gfnStockCodeReg(this.subscribeDetailForm.invacctnos)) {
              this.$message.error('代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。 ')
              return
            }
            this.tableOptions = this.accountOptions
            params.actorKindCode = this.subscribeDetailForm.invacctnos

            break
          case 'accountArr':
            this.tableOptions = this.accountArrOptions
            params.actorKindCode = this.accountArrVal
            break
        }
        this.queryResult = true
        this.queryResLoad = true
        getSubscribeDetailRes(params).then(resp => {
          if (resp) {
            this.queryResLoad = false
            this.tableData = resp.bizData.metaData
            this.resultNum = resp.bizData.totalRows - 0
          }
        })
      },
      resetAll () {
        this.accountType = 'account'
        this.subscribeDetailForm.invacctnos = ''
        this.accountArrVal = ''
        this.subscribeDetailForm.priceStart = ''
        this.subscribeDetailForm.priceEnd = ''
        this.accountArrType = ''
      },
      getTreeRes (params) {
        getTreeData(params).then(resp => {
          this.treeData = resp.treeData
        })
      },
      getStockCode () {
        this.stockCode = this.commonData.stockCode
      },
      getTxtData (TxtData) {
        this.subscribeDetailForm.invacctnos = TxtData.join(',')
      },
      changeAccountType (val) {
        if (val === 'account') {
          this.accountArrVal = ''
          this.accountArrType = ''
        } else if (val === 'accountArr') {
          this.subscribeDetailForm.invacctnos = ''
        }
      },
      getCheckedKeys () {
        let accountArr = this.$refs.tree.getCheckedNodes()
        let valArr = [], nameArr = []
        for (let i = 0; i < accountArr.length; i++) {
          if (accountArr[i].children) {
            continue
          } else {
            valArr.push(accountArr[i].id)
            nameArr.push(accountArr[i].label)
          }
        }
        this.accountArrVal = valArr.join(',')
        this.accountArrType = nameArr.join(',')
      },
      checkPriceStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.subscribeDetailForm.priceEnd, false, true, '申购金额格式错误，请重新输入')
        this.subscribeDetailForm.priceStart = startNum
        this.subscribeDetailForm.priceEnd = endNum
      },
      checkPriceEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.subscribeDetailForm.priceStart, value, false, true, '申购金额格式错误，请重新输入')
        this.subscribeDetailForm.priceStart = startNum
        this.subscribeDetailForm.priceEnd = endNum
      },
      saveLocation () {

      },
      handleSizeChange (size) {
        this.pageSize = size
        this.getQueyResult()
      },
      handleCurrentChange (rowNum) {
        this.currentPage = rowNum
        this.getQueyResult()
      }
    },
    mounted () {

    }
  }
</script>

<style lang='less'>
  .subscribe-detail {
    .el-row {
      height: 32px;

    }
  }
</style>
