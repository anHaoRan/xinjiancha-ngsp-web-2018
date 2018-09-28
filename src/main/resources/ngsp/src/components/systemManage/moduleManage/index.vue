<template>
  <div class='module-manage'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-row :gutter='30'>
      <el-col :span='12' v-for='(item,index) in moduleList' :key='index'>
        <el-card>
          <div class='moduleInfo'>
            <img :src='item.moduleSketch' class='avatar'>
            <div class='name-descripe'>
              <p>
                <span>名称：</span>
                <span>{{item.moduleName}}</span>
              </p>
              <p>
                <span>描述：</span>
                <span>{{item.moduleDescription}}</span>
              </p>
              <p>
                <el-button @click='update(item)' type='primary'>修改</el-button>
                <el-button @click='remove(item.moduleCode,index)' type='primary'>删除</el-button>
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span='12'>
        <el-card>
          <div class='moduleInfo'>
            <el-button type='text' @click='openCreateModuleDialog' v-if='true' class='addbtn'>
              <i class='el-icon-plus avatar-uploader-icon'></i>
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-dialog title='模块管理' :visible.sync='dialogFormVisible'
                 :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <el-form :model='form' :rules="editFormRules" ref="form">
          <el-form-item label='模块代码' prop="moduleCode" :label-width='formLabelWidth'>
            <el-input v-model='form.moduleCode' auto-complete='off' :disabled="sign"></el-input>
          </el-form-item>
          <el-form-item label='模块名称' prop="moduleName" :label-width='formLabelWidth'>
            <el-input v-model='form.moduleName' auto-complete='off'></el-input>
          </el-form-item>
          <el-form-item label='模块描述' prop="moduleDescription" :label-width='formLabelWidth'>
            <el-input v-model='form.moduleDescription' type='textarea' auto-complete='off'></el-input>
          </el-form-item>
          <el-form-item label='模块URL' prop="moduleUri" :label-width='formLabelWidth'>
            <el-input v-model='form.moduleUri' auto-complete='off'></el-input>
          </el-form-item>
          <el-form-item label='缩略图' prop="moduleSketch" :label-width='formLabelWidth'>
            <el-upload
              class='avatar-uploader'
              action=''
              :show-file-list='false'
              :on-success='handleAvatarSuccess'
              :before-upload='beforeAvatarUpload'
            >
              <img :src='form.moduleSketch' class='avatar' v-if='form.moduleSketch'>
              <i class='el-icon-plus avatar-uploader-icon' v-else></i>
            </el-upload>
          </el-form-item>
          <el-form-item label='是否激活' prop="status" :label-width='formLabelWidth'>
            <el-switch
              style='display: block'
              v-model='form.status'
              active-color='#13ce66'
              inactive-color='#ff4949'
              :active-value="1"
              :inactive-value="-1"
              active-text='是'
              inactive-text='否'
            >
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button type='primary' @click='submit(sign)'>确 认</el-button>
          <el-button type='primary' @click='dialogFormVisible = false'>取 消</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import { requestPrefix } from '../../../utils/constants'
  import {
    postAddModule,
    postUpdateInfo,
    postDeleteInfo,
    getAllInfo
  } from './../../../service/systemManage/moduleManage'

  export default {
    components: {
      Breadcrumb
    },
    data () {
      return {
        breadcrumbItems: [{
          router: '',
          label: '系统管理'
        }, {
          router: '',
          label: '模块管理'
        }, {
          router: '/moduleManage',
          label: '模块管理'
        }],
        moduleList: [],
        // form表单
        dialogFormVisible: false,
        form: {
          moduleCode: '', // 模块代码
          moduleName: '', // 模块名字
          moduleDescription: '', // 模块描述
          moduleUri: '', // 模块地址
          status: 1, // 是否激活
          moduleSketch: '' // 缩略图
        },
        editFormRules: {
          moduleCode: [
            {required: true, message: '请输入模块代码', trigger: 'blur'}
          ],
          moduleName: [
            {required: true, message: '请输入模块名称', trigger: 'blur'}
          ],
          moduleUri: [
            {required: true, message: '请输入模块URI', trigger: 'blur'}
          ]
        },
        formLabelWidth: '80px',
        // 图片上传
        imageUrl: '',
        prefix: requestPrefix,
        flag: 'true',
        sign: false
      }
    },
    mounted () {
      this.loadModules()
    },
    methods: {
      openCreateModuleDialog() {
        this.sign = false
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
          this.form = {
            moduleCode: '', // 模块代码
              moduleName: '', // 模块名字
              moduleDescription: '', // 模块描述
              moduleUri: '', // 模块地址
              status: 1, // 是否激活
              moduleSketch: '' // 缩略图
          }
          setTimeout(() => {
            this.$refs['form'].clearValidate()
          })
        })
      },
      handleAvatarSuccess (res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload (file) {
        let that = this
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传图片只能是JPG格式')
        } else if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过2MB!')
        } else {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            that.form.moduleSketch = this.result
            that.imageUrl = that.form.moduleSketch
          }
        }
        return isJPG && isLt2M
      },
      loadModules () {
        getAllInfo().then((resp) => {
          this.moduleList = resp
        })
      },
      submit (sign) {
        // 确认按钮向后台传递添加的数据，同时往循环数据中添加一组数据
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.flag = false
            // let status = ''
            // if (this.form.status === true) {
            //   status = 1
            // } else {
            //   status = -1
            // }
            let params = {
              moduleCode: this.form.moduleCode,
              moduleName: this.form.moduleName,
              moduleDescription: this.form.moduleDescription,
              moduleUri: this.form.moduleUri,
              status: this.form.status,
              moduleSketch: this.form.moduleSketch
            }
            if (sign) {
              postUpdateInfo(JSON.stringify(params)).then((data) => {
                getAllInfo().then((resp) => {
                  this.moduleList = resp
                })
                // 请求成功后，清空表单
                this.form.moduleCode = ''
                this.form.moduleName = ''
                this.form.moduleDescription = ''
                this.form.moduleUri = ''
                this.form.status = 1
                this.form.moduleSketch = ''
                this.sign = false
              })
            } else {
              postAddModule(JSON.stringify(params)).then((data) => {
                getAllInfo().then((resp) => {
                  this.moduleList = resp
                })
                // 请求成功后，清空表单
                this.form.moduleCode = ''
                this.form.moduleName = ''
                this.form.moduleDescription = ''
                this.form.moduleUri = ''
                this.form.status = 1
                this.form.moduleSketch = ''
              })
            }
            this.dialogFormVisible = false
          } else {
            return false
          }
        })
      },
      update (item) {
        this.sign = true
        // if (item.status === 1) {
        //   item.status = true
        // } else {
        //   item.status = false
        // }
        this.form.moduleCode = item.moduleCode
        this.form.moduleName = item.moduleName
        this.form.moduleDescription = item.moduleDescription
        this.form.moduleUri = item.moduleUri
        this.form.status = item.status
        this.form.moduleSketch = item.moduleSketch
        this.dialogFormVisible = true
      },
      remove (code, index) {
        let params = {moduleCode: code}
        let _this = this
        this.$confirm('确认删除？').then(() => {
          postDeleteInfo(JSON.stringify(params)).then(resp => {
            this.loadModules()
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style lang='less'>
  /*图片上传样式*/
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #ffffff;
    text-align: center;
    line-height: 1.3;
  }

  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }

  .module-manage .moduleInfo {
    padding: 20px;
    display: flex;
    align-items: center;
    .name-descripe {
      margin-left: 20px;
      p {
        padding: 10px;
        span {
          font-size: 16px;
        }
      }
    }
  }

  .module-manage {
    .el-dialog {
      .el-textarea {
        width: 50%;
      }
      .el-input {
        width: 50%;
      }
    }
  }

  .module-manage .moduleInfo .el-button:nth-child(2) {
    background-color: #3d507a;
  }

  .module-manage .moduleInfo .el-button:nth-child(2):hover {
    background-color: #3a4c7a;
  }

  .module-manage .dialog-footer .el-button:nth-child(2) {
    background-color: #3d507a;
  }

  .module-manage .dialog-footer .el-button:nth-child(2):hover {
    background-color: #3a4c7a;
  }

  .module-manage .addbtn {
    border: none;
    position: relative;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
  }

  .module-manage .addbtn:hover {
    background-color: transparent;
  }

  .module-manage .el-dialog__wrapper .el-dialog__header {
    .el-dialog__title {
      color: #aec0e6
    }
  }

  .theme_dark .module-manage .el-dialog__wrapper .el-dialog__header {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .theme_light .module-manage .el-dialog__wrapper .el-dialog__header {
    background-color: #fff;
  }

  .theme_green .module-manage .el-dialog__wrapper .el-dialog__header {
    background-color: #eaf6e2;
  }

  .module-manage .avatar-uploader-icon {
    color: #1b5eed
  }

  .module-manage .el-dialog {
    width: 45%;
  }

  .module-manage .el-dialog .el-dialog__footer {
    text-align: center;
    padding-bottom: 30px;
  }

  .module-manage .el-dialog__wrapper .el-dialog__body .el-form-item {
    .el-form-item__label {
      color: #7b8fb9
    }
    .el-form-item__content {
      .el-switch {
        top: 9px
      }
    }
  }
</style>
