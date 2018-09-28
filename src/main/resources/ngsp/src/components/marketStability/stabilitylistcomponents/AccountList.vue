<!--账户 -->
<template>
    <div class="account-list">
        <!--tep-->
        <div style="position: relative">
            <account-stock-select @refreshIsShow="refreshIsShowBox" @refreshAddItems="refreshAddItemList"
                                  @getCode='getCode'
                                  class="addItemBox" @closeSelect="closeSelect"
                                  v-show="stockShow"
                                  style='position: absolute;z-index: 100;top:50px'></account-stock-select>
        </div>
        <el-card style="padding-top: 15px;" class="el-card-table">
            <el-row style="padding-left: 20px">
                <el-col :span="4">
                    <span>标的：</span>
                    <div @click="stockSelect" style="display: inline-block;">
                        <el-input type="text" placeholder="请选择" :value="stock"
                                  size="small" @change="getChange">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <span>日期设置：</span>
                    <el-date-picker type="date" v-model="selectDate" format="yyyyMMdd" value-format="yyyyMMdd"
                                    placeholder="选择时间"
                                    size="small"></el-date-picker>
                    <el-button type="primary"
                               size="small" @click="selectDateNow">查询
                    </el-button>
                </el-col>
            </el-row>
            <composite-index ref="composite" v-if="isShow" :select-date="selectDate"
                             :stockCode="stockCode"></composite-index>
        </el-card>
        <el-card style="overflow: visible">
            <div slot="header" class="clearfix">
                <span>查询条件</span>
                <el-button
                        type="primary"
                        size="small"
                        style="float:right;"
                        @click="postQueryMktrdtop"
                        :disabled="inLoading||selectStop">查询
                </el-button>
            </div>
            <el-form :inline="true" :model="selectParams" :rules="rules" ref="selectParams">
                <el-form-item label="交易方向">
                    <el-select v-model="selectParams.trdDirection" size="small" :disabled="selectStop">
                        <el-option key="jmc" label="净卖出" value="jmc"></el-option>
                        <el-option key="jmr" label="净买入" value="jmr"></el-option>
                        <el-option key="zdmc" label="主动卖出" value="zdmc"></el-option>
                        <el-option key="zdmr" label="主动买入" value="zdmr"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参与者层级">
                    <el-select v-model="selectParams.trdAcctType" size="small" :disabled="selectStop">
                        <el-option key="zh" label="账户" value="zh"></el-option>
                        <el-option key="ymt" label="一码通" value="ymt"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间">
                    <el-time-picker
                            :disabled="selectStop"
                            size="small"
                            is-range
                            v-model="selectParams.timePicker"
                            value-format="HH:mm:ss"
                            range-separator="至"
                            start-placeholder="09:00:00"
                            end-placeholder="17:00:00"
                            placeholder="选择时间范围">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="隔" prop="tdatereloadTime">
                    <el-input size="small" style="width:40%" v-model="selectParams.tdatereloadTime"
                              :disabled="selectStop"></el-input>
                    秒刷新
                    <el-button @click="Tdatestopreload" type="info"
                               size="small" class="refreshShop">
                        {{TdateReloadOperate}}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col>
                    <el-form :inline="true">
                        <el-form-item label="机构类型" v-if="selectParams.trdAcctType=='zh'">
                            <down-more-select :disabled="inLoading||!lastRefreshTime||selectStop"
                                              v-model="multipleInstitutionsArray"
                                              :optionData="institutionsArray"
                                              size="small"
                            ></down-more-select>
                        </el-form-item>
                        <el-form-item label="行为特征" v-if="selectParams.trdAcctType=='zh'">
                            <el-select v-model="multipleBehavioralCharacteristics" size="small" multiple collapse-tags
                                       :disabled="inLoading||!lastRefreshTime||selectStop">
                                <el-option :key="data.value" :label="data.text" :value="data.value"
                                           v-for="data in behavioralCharacteristics"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="处理标记" v-if="selectParams.trdAcctType=='zh'">
                            <el-select v-model="multipleHandleTheMarkup" size="small" multiple collapse-tags
                                       :disabled="inLoading||!lastRefreshTime||selectStop">
                                <el-option :key="data.text" :label="data.text" :value="data.text"
                                           v-for="data in handleTheMarkup"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="handleFilter" type="primary"
                                       size="small" :disabled="inLoading||!lastRefreshTime||selectStop"
                                       v-if="selectParams.trdAcctType=='zh'">
                                筛选
                            </el-button>
                            <el-button @click="dealMarkDefine" type="primary"
                                       size="small">
                                自定义处理标记
                            </el-button>
                            <el-button @click="exportAccountMarked" type="primary"
                                       size="small" v-if="selectParams.trdAcctType=='zh'">
                                处理标记导出
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-card class="el-card-table">
            <div slot="header" class="clearfix" style="display: flex;">
                <span>交易居前数据表</span>
                <span style="flex: 1;text-align: center">
          <i class="el-icon-loading" v-if="inLoading"></i>
          <span v-if="lastRefreshTime">最新刷新时间：{{lastRefreshTimeText | dateFormat('HH:mm:ss')}}</span>
        </span>
                <el-button type="info" size="mini" @click="exportTable">导出</el-button>
            </div>
            <el-table v-show="selectParams.trdAcctType=='zh'"
                      border
                      ref="queryMktrdtopList"
                      :data="queryMktrdtopList"
                      max-height="600"
                      tooltip-effect="dark"
                      :row-class-name="handleRowClassName"
                      @cell-dblclick="defineName"
                      @selection-change="handleSelectionChange"
                      @select="zhSelectedRow"
                      @select-all="zhSelectedAllRow"
                      style="width: 100%; overflow:visible">
                <el-table-column
                        label="序号"
                        width="55"
                        align="center"
                        class-name="table-index"
                        type="index">
                </el-table-column>
                <el-table-column
                        align="center"
                        type="selection">
                </el-table-column>
                <el-table-column
                        align="left"
                        header-align="center"
                        show-overflow-tooltip
                        prop="acctno"
                        sortable
                        label="账户代码"
                        min-width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="toDetail(scope.row)">{{scope.row.acctno}}
                        </el-button>
                    </template>
                </el-table-column>
                <s-table-columns v-for="(item,index) in column1"
                                 :key="index"
                                 :item="item"
                                 v-if="item.isActive===undefined||item.isActive"/>
            </el-table>
            <el-table v-show="selectParams.trdAcctType=='ymt'"
                      border
                      ref="queryMktrdtopListYmt"
                      :data="queryMktrdtopListYmt"
                      max-height="600"
                      tooltip-effect="dark"
                      :row-class-name="handleRowClassName"
                      @select="zhSelectedRow"
                      @select-all="zhSelectedAllRow"
                      @cell-dblclick="defineName"
                      @selection-change="handleSelectionChange"
                      style="width: 100%; overflow:visible">
                <el-table-column
                        label="序号"
                        width="55"
                        align="center"
                        class-name="table-index"
                        type="index">
                </el-table-column>
                <el-table-column
                        align="center"
                        type="selection">
                </el-table-column>
                <el-table-column
                        align="left"
                        header-align="center"
                        show-overflow-tooltip
                        prop="ymtno"
                        sortable
                        label="一码通代码"
                        min-width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="toDetail(scope.row)">{{scope.row.ymtno}}</el-button>
                    </template>
                </el-table-column>
                <s-table-columns v-for="(item,index) in column2"
                                 :key="index"
                                 :item="item"
                                 v-if="item.isActive===undefined||item.isActive"/>
            </el-table>
            <div style="display: flex;justify-content: space-between;padding: 10px">
                <div>
                    注：交易居前统计不包括个人投资者中、小、散户
                </div>
                <div>
                    <el-button type="primary" size="small" @click="selectCount">{{accountBtnTxt}}</el-button>
                    <el-button type="primary" size="small" @click="addCount">加入暂停清单</el-button>
                    <el-button type="primary" size="small" @click="waitPauseCount">待暂停账户（{{pauseCountNum}}）</el-button>
                    <el-checkbox v-model="ymtChecked" :disabled="selectParams.trdAcctType == 'ymt'">按一码通进行暂停
                    </el-checkbox>
                </div>
            </div>
        </el-card>
        <handle-the-markup ref="markupDialog" @listen-markup="closeDialog"></handle-the-markup>
        <el-dialog title="待暂停账户" :visible.sync="dialogFormVisble" class="accountDialog">
            <el-form :inline="true" :model="formParams" style="text-align: center">
                <el-form-item label="账户代码">
                    <el-input type="text" v-model="formParams.accountid" size="mini">
                        {{formParams.accountid}}
                    </el-input>
                </el-form-item>
                <el-form-item label="证券代码">
                    <el-input type="text" v-model="formParams.instrumentid" size="mini">
                        {{formParams.instrumentid}}
                    </el-input>
                </el-form-item>
                <el-form-item label="控制类型">
                    <el-select v-model="formParams.controltype" placeholder="请选择" size="mini">
                        <el-option
                                v-for="(item,index) in typeOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="买卖方向">
                    <el-select v-model="formParams.bstype" placeholder="请选择" size="mini">
                        <el-option
                                v-for="(item,index) in buyOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" size="mini" @click="filterTable">筛选</el-button>
                    <el-button type="info" size="mini" @click="emptyForm">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    :data="accountTableData"
                    border
                    style="width: 100%; overflow:visible"
                    size="mini"
                    height="400"
                    v-loading="companyLoading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0,0,0,0.8)"
                    @select="selectedRow"
                    @select-all="selectedAllRow">
                <el-table-column
                        header-align="center"
                        align="center"
                        label="序号"
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        :check="check"
                        header-align="center"
                        align="center"
                        type="selection"
                        min-width="5%">
                </el-table-column>
                <el-table-column
                        v-for="item in accountTableColum"
                        :align="item.align"
                        header-align="center"
                        :sortable="item.sortable"
                        :key="item.field"
                        :show-overflow-tooltip="true"
                        :prop="item.field"
                        :label="item.label"
                        :min-width="item.width"
                        :formatter="item.formatter">
                </el-table-column>
                <el-table-column
                        min-width="10%"
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editRows(scope.row)" type="text" size="small" style="border: none;color:#1b5eed
">编辑
                        </el-button>
                        <el-button @click="deleteRows(scope.row)" type="text" size="small" style="border: none;color:#1b5eed
">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align: center;padding: 15px">
                <el-button type="primary" size="small" @click="allHandCarry">全部手动执行</el-button>
                <el-button type="info" size="small" @click="moreDeleteRow">批量删除</el-button>
            </div>
        </el-dialog>
        <el-dialog title="是否执行" :visible.sync="dialogPerform" class="accountEdit">
            <p style="text-align: center">共 {{setUpNum}} 个账户将被【设置】权限设置</p>
            <p style="text-align: center">共 {{deleteSetUpNum}} 个账户将被【取消】权限设置</p>
            <div style="text-align: center;">
                确定执行？
            </div>
            <div style="text-align: center;" slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="yesPerform">确定
                </el-button>
                <el-button type="info" size="small" @click="NoPerform">取消
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="是否删除" :visible.sync="dialogForm">
            <div style="text-align: center;">
                是否确定删除？
            </div>
            <div style="text-align: center;" slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="yesRecall">是
                </el-button>
                <el-button type="info" size="small" @click="NoRecall">否
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="待暂停账户" :visible.sync="dialogVisbleSuccess" class="accountEdit">
            <div style="text-align: center;">
                <i class="el-icon-success" style="font-size: 40px;color:#339933"></i>
                <p>
                    手动执行成功，是否下载通知单？
                </p>
                <p>
                    通知单下载路径：电子文档归档存储-->电子文档归档查询
                </p>
            </div>
            <div style="text-align: center">
                <el-button type="primary" size="small" @click="sureDownload">是</el-button>
                <el-button type="info" size="small" @click="falseDownload">否</el-button>
            </div>
        </el-dialog>
        <el-dialog title="待暂停账户编辑" :visible.sync="dialogVisble" class="accountEdit">
            <el-form :inline="true" :model="editFormParams" style="text-align: center">
                <el-form-item label="控制类型">
                    <el-select v-model="editFormParams.controltype" placeholder="请选择" size="mini">
                        <el-option
                                v-for="(item,index) in editTypeOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="买卖方向">
                    <el-select v-model="editFormParams.bstype" placeholder="请选择" size="mini">
                        <el-option
                                v-for="(item,index) in buyOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户代码">
                    <el-input type="text" v-model="editFormParams.accountid" size="mini">
                        {{editFormParams.accountid}}
                    </el-input>
                </el-form-item>
                <el-form-item label="证券代码">
                    <div v-on:mouseover="getMouseEnter" v-on:mouseleave="getMouseLeave">
                        <el-input type="text" v-model="editFormParams.instrumentid" size="mini">
                            {{editFormParams.instrumentid}}
                        </el-input>
                    </div>
                </el-form-item>
                <div class="limitContent" v-show="limitShow">
                    <p>限制单个证券使用证券代码(6位)</p>
                    <p>限制全部证券使用代称"ALLSTK"</p>
                    <p>限制所有权证使用"QUANZH"</p>
                    <p>限制所有A股使用"ASHARE"(这里A股仅包含产品子类型为"ASH"的证券)</p>
                </div>
            </el-form>
            <div style="text-align: center">
                <el-button type="primary" size="small" @click="saveEdit">保存</el-button>
                <el-button type="info" size="small" @click="deleteEdit">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import {
    queryMktrdtop,
    queryJepm,
    querySaleInfo,
    getCharactorParam,
    queryAutoExchange,
    queryHugeSale,
    queryTopSale,
    hugeBuyCharactor,
    hugeBuyActive,
    hugeSaleActive,
    hugeSaleCharactor,
    addPauseCount, //  增加待暂停账户
    qureyPauseCount, //  查询待暂停账户
    deletePauseCount, //  删除待暂停账户
    updatePauseCount, //  更新待暂停账户
    controlBuyType, //  控制类型买卖方向
    queryPauseNum, //  查询待暂停账户个数
    allhanderDerail,
    gfnDownloadDocument,
    getSetUpMesg
  } from '@/service/marketStability'
  import { gitTradeDate } from '@/service/common/commonFunc'
  import { linkNo, transactionSelect } from '@/service/analysisTool/productQuery'
  import HandleTheMarkup from './AccountNewOpen/HandleTheMarkup.vue'

  //    指数涨跌幅
  import CompositeIndex from './component/CompositeIndex.vue'
  import BehavioralColumn from './component/BehavioralColumn'
  import AccountStockSelect from './AccountStockSelect'

  export default {
    props: {},
    //   组件注册
    components: {
      STableColumns: () => import('@/components/base/STableColumns'),  //  表格列
      DownMoreSelect: () => import('@/components/common/downMoreSelect'),
      CompositeIndex,
      HandleTheMarkup,
      AccountStockSelect
    },
    data () {
      return {
        selectDate: '',
        column1: [
          {
            field: 'acctname',
            label: '账户名称',
            width: '120',
            align: 'left',
            sortable: true
          },
          {
            field: 'brnname',
            label: '营业部',
            width: '120',
            align: 'left',
            sortable: true
          },
          {
            field: 'acctymtno',
            label: '一码通',
            width: '80',
            align: 'left',
            sortable: true
          },
          {
            field: 'acctype',
            label: '投资者分类',
            width: '80',
            align: 'left',
            sortable: true
          },
          {
            field: 'trdamt_je',
            label: '净额(亿元)',
            width: '60',
            align: 'right',
            tooltip: '净额，买入金额-卖出金额。',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_je')
          },
          {
            field: 'trdamt_je_pm',
            label: '下午净额(亿元)',
            width: '60',
            align: 'right',
            tooltip: '下午净额，下午买入金额-下午卖出金额。',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_je_pm')
          },
          {
            field: 'initiative_je',
            label: '主动净额(亿元)',
            width: '60',
            align: 'right',
            tooltip: '主动净额，主动买入金额-主动卖出金额。',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'initiative_je')
          },
          {
            field: 'trdamt_b',
            label: '买入金额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b')
          },
          {
            field: 'trdamt_s',
            label: '卖出金额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s')
          },
          {
            field: 'trdamt_s_per',
            label: '卖出金额/前持市值(%)',
            width: '60',
            align: 'right',
            tooltip: '前持市值=前持股票数量*股票前收盘价;\n卖出金额占比=(卖出金额/前持市值)*100;',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s_per')
          },
          {
            field: 'trdqty_s_180',
            label: '卖出180只数',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s_180')
          },
          {
            field: 'trdqty_s_50',
            label: '卖出50只数',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdqty_s_50')
          },
          {
            field: 'trdamt_s_180',
            label: '卖出180金额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s_180')
          },
          {
            field: 'trdamt_s_50',
            label: '卖出50金额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s_50')
          },
          {
            field: 'trdamt_i_b_per',
            label: '主动买入成交占比(%)',
            width: '60',
            align: 'right',
            tooltip: '主动买入成交占比 = (主动买入金额 / 买入金额)*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_i_b_per')
          },
          {
            field: 'trdamt_i_s_per',
            label: '主动卖出成交占比(%)',
            width: '60',
            align: 'right',
            tooltip: '主动卖出成交占比 = (主动卖出金额 / 卖出金额)*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_i_s_per')
          },
          {
            field: 'trd_character',
            label: '行为特征',
            width: '120',
            align: 'left',
            tooltip: '',
            sortable: true,
            template: BehavioralColumn
          },
          {
            field: 'deal_mark',
            label: '处理标记',
            width: '120',
            align: 'left',
            sortable: true
          },
          {
            field: 'ytx_trdamt_je',
            label: '提醒后净额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ytx_trdamt_je')
          },
          {
            field: 'ytx_trdamt_30je',
            label: '提醒30分钟后净额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ytx_trdamt_30je')
          },
          {
            field: 'deal_time',
            label: '处理时间',
            width: '60',
            align: 'left',
            sortable: true
          },
          {
            field: 'target_value',
            label: '标的代码',
            width: '60',
            align: 'left',
            sortable: true
          },
          {
            field: 'target_type',
            label: '标的类型',
            width: '60',
            align: 'left',
            sortable: true
          }
        ],
        column2: [
          {
            field: 'ymtname',
            label: '一码通名称',
            width: '80',
            align: 'left',
            sortable: true
          },
          {
            field: 'trdamt_je',
            label: '净额(亿元)',
            width: '60',
            align: 'right',
            tooltip: '净额 = 买入金额 - 卖出金额',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_je')
          },
          {
            field: 'trdamt_je_pm',
            label: '下午净额(亿元)',
            width: '60',
            align: 'right',
            tooltip: '下午净额 = 下午买入金额 - 下午卖出金额',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_je_pm')
          },
          {
            field: 'initiative_je',
            label: '主动净额(亿元)',
            width: '60',
            align: 'right',
            tooltip: '主动净额 = 主动买入金额 - 主动卖出金额',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'initiative_je')
          },
          {
            field: 'trdamt_b',
            label: '买入金额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b')
          },
          {
            field: 'trdamt_s',
            label: '卖出金额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s')
          },
          {
            field: 'trdamt_s_per',
            label: '卖出金额/前持市值(%)',
            width: '60',
            align: 'right',
            tooltip: '前持市值=前持股票数量*股票前收盘价;\n卖出金额占比=(卖出金额/前持市值)*100;',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s_per')
          },
          {
            field: 'trdamt_i_b_per',
            label: '主动买入成交占比(%)',
            width: '60',
            align: 'right',
            tooltip: '主动买入成交占比 = (主动买入金额 / 买入金额)*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_i_b_per')
          },
          {
            field: 'trdamt_i_s_per',
            label: '主动卖出成交占比(%)',
            width: '60',
            align: 'right',
            tooltip: '主动卖出成交占比 = (主动卖出金额 / 卖出金额)*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_i_s_per')
          },
          {
            field: 'trd_character',
            label: '行为特征',
            width: '120',
            align: 'left',
            tooltip: '',
            sortable: true,
            template: BehavioralColumn
          },
          {
            field: 'deal_mark',
            label: '处理标记',
            width: '120',
            align: 'left',
            sortable: true
          },
          {
            field: 'ytx_trdamt_je',
            label: '提醒后净额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ytx_trdamt_je')
          },
          {
            field: 'ytx_trdamt_30je',
            label: '提醒30分钟后净额(亿元)',
            width: '60',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ytx_trdamt_30je')
          },
          {
            field: 'deal_time',
            label: '处理时间',
            width: '60',
            align: 'left',
            sortable: true
          },
          {
            field: 'target_value',
            label: '标的代码',
            width: '60',
            align: 'left',
            sortable: true
          },
          {
            field: 'target_type',
            label: '标的类型',
            width: '60',
            align: 'left',
            sortable: true
          }
        ],
        selectParams: {
          trdDirection: 'jmc',
          trdAcctType: 'zh',
          timePicker: ['09:00:00', '15:00:00'],
          tdatereloadTime: '60'
        },
        rules: {
          tdatereloadTime: [
            {type: 'string', pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur'}
          ]
        },
        TdateReloadOperate: '开始刷新',
        TdatetimerFun: null,
        selectStop: false,
        multipleSelection: [],
        queryMktrdtopList: [],
        queryMktrdtopListYmt: [],
        inLoading: false,
        lastRefreshTime: false,
        lastRefreshTimeText: '',
        //  计算接口返回次数
        count: 0,
        institutionsArray: [],
        behavioralCharacteristics: [],
        handleTheMarkup: [],
        multipleInstitutionsArray: [],
        multipleBehavioralCharacteristics: [],
        multipleHandleTheMarkup: [],
        isShow: false,
        queryMktrdtopListCopy: [],
        stockShow: false, //  证券选择框
        // securityName: ' 上证指数',  //  证券选择框显示内容
        // securityCode: '000001', //  证券选择框
        stock: '000001 上证指数',
        dialogFormVisble: false,
        formParams: {
          accountid: '',
          instrumentid: '',
          controltype: '',
          bstype: ''
        },
        typeOptions: [{value: '0', label: '全部'}],
        editTypeOptions: [],
        buyOptions: [],
        accountTableColum: [
          {
            field: 'control_type_value',
            label: '控制类型',
            width: '6%',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'control_type_value')
          },
          {
            field: 'ymt_account_id',
            label: '一码通代码',
            width: '6%',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ymt_account_id')
          },
          {
            field: 'account_id',
            label: '账户代码',
            width: '6%',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'account_id')
          },
          {
            field: 'account_name',
            label: '账户名称',
            width: '6%',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'account_name')
          },
          {
            field: 'branch_name',
            label: '营业部',
            width: '6%',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'branch_name')
          },
          {
            field: 'b_s_type_value',
            label: '买卖方向',
            width: '6%',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'b_s_type_value')
          },
          {
            field: 'instrument_id',
            label: '证券代码',
            width: '6%',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'instrument_id')
          }
        ],
        accountTableData: [], //  查询表格显示数据
        check: true, //  表格选中
        dialogVisble: false,
        dialogVisbleSuccess: false,
        editFormParams: {
          accountid: '',
          instrumentid: '',
          controltype: 'C',
          bstype: '  '
        },
        ymtChecked: false,
        rowSelectCode: '', //  行选择代码
        companyLoading: false,
        pauseCountNum: 0, //  待暂停账户总数
        selectArr: [],  //  表格行选择账户
        ymtArr: [], //  一码通选择账户
        pauseArr: [], //  待暂停选择账户
        accountBtnTxt: '选择待暂停账户',
        deleteEditParam: '', //  删除待编辑账户参数
        editRowParams: {},
        stockCode: {
          codeType: 'index', //  标的类型
          code: '000001' //  标的代码
        },
        reservedParams: '',
        dialogForm: false,
        dialogPerform: false,
        deleteParams: {},
        deleteAllParams: {},
        flagAll: '',
        setUpNum: '',
        deleteSetUpNum: '',
        limitShow: false
      }
    },
    watch: {
      count: function () {
        if (this.selectParams.trdAcctType == 'zh' ? this.count > 9 : this.count > 8) {
          this.count = 0
          this.inLoading = false
          this.queryMktrdtopListCopy = this.queryMktrdtopList
          this.lastRefreshTime = true
          this.lastRefreshTimeText = new Date()
          if (this.selectStop)
            this.TdatetimerFun = setTimeout(this.postQueryMktrdtop, this.selectParams.tdatereloadTime * 1000)
        }
      },
      trdAcctType: function () {
        this.count = 0
      },
      selectDate: {
        handler: function () {
          if (this.selectDate) {
            this.$nextTick(function () {
              this.isShow = true
            })
          }
        },
        immediate: true
      }
    },
    methods: {
      closeSelect () {
        this.stockShow = false
      },
      getChange (val) {
        this.stock = val
      },
      //  查询待暂停账户个数
      queryPauseNumData () {
        queryPauseNum().then(resp => {
          this.pauseCountNum = resp
        })
      },
      //  待暂停账户
      waitPauseCount () {
        this.dialogFormVisble = true
        this.companyLoading = true
        if (this.formParams.controltype == '0') {
          this.formParams.controltype = ''
        }
        qureyPauseCount(this.formParams).then(resp => {
          this.accountTableData = resp
          this.companyLoading = false
        })
      },
      //  筛选待暂停账户
      filterTable () {
        this.waitPauseCount()
      },
      emptyForm () {
        for (let k in this.formParams) {
          this.formParams[k] = ''
        }
      },
      //  选择待暂停账户
      selectCount () {
        if (this.accountBtnTxt === '选择待暂停账户') {
          if (this.selectParams.trdAcctType == 'zh') {
            this.queryMktrdtopList.forEach((el, index) => {
              el.trd_character.forEach((res) => {
                if (res == '2' || res == '3') {
                  this.pauseArr.push(this.queryMktrdtopList[index])
                  this.$nextTick(function () {
                    this.$refs.queryMktrdtopList.toggleRowSelection(this.queryMktrdtopList[index], true)
                  })
                }
              })
            })
          } else {
            this.queryMktrdtopListYmt.forEach((el, index) => {
              el.trd_character.forEach((res) => {
                if (res == '2' || res == '3') {
                  this.pauseArr.push(this.queryMktrdtopListYmt[index])
                  this.$nextTick(function () {
                    this.$refs.queryMktrdtopListYmt.toggleRowSelection(this.queryMktrdtopListYmt[index], true)
                  })
                }
              })
            })
          }
          this.accountBtnTxt = '取消待暂停账户（' + this.pauseArr.length + '）'
        } else {
          this.accountBtnTxt = '选择待暂停账户'
          this.pauseArr = []
          if (this.selectParams.trdAcctType == 'zh') {
            this.$refs.queryMktrdtopList.clearSelection()
          } else {
            this.$refs.queryMktrdtopListYmt.clearSelection()
          }
        }
      },
      //  增加待暂停账户
      addCount () {
        let arr = []
        arr = this.selectArr.concat(this.pauseArr)
        let selectCodeArr = []
        let acctType = ''
        if (this.selectParams.trdAcctType == 'zh') {
          if (this.ymtChecked) {
            acctType = 'ymt'
            arr.forEach((el) => {
              selectCodeArr.push(el.acctymtno)
            })
          } else {
            acctType = 'zh'
            arr.forEach((el) => {
              selectCodeArr.push(el.acctno)
            })
          }
        } else {
          acctType = 'ymt'
          arr.forEach((el) => {
            selectCodeArr.push(el.ymtno)
          })
        }
        this.rowSelectCode = Array.from(new Set(selectCodeArr)).join(',')

        let params = {trddirection: this.selectParams.trdDirection, trdAcctType: acctType, arrs: this.rowSelectCode}
        addPauseCount(params).then(resp => {
          this.pauseCountNum = resp.count
          this.rowSelectCode = ''
          this.selectArr = []
          this.pauseArr = []
          this.$refs.queryMktrdtopList.clearSelection()
          this.$refs.queryMktrdtopListYmt.clearSelection()
        })
      },

      zhSelectedRow (row) {
        this.selectArr = row
      },
      zhSelectedAllRow (row) {
        this.selectArr = row
      },
      //  待暂停表格行选中
      selectedRow (row) {
        let arr = []
        row.forEach((el) => {
          arr.push(el.reserved)
        })
        this.deleteEditParam = arr.join(',')
      },
      //  待暂停表格行全选
      selectedAllRow (row) {
        let arr = []
        row.forEach((el) => {
          arr.push(el.reserved)
        })
        this.deleteEditParam = arr.join(',')
      },
      //  批量删除
      moreDeleteRow () {
        if (!this.deleteEditParam) {
          this.$message.warning('请选择删除对象')
        } else {
          this.flagAll = true
          this.deleteAllParams = {arrKeys: this.deleteEditParam}
          this.dialogForm = true
        }
      },
      //  全部手动执行
      allHandCarry () {
        getSetUpMesg().then(resp => {
          this.setUpNum = resp[0].c_cnt
          this.deleteSetUpNum = resp[0].u_cnt
          this.dialogPerform = true
        })
      },
      yesPerform () {
        this.dialogPerform = false
        allhanderDerail().then(resp => {
          if (resp.reserved) {
            this.reservedParams = resp.reserved
            this.dialogVisbleSuccess = true
            qureyPauseCount(this.formParams).then(resp => {
              this.accountTableData = resp
            })
            this.queryPauseNumData()
            this.postQueryMktrdtop()
          } else {
            this.$message.warning('手动处理失败！')
          }
        })
      },
      NoPerform () {
        this.dialogPerform = false
      },
      sureDownload () {
        gfnDownloadDocument('FILE_OPER_INFO_T', this.reservedParams)
        this.dialogVisbleSuccess = false
      },
      falseDownload () {
        this.dialogVisbleSuccess = false
      },
      //  删除待暂停账户
      deleteRows (row) {
        this.deleteParams = {arrKeys: row.reserved}
        this.dialogForm = true
      },
      yesRecall () {
        if (this.flagAll) {
          deletePauseCount(this.deleteAllParams).then(resp => {
            qureyPauseCount().then(res => {
              this.accountTableData = res
              this.companyLoading = false
              this.flagAll = false
              this.dialogForm = false
              this.deleteEditParam = ''
            })
            this.queryPauseNumData()
          })
        } else {
          deletePauseCount(this.deleteParams).then(resp => {
            qureyPauseCount().then(res => {
              this.accountTableData = res
              this.companyLoading = false
              this.dialogForm = false
            })
            this.queryPauseNumData()
          })
        }
      },
      NoRecall () {
        this.dialogForm = false
      },
      getMouseEnter () {
        this.limitShow = true
      },
      getMouseLeave () {
        this.limitShow = false
      },
      //  编辑行
      editRows (row) {
        this.dialogVisble = true
        this.editFormParams.accountid = row.account_id
        this.editFormParams.instrumentid = row.instrument_id
        this.editFormParams.controltype = row.control_type
        this.editFormParams.bstype = row.b_s_type

        this.editRowParams.reserved = row.reserved
        this.editRowParams.ymtno = row.ymt_account_id
      },
      //  保存编辑
      saveEdit () {
        let stockCode = this.editFormParams.instrumentid
        if (!(/^[A-Z][0-9]{9}$/.test(this.editFormParams.accountid))) {
          this.$message.warning('账户代码：必须以一个大写字开头，后加9个数字')
        } else {
          if (stockCode != 'ALLSTK' && stockCode != 'QUANZH' && stockCode != 'ASHARE' && !(/^\d{6}\b/.test(stockCode))) {
            this.$message.warning('只允许输入6位数字的证券代码或者是ALLSTK，QUANZH，ASHARE')
          } else {
            this.dialogVisble = false
            for (let k in this.editFormParams) {
              this.editRowParams[k] = this.editFormParams[k]
            }
            updatePauseCount(this.editRowParams).then(resp => {
              if (resp.success) {
                qureyPauseCount().then(res => {
                  this.accountTableData = res
                  this.companyLoading = false
                })
              } else {
                this.$message.warning(resp.message)
              }
            }).then(() => {
              this.editRowParams = {}
            })
          }
        }
      },
      //  取消编辑
      deleteEdit () {
        this.dialogVisble = false
      },
      //  获取控制类型及买卖方向数据
      getControlBuyData () {
        controlBuyType('CONTROL_TYPE', '0').then(resp => {
          resp.forEach((el) => {
            this.typeOptions.push({value: el.s_key, label: el.s_value})
            this.editTypeOptions.push({value: el.s_key, label: el.s_value})
          })
        })
        controlBuyType('EUP_B_S_TYPE_A', '0').then(resp => {
          resp.forEach((el) => {
            this.buyOptions.push({value: el.s_key, label: el.s_value})
          })
        })
      },

      stockSelect () {
        this.stockShow = true
      },
      getCode (code, name, type) {
        if (code) {
          if (type == 'stock') {
            name = name.substring(6)
          }
          this.stock = code + ' ' + name
          // this.securityName = ' ' + name
          // this.securityCode = code
          if (type == 'index') {
            this.stockCode.codeType = 'index'
          } else if (type == 'block') {
            this.stockCode.codeType = 'board'
          } else {
            this.stockCode.codeType = 'stock'
          }
          this.stockCode.code = code
          this.stockShow = false
        } else {
          this.$message.warning('请选择标的！')
        }
      },
      refreshIsShowBox (state) {
        this.stockShow = state
      },
      refreshAddItemList (obj) {
        this.stockShow = false
        if (obj.type == 'index') {
          this.stockCode.codeType = 'index'
        } else if (obj.type == 'block') {
          if (obj.code.indexOf('SW') > -1) {
            this.stockCode.codeType = 'sw'
          } else if (obj.code.indexOf('WD') > -1) {
            this.stockCode.codeType = 'wd'
          } else {
            this.stockCode.codeType = 'cus'
          }
        } else {
          this.stockCode.codeType = 'stock'
        }
        this.stockCode.code = code
      },

      init () {
        this.queryMktrdtopList = []
        this.queryMktrdtopListYmt = []
        this.count = 0
        this.inLoading = false
        this.lastRefreshTime = false
      },
      ajaxGitTradeDate () {
        gitTradeDate().then((res) => {
          this.selectDate = res
        })
      },
      selectDateNow () {
        if (!this.stock) {
          this.$message.warning('请选择标的')
          return
        }
        if (this.selectDate == null) {
          this.$message.warning('请选择时间')
          return
        }
        this.init()
        this.$refs.composite.drawLineChart()
      },
      getDealMarkDefine () {
        transactionSelect('investorType', 'stability').then((res) => {
          let arr = []
          for (let key of res) {
            arr.push({
              label: key.text,
              value: key.text
            })
          }
          this.institutionsArray = arr
        })
        linkNo('behaviType').then((res) => {
          this.behavioralCharacteristics = res
        })
        linkNo('dealType').then((res) => {
          this.handleTheMarkup = res
        })
      },
      handleFilter () {
        this.queryMktrdtopList = this.queryMktrdtopListCopy
        let arr = []
        if (this.multipleInstitutionsArray.length > 0) {
          for (let key of this.queryMktrdtopList) {
            if (this.multipleInstitutionsArray.includes(key.acctype))
              arr.push(key)
          }
        }
        if (this.multipleBehavioralCharacteristics.length > 0) {
          let list = arr.length > 0 || this.multipleInstitutionsArray.length > 0 ? arr : this.queryMktrdtopList
          let arr1 = []
          for (let key of list) {
            for (let key2 of key.trd_character) {
              if (this.multipleBehavioralCharacteristics.includes(key2.toString())) {
                arr1.push(key)
                break
              }
            }
          }
          arr = arr1
        }
        if (this.multipleHandleTheMarkup.length > 0) {
          let list = arr.length > 0 || this.multipleInstitutionsArray.length > 0 || this.multipleBehavioralCharacteristics.length > 0 ? arr : this.queryMktrdtopList
          let arr1 = []
          let arr3 = []
          for (let key of this.handleTheMarkup) {
            arr3.push(key.text)
          }
          for (let key of list) {
            if (key.deal_mark) {
              let arr2 = key.deal_mark.split('；')
              for (let key2 of arr2) {
                if (key2 == '') {
                  continue
                }
                if (this.multipleHandleTheMarkup.includes(key2)) {
                  arr1.push(key)
                  break
                }
                if (this.multipleHandleTheMarkup.includes('其他') && !arr3.includes(key2)) {
                  arr1.push(key)
                  break
                }
              }
            } else if (this.multipleHandleTheMarkup.includes('其他')) {
              arr1.push(key)
            }
          }
          // for (let key of list) {
          //   if (key.deal_mark) {
          //     let arr2 = key.deal_mark.split('；')
          //     for (let i = 0; i < arr2.length; i++) {
          //       if (arr2[i] == '') {
          //         continue
          //       }
          //       if (this.multipleHandleTheMarkup.includes(arr2[i])) {
          //         arr1.push(key)
          //         break
          //       }
          //       if (i == arr2.length - 1 && this.multipleHandleTheMarkup.includes('其他') && !arr3.includes(arr2[i])) {
          //         arr1.push(key)
          //         break
          //       }
          //     }
          //   }
          // }
          arr = arr1
        }
        if (this.multipleInstitutionsArray.length > 0 || this.multipleBehavioralCharacteristics.length > 0 || this.multipleHandleTheMarkup.length > 0) {
          this.queryMktrdtopList = arr
        }
      },
      getCharactorParam () {
        getCharactorParam().then((res) => {
          res = res[0]
          let str = `【程序化交易】：\n一码通（账户）每秒申报超过(含)${res.cxh1}笔 超过(含)${res.cxh2}次;\n且当日申报次数超过(含)${res.cxh3}笔;\n申报交易产品为A股，排除沪港通账户;
         \n【建议暂停 - 一分钟卖出金额较大】:\n期间账户一分钟卖出金额大于${res.jmje1}万元,卖出只数（所有A股）超过${res.jmje2}只;
         \n【建议暂停 - 净卖出居前】:\n上证50跌幅${res.jmjq1}(%)和非上证50跌幅${res.jmjq2}(%)的股票，按如上股票范围重新合并计算账户净卖出排名，对账户净卖出排名仍然排在前${res.jmjq3}名,且合计净卖出金额大于${res.jmjq4}(万元)；
         \n【瞬间大额主动卖出】:\n${res.sjzd_tim}分钟净卖出${res.sjzd_amt}万元-主动（所有A股）;
         \n【 瞬间大额卖出】:\n${res.sjmc_tim}分钟净卖出${res.sjmc_amt}万元-被动（所有A股）;
         \n【 瞬间大额主动买入】:\n${res.sjzdmr_tim}分钟净买入${res.sjzdmr_amt}万元-主动（所有A股）;
         \n【 瞬间大额买入】:\n${res.sjmr_tim}分钟净买入${res.sjmr_amt}万元-被动（所有A股）;`

          let index1 = this.column1.findIndex(item => {
            return item.field === 'trd_character'
          }),
          index2 = this.column2.findIndex(item => {
            return item.field === 'trd_character'
          })
          this.column1[index1].tooltip = str
          this.column2[index2].tooltip = str
        })
      },
      postQueryMktrdtop () {
        if (this.selectDate == null) {
          this.$message.error('请选择时间')
          return
        }
        this.multipleInstitutionsArray = []
        this.multipleBehavioralCharacteristics = []
        this.multipleHandleTheMarkup = []
        this.inLoading = true
        let param = {
          trdDate: this.selectDate,
          trdTimStart: this.selectParams.timePicker ? this.selectParams.timePicker[0].replace(/:/g, '') : '090000',
          trdTimEnd: this.selectParams.timePicker ? this.selectParams.timePicker[1].replace(/:/g, '') : '170000',
          trdDirection: this.selectParams.trdDirection,
          trdAcctType: this.selectParams.trdAcctType,
          type: this.stockCode.codeType,
          value: this.stockCode.code
        }
        let arrs = []
        let param2 = {}
        queryMktrdtop(param).then((res) => {
          this.count++
          for (let v of res) {
            if (this.selectParams.trdAcctType == 'zh')
              arrs.push(v.acctno)
            else
              arrs.push(v.ymtno)
            v.trd_character = []
          }
          if (this.selectParams.trdAcctType == 'zh')
            this.queryMktrdtopList = res
          else
            this.queryMktrdtopListYmt = res
          param2 = {
            trdDate: this.selectDate,
            trdTimStart: this.selectParams.timePicker ? this.selectParams.timePicker[0].replace(/:/g, '') : '090000',
            trdTimEnd: this.selectParams.timePicker ? this.selectParams.timePicker[1].replace(/:/g, '') : '170000',
            trdAcctType: this.selectParams.trdAcctType,
            arrs: arrs.join(',')
          }
        }, (err) => {
          if (err) {
            this.inLoading = false
          }
        }).then(() => {
          queryJepm({
            trdAcctType: param.trdAcctType,
            trdDate: param.trdDate,
            arrs: arrs.join(','),
            type: this.stockCode.codeType,
            value: this.stockCode.code
          }).then((res) => {
            this.count++
            for (let v of res) {
              let key = this.selectParams.trdAcctType == 'zh' ? v.acctno.replace('json', '') : v.ymtno.replace('json', '')
              let index = this.selectParams.trdAcctType == 'zh' ? this.queryMktrdtopList.findIndex((item) => {
                return item.acctno == key
              }) : this.queryMktrdtopListYmt.findIndex((item) => {
                return item.ymtno == key
              })
              if (index != -1)
                this.$set(this.selectParams.trdAcctType == 'zh' ? this.queryMktrdtopList[index] : this.queryMktrdtopListYmt[index], 'trdamt_je_pm', v.trdamt_je_pm)
            }
          })
        }).then(() => {
          if (this.selectParams.trdAcctType == 'zh')
            querySaleInfo({
              trdTimStart: param.trdTimStart,
              trdTimEnd: param.trdTimEnd,
              trdDate: param.trdDate,
              arrs: arrs.join(',')
            }).then((res) => {
              this.count++
              for (let v of res) {
                let key = v.acctno.replace('json', '')
                let index = this.queryMktrdtopList.findIndex((item) => {
                  return item.acctno == key
                })
                if (index != -1) {
                  this.$set(this.queryMktrdtopList[index], 'trdamt_s_50', v.trdamt_s_50)
                  this.$set(this.queryMktrdtopList[index], 'trdamt_s_180', v.trdamt_s_180)
                  this.$set(this.queryMktrdtopList[index], 'trdqty_s_180', v.counts_180)
                  this.$set(this.queryMktrdtopList[index], 'trdqty_s_50', v.counts_50)
                }
              }
            })
        }).then(() => {
          queryAutoExchange(param2).then((res) => {
            this.count++
            this.calculate(res, 1)
          })
        }).then(() => {
          queryHugeSale(param2).then((res) => {
            this.count++
            this.calculate(res, 2)
          })
        }).then(() => {
          queryTopSale(param2).then((res) => {
            this.count++
            this.calculate(res, 3)
          })
        }).then(() => {
          hugeSaleActive(param2).then((res) => {
            this.count++
            this.calculate(res, 4)
          })
        }).then(() => {
          hugeSaleCharactor(param2).then((res) => {
            this.count++
            this.calculate(res, 5)
          })
        }).then(() => {
          hugeBuyCharactor(param2).then((res) => {
            this.count++
            this.calculate(res, 7)
          })
        }).then(() => {
          hugeBuyActive(param2).then((res) => {
            this.count++
            this.calculate(res, 6)
          })
        })
      },
      calculate (res, type) {
        if (res.length > 0) {
          for (let key of res) {
            let index = this.selectParams.trdAcctType == 'zh' ? this.queryMktrdtopList.findIndex((item) => {
              return item.acctno == key.acctno
            }) : this.queryMktrdtopListYmt.findIndex((item) => {
              return item.ymtno == key.ymtno
            })
            if (index != -1) {
              if (this.selectParams.trdAcctType == 'zh') {
                this.queryMktrdtopList[index].trd_character.push(type)
              } else {
                this.queryMktrdtopListYmt[index].trd_character.push(type)
              }
            }
          }
        }
      },
      Tdatestopreload () {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            if (this.TdateReloadOperate == '停止刷新') {
              clearInterval(this.TdatetimerFun)
              this.TdateReloadOperate = '开始刷新'
              this.selectStop = false
            } else if (this.TdateReloadOperate == '开始刷新') {
              this.TdateReloadOperate = '停止刷新'
              this.selectStop = true
              this.TdatetimerFun = setTimeout(this.postQueryMktrdtop, this.selectParams.tdatereloadTime * 1000)
            }
          }
        })
      },
      handleRowClassName ({row, rowIndex}) {
        let index = this.selectArr.findIndex(item => {
          return item['acctno' || 'ymtno'] == row['acctno' || 'ymtno']
        })
        if (index > -1) {
          return 'highlight'
        }
        if (row.deal_mark && row.deal_mark.indexOf('已暂停交易') != -1) {
          return 'accounttimeout'
        } else if (row.deal_mark) {
          return 'accountother'
        }
        return ''
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      defineName (row, column, cell, event) {
        if (column.property == 'deal_mark') {
          let par = {
            trdAcctType: this.selectParams.trdAcctType,
            trdDirection: this.selectParams.trdDirection,
            accno: this.selectParams.trdAcctType == 'zh' ? row.acctno : row.ymtno,
            trdDate: this.selectDate,
            dealmark: row.deal_mark,
            accname: this.selectParams.trdAcctType == 'zh' ? row.acctname : row.ymtname,
            brn: this.selectParams.trdAcctType == 'zh' ? row.brnname : '',
            investorType: this.selectParams.trdAcctType == 'zh' ? row.acctype : '',
            trdamtJe: row.trdamt_je,
            trdamtB: row.trdamt_b,
            trdamtS: row.trdamt_s,
            jmchs: ''
          }
          this.$refs.markupDialog.dealHisData = par
          this.$refs.markupDialog.dialogVisble = true
        }
      },
      toNewOpen (url, name, height = 960, width = 1920) {
        window.open(url, name, `height=${height}, width=${width}, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
      },
      toDetail (row) {
        let param = {
          acctno: row.acctno,
          acctname: row.acctname,
          brnname: row.brnname,
          acctymtno: row.acctymtno ? row.acctymtno : '',
          character: row.trd_character
        }
        let startTime = this.selectParams.timePicker ? this.selectParams.timePicker[0].replace(/:/g, '') : '090000',
        endTime = this.selectParams.timePicker ? this.selectParams.timePicker[1].replace(/:/g, '') : '170000'
        if (this.selectParams.trdAcctType == 'zh')
          this.toNewOpen(`#/accountDetail/${row.acctno}/${this.selectDate}/${this.selectParams.trdAcctType}/${this.selectParams.trdDirection}/${startTime}/${endTime}/${JSON.stringify(param)}`, 'account_new_open')
        else
          this.toNewOpen(`#/accountDetailYmt/${row.ymtno}/${this.selectDate}/${this.selectParams.trdAcctType}/${this.selectParams.trdDirection}/${startTime}/${endTime}/${JSON.stringify(param)}`, 'account_new_open')
      },
      dealMarkDefine () {
        this.toNewOpen(`#/dealMarkDefine`, 'dealMarkDefine', 404, 800)
      },
      exportAccountMarked () {
        this.toNewOpen(`#/processingTagExport/1/${this.selectDate}`, 'processingTagExport', 404, 600)
      },
      closeDialog (data) {
        let index = -1
        if (data.trdAcctType == 'zh') {
          index = this.queryMktrdtopList.findIndex((item) => {
            return item.acctno == data.accno
          })
        } else {
          index = this.queryMktrdtopListYmt.findIndex((item) => {
            return item.ymtno == data.accno
          })
        }
        this.$set(data.trdAcctType == 'zh' ? this.queryMktrdtopList[index] : this.queryMktrdtopListYmt[index], 'deal_mark', data.deal_mark)
        this.$set(data.trdAcctType == 'zh' ? this.queryMktrdtopList[index] : this.queryMktrdtopListYmt[index], 'deal_time', data.deal_time)
      },
      exportTable () {
        let arr = []
        this.multipleBehavioralCharacteristics.forEach((el) => {
          this.behavioralCharacteristics.forEach((res) => {
            if (el === res.value) {
              arr.push(res.text)
            }
          })
        })
        let acctype = this.multipleInstitutionsArray.join(',')
        let character = arr.join(',')
        let dealMark = this.multipleHandleTheMarkup.join(',')
        let fileColumns1 = [{
          field: 'acctno',
          label: '账户代码',
          width: '120',
          align: 'center',
          sortable: true
        }]
        let fileColumns2 = [
          {
            field: 'ymtno',
            label: '一码通代码',
            width: '120',
            align: 'center',
            sortable: true
          }
        ]
        this.column1.forEach((el) => {
          fileColumns1.push(el)
        })
        this.column2.forEach((el) => {
          fileColumns2.push(el)
        })
        let params = {
          trdDate: this.selectDate,
          trdTimStart: this.selectParams.timePicker ? this.selectParams.timePicker[0].replace(/:/g, '') : '090000',
          trdTimEnd: this.selectParams.timePicker ? this.selectParams.timePicker[1].replace(/:/g, '') : '170000',
          trdDirection: this.selectParams.trdDirection,
          trdAcctType: this.selectParams.trdAcctType,
          type: this.stockCode.codeType,
          value: this.stockCode.code,
          acctype: this.selectParams.trdAcctType === 'zh' ? acctype : '',
          character: this.selectParams.trdAcctType === 'zh' ? character : '',
          dealMark: this.selectParams.trdAcctType === 'zh' ? dealMark : '',
          tableColumns: [{
            sheetName: this.selectParams.trdAcctType === 'zh' ? '账户居前交易统计表' : '一码通居前交易统计表',
            fileColumns: this.selectParams.trdAcctType === 'zh' ? fileColumns1 : fileColumns2
          }
          ]
        }
        this.gfnExportFileWithForm('/fluct/account-market-stability/v1/export', params)
      }
    },
    created () {
      this.ajaxGitTradeDate()
    },
    //   发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
      this.init()
      this.getDealMarkDefine()
      this.getCharactorParam()
      this.getControlBuyData()
      this.queryPauseNumData()
    },
    beforeDestroy () {
      clearInterval(this.TdatetimerFun)
    }

  }
</script>
<style lang="less">
    .account-list .accounttimeout {
        background-color: rgba(14, 23, 41, 0.5) !important;
    }

    .account-list .submitBtnBox {
        display: none;
    }

    .account-list .accountother {
        background-color: #3d507a !important;
    }

    .account-list .highlight {
        background-color: #D28C28 !important;
    }

    .account-list .accountDialog .el-dialog {
        width: 57%;
        .el-dialog__body {
            padding: 30px 0px 10px;
        }
    }

    .account-list .accountEdit .el-dialog {
        width: 25%;
        .el-form-item {
            display: block;
        }
    }

    .account-list .accountother, .accounttimeout {
        > td {
            color: rgba(255, 255, 255, 0.6) !important;
            border-right-color: rgba(255, 255, 255, 0.1) !important;
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
        }
    }

    .account-list .limitContent {
        text-align: left;
        position: absolute;
        bottom: -45px;
        right: 20px;
        width: 200px;
        border-radius: 4px;
        padding: 5px;
        background-color: rgba(0, 0, 0, 0.6);
        p {
            font-size: 12px;
            line-height: 12px;
        }
    }
</style>
