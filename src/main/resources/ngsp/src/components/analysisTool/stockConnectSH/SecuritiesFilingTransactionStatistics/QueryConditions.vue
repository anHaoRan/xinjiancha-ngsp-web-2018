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
            <el-form-item label="证券代码" prop="indexCode">
              <select-lazy-multiple :selectParams="selectParams1" @getSelectRes="getSelectRes"
                                    style="display: inline-block;" ref="selectLazyMultiple"/>
              <text-upload :uploadOption="uploadOption" style="display: inline-block;"
                           @getTxtCon="getTxtData"></text-upload>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :md="12" :sm="24">
            <el-form-item label="起止时间" prop="selectTradeDate">
              <el-date-picker v-model="selectParams.selectTradeDate"
                              @change="changeQueryDateCondition"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :default-time="['09:00:00','17:00:00']"
                              unlink-panels
                              size="small"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import { getCurTradeDate } from '@/service/common/commonFunc'

  export default {
    name: 'query-conditions',
    props: [],
    components: {
      TextUpload: () => import('@/components/common/textUpload'),
      SelectLazyMultiple: () => import('@/components/common/SelectLazyMultiple')
    },
    mixins: [],
    data () {
      return {
        selectParams: {
          indexCode: '',
          selectTradeDate: []
        },
        //  产品类型代码
        selectParams1: {
          query: '',
          loading: false,
          selectStockCodeVal: [],
          selectCheckboxValue: [],
          particLevelType: 'stockCode'
        },
        uploadOption: {
          loading: false,
          name: '导入',
          size: 'small'
        },
        rules: {
          selectTradeDate: [
            {type: 'array', required: true, message: '请选择起止时间', trigger: 'change'}
          ]
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      ajaxTradeDate () {
        getCurTradeDate().then(res => {
          let str = moment(res).format('YYYY-MM-DD')
          this.selectParams.selectTradeDate = [str + ' 09:00:00', str + ' 17:00:00']
        })
      },
      changeQueryDateCondition(val){
        let [dateStart, timeStart] = val[0].split(' '),
        [dateEnd, timeEnd] = val[1].split(' ')
        if (timeStart === '00:00:00') {
          this.selectParams.selectTradeDate[0] = dateStart + ' 09:00:00'
        }
        if (timeEnd === '00:00:00') {
          let nowDate = moment(new Date()).format('YYYY-MM-DD')
          if (nowDate === dateEnd) {
            this.selectParams.selectTradeDate[1] = dateEnd + ' ' + moment(new Date()).format('HH:mm:ss')
          } else {
            this.selectParams.selectTradeDate[1] = dateEnd + ' 17:00:00'
          }
        }
      },
      getTxtData (val) {
        this.selectParams1.query = val
        this.$refs.selectLazyMultiple.getUploadSelectOptionCon(val)
      },
      getSelectRes (val) {
        this.selectParams.indexCode = val.join(',')
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
      this.ajaxTradeDate()
    },
    mounted () {
    },
    beforeDestroy () {
    }
  }
</script>

<style lang="less" scoped>
</style>
