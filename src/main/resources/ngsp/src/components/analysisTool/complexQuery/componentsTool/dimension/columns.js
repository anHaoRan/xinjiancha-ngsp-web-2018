import Vue from 'vue'

function gfnElColFormatDec5Dimen (row, column, cellValue) {
  if (cellValue === null) return ''
  return Number(cellValue) === 0 ? 0 : Vue.prototype.gfnFormatDecimal(cellValue, 5)
}

// 完整的8个表格

//修改

// 0: 账户, 2: PBU, 4: 营业部, 6：会员； 1: 账户—逐日, 3: PBU—逐日, 5: 营业部—逐日, 7: 会员—逐日
export const columnsList = [
    {
      id: 9901,
      label: '交易日期',
      field: 'trade_date',
      align: 'left',
      everyType: '3', // everyType: 1 表示都可以显示， everyType: 2 表示不勾选逐日的时候才展示， everyType: 3 表示勾选逐日才展示
      statisticsType: [1, 1, 1, 1], // 账户 PBU 营业部 会员四个维度，1表示展示，2表示不展示
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 10,
      label: '账户代码',
      field: 'acct_id',
      align: 'left',
      everyType: '1', // everyType: 1 表示都可以显示， everyType: 2 表示不勾选逐日的时候才展示， everyType: 3 表示勾选逐日才展示
      statisticsType: [1, 2, 2, 2], // 账户 PBU 营业部 会员四个维度，1表示展示，2表示不展示
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 20,
      label: '账户名称',
      field: 'acct_name',
      align: 'left',
      everyType: '1',
      statisticsType: [1, 2, 2, 2],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 30,
      label: '买成交量',
      field: 'trade_buy',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 31,
          label: '成交买入数量',
          field: 'trade_buy_vol',
          align: 'right',
          format: '0'
        },
        {
          id: 32,
          label: '成交买入数量占比',
          field: 'trade_buy_vol_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 40,
      label: '买成交额',
      field: 'trade_buy',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 41,
          label: '成交买入金额',
          field: 'trade_buy_amt',
          align: 'right',
          formatter: Vue.prototype.gfnElColFormatDec2,
          format: '0.00'
        },
        {
          id: 42,
          label: '成交买入金额占比',
          field: 'trade_buy_amt_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 50,
      label: '卖成交量',
      field: 'trade_sell',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 51,
          label: '成交卖出数量',
          field: 'trade_sell_vol',
          align: 'right',
          format: '0'
        },
        {
          id: 52,
          label: '成交卖出数量占比',
          field: 'trade_sell_vol_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 60,
      label: '卖成交额',
      field: 'trade_sell',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 61,
          label: '成交卖出金额',
          field: 'trade_sell_amt',
          align: 'right',
          formatter: Vue.prototype.gfnElColFormatDec2,
          format: '0.00'
        },
        {
          id: 62,
          label: '成交卖出金额占比',
          field: 'trade_sell_amt_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 70,
      label: '净买卖量',
      field: 'net_buy_vol',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 71,
          label: '净买入数量',
          field: 'net_buy_vol',
          align: 'right',
          format: '0'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 80,
      label: '净买卖额',
      field: 'net_buy_amt',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 81,
          label: '净买入金额',
          field: 'net_buy_amt',
          align: 'right',
          formatter: Vue.prototype.gfnElColFormatDec2,
          format: '0.00'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 4433,
      label: '交易账户数',
      field: 'trade_acct_cnt',
      align: 'center',
      everyType: '3',
      statisticsType: [2, 2, 1, 1],
      children: [
        {
          id: 4434,
          label: '交易账户数',
          field: 'trade_acct_cnt',
          align: 'right',
          format: '0'
        }
      ]
    },
    {
      id: 90,
      label: '买委托量',
      field: 'order_buy',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 91,
          label: '委托买入数量',
          field: 'order_buy_vol',
          align: 'right',
          format: '0'
        },
        {
          id: 92,
          label: '委托买入数量占比',
          field: 'order_buy_vol_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 100,
      label: '买委托额',
      field: 'order_buy',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 101,
          label: '委托买入金额',
          field: 'order_buy_amt',
          align: 'right',
          formatter: Vue.prototype.gfnElColFormatDec2,
          format: '0.00'
        },
        {
          id: 102,
          label: '委托买入金额占比',
          field: 'order_buy_amt_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 110,
      label: '卖委托量',
      field: 'order_sell',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 111,
          label: '委托卖出数量',
          field: 'order_sell_vol',
          align: 'right',
          format: '0'
        },
        {
          id: 112,
          label: '委托卖出数量占比',
          field: 'order_sell_vol_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 120,
      label: '卖委托额',
      field: 'order_sell',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 1, 1],
      children: [
        {
          id: 121,
          label: '委托卖出金额',
          field: 'order_sell_amt',
          align: 'right',
          formatter: Vue.prototype.gfnElColFormatDec2,
          format: '0.00'
        },
        {
          id: 122,
          label: '委托卖出金额占比',
          field: 'order_sell_amt_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 130,
      label: '期间最大持股',
      align: 'center',
      everyType: '2',
      statisticsType: [1, 2, 2, 2],
      field: '8',
      children: [
        {
          id: 131,
          label: '期间最大持有数量',
          field: 'max_hold_vol',
          align: 'right',
          format: '0'
        },
        {
          id: 132,
          label: '最大持仓占比',
          field: 'max_hold_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 140,
      label: '期初前持股',
      align: 'center',
      everyType: '2',
      statisticsType: [1, 1, 2, 1],
      field: '8',
      children: [
        {
          id: 141,
          label: '期初前持有数量',
          field: 'before_hold_vol',
          align: 'right',
          format: '0'
        },
        {
          id: 142,
          label: '期初前持仓占比',
          field: 'before_hold_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 150,
      label: '期初持股',
      align: 'center',
      everyType: '2',
      statisticsType: [1, 1, 2, 1],
      field: 'before_hold',
      children: [
        {
          id: 151,
          label: '期初持有数量',
          field: 'before_hold_vol',
          align: 'right',
          format: '0'
        },
        {
          id: 152,
          label: '期初持仓占比',
          field: 'before_hold_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 160,
      label: '期末持股',
      field: 'end_hold',
      align: 'center',
      everyType: '2',
      statisticsType: [1, 1, 2, 1],
      children: [
        {
          id: 161,
          label: '期末持有数量',
          field: 'end_hold_vol',
          align: 'right',
          format: '0'
        },
        {
          id: 162,
          label: '期末持仓占比',
          field: 'end_hold_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 170,
      label: '当日持股',
      field: '10',
      align: 'center',
      everyType: '3',
      statisticsType: [1, 1, 2, 1],
      children: [
        {
          id: 171,
          label: '当日持有数量',
          field: 'hold_vol',
          align: 'right',
          format: '0'
        },
        {
          id: 172,
          label: '当日持仓占比',
          field: 'hold_ratio',
          align: 'right',
          formatter: gfnElColFormatDec5Dimen,
          format: '0.00000'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 180,
      label: '持股单一情况',
      field: '11',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 2, 2],
      children: [
        {
          id: 181,
          label: '持股单一天数',
          field: 'single_date_cnt',
          align: 'right',
          format: '0'
        },
        {
          id: 182,
          label: '持股单一超过80%',
          field: 'single_flag',
          align: 'left'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 190,
      label: '持股单一账户',
      field: 'single_flag',
      everyType: 1,
      statisticsType: [1, 2, 2, 2],
      align: 'left',
      isTwoTable: true,
      format: '0',
      show: true // 是否展示当前列
    },
    {
      id: 200,
      label: '账户开户信息',
      field: '12',
      align: 'center',
      everyType: 1,
      statisticsType: [1, 2, 2, 2],
      children: [
        {
          id: 201,
          label: '账户名称',
          field: 'acct_name',
          align: 'left'
        },
        {
          id: 202,
          label: '账户开户证件号',
          field: 'id_card',
          align: 'left',
          format: '0'
        }
      ],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 210,
      label: 'PBU代码',
      field: 'pbu_id',
      align: 'left',
      everyType: 1,
      statisticsType: [1, 1, 2, 2],
      isTwoTable: true,
      format: '0',
      show: true // 是否展示当前列
    },
    {
      id: 220,
      label: '会员营业部名称',
      field: 'mem_branch_name',
      align: 'left',
      everyType: 1,
      statisticsType: [1, 1, 1, 2],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 230,
      label: '营业部来源',
      field: 'branch_source',
      align: 'left',
      everyType: 1,
      statisticsType: [1, 2, 2, 2],
      isTwoTable: true,
      show: true // 是否展示当前列
    },
    {
      id: 230,
      label: '会员名称',
      field: 'mem_name',
      align: 'left',
      everyType: 2,
      statisticsType: [2, 2, 2, 1],
      isTwoTable: true,
      show: true // 是否展示当前列
    }
  ]



