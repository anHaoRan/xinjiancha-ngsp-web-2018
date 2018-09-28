<!--成交对手方明细和对倒明细查询-->
<template>
  <div class='tradeReverseDetail'>
    <breadcrumb :breadcrumbList='breadcrumbItems'></breadcrumb>
    <el-tabs v-model='activeMenuName' @tab-click='handleMenuTabClick'>
      <el-tab-pane
              v-for='(item,index) in tabsMenu' :key='index'
              :label='item' :name='String(index)'>
        <keep-alive>
          <trade-detail-search-form v-if='String(index) === "0"' :defaultRelativeTradeDate="defaultRelativeTradeDate" @handleQuery='handleQuery'></trade-detail-search-form>
          <reverse-detail-search-form v-if='String(index) === "1"' :defaultRelativeTradeDate="defaultRelativeTradeDate"
                                      @handleQuery='handleQuery'></reverse-detail-search-form>
        </keep-alive>
        <el-card>
          <div slot='header'>
            <el-dropdown @command='handleExportData' style='float: right;'>
              <el-button type='primary' size='small'>
                导出 <i class='el-icon-arrow-down el-icon-right'></i>
              </el-button>
              <el-dropdown-menu slot='dropdown'>
                <el-dropdown-item command='excel'><i class='el-icon-document'></i>全部导出为EXCEL</el-dropdown-item>
                <el-dropdown-item command='csv'><i class='el-icon-tickets'></i>导出CSV</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <tab-table-pagination-component
                  :loading='loading'
                  :tabsType='`card`'
                  :tabPanes='tabPanesList[activeMenuName]'
                  :activeName='activeNames[activeMenuName]'
                  :tableDatas='tableDatas[activeMenuName]'
                  :tableColumns='tableColumns[activeMenuName]'
                  :paginations='paginations[activeMenuName]'
                  @handlePaginationChange='handlePaginationChange'
                  @updateActiveName='updateActiveName'>
          </tab-table-pagination-component>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
    import Breadcrumb from '@/components/common/Breadcrumb'
    import tabTablePaginationComponent from './componentsTool/common/tabTablePaginationComponent'
    import { tableColumns } from './componentsTool/tradeReverseDetail/tableColumns'
    import ReverseDetailSearchForm from './componentsTool/tradeReverseDetail/ReverseDetailSearchForm'
    import TradeDetailSearchForm from './componentsTool/tradeReverseDetail/TradeDetailSearchForm'
    import {getRelativeTradeDate} from '@/service/common/commonFunc'
    import { dateStringAddSeparator } from '@/utils/dateTimeFormat'
    import {
        postTradeCounterparties,
        postReverseDetail,
        exportTradeCounterparties,
        exportReverseDetail
    } from '@/service/analysisTool/complexQuery'

    export default {
        components: {
            ReverseDetailSearchForm,
            TradeDetailSearchForm,
            Breadcrumb,
            tabTablePaginationComponent
        },
        data () {
            return {
                tableColumns,
                loading: false,
                activeMenuName: '0',
                tabsMenu: ['成交对手方明细', '对倒明细'],
                tableDatas: [
                    {}, {}
                ],
                activeNames: ['0', '0'],
                tabPanesList: [[{label: '仅统计竞价交易数据'}, {label: '统计时包含大宗交易数据'}], [{label: '仅统计竞价交易数据'}, {label: '统计时包含大宗交易数据'}]],
                breadcrumbItems: [
                    {
                        router: '',
                        label: '分析工具'
                    }, {
                        router: '',
                        label: '数据综合查询'
                    }, {
                        router: '/tradeReverseDetail',
                        label: '成交对手方明细和对倒明细查询'
                    }
                ],
                currentngspUid: ['', ''],
                paginations: [
                    [{
                        currentPage: 1,
                        pageSizeNumber: 10
                    }, {
                        currentPage: 1,
                        pageSizeNumber: 10
                    }],
                    [{
                        currentPage: 1,
                        pageSizeNumber: 10
                    }, {
                        currentPage: 1,
                        pageSizeNumber: 10
                    }]
                ],
                defaultRelativeTradeDate: '',
                searchForms: [],
                searchedFormData: []
            }
        },
        methods: {
            updateActiveName (activeName) {
                this.activeNames[this.activeMenuName] = activeName
            },
            handlePaginationChange (paginations) {
                // let pagintationsNew = JSON.parse(JSON.stringify(this.paginations))
                // pagintationsNew[this.activeMenuName] = paginations
                // this.paginations = JSON.parse(JSON.stringify(pagintationsNew))
                this.paginations[this.activeMenuName] = paginations
                this.reqTableData(0)
            },
            handleMenuTabClick () {
            },
            reqTableData (type) {
                if (this.activeMenuName === '0') {
                    this.postTradeCounterpartiesData(type)
                } else if (this.activeMenuName === '1') {
                    this.postReverseDetailData(type)
                }
            },
            extendParams (params) {
                params.pageIndex = this.paginations[this.activeMenuName].map(v => {
                    return v.currentPage
                }).join(',')
                params.pageRows = this.paginations[this.activeMenuName].map(v => {
                    return v.pageSizeNumber
                }).join(',')
            },
            getCommonParams (type, num) {
                let searchForm = type === 1 ? this.searchForms[this.activeMenuName] : this.searchedFormData[this.activeMenuName]
                let params = {
                    startDate: searchForm.startDate,
                    endDate: searchForm.endDate,
                    startTime: searchForm.startTime,
                    endTime: searchForm.endTime,
                    secType: String(searchForm.secTypeAll) === '2' ? searchForm.chosenTypeListString : 0,
                    secCodes: String(searchForm.secTypeAll) === '2' ? '' : searchForm.secCodes,
                    isExport: 0, // 1代表导出报表
                    isNewQuery: type, // 判断是否是新查询,1是新查询，0是分页或导出
                    ngspUid: type ? '' : this.currentngspUid[num], // 后台上一次返回的ngspUid，如果是isNewQuery，置空
                    exportType: '' // excel,csv
                }
                /* 处理pageIndex，pageRows */
                this.extendParams(params)
                /* 处理账户id和账户组id */
                if (this.activeMenuName === '0') {
                    params.acctIds = searchForm.acctIds
                } else if (this.activeMenuName === '1') {
                    params.acctIds = searchForm.accountGroupAIds
                    params.acctIds2 = searchForm.accountGroupBIds
                }
                return params
            },
            postReverseDetailData (type) {
                let params = this.getCommonParams(type, 1)
                this.loading = true
                postReverseDetail(params).then(resp => {
                    this.loading = false
                    if (resp) {
                        this.currentngspUid[1] = resp['tab1']['ngsp_uid'] || ''
                        this.tableDatas[1] = resp
                    } else {
                        this.currentngspUid[1] = ''
                        this.tableDatas[1] = []
                    }
                })

                // setTimeout(() => {
                //   this.loading = false
                //   this.currentngspUid[1] = ''
                //   this.tableDatas[1] = {
                //     "tab1": {
                //         "ngsp_uid": "e3cd0705-787f-4916-a93d-688ba2532948",
                //         "data":
                //           [
                //             {
                //               "trade_date": "2015-04-01 00:00:00",
                //               "trade_time": "09:25:00",
                //               "trade_no": "1",
                //               "acct_group_a": "A",
                //               "acct_id_a": "A011088441",
                //               "acct_name_a": "噩锟斤拷锟斤拷",
                //               "acct_group_b": "B",
                //               "acct_id_b": "A537701218",
                //               "acct_name_b": "锟斤拷郛",
                //               "trade_vol": 300.0,
                //               "trade_amt": 2151.0,
                //               "id_card_b": "443806200895567438",
                //               "id_card_a": "090773090214692696"
                //             },
                //             {
                //               "trade_date": "2015-04-01 00:00:00",
                //               "trade_time": "09:25:00",
                //               "trade_no": "1",
                //               "acct_group_a": "B",
                //               "acct_id_a": "C013385849",
                //               "acct_name_a": "",
                //               "acct_group_b": "A",
                //               "acct_id_b": "C013496119",
                //               "acct_name_b": "",
                //               "trade_vol": 2000.0,
                //               "trade_amt": 1132.0,
                //               "id_card_b": "",
                //               "id_card_a": ""
                //             }
                //           ],
                //         "totalRowCount": "2"
                //       }
                //     ,
                //     "tab2": {
                //         "ngsp_uid": "e3cd0705-787f-4916-a93d-688ba2532948",
                //         "data": [
                //           {
                //             "trade_date": "2015-04-01 00:00:00",
                //             "trade_time": "09:25:00",
                //             "trade_no": "1",
                //             "acct_group_a": "A",
                //             "acct_id_a": "A011088441",
                //             "acct_name_a": "噩锟斤拷锟斤拷",
                //             "acct_group_b": "B",
                //             "acct_id_b": "A537701218",
                //             "acct_name_b": "锟斤拷郛",
                //             "trade_vol": 300.0,
                //             "trade_amt": 2151.0,
                //             "id_card_b": "443806200895567438",
                //             "id_card_a": "090773090214692696"
                //           },
                //           {
                //             "trade_date": "2015-04-01 00:00:00",
                //             "trade_time": "09:25:00",
                //             "trade_no": "1",
                //             "acct_group_a": "B",
                //             "acct_id_a": "C013385849",
                //             "acct_name_a": "",
                //             "acct_group_b": "A",
                //             "acct_id_b": "C013496119",
                //             "acct_name_b": "",
                //             "trade_vol": 2000.0,
                //             "trade_amt": 1132.0,
                //             "id_card_b": "",
                //             "id_card_a": ""
                //           }
                //           ],
                //         "totalRowCount": "2"
                //       }
                //   }
                // }, 1000)
            },
            postTradeCounterpartiesData (type) {
                let params = this.getCommonParams(type, 0)
                this.loading = true
                postTradeCounterparties(params).then(resp => {
                    this.loading = false
                    if (resp) {
                        this.currentngspUid[0] = resp['tab1']['ngsp_uid'] || ''
                        this.tableDatas[0] = resp
                    } else {
                        this.currentngspUid[0] = ''
                        this.tableDatas[0] = []
                    }
                })
                // setTimeout(() => {
                //   this.loading = false
                //   this.currentngspUid[0] = ''
                //   this.tableDatas[0] = {
                //     "tab1": {
                //       "ngsp_uid": "e3cd0705-787f-4916-a93d-688ba2532948",
                //       "data":
                //         [],
                //       "totalRowCount": "0"
                //     }
                //     ,
                //     "tab2": {
                //       "ngsp_uid": "e3cd0705-787f-4916-a93d-688ba2532948",
                //       "data": [],
                //       "totalRowCount": "0"
                //     }
                //   }
                // }, 1000)
            },
            formatTime (time) {
                return time.replace(/:/g, '')
            },
            handleExportData (type) {
                let num = this.activeMenuName
                if (this.tableDatas[num].length < 0) {
                    this.$message.error('暂无数据可以导出')
                    return
                }
                let params = {
                    exportType: type,
                    isExport: 1,
                    isNewQuery: 0, // 判断是否是新查询,1是新查询，0是分页或导出
                    ngspUid: this.currentngspUid[num], // this.currentngspUid,
                    // tabIndex: 'tab' + (this.activeName + 1),
                    tableColumns: {
                        tab1: this.tableColumns[num][0],
                        tab2: this.tableColumns[num][1]
                    }
                }
                if (type === 'csv') { // 只能导出当前tab下的csv文件
                    params.tabIndex = 'tab' + (+this.activeNames[num] + 1)
                }
                if (num === '0') {
                    exportTradeCounterparties(params)
                } else if (num === '1') {
                    exportReverseDetail(params)
                }
            },
            handleQuery (newSearchForm) {
                this.searchForms[this.activeMenuName] = newSearchForm
                this.searchedFormData[this.activeMenuName] = JSON.parse(JSON.stringify(newSearchForm))
                this.paginations[this.activeMenuName].forEach(v => {
                    v.currentPage = 1
                })
                this.reqTableData(1)
            }
        },
        mounted () {
            /* 缺省为T-1个交易日 */
            getRelativeTradeDate(-1).then(resp => {
                this.defaultRelativeTradeDate = dateStringAddSeparator(resp)
            })
        }
    }
</script>
<style lang='less' scoped>
  .tradeReverseDetail {

  }
</style>
