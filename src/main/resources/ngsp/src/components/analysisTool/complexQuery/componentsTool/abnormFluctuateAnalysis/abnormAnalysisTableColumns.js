import Vue from 'vue'
import {complexQueryDec0, complexQueryDec3} from '../common/sortMethods'

const fixedColumns = [
  {
    label: '股票代码',
    field: 'sec_code',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code'),
    show: true
  },
  {
    label: '股票名称',
    field: 'sec_name',
    align: 'left',
    sortable: true,
    sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name'),
    show: true
  },
  {
    label: '交易日期',
    field: 'trade_date',
    align: 'left',
    sortable: true,
    show: true
  }
]
export const tableColumns = [
  [
    ...fixedColumns,
    {
      label: '现在流通股本',
      field: 'nego_cap_vol',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '现在总股本',
      field: 'total_cap_vol',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '1个交易日振幅偏离值',
      field: 'swing_diff1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个交易日振幅偏离值',
      field: 'swing_diff3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '5个交易日振幅偏离值',
      field: 'swing_diff5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '20个交易日振幅偏离值',
      field: 'swing_diff20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个月振幅偏离值',
      field: 'swing_diff90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '6个月振幅偏离值',
      field: 'swing_diff180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '1个交易日涨跌幅偏离值',
      field: 'rf_diff1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个交易日涨跌幅偏离值',
      field: 'rf_diff3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '5个交易日涨跌幅偏离值',
      field: 'rf_diff5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '20个交易日涨跌幅偏离值',
      field: 'rf_diff20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个月涨跌幅偏离值',
      field: 'rf_diff90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '6个月涨跌幅偏离值',
      field: 'rf_diff180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '1个交易日股本变化比例(%)',
      field: 'cap_chg_ratio1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个交易日股本变化比例(%)',
      field: 'cap_chg_ratio3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '5个交易日股本变化比例(%)',
      field: 'cap_chg_ratio5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '20个交易日股本变化比例(%)',
      field: 'cap_chg_ratio20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个月股本变化比例(%)',
      field: 'cap_chg_ratio90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '6个月股本变化比例(%)',
      field: 'cap_chg_ratio180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '1个交易日换手率放大倍数',
      field: 'to_chg_ratio1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个交易日换手率放大倍数',
      field: 'to_chg_ratio3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '15个交易日换手率放大倍数',
      field: 'to_chg_ratio5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '20个交易日换手率放大倍数',
      field: 'to_chg_ratio20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    }
  ],
  [
    ...fixedColumns,
    {
      label: '1个交易日市场成交量',
      field: 'total_trade_vol1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个交易日市场成交量',
      field: 'total_trade_vol3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '5个交易日市场成交量',
      field: 'total_trade_vol5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '20个交易日市场成交量',
      field: 'total_trade_vol20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个月市场成交量',
      field: 'total_trade_vol90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '6个月市场成交量',
      field: 'total_trade_vol180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '1个交易日市场成交额',
      field: 'total_trade_amt1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个交易日市场成交额',
      field: 'total_trade_amt3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '5个交易日市场成交额',
      field: 'total_trade_amt5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '20个交易日市场成交额',
      field: 'total_trade_amt20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个月市场成交额',
      field: 'total_trade_amt90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '1个交易日最大买地区名称',
      field: 'max_buy_prov_desc1',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '3个交易日最大买地区名称',
      field: 'max_buy_prov_desc3',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '5个交易日最大买地区名称',
      field: 'max_buy_prov_desc5',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '20个交易日最大买地区名称',
      field: 'max_buy_prov_desc20',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '3个月最大买地区名称',
      field: 'max_buy_prov_desc90',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '6个月最大买地区名称',
      field: 'max_buy_prov_desc180',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '1个交易日最大卖地区名称',
      field: 'max_sell_prov_desc1',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '3个交易日最大卖地区名称',
      field: 'max_sell_prov_desc3',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '5个交易日最大卖地区名称',
      field: 'max_sell_prov_desc5',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '20个交易日最大卖地区名称',
      field: 'max_sell_prov_desc20',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '3个月最大卖地区名称',
      field: 'max_sell_prov_desc90',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '6个月最大卖地区名称',
      field: 'max_sell_prov_desc180',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '1个交易日买基金家数',
      field: 'buy_fund_com_cnt1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个交易日买基金家数',
      field: 'buy_fund_com_cnt3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '5个交易日买基金家数',
      field: 'buy_fund_com_cnt5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '20个交易日买基金家数',
      field: 'buy_fund_com_cnt20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个月买基金家数',
      field: 'buy_fund_com_cnt90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '6个月买基金家数',
      field: 'buy_fund_com_cnt180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '1个交易日卖基金家数',
      field: 'sell_fund_com_cnt1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个交易日卖基金家数',
      field: 'sell_fund_com_cnt3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '5个交易日卖基金家数',
      field: 'sell_fund_com_cnt5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '20个交易日卖基金家数',
      field: 'sell_fund_com_cnt20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个月卖基金家数',
      field: 'sell_fund_com_cnt90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '6个月卖基金家数',
      field: 'sell_fund_com_cnt180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '1个交易日买最大家基金买入量',
      field: 'max_com_buy_vol1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个交易日买最大家基金买入量',
      field: 'max_com_buy_vol3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '5个交易日买最大家基金买入量',
      field: 'max_com_buy_vol5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '20个交易日买最大家基金买入量',
      field: 'max_com_buy_vol20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个月买最大家基金买入量',
      field: 'max_com_buy_vol90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '6个月买最大家基金买入量',
      field: 'max_com_buy_vol180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '1个交易日卖最大家基金卖出量',
      field: 'max_com_sell_vol1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个交易日卖最大家基金卖出量',
      field: 'max_com_sell_vol3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '5个交易日卖最大家基金卖出量',
      field: 'max_com_sell_vol5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '20个交易日卖最大家基金卖出量',
      field: 'max_com_sell_vol20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个月卖最大家基金卖出量',
      field: 'max_com_sell_vol90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '6个月卖最大家基金卖出量',
      field: 'max_com_sell_vol180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '1个交易日内是否存在大宗交易',
      field: 'bt_trade_flag1',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '3个交易日内是否存在大宗交易',
      field: 'bt_trade_flag3',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '5个交易日内是否存在大宗交易',
      field: 'bt_trade_flag5',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '20个交易日内是否存在大宗交易',
      field: 'bt_trade_flag20',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '3个月内是否存在大宗交易',
      field: 'bt_trade_flag90',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '6个月内是否存在大宗交易',
      field: 'bt_trade_flag180',
      align: 'right',
      sortable: true,
      show: true
    },
    {
      label: '1个交易日买居前20营业部买入量',
      field: 'branch_buy_vol1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个交易日买居前20营业部买入量',
      field: 'branch_buy_vol3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '5个交易日买居前20营业部买入量',
      field: 'branch_buy_vol5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '20个交易日买居前20营业部买入量',
      field: 'branch_buy_vol20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个月买居前20营业部买入量',
      field: 'branch_buy_vol90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '6个月买居前20营业部买入量',
      field: 'branch_buy_vol180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '1个交易日买居前20营业部买入金额',
      field: 'branch_buy_amt1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个交易日买居前20营业部买入金额',
      field: 'branch_buy_amt3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '5个交易日买居前20营业部买入金额',
      field: 'branch_buy_amt5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '20个交易日买居前20营业部买入金额',
      field: 'branch_buy_amt20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个月买居前20营业部买入金额',
      field: 'branch_buy_amt90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '6个月买居前20营业部买入金额',
      field: 'branch_buy_amt180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '1个交易日卖居前20营业部卖出量',
      field: 'branch_sell_vol1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个交易日卖居前20营业部卖出量',
      field: 'branch_sell_vol3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '5个交易日卖居前20营业部卖出量',
      field: 'branch_sell_vol5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '20个交易日卖居前20营业部卖出量',
      field: 'branch_sell_vol20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '3个月卖居前20营业部卖出量',
      field: 'branch_sell_vol90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '6个月卖居前20营业部卖出量',
      field: 'branch_sell_vol180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec0,
      format: '#,##0'
    },
    {
      label: '1个交易日卖居前20营业部卖出金额',
      field: 'branch_sell_amt1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个交易日卖居前20营业部卖出金额',
      field: 'branch_sell_amt3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '5个交易日卖居前20营业部卖出金额',
      field: 'branch_sell_amt5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '20个交易日卖居前20营业部卖出金额',
      field: 'branch_sell_amt20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个月卖居前20营业部卖出金额',
      field: 'branch_sell_amt90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '6个月卖居前20营业部卖出金额',
      field: 'branch_sell_amt180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '1个交易日买最大地区占比(%)',
      field: 'max_prov_buy_ratio1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个交易日买最大地区占比(%)',
      field: 'max_prov_buy_ratio3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '5个交易日买最大地区占比(%)',
      field: 'max_prov_buy_ratio5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '20个交易日买最大地区占比(%)',
      field: 'max_prov_buy_ratio20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个月买最大地区占比(%)',
      field: 'max_prov_buy_ratio90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '6个月买最大地区占比(%)',
      field: 'max_prov_buy_ratio180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '1个交易日卖最大地区占比(%)',
      field: 'max_prov_sell_ratio1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个交易日卖最大地区占比(%)',
      field: 'max_prov_sell_ratio3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '5个交易日卖最大地区占比(%)',
      field: 'max_prov_sell_ratio5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '20个交易日卖最大地区占比(%)',
      field: 'max_prov_sell_ratio20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '3个月卖最大地区占比(%)',
      field: 'max_prov_sell_ratio90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '6个月卖最大地区占比(%)',
      field: 'max_prov_sell_ratio180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    }
  ],
  [
    ...fixedColumns,
    {
      label: '单一账户1个交易日持股变动比例(%)',
      field: 'hold_chg_ratio_1_1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '单一账户3个交易日持股变动比例(%)',
      field: 'hold_chg_ratio_1_3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '单一账户5个交易日持股变动比例(%)',
      field: 'hold_chg_ratio_1_5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '单一账户20个交易日持股变动比例(%)',
      field: 'hold_chg_ratio_1_20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '单一账户3个月持股变动比例(%)',
      field: 'hold_chg_ratio_1_90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '单一账户6个月持股变动比例(%)',
      field: 'hold_chg_ratio_1_180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前200股东1个交易日持股变动比例(%)',
      field: 'hold_chg_ratio_2_1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前200股东3个交易日持股变动比例(%)',
      field: 'hold_chg_ratio_2_3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前200股东5个交易日持股变动比例(%)',
      field: 'hold_chg_ratio_2_5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前200股东20个交易日持股变动比例(%)',
      field: 'hold_chg_ratio_2_20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前200股东3个月持股变动比例(%)',
      field: 'hold_chg_ratio_2_90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前200股东6个月持股变动比例(%)',
      field: 'hold_chg_ratio_2_180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前20席位1个交易日托管变动比例(%)',
      field: 'hold_chg_ratio_3_1',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前20席位3个交易日托管变动比例(%)',
      field: 'hold_chg_ratio_3_3',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前20席位5个交易日托管变动比例(%)',
      field: 'hold_chg_ratio_3_5',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前20席位20个交易日托管变动比例(%)',
      field: 'hold_chg_ratio_3_20',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前20席位3个月托管变动比例(%)',
      field: 'hold_chg_ratio_3_90',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    },
    {
      label: '前20席位6个月托管变动比例(%)',
      field: 'hold_chg_ratio_3_180',
      align: 'right',
      sortable: true,
      show: true,
      formatter: complexQueryDec3,
      format: '#,##0.000'
    }
  ]
]
