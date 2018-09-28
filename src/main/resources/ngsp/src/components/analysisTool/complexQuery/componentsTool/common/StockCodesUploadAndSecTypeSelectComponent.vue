<template>
  <div class="stockCodesUploadAndSecTypeSelectComponent">
    <el-row>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item label="统计对象：" :rules="[{
          required: true, message: ' '
        }]">
          <el-radio-group v-model="secTypeAll" @change="handleRadioSelectChange">
            <el-radio :label="2">按证券大类选择</el-radio>
            <br>
            <el-radio :label="0" style="margin-top: 20px;">证券代码输入或上传</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xl="12" :lg="12" :md="12" :sm="24">
        <el-form-item prop="secType" :rules="[{
          validator: validateSecCodes
        }]">
          <el-col v-show="Number(secTypeAll) === 0">
            <el-col :xl="19" :lg="20" :md="20" :sm="20">
              <aggregate-stock-code-query :commonData="commonData"
                                          @getStockCode="getStockCode"></aggregate-stock-code-query>
            </el-col>
            <el-col :xl="4" :lg="3" :md="3" :sm="4" :offset="1">
              <text-upload :uploadOption="uploadOption" @getTxtCon="getSecurityTxtData" :uploadParams="uploadParams" :isShowSuccessMessage="true"></text-upload>
            </el-col>
          </el-col>
          <el-col v-show="Number(secTypeAll) === 2" class="line-height32">
            <el-checkbox-group v-model="chosenTypeList" @change="handleCheckboxSelectChange">
              <el-checkbox v-for="item in typeList" :key="item.value" :label="item.value"> {{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import TextUpload from '@/components/common/textUpload'
import AggregateStockCodeQuery from '../AggregateStockCodeQuery'
export default {
  components: {
    TextUpload,
    AggregateStockCodeQuery
  },
  props: {
    uploadParams: {
      type: Object,
      default() {
        return {
          parseRule: JSON.stringify(
            {
              delimiter: ',',
              verifies: ['STOCK_CODE_SH']
            }
          )
        }
      }
    }
  },
  data () {
    return {
      secTypeAll: 0, // 默认按证券大类选择：2； 0：按证券代码
      chosenTypeList: [], // 按证券类型选择结果集
      typeList: [ // 按证券类型
        {name: '股票', value: '100'},
        {name: '债券', value: '010'},
        {name: '基金', value: '001'}
      ],
      uploadOption: {
        loading: false,
        name: '上传',
        size: 'small'
      },
      commonData: { // 证券代码
        disabled: false,
        stockCode: '',
        list: [] // 存储上传证券代码
      },
      secCodes: ''
    }
  },
  methods: {
    validateSecCodes (rule, value, callback) {
      if (String(this.secTypeAll) === '0') {
        if (!this.secCodes) {
          callback(new Error('请输入证券代码'))
        }
      } else {
        if (!this.chosenTypeList.length) {
          callback(new Error('请选择证券大类'))
        }
      }
      callback()
    },
    clearStockCodes () {
      this.commonData.list = []
      this.commonData.stockCode = ''
      this.secCodes = ''
    },
    getStockCode (...rest) {
      this.secCodes = rest[0]
      this.$emit('getStockCode', rest[0])
    },
    getSecurityTxtData (TxtData) { // 证券代码上传
      this.commonData.list = [...new Set(TxtData)]
    },
    handleRadioSelectChange () {
      this.$emit('handleSecTypeAndChosenTypeListChange', this.secTypeAll, this.specDealChosenTypeList())
    },
    dealChosenTypeList (chosenTypeList) {
      if (chosenTypeList.length) {
        return chosenTypeList.reduce((prev, curr) => {
          return prev ^ curr
        })
      }
      return ''
    },
    specDealChosenTypeList () {
      let chosenTypeList = this.dealChosenTypeList(this.chosenTypeList)
      if (chosenTypeList === 11) {
        return '011'
      }
      return chosenTypeList
    },
    handleCheckboxSelectChange () {
      this.$emit('handleSecTypeAndChosenTypeListChange', this.secTypeAll, this.specDealChosenTypeList())
    }
  }
}
</script>
<style lang="less" scoped>
  .stockCodesUploadAndSecTypeSelectComponent {

  }
</style>
