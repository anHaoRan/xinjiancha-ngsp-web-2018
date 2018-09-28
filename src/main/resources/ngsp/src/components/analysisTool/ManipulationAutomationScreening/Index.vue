<template>
  <div class="manipulation-automation-screening">
    <breadcrumb :breadcrumbList="breadcrumbItems"></breadcrumb>
    <query-conditions
      ref="queryConditions" @selectAccountSummary="select"
      v-loading="isLoading"
      element-loading-text="数据加载中，请耐心等待..."
      element-loading-background="rgba(0,0,0,0.3)"/>
    <div v-if="isShow"
         v-loading="isLoading"
         element-loading-text="数据加载中，请耐心等待..."
         element-loading-background="rgba(0,0,0,0.3)">
      <account-summary ref="accountSummary" :firstData="firstData['chkResTotal']" :selectDate="selectDate"/>
      <first-screening-list ref="firstScreeningList" :firstData="firstData"/>
    </div>
  </div>
</template>

<script>
  import { analysisAcctScreen } from '@/service/analysisTool/ManipulationAutomationScreening/index'

  export default {
    name: 'manipulation-automation-screening',
    props: {},
    components: {
      breadcrumb: () => import('@/components/common/Breadcrumb'),        // 面包屑组件
      QueryConditions: () => import('./components/QueryConditions'),
      AccountSummary: () => import('./components/AccountSummary'),
      FirstScreeningList: () => import('./components/FirstScreeningList')
    },
    mixins: [],
    data () {
      return {
        // 面包屑路由
        breadcrumbItems: [{
          router: '',
          label: '分析工具1'
        }, {
          router: '',
          label: '特定工具'
        }, {
          router: '/manipulationAutomationScreening/{}',
          label: '操纵类自动化初筛'
        }],
        selectParams: {},
        isShow: false,
        isLoading: false,
        firstData: {},
        selectDate: []
      }
    },
    computed: {
      lastSelectParams: function () {
        return JSON.parse(JSON.stringify(this.$store.getters.getLastSelectParams))
      }
    },
    watch: {},
    methods: {
      select (selectParams) {          
        this.firstData['chkResTotal'] = [] // 清空之前的数据      
        this.firstData = {} // 清空之前的数据
        this.selectParams = JSON.parse(JSON.stringify(selectParams))
        this.selectDate = this.selectParams.selectTradeDate
        this.dealQuery()
      },
      dealQuery () {
        let {
          indexCode,
          selectTradeDate,
          accountCode,
          condition,
          condition1_1, // eslint-disable-line
          condition1_2, // eslint-disable-line
          condition1_3, // eslint-disable-line
          condition1_4, // eslint-disable-line
          condition2_1, // eslint-disable-line
          condition2_2, // eslint-disable-line
          condition2_3, // eslint-disable-line
          condition3_1, // eslint-disable-line
          condition4_1, // eslint-disable-line
          condition5_1, // eslint-disable-line
          condition6_1, // eslint-disable-line
          condition7_1  // eslint-disable-line
        } = this.selectParams
        let params = {
            stockCode: indexCode,
            checkStartTime: selectTradeDate[0],
            checkEndTime: selectTradeDate[1],
            accountArr: accountCode,
            checkChg1: 0,
            checkChg2: 0,
            checkChg3: 0,
            checkChg4: 0,
            checkChg5: 0,
            checkChg6: 0,
            checkChg7: 0,
            isNewQuery: 0,
            isExport: 0,
            pageIndex: 1,
            pageRows: 10,
            resType: 'ALL'
          },
          map = {
            1: {
              chk1PV: condition1_1,
              chk1BS: condition1_2,
              chk1Rank: condition1_3,
              chk1Val: condition1_4
            },
            2: {
              chk2DayPV: condition2_1,
              chk2DayBS: condition2_2,
              chk2DayRank: condition2_3
            },
            3: {
              chk3DayMktRank: condition3_1
            },
            4: {
              chk4MktVal: condition4_1
            },
            5: {
              chk5CnAcct: condition5_1
            },
            6: {
              chk6IsCCRC: condition6_1
            },
            7: {
              chk7IsMonit: condition7_1
            }
          }
        for (let item of condition) {
          params['checkChg' + item] = 1
          Object.assign(params, map[item])
        }
        //  是否一次新的查询  ：默认0，当改变输入元素或内容传1
        if (JSON.stringify(this.lastSelectParams) !== '{}' && (JSON.stringify(this.lastSelectParams) !== JSON.stringify(params))) {
          console.log('是否一次新的查询', '是')
          params.isNewQuery = 1
        }
        this.ajaxAnalysisAcctScreen(params)
      },
      ajaxAnalysisAcctScreen (params) {
        this.isLoading = true
        analysisAcctScreen(params).then(resp => {
          this.isLoading = false
          this.isShow = true
          let {res, cnt, qryId} = resp,
            map = {}
          params.qryId = qryId
          this.$store.commit('setLastSelectParams', params)
          for (let key in res) {
            map[key] = {
              data: res[key],
              total: cnt[key + 'Cnt']
            }
          }
          this.firstData = map
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

<style lang="less">
</style>
