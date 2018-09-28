<template>
  <div>
    <el-card class="el-card-table">
      <div slot="header">
        {{typeOfRZRQ}}明细
      </div>
      <div>
        <el-table
          :data="tableData"
          :fit=true
          :highlight-current-row="false"
          border
          v-loading="queryResLoad"
          element-loading-spinner="el-icon-loading"
          element-loading-text="数据加载中，请耐心等待..."
          element-loading-background="rgba(0,0,0,0.3)">
          <el-table-column
            v-for="item in tableOptions"
            :prop="item.field"
            :label="item.label"
            :key="item.field"
            :width="item.width"
            :align="item.align == null ? 'center' : item.align"
            :sortable="item.sortable == null ? false : item.sortable"
            :sort-method="item.sortMethod"
            resizable
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    getBeforeSecuritiesDetail,
    getBeforeFinacingDetail
  } from '@/service/analysisTool/securitiesMarginTrading/index'

  export default {
    name: 'open-new-window',
    data () {
      return {
        msg: '11111',
        tableData: [],
        tableOptions: [],
        tableOptionsOfRZ: [
          {label: '券商代码', field: 'member_id', align: 'left', sortable: false},
          {label: '券商名称', field: 'member_name', align: 'left', sortable: false},
          {label: '前日融资余额', field: 'lastday_rzye', align: 'right', sortable: false},
          {label: '融资余额', field: 'today_rzye', align: 'right', sortable: false},
          {label: '融资买入额', field: 'today_rzmr', align: 'right', sortable: false},
          {label: '融资偿还额', field: 'today_rzche', align: 'right', sortable: false},
          {label: '直接还款额', field: 'today_zjhke', align: 'right', sortable: false},
          {label: '卖券还款额', field: 'today_mqhke', align: 'right', sortable: false},
          {label: '融资强制平仓额', field: 'today_rzpc', align: 'right', sortable: false},
          {label: '融资正权益调整', field: 'today_rzzqytz', align: 'right', sortable: false},
          {label: '融资负权益调整', field: 'today_rzfqytz', align: 'right', sortable: false}
        ],
        tableOptionsOfRQ: [
          {label: '券商代码', field: 'member_id', align: 'left', sortable: false},
          {label: '券商名称', field: 'member_name', align: 'left', sortable: false},
          {label: '前日融券余量', field: 'lastday_rqyl', align: 'right', sortable: false},
          {label: '融券余量', field: 'today_rqyl', align: 'right', sortable: false},
          {label: '融券卖出量', field: 'today_rqmcl', align: 'right', sortable: false},
          {label: '融券偿还量', field: 'today_rqchl', align: 'right', sortable: false},
          {label: '买券还券量', field: 'today_mqhql', align: 'right', sortable: false},
          {label: '直接还券量', field: 'today_zjhql', align: 'right', sortable: false},
          {label: '融券强制平仓', field: 'today_rqpcl', align: 'right', sortable: false},
          {label: '余券划转量', field: 'today_yqhzl', align: 'right', sortable: false},
          {label: '融券正权益调整', field: 'today_rqzqytz', align: 'right', sortable: false},
          {label: '融券负权益调整', field: 'today_rqfqytz', align: 'right', sortable: false},
          {label: '融券余量金额', field: 'today_rqylje', align: 'right', sortable: false}
        ],
        queryResLoad: false,

        params: {},
        typeOfRZRQ: ''
      }
    },
    methods: {},
    mounted () {
      // "#/financeLoansecOpen/RQ/2013-11-18/合计"
      this.params['type'] = window.location.hash.split('/')[2]
      this.params['pre_trandat'] = window.location.hash.split('/')[3]
      this.params['securityId'] = window.location.hash.split('/')[4]
      switch (this.params.type) {
        case 'RZ' :
          this.typeOfRZRQ = '融资余额'
          this.tableOptions = this.tableOptionsOfRZ
          getBeforeFinacingDetail(this.params).then(resp => {
            if (resp) {
              this.tableData = resp.bizData.metaData
            }
          })
          break
        case 'RQ' :
          this.typeOfRZRQ = '融券余量'
          this.tableOptions = this.tableOptionsOfRQ
          getBeforeSecuritiesDetail(this.params).then(resp => {
            if (resp) {
              this.tableData = resp.bizData.metaData
            }
          })
          break
      }
    }
  }
</script>

<style lang="less">

</style>
