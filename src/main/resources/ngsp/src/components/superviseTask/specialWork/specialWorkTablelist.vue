<template>
  <div class="specialWork">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <div style="position:absolute;right:114px;top:10px;">
      <el-button @click="routerProcessPage" size="small" type="primary">新建专项工作</el-button>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="info"
          size="small"
          @click="clearAllData"
        >清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleSearch"
        >查询
        </el-button>
      </div>
      <el-form :model="selectParams" ref="selectParams" :rules="rules" label-width="120px" label-position="left"
               style="margin-top: 20px;">
        <el-row>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="工作类别" prop="workType">
              <el-select collapse-tags v-bind:multiple="true" v-model="selectParams.workType" placeholder=""
                         size="small" class="customize-width">
                <el-option
                  v-for="item in workTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--:picker-options="startpickerOption"-->
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="开始日期" prop="keyWord">
              <el-date-picker
                class="customize-width"
                v-model="selectParams.startDate"
                type="date"
                placeholder="开始日期"
                value-format="yyyy-MM-dd"
                size="small">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="预计完成日期" prop="createPerson">
              <el-date-picker
                class="customize-width"
                v-model="selectParams.foreFinishDate"
                type="date"
                placeholder="预计完成日期"
                value-format="yyyy-MM-dd"
                :picker-options="endpickerOption"
                size="small">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="负责人">
              <selector-dealer class="customize-width" ref="selectorDealer" @node-click="handlerClick"
                               :selectPerson="selectParams.charger"></selector-dealer>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="状态" prop="localStatus">
              <el-select collapse-tags :multiple="true" v-model="selectParams.localStatus" placeholder="" size="small"
                         class="customize-width">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
      </div>
      <margin-table
        :loading="loading"
        @getPageination="getPageination"
        :columns="columns"
        :data="{
          data: tableData,
          pageIndex: pagination.currentPage,
          pageRows: pagination.pageSizeNumber,
          total: total
        }">
        <el-table-column
          slot="tableColumnsUnshift"
          type="index"
          width="80px"
          label="序号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :width="300"
          slot="tableColumnsPush"
          prop="operateContent"
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.operateProcess" size="mini" @click="handleform(scope.row)">
              {{scope.row.operateProcess}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateDelete" size="mini" @click="handledeleteform(scope.row)">
              {{scope.row.operateDelete}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateCheck" size="mini" @click="handleform(scope.row)">
              {{scope.row.operateCheck}}
            </el-button>
            <el-button type="text" v-if="scope.row.operateCancel" size="mini" @click="recall(scope.row)">
              {{scope.row.operateCancel}}
            </el-button>
          </template>
        </el-table-column>
      </margin-table>
    </el-card>
  </div>
</template>
<script>
  import Breadcrumb from '../../common/Breadcrumb'
  import StockCodeQuery from '../../common/StockCodeQuery'
  import MarginTable from '../../base/MarginTable'
  import { columns } from './tableColumns'
  import {
    specialWorktablelist,
    // recalllist,
    specialWorkdelete
  } from '../../../service/superviseTask/index.js'
  import MinxinVue from '../MixIn'

  export default {
    components: {
      StockCodeQuery,
      Breadcrumb,
      MarginTable,
      SelectorDealer: () => import('@/components/common/SelectorDealer')
    },
    mixins: [MinxinVue],
    props: ['activeName'],
    data () {
      return {
        columns,
        loading: false,
        breadcrumbItems: [{
          router: '',
          label: '监察任务'
        }, {
          router: '/specialWorkTablelist',
          label: '专项工作'
        }],
        selectParams: {
          workType: [],
          charger: '',
          localStatus: [],
          startDate: '',
          foreFinishDate: ''
        },
        workTypeOptions: [{
          value: '专项报告',
          label: '专项报告'
        }, {
          value: '临时计算',
          label: '临时计算'
        }, {
          value: '定期工作',
          label: '定期工作'
        }, {
          value: '纪律处分',
          label: '纪律处分'
        }, {
          value: '自律监管',
          label: '自律监管'
        }, {
          value: '系统优化',
          label: '系统优化'
        }, {
          value: '技术创新',
          label: '技术创新'
        }, {
          value: '分析研究',
          label: '分析研究'
        }],
        statusOptions: [{
          value: '0',
          label: '创建中'
        }, {
          value: '1',
          label: '组员拟稿'
        }, {
          value: '2',
          label: '组长审核'
        }, {
          value: '3',
          label: '办结'
        }],
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSizeNumber: 10
        },
        total: 0,
        startpickerOption: {
          disabledDate: (time) => {
            return time.getTime() >= Date.now() - 8.46e6
          }
        },
        endpickerOption: {
          disabledDate: (time) => {
            return time.getTime() <= new Date(this.selectParams.startDate).getTime() - 3600 * 1000 * 24
          }
        },
        rules: {}
      }
    },
    mounted () {
      let loadVuexData = this.resetVuex()
      if (loadVuexData) {
        let {workType, startDate, foreFinishDate, charger, localStatus} = this.$store.state.superviseTask.specialWork
        this.selectParams.workType = workType
        this.selectParams.startDate = startDate
        this.selectParams.foreFinishDate = foreFinishDate
        this.selectParams.charger = charger
        this.selectParams.localStatus = localStatus
      }
      this.getAllData()
    },
    methods: {
      commitQueryParams () {
        let params = {
          workType: this.selectParams.workType, // 工作类别
          startDate: this.selectParams.startDate, // 开始日期
          foreFinishDate: this.selectParams.foreFinishDate, // 预计完成日期
          charger: this.selectParams.charger, // 负责人
          localStatus: this.selectParams.localStatus // 状态
        }
        let user = this.gfnGetUsername()
        this.$store.commit('saveSpecialWorkQueryParams', params)
        this.$store.commit('saveUser', user)
      },
      handlerClick (code, name) {
        this.selectParams.charger = name
      },
      getPageination (val) {
        this.pagination = val
        this.getAllData()
      },
      handleSearch () {
        this.commitQueryParams()
        this.pagination.currentPage = 1
        this.pagination.pageSizeNumber = 10
        this.getAllData()
      },
      handledeleteform (row) {
        if (row.operateDelete === '删除') {
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let params = {
              'instanceId': row.instanceId
            }
            params = JSON.stringify(params)
            specialWorkdelete(params).then(() => {
              this.getAllData()
            })
          }).catch(() => {

          })
        }
      },
      handleform (row) {
        this.commitQueryParams()
        let isoperateCheck = ''
        if (row.operateCheck === '查看') {
          isoperateCheck = '1'
        }
        if (row.operateProcess === '处理') {
          isoperateCheck = '2'
        }
        this.$router.push({path: '/creatingSpecialWork',
          query: {
            operate: isoperateCheck,
            taskId: row.taskId,
            instanceId: row.instanceId,
            processStatus: row.localStatusCode
          }
        })
      },
      getAllData () {
        let data = {
          'workType': this.selectParams.workType.join(','),
          'startDate': this.selectParams.startDate,
          'foreFinishDate': this.selectParams.foreFinishDate,
          'charger': this.selectParams.charger,
          'status': this.selectParams.localStatus.join(','),
          'pageIndex': this.pagination.currentPage,
          'pageRows': this.pagination.pageSizeNumber
        }
        this.loading = true
        specialWorktablelist(JSON.stringify(data)).then((resp) => {
          this.loading = false
          this.tableData = resp.buzidata
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].charger = JSON.parse(this.tableData[i].charger).label
          }
          this.total = resp.totalNum
        })
      },
      getStockCode (stockCodeData) {
        this.commonData.stockCode = stockCodeData
      },
      clearAllData () {
        this.$refs.selectParams.resetFields()
        this.$refs.selectorDealer.clearValue()
        this.selectParams = {
          workType: [],
          charger: '',
          localStatus: [],
          startDate: '',
          foreFinishDate: ''
        }
      },
      routerProcessPage () {
        this.$router.push({
          path: './creatingSpecialWork'
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .specialWork {
    .customize-width {
      width: 350px;
    }
  }
</style>
