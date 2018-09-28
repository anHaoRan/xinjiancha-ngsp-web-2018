<template>
  <div class="limitTable">
    <el-row>
      <el-col :span="12" style="text-align:left">
        <h4>限制交易表</h4>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-button
                v-if="canExportTableInfo"
                type="primary"
                size="small"
                @click="downLoadLimitTable"
        >下载</el-button>
      </el-col>
    </el-row>
    <el-table
      style="margin-top:10px;"
      v-loading="loading"
      element-loading-text="数据加载中，请耐心等待..."
      element-loading-background="rgba(0,0,0,0.3)"
      :data="tableData"
      :height="290"
      :fit=true
      border>
      <el-table-column
        type="index"
        width="50"
        label="序号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="accountName"
        label="证券账户"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.accountName" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="accountUser"
        label="开户人"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.accountUser" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="salepart"
        label="证券账户所在营业部"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.salepart" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="punishTime"
        label="处分决定时间"
        width="160">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.punishTime" type="date" size="small" style="width:100%"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"
                          :disabled="disabled">

          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="punishReason"
        label="处分事由"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.punishReason" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>

      <el-table-column
        prop="restrictTime"
        label="限制交易时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.restrictTime" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="violation"
        label="违规事实"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.violation" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="punishScheme"
        label="处分内容"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.punishScheme" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="accountCode"
        label="证券代码"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.accountCode" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="processPerson"
        label="处理人"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.processPerson" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="stockTrader"
        label="券商"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.stockTrader" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="idcard"
        label="相关证件号码"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.idcard" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="documentNo"
        label="相关文号"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.documentNo" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="punishDocument"
        label="处罚决定书名称"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.punishDocument" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      },
      loading: {
        type: Boolean,
        default: false
      },
      infoId: {
        type: String,
        default: ''
      },
      canExportTableInfo: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
      }
    },
    methods: {
      downLoadLimitTable () {
        if (!this.tableData.length) {
          this.$message.error('暂无数据')
          return
        }
        let params = {
          'infoId': this.infoId
        }
        this.tableOptions = []
        this.tableOptions.push({label: '证券账户', field: 'accountName', width: '120', align: 'left', isShow: true},
        {label: '开户人', field: 'accountUser', width: '120', align: 'left', isShow: true},
        {label: '证券账户所在营业地', field: 'salepart', width: '120', align: 'left', isShow: true},
        {label: '处分决定时间', field: 'punishTime', width: '120', align: 'left', isShow: true},

        {label: '处分是由', field: 'punishReason', width: '120', align: 'left', isShow: true},
        {label: '限制交易时间', field: 'restrictTime', width: '120', align: 'left', isShow: true},
        {label: '违规事实', field: 'violation', width: '120', align: 'left', isShow: true},
        {label: '处分内容', field: 'punishScheme', width: '120', align: 'left', isShow: true},
        {label: '证券代码', field: 'accountCode', width: '120', align: 'left', isShow: true},
        {label: '处理人', field: 'processPerson', width: '120', align: 'left', isShow: true},

        {label: '券商', field: 'stockTrader', width: '120', align: 'left', isShow: true},
        {label: '相关证件号码', field: 'idcard', width: '120', align: 'left', isShow: true},
        {label: '相关文号', field: 'documentNo', width: '120', align: 'left', isShow: true},
        {label: '处罚决定书名称', field: 'punishDocument', width: '120', align: 'left', isShow: true},)
        params['tableColumns'] = this.tableOptions
        this.gfnExportFileWithForm('/bpm/limittrade/export', params)
      }
    }
  }
</script>
