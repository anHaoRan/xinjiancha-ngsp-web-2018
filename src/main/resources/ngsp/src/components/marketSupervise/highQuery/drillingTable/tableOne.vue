<template>
  <div class='tableOne'>
    <el-card class='el-card-table'>
      <div style='display: flex'>
        <el-tabs v-model='activeName' type='card' tab-position='left' @tab-click='changeTabs'>
          <el-tab-pane label='板块' name='first'>
          </el-tab-pane>
          <el-tab-pane label='股票' name='second'>
          </el-tab-pane>
          <el-tab-pane label='公司' name='three'>
          </el-tab-pane>
          <el-tab-pane label='交易会员' name='four'>
          </el-tab-pane>
          <el-tab-pane label='交易营业部' name='five'>
          </el-tab-pane>
          <el-tab-pane label='分类投资者' name='six'>
          </el-tab-pane>
          <el-tab-pane label='自定义投资者' name='seven'>
          </el-tab-pane>
          <el-tab-pane label='账户' name='eight'>
          </el-tab-pane>
        </el-tabs>
        <el-table
          v-if='isShow'
          :data='tableData'
          border
          style='width: 100%;'
          size='mini'
          height='416'
          v-loading='companyLoading'
          element-loading-text='拼命加载中'
          element-loading-spinner='el-icon-loading'
          element-loading-background='rgba(0,0,0,0.8)'
          @header-click="headerClick"
          :cell-class-name='tableColumnClassName'
          @select='selectedRow'
          @select-all='selectedAllRow'>
          <el-table-column
            label='序号'
            align='center'
            type='index'
            width='50'>
          </el-table-column>
          <el-table-column
            :check='check'
            header-align='center'
            align='center'
            type='selection'
            min-width='50'>
          </el-table-column>
          <el-table-column
            v-for='item in tableColumns'
            :align='item.align'
            header-align='center'
            :key='item.field'
            :show-overflow-tooltip='true'
            :prop='item.field'
            :label='item.label'
            :sortable='item.sortable'
            :sort-by='item.sortBy'
            :sort-method='item.sortMethod'
            :min-width='item.width'
            :formatter='item.formatter'>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <double-per-dou-psw @isPass='isPass' @isShow='getShowDilog'
                        :dialogFormVisble='dialogFormVisble'></double-per-dou-psw>
  </div>
</template>

<script>
  import {postTableData} from '../../../../service/marketSupervise/highQuery/index'
  import {getCurTradeDate, getRelativeTradeDate} from '../../../../service/common/commonFunc'
  import DoublePerDouPsw from '../../../common/DoublePerDouPsw'
  import moment from 'moment';

  export default {
    components: {
      DoublePerDouPsw
    },
    data() {
      return {
        activeName: '',
        isShow: false,
        // 表格数据
        tableData: [],
        tableColumns: [],
        check: true,
        lastLable: '',
        startTime: '',
        endTime: '',
        companyLoading: false,
        sharingBeginTime: '',
        sharingEndTime: '',
        currentDate: '',
        relativeTradeDate: '',
        sortType: 'B', // 排序类型
        tabsName: '',
        dialogFormVisble: false,
        flag: true
      }
    },
    mounted() {
      this.getDate()
    },
    watch: {
      tabsNameParams: {
        handler: function (param1, param2) {
          this.activeName = ''
          this.tableData = []
          this.tableColumns = []
          this.isShow = false
        },
        deep: true
      }
    },
    computed: {
      brushTimeParams() {
        return this.$store.state.highQuery.brushTime
      },
      brushSharingTimeParams() {
        return this.$store.state.highQuery.brushSharingTime
      },
      dateParams() {
        return this.$store.state.highQuery.dateParams
      },
      tabsNameParams() {
        return this.$store.state.highQuery.tabName
      }
    },
    methods: {
      isPass(val) {
        console.log(val);
        this.flag = !val
        this.isShow = val
      },
      getShowDilog(val) {
        this.dialogFormVisble = val
      },
      // 获取当前交易日
      getDate() {
        getCurTradeDate().then(resp => {
          this.currentDate = resp
        })
        getRelativeTradeDate('-5').then(resp => {
          this.relativeTradeDate = resp
        })
      },
      // 表格行选中
      selectedRow(row) {
        let params = []
        row.forEach((el) => {
          params.push(el.id_hidden)
        })
        this.$store.commit('savetableOneRows', params.join(','))
      },
      // 表格行全选
      selectedAllRow(row) {
        let params = []
        row.forEach((el) => {
          params.push(el.id_hidden)
        })
        this.$store.commit('savetableOneRows', params.join(','))
      },
      headerClick(val) {
        if (val.sortBy[0]) {
          if (this.sortType != val.sortBy[0]) {
            this.sortType = val.sortBy[0]
            this.getTableData(this.tabsName)
          }
        }
      },
      getTableData(tabName) {
        if (this.tabsNameParams == 'sharingTime') {
          this.startTime = !this.dateParams ? this.currentDate : this.dateParams
          this.endTime = !this.dateParams ? this.currentDate : this.dateParams
          this.sharingBeginTime = !this.brushSharingTimeParams.beginTime ? '' : moment(this.brushSharingTimeParams.beginTime, 'HH:mm').format('HHmm')
          this.sharingEndTime = !this.brushSharingTimeParams.endTime ? '' : moment(this.brushSharingTimeParams.endTime, 'HH:mm').format('HHmm')
        } else {
          this.startTime = !this.brushTimeParams.startTime ? this.relativeTradeDate : moment(this.brushTimeParams.startTime, 'YYYY/MM/DD').format('YYYYMMDD')
          this.endTime = !this.brushTimeParams.overTime ? this.currentDate : moment(this.brushTimeParams.overTime, 'YYYY/MM/DD').format('YYYYMMDD')
          this.sharingBeginTime = ''
          this.sharingEndTime = ''
        }
        let tabsName = tabName
        let dimParams = {
          'tradeDateBegin': this.startTime,
          'tradeDateEnd': this.endTime,
          'tradeTimStart': this.sharingBeginTime,
          'tradeTimEnd': this.sharingEndTime,
          'sortType': this.sortType,
          'topN': 100,
          'indusCodes': '',
          'securityIds': '',
          'compCodes': '',
          'memberIds': '',
          'brnIds': '',
          'investorTypecodes': '',
          'custorgCodes': '',
          'acctIds': ''
        }
        let indicParams = {
          'tradeDateBegin': this.startTime,
          'tradeDateEnd': this.endTime,
          'tradeTimStart': this.sharingBeginTime,
          'tradeTimEnd': this.sharingEndTime,
          'indusCodes': '',
          'securityIds': '',
          'compCodes': '',
          'memberIds': '',
          'brnIds': '',
          'investorTypecodes': '',
          'custorgCodes': '',
          'acctIds': ''
        }
        let indicTimeParams = {
          'tradeDateBegin': this.startTime,
          'tradeDateEnd': this.endTime,
          'tradeTimStart': this.sharingBeginTime,
          'tradeTimEnd': this.sharingEndTime
        }
        let params = {}
        this.companyLoading = true
        if (tabsName === '板块') {
          if (this.tabsNameParams == 'sharingTime') {
            params = {
              'dim': {
                'dimCode': 'dim.industry.indusType',
                'params': dimParams
              },
              'indic': [
                {
                  'indicCode': 'indic.industry.currPrice',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.industry.adv',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.industry.advRatio',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.industry.trdvolPlusGross',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.industry.trdamtPlusGross',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.industry.advRatioCmltv',
                  'params': indicTimeParams
                }
              ]
            }
          } else {
            params = {
              'dim': {
                'dimCode': 'dim.industry.indusType',
                'params': dimParams
              },
              'indic': [
                {
                  'indicCode': 'indic.industry.currPrice',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.industry.adv',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.industry.advRatio',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.industry.trdvolPlusGross',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.industry.trdamtPlusGross',
                  'params': indicParams
                }
              ]
            }
          }
        } else if (tabsName === '股票') {
          if (this.tabsNameParams == 'sharingTime') {
            params = {
              'dim': {
                'dimCode': 'dim.security.secType',
                'params': dimParams
              },
              'indic': [
                {
                  'indicCode': 'indic.security.currPrice',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.security.adv',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.security.advRatio',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.security.trdvolPlusGross',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.security.advRatioCmltv',
                  'params': indicTimeParams
                }
              ]
            }
          } else {
            params = {
              'dim': {
                'dimCode': 'dim.security.secType',
                'params': dimParams
              },
              'indic': [
                {
                  'indicCode': 'indic.security.currPrice',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.security.adv',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.security.advRatio',
                  'params': indicParams
                },
                {
                  'indicCode': 'indic.security.trdvolPlusGross',
                  'params': indicParams
                }
              ]
            }
          }
        } else if (tabsName === '公司') {
          params = {
            'dim': {
              'dimCode': 'dim.company.topN',
              'params': dimParams
            },
            'indic': [
              {
                'indicCode': 'indic.company.trdamtBuyGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.company.trdamtSaleGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.company.trdamtNetGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.company.trdamtNetGross.active',
                'params': indicParams
              },
              {
                'indicCode': 'indic.company.trdamtBuy.topnSec',
                'params': indicTimeParams
              }
            ]
          }
        } else if (tabsName === '交易会员') {
          params = {
            'dim': {
              'dimCode': 'dim.member.topN',
              'params': dimParams
            },
            'indic': [
              {
                'indicCode': 'indic.member.trdamtBuyGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.member.trdamtSaleGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.member.trdamtNetGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.member.trdamtNetGross.active',
                'params': indicParams
              },
              {
                'indicCode': 'indic.member.trdamtBuy.topnSec',
                'params': indicTimeParams
              }
            ]
          }
        } else if (tabsName === '交易营业部') {
          params = {
            'dim': {
              'dimCode': 'dim.branch.topN',
              'params': dimParams
            },
            'indic': [
              {
                'indicCode': 'indic.branch.trdamtBuyGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.branch.trdamtSaleGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.branch.trdamtNetGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.branch.trdamtNetGross.active',
                'params': indicParams
              },
              {
                'indicCode': 'indic.branch.trdamtBuy.topnSec',
                'params': indicTimeParams
              }
            ]
          }
        } else if (tabsName === '分类投资者') {
          params = {
            'dim': {
              'dimCode': 'dim.investor.investorType',
              'params': {
                'indusCodes': '',
                'securityIds': '',
                'compCodes': '',
                'memberIds': '',
                'brnIds': '',
                'investorTypecodes': '',
                'custorgCodes': '',
                'acctIds': ''
              }
            },
            'indic': [
              {
                'indicCode': 'indic.investor.trdamtBuyGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.investor.trdamtSaleGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.investor.trdamtNetGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.investor.trdamtActiveBuyGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.investor.trdamtActiveSaleGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.investor.trdamtActiveNetGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.investor.trdamtBuy.topnSec',
                'params': indicTimeParams
              }
            ]
          }
        } else if (tabsName === '自定义投资者') {
          params = {
            'dim': {
              'dimCode': 'dim.custorg.topN',
              'params': dimParams
            },
            'indic': [
              {
                'indicCode': 'indic.custorg.trdamtBuyGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.custorg.trdamtSaleGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.custorg.trdamtNetGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.custorg.trdamtBuyGross.active',
                'params': indicParams
              },
              {
                'indicCode': 'indic.custorg.trdamtSaleGross.active',
                'params': indicParams
              },
              {
                'indicCode': 'indic.custorg.trdamtNetGross.active',
                'params': indicParams
              },
              {
                'indicCode': 'indic.custorg.trdamtBuy.topnSec',
                'params': indicTimeParams
              }
            ]
          }
        } else {
          params = {
            'dim': {
              'dimCode': 'dim.personal.account.topN',
              'params': dimParams
            },
            'indic': [
              {
                'indicCode': 'indic.personal.acctInfo.acctType',
                'params': indicTimeParams
              },
              {
                'indicCode': 'indic.personal.trdamtBuyGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.personal.trdamtSaleGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.personal.trdamtNetGross',
                'params': indicParams
              },
              {
                'indicCode': 'indic.personal.trdamtBuyGross.active',
                'params': indicParams
              },
              {
                'indicCode': 'indic.personal.trdamtSaleGross.active',
                'params': indicParams
              },
              {
                'indicCode': 'indic.personal.trdamtNetGross.active',
                'params': indicParams
              },
              {
                'indicCode': 'indic.personal.trdamtBuy.topnSec',
                'params': indicTimeParams
              }
            ]
          }
        }
        postTableData(JSON.stringify(params)).then(resp => {
          this.tableColumns = []
          this.tableData = []
          if (!this.tableColumns.length) {
            resp.columns.code.forEach((el, index) => {
              if (!resp.columns.unitName[index]) {
                this.tableColumns.push({
                  field: el,
                  label: resp.columns.title[index],
                  align: 'center',
                  sortable: true,
                  sortBy: [resp.columns.sortType[index]],
                  sortMethod: (el.indexOf('name') > -1) ? this.gfnSortByChineseCharacters.bind(this, el) : this.gfnSortColByNumber.bind(this, el)
                })
              } else {
                this.tableColumns.push({
                  field: el,
                  label: resp.columns.title[index] + '(' + resp.columns.unitName[index] + ')',
                  align: 'center',
                  sortable: true,
                  sortBy: [resp.columns.sortType[index]],
                  sortMethod: (el.indexOf('name') > -1) ? this.gfnSortByChineseCharacters.bind(this, el) : this.gfnSortColByNumber.bind(this, el)
                })
              }
            })
          }
          resp.rows.forEach((el, index) => {
            resp.columns.unitDevide.forEach((res, num) => {
              if (res) {
                el[resp.columns.code[num]] = (el[resp.columns.code[num]] / res).toFixed(resp.columns.nPrecision[num])
              }
            })
          })
          this.companyLoading = false
          this.tableData = resp.rows
        })
        this.$store.commit('savetableOneParams', {status: true, tabName: tabsName})
        this.$store.commit('savetableTwoParams', {status: false, tabName: ''})
        this.$store.commit('savetableThreeParams', {status: false, tabName: ''})
        this.$store.commit('savetableFourParams', {status: false, tabName: ''})
        this.$store.commit('savetableFiveParams', {status: false, tabName: ''})
      },
      changeTabs(val) {
        if (val.label == '账户') {
          if (this.flag) {
            this.dialogFormVisble = true
            this.isShow = false
          }
        } else {
          this.isShow = true
        }
        this.tabsName = val.label
        this.getTableData(this.tabsName)
      },
      // 列颜色定义
      tableColumnClassName({row, column}) {
        if (column.label) {
          if (column.label == '涨跌点数' || column.label == '现价') {
            if (row.adv > 0) {
              return 'up'
            } else {
              return 'down'
            }
          }
          if (column.label == '涨跌幅(%)') {
            if (row.advrio > 0) {
              return 'up'
            } else {
              return 'down'
            }
          }
          if (column.label == '成交量(万手)') {
            if (row.trdvol_gross) {
              return 'dealCount'
            }
          }
          if (column.label == '成交金额(亿元)') {
            if (row.trdamt_gross) {
              return 'dealMoney'
            }
          }
        }
      }
    }
  }
</script>

<style lang='less'>
</style>
