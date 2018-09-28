
<template>
  <div class="right-selected-tags-wrap">
    <!--手动选择对话框-->
    <el-dialog width="80%" title="手动选择" :visible.sync="showHandChoosePop"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="handleDialogClose"
               append-to-body>
      <hand-choose-setting ref="handChooseSetting"
                           :loadingProps="loading"
                           :loadingTree="loadingTree"
                           :sliderTreeListProps="sliderTreeList"
                           :currentSelectedListProps="rightTableData"
                           :leftTableData="leftTableData"
                           :leftTotalNumProps="leftTotalNum"
                           :rightTotalNumProps="rightTotalNum"
                           :currentDialogName='currentDialogName'
                           @rightAjaxFn="rightAjaxFn"
                           @leftAjaxFn="leftAjaxFn"
                           @refreshCancelBox="handleDialogClose"
                           @refreshSaveBox="refreshSaveFunc"
                           @updateTableTransferingData="updateTableTransferingData"
                           @fazzyAllStockCode="getAllBlockStockCodes"
      ></hand-choose-setting>
    </el-dialog>
    <h4>{{currentDialogName === 'customPlateSetting' ? '我的自选股' : '我的自定义投资者'}}</h4>
    <el-button :disabled="(currentDialogName === 'customPlateSetting' && !getcurrentBoardCode)
                    || (currentDialogName === 'classifiedInvestorSetting' && !getcurrentOrgCode)"  type="primary" size="small" @click="toShowHandChoosePop">手动选择</el-button>
    <!--<upload-txt-file-component
      :currentDialogName="currentDialogName"
      ref="uploadTxtFileComponentRef"
      @updateFileExportList="updateFileExportList"
      ></upload-txt-file-component>-->
    <file-upload
      style="display:inline-block"
      ref="uploadTxtFileComponentRef"
      :actionUrl="gfnGetUploadFlatReturnBasicUrl()"
      :uploadOption="{
        size: 'small',
        type: 'primary',
        name: '文件导入',
        disabledflag: ((currentDialogName === 'customPlateSetting' && !getcurrentBoardCode)
                    || (currentDialogName === 'classifiedInvestorSetting' && !getcurrentOrgCode))
      }"
      :uploadParams="{
        parseRule: JSON.stringify({
          'delimiter': ',',
          'firstToSkip': 1
        }),
      }"
      @getTxtCon="updateFileExportList"
    >
    </file-upload>
    <el-button type="primary" size="small" style="margin-left:10px"
               @click="downloadTemplate">模板下载</el-button>
    <el-button :disabled="(currentDialogName === 'customPlateSetting' && !getcurrentBoardCode)
    || (currentDialogName === 'classifiedInvestorSetting' && !getcurrentOrgCode)"  type="text" @click="handleClearTags">清空</el-button>
    <el-card class="select-list">
      <div slot="header">
        <div v-if="currentDialogName==='customPlateSetting'">
          <stock-code-search
            :hasEnterEvent="true"
            @showLoading="showLoading"
            @ajaxTagList="refreshSaveFunc"
            @updateSelectTags="setTags"></stock-code-search>
        </div>
        <div v-if="currentDialogName==='classifiedInvestorSetting'">
          <investor-search
            :hasEnterEvent="true"
            @ajaxTagList="refreshSaveFunc"
            @updateSelectTags="setTags"></investor-search>
        </div>
      </div>
      <div v-if="currentDialogName === 'customPlateSetting'"
           style="width: 100%;min-height: 300px"
           element-loading-spinner="el-icon-loading"
           element-loading-text="数据加载中，请耐心等待..."
           element-loading-background="rgba(0,0,0,0.3)"
           v-loading="loading">
        <el-tag :key="index"
                v-for="(item, index) in tags"
                closable
                @close="handleCloseTag(item, index)">
          {{item.instrument_chn_short_name}}&nbsp;&nbsp;&nbsp;{{item.instrument_id}}
        </el-tag>
        <div v-if="tags.length === 0" style="text-align:center;">暂无数据</div>
      </div>

      <template v-if="currentDialogName === 'classifiedInvestorSetting'">
        <self-transfer-table-component
          ref="selfTableRef"
          :loadingProps="loading"
          :columnsProps="columns"
          :tableDataProps="tags"
          :totalNumProps="totalNum"
          :isSelectionType="false"
          @reqConnectinvestoraccounts="reqConnectinvestoraccounts"
          @deleteTableTag="handleCloseTag"
        ></self-transfer-table-component>
      </template>
    </el-card>
  </div>
</template>
<script>
  import FileUpload from '@/components/common/textUpload'
  import handChooseSetting from './HandChooseSetting'
  import selfTransferTableComponent from './SelfTransferTableComponent'
  import investorSearch from './InvestorSearch'
  import stockCodeSearch from './StockCodeSearch'
  import {getIndividualStock} from '@/service/marketSupervise'
  import {
    getInvestortypeList,
    updateBoardStockList,
    fileExportAccounts,
    getConnectinvestoraccounts,
    getUnconnectinvestoraccountsBycur,
    deleteAccounts,
    handSelectSaveAccounts,
    deleteStockByCode,
    coverUpdateBoardStockList
    // getDownloadTemplateFileInfo,
  } from '@/service/systemManage/securityPlateSet'
  import {getComposeMeta} from '@/service/marketSupervise/stockOperationMonitor'
  import {mapGetters} from 'vuex'
  export default {
    name: 'rightSelectedTagsComponent',
    props: {
      loadingProps: {
        type: Boolean,
        required: true
      },
      tagsProps: {
        type: Array,
        default() {
          return []
        }
      },
      currentDialogName: {
        type: String,
        required: true
      },
      pageIndexProps: {
        type: Number,
        default: 1
      },
      pageRowsProps: {
        type: Number,
        default: 10
      },
      totalNumProps: {
        type: Number,
        default: 0
      },
      sliderList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    watch: {
      tagsProps(newValue) {
        this.setTags(newValue)
      },
      loadingProps(newValue) {
        this.loading = newValue
      },
      totalNumProps(newValue) {
        this.totalNum = newValue
      }
    },
    components: {
      handChooseSetting,
      selfTransferTableComponent,
      investorSearch,
      stockCodeSearch,
      FileUpload
    },
    computed: {
      ...mapGetters(['getcurrentBoardCode', 'getcurrentOrgCode'])
    },
    data() {
      return {
        totalNum: 0,
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
        timeout: null,
        sliderTreeList: [],
        searchTagText: '', // 模糊搜索
        tags: [], // 已连接列表
        showHandChoosePop: false,
        leftTableData: [],
        rightTableData: [],
        leftTotalNum: 0,
        rightTotalNum: 0,
        loading: false,
        loadingTree: false
      }
    },
    methods: {
      handleDialogClose(done) {
        let text = this.currentDialogName === 'customPlateSetting' ? '证券代码' : '账户'
        this.$confirm(`请先保存一下导入${text}，否则新导入${text}将丢失，是否确定关闭？`, '提示', {
          confirmButtonText: '确定关闭',
          cancelButtonText: '取消关闭'
        }).then(() => {
          this.showHandChoosePop = false
          done()
        }).catch(() => {})
      },
      downloadTemplate() {
        /* 首先获取需要的fileId和fileName */
        let txtCode = this.currentDialogName === 'customPlateSetting' ? 'stock_txt' : 'account_txt'
        /* getDownloadTemplateFileInfo(txtCode).then(resp => {
         if (resp) {
         const {fileId, fileName} = resp
         this.gfnDownloadFile(fileId, fileName)
         }
         }) */
        this.gfnDownloadTemplateFile({code: txtCode})
      },
      reqConnectinvestoraccounts(item) {
        this.$emit('reqConnectinvestoraccounts', item)
      },
      showLoading(flag) {
        this.loading = flag || false
      },
      updateTableTransferingData(leftTableData, rightTableData) {
        this.leftTableData = leftTableData
        this.rightTableData = rightTableData
        this.leftTotalNum = leftTableData.length
        this.rightTotalNum = rightTableData.length
      },
      leftAjaxFn(pageIndex, pageRows, investorid, isCover) {
        let {orgflg} = this.$refs['handChooseSetting'].currentSelectedTreeNode
        let params = {
          pageIndex: pageIndex || 1,
          pageRows: pageRows || 10,
          orgcode: this.getcurrentOrgCode,
          accttype: orgflg || '',
          investorids: this.rightTableData.map(v => {
            return v.investor_account_id
          }).join(','),
          investorid: investorid || ''
        }
        this.loading = true
        getUnconnectinvestoraccountsBycur(params).then(resp => {
          this.loading = false
          if (resp) {
            const {buzidata} = resp
            if (isCover || params.pageIndex === 1) {
              this.leftTableData = []
              this.leftTableData = buzidata
              /* 右侧页码重置为1 */
              this.$refs['handChooseSetting'].resetLeftTablePageIndex()
              this.$refs['handChooseSetting'].continuLoad('left')
            } else {
              this.leftTableData = this.leftTableData.concat(buzidata)
            }
            this.leftTotalNum = this.leftTableData.length
            if (buzidata.length < params.pageRows) {
              this.$refs['handChooseSetting'].stopLoad('left')
            } else {
              this.$refs['handChooseSetting'].continuLoad('left')
            }
          } else {
            this.$refs['handChooseSetting'].stopLoad('left')
          }
        })
      },
      rightAjaxFn(pageIndex, pageRows, isCover) {
        let params = {
          pageIndex: pageIndex || 1,
          pageRows: pageRows || 10,
          orgcode: this.getcurrentOrgCode
        }
        this.loading = true
        getConnectinvestoraccounts(params).then(resp => {
          this.loading = false
          if (resp) {
            const {buzidata, totalNum} = resp
            this.rightTotalNum = totalNum
            if (isCover || params.pageIndex === 1) {
              this.rightTableData = []
              this.rightTableData = buzidata
              /* 右侧页码重置为1 */
              this.$refs['handChooseSetting'].resetRightTablePageIndex()
              this.$refs['handChooseSetting'].continuLoad('right')
            } else {
              this.rightTableData = this.rightTableData.concat(buzidata)
            }
            this.rightTotalNum = this.rightTableData.length
            if (buzidata.length < params.pageRows) {
              this.$refs['handChooseSetting'].stopLoad('right')
            } else {
              this.$refs['handChooseSetting'].continuLoad('right')
            }
          } else {
            this.$refs['handChooseSetting'].stopLoad('right')
          }
        })
      },
      updateFileExportList(resp) {
        /* 将文件导入的list增量更新到已选列表 */
        if (resp && resp.length) {
          if (this.currentDialogName === 'customPlateSetting') {
            let params = {
              boardCode: this.getcurrentBoardCode,
              instrumentId: resp.join(',')
            }
            this.loading = true
            /* 针对status:500的处理loading方式 */
            setTimeout(() => {
              this.loading = false
            }, 5000)
            updateBoardStockList(params).then(res => {
              this.loading = false
              if (res) {
                this.$message.success('文件导入新增个股成功')
                // this.tags = res   后台接口只返回十条，有bug，只能重新刷新列表
                this.$emit('reqStockListByBoardCode')
              } else {
                this.$message.error('文件导入新增个股失败')
              }
            })
          } else {
            let params = {
              orgcode: this.getcurrentOrgCode,
              investorids: resp.join(',')
            }
            this.loading = true
            /* 针对status:500的处理loading方式 */
            setTimeout(() => {
              this.loading = false
            }, 5000)
            fileExportAccounts(params).then(res => {
              this.loading = false
              if (res.buzidata.indexOf('true') > -1) {
                this.$message.success('文件导入新增账户成功')
                /* 重新拉取第一页数据 */
                this.$emit('reqConnectinvestoraccounts', {
                  pageIndex: 1,
                  pageRows: 10,
                  isCover: true
                })
              } else {
                this.$message.error('文件导入新增账户失败')
              }
            })
          }
        }
      },
      reqSliderTreeList() {
        if (this.currentDialogName === 'classifiedInvestorSetting') {
          this.loadingTree = true
          getInvestortypeList().then(resp => {
            this.loadingTree = false
            if (resp) {
              const {buzidata} = resp
              this.sliderTreeList = buzidata
            }
          })
        } else {
          this.loadingTree = true
          getComposeMeta().then(resp => {
            this.loadingTree = false
            if (resp) {
              const {stock} = resp
              this.sliderTreeList = stock
            }
          })
        }
      },
      handleCloseTag(item, index) {
        if (this.currentDialogName === 'customPlateSetting') {
          let boardName
          this.sliderList.forEach(v => {
            if (v.boardCode === this.getcurrentBoardCode) {
              boardName = v.boardName
            }
          })
          let params = {
            'boardCode': this.getcurrentBoardCode,
            'boardName': boardName,
            'instrumentId': item.instrument_id
          }
          this.loading = true
          deleteStockByCode(params).then(resp => {
            this.loading = false
            if (resp) {
              this.tags.splice(index, 1)
            }
          })
        } else {
          let params = [
            {
              'orgcode': this.getcurrentOrgCode,
              'orgflg': item.investor_account_id,
              'investorid': item.investor_account_id
            }
          ]
          this.loading = true
          deleteAccounts(JSON.stringify(params)).then(resp => {
            this.loading = false
            if (resp) {
              this.$message.success('删除成功')
              this.tags.splice(index, 1)
              this.totalNum -= 1
            }
          })
        }
      },
      getAllBlockStockCodes(pageIndex, pageRows) {
        let params = {
          boardCodeList: '',
          indexCode: '',
          isinCodes: null,
          orderBy: '',
          orderType: 'DESC',
          secCodes: null,
          rowStart: pageIndex || 1,
          rowNum: pageRows || 10
        }
        getIndividualStock(params).then(res => {
          const {metaData} = res.bizData
          if (params.rowStart === 1) {
            this.leftTableData = metaData
          } else {
            this.leftTableData = this.leftTableData.concat(metaData)
          }
        })
      },
      toShowHandChoosePop() {
        this.showHandChoosePop = true;
        if (this.currentDialogName === 'customPlateSetting') {
          this.$nextTick(() => {
            this.$refs['handChooseSetting'].reqStockListByBoardCode()
            this.$refs['handChooseSetting'].currentSelectedTreeNode = {}
            this.reqSliderTreeList()
            /* 默认为全部板块下stockcodes */
            this.leftTableData = []
            // 如果需要做待选列表默认为所有板块下的个股，需要后台接口支持
            // this.getAllBlockStockCodes()
          })
        } else {
          this.$nextTick(() => {
            this.reqSliderTreeList()
            this.rightAjaxFn(1, 10, true)
            /* 右侧页码重置为1 */
            this.$refs['handChooseSetting'].resetRightTablePageIndex()
          })
        }
      },
      handleClearTags() {
        this.$confirm('确定清空？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (this.currentDialogName === 'customPlateSetting') {
            let params = {
              boardCode: this.getcurrentBoardCode,
              instrumentId: ''
            }
            this.loading = true
            coverUpdateBoardStockList(params).then(res => {
              this.loading = false
              this.refreshSaveFunc()
            })
          } else {
            let params = {
              orgcode: this.getcurrentOrgCode,
              investorids: ''
            }
            this.loading = true
            handSelectSaveAccounts(params).then(res => {
              this.loading = false
              if (res) {
                this.tags = []
              }
              this.totalNum = 0
              this.refreshSaveFunc()
            })
          }
        }).catch(() => {})
      },
      refreshSaveFunc() {
        if (this.currentDialogName === 'customPlateSetting') {
          this.$emit('reqStockListByBoardCode', {
            orderBy: '', // String instrument_id 或instrument_chn_short_name
            orderType: 'DESC', // 或ASC
            boardCode: this.getcurrentBoardCode
          })
        } else {
          this.$emit('reqConnectinvestoraccounts', {
            pageIndex: 1,
            pageRows: 10,
            orgcode: this.getcurrentOrgCode
          })
        }
        this.showHandChoosePop = false;
      },
      setTags(newValue) {
        this.tags = newValue
      }
    },
    created() {
      this.setTags(this.tagsProps)
    }
  }
</script>
<style lang="less" scoped>
  .right-selected-tags-wrap{
    width: 100%;
    h4{
      margin: 0 0 10px 0;
    }
    /deep/ .uploadBtn{
      display: inline-block;
      margin: 0 10px;
    }
    /deep/ .select-list {
      border: 1px solid #5e6063;
      height: 500px;
      overflow: auto;
      .el-card__header {
        border-bottom: 1px solid #424344;
        line-height: 35px;
      }
      .el-card__body {
        padding-top: 20px;
      }
      .el-tag {
        margin: 0 5px 5px 0;
      }
      label {
        font-size: 14px;
      }
    }
  }
</style>
