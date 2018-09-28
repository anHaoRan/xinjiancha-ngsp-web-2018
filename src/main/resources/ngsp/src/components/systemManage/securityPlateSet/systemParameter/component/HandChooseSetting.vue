
<!-- 自定义板块设置-- 手动选择 handChooseSetting-->
<template>
  <div class="handChooseSetting">
    <el-row :gutter="20">
      <el-col :span="16">
        <label>待选成分</label>
      </el-col>
      <el-col :span="8">
        <label>已选成分</label>
        <el-button type="primary" size="mini" class="clearBtn" @click="clearRightData">清空</el-button>
      </el-col>
    </el-row>
    <el-row class="mainBox">
      <el-col :span="15">
        <el-card class="mainBoxCard">
          <div style="padding:20px;margin-bottom:30px">
            <!--<el-input :placeholder="currentDialogName==='classifiedInvestorSetting' ? '按照账户代码搜索' : '搜索关键字'" size="small" v-model="searchInput" clearable>
              <el-button slot="append" size="mini" icon="el-icon-search" @click="searchLeftTransferDataByInputText"></el-button>
            </el-input>-->
            <div v-if="currentDialogName==='customPlateSetting'">
              <stock-code-search
                @fazzySearchSelectItem="setLeftTransferData"></stock-code-search>
            </div>
            <div v-if="currentDialogName==='classifiedInvestorSetting'">
              <investor-search
                @updateAccountCode="updateAccountCode"
                @fazzySearchSelectItem="setLeftTransferData"></investor-search>
            </div>
          </div>
          <el-col :span="12" class="tree-wrap"
                  v-loading="loadingTree"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="数据加载中，请耐心等待..."
                  element-loading-background="rgba(0,0,0,0.3)">
            <el-tree
              v-if="currentDialogName === 'customPlateSetting'"
              :data="sliderTreeList"
              :props="customTreeProps"
              node-key="code"
              highlight-current
              accordion
              @node-click="handleNodeClick"
            ></el-tree>
            <el-tree
              v-if="currentDialogName === 'classifiedInvestorSetting'"
              :data="sliderTreeList"
              :props="classifyTreeProps"
              node-key="orgflg"
              highlight-current
              @node-click="handleNodeClick"
            ></el-tree>
          </el-col>
          <el-col :span="12">
            <div v-if="currentDialogName === 'customPlateSetting'">
              <!--自定义穿梭框 - 左-->
               <!--
               v-if="currentSelectedTreeNode"
               如果需要做待选列表默认为所有板块下的个股，需要后台接口支持
               -->

              <self-transfer-component
                :currentSelectedTreeNode="currentSelectedTreeNode"
                :loadingProps="loading"
                :type="`left`"
                :transferDataListProps="leftTransferData"
                :checkingListProps="leftCheckingList"
                @updateCheckingList="updateCheckingList"></self-transfer-component>
              <!--<self-transfer-table-component v-else
                ref="leftTableRef"
                :columnsProps="stockColumns"
                :loadingProps="loading"
                :type="`left`"
                :tableDataProps="leftTransferData"
                :totalNumProps="leftTotalNumProps"
                :checkingListProps="leftCheckingList"
                @updateCheckingList="updateCheckingList"
                @leftAjaxFn="fazzyAllStockCode"
              ></self-transfer-table-component>-->
            </div>
            <div v-if="currentDialogName === 'classifiedInvestorSetting'">
              <!--自定义穿梭table -左-->
              <self-transfer-table-component
                ref="leftTableRef"
                :columnsProps="columns"
                :loadingProps="loading"
                :type="`left`"
                :tableDataProps="leftTransferData"
                :totalNumProps="leftTotalNum"
                :checkingListProps="leftCheckingList"
                @updateCheckingList="updateCheckingList"
                @leftAjaxFn="leftAjaxFn"
              ></self-transfer-table-component>
            </div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="2" class="button-group-wrap">
        <div class="button-group">
          <el-button type="text" :disabled="leftCheckingList.length < 1" @click="handleTransfer('right')"><i class="el-icon el-icon-d-arrow-right"></i></el-button>
          <br>
          <el-button type="text" :disabled="rightCheckingList.length < 1" @click="handleTransfer()"><i class="el-icon el-icon-d-arrow-left"></i></el-button>
        </div>
      </el-col>
      <el-col :span="7">
        <el-card class="checking-list">
          <div v-if="currentDialogName === 'customPlateSetting'">
            <!--自定义穿梭框 - 右-->
            <self-transfer-component
              :loadingProps="loading"
              :type="`right`"
              :transferDataListProps="rightTransferData"
              :checkingListProps="rightCheckingList"
              @updateCheckingList="updateCheckingList"
            ></self-transfer-component>
          </div>
          <div v-if="currentDialogName === 'classifiedInvestorSetting'">
            <!--自定义穿梭table -右-->
            <self-transfer-table-component
              :columnsProps="columns"
              ref="rightTableRef"
              :loadingProps="loading"
              :type="`right`"
              :totalNumProps="rightTotalNumProps"
              :tableDataProps="rightTransferData"
              :checkingListProps="rightCheckingList"
              @updateCheckingList="updateCheckingList"
              @rightAjaxFn="rightAjaxFn"
            ></self-transfer-table-component>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="footerBtn">
      <el-button :loading="loading" size="small" type="primary" @click="handleSave">保存</el-button>
      <el-button size="small" type="text" @click="handleCancel">取消</el-button>
    </div>

  </div>
</template>
<script>
import investorSearch from './InvestorSearch'
import stockCodeSearch from './StockCodeSearch'
import {G_C_NOTE_LAZY_LOAD} from '@/utils/constants'
import selfTransferTableComponent from './SelfTransferTableComponent'
import selfTransferComponent from './SelfTransferComponent'
import {
  handSelectSaveAccounts,
  getAllStockListByBoardCode,
  getStockListByBoardCode,
  coverUpdateBoardStockList
} from '@/service/systemManage/securityPlateSet'
import {mapGetters} from 'vuex'
export default {
  name: 'handChooseSetting',
  components: {
    selfTransferComponent,
    selfTransferTableComponent,
    investorSearch,
    stockCodeSearch
  },
  props: {
    currentDialogName: {
      type: String,
      requierd: true
    },
    sliderTreeListProps: {
      type: Array,
      default() {
        return []
      }
    },
    currentSelectedListProps: {
      type: Array,
      default() {
        return []
      }
    },
    leftTableData: {
      type: Array,
      default() {
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
    loadingTree: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      stockColumns: [
        {
          field: 'instrument_chn_short_name',
          label: '证券名称',
          minWidth: '100'
        },
        {
          field: 'instrument_id',
          label: '证券代码',
          minWidth: '100'
        }
      ],
      columns: [
        {
          field: 'investor_account_id',
          label: '账户代码',
          minWidth: '100'
        },
        {
          field: 'ymt_account_id',
          label: '一码通',
          minWidth: '100'
        },
        {
          field: 'investor_account_name',
          label: '姓名',
          minWidth: '100'
        }
      ],
      sliderTreeList: [],
      currentSelectedTreeNode: {}, // 当前点选treeNode内容
      searchInput: '',
      customTreeProps: {
        children: 'childrens',
        label: 'name'
      },
      classifyTreeProps: {
        children: 'children',
        label: 'orgtype'
      },
      tempList: [], // 存储自定义板块左穿梭框内容，提供给过滤函数使用
      leftCheckingList: [], // 左框正在选择list
      rightCheckingList: [], // 右框正在选择list
      leftTransferData: [], // 左穿梭框data
      rightTransferData: [], // 右穿梭框data
      leftTotalNum: 0,
      accountCode: ''
    }
  },
  computed: {
    idKeyName() { // 穿梭框和table数据的唯一值key的名称。value/code
      return this.currentDialogName === 'customPlateSetting' ? 'instrument_id' : 'investor_account_id'
    },
    ...mapGetters(['getcurrentBoardCode', 'getcurrentOrgCode'])
  },
  methods: {
    updateAccountCode(val) {
      this.accountCode = val
    },
    fazzyAllStockCode(pageIndex, pageRows) {
      /* 当没有点选tree节点时，懒加载所有stockCode */
      this.$emit('fazzyAllStockCode', pageIndex, pageRows)
    },
    querySearchFn() {
      if (this.searchInput) {
        this.leftTransferData = this.tempList.filter(v => {
          return v.instrument_short.indexOf(this.searchInput) > -1 || v.instrument_id.indexOf(this.searchInput) > -1
        })
      } else {
        if (this.currentSelectedTreeNode.code) {
          this.handleNodeClick(this.currentSelectedTreeNode)
        } else {
          this.$message.error('请先选择一个板块')
        }
      }
    },
    searchLeftTransferDataByInputText() {
      if (this.currentDialogName === 'customPlateSetting') {
        this.querySearchFn()
      } else {
        this.leftAjaxFn(1, 10, this.searchInput, true)
      }
    },
    // 通过板块code获取已关联stockList
    reqStockListByBoardCode() {
      let params = {
        rowStart: 1, // Integer!
        rowNum: 3000, // Integer
        orderBy: 'instrument_id', // String instrument_id 或instrument_chn_short_name
        orderType: 'DESC', // 或ASC
        boardCode: this.getcurrentBoardCode
      }
      getStockListByBoardCode(params).then(resp => {
        if (resp) {
          this.rightTransferData = resp
        } else {
          this.rightTransferData = []
        }
      })
    },
    leftAjaxFn(pageIndex, pageRows, searchInput, isCover) {
      this.$emit('leftAjaxFn', pageIndex, pageRows, this.accountCode, isCover)
    },
    rightAjaxFn(pageIndex, pageRows) {
      this.$emit('rightAjaxFn', pageIndex, pageRows)
    },
    updateCheckingList(type, newValue) {
      if (type === 'left') {
        this.leftCheckingList = newValue
      } else {
        this.rightCheckingList = newValue
      }
    },
    transferCommonFn (checkingList, sourceData, targetData, toRight) {
      let checkingListMap = checkingList
      // 当为投资者设置模式时，转换checkingList
      checkingList = checkingList.map(v => {
        return v[this.idKeyName]
      })

      let sourceDataOut = sourceData.filter(v => {
        return checkingList.indexOf(v[this.idKeyName]) < 0
      })
      let targetDataOut
      if (!toRight) { // 向左穿梭
        // 判断是否是当前tree下面的元素
        let isHasInTreeListData = this.leftTransferData.filter(v => {
          return checkingList.indexOf(v[this.idKeyName]) > -1
        })
        targetDataOut = [...targetData, ...isHasInTreeListData]
      } else {
        targetDataOut = [...targetData, ...checkingListMap]
      }
      return {
        'sourceDataOut': sourceDataOut,
        'targetDataOut': targetDataOut,
        'checkingListOut': [] // reset checkingList
      }
    },
    handleTransfer(toRight) {
      if (toRight) { // type = 'right' 向右穿梭
        const { checkingListOut, sourceDataOut, targetDataOut } = this.transferCommonFn(this.leftCheckingList, this.leftTransferData, this.rightTransferData, toRight)
        this.leftCheckingList = checkingListOut
        this.leftTransferData = sourceDataOut
        this.rightTransferData = targetDataOut
      } else {
        const { checkingListOut, sourceDataOut, targetDataOut } = this.transferCommonFn(this.rightCheckingList, this.rightTransferData, this.leftTransferData, toRight)
        this.rightCheckingList = checkingListOut
        this.rightTransferData = sourceDataOut
        this.leftTransferData = targetDataOut
      }
      this.$emit('updateTableTransferingData', this.leftTransferData, this.rightTransferData)
      if (this.currentDialogName === 'classifiedInvestorSetting') {
        /* 重置第一页，重新排序 */
        this.leftAjaxFn(1, 10)
      }
    },
    handleNodeClick(item) {
      this.searchInput = ''
      if (this.currentDialogName === 'classifiedInvestorSetting') {
        this.currentSelectedTreeNode = item
        // 获取选中tree的待选列表
        this.leftAjaxFn(1, 10, this.searchInput, true)
      } else {
        if (item.childrens) {
          return
        }
        this.currentSelectedTreeNode = item
        // 获取选中tree的待选列表
        let params = {
          name: item.name,
          code: item.parentcode || item.code // 指数没有parentcode，取自己的code
        }
        this.loading = true
        getAllStockListByBoardCode(params).then(resp => {
          this.loading = false
          if (resp) {
            this.leftTransferData = resp
            this.$emit('updateTableTransferingData', this.leftTransferData, this.rightTransferData)
          }
        })
      }
      // 清空已选值
      this.leftCheckingList = []
    },
    clearRightData() {
      this.$confirm('确定清空？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.rightTransferData = []
        this.rightCheckingList = []
        this.$emit('updateTableTransferingData', this.leftTransferData, this.rightTransferData)
      }).catch(() => {})
    },
    handleCancel() {
      this.$emit('refreshCancelBox', false)
    },
    handleSave() {
      if (this.currentDialogName === 'customPlateSetting') {
        let params = {
          boardCode: this.getcurrentBoardCode,
          instrumentId: this.rightTransferData.map(v => {
            return v.instrument_id
          }).join(',')
        }
        coverUpdateBoardStockList(params).then(resp => {
          this.$emit('refreshSaveBox', this.rightTransferData)
          if (resp) {
            this.$message.success('保存成功')
          }
        })
      } else {
        let params = {
          orgcode: this.getcurrentOrgCode,
          investorids: this.rightTransferData.map(v => {
            return v.investor_account_id
          }).join(',')
        }
        this.loading = true
        handSelectSaveAccounts(params).then(resp => {
          this.loading = false
          if (resp.buzidata.indexOf('true') > -1) {
            this.$message.success('保存成功')
            this.$emit('refreshSaveBox', this.rightTransferData)
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
    setRightTransferData(value) {
      this.rightTransferData = value
    },
    setLeftTransferData(value) {
      if (this.currentDialogName === 'customPlateSetting') {
        let rightTransferTableIds = this.rightTransferData.map(v => {
          return v.instrument_id
        })
        value = value.filter(v => {
          return rightTransferTableIds.indexOf(v.instrument_id) < 0
        })
      }
      this.leftTransferData = value
      if (this.currentDialogName === 'classifiedInvestorSetting') {
        this.leftTotalNum = value.length
      }
    },
    resetRightTablePageIndex() {
      this.$refs['rightTableRef'].pageIndex = 1
    },
    resetLeftTablePageIndex() {
      this.$refs['leftTableRef'].pageIndex = 1
    },
    stopLoad(type) {
      if (type === 'left') {
        this.$refs['leftTableRef'].loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
      } else if (type === 'right') {
        this.$refs['rightTableRef'].loadingMoreNote = G_C_NOTE_LAZY_LOAD.full
      }
    },
    continuLoad(type) {
      if (type === 'left') {
        this.$refs['leftTableRef'].loadingMore = false
      } else if (type === 'right') {
        this.$refs['rightTableRef'].loadingMore = false
      }
    }
  },
  watch: {
    currentSelectedListProps(newValue) {
      this.setRightTransferData(newValue)
    },
    leftTableData(newValue) {
      this.tempList = newValue
      this.setLeftTransferData(newValue)
    },
    sliderTreeListProps (newValue) {
      this.sliderTreeList = newValue
    },
    loadingProps(newValue) {
      this.loading = newValue
    },
    leftTotalNumProps(newValue) {
      this.leftTotalNum = newValue
    }
  },
  created() {

  },
  mounted() {
    this.sliderTreeList = this.sliderTreeListProps
    // 设置已选tag列表到穿梭框
    this.setRightTransferData(this.currentSelectedListProps)
  }
}
</script>
<style lang="less" scoped>
  .handChooseSetting{
    .tree-wrap {
      padding: 0 50px;
      height: 475px;
      .el-tree {
        max-height: 360px;
        overflow: auto;
      }
    }
    .checking-list {
      height: 475px;
      padding-top: 20px;
    }
    .clearBtn{
      float: right;
    }
    .mainBox {
      margin-top: 10px;
      .el-input{
        width: 50%;
      }
      .mainBoxCard {
        height: 475px;
        padding-top: 20px;
      }
    }
    .footerBtn{
      text-align: center;
      margin-top: 20px;
    }
    .button-group-wrap {
      height: 475px;
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
