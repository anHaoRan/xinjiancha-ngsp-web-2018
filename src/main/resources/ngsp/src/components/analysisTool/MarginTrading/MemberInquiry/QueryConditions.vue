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
            <el-form-item label="时间类别">
              <el-select v-model="selectParams.dateType" size="small">
                <el-option
                  label="带时间"
                  value="1"/>
                <el-option
                  label="不带时间"
                  value="2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24" v-if="selectParams.dateType==='1'">
            <el-form-item label="起止时间" prop="selectTradeDate">
              <el-date-picker v-model="selectParams.selectTradeDate"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              format="yyyyMMdd HHmmss" value-format="yyyyMMdd HHmmss"
                              @change="handlerChange"
                              size="small"/>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24" v-else>
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
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import MinxinVue from '../Mixin'
  import moment from 'moment'

  export default {
    name: 'query-conditions',
    props: [],
    components: {},
    mixins: [MinxinVue],
    data () {
      return {
        selectParams: {
          dateType: '1',
          selectTradeDate: []
        },
        rules: {
          selectTradeDate: [
            {type: 'array', required: true, message: '请选择起止时间', trigger: 'change'}
          ]
        }
      }
    },
    computed: {},
    watch: {
      tradeDate () {
        this.initTradeDate()
      },
      'selectParams.dateType': function (val) {
        let map = {
          1: () => {
            this.initTradeDate()
          },
          2: () => {
            this.initTradeDate(true)
          }
        }
        map[val]()
      }
    },
    methods: {
      select () {
        this.$refs['selectParams'].validate(valid => {
          if (valid) {
            if (this.selectParams.dateType === '1') {
              let {selectTradeDate} = this.selectParams,
                [dateStart] = selectTradeDate[0].split(' '),
                [dateEnd] = selectTradeDate[1].split(' ')
              if (!moment(dateStart).isSame(dateEnd)) {
                this.$message.warning('当时间类别为带时间时，该功能不支持跨日查询')
                return
              }
            } else {
              let {selectTradeDate} = this.selectParams,
                dateEnd = selectTradeDate[1]
              if (!moment(dateEnd).isBefore(moment().format('YYYYMMDD'))) {
                this.$message.warning('结束日期不能大于等于今天')
                return
              }
            }
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
