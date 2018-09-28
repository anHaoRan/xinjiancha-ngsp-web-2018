<!--监控对象设置 -->
<template>
  <div class="monitoringObjectSet">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <edit-monitoring-object-dialog
      ref="editDialogRef"
      :ruleFormProps="currentSelectedItem"
      :currentModeProps="currentMode"
      @updateList="getAllMonitoringObjectList"
    ></edit-monitoring-object-dialog>
    <el-card>
      <div slot="header">
        <span>查询条件</span>
        <el-button size="small" type="info" @click="handleClear">清空</el-button>
        <el-button size="small" type="primary" @click="handleQuery">搜索</el-button>
      </div>
      <el-row>
        <el-form ref="searchForm" :model="searchForm" label-width="120px" :inline="true">
          <el-form-item prop="watchOBType" label="监控对象类型">
            <el-select
              v-model="searchForm.watchOBType"
              placeholder="请选择账户组类型"
              size="small"
              style="width: 100%;">
              <el-option
                v-for="item in watchOBTypeOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="watchOBID" label="监控对象标识">
            <el-input
              v-model="searchForm.watchOBID"
              auto-complete="off"
              placeholder="请输入监控对象标识"
              size="small">
            </el-input>
          </el-form-item>
          <el-form-item prop="watchOBName" label="监控对象名称">
            <el-input
              v-model="searchForm.watchOBName"
              auto-complete="off"
              placeholder="请输入监控对象名称"
              size="small">
            </el-input>
          </el-form-item>
          <el-form-item prop="watchOBDesc" label="监控对象描述">
            <el-input
              v-model="searchForm.watchOBDesc"
              auto-complete="off"
              placeholder="请输入监控对象描述"
              size="small">
            </el-input>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header">
        <span>监控对象设置</span>
        <el-button type="primary" size="small" @click="handleDelete">删除</el-button>
        <el-button type="primary" size="small" @click="handleEdit">修改</el-button>
        <el-button size="small" type="primary" @click="handleCreate">新建</el-button>
        <el-button size="small" type="primary" @click="handleExport">导出</el-button>
      </div>
      <el-row>
        <el-table
          border
          ref="tableDataRef"
          :data="tableData"
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)"
          show-overflow-tooltip
          style="width:100%;">
          <el-table-column width="55" align="center">
            <template slot-scope="scope">
              <el-radio
                class="radio" v-model="checked"
                :label="scope.row.watch_ob_id"
                @change="handleCheckedChange">
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="watch_ob_type_name"
            sortable
            label="监控对象类型">
          </el-table-column>
          <el-table-column
            sortable
            prop="watch_ob_id"
            label="监控标识"
            align="left">
            <template slot-scope="scope">
              <a class="slotScope"
                 type="text" size="small"
                 @click="toDetailA(scope.row.watch_ob_type, scope.row.watch_ob_id)">
                {{scope.row. watch_ob_id}}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="watch_ob_name"
            sortable
            label="监控对象名称">
          </el-table-column>
          <el-table-column
            prop="watch_ob_desc"
            sortable
            label="监控对象描述">
          </el-table-column>
        </el-table>
        <el-row>
          <pageination
            @getPageination="getPageination"
            :pageTotal="totalNum"></pageination>
        </el-row>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import breadcrumb from '@/components/common/Breadcrumb'
  import pageination from '@/components/common/pageination'
  import editMonitoringObjectDialog from './monitoringObjectSet/EditMonitoringObjectDialog'
  import {
    postSearchWatchobjectList, //  列表信息
    getMonitoringObjectType, // 监控对象类别下拉框
    exportWatchObject, // 导出
    deleteWatchObj // 删除
  } from '@/service/systemManage/securityPlateSet/index'

  export default {
    name: 'monitoringObjectSet',
    components: {
      breadcrumb,
      pageination,
      editMonitoringObjectDialog
    },
    data () {
      return {
        breadcrumbItems: [
          {
            router: '/monitoringObjectSet',
            label: '系统管理'
          }, {
            router: '/monitoringObjectSet',
            label: '设置'
          }, {
            router: '/monitoringObjectSet',
            label: '监控对象设置'
          }
        ],
        loading: false,
        totalNum: 0,
        tableData: [],
        searchForm: {
          watchOBType: 'ALL',
          watchOBID: '',
          watchOBName: '',
          watchOBDesc: ''
        },
        currentMode: 'create',
        currentSelectedItem: {},
        checked: '',
        pageination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        watchOBTypeOptions: [
          {
            value: 'ALL',
            text: '全选'
          }
        ],
        // 证券板块名称弹框宽度
        formsLabel: '120px',
        formLabel: '120px',
        securityPlateModel: {
          securityType: 'ALL',
          securityLogo: '',
          securityNname: '',
          securityDescribe: ''
        },
        plateNewModel: {
          plateNname: '',
          plateDesctibe: '',
          plateDesc: ''
        },
        amendPlateNewModel: {
          plateNname: '',
          plateDesctibe: '',
          plateDesc: ''
        },
        radio: '',
        securityTypeOptions: [
          {
            value: 'ALL',
            text: '全选'
          }
        ],
        accountDatas: [],
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        tableTotal: 0,
        // 证券板块名称弹框
        amendk: false,
        plateSetNew: false,
        queryResLoadMain: false,
        getGatherId: {}
      }
    },
    methods: {
      getPageination (pageination) {
        this.pageination = pageination
        this.getAllMonitoringObjectList()
      },
      getAllMonitoringObjectList () {
        this.checked = ''
        this.currentSelectedItem = {}
        let params = {
          'pageIndex': this.pageination.currentPage,
          'pageRows': this.pageination.pageSizeNumber,
          'watchOBType': this.searchForm.watchOBType, // 监控对象类型
          'watchOBID': this.searchForm.watchOBID, // 监控对象标识
          'watchOBName': this.searchForm.watchOBName, // 监控对象名称
          'watchOBDesc': this.searchForm.watchOBDesc // 监控对象描述
        }
        this.loading = true
        postSearchWatchobjectList(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.tableData = buzidata
            this.totalNum = totalNum
          }
        })
      },
      handleDelete () {
        if (!this.currentSelectedItem.watchOBID) {
          this.$message.error('请先选择一个监控对象')
          return
        }
        this.$confirm(`确定删除${this.currentSelectedItem.watchOBName}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let params = {
            watchOBID: this.currentSelectedItem.watchOBID
          }
          deleteWatchObj(params).then((resp) => {
            if (resp) {
              const {success, Message} = resp
              if (success) {
                this.$message.success(Message)
                this.getAllMonitoringObjectList()
              } else {
                this.$message.error(Message)
              }
            }
          })
        }).catch(() => {})
      },
      handleCreate () {
        this.currentMode = 'create'
        this.$nextTick(() => {
          this.$refs['editDialogRef'].showDialog = true
          this.$refs['editDialogRef'].ruleForm = {
            watchOBID: '',
            watchOBName: '',
            watchOBDesc: ''
          }
        })
      },
      handleEdit () {
        if (!this.currentSelectedItem.watchOBID) {
          this.$message.error('请先选择一个监控对象')
          return
        }
        this.currentMode = 'edit'
        this.$nextTick(() => {
          this.$refs['editDialogRef'].showDialog = true
          this.$refs['editDialogRef'].ruleForm = {
            watchOBID: this.currentSelectedItem.watchOBID,
            watchOBName: this.currentSelectedItem.watchOBName,
            watchOBDesc: this.currentSelectedItem.watchOBDesc
          }
        })
      },
      handleExport () {
        if (!this.currentSelectedItem.watchOBID) {
          this.$message.error('请先选择一个监控对象')
          return
        }
        exportWatchObject(this.currentSelectedItem.watchOBID).then(resp => {})
      },
      handleCheckedChange (val) {
        this.checked = val
        let filterItem = this.tableData.filter(v => {
          return v.watch_ob_id === val
        })
        const {watch_ob_id, watch_ob_type, watch_ob_type_name, watch_ob_name, watch_ob_desc} = filterItem[0]
        this.currentSelectedItem = {
          watchOBID: watch_ob_id,
          watchOBType: watch_ob_type,
          watchOBTypeName: watch_ob_type_name,
          watchOBName: watch_ob_name,
          watchOBDesc: watch_ob_desc
        }
      },
      handleClear () {
        this.searchForm = {
          watchOBID: '',
          watchOBName: '',
          watchOBDesc: '',
          watchOBType: 'ALL'
        }
        this.pageination.currentPage = 1
        this.getAllMonitoringObjectList()
      },
      handleQuery () {
        this.pageination.currentPage = 1
        this.getAllMonitoringObjectList()
      },
      // 监控对象类别下拉框
      searchAccountTypeGroup () {
        getMonitoringObjectType('monitorObject', 'sysSetting').then((resp) => {
          this.watchOBTypeOptions = resp
          let All = {
            value: 'ALL',
            text: '全选'
          }
          this.watchOBTypeOptions.unshift(All)
        })
      },
      toDetailA (watchObType, watchOBID) {
        if (watchObType === '') {
          watchObType = null
        }
        this.$router.push({path: '/monitoringObjectSetTab', query: {watchObTypeId: watchObType, watchOBID: watchOBID}})
      }
    },
    mounted () {
      this.searchAccountTypeGroup()
      this.getAllMonitoringObjectList()
    }
  }

</script>
<style lang="less" scoped>
  .monitoringObjectSet {
    /deep/ .el-radio__label {
      display: none !important;
    }
    .slotScope {
      text-decoration: underline;
      color: rgba(107, 107, 224, 0.9);
      cursor: pointer;
    }
  }

</style>
