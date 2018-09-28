<template>
  <div class="more-stock-with-column">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <div slot="header">
        查询条件
        <el-button
            type="primary"
            size="small"
            :disabled="veryfySuccess"
            @click="fnGetQueryRes">
          查询
        </el-button>
        <el-button
            type="primary"
            size="small"
            @click="dialogFormVisble=true">
          双人双密
        </el-button>
      </div>
      <double-per-dou-psw @isPass="getPassInfo" @isShow="getShowDilog"
                          :dialogFormVisble="dialogFormVisble"></double-per-dou-psw>
      <el-form :inline="true" :model="searchForm" ref="searchForm" :rules="rules" label-width="100px">

        <el-form-item label="分类：">
          <el-select
              size="small"
              v-model="searchForm.stockType">
            <el-option
                v-for="item in stockTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户组：" prop="accountGroup">
          <el-input size="small" v-model="searchForm.accountGroup" class="el-form-input"></el-input>
          <text-upload @getTxtCon="fnGetAccountGroupUploadCon" style="display: inline-block;"></text-upload>
        </el-form-item>

        <el-form-item label="产品类型：">
          <el-select
              size="small"
              v-model="searchForm.productType">
            <el-option
                v-for="item in productTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="searchForm.productType=='0'">
          <select-lazy-multiple :selectParams="selectParams" @getSelectRes="getSelectRes"
                                style="display: inline-block;" ref="selectLazyMultiple">
          </select-lazy-multiple>
          <text-upload @getTxtCon="fnGetStockTypeUploadCon" style="display: inline-block;"></text-upload>
        </el-form-item>

        <el-form-item label="明细条数：" prop="detailNum">
          <el-input size="small" v-model="searchForm.detailNum" style="width:100px"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="el-card-table" v-if="isShowQueryRes">
      <div slot="header">
        查询结果
        <el-dropdown @command='handleExportData' style='float: right;' v-if="tableData.length!==0">
          <el-button type='primary' size='small'>
            导出 <i class='el-icon-arrow-down el-icon-right'></i>
          </el-button>
          <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item command='excel'><i class='el-icon-document'></i>导出为EXCEL</el-dropdown-item>
            <el-dropdown-item command='csv'><i class='el-icon-tickets'></i>导出为CSV</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table
          :data="tableData"
          ref="industryBlock"
          border
          tooltip-effect="dark"
          size="small"
          highlight-current-row
          style="width: 100%"
          v-loading="queryResLoad"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
            v-for="column in tableOptions"
            :show-overflow-tooltip="true"
            :key="column.field"
            :label="column.label"
            :prop="column.field"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align == null ? 'center' : column.align"
            :formatter="column.formatter">
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  import breadcrumb from '../../components/common/Breadcrumb'
  import TextUpload from '../common/textUpload'
  import { getQureryRes, getProductTypeOptions } from '../../service/analysisTool/moreStockWithColumn'
  import SelectLazyMultiple from '../common/SelectLazyMultiple'
  import DoublePerDouPsw from '../common/DoublePerDouPsw'

  export default {
    name: 'more-stock-with-column',
    components: {breadcrumb, TextUpload, SelectLazyMultiple, DoublePerDouPsw},
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
        if (this.searchForm.productType === 'ALL' || this.searchForm.productType === '0') {
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
        // 面包屑
        breadcrumbItems: [
          {
            router: '/moreStockWithColumn',
            label: '分析工具'
          }, {
            router: '/moreStockWithColumn',
            label: '常规查询'
          }, {
            router: '/moreStockWithColumn',
            label: '多股同列'
          }
        ],
        // 双人双密弹出框
        dialogFormVisble: false,
        // 查询按钮disabled
        veryfySuccess: true,
        // veryfySuccess: false,
        // 分类
        stockTypeOptions: [
          {
            value: 'account',
            label: '账户'
          },
          {
            value: 'pbu',
            label: 'PBU'
          },
          {
            value: 'salePart',
            label: '营业部'
          },
          {
            value: 'member',
            label: '券商'
          }
        ],
        searchForm: {
          stockType: 'account',
          // 账户组
          accountGroup: '',
          // 产品类型
          productType: 'ALL',
          // 明细条数
          detailNum: '5',
        },
        rules: {
          accountGroup: [{
            type: 'string',
            pattern: /^[A-Z]\d{9}(?:,[A-Z]\d{9})*$/,
            message: '请输入正确账户组',
            trigger: 'blur',
            required: true
          }],
          detailNum: [numberRules, {required: true, message: '请输入明细条数', trigger: 'blur'}]
        },
        productTypeOptions: [],
        productTypeStockCode: [],
        // 产品类型代码
        selectParams: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        requestParams: {},
        // 查询结果
        // 显示查询结果表格
        isShowQueryRes: false,
        // 表格数据
        tableData: [],
        // 表格配置
        tableOptions: [],
        queryResLoad: false,
        accountTable: [
          {field: 'stk_code', label: '证券代码', width: '', minWidth: '', align: 'left'},
          {field: 'stk_tit', label: '证券简称', width: '', minWidth: '', align: 'left'},
          {
            field: 'acc_qty',
            label: '成交量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'acc_price',
            label: '成交金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {field: 'by_acct_code', label: '买入账号代码', width: '', minWidth: '', align: 'left'},
          {field: 'by_acct_name', label: '买入账号名称', width: '', minWidth: '', align: 'left'},
          {field: 'by_pub', label: '买入PBU代码', width: '', minWidth: '', align: 'left'},
          {field: 'by_pt_title', label: '买入营业部名称', width: '', minWidth: '', align: 'left'},
          {
            field: 'by_qty',
            label: '买入数量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'by_price',
            label: '买入金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'by_vp',
            label: '均价',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {field: 'sl_acct_code', label: '卖出账号代码', width: '', minWidth: '', align: 'left'},
          {field: 'sl_acct_name', label: '卖出账号名称', width: '', minWidth: '', align: 'left'},
          {field: 'sl_pub', label: '卖出PBU代码', width: '', minWidth: '', align: 'left'},
          {field: 'sl_pt_title', label: '卖出营业部名称', width: '', minWidth: '', align: 'left'},
          {
            field: 'sl_qty',
            label: '卖出数量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'sl_price',
            label: '卖出金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'sl_vp',
            label: '均价',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          }
        ],
        pbuTable: [
          {field: 'stk_code', label: '证券代码', width: '', minWidth: '', align: 'left'},
          {field: 'stk_tit', label: '证券简称', width: '', minWidth: '', align: 'left'},
          {
            field: 'acc_qty',
            label: '成交量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'acc_price',
            label: '成交金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {field: 'by_pub', label: '买入PBU代码', width: '', minWidth: '', align: 'left'},
          {field: 'by_pt_title', label: '买入营业部名称', width: '', minWidth: '', align: 'left'},
          {
            field: 'by_qty',
            label: '买入数量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'by_price',
            label: '买入金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'by_vp',
            label: '均价',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {field: 'sl_pub', label: '卖出PBU代码', width: '', minWidth: '', align: 'left'},
          {field: 'sl_pt_title', label: '卖出营业部名称', width: '', minWidth: '', align: 'left'},
          {
            field: 'sl_qty',
            label: '卖出数量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'sl_price',
            label: '卖出金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'sl_vp',
            label: '均价',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          }
        ],
        salePartTable: [
          {field: 'stk_code', label: '证券代码', width: '', minWidth: '', align: 'left'},
          {field: 'stk_tit', label: '证券简称', width: '', minWidth: '', align: 'left'},
          {
            field: 'acc_qty',
            label: '成交量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'acc_price',
            label: '成交金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {field: 'by_pt', label: '买入营业部代码', width: '', minWidth: '', align: 'left'},
          {field: 'by_pt_title', label: '买入营业部名称', width: '', minWidth: '', align: 'left'},
          {
            field: 'by_qty',
            label: '买入数量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'by_price',
            label: '买入金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'by_vp',
            label: '均价',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {field: 'sl_pt', label: '卖出营业部代码', width: '', minWidth: '', align: 'left'},
          {field: 'sl_pt_title', label: '卖出营业部名称', width: '', minWidth: '', align: 'left'},
          {
            field: 'sl_qty',
            label: '卖出数量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'sl_price',
            label: '卖出金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'sl_vp',
            label: '均价',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          }
        ],
        memberTable: [
          {field: 'stk_code', label: '证券代码', width: '', minWidth: '', align: 'left'},
          {field: 'stk_tit', label: '证券简称', width: '', minWidth: '', align: 'left'},
          {
            field: 'acc_qty',
            label: '成交量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'acc_price',
            label: '成交金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {field: 'by_member', label: '买入券商', width: '', minWidth: '', align: 'left'},
          {field: 'by_member_tit', label: '券商名称', width: '', minWidth: '', align: 'left'},
          {
            field: 'by_qty',
            label: '买入数量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'by_price',
            label: '买入金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'by_vp',
            label: '均价',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {field: 'sl_member', label: '卖出券商', width: '', minWidth: '', align: 'left'},
          {field: 'sl_member_tit', label: '券商部名称', width: '', minWidth: '', align: 'left'},
          {
            field: 'sl_qty',
            label: '卖出数量(万股)',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'sl_price',
            label: '卖出金额（万元）',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          },
          {
            field: 'sl_vp',
            label: '均价',
            width: '',
            minWidth: '',
            align: 'right',
            formatter: this.fnFormatDecThou3
          }
        ]
      }
    },
    mounted () {
      getProductTypeOptions('productType', 'stockWithCol').then(resp => {
        this.productTypeOptions = resp.map(function (item) {
          return {value: item.value, label: item.text}
        })
        let All = {
          value: 'ALL',
          label: '全部'
        }
        this.productTypeOptions.unshift(All)
      })
    },
    methods: {

      // 产品类型为证券代码时下拉val获取
      getSelectRes (val) {
        this.productTypeStockCode = val
      },

      // 双人双密验证成功与否
      getPassInfo (val) {
        if (val) {
          this.veryfySuccess = false
        } else {
          this.veryfySuccess = true
        }
      },
      getShowDilog (val) {
        this.dialogFormVisble = val
      },
      // 获取查询结果
      fnGetQueryRes () {
        if (this.searchForm.productType === 'ALL' && this.searchForm.accountGroup === '') {
          this.$message.error('账户组不能为空')
          return
        }
        // 证券代码为空验证
        if (this.searchForm.productType == '0' && this.productTypeStockCode == '') {
          this.$message.error('证券代码不能为空')
          return
        }
        // 明细条数为空验证
        if (!this.searchForm.detailNum) {
          this.$message.error('明细条数不能为空')
          return
        } else {
          if (this.searchForm.productType == 'ALL' || this.searchForm.productType == '0') {
            if (!this.gfnIntNum(this.searchForm.detailNum, 10000)) {
              this.$message.error(`明细条数值不能大于10000`)
              return
            }
          } else {
            if (!this.gfnIntNum(this.searchForm.detailNum, 1000)) {
              this.$message.error(`明细条数值不能大于1000`)
              return
            }
          }
        }
        let params = {
          acctType: this.searchForm.stockType,
          accountArr: this.searchForm.accountGroup,
          procType: this.searchForm.productType,
          isinCode: this.productTypeStockCode.join(','),
          detailBef: this.searchForm.detailNum
        }
        this.isShowQueryRes = true
        this.queryResLoad = true
        this.requestParams = params
        getQureryRes(params).then(resp => {
          switch (this.searchForm.stockType) {
            case 'account':
              this.tableOptions = this.accountTable
              break
            case 'pbu':
              this.tableOptions = this.pbuTable
              break
            case 'salePart':
              this.tableOptions = this.salePartTable
              break
            case 'member':
              this.tableOptions = this.memberTable
              break
          }
          this.queryResLoad = false
          this.tableData = resp.bizData.metaData
        })
      },
      // 查询结果格式化
      fnFormatDecThou3 (row, column, cellValue) {
        if (cellValue !== '合计') {
          return this.gfnElColFormatDecThou3(row, column, cellValue)
        }else{
          return cellValue
        }
      },
      // 获取上传账户组txt文件内容
      fnGetAccountGroupUploadCon (res) {
        let uploadNum = res.length
        if (uploadNum > 1000) {
          this.$message.error(`最多可指定1000个账户,您上传的文件包含${uploadNum}个账户`)
          return
        }
        this.searchForm.accountGroup = res.join(',')
      },
      // 证券类型获取txt文件内容
      fnGetStockTypeUploadCon (res) {
        this.selectParams.query = res
        this.$refs.selectLazyMultiple.getUploadSelectOptionCon(res)
      },
      // 导出接口
      handleExportData (val) {
        console.log(val)
        let params = this.requestParams
        params['tableColumns'] = this.tableOptions
        params['fileType'] = val
        this.gfnExportFile('/regularqry/stockes-column/v1/export', JSON.stringify(params))
      }
    }
  }
</script>

<style lang="less">
  .more-stock-with-column {
    .el-dialog {
      .el-dialog__body {
        padding-bottom: 0;
      }
    }
  }
</style>
