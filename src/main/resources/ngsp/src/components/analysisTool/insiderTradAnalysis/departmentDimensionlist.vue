<template>
	<div>
    <el-card class="el-card-table" style="margin-top: 0;">
      <el-table
        style="margin-top:10px;"
        :data="departmentDimensionTable"
        :fit=true
        @row-click="tablelist"
        border>
        <el-table-column
          prop="branch_name"
          label="交易营业部"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="city"
          label="营业部所在地区"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="yyb0001"
          label="期间合计买入量"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="yyb0002"
          label="期间合计买入金额"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="yyb0003"
          label="期间合计卖出量"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="yyb0004"
          label="期间合计卖出金额"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="yyb0005"
          label="期间合计净买入数量"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="yyb0006"
          label="期间合计净买入金额"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="yyb0007"
          label="净买入金额排名"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-col :span="24" style="margin-top:10px">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pagenum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalpage"
          @current-change="currentpagination"
          @size-change="sizepagination">
        </el-pagination>
      </el-col>
    </el-card>
    <span  v-if="display" style="position: relative;top: 50px;left: 170px;">
      <span>{{departmentname}}&nbsp&nbsp</span>
      <span>|&nbsp&nbsp&nbsp净买入数量排名:{{buyrank}}</span>
    </span>
    <el-card>
      <accountDimensionlist v-if="display" ref="accountDimensionlist"></accountDimensionlist>
    </el-card>
  </div>
</template>
<script>
  import StockCodeQuery from '../../common/StockCodeQuery'
  import {getdepartmentlist,getdepartmentOnelist} from '../../../service/analysisTool/insiderTradAccountAnalysis/accountlist/index.js'
  import accountDimensionlist from './accountDimensionlist.vue'
  export default {
    components: {
      StockCodeQuery,
      accountDimensionlist
    },
    props: ["activeName"],
    data() {
      return {
        commonData: {
          disabled: false,
          stockCode: ''
        },
        departmentDimensionTable:[],
        departmentlistTable:[],
        HistoryReport:'不限',
        isHistoryReport:[{
          value: "不限",
          label: "不限"
        },{
          value: "是",
          label: "是"
        },{
          value: "否",
          label: "否"
        }],
        isresult:[{
          value: "进一步关注",
          label: "进一步关注"
        },{
          value: "进一步调查",
          label: "进一步调查"
        },{
          value: "无异常",
          label: "无异常"
        }],
        firstScore:'',
        lastScore:'',
        tableflag:false,
        currentPage: 1,
        pagenum: 10,
        totalpage: 400,
        taskID:'z0001',
        display:false,
        departmentname:'',
        buyrank:'',
      }
    },
    mounted() {
      this.taskID=this.$store.state.insiderTradAnalysis.currentTaskData.taskId
      // this.taskID="lh005"
      if(this.$store.state.insiderTradAnalysis.departmentcode){
        this.getdepartmentOneData()
      }else{
        this.getdepartmentAllData()
      }

    },
    methods: {
      getdepartmentOneData(){
        const loading = this.$loading({
        lock: true,
        text: '数据加载中，请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)'
      });
        let params = {
          "taskID":this.taskID,
          "branchCode":this.$store.state.insiderTradAnalysis.departmentcode,
        }
        getdepartmentOnelist(params).then((resp) => {
          this.departmentDimensionTable=resp.deptRes
          this.totalpage=Number(resp.pageTotal)
          loading.close();
        });
      },
      getdepartmentAllData(){
        const loading = this.$loading({
        lock: true,
        text: '数据加载中，请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)'
      });
        let params = {
          "taskID":this.taskID,
          "pageIdx":this.currentPage,
          "pageRw":this.pagenum,
        }
        getdepartmentlist(params).then((resp) => {
          this.departmentDimensionTable=resp.deptRes
          this.totalpage=Number(resp.pageTotal)
          loading.close();
        });
      },
      getStockCode(stockCodeData) {
        this.commonData.stockCode = stockCodeData;
      },
      tablelist(row){
        if(this.display){
          this.display=true
          this.departmentname=row.branch_name
          this.buyrank=parseInt(row.yyb0007)
          this.$store.commit('savebranchCode', row.branch_code);
          this.$refs.accountDimensionlist.getdepartmentandAccountData()
        }else{
          this.display=true
          this.departmentname=row.branch_name
          this.buyrank=parseInt(row.yyb0007)
          this.$store.commit('savebranchCode', row.branch_code);
        }
      },
      currentpagination(val) {
        this.currentPage = val
        if(this.$store.state.insiderTradAnalysis.departmentcode){
          this.getdepartmentOneData()
        }else{
          this.getdepartmentAllData()
        }
      },
      sizepagination(val) {
        this.pagenum = val
        if(this.$store.state.insiderTradAnalysis.departmentcode){
          this.getdepartmentOneData()
        }else{
          this.getdepartmentAllData()
        }
      },
    }
  }
</script>
