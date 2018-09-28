<template>
    <div class="query-conditions">
        <el-card>
            <div slot="header" class="clearfix">
                <span>查询条件</span>
                <el-button
                        type="primary"
                        size="small"
                        @click="select()">查询
                </el-button>
            </div>
            <el-form :model="selectParams" ref="selectParams" :rules="rules" label-position="left" label-width="210px"
                     style="margin-top: 20px;">
                <el-row>
                    <el-col :xl="12" :md="12" :sm="24">
                        <el-form-item label="单只融资交易过量门限（%）" prop="smRadioLimit">
                            <el-input v-model="selectParams.smRadioLimit" @blur="handlerBlur('smRadioLimit')" class="el-form-input" placeholder="5位小数"
                                      size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="12" :md="12" :sm="24">
                        <el-form-item label="单只融券交易过量门限（%）" prop="ssRadioLimit">
                            <el-input v-model="selectParams.ssRadioLimit" @blur="handlerBlur('ssRadioLimit')" class="el-form-input" placeholder="5位小数"
                                      size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="12" :md="12" :sm="24">
                        <el-form-item label="全市融资交易过量门限（%）" prop="amRadioLimit">
                            <el-input v-model="selectParams.amRadioLimit" @blur="handlerBlur('amRadioLimit')" class="el-form-input" placeholder="5位小数"
                                      size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xl="12" :md="12" :sm="24">
                        <el-form-item label="全市融券交易过量门限（%）" prop="asRadioLimit">
                            <el-input v-model="selectParams.asRadioLimit" @blur="handlerBlur('asRadioLimit')" class="el-form-input" placeholder="5位小数"
                                      size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>

<script>

  export default {
    name: 'query-conditions',
    props: [],
    components: {},
    mixins: [],
    data () {
      let pattern = {type: 'string', pattern: /^\d+\.\d{5}$/, required: true, message: '请输入正确的数值', trigger: 'blur'}
      return {
        selectParams: {
          smRadioLimit: '20.00000',
          ssRadioLimit: '20.00000',
          amRadioLimit: '20.00000',
          asRadioLimit: '20.00000'
        },
        rules: {
          smRadioLimit: [
            pattern
          ],
          ssRadioLimit: [
            pattern
          ],
          amRadioLimit: [
            pattern
          ],
          asRadioLimit: [
            pattern
          ]
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      select () {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            this.$emit('select', this.selectParams)
          }
        })
      },
      handlerBlur(key){
        this.$set(this.selectParams,key,Number(this.selectParams[key]).toFixed(5).toString())
      }
    },
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
</style>
