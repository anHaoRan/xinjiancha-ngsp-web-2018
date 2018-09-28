<template>
  <div>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-card class='accountBehaviorTrack-query-area'>
      <el-row>
        <el-col :span='10'>
          <el-col :span='6' class='name'>开始日期 :</el-col>
          <el-col :span='18'>
            <el-date-picker
              v-model='accountBehaviorTrackForm.beginDate'
              type='date'
              placeholder='请选择开始日期'
              :picker-option='pickerOption'
              size='small'>
            </el-date-picker>
          </el-col>
        </el-col>
        <el-col :span='10' :offset='1'>
          <el-col :span='6' class='name'>结束日期 :</el-col>
          <el-col :span='18'>
            <el-date-picker
              v-model='accountBehaviorTrackForm.endDate'
              type='date'
              placeholder='请选择结束日期'
              :picker-option='pickerOption'
              size='small'>
            </el-date-picker>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='10'>
          <el-col :span='6' class='name'>证券代码 :</el-col>
          <el-col :span='18'>
            <el-input
              v-model='accountBehaviorTrackForm.stockCode'
              placeholder='请输入证券代码'
              size='small'>
              <el-button slot='append' icon='el-icon-plus' @click='addStockCode'></el-button>
            </el-input>
          </el-col>
        </el-col>
        <el-col :span='18' class='stock-code-container'></el-col>
      </el-row>
      <el-row>
        <el-col :span='2' :offset='19'>
          <el-button type='primary' @click='accountBehaviorTrackOld()' size='small'>查询</el-button>
        </el-col>
        <el-col :span='2' :offset='1'>
          <el-button type='primary' @click='clearForm()' size='small'>清空</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='accountBehaviorTrack-query-area'>
      <el-row>
        <el-col :span='24'>
          <el-table
            :data='tableData'
            :fit=true
            border>
            <el-table-column
              v-for='column in columns'
              :show-overflow-tooltip='true'
              :key='column.field'
              :label='column.label'
              :prop='column.field'
              :width='column.width'
              :min-width='column.minWidth'
              :align='column.align == null ? "center" : column.align'
              :header-align='column.headerAlign == null ? "center" : column.headerAlign'
              :sortable='column.sortable == null ? false : column.sortable'>
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
    </el-card>
  </div>
</template>

<script>
// import {accountBehaviorTrack} from '../../../service/analysisTool/complexQuery/index';
import _ from 'underscore';
import Breadcrumb from '../../common/Breadcrumb'

export default {
  components: {
    Breadcrumb
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
        // router: '/accountBehaviorTrack',
        // label: '账户行为追踪'
      }],
      columns: [ // 定义列
        {label: '营业部全称', field: 'branch_name', minwidth: '3%', align: 'center', sortable: true},
        {label: '参与委托账户总数', field: 'count_acct_id', minwidth: '6.25%', align: 'left', sortable: false},
        {label: '买委托量', field: 'sum_order_b_vol', minwidth: '6.25%', align: 'left', sortable: true},
        {label: '平均买委托价', field: 'avg_order_b_price', minwidth: '6.25%', align: 'left', sortable: true},
        {label: '买委托次数', field: 'sum_order_b_cnt', minwidth: '3%', align: 'center', sortable: true},
        {label: '买成交量', field: 'sum_buy_vol', minwidth: '3%', align: 'center', sortable: true},
        {label: '平均买委托价', field: 'avg_buy_price', minwidth: '3%', align: 'center', sortable: true},
        {label: '买成交次数', field: 'sum_buy_cnt', minwidth: '3%', align: 'center', sortable: true},
        {label: '买撤单量', field: 'sum_order_bw_vol', minwidth: '3%', align: 'center', sortable: true},
        {label: '买撤单次数', field: 'sum_order_bw_cnt', minwidth: '3%', align: 'center', sortable: true},
        {label: '卖委托量', field: 'sum_order_s_vol', minwidth: '3%', align: 'center', sortable: true},
        {label: '平均卖委托价', field: 'avg_order_s_price', minwidth: '3%', align: 'center', sortable: true},
        {label: '卖委托次数', field: 'sum_order_s_cnt', minwidth: '3%', align: 'center', sortable: true},
        {label: '卖成交量', field: 'sum_sell_vol', minwidth: '3%', align: 'center', sortable: true},
        {label: '平均卖成交价', field: 'avg_sell_price', minwidth: '3%', align: 'center', sortable: true},
        {label: '卖成交次数', field: 'sum_sell_cnt', minwidth: '3%', align: 'center', sortable: true},
        {label: '卖撤单量', field: 'sum_order_sw_vol', minwidth: '3%', align: 'center', sortable: true},
        {label: '卖撤单次数', field: 'sum_order_sw_cnt', minwidth: '3%', align: 'center', sortable: true}
      ],
      beginDate: '',
      endDate: '',
      isDayCalculation: false,
      isDrillDetail: false,
      accountBehaviorTrackForm: {
        stockCode: '',
        beginDate: '',
        endDate: ''
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableData: [],
      currentPage: 1,
      stockCodeList: [],
      isContextmenuShowList: [],
      dialogChartVisible: false,
      dialogName: ''
    }
  },
  methods: {
    addStockCode() {
      if (this.accountBehaviorTrackForm.stockCode == '' || this.accountBehaviorTrackForm.stockCode == null) {
        return;
      }
      this.stockCodeList.unshift(this.accountBehaviorTrackForm.stockCode);
    },
    deleteStockCode(code) {
      this.stockCodeList = _.without(this.stockCodeList, code);
    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    },
    clickRightMouseHint() {
      this.$message('请单击鼠标右键');
    },
    showContextmenu(index) {
      let wrapArr = [];
      wrapArr[index] = true;
      this.isContextmenuShowList = wrapArr;
    },
    toDrillQuery(param) {
      if (param === 'stockLine' || param === 'positionLine') {
        this.openMesBox();
      } else {
        document.removeEventListener('click', this.removeContextmenu, false);
        // this.$router.push({path: '/drillQuery',query: {'id': param}});
      }
    },
    removeContextmenu(event) {
      this.isContextmenuShowList = [];
    },
    openMesBox() {
      this.$alert('<stock-line></stock-line>', {
        dangerouslyUseHTMLString: true
      })
    },
    accountBehaviorTrack() {
      let params = {
        beginDate: this.HKStocksThroughForm.beginDate,
        endDate: this.HKStocksThroughForm.endDate,
        stockCode: this.HKStocksThroughForm.stockCode
      }
      if (params.beginDate == '') {
        this.$message({
          showClose: true,
          message: '开始日期为空',
          duration: 1000,
          type: 'error'
        });
        return;
      }
      if (params.endDate == '') {
        this.$message({
          showClose: true,
          message: '结束日期为空',
          duration: 1000,
          type: 'error'
        });
        return;
      }
      if (params.stockCode == '') {
        this.$message({
          showClose: true,
          message: '证券代码为空',
          duration: 1000,
          type: 'error'
        });
        return;
      }
      // accountBehaviorTrack(params).then((resp) => {
      //   this.requestParams = params;
      //   this.tableData = resp;
      // })
    }
  },
  mounted() {
    document.addEventListener('click', this.removeContextmenu, false);
  }
}
</script>

<style lang='less'>

</style>
