<template>
  <el-card class="table-card">
    <div slot="header">
      <span>我的代办列表</span>
      <el-button size="small" type="primary" @click="cancelAgents">取消代办</el-button>
    </div>
    <el-table
      :data="myAgentList"
      ref="multipleTable"
      border
      tooltip-effect="dark"
      height="350"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column width="40" type="selection"></el-table-column>
      <el-table-column
        v-for="column in columns"
        :formatter="column.formatter ? column.formatter: null"
        :show-overflow-tooltip="true"
        :key="column.field"
        :label="column.label"
        :prop="column.field"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align == null ? 'center' : column.align"
        :header-align="column.headerAlign == null ? 'center' : column.headerAlign"
        :sortable="column.sortable == null ? false : column.sortable"
        :sort-method="column.sortMethod">
      </el-table-column>
    </el-table>
    <pagination-component
      :pageTotal="totalCount"
      @getPageination="getPageination"
    ></pagination-component>
  </el-card>
</template>
<script>
  import paginationComponent from '@/components/common/pageination'
  import {
    getMyAgentList,
    postCancelAgents
  } from '@/service/systemManage/otherManage'

  export default {
    components: {
      paginationComponent
    },
    props: {
      leftColumnDataProps: {
        type: Array,
        required: true
      }
    },
    data () {
      let transferCodeToName = this.transferCodeToName
      return {
        myAgentList: [],
        checkedList: [],
        columns: [
          {
            field: 'processNames',
            label: '代办类型',
            minWidth: '100',
            formatter: transferCodeToName
          },
          {
            field: 'surrogateName',
            label: '代办人',
            minWidth: '100'
          },
          {
            field: 'createTime',
            label: '创建时间',
            minWidth: '150'
          }
        ],
        totalCount: 0,
        pageinationInfo: {
          currentPage: 1,
          pageSizeNumber: 10
        }
      }
    },
    methods: {
      getPageination (val) {
        this.pageinationInfo = val
        this.reqAllAgentList()
      },
      reqAllAgentList () {
        let params = {
          pageNo: this.pageinationInfo.currentPage,
          pageSize: this.pageinationInfo.pageSizeNumber
        }
        getMyAgentList(params).then(resp => {
          if (resp) {
            const {list, total} = resp
            this.myAgentList = list
            this.totalCount = total
            let surrogateId = this.myAgentList[0] ? this.myAgentList[0]['surrogateId'] : ''
            let surrogateName = this.myAgentList[0] ? this.myAgentList[0]['surrogateName'] : ''
            this.$emit('updateTotalCount', this.totalCount, surrogateId, surrogateName)
          }
        })
      },
      transferCodeToName (row) {
        let allNameList = []
        let loop = function (list) {
          list.forEach(l => {
            if (l.children) {
              loop(l.children)
            } else {
              allNameList.push({
                id: l.id,
                name: l.name
              })
            }
          })
        }
        loop(this.leftColumnDataProps)
        let codeList = row.processNames.split(',')
        let nameList = []
        allNameList.forEach(v => {
          if (codeList.indexOf(v.id) > -1) {
            nameList.push(v.name)
          }
        })
        return nameList.join(',')
      },
      handleSelectionChange (val) {
        this.checkedList = val
      },
      cancelAgents () {
        if (this.checkedList.length === 0) {
          this.$message.info('请至少选择一个代办任务')
          return
        }
        if (this.checkedList.length > 1) {
          this.$message.info('暂不支持批量操作')
          return
        }
        let params = {
          ID: this.checkedList[0].id,
          surrogateId: this.checkedList[0].surrogateId,
          grantorId: this.checkedList[0].grantorId
        }
        postCancelAgents(params).then(() => {
          this.$message.success('取消代理操作成功')
          this.reqAllAgentList()
        })
      }
    },
    created () {
      this.reqAllAgentList()
    }
  }
</script>
<style lang="less" scoped>
  .table-card {
    .opearate-btn {
      text-align: right;
      padding: 15px;
    }
  }
</style>
