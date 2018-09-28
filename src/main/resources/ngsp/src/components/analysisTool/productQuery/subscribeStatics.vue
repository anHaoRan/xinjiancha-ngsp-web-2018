<template>
  <!--申购统计-->
  <div class="redemption-statics">
    <el-card style="margin-top: 0; padding-top: 20px;">
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text"
                   size="small"
                   style="float:right;"
                   @click="resetAll">清空
        </el-button>
        <el-button
            type="primary"
            size="small"
            style="float:right; "
            @click="getQueryRes">查询
        </el-button>
      </div>
      <el-form
          :inline="true"
          label-width="150px"
          ref="subscribeStaticForm"
          :model="subscribeStaticForm">

        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="基金代码：" required>
            <el-input
                v-model="stockCode"
                size="small"
                disabled
                class="el-form-input"
                @change="resetPagenation"
                style="width:260px">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :md="12" :sm="24">
          <el-form-item label="申购金额：">
            <el-input
                size="small"
                v-model.number="subscribeStaticForm.priceStart"
                @change="checkPriceStart"
                class="el-form-input"
                style="width:115px">
            </el-input>
            <span style="display: inline-block;margin-left: 8px;margin-right: 8px;">—</span>
            <el-input
                size="small"
                v-model.number="subscribeStaticForm.priceEnd"
                @change="checkPriceEnd"
                class="el-form-input"
                style="width:115px"/>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card v-if="queryResult" class="el-card-table">

      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button size="small" type="primary" v-show="false" @click="saveLocation">导出</el-button>
      </div>
      <el-table
          :data="tableData"
          :fit=true
          :highlight-current-row="false"
          border
          v-loading="queryResLoad"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
            v-for="item in tableOptions"
            :prop="item.field"
            :label="item.label"
            :key="item.field"
            :width="item.width"
            :align="item.align == null ? 'center' : item.align"
            :sortable="item.sortable == null ? false : item.sortable"
            :sort-method="item.sortMethod"
            resizable
            show-overflow-tooltip>
        </el-table-column>
      </el-table>

      <el-col :span="24">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="resultNum">
        </el-pagination>
      </el-col>

    </el-card>
  </div>
</template>

<script>
  import { getSubscribeStaticRes } from '../../../service/analysisTool/productQuery'
  import MinxinVue from './common/MixIn'

  export default {
    name: 'redemption-statics',
    mixins: [MinxinVue],
    data () {
      return {
        msg: '申购统计',
        stockCode: '',
        subscribeStaticForm: {
          priceStart: '',
          priceEnd: ''
        },
        queryResult: false,
        queryResLoad: false,
        tableOptions: [
          {label: '基金代码', field: 'instrument_id', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_id')},
          {label: '基金名称', field: 'instrument_chn_short_name', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'instrument_chn_short_name')},
          {label: '基金公司代码', field: 'comp_code', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'comp_code')},
          {label: '基金公司名称', field: 'comp_name', align: 'left', sortable: true, sortMethod: this.gfnSortByChineseCharacters.bind(this, 'comp_name')},
          {label: '申购金额', field: 'mktvaltotal', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'mktvaltotal'), formatter: this.gfnElColFormatDecThou3, format: '#,##0.000'},
          {label: '申购数量', field: 'trdqtytotal', align: 'right', sortable: true, sortMethod: this.gfnSortColByNumber.bind(this, 'trdqtytotal'), formatter: this.gfnElColFormatDecThou0, format: '#,##0'}
        ],
        tableData: [],
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        resultNum: 0
      }
    },
    props: ['commonData'],
    methods: {
      resetAll () {
        this.subscribeStaticForm.priceStart = ''
        this.subscribeStaticForm.priceEnd = ''
      },
      resetPagenation () {
        this.currentPage = 1
        this.pageSize = 10
      },
      getStockCode () {
        this.stockCode = this.commonData.stockCode
      },
      getQueryRes () {
        let priceStart = this.subscribeStaticForm.priceStart
        let priceEnd = this.subscribeStaticForm.priceEnd
        if (!(this.gfnFloatReg3(priceStart) && this.gfnFloatReg3(priceEnd))) {
          this.$message.error('申购金额输入格式错误，请重新输入')
          return
        }
        this.queryResult = true
        this.queryResLoad = true
        let params = {
          dateTimeStart: this.commonData.dateTimeStart,
          dateTimeEnd: this.commonData.dateTimeEnd,
          stockCode: this.stockCode.split(' ')[0],
          priceStart: this.subscribeStaticForm.priceStart,
          priceEnd: this.subscribeStaticForm.priceEnd,
          pageIndex: this.currentPage,
          pageRows: this.pageSize
        }
        getSubscribeStaticRes(params).then(resp => {
          this.tableData = resp.bizData.metaData
          this.tableData.forEach(function (item) {
            item.mktvaltotal = item.mktvaltotal
            item.trdqtytotal = item.trdqtytotal
          })
          this.resultNum = resp.bizData.totalRows - 0
          this.queryResLoad = false
        })
      },
      saveLocation () {

      },
      checkPriceStart (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('start', value, this.subscribeStaticForm.priceEnd, false, true, '申购金额格式错误，请重新输入')
        this.subscribeStaticForm.priceStart = startNum
        this.subscribeStaticForm.priceEnd = endNum
      },
      checkPriceEnd (value) {
        let [startNum, endNum] = this.fnValidateStartToEndNum('end', this.subscribeStaticForm.priceStart, value, false, true, '申购金额格式错误，请重新输入')
        this.subscribeStaticForm.priceStart = startNum
        this.subscribeStaticForm.priceEnd = endNum
      },
      handleSizeChange (size) {
        this.pageSize = size
        this.getQueryRes()
      },
      handleCurrentChange (rowNum) {
        this.currentPage = rowNum
        this.getQueryRes()
      }
    }
  }
</script>

<style lang='less'>
  .redemption-statics {
    .el-card:first-child {
      .el-card__body {
        padding-bottom: 0;
      }
    }
  }
</style>
