<template>
  <div class="double-per-dou-psw">
    <!--双人双密弹出框-->
    <el-dialog
      title="双人双密"
      :visible.sync="isDialogFormVisble"
      center
      width="550px">
      <el-form :model='towPTowPVal' :label-width="formLabelWidth" class="form-container" ref="towPTowPVal"
               :rules="rules" @keyup.enter.native="fnVeryfy">
        <el-form-item label="本机用户密码：" prop="password1">
          <el-input type="password" size="small" v-model="towPTowPVal.password1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="第二用户名称：" prop="username2">
          <el-input v-model="towPTowPVal.username2" size="small" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="第二用户密码：" prop="password2">
          <el-input type="password" size="small" v-model="towPTowPVal.password2" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="fnVeryfy" v-loading.fullscreen.lock="fullScreenLoading">确 定
        </el-button>
        <el-button type="info" size="small" @click="fnCancleVeryfy">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {twoPersonTwoPsw} from '../../service/analysisTool/productQuery'
  import {encryptByDES} from '../../utils/api'

  export default {
    name: 'double-per-dou-psw',
    props: {
      dialogFormVisble: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    // vue父子组件双向绑定
    computed: {
      isDialogFormVisble: {
        get: function () {
          return this.dialogFormVisble
        },
        set: function (val) {
          this.$emit('isShow', val)
        }
      }
    },
    data() {
      return {
        // 双人双密参数
        towPTowPVal: {
          password1: '',
          username2: '',
          password2: ''
        },
        rules: {
          password1: [{required: true, message: '请输入本用户密码', trigger: 'blur'}],
          username2: [{required: true, message: '请输入第二用户名称', trigger: 'blur'}],
          password2: [{required: true, message: '请输入第二用户密码', trigger: 'blur'}]
        },
        formLabelWidth: '140px',
        isPassInfo: false,
        fullScreenLoading: false
      }
    },
    mounted() {

    },
    methods: {
      // 双人双密验证
      fnVeryfy() {
        var userPsw = encryptByDES(this.towPTowPVal.password1)
        var selfPsw = encryptByDES(this.towPTowPVal.password2)
        // 验证请求参数
        const doublePsw = {
          password1: userPsw,
          password2: selfPsw,
          username2: this.towPTowPVal.username2
        }
        let currentUser = this.gfnGetUsername()
        if (doublePsw.username2 === currentUser) {
          this.$message.error('当前用户名称与第二用户名称重复，请重新输入')
          return
        }
        // 去除输入内容前后空格并验证是否为空
        if (this.towPTowPVal.password1.trim() === '' || this.towPTowPVal.username2.trim() === '' || this.towPTowPVal.password2.trim() === '') {
          this.$message({
            showClose: true,
            message: '密码或用户名不能为空',
            duration: 1000,
            type: 'error'
          })
        } else {
          // 发送验证请求
          this.fullScreenLoading = true
          twoPersonTwoPsw(doublePsw).then((resp) => {
            // 请求通过
            if (resp) {
              this.isDialogFormVisble = false
              this.towPTowPVal.password1 = ''
              this.towPTowPVal.username2 = ''
              this.towPTowPVal.password2 = ''
              this.isPassInfo = true
              // 请求失败
            } else {
              this.$message.error('用户/密码输入错误或用户被停用')
              this.isDialogFormVisble = true
              this.isPassInfo = false
            }

            this.fullScreenLoading = false
            this.$emit('isPass', this.isPassInfo)
          }, () => {
            this.fullScreenLoading = false
          })
        }
      },
      // 取消双人双密后弹出框内容清空
      fnCancleVeryfy() {
        this.towPTowPVal.password1 = ''
        this.towPTowPVal.username2 = ''
        this.towPTowPVal.password2 = ''
        this.isDialogFormVisble = false
        this.$emit('isPass', false)
      }
    }
  }
</script>

<style lang="less" scoped>
  .double-per-dou-psw {

    .form-container {
      width: 350px;
      margin-left: 50px;
    }

  }
</style>
