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
            <el-form-item label="融资买入成交额比门限（%）" prop="FBuyOverRatio">
              <el-input v-model="selectParams.FBuyOverRatio" class="el-form-input" placeholder="5位小数"
                        size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="12" :md="12" :sm="24">
            <el-form-item label="融券卖出成交量比门限（%）" prop="FSaleOverRatio">
              <el-input v-model="selectParams.FSaleOverRatio" class="el-form-input" placeholder="5位小数"
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
          FBuyOverRatio: '0.10000',
          FSaleOverRatio: '0.10000'
        },
        rules: {
          FBuyOverRatio: [
            pattern
          ],
          FSaleOverRatio: [
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
