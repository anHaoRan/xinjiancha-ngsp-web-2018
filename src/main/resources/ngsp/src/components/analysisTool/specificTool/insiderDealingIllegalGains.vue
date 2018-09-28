/* eslint-disable */
<template>
  <div class="insiderBox">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <el-card style="width:100%">
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button type="text" @click="resetForm('ruleForm')" size="small">清空</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">查询</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="200px">
        <el-form-item label="内幕交易类型：" prop="typeValue" class="inlineBlock">
          <el-select v-model="ruleForm.typeValue" placeholder="请选择类型" clearable @change="changeParams"
                     style="width:168px;">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="佣金估算比率：" prop="ratio" class="inlineBlock">
          <el-input v-model.number="ruleForm.ratio" placeholder="请输入" clearable style="width:168px;"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="导入计算区间表：" prop="isUpload1" class="inlineBlock">
          <file-upload
            class="uploadBtn"
            ref="upload"
            :isShowSuccessMessage="true"
            :limitFileType="['xls', 'xlsx']"
            :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
            :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
            :uploadParams="uploadParams1"
            @getTxtCon="setFileData1"
          ></file-upload>
          <el-tag :type="uploadStatus1"> {{ uploadText1 }}</el-tag>
        </el-form-item>
        <el-form-item label="导入费率表：" prop="isUpload2" class="inlineBlock">
          <file-upload
            class="uploadBtn"
            ref="upload"
            :isShowSuccessMessage="true"
            :limitFileType="['xls', 'xlsx']"
            :actionUrl="gfnGetUploadExcelReturnPojoUrl()"
            :uploadOption="{size: 'small',type: 'primary',name: '上传Excel'}"
            :uploadParams="uploadParams2"
            @getTxtCon="setFileData2"
          ></file-upload>
          <el-tag :type="uploadStatus2"> {{ uploadText2 }}</el-tag>
        </el-form-item>
      </el-form>
    </el-card>
    <!--获利型对应查询结果tab表格-->
    <el-card v-if=" ruleForm.typeValue != '2' && isShowResult === true ">
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button type="info" @click="handleDownload('获利型')" :disabled=" isDownload " size="small">导出</el-button>
      </div>
      <el-tabs v-model="activeName">
        <!--引入表格分页组件-->
        <el-tab-pane label="买入明细表">
          <s-table :isHeader="false" :height="420" :columns="theadList[1]" :data="tableData[1]" :loading="loading"
                   @getPageination="getPageination1"></s-table>
        </el-tab-pane>
        <el-tab-pane label="卖出明细表">
          <s-table :isHeader="false" :height="420" :columns="theadList[2]" :data="tableData[2]" :loading="loading"
                   @getPageination="getPageination2"></s-table>
        </el-tab-pane>
        <el-tab-pane label="匹配结果表">
          <s-table :isHeader="false" :height="420" :columns="theadList[3]" :data="tableData[3]" :loading="loading"
                   @getPageination="getPageination3"></s-table>
        </el-tab-pane>
        <el-tab-pane label="违法所得输出表">
          <s-table :isHeader="false" :height="420" :columns="theadList[4]" :data="tableData[4]" :loading="loading"
                   @getPageination="getPageination4"></s-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--避损型对应查询结果tab表格-->
    <el-card v-if=" ruleForm.typeValue === '2' && isShowResult === true ">
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button type="info" @click="handleDownload('避损型')" :disabled=" isDownload " size="small">导出</el-button>
      </div>
      <el-tabs v-model="activeName">
        <!--引入表格分页组件-->
        <el-tab-pane label="卖出明细表">
          <s-table :isHeader="false" :height="420" :columns="theadList[2]" :data="tableData[2]" :loading="loading"
                   @getPageination="getPageination5"></s-table>
        </el-tab-pane>
        <el-tab-pane label="违法所得输出表">
          <s-table :isHeader="false" :height="420" :columns="theadList[5]" :data="tableData[5]" :loading="loading"
                   @getPageination="getPageination6"></s-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>

  </div>
</template>
/* eslint-disable */

<script>
  import Breadcrumb from '../../../components/common/Breadcrumb' // 引入面包屑组件
  import FileUpload from '@/components/common/textUpload'
  import STable from '../../base/STable' // 表格和分页组件
  import {getInsiderDealingIllegalGains} from '../../../service/analysisTool/specificTool/index' // 内幕交易违法所得查询接口

  export default { // eslint-disable-line
    components: {
      Breadcrumb,
      FileUpload,
      STable
    },
    data() {
      return {
        breadcrumbItems: [ // 面包屑
          {
            router: '',
            label: '分析工具'
          }, {
            router: '',
            label: '特定工具'
          }, {
            router: '/insiderDealingIllegalGains',
            label: '内幕交易违法所得'
          }],
        typeOptions: [ // 内幕交易类型下拉框
          {
            value: '1',
            label: '获利型'
          }, {
            value: '2',
            label: '避损型'
          }],
        ruleForm: { // 查询条件表单
          typeValue: '',
          ratio: 0.003,
          isUpload1: '',
          isUpload2: ''

        },
        rules: { // 查询条件表单验证
          typeValue: [
            {required: true, message: '请选择内幕交易类型', trigger: 'change'}
          ],
          ratio: [
            {required: true, message: '请输入佣金估算比例'},
            {type: 'number', message: '佣金估算比例必须为数字'}
          ],
          isUpload1: [
            {required: true, message: '请上传计算区间表', trigger: 'change'}
          ],
          isUpload2: [
            {required: true, message: '请上传费率表', trigger: 'change'}
          ]
        },
        uploadText1: '未上传',
        uploadStatus1: 'danger',
        uploadParams1: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['secCode', 'acctId', 'fromDate', 'toDate', 'openDate', 'calctoDate'] // 读取文件数据并以此格式返回数据
            }
          ])
        },
        uploadText2: '未上传',
        uploadStatus2: 'danger',
        uploadParams2: {
          parseRules: JSON.stringify([
            {
              firstToSkip: 1, // 前置忽略项
              fields: ['racctId', 'rfromDate', 'rtoDate', 'rate'] // 读取文件数据并以此格式返回数据
            }
          ])
        },
        activeName: '0',
        loading: false,
        isDownload: true,
        pageIndex: 1,
        pageRows: 10,
        tableData: {
          1: {data: [], total: 0, pageRows: 10, pageIndex: 1},
          2: {data: [], total: 0, pageRows: 10, pageIndex: 1},
          3: {data: [], total: 0, pageRows: 10, pageIndex: 1},
          4: {data: [], total: 0, pageRows: 10, pageIndex: 1},
          5: {data: [], total: 0, pageRows: 10, pageIndex: 1}
        },
        theadList: {
          1: [ // 买入明细表-列设置-获利型
            {label: '账户代码', field: 'acct_id', align: 'left', minWidth: '180'},
            {label: '成交日期', field: 'trade_date', align: 'left', minWidth: '180'},
            {label: '证券代码', field: 'sec_code', align: 'left', minWidth: '100'},
            {label: '成交时间', field: 'trade_time', align: 'left', minWidth: '100'},
            {label: '成交编号', field: 'trade_no', align: 'right', minWidth: '100'},
            {label: '买卖方向', field: 'trade_dir', align: 'left', minWidth: '100'},
            {label: '成交数量', field: 'trade_vol', align: 'right', minWidth: '180'},
            {label: '成交金额', field: 'trade_amt', align: 'right', minWidth: '100'},
            {label: '成交价格', field: 'trade_price', align: 'right', minWidth: '100'},
            {label: '席位号', field: 'pbu_id', align: 'left', minWidth: '100'}
          ],
          2: [ // 卖出明细表-列设置-获利型/避损型
            {label: '账户代码', field: 'acct_id', align: 'left', minWidth: '180'},
            {label: '成交日期', field: 'trade_date', align: 'left', minWidth: '180'},
            {label: '证券代码', field: 'sec_code', align: 'left', minWidth: '100'},
            {label: '成交时间', field: 'trade_time', align: 'left', minWidth: '100'},
            {label: '成交编号', field: 'trade_no', align: 'right', minWidth: '100'},
            {label: '买卖方向', field: 'trade_dir', align: 'left', minWidth: '100'},
            {label: '成交数量', field: 'trade_vol', align: 'right', minWidth: '180'},
            {label: '成交金额', field: 'trade_amt', align: 'right', minWidth: '100'},
            {label: '成交价格', field: 'trade_price', align: 'right', minWidth: '100'},
            {label: '席位号', field: 'pbu_id', align: 'left', minWidth: '100'}
          ],
          3: [ // 匹配结果表-列设置-获利型
            {label: '账户代码', field: 'acct_id', align: 'left', minWidth: '180'},
            {label: '成交日期', field: 'trade_date', align: 'right', minWidth: '180'},
            {label: '证券代码', field: 'sec_code', align: 'left', minWidth: '100'},
            {label: '成交时间', field: 'trade_time', align: 'right', minWidth: '100'},
            {label: '成交编号', field: 'trade_no', align: 'right', minWidth: '140'},
            {label: '成交数量', field: 'trade_vol', align: 'right', minWidth: '100'},
            {label: '成交金额', field: 'trade_amt', align: 'right', minWidth: '100'},
            {label: '成交价格', field: 'trade_price', align: 'right', minWidth: '100'},
            {label: '席位号', field: 'pbu_id', align: 'left', minWidth: '100'},
            {label: '匹配部分卖出量', field: 'match_sell_vol', align: 'right', minWidth: '100'},
            {label: '匹配部分卖出金额', field: 'match_sell_amt', align: 'right', minWidth: '100'},
            {label: '卖印花税', field: 'yhs_s', align: 'right', minWidth: '100'},
            {label: '卖过户费', field: 'ghf_s', align: 'right', minWidth: '100'},
            {label: '卖出佣金', field: 'yj_s', align: 'right', minWidth: '100'}
          ],
          4: [ // 违法所得输出表-列设置-获利型
            {label: '证券代码', field: 'sec_code', align: 'left', minWidth: '100'},
            {label: '账户代码', field: 'acct_id', align: 'left', minWidth: '180'},
            {label: '(A,B)期间的买入量', field: 'buy_vol', align: 'right', minWidth: '180'},
            {label: '(A,B)期间的买入金额 ', field: 'buy_amt', align: 'right', minWidth: '180'},
            {label: '送股数量', field: 'sg_vol', align: 'right', minWidth: '100'},
            {label: '配股数量', field: 'pg_vol', align: 'right', minWidth: '100'},
            {label: '配股金额', field: 'pg_amt', align: 'right', minWidth: '100'},
            {label: '分红金额', field: 'fh_amt', align: 'right', minWidth: '100'},
            {label: '匹配的卖出量', field: 'match_sell_vol', align: 'right', minWidth: '100'},
            {label: '匹配的卖出金额', field: 'match_sell_amt', align: 'right', minWidth: '180'},
            {label: '未匹配的剩余量', field: 'unmatch_vol', align: 'right', minWidth: '100'},
            {label: 'C后首个交易日收盘价', field: 'first_close_price', align: 'right', minWidth: '180'},
            {label: 'C后首个收盘打开涨跌停板日期', field: 'first_open_date', align: 'right', minWidth: '200'},
            {label: '首个收盘打开涨跌停板收盘价', field: 'first_open_price', align: 'right', minWidth: '200'},
            {label: '佣金', field: 'yj', align: 'right', minWidth: '180'},
            {label: '印花税', field: 'yhs', align: 'right', minWidth: '180'},
            {label: '过户费', field: 'ghf', align: 'right', minWidth: '180'},
            {label: '匹配部分盈利', field: 'yl_match', align: 'right', minWidth: '180'},
            {label: '未匹配部分盈利', field: 'yl_unmatch', align: 'right', minWidth: '180'}
          ],
          5: [ // 违法所得输出表-列设置-避损型
            {label: '证券代码', field: 'sec_code', align: 'left', minWidth: '100'},
            {label: '账户代码', field: 'acct_id', align: 'left', minWidth: '100'},
            {label: '(A,B)期间的卖出量', field: 'sell_vol', align: 'right', minWidth: '180'},
            {label: '(A,B)期间的卖出金额 ', field: 'sell_amt', align: 'right', minWidth: '180'},
            {label: 'C后首个交易日收盘价', field: 'first_close_price', align: 'right', minWidth: '180'},
            {label: 'C后首个收盘打开涨跌停板日期', field: 'first_open_date', align: 'right', minWidth: '200'},
            {label: '首个收盘打开涨跌停板收盘价', field: 'first_open_price', align: 'right', minWidth: '200'},
            {label: '佣金', field: 'yj', align: 'right', minWidth: '180'},
            {label: '印花税', field: 'yhs', align: 'right', minWidth: '180'},
            {label: '过户费', field: 'ghf', align: 'right', minWidth: '180'},
            {label: '违法所得', field: 'yl_nofee', align: 'right', minWidth: '180'},
            {label: '违法所得（已扣除税费）', field: 'yl_fee', align: 'right', minWidth: '180'}
          ]
        },
        qryId: '',
        isShowResult: false, // 是否显示查询结果
        queryParams: {} // 查询参数
      }
    },
    methods: {
      submitForm(formName) { // 表单验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleQueryData(1, 'ALL', 1, 10);
          } else {
            this.$message.error('查询失败！请补全查询参数~');
          }
        });
      },
      resetForm(formName) { // 清空
        this.$refs[formName].resetFields();
        this.uploadText1 = '未上传';
        this.uploadStatus1 = 'danger';
        this.uploadText2 = '未上传';
        this.uploadStatus2 = 'danger';
        this.loading = false;
        this.isDownload = true;
        this.tableData = {
          1: {data: [], total: 0, pageRows: 10, pageIndex: 1},
          2: {data: [], total: 0, pageRows: 10, pageIndex: 1},
          3: {data: [], total: 0, pageRows: 10, pageIndex: 1},
          4: {data: [], total: 0, pageRows: 10, pageIndex: 1},
          5: {data: [], total: 0, pageRows: 10, pageIndex: 1}
        };
        this.activeName = '0';
        this.isShowResult = false; // 是否展示查询结果
      },
      handleQueryData(isNewQuery, resType, pageIndex, pageRows) { // 查询
        this.loading = true;
        this.isShowResult = true; // 是否展示查询结果
        let params = {
          tradeType: this.ruleForm.typeValue,
          btwArr: this.ruleForm.isUpload1.Sheet0, // eslint-disable-line
          rateacArr: this.ruleForm.isUpload2.Sheet0, // eslint-disable-line
          commsnRate: this.ruleForm.ratio,
          isNewQuery: isNewQuery,
          isExport: 0,
          resType: resType,
          pageIndex: pageIndex,
          pageRows: pageRows,
          qryId: this.qryId
        };
        this.queryParams = params;
        /* eslint-disable */
        getInsiderDealingIllegalGains({params: JSON.stringify(params)}).then((resp) => {
          this.qryId = resp.qryId;
          if (this.ruleForm.typeValue == '1') {
            if (resp.res.res1) {
              this.tableData[1].data = resp.res.res1;
              this.tableData[1].total = resp.cnt.res1Cnt
            }
            if (resp.res.res2) {
              this.tableData[2].data = resp.res.res2;
              this.tableData[2].total = resp.cnt.res2Cnt
            }
            if (resp.res.res3) {
              this.tableData[3].data = resp.res.res3;
              this.tableData[3].total = resp.cnt.res3Cnt
            }
            if (resp.res.res4) {
              this.tableData[4].data = resp.res.res4;
              this.tableData[4].total = resp.cnt.res4Cnt
            }
          } else {
            if (resp.res.res1) {
              this.tableData[2].data = resp.res.res1;
              this.tableData[2].total = resp.cnt.res1Cnt
            }
            if (resp.res.res2) {
              this.tableData[5].data = resp.res.res2;
              this.tableData[5].total = resp.cnt.res2Cnt
            }
          }

          this.loading = false;
          this.isDownload = false
        })
        /* eslint-disable */
      },
      setFileData1(val) { // 上传解析1
        this.ruleForm.isUpload1 = val;
        this.uploadText1 = '已上传';
        this.uploadStatus1 = 'success';
      },
      setFileData2(val) { // 上传解析2
        this.ruleForm.isUpload2 = val;
        this.uploadText2 = '已上传';
        this.uploadStatus2 = 'success';
      },
      changeParams(val) { // 切换下拉框参数
        // 清空参数
        this.resetForm('ruleForm');
        this.ruleForm.typeValue = val;
      },
      getPageination1(page) { // 分页1
        this.tableData[1].pageIndex = page.currentPage;
        this.tableData[1].pageRows = page.pageSizeNumber;
        this.handleQueryData(0, 'res1', page.currentPage, page.pageSizeNumber); // 再次查询
      },
      getPageination2(page) { // 分页2
        this.tableData[2].pageIndex = page.currentPage;
        this.tableData[2].pageRows = page.pageSizeNumber;
        this.handleQueryData(0, 'res2', page.currentPage, page.pageSizeNumber); // 再次查询
      },
      getPageination3(page) { // 分页3
        this.tableData[3].pageIndex = page.currentPage;
        this.tableData[3].pageRows = page.pageSizeNumber;
        this.handleQueryData(0, 'res3', page.currentPage, page.pageSizeNumber); // 再次查询
      },
      getPageination4(page) { // 分页4
        this.tableData[4].pageIndex = page.currentPage;
        this.tableData[4].pageRows = page.pageSizeNumber;
        this.handleQueryData(0, 'res4', page.currentPage, page.pageSizeNumber); // 再次查询
      },
      getPageination5(page) { // 分页2
        this.tableData[2].pageIndex = page.currentPage;
        this.tableData[2].pageRows = page.pageSizeNumber;
        this.handleQueryData(0, 'res1', page.currentPage, page.pageSizeNumber); // 再次查询
      },
      getPageination6(page) { // 分页5
        this.tableData[5].pageIndex = page.currentPage;
        this.tableData[5].pageRows = page.pageSizeNumber;
        this.handleQueryData(0, 'res2', page.currentPage, page.pageSizeNumber); // 再次查询
      },
      handleDownload(type) { // 导出
        this.$message.info('正在导出表格数据，请稍等~');
        if (type === '获利型') {
          let downloadParams = {
            tradeType: this.queryParams.tradeType,
            btwArr: this.queryParams.btwArr,
            rateacArr: this.queryParams.rateacArr, // eslint-disable-line
            commsnRate: this.queryParams.commsnRate, // eslint-disable-line
            isNewQuery: 0,
            isExport: 1,
            resType: 'ALL',
            pageIndex: this.queryParams.pageIndex,
            pageRows: this.queryParams.pageRows,
            qryId: this.queryParams.qryId,
            tableColumns: [
              {
                'sheetName': '买入明细表',
                'fileColumns': this.theadList[1]
              },
              {
                'sheetName': '卖出明细表',
                'fileColumns': this.theadList[2]
              },
              {
                'sheetName': '匹配结果表',
                'fileColumns': this.theadList[3]
              },
              {
                'sheetName': '违法所得输出表',
                'fileColumns': this.theadList[4]
              }
            ],
            fileType: 'xlsx'

          };
          this.gfnExportFileWithForm('/specialqry/speclqry/v1/illegalget-elk-export', downloadParams)
        } else {
          let downloadParams = {
            tradeType: this.queryParams.tradeType,
            btwArr: this.queryParams.btwArr,
            rateacArr: this.queryParams.rateacArr,
            commsnRate: this.queryParams.commsnRate,
            isNewQuery: 0,
            isExport: 1,
            resType: 'ALL',
            pageIndex: this.queryParams.pageIndex,
            pageRows: this.queryParams.pageRows,
            qryId: this.queryParams.qryId,
            tableColumns: [
              {
                'sheetName': '卖出明细表',
                'fileColumns': this.theadList[2]
              },
              {
                'sheetName': '违法所得输出表',
                'fileColumns': this.theadList[5]
              }
            ],
            fileType: 'xlsx'

          };
          this.gfnExportFileWithForm('/specialqry/speclqry/v1/illegalget-elk-export', downloadParams)
        }
      }
    },
    mounted() {
    }
  }
</script>

<style lang='less' scoped>
  .inlineBlock {
    display: inline-block;
  }

  .uploadBtn {
    display: inline-block;
    margin-right: 10px;
  }

  .insiderBox {
    .el-form {
      margin-top: 20px;
    }

  }
</style>
