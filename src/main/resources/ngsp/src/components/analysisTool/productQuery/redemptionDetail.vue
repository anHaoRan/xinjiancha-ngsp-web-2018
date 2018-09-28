<template>
  <!--赎回详情-->
  <div class="redemption-detail">
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
        ref="redemptionDetailForm"
        :model="redemptionDetailForm">

        <el-row style="margin-bottom: 20px;">
          <el-col :span="6" :offset="1">
            <el-col :span="6" class="name"><span class="mustInput name" :v-show="accountType=='accountArr'">*</span>基金代码：
            </el-col>
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

            <el-col :span="4" class="name"><span class="mustInput name">*</span>代码：</el-col>
            <el-col :span="18" v-if="accountType=='account'">
              <el-col :span="19">
                <el-input
                  v-model="redemptionDetailForm.invacctnos"
                  placeholder="请输入参与者代码"
                  size="small">
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
                          width="260"
                          trigger="click">
                <el-tree :data="treeData"
                         ref="tree"
                         show-checkbox
                         hightlight-current
                         node-key="id"
                         :props="defaultProps"
                         @check-change="getCheckedKeys">
                </el-tree>
              </el-popover>
              <el-input size="small " v-popover:popover style="width: 250px;"
                        v-model="accountArrType"></el-input>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="1">
            <el-col :span="6" class="name">赎回量：</el-col>
            <el-col :span="14">
              <el-col :span="11">
                <el-form-item size="small" prop="numberStart">
                  <el-input
                    size="small"
                    v-model.number="redemptionDetailForm.numberStart"
                    @change="checkNumberStart">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="name middleText" style="text-align: center"> —</el-col>
              <el-col :span="11">
                <el-form-item size="small" prop="numberEnd">
                  <el-input
                    size="small"
                    v-model.number="redemptionDetailForm.numberEnd"
                    @change="checkNumberEnd">
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

    </el-card>
  </div>
</template>

<script>
  import TextUpload from '../../common/textUpload'
  import { getRedemptionDetailRes, getTreeData } from '../../../service/analysisTool/productQuery'
  import MinxinVue from './common/MixIn'

  export default {
    name: 'redemption-detail',
    components: {TextUpload},
    mixins: [MinxinVue],
    data () {
      return {
        msg: '赎回详情',
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
        redemptionDetailForm: {
          uploadStockCode: true,
          invacctnos: '',
          numberStart: '',
          numberEnd: ''
        },
        uploadOption: {name: '上传', size: 'small'},
        queryResult: false,
        queryResLoad: false,
        tableOptions: [],
        accountOptions: [
          {
            label: '赎回编号',
            field: 'ordrno',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrno')
          },
          {label: '基金代码', field: 'instrument_id', align: 'left', sortable: false},
          {label: '基金名称', field: 'instrument_chn_short_name', align: 'left', sortable: false},
          {
            label: '赎回时间',
            field: 'trandat',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trandat')
          },
          {label: '投资人账户', field: 'account', align: 'left', sortable: false},
          {
            label: '基金净值',
            field: 'nav',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'nav')
          },
          {
            label: '赎回金额',
            field: 'ordramt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordramt')
          },
          {
            label: '赎回量',
            field: 'ordrqty',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrqty')
          }
        ],
        accountArrOptions: [
          {label: '赎回编号', field: 'ordrno', align: 'left', sortable: false},
          {label: '基金代码', field: 'instrument_id', align: 'left', sortable: false},
          {label: '基金名称', field: 'instrument_chn_short_name', align: 'left', sortable: false},
          {
            label: '赎回时间',
            field: 'trandat',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trandat')
          },
          {label: '投资人账户', field: 'account', align: 'left', sortable: false},
          {label: '所属账户组', field: 'group_id', align: 'left', sortable: false},
          {label: '账户组类型', field: 'type_name', align: 'left', sortable: false},
          {
            label: '基金净值',
            field: 'nav',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'nav')
          },
          {
            label: '赎回金额',
            field: 'ordramt',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordramt')
          },
          {
            label: '赎回量',
            field: 'ordrqty',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ordrqty')
          }
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
        if (this.accountArrVal == '' && this.redemptionDetailForm.invacctnos == '') {
          this.$message.error('代码不能为空')
          return
        }
        let numberStart = this.redemptionDetailForm.numberStart
        let numberEnd = this.redemptionDetailForm.numberEnd
        if (!(this.gfnFloatReg3(numberStart) && this.gfnFloatReg3(numberEnd))) {
          this.$message.error('赎回量输入格式错误，请重新输入')
          return
        }
        let params = {
          dateTimeStart: this.commonData.dateTimeStart,
          dateTimeEnd: this.commonData.dateTimeEnd,
          stockCode: this.stockCode.split(' ')[0],
          actorKind: this.accountType,
          actorKindCode: '',
          numberStart: this.redemptionDetailForm.numberStart,
          numberEnd: this.redemptionDetailForm.numberEnd,
          pageIndex: this.currentPage,
          pageRows: this.pageSize
        }
        switch (this.accountType) {
          case 'account':
            if (!this.gfnStockCodeReg(this.redemptionDetailForm.invacctnos)) {
              this.$message.error('代码输入格式应满足：[A-Z]#########，#表示数字，多个账户需用  ‘,’ 分隔。 ')
              return
            }
            params.actorKindCode = this.redemptionDetailForm.invacctnos
            this.tableOptions = this.accountOptions
            break
          case 'accountArr':
            params.actorKindCode = this.accountArrVal
            this.tableOptions = this.accountArrOptions
            break
        }
        this.queryResult = true
        this.queryResLoad = true
        getRedemptionDetailRes(params).then(resp => {
          if (resp) {
            this.queryResLoad = false
            this.tableData = resp.bizData.metaData
            this.resultNum = resp.bizData.totalRows - 0
          }
        })
      },
      getTreeRes (params) {
        getTreeData(params).then(resp => {
          this.treeData = resp.treeData
        })
      },
      resetAll () {
        this.accountType = 'account'
        this.accountArrType = ''
        this.redemptionDetailForm.numberStart = ''
        this.redemptionDetailForm.numberEnd = ''
        this.redemptionDetailForm.invacctnos = ''
        this.accountArrVal = ''
      },
      getStockCode () {
        this.stockCode = this.commonData.stockCode
      },
      getTxtData (TxtData) {
        this.redemptionDetailForm.invacctnos = TxtData.join(',')
      },
      changeAccountType (val) {
        if (val === 'account') {
          this.accountArrVal = ''
          this.accountArrType = ''
        } else if (val === 'accountArr') {
          this.redemptionDetailForm.invacctnos = ''
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
      checkNumberStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.redemptionDetailForm.numberEnd, true, false, '赎回量格式错误，请重新输入')
        this.redemptionDetailForm.numberStart = startNum
        this.redemptionDetailForm.numberEnd = endNum
      },
      checkNumberEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.redemptionDetailForm.numberStart, value, true, false, '赎回量格式错误，请重新输入')
        this.redemptionDetailForm.numberStart = startNum
        this.redemptionDetailForm.numberEnd = endNum
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
    }
  }
</script>

<style lang='less'>
  .redemption-detail {
    .el-row {
      height: 32px;

    }
  }

</style>
