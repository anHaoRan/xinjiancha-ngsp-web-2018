<template>
  <div class="pauseTable">
    <el-row>
      <el-col :span="12" style="text-align:left">
        <h4>盘中暂停交易表</h4>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-button
                v-if="canExportTableInfo"
                type="primary"
                size="small"
                @click="downLoadSuspendTable"
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
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="pauseDate"
        label="暂停日期"
        width="160">
        <template slot-scope="scope">
          <el-date-picker
            :disabled="disabled"
            v-model="scope.row.pauseDate"
            type="date"
            size="small"
            style="width:100%"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="direction"
        label="方向"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-select v-model="scope.row.direction" placeholder="" size="small" :disabled="disabled" clearable>
            <el-option
              v-for="item in directionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="stocktype"
        label="品种"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.stocktype" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="oneword"
        label="一码通账户"
        width="180"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.oneword" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="accountName"
        label="账户名称"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.accountName" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="member"
        label="会员名称"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.member" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="salepart"
        label="营业部名称"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.salepart" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="involveStock"
        label="所涉证券"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.involveStock" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="abnormalBehav1"
        label="异常行为类型（一级分类）"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.abnormalBehav1" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="abnormalBehav2"
        label="异常行为类型（二级分类）"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.abnormalBehav2" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="behavDesc"
        label="行为描述"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.behavDesc" placeholder="" size="small" :disabled="disabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="isSerious"
        label="是否严重"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-select v-model="scope.row.isSerious" placeholder="" size="small" :disabled="disabled" clearable>
            <el-option
              v-for="item in seriousOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="recoverDate"
        label="恢复日期"
        width="160">
        <template slot-scope="scope">
          <el-date-picker
            :disabled="disabled"
            v-model="scope.row.recoverDate"
            type="date"
            size="small"
            style="width:100%"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="pauseReason"
        label="暂停原因"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-select :disabled="disabled" allow-create filterable clearable
                     v-model="scope.row.pauseReason" placeholder="" size="small">
            <el-option
              v-for="item in pauseReasonOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
        directionOptions: [{
          value: '买',
          label: '买'
        }, {
          value: '卖',
          label: '卖'
        }, {
          value: '卖/买',
          label: '卖/买'
        }],
        pauseReasonOptions: [{
          value: '递进式',
          label: '递进式'
        }, {
          value: '差异化',
          label: '差异化'
        }, {
          value: '维稳',
          label: '维稳'
        }, {
          value: '其他',
          label: '其他'
        }],
        seriousOptions: [{
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }]
      }
    },
    methods: {
      downLoadSuspendTable () {
        if (!this.tableData.length) {
          this.$message.error('暂无数据')
          return
        }
        let params = {
          'infoId': this.infoId
        }
        this.tableOptions = []
        this.tableOptions.push({label: '暂停日期', field: 'pauseDate', width: '120', align: 'left', isShow: true},
        {label: '方向', field: 'direction', width: '120', align: 'left', isShow: true},
        {label: '品种', field: 'stocktype', width: '120', align: 'left', isShow: true},
        {label: '一码通账户', field: 'oneword', width: '120', align: 'left', isShow: true},

        {label: '账户名称', field: 'accountName', width: '120', align: 'left', isShow: true},
        {label: '会员名称', field: 'member', width: '120', align: 'left', isShow: true},
        {label: '营业部名称', field: 'salepart', width: '120', align: 'left', isShow: true},
        {label: '所涉证券', field: 'involveStock', width: '120', align: 'left', isShow: true},
        {label: '异常行为类型(一级分类)', field: 'abnormalBehav1', width: '120', align: 'left', isShow: true},
        {label: '异常行为类型(二级分类)', field: 'abnormalBehav2', width: '120', align: 'left', isShow: true},

        {label: '行为描述', field: 'behavDesc', width: '120', align: 'left', isShow: true},
        {label: '是否严重', field: 'isSerious', width: '120', align: 'left', isShow: true},
        {label: '恢复日期', field: 'recoverDate', width: '120', align: 'left', isShow: true},
        {label: '暂停原因', field: 'pauseReason', width: '120', align: 'left', isShow: true},)
        params['tableColumns'] = this.tableOptions
        this.gfnExportFileWithForm('/bpm/pausetrade/export', params)
      }
    }
  }
</script>
