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
      <el-form :model="selectParams" ref="selectParams" :rules="rules" label-position="left" label-width="100px"
               style="margin-top: 20px;">
        <el-row>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="起止时间" prop="selectTradeDate">
              <el-date-picker v-model="selectParams.selectTradeDate"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              format="yyyyMMdd" value-format="yyyyMMdd"
                              size="small"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="账户" prop="accountId">
              <el-input v-model="selectParams.accountId" class="el-form-input" size="small"></el-input>
              <text-upload style="display: inline-block;" :uploadOption="uploadOption" @getTxtCon="getTxtData1"></text-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import MinxinVue from '../Mixin'

  export default {
    name: 'query-conditions',
    props: [],
    components: {
      TextUpload: () => import('@/components/common/textUpload')
    },
    mixins: [MinxinVue],
    data () {
      return {
        selectParams: {
          accountId: '',
          selectTradeDate: []
        },
        rules: {
          selectTradeDate: [
            {type: 'array', required: true, message: '请选择起止时间', trigger: 'change'}
          ],
          accountId: [
            {type: 'string', required: true, message: '请输入账户', trigger: 'change'}
          ]
        },
        uploadOption: {
          name: '导入', size: 'small'
        }
      }
    },
    computed: {},
    watch: {
      tradeDate () {
        this.selectParams.selectTradeDate = [this.tradeDate, this.tradeDate]
      }
    },
    methods: {
      getTxtData1 (val) {
        this.selectParams.accountId = val.join(',')
      },
      select () {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            this.$emit('select', this.selectParams)
          }
        })
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
