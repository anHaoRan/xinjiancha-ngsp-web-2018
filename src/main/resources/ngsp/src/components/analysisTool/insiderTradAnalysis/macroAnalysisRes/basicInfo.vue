<template>
    <div class="basic-info">
        <el-card style="padding-top: 10px;margin-top: 0;position: relative;" class="el-card-table">
            <el-table ref="mulitipleTable"
                      :data="tableData"
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="handleSelectionChange"
                      @select="selectCurrentRow"
                      @select-all="selectAllCurrentTableData"
                      v-loading="queryResLoad"
                      element-loading-spinner="el-icon-loading"
                      element-loading-text="数据加载中，请耐心等待..."
                      element-loading-background="rgba(0,0,0,0.3)">
                <el-table-column type="selection"
                                 v-if="canDoMoreThing"
                                 width="55"
                                 align="center">
                </el-table-column>
                <el-table-column prop="notice_date"
                                 label="公告日期"
                                 width="132">
                </el-table-column>
                <el-table-column prop="notice_name"
                                 label="公告标题"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="event_type"
                                 label="事件类型"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="events"
                                 label="事件摘要"
                                 show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <div>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="resultNum">
                </el-pagination>
            </div>
            <el-row style="margin-top: 20px;">
                <el-button type="primary" size="small" style="position: absolute;right: 15px;bottom: 20px;"
                           @click="addAccount" v-if="canDoMoreThing">
                    进一步分析选中报告
                </el-button>
            </el-row>
        </el-card>
        <el-card style="padding-top: 20px;" v-if="basicInfoCon!=''">
            <el-row class="title">公司基本信息</el-row>
            <div>
                {{basicInfoCon}}
            </div>
        </el-card>
    </div>
</template>

<script>
  import { getBasicInfo, addAccountListOfBasicinfo } from '../../../../service/analysisTool/insiderTradAccountAnalysis'

  export default {
    //  name: "basic-info",
    computed: {
      canDoMoreThing: function () {
        let canDoMoreThing = this.operatorType === 'analysiser' && !this.operateType.includes('6')
        return canDoMoreThing
      }
    },
    data () {
      return {
        msg: '公司基本信息及公告事项',
        tableData: [],
        queryResLoad: false,
        selectData: [],
        // 翻页多选data暂存
        selectDataMoment: [],
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        resultNum: 0,
        basicInfoCon: '',
        flag: true,
        operatorType: '', // 分析复核类型
        operateType: [] // 操作类型
      }
    },
    methods: {
      // 获取当前选中行
      selectCurrentRow (select, row) {
        if ($.isEmptyObject(this.selectDataMoment)) {
          this.selectDataMoment.push(row)
        } else {
          let currentId = row.notice_id
          let that = this
          let selList = new Set()
          select.map(function (item) {
            return selList.add(item.notice_id)
          })
          if (!selList.has(currentId)) {
            this.selectDataMoment.forEach(function (item, index) {
              if (item.notice_id == currentId) {
                that.selectDataMoment.splice(index, 1)
              }
            })
          } else {
            this.selectDataMoment.push(row)
            // 去重处理
            let newArr = []
            for (let i = 0; i < this.selectDataMoment.length; i++) {
              if (newArr.indexOf(this.selectDataMoment[i]) === -1) {
                newArr.push(this.selectDataMoment[i])
              }
            }
            this.selectDataMoment = newArr
          }
        }
        this.selectData = this.selectDataMoment.map(function (item) {
          return {
            notice_date: item.notice_date,
            notice_name: item.notice_name
          }
        })
        console.log(this.selectDataMoment.length)
      },

      selectAllCurrentTableData (val) {
        // val值有两种情况，另一种是与当前表格数据相同，即全选，一种为空数组，即取消全选
        // 把当前表格数据存储在一个变量中，另外设置一个变量n,用来记录已选项与 val 两个数组相匹配的数量
        let arr = JSON.parse(JSON.stringify(this.tableData)), n = 0
        // 双层for循环，遍历 val 与 this.selectDataMoment 两数组中相同项，若有相同项，n+=1
        for (let i = 0; i < this.selectDataMoment.length; i++) {
          for (let j = 0; j < val.length; j++) {
            if (this.selectDataMoment[i]['notice_id'] === val[j]['notice_id']) {
              n += 1
            }
          }
        }
        if (n % this.pageSize === 0) {
          /**
           * 如果 n % this.pageSize == 0
           * 说明此时有三种情况
           * 第一种是 this.selectDataMoment 为空，val 不为空，n=0 , 即进入该 tab 页没有单独选任何一项，直接点全选，此时为全选
           * 第二种是 this.selectDataMoment 不为空，val 为空，n=0 , val 为空即取消全选
           * 第三种是 this.selectDataMoment 不为空，val 不为空，n != 0 && n % this.pageSize==0 , 此时为全选
           * 无论哪种情况，遍历当前表格数据，将 val 作为已勾选值，将当前表格数据中的每一行作为即将勾选值，调用表格的单选行方法
           * 表格的单选行方法中，若val有值，则全部勾选，若val无值，则全部取消勾选，并对 this.selectMoment 做相应更新
           **/
          arr.forEach(item => {
            this.selectCurrentRow(val, item)
          })
        } else {
          /**
           * 除以上情况外，还有一种情况，n % this.pageSize != 0：
           * 此时当前页表格中已有部分行被勾选，需要再做遍历，将 arr 中已选行剔除，将处理后的 arr 作为上个if分支中的第三种情况里的 val，
           * 再调用单选行方法，将剩余未勾选行全部选中，并对 this.selectMoment 做相应改变
           **/
          for (let i = 0; i < this.selectDataMoment.length; i++) {
            for (let j = 0; j < arr.length; j++) {
              if (!$.isEmptyObject(this.selectDataMoment)) {
                if (this.selectDataMoment[i]['notice_id'] === arr[j]['notice_id']) {
                  arr.splice(j, 1)
                }
              }
            }
          }
          arr.forEach(item => {
            this.selectCurrentRow(arr, item)
          })
        }
      },
      // 获取选择内容
      handleSelectionChange (val) {

      },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.mulitipleTable.toggleRowSelection(row, true)
          })
        } else {
          this.$refs.mulitipleTable.clearSelection()
        }
      },
      // 进一步分析账户
      addAccount () {
        let params = {
          taskId: this.$store.state.insiderTradAnalysis.currentTaskData.taskId,
          notice: this.selectData
        }
        params = JSON.stringify(params)
        if (this.selectData.length !== 0) {
          addAccountListOfBasicinfo(params).then(resp => {
            if (resp) {
              this.$message.success('提交成功')
            }
          })
        } else {
          this.$message.warning('请选择公告')
        }
      },
      getResultData () {
        let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
        let pageIdx = this.currentPage, pageRw = this.pageSize
        // if (this.flag) {
        //   this.flag = false
        this.queryResLoad = true
        this.getResponse(taskId, pageIdx, pageRw)
        // }
      },
      getResponse (taskId, pageIdx, pageRw) {
        getBasicInfo(taskId, pageIdx, pageRw).then((resp) => {
          let that = this, selectList = []
          // if (!$.isEmptyObject(resp.mattersList)) {
          this.tableData = resp.mattersList
          this.resultNum = (resp.rowsCount - 0)
          this.basicInfoCon = resp.basicInfo
          if (!$.isEmptyObject(this.selectDataMoment)) {
            this.tableData.forEach(function (item) {
              for (let i = 0; i < that.selectDataMoment.length; i++) {
                if (item.notice_id == that.selectDataMoment[i].notice_id) {
                  selectList.push(item)
                }
              }
            })
            that.toggleSelection(selectList)
          } else {
            this.toggleSelection()
          }
          this.$nextTick(function () {
            this.toggleSelection(selectList)
          })
          // } else {
          //   this.flag = true
          // }
          this.queryResLoad = false
        })
      },
      handleSizeChange (size) {
        this.queryResLoad = true
        this.pageSize = size
        this.currentPage = 1
        let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
        let pageIdx = this.currentPage, pageRw = this.pageSize
        this.getResponse(taskId, pageIdx, pageRw)
      },
      handleCurrentChange (rowNum) {
        this.queryResLoad = true
        this.currentPage = rowNum
        let taskId = this.$store.state.insiderTradAnalysis.currentTaskData.taskId
        let pageIdx = this.currentPage, pageRw = this.pageSize
        this.getResponse(taskId, pageIdx, pageRw)
      }
    },
    mounted () {
      this.operatorType = this.$store.state.insiderTradAnalysis.currentTaskData.operatorType // 分析复核类型
      this.operateType = this.$store.state.insiderTradAnalysis.currentTaskData.operateType // 操作类型
      // this.getResultData()
    }
  }
</script>

<style lang="less">
    .basic-info {
        .title {
            margin: 0 auto;
            text-align: center;
            font-size: 16px;
            color: white;
        }
    }
</style>
