import Vue from 'vue'
import {complexQueryDec0, complexQueryDec3} from '../common/sortMethods'

export const tableColumns = [
  [
    [
      {
        label: '证券代码',
        field: 'sec_code',
        align: 'left',
        sortable: true,
        show: true,
        sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
      },
      {
        label: '证券简称',
        field: 'sec_name',
        align: 'left',
        sortable: true,
        show: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
      },
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left',
        show: true,
        sortable: true
      },
      {
        label: '成交时间',
        field: 'trade_time',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortColByDetailTime.bind(Vue, 'trade_time')
      },
      {
        label: '成交编号',
        field: 'trade_no',
        align: 'left',
        show: true,
        sortable: true,
        formatter: complexQueryDec0,
        format: '#,##0'
      },
      {
        label: '成交价格',
        field: 'trade_price',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec3,
        format: '#,##0.000'
      },
      {
        label: '成交数量',
        field: 'trade_vol',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec0,
        format: '#,##0'
      },
      {
        label: '成交金额',
        field: 'trade_amt',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec3,
        format: '#,##0.000'
      },
      {
        label: '本方买卖方向',
        field: 'trade_dir_1',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_dir_1')
      },
      {
        label: '本方股东代码',
        field: 'acct_id_1',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id_1')
      },
      {
        label: '本方股东名称',
        field: 'acct_name_1',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name_1')
      },
      {
        label: '本方会员营业部',
        field: 'branch_name_1',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name_1')
      },
      {
        label: '本方交易PBU',
        field: 'pbu_id_1',
        align: 'left',
        show: true,
        sortable: true
      },
      {
        label: '对方股东代码',
        field: 'acct_id_2',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id_2')
      },
      {
        label: '对方股东名称',
        field: 'acct_name_2',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name_2')
      },
      {
        label: '对方会员营业部',
        field: 'branch_name_2',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name_2')
      },
      {
        label: '对方交易PBU',
        field: 'pbu_id_2',
        align: 'left',
        show: true,
        sortable: true
      }],
    [
      {
        label: '证券代码',
        field: 'sec_code',
        align: 'left',
        sortable: true,
        show: true,
        sortMethod: Vue.prototype.gfnSortColByNumber.bind(Vue, 'sec_code')
      },
      {
        label: '证券简称',
        field: 'sec_name',
        align: 'left',
        sortable: true,
        show: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'sec_name')
      },
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left',
        show: true,
        sortable: true
      },
      {
        label: '成交时间',
        field: 'trade_time',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortColByDetailTime.bind(Vue, 'trade_time')
      },
      {
        label: '成交编号',
        field: 'trade_no',
        align: 'left',
        show: true,
        sortable: true,
        formatter: complexQueryDec0,
        format: '#,##0'
      },
      {
        label: '成交价格',
        field: 'trade_price',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec3,
        format: '#,##0.000'
      },
      {
        label: '成交数量',
        field: 'trade_vol',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec0,
        format: '#,##0'
      },
      {
        label: '成交金额',
        field: 'trade_amt',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec3,
        format: '#,##0.000'
      },
      {
        label: '本方买卖方向',
        field: 'trade_dir_1',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_dir_1')
      },
      {
        label: '本方股东代码',
        field: 'acct_id_1',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id_1')
      },
      {
        label: '本方股东名称',
        field: 'acct_name_1',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name_1')
      },
      {
        label: '本方会员营业部',
        field: 'branch_name_1',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name_1')
      },
      {
        label: '本方交易PBU',
        field: 'pbu_id_1',
        align: 'left',
        show: true,
        sortable: true
      },
      {
        label: '对方股东代码',
        field: 'acct_id_2',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id_2')
      },
      {
        label: '对方股东名称',
        field: 'acct_name_2',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name_2')
      },
      {
        label: '对方会员营业部',
        field: 'branch_name_2',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'branch_name_2')
      },
      {
        label: '对方交易PBU',
        field: 'pbu_id_2',
        align: 'left',
        show: true,
        sortable: true
      }]
  ],
  [
    [
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left',
        show: true,
        sortable: true
      },
      {
        label: '成交时间',
        field: 'trade_time',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortColByDetailTime.bind(Vue, 'trade_time')
      },
      {
        label: '成交编号',
        field: 'trade_no',
        align: 'left',
        show: true,
        sortable: true,
        formatter: complexQueryDec0,
        format: '#,##0'
      },
      {
        label: '买方所在账户组',
        field: 'acct_group_a',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_group_a')
      },
      {
        label: '买方股东账号',
        field: 'acct_id_a',
        align: 'right',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id_a')
      },
      {
        label: '买方股东名称',
        field: 'acct_name_a',
        align: 'right',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name_a')
      },
      {
        label: '卖方所在账户组',
        field: 'acct_group_b',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_group_b')
      },
      {
        label: '卖方股东账号',
        field: 'acct_id_b',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id_b')
      },
      {
        label: '卖方股东名称',
        field: 'acct_name_b',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name_b')
      },
      {
        label: '成交数量',
        field: 'trade_vol',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec0,
        format: '#,##0'
      },
      {
        label: '成交金额',
        field: 'trade_amt',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec3,
        format: '#,##0.000'
      },
      {
        label: '买方证件号',
        field: 'id_card_a',
        align: 'right',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'id_card_a')
      },
      {
        label: '卖方证件号',
        field: 'id_card_b',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'id_card_b')
      }],
    [
      {
        label: '交易日期',
        field: 'trade_date',
        align: 'left',
        show: true,
        sortable: true
      },
      {
        label: '成交时间',
        field: 'trade_time',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortColByDetailTime.bind(Vue, 'trade_time')
      },
      {
        label: '成交编号',
        field: 'trade_no',
        align: 'left',
        show: true,
        sortable: true,
        formatter: complexQueryDec0,
        format: '#,##0'
      },
      {
        label: '买方所在账户组',
        field: 'acct_group_a',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_group_a')
      },
      {
        label: '买方股东账号',
        field: 'acct_id_a',
        align: 'right',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id_a')
      },
      {
        label: '买方股东名称',
        field: 'acct_name_a',
        align: 'right',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name_a')
      },
      {
        label: '卖方所在账户组',
        field: 'acct_group_b',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'trade_dir_1')
      },
      {
        label: '卖方股东账号',
        field: 'acct_id_b',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_id_b')
      },
      {
        label: '卖方股东名称',
        field: 'acct_name_b',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'acct_name_b')
      },
      {
        label: '成交数量',
        field: 'trade_vol',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec0,
        format: '#,##0'
      },
      {
        label: '成交金额',
        field: 'trade_amt',
        align: 'right',
        show: true,
        sortable: true,
        formatter: complexQueryDec3,
        format: '#,##0.000'
      },
      {
        label: '买方证件号',
        field: 'id_card_a',
        align: 'right',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'id_card_a')
      },
      {
        label: '卖方证件号',
        field: 'id_card_b',
        align: 'left',
        show: true,
        sortable: true,
        sortMethod: Vue.prototype.gfnSortByChineseCharacters.bind(Vue, 'id_card_b')
      }]
  ]
]
