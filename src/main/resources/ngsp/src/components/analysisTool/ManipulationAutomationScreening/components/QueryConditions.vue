<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询条件</span>
        <el-button
          type="info"
          size="small"
          style="float:right;"
          @click="resetForm('selectParams')">清空
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="float:right;"
          @click="select('selectParams')">查询
        </el-button>
      </div>
      <el-form :model="selectParams" ref="selectParams" :rules="rules" label-width="100px" label-position="left">
        <el-row>
          <el-col :span="8">
            <el-form-item label="证券代码" prop="indexCode">
              <stock-code-query :commonData="submitData" ref="StockCodeQuery" :clearable='false'
                                style="display: inline-flex"
                                @getStockCode="getStockCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="起止时间" prop="selectTradeDate">
              <el-date-picker v-model="selectParams.selectTradeDate"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              format="yyyyMMdd" value-format="yyyyMMdd"
                              size="small"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="isActive">
          <el-row>
            <el-col :span="24">
              <el-form-item label="账户代码" prop="accountCode">
                <el-input size="small" v-model="selectParams.accountCode" class="input-width"></el-input>
                <text-upload style="display: inline-block;" @getTxtCon="getTxtData2"
                             :uploadOption="{name: '导入', size: 'small'}"></text-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row v-if="selectParams.accountCode!=''">-->
          <!--<el-col :span="24">-->
          <!--<el-form-item label="">-->
          <!--<el-tag-->
          <!--class="tag"-->
          <!--v-for="(tag,index) in selectParams.accountCode"-->
          <!--:key="index"-->
          <!--closable-->
          <!--@close="deleteAccountCode(tag)">-->
          <!--{{tag}}-->
          <!--</el-tag>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div slot="label">
                  <el-checkbox label="1" v-model="selectParams.condition">条件一:</el-checkbox>
                </div>
                <el-select v-model="selectParams.condition1_1" size="small" style="width: 120px">
                  <el-option label="成交量" value="1"/>
                  <el-option label="成交金额" value="0"/>
                </el-select>
                <el-select v-model="selectParams.condition1_2" size="small" style="width: 120px">
                  <el-option label="买卖" value="BS"/>
                  <el-option label="买" value="B"/>
                  <el-option label="卖" value="S"/>
                </el-select>
                排名前
                <el-form-item class="rule-form-item" prop="condition1_3">
                  <el-input style="width: 100px" v-model="selectParams.condition1_3" size="small"/>
                </el-form-item>
                且成交金额在
                <el-form-item class="rule-form-item" prop="condition1_4">
                  <el-input style="width: 100px" v-model="selectParams.condition1_4" size="small"/>
                </el-form-item>
                万元以上的账户
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div slot="label">
                  <el-checkbox label="2" v-model="selectParams.condition">条件二:</el-checkbox>
                </div>
                每日
                <el-select v-model="selectParams.condition2_1" size="small" style="width: 120px">
                  <el-option label="成交量" value="1"/>
                  <el-option label="成交金额" value="0"/>
                </el-select>
                <el-select v-model="selectParams.condition2_2" size="small" style="width: 120px">
                  <el-option label="买卖" value="BS"/>
                  <el-option label="买" value="B"/>
                  <el-option label="卖" value="S"/>
                </el-select>
                排名前
                <el-form-item class="rule-form-item" prop="condition2_3">
                  <el-input style="width: 100px" v-model="selectParams.condition2_3" size="small"/>
                </el-form-item>
                的账户
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div slot="label">
                  <el-checkbox label="3" v-model="selectParams.condition">条件三:</el-checkbox>
                </div>
                成交频次排名前
                <el-form-item class="rule-form-item" prop="condition3_1">
                  <el-input style="width: 100px" v-model="selectParams.condition3_1" size="small"/>
                </el-form-item>
                的账户
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div slot="label">
                  <el-checkbox label="4" v-model="selectParams.condition">条件四:</el-checkbox>
                </div>
                与初始导入的账户（含手工导入）交易营业部一致的且成交金额高于
                <el-form-item class="rule-form-item" prop="condition4_1">
                  <el-input style="width: 100px" v-model="selectParams.condition4_1" size="small"/>
                </el-form-item>
                万元的账户
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row>-->
          <!--<el-col :span="24">-->
          <!--<el-form-item>-->
          <!--<div slot="label">-->
          <!--<el-checkbox label="5" v-model="selectParams.condition">条件五:</el-checkbox>-->
          <!--</div>-->
          <!--<el-col :span="8">是否筛选以往关联账户</el-col>-->
          <!--<el-col :span="16">-->
          <!--<el-radio v-model="selectParams.condition5_1" label="1">是</el-radio>-->
          <!--<el-radio v-model="selectParams.condition5_1" label="0">否</el-radio>-->
          <!--</el-col>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div slot="label">
                  <el-checkbox label="6" v-model="selectParams.condition">条件六:</el-checkbox>
                </div>
                <el-col :span="8">是否计算满足上述条件账户的同一一码通交易该股的账户</el-col>
                <el-col :span="16">
                  <el-radio v-model="selectParams.condition6_1" label="1">是</el-radio>
                  <el-radio v-model="selectParams.condition6_1" label="0">否</el-radio>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <el-form-item>
                <div slot="label">
                  <el-checkbox label="7" v-model="selectParams.condition">条件七:</el-checkbox>
                </div>
                <el-col :span="8">是否计算期间记入该股相关监控日志的账户</el-col>
                <el-col :span="16">
                  <el-radio v-model="selectParams.condition7_1" label="1">是</el-radio>
                  <el-radio v-model="selectParams.condition7_1" label="0">否</el-radio>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row> -->
        </div>
      </el-form>
      <div style="text-align: center">
        <el-button type="info" :icon="isActive?'el-icon-arrow-up':'el-icon-arrow-down'"
                   @click="isActive= !isActive"></el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {tradeDate} from '@/service/common/commonFunc'

  export default {
    name: 'query-conditions',
    props: {},
    components: {
      textUpload: () => import('@/components/common/textUpload'),   // 导入
      StockCodeQuery: () => import('@/components/common/StockCodeQuery')
    },
    mixins: [],
    data() {
      let checkNumber = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('必须是数字'))
        } else {
          callback()
        }
      }
      let numberRules = {
        validator: checkNumber
      }
      return {
        //  查询条件
        selectParams: {
          indexCode: '',
          selectTradeDate: [],
          accountCode: '',
          condition: [],
          condition1_1: '1',
          condition1_2: 'BS',
          condition1_3: '10',
          condition1_4: '500',
          condition2_1: '1',
          condition2_2: 'BS',
          condition2_3: '10',
          condition3_1: '50',
          condition4_1: '500',
          condition5_1: '1',
          condition6_1: '1',
          condition7_1: '0'
        },
        submitData: {disabled: false, secSubTypecode: 'ASH', stockCode: ''},
        rules: {
          indexCode: [
            {required: true, message: '请输入证券代码', trigger: 'change'}
          ],
          selectTradeDate: [
            {type: 'array', required: true, message: '请选择起止时间', trigger: 'change'}
          ],
          accountCode: [
            {required: true, message: '请导入账户代码', trigger: 'blur'}
          ],
          condition1_3: [numberRules],
          condition1_4: [numberRules],
          condition2_3: [numberRules],
          condition3_1: [numberRules],
          condition4_1: [numberRules]
        },
        isActive: true,
        routeParams: {}, // 路由跳转参数

      }
    },
    computed: {},
    watch: {},
    methods: {
      //  获取交易偏移量，默认
      ajaxTradeDate() {
        tradeDate(-1).then(res => {
          this.selectParams.selectTradeDate = [res, res]
        })
      },
      // fnBlur(event) {
      //   if (event.target.value != "")
      //     this.selectParams.accountCode.push(event.target.value)
      //   event.target.value = ""
      // },
      getTxtData2(val) {
        // let arr = val.split(",")
        // this.selectParams.accountCode.push(...arr)
        let arr = this.selectParams.accountCode === '' ? [] : this.selectParams.accountCode.split(',')
        this.selectParams.accountCode = [...arr, ...val].join(',')
      },
      // deleteAccountCode(tag) {
      //   this.selectParams.accountCode.splice(this.selectParams.accountCode.findIndex(item => {
      //     return item == tag
      //   }), 1)
      // },
      getStockCode(stockCodeData) {
        if (stockCodeData) {
          let [indexCode, indexName] = stockCodeData.split(' ')
          this.selectParams.indexCode = indexCode
          this.selectParams.indexName = indexName
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.ajaxTradeDate()
        this.selectParams.indexCode = ''
        this.$refs.StockCodeQuery.clearCon()
        this.selectParams.accountCode = ''
        this.selectParams.condition = []
        this.selectParams.condition1_1 = '1'
        this.selectParams.condition1_2 = 'BS'
        this.selectParams.condition1_3 = '10'
        this.selectParams.condition1_4 = '500'
        this.selectParams.condition2_1 = '1'
        this.selectParams.condition2_2 = 'BS'
        this.selectParams.condition2_3 = '10'
        this.selectParams.condition3_1 = '50'
        this.selectParams.condition4_1 = '500'
        this.selectParams.condition5_1 = '0'
        this.selectParams.condition6_1 = '0'
        this.selectParams.condition7_1 = '0'
      },
      select(formName) {
        let required = ['1', '2', '3'],
          flag = false
        for (let key of this.selectParams.condition) {
          for (let key1 of required) {
            if (key === key1) {
              flag = true
            }
          }
        }
        if (!flag) {
          this.$message.error('必须选中条件一至条件三中任意一个条件')
          return
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$emit('selectAccountSummary', this.selectParams)
          }
        })
      }
    },
    created() {
      this.ajaxTradeDate()
    },
    mounted() {
      this.routeParams = JSON.parse(this.$route.params.params) // 路由跳转参数初始赋值
      if(this.$route.params.params.length > 2){
        this.submitData.stockCode = this.routeParams.sec_code + ' ' + this.routeParams.sec_name//页面跳转获取代码名称
        this.selectParams.indexCode = this.routeParams.sec_code //页面跳转获取代码
      }


    },
    beforeDestroy() {
    }
  }
</script>

<style lang="less" scoped>
  .input-width {
    width: auto;
  }

  .rule-form-item {
    display: inline-block;
  }

  .tag + .tag {
    margin-left: 10px;
  }
</style>
