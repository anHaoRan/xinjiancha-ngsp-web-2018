<template>
  <div class="output-result-set">
    <s-table ref="earlyWarningTable" headerTitle="查询结果" :columns="columns" :data="totalData"
             :page-sizes="[10, 20, 30]"
             :loading="loading"
             :isExport="!!this.totalData.total"
             @getExport="handlerGetExport"
             @getPageination="getPageination">
    </s-table>
  </div>
</template>

<script>
  import GoDetail from '../Components/GoDetail'
  import { getAlarm, countTableExport } from '@/service/knowledgeBase/EarlyWarningHistory/Index'
  import moment from 'moment'

  export default {
    name: 'output-result-set',
    props: {},
    components: {
      STable: () => import('@/components/base/STable')
    },
    mixins: [],
    data () {
      return {
        loading: false,
        columns: [
          {
            field: 'alarm_id',
            align: 'center',
            width: '80',
            label: '编号',
            template: GoDetail
          },
          {field: 'alarm_date', align: 'left', width: '80', label: '预警日期'},
          {field: 'alarm_time', align: 'left', width: '80', label: '预警时间'},
          {field: 'board_name', align: 'left', width: '80', label: '板块'},
          {field: 'alarm_type', align: 'left', width: '80', label: '预警类型'},
          {field: 'seccode_name', align: 'left', width: '120', label: '证券代码及简称'},
          {field: 'watch_ob_name', align: 'left', width: '80', label: '监控对象'},
          {field: 'alarm_level', align: 'left', width: '80', label: '预警级别'},
          {field: 'alarm_rule_name', align: 'left', width: '80', label: '预警规则名称'},
          {field: 'alarm_desc', align: 'left', width: '80', label: '预警说明'},
          {field: 'operator_name', align: 'left', width: '80', label: '处理人'},
          {field: 'alarm_proc_date', align: 'left', width: '80', label: '处理日期'},
          {field: 'alarm_proc_time', align: 'left', width: '80', label: '处理时间'},
          {field: 'alarm_proc_advice', align: 'left', width: '80', label: '处理结论'}
        ],
        totalData: {
          data: [],
          total: 0,
          pageRows: 10,
          pageIndex: 1
        },
        selectParams: {},
        lastSelectParams: {}
      }
    },
    computed: {},
    watch: {
      selectParams: {
        handler () {
          this.totalData = {
            data: [],
            total: 0,
            pageRows: 10,
            pageIndex: 1
          }
          this.ajaxGetAlarm()
        },
        deep: true
      }
    },
    methods: {
      ajaxGetAlarm () {
        let {selectDateRange, selectTimePicker, securitiesCode, selectPlate, selectAlarmType, selectAlarmLevel, selectDealer, selectConclusion, keyWorld} = this.selectParams
        let params = {
          pageIndex: this.totalData.pageIndex,
          pageRows: this.totalData.pageRows,
          alarmDateStart: selectDateRange ? selectDateRange[0] : moment(new Date()).format('YYYY-MM-DD'),
          alarmDateEnd: selectDateRange ? selectDateRange[1] : moment(new Date()).format('YYYY-MM-DD'),
          alarmTimeStart: selectTimePicker ? selectTimePicker[0] : '',
          alarmTimeEnd: selectTimePicker ? selectTimePicker[1] : '',
          isinCode: securitiesCode || '',
          insType: selectPlate || '',
          alarmType: selectAlarmType || '',
          alarmLevel: selectAlarmLevel || '',
          operatorID: selectDealer || '',
          alarmStatus: selectConclusion || '',
          keyWorld: keyWorld || ''
        }
        this.lastSelectParams = params
        this.loading = true
        // this.$refs.earlyWarningTable.showOrHideLoading(true)
        getAlarm(params).then(res => {
          // this.$refs.earlyWarningTable.showOrHideLoading(false)
          this.loading = false
          let {bizData: {metaData, totalRows}} = res
          this.totalData.data = metaData
          this.totalData.total = totalRows
        })
      },
      getPageination (pageinationVal) {
        this.totalData.pageRows = pageinationVal.pageSizeNumber
        this.totalData.pageIndex = pageinationVal.currentPage
        this.ajaxGetAlarm()
      },
      handlerGetExport (exportParams) {
        this.createElementA(countTableExport(), exportParams)
      },
      createElementA (url, exportParams) {
        delete this.lastSelectParams.pageIndex
        delete this.lastSelectParams.pageRows
        let params = this.lastSelectParams
        params.type = 'alarm'
        for (let key in exportParams) {
          params[key] = exportParams[key]
        }
        console.log(JSON.stringify(params))
        this.gfnExportFileWithForm(url, params)
      }
    },
    created () {
    },
    mounted () {
      this.ajaxGetAlarm()
    },
    beforeDestroy () {
    }
  }
</script>
<style lang="less" scoped>
  .output-result-set {
  }
</style>
