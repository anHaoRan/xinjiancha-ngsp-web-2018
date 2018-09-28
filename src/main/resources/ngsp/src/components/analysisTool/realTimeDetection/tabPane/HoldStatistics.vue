<template>
  <div class="holdStatistics">
    <el-form :inline="true" :model="selectParams" :rules="rules">
      <el-card style="overflow: visible">
        <el-row :gutter="20">
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="参与者层级">
              <el-select v-model="selectParams.participantValue" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in participantOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="参与者代码" v-if="selectParams.participantValue == 'account'" prop="participantCode">
              <div style="display: flex;">
                <el-input type="text" v-model="selectParams.participantCode" size="mini" class="txtInput" clearable>
                </el-input>
                <text-upload @getTxtCon="getTxtData"></text-upload>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="">
              <div style="display: flex;">
                前
                <el-input type="number" v-model="selectParams.number" size="mini">
                </el-input>
                名
              </div>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="账户组">
              <down-more-select v-model="selectParams.accountGroup" ref="downMoreSelect"
                                :optionData="accountGroupOption"></down-more-select>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" :sm="24">
            <el-form-item label="">
              <el-button type="primary" size="small" @click="ajaxHoldstat">查询</el-button>
              <el-button type="info" size="small" @click="fnEmptySelectParams">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-row class="tableTitle" style="margin-top: -30px">
      <el-col :span="12" style="padding-left: 20px">时间段统计</el-col>
      <el-col :span="12">
        <el-button type="info" size="mini" style="float: right;margin-right: 20px" @click="fnexportTimeTable">导出
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <margin-table :isPageination="false" :height="200" :columns="timeAccountColumns"
                      @current-change="handleCurrentChange" :data="{data:timeAccountData}"/>
      </el-col>
    </el-row>
    <el-row class="tableTitle">
      <el-col :span="24">
        <el-button type="info" size="mini" style="float: right;margin-right: 20px" @click="fnexportDetailTable">导出
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <margin-table :isPageination="false" :columns="analysicAccountColumns" @current-change="handleCurrentChange"
                      :rowClassName="tableRowClassName" :data="{data:analysicAccountData}"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import DownMoreSelect from '../../../common/downMoreSelect'
  import TextUpload from '../../../common/textUpload.vue'
  import {holdstat} from '@/service/analysisTool/realTimeDetection/index'
  import MinxinVue from '../Mixin'

  export default {
    name: 'report-statistics',
    components: {
      DownMoreSelect,
      TextUpload,
      MarginTable: () => import('@/components/base/MarginTable')
    },
    mixins: [MinxinVue],
    data() {
      return {
        accountGroupOption: [{
          value: '选中账户',
          label: '选中账户'
        }, {
          value: '待分析账户',
          label: '待分析账户'
        }, {
          value: '待监控账户',
          label: '待监控账户'
        }], //  传递给子组件的账户组数据
        selectParams: {
          participantValue: 'account', // 参与者层级
          participantCode: '', // 参与者代码
          accountGroup: [], //  账户组
          number: 50 //  前几名
        },
        rules: {
          participantCode: [{
            type: 'string',
            pattern: /^[A-Z]\d{9}(?:,[A-Z]\d{9})*$/,
            message: '请输入正确参与者代码',
            trigger: 'blur'
          }]
        },
        participantOptions: [
          {
            value: 'account',
            label: '账号',
            disabled: false
          },
          {
            value: 'salePart',
            label: '营业部',
            disabled: true
          },
          {
            value: 'uniteCode',
            label: '一码通',
            disabled: true
          },
          {
            value: 'pbu',
            label: 'PBU',
            disabled: true
          },
          {
            value: 'member',
            label: '券商',
            disabled: true
          }
        ],
        timeAccountData: [], // 时间段统计表格数据
        timeAccountColumns: [
          {label: '项目', field: 'project', align: 'left', width: '6.5%'},
          {label: '期初日期', field: 'original_date', align: 'left', width: '6.5%'},
          {label: '期末日期', field: 'final_date', align: 'left', width: '6.5%'},
          {label: '期初持有流通股', field: 'original_position', align: 'right', width: '6.5%'},
          {label: '期末持有流通股', field: 'final_position', align: 'right', width: '6.5%'},
          {label: '持股变动量', field: 'position_diff', align: 'right', width: '6.5%'},
          {label: '期初持有限售股', field: 'original_position_limit', align: 'right', width: '6.5%'},
          {label: '期末持有限售股', field: 'final_position_limit', align: 'right', width: '6.5%'}
        ],
        analysicAccountData: [], // 分析表格数据
        analysicAccountColumns: [
          {label: '参与者代码', field: 'invacctno', align: 'left', width: '5%'},
          {label: '参与者名称', field: 'invacctname', align: 'left', width: '5%'},
          {label: 'PBU代码', field: 'pbuoscod', align: 'left', width: '5%'},
          {label: '营业部名称', field: 'brnname', align: 'left', width: '5%'},
          {
            label: '期初持有流通股',
            field: 'original_position',
            align: 'right',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'original_position')
          },
          {
            label: '期初持股比例',
            field: 'original_position_ratio',
            align: 'right',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'original_position_ratio')
          },
          {
            label: '期末持有流通股',
            field: 'final_position',
            align: 'right',
            width: '6%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'final_position')
          },
          {
            label: '期末持股比例',
            field: 'final_position_ratio',
            align: 'right',
            width: '5%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'final_position_ratio')
          },
          {
            label: '持股变动量',
            field: 'position_diff',
            align: 'right',
            width: '8%',
            sortable: true,
            sortMethod: this.gfnSortColByNumber.bind(this, 'position_diff')
          },
          {label: '期初日期', field: 'original_date', align: 'left', width: '8%'},
          {label: '期末日期', field: 'final_date', align: 'left', width: '6%'}
        ]
      }
    },
    methods: {
      fnexportTimeTable() {
        let params = {}
        params = {
          stockCode: this.routerParams.isinCode,
          dateTimeStart: this.routerParams.dateTimeValue[0],
          dateTimeEnd: this.routerParams.dateTimeValue[1],
          actorKind: this.selectParams.participantValue,
          invacctno: this.selectParams.participantCode,
          topN: this.selectParams.number,
          tableLevel: 'maintable',
          securityType: 'EQU',
          accountGroup: this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
        }
        params['tableColumns'] = this.timeAccountColumns
        params['fileType'] = 'excel'
        this.gfnExportFile('/regularqry/product/v1/monitor/holdstat/countTable-export', JSON.stringify(params))
      },
      fnexportDetailTable() {
        let params = {}
        params = {
          stockCode: this.routerParams.isinCode,
          dateTimeStart: this.routerParams.dateTimeValue[0],
          dateTimeEnd: this.routerParams.dateTimeValue[1],
          actorKind: this.selectParams.participantValue,
          invacctno: this.selectParams.participantCode,
          topN: this.selectParams.number,
          tableLevel: 'maintable',
          securityType: 'EQU',
          accountGroup: this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
        }
        params['tableColumns'] = this.analysicAccountColumns
        params['fileType'] = 'excel'
        this.gfnExportFile('/regularqry/product/v1/monitor/holdstat/export', JSON.stringify(params))
      },

      tableRowClassName({row}) {
        let index = this.routerParams.monitorAccount.findIndex(item => {
          return item == row.invacctno
        })
        if (index != -1) {
          return 'tableColor'
        }
        return ''
      },
      ajaxHoldstat() {
        if (this.selectParams.number > 1000) {
          this.$message.warning('前N名最大查询值为1000,请输入正确数值')
          this.selectParams.number = 50
        } else {
          let param = {
            stockCode: this.routerParams.isinCode,
            dateTimeStart: this.routerParams.dateTimeValue[0],
            dateTimeEnd: this.routerParams.dateTimeValue[1],
            actorKind: this.selectParams.participantValue,
            invacctno: this.selectParams.participantCode,
            topN: this.selectParams.number,
            tableLevel: 'maintable',
            securityType: 'EQU',
            accountGroup: this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0,0,0,0.7)'
          })
          holdstat(param).then(res => {
            loading.close()
            this.timeAccountData = res.totalList
            this.analysicAccountData = res.queryResult.bizData.metaData
          }, () => {
            loading.close()
          })
        }
      },
      handleCurrentChange(val) {
      },
      getTxtData(val) {
        this.selectParams.participantCode = val.join(',')
      },
      fnEmptySelectParams() {
        this.selectParams.participantValue = 'account'
        this.selectParams.participantCode = ''
        this.selectParams.accountGroup = []
        this.selectParams.number = 50
        this.$refs.downMoreSelect.cancel()
      }
    },
    created() {
      this.ajaxHoldstat()
    },
    mounted() {
    }
  }
</script>

<style lang="less">
  .holdStatistics .import-btn {
    position: relative;
    top: -33px;
    left: 60px;
    float: right
  }

  .holdStatistics .txtInput {
    .el-input__inner {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .holdStatistics .tableColor {
    background-color: #3d507a !important;
  }

  .holdStatistics .tableTitle {
    padding: 8px 0px;
    line-height: 30px;
    font-size: 16px;
    color: #fff;
  }
</style>
