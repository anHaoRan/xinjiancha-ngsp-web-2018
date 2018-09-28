<template>
  <div>
    <el-form>
      <el-form-item label="时间范围">
        <el-date-picker v-model="selectDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="yyyyMMdd" value-format="yyyyMMdd"
                        size="small"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="机构类型">
        <el-select v-model="multipleInstitutionsArray" size="small" multiple collapse-tags>
          <el-option :key="data.text" :label="data.text" :value="data.text"
                     v-for="data in institutionsArray"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理标记">
        <el-select v-model="multipleHandleTheMarkup" size="small" multiple collapse-tags>
          <el-option :key="data.dealmark" :label="data.dealmark" :value="data.dealmark"
                     v-for="data in handleTheMarkup"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="exportTag">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    request,
    dealMarkDefine
  } from '@/service/marketStability'
  import { transactionSelect } from '@/service/analysisTool/productQuery'
  // import moment from 'moment'
  window.document.title = '已提醒账户一览表数据导出'
  export default {
    components: {},
    name: 'processing-tag-export',
    data () {
      return {
        selectDate: [],
        institutionsArray: [],
        multipleInstitutionsArray: [],
        multipleHandleTheMarkup: ['已电话提醒'],
        handleTheMarkup: []
      }
    },
    mounted () {
      this.getDealMarkDefine()
      let date = this.$route.params.tradedate
      // if (moment(this.$route.params.tradedate).day() >= 5) {
      //   date = moment(this.$route.params.tradedate).subtract(1, 'days').format('YYYYMMDD')
      // } else if (moment(this.$route.params.tradedate).day() == 0) {
      //   date = moment(this.$route.params.tradedate).subtract(2, 'days').format('YYYYMMDD')
      // } else if (moment(this.$route.params.tradedate).day() == 1) {
      //   date = moment(this.$route.params.tradedate).subtract(3, 'days').format('YYYYMMDD')
      // }
      this.selectDate = [date, date]
    },
    methods: {
      getDealMarkDefine () {
        transactionSelect('investorType', 'stability')
        .then((res) => {
          this.institutionsArray = res
        })
        dealMarkDefine().then((res) => {
          this.handleTheMarkup = res
        })
      },
      ajaxAccoutCompanyMarkedExport () {
        let arr = this.multipleInstitutionsArray
        let arr2 = this.multipleHandleTheMarkup
        console.log(`${request}/account-market-stability/v1/accout-company-marked-export?dateStart=${this.selectDate[0]}&dateEnd=${this.selectDate[1]}&investorType=${arr.length > 0 ? arr.join(',') : 'all'}&markerText=${arr2.join(',')}&actorType=${this.$route.params.type}`)
        window.open(`${request}/account-market-stability/v1/accout-company-marked-export?dateStart=${this.selectDate[0]}&dateEnd=${this.selectDate[1]}&investorType=${arr.length > 0 ? arr.join(',') : 'all'}&markerText=${arr2.join(',')}&actorType=${this.$route.params.type}`)
      },
      exportTag () {
        if (this.selectDate.length < 1) {
          this.$message.error('请选择时间')
          return
        }
        this.ajaxAccoutCompanyMarkedExport()
      }
    }
  }
</script>

<style scoped>

</style>
