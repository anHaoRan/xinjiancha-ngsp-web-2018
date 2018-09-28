<template>
  <div class="editMoitoringObjectDialog">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${currentMode === 'create' ? '新增' : '修改'}系統监控参数`" :visible.sync="showDialog" width="70%">
      <el-form ref="ruleForm" :model="ruleForm" label-width="130px">
        <el-form-item prop="watchOBID" label="监控对象标识："
                      :rules="[{
                required: true, message: '请输入监控对象标识'
              }]">
          <el-input
            placeholder="请输入监控对象标识(不超过16个字符)"
            :maxLength="16"
            :disabled="currentMode === 'edit'"
            v-model="ruleForm.watchOBID"
            auto-complete="off"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item prop="watchOBName" label="监控对象名称："
                      :rules="[{
                required: true, message: '请输入监控对象名称'
              }]">
          <el-input
            placeholder="请输入监控对象名称(不超过16个字符)"
            :maxLength="16"
            v-model="ruleForm.watchOBName"
            auto-complete="off"
            size="small">
          </el-input>
        </el-form-item>
        <el-form-item prop="watchOBDesc" label="监控对象描述：">
          <el-input
            placeholder="请输入监控对象描述(不超过128个字符)"
            :maxLength="128"
            v-model="ruleForm.watchOBDesc"
            auto-complete="off"
            size="small">
          </el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="saveForm">确认</el-button>
        <el-button type="text" size="samll" @click="showDialog = false">取消</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
  import {
    postSearchWatchobjectListAdd, // 新增
    postSearchWatchobjectListAmend // 修改
  } from '@/service/systemManage/securityPlateSet'

  export default {
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
      }
    },
    data () {
      return {
        showDialog: false,
        ruleForm: {
          watchOBID: '',
          watchOBName: '',
          watchOBDesc: ''
        },
        currentMode: 'create',
        rules: {}
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
      saveForm () {
        this.$refs['ruleForm'].validate((valid) => {
          let params = {
            watchOBID: this.ruleForm.watchOBID,
            watchOBName: this.ruleForm.watchOBName,
            watchOBDesc: this.ruleForm.watchOBDesc
          }
          if (valid) {
            if (this.currentMode === 'create') {
              postSearchWatchobjectListAdd(JSON.stringify(params)).then((resp) => {
                if (resp) {
                  const {Message, success} = resp
                  if (success) {
                    this.showDialog = false
                    this.$emit('updateList')
                    this.$message.success(Message)
                  } else {
                    this.$message.error(Message)
                  }
                }
              })
            } else {
              postSearchWatchobjectListAmend(JSON.stringify(params)).then((resp) => {
                if (resp) {
                  this.$message.success('修改成功!')
                  this.showDialog = false
                  this.$emit('updateList')
                }
              })
            }
          }
        })
      },
      mounted () {
        this.ruleForm = JSON.parse(JSON.stringify(this.ruleFormProps))
      }
    }
  }
</script>
<style lang="less" scoped>
  .editMoitoringObjectDialog {
    .dialog-footer {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
</style>
