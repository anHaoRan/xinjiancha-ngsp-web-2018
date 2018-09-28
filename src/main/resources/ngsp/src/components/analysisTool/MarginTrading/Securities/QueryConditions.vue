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
            <el-form-item label="日期" prop="selectTradeDate">
              <el-date-picker v-model="selectParams.selectTradeDate"
                              type="date"
                              placeholder="选择日期"
                              format="yyyyMMdd" value-format="yyyyMMdd"
                              size="small"/>
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
    components: {},
    mixins: [MinxinVue],
    data () {
      return {
        selectParams: {
          selectTradeDate: ''
        },
        rules: {
          selectTradeDate: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ]
        }
      }
    },
    computed: {},
    watch: {
      tradeDate (val) {
        this.selectParams.selectTradeDate = val
      }
    },
    methods: {
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
