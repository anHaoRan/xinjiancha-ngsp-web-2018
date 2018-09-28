<!-- 交易营业部变更 -->
<template>
  <div class='integrated-trade-branch-change'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <div slot='header'>
        <span>查询条件</span>
        <statistic-caliber :statisticCaliber="statisticCaliber">
          <div slot="is0">
            <caliber></caliber>
          </div>
        </statistic-caliber>
        <el-button size='small' type='info'  @click='clearForm'>清空</el-button>
        <el-button size='small' type='primary' @click='handleSearch'>查询</el-button>
      </div>

      <el-form label-width='100px' ref='tradeBranchChangeForm' :inline="true" :model='formData' :rules='rules' class='clearfix trade-branch-change-form'>
        <el-form-item label='账户代码：' prop='acctIds'>
          <account-code
            :ref="`validateBranchAccount`"
            :codeType="`account`"
            :uploadParams="{
              parseRule: JSON.stringify(
                {verifies: ['ACCOUNT_CODE']}
              )
            }"
            @getTextareaCodeList="getAccountListFunc"></account-code>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <export-btn @handleExportData="handleExportData"></export-btn>
        <el-col>
          <tab-table-pagination-component
            :loading='loading'
            :tabPanes='tabPanes'
            :activeName='activeName'
            :tableDatas='tableDatas'
            :tableColumns='tableColumns'
            :paginations='paginations'
            @handlePaginationChange='handlePaginationChange'
            @updateActiveName='updateActiveName'>
          </tab-table-pagination-component>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import tabTablePaginationComponent from './componentsTool/common/tabTablePaginationComponent'
import { getTradeBranchChange } from '../../../service/analysisTool/complexQuery/index'
import {selfValidateMethod} from './componentsTool/common/validate'

export default {
  components: {
    Breadcrumb: () => import('../../common/Breadcrumb'),
    TextUpload: () => import('../../common/textUpload'),
    ExportBtn: () => import('./componentsTool/common/ExportButtonComponent'),
    AccountCode: () => import('./componentsTool/common/TextAreaCodesAndUploadComponent'),
    tabTablePaginationComponent,
    StatisticCaliber: () => import('./componentsTool/common/StatisticCaliber'),
    Caliber: () => import('./componentsTool/tradeBranchChange/Caliber')
  },
  data() {
    let paginations = []
    for (let i = 0; i < 3; i++) {
      paginations.push({
        currentPage: 1,
        pageSizeNumber: 10
      })
    }
    return {
      statisticCaliber: [
        {
          title: '交易营业部变更查询',
          rewrite: true
        }
      ],
      settingData: {
        rows: 7,
        isDisabled: false,
        placeholder: '请输入账户代码',
        list: [] // 存储上传账户代码list
      },
      queryData: { // 接口查询参数,保存上次查询参数
        acctIds: ''
      },
      formData: { // 页面中展示参数
        acctIds: ''
      },
      rules: {
        acctIds: [
          {required: true, message: '请输入账户代码', trigger: 'blur'}
        ]
      },
      loading: false,
      tableDatas: {},
      tableColumns: [
        [ // 账户交易
          {
            id: '2',
            label: '股东账户',
            field: 'acct_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_id')
          },
          {
            id: '3',
            label: '股东名称',
            field: 'acct_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_name')
          },
          {
            id: '6',
            label: '交易营业部变更日',
            field: 'trade_date',
            align: 'left',
            sortable: true
          },
          {
            id: '7',
            label: '自该变更日起账户交易营业部',
            field: 'mem_branch_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'mem_branch_name')
          },
          {
            id: '8',
            label: '自该变更日起账户交易PBU',
            field: 'pbu_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_id')
          },
          {
            id: '9',
            label: '账户最近交易日',
            field: 'latest_trade_date',
            align: 'left',
            sortable: true
          },
          {
            id: '10',
            label: '账户最近交易营业部',
            field: 'latest_mem_branch_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'latest_mem_branch_name')
          },
          {
            id: '101',
            label: '账户最近交易PBU',
            field: 'latest_pbu_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'latest_pbu_id')
          }
        ],
        [ // 历史交易
          {
            id: '222',
            label: '股东账户',
            field: 'acct_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_id')
          },
          {
            id: '223',
            label: '股东名称',
            field: 'acct_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_name')
          },
          {
            id: '2205',
            label: '营业部代码',
            field: 'pbu_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_id')
          },
          {
            id: '226',
            label: '营业部名称',
            field: 'mem_branch_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'mem_branch_name')
          },
          {
            id: '227',
            label: '最早交易日期',
            field: 'earliest_date',
            align: 'left',
            sortable: true
          },
          {
            id: '228',
            label: '最晚交易日期',
            field: 'lastest_date',
            align: 'left',
            sortable: true
          }
        ],
        [ // 账户指定交易
          {
            id: '422',
            label: '股东账户',
            field: 'acct_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_id')
          },
          {
            id: '4205',
            label: '指定交易变动日期',
            field: 'change_date',
            align: 'left',
            sortable: true
          },
          {
            id: '426',
            label: '变动类型',
            field: 'change_type',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'change_type')
          },
          {
            id: '427',
            label: '对应PBU',
            field: 'pbu_id',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_id')
          },
          {
            id: '428',
            label: '对应营业部',
            field: 'mem_branch_name',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'mem_branch_name')
          }
        ]
      ],
      currentngspUid: '', // 用来记录上一次返回的ngspUid
      tabPanes: [{label: '账户交易营业部变更情况'}, {label: '历史交易营业部情况'}, {label: '账户指定交易变动情况'}],
      activeName: '0',
      paginations: paginations,
      breadcrumbItems: [
        {
          router: '',
          label: '分析工具'
        }, {
          router: '',
          label: '数据综合查询'
        }, {
          router: '/tradeBranchChange',
          label: '交易营业部变更查询'
        }]
    }
  },
  methods: {
    getAccountListFunc(data) {
      this.formData.acctIds = data
    },
    updateActiveName(activeName) {
      this.activeName = activeName
    },
    handlePaginationChange(paginations) {
      this.paginations = paginations
      this.reqTableData(0)
    },
    clearForm() {
      this.$refs[`validateBranchAccount`].clearCodeList()
      this.formData = { // 查询参数
        acctIds: ''
      }
    },
    handleSearch() {
      this.$refs['tradeBranchChangeForm'].validate((valid) => {
        if (valid) {
          if (!selfValidateMethod({accounts: this.formData.acctIds})) { /* 批量校验证券代码格式 */
            return
          }
          this.queryData = JSON.parse(JSON.stringify(this.formData))
          this.activeName = '0'
          this.paginations.forEach(v => {
            v.currentPage = 1
          })
          this.reqTableData(1)
        }
      })
    },
    extendParams(params) {
      params.pageIndex = this.paginations.map(v => {
        return v.currentPage
      }).join(',')
      params.pageRows = this.paginations.map(v => {
        return v.pageSizeNumber
      }).join(',')
    },
    reqTableData(type) {
      let params = {
        acctIds: type ? this.formData.acctIds : this.queryData.acctIds, // 账户代码集合
        ngspUid: type ? '' : this.currentngspUid, // 后台上一次返回的ngspUid，如果是isNewQuery，置空
        isExport: 0, // 1代表导出报表
        exportType: '', // excel,csv
        isNewQuery: type // 判断是否是新查询,1是新查询，0是分页或导出
      }

      /* 处理pageIndex，pageRows */
      this.extendParams(params)
      this.loading = true

      getTradeBranchChange(params).then(resp => {
        this.loading = false
        if (resp) {
          resp.tab1.data.length > 0 || resp.tab2.data.length > 0 ||  resp.tab3.data.length > 0 ?  this.currentngspUid = resp.tab1.ngsp_uid : this.currentngspUid = ''
          this.tableDatas = resp
        } else {
          this.currentngspUid = ''
          this.tableDatas = []
        }
      })
    },
    handleExportData(type) { // 处理导出表格数据
      if (!this.currentngspUid) {
        this.$message.error('暂无数据')
        return
      }
      let params = {
        exportType: type,
        isExport: 1,
        isNewQuery: 0,
        ngspUid: this.currentngspUid,
        tableColumns: {
          tab1: this.tableColumns[0],
          tab2: this.tableColumns[1],
          tab3: this.tableColumns[2]
        }
      }
      if (type === 'csv') { // 只能导出当前tab下的csv文件
        params.tabIndex = 'tab' + (Number(this.activeName) + 1)
      }
      this.gfnExportFileWithForm('/complexqry/tradeBranchChange/v1/tradeBranchChange/export', params)
    }
  }
}
</script>

<style lang='less' scoped>
  .integrated-trade-branch-change {
  }

</style>
