<!--参与者查询账户类型-->
<template>
  <div class="profitType">
    <el-form-item
      prop="profitType"
      label="类型 :">
      <el-col :span="19">
        <el-select
          v-model="profitType"
          @change="profitTypeChange"
          size="small"
          :disabled="codeUploadDisabled"
          style="width: 100%;">
          <el-option
            v-for="item in profitTypeOptions"
            :disabled="item.value=='member' || item.value=='pbu'"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-form-item>
  </div>
</template>
<script>
  import { getQueryType } from '../../../service/analysisTool/participatorType/index'

  export default {
    name: 'profitTypes',
    data () {
      return {
        profitType: 'account', // 账户
        profitTypeOptions: [
          {
            value: 'account',
            text: '账户'
          }
        ],
        codeUploadDisabled: false
      }
    },
    props: {},
    methods: {
      profitTypeChange () {
        let objProfitType = {
          uploadCode: this.profitType,
          profitTypeOptions: this.profitTypeOptions
        }
        this.$store.commit('profitTypeStatus', objProfitType)
        // this.$emit('profitTypeData',this.profitType)
      },
      profitTypeData () {
        getQueryType('particiLevel', 'statis').then(resp => {
          this.profitTypeOptions = resp
          // 默认选择账户类型
          this.accountType = this.profitTypeOptions[0].value
          this.profitType = this.profitTypeOptions[0].value
        })
      }
    },
    watch: {
      // profitType(val){
      //   console.log(val);
      // }
    },
    mounted () {
      this.profitTypeData()
    }
  }
</script>
<style lang="less">
  .profitType {

  }

</style>
