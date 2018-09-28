import TableColumnCanClickComponent from '@/components/systemManage/common/TableColumnCanClickComponent'
export const monitorReasonOptions = ['涉嫌跨期操纵', '涉嫌短线操纵', '异动股', '其他原因']
export const monitorLeavelOptions = ['0级', '1级', '2级', '3级']
export const clueMarkOptions = ['否', '是']
const monitorReasonFormat = (val) => {
  return monitorReasonOptions[val['monitor_reason']] || ''
}
const monitorLeavelFormat = (val) => {
  return monitorLeavelOptions[val['monitor_leavel']] || ''
}
export const columns1 = [
  {label: '监控编号', field: 'monitor_id'},
  {label: '证券代码及简称', field: 'instrument_shot'},
  {label: '当日价格', field: 'todayprice'},
  {label: '当日涨跌幅', field: 'todayrate'},
  {label: '一周涨跌幅', field: 'weekrate'},
  {label: '一月涨跌幅', field: 'monthrate'},
  {label: '监控期内涨跌幅', field: 'periodrate'},
  {label: '监控原因', field: 'monitor_reason', formatter: monitorReasonFormat},
  {label: '监控级别', field: 'monitor_leavel', formatter: monitorLeavelFormat},
  {label: '创建者', field: 'create_person'},
  {label: '涉及账户组数', field: 'groupnum'},
  {label: '监控开始日期', field: 'watch_start_date'},
  {label: '监控结束日期', field: 'watch_end_date'},
  {label: '线索单号', field: 'clue_id', template: TableColumnCanClickComponent},
  {label: '状态', field: 'status'}
]
export const columns2 = [
  {label: '监控编号', field: 'monitor_id'},
  {label: '账户组名称', field: 'account_name'},
  {label: '账户组代码', field: 'account_code'},
  {label: '今日买入金额', field: 'sumbuy'},
  {label: '今日卖出金额', field: 'sumsale'},
  {label: '监控原因', field: 'monitor_reason', formatter: monitorReasonFormat},
  {label: '监控级别', field: 'monitor_leavel', formatter: monitorLeavelFormat},
  {label: '创建者', field: 'create_person'},
  {label: '涉及股票', field: 'sumins'},
  {label: '监控开始日期', field: 'start_time'},
  {label: '监控结束日期', field: 'end_time'},
  {label: '线索单号', field: 'clue_id', template: TableColumnCanClickComponent},
  {label: '账户组备注', field: 'remark'},
  {label: '状态', field: 'status'}
]
