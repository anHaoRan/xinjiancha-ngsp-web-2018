<template>
  <div>
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div>
      <el-card>
        <div slot="header" class="clearfix">
          <span>查询条件</span>
          <el-button type="info" @click="clearForm()" size="small">清空</el-button>
          <el-button type="primary" :loading="uploadParams.loading" @click="searchData()" size="small">查询</el-button>
        </div>
        <el-row>
          <el-col :span="24">
            <el-col :span="1" class="name">
              <excel-upload :uploadParams="uploadParams" @fileData="setFileData"></excel-upload>
            </el-col>
            <el-col :span="2" :offset="1" class="name">
              <span style="float: left; line-height: 32px">{{allDataLength}}</span>
            </el-col>
            <el-col :span="17" :offset="1" class="oneYardRadio">
              是否分别计算一码通下其他账户：
              <el-radio v-model="oneYard" label="1">是</el-radio>
              <el-radio v-model="oneYard" label="0">否</el-radio>
            </el-col>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>查询结果</span>
          <el-dropdown v-if="profitMakingData.length > 0">
            <el-button type="primary" size="small">
              导出<i class="el-icon-arrow-down el-icon-right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="XLS"><i class="el-icon-document"></i>导出为XLS</el-dropdown-item>
              <el-dropdown-item command="CSV"><i class="el-icon-tickets"></i>导出为CSV</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-row>
          <el-col :span="24">
            <el-table
              ref="profitMakingTable"
              :data="profitMakingData"
              border
              :default-sort="{prop: 'shareholderCode', order: 'descending'}"
              style="width: 100%; max-height: 800px;">
              <el-table-column
                prop="acctId"
                sortable
                fixed
                width="110"
                label="股东代码">
              </el-table-column>
              <el-table-column
                prop="acctName"
                label="股东名称">
              </el-table-column>
              <el-table-column
                prop="secCode"
                label="证券代码"
                width="110"
                sortable>
              </el-table-column>
              <el-table-column
                prop="secName"
                label="证券简称"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="baseHoldBal"
                label="期初持股"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="baseMktVal"
                label="期初持股市值"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="orderVol"
                label="新股申购数量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="orderAmt"
                label="新股申购金额"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="accuBuyVol"
                label="累计买入数量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="accuBuyAmt"
                label="累计买入金额"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="accuSellVol"
                label="累计卖出数量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="accuSellAmt"
                label="累计卖出金额"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="holdBal"
                label="期末持股"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="mktVal"
                label="期末持股市值"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="stampTaxAmt"
                label="印花税"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="transFeeAmt"
                label="过户费"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="commFeeAmt"
                label="交易佣金估算"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="divAmt"
                label="累计派现金额"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="shareRealVol"
                label="累计送股数量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="placingRealVol"
                label="配股数量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="placingRealAmt"
                label="配股金额"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="shareReformRealVol"
                label="股改送股数量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="reformDivAmt"
                label="股改送现金金额"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="nontradeIn"
                label="非交易过户转入"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="nontradeOut"
                label="非交易过户转出"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="realUnlawGet"
                label="违法所得"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="checkHold"
                label="校验"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalData">
            </el-pagination>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
  import _ from 'underscore';
  import Breadcrumb from '../../common/Breadcrumb'
  import {searchProfitMaking} from '../../../service/analysisTool/specificTool/index';
  import ExcelUpload from '../../common/ExcelUpload';

  export default {
    components: {
      ExcelUpload,
      Breadcrumb
    },
    data() {
      return {
        breadcrumbItems: [
          {
            router: '/analysisTool',
            label: '分析工具'
          }, {
            router: '/dimensionTable',
            label: '特定工具'
          }, {
            router: '/profitMakingAccounts',
            label: '盈利计算-账面盈利'
          }],
        uploadParams: {
          loading: false,
          label: '文件上传',
          type: 'primary',
          params: [
            {
              firstToSkip: 1, // 前置忽略项
              lastToAbandon: 0, // 后置忽略项
              fields: ['gdAccounts', 'zqCode', 'startDate', 'endDate'] // 读取文件数据并以此格式返回数据
            },
            {
              firstToSkip: 1, // 前置忽略项
              lastToAbandon: 0, // 后置忽略项
              fields: ['gdAccounts', 'startDate', 'endDate', 'jyRate'] // 读取文件数据并以此格式返回数据
            }
          ]
        },
        oneYard: '1',
        exportRadio: 3,
        allData: [],
        allDataLength: '',
        excelParams: [],
        profitMakingData: [],
        currentPage: 1,
        totalData: 0,
        pageSizes: [20, 40, 60, 80],
        pageSize: 20
      }
    },
    methods: {
      clearForm() {
        this.excelParams = [];
        this.allDataLength = ''
      },
      searchData() {
        let self = this;
        if ($.isEmptyObject(self.excelParams)) {
          this.$message.error('未上传查询条件!');
          return
        }
        self.uploadParams.loading = true;
        let params = JSON.stringify(this.excelParams);
        searchProfitMaking(params).then(resp => {
          self.allData = resp.resData;
          self.profitMakingData = self.allData.slice(0, self.pageSize);
          self.totalData = resp.respSize;
          self.uploadParams.loading = false
        }, (err) => {
          console.log('searchProfitMaking err is ', err)
        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        if (this.allData.length / val >= this.currentPage) {
          this.handleCurrentChange(this.currentPage);
        }
      },
      handleCurrentChange(val) {
        this.profitMakingData = this.allData.slice(this.pageSize * (val - 1), this.pageSize * val);
        this.currentPage = val;
      },
      setFileData(val) {
        this.excelParams = val.Sheet0.concat(val.Sheet1);
        this.uploadParams.loading = false;
        this.allDataLength = '读取 ' + this.excelParams.length + ' 条数据';
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    .el-row {
      margin-top: 20px;
    }
    .el-row {
      .el-col {
        .name {
          line-height: 32px;
        }
      }
    }
    .el-dropdown {
      .el-button {
        i {
          margin-left: 10px;
        }
      }
    }
    .el-pagination {
      margin-top: 20px;
    }
  }

  .el-table th > .cell {
    text-align: center !important;
  }

  .el-table .cell {
    text-align: right;
  }

  .el-table .el-table__row td:nth-of-type(1) .cell,
  .el-table .el-table__row td:nth-of-type(3) .cell {
    text-align: left;
  }

  .el-dropdown-menu {
    i {
      margin-right: 10px;
    }
  }

  .oneYardRadio {
    line-height: 32px;
  }
</style>
