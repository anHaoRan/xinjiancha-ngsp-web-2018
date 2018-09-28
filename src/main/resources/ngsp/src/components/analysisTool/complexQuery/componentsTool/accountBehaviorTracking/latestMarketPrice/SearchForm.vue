<template>
  <div>
    <el-form label-width='100px' :model='formData' :rules='rules' :inline='true' :ref='`trackingAccount${num}`'>
      <el-col :xl='7' :lg='7' :md='12' :sm='12'>
        <el-form-item label='选择日期：' prop='dateRange' >
          <el-date-picker
            size='small'
            value-format='yyyy-MM-dd'
            format='yyyy-MM-dd'
            v-model='formData.dateRange'
            type='daterange' range-separator='至'
            start-placeholder='开始日期'
            end-placeholder='结束日期'>
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :xl='10' :lg='10' :md='12' :sm='12'>
        <stock-code
          :ref='`trackingStockList${num}`'
          @getStockCode='getStockList'
          @handleSecTypeAndChosenTypeListChange='chosenSecType'
        ></stock-code>
      </el-col>
      <el-col :xl='7' :lg='7' :md='12' :sm='12'>
        <el-form-item label='账户代码：' prop='acctIds'>
          <account-code
            ref="`trackingAccountList${num}`"
            :codeType="`account`"
            :uploadParams="{
              parseRule: JSON.stringify(
                {
                  verifies: ['ACCOUNT_CODE']
                }
              )
            }"
            @getTextareaCodeList="getAccountList"></account-code>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
import {selfValidateMethod} from '../../../componentsTool/common/validate'
export default {
  components: {
    AccountCode: () => import('../../common/TextAreaCodesAndUploadComponent'),
    StockCode: () => import('../../common/StockCodesUploadAndSecTypeSelectComponent')
  },
  props: ['num', 'defaultRelativeTradeDate'],
  data() {
    return {
      defaultDate: [],
      formData: {
        dateRange: [],
        acctIds: '',
        secCodes: '',
        secType: 0
      },
      rules: {
        dateRange: [
          {required: true, message: '请选择日期', trigger: 'change'}
        ],
        acctIds: [
          {required: true, message: '请输入账户代码', trigger: 'blur'}
        ],
        secCodes: [
          {required: true, message: '请输入证券代码', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    defaultRelativeTradeDate(newValue) {
      // 重置日期为初始日期
      let defaultDate = newValue
      this.defaultDate = [defaultDate, defaultDate]
      this.formData.dateRange = this.defaultDate
    }
  },
  methods: {
    chosenSecType(secType, chosenTypeListString) {
      if (secType) {
        this.formData.secType = chosenTypeListString
      } else {
        this.formData.secType = secType
      }
      /* 校验证券大类 */
      this.$refs[`trackingAccount${this.num}`].validateField('secType')
    },
    getStockList(data) {
      this.formData.secCodes = data
      /* 校验证券代码 */
      this.$refs[`trackingAccount${this.num}`].validateField('secType')
    },
    getAccountList(data) {
      this.formData.acctIds = data
    },
    handleClear() {
      this.formData = {
        dateRange: this.defaultDate,
        acctIds: '',
        secCodes: '',
        secType: 0
      }
      this.$refs[`trackingStockList${this.num}`].clearStockCodes()
      this.$refs[`trackingAccountList${this.num}`].clearCodeList()
    },
    handleSearch() {
      this.$refs['trackingAccount' + this.num].validate((valid) => {
        if (valid) {
          if (!selfValidateMethod({accounts: this.formData.acctIds, stocks: this.formData.secCodes})) { /* 批量校验证券代码格式 */
            return
          }
          this.$store.commit(`storeForm${this.num}`, JSON.parse(JSON.stringify(this.formData)))
        }
      })
    }
  },
  mounted() {
  }
}
</script>
<style lang='less' scoped></style>
