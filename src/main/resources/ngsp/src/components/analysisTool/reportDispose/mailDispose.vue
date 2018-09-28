<template>
  <div class='mailDispose'>
    <!--<div>-->
    <!--<el-card>-->
    <!--<el-form :inline='true' :model='mailDisposeParams' ref='mailDisposeParams' class='dialogForm' label-width='150px'-->
    <!--label-position='left'>-->
    <!--<el-row :gutter='20'>-->
    <!--<el-col :span='24'>-->
    <!--<el-form-item label='邮件存放路径选择：'>-->
    <!--<el-input v-model='mailDisposeParams.mailPath' size='small'></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--</el-form>-->
    <!--</el-card>-->
    <!--</div>-->
    <el-card style='overflow: visible' class='el-card-table'>
      <el-tabs v-model='activeName' type='card'>
        <el-tab-pane label='发送邮件' name='first'>
          <div>
            <el-form :inline='true' :model='sendMailParams' ref='sendMailParams' class='dialogForm' label-width='60px'
                     label-position='left'>
              <el-row :gutter='20'>
                <el-col :span='24'>
                  <el-form-item label=''>
                    <el-button type='primary' size='small'>发送</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label='收件人'>
                    <el-input v-model='sendMailParams.receiver' size='small'></el-input>
                    <i class='el-icon-circle-plus' @click='receiverAdd'></i>
                    <div class='mailWrap' v-if='isReceiverShow'>
                      <el-checkbox-group v-model='checkedList'>
                        <el-checkbox
                          v-for='item in receiverList'
                          :label='item'
                          :key='item'
                        >
                          {{item}}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label='发件人'>
                    <el-input v-model='sendMailParams.addresser' size='small'></el-input>
                    <i class='el-icon-circle-plus' @click='addresserAdd'></i>
                    <div class='mailWrap' v-if='isAddresserShow'>
                      <el-checkbox-group v-model='checkedList'>
                        <el-checkbox
                          v-for='item in receiverList'
                          :label='item'
                          :key='item'
                        >
                          {{item}}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label='类型'>
                    <el-radio v-model='sendMailParams.mailType' label='1'>日报</el-radio>
                    <el-radio v-model='sendMailParams.mailType' label='2'>周报</el-radio>
                    <el-radio v-model='sendMailParams.mailType' label='3'>月报</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-form-item label='标题'>
                    <el-input v-model='sendMailParams.mailTitle' size='small'></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label='邮件组配置' name='second'>
          <div style='text-align: right;padding: 10px'>
            <el-button type='primary' size='small'>新增</el-button>
          </div>
          <el-table
            :data='mailsData'
            border
            tooltip-effect='dark'
            size='small'
            highlight-current-row
            max-height='400'
            :reserve-selection='true'
            style='width: 100%'>
            <el-table-column
              v-for='column in mailsColumns'
              :key='column.field'
              :align='column.align'
              :prop='column.field'
              :label='column.label'
              :min-width='column.minWidth'>
            </el-table-column>
            <el-table-column
              min-width='6%'
              align='center'
              label='操作'>
              <template slot-scope='scope'>
                <el-button @click='editMail(scope.row)' type='text' size='small' style='border: none;color:#1b5eed
'>修改
                </el-button>
                <el-button @click='deleteMail(scope.row)' type='text' size='small' style='border: none;color:#1b5eed
'>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        mailDisposeParams: {
          mailPath: ''
        },
        sendMailParams: {
          receiver: '',
          addresser: '',
          mailType: '',
          mailTitle: ''
        },
        activeName: 'first',
        checkedList: [],
        receiverList: ['A邮件组', 'B邮件组', 'C邮件组', 'D邮件组'],
        isReceiverShow: false,
        isAddresserShow: false,
        mailsData: [
          {groupName: 'A组', mailAddress: 'www.baidu.com'}
        ],
        mailsColumns: [
          {label: '组名', field: 'groupName', align: 'center', minWidth: '6%'},
          {label: '邮件地址', field: 'mailAddress', align: 'center', minWidth: '6%'}
        ]
      }
    },
    methods: {
      receiverAdd() {
        this.isReceiverShow = !this.isReceiverShow
      },
      addresserAdd() {
        this.isAddresserShow = !this.isAddresserShow
      },
      editMail() {

      },
      deleteMail() {

      }
    }

  }
</script>

<style lang='less'>
  .mailDispose {
    .el-card {
      .el-card__body {
        padding: 10px 0px;
        .el-tabs__content {
          overflow: visible;
        }
      }
    }
    .el-tabs--card > .el-tabs__header {
      .el-tabs__nav-wrap {
        padding: 0px 0px 10px 0px;
      }
    }
    .dialogForm {
      .el-col {
        .el-form-item {
          width: 100%;
          margin-bottom: 0px;
          padding: 10px;
          .el-form-item__label {
            text-align: center;
          }
          .el-form-item__content {
            width: 40%;
            .el-input {
              width: 85%;
            }
          }
        }
      }
    }
    .el-icon-circle-plus {
      font-size: 25px;
      position: relative;
      left: -30px;
      top: 4px;
      cursor: pointer;
    }
    .mailWrap {
      position: absolute;
      right: 120px;
      z-index: 10;
      top: 35px;
      padding: 15px;
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      .el-checkbox {
        display: block;
        margin-left: 0px;
      }
    }
  }

</style>
