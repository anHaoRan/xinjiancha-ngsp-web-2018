<template>
    <div class='pledge-repurchase'>
        <el-card>
            <div slot="header">
                查询条件
                <el-button
                        type="primary"
                        size="small"
                        @click="submitForm('searchForm')">
                    查询
                </el-button>
                <el-button
                        v-if="couponUsageHighData.data.length!==0||repurchaseMagnificaData.data.length!==0"
                        type="info"
                        size="small"
                        @click="saveFile">导出
                </el-button>
            </div>
            <el-form :inline="true"
                     style="margin-top: 20px;"
                     label-width="220px"
                     :model="searchForm"
                     :rules="searchFormRules"
                     ref="searchForm">
                <el-col :xl="8" :md="12" :sm="24">
                    <el-form-item
                            required
                            label="标准券使用率(%) >="
                            prop="couponUsage">
                        <el-input style="width: 100px"
                                  size="small"
                                  @change="couponUsageFormat"
                                  v-model="searchForm.couponUsage"/>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :md="12" :sm="24">
                    <el-form-item
                            required
                            label="回购放大倍数 >="
                            prop="repuchaseMagnific">
                        <el-input style="width: 100px"
                                  size="small"
                                  @change="repuchaseMagnificFormat"
                                  v-model="searchForm.repuchaseMagnific"/>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :md="12" :sm="24">
                    <el-form-item
                            required
                            prop="todayBalance"
                            label="今日融资回购未到期余额(手) >=">
                        <el-input style="width: 100px"
                                  size="small"
                                  v-model="searchForm.todayBalance"/>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :md="12" :sm="24">
                    <el-form-item
                            required
                            label="前N名："
                            prop="topNNum">
                        <el-input size="small"
                                  v-model="searchForm.topNNum"
                                  style="width: 100px;"/>
                    </el-form-item>
                </el-col>
                <el-col :xl="6" :md="12" :sm="24" :offset="1">
                    <el-form-item label="" style="margin-left: 30px;">
                        <el-checkbox size="small" v-model="refresh" style="width: 100px;" @change="autoRefresh">
                            20秒自动刷新
                        </el-checkbox>
                    </el-form-item>
                </el-col>
            </el-form>

        </el-card>
        <div v-if="showQueryRes">
            <s-table
                    :isHeader="true"
                    :headerTitle="'标准券使用率过高账户统计'"
                    :columns="couponUsageHighOptions"
                    :data="couponUsageHighData"
                    :isPageination="couponUsageHighData.data.length!==0"
                    :pageinationPos="'left'"
                    :loading="couponLoading"
                    @getPageination="handleChangeSelfCurrentPage">
            </s-table>
            <s-table
                    :isHeader="true"
                    :headerTitle="'经纪类账户回购放大倍数过高账户统计表'"
                    :columns="repurchaseMagnificaOptions"
                    :data="repurchaseMagnificaData"
                    :isPageination="repurchaseMagnificaData.data.length!==0"
                    :pageinationPos="'left'"
                    :loading="repurchaseLoading"
                    @getPageination="handleChangeBrokerageCurrentPage">
            </s-table>
        </div>
    </div>
</template>

<script>
  import { getPledgeRepurchaseData } from '../../../service/analysisTool/marketStatistics'
  import STable from '../../base/STable'
  import Mixin from './Mixin'

  export default {
    name: 'pledge-repurchase',
    props: [],
    components: {STable},
    mixins: [Mixin],
    data () {
      let couponUsageCheck = {
        validator: this.validateNum(0, 100, false, true)
      },
      repuchaseMagnificCheck = {
        validator: this.validateNum(0, 100, false, true)
      },
      todayBalanceCheck = {
        validator: this.validateNum(0, '', true, true)
      },
      topNNumCheck = {
        validator: this.validateNum(0, 1000, true, true)
      }
      return {
        searchForm: {
          couponUsage: '90.000',
          repuchaseMagnific: '5.000',
          todayBalance: '1',
          topNNum: '20',
        },
        searchFormRules: {
          couponUsage: [couponUsageCheck, {trigger: 'blur'}],
          repuchaseMagnific: [repuchaseMagnificCheck, {trigger: 'blur'}],
          todayBalance: [todayBalanceCheck, {trigger: 'blur'}],
          topNNum: [topNNumCheck, {trigger: 'blur'}]
        },
        refresh: false,
        showQueryRes: false,
        // 自营类投资者融资回购余额排序表
        couponUsageHighData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        couponUsageHighOptions: [
          {field: 'acct_id', label: '投资者代码', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'acct_id')},
          {field: 'investor_account_name', label: '投资者名称', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'investor_account_name')},
          {field: 'pbu_id', label: 'PBU代码', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_id')},
          {field: 'branch_name', label: '营业部名称', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')},
          {field: 'syl', label: '标准券使用率(%)', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'syl'), formatter: this.gfnElColFormatDec3, format: '0.000'},
          {field: 'syl_pre', label: '上日使用率(%)', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'syl_pre'), formatter: this.gfnElColFormatDec3, format: '0.000'},
          {field: 'ye', label: '今日融资回购未到期余额(亿元)', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ye'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
        ],
        couponLoading: false,
        // 经纪类投资者融资回购余额排序表
        repurchaseMagnificaData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        repurchaseMagnificaOptions: [
          {field: 'acct_id', label: '投资者代码', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'acct_id')},
          {field: 'investor_account_name', label: '投资者名称', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'investor_account_name')},
          {field: 'pbu_id', label: 'PBU代码', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_id')},
          {field: 'branch_name', label: '营业部名称', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')},
          {field: 'fd', label: '融资回购放大倍数', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'fd'), formatter: this.gfnElColFormatDec3, format: '0.000'},
          {field: 'fd_pre', label: '上日放大倍数', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'fd_pre'), formatter: this.gfnElColFormatDec3, format: '0.000'},
          {field: 'ye', label: '今日融资回购未到期余额(亿元)', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'ye'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'}
        ],
        repurchaseLoading: false,
        requestParams: {},
        refreshTime: null
      }
    },
    computed: {},
    watch: {},
    methods: {
      couponUsageFormat (val) {
        if (!isNaN(val)) {
          this.searchForm.couponUsage = this.gfnFormatDecimal(val, 3)
        }
      },
      repuchaseMagnificFormat (val) {
        if (!isNaN(val)) {
          this.searchForm.repuchaseMagnific = this.gfnFormatDecimal(val, 3)
        }
      },
      autoRefresh (val) {
        clearInterval(this.refreshTime)
        if (val) {
          this.refreshTime = setInterval(this.fnGetQueryRes, 20000)
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.fnGetQueryRes()
          } else {
            this.$message.warning('查询失败！请输入正确参数~')
          }
        })
      },
      fnGetQueryRes () {
        this.requestParams = {
          bzqUseRate: this.searchForm.couponUsage,
          hgBlowUp: this.searchForm.repuchaseMagnific,
          buyBackMoney: this.searchForm.todayBalance,
          rank: this.searchForm.topNNum,
          type: '',
          pageIndex: 1,
          pageRows: 10
        }
        this.handleQueryData()
      },
      handleQueryData (page, size, type) {
        this.showQueryRes = true
        this.couponLoading = true
        this.repurchaseLoading = true
        let params = {...this.requestParams}
        if (page && size && type) {
          params.type = type
          params.pageIndex = page
          params.pageRows = size
          switch (type) {
            case 'ss':
              this.repurchaseLoading = false
              break
            case 'mt':
              this.couponLoading = false
              break
          }
        }
        getPledgeRepurchaseData(params).then(resp => {
          if(resp.standardSecurity){
            this.couponUsageHighData.data = resp.standardSecurity.bizData.metaData
            this.couponUsageHighData.total = resp.standardSecurity.bizData.totalRows - 0
          }
          if(resp.MagnificateTimes){
            this.repurchaseMagnificaData.data = resp.MagnificateTimes.bizData.metaData
            this.repurchaseMagnificaData.total = resp.MagnificateTimes.bizData.totalRows - 0
          }
          this.couponLoading = false
          this.repurchaseLoading = false
        })
      },
      saveFile () {
        let newParams = {
          fileMark: 'excel',
          tableColumns: [
            {
              sheetName: '标准券使用率过高账户统计', fileColumns: this.couponUsageHighOptions
            },
            {
              sheetName: '经纪类账户回购放大倍数过高账户统计表', fileColumns: this.repurchaseMagnificaOptions
            }
          ]
        }
        let params = {...this.requestParams, ...newParams}
        params.type = 'pledgeStyle'
        delete params.pageIndex
        delete params.pageRows
        this.gfnExportFileWithForm('/regularqry/marketstatis/v1/export', params)
      },
      // 标准券使用率过高账户统计
      handleChangeSelfCurrentPage (page) {
        this.handleQueryData(page.currentPage, page.pageSizeNumber, 'ss')
      },
      // 经纪类账户回购放大倍数过高账户统计表
      handleChangeBrokerageCurrentPage (page) {
        this.handleQueryData(page.currentPage, page.pageSizeNumber, 'mt')
      }
    },
    created () {

    },
    mounted () {

    },
    beforeDestory () {
      if (this.refreshTime != null) {
        clearInterval(this.refreshTime)
      }
    }
  }
</script>

<style lang='less' scoped>
    .pledge-repurchase {

    }
</style>