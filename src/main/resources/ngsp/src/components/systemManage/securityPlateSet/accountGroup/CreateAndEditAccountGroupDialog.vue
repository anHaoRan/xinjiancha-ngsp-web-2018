<template>
  <el-dialog class="createAndEditAccountGroupDialog"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :title="`${currentMode==='create' ? '新增' : '修改'}账户组`"
             :visible.sync="showDialog" width="60%" left>
    <el-row>
      <el-form ref="ruleForm" :model="ruleForm" label-width="130px">
        <el-form-item prop="accountGroupName" label="账户组名称："
                      :rules="[{
          required: true, message:'请输入账户组名称'
        }]">
          <el-input
            v-model="ruleForm.accountGroupName"
            auto-complete="off"
            placeholder="请输入账户组名称(不超过16个字符)"
            :maxLength="16"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item prop="accountGroupDesc" label="账户组描述：">
          <el-input
            type="textarea"
            v-model="ruleForm.accountGroupDesc"
            auto-complete="off"
            placeholder="请输入账户组描述(不超过128个字符)"
            :maxLength="128"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item prop="accountType" label="账户组类型">
          <el-select
            clearable
            v-model="ruleForm.accountTypeId"
            placeholder="请选择账户组类型"
            size="small">
            <el-option
              v-for="item in accountTypeOptionsProps"
              :key="item.type_id"
              :label="item.type_name"
              :value="item.type_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="fundCode" label="证券代码">
          <!--          <lazy-load-select-component
                      ref="lazyLoadSelectComponentRef"
                      :labelProps="`instrument_chn_short_name`"
                      :valueProps="`instrument_id`"
                      :selectModelProps="ruleForm.fundCode"
                      @updateSelectModel="updateFundCodeSelectModel"
                    ></lazy-load-select-component>-->
          <fazzy-search-select-component
            ref="fazzySearchSelectRef"
            :propsName="`证券`"
            :propsCode="`security_id`"
            :propsLabel="`security_chn_short_name`"
            :hasButtonGroupProps="false"
            :propsAccountCodeModel="ruleForm.fundCode"
            @getOptions="getSelectOptions"
            @updateSelectModel="updateFundCodeSelectModel"
          ></fazzy-search-select-component>
        </el-form-item>
        <el-form-item prop="createTime" label="账户组创建时间：">
          <el-input
            disabled
            v-model="ruleForm.createTime"
            auto-complete="off"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item prop="modifyTime" label="账户组修改时间：">
          <el-input
            disabled
            v-model="ruleForm.modifyTime"
            auto-complete="off"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item prop="invalTime" label="账户组生效时间：">
          <el-input
            :disabled="true"
            v-model="ruleForm.invalTime"
            auto-complete="off"
            size="small">
          </el-input>
        </el-form-item>
        <!--<el-form-item prop="mem_code" label="实际操控人：" v-if="currentMode==='edit'">
          <el-input
            v-model="ruleForm.memCode"
            auto-complete="off"
            size="small">
          </el-input>
        </el-form-item>-->
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSave">确认</el-button>
        <el-button type="text" size="small" @click="handleCancel">取消</el-button>
      </div>
    </el-row>
  </el-dialog>
</template>
<script>
  import {
    postCreateAccountGroupAdd, // 新增
    postCreateAccountGroupAmend, // 修改
    searchStockCodeListByCharsAndSubTypeCode
  } from '@/service/systemManage/securityPlateSet'
  import LazyLoadSelectComponent from './LazyLoadSelectComponent'
  import FazzySearchSelectComponent from './FazzySearchSelectComponent'

  export default {
    data () {
      return {
        rules: {},
        ruleForm: {},
        showDialog: false,
        currentMode: 'create'
      }
    },
    components: {
      LazyLoadSelectComponent,
      FazzySearchSelectComponent
    },
    props: {
      currentModeProps: {
        type: String,
        default: 'create'
      },
      ruleFormProps: {
        type: Object,
        default () {
          return {}
        }
      },
      accountTypeOptionsProps: {
        type: Array,
        default () {
          return []
        }
      }
    },
    watch: {
      currentModeProps (newValue) {
        this.currentMode = newValue
      },
      ruleFormProps (newValue) {
        this.ruleForm = newValue
      }
    },
    methods: {
      getSelectOptions (query) {
        this.$refs['fazzySearchSelectRef'].loading = true
        let params = {
          fuzzyChars: query,
          secSubTypecode: ''
        }
        setTimeout(() => {
          searchStockCodeListByCharsAndSubTypeCode(params).then((resp) => {
            this.$refs['fazzySearchSelectRef'].loading = false
            if (resp) {
              this.$refs['fazzySearchSelectRef'].accountInfoOptions = resp
            }
          })
        }, 200)
      },
      updateFundCodeSelectModel (newValue) {
        this.ruleForm.fundCode = newValue
      },
      handleSave () {
        if (!this.ruleForm.accountGroupName.trim()) {
          this.$message.error('账户组名称不能为空!')
          return
        }
        this.$refs['ruleForm'].validate((valid) => {
          let params = {
            groupName: this.ruleForm.accountGroupName, // 账户组名称
            groupDesc: this.ruleForm.accountGroupDesc, // 账户组描述
            typeID: this.ruleForm.accountTypeId, // 账户组类型id
            fundCode: this.ruleForm.fundCode // 证劵代码
          }
          if (valid) {
            if (this.currentMode === 'create') {
              postCreateAccountGroupAdd(JSON.stringify(params)).then((resp) => {
                if (resp) {
                  const {success, message} = resp
                  if (success) {
                    this.$message.success('新建成功')
                    this.showDialog = false
                    this.$emit('getAllAccountGroupList')
                  } else {
                    this.$message.error(message)
                  }
                }
              })
            } else {
              params.id = this.ruleForm.accountGroupId // 账户组id
              params.memCode = this.ruleForm.memCode
              postCreateAccountGroupAmend(JSON.stringify(params)).then((resp) => {
                if (resp) {
                  this.$message.success('修改成功!')
                  this.showDialog = false
                  this.$emit('getAllAccountGroupList')
                }
              })
            }
          }
        })
      },
      handleCancel () {
        this.showDialog = false
      }
    },
    mounted () {

    }
  }
</script>
<style lang="less" scoped>
  .createAndEditAccountGroupDialog {
    .dialog-footer {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
</style>
