<template>
  <div class="textAreaCodesAndUploadComponent">
    <el-row>
      <el-col :xl="19" :lg="20" :md="20" :sm="20">
        <textarea-code-list :settings="settingData" @throwData="getTextareaCodeList"></textarea-code-list>
      </el-col>
      <el-col :xl="4" :lg="3" :md="3" :sm="4" :offset="1">
        <text-upload :uploadOption="uploadOption" @getTxtCon="getUploadData" :uploadParams="uploadParams" :isShowSuccessMessage="true"></text-upload>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import TextUpload from '@/components/common/textUpload'
  import TextareaCodeList from '../TextareaCodeList'

  export default {
    components: {
      TextUpload,
      TextareaCodeList
    },
    props: {
      codeType: {
        type: String,
        default: ''
      },
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
        this.settingData.list = this.initList
      }
    },
    data () {
      let codeType = this.codeType
      return {
        settingData: {
          rows: 7,
          isDisabled: false,
          placeholder: `请输入${codeType === 'account' ? '账户代码' : codeType === 'stock' ? '证券代码' : codeType === 'accountA' ? '账户组A代码' : codeType === 'accountB' ? '账户组B代码' :  codeType === 'queryInfo' ? '查询信息' : ''}`,
          list: [] // 存储上传代码list
        },
        uploadOption: {
          loading: false,
          name: '上传',
          size: 'small'
        }
      }
    },
    methods: {
      clearCodeList () {
        this.settingData.list = []
      },
      getTextareaCodeList (data) {
        this.$emit('getTextareaCodeList', data.join(','), this.codeType)
      },
      getUploadData (TxtData) {
        this.settingData.list = TxtData
      }
    },
    mounted() {
      this.settingData.list = this.initList
    }
  }
</script>
<style lang="less" scoped></style>
