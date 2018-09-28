<template>
    <el-dialog
            title="选择处理标记"
            :visible.sync="dialogVisble"
            @close="dialogClose">
        <div>
            <el-card style="margin: 0;">
                <div slot="header" class="clearfix">
                    <span>处理标记</span>
                </div>
                <el-table
                        border
                        ref="dealDefineList"
                        :data="dealDefineList"
                        max-height="600"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width: 100%; overflow:visible">
                    <el-table-column
                            align="center"
                            type="selection">
                    </el-table-column>
                    <el-table-column
                            align="left"
                            header-align="center"
                            show-overflow-tooltip
                            label="序号"
                            prop="orderid"
                            min-width="6%">
                    </el-table-column>
                    <el-table-column
                            align="left"
                            header-align="center"
                            show-overflow-tooltip
                            label="处理标记"
                            key="dealmark"
                            prop="dealmark"
                            min-width="30%">
                    </el-table-column>
                </el-table>
                <el-button type="text" size="small" style="margin-top: 15px;" @click="querySaveDealMark">确定</el-button>
            </el-card>
            <el-card>
                <div slot="header">
                    <span>处理标记历史</span>
                    <el-select v-model="conditionSel" size="small">
                        <el-option key="dealmarkOption" label="处理标记" value="dealmarkOption"></el-option>
                        <el-option key="trddirectionOption" label="交易方向" value="trddirectionOption"></el-option>
                    </el-select>
                    <el-input v-model="conditionVal" size="small" style="width: 180px;"></el-input>
                    <el-button
                            style="float: none"
                            type="primary"
                            size="small"
                            @click="getQueryDealHisData">查询
                    </el-button>
                </div>
                <el-table
                        border
                        :data="queryDealHisData"
                        max-height="600"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width: 100%; overflow:visible">
                    <el-table-column
                            type="index">
                    </el-table-column>
                    <el-table-column
                            align="left"
                            header-align="center"
                            show-overflow-tooltip
                            v-for="data in markupHistory"
                            :key="data.field"
                            :label="data.label"
                            :prop="data.field">
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </el-dialog>
</template>
<script>
  import { dealMarkDefine, queryDealHisData, saveDealMark } from '@/service/marketStability'
  import moment from 'moment'

  export default {
    components: {},
    name: 'handle_the_markup',
    props: {},
    data () {
      return {
        dialogVisble: false,
        multipleSelection: [],
        dealDefineList: [],
        markupHistory: [
          {field: 'trade_date', label: '日期'},
          {field: 'trd_direction', label: '交易方向'},
          {field: 'acctype', label: '参与者层级'},
          {field: 'accno', label: '参与者代码'},
          {field: 'accname', label: '参与者名称'},
          {field: 'dealmark', label: '处理标记'},
          {field: 'dealtime', label: '处理时间'}],
        queryDealHisData: [],
        conditionSel: 'dealmarkOption',
        conditionVal: '',
        dealHisData: {
          trdAcctType: '',
          trdDirection: '',
          accno: '',
          trdDate: '',
          dealmark: '',
          accname: '',
          brn: '',
          investorType: '',
          trdamtJe: '',
          trdamtB: '',
          trdamtS: '',
          jmchs: ''
        }
      }
    },
    watch: {
      dealHisData: {
        handler: function () {
          this.getDealMarkDefine()
        },
        deep: true
      }
    },
    mounted () {
    },
    methods: {
      getDealMarkDefine () {
        dealMarkDefine().then((res) => {
          this.dealDefineList = res
          this.$nextTick(function () {
            this.$refs.dealDefineList.clearSelection()
            if (this.dealHisData.dealmark) {
              for (let key of this.dealHisData.dealmark.split('；')) {
                let index = this.dealDefineList.findIndex((item) => {
                  return item.dealmark == key
                })
                if (index != -1) {
                  this.$refs.dealDefineList.toggleRowSelection(this.dealDefineList[index])
                }
              }
            }
            this.getQueryDealHisData()
          })
        })
      },
      querySaveDealMark () {
        let arr = []
        for (let key of this.multipleSelection) {
          arr.push(key['dealmark'])
        }
        this.dealHisData.dealmark = arr.join('；')
        if (arr.length > 0) {
          this.dealHisData.dealmark += '；'
        }
        saveDealMark(this.dealHisData).then((res) => {
          this.dialogVisble = false
          let params = {
            accno: this.dealHisData.accno,
            trdAcctType: this.dealHisData.trdAcctType,
            deal_mark: this.dealHisData.dealmark,
            deal_time: res[0].deal_time
          }
          this.$emit('listen-markup', params)
        })
      },
      getQueryDealHisData () {
        let param = {
          trdAcctType: this.dealHisData.trdAcctType,
          accno: this.dealHisData.accno,
          trdDate: this.dealHisData.trdDate,
          conditionSel: this.conditionSel,
          conditionVal: this.conditionVal
        }
        queryDealHisData(param).then((res) => {
          this.queryDealHisData = res
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      dialogClose () {

      }
    }
  }
</script>
<style lang="less">
</style>
