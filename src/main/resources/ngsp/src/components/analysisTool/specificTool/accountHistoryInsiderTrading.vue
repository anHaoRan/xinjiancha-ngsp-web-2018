<template>
  <div class="insiderBox">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card style="width:100%">
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="200px">
        <el-form-item label="起止日期：" prop="date" class="inlineBlock">
          <el-date-picker v-model="ruleForm.date" type="daterange" range-separator="至" start-placeholder="起始日期"
                          end-placeholder="终止日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="账户代码：" prop="accountList" class="inlineBlock">
          <excel-upload class="uploadBtn" :uploadParams=" uploadParams1 " @fileData="setFileData1"></excel-upload>
          <el-tag :type="uploadStatus1"> {{ uploadText1 }}</el-tag>
        </el-form-item>
        <!--账户代码-上传显示-->
        <el-form-item label="已上传账户代码：" v-if="ruleForm.accountList.length > 0">
          <el-row style="overflow-y: auto; max-height: 120px;">
            <el-tag style="margin:0 10px 10px 10px;"
                    v-for="item in ruleForm.accountList" :key="item.acct_id"
                    @close="handleTagClose(item)"
                    closable>{{item.acct_id}}
            </el-tag>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-dropdown @command="handleDownload">
          <el-button type="primary" size="mini" :disabled=" pageTotal == 0 ">
            导出<i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="xlsx">
              导出为EXCEL
            </el-dropdown-item>
            <!--<el-dropdown-item command="csv">
              导出为CSV
            </el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-tabs v-model="activeName" @tab-click="changeTable">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.key"
          :label="item.label"
          :name="item.name">
          <el-table
            v-loading="loading"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中，请耐心等待..."
            element-loading-background="rgba(0,0,0,0.6)"
            :data="tableData"
            tooltip-effect="dark"
            height="440"
            size="small"
            highlight-current-row
            border
            style="width: 100%;">
            <el-table-column
              v-for="column in theadList"
              :show-overflow-tooltip="true"
              :key="column.field"
              :label="column.label"
              :prop="column.field"
              :width="column.width"
              :min-width="column.minWidth"
              :align="column.align == null ? 'center' : column.align"
              :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
              :sortable="column.sortable == null ? false : column.sortable"
              :sort-method="column.sortMethod">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <pageination :pageTotal="pageTotal" @getPageination="getPageination"></pageination>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
  import {getRelativeTradeDate} from '../../../service/common/commonFunc'
  import moment from 'moment'
  import Breadcrumb from '../../../components/common/Breadcrumb'
  import ExcelUpload from '../../common/ExcelUpload'
  import Pageination from '../../common/pageination'

  export default {
    components: {
      Breadcrumb,
      ExcelUpload,
      Pageination
    },
    data() {
      return {
        breadcrumbItems: [ // 面包屑
          {
            router: '',
            label: '分析工具'
          }, {
            router: '',
            label: '特定工具'
          }, {
            router: '/accountHistoryInsiderTrading',
            label: '账户历史内幕交易'
          }],
        typeOptions: [ // 内幕交易类型下拉框
          {
            value: '获利型',
            label: '获利型'
          }, {
            value: '避损型',
            label: '避损型'
          }],
        ruleForm: { // 查询条件表单
          date: '',
          accountList: []
        },
        rules: { // 查询条件表单验证
          date: [
            {required: true, message: '请选择起始日期和终止日期', trigger: 'change'}
          ],
          accountList: [
            {required: true, message: '请上传账户代码', trigger: 'change'}
          ]
        },
        uploadText1: '未上传',
        uploadStatus1: 'danger',
        uploadParams1: {
          loading: false,
          label: '上传Excel',
          type: 'primary',
          params: [
            {
              firstToSkip: 1, // 前置忽略项
              lastToAbandon: 0, // 后置忽略项
              fields: ['acct_id'] // 读取文件数据并以此格式返回数据
            }
          ]
        },
        activeName: 'infoTab',
        isQuery: false,
        loading: false,
        pageTotal: 0,
        tableData: [],
        tabList: [ // tab
          {label: '重大事项信息表', name: 'infoTab'},
          {label: '整体交易指标表', name: 'targetTab'},
          {label: '对应股票内幕交易评分表', name: 'scoreTab'}
        ],
        theadList: [], // 默认-列设置
        buyList: [ // 重大事项信息表-列设置
          {label: '账户代码', field: 'account_id', align: 'left', minWidth: '100', sortable: true},
          {label: '账户名称', field: 'investor_account_name', align: 'left', minWidth: '100'},
          {label: '证券代码', field: 'instrument_id', align: 'left', minWidth: '100', sortable: true},
          {label: '证券简称', field: 'instrument_chn_short_name', align: 'left', minWidth: '100'},
          {label: '买入金额（元）', field: 'trdamt_b', align: 'right', minWidth: '100'},
          {label: '卖出金额（元）', field: 'trdamt_s', align: 'right', minWidth: '100'},
          {label: '净额（元）', field: 'trdamt', align: 'right', minWidth: '100'}
        ],
        sellList: [ // 整体交易指标表-列设置
          {label: '会员名称', field: 'member_name', align: 'left', minWidth: '100', sortable: true},
          {label: '买入金额（元）', field: 'mktval_b', align: 'right', minWidth: '100'},
          {label: '卖出金额（元）', field: 'mktval_s', align: 'right', minWidth: '100'},
          {label: '净额（元）', field: 'mktval', align: 'right', minWidth: '100'}
        ],
        matchResultList: [ // 对应股票内幕交易评分表-列设置
          {label: '证券代码', field: 'instrument_id', align: 'left', minWidth: '100', sortable: true},
          {label: '证券简称', field: 'instrument_chn_short_name', align: 'left', minWidth: '100'},
          {label: '买入金额（元）', field: 'trdamt_b', align: 'right', minWidth: '100'},
          {label: '卖出金额（元）', field: 'trdamt_s', align: 'right', minWidth: '100'}
        ]
      }
    },
    watch: {
      'ruleForm.accountList': function () { // 监听上传代码是否为空
        if (this.ruleForm.accountList.length == 0) {
          this.uploadText1 = '未上传'
          this.uploadStatus1 = 'danger'
        }
      }
    },
    methods: {
      submitForm(formName) { // 表单验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleQueryData()
          } else {
            this.$message.error('查询失败！请补全查询参数~')
          }
        })
      },
      resetForm(formName) { // 清空
        this.$refs[formName].resetFields()
        this.uploadText1 = '未上传'
        this.uploadStatus1 = 'danger'
        this.isQuery = false
        this.loading = false
        this.tableData = []
        this.pageTotal = 0
        this.activeName = 'infoTab'
        this.getDate() // 初始化日期-T-1日
      },
      handleQueryData() { // 查询
        let accounts = this.accountChange(this.ruleForm.accountList)
        console.log('accounts:', accounts)
        // 模拟查询
        this.pageTotal = 100
        this.tableData = [{
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }, {
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }, {
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }, {
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }, {
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }, {
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }, {
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }, {
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }, {
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }, {
          test1: 'xxxxxx',
          test2: 'xxxxxx',
          test3: 'xxxxxx'
        }]
      },
      setFileData1(val) { // 上传解析1
        this.ruleForm.accountList = val.Sheet0
        this.uploadText1 = '已上传'
        this.uploadStatus1 = 'success'
      },
      getPageination(pageinationVal) { // 分页
        console.log('pageinationVal:', pageinationVal)
      },
      handleDownload(command) { // 导出
        this.$message.info('正在导出表格数据，请稍等~')
        // let downloadParams = {
        //   'tableColumns': [
        //     {
        //       'sheetName': '公司重大事项-未保存数据',
        //       'fileColumns': this.tableColumns
        //     }
        //   ],
        //   'fileType': command ,
        //   'resSave': 0 ,
        //   'resNotSave': 1 ,
        // }
        // this.gfnExportFileWithForm('/alarm/majorevnt/v1/major-events-export', downloadParams)
      },
      changeTable(tab) { // 切换Tab
        switch (tab.name) {
          case 'infoTab':
            this.theadList = this.buyList
            // this.isAccountTable = true
            // this.tableData = this.accountData
            break
          case 'targetTab':
            this.theadList = this.sellList
            // this.isAccountTable = false
            // this.tableData = this.memberData
            break
          case 'scoreTab':
            this.theadList = this.matchResultList
            // this.isAccountTable = false
            // this.tableData = this.bondData
            break
        }
      },
      handleTagClose(val) { // 删除上传账户代码
        this.ruleForm.accountList.splice(this.ruleForm.accountList.indexOf(val), 1)
      },
      accountChange(arr) { // 上传代码参数改变格式
        let acclist = ''
        for (let item of arr) {
          acclist += item.acct_id + ','
        }
        acclist = acclist.substr(0, acclist.length - 1)
        return acclist
      },
      getDate() {
        getRelativeTradeDate(-1).then(resp => {
          this.ruleForm.date = [moment(resp).format('YYYY-MM-DD'), moment(resp).format('YYYY-MM-DD')]
        })
      }
    },
    mounted() {
      this.theadList = this.buyList // 初始化表格列设置-买入明细表-列设置
      this.getDate() // 初始化日期-T-1日
    }
  }
</script>

<style lang="less" scoped>
  .inlineBlock {
    display: inline-block;
  }

  .uploadBtn {
    display: inline-block;
    margin: 0 10px 0 10px;
  }

  .insiderBox {
    .el-form {
      margin-top: 20px;
    }
  }
</style>
