<template>
  <div class='monitorAccountDetail'>
    <el-card class='el-card-table' style='overflow: visible'>
      <el-row class='title'>
        <el-col :span='4'>
          <el-select
            v-model='stockValue'
            :clearable='true'
            filterable
            remote
            reserve-keyword
            placeholder='请输入关键字'
            :remote-method='remoteMethod'
            v-selectLoadMore="handleLoadSelectMore"
            :loading='loading'
            size='small'
            @change='setStockCode'
            style="width: 90%">
            <el-option
              v-for='item in stockCodeOptions'
              :key='item.index'
              :label='item.label'
              :value='item.value'>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='2'>
          <el-button type='primary' size='small' @click='query'>查询</el-button>
          <el-button type='info' size='small' @click='emptyCondition'>清空</el-button>
        </el-col>
      </el-row>
      <el-row class='tableTitle'>
        <el-col :span='9'>
          监控账户组及明细
        </el-col>
        <el-col :span='7'>
          <div type='info' size='mini' style='float: right;height: 1px;width: 1px'></div>
        </el-col>
        <el-col :span='7' v-if='isShow' :offset='1'>
          待分析账户
        </el-col>
      </el-row>
      <el-row :gutter='10' style='padding: 10px 0px'>
        <el-col :span='9'>
          <margin-table :columns="accountGroupColumns" :data="data" @getPageination="handSelectedRow" height='350'
                        @handlerChange="handlerChange" @row-click="getRow"></margin-table>
        </el-col>
        <el-col :span='7' v-if='isShow'>
          <el-table
            :data='accountDetailData'
            border
            tooltip-effect='dark'
            size='small'
            highlight-current-row
            height='350'
            @select='selectedRow'
            @select-all='selectedAllRow'
            v-tableLoadMore='handleTableLoadMore'
            :reserve-selection='true'
            ref='accountTable'
            style='width: 100%'>
            <el-table-column
              :check='check'
              header-align='center'
              align='center'
              type='selection'
              min-width='5%'>
            </el-table-column>
            <el-table-column
              v-for='column in accountDetailColumns'
              :key='column.field'
              :align='column.align'
              :prop='column.field'
              :label='column.label'
              :sortable='column.sortable'
              :sort-method='column.sortMethod'
              :min-width='column.minWidth'
              :show-overflow-tooltip="true">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span='1' style='text-align: center;' v-if='isShow'>
          <div class='icon'>
            <el-button type='text' class='el-icon-arrow-right' size='small' @click='throughData'></el-button>
          </div>
        </el-col>
        <el-col :span='7' v-if='isShow'>
          <div class="realtime-bpm">
            <el-button type='primary' circle class='skipBtn' @click='hitFlow' v-if='isJumpShow'>功能</el-button>
            <div class='superviseList'>
              <ul>
                <li @click='jumpFlow("自律监管")'>
                  <el-button type='primary' icon='el-icon-edit' circle></el-button>
                  <p>转自律监管</p>
                </li>
                <li @click='jumpFlow("调取资料")'>
                  <el-button type='primary' icon='el-icon-edit' circle></el-button>
                  <p>转调取资料</p>
                </li>
                <li @click='jumpFlow("联合监管")'>
                  <el-button type='primary' icon='el-icon-edit' circle></el-button>
                  <p>转联合监管</p>
                </li>
                <li @click='jumpFlow("重点监控股票")'>
                  <el-button type='primary' icon='el-icon-edit' circle></el-button>
                  <p>转重点监控股票</p>
                </li>
                <li @click='jumpFlow("重点监控账户组")'>
                  <el-button type='primary' icon='el-icon-edit' circle></el-button>
                  <p>转重点监控账户组</p>
                </li>
                <li @click='jumpFlow("日志")'>
                  <el-button type='primary' icon='el-icon-edit' circle></el-button>
                  <p>日志</p>
                </li>
              </ul>
            </div>
          </div>
          <el-table
            :data='analysedData'
            border
            tooltip-effect='dark'
            size='small'
            highlight-current-row
            height='350'
            @select='analysSelectedRow'
            @select-all='analysSelectedAllRow'
            style='width: 100%'>
            <el-table-column
              :check='check'
              header-align='center'
              align='center'
              type='selection'
              min-width='5%'>
            </el-table-column>
            <el-table-column
              v-for='column in analysedColumns'
              :key='column.field'
              :align='column.align'
              :prop='column.field'
              :label='column.label'
              :sortable='column.sortable'
              :sort-method='column.sortMethod'
              :min-width='column.minWidth'
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              min-width='6%'
              align='center'
              label='操作'>
              <template slot-scope='scope'>
                <el-button @click='deleteRow(scope.$index,scope.row)' type='info' size='mini'>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>

</template>

<script>
  import {
    postMonitorGroupData,
    postMonitorGroupDetailData,
    postFuzzyQuery
  } from '../../../service/analysisTool/realTimeMonitorAnalysisToll/index'
  import TableStock from './TableStock'
  import {G_C_NOTE_LAZY_LOAD} from './../../../utils/constants'

  export default {
    name: 'monitor-account-detail',
    components: {
      MarginTable: () => import('@/components/base/MarginTable')
    },
    data() {
      return {
        stockValue: '',
        data: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        accountGroupColumns: [
          {
            label: '账户组编号',
            field: 'accountArrCode',
            align: 'center',
            width: 90,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'accountArrCode')
          },
          {
            label: '账户组名称',
            field: 'accountArrName',
            align: 'center',
            width: 80,
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountArrName')
          },
          {
            label: '监控原因',
            field: 'monitorReason',
            align: 'center',
            width: 80,
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'monitorReason')
          },
          {
            label: '创建者',
            field: 'createPerson',
            align: 'center',
            width: 80,
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'createPerson')
          },
          {
            label: '涉及股票',
            field: 'stockCode',
            align: 'center',
            width: 80,
            template: TableStock,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'stockCode')
          },
          {
            label: '监控开始时间',
            field: 'sDate',
            align: 'center',
            width: 80,
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'sDate')
          },
          {
            label: '监控结束时间',
            field: 'eDate',
            align: 'center',
            width: 80,
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'eDate')
          }
        ],
        accountDetailData: [],
        accountDetailColumns: [
          {
            label: '账户代码',
            field: 'accountCode',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountCode')
          },
          {
            label: '账户名称',
            field: 'accountName',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountName')
          },
          {
            label: '营业部名称',
            field: 'branchName',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branchName')
          },
          {
            label: '一码通',
            field: 'ymtCode',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ymtCode')
          }
        ],
        analysedData: [],
        analysedColumns: [
          {
            label: '账户代码',
            field: 'accountCode',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountCode')
          },
          {
            label: '账户名称',
            field: 'accountName',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'accountName')
          },
          {
            label: '营业部名称',
            field: 'branchName',
            align: 'center',
            minWidth: '6%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branchName')
          },
          {
            label: '一码通',
            field: 'ymtCode',
            align: 'center',
            minWidth: '7%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ymtCode')
          }
        ],
        check: true,  // 表格选中
        isShow: true,
        isJumpShow: false,
        middleData: [],  // 左右穿梭中间值保存
        stockCodeOptions: [],  // 模糊查询
        loading: false,
        status: [],
        selectCheckedAccount: '',  // 选中的账户代码
        selectMonitorAccount: '',  // 待监控账户代码
        selectAnalysisAccount: [],  // 待分析账户代码
        monitorCheckArr: [],
        analysisCheckArr: [],
        CurrentPage: 1,
        PageTotal: 0,
        pageIndex: 1,
        pageRows: 10,
        loadingMore: false,  // 加载更多的状态
        loadingMoreNote: G_C_NOTE_LAZY_LOAD.loading,
        accountArrCode: '',
        accountPageIndex: 1,
        accountPageRow: 10,
        flowShow: false,
        monitorReason: '',
        lazyPageRows: 10,
        lazyPageIndex: 1,
        fuzzyChars: ''
      }
    },
    mounted() {
      this.getGroupData()
    },
    computed: {
      stockCode() {
        return this.$store.state.realTimeMonitorAnalysisToll.stockCode
      },
      stockCodeName() {
        return this.$store.state.realTimeMonitorAnalysisToll.stockCodeName
      }
    },
    methods: {
      handSelectedRow(val) {
        this.pageIndex = val.currentPage
        this.pageRows = val.pageSizeNumber
        this.data.pageIndex = val.currentPage
        this.data.pageRows = val.pageSizeNumber
        this.getGroupData()
      },
      handlerChange(val) {
        this.$emit('changeActiveName', val)
      },
      remoteMethod(query) {
        this.stockCodeOptions = [];
        this.lazyPageIndex = 1
        if (query !== '') {
          this.loading = true;
          this.fuzzyChars = query
          setTimeout(() => {
            let params = {fuzzyChars: this.fuzzyChars, pageRows: this.lazyPageRows, pageIndex: this.lazyPageIndex}
            postFuzzyQuery(params).then((resp) => {
              this.loading = false;
              resp.forEach((el) => {
                this.stockCodeOptions.push({
                  value: el.partici_name,
                  label: el.partici_name
                })
              })
            })
          }, 200)
        } else {
          this.stockCodeOptions = [];
        }
      },
      // 懒加载
      handleLoadSelectMore() {
        this.lazyPageIndex += 1
        let params = {fuzzyChars: this.fuzzyChars, pageRows: this.lazyPageRows, pageIndex: this.lazyPageIndex}
        postFuzzyQuery(params).then((resp) => {
          this.loading = false;
          resp.forEach((el) => {
            this.stockCodeOptions.push({
              value: el.partici_name,
              label: el.partici_name
            })
          })
        })
      },
      setStockCode(val) {
        if (!val) {
          this.stockCodeOptions = [];
        }
      },
      // 表格行选中
      selectedRow(selection) {
        this.middleData = selection
        this.monitorCheckArr = []
        selection.forEach((el) => {
          this.monitorCheckArr.push(el.accountCode)
        })
        let arr = this.monitorCheckArr.concat(this.analysisCheckArr)
        this.selectCheckedAccount = Array.from(new Set(arr))
        this.$store.commit('saveSelectCheckedCode', this.selectCheckedAccount)
      },
      // 表格行全选选中
      selectedAllRow(selection) {
        this.middleData = selection
        this.monitorCheckArr = []
        selection.forEach((el) => {
          this.monitorCheckArr.push(el.accountCode)
        })
        let arr = this.monitorCheckArr.concat(this.analysisCheckArr)
        this.selectCheckedAccount = Array.from(new Set(arr))
        this.$store.commit('saveSelectCheckedCode', this.selectCheckedAccount)
      },
      // 待分析表格行选中
      analysSelectedRow(selection) {
        this.analysisCheckArr = []
        selection.forEach((el) => {
          this.analysisCheckArr.push(el.accountCode)
        })
        let arr = this.monitorCheckArr.concat(this.analysisCheckArr)
        this.selectCheckedAccount = Array.from(new Set(arr))
        this.$store.commit('saveSelectCheckedCode', this.selectCheckedAccount)
      },
      // 待分析表格行全选
      analysSelectedAllRow(selection) {
        this.analysisCheckArr = []
        selection.forEach((el) => {
          this.analysisCheckArr.push(el.accountCode)
        })
        let arr = this.monitorCheckArr.concat(this.analysisCheckArr)
        this.selectCheckedAccount = Array.from(new Set(arr))
        this.$store.commit('saveSelectCheckedCode', this.selectCheckedAccount)
      },
      //  Table 懒加载
      handleTableLoadMore() {
        this.loadingMore = true
        this.loadingMoreNote = G_C_NOTE_LAZY_LOAD.loading
        this.getAccountData(this.accountPageIndex, this.accountPageRow + 10)
        this.accountPageRow += 10
      },
      // 表格行点击
      getRow(row) {
        this.isJumpShow = true
        this.monitorReason = row.monitorReason
        this.accountArrCode = row.accountArrCode
        this.accountPageRow = 10
        this.getAccountData(this.accountPageIndex, this.accountPageRow)
      },
      getAccountData(pageIndex, pageRows) {
        let params = {accountArrCode: this.accountArrCode, pageIndex: pageIndex, pageRows: pageRows}
        postMonitorGroupDetailData(params).then(resp => {
          this.accountDetailData = resp.ACCOUNTDETAIL_DATA
          this.$nextTick(function () {
            this.middleData.forEach(row => {
              let str1 = JSON.stringify(row)
              this.accountDetailData.forEach((el, index) => {
                let str2 = JSON.stringify(el)
                if (str1 === str2) {
                  this.$refs.accountTable.toggleRowSelection(this.accountDetailData[index], true)
                }
              })
            })
          })
          let selectArr = []
          this.accountDetailData.forEach((el) => {
            selectArr.push(el.accountCode)
          })
          this.selectMonitorAccount = selectArr
          this.$store.commit('saveSelectMonitorCode', this.selectMonitorAccount)
          this.monitorCheckArr = []
          let arr = this.monitorCheckArr.concat(this.analysisCheckArr)
          this.selectCheckedAccount = Array.from(new Set(arr))
          this.$store.commit('saveSelectCheckedCode', this.selectCheckedAccount)
        })
        this.isShow = true
      },
      throughData() {
        let middleArr = this.$store.state.realTimeMonitorAnalysisToll.selectCheckedCode
        // let selectArr = []
        this.middleData.forEach((el) => {
          middleArr.forEach((res, index) => {
            if (res == el.accountCode) {
              middleArr.splice(index, 1)
            }
          })
          this.selectAnalysisAccount.push(el.accountCode)
          if (!this.analysedData.length) {
            this.analysedData.push(el)
          } else {
            let index = this.analysedData.findIndex(item => {
              return item.accountCode == el.accountCode
            })
            if (index < 0) {
              this.analysedData.push(el)
            } else {
              this.$message.warning('账户代码已重复！')
            }
          }
        })
        // this.selectAnalysisAccount = selectArr
        this.$store.commit('saveSelectCheckedCode', middleArr)
        this.$store.commit('saveSelectAnalysisCode', this.selectAnalysisAccount)
        this.$refs.accountTable.clearSelection()
        this.middleData = []
      },
      // 删除行
      deleteRow(index, row) {
        this.analysedData.splice(index, 1)
        let analyseArr = []
        this.analysedData.forEach((el) => {
          analyseArr.push(el.accountCode)
        })
        this.selectAnalysisAccount = analyseArr
        this.$store.commit('saveSelectAnalysisCode', this.selectAnalysisAccount)

        this.analysisCheckArr.forEach((el, index) => {
          if (el == row.accountCode) {
            this.analysisCheckArr.splice(index, 1)
          }
        })
        let arr = this.monitorCheckArr.concat(this.analysisCheckArr)
        this.selectCheckedAccount = Array.from(new Set(arr))
        this.$store.commit('saveSelectAnalysisCode', this.selectAnalysisAccount)
      },
      // 查询
      query() {
        this.getGroupData()
      },
      // 清空
      emptyCondition() {
        this.stockValue = ''
        this.stockCodeOptions = [];
      },
      // 获取监控账户组数据
      getGroupData() {
        let params = {
          partici_name: this.stockValue,
          pageIndex: this.pageIndex,
          pageRows: this.pageRows
        }
        postMonitorGroupData(params).then(resp => {
          this.data.data = resp.ACCOUNTARR_DATA
          if (!resp.ACCOUNTARR_DATA.length) {
            this.data.total = 0
          } else {
            this.data.total = Number(resp.TOTAL)
          }
        })
      },
      // 流程跳转
      jumpFlow(str) {
        let param = {
          stockCode: this.stockCode,
          stockCodeName: this.stockCodeName,
          accountCode: this.$store.state.realTimeMonitorAnalysisToll.selectCheckedCode.join(','),
          monitorReason: this.monitorReason,
          createType: '2'
        }
        switch (str) {
          case '联合监管':
            window.open(`#/sendLetterFormPage?params=` + JSON.stringify(param))
            break;
          case '自律监管':
            window.open(`#/selfSupervisionFormPage?params=` + JSON.stringify(param)) // 重构后
            break;
          case '调取资料':
            window.open(`#/surveyFormPage?params=` + JSON.stringify(param)) // 重构后
            break;
          case '重点监控股票':
            window.open(`#/newBuiltSecurity?params=` + JSON.stringify(param))
            break;
          case '重点监控账户组':
            window.open(`#/newBuiltAccountGroup?params=` + JSON.stringify(param))
            break;
          case '日志':
            window.open(`#/superviseLog?params=` + JSON.stringify(param))
            break;
          default:
            break;
        }
      },
      hitFlow() {
        this.flowShow = !this.flowShow
      }
    }
  }
</script>

<style lang='less'>
  .monitorAccountDetail {
    .name {
      line-height: 32px;
      text-align: center;
    }
    .el-row {
      padding: 10px;
    }
    .title {
      border-bottom: 1px solid #273757;
    }
    .tableTitle {
      line-height: 30px;
      font-size: 16px;
      color: #fff;
      padding-bottom: 0px;
    }
    .icon {
      height: 30px;
      .el-button {
        font-size: 20px;
        color: #1b5eed;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }
    }
    tr td:first-child > div {
      padding: 0px !important;
      height: 23px;
    }
    tr th:first-child > div {
      padding: 0px !important;
      height: 23px;
    }
    .realtime-bpm {
      position: relative;

      &:hover {
        .superviseList {
          display: block;
        }
      }

      .superviseList {
        display: none;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 0px 15px;
        position: absolute;
        border-radius: 4px;
        z-index: 10;
        right: 10px;
        bottom: -430px;
        color: #fff;
        text-align: center;
        ul {
          padding-left: 0px;
          li {
            cursor: pointer;
          }
        }
      }
      .skipBtn {
        position: absolute;
        right: 0px;
        top: -70px;
        padding: 12px 20px !important;
        width: 50px;
        height: 50px;
        z-index: 100;
        span {
          position: relative;
          left: -10px;
        }
      }
    }
  }
</style>
