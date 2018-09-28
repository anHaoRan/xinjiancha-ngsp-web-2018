<!--回购越权交易- 2018-5-18-->
/* eslint-disable */
<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card style="width:100%">
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="text"
          @click="resetForm('ruleForm')"
          size="small">清空
        </el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          size="small">查询
        </el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="100px">
        <el-form-item label="日期 ：" prop="startDate">
          <el-date-picker
            v-model="ruleForm.startDate"
            type="date"
            placeholder="请选择日期"
            :picker-options="datePicker"
            @change="handleDateChange"
            size="small">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-dropdown @command="handleDownload">
          <el-button type="primary" size="mini" :disabled=" accountDetailsTableData.total == 0 ">
            导出<i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="xlsx">
              导出为EXCEL
            </el-dropdown-item>
            <el-dropdown-item command="csv">
              导出为CSV
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!--表格分页组件-->
      <s-table :isHeader="false" :height="600" :columns="dataColumns" :data="accountDetailsTableData" :loading="loading" @getPageination="getPageination"></s-table>
    </el-card>
  </div>
</template>
/* eslint-disable */

<script>
  // 下划线js
  import _ from 'underscore';
  // 日期插件
  import moment from 'moment';
  // 面包屑组件
  import Breadcrumb from '../../common/Breadcrumb';
  // 获取交易日偏移
  import {getRelativeTradeDate} from '../../../service/common/commonFunc';
  // 回购越权交易查询接口
  import {postBuyBackUltraVires} from '../../../service/analysisTool/customQuery/index';
  import STable from '../../base/STable' // 表格和分页组件

  export default {
    components: {
      Breadcrumb,
      STable
    },
    data() {
      return {
        // 面包屑
        breadcrumbItems: [
          {
            router: '/analysisTool',
            label: '分析工具'
          }, {
            router: '/dimensionTable',
            label: '自定义查询'
          }, {
            router: '/overrunRepurchaseTransaction',
            label: '回购越权交易'
          }],
        ruleForm: {
          startDate: '' // 日期的数据
        },
        rules: {
          startDate: [
            {required: true, type: 'date', message: '请选择日期', trigger: 'change'}
          ]
        },
        loading: false, // 表格数据加载中
        dataColumns: [
          {label: '会员名称', field: 'branch_name', align: 'left', minWidth: '100', sortable: true},
          {label: '账户代码', field: 'account_code', align: 'left', minWidth: '100'},
          {label: '账户名称', field: 'investor_account_name', align: 'left', minWidth: '100'},
          {label: '交易品种', field: 'instrument_chn_short_name', align: 'left', minWidth: '100'}
        ],
        datePicker: { // 日期范围
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        // tabel表格数据
        accountDetailsTableData: {data: [], total: 0, pageIndex: 1, pageRows: 10},
        queryParams: '' // 查询参数
      };
    },
    methods: {
      // 清空事件
      resetForm() {
         getRelativeTradeDate(-1).then(resp => {
           this.ruleForm.startDate = new Date(moment(resp).format('YYYY-MM-DD')); // eslint-disable-line
         });
        this.resetResult();
      },
      // 清空查询结果
      resetResult() {
        this.loading = false;
        this.accountDetailsTableData = {data: [], total: 0, pageIndex: 1, pageRows: 10}
      },
      // 验证表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleQueryData(this.accountDetailsTableData.pageIndex, this.accountDetailsTableData.pageRows);
          } else {
            this.$message.error('查询失败！请正确填写查询参数~');
          }
        });
      },
      // 查询事件
      handleQueryData(page, size) {
        this.loading = true;
        this.queryParams = moment(this.ruleForm.startDate).format('YYYYMMDD');
        let params = {
          startDate: moment(this.ruleForm.startDate).format('YYYYMMDD'),
          pageIndex: page,
          pageRows: size,
          isExport: 0
        };
        postBuyBackUltraVires(params).then((resp) => {
          this.accountDetailsTableData.data = resp.res.res;
          this.accountDetailsTableData.total = resp.cnt.resCnt;
          this.loading = false;
        });
      },
      getPageination(page) {
        this.handleQueryData(page.currentPage, page.pageSizeNumber)
      },
      // 导出数据
      handleDownload(command) {
        this.$message.info('正在导出表格数据，请稍等~');
        let downloadParams = {
          tableColumns: [
            {
              'sheetName': '回购越权交易',
              'fileColumns': this.dataColumns
            }
          ],
          fileType: command,
          startDate: this.queryParams,
          isExport: 1

        };
        this.gfnExportFileWithForm('/specialqry/speclqry/v1/repurchase-surpass-export', downloadParams);
      },
      // 改变查询条件-日期
      handleDateChange() {
        this.resetResult(); // 清空查询结果
      }

    },
    mounted() {
      // 初始化时间
      getRelativeTradeDate(-1).then(resp => {
        this.ruleForm.startDate = new Date(moment(resp).format('YYYY-MM-DD'));
      })
    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    .el-form {
      margin-top: 20px;
    }
  }
</style>
