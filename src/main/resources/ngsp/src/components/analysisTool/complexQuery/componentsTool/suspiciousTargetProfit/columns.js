import Vue from 'vue'

function colFormatDec4(row, column, cellValue) {
  if (cellValue == null) return ''
  return Number(cellValue) === 0 ? 0 : Vue.prototype.gfnFormatDecimal(cellValue, 4)
}

export const columns = [
  [
    [
      {
        label: '证券代码',
        field: 'sec_code',
        align: 'left'
      },
      {
        label: '证券简称',
        field: 'sec_name',
        align: 'left'
      },
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '持股数量',
        field: 'hold_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '持股占总股本比例',
        field: 'tot_cap_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '持股占非限售流通股本比例',
        field: 'nego_cap_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '买入数量占比',
        field: 'buy_vol_s_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '买入数量排名',
        field: 'buy_rank',
        align: 'right',
        format: '0'
      },
      {
        label: '买入数量',
        field: 'buy_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '买入金额',
        field: 'buy_amt_s',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '买入均价',
        field: 'buy_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '卖出数量占比',
        field: 'sell_vol_s_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '卖出数量排名',
        field: 'sell_rank',
        align: 'right',
        format: '0'
      },
      {
        label: '卖出数量',
        field: 'sell_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '卖出金额',
        field: 'sell_amt_s',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '卖出均价',
        field: 'sell_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '委托买入数量占比',
        field: 'o_buy_vol_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '委托买入数量排名',
        field: 'order_b_rank',
        align: 'right',
        format: '0'
      },
      {
        label: '委托买入金额占比',
        field: 'o_buy_amt_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '委托买入数量',
        field: 'o_buy_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '委托买入金额',
        field: 'o_buy_amt_s',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '委托卖出数量占比',
        field: 'o_sell_vol_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '委托卖出数量排名',
        field: 'order_s_rank',
        align: 'right',
        format: '0'
      },
      {
        label: '委托卖出金额占比',
        field: 'o_sell_amt_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '委托卖出数量',
        field: 'o_sell_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '委托卖出金额',
        field: 'o_sell_amt_s',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '对倒数量占比',
        field: 'trade_vol_inter_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '对倒数量',
        field: 'trade_vol_inter',
        align: 'right',
        format: '0'
      },
      {
        label: '对倒金额',
        field: 'trade_amt_inter',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '对倒均价',
        field: 'trade_price_inter',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '该股收盘价',
        field: 'curr_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '市场成交总量（万股）',
        field: 'trade_vol',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场成交总额（万元）',
        field: 'trade_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场委托买入总量（万股）',
        field: 'order_b_vol',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场委托卖出总量（万股）',
        field: 'order_s_vol',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场委托买入总额（万元）',
        field: 'order_b_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场委托卖出总额（万元）',
        field: 'order_s_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '该股自由流通量（万股）',
        field: 'free_cap',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '该股非限售流通股本（万股）',
        field: 'nego_cap',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '该股总股本（万股）',
        field: 'tot_cap',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      }
    ],
    [
      {
        label: '股东账户',
        field: 'acct_id',
        align: 'left'
      },
      {
        label: '股东名称',
        field: 'acct_name',
        align: 'left'
      },
      {
        label: '期末持股数量',
        field: 'hold_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '买入数量',
        field: 'buy_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '委托买入数量',
        field: 'o_buy_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '买入金额',
        field: 'buy_amt_s',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '委托买入金额',
        field: 'o_buy_amt_s',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '买入均价',
        field: 'buy_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '卖出数量',
        field: 'sell_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '委托卖出数量',
        field: 'o_sell_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '卖出金额',
        field: 'sell_amt_s',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '委托卖出金额',
        field: 'o_sell_amt_s',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '卖出均价',
        field: 'sell_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '对倒数量',
        field: 'trade_vol_inter',
        align: 'right',
        format: '0'
      },
      {
        label: '对倒金额',
        field: 'trade_amt_inter',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '对倒均价',
        field: 'trade_inter_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '会员营业部',
        field: 'branch_name',
        align: 'left'
      }
    ],
    [
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '股东账户',
        field: 'acct_id',
        align: 'left'
      },
      {
        label: '股东名称',
        field: 'acct_name',
        align: 'left'
      },
      {
        label: '持股数量',
        field: 'hold_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '买入数量',
        field: 'buy_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '买入金额',
        field: 'buy_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '买入均价',
        field: 'buy_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '卖出数量',
        field: 'sell_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '卖出金额',
        field: 'sell_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '卖出均价',
        field: 'sell_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '对倒数量',
        field: 'inter_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '对倒金额',
        field: 'inter_trade_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '对倒均价',
        field: 'inter_trade_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '委托买入数量',
        field: 'o_buy_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '委托买入金额',
        field: 'o_buy_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '委托卖出数量',
        field: 'o_sell_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '委托卖出金额',
        field: 'o_sell_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      }
    ],
    [
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '成交时间',
        field: 'trade_time',
        align: 'left'
      },
      {
        label: '成交编号',
        field: 'trade_no',
        align: 'left',
        format: '0'
      },
      {
        label: '卖方股东账户',
        field: 'acct_id_s',
        align: 'left'
      },
      {
        label: '卖方股东名称',
        field: 'acct_name_s',
        align: 'left'
      },
      {
        label: '买方股东账户',
        field: 'acct_id_b',
        align: 'left'
      },
      {
        label: '买方股东名称',
        field: 'acct_name_b',
        align: 'left'
      },
      {
        label: '成交数量',
        field: 'inter_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '成交金额',
        field: 'inter_trade_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      }
    ],
    [
      {
        label: '账户组持仓量占流通盘比例（X%）',
        field: 'seq_name',
        align: 'center'
      },
      {
        label: '账户组持仓量占流通盘比例超过X%的天数',
        field: 'cnt',
        align: 'center'
      },
      {
        label: '账户组持仓量占流通盘比例超过X%的天数／总交易天数',
        field: 'cnt_rate',
        align: 'center'
      }
    ],
    [
      {
        label: '账户组交易量占总交易量比例（X%）',
        field: 'seq_name',
        align: 'center'
      },
      {
        label: '账户组交易量占总交易量比例超过X%的天数',
        field: 'cnt',
        align: 'center'
      },
      {
        label: '账户组交易量占总交易量比例超过X%的天数／总交易天数',
        field: 'cnt_rate',
        align: 'center'
      }
    ],
    [
      {
        label: '账户组对倒量占总交易量比例（X%）',
        field: 'seq_name',
        align: 'center'
      },
      {
        label: '账户组对倒量占总交易量比例超过X%的天数',
        field: 'cnt',
        align: 'center'
      },
      {
        label: '账户组对倒量占总交易量比例超过X%的天数／总交易天数',
        field: 'cnt_rate',
        align: 'center'
      }
    ],
    [
      {
        label: '开始日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '结束日期',
        field: 'max_trade_date',
        align: 'left'
      },

      {
        label: '期间账户组交易量',
        field: 'sum_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '期间该股总交易量',
        field: 'sum_total_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '期间账户组交易量占该股总交易量比重％',
        field: 'sum_trade_ratio',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      }
    ],
    [
      {
        label: '开始日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '结束日期',
        field: 'max_trade_date',
        align: 'left'
      },

      {
        label: '期间账户组对倒量',
        field: 'sum_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '期间该股总交易量',
        field: 'sum_total_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '期间账户组对倒量占该股总交易量比重％',
        field: 'sum_trade_ratio',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      }
    ],
    [],
    [],
    []
  ],
  [
    [
      {
        label: '证券代码',
        field: 'sec_code',
        align: 'left'
      },
      {
        label: '证券简称',
        field: 'sec_name',
        align: 'left'
      },
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '持股数量',
        field: 'hold_vol_s',
        align: 'right',
        format: '0'
      },
      {
        label: '持股占总股本比例',
        field: 'tot_cap_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '持股占非限售流通股本比例',
        field: 'nego_cap_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '买入数量占比',
        field: 'buy_vol_bt_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '买入数量排名',
        field: 'bt_buy_rank',
        align: 'right',
        format: '0'
      },
      {
        label: '买入数量',
        field: 'buy_vol_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '买入金额',
        field: 'buy_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '买入均价',
        field: 'buy_bt_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '卖出数量占比',
        field: 'sell_vol_bt_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '卖出数量排名',
        field: 'bt_sell_rank',
        align: 'right',
        format: '0'
      },
      {
        label: '卖出数量',
        field: 'sell_vol_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '卖出金额',
        field: 'sell_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '卖出均价',
        field: 'sell_bt_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '委托买入数量占比',
        field: 'order_b_vol_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '委托买入数量排名',
        field: 'bt_order_b_rank',
        align: 'right',
        format: '0'
      },
      {
        label: '委托买入金额占比',
        field: 'order_b_amt_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '委托买入数量',
        field: 'o_buy_vol_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '委托买入金额',
        field: 'o_buy_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '委托卖出数量占比',
        field: 'order_s_vol_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '委托卖出数量排名',
        field: 'bt_order_s_rank',
        align: 'right',
        format: '0'
      },
      {
        label: '委托卖出金额占比',
        field: 'order_s_amt_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '委托卖出数量',
        field: 'o_sell_vol_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '委托卖出金额',
        field: 'o_sell_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '对倒数量占比',
        field: 'trade_vol_inter_rate',
        align: 'right',
        formatter: colFormatDec4,
        format: '0.0000'
      },
      {
        label: '对倒数量',
        field: 'trade_vol_inter_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '对倒金额',
        field: 'trade_amt_inter_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '对倒均价',
        field: 'trade_price_inter',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '该股收盘价',
        field: 'curr_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '市场成交总量（万股）',
        field: 'trade_vol_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场成交总额（万元）',
        field: 'trade_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场委托买入总量（万股）',
        field: 'order_b_vol_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场委托卖出总量（万股）',
        field: 'order_s_vol_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场委托买入总额（万元）',
        field: 'order_b_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '市场委托卖出总额（万元）',
        field: 'order_s_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '该股自由流通量（万股）',
        field: 'free_cap',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '该股非限售流通股本（万股）',
        field: 'nego_cap',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '该股总股本（万股）',
        field: 'tot_cap',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      }
    ],
    [
      {
        label: '股东账户',
        field: 'acct_id',
        align: 'left'
      },
      {
        label: '股东名称',
        field: 'acct_name',
        align: 'left'
      },
      {
        label: '期末持股数量',
        field: 'hold_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '买入数量',
        field: 'buy_vol_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '委托买入数量',
        field: 'o_buy_vol_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '买入金额',
        field: 'buy_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '委托买入金额',
        field: 'o_buy_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '买入均价',
        field: 'buy_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '卖出数量',
        field: 'sell_vol_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '委托卖出数量',
        field: 'o_sell_vol_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '卖出金额',
        field: 'sell_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '委托卖出金额',
        field: 'o_sell_amt_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '卖出均价',
        field: 'sell_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '对倒数量',
        field: 'trade_vol_inter_bt',
        align: 'right',
        format: '0'
      },
      {
        label: '对倒金额',
        field: 'trade_amt_inter_bt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '对倒均价',
        field: 'trade_inter_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '会员营业部',
        field: 'branch_name',
        align: 'left'
      }
    ],
    [
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '股东账户',
        field: 'acct_id',
        align: 'left'
      },
      {
        label: '股东名称',
        field: 'acct_name',
        align: 'left'
      },
      {
        label: '持股数量',
        field: 'hold_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '买入数量',
        field: 'bt_buy_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '买入金额',
        field: 'bt_buy_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '买入均价',
        field: 'buy_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '卖出数量',
        field: 'bt_sell_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '卖出金额',
        field: 'bt_sell_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '卖出均价',
        field: 'sell_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '对倒数量',
        field: 'bt_inter_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '对倒金额',
        field: 'bt_inter_trade_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '对倒均价',
        field: 'inter_trade_price',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      },
      {
        label: '委托买入数量',
        field: 'bt_o_buy_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '委托买入金额',
        field: 'bt_o_buy_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      },
      {
        label: '委托卖出数量',
        field: 'bt_o_sell_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '委托卖出金额',
        field: 'bt_o_sell_amt',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      }
    ],
    [
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '成交时间',
        field: 'trade_time',
        align: 'left'
      },
      {
        label: '成交编号',
        field: 'trade_no',
        align: 'left',
        format: '0'
      },
      {
        label: '卖方股东账户',
        field: 'acct_id_s',
        align: 'left'
      },
      {
        label: '卖方股东名称',
        field: 'acct_name_s',
        align: 'left'
      },
      {
        label: '买方股东账户',
        field: 'acct_id_b',
        align: 'left'
      },
      {
        label: '买方股东名称',
        field: 'acct_name_b',
        align: 'left'
      },
      {
        label: '成交数量',
        field: 'bt_inter_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '成交金额',
        field: 'bt_inter_trade_vol',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec2,
        format: '0.00'
      }
    ],
    [
      {
        label: '账户组持仓量占流通盘比例（X%）',
        field: 'seq_name',
        align: 'center'
      },
      {
        label: '账户组持仓量占流通盘比例超过X%的天数',
        field: 'cnt',
        align: 'center'
      },
      {
        label: '账户组持仓量占流通盘比例超过X%的天数／总交易天数',
        field: 'cnt_rate',
        align: 'center'
      }
    ],
    [
      {
        label: '账户组交易量占总交易量比例（X%）',
        field: 'seq_name',
        align: 'center'
      },
      {
        label: '账户组交易量占总交易量比例超过X%的天数',
        field: 'cnt',
        align: 'center'
      },
      {
        label: '账户组交易量占总交易量比例超过X%的天数／总交易天数',
        field: 'cnt_rate',
        align: 'center'
      }
    ],
    [
      {
        label: '账户组对倒量占总交易量比例（X%）',
        field: 'seq_name',
        align: 'center'
      },
      {
        label: '账户组对倒量占总交易量比例超过X%的天数',
        field: 'cnt',
        align: 'center'
      },
      {
        label: '账户组对倒量占总交易量比例超过X%的天数／总交易天数',
        field: 'cnt_rate',
        align: 'center'
      }
    ],
    [
      {
        label: '开始日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '结束日期',
        field: 'max_trade_date',
        align: 'left'
      },

      {
        label: '期间账户组交易量',
        field: 'sum_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '期间该股总交易量',
        field: 'sum_total_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '期间账户组交易量占该股总交易量比重％',
        field: 'sum_trade_ratio',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      }
    ],
    [
      {
        label: '开始日期',
        field: 'trade_date',
        align: 'left'
      },
      {
        label: '结束日期',
        field: 'max_trade_date',
        align: 'left'
      },

      {
        label: '期间账户组对倒量',
        field: 'sum_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '期间该股总交易量',
        field: 'sum_total_trade_vol',
        align: 'right',
        format: '0'
      },
      {
        label: '期间账户组对倒量占该股总交易量比重％',
        field: 'sum_trade_ratio',
        align: 'right',
        formatter: Vue.prototype.gfnElColFormatDec3,
        format: '0.000'
      }
    ],
    [],
    [],
    []
  ]
]
