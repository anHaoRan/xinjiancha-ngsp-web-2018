<template>
  <div class='dimension-query'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card>
      <el-tabs v-model='activeName' type='border-card'>
        <el-tab-pane label='持股曲线' name='stockLine'>
          <el-row>
            <el-col :span='2' class='name'>开始日期 :</el-col>
            <el-col :span='4'>
              <el-date-picker
                v-model='beginDate'
                type='date'
                placeholder='请选择开始日期'
                :picker-option='pickerOption'
                size='small'>
              </el-date-picker>
            </el-col>
            <el-col :span='2' class='name'>结束日期 :</el-col>
            <el-col :span='4'>
              <el-date-picker
                v-model='endDate'
                type='date'
                placeholder='请选择结束日期'
                :picker-option='pickerOption'
                size='small'>
              </el-date-picker>
            </el-col>
            <el-col :span='2' :offset='1'>
              <el-button type='primary' size='small'>查询</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label='持仓市值曲线' name='positionLine'>
          <el-row>
            <el-col :span='2' class='name'>开始日期 :</el-col>
            <el-col :span='4'>
              <el-date-picker
                v-model='beginDate'
                type='date'
                placeholder='请选择开始日期'
                :picker-option='pickerOption'
                size='small'>
              </el-date-picker>
            </el-col>
            <el-col :span='2' class='name'>结束日期 :</el-col>
            <el-col :span='4'>
              <el-date-picker
                v-model='endDate'
                type='date'
                placeholder='请选择结束日期'
                :picker-option='pickerOption'
                size='small'>
              </el-date-picker>
            </el-col>
            <el-col :span='2' :offset='1'>
              <el-button type='primary' size='small'>查询</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label='账户明细' name='accountDetail'>
          <el-row>
            <el-col :span='2' class='name'>账户代码 :</el-col>
            <el-col :span='4'>
              <el-input v-model='accountCode' placeholder='请输入账户代码' size='small'></el-input>
            </el-col>
            <el-col :span='2' class='name'>开始日期 :</el-col>
            <el-col :span='4'>
              <el-date-picker
                v-model='beginDate'
                type='date'
                placeholder='请选择开始日期'
                :picker-option='pickerOption'
                size='small'>
              </el-date-picker>
            </el-col>
            <el-col :span='2' class='name'>结束日期 :</el-col>
            <el-col :span='4'>
              <el-date-picker
                v-model='endDate'
                type='date'
                placeholder='请选择结束日期'
                :picker-option='pickerOption'
                size='small'>
              </el-date-picker>
            </el-col>
            <el-col :span='2' :offset='1'>
              <el-button type='primary' size='small'>查询</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='3'>
              <el-button type='primary' @click='toStockTradeQuery' size='small'>账户证券交易查询</el-button>
            </el-col>
            <el-col :span='3' :offset='1'>
              <el-button type='primary' @click='toStockPositionQuery' size='small'>账户证券持仓查询</el-button>
            </el-col>
            <el-col :span='2' :offset='1'>
              <el-button type='ghost' size='small'>XLS导出</el-button>
            </el-col>
            <el-col :span='2' :offset='1'>
              <el-button type='ghost' size='small'>CSV导出</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='24'>
              <el-table
                ref='multipleTable'
                :data='accountDetailsTableData'
                border
                style='width: 100%'
                @selection-change='handleSelectionChange'>
                <el-table-column
                  type='selection'
                  min-width='5%'>
                </el-table-column>
                <el-table-column
                  prop='salesDeptName'
                  label='会员营业部名称'
                  min-width='15%'
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop='accountCode'
                  label='账户代码'
                  min-width='10%'>
                </el-table-column>
                <el-table-column
                  prop='accountName'
                  label='账户名称'
                  min-width='10%'
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop='memberNumber'
                  label='期间会员个数'
                  min-width='10%'
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop='salesDeptNumber'
                  label='期间营业部个数'
                  min-width='10%'
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop='PBUNumber'
                  label='期间PBU个数'
                  min-width='10%'
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop='buyQty'
                  label='成交买入数量'
                  min-width='10%'
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop='buyAmount'
                  label='成交买金额'
                  min-width='10%'
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop='qtyRatio'
                  label='成交买入数量占比'
                  min-width='10%'
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span='24'>
              <el-pagination
                @size-change='handleSizeChange'
                @current-change='handleCurrentChange'
                :current-page='currentPage'
                :page-sizes='[100, 200, 300, 400]'
                :page-size='100'
                layout='total, sizes, prev, pager, next, jumper'
                :total='400'>
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../../common/Breadcrumb'

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
        router: '/complexQuery',
        label: '综合查询'
      }, {
        router: '/dimensionQuery',
        label: '维度信息查询'
      }, {
        router: '/drillQuery',
        label: '钻取查询'
      }],
      activeName: 'stockLine',
      accountCode: '',
      beginDate: '',
      endDate: '',
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      accountDetailsTableData: [{
        salesDeptName: '国泰君安南京东路营业部',
        accountCode: '50098',
        accountName: '张晓军',
        memberNumber: 32,
        salesDeptNumber: 11,
        PBUNumber: 2,
        buyQty: 38293243,
        buyAmount: 300000000,
        qtyRatio: '13%'
      }, {
        salesDeptName: '国泰君安南京东路营业部',
        accountCode: '50098',
        accountName: '张晓军',
        memberNumber: 32,
        salesDeptNumber: 11,
        PBUNumber: 2,
        buyQty: 38293243,
        buyAmount: 300000000,
        qtyRatio: '13%'
      }, {
        salesDeptName: '国泰君安南京东路营业部',
        accountCode: '50098',
        accountName: '张晓军',
        memberNumber: 32,
        salesDeptNumber: 11,
        PBUNumber: 2,
        buyQty: 38293243,
        buyAmount: 300000000,
        qtyRatio: '13%'
      }, {
        salesDeptName: '国泰君安南京东路营业部',
        accountCode: '50098',
        accountName: '张晓军',
        memberNumber: 32,
        salesDeptNumber: 11,
        PBUNumber: 2,
        buyQty: 38293243,
        buyAmount: 300000000,
        qtyRatio: '13%'
      }, {
        salesDeptName: '国泰君安南京东路营业部',
        accountCode: '50098',
        accountName: '张晓军',
        memberNumber: 32,
        salesDeptNumber: 11,
        PBUNumber: 2,
        buyQty: 38293243,
        buyAmount: 300000000,
        qtyRatio: '13%'
      }, {
        salesDeptName: '国泰君安南京东路营业部',
        accountCode: '50098',
        accountName: '张晓军',
        memberNumber: 32,
        salesDeptNumber: 11,
        PBUNumber: 2,
        buyQty: 38293243,
        buyAmount: 300000000,
        qtyRatio: '13%'
      }, {
        salesDeptName: '国泰君安南京东路营业部',
        accountCode: '50098',
        accountName: '张晓军',
        memberNumber: 32,
        salesDeptNumber: 11,
        PBUNumber: 2,
        buyQty: 38293243,
        buyAmount: 300000000,
        qtyRatio: '13%'
      }, {
        salesDeptName: '国泰君安南京东路营业部',
        accountCode: '50098',
        accountName: '张晓军',
        memberNumber: 32,
        salesDeptNumber: 11,
        PBUNumber: 2,
        buyQty: 38293243,
        buyAmount: 300000000,
        qtyRatio: '13%'
      }, {
        salesDeptName: '国泰君安南京东路营业部',
        accountCode: '50098',
        accountName: '张晓军',
        memberNumber: 32,
        salesDeptNumber: 11,
        PBUNumber: 2,
        buyQty: 38293243,
        buyAmount: 300000000,
        qtyRatio: '13%'
      }],
      currentPage: 1
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      lsbridge.send('to_sotck_position_query', {rows: this.multipleSelection});
    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    },
    toStockTradeQuery() {
      this.$router.push({path: '/stockTradeQuery'});
    },
    toStockPositionQuery() {
      window.open('#/bench', 'newwindow', 'height=800, width=1080, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
    },
    showChoosedTab(id) {
      if (id == undefined) {
        this.activeName = 'stockLine';
      } else {
        this.activeName = id;
      }
    }
  },
  mounted() {
    // this.getOnedayStockData();
    this.showChoosedTab(this.$route.query.id);
  }
}
</script>

<style scoped lang='less'>

</style>
