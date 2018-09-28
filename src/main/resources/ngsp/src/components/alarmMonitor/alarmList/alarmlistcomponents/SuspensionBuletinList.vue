<!-- 盘中停牌公告列表 -->

<template>
  <div>
    <el-card>
      <div slot="header">
        <span>查询条件</span>
        <el-button @click="clear" type="text" size="small" class="refreshShop" style="float:right;">清空</el-button>
        <el-button @click="submit" type="primary" size="small" style="float:right; ">查询</el-button>
      </div>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-col :span="6" class="name">关键字：</el-col>
          <el-col :span="18" class="name">
            <el-input size="small" @change="keyCodevalidChangeS" v-model="submitData.fileName"></el-input>
          </el-col>
          <!--<el-col :span="8" class="name alert">{{keyCodeMessage}}</el-col>-->
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">处理状态：</el-col>
          <el-col :span="18" class="name">
            <el-select style="width: 100%;" placeholder="全部" size="small" v-model="submitData.fileFlag">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.category" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-col :span="6" class="name">生成时间：</el-col>
          <el-col :span="18">
            <el-time-picker
              style="width:100%"
              :clearable="false"
              is-range
              v-model="fileTimePicker"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
              @change="changeFileTime">
            </el-time-picker>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button @click="SuspentionStopreload" type="text" size="mini" class="refreshShop" style="float:right">
          {{SuspentionReloadOperate}}
        </el-button>
        <div type="text" class="reloadContainer" style="float:right;font-size: 14px;">
          隔
          <el-input size="small" style="width:40%;font-size: 14px;" v-model="SuspensionreloadTime" @blur="changeReloadTime"></el-input>
          秒刷新
        </div>
      </div>
      <el-row>
        <el-col :span="24">
          <div class="tableStyle">
            <el-table
              border
              ref="multipleTable"
              :data="suspensionData"
              tooltip-effect="dark"
              style="width: 100%; overflow:visible"
              @selection-change="handleSelectionChange">
              <el-table-column prop="status" label="状态" min-width="10%" align="center"></el-table-column>
              <el-table-column prop="file_time" label="生成时间" min-width="10%" align="center"></el-table-column>
              <el-table-column prop="file_name" label="名称" min-width="10%" align="center"></el-table-column>
              <!--<el-table-column prop="file_name" label="操作" min-width="10%"  align="center"></el-table-column>-->
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <pageination style="float: left" :pageTotal="pageTotal" @getPageination="getPageination"></pageination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>

  // 盘中表格数据请求接口引入
  import { SuspensionBuletinList } from '../../../../service/alarmMonitor/alarmList'
  // 日期插件引入
  import moment from 'moment'
  // 分页组件页面引入
  import Pageination from '../../../common/pageination'

  export default {
    props: ['activeName'],
    components: {
      Pageination // 分页组件页面注册
    },
    data () {
      return {
        SuspentiontimerFun: null,
        fileTimePicker: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
        ],
        currentPage: 1,
        pageSizeNumber: 10,
        pageTotal: 0,
        submitData: {
          fileName: '',
          fileFlag: '',
          fileTimeStart: '',
          fileTimeEnd: '',
          pageIndex: 1,
          pageRows: 10
        },
        statusOptions: [
          {category: '全部', value: ''},
          {category: '未处理', value: 0},
          {category: '已处理', value: 1}
        ],
        SuspentionReloadOperate: '停止刷新',
        SuspensionreloadTime: 30,
        suspensionData: []
      }
    },
    mounted () {
      this.getSuspentionData()
      this.SuspentiontimerFun = setInterval(this.getSuspentionData, this.SuspensionreloadTime * 1000)
    },
    beforeDestroy () {
      clearInterval(this.SuspentiontimerFun)
    },
    methods: {
      changeReloadTime () {
        if (this.SuspentionReloadOperate === '恢复刷新') {
          this.$message({
            showClose: true,
            message: '请恢复刷新',
            type: 'warning'
          })
        } else {
          clearInterval(this.SuspentiontimerFun)
          this.SuspentiontimerFun = setInterval(this.getSuspentionData, this.SuspensionreloadTime * 1000)
        }
      },
      changeFileTime () {
        this.submitData.fileTimeStart = moment(this.fileTimePicker[0]).format('HH:mm:ss')
        this.submitData.fileTimeEnd = moment(this.fileTimePicker[1]).format('HH:mm:ss')
      },
      //  盘中数据获取
      getSuspentionData () {
        if (!this.submitData.fileTimeStart) {
          this.submitData.fileTimeStart = moment(this.fileTimePicker[0]).format('HH:mm:ss')
        }
        if (!this.submitData.fileTimeEnd) {
          this.submitData.fileTimeEnd = moment(this.fileTimePicker[1]).format('HH:mm:ss')
        }
        SuspensionBuletinList(this.submitData).then((res) => {
          if (!this.pageTotal) {
            this.pageTotal = res.bizData.totalRows
          } else {
            this.pageTotal = res.bizData.totalRows
            if (this.pageTotal < res.bizData.totalRows) {
              this.$alert('有新的盘中停牌公告', {
                confirmButtonText: '确定'
              })
            }
          }
          let arr = res.bizData.metaData
          arr.forEach((v, i) => {
            if (v.file_flag === '0') {
              v.status = '未处理'
            } else if (v.file_flag === '1') {
              v.status = '已处理'
            }
          })
          this.suspensionData = arr
        })
      },
      keyCodevalidChangeS (val) {
        if (val.match(/\'/g)) { // eslint-disable-line
          this.$message.error('内容不能包含单引号')
        }
      },
      // 查询
      submit () {
        clearInterval(this.SuspentiontimerFun)
        this.SuspentionReloadOperate = '恢复刷新'
        this.getSuspentionData()
      },
      // 清空查询条件
      clear () {
        this.submitData.fileFlag = '' // 处理状态  fileName
        this.submitData.fileName = '' // 关键字
        // 生成时间
        this.fileTimePicker = [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)]
        this.changeFileTime()
      },
      SuspentionStopreload () {
        if (this.SuspentionReloadOperate === '停止刷新') {
          clearInterval(this.SuspentiontimerFun)
          this.SuspentionReloadOperate = '恢复刷新'
        } else if (this.SuspentionReloadOperate === '恢复刷新') {
          this.SuspentiontimerFun = setInterval(this.getSuspentionData, this.SuspensionreloadTime * 1000)
          this.SuspentionReloadOperate = '停止刷新'
        }
      },
      // 复选框的方法能够获取
      handleSelectionChange (selection) {
      },
      downLoad (row) {
      },
      // 分页方法
      getPageination (pageinationVal) {
        this.submitData.pageRows = pageinationVal.pageSizeNumber
        this.submitData.pageIndex = pageinationVal.currentPage
        this.getSuspentionData()
      }
    }
  }
</script>

<style>
  .el-date-editor .el-range-separator {
    color: #CCC;
  }
</style>
