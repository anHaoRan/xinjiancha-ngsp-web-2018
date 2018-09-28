<template>
  <div class="convergenceTrades">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="140px"
               style="padding-top: 20px">
        <el-row>
          <el-col v-if="isLeader" :xl="8" :lg="8" :md="8" :sm="24">
            <el-form-item label="" prop="remindDate" label-width="40px">
              <el-date-picker
                v-model="ruleForm.remindDate"
                type="dates"
                :picker-option="setDateRange"
                format="MM-dd"
                value-format="MM-dd"
                placeholder="请选择设置日期">
              </el-date-picker>
              <el-button type="primary" @click="setDate" size="small" style="margin-left: 20px">设置提醒日期</el-button>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="8" :sm="24">
            <el-form-item label="起止日期：" prop="seDate">
              <s-date-picker
                v-model="ruleForm.seDate"
                :is-range="true"
                type="date"
                startPlaceholder="请选择开始日期"
                endPlaceholder="请选择结束日期"></s-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="8" :sm="24" style="float: right">
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
              <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
              <!--<el-button type="info" @click="changeRole" size="small">切换角色</el-button>-->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card v-if="isLeader">
      <el-table
        v-loading="loading"
        element-loading-text="数据加载中，请耐心等待..."
        element-loading-background="rgba(0,0,0,0.3)"
        :data="tableDataLeader"
        style="width: 100%"
        height="480">
        <el-table-column prop="rem_date" label="提醒时间" width="180" align="left"></el-table-column>
        <el-table-column prop="file_number" label="事项编号" width="180" align="left">
        </el-table-column>
        <el-table-column label="是否启动核查" align="left">
          <template slot-scope="scope">
            <el-select
              :disabled="scope.row.disable === undefined ? true : scope.row.disable"
              v-model="scope.row.examine_state"
              size="small">
              <el-option
                v-for="item in isreviewOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="不启动核查原因" align="left">
          <template slot-scope="scope">
            <el-input v-model="scope.row.examine_cause"
                      :disabled="scope.row.disable === undefined ? true : scope.row.disable"
                      clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="分配人员" align="left">
          <template slot-scope="scope">
            <el-select
              :disabled="scope.row.disable === undefined ? true : scope.row.disable"
              v-model="scope.row.allocation_person_name"
              size="small">
              <el-option
                v-for="item in personOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="分配日期" align="left">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.allocation_date"
              type="date"
              :disabled="scope.row.disable === undefined ? true : scope.row.disable"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请设置日期">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.disable === undefined ? true : scope.row.disable">
              <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
            </div>
            <div v-else>
              <el-button size="mini" type="text" @click="handleSave(scope.row, scope.$index)">保存</el-button>
              <el-button size="mini" type="text" @click="handleCancel(scope.row, scope.$index)">取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pageination :pageTotal="pageTotal" @getPageination="getPageinationLeader"></pageination>
    </el-card>
    <el-card v-else>
      <s-table
        ref="marginTable"
        :isHeader="false"
        :columns="columns"
        :data="tableData"
        @getPageination="getPageination">
        <el-table-column slot="tableColumnsPush" width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDeal">处理</el-button>
          </template>
        </el-table-column>
      </s-table>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import SDatePicker from '../../base/SDatePicker'
  import {
    convTradesIsLeader,
    convTradesSaveSet,
    convTradesSave,
    convTradesCheckDate,
    convTradesGetMembers,
    convTradesQuery
  } from '../../../service/alarmMonitor/clueRadar'

  export default {
    name: 'convergence-trades',
    components: {
      SDatePicker,
      STable: () => import('@/components/base/STable'),
      Pageination: () => import('@/components/common/pageination')
    },
    data () {
      return {
        isLeader: true, // true 是
        ruleForm: {
          seDate: [],
          dateArr: '',
          remindDate: []
        },
        rules: {
          // seDate: [
          //   {required: true, message: '请输入时间', trigger: 'change'}
          // ]
        },
        columns: [
          {field: 'rem_date', label: '提醒时间', align: 'center', sortable: false},
          {field: 'file_number', label: '事项编号', align: 'center', sortable: false},
          {field: 'examine_state', label: '是否启动核查', align: 'center', sortable: false},
          {field: 'examine_cause', label: '不启动核查原因', align: 'center', sortable: false},
          {field: 'allocation_person_name', label: '分配人员', align: 'center', sortable: false},
          {field: 'allocation_date', label: '分配日期', align: 'center', sortable: false},
        ],
        tableData: {data: [], total: 0, pageIndex: 1, pageRows: 10},
        loading: false,
        pageTotal: 0,
        currentPage: 1,
        pageSize: 10,
        tableDataLeader: [],
        isreviewOptions: [
          {value: 'Y', label: '是'},
          {value: 'N', label: '否'}
        ],
        personOptions: [],
        setDateRange: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      changeRole () {
        this.isLeader = !this.isLeader
      },
      setDate () {
        let dateSetArr = []
        if (this.ruleForm.remindDate.length > 0) {
          this.ruleForm.remindDate.forEach((item) => {
            let param = item.split('-')[0] + item.split('-')[1] + ''
            convTradesCheckDate(param).then((resp) => {
              if (resp === '1') {
                this.$notify({
                  title: '重复日期设置提示',
                  message: item + '已经设置过提醒',
                  type: 'warning'
                })
              } else {
                dateSetArr.push(param)
              }
            })
          })
        }
        setTimeout(() => {
          if (dateSetArr.length > 0) {
            let newDateSetArr = []
            dateSetArr.forEach((item) => {
              newDateSetArr.push(item + this.getRandomStr() + '')
            })
            let params = JSON.stringify({md: newDateSetArr})
            convTradesSaveSet(params).then((resp) => {
              this.tableDataLeader = resp
            })
          }
        }, 500)
      },
      submitForm (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.queryBySeDate()
          }
        })
      },
      queryBySeDate () {
        let parmas = {
          sDate: this.ruleForm.seDate.length > 0 ? moment(this.ruleForm.seDate[0]).format('YYYYMMDD') : '',
          eDate: this.ruleForm.seDate.length > 0 ? moment(this.ruleForm.seDate[1]).format('YYYYMMDD') : '',
          isLeader: this.isLeader === true ? 'Y' : 'N',
          person: this.gfnGetUsername(),
          pageIndex: this.isLeader ? this.currentPage : this.tableData.pageIndex,
          pageRows: this.isLeader ? this.pageSize : this.tableData.pageRows
        }
        convTradesQuery(JSON.stringify(parmas)).then((resp) => {
          if (resp !== null) {
            this.isLeader ? this.tableDataLeader = resp : this.tableData.data = resp
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      getPageinationLeader (page) {
        this.currentPage = page.currentPage
        this.pageSize = page.pageSizeNumber
      },
      handleDeal () {
        this.openNewWindow('convergenceTradesTwo', '#/convergenceTradesTwo')
      },
      handleEdit (row, index) {
        this.$set(this.tableDataLeader[index], 'disable', false)
      },
      handleSave (row, index) {
        if (row.examine_state === 'Y' && row.allocation_person_name !== '') {
          this.$confirm('是否转出', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let params = {
              file_number: row.file_number,
              examine_state: row.examine_state,
              examine_cause: row.examine_cause,
              allocation_date: row.allocation_date,
              allocation_person_name: row.allocation_person_name
            }
            convTradesSave(JSON.stringify(params)).then((resp) => {
              this.$message.success('转出成功')
              this.queryBySeDate()
            })
          }).catch(() => {})
        } else {
          let params = {
            file_number: row.file_number,
            examine_state: row.examine_state,
            examine_cause: row.examine_cause,
            allocation_date: row.allocation_date,
            allocation_person_name: row.allocation_person_name
          }
          convTradesSave(JSON.stringify(params)).then((resp) => {
            this.$message.success('保存成功')
            this.queryBySeDate()
          })
        }
      },
      handleCancel (row, index) {
        this.$set(this.tableDataLeader[index], 'disable', true)
      },
      getPageination (page) {
        this.tableData.pageIndex = page.currentPage
        this.tableData.pageRows = page.pageSizeNumber
      },
      // 生成 8 位随机字符串
      getRandomStr () {
        let text = ''
        let str = '0123456789abcdefghijklmnopqrstuvwxwzQWERTYUIOPASDFGHJKLZXCVBNM'
        for (let i = 0; i < 8; i++) {
          text += str.charAt(Math.floor(Math.random() * str.length))
        }
        return text
      }
    },
    created () {},
    mounted () {
      let currentUser = this.gfnGetUsername()
      // 获取是否是组长
      convTradesIsLeader(currentUser).then((resp) => {
        if (resp === 'true') {
          this.isLeader = true
        } else {
          this.isLeader = false
        }
      })
      convTradesGetMembers (currentUser).then((resp) => {
        resp.forEach((obj) => {
          this.personOptions.push({value: obj.userName, label: obj.fullName})
        })
      })
    },
    beforeDestroy () {}
  }
</script>

<style lang="less" scoped>
  .convergenceTrades {
  }
</style>