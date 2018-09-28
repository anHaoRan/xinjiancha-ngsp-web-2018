<template>
  <div class="stock-trade-query">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="2" class="name">账户代码 :</el-col>
        <el-col :span="4">
          <el-input v-model="accountCode" placeholder="请输入账户代码" size="small" id="vv_accountCode"></el-input>
        </el-col>
        <el-col :span="18" class="name">&nbsp;</el-col>
        <el-col :span="2" class="name">开始日期 :</el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="beginDate"
            type="date"
            placeholder="请选择开始日期"
            :picker-option="pickerOption"
            size="small">
          </el-date-picker>
        </el-col>
        <el-col :span="2" class="name">结束日期 :</el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="endDate"
            type="date"
            placeholder="请选择结束日期"
            :picker-option="pickerOption"
            size="small">
          </el-date-picker>
        </el-col>
        <el-col :span="2" :offset="10">
          <el-button type="primary" size="small">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="stockTradeTableData"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="60">
            </el-table-column>
            <el-table-column
              label="交易日期"
              min-width="7.5%">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
              prop="securityCode"
              label="证券代码"
              min-width="7.5%">
            </el-table-column>
            <el-table-column
              prop="securityName"
              label="证券简称"
              min-width="7.5%"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="shareholderAccount"
              label="股东账户"
              min-width="7.5%">
            </el-table-column>
            <el-table-column
              prop="shareholderName"
              label="股东名称"
              min-width="7.5%"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="salesDeptName"
              label="会员交易营业部"
              min-width="10%"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="notRestrictedStockQty"
              label="非限售股数量"
              min-width="7.5%"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="restrictedStockQty"
              label="限售股数量"
              min-width="7.5%"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="positionAmount"
              label="总持仓数量"
              min-width="7.5%"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="notRestrictedMarketValue"
              label="非限售股市值"
              min-width="7.5%"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="restrictedMarketValue"
              label="限售股市值"
              min-width="7.5%"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../../common/Breadcrumb'

lsbridge.subscribe('to_sotck_position_query', function (data) {
  if (data != null && data.rows != null && data.rows.length > 0) {
    $('#vv_accountCode').val(data.rows[0].accountCode);
  }
});

export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      breadcrumbItems: [{
        router: '/analysisTool',
        label: '分析工具'
      }, {
        router: '/analysisTool',
        label: '数据综合查询'
      }, {
        router: '/dimensionTable',
        label: '维度信息查询'
      }, {
        router: '/dimensionQuery',
        label: '钻取查询'
      }, {
        router: '',
        label: '账户证券持仓查询'
      }],
      accountCode: '',
      beginDate: '',
      endDate: '',
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      stockTradeTableData: [{
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }, {
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }, {
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }, {
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }, {
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }, {
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }, {
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }, {
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }, {
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }, {
        date: '2017/09/12',
        securityCode: '600001',
        securityName: '浦发银行',
        shareholderAccount: '1009384322',
        shareholderName: '里奇',
        salesDeptName: '国泰君安长寿路营业部',
        notRestrictedStockQty: '6000',
        restrictedStockQty: '3000',
        positionAmount: '90000',
        notRestrictedMarketValue: '8900000',
        restrictedMarketValue: '1200000'
      }],
      currentPage: 1
    }
  },
  methods: {
    handleSizeChange() {

    },
    handleCurrentChange() {

    }
  },
  mounted() {
  }
}
</script>

<style scoped lang="less">

</style>
