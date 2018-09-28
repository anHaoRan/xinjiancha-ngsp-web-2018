
<!-- formItem common component-->
<template>
  <div class="safeguard-stability">
    <el-card class="el-card-table">
      <el-row class="saveBtn">
        <el-button type="primary" size="small" @click="ajaxUpdateParamData()">保存</el-button>
      </el-row>
      <el-row>
        <el-form
          :model="form" :rules="rules"
          style="padding-left: 20px"
          ref="form"
          label-position="left"
          label-width="480px">
          <div class="form-box"
               v-for="item in formData"
               :key = "item.itemCode">
            <h5>{{item.itemName}}</h5>
            <el-form-item
              v-for="it in item.formItemList"
              :key = "it.paramCode"
              :label=
                "`${it.paramName}${
                  it.paramCode.indexOf('_UP') > -1
                ? '上限'
                : it.paramCode.indexOf('_DOWN') > -1
                ? '下限'
                : ''}`"
              :prop="it.paramCode"
              :rules="[...[{
                required: true, message: `${it.paramName}${it.paramCode.indexOf('_UP') > -1 ? '上限' : it.paramCode.indexOf('_DOWN') > -1 ? '下限' : ''}不能为空`
              }], ...[it.rulesProps]]">
              <el-input style="width:200px"
                        v-model.trim="form[it.paramCode]"
                        auto-complete="off"
                        size="small">
              </el-input>
              <span>{{item.itemCode === 'alarm_type_03' ? '万元' : (item.itemCode === 'mobility_index' || item.itemCode === 'alarm_type_01' || item.itemCode === 'alarm_type_02') ? '%' : hasRemarkInfoList.indexOf(it.paramCode) > -1 ? '小数(除过100)' :''}}</span>
            </el-form-item>
          </div>
        </el-form>
      </el-row>
      <el-row class="saveBtn">
        <el-button type="primary" size="small" @click="ajaxUpdateParamData()">保存</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {updateParamData} from '@/service/systemManage'
import {rulesProps} from './rulesProps'
export default {
  name: 'formItemComponent',
  props: {
    nameProps: {
      type: String,
      required: true
    },
    formProps: {
      type: Object,
      required: true
    },
    originDataProps: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
      hasRemarkInfoList: ['three_tradeDay_price', 'three_tradeDay_exchange_rate_total', 'alarm_stock_three_trade_day'],
      formData: [],
      form: {},
      rules: {}
    }
  },
  methods: {
    // 批量更新系统参数
    ajaxUpdateParamData() {
      const formKeys = Object.keys(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          /* save to server */
          this.originDataProps.forEach(v => {
            if (formKeys.indexOf(`${v.paramCode}_UP`) > -1 || formKeys.indexOf(`${v.paramCode}_DOWN`) > -1) {
              v.itemCode === 'alarm_type_03'
                ? v.paramValue = `${parseFloat(this.form[`${v.paramCode}_UP`]) * 10000},${parseFloat(this.form[`${v.paramCode}_DOWN`]) * 10000}`
                : v.paramValue = `${this.form[`${v.paramCode}_UP`]},${this.form[`${v.paramCode}_DOWN`]}`
            } else {
              v.paramValue = this.form[v.paramCode]
            }
          })
          let param = this.originDataProps.map(v => {
            return {
              id: v.id,
              paramValue: v.paramValue
            }
          })
          updateParamData(JSON.stringify(param)).then((res) => {
            if (res) {
              this.$message.success('保存成功')
            }
          })
        }
      })
    },
    toTransferData(originData) {
      let transferData = []
      let hasPushArray = []
      originData.forEach(v => {
        if (!transferData.length || hasPushArray.indexOf(v.itemCode) < 0) {
          hasPushArray.push(v.itemCode)
          transferData.push({
            itemName: v.itemName,
            itemCode: v.itemCode,
            formItemList: []
          })
        }
      })
      originData.forEach(f => {
        transferData.forEach(t => {
          if (f.itemCode === t.itemCode) {
            if (f.paramValue.indexOf(',') > -1) {
              let pushObj1 = {
                id: f.id,
                paramName: f.paramName,
                paramCode: f.paramCode + '_UP',
                paramValue: f.paramValue.split(',')[0],
                rulesProps: rulesProps[f.paramCode + '_UP'] || {}
              }
              let pushObj2 = {
                id: f.id,
                paramName: f.paramName,
                paramCode: f.paramCode + '_DOWN',
                paramValue: f.paramValue.split(',')[1],
                rulesProps: rulesProps[f.paramCode + '_DOWN'] || {}
              }
              t.formItemList.push(pushObj1, pushObj2)
            } else {
              t.formItemList.push({
                id: f.id,
                paramName: f.paramName,
                paramCode: f.paramCode,
                paramValue: f.paramValue,
                rulesProps: rulesProps[f.paramCode] || {}
              })
            }
          }
        })
      })
      transferData.forEach(v => {
        v.formItemList.forEach(f => {
          if (v.itemCode === 'alarm_type_03') {
            this.form[f.paramCode] = (parseFloat(f.paramValue) / 10000).toFixed(2)
          } else {
            this.form[f.paramCode] = f.paramValue
          }
        })
      })
      this.formData = transferData
    }
  },
  watch: {
    formProps(newValue) {
      this.form = newValue
    },
    originDataProps(newValue) {
      this.toTransferData(newValue)
    }
  },
  mounted() {
  }
}
</script>

<style lang="less" scoped>
  .safeguard-stability {
    .form-box {
      h5 {
        font-weight: 400;
        padding-left: 20px;
        font-size: 16px;
        margin: 30px 0 15px 0;
        color: #fff;
      }
      &:first-child {
        h5 {
          margin-top: 0
        }
      }
    }
    .saveBtn {
      text-align: right;
      padding: 20px;
    }
  }
</style>
