<template>
    <div class="multiple-stocks">
        <div class="multiple-stocks-header">
            <el-form :model="selectParams" ref="selectParams" :rules="rules" :inline="true" label-width="100px"
                     label-position="right">
                <el-row :gutter="20">
                    <el-col :xl="6" :lg="8" :md="12" :sm="24">
                        <el-form-item label="参与者层级">
                            <el-select v-model="selectParams.selectValue" placeholder="请选择" size="mini">
                                <el-option
                                        v-for="item in participantOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8" :md="12" :sm="24">
                        <el-form-item label="参与者代码" prop="importCheckbox">
                            <el-input size="mini" v-model="selectParams.importCheckbox" style="width: 68%"
                                      clearable></el-input>
                            <text-upload style="display: inline-block;" @getTxtCon="getTxtData1"></text-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8" :md="12" :sm="24">
                        <el-form-item label="产品类型">
                            <el-select v-model="selectParams.selectValue2" placeholder="请选择" size="mini">
                                <el-option
                                        v-for="item in productType"
                                        :key="item.value"
                                        :label="item.text"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8" :md="12" :sm="24">
                        <el-form-item label="证券代码" v-if="selectParams.selectValue2=='0'">
                            <select-lazy-multiple :selectParams="selectParams1" @getSelectRes="getSelectRes"
                                                  style="display: inline-block;" ref="selectLazyMultiple"/>
                            <text-upload :uploadOption="uploadOption" style="display: inline-block;"
                                         @getTxtCon="getTxtData2"></text-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8" :md="12" :sm="24">
                        <el-form-item label="明细条数" prop="detilsCount">
                            <el-input size="mini" v-model="selectParams.detilsCount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8" :md="12" :sm="24">
                        <el-form-item label="账户组">
                            <down-more-select v-model="selectParams.accountGroup" ref="downMoreSelect"
                                              :optionData="accountGroupOption"></down-more-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8" :md="12" :sm="24">
                        <el-form-item label=" ">
                            <el-button type="primary" size="small" @click="ajaxStockeColumnDay('selectParams')">查询
                            </el-button>
                            <el-button type="info" size="small" @click="fnEmptySelectParams('selectParams')">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="splitline"/>
        <div style="margin-top: 20px;">
            <div style="padding: 10px;text-align: right">
                <el-button type="info" size="small" @click="stockeExport">导出</el-button>
            </div>
            <margin-table :isPageination="false" :columns="columns" :data="{data:tableData}">
                <template slot="tableColumnsUnshift">
                    <el-table-column
                            type="index"
                            align="center"
                            width="55"
                            label="编号"
                    />
                </template>
            </margin-table>
        </div>
    </div>
</template>

<script>
  import {
    stockeColumnDay,
    getProductType2,
    stockeColumnDayExport
  } from '@/service/analysisTool/realTimeDetection/index'
  import MinxinVue from '../Mixin'

  export default {
    components: {
      TextUpload: () => import('@/components/common/textUpload'),
      DownMoreSelect: () => import('@/components/common/downMoreSelect'),
      SelectLazyMultiple: () => import('@/components/common/SelectLazyMultiple'),
      MarginTable: () => import('@/components/base/MarginTable')
    },
    name: 'multiple-stocks',
    mixins: [MinxinVue],
    data () {
      let checkNumber = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
          return
        }
        if (Number(value) < 0) {
          callback(new Error('必须是正数'))
          return
        }
        if (this.selectParams.selectValue2 !== '0' && this.selectParams.selectValue2 !== 'ALL') {
          if (Number(value) > 1000) {
            callback(new Error('明细条数上限1000'))
            return
          }
        }
        if (Number(value) > 10000) {
          callback(new Error('明细条数上限10000'))
          return
        }
        callback()
      }
      let numberRules = {
        validator: checkNumber
      }
      return {
        accountGroupOption: [{
          value: '选中账户',
          label: '选中账户'
        }, {
          value: '待分析账户',
          label: '待分析账户'
        }, {
          value: '待监控账户',
          label: '待监控账户'
        }], //  传递给子组件的账户组数据
        selectParams: {
          selectValue: 'account',
          selectValue2: 'ALL',
          importCheckbox: '',
          securitiesCode: '',
          detilsCount: 5,
          accountGroup: []
        },
        rules: {
          importCheckbox: [{
            type: 'string',
            pattern: /^[A-Z]\d{9}(?:,[A-Z]\d{9})*$/,
            message: '请输入正确参与者代码',
            trigger: 'blur'
          }],
          detilsCount: [numberRules, {required: true, message: '请输入明细条数', trigger: 'blur'}]
        },
        uploadOption: {
          loading: false,
          name: '导入',
          size: 'small'
        },
        //  产品类型代码
        selectParams1: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        participantOptions: [
          {
            value: 'account',
            label: '账号',
            disabled: false
          }
          // {
          //   value: 'salePart',
          //   label: '营业部',
          //   disabled: true
          // },
          // {
          //   value: 'member',
          //   label: '券商',
          //   disabled: true
          // },
          // {
          //   value: 'pbu',
          //   label: 'PBU',
          //   disabled: true
          // },
        ],
        productType: [],
        columns: [
          {field: 'stk_code', label: '证券代码', width: '80', align: 'left'},
          {field: 'stk_tit', label: '证券简称', width: '80', align: 'left'},
          {field: 'acc_qty', label: '成交量(万股)', width: '80', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 'acc_price', label: '成交金额(万元)', width: '80', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 'by_acct_code', label: '买入账号代码', width: '80', align: 'left'},
          {field: 'by_acct_name', label: '买入账号名称', width: '120', align: 'left'},
          {field: 'by_pub', label: '买入PBU代码', width: '120', align: 'left'},
          {field: 'by_pt_title', label: '买入营业部名称', width: '120', align: 'left'},
          {field: 'by_qty', label: '买入数量(万股)', width: '80', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 'by_price', label: '买入金额(万元)', width: '80', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 'by_vp', label: '均价', width: '80', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 'sl_acct_code', label: '卖出账号代码', width: '80', align: 'left'},
          {field: 'sl_acct_name', label: '卖出账号名称', width: '120', align: 'left'},
          {field: 'sl_pub', label: '卖出PBU代码', width: '120', align: 'left'},
          {field: 'sl_pt_title', label: '卖出营业部名称', width: '120', align: 'left'},
          {field: 'sl_qty', label: '卖出数量(万股)', width: '80', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 'sl_price', label: '卖出金额(万元)', width: '80', align: 'right', formatter: this.gfnElColFormatDecThou3},
          {field: 'sl_vp', label: '均价', width: '80', align: 'right', formatter: this.gfnElColFormatDecThou3}
        ],
        tableData: [],
        exportSelectParams: ''
      }
    },
    watch: {},
    methods: {
      ajaxGetProductType2 () {
        let param = {dataType: 'productType', tag1: 'stockWithCol'}
        getProductType2(param).then((resp) => {
          this.productType = resp
          const All = {
            value: 'ALL',
            text: '全选'
          }
          this.productType.unshift(All)
        })
      },
      ajaxStockeColumnDay (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let arr = []
            if (this.selectParams.selectValue2 == '0' && this.selectParams.securitiesCode.length == 0) {
              this.$message.warning('请导入证券代码')
              return
            }
            if (this.selectParams.selectValue2 == 'ALL' && this.selectParams.importCheckbox == '') {
              this.$message.warning('当产品类型为全选时，参与者代码不得为空')
              return
            }
            if (this.selectParams.selectValue2 == '0') {
              arr = this.selectParams.securitiesCode.split(',')
            }
            let param = {
              //  分类账号：默认为账号；
              acctType: this.selectParams.selectValue,
              //  账户组 :默认为空； 可输入/导入分类中的代码； 最多可指定1000个账户；
              accountArr: this.selectParams.importCheckbox,
              //  产品类型
              procType: this.selectParams.selectValue2,
              //  明细条数
              detailBef: this.selectParams.detilsCount,
              isinCode: arr.join(','),
              accountGroup: this.getAccountGroup(this.selectParams.accountGroup)
            }
            this.exportSelectParams = param
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0,0,0,0.7)'
            })
            stockeColumnDay(param).then((res) => {
              loading.close()
              this.tableData = res.stkClmRes
            }, () => {
              loading.close()
            })
          }
        })
      },
      getSelectRes (val) {
        this.selectParams.securitiesCode = val.join(',')
      },
      getTxtData1 (val) {
        this.selectParams.importCheckbox = val.join(',')
      },
      getTxtData2 (val) {
        this.selectParams1.query = val.join(',')
        this.$refs.selectLazyMultiple.getUploadSelectOptionCon(val)
      },
      fnEmptySelectParams (formName) {
        this.$refs[formName].resetFields()
        this.selectParams.selectValue = 'account'
        this.selectParams.selectValue2 = 'ALL'
        this.selectParams.importCheckbox = ''
        this.selectParams.securitiesCode = ''
        this.selectParams.accountGroup = []
        this.$refs.downMoreSelect.cancel()
      },
      stockeExport () {
        let params = JSON.parse(JSON.stringify(this.exportSelectParams)),
        installParams = {
          fileType: 'xlsx',
          tableColumns: [
            {
              sheetName: '实时监控分析-当日多股同列',
              fileColumns: this.columns
            }
          ]
        }
        if (params === '') {
          this.$message.warning('查询后再导出')
          return
        }
        for (let key in installParams) {
          params[key] = installParams[key]
        }
        console.log(JSON.stringify(params))
        this.gfnExportFileWithForm(stockeColumnDayExport(), params)
      }
    },
    created () {
      this.ajaxGetProductType2()
    },
    mounted () {

    }
  }
</script>

<style scoped lang="less">
    .multiple-stocks {
        .multiple-stocks-header {
            padding: 20px 20px 0 20px;
        }
    }
</style>
