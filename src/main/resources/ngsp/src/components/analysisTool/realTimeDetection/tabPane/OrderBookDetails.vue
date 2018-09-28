<template>
    <div class="order-book-details">
        <!--查询条件-->
        <div class="order-book-details-header">
            <el-form :inline="true" :model="selectParams" ref="selectParams" :rules="rules">
                <el-form-item label="日期">
                    <el-date-picker
                            v-model="selectParams.tranDate"
                            type="datetime"
                            size="mini"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间"
                            @change="tranDateChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="买卖档位" v-if="flag">
                    <el-select v-model="selectParams.selectValue" placeholder="请选择" size="mini">
                        <el-option
                                v-for="(item,index) in buysellOptions"
                                :key="index"
                                :label="item.label"
                                :value="index+''"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="档位价格" v-if="flag">
                    {{buysellOptions[selectParams.selectValue].price}}元
                </el-form-item>
                <el-form-item prop="rank">
                    前
                    <el-input v-model="selectParams.rank" size="mini" style="width: 60%"/>
                    名
                </el-form-item>
                <el-form-item label="账户组">
                    <down-more-select v-model="selectParams.accountGroup" ref="downMoreSelect"
                                      :optionData="accountGroupOption"></down-more-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="ajaxOrderRetain('selectParams')">查询</el-button>
                    <el-button type="info" size="small" @click="fnEmptySelectParams('selectParams')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="splitline"/>
        <div style="margin: 20px 0;">
            <div style="padding: 10px;text-align: right">
                <el-button type="info" size="small" @click="orderExport(1)">导出</el-button>
            </div>
            <margin-table :isPageination="false" :height="200" :columns="columns" :data="{data:tableData1}"/>
        </div>
        <div>
            <div style="padding: 10px;text-align: right">
                <el-button type="info" size="small" @click="orderExport(2)">导出</el-button>
            </div>
            <margin-table :isPageination="false" :columns="columns1" :data="{data:tableData2}">
                <template slot="tableColumnsUnshift">
                    <el-table-column
                            type="index"
                            align="center"
                            width="55"
                            label="编号"
                    />
                </template>
            </margin-table>
        </div>
    </div>
</template>

<script>
  import DownMoreSelect from '../../../common/downMoreSelect'
  import { orderLevel, orderRetain, orderRetainExport } from '@/service/analysisTool/realTimeDetection/index'
  import { gitTradeDate } from '@/service/common/commonFunc'
  import moment from 'moment'
  import MinxinVue from '../Mixin'

  export default {
    components: {
      DownMoreSelect,
      MarginTable: () => import('@/components/base/MarginTable')
    },
    name: 'order-book-details',
    mixins: [MinxinVue],
    data () {
      let checkNumber = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
          return
        }
        if (Number(value) < 0) {
          callback(new Error('必须是正数'))
          return
        }
        // if (Number(value) > 1000) {
        //   callback(new Error('前N名最大1000'))
        //   return
        // }
        callback()
      }
      let numberRules = {
        validator: checkNumber
      }
      return {
        rules: {
          rank: [numberRules]
        },
        flag: false,
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
        gitTradeDate: '',
        selectParams: {
          tranDate: '',
          rank: '50',
          selectValue: '',
          //  初始化买卖档位时获取
          ordrno: '',
          accountGroup: []
        },
        buysellOptions: [],
        columns: [
          {field: 'ovall', label: '全市场堆单量'},
          {field: 'heap_count', label: '账户组堆单量'},
          {field: 'heap_ratio', label: '账户组堆单占比'},
          {field: 'revoke_ratio', label: '账户组该价格撤单比'},
          {field: 'vol_ratio', label: '账户组该价格成交比'}
        ],
        tableData1: [],
        columns1: [
          {field: 'account_code', label: '账户代码', width: '10%', align: 'left'},
          {field: 'account_title', label: '账户名称', width: '10%', align: 'left'},
          {field: 'bu_title', label: '营业部', width: '10%', align: 'left'},
          {field: 'heap_count', label: '堆单量', width: '10%', align: 'right'},
          {field: 'heap_ratio', label: '堆单占比', width: '10%', align: 'right'},
          {field: 'revoke_ratio', label: '该价格撤单比', width: '10%', align: 'right'},
          {field: 'vol_ratio', label: '该价格成交比', width: '10%', align: 'right'},
          {field: 'elsqty', label: '比该账户申报靠前的其他账户堆单量', width: '20%', align: 'right'}
        ],
        tableData2: [],
        exportSelectParams: ''
      }
    },
    watch: {},
    methods: {
      ajaxGitTradeDate () {
        gitTradeDate().then((res) => {
          let ndate = this.routerParams.tranTime
          if (ndate === '') {
            ndate = '09:15:00'
          }
          this.gitTradeDate = moment(res, 'YYYYMMDD').format('YYYY-MM-DD') + ' ' + ndate
          this.selectParams.tranDate = this.gitTradeDate
        }).then(() => {
          this.ajaxOrderLevel()
        })
      },
      ajaxOrderLevel () {
        let param = {
          tradeDate: this.selectParams.tranDate,
          isinCode: this.routerParams.isinCode
        }
        orderLevel(param).then((res) => {
          this.selectParams.ordrno = ''
          this.selectParams.selectValue = ''
          this.buysellOptions = []
          if (res.ordrno) {
            this.buysellOptions = res.list
            this.selectParams.ordrno = res.ordrno
            this.selectParams.selectValue = '0'
            this.flag = true
          }
          if (this.first) {
            this.first = false
            this.$nextTick(function () {
              this.ajaxOrderRetain('selectParams')
            })
          }
        })
      },
      ajaxOrderRetain (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.selectParams.ordrno === '') {
              this.$message.warning('该时间段没有档位信息')
              return
            }
            let param = {
              tradeDate: this.selectParams.tranDate,
              isinCode: this.routerParams.isinCode,
              orderNo: this.selectParams.ordrno,
              retainLevel: this.buysellOptions[this.selectParams.selectValue].value,
              price: this.buysellOptions[this.selectParams.selectValue].price,
              orderVolume: this.buysellOptions[this.selectParams.selectValue].volume,
              beforRank: this.selectParams.rank,
              accountGroup: this.getAccountGroup(this.selectParams.accountGroup.length > 0 ? this.selectParams.accountGroup : ['选中账户', '待分析账户', '待监控账户'])
            }
            this.exportSelectParams = param
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0,0,0,0.7)'
            })
            orderRetain(param).then((res) => {
              loading.close()
              this.tableData2 = res.accountRes
              let obj = res.ovallRes
              obj.ovall = param.orderVolume
              this.tableData1 = [obj]
            }, () => {
              loading.close()
            })
          }
        })
      },
      tranDateChange (val) {
        this.flag = false
        if (val)
          this.ajaxOrderLevel()
      },
      fnEmptySelectParams (formName) {
        this.$refs[formName].resetFields()
        this.selectParams.accountGroup = []
        this.selectParams.selectValue = ''
        this.selectParams.tranDate = this.gitTradeDate
        this.$refs.downMoreSelect.cancel()
        this.flag = false
        this.ajaxOrderLevel()
      },
      orderExport (type) {
        let params = JSON.parse(JSON.stringify(this.exportSelectParams)),
        installParams = {
          fileType: 'xlsx',
          exportType: 'orderRetainExport1',
          tableColumns: [
            {
              sheetName: '实时监控分析-导出账户组统计堆单量与占比',
              fileColumns: this.columns
            }
          ]
        }
        if (type === 2) {
          installParams.exportType = 'orderRetainExport2'
          installParams.tableColumns = [
            {
              sheetName: '实时监控分析-导出账户堆单量与占比',
              fileColumns: this.columns1
            }
          ]
        } else {
          installParams.ovall = this.tableData1[0].ovall
        }
        if (params === '') {
          this.$message.warning('查询后再导出')
          return
        }
        for (let key in installParams) {
          params[key] = installParams[key]
        }
        console.log(JSON.stringify(params))
        this.gfnExportFileWithForm(orderRetainExport(), params)
      }
    },
    created () {
      this.first = true
    },
    mounted () {
      this.ajaxGitTradeDate()
    }
  }
</script>

<style scoped lang="less">
    .order-book-details {
        .order-book-details-header {
            padding: 20px 20px 0 20px;
        }
    }
</style>
