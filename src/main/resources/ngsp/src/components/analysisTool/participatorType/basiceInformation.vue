<!--基本资料 basiceInformation -->
<template>
  <div class="basiceInformation">
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-col :span="5" class="name">
            <span class="mustInput name">*</span>{{informationCodeType}}代码：
          </el-col>
          <el-col :span="11">
            <el-input
              type="text"
              disabled
              v-model="commonData.uploadCode"
              placeholder="请输入参与者账户代码"
              size="small">
            </el-input>
          </el-col>
        </el-col>
        <!--含信用代码-->
        <el-col :span="2" style="margin: 6px 0 0 -140px;" v-if="participateType=== 'account'">
          <el-checkbox v-model="inCredit" size="small">含信用代码</el-checkbox>
        </el-col>
        <el-col :span="3" style="float: right;text-align: center;">
          <el-button
            type="primary" size="small"
            @click="getQueryRes">查询
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="basiceInformationShow">
      <div slot="header">
        <span>查询结果</span>
        <el-dropdown @command="handleExportData" style="float: right;">
          <el-button type="primary" size="mini">
            导出 <i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="excel"><i class="el-icon-document"></i>全部导出为EXCEL</el-dropdown-item>
            <el-dropdown-item command="csv"><i class="el-icon-tickets"></i>全部导出为CSV</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          v-if="participateType === 'account' || participateType === 'salePart'"
          type="primary"
          size="small"
          style="float:right; "
          @click="alarmReporting">预警记录
        </el-button>
        <el-button
          type="primary"
          v-if="false"
          @click="agencyVisible=true"
          size="small">批注文件
        </el-button>
        <el-dialog
          title="增加批注和文件"
          :visible.sync="agencyVisible"
          width="700px">
          <el-form :model="doubleDoubleVisible">
            <el-form-item
              label="代码："
              :label-width="formLabelPS">
              <el-select v-model="doubleDoubleVisible.dialogData"
                         placeholder="前选择代码">
                <el-option
                  v-for="dialogFor in dialogDataOption"
                  :key="dialogFor.value"
                  :label="dialogFor.label"
                  :value="dialogFor.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="备注："
              :label-width="formLabelPS">
              <el-input v-model="doubleDoubleVisible.remarktext"
                        style="width:92.5%"
                        v-bind:maxlength=1000
                        placeholder="字符限制1000以内"
                        type="textarea">
                <el-option
                  v-for="dialogFor in dialogDataOption"
                  :key="dialogFor.value"
                  :label="dialogFor.label"
                  :value="dialogFor.value">
                </el-option>
              </el-input>
            </el-form-item>
            <el-form-item>
              <text-upload @getTxtCon="getTxtData" :uploadOption="uploadOption" style="display: inline;"></text-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="veryfy">确认</el-button>
            <el-button type="text" size="samll" @click="cancleVeryfy">取消</el-button>
          </div>

        </el-dialog>
      </div>
      <!--账户-->
      <div class="queryResult">
        <el-row>
          <el-col>
            <el-table
              border
              width="100%"
              ref="accountRerf"
              :data="accountDatas"
              show-overflow-tooltip
              v-loading="loading"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)"
              style="width:100%;">
              <el-table-column v-if="participateType == 'account'"
                               prop="rn"
                               type="index"
                               label=""
                               align="center"
                               sortable
                               width="50px">
              </el-table-column>
              <el-table-column v-if="participateType == 'salePart'"
                               prop="rn"
                               type="index"
                               label=""
                               align="center"
                               sortable
                               width="50px">
              </el-table-column>
              <el-table-column v-if="participateType == 'account'"
                               label="账户代码"
                               sortable
                               width="200px"
                               align="left">
                <template slot-scope="scope">
                  <span class="slotScope"
                        type="text" size="small"
                        @click="toDetailA(scope.row.acct_id)">
                    {{scope.row.acct_id}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="participateType == 'account'"
                               v-for="column in account_BASICE"
                               :key="column.field"
                               :align="column.align"
                               :label="column.label"
                               :prop="column.field"
                               :sortable=column.sortable
                               :sort-method="column.sortMethod"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column v-if="participateType == 'uniteCode'"
                               v-for="column in uniteCode_BASICE"
                               :key="column.field"
                               :align="column.align"
                               :label="column.label"
                               :prop="column.field"
                               :sortable=column.sortable
                               :sort-method="column.sortMethod"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column v-if="participateType == 'salePart'"
                               v-for="column in salePart_BASICE"
                               :key="column.field"
                               :align="column.align"
                               :label="column.label"
                               :prop="column.field"
                               :sortable=column.sortable
                               :sort-method="column.sortMethod"
                               show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" style="margin-bottom: 0;">
            <el-pagination
              :page-size="currentPageSize_A"
              layout="total"
              :total="totalNumber_A"
              size="mini">
            </el-pagination>
          </el-col>
        </el-row>
        <el-row class="resultTitle">
          <el-col :span="24" :offset="1">
            <span @click="accessoryClick">批注及文件 <i class="el-icon-arrow-down"></i> </span>
          </el-col>
          <el-col :span="24" v-show="accessoryTop" style="padding-top: 20px">
            <el-table
              :data="annotationFileData"
              border
              style="width: 100%; "
              v-loading="loading"
              element-loading-spinner="el-icon-loading"
              element-loading-text="数据加载中，请耐心等待..."
              element-loading-background="rgba(0,0,0,0.3)"
              show-overflow-tooltip>
              <el-table-column
                prop="a"
                sortable
                label="代码">
              </el-table-column>
              <el-table-column
                prop="b"
                sortable
                label="操作人">
              </el-table-column>
              <el-table-column
                prop="c"
                sortable
                label="上传时间">
              </el-table-column>
              <el-table-column
                prop="d"
                label="批注">
              </el-table-column>
              <el-table-column
                prop="e"
                label="附件1">
              </el-table-column>
              <el-table-column
                prop="f"
                label="附件2">
              </el-table-column>
              <el-table-column
                prop="g"
                label="附件3">
              </el-table-column>
              <el-table-column
                prop="h"
                label="附件4">
              </el-table-column>
              <el-table-column
                prop="i"
                label="附件5">
              </el-table-column>
            </el-table>
            <el-pagination
              :page-size="currentPageSize_B"
              layout="total"
              :total="totalNumber_B"
              size="mini">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>

  // 上传组件
  import TextUpload from '../../common/textUpload'

  import {
    postBaisice,  // 基本资料接口
    downloadTransactionStatistice    // 参与者查询【基本资料】按条件下载数据
  } from '../../../service/analysisTool/participatorType/index'

  export default {
    name: 'basiceInformations',
    props: ['commonData', 'informationCodeType', 'salePartListVAL', 'currentSelectData'],
    components: {
      TextUpload
    },
    data () {
      return {
        loading: false,
        salePartOptions: [],
        basiceInformationShow: false, // 查询结果显示
        inCredit: false, // 含信用代码
        agencyVisible: false, // 增加批注和文件弹框
        accessoryTop: false, // 批注及文件
        formLabelPS: '120px',
        // 备注
        doubleDoubleVisible: {
          dialogData: '',
          remarktext: ''
        },
        dialogDataOption: [], // 备注

        // 上传账号
        filelist: [{
          name: '11.txt',
          url: 'https:/Users/Default'
        }],
        // 账户
        account_BASICE: [
          {
            label: '账号名称',
            field: 'acct_name',
            align: 'left',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_name')
          },
          {
            label: '信用账户代码',
            field: 'e_acct_id',
            align: 'left',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'e_acct_id')
          },
          {
            label: 'PBU代码',
            field: 'pbu_id',
            align: 'left',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_id')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            align: 'left',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          },
          {
            label: '券商名称',
            field: 'member_name',
            align: 'left',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'member_name')
          },
          {
            label: '身份证号',
            field: 'id_card',
            align: 'left',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'id_card')
          },
          {
            label: '姓名',
            field: 'name',
            align: 'left',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'id_card')
          }
        ],
        // 营业部
        salePart_BASICE: [
          // {label: "", field: "rn", width: "40px", align: "left",sortable: true,sortMethod: this.gfnSortColByNumber.bind(this, 'rn')},
          {
            label: '营业部代码',
            field: 'branch_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_id')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          },
          {
            label: '地址',
            field: 'branch_addr',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_addr')
          },
          {
            label: '负责人',
            field: 'branch_charge',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_charge')
          },
          {
            label: '电话',
            field: 'branch_tel',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_tel')
          }
        ],
        // 一码通
        uniteCode_BASICE: [
          {
            label: '一码通账户',
            field: 'ymt_acct_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ymt_acct_id')
          },
          {
            label: '一码通名称',
            field: 'ymt_acct_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'ymt_acct_name')
          },
          {
            label: '账户代码',
            field: 'acct_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'acct_id')
          },
          {
            label: '账户名称',
            field: 'acct_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'acct_name')
          },
          {
            label: '信用账户代码',
            field: 'crrt_acct_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'crrt_acct_id')
          },
          {
            label: 'PBU代码',
            field: 'pbu_id',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'pbu_id')
          },
          {
            label: '营业部名称',
            field: 'branch_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'branch_name')
          },
          {
            label: '券商名称',
            field: 'member_name',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortByChineseCharacters.bind(this, 'member_name')
          },
          {
            label: '身份证号',
            field: 'id_card',
            width: '12%',
            align: 'left',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'id_card')
          }
        ],
        accountDatas: [], // tab 数据
        annotationFileData: [], // 批注及文件 tab 数据

        // 账户分页
        currentPage_A: 1, // 当前页默认值  1 页
        PagingSizes_A: [10, 20, 50, 100], // 分页    [10, 20, 50, 100],
        currentPageSize_A: 10, // 当前页默认值 10 条数据,
        totalNumber_A: 0, // 数据总条数

        // 账户附件 分页
        currentPage_B: 1, // 当前页默认值  1 页
        PagingSizes_B: [10, 20, 50, 100], // 分页    [10, 20, 50, 100],
        currentPageSize_B: 10, // 当前页默认值 10 条数据,
        totalNumber_B: 0, // 数据总条数
        participateType: '',
        branchCodes: '', // 查询营业部代码列表，用于跳转历史预警列表使用
        sheetNameTab: '' // 导出表格名称
      }
    },
    methods: {
      // 账户类型
      getParticipateType () {
        this.participateType = this.commonData.participateType
        if (this.participateType === 'salePart') {
          this.commonData.uploadCode = this.salePartListVAL
        } else {
          this.commonData.uploadCode = this.commonData.uploadCode
        }
      },

      handelpreview () {

      },
      handelremove () {

      },
      getTxtData (TxtData) {
        this.remarktext = TxtData.join(',')
      },
      /* 导出数据 */
      exportData (type) {
        let params = this.getRequestParams()
        params.fileType = type
        params.type = 'basicInfo'
        params.tableColumns = [{
          sheetName: this.sheetNameTab,
          fileColumns: this.tableColumnsData
        }]
        console.log(params)
        downloadTransactionStatistice(params)
      },
      // 导出数据操作
      handleExportData (val) {
        switch (this.commonData.participateType) {
          case 'account':
            this.sheetNameTab = '账户基本资料'
            this.tableColumnsData = this.account_BASICE
            break
          case 'uniteCode':
            this.sheetNameTab = '一码通基本资料'
            this.tableColumnsData = this.uniteCode_BASICE
            break
          case 'salePart':
            this.sheetNameTab = '营业部基本资料'
            this.tableColumnsData = this.salePart_BASICE
            break
          case 'member':
            this.sheetNameTab = '券商基本资料'
            break
          case 'pbu':
            this.sheetNameTab = 'PBU基本资料'
            break
        }
        this.exportData(val)
      },
      // 预警记录
      alarmReporting () {
        switch (this.commonData.participateType) {
          case 'account' : // 账户
            window.open(window.location.origin + '/#/alarmList/?accountId=' + this.commonData.uploadCode + '&activeName=HistoryAlarmlist')
            break
          case 'uniteCode': // 一码通，暂未预警记录
            // window.open(window.location.origin + '/#/alarmList/?memberId=' + this.commonData.uploadCode + '&activeName=HistoryAlarmlist');
            break
          case 'salePart': // 营业部
            window.open(window.location.origin + '/#/alarmList/?branchId=' + this.branchCodes + '&activeName=HistoryAlarmlist')
            break
          case 'member': // 会员
            window.open(window.location.origin + '/#/alarmList/?memberId=' + this.commonData.uploadCode + '&activeName=HistoryAlarmlist')
            break
          case 'pbu': // pbu
            // window.open(window.location.origin + '/#/alarmList/?uploadCode=' + this.commonData.uploadCode + '&activeName=HistoryAlarmlist');
            break
        }
      },
      // 批注及文件
      accessoryClick () {
        if (this.accessoryTop) {
          this.accessoryTop = false
        } else {
          this.accessoryTop = true
        }
      },
      veryfy () {
      },
      cancleVeryfy () {
      },

      // 账户分页
      PagingSizeChange_A (val) {
        this.currentPageSize_A = val
        this.getQueryRes()
      },
      // 账户当前页
      currentPageChange_A (val) {
        this.currentPage_A = val
        this.getQueryRes()
      },
      // 账户附件分页
      PagingSizeChange_B (val) {
        this.currentPageSize_B = val
        // this.getQueryRes();
      },
      // 账户附件当前页
      currentPageChange_B (val) {
        this.currentPage_B = val
        // this.getQueryRes();
      },
      getRequestParams () {
        // 复选框是否选择，选择1，未选0
        let isContain = this.inCredit
        let isContainE = isContain ? '1' : '0'
        let salePartCode = ''
        let salePartCodeVal = []
        if (this.commonData.participateType === 'salePart') {
          let salePartCodeObj = this.currentSelectData
          salePartCodeObj.forEach((el) => {
            salePartCodeVal.push(el.value)
          })
          salePartCode = salePartCodeVal.join(',')
          /* 跳转历史预警列表使用 */
          this.branchCodes = salePartCode
        } else {
          salePartCode = this.commonData.uploadCode
        }
        return {
          actorCode: salePartCode,
          actorType: this.commonData.participateType,
          pageIndex: this.currentPage_A,
          pageRows: this.currentPageSize_A,
          isContainE: isContainE
        }
      },
      // 查询
      getQueryRes () {
        this.basiceInformationShow = false
        let params = this.getRequestParams()
        this.loading = true
        postBaisice(params).then((resp) => { // 基本资料接口
          this.loading = false
          this.basiceInformationShow = true
          this.accountDatas = resp.bizData.metaData
          this.totalNumber_A = resp.bizData.rows
        })
      },
      // 订单详情页面
      toNewOpen (url, height = 900, width = 1200) {
        window.open(url, 'orderParticulars', `height=${height}, width=${width}, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
      },
      // 订单详情
      toDetailA (acctId) {
        this.pageIndex = this.currentPage_A
        this.pageRows = this.currentPageSize_A
        this.accountId = acctId
        this.toNewOpen(`#/orderParticulars/${this.accountId}/${this.pageIndex}/${this.pageRows}`)
      }
    },
    watch: {},
    mounted () {
    }
  }
</script>
<style lang="less">
  .basiceInformation {
    margin-top: -23px;
    .slotScope {
      text-decoration: underline;
      color: rgba(107, 107, 224, 0.9);
    }
    .el-card {

      .el-card__body {
        padding-bottom: 10px;
      }

    }
    .queryResult {
      font-size: 14px;

      .item {
        margin-top: 20px;
        margin-bottom: 10px;
      }

    }
    .resultTitle {
      font-size: 16px;
      margin-top: 45px !important;
      margin-bottom: 15px;
    }

    .empty-result {
      text-align: center;
      padding-top: 150px;
      font-size: 16px;
    }

    .aLink {
      color: red;
    }

  }
</style>
