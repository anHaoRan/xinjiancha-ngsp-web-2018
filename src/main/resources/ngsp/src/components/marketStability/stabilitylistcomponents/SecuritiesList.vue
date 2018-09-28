<!-- 证券 -->
<template>
  <div class="securities-list">
    <el-card style="padding-top: 20px;">
      <el-button type="info" size="small" @click="isShow=isShow?false:true">{{isShow?'隐藏':'显示'}}/上证指数</el-button>
      <composite-index ref="composite" :is-show="isShow" :select-date="selectDate"></composite-index>
      <div>
        <el-date-picker type="date" v-model="selectDate" format="yyyyMMdd" value-format="yyyyMMdd"
                        placeholder="选择时间"
                        size="small"></el-date-picker>
        <el-button type="primary"
                   size="small" @click="selectDateNow">查询
        </el-button>
      </div>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header" class="clearfix">
        <span>板块贡献居前</span>
      </div>
      <el-table
        border
        ref="getboardtop"
        :data="getBoardTopData"
        tooltip-effect="dark"
        @current-change="handleCurrentChange"
        style="width: 100%; overflow:visible">
        <s-table-columns v-for="(item,index) in STABILITY_LIST_SECURITIES_BOARD"
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
          @click="selectProductTop">查询
        </el-button>
      </div>
      <el-form :inline="true">
        <el-form-item label="指定板块">
          <el-select v-model="boardSelect" size="small" :disabled="selectStop">
            <el-option v-for="item in getBoardTopData"
                       :key="item.board_code"
                       :label="item.board_name"
                       :value="item.board_code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易方向">
          <el-select v-model="tradeDirection" size="small" :disabled="selectStop">
            <el-option key="asc" label="卖出" value="asc"></el-option>
            <el-option key="desc" label="买入" value="desc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-time-picker
            :disabled="selectStop"
            size="small"
            is-range
            v-model="timePicker"
            value-format="HH-mm-ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item>
          <div class="reloadContainer" style="font-size: 14px;display: inherit;">
            隔
            <el-input size="small" style="width:40%" type="Number" v-model="TdatereloadTime"
                      :disabled="selectStop"></el-input>
            秒刷新
          </div>
          <el-button @click="Tdatestopreload" type="info"
                     size="small" class="refreshShop">
            {{TdateReloadOperate}}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small" @click="toCustomPlate">
            自定义板块
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="el-card-table">
      <div slot="header" class="clearfix">
        <span>证券贡献居前</span>
      </div>
      <el-table
        border
        ref="getproducttop"
        :data="getProductTopData"
        max-height="600"
        tooltip-effect="dark"
        style="width: 100%; overflow:visible">
        <el-table-column
          label="序号"
          align="center"
          type="index">
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          show-overflow-tooltip
          label="股票代码"
          min-width="4%">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row)">{{scope.row.s1}}</el-button>
          </template>
        </el-table-column>
        <s-table-columns v-for="(item,index) in STABILITY_LIST_SECURITIES_PRODUCT"
                         :key="index"
                         :item="item"
                         v-if="item.isActive===undefined||item.isActive"/>
      </el-table>
    </el-card>
  </div>
</template>
<script>

  import { getBoardTop, getProductTop } from '@/service/marketStability'
  //  指数涨跌幅
  import CompositeIndex from './component/CompositeIndex.vue'

  export default {
    props: {
      selectDate: {
        type: String,
        default: function () {
          return ''
        }
      }
    },
    components: {
      STableColumns: () => import('@/components/base/STableColumns'),  // 表格列
      CompositeIndex
    },
    data () {
      return {
        isShow: false,
        STABILITY_LIST_SECURITIES_BOARD: [
          {
            field: 'board_seq',
            label: '编号',
            width: '3%',
            align: 'center',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'board_seq')
          },
          {
            field: 'board_name',
            label: '板块名称',
            width: '6%',
            align: 'left',
            sortable: true
          },
          {
            field: 's5',
            label: '成交金额（亿元）',
            width: '6%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's5')
          },
          {
            field: 's5_per',
            label: '成交金额占全市场比',
            width: '6%',
            align: 'right',
            tooltip: '成交金额占全市场比 = 板块今成交金额/全市场成交金额*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's5_per')
          },
          {
            field: 'zdf',
            label: '板块涨跌幅',
            width: '6%',
            align: 'right',
            tooltip: '上证50涨跌幅 = (现价-昨收盘价)/昨收盘价*100;\n上证180涨跌幅 = (现价-昨收盘价)/昨收盘价*100;\n自定义板块涨跌幅 = (板块现市值-板块昨市值)/板块昨市值*100;',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zdf')
          },
          {
            field: 'gxd',
            label: '指数贡献度',
            width: '6%',
            align: 'right',
            tooltip: '指数贡献度 = 板块涨跌幅*板块当前市值/全市场当前市值',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'gxd')
          },
          {
            field: 'bs_y',
            label: '同比昨日成交金额倍数',
            width: '10%',
            align: 'right',
            tooltip: '同比昨日成交金额倍数 = 板块今成交金额/板块昨日成交金额',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'bs_y')
          },
          {
            field: 'bs_3days',
            label: '同比最近三个交易日成交金额倍数',
            width: '10%',
            align: 'right',
            tooltip: '同比最近三个交易日成交金额倍数 =今成交金额/近三个交易日成交金额之和',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'bs_3days')
          }
        ],
        STABILITY_LIST_SECURITIES_PRODUCT: [
          {
            field: 's2',
            label: '股票名称',
            width: '4%',
            align: 'left',
            sortable: true
          },
          {
            field: 's5',
            label: '成交金额（亿元）',
            width: '6%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's5')
          },
          {
            field: 's5_per',
            label: '成交金额占该板块比',
            width: '7%',
            align: 'right',
            tooltip: '成交金额占该板块比 = (证券成交金额/板块成交金额)*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 's5_per')
          },
          {
            field: 'zdf',
            label: '涨跌幅',
            width: '4%',
            align: 'right',
            tooltip: '涨跌幅:\n全天：(证券最新价-昨收盘价)/昨收盘价*100；\n指定时间段：(结束时间点证券价格-开始时间点证券价格)/开始时间点证券价格*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'zdf')
          },
          {
            field: 'gxd',
            label: '股票指数贡献度',
            width: '6%',
            align: 'right',
            tooltip: '股票指数贡献度 = 股票涨跌幅*股票市值/板块市值',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'gxd')
          },
          {
            field: 'invacctno',
            label: '净卖出金额最大的账户代码',
            width: '7%',
            align: 'left',
            sortable: true
          },
          {
            field: 'investor_account_name',
            label: '净卖出金额最大的账户名称',
            width: '7%',
            align: 'left',
            sortable: true
          },
          {
            field: 'maxjmc',
            label: '账户净卖出金额（万元）',
            width: '6%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'maxjmc')
          },
          {
            field: 'trdamt_s_per',
            label: '账户卖出金额占该股成交金额比例',
            width: '11%',
            align: 'right',
            tooltip: '账户卖出金额占该股成交金额比例 = 指定时间段内账户卖出金额/指定时间段内证券成交金额*100',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'trdamt_s_per')
          },
          {
            field: 'jmc',
            label: '账户当日净卖出金额（万元）',
            width: '7%',
            align: 'right',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'jmc')
          }
        ],
        submitData: {},
        getBoardTopData: [],
        getProductTopData: [],
        boardSelect: '',
        hideData: {
          boardSeq: '',
          dS5Board: '',
          dSzFloat: '',
          boardCode: ''
        },
        tradeDirection: 'asc',
        timePicker: ['09-00-00', '15-00-00'],
        TdateReloadOperate: '开始刷新',
        TdatereloadTime: 60,
        TdatetimerFun: null,
        selectStop: false,
        //  选中的行
        currentRow: null,
        windows: null
      }
    },
    watch: {
      boardSelect: function () {
        for (var i = 0; i < this.getBoardTopData.length; i++) {
          if (this.getBoardTopData[i].board_code == this.boardSelect) {
            this.hideData.boardSeq = this.getBoardTopData[i].board_seq
            this.hideData.dS5Board = this.getBoardTopData[i].s5_hide
            this.hideData.dSzFloat = this.getBoardTopData[i].sz_float_hide
            this.hideData.boardCode = this.getBoardTopData[i].board_code
            return
          }
        }
      },
      currentRow: function () {
        this.boardSelect = this.currentRow.board_code
      }
    },
    methods: {
      Tdatestopreload () {
        if (this.TdateReloadOperate == '停止刷新') {
          clearInterval(this.TdatetimerFun)
          this.TdateReloadOperate = '开始刷新'
          this.selectStop = false
        } else if (this.TdateReloadOperate == '开始刷新') {
          this.TdateReloadOperate = '停止刷新'
          this.selectStop = true
          this.TdatetimerFun = setTimeout(this.selectProductTop, this.TdatereloadTime * 1000)
        }
      },
      init () {
        getBoardTop(this.selectDate).then((res) => {
          this.getBoardTopData = res.bizData.metaData
          this.$refs.getboardtop.setCurrentRow(this.getBoardTopData[0])
        })
      },
      selectDateNow () {
        this.init()
        if (this.isShow)
          this.$refs.composite.drawLineChart(this.timePicker)
      },
      handleCurrentChange (val) {
        this.currentRow = val
      },
      selectProductTop () {
        let param = {
          tradeDate: this.selectDate,
          startTime: this.timePicker[0].replace(/-/g, ''),
          endTime: this.timePicker[1].replace(/-/g, ''),
          tradeDirection: this.tradeDirection,
          boardSeq: this.hideData.boardSeq,
          dS5Board: this.hideData.dS5Board,
          dSzFloat: this.hideData.dSzFloat,
          boardCode: this.hideData.boardCode
        }
        getProductTop(param).then((res) => {
          this.getProductTopData = res.bizData.metaData
          if (this.selectStop)
            this.TdatetimerFun = setTimeout(this.selectProductTop, this.TdatereloadTime * 1000)
        })
      },
      toNewOpen (url, height = 800, width = 1200) {
        if (this.windows) {
          this.windows.close()
        }
        this.windows = window.open(url, 'securities_new_open', `height=${height}, width=${width}, toobar=no, location=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no`)
      },
      toDetail (row) {
        this.toNewOpen(`#/securitiesDetail/${row.isin_code}/${this.selectDate}/${row.s1}/${this.timePicker.join(':')}`)
      },
      //  自定义板块
      toCustomPlate () {
        this.toNewOpen('#/customPlate')
      }
    },
    mounted () {
      this.init()
    },
    beforeDestroy () {
      clearInterval(this.TdatetimerFun)
    }
  }
</script>

<style>
</style>
