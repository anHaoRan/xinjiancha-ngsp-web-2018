<!-- 账户组 Tab  -->
<template>
  <div class="groupaddTab">
    <el-card class="el-card-table">
      <div slot="header">
        <span>查询条件</span>
        <el-button size="small" type="info" @click="goBack">返回</el-button>
        <el-button size="small" type="primary"
                   @click="handleSearch({type: 'left', currentPage: 1, pageSizeNumber: 10})">搜索
        </el-button>
        <!--<el-button size="small" type="primary" @click="handleExport">导出</el-button>-->
        <div style="display:inline-block;float:right">
          <file-upload
            style="display:inline-block"
            ref="upload"
            :limitFileType="['xls', 'xlsx']"
            :actionUrl="gfnGetUploadExcelReturnBasicUrl()"
            :uploadOption="{
              size: 'small',
              type: 'primary',
              name: '导入'
            }"
            :uploadParams="uploadParams"
            @getTxtCon="handleImport"
          >
          </file-upload>
        </div>
      </div>
      <el-row>
        <el-form ref="searchForm" :model="item" v-for="item in searchForm" :key="item.field" :inline="true"
                 style="display:inline-block;padding: 10px 0 0 20px;">
          <el-form-item :prop="item.searchCode" :label="item.label">
            <el-input v-if="item.type && item.type==='input'"
                      v-model="item[item.field]"
                      auto-complete="off"
                      :placeholder="`请输入${item.label}`"
                      size="mini">
            </el-input>
            <el-select v-if="item.type && item.type==='select'"
                       v-model="item[item.field]"
                       clearable
                       :placeholder="`请输入${item.label}`"
                       size="small">
              <el-option
                v-for="op in item.options"
                :key="op.type_id"
                :label="op.type_name"
                :value="op.type_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <el-card class="el-card-table">
      <el-row style="padding: 10px 20px;">
        <el-col :span="11">
          <self-transfer-table-component
            ref="leftTableRef"
            :type="`left`"
            :loadingProps="loading"
            :tableDataProps="leftTableDataProps"
            :columnsProps="leftColumnsProps"
            :leftTotalNumProps="leftTotalNumProps"
            :totalNumProps="leftTotalNumProps"
            @updateList="handleSearch"
            @updateCheckingList="updateCheckingList"
          ></self-transfer-table-component>
        </el-col>
        <el-col :span="2" class="button-group-wrap">
          <div class="button-group">
            <el-button type="text" :disabled="leftCheckingList.length < 1" @click="transToRight"><i
              class="el-icon el-icon-d-arrow-right"></i></el-button>
            <br>
            <el-button type="text" :disabled="rightCheckingList.length < 1" @click="transToLeft()"><i
              class="el-icon el-icon-d-arrow-left"></i></el-button>
          </div>
        </el-col>
        <el-col :span="11">
          <self-transfer-table-component
            ref="rightTableRef"
            :type="`right`"
            :loadingProps="loading"
            :tableDataProps="rightTableDataProps"
            :columnsProps="rightColumnsProps"
            :rightTotalNumProps="rightTotalNumProps"
            :totalNumProps="rightTotalNumProps"
            @updateList="handleSearch"
            @updateCheckingList="updateCheckingList"
          ></self-transfer-table-component>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import FileUpload from '@/components/common/textUpload'
  import selfTransferTableComponent from './SelfTransferTableComponent'
  import {
    postLeftMove, // (添加--右移)
    postRightMove, // (移除--左移)
    importWatchObjectType, // 导入监控对象类型
    exportWatchObject // 导出
  } from '@/service/systemManage/securityPlateSet'

  export default {
    name: 'commonMonitoringTabComponent',
    components: {
      selfTransferTableComponent,
      FileUpload
    },
    props: {
      tabName: {
        type: String,
        default: ''
      },
      searchFormProps: {
        type: Array,
        default () {
          return []
        }
      },
      leftColumnsProps: {
        type: Array,
        default () {
          return []
        }
      },
      rightColumnsProps: {
        type: Array,
        default () {
          return []
        }
      },
      leftTableDataProps: {
        type: Array,
        default () {
          return []
        }
      },
      rightTableDataProps: {
        type: Array,
        default () {
          return []
        }
      },
      leftTotalNumProps: {
        type: Number,
        default: 0
      },
      rightTotalNumProps: {
        type: Number,
        default: 0
      },
      loadingProps: {
        type: Boolean,
        default: false
      },
      watchObTypeIdProps: {
        default: null
      }
    },
    watch: {
      searchFormProps (newValue) {
        this.searchForm = newValue
      },
      loadingProps (newValue) {
        this.loading = newValue
      },
      watchObTypeIdProps (newValue) {
        this.watchObTypeId = newValue
      }
    },
    data () {
      return {
        loading: false,
        uploadParams: {
          loading: false,
          label: '上传Excel',
          type: 'primary',
          params: [
            {
              sheetIdx: 0,
              columnIdx: 0,
              firstToSkip: 0,
              lastToAbandon: 0
            }
          ]
        },
        searchForm: {},
        leftTableData: [],
        rightTableData: [],
        leftCheckingList: [],
        rightCheckingList: [],
        watchOBTypeMap: {
          'memberTab': 0,
          'salePartTab': 1,
          'pbuTab': 2,
          'securitiesPlateTab': 3,
          'groupaddTab': 4
        }
      }
    },
    methods: {
      handleExport () {
        exportWatchObject(this.$route.query.watchOBID)
      },
      goBack () {
        this.$router.push('/monitoringObjectSet')
      },
      transToRight () {
        let params = {
          'watchOBType': '',
          'watchOBID': this.$route.query.watchOBID, // 监控对象标识
          'productActorID': this.leftCheckingList.map(v => {
            return v[this.leftColumnsProps[0]['field']]
          }).join(',') // 关联对象的组
        }
        this.watchObTypeId ? params.watchOBType = this.watchObTypeId : params.watchOBType = this.watchOBTypeMap[this.tabName]
        // 当前对象的类型
        this.loading = true
        postLeftMove(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            /* 页码 - 1 */
            this.$refs[`leftTableRef`]['pageination']['currentPage'] = this.$refs[`leftTableRef`]['pageination']['currentPage'] - 1 || 1
            this.$message.success('操作成功!')
            this.handleSearch({
              type: 'left'
            })
            this.handleSearch({
              type: 'right'
            })
          }
        })
      },
      transToLeft () {
        let params = {
          'watchOBType': '',
          'watchOBID': this.$route.query.watchOBID, // 监控对象标识
          'productActorID': this.rightCheckingList.map(v => {
            return v.product_actor_id
          }).join(',') // 关联对象的组
        }
        this.watchObTypeId ? params.watchOBType = this.watchObTypeId : params.watchOBType = this.watchOBTypeMap[this.tabName]
        this.loading = true
        postRightMove(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            this.$refs[`rightTableRef`]['pageination']['currentPage'] = this.$refs[`rightTableRef`]['pageination']['currentPage'] - 1 || 1
            this.$message.success('操作成功!')
            this.handleSearch({
              type: 'left'
            })
            this.handleSearch({
              type: 'right'
            })
          }
        })
      },
      updateCheckingList (type, val) {
        if (type === 'left') {
          this.leftCheckingList = val
        } else if (type === 'right') {
          this.rightCheckingList = val
        }
      },
      handleSearch (item) {
        let currentPage, pageSizeNumber
        if (item) {
          currentPage = item.currentPage
          pageSizeNumber = item.pageSizeNumber
        }
        let searchCodeItem = this.searchForm.filter(v => {
          return v.field === 'searchCode'
        })
        let searchNameItem = this.searchForm.filter(v => {
          return v.field === 'searchName'
        })
        let accountTypeItem = this.searchForm.filter(v => {
          return v.field === 'accountType'
        })
        let params = {
          type: item ? item.type : '',
          name: this.tabName,
          currentPage: currentPage || ((item && item.type) ? this.$refs[`${item.type}TableRef`]['pageination']['currentPage'] : 1),
          pageSizeNumber: pageSizeNumber || ((item && item.type) ? this.$refs[`${item.type}TableRef`]['pageination']['pageSizeNumber'] : 10),
          searchCode: searchCodeItem ? searchCodeItem[0]['searchCode'].trim() : '',
          searchName: searchNameItem ? searchNameItem[0]['searchName'].trim() : '',
          accountType: accountTypeItem ? accountTypeItem[0] ? accountTypeItem[0]['accountType'] : '' : ''
        }
        this.$emit('updateTableData', params)
      },
      handleImport (codes) {
        // 当前对象的类型
        let params = {
          watchOBID: this.$route.query.watchOBID,
          watchOBType: '',
          codes: codes.join(',')
        }
        this.watchObTypeId ? params.watchOBType = this.watchObTypeId : params.watchOBType = this.watchOBTypeMap[this.tabName]
        importWatchObjectType(params).then(resp => {
          const {success, message} = resp
          if (success) {
            this.$message.success(message)
            this.handleSearch({
              type: 'left'
            })
            this.handleSearch({
              type: 'right'
            })
          } else {
            this.$message.error(message)
          }
        })
      }
    },
    mounted () {
      this.searchForm = JSON.parse(JSON.stringify(this.searchFormProps))
    }
  }

</script>
<style lang="less" scoped>
  .groupaddTab {
    .button-group-wrap {
      height: 425px;
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
  }

</style>
