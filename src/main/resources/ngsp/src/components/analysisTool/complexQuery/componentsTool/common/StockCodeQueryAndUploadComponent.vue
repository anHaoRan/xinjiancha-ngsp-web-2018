<template>
  <el-row>
    <el-col :xl="22" :lg="22" :md="22" :sm="24">
      <el-col :xl="19" :lg="20" :md="20" :sm="20">
        <aggregate-stock-code-query :commonData="commonData" @getStockCode="getStockCode"></aggregate-stock-code-query>
      </el-col>
      <el-col :xl="4" :lg="3" :md="3" :sm="4" :offset="1">
        <text-upload :uploadOption="uploadOption" @getTxtCon="getSecurityTxtData" :uploadParams="uploadParams" :isShowSuccessMessage="true"></text-upload>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
  import AggregateStockCodeQuery from '../AggregateStockCodeQuery'
  import TextUpload from '@/components/common/textUpload'

  export default {
    components: {
      AggregateStockCodeQuery,
      TextUpload
    },
    props: {
      initList: {
        type: Array,
        default() {
          return []
        }
      },
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
    watch: {
      initList() {
        this.commonData.list = this.initList
      }
    },
    data () {
      return {
        uploadOption: {
          loading: false,
          name: '上传',
          size: 'small'
        },
        commonData: { // 证券代码
          disabled: false,
          stockCode: '',
          list: [] // 存储上传证券代码
        }
      }
    },
    methods: {
      clearStockCodes () {
        this.commonData.list = []
        this.commonData.stockCode = ''
      },
      getStockCode (...rest) {
        let stocks = [...new Set(rest[0].split('\n'))].join(',')
        this.$emit('getStockCode', stocks)
      },
      getSecurityTxtData (TxtData) { // 证券代码上传
        this.commonData.list = [...new Set(TxtData)]
      }
    },
    mounted() {
      this.commonData.list = this.initList
    }
  }
</script>
