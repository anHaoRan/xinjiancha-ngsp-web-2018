
<template>
  <div class="slider-custom-list-wrap">
    <h4>{{currentDialogName === 'customPlateSetting' ? '我的自定义板块设置' : '我的自定义投资者设置'}}</h4>
    <!-- <el-input class="addBlockBox" size="mini" v-model="addBlockInput" clearable></el-input> -->
    <el-button type="primary" size="small" @click="showCreatedDialog">新建</el-button>
    <!--修改对话框-->
    <el-dialog width="50%" :title="`${currentMode === 'edit' ? '修改' : '新增'}`" :visible.sync="isEditBlockBox" append-to-body>
      <el-form label-width="130px" ref="ruleForm" :model="ruleForm" v-if="currentDialogName==='classifiedInvestorSetting'">
        <el-form-item
          label="投资者类别名称"
          prop="orgname"
          :rules="[{
            required: true, message: '请输入投资者类别名称'
         }, {pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]+$/, message: '只能输入数字、字母和汉字'}]">
          <el-input placeholder="请输入投资者类别名称（50字符以内）" size="mini" :maxLength="50" v-model="ruleForm.orgname" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="投资者类别代码"
          prop="orgcode"
          :rules="[
            {
              required: true, message: '请输入投资者类别代码'
            }, {pattern: /^[\w]+$/, message: '只能输入数字、字母和下划线'}]">
          <el-input placeholder="请输入投资者类别代码（32字符以内）" size="mini" :maxLength="32" v-model="ruleForm.orgcode" :disabled="currentMode==='edit'" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" ref="boardRuleForm" :model="boardRuleForm" v-if="currentDialogName==='customPlateSetting'">
        <el-form-item
          label="板块名称"
          prop="boardName"
          :rules="[{
            required: true, message: '请输入板块名称'
         }]">
          <el-input placeholder="请输入板块名称（50字符以内）" size="mini" :maxLength="50" v-model="boardRuleForm.boardName" clearable></el-input>
        </el-form-item>
        <el-form-item
          v-if="currentMode==='edit'"
          label="板块代码"
          prop="boardCode"
          :rules="[{
          required: true, message: '请输入板块代码'
        }]">
          <el-input placeholder="请输入板块代码（32字符以内）" size="mini" :maxLength="32" v-model="boardRuleForm.boardCode" :disabled="currentMode==='edit'" clearable></el-input>
        </el-form-item>
        <!--<el-form-item
          label="业务类型"
          prop="bizType"
          :rules="[{
          required: true, message: '请选择业务类型'
        }]">
          <el-radio-group v-model="boardRuleForm.bizType">
            <el-radio disabled v-for="(item, index) in bizTypeOptions" :key="index" :label="item.code">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item
          label="板块描述"
          prop="boardDescr">
          <el-input type="textarea" placeholder="请输入板块描述（100字符以内）" size="mini" :maxLength="100" v-model="boardRuleForm.boardDescr"  clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" size="small" @click="isEditBlockBox = false" >取消</el-button>
        <el-button type="primary" size="small" @click="handleEditBlock" >确定</el-button>
      </span>
    </el-dialog>
    <el-card class="custom-tree-box">
      <ul class="slider-custom-list"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)"
          v-loading="loadingProps">
        <li @click="handMenuItemClick(item)"
          v-for="(item, index) in sliderList"
          :class="{'activeItemClass': (item.orgcode && item.orgcode === getcurrentOrgCode) || (item.boardCode && item.boardCode === getcurrentBoardCode)}"
          :key="index"
          :index="String(index)">
          <template>
            <el-row @mouseover.native="handShowIcons(item, true)"
                    @mouseout.native="handShowIcons(item, false)">
              <el-col class="leftText" :span="18">{{item.orgname || item.boardName}}</el-col>
              <el-col class="rightIcons" :span="6">
                <i class="el-icon el-icon-edit" @click="showEditDialog(item)"></i>
                &nbsp;&nbsp;
                <i class="el-icon el-icon-delete" @click.stop.prevent="handleDeleteBlock(item)"></i>
              </el-col>
            </el-row>
          </template>
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {
  createClassifyinvestor,
  updateClassifyinvestor,
  deleteClassifyinvestor,
  createUserdefinedBoard,
  updateUserdefinedBoard,
  deleteUserdefinedBoard
} from '@/service/systemManage/securityPlateSet'
export default {
  data() {
    return {
      bizTypeOptions: [{
        code: 'NORMAL',
        name: 'NORMAL'
      }, {
        code: 'STBLTY',
        name: 'STBLTY'
      }],
      rules: {},
      sliderList: [],
      isDeleteBlockBox: false,
      isEditBlockBox: false,
      ruleForm: {
        orgcode: '',
        orgname: ''
      },
      boardRuleForm: {
        boardCode: '',
        boardName: '',
        bizType: 'NORMAL',
        boardDescr: ''
      },
      currentMode: 'edit' // created
    }
  },
  props: {
    currentDialogName: {
      type: String,
      required: true
    },
    sliderListProps: {
      type: Array,
      required: true
    },
    loadingProps: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    sliderListProps(newValue) {
      this.sliderList = newValue
    }
  },
  computed: {
    ...mapGetters(['getcurrentBoardCode', 'getcurrentOrgCode'])
  },
  methods: {
    handMenuItemClick(item) {
      if (this.currentDialogName === 'customPlateSetting') {
        this.$store.commit('updateCurrentBoardCode', item.boardCode)
        this.$emit('reqStockListByBoardCode', item)
      } else {
        this.$store.commit('updateCurrentOrgCode', item.orgcode)
        item.pageIndex = 1
        item.pageRows = 10
        item.isCover = true
        this.$emit('reqConnectinvestoraccounts', item)
      }
    },
    handShowIcons(item, flag) {
      flag ? item.showIcons = true : item.showIcons = false
    },
    showEditDialog(item) {
      this.isEditBlockBox = true
      this.currentMode = 'edit'
      if (this.currentDialogName === 'customPlateSetting') {
        this.boardRuleForm = JSON.parse(JSON.stringify(item))
      } else {
        this.ruleForm = JSON.parse(JSON.stringify(item))
      }
    },
    showCreatedDialog() {
      this.isEditBlockBox = true
      this.currentMode = 'created'
      this.ruleForm = {}
      this.boardRuleForm = {
        boardCode: '',
        boardName: '',
        bizType: 'NORMAL',
        boardDescr: ''
      }
      if (this.currentDialogName === 'customPlateSetting') {
        this.$nextTick(() => {
          this.$refs['boardRuleForm'].clearValidate()
        })
      } else {
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      }
    },
    handleEditBlock() {
      let formRef = this.currentDialogName === 'customPlateSetting' ? 'boardRuleForm' : 'ruleForm'
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          if (this.currentMode === 'created') {
            // add
            this.createNewInvestor()
          } else {
            // update
            this.updateInvestor()
          }
        }
      })
    },
    createNewInvestor() {
      if (this.currentDialogName === 'customPlateSetting') {
        createUserdefinedBoard(JSON.stringify(this.boardRuleForm)).then((resp) => {
          /* if (resp) {
            const {success, message} = resp
            if (success) {
              this.$message.success(message)
              this.isEditBlockBox = false;
              this.$emit('reqUserdefinedBoardList')
            } else {
              this.$message.error(message)
            }
          } else {
            this.$message.error('新建失败')
          } */
          this.isEditBlockBox = false
          this.$emit('reqUserdefinedBoardList')
          this.$message.info(resp)
        })
      } else {
        createClassifyinvestor(this.ruleForm).then(resp => {
          if (resp) {
            const {success, Message} = resp
            if (success) {
              this.$message.success(Message)
              this.isEditBlockBox = false
              this.$emit('reqClassifyinvestorList')
            } else {
              this.$message.error(Message)
            }
          } else {
            this.$message.error('新建失败')
          }
        })
      }
    },
    updateInvestor() {
      if (this.currentDialogName === 'customPlateSetting') {
        updateUserdefinedBoard(this.boardRuleForm).then(resp => {
          /* if (resp) {
            this.$message.success('修改成功')
            this.isEditBlockBox = false;
            this.$emit('reqUserdefinedBoardList')
          } else {
            this.$message.error('修改失败')
          } */
          this.$message.info(resp)
          this.isEditBlockBox = false
          this.$emit('reqUserdefinedBoardList')
        })
      } else {
        updateClassifyinvestor(this.ruleForm).then(resp => {
          if (resp) {
            this.$message.success('修改成功')
            this.isEditBlockBox = false
            this.$emit('reqClassifyinvestorList')
          } else {
            this.$message.error('修改失败')
          }
        })
      }
    },
    handleDeleteBlock(item) {
      if (this.currentDialogName === 'customPlateSetting') {
        this.$confirm(`确定删除“${item.boardName}”？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.boardRuleForm = JSON.parse(JSON.stringify(item))
          deleteUserdefinedBoard(this.boardRuleForm).then(resp => {
            /* if (resp) {
             this.$message.success('删除成功')
             this.$store.commit('updateCurrentBoardCode', '');
             this.$emit('reqUserdefinedBoardList')
             } else {
             this.$message.error('删除失败')
             } */
            this.$message.info(resp)
            this.$store.commit('updateCurrentBoardCode', '')
            this.$emit('reqUserdefinedBoardList')
          })
        }).catch(() => {})
      } else {
        this.$confirm(`确定删除“${item.orgname}”？如果删除自定义投资者类别, 属于该类别的账户关联信息也会被一并删除, 是否确定删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.ruleForm = JSON.parse(JSON.stringify(item))
          deleteClassifyinvestor(this.ruleForm).then(resp => {
            if (resp) {
              this.$message.success('删除成功')
              this.$store.commit('updateCurrentOrgCode', '')
              this.$emit('reqClassifyinvestorList')
            } else {
              this.$message.error('删除失败')
            }
          })
        })
      }
    }
  }
}

</script>
<style lang="less" scoped>
  .slider-custom-list-wrap {
    h4 {
      margin: 0 0 10px 0;
    }
    /deep/ .custom-tree-box {
      border: 1px solid #5e6063;
      height: 500px;
      overflow: auto;
      > div {
        padding: 0;
      }
      .slider-custom-list {
        list-style: none;
        padding: 0;
        li {
          height: 38px;
          line-height: 38px;
          padding: 0 20px;
          cursor: pointer;
          &:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }
          &.activeItemClass {
            background-color: rgba(255, 255, 255, 0.05);
          }
        }
        .leftText {
          text-align: left;
        }
        .rightIcons {
          text-align: right;
          font-size: 16px;
          i {
            color: #0a4bd6;
          }
        }
      }
    }
  }
</style>
