<!--账户代码模糊搜索组件-->
<template>
  <el-row class="fazzySearchSelectComponent">
    <el-col :span="6" style="width:150px;font-size:15px;" v-if="showLabel">请输入{{propsName}}代码</el-col>
    <el-col :span="10">
      <el-select
        ref="selectRef"
        style="display:inline-block;width:200px"
        class="el-select-width"
        :clearable="true"
        v-model="accountCodeModel"
        filterable
        remote
        reserve-keyword
        :placeholder="`请输入${propsName}代码`"
        :remote-method="remoteMethod"
        :loading="loading"
        size="small"
        @clear="handleClearEvent"
        @keyup.enter.native="addNewInvestor">
        <el-option
          v-for="item in accountInfoOptions"
          :key="item[propsCode]"
          :label="`${item[propsLabel]}  ${item[propsCode]}`"
          :value="item[propsCode]">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="3" v-if="hasButtonGroupProps" style="float:right;text-align:right">
      <el-button size="small" type="primary" @click="addNewInvestor" :disabled="auto">增加</el-button>
      <el-button size="small" type="primary" @click="deleteAccount" :disabled="auto">删除</el-button>
    </el-col>
  </el-row>
</template>

<script>
  import {
    postAccountGroupNew,
    removeAccountFromGroup
  } from '@/service/systemManage/securityPlateSet'

  export default {
    name: 'fazzySearchSelectComponent',
    props: {
      showLabel: {
        type: Boolean,
        default: false
      },
      propsName: {
        type: String,
        default: ''
      },
      propsLabel: {
        type: String,
        default: ''
      },
      propsCode: {
        type: String,
        default: ''
      },
      propsAccountCodeModel: {
        type: String,
        default: ''
      },
      hasAddAccountsProps: {
        type: Array,
        default () {
          return []
        }
      },
      currentSelectedItemProps: {
        type: Object,
        default () {
          return {}
        }
      },
      hasButtonGroupProps: {
        type: Boolean,
        default: false
      }
    },
    data () {
      let {auto} = this.$route.query
      return {
        loading: false,
        accountCodeModel: '', // select model
        accountInfoOptions: [],
        auto: auto == 'true' // 自动维护
      }
    },
    watch: {
      propsAccountCodeModel (newValue) {
        this.accountCodeModel = newValue
      },
      accountCodeModel (newValue) {
        this.$emit('updateSelectModel', newValue)
      }
    },
    computed: {},
    methods: {
      handleClearEvent() {
        this.accountCodeModel = ''
        this.accountInfoOptions = []
      },
      deleteAccount () {
        if (!this.currentSelectedItemProps.account_id) {
          this.$message.error('请选择一条账户')
          return
        }
        this.$confirm(`确定删除账户名称为：${this.currentSelectedItemProps.investor_account_name}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            groupID: this.$route.query.groupID,
            accountID: this.currentSelectedItemProps.account_id
          }
          removeAccountFromGroup(JSON.stringify(params)).then(resp => {
            if (resp && resp.buzidata === 1) {
              this.$message.success('删除成功')
              this.$emit('updateList')
            }
          })
        }).catch(() => {})
      },
      getOptions (query) {
        this.$emit('getOptions', query)
      },
      remoteMethod (query) {
        if (query.trim() !== '') {
          this.getOptions(query.trim())
        } else {
          this.accountInfoOptions = []
        }
      },
      addNewInvestor () {
        if (!this.hasButtonGroupProps) {
          return
        }
        this.$refs['selectRef'].blur()
        let hasAddAccountsCodeList = this.hasAddAccountsProps.map(v => {
          return v.account_id
        })
        if (!this.accountCodeModel) {
          this.$message.error('请先通过模糊匹配选择一个账号代码')
          return
        }
        if (hasAddAccountsCodeList.indexOf(this.accountCodeModel) < 0) {
          let params = {
            accountID: this.accountCodeModel,
            groupID: this.$route.query.groupID
          }
          postAccountGroupNew(JSON.stringify(params)).then(resp => {
            if (resp) {
              this.$message.success('新增账号成功')
              this.accountCode = ''
              this.$emit('updateList')
            }
          })
        } else {
          this.$message.error('该账号已经添加')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .fazzySearchSelectComponent {
    line-height: 38px;
    .el-col {
      /deep/ .el-select {
        /deep/ .el-input {
          width: 100%;
        }
      }
    }
  }
</style>
