<template>
  <div class='s-psrticipant-type-form'>
    <el-card>
      <div slot="header">
        查询条件
        <el-button size="small" type="info" @click="handleClear">清空</el-button>
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
      </div>
      {{this.needParams.text}}
      <el-form :ref='setRef' :inline="true" :model='formData' :rules='rules' label-width='140px'>
        <el-form-item
          v-if="needParams.text == 'accountArr' || activeName === '0' || activeName === '1' || activeName === '5'"
          :label='`${firstItemName}：`'
          prop='data0'>
          <el-input size="small" disabled v-model="formData.data0"></el-input>
        </el-form-item>
        <el-form-item v-else :label='`${firstItemName}：`' prop='data1'>
          <el-select v-model="formData.data1" placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in tradeTypeList"
              :key="item.id + 1"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="needParams.text == 'accountArr' && activeName === '1'"
          prop='data2'>
          <el-checkbox v-model="formData.data2">含信用账户</el-checkbox>
        </el-form-item>

        <el-form-item label='订单状态：'
                      v-if="activeName === '2'"
                      prop='data4'>
          <el-checkbox-group v-model="formData.data4">
            <el-checkbox label="成交"></el-checkbox>
            <el-checkbox label="未成交"></el-checkbox>
            <el-checkbox label="撤单"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label='买卖状态：'
                      v-if="activeName === '2' || activeName === '3'"
                      prop='data5'>
          <el-checkbox-group v-model="formData.data5">
            <el-checkbox label="买"></el-checkbox>
            <el-checkbox label="卖"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label='平台类型：'
                      v-if="activeName === '3' || activeName === '5'"
                      prop='data6'>
          <el-select v-model="formData.data6" placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in classType.plat"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='交易类型：'
                      v-if="activeName === '3' ||  activeName === '5'"
                      prop='data7'>
          <el-select v-model="formData.data7" placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in tradeTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='订单类型：'
                      v-if="activeName === '2' || activeName === '3' ||  activeName === '4' ||  activeName === '5'"
                      prop='data8'>
          <el-select v-model="formData.data8" placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in classType.order"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='信用类型：'
                      v-if="activeName === '2' || activeName === '3' ||  activeName === '4' ||  activeName === '5'"
                      prop='data9'>
          <el-select v-model="formData.data9" placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in classType.credit"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="activeName == 2 || activeName == 4 ? '申报价格：' : '成交价格：'"
                      v-if="activeName === '2' || activeName === '3' || activeName === '4' ||  activeName === '5'"
                      prop='data10'>
          <div class="participant-input">
            <el-input size="small" v-model="formData.data10"></el-input>
          </div>
          ~
          <div class="participant-input">
            <el-input size="small" v-model="formData.data11"></el-input>
          </div>
        </el-form-item>

        <el-form-item :label="activeName == 2 || activeName == 4 ? '申报数量：' : '成交数量：'"
                      v-if="activeName === '2' || activeName === '3' || activeName === '4' ||  activeName === '5'"
                      prop='data12'>
          <div class="participant-input">
            <el-input size="small" v-model="formData.data12"></el-input>
          </div>~
          <div class="participant-input">
            <el-input size="small" v-model="formData.data13"></el-input>
          </div>
        </el-form-item>

        <el-form-item label='产品类型：'
                      v-if="(activeName === '1' && needParams.text == 'accountArr') || activeName === '2' || activeName === '3' ||  activeName === '4' ||  activeName === '5'"
                      prop='data14'>
          <el-select v-model="formData.data14" placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in classType.product"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='证券代码：'
                      v-if="(activeName === '1' && needParams.text != 'accountArr') || formData.data14 == 'pStock'"
                      prop='data3'>
          <el-select v-model="formData.data3" multiple placeholder="请选择" size="small" collapse-tags>
            <el-option
              v-for="item in tradeTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 's-psrticipant-type-form',
    props: {
      needParams: {
        type: Object,
        default: {}
      },
      activeName: {
        type: String,
        default: '1'
      },
      setRef: {
        type: String,
        default: 'luan'
      },
      classType: {
        type: Object,
        default: {}
      }
    },
    components: {},
    data() {
      return {
        tradeTypeList: [
          {
            id: 'dk',
            mark: 'tType1',
            name: '多头开仓'
          },
          {
            id: 'dp',
            mark: 'tType2',
            name: '多头平仓'
          },
          {
            id: 'kk',
            mark: 'tType3',
            name: '空头开仓'
          },
          {
            id: 'kp',
            mark: 'tType4',
            name: '空头平仓'
          },

        ],
        firstItemName: '', // 第一个表单item的名称
        formData: {
          data0: 'ceshi', // 字符串展示的名称
          data1: '', // 下拉框选择的名称 单选
          data2: false, // 是否包含信用账户
          data3: [], // 证券代码 多选
          data4: [], // 订单状态 多选
          data5: [], // 买卖状态 多选
          data6: '', // 平台类型 单选 选项[竞价、固定收益、大宗交易]
          data7: '', // 交易类型 单选 —— 平台类型：大宗交易，隐藏该选项；平台类型：竞价，交易类型则默认场内交易
          data8: '', // 订单类型 单选 —— 平台类型：竞价才可选，否则禁用
          data9: '', // 信用类型 单选 —— 平台类型：竞价才可选，否则禁用
          data10: '', // 成交价格1
          data11: '', // 成交价格1
          data12: '', // 成交数量1
          data13: '', // 成交数量2
          data14: '' // 产品类型  单选
        },
        rules: {
          data0: [
            {required: true}
          ],
          data1: [
            {required: true}
          ],
          data4: [
            {required: true, message: '请选择'}
          ],
          data5: [
            {required: true, message: '请选择'}
          ]
        }
      }
    },
    watch: {
      'formData.data6'(val) {
        let value = ''
        if (val == '竞价') {
          this.tradeTypeList = this.classType.trade[0]
          value = this.classType.trade[0][0].id
        } else {
          this.tradeTypeList = this.classType.trade[1]
          value = this.classType.trade[1][0].id
        }
        this.formData.data7 = value
      },
      'needParams.text'(val) {
        if (val == 'accountArr') {
          this.firstItemName = '账户组'
        } else if (val == 'member') {
          this.firstItemName = '券商名称'
        } else {
          this.firstItemName = 'PBU代码'
        }
        this.handleClear()
      }
    },
    methods: {
      handleSearch() {
        this.$refs[`participantRef${this.activeName}`].validate((valid) => {
          if (valid) {
            this.$emit('handleSearch', this.activeName, {...this.formData})
          }
        })
      },
      handleClear() {
        this.formData = {
          data0: '', // 字符串展示的名称
          data1: '', // 下拉框选择的名称 单选
          data2: false, // 是否包含信用账户
          data3: [], // 证券代码 多选
          data4: [], // 订单状态 多选
          data5: [], // 买卖状态 多选
          data6: '', // 平台类型 单选 选项[竞价、固定收益、大宗交易]
          data7: '', // 交易类型 单选 —— 平台类型：大宗交易，隐藏该选项；平台类型：竞价，交易类型则默认场内交易
          data8: '', // 订单类型 单选 —— 平台类型：竞价才可选，否则禁用
          data9: '', // 信用类型 单选 —— 平台类型：竞价才可选，否则禁用
          data10: '', // 成交价格1
          data11: '', // 成交价格1
          data12: '', // 成交数量1
          data13: '', // 成交数量2
          data14: '' // 产品类型  单选
        }
      }
    },
    mounted() {
      if (this.needParams.text == 'accountArr') {
        this.firstItemName = '账户组'
      } else if (this.needParams.text == 'member') {
        this.firstItemName = '券商名称'
      } else {
        this.firstItemName = 'PBU代码'
      }
      // 设置交易类型默认值
      this.tradeTypeList = this.classType.trade[0]
      this.formData.data7 = this.classType.trade[0][0].id
    }
  }
</script>

<style lang='less' scoped>
  .s-psrticipant-type-form {
    .participant-input {
      display: inline-block;
      width: 100px;
    }
  }
</style>