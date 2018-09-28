<!--参与者查[营业部证券代码]-->
<template>
  <div class="salePartCode">
    <el-col :span="24" class="name">
      <el-col :span="1" class="name">
        <span class="mustInput name">*</span>
      </el-col>
      <el-col :span="23">
        <el-form-item prop="salePartCode" label="代码：">
          <el-col :span="20">
            <el-select
              v-model="salePartCode"
              placeholder="请输入证券代码"
              filterable
              remote
              reserve-keyword
              default-first-option
              multiple
              collapse-tags
              @change="salePartCodeChange"
              :remote-method="salePartTemoteMethod"
              :loading="salePartLoading"
              :disabled="salePartCodeDisabled"
              style="width: 100%"
              size="small">
              <el-option
                v-for="salePart in salePartOptions"
                :key="salePart.value"
                :label="salePart.text"
                :value="salePart.value">
                <div>
                  <el-checkbox style="width: 100%"
                               v-model="salePartValue"
                               :label="salePart.value"
                               @change="fnChange">{{salePart.label}}
                  </el-checkbox>
                </div>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-col>
    </el-col>
  </div>
</template>
<script>
  import { getCommonSelect } from '../../../service/analysisTool/participatorType/index'

  export default {
    name: 'salePartCodes',
    data () {
      return {
        salePartCode: '',
        salePartOptions: [],
        salePartValue: [],
        currentSelectList: [],
        salePartLoading: true,
        salePartCodeDisabled: false
      }
    },
    props: {},
    methods: {
      salePartCodeChange (val) {
        let selectVal = []
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.salePartOptions.length; j++) {
            if (this.salePartOptions[j].value === val[i]) {
              selectVal.push(this.salePartOptions[j])
            }
          }
        }
        this.currentSelectList = selectVal

        let objCodeSalePart = {
          uploadCode: this.currentSelectList,
          salePartCodeDisabled: false
        }
        this.$store.commit('codeSalePartStatus', objCodeSalePart)
        // this.$emit('salePartCodeData',this.salePartCode,this.salePartOptions[0].type,this.currentSelectList)
      },
      salePartTemoteMethod (query) {
        if (query !== '') {
          this.salePartLoading = true
          getCommonSelect('salePart', query, 1, 100).then((resp) => {
            this.salePartCodeList = []
            resp.forEach((el) => {
              let objVal = {
                value: el.partici_id,
                text: el.partici_name
              }
              this.salePartCodeList.push(objVal)
            })
            let curArr = this.currentSelectList
            if (!$.isEmptyObject(curArr)) {
              for (let i = 0; i < curArr.length; i++) {
                for (let j = 0; j < this.salePartCodeList.length; j++) {
                  if (this.salePartCodeList[j].value === curArr[i].value) {
                    this.salePartCodeList.splice(j, 1)
                  }
                }
              }
              this.salePartCodeList = curArr.concat(this.salePartCodeList)
            }
            this.salePartOptions = this.salePartCodeList
            this.salePartLoading = false
          })
        } else {
          this.salePartOptions = []
        }
      }
    },
    watch: {
      // salePartCodeChange(val){
      //   console.log(val);
      // }
    },
    mounted () {}
  }
</script>
<style lang="less">
  .salePartCode {
    .mustInput {
      font-size: 14px;
      color: #ff402b;
      position: relative;
      right: 3px;
      top: 3px;
    }
    .el-select .el-tag {
      margin: 3px 0 3px 3px !important;
    }
  }

</style>
