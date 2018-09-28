<!--  分配数据 allocationData-->
<template>
  <div class="allocationData">
    <el-dialog title="数据权限分配" :visible.sync="showDialog" top="5%" width="80%" left>
      <el-card class="el-card-table">
        <div slot="header">
          <span>查询条件</span>
          <el-button size="small" type="primary" @click="leftAjaxFn()">搜索</el-button>
        </div>
        <el-row>
          <el-form ref="form" :model="searchForm" :inline="true">
            <el-form-item prop="allocationType" label="待分配数据类型：">
              <el-select
                v-model="searchForm.allocationType"
                placeholder="请选择待分配数据类型"
                size="small"
                style="width: 100%;">
                <el-option
                  v-for="allItme in allocationTypeOptions"
                  :key="allItme.value"
                  :label="allItme.text"
                  :value="allItme.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="allocationIdentifying" label="待分配数据标识：">
              <el-input
                v-model="searchForm.allocationIdentifying"
                auto-complete="off"
                placeholder="请输入待分配数据标识"
                size="small">
              </el-input>
            </el-form-item>
          </el-form>
        </el-row>
      </el-card>
      <el-card class="el-card-table">
        <el-row class="transfer-container">
          <el-col :span="11">
            <h5>未分配的数据</h5>
            <self-transer-table-component
              ref="leftTableRef"
              :type="`left`"
              :columnsProps="columnsLeft"
              :loadingProps="loadingLeft"
              :tableDataProps="leftTableData"
              :totalNumProps="leftTotalNum"
              :leftCheckingListProps="leftCheckingList"
              @leftAjaxFn="leftAjaxFn"
              @updateCheckingList="updateCheckingList"
            ></self-transer-table-component>
          </el-col>
          <el-col :span="2" class="button-group-wrap">
            <div class="button-group">
              <el-button type="text" :disabled="leftCheckingList.length < 1" @click="handleTransfer('right')"><i
                class="el-icon el-icon-d-arrow-right"></i></el-button>
              <br>
              <el-button type="text" :disabled="rightCheckingList.length < 1" @click="handleTransfer()"><i
                class="el-icon el-icon-d-arrow-left"></i></el-button>
            </div>
          </el-col>
          <el-col :span="11">
            <h5>已分配的数据</h5>
            <self-transer-table-component
              ref="rightTableRef"
              :type="`right`"
              :columnsProps="columnsRight"
              :loadingProps="loadingRight"
              :tableDataProps="rightTableData"
              :totalNumProps="rightTotalNum"
              :rightCheckingListProps="rightCheckingList"
              @rightAjaxFn="rightAjaxFn"
              @updateCheckingList="updateCheckingList"
            ></self-transer-table-component>
          </el-col>
        </el-row>
      </el-card>
      <el-row>
        <el-col :span="24">
          <div class="dialog-footer">
            <el-button class="but-footer" type="text" size="samll" @click="showDialog=false">取消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import { G_C_NOTE_LAZY_LOAD } from '@/utils/constants'
  import {
    getMonitoringObjectType, // 待分配数据类型下拉框
    postAllocationDataLeft, // 数据-左
    postAllocationDataRight, // 数据-右
    postAllocationDataLeftMove, // 添加--右移
    postAllocationDataRightMove // 移除--左移
  } from '@/service/systemManage/securityPlateSet/index'
  import selfTranserTableComponent from '@/components/systemManage/securityPlateSet/systemParameter/component/SelfTransferTableComponent'

  export default {
    name: 'allocationData',
    components: {
      selfTranserTableComponent
    },
    props: {
      currentClickNodeObjProps: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        showDialog: false,
        loadingLeft: false,
        loadingRight: false,
        columnsLeft: [
          {
            field: 'watch_ob_type_name',
            label: '待分配数据类型',
            minWidth: '100'
          },
          {
            field: 'watch_ob_id',
            label: '待分配数据标识',
            minWidth: '100'
          },
          {
            field: 'watch_ob_name',
            label: '待分配数据名称',
            minWidth: '100'
          }
        ],
        columnsRight: [
          {
            field: 'watch_ob_type_name',
            label: '数据权限类型',
            minWidth: '100'
          },
          {
            field: 'watch_ob_id',
            label: '数据权限标识',
            minWidth: '100'
          },
          {
            field: 'watch_ob_name',
            label: '数据权限名称',
            minWidth: '100'
          }
        ],
        leftTableData: [],
        rightTableData: [],
        leftTotalNum: 0,
        rightTotalNum: 0,
        leftCheckingList: [],
        rightCheckingList: [],
        searchForm: {
          allocationType: 'ALL',
          allocationIdentifying: ''
        },
        allocationTypeOptions: []
      }
    },
    methods: {
      updateCheckingList (type, newValue) {
        if (type === 'left') {
          this.leftCheckingList = newValue
        } else {
          this.rightCheckingList = newValue
        }
      },
      rightAjaxFn (pageIndex, pageRows, isCover) {
        this.loadingRight = true
        let params = {
          pageIndex: pageIndex || 1,
          pageRows: pageRows || 10,
          PSNID: this.currentClickNodeObjProps.usercode // 用户ID
        }
        if (params.pageIndex === 1) {
          this.resetPageIndex('right')
        }
        postAllocationDataRight(params).then((resp) => {
          this.loadingRight = false
          if (resp) {
            const {buzidata} = resp
            if (isCover || params.pageIndex === 1) {
              this.rightTableData = buzidata
            } else {
              this.rightTableData = this.rightTableData.concat(buzidata)
            }
            this.rightTotalNum = this.rightTableData.length
            if (buzidata.length < params.pageRows) {
              this.$refs['rightTableRef'].loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
            } else {
              this.$refs['rightTableRef'].loadingMore = false
            }
          } else {
            this.$refs['rightTableRef'].loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
          }
        })
      },
      leftAjaxFn (pageIndex, pageRows, isCover) {
        this.loadingLeft = true
        let params = {
          pageIndex: pageIndex || 1,
          pageRows: pageRows || 10,
          PSNID: this.currentClickNodeObjProps.usercode, // 用户ID
          watchType: this.searchForm.allocationType, // 监控对象的类型编码
          watchID: this.searchForm.allocationIdentifying // 代分配数据标识
        }
        if (params.pageIndex === 1) {
          this.resetPageIndex('left')
        }
        postAllocationDataLeft(params).then((resp) => {
          this.loadingLeft = false
          if (resp) {
            const {buzidata} = resp
            if (isCover || params.pageIndex === 1) {
              this.leftTableData = buzidata
            } else {
              this.leftTableData = this.leftTableData.concat(buzidata)
            }
            this.leftTotalNum = this.leftTableData.length
            if (buzidata.length < params.pageRows) {
              this.$refs['leftTableRef'].loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
            } else {
              this.$refs['leftTableRef'].loadingMore = false
            }
          } else {
            this.$refs['leftTableRef'].loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
          }
        })
      },
      resetPageIndex (type) {
        if (type === 'left') {
          if (this.$refs['leftTableRef']) {
            this.$refs['leftTableRef'].pageIndex = 1
          }
        } else {
          if (this.$refs['rightTableRef']) {
            this.$refs['rightTableRef'].pageIndex = 1
          }
        }
      },
      handleTransfer (type) {
        if (type === 'right') { // 向右穿
          let params = this.leftCheckingList.map(v => {
            return {
              watchID: v.watch_ob_id,
              PSNID: this.currentClickNodeObjProps.usercode
            }
          })
          postAllocationDataLeftMove(JSON.stringify(params)).then((resp) => {
            if (resp) {
              this.$message.success('操作成功!')
              this.leftAjaxFn()
              this.rightAjaxFn()
            }
          })
        } else {
          let params = this.rightCheckingList.map(v => {
            return {
              watchID: v.watch_ob_id,
              PSNID: this.currentClickNodeObjProps.usercode
            }
          })
          postAllocationDataRightMove(JSON.stringify(params)).then((resp) => {
            if (resp) {
              this.$message.success('操作成功!')
              this.leftAjaxFn()
              this.rightAjaxFn()
            }
          })
        }
      },
      // 待分配数据类型下拉框
      SearchAccountTypeGroup () {
        getMonitoringObjectType('monitorObject', 'sysSetting').then((resp) => {
          this.allocationTypeOptions = resp
          let All = {
            value: 'ALL',
            text: '全选'
          }
          this.allocationTypeOptions.unshift(All)
        })
      }
    },
    watch: {},
    created () {},
    mounted () {
      this.SearchAccountTypeGroup()
    }
  }
</script>
<style lang="less" scoped>
  .allocationData {
    /deep/ .el-form {
      padding-left: 20px;
    }
    /deep/ .el-dialog__body {
      padding-top: 0;
    }
    .button-group-wrap {
      height: 400px;
      text-align: center;
      .button-group {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        button:first-child {
          margin-bottom: 20px;
        }
      }
    }
    .transfer-container {
      text-align: center;
      padding: 10px 10px 25px 10px;
    }

    .but-footer {
      margin: 20px 20px 0 0;
    }
  }
</style>
