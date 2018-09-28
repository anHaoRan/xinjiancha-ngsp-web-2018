<template>
  <div class="account-query">
    <el-card>
      <div slot="header">
        查询条件
        <el-button
          type="primary"
          size="small"
          @click="fnGetQueryRes">
          查询
        </el-button>
      </div>
      <el-form :inline="true" label-width="100px">
        <el-row>
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="证券代码：">
              <select-lazy-multiple :selectParams="selectParams" @getSelectRes="fnGetSelectRes"
                                    style="display: inline-block;" ref="selectLazyMultiple">
              </select-lazy-multiple>
              <text-upload @getTxtCon="fnGetStockTypeUploadCon" style="display: inline-block;"></text-upload>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item :label='"账户："'>
              <el-input size="small" v-model="accountORUniteCodeVal" class="el-form-input"/>
              <text-upload @getTxtCon="fnGetAccountGroupUploadCon"
                           style="display: inline-block;"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24">
            <el-form-item label="统计方式：">
              <el-select
                size="small"
                v-model="statisticsWay"
                @change="handleStatisticWayChange">
                <el-option
                  v-for="item in statisticsWayOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="7" :md="12" :sm="24">
            <el-form-item label="日期：">
              <el-date-picker
                v-model="dateVal"
                type="daterange"
                :unlink-panels="true"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="至"
                format="yyyyMMdd"
                value-format="yyyy-MM-dd"
                size="small">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="el-card-table" v-if="isShowMainTable" style="padding-bottom: 20px;">
      <div slot="header">
        优先股账户查询：
        <el-button size="small" type="info" @click="saveMainTableLocation" v-if="!queryResMainLoad">导出</el-button>
      </div>
      <el-table
        :data="mainTableData"
        ref="mainTable"
        border
        tooltip-effect="dark"
        size="small"
        highlight-current-row
        style="width: 100%"
        max-height="550"
        v-tableLoadMore="handleMainTableLoadMore"
        v-loading="queryResMainLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)">
        <el-table-column
          v-for="column in mainTableOptions"
          :show-overflow-tooltip="true"
          :key="column.field"
          :label="column.label"
          :prop="column.field"
          :width="column.width"
          :min-width="130"
          :align="column.align == null ? 'center' : column.align"
          :formatter="column.formatter">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import TextUpload from '../../common/textUpload'
import SelectLazyMultiple from '../../common/SelectLazyMultiple'
import moment from 'moment'
import {getCurTradeDate} from '../../../service/common/commonFunc'
import {getPrecedenceAccountData} from '../../../service/analysisTool/precedenceStockQuery'

export default {
  name: 'account-query',
  props: [],
  components: {TextUpload, SelectLazyMultiple},
  mixin: [],
  data() {
    return {
      dateVal: [],
      // 账户或一码通联动label
      linkageLabel: '账户',
      // 账户或一码通value
      accountORUniteCodeVal: '',
      // 证券代码
      stockCode: '',
      // 证券代码子组件所需值
      selectParams: {
        query: '',
        loading: false,
        selectStockCodeVal: [],
        selectCheckboxValue: [],
        particLevelType: 'stockCode'
      },
      // 统计方式
      statisticsWay: '1',
      statisticsWayOptions: [
        {value: '1', label: '分日列示'},
        {value: '2', label: '多日合计'}
      ],
      // 查询结果（主表）
      isShowMainTable: false,
      mainTableTitle: '', // 表格标题
      queryResMainLoad: false,
      mainTableData: [], // 主表数据
      mainTableOptions: [
        {field: 'accountid', label: '账户', align: 'left'},
        {field: 'investor_account_name', label: '账户名称', align: 'left'},
        {field: 'seat', label: 'PBU', align: 'left'},
        {field: 'branch_name', label: '营业部名称', align: 'left'},
        {field: 'instrumentid', label: '证券代码', align: 'left'},
        {field: 'instrument_chn_short_name', label: '证券名称', align: 'left'},
        {field: 'buysl', label: '综业转让买入数量', align: 'right'},
        {field: 'buyje', label: '综业转让买入金额', align: 'right'},
        {field: 'sellsl', label: '综业转让卖出数量', align: 'right'},
        {field: 'sellje', label: '综业转让卖出金额', align: 'right'},
        {field: 'ratio', label: '持股变动占总股本比例', align: 'right', formatter: this.gfnElColFormatDecThou3}
      ],
      // 主表分页
      currentPage: 1,
      pageSize: 20,
      isLoadMore: true,
      // 主表请求参数
      mainRequestParams: {}
    }
  },
  computed: {},
  watch: {},
  methods: {
// 获取查询结果
    fnGetQueryRes() {
      if ($.isEmptyObject(this.dateVal)) {
        this.$message.warning('请选择日期')
        return
      }
      this.isShowMainTable = true
      this.currentPage = 1
      this.getRes()
    },
    getRes() {
      this.mainRequestParams = {
        dateStart: this.dateVal[0],
        dateEnd: this.dateVal[1],
        creditType: this.statisticsWay,
        stockCode: this.stockCode,
        account: this.accountORUniteCodeVal,
        pageIndex: this.currentPage,
        pageRows: this.pageSize
      }
      this.queryResMainLoad = true
      getPrecedenceAccountData(this.mainRequestParams).then(resp => {
        let res = resp.bizData.metaData
        // 如果当前表格为第一页，则将返回结果直接赋值给表格data
        if (this.currentPage === 1) {
          this.mainTableData = res
          this.isLoadMore = true
        } else {
          // 如果非表格第一页，将返回结果拼接到表格数据后面
          this.mainTableData = this.mainTableData.concat(res)
          // 如果表格data数组长度与结果总条数相同，则说明数据已加载完毕，表格再次下拉到底不触发请求
          if (this.mainTableData.length === resp.bizData.totalRows) {
            this.isLoadMore = false
          }
        }
        this.changeTableOption(this.statisticsWay)
        this.queryResMainLoad = false
      })
    },
    // 统计方式change事件
    handleStatisticWayChange() {
      this.currentPage = 1
    },
    // 切换表格列设置
    changeTableOption(val) {
      switch (val) {
        case '1':
          if (this.mainTableOptions[0].field !== 'tradedate') {
            this.mainTableOptions.unshift({field: 'tradedate', label: '日期', align: 'left'})
          }
          break
        case '2':
          if (this.mainTableOptions[0].field === 'tradedate') {
            this.mainTableOptions.splice(0, 1)
          }
          break
      }
    },

    // 主表表格懒加载
    handleMainTableLoadMore() {
      if (this.isLoadMore) {
        this.currentPage += 1
        this.getRes()
      }
    },

    // 获取文件上传内容
    fnGetAccountGroupUploadCon(res) {
      let uploadNum = res.length
      if (uploadNum > 1000) {
        this.$message.error(`最多可指定1000个账户,您上传的文件包含${uploadNum}个账户`)
        return
      }
      this.accountORUniteCodeVal = res.join(',')
    },
    // 证券代码下拉val获取
    fnGetSelectRes(val) {
      this.stockCode = val.join(',')
    },
    // 证券代码获取txt文件内容
    fnGetStockTypeUploadCon(res) {
      this.selectParams.query = res
      this.$refs.selectLazyMultiple.getUploadSelectOptionCon(res)
    },
    // 主表导出
    saveMainTableLocation() {
      let params = this.mainRequestParams
      params['tableColumns'] = [{
        'sheetName': '优先股账户查询',
        'fileColumns': this.mainTableOptions
      }]
      delete params.pageIndex
      delete params.pageRows
      params['type'] = 'account'
      params['fileType'] = 'excel'
      this.$message.info('正在导出，请稍等~');
      this.gfnExportFileWithForm('/regularqry/preferred-stock/v1/export', params);
    }
  },
  created() {

  },
  mounted() {
    // 获取当前交易日
    getCurTradeDate().then(resp => {
      resp = moment(resp, 'YYYYMMDD').format('YYYY-MM-DD')
      this.dateVal = [resp, resp]
    })
  },
  beforeDestory() {

  }
}
</script>

<style lang='less' scoped>
  .account-query {

  }
</style>
