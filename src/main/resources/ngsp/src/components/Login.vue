<template>
  <div class="bg-1">
    <div class="login-box">
      <img class="logo" src="../assets/images/logo_red.png"/>
      <div class="title">
        <div>新监察业务管理系统</div>
        <div class="subtitle">New Generator Supervisor Platform</div>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormId" class="login-form" @keyup.enter.native="submitForm('loginFormId')">
        <div class="login-hint">{{loginHint}}</div>
        <el-form-item prop="username">
          <div class="input-area">
            <div class="icon-box">
              <i class="fa fa-user-o"></i>
            </div>
            <el-input placeholder="请输入用户名" v-model="loginForm.username" size="large" @focus="changeVal">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div class='input-area'>
            <div class="icon-box">
              <i class="fa fa-key"></i>
            </div>
            <el-input placeholder="请输入密码" type="password" v-model="loginForm.password" size="large" @focus="changeVal">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="submitForm('loginFormId')" v-loading.fullscreen.lock="fullScreenLoading" size="large">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { login } from '../service/login'
  import { loginAgain } from '../service/topbar'
  import { saveAuthedInfos, saveRealName } from './../utils/storageUtil'
  import '../assets/fonts/iconFont/iconfont.css'

  export default {
    data () {
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else {
          this.loginHint = ''
          callback()
        }
      }
      let validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          this.loginHint = ''
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ],
          password: [
            {validator: validatePassword, trigger: 'blur'}
          ]
        },
        loginHint: '',
        fullScreenLoading: false
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getLogin()
          }
        })
      },
      getLogin () {
        let data = {
          username: this.loginForm.username.toLowerCase(),
          password: this.loginForm.password
        }
        this.fullScreenLoading = true
        let that = this
        login(data).then((resp) => {
          saveAuthedInfos(resp.data, this.loginForm.username.toLowerCase())
          loginAgain().then(res => {
            saveRealName(res)
            let redirect = decodeURIComponent(this.$router.currentRoute.query.redirect || '/index')
            that.fullScreenLoading = false
            this.$router.push({path: redirect})
          }, () => {
            this.fullScreenLoading = false
          })
        }, () => {
          this.fullScreenLoading = false
          this.loginHint = '用户名/密码 验证不通过!'
        })
      },
      changeVal () {
        this.loginHint = ''
      }
    }
  }
</script>

<style scoped lang="less">
  .bg-1 {
    background: url('../assets/images/bg_login.jpg');
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;
    height: 100%;
    position: absolute;
    width: 100%;
    .input-area {
      width: 100%;
      height: 40px;
      position: relative;
      background-color: transparent;
      overflow: hidden;
      border-radius: 4px;
      .icon-box {
        color: #878d99;
        width: 56px;
        height: 40px;
        box-sizing: border-box;
        background-color: #f5f7fa;
        border: 1px solid #d8dce5;
        border-right: none;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 4px 0 0 4px;
        z-index: 2;
      }
      .el-input {
        width: 268px;
        float: left;
        border-left: 1px solid #d8dce5;
        border-radius: 0 !important;
        margin-left: -1px;
        position: absolute;
        padding-left: 20px;
        top: 0;
        right: 0;
        /*padding:0 15px 0;*/
        .el-input__inner {
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
          width: 231px;
          height: 38px;
          background-color: transparent;
        }
      }
    }
    .login-box {
      margin-top: 170px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 5px;
      background: rgba(0, 24, 69, 0.5);
      position: relative;
      text-align: center;
      width: 500px;
      height: 400px;
      .logo {
        height: 80px;
        width: 80px;
        text-align: center;
        margin-top: -40px;
      }
      .title {
        padding: 20px 0 10px 0;
        color: #fff;
        text-align: center;
        font-size: 35px;
        .subtitle {
          font-size: 18px;
          text-align: center;
        }
      }

      .login-form {
        margin-top: 10px;
        width: 320px;
        margin-left: 90px;
        color: #333;
        font-family: "microsoft Yahei";
        .login-hint {
          padding-bottom: 5px;
          color: #ff9090;
          text-align: left;
          font-weight: normal;
          height: 45px;
          line-height: 20px;
          display: table-cell;
          vertical-align: bottom;
        }
        .login-btn {
          width: 100%;
        }
      }
    }

    .login-area {
      height: 100%;
      position: relative;
      .input-area {
        width: 30%;
        min-width: 340px;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        background-color: #e0f0ff;
        z-index: 100;
        .input-area-content {
          position: absolute;
          top: 40%;
          margin-top: -120px;
        }
      }
      .image-area {
        width: 70%;
        height: 100%;
        position: fixed;
        left: 30%;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 10;
        .title {
          position: absolute;
          top: 60%;
          left: 100px;
          font-size: 36px;
          color: #ffffff;
          z-index: 20;
          letter-spacing: 6px;
        }
      }
    }
  }
</style>
