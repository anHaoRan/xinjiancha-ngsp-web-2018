<template>
  <div class="clueAssoiciateTable">
    <margin-table
      :loading="loading"
      :columns="columns"
      :height="200"
      :isPageination="false"
      :data="{
        data: tableData,
        pageIndex: pagination.currentPage,
        pageRows: pagination.pageSizeNumber,
        total: total
      }"
      @handlerChange="handleSlotComponentEvent"
    >
      <el-table-column slot="tableColumnsPush" label="是否关联">
        <template slot-scope="scope">
          <div class="overlayDiv" @click="handleClick(scope.row)"></div>
          <el-switch :disabled="propsDisabled" v-model="scope.row.haveConn"></el-switch>
        </template>
      </el-table-column>
    </margin-table>
  </div>
</template>
<script>
  import {getDigProcessCrphistoryInfo, postDigprocessConnect, getActivityNameByProcessName} from '@/service/superviseTask'
  import SwitchComponent from './SwitchComponent'
  import TableColumnCanClickComponent from '@/components/systemManage/common/TableColumnCanClickComponent'
  export default {
    components: {
      MarginTable: () => import('@/components/base/MarginTable.vue'),
      SwitchComponent
    },
    props: {
      infoIdProps: {
        type: String,
        default: ''
      },
      securityProps: {
        type: Array,
        default() {
          return []
        }
      },
      propsDisabled: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      securityProps: {
        handler() {
          this.reqTableData()
        },
        deep: true
      }
    },
    data() {
      return {
        loading: false,
        columns: [
          {
            field: 'security', label: '证券代码'
          },
          {
            field: 'clueTypeText', label: '线索类型'
          },
          {
            field: 'clueName', label: '线索名称'
          },
          {
            field: 'clueNo', label: '线索编号', template: TableColumnCanClickComponent
          },
          {
            field: 'createPerson', label: '创建人'
          },
          {
            field: 'localStatus', label: '流程状态'
          },
          {
            field: 'count', label: '关联次数', align: 'right'
          }
        ],
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0,
        clubLocalStatusNameArray: []
      }
    },
    methods: {
      handleSlotComponentEvent ({type, scope, item}) {
        if (type === 'tableColumnCanClickComponent') {
          window.open(`#/clueReportForm?operate=1&instanceId=${scope.row.infoIdCrp}&isNewTab=true`)
        }
      },
      reqTableData() {
        let params = {
          security: this.securityProps || [],
          infoIdDig: this.infoIdProps
        }
        this.loading = true
        getDigProcessCrphistoryInfo(params).then(resp => {
          this.loading = false
          if (resp) {
            resp.forEach(v => {
              v.count = v.count || 0
              v.haveConn = !!v.haveConn
              v.localStatus = this.clubLocalStatusNameArray[v.localStatus]
            })
          }
          this.tableData = resp
          this.total = resp.length
        })
      },
      handleClick(item) {
        if (this.propsDisabled) {
          return
        }
        let params = {
          infoIdDig: this.infoIdProps,
          cancel: item.haveConn ? '1' : '0',
          infoIdCrp: item.infoIdCrp
        }
        let text = item.haveConn ? '关闭' : '开启'
        postDigprocessConnect(params).then(resp => {
          if (resp) {
            item.haveConn ? item.count-- : item.count++
            item.haveConn = !item.haveConn
            this.$message.success(`${text}成功`)
          } else {
            this.$message.error('操作失败')
          }
        })
      },
      reqActivityNameByProcessName () {
        getActivityNameByProcessName('ngsp_crp_flow').then(res => {
          this.clubLocalStatusNameArray = res['localStatusName']
        })
      }
    },
    mounted() {
      this.reqActivityNameByProcessName()
    }
  }
</script>
<style lang="less" scoped>
  .clueAssoiciateTable {
    position: relative;
    .overlayDiv {
      position: absolute;
      top: 0;
      width: 100px;
      height: 50px;
      z-index: 11;
    }
  }
</style>
