<template>
  <el-dialog class="batchOperationDialog"
             title="批量操作账户组参数"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :visible.sync="showDialog" width="60%" left>
    <el-form ref="ruleForm" :model="ruleForm" label-width="130px">
      <el-form-item prop="accountType" label="账户组类型">
        <el-select
          clearable
          v-model="ruleForm.accountTypeId"
          placeholder="请选择账户组类型"
          size="small">
          <el-option
            v-for="item in accountTypeOptions"
            :key="item.type_id"
            :label="item.type_name"
            :value="item.type_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户组创建时间">
        <el-input disabled size="small" v-model="currentTime" style="width:195px;"></el-input>
      </el-form-item>
      <el-form-item label="上传文件">
        <file-upload
          ref="fileUploadSeverRef"
          @getTxtCon="getTxtCon"
          :actionUrl="gfnGetUploadFlatReturnPojoUrl()"
          :uploadParams="{
            parseRule: JSON.stringify(
              {
                delimiter: ',',
                fields: ['acctgrpName', 'acctNo', 'secrityCode']
              }
            )
          }"
        ></file-upload>
      </el-form-item>
    </el-form>
    <div class="button-group">
      <el-button size="small" type="primary" @click="handleSave">保存</el-button>
      <el-button size="small" type="info" @click="handleDelete">批量删除</el-button>
      <el-button size="small" type="info" @click="closeDialog">返回</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import moment from 'moment'
  import {
    postUserGroupType, // 账户组设置 - 账户组类型下拉框
    deleteAcctgrpBytype, // 批量删除
    insertAccountGroups // 批量导入
  } from '@/service/systemManage/securityPlateSet'
  import FileUpload from '@/components/common/UploadFileToServer'

  export default {
    components: {
      FileUpload
    },
    data () {
      return {
        showDialog: false,
        ruleForm: {
          accountTypeId: ''
        },
        uploadFileList: [],
        accountTypeOptions: [],
        currentTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
      getTxtCon (value) {
        if (value && value.length) {
          this.uploadFileList = value
        }
      },
      closeDialog () {
        this.showDialog = false
        this.$emit('updateData')
        this.$nextTick(() => {
          this.$refs['fileUploadSeverRef'].$refs['upload'].clearFiles()
          this.uploadFileList = []
        })
      },
      handleSave () {
        if (!this.ruleForm.accountTypeId) {
          this.$message.error('请选择账户组类型')
          return
        }
        let params = {
          acctgrpTypeId: this.ruleForm.accountTypeId,
          acctgrpArr: this.uploadFileList
        }
        insertAccountGroups(JSON.stringify(params)).then(res => {
          const {success, message} = res
          if (success) {
            this.$message.success(message)
          } else {
            this.$message.error(message)
          }
        })
      },
      handleDelete () {
        if (!this.ruleForm.accountTypeId) {
          this.$message.error('请选择账户组类型')
          return
        }
        let params = {
          typeId: this.ruleForm.accountTypeId
        }
        this.$confirm(`确定批量删除账户组？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          deleteAcctgrpBytype(params).then(res => {
            const {success, message} = res
            if (success) {
              this.$message.success(`批量删除账户组操作成功`)
              this.$emit('updateData')
            } else {
              this.$message.error(message)
            }
          })
        }).catch(() => {})
      },
      // 账户组设置 - 账户组类型下拉框(非自动维护)
      getAccountTypeOptionsByN () {
        postUserGroupType({isMaintenance: 'N'}).then((resp) => {
          if (resp) {
            const {buzidata} = resp
            this.accountTypeOptions = buzidata
          } else {
            this.accountTypeOptions = []
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .batchOperationDialog {
    .button-group {
      text-align: right;
    }
  }
</style>
