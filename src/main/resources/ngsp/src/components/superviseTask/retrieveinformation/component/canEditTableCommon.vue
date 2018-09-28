<template>
  <el-table
    v-loading="loading"
    element-loading-text="数据加载中，请耐心等待..."
    element-loading-background="rgba(0,0,0,0.3)"
    style="margin-top:10px;"
    :height="235"
    :data="tableData"
    ref="multipleTable"
    @selection-change="handleSelectionChange"
    :fit=true
    border>
    <el-table-column
      type="selection"
      align="center"
      width="50"
    ></el-table-column>
    <el-table-column
      prop="accountCode"
      label="账户代码"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <el-input :disabled="disabled" v-model="scope.row.accountCode" placeholder="回车搜索账户信息" size="small"
                  @keyup.enter.native="searchAccount(scope.$index,scope.row)"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="accountName"
      label="账户名称"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <el-input :disabled="disabled" v-model="scope.row.accountName" placeholder="" size="small"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="member"
      label="会员名称"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <el-input :disabled="disabled" v-model="scope.row.member" placeholder="" size="small"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="salepart"
      label="营业部名称"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <el-input :disabled="disabled" v-model="scope.row.salepart" placeholder="" size="small"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="oneword"
      label="一码通"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <el-input :disabled="disabled" v-model="scope.row.oneword" placeholder="" size="small"></el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="assortment"
      label="产品账户"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <el-select :disabled="disabled" v-model="scope.row.assortment" placeholder="" size="small">
          <el-option
            v-for="item in assortmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="middlePushCan"
      label="是否可推送中间库"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <el-select :disabled="disabled" v-model="scope.row.middlePushCan" placeholder="" size="small">
          <el-option
            v-for="item in middlePushCanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
    </el-table-column>
  </el-table>
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
      }
    },
    data() {
      return {
        assortmentOptions: [{
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }],
        middlePushCanOptions: [{
          value: '可以',
          label: '可以'
        }, {
          value: '不可',
          label: '不可'
        }]
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.$emit('handleSelectionChange', val)
      },
      searchAccount(index, row) {
        if (!row.accountCode) {
          this.$message.error('请输入证券账户！')
          return
        }
        let isHas = this.tableData.filter(v => {
          return v.accountCode === row.accountCode && v.oneword
        }).length
        if (isHas) {
          this.$message.error('输入证券账户重复！')
          row.accountCode = ''
        } else {
          this.$emit('updateAccountInfoByAccounts', [row.accountCode], 1) // 标识从enter触发的事件
        }
      }
    }
  }
</script>
