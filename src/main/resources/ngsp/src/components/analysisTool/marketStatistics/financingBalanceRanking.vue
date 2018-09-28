<template>
    <div class='financing-balance-ranking'>
        <el-card>
            <div slot="header">
                查询条件
                <el-button
                        type="primary"
                        size="small"
                        @click="submitForm('searchData')">
                    查询
                </el-button>
                <el-button
                        v-if="selfFinancRankData.data.length!==0||brokerageFinancRankData.data.length!==0"
                        type="info"
                        size="small"
                        @click="saveFile">导出
                </el-button>
            </div>
            <el-form :inline="true" label-width="120px" style="margin-top: 20px;" :model="searchData"
                     :rules="searchDataRules" ref="searchData">
                <el-col :xl="8" :md="12" :sm="24">
                    <el-form-item label="参与者层级：" required>
                        <el-select
                                size="small"
                                v-model="searchData.participantLevel">
                            <el-option
                                    v-for="item in participantLevelOptions"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xl="8" :md="12" :sm="24">
                    <el-form-item label="产品代码：" required>
                        <select-all-multiple
                                ref="selectAllMultiple"
                                :selectStockCodeOptions="productCodeOptions"
                                @getSelectRes="getProductCodeVal"
                                :selectAll="true"/>
                    </el-form-item>
                </el-col>
                <el-col :xl="6" :md="12" :sm="24">
                    <el-form-item label="前N名：" required prop="topNNum">
                        <el-input size="small" v-model="searchData.topNNum" style="width: 100px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>

        </el-card>
        <div v-if="showQueryRes">
            <s-table
                    :isHeader="true"
                    :headerTitle="'自营类投资者融资回购余额排序表'"
                    :columns="financRankOptions"
                    :data="selfFinancRankData"
                    :isPageination="selfFinancRankData.data.length!==0"
                    :pageinationPos="'left'"
                    :loading="selfLoading"
                    @getPageination="handleChangeSelfCurrentPage">
            </s-table>
            <s-table
                    :isHeader="true"
                    :headerTitle="'经纪类投资者融资回购余额排序表'"
                    :columns="financRankOptions"
                    :data="brokerageFinancRankData"
                    :isPageination="brokerageFinancRankData.data.length!==0"
                    :pageinationPos="'left'"
                    :loading="brokerageLoading"
                    @getPageination="handleChangeBrokerageCurrentPage">
            </s-table>
        </div>
    </div>
</template>

<script>
  import { getProductCode, getFinancBalanceRankData } from '../../../service/analysisTool/marketStatistics'
  import { transactionSelect } from '../../../service/analysisTool/productQuery'
  import SelectAllMultiple from '../../common/SelectAllMultiple'
  import STable from '../../base/STable'

  export default {
    name: 'financing-balance-ranking',
    props: [],
    components: {SelectAllMultiple, STable},
    mixins: [],
    data () {
      let checkNumber = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
          return
        }
        if (Number(value) < 0 || Number(value) % 1 !== 0) {
          callback(new Error('必须是正整数'))
          return
        }
        if (Number(value) > 1000) {
          callback(new Error('最大值为1000'))
          return
        }
        callback()
      }
      let numberRules = {
        validator: checkNumber
      }
      return {
        searchData: {
          participantLevel: 'account',
          productCode: '',
          topNNum: '20',
        },
        searchDataRules: {
          topNNum: [numberRules, {trigger: 'blur'}]
        },
        participantLevelOptions: [],
        productCodeArr: [],
        productCodeOptions: [],
        showQueryRes: false,
        accountTableOption: [
          {field: 'id', label: '账户代码', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'id')},
          {field: 'name', label: '账户名称', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'name')},
          {field: 'pbu_id', label: 'PBU代码', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_id')},
          {field: 'branch_name', label: '营业部名称', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')},
          {field: 'jrye', label: '今日余额（亿元）', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jrye'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {field: 'srye', label: '上日余额（亿元）', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'srye'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {field: 'zj', label: '增减(%)', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'zj'), formatter: this.gfnElColFormatDec3, format: '0.000'},
          {field: 'syl', label: '标准券使用率(%)', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'syl'), formatter: this.gfnElColFormatDec3, format: '0.000'}
        ],
        otherTypeTableOption: [
          {field: 'id', label: '账户代码', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'id')},
          {field: 'name', label: '账户名称', width: '120', align: 'left', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'name')},
          {field: 'jrye', label: '今日余额（亿元）', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'jrye'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {field: 'srye', label: '上日余额（亿元）', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'srye'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {field: 'zj', label: '增减(%)', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'zj'), formatter: this.gfnElColFormatDec3, format: '0.000'},
          {field: 'syl', label: '标准券使用率(%)', width: '120', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'syl'), formatter: this.gfnElColFormatDec3, format: '0.000'}
        ],
        financRankOptions: [],
        // 自营类投资者融资回购余额排序表
        selfFinancRankData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        selfLoading: false,
        // 经纪类投资者融资回购余额排序表
        brokerageFinancRankData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        brokerageLoading: false,
        requestParams: {},
      }
    },
    computed: {},
    watch: {},
    methods: {
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
          actorType: this.searchData.participantLevel,
          productCode: this.searchData.productCode,
          type: '',
          rank: this.searchData.topNNum,
          pageIndex: 1,
          pageRows: 10
        }
        this.handleQueryData()
      },
      handleQueryData (page, size, type) {
        this.showQueryRes = true
        this.selfLoading = true
        this.brokerageLoading = true
        if (page && size && type) {
          this.requestParams.type = type
          this.requestParams.pageIndex = page
          this.requestParams.pageRows = size
          switch (type) {
            case 'zy':
              this.brokerageLoading = false
              break
            case 'jj':
              this.selfLoading = false
              break
          }
        }
        getFinancBalanceRankData(this.requestParams).then(resp => {
          this.changeTableOption(this.requestParams.actorType)
          if(resp.selfSupport){
            this.selfFinancRankData.data = resp.selfSupport.bizData.metaData
            this.selfFinancRankData.total = resp.selfSupport.bizData.totalRows - 0
          }
          if(resp.manager){
            this.brokerageFinancRankData.data = resp.manager.bizData.metaData
            this.brokerageFinancRankData.total = resp.manager.bizData.totalRows - 0
          }
          this.selfLoading = false
          this.brokerageLoading = false
        })
      },
      changeTableOption (val) {
        let params = [...this.otherTypeTableOption]
        switch (val) {
          case 'account' :
            this.financRankOptions = this.accountTableOption
            break
          case 'member':
            params[0].label = '券商代码'
            params[1].label = '券商名称'
            this.financRankOptions = params
            break
          case 'pbu':
            params[0].label = 'PBU代码'
            params[1].label = 'PBU名称'
            this.financRankOptions = params
            break
          case 'salePart':
            params[0].label = '营业部代码'
            params[1].label = '营业部名称'
            this.financRankOptions = params
            break
        }
      },
      getProductCodeVal (val) {
        this.searchData.productCode = val.join(',')
      },
      saveFile () {
        let newParams = {
          fileMark: 'excel',
          tableColumns: [
            {
              sheetName: '自营类投资者融资回购余额排序表', fileColumns: this.financRankOptions
            },
            {
              sheetName: '经纪类投资者融资回购余额排序表', fileColumns: this.financRankOptions
            }
          ]
        }
        let params = {...this.requestParams, ...newParams}
        params.type = 'financeSort'
        delete params.pageIndex
        delete params.pageRows
        console.log(params)
        this.gfnExportFileWithForm('/regularqry/marketstatis/v1/export', params)
      },
      // 自营类投资者融资回购余额排序表
      handleChangeSelfCurrentPage (page) {
        this.handleQueryData(page.currentPage, page.pageSizeNumber, 'zy')
      },
      // 经纪类投资者融资回购余额排序表
      handleChangeBrokerageCurrentPage (page) {
        this.handleQueryData(page.currentPage, page.pageSizeNumber, 'jj')
      }
    },
    created () {
      // 获取产品类型并全选
      getProductCode().then(resp => {
        this.productCodeOptions = resp.bizData.metaData.map(item => {
          this.productCodeArr.push(item.instrument_id)
          return {value: item.instrument_id, label: item.instrument_id}
        })
        this.searchData.productCode = this.productCodeArr.join(',')
      }).then(() => {
        this.$refs.selectAllMultiple.setSelectAll()
      })
      // 获取参与者层级
      transactionSelect('particiLevel', 'detail').then((resp) => {
        this.participantLevelOptions = resp
      })
    },
    mounted () {
    },
    beforeDestory () {

    }
  }
</script>

<style lang='less' scoped>
    .financing-balance-ranking {

    }
</style>