<!--机构 -->
<template>
    <div class="institutions-list">
        <!--tep-->
        <el-card style="padding-top: 20px;">
            <el-button type="info" size="small" @click="isShow=isShow?false:true">{{isShow?'隐藏':'显示'}}/上证指数</el-button>
            <composite-index ref='composite' v-if="isShow" :select-date="selectDate"
                             :stockCode="stockCode"></composite-index>
            <el-row style="padding: 10px;">
                <el-col :span="4">
                    <span>标的：</span>
                    <div @click="stockSelect" style="display: inline-block;">
                        <el-input type="text" placeholder="请选择" :value="stock"
                                  size="small" @change="getChange">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="5">
                    <span>日期设置：</span>
                    <el-date-picker type="date"
                                    v-model="selectDate"
                                    format="yyyyMMdd"
                                    value-format="yyyyMMdd"
                                    placeholder="选择时间"
                                    size="small">
                    </el-date-picker>
                </el-col>
                <el-col :span="7">
                    <span>时间设置：</span>
                    <el-time-picker
                            size="small"
                            is-range
                            v-model="selecttimePicker"
                            value-format="HH:mm:ss"
                            range-separator="至"
                            start-placeholder="09:00:00"
                            end-placeholder="17:00:00"
                            placeholder="选择时间范围">
                    </el-time-picker>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary"
                               size="small" @click="selectDateNow">查询
                    </el-button>
                </el-col>
            </el-row>
            <account-stock-select @refreshIsShow="refreshIsShowBox" @refreshAddItems="refreshAddItemList"
                                  @getCode='getCode'
                                  class="addItemBox" style="position: absolute;z-index: 100;left: 0px"
                                  @closeSelect="closeSelect"
                                  v-show="stockShow"></account-stock-select>
        </el-card>

        <el-card class="el-card-table">
            <div slot="header" class="clearfix">
                <span>各分类机构卖出汇总</span>
            </div>
            <el-table
                    border
                    ref="investorSoldTotal"
                    :data="investorSoldTotal"
                    tooltip-effect="dark"
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    style="width: 100%; overflow:visible">
                <el-table-column
                        label="序号"
                        width="55"
                        align="center"
                        type="index">
                </el-table-column>
                <s-table-columns v-for="(item,index) in STABILITY_LIST_INSTITUTIONS_SOLDTOTAL"
                                 :key="index"
                                 :item="item"
                                 v-if="item.isActive===undefined||item.isActive"/>
            </el-table>
        </el-card>
        <el-card>
            <div slot="header" class="clearfix">
                <span>查询条件</span>
                <el-button
                        type="primary"
                        size="small"
                        style="float:right;"
                        :disabled="selectStop"
                        @click="getCompanySoldTop">查询
                </el-button>
            </div>
            <el-form :inline="true" :model="selectParams" :rules="rules" ref="selectParams">
                <el-form-item label="指定机构类型">
                    <el-select v-model="selectParams.orgFlg" size="small" :disabled="selectStop">
                        <el-option v-for="item in investorSoldTotal"
                                   :key="item.orgflg"
                                   :label="item.orgflgname"
                                   :value="item.orgflg"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易方向">
                    <el-select v-model="selectParams.tradeDirection" size="small" :disabled="selectStop">
                        <el-option key="asc" label="净卖出" value="asc"></el-option>
                        <el-option key="desc" label="净买入" value="desc"></el-option>
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
            <div>
                <el-button @click="customAgencies" type="primary"
                           size="small">
                    自定义机构
                </el-button>
                <el-button @click="dealMarkDefine" type="primary"
                           size="small">
                    自定义处理标记
                </el-button>
                <el-button @click="exportAccountMarked" type="primary"
                           size="small">
                    处理标记导出
                </el-button>
            </div>
        </el-card>
        <el-card class="el-card-table">
            <div slot="header" class="clearfix">
                <span>指定机构类型公司交易居前统计</span>
                <el-button type="info" size="small" @click="exportTable()">导出</el-button>
            </div>
            <el-table
                    border
                    ref="namedData"
                    :data="namedData"
                    max-height="600"
                    tooltip-effect="dark"
                    :row-class-name="handleRowClassName"
                    @cell-dblclick="defineName"
                    style="width: 100%; overflow:visible">
                <el-table-column
                        label="序号"
                        width="55"
                        align="center"
                        class-name="table-index"
                        type="index">
                </el-table-column>
                <el-table-column
                        align="left"
                        header-align="center"
                        show-overflow-tooltip
                        prop="comp_code"
                        sortable
                        label="公司代码"
                        min-width="10%">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="toDetail(scope.row)">{{scope.row.comp_code}}
                        </el-button>
                    </template>
                </el-table-column>
                <s-table-columns v-for="(item,index) in STABILITY_LIST_INSTITUTIONS_SOLDTOP"
                                 :key="index"
                                 :item="item"
                                 v-if="item.isActive===undefined||item.isActive"/>
            </el-table>
        </el-card>
        <el-card class="el-card-table">
            <div slot="header" class="clearfix">
                <span>自定义机构交易居前统计</span>
            </div>
            <el-table
                    border
                    ref="definedData"
                    :data="definedData"
                    max-height="600"
                    tooltip-effect="dark"
                    :row-class-name="handleRowClassName"
                    @cell-dblclick="defineName"
                    style="width: 100%; overflow:visible">
                <el-table-column
                        label="序号"
                        width="55"
                        align="center"
                        class-name="table-index"
                        type="index">
                </el-table-column>
                <el-table-column
                        align="left"
                        header-align="center"
                        show-overflow-tooltip
                        prop="comp_name"
                        sortable
                        label="公司名称"
                        min-width="10%">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="toDetail(scope.row,1)">{{scope.row.comp_name}}
                        </el-button>
                    </template>
                </el-table-column>
                <s-table-columns v-for="(item,index) in STABILITY_LIST_INSTITUTIONS_SOLDTOP"
                                 :key="index"
                                 :item="item"
                                 v-if="(item.isActive===undefined||item.isActive)&&item.field!='comp_name'"/>
            </el-table>
        </el-card>
        <handle-the-markup ref="markupDialog" @listen-markup="closeDialog"></handle-the-markup>
    </div>
</template>
<script>
  import { getInvestorSoldTotal, getCompanySoldTop } from '@/service/marketStability'
  import { gitTradeDate } from '@/service/common/commonFunc'
  import HandleTheMarkup from './AccountNewOpen/HandleTheMarkup.vue'
  //   指数涨跌幅
  import CompositeIndex from './component/CompositeIndex.vue'
  import AccountStockSelect from './AccountStockSelect'

  export default {
    props: {},
    //    组件注册
    components: {
      STableColumns: () => import('@/components/base/STableColumns'),   //   表格列
      CompositeIndex,
      HandleTheMarkup,
      AccountStockSelect
    },
    data () {
      return {
        selectDate: '',
        isShow: false,
        STABILITY_LIST_INSTITUTIONS_SOLDTOTAL: [
          {
            field: 'orgflgname',
            label: '投资者类别',
            width: '6%',
            align: 'left',
            sortable: true
          },
          {
            field: 'trdamt_je',
            label: '净额（万元）',
            width: '10%',
            align: 'right',
            tooltip: '净额=买入金额-卖出金额',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_je')
          },
          {
            field: 'trdamt_b',
            label: '买入金额（万元）',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b')
          },
          {
            field: 'trdamt_s',
            label: '卖出金额（万元）',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s')
          },
          {
            field: 'trdamt_s_180',
            label: '卖出180金额（万元）',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s_180')
          },
          {
            field: 'trdamt_s_50',
            label: '卖出50金额（万元）',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s_50')
          },
          {
            field: 'trdamt_s_50_per',
            label: '卖出上证50金额占比',
            width: '10%',
            align: 'right',
            tooltip: '卖出上证50金额占比 = （卖出50金额/上证50成交金额）*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s_50_per')
          },
          {
            field: 'szsz_trdamt_per',
            label: '卖出金额占比',
            width: '10%',
            align: 'right',
            tooltip: '卖出金额占比 = （卖出金额/全市场成交金额）*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'szsz_trdamt_per')
          }
        ],
        STABILITY_LIST_INSTITUTIONS_SOLDTOP: [
          {
            field: 'comp_name',
            label: '公司名称',
            width: '10%',
            align: 'left',
            sortable: true
          },
          {
            field: 'je',
            label: '净额（万元）',
            width: '10%',
            align: 'right',
            tooltip: '净额=买入金额-卖出金额',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'je')
          },
          {
            field: 'trdamt_b',
            label: '买入金额（万元）',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_b')
          },
          {
            field: 'trdamt_s',
            label: '卖出金额（万元）',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s')
          },
          {
            field: 'jmrhs',
            label: '净买入户数',
            width: '10%',
            align: 'right',
            tooltip: '净买入户数：指定公司下净买入金额大于0的账户个数',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'jmrhs')
          },
          {
            field: 'jmchs',
            label: '净卖出户数',
            width: '10%',
            align: 'right',
            tooltip: '净卖出户数：指定公司下净卖出金额大于0的账户个数',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'jmchs')
          },
          {
            field: 'zhs',
            label: '总户数',
            width: '10%',
            align: 'right',
            tooltip: '总户数：指定公司下参与交易的账户总数',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zhs')
          },
          {
            field: 'deal_mark',
            label: '处理标记',
            width: '10%',
            align: 'left',
            tooltip: '',
            sortable: true
          },
          {
            field: 'ytx_trdamt_je',
            label: '提醒后净额',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ytx_trdamt_je')
          },
          {
            field: 'ytx_trdamt_30je',
            label: '提醒30分钟后净额',
            width: '10%',
            align: 'right',
            formatter: this.gfnElColFormatDecThou,
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'ytx_trdamt_30je')
          },
          {
            field: 'deal_time',
            label: '处理时间',
            width: '10%',
            align: 'left',
            tooltip: '',
            sortable: true
          }
        ],
        selectParams: {
          tradeDirection: 'asc',
          timePicker: ['09:00:00', '15:00:00'],
          orgFlg: '',
          tdatereloadTime: '60'
        },
        rules: {
          tdatereloadTime: [
            {type: 'string', pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur'}
          ]
        },
        selecttimePicker: ['09:00:00', '15:00:00'],
        //   各分类机构卖出汇总
        investorSoldTotal: [],
        //   指定机构类型公司交易居前统计
        namedData: [],
        //   自定义机构交易居前统计
        definedData: [],
        selectStop: false,
        TdateReloadOperate: '开始刷新',
        TdatetimerFun: null,
        //     选中的行
        currentRow: null,
        // securityName: ' 上证指数', //   证券选择框显示内容
        // securityCode: '000001', //   证券选择框
        stock: '000001 上证指数',
        stockCode: {
          codeType: 'index',  //   标的类型
          code: '000001'  //   标的代码
        },
        stockShow: false //   证券选择框
      }
    },
    watch: {
      currentRow: function () {
        this.selectParams.orgFlg = this.currentRow.orgflg
      }
    },
    methods: {
      getChange (val) {
        this.stock = val
      },
      stockSelect () {
        this.stockShow = true
      },
      closeSelect () {
        this.stockShow = false
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
        this.stockCode.code = obj.code
      },
      ajaxGitTradeDate () {
        gitTradeDate().then((res) => {
          this.selectDate = res
          this.init()
        })
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
              this.TdatetimerFun = setTimeout(this.getCompanySoldTop, this.selectParams.tdatereloadTime * 1000)
            }
          }
        })
      },
      handleRowClassName ({row, rowIndex}) {
        if (row.deal_mark && row.deal_mark.indexOf('已暂停交易') != -1) {
          return 'accounttimeout'
        } else if (row.deal_mark) {
          return 'accountother'
        }
        return ''
      },
      init () {
        let param = {
          tradeDate: this.selectDate,
          startTime: this.selecttimePicker ? this.selecttimePicker[0].replace(/:/g, '') : '090000',
          endTime: this.selecttimePicker ? this.selecttimePicker[1].replace(/:/g, '') : '170000',
          type: this.stockCode.codeType,
          value: this.stockCode.code
        }
        getInvestorSoldTotal(param).then((res) => {
          this.investorSoldTotal = res.bizData.metaData
          this.$refs.investorSoldTotal.setCurrentRow(this.investorSoldTotal[0])
        })
      },
      selectDateNow () {
        if (!this.stock) {
          this.$message.warning('请选择标的')
          return
        }
        if (this.selectDate == null) {
          this.$message.warning('请选择查询日期')
          return
        }
        this.init()
        if (this.isShow)
          this.$refs.composite.drawLineChart(this.selecttimePicker)
      },
      handleCurrentChange (val) {
        this.currentRow = val
      },
      getCompanySoldTop () {
        let param = {
          tradeDate: this.selectDate,
          startTime: this.selectParams.timePicker ? this.selectParams.timePicker[0].replace(/:/g, '') : '090000',
          endTime: this.selectParams.timePicker ? this.selectParams.timePicker[1].replace(/:/g, '') : '170000',
          orgFlg: this.selectParams.orgFlg,
          tradeDirection: this.selectParams.tradeDirection,
          type: this.stockCode.codeType,
          value: this.stockCode.code
        }
        getCompanySoldTop(param).then((res) => {
          this.namedData = res.namedData
          this.definedData = res.definedData
          if (this.selectStop)
            this.TdatetimerFun = setTimeout(this.getCompanySoldTop, this.selectParams.tdatereloadTime * 1000)
        })
      },
      toNewOpen (url, name, height = 960, width = 1920) {
        window.open(url, name, `height=${height}, width=${width}, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
      },
      toDetail (row, type = 0) {
        console.log(row)
        this.toNewOpen(`#/institutionsDetail/${row.comp_code}/${row.comp_name}/${type > 0 ? 'CUSTOM' : this.selectParams.orgFlg}/${row.compseq}/${this.selectDate}/${this.selectParams.tradeDirection}/${this.stockCode.codeType}/${this.stockCode.code}`, 'institutions_new_open')
      },
      //   自定义机构
      customAgencies () {
        this.toNewOpen('#/institutionsNewOpen', 'institutionsNewOpen', 800, 1200)
      },
      //   自定义处理标记
      dealMarkDefine () {
        this.toNewOpen(`#/dealMarkDefine`, 'dealMarkDefine', 404, 800)
      },
      exportAccountMarked () {
        this.toNewOpen(`#/processingTagExport/2/${this.selectDate}`, 'processingTagExport', 404, 600)
      },
      defineName (row, column, cell, event) {
        if (column.property == 'deal_mark') {
          let par = {
            trdAcctType: '2',
            trdDirection: this.selectParams.tradeDirection == 'asc' ? 'jmc' : 'jmr',
            accno: row.comp_code,
            trdDate: this.selectDate,
            dealmark: row.deal_mark,
            accname: row.comp_name,
            brn: '',
            investorType: this.currentRow.orgflgname,
            trdamtJe: row.je,
            trdamtB: row.trdamt_b,
            trdamtS: row.trdamt_s,
            jmchs: row.jmchs
          }
          this.$refs.markupDialog.dealHisData = par
          this.$refs.markupDialog.dialogVisble = true
        }
      },
      closeDialog (data) {
        let index = this.namedData.findIndex((item) => {
          return item.comp_code == data.accno
        })
        let index2 = this.definedData.findIndex((item) => {
          return item.comp_code == data.accno
        })
        this.$set(index != -1 ? this.namedData[index] : this.definedData[index2], 'deal_mark', data.deal_mark)
        this.$set(index != -1 ? this.namedData[index] : this.definedData[index2], 'deal_time', data.deal_time)
      },
      exportTable () {
        let arr = [{
          field: 'comp_code',
          label: '公司代码',
          width: '10%',
          align: 'left',
          sortable: true
        }]
        let params = {
          tradeDate: this.selectDate,
          startTime: this.selectParams.timePicker ? this.selectParams.timePicker[0].replace(/:/g, '') : '090000',
          endTime: this.selectParams.timePicker ? this.selectParams.timePicker[1].replace(/:/g, '') : '170000',
          orgFlg: this.selectParams.orgFlg,
          tradeDirection: this.selectParams.tradeDirection,
          type: this.stockCode.codeType,
          value: this.stockCode.code,
          tableColumns: [{
            sheetName: '指定机构类型公司交易居前统计',
            fileColumns: [...arr, ...this.STABILITY_LIST_INSTITUTIONS_SOLDTOP]
          }
          ]
        }
        this.gfnExportFileWithForm('/fluct/org-market-stability/v1/export', params)
      }
    },
    created () {
    },
    //    发起请求，拿回数据，配合路由钩子做一些事情
    mounted () {
      this.ajaxGitTradeDate()
    },
    beforeDestroy () {
      clearInterval(this.TdatetimerFun)
    }
  }
</script>
<style lang="less">
    .institutions-list .accounttimeout {
        background-color: rgba(14, 23, 41, 0.5) !important;
    }

    .institutions-list .submitBtnBox {
        display: none;
    }

    .institutions-list .accountother {
        background-color: #3d507a !important;
    }

    .institutions-list .accountother, .accounttimeout {
        > td {
            color: rgba(255, 255, 255, 0.6) !important;
            border-right-color: rgba(255, 255, 255, 0.1) !important;
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
        }
    }
</style>
