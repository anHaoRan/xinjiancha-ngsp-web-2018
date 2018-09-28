<!-- 一码通关联账户查询 -->
<template>
  <div class='one-code-associated-account'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber">
          <div slot="is3">
            <el-table
              :data="tableCalc"
              border
              size="small"
              style="width: 100%;">
              <el-table-column
                v-for="(item, index) in columnsCalc"
                align="center"
                :key="index"
                :label="item.label"
                :prop="item.field">
              </el-table-column>
            </el-table>
          </div>
        </statistic-caliber>
        <el-button size='small' type='info'  @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-form :inline='true' ref='accountOneYardForm' :model='formData' :rules='rules' label-width='100px' class='demo-form-inline one-code-associated-account-form'>
        <el-form-item label='查询类别：' prop='acctType' >
          <el-radio-group v-model='formData.acctType'>
            <el-radio :label='1'>账户代码</el-radio>
            <el-radio :label='2'>身份证号码(15或18位)</el-radio>
            <el-radio :label='3'>一码通号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='查询信息：' prop='inputValue'>
          <!--<account-code-->
            <!--:ref="`validateInputRef`"-->
            <!--:codeType="`queryInfo`"-->
            <!--:uploadParams="{-->
                  <!--parseRule: JSON.stringify(-->
                    <!--{-->
                      <!--verifies: ['ACCOUNT_CODE', 'ID_CODE', 'YMT_CODE']-->
                    <!--}-->
                  <!--)-->
                <!--}"-->
            <!--@getTextareaCodeList="getAccountListFunc"></account-code>-->
          <template v-if="formData.acctType == 1">
            <account-code
              :ref="`validateInputRef`"
              :codeType="`queryInfo`"
              :uploadParams="{
                parseRule: JSON.stringify(
                  {verifies: ['ACCOUNT_CODE']}
                )
              }"
              @getTextareaCodeList="getAccountListFunc"></account-code>
          </template>
          <template v-if="formData.acctType == 2">
              <account-code
                :ref="`validateInputRef`"
                :codeType="`queryInfo`"
                :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['ID_CODE']}
              )
            }"
                @getTextareaCodeList="getAccountListFunc"></account-code>
            </template>
          <template v-if="formData.acctType == 3">
            <account-code
              :ref="`validateInputRef`"
              :codeType="`account`"
              :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['YMT_CODE']}
              )
            }"
              @getTextareaCodeList="getAccountListFunc"></account-code>
          </template>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <export-btn @handleExportData="handleExportData"></export-btn>
        <el-col :span='24'>
          <common-table-pagination-component
            :loading='loading'
            :tableData='tableData'
            :columns='columns'
            :pagination='pagination'
            :totalNum='totalNum'
            @handlePaginationChange='handlePaginationChange'
          ></common-table-pagination-component>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getAccountOneYard } from '../../../service/analysisTool/complexQuery/index'
import {selfValidateMethod} from './componentsTool/common/validate'
export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    TextUpload: () => import('../../common/textUpload'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    commonTablePaginationComponent: () => import('./componentsTool/common/commonTablePaginationComponent'),
    AccountCode: () => import('./componentsTool/common/TextAreaCodesAndUploadComponent'),
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber')
  },
  data() {
    return {
      columnsCalc: [
        {id: 'calc1', label: '账户类别', field: 'calcType'},
        {id: 'calc2', label: '账户类别描述', field: 'calcDetail'}
      ],
      tableCalc: [
        {
          calcType: '11',
          calcDetail: '沪市A股账户'
        },
        {
          calcType: '12',
          calcDetail: '沪市B股账户'
        },
        {
          calcType: '13',
          calcDetail: '沪市封闭式基金账户'
        },
        {
          calcType: '14',
          calcDetail: '沪市A股信用证券账户'
        },
        {
          calcType: '15',
          calcDetail: '沪市衍生品合约账户'
        },
        {
          calcType: 'A1',
          calcDetail: '沪市结算参与人债券质押式报价回购质押专用账户'
        },
        {
          calcType: 'A2',
          calcDetail: '沪市结算参与人约定购回式证券交易专用证券账户'
        },
        {
          calcType: 'A3',
          calcDetail: '沪市结算参与人交收担保品账户'
        },
        {
          calcType: 'A4',
          calcDetail: '沪市结算参与人债券回购质押处置账户'
        },
        {
          calcType: 'A5',
          calcDetail: '沪市结算参与人债券回购质押专用账户'
        },
        {
          calcType: 'A6',
          calcDetail: '沪市结算参与人证券处置账户'
        },
        {
          calcType: 'A7',
          calcDetail: '沪市结算参与人证券待交收账户'
        },
        {
          calcType: 'A8',
          calcDetail: '沪市结算参与人证券待清偿账户'
        },
        {
          calcType: 'A9',
          calcDetail: '沪市结算参与人证券交收账户'
        },
        {
          calcType: 'AA',
          calcDetail: '沪市结算参与人融券专用证券账户'
        },
        {
          calcType: 'AB',
          calcDetail: '沪市结算参与人客户信用交易担保证券账户'
        },
        {
          calcType: 'AC',
          calcDetail: '沪市结算参与人权证创设履约担保证券交收专用账户'
        },
        {
          calcType: 'AD',
          calcDetail: '沪市结算参与人专用证券交收账户'
        },
        {
          calcType: 'AE',
          calcDetail: '沪市结算参与人转融通担保证券明细账户'
        },
        {
          calcType: 'AF',
          calcDetail: '沪市结算参与人质押挂账账户'
        },
        {
          calcType: 'AG',
          calcDetail: '沪市发行人回购专户'
        },
        {
          calcType: 'AH',
          calcDetail: '沪市发行人权证行权专用证券账户'
        },
        {
          calcType: 'AI',
          calcDetail: '沪市发行人未确认持有人证券专用账户'
        },
        {
          calcType: 'AJ',
          calcDetail: '沪市中国证券金融股份有限公司转融通担保证券账户'
        },
        {
          calcType: 'AK',
          calcDetail: '沪市中国证券金融股份有限公司转融通专用证券账户'
        },
        {
          calcType: 'AL',
          calcDetail: '沪市登记结算系统中国结算深圳分公司配售专用账户'
        },
        {
          calcType: 'AM',
          calcDetail: '沪市登记结算系统未确认持有人证券专用挂账账户'
        },
        {
          calcType: 'AN',
          calcDetail: '沪市登记结算系统未登记股份证券账户'
        },
        {
          calcType: 'AO',
          calcDetail: '沪市登记结算系统证券集中交收账户'
        },
        {
          calcType: 'AQ',
          calcDetail: '沪市登记结算系统B股冻结专用账户'
        },
        {
          calcType: 'AR',
          calcDetail: '沪市登记结算系统信用交易担保挂账账户'
        },
        {
          calcType: 'AS',
          calcDetail: '沪市登记结算系统担保品挂账账户'
        },
        {
          calcType: 'AT',
          calcDetail: '沪市登记结算系统质押挂账账户'
        },
        {
          calcType: 'AW',
          calcDetail: '沪市登记结算系统质押处置挂账账户'
        },
        {
          calcType: 'AX',
          calcDetail: '沪市登记结算系统特别账户'
        },
        {
          calcType: 'AY',
          calcDetail: '沪市登记结算系统债券回购质押专用账户'
        },
        {
          calcType: 'AZ',
          calcDetail: '沪市登记结算系统国债期货专用证券交收账户'
        },
        {
          calcType: 'B1',
          calcDetail: '沪市登记结算系统证券处置账户'
        }
      ],
      statisticCaliber: [
        {
          title: '1.\t查询类别为一码通账户号：',
          content: [
            'a)\t一码通号：来自查询条件',
            'b)\t账户类别：从“账户一码通关系文件”中查询出条件“一码通号”对应的所有证券账户的账户类别',
            'c)\t账户代码：从“账户一码通关系文件”中查询出该一码通号对应的所有证券账户',
            'd)\t账户名称：从“账户一码通关系文件”中查询出该一码通号对应的所有证券账户，再根据证券账户从“开户资料”中查出账户名称',
            'e)\t账户证件号码：从“账户一码通关系文件”中查询出该一码通号对应的所有证券账户，再根据证券账户从“开户资料”中查出账户证件号码'
          ]
        },
        {
          title: '2.\t查询类别为证券账户：',
          content: [
            'a)\t一码通号：从“账户一码通关系文件”中查询出该证券账户对应的所有一码通号（理论上只对应一个一码通号）',
            'b)\t账户类别：从“账户一码通关系文件”中查询出该证券账户对应的所有一码通号（理论上只对应一个一码通号），再查出该一码通号对应的所有证券账户的账户类别',
            'c)\t账户代码：从“账户一码通关系文件”中查询出该证券账户对应的所有一码通号（理论上只对应一个一码通号），再查出该一码通号对应的所有证券账户',
            'd)\t账户名称：从“账户一码通关系文件”中查询出该证券账户对应的所有一码通号（理论上只对应一个一码通号），再查出该一码通号对应的所有证券账户，再从“开户资料”中查出账户名称',
            'e)\t账户证件号码：从“账户一码通关系文件”中查询出该证券账户对应的所有一码通号（理论上只对应一个一码通号），再查出该一码通号对应的所有证券账户，再从“开户资料”中查出账户证件号码'
          ]
        },
        {
          title: '3.\t查询类别为身份证号码',
          content: [
            'a)\t一码通号：从“新开户资料”中查询出该身份证号（15位，18位换算为15位进行统一匹配）对应的所有证券账户，从“账户一码通关系文件”中查出证券账号对应的所有一码通号（理论上只对应一个一码通号）',
            'b)\t账户类别：从“新开户资料”中查询出该身份证号（15位，18位换算为15位进行统一匹配）对应的所有证券账户，再从“账户一码通关系文件”中查出这些证券账户的账户类别',
            'c)\t账户代码：从“新开户资料”中查询出该身份证号（15位，18位换算为15位进行统一匹配）对应的所有证券账户，再从“账户一码通关系文件”中查询出该证券账户对应的所有一码通号（理论上只对应一个一码通号），再查出该一码通号对应的所有证券账户',
            'd)\t账户名称：从“新开户资料”中查询出该身份证号（15位，18位换算为15位进行统一匹配）对应的所有证券账户，再从“账户一码通关系文件”中查询出该证券账户对应的所有一码通号（理论上只对应一个一码通号），再查出该一码通号对应的所有证券账户，再从“开户资料”中查出账户名称',
            'e)\t账户证件号码：从“新开户资料”中查询出该身份证号（15位，18位换算为15位进行统一匹配）对应的所有证券账户，再从“账户一码通关系文件”中查询出该证券账户对应的所有一码通号（理论上只对应一个一码通号），再查出该一码通号对应的所有证券账户，再从“开户资料”中查出账户证件号码'
          ]
        },
        {
          title: '4.\t本应用中账户类别展示“账户类别描述”，有如下取值：',
          rewrite:true
        },
        {
          title: '5.\t正常情况下，预期T日22:00以后可查询T日有效的数据。 后续待中登账户信息数据接入后，进一步优化本模块。'
        }
      ],
      currentngspUid: '', // 用来记录上一次返回的ngspUid
      loading: false,
      totalNum: 0,
      pagination: {
        currentPage: 1,
        pageSizeNumber: 10
      },
      queryData: { }, // 接口查询参数,保存上次查询参数
      formData: { // 查询参数
        acctType: 1,
        inputValue: '' // 用户输入
      },
      tableData: [],
      columns: [ // 定义列
        {
          label: '一码通账户',
          field: 'ccrc_acct_id',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortColByNumber.bind(this, 'ccrc_acct_id')
        },
        {
          label: '账户类别',
          field: 'acct_type_desc',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_type_desc')
        },
        {
          label: '账户代码',
          field: 'acct_id',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_id')
        },
        {
          label: '账户名称',
          field: 'acct_name',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_name')
        },
        {
          label: '账户证件号码',
          field: 'id_card',
          align: 'left',
          sortable: true,
          sortMethod: this.gfnSortByChineseCharacters.bind(this, 'id_card')
        }
      ],
      rules: {
        acctType: [
          {required: true, message: '请选择查询类别', trigger: 'change'}
        ],
        inputValue: [
          {required: true, message: '请输入查询信息', trigger: 'blur'}
        ]
      },
      breadcrumbItems: [
        {
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '数据综合查询'
        }, {
          router: '/accountOneYard',
          label: '一码通关联账户查询'
        }]
    }
  },
  methods: {
    getAccountListFunc(data) {
      this.formData.inputValue = data
    },
    clearForm() {
      this.$refs[`validateInputRef`].clearCodeList()
      this.$refs['accountOneYardForm'].resetFields()
    },
    reqTableData(type) {
      let params = {
        acctType: type ? this.formData.acctType : this.queryData.acctType,
        inputValue: type ? this.formData.inputValue : this.queryData.inputValue,
        ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
        pageIndex: this.pagination.currentPage,
        pageRows: this.pagination.pageSizeNumber,
        isExport: 0, // 1代表导出报表
        exportType: '', // excel,csv
        isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
      }
      this.loading = true
      getAccountOneYard(params).then((resp) => {
        this.loading = false
        if (resp) {
          resp.data.length > 0 ?  this.currentngspUid = resp.ngsp_uid : this.currentngspUid = ''
          this.tableData = resp.data
          this.totalNum = Number(resp.totalRowCount)
        } else {
          this.currentngspUid = ''
          this.tableData = []
        }
      })
    },
    handleSearch() { // 查询按钮
      this.$refs['accountOneYardForm'].validate((valid) => {
        if (valid) {
          let obj = {}
          switch (this.formData.acctType) {
            case 1:
              obj = {accounts: this.formData.inputValue}
              break
            case 2:
              obj = {identityNos: this.formData.inputValue}
              break
            case 3:
              obj = {imtNos: this.formData.inputValue}
              break
          }
          if (!selfValidateMethod(obj)) { /* 批量校验格式 */
            return
          }
          this.queryData = JSON.parse(JSON.stringify(this.formData))
          this.pagination.currentPage = 1
          this.reqTableData(1)
        }
      })
    },
    handlePaginationChange(pagination) {
      this.pagination = pagination
      this.reqTableData(0)
    },
    // 处理导出表格数据
    handleExportData(type) {
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let params = {
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: this.columns
      }
      this.gfnExportFileWithForm('/complexqry/account/v1/oneyard/accountoneyard/export', params)
    }
  }
}
</script>

<style lang='less' scoped>
  .one-code-associated-account {
  }

</style>
