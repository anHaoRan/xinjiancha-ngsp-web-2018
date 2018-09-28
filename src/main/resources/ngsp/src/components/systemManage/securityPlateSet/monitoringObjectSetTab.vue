<!--监控对象设置Tab 表 -->
<template>
  <div class='monitoringObjectSetTab'>
    <el-card class='el-card-table'>
      <el-tabs type='card' v-model='activeName' @tab-click='handleClick'>
        <el-tab-pane
          :disabled='!!($route.query.watchObTypeId !== null && String($route.query.watchObTypeId) && String($route.query.watchObTypeId) !== String(index))'
          :label='item.tabLabel' :name='item.tabName' v-for='(item,index) in tabPanes' :key='item.tabName'>
          <common-monitoring-tab-component
            :loadingProps='loading'
            :tabName='item.tabName'
            :searchFormProps='item.searchForm'
            :leftColumnsProps='item.leftColumns'
            :rightColumnsProps='item.rightColumns'
            :leftTableDataProps='leftTableData'
            :rightTableDataProps='rightTableData'
            :leftTotalNumProps='leftTotalNum'
            :rightTotalNumProps='rightTotalNum'
            :watchObTypeIdProps='watchObTypeId'
            @updateTableData='handleClick'
            @updateWatchObTypeId='updateWatchObTypeId'
          ></common-monitoring-tab-component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import { tabPanes } from './monitoringTab/tabOptions'
  import commonMonitoringTabComponent from './monitoringTab/CommonMonitoringTabComponent'
  import {
    postSecuritiesTraderLeft,
    postSecuritiesTraderRight,
    postSalePartLeft,
    postSalePartRight,
    postPBULeft,
    postPBURight,
    postSecuritiesPlateLeft,
    postSecuritiesPlateRight,
    postGroupLeft,
    postGroupRight,
    postUserGroupType // 获取账户组下拉框列表
  } from '@/service/systemManage/securityPlateSet'

  export default {
    name: 'monitoringObjectSetTab',
    components: {
      commonMonitoringTabComponent
    },
    data () {
      return {
        loading: false,
        tabPanes, // tab配置项
        watchObTypeId: null,
        activeName: 'memberTab',
        leftTableData: [],
        leftTotalNum: 0,
        rightTableData: [],
        rightTotalNum: 0,
        watchOBTypeMap: {
          'memberTab': 0,
          'salePartTab': 1,
          'pbuTab': 2,
          'securitiesPlateTab': 3,
          'groupaddTab': 4
        }

      }
    },
    watch: {
      rightTotalNum (newValue) {
        if (newValue) {
          this.watchObTypeId = this.watchOBTypeMap[this.activeName]
        } else {
          this.watchObTypeId = null
        }
        this.$router.push({
          path: 'monitoringObjectSetTab',
          query: {watchObTypeId: this.watchObTypeId, watchOBID: this.$route.query.watchOBID}
        })
      }
    },
    methods: {
      searchAccountTypeGroup () {
        /* 账户组类型下拉框列表 */
        postUserGroupType().then((resp) => {
          if (resp) {
            this.tabPanes[4]['searchForm'][2]['options'] = resp.buzidata
          } else {
            this.tabPanes[4]['searchForm'][2]['options'] = []
          }
        })
      },
      updateWatchObTypeId (newValue) {
        this.watchObTypeId = newValue
      },
      handleClick (val) {
        this.watchObTypeId = this.watchOBTypeMap[val.name]
        switch (val.name) {
          case 'memberTab':
            if (val.type && val.type === 'left') {
              this.getMemberTabLeftTableData(val)
            } else if (val.type && val.type === 'right') {
              this.getMemberTabRightTableData(val)
            } else {
              this.getMemberTabLeftTableData(val)
              this.getMemberTabRightTableData(val)
            }
            break
          case 'salePartTab':
            if (val.type && val.type === 'left') {
              this.getSalePartTabLeftTableData(val)
            } else if (val.type && val.type === 'right') {
              this.getSalePartTabRightTableData(val)
            } else {
              this.getSalePartTabLeftTableData(val)
              this.getSalePartTabRightTableData(val)
            }
            break
          case 'pbuTab':
            if (val.type && val.type === 'left') {
              this.getPbuTabLeftTableData(val)
            } else if (val.type && val.type === 'right') {
              this.getPbuTabRightTableData(val)
            } else {
              this.getPbuTabLeftTableData(val)
              this.getPbuTabRightTableData(val)
            }
            break
          case 'securitiesPlateTab':
            if (val.type && val.type === 'left') {
              this.getSecuritiesPlateTabLeftTableData(val)
            } else if (val.type && val.type === 'right') {
              this.getSecuritiesPlateTabRightTableData(val)
            } else {
              this.getSecuritiesPlateTabLeftTableData(val)
              this.getSecuritiesPlateTabRightTableData(val)
            }
            break
          case 'groupaddTab':
            if (val.type && val.type === 'left') {
              this.getGroupAddTabLeftTableData(val)
            } else if (val.type && val.type === 'right') {
              this.getGroupAddTabRightTableData(val)
            } else {
              this.getGroupAddTabLeftTableData(val)
              this.getGroupAddTabRightTableData(val)
            }
            break
        }
      },
      getMemberTabLeftTableData (item) {
        // 券商左table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID, // 监控对象标识
          'memberID': item.searchCode || '', // 劵商代码
          'MemberName': item.searchName || '' // 劵商名称
        }
        this.loading = true
        postSecuritiesTraderLeft(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.leftTableData = buzidata
            this.leftTotalNum = totalNum
          }
        })
      },
      getMemberTabRightTableData (item) {
        // 券商右table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID // 监控对象标识
        }
        this.loading = true
        postSecuritiesTraderRight(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.rightTableData = buzidata
            this.rightTotalNum = totalNum
          }
        })
      },
      getSalePartTabLeftTableData (item) {
        // 营业部左table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID, // 监控对象标识
          'branchID': item.searchCode || '', // 营业部代码
          'branchName': item.searchName || '' // 营业部名称
        }
        this.loading = true
        postSalePartLeft(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.leftTableData = buzidata
            this.leftTotalNum = totalNum
          }
        })
      },
      getSalePartTabRightTableData (item) {
        // 营业部右table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID // 监控对象标识
        }
        this.loading = true
        postSalePartRight(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.rightTableData = buzidata
            this.rightTotalNum = totalNum
          }
        })
      },
      getPbuTabLeftTableData (item) {
        // PBU左table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID, // 监控对象标识
          'PBUID': item.searchCode || '', // PBU代码
          'PBUName': item.searchName || '' // PBU名称
        }
        this.loading = true
        postPBULeft(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.leftTableData = buzidata
            this.leftTotalNum = totalNum
          }
        })
      },
      getPbuTabRightTableData (item) {
        // PBU右table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID // 监控对象标识
        }
        this.loading = true
        postPBURight(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.rightTableData = buzidata
            this.rightTotalNum = totalNum
          }
        })
      },
      getSecuritiesPlateTabLeftTableData (item) {
        // 证券左table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID, // 监控对象标识
          'gatherID': item.searchCode || '', // 证券代码
          'gatherName': item.searchName || '' // 证券名称
        }
        this.loading = true
        postSecuritiesPlateLeft(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.leftTableData = buzidata
            this.leftTotalNum = totalNum
          }
        })
      },
      getSecuritiesPlateTabRightTableData (item) {
        // 证券右table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID // 监控对象标识
        }
        this.loading = true
        postSecuritiesPlateRight(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.rightTableData = buzidata
            this.rightTotalNum = totalNum
          }
        })
      },
      getGroupAddTabLeftTableData (item) {
        // 账户组左table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID, // 监控对象标识
          'groupID': item.searchCode || '', // 账户组代码
          'groupName': item.searchName || '', // 账户组名称
          'typeID': item.accountType || '' // 类型
        }
        this.loading = true
        postGroupLeft(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.leftTableData = buzidata
            this.leftTotalNum = totalNum
          }
        })
      },
      getGroupAddTabRightTableData (item) {
        // 账户组右table数据
        let params = {
          'pageIndex': item.currentPage || 1,
          'pageRows': item.pageSizeNumber || 10,
          'watchOBID': this.$route.query.watchOBID // 监控对象标识
        }
        this.loading = true
        postGroupRight(JSON.stringify(params)).then((resp) => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.rightTableData = buzidata
            this.rightTotalNum = totalNum
          }
        })
      }
    },
    mounted () {
      const {watchObTypeId} = this.$route.query
      this.watchObTypeId = watchObTypeId
      this.activeName = watchObTypeId ? this.tabPanes[watchObTypeId]['tabName'] : 'memberTab'
      this.handleClick({name: this.activeName})
      /* 获取账户组类型下拉列表 */
      this.searchAccountTypeGroup()
    }
  }
</script>
<style lang='less' scoped>
  .monitoringObjectSetTab {
    /deep/ .el-tabs--card > .el-tabs__header {
      margin-bottom: 0;
      border: none;
      /deep/ .el-tabs__nav-wrap {
        padding: 20px 0;
        /deep/ .el-tabs__nav {
          border: none;
          /deep/ .el-tabs__item.is-active {
            background-color: #12bba5;
            border: 1px solid #12bba5;
          }
          > div {
            height: 30px;
            line-height: 30px;
            border: 1px solid #7b8fb9;
            box-sizing: border-box;
            margin-right: 20px;
            border-radius: 4px;
            font-size: 14px;
          }
        }
      }
    }
  }

</style>
